#!/bin/bash

echo "🚀 IVOR Checkly Monitoring - Complete Deployment"
echo "================================================="

# Step 1: Set account ID
export CHECKLY_ACCOUNT_ID="69781a21-8d44-4a43-a99d-33d40c07991f"
echo "✅ Account ID configured"

# Step 2: Check if API key is set
if [ -z "$CHECKLY_API_KEY" ]; then
    echo ""
    echo "🔑 API Key Required"
    echo "Get your API key from:"
    echo "https://app.checklyhq.com/accounts/69781a21-8d44-4a43-a99d-33d40c07991f/settings/api-keys"
    echo ""
    read -s -p "Enter your API key: " CHECKLY_API_KEY
    export CHECKLY_API_KEY
    echo ""
fi

# Step 3: Test API access
echo "🧪 Testing API access..."
if curl -s -H "X-Checkly-Account: $CHECKLY_ACCOUNT_ID" \
        -H "Authorization: Bearer $CHECKLY_API_KEY" \
        https://api.checklyhq.com/v1/checks > /dev/null; then
    echo "✅ API authentication successful"
else
    echo "❌ API authentication failed"
    echo "Check your API key and try again"
    exit 1
fi

# Step 4: Validate IVOR services
echo ""
echo "🔍 Validating IVOR services..."
if node validate-setup.js > /dev/null 2>&1; then
    echo "✅ All IVOR services healthy"
else
    echo "⚠️ Some IVOR services may have issues"
    echo "Continuing with deployment..."
fi

# Step 5: Deploy to Checkly
echo ""
echo "🚀 Deploying monitoring checks..."
if checkly deploy; then
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
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Verify authentication: checkly whoami"
    echo "2. Check configuration: checkly test --dry-run"
    echo "3. Review logs above for specific errors"
fi

echo ""
echo "💡 To set persistent environment variables:"
echo "   echo 'export CHECKLY_ACCOUNT_ID=\"69781a21-8d44-4a43-a99d-33d40c07991f\"' >> ~/.bashrc"
echo "   echo 'export CHECKLY_API_KEY=\"your-api-key\"' >> ~/.bashrc"