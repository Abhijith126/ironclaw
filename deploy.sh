#!/bin/bash

echo "🧹 Cleaning up old containers..."

docker-compose down 2>/dev/null
docker rm -f workout-server workout-client 2>/dev/null

echo "✅ Cleanup done!"
echo ""
echo "📦 Copying APK to dist..."
mkdir -p client/dist/downloads
cp client/public/downloads/app.apk client/dist/downloads/app.apk 2>/dev/null || echo "⚠️  No APK found, skipping..."
echo ""
echo "🔨 Building and starting containers..."

docker-compose up -d --build

echo ""
echo "🧹 Removing old images..."

docker image prune -f

CURRENT_CLIENT=$(docker-compose images -q client 2>/dev/null)
CURRENT_SERVER=$(docker-compose images -q server 2>/dev/null)

for img in $(docker images --format '{{.ID}}' | grep 'workout-tracker'); do
    if [ "$img" != "$CURRENT_CLIENT" ] && [ "$img" != "$CURRENT_SERVER" ]; then
        docker rmi "$img" 2>/dev/null || true
    fi
done

echo "✅ Image cleanup done!"

docker-compose up -d

echo ""
echo "📋 Container status:"
docker-compose ps

echo ""
echo "✅ Deploy complete!"
