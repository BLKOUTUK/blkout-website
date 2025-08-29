// BLKOUT Chrome Extension - Popup Script
// Direct Supabase integration for content submissions

// Supabase configuration - EXACT same as your website
const SUPABASE_URL = 'https://bgjengudzfickgomjqmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnamVuZ3VkemZpY2tnb21qcW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTI3NjcsImV4cCI6MjA3MTE4ODc2N30.kYQ2oFuQBGmu4V_dnj_1zDMDVsd-qpDZJwNvswzO6M0';

// Simple fetch-based Supabase client (no external dependencies)
class SimpleSupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'apikey': key
        };
    }

    async insert(table, data) {
        try {
            console.log(`🚀 Inserting into ${table}:`, data);
            
            const response = await fetch(`${this.url}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Supabase error (${response.status}):`, errorText);
                throw new Error(`Database error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Supabase success:', result);
            return { data: result, error: null };
        } catch (error) {
            console.error('💥 Insert failed:', error);
            return { data: null, error: error };
        }
    }
}

// Initialize Supabase client
const supabase = new SimpleSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
let activeTab = 'event';
let extractedContent = null;

// Extract content from current page
async function extractPageContent() {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const results = await chrome.tabs.sendMessage(tab.id, {action: 'extractContent'});
        extractedContent = results;
        return results;
    } catch (error) {
        console.log('⚠️ Content extraction failed:', error);
        return null;
    }
}

// Auto-populate form fields with extracted content
function populateFields(content) {
    if (!content) return;
    
    // Auto-fill current page info
    if (content.title && !document.getElementById('eventTitle').value) {
        document.getElementById('eventTitle').value = content.title;
        document.getElementById('articleTitle').value = content.title;
    }
    
    // Auto-fill article content
    if (content.content && !document.getElementById('articleContent').value) {
        document.getElementById('articleContent').value = content.content;
        document.getElementById('articleExcerpt').value = content.content.substring(0, 200) + '...';
    }
    
    // Auto-fill event description if it looks like an event
    if (content.eventInfo?.hasEventKeywords && !document.getElementById('eventDescription').value) {
        document.getElementById('eventDescription').value = content.content.substring(0, 300);
        
        // Try to populate event date/time
        if (content.eventInfo.date) {
            const eventDate = new Date(content.eventInfo.date);
            if (!isNaN(eventDate)) {
                document.getElementById('eventDate').value = eventDate.toISOString().split('T')[0];
            }
        }
        if (content.eventInfo.time) {
            // Convert to 24-hour format
            let time = content.eventInfo.time.toLowerCase().replace(/\s+/g, '');
            if (time.includes('pm') && !time.includes('12:')) {
                const hour = parseInt(time.split(':')[0]) + 12;
                time = time.replace(/\d{1,2}:/, hour + ':').replace(/pm/i, '');
            }
            time = time.replace(/am|pm/i, '');
            document.getElementById('eventTime').value = time;
        }
    }
}

// Tab switching
document.addEventListener('DOMContentLoaded', async () => {
    // Extract content from current page
    const content = await extractPageContent();
    if (content) {
        console.log('📄 Extracted content:', content);
        populateFields(content);
    }
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            activeTab = tabName;
        });
    });

    // Auto-fill current page URL and title
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const url = currentTab.url;
        const title = currentTab.title;

        // Pre-fill forms with current page info
        document.getElementById('eventTitle').value = title;
        document.getElementById('articleTitle').value = title;
        
        // Store current URL for reference
        window.currentPageUrl = url;
    });

    // Form submissions
    document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
    document.getElementById('articleForm').addEventListener('submit', handleArticleSubmit);
});

function showMessage(text, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="${isError ? 'error' : 'success'}">${text}</div>`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitEvent');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const eventData = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value || '',
            date: document.getElementById('eventDate').value,
            start_time: document.getElementById('eventTime').value + ':00',
            location: document.getElementById('eventLocation').value || 'TBD',
            cost: 'Free',
            registration_required: false,
            status: 'pending', // ← CRITICAL: Events must be 'pending'
            source: 'chrome-extension',
            tags: ['community-submitted', 'extension'],
            url: window.currentPageUrl || null,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase.insert('events', eventData);

        if (error) {
            throw error;
        }

        showMessage(`✅ Event "${eventData.title}" submitted successfully! It will appear in the moderation queue.`);
        
        // Reset form
        document.getElementById('eventForm').reset();
        
    } catch (error) {
        console.error('Event submission failed:', error);
        showMessage(`❌ Failed to submit event: ${error.message}`, true);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Event';
    }
}

async function handleArticleSubmit(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitArticle');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const articleData = {
            title: document.getElementById('articleTitle').value,
            excerpt: document.getElementById('articleExcerpt').value || '',
            content: document.getElementById('articleContent').value || '',
            status: 'draft', // ← CRITICAL: Articles must be 'draft'
            source_url: window.currentPageUrl || null,
            community_funded: false,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase.insert('newsroom_articles', articleData);

        if (error) {
            throw error;
        }

        showMessage(`✅ Article "${articleData.title}" submitted successfully! It will appear in the moderation queue.`);
        
        // Reset form
        document.getElementById('articleForm').reset();
        
    } catch (error) {
        console.error('Article submission failed:', error);
        showMessage(`❌ Failed to submit article: ${error.message}`, true);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Article';
    }
}