# Supabase Setup Guide

This guide will help you set up Supabase for your portfolio's guestbook and visitor counter.

## What is Supabase?

Supabase is a free, open-source Firebase alternative that provides a PostgreSQL database with a REST API. It's perfect for storing guestbook messages and visitor counts that persist across all visitors.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using your GitHub account (recommended) or email
4. Verify your email if required

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `win95-portfolio` (or any name you like)
   - **Database Password**: Create a strong password (save this somewhere safe!)
   - **Region**: Choose the closest region to you (e.g., US East, Europe, etc.)
   - **Pricing Plan**: Select **Free** (this is plenty for a portfolio site)
3. Click **"Create new project"**
4. Wait 2-3 minutes for your database to be provisioned

## Step 3: Set Up the Database Tables

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of the `supabase-setup.sql` file from your project
4. Paste it into the SQL editor
5. Click **"Run"** or press **Ctrl+Enter**
6. You should see "Success. No rows returned" - this is correct!

**What this does:**
- Creates a `guestbook` table to store visitor messages
- Creates a `visitor_stats` table to track total visitor count
- Sets up security policies so anyone can read and add entries (but not delete)

## Step 4: Get Your API Credentials

1. In the Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll need two values:

### Project URL
- Look for **"Project URL"** at the top
- It looks like: `https://abcdefghijklmnop.supabase.co`
- Copy this value

### API Key (anon/public)
- Scroll down to **"Project API keys"**
- Find the **"anon" "public"** key
- Click the copy icon to copy it
- It's a long string like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Important:** The "anon" key is safe to use in your frontend code - it only allows the permissions you set up in SQL (read and insert).

## Step 5: Add Credentials to Your Code

1. Open `js/guestbook.js` in your code editor
2. Find these lines near the top (around lines 2-3):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace `'YOUR_SUPABASE_URL'` with your actual Project URL (keep the quotes)
4. Replace `'YOUR_SUPABASE_ANON_KEY'` with your actual anon key (keep the quotes)

Example:
```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzQ1Njc4OX0.example';
```

5. Save the file

## Step 6: Test Your Integration

1. Open your portfolio in a browser (make sure you're running it locally with Live Server)
2. Click the Guestbook icon
3. Try signing the guestbook with a test message
4. Refresh the page - your message should still be there!
5. Check that the visitor counter is incrementing

### Verify in Supabase Dashboard

1. Go back to your Supabase project
2. Click **"Table Editor"** in the left sidebar
3. Select **"guestbook"** table
4. You should see your test entries!
5. Select **"visitor_stats"** table
6. You should see a row with an incrementing count

## Troubleshooting

### "Failed to load guestbook"
- Check that your SUPABASE_URL and SUPABASE_KEY are correct
- Make sure there are no extra spaces or quotes
- Verify your internet connection

### Entries not appearing
- Open browser DevTools (F12)
- Check the Console tab for errors
- Look for red error messages

### "Row Level Security policy violation"
- This means the SQL setup didn't complete correctly
- Go back to SQL Editor and run the `supabase-setup.sql` again
- Make sure you ran the ENTIRE script, including the POLICY sections

## What's Next?

Once Supabase is working locally:

1. **Commit your changes** (but DON'T commit your API keys if you put them in a config file!)
2. **Deploy your backend to Render** (see RENDER_DEPLOYMENT.md)
3. **Deploy your frontend to GitHub Pages**
4. Your guestbook will work 24/7 without needing a backend server!

## Free Tier Limits

Supabase free tier includes:
- ✅ 500MB database storage (plenty for a guestbook!)
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth per month
- ✅ Unlimited API requests

This is more than enough for a personal portfolio site!

## Security Notes

- ✅ The "anon" key is safe to expose in frontend code
- ✅ Row Level Security (RLS) policies control what users can do
- ✅ Users can only INSERT and SELECT, not UPDATE or DELETE
- ⚠️ Never share your "service_role" key (it has full access!)
- ⚠️ Don't commit sensitive keys to public GitHub repos

---

Need help? Check the [Supabase documentation](https://supabase.com/docs) or ask questions in their [Discord community](https://discord.supabase.com)!
