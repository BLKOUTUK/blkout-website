import { createClient } from '@supabase/supabase-js';

// Using the same credentials from your .env file
const supabase = createClient(
  'https://bgjengudzfickgomjqmz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
);

async function debugSupabaseData() {
  console.log('🔍 Checking all data in Supabase tables...\n');
  
  try {
    // Check all events
    const { data: allEvents, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError);
    } else {
      console.log(`📅 EVENTS TABLE (${allEvents.length} total):`);
      allEvents.forEach((event, i) => {
        console.log(`  ${i+1}. ${event.title} (Status: ${event.status}) - Created: ${event.created_at}`);
      });
      console.log('');
    }
    
    // Check all articles
    const { data: allArticles, error: articlesError } = await supabase
      .from('newsroom_articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (articlesError) {
      console.error('❌ Error fetching articles:', articlesError);
    } else {
      console.log(`📰 NEWSROOM_ARTICLES TABLE (${allArticles.length} total):`);
      allArticles.forEach((article, i) => {
        console.log(`  ${i+1}. ${article.title} (Status: ${article.status}) - Created: ${article.created_at}`);
      });
      console.log('');
    }
    
    // Now check specifically what should show in moderation (draft/pending)
    const { data: moderationEvents } = await supabase
      .from('events')
      .select('*')
      .in('status', ['draft', 'pending'])
      .order('created_at', { ascending: false });
    
    const { data: moderationArticles } = await supabase
      .from('newsroom_articles')
      .select('*')
      .in('status', ['draft', 'pending'])
      .order('created_at', { ascending: false });
    
    console.log(`🔍 MODERATION QUEUE DATA:`);
    console.log(`  Events for moderation: ${moderationEvents?.length || 0}`);
    console.log(`  Articles for moderation: ${moderationArticles?.length || 0}`);
    
    if (moderationEvents?.length) {
      console.log('\n📅 Events awaiting moderation:');
      moderationEvents.forEach((event, i) => {
        console.log(`  ${i+1}. "${event.title}" - Status: ${event.status}`);
      });
    }
    
    if (moderationArticles?.length) {
      console.log('\n📰 Articles awaiting moderation:');
      moderationArticles.forEach((article, i) => {
        console.log(`  ${i+1}. "${article.title}" - Status: ${article.status}`);
      });
    }
    
    if (!moderationEvents?.length && !moderationArticles?.length) {
      console.log('❌ NO ITEMS IN MODERATION QUEUE');
      console.log('This means either:');
      console.log('1. Chrome extension submissions are failing');
      console.log('2. Submissions are being stored as "published" instead of "draft"/"pending"');
      console.log('3. RLS policies are preventing data access');
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

debugSupabaseData();