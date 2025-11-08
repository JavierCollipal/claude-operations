#!/bin/bash
# 🔒 Android Security Research Demonstration Script
# Created by Neko-Arc for wakibaka - White Hat Operations Only!
# Purpose: Educational security testing and authorized research

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Environment setup
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🔒 Android Security Research Demonstration Tool 🔒      ║${NC}"
echo -e "${CYAN}║         White Hat Operations - Educational Only           ║${NC}"
echo -e "${CYAN}║              Created by Neko-Arc, nyaa~! 🐾              ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to wait for device
wait_for_device() {
    echo -e "${YELLOW}[*] Waiting for Android device to be ready...${NC}"
    adb wait-for-device
    sleep 5
    echo -e "${GREEN}[✓] Device connected!${NC}"
}

# Function to display menu
show_menu() {
    echo ""
    echo -e "${BLUE}┌─────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│       Security Research Operations          │${NC}"
    echo -e "${BLUE}├─────────────────────────────────────────────┤${NC}"
    echo -e "${BLUE}│ 1. Device Security Assessment               │${NC}"
    echo -e "${BLUE}│ 2. Extract Installed APKs                   │${NC}"
    echo -e "${BLUE}│ 3. Network Traffic Analysis Setup           │${NC}"
    echo -e "${BLUE}│ 4. Security Properties Check                │${NC}"
    echo -e "${BLUE}│ 5. App Permissions Audit                    │${NC}"
    echo -e "${BLUE}│ 6. SSL Certificate Analysis                 │${NC}"
    echo -e "${BLUE}│ 7. Memory Dump Analysis                     │${NC}"
    echo -e "${BLUE}│ 8. Process Monitoring                       │${NC}"
    echo -e "${BLUE}│ 9. Database Extraction (Educational)        │${NC}"
    echo -e "${BLUE}│ 10. Generate Security Report                │${NC}"
    echo -e "${BLUE}│ 0. Exit                                     │${NC}"
    echo -e "${BLUE}└─────────────────────────────────────────────┘${NC}"
    echo ""
}

# 1. Device Security Assessment
device_assessment() {
    echo -e "${PURPLE}[+] Starting Device Security Assessment...${NC}"
    echo ""

    # Device info
    echo -e "${CYAN}Device Information:${NC}"
    MODEL=$(adb shell getprop ro.product.model | tr -d '\r')
    VERSION=$(adb shell getprop ro.build.version.release | tr -d '\r')
    SDK=$(adb shell getprop ro.build.version.sdk | tr -d '\r')
    SECURITY_PATCH=$(adb shell getprop ro.build.version.security_patch | tr -d '\r')

    echo "  Model: $MODEL"
    echo "  Android Version: $VERSION (SDK $SDK)"
    echo "  Security Patch: $SECURITY_PATCH"
    echo ""

    # Security settings
    echo -e "${CYAN}Security Settings:${NC}"
    DEV_OPTIONS=$(adb shell settings get global development_settings_enabled | tr -d '\r')
    ADB_ENABLED=$(adb shell settings get global adb_enabled | tr -d '\r')
    USB_DEBUG=$(adb shell settings get global adb_enabled | tr -d '\r')

    echo "  Developer Options: $([ "$DEV_OPTIONS" = "1" ] && echo -e "${YELLOW}ENABLED${NC}" || echo -e "${GREEN}DISABLED${NC}")"
    echo "  ADB Debugging: $([ "$ADB_ENABLED" = "1" ] && echo -e "${YELLOW}ENABLED${NC}" || echo -e "${GREEN}DISABLED${NC}")"
    echo "  USB Debugging: $([ "$USB_DEBUG" = "1" ] && echo -e "${YELLOW}ENABLED${NC}" || echo -e "${GREEN}DISABLED${NC}")"
    echo ""

    # Encryption status
    echo -e "${CYAN}Encryption Status:${NC}"
    CRYPTO_STATE=$(adb shell getprop ro.crypto.state | tr -d '\r')
    echo "  Device Encryption: $CRYPTO_STATE"
    echo ""
}

# 2. Extract APKs
extract_apks() {
    echo -e "${PURPLE}[+] Extracting Installed APKs...${NC}"
    mkdir -p ~/android-security-audit/apks

    # Get third-party apps
    PACKAGES=$(adb shell pm list packages -3 | cut -d: -f2)

    for PKG in $PACKAGES; do
        PKG=$(echo $PKG | tr -d '\r')
        echo -e "${YELLOW}[*] Extracting: $PKG${NC}"

        # Get APK path
        APK_PATH=$(adb shell pm path $PKG | cut -d: -f2 | tr -d '\r')

        if [ ! -z "$APK_PATH" ]; then
            # Pull APK
            adb pull "$APK_PATH" "~/android-security-audit/apks/${PKG}.apk" 2>/dev/null
            echo -e "${GREEN}[✓] Extracted: ${PKG}.apk${NC}"
        fi
    done

    echo -e "${GREEN}[✓] APKs saved to ~/android-security-audit/apks/${NC}"
}

