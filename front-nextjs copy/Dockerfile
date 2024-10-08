
# Sử dụng base image là node
FROM node:18.17.0

# Set thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies với npm
RUN npm install

# Copy toàn bộ project vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Expose port 3000 để chạy ứng dụng Next.js
EXPOSE 3000

# Chạy ứng dụng Next.js
CMD ["npm", "run", "start"]
