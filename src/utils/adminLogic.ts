import type { DynamicFormFieldSpec } from '../db/schema.ts';

export type AdminRole = 'super_admin' | 'district_coordinator' | 'content_editor';

export type SubmissionStatus =
  | 'Submitted'
  | 'Under Preliminary Review'
  | 'Field Verification Pending'
  | 'Needs Follow-up'
  | 'Approved'
  | 'Rejected';

export type TimeframeKey = '1d' | '7d' | '30d' | '16m' | 'max';

export type AdminModuleKey =
  | 'overview'
  | 'submissions'
  | 'forms'
  | 'campaigns'
  | 'events'
  | 'districts'
  | 'projects'
  | 'content'
  | 'payments'
  | 'donations'
  | 'governance'
  | 'team'
  | 'audit';

export const VALID_SUBMISSION_STATUSES: SubmissionStatus[] = [
  'Submitted',
  'Under Preliminary Review',
  'Field Verification Pending',
  'Needs Follow-up',
  'Approved',
  'Rejected',
];

export const VALID_ADMIN_ROLES: AdminRole[] = [
  'super_admin',
  'district_coordinator',
  'content_editor',
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  district_coordinator: 'District Coordinator',
  content_editor: 'Content Editor',
};

const ROLE_MODULES: Record<AdminRole, AdminModuleKey[]> = {
  super_admin: [
    'overview',
    'submissions',
    'forms',
    'campaigns',
    'events',
    'districts',
    'projects',
    'content',
    'payments',
    'donations',
    'governance',
    'team',
    'audit',
  ],
  district_coordinator: ['overview', 'submissions', 'campaigns', 'events', 'districts', 'projects'],
  content_editor: ['overview', 'campaigns', 'events', 'content'],
};

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTHS_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
];

export function formatBilingualIsoDate(isoDate: string): { en: string; hi: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!m) return { en: isoDate, hi: isoDate };
  const year = m[1];
  const monthIdx = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (monthIdx < 0 || monthIdx > 11 || day < 1 || day > 31) {
    return { en: isoDate, hi: isoDate };
  }
  return {
    en: `${day} ${MONTHS_EN[monthIdx]} ${year}`,
    hi: `${day} ${MONTHS_HI[monthIdx]} ${year}`,
  };
}

export function getAllowedModulesForRole(role: AdminRole): AdminModuleKey[] {
  return ROLE_MODULES[role] ?? ['overview'];
}

export function canAccessAdminModule(role: AdminRole, moduleKey: AdminModuleKey): boolean {
  return getAllowedModulesForRole(role).includes(moduleKey);
}

export function normalizeDistrictName(name: string): string {
  return name.trim().toLowerCase();
}

export function isDistrictAllowed(
  role: AdminRole,
  assignedDistricts: string[],
  targetDistrict: string
): boolean {
  if (role === 'super_admin') return true;
  if (role !== 'district_coordinator') return false;
  if (!assignedDistricts || assignedDistricts.length === 0) return false;
  const target = normalizeDistrictName(targetDistrict);
  return assignedDistricts.some((d) => normalizeDistrictName(d) === target);
}

export function normalizeIndianMobile(mobile: string): string {
  return mobile.replace(/\D/g, '').slice(-10);
}

export function maskMobileNumber(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 4) return '******';
  return `${'*'.repeat(Math.max(4, digits.length - 4))}${digits.slice(-4)}`;
}

export interface PublicSubmissionMaskInput {
  applicationId: string;
  formType: string;
  applicantName: string;
  mobile: string;
  district: string;
  status: string;
  submittedAt: Date | string;
}

export interface MaskedPublicStatus {
  applicationId: string;
  formType: string;
  applicantName: string;
  maskedMobile: string;
  district: string;
  status: string;
  submittedAt: string;
}

export function maskSubmissionForPublicLookup(
  row: PublicSubmissionMaskInput
): MaskedPublicStatus {
  const submittedIso =
    row.submittedAt instanceof Date
      ? row.submittedAt.toISOString().slice(0, 10)
      : String(row.submittedAt).slice(0, 10);

  return {
    applicationId: row.applicationId,
    formType: row.formType,
    applicantName: row.applicantName,
    maskedMobile: maskMobileNumber(row.mobile),
    district: row.district,
    status: row.status,
    submittedAt: submittedIso,
  };
}

