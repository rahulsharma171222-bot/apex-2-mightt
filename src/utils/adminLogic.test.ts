import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAnalyticsSeries,
  buildFormTypeBreakdown,
  buildSubmissionsCsv,
  canAccessAdminModule,
  generateHaritMitraCode,
  generateUniqueCampaignCode,
  generateUniqueMemberId,
  isDistrictAllowed,
  maskSubmissionForPublicLookup,
  parseDateFilterBound,
  sanitizeCsvCell,
  sanitizePublicRecords,
  validatePublicSubmissionPayload,
  validateUploadFileName,
} from './adminLogic';

test('RBAC module permissions strictly enforce 3-tier access control', () => {
  assert.equal(canAccessAdminModule('super_admin', 'team'), true);
  assert.equal(canAccessAdminModule('super_admin', 'audit'), true);
  assert.equal(canAccessAdminModule('super_admin', 'forms'), true);
  assert.equal(canAccessAdminModule('super_admin', 'governance'), true);

  assert.equal(canAccessAdminModule('district_coordinator', 'submissions'), true);
  assert.equal(canAccessAdminModule('district_coordinator', 'projects'), true);
  assert.equal(canAccessAdminModule('district_coordinator', 'team'), false);
  assert.equal(canAccessAdminModule('district_coordinator', 'forms'), false);
  assert.equal(canAccessAdminModule('district_coordinator', 'donations'), false);
  assert.equal(canAccessAdminModule('district_coordinator', 'governance'), false);

  assert.equal(canAccessAdminModule('content_editor', 'content'), true);
  assert.equal(canAccessAdminModule('content_editor', 'events'), true);
  assert.equal(canAccessAdminModule('content_editor', 'submissions'), false);
  assert.equal(canAccessAdminModule('content_editor', 'team'), false);
  assert.equal(canAccessAdminModule('content_editor', 'governance'), false);
});

test('District Coordinator scoping isolates submissions by assigned district', () => {
  assert.equal(isDistrictAllowed('super_admin', [], 'Bhilwara'), true);
  assert.equal(
    isDistrictAllowed('district_coordinator', ['Bhilwara', 'Churu'], 'bhilwara'),
    true
  );
  assert.equal(
    isDistrictAllowed('district_coordinator', ['Bhilwara', 'Churu'], 'Jodhpur'),
    false
  );
  assert.equal(
    isDistrictAllowed('content_editor', ['Bhilwara'], 'Bhilwara'),
    false
  );
});

test('CSV sanitizer neutralizes formula injection and escapes quotes', () => {
  assert.equal(sanitizeCsvCell('=CMD|"/C calc"!A0'), '"\'=CMD|""/C calc""!A0"');
  assert.equal(sanitizeCsvCell('+SUM(A1:A5)'), '"\'+SUM(A1:A5)"');
  assert.equal(sanitizeCsvCell('-10+2'), '"\'-10+2"');
  assert.equal(sanitizeCsvCell('@evil'), '"\'@evil"');
  assert.equal(sanitizeCsvCell('Normal "Text"\nLine2'), '"Normal ""Text"" Line2"');

  const csv = buildSubmissionsCsv([
    {
      applicationId: 'GVD-FRM-2026-1001',
      formType: 'farmer',
      formTitle: '1. Farmer Registration Form',
      applicantName: '=HYPERLINK("http://bad")',
      mobile: '9829011223',
      district: 'Bhilwara',
      villageOrOrg: 'Mandalgarh',
      status: 'Approved',
      details: 'Boundary trees',
      customFields: { landSize: '5 Bigha' },
      adminNotes: 'Verified',
      submittedAt: '2026-11-18T10:00:00.000Z',
    },
  ]);
  assert.match(csv, /"'=HYPERLINK\(""http:\/\/bad""\)"/);
  assert.match(csv, /landSize: 5 Bigha/);
});

test('Public status lookup masks mobile numbers and strips private fields', () => {
  const masked = maskSubmissionForPublicLookup({
    applicationId: 'GVD-FRM-2026-1001',
    formType: 'farmer',
    applicantName: 'Rameshwar Jat',
    mobile: '9829011223',
    district: 'Bhilwara',
    status: 'Under Preliminary Review',
    submittedAt: '2026-11-18T12:00:00.000Z',
  });
  assert.equal(masked.maskedMobile, '******1223');
  assert.equal(masked.submittedAt, '2026-11-18');
  assert.equal('mobile' in masked, false);
  assert.equal('adminNotes' in masked, false);
});

