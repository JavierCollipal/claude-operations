#!/bin/bash

# 🐾✨ NPM Publish Helper for MCP CLAUDE System ✨🐾

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🐾✨ MCP CLAUDE System NPM Publisher ✨🐾${NC}"
echo -e "${BLUE}===========================================${NC}\n"

# Check if logged in to npm
echo -e "${YELLOW}Checking NPM login status...${NC}"
if ! npm whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to NPM${NC}"
    echo -e "${YELLOW}Please login first with: npm login${NC}"
    exit 1
fi

NPM_USER=$(npm whoami)
echo -e "${GREEN}✅ Logged in as: $NPM_USER${NC}\n"

# Check package name availability
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo -e "${YELLOW}Checking if package name '$PACKAGE_NAME' is available...${NC}"

if npm view "$PACKAGE_NAME" &> /dev/null; then
    echo -e "${YELLOW}⚠️ Package already exists on NPM${NC}"
    echo "Current version on NPM: $(npm view $PACKAGE_NAME version)"
    echo "Local version: $(node -p "require('./package.json').version")"
    echo ""
    echo "Options:"
    echo "1. Bump version and publish"
    echo "2. Publish as-is (will fail if same version exists)"
    echo "3. Cancel"
    read -p "Choice (1-3): " choice

    case $choice in
        1)
            echo -e "\n${YELLOW}Bumping version...${NC}"
            npm version patch
            ;;
        2)
            echo -e "\n${YELLOW}Publishing as-is...${NC}"
            ;;
        3)
            echo -e "${RED}Cancelled${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
else
    echo -e "${GREEN}✅ Package name is available!${NC}\n"
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Run tests
echo -e "\n${YELLOW}Running tests...${NC}"
npm test || {
    echo -e "${YELLOW}⚠️ Tests failed or not configured${NC}"
    read -p "Continue anyway? (y/n): " cont
    if [[ $cont != "y" ]]; then
        exit 1
    fi
}

# Publish options
echo -e "\n${BLUE}Publishing options:${NC}"
echo "1. Publish to NPM (public)"
echo "2. Dry run (simulate publish)"
echo "3. Pack only (create .tgz file)"
echo "4. Cancel"
read -p "Choice (1-4): " publish_choice

case $publish_choice in
    1)
        echo -e "\n${GREEN}Publishing to NPM...${NC}"
        npm publish --access public
        echo -e "\n${GREEN}✨ Published successfully! ✨${NC}"
        echo -e "${BLUE}Install with: npm install -g $PACKAGE_NAME${NC}"
        ;;
    2)
        echo -e "\n${YELLOW}Running dry run...${NC}"
        npm publish --dry-run
        echo -e "\n${YELLOW}Dry run complete (nothing published)${NC}"
        ;;
    3)
        echo -e "\n${YELLOW}Creating package...${NC}"
        npm pack
        echo -e "${GREEN}✅ Package created: ${PACKAGE_NAME}-*.tgz${NC}"
        ;;
    4)
        echo -e "${RED}Cancelled${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Process Complete! ✨${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Next steps for users:${NC}"
echo "1. Install: npm install -g $PACKAGE_NAME"
echo "2. Configure Claude Desktop:"
echo '   {
     "mcpServers": {
       "claude-system": {
         "command": "'$PACKAGE_NAME'"
       }
     }
   }'
echo "3. Restart Claude Desktop"
echo ""
echo -e "${GREEN}Nyaa~! MCP server ready to share with the world, desu~! 🐾${NC}"