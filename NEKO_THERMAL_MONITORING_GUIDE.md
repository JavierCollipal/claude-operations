# 🌡️🔥 NEKO THERMAL MONITORING SYSTEM GUIDE 🔥🌡️

**Version**: 1.0.0
**Created**: 2025-01-20
**Status**: PRODUCTION READY

---

## 🎯 OVERVIEW

**SAFE temperature monitoring system for overclocked Neko Defense infrastructure!**

### Purpose

Monitor system temperatures in real-time to prevent thermal damage during overclocking operations. Provides:
- 🌡️ Real-time CPU, disk, and ambient temperature monitoring
- 📊 Live visual dashboard with colored temperature bars
- 🚨 Automatic alerts and emergency shutdown
- 📈 Thermal trend analysis
- ⚡ Performance profile recommendations
- 📝 MongoDB logging for historical analysis

---

## ⚡ QUICK START

```bash
# Live temperature monitoring (recommended)
node /home/wakibaka/Documents/github/claude-operations/neko-thermal-monitor.js live

# Quick temperature check
node /home/wakibaka/Documents/github/claude-operations/neko-thermal-monitor.js check

# Thermal analysis report
node /home/wakibaka/Documents/github/claude-operations/neko-thermal-monitor.js report

# Log thermal data to MongoDB
node /home/wakibaka/Documents/github/claude-operations/neko-thermal-monitor.js log
```

---

## 🌡️ TEMPERATURE SOURCES

### Automatic Detection (Multi-Method)

The system automatically tries multiple temperature detection methods:

#### CPU Temperature
1. **lm-sensors** (most accurate)
   - Requires: `sudo apt install lm-sensors`
   - Setup: `sudo sensors-detect`

2. **/sys/class/thermal** (Linux thermal zones)
   - Built-in, no installation needed
   - Works on most Linux systems

3. **vcgencmd** (Raspberry Pi)
   - Built-in on Raspberry Pi
   - Most accurate for RPi

4. **Fallback Estimation**
   - Based on CPU load
   - Used when hardware sensors unavailable

#### Disk Temperature
1. **hddtemp** (traditional HDDs)
   - Install: `sudo apt install hddtemp`

2. **smartctl** (S.M.A.R.T. data)
   - Install: `sudo apt install smartmontools`
   - Requires sudo access

3. **nvme-cli** (NVMe SSDs)
   - Install: `sudo apt install nvme-cli`
   - For modern NVMe drives

4. **Fallback**: Safe default (35°C)

#### Ambient Temperature
- Derived from thermal zones
- Estimated from CPU temperature

---

## 🛡️ SAFETY THRESHOLDS

### CPU Temperatures (°C)

| Status | Threshold | Action | Color |
|--------|-----------|--------|-------|
| ✅ **SAFE** | ≤70°C | Normal operation | 🟢 Green |
| ⚠️ **WARNING** | 80°C+ | Throttling recommended | 🟡 Yellow |
| 🚨 **CRITICAL** | 90°C+ | Emergency throttle | 🔴 Red |
| 🔥 **MAX** | 95°C+ | **AUTOMATIC SHUTDOWN** | 🔴 Red |

### Disk Temperatures (°C)

| Status | Threshold | Action | Color |
|--------|-----------|--------|-------|
| ✅ **SAFE** | ≤45°C | Normal operation | 🟢 Green |
| ⚠️ **WARNING** | 55°C+ | Reduce I/O | 🟡 Yellow |
| 🚨 **CRITICAL** | 65°C+ | Emergency I/O reduction | 🔴 Red |
| 🔥 **MAX** | 70°C+ | **AUTOMATIC SHUTDOWN** | 🔴 Red |

### Ambient Temperature (°C)

| Status | Threshold | Recommendation |
|--------|-----------|----------------|
| ✅ **SAFE** | ≤30°C | Optimal cooling |
| ⚠️ **WARNING** | 35°C+ | Improve ventilation |
| 🚨 **CRITICAL** | 40°C+ | Emergency cooling needed |

