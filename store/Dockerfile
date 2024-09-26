# Sử dụng Node.js image chính thức
FROM node:16

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng ReactJS
# RUN npm run build

# # Cài đặt serve để phục vụ ứng dụng sau khi build
# RUN npm install -g serve

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng ReactJS với serve
CMD ["npm", "start"]
