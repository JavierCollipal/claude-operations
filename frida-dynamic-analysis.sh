#!/bin/bash
# 🔬 Frida Dynamic Analysis Framework
# Created by Neko-Arc for White Hat Android Security Research
# Purpose: Runtime analysis, SSL pinning bypass, method hooking

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
FRIDA_DIR=~/android-security-tools/frida
SCRIPTS_DIR=$FRIDA_DIR/scripts
LOGS_DIR=$FRIDA_DIR/logs

# Create directories
mkdir -p $FRIDA_DIR $SCRIPTS_DIR $LOGS_DIR

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        🔬 Frida Dynamic Analysis Framework 🔬         ║${NC}"
echo -e "${CYAN}║         Runtime Security Research & Testing           ║${NC}"
echo -e "${CYAN}║            Created by Neko-Arc, nyaa~! 🐾            ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Install Frida
install_frida() {
    echo -e "${PURPLE}[+] Installing Frida Tools...${NC}"

    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}[!] Python3 not found, installing...${NC}"
        sudo apt-get update && sudo apt-get install -y python3 python3-pip
    fi

    # Install Frida tools
    if ! command -v frida &> /dev/null; then
        echo -e "${YELLOW}[*] Installing frida-tools...${NC}"
        pip3 install frida-tools --user
        echo -e "${GREEN}[✓] frida-tools installed${NC}"
    else
        echo -e "${GREEN}[✓] frida-tools already installed${NC}"
    fi

    # Download Frida server for Android
    echo -e "${YELLOW}[*] Downloading Frida server for Android...${NC}"
    FRIDA_VERSION=$(frida --version)
    ARCH="x86_64"  # For emulator, use arm64 for real devices

    if [ ! -f "$FRIDA_DIR/frida-server" ]; then
        wget -q "https://github.com/frida/frida/releases/download/${FRIDA_VERSION}/frida-server-${FRIDA_VERSION}-android-${ARCH}.xz" \
            -O "$FRIDA_DIR/frida-server.xz"
        xz -d "$FRIDA_DIR/frida-server.xz"
        chmod +x "$FRIDA_DIR/frida-server"
        echo -e "${GREEN}[✓] Frida server downloaded${NC}"
    else
        echo -e "${GREEN}[✓] Frida server already exists${NC}"
    fi
}

# Deploy Frida to device
deploy_frida() {
    echo -e "${PURPLE}[+] Deploying Frida Server to Device...${NC}"

    # Check device
    if ! adb devices | grep -q "device$"; then
        echo -e "${RED}[!] No device connected${NC}"
        return 1
    fi

    # Push frida-server
    echo -e "${YELLOW}[*] Pushing frida-server to device...${NC}"
    adb push "$FRIDA_DIR/frida-server" /data/local/tmp/
    adb shell chmod 755 /data/local/tmp/frida-server

    # Start frida-server
    echo -e "${YELLOW}[*] Starting frida-server...${NC}"
    adb shell "/data/local/tmp/frida-server &" &
    sleep 3

    # Check if running
    if frida-ps -U 2>/dev/null | grep -q "system_server"; then
        echo -e "${GREEN}[✓] Frida server is running!${NC}"
    else
        echo -e "${YELLOW}[!] Frida server may not be running properly${NC}"
    fi
}

