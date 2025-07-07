#!/bin/bash

echo "🗄️  Setting up database for Multi-Page Mobile App Builder"
echo "========================================================"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable not set!"
    echo "📋 Please ensure your Vercel Postgres connection string is configured."
    exit 1
fi

echo "✅ Database connection found"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "Your database now includes:"
    echo "- 📱 App model (for multi-page apps)"
    echo "- 📄 Page model (for individual pages)"
    echo "- 🎨 Template model (for page templates)"
    echo "- 👤 Session model (for Shopify authentication)"
    echo "- ⚙️  PdpConfig model (for product page config)"
    echo ""
    echo "🎉 Ready to create multi-page mobile apps!"
else
    echo "❌ Migration failed. Check your database connection and try again."
    exit 1
fi 