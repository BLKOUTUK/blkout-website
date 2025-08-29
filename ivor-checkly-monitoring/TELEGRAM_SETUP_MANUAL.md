# 📱 IVOR Telegram Alerts - Manual Setup

## 🚨 Quick Manual Setup (2 minutes)

Since the API authentication had an issue, here's the manual approach:

### Step 1: Create Webhook Alert Channel

1. Go to: https://app.checklyhq.com/alert-channels
2. Click **"Create Alert Channel"**
3. Select **"Webhook"**
4. Fill in:
   - **Name**: `BLKOUTNXT Telegram Alerts`
   - **Webhook URL**: Your Telegram bot webhook URL
   - **Method**: `POST`
   - **Headers**: `Content-Type: application/json`
   - **Template**:
   ```
   🚨 IVOR Alert: {{CHECK_NAME}} is {{CHECK_RESULT_STATUS}}
   📊 Response: {{RESPONSE_TIME}}ms
   🔗 {{CHECK_URL}}
   ```

### Step 2: Attach to IVOR Checks

1. Go to: https://app.checklyhq.com/checks
2. For each of your 3 IVOR checks:
   - Click the check name
   - Go to **"Alert Settings"**
   - Add your new **"BLKOUTNXT Telegram Alerts"** channel
   - Save

### Step 3: Test Alert

- Toggle one of your checks to force a failure
- You should receive a Telegram notification within 1-2 minutes

## ✅ Result

Once configured:
- 🚨 **Instant Telegram alerts** for all IVOR failures
- 📊 **Response time notifications** for performance issues
- 🔗 **Direct links** to check details
- 📱 **Mobile-friendly** alerts via BLKOUTNXT bot

## 🎯 Alternative: Email Alerts (Already Active)

Your email alerts are already working! You'll receive notifications at your registered Checkly email address.

---
**Total setup time: 2 minutes | Immediate IVOR failure notifications ready!**