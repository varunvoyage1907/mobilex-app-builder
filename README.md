# 📱 MobileX App Builder - Multi-Page Mobile App Creator

Build complete multi-page mobile apps with ease! Create professional mobile applications with multiple pages like Home, Products, Collections, Cart, and more.

## 🚀 Quick Start Options

### Option 1: Online Deployment (Recommended)
Deploy to Vercel for reliable, professional hosting with persistent database:

```bash
# 1. Set up environment variables
cp env.production.template .env.local
# Edit .env.local with your Shopify and Vercel Postgres credentials

# 2. Deploy with one command
./deploy.sh
```

**Benefits:**
- ✅ No local server issues
- ✅ Persistent cloud database
- ✅ Professional URLs
- ✅ Automatic scaling
- ✅ Global CDN

### Option 2: Local Development
For local development and testing:

```bash
npm install
npm run dev
```

## 📖 Complete Deployment Guide

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions on:
- Setting up Vercel hosting
- Configuring Vercel Postgres database
- Environment variables setup
- Shopify app configuration

## ✨ Features

### 🎯 Multi-Page App Builder
- **Complete Apps**: Create full mobile apps with multiple pages
- **Page Types**: Home, Products, Collections, Cart, Profile, and more
- **Visual Builder**: Drag-and-drop interface for each page
- **Real-time Preview**: See your app as you build it

### 🧩 Component System
- **Headers & Navigation**: Mobile-optimized navigation components
- **Product Displays**: Grid views, carousels, featured products
- **Content Blocks**: Text, images, buttons, and custom sections
- **Interactive Elements**: Forms, search, filters

### 💾 Database Management
- **App Storage**: Save and load complete multi-page apps
- **Template System**: Reusable page templates
- **Version Control**: Track app versions and updates

## 🛠 Tech Stack

- **Framework**: Remix + React
- **Database**: PostgreSQL (Vercel Postgres)
- **Hosting**: Vercel
- **Styling**: Shopify Polaris
- **State Management**: React Hooks
- **Drag & Drop**: @dnd-kit

## 📁 Project Structure

```
mobilex-app-builder/
├── app/
│   ├── routes/
│   │   ├── app.multi-builder.tsx    # Multi-page app builder
│   │   ├── app.builder.tsx          # Single page builder
│   │   ├── app.templates.tsx        # Template management
│   │   └── api/                     # API routes
│   └── components/                  # Reusable components
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── deploy.sh                       # Deployment script
├── migrate-db.sh                   # Database setup script
└── DEPLOYMENT_GUIDE.md             # Complete deployment guide
```

## 🚀 Quick Commands

```bash
# Development
npm run dev                 # Start local development server

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run database migrations
npm run db:push            # Push schema changes

# Deployment
./deploy.sh                # Deploy to Vercel
./migrate-db.sh            # Set up database on Vercel
npm run deploy:vercel      # Direct Vercel deployment
```

## 🎉 What You Can Build

### E-commerce Mobile Apps
- Product browsing pages
- Shopping cart and checkout
- User profiles and orders
- Product collections and search

### Content Apps
- Blog-style content pages
- Image galleries and portfolios
- Information and service pages
- Contact and form pages

### Business Apps
- Service showcases
- Appointment booking flows
- Company information pages
- Customer support interfaces

## 🔧 Configuration

### Environment Variables (Production)
```bash
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=https://your-app-domain.vercel.app

# Database (Vercel Postgres)
DATABASE_URL=your_vercel_postgres_connection_string

# Session Storage
SHOPIFY_APP_SESSION_SECRET=your_session_secret_key
```

## 📞 Support

- 📖 **Documentation**: See DEPLOYMENT_GUIDE.md
- 🐛 **Issues**: Database and app creation functionality fully tested
- 💡 **Features**: Multi-page app builder with persistent storage

## 🎯 Next Steps

1. **Deploy**: Follow the DEPLOYMENT_GUIDE.md
2. **Create**: Build your first multi-page mobile app
3. **Customize**: Add your own components and styling
4. **Scale**: Deploy to production for your clients

---

**Ready to build amazing mobile apps?** Start with the online deployment for the best experience!
