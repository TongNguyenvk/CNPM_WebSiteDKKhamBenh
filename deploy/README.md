# GCP Deployment Guide

## Prerequisites

1. **GCP VM Instance** với static IP đã được setup
2. **Docker và Docker Compose** đã được cài đặt trên VM
3. **GitHub Secrets** đã được cấu hình

## Required GitHub Secrets

Thêm các secrets sau vào GitHub repository:

```
GCP_SSH_PRIVATE_KEY    # SSH private key để kết nối tới GCP VM
GCP_USER              # Username trên GCP VM (thường là username của bạn)
GCP_HOST              # Static IP address của GCP VM
GCP_STATIC_IP         # Static IP address (có thể giống GCP_HOST)
DB_PASSWORD           # Password cho MySQL database
```

## Setup trên GCP VM

### 1. Cài đặt Docker và Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply docker group
```

### 2. Tạo thư mục deploy

```bash
mkdir -p ~/deploy
cd ~/deploy
```

### 3. Cấu hình environment variables

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Chỉnh sửa file .env với thông tin thực tế
nano .env
```

### 4. Cấu hình firewall

```bash
# Mở port 80 và 8080
sudo ufw allow 80
sudo ufw allow 8080
sudo ufw allow 22  # SSH
sudo ufw enable
```

## Deployment Process

### Automatic Deployment (via GitHub Actions)

1. Push code lên branch `main`
2. GitHub Actions sẽ tự động:
   - Chạy tests
   - Build Docker images
   - Push images lên Docker Hub
   - Deploy lên GCP VM
   - Chạy health check

### Manual Deployment

```bash
# SSH vào GCP VM
ssh username@your-static-ip

# Navigate to deploy directory
cd ~/deploy

# Pull latest images
docker pull tongnguyen/frontend:latest
docker pull tongnguyen/backend:latest

# Deploy
./deploy.sh
```

## Monitoring

### Check application status

```bash
# Check containers
docker ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Health check
curl http://your-static-ip/api/health
```

### Access application

- **Frontend**: http://your-static-ip
- **Backend API**: http://your-static-ip:8080/api
- **API Documentation**: http://your-static-ip:8080/api-docs

## Troubleshooting

### Common Issues

1. **Container không start**: Kiểm tra logs và environment variables
2. **Database connection failed**: Kiểm tra MySQL container và credentials
3. **Port conflicts**: Đảm bảo ports 80, 8080, 3306 không bị sử dụng

### Useful Commands

```bash
# Restart all services
docker-compose -f docker-compose.prod.yml restart

# View logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Clean up
docker system prune -f
```
