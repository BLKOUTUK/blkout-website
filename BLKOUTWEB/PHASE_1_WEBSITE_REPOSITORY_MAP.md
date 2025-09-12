# 📂 BLKOUTUK/Phase-1-website Repository Structure Map

## 🎯 **PRODUCTION-READY WEBSITE REPOSITORY**

This document maps exactly what should be included in the new `BLKOUTUK/Phase-1-website` repository for the complete, production-ready BLKOUT Community Platform.

---

## 📋 **ESSENTIAL FILES FOR NEW REPOSITORY**

### **🔧 Core Configuration Files**
```
package.json                    # Dependencies and scripts
vercel.json                     # Deployment configuration
.nvmrc                         # Node.js version (20)
.gitignore                     # Git ignore patterns
```

### **🌐 API Layer** (Complete Moderation System)
```
api/
└── moderate-content.ts        # Complete moderation API with CRUD operations
```

### **⚛️ Frontend Components** (React/TypeScript)
```
src/
├── components/
│   ├── ModerationDashboard.tsx           # Full-featured moderation interface
│   ├── ModerationNotificationBadge.tsx  # Real-time notification indicator
│   └── community/
│       └── CommunityEngagementSlides.tsx # Community presentation component
├── hooks/
│   └── useModerationNotifications.ts     # Notification system hook
└── services/
    └── publicationService.ts             # Enhanced publication service
```

### **🧪 Testing Infrastructure**
```
tests/
└── moderation-pipeline.test.ts   # Comprehensive integration test suite
```

### **📁 Static Assets**
```
public/
└── index.html                   # Basic index page (API message)
```

### **🗄️ Database Schema**
```
database/
└── schema.sql                   # Complete production database schema
```

### **📚 Documentation**
```
docs/
├── README.md                    # Main project documentation
├── DEPLOYMENT_GUIDE.md          # Production deployment instructions
├── USER_TESTING_GUIDE.md        # Testing and usage guide
└── API_DOCUMENTATION.md         # API endpoint documentation
```

### **⚙️ Development Configuration**
```
.vscode/
└── settings.json               # VS Code configuration (optional)
```

---

## 🚫 **EXCLUDE FROM NEW REPOSITORY**

### **Development/Internal Files** (Don't Include)
```
❌ .claude/                    # Claude Code configuration
❌ .claude-flow/               # Claude Flow metrics
❌ .serena/                    # Serena MCP tool data
❌ .swarm/                     # Swarm configuration
❌ memory/                     # Development memory files
❌ scripts/                    # Development scripts
❌ templates/                  # Template files
❌ CLAUDE.md                   # Claude instructions
❌ *-updated.ts               # Development backup files
❌ database-schema-updates.sql # Development SQL files
❌ adapted-database-schema.sql # Development SQL files
❌ environment-variables.md    # Internal env docs
❌ AUTHENTICATION_BYPASS_COMPLETE.md # Development docs
❌ TESTING_REPORT_FINAL.md     # Development testing report
❌ MODERATION_DEPLOYMENT_GUIDE.md # Development deployment guide
❌ FINAL_DEPLOYMENT_INSTRUCTIONS.md # Development instructions
```

---

## 📦 **CLEAN REPOSITORY STRUCTURE**

```
BLKOUTUK/Phase-1-website/
│
├── 📄 README.md                           # Project overview & setup
├── 📄 package.json                        # Dependencies & scripts
├── 📄 vercel.json                         # Deployment configuration
├── 📄 .nvmrc                              # Node.js version
├── 📄 .gitignore                          # Git ignore patterns
│
├── 🌐 api/
│   └── moderate-content.ts                # Production moderation API
│
├── ⚛️ src/
│   ├── components/
│   │   ├── ModerationDashboard.tsx        # Moderation interface
│   │   ├── ModerationNotificationBadge.tsx # Notification badge
│   │   └── community/
│   │       └── CommunityEngagementSlides.tsx # Community component
│   ├── hooks/
│   │   └── useModerationNotifications.ts   # Notification system
│   └── services/
│       └── publicationService.ts           # Publication service
│
├── 🧪 tests/
│   └── moderation-pipeline.test.ts        # Integration tests
│
├── 📁 public/
│   └── index.html                         # Static entry point
│
├── 🗄️ database/
│   └── schema.sql                         # Production database schema
│
└── 📚 docs/
    ├── DEPLOYMENT_GUIDE.md                # Deployment instructions
    ├── USER_TESTING_GUIDE.md              # Usage guide
    └── API_DOCUMENTATION.md               # API reference
```

---

## 🔗 **PRODUCTION DEPENDENCIES**

### **Runtime Dependencies** (package.json)
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@vercel/node": "^3.0.21"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

### **Environment Variables Required**
```
VITE_SUPABASE_URL=https://bgjengudzfickgomjqmz.supabase.co
VITE_SUPABASE_ANON_KEY=[supabase_anon_key]
```

---

## 🚀 **DEPLOYMENT CONFIGURATION**

### **Vercel Configuration** (vercel.json)
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@3.0.21"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, GET, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

---

## 📊 **REPOSITORY SIZE ESTIMATION**

**Clean Repository Size**: ~50KB (without node_modules)  
**Key Files**: 11 production files  
**Documentation**: 4 essential guides  
**Database**: 1 production schema  
**Tests**: 1 comprehensive test suite  

---

## ✅ **PRODUCTION READINESS CHECKLIST**

### **Core Functionality** ✅
- [x] Complete moderation API (approve/reject/edit)
- [x] Real-time notification system
- [x] Database integration with Supabase
- [x] Frontend dashboard components
- [x] Comprehensive test coverage

### **Deployment Ready** ✅
- [x] Vercel configuration optimized
- [x] Node.js 20 compatibility
- [x] CORS headers configured
- [x] Production error handling
- [x] Environment variables documented

### **Documentation Complete** ✅
- [x] API documentation
- [x] Deployment guide
- [x] User testing guide
- [x] Database schema

---

## 🎯 **MIGRATION STRATEGY**

### **Step 1: Create Clean Repository**
1. Initialize `BLKOUTUK/Phase-1-website`
2. Copy only essential files listed above
3. Remove development artifacts

### **Step 2: Update Documentation**
1. Create production README.md
2. Update deployment guides for clean repo
3. Document environment setup

### **Step 3: Verify Deployment**
1. Test Vercel deployment from clean repo
2. Verify all API endpoints functional
3. Confirm database connectivity

---

## 🏆 **FINAL RESULT**

**The new `BLKOUTUK/Phase-1-website` repository will contain:**
- ✅ **Complete Production Website** with moderation system
- ✅ **Clean, Maintainable Structure** without development artifacts  
- ✅ **Comprehensive Documentation** for community use
- ✅ **Ready for Community Deployment** and contribution
- ✅ **Professional Repository** suitable for production use

**Estimated Size**: 50KB clean repository vs. current 656KB with development artifacts

---

*This structure provides a clean, production-ready repository that the BLKOUT community can confidently deploy and maintain.* 🚀

---

**BLKOUT Phase 1 Website v1.0** | **Production Repository Structure** | **Community Liberation Platform**  
*Structured with ❤️ for community maintainability and democratic governance*