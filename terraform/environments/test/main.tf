# Century 360 Test Environment - Terraform Configuration
# ====================================================

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
  
  backend "azurerm" {
    resource_group_name  = "century360-terraform-rg"
    storage_account_name = "century360tfstate"
    container_name       = "tfstate"
    key                  = "test.tfstate"
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}

# Variables
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "test"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "aks_node_count" {
  description = "Number of AKS nodes"
  type        = number
  default     = 3
}

variable "aks_vm_size" {
  description = "AKS VM size"
  type        = string
  default     = "Standard_D4s_v3"
}

variable "app_service_sku" {
  description = "App Service Plan SKU"
  type        = string
  default     = "P1v2"
}

variable "vm_lifetime" {
  description = "Test VM lifetime in hours"
  type        = number
  default     = 2
}

variable "test_suite" {
  description = "Test suite to run"
  type        = string
  default     = "integration"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "century360-${var.environment}-rg"
  location = var.location
  
  tags = {
    Environment = var.environment
    Project     = "Century360"
    ManagedBy   = "Terraform"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "century360-${var.environment}-vnet"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  address_space       = ["10.0.0.0/16"]
  
  tags = {
    Environment = var.environment
    Project     = "Century360"
  }
}

# Subnet for AKS
resource "azurerm_subnet" "aks" {
  name                 = "aks-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "main" {
  name                = "century360-${var.environment}-cluster"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "century360-${var.environment}"
  
  default_node_pool {
    name                = "default"
    node_count          = var.aks_node_count
    vm_size             = var.aks_vm_size
    os_disk_size_gb     = 128
    vnet_subnet_id      = azurerm_subnet.aks.id
    enable_auto_scaling = true
    min_count           = 1
    max_count           = 10
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
  }
  
  addon_profile {
    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
    }
  }
  
  tags = {
    Environment = var.environment
    Project     = "Century360"
    Lifetime    = "${var.vm_lifetime}h"
    TestSuite   = var.test_suite
  }
  
  lifecycle {
    ignore_changes = [
      default_node_pool[0].node_count
    ]
  }
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "century360-${var.environment}-logs"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = "century360${var.environment}acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Standard"
  admin_enabled       = true
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                        = "century360-${var.environment}-kv"
  location                    = azurerm_resource_group.main.location
  resource_group_name         = azurerm_resource_group.main.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  sku_name                   = "standard"
}

# App Service Plan
resource "azurerm_app_service_plan" "main" {
  name                = "century360-${var.environment}-plan"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  kind                = "Linux"
  reserved            = true
  
  sku {
    tier = "PremiumV2"
    size = var.app_service_sku
  }
}

# App Service
resource "azurerm_app_service" "main" {
  name                = "century360-${var.environment}-app"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  app_service_plan_id = azurerm_app_service_plan.main.id
  
  site_config {
    linux_fx_version = "DOCKER|${azurerm_container_registry.main.login_server}/century360:latest"
  }
  
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.main.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.main.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.main.admin_password
    "NODE_ENV"                           = "test"
    "NEXT_PUBLIC_APP_ENV"                = var.environment
    "DATABASE_URL"                       = "postgresql://postgres:postgres@test-db.century360.azure.com:5432/century360_${var.environment}"
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "century360-${var.environment}-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"
}

# Data source for current Azure client
data "azurerm_client_config" "current" {}

# Outputs
output "aks_cluster_name" {
  description = "AKS cluster name"
  value       = azurerm_kubernetes_cluster.main.name
}

output "aks_cluster_id" {
  description = "AKS cluster ID"
  value       = azurerm_kubernetes_cluster.main.id
}

output "aks_kube_config" {
  description = "AKS kubeconfig"
  value       = azurerm_kubernetes_cluster.main.kube_config_raw
  sensitive   = true
}

output "container_registry_url" {
  description = "Container registry URL"
  value       = azurerm_container_registry.main.login_server
}

output "app_service_url" {
  description = "App Service URL"
  value       = "https://${azurerm_app_service.main.default_site_hostname}"
}

output "key_vault_name" {
  description = "Key Vault name"
  value       = azurerm_key_vault.main.name
}

output "application_insights_key" {
  description = "Application Insights instrumentation key"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}
