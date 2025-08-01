// Debug script to check events page setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Events Page Setup...\n');

// Check if events component exists
const eventsComponentPath = './src/components/events/EventsPageIntegrated.tsx';
if (fs.existsSync(eventsComponentPath)) {
    console.log('✅ EventsPageIntegrated.tsx exists');
    
    // Check if it exports default
    const content = fs.readFileSync(eventsComponentPath, 'utf8');
    if (content.includes('export default EventsPageIntegrated')) {
        console.log('✅ Component has default export');
    } else {
        console.log('❌ Component missing default export');
    }
} else {
    console.log('❌ EventsPageIntegrated.tsx not found');
}

// Check if eventsService exists
const eventsServicePath = './src/services/eventsService.ts';
if (fs.existsSync(eventsServicePath)) {
    console.log('✅ eventsService.ts exists');
} else {
    console.log('❌ eventsService.ts not found');
}

// Check App.tsx route setup
const appPath = './src/App.tsx';
if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    if (appContent.includes('import EventsPageIntegrated')) {
        console.log('✅ EventsPageIntegrated imported in App.tsx');
    } else {
        console.log('❌ EventsPageIntegrated not imported in App.tsx');
    }
    
    if (appContent.includes('<Route path="/events" element={<EventsPageIntegrated />}')) {
        console.log('✅ Events route configured in App.tsx');
    } else {
        console.log('❌ Events route not found in App.tsx');
    }
} else {
    console.log('❌ App.tsx not found');
}

// Check navigation links
const navPath = './src/components/layout/PrimaryNavigationEnhanced.tsx';
if (fs.existsSync(navPath)) {
    const navContent = fs.readFileSync(navPath, 'utf8');
    
    if (navContent.includes("href: '/events'")) {
        console.log('✅ Events link in navigation');
    } else {
        console.log('❌ Events link missing from navigation');
    }
} else {
    console.log('❌ PrimaryNavigationEnhanced.tsx not found');
}

console.log('\n🔧 To test the events page:');
console.log('1. Run: npm run dev');
console.log('2. Navigate to: http://localhost:5173/events');
console.log('3. Or click "Events" in the navigation menu');

console.log('\n📋 Current project structure:');
if (fs.existsSync('./src/components/events')) {
    console.log('Events directory contents:');
    fs.readdirSync('./src/components/events').forEach(file => {
        console.log(`  - ${file}`);
    });
} else {
    console.log('❌ Events directory not found');
}