# Docker Deployment Guide for PassGo

This guide covers how to build and deploy the PassGo frontend application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Environment variables configured

## Quick Start

### Using Docker Compose (Recommended)

1. **Create environment file**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Build and run**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Health check: http://localhost:3000/api/health

### Using Docker directly

1. **Build the image**

   ```bash
   docker build -t passgo-fe .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_API_URL=http://localhost:5000/api \
     -e GMAIL_USER=your-email@gmail.com \
     -e GMAIL_APP_PASSWORD=your-app-password \
     passgo-fe
   ```

## Environment Variables

Required environment variables for Docker deployment:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# Google Cloud Document AI
CLOUD_VISION_API=your-cloud-vision-api-key
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_PROCESSOR_ID=your-processor-id
GOOGLE_CLOUD_API_KEY=your-api-key
```

## Production Deployment

### Build Approach

The Dockerfile uses a **standard Next.js build** approach instead of standalone output for maximum compatibility:

- Builds the complete Next.js application with `pnpm run build`
- Copies the full `.next` build directory and `node_modules`
- Uses `npx next start` for production serving
- Ensures compatibility with all Next.js features and configurations

### Multi-stage Build Optimization

The Dockerfile uses a multi-stage build process:

1. **deps**: Installs dependencies using pnpm
2. **builder**: Builds the Next.js application
3. **runner**: Creates production image with full Next.js runtime

### Image Size Optimization

- Uses Alpine Linux base image (~5MB)
- Copies only necessary build artifacts and production dependencies
- Excludes development dependencies from final image
- Uses .dockerignore to reduce build context

### Security Features

- Runs as non-root user (nextjs:nodejs)
- Minimal attack surface with Alpine
- No unnecessary packages installed

## Docker Commands

### Build

```bash
# Build with tag
docker build -t passgo-fe:latest .

# Build with specific tag
docker build -t passgo-fe:v1.0.0 .
```

### Run

```bash
# Run with environment file
docker run --env-file .env.local -p 3000:3000 passgo-fe

# Run with specific environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=https://api.passgo.com \
  passgo-fe
```

### Debug

```bash
# Run with shell access
docker run -it --entrypoint /bin/sh passgo-fe

# View logs
docker logs <container-id>

# Inspect container
docker inspect <container-id>
```

## Health Monitoring

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

Docker Compose includes automatic health checks with:

- 30-second intervals
- 10-second timeout
- 3 retries before marking unhealthy
- 40-second startup grace period

## Troubleshooting

### Common Issues

1. **Build fails with pnpm errors**

   ```bash
   # Clear Docker cache
   docker system prune -a
   docker build --no-cache -t passgo-fe .
   ```

2. **Build fails with "standalone not found" error**

   ```bash
   # This is fixed in the current Dockerfile - uses regular Next.js build instead of standalone
   # If you see this error, ensure you're using the updated Dockerfile
   ```

3. **Container exits immediately**

   ```bash
   # Check logs
   docker logs <container-id>

   # Run with shell to debug
   docker run -it --entrypoint /bin/sh passgo-fe
   ```

4. **Environment variables not working**

   ```bash
   # Verify environment variables are set
   docker run --rm passgo-fe env
   ```

5. **Port already in use**
   ```bash
   # Use different port
   docker run -p 3001:3000 passgo-fe
   ```

### Performance Tuning

1. **Memory limits**

   ```bash
   docker run -m 512m passgo-fe
   ```

2. **CPU limits**

   ```bash
   docker run --cpus="1.0" passgo-fe
   ```

3. **Docker Compose resource limits**
   ```yaml
   services:
     passgo-fe:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: '1.0'
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t passgo-fe .

      - name: Run tests
        run: docker run --rm passgo-fe npm test

      - name: Deploy to production
        run: |
          docker tag passgo-fe registry.example.com/passgo-fe:latest
          docker push registry.example.com/passgo-fe:latest
```

### Docker Registry

```bash
# Tag for registry
docker tag passgo-fe registry.example.com/passgo-fe:latest

# Push to registry
docker push registry.example.com/passgo-fe:latest

# Pull and run from registry
docker pull registry.example.com/passgo-fe:latest
docker run -p 3000:3000 registry.example.com/passgo-fe:latest
```
