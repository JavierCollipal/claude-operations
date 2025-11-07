#!/bin/bash

# 🐾✨ CLAUDE.md Microservice Test Script ✨🐾

API_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🐾✨ Testing CLAUDE.md Microservice ✨🐾${NC}\n"

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo "Endpoint: ${method} ${endpoint}"

    if [ "$method" = "GET" ]; then
        response=$(curl -s -X GET "${API_URL}${endpoint}")
    else
        response=$(curl -s -X POST "${API_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -d "${data}")
    fi

    # Check if response contains "success" or "status"
    if echo "$response" | grep -q '"success"\s*:\s*true\|"status"\s*:\s*"healthy"\|"status"\s*:\s*"OPERATIONAL"'; then
        echo -e "${GREEN}✅ Success${NC}"
    else
        echo -e "${RED}❌ Failed${NC}"
    fi

    echo "Response: ${response:0:200}..."
    echo "---"
    echo
}

# Test health endpoint
test_endpoint "GET" "/health" "" "Health Check"

# Test root endpoint
test_endpoint "GET" "/" "" "Service Info"

# Test rules endpoint
test_endpoint "GET" "/api/rules" "" "Get All Rules"

# Test specific rule
test_endpoint "GET" "/api/rules/0" "" "Get Rule 0 (IMMUTABILITY)"

# Test personalities
test_endpoint "GET" "/api/personalities" "" "Get All Personalities"

# Test personality response
test_endpoint "GET" "/api/personality/neko/response" "" "Get Neko Response"

# Test validation - Valid case
test_endpoint "POST" "/api/validate" \
    '{"repoPath": "/home/wakibaka/Documents/github/test-project"}' \
    "Validate Valid Path"

# Test validation - Invalid case
test_endpoint "POST" "/api/validate" \
    '{"repoPath": "/invalid/path", "code": "mongodb+srv://user:pass@cluster"}' \
    "Validate Invalid Data"

# Test collaboration
test_endpoint "POST" "/api/collaborate" \
    '{"task": "Create test suite", "context": "Testing"}' \
    "Six Personalities Collaboration"

# Test project analysis
test_endpoint "POST" "/api/analyze-project" \
    '{"projectName": "test", "projectPath": "/home/wakibaka/Documents/github/test", "files": [".env", ".gitignore", "README.md"]}' \
    "Analyze Project"

# Test webhook enforcement
test_endpoint "POST" "/api/webhook/enforce" \
    '{"event": "repository.created", "repository": "test-repo", "data": {"private": false}}' \
    "Webhook Enforcement"

# Test stats
test_endpoint "GET" "/api/stats" "" "System Statistics"

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Testing Complete! ✨${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

# Summary
echo -e "${YELLOW}Tested Endpoints:${NC}"
echo "  ✓ Health Check"
echo "  ✓ Service Info"
echo "  ✓ IMMUTABLE Rules"
echo "  ✓ Six Personalities"
echo "  ✓ Validation System"
echo "  ✓ Collaboration Mode"
echo "  ✓ Project Analysis"
echo "  ✓ Webhook Enforcement"
echo "  ✓ System Statistics"

echo -e "\n${GREEN}Nyaa~! All endpoints tested, desu~! 🐾${NC}"