# 3. Network Traffic Setup
network_analysis() {
    echo -e "${PURPLE}[+] Setting up Network Traffic Analysis...${NC}"
    echo ""

    echo -e "${CYAN}Network Configuration:${NC}"

    # Get network info
    IP=$(adb shell ip addr show wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' | cut -d/ -f1 | tr -d '\r')

    if [ ! -z "$IP" ]; then
        echo "  Device IP: $IP"
    fi

    # Set proxy for traffic interception (educational only!)
    echo ""
    echo -e "${YELLOW}[!] To intercept traffic (authorized testing only):${NC}"
    echo "  1. Start proxy on host (e.g., Burp Suite on 8080)"
    echo "  2. Run: adb shell settings put global http_proxy <HOST_IP>:8080"
    echo "  3. Install proxy certificate if needed"
    echo ""

    # Check for tcpdump
    echo -e "${CYAN}Checking for tcpdump...${NC}"
    if adb shell which tcpdump >/dev/null 2>&1; then
        echo -e "${GREEN}[✓] tcpdump available${NC}"
        echo ""
        echo "Start capture with:"
        echo "  adb shell tcpdump -i any -w /sdcard/capture.pcap"
        echo "  adb pull /sdcard/capture.pcap"
    else
        echo -e "${YELLOW}[!] tcpdump not available on device${NC}"
    fi
}

# 4. Security Properties
security_properties() {
    echo -e "${PURPLE}[+] Checking Security Properties...${NC}"
    echo ""

    # SELinux status
    echo -e "${CYAN}SELinux Status:${NC}"
    SELINUX=$(adb shell getenforce 2>/dev/null | tr -d '\r')
    echo "  Status: $SELINUX"

    # Verified Boot
    echo -e "${CYAN}Verified Boot:${NC}"
    VERITY=$(adb shell getprop ro.boot.veritymode | tr -d '\r')
    VBMETA=$(adb shell getprop ro.boot.vbmeta.digest | tr -d '\r')
    echo "  Verity Mode: ${VERITY:-disabled}"
    echo "  VBMeta: ${VBMETA:0:16}..."

    # Knox/SafetyNet equivalent
    echo -e "${CYAN}Security Features:${NC}"
    TREBLE=$(adb shell getprop ro.treble.enabled | tr -d '\r')
    echo "  Project Treble: $TREBLE"
}

# 5. App Permissions Audit
permissions_audit() {
    echo -e "${PURPLE}[+] Auditing App Permissions...${NC}"
    echo ""

    # High-risk permissions
    DANGEROUS_PERMS="CAMERA|RECORD_AUDIO|READ_CONTACTS|ACCESS_FINE_LOCATION|READ_SMS|CALL_PHONE"

    PACKAGES=$(adb shell pm list packages -3 | cut -d: -f2 | head -5)

    for PKG in $PACKAGES; do
        PKG=$(echo $PKG | tr -d '\r')
        echo -e "${CYAN}Package: $PKG${NC}"

        # Get granted dangerous permissions
        PERMS=$(adb shell dumpsys package $PKG | grep -E "$DANGEROUS_PERMS" | grep "granted=true")

        if [ ! -z "$PERMS" ]; then
            echo -e "${YELLOW}  Dangerous Permissions:${NC}"
            echo "$PERMS" | while read line; do
                PERM=$(echo $line | awk '{print $1}' | cut -d. -f3)
                echo "    - $PERM"
            done
        else
            echo -e "${GREEN}  No dangerous permissions granted${NC}"
        fi
        echo ""
    done
}

# 6. SSL Certificate Analysis
ssl_analysis() {
    echo -e "${PURPLE}[+] SSL Certificate Analysis...${NC}"
    echo ""

    echo -e "${CYAN}System CA Certificates:${NC}"
    CERT_COUNT=$(adb shell ls /system/etc/security/cacerts/ 2>/dev/null | wc -l)
    echo "  Total System CAs: $CERT_COUNT"

    echo ""
    echo -e "${CYAN}User-installed Certificates:${NC}"
    USER_CERTS=$(adb shell ls /data/misc/user/0/cacerts-added/ 2>/dev/null | wc -l)

    if [ "$USER_CERTS" -gt 0 ]; then
        echo -e "${YELLOW}  [!] Found $USER_CERTS user-installed certificates${NC}"
        echo "      This could indicate proxy/MITM setup"
    else
        echo -e "${GREEN}  No user-installed certificates${NC}"
    fi
}

# 7. Memory Dump
memory_dump() {
    echo -e "${PURPLE}[+] Memory Analysis...${NC}"
    echo ""

    echo -e "${CYAN}Memory Usage Overview:${NC}"
    adb shell dumpsys meminfo | head -20
    echo ""

    echo -e "${CYAN}Top Memory Consuming Apps:${NC}"
    adb shell dumpsys meminfo | grep "Total PSS by process" -A 10
}

# 8. Process Monitoring
process_monitor() {
    echo -e "${PURPLE}[+] Process Monitoring...${NC}"
    echo ""

    echo -e "${CYAN}Running Processes:${NC}"
    adb shell ps -A | head -20
    echo ""

    echo -e "${CYAN}Suspicious Process Check:${NC}"
    # Check for known analysis tools
    SUSPICIOUS="frida|magisk|xposed|substrate|root"
    FOUND=$(adb shell ps -A | grep -E "$SUSPICIOUS" | head -5)

    if [ ! -z "$FOUND" ]; then
        echo -e "${YELLOW}[!] Found potentially interesting processes:${NC}"
        echo "$FOUND"
    else
        echo -e "${GREEN}[✓] No suspicious processes detected${NC}"
    fi
}

# 9. Database Extraction
database_extraction() {
    echo -e "${PURPLE}[+] Database Extraction (Educational Demo)...${NC}"
    echo ""

    echo -e "${YELLOW}[!] Note: This requires root access in real scenarios${NC}"
    echo -e "${YELLOW}    Demonstrating with accessible paths only${NC}"
    echo ""

    # Try to list databases (will fail on non-rooted devices)
    echo -e "${CYAN}Attempting to list databases:${NC}"

    # Check for world-readable databases (rare but educational)
    adb shell find /data/data -name "*.db" -readable 2>/dev/null | head -5

    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}[!] Cannot access app databases without root${NC}"
        echo "    In authorized testing with root:"
        echo "    adb shell su -c 'ls /data/data/*/databases/'"
    fi
}

