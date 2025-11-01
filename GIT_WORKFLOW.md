# 🔀 Git Workflow for Team of 5

## 📐 Branch Strategy

```
main (protected)
├── feature/ui-components (Team Member 1)
├── feature/core-logic (Team Member 2)
├── feature/ai-prompts (Team Member 3)
├── feature/log-storage (Team Member 4)
└── feature/utilities (Team Member 5)
```

---

## 🚀 Initial Setup (Everyone Does This Once)

```bash
# 1. Navigate to project
cd DebugDivas

# 2. Make sure you're on main
git checkout main

# 3. Pull latest changes
git pull origin main

# 4. Create YOUR feature branch (pick one based on your role)

# Team Member 1:
git checkout -b feature/ui-components

# Team Member 2:
git checkout -b feature/core-logic

# Team Member 3:
git checkout -b feature/ai-prompts

# Team Member 4:
git checkout -b feature/log-storage

# Team Member 5:
git checkout -b feature/utilities

# 5. Verify you're on the correct branch
git branch
# Should show * next to your branch name
```

---

## 💾 Daily Workflow (Repeat Throughout the Day)

### Morning / Start of Session

```bash
# 1. Make sure you're on YOUR branch
git checkout feature/your-branch-name

# 2. Pull latest from main (in case others merged)
git checkout main
git pull origin main
git checkout feature/your-branch-name

# 3. Merge main into your branch
git merge main

# 4. If there are conflicts, resolve them in VS Code
# Then:
git add .
git commit -m "merge: resolved conflicts with main"
```

### While Working (Every 30-60 minutes)

```bash
# 1. Check what files you've changed
git status

# 2. Add your changes
git add .

# Or add specific files:
git add src/components/Button.tsx

# 3. Commit with a good message
git commit -m "feat: add Button component with loading state"

# 4. Push to YOUR branch
git push origin feature/your-branch-name

# If it's your first push:
git push -u origin feature/your-branch-name
```

---

## ✍️ Commit Message Convention

Use this format: `type: description`

### Types:
- `feat:` - New feature
  - Example: `feat: add log type detector`
- `fix:` - Bug fix
  - Example: `fix: resolve clipboard copy issue`
- `docs:` - Documentation only
  - Example: `docs: add API usage examples`
- `style:` - Code formatting (no logic change)
  - Example: `style: format Button component`
- `refactor:` - Code restructure (no feature change)
  - Example: `refactor: simplify detection logic`
- `test:` - Adding tests
  - Example: `test: add logDetector tests`
- `chore:` - Build/config changes
  - Example: `chore: update dependencies`

### Examples:
```bash
git commit -m "feat: add LogInputPanel component"
git commit -m "fix: handle empty log input"
git commit -m "docs: update README with examples"
git commit -m "refactor: extract parsing logic to separate function"
```

---

## 🔄 Integration Checkpoints

### Checkpoint 1 (Hour 6)

```bash
# 1. Commit all your current work
git add .
git commit -m "feat: checkpoint - completed Phase 1 & 2"

# 2. Push to your branch
git push origin feature/your-branch-name

# 3. Check if others have merged to main
git checkout main
git pull origin main

# 4. Go back to your branch and merge main
git checkout feature/your-branch-name
git merge main

# 5. Fix any conflicts, then push
git push origin feature/your-branch-name
```

### Checkpoint 2 (Hour 10 - Final Integration)

This is when you merge YOUR branch into `main`.

**Option A: Via Pull Request (Recommended)**

1. Go to GitHub/GitLab
2. Click "New Pull Request"
3. Select: `feature/your-branch` → `main`
4. Add title: "Feature: [Your Feature Name]"
5. Add description of what you built
6. Request review from 1 team member
7. Wait for approval
8. Click "Merge Pull Request"

**Option B: Direct Merge (Faster)**

```bash
# 1. Make sure all your work is committed and pushed
git add .
git commit -m "feat: completed all tasks"
git push origin feature/your-branch-name

# 2. Switch to main
git checkout main

# 3. Pull latest
git pull origin main

# 4. Merge YOUR branch into main
git merge feature/your-branch-name

# 5. If conflicts, resolve them
# Then:
git add .
git commit -m "merge: integrate [your feature]"

# 6. Push to main
git push origin main

# 7. Notify team in chat
```

