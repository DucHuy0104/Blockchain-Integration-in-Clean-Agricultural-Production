# Sử dụng Node.js image chính thức
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./

# Cài đặt các công cụ cần thiết để build các thư viện native (như thor-devkit)
RUN apk add --no-cache python3 make g++ 

RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port (Backend chạy 5001)
EXPOSE 5001

# Lệnh khởi chạy
CMD ["npm", "start"]
