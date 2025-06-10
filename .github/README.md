# 🚀 GitHub Actions CI/CD Pipeline

This repository uses GitHub Actions for automated testing, quality assurance, and deployment.

## 📋 Workflows Overview

### 1. 🚀 CI/CD Pipeline (`ci-cd.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests
- ✅ Frontend & Backend Testing
- 🔒 Security Scanning
- 📦 Dependency Auditing
- 🐳 Docker Build & Push
- 🚀 Automated Deployment

### 2. 🔍 Pull Request Checks (`pr-check.yml`)
**Triggers:** Pull Requests to `main`/`develop`
- 📝 Code Quality Analysis
- 🧪 Comprehensive Testing
- 🔒 Security Validation
- 🐳 Docker Build Testing
- 📋 Automated PR Summary

### 3. 🌙 Nightly Tests (`nightly-tests.yml`)
**Triggers:** Daily at 2 AM UTC, Manual
- 🧪 Multi-Node Version Testing
- ⚡ Performance Analysis
- 🔒 Deep Security Audit
- 📦 Dependency Health Check
- 🐳 Docker Image Analysis

### 4. 📊 Code Quality (`code-quality.yml`)
**Triggers:** Push, PR, Weekly Schedule
- 🔍 SonarCloud Analysis
- 📦 Bundle Size Monitoring
- ⚡ Performance Budget
- 📊 Code Metrics

### 5. 🎉 Release Management (`release.yml`)
**Triggers:** Version Tags, Manual
- ✅ Release Validation
- 🏗️ Production Builds
- 📝 Changelog Generation
- 🎉 GitHub Releases
- 🚀 Production Deployment

## 🔧 Setup Requirements

### Required Secrets
Add these secrets in your GitHub repository settings:

```
DOCKER_ACCESS_TOKEN    # Docker Hub access token
SONAR_TOKEN           # SonarCloud token (optional)
```

### Environment Variables
Configure in workflow files:
```yaml
DOCKER_USERNAME: your-docker-username
NODE_VERSION: '18'
```

## 📊 Quality Gates

### Frontend
- ✅ ESLint validation
- ✅ TypeScript compilation
- ✅ Build success
- ✅ Bundle size limits

### Backend
- ✅ Database connectivity
- ✅ API endpoint validation
- ✅ Dependency security
- ✅ Environment validation

### Security
- 🔒 Vulnerability scanning
- 🔒 Secret detection
- 🔒 Dependency auditing
- 🔒 Docker image scanning

## 🚀 Deployment Strategy

### Environments
1. **Development** - Auto-deploy from `develop` branch
2. **Staging** - Auto-deploy from `main` branch
3. **Production** - Manual approval required

### Docker Images
- `tongnguyen/frontend:latest` - Latest stable frontend
- `tongnguyen/backend:latest` - Latest stable backend
- `tongnguyen/frontend:v1.0.0` - Tagged releases
- `tongnguyen/backend:v1.0.0` - Tagged releases

## 📈 Monitoring & Reports

### Automated Reports
- 📊 Code quality metrics
- 📦 Bundle size analysis
- ⚡ Performance budgets
- 🔒 Security scan results
- 📋 Test coverage reports

### Artifacts
Each workflow generates downloadable artifacts:
- Test results
- Build outputs
- Security reports
- Performance metrics

## 🔄 Workflow Status

| Workflow | Status | Last Run |
|----------|--------|----------|
| CI/CD Pipeline | ![CI/CD](https://github.com/your-repo/actions/workflows/ci-cd.yml/badge.svg) | - |
| PR Checks | ![PR](https://github.com/your-repo/actions/workflows/pr-check.yml/badge.svg) | - |
| Nightly Tests | ![Nightly](https://github.com/your-repo/actions/workflows/nightly-tests.yml/badge.svg) | - |
| Code Quality | ![Quality](https://github.com/your-repo/actions/workflows/code-quality.yml/badge.svg) | - |

## 🛠️ Local Development

### Running Tests Locally
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# Full test suite
npm run test:all
```

### Docker Build Testing
```bash
# Test frontend build
docker build -t test-frontend ./frontend

# Test backend build
docker build -t test-backend ./backend
```

## 📚 Best Practices

### Commit Messages
Use conventional commits for better changelog generation:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

### Pull Requests
- All PRs must pass quality checks
- Require at least one review
- Automatic deployment after merge
- Include description of changes

### Releases
- Use semantic versioning (v1.0.0)
- Tag releases trigger deployment
- Automatic changelog generation
- Docker images tagged with version

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review error logs in Actions tab

**Docker Issues:**
- Verify Docker Hub credentials
- Check Dockerfile syntax
- Ensure base images are available

**Test Failures:**
- Review test output in artifacts
- Check database connectivity
- Verify environment variables

### Getting Help
- Check workflow logs in GitHub Actions tab
- Review artifact downloads for detailed reports
- Contact team for deployment issues
