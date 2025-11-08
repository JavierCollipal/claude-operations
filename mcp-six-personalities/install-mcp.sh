#!/bin/bash

# 🐾✨ CLAUDE.md MCP Server Installer ✨🐾

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🐾✨ CLAUDE.md MCP Server Installer ✨🐾${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js (>= 18.0.0) from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be >= 18.0.0${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}\n"

# Install options
echo -e "${YELLOW}Choose installation method:${NC}"
echo "1. Install globally via NPM (recommended)"
echo "2. Install from this directory"
echo "3. Just show configuration instructions"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Installing mcp-claude-system globally...${NC}"
        npm install -g mcp-claude-system
        echo -e "${GREEN}✅ Installation complete!${NC}\n"
        COMMAND="mcp-claude-system"
        ;;
    2)
        echo -e "\n${YELLOW}Installing from current directory...${NC}"
        npm install
        npm link
        echo -e "${GREEN}✅ Local installation complete!${NC}\n"
        COMMAND="mcp-claude-system"
        ;;
    3)
        echo -e "\n${BLUE}Showing configuration only...${NC}"
        COMMAND="npx mcp-claude-system"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Detect OS and Claude config location
echo -e "${YELLOW}Detecting Claude Desktop configuration...${NC}"

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CONFIG_DIR="$HOME/.config/claude"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash)
    CONFIG_DIR="$APPDATA/Claude"
else
    echo -e "${YELLOW}⚠️ Could not detect OS. Please manually locate your Claude config directory.${NC}"
    CONFIG_DIR=""
fi

if [ -n "$CONFIG_DIR" ]; then
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    echo -e "Config location: ${GREEN}$CONFIG_FILE${NC}\n"
else
    CONFIG_FILE=""
fi

# Generate configuration
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}📋 Add this to your Claude Desktop config:${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

cat << EOF
{
  "mcpServers": {
    "claude-system": {
      "command": "$COMMAND"
    }
  }
}
EOF

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"

# Offer to open config file
if [ -f "$CONFIG_FILE" ]; then
    echo -e "\n${YELLOW}Would you like to open your Claude config file? (y/n)${NC}"
    read -p "> " open_config

    if [[ $open_config == "y" ]] || [[ $open_config == "Y" ]]; then
        if command -v code &> /dev/null; then
            code "$CONFIG_FILE"
        elif command -v nano &> /dev/null; then
            nano "$CONFIG_FILE"
        elif command -v vim &> /dev/null; then
            vim "$CONFIG_FILE"
        else
            echo -e "${YELLOW}Opening with default editor...${NC}"
            "${EDITOR:-vi}" "$CONFIG_FILE"
        fi
    fi
fi

# Final instructions
echo -e "\n${GREEN}✨ Installation Instructions Complete! ✨${NC}\n"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Add the configuration above to your Claude Desktop config"
echo "2. Restart Claude Desktop"
echo "3. The MCP tools will be available in your conversations!"
echo ""
echo -e "${BLUE}Available tools:${NC}"
echo "  • validate_rules - Validate against IMMUTABLE rules"
echo "  • get_personality_response - Get personality responses"
echo "  • collaborate - Six personalities collaboration"
echo "  • check_project_compliance - Check project compliance"
echo "  • enforce_rule - Enforce specific rules"
echo ""
echo -e "${GREEN}Nyaa~! CLAUDE.md MCP server ready, desu~! 🐾${NC}\n"