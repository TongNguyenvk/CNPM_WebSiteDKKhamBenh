# Sử dụng Node.js phiên bản 20 làm base image
FROM node:20-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Sao chép các file package.json và package-lock.json (hoặc yarn.lock)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ source code của ứng dụng
COPY . .

# Định nghĩa port mà ứng dụng sẽ lắng nghe
EXPOSE 8080

# Thiết lập biến môi trường
ENV NODE_ENV production

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]