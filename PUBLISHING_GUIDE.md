# 📱 MobileX App Builder - Publishing Guide

## 🚀 How to Publish Your Mobile App to App Stores

### 📋 **PREREQUISITES**

**Developer Accounts:**
- 🍎 **Apple Developer Account** - $99/year (required for App Store)
- 🤖 **Google Play Developer Account** - $25 one-time (required for Play Store)

**Required Assets:**
- 📷 App Icon (1024x1024px PNG)
- 🖼️ App Screenshots (various sizes)
- 📝 App Description & Metadata
- 🔒 Privacy Policy URL
- ⚖️ Terms of Service (optional)

---

## 🎨 **STEP 1: Prepare Your App Assets**

### 1.1 Create App Icon
```bash
# Place your 1024x1024px app icon here:
resources/icon.png
```

### 1.2 Generate All Icon Sizes
```bash
# Generate icons for all platforms
npx @capacitor/assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#000000'
```

### 1.3 Create Screenshots
**iPhone Screenshots (required):**
- 6.7" iPhone 14 Pro Max: 1290×2796px
- 6.1" iPhone 14 Pro: 1179×2556px
- 5.5" iPhone 8 Plus: 1242×2208px

**Android Screenshots (required):**
- Phone: 320×568px to 3840×2160px
- Tablet: 1024×768px to 3840×2160px

---

## 🏗️ **STEP 2: Build Your App**

### 2.1 Build for Android (Google Play Store)
```bash
# Build the web app
npm run build

# Sync with native project
npx cap sync

# Open in Android Studio
npx cap open android
```

**In Android Studio:**
1. Select **Build > Generate Signed Bundle/APK**
2. Choose **Android App Bundle**
3. Create/use your keystore file
4. Build release version

### 2.2 Build for iOS (Apple App Store)
```bash
# Add iOS platform (if not already added)
npx cap add ios

# Sync with native project
npx cap sync

# Open in Xcode
npx cap open ios
```

**In Xcode:**
1. Select your team/developer account
2. Choose **Product > Archive**
3. Upload to App Store Connect

---

## 🏪 **STEP 3: Publish to Google Play Store**

### 3.1 Create App on Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in app details:
   - App name: "MobileX App Builder"
   - Default language: English
   - App or game: App
   - Free or paid: Free

### 3.2 Upload Your App
1. Go to **Release > Production**
2. Click **Create new release**
3. Upload your `.aab` file (Android App Bundle)
4. Fill in release notes

### 3.3 Store Listing
```
App Name: MobileX App Builder
Short Description: Create professional mobile apps for your Shopify store
Full Description: 
Build beautiful mobile apps for your Shopify store with our intuitive drag-and-drop interface. Features include:
• Drag & drop mobile app builder
• Real-time preview
• Shopify integration
• Professional templates
• One-click publishing
Perfect for merchants who want to create mobile apps without coding.

Category: Business
Content Rating: Everyone
```

### 3.4 Submit for Review
1. Complete all required sections
2. Submit for review (usually 1-3 days)

---

## 🍎 **STEP 4: Publish to Apple App Store**

### 4.1 Create App on App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps > +**
3. Select **New App**
4. Fill in app information:
   - Platform: iOS
   - Name: "MobileX App Builder"
   - Primary Language: English
   - Bundle ID: com.mobilex.app
   - SKU: com.mobilex.app.2024

### 4.2 App Information
```
App Name: MobileX App Builder
Subtitle: Shopify Mobile App Builder
Category: Business
Content Rights: No, it does not contain, show, or access third-party content

Description:
Create professional mobile apps for your Shopify store with MobileX App Builder. Our intuitive drag-and-drop interface makes it easy to build beautiful mobile experiences.

FEATURES:
• Drag & drop mobile app builder
• Real-time mobile preview
• Seamless Shopify integration
• Professional mobile templates
• One-click app publishing
• Customizable components

Perfect for Shopify merchants who want to create mobile apps without any coding knowledge.

Keywords: shopify, mobile app, builder, ecommerce, business, store
```

### 4.3 Pricing and Availability
- Price: Free
- Availability: All countries/regions

### 4.4 Upload Screenshots
- Upload screenshots for all required device sizes
- Include captions explaining features

### 4.5 Submit for Review
1. Upload your app binary from Xcode
2. Complete App Review Information
3. Submit for review (usually 1-7 days)

---

## 🔧 **STEP 5: App Store Optimization (ASO)**

### 5.1 Keywords Research
**Google Play Keywords:**
- shopify mobile app
- mobile app builder
- ecommerce app
- business app builder
- drag drop app builder

**App Store Keywords:**
- shopify,mobile,app,builder,ecommerce,business,store,creator,design,template

### 5.2 App Updates
```bash
# For updates, increment version in:
# - package.json
# - android/app/build.gradle (versionCode & versionName)
# - ios project settings (CFBundleVersion & CFBundleShortVersionString)

# Then rebuild and resubmit
npm run build
npx cap sync
```

---

## 📊 **STEP 6: Post-Launch**

### 6.1 Monitor Reviews
- Respond to user reviews
- Fix reported issues quickly
- Update app regularly

### 6.2 Analytics
- Set up Google Analytics
- Monitor app performance
- Track user engagement

### 6.3 Marketing
- Create app landing page
- Social media promotion
- Email marketing to existing users

---

## 🛟 **TROUBLESHOOTING**

### Common Issues:
1. **App Rejected**: Check rejection reasons and fix issues
2. **Build Errors**: Ensure all dependencies are compatible
3. **Icon Issues**: Use exact pixel dimensions required
4. **Permissions**: Declare all required permissions properly

### Getting Help:
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Google Play Developer Guide](https://developer.android.com/distribute/google-play)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

## 🎯 **ESTIMATED TIMELINE**

- **Preparation**: 2-3 days
- **Development & Testing**: 3-5 days
- **App Store Submission**: 1 day
- **Review Process**: 1-7 days
- **Total**: 1-2 weeks

---

**🎉 Congratulations! Your mobile app is now ready for the world!**

For additional support, contact our development team or check the documentation. 