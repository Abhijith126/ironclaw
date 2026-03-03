#!/bin/bash

set -e

echo "🔨 Building Iron Log Release APK..."
echo ""

echo "📦 Building web assets..."
cd client
npm run build

echo ""
echo "🤖 Building Android APK..."
cd android
./gradlew assembleRelease

echo ""
echo "📁 Copying APK to public and dist folders..."
cp app/build/outputs/apk/release/app-release.apk ../../public/
cp app/build/outputs/apk/release/app-release.apk ../../dist/

echo ""
echo "✅ Release APK built successfully!"
echo ""
echo "📍 APK locations:"
echo "   - client/public/app-release.apk"
echo "   - client/dist/app-release.apk"
