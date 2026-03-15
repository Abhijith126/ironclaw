#!/bin/bash

set -e

echo "🔨 Building Iron Log Android APK..."
echo ""

export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home

if [ ! -d "$JAVA_HOME" ]; then
    echo "⚠️  Java 21 not found at $JAVA_HOME"
    echo "   Install with: brew install openjdk@21"
    exit 1
fi

echo "🧹 Cleaning old builds..."
rm -rf client/dist
rm -rf client/android/app/build
rm -rf client/android/.gradle
rm -rf client/public/downloads

echo ""
echo "📦 Building web assets..."
cd client
npm run build
cd ..

echo ""
echo "🤖 Syncing to Android..."
cd client
npx cap sync android
cd ..

echo ""
echo "🔨 Building Android APK..."
cd client/android
./gradlew clean assembleRelease
cd ../..

echo ""
echo "📦 Copying APK..."
mkdir -p client/public/downloads
cp client/android/app/build/outputs/apk/release/app-release.apk client/public/downloads/app.apk

echo ""
echo "✅ Done!"
echo ""
echo "📍 Web APK: /downloads/app.apk"
ls -lh client/public/downloads/app.apk
