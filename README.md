# Claude Operations

A collection of operational scripts and development tools for various software projects.

## 📋 Purpose

This repository contains helper scripts, analysis tools, and automation utilities used across multiple development projects. These tools are designed to assist with:

- Test result analysis and reporting
- Build automation and deployment
- Database operations and migrations
- Code quality monitoring
- Performance analysis

## 🚀 Features

- **Test Analysis Tools**: Comprehensive test result analyzers for various testing frameworks
- **MongoDB Integration**: Scripts for database operations with MongoDB Atlas
- **Multi-Framework Support**: Works with Jest, Cypress, ESLint, Prettier, and more
- **Automated Reporting**: Generate detailed reports with actionable insights
- **Environment-Agnostic**: Configurable via environment variables

## 📁 Structure

```
claude-operations/
├── test-analysis/      # Test result analysis scripts
├── mongodb-helpers/    # MongoDB operation scripts
├── build-tools/        # Build and deployment helpers
├── debugging/          # Debugging utilities
├── automation/         # Automation scripts
└── reporting/          # Report generators
```

## 🔧 Setup

1. **Clone the repository:**
```bash
git clone https://github.com/JavierCollipal/claude-operations.git
cd claude-operations
```

2. **Install dependencies (if needed):**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.template .env
# Edit .env with your configuration
```

4. **Run a script:**
```bash
node test-analysis/neko-defense-dashboard-test-results.js
```

## 📝 Configuration

Copy `.env.template` to `.env` and configure:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `DEFAULT_DATABASE`: Default database name for operations
- `NODE_ENV`: Environment (development/production)

## 🛠️ Available Scripts

### Test Analysis
- `test-analysis/neko-defense-dashboard-test-results.js`: Analyzes test results from Next.js projects

### MongoDB Helpers
- Coming soon: Database migration and backup scripts

### Build Tools
- Coming soon: Build optimization and deployment scripts

## 🤝 Contributing

This is primarily a personal tool collection, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📜 License

MIT License - See LICENSE file for details

## 🔒 Security

- Never commit `.env` files or credentials
- Use environment variables for sensitive data
- Review scripts before running in production environments

## 📧 Contact

For questions or issues, please open a GitHub issue in this repository.

---

*Development tools for enhanced productivity and code quality*