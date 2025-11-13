# Deploy Backend to Render - Step by Step Guide

This guide will help you deploy your OpenAI chatbot backend to Render for FREE 24/7 hosting.

## What is Render?

Render is a cloud platform that offers free hosting for web services. Your backend will run automatically without you needing to start it manually!

## Prerequisites

✅ Your backend code is committed and pushed to GitHub  
✅ You have a GitHub account  
✅ You have your OpenAI API key ready  

## Step 1: Create a Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with your **GitHub account** (recommended - makes deployment easier!)
4. Authorize Render to access your GitHub repositories

## Step 2: Create a New Web Service

1. Once logged in, click **"New +"** in the top right
2. Select **"Web Service"** from the dropdown

## Step 3: Connect Your GitHub Repository

1. You'll see a list of your GitHub repositories
2. Find **"win-95-portfolio"** (or whatever you named your repo)
3. Click **"Connect"** next to it

**Don't see your repo?**
- Click **"Configure account"** on GitHub
- Make sure Render has access to your repository
- Go back and refresh the page

## Step 4: Configure Your Web Service

Fill in the following settings:

### Basic Settings
- **Name**: `win95-portfolio-backend` (or any unique name)
  - This will be part of your URL: `https://win95-portfolio-backend.onrender.com`
- **Region**: Choose closest to you (e.g., `Oregon (US West)` or `Frankfurt (EU Central)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
  - ⚠️ **IMPORTANT**: Type `backend` here since your server code is in the backend folder!

### Build Settings
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### Instance Type
- **Select**: `Free`
  - Free tier includes 750 hours/month (plenty for 24/7!)
  - ⚠️ Note: Free services spin down after 15 minutes of inactivity
  - They auto-restart when someone visits (takes ~30 seconds)

## Step 5: Add Environment Variables

This is **CRITICAL** - your OpenAI API key needs to be set here!

1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add the following:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-proj-...` (your actual OpenAI API key) |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | `*` (we'll update this later with your GitHub Pages URL) |

**To add each variable:**
- Click **"Add Environment Variable"**
- Enter the Key name
- Enter the Value
- Repeat for each variable

## Step 6: Deploy!

1. Double-check all your settings
2. Click **"Create Web Service"** at the bottom
3. Render will now:
   - Clone your GitHub repository
   - Install dependencies (`npm install`)
   - Start your server (`node server.js`)
   - Give you a public URL!

**Deployment takes 2-5 minutes**. You'll see logs in real-time showing the progress.

## Step 7: Get Your Backend URL

1. Once deployment succeeds, you'll see **"Your service is live 🎉"**
2. Your backend URL will be at the top: `https://win95-portfolio-backend.onrender.com`
3. **Copy this URL** - you'll need it for the next step!

### Test Your Backend

1. Open a new browser tab
2. Visit: `https://your-service-name.onrender.com`
3. You should see: `"Ora's Backend is Running! 🐱"`
4. This confirms your backend is working!

## Step 8: Update Your Frontend

Now update your frontend to use the production backend instead of localhost.

1. Open `js/chat.js` in your code editor
2. Find this line (around line 71):
   ```javascript
   const API_URL = 'http://localhost:3000/api/chat';
   ```
3. Replace it with:
   ```javascript
   const API_URL = 'https://your-service-name.onrender.com/api/chat';
   ```
4. Replace `your-service-name` with your actual Render service name

**Example:**
```javascript
const API_URL = 'https://win95-portfolio-backend.onrender.com/api/chat';
```

5. Save the file
6. Commit and push this change:
   ```bash
   git add js/chat.js
   git commit -m "Update API URL to production backend"
   git push origin main
   ```

## Step 9: Enable Auto-Deploy (Optional but Recommended)

1. In your Render dashboard, go to your service settings
2. Scroll to **"Auto-Deploy"**
3. Make sure it's set to **"Yes"**
4. Now, every time you push to GitHub, Render will automatically redeploy!

## Understanding Free Tier Behavior

### ⚠️ Important: Spin Down

Free Render services **spin down after 15 minutes** of no requests. This means:

- ✅ Your service will start automatically when someone visits
- ⏱️ First request after spin-down takes ~30 seconds (loading page)
- ✅ After that, it responds instantly
- 💡 Regular visitors won't notice much delay

### Keep Your Service Awake (Optional)

If you want to prevent spin-down, you can:

1. **Upgrade to paid tier** ($7/month for always-on)
2. **Use a monitoring service** like [UptimeRobot](https://uptimerobot.com) to ping your service every 5 minutes
   - Create a free account
   - Add a monitor for `https://your-service.onrender.com`
   - Set interval to 5 minutes
   - This keeps your service warm!

## Monitoring Your Backend

### View Logs

1. Go to your Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. See real-time logs of requests, errors, etc.

### Check Metrics

1. Click **"Metrics"** tab
2. See CPU usage, memory, request counts
3. Useful for debugging issues

### Manual Deploy

If you need to redeploy manually:
1. Go to your service dashboard
2. Click **"Manual Deploy"** dropdown
3. Select **"Deploy latest commit"**

## Troubleshooting

### "Build failed"
- Check the build logs in Render
- Make sure `backend/package.json` exists in your repo
- Verify Root Directory is set to `backend`

### "Service won't start"
- Check the logs for errors
- Verify `OPENAI_API_KEY` is set correctly in Environment Variables
- Make sure Start Command is `node server.js`

### "404 Not Found" when testing
- Make sure you're visiting the exact URL Render gave you
- Check that your service is running (green indicator)
- Try visiting the health check endpoint: `https://your-service.onrender.com/`

### CORS errors
- Update `ALLOWED_ORIGINS` in Render environment variables
- After deploying frontend to GitHub Pages, add your GitHub Pages URL
- Example: `https://yourusername.github.io,*`

### API calls failing with 401
- Your OpenAI API key might be wrong
- Go to Render dashboard → Environment Variables
- Update `OPENAI_API_KEY` with the correct key
- Click "Save Changes"
- The service will automatically restart

## Cost Breakdown

### Free Tier (Current Setup)
- ✅ 750 hours/month compute time (more than enough for 24/7!)
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL certificates
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Wakes up in ~30 seconds on first request

### Paid Tier ($7/month)
- ✅ Always on (no spin down)
- ✅ Faster responses
- ✅ 400 hours/month of compute (more than 24/7!)

**For a portfolio site, FREE TIER is perfect!** Most visitors won't even notice the 30-second wake-up time.

## Security Best Practices

✅ Never commit `.env` files to GitHub  
✅ Use Render's Environment Variables for secrets  
✅ Update `ALLOWED_ORIGINS` to only allow your domain once deployed  
✅ Monitor your OpenAI usage at [platform.openai.com/usage](https://platform.openai.com/usage)  

## What's Next?

Once your backend is deployed:

1. ✅ Update `js/chat.js` with production URL (done above)
2. ⏭️ Deploy frontend to GitHub Pages (see GITHUB_PAGES_DEPLOYMENT.md)
3. ⏭️ Update CORS settings with your GitHub Pages URL
4. ⏭️ Test everything end-to-end!

---

## Quick Reference

**Render Dashboard**: https://dashboard.render.com  
**Your Service URL**: `https://your-service-name.onrender.com`  
**Health Check**: `https://your-service-name.onrender.com/`  
**Chat API**: `https://your-service-name.onrender.com/api/chat`  

Need help? Check [Render's documentation](https://render.com/docs) or their [community forum](https://community.render.com)!
