# Build stage
FROM rust:1.83-slim AS builder

WORKDIR /app

# Copy dependency files
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src ./src

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bullseye-slim AS runtime

# Install necessary runtime dependencies (if any, e.g., for SSL)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built binary
COPY --from=builder /app/target/release/server ./server

# Create the recipes directory and images subdirectory (for data persistence)
RUN mkdir -p ./recipes/images

# Create a default .env file (can be overridden with volumes)
RUN echo "HOST=0.0.0.0" > ./.env && \
    echo "PORT=5000" >> ./.env && \
    echo "RECIPES_FILE_PATH=./recipes/recipes.json" >> ./.env && \
    echo "IMAGES_URL_PATH=/recipes/images" >> ./.env && \
    echo "IMAGES_FILE_PATH=recipes/images" >> ./.env && \
    echo "BASE_URL=http://localhost:5000" >> ./.env

# Expose the port
EXPOSE 5000

# Run the application
CMD ["./server"]
