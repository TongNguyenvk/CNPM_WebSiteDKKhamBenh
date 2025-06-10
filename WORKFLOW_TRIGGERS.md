# 🔄 GitHub Actions Workflow Triggers Guide

## 📋 Workflow Execution Matrix

| Workflow | Push main/develop | Pull Request | Tag Release | Schedule | Manual |
|----------|-------------------|--------------|-------------|----------|--------|
| `ci-cd.yml` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `pr-check.yml` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `nightly-tests.yml` | ❌ | ❌ | ❌ | ✅ Daily 2AM | ✅ |
| `code-quality.yml` | ✅ | ✅ | ❌ | ✅ Weekly | ❌ |
| `release.yml` | ❌ | ❌ | ✅ | ❌ | ✅ |

## 🚀 Detailed Trigger Conditions

### 1. CI/CD Pipeline (`ci-cd.yml`)
```yaml
on:
  push:
    branches: [ main, develop ]
```
**Chạy khi:**
- Push code lên branch `main`
- Push code lên branch `develop`

**Không chạy khi:**
- Push lên branch khác (feature/*, hotfix/*)
- Tạo Pull Request
- Push tags

### 2. Pull Request Checks (`pr-check.yml`)
```yaml
on:
  pull_request:
    branches: [ main, develop ]
    types: [opened, synchronize, reopened]
```
**Chạy khi:**
- Tạo PR mới targeting main/develop
- Push thêm commits vào PR
- Reopen PR đã đóng

**Không chạy khi:**
- Push trực tiếp lên branch
- PR targeting branch khác

### 3. Nightly Tests (`nightly-tests.yml`)
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:     # Manual trigger
```
**Chạy khi:**
- Hàng ngày lúc 2 AM UTC
- Trigger thủ công từ GitHub UI

### 4. Code Quality (`code-quality.yml`)
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 3 * * 0'  # 3 AM UTC every Sunday
```
**Chạy khi:**
- Push lên main/develop
- Tạo/update PR
- Hàng tuần Chủ nhật 3 AM UTC

### 5. Release Management (`release.yml`)
```yaml
on:
  push:
    tags:
      - 'v*.*.*'         # v1.0.0, v2.1.3, etc.
  workflow_dispatch:     # Manual trigger
```
**Chạy khi:**
- Push tag version (v1.0.0, v2.1.3, etc.)
- Trigger thủ công với input version

## 📊 Typical Development Flow

### Normal Development:
```bash
# 1. Tạo feature branch
git checkout -b feature/new-feature

# 2. Develop & commit
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# ❌ Không có workflow nào chạy (branch không được config)

# 3. Tạo Pull Request
# ✅ pr-check.yml chạy
# ✅ code-quality.yml chạy

# 4. Merge PR vào develop
# ✅ ci-cd.yml chạy (build + test)
# ✅ code-quality.yml chạy

# 5. Merge develop vào main
# ✅ ci-cd.yml chạy (build + test + deploy)
# ✅ code-quality.yml chạy
```

### Release Flow:
```bash
# 1. Tạo và push tag
git tag v1.0.0
git push origin v1.0.0

# ✅ release.yml chạy (build + release + deploy production)
```

## 🎯 Optimization Tips

### Để tránh chạy quá nhiều workflows:

1. **Sử dụng path filters:**
```yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'
      - 'backend/**'
```

2. **Skip workflows với commit message:**
```bash
git commit -m "docs: update README [skip ci]"
```

3. **Conditional jobs:**
```yaml
jobs:
  test:
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
```

## 🔧 Manual Workflow Triggers

### Từ GitHub UI:
1. Vào repository → Actions tab
2. Chọn workflow muốn chạy
3. Click "Run workflow"
4. Chọn branch và parameters (nếu có)

### Workflows có thể trigger manual:
- `nightly-tests.yml` - Comprehensive testing
- `release.yml` - Release với version input

## 📈 Workflow Execution Order

### Khi push lên main:
```
1. ci-cd.yml starts          (parallel)
2. code-quality.yml starts   (parallel)
3. Both complete independently
```

### Khi tạo PR:
```
1. pr-check.yml starts       (parallel)
2. code-quality.yml starts   (parallel)
3. Both must pass for PR approval
```

## 🚨 Important Notes

### Resource Usage:
- Multiple workflows chạy parallel
- Mỗi workflow sử dụng GitHub Actions minutes
- Free tier: 2000 minutes/month

### Best Practices:
- Sử dụng caching để tăng tốc
- Optimize workflows để giảm thời gian chạy
- Monitor usage trong Settings → Billing

### Troubleshooting:
- Check Actions tab để xem workflow status
- Review logs để debug issues
- Use workflow_dispatch để test manually
