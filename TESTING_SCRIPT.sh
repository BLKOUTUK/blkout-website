#!/bin/bash

# BLKOUT Website Comprehensive Testing Script
# Run this script to validate launch readiness

echo "🏳️‍🌈 BLKOUT WEBSITE TESTING SUITE"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
PASS=0
FAIL=0
WARN=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASS++))
    else
        echo -e "${RED}FAIL${NC}"
        ((FAIL++))
    fi
}

# Function to check file exists
check_file() {
    local file_path="$1"
    local description="$2"
    
    echo -n "Checking: $description... "
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}EXISTS${NC}"
        ((PASS++))
    else
        echo -e "${RED}MISSING${NC}"
        ((FAIL++))
    fi
}

# Function to warn about manual testing needed
warn_manual() {
    local test_name="$1"
    echo -e "Manual Test Required: $test_name... ${YELLOW}MANUAL${NC}"
    ((WARN++))
}

echo "🔧 BUILD & COMPILATION TESTS"
echo "----------------------------"

# Test build process
run_test "Build Process" "npm run build" "success"

# Test TypeScript compilation
run_test "TypeScript Check" "npm run type-check" "success"

# Test linting
run_test "ESLint Check" "npm run lint" "success"

echo ""
echo "📁 FILE STRUCTURE TESTS"
echo "----------------------"

# Check critical files exist
check_file "src/App.tsx" "Main App Component"
check_file "src/main.tsx" "Main Entry Point"
check_file "src/index.css" "Global Styles"
check_file "src/components/layout/PrimaryNavigationEnhanced.tsx" "Navigation Component"
check_file "src/components/layout/SkipNavigation.tsx" "Skip Navigation Component"
check_file "src/components/layout/PlatformFooter.tsx" "Footer Component"
check_file "package.json" "Package Configuration"
check_file "tailwind.config.js" "Tailwind Configuration"
check_file "vite.config.ts" "Vite Configuration"

echo ""
echo "♿ ACCESSIBILITY TESTS"
echo "---------------------"

# Check for accessibility improvements
if grep -q "aria-label" src/components/layout/PrimaryNavigationEnhanced.tsx; then
    echo -e "ARIA Labels in Navigation... ${GREEN}IMPLEMENTED${NC}"
    ((PASS++))
else
    echo -e "ARIA Labels in Navigation... ${RED}MISSING${NC}"
    ((FAIL++))
fi

if grep -q "alt=" src/components/layout/PrimaryNavigationEnhanced.tsx; then
    echo -e "Alt Text for Images... ${GREEN}IMPLEMENTED${NC}"
    ((PASS++))
else
    echo -e "Alt Text for Images... ${RED}MISSING${NC}"
    ((FAIL++))
fi

if grep -q "role=" src/components/layout/PrimaryNavigationEnhanced.tsx; then
    echo -e "Semantic HTML Roles... ${GREEN}IMPLEMENTED${NC}"
    ((PASS++))
else
    echo -e "Semantic HTML Roles... ${RED}MISSING${NC}"
    ((FAIL++))
fi

# Manual accessibility tests
warn_manual "Keyboard Navigation Testing"
warn_manual "Screen Reader Testing (NVDA/JAWS/VoiceOver)"
warn_manual "Color Contrast Validation"
warn_manual "Focus Indicator Testing"

echo ""
echo "🚀 PERFORMANCE TESTS"
echo "-------------------"

# Check bundle size
BUNDLE_SIZE=$(du -sh dist/ 2>/dev/null | cut -f1 2>/dev/null || echo "N/A")
echo "Bundle Size: $BUNDLE_SIZE"

if [ -d "dist/" ]; then
    echo -e "Production Build... ${GREEN}EXISTS${NC}"
    ((PASS++))
else
    echo -e "Production Build... ${RED}MISSING${NC}"
    ((FAIL++))
fi

# Manual performance tests
warn_manual "Lighthouse Performance Audit"
warn_manual "Core Web Vitals Testing"
warn_manual "Mobile Performance Testing"
warn_manual "Network Throttling Testing"

echo ""
echo "🔗 NAVIGATION & ROUTING TESTS"
echo "----------------------------"

# Check routing structure
if grep -q "Routes" src/App.tsx; then
    echo -e "React Router Implementation... ${GREEN}IMPLEMENTED${NC}"
    ((PASS++))
