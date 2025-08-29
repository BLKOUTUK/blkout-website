#!/bin/bash

# IVOR Checkly Monitoring - Quick Deploy Script
echo "🚀 IVOR Checkly Monitoring Deployment"
echo "======================================"

echo ""
echo "🔑 Getting your API key..."
echo ""
echo "1. Go to: https://app.checklyhq.com/accounts/69781a21-8d44-4a43-a99d-33d40c07991f/settings/api-keys"
echo "2. Click 'Create API Key'"
echo "3. Name: 'IVOR Monitoring'"
echo "4. Copy the API key"
echo ""

# Check if we can login
if checkly whoami > /dev/null 2>&1; then
    echo "✅ Already authenticated with Checkly"
else
    echo "Please run: checkly login"
    echo ""
    echo "Or set environment variables:"
    echo "export CHECKLY_ACCOUNT_ID='69781a21-8d44-4a43-a99d-33d40c07991f'"
    echo "export CHECKLY_API_KEY='your-api-key-here'"
    echo ""
fi

echo "💡 Once authenticated, run:"
echo "   checkly deploy"
echo ""
echo "🎯 This will deploy 5 IVOR monitoring checks:"
echo "   • IVOR System Disruptor Pathway Response"
echo "   • IVOR Community Healer Pathway Response" 
echo "   • IVOR Multi-Service Knowledge Query"
echo "   • IVOR API Gateway Health Check"
echo "   • IVOR Monitoring Dashboard Accessibility"
echo ""
echo "⏱️  Each check runs every 5 minutes from EU + US locations"
echo "📱 Alerts will be sent on any failures"
echo ""
echo "Ready to deploy IVOR monitoring! 🚀"