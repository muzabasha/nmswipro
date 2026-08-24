# 🎯 Quick Demo Guide: Spring Boot NETCONF & RESTCONF Tutorial

## 🚀 5-Minute Quick Start Demo

### Prerequisites
```bash
✓ Node.js installed
✓ Project dependencies installed (npm install)
✓ Internet connection
```

---

## 📺 Live Demo Steps

### Step 1: Launch Application (30 seconds)
```bash
# Open terminal in project directory
cd "d:\Work Load\2026-27 Odd Semester\NMS"

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 2: Navigate to Tutorial (30 seconds)
1. Open browser: `http://localhost:5173`
2. Click on any topic (e.g., "Introduction to Network Management")
3. Scroll down to **"Spring Boot NETCONF & RESTCONF Tutorial with YANG Data Modelling"**
4. Click the expand button (▶️)

### Step 3: Show Tutorial Features (2 minutes)

#### A. Progress Tracking
- Click on "Step 1: Install Java JDK"
- Check the ✓ checkbox
- **Watch**: Progress bar updates from 0% → 9%
- Uncheck to reset

#### B. Step Content
- Click "Step 3: Create Spring Boot Project"
- Show configuration details:
  - Project setup with Spring Initializr
  - Maven dependencies
  - Artifact names
- Highlight the color-coded info boxes

#### C. Code Examples
- Click "Step 5: Create NETCONF Client Code"
- Show syntax-highlighted Java code
- Point out:
  - SSH connection logic
  - NETCONF HELLO message
  - XML message format

#### D. SNMP Mapping (Key Feature)
- Click "Step 9: SNMP Operations"
- Show the comparison table:
  ```
  SNMP GET  → NETCONF <get>     → RESTCONF HTTP GET
  SNMP SET  → NETCONF <edit>    → RESTCONF HTTP PUT
  SNMP WALK → NETCONF subtree   → RESTCONF depth param
  SNMP TRAP → NETCONF notify    → RESTCONF SSE stream
  ```
- Highlight YANG models section

#### E. Postman Testing
- Click "Step 10: Test RESTCONF with Postman"
- Show 7 REST API examples
- Point out Cisco DevNet Sandbox credentials

### Step 4: Completion Demo (30 seconds)
- Quickly check all 11 steps
- **Watch**: Progress bar reaches 100%
- Show completion message with confetti animation 🎉

### Step 5: Dark Mode (30 seconds)
- Toggle dark mode (if available in UI)
- Show tutorial adapts colors automatically

---

## 🎬 Detailed Demo Script (15 Minutes)

### Introduction (1 minute)
"Today we'll explore a comprehensive Spring Boot tutorial for implementing NETCONF and RESTCONF protocols with YANG data modeling. This tutorial is designed for all skill levels, from beginners to advanced developers."

### Section 1: Overview (2 minutes)
1. Show tutorial header with badges:
   - ☕ Java 17
   - 🍃 Spring Boot 3.2+
   - 📡 NETCONF over SSH
   - 🌐 RESTCONF over HTTPS
   - 📋 YANG Data Models
   - 🔄 SNMP Mapping

2. Explain progress tracking:
   - 11 comprehensive steps
   - Check off as you complete
   - Visual progress bar

### Section 2: Spring Boot Setup (3 minutes)
**Steps 1-3**

```
Step 1: Install Java JDK
├── Download from adoptium.net
├── Installation wizard
└── Verification: java -version

Step 2: Install IntelliJ IDEA
├── Community Edition (FREE)
├── Configuration options
└── First launch setup

Step 3: Create Spring Boot Project
├── Spring Initializr (start.spring.io)
├── Project configuration
│   ├── Maven
│   ├── Java 17
│   ├── Spring Boot 3.2.0
│   └── Dependencies: Spring Web, Lombok
└── Import into IntelliJ
```

**Demo Tip**: Open start.spring.io in a new tab and show live project generation.

### Section 3: NETCONF Implementation (4 minutes)
**Steps 4-5**

