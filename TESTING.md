# 🧪 Testing Guide

This document provides comprehensive information about testing in the CNPM Website Đăng Ký Khám Bệnh project.

## 📋 Testing Overview

Our testing strategy includes:
- **Unit Tests** - Individual component/function testing
- **Integration Tests** - API and database testing
- **End-to-End Tests** - Full user workflow testing
- **Security Tests** - Vulnerability and secret scanning
- **Performance Tests** - Bundle size and load testing
- **Code Quality** - Linting and static analysis

## 🚀 Quick Start

### Run All Tests Locally
```bash
# Windows (PowerShell)
npm run test:all

# Linux/macOS (Bash)
npm run test:all:bash

# Individual test suites
npm run test:frontend
npm run test:backend
npm test
```

### Prerequisites
- Node.js 18+
- npm
- Docker (optional, for container testing)

## 🏗️ Project Structure

```
├── frontend/
│   ├── src/
│   ├── package.json          # Frontend dependencies & scripts
│   └── __tests__/            # Frontend tests (future)
├── backend/
│   ├── src/
│   ├── package.json          # Backend dependencies & scripts
│   ├── test.js              # Backend test suite
│   └── __tests__/           # Backend tests (future)
├── scripts/
│   ├── test-all.ps1         # PowerShell test runner
│   └── test-all.sh          # Bash test runner
└── .github/workflows/       # CI/CD pipelines
```

## 🧪 Test Types

### Frontend Tests
- **Linting**: ESLint for code quality
- **Type Checking**: TypeScript compilation
- **Build Testing**: Next.js build validation
- **Bundle Analysis**: Size and performance metrics

```bash
cd frontend
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run build         # Build test
```

### Backend Tests
- **Database Connection**: MySQL connectivity
- **Environment Validation**: Required variables
- **API Structure**: Server file validation
- **Dependency Check**: Critical packages

```bash
cd backend
npm test              # Full backend test suite
```

### Security Tests
- **Secret Scanning**: Detect hardcoded secrets
- **Dependency Audit**: Vulnerability scanning
- **Code Analysis**: Security patterns

### Docker Tests
- **Image Building**: Dockerfile validation
- **Container Testing**: Runtime verification
- **Security Scanning**: Image vulnerabilities

## 🔄 CI/CD Integration

### GitHub Actions Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
   - Runs on push to main/develop
   - Full test suite + deployment

2. **PR Checks** (`.github/workflows/pr-check.yml`)
   - Runs on pull requests
   - Quality gates for merging

3. **Nightly Tests** (`.github/workflows/nightly-tests.yml`)
   - Comprehensive testing
   - Performance analysis
   - Security audits

4. **Code Quality** (`.github/workflows/code-quality.yml`)
   - SonarCloud analysis
   - Bundle monitoring
   - Metrics collection

5. **Release Management** (`.github/workflows/release.yml`)
   - Version validation
   - Production deployment

### Quality Gates
- ✅ All tests must pass
- ✅ No high-severity vulnerabilities
- ✅ Code coverage thresholds
- ✅ Bundle size limits
- ✅ Performance budgets

## 📊 Test Reports

### Automated Reports
- **Test Results**: Pass/fail status
- **Coverage Reports**: Code coverage metrics
- **Security Scans**: Vulnerability reports
- **Performance**: Bundle size analysis
- **Quality Metrics**: Code complexity

### Artifacts
Each CI/CD run generates downloadable artifacts:
- Test output logs
- Coverage reports
- Security scan results
- Performance metrics
- Build artifacts

## 🛠️ Local Development

### Running Tests During Development
```bash
# Watch mode for frontend
cd frontend && npm run lint -- --watch

# Backend test with watch
cd backend && npm run test:watch

# Full test suite
npm run test:all
```

### Pre-commit Hooks (Recommended)
```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
```

## 🔧 Configuration

### Test Configuration Files
- `.lighthouserc.json` - Performance testing
- `sonar-project.properties` - Code quality analysis
- `package.json` - Test scripts and dependencies

### Environment Variables
```bash
# Backend testing
DB_HOST=localhost
DB_PORT=3306
DB_NAME=test_db
DB_USERNAME=root
DB_PASSWORD=root

# CI/CD
NODE_VERSION=18
DOCKER_USERNAME=your-username
```

## 📈 Performance Testing

### Bundle Size Monitoring
- Frontend bundle size limits
- Chunk size analysis
- Performance budgets
- Lighthouse CI integration

### Performance Budgets
```json
{
  "maxBundleSize": "500KB",
  "maxChunkSize": "250KB",
  "performanceScore": 80,
  "accessibilityScore": 90
}
```

## 🔒 Security Testing

### Automated Security Checks
- **Trivy**: Vulnerability scanning
- **npm audit**: Dependency vulnerabilities
- **Secret detection**: Hardcoded credentials
- **Docker security**: Image scanning

### Security Best Practices
- Regular dependency updates
- Environment variable usage
- Secure coding patterns
- Access control validation

## 🚨 Troubleshooting

### Common Issues

**Test Failures:**
```bash
# Clear caches
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

**Docker Issues:**
```bash
# Check Docker status
docker --version
docker ps

# Clean Docker cache
docker system prune -f
```

**Database Connection:**
```bash
# Check MySQL service
# Windows: services.msc
# Linux: systemctl status mysql
```

### Getting Help
1. Check GitHub Actions logs
2. Review test artifacts
3. Consult team documentation
4. Create issue with error details

## 📚 Best Practices

### Writing Tests
- Use descriptive test names
- Test edge cases
- Mock external dependencies
- Keep tests isolated
- Maintain test data

### Code Quality
- Follow linting rules
- Write TypeScript types
- Document complex logic
- Use meaningful variable names
- Keep functions small

### CI/CD
- Fast feedback loops
- Parallel test execution
- Artifact preservation
- Clear error messages
- Automated notifications

## 🎯 Future Improvements

### Planned Enhancements
- [ ] Unit test coverage for components
- [ ] Integration test suite
- [ ] E2E testing with Playwright
- [ ] Visual regression testing
- [ ] Load testing
- [ ] Accessibility testing
- [ ] Mobile testing
- [ ] Cross-browser testing

### Metrics Goals
- 90%+ test coverage
- <2 second build time
- Zero high vulnerabilities
- 95+ Lighthouse scores
- <500KB bundle size
