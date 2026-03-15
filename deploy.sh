#!/bin/bash
set -e

echo "Building static export..."
npm run build

echo "Preparing deploy package..."
rm -rf deploy
mkdir -p deploy

# Copy static export output
cp -r out/* deploy/

# Copy .htaccess for Apache (404 page, gzip, caching)
cp .htaccess deploy/.htaccess

# Create zip
cd deploy
zip -r ../playground-deploy.zip . -x "*.DS_Store"
cd ..

SIZE=$(du -sh playground-deploy.zip | cut -f1)
FILES=$(unzip -l playground-deploy.zip | tail -1 | awk '{print $2}')

echo ""
echo "Done! Created playground-deploy.zip ($SIZE, $FILES files)"
echo ""
echo "To deploy:"
echo "  1. Upload playground-deploy.zip contents to /home/sixtser1/playground/"
echo "  2. Disable/remove the Node.js app in cPanel (no longer needed)"
echo "  3. Apache serves the static files directly"
