# IVOR Chrome Extension Changelog

## Version 1.1.0 (Latest) - 2025-08-28

### ✨ New Features
- **Enhanced Content Detection**: Added comprehensive metadata scraping for events and articles
- **Auto-Scraped Links**: Automatic detection of registration links, "more info" URLs, and ticket pages
- **IVOR Branding**: Updated extension branding with official IVOR Chrome logo
- **Admin Navigation**: Added back-to-hub navigation in all admin dashboards

### 🔧 Improvements
- **Event Scraping**: Now captures organizer info, ticket pricing, attendee counts from Eventbrite, Facebook Events, Meetup
- **Article Metadata**: Auto-extracts publication dates, article sections, author information from news sites
- **Form Pre-filling**: Smart pre-population of all available scraped data
- **Visual Preview**: Added scraped information preview in submission forms
- **API Integration**: Full backend integration with Supabase for immediate admin dashboard appearance

### 🛠️ Technical Updates
- **Content Scripts**: Added proper content script declarations to manifest
- **Icon Assets**: All extension icons now use official IVOR branding
- **Schema Alignment**: Extension submissions properly match database structure
- **Error Handling**: Improved fallback handling for missing data

### 📍 Platform Support
- **News Sites**: Guardian, BBC, Independent with enhanced metadata extraction
- **Event Platforms**: Eventbrite, Facebook Events, Meetup with comprehensive data scraping
- **Social Media**: Twitter/X content detection and submission
- **Generic Sites**: Smart detection for events and articles with registration link finding

---

## Version 1.0.1 - 2025-08-08

### 🚀 Initial Release
- **Basic Content Detection**: Event and article detection for major platforms
- **One-Click Submission**: Submit content directly to BLKOUT platform
- **Multi-Platform Support**: Eventbrite, Facebook Events, Guardian, BBC, Independent
- **Form Interface**: Clean submission forms with basic pre-filling
- **Context Menu**: Right-click submission option
- **Browser Action**: Popup interface for content submission

### 🔧 Core Features
- **Platform Detection**: Automatic recognition of supported sites
- **Content Extraction**: Basic title, description, and URL extraction
- **API Submission**: Direct submission to BLKOUT backend
- **Status Feedback**: Success/error notifications
- **Developer Mode**: Easy installation for community testing

---

*This extension is developed by the BLKOUT community to streamline content submission and reduce moderation workload through intelligent auto-detection.*