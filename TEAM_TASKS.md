# 👥 DevFix.AI - Team Task Breakdown

## 📋 Overview
5 team members, 5 parallel tracks, 12-hour deadline

**Integration Point:** All code merges to `main` branch after testing

---

## 👤 TEAM MEMBER 1: UI Components 🎨

**Branch:** `feature/ui-components`

### Your Mission
Build all the visual components users will interact with. Focus on clean, dark-themed UI matching Cursor's aesthetic.

### Tasks Checklist

#### Phase 1: Input Components (2 hours)
- [ ] Create `src/components/LogInputPanel.tsx`
  - Textarea for log input
  - Dropdown for manual log type selection
  - "Analyze" button with loading state
  - Character counter
  - Clear button
  
- [ ] Create `src/components/Button.tsx`
  - Primary, secondary, danger variants
  - Loading spinner integration
  - Icon support

#### Phase 2: Display Components (2 hours)
- [ ] Create `src/components/AnalysisResult.tsx`
  - Root cause section
  - Explanation section
  - Fix code/config display with syntax highlighting
  - Command suggestions with copy button
  - Success criteria display
  
- [ ] Create `src/components/Tabs.tsx`
  - Reusable tab component
  - Active state styling
  - Keyboard navigation

#### Phase 3: History & Utility (2 hours)
- [ ] Create `src/components/LogHistory.tsx`
  - List of saved logs
  - Search/filter bar
  - Log preview cards
  - Delete/favorite buttons
  
- [ ] Create `src/components/LoadingSpinner.tsx`
  - Animated spinner
  - Multiple sizes (sm, md, lg)
  - Optional text prop

- [ ] Create `src/components/Card.tsx`
  - Reusable card wrapper
  - Cursor dark theme styling

#### Phase 4: Polish (1 hour)
- [ ] Add animations (fade in, slide)
- [ ] Test responsive design
- [ ] Add tooltips
- [ ] Create `src/components/index.ts` barrel export

### Key Files You'll Own
```
src/components/
├── LogInputPanel.tsx
├── AnalysisResult.tsx
├── LogHistory.tsx
├── LoadingSpinner.tsx
├── Button.tsx
├── Tabs.tsx
├── Card.tsx
├── CopyButton.tsx
└── index.ts
```

### Design Specs
- **Colors:** Use Tailwind config cursor theme
- **Fonts:** Segoe UI for text, Courier New for code
- **Spacing:** Consistent 4px grid system
- **Icons:** Use lucide-react

### Testing
```bash
npm run dev
# Open http://localhost:5173
# Test all components manually
```

---

## 👤 TEAM MEMBER 2: Core Logic & Detection 🧠

**Branch:** `feature/core-logic`

### Your Mission
Build the brain of DevFix.AI - detect log types, parse errors, and orchestrate the analysis flow.

### Tasks Checklist

#### Phase 1: Log Type Detection (2 hours)
- [ ] Create `src/core/logDetector.ts`
  - `detectLogType(log: string): DetectionResult`
  - Pattern matching for each log type
  - Confidence scoring
  - Support: Node.js, Python, Docker, GitHub Actions, Vercel, Nginx

- [ ] Create `src/core/patterns.ts`
  - Regex patterns for each error type
  - Error signatures database
  - Common error messages

#### Phase 2: Error Parsing (2 hours)
- [ ] Create `src/core/errorParser.ts`
  - Extract stack traces
  - Parse line numbers and file paths
  - Extract error messages
  - Identify error codes

- [ ] Create `src/core/categories.ts`
  - Define error categories
  - Severity levels (info, warning, error, critical)
  - Categorization logic

#### Phase 3: Analysis Orchestration (2 hours)
- [ ] Create `src/core/analyzer.ts`
  - `analyzeLog(log: string, type: LogType): Promise<Analysis>`
  - Coordinate detection → parsing → prompt generation
  - Handle errors gracefully
  - Return structured Analysis object

- [ ] Create `src/core/confidenceScorer.ts`
  - Score analysis confidence
  - Flag uncertain analyses

#### Phase 4: Integration (1 hour)
- [ ] Create `src/core/index.ts` barrel export
- [ ] Write unit tests
- [ ] Document functions

### Key Files You'll Own
```
src/core/
├── logDetector.ts
├── errorParser.ts
├── analyzer.ts
├── patterns.ts
├── categories.ts
├── confidenceScorer.ts
└── index.ts
```

