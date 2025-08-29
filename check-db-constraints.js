import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bgjengudzfickgomjqmz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0'
);

async function checkConstraints() {
  console.log('🔍 Testing different status values for events table...\n');

  const testStatuses = ['draft', 'pending', 'published', 'approved', 'rejected'];

  for (const status of testStatuses) {
    try {
      console.log(`Testing status: "${status}"`);
      
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: `Status Test: ${status}`,
          description: `Testing status value: ${status}`,
          date: '2025-04-15',
          start_time: '19:00:00',
          location: 'Test Location',
          cost: 'Free',
          registration_required: false,
          status: status,
          source: 'constraint-test',
          tags: ['test'],
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.log(`❌ Status "${status}" failed: ${error.message}`);
      } else {
        console.log(`✅ Status "${status}" worked! ID: ${data[0].id}`);
      }
    } catch (error) {
      console.log(`💥 Status "${status}" error: ${error.message}`);
    }
  }

  console.log('\n🔍 Testing different status values for newsroom_articles table...\n');

  for (const status of testStatuses) {
    try {
      console.log(`Testing status: "${status}"`);
      
      const { data, error } = await supabase
        .from('newsroom_articles')
        .insert([{
          title: `Status Test: ${status}`,
          excerpt: `Testing status value: ${status}`,
          content: `Testing status value: ${status}`,
          status: status,
          community_funded: false,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.log(`❌ Status "${status}" failed: ${error.message}`);
      } else {
        console.log(`✅ Status "${status}" worked! ID: ${data[0].id}`);
      }
    } catch (error) {
      console.log(`💥 Status "${status}" error: ${error.message}`);
    }
  }
}

checkConstraints();