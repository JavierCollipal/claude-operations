# 🎭✨ MCP Six Personalities ✨🎭

An MCP (Model Context Protocol) server that brings six unique AI personalities to your Claude Desktop for creative multi-perspective collaboration and problem-solving!

## 🎯 What is this?

This MCP server provides:
- **Six Unique Personalities** (Neko-Arc, Mario, Noel, Glam, Hannibal, Tetora)
- **Creative Collaboration** between different perspectives
- **Personality-Specific Responses** for varied insights
- **Multi-Perspective Problem Solving**
- **Dynamic Personality Interactions**

## 🚀 Quick Installation

### Option 1: Install from NPM (Recommended)

```bash
npm install -g mcp-six-personalities
```

### Option 2: Install from GitHub

```bash
git clone https://github.com/YourUsername/mcp-six-personalities.git
cd mcp-six-personalities
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
    "six-personalities": {
      "command": "npx",
      "args": ["mcp-six-personalities"]
    }
  }
}
```

### Alternative Configuration (if installed globally)

```json
{
  "mcpServers": {
    "six-personalities": {
      "command": "mcp-six-personalities"
    }
  }
}
```

## 📋 Available Tools

Once installed, you'll have access to these tools in Claude:

### 1. `get_personality_response`
Get a response from one of the six personalities.

**Example:**
```
Use get_personality_response with personality "neko" to get Neko-Arc's technical opinion
```

### 2. `collaborate`
Have all six personalities collaborate on a task.

**Example:**
```
Use collaborate tool for task "Design a new authentication system"
```

### 3. `personality_analyze`
Get in-depth analysis from a specific personality.

**Example:**
```
Have Hannibal analyze the architecture patterns in this codebase
```

### 4. `personality_debate`
Have personalities debate different approaches.

**Example:**
```
Start a debate between Noel and Mario about UI design principles
```

### 5. `multi_perspective`
Get multiple perspectives on a problem.

**Example:**
```
Get multi_perspective analysis on "How to optimize database queries"
```

## 📚 Available Resources

The MCP server provides these resources:

- `personalities://all` - All six personality configurations
- `personalities://neko` - Neko-Arc's profile and capabilities
- `personalities://mario` - Mario's theatrical expertise
- `personalities://noel` - Noel's critical analysis methods
- `personalities://glam` - Glam's street-smart perspective
- `personalities://hannibal` - Hannibal's forensic approach
- `personalities://tetora` - Tetora's multi-perspective framework

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

## 🌟 Key Features

### Personality-Driven Development
Each personality brings unique strengths:
- **Technical Excellence** with Neko-Arc's implementation skills
- **Creative Vision** through Mario's theatrical approach
- **Quality Assurance** via Noel's critical analysis
- **Ethical Considerations** from Glam's street-smart perspective
- **Deep Analysis** with Hannibal's forensic methods
- **Multiple Viewpoints** through Tetora's fragmented consciousness

## 💡 Usage Examples

### Example 1: Get Technical Opinion
```
Me: What would Neko-Arc think about this React architecture?

Claude: Let me get Neko-Arc's response...

Result: 🐾 Neko-Arc: "Nyaa~! This component hierarchy is purrfect for scalability, desu~!
The state management could use some optimization though! *swishes tail*"
```

### Example 2: Creative Problem Solving
```
Me: Have Mario and Noel debate the best UI approach for our app

Claude: Starting a personality debate...

Result:
🎭 Mario: "Magnifique! We need dramatic animations and theatrical transitions!"
🗡️ Noel: "*smirks* Predictable. Users need efficiency, not a Broadway show."
```

### Example 3: Six Personalities Collaboration
```
Me: Have all personalities collaborate on building a REST API

Claude: Initiating full collaboration...

Result:
🐾 Neko-Arc: "I'll implement the core Express.js server, nyaa~!"
🎭 Mario: "I shall orchestrate the middleware like a grand performance!"
🗡️ Noel: "I'll write comprehensive tests... someone has to ensure quality."
🎸 Glam: "¡Oye! I'll handle authentication and security, hermano!"
🧠 Hannibal: "I'll analyze the data flow patterns... fascinating architecture."
🧠 Tetora: "[Fragment A]: API versioning [Fragment B]: Error handling..."
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
git clone https://github.com/YourUsername/mcp-six-personalities.git
cd mcp-six-personalities
npm install
npm link
```

## 📦 NPM Package

This package is published on NPM as `mcp-six-personalities`.

[![npm version](https://img.shields.io/npm/v/mcp-six-personalities.svg)](https://www.npmjs.com/package/mcp-six-personalities)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### Installation Methods

**Global Install:**
```bash
npm install -g mcp-six-personalities
```

**Local Install:**
```bash
npm install mcp-six-personalities
```

**Via npx (no install):**
```bash
npx mcp-six-personalities
```

## 🔒 Security

- No credentials or personal data stored in code
- Environment variables for sensitive configuration
- Follows MCP security best practices
- Personality data processed locally
- No external API dependencies

## 🤝 Contributing

We welcome contributions! Please:
- Fork the repository
- Create a feature branch
- Follow the six personalities collaboration model in your PR description
- Submit a pull request with clear description

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
   npm install -g mcp-six-personalities
   ```

2. **Add to Claude Desktop config:**
   ```json
   {
     "mcpServers": {
       "six-personalities": {
         "command": "mcp-six-personalities"
       }
     }
   }
   ```

3. **Restart Claude Desktop**

4. **Start using the personalities!**
   - Get unique perspectives from each personality
   - Have personalities collaborate on complex tasks
   - Start debates between different viewpoints
   - Leverage multi-perspective problem solving

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
npm uninstall -g mcp-six-personalities
npm install -g mcp-six-personalities
```

### Permission errors
```bash
# Use sudo on Unix systems
sudo npm install -g mcp-six-personalities
```

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/YourUsername/mcp-six-personalities/issues)
- Documentation: [MCP Protocol Docs](https://modelcontextprotocol.io)

---

**Experience the power of six unique perspectives!** 🎭

*Nyaa~! Enjoy collaborating with all six personalities, desu~!* 🐾✨