# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL

COPY package*.json ./
RUN npm ci

ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy public folder
COPY --from=builder /app/public /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
