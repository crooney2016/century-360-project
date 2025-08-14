# Azure DevOps Configuration Guide

## 🔧 **Required Variable Groups**

Create these variable groups in your Azure DevOps project:

### **Security Variables Group**

```yaml
# Variable Group: Century360-Security
securityTeamEmail: "security@yourcompany.com"
sonarHostUrl: "https://your-sonarqube-instance.com"
sonarToken: "your-sonarqube-token"
```

## **Build Variables Group**

```yaml
# Variable Group: Century360-Build
nodeVersion: "20.x"
pnpmVersion: "10.14.0"
buildConfiguration: "Release"
```

## **Deployment Variables Group**

```yaml
# Variable Group: Century360-Deployment
productionEnvironment: "production"
stagingEnvironment: "staging"
deploymentTimeout: "30"
```

## 🚀 **Pipeline Setup Instructions**

### 1. **Create Variable Groups**

1. Go to Azure DevOps → Library
2. Create variable groups as shown above
3. Mark sensitive variables as "Secret"

### 2. **Link Variable Groups to Pipelines**

Add to your pipeline YAML:

```yaml
variables:
  - group: Century360-Security
  - group: Century360-Build
  - group: Century360-Deployment
```

### 3. **Configure Environments**

1. Go to Azure DevOps → Environments
2. Create environments: `production`, `staging`, `development`
3. Add approval gates for production deployments

### 4. **Set Up Service Connections**

- **Azure Resource Manager**: For Azure deployments
- **Docker Registry**: For container registries
- **SonarQube**: For code quality analysis

## 📋 **Pipeline Files**

### **Main CI/CD Pipeline**

- `azure-pipelines.yml` - Main build and deployment pipeline
- Triggers on: main, develop branches
- Includes: Security → Build → Deploy stages

### **Security Pipeline**

- `azure-pipelines-security.yml` - Dedicated security scanning
- Scheduled: Weekly on Sundays at 2 AM UTC
- Includes: Dependency, Code, Container security scans

## 🔒 **Security Features**

### **Automated Security Scanning**

- **Dependency Audit**: pnpm audit with OWASP Dependency Check
- **Code Analysis**: ESLint + SonarQube security rules
- **Container Scanning**: Trivy for Docker image vulnerabilities
- **License Compliance**: Automated license checking

### **Security Gates**

- **Pre-deployment**: Security scan must pass
- **Post-deployment**: Security verification
- **Approval Gates**: Manual approval for production

### **Reporting**

- **Artifacts**: Security reports stored as build artifacts
- **Email Notifications**: Security team notifications
- **Dashboards**: Security metrics in Azure DevOps

## 🛠️ **Customization**

### **Add Custom Security Rules**

```yaml
- script: |
    echo "Running custom security checks..."
    # Add your custom security scripts here
  displayName: "Custom Security Checks"
```

### **Integrate with Security Tools**

- **Snyk**: Add Snyk authentication and scanning
- **Checkmarx**: Add Checkmarx SAST scanning
- **Veracode**: Add Veracode static analysis

### **Environment-Specific Security**

```yaml
- stage: Security
  condition:
    and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  # Only run full security scan on main branch
```

## 📊 **Monitoring & Alerts**

### **Pipeline Alerts**

- Failed security scans
- High severity vulnerabilities
- License compliance issues

### **Dashboard Widgets**

- Security scan results
- Vulnerability trends
- Build success rates

### **Integration with Azure Monitor**

- Application Insights for runtime security
- Log Analytics for security event correlation
- Azure Security Center integration

## 🔄 **Maintenance**

### **Regular Updates**

- Update Node.js version quarterly
- Update pnpm version monthly
- Update security tools weekly

### **Backup & Recovery**

- Export pipeline configurations
- Backup variable groups
- Document deployment procedures

### **Compliance**

- SOC 2 compliance tracking
- GDPR data protection
- Industry-specific security standards
