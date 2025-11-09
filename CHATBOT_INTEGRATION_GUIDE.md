# 🐱 Ora Chatbot - OpenAI GPT Integration Guide

This guide explains how to integrate the OpenAI-powered chatbot "Ora" into your Windows 95 portfolio.

## 📋 Overview

**What's New:**
- Ora now uses OpenAI GPT models for intelligent, context-aware responses
- Backend server handles API calls securely
- Frontend seamlessly integrates with the existing UI
- Fallback to local knowledge if API is unavailable

## 🏗️ Architecture

```
┌─────────────────┐      HTTP POST      ┌──────────────────┐      OpenAI API      ┌─────────────┐
│   Frontend      │ ───────────────────> │   Backend        │ ──────────────────> │   OpenAI    │
│   (chat.js)     │ <─ ─ ─ ─ ─ ─ ─ ─ ─ │   (server.js)    │ <─ ─ ─ ─ ─ ─ ─ ─ ─ │   GPT API   │
└─────────────────┘      JSON Response   └──────────────────┘      AI Response     └─────────────┘
```

## 🚀 Quick Start (Local Development)

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)
5. **Important:** Save it securely - you won't see it again!

### Step 2: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env and add your API key
# Use notepad, VS Code, or any text editor
notepad .env
```

**In the `.env` file, add your key:**
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=3000
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

### Step 3: Start Backend Server

```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
🐱 Ora the cat chatbot server is running on port 3000
📡 API endpoint: http://localhost:3000/api/chat
```

### Step 4: Test the API

Open a new terminal and test:

```bash
curl -X POST http://localhost:3000/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Hello Ora!\"}"
```

Expected response:
```json
{
  "reply": "Hey there! 🐱 Nice to meet you! I'm Ora, Srivatsa's pixel cat assistant. What would you like to know about him?",
  "timestamp": "2025-11-09T12:34:56.789Z"
}
```

### Step 5: Run Frontend

Open your portfolio in a browser:

**Option A: Using Live Server (VS Code)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

**Option B: Using Python**
```bash
# In the main portfolio directory
python -m http.server 5500
```

**Option C: Using Node.js**
```bash
npx http-server -p 5500
```

Then visit: `http://localhost:5500`

### Step 6: Test Ora!

1. Click the chat icon to open Ora's window
2. Type "Hello!" and send
3. Ora should respond using GPT! 🎉

## 🌐 Production Deployment

### Deploy Backend

#### Option 1: Render (Recommended - Free Tier Available)

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select the repository

3. **Configure Build Settings:**
   - **Name:** `ora-chatbot-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Add Environment Variables:**
   - Click "Environment" tab
   - Add:
     - `OPENAI_API_KEY`: Your OpenAI key
     - `OPENAI_MODEL`: `gpt-4o-mini`
     - `ALLOWED_ORIGINS`: `https://yourusername.github.io` (or your domain)

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your service URL (e.g., `https://ora-chatbot-backend.onrender.com`)

#### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js
5. Add environment variables in Settings
6. Deploy!

#### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. In backend directory: `vercel`
3. Follow prompts
4. Set environment variables in Vercel dashboard
5. Deploy: `vercel --prod`

### Update Frontend

After deploying backend, update `js/chat.js`:

```javascript
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/chat'
    : 'https://ora-chatbot-backend.onrender.com/api/chat'; // ← Your deployed URL
```

### Deploy Frontend (GitHub Pages)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add OpenAI chatbot integration"
git push origin main
```

2. **Enable GitHub Pages:**
   - Go to your repo on GitHub
   - Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/root`
   - Save

3. **Update Backend CORS:**
   - In Render/Railway dashboard
   - Update `ALLOWED_ORIGINS` to: `https://yourusername.github.io`
   - Restart backend service

4. **Visit Your Site:**
   - `https://yourusername.github.io/repository-name`

## 🔧 Configuration

### Frontend Configuration

**File:** `js/chat.js`

```javascript
// Update this URL after deploying backend
const API_URL = 'https://your-backend-url.onrender.com/api/chat';
```

### Backend Configuration

**File:** `backend/.env`

```env
# OpenAI Settings
OPENAI_API_KEY=sk-proj-xxxx          # Your API key
OPENAI_MODEL=gpt-4o-mini             # Model to use

# Server Settings
PORT=3000                             # Port for local dev

# CORS (comma-separated allowed origins)
ALLOWED_ORIGINS=https://yourusername.github.io,https://www.yourdomain.com
```

### Customizing Ora's Personality

Edit `backend/server.js` - modify the `SYSTEM_PROMPT`:

