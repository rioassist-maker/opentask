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

# Start PocketBase - copy migrations to data dir first
CMD sh -c "cp -r /pb/pb_migrations /pb/pb_data/ 2>/dev/null || true && /pb/pocketbase serve --http=0.0.0.0:8080"
