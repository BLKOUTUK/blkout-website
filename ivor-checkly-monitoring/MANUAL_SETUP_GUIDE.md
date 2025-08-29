# 🚀 IVOR Monitoring - Manual Setup Guide (2 minutes)

Since the CLI has complex project requirements, let's create your checks directly in the web interface:

## ✅ **Step 1: Access Checkly Dashboard**
You're already logged in! Go to: https://app.checklyhq.com/checks

## 📊 **Step 2: Create 3 IVOR Monitoring Checks**

### **Check 1: IVOR API Gateway Health**
1. Click **"Create Check"** → **"API Check"**
2. Fill in:
   - **Name**: `IVOR API Gateway Health`
   - **URL**: `https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/health`
   - **Method**: `GET`
   - **Frequency**: `5 minutes`
   - **Location**: `EU West 1`
   - **Tags**: `ivor, health, api`
3. Click **"Save & Run"**

### **Check 2: IVOR Dashboard Health**
1. Click **"Create Check"** → **"API Check"**  
2. Fill in:
   - **Name**: `IVOR Dashboard Health`
   - **URL**: `https://ivor-monitoring-service.vercel.app/`
   - **Method**: `GET`
   - **Frequency**: `5 minutes`
   - **Location**: `EU West 1`
   - **Tags**: `ivor, dashboard, health`
3. Click **"Save & Run"**

### **Check 3: IVOR Chat Response Quality**
1. Click **"Create Check"** → **"API Check"**
2. Fill in:
   - **Name**: `IVOR Chat Response Quality`
   - **URL**: `https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/api/chat`
   - **Method**: `POST`
   - **Headers**: `Content-Type: application/json`
   - **Body**: 
     ```json
     {
       "message": "Test monitoring - can you help with community organizing?",
       "context": {"pathway": "System Disruptor"}
     }
     ```
   - **Frequency**: `10 minutes`
   - **Location**: `EU West 1`
   - **Tags**: `ivor, chat, quality`
3. Click **"Save & Run"**

## ✅ **Step 3: Verify Setup**
After creating all 3 checks, you should see:
- ✅ **3 checks listed** in your dashboard
- ✅ **Green status indicators** (within 5-10 minutes)
- ✅ **Email alerts automatically configured**

## 🎯 **Result: Beta Launch Ready!**
Your IVOR platform will have:
- **Comprehensive monitoring** - API Gateway + Dashboard + Chat Quality
- **5-10 minute frequency** - Continuous oversight
- **Immediate email alerts** - On any failures
- **EU West monitoring** - Reliable location coverage

**Total setup time: 2-3 minutes | Your IVOR monitoring will be production-ready!** 🚀

---
*Alternative: If you prefer automated setup, I can provide curl commands to create these via API*