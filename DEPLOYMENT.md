# BLKOUT Website Deployment Guide

## 🚀 Vercel Deployment Checklist

### Pre-Deployment
- [x] TypeScript compilation successful (`npm run type-check`)
- [x] Production build working (`npm run build`)
- [x] All new components integrated and tested
- [ ] Environment variables configured

### Required Environment Variables in Vercel

#### Essential for Community Features
```
VITE_N8N_WEBHOOK_URL=https://n8n.blkoutuk.com/webhook/community-signup
VITE_BACKUP_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/backup/
```

#### Optional but Recommended
```
VITE_OPENAI_API_KEY=sk-...
VITE_ANALYTICS_ID=G-...
VITE_ENVIRONMENT=production
```

### Deployment Steps

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: complete scrollytelling interactive features
   
   - Add functional email capture with n8n integration
   - Implement BLKOUTHUB access request system
   - Create interactive revelation components
   - Enhance navigation from scrollytelling to main site
   
   🤖 Generated with Claude Code
   
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin clean-scrollytelling-deploy
   ```

2. **Deploy to Vercel**
   - Push to GitHub triggers automatic deployment
   - Or use Vercel CLI: `vercel --prod`

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Redeploy after adding variables

4. **Test Production Deployment**
   - Verify email capture functionality
   - Test BLKOUTHUB access request flow
   - Check interactive revelation components
   - Confirm navigation works properly

### New Features Deployed

#### 📧 Community Email Capture
- **Location**: Final scrollytelling slide + throughout site
- **Features**: Multi-interest selection, n8n integration
- **Backend**: Webhook to community automation system

#### 🏠 BLKOUTHUB Access Request
- **Location**: Dedicated component in connect slide
- **Features**: 4-step progressive form with validation
- **Integration**: Community review and approval workflow

#### ⚡ Interactive Revelations
- **Location**: "What If" slides (slides 13-16)
- **Features**: Clickable scenarios, auto-play mode, detailed exploration
- **Content**: Liberation pathways for storytelling, wealth building, solidarity

#### 🔗 Enhanced Navigation
- **Features**: Smooth transitions to main website
- **Quick Links**: Movement, Media, Events, Resources
- **Community Focus**: Engagement over consumption

### Success Metrics to Monitor

Post-deployment, monitor:
- **Community Signup Rate**: Email capture completion
- **BLKOUTHUB Interest**: Access request submissions  
- **Engagement Depth**: Time spent on interactive elements
- **Journey Completion**: Full scrollytelling experience rate

### Troubleshooting

#### Common Issues
1. **Environment Variables Not Loading**
   - Ensure all VITE_ prefixed variables are set
   - Redeploy after adding variables

2. **N8N Webhook Failures**
   - Check webhook URL accessibility
   - Verify n8n workflow is active
   - Monitor webhook logs

3. **Component Rendering Issues**
   - Check browser console for errors
   - Verify all imports are correct
   - Test on multiple devices/browsers

#### Support
- Technical issues: Check browser developer tools
- Community features: Monitor n8n workflow execution
- User feedback: Track form submissions and errors

### Community Values in Deployment

This deployment embodies BLKOUT's values:
- **Community-First**: All new features prioritize community connection
- **Cooperative Ownership**: Technology serves collective liberation
- **Privacy-Conscious**: Data handling respects community sovereignty
- **Accessible**: Progressive enhancement ensures universal access

---

*Building bridges, not walls. Technology for collective liberation.* 🏳️‍🌈