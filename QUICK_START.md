# 🚀 Quick Start Guide - DevFix.AI

## ⚡ For Each Team Member

### 1️⃣ Initial Setup (5 minutes)

```bash
# Clone the repo (if not already done)
cd DebugDivas

# Install dependencies
npm install

# Verify installation
npm run dev
# Should open http://localhost:5173
```

### 2️⃣ Create Your Branch (1 minute)

```bash
# Check which team member you are (1-5) from TEAM_TASKS.md

# Team Member 1 - UI Components
git checkout -b feature/ui-components

# Team Member 2 - Core Logic
git checkout -b feature/core-logic

# Team Member 3 - AI Prompts
git checkout -b feature/ai-prompts

# Team Member 4 - Log Storage
git checkout -b feature/log-storage

# Team Member 5 - Utilities
git checkout -b feature/utilities
```

### 3️⃣ Start Coding!

Open `TEAM_TASKS.md` and find your section. Start with Phase 1!

---

## 📁 Where to Put Your Files

### Team Member 1 (UI Components)
```bash
# Create your files here:
src/components/
  ├── LogInputPanel.tsx
  ├── AnalysisResult.tsx
  ├── LogHistory.tsx
  ├── LoadingSpinner.tsx
  ├── Button.tsx
  ├── Tabs.tsx
  ├── Card.tsx
  └── index.ts
```

### Team Member 2 (Core Logic)
```bash
# Create your files here:
src/core/
  ├── logDetector.ts
  ├── errorParser.ts
  ├── analyzer.ts
  ├── patterns.ts
  ├── categories.ts
  └── index.ts
```

### Team Member 3 (AI Prompts)
```bash
# Create your files here:
src/prompts/
  ├── systemPrompts.ts
  ├── promptTemplates.ts
  ├── responseParser.ts
  ├── fixGenerator.ts
  ├── sampleLogs.ts
  └── index.ts
```

### Team Member 4 (Log Storage)
```bash
# Create your files here:
src/storage/
  ├── logStorage.ts
  ├── database.ts
  ├── logRetrieval.ts
  ├── logSearch.ts
  ├── exportImport.ts
  └── index.ts
```

### Team Member 5 (Utilities)
```bash
# Create your files here:
src/utils/
  ├── api.ts
  ├── config.ts
  ├── clipboard.ts
  ├── fileSystem.ts
  ├── helpers.ts
  └── index.ts
```

---

## 🔧 Essential Commands

```bash
# Start development server (hot reload)
npm run dev

# Build TypeScript
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Format code
npm run format

# Commit your work
git add .
git commit -m "feat: your feature description"

# Push to your branch
git push origin your-branch-name
```

---

## 📦 Key Dependencies You'll Use

### UI Components (Team 1)
```typescript
import React, { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import { ErrorLog, Analysis } from '@/types'
```

### Core Logic (Team 2)
```typescript
import { LogType, DetectionResult, ErrorLog } from '@/types'
```

### Prompts (Team 3)
```typescript
import { LogType, PromptTemplate, Analysis } from '@/types'
```

### Storage (Team 4)
```typescript
import { ErrorLog, SearchFilters, ExportData } from '@/types'
```

### Utils (Team 5)
```typescript
import { StorageConfig } from '@/types'
```

---

## 🎨 Style Guide

### Use Tailwind Classes
```tsx
// Good ✅
<button className="bg-cursor-accent hover:bg-blue-600 text-white px-4 py-2 rounded">
  Analyze
</button>

// Bad ❌
<button style={{backgroundColor: '#007acc'}}>
  Analyze
</button>
```

### Color Palette
```typescript
// Use these Tailwind classes:
bg-cursor-bg        // #1e1e1e - main background
bg-cursor-panel     // #252526 - panel background
border-cursor-border // #3e3e42 - borders
text-cursor-text    // #cccccc - text
text-cursor-accent  // #007acc - accent/links
text-cursor-error   // #f48771 - errors
text-cursor-success // #89d185 - success
```

---

## 🧪 Testing Your Code

### Manual Testing
```bash
npm run dev
# Open http://localhost:5173
# Test your feature
```

### Type Checking
```bash
npx tsc --noEmit
# Should show no errors
```

---

## 🔗 Import/Export Examples

### Exporting (in your file)
```typescript
// src/core/logDetector.ts
export function detectLogType(log: string): DetectionResult {
  // your code
}

export const PATTERNS = { ... }
```

### Importing (in other files)
```typescript
// src/App.tsx
import { detectLogType } from '@/core/logDetector'
import { ErrorLog } from '@/types'
```

### Barrel Exports (create index.ts in your folder)
```typescript
// src/core/index.ts
export * from './logDetector'
export * from './errorParser'
export * from './analyzer'
```

---

## 🆘 Troubleshooting

### "Module not found"
```bash
# Make sure you installed dependencies
npm install

# Check your import path
import { X } from '@/types'  # ✅ Correct
import { X } from '../types' # ❌ Don't use relative paths
```

### "Type errors"
```bash
# Check src/types/index.ts for type definitions
# Import types at the top of your file
import { ErrorLog, Analysis } from '@/types'
```

### "Port already in use"
```bash
# Kill the process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Then run again:
npm run dev
```

### Git conflicts
```bash
# Pull latest from main
git checkout main
git pull origin main

# Go back to your branch
git checkout your-branch-name

# Merge main into your branch
git merge main

# Fix conflicts in VS Code
# Then commit
git add .
git commit -m "merge: resolved conflicts"
```

---

## 📞 Communication

### Before You Start
- Read your section in `TEAM_TASKS.md`
- Check the shared types in `src/types/index.ts`
- Ask questions in team chat

### While Working
- Commit frequently (every 30-60 min)
- Push to your branch regularly
- Update team on progress

### When Stuck
1. Check README.md
2. Check TEAM_TASKS.md
3. Ask team member who depends on your work
4. Ask the whole team

---

## ⏰ Timeline Reminders

| Time | Checkpoint |
|------|------------|
| Hour 6 | First integration - push your code! |
| Hour 10 | Final merge - all features done |
| Hour 11 | Polish and testing |
| Hour 12 | DEMO TIME! 🎉 |

---

## ✅ Before You Push

- [ ] Code runs without errors
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Tested your feature manually
- [ ] Added comments to complex code
- [ ] Committed with a good message
- [ ] Pushed to YOUR branch (not main!)

---

## 🎯 Your First Task

1. Read your section in `TEAM_TASKS.md`
2. Create your first file (Phase 1, Task 1)
3. Write a basic skeleton
4. Test it runs
5. Commit and push
6. Move to next task

---

**Ready? Let's build! 🚀**

Questions? Check the main README.md or ask the team!

