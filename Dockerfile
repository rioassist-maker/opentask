FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ========================================
FROM alpine:latest

ARG PB_VERSION=0.22.26

RUN apk add --no-cache \
    unzip \
    ca-certificates

# Download and install PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && \
    chmod +x /pb/pocketbase && \
    rm /tmp/pb.zip

EXPOSE 8080

# Copy migrations
COPY pb_migrations /pb/pb_migrations

# Copy built frontend to pb_public (PocketBase serves static files from here)
COPY --from=frontend-builder /app/frontend/out /pb/pb_public

# Copy entrypoint script
COPY entrypoint.sh /pb/entrypoint.sh
RUN chmod +x /pb/entrypoint.sh

# Start PocketBase
CMD ["/pb/entrypoint.sh"]
