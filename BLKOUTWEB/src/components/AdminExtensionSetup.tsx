// Chrome Extension Setup Instructions for Moderators and Admins
// File: src/components/AdminExtensionSetup.tsx

import React, { useState } from 'react';

const AdminExtensionSetup: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          BLKOUT Chrome Extension for Moderators
        </h1>
        <p className="text-lg text-gray-600">
          The BLKOUT Chrome Extension allows moderators and community members to quickly 
          submit content from any website directly to our moderation queue.
        </p>
      </div>

      {/* Download Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          📦 Download Extension
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Current Version: v1.0.1</h3>
            <p className="text-sm text-gray-600 mb-4">
              Production-ready extension with database connectivity to BLKOUTNXT platform.
            </p>
            
            <div className="flex space-x-4">
              <a
                href="/blkout-extension-v1.0.1.zip"
                download="blkout-extension-v1.0.1.zip"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                📥 Download Extension (.zip)
              </a>
              
              <button
                onClick={() => copyToClipboard(
                  'https://blkoutnxt.vercel.app/blkout-extension-v1.0.1.zip',
                  'download-link'
                )}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copiedText === 'download-link' ? '✅ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-green-900 mb-4">
          🛠️ Installation Instructions
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Step 1: Download & Extract</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Download the blkout-extension-v1.0.1.zip file above</li>
              <li>Extract the ZIP file to a folder on your computer</li>
              <li>Remember the location - you'll need it in Step 3</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Step 2: Enable Developer Mode</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Open Google Chrome</li>
              <li>Go to <code className="bg-gray-100 px-2 py-1 rounded">chrome://extensions/</code></li>
              <li>Turn on "Developer mode" (toggle in top-right corner)</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Step 3: Load Extension</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Click "Load unpacked" button</li>
              <li>Select the extracted blkout-extension-production folder</li>
              <li>The extension should now appear in your extensions list</li>
              <li>Pin the extension to your toolbar for easy access</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Step 4: Test Installation</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Visit any webpage with content</li>
              <li>Right-click on selected text or page</li>
              <li>Look for "Submit to BLKOUT" in context menu</li>
              <li>Click to test the submission form</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-purple-900 mb-4">
          🎯 How to Use the Extension
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Quick Content Submission</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li><strong>Right-click method:</strong> Select text → Right-click → "Submit to BLKOUT"</li>
              <li><strong>Page submission:</strong> Right-click anywhere → "Submit to BLKOUT"</li>
              <li><strong>Link submission:</strong> Right-click on links → "Submit to BLKOUT"</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Content Types</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li><strong>Events:</strong> Community events, protests, gatherings, workshops</li>
              <li><strong>Articles:</strong> News articles, community stories, important updates</li>
              <li>All submissions go to the moderation queue for review</li>
              <li>Submissions include source URL and timestamp for verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Database Connectivity Status */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-yellow-900 mb-4">
          🔗 Database Connectivity
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Production Ready ✅</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li><strong>Database:</strong> Connected to Supabase (bgjengudzfickgomjqmz.supabase.co)</li>
              <li><strong>API Endpoints:</strong> https://blkoutnxt.vercel.app/api/</li>
              <li><strong>Tables:</strong> events, newsroom_articles, moderation queue</li>
              <li><strong>IVOR Integration:</strong> Automatic notifications to AI assistant</li>
              <li><strong>Federated Services:</strong> Events Calendar sync available</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Moderation Flow</h3>
            <div className="text-sm text-gray-700">
              <p className="mb-2"><strong>Submission → Pending Status → Moderator Review → Approved/Rejected → Published</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>All submissions start with "pending" status</li>
                <li>Moderators can approve, reject, or edit submissions</li>
                <li>Approved content is automatically published</li>
                <li>Rejected content includes moderator reason</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Support Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          🆘 Support & Updates
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Technical Support</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Extension issues: Check browser console for errors</li>
              <li>Submission failures: Verify internet connection</li>
              <li>Database errors: Contact admin team</li>
              <li>Feature requests: Submit via extension or website</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Updates & Changelog</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li><strong>v1.0.1:</strong> Full database connectivity</li>
              <li><strong>v1.0.1:</strong> IVOR AI integration</li>
              <li><strong>v1.0.1:</strong> Production deployment ready</li>
              <li>Check this page for future updates</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🛡️ Community Liberation Technology:</strong> This extension is part of the BLKOUTNXT 
            federated independence architecture, ensuring community data sovereignty and democratic 
            governance of platform technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminExtensionSetup;