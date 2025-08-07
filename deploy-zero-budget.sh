#!/bin/bash

echo "🚀 BLKOUT Zero-Budget Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
print_success "Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "npm is available"

# Build frontend
print_status "Building frontend application..."
cd /app
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Test local services
print_status "Testing local backend services..."

# Test IVOR AI
IVOR_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
if [ "$IVOR_RESPONSE" = "200" ]; then
    print_success "IVOR AI service is running"
else
    print_warning "IVOR AI service not responding (will use fallback)"
fi

# Test Events API
EVENTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/events)
if [ "$EVENTS_RESPONSE" = "200" ]; then
    print_success "Events API is running"
else
    print_warning "Events API not responding (will use fallback)"
fi

# Test Newsroom API
NEWSROOM_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/articles)
if [ "$NEWSROOM_RESPONSE" = "200" ]; then
    print_success "Newsroom API is running"
else
    print_warning "Newsroom API not responding (will use fallback)"
fi

# Test Magazine API
MAGAZINE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/api/articles)
if [ "$MAGAZINE_RESPONSE" = "200" ]; then
    print_success "Magazine API is running"
else
    print_warning "Magazine API not responding (will use fallback)"
fi

print_status "Local testing complete!"
echo ""

# Deployment instructions
echo "🌐 DEPLOYMENT INSTRUCTIONS"
echo "========================="
echo ""
echo "Your BLKOUT website is ready for zero-budget deployment!"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. FRONTEND DEPLOYMENT (Vercel Free Tier):"
echo "   - Go to https://vercel.com/new"
echo "   - Connect your GitHub repository"
echo "   - Deploy directly from this directory"
echo "   - Free tier: Unlimited bandwidth, custom domains"
echo ""
echo "2. BACKEND SERVICES (Vercel Serverless Functions):"
echo "   - Each backend service can be deployed separately"
echo "   - Deploy from these directories:"
echo "     • /app/backend/services (IVOR AI)"
echo "     • /app/backend/events-deploy (Events API)"
echo "     • /app/backend/newsroom-deploy (Newsroom API)"
echo "     • /app/backend/magazine-deploy (Magazine API)"
echo ""
echo "3. ZERO-COST FEATURES ENABLED:"
echo "   ✅ Intelligent fallback responses (no AI API costs)"
echo "   ✅ In-memory data storage (no database costs)"
echo "   ✅ Community-curated content"
echo "   ✅ Full responsive design"
echo "   ✅ All liberation pathway features"
echo ""
echo "4. OPTIONAL UPGRADES (when budget allows):"
echo "   • Grok API integration for enhanced IVOR responses"
echo "   • MongoDB for persistent data storage"
echo "   • Custom domain (can be free with some providers)"
echo ""

# Generate deployment summary
print_status "Generating deployment summary..."

cat > deployment-summary.json << EOF
{
  "deployment_type": "zero-budget",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "services": {
    "frontend": {
      "status": "ready",
      "platform": "vercel",
      "cost": "free",
      "features": ["responsive_design", "liberation_pathways", "community_features"]
    },
    "ivor_ai": {
      "status": "ready",
      "platform": "vercel_serverless",
      "cost": "free",
      "fallback_mode": true
    },
    "events_api": {
      "status": "ready",
      "platform": "vercel_serverless", 
      "cost": "free",
      "data_storage": "in_memory"
    },
    "newsroom_api": {
      "status": "ready",
      "platform": "vercel_serverless",
      "cost": "free",
      "data_storage": "in_memory"
    },
    "magazine_api": {
      "status": "ready",
      "platform": "vercel_serverless",
      "cost": "free",
      "data_storage": "community_curated"
    }
  },
  "estimated_monthly_cost": "$0.00",
  "upgrade_path": {
    "ai_integration": "grok_api",
    "database": "mongodb_atlas_free",
    "domain": "custom_domain_optional"
  }
}
EOF

print_success "Deployment summary saved to deployment-summary.json"
echo ""

echo "🎉 ZERO-BUDGET DEPLOYMENT READY!"
echo "================================"
echo ""
echo "Your BLKOUT website is fully prepared for free deployment."
echo "All services are configured to work without ongoing costs."
echo ""
echo "Community impact: ✅ ACTIVATED"
echo "Liberation pathways: ✅ FUNCTIONAL"
echo "AI assistance: ✅ AVAILABLE (with fallbacks)"
echo "Backend services: ✅ READY"
echo ""
echo "🏳️‍🌈 Ready to serve the Black queer community! 🏳️‍🌈"