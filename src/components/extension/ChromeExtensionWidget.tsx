import React, { useState } from 'react';
import { Download, Chrome, CheckCircle, AlertCircle, ExternalLink, FileText } from 'lucide-react';

interface ChromeExtensionWidgetProps {
  className?: string;
}

const ChromeExtensionWidget: React.FC<ChromeExtensionWidgetProps> = ({ className }) => {
  const [downloadStep, setDownloadStep] = useState<'download' | 'installing' | 'complete'>('download');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDownload = () => {
    setDownloadStep('installing');
    // Trigger download of the extension package
    const link = document.createElement('a');
    link.href = '/chrome-extension.zip';
    link.download = 'blkout-chrome-extension-v1.1.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show completion after a brief delay
    setTimeout(() => setDownloadStep('complete'), 2000);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-black/5 rounded-lg flex items-center justify-center">
              <img 
                src="/images/squared/IvorChrome_XT.png" 
                alt="IVOR Chrome Extension"
                className="h-8 w-8 object-contain rounded"
                onError={(e) => {
                  // Fallback to Chrome icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parentDiv = target.parentNode as HTMLElement;
                  parentDiv.innerHTML = '<svg class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C18.627 0 24 5.373 24 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm4.326 19.613a10.5 10.5 0 0 0 6.061-7.613H14.5a6.5 6.5 0 0 1-10.76 4.613 9 9 0 0 0 12.586 3z"/></svg>';
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                IVOR Chrome Extension
              </h3>
              <p className="text-sm text-gray-600">
                Powered by BLKOUT + IVOR AI • Enhanced detection & moderation
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            v1.1 Fixed
          </span>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Auto-Detection Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ✅ Direct Supabase database integration</li>
              <li>• ✅ Fixed status values (events=pending, articles=draft)</li>
              <li>• ✅ Real moderation queue submissions</li>
              <li>• ✅ Auto-fill current page title and URL</li>
              <li>• ✅ Proper error handling and success messages</li>
            </ul>
          </div>

          {downloadStep === 'download' && (
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Extension
              </button>
              
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Installation Instructions
              </button>
            </div>
          )}

          {downloadStep === 'installing' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-md">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                Download started...
              </div>
            </div>
          )}

          {downloadStep === 'complete' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md">
                <CheckCircle className="h-4 w-4 mr-2" />
                Downloaded! Follow installation steps below
              </div>
            </div>
          )}

          {(showInstructions || downloadStep === 'complete') && (
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Installation Steps:</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Extract the downloaded file</p>
                    <p className="text-gray-600">Extract blkout-chrome-extension-v1.1.zip to a folder</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Open Chrome Extensions</p>
                    <p className="text-gray-600">Navigate to chrome://extensions/ or Menu → Extensions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Enable Developer Mode</p>
                    <p className="text-gray-600">Toggle "Developer mode" in the top-right corner</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Load Extension</p>
                    <p className="text-gray-600">Click "Load unpacked" and select the extracted folder</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                    ✓
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Ready to Use!</p>
                    <p className="text-gray-600">Visit news sites - AI will analyze and score content relevance</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    <strong>New in v1.1:</strong> Fixed database integration - submissions now appear correctly in moderation queue!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Supported platforms:</span>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">Chrome</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">Edge</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">Brave</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChromeExtensionWidget;