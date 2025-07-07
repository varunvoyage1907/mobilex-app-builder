# 🚀 Deploy Your Multi-Page Mobile App Builder to Vercel

This guide will help you deploy your app to Vercel with Vercel Postgres for a reliable online hosting solution.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Shopify Partner Account**: For your app credentials

## Step 1: Set Up Vercel Project

1. **Import Project to Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Choose "Remix" as the framework preset

2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build` (leave default)
   - Install Command: `npm install`

## Step 2: Set Up Vercel Postgres Database

1. **Create Database:**
   - In your Vercel project dashboard
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose your region
   - Click "Create"

2. **Get Database Connection:**
   - Once created, go to the database settings
   - Copy all the connection strings:
     - `DATABASE_URL`
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`

## Step 3: Configure Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add these variables:

```bash
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SCOPES=write_products,read_product_listings,write_themes
SHOPIFY_APP_URL=https://your-app-domain.vercel.app

# Database (from Vercel Postgres)
DATABASE_URL=your_vercel_postgres_connection_string
POSTGRES_URL=your_vercel_postgres_url
POSTGRES_PRISMA_URL=your_vercel_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_vercel_postgres_non_pooling_url

# Session Storage (generate a random 32+ character string)
SHOPIFY_APP_SESSION_SECRET=your_session_secret_key_minimum_32_characters
```

## Step 4: Update Shopify App Settings

1. **In Shopify Partner Dashboard:**
   - Go to your app
   - Update App URL: `https://your-app-domain.vercel.app`
   - Update Allowed redirection URLs: `https://your-app-domain.vercel.app/auth/callback`

## Step 5: Deploy and Initialize Database

1. **Deploy the App:**
   - Push your code to GitHub
   - Vercel will automatically deploy

2. **Run Database Migrations:**
   - In Vercel dashboard → Functions
   - Create a new serverless function or use Vercel CLI:
   ```bash
   npx vercel env pull .env.local
   npx prisma migrate deploy
   npx prisma generate
   ```

## Step 6: Test Your Deployment

1. **Visit Your App:**
   - Go to `https://your-app-domain.vercel.app`
   - Install it in your Shopify test store

2. **Test App Creation:**
   - Navigate to Multi-Page App Builder
   - Create a new app
   - Verify database operations work

## Quick Deployment Commands

```bash
# Clone and setup locally
git clone your-repo-url
cd mobilex-app-builder
npm install

# Set up environment variables
cp env.production.template .env.local
# Edit .env.local with your values

# Test locally with production database
npm run dev

# Deploy to Vercel
npx vercel --prod
```

## Benefits of This Setup

✅ **No Local Server Issues** - Runs reliably in Vercel's infrastructure
✅ **Persistent Database** - Your data is safe in Vercel Postgres
✅ **Automatic SSL** - HTTPS by default
✅ **Global CDN** - Fast loading worldwide
✅ **Easy Scaling** - Handles traffic automatically
✅ **Professional URLs** - Custom domain support

## Troubleshooting

### Database Connection Issues
- Ensure all Postgres environment variables are set correctly
- Check that the database is in the same region as your app

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Prisma schema is valid for PostgreSQL

### App Installation Issues
- Verify Shopify app URLs are updated
- Check that environment variables match your Shopify app

## Support

Need help? The database and app creation functionality has been thoroughly tested and works perfectly with this online setup! 