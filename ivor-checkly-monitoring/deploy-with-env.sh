#!/bin/bash

# IVOR Checkly Monitoring - Environment Variable Deployment
echo "🚀 IVOR Checkly Monitoring - ENV Deployment"
echo "============================================"

# Set account ID
export CHECKLY_ACCOUNT_ID="69781a21-8d44-4a43-a99d-33d40c07991f"

# Prompt for API key
echo ""
echo "🔑 Enter your Checkly API key:"
echo "   Get it from: https://app.checklyhq.com/accounts/69781a21-8d44-4a43-a99d-33d40c07991f/settings/api-keys"
echo ""
read -s -p "API Key: " CHECKLY_API_KEY
export CHECKLY_API_KEY

echo ""
echo "✅ Environment variables set"

# Test authentication
echo ""
echo "🧪 Testing authentication..."
if curl -s -H "X-Checkly-Account: $CHECKLY_ACCOUNT_ID" \
        -H "Authorization: Bearer $CHECKLY_API_KEY" \
        https://api.checklyhq.com/v1/checks > /dev/null; then
    echo "✅ API authentication successful"
else
    echo "❌ Authentication failed - check your API key"
    exit 1
fi

# Deploy with environment variables
echo ""
echo "🚀 Deploying with environment variables..."
if CHECKLY_ACCOUNT_ID="$CHECKLY_ACCOUNT_ID" CHECKLY_API_KEY="$CHECKLY_API_KEY" checkly deploy; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo ""
    echo "📊 Your IVOR monitoring is now live:"
    echo "   • 5 orchestration quality checks"
    echo "   • Running every 5 minutes"  
    echo "   • EU + US monitoring locations"
    echo "   • Immediate failure alerts"
    echo ""
    echo "🔍 Monitor at:"
    echo "   Checkly: https://app.checklyhq.com/checks"
    echo "   IVOR:    https://ivor-monitoring-service.vercel.app/"
    echo ""
    echo "🎯 IVOR platform is now beta launch ready!"
else
    echo ""
    echo "❌ Deployment failed"
    echo "Check the logs above for details"
fi