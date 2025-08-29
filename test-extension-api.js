// Test Chrome Extension API submissions directly
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bgjengudzfickgomjqmz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEventSubmission() {
  try {
    console.log('Testing event submission...');
    
    const { data: event, error } = await supabase
      .from('events')
      .insert([{
        title: 'Test Chrome Extension Event',
        description: 'Testing event submission via extension API',
        location: 'Test Location',
        status: 'pending',
        date: '2025-03-20',
        start_time: '18:00',
        source: 'manual',
        tags: ['test', 'extension', 'moderation']
      }])
      .select()
      .single();

    if (error) {
      console.error('Event submission error:', error);
      return false;
    }

    console.log('Event submitted successfully:', event);
    return true;
  } catch (err) {
    console.error('Exception:', err);
    return false;
  }
}

async function testArticleSubmission() {
  try {
    console.log('Testing article submission...');
    
    const { data: article, error } = await supabase
      .from('newsroom_articles')
      .insert([{
        title: 'Test Chrome Extension Article',
        excerpt: 'Testing article submission via extension API',
        content: 'This is test content submitted through the Chrome extension API to verify the moderation queue functionality.',
        status: 'draft'
      }])
      .select()
      .single();

    if (error) {
      console.error('Article submission error:', error);
      return false;
    }

    console.log('Article submitted successfully:', article);
    return true;
  } catch (err) {
    console.error('Exception:', err);
    return false;
  }
}

async function main() {
  console.log('Testing Chrome Extension API submissions...');
  
  const eventSuccess = await testEventSubmission();
  const articleSuccess = await testArticleSubmission();
  
  if (eventSuccess && articleSuccess) {
    console.log('\n✅ Both submissions successful! Check moderation queue.');
  } else {
    console.log('\n❌ Some submissions failed. Check RLS policies.');
  }
}

main().catch(console.error);