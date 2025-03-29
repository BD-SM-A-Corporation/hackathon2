# Build stage
FROM golang:1.23 AS builder

WORKDIR /app

# Copy all files
COPY . .

# Ensure dependencies are installed
RUN go mod tidy

# ✅ Force build for Linux (important!)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server microgreens-api

# Final runtime stage
FROM alpine:latest

WORKDIR /root/

# Copy the built binary
COPY --from=builder /app/server .

# ✅ Ensure execution permissions
RUN chmod +x server

# ✅ Install libc (Alpine needs it for Go binaries)
RUN apk add --no-cache libc6-compat

# Expose the correct port
EXPOSE 8080

# Run the server
CMD ["./server"]