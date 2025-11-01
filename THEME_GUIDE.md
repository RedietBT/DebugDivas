# 🌓 Dark/Light Mode Theme Guide

## Overview

Vibe Assist now supports both **Dark Mode** and **Light Mode** with a smooth toggle animation!

---

## Features

✅ **Theme Toggle Button** - Sun/Moon icon in header  
✅ **Persistent Storage** - Theme preference saved in localStorage  
✅ **System Preference** - Can detect OS theme preference  
✅ **Smooth Transitions** - Animated icon rotation on toggle  
✅ **Full Coverage** - All components support both themes  

---

## How It Works

### Theme Provider

The `ThemeProvider` component wraps the entire app and manages theme state:

```tsx
<ThemeProvider defaultTheme="dark" storageKey="vibe-assist-theme">
  <App />
</ThemeProvider>
```

### Theme Toggle Button

Located in the header, users can click the Sun/Moon icon to switch themes:

```tsx
<ThemeToggle />
```

- **Light Mode:** Shows Sun icon
- **Dark Mode:** Shows Moon icon
- **Animation:** Smooth rotation when toggling

---

## Color Schemes

### Light Mode (Default Root)
```css
--background: 0 0% 100%          /* White */
--foreground: 222.2 84% 4.9%     /* Dark text */
--primary: 263 70% 50%           /* Purple (same) */
--card: 0 0% 100%                /* White cards */
--muted: 210 40% 96.1%           /* Light gray */
--border: 214.3 31.8% 91.4%      /* Light border */
```

### Dark Mode (.dark class)
```css
--background: 222.2 84% 4.9%     /* Deep dark */
--foreground: 210 40% 98%        /* Light text */
--primary: 263 70% 50%           /* Purple (same) */
--card: 222.2 84% 4.9%           /* Dark cards */
--muted: 217.2 32.6% 17.5%       /* Dark gray */
--border: 217.2 32.6% 17.5%      /* Dark border */
```

---

## Usage

### For Users

1. **Click the Sun/Moon icon** in the top-right header
2. Theme preference is **automatically saved**
3. Your choice persists across browser sessions

### For Developers

#### Using the Theme Hook

```tsx
import { useTheme } from '@/components/theme-provider'

function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  // Get current theme
  console.log(theme) // 'dark' | 'light' | 'system'
  
  // Change theme
  setTheme('dark')
  setTheme('light')
  setTheme('system') // Use OS preference
}
```

#### Creating Theme-Aware Components

All shadcn/ui components automatically support both themes via CSS variables:

```tsx
// This works in both light and dark mode
<Card className="bg-card text-card-foreground">
  <Button className="bg-primary text-primary-foreground">
    Click me
  </Button>
</Card>
```

#### Custom Theme Styling

Use Tailwind's `dark:` prefix for dark-mode specific styles:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  This changes based on theme
</div>
```

---

## Implementation Details

### 1. Theme Provider (`theme-provider.tsx`)
- React Context for theme state
- localStorage persistence
- System preference detection
- Auto-applies `.dark` class to `<html>`

### 2. Theme Toggle (`theme-toggle.tsx`)
- Sun/Moon icon button
- Smooth rotation animation
- Accessible with screen reader support

### 3. CSS Variables (`index.css`)
- `:root` for light mode (default)
- `.dark` for dark mode override
- HSL color format for flexibility

### 4. HTML Class Management
- `<html>` element gets `.dark` class in dark mode
- Removed hardcoded `class="dark"` from HTML
- Theme provider dynamically adds/removes class

---

## Browser Compatibility

✅ All modern browsers (Chrome, Firefox, Safari, Edge)  
✅ localStorage support required  
✅ CSS custom properties required  
✅ Prefers-color-scheme media query for system detection  

---

## Customization

### Change Default Theme

Edit `src/main.tsx`:

```tsx
<ThemeProvider defaultTheme="light"> {/* or "dark" or "system" */}
  <App />
</ThemeProvider>
```

### Add More Themes

1. Add new color variables in `src/index.css`
2. Create new class (e.g., `.blue-theme`)
3. Extend theme type in `theme-provider.tsx`

### Customize Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary: 263 70% 50%; /* Change this! */
}

.dark {
  --primary: 263 70% 60%; /* Different shade for dark mode */
}
```

---

## Accessibility

- ✅ **Keyboard Navigation:** Toggle button is keyboard accessible
- ✅ **Screen Readers:** Proper ARIA labels and semantic HTML
- ✅ **High Contrast:** Both themes meet WCAG standards
- ✅ **System Preference:** Respects OS-level theme settings

---

## Performance

- **Minimal Impact:** Theme state in React Context
- **No Re-renders:** Only affected components update
- **CSS Variables:** No JavaScript color calculations
- **localStorage:** Theme loads instantly on page refresh

---

## Troubleshooting

### Theme not persisting?
- Check if localStorage is enabled in browser
- Verify `storageKey` is unique (default: "vibe-assist-theme")

### Flash of wrong theme on load?
- This is expected, theme is applied after JS loads
- Consider adding SSR for production if needed

### Colors look wrong?
- Ensure all components use CSS variables (`bg-background`, not hardcoded colors)
- Check if custom styles override theme variables

---

## Future Enhancements

- [ ] Add more theme variants (blue, green, etc.)
- [ ] Theme preview before applying
- [ ] Smooth color transitions
- [ ] Per-component theme overrides
- [ ] Export/import theme preferences

---

**Enjoy your beautiful dark/light mode! 🌓**

Toggle away and find your perfect vibe! ✨