---

## 🆘 Common Issues & Solutions

### Issue 1: "Your branch is behind 'origin/main'"

```bash
git checkout main
git pull origin main
git checkout feature/your-branch
git merge main
```

### Issue 2: Merge Conflicts

```bash
# 1. Git will tell you which files have conflicts
# 2. Open those files in VS Code
# 3. Look for conflict markers:

<<<<<<< HEAD
your code
=======
their code
>>>>>>> main

# 4. Choose which code to keep (or combine them)
# 5. Remove the markers (<<<<, ====, >>>>)
# 6. Save the file
# 7. Mark as resolved:

git add conflicted-file.ts

# 8. Complete the merge:
git commit -m "merge: resolved conflicts"
```

### Issue 3: "I committed to wrong branch!"

```bash
# If you haven't pushed yet:

# 1. Undo the commit (but keep changes)
git reset --soft HEAD~1

# 2. Switch to correct branch
git checkout correct-branch-name

# 3. Commit again
git add .
git commit -m "feat: your message"
```

### Issue 4: "I need to undo my last commit"

```bash
# Undo commit but keep changes:
git reset --soft HEAD~1

# Undo commit AND discard changes (BE CAREFUL):
git reset --hard HEAD~1
```

### Issue 5: "I accidentally worked on main instead of my branch"

```bash
# 1. DON'T commit yet
# 2. Stash your changes
git stash

# 3. Switch to your branch
git checkout feature/your-branch

# 4. Apply your changes
git stash pop

# 5. Now commit
git add .
git commit -m "feat: your message"
```

---

## 📋 Pre-Merge Checklist

Before merging to main, verify:

- [ ] All your code is committed
- [ ] Code runs without errors (`npm run dev`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] You've pulled latest from main
- [ ] You've merged main into your branch
- [ ] All conflicts are resolved
- [ ] You've tested your feature
- [ ] You've pushed to your branch

---

## 🎯 Team Coordination

### Before You Merge to Main:

1. **Announce in team chat**: "I'm about to merge [feature name] to main"
2. **Wait 2 minutes** for objections
3. **Merge**
4. **Announce**: "✅ Merged [feature name] to main"
5. **Tell others to pull**: "Everyone pull from main now"

### When Someone Else Merges:

```bash
# 1. Commit your current work
git add .
git commit -m "wip: save current progress"

# 2. Pull their changes
git checkout main
git pull origin main

# 3. Go back to your branch
git checkout feature/your-branch

# 4. Merge main into your branch
git merge main

# 5. Resolve conflicts if any
# 6. Continue working
```

---

## 🔍 Useful Git Commands

```bash
# See what you've changed
git status

# See detailed changes
git diff

# See commit history
git log --oneline

# See all branches
git branch -a

# See current branch
git branch

# Discard changes in a file
git checkout -- filename.ts

# Discard ALL changes (BE CAREFUL!)
git reset --hard HEAD

# See who changed what
git blame filename.ts

# Search commit history
git log --grep="search term"
```

---

## 🎨 Git Aliases (Optional Shortcuts)

Add to your `~/.gitconfig`:

```ini
[alias]
    s = status
    a = add .
    c = commit -m
    p = push
    co = checkout
    br = branch
    l = log --oneline --graph --all
```

Then use:
```bash
git s       # instead of git status
git a       # instead of git add .
git c "msg" # instead of git commit -m "msg"
```

---

## ⏰ Timeline Reminders

| Time | Git Action |
|------|------------|
| Hour 0 | Create your branch |
| Hour 1-5 | Commit every 30-60 min |
| Hour 6 | **Checkpoint 1** - push all work |
| Hour 7-9 | Continue committing regularly |
| Hour 10 | **Checkpoint 2** - merge to main |
| Hour 11 | Pull latest, test integration |
| Hour 12 | Final commit, ready for demo |

---

## 📞 Need Help?

- **Git issues?** Ask Team Member 5 (Utilities - they're integrating everything)
- **Merge conflicts?** Pair with the person whose code conflicts with yours
- **Lost code?** Check `git reflog` (it's often recoverable!)

---

**Remember:** Commit early, commit often, push regularly! 🚀

