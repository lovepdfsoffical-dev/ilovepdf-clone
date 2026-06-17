# ilovepdf-clone

A lightweight iLovePDF-style app with a server-side PDF merge engine, Stripe checkout flow, and Google Drive authentication integration.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your configuration:

```env
PORT=5000
BASE_URL=http://localhost:5000
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URL=http://localhost:5000/auth/google/callback
```

3. Start the server:

```bash
npm start
```

4. Open `http://localhost:5000` in your browser.

## Features

- Merge PDFs using `pdf-lib`
- Premium checkout via Stripe
- Google Drive authentication via OAuth 2.0

## Endpoints

- `POST /api/pdf/merge` - Merge uploaded PDF files
- `POST /api/billing/checkout` - Create a Stripe Checkout session
- `GET /auth/google` - Start Google OAuth flow
- `GET /auth/google/callback` - Handle Google OAuth redirect
- `GET /api/health` - Health check
