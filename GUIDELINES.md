# Development Guidelines: Script Organization

**Effective Date**: 2025-11-07
**Version**: 1.0.0

---

## 📜 Core Principle

**All JavaScript (.js) and TypeScript (.ts) operational/helper scripts should be maintained in the `claude-operations` repository, separate from main project repositories.**

---

## 📍 Repository Structure

**Repository Path**: `/Documents/github/claude-operations/`
**Repository Type**: Operational Scripts Collection

---

## 📁 What Belongs Here

### ✅ **Include:**
- Test analysis and reporting scripts
- MongoDB operation utilities
- Data migration tools
- Build automation helpers
- Debugging and troubleshooting utilities
- Performance analysis tools
- Cleanup and maintenance scripts
- Report generation tools
- Development helper utilities

### ❌ **Exclude:**
- Application source code
- React/Vue/Angular components
- Project-specific configuration files
- Package dependencies
- Production application code
- User interface components

---

## 🎯 Directory Organization

```
claude-operations/
├── test-analysis/       # Test result analyzers
├── mongodb-helpers/     # Database operations
├── build-tools/         # Build automation
├── debugging/           # Debug utilities
├── automation/          # Automation scripts
├── migration/           # Data migration tools
├── reporting/           # Report generators
├── cleanup/             # Cleanup utilities
└── docs/                # Documentation
```

---

## 💡 Usage Examples

### ✅ **Correct Approach:**
```bash
# Generate test analyzer in operations repo
/Documents/github/claude-operations/test-analysis/analyze-results.js

# Create database migration script
/Documents/github/claude-operations/migration/migrate-v2.js
```

### ❌ **Incorrect Approach:**
```bash
# Avoid: Scripts in project repository
/Documents/github/my-project/scripts/test-analyzer.js

# Avoid: Mixed with source code
/Documents/github/my-app/src/utils/db-migration.js
```

---

## 🚀 Benefits

1. **Separation of Concerns**: Keep operational scripts separate from application code
2. **Reusability**: Scripts can be used across multiple projects
3. **Version Control**: Independent versioning for tools and utilities
4. **Cleaner Projects**: Project repositories remain focused on application code
5. **Easy Maintenance**: Centralized location for all operational tools

---

## 📝 Best Practices

1. **Documentation**: Include clear documentation for each script
2. **Environment Variables**: Use `.env` files for configuration
3. **Error Handling**: Implement robust error handling
4. **Logging**: Add appropriate logging for debugging
5. **Testing**: Test scripts before using in production
6. **Modularity**: Create reusable functions and modules

---

## 🔒 Security Considerations

- Never hardcode credentials or sensitive data
- Use environment variables for configuration
- Validate all inputs
- Implement proper error handling
- Review scripts before running in production

---

## 📌 Implementation Checklist

When creating a new operational script:

- [ ] Place in appropriate subdirectory
- [ ] Add comprehensive comments
- [ ] Include usage instructions
- [ ] Use environment variables for config
- [ ] Add error handling
- [ ] Test thoroughly
- [ ] Update documentation
- [ ] Commit with clear message

---

*This guideline helps maintain clean, organized, and maintainable development environments.*