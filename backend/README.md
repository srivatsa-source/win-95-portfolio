# Ora Chatbot Backend - OpenAI Integration

This is the backend server for Ora the cat chatbot, powering the AI responses in Srivatsa's Windows 95 portfolio website.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. **Run the server:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Edit the `.env` file:

```env
# Your OpenAI API key (REQUIRED)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# OpenAI model to use (optional, default: gpt-4o-mini)
# Options: gpt-4o-mini, gpt-4o, gpt-3.5-turbo
OPENAI_MODEL=gpt-4o-mini

# Server port (optional, default: 3000)
PORT=3000

# Allowed origins for CORS (comma-separated)
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

### CORS Configuration

For local development:
```env
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

For production (update with your actual domain):
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📡 API Endpoints

### `GET /`
Health check endpoint
- Returns server status and timestamp

### `POST /api/chat`
Chat endpoint for Ora the cat

**Request:**
```json
{
  "message": "Tell me about Srivatsa's skills"
}
```

**Response:**
```json
{
  "reply": "Meow! Srivatsa is skilled in HTML, CSS, JavaScript, React, Unity, and Figma. He loves creating interactive retro-themed experiences like this one! 🐱",
  "timestamp": "2025-11-09T12:34:56.789Z"
}
```

**Error Response:**
```json
{
  "error": "Failed to fetch response",
  "reply": "Oops! Something went wrong on my end. Please try again in a moment! 😿"
}
```

## 🧪 Testing

Test the API using curl:

```bash
# Health check
curl http://localhost:3000/

# Send a chat message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Ora!"}'
```

Or use Postman/Insomnia:
- Method: POST
- URL: `http://localhost:3000/api/chat`
- Body (JSON):
  ```json
  {
    "message": "Who is Srivatsa?"
  }
  ```

## 🚀 Deployment

### Option 1: Deploy to Render

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:** Add `OPENAI_API_KEY`, `ALLOWED_ORIGINS`
5. Deploy!

### Option 2: Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `ALLOWED_ORIGINS`
5. Railway will auto-detect Node.js and deploy

### Option 3: Deploy to Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the backend directory
4. Set environment variables in Vercel dashboard
5. Deploy!

**After deployment:**
1. Copy your backend URL (e.g., `https://your-app.onrender.com`)
2. Update `js/chat.js` in your frontend:
   ```javascript
   const API_URL = 'https://your-app.onrender.com/api/chat';
   ```
3. Update `ALLOWED_ORIGINS` in your backend `.env` to include your portfolio domain

## 🔒 Security Best Practices

✅ **DO:**
- Keep `.env` file private (never commit to Git)
- Use environment variables for API keys
- Set strict CORS origins in production
- Monitor API usage in OpenAI dashboard
- Use HTTPS in production

❌ **DON'T:**
- Share your OpenAI API key
- Commit `.env` file to version control
- Use `ALLOWED_ORIGINS=*` in production
- Exceed your OpenAI rate limits

## 💰 Cost Optimization

The backend uses `gpt-4o-mini` by default, which is cost-effective:
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

Typical conversation cost: **< $0.01 per 100 messages**

To reduce costs further:
1. Set `max_tokens: 200` (currently 300) in `server.js`
2. Use `gpt-3.5-turbo` instead of `gpt-4o-mini`
3. Implement rate limiting per user
4. Add caching for common questions

## 🐛 Troubleshooting

### "Authentication error"
- Check your `OPENAI_API_KEY` in `.env`
- Verify key is valid at [OpenAI dashboard](https://platform.openai.com/api-keys)

### "CORS error"
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart the server after changing `.env`

### "Rate limit exceeded"
- Wait a few moments and try again
- Check your OpenAI usage limits
- Consider upgrading your OpenAI plan

### Server won't start
- Ensure Node.js 18+ is installed: `node --version`
- Check if port 3000 is available
- Review server logs for errors

## 📁 Project Structure

```
backend/
├── server.js          # Main Express server
├── package.json       # Dependencies
├── .env.example       # Environment template
├── .env              # Your actual config (gitignored)
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🔄 Updating

To update dependencies:
```bash
npm update
```

To upgrade OpenAI SDK:
```bash
npm install openai@latest
```

## 📝 License

MIT License - feel free to use for your own projects!

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs
3. Test with curl/Postman
4. Verify OpenAI API key is valid

---

Made with 💙 by Srivatsa S
Powered by OpenAI GPT • Express.js • Node.js