### Detection Example
```typescript
detectLogType("TypeError: Cannot read property 'x' of undefined")
// Returns: { logType: 'node', confidence: 95, patterns: ['TypeError'] }
```

### Testing
```bash
npm test
# Test with sample logs from src/prompts/sampleLogs.ts
```

---

## 👤 TEAM MEMBER 3: AI Prompts & Intelligence 🤖

**Branch:** `feature/ai-prompts`

### Your Mission
Craft the AI prompts that turn error logs into actionable fixes. You're the voice of DevFix.AI.

### Tasks Checklist

#### Phase 1: System Prompts (2 hours)
- [ ] Create `src/prompts/systemPrompts.ts`
  - Master system prompt
  - Specialized prompts for each log type:
    - Node.js errors
    - Python errors
    - Docker build failures
    - GitHub Actions failures
    - Vercel deployment issues
    - Nginx errors

#### Phase 2: Prompt Templates (2 hours)
- [ ] Create `src/prompts/promptTemplates.ts`
  - Template builder function
  - Variable interpolation
  - Context injection
  - Few-shot examples for each type

- [ ] Create `src/prompts/examples.ts`
  - Input/output examples for AI
  - Best practice fixes
  - Common patterns

#### Phase 3: Response Processing (2 hours)
- [ ] Create `src/prompts/responseParser.ts`
  - Parse AI responses into Analysis type
  - Extract code blocks
  - Extract commands
  - Validate response structure

- [ ] Create `src/prompts/fixGenerator.ts`
  - Generate diff patches
  - Suggest file locations
  - Provide context for fixes

#### Phase 4: Sample Logs for Demo (1 hour)
- [ ] Create `src/prompts/sampleLogs.ts`
  - 6+ realistic error examples
  - Cover all supported log types
  - Include expected analyses
  - One-click demo mode

### Key Files You'll Own
```
src/prompts/
├── systemPrompts.ts
├── promptTemplates.ts
├── responseParser.ts
├── fixGenerator.ts
├── examples.ts
├── sampleLogs.ts
└── index.ts
```

