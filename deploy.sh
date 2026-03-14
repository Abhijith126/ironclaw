#!/bin/bash

set -e

echo "🧹 Cleaning old builds..."

rm -rf client/dist
rm -rf client/android/app/build

echo "✅ Clean done!"
echo ""
echo "🔨 Building frontend..."

cd client
npm run build
cd ..

echo ""
echo "🔨 Syncing to Android..."

cd client
npx capacitor sync android
cd ..

echo ""
echo "🔨 Building Android APK..."

cd client/android
./gradlew clean assembleRelease
cd ../..

echo ""
echo "📦 Copying APK..."

cp client/android/app/build/outputs/apk/release/app-release.apk client/iron-log-release.apk

echo ""
echo "✅ Build complete! APK at: client/iron-log-release.apk"
ls -lh client/iron-log-release.apk
