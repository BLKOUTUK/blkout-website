#!/bin/bash

# BLKOUT Deployment Verification Script
# Ensures platform-blkout.vercel.app always points to latest deployment

echo "🚀 BLKOUT Deployment Verification"
echo "================================="

# Get the latest production deployment
echo "📋 Fetching latest deployments..."
LATEST_DEPLOYMENT=$(npx vercel ls --scope robs-projects-54d653d3 | grep "Production" | head -1 | awk '{print $3}')

if [ -z "$LATEST_DEPLOYMENT" ]; then
    echo "❌ Error: Could not find latest production deployment"
    exit 1
fi

echo "✅ Latest production deployment: $LATEST_DEPLOYMENT"

# Check current alias target
echo "🔍 Checking current alias target..."
CURRENT_ALIAS=$(npx vercel alias ls | grep "platform-blkout.vercel.app" | head -1 | awk '{print $1}')

if [ -z "$CURRENT_ALIAS" ]; then
    echo "❌ Error: platform-blkout.vercel.app alias not found"
    exit 1
fi

echo "📍 Current alias points to: $CURRENT_ALIAS"

# Compare and update if needed
if [ "$LATEST_DEPLOYMENT" != "$CURRENT_ALIAS" ]; then
    echo "⚠️  Alias is outdated! Updating..."
    
    # Update the alias
    npx vercel alias set "$LATEST_DEPLOYMENT" platform-blkout.vercel.app
    
    if [ $? -eq 0 ]; then
        echo "✅ Alias updated successfully!"
        echo "🎉 platform-blkout.vercel.app now points to: $LATEST_DEPLOYMENT"
        
        # Wait a moment for propagation
        echo "⏳ Waiting for DNS propagation..."
        sleep 5
        
        # Test the admin endpoint
        echo "🧪 Testing admin endpoint..."
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://platform-blkout.vercel.app/admin)
        
        if [ "$HTTP_STATUS" = "200" ]; then
            echo "✅ Admin endpoint is responding (HTTP $HTTP_STATUS)"
        else
            echo "⚠️  Admin endpoint returned HTTP $HTTP_STATUS"
        fi
        
    else
        echo "❌ Failed to update alias"
        exit 1
    fi
else
    echo "✅ Alias is already up to date!"
fi

# Additional verification
echo ""
echo "🔍 Final Verification:"
echo "----------------------"
echo "Production URL: https://blkout-website.vercel.app"
echo "Alias URL: https://platform-blkout.vercel.app"
echo "Admin URL: https://platform-blkout.vercel.app/admin"
echo ""
echo "🏁 Deployment verification completed successfully!"

# Create a timestamp file for tracking
echo "$(date): Verified deployment $LATEST_DEPLOYMENT" >> deployment-verification.log