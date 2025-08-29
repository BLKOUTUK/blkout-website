#!/bin/bash

# IVOR Telegram Alert Configuration
echo "📱 IVOR Telegram Alert Setup"
echo "============================"

ACCOUNT_ID="69781a21-8d44-4a43-a99d-33d40c07991f"

if [ -z "$CHECKLY_API_KEY" ]; then
    echo ""
    echo "🔑 Enter your Checkly API key:"
    read -s CHECKLY_API_KEY
    export CHECKLY_API_KEY
fi

echo ""
echo "🤖 Enter your BLKOUTNXT Telegram bot webhook URL:"
echo "   (Format: https://api.telegram.org/botTOKEN/sendMessage?chat_id=CHATID&text=)"
read TELEGRAM_WEBHOOK

echo ""
echo "⏳ Creating Telegram webhook alert channel..."

# Create webhook alert channel
WEBHOOK_RESPONSE=$(curl -s -X POST https://api.checklyhq.com/v1/alert-channels \
  -H "X-Checkly-Account: $ACCOUNT_ID" \
  -H "Authorization: Bearer $CHECKLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"WEBHOOK\",
    \"name\": \"BLKOUTNXT Telegram Alerts\",
    \"config\": {
      \"url\": \"$TELEGRAM_WEBHOOK\",
      \"method\": \"POST\",
      \"headers\": {
        \"Content-Type\": \"application/json\"
      },
      \"template\": \"🚨 IVOR Alert: {{CHECK_NAME}} is {{CHECK_RESULT_STATUS}}\\n📊 Response: {{RESPONSE_TIME}}ms\\n🔗 {{CHECK_URL}}\"
    }
  }")

if echo "$WEBHOOK_RESPONSE" | grep -q '"id"'; then
    CHANNEL_ID=$(echo "$WEBHOOK_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "✅ Telegram alert channel created (ID: $CHANNEL_ID)"
    
    echo ""
    echo "⏳ Attaching alerts to IVOR monitoring checks..."
    
    # Get existing checks and attach webhook
    CHECKS=$(curl -s -H "X-Checkly-Account: $ACCOUNT_ID" \
                  -H "Authorization: Bearer $CHECKLY_API_KEY" \
                  https://api.checklyhq.com/v1/checks | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    
    for CHECK_ID in $CHECKS; do
        curl -s -X PUT "https://api.checklyhq.com/v1/checks/$CHECK_ID" \
          -H "X-Checkly-Account: $ACCOUNT_ID" \
          -H "Authorization: Bearer $CHECKLY_API_KEY" \
          -H "Content-Type: application/json" \
          -d "{\"alertChannelSubscriptions\": [\"$CHANNEL_ID\"]}" > /dev/null
        echo "✅ Attached alerts to check: $CHECK_ID"
    done
    
    echo ""
    echo "🎉 TELEGRAM ALERTS CONFIGURED!"
    echo ""
    echo "📱 You'll now receive Telegram notifications for:"
    echo "   • IVOR service failures"
    echo "   • Response time degradation"
    echo "   • Cascade failure detection"
    echo ""
    echo "🔔 Test alert will arrive within 15 minutes"
    echo "🎯 IVOR platform is now fully monitored!"
else
    echo "❌ Failed to create Telegram webhook"
    echo "Response: $WEBHOOK_RESPONSE"
fi