```javascript
const SYSTEM_PROMPT = `You are Ora, a warm, friendly pixel-art cat...
- Add your custom personality traits here
- Update information about yourself
- Change tone, style, or behavior
`;
```

## 💰 Cost Management

### OpenAI Pricing (GPT-4o-mini)
- **Input:** ~$0.15 per 1M tokens
- **Output:** ~$0.60 per 1M tokens

### Typical Usage
- Average conversation: ~500 tokens
- Cost per 100 messages: **< $0.01**
- Monthly (1000 visitors, 3 messages each): **~$0.30**

### Free Tiers
- **Render:** 750 hours/month free
- **Railway:** $5 credit/month
- **Vercel:** 100GB bandwidth free
- **OpenAI:** $5 free credit for new accounts

### Cost Optimization Tips
1. Use `gpt-4o-mini` (cheapest GPT-4 quality model)
2. Reduce `max_tokens` to 200 in server.js
3. Add caching for common questions
4. Implement rate limiting (10 messages/minute per user)

## 🐛 Troubleshooting

### Ora Not Responding

**Check Backend:**
```bash
# Test health endpoint
curl http://localhost:3000/

# Should return: {"status":"online","message":"Ora the cat chatbot is running!..."}
```

**Check API Key:**
- Verify in OpenAI dashboard: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Check key in `.env` has no extra spaces
- Ensure key starts with `sk-proj-`

**Check CORS:**
- Frontend URL must be in `ALLOWED_ORIGINS`
- Restart backend after changing `.env`

### Error: "Failed to fetch response"

**Console Errors (F12):**
- `CORS error`: Add frontend URL to `ALLOWED_ORIGINS`
- `Network error`: Backend not running or wrong URL
- `500 error`: Check backend logs

**Backend Logs:**
- Authentication error → Invalid API key
- Rate limit → Wait 1 minute, try again
- Model error → Check model name in `.env`

### Local vs Production Issues

**Works Locally, Not in Production:**
1. Update `API_URL` in `js/chat.js` to deployed backend URL
2. Update `ALLOWED_ORIGINS` in backend to include production domain
3. Ensure backend is deployed and running
4. Check backend logs in hosting dashboard

**Works in Production, Not Locally:**
1. Backend not running → Start with `npm run dev`
2. Wrong port → Check port 3000 in `API_URL`
3. CORS → Add `http://localhost:5500` to `ALLOWED_ORIGINS`

## 📊 Monitoring

### OpenAI Usage
- Dashboard: [platform.openai.com/usage](https://platform.openai.com/usage)
- Set usage limits to prevent unexpected charges
- Monitor token usage per request

### Backend Monitoring
- **Render:** View logs in dashboard
- **Railway:** Real-time logs in project view
- **Vercel:** Functions tab → View invocations

### Frontend Analytics
Add to `chat.js` to track usage:
```javascript
// After successful response
console.log('Chat response received:', {
    timestamp: new Date(),
    messageLength: message.length,
    responseLength: data.reply.length
});
```

## 🔒 Security Checklist

- ✅ `.env` file in `.gitignore`
- ✅ API key stored in environment variables
- ✅ CORS restricted to your domains
- ✅ Input validation (message length limits)
- ✅ Error handling for API failures
- ✅ HTTPS in production
- ✅ Rate limiting enabled

## 🎨 Customization Ideas

### Add Conversation History
Store last 5 messages in context for better responses:

```javascript
// In server.js
const conversationHistory = [];
conversationHistory.push({ role: "user", content: userMessage });
// Pass conversationHistory to OpenAI
```

### Add Special Commands
```javascript
// In chat.js
if (message.startsWith('/help')) {
    // Show help menu
}
```

### Add Voice Input
Use Web Speech API:
```javascript
const recognition = new webkitSpeechRecognition();
recognition.onresult = (e) => {
    chatInput.value = e.results[0][0].transcript;
};
```

### Add Typing Animation
```javascript
// Animate Ora's response word by word
function typeResponse(text) {
    const words = text.split(' ');
    // Animate each word appearing
}
```

## 📚 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)

## 🎉 You're Done!

Ora is now powered by OpenAI GPT! Your visitors can have intelligent conversations about you, your work, and your projects.

**Next Steps:**
1. Deploy backend to Render/Railway
2. Update frontend API URL
3. Deploy frontend to GitHub Pages
4. Test everything
5. Monitor usage and costs
6. Customize Ora's personality
7. Add more features!

---

**Need Help?**
- Check backend logs for errors
- Test API with curl/Postman
- Review OpenAI dashboard for usage
- Verify all environment variables

**Enjoy your AI-powered chatbot! 🐱✨**

Made with 💙 by Srivatsa S
