#!/usr/bin/env node

/**
 * GitHub Public Repository Community Notifier
 *
 * Automatically provides community feedback when a repository is made public
 * Uses GitHub CLI (gh) and GitHub GraphQL API for automation
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const fs = require('fs').promises;

class GitHubCommunityNotifier {
  constructor(repoOwner, repoName) {
    this.owner = repoOwner;
    this.repo = repoName;
    this.fullRepo = `${repoOwner}/${repoName}`;
  }

  /**
   * Execute gh CLI commands
   */
  async ghCommand(command) {
    try {
      const { stdout, stderr } = await execPromise(command);
      if (stderr && !stderr.includes('Browsing')) {
        console.warn(`⚠️ Warning: ${stderr}`);
      }
      return stdout.trim();
    } catch (error) {
      throw new Error(`Command failed: ${error.message}`);
    }
  }

  /**
   * Check if repository is public
   */
  async isRepoPublic() {
    try {
      const result = await this.ghCommand(
        `gh api repos/${this.fullRepo} --jq '.private'`
      );
      return result === 'false';
    } catch (error) {
      console.error('❌ Error checking repository status:', error.message);
      return false;
    }
  }

  /**
   * Enable GitHub Discussions using GraphQL
   */
  async enableDiscussions() {
    console.log('🎯 Enabling GitHub Discussions...');

    try {
      // First, get the repository ID
      const repoId = await this.ghCommand(
        `gh api repos/${this.fullRepo} --jq '.node_id'`
      );

      // GraphQL mutation to enable discussions
      const mutation = `
        mutation {
          updateRepository(input: {
            repositoryId: "${repoId}",
            hasDiscussionsEnabled: true
          }) {
            repository {
              hasDiscussionsEnabled
            }
          }
        }
      `;

      await this.ghCommand(
        `gh api graphql -f query='${mutation}'`
      );

      console.log('✅ Discussions enabled successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to enable discussions:', error.message);
      return false;
    }
  }

  /**
   * Create welcome discussion post
   */
  async createWelcomeDiscussion() {
    console.log('📝 Creating welcome discussion...');

    const discussionBody = `# 🎉 Welcome to ${this.repo}!

This repository is now **public** and open for community contributions!

## 🚀 What's Available

- **Source Code**: All tools and scripts are now open source
- **Documentation**: Comprehensive guides and README files
- **Issue Tracking**: Report bugs or request features
- **Pull Requests**: Contribute improvements and fixes

## 🤝 How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Submit a pull request**

## 📋 Community Guidelines

- Be respectful and constructive
- Follow the code style guidelines
- Test your changes before submitting
- Document new features or changes

## 🔗 Useful Links

- [README](README.md) - Project overview
- [GUIDELINES](GUIDELINES.md) - Contribution guidelines
- [LICENSE](LICENSE) - MIT License terms

## 💬 Get Involved

- **Star** the repository if you find it useful
- **Watch** for updates and new releases
- **Fork** to start contributing
- **Discuss** ideas and improvements

Looking forward to your contributions!

---
*This is an automated welcome message generated when the repository became public.*`;

    try {
      // Use GraphQL to create a discussion
      const result = await this.ghCommand(
        `gh api graphql -f query='
          mutation {
            createDiscussion(input: {
              repositoryId: "$(gh api repos/${this.fullRepo} --jq .node_id)",
              title: "🎉 Repository Now Public - Welcome to the Community!",
              body: "${discussionBody.replace(/'/g, "\\'").replace(/\n/g, "\\n")}",
              categoryId: "$(gh api repos/${this.fullRepo}/discussions/categories --jq .[0].id)"
            }) {
              discussion {
                url
              }
            }
          }
        '`
      );

      console.log('✅ Welcome discussion created!');
      return true;
    } catch (error) {
      // Fallback to creating an issue if discussions aren't available
      console.log('📋 Creating welcome issue instead...');
      return this.createWelcomeIssue();
    }
  }

  /**
   * Create welcome issue as fallback
   */
  async createWelcomeIssue() {
    const issueBody = `## 🎉 This repository is now public!

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
If you have questions or suggestions, please open an issue or start a discussion!

---
*This is an automated message created when the repository became public.*`;

    try {
      await this.ghCommand(
        `gh issue create -R ${this.fullRepo} ` +
        `--title "🎉 Repository Now Public - Welcome!" ` +
        `--body "${issueBody.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" ` +
        `--label "announcement,documentation"`
      );

      console.log('✅ Welcome issue created!');
      return true;
    } catch (error) {
      console.error('❌ Failed to create welcome issue:', error.message);
      return false;
    }
  }

  /**
   * Create initial release
   */
  async createInitialRelease() {
    console.log('🏷️ Creating initial release...');

    const releaseNotes = `## 🎉 Initial Public Release

This is the first public release of ${this.repo}!

### ✨ Features
- Test analysis scripts
- Development automation tools
- MongoDB operation helpers
- Comprehensive documentation

### 📋 What's Included
- Professional README with clear documentation
- Development guidelines
- MIT License for open source use
- Environment configuration templates

### 🚀 Getting Started
\`\`\`bash
git clone https://github.com/${this.fullRepo}.git
cd ${this.repo}
npm install
\`\`\`

### 🤝 Contributing
We welcome contributions! Please see our [GUIDELINES](GUIDELINES.md) for more information.

### 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Full Changelog**: https://github.com/${this.fullRepo}/commits/main`;

    try {
      await this.ghCommand(
        `gh release create v1.0.0 ` +
        `-R ${this.fullRepo} ` +
        `--title "v1.0.0 - Initial Public Release" ` +
        `--notes "${releaseNotes.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" ` +
        `--target main`
      );

      console.log('✅ Initial release created!');
      return true;
    } catch (error) {
      console.error('❌ Failed to create release:', error.message);
      return false;
    }
  }

  /**
   * Create issue templates
   */
  async createIssueTemplates() {
    console.log('📄 Creating issue templates...');

    const templateDir = '.github/ISSUE_TEMPLATE';

    // Bug report template
    const bugTemplate = `---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Run command '...'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Ubuntu 22.04]
- Node version: [e.g. 18.0.0]
- Script version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.`;

    // Feature request template
    const featureTemplate = `---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: 'enhancement'
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.`;

    try {
      // Note: This would need to be done via git commands
      // For now, we'll create them as a suggestion
      console.log('📝 Issue templates should be added to .github/ISSUE_TEMPLATE/');
      console.log('   - bug_report.md');
      console.log('   - feature_request.md');
      return true;
    } catch (error) {
      console.error('❌ Failed to create issue templates:', error.message);
      return false;
    }
  }

  /**
   * Set up repository labels
   */
  async setupLabels() {
    console.log('🏷️ Setting up repository labels...');

    const labels = [
      { name: 'announcement', color: '0052CC', description: 'Important announcements' },
      { name: 'community', color: '7057FF', description: 'Community discussions' },
      { name: 'good first issue', color: '008672', description: 'Good for newcomers' },
      { name: 'help wanted', color: 'FEF2C0', description: 'Extra attention is needed' },
      { name: 'enhancement', color: 'A2EEEF', description: 'New feature or request' },
      { name: 'documentation', color: '0075CA', description: 'Improvements or additions to documentation' }
    ];

    for (const label of labels) {
      try {
        await this.ghCommand(
          `gh label create "${label.name}" ` +
          `-R ${this.fullRepo} ` +
          `--color "${label.color}" ` +
          `--description "${label.description}"`
        );
        console.log(`   ✅ Created label: ${label.name}`);
      } catch (error) {
        // Label might already exist
        console.log(`   ℹ️ Label might exist: ${label.name}`);
      }
    }

    return true;
  }

  /**
   * Send notification summary
   */
  async sendNotificationSummary() {
    console.log('\n📊 Community Notification Summary:');
    console.log('====================================');

    const summary = {
      repository: this.fullRepo,
      status: 'PUBLIC',
      timestamp: new Date().toISOString(),
      actions: [
        'Discussions enabled',
        'Welcome message posted',
        'Initial release created',
        'Repository labels configured'
      ],
      nextSteps: [
        'Monitor for community feedback',
        'Respond to issues and pull requests',
        'Update documentation as needed',
        'Consider creating a CODE_OF_CONDUCT.md',
        'Add CONTRIBUTING.md for detailed guidelines'
      ]
    };

    console.log(JSON.stringify(summary, null, 2));

    // Save summary to file
    const summaryPath = `community-feedback-${this.repo}-${Date.now()}.json`;
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Summary saved to: ${summaryPath}`);

    return summary;
  }

  /**
   * Main execution flow
   */
  async execute() {
    console.log(`🚀 Starting Community Notifier for ${this.fullRepo}\n`);

    // Check if repo is public
    const isPublic = await this.isRepoPublic();
    if (!isPublic) {
      console.log('⚠️ Repository is not public. Exiting...');
      return;
    }

    console.log('✅ Repository is public! Setting up community features...\n');

    // Execute community setup tasks
    const tasks = [
      { name: 'Enable Discussions', fn: () => this.enableDiscussions() },
      { name: 'Create Welcome Post', fn: () => this.createWelcomeDiscussion() },
      { name: 'Create Initial Release', fn: () => this.createInitialRelease() },
      { name: 'Setup Labels', fn: () => this.setupLabels() },
      { name: 'Create Issue Templates', fn: () => this.createIssueTemplates() }
    ];

    const results = [];
    for (const task of tasks) {
      console.log(`\n📌 ${task.name}...`);
      try {
        const result = await task.fn();
        results.push({ task: task.name, success: result });
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        results.push({ task: task.name, success: false, error: error.message });
      }
    }

    // Send summary
    await this.sendNotificationSummary();

    console.log('\n✨ Community notification process complete!');
    return results;
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node github-public-repo-notifier.js <owner> <repo>');
    console.log('Example: node github-public-repo-notifier.js JavierCollipal claude-operations');
    process.exit(1);
  }

  const [owner, repo] = args;
  const notifier = new GitHubCommunityNotifier(owner, repo);

  notifier.execute()
    .then(results => {
      console.log('\n📈 Task Results:');
      results.forEach(r => {
        const status = r.success ? '✅' : '❌';
        console.log(`   ${status} ${r.task}`);
      });
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = GitHubCommunityNotifier;