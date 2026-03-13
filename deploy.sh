#!/bin/bash
# Deploy script for manual upload to cPanel
set -e

echo "Building..."
npm run build

echo "Preparing deploy package..."
rm -rf deploy
mkdir -p deploy/.next/standalone

# Copy standalone build (includes server.js + node_modules)
cp -r .next/standalone/* deploy/.next/standalone/

# Copy static assets and public files into standalone
cp -r .next/static deploy/.next/standalone/.next/static
cp -r public deploy/.next/standalone/public

# Copy Passenger wrapper
cp server.js deploy/server.js

# Create zip
cd deploy
zip -r ../playground-deploy.zip . -x "*.DS_Store"
cd ..

echo ""
echo "Done! Created playground-deploy.zip"
echo ""
echo "To deploy:"
echo "  1. Upload playground-deploy.zip contents to /[server path]"
echo "  2. Restart the app in cPanel"
