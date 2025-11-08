#!/bin/bash

# NEKO-ARC NETWORK SECURITY AUDIT LAUNCHER
# IMMUTABLE RULE 36 IMPLEMENTATION
# Automated vulnerability detection and reporting

echo "🐾 NEKO-ARC NETWORK SECURITY AUDIT SYSTEM 🐾"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Version: 1.0.0 - IMMUTABLE RULE 36"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if running in correct directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --quiet
fi

# Validate TypeScript file
echo "✅ Validating TypeScript configuration..."
npx tsc --noEmit network-security-scanner.ts 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ TypeScript validation failed!"
    echo "🔧 Attempting to fix and compile..."
    npx tsc network-security-scanner.ts
fi

# Run the security audit
echo ""
echo "🔍 Starting Network Security Audit..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Execute the audit with ts-node
npx ts-node network-security-scanner.ts

# Check if audit completed successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✨ Audit completed successfully, nyaa~! ✨"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Show the latest report location
    LATEST_REPORT=$(ls -t /home/wakibaka/Documents/github/network-security-audit-*.md 2>/dev/null | head -1)
    if [ -n "$LATEST_REPORT" ]; then
        echo "📄 Report saved at: $LATEST_REPORT"
        echo ""
        echo "🔒 Quick Summary:"
        grep "Security Score:" "$LATEST_REPORT" | head -1
        grep "CRITICAL" "$LATEST_REPORT" | head -3
    fi
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ Audit failed! Check the error messages above."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

echo ""
echo "🐾 NEKO-ARC says: Stay secure, wakibaka! 🐾"