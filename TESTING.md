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

---

## 🧪 Advanced Testing Framework

### Comprehensive Testing Setup

We've implemented a modern testing framework with multiple testing levels:

#### Frontend Testing Stack
- **Jest**: JavaScript testing framework with jsdom environment
- **React Testing Library**: Component testing with user-centric queries
- **Playwright**: Cross-browser end-to-end testing
- **MSW**: Mock Service Worker for API mocking

#### Backend Testing Stack
- **Jest**: Node.js testing framework
- **Supertest**: HTTP assertion library for API testing
- **Test Database**: Isolated MySQL test environment

### Test Structure & Organization
```
frontend/
├── __tests__/
│   ├── unit/
│   │   ├── components/    # React component tests
│   │   └── utils/         # Utility function tests
│   ├── integration/       # API integration tests
│   └── e2e/              # Playwright E2E tests
├── jest.setup.js         # Jest configuration
└── playwright.config.ts  # Playwright configuration

backend/
├── __tests__/
│   ├── unit/
│   │   ├── models/        # Database model tests
│   │   ├── utils/         # Utility function tests
│   │   └── services/      # Business logic tests
│   ├── integration/       # API endpoint tests
│   └── e2e/              # Full workflow tests
└── jest.setup.js         # Jest configuration
```

### Test Commands Reference

#### Frontend Testing
```bash
npm test                   # Run all Jest tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e          # Playwright E2E tests
npm run test:coverage     # Generate coverage report
npm run test:watch        # Watch mode for development
npm run test:ci           # CI-optimized test run
```

#### Backend Testing
```bash
npm test                   # Run all Jest tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e          # End-to-end API tests
npm run test:coverage     # Generate coverage report
npm run test:watch        # Watch mode for development
npm run test:ci           # CI-optimized test run
npm run test:legacy       # Legacy test suite (test.js)
```

### Coverage Requirements & Quality Gates
- **Minimum Coverage**: 70% across all metrics
- **Branch Coverage**: 70%
- **Function Coverage**: 70%
- **Line Coverage**: 70%
- **Statement Coverage**: 70%

### CI/CD Integration
Tests are automatically executed in GitHub Actions:
- **Pull Requests**: Unit + Integration tests with coverage reports
- **Main Branch Push**: Full test suite including E2E tests
- **Nightly Builds**: Comprehensive testing with performance metrics
- **Release Pipeline**: Complete validation before deployment

### Example Test Files Created
1. **Frontend Unit Test**: `frontend/__tests__/unit/components/Button.test.tsx`
2. **Frontend Integration Test**: `frontend/__tests__/integration/api.test.ts`
3. **Frontend E2E Test**: `frontend/e2e/login.spec.ts`
4. **Backend Unit Test**: `backend/__tests__/unit/utils/auth.test.js`
5. **Backend Model Test**: `backend/__tests__/unit/models/User.test.js`
6. **Backend Integration Test**: `backend/__tests__/integration/auth.test.js`

### Getting Started with Testing
1. **Install Dependencies**: `npm ci` in both frontend and backend directories
2. **Run Tests Locally**: Use the test commands above
3. **Write New Tests**: Follow the examples in the `__tests__` directories
4. **Check Coverage**: Use `npm run test:coverage` to see coverage reports
5. **Debug Tests**: Use `npm run test:watch` for interactive development

## 🏠 Local Testing with Docker Database

### Quick Start - Local Testing
```bash
# Option 1: Simple local testing (auto-detects database)
npm run test:local

# Option 2: Full Docker testing environment
npm run test:local:docker

# Option 3: Linux/macOS with Docker
npm run test:local:bash

# Option 4: Pre-commit testing (only tests changed files)
powershell -ExecutionPolicy Bypass -File scripts/pre-commit-test.ps1
```

### Database Setup Options

#### Option 1: Use Existing Docker Compose
```bash
# Start your existing database
docker-compose up -d db-mysql

# Run tests (will use localhost:3307)
npm run test:local
```

#### Option 2: Use Test-specific Database
```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d test-db

# Run tests (will use localhost:3306)
npm run test:local
```

#### Option 3: Local MySQL Installation
```bash
# Install MySQL locally and create test database
mysql -u root -p -e "CREATE DATABASE test_db;"

# Run tests
npm run test:local
```

### Pre-commit Workflow
```bash
# 1. Make your changes
git add .

# 2. Run pre-commit tests (only tests changed files)
powershell -ExecutionPolicy Bypass -File scripts/pre-commit-test.ps1

# 3. If tests pass, commit
git commit -m "your message"

# 4. Push to GitHub (CI/CD will run full test suite)
git push
```

### Database Configuration
The test scripts automatically detect and use available databases:

1. **localhost:3306** - Local MySQL or Docker test database
2. **localhost:3307** - Docker Compose production database
3. **Auto-start** - Attempts to start Docker database if none found

### Environment Variables for Testing
```bash
# Automatically set by test scripts
NODE_ENV=test
DB_HOST=localhost
DB_PORT=3306 or 3307
DB_NAME=test_db
DB_USERNAME=root
DB_PASSWORD=root or 123456 (depending on setup)
JWT_SECRET=test-jwt-secret
```

## 📚 Testing Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MSW Documentation](https://mswjs.io/docs/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

*This testing framework provides comprehensive coverage for unit, integration, and end-to-end testing scenarios. The setup is production-ready and integrated with CI/CD pipelines.*
