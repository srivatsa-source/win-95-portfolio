# 🧪 Testing Your OpenAI Chatbot Integration

Quick reference for testing Ora the chatbot locally and in production.

## 🏠 Local Testing

### Step 1: Start Backend Server

**Windows:**
```bash
# Quick start with batch file
start-backend.bat

# OR manually
cd backend
npm install
npm start
```

**Mac/Linux:**
```bash
cd backend
npm install
npm start
```

Expected output:
```
🐱 Ora the cat chatbot server is running on port 3000
📡 API endpoint: http://localhost:3000/api/chat
```

### Step 2: Test Backend API

**Using curl (Windows PowerShell):**
```powershell
curl -X POST http://localhost:3000/api/chat `
  -H "Content-Type: application/json" `
  -d '{"message": "Hello Ora!"}'
```

**Using curl (Mac/Linux):**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Ora!"}'
```

**Expected Response:**
```json
{
  "reply": "Hey there! 🐱 Nice to meet you! I'm Ora...",
  "timestamp": "2025-11-09T12:34:56.789Z"
}
```

### Step 3: Start Frontend

**Option 1: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"
- Opens at `http://localhost:5500`

**Option 2: Python Server**
```bash
python -m http.server 5500
```

**Option 3: Node http-server**
```bash
npx http-server -p 5500
```

### Step 4: Test in Browser

1. Open `http://localhost:5500`
2. Click the chat icon (or "Chat with Ora" in start menu)
3. Type: "Hello Ora!"
4. Press Enter or click Send
5. **Expected:** Ora responds with AI-generated message in ~2-3 seconds

## ✅ Verification Checklist

### Backend Health Check

```bash
# Should return: {"status":"online","message":"Ora the cat chatbot is running!..."}
curl http://localhost:3000/
```

- ✅ Server running on port 3000
- ✅ Health endpoint returns status
- ✅ Chat endpoint responds to POST requests
- ✅ Responses include "reply" and "timestamp"
- ✅ No console errors in backend logs

### Frontend Integration Check

**Open Browser Console (F12):**

1. **No CORS Errors:**
   - Should NOT see: "CORS policy: No 'Access-Control-Allow-Origin'"
   - If you do: Add `http://localhost:5500` to `ALLOWED_ORIGINS` in backend `.env`

2. **Successful API Calls:**
   - Look for: `POST http://localhost:3000/api/chat 200`
   - Response time: 1-5 seconds (depending on OpenAI)

3. **Chat Messages Display:**
   - User message appears immediately
   - Typing indicator shows while waiting
   - Ora's response appears after API call
   - Timestamp shows current time

### Common Test Messages

```
✅ "Hello Ora!" 
   → Should introduce herself warmly

✅ "What are Srivatsa's skills?"
   → Should list technical skills (HTML, CSS, JS, React, Unity, Figma)

✅ "Tell me about his projects"
   → Should mention Cook n Klean, games, portfolio

✅ "Who is Srivatsa?"
   → Should give overview of designer/developer background

✅ "Thanks!"
   → Should respond politely with personality
```

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Check 1: Backend Running?**
```bash
curl http://localhost:3000/
```
- ❌ Connection refused → Backend not running
- ✅ Returns status → Backend is up

**Check 2: Correct URL in chat.js?**
```javascript
// Should be:
const API_URL = 'http://localhost:3000/api/chat';
```

**Check 3: CORS Configured?**
```env
# In backend/.env
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

### Error: "CORS policy"

**Fix: Update backend/.env**
```env
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

**Then restart backend:**
```bash
# Stop server (Ctrl+C)
npm start
```

### Error: "Authentication error"

**Symptoms:**
- Backend returns 500 error
- Backend logs: "OpenAI API Error: 401"

**Fix: Check API Key**
1. Open `backend/.env`
2. Verify `OPENAI_API_KEY=sk-proj-...` (starts with `sk-proj-`)
3. Get new key: https://platform.openai.com/api-keys
4. Restart backend

### Ora Shows Fallback Message

**Fallback Message:**
> "Meow! I'm having trouble connecting to my brain right now..."

**Causes:**
- Backend not running
- Wrong API URL in frontend
- Network error
- OpenAI API error

**Debug:**
```javascript
// In chat.js, check console for:
console.error('Chat error:', error);
// Look for specific error message
```

### Typing Indicator Stuck

**Symptoms:**
- Typing indicator doesn't disappear
- No response from Ora

**Causes:**
- API timeout (>30 seconds)
- JavaScript error in response handling

**Fix:**
1. Check browser console for errors
2. Test backend directly with curl
3. Check OpenAI dashboard for issues

## 🌐 Production Testing

### After Deploying Backend