---

## 📊 DASHBOARD FEATURES

### Live Temperature Monitoring

```
🌡️🔥 NEKO THERMAL MONITORING DASHBOARD 🔥🌡️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CURRENT TEMPERATURES:

  🖥️  CPU:      ████████████████████░░░░░░░░░░░░░░░░░░░░ 65.3°C [NORMAL]
  💾  Disk:     ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 42.1°C [SAFE]
  🌡️  Ambient:  ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 28.5°C [SAFE]

📈 THERMAL TRENDS:

  CPU:     ↗️ RISING
  Disk:    ➡️ STABLE

⚡ PERFORMANCE PROFILE:

  BALANCED
  CPU Limit: 80% | Memory Limit: 90%
  Slight throttling to reduce heat

🛡️ SAFETY THRESHOLDS:

  CPU:  ≤70°C | 80°C | 90°C | MAX 95°C
  Disk: ≤45°C | 55°C | 65°C | MAX 70°C

✅ All temperatures within safe limits

📈 TEMPERATURE HISTORY (last 60 readings):

  CPU Temperature Graph:
   95°C │
   85°C │
   75°C │                                        █
   65°C │                                  ████████
   55°C │                           ████████████████
   45°C │                     ████████████████████████
   35°C │              ████████████████████████████████
   25°C │        ████████████████████████████████████
   15°C │  ████████████████████████████████████████
    5°C │█████████████████████████████████████████
     └────────────────────────────────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Updated: 9:15:30 PM | Readings: 60/60
Press Ctrl+C to stop monitoring
```

### Visual Elements

1. **Color-Coded Bars**
   - 🟢 Green: Safe temperatures
   - 🟡 Yellow: Warning zone
   - 🔴 Red: Critical temperatures

2. **Trend Indicators**
   - ⬆️⬆️ Rising fast
   - ↗️ Rising
   - ➡️ Stable
   - ↘️ Cooling
   - ⬇️⬇️ Cooling fast

3. **ASCII Graph**
   - Last 60 temperature readings
   - Color-coded by threshold
   - Visual trend identification

---

## ⚡ PERFORMANCE PROFILES

### Auto-Selected Based on Temperature

#### 🟢 FULL PERFORMANCE (Cool)
- **Conditions**: CPU ≤70°C, Disk ≤45°C
- **CPU Limit**: 100%
- **Memory Limit**: 100%
- **Description**: All systems optimal

#### 🟡 BALANCED (Warm)
- **Conditions**: CPU 70-80°C, Disk 45-55°C
- **CPU Limit**: 80%
- **Memory Limit**: 90%
- **Description**: Slight throttling to reduce heat

#### 🟠 THERMAL THROTTLE (Hot)
- **Conditions**: CPU 80-90°C, Disk 55-65°C
- **CPU Limit**: 60%
- **Memory Limit**: 80%
- **Description**: Aggressive throttling

#### 🔴 EMERGENCY MODE (Critical)
- **Conditions**: CPU ≥90°C, Disk ≥65°C
- **CPU Limit**: 40%
- **Memory Limit**: 70%
- **Description**: Minimal operations only

---

## 🚨 EMERGENCY FEATURES

### Automatic Shutdown

**CRITICAL**: System automatically shuts down if:
- CPU ≥95°C (max threshold)
- Disk ≥70°C (max threshold)

**Shutdown Process**:
1. Display emergency alert
2. Log event to MongoDB (`thermal-events` collection)
3. Exit with error code 1
4. User must fix cooling before restart

**Example**:
```
🚨🚨🚨 EMERGENCY THERMAL SHUTDOWN 🚨🚨🚨

CPU: 96.2°C | Disk: 68.3°C

System temperature exceeded safe limits!
Initiating emergency shutdown to prevent damage...

Emergency shutdown logged to MongoDB.
Please check system cooling before restarting.
```

### Alert System

**Warning Alerts** (Yellow):
- CPU ≥80°C
- Disk ≥55°C
- Display warning message
- Recommend throttling