test('Dynamic form validator enforces closed form gate and required custom fields', () => {
  const closedResult = validatePublicSubmissionPayload(
    {
      formType: 'farmer',
      applicantName: 'Rameshwar Jat',
      mobile: '9829011223',
      district: 'Bhilwara',
      villageOrOrg: 'Mandalgarh',
      consentAccepted: true,
    },
    {
      id: 'farmer',
      isOpen: false,
      closedMessageEn: 'Paused for verification.',
      customFields: [],
    }
  );
  assert.equal(closedResult.valid, false);
  assert.equal(closedResult.errors.formClosed, 'Paused for verification.');

  const missingCustom = validatePublicSubmissionPayload(
    {
      formType: 'farmer',
      applicantName: 'Rameshwar Jat',
      mobile: '+91 98290-11223',
      district: 'Bhilwara',
      villageOrOrg: 'Mandalgarh',
      consentAccepted: true,
      customFields: { landSize: '' },
    },
    {
      id: 'farmer',
      isOpen: true,
      closedMessageEn: '',
      customFields: [
        {
          key: 'landSize',
          labelHi: 'भूमि',
          labelEn: 'Total Landholding',
          type: 'text',
          required: true,
        },
      ],
    }
  );
  assert.equal(missingCustom.valid, false);
  assert.equal(missingCustom.errors.custom_landSize, 'Total Landholding is required.');
  assert.equal(missingCustom.cleanMobile, '9829011223');
});

test('Analytics series and 12-form breakdown aggregate counts accurately', () => {
  const now = new Date('2026-11-18T12:00:00.000Z');
  const subs = [
    { formType: 'farmer', status: 'Approved', district: 'Bhilwara', submittedAt: '2026-11-18T08:00:00.000Z' },
    { formType: 'farmer', status: 'Submitted', district: 'Churu', submittedAt: '2026-11-17T08:00:00.000Z' },
    { formType: 'marathon', status: 'Approved', district: 'Bhilwara', submittedAt: '2026-11-15T08:00:00.000Z' },
  ];

  const series7d = buildAnalyticsSeries(subs, '7d', now);
  assert.equal(series7d.length, 7);
  const totalInSeries = series7d.reduce((sum, p) => sum + p.count, 0);
  assert.equal(totalInSeries, 3);

  const breakdown = buildFormTypeBreakdown(subs, [
    { id: 'farmer', formNumber: 1, codePrefix: 'FRM', titleEn: 'Farmer', titleHi: 'किसान', isOpen: true },
    { id: 'marathon', formNumber: 8, codePrefix: 'MRT', titleEn: 'Marathon', titleHi: 'मैराथन', isOpen: true },
  ]);
  assert.equal(breakdown[0].total, 2);
  assert.equal(breakdown[0].approved, 1);
  assert.equal(breakdown[0].pending, 1);
  assert.equal(breakdown[1].total, 1);
  assert.equal(breakdown[1].approved, 1);
});

test('Upload validator blocks unsafe extensions and accepts approved photo/video/PDF media', () => {
  assert.equal(validateUploadFileName('../../evil.exe').ok, false);
  assert.equal(validateUploadFileName('script.js').ok, false);
  const pdf = validateUploadFileName('Q1 Report 2026.PDF');
  assert.equal(pdf.ok, true);
  assert.equal(pdf.mediaType, 'pdf');
  assert.equal(pdf.ext, '.pdf');
  const img = validateUploadFileName('/tmp/Bhilwara Photo.webp');
  assert.equal(img.ok, true);
  assert.equal(img.mediaType, 'image');
  assert.equal(generateHaritMitraCode('Bhilwara', 2), 'HM-BHI-1002');
});

