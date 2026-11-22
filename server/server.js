import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import {
  insertEnquiry,
  verifyAdminLogin,
  verifyAdminToken,
  revokeAdminToken,
  updateAdminPassword,
  getQuotationSettings,
  saveQuotationSetting,
  peekNextQuotationNumber,
  listQuotations,
  getQuotationById,
  createQuotationRecord,
  updateQuotationRecord,
  duplicateQuotationRecord,
  deleteQuotationRecord,
} from './db.js';
import { validateEnquiryInput, generateReferenceCode } from './validation.js';
import {
  validateQuotationPayload,
  validateBankSettings,
  validateBusinessSettings,
  validateTermsSettings,
} from './quotationValidation.js';

// Load environment variables if present
dotenv.config();

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
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Cross-Origin Request Blocked by Toter Security Policy'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Body Parser (500kb limit to support optional signature image data URLs in admin settings)
app.use(express.json({ limit: '500kb' }));

// 3. Rate Limiters
const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Too many moving enquiries submitted from your network. Please call our hotline directly for immediate assistance.',
  },
});

const adminAuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before retrying.',
  },
});

// 4. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'toter-enquiry-and-quotation-api',
    timestamp: new Date().toISOString(),
  });
});

// 5. POST /api/enquiries Endpoint (Public website enquiry form - unchanged)
app.post('/api/enquiries', enquiryRateLimiter, (req, res) => {
  try {
    const validation = validateEnquiryInput(req.body);

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
    const referenceCode = generateReferenceCode();

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

    console.log(`[Toter API] New enquiry stored securely. Ref: ${referenceCode}, Service: ${serviceType}`);

    return res.status(201).json({
      success: true,
      message: 'Your moving enquiry has been received and scheduled for quotation review.',
      referenceCode: record.reference_code,
      receivedAt: record.created_at,
    });
  } catch (error) {
    console.error('[Toter API Error] Error processing enquiry:', error.message);
    return res.status(500).json({
      success: false,
      message:
        'An unexpected error occurred while saving your enquiry. Please contact our support line directly.',
    });
  }
});

// ── Admin Authentication Middleware ──────────────────────────────────
function extractBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

function requireAdminAuth(req, res, next) {
  const token = extractBearerToken(req);
  const session = verifyAdminToken(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please log in to the TOTER Quotation Dashboard.',
    });
  }
  req.adminSession = session;
  req.adminToken = token;
  return next();
}

// ── Admin Authentication Endpoints ───────────────────────────────────
app.post('/api/admin/auth/login', adminAuthRateLimiter, (req, res) => {
  try {
    const { username, password } = req.body || {};
    const session = verifyAdminLogin(username || 'admin', password);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator username or password.',
      });
    }
    return res.status(200).json({
      success: true,
      token: session.token,
      username: session.username,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('[Toter Admin Auth Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to process administrator login.',
    });
  }
});

app.get('/api/admin/auth/session', requireAdminAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    username: req.adminSession.username,
    expiresAt: req.adminSession.expires_at,
  });
});

app.post('/api/admin/auth/logout', requireAdminAuth, (req, res) => {
  revokeAdminToken(req.adminToken);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

app.put('/api/admin/auth/password', requireAdminAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!newPassword || String(newPassword).length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters.',
    });
  }
  const result = updateAdminPassword(req.adminSession.username, currentPassword, newPassword);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.status(200).json({
    success: true,
    message: 'Administrator password updated successfully.',
  });
});

// ── Quotation Settings Endpoints ─────────────────────────────────────
app.get('/api/admin/settings', requireAdminAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    settings: getQuotationSettings(),
  });
});

app.put('/api/admin/settings/bank', requireAdminAuth, (req, res) => {
  const validation = validateBankSettings(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Please correct the highlighted bank details errors.',
      errors: validation.errors,
    });
  }
  const settings = saveQuotationSetting('bank_details', validation.data);
  return res.status(200).json({
    success: true,
    message: 'Bank details saved successfully.',
    settings,
  });
});