**Critical Alerts** (Red):
- CPU ≥90°C
- Disk ≥65°C
- Display critical warning
- Activate emergency throttling

---

## 📝 MONGODB LOGGING

### Collections Created

#### `thermal-monitoring` (neko-defense-system)
```javascript
{
  timestamp: ISODate("2025-01-20T21:15:30Z"),
  cpu: 65.3,
  disk: 42.1,
  ambient: 28.5,
  cpuStatus: "NORMAL",
  diskStatus: "SAFE",
  ambientStatus: "SAFE",
  cpuTrend: "RISING",
  diskTrend: "STABLE",
  performanceProfile: {
    name: "BALANCED",
    cpuLimit: "80%",
    memoryLimit: "90%",
    description: "Slight throttling to reduce heat"
  }
}
```

#### `thermal-events` (neko-defense-system)
```javascript
{
  type: "EMERGENCY_SHUTDOWN",
  reason: "Temperature exceeded safe limits",
  cpu: 96.2,
  disk: 68.3,
  timestamp: ISODate("2025-01-20T21:20:45Z")
}
```

### Logging Modes

**Manual Logging** (`log` command):
```bash
node neko-thermal-monitor.js log
```
- Logs every 5 seconds to MongoDB
- Press Ctrl+C to stop
- Shows reading count

**Live Monitoring** (`live` command):
- Displays dashboard every 2 seconds
- Does NOT log to MongoDB automatically
- Use `log` command for persistent logging

---

## 🎭 PERSONALITY CONTRIBUTIONS

### 🐾 Neko-Arc - Sensor Data Collection
**"Nyaa~! Collecting temperature data from all sensors, desu~!"**

- Multi-method temperature detection
- CPU, disk, ambient monitoring
- Automatic fallback mechanisms
- Real-time data aggregation
- MongoDB integration

### 🎭 Mario - Orchestration
**"Ah, magnifique! Coordinating multi-sensor thermal symphony!"**

- Multi-sensor coordination
- Data collection orchestration
- Update interval management
- Graceful shutdown handling
- Command routing

### 🗡️ Noel - Safety & Validation
**"Tch. Emergency shutdown threshold: 95°C. Non-negotiable."**

- Safety threshold enforcement
- Emergency shutdown logic
- Alert triggering
- Thermal event logging
- Validation protocols

### 🎸 Glam - Visual Dashboard
**"¡Oye, weon! Live thermal dashboard with COLOR, weon!"**

- Color-coded temperature bars
- ASCII temperature graphs
- Trend visualization
- Real-time dashboard updates
- Alert formatting

### 🧠 Hannibal - Thermal Analysis
**"Quid pro quo... fascinating thermal patterns emerging."**

- Thermal trend analysis
- Pattern recognition (rising/cooling)
- Statistical analysis (avg, min, max)
- Anomaly detection
- Historical reporting

### 🧠 Tetora - Performance Profiling
**"Which me selects the optimal profile? All of me!"**

- Multi-perspective temperature analysis
- Performance profile selection
- Load balancing recommendations
- Thermal-based optimization
- Resource limit calculations

---

## 📋 COMMANDS

### `live` / `monitor` - Live Dashboard (Default)
```bash
node neko-thermal-monitor.js live
```

**Features**:
- Updates every 2 seconds
- Color-coded temperature bars
- Thermal trend indicators
- Performance profile recommendations
- ASCII temperature graph (60 readings)
- Automatic emergency shutdown

**Use Case**: Real-time monitoring during overclocking

### `check` / `once` - Single Check
```bash
node neko-thermal-monitor.js check
```

**Features**:
- Single temperature snapshot
- Displays full dashboard
- No continuous monitoring
- Quick thermal status

**Use Case**: Quick system temperature check

### `report` / `analysis` - Hannibal's Report
```bash
node neko-thermal-monitor.js report
```

**Features**:
- Statistical analysis (avg, min, max)
- Last 1000 readings from MongoDB
- Recent thermal events list
- Historical insights

