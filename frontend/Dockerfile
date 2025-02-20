# Sử dụng Node.js phiên bản 18 làm base image
FROM node:20-alpine AS builder

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Sao chép các file package.json và package-lock.json (hoặc yarn.lock)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ source code của ứng dụng
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Sử dụng một base image nhỏ gọn hơn để chạy ứng dụng (ví dụ: Alpine Linux)
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép các file đã build từ giai đoạn builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./ 
COPY --from=builder /app/package.json ./package.json

# Cài đặt dependencies cần thiết để chạy ứng dụng (chỉ production dependencies)
RUN npm install 

# Định nghĩa port mà ứng dụng sẽ lắng nghe
EXPOSE 3000
ENV NEXT_PRIVATE_TURBOPACK =  false
# Thiết lập biến môi trường
ENV NODE_ENV = production

# Lệnh để chạy ứng dụng Next.js
CMD ["npm", "start"]