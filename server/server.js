import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { insertEnquiry } from './db.js';
import { validateEnquiryInput, generateReferenceCode } from './validation.js';

// Load environment variables if present
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Vite dev server or production reverse proxy)
app.set('trust proxy', 1);

// 1. Configurable CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Cross-Origin Request Blocked by Shiftora Security Policy'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// 2. Body Parser with Strict 10kb Size Limit (Prevents payload attacks)
app.use(express.json({ limit: '10kb' }));

// 3. Rate Limiter for Enquiry Submissions (Spam prevention)
const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 submissions per IP in 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many moving enquiries submitted from your network. Please call our hotline directly for immediate assistance.',
  },
});

// 4. Health Check Endpoint (Safe, does not expose internal paths or credentials)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'shiftora-enquiry-api',
    timestamp: new Date().toISOString(),
  });
});

// 5. POST /api/enquiries Endpoint
app.post('/api/enquiries', enquiryRateLimiter, (req, res) => {
  try {
    const validation = validateEnquiryInput(req.body);

    // Bot detection check
    if (validation.isBot) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission request.',
      });
    }

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors: validation.errors,
      });
    }

    const { customerName, phone, originCity, destinationCity, serviceType, moveDate } = validation.data;

    // Generate unguessable public reference code
    const referenceCode = generateReferenceCode();

    // Insert into SQLite database via prepared statement
    const record = insertEnquiry({
      referenceCode,
      customerName,
      phone,
      originCity,
      destinationCity,
      serviceType,
      moveDate,
      status: 'new',
    });

    // Safe logging without exposing customer phone number or personal details
    console.log(`[Shiftora API] New enquiry stored securely. Ref: ${referenceCode}, Service: ${serviceType}`);

    return res.status(201).json({
      success: true,
      message: 'Your moving enquiry has been received and scheduled for quotation review.',
      referenceCode: record.reference_code,
      receivedAt: record.created_at,
    });
  } catch (error) {
    // Avoid exposing internal database details or stack trace
    console.error('[Shiftora API Error] Error processing enquiry:', error.message);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while saving your enquiry. Please contact our support line directly.',
    });
  }
});

// 6. 404 Route Handler
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Shiftora API Uncaught Error]:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

// Start listening if run directly
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`[Shiftora Server] Running on http://127.0.0.1:${PORT}`);
  });
}

export { app, server };
