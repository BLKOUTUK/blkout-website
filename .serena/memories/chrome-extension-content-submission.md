# BLKOUT Chrome Extension - Content Submission System

## 🎯 Vision
A Chrome extension that enables community moderators and contributors to easily submit events and stories directly from any webpage to the BLKOUT platform for moderation review.

## 🔧 Core Functionality

### Quick Submission Features
1. **Smart Context Detection**
   - Auto-detect event details from Facebook events, Eventbrite, etc.
   - Extract article content from news sites, blogs, social media
   - Parse dates, locations, titles automatically
   - Suggest relevant tags based on content

2. **One-Click Submission**
   - Right-click context menu: "Submit to BLKOUT"
   - Floating submit button on detected content
   - Quick form with pre-filled detected data
   - Draft saving for incomplete submissions

### Submission Types

#### Events Submission
- **Auto-Detection**: Event pages, social media posts about events
- **Fields**: Title, date/time, location, description, organizer, cost
- **Enhanced Features**: 
  - Location validation (UK focus)
  - Duplicate event detection
  - Category auto-suggestion (community, education, activism, etc.)

#### News/Stories Submission  
- **Auto-Detection**: News articles, blog posts, social media content
- **Fields**: Title, source URL, excerpt, category, tags
- **Enhanced Features**:
  - Source credibility checking
  - Bias detection warnings
  - Liberation-focus relevance scoring

## 🏗 Technical Architecture

### Extension Structure
```
blkout-extension/
├── manifest.json (v3)
├── background.js (service worker)
├── content-scripts/
│   ├── detector.js (content detection)
│   ├── form-injector.js (submission forms)
│   └── ui-overlay.js (floating UI)
├── popup/
│   ├── popup.html (main interface)
│   ├── popup.js (popup logic)
│   └── popup.css (styling)
├── options/
│   ├── options.html (settings)
│   └── options.js (configuration)
└── assets/ (icons, images)
```

### API Integration
- **Events API**: `POST /api/events` (status: pending)
- **Newsroom API**: `POST /api/articles` (status: pending) 
- **Authentication**: OAuth with BLKOUT platform
- **Moderation Queue**: Direct integration with admin dashboard

## 🎨 User Experience Flow

### Discovery & Installation
1. **Chrome Web Store**: Listed as "BLKOUT Community Submission Tool"
2. **Platform Integration**: Download link from BLKOUT website
3. **Onboarding**: Quick setup with BLKOUT account connection

### Daily Usage
1. **Browse Web**: User finds relevant event/article
2. **Auto-Detection**: Extension highlights submittable content
3. **Quick Submit**: One-click submission with smart pre-fill
4. **Confirmation**: Success message with moderation queue link

### Advanced Features
1. **Bulk Submission**: Select multiple items for batch submission
2. **Scheduled Submission**: Queue submissions for later
3. **Template System**: Save submission templates for repeated use
4. **Analytics**: Track submission success rates and moderator feedback

## 🔒 Privacy & Security

### Data Handling
- **Minimal Data**: Only extract public content user explicitly selects
- **Local Storage**: Drafts stored locally, not transmitted
- **Secure API**: All communications encrypted (HTTPS)
- **User Consent**: Clear permissions for each website

### Permissions Required
- `activeTab`: Access current page content
- `storage`: Save drafts and settings
- `https://blkout-website.vercel.app/*`: API communication
- `contextMenus`: Right-click submission options

## 📋 Development Phases

### Phase 1: MVP (Core Submission)
- Basic event/article submission forms
- Simple content detection for common sites
- Direct API integration with pending status
- Chrome Web Store publication

### Phase 2: Smart Detection
- AI-powered content extraction
- Duplicate detection and prevention
- Category and tag auto-suggestion
- Enhanced UI with floating overlays

### Phase 3: Community Features
- Collaborative submission (multiple contributors)
- Moderation feedback integration
- Community guidelines enforcement
- Gamification (submission leaderboards)

## 🎯 Success Metrics
- **Adoption**: 100+ active moderators using extension
- **Submissions**: 50+ quality submissions per week
- **Approval Rate**: 80%+ submission approval rate
- **Community Growth**: Increased event/story discovery and engagement