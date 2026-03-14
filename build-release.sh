#!/bin/bash

set -e

echo "🔨 Building Iron Log Android APK..."
echo ""

if ! command -v java &> /dev/null || ! java -version 2>&1 | grep -q "21"; then
    echo "⚠️  Java 21 required. Set JAVA_HOME:"
    echo "    export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
    exit 1
fi

echo "🧹 Cleaning old builds..."
rm -rf client/dist
rm -rf client/android/app/build

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
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
./gradlew clean assembleRelease
cd ../..

echo ""
echo "📦 Copying APK..."
cp client/android/app/build/outputs/apk/release/app-release.apk client/iron-log-release.apk

echo ""
echo "✅ Done!"
echo ""
echo "📍 APK: client/iron-log-release.apk"
ls -lh client/iron-log-release.apk
