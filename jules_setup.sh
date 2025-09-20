#!/bin/bash
# This script prepares the environment for the deepthought_web project on Jules.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Installing all project dependencies..."
npm install

echo "Running a production build to verify..."
npm run build

echo "Jules environment setup and verification complete."