else
    echo -e "React Router Implementation... ${RED}MISSING${NC}"
    ((FAIL++))
fi

# Check for key routes
ROUTES=("/" "/platform" "/community" "/events" "/stories" "/movement" "/discussions" "/ivor")
for route in "${ROUTES[@]}"; do
    if grep -q "path=\"$route\"" src/App.tsx; then
        echo -e "Route $route... ${GREEN}CONFIGURED${NC}"
        ((PASS++))
    else
        echo -e "Route $route... ${RED}MISSING${NC}"
        ((FAIL++))
    fi
done

echo ""
echo "🎨 UI/UX TESTS"
echo "-------------"

# Check for responsive design classes
if grep -q "md:" src/components/layout/PrimaryNavigationEnhanced.tsx; then
    echo -e "Responsive Design Classes... ${GREEN}IMPLEMENTED${NC}"
    ((PASS++))
else
    echo -e "Responsive Design Classes... ${RED}MISSING${NC}"
    ((FAIL++))
fi

# Check for color theme consistency
if grep -q "indigo-" src/components/layout/PrimaryNavigationEnhanced.tsx; then
    echo -e "Color Theme Consistency... ${GREEN}CONSISTENT${NC}"
    ((PASS++))
else
    echo -e "Color Theme Consistency... ${YELLOW}CHECK NEEDED${NC}"
    ((WARN++))
fi

# Manual UI tests
warn_manual "Cross-Browser Testing (Chrome, Firefox, Safari, Edge)"
warn_manual "Mobile Device Testing"
warn_manual "Visual Regression Testing"
warn_manual "User Journey Testing"

echo ""
echo "🔒 SECURITY TESTS"
echo "---------------"

# Check for security best practices
if grep -q "target=\"_blank\"" src/components/layout/PlatformFooter.tsx; then
    if grep -q "rel=\"noopener noreferrer\"" src/components/layout/PlatformFooter.tsx; then
        echo -e "External Link Security... ${GREEN}IMPLEMENTED${NC}"
        ((PASS++))
    else
        echo -e "External Link Security... ${YELLOW}PARTIAL${NC}"
        ((WARN++))
    fi
else
    echo -e "External Link Security... ${YELLOW}CHECK NEEDED${NC}"
    ((WARN++))
fi

# Manual security tests
warn_manual "Dependency Security Audit (npm audit)"
warn_manual "XSS Prevention Testing"
warn_manual "Content Security Policy Validation"
warn_manual "HTTPS Enforcement Testing"

echo ""
echo "📱 COMMUNITY FEATURES TESTS"
echo "--------------------------"

# Check for community components
COMMUNITY_COMPONENTS=(
    "src/components/community/CommunityGatewayEnhanced.tsx"
    "src/components/community/JoinDiscussionEnhanced.tsx"
    "src/components/magazine/PlatformHomepage.tsx"
    "src/components/events/EventsPageIntegrated.tsx"
)

for component in "${COMMUNITY_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo -e "$(basename "$component" .tsx)... ${GREEN}EXISTS${NC}"
        ((PASS++))
    else
        echo -e "$(basename "$component" .tsx)... ${RED}MISSING${NC}"
        ((FAIL++))
    fi
done

# Manual community tests
warn_manual "Community Gateway Functionality"
warn_manual "Events Integration Testing"
warn_manual "IVOR AI Assistant Integration"
warn_manual "Content Submission Workflow"

echo ""
echo "📊 TESTING SUMMARY"
echo "=================="
echo -e "✅ Passed Tests: ${GREEN}$PASS${NC}"
echo -e "❌ Failed Tests: ${RED}$FAIL${NC}"
echo -e "⚠️  Manual Tests Required: ${YELLOW}$WARN${NC}"

TOTAL=$((PASS + FAIL))
if [ $TOTAL -gt 0 ]; then
    PASS_RATE=$((PASS * 100 / TOTAL))
    echo -e "📈 Automated Test Pass Rate: ${BLUE}$PASS_RATE%${NC}"
fi

echo ""
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All automated tests passed! Ready for manual testing phase.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please address issues before proceeding.${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Fix any failed automated tests"
    echo "2. Complete manual testing checklist"
    echo "3. Address accessibility and performance issues"
    echo "4. Review launch readiness checklist"
    exit 1
fi