#!/bin/bash

echo "🧹 Cleaning up old containers and images..."

# Stop and remove containers
docker-compose down 2>/dev/null

# Remove specific containers if any running
docker rm -f workout-server workout-client 2>/dev/null

# Remove images
docker rmi workout-tracker-server workout-tracker-client 2>/dev/null
docker rmi $(docker images -q workout-tracker) 2>/dev/null

# Clean up unused volumes
docker volume prune -f 2>/dev/null

echo "✅ Cleanup complete!"
echo ""
echo "🔨 Building and starting containers..."

# Build and start
docker-compose up -d --build

echo ""
echo "📋 Container status:"
docker-compose ps
