# BLKOUT Architecture Backup & Recovery Guide
**Critical Document**: Prevent Future Cleanup Tool Losses

## 🚨 What Happened: The Cleanup Incident

### Original Issue
- User requested codebase rationalization using `/cleanup` tool
- Cleanup tool was overly aggressive and removed sophisticated architecture
- Lost: PageAI Pro mappings, community components, magazine system, VCR effects

### Components Lost
- `src/components/community/` - CommunityGateway, HubReports, MovementIntro
- `src/components/magazine/` - MagazineLayout, StoriesPage, ArticleGrid, ArticlePage
- Advanced BLKOUT components: BentoBoxLayout, HeroVideoCarousel, MediaGallery
- Supporting infrastructure: mediaAssets.ts, useLayoutPreference.ts
- Sophisticated routing and integration points

### Recovery Source
- **Critical Branch**: `feature/scrollytelling-enhancements`
- **Commit**: `a0eab77` - "feat: complete multi-layout system with community gateway architecture"
- **Recovery Method**: Selective `git checkout` commands

## 🛡️ Prevention Strategy

### 1. Critical Branch Protection
```bash
# Mark important branches as protected
git branch --set-upstream-to=origin/feature/scrollytelling-enhancements feature/scrollytelling-enhancements
git push origin feature/scrollytelling-enhancements

# Never allow destructive operations on these branches:
# - feature/scrollytelling-enhancements
# - main-backup-basic-landing
# - production-vite-deployment
```

### 2. Component Inventory Maintenance
Keep this list updated when adding new sophisticated components:

#### Core Community Components
- `CommunityGateway.tsx` - Main community hub (IVOR-integrated)
- `HubReports.tsx` - Community analytics
- `MovementIntro.tsx` - Movement resources

#### Magazine System
- `MagazineLayout.tsx` - Professional wrapper
- `StoriesPage.tsx` - Community stories
- `ArticleGrid.tsx` - Article organization
- `ArticlePage.tsx` - Individual articles

#### Advanced Layouts
- `BentoBoxLayout.tsx` - Variable card layouts
- `HeroVideoCarousel.tsx` - Video showcase
- `ParallaxCommunityValues.tsx` - Values presentation
- `MediaGallery.tsx` - Interactive media

#### Supporting Infrastructure
- `lib/mediaAssets.ts` - Media organization
- `hooks/useLayoutPreference.ts` - Layout switching
- `App.tsx` routing configuration

### 3. Safe Cleanup Procedures

#### ❌ NEVER Use These Commands
```bash
# Dangerous - removes everything
git checkout feature/branch -- .

# Dangerous - cleanup tools without targeting
/cleanup [broad scope]
rm -rf src/components/*

# Dangerous - reset without backup
git reset --hard HEAD~X
```

#### ✅ Safe Cleanup Approach
```bash
# 1. Create backup branch first
git checkout -b backup-before-cleanup-$(date +%Y%m%d)
git push origin backup-before-cleanup-$(date +%Y%m%d)

# 2. List files to be removed BEFORE removing
find src/components -name "*.tsx" -exec echo "Would remove: {}" \;

# 3. Remove specific files only
rm src/components/specific/unwanted.tsx

# 4. Test build after each removal
npm run build

# 5. Commit incrementally
git add -A && git commit -m "Remove specific component: unwanted.tsx"
```

## 🔄 Recovery Procedures

### Quick Recovery (If Components Still in Git History)
```bash
# 1. Find the commit before cleanup
git log --oneline --since="7 days ago" | grep -i "cleanup\|clean"

# 2. Restore specific components
git checkout [commit-hash] -- src/components/community/
git checkout [commit-hash] -- src/components/magazine/
git checkout [commit-hash] -- src/lib/mediaAssets.ts

# 3. Test restoration
npm run build
npm run dev
```