test('Public bootstrap sanitizer strips all unconfirmed officials, partners, offices, banks, and leadership entries', () => {
  const safe = sanitizePublicRecords({
    districts: [
      {
        slug: 'bhilwara',
        outreachItems: [
          { id: '1', roleLabel: 'Collector', officeName: 'Secret Draft', status: 'Pending', confirmedForPublic: false },
          { id: '2', roleLabel: 'Panchayat', officeName: 'Confirmed Gram', status: 'Confirmed', confirmedForPublic: true },
        ],
      },
    ],
    marathonEvents: [
      {
        id: 'evt',
        guests: [
          { id: 'g1', name: 'Pending VIP', designationOrTier: 'Minister', confirmedForPublic: false },
          { id: 'g2', name: 'Confirmed Elder', designationOrTier: 'Environmentalist', confirmedForPublic: true },
        ],
        sponsors: [
          { id: 's1', name: 'Unconfirmed Corp', designationOrTier: 'Title', confirmedForPublic: false },
        ],
      },
    ],
    projects: [
      { id: 'p1', partnerName: 'Unconfirmed Partner', partnerConfirmedForPublic: false },
      { id: 'p2', partnerName: 'Confirmed University', partnerConfirmedForPublic: true },
    ],
    siteGovernance: {
      officeConfirmedForPublic: false,
      headOfficeAddressHi: 'Private Temp',
      headOfficeAddressEn: 'Private Temp',
      officialPhone: '+91-9999999999',
      bankConfirmedForPublic: false,
      bankAccountSummary: 'Private Acct 1234',
      paymentGatewayEnabled: true,
      eightyGApproved: false,
      fcraApproved: false,
      leadershipRoster: [
        { id: 'l1', name: 'Unconfirmed Name', category: 'Leadership', roleHi: '', roleEn: 'Chair', bioHi: '', bioEn: '', photoUrl: '', confirmedForPublic: false },
        { id: 'l2', name: 'Confirmed Name', category: 'Advisory', roleHi: '', roleEn: 'Advisor', bioHi: '', bioEn: '', photoUrl: '', confirmedForPublic: true },
      ],
    },
  });

  assert.equal(safe.districts[0].outreachItems.length, 1);
  assert.equal(safe.marathonEvents[0].guests.length, 1);
  assert.equal(safe.marathonEvents[0].sponsors.length, 0);
  assert.equal(safe.projects[0].partnerName, '');
  assert.equal(safe.projects[1].partnerName, 'Confirmed University');
  assert.equal(safe.siteGovernance?.officialPhone, '');
  assert.equal(safe.siteGovernance?.bankAccountSummary, '');
  assert.equal(safe.siteGovernance?.paymentGatewayEnabled, false);
  assert.equal(safe.siteGovernance?.leadershipRoster.length, 1);
});

test('parseDateFilterBound supports exact Date+Time and Date-only boundaries', () => {
  const startDateOnly = parseDateFilterBound('2026-11-18', 'start');
  const endDateOnly = parseDateFilterBound('2026-11-18', 'end');
  assert.equal(startDateOnly?.toISOString(), '2026-11-18T00:00:00.000Z');
  assert.equal(endDateOnly?.toISOString(), '2026-11-18T23:59:59.999Z');

  const startDateTime = parseDateFilterBound('2026-11-18T09:15', 'start');
  const endDateTime = parseDateFilterBound('2026-11-18T17:45', 'end');
  assert.ok(startDateTime && endDateTime);
  assert.ok(startDateTime.getTime() < endDateTime.getTime());
  assert.equal(startDateTime.getHours(), 9);
  assert.equal(startDateTime.getMinutes(), 15);
  assert.equal(endDateTime.getHours(), 17);
  assert.equal(endDateTime.getMinutes(), 45);
  assert.equal(endDateTime.getSeconds(), 59);
  assert.equal(parseDateFilterBound('invalid-date', 'start'), null);
});

test('Unique member/campaign ID generators and campaigns RBAC work as expected', () => {
  assert.equal(canAccessAdminModule('super_admin', 'campaigns'), true);
  assert.equal(canAccessAdminModule('district_coordinator', 'campaigns'), true);
  assert.equal(canAccessAdminModule('content_editor', 'campaigns'), true);

  const memberId = generateUniqueMemberId('farmer', 'Bhilwara', 12);
  assert.match(memberId, /^GVD-FAR-BHI-\d{4}-1012$/);

  const hmId = generateUniqueMemberId('harit_mitra', 'Churu', 5);
  assert.match(hmId, /^GVD-HAR-CHU-\d{4}-1005$/);

  const cmpId = generateUniqueCampaignCode('Ahmedabad', 42);
  assert.match(cmpId, /^GVD-CMP-AHM-\d{4}-1042$/);
});


