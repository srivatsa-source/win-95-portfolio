# Deploy Frontend to GitHub Pages

This guide will help you deploy your portfolio website to GitHub Pages for FREE hosting with a custom URL!

## What is GitHub Pages?

GitHub Pages is a free static site hosting service that turns your GitHub repository into a live website. Perfect for portfolios!

## Prerequisites

✅ All your code is committed and pushed to GitHub  
✅ Your backend is deployed to Render  
✅ You've updated `js/chat.js` with your production backend URL  
✅ You've updated `js/guestbook.js` with your Supabase credentials  

## Step 1: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/srivatsa-source/win-95-portfolio`
2. Click **"Settings"** tab (top right)
3. Scroll down and click **"Pages"** in the left sidebar (under "Code and automation")

## Step 2: Configure GitHub Pages

1. Under **"Source"**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
2. Click **"Save"**
3. Wait 1-2 minutes for GitHub to build your site

## Step 3: Get Your Live URL

1. Refresh the page after 1-2 minutes
2. You'll see a banner at the top:
   > "Your site is live at https://srivatsa-source.github.io/win-95-portfolio/"
3. **Copy this URL** - this is your live portfolio!
4. Click the URL to visit your site

## Step 4: Update Backend CORS Settings

Your backend needs to allow requests from your GitHub Pages URL.

### Option A: Update in Render Dashboard

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your backend service
3. Click **"Environment"** tab
4. Find `ALLOWED_ORIGINS`
5. Update it to:
   ```
   https://srivatsa-source.github.io,*
   ```
6. Click **"Save Changes"**
7. Your service will automatically restart

### Option B: Update in Code (Recommended)

1. Open `backend/server.js` in your code editor
2. Find this line (around line 15):
   ```javascript
   const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5500'];
   ```
3. Update to:
   ```javascript
   const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
       'http://localhost:5500',
       'http://127.0.0.1:5500',
       'https://srivatsa-source.github.io'
   ];
   ```
4. Commit and push:
   ```bash
   git add backend/server.js
   git commit -m "Add GitHub Pages to CORS allowed origins"
   git push origin main
   ```
5. Render will auto-deploy the update!

## Step 5: Update Supabase CORS (If Needed)

Supabase should work automatically, but if you have issues:

1. Go to your Supabase dashboard
2. Click **Settings** → **API**
3. Scroll to **"CORS Configuration"**
4. Add your GitHub Pages URL: `https://srivatsa-source.github.io`

## Step 6: Test Your Live Site!

Visit your GitHub Pages URL and test:

✅ **Page loads correctly**  
✅ **All styles and images work**  
✅ **Windows can be dragged and closed**  
✅ **Visitor counter increments** (from Supabase)  
✅ **Guestbook can be signed** (saves to Supabase)  
✅ **Chat with Ora works** (calls your Render backend)  

### Expected Behavior on First Chat

If your Render backend is on free tier:
- ⏱️ First chat message might take 30-45 seconds (waking up from sleep)
- ✅ After that, responses are instant!
- 💡 This is normal for free tier - users will understand

## Custom Domain (Optional)

Want `www.srivatsa.com` instead of `srivatsa-source.github.io`?

### Buy a Domain
1. Purchase from [Namecheap](https://namecheap.com), [Google Domains](https://domains.google), etc.
2. Follow GitHub's guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

### Quick Steps
1. In your repo, create a file named `CNAME` (no extension)
2. Add just your domain: `www.srivatsa.com`
3. In your domain registrar, add DNS records:
   - **CNAME** record: `www` → `srivatsa-source.github.io`
   - **A** records for apex domain (if wanted):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
4. Wait 24-48 hours for DNS to propagate

## Update Your README

Let people know your site is live!

1. Open `README.md`
2. Add at the top:
   ```markdown
   # Win95 Portfolio
   
   🌐 **Live Site**: https://srivatsa-source.github.io/win-95-portfolio/
   
   A retro Windows 95-themed portfolio featuring Ora, an AI-powered pixel art cat!
   ```
3. Commit and push

## Troubleshooting

### Page shows 404
- Wait a few more minutes (GitHub Pages can take up to 10 minutes)
- Check that Settings → Pages shows your site is published
- Verify the branch is set to `main` and folder is `/ (root)`

### Styles not loading
- Open browser DevTools (F12) → Console tab
- Look for errors
- Make sure all CSS/JS files are committed to GitHub
- Check that file paths are relative (no absolute paths like `C:\Users\...`)

### Chat not working
- Check browser Console for CORS errors
- Verify backend URL in `js/chat.js` is correct
- Make sure backend is running on Render
- Check Render logs for errors

### Guestbook not saving
- Open browser Console for errors
- Verify Supabase credentials in `js/guestbook.js`
- Test Supabase connection in their dashboard
- Make sure RLS policies are set up correctly

### Images broken
- Make sure all images are committed to GitHub
- Check that image paths are relative: `assets/ora.png` not `/assets/ora.png`
- Verify image files are in the correct folders

### Changes not appearing
- **Hard refresh** the page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Wait a few minutes for GitHub to rebuild
- Check that changes are committed and pushed to GitHub

## Performance Tips

### Optimize Images
- Use WebP format for smaller file sizes
- Compress images with [TinyPNG](https://tinypng.com)
- Lazy load images not immediately visible

### Minify Code (Optional)
For faster loading:
- Minify CSS: `style.css` → `style.min.css`
- Minify JS: `chat.js` → `chat.min.js`
- Use tools like [Terser](https://terser.org/) or online minifiers

### Enable Caching
GitHub Pages automatically handles caching, but you can optimize:
- Add `meta` tags for cache control
- Use service workers for offline support
- Implement lazy loading for heavy content

## Updating Your Site

Whenever you make changes:

1. Edit files locally
2. Test with Live Server
3. Commit changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. Wait 1-2 minutes
5. Hard refresh your GitHub Pages URL to see changes!

**Note**: If you updated backend code:
- Render auto-deploys if you enabled Auto-Deploy
- Check Render dashboard to confirm deployment
- View logs if anything breaks

## Analytics (Optional)

Track visitors to your site:

### Google Analytics
1. Create account at https://analytics.google.com
2. Get your tracking ID
3. Add to your `index.html` before `</head>`:
   ```html
   <!-- Global site tag (gtag.js) - Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Simple Analytics (Privacy-friendly)
- Use [Plausible](https://plausible.io) or [Fathom](https://usefathom.com)
- More privacy-friendly than Google Analytics
- Easier to set up

## SEO Optimization

Make your site discoverable:

### Add Meta Tags
In your `index.html` `<head>`:
```html
<meta name="description" content="Srivatsa's portfolio - A retro Windows 95-themed developer portfolio with AI-powered chatbot Ora">
<meta name="keywords" content="portfolio, web developer, AI chatbot, retro design, Windows 95">
<meta name="author" content="Srivatsa S">

<!-- Open Graph (for social media) -->
<meta property="og:title" content="Srivatsa's Win95 Portfolio">
<meta property="og:description" content="Chat with Ora, my AI pixel cat, in this retro portfolio!">
<meta property="og:image" content="https://srivatsa-source.github.io/win-95-portfolio/assets/ora.png">
<meta property="og:url" content="https://srivatsa-source.github.io/win-95-portfolio/">
```

### Create sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://srivatsa-source.github.io/win-95-portfolio/</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Submit to Search Engines
- Google: https://search.google.com/search-console
- Bing: https://www.bing.com/webmasters

## Complete Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to GitHub Pages
- [ ] Supabase credentials added to `guestbook.js`
- [ ] Backend URL updated in `chat.js`
- [ ] CORS configured for GitHub Pages URL
- [ ] Tested chat functionality
- [ ] Tested guestbook functionality
- [ ] Tested visitor counter
- [ ] All images loading correctly
- [ ] Mobile responsive (already done!)
- [ ] README updated with live URL
- [ ] Meta tags added for SEO
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)

## Your Live URLs

📱 **Frontend**: https://srivatsa-source.github.io/win-95-portfolio/  
🔧 **Backend**: https://your-service-name.onrender.com  
🗄️ **Database**: Supabase (check dashboard)  

## Costs

Everything is **100% FREE**:
- ✅ GitHub Pages: Free forever for public repos
- ✅ Render: Free tier (with spin-down)
- ✅ Supabase: Free tier (500MB database)
- ✅ OpenAI: Pay per use (very cheap for low traffic)

**Estimated monthly cost**: $0-5 depending on chat usage!

## What's Next?

🎉 **Congratulations!** Your portfolio is live on the internet!

Share it:
- Add to your LinkedIn profile
- Share on Twitter/X
- Send to friends and potential employers
- Add to your resume/CV

Future enhancements:
- Add a projects section showcasing your work
- Create an about page with your story
- Add a contact form
- Implement dark mode
- Add more Easter eggs and interactions!

---

## Quick Commands Reference

```bash
# Make changes locally
git add .
git commit -m "Your message"
git push origin main

# Check deployment status
# Visit: https://github.com/srivatsa-source/win-95-portfolio/deployments

# View live site
# Visit: https://srivatsa-source.github.io/win-95-portfolio/
```

Need help? Ask in [GitHub Discussions](https://github.com/srivatsa-source/win-95-portfolio/discussions)!
