# BLKOUT Deployment Process

## 🚨 CRITICAL: Preventing Blank Admin Pages

**Root Cause Identified**: Admin pages appeared blank because the `platform-blkout.vercel.app` alias was pointing to old deployments instead of the latest code.

## 📋 Deployment Checklist

### 1. Code Changes & Build
```bash
# Make your changes
git add -A
git commit -m "Your changes"
git push origin main
```

### 2. **CRITICAL**: Verify Alias Points to Latest Deployment
```bash
# Run the verification script
./verify-deployment.sh

# OR manually check and update:
npx vercel ls  # Find latest Production deployment
npx vercel alias ls  # Check current alias target
npx vercel alias set [LATEST_DEPLOYMENT_URL] platform-blkout.vercel.app
```

### 3. Test Admin System
- ✅ Visit https://platform-blkout.vercel.app/admin
- ✅ Enter password: `BLKOUT2025!`
- ✅ Verify moderation dashboard loads
- ✅ Test content submission and moderation workflow

## 🔧 Key URLs

| Purpose | URL | Notes |
|---------|-----|-------|
| **Production Alias** | https://platform-blkout.vercel.app | **Main URL users access** |
| Direct Production | https://blkout-website.vercel.app | Auto-updates with main branch |
| Admin Panel | https://platform-blkout.vercel.app/admin | Password: `BLKOUT2025!` |
| Content Submission | https://platform-blkout.vercel.app/submit | Public submission form |

## 🚀 Automatic Verification

### GitHub Actions Workflow (Recommended)
Add this to `.github/workflows/deploy.yml`:

```yaml
name: Deploy and Verify
on:
  push:
    branches: [main]

jobs:
  deploy-and-verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Vercel CLI
        run: npm i -g vercel
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Verify Deployment
        run: ./verify-deployment.sh
```

## 🔍 Troubleshooting

### If Admin Pages Are Blank:
1. **Check alias target**: `npx vercel alias ls | grep platform-blkout`
2. **Update to latest**: `./verify-deployment.sh`
3. **Hard refresh**: Ctrl+Shift+R to clear cache
4. **Wait 2-5 minutes**: For DNS propagation

### If Build Fails:
1. Check TypeScript errors: `npm run build`
2. Fix imports and type issues
3. Ensure all components exist
4. Commit and push fixes

## 📊 Admin System Components

### Working Components (Latest Deployment):
- ✅ **AdminAuth**: Password authentication (BLKOUT2025!)
- ✅ **AdminDashboard**: Navigation to moderation
- ✅ **ModerationDashboard**: Approve/reject content
- ✅ **ContentSubmissionForm**: Submit news/events
- ✅ **NewsroomPage/EventsPage**: Display published content
- ✅ **Supabase Integration**: Full moderation workflow
- ✅ **Chrome Extension**: Updated API endpoints

### End-to-End Workflow:
1. **Submission** → Content submitted via form or Chrome extension
2. **Moderation** → Admin reviews in /admin/moderation
3. **Publication** → Approved content appears in /newsroom and /events
4. **Search** → Published content searchable by users
5. **IVOR Integration** → Content available for AI responses

## 🔒 Security Notes
- Admin password: `BLKOUT2025!`
- All admin routes protected by authentication
- CORS configured for Chrome extension
- Environment variables properly set

## 📝 Maintenance

### Weekly:
- Run `./verify-deployment.sh` to ensure alias is current
- Check admin system functionality
- Review pending moderation queue

### Monthly:
- Update dependencies: `npm update`
- Review deployment logs
- Test Chrome extension functionality

---

**Remember**: Always run `./verify-deployment.sh` after pushing changes to ensure users see the latest version!