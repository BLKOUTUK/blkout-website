#!/bin/bash

# Test Checkly API access
echo "🧪 Testing Checkly API access..."

ACCOUNT_ID="69781a21-8d44-4a43-a99d-33d40c07991f"

if [ -z "$CHECKLY_API_KEY" ]; then
    echo "❌ CHECKLY_API_KEY not set"
    echo "   Set it with: export CHECKLY_API_KEY='your-api-key'"
    exit 1
fi

echo "🔍 Fetching existing checks..."
RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" \
    -H "X-Checkly-Account: $ACCOUNT_ID" \
    -H "Authorization: Bearer $CHECKLY_API_KEY" \
    https://api.checklyhq.com/v1/checks)

HTTP_STATUS=$(echo $RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo $RESPONSE | sed -E 's/HTTP_STATUS:[0-9]*$//')

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ API access successful!"
    
    # Count existing checks
    CHECK_COUNT=$(echo $BODY | grep -o '"id"' | wc -l)
    echo "📊 Found $CHECK_COUNT existing checks"
    
    if [ "$CHECK_COUNT" -gt 0 ]; then
        echo ""
        echo "🔍 Existing checks:"
        echo $BODY | jq -r '.[] | "  • \(.name) (\(.id))"' 2>/dev/null || echo "  (JSON parsing not available)"
    fi
    
    echo ""
    echo "🚀 Ready to deploy IVOR monitoring!"
    echo "   Run: checkly deploy"
    
elif [ "$HTTP_STATUS" = "401" ]; then
    echo "❌ Authentication failed (HTTP 401)"
    echo "   Check your API key"
    
elif [ "$HTTP_STATUS" = "403" ]; then
    echo "❌ Access forbidden (HTTP 403)"
    echo "   Check account permissions"
    
else
    echo "❌ API request failed (HTTP $HTTP_STATUS)"
    echo "Response: $BODY"
fi