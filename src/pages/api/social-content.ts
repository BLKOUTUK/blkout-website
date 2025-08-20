/**
 * API endpoint for social media content calendar
 * Serves content to the moderation dashboard
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const CALENDAR_FILE = '/home/robbe/blkout-content-calendar.json';

interface ContentCalendar {
  created: string;
  last_updated: string;
  content_entries: any[];
  scheduled_posts: any[];
  published_posts: any[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Read content calendar
      if (!fs.existsSync(CALENDAR_FILE)) {
        return res.status(200).json({
          success: true,
          content_entries: [],
          scheduled_posts: [],
          published_posts: []
        });
      }

      const calendarData = fs.readFileSync(CALENDAR_FILE, 'utf8');
      const calendar: ContentCalendar = JSON.parse(calendarData);
      
      return res.status(200).json({
        success: true,
        ...calendar
      });

    } else if (req.method === 'POST') {
      // Create new content entry
      const { content_type, scheduled_date, platforms } = req.body;
      
      if (!content_type || !scheduled_date || !platforms) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: content_type, scheduled_date, platforms'
        });
      }

      // Load existing calendar
      let calendar: ContentCalendar = {
        created: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        content_entries: [],
        scheduled_posts: [],
        published_posts: []
      };

      if (fs.existsSync(CALENDAR_FILE)) {
        const existingData = fs.readFileSync(CALENDAR_FILE, 'utf8');
        calendar = JSON.parse(existingData);
      }

      // Add new content entry
      const newEntry = {
        id: 'content_' + Date.now(),
        type: content_type,
        scheduled_date,
        created_date: new Date().toISOString(),
        platforms,
        status: 'pending',
        workflow_runs: {},
        content: {}
      };

      calendar.content_entries.push(newEntry);
      calendar.last_updated = new Date().toISOString();

      // Save calendar
      fs.writeFileSync(CALENDAR_FILE, JSON.stringify(calendar, null, 2));

      return res.status(201).json({
        success: true,
        content_entry: newEntry
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`
      });
    }

  } catch (error) {
    console.error('Social content API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}