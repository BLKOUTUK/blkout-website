#!/bin/bash

# IVOR Checkly Authentication Setup
echo "🔑 Setting up Checkly authentication..."

# Set account ID (this is public, safe to set)
export CHECKLY_ACCOUNT_ID="69781a21-8d44-4a43-a99d-33d40c07991f"

echo "✅ Account ID set: $CHECKLY_ACCOUNT_ID"

# Prompt for API key (secure input)
echo ""
echo "📝 Please enter your Checkly API key:"
echo "   (Get it from: https://app.checklyhq.com/accounts/69781a21-8d44-4a43-a99d-33d40c07991f/settings/api-keys)"
echo ""
read -s -p "API Key: " CHECKLY_API_KEY
export CHECKLY_API_KEY

echo ""
echo "✅ API key set (hidden)"

# Test authentication
echo ""
echo "🧪 Testing authentication..."

if curl -s -H "X-Checkly-Account: $CHECKLY_ACCOUNT_ID" \
        -H "Authorization: Bearer $CHECKLY_API_KEY" \
        https://api.checklyhq.com/v1/checks > /dev/null; then
    echo "✅ Authentication successful!"
    
    # Test Checkly CLI
    echo ""
    echo "🧪 Testing Checkly CLI..."
    if checkly whoami > /dev/null 2>&1; then
        echo "✅ Checkly CLI authenticated"
    else
        echo "⚠️ Checkly CLI needs authentication"
        echo "   Run: checkly login"
    fi
    
    echo ""
    echo "🚀 Ready to deploy!"
    echo "   Run: checkly deploy"
    
else
    echo "❌ Authentication failed"
    echo "   Check your API key and try again"
fi

echo ""
echo "💡 To persist these variables, add to your ~/.bashrc:"
echo "   export CHECKLY_ACCOUNT_ID=\"$CHECKLY_ACCOUNT_ID\""
echo "   export CHECKLY_API_KEY=\"your-api-key\""