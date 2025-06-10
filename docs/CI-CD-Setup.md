# 🚀 CI/CD Setup Guide

## 📋 Overview

Simplified CI/CD pipeline với chỉ những gì cần thiết:

### ✅ **Workflow duy nhất:** `.github/workflows/ci-cd.yml`

**Chức năng:**
- 🏗️ **Build Frontend** - Next.js build với --legacy-peer-deps
- 🧪 **Test Backend** - npm test (nếu có)
- 🔍 **Security Audit** - npm audit cho cả frontend và backend
- 🐳 **Docker Build & Push** - Chỉ khi push to main branch

## 🔐 Required GitHub Secrets

### **Bắt buộc:**
```
DOCKER_ACCESS_TOKEN
```

**Cách tạo Docker Hub Token:**
1. Vào [hub.docker.com](https://hub.docker.com/)
2. Account Settings → Security → Access Tokens
3. Create token: `GitHub-Actions-CNPM`
4. Copy token
5. GitHub repo → Settings → Secrets → Add `DOCKER_ACCESS_TOKEN`

## 🎯 Workflow Triggers

### **Push to main/develop:**
- ✅ Build frontend
- ✅ Test backend
- ✅ Security audit
- ✅ Docker build & push (chỉ main branch)

### **Pull Request:**
- ✅ Build frontend
- ✅ Test backend
- ✅ Security audit
- ❌ Không build Docker

## 🐳 Docker Images

**Khi push to main branch, tự động build:**
- `tongnguyen/cnpm-backend:latest`
- `tongnguyen/cnpm-frontend:latest`
- `tongnguyen/cnpm-backend:abc1234` (git commit hash)
- `tongnguyen/cnpm-frontend:abc1234` (git commit hash)

## 🚀 Usage

### **Test CI/CD:**
```bash
# Push to develop để test build
git push origin develop

# Push to main để build Docker
git push origin main
```

### **Check workflow:**
- GitHub repo → Actions tab
- Xem logs nếu có lỗi

## 🔧 Customization

### **Thay đổi Docker username:**
```yaml
env:
  DOCKER_USERNAME: your-username  # Thay đổi ở đây
```

### **Thêm environment variables:**
```yaml
env:
  NODE_VERSION: '18'
  DOCKER_USERNAME: tongnguyen
  # Thêm biến mới ở đây
```

### **Disable Docker push:**
```yaml
# Comment out docker-deploy job
# docker-deploy:
#   name: 🐳 Docker Build & Push
#   ...
```

## ✅ **Đã loại bỏ:**
- ❌ ESLint checks
- ❌ SonarCloud analysis
- ❌ Complex security scans
- ❌ Multiple workflows
- ❌ Dependency review
- ❌ Performance budgets
- ❌ Code metrics

## 🎉 **Kết quả:**
- **1 workflow file** thay vì 4 files
- **~120 lines** thay vì ~800 lines
- **Chỉ cần 1 secret** (DOCKER_ACCESS_TOKEN)
- **Fast execution** - Ít jobs hơn
- **Simple maintenance** - Dễ hiểu và sửa
