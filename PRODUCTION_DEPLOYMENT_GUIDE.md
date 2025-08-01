# BLKOUT Website - Production Deployment Guide

## 🚀 Overview

This guide provides comprehensive instructions for deploying the BLKOUT website to production, including all integrated services and systems.

**Last Updated**: August 1, 2025  
**Version**: 1.0.0 (Production Ready)

---

## 📋 Pre-Deployment Checklist

### ✅ **System Requirements**
- [ ] Node.js 18+ installed
- [ ] Python 3.8+ for IVOR backend
- [ ] Domain configured with SSL certificate
- [ ] Production server with adequate resources (4GB+ RAM, 2+ CPU cores)
- [ ] Database access (if using external data sources)

### ✅ **Environment Configuration**
- [ ] Production environment variables set
- [ ] API endpoints configured for production
- [ ] IVOR backend deployed and accessible
- [ ] Events calendar backend connected
- [ ] CDN configured for media assets

---

## 🔧 Deployment Process

### **Step 1: Clone and Setup**

```bash
# Clone the repository
git clone https://github.com/BLKOUTUK/blkout-website.git
cd blkout-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.production
# Edit .env.production with production values
```

### **Step 2: Configure Production Environment**

Create `.env.production` with the following variables:

```env
# Production Configuration
NODE_ENV=production
VITE_APP_ENV=production

# API Endpoints
VITE_IVOR_API_URL=https://ivor.blkoutuk.com/api
VITE_EVENTS_API_URL=https://events.blkoutuk.com/api
VITE_NEWSROOM_API_URL=https://newsroom.blkoutuk.com/api

# Production Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

### **Step 3: Build for Production**

```bash
# Build the application
npm run build

# Verify build output
ls -la dist/

# Test production build locally (optional)
npm run preview
```

### **Step 4: Deploy Static Assets**

```bash
# Deploy to your hosting provider
# Examples for common platforms:

# Netlify
npm install -g netlify-cli
netlify deploy --dir=dist --prod

# Vercel
npm install -g vercel
vercel --prod

# Traditional server
rsync -avz dist/ user@server:/var/www/blkout-website/
```

---

## 🖥️ Server Configuration

### **Nginx Configuration**

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name blkoutuk.com www.blkoutuk.com;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
    
    root /var/www/blkout-website;
    index index.html;
    
    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### **Apache Configuration (.htaccess)**

```apache
# Handle React Router
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<filesMatch "\.(css|jpg|jpeg|png|gif|js|ico|svg|mp4)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</filesMatch>
```

---

## 🧩 Backend Services Setup

### **IVOR Backend Deployment**

```bash
# Navigate to IVOR backend
cd /path/to/ivor/backend

# Install Python dependencies
pip install -r requirements.production.txt

# Configure environment
cp .env.example .env.production

# Start IVOR service
python main_working.py

# Or use systemd service
sudo systemctl enable ivor-backend
sudo systemctl start ivor-backend
```

### **Events Calendar Integration**

```bash
# Deploy events calendar backend
cd /path/to/events-calendar

# Install dependencies
npm install

# Configure production environment
cp .env.example .env.production

# Start events service
npm run start:production
```

---

## 🔒 Security Configuration

### **Environment Variables**

Ensure these are set in production:

```env
# Security
VITE_ENABLE_CSP=true
VITE_ALLOWED_ORIGINS=https://blkoutuk.com,https://www.blkoutuk.com

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_HOTJAR_ID=XXXXXXX
```

### **Content Security Policy**

```javascript
// In index.html or via server headers
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https://ivor.blkoutuk.com https://events.blkoutuk.com;"
```

---

## 📊 Monitoring & Analytics

### **Health Checks**

Create monitoring endpoints:

```bash
# Check website availability
curl -f https://blkoutuk.com/

# Check IVOR backend
curl -f https://ivor.blkoutuk.com/api/health

# Check events calendar
curl -f https://events.blkoutuk.com/api/health
```

### **Performance Monitoring**

```javascript
// Add to index.html for performance tracking
<script>
  // Track Core Web Vitals
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log(entry.name, entry.value);
    }
  }).observe({entryTypes: ['measure']});
</script>
```

---

## 🚨 Troubleshooting

### **Common Issues**

| Issue | Symptom | Solution |
|-------|---------|----------|
| White screen | Blank page after deployment | Check browser console for errors, verify build output |
| 404 on routes | Direct URL access fails | Configure server for SPA routing |
| IVOR not working | Chat interface unresponsive | Check IVOR backend status and API connectivity |
| Videos not playing | Welcome video shows error | Verify video file paths and browser compatibility |
| Slow loading | Performance issues | Enable compression, check bundle size |

### **Debug Commands**

```bash
# Check build output
npm run build && ls -la dist/

# Test production build locally
npm run preview

# Check for console errors
# Open browser dev tools → Console tab

# Verify API connectivity
curl -v https://ivor.blkoutuk.com/api/health
```

---

## 📈 Performance Optimization

### **Bundle Analysis**

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npm run build -- --analyze
```

### **Optimization Checklist**

- [ ] Images optimized and served via CDN
- [ ] Code splitting implemented for large components
- [ ] Lazy loading for non-critical resources
- [ ] Compression enabled (Gzip/Brotli)
- [ ] Caching headers configured
- [ ] Service worker for offline functionality (optional)

---

## 🔄 Maintenance

### **Regular Updates**

```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Rebuild and redeploy
npm run build
# Deploy updated files
```

### **Backup Strategy**

- [ ] Regular database backups (if applicable)
- [ ] Source code versioning with Git tags
- [ ] Configuration files backup
- [ ] Media assets backup

---

## 📞 Support Information

**Technical Support**: [technical@blkoutuk.com]  
**Emergency Contact**: [emergency@blkoutuk.com]  
**Documentation**: [docs.blkoutuk.com]

**Monitoring Dashboards**:
- Website uptime: [monitor.blkoutuk.com]
- Performance metrics: [analytics.blkoutuk.com]

---

*Generated by Claude Code Deployment Swarm*  
*For BLKOUT Production Deployment*