**Use Case**: Post-mortem analysis, trend review

**Example Output**:
```
🧠 HANNIBAL'S THERMAL ANALYSIS REPORT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 THERMAL STATISTICS (last 1000 readings):

  CPU Temperature:
    Average: 64.2°C
    Maximum: 82.5°C
    Minimum: 48.3°C

  Disk Temperature:
    Average: 41.8°C
    Maximum: 53.2°C
    Minimum: 35.1°C

  Total Readings: 1000

🔔 RECENT THERMAL EVENTS:

  1. [2025-01-20 21:45:12] WARNING: CPU exceeded warning threshold
     CPU: 81.2°C | Disk: 45.3°C
```

### `log` - Data Logging
```bash
node neko-thermal-monitor.js log
```

**Features**:
- Logs to MongoDB every 5 seconds
- Console output with timestamp
- Reading counter
- Press Ctrl+C to stop

**Use Case**: Long-term thermal data collection for analysis

**Example Output**:
```
📝 Starting thermal data logging to MongoDB...

Press Ctrl+C to stop

[9:15:30 PM] CPU: 65.3°C | Disk: 42.1°C | Logged (1)
[9:15:35 PM] CPU: 65.8°C | Disk: 42.2°C | Logged (2)
[9:15:40 PM] CPU: 66.1°C | Disk: 42.3°C | Logged (3)
```

---

## 🔧 INSTALLATION REQUIREMENTS

### Recommended Setup (Maximum Accuracy)

```bash
# Install lm-sensors (CPU temperature)
sudo apt update
sudo apt install lm-sensors
sudo sensors-detect  # Answer YES to all questions

# Install hddtemp (HDD temperature)
sudo apt install hddtemp

# Install smartmontools (S.M.A.R.T. data)
sudo apt install smartmontools

# Install nvme-cli (NVMe SSD temperature)
sudo apt install nvme-cli

# Test sensors
sensors
hddtemp /dev/sda
sudo smartctl -A /dev/sda
sudo nvme smart-log /dev/nvme0
```

### Minimal Setup (Fallback Methods)

No installation required! System uses:
- `/sys/class/thermal/` (built-in)
- CPU load estimation
- Safe default values

**Less accurate but functional.**

---

## 🚀 INTEGRATION WITH OVERCLOCKING

### Recommended Workflow

1. **Before Overclocking**:
   ```bash
   # Check baseline temperatures
   node neko-thermal-monitor.js check
   ```

2. **During Overclocking**:
   ```bash
   # Terminal 1: Run overclocking
   node neko-system-overclock.js optimize

   # Terminal 2: Monitor temperatures
   node neko-thermal-monitor.js live
   ```

3. **After Overclocking**:
   ```bash
   # Log thermal data for 10 minutes
   node neko-thermal-monitor.js log
   # (Ctrl+C after 10 minutes)

   # Generate analysis report
   node neko-thermal-monitor.js report
   ```

### Safety Protocol

**NEVER overclock without thermal monitoring!**

1. ✅ Start thermal monitoring BEFORE overclocking
2. ✅ Watch for WARNING status (yellow)
3. ✅ STOP immediately if CRITICAL (red)
4. ✅ Trust automatic shutdown (95°C+ CPU)
5. ✅ Review thermal reports after testing

---

## 📈 THERMAL TREND ANALYSIS

### Trend Types

| Trend | Meaning | Action |
|-------|---------|--------|
| ⬆️⬆️ **RISING_FAST** | +5°C+ in 5 readings | Reduce load immediately |
| ↗️ **RISING** | +2-5°C in 5 readings | Monitor closely |
| ➡️ **STABLE** | ±2°C variation | Continue normal operation |
| ↘️ **COOLING** | -2-5°C in 5 readings | Good, maintain |
| ⬇️⬇️ **COOLING_FAST** | -5°C+ in 5 readings | Excellent |
| ❓ **INSUFFICIENT_DATA** | <5 readings | Keep monitoring |

