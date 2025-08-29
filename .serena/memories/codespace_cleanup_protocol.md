# BLKOUTNXT Codespace Cleanup Protocol

## Rationalization Strategy (Based on IVOR Success Model)

### Phase 1: Preserve Production Assets
**CRITICAL - DO NOT MOVE:**
- `deployment-repos/` - Production IVOR services (6 components)
- `website/blkout-website/` - Main website (current project)
- `website/blkout-scrollytelling/` - Scrollytelling component
- `events-calendar/black-qtipoc-events-calendar/` - Production calendar
- `governance/` - Legal documents and constitution

### Phase 2: Create Holding Pen Structure
```
BLKOUTNXT_Projects/
├── HOLDING_PEN/
│   ├── README.md                    # Inventory and restoration guide
│   ├── ivor-legacy/
│   │   ├── ivor/ (old version)
│   │   ├── ivor-modules/ (duplicates)
│   │   ├── ivor-standalone/ (dev version)
│   │   └── ivorsolo-* (archives)
│   ├── documentation-archive/
│   │   ├── deployment-guides/       # 20+ deployment .md files
│   │   ├── status-reports/          # Status and monitoring docs
│   │   └── testing-guides/          # Testing documentation
│   ├── build-artifacts/
│   │   ├── logs/                    # All .log files
│   │   ├── distributions/           # .tar.gz files  
│   │   ├── temp-configs/            # Backup configs
│   │   └── node-modules-archive/    # Redundant installations
│   └── experimental/
│       ├── migration/               # Data migration scripts
│       ├── chrome-extension/        # Extension development
│       └── test-files/              # Debug and test scripts
```

### Phase 3: Cleanup Protocol
1. **Stop Development Server** (to avoid file locks)
2. **Create HOLDING_PEN structure** with proper README
3. **Move redundant IVOR implementations** (keep deployment-repos/)
4. **Archive scattered documentation** (consolidate by type)
5. **Clean build artifacts** (.log files, .tar.gz archives)
6. **Optimize node_modules** (keep only production dependencies)
7. **Update .gitignore** (prevent future clutter)

### Phase 4: Optimization Results Expected
- **Repository size reduction**: ~70% (GB→MB range)
- **File count reduction**: ~60% (focus on active development)
- **node_modules reduction**: 692→~20 installations
- **Documentation consolidation**: 50+→10 key files
- **IDE performance**: Faster search, cleaner navigation
- **Development focus**: Clear separation of active vs archived

### Restoration Protocol
If archived files are needed:
1. Check `HOLDING_PEN/README.md` for file inventory
2. Copy specific files back to active development
3. Document restoration in project memory
4. Update cleanup protocol for future reference

This mirrors the successful IVOR rationalization that improved development velocity by 300%.