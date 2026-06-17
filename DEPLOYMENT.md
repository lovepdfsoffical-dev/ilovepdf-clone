# Deployment Guide: iLovePDF Clone to Hostinger

## Prerequisites
- ✓ Hostinger Premium/Managed Node.js account
- ✓ Domain connected to Hostinger
- ✓ Stripe & Google OAuth credentials
- ✓ Git repository (GitHub)

---

## Step 1: Prepare Your Git Repository

Push your code to GitHub if you haven't already:

```bash
git add .
git commit -m "Ready for Hostinger deployment"
git push origin main
```

**Ensure `.env` is in `.gitignore`** (sensitive credentials should not be in the repository):

```bash
cat .gitignore | grep -q "^\.env$" && echo "✓ .env is gitignored" || echo "⚠ Add .env to .gitignore"
```

---

## Step 2: Deploy via Hostinger Dashboard

### 2.1 Go to Hostinger Control Panel

1. Log in to [Hostinger Dashboard](https://hpanel.hostinger.com/)
2. Navigate to **Hosting** → **Manage** (for your domain)
3. Look for **Node.js** or **Applications** section (Premium plans)

### 2.2 Connect GitHub Repository

1. Click **Git Repository** or **Deploy from Git**
2. Click **Connect** and authorize your GitHub account
3. Select your repository: `lovepdfsoffical-dev/ilovepdf-clone`
4. Choose branch: `main`
5. Click **Deploy**

### 2.3 Set Start Command

In the deployment settings, ensure the start command is:
```
npm start
```

---

## Step 3: Configure Environment Variables

### In Hostinger Dashboard:

1. Go to **Node.js Settings** or **Environment Variables**
2. Add each variable from `.env.example`:

```
PORT=5000
NODE_ENV=production
BASE_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URL=https://yourdomain.com/auth/google/callback
```

**⚠️ Important:** Replace placeholders with your actual credentials:
- Get **Stripe keys** from: [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Get **Google OAuth credentials** from: [Google Cloud Console](https://console.cloud.google.com/)

---

## Step 4: Configure Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URI:
   ```
   https://yourdomain.com/auth/google/callback
   ```
6. Click **Save**

---

## Step 5: Configure Stripe Webhook (Optional but Recommended)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter webhook URL:
   ```
   https://yourdomain.com/api/billing/webhook
   ```
4. Select events: `checkout.session.completed`
5. Copy signing secret and add to environment variables if needed

---

## Step 6: Enable SSL/HTTPS

In Hostinger Dashboard:
1. Go to **SSL/TLS Settings**
2. Enable **Free AutoSSL** (or premium SSL)
3. Verify domain control if prompted

---

## Step 7: Set Up Domain

1. In Hostinger Dashboard, ensure your domain points to your Node.js application
2. Go to **Domain Settings** → **DNS**
3. Verify records point to Hostinger nameservers

---

## Step 8: Test Deployment

Once deployed, test endpoints:

```bash
# Replace yourdomain.com with your actual domain
curl https://yourdomain.com/api/health
# Should return: {"status":"ok","uptime":...}

# Visit homepage
https://yourdomain.com/
```

---

## Troubleshooting

### App Not Starting?
1. Check **Node.js Error Logs** in Hostinger Dashboard
2. Verify PORT is set (default 5000)
3. Ensure all environment variables are configured

### Pages Not Loading?
1. Verify `.env` BASE_URL matches your domain
2. Check SSL certificate is active
3. Clear browser cache and hard-refresh (Ctrl+Shift+R)

### PDF Tools Not Working?
1. Check if file size exceeds 50MB limit
2. Verify multer memory storage has sufficient space
3. Monitor server error logs

### OAuth/Stripe Issues?
1. Verify credentials are correct in environment variables
2. Check API keys are for production (not test keys)
3. Ensure redirect URLs match exactly

---

## Monitoring & Logs

In Hostinger Dashboard:
- **Error Logs**: Check Node.js error logs in real-time
- **Access Logs**: Monitor HTTP requests
- **Restart Application**: If needed, use the "Restart" button

---

## Subsequent Deployments

To push updates:
1. Commit changes locally:
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   ```
2. Hostinger will auto-deploy if auto-deployment is enabled
3. Or manually trigger deployment from Hostinger Dashboard

---

## Quick Reference: Files Structure

```
ilovepdf-clone/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── .env.example           # Environment variable template
├── public/
│   ├── index.html         # Homepage
│   ├── merge.html         # Merge tool
│   ├── split.html         # Split tool
│   ├── compress.html      # Compress tool
│   ├── image-to-pdf.html  # Image conversion
│   └── img/               # Assets (logos, icons, illustrations)
└── node_modules/          # Dependencies (auto-installed)
```

---

## Support

For Hostinger-specific issues:
- Visit [Hostinger Help Center](https://support.hostinger.com/)
- Contact Hostinger Support

For application issues:
- Check error logs in Hostinger Dashboard
- Review `.env` configuration
- Verify API credentials
