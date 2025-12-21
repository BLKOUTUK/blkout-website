# BLKOUT Platform - Official URL Mapping

**Last Updated**: 2025-12-20
**Purpose**: Canonical reference for all platform URLs across deployments

## Production URLs (Hostinger/Coolify)

| Service | Production URL | Status | Deployment Platform |
|---------|---------------|--------|-------------------|
| **Main Website** | https://blkoutuk.com | ✅ Active | Vercel |
| **Events Calendar** | https://events.blkoutuk.cloud | ✅ Active | Coolify (Hostinger) |
| **Newsroom** | https://news.blkoutuk.cloud | ✅ Active | Coolify (Hostinger) |
| **Blog (BLKOUT Voices)** | https://blog.blkoutuk.cloud | ✅ Active | Coolify (Hostinger) |
| **Comms Dashboard** | https://comms.blkoutuk.cloud | ✅ Active | Coolify (Hostinger) |
| **CRM** | https://crm.blkoutuk.cloud | ✅ Active | Coolify (Hostinger) |
| **IVOR API** | https://ivor.blkoutuk.cloud | ✅ Active | Coolify (Hostinger) |

## Deprecated URLs (DO NOT USE)

| Old URL | Status | Replacement |
|---------|--------|-------------|
| blkout-blog-production.up.railway.app | ❌ Deprecated | https://blog.blkoutuk.cloud |
| blkout-voices*.railway.app | ❌ Deprecated | https://blog.blkoutuk.cloud |
| blkout-crm.vercel.app | ❌ Deprecated | https://crm.blkoutuk.cloud |
| blkout-website.vercel.app/admin | ❌ Deprecated | Use service-specific admin pages |
| events-*.netlify.app | ❌ Deprecated | https://events.blkoutuk.cloud |

## Inter-Module Links Checklist

### Main Website (blkoutuk.com) Links TO:
- [ ] Blog/Voices → https://blog.blkoutuk.cloud
- [ ] Events → https://events.blkoutuk.cloud
- [ ] News → https://news.blkoutuk.cloud
- [ ] Comms/Discover → https://comms.blkoutuk.cloud
- [ ] CRM API → https://crm.blkoutuk.cloud/api/*
- [ ] IVOR API → https://ivor.blkoutuk.cloud

### Events Calendar (events.blkoutuk.cloud) Links TO:
- [ ] Main Site → https://blkoutuk.com
- [ ] News → https://news.blkoutuk.cloud
- [ ] IVOR → https://ivor.blkoutuk.cloud
- [ ] CRM Newsletter → https://crm.blkoutuk.cloud/api/community/join

### Newsroom (news.blkoutuk.cloud) Links TO:
- [ ] Main Site → https://blkoutuk.com
- [ ] Events → https://events.blkoutuk.cloud
- [ ] Blog → https://blog.blkoutuk.cloud
- [ ] CRM Newsletter → https://crm.blkoutuk.cloud/api/community/join

### Blog (blog.blkoutuk.cloud) Links TO:
- [ ] Main Site → https://blkoutuk.com
- [ ] Events → https://events.blkoutuk.cloud
- [ ] News → https://news.blkoutuk.cloud
- [ ] IVOR → https://ivor.blkoutuk.cloud
- [ ] CRM Newsletter → https://crm.blkoutuk.cloud/api/community/join

### Comms Dashboard (comms.blkoutuk.cloud) Links TO:
- [ ] Main Site → https://blkoutuk.com
- [ ] News → https://news.blkoutuk.cloud
- [ ] Events → https://events.blkoutuk.cloud
- [ ] Blog → https://blog.blkoutuk.cloud
- [ ] CRM Newsletter → https://crm.blkoutuk.cloud/api/community/join

### CRM (crm.blkoutuk.cloud) Links TO:
- [ ] Main Site → https://blkoutuk.com
- [ ] IVOR → https://ivor.blkoutuk.cloud

## Files to Check for URL References

### Main Website (blkout-website/)
- [ ] src/components/Navigation.tsx
- [ ] src/components/layout/PlatformFooter.tsx
- [ ] src/components/blkout/CommunityEmailCapture.tsx
- [ ] src/components/blkout/ProjectHub.tsx
- [ ] public/index.html (if exists)
- [ ] vercel.json

### Events Calendar (events-calendar/)
- [ ] src/components/Header.tsx
- [ ] src/components/Footer.tsx
- [ ] src/components/NewsletterSignup.tsx
- [ ] index.html (CSP headers)
- [ ] netlify.toml

### Newsroom (news-blkout/)
- [ ] src/components/Header.tsx (if exists)
- [ ] src/components/Footer.tsx (if exists)
- [ ] src/components/pages/ModerationDashboard.tsx
- [ ] index.html (CSP headers)

### Blog (blog/)
- [ ] public/index.html (footer links + CSP)
- [ ] server.js (if has references)

### Comms Dashboard (comms-blkout/)
- [ ] src/pages/discover/DiscoverPage.tsx
- [ ] src/components/discover/NewsletterSignup.tsx
- [ ] src/components/layout/Navigation.tsx (if exists)

## API Endpoints

### CRM API (https://crm.blkoutuk.cloud/api/)
- `/community/join` - Newsletter signup (all platforms use this)
- `/health` - Health check

### IVOR API (https://ivor.blkoutuk.cloud)
- Used by events, news, comms for AI features

## Testing Checklist

After updating URLs, test:
- [ ] Navigate from main site to each service
- [ ] Newsletter signup works on all platforms
- [ ] Footer links on all platforms navigate correctly
- [ ] Cross-service navigation works (events → news, news → blog, etc.)
- [ ] API calls succeed (CRM, IVOR)
- [ ] CSP headers don't block legitimate requests
- [ ] No broken links or 404 errors

## Maintenance Notes

1. **When deploying new service**: Add to this document immediately
2. **When deprecating URL**: Move to "Deprecated URLs" section
3. **Before any deployment**: Review this document for current URLs
4. **Weekly**: Audit one platform's links against this document
5. **Monthly**: Full cross-platform link audit

---

**Repository**: https://github.com/BLKOUTUK/blkout-platform
**Maintained by**: Platform Team
**Last Audit**: 2025-12-20
