#!/bin/bash

echo "🚀 Deploying Mobile App Builder to Vercel"
echo "========================================"

# Check if environment variables are set
if [ ! -f ".env.local" ]; then
    echo "❌ Environment file .env.local not found!"
    echo "📋 Please copy env.production.template to .env.local and fill in your values."
    echo ""
    echo "Quick setup:"
    echo "cp env.production.template .env.local"
    echo "# Edit .env.local with your Shopify and Vercel Postgres credentials"
    exit 1
fi

echo "✅ Environment file found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Build the app
echo "🏗️  Building the app..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npm run deploy:vercel

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to your Vercel dashboard to get your app URL"
echo "2. Update your Shopify app settings with the new URL"
echo "3. Run database migrations in Vercel (see DEPLOYMENT_GUIDE.md)"
echo "4. Test your app creation functionality"
echo ""
echo "🎉 Your Multi-Page Mobile App Builder is now live!" 