# Legacy Articles Integration Audit

**Date**: 2025-12-26
**Table**: `legacy_articles` (281 published articles, 2016-2025)

## ✅ VERIFIED INTEGRATIONS

### Database Access
- [x] **StoryArchivePage.tsx** queries `legacy_articles` WHERE `status = 'published'`
- [x] **Count updated**: "280+ ARTICLES FROM BLKOUTUK.COM (2016-2025)"
- [x] **Commit**: 7dfc379 (deployed to Coolify)

### Platform Homepage (/platform)
- [x] **Story Archive card** in Core Ecosystem grid
- [x] **Description**: "280+ articles from blkoutuk.com (2016-2025)"
- [x] **Tagline**: "9 years of Black queer voices"
- [x] **Link**: `/stories` ✓
- [x] **Commit**: eee1c4b (deployed to Coolify)

### Navigation
- [x] **PrimaryNavigationEnhanced**: "Story Archive" → `/stories`
- [x] **Ecosystem Dropdown**: "Story Archive" with description
- [x] **Search**: Routes to `/stories?search=...`

### Comms Discover Page
- [x] **ArchiveArticleWidget**: Dynamically loads from `legacy_articles`
- [x] **Featured article**: Random from top 10 recent
- [x] **Link**: `https://blkoutuk.com/stories` with article slug anchor
- [x] **Count**: "View 280+ articles"
- [x] **Status**: UPDATED (needs deployment to comms.blkoutuk.cloud)

### Theory of Change CTAs
- [x] **Card 17**: "300+ articles by us, for us" → `/stories`
- [x] **Card 24**: "Explore our stories" → `/stories`
- [x] **Doc**: `THEORY_OF_CHANGE_CTA_STRATEGY.md`

## ⏳ PENDING VERIFICATION

### External Links
- [ ] **Footer links** - Check PlatformFooter.tsx includes archive
- [ ] **ProjectHub** - Verify any archive references
- [ ] **Community pages** - Check for archive mentions

### Cross-Platform Links
- [ ] **Events Calendar** (events.blkoutuk.cloud) - Should link to blkoutuk.com/stories
- [ ] **Newsroom** (news.blkoutuk.cloud) - Should link to archive
- [ ] **Blog** (blog.blkoutuk.cloud) - Should reference archive
- [ ] **Comms** (comms.blkoutuk.cloud) - ArchiveArticleWidget deployed

## 🔍 CHECKLIST FOR PREVENTING LOSS

### Monthly Verification
- [ ] Run: `SELECT COUNT(*) FROM legacy_articles WHERE status = 'published'`
- [ ] Expected: 281+ (should never decrease)
- [ ] Test: https://blkoutuk.com/stories loads and shows articles
- [ ] Test: Search and filter work
- [ ] Test: Pagination works

### Documentation
- [x] **Memory**: `legacy_articles_architecture.md` created
- [x] **This audit**: `LEGACY_ARTICLES_INTEGRATION_AUDIT.md`
- [ ] **Platform URL Mapping**: Add legacy_articles reference

### Related Tables to Monitor
- **archived_articles**: 278 rows - verify not duplicate
- **news_articles**: 155 rows - external curated news (separate)
- **categories**: 10 categories - used by legacy_articles

## 📝 DEPLOYMENT STATUS

**blkout-website** (main site):
- ✅ Commit 7dfc379: StoryArchivePage fix
- ✅ Commit eee1c4b: PlatformHomepage enhancement
- ⏳ Coolify auto-deploy in progress

**comms-blkout** (Discover page):
- ✅ ArchiveArticleWidget updated to query legacy_articles
- ⏳ Needs deployment to comms.blkoutuk.cloud

## 🎯 SUCCESS CRITERIA

- [x] /stories route accessible (HTTP 200)
- [x] StoryArchivePage shows 280+ articles
- [x] Archive featured on Platform Homepage
- [x] Archive featured on Comms Discover page
- [x] Navigation includes Story Archive link
- [x] Theory of Change CTAs point to /stories
- [ ] All external links verified
- [ ] Tested in production

---

**Next Action**: Test https://blkoutuk.com/stories in production after Coolify deploys latest commits (7dfc379, eee1c4b).