# Create SSL Pinning Bypass Script
create_ssl_bypass() {
    cat > "$SCRIPTS_DIR/ssl-pinning-bypass.js" << 'EOF'
// Universal SSL Pinning Bypass for Android
// Educational purposes only!

Java.perform(function() {
    console.log("[*] SSL Pinning Bypass Script Loaded");

    // Bypass OkHttp3
    try {
        var OkHttpClient = Java.use("okhttp3.OkHttpClient");
        OkHttpClient.newBuilder.implementation = function() {
            console.log("[+] OkHttp3 newBuilder() called");
            return this.newBuilder();
        };

        var CertificatePinner = Java.use("okhttp3.CertificatePinner");
        CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function(str) {
            console.log("[+] OkHttp3 CertificatePinner bypassed for: " + str);
            return;
        };
    } catch(e) {
        console.log("[-] OkHttp3 not found");
    }

    // Bypass TrustManagerImpl
    try {
        var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
        TrustManagerImpl.verifyChain.implementation = function(untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
            console.log('[+] TrustManagerImpl bypassed');
            return untrustedChain;
        };
    } catch(e) {
        console.log("[-] TrustManagerImpl not found");
    }

    // Bypass Network Security Config
    try {
        var NetworkSecurityConfig = Java.use("android.security.net.config.NetworkSecurityConfig");
        NetworkSecurityConfig.getDefaultBuilder.implementation = function(applicationInfo) {
            console.log("[+] NetworkSecurityConfig bypassed");
            return this.getDefaultBuilder(applicationInfo);
        };
    } catch(e) {
        console.log("[-] NetworkSecurityConfig not found");
    }

    // Bypass WebView SSL Errors
    try {
        var WebViewClient = Java.use("android.webkit.WebViewClient");
        WebViewClient.onReceivedSslError.implementation = function(webView, sslErrorHandler, sslError) {
            console.log("[+] WebView SSL Error bypassed");
            sslErrorHandler.proceed();
        };
    } catch(e) {
        console.log("[-] WebViewClient not found");
    }

    console.log("[*] SSL Pinning Bypass Complete");
});
EOF
    echo -e "${GREEN}[✓] SSL bypass script created${NC}"
}

# Create Method Tracer Script
create_method_tracer() {
    cat > "$SCRIPTS_DIR/method-tracer.js" << 'EOF'
// Method Call Tracer
// Traces all method calls in a specific class

Java.perform(function() {
    var targetClass = "TARGET_CLASS_HERE"; // Replace with target class

    try {
        var TargetClass = Java.use(targetClass);
        var methods = TargetClass.class.getDeclaredMethods();

        methods.forEach(function(method) {
            var methodName = method.getName();
            var overloads = TargetClass[methodName].overloads;

            overloads.forEach(function(overload) {
                overload.implementation = function() {
                    console.log("[TRACE] " + targetClass + "." + methodName + " called");
                    console.log("  Args: " + JSON.stringify(arguments));
                    var result = overload.apply(this, arguments);
                    console.log("  Return: " + result);
                    return result;
                };
            });
        });

        console.log("[*] Tracing " + methods.length + " methods in " + targetClass);
    } catch(e) {
        console.log("[-] Failed to trace " + targetClass + ": " + e);
    }
});
EOF
    echo -e "${GREEN}[✓] Method tracer script created${NC}"
}

# Create Crypto Key Logger
create_crypto_logger() {
    cat > "$SCRIPTS_DIR/crypto-logger.js" << 'EOF'
// Cryptographic Operations Logger
// Logs encryption/decryption keys and operations

Java.perform(function() {
    // Log Cipher operations
    try {
        var Cipher = Java.use('javax.crypto.Cipher');

        Cipher.getInstance.overload('java.lang.String').implementation = function(algorithm) {
            console.log('[Crypto] Cipher.getInstance: ' + algorithm);
            return this.getInstance(algorithm);
        };

        Cipher.init.overload('int', 'java.security.Key').implementation = function(mode, key) {
            console.log('[Crypto] Cipher.init()');
            console.log('  Mode: ' + mode);
            console.log('  Key: ' + key.getAlgorithm() + ' - ' + key.getEncoded());
            return this.init(mode, key);
        };
    } catch(e) {
        console.log('[-] Cipher not found');
    }

    // Log SecretKeySpec
    try {
        var SecretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');
        SecretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function(key, algorithm) {
            console.log('[Crypto] SecretKeySpec created');
            console.log('  Algorithm: ' + algorithm);
            console.log('  Key: ' + bytesToHex(key));
            return this.$init(key, algorithm);
        };
    } catch(e) {
        console.log('[-] SecretKeySpec not found');
    }

    // Helper function
    function bytesToHex(bytes) {
        var hex = [];
        for(var i = 0; i < bytes.length; i++) {
            hex.push(('0' + (bytes[i] & 0xFF).toString(16)).slice(-2));
        }
        return hex.join('');
    }
});
EOF
    echo -e "${GREEN}[✓] Crypto logger script created${NC}"
}