### Full Recovery from feature/scrollytelling-enhancements
```bash
# 1. Check branch exists
git branch -a | grep scrollytelling-enhancements

# 2. Restore sophisticated components (exclude VCR)
git checkout feature/scrollytelling-enhancements -- src/components/community/
git checkout feature/scrollytelling-enhancements -- src/components/magazine/
git checkout feature/scrollytelling-enhancements -- src/components/movement/
git checkout feature/scrollytelling-enhancements -- src/lib/mediaAssets.ts
git checkout feature/scrollytelling-enhancements -- src/hooks/useLayoutPreference.ts

# 3. Restore selected layout components (avoiding VCR)
git checkout feature/scrollytelling-enhancements -- src/components/blkout/BentoBoxLayout.tsx
git checkout feature/scrollytelling-enhancements -- src/components/blkout/HeroVideoCarousel.tsx
git checkout feature/scrollytelling-enhancements -- src/components/blkout/MediaGallery.tsx

# 4. Create placeholder VCR components if needed
# (See INTEGRATION_STATUS.md for examples)

# 5. Update routing in App.tsx
# Add routes for: /community, /stories, /movement, /reports

# 6. Test integration
npm run build
npm run dev
curl http://localhost:5174/community
```

### Backend Integration Recovery
```bash
# 1. Start IVOR backend
cd /home/robbe/BLKOUTNXT_Projects/ivor/ivor/backend
python3 quick_start.py &

# 2. Verify connection
curl http://localhost:8000/health

# 3. Test frontend integration
# Visit http://localhost:5174/community
# Check for green status indicator
```

## 📋 Recovery Checklist

### Phase 1: Component Restoration
- [ ] Community components restored
- [ ] Magazine system restored  
- [ ] Movement components restored
- [ ] Supporting libraries restored
- [ ] Build succeeds without errors

### Phase 2: Routing Integration
- [ ] App.tsx routes updated
- [ ] All routes accessible
- [ ] Navigation between components works
- [ ] No broken imports or dependencies

### Phase 3: Backend Integration
- [ ] IVOR backend running
- [ ] CommunityGateway shows green status
- [ ] Health checks responding
- [ ] Error handling working

### Phase 4: Testing & Documentation
- [ ] All routes load without errors
- [ ] Backend connections stable
- [ ] Integration documentation updated
- [ ] New backup branch created

## 🗂️ File Backup Locations

### Primary Source
- **Branch**: `feature/scrollytelling-enhancements`
- **Commit**: `a0eab77dcccdfda01c87334da51e62b94ec485d7`
- **Date**: Wed Jul 2 12:44:17 2025

### Secondary Sources
- **Branch**: `main-backup-basic-landing`
- **Branch**: `production-vite-deployment`
- **Local**: Any backup branches created before cleanup

### Documentation Backups
- `INTEGRATION_STATUS.md` - Current architecture state
- `BACKUP_RECOVERY_GUIDE.md` - This document
- Git commit messages with "Generated with Claude Code"

## 🔍 Detection & Prevention

### Early Warning Signs
- Components suddenly "not found" in imports
- Build errors referencing missing files
- Routes returning 404 unexpectedly
- Backend integration suddenly broken

### Prevention Habits
1. **Before any cleanup**: Create dated backup branch
2. **Regular commits**: Commit sophisticated work immediately
3. **Branch protection**: Keep enhancement branches permanently
4. **Documentation**: Update component inventory when adding features
5. **Testing**: Run build after any removal operations

### Emergency Contacts
- Repository: Check `feature/scrollytelling-enhancements` branch
- Documentation: Read `INTEGRATION_STATUS.md` for current state
- Backend: Check `/home/robbe/BLKOUTNXT_Projects/` for service locations

## 🎯 Key Lesson

**Never use broad cleanup tools on sophisticated architecture.** The PageAI Pro component mappings, community gateway system, and magazine architecture represented significant development investment. Manual, targeted cleanup is safer than automated tools that can't distinguish between experimental code and production-ready features.

---
*This guide serves as insurance against future cleanup incidents. Keep it updated as the architecture evolves.*