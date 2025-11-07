# GitHub Community Automation Tools

Automated tools for providing community feedback and engagement when repositories go public.

## 🎯 Purpose

When making a repository public, it's important to set up proper community engagement features. These tools automate the process of:

- Enabling GitHub Discussions
- Creating welcome messages
- Setting up issue templates
- Creating initial releases
- Configuring repository labels
- Providing notification summaries

## 🚀 Available Tools

### 1. Bash Script (`notify-public-repo.sh`)

Quick and simple bash script using GitHub CLI directly.

**Usage:**
```bash
./notify-public-repo.sh <owner> <repo>

# Example:
./notify-public-repo.sh JavierCollipal my-new-project
```

**Features:**
- ✅ Checks repository visibility
- ✅ Enables GitHub Discussions via GraphQL
- ✅ Creates welcome issue
- ✅ Publishes initial release
- ✅ Sets up useful labels
- ✅ Generates summary report

### 2. Node.js Script (`github-public-repo-notifier.js`)

Advanced JavaScript implementation with error handling and detailed logging.

**Usage:**
```bash
node github-public-repo-notifier.js <owner> <repo>

# Example:
node github-public-repo-notifier.js JavierCollipal my-new-project
```

**Features:**
- ✅ All features from bash script
- ✅ Better error handling
- ✅ JSON output support
- ✅ Modular design for integration
- ✅ Detailed progress logging

## 📋 Prerequisites

### Required Tools
- **GitHub CLI (`gh`)**: Must be installed and authenticated
  ```bash
  # Install GitHub CLI
  brew install gh  # macOS
  sudo apt install gh  # Ubuntu/Debian

  # Authenticate
  gh auth login
  ```

- **Node.js** (for JavaScript version): Version 14+ recommended
  ```bash
  node --version  # Check if installed
  ```

### Permissions
- Repository admin access
- Ability to create issues, releases, and labels
- GraphQL API access for enabling discussions

## 🔧 Installation

1. **Clone or download the scripts:**
   ```bash
   git clone https://github.com/JavierCollipal/claude-operations.git
   cd claude-operations/community-automation
   ```

2. **Make bash script executable:**
   ```bash
   chmod +x notify-public-repo.sh
   ```

3. **Install Node.js dependencies (if using JS version):**
   ```bash
   npm install
   ```

## 🎯 What Gets Created

When you run either script on a newly public repository:

### 1. GitHub Discussions
- Automatically enabled via GraphQL API
- Allows community Q&A and announcements

### 2. Welcome Issue
- Title: "🎉 Repository Now Public - Welcome to the Community!"
- Contains quick start guide and contribution info
- Tagged with "announcement" and "documentation" labels

### 3. Initial Release
- Version: v1.0.0
- Title: "Initial Public Release"
- Includes getting started instructions
- Links to documentation

### 4. Repository Labels
- `announcement` - For important announcements
- `community` - For community discussions
- `good first issue` - For newcomer-friendly issues
- `help wanted` - For issues needing assistance

### 5. Summary Report
- Saved to file with timestamp
- Contains all actions performed
- Lists next steps and useful commands

## 🌟 Best Practices

### Before Going Public

1. **Review your code** for any sensitive information
2. **Add a LICENSE** file (MIT, Apache 2.0, etc.)
3. **Create a comprehensive README**
4. **Set up .gitignore** properly
5. **Remove hardcoded credentials**

### After Running the Script

1. **Monitor the repository** for initial community response
2. **Respond promptly** to first issues and PRs
3. **Consider adding:**
   - `CODE_OF_CONDUCT.md` - Community guidelines
   - `CONTRIBUTING.md` - Detailed contribution guide
   - `SECURITY.md` - Security policy
   - GitHub Actions workflows for CI/CD

### Community Engagement Tips

- **Be welcoming** to new contributors
- **Label issues** appropriately for discoverability
- **Create milestones** for project roadmap
- **Use GitHub Projects** for task management
- **Enable GitHub Pages** for documentation
- **Set up GitHub Sponsors** if applicable

## 🔍 Monitoring Tools

### Recommended gh Extensions

Install these for better community monitoring:

```bash
# Real-time notifications
gh extension install meiji163/gh-notify

# Dashboard for issues/PRs
gh extension install dlvhdr/gh-dash
```

### Useful Commands

```bash
# List all issues
gh issue list -R owner/repo

# List all pull requests
gh pr list -R owner/repo

# View repository stats
gh api repos/owner/repo | jq '.stargazers_count, .forks_count'

# Check recent activity
gh api repos/owner/repo/events --paginate

# List discussions (if enabled)
gh api repos/owner/repo/discussions
```

## 📊 Example Output

```
🚀 GitHub Community Notifier
Repository: JavierCollipal/my-project

✅ Repository is public!
✅ Discussions enabled
✅ Welcome issue created
✅ Release created
✅ Labels configured

📊 Community Notification Summary
==================================
Repository: JavierCollipal/my-project
Status: PUBLIC
Timestamp: 2025-11-07T18:30:00Z

Actions Performed:
  ✓ Repository status verified
  ✓ Discussions enabled
  ✓ Welcome issue created
  ✓ Initial release published
  ✓ Labels configured

Next Steps:
  • Monitor community feedback
  • Respond to issues and PRs
  • Create CODE_OF_CONDUCT.md
  • Add CONTRIBUTING.md
```

## 🐛 Troubleshooting

### Common Issues

1. **"gh: command not found"**
   - Install GitHub CLI: https://cli.github.com/

2. **"Authentication required"**
   - Run: `gh auth login`

3. **"Repository not found"**
   - Check repository name and owner
   - Ensure you have access to the repository

4. **"Discussions can't be enabled"**
   - Discussions might not be available for your account/org
   - Try enabling manually in repository settings

5. **"Release already exists"**
   - The v1.0.0 tag might already exist
   - Script will continue with other tasks

## 🤝 Contributing

Feel free to enhance these scripts! Some ideas:

- Add Slack/Discord notifications
- Create GitHub Action version
- Add template customization
- Support for organization-wide rollout
- Integration with project management tools

## 📜 License

MIT License - See [LICENSE](../LICENSE) for details.

## 🔗 Resources

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub Discussions Guide](https://docs.github.com/en/discussions)
- [Building Communities on GitHub](https://docs.github.com/en/communities)

---

*Created with community engagement in mind* 🌍✨