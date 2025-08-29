import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return res.status(200).json({
        success: true,
        events: events || []
      });
    } catch (error) {
      console.error('Events GET error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch events'
      });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const {
        title,
        description,
        date,
        time,
        location,
        organizer,
        category,
        capacity,
        sourceUrl,
        submittedVia,
        moreInfoUrl,
        ticketInfo,
        attendeeCount,
        registrationLink,
        tags,
        status = 'draft'
      } = req.body;
      
      // Validate required fields
      if (!title || !date) {
        return res.status(400).json({
          success: false,
          error: 'Title and date are required'
        });
      }
      
      // Create event record
      const { data: event, error } = await supabase
        .from('events')
        .insert([{
          title,
          description,
          date,
          time: time || '18:00',
          location: typeof location === 'string' ? { type: 'physical', address: location } : location,
          organizer: organizer || 'Community Submitted',
          category: category || 'Community',
          capacity: capacity || 50,
          source_url: sourceUrl,
          submitted_via: submittedVia || 'chrome-extension',
          more_info_url: moreInfoUrl,
          ticket_info: ticketInfo,
          attendee_count: attendeeCount,
          registration_link: registrationLink,
          tags: tags || ['community-submitted'],
          status: status,
          featured: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        event
      });
    } catch (error) {
      console.error('Events POST error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create event'
      });
    }
  }
  
  if (req.method === 'PUT') {
    // Handle moderation updates
    const { id } = req.query;
    const { status, moderatorNotes, moderatedAt, moderatedBy } = req.body;
    
    try {
      const { data: event, error } = await supabase
        .from('events')
        .update({
          status,
          moderator_notes: moderatorNotes,
          moderated_at: moderatedAt || new Date().toISOString(),
          moderated_by: moderatedBy
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        event
      });
    } catch (error) {
      console.error('Events PUT error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update event'
      });
    }
  }
  
  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed`
  });
}