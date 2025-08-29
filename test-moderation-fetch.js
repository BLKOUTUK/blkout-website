import { createClient } from '@supabase/supabase-js';

// Same exact query as ModerationDashboard uses
const supabase = createClient(
  'https://bgjengudzfickgomjqmz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
);

async function testModerationFetch() {
  console.log('🧪 Testing exact same fetch as ModerationDashboard...\n');
  
  try {
    // Exact same query as in ModerationDashboard.tsx lines 73-76
    const [eventsResult, articlesResult] = await Promise.all([
      supabase.from('events').select('*').in('status', ['draft', 'pending']),
      supabase.from('newsroom_articles').select('*').in('status', ['draft', 'pending'])
    ]);
    
    console.log('Events result:', eventsResult);
    console.log('Articles result:', articlesResult);
    
    let combinedQueue = [];
    
    // Process events (same as ModerationDashboard)
    if (eventsResult.data) {
      console.log('Processing events:', eventsResult.data);
      eventsResult.data.forEach((event) => {
        console.log('Adding event to queue:', event.title);
        combinedQueue.push({
          id: event.id,
          type: 'event',
          title: event.title,
          content: {
            description: event.description,
            date: event.date,
            time: event.start_time,
            location: event.location || 'TBD'
          },
          submittedBy: event.source === 'manual' ? 'Chrome Extension' : event.organizer || 'Unknown',
          submittedAt: new Date(event.created_at),
          status: 'pending',
          flags: event.tags?.includes('community-submitted') ? ['community-submitted'] : [],
          priority: 'medium'
        });
      });
    }
    
    // Process articles (same as ModerationDashboard)
    if (articlesResult.data) {
      console.log('Processing articles:', articlesResult.data);
      articlesResult.data.forEach((article) => {
        console.log('Adding article to queue:', article.title);
        combinedQueue.push({
          id: article.id,
          type: 'newsroom_article',
          title: article.title,
          content: { excerpt: article.excerpt || article.content },
          submittedBy: article.source_url ? 'Chrome Extension' : 'Unknown',
          submittedAt: new Date(article.created_at),
          status: 'pending',
          flags: ['community-submitted'],
          priority: 'medium'
        });
      });
    }
    
    console.log('\n✅ FINAL COMBINED QUEUE:');
    console.log(`Total items: ${combinedQueue.length}`);
    combinedQueue.forEach((item, i) => {
      console.log(`  ${i+1}. ${item.type}: "${item.title}" (${item.submittedBy})`);
    });
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testModerationFetch();