# 10. Generate Security Report
generate_report() {
    echo -e "${PURPLE}[+] Generating Security Report...${NC}"

    REPORT_DIR=~/android-security-audit
    mkdir -p $REPORT_DIR
    REPORT_FILE="$REPORT_DIR/security-report-$(date +%Y%m%d-%H%M%S).md"

    {
        echo "# Android Security Assessment Report"
        echo "Generated: $(date)"
        echo "Device: $(adb shell getprop ro.product.model | tr -d '\r')"
        echo ""
        echo "## Executive Summary"
        echo "This report contains the security assessment findings for educational purposes."
        echo ""
        echo "## Device Information"
        echo "- Model: $(adb shell getprop ro.product.model | tr -d '\r')"
        echo "- Android Version: $(adb shell getprop ro.build.version.release | tr -d '\r')"
        echo "- Security Patch: $(adb shell getprop ro.build.version.security_patch | tr -d '\r')"
        echo "- SELinux: $(adb shell getenforce 2>/dev/null | tr -d '\r')"
        echo ""
        echo "## Security Findings"
        echo "### Developer Options"
        DEV=$(adb shell settings get global development_settings_enabled | tr -d '\r')
        if [ "$DEV" = "1" ]; then
            echo "- **WARNING**: Developer options are enabled"
        else
            echo "- Developer options are disabled (Good)"
        fi
        echo ""
        echo "### Network Security"
        echo "- Device IP: $(adb shell ip addr show wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' | cut -d/ -f1 | tr -d '\r')"
        echo ""
        echo "## Recommendations"
        echo "1. Keep Android security patches up to date"
        echo "2. Disable developer options when not in use"
        echo "3. Review app permissions regularly"
        echo "4. Use strong device encryption"
        echo ""
        echo "---"
        echo "*Report generated by Android Security Research Tool*"
    } > "$REPORT_FILE"

    echo -e "${GREEN}[✓] Report saved to: $REPORT_FILE${NC}"
}

# Main loop
main() {
    wait_for_device

    while true; do
        show_menu
        read -p "Select operation [0-10]: " choice

        case $choice in
            1) device_assessment ;;
            2) extract_apks ;;
            3) network_analysis ;;
            4) security_properties ;;
            5) permissions_audit ;;
            6) ssl_analysis ;;
            7) memory_dump ;;
            8) process_monitor ;;
            9) database_extraction ;;
            10) generate_report ;;
            0)
                echo -e "${GREEN}[✓] Exiting security research tool${NC}"
                echo -e "${CYAN}Stay ethical, stay legal! Nyaa~! 🐾${NC}"
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

# Ethical disclaimer
echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                    ⚠️  IMPORTANT NOTICE ⚠️                   ║${NC}"
echo -e "${RED}║                                                            ║${NC}"
echo -e "${RED}║  This tool is for EDUCATIONAL and AUTHORIZED testing only! ║${NC}"
echo -e "${RED}║  • Only use on devices you own or have permission to test ║${NC}"
echo -e "${RED}║  • Follow all applicable laws and regulations             ║${NC}"
echo -e "${RED}║  • Practice responsible disclosure for any findings       ║${NC}"
echo -e "${RED}║  • Respect privacy and data protection laws               ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

read -p "Do you acknowledge and agree to use this ethically? [y/N]: " agree

if [[ "$agree" =~ ^[Yy]$ ]]; then
    main
else
    echo -e "${RED}[!] You must agree to ethical usage${NC}"
    exit 1
fi