# N8N Workflow Testing Setup

## Google Sheets Structure for Testing

### Tab 1: Content Calendar
| Column | Header | Example Data |
|--------|--------|--------------|
| A | publish_date | 2025-01-13 |
| B | platform | instagram |
| C | content_type | post |
| D | title | Community Workshop Reminder |
| E | content | Join us tomorrow for our cooperative ownership workshop! 🌟 |
| F | status | approved |
| G | engagement_score | (auto-filled) |

### Tab 2: Community Insights
| Column | Header | Example Data |
|--------|--------|--------------|
| A | date | 2025-01-13 |
| B | platform | instagram |
| C | post_id | (auto-filled) |
| D | likes | (auto-filled) |
| E | comments | (auto-filled) |
| F | shares | (auto-filled) |
| G | engagement_rate | (auto-filled) |

### Tab 3: Event Calendar
| Column | Header | Example Data |
|--------|--------|--------------|
| A | event_date | 2025-01-15 |
| B | title | Cooperative Ownership Workshop |
| C | location | Community Center, London |
| D | description | Learn the basics of cooperative ownership |
| E | registration_link | https://example.com/register |
| F | status | published |

## Quick Setup Instructions

1. **Create the Google Sheet** with the structure above
2. **Share the sheet** with: blkout-automation@your-project.iam.gserviceaccount.com (when you create service account)
3. **Copy the Sheet ID** from the URL (the long string after /spreadsheets/d/)
4. **Add test data** to the Content Calendar tab
5. **Note the Sheet ID** - we'll need it for the workflows

## Testing Goals
- ✅ Read data from Google Sheets
- ✅ Filter content by today's date
- ✅ Process content through workflow logic
- ⚠️ Social media posting (we'll use mock/test mode first)
- ✅ Write results back to tracking sheets

## Safety First
- Start with TEST/DRY-RUN mode
- Use personal accounts, not BLKOUT official accounts
- Test with minimal data first
- Verify each step before full automation