### Example System Prompt Structure
```typescript
export const SYSTEM_PROMPTS = {
  node: `You are DevFix.AI analyzing a Node.js error...
  
  Return format:
  ## Root Cause
  ## Explanation
  ## Fix Code
  ## Commands
  ## Success Criteria`,
  
  // ... other types
}
```

### Testing
Test prompt quality by running sample logs through analyzer

---

## 👤 TEAM MEMBER 4: Log Storage & History 💾

**Branch:** `feature/log-storage`

### Your Mission
Implement the persistence layer - save logs, enable search, and allow export/import.

### Tasks Checklist

#### Phase 1: Storage Engine (2 hours)
- [ ] Create `src/storage/logStorage.ts`
  - `saveLog(log: ErrorLog): Promise<void>`
  - `updateLog(id: string, updates: Partial<ErrorLog>): Promise<void>`
  - `deleteLog(id: string): Promise<void>`
  - Support localStorage AND file system
  - Handle storage quota errors

- [ ] Create `src/storage/database.ts`
  - Initialize storage
  - Schema management
  - Migration support
  - Clear all logs function

#### Phase 2: Retrieval & Search (2 hours)
- [ ] Create `src/storage/logRetrieval.ts`
  - `getAllLogs(): Promise<ErrorLog[]>`
  - `getLogById(id: string): Promise<ErrorLog | null>`
  - `getRecentLogs(limit: number): Promise<ErrorLog[]>`
  - Pagination support

- [ ] Create `src/storage/logSearch.ts`
  - `searchLogs(filters: SearchFilters): Promise<ErrorLog[]>`
  - Filter by: type, date range, tags, favorites
  - Full-text search in logs
  - Sort options

#### Phase 3: Import/Export (2 hours)
- [ ] Create `src/storage/exportImport.ts`
  - `exportLogs(logIds: string[]): ExportData`
  - `exportAllLogs(): ExportData`
  - `importLogs(data: ExportData): Promise<void>`
  - JSON format with metadata
  - Validate import data

- [ ] Create `src/storage/tags.ts`
  - Add/remove tags from logs
  - Get all tags
  - Tag autocomplete

#### Phase 4: Advanced Features (1 hour)
- [ ] Create `src/storage/favorites.ts`
  - Toggle favorite status
  - Get all favorites

- [ ] Create `src/storage/stats.ts`
  - Count logs by type
  - Get most common errors
  - Storage usage stats

### Key Files You'll Own
```
src/storage/
├── logStorage.ts
├── database.ts
├── logRetrieval.ts
├── logSearch.ts
├── exportImport.ts
├── tags.ts
├── favorites.ts
├── stats.ts
└── index.ts
```

### Storage Schema
```typescript
// localStorage key: 'devfix_logs'
// Value: ErrorLog[]
```

### File Storage Format
```
logs/
├── 2025-11-01-error-123.json
├── 2025-11-01-error-124.json
└── index.json (metadata)
```

### Testing
```bash
# Test CRUD operations
# Test with 100+ logs
# Test search performance
# Test export/import round-trip
```

---

## 👤 TEAM MEMBER 5: Utilities & Integration 🔧

**Branch:** `feature/utilities`

### Your Mission
Build helper utilities and integrate everything together - the glue code that makes it all work.

### Tasks Checklist

#### Phase 1: API Integration (2 hours)
- [ ] Create `src/utils/api.ts`
  - Call AI model (Cursor API or OpenAI)
  - Handle rate limits
  - Retry logic
  - Error handling
  - Mock mode for testing

- [ ] Create `src/utils/config.ts`
  - App configuration
  - API keys management
  - Feature flags
  - Default settings

#### Phase 2: System Integration (2 hours)
- [ ] Create `src/utils/clipboard.ts`
  - `copyToClipboard(text: string): Promise<void>`
  - `pasteFromClipboard(): Promise<string>`
  - Show success notifications

- [ ] Create `src/utils/fileSystem.ts`
  - Read/write files (if needed)
  - Path normalization
  - Check file existence
  - Create directories

#### Phase 3: Helper Functions (2 hours)
- [ ] Create `src/utils/helpers.ts`
  - `generateId(): string`
  - `formatDate(date: Date): string`
  - `truncateText(text: string, maxLength: number): string`
  - `debounce()` and `throttle()`
  - `formatFileSize(bytes: number): string`

- [ ] Create `src/utils/validators.ts`
  - Validate log input
  - Validate export data
  - Check storage limits

#### Phase 4: Final Integration (1 hour)
- [ ] Create `src/utils/commandRunner.ts` (optional)
  - Parse command suggestions
  - Format for terminal
  - Safety warnings

- [ ] Create `src/utils/notifications.ts`
  - Success/error toast messages
  - Progress indicators
  - Confirmation dialogs

- [ ] Update `src/App.tsx` to wire everything together
  - Connect all components
  - Handle state management
  - Error boundaries

### Key Files You'll Own
```
src/utils/
├── api.ts
├── config.ts
├── clipboard.ts
├── fileSystem.ts
├── helpers.ts
├── validators.ts
├── commandRunner.ts
├── notifications.ts
└── index.ts
```

### Integration Points
- Connect Team 1's UI → Team 2's logic
- Connect Team 2's analyzer → Team 3's prompts
- Connect all components → Team 4's storage
- Add error handling everywhere

### Testing
```bash
# Integration tests
# End-to-end flow test
# Error handling test
```

---

## 🔄 Integration Timeline

| Hour | All Teams Do                    |
|------|---------------------------------|
| 0-6  | Work on individual features     |
| 6    | **First Integration Checkpoint** |
|      | - Push all branches             |
|      | - Quick team sync               |
|      | - Test imports/exports          |
| 7-10 | Continue features + fix issues  |
| 10   | **Final Integration**            |
|      | - Merge all to main             |
|      | - Full testing                  |
|      | - Fix breaking changes          |
| 11   | Polish UI, add sample data      |
| 12   | Demo ready! 🎉                  |

---

## ✅ Definition of Done

Each team member should:
- [ ] All files created and in correct directory
- [ ] TypeScript compiles with no errors
- [ ] Functions have JSDoc comments
- [ ] Tested individually
- [ ] Pushed to feature branch
- [ ] Created PR with description
- [ ] Code reviewed by 1 other team member
- [ ] Merged to main

---

## 🆘 Getting Help

**Stuck?** Check:
1. Type definitions in `src/types/index.ts`
2. Team chat
3. README.md for setup
4. Ask another team member

**Conflicts?** 
- Pull from main frequently
- Communicate before modifying shared files

---

## 🎯 Success Metrics

- [ ] All 5 feature branches merged
- [ ] App runs without errors
- [ ] Can analyze a real error log
- [ ] Can save and retrieve logs
- [ ] Demo flows smoothly
- [ ] UI looks professional

---

Good luck, DebugDivas! Let's ship this! 🚀

