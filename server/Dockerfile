# Build stage
FROM rust:1.75-slim as builder

WORKDIR /app

# Copy dependency files
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src ./src

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bullseye-slim

# Install necessary runtime dependencies (if any, e.g., for SSL)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built binary
COPY --from=builder /app/target/release/server ./server

# Copy the recipes directory (for data persistence)
COPY recipes ./recipes

# Copy the .env file
COPY .env ./.env

# Expose the port
EXPOSE 5000

# Run the application
CMD ["./server"]
