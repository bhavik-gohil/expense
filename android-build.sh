#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Android Build Process..."

# 1. Build the Next.js app
echo "📦 Building Next.js static files..."
npm run build

# 2. Sync files with Capacitor
echo "🔄 Syncing assets to Android project..."
npx cap sync android

echo "✅ Build and Sync complete!"
echo "🛠️ To open the project in Android Studio, run: npx cap open android"
