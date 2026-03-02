#!/bin/bash

echo "🧹 Cleaning up old containers..."

docker-compose down 2>/dev/null
docker rm -f workout-server workout-client 2>/dev/null

echo "✅ Cleanup done!"
echo ""
echo "🔨 Building and starting containers..."

docker-compose up -d --build

# Copy APK to dist if it exists
if [ -f "client/android/app/build/outputs/apk/debug/app-release.apk" ]; then
    cp client/android/app/build/outputs/apk/debug/app-release.apk client/dist/
    echo "📱 APK copied to dist/"
fi

echo ""
echo "📋 Container status:"
docker-compose ps

echo ""
echo "✅ Deploy complete!"