# Create Root Detection Bypass
create_root_bypass() {
    cat > "$SCRIPTS_DIR/root-detection-bypass.js" << 'EOF'
// Root Detection Bypass
// Bypasses common root detection methods

Java.perform(function() {
    // File existence checks
    var File = Java.use("java.io.File");
    File.exists.implementation = function() {
        var path = this.getAbsolutePath();
        var rootPaths = ["/su", "/system/bin/su", "/system/xbin/su", "/data/local/su", "/sbin/su", "/system/app/Superuser.apk", "/system/etc/init.d/99SuperSUDaemon", "/dev/com.koushikdutta.superuser.daemon/", "/system/sd/xbin/su"];

        for(var i = 0; i < rootPaths.length; i++) {
            if(path.indexOf(rootPaths[i]) != -1) {
                console.log("[Root Bypass] File.exists() - " + path + " -> false");
                return false;
            }
        }
        return this.exists();
    };

    // Runtime.exec() bypass
    var Runtime = Java.use("java.lang.Runtime");
    Runtime.exec.overload('java.lang.String').implementation = function(command) {
        if(command.indexOf("su") != -1 || command.indexOf("which") != -1) {
            console.log("[Root Bypass] Runtime.exec() blocked: " + command);
            return null;
        }
        return this.exec(command);
    };

    // Build.TAGS check
    var Build = Java.use("android.os.Build");
    Build.TAGS.value = "release-keys";

    console.log("[*] Root Detection Bypass Loaded");
});
EOF
    echo -e "${GREEN}[✓] Root bypass script created${NC}"
}

# Hook specific app
hook_app() {
    local PACKAGE=$1
    local SCRIPT=$2

    echo -e "${PURPLE}[+] Hooking app: $PACKAGE${NC}"
    echo -e "${YELLOW}[*] Using script: $SCRIPT${NC}"

    # Start hooking
    frida -U -f "$PACKAGE" -l "$SCRIPT" --no-pause
}

# List running apps
list_apps() {
    echo -e "${CYAN}Running Applications:${NC}"
    frida-ps -U 2>/dev/null || echo -e "${RED}[!] Could not list apps. Is frida-server running?${NC}"
}

# Interactive hooking
interactive_hook() {
    echo -e "${PURPLE}[+] Starting Interactive Hooking Session...${NC}"

    # List apps
    echo -e "${CYAN}Available applications:${NC}"
    APPS=$(frida-ps -Uai 2>/dev/null | tail -n +2)

    if [ -z "$APPS" ]; then
        echo -e "${RED}[!] No apps found or frida not running${NC}"
        return
    fi

    echo "$APPS" | nl
    echo ""

    read -p "Enter app number to hook: " app_num
    PACKAGE=$(echo "$APPS" | sed -n "${app_num}p" | awk '{print $1}')

    if [ -z "$PACKAGE" ]; then
        echo -e "${RED}[!] Invalid selection${NC}"
        return
    fi

    echo -e "${CYAN}Available scripts:${NC}"
    echo "1. SSL Pinning Bypass"
    echo "2. Method Tracer"
    echo "3. Crypto Logger"
    echo "4. Root Detection Bypass"
    echo "5. Custom Script"
    echo ""

    read -p "Select script [1-5]: " script_choice

    case $script_choice in
        1) SCRIPT="$SCRIPTS_DIR/ssl-pinning-bypass.js" ;;
        2) SCRIPT="$SCRIPTS_DIR/method-tracer.js" ;;
        3) SCRIPT="$SCRIPTS_DIR/crypto-logger.js" ;;
        4) SCRIPT="$SCRIPTS_DIR/root-detection-bypass.js" ;;
        5)
            read -p "Enter script path: " SCRIPT
            ;;
        *)
            echo -e "${RED}[!] Invalid choice${NC}"
            return
            ;;
    esac

    # Start Frida
    echo -e "${GREEN}[+] Starting Frida on $PACKAGE${NC}"
    frida -U -f "$PACKAGE" -l "$SCRIPT" --no-pause
}

