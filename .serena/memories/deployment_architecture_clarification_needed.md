# BLKOUT Platform - Repository and Deployment Architecture

## CRITICAL: SINGLE SOURCE OF TRUTH

**CURRENT ACTIVE REPOSITORY**: https://github.com/BLKOUTUK/blkout-website
- **Local Path**: `/home/robbe/blkout-website`
- **Status**: ✅ ACTIVE - All development happens here
- **Deployment**: Vercel → https://blkoutuk.com
- **Last Updated**: Dec 25, 2025

**LEGACY REPOSITORY**: https://github.com/BLKOUTUK/blkout-community-platform
- **Local Path**: `/home/robbe/blkout-platform/archive/legacy-active-projects/`
- **Status**: ❌ ARCHIVED - DO NOT USE
- **Last Updated**: Dec 19, 2025

## Canonical Documentation

**PLATFORM_URL_MAPPING.md Location**: `/home/robbe/blkout-website/PLATFORM_URL_MAPPING.md`
- Archived old copy from blkout-platform to `archive/docs/PLATFORM_URL_MAPPING.md.archived-2025-12-20`

## Deployment Architecture

Per PLATFORM_URL_MAPPING.md:

| Service | URL | Platform | Repo |
|---------|-----|----------|------|
| **Main Website** | https://blkoutuk.com | **Vercel** | blkout-website |
| Events | https://events.blkoutuk.cloud | Coolify | blkout-platform/apps/events-calendar |
| News | https://news.blkoutuk.cloud | Coolify | blkout-platform/apps/news-blkout |
| Blog | https://blog.blkoutuk.cloud | Coolify | blkout-platform/apps/blog |
| Comms | https://comms.blkoutuk.cloud | Coolify | blkout-platform/apps/comms-blkout |
| CRM | https://crm.blkoutuk.cloud | Coolify | blkout-platform/apps/crm |
| IVOR | https://ivor.blkoutuk.cloud | Coolify | blkout-platform/apps/ivor |

## Deployment Process for blkoutuk.com

### Working Directory
```bash
cd /home/robbe/blkout-website  # ALWAYS work here for main site
```

### Deployment Steps
1. Make changes in blkout-website repo
2. Commit: `git add . && git commit -m "message"`
3. Push: `git push`
4. Deploy: `npx vercel --prod --yes`
5. Alias: `npx vercel alias set [deployment-url] blkoutuk.com`
6. Verify: Check https://blkoutuk.com

### Vercel Project Info
- **Team**: robs-projects-54d653d3 (BLKOUTNXT)
- **Project Name**: blkout-website
- **Domain**: blkoutuk.com

## ABSOLUTE RULES

✅ ALWAYS use `/home/robbe/blkout-website` for blkoutuk.com work
✅ ALWAYS check `/home/robbe/blkout-website/PLATFORM_URL_MAPPING.md` before deploying
✅ ALWAYS deploy blkoutuk.com to Vercel (NOT Coolify)

❌ NEVER use blkout-community-platform - it is LEGACY
❌ NEVER deploy blkoutuk.com to Coolify - only subdomains (*.blkoutuk.cloud) use Coolify
❌ NEVER create duplicate architecture documentation files
❌ NEVER confuse blkout-website with blkout-community-platform

## Components in blkout-website

- TheoryOfChange v2.0: `src/components/movement/TheoryOfChange.tsx`
- Route: `/movement` in `src/App.tsx`
- Images: `public/images/collective/` (18 Liberation Collective photos)