#### Step 4: Dependencies
Show pom.xml additions:
```xml
<dependency>
    <groupId>org.apache.sshd</groupId>
    <artifactId>sshd-netconf</artifactId>
    <version>2.10.0</version>
</dependency>
```

#### Step 5: NetconfClient.java
Walk through code structure:
1. **SSH Connection**
   ```java
   SshClient client = SshClient.setUpDefaultClient();
   ClientSession session = client.connect(username, host, port);
   ```

2. **NETCONF Subsystem**
   ```java
   ClientChannel channel = session.createSubsystemChannel("netconf");
   ```

3. **HELLO Message Exchange**
   ```xml
   <hello xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
     <capabilities>
       <capability>urn:ietf:params:netconf:base:1.0</capability>
     </capabilities>
   </hello>
   ```

**Demo Tip**: Highlight the XML structure and explain NETCONF message format.

### Section 4: RESTCONF Implementation (2 minutes)
**Step 6**

#### RestconfClient.java
Show HTTP-based approach:

```java
// Much simpler than NETCONF!
RestTemplate restTemplate = new RestTemplate();

// GET request
String url = baseUrl + "/restconf/data/ietf-interfaces:interfaces";
ResponseEntity<String> response = restTemplate.exchange(
    url, HttpMethod.GET, entity, String.class
);
```

**Key Points**:
- Uses standard HTTP methods (GET, POST, PUT, DELETE)
- Data format: JSON instead of XML
- YANG data model: `ietf-interfaces`
- Header: `application/yang-data+json`

### Section 5: SNMP → Modern Protocols (3 minutes) ⭐
**Step 9 - MOST IMPORTANT**

#### Show Mapping Table
```
┌─────────────┬────────────────────┬─────────────────────┐
│ SNMP        │ NETCONF            │ RESTCONF            │
├─────────────┼────────────────────┼─────────────────────┤
│ GET         │ <get>              │ HTTP GET            │
│ sysName     │ /system/hostname   │ /ietf-system:system │
├─────────────┼────────────────────┼─────────────────────┤
│ SET         │ <edit-config>      │ HTTP PUT/PATCH      │
│ ifAdminSt.. │ <enabled>true      │ {"enabled": true}   │
├─────────────┼────────────────────┼─────────────────────┤
│ WALK        │ <get> + filter     │ GET ?depth=unbnd    │
│ IF-MIB      │ <interfaces/>      │ /interfaces         │
├─────────────┼────────────────────┼─────────────────────┤
│ TRAP        │ <notification>     │ SSE stream          │
│ linkDown    │ <link-down/>       │ event: link-down    │
└─────────────┴────────────────────┴─────────────────────┘
```

#### YANG vs MIB Comparison
```
SNMP MIB-II:
  OID: 1.3.6.1.2.1.1.5.0 (sysName)
  Syntax: OCTET STRING
  Access: read-write

YANG Model:
  Path: /ietf-system:system/hostname
  Type: string
  Config: true
  Validation: pattern, length constraints
```

**Demo Tip**: Emphasize that YANG is human-readable and has built-in validation.

### Section 6: Postman Testing (2 minutes)
**Step 10**

Show all 7 REST API examples:

#### Example 1: GET System Info
```bash
GET https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-system:system

Headers:
  Accept: application/yang-data+json
  Authorization: Basic developer:C1sco12345

Response (200 OK):
{
  "ietf-system:system": {
    "hostname": "csr1000v",
    "contact": "admin@example.com",
    "location": "San Jose, CA"
  }
}
```

#### Example 4: PUT - Update Interface
```bash
PUT .../interface=GigabitEthernet2

Body:
{
  "ietf-interfaces:interface": {
    "name": "GigabitEthernet2",
    "description": "Updated via RESTCONF",
    "enabled": true
  }
}
```

**Demo Tip**: If possible, open Postman and show a live request to DevNet Sandbox.

---

## 🎓 Student Walkthrough (Classroom Demo)

