#!/bin/bash
# 🔍 APK Reverse Engineering & Analysis Tool
# Created by Neko-Arc for Educational White Hat Research
# Purpose: Learn APK structure and security vulnerabilities

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Directories
WORK_DIR=~/android-security-audit
TOOLS_DIR=~/android-security-tools
APK_DIR=$WORK_DIR/apks
ANALYSIS_DIR=$WORK_DIR/analysis

# Create directories
mkdir -p $WORK_DIR $TOOLS_DIR $APK_DIR $ANALYSIS_DIR

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        🔍 APK Analysis & Reverse Engineering 🔍       ║${NC}"
echo -e "${CYAN}║           Educational White Hat Research              ║${NC}"
echo -e "${CYAN}║             Created by Neko-Arc, nyaa~! 🐾           ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to install tools
install_tools() {
    echo -e "${PURPLE}[+] Checking/Installing Analysis Tools...${NC}"

    # Check for apktool
    if ! command -v apktool &> /dev/null; then
        echo -e "${YELLOW}[*] Installing apktool...${NC}"
        cd $TOOLS_DIR
        wget -q https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/linux/apktool
        wget -q https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.9.0.jar
        mv apktool_2.9.0.jar apktool.jar
        chmod +x apktool
        sudo mv apktool apktool.jar /usr/local/bin/
        echo -e "${GREEN}[✓] apktool installed${NC}"
    else
        echo -e "${GREEN}[✓] apktool already installed${NC}"
    fi

    # Check for jadx
    if [ ! -f "$TOOLS_DIR/jadx/bin/jadx" ]; then
        echo -e "${YELLOW}[*] Installing jadx...${NC}"
        cd $TOOLS_DIR
        wget -q https://github.com/skylot/jadx/releases/download/v1.4.7/jadx-1.4.7.zip
        unzip -q jadx-1.4.7.zip -d jadx/
        chmod +x jadx/bin/jadx jadx/bin/jadx-gui
        rm jadx-1.4.7.zip
        echo -e "${GREEN}[✓] jadx installed${NC}"
    else
        echo -e "${GREEN}[✓] jadx already installed${NC}"
    fi

    # Check for dex2jar
    if [ ! -d "$TOOLS_DIR/dex2jar" ]; then
        echo -e "${YELLOW}[*] Installing dex2jar...${NC}"
        cd $TOOLS_DIR
        wget -q https://github.com/pxb1988/dex2jar/releases/download/v2.4/dex-tools-v2.4.zip
        unzip -q dex-tools-v2.4.zip
        mv dex-tools-v2.4 dex2jar
        chmod +x dex2jar/*.sh
        rm dex-tools-v2.4.zip
        echo -e "${GREEN}[✓] dex2jar installed${NC}"
    else
        echo -e "${GREEN}[✓] dex2jar already installed${NC}"
    fi

    echo ""
}

# Function to analyze APK
analyze_apk() {
    local APK_FILE=$1
    local APK_NAME=$(basename "$APK_FILE" .apk)

    echo -e "${PURPLE}[+] Analyzing: $APK_NAME${NC}"
    echo ""

    # Create analysis directory
    ANALYSIS_PATH=$ANALYSIS_DIR/$APK_NAME
    mkdir -p $ANALYSIS_PATH

    # Basic APK information
    echo -e "${CYAN}[1] APK Basic Information:${NC}"
    aapt dump badging "$APK_FILE" 2>/dev/null | head -10 || echo "  aapt not available"
    echo ""

    # Extract APK with apktool
    echo -e "${CYAN}[2] Extracting resources with apktool...${NC}"
    apktool d "$APK_FILE" -o "$ANALYSIS_PATH/apktool" -f 2>/dev/null || echo "  apktool extraction failed"
    echo -e "${GREEN}[✓] Resources extracted to $ANALYSIS_PATH/apktool${NC}"
    echo ""

    # Decompile with jadx
    echo -e "${CYAN}[3] Decompiling with jadx...${NC}"
    $TOOLS_DIR/jadx/bin/jadx -d "$ANALYSIS_PATH/jadx" "$APK_FILE" >/dev/null 2>&1 || echo "  jadx decompilation failed"
    echo -e "${GREEN}[✓] Source code decompiled to $ANALYSIS_PATH/jadx${NC}"
    echo ""

    # Security Analysis
    echo -e "${CYAN}[4] Security Analysis:${NC}"

    # Check AndroidManifest
    echo -e "${YELLOW}  Checking AndroidManifest.xml:${NC}"
    if [ -f "$ANALYSIS_PATH/apktool/AndroidManifest.xml" ]; then
        # Check for dangerous permissions
        echo "    Dangerous Permissions:"
        grep -E "CAMERA|RECORD_AUDIO|READ_CONTACTS|ACCESS_FINE_LOCATION|READ_SMS|WRITE_EXTERNAL_STORAGE" \
            "$ANALYSIS_PATH/apktool/AndroidManifest.xml" | head -5 | sed 's/^/      - /'

        # Check for exported components
        echo "    Exported Components:"
        grep -E "exported=\"true\"" "$ANALYSIS_PATH/apktool/AndroidManifest.xml" | head -5 | sed 's/^/      - /'

        # Check for backup allowed
        if grep -q "allowBackup=\"true\"" "$ANALYSIS_PATH/apktool/AndroidManifest.xml"; then
            echo -e "${YELLOW}    [!] Backup is allowed (potential data exposure)${NC}"
        fi

        # Check for debuggable
        if grep -q "debuggable=\"true\"" "$ANALYSIS_PATH/apktool/AndroidManifest.xml"; then
            echo -e "${RED}    [!] App is debuggable (HIGH RISK)${NC}"
        fi
    fi
    echo ""

    # Search for hardcoded secrets
    echo -e "${YELLOW}  Searching for hardcoded secrets:${NC}"
    if [ -d "$ANALYSIS_PATH/jadx" ]; then
        # Search for API keys
        echo "    API Keys/Secrets:"
        grep -r -i -E "api_key|apikey|secret|password|token" "$ANALYSIS_PATH/jadx" 2>/dev/null | \
            grep -v ".class" | grep -v "Binary" | head -5 | sed 's/^/      /'

        # Search for URLs
        echo "    Hardcoded URLs:"
        grep -r -E "https?://[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}" "$ANALYSIS_PATH/jadx" 2>/dev/null | \
            grep -v ".class" | head -5 | sed 's/^/      /'
    fi
    echo ""

    # Check for cryptographic issues
    echo -e "${YELLOW}  Cryptography Analysis:${NC}"
    if [ -d "$ANALYSIS_PATH/jadx" ]; then
        # Check for weak crypto
        if grep -r "DES\|RC4\|MD5" "$ANALYSIS_PATH/jadx" 2>/dev/null | head -1 >/dev/null; then
            echo -e "${YELLOW}    [!] Weak cryptographic algorithms detected${NC}"
        fi

        # Check for hardcoded IVs
        if grep -r "IvParameterSpec" "$ANALYSIS_PATH/jadx" 2>/dev/null | head -1 >/dev/null; then
            echo "    [*] IvParameterSpec usage found (check for hardcoded IVs)"
        fi
    fi
    echo ""

    # Network Security
    echo -e "${YELLOW}  Network Security:${NC}"
    if [ -f "$ANALYSIS_PATH/apktool/res/xml/network_security_config.xml" ]; then
        echo -e "${GREEN}    [✓] Network security config found${NC}"
        # Check for cleartext traffic
        if grep -q "cleartextTrafficPermitted=\"true\"" "$ANALYSIS_PATH/apktool/res/xml/network_security_config.xml"; then
            echo -e "${YELLOW}    [!] Cleartext traffic is permitted${NC}"
        fi
    else
        echo "    [!] No network security config (uses default)"
    fi
    echo ""

    # Native libraries
    echo -e "${YELLOW}  Native Libraries:${NC}"
    if [ -d "$ANALYSIS_PATH/apktool/lib" ]; then
        find "$ANALYSIS_PATH/apktool/lib" -name "*.so" | head -5 | sed 's/^/    /'
    else
        echo "    No native libraries found"
    fi
    echo ""

    # Generate report
    generate_apk_report "$APK_NAME" "$ANALYSIS_PATH"
}

# Generate APK analysis report
generate_apk_report() {
    local APK_NAME=$1
    local ANALYSIS_PATH=$2
    local REPORT_FILE="$ANALYSIS_PATH/analysis-report.md"

    echo -e "${PURPLE}[+] Generating Analysis Report...${NC}"

    {
        echo "# APK Security Analysis Report"
        echo "**APK**: $APK_NAME"
        echo "**Date**: $(date)"
        echo ""
        echo "## Summary"
        echo "This report contains the security analysis findings for $APK_NAME"
        echo ""
        echo "## Findings"
        echo ""
        echo "### Manifest Analysis"
        if [ -f "$ANALYSIS_PATH/apktool/AndroidManifest.xml" ]; then
            echo "- Package: $(grep package= "$ANALYSIS_PATH/apktool/AndroidManifest.xml" | head -1)"
            echo "- Min SDK: $(grep minSdkVersion "$ANALYSIS_PATH/apktool/AndroidManifest.xml" | head -1)"
            echo "- Target SDK: $(grep targetSdkVersion "$ANALYSIS_PATH/apktool/AndroidManifest.xml" | head -1)"
        fi
        echo ""
        echo "### Security Issues"
        echo "Check the analysis output for:"
        echo "- Hardcoded secrets"
        echo "- Weak cryptography"
        echo "- Exported components"
        echo "- Dangerous permissions"
        echo ""
        echo "### Files Structure"
        echo "\`\`\`"
        echo "apktool/ - Extracted resources and smali code"
        echo "jadx/    - Decompiled Java source code"
        echo "\`\`\`"
        echo ""
        echo "## Recommendations"
        echo "1. Review hardcoded values"
        echo "2. Check permission usage"
        echo "3. Analyze network communications"
        echo "4. Test for injection vulnerabilities"
        echo ""
        echo "---"
        echo "*Generated by APK Analysis Tool - Educational Use Only*"
    } > "$REPORT_FILE"

    echo -e "${GREEN}[✓] Report saved to: $REPORT_FILE${NC}"
}

# Batch analysis
batch_analysis() {
    echo -e "${PURPLE}[+] Starting Batch APK Analysis...${NC}"
    echo ""

    # Find all APKs in the directory
    APK_FILES=$(find $APK_DIR -name "*.apk" 2>/dev/null)

    if [ -z "$APK_FILES" ]; then
        echo -e "${YELLOW}[!] No APK files found in $APK_DIR${NC}"
        echo "    Extract APKs from device first or place APKs in this directory"
        return
    fi

    for APK in $APK_FILES; do
        analyze_apk "$APK"
        echo -e "${CYAN}════════════════════════════════════════${NC}"
        echo ""
    done
}

# Extract APK from device
extract_from_device() {
    echo -e "${PURPLE}[+] Extracting APKs from Connected Device...${NC}"
    echo ""

    # Check device connection
    if ! adb devices | grep -q "device$"; then
        echo -e "${RED}[!] No device connected${NC}"
        echo "    Please connect an Android device with USB debugging enabled"
        return
    fi

    # List packages
    echo -e "${CYAN}Third-party packages on device:${NC}"
    PACKAGES=$(adb shell pm list packages -3 | cut -d: -f2 | tr -d '\r')

    i=1
    for PKG in $PACKAGES; do
        echo "  $i. $PKG"
        ((i++))
    done

    echo ""
    read -p "Enter package number to extract (or 'all' for all): " choice

    if [ "$choice" = "all" ]; then
        for PKG in $PACKAGES; do
            echo -e "${YELLOW}[*] Extracting: $PKG${NC}"
            APK_PATH=$(adb shell pm path $PKG | cut -d: -f2 | tr -d '\r')
            if [ ! -z "$APK_PATH" ]; then
                adb pull "$APK_PATH" "$APK_DIR/${PKG}.apk" 2>/dev/null
                echo -e "${GREEN}[✓] Saved: ${PKG}.apk${NC}"
            fi
        done
    else
        PKG=$(echo "$PACKAGES" | sed -n "${choice}p")
        if [ ! -z "$PKG" ]; then
            echo -e "${YELLOW}[*] Extracting: $PKG${NC}"
            APK_PATH=$(adb shell pm path $PKG | cut -d: -f2 | tr -d '\r')
            adb pull "$APK_PATH" "$APK_DIR/${PKG}.apk"
            echo -e "${GREEN}[✓] Saved: ${PKG}.apk${NC}"
        fi
    fi
}

# Interactive menu
show_menu() {
    echo ""
    echo -e "${BLUE}┌────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│      APK Analysis Operations          │${NC}"
    echo -e "${BLUE}├────────────────────────────────────────┤${NC}"
    echo -e "${BLUE}│ 1. Install Analysis Tools              │${NC}"
    echo -e "${BLUE}│ 2. Extract APK from Device             │${NC}"
    echo -e "${BLUE}│ 3. Analyze Single APK                  │${NC}"
    echo -e "${BLUE}│ 4. Batch Analysis (All APKs)           │${NC}"
    echo -e "${BLUE}│ 5. Search for Vulnerabilities          │${NC}"
    echo -e "${BLUE}│ 6. Generate Master Report              │${NC}"
    echo -e "${BLUE}│ 0. Exit                                │${NC}"
    echo -e "${BLUE}└────────────────────────────────────────┘${NC}"
    echo ""
}

# Vulnerability scanner
vulnerability_scan() {
    echo -e "${PURPLE}[+] Scanning for Common Vulnerabilities...${NC}"
    echo ""

    if [ ! -d "$ANALYSIS_DIR" ] || [ -z "$(ls -A $ANALYSIS_DIR)" ]; then
        echo -e "${YELLOW}[!] No analyzed APKs found${NC}"
        echo "    Please analyze APKs first"
        return
    fi

    echo -e "${CYAN}Vulnerability Scan Results:${NC}"
    echo ""

    # SQL Injection
    echo -e "${YELLOW}[*] SQL Injection Risks:${NC}"
    grep -r "rawQuery\|execSQL" $ANALYSIS_DIR/*/jadx 2>/dev/null | head -5

    # Path Traversal
    echo -e "${YELLOW}[*] Path Traversal Risks:${NC}"
    grep -r "\.\./\|getCanonicalPath" $ANALYSIS_DIR/*/jadx 2>/dev/null | head -5

    # Insecure Storage
    echo -e "${YELLOW}[*] Insecure Storage:${NC}"
    grep -r "MODE_WORLD_READABLE\|MODE_WORLD_WRITEABLE" $ANALYSIS_DIR/*/jadx 2>/dev/null | head -5

    # WebView Issues
    echo -e "${YELLOW}[*] WebView Vulnerabilities:${NC}"
    grep -r "setJavaScriptEnabled(true)\|addJavascriptInterface" $ANALYSIS_DIR/*/jadx 2>/dev/null | head -5

    echo ""
}

# Main function
main() {
    install_tools

    while true; do
        show_menu
        read -p "Select operation [0-6]: " choice

        case $choice in
            1) install_tools ;;
            2) extract_from_device ;;
            3)
                read -p "Enter APK file path: " apk_path
                if [ -f "$apk_path" ]; then
                    analyze_apk "$apk_path"
                else
                    echo -e "${RED}[!] File not found${NC}"
                fi
                ;;
            4) batch_analysis ;;
            5) vulnerability_scan ;;
            6)
                echo -e "${PURPLE}[+] Generating Master Report...${NC}"
                MASTER_REPORT="$WORK_DIR/master-report-$(date +%Y%m%d-%H%M%S).md"
                {
                    echo "# APK Security Analysis Master Report"
                    echo "Generated: $(date)"
                    echo ""
                    echo "## Analyzed APKs"
                    ls -la $ANALYSIS_DIR 2>/dev/null
                    echo ""
                    echo "## Summary"
                    echo "Total APKs analyzed: $(ls -1 $ANALYSIS_DIR 2>/dev/null | wc -l)"
                    echo ""
                    echo "Individual reports available in: $ANALYSIS_DIR"
                } > "$MASTER_REPORT"
                echo -e "${GREEN}[✓] Master report: $MASTER_REPORT${NC}"
                ;;
            0)
                echo -e "${GREEN}[✓] Exiting APK Analysis Tool${NC}"
                echo -e "${CYAN}Remember: Use knowledge responsibly! Nyaa~! 🐾${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}[!] Invalid option${NC}"
                ;;
        esac

        echo ""
        read -p "Press Enter to continue..."
    done
}

# Start
echo -e "${RED}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║              ⚠️  ETHICAL NOTICE ⚠️                  ║${NC}"
echo -e "${RED}║                                                    ║${NC}"
echo -e "${RED}║  This tool is for EDUCATIONAL purposes only!      ║${NC}"
echo -e "${RED}║  • Only analyze APKs you own or have permission   ║${NC}"
echo -e "${RED}║  • Follow responsible disclosure practices        ║${NC}"
echo -e "${RED}║  • Respect intellectual property rights           ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════╝${NC}"
echo ""

read -p "Do you agree to use this tool ethically? [y/N]: " agree

if [[ "$agree" =~ ^[Yy]$ ]]; then
    main
else
    echo -e "${RED}[!] Ethical agreement required${NC}"
    exit 1
fi