# Generate analysis report
generate_frida_report() {
    local REPORT_FILE="$LOGS_DIR/frida-report-$(date +%Y%m%d-%H%M%S).md"

    echo -e "${PURPLE}[+] Generating Frida Analysis Report...${NC}"

    {
        echo "# Frida Dynamic Analysis Report"
        echo "Generated: $(date)"
        echo ""
        echo "## Environment"
        echo "- Frida Version: $(frida --version)"
        echo "- Device: $(adb shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
        echo "- Android: $(adb shell getprop ro.build.version.release 2>/dev/null | tr -d '\r')"
        echo ""
        echo "## Scripts Available"
        ls -la $SCRIPTS_DIR/*.js 2>/dev/null
        echo ""
        echo "## Analysis Capabilities"
        echo "- SSL Pinning Bypass"
        echo "- Method Call Tracing"
        echo "- Cryptographic Key Logging"
        echo "- Root Detection Bypass"
        echo "- Runtime Manipulation"
        echo ""
        echo "## Findings"
        echo "See individual script outputs in logs/"
        echo ""
        echo "---"
        echo "*Generated by Frida Dynamic Analysis Framework*"
    } > "$REPORT_FILE"

    echo -e "${GREEN}[✓] Report saved to: $REPORT_FILE${NC}"
}

# Menu
show_menu() {
    echo ""
    echo -e "${BLUE}┌────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│     Frida Dynamic Analysis Menu        │${NC}"
    echo -e "${BLUE}├────────────────────────────────────────┤${NC}"
    echo -e "${BLUE}│ 1. Install Frida Tools                 │${NC}"
    echo -e "${BLUE}│ 2. Deploy Frida to Device              │${NC}"
    echo -e "${BLUE}│ 3. Create Analysis Scripts             │${NC}"
    echo -e "${BLUE}│ 4. List Running Apps                   │${NC}"
    echo -e "${BLUE}│ 5. Interactive Hook Session            │${NC}"
    echo -e "${BLUE}│ 6. SSL Pinning Bypass (Auto)           │${NC}"
    echo -e "${BLUE}│ 7. Generate Analysis Report            │${NC}"
    echo -e "${BLUE}│ 0. Exit                                │${NC}"
    echo -e "${BLUE}└────────────────────────────────────────┘${NC}"
    echo ""
}

# Auto SSL bypass
auto_ssl_bypass() {
    echo -e "${PURPLE}[+] Auto SSL Pinning Bypass Mode${NC}"
    echo ""

    read -p "Enter package name: " PACKAGE

    echo -e "${YELLOW}[*] Spawning $PACKAGE with SSL bypass...${NC}"
    frida -U -f "$PACKAGE" -l "$SCRIPTS_DIR/ssl-pinning-bypass.js" --no-pause
}

# Main function
main() {
    while true; do
        show_menu
        read -p "Select operation [0-7]: " choice

        case $choice in
            1) install_frida ;;
            2) deploy_frida ;;
            3)
                create_ssl_bypass
                create_method_tracer
                create_crypto_logger
                create_root_bypass
                echo -e "${GREEN}[✓] All scripts created in $SCRIPTS_DIR${NC}"
                ;;
            4) list_apps ;;
            5) interactive_hook ;;
            6) auto_ssl_bypass ;;
            7) generate_frida_report ;;
            0)
                echo -e "${GREEN}[✓] Exiting Frida Framework${NC}"
                echo -e "${CYAN}Happy hunting! Nyaa~! 🐾${NC}"
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
echo -e "${RED}║              ⚠️  ETHICAL NOTICE ⚠️                 ║${NC}"
echo -e "${RED}║                                                   ║${NC}"
echo -e "${RED}║  Dynamic analysis for AUTHORIZED testing only!    ║${NC}"
echo -e "${RED}║  • Only test apps you own or have permission     ║${NC}"
echo -e "${RED}║  • Respect privacy and data protection           ║${NC}"
echo -e "${RED}║  • Follow responsible disclosure                 ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════╝${NC}"
echo ""

read -p "Do you agree to ethical usage? [y/N]: " agree

if [[ "$agree" =~ ^[Yy]$ ]]; then
    main
else
    echo -e "${RED}[!] Ethical agreement required${NC}"
    exit 1
fi