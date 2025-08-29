# IVOR Checkly Monitoring Setup

## Quick Setup (5 minutes)

### 1. Create Checkly Account
```bash
# Go to https://app.checklyhq.com/signup
# Free tier: 10,000 check runs/month, 5 checks
```

### 2. Install Checkly CLI
```bash
npm install -g checkly
checkly login
```

### 3. Initialize Checkly Project
```bash
checkly init --project-name="IVOR-Monitoring"
```

### 4. Configure Environment Variables
In Checkly dashboard, set:
```
CHECKLY_TELEGRAM_WEBHOOK=your_telegram_bot_webhook_url
```

### 5. Deploy IVOR Monitoring
```bash
# Upload our monitoring script
cp checkly-ivor-monitor.js checks/ivor-orchestration.spec.js

# Configure check frequency
checkly deploy
```

### 6. Set Up Telegram Bot (If Needed)

**Option A: Use Existing BLKOUTNXT Bot**
- Use your existing webhook URL

**Option B: Create New Bot**
```bash
# 1. Message @BotFather on Telegram
# 2. Create new bot: /newbot
# 3. Get webhook URL: https://api.telegram.org/bot<TOKEN>/setWebhook
```

## Monitoring Configuration

### Check Schedule
- **Frequency**: Every 5 minutes
- **Locations**: London, Frankfurt (for EU latency)
- **Timeout**: 10 seconds per test

### Alert Thresholds
- **Immediate Alert**: Any test failure
- **Warning Alert**: Response time > 3 seconds
- **Critical Alert**: 2+ consecutive failures

### Monitored Scenarios

1. **System Disruptor Pathway**
   - Tests organizing service orchestration
   - Verifies pathway-aware responses
   - Checks community-focused language

2. **Community Healer Pathway**
   - Tests healing/support service routing
   - Verifies trauma-informed responses
   - Checks cultural sensitivity

3. **Multi-Service Knowledge Query**
   - Tests service coordination
   - Verifies response depth
   - Checks orchestration quality

4. **Performance Monitoring**
   - Response times < 5 seconds
   - Service availability
   - Dashboard accessibility

## Emergency Procedures

### If Cascade Failure Detected
1. Check https://ivor-monitoring-service.vercel.app/
2. Identify which specific service is failing
3. Test individual services:
   ```bash
   curl https://ivor-core-gj4mxzljt-robs-projects-54d653d3.vercel.app/api/health
   curl https://ivor-community-47273u41f-robs-projects-54d653d3.vercel.app/api/health
   ```

### Manual Testing
```bash
# Test locally
node ivor-cascade-monitor.cjs

# Test with Playwright
npx playwright test checkly-ivor-monitor.js
```

## Integration with Existing Monitoring

This **augments** your existing IVOR monitoring service at https://ivor-monitoring-service.vercel.app/ by:

- **Service-level monitoring** → Your dashboard shows individual service health
- **Orchestration monitoring** → Checkly tests end-to-end response quality
- **User experience monitoring** → Detects when responses degrade despite healthy services

## Expected Results

✅ **Day 1**: Checkly monitoring operational  
✅ **Day 2**: Telegram alerts working  
✅ **Day 3**: Baseline response quality metrics established  

**Success Metric**: Zero premature fallbacks detected during beta launch