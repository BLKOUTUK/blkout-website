# BLKOUT Platform - Official URL Mapping Reference

**CRITICAL**: Always consult PLATFORM_URL_MAPPING.md before making any cross-platform changes or URL references.

## Production URLs (Hostinger/Coolify)

| Service | Production URL | Deployment Platform |
|---------|---------------|-------------------|
| **Main Website** | https://blkoutuk.com | Vercel |
| **Events Calendar** | https://events.blkoutuk.cloud | Coolify (Hostinger) |
| **Newsroom** | https://news.blkoutuk.cloud | Coolify (Hostinger) |
| **Blog (BLKOUT Voices)** | https://blog.blkoutuk.cloud | Coolify (Hostinger) |
| **Comms Dashboard** | https://comms.blkoutuk.cloud | Coolify (Hostinger) |
| **CRM** | https://crm.blkoutuk.cloud | Coolify (Hostinger) |
| **IVOR API** | https://ivor.blkoutuk.cloud | Coolify (Hostinger) |

## Deprecated URLs - NEVER USE

- `blkout-blog-production.up.railway.app` → Use `blog.blkoutuk.cloud`
- `blkout-voices*.railway.app` → Use `blog.blkoutuk.cloud`
- `blkout-crm.vercel.app` → Use `crm.blkoutuk.cloud`
- `events-*.netlify.app` → Use `events.blkoutuk.cloud`
- `ivor-beta.vercel.app` → Use `ivor.blkoutuk.cloud`
- `events-blkout.vercel.app` → Use `events.blkoutuk.cloud`
- `blkout-scrollytelling.vercel.app` → Use `blkoutuk.com`

## Key API Endpoints

- **CRM Newsletter**: `https://crm.blkoutuk.cloud/api/community/join` (used by all platforms)
- **IVOR AI**: `https://ivor.blkoutuk.cloud` (AI features for events, news, comms)

## Files to Check for URL References

### Main Website (blkout-website/)
- src/components/Navigation.tsx
- src/components/layout/PlatformFooter.tsx
- src/components/blkout/CommunityEmailCapture.tsx
- src/components/blkout/ProjectHub.tsx
- src/App.tsx (redirect components)
- vercel.json

### Events Calendar (apps/events-calendar/)
- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/NewsletterSignup.tsx
- index.html (CSP headers)

### Newsroom (apps/news-blkout/)
- src/components/Header.tsx
- src/components/Footer.tsx
- src/components/pages/ModerationDashboard.tsx
- index.html (CSP headers)

## Maintenance Protocol

1. **Before any deployment**: Review PLATFORM_URL_MAPPING.md for current URLs
2. **Weekly**: Audit one platform's links against this document
3. **Monthly**: Full cross-platform link audit
4. **When adding new service**: Update PLATFORM_URL_MAPPING.md immediately
5. **CSP Updates**: When adding new API integrations, update CSP connect-src in index.html

## Recent URL Fixes (Dec 2025)

- Fixed App.tsx redirects: IVOR, Events, Movement
- Added CRM API to Events CSP (resolved blank page)
- Replaced news moderation API calls with direct Supabase
- Created PLATFORM_URL_MAPPING.md reference document

**Document Location**: 
- `/home/robbe/blkout-platform/PLATFORM_URL_MAPPING.md` (monorepo)
- `/home/robbe/blkout-website/PLATFORM_URL_MAPPING.md` (main website repo)