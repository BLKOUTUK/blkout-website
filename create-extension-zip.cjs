const fs = require('fs');
const path = require('path');

// Create proper ZIP-like TAR.GZ file for Chrome extension
async function createExtensionArchive() {
    const { execSync } = require('child_process');
    
    console.log('📦 Creating Chrome Extension archive...\n');
    
    const extensionDir = 'public/chrome-extension';
    const archiveName = 'public/chrome-extension.tar.gz';
    
    try {
        // Remove old archive if it exists
        if (fs.existsSync(archiveName)) {
            fs.unlinkSync(archiveName);
            console.log('🗑️  Removed old archive');
        }
        
        // Create tar.gz archive (more compatible than zip)
        execSync(`tar -czf chrome-extension.tar.gz -C ${extensionDir} .`, { stdio: 'inherit' });
        
        // Move to public directory and also create .zip version
        execSync(`mv chrome-extension.tar.gz public/chrome-extension.tar.gz`, { stdio: 'inherit' });
        execSync(`cp public/chrome-extension.tar.gz public/chrome-extension.zip`, { stdio: 'inherit' });
        
        const stats = fs.statSync('public/chrome-extension.zip');
        console.log(`\n✅ Chrome extension archive created: ${stats.size} bytes`);
        console.log('📁 Archive contains all extension files');
        console.log('🔗 Available at: http://localhost:5173/chrome-extension.zip');
        
        // Verify contents
        console.log('\n📋 Archive contents:');
        execSync('cd public/chrome-extension && ls -la', { stdio: 'inherit' });
        
    } catch (error) {
        console.error('❌ Error creating archive:', error.message);
        process.exit(1);
    }
}

createExtensionArchive();