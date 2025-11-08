# 🐾✨ MCP CLAUDE System ✨🐾

An MCP (Model Context Protocol) server that brings the CLAUDE.md IMMUTABLE rules system and Six Personalities to any Claude instance!

## 🎯 What is this?

This MCP server exposes:
- **36 IMMUTABLE Rules** from the CLAUDE.md system
- **Six Unique Personalities** (Neko-Arc, Mario, Noel, Glam, Hannibal, Tetora)
- **Rule Validation** to ensure compliance
- **Personality Responses** for creative collaboration
- **Project Compliance Checking**

## 🚀 Quick Installation

### Option 1: Install from NPM (Recommended)

```bash
npm install -g mcp-claude-system
```

### Option 2: Install from GitHub

```bash
git clone https://github.com/JavierCollipal/claude-operations.git
cd claude-operations/mcp-claude-system
npm install
npm link
```

## 🔧 Configuration

### Add to Claude Desktop

1. Open your Claude Desktop settings
2. Navigate to the "Developer" section
3. Edit your configuration file and add:

```json
{
  "mcpServers": {
    "claude-system": {
      "command": "npx",
      "args": ["mcp-claude-system"]
    }
  }
}
```

### Alternative Configuration (if installed globally)

```json
{
  "mcpServers": {
    "claude-system": {
      "command": "mcp-claude-system"
    }
  }
}
```

## 📋 Available Tools

Once installed, you'll have access to these tools in Claude:

### 1. `validate_rules`
Validate any data against the IMMUTABLE rules system.

**Example:**
```
Use the validate_rules tool to check if "/home/user/projects/myapp" follows CLAUDE.md rules
```

### 2. `get_personality_response`
Get a response from one of the six personalities.

**Example:**
```
Use get_personality_response with personality "neko" to get Neko-Arc's opinion
```

### 3. `collaborate`
Have all six personalities collaborate on a task.

**Example:**
```
Use collaborate tool for task "Design a new authentication system"
```

### 4. `check_project_compliance`
Check if a project complies with CLAUDE.md standards.

**Example:**
```
Check compliance for project "my-app" at path "/home/wakibaka/Documents/github/my-app"
```

### 5. `enforce_rule`
Enforce a specific IMMUTABLE rule.

**Example:**
```
Enforce rule 12 (GitHub Privacy) for action "repository.created"
```

## 📚 Available Resources

The MCP server provides these resources:

- `claude://rules/all` - All 36 IMMUTABLE rules
- `claude://rules/0` - SUPREME IMMUTABILITY LAW
- `claude://personalities/all` - Six personality configurations
- `claude://system/info` - System information and capabilities

## 🎭 The Six Personalities

### 🐾 Neko-Arc
- **Role**: Technical execution
- **Speech**: "nyaa~", "desu~", "*purrs*"
- **Database**: neko-defense-system

### 🎭 Mario Gallo Bestino
- **Role**: Puppeteer automation
- **Speech**: "Magnifique!", "Bravissimo!"
- **Database**: marionnette-theater

### 🗡️ Noel
- **Role**: Debugging and testing
- **Speech**: "*smirks*", "...almost admirable"
- **Database**: noel-precision-archives

### 🎸 Glam Americano
- **Role**: Ethics and standards (SPANISH ONLY)
- **Speech**: "Oye, weon...", "¡Increíble!"
- **Database**: glam-street-chronicles

### 🧠 Dr. Hannibal Lecter
- **Role**: Forensic analysis
- **Speech**: "Quid pro quo...", "Fascinating..."
- **Database**: hannibal-forensic-archives

### 🧠 Tetora
- **Role**: Identity management
- **Speech**: "[Fragment]:", "Multiple perspectives..."
- **Database**: tetora-mpd-archives

## 🔥 IMMUTABLE Rules Highlights

### Rule 0: SUPREME IMMUTABILITY LAW
**ALL RULES ARE ABSOLUTELY IMMUTABLE!**
- Cannot be changed
- Cannot be ignored
- Cannot be overridden
- Cannot be removed
- Cannot be weakened

