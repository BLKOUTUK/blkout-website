# BLKOUT Chrome Extension Installation Guide

## Quick Installation (Recommended)

1. **Download the Extension Package**
   - Download `blkout-extension-v1.1.0.tar.gz` from the Integration Dashboard
   - Extract the archive to a folder on your computer

2. **Enable Developer Mode in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the extracted `blkout-extension` folder
   - The BLKOUT extension icon should appear in your toolbar

4. **Start Using**
   - Visit any event site (Eventbrite, Facebook Events, Meetup)
   - Visit news sites (Guardian, BBC, Independent, Twitter)
   - Click the BLKOUT extension icon to submit content

## What Gets Auto-Detected

### Events
- **Eventbrite**: Event title, description, date/time, location, organizer, ticket pricing
- **Facebook Events**: Event details, host information, attendee counts
- **Meetup**: Event info, group/organizer names, venue details, RSVP counts
- **Generic Sites**: Event keywords detection, registration links

### Articles & News
- **The Guardian**: Headlines, author, article sections, publication dates
- **BBC News**: Article content, publication info, news categories
- **The Independent**: Headlines, author details, article metadata
- **Twitter/X**: Tweet content, user information, engagement metrics
- **Generic Sites**: Article metadata, author information, publication dates

## Features

- **One-Click Submission**: Submit events and articles directly to BLKOUT
- **Smart Pre-filling**: Forms auto-populate with detected information
- **Link Scraping**: Automatically finds registration links, ticket pages, and more info URLs
- **Real-time Integration**: Submissions appear immediately in admin dashboard
- **Multiple Entry Points**: Browser action, right-click context menu, floating buttons

## Troubleshooting

### Extension Not Loading
- Ensure you extracted the full archive
- Check that "Developer mode" is enabled
- Try refreshing the extensions page

### Content Not Detected
- Some sites may use different selectors than expected
- Use manual submission mode for unsupported sites
- Report detection issues to the community team

### Submission Failures
- Check your internet connection
- Verify the BLKOUT website is accessible
- Try refreshing the page and submitting again

## Privacy & Security

- Extension only requests minimal permissions for content detection
- No personal data is stored or transmitted beyond submission details
- All submissions go directly to BLKOUT moderation queue
- Source URLs are preserved for verification and attribution

## Support

- **Community Help**: Ask in the BLKOUT governance channels
- **Technical Issues**: Contact the development team via Integration Dashboard
- **Feature Requests**: Submit via community governance proposals

## Version Information

**Current Version**: 1.1.0
**Supported Browsers**: Chrome, Edge, Brave (Chromium-based browsers)
**Minimum Chrome Version**: 88+

---

*This extension was built by the BLKOUT community to streamline content submission and reduce moderation workload through intelligent auto-detection.*