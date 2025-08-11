#!/bin/bash

# RPI-5Inch Showcase App - Raspberry Pi Startup Script with GBM Error Suppression
# This script completely suppresses GBM and DMA buffer errors

echo "🚀 Starting RPI-5Inch Showcase App with GBM Error Suppression..."
echo ""

# Set aggressive environment variables to suppress GBM errors
export ELECTRON_DISABLE_GPU_SANDBOX=1
export ELECTRON_DISABLE_GPU_PROCESS=1
export ELECTRON_DISABLE_ACCELERATED_2D_CANVAS=1
export ELECTRON_DISABLE_WEBGL=1
export ELECTRON_DISABLE_3D_APIS=1

# Force software rendering
export LIBGL_ALWAYS_SOFTWARE=1
export LIBGL_ALWAYS_INDIRECT=1
export MESA_GL_VERSION_OVERRIDE=3.3
export MESA_GLSL_VERSION_OVERRIDE=330

# Disable problematic graphics features
export DISABLE_GPU=1
export DISABLE_GPU_PROCESS=1
export DISABLE_GPU_SANDBOX=1
export DISABLE_GPU_COMPOSITING=1
export DISABLE_GPU_RASTERIZATION=1

# Set Node.js options for better performance
export NODE_OPTIONS="--max-old-space-size=512"

# Redirect stderr to suppress GBM errors at the shell level
exec 2> >(grep -v -E "(gbm_wrapper|Failed to get fd for plane|Failed to export buffer to dma_buf|No such file or directory|gbm_|dma_buf|plane)")

echo "Environment variables set:"
echo "  ELECTRON_DISABLE_GPU_SANDBOX=1"
echo "  ELECTRON_DISABLE_GPU_PROCESS=1"
echo "  ELECTRON_DISABLE_ACCELERATED_2D_CANVAS=1"
echo "  ELECTRON_DISABLE_WEBGL=1"
echo "  ELECTRON_DISABLE_3D_APIS=1"
echo "  LIBGL_ALWAYS_SOFTWARE=1"
echo "  LIBGL_ALWAYS_INDIRECT=1"
echo "  MESA_GL_VERSION_OVERRIDE=3.3"
echo "  MESA_GLSL_VERSION_OVERRIDE=330"
echo "  DISABLE_GPU=1"
echo "  NODE_OPTIONS=--max-old-space-size=512"
echo ""

echo "Starting app with GBM error suppression..."
echo ""

# Start the app with the suppressed stderr
cd ~/RPI-5Inch
npm start 2>/dev/null

echo ""
echo "App has exited."
