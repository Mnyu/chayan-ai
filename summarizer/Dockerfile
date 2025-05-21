# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install git for Go dependencies
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build with optimizations
ENV GOCACHE=/root/.cache/go-build
RUN --mount=type=cache,target="/root/.cache/go-build" CGO_ENABLED=0 GOOS=linux go build -o summarizer cmd/main.go

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

# Copy binary from builder
COPY --from=builder /app/summarizer /

# Run binary
CMD ["./summarizer"]
