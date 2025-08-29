# Chrome Extension Production Deployment Guide

## 🚀 Production Deployment Requirements

### **✅ NO MANUAL CHANGES NEEDED**
Good news! Since you're deploying to `blkout-beta.vercel.app`, the Chrome extension is already configured correctly and will work without modifications.

### Current Configuration (Already Correct)
```javascript
// Extension already configured for beta deployment
API fallback: 'https://blkout-beta.vercel.app/api'
Host permissions: 'https://blkout-beta.vercel.app/*'
Extension API detection: window.location.hostname === 'blkout-beta.vercel.app'
```

## 📦 Extension Versions

### Development Version (v1.1.2)
- **File**: `blkout-extension/` folder
- **URL**: `http://localhost:5173`
- **Purpose**: Local development and testing

### Production Version (v1.1.2)
- **File**: `blkout-extension-production/` folder  
- **URL**: `https://blkout-beta.vercel.app`
- **Purpose**: Beta production deployment

## 🔄 Deployment Process

### 1. **Website Deployment**
```bash
# Deploy website to blkout-beta.vercel.app
npm run build
# Vercel automatically deploys
```

### 2. **Extension Deployment** 
```bash
# Extension is already production-ready
# No changes needed for blkout-beta.vercel.app
```

### 3. **Extension Package Update**
The website automatically serves the correct extension:
- **Download URL**: `/blkout-extension-v1.1.2.tar.gz`
- **Version**: v1.1.2 (already updated in ChromeExtensionWidget)

## 🔧 How Extension Connects to Production

### Primary Method (Preferred)
1. Extension opens popup on `blkout-beta.vercel.app`
2. Accesses `window.BlkoutExtensionApi` (already imported in App.tsx)
3. Submits directly through Supabase

### Fallback Method
1. Extension makes direct API calls to `https://blkout-beta.vercel.app/api`
2. Handles responses and errors appropriately

## 📊 Extension Schema Alignment

### Events Submission
```javascript
{
  title, description, location, status: 'pending',
  event_date: date, start_time: time,
  source: 'chrome-extension', source_url, 
  tags: 'community-submitted'
}
```

### Articles Submission  
```javascript
{
  title, excerpt, content, category: 'community',
  source: 'chrome-extension', status: 'draft',
  tags: 'community-submitted', source_url
}
```

## 🎯 Post-Deployment Checklist

### After Website Deployment to blkout-beta.vercel.app:

1. **✅ Extension Auto-Detection** - Extension will automatically detect the production URL
2. **✅ API Integration** - Extension API is already imported in App.tsx  
3. **✅ Database Submissions** - Events/articles submit to correct Supabase tables
4. **✅ Admin Dashboard** - Submissions appear in admin panels immediately
5. **✅ Version Management** - Extension widget shows v1.1.2

### Testing Steps:
1. Load extension from `blkout-extension-v1.1.2.tar.gz`
2. Visit any event/news website
3. Use extension to submit content
4. Check admin dashboard at `/admin` for submissions

## 🔄 Future URL Changes

### If Moving to Custom Domain Later:
```javascript
// Only these files need URL updates:
// 1. blkout-extension-production/popup/popup.js
//    - Change: 'blkout-beta.vercel.app' → 'new-domain.com'
// 2. blkout-extension-production/manifest.json  
//    - Update host_permissions array
// 3. blkout-extension-production/background.js
//    - Update API_BASE URL
```

## 📝 Current Status

**🟢 PRODUCTION READY**: Extension v1.1.2 is fully configured for `blkout-beta.vercel.app` deployment. No manual changes required when publishing website to production.

**🔗 Connection Status**: Fixed - Extension connects successfully to admin dashboards and Supabase database.

**📋 Admin Integration**: Complete - Submissions appear immediately in Events and Newsroom admin panels.