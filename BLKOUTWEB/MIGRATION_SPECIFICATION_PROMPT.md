# 📋 BLKOUT Phase-1 Website Migration Specification

## 🎯 **MIGRATION OBJECTIVE**

**Task**: Migrate complete, production-ready BLKOUT Content Moderation & Publication System from complex development repository to clean `BLKOUTUK/Phase-1-website` repository.

**Goal**: Create professional, maintainable foundation for community production deployment and future development.

---

## 📂 **SOURCE & TARGET SPECIFICATIONS**

### **Source Repository**
- **Current**: `BLKOUTUK/blkout-website.git`
- **Branch**: `001-blkoutuk-digital-strategy`
- **Working Directory**: `/home/robbe/BLKOUTWEB/`
- **Current Size**: 656KB with development artifacts
- **Status**: Complete, working moderation system deployed

### **Target Repository**
- **New**: `BLKOUTUK/BLKOUTNXT-platform`
- **Branch**: `main` (clean start)
- **Target Size**: ~50KB (production only)
- **Purpose**: Production deployment and community development foundation

---

## 📋 **EXACT FILE MIGRATION MAP**

### **✅ FILES TO MIGRATE** (Essential Production Files)

#### **Core Configuration**
```bash
# Root configuration files
cp package.json → BLKOUTNXT-platform/package.json
cp vercel.json → BLKOUTNXT-platform/vercel.json  
cp .nvmrc → BLKOUTNXT-platform/.nvmrc
cp .gitignore → BLKOUTNXT-platform/.gitignore
```

#### **API Layer**
```bash
# Complete moderation API
cp api/moderate-content.ts → BLKOUTNXT-platform/api/moderate-content.ts
```

#### **Frontend Components**
```bash
# React/TypeScript components
cp src/components/ModerationDashboard.tsx → BLKOUTNXT-platform/src/components/ModerationDashboard.tsx
cp src/components/ModerationNotificationBadge.tsx → BLKOUTNXT-platform/src/components/ModerationNotificationBadge.tsx
cp src/components/community/CommunityEngagementSlides.tsx → BLKOUTNXT-platform/src/components/community/CommunityEngagementSlides.tsx
```

#### **Services & Hooks**
```bash
# Core business logic
cp src/services/publicationService.ts → BLKOUTNXT-platform/src/services/publicationService.ts
cp src/hooks/useModerationNotifications.ts → BLKOUTNXT-platform/src/hooks/useModerationNotifications.ts
```

#### **Testing Infrastructure**
```bash
# Integration tests
cp tests/moderation-pipeline.test.ts → BLKOUTNXT-platform/tests/moderation-pipeline.test.ts
```

#### **Static Assets**
```bash
# Public assets
cp public/index.html → BLKOUTNXT-platform/public/index.html
```

#### **Database Schema**
```bash
# Production database schema
cp final-database-schema-bgjengudzfickgomjqmz.sql → BLKOUTNXT-platform/database/schema.sql
```

### **📚 DOCUMENTATION TO CREATE/MIGRATE**

#### **Essential Documentation**
```bash
# Create new production documentation
CREATE: BLKOUTNXT-platform/README.md (production overview)
CREATE: BLKOUTNXT-platform/docs/DEPLOYMENT_GUIDE.md (deployment instructions)
CREATE: BLKOUTNXT-platform/docs/USER_GUIDE.md (user testing guide)
CREATE: BLKOUTNXT-platform/docs/API_DOCUMENTATION.md (API reference)
CREATE: BLKOUTNXT-platform/docs/CONTRIBUTING.md (community contribution guide)
```

### **🚫 FILES TO EXCLUDE** (Development Artifacts)

```bash
# Development directories (DO NOT MIGRATE)
❌ .claude/
❌ .claude-flow/
❌ .serena/
❌ .swarm/
❌ .vscode/
❌ memory/
❌ scripts/
❌ templates/

# Development files (DO NOT MIGRATE)
❌ CLAUDE.md
❌ *-updated.ts
❌ database-schema-updates.sql
❌ adapted-database-schema.sql
❌ environment-variables.md
❌ AUTHENTICATION_BYPASS_COMPLETE.md
❌ TESTING_REPORT_FINAL.md
❌ MODERATION_DEPLOYMENT_GUIDE.md
❌ FINAL_DEPLOYMENT_INSTRUCTIONS.md
❌ PHASE_1_WEBSITE_REPOSITORY_MAP.md
❌ MIGRATION_SPECIFICATION_PROMPT.md
```

---

## ⚙️ **TECHNICAL REQUIREMENTS**

### **File Validation Checklist**
- [ ] All TypeScript files compile without errors
- [ ] Package.json dependencies are complete and accurate
- [ ] Vercel.json configuration is production-ready
- [ ] Database schema includes all required tables
- [ ] API endpoints match current working deployment
- [ ] React components have proper imports and exports

### **Configuration Updates Required**
```json
// Update package.json
{
  "name": "blkoutnxt-platform",
  "version": "1.0.0",
  "description": "BLKOUT Community Liberation Platform - Phase 1 Production Website",
  "scripts": {
    "dev": "vercel dev",
    "build": "echo 'Production build ready'",
    "start": "vercel --prod", 
    "deploy": "vercel --prod",
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

### **Environment Variables Documentation**
```bash
# Required for production deployment
VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
VITE_SUPABASE_ANON_KEY=[production_anon_key]

