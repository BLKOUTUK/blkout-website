# Newsroom Moderation System Requirements

## 🎯 Objective
Develop a parallel moderation stage for newsroom articles, similar to the existing events moderation system.

## 📊 Current State Analysis

### Events System (Working Model)
- **Status Flow**: `pending` → `approved`/`rejected`
- **Components**: Moderation interface, status filtering, approval workflow
- **Backend**: Status tracking, moderation endpoints
- **Frontend**: Status badges, filtering by approval state

### Newsroom System (Current - No Moderation)
- **Status**: All articles published immediately
- **Backend**: Direct article serving
- **Frontend**: Shows all articles without filtering
- **Missing**: Moderation workflow, status tracking, approval process

## 🛠 Moderation System Architecture Plan

### Phase 1: Backend Extension
1. **Article Status Field**: Add `status: 'pending' | 'approved' | 'rejected' | 'draft'`
2. **Moderation Endpoints**: 
   - `GET /api/articles/pending` - Articles awaiting review
   - `POST /api/articles/{id}/approve` - Approve article
   - `POST /api/articles/{id}/reject` - Reject article
3. **Database Schema**: Update article model with moderation fields

### Phase 2: Moderation Interface
1. **Admin Dashboard**: Moderation queue component
2. **Article Preview**: Review interface with approve/reject actions
3. **Bulk Actions**: Multi-select moderation capabilities
4. **Moderation History**: Track who approved/rejected what

### Phase 3: Public Integration
1. **Status Filtering**: Only show approved articles publicly
2. **Draft Management**: Content creators can save drafts
3. **Submission Flow**: New articles start as pending
4. **Community Guidelines**: Clear moderation criteria

## 🔄 Implementation Strategy
- **Parallel Development**: Build alongside current system
- **Backward Compatibility**: Existing articles auto-approved
- **Gradual Rollout**: Feature flags for controlled deployment
- **Community Input**: Moderation guidelines developed democratically