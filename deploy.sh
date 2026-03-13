#!/bin/bash
# Deploy script for manual upload to cPanel
set -e

echo "Building..."
npm run build

echo "Preparing deploy package..."
rm -rf deploy
mkdir -p deploy/.next/standalone


# Find the standalone server.js (handles both flat and worktree nested builds)
STANDALONE_SERVER=$(find .next/standalone -name server.js -not -path "*/node_modules/*" | head -1)
STANDALONE_ROOT=$(dirname "$STANDALONE_SERVER")

echo "  Standalone root: $STANDALONE_ROOT"

# Copy standalone build contents (server.js, .next build artifacts, package.json)
cp -r "$STANDALONE_ROOT"/* deploy/.next/standalone/
cp -r "$STANDALONE_ROOT"/.next deploy/.next/standalone/.next 2>/dev/null || true

# Copy shared node_modules from standalone root
cp -r .next/standalone/node_modules deploy/.next/standalone/node_modules

# Copy static assets and public files into standalone
mkdir -p deploy/.next/standalone/.next
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
