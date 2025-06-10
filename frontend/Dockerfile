# Sử dụng Node.js phiên bản 18 làm base image
FROM node:20-alpine AS builder

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Sao chép các file package.json và package-lock.json (hoặc yarn.lock)
COPY package*.json ./
# Copy environment files
COPY .env* ./

# Cài đặt các dependencies với legacy peer deps để tránh conflicts
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ source code của ứng dụng
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Sử dụng một base image nhỏ gọn hơn để chạy ứng dụng
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép các file đã build từ giai đoạn builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Định nghĩa port mà ứng dụng sẽ lắng nghe
EXPOSE 3000

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Lệnh để chạy ứng dụng Next.js
CMD ["node", "server.js"]