# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy self signed certs
# COPY ssl/chakrview.crt /etc/ssl/chakrview.crt
# COPY ssl/chakrview.key /etc/ssl/chakrview.key

# Copy certbot certs
COPY ssl/certbot/fullchain.pem /etc/ssl/fullchain.pem
COPY ssl/certbot/privkey.pem /etc/ssl/privkey.pem

# Expose port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
