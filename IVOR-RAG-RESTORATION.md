# IVOR RAG System Restoration Guide

## 📍 **RAG Code Locations (Preserved)**

The RAG (Retrieval Augmented Generation) code for IVOR chatbot functionality has been safely moved to preserve it while fixing Vercel deployment limits.

### **Backup Locations:**
- **API Functions**: `api-backup/rag/` 
  - `ingest.ts` - Document ingestion and processing
  - `search.ts` - Semantic search functionality  
  - `scrape.ts` - Web scraping for content updates
  - `sources.ts` - Source management and validation

- **Core Libraries**: `lib/rag-backup/`
  - Core RAG functionality and utilities

### **Why Moved:**
- Vercel Hobby plan limits to 12 serverless functions
- We had 13 functions (over limit)
- RAG APIs had TypeScript errors preventing deployment
- Needed to deploy photo competition and core functionality

### **Restoration Process:**

When ready to restore IVOR RAG functionality:

1. **Move back to active API folder:**
   ```bash
   cp -r api-backup/rag/* api/rag/
   ```

2. **Fix TypeScript issues:**
   - Install missing `next` dependency
   - Fix error type annotations
   - Update ChromaDB client calls

3. **Deploy options:**
   - Upgrade to Vercel Pro plan (more functions allowed)
   - Deploy RAG APIs to separate Vercel project
   - Use different hosting for RAG services

### **Current Status:**
- ✅ RAG code safely preserved in `api-backup/`
- ✅ Main deployment working (photo competition functional)
- ⏳ RAG restoration planned for next phase

### **Integration Notes:**
- IVOR chatbot relies on these RAG APIs for intelligent responses
- Semantic search powered by ChromaDB vector database
- Document ingestion supports various content formats
- Critical for community knowledge base functionality

---
**Date Created**: 2025-08-12  
**Status**: Temporarily disabled for deployment fix  
**Next Action**: Restore when deployment infrastructure upgraded