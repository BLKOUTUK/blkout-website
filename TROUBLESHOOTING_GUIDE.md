# BLKOUT Website - Troubleshooting Guide

## 🚨 Quick Issue Resolution

This guide helps resolve common issues encountered with the BLKOUT website during development and production.

**Last Updated**: August 1, 2025  
**Version**: 1.0.0

---

## 🔧 Development Issues

### **Build Failures**

#### Issue: `npm run build` fails with TypeScript errors
**Symptoms:**
- Build process stops with TS errors
- Type checking failures in components

**Solutions:**
```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Check TypeScript version compatibility
npm list typescript

# 3. Run type check specifically
npx tsc --noEmit

# 4. Fix common type issues
# - Add proper imports for React types
# - Check component prop types
# - Verify service interface implementations
```

#### Issue: Bundle size warnings during build
**Symptoms:**
- Warning: "Some chunks are larger than 500 kB"
- Slow initial page load

**Solutions:**
```bash
# 1. Analyze bundle composition
npm run build
# Check dist/ folder for chunk sizes

# 2. Implement code splitting (already configured in vite.config.ts)
# - Components are lazy-loaded where appropriate
# - GSAP is dynamically imported in scrollytelling

# 3. Optimize imports
# Instead of: import * as icons from 'lucide-react'
# Use: import { Icon1, Icon2 } from 'lucide-react'
```

### **Development Server Issues**

#### Issue: `npm run dev` fails to start
**Symptoms:**
- Port 5173 already in use
- Module resolution errors

**Solutions:**
```bash
# 1. Kill existing processes
lsof -ti:5173 | xargs kill -9

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Use different port
npm run dev -- --port 3000

# 4. Check for conflicting processes
ps aux | grep vite
```

#### Issue: Hot reload not working
**Symptoms:**
- Changes don't reflect in browser
- Need manual refresh

**Solutions:**
```bash
# 1. Check file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 2. Restart dev server
# Ctrl+C then npm run dev

# 3. Check browser cache
# Hard refresh: Ctrl+Shift+R
```

---

## 🎬 Video Playback Issues

### **Welcome Video Not Displaying**

#### Issue: Video shows as black screen or loading indefinitely
**Symptoms:**
- Black rectangle where video should be
- Loading spinner that never completes
- Console errors about video loading

**Solutions:**
```bash
# 1. Verify video file existence and path
ls -la public/images/squared/
# Should show: "Finalfinalwelcome SQUARED.mp4"

# 2. Check video file format and encoding
ffprobe "public/images/squared/Finalfinalwelcome SQUARED.mp4"
# Should be H.264 MP4 format

# 3. Test video accessibility
curl -I http://localhost:5173/images/squared/Finalfinalwelcome%20SQUARED.mp4
# Should return 200 OK

# 4. Browser compatibility check
# - Try different browsers (Chrome, Firefox, Safari)
# - Check browser console for errors
# - Verify autoplay policies are not blocking
```

#### Issue: Video plays on desktop but not mobile
**Symptoms:**
- Desktop playback works fine
- Mobile shows poster or black screen

**Solutions:**
```javascript
// Ensure video element has proper mobile attributes
<video 
  autoPlay 
  muted 
  loop 
  playsInline  // Critical for iOS
  preload="auto"
  // ... other props
>
```

---

## 🤖 IVOR Integration Issues

### **IVOR Backend Connection Problems**

#### Issue: "IVOR is offline" status
**Symptoms:**
- Red/amber status indicator
- Chat interface disabled
- Connection timeout errors

**Solutions:**
```bash
# 1. Check if IVOR backend is running
curl http://localhost:3001/api/health
# Should return status 200

# 2. Start IVOR backend (from backend directory)
cd /path/to/ivor/backend
python main_working.py

# 3. Check backend logs for errors
tail -f logs/ivor.log

# 4. Verify environment variables
# Check .env file has correct API endpoints
```

#### Issue: IVOR responds but answers don't make sense
**Symptoms:**
- Generic responses to specific questions
- No contextual awareness
- Fallback responses always used

**Solutions:**
```bash
# 1. Check pathway context is being passed
# Open browser dev tools → Network tab
# Look for POST requests to /api/chat
# Verify request body includes context

# 2. Check backend AI model status
# Review backend logs for model loading
# Ensure sufficient memory for AI processing

# 3. Verify service configuration
# Check ivorService.ts for correct endpoint URLs
```

---

## 📅 Events Calendar Issues

### **Events Not Loading**

#### Issue: Events page shows "No events found" or loading spinner
**Symptoms:**
- Empty events calendar
- Continuous loading state
- Console errors about API calls

**Solutions:**
```bash
# 1. Check events service connection
curl http://localhost:3002/api/health
# Should return 200 if backend is running

# 2. Verify fallback data is working
# Open browser dev tools → Console
# Look for "Events backend not available" warnings

# 3. Check service configuration
# Verify eventsService.ts has correct endpoints
# Test fallback event data display
```

#### Issue: Events display but images are broken
**Symptoms:**
- Event cards show but no images
- Broken image icons
- 404 errors for image requests

**Solutions:**
```bash
# 1. Check image file paths
ls -la public/images/events/
# Verify event image files exist

# 2. Update image URLs in event data
# Ensure paths match actual file locations
# Use relative paths: "/images/events/filename.jpg"

# 3. Test image accessibility
curl -I http://localhost:5173/images/events/sample-event.jpg
```

---

## 🎨 Styling and Layout Issues

### **Tailwind CSS Not Working**

#### Issue: Classes not applying, default styles showing
**Symptoms:**
- Components look unstyled
- Tailwind classes have no effect
- Only browser default styles visible

**Solutions:**
```bash
# 1. Verify Tailwind is installed and configured
npm list tailwindcss
cat tailwind.config.js

# 2. Check CSS import in main file
# Ensure index.css imports Tailwind directives
grep -n "@tailwind" src/index.css

# 3. Rebuild with fresh cache
rm -rf node_modules/.vite
npm run build
```

#### Issue: Custom color themes not working
**Symptoms:**
- Platform sections show default colors
- Gradient backgrounds not displaying
- Color variables undefined

**Solutions:**
```bash
# 1. Check Tailwind config includes custom colors
grep -A 10 "colors:" tailwind.config.js

# 2. Verify CSS custom properties
# Check if --blkout-primary variables are defined

# 3. Test color application
# Use browser dev tools to inspect computed styles
```

---

## 🔀 Navigation and Routing Issues

### **404 Errors on Direct URL Access**

#### Issue: Direct navigation to /events, /ivor etc. shows 404
**Symptoms:**
- Home page works fine
- Direct URL navigation fails
- Refresh on any page shows 404

**Solutions (Development):**
```bash
# This is expected in development
# Vite dev server handles SPA routing automatically
# If still occurring, check vite.config.ts
```

**Solutions (Production):**
```nginx
# Ensure server configuration handles SPA routing
# Nginx example:
location / {
    try_files $uri $uri/ /index.html;
}

# Apache example (.htaccess):
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### **Navigation Menu Not Responsive**

#### Issue: Mobile menu doesn't open/close properly
**Symptoms:**
- Hamburger menu doesn't respond to clicks
- Menu stays open when it should close
- Overlapping content on mobile

**Solutions:**
```javascript
// Check for JavaScript errors in console
// Verify mobile menu state management
// Test touch events on actual devices
```

---

## 📱 Mobile and Browser Compatibility

### **Mobile Layout Issues**

#### Issue: Content overflows on mobile devices
**Symptoms:**
- Horizontal scrollbars on mobile
- Text too small to read
- Buttons too small to tap

**Solutions:**
```css
/* Check viewport meta tag in index.html */
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

/* Verify responsive classes are applied */
/* Use: sm:, md:, lg:, xl: prefixes appropriately */
```

#### Issue: Performance issues on mobile
**Symptoms:**
- Slow loading on mobile networks
- Janky animations
- High memory usage

**Solutions:**
```bash
# 1. Optimize images
# Use appropriate formats (WebP, AVIF)
# Implement lazy loading
# Compress large images

# 2. Reduce JavaScript bundle size
npm run build
# Check chunk sizes in dist/

# 3. Test on actual devices
# Use Chrome DevTools Device Mode
# Test on various network speeds
```

---

## 🔍 Debug Mode and Logging

### **Enable Debug Logging**

```javascript
// Add to browser console for verbose logging
localStorage.setItem('blkout-debug', 'true')

// Check service status
console.log('IVOR Status:', ivorService.getConnectionStatus())
console.log('Events Status:', eventsService.getConnectionStatus())
```

### **Common Console Commands**

```javascript
// Check React component state
// Open React DevTools → Components tab
// Select component → View props/state

// Network debugging
// Open DevTools → Network tab
// Filter by Fetch/XHR to see API calls
// Check request/response headers and data

// Performance monitoring
// Open DevTools → Performance tab
// Record page interaction
// Analyze bottlenecks
```

---

## 🆘 Emergency Procedures

### **Site Completely Down**

1. **Quick Health Check:**
```bash
curl -f https://blkoutuk.com/
curl -f http://localhost:5173/ # Development
```

2. **Rollback Process:**
```bash
# If recent deployment caused issues
git log --oneline -10
git revert <commit-hash>
npm run build
# Redeploy
```

3. **Emergency Contacts:**
- Technical Support: [technical@blkoutuk.com]
- Emergency Contact: [emergency@blkoutuk.com]

### **Performance Crisis**

1. **Immediate Actions:**
```bash
# Check server resources
htop # or top
df -h # disk space
free -m # memory usage
```

2. **Quick Optimizations:**
```bash
# Enable compression
# Check CDN status
# Restart services if needed
```

---

## 📋 Health Check Checklist

Use this checklist to verify system health:

### **Frontend Health**
- [ ] Home page loads without errors
- [ ] Navigation works on all pages
- [ ] Videos play correctly
- [ ] Mobile responsiveness works
- [ ] No console errors

### **Backend Services Health**
- [ ] IVOR responds to health check
- [ ] Events service returns data
- [ ] All API endpoints respond
- [ ] Database connections stable

### **Performance Health**
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 80
- [ ] No memory leaks detected
- [ ] Bundle size within limits

---

## 🔗 Quick Reference Links

- **GitHub Repository**: [https://github.com/BLKOUTUK/blkout-website]
- **Production Site**: [https://blkoutuk.com]
- **Documentation**: [Production Deployment Guide](PRODUCTION_DEPLOYMENT_GUIDE.md)
- **System Status**: [Internal monitoring dashboard]

---

*Generated by Claude Code Deployment Swarm*  
*For BLKOUT Website Support*