# Document in Phase-1-website/.env.example
```

---

## 🧪 **TESTING & VALIDATION PROTOCOL**

### **Pre-Migration Testing**
1. **Current System Verification**
   - [ ] Verify all API endpoints responding (localhost:3001)
   - [ ] Confirm database connectivity and schema
   - [ ] Test complete moderation workflow (approve/reject/edit)
   - [ ] Validate frontend components render correctly

### **Post-Migration Testing**
1. **File Integrity Verification**
   - [ ] All migrated files present and accessible
   - [ ] No broken imports or missing dependencies
   - [ ] TypeScript compilation successful
   - [ ] Package.json dependencies resolve correctly

2. **Deployment Testing**
   - [ ] Successful Vercel deployment from new repository
   - [ ] API endpoints accessible at new deployment URL
   - [ ] Database connections functional
   - [ ] Frontend components load correctly

3. **Functional Testing**
   - [ ] Complete moderation API workflow (approve/reject/edit)
   - [ ] Real-time notifications working
   - [ ] Database audit logging functional
   - [ ] Publication pipeline operational

### **Performance Validation**
- [ ] Repository clone time < 30 seconds
- [ ] Vercel build time < 2 minutes  
- [ ] API response times < 500ms
- [ ] Frontend component load times < 1 second

---

## 🔄 **MIGRATION EXECUTION STEPS**

### **Phase 1: Repository Setup** (15 minutes)
1. Create new `BLKOUTUK/BLKOUTNXT-platform` repository on GitHub
2. Initialize with README.md, .gitignore, MIT license
3. Set up branch protection rules for main branch
4. Configure repository settings (Issues, Wiki, Projects)

### **Phase 2: File Migration** (30 minutes)
1. Create directory structure in new repository
2. Copy essential files using exact migration map
3. Update package.json with new repository information
4. Create production documentation files
5. Commit initial migration with clear commit message

### **Phase 3: Configuration & Testing** (45 minutes)
1. Set up Vercel project linked to new repository
2. Configure environment variables in Vercel dashboard
3. Deploy initial version and test all endpoints
4. Run comprehensive functional testing
5. Document any configuration adjustments needed

### **Phase 4: Validation & Documentation** (30 minutes)
1. Complete all testing checklists
2. Update documentation with actual deployment URLs
3. Create migration completion report
4. Tag stable release (v1.0.0) in new repository

---

## 🎯 **SUCCESS CRITERIA**

### **Functional Requirements**
- [ ] ✅ All API endpoints operational at new deployment URL
- [ ] ✅ Complete moderation workflow functional (approve/reject/edit)
- [ ] ✅ Database integration working with live Supabase instance
- [ ] ✅ Frontend components render and function correctly
- [ ] ✅ Real-time notifications operational
- [ ] ✅ Test suite passes completely

### **Quality Requirements**  
- [ ] ✅ Repository size < 100KB (target: ~50KB)
- [ ] ✅ Clean git history with meaningful commit messages
- [ ] ✅ Professional documentation structure
- [ ] ✅ No development artifacts or temporary files
- [ ] ✅ All code follows consistent formatting standards

### **Deployment Requirements**
- [ ] ✅ Successful Vercel production deployment
- [ ] ✅ Environment variables properly configured
- [ ] ✅ CORS headers functional for API access
- [ ] ✅ SSL certificate active and valid
- [ ] ✅ Domain routing functional (if custom domain used)

---

## 🚨 **RISK MITIGATION STRATEGIES**

### **Rollback Plan**
1. **Preserve Current Deployment**: Keep existing Vercel deployment active during migration
2. **Branch Strategy**: Maintain current working branch until new repo validated
3. **Database Backup**: Ensure Supabase has recent backup before any schema changes
4. **Documentation**: Complete rollback procedure documented

### **Risk Assessment**
- **LOW RISK**: All essential files identified and tested
- **LOW IMPACT**: Migration doesn't affect current production deployment
- **HIGH REWARD**: Significantly improved maintainability and development velocity

### **Contingency Procedures**
1. If migration fails: Continue using current repository
2. If deployment fails: Revert to current Vercel configuration  
3. If database issues: Use backup restoration procedures
4. If performance degrades: Investigate and optimize or rollback

---

## 📊 **MIGRATION TIMELINE**

**Total Estimated Time**: 2-3 hours

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Setup** | 15 min | Repository creation and configuration |
| **Migration** | 30 min | File copying and structure creation |
| **Testing** | 45 min | Deployment and functional testing |
| **Validation** | 30 min | Documentation and final validation |
| **Buffer** | 30 min | Issue resolution and optimization |

---

## 🏆 **EXPECTED OUTCOMES**

### **Immediate Benefits**
- Professional, clean repository for community contributors
- 92% reduction in repository size and complexity
- Clear foundation for post-testing development phase
- Improved build and deployment performance

### **Long-term Value**
- Scalable architecture for future feature development  
- Enhanced community contribution experience
- Better alignment with BLKOUT's transparency values
- Professional presentation for potential funding/partnerships

---

## 📞 **MIGRATION EXECUTION AUTHORITY**

**Decision Maker**: Repository owner/community leads  
**Technical Lead**: Migration executor  
**Validation**: Community testing team  
**Rollback Authority**: Repository owner in case of critical issues

---

**This specification provides complete instructions for migrating the BLKOUT moderation system to a clean, production-ready repository suitable for community development and democratic governance.**

---

*🚀 Migration Specification v1.0 | Community Liberation Platform | Democratic Development Foundation*  
*Prepared with ❤️ for the BLKOUT community's technological sovereignty*