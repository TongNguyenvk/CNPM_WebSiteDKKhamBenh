# Docker Deployment Guide

## 📋 Overview

Project này hỗ trợ 2 môi trường deployment:

1. **Local Development** - Sử dụng `.env.local`
2. **Production (GCP)** - Sử dụng `.env.production`

## 🏠 Local Development

### Option 1: Docker Compose (Recommended)

```bash
# Windows
npm run dev:docker

# Linux/Mac
npm run dev:docker:bash

# Manual
cp .env.local .env
docker-compose up --build -d
```

### Option 2: Native Development

```bash
# Start frontend and backend separately
npm run dev
```

### Access URLs (Local)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/api-docs
- **MySQL**: localhost:3307

## 🚀 Production Deployment (GCP)

### Automatic Deployment

1. **Push to main branch** → GitHub Actions tự động deploy
2. **CI/CD Pipeline** sẽ:
   - Run tests
   - Build Docker images
   - Push to Docker Hub
   - Deploy to GCP VM
   - Run health checks

### Manual Deployment

```bash
# SSH to GCP VM
ssh -i ~/.ssh/gcp_deployment_key username@your-static-ip

# Navigate to deploy directory
cd ~/deploy

# Run deployment
./deploy.sh
```

### Access URLs (Production)

- **Frontend**: http://your-static-ip
- **Backend API**: http://your-static-ip:8080/api
- **API Documentation**: http://your-static-ip:8080/api-docs

## 🔧 Environment Configuration

### Local (.env.local)

```env
NODE_ENV=development
FRONTEND_PORT=3000
BACKEND_PORT=8080
DB_EXTERNAL_PORT=3307
NEXT_PUBLIC_API_URL=http://localhost:8080/api/
ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
DB_HOST=db-mysql
DB_PORT=3306
DB_NAME=DBDKKHAMBENH
DB_USER=root
DB_PASSWORD=123456
```

### Production (.env.production)

```env
NODE_ENV=production
FRONTEND_PORT=80
BACKEND_PORT=8080
DB_EXTERNAL_PORT=3306
NEXT_PUBLIC_API_URL=http://YOUR_STATIC_IP/api/
ALLOWED_ORIGINS=http://YOUR_STATIC_IP
DB_HOST=db-mysql
DB_PORT=3306
DB_NAME=DBDKKHAMBENH
DB_USER=root
DB_PASSWORD=YOUR_SECURE_PASSWORD
```

## 🛠️ Useful Commands

### Docker Management

```bash
# View logs
npm run docker:logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Clean up
npm run docker:clean

# Restart specific service
docker-compose restart [service-name]
```

### Health Checks

```bash
# Local
curl http://localhost:8080/api/health

# Production
curl http://your-static-ip:8080/api/health
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8080, 3307 are available
2. **Docker not running**: Start Docker Desktop
3. **Permission denied**: Run with administrator/sudo
4. **Database connection**: Check MySQL container status

### Debug Commands

```bash
# Check container status
docker ps

# View container logs
docker logs [container-name]

# Access container shell
docker exec -it [container-name] /bin/sh

# Check network
docker network ls
docker network inspect [network-name]
```

## 📁 File Structure

```
├── docker-compose.yml          # Main compose file (flexible)
├── .env.local                  # Local development config
├── .env.production            # Production config template
├── deploy/
│   ├── docker-compose.prod.yml # Production compose file
│   ├── deploy.sh              # Deployment script
│   ├── .env.example           # Environment template
│   └── README.md              # GCP deployment guide
└── scripts/
    ├── dev-docker.sh          # Linux/Mac dev script
    └── dev-docker.ps1         # Windows dev script
```

## 🔐 Security Notes

- **Never commit** `.env` files with real credentials
- **Use strong passwords** for production database
- **Restrict firewall** to necessary ports only
- **Keep Docker images** updated regularly