export interface PublicSubmissionValidationPayload {
  formType: string;
  applicantName: string;
  mobile: string;
  district: string;
  villageOrOrg: string;
  details?: string;
  customFields?: Record<string, string>;
  consentAccepted: boolean;
}

export interface FormDefinitionValidationSlice {
  id: string;
  isOpen: boolean;
  closedMessageEn: string;
  customFields: DynamicFormFieldSpec[];
}

export function validatePublicSubmissionPayload(
  payload: PublicSubmissionValidationPayload,
  formDef: FormDefinitionValidationSlice | null
): { valid: boolean; errors: Record<string, string>; cleanMobile: string } {
  const errors: Record<string, string> = {};

  if (!formDef) {
    return {
      valid: false,
      errors: { formType: 'Selected form category does not exist.' },
      cleanMobile: '',
    };
  }

  if (!formDef.isOpen) {
    return {
      valid: false,
      errors: { formClosed: formDef.closedMessageEn || 'This form is currently closed.' },
      cleanMobile: '',
    };
  }

  const name = (payload.applicantName ?? '').trim();
  if (name.length < 2 || name.length > 140) {
    errors.applicantName = 'Please enter a valid full name (2–140 characters).';
  }

  const isContactForm = formDef.id === 'contact';
  const rawContact = (payload.mobile ?? '').trim();
  const cleanMobile = normalizeIndianMobile(rawContact);

  if (isContactForm) {
    if (rawContact.length < 5 || rawContact.length > 140) {
      errors.mobile = 'Please enter a valid email address or mobile number.';
    }
  } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    errors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
  }

  if (!(payload.district ?? '').trim()) {
    errors.district = 'Please select or enter a district.';
  }

  if (!(payload.villageOrOrg ?? '').trim()) {
    errors.villageOrOrg = 'Please enter your village, gram panchayat, or organisation.';
  }

  if (!isContactForm && !payload.consentAccepted) {
    errors.consentAccepted = 'Privacy & communication consent is required before submission.';
  }

  const customValues = payload.customFields ?? {};
  for (const field of formDef.customFields ?? []) {
    if (field.required) {
      const value = String(customValues[field.key] ?? '').trim();
      if (!value) {
        errors[`custom_${field.key}`] = `${field.labelEn} is required.`;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    cleanMobile: isContactForm ? rawContact : cleanMobile,
  };
}

/**
 * Neutralizes spreadsheet formula injection (CSV Injection) where a cell starts
 * with =, +, -, @, tab, or carriage return, then applies RFC-4180 quoting.
 */
export function sanitizeCsvCell(rawValue: unknown): string {
  const str = String(rawValue ?? '').replace(/\r?\n/g, ' ');
  const formulaSafe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${formulaSafe.replace(/"/g, '""')}"`;
}

export interface CsvSubmissionRow {
  applicationId: string;
  formType: string;
  formTitle?: string;
  applicantName: string;
  mobile: string;
  district: string;
  villageOrOrg: string;
  status: string;
  details: string;
  customFields?: Record<string, string>;
  adminNotes?: string;
  submittedAt: Date | string;
}

export function buildSubmissionsCsv(rows: CsvSubmissionRow[]): string {
  const headers = [
    'Application ID',
    'Form Code',
    'Form Category',
    'Applicant Name',
    'Mobile / Contact',
    'District',
    'Village / Organisation',
    'Status',
    'Details',
    'Custom Fields',
    'Admin Review Notes',
    'Submitted At',
  ];

  const lines = rows.map((row) => {
    const customSummary = Object.entries(row.customFields ?? {})
      .filter(([, val]) => String(val ?? '').trim().length > 0)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');

    const submittedStr =
      row.submittedAt instanceof Date
        ? row.submittedAt.toISOString()
        : String(row.submittedAt);

    return [
      row.applicationId,
      row.formType,
      row.formTitle ?? row.formType,
      row.applicantName,
      row.mobile,
      row.district,
      row.villageOrOrg,
      row.status,
      row.details,
      customSummary,
      row.adminNotes ?? '',
      submittedStr,
    ]
      .map(sanitizeCsvCell)
      .join(',');
  });

  return [headers.map(sanitizeCsvCell).join(','), ...lines].join('\n');
}

export function slugifyTitle(text: string): string {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);
}

export interface CsvPaymentRow {
  orderId: string;
  paymentId: string;
  purpose: string;
  referenceId: string;
  categoryName: string;
  payerName: string;
  payerMobile: string;
  district: string;
  amountInr: number;
  status: string;
  paymentMethod: string;
  signatureVerified: boolean;
  webhookVerified: boolean;
  createdAt: Date | string;
  paidAt: Date | string | null;
}

export function buildPaymentsCsv(rows: CsvPaymentRow[]): string {
  const headers = [
    'Order ID',
    'Razorpay Payment ID',
    'Purpose',
    'Application Ref ID',
    'Category / Tier',
    'Payer Name',
    'Mobile',
    'District',
    'Amount (INR)',
    'Status',
    'Method',
    'Signature Verified',
    'Webhook Verified',
    'Created At',
    'Paid At',
  ];

  const lines = rows.map((r) => {
    const createdStr =
      r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt ?? '');
    const paidStr =
      r.paidAt instanceof Date ? r.paidAt.toISOString() : String(r.paidAt ?? '');
    return [
      r.orderId,
      r.paymentId,
      r.purpose,
      r.referenceId,
      r.categoryName,
      r.payerName,
      r.payerMobile,
      r.district,
      String(r.amountInr),
      r.status,
      r.paymentMethod,
      r.signatureVerified ? 'YES' : 'NO',
      r.webhookVerified ? 'YES' : 'NO',
      createdStr,
      paidStr,
    ]
      .map(sanitizeCsvCell)
      .join(',');
  });

  return [headers.map(sanitizeCsvCell).join(','), ...lines].join('\n');
}

export interface AnalyticsPoint {
  key: string;
  label: string;
  count: number;
  approved: number;
}

export interface AnalyticsSubmissionSlice {
  formType: string;
  status: string;
  district: string;
  submittedAt: Date | string;
}

export function buildAnalyticsSeries(
  submissions: AnalyticsSubmissionSlice[],
  timeframe: TimeframeKey,
  now: Date = new Date()
): AnalyticsPoint[] {
  const points: AnalyticsPoint[] = [];
  const buckets = new Map<string, AnalyticsPoint>();

  if (timeframe === '1d') {
    for (let i = 11; i >= 0; i--) {
      const slot = new Date(now.getTime() - i * 2 * 60 * 60 * 1000);
      const key = `${slot.getUTCFullYear()}-${slot.getUTCMonth()}-${slot.getUTCDate()}-${Math.floor(slot.getUTCHours() / 2)}`;
      const hourLabel = `${String(slot.getHours()).padStart(2, '0')}:00`;
      const point: AnalyticsPoint = { key, label: hourLabel, count: 0, approved: 0 };
      buckets.set(key, point);
      points.push(point);
    }
    for (const sub of submissions) {
      const dt = new Date(sub.submittedAt);
      if (now.getTime() - dt.getTime() > 24 * 60 * 60 * 1000) continue;
      const key = `${dt.getUTCFullYear()}-${dt.getUTCMonth()}-${dt.getUTCDate()}-${Math.floor(dt.getUTCHours() / 2)}`;
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.count += 1;
        if (sub.status === 'Approved') bucket.approved += 1;
      }
    }
    return points;
  }

  if (timeframe === '7d' || timeframe === '30d') {
    const days = timeframe === '7d' ? 7 : 14;
    const stepDays = timeframe === '7d' ? 1 : 2;
    const totalSpan = timeframe === '7d' ? 7 : 28;
    for (let i = days - 1; i >= 0; i--) {
      const slot = new Date(now.getTime() - i * stepDays * 24 * 60 * 60 * 1000);
      const key = slot.toISOString().slice(0, 10);
      const label = slot.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const point: AnalyticsPoint = { key, label, count: 0, approved: 0 };
      buckets.set(key, point);
      points.push(point);
    }
    for (const sub of submissions) {
      const dt = new Date(sub.submittedAt);
      const ageDays = Math.floor((now.getTime() - dt.getTime()) / (24 * 60 * 60 * 1000));
      if (ageDays < 0 || ageDays >= totalSpan) continue;
      const bucketIdx = Math.max(0, points.length - 1 - Math.floor(ageDays / stepDays));
      const target = points[bucketIdx];
      if (target) {
        target.count += 1;
        if (sub.status === 'Approved') target.approved += 1;
      }
    }
    return points;
  }

  // 16m or max -> monthly buckets
  const monthCount = timeframe === '16m' ? 12 : 16;
  for (let i = monthCount - 1; i >= 0; i--) {
    const slot = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${slot.getUTCFullYear()}-${String(slot.getUTCMonth() + 1).padStart(2, '0')}`;
    const label = slot.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    const point: AnalyticsPoint = { key, label, count: 0, approved: 0 };
    buckets.set(key, point);
    points.push(point);
  }

  for (const sub of submissions) {
    const dt = new Date(sub.submittedAt);
    const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count += 1;
      if (sub.status === 'Approved') bucket.approved += 1;
    }
  }

  return points;
}

export interface FormTypeBreakdownRow {
  formType: string;
  formNumber: number;
  codePrefix: string;
  titleEn: string;
  titleHi: string;
  isOpen: boolean;
  total: number;
  pending: number;
  approved: number;
}

export function buildFormTypeBreakdown(
  submissions: AnalyticsSubmissionSlice[],
  formDefs: {
    id: string;
    formNumber: number;
    codePrefix: string;
    titleEn: string;
    titleHi: string;
    isOpen: boolean;
  }[]
): FormTypeBreakdownRow[] {
  const map = new Map<string, FormTypeBreakdownRow>();
  for (const f of formDefs) {
    map.set(f.id, {
      formType: f.id,
      formNumber: f.formNumber,
      codePrefix: f.codePrefix,
      titleEn: f.titleEn,
      titleHi: f.titleHi,
      isOpen: f.isOpen,
      total: 0,
      pending: 0,
      approved: 0,
    });
  }

  for (const sub of submissions) {
    const entry = map.get(sub.formType);
    if (!entry) continue;
    entry.total += 1;
    if (sub.status === 'Approved') {
      entry.approved += 1;
    } else if (sub.status !== 'Rejected') {
      entry.pending += 1;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.formNumber - b.formNumber);
}

export const ALLOWED_UPLOAD_EXTENSIONS: Record<
  string,
  'image' | 'video' | 'pdf'
> = {
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.webp': 'image',
  '.mp4': 'video',
  '.webm': 'video',
  '.pdf': 'pdf',
};

export function validateUploadFileName(fileName: string): {
  ok: boolean;
  ext: string;
  mediaType: 'image' | 'video' | 'pdf' | null;
  safeBaseName: string;
} {
  const cleaned = String(fileName || '').trim().split(/[/\\]/).pop() || '';
  const match = /\.([a-zA-Z0-9]+)$/.exec(cleaned);
  const ext = match ? `.${match[1].toLowerCase()}` : '';
  const mediaType = ALLOWED_UPLOAD_EXTENSIONS[ext] ?? null;
  const stem = cleaned
    .slice(0, cleaned.length - ext.length)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return {
    ok: Boolean(mediaType && cleaned.length > 0),
    ext,
    mediaType,
    safeBaseName: stem || 'media',
  };
}

export function generateHaritMitraCode(district: string, submissionId: number): string {
  const distPrefix = (district || 'RAJ')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
    .padEnd(3, 'X');
  return `HM-${distPrefix}-${String(1000 + Math.max(1, submissionId)).padStart(4, '0')}`;
}

export function generateUniqueMemberId(
  formType: string,
  district: string,
  submissionId: number
): string {
  const distPrefix = (district || 'IND')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
    .padEnd(3, 'X');
  const typePrefix = (formType || 'MEM')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
    .padEnd(3, 'M');
  const year = new Date().getFullYear();
  return `GVD-${typePrefix}-${distPrefix}-${year}-${String(1000 + Math.max(1, submissionId)).padStart(4, '0')}`;
}

export function generateUniqueCampaignCode(
  locationLabel: string,
  seedNum?: number
): string {
  const locPrefix = (locationLabel || 'IND')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3)
    .padEnd(3, 'X');
  const year = new Date().getFullYear();
  const suffix =
    typeof seedNum === 'number'
      ? String(1000 + (Math.abs(Math.floor(seedNum)) % 9000)).padStart(4, '0')
      : String(Math.floor(1000 + Math.random() * 9000));
  return `GVD-CMP-${locPrefix}-${year}-${suffix}`;
}

/**
 * Parses either a YYYY-MM-DD date string or a YYYY-MM-DDTHH:mm(:ss) datetime string
 * into an inclusive start or end Date boundary.
 */
export function parseDateFilterBound(
  raw: string | undefined | null,
  bound: 'start' | 'end'
): Date | null {
  const cleaned = String(raw ?? '').trim();
  if (!cleaned) return null;

  // Date-only format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    const iso = bound === 'start' ? `${cleaned}T00:00:00.000` : `${cleaned}T23:59:59.999`;
    const dt = new Date(iso);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  // Date + hour:minute from <input type="datetime-local">: YYYY-MM-DDTHH:mm
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(cleaned)) {
    const iso = bound === 'start' ? `${cleaned}:00.000` : `${cleaned}:59.999`;
    const dt = new Date(iso);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  // Full ISO timestamp
  const dt = new Date(cleaned);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export interface SanitizableDistrict {
  outreachItems?: {
    id: string;
    roleLabel: string;
    officeName: string;
    status: string;
    confirmedForPublic: boolean;
    notes?: string;
  }[];
  [key: string]: unknown;
}

export interface SanitizableEvent {
  guests?: { id: string; name: string; designationOrTier: string; confirmedForPublic: boolean }[];
  sponsors?: { id: string; name: string; designationOrTier: string; confirmedForPublic: boolean }[];
  [key: string]: unknown;
}

export interface SanitizableProject {
  partnerName?: string;
  partnerConfirmedForPublic?: boolean;
  [key: string]: unknown;
}

export interface SanitizableSiteGovernance {
  officeConfirmedForPublic: boolean;
  headOfficeAddressHi: string;
  headOfficeAddressEn: string;
  officialPhone: string;
  bankConfirmedForPublic: boolean;
  bankAccountSummary: string;
  paymentGatewayEnabled: boolean;
  eightyGApproved: boolean;
  fcraApproved: boolean;
  leadershipRoster?: {
    id: string;
    name: string;
    category: 'Leadership' | 'Advisory';
    roleHi: string;
    roleEn: string;
    bioHi: string;
    bioEn: string;
    photoUrl: string;
    confirmedForPublic: boolean;
  }[];
  [key: string]: unknown;
}

export function sanitizePublicRecords<
  TDist extends SanitizableDistrict,
  TEvt extends SanitizableEvent,
  TProj extends SanitizableProject,
  TGov extends SanitizableSiteGovernance,
>(input: {
  districts: TDist[];
  marathonEvents: TEvt[];
  projects: TProj[];
  siteGovernance: TGov | null;
}) {
  return {
    districts: input.districts.map((d) => ({
      ...d,
      outreachItems: Array.isArray(d.outreachItems)
        ? d.outreachItems.filter((item) => item.confirmedForPublic === true)
        : [],
    })),
    marathonEvents: input.marathonEvents.map((ev) => ({
      ...ev,
      guests: Array.isArray(ev.guests)
        ? ev.guests.filter((g) => g.confirmedForPublic === true)
        : [],
      sponsors: Array.isArray(ev.sponsors)
        ? ev.sponsors.filter((s) => s.confirmedForPublic === true)
        : [],
    })),
    projects: input.projects.map((p) => ({
      ...p,
      partnerName: p.partnerConfirmedForPublic === true ? p.partnerName || '' : '',
    })),
    siteGovernance: input.siteGovernance
      ? {
          ...input.siteGovernance,
          headOfficeAddressHi:
            input.siteGovernance.officeConfirmedForPublic === true
              ? input.siteGovernance.headOfficeAddressHi
              : '',
          headOfficeAddressEn:
            input.siteGovernance.officeConfirmedForPublic === true
              ? input.siteGovernance.headOfficeAddressEn
              : '',
          officialPhone:
            input.siteGovernance.officeConfirmedForPublic === true
              ? input.siteGovernance.officialPhone
              : '',
          bankAccountSummary:
            input.siteGovernance.bankConfirmedForPublic === true
              ? input.siteGovernance.bankAccountSummary
              : '',
          paymentGatewayEnabled:
            input.siteGovernance.bankConfirmedForPublic === true &&
            input.siteGovernance.paymentGatewayEnabled === true,
          leadershipRoster: Array.isArray(input.siteGovernance.leadershipRoster)
            ? input.siteGovernance.leadershipRoster.filter((m) => m.confirmedForPublic === true)
            : [],
          annualReports: Array.isArray((input.siteGovernance as any).annualReports)
            ? (input.siteGovernance as any).annualReports.filter(
                (r: { isPublished?: boolean }) => r.isPublished === true
              )
            : [],
        }
      : null,
  };
}

