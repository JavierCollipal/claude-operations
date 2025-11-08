# 🐾✨ NPM Account Creation & Publishing Guide ✨🐾

## Creating Your NPM Account

### Step 1: Sign Up on NPM Website
1. Go to https://www.npmjs.com/signup
2. Fill in the required fields:
   - **Username**: Choose a unique username (e.g., `neko-arc-dev`)
   - **Email**: Use a valid email address
   - **Password**: Create a strong password
3. Click "Create an Account"
4. Verify your email address

### Step 2: Setup Two-Factor Authentication (Recommended)
1. Go to Account Settings → https://www.npmjs.com/settings/~/profile
2. Click on "Two Factor Authentication"
3. Follow the setup wizard using an authenticator app (Google Authenticator, Authy, etc.)

### Step 3: Login via Terminal
```bash
# Login to NPM from terminal
npm login

# You'll be prompted for:
# Username: <your-npm-username>
# Password: <your-password>
# Email: <your-email>
# One-time password (if 2FA enabled): <your-2fa-code>

# Verify login
npm whoami
```

## Publishing the MCP Six Personalities Package

### Prerequisites
```bash
# Ensure you're in the correct directory
cd /home/wakibaka/Documents/github/claude-operations/mcp-six-personalities

# Install dependencies
npm install

# Run tests (if available)
npm test
```

### Publishing Steps

#### Option 1: Interactive Publishing Script
```bash
# Use our helper script
chmod +x publish.sh
./publish.sh
```

#### Option 2: Manual Publishing
```bash
# 1. Check if package name is available
npm view mcp-six-personalities

# 2. Dry run (simulate publish without actually publishing)
npm publish --dry-run

# 3. Publish to NPM (public package)
npm publish --access public

# 4. Verify publication
npm info mcp-six-personalities
```

### Post-Publishing

#### For Users to Install
Once published, users can install globally:
```bash
npm install -g mcp-six-personalities
```

#### Configure Claude Desktop
Users need to add to their Claude Desktop config:
```json
{
  "mcpServers": {
    "six-personalities": {
      "command": "mcp-six-personalities"
    }
  }
}
```

Location depends on OS:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Package Maintenance

### Version Updates
```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major

# Publish update
npm publish
```

### View Package Info
```bash
# View your published packages
npm ls --depth=0 -g

# View package details
npm info mcp-six-personalities

# View all versions
npm view mcp-six-personalities versions
```

### Deprecating Versions (if needed)
```bash
# Deprecate a specific version
npm deprecate mcp-six-personalities@1.0.0 "Critical bug found, please update"
```

## Troubleshooting

### Common Issues

1. **"You do not have permission to publish"**
   - Solution: Package name might be taken, try different name
   - Or: Not logged in, run `npm login`

2. **"Package name too similar to existing packages"**
   - Solution: Choose more unique name
   - Consider: `@username/package-name` (scoped package)

3. **"E402 Payment Required"**
   - Solution: Private packages require paid account
   - Use: `--access public` for free public packages

4. **"Version already exists"**
   - Solution: Bump version with `npm version patch`
   - Then republish

## Security Best Practices

1. ✅ Enable 2FA on NPM account
2. ✅ Use npm token for CI/CD (not password)
3. ✅ Regularly audit dependencies: `npm audit`
4. ✅ Never publish with sensitive data (.env files)
5. ✅ Add `.npmignore` for files not to publish
6. ✅ Review package contents before publishing

## Support & Documentation

- NPM Docs: https://docs.npmjs.com/
- MCP SDK: https://modelcontextprotocol.io/docs
- Issues: https://github.com/YourUsername/mcp-six-personalities/issues

---

## Quick Start Checklist

- [ ] Created NPM account
- [ ] Verified email
- [ ] Setup 2FA (optional but recommended)
- [ ] Logged in via terminal (`npm login`)
- [ ] Tested package locally
- [ ] Published to NPM
- [ ] Tested installation (`npm install -g mcp-six-personalities`)
- [ ] Configured Claude Desktop
- [ ] Verified MCP server works

Nyaa~! Your MCP server is ready to share with the world, desu~! 🐾✨