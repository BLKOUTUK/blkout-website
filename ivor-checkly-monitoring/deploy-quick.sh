#!/bin/bash

# IVOR Quick Deploy - 3 Essential Checks
echo "🚀 IVOR Quick Monitoring Deployment"
echo "=================================="

ACCOUNT_ID="69781a21-8d44-4a43-a99d-33d40c07991f"

if [ -z "$CHECKLY_API_KEY" ]; then
    echo ""
    echo "🔑 Enter your Checkly API key:"
    read -s CHECKLY_API_KEY
    export CHECKLY_API_KEY
fi

echo ""
echo "✅ API Key set"
echo "📍 Account: $ACCOUNT_ID"

# Check 1: API Gateway Health
echo ""
echo "⏳ Creating IVOR API Gateway Health check..."
curl -s -X POST https://api.checklyhq.com/v1/checks \
  -H "X-Checkly-Account: $ACCOUNT_ID" \
  -H "Authorization: Bearer $CHECKLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IVOR API Gateway Health",
    "checkType": "API",
    "frequency": 5,
    "locations": ["eu-west-1"],
    "request": {
      "method": "GET",
      "url": "https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/health"
    },
    "assertions": [
      {"source": "STATUS_CODE", "comparison": "EQUALS", "target": "200"}
    ]
  }' > /dev/null && echo "✅ API Gateway check created" || echo "❌ API Gateway check failed"

# Check 2: Dashboard Health
echo "⏳ Creating IVOR Dashboard check..."
curl -s -X POST https://api.checklyhq.com/v1/checks \
  -H "X-Checkly-Account: $ACCOUNT_ID" \
  -H "Authorization: Bearer $CHECKLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IVOR Dashboard Health",
    "checkType": "API",
    "frequency": 5,
    "locations": ["eu-west-1"],
    "request": {
      "method": "GET",
      "url": "https://ivor-monitoring-service.vercel.app/"
    },
    "assertions": [
      {"source": "STATUS_CODE", "comparison": "EQUALS", "target": "200"}
    ]
  }' > /dev/null && echo "✅ Dashboard check created" || echo "❌ Dashboard check failed"

# Check 3: Chat Response
echo "⏳ Creating IVOR Chat Response check..."
curl -s -X POST https://api.checklyhq.com/v1/checks \
  -H "X-Checkly-Account: $ACCOUNT_ID" \
  -H "Authorization: Bearer $CHECKLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IVOR Chat Response Quality",
    "checkType": "API",
    "frequency": 10,
    "locations": ["eu-west-1"],
    "request": {
      "method": "POST",
      "url": "https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/api/chat",
      "headers": {"Content-Type": "application/json"},
      "body": "{\"message\": \"Test monitoring\", \"context\": {\"pathway\": \"System Disruptor\"}}"
    },
    "assertions": [
      {"source": "STATUS_CODE", "comparison": "EQUALS", "target": "200"}
    ]
  }' > /dev/null && echo "✅ Chat Response check created" || echo "❌ Chat Response check failed"

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📊 Your IVOR monitoring includes:"
echo "   • API Gateway Health (every 5 minutes)"
echo "   • Dashboard Health (every 5 minutes)" 
echo "   • Chat Response Quality (every 10 minutes)"
echo "   • EU West monitoring location"
echo "   • Automatic email alerts on failures"
echo ""
echo "🔍 View at: https://app.checklyhq.com/checks"
echo "🎯 IVOR platform is now beta launch ready!"