app.put('/api/admin/settings/business', requireAdminAuth, (req, res) => {
  const validation = validateBusinessSettings(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Please correct the highlighted business information errors.',
      errors: validation.errors,
    });
  }
  const settings = saveQuotationSetting('business_info', validation.data);
  return res.status(200).json({
    success: true,
    message: 'Business information settings saved successfully.',
    settings,
  });
});

app.put('/api/admin/settings/terms', requireAdminAuth, (req, res) => {
  const validation = validateTermsSettings(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Please provide at least one valid Terms & Conditions clause.',
      errors: validation.errors,
    });
  }
  const settings = saveQuotationSetting('terms_conditions', validation.data);
  return res.status(200).json({
    success: true,
    message: 'Terms & Conditions saved successfully.',
    settings,
  });
});

// ── Quotation CRUD Endpoints ─────────────────────────────────────────
app.get('/api/admin/quotations/next-number', requireAdminAuth, (req, res) => {
  const year = req.query.year ? parseInt(String(req.query.year), 10) : new Date().getFullYear();
  return res.status(200).json({
    success: true,
    nextQuotationNumber: peekNextQuotationNumber(year),
  });
});

app.get('/api/admin/quotations', requireAdminAuth, (req, res) => {
  const { search = '', movingType = '', dateFrom = '', dateTo = '' } = req.query;
  const quotations = listQuotations({ search, movingType, dateFrom, dateTo });
  return res.status(200).json({
    success: true,
    quotations,
  });
});

app.get('/api/admin/quotations/:id', requireAdminAuth, (req, res) => {
  const quotation = getQuotationById(req.params.id);
  if (!quotation) {
    return res.status(404).json({
      success: false,
      message: 'Quotation not found.',
    });
  }
  return res.status(200).json({
    success: true,
    quotation,
  });
});

app.post('/api/admin/quotations', requireAdminAuth, (req, res) => {
  try {
    const validation = validateQuotationPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check the highlighted fields.',
        errors: validation.errors,
      });
    }

    const created = createQuotationRecord(validation.data);
    return res.status(201).json({
      success: true,
      message: `Quotation ${created.quotationNumber} created and saved.`,
      quotation: created,
    });
  } catch (error) {
    console.error('[Toter Quotation Create Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to save quotation.',
    });
  }
});

app.put('/api/admin/quotations/:id', requireAdminAuth, (req, res) => {
  try {
    const existing = getQuotationById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found.',
      });
    }

    const validation = validateQuotationPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check the highlighted fields.',
        errors: validation.errors,
      });
    }

    const updated = updateQuotationRecord(req.params.id, validation.data);
    return res.status(200).json({
      success: true,
      message: `Quotation ${updated.quotationNumber} updated.`,
      quotation: updated,
    });
  } catch (error) {
    console.error('[Toter Quotation Update Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update quotation.',
    });
  }
});

app.post('/api/admin/quotations/:id/duplicate', requireAdminAuth, (req, res) => {
  try {
    const duplicated = duplicateQuotationRecord(req.params.id);
    if (!duplicated) {
      return res.status(404).json({
        success: false,
        message: 'Original quotation not found.',
      });
    }
    return res.status(201).json({
      success: true,
      message: `Duplicated as new Quotation ${duplicated.quotationNumber}.`,
      quotation: duplicated,
    });
  } catch (error) {
    console.error('[Toter Quotation Duplicate Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to duplicate quotation.',
    });
  }
});

app.delete('/api/admin/quotations/:id', requireAdminAuth, (req, res) => {
  const deleted = deleteQuotationRecord(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: 'Quotation not found.',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Quotation deleted successfully.',
  });
});

// 6. 404 Route Handler
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// 7. Global Error Handler
app.use((err, req, res, _next) => {
  console.error('[Toter API Uncaught Error]:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

// Start listening if run directly
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`[Toter Server] Running on http://127.0.0.1:${PORT}`);
  });
}

export { app, server };
