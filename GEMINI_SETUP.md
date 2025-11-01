# 🤖 Google Gemini AI Integration Guide

## Step 1: Get FREE Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIzaSy...`)

---

## Step 2: Create `.env` File

1. In your project root (`DebugDivas/`), create a new file named: `.env`

2. Add this content:

```env
VITE_GEMINI_API_KEY=your-api-key-here
```

3. Replace `your-api-key-here` with your actual API key

**Example:**
```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
```

---

## Step 3: Restart Dev Server

After creating `.env`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Verify Setup

Open browser console (F12) and check for:
- ✅ "Using Gemini AI" message
- ❌ No "API key not found" errors

---

## 🔒 Security Note

- **.env is already in .gitignore** (safe!)
- Never commit your API key to git
- Don't share your API key publicly

---

## 📊 Free Tier Limits

- **60 requests per minute** (plenty for testing!)
- **1,500 requests per day**
- No credit card required

---

## 🆘 Troubleshooting

**"API key not found"**
- Check `.env` file exists in project root
- Check the key starts with `VITE_`
- Restart dev server

**"Invalid API key"**
- Verify key is correct
- Create new key at makersuite.google.com

**CORS errors**
- This is normal for local development
- Gemini API works fine despite CORS warnings

