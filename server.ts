import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  requireAdmin,
  requireModuleAccess,
  type AdminRequest,
} from './src/middleware/auth.ts';
import { blueprintStore } from './src/db/blueprintStore.ts';
import {
  bulkUpdateSubmissionStatus,
  createPaymentTransaction,
  createPublicSubmission,
  deleteAdminUser,
  deleteCampaign,
  deleteContentItem,
  deleteCsrProposal,
  deleteDistrict,
  deleteDonationReport,
  deleteMarathonEvent,
  deleteProject,
  deleteSubmissionById,
  findDuplicateSubmission,
  findPaymentByOrderId,
  findSubmissionByApplicationId,
  getFormDefinitionById,
  getHaritMitraNetwork,
  getPublicBootstrapData,
  getSiteGovernance,
  getSubmissionById,
  listAdminUsers,
  listAllFormDefinitions,
  listAuditLogs,
  listCampaigns,
  listContentItems,
  listCsrProposals,
  listDistricts,
  listDonationReports,
  listImpactMetrics,
  listMarathonEvents,
  listPaymentTransactions,
  listProjects,
  listSubmissionsScoped,
  markPaymentCaptured,
  markPaymentFailedOrRefunded,
  updateFormDefinition,
  updateImpactMetric,
  updateSiteGovernance,
  updateSubmissionReview,
  upsertAdminUser,
  upsertCampaign,
  upsertContentItem,
  upsertCsrProposal,
  upsertDistrict,
  upsertDonationReport,
  upsertMarathonEvent,
  upsertProject,
  writeAuditLog,
} from './src/db/repository.ts';
import {
  VALID_ADMIN_ROLES,
  VALID_SUBMISSION_STATUSES,
  buildAnalyticsSeries,
  buildFormTypeBreakdown,
  buildPaymentsCsv,
  buildSubmissionsCsv,
  formatBilingualIsoDate,
  generateHaritMitraCode,
  generateUniqueCampaignCode,
  generateUniqueMemberId,
  getAllowedModulesForRole,
  isDistrictAllowed,
  maskSubmissionForPublicLookup,
  slugifyTitle,
  validatePublicSubmissionPayload,
  validateUploadFileName,
  type AdminRole,
  type TimeframeKey,
} from './src/utils/adminLogic.ts';

dotenv.config();

function timingSafeHexEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function getRazorpayConfig() {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
  const hasKeys = Boolean(keyId && keySecret);
  const mode: 'live' | 'test' | 'sandbox' = hasKeys
    ? keyId.startsWith('rzp_live_')
      ? 'live'
      : 'test'
    : 'sandbox';
  return { keyId, keySecret, webhookSecret, hasKeys, mode };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const UPLOADS_DIR = path.resolve(__dirname, 'public/uploads');

async function startServer() {
  const app = express();

  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  // =========================================================================
  // RAZORPAY WEBHOOK (MUST BE REGISTERED BEFORE express.json() FOR RAW HMAC)
  // =========================================================================
  app.post(
    '/api/webhooks/razorpay',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      try {
        const { webhookSecret } = getRazorpayConfig();
        const rawBody = Buffer.isBuffer(req.body)
          ? req.body.toString('utf8')
          : typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body ?? {});

        if (webhookSecret) {
          const receivedSig = String(req.headers['x-razorpay-signature'] || '').trim();
          const expectedSig = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');
          if (!receivedSig || !timingSafeHexEqual(receivedSig, expectedSig)) {
            return res.status(400).json({ error: 'Invalid webhook signature.' });
          }
        }

        const event = JSON.parse(rawBody || '{}');
        const eventType = String(event?.event || '');
        const paymentEntity = event?.payload?.payment?.entity;
        const refundEntity = event?.payload?.refund?.entity;
        const orderId = String(paymentEntity?.order_id || '');
        const paymentId = String(paymentEntity?.id || refundEntity?.payment_id || '');

        if (eventType === 'payment.captured' && orderId) {
          await markPaymentCaptured({
            orderId,
            paymentId,
            paymentMethod: String(paymentEntity?.method || ''),
            webhookVerified: true,
            notes: 'Verified via Razorpay payment.captured webhook',
          });
        } else if (eventType === 'payment.failed' && orderId) {
          await markPaymentFailedOrRefunded({
            orderId,
            paymentId,
            status: 'FAILED',
            webhookVerified: true,
            notes: String(paymentEntity?.error_description || 'Payment failed via webhook'),
          });
        } else if (eventType === 'refund.processed' && orderId) {
          await markPaymentFailedOrRefunded({
            orderId,
            paymentId,
            status: 'REFUNDED',
            webhookVerified: true,
            notes: 'Refund processed via Razorpay webhook',
          });
        }

        res.json({ received: true });
      } catch (error: any) {
        res.status(400).json({ error: error?.message || 'Webhook processing failed.' });
      }
    }
  );

  app.use(express.json({ limit: '16mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.get('/favicon.ico', (_req, res) => {
    const svgIcon = path.resolve(__dirname, 'public/favicon.svg');
    if (fs.existsSync(svgIcon)) {
      res.type('image/svg+xml').sendFile(svgIcon);
      return;
    }
    res.status(204).end();
  });

  // Baseline security headers compatible with AI Studio iframe preview
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // =========================================================================
  // PUBLIC API ROUTES (No Admin Auth Required — Strictly PII-Isolated)
  // =========================================================================

  app.get('/api/public/bootstrap', async (_req, res) => {
    try {
      const data = await getPublicBootstrapData();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Unable to load public data.' });
    }
  });

  app.post('/api/public/submissions', async (req, res) => {
    try {
      const body = req.body ?? {};
      const formType = String(body.formType || '').trim();
      const formDef = await getFormDefinitionById(formType);

      const validation = validatePublicSubmissionPayload(
        {
          formType,
          applicantName: String(body.applicantName ?? ''),
          mobile: String(body.mobile ?? ''),
          district: String(body.district ?? ''),
          villageOrOrg: String(body.villageOrOrg ?? ''),
          details: String(body.details ?? ''),
          customFields:
            body.customFields && typeof body.customFields === 'object'
              ? body.customFields
              : {},
          consentAccepted: Boolean(body.consentAccepted),
        },
        formDef
      );

      if (!validation.valid || !formDef) {
        return res.status(400).json({
          error: Object.values(validation.errors)[0] || 'Invalid submission fields.',
          errors: validation.errors,
        });
      }

      // Duplicate mobile + form category check for the 12 registration forms
      if (formDef.id !== 'contact') {
        const duplicate = await findDuplicateSubmission(formDef.id, validation.cleanMobile);
        if (duplicate) {
          return res.status(409).json({
            error: `An application (${duplicate.applicationId}) is already registered with this mobile number for this category.`,
            errors: {
              duplicate: `An application (${duplicate.applicationId}) is already registered with this mobile number for this category.`,
            },
          });
        }
      }

      const safeCustomFields: Record<string, string> = {};
      if (body.customFields && typeof body.customFields === 'object') {
        for (const [k, v] of Object.entries(body.customFields)) {
          safeCustomFields[String(k).slice(0, 80)] = String(v ?? '').trim().slice(0, 500);
        }
      }

      const created = await createPublicSubmission({
        formType: formDef.id,
        codePrefix: formDef.codePrefix,
        applicantName: String(body.applicantName).trim().slice(0, 140),
        mobile: validation.cleanMobile,
        district: String(body.district).trim().slice(0, 80),
        villageOrOrg: String(body.villageOrOrg).trim().slice(0, 200),
        details: String(body.details ?? '').trim().slice(0, 2000) || 'Initial registration submitted',
        customFields: safeCustomFields,
        consentAccepted: Boolean(body.consentAccepted),
      });

      res.status(201).json({
        submission: maskSubmissionForPublicLookup(created),
      });
    } catch (error: any) {
      res.status(500).json({
        error: error?.message || 'Unable to submit registration right now.',
      });
    }
  });

  app.get('/api/public/status/:applicationId', async (req, res) => {
    try {
      const appId = String(req.params.applicationId || '').trim();
      if (!appId || appId.length > 40) {
        return res.status(400).json({ error: 'Invalid Application ID.' });
      }
      const match = await findSubmissionByApplicationId(appId);
      if (!match) {
        return res.status(404).json({ error: 'Application ID not found.' });
      }
      res.json({ record: maskSubmissionForPublicLookup(match) });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Status lookup failed.' });
    }
  });

  // =========================================================================
  // SERVER-VERIFIED RAZORPAY PAYMENT ENDPOINTS (TAMPER-PROOF FEE LOOKUP)
  // =========================================================================
  app.post('/api/payments/create-order', async (req, res) => {
    try {
      const b = req.body ?? {};
      const purpose = b.purpose === 'donation' ? 'donation' : 'marathon';
      const referenceId = String(b.referenceId || '').trim().slice(0, 60);
      const eventId = String(b.eventId || '').trim().slice(0, 100);
      const categoryName = String(b.categoryName || '').trim().slice(0, 140);
      const payerName = String(b.payerName || '').trim().slice(0, 140);
      const payerMobile = String(b.payerMobile || '').replace(/\D/g, '').slice(-10);
      const district = String(b.district || '').trim().slice(0, 80);

      if (!payerName || payerMobile.length < 10) {
        return res.status(400).json({ error: 'Valid payer name and 10-digit mobile are required.' });
      }

      let amountInr = 0;
      if (purpose === 'marathon') {
        const events = await listMarathonEvents();
        const evt =
          events.find((e) => e.id === eventId) ||
          events.find((e) => e.registrationOpen) ||
          events[0];
        if (!evt) {
          return res.status(404).json({ error: 'Marathon event not found.' });
        }
        const matchedCat = (evt.raceCategories ?? []).find(
          (rc) =>
            rc.name.toLowerCase() === categoryName.toLowerCase() ||
            categoryName.toLowerCase().includes(rc.name.toLowerCase()) ||
            rc.name.toLowerCase().includes(categoryName.toLowerCase())
        );
        if (!matchedCat) {
          return res.status(400).json({ error: 'Selected race category is not valid for this event.' });
        }
        amountInr = Math.max(0, Math.floor(Number(matchedCat.feeInr ?? 0)));
      } else {
        const requested = Math.floor(Number(b.amountInr ?? 0));
        if (!Number.isFinite(requested) || requested < 100 || requested > 5000000) {
          return res.status(400).json({ error: 'Donation amount must be between ₹100 and ₹50,00,000.' });
        }
        amountInr = requested;
      }

      if (amountInr === 0) {
        return res.json({
          freeCategory: true,
          amountInr: 0,
          message: 'This category is free community participation — no payment required.',
        });
      }

      const { keyId, keySecret, hasKeys, mode } = getRazorpayConfig();
      let orderId = `order_gvd_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      let sandboxToken = '';

      if (hasKeys) {
        const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authHeader}`,
          },
          body: JSON.stringify({
            amount: amountInr * 100,
            currency: 'INR',
            receipt: referenceId || orderId.slice(0, 36),
            notes: {
              purpose,
              referenceId,
              categoryName,
              district,
            },
          }),
        });
        const rzpData = await rzpRes.json().catch(() => ({}));
        if (!rzpRes.ok || !rzpData?.id) {
          return res.status(502).json({
            error: rzpData?.error?.description || 'Failed to create order with Razorpay.',
          });
        }
        orderId = String(rzpData.id);
      } else {
        // Clearly flagged sandbox verification token (computed server-side with process secret)
        sandboxToken = crypto
          .createHmac('sha256', 'goveda-dev-sandbox-secret')
          .update(orderId)
          .digest('hex');
      }

      const tx = await createPaymentTransaction({
        orderId,
        purpose,
        referenceId,
        eventId,
        categoryName,
        payerName,
        payerMobile,
        district,
        amountInr,
        notes: hasKeys ? `Razorpay ${mode} order created` : 'Sandbox Test Mode order (add RAZORPAY_KEY_ID & SECRET in .env for live checkout)',
      });

      res.status(201).json({
        freeCategory: false,
        mode,
        keyId: hasKeys ? keyId : 'rzp_sandbox_dev',
        orderId: tx.orderId,
        amountInr: tx.amountInr,
        amountPaise: tx.amountInr * 100,
        currency: 'INR',
        sandboxToken: hasKeys ? undefined : sandboxToken,
      });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Unable to initiate payment order.' });
    }
  });

  app.post('/api/payments/verify', async (req, res) => {
    try {
      const b = req.body ?? {};
      const orderId = String(b.orderId || b.razorpay_order_id || '').trim();
      const paymentId = String(b.paymentId || b.razorpay_payment_id || '').trim();
      const signature = String(b.signature || b.razorpay_signature || '').trim();
      const paymentMethod = String(b.paymentMethod || 'upi').trim().slice(0, 40);

      if (!orderId || !paymentId) {
        return res.status(400).json({ error: 'orderId and paymentId are required.' });
      }

      const existing = await findPaymentByOrderId(orderId);
      if (!existing) {
        return res.status(404).json({ error: 'Payment order not found.' });
      }

      const { keySecret, hasKeys } = getRazorpayConfig();
      if (hasKeys) {
        const expected = crypto
          .createHmac('sha256', keySecret)
          .update(`${orderId}|${paymentId}`)
          .digest('hex');
        if (!signature || !timingSafeHexEqual(signature, expected)) {
          return res.status(400).json({ error: 'Cryptographic Razorpay payment signature mismatch.' });
        }
      } else {
        const expectedSandbox = crypto
          .createHmac('sha256', 'goveda-dev-sandbox-secret')
          .update(orderId)
          .digest('hex');
        if (!signature || !timingSafeHexEqual(signature, expectedSandbox)) {
          return res.status(400).json({ error: 'Invalid sandbox verification token.' });
        }
      }

      const updated = await markPaymentCaptured({
        orderId,
        paymentId,
        paymentMethod,
        signatureVerified: true,
        notes: hasKeys
          ? 'Verified via server HMAC-SHA256 Razorpay signature'
          : 'Verified in Sandbox Test Mode (Server-signed token)',
      });

      res.json({
        verified: true,
        transaction: updated,
      });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Payment verification failed.' });
    }
  });

  // =========================================================================
  // PROTECTED ADMIN API ROUTES (Cryptographic Token + Server RBAC Enforced)
  // =========================================================================

  app.get('/api/admin/me', requireAdmin, (req: AdminRequest, res) => {
    const admin = req.adminUser!;
    res.json({
      user: admin,
      allowedModules: getAllowedModulesForRole(admin.role),
    });
  });

  app.get(
    '/api/admin/overview',
    requireAdmin,
    requireModuleAccess('overview'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const rawTf = String(req.query.timeframe || '30d');
        const timeframe: TimeframeKey = ['1d', '7d', '30d', '16m', 'max'].includes(rawTf)
          ? (rawTf as TimeframeKey)
          : '30d';

        const [forms, districtRows, eventRows, projectRows, metricRows, contentRows] =
          await Promise.all([
            listAllFormDefinitions(),
            listDistricts(),
            listMarathonEvents(),
            listProjects(),
            listImpactMetrics(),
            listContentItems(),
          ]);

        // Content Editors receive aggregated non-PII counts only; no applicant rows!
        const canSeeSubmissions =
          admin.role === 'super_admin' || admin.role === 'district_coordinator';

        const submissions = canSeeSubmissions
          ? await listSubmissionsScoped({
              role: admin.role,
              assignedDistricts: admin.assignedDistricts,
            })
          : [];

        const totalSubmissions = submissions.length;
        const pendingReview = submissions.filter(
          (s) => s.status !== 'Approved' && s.status !== 'Rejected'
        ).length;
        const approvedCount = submissions.filter((s) => s.status === 'Approved').length;
        const rejectedCount = submissions.filter((s) => s.status === 'Rejected').length;
        const openFormsCount = forms.filter((f) => f.id !== 'contact' && f.isOpen).length;

        const districtMap = new Map<string, number>();
        for (const s of submissions) {
          districtMap.set(s.district, (districtMap.get(s.district) ?? 0) + 1);
        }

        const series = buildAnalyticsSeries(submissions, timeframe);
        const formBreakdown = buildFormTypeBreakdown(submissions, forms);

        res.json({
          timeframe,
          kpis: {
            totalSubmissions,
            pendingReview,
            approvedCount,
            rejectedCount,
            approvalRate:
              totalSubmissions > 0
                ? Number(((approvedCount / totalSubmissions) * 100).toFixed(1))
                : 0,
            activeDistricts: districtRows.filter((d) => d.isActive).length,
            openFormsCount,
            totalFormsCount: forms.filter((f) => f.id !== 'contact').length,
            totalEvents: eventRows.length,
            totalProjects: projectRows.length,
            publishedContentCount: contentRows.filter((c) => c.status === 'Published').length,
          },
          series,
          formBreakdown,
          districtBreakdown: Array.from(districtMap.entries())
            .map(([district, count]) => ({ district, count }))
            .sort((a, b) => b.count - a.count),
          recentSubmissions: canSeeSubmissions ? submissions.slice(0, 8) : [],
          impactMetrics: metricRows,
        });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Unable to load overview analytics.' });
      }
    }
  );

  // --- Submissions (12 Forms + Contact Desk) ---
  app.get(
    '/api/admin/submissions',
    requireAdmin,
    requireModuleAccess('submissions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const rows = await listSubmissionsScoped({
          role: admin.role,
          assignedDistricts: admin.assignedDistricts,
          formType: String(req.query.formType || 'all'),
          status: String(req.query.status || 'all'),
          district: String(req.query.district || 'all'),
          dateFrom: String(req.query.dateFrom || ''),
          dateTo: String(req.query.dateTo || ''),
          q: String(req.query.q || ''),
        });
        res.json({ submissions: rows });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load submissions.' });
      }
    }
  );

  // Fixes the filtered-table linked farmer count bug & powers visual Harit Mitra Tree View
  app.get(
    '/api/admin/submissions/harit-mitra-network',
    requireAdmin,
    requireModuleAccess('submissions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const network = await getHaritMitraNetwork({
          role: admin.role,
          assignedDistricts: admin.assignedDistricts,
        });
        res.json(network);
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load Harit Mitra network.' });
      }
    }
  );

  app.get(
    '/api/admin/submissions/export.csv',
    requireAdmin,
    requireModuleAccess('submissions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const [rows, forms] = await Promise.all([
          listSubmissionsScoped({
            role: admin.role,
            assignedDistricts: admin.assignedDistricts,
            formType: String(req.query.formType || 'all'),
            status: String(req.query.status || 'all'),
            district: String(req.query.district || 'all'),
            dateFrom: String(req.query.dateFrom || ''),
            dateTo: String(req.query.dateTo || ''),
            q: String(req.query.q || ''),
          }),
          listAllFormDefinitions(),
        ]);

        const formTitleMap = new Map(forms.map((f) => [f.id, f.titleEn]));
        const csv = buildSubmissionsCsv(
          rows.map((r) => ({
            ...r,
            formTitle: formTitleMap.get(r.formType) ?? r.formType,
          }))
        );

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'EXPORT_CSV',
          entityType: 'form_submissions',
          entityId: String(req.query.formType || 'all'),
          summary: `Exported ${rows.length} submission rows to CSV (${req.query.dateFrom || 'all'} to ${req.query.dateTo || 'now'})`,
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="goveda-submissions-${new Date().toISOString().slice(0, 10)}.csv"`
        );
        res.send(csv);
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'CSV export failed.' });
      }
    }
  );

  app.get(
    '/api/admin/submissions/export.json',
    requireAdmin,
    requireModuleAccess('submissions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const rows = await listSubmissionsScoped({
          role: admin.role,
          assignedDistricts: admin.assignedDistricts,
          formType: String(req.query.formType || 'all'),
          status: String(req.query.status || 'all'),
          district: String(req.query.district || 'all'),
          dateFrom: String(req.query.dateFrom || ''),
          dateTo: String(req.query.dateTo || ''),
          q: String(req.query.q || ''),
        });
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'EXPORT_JSON_BACKUP',
          entityType: 'form_submissions',
          entityId: String(req.query.formType || 'all'),
          summary: `Downloaded JSON backup of ${rows.length} submissions`,
        });
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="goveda-submissions-backup-${new Date().toISOString().slice(0, 10)}.json"`
        );
        res.send(
          JSON.stringify(
            {
              exportedAt: new Date().toISOString(),
              filters: {
                formType: req.query.formType || 'all',
                status: req.query.status || 'all',
                district: req.query.district || 'all',
                dateFrom: req.query.dateFrom || '',
                dateTo: req.query.dateTo || '',
              },
              totalRecords: rows.length,
              submissions: rows,
            },
            null,
            2
          )
        );
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'JSON backup export failed.' });
      }
    }
  );

  // Admin direct creation of a member / Harit Mitra / applicant with auto-issued Unique ID
  app.post(
    '/api/admin/submissions',
    requireAdmin,
    requireModuleAccess('submissions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const body = req.body ?? {};
        const formType = String(body.formType || 'harit-mitra').trim();
        const formDef = await getFormDefinitionById(formType);
        if (!formDef) {
          return res.status(400).json({ error: 'Selected form category does not exist.' });
        }
        const applicantName = String(body.applicantName || '').trim().slice(0, 140);
        const mobile = String(body.mobile || '').replace(/\D/g, '').slice(-10);
        const district = String(body.district || 'Bhilwara').trim().slice(0, 80);
        const villageOrOrg = String(body.villageOrOrg || '').trim().slice(0, 200);
        if (applicantName.length < 2) {
          return res.status(400).json({ error: 'Applicant full name is required.' });
        }
        if (!/^[6-9]\d{9}$/.test(mobile)) {
          return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
        }

        const safeCustomFields: Record<string, string> = {};
        if (body.customFields && typeof body.customFields === 'object') {
          for (const [k, v] of Object.entries(body.customFields)) {
            safeCustomFields[String(k).slice(0, 80)] = String(v ?? '').trim().slice(0, 500);
          }
        }

        const created = await createPublicSubmission({
          formType: formDef.id,
          codePrefix: formDef.codePrefix,
          applicantName,
          mobile,
          district,
          villageOrOrg: villageOrOrg || district,
          details: String(body.details || 'Registered directly via Admin Console').trim().slice(0, 2000),
          customFields: safeCustomFields,
          consentAccepted: true,
        });

        // Auto-issue Unique Member ID (and Harit Mitra Referral Code if applicable)
        const enrichedFields: Record<string, string> = {
          ...(created.customFields ?? {}),
          memberUniqueId: generateUniqueMemberId(created.formType, created.district, created.id),
        };
        if (created.formType === 'harit-mitra' && !enrichedFields.referralCode) {
          enrichedFields.referralCode = generateHaritMitraCode(created.district, created.id);
        }

        const updated = await updateSubmissionReview({
          id: created.id,
          status:
            body.status && VALID_SUBMISSION_STATUSES.includes(body.status)
              ? body.status
              : 'Approved',
          adminNotes: String(body.adminNotes || 'Issued directly via Admin Console').slice(0, 2000),
          customFields: enrichedFields,
          reviewerEmail: admin.email,
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'ADMIN_CREATE_SUBMISSION',
          entityType: 'form_submissions',
          entityId: created.applicationId,
          summary: `Created ${created.formType} record ${created.applicationId} for ${applicantName} (${district})`,
        });

        res.status(201).json({ submission: updated ?? created });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to create member record.' });
      }
    }
  );

  app.patch(
    '/api/admin/submissions/:id',
    requireAdmin,
    requireModuleAccess('submissions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
          return res.status(400).json({ error: 'Invalid submission ID.' });
        }

        const existing = await getSubmissionById(id);
        if (!existing) {
          return res.status(404).json({ error: 'Submission not found.' });
        }

        if (!isDistrictAllowed(admin.role, admin.assignedDistricts, existing.district)) {
          return res.status(403).json({
            error: 'You are not assigned to manage submissions from this district.',
          });
        }

        const nextStatus =
          req.body?.status !== undefined ? String(req.body.status) : undefined;
        if (
          nextStatus !== undefined &&
          !VALID_SUBMISSION_STATUSES.includes(nextStatus as any)
        ) {
          return res.status(400).json({ error: 'Invalid submission status value.' });
        }

        const nextNotes =
          req.body?.adminNotes !== undefined
            ? String(req.body.adminNotes).slice(0, 2000)
            : undefined;

        let nextCustomFields: Record<string, string> | undefined;
        if (req.body?.customFields && typeof req.body.customFields === 'object') {
          nextCustomFields = { ...(existing.customFields ?? {}) };
          for (const [k, v] of Object.entries(req.body.customFields)) {
            nextCustomFields[String(k).slice(0, 80)] = String(v ?? '').trim().slice(0, 500);
          }
        }
        if (req.body?.generateReferralCode && existing.formType === 'harit-mitra') {
          const generatedCode = generateHaritMitraCode(existing.district, existing.id);
          nextCustomFields = {
            ...(nextCustomFields ?? existing.customFields ?? {}),
            referralCode: generatedCode,
            memberUniqueId:
              (nextCustomFields ?? existing.customFields)?.memberUniqueId ||
              generateUniqueMemberId(existing.formType, existing.district, existing.id),
          };
        }
        if (req.body?.generateUniqueId) {
          const generatedUniqueId = generateUniqueMemberId(
            existing.formType,
            existing.district,
            existing.id
          );
          nextCustomFields = {
            ...(nextCustomFields ?? existing.customFields ?? {}),
            memberUniqueId: generatedUniqueId,
          };
          if (existing.formType === 'harit-mitra' && !nextCustomFields.referralCode) {
            nextCustomFields.referralCode = generateHaritMitraCode(existing.district, existing.id);
          }
        }

        const updated = await updateSubmissionReview({
          id,
          status: nextStatus,
          adminNotes: nextNotes,
          customFields: nextCustomFields,
          reviewerEmail: admin.email,
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'UPDATE_SUBMISSION',
          entityType: 'form_submissions',
          entityId: existing.applicationId,
          summary: `Updated ${existing.applicationId}: status ${existing.status} -> ${updated?.status ?? existing.status}`,
        });

        res.json({ submission: updated });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to update submission.' });
      }
    }
  );

  app.post(
    '/api/admin/submissions/bulk-status',
    requireAdmin,
    requireModuleAccess('submissions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const ids: number[] = Array.isArray(req.body?.ids)
          ? req.body.ids.map(Number).filter((n: number) => Number.isInteger(n) && n > 0)
          : [];
        const status = String(req.body?.status || '');

        if (ids.length === 0) {
          return res.status(400).json({ error: 'No submissions selected.' });
        }
        if (!VALID_SUBMISSION_STATUSES.includes(status as any)) {
          return res.status(400).json({ error: 'Invalid target status.' });
        }

        // Enforce district scoping on every selected ID
        const scopedRows = await listSubmissionsScoped({
          role: admin.role,
          assignedDistricts: admin.assignedDistricts,
        });
        const allowedIdSet = new Set(scopedRows.map((r) => r.id));
        const permittedIds = ids.filter((id) => allowedIdSet.has(id));

        if (permittedIds.length === 0) {
          return res.status(403).json({
            error: 'Selected submissions fall outside your authorized district scope.',
          });
        }

        const updated = await bulkUpdateSubmissionStatus({
          ids: permittedIds,
          status,
          reviewerEmail: admin.email,
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'BULK_STATUS_UPDATE',
          entityType: 'form_submissions',
          entityId: `${permittedIds.length} records`,
          summary: `Set ${updated.length} submissions to "${status}"`,
        });

        res.json({ updatedCount: updated.length });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Bulk update failed.' });
      }
    }
  );

  app.delete(
    '/api/admin/submissions/:id',
    requireAdmin,
    requireModuleAccess('team'), // Super Admin only
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const id = Number(req.params.id);
        const deleted = await deleteSubmissionById(id);
        if (!deleted) {
          return res.status(404).json({ error: 'Submission not found.' });
        }

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_SUBMISSION',
          entityType: 'form_submissions',
          entityId: deleted.applicationId,
          summary: `Deleted submission ${deleted.applicationId} (${deleted.applicantName})`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete submission.' });
      }
    }
  );

  // --- Dynamic 12-Form Studio ---
  app.get(
    '/api/admin/forms',
    requireAdmin,
    async (_req: AdminRequest, res) => {
      try {
        const forms = await listAllFormDefinitions();
        res.json({ forms });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load forms.' });
      }
    }
  );

  app.patch(
    '/api/admin/forms/:id',
    requireAdmin,
    requireModuleAccess('forms'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const id = String(req.params.id || '').trim();
        const body = req.body ?? {};
        const patch: Record<string, unknown> = {};

        if (typeof body.isOpen === 'boolean') patch.isOpen = body.isOpen;
        if (typeof body.titleHi === 'string') patch.titleHi = body.titleHi.trim().slice(0, 200);
        if (typeof body.titleEn === 'string') patch.titleEn = body.titleEn.trim().slice(0, 200);
        if (typeof body.subtitleHi === 'string') patch.subtitleHi = body.subtitleHi.trim().slice(0, 400);
        if (typeof body.subtitleEn === 'string') patch.subtitleEn = body.subtitleEn.trim().slice(0, 400);
        if (typeof body.closedMessageHi === 'string')
          patch.closedMessageHi = body.closedMessageHi.trim().slice(0, 400);
        if (typeof body.closedMessageEn === 'string')
          patch.closedMessageEn = body.closedMessageEn.trim().slice(0, 400);
        if (Array.isArray(body.customFields)) {
          patch.customFields = body.customFields.slice(0, 20);
        }

        const updated = await updateFormDefinition(id, patch as any);
        if (!updated) {
          return res.status(404).json({ error: 'Form definition not found.' });
        }

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'UPDATE_FORM_STUDIO',
          entityType: 'form_definitions',
          entityId: id,
          summary: `Updated Form #${updated.formNumber} (${updated.titleEn}) · Open=${updated.isOpen} · Fields=${updated.customFields.length}`,
        });

        res.json({ form: updated });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to update form definition.' });
      }
    }
  );

  // --- Campaigns & Frontend Participation Roles ---
  app.get(
    '/api/admin/campaigns',
    requireAdmin,
    requireModuleAccess('campaigns'),
    async (_req, res) => {
      try {
        const list = await listCampaigns();
        res.json({ campaigns: list });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load campaigns.' });
      }
    }
  );

  app.post(
    '/api/admin/campaigns',
    requireAdmin,
    requireModuleAccess('campaigns'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const titleEn = String(b.titleEn || '').trim();
        if (!titleEn) return res.status(400).json({ error: 'Campaign title (English) is required.' });

        const id =
          String(b.id || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-') || `cmp-${slugifyTitle(titleEn) || Date.now()}-${Date.now().toString().slice(-4)}`;

        const district = String(b.district || '').trim();
        const stateName = String(b.stateName || 'Rajasthan').trim();
        const campaignCode =
          String(b.campaignCode || '').trim().toUpperCase() ||
          generateUniqueCampaignCode(district || stateName);

        const rawRoles = Array.isArray(b.roles) ? b.roles : [];
        const cleanRoles = rawRoles
          .filter((r: any) => r && String(r.titleEn || r.titleHi || '').trim().length > 0)
          .map((r: any, idx: number) => ({
            id: String(r.id || `role-${Date.now()}-${idx}`).trim(),
            roleCode:
              String(r.roleCode || `ROLE-${String(idx + 1).padStart(2, '0')}`)
                .trim()
                .toUpperCase()
                .slice(0, 32),
            titleEn: String(r.titleEn || r.titleHi || '').trim().slice(0, 120),
            titleHi: String(r.titleHi || r.titleEn || '').trim().slice(0, 120),
            descriptionEn: String(r.descriptionEn || '').trim().slice(0, 400),
            descriptionHi: String(r.descriptionHi || r.descriptionEn || '').trim().slice(0, 400),
            formType: String(r.formType || 'volunteer').trim(),
            maxSlots: Math.max(0, Number(r.maxSlots) || 0),
            isOpen: Boolean(r.isOpen ?? true),
          }));

        const saved = await upsertCampaign({
          id,
          campaignCode,
          titleHi: String(b.titleHi || titleEn).trim().slice(0, 200),
          titleEn: titleEn.slice(0, 200),
          summaryHi: String(b.summaryHi || b.summaryEn || '').trim().slice(0, 1000),
          summaryEn: String(b.summaryEn || b.summaryHi || '').trim().slice(0, 1000),
          missionPillar: String(b.missionPillar || 'Harit Rajasthan').trim().slice(0, 120),
          scope: ['National', 'Statewide', 'District', 'Local'].includes(b.scope)
            ? b.scope
            : 'District',
          stateSlug: String(b.stateSlug || slugifyTitle(stateName) || 'rajasthan').trim(),
          stateName,
          district: district || 'Bhilwara',
          subDistrict: String(b.subDistrict || '').trim().slice(0, 120),
          villageOrTown: String(b.villageOrTown || '').trim().slice(0, 120),
          startDate: String(b.startDate || '').trim().slice(0, 20),
          endDate: String(b.endDate || '').trim().slice(0, 20),
          status: ['Planned', 'Active', 'Completed'].includes(b.status) ? b.status : 'Active',
          isPublished: Boolean(b.isPublished ?? true),
          bannerUrl: String(b.bannerUrl || '').trim().slice(0, 500),
          roles: cleanRoles,
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_CAMPAIGN',
          entityType: 'campaigns',
          entityId: saved.campaignCode,
          summary: `Saved campaign "${saved.titleEn}" (${saved.campaignCode}) in ${saved.district}, ${saved.stateName} with ${saved.roles.length} frontend roles`,
        });

        res.json({ campaign: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save campaign.' });
      }
    }
  );

  app.delete(
    '/api/admin/campaigns/:id',
    requireAdmin,
    requireModuleAccess('campaigns'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = await deleteCampaign(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Campaign not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_CAMPAIGN',
          entityType: 'campaigns',
          entityId: deleted.campaignCode,
          summary: `Deleted campaign "${deleted.titleEn}" (${deleted.campaignCode})`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete campaign.' });
      }
    }
  );

  // --- Blueprint Modules: Homepage Sections, Pages & Navigation, 10 Missions, Waste Management, Unified Programmes ---
  app.get('/api/admin/blueprint', requireAdmin, async (_req, res) => {
    try {
      res.json(blueprintStore.getAll());
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Failed to load blueprint workspace.' });
    }
  });

  app.get(
    '/api/admin/programmes',
    requireAdmin,
    requireModuleAccess('programmes'),
    async (_req, res) => {
      try {
        res.json({ programmes: blueprintStore.getAll().programmes });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load unified programmes.' });
      }
    }
  );

  app.post(
    '/api/admin/programmes',
    requireAdmin,
    requireModuleAccess('programmes'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const saved = blueprintStore.upsertProgramme(req.body ?? {});
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_UNIFIED_PROGRAMME',
          entityType: 'programmes',
          entityId: saved.programmeCode,
          summary: `Saved ${saved.type} "${saved.titleEn}" (${saved.publicationStatus} / ${saved.operationalStatus})${saved.parentId ? ` under parent ${saved.parentId}` : ''}`,
        });
        res.json({ programme: saved, programmes: blueprintStore.getAll().programmes });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save programme.' });
      }
    }
  );

  app.delete(
    '/api/admin/programmes/:id',
    requireAdmin,
    requireModuleAccess('programmes'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = blueprintStore.deleteProgramme(req.params.id);
        if (!deleted) {
          return res.status(404).json({ error: 'Programme record not found.' });
        }
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_UNIFIED_PROGRAMME',
          entityType: 'programmes',
          entityId: deleted.programmeCode,
          summary: `Deleted ${deleted.type} "${deleted.titleEn}"`,
        });
        res.json({ deleted: true, programmes: blueprintStore.getAll().programmes });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete programme.' });
      }
    }
  );

  app.put(
    '/api/admin/founder-message',
    requireAdmin,
    requireModuleAccess('board'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const saved = blueprintStore.saveFounderMessage(req.body ?? {});
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_FOUNDER_MESSAGE',
          entityType: 'founder_message',
          entityId: 'about-us',
          summary: `Updated Founder Message (${saved.showOnAboutUs ? 'Visible on About Us' : 'Hidden'})`,
        });
        res.json({ founderMessage: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save founder message.' });
      }
    }
  );

  app.put(
    '/api/admin/homepage-sections',
    requireAdmin,
    requireModuleAccess('homepage'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const sections = Array.isArray(req.body?.sections) ? req.body.sections : [];
        if (sections.length === 0) {
          return res.status(400).json({ error: 'Homepage sections payload is required.' });
        }
        const saved = blueprintStore.saveHomepageSections(sections);
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_HOMEPAGE_SECTIONS',
          entityType: 'homepage_sections',
          entityId: `${saved.length} sections`,
          summary: `Updated homepage layout (${saved.filter((s) => s.enabled && s.visible).length}/${saved.length} visible)`,
        });
        res.json({ homepageSections: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save homepage sections.' });
      }
    }
  );

  app.post(
    '/api/admin/pages',
    requireAdmin,
    requireModuleAccess('pages'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const saved = blueprintStore.upsertStaticPage(req.body ?? {});
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_STATIC_PAGE',
          entityType: 'static_pages',
          entityId: saved.slug,
          summary: `Saved page "${saved.titleEn}" (${saved.status}) under ${saved.parentPath}`,
        });
        res.json({ page: saved, staticPages: blueprintStore.getAll().staticPages });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save static page.' });
      }
    }
  );

  app.delete(
    '/api/admin/pages/:id',
    requireAdmin,
    requireModuleAccess('pages'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = blueprintStore.deleteStaticPage(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Page not found.' });
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_STATIC_PAGE',
          entityType: 'static_pages',
          entityId: deleted.slug,
          summary: `Deleted static page "${deleted.titleEn}"`,
        });
        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete static page.' });
      }
    }
  );

  app.put(
    '/api/admin/missions/:slug',
    requireAdmin,
    requireModuleAccess('missions'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const slug = String(req.params.slug || '').trim();
        const saved = blueprintStore.updateMissionConfig(slug, req.body ?? {});
        if (!saved) return res.status(404).json({ error: 'Mission not found.' });
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'UPDATE_MISSION',
          entityType: 'missions',
          entityId: saved.slug,
          summary: `Updated Mission #${saved.number} "${saved.titleEn}" (${saved.status})`,
        });
        res.json({ mission: saved, missionConfigs: blueprintStore.getAll().missionConfigs });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to update mission.' });
      }
    }
  );

  app.post(
    '/api/admin/waste/records',
    requireAdmin,
    requireModuleAccess('waste'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const saved = blueprintStore.upsertWasteRecord(req.body ?? {});
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_WASTE_RECORD',
          entityType: 'waste_records',
          entityId: saved.id,
          summary: `Logged ${saved.quantity} ${saved.unit} ${saved.category} in ${saved.district} (${saved.verificationStatus})`,
        });
        res.json({ record: saved, wasteRecords: blueprintStore.getAll().wasteRecords });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save waste activity record.' });
      }
    }
  );

  app.delete(
    '/api/admin/waste/records/:id',
    requireAdmin,
    requireModuleAccess('waste'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = blueprintStore.deleteWasteRecord(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Waste record not found.' });
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_WASTE_RECORD',
          entityType: 'waste_records',
          entityId: deleted.id,
          summary: `Deleted waste record "${deleted.title}"`,
        });
        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete waste record.' });
      }
    }
  );

  app.post(
    '/api/admin/waste/partners',
    requireAdmin,
    requireModuleAccess('waste'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const saved = blueprintStore.upsertWastePartner(req.body ?? {});
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_WASTE_PARTNER',
          entityType: 'waste_partners',
          entityId: saved.id,
          summary: `Saved waste partner "${saved.name}" (${saved.partnerType})`,
        });
        res.json({ partner: saved, wastePartners: blueprintStore.getAll().wastePartners });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save waste partner.' });
      }
    }
  );

  app.delete(
    '/api/admin/waste/partners/:id',
    requireAdmin,
    requireModuleAccess('waste'),
    async (req: AdminRequest, res) => {
      try {
        const deleted = blueprintStore.deleteWastePartner(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Waste partner not found.' });
        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete waste partner.' });
      }
    }
  );

  // --- Harit Marathon & Events ---
  app.get(
    '/api/admin/events',
    requireAdmin,
    requireModuleAccess('events'),
    async (_req, res) => {
      try {
        const events = await listMarathonEvents();
        res.json({ events });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load events.' });
      }
    }
  );

  app.post(
    '/api/admin/events',
    requireAdmin,
    requireModuleAccess('events'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const titleEn = String(b.titleEn || '').trim();
        if (!titleEn) return res.status(400).json({ error: 'Event title is required.' });

        const id =
          String(b.id || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-') || `evt-${Date.now()}`;

        const isoEventDate = String(b.eventDate || '2026-12-20').trim();
        const formattedDates = formatBilingualIsoDate(isoEventDate);
        const saved = await upsertMarathonEvent({
          id,
          titleHi: String(b.titleHi || titleEn).trim(),
          titleEn,
          themeHi: String(b.themeHi || '').trim(),
          themeEn: String(b.themeEn || '').trim(),
          scope: ['National', 'Statewide', 'District', 'Local'].includes(b.scope)
            ? b.scope
            : 'District',
          stateName: String(b.stateName || 'Rajasthan').trim(),
          district: String(b.district || 'Bhilwara').trim(),
          subDistrict: String(b.subDistrict || '').trim(),
          villageOrTown: String(b.villageOrTown || '').trim(),
          eventDate: isoEventDate,
          dateDisplayHi: String(b.dateDisplayHi || formattedDates.hi).trim(),
          dateDisplayEn: String(b.dateDisplayEn || formattedDates.en).trim(),
          venueHi: String(b.venueHi || '').trim(),
          venueEn: String(b.venueEn || '').trim(),
          bannerUrl: String(b.bannerUrl || '').trim().slice(0, 500),
          routeNotesHi: String(b.routeNotesHi || '').trim(),
          routeNotesEn: String(b.routeNotesEn || '').trim(),
          rulesHi: String(b.rulesHi || '').trim(),
          rulesEn: String(b.rulesEn || '').trim(),
          safetyInfoHi: String(b.safetyInfoHi || '').trim(),
          safetyInfoEn: String(b.safetyInfoEn || '').trim(),
          postEventReportUrl: String(b.postEventReportUrl || '').trim().slice(0, 500),
          countdownEnabled: Boolean(b.countdownEnabled ?? true),
          status: ['Proposed', 'Confirmed', 'Completed'].includes(b.status)
            ? b.status
            : 'Proposed',
          raceCategories: Array.isArray(b.raceCategories) ? b.raceCategories : [],
          schedule: Array.isArray(b.schedule) ? b.schedule : [],
          guests: Array.isArray(b.guests) ? b.guests : [],
          sponsors: Array.isArray(b.sponsors) ? b.sponsors : [],
          registrationOpen: Boolean(b.registrationOpen ?? true),
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_EVENT',
          entityType: 'marathon_events',
          entityId: saved.id,
          summary: `Saved event "${saved.titleEn}" (${saved.status}) in ${saved.district}`,
        });

        res.json({ event: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save event.' });
      }
    }
  );

  app.delete(
    '/api/admin/events/:id',
    requireAdmin,
    requireModuleAccess('events'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = await deleteMarathonEvent(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Event not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_EVENT',
          entityType: 'marathon_events',
          entityId: deleted.id,
          summary: `Deleted event "${deleted.titleEn}"`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete event.' });
      }
    }
  );

  // --- Districts & Institutional Outreach ---
  app.get(
    '/api/admin/districts',
    requireAdmin,
    requireModuleAccess('districts'),
    async (_req, res) => {
      try {
        const rows = await listDistricts();
        res.json({ districts: rows });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load districts.' });
      }
    }
  );

  app.post(
    '/api/admin/districts',
    requireAdmin,
    requireModuleAccess('districts'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const nameEn = String(b.nameEn || '').trim();
        if (!nameEn) return res.status(400).json({ error: 'District name is required.' });

        if (
          admin.role === 'district_coordinator' &&
          !isDistrictAllowed(admin.role, admin.assignedDistricts, nameEn)
        ) {
          return res.status(403).json({
            error: 'District Coordinators can only edit their assigned district(s).',
          });
        }

        const slug =
          String(b.slug || nameEn)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') || `dist-${Date.now()}`;

        const saved = await upsertDistrict({
          slug,
          stateSlug: String(b.stateSlug || 'rajasthan').trim().toLowerCase(),
          stateNameHi: String(b.stateNameHi || 'राजस्थान').trim(),
          stateNameEn: String(b.stateNameEn || 'Rajasthan').trim(),
          nameHi: String(b.nameHi || nameEn).trim(),
          nameEn,
          regionTagHi: String(b.regionTagHi || 'फोकस जिला').trim(),
          regionTagEn: String(b.regionTagEn || 'Focus District').trim(),
          focusSummaryHi: String(b.focusSummaryHi || '').trim(),
          focusSummaryEn: String(b.focusSummaryEn || '').trim(),
          coordinatorName: String(b.coordinatorName || 'District Desk').trim(),
          outreachNotes: String(b.outreachNotes || '').trim(),
          progressNotesHi: String(b.progressNotesHi || '').trim(),
          progressNotesEn: String(b.progressNotesEn || '').trim(),
          mapX: Math.min(95, Math.max(5, Number(b.mapX) || 50)),
          mapY: Math.min(95, Math.max(5, Number(b.mapY) || 50)),
          subDistricts: Array.isArray(b.subDistricts)
            ? b.subDistricts.map((v: unknown) => String(v || '').trim()).filter(Boolean)
            : [],
          villages: Array.isArray(b.villages)
            ? b.villages.map((v: unknown) => String(v || '').trim()).filter(Boolean)
            : [],
          galleryUrls: Array.isArray(b.galleryUrls)
            ? b.galleryUrls.map((u: unknown) => String(u || '').trim()).filter(Boolean)
            : [],
          outreachItems: Array.isArray(b.outreachItems) ? b.outreachItems : [],
          isActive: Boolean(b.isActive ?? true),
          displayOrder: Number(b.displayOrder) || 10,
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_DISTRICT',
          entityType: 'districts',
          entityId: saved.slug,
          summary: `Updated district "${saved.nameEn}" (Active=${saved.isActive})`,
        });

        res.json({ district: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save district.' });
      }
    }
  );

  app.delete(
    '/api/admin/districts/:slug',
    requireAdmin,
    requireModuleAccess('team'), // Super Admin only
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = await deleteDistrict(String(req.params.slug));
        if (!deleted) return res.status(404).json({ error: 'District not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_DISTRICT',
          entityType: 'districts',
          entityId: deleted.slug,
          summary: `Removed district "${deleted.nameEn}"`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete district.' });
      }
    }
  );

  // --- Projects & Verified Impact Counters ---
  app.get(
    '/api/admin/projects',
    requireAdmin,
    requireModuleAccess('projects'),
    async (_req, res) => {
      try {
        const [projectRows, metricRows] = await Promise.all([
          listProjects(),
          listImpactMetrics(),
        ]);
        res.json({ projects: projectRows, impactMetrics: metricRows });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load projects.' });
      }
    }
  );

  app.post(
    '/api/admin/projects',
    requireAdmin,
    requireModuleAccess('projects'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const titleEn = String(b.titleEn || '').trim();
        if (!titleEn) return res.status(400).json({ error: 'Project title is required.' });

        const id =
          String(b.id || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-') || `proj-${Date.now()}`;

        const validStatuses = ['Proposed', 'Under Assessment', 'Approved', 'Ongoing', 'Completed'];
        const saved = await upsertProject({
          id,
          titleHi: String(b.titleHi || titleEn).trim(),
          titleEn,
          locationHi: String(b.locationHi || b.district || 'राजस्थान').trim(),
          locationEn: String(b.locationEn || b.district || 'Rajasthan').trim(),
          scope: String(b.scope || 'District').trim(),
          stateName: String(b.stateName || 'Rajasthan').trim(),
          district: String(b.district || 'Bhilwara').trim(),
          subDistrict: String(b.subDistrict || '').trim(),
          villageOrTown: String(b.villageOrTown || '').trim(),
          missionCategoryHi: String(b.missionCategoryHi || 'हरित राजस्थान').trim(),
          missionCategoryEn: String(b.missionCategoryEn || 'Harit Rajasthan').trim(),
          status: validStatuses.includes(b.status) ? b.status : 'Proposed',
          objectivesHi: String(b.objectivesHi || '').trim(),
          objectivesEn: String(b.objectivesEn || '').trim(),
          beneficiaryHi: String(b.beneficiaryHi || '').trim(),
          beneficiaryEn: String(b.beneficiaryEn || '').trim(),
          noteHi: String(b.noteHi || '').trim(),
          noteEn: String(b.noteEn || '').trim(),
          startDate: String(b.startDate || '').trim(),
          progressPeriod: String(b.progressPeriod || '').trim(),
          imageUrl: String(b.imageUrl || '').trim().slice(0, 500),
          reportUrl: String(b.reportUrl || '').trim().slice(0, 500),
          partnerName: String(b.partnerName || '').trim().slice(0, 200),
          partnerConfirmedForPublic: Boolean(b.partnerConfirmedForPublic ?? false),
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_PROJECT',
          entityType: 'projects',
          entityId: saved.id,
          summary: `Saved project "${saved.titleEn}" (${saved.status})`,
        });

        res.json({ project: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save project.' });
      }
    }
  );

  app.delete(
    '/api/admin/projects/:id',
    requireAdmin,
    requireModuleAccess('team'), // Super Admin only
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = await deleteProject(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Project not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_PROJECT',
          entityType: 'projects',
          entityId: deleted.id,
          summary: `Deleted project "${deleted.titleEn}"`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete project.' });
      }
    }
  );

  app.patch(
    '/api/admin/impact-metrics/:metricKey',
    requireAdmin,
    requireModuleAccess('team'), // Super Admin strictly controls verified public impact numbers
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const metricKey = String(req.params.metricKey || '').trim();
        const verifiedValue = Math.max(0, Math.floor(Number(req.body?.verifiedValue) || 0));
        const unitLabel = String(req.body?.unitLabel ?? '').trim().slice(0, 80);
        const verificationNote = String(req.body?.verificationNote ?? '').trim().slice(0, 300);
        const isPublished = Boolean(req.body?.isPublished ?? true);

        const updated = await updateImpactMetric(metricKey, {
          verifiedValue,
          unitLabel,
          verificationNote,
          isPublished,
          updatedBy: admin.email,
        });

        if (!updated) {
          return res.status(404).json({ error: 'Impact metric not found.' });
        }

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'UPDATE_VERIFIED_IMPACT',
          entityType: 'impact_metrics',
          entityId: metricKey,
          summary: `Set verified metric "${updated.labelEn}" = ${verifiedValue} (Published=${isPublished})`,
        });

        res.json({ metric: updated });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to update impact metric.' });
      }
    }
  );

  // --- Content, Magazine, Gallery & Training ---
  app.get(
    '/api/admin/content',
    requireAdmin,
    requireModuleAccess('content'),
    async (_req, res) => {
      try {
        const items = await listContentItems();
        res.json({ items });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load content items.' });
      }
    }
  );

  app.post(
    '/api/admin/content',
    requireAdmin,
    requireModuleAccess('content'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const titleEn = String(b.titleEn || '').trim();
        if (!titleEn) return res.status(400).json({ error: 'Content title is required.' });

        const id =
          String(b.id || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-') || `cnt-${Date.now()}`;

        const allowedTypes = ['news', 'training', 'magazine', 'gallery', 'mission_update'];
        const allowedMedia = ['article', 'image', 'video', 'pdf'];
        const computedSlug = slugifyTitle(String(b.slug || titleEn)) || id;
        const saved = await upsertContentItem({
          id,
          slug: computedSlug,
          sectionType: allowedTypes.includes(b.sectionType) ? b.sectionType : 'news',
          titleHi: String(b.titleHi || titleEn).trim(),
          titleEn,
          summaryHi: String(b.summaryHi || '').trim(),
          summaryEn: String(b.summaryEn || '').trim(),
          bodyHi: String(b.bodyHi || '').trim(),
          bodyEn: String(b.bodyEn || '').trim(),
          authorName: String(b.authorName || 'GOVEDA Editorial Desk').trim().slice(0, 120),
          seoDescription: String(b.seoDescription || '').trim().slice(0, 320),
          stateName: String(b.stateName || '').trim().slice(0, 80),
          districtName: String(b.districtName || '').trim().slice(0, 80),
          subDistrict: String(b.subDistrict || '').trim().slice(0, 100),
          villageOrTown: String(b.villageOrTown || '').trim().slice(0, 100),
          mediaUrl: String(b.mediaUrl || '').trim().slice(0, 500),
          mediaType: allowedMedia.includes(b.mediaType) ? b.mediaType : 'article',
          videoUrl: String(b.videoUrl || '').trim().slice(0, 500),
          pdfUrl: String(b.pdfUrl || '').trim().slice(0, 500),
          relatedMissionSlug: String(b.relatedMissionSlug || '').trim().slice(0, 120),
          courseMeta: b.courseMeta && typeof b.courseMeta === 'object' ? b.courseMeta : null,
          categoryTag: String(b.categoryTag || 'General').trim().slice(0, 80),
          status: b.status === 'Draft' ? 'Draft' : 'Published',
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_CONTENT',
          entityType: 'content_items',
          entityId: saved.id,
          summary: `Saved ${saved.sectionType} item "${saved.titleEn}" (${saved.status})`,
        });

        res.json({ item: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save content item.' });
      }
    }
  );

  app.delete(
    '/api/admin/content/:id',
    requireAdmin,
    requireModuleAccess('content'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = await deleteContentItem(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Content item not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_CONTENT',
          entityType: 'content_items',
          entityId: deleted.id,
          summary: `Deleted content item "${deleted.titleEn}"`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete content item.' });
      }
    }
  );

  // --- Donation Reports ---
  app.get(
    '/api/admin/donations',
    requireAdmin,
    requireModuleAccess('donations'),
    async (_req, res) => {
      try {
        const reports = await listDonationReports();
        res.json({ reports });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load donation reports.' });
      }
    }
  );

  app.post(
    '/api/admin/donations',
    requireAdmin,
    requireModuleAccess('donations'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const title = String(b.title || '').trim();
        if (!title) return res.status(400).json({ error: 'Report title is required.' });

        const id =
          String(b.id || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-') || `don-${Date.now()}`;

        const saved = await upsertDonationReport({
          id,
          title,
          fiscalPeriod: String(b.fiscalPeriod || 'FY 2026–27').trim(),
          donorCategory: String(b.donorCategory || 'CSR Grant').trim(),
          amountInr: Math.max(0, Math.floor(Number(b.amountInr) || 0)),
          receiptStatus:
            b.receiptStatus === 'Verified' ? 'Verified' : 'Pending Verification',
          transparencyNote: String(b.transparencyNote || '').trim(),
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_DONATION_REPORT',
          entityType: 'donation_reports',
          entityId: saved.id,
          summary: `Saved donation report "${saved.title}" (INR ${saved.amountInr})`,
        });

        res.json({ report: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save donation report.' });
      }
    }
  );

  app.delete(
    '/api/admin/donations/:id',
    requireAdmin,
    requireModuleAccess('donations'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = await deleteDonationReport(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Donation report not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_DONATION_REPORT',
          entityType: 'donation_reports',
          entityId: deleted.id,
          summary: `Deleted donation report "${deleted.title}"`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete report.' });
      }
    }
  );

  // --- Media Upload (Photos, Videos, PDFs) ---
  app.post('/api/admin/upload', requireAdmin, async (req: AdminRequest, res) => {
    try {
      const admin = req.adminUser!;
      const fileName = String(req.body?.fileName || '').trim();
      const base64Data = String(req.body?.base64Data || '').trim();

      if (!fileName || !base64Data) {
        return res.status(400).json({ error: 'fileName and base64Data are required.' });
      }

      const check = validateUploadFileName(fileName);
      if (!check.ok || !check.mediaType) {
        return res.status(400).json({
          error: 'Unsupported file type. Allowed: JPG, JPEG, PNG, WEBP, MP4, WEBM, PDF.',
        });
      }

      const cleanBase64 = base64Data.includes(',')
        ? base64Data.slice(base64Data.indexOf(',') + 1)
        : base64Data;
      const buffer = Buffer.from(cleanBase64, 'base64');

      if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({
          error: 'File must be between 1 byte and 10 MB.',
        });
      }

      const uniqueName = `${Date.now()}-${check.safeBaseName}${check.ext}`;
      const targetPath = path.join(UPLOADS_DIR, uniqueName);
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      fs.writeFileSync(targetPath, buffer);

      const url = `/uploads/${uniqueName}`;
      await writeAuditLog({
        actorEmail: admin.email,
        actorRole: admin.role,
        action: 'UPLOAD_MEDIA',
        entityType: 'media_uploads',
        entityId: uniqueName,
        summary: `Uploaded ${check.mediaType} "${uniqueName}" (${buffer.length} bytes)`,
      });

      res.status(201).json({
        url,
        mediaType: check.mediaType,
        fileName: uniqueName,
        sizeBytes: buffer.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'File upload failed.' });
    }
  });

  // --- CSR Project Proposals ---
  app.get(
    '/api/admin/csr-proposals',
    requireAdmin,
    requireModuleAccess('donations'),
    async (_req, res) => {
      try {
        const proposals = await listCsrProposals();
        res.json({ proposals });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load CSR proposals.' });
      }
    }
  );

  app.post(
    '/api/admin/csr-proposals',
    requireAdmin,
    requireModuleAccess('donations'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const titleEn = String(b.titleEn || '').trim();
        if (!titleEn) return res.status(400).json({ error: 'Proposal title (English) is required.' });

        const id =
          String(b.id || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-') || `csr-${Date.now()}`;

        const saved = await upsertCsrProposal({
          id,
          titleHi: String(b.titleHi || titleEn).trim(),
          titleEn,
          missionPillar: String(b.missionPillar || 'Harit Rajasthan').trim(),
          targetDistricts: String(b.targetDistricts || 'Bhilwara, Churu').trim(),
          budgetLabel: String(b.budgetLabel || 'Proposal on Request').trim(),
          beneficiaryScopeHi: String(b.beneficiaryScopeHi || '').trim(),
          beneficiaryScopeEn: String(b.beneficiaryScopeEn || '').trim(),
          summaryHi: String(b.summaryHi || '').trim(),
          summaryEn: String(b.summaryEn || '').trim(),
          proposalPdfUrl: String(b.proposalPdfUrl || '').trim().slice(0, 500),
          status: ['Proposed', 'Open for CSR', 'Supported'].includes(b.status)
            ? b.status
            : 'Open for CSR',
          isPublished: Boolean(b.isPublished ?? true),
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'SAVE_CSR_PROPOSAL',
          entityType: 'csr_proposals',
          entityId: saved.id,
          summary: `Saved CSR proposal "${saved.titleEn}" (${saved.status})`,
        });

        res.json({ proposal: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save CSR proposal.' });
      }
    }
  );

  app.delete(
    '/api/admin/csr-proposals/:id',
    requireAdmin,
    requireModuleAccess('donations'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const deleted = await deleteCsrProposal(String(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'CSR proposal not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_CSR_PROPOSAL',
          entityType: 'csr_proposals',
          entityId: deleted.id,
          summary: `Deleted CSR proposal "${deleted.titleEn}"`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to delete CSR proposal.' });
      }
    }
  );

  // --- Site Governance, Magazine Title, Geo-MRV, Office/Bank/Legal Verification & Leadership ---
  app.get(
    '/api/admin/governance',
    requireAdmin,
    requireModuleAccess('governance'),
    async (_req, res) => {
      try {
        const governance = await getSiteGovernance();
        res.json({ governance });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load site governance.' });
      }
    }
  );

  app.patch(
    '/api/admin/governance',
    requireAdmin,
    requireModuleAccess('governance'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const updated = await updateSiteGovernance({
          magazineTitleHi: String(b.magazineTitleHi || 'हरित भारत संवाद (प्रस्तावित नाम)').trim(),
          magazineTitleEn: String(b.magazineTitleEn || 'Harit Bharat Samvad (Proposed Title)').trim(),
          magazineRegStatus: b.magazineRegStatus === 'Registered' ? 'Registered' : 'Proposed',
          magazineRegNumber: String(b.magazineRegNumber || '').trim().slice(0, 120),
          magazineLatestPdfUrl: String(b.magazineLatestPdfUrl || '').trim().slice(0, 500),
          geoMrvStatus: b.geoMrvStatus === 'active' ? 'active' : 'coming_soon',
          geoMrvUrl: String(b.geoMrvUrl || '').trim().slice(0, 500),
          geoMrvNoteHi: String(b.geoMrvNoteHi || '').trim(),
          geoMrvNoteEn: String(b.geoMrvNoteEn || '').trim(),
          officeConfirmedForPublic: Boolean(b.officeConfirmedForPublic ?? false),
          headOfficeAddressHi: String(b.headOfficeAddressHi || '').trim(),
          headOfficeAddressEn: String(b.headOfficeAddressEn || '').trim(),
          officialPhone: String(b.officialPhone || '').trim().slice(0, 80),
          bankConfirmedForPublic: Boolean(b.bankConfirmedForPublic ?? false),
          bankAccountSummary: String(b.bankAccountSummary || '').trim(),
          paymentGatewayEnabled: Boolean(b.paymentGatewayEnabled ?? false),
          eightyGApproved: Boolean(b.eightyGApproved ?? false),
          fcraApproved: Boolean(b.fcraApproved ?? false),
          cinNumber: String(b.cinNumber || 'U94990RJ2026NPL118002').trim().slice(0, 80),
          panNumber: String(b.panNumber || '').trim().slice(0, 80),
          darpanId: String(b.darpanId || '').trim().slice(0, 80),
          msmeNumber: String(b.msmeNumber || '').trim().slice(0, 80),
          leadershipRoster: Array.isArray(b.leadershipRoster) ? b.leadershipRoster : [],
          annualReports: Array.isArray(b.annualReports) ? b.annualReports : [],
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'UPDATE_SITE_GOVERNANCE',
          entityType: 'site_governance',
          entityId: 'default',
          summary: `Updated Governance (Mag=${updated.magazineRegStatus}, GeoMRV=${updated.geoMrvStatus}, OfficePublic=${updated.officeConfirmedForPublic}, BankPublic=${updated.bankConfirmedForPublic})`,
        });

        res.json({ governance: updated });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to update governance settings.' });
      }
    }
  );

  // --- Razorpay Payments Collection & Reconciliation Dashboard ---
  app.get(
    '/api/admin/payments/config',
    requireAdmin,
    requireModuleAccess('payments'),
    (_req, res) => {
      const cfg = getRazorpayConfig();
      res.json({
        mode: cfg.mode,
        hasKeys: cfg.hasKeys,
        webhookConfigured: Boolean(cfg.webhookSecret),
      });
    }
  );

  app.get(
    '/api/admin/payments',
    requireAdmin,
    requireModuleAccess('payments'),
    async (req: AdminRequest, res) => {
      try {
        const transactions = await listPaymentTransactions({
          status: String(req.query.status || 'all'),
          purpose: String(req.query.purpose || 'all'),
          dateFrom: String(req.query.dateFrom || ''),
          dateTo: String(req.query.dateTo || ''),
          q: String(req.query.q || ''),
        });
        const captured = transactions.filter((t) => t.status === 'CAPTURED');
        const totalCollectedInr = captured.reduce((acc, t) => acc + t.amountInr, 0);
        const pendingCount = transactions.filter((t) => t.status === 'CREATED').length;
        const failedOrRefundedCount = transactions.filter(
          (t) => t.status === 'FAILED' || t.status === 'REFUNDED'
        ).length;

        const categoryMap = new Map<string, { category: string; count: number; amountInr: number }>();
        for (const t of captured) {
          const key = t.categoryName || t.purpose;
          const prev = categoryMap.get(key) ?? { category: key, count: 0, amountInr: 0 };
          prev.count += 1;
          prev.amountInr += t.amountInr;
          categoryMap.set(key, prev);
        }

        res.json({
          transactions,
          summary: {
            totalCollectedInr,
            capturedCount: captured.length,
            pendingCount,
            failedOrRefundedCount,
            categoryBreakdown: Array.from(categoryMap.values()).sort(
              (a, b) => b.amountInr - a.amountInr
            ),
          },
          gatewayConfig: {
            mode: getRazorpayConfig().mode,
            hasKeys: getRazorpayConfig().hasKeys,
            webhookConfigured: Boolean(getRazorpayConfig().webhookSecret),
          },
        });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load payment ledger.' });
      }
    }
  );

  app.get(
    '/api/admin/payments/export.csv',
    requireAdmin,
    requireModuleAccess('payments'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const rows = await listPaymentTransactions({
          status: String(req.query.status || 'all'),
          purpose: String(req.query.purpose || 'all'),
          dateFrom: String(req.query.dateFrom || ''),
          dateTo: String(req.query.dateTo || ''),
          q: String(req.query.q || ''),
        });
        const csv = buildPaymentsCsv(rows);
        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'EXPORT_PAYMENTS_CSV',
          entityType: 'payment_transactions',
          entityId: `${rows.length} tx`,
          summary: `Exported ${rows.length} Razorpay payment rows for reconciliation`,
        });
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="goveda-payments-${new Date().toISOString().slice(0, 10)}.csv"`
        );
        res.send(csv);
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Payments CSV export failed.' });
      }
    }
  );

  // --- Team Roles & Security Audit Logs ---
  app.get(
    '/api/admin/team',
    requireAdmin,
    requireModuleAccess('team'),
    async (_req, res) => {
      try {
        const users = await listAdminUsers();
        res.json({ users });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load team.' });
      }
    }
  );

  app.post(
    '/api/admin/team',
    requireAdmin,
    requireModuleAccess('team'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const b = req.body ?? {};
        const email = String(b.email || '').trim().toLowerCase();
        const displayName = String(b.displayName || '').trim();
        const role = String(b.role || 'content_editor') as AdminRole;
        const assignedDistricts: string[] = Array.isArray(b.assignedDistricts)
          ? b.assignedDistricts.map((d: unknown) => String(d).trim()).filter(Boolean)
          : [];
        const isActive = Boolean(b.isActive ?? true);

        if (!email || !email.includes('@')) {
          return res.status(400).json({ error: 'Valid Google email address is required.' });
        }
        if (!VALID_ADMIN_ROLES.includes(role)) {
          return res.status(400).json({ error: 'Invalid admin role.' });
        }
        if (email === admin.email && (role !== 'super_admin' || !isActive)) {
          return res.status(400).json({
            error: 'You cannot demote or deactivate your own Super Admin account.',
          });
        }

        const saved = await upsertAdminUser({
          email,
          displayName: displayName || email.split('@')[0],
          role,
          assignedDistricts: role === 'district_coordinator' ? assignedDistricts : [],
          isActive,
        });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'UPSERT_ADMIN_USER',
          entityType: 'admin_users',
          entityId: saved.email,
          summary: `Assigned ${saved.email} -> role=${saved.role}, active=${saved.isActive}`,
        });

        res.json({ user: saved });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to save admin user.' });
      }
    }
  );

  app.delete(
    '/api/admin/team/:id',
    requireAdmin,
    requireModuleAccess('team'),
    async (req: AdminRequest, res) => {
      try {
        const admin = req.adminUser!;
        const id = Number(req.params.id);
        if (id === admin.id) {
          return res.status(400).json({ error: 'You cannot remove your own active Super Admin account.' });
        }
        const deleted = await deleteAdminUser(id);
        if (!deleted) return res.status(404).json({ error: 'Admin user not found.' });

        await writeAuditLog({
          actorEmail: admin.email,
          actorRole: admin.role,
          action: 'DELETE_ADMIN_USER',
          entityType: 'admin_users',
          entityId: deleted.email,
          summary: `Removed admin user ${deleted.email} (${deleted.role})`,
        });

        res.json({ deleted: true });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to remove admin user.' });
      }
    }
  );

  app.get(
    '/api/admin/audit-logs',
    requireAdmin,
    requireModuleAccess('audit'),
    async (_req, res) => {
      try {
        const logs = await listAuditLogs(120);
        res.json({ logs });
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Failed to load audit logs.' });
      }
    }
  );

  // Return JSON 404 for unknown API paths instead of falling through to SPA HTML
  app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true, mode: process.env.NODE_ENV || 'development' });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API route not found.' });
  });

  // =========================================================================
  // VITE DEV MIDDLEWARE / PRODUCTION STATIC ASSETS
  // =========================================================================
  if (process.env.NODE_ENV !== 'production') {
    // When HMR/WS is disabled in preview, serve a clean WebSocket-free Vite client shim
    // that preserves dev CSS injection (updateStyle/removeStyle) without opening port 24678.
    app.get('/@vite/client', (_req, res) => {
      res.type('application/javascript; charset=utf-8').send(`
const sheetsMap = new Map();
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  } else {
    style.textContent = content;
  }
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url, queryToInject) {
  if (url[0] !== '.' && url[0] !== '/') return url;
  const pathname = url.replace(/[?#].*$/, '');
  const { search, hash } = new URL(url, 'http://vite.dev');
  return \`\${pathname}?\${queryToInject}\${search ? '&' + search.slice(1) : ''}\${hash || ''}\`;
}
export class ErrorOverlay extends HTMLElement {}
`);
    });

    // Start Vite immediately in parallel while binding port 3000 without blocking cold starts
    const viteReadyPromise = createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: false,
        ws: false,
        watch: null,
      },
      appType: 'spa',
    });

    app.use(async (req, res, next) => {
      try {
        const vite = await viteReadyPromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GOVEDA full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
