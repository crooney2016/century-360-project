# 🚀 Azure DevOps Security Quick Start

## 📋 **Setup Checklist**

### ✅ **Immediate Actions**

- [ ] Create Azure DevOps project
- [ ] Set up variable groups (see `azure-devops-variables.md`)
- [ ] Import pipeline YAML files
- [ ] Configure environments (production, staging)
- [ ] Set up service connections

### ✅ **Security Configuration**

- [ ] Configure SonarQube integration
- [ ] Set up security team email notifications
- [ ] Configure approval gates for production
- [ ] Set up security dashboards

## 🔧 **Quick Setup Commands**

### **1. Import Pipelines**

```bash
# In Azure DevOps:
# 1. Go to Pipelines → New Pipeline
# 2. Choose "Azure Repos Git" → Select your repo
# 3. Choose "Existing Azure Pipelines YAML file"
# 4. Select: azure-pipelines.yml
# 5. Repeat for: azure-pipelines-security.yml
```

## **2. Create Variable Groups**

```yaml
# Go to Library → Variable Groups → New Variable Group
# Name: Century360-Security
securityTeamEmail: "security@yourcompany.com"
sonarHostUrl: "https://your-sonarqube-instance.com"
sonarToken: "your-sonarqube-token" # Mark as Secret
```

## **3. Configure Environments**

```yaml
# Go to Environments → New Environment
# Create: production, staging, development
# Add approval gates for production
```

## 🎯 **Key Security Features**

### **Automated Scanning**

- **Dependencies**: pnpm audit + OWASP Dependency Check
- **Code**: ESLint + SonarQube security rules
- **Containers**: Trivy vulnerability scanning
- **Licenses**: Automated license compliance

### **Security Gates**

- **Pre-deployment**: Security scan must pass
- **Approval**: Manual approval for production
- **Post-deployment**: Security verification

### **Reporting**

- **Artifacts**: Security reports in build artifacts
- **Email**: Security team notifications
- **Dashboards**: Security metrics and trends

## 📊 **Monitoring**

### **Pipeline Status**

- Check pipeline runs in Azure DevOps
- Review security scan results
- Monitor build success rates

### **Security Alerts**

- Failed security scans
- High severity vulnerabilities
- License compliance issues

### **Compliance**

- SOC 2 compliance tracking
- Security audit trails
- Vulnerability management

## 🔄 **Maintenance**

### **Weekly**

- Review security scan results
- Update security tools if needed
- Check for new vulnerabilities

### **Monthly**

- Update pnpm version
- Review and update dependencies
- Update security policies

### **Quarterly**

- Update Node.js version
- Review security configurations
- Update compliance documentation

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Pipeline fails on security scan**

- Check for new vulnerabilities
- Update dependencies
- Review security configurations

2. **SonarQube connection fails**

- Verify SonarQube URL and token
- Check network connectivity
- Verify project configuration

3. **Container scan fails**

- Check Docker image availability
- Verify Trivy installation
- Review container security settings

### **Support**

- Azure DevOps documentation
- Security team contacts
- Pipeline configuration guides
