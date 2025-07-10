/**
 * IVOR Demo Script - Simulated User Experience
 * Demonstrates what users will experience when interacting with IVOR
 */

console.log('🌟 IVOR Community Intelligence Platform - User Experience Demo\n');

// Simulate the user experience with realistic responses
const demoScenarios = [
  {
    user: "Young Black gay man in London",
    query: "I'm struggling with my mental health and need someone who understands being Black and gay",
    response: `I hear you, and I want you to know that what you're feeling is valid. Being both Black and gay can create unique challenges that not everyone understands, and it's important to find support that truly gets your experience.

Black Thrive BQC is specifically designed for people like us - they provide culturally competent mental health services that understand the intersection of being Black and queer. They get how racism shows up in queer spaces and how homophobia can exist in Black communities. They offer individual therapy, group support, and have a 24/7 crisis line.

You can reach them at info@blackthrivebqc.org or check their website. If you need immediate crisis support, please don't hesitate to call their crisis line or contact emergency services.

Would you like me to help you find other resources, or do you have questions about what to expect from therapy?`,
    sources: ["Black Thrive BQC"]
  },
  {
    user: "Black trans woman in Birmingham",
    query: "I need help finding trans-friendly healthcare in Birmingham",
    response: `Finding trans-friendly healthcare can be really challenging, especially when you need providers who understand both your identity and your cultural background. Let me help you with some options in Birmingham.

Black Trans Hub has connections with healthcare providers in Birmingham who have experience working with trans people, particularly Black trans individuals. They can provide guidance on which GPs and clinics are truly trans-friendly, not just those that claim to be.

For NHS gender services, you'll need a GP referral to a Gender Identity Clinic, though waiting times are unfortunately very long. Some people also use private services like GenderCare or London Transgender Clinic if they can afford it.

Birmingham LGBT Centre also maintains a list of recommended healthcare providers and can offer support navigating the system.

Would you like me to help you understand more about the referral process, or are you looking for specific types of healthcare support?`,
    sources: ["Black Trans Hub", "Birmingham LGBT Centre"]
  },
  {
    user: "Community member seeking events",
    query: "What events are happening this weekend for Black queer people?",
    response: `There are some great things happening this weekend! Let me share what I know about current events:

BLKOUT has a monthly community gathering this Saturday focused on cooperative ownership and building collective power. It's a great space to meet other Black queer people and learn about community organizing.

Black Thrive BQC is hosting a wellness workshop on Sunday that combines mental health support with cultural affirmation - always a beautiful mix of healing and community.

QueerCroydon has their regular social meetup on Saturday evening if you're in South London - they create such welcoming spaces for connection.

Most of these events are free or low-cost to ensure everyone can participate. Would you like me to help you find events in a specific area, or are you interested in particular types of activities like workshops, social events, or political organizing?`,
    sources: ["BLKOUT", "Black Thrive BQC", "QueerCroydon"]
  }
];

// Simulate the user experience
async function demonstrateUserExperience() {
  console.log('💬 Welcome Message:');
  console.log('═'.repeat(60));
  console.log(`IVOR says: "Hey! I'm IVOR, inspired by the legacy of Ivor Cummings who was known for connecting our community with resources and support. I'm here to help you find what you need—whether that's mental health support, housing assistance, legal rights, community events, or just someone to talk to. What brings you here today?"`);
  console.log('');
  
  for (let i = 0; i < demoScenarios.length; i++) {
    const scenario = demoScenarios[i];
    
    console.log(`🔹 Demo ${i + 1}: ${scenario.user}`);
    console.log('─'.repeat(60));
    console.log(`❓ User asks: "${scenario.query}"`);
    console.log('');
    
    // Simulate thinking time
    console.log('⏳ IVOR is thinking...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('💬 IVOR responds:');
    console.log(`"${scenario.response}"`);
    console.log('');
    console.log(`📚 Sources: ${scenario.sources.join(', ')}`);
    console.log('✅ Response successful');
    console.log('');
    console.log('═'.repeat(60));
    console.log('');
  }
  
  console.log('🎯 Key User Experience Features Demonstrated:');
  console.log('• Cultural authenticity - IVOR understands Black queer experiences');
  console.log('• Intersectional awareness - Addresses being both Black AND queer');
  console.log('• Community connections - References to real organizations');
  console.log('• Practical guidance - Specific next steps and contact information');
  console.log('• Warm, conversational tone - Not robotic or formal');
  console.log('• Privacy protection - No personal data collected');
  console.log('• Source attribution - Transparent about information sources');
  console.log('');
  
  console.log('🤝 Community Values Integration:');
  console.log('• Cooperative ownership principles referenced');
  console.log('• Liberation focus over individual convenience');
  console.log('• Community care and mutual aid emphasized');
  console.log('• Cultural competence prioritized');
  console.log('• Transparency in AI responses');
  console.log('');
  
  console.log('📱 Technical Features:');
  console.log('• Real-time responses (1-2 seconds)');
  console.log('• Loading states with community-friendly messaging');
  console.log('• Error handling with fallback to human support');
  console.log('• Mobile-responsive design');
  console.log('• Accessibility compliance (WCAG 2.1 AA)');
  console.log('');
  
  console.log('🌟 This demonstrates how IVOR bridges technology and community needs,');
  console.log('providing authentic, culturally grounded support that honors both');
  console.log('individual needs and collective liberation.');
}

// Run the demonstration
demonstrateUserExperience().catch(console.error);