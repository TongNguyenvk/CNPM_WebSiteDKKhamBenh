# 🏥 Website Đăng Ký Lịch Khám Bệnh

Ứng dụng web cho phép bệnh nhân đặt lịch khám bệnh trực tuyến.

## Mục lục

- [🏥 Website Đăng Ký Lịch Khám Bệnh](#-website-đăng-ký-lịch-khám-bệnh)
  - [Mục lục](#mục-lục)
  - [Mô tả](#mô-tả)
  - [Yêu cầu](#yêu-cầu)
  - [🚀 Cài đặt](#-cài-đặt)
    - [💻 Cài đặt Local (Development)](#-cài-đặt-local-development)
    - [🐳 Cài đặt với Docker (Khuyến nghị)](#-cài-đặt-với-docker-khuyến-nghị)
    - [⚡ Cài đặt nhanh (Quick Start)](#-cài-đặt-nhanh-quick-start)
  - [⚙️ Cấu hình](#️-cấu-hình)
    - [🔐 Biến môi trường Backend](#-biến-môi-trường-backend)
    - [🌐 Biến môi trường Frontend](#-biến-môi-trường-frontend)
    - [🗄️ Cấu hình Database](#️-cấu-hình-database)
  - [🚀 Chạy Ứng Dụng](#-chạy-ứng-dụng)
    - [💻 Development Mode](#-development-mode)
    - [🐳 Docker Mode](#-docker-mode)
    - [🧪 Testing Mode](#-testing-mode)
  - [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
  - [Đóng góp](#đóng-góp)

## Mô tả

Ứng dụng này cho phép bệnh nhân xem thông tin bác sĩ, chuyên khoa, lịch khám và đặt lịch hẹn trực tuyến. Bác sĩ có thể quản lý lịch hẹn của mình. Quản trị viên có thể quản lý người dùng, chuyên khoa và các cài đặt khác.

## Yêu cầu

- [Node.js](https://nodejs.org/) (phiên bản 20.x)
- [npm](https://www.npmjs.com/) (hoặc [yarn](https://yarnpkg.com/))
- [MySQL](https://www.mysql.com/) (hoặc [PostgreSQL](https://www.postgresql.org/))
- [Docker](https://www.docker.com/) (tùy chọn)
- [Docker Compose](https://docs.docker.com/compose/install/) (tùy chọn)

## 🚀 Cài đặt

### 💻 Cài đặt Local (Development)

1. **Clone repository:**
   ```bash
   git clone https://github.com/TongNguyenvk/CNPM_WebSiteDKKhamBenh.git
   cd CNPM_WebSiteDKKhamBenh
   ```

2. **Cài đặt dependencies cho Backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Cài đặt dependencies cho Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Thiết lập cơ sở dữ liệu MySQL:**
   ```sql
   CREATE DATABASE cnpm_hospital_booking;
   ```

5. **Chạy migrations và seeders:**
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

### 🐳 Cài đặt với Docker (Khuyến nghị)

1. **Đảm bảo đã cài đặt Docker và Docker Compose**

2. **Chạy toàn bộ ứng dụng:**
   ```bash
   docker-compose up -d
   ```

3. **Kiểm tra trạng thái containers:**
   ```bash
   docker-compose ps
   ```

### ⚡ Cài đặt nhanh (Quick Start)

```bash
# Clone và cài đặt
git clone https://github.com/TongNguyenvk/CNPM_WebSiteDKKhamBenh.git
cd CNPM_WebSiteDKKhamBenh

# Chạy với Docker
docker-compose up -d

# Hoặc chạy local
npm run dev
```

## ⚙️ Cấu hình

### 🔐 Biến môi trường Backend

Tạo file `.env` trong thư mục `backend`:

```bash
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cnpm_hospital_booking
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5MB
```

### 🌐 Biến môi trường Frontend

Tạo file `.env.local` trong thư mục `frontend`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8080/uploads

# App Configuration
NEXT_PUBLIC_APP_NAME="Website Đăng Ký Khám Bệnh"
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 🗄️ Cấu hình Database

1. **Tạo database MySQL:**
   ```sql
   CREATE DATABASE cnpm_hospital_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Import dữ liệu mẫu:**
   ```bash
   cd backend
   npm run migrate  # Chạy migrations
   npm run seed     # Import dữ liệu mẫu
   ```

## 🚀 Chạy Ứng Dụng

### 💻 Development Mode

**Cách 1: Chạy đồng thời Frontend + Backend**
```bash
npm run dev
```

**Cách 2: Chạy riêng từng service**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

**Truy cập ứng dụng:**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080
- 📊 **API Documentation**: http://localhost:8080/api-docs

### 🐳 Docker Mode

**Chạy toàn bộ stack:**
```bash
npm run docker:up
```

**Các lệnh Docker hữu ích:**
```bash
npm run docker:down    # Dừng containers
npm run docker:logs    # Xem logs
npm run docker:clean   # Dọn dẹp containers và images
```

### 🧪 Testing Mode

```bash
npm run test           # Chạy tất cả tests
npm run test:frontend  # Test frontend only
npm run test:backend   # Test backend only
```

## 📁 Cấu trúc thư mục

```
CNPM_WebSiteDKKhamBenh/
├── 📁 frontend/                 # Next.js Frontend
│   ├── 📁 src/
│   │   ├── 📁 app/              # App Router pages
│   │   ├── 📁 components/       # React components
│   │   ├── 📁 lib/              # Utilities & API calls
│   │   └── 📁 hooks/            # Custom React hooks
│   ├── 📁 public/               # Static assets
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   └── 🐳 Dockerfile
│
├── 📁 backend/                  # Node.js Backend
│   ├── 📁 src/
│   │   ├── 📁 controllers/      # API controllers
│   │   ├── 📁 models/           # Database models
│   │   ├── 📁 routes/           # API routes
│   │   ├── 📁 middleware/       # Express middleware
│   │   └── 📁 lib/              # Utilities
│   ├── 📁 migrations/           # Database migrations
│   ├── 📁 seeders/              # Database seeders
│   ├── 📁 uploads/              # File uploads
│   ├── 📄 package.json
│   └── 🐳 Dockerfile
│
├── 📁 scripts/                  # Build & deployment scripts
├── 📁 .github/                  # GitHub Actions workflows
├── 🐳 docker-compose.yml        # Docker configuration
├── 📄 package.json              # Root package.json
└── 📖 README.md                 # This file
```
## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp cho dự án này. Vui lòng tạo một pull request với các thay đổi của bạn.
