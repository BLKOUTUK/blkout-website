// BLKOUT Chrome Extension Download API
// Serves extension files directly, bypassing React router issues

const fs = require('fs').promises
const path = require('path')

// Extension file mappings
const EXTENSION_FILES = {
  'manifest.json': 'public/downloads/extension-files/manifest.json',
  'background.js': 'public/downloads/extension-files/background.js',
  'popup.html': 'public/downloads/extension-files/popup/popup.html',
  'popup.js': 'public/downloads/extension-files/popup/popup.js',
  'popup.css': 'public/downloads/extension-files/popup/popup.css',
  'detector.js': 'public/downloads/extension-files/content-scripts/detector.js',
  'form-injector.js': 'public/downloads/extension-files/content-scripts/form-injector.js',
  'icon16.png': 'public/downloads/extension-files/assets/icon16.png',
  'icon48.png': 'public/downloads/extension-files/assets/icon48.png',
  'icon128.png': 'public/downloads/extension-files/assets/icon128.png',
  'archive': 'public/downloads/blkout-extension-v1.0.1.tar.gz'
}

export default async function handler(req, res) {
  try {
    const { file } = req.query
    
    // If no file specified, return download page HTML
    if (!file) {
      return res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BLKOUT Chrome Extension Download</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e293b 100%); color: white; margin: 0; padding: 20px; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(255,255,255,0.2); }
        h1 { color: #60a5fa; text-align: center; font-size: 2.5rem; margin-bottom: 10px; }
        .download-btn { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; margin: 10px; }
        .file-link { display: block; color: #60a5fa; text-decoration: none; padding: 8px 0; }
        code { background: rgba(0,0,0,0.3); padding: 3px 6px; border-radius: 4px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔥 BLKOUT Chrome Extension</h1>
        <p style="text-align: center; opacity: 0.8; margin-bottom: 40px;">Submit content directly from news sites to BLKOUT moderation queue</p>

        <div style="background: rgba(0,0,0,0.2); border-radius: 15px; padding: 30px; margin-bottom: 30px;">
            <h2>📥 Download Options</h2>
            
            <h3>Complete Extension Archive (Recommended)</h3>
            <a href="/api/extension?file=archive" download="blkout-extension-v1.0.1.tar.gz" class="download-btn">
                📦 Download v1.0.1 (229KB)
            </a>
            
            <h3>Individual Extension Files</h3>
            <div style="background: rgba(0,0,0,0.1); border-radius: 10px; padding: 20px;">
                <a href="/api/extension?file=manifest.json" class="file-link">→ manifest.json</a>
                <a href="/api/extension?file=background.js" class="file-link">→ background.js</a>
                <a href="/api/extension?file=popup.html" class="file-link">→ popup/popup.html</a>
                <a href="/api/extension?file=popup.js" class="file-link">→ popup/popup.js</a>
                <a href="/api/extension?file=popup.css" class="file-link">→ popup/popup.css</a>
                <a href="/api/extension?file=detector.js" class="file-link">→ content-scripts/detector.js</a>
                <a href="/api/extension?file=form-injector.js" class="file-link">→ content-scripts/form-injector.js</a>
                <a href="/api/extension?file=icon16.png" class="file-link">→ assets/icon16.png</a>
                <a href="/api/extension?file=icon48.png" class="file-link">→ assets/icon48.png</a>
                <a href="/api/extension?file=icon128.png" class="file-link">→ assets/icon128.png</a>
            </div>
        </div>

        <div style="background: rgba(16, 185, 129, 0.2); border-left: 4px solid #10b981; padding: 20px; border-radius: 10px; margin: 30px 0;">
            <h2>🔧 Installation Steps</h2>
            <ol>
                <li>Download & extract the extension files</li>
                <li>Open Chrome → Navigate to <code>chrome://extensions/</code></li>
                <li>Enable "Developer mode" (toggle in top-right)</li>
                <li>Click "Load unpacked" button</li>
                <li>Select the extracted extension folder</li>
                <li>Pin the BLKOUT icon to your Chrome toolbar</li>
            </ol>
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 15px; padding: 25px; margin: 30px 0;">
            <h2>👥 For Community Curators</h2>
            <p><strong>Admin Password:</strong> <code>BLKOUT2025!</code></p>
            <p><strong>Moderation Dashboard:</strong> <a href="/admin/moderation" style="color: #10b981;">/admin/moderation</a></p>
            <p><strong>Newsroom Admin:</strong> <a href="/admin/newsroom" style="color: #10b981;">/admin/newsroom</a></p>
            
            <h3>✅ What's Working:</h3>
            <ul>
                <li>Real data persistence (no more mock data)</li>
                <li>Chrome Extension → Moderation Queue → Publishing pipeline</li>
                <li>Admin dashboards connected to live data</li>
                <li>Community submissions persist correctly</li>
            </ul>
        </div>

        <div style="text-align: center; margin-top: 40px; opacity: 0.7;">
            <p><strong>Version:</strong> 1.0.1 | <strong>Size:</strong> 229KB | <strong>Updated:</strong> August 2025</p>
            <p>🚨 <strong>WSL2/Windows Note:</strong> This API endpoint bypasses all routing restrictions</p>
        </div>
    </div>
</body>
</html>`)
    }
    
    // Check if requested file exists
    if (!EXTENSION_FILES[file]) {
      return res.status(404).json({ 
        error: 'File not found', 
        available: Object.keys(EXTENSION_FILES)
      })
    }
    
    const filePath = path.join(process.cwd(), EXTENSION_FILES[file])
    
    try {
      const fileContent = await fs.readFile(filePath)
      
      // Set appropriate content type
      let contentType = 'application/octet-stream'
      if (file.endsWith('.json')) contentType = 'application/json'
      else if (file.endsWith('.js')) contentType = 'application/javascript'
      else if (file.endsWith('.html')) contentType = 'text/html'
      else if (file.endsWith('.css')) contentType = 'text/css'
      else if (file.endsWith('.png')) contentType = 'image/png'
      else if (file.endsWith('.tar.gz')) contentType = 'application/gzip'
      
      res.setHeader('Content-Type', contentType)
      
      // Set download headers for archive
      if (file === 'archive') {
        res.setHeader('Content-Disposition', 'attachment; filename="blkout-extension-v1.0.1.tar.gz"')
      }
      
      return res.status(200).send(fileContent)
      
    } catch (error) {
      console.error('Error reading file:', error)
      return res.status(500).json({ 
        error: 'Failed to read file', 
        file: file,
        path: filePath 
      })
    }
    
  } catch (error) {
    console.error('Extension API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}