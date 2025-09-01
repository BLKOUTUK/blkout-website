# BLKOUTUK.com Article Migration Guide

This guide walks you through migrating articles from the original BLKOUTUK.com site to the new community platform.

## Overview

The migration system preserves the original articles, metadata, and context from BLKOUTUK.com while properly integrating them into the new community platform structure.

### What Gets Migrated

- ✅ **Article content**: Full text with HTML formatting preserved
- ✅ **Metadata**: Titles, publication dates, authors, categories
- ✅ **Featured images**: Automatically detected and preserved
- ✅ **Categories**: Mapped from BLKOUTUK categories (READ, LISTEN, WATCH, etc.)
- ✅ **Tags**: Extracted from content and metadata
- ✅ **Source URLs**: Links back to original BLKOUTUK.com articles
- ✅ **Community context**: Special badges indicating BLKOUTUK legacy content

## Migration Methods

### 1. Admin Panel (Recommended for Small Batches)

Navigate to `/admin/migration` in your community platform:

```
https://your-site.vercel.app/admin/migration
```

**Features:**
- Visual progress tracking
- Real-time discovery of articles
- Error handling and reporting
- Backup creation
- Preview before migration

**Steps:**
1. Click "Discover Only" to see what articles are available
2. Review the discovered articles list
3. Click "Start Full Migration" to begin the process
4. Monitor progress and review results

### 2. CLI Script (Recommended for Production)

Use the command-line script for batch migrations:

```bash
# Install dependencies
npm install commander chalk ora inquirer

# Run discovery only (dry run)
npx tsx scripts/migrate-blkoutuk.ts --dry-run --verbose

# Run full migration
npx tsx scripts/migrate-blkoutuk.ts

# With custom options
npx tsx scripts/migrate-blkoutuk.ts \
  --supabase-url "your-supabase-url" \
  --supabase-key "your-supabase-key" \
  --batch-size 5 \
  --backup-path "./custom-backups" \
  --verbose
```

**CLI Options:**
- `--dry-run`: Preview migration without making changes
- `--verbose`: Show detailed progress and article lists
- `--supabase-url`: Override Supabase URL
- `--supabase-key`: Override Supabase anon key
- `--batch-size`: Number of articles to process at once (default: 10)
- `--backup-path`: Directory for backup files (default: ./backups)

### 3. Programmatic API

Use the migration library directly in your code:

```typescript
import { BlkoutUKMigration } from './src/lib/blkoutuk-migration'

const migration = new BlkoutUKMigration()

// Run full migration
const result = await migration.runFullMigration()

// Or step by step
const articles = await migration.discoverArticles()
const backup = await migration.createPreMigrationBackup()
const migrationResult = await migration.migrateArticles(articles)
```

## Pre-Migration Checklist

### Environment Setup

1. **Supabase Configuration**
   ```bash
   # Required environment variables
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. **Database Schema**
   Ensure your `articles` table includes:
   - `source_url` column for original BLKOUTUK links
   - `submitted_via` column to track migration source
   - `moderated_at` and `moderated_by` for migration metadata

3. **Backup Strategy**
   - Automatic backups are created before migration
   - Manual backup: Export your current articles table
   - Store backups in version control or external storage

### Content Considerations

1. **Duplicate Prevention**
   - Migration checks for existing articles by `source_url`
   - Re-running migration will skip already imported articles
   - Use `--verbose` to see which articles are skipped

2. **Category Mapping**
   BLKOUTUK categories are mapped to community platform categories:
   - `READ` → `Community`
   - `LISTEN` → `Media & Storytelling`
   - `WATCH` → `Media & Storytelling`
   - `GALLERY` → `Arts & Culture`
   - `EVENT` → `Community`
   - `REPORT` → `History & Culture`

3. **Content Processing**
   - HTML content is preserved with cleanup of ads/scripts
   - Images are linked to original BLKOUTUK.com URLs
   - Excerpts are auto-generated from content
   - Tags are extracted from content themes

## Migration Process

### Phase 1: Discovery
```
🔍 Scanning BLKOUTUK.com homepage for article links
📄 Extracting article metadata and content
🏷️  Categorizing and tagging articles
```

### Phase 2: Backup
```
💾 Creating pre-migration backup of existing articles
📊 Storing backup with timestamp and metadata
```

### Phase 3: Migration
```
🚀 Processing articles in batches
✅ Converting BLKOUTUK format to community platform format
📝 Inserting articles with proper metadata
🔗 Preserving source URLs and migration context
```

## Viewing Migrated Content

### Story Archive
Access the complete archive at `/newsroom/archive`:

- **Filter by source**: View only BLKOUTUK legacy content
- **Search functionality**: Find specific articles or topics
- **Migration badges**: Visual indicators for content source
- **Original links**: Quick access to source articles

### Admin Dashboard
Monitor migrated content at `/admin/newsroom`:

- **Moderation status**: All migrated articles marked as moderated
- **Source tracking**: `submitted_via: 'blkoutuk-migration'`
- **Bulk operations**: Edit or update migrated content

## Troubleshooting

### Common Issues

**1. Connection Errors**
```bash
❌ Failed to connect to Supabase
```
- Verify SUPABASE_URL and SUPABASE_ANON_KEY
- Check network connectivity
- Confirm Supabase project is active

**2. No Articles Found**
```bash
⚠️ No articles found to migrate
```
- BLKOUTUK.com structure may have changed
- Check if site is accessible
- Review article discovery selectors

**3. Import Failures**
```bash
❌ Failed to import article: "Article Title"
```
- Check database constraints
- Verify article data completeness
- Review error logs for specific issues

### Recovery

**Rollback Migration**
```sql
-- Remove all BLKOUTUK migrated articles
DELETE FROM articles 
WHERE submitted_via = 'blkoutuk-migration';

-- Restore from backup
-- (Import your backup JSON file)
```

**Partial Re-migration**
```bash
# Re-run migration (will skip existing articles)
npx tsx scripts/migrate-blkoutuk.ts --verbose
```

## Post-Migration Tasks

### Content Review
1. **Quality Check**: Review a sample of migrated articles
2. **Categorization**: Adjust categories if needed
3. **Tags**: Add additional community-relevant tags
4. **Images**: Consider hosting images locally for better performance

### Community Integration
1. **Announcements**: Inform community about archived content availability
2. **Story Archive**: Promote the archive feature to users
3. **Search**: Test search functionality with migrated content
4. **Moderation**: Set up review process for legacy content

### Performance
1. **Database Indexing**: Add indexes for `submitted_via` and `source_url`
2. **Image Optimization**: Consider CDN for featured images
3. **Caching**: Implement caching for archive pages

## Migration Statistics

After migration, you'll have access to:

- **Total articles migrated**
- **Categories distribution**
- **Date range covered**
- **Tags extracted**
- **Success/failure rates**
- **Processing time**

## Support

### Logs and Debugging
- CLI tool provides verbose output with `--verbose` flag
- Admin panel shows real-time progress and errors
- All operations logged to console with timestamps

### Data Validation
```sql
-- Check migration results
SELECT 
  submitted_via,
  COUNT(*) as article_count,
  MIN(published_at) as earliest_article,
  MAX(published_at) as latest_article
FROM articles 
WHERE submitted_via = 'blkoutuk-migration'
GROUP BY submitted_via;
```

### Rollback Plan
1. **Immediate**: Use backup files to restore previous state
2. **Selective**: Remove specific migrated articles by source_url
3. **Complete**: Full database restore from pre-migration backup

---

**Migration Checklist:**
- [ ] Environment variables configured
- [ ] Database schema up to date  
- [ ] Backup strategy in place
- [ ] Test migration with `--dry-run`
- [ ] Run full migration
- [ ] Verify content in Story Archive
- [ ] Announce to community
- [ ] Monitor for issues

For technical support, check the migration logs or contact the development team with specific error messages and migration timestamps.