**Test Deployed API:**
```bash
# Replace with your actual deployed URL
curl -X POST https://ora-chatbot-backend.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

**Expected:**
- ✅ 200 OK status
- ✅ JSON response with "reply"
- ✅ Response time <5 seconds

### After Deploying Frontend

1. **Visit your deployed site**
   - GitHub Pages: `https://yourusername.github.io/repo-name`

2. **Test chat functionality**
   - Open chat window
   - Send message
   - Verify response

3. **Check browser console**
   - No CORS errors
   - Successful API calls
   - Correct API URL being used

### Production Checklist

- ✅ Backend deployed and running (check health endpoint)
- ✅ Frontend deployed with correct API_URL
- ✅ CORS includes production domain
- ✅ HTTPS enabled on both frontend and backend
- ✅ Environment variables set in hosting platform
- ✅ OpenAI API key working
- ✅ No console errors in production

## 📊 Performance Testing

### Response Time
- **Good:** <3 seconds
- **Acceptable:** 3-5 seconds
- **Slow:** >5 seconds (check OpenAI status)

### Test Different Message Types

**Short message:**
```
"Hi!"
```
Expected: Fast response (~1-2 seconds)

**Medium message:**
```
"Can you tell me about Srivatsa's experience and what projects he's worked on?"
```
Expected: Normal response (~2-3 seconds)

**Long message:**
```
"I'm really interested in learning about all of Srivatsa's technical skills, his project experience, and what kind of design work he specializes in. Can you give me a comprehensive overview?"
```
Expected: Slower response (~3-5 seconds)

## 🔍 Monitoring

### Watch Backend Logs

**Local:**
```bash
# Backend terminal shows each request
POST /api/chat 200 1234ms
```

**Production (Render):**
- Dashboard → Your service → Logs tab
- Real-time log streaming

**Production (Railway):**
- Project → Deployments → View Logs

### Monitor OpenAI Usage

1. Visit: https://platform.openai.com/usage
2. Check tokens used today
3. Verify within budget
4. Set usage alerts

### Frontend Monitoring

**Add to chat.js (after line where response is received):**
```javascript
console.log('Chat metrics:', {
    timestamp: new Date().toISOString(),
    messageLength: message.length,
    responseLength: data.reply.length,
    responseTime: Date.now() - startTime
});
```

## 🎯 Test Scenarios

### Scenario 1: First Time Visitor
1. Open portfolio
2. See welcome window with Ora
3. Click "Chat with Ora" button
4. Send first message
5. Verify friendly introduction

### Scenario 2: Quick Questions
1. Click quick action buttons
2. Verify each sends message and gets response
3. Check different cat avatars appear

### Scenario 3: Conversation Flow
1. Ask about skills
2. Follow up with project question
3. Ask about contact info
4. Verify context maintained (if conversation history enabled)

### Scenario 4: Error Handling
1. Stop backend server
2. Try sending message
3. Verify fallback message appears
4. Restart backend
5. Verify chatbot works again

### Scenario 5: Mobile Testing
1. Open on mobile device or DevTools mobile view
2. Chat window appears correctly
3. Keyboard doesn't cover input
4. Messages scroll properly
5. Touch interactions work

## 📱 Mobile Testing

**Chrome DevTools:**
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Select device: iPhone 12 Pro
3. Test chat functionality
4. Check responsive layout
5. Verify touch interactions

**Real Device:**
1. Deploy to GitHub Pages
2. Open on phone
3. Test all chat features
4. Check message display
5. Verify keyboard behavior

## ✅ Final Validation

Before considering integration complete:

- [ ] Backend responds to test messages
- [ ] Frontend displays responses correctly
- [ ] Error handling works (backend offline scenario)
- [ ] CORS configured properly
- [ ] API key secure and working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Production deployment working
- [ ] OpenAI usage within budget
- [ ] All test messages successful

## 🎉 Success Criteria

**You've successfully integrated the chatbot when:**

1. ✅ Visitor can open chat window
2. ✅ Send message to Ora
3. ✅ Receive AI-generated response in <5 seconds
4. ✅ Conversation feels natural and contextual
5. ✅ Ora's personality shows through (friendly cat assistant)
6. ✅ Accurate information about Srivatsa
7. ✅ Works on desktop and mobile
8. ✅ No errors in console
9. ✅ Graceful error handling if API fails

---

**Happy Testing! 🐱✨**

If you encounter issues, refer to:
- [CHATBOT_INTEGRATION_GUIDE.md](CHATBOT_INTEGRATION_GUIDE.md) - Complete setup guide
- [backend/README.md](backend/README.md) - Backend documentation
- OpenAI Status: https://status.openai.com/
