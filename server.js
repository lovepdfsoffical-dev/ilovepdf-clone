const express = require('express');
const multer = require('multer');
const archiver = require('archiver');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { google } = require('googleapis');
require('dotenv').config();

let PORT = Number(process.env.PORT) || 5000;
const getBaseUrl = () => process.env.BASE_URL || `http://localhost:${PORT}`;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serves frontend assets from the public folder

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configure Multer for secure, multi-file memory processing
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB file upload ceiling
});

/* ==========================================================================
   FEATURE 1: CORE PDF MERGING LOGIC
   ========================================================================== */
app.post('/api/pdf/merge', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge.' });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of req.files) {
            const pdfDoc = await PDFDocument.load(file.buffer);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="merged_ilovepdf.pdf"');
        res.send(Buffer.from(mergedPdfBytes));
    } catch (err) {
        res.status(500).json({ error: 'PDF merge failed: ' + err.message });
    }
});

app.post('/api/pdf/split', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a PDF file to split.' });
    }

    try {
        const pdfDoc = await PDFDocument.load(req.file.buffer);
        const archive = archiver('zip', { zlib: { level: 9 } });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="split_pages.zip"');

        archive.pipe(res);

        const pageCount = pdfDoc.getPageCount();
        for (let i = 0; i < pageCount; i += 1) {
            const singlePagePdf = await PDFDocument.create();
            const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
            singlePagePdf.addPage(copiedPage);
            const pdfBytes = await singlePagePdf.save();
            archive.append(Buffer.from(pdfBytes), { name: `page-${i + 1}.pdf` });
        }

        await archive.finalize();
    } catch (err) {
        res.status(500).json({ error: 'PDF split failed: ' + err.message });
    }
});

app.post('/api/pdf/compress', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a PDF file to compress.' });
    }

    try {
        const pdfDoc = await PDFDocument.load(req.file.buffer);
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true, updateMetadata: false });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="compressed_ilovepdf.pdf"');
        res.send(Buffer.from(compressedPdfBytes));
    } catch (err) {
        res.status(500).json({ error: 'PDF compression failed: ' + err.message });
    }
});

app.post('/api/pdf/image-to-pdf', upload.array('files', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Please upload image files to convert to PDF.' });
    }

    try {
        const pdfDoc = await PDFDocument.create();

        for (const file of req.files) {
            const imageBuffer = file.buffer;
            let embeddedImage;

            if (file.mimetype === 'image/png') {
                embeddedImage = await pdfDoc.embedPng(imageBuffer);
            } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                embeddedImage = await pdfDoc.embedJpg(imageBuffer);
            } else {
                return res.status(400).json({ error: 'Only PNG and JPEG images are supported for conversion.' });
            }

            const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
            page.drawImage(embeddedImage, {
                x: 0,
                y: 0,
                width: embeddedImage.width,
                height: embeddedImage.height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="converted_images.pdf"');
        res.send(Buffer.from(pdfBytes));
    } catch (err) {
        res.status(500).json({ error: 'Image to PDF conversion failed: ' + err.message });
    }
});

/* ==========================================================================
   FEATURE 2: PREMIUM STRIPE SUBSCRIPTIONS
   ========================================================================== */
app.post('/api/billing/checkout', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'iLovePDF - Premium Tier' },
                    unit_amount: 700, // $7.00/month
                    recurring: { interval: 'month' },
                },
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${getBaseUrl()}/success.html`,
            cancel_url: `${getBaseUrl()}/cancel.html`,
        });
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ==========================================================================
   FEATURE 3: GOOGLE DRIVE FILE SOURCING INTEGRATION
   ========================================================================== */
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive.readonly']
    });
    res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.json({ success: true, message: 'Google authentication successful.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
const startServer = (port) => {
    PORT = Number(port);
    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`Port ${PORT} is in use. Trying ${PORT + 1}...`);
            startServer(PORT + 1);
        } else {
            console.error('Server failed to start:', err);
            process.exit(1);
        }
    });
};

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Warning: STRIPE_SECRET_KEY is not set. /api/billing/checkout will fail until configured.');
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URL) {
    console.warn('Warning: Google OAuth is not fully configured. /auth/google and /auth/google/callback may fail.');
}

startServer(PORT);
