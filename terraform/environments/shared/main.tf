# Century 360 Shared Environment - Terraform Configuration
# =====================================================
# Shared infrastructure for Test and UAT environments

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
    key                  = "shared.tfstate"
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
  description = "Environment name (test or uat)"
  type        = string
  validation {
    condition     = contains(["test", "uat"], var.environment)
    error_message = "Environment must be either 'test' or 'uat'."
  }
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

# Resource Group
resource "azurerm_resource_group" "shared" {
  name     = "century360-shared-rg"
  location = var.location
  
  tags = {
    Environment = "shared"
    Project     = "Century360"
    ManagedBy   = "Terraform"
    Purpose     = "Test and UAT environments"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "shared" {
  name                = "century360-shared-vnet"
  resource_group_name = azurerm_resource_group.shared.name
  location            = azurerm_resource_group.shared.location
  address_space       = ["10.1.0.0/16"]
  
  tags = {
    Environment = "shared"
    Project     = "Century360"
  }
}

# Subnet for AKS
resource "azurerm_subnet" "aks" {
  name                 = "aks-subnet"
  resource_group_name  = azurerm_resource_group.shared.name
  virtual_network_name = azurerm_virtual_network.shared.name
  address_prefixes     = ["10.1.1.0/24"]
}

# AKS Cluster (shared between test and UAT)
resource "azurerm_kubernetes_cluster" "shared" {
  name                = "century360-shared-cluster"
  location            = azurerm_resource_group.shared.location
  resource_group_name = azurerm_resource_group.shared.name
  dns_prefix          = "century360-shared"
  
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
      log_analytics_workspace_id = azurerm_log_analytics_workspace.shared.id
    }
  }
  
  tags = {
    Environment = "shared"
    Project     = "Century360"
    Purpose     = "Test and UAT environments"
  }
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "shared" {
  name                = "century360-shared-logs"
  location            = azurerm_resource_group.shared.location
  resource_group_name = azurerm_resource_group.shared.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Container Registry (shared)
resource "azurerm_container_registry" "shared" {
  name                = "century360sharedacr"
  resource_group_name = azurerm_resource_group.shared.name
  location            = azurerm_resource_group.shared.location
  sku                 = "Standard"
  admin_enabled       = true
}

# Key Vault (shared)
resource "azurerm_key_vault" "shared" {
  name                        = "century360-shared-kv"
  location                    = azurerm_resource_group.shared.location
  resource_group_name         = azurerm_resource_group.shared.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  sku_name                   = "standard"
}

# Shared App Service Plan (Serverless for Test/UAT)
resource "azurerm_app_service_plan" "shared" {
  name                = "century360-shared-plan"
  location            = azurerm_resource_group.shared.location
  resource_group_name = azurerm_resource_group.shared.name
  kind                = "Linux"
  reserved            = true
  
  sku {
    tier = "Dynamic"  # Serverless plan for cost optimization
    size = "Y1"       # Consumption plan
  }
  
  tags = {
    Environment = "shared"
    Project     = "Century360"
    Purpose     = "Test and UAT environments"
  }
}

# Test Environment App Service
resource "azurerm_app_service" "test" {
  count               = var.environment == "test" ? 1 : 0
  name                = "century360-test-app"
  location            = azurerm_resource_group.shared.location
  resource_group_name = azurerm_resource_group.shared.name
  app_service_plan_id = azurerm_app_service_plan.shared.id
  
  site_config {
    linux_fx_version = "DOCKER|${azurerm_container_registry.shared.login_server}/century360:test"
  }
  
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.shared.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.shared.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.shared.admin_password
    "NODE_ENV"                           = "test"
    "NEXT_PUBLIC_APP_ENV"                = "test"
    "DATABASE_URL"                       = "postgresql://postgres:postgres@test-db.century360.azure.com:5432/century360_test"
    "AZURE_TEST_VM_SIZE"                 = "Standard_D4s_v3"
    "AZURE_TEST_VM_LIFETIME"             = "2h"
  }
  
  tags = {
    Environment = "test"
    Project     = "Century360"
    ManagedBy   = "Terraform"
  }
}

# UAT Environment App Service
resource "azurerm_app_service" "uat" {
  count               = var.environment == "uat" ? 1 : 0
  name                = "century360-uat-app"
  location            = azurerm_resource_group.shared.location
  resource_group_name = azurerm_resource_group.shared.name
  app_service_plan_id = azurerm_app_service_plan.shared.id
  
  site_config {
    linux_fx_version = "DOCKER|${azurerm_container_registry.shared.login_server}/century360:uat"
  }
  
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.shared.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.shared.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.shared.admin_password
    "NODE_ENV"                           = "production"
    "NEXT_PUBLIC_APP_ENV"                = "uat"
    "DATABASE_URL"                       = "postgresql://postgres:postgres@uat-db.century360.azure.com:5432/century360_uat"
    "AZURE_TEST_VM_SIZE"                 = "Standard_D8s_v3"
    "AZURE_TEST_VM_LIFETIME"             = "4h"
  }
  
  tags = {
    Environment = "uat"
    Project     = "Century360"
    ManagedBy   = "Terraform"
  }
}

# Application Insights (shared)
resource "azurerm_application_insights" "shared" {
  name                = "century360-shared-ai"
  location            = azurerm_resource_group.shared.location
  resource_group_name = azurerm_resource_group.shared.name
  application_type    = "web"
}

# Data source for current Azure client
data "azurerm_client_config" "current" {}

# Outputs
output "aks_cluster_name" {
  description = "Shared AKS cluster name"
  value       = azurerm_kubernetes_cluster.shared.name
}

output "aks_cluster_id" {
  description = "Shared AKS cluster ID"
  value       = azurerm_kubernetes_cluster.shared.id
}

output "aks_kube_config" {
  description = "Shared AKS kubeconfig"
  value       = azurerm_kubernetes_cluster.shared.kube_config_raw
  sensitive   = true
}

output "container_registry_url" {
  description = "Shared container registry URL"
  value       = azurerm_container_registry.shared.login_server
}

output "test_app_service_url" {
  description = "Test App Service URL"
  value       = var.environment == "test" ? "https://${azurerm_app_service.test[0].default_site_hostname}" : null
}

output "uat_app_service_url" {
  description = "UAT App Service URL"
  value       = var.environment == "uat" ? "https://${azurerm_app_service.uat[0].default_site_hostname}" : null
}

output "key_vault_name" {
  description = "Shared Key Vault name"
  value       = azurerm_key_vault.shared.name
}

output "application_insights_key" {
  description = "Shared Application Insights instrumentation key"
  value       = azurerm_application_insights.shared.instrumentation_key
  sensitive   = true
}
