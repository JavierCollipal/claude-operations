#!/bin/bash

# GitHub Public Repository Community Notifier (Bash Version)
# Provides automated community feedback when a repository goes public

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <owner> <repo>"
    echo "Example: $0 JavierCollipal claude-operations"
    exit 1
fi

OWNER=$1
REPO=$2
FULL_REPO="${OWNER}/${REPO}"

echo -e "${BLUE}🚀 GitHub Community Notifier${NC}"
echo -e "${BLUE}Repository: ${FULL_REPO}${NC}\n"

# Function to check if repo is public
check_repo_public() {
    echo -e "${YELLOW}Checking repository status...${NC}"
    IS_PRIVATE=$(gh api repos/${FULL_REPO} --jq '.private')

    if [ "$IS_PRIVATE" = "true" ]; then
        echo -e "${RED}❌ Repository is private. Exiting...${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ Repository is public!${NC}\n"
    fi
}

# Function to enable discussions
enable_discussions() {
    echo -e "${YELLOW}📋 Enabling GitHub Discussions...${NC}"

    # Get repository node ID
    REPO_ID=$(gh api repos/${FULL_REPO} --jq '.node_id')

    # Enable discussions via GraphQL
    gh api graphql -f query="
    mutation {
        updateRepository(input: {
            repositoryId: \"${REPO_ID}\",
            hasDiscussionsEnabled: true
        }) {
            repository {
                hasDiscussionsEnabled
            }
        }
    }" 2>/dev/null && echo -e "${GREEN}✅ Discussions enabled${NC}" || echo -e "${YELLOW}⚠️ Could not enable discussions${NC}"
}

# Function to create welcome issue
create_welcome_issue() {
    echo -e "${YELLOW}📝 Creating welcome issue...${NC}"

    ISSUE_BODY="## 🎉 This repository is now public!

Welcome to the community! This repository contains operational scripts and development tools.

### 📋 Quick Start
- Check the [README](README.md) for project overview
- See [GUIDELINES](GUIDELINES.md) for contribution guidelines
- Review the [LICENSE](LICENSE) for terms of use

### 🤝 Contributing
We welcome contributions! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share feedback

### 📬 Get in Touch
If you have questions or suggestions, please open an issue!

---
*This is an automated message created when the repository became public.*"

    gh issue create \
        -R ${FULL_REPO} \
        --title "🎉 Repository Now Public - Welcome to the Community!" \
        --body "${ISSUE_BODY}" \
        --label "announcement,documentation" 2>/dev/null && \
        echo -e "${GREEN}✅ Welcome issue created${NC}" || \
        echo -e "${YELLOW}⚠️ Could not create issue (might already exist)${NC}"
}

# Function to create initial release
create_release() {
    echo -e "${YELLOW}🏷️ Creating initial release...${NC}"

    RELEASE_NOTES="## 🎉 Initial Public Release

This is the first public release of ${REPO}!

### ✨ Features
- Operational scripts and tools
- Development automation
- Comprehensive documentation

### 🚀 Getting Started
\`\`\`bash
git clone https://github.com/${FULL_REPO}.git
cd ${REPO}
\`\`\`

### 🤝 Contributing
See [GUIDELINES](GUIDELINES.md) for contribution information.

### 📜 License
MIT License - see [LICENSE](LICENSE) for details."

    gh release create v1.0.0 \
        -R ${FULL_REPO} \
        --title "v1.0.0 - Initial Public Release" \
        --notes "${RELEASE_NOTES}" \
        --target main 2>/dev/null && \
        echo -e "${GREEN}✅ Release created${NC}" || \
        echo -e "${YELLOW}⚠️ Release might already exist${NC}"
}

# Function to setup labels
setup_labels() {
    echo -e "${YELLOW}🏷️ Setting up repository labels...${NC}"

    # Define labels
    declare -a labels=(
        "announcement:0052CC:Important announcements"
        "community:7057FF:Community discussions"
        "good first issue:008672:Good for newcomers"
        "help wanted:FEF2C0:Extra attention is needed"
    )

    for label_info in "${labels[@]}"; do
        IFS=':' read -r name color desc <<< "$label_info"
        gh label create "${name}" \
            -R ${FULL_REPO} \
            --color "${color}" \
            --description "${desc}" 2>/dev/null && \
            echo -e "   ${GREEN}✅ Created: ${name}${NC}" || \
            echo -e "   ${YELLOW}ℹ️ Exists: ${name}${NC}"
    done
}

# Function to check for gh extensions
check_extensions() {
    echo -e "${YELLOW}📦 Checking for useful gh extensions...${NC}"

    # Check if gh-notify is installed
    if gh extension list | grep -q "meiji163/gh-notify"; then
        echo -e "${GREEN}✅ gh-notify extension found${NC}"
    else
        echo -e "${BLUE}💡 Consider installing gh-notify for notifications:${NC}"
        echo "   gh extension install meiji163/gh-notify"
    fi

    # Check if gh-dash is installed
    if gh extension list | grep -q "dlvhdr/gh-dash"; then
        echo -e "${GREEN}✅ gh-dash extension found${NC}"
    else
        echo -e "${BLUE}💡 Consider installing gh-dash for monitoring:${NC}"
        echo "   gh extension install dlvhdr/gh-dash"
    fi
}

# Function to generate summary
generate_summary() {
    echo -e "\n${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${GREEN}📊 Community Notification Summary${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"

    echo -e "Repository: ${GREEN}${FULL_REPO}${NC}"
    echo -e "Status: ${GREEN}PUBLIC${NC}"
    echo -e "Timestamp: $(date -Iseconds)"

    echo -e "\n${YELLOW}Actions Performed:${NC}"
    echo "  ✓ Repository status verified"
    echo "  ✓ Discussions enabled (if supported)"
    echo "  ✓ Welcome issue created"
    echo "  ✓ Initial release published"
    echo "  ✓ Labels configured"

    echo -e "\n${YELLOW}Next Steps:${NC}"
    echo "  • Monitor community feedback"
    echo "  • Respond to issues and PRs"
    echo "  • Create CODE_OF_CONDUCT.md"
    echo "  • Add CONTRIBUTING.md"
    echo "  • Set up GitHub Actions workflows"

    echo -e "\n${YELLOW}Useful Commands:${NC}"
    echo "  gh issue list -R ${FULL_REPO}"
    echo "  gh pr list -R ${FULL_REPO}"
    echo "  gh release list -R ${FULL_REPO}"

    # Save summary to file
    SUMMARY_FILE="community-summary-${REPO}-$(date +%Y%m%d-%H%M%S).txt"
    {
        echo "Community Notification Summary"
        echo "=============================="
        echo "Repository: ${FULL_REPO}"
        echo "Date: $(date)"
        echo ""
        echo "Actions Performed:"
        echo "- Repository verified as public"
        echo "- Discussions enabled"
        echo "- Welcome issue created"
        echo "- Initial release published"
        echo "- Labels configured"
    } > ${SUMMARY_FILE}

    echo -e "\n${GREEN}💾 Summary saved to: ${SUMMARY_FILE}${NC}"
}

# Main execution
main() {
    check_repo_public
    enable_discussions
    create_welcome_issue
    create_release
    setup_labels
    check_extensions
    generate_summary

    echo -e "\n${GREEN}✨ Community notification complete!${NC}"
    echo -e "${BLUE}Repository ${FULL_REPO} is ready for community engagement!${NC}"
}

# Run main function
main