### For Beginners (20 minutes)

#### Phase 1: Environment Setup (10 min)
1. **Java Installation**
   - Navigate to adoptium.net
   - Download Java 17 installer
   - Run installation
   - Verify: `java -version`

2. **IntelliJ Installation**
   - Download Community Edition
   - Run installer
   - First launch configuration

#### Phase 2: Project Creation (5 min)
1. **Spring Initializr**
   - Open start.spring.io
   - Fill configuration form
   - Add dependencies
   - Generate and download

2. **Import to IntelliJ**
   - Open project folder
   - Wait for Maven sync
   - Project structure overview

#### Phase 3: First Code (5 min)
1. **Create NetconfClient.java**
   - Right-click → New → Java Class
   - Paste code from tutorial
   - Explain key components

2. **Run Application**
   - Click green play button
   - Watch console output
   - Explain expected errors (no server yet)

---

## 💻 Technical Demo (For IT Professionals)

### Advanced Features Showcase (10 minutes)

#### 1. YANG Data Model Structure
```yang
module ietf-interfaces {
  namespace "urn:ietf:params:xml:ns:yang:ietf-interfaces";
  prefix if;

  container interfaces {
    list interface {
      key "name";
      leaf name { type string; }
      leaf description { type string; }
      leaf enabled { type boolean; default "true"; }
      leaf type { type identityref { base interface-type; } }
    }
  }
}
```

#### 2. NETCONF RPC Operations
```xml
<!-- get-config -->
<rpc message-id="101">
  <get-config>
    <source><running/></source>
    <filter type="subtree">
      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces"/>
    </filter>
  </get-config>
</rpc>

<!-- edit-config -->
<rpc message-id="102">
  <edit-config>
    <target><candidate/></target>
    <config>
      <interfaces>
        <interface>
          <name>GigabitEthernet1</name>
          <enabled>false</enabled>
        </interface>
      </interfaces>
    </config>
  </edit-config>
</rpc>

<!-- commit -->
<rpc message-id="103">
  <commit/>
</rpc>
```

#### 3. RESTCONF URL Patterns
```
Base URL: https://device/restconf

Resources:
├── /data/                    (config + operational)
│   ├── ietf-interfaces:interfaces
│   ├── ietf-system:system
│   └── ietf-routing:routing
│
├── /operations/              (RPCs)
│   ├── ietf-system:system-restart
│   └── ietf-routing:clear-route
│
└── /streams/                 (notifications)
    ├── NETCONF
    └── SNMP
```

#### 4. Real Device Testing
```bash
# Using Cisco DevNet Always-On Sandbox
HOST=sandbox-iosxe-latest-1.cisco.com
PORT=443
USER=developer
PASS=C1sco12345

# Test connectivity
curl -k -u $USER:$PASS \
  -H "Accept: application/yang-data+json" \
  https://$HOST/restconf/data/ietf-interfaces:interfaces

# Output: JSON with all interfaces
```

---

## 🎯 Key Talking Points

### Why This Tutorial is Important:
1. ✅ **Industry Standard**: NETCONF/RESTCONF are IETF standards
2. ✅ **Vendor Neutral**: Works with Cisco, Juniper, Huawei, etc.
3. ✅ **Modern Approach**: Replaces legacy SNMP
4. ✅ **Automation Ready**: Perfect for DevOps/NetOps
5. ✅ **Career Relevant**: High demand for network automation skills

### Learning Outcomes:
After completing this tutorial, students can:
- ✓ Set up Java Spring Boot projects
- ✓ Implement NETCONF clients
- ✓ Implement RESTCONF clients
- ✓ Understand YANG data models
- ✓ Map SNMP to modern protocols
- ✓ Test APIs with Postman
- ✓ Use Cisco DevNet resources

---

## 🐛 Common Demo Issues & Solutions

### Issue 1: npm run dev fails
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 2: Port 5173 already in use
**Solution**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.ts
server: { port: 5174 }
```

### Issue 3: Tutorial doesn't expand
**Solution**: 
- Check browser console for errors
- Verify SpringBootTutorial.tsx compiled correctly
- Clear browser cache

### Issue 4: Code blocks not formatted
**Solution**:
- Check CSS is loaded
- Inspect element to verify classes applied
- Try different browser

---

## 📊 Demo Success Metrics

### Audience Engagement Checklist:
- [ ] Students can see the tutorial clearly
- [ ] Progress bar updates are visible
- [ ] Code examples are readable
- [ ] Questions are addressed in real-time
- [ ] Students take notes on key concepts

### Post-Demo Survey Questions:
1. Was the tutorial easy to follow? (1-5 scale)
2. Which step was most helpful?
3. What additional resources do you need?
4. Will you try building the project yourself?
5. How confident are you in understanding NETCONF/RESTCONF?

---

## 🎬 Recording Tips

### If Creating Video Demo:
1. **Screen Resolution**: 1920x1080 minimum
2. **Font Size**: Increase editor font to 16-18pt
3. **Zoom Level**: Browser at 125-150%
4. **Recording Software**: OBS Studio, Camtasia, or Loom
5. **Audio**: Clear microphone, minimize background noise
6. **Duration**: Keep under 20 minutes for attention span
7. **Chapters**: Add timestamps for each step

### Video Structure:
```
00:00 - Introduction
01:00 - Tutorial Overview
03:00 - Spring Boot Setup (Steps 1-3)
08:00 - NETCONF Implementation (Steps 4-5)
12:00 - RESTCONF Implementation (Step 6)
14:00 - SNMP Mapping (Step 9) ⭐
17:00 - Postman Testing (Step 10)
19:00 - Conclusion & Next Steps
```

---

## ✅ Pre-Demo Checklist

### 1 Day Before:
- [ ] Test application on clean machine
- [ ] Verify all dependencies install correctly
- [ ] Check DevNet Sandbox availability
- [ ] Prepare backup slides (in case of technical issues)
- [ ] Test screen sharing/projector setup

### 1 Hour Before:
- [ ] Start application: `npm run dev`
- [ ] Open browser to tutorial page
- [ ] Test tutorial expansion/collapse
- [ ] Verify internet connection
- [ ] Close unnecessary browser tabs
- [ ] Disable notifications
- [ ] Have backup internet connection ready

### During Demo:
- [ ] Speak clearly and at moderate pace
- [ ] Point out important code sections
- [ ] Pause for questions
- [ ] Show enthusiasm for the technology
- [ ] Relate to real-world scenarios
- [ ] Encourage hands-on practice

---

## 🎓 Assignment Ideas (Post-Demo)

### Beginner Assignment:
"Complete Steps 1-8 of the tutorial and submit screenshots of:
1. Java version output
2. IntelliJ with project opened
3. Application running with console output"

### Intermediate Assignment:
"Implement Steps 9-10 and submit:
1. Modified NetconfClient with one additional RPC method
2. Postman collection (JSON export) with 3 successful requests
3. Short report (1 page) explaining YANG vs SNMP MIB"

### Advanced Assignment:
"Build a complete network management tool using:
1. Spring Boot backend with NETCONF/RESTCONF
2. React frontend for visualization
3. Support for at least 3 YANG models
4. Real device testing with DevNet Sandbox
5. Comprehensive documentation"

---

## 📞 Support Resources

### For Demo Presenter:
- This guide (DEMO_GUIDE.md)
- Validation document (TUTORIAL_VALIDATION.md)
- Source code: SpringBootTutorial.tsx
- Official docs: spring.io, cisco.com/go/netconf

### For Students:
- Tutorial steps (in application)
- Troubleshooting guide (Step 11)
- Cisco DevNet Learning Labs
- StackOverflow tags: spring-boot, netconf, restconf

---

**Demo Guide Version**: 1.0  
**Last Updated**: 2026-08-24  
**Status**: ✅ Ready for Presentation  
**Recommended Duration**: 5-15 minutes (adjustable)
