# FormSpree Setup Instructions

## 🚀 Quick Setup (5 minutes)

### Step 1: Create FormSpree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Click **"Sign Up"** (it's FREE!)
3. Sign up with your email or GitHub account

### Step 2: Create a New Form
1. After logging in, click **"+ New Form"**
2. Give your form a name (e.g., "Portfolio Contact Form")
3. Click **"Create Form"**

### Step 3: Get Your Form Endpoint
1. After creating the form, you'll see your **Form Endpoint**
2. It will look like: `https://formspree.io/f/YOUR_FORM_ID`
3. Copy this URL

### Step 4: Update Your Portfolio
1. Open `index.html` in your code editor
2. Find this line (around line 357):
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Replace `YOUR_FORM_ID` with your actual Form ID from Step 3
4. Save the file

### Step 5: Test It!
1. Open `index.html` in your browser
2. Navigate to the Contact window
3. Fill out the form and click "Send Message"
4. Check your FormSpree dashboard - you should see the submission!

## ✨ Features Now Working

- ✅ **Real form submissions** - Messages actually sent!
- ✅ **Email notifications** - Get emails when someone contacts you
- ✅ **Spam protection** - Built-in reCAPTCHA (optional)
- ✅ **Custom responses** - Thank you messages
- ✅ **Form storage** - All submissions saved in your dashboard

## 🎯 Example

If your Form ID is `xpznkjqw`, your form action would be:
```html
<form class="contact-form" id="contactForm" action="https://formspree.io/f/xpznkjqw" method="POST">
```

## 📧 Email Notifications

1. Go to your form settings in FormSpree
2. Click **"Email Notifications"**
3. Enter your email address (e.g., `srivatsa1312@gmail.com`)
4. You'll receive an email every time someone submits the form!

## 🔧 Advanced Settings (Optional)

### Custom Thank You Page
In FormSpree dashboard:
1. Go to form settings
2. Add a custom redirect URL after submission

### Spam Protection
1. Enable reCAPTCHA in form settings
2. Protects against bots and spam

### Custom Email Template
Customize the email you receive with submission details

## 💡 Free Plan Limits

- ✅ **50 submissions/month** - Perfect for portfolio
- ✅ **Unlimited forms**
- ✅ **Email notifications**
- ✅ **Spam filtering**

## 🆘 Troubleshooting

### Form not working?
1. Check that you replaced `YOUR_FORM_ID` with actual ID
2. Make sure you're online (FormSpree needs internet)
3. Check browser console for errors (F12)

### Not receiving emails?
1. Check spam folder
2. Verify email in FormSpree settings
3. Confirm form in FormSpree dashboard

## ✅ You're All Set!

Once you complete Step 4, your contact form will be **fully functional** and ready to receive real messages from visitors!

---

**Need Help?** Check FormSpree documentation: https://help.formspree.io/
