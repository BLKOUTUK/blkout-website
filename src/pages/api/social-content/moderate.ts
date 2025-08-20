/**
 * API endpoint for social media content moderation actions
 * Handles approve/reject actions from the moderation dashboard
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

const CALENDAR_FILE = '/home/robbe/blkout-content-calendar.json';

interface ContentCalendar {
  created: string;
  last_updated: string;
  content_entries: any[];
  scheduled_posts: any[];
  published_posts: any[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`
    });
  }

  try {
    const { content_id, platform, action, reason, moderator, moderated_at } = req.body;

    if (!content_id || !platform || !action || !moderator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: content_id, platform, action, moderator'
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    // Load existing calendar
    if (!fs.existsSync(CALENDAR_FILE)) {
      return res.status(404).json({
        success: false,
        error: 'Content calendar not found'
      });
    }

    const calendarData = fs.readFileSync(CALENDAR_FILE, 'utf8');
    const calendar: ContentCalendar = JSON.parse(calendarData);

    // Find the content entry
    const entryIndex = calendar.content_entries.findIndex(entry => entry.id === content_id);
    if (entryIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Content entry not found'
      });
    }

    const entry = calendar.content_entries[entryIndex];

    // Update moderation status
    if (action === 'approve') {
      // Add to approved platforms
      if (!entry.approved_platforms) {
        entry.approved_platforms = [];
      }
      if (!entry.approved_platforms.includes(platform)) {
        entry.approved_platforms.push(platform);
      }
      entry.approved_at = moderated_at;
      entry.status = 'approved';

      // Update moderation result
      if (entry.moderation_result) {
        if (!entry.moderation_result.approved_platforms.includes(platform)) {
          entry.moderation_result.approved_platforms.push(platform);
        }
        entry.moderation_result.rejected_platforms = 
          entry.moderation_result.rejected_platforms.filter((p: string) => p !== platform);
      }

    } else if (action === 'reject') {
      entry.status = 'rejected';
      entry.rejected_at = moderated_at;
      entry.rejection_reason = reason;

      // Update moderation result
      if (entry.moderation_result) {
        if (!entry.moderation_result.rejected_platforms.includes(platform)) {
          entry.moderation_result.rejected_platforms.push(platform);
        }
        entry.moderation_result.approved_platforms = 
          entry.moderation_result.approved_platforms.filter((p: string) => p !== platform);
      }
    }

    // Add moderation log
    if (!entry.moderation_log) {
      entry.moderation_log = [];
    }
    entry.moderation_log.push({
      action,
      platform,
      moderator,
      moderated_at,
      reason: reason || null
    });

    // Update calendar
    calendar.content_entries[entryIndex] = entry;
    calendar.last_updated = new Date().toISOString();

    // Save calendar
    fs.writeFileSync(CALENDAR_FILE, JSON.stringify(calendar, null, 2));

    return res.status(200).json({
      success: true,
      message: `Content ${action}d successfully`,
      content_entry: entry
    });

  } catch (error) {
    console.error('Social moderation API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}