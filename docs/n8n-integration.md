# n8n Workflow Integration

## Overview

BLKOUT now includes automated workflow integration with n8n, enabling powerful automation for both events and newsroom content management. This integration allows for automated actions when content is created, approved, published, or rejected.

## Webhook Endpoints

### Events Webhooks
- **URL**: `/api/webhooks/n8n-events`
- **Purpose**: Triggers n8n workflows for event lifecycle management

### Newsroom Webhooks  
- **URL**: `/api/webhooks/n8n-newsroom`
- **Purpose**: Triggers n8n workflows for article lifecycle management

## Available Workflows

### Events Workflows
- `event-created` - Triggered when new events are submitted
- `event-approved` - Triggered when events are approved by moderators
- `event-published` - Triggered when events are published
- `event-rejected` - Triggered when events are rejected

### Newsroom Workflows
- `article-created` - Triggered when new articles are submitted
- `article-approved` - Triggered when articles are approved
- `article-published` - Triggered when articles are published
- `article-updated` - Triggered when articles are modified
- `article-rejected` - Triggered when articles are rejected
- `article-archived` - Triggered when articles are archived

## Configuration

### Environment Variables
Set the following environment variable in your Vercel deployment:
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

### Webhook Payload Structure

#### Events Payload
```json
{
  "workflow": "event-created",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "event": {
    "id": "evt_1234567890",
    "title": "Community Healing Circle",
    "description": "A safe space for collective healing...",
    "date": "2025-02-15",
    "time": "18:00",
    "location": {
      "type": "physical",
      "address": "Community Center, London"
    },
    "status": "published",
    "organizer": "BLKOUT Healing Collective"
  },
  "source": "blkout-events-api"
}
```

#### Articles Payload
```json
{
  "workflow": "article-published",
  "timestamp": "2025-01-20T10:30:00.000Z",  
  "article": {
    "id": "art_1234567890",
    "title": "Building Safe Spaces: A Community Guide",
    "excerpt": "Creating inclusive environments...",
    "author": "Community Collective",
    "category": "Community Building",
    "status": "published",
    "tags": ["safe spaces", "community", "inclusion"]
  },
  "source": "blkout-newsroom-api"
}
```

## Automation Examples

### Event Management Automation
1. **Event Created**: Send notification to moderators, auto-categorize based on content
2. **Event Approved**: Send confirmation to organizer, add to community calendar
3. **Event Published**: Post to social media, send to newsletter subscribers
4. **Event Rejected**: Send feedback to submitter with improvement suggestions

### Newsroom Automation
1. **Article Created**: Run content analysis, check for duplicate content
2. **Article Approved**: Generate SEO meta tags, prepare social media posts
3. **Article Published**: Post to social media, update RSS feed, notify subscribers
4. **Article Updated**: Re-index for search, notify subscribers of major changes

## API Integration

### Triggering Workflows Manually

```javascript
// Trigger event workflow
const response = await fetch('/api/webhooks/n8n-events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'published',
    eventId: 'evt_1234567890'
  })
})

// Trigger newsroom workflow
const response = await fetch('/api/webhooks/n8n-newsroom', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'approved',
    articleId: 'art_1234567890'
  })
})
```

### Getting Workflow Status

```javascript
// Check events workflow configuration
const response = await fetch('/api/webhooks/n8n-events')
const config = await response.json()

// Check newsroom workflow configuration  
const response = await fetch('/api/webhooks/n8n-newsroom')
const config = await response.json()
```

## n8n Setup Guide

### 1. Create Webhook Nodes
- Create HTTP trigger nodes for each workflow type
- Use the webhook URLs provided by BLKOUT

### 2. Example Workflow: Article Published
1. **Webhook Trigger**: Listen for `article-published` events
2. **Content Analysis**: Extract key information from article
3. **Social Media**: Post to Twitter/Facebook with auto-generated content
4. **Email**: Add to newsletter queue
5. **Analytics**: Track publication metrics

### 3. Example Workflow: Event Approved
1. **Webhook Trigger**: Listen for `event-approved` events
2. **Calendar**: Add event to Google Calendar
3. **Notifications**: Send confirmation email to organizer
4. **Social Media**: Schedule promotional posts
5. **Community**: Post to Discord/Slack channels

## Security Considerations

- Webhook endpoints are publicly accessible but non-critical failures
- All workflow triggers are logged for debugging
- Sensitive data should not be included in webhook payloads
- Use HTTPS for all n8n webhook URLs

## Monitoring

- Check logs in Vercel dashboard for webhook trigger attempts
- Monitor n8n workflow execution status
- Failed webhooks are logged but don't affect core functionality

## Testing

### Test Webhook Endpoints
```bash
# Test events webhook
curl -X POST https://blkout-beta.vercel.app/api/webhooks/n8n-events \
  -H "Content-Type: application/json" \
  -d '{"action": "created", "eventData": {"id": "test", "title": "Test Event"}}'

# Test newsroom webhook  
curl -X POST https://blkout-beta.vercel.app/api/webhooks/n8n-newsroom \
  -H "Content-Type: application/json" \
  -d '{"action": "published", "articleData": {"id": "test", "title": "Test Article"}}'
```

This integration enables powerful automation while maintaining the core functionality of the BLKOUT platform.