#!/bin/bash

# PassGo Frontend Deployment Script - Aligned with CI/CD Pipeline
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_IMAGE="passgo-fe"
CONTAINER_NAME="passgo-fe-local"
PORT="3000"
NODE_VERSION="18"

echo -e "${GREEN}🚀 Starting PassGo Frontend deployment (Full Pipeline)...${NC}"

# Step 1: Environment Check
echo -e "${BLUE}📋 Checking environment...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed. Installing...${NC}"
    npm install -g pnpm@9.15.4
fi

NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" != "$NODE_VERSION" ]; then
    echo -e "${YELLOW}⚠️ Warning: Expected Node.js $NODE_VERSION, found $NODE_CURRENT${NC}"
fi

# Step 2: Install Dependencies (like CI/CD pipeline)
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install --frozen-lockfile

# Step 3: Lint & Test (exactly like CI/CD pipeline)
echo -e "${BLUE}🔍 Running ESLint...${NC}"
pnpm lint

echo -e "${BLUE}🔧 Checking TypeScript...${NC}"
npx tsc --noEmit

# echo -e "${BLUE}💅 Checking formatting...${NC}"
# npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

# Step 4: Build Application (exactly like CI/CD pipeline)
echo -e "${BLUE}🛠️ Building Next.js app...${NC}"
pnpm build

echo -e "${GREEN}✅ All CI/CD pipeline steps completed successfully!${NC}"

# Step 5: Docker Deployment (local extension)
echo -e "${BLUE}🐳 Starting Docker deployment...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/ -t $DOCKER_IMAGE:latest .

# Stop and remove existing container if it exists
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
    docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo -e "${YELLOW}🗑️ Removing existing container...${NC}"
    docker rm $CONTAINER_NAME
fi

# Run the new container
echo -e "${YELLOW}🏃 Starting new container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    --restart unless-stopped \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_API_URL=http://localhost:8080/ \
    $DOCKER_IMAGE:latest

# Wait for the application to start
echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
sleep 10

# Health check
echo -e "${YELLOW}🔍 Performing health check...${NC}"
if curl -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Deployment successful! Application is running on http://localhost:$PORT${NC}"
    echo -e "${GREEN}📊 Health check: http://localhost:$PORT/api/health${NC}"
else
    echo -e "${RED}❌ Health check failed. Check container logs:${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Show container status
echo -e "${GREEN}📋 Container status:${NC}"
docker ps --filter name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 