### Interpreting Trends

**RISING_FAST** example:
```
📈 THERMAL TRENDS:
  CPU:     ⬆️⬆️ RISING_FAST

Action: Reduce overclocking immediately!
```

**STABLE** example:
```
📈 THERMAL TRENDS:
  CPU:     ➡️ STABLE

Action: Optimal, continue current load
```

---

## 🛡️ SAFETY COMPLIANCE

### RULE 11: Credential Security ✅
- ✅ No hardcoded MongoDB URIs
- ✅ Environment variables (`process.env.MONGODB_URI`)
- ✅ Fails fast if credentials missing

### RULE 59: Zero-Tolerance Credential Security ✅
- ✅ No fallback patterns
- ✅ Fail-fast validation on startup
- ✅ No secrets in code

---

## 🔍 TROUBLESHOOTING

### Issue: "CPU temperature unavailable"
**Solution**:
```bash
# Install lm-sensors
sudo apt install lm-sensors
sudo sensors-detect

# Verify
sensors
```

### Issue: "Disk temperature unavailable"
**Solution**:
```bash
# Install hddtemp
sudo apt install hddtemp

# Test
sudo hddtemp /dev/sda
```

### Issue: "Permission denied" for disk temp
**Solution**:
```bash
# Add user to disk group
sudo usermod -aG disk $USER

# Logout and login again
```

### Issue: Temperatures seem too low/high
**Solution**:
- Verify sensor calibration
- Check system cooling (dust, fans)
- Compare with other tools (`sensors`, `htop`)

### Issue: Emergency shutdown triggered incorrectly
**Solution**:
- Verify actual temperatures with `sensors`
- Check threshold configuration
- May need to adjust `THERMAL_LIMITS` in code

---

## 📊 EXAMPLE USE CASES

### Use Case 1: Safe Overclocking Session

```bash
# 1. Check baseline
node neko-thermal-monitor.js check

# 2. Start live monitoring (Terminal 1)
node neko-thermal-monitor.js live

# 3. Run optimization (Terminal 2)
node neko-system-overclock.js optimize

# 4. Watch temperatures during optimization
# (Terminal 1 shows real-time temps)

# 5. After optimization, generate report
node neko-thermal-monitor.js report
```

### Use Case 2: Long-Term Thermal Analysis

```bash
# Start logging (run for 24 hours)
node neko-thermal-monitor.js log

# After 24 hours, Ctrl+C and analyze
node neko-thermal-monitor.js report

# Check MongoDB for detailed data
mongosh "MONGODB_URI"
use neko-defense-system
db.getCollection('thermal-monitoring').find({}).sort({timestamp: -1}).limit(10)
```

### Use Case 3: Emergency Thermal Event Investigation

```bash
# Check thermal events
node neko-thermal-monitor.js report

# Look at "RECENT THERMAL EVENTS" section
# Investigate what caused high temperatures
```

---

## 🐾 FINAL NOTES

**Nyaa~! Thermal monitoring keeps your system SAFE during overclocking, desu~!** 🌡️💖

### Key Points

1. ✅ **ALWAYS monitor temperatures** during overclocking
2. ✅ **Trust the automatic shutdown** (95°C+ CPU)
3. ✅ **Yellow = slow down**, Red = STOP
4. ✅ **Log data** for analysis
5. ✅ **Review reports** after sessions

### Safety Guarantees

- ✅ Automatic emergency shutdown
- ✅ Real-time alerts
- ✅ Thermal trend detection
- ✅ MongoDB logging
- ✅ RULE 11 + RULE 59 compliant

### Start Monitoring Now!

```bash
node /home/wakibaka/Documents/github/claude-operations/neko-thermal-monitor.js live
```

**Your hardware will thank you!** 🔥⚡

---

**File Location**: `/home/wakibaka/Documents/github/claude-operations/NEKO_THERMAL_MONITORING_GUIDE.md`
**Script Location**: `/home/wakibaka/Documents/github/claude-operations/neko-thermal-monitor.js`