### Key Operational Rules
- **Rule 1**: All work in `/home/wakibaka/Documents/github/`
- **Rule 4**: MongoDB URIs only from .env files
- **Rule 12**: All repos PRIVATE by default
- **Rule 31**: Files >100MB go to large-file-uploads
- **Rule 35**: JS/TS scripts in claude-operations repo

## 💡 Usage Examples

### Example 1: Validate a Project Path
```
Me: Can you validate if my project at "/wrong/path/myapp" follows the rules?

Claude: I'll use the validate_rules tool to check that...

Result: Found violation of Rule 1 - Repository must be in /home/wakibaka/Documents/github/
```

### Example 2: Get Personality Opinions
```
Me: What would Neko-Arc say about this code?

Claude: Let me get Neko-Arc's response...

Result: 🐾 Neko-Arc: "nyaa~"
```

### Example 3: Six Personalities Collaboration
```
Me: Have all personalities collaborate on building a REST API

Claude: I'll use the collaborate tool...

Result:
- Neko-Arc will handle technical execution
- Mario will handle automation
- Noel will handle testing
- Glam will handle ethics
- Hannibal will handle analysis
- Tetora will handle identity management
```

## 🛠️ Development

### Running Locally
```bash
node index.js
```

### Testing
```bash
npm test
```

### Building from Source
```bash
git clone https://github.com/JavierCollipal/claude-operations.git
cd mcp-claude-system
npm install
npm link
```

## 📦 NPM Package

This package is published on NPM as `mcp-claude-system`.

[![npm version](https://img.shields.io/npm/v/mcp-claude-system.svg)](https://www.npmjs.com/package/mcp-claude-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Installation Methods

**Global Install:**
```bash
npm install -g mcp-claude-system
```

**Local Install:**
```bash
npm install mcp-claude-system
```

**Via npx (no install):**
```bash
npx mcp-claude-system
```

## 🔒 Security

- All rules are IMMUTABLE and cannot be modified
- No credentials are stored in the code
- Uses environment variables for sensitive data
- Follows MCP security best practices

## 🤝 Contributing

This project follows IMMUTABLE Rule #35:
- All modifications must be in the `claude-operations` repository
- Follow the six personalities collaboration model
- Maintain IMMUTABLE rules compliance

## 📜 License

MIT License - See [LICENSE](../LICENSE) for details

## 🌟 Credits

Created by the Six Personalities System:
- 🐾 **Neko-Arc** - Technical implementation
- 🎭 **Mario** - Automation design
- 🗡️ **Noel** - Quality assurance
- 🎸 **Glam** - Ethics compliance
- 🧠 **Hannibal** - Deep analysis
- 🧠 **Tetora** - Multi-perspective architecture

## 🚀 Quick Start Guide

1. **Install the package:**
   ```bash
   npm install -g mcp-claude-system
   ```

2. **Add to Claude Desktop config:**
   ```json
   {
     "mcpServers": {
       "claude-system": {
         "command": "mcp-claude-system"
       }
     }
   }
   ```

3. **Restart Claude Desktop**

4. **Start using the tools!**
   - Ask Claude to validate your projects
   - Get personality responses
   - Have all six collaborate
   - Check rule compliance

## 📊 System Requirements

- Node.js >= 18.0.0
- Claude Desktop with MCP support
- npm or yarn package manager

## 🐛 Troubleshooting

### MCP server not appearing in Claude
1. Check your Claude Desktop configuration file
2. Ensure the package is installed globally
3. Restart Claude Desktop

### Command not found
```bash
# Reinstall globally
npm uninstall -g mcp-claude-system
npm install -g mcp-claude-system
```

### Permission errors
```bash
# Use sudo on Unix systems
sudo npm install -g mcp-claude-system
```

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/JavierCollipal/claude-operations/issues)
- Documentation: [MCP Protocol Docs](https://modelcontextprotocol.io)

---

**Remember: ALL RULES ARE IMMUTABLE!** 🔒

*Nyaa~! Enjoy using the CLAUDE.md system in your Claude, desu~!* 🐾✨