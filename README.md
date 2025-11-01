# ✨ Vibe Assist

**AI-Powered Debug Assistant**

Built by **DebugDivas** for [Hackathon Name] 2025

---

## 🎯 What It Does

Vibe Assist is an intelligent debugging and DevOps troubleshooting tool that:

✅ Analyzes error logs and stack traces
✅ Explains what went wrong in plain English
✅ Suggests code fixes and configuration changes
✅ Provides terminal commands to resolve issues
✅ **Saves all error logs** for future reference
✅ Works with: Node.js, Python, Docker, CI/CD, Vercel, and more

---

## 🏗️ Project Structure

```
vibe-assist/
├── src/
│   ├── components/       # UI Components (modern shadcn/ui)
│   │   ├── ui/          # shadcn/ui primitives
│   │   └── ...          # Custom components
│   ├── core/            # Core Logic & Detection
│   ├── prompts/         # AI Prompts & Intelligence
│   ├── storage/         # Log Storage & History
│   ├── utils/           # Utilities & Integration
│   ├── lib/             # Shared utilities (cn, etc.)
│   ├── types/           # Shared TypeScript types
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── logs/                # Saved error logs (gitignored)
├── public/              # Static assets
└── tests/               # Test files
```

---

## 👥 Team Task Assignment

### **Team Member 1: UI Components** 🎨
**Branch:** `feature/ui-components`

**Tasks:**
- [ ] Create `LogInputPanel.tsx` - main input interface
- [ ] Create `AnalysisResult.tsx` - display AI analysis
- [ ] Create `LogHistory.tsx` - show saved logs
- [ ] Create `LoadingSpinner.tsx` - loading states
- [ ] Style components with Tailwind (dark theme)

**Files to create:**
- `src/components/LogInputPanel.tsx`
- `src/components/AnalysisResult.tsx`
- `src/components/LogHistory.tsx`
- `src/components/LoadingSpinner.tsx`
- `src/components/Button.tsx`
- `src/components/Tabs.tsx`

---

### **Team Member 2: Core Logic & Detection** 🧠
**Branch:** `feature/core-logic`

**Tasks:**
- [ ] Implement log type detector
- [ ] Create error pattern matchers
- [ ] Build log parser
- [ ] Implement analysis orchestrator
- [ ] Add error categorization

**Files to create:**
- `src/core/logDetector.ts`
- `src/core/errorParser.ts`
- `src/core/analyzer.ts`
- `src/core/patternMatchers.ts`
- `src/core/categories.ts`

---

### **Team Member 3: AI Prompts & Intelligence** 🤖
**Branch:** `feature/ai-prompts`

**Tasks:**
- [ ] Write system prompts for each log type
- [ ] Create prompt templates
- [ ] Implement AI response parser
- [ ] Build fix suggestion generator
- [ ] Create sample test logs for demo

**Files to create:**
- `src/prompts/systemPrompts.ts`
- `src/prompts/promptTemplates.ts`
- `src/prompts/responseParser.ts`
- `src/prompts/fixGenerator.ts`
- `src/prompts/sampleLogs.ts`

---

### **Team Member 4: Log Storage & History** 💾
**Branch:** `feature/log-storage`

**Tasks:**
- [ ] Implement log saving to local storage/files
- [ ] Create log retrieval system
- [ ] Build search/filter functionality
- [ ] Add export/import logs feature
- [ ] Implement log metadata (timestamp, tags, etc.)

**Files to create:**
- `src/storage/logStorage.ts`
- `src/storage/logRetrieval.ts`
- `src/storage/logSearch.ts`
- `src/storage/exportImport.ts`
- `src/storage/database.ts`

---

### **Team Member 5: Utilities & Integration** 🔧
**Branch:** `feature/utilities`

**Tasks:**
- [ ] Create API integration helpers
- [ ] Build clipboard utilities
- [ ] Implement file system operations
- [ ] Add command execution helpers
- [ ] Create configuration manager

**Files to create:**
- `src/utils/api.ts`
- `src/utils/clipboard.ts`
- `src/utils/fileSystem.ts`
- `src/utils/commandRunner.ts`
- `src/utils/config.ts`
- `src/utils/helpers.ts`

---

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo>
cd devfix-ai
npm install
```

### 2. Create Your Branch
```bash
# Replace X with your team member number (1-5)
git checkout -b feature/your-feature-name
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔄 Git Workflow

### For Each Team Member:

1. **Create your branch:**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Work on your tasks**

3. **Commit regularly:**
   ```bash
   git add .
   git commit -m "feat: description of what you built"
   ```

4. **Push to your branch:**
   ```bash
   git push origin feature/your-feature
   ```

5. **When ready, create Pull Request to `main`**

---

## 📦 Dependencies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool
- **date-fns** - Date formatting

---

## 🎨 Design System

### Colors (Cursor Theme)
- Background: `#1e1e1e`
- Panel: `#252526`
- Border: `#3e3e42`
- Text: `#cccccc`
- Accent: `#007acc`
- Error: `#f48771`
- Success: `#89d185`

---

## 📝 Commit Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests

---

## 🏆 Demo Plan

1. Paste Node.js error → instant fix
2. Paste Docker build fail → config patch
3. Show log history with saved errors
4. Export logs feature
5. Live fix application

---

## 🤝 Team Communication

- **Daily standup:** Share progress
- **Branch updates:** Pull from main daily
- **Code review:** Review each other's PRs
- **Integration:** Test together before demo

---

## 📞 Support

Questions? Ask in the team chat!

Built with ❤️ by DebugDivas

