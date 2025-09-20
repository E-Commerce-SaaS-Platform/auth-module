#!/bin/bash

# Publish script for GitHub Package Registry
# Usage: ./scripts/publish.sh [version]

set -e

# Get version from argument or prompt
VERSION=${1:-""}

if [ -z "$VERSION" ]; then
    echo "Enter version (e.g., 1.0.0):"
    read VERSION
fi

# Validate version format
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Version must be in format x.y.z (e.g., 1.0.0)"
    exit 1
fi

echo "Publishing version $VERSION..."

# Update package.json version
npm version $VERSION --no-git-tag-version

# Build the package
npm run build

# Run tests
npm test

# Publish to GitHub Package Registry
npm publish

echo "Successfully published @E-Commerce-SaaS-Platform/auth-module@$VERSION"
echo "To install in other projects:"
echo "yarn add @E-Commerce-SaaS-Platform/auth-module"
