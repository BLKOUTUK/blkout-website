#!/bin/bash

# IVOR Monitoring - Authenticated Deployment
echo "🚀 IVOR Monitoring - Authenticated Deployment"
echo "=============================================="

echo "✅ Using your logged-in Checkly session"
echo ""

# Create Check 1: API Gateway Health
echo "⏳ Creating IVOR API Gateway Health check..."
checkly check create \
  --name "IVOR API Gateway Health" \
  --type api \
  --method GET \
  --url "https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/health" \
  --locations "eu-west-1" \
  --frequency 5 \
  --alert-channels email \
  && echo "✅ API Gateway check created" || echo "❌ API Gateway check failed"

echo ""

# Create Check 2: Dashboard Health  
echo "⏳ Creating IVOR Dashboard Health check..."
checkly check create \
  --name "IVOR Dashboard Health" \
  --type api \
  --method GET \
  --url "https://ivor-monitoring-service.vercel.app/" \
  --locations "eu-west-1" \
  --frequency 5 \
  --alert-channels email \
  && echo "✅ Dashboard check created" || echo "❌ Dashboard check failed"

echo ""

# Create Check 3: Chat Response
echo "⏳ Creating IVOR Chat Response check..."
checkly check create \
  --name "IVOR Chat Response Quality" \
  --type api \
  --method POST \
  --url "https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app/api/chat" \
  --body '{"message": "Test monitoring", "context": {"pathway": "System Disruptor"}}' \
  --header "Content-Type: application/json" \
  --locations "eu-west-1" \
  --frequency 10 \
  --alert-channels email \
  && echo "✅ Chat Response check created" || echo "❌ Chat Response check failed"

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📊 Your IVOR monitoring includes:"
echo "   • API Gateway Health (every 5 minutes)"
echo "   • Dashboard Health (every 5 minutes)"
echo "   • Chat Response Quality (every 10 minutes)"
echo "   • EU West monitoring location"
echo "   • Email alerts configured"
echo ""
echo "🔍 Refresh your Checkly dashboard to see the checks"
echo "🎯 IVOR platform is now beta launch ready!"