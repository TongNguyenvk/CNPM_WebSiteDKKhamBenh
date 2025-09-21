# BÁO CÁO THỰC NGHIỆM DOCKER

## 1. Giới Thiệu
Dự án: Hệ thống Đặt Khám Bệnh (Frontend: Next.js, Backend: Express/Sequelize, Database: MySQL, Reverse Proxy: Nginx - production).
Mục tiêu thực nghiệm: Chuẩn hóa môi trường chạy, đơn giản hóa triển khai, tách biệt các tầng, thử nghiệm đa môi trường (local vs production) và phân tích các vấn đề khi container hóa.

## 2. Mục Tiêu Cụ Thể
- Đóng gói backend và frontend thành image riêng.
- Kết nối qua mạng nội bộ Docker (bridge network).
- Quản lý biến môi trường cho local và production.
- Tích hợp reverse proxy + SSL termination (production).
- Ghi nhận và xử lý lỗi phát sinh (CORS, SSL, base URL, rebuild).

## 3. Kiến Trúc Docker
### Local (docker-compose.yml)
Services:
- frontend: Next.js server (cổng 3000 publish ra host).  
- backend: Express API (cổng 8080).  
- db-mysql: MySQL 8.0 (port 3306 container, 3307 host).  
Network: `app-network` (bridge).  
Volume: `db_data` lưu dữ liệu MySQL.  

### Production (deploy/docker-compose.prod.yml)
Thêm:
- nginx: reverse proxy + SSL (Let’s Encrypt cert).  
`frontend` và `backend` dùng image đã build trước (registry).  
Expose nội bộ, chỉ nginx publish 80/443.  

### Luồng Request Production
Client (HTTPS 443) → Nginx → ( `/api/*` → backend HTTP 8080 | `/` → frontend ) → DB nội bộ.

## 4. Dockerfile Phân Tích
### Backend Dockerfile
- Base: `node:20-alpine` (nhẹ).  
- Steps: copy package*, `npm install`, copy source, set `NODE_ENV=production`, expose 8080, `npm start`.  
- Ưu: Đơn giản.  
- Nhược: Chưa tách devDependencies, chưa dùng `npm ci`, chưa chạy non-root user.

### Frontend Dockerfile (Multi-stage)
- Stage builder: `node:18-alpine`, cài deps (`--legacy-peer-deps`), build Next.js (`npm run build`).  
- Stage runtime: `node:18-alpine`, copy `.next/standalone`, `.next/static`, `public`, expose 3000, chạy `node server.js`.  
- Ưu: Giảm size, tách build toolchain.  
- Nhược: Chưa dọn cache npm, chưa verify integrity.

## 5. Quản Lý Biến Môi Trường
- Local: fallback `NEXT_PUBLIC_API_URL=http://localhost:8080/api/`.  
- Production: `NEXT_PUBLIC_API_URL=https://<domain>/api`, `ALLOWED_ORIGINS`, `JWT_SECRET`, `DATABASE_URL`.  
- Rủi ro: lộ mật khẩu nếu commit `.env`.  
- Đề xuất: Docker secrets / Vault, chuẩn hóa `.env.example`.

## 6. Quy Trình Thực Nghiệm
### Local
```
docker compose build
docker compose up -d
docker compose logs -f backend
```
Health check: `curl http://localhost:8080/api/health`.

### Production (ví dụ)
```
docker compose -f deploy/docker-compose.prod.yml pull
docker compose -f deploy/docker-compose.prod.yml up -d
```
Health check: `curl -k https://<domain>/api/health`.

## 7. Vấn Đề Gặp Phải & Xử Lý
| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| ERR_SSL_PROTOCOL_ERROR | Gọi HTTPS trực tiếp tới backend 8080 (HTTP only) | Dùng HTTP local hoặc đi qua Nginx 443 production |
| Sai base URL | Build production nhưng chạy local không reverse proxy | Sửa logic `config.ts` phân biệt hostname |
| CORS blocked | Origin chưa khai báo | Bổ sung `ALLOWED_ORIGINS` env |
| 404 /auth/forgot-password | Chưa tạo page | Tạo file page placeholder |
| Env không cập nhật | Bundle Next cũ | Rebuild `--no-cache` |

## 8. Kết Quả
- Thời gian khởi tạo stack local: ~20–40s.
- Restart policy đảm bảo tự phục hồi.
- Có thể scale backend bằng `--scale` (cần cân bằng tải nếu mở rộng thực).  
- Chuyển đổi local ↔ production rõ ràng (http vs https + Nginx).  
- Build lặp lại nhanh nhờ cache layer (khi không đổi package*).  

## 9. Đánh Giá
- Docker đáp ứng mục tiêu tái lập môi trường và tách biệt dịch vụ.  
- Multi-stage giảm kích thước image frontend.  
- Còn dư địa tối ưu bảo mật (non-root, secrets) và performance (cache deps).  
- Logging hướng stdout phù hợp gom tập trung (ELK/Loki sau).  

## 10. Khuyến Nghị Tối Ưu
1. Backend: dùng `npm ci --only=production`, thêm user non-root, prune deps.  
2. Frontend: xóa cache npm (`npm cache clean --force`), cân nhắc `NODE_OPTIONS=--max_old_space_size=256` nếu memory hạn chế.  
3. Bảo mật: Docker secrets cho DB_PASSWORD, JWT_SECRET.  
4. CI/CD: Pipeline (lint → test → build → scan (Trivy) → push → deploy).  
5. Tag image theo git SHA thay vì `latest`.  
6. Monitoring: Prometheus + Grafana, thêm metrics endpoint.  
7. Backup DB: cron dump hoặc dùng Volume snapshot.  
8. Cấu hình Nginx: thêm rate limit, security headers (đã có một phần), gzip/brotli.  
9. Kiểm thử load: k6 / Locust để xác định giới hạn trước scale.  

## 11. Kết Luận
Thực nghiệm chứng minh Docker giúp đơn giản hóa triển khai, đảm bảo tính nhất quán và dễ mở rộng. Các cải tiến bảo mật, tối ưu kích thước image và tự động hóa CI/CD là bước tiếp theo để sản phẩm sẵn sàng sản xuất ở quy mô lớn hơn.

## 12. Hướng Mở Rộng
- Thêm Redis cache.  
- Chuyển sang Kubernetes (Helm chart) khi cần autoscale.  
- CDN cho static assets frontend.  
- Tích hợp hệ thống giám sát (ELK / OpenTelemetry).  

---
(Báo cáo có thể tùy biến thêm biểu đồ, thống kê build size, thời gian response nếu cần.)
