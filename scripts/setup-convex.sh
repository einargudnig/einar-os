#!/bin/bash

echo "🚀 Setting up Convex for Baby Prediction Market"
echo ""
echo "This script will help you initialize Convex for real-time database sync."
echo ""

# Check if convex CLI is installed
if ! command -v convex &> /dev/null; then
    echo "❌ Convex CLI not found. Installing..."
    brew install convex
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Convex CLI. Please visit https://convex.dev/docs/quickstart to install manually."
        exit 1
    fi
    echo "✅ Convex CLI installed successfully!"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Run: npx convex dev"
echo "   - This will prompt you to log in to Convex"
echo "   - Creates a new project for you"
echo "   - Generates TypeScript types"
echo "   - Adds NEXT_PUBLIC_CONVEX_URL to .env.local"
echo ""
echo "2. In another terminal, run: npm run dev"
echo "   - Starts the Next.js development server"
echo ""
echo "3. Visit http://localhost:3000/baby"
echo "   - Start voting and see real-time updates!"
echo ""
echo "📖 See CONVEX_SETUP.md for more details"
