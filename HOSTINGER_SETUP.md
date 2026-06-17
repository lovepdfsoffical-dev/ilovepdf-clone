# Hostinger Deployment Setup: lovespdfs.com

**Status:** Ready for deployment ✅

---

## 📋 Quick Checklist

### Before You Deploy
- [ ] Hostinger account with Premium/Node.js plan
- [ ] Domain **lovespdfs.com** connected to Hostinger
- [ ] GitHub account authorized with Hostinger
- [ ] Stripe live API keys obtained
- [ ] Google OAuth credentials created

---

## 🚀 Deployment Steps (In Order)

### STEP 1: Get Your Credentials

#### A. Stripe Live Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Make sure you're on **LIVE** (not test mode)
3. Copy your **Secret Key** (starts with `sk_live_`)
4. Copy your **Publishable Key** (starts with `pk_live_`)
5. ✅ Save these for later

#### B. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing one)
3. Enable **Google Drive API** and **Google+ API**
4. Go to **Credentials** → **Create OAuth 2.0 Client ID**
5. Type: **Web Application**
6. Add **Authorized Redirect URIs:**
   ```
   https://lovespdfs.com/auth/google/callback
   ```
7. Copy **Client ID** and **Client Secret**
8. ✅ Save these for later

---

### STEP 2: Log into Hostinger hPanel

1. Go to [Hostinger hPanel](https://hpanel.hostinger.com/)
2. Log in with your account
3. Select **lovespdfs.com** domain

---

### STEP 3: Set Up Node.js Application

1. In left sidebar, find **Hosting** section
2. Click **Manage** (for lovespdfs.com)
3. Look for **Node.js**, **Applications**, or **Deployment** tab
4. Click **Create Application** or **Deploy New App**

---

### STEP 4: Connect GitHub

1. Click **Deploy from Git** or **Connect Repository**
2. Click **Authorize GitHub** (if first time)
3. Select repository: **lovepdfsoffical-dev/ilovepdf-clone**
4. Select branch: **main**
5. Click **Deploy** or **Continue**

---

### STEP 5: Configure Application Settings

**Application Name:** ilovepdf-clone

**Start Command:**
```
npm start
```

**Node.js Version:** 18+ (use latest available)

**Port:** 5000

---

### STEP 6: Add Environment Variables ⚠️ IMPORTANT

In Hostinger Dashboard, find **Environment Variables** section and add ALL these:

```
PORT=5000
NODE_ENV=production
BASE_URL=https://lovespdfs.com
STRIPE_SECRET_KEY=sk_live_PASTE_YOUR_KEY_HERE
STRIPE_PUBLIC_KEY=pk_live_PASTE_YOUR_KEY_HERE
GOOGLE_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URL=https://lovespdfs.com/auth/google/callback
```

**How to add:**
- Click **Add Environment Variable** button
- Paste key name (e.g., `PORT`)
- Paste value (e.g., `5000`)
- Click **Add**
- Repeat for all 8 variables

---

### STEP 7: Verify Domain & SSL

1. In Hostinger, go to **Domain Settings**
2. Verify domain points to your Node.js app
3. Go to **SSL/TLS**
4. Enable **AutoSSL** (free, auto-renews)
5. Wait 5-10 minutes for certificate to issue

---

### STEP 8: Deploy!

1. Click **Deploy** button in Hostinger dashboard
2. Wait 2-5 minutes for deployment to complete
3. Watch for success notification

---

## ✅ Test Your Live Site

Once deployed, test these URLs:

```
https://lovespdfs.com/                    # Homepage
https://lovespdfs.com/merge.html          # Merge tool
https://lovespdfs.com/split.html          # Split tool
https://lovespdfs.com/compress.html       # Compress tool
https://lovespdfs.com/image-to-pdf.html   # Image to PDF
https://lovespdfs.com/api/health          # Health check (should return JSON)
```

All should load successfully! 🎉

---

## 🐛 Troubleshooting

### App Won't Start?
- Check **Application Logs** in Hostinger dashboard
- Verify all 8 environment variables are set correctly
- Ensure Node.js version is 18+

### Pages Showing 404?
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Verify domain DNS is pointing to Hostinger

### Stripe Not Working?
- Verify you're using **LIVE** keys (not test keys)
- Check `STRIPE_SECRET_KEY` starts with `sk_live_`
- Ensure `BASE_URL=https://lovespdfs.com` is exact

### Google OAuth Not Working?
- Verify redirect URL in Google Console: `https://lovespdfs.com/auth/google/callback`
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Wait a few minutes for Google settings to sync

---

## 📞 Support

**Hostinger Issues:** [Hostinger Help Center](https://support.hostinger.com/)

**Stripe Issues:** [Stripe Support](https://support.stripe.com/)

**Google Issues:** [Google Cloud Support](https://cloud.google.com/support/)

---

## 🎯 What's Next After Deployment?

1. **Test all PDF tools** (merge, split, compress, image-to-pdf)
2. **Test Stripe payment** (create checkout session)
3. **Test Google Drive** (authorize with Google)
4. **Monitor error logs** for the first week
5. **Add SSL security headers** (optional enhancement)

---

## Repository Info

- **GitHub:** https://github.com/lovepdfsoffical-dev/ilovepdf-clone
- **Domain:** lovespdfs.com
- **Hosting:** Hostinger Premium/Node.js
- **Branch:** main
- **Last Updated:** 2026-06-17
