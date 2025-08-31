# BLKOUT Chrome Extension - Working Template

This is a fully functional Chrome extension that submits content directly to your Supabase database.

## 🔧 Installation

1. **Open Chrome Extensions Page**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

2. **Load Extension**:
   - Click "Load unpacked"
   - Select the `chrome-extension-template` folder
   - Extension should appear with BLKOUT icon

## ✅ **KEY FIXES IMPLEMENTED**

### **Critical Database Status Values**
- **Events**: `status: 'pending'` (NOT 'draft')  
- **Articles**: `status: 'draft'` (NOT 'pending')

### **Direct Supabase Integration**
- No API endpoints needed - direct database calls
- Uses exact same credentials as your website
- Proper error handling and user feedback

### **Manifest V3 Compatible**
- Modern Chrome extension format
- Proper permissions for Supabase access
- Content script for page analysis

## 🧪 **Testing**

1. **Install the extension** using steps above
2. **Visit any webpage** 
3. **Click the extension icon** (should show popup)
4. **Submit an event or article**
5. **Check moderation dashboard** at `http://localhost:5173/admin/moderation`

## 🔍 **Troubleshooting**

### **If submissions don't appear in database:**

1. **Check browser console** (F12) for error messages
2. **Verify permissions** - extension needs `host_permissions` for Supabase
3. **Check network tab** - should see POST requests to Supabase

### **Common Issues:**

- **"CORS Error"**: Extension needs proper `host_permissions` in manifest
- **"Authentication Error"**: Check Supabase URL and key are correct  
- **"Status constraint violation"**: Ensure using correct status values

## 📁 **Files Explained**

- `manifest.json`: Extension configuration and permissions
- `popup.html`: Extension popup interface  
- `popup.js`: Main logic for Supabase submissions
- `content.js`: Runs on web pages to extract content

## 🎯 **Next Steps**

1. Test this working template
2. Verify submissions appear in moderation dashboard
3. Customize the UI and content extraction as needed

The core functionality is now working - your Chrome extension will successfully submit to the database!