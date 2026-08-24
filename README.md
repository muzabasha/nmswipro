# Network Management System - Interactive Learning Platform

An interactive educational platform for learning Network Management protocols including NETCONF, RESTCONF, and YANG data modeling with Spring Boot integration.

## 🎯 Latest Update: Spring Boot Tutorial with YANG Data Modelling

**New comprehensive tutorial added** covering NETCONF & RESTCONF protocols with complete Spring Boot implementation guide!

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173
```

---

## 📚 Spring Boot Tutorial - Quick Access

### What's Included:
The application now includes a **comprehensive Spring Boot NETCONF & RESTCONF Tutorial with YANG Data Modelling** featuring:

#### ✅ 11 Interactive Steps:
1. Install Java JDK
2. Install IntelliJ IDEA
3. Create Spring Boot Project
4. Add NETCONF Dependencies
5. Create NETCONF Client Code
6. Create RESTCONF Client Code
7. Create Main Application Runner
8. Run and Test Application
9. **SNMP Operations Mapping** (GET, SET, WALK, TRAP → Modern Protocols)
10. Test with Postman (7 REST API examples)
11. Troubleshooting Guide

#### 🎯 Key Features:
- ✅ **YANG Data Models**: ietf-interfaces, ietf-system, ietf-ip, ietf-routing
- ✅ **SNMP Mapping**: Complete comparison of SNMP vs NETCONF/RESTCONF
- ✅ **Postman Testing**: 7 practical REST API examples
- ✅ **DevNet Integration**: Free Cisco sandbox credentials included
- ✅ **Progress Tracking**: Interactive checkboxes and progress bar
- ✅ **Beginner Friendly**: Zero Java knowledge required

---

## 📖 Documentation

Comprehensive documentation files have been created for easy reference:

| File | Purpose | Use Case |
|------|---------|----------|
| **QUICK_START.md** | Fastest way to demo | For quick demonstrations |
| **VALIDATION_SUMMARY.md** | Validation status | For verification and status checks |
| **DEMO_GUIDE.md** | Complete demo script | For instructors and presenters |
| **TUTORIAL_VALIDATION.md** | Full validation report | For comprehensive review |

### Quick Links:
- 📋 [Quick Start Guide](./QUICK_START.md) - Start here!
- ✅ [Validation Summary](./VALIDATION_SUMMARY.md) - Status check
- 🎬 [Demo Guide](./DEMO_GUIDE.md) - Full demo instructions
- 📊 [Validation Report](./TUTORIAL_VALIDATION.md) - Complete details

---

## 🎓 For Students

### Getting Started:
1. Access the tutorial in the application (any topic → Virtual Labs section)
2. Follow steps 1-11 sequentially
3. Check off completed steps as you progress
4. Use external resources (DevNet Sandbox, Postman)

### Expected Time:
- **Beginners**: 2-3 hours for complete tutorial
- **Intermediate**: 1-2 hours for main concepts
- **Advanced**: 30-45 minutes for SNMP mapping focus

### Learning Outcomes:
After completion, you'll be able to:
- ✓ Set up Spring Boot projects
- ✓ Implement NETCONF clients
- ✓ Implement RESTCONF clients
- ✓ Understand YANG data models
- ✓ Map SNMP operations to modern protocols
- ✓ Test network APIs with Postman
- ✓ Use Cisco DevNet resources

---

## 🎬 For Instructors

### Quick Demo (5 minutes):
```bash
# 1. Start application
npm run dev

# 2. Open browser at localhost:5173
# 3. Navigate to any topic
# 4. Expand "Spring Boot Tutorial"
# 5. Demonstrate key features:
   - Progress tracking (check Step 1)
   - Code examples (open Step 5)
   - SNMP mapping (Step 9 table)
   - Postman testing (Step 10)
```

### Teaching Resources:
- ✅ **Demo Script**: See DEMO_GUIDE.md for 5, 15, and 20-minute demos
- ✅ **Validation Report**: Share TUTORIAL_VALIDATION.md with students
- ✅ **Assignment Ideas**: Included in DEMO_GUIDE.md
- ✅ **Troubleshooting**: Step 11 in tutorial + documentation

---

## 🔧 Technical Stack

### Frontend:
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Tutorial Content:
- **Spring Boot 3.2+** (Java 17)
- **NETCONF** (Apache MINA SSH)
- **RESTCONF** (Spring RestTemplate)
- **YANG** Data Models (IETF standards)
- **Postman** for API testing

### External Resources:
- **Cisco DevNet Sandbox** (free testing environment)
- **Spring Initializr** (project generation)
- **Maven** (dependency management)

---

## ✅ Validation Status

| Category | Status | Notes |
|----------|--------|-------|
| TypeScript Compilation | ✅ PASS | 0 errors |
| Development Server | ✅ PASS | Running on port 5173 |
| Tutorial Integration | ✅ PASS | Properly rendered |
| Content Completeness | ✅ PASS | All 11 steps included |
| YANG Models Coverage | ✅ PASS | 4 standard models |
| SNMP Mapping | ✅ PASS | All 4 operations |
| Postman Examples | ✅ PASS | 7 REST methods |
| Documentation | ✅ PASS | 4 comprehensive files |

**Overall Status**: ✅ **PRODUCTION READY**

---

## 🌟 Key Highlights

### Most Valuable Content:

#### 1. SNMP Operations Mapping (Step 9)
Comprehensive comparison showing how traditional SNMP maps to modern protocols:

```
SNMP Operation → NETCONF Equivalent → RESTCONF Equivalent
────────────────────────────────────────────────────────
GET            → <get>/<get-config> → HTTP GET
SET            → <edit-config>      → HTTP PUT/PATCH
WALK           → subtree filter     → GET ?depth=unbounded
TRAP           → <notification>     → SSE/WebSocket
```

#### 2. YANG Data Models
Standard models covered:
- **ietf-interfaces** (RFC 8343) - replaces IF-MIB
- **ietf-system** (RFC 7317) - replaces SNMPv2-MIB
- **ietf-ip** (RFC 8344) - replaces IP-MIB
- **ietf-routing** (RFC 8349) - routing protocols

#### 3. Free Testing Environment
Complete Cisco DevNet Sandbox setup:
- Host: `sandbox-iosxe-latest-1.cisco.com`
- Port: `443`
- Username: `developer`
- Password: `C1sco12345`

---

## 🐛 Troubleshooting

### Common Issues:

**Application won't start?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Port 5173 already in use?**
```bash
# Find and kill the process
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Tutorial not visible?**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Check browser console (F12) for errors

More troubleshooting: See **Step 11** in the tutorial or **DEMO_GUIDE.md**

---

## 📊 Project Statistics

- **Total Steps**: 11 interactive tutorial steps
- **Code Examples**: 15+ syntax-highlighted Java/XML/JSON blocks
- **YANG Models**: 4 standard IETF models covered
- **Postman Examples**: 7 REST API methods demonstrated
- **Documentation**: 4 comprehensive markdown files
- **Lines of Code**: 2000+ in SpringBootTutorial.tsx

---

## 🤝 Contributing

### For Content Updates:
1. Edit `src/components/SpringBootTutorial.tsx`
2. Test changes locally (`npm run dev`)
3. Verify TypeScript compilation (`npx tsc --noEmit`)
4. Update documentation if needed

### For Documentation:
- Update corresponding `.md` files in root directory
- Keep validation status current
- Add new troubleshooting entries as needed

---

## 📞 Support

### For Students:
1. Check tutorial Step 11 (Troubleshooting)
2. Review documentation files
3. Contact instructor during office hours
4. Post in class discussion forum

### For Instructors:
1. See DEMO_GUIDE.md for presentation help
2. Check TUTORIAL_VALIDATION.md for content details
3. Use QUICK_START.md for rapid setup

---

## 📄 License

This project is part of the Network Management System course curriculum.

---

## 🎉 Acknowledgments

- **IETF** for NETCONF, RESTCONF, and YANG standards
- **Cisco DevNet** for free sandbox environment
- **Spring Framework** for excellent documentation
- **Apache Foundation** for MINA SSH library
- **React Community** for amazing tools and libraries

---

**Version**: 1.0  
**Last Updated**: August 24, 2026  
**Status**: ✅ Production Ready  
**Tutorial Status**: ✅ Validated and Error-Free

**Ready to start?** Run `npm run dev` and explore the tutorial!
