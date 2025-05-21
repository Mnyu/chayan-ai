# --- Stage 1: Build the Go binary ---
  FROM golang:alpine AS builder

  # Install dependencies for go-fitz and CGO
  RUN apk update && apk add --no-cache git gcc musl-dev
  
  WORKDIR /app
  
  COPY go.mod go.sum ./
  RUN go mod download
  
  COPY . .
  
  # Build statically-linked binary with musl
  RUN go build -tags musl -o api-server cmd/server/main.go
  
  # --- Stage 2: Minimal runtime image ---
  FROM alpine
  
  # Install any runtime libs needed (e.g., for go-fitz or fontconfig)
  RUN apk add --no-cache libstdc++ ttf-dejavu fontconfig
  
  WORKDIR /app
  
  # Copy binary from builder stage
  COPY --from=builder /app/api-server .
  
  # Run the app
  CMD ["./api-server"]
  