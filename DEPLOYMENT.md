# BLKOUT Website Deployment Guide

## 🚀 Deployment Architecture

This is a **Vite React Single Page Application (SPA)** that deploys consistently across all environments.

## 📦 Build Process

### Local Development
```bash
npm run dev          # Start development server on http://localhost:5173
```

### Production Build
```bash
npm run build        # Build for production -> outputs to dist/
npm run deploy       # Build + deployment message
npm run preview      # Preview production build locally
```

## 🌐 Deployment Options

### 1. Static Hosting (Recommended)
The built `dist/` folder can be deployed to any static hosting service:

- **Vercel**: Already configured with `vercel.json`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Deploy `dist/` contents
- **AWS S3**: Upload `dist/` contents with static website hosting
- **Any CDN/Static Host**: Upload `dist/` contents

### 2. Backend Integration Deployment

**Frontend (This Project)**:
```bash
npm run build                    # Build static files
# Deploy dist/ to static hosting
```

**IVOR Backend**:
```bash
cd ivor/ivor/backend && ./start.sh    # Runs on port 8000
```

**Events Calendar Backend**:
```bash
cd events-calendar && npm run dev     # Runs on port 5173
```

**Newsroom Backend**:
```bash
cd newsroom && npm run dev             # Runs on port 3001
```

## 🔗 Environment Configuration

### Production URLs
Update backend URLs for production in these files:
- `src/components/ivor/IVORInterfaceEnhanced.tsx` (line 432, 593)
- `src/App.tsx` (lines 27, 98, 213)
- `src/components/newsroom/NewsroomEnhanced.tsx` (line 365)

### Environment Variables (Optional)
Create `.env.production` for production backend URLs:
```
VITE_IVOR_API_URL=https://api.blkoutuk.com/ivor
VITE_EVENTS_API_URL=https://events.blkoutuk.com
VITE_NEWSROOM_API_URL=https://newsroom.blkoutuk.com
```

## 🛠 Deployment Commands

### Single Command Deployment
```bash
npm run deploy
```

### Manual Steps
```bash
npm run build
# Upload dist/ folder to your hosting service
```

### Vercel (Automatic)
```bash
vercel --prod
```

## ✅ Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Update backend URLs for production
- [ ] Deploy `dist/` folder to hosting service
- [ ] Test all routes work (SPA routing)
- [ ] Verify backend integrations work with production URLs
- [ ] Check that favicon and assets load correctly

## 🔧 Troubleshooting

### SPA Routing Issues
Ensure your hosting service redirects all routes to `index.html` (already configured in `vercel.json`)

### Backend Connection Issues
- Check backend URLs are correct for your environment
- Verify CORS is configured on backend services
- Test API endpoints independently

### Build Issues
```bash
npm run type-check    # Check TypeScript errors
npm run lint          # Check code quality
```

## 📊 Performance

- **Bundle Size**: ~640KB (gzipped: ~189KB)
- **Build Time**: ~9 seconds
- **Framework**: Vite + React 18 + TypeScript

---

The frontend deploys exactly the same way as any other static website - build once, deploy anywhere!