# 🔧 Complete Contact Form Email Setup Guide

## 🚀 Quick Setup (Recommended)

Your contact form has been updated with a custom email solution using Resend. Here's how to complete the setup:

### Step 1: Get Resend API Key

1. **Sign up for Resend** (Free tier: 100 emails/day)
   - Go to [https://resend.com](https://resend.com)
   - Create an account with your email
   - Verify your email address

2. **Get your API key**
   - In the Resend dashboard, go to "API Keys"
   - Click "Create API Key"
   - Name it "Portfolio Contact Form"
   - Copy the API key (starts with `re_`)

### Step 2: Configure Vercel Environment Variables

1. **Add to Vercel Dashboard**
   - Go to your Vercel project dashboard
   - Navigate to "Settings" → "Environment Variables"
   - Add a new variable:
     - **Name**: `RESEND_API_KEY`
     - **Value**: Your Resend API key (starts with `re_`)
     - **Environment**: Production (and Preview if you want)

2. **For Local Development** (optional)
   - Create a `.env.local` file in your project root:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   ```
   - Add `.env.local` to your `.gitignore` (if not already there)

### Step 3: Update Email Configuration

Edit the file `src/pages/api/contact.ts` and update these lines:

```typescript
// Line 87: Replace with your verified domain (or use resend.dev for testing)
from: 'Portfolio Contact <noreply@yourdomain.com>',

// Line 88: Replace with your actual email address
to: ['your-email@example.com'],
```

### Step 4: Domain Verification (Optional but Recommended)

For production use, verify your domain in Resend:

1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Add the provided DNS records to your domain
4. Update the `from` address to use your domain

**Note**: For testing, you can use `@resend.dev` addresses without domain verification.

### Step 5: Deploy and Test

1. **Deploy your changes**:
   ```bash
   git add .
   git commit -m "Add custom email API with Resend"
   git push
   ```

2. **Test the form**:
   - Fill out your contact form
   - Submit it
   - Check your email (including spam folder)

---

## 🔄 Alternative: Quick Formspree Setup

If you prefer a simpler setup without custom API, you can use Formspree:

### Formspree Setup Steps:

1. **Sign up at [Formspree.io](https://formspree.io)**
2. **Create a new form** and get your form ID
3. **Update these two places in `contact.astro`**:

   **Form action** (around line 140):
   ```html
   <form class="mt-8 space-y-6" id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

   **JavaScript submission** (around line 550):
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```

4. **Update the form submission function**:
   Replace the `submitToAPI` function with:
   ```javascript
   async function submitToFormspree(formData: FormData): Promise<boolean> {
     try {
       const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
         method: 'POST',
         body: formData,
         headers: { 'Accept': 'application/json' }
       });
       return response.ok;
     } catch (error) {
       console.error('Formspree error:', error);
       return false;
     }
   }
   ```

   And update the form handler to call `submitToFormspree(formData)` instead.

---

## ✅ What's Already Fixed

- ❌ **Removed**: Netlify Forms configuration (doesn't work on Vercel)
- ✅ **Added**: Custom Vercel API endpoint (`/api/contact`)
- ✅ **Added**: Professional email template with HTML formatting
- ✅ **Added**: Comprehensive spam protection
- ✅ **Added**: Form validation and error handling
- ✅ **Added**: Resend integration for reliable email delivery

## 🧪 Testing Checklist

After setup, test these scenarios:

- [ ] Submit form with valid data → Should receive email
- [ ] Submit form with invalid email → Should show error
- [ ] Submit form with missing fields → Should show validation errors
- [ ] Check spam folder for emails
- [ ] Verify email formatting looks professional

## 🔍 Troubleshooting

### No emails received?
1. Check Vercel environment variables are set correctly
2. Verify Resend API key is valid
3. Check spam/junk folder
4. Look at Vercel function logs for errors
5. Test with a different email address

### Form submission errors?
1. Open browser developer tools
2. Check console for JavaScript errors
3. Check network tab for API call failures
4. Verify the API endpoint is accessible

### Local development issues?
1. Make sure `.env.local` has the correct API key
2. Run `npm run dev` to test locally
3. Check that Astro is building the API route

---

## 🎯 Recommended: Use Custom API

The custom API solution provides:
- ✅ **Full control** over email formatting and logic
- ✅ **Professional appearance** with HTML email templates
- ✅ **Better spam protection** with server-side validation
- ✅ **No external dependencies** (runs on your Vercel deployment)
- ✅ **Detailed logging** for debugging
- ✅ **Customizable** email templates and validation rules

**Next Steps**: Complete Step 1-3 above to get your contact form working!

Need help? The error messages in your browser console and Vercel function logs will guide you to any remaining issues.
