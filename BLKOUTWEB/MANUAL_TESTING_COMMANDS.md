# 🧪 Manual Testing Commands - BLKOUT Moderation API

## 🚀 **TESTING ENVIRONMENT READY**

**Local API Server**: `http://localhost:3001` ✅ ACTIVE  
**Database**: Live Supabase connection ✅ CONNECTED  
**Test Data**: Real community events available ✅ READY  

---

## 📋 **AVAILABLE TEST CONTENT**

```
Real Event IDs from Database:
1. 0159d1ad-697d-4882-b764-6d83fad806c3 (The Creole Kiki Ball)
2. 74ba656d-37f5-4728-a9e5-b06f4a26638b (Black Queer Healing Event)  
3. 0d56a17d-a981-46b9-ab04-d36a9beb0fef (HARDFOOD X QDP: Gully Queens)
```

---

## ⚡ **QUICK TEST COMMANDS** (Copy & Paste Ready)

### **✅ Test Approval Workflow**
```bash
curl -X POST http://localhost:3001/api/moderate-content \
  -H "Content-Type: application/json" \
  -d '{"action": "approve", "contentId": "0159d1ad-697d-4882-b764-6d83fad806c3", "moderatorId": "manual-test-123"}'
```

### **❌ Test Rejection Workflow**
```bash
curl -X POST http://localhost:3001/api/moderate-content \
  -H "Content-Type: application/json" \
  -d '{"action": "reject", "contentId": "74ba656d-37f5-4728-a9e5-b06f4a26638b", "moderatorId": "manual-test-123", "reason": "Manual testing - community review needed"}'
```

### **🔧 Test Edit Workflow**
```bash
curl -X POST http://localhost:3001/api/moderate-content \
  -H "Content-Type: application/json" \
  -d '{"action": "edit", "contentId": "0d56a17d-a981-46b9-ab04-d36a9beb0fef", "moderatorId": "manual-test-123", "edits": {"priority": "high", "status": "review"}}'
```

---

## 🔍 **SERVER STATUS CHECK**

### **Basic Server Health**
```bash
curl http://localhost:3001
```

### **API Endpoint Status**
```bash
curl -X OPTIONS http://localhost:3001/api/moderate-content
```

---

## 🧪 **ERROR HANDLING TESTS**

### **Test Missing Fields**
```bash
curl -X POST http://localhost:3001/api/moderate-content \
  -H "Content-Type: application/json" \
  -d '{"action": "approve"}'
```
*Expected: Error response about missing required fields*

### **Test Invalid Action**
```bash
curl -X POST http://localhost:3001/api/moderate-content \
  -H "Content-Type: application/json" \
  -d '{"action": "invalid", "contentId": "0159d1ad-697d-4882-b764-6d83fad806c3", "moderatorId": "test"}'
```
*Expected: Error response about invalid action*

### **Test Invalid Content ID**
```bash
curl -X POST http://localhost:3001/api/moderate-content \
  -H "Content-Type: application/json" \
  -d '{"action": "approve", "contentId": "invalid-id", "moderatorId": "test"}'
```
*Expected: Error response about content not found*

---

## 📊 **EXPECTED RESPONSES**

### **✅ Successful Approval**
```json
{
  "success": true,
  "message": "Content approved and published successfully",
  "data": {
    "published": {...},
    "contentId": "0159d1ad-697d-4882-b764-6d83fad806c3",
    "action": "approved",
    "timestamp": "2025-01-10T12:00:00.000Z"
  }
}
```

### **❌ Successful Rejection**
```json
{
  "success": true,
  "message": "Content rejected successfully", 
  "data": {
    "contentId": "74ba656d-37f5-4728-a9e5-b06f4a26638b",
    "action": "rejected",
    "reason": "Manual testing - community review needed",
    "moderatorId": "manual-test-123",
    "timestamp": "2025-01-10T12:00:00.000Z"
  }
}
```

### **🔧 Successful Edit**
```json
{
  "success": true,
  "message": "Content edited successfully",
  "data": {
    "updated": {...},
    "contentId": "0d56a17d-a981-46b9-ab04-d36a9beb0fef", 
    "action": "edited",
    "edits": {"priority": "high", "status": "review"},
    "moderatorId": "manual-test-123",
    "timestamp": "2025-01-10T12:00:00.000Z"
  }
}
```

---

## 🎯 **MANUAL TESTING CHECKLIST**

### **Core Functionality** ✅
- [ ] Server responds to basic health check
- [ ] Approval workflow completes successfully
- [ ] Rejection workflow completes successfully  
- [ ] Edit workflow completes successfully
- [ ] Database updates reflect moderation actions
- [ ] Audit logging captures all actions

### **Error Handling** ✅
- [ ] Missing required fields handled properly
- [ ] Invalid actions rejected appropriately
- [ ] Invalid content IDs handled gracefully
- [ ] Error responses are helpful and clear

### **Performance** ✅
- [ ] API responses under 500ms
- [ ] No memory leaks during testing
- [ ] Server handles multiple concurrent requests
- [ ] Database connections managed properly

---

## 🚨 **TROUBLESHOOTING**

### **If Server Not Responding:**
1. Check if background process is still running
2. Restart server: `node -e "console.log('Restarting...'); [server code]"`
3. Check port 3001 availability: `netstat -an | grep 3001`

### **If Database Errors:**
1. Verify Supabase connection in environment
2. Check content IDs exist in database
3. Confirm schema is properly applied

### **If CORS Issues:**
1. Verify headers in server configuration
2. Check browser developer tools for errors
3. Test with curl commands first

---

**⚡ The local server is running independently of the SPARC migration process, so you can test freely while the repository migration happens in parallel!** 

---

*Manual Testing Guide v1.0 | BLKOUT Community Platform | Democratic Testing Process*  
*Test with ❤️ for community liberation technology*