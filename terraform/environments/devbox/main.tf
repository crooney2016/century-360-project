# Century 360 Dev Box Environment - Terraform Configuration
# =======================================================
# Dedicated infrastructure for developer cloud environments

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  
  backend "azurerm" {
    resource_group_name  = "century360-terraform-rg"
    storage_account_name = "century360tfstate"
    container_name       = "tfstate"
    key                  = "devbox.tfstate"
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
variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "dev_name" {
  description = "Developer name for the dev box"
  type        = string
  default     = "developer"
}

variable "dev_email" {
  description = "Developer email"
  type        = string
  default     = "developer@century360.com"
}

# Resource Group
resource "azurerm_resource_group" "devbox" {
  name     = "century360-devbox-rg"
  location = var.location
  
  tags = {
    Environment = "devbox"
    Project     = "Century360"
    ManagedBy   = "Terraform"
    Purpose     = "Developer cloud environments"
    Developer   = var.dev_name
  }
}

# Virtual Network
resource "azurerm_virtual_network" "devbox" {
  name                = "century360-devbox-vnet"
  resource_group_name = azurerm_resource_group.devbox.name
  location            = azurerm_resource_group.devbox.location
  address_space       = ["10.2.0.0/16"]
  
  tags = {
    Environment = "devbox"
    Project     = "Century360"
    Developer   = var.dev_name
  }
}

# Subnet for App Service
resource "azurerm_subnet" "app_service" {
  name                 = "app-service-subnet"
  resource_group_name  = azurerm_resource_group.devbox.name
  virtual_network_name = azurerm_virtual_network.devbox.name
  address_prefixes     = ["10.2.1.0/24"]
  
  delegation {
    name = "app-service-delegation"
    
    service_delegation {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

# Key Vault for dev box secrets
resource "azurerm_key_vault" "devbox" {
  name                        = "century360-devbox-kv"
  location                    = azurerm_resource_group.devbox.location
  resource_group_name         = azurerm_resource_group.devbox.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  sku_name                   = "standard"
  
  tags = {
    Environment = "devbox"
    Project     = "Century360"
    Developer   = var.dev_name
  }
}

# Dev Box App Service Plan (Dedicated for occasional use)
resource "azurerm_app_service_plan" "devbox" {
  name                = "century360-devbox-plan"
  location            = azurerm_resource_group.devbox.location
  resource_group_name = azurerm_resource_group.devbox.name
  kind                = "Linux"
  reserved            = true
  
  sku {
    tier = "Basic"  # Basic plan for cost-effective dev environments
    size = "B1"     # 1 core, 1.75 GB RAM
  }
  
  tags = {
    Environment = "devbox"
    Project     = "Century360"
    Purpose     = "Developer cloud environments"
    Developer   = var.dev_name
  }
}

# Dev Box App Service
resource "azurerm_app_service" "devbox" {
  name                = "century360-${var.dev_name}-devbox"
  location            = azurerm_resource_group.devbox.location
  resource_group_name = azurerm_resource_group.devbox.name
  app_service_plan_id = azurerm_app_service_plan.devbox.id
  
  site_config {
    linux_fx_version = "DOCKER|century360sharedacr.azurecr.io/century360:devbox"
    always_on        = false  # Allow scaling to zero when not in use
  }
  
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://century360sharedacr.azurecr.io"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = "@Microsoft.KeyVault(SecretUri=https://${azurerm_key_vault.devbox.name}.vault.azure.net/secrets/acr-username/)"
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = "@Microsoft.KeyVault(SecretUri=https://${azurerm_key_vault.devbox.name}.vault.azure.net/secrets/acr-password/)"
    "NODE_ENV"                           = "development"
    "NEXT_PUBLIC_APP_ENV"                = "devbox"
    "NEXT_PUBLIC_APP_NAME"               = "Century 360 - Dev Box"
    "NEXT_PUBLIC_APP_URL"                = "https://century360-${var.dev_name}-devbox.azurewebsites.net"
    "DATABASE_URL"                       = "postgresql://postgres:postgres@devbox-db.century360.azure.com:5432/century360_devbox"
    "NEXTAUTH_URL"                       = "https://century360-${var.dev_name}-devbox.azurewebsites.net"
    "NEXTAUTH_SECRET"                    = "@Microsoft.KeyVault(SecretUri=https://${azurerm_key_vault.devbox.name}.vault.azure.net/secrets/nextauth-secret/)"
    "JWT_SECRET"                         = "@Microsoft.KeyVault(SecretUri=https://${azurerm_key_vault.devbox.name}.vault.azure.net/secrets/jwt-secret/)"
    "NEXT_PUBLIC_ENABLE_DEBUG"           = "true"
    "NEXT_PUBLIC_ENABLE_STORYBOOK"       = "true"
    "NEXT_PUBLIC_ENABLE_PRISMA_STUDIO"   = "true"
    "NEXT_PUBLIC_ENABLE_GRAPHQL_PLAYGROUND" = "true"
    "NEXT_PUBLIC_THEME"                  = "glass"
    "NEXT_PUBLIC_ENABLE_GLASS_EFFECTS"   = "true"
    "NEXT_PUBLIC_ENABLE_ANIMATIONS"      = "true"
  }
  
  tags = {
    Environment = "devbox"
    Project     = "Century360"
    Developer   = var.dev_name
    ManagedBy   = "Terraform"
  }
}

# Application Insights for dev box monitoring
resource "azurerm_application_insights" "devbox" {
  name                = "century360-${var.dev_name}-devbox-ai"
  location            = azurerm_resource_group.devbox.location
  resource_group_name = azurerm_resource_group.devbox.name
  application_type    = "web"
  
  tags = {
    Environment = "devbox"
    Project     = "Century360"
    Developer   = var.dev_name
  }
}

# Auto-shutdown schedule for cost optimization
resource "azurerm_automation_schedule" "devbox_shutdown" {
  name                    = "devbox-shutdown-schedule"
  resource_group_name     = azurerm_resource_group.devbox.name
  automation_account_name = azurerm_automation_account.devbox.name
  frequency               = "Day"
  interval                = 1
  timezone                = "America/New_York"
  start_time              = "2024-01-01T18:00:00Z"
  description             = "Auto-shutdown dev box at 6 PM daily"
}

# Automation Account for scheduling
resource "azurerm_automation_account" "devbox" {
  name                = "century360-devbox-automation"
  location            = azurerm_resource_group.devbox.location
  resource_group_name = azurerm_resource_group.devbox.name
  sku_name            = "Basic"
  
  tags = {
    Environment = "devbox"
    Project     = "Century360"
    Developer   = var.dev_name
  }
}

# Data source for current Azure client
data "azurerm_client_config" "current" {}

# Outputs
output "devbox_app_service_url" {
  description = "Dev box App Service URL"
  value       = "https://${azurerm_app_service.devbox.default_site_hostname}"
}

output "devbox_app_service_name" {
  description = "Dev box App Service name"
  value       = azurerm_app_service.devbox.name
}

output "key_vault_name" {
  description = "Dev box Key Vault name"
  value       = azurerm_key_vault.devbox.name
}

output "application_insights_key" {
  description = "Dev box Application Insights instrumentation key"
  value       = azurerm_application_insights.devbox.instrumentation_key
  sensitive   = true
}

output "resource_group_name" {
  description = "Dev box resource group name"
  value       = azurerm_resource_group.devbox.name
}
