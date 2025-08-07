# Chrome Extension Debug Instructions

## 🔍 Quick Content Detection Test

### Step 1: Open Extension Developer Tools
1. Go to any news website (Guardian, BBC, etc.)
2. Click the BLKOUT extension icon  
3. **Right-click the popup** → "Inspect"
4. Check the **Console tab** for error messages

### Step 2: Look for These Common Issues

#### ❌ **Permission Error**
```
Cannot access contents of url "https://..."
Manifest V3 injection error
```
**Fix**: Extension needs to be reloaded after manifest.json changes

#### ❌ **Script Injection Error**  
```
Error scanning page: [error details]
chrome.scripting is not available
```  
**Fix**: Missing 'scripting' permission or wrong Chrome version

#### ❌ **Content Detection Error**
```
No content detected on this page
detectPageContent returned null
```
**Fix**: Selectors might be outdated for news sites

### Step 3: Manual Debug Test
1. **Open**: `/extension-debug-test.html` 
2. **Load as extension** (if needed)
3. **Run each test** to identify the failure point

### Step 4: Quick Fix Verification

Try this on **Guardian article**:
1. Open browser DevTools (F12)
2. Run in Console:
```javascript
// Test if Guardian selectors work
console.log('Headline:', document.querySelector('h1[data-gu-name="headline"]')?.textContent);
console.log('Standfirst:', document.querySelector('[data-gu-name="standfirst"]')?.textContent);
console.log('Body:', document.querySelector('[data-gu-name="body"]')?.textContent?.length);
```

### Step 5: Extension Status Check
1. Go to `chrome://extensions/`
2. Find BLKOUT extension
3. Check:
   - ✅ **Enabled**
   - ✅ **"Allow access to file URLs"** (if needed)
   - ✅ **No error messages**
4. Click **"Reload"** button if manifest was updated

## 🚨 Most Likely Issues

### 1. **Extension Not Updated**
- Using old version without `scripting` permission
- **Solution**: Reload extension with latest version

### 2. **Website Changes**  
- News sites changed their HTML selectors
- **Solution**: Update detection logic in popup.js

### 3. **Content Security Policy**
- Some sites block extension scripts
- **Solution**: Add more host permissions

## 🔧 Quick Fixes to Try

### Fix 1: Reload Extension
```bash
# 1. Go to chrome://extensions/
# 2. Find BLKOUT extension  
# 3. Click "Reload" button
# 4. Test on Guardian article
```

### Fix 2: Test on Different Sites
- **Guardian**: https://www.theguardian.com/world
- **BBC**: https://www.bbc.co.uk/news  
- **Independent**: https://www.independent.co.uk

### Fix 3: Check Browser Console
Open extension popup → Right-click → Inspect → Console

Look for:
- ✅ `"🚀 BlkoutPopup - Initializing..."`
- ✅ `"✅ Content detected: {...}"`
- ❌ `"❌ No content detected"`  
- ❌ `"💥 Error scanning page: ..."`

## 📞 What to Report Back

Please test and report:
1. **Does extension popup open?** (Yes/No)
2. **Any console errors?** (Copy exact message)  
3. **Which website tested?** (Full URL)
4. **Extension shows:** ("🔍 No content detected" or other message)

This will help pinpoint the exact issue! 🎯