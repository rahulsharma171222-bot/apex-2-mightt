import {
  adminUsers,
  auditLogs,
  campaigns,
  contentItems,
  csrProposals,
  districts,
  donationReports,
  formDefinitions,
  formSubmissions,
  impactMetrics,
  marathonEvents,
  paymentTransactions,
  projects,
  siteGovernance,
  type AnnualReportDocSpec,
  type CampaignRoleSpec,
  type ContentCourseMetaSpec,
  type DistrictOutreachItemSpec,
  type DynamicFormFieldSpec,
  type EventGuestSponsorSpec,
  type LeadershipMemberSpec,
  type MarathonScheduleSpec,
  type RaceCategorySpec,
} from './schema.ts';
import {
  BOOTSTRAP_SUPER_ADMIN_EMAILS,
  DEFAULT_CAMPAIGNS,
  DEFAULT_CONTENT_ITEMS,
  DEFAULT_CSR_PROPOSALS,
  DEFAULT_DISTRICTS,
  DEFAULT_DONATION_REPORTS,
  DEFAULT_FORM_DEFINITIONS,
  DEFAULT_IMPACT_METRICS,
  DEFAULT_MARATHON_EVENTS,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_GOVERNANCE,
  buildInitialSeedSubmissions,
} from './seedData.ts';
import {
  parseDateFilterBound,
  sanitizePublicRecords,
  type AdminRole,
} from '../utils/adminLogic.ts';

type AdminUserRow = typeof adminUsers.$inferSelect;
type FormDefinitionRow = typeof formDefinitions.$inferSelect;
type FormSubmissionRow = typeof formSubmissions.$inferSelect;
type DistrictRow = typeof districts.$inferSelect;
type MarathonEventRow = typeof marathonEvents.$inferSelect;
type ProjectRow = typeof projects.$inferSelect;
type CampaignRow = typeof campaigns.$inferSelect;
type ImpactMetricRow = typeof impactMetrics.$inferSelect;
type ContentItemRow = typeof contentItems.$inferSelect;
type DonationReportRow = typeof donationReports.$inferSelect;
type CsrProposalRow = typeof csrProposals.$inferSelect;
type SiteGovernanceRow = typeof siteGovernance.$inferSelect;
type PaymentTransactionRow = typeof paymentTransactions.$inferSelect;
type AuditLogRow = typeof auditLogs.$inferSelect;

interface MemoryState {
  initialized: boolean;
  nextSubmissionId: number;
  nextAdminUserId: number;
  nextAuditLogId: number;
  nextPaymentId: number;
  adminUsers: AdminUserRow[];
  formDefinitions: FormDefinitionRow[];
  formSubmissions: FormSubmissionRow[];
  districts: DistrictRow[];
  marathonEvents: MarathonEventRow[];
  projects: ProjectRow[];
  campaigns: CampaignRow[];
  impactMetrics: ImpactMetricRow[];
  contentItems: ContentItemRow[];
  donationReports: DonationReportRow[];
  csrProposals: CsrProposalRow[];
  siteGovernance: SiteGovernanceRow;
  paymentTransactions: PaymentTransactionRow[];
  auditLogs: AuditLogRow[];
}

const state: MemoryState = {
  initialized: false,
  nextSubmissionId: 1,
  nextAdminUserId: 1,
  nextAuditLogId: 1,
  nextPaymentId: 1,
  adminUsers: [],
  formDefinitions: [],
  formSubmissions: [],
  districts: [],
  marathonEvents: [],
  projects: [],
  campaigns: [],
  impactMetrics: [],
  contentItems: [],
  donationReports: [],
  csrProposals: [],
  siteGovernance: {
    ...DEFAULT_SITE_GOVERNANCE,
    updatedAt: new Date(),
  },
  paymentTransactions: [],
  auditLogs: [],
};

function ensureInitialized() {
  if (state.initialized) return;
  const now = new Date();

  state.formDefinitions = DEFAULT_FORM_DEFINITIONS.map((f) => ({
    ...f,
    closedMessageHi:
      'यह पंजीकरण फॉर्म वर्तमान में अस्थायी रूप से बंद है। कृपया शीघ्र पुनः जाँच करें।',
    closedMessageEn:
      'This registration form is temporarily paused. Please check back soon.',
    updatedAt: now,
  }));

  state.districts = DEFAULT_DISTRICTS.map((d) => ({
    ...d,
    updatedAt: now,
  }));

  state.marathonEvents = DEFAULT_MARATHON_EVENTS.map((e) => ({
    ...e,
    updatedAt: now,
  }));

  state.projects = DEFAULT_PROJECTS.map((p) => ({
    ...p,
    updatedAt: now,
  }));

  state.campaigns = DEFAULT_CAMPAIGNS.map((c) => ({
    ...c,
    roles: c.roles.map((r) => ({ ...r })),
    updatedAt: now,
  }));

  state.impactMetrics = DEFAULT_IMPACT_METRICS.map((m) => ({
    ...m,
    updatedBy: null,
    updatedAt: now,
  }));

  state.contentItems = DEFAULT_CONTENT_ITEMS.map((c) => ({
    ...c,
    publishedAt: now,
    updatedAt: now,
  }));

  state.donationReports = DEFAULT_DONATION_REPORTS.map((d) => ({
    ...d,
    createdAt: now,
  }));

  state.csrProposals = DEFAULT_CSR_PROPOSALS.map((c) => ({
    ...c,
    updatedAt: now,
  }));

  state.siteGovernance = {
    ...DEFAULT_SITE_GOVERNANCE,
    leadershipRoster: [...DEFAULT_SITE_GOVERNANCE.leadershipRoster],
    annualReports: [...DEFAULT_SITE_GOVERNANCE.annualReports],
    updatedAt: now,
  };

  state.paymentTransactions = [
    {
      id: state.nextPaymentId++,
      orderId: 'order_gvd_seed_1003',
      paymentId: 'pay_gvd_seed_1003',
      purpose: 'marathon',
      referenceId: 'GVD-MRT-2026-1003',
      eventId: 'harit-marathon-bhilwara-2026',
      categoryName: '10 KM Green Run (18+ Yrs)',
      payerName: 'Devendra Singh Rathore',
      payerMobile: '9828133445',
      district: 'Bhilwara',
      amountInr: 499,
      currency: 'INR',
      status: 'CAPTURED',
      paymentMethod: 'upi',
      signatureVerified: true,
      webhookVerified: false,
      notes: 'Seeded verified registration fee (Sandbox sample)',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      paidAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  state.adminUsers = BOOTSTRAP_SUPER_ADMIN_EMAILS.map((email) => ({
    id: state.nextAdminUserId++,
    uid: null,
    email,
    displayName:
      email === 'rahulsharmarahulworld@gmail.com'
        ? 'Rahul Sharma (Founder Admin)'
        : 'GOVEDA Foundation Desk',
    role: 'super_admin',
    assignedDistricts: [],
    isActive: true,
    lastLoginAt: null,
    createdAt: now,
  }));

  state.formSubmissions = buildInitialSeedSubmissions().map((s) => {
    const cleanCustomFields: Record<string, string> = {};
    for (const [k, v] of Object.entries(s.customFields)) {
      if (typeof v === 'string') cleanCustomFields[k] = v;
    }
    return {
      id: state.nextSubmissionId++,
      applicationId: s.applicationId,
      formType: s.formType,
      applicantName: s.applicantName,
      mobile: s.mobile,
      district: s.district,
      villageOrOrg: s.villageOrOrg,
      details: s.details,
      customFields: cleanCustomFields,
      status: s.status,
      adminNotes: s.adminNotes,
      reviewedBy: s.reviewedBy ?? null,
      reviewedAt: s.reviewedBy ? now : null,
      consentAccepted: s.consentAccepted,
      submittedAt: s.submittedAt,
    };
  });

  state.initialized = true;
}

export const memoryRepo = {
  writeAuditLog(entry: {
    actorEmail: string;
    actorRole: string;
    action: string;
    entityType: string;
    entityId: string;
    summary: string;
  }) {
    ensureInitialized();
    state.auditLogs.unshift({
      id: state.nextAuditLogId++,
      ...entry,
      createdAt: new Date(),
    });
  },

  getPublicBootstrapData() {
    ensureInitialized();
    const activeDistricts = state.districts
      .filter((d) => d.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const orderedEvents = [...state.marathonEvents].sort((a, b) =>
      a.eventDate.localeCompare(b.eventDate)
    );
    const orderedProjects = [...state.projects].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    const sanitized = sanitizePublicRecords({
      districts: activeDistricts,
      marathonEvents: orderedEvents,
      projects: orderedProjects,
      siteGovernance: state.siteGovernance,
    });

    return {
      forms: [...state.formDefinitions].sort((a, b) => a.formNumber - b.formNumber),
      districts: sanitized.districts,
      marathonEvents: sanitized.marathonEvents,
      projects: sanitized.projects,
      campaigns: state.campaigns
        .filter((c) => c.isPublished)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
      impactMetrics: state.impactMetrics
        .filter((m) => m.isPublished)
        .sort((a, b) => a.displayOrder - b.displayOrder),
      contentItems: state.contentItems
        .filter((c) => c.status === 'Published')
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
      csrProposals: state.csrProposals
        .filter((c) => c.isPublished)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
      siteGovernance: sanitized.siteGovernance,
    };
  },

  getFormDefinitionById(formId: string) {
    ensureInitialized();
    return state.formDefinitions.find((f) => f.id === formId) ?? null;
  },

  findDuplicateSubmission(formType: string, cleanMobile: string) {
    ensureInitialized();
    const match = state.formSubmissions.find(
      (s) => s.formType === formType && s.mobile === cleanMobile
    );
    return match ? { applicationId: match.applicationId, mobile: match.mobile } : null;
  },

  createPublicSubmission(input: {
    formType: string;
    codePrefix: string;
    applicantName: string;
    mobile: string;
    district: string;
    villageOrOrg: string;
    details: string;
    customFields: Record<string, string>;
    consentAccepted: boolean;
  }) {
    ensureInitialized();
    const baseSeq = state.formSubmissions.length + 1001;
    const year = new Date().getFullYear();
    let applicationId = `GVD-${input.codePrefix}-${year}-${String(baseSeq).padStart(4, '0')}`;
    if (state.formSubmissions.some((s) => s.applicationId === applicationId)) {
      const randSuffix = Math.floor(10 + Math.random() * 89);
      applicationId = `GVD-${input.codePrefix}-${year}-${String(baseSeq).padStart(4, '0')}${randSuffix}`;
    }
    const row: FormSubmissionRow = {
      id: state.nextSubmissionId++,
      applicationId,
      formType: input.formType,
      applicantName: input.applicantName,
      mobile: input.mobile,
      district: input.district,
      villageOrOrg: input.villageOrOrg,
      details: input.details,
      customFields: input.customFields,
      status: 'Submitted',
      adminNotes: '',
      reviewedBy: null,
      reviewedAt: null,
      consentAccepted: input.consentAccepted,
      submittedAt: new Date(),
    };
    state.formSubmissions.unshift(row);
    return row;
  },

  findSubmissionByApplicationId(applicationId: string) {
    ensureInitialized();
    const normalized = applicationId.trim().toUpperCase();
    return (
      state.formSubmissions.find(
        (s) => s.applicationId.toUpperCase() === normalized
      ) ?? null
    );
  },

  listSubmissionsScoped(params: {
    role: AdminRole;
    assignedDistricts: string[];
    formType?: string;
    status?: string;
    district?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) {
    ensureInitialized();
    if (params.role === 'district_coordinator' && !params.assignedDistricts.length) {
      return [];
    }
    let rows = [...state.formSubmissions].sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
    if (params.role === 'district_coordinator') {
      rows = rows.filter((r) => params.assignedDistricts.includes(r.district));
    }
    if (params.formType && params.formType !== 'all') {
      rows = rows.filter((r) => r.formType === params.formType);
    }
    if (params.status && params.status !== 'all') {
      rows = rows.filter((r) => r.status === params.status);
    }
    if (params.district && params.district !== 'all') {
      rows = rows.filter((r) => r.district === params.district);
    }
    if (params.dateFrom) {
      const fromDt = parseDateFilterBound(params.dateFrom, 'start');
      if (fromDt) {
        rows = rows.filter((r) => r.submittedAt.getTime() >= fromDt.getTime());
      }
    }
    if (params.dateTo) {
      const toDt = parseDateFilterBound(params.dateTo, 'end');
      if (toDt) {
        rows = rows.filter((r) => r.submittedAt.getTime() <= toDt.getTime());
      }
    }
    const query = (params.q ?? '').trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (r) =>
        r.applicationId.toLowerCase().includes(query) ||
        r.applicantName.toLowerCase().includes(query) ||
        r.mobile.toLowerCase().includes(query) ||
        r.district.toLowerCase().includes(query) ||
        r.villageOrOrg.toLowerCase().includes(query) ||
        r.details.toLowerCase().includes(query) ||
        Object.values(r.customFields ?? {}).some((v) => String(v).toLowerCase().includes(query))
    );
  },

  getHaritMitraNetwork(params: { role: AdminRole; assignedDistricts: string[] }) {
    ensureInitialized();
    let rows = [...state.formSubmissions].sort(
      (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
    );
    if (params.role === 'district_coordinator') {
      if (!params.assignedDistricts.length) {
        return { nodes: [], unlinkedFarmers: [], allHaritMitras: [] };
      }
      rows = rows.filter((r) => params.assignedDistricts.includes(r.district));
    }
    const haritMitras = rows.filter((r) => r.formType === 'harit-mitra');
    const farmers = rows.filter((r) => r.formType === 'farmer');

    const nodes = haritMitras.map((hm) => {
      const code = (hm.customFields?.referralCode || '').trim().toUpperCase();
      const memberId = (hm.customFields?.memberUniqueId || '').trim().toUpperCase();
      const appId = hm.applicationId.toUpperCase();
      const matchesHm = (candidate: FormSubmissionRow) => {
        if (candidate.id === hm.id) return false;
        const ref = (
          candidate.customFields?.referredByHaritMitra ||
          candidate.customFields?.haritMitraCode ||
          ''
        )
          .trim()
          .toUpperCase();
        if (!ref) return false;
        return (
          (code && ref === code) ||
          (memberId && ref === memberId) ||
          ref === appId
        );
      };

      const linkedMembers = rows.filter(matchesHm);
      const linkedFarmers = linkedMembers.filter((m) => m.formType === 'farmer');
      return {
        haritMitra: hm,
        referralCode: code || hm.applicationId,
        linkedFarmers,
        linkedMembers,
      };
    });

    const linkedIds = new Set<number>();
    for (const n of nodes) {
      for (const m of n.linkedMembers) linkedIds.add(m.id);
    }
    const unlinkedFarmers = farmers.filter((f) => !linkedIds.has(f.id));
    return { nodes, unlinkedFarmers, allHaritMitras: haritMitras };
  },

  getSubmissionById(id: number) {
    ensureInitialized();
    return state.formSubmissions.find((s) => s.id === id) ?? null;
  },

  updateSubmissionReview(input: {
    id: number;
    status?: string;
    adminNotes?: string;
    customFields?: Record<string, string>;
    reviewerEmail: string;
  }) {
    ensureInitialized();
    const row = state.formSubmissions.find((s) => s.id === input.id);
    if (!row) return null;
    if (input.status !== undefined) row.status = input.status;
    if (input.adminNotes !== undefined) row.adminNotes = input.adminNotes;
    if (input.customFields !== undefined) {
      row.customFields = { ...row.customFields, ...input.customFields };
    }
    row.reviewedBy = input.reviewerEmail;
    row.reviewedAt = new Date();
    return row;
  },

  bulkUpdateSubmissionStatus(input: {
    ids: number[];
    status: string;
    reviewerEmail: string;
  }) {
    ensureInitialized();
    const idSet = new Set(input.ids);
    const updated: FormSubmissionRow[] = [];
    const now = new Date();
    for (const row of state.formSubmissions) {
      if (idSet.has(row.id)) {
        row.status = input.status;
        row.reviewedBy = input.reviewerEmail;
        row.reviewedAt = now;
        updated.push(row);
      }
    }
    return updated;
  },

  deleteSubmissionById(id: number) {
    ensureInitialized();
    const idx = state.formSubmissions.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const [deleted] = state.formSubmissions.splice(idx, 1);
    return deleted;
  },

  listAllFormDefinitions() {
    ensureInitialized();
    return [...state.formDefinitions].sort((a, b) => a.formNumber - b.formNumber);
  },

  updateFormDefinition(
    id: string,
    patch: {
      titleHi?: string;
      titleEn?: string;
      subtitleHi?: string;
      subtitleEn?: string;
      isOpen?: boolean;
      closedMessageHi?: string;
      closedMessageEn?: string;
      customFields?: DynamicFormFieldSpec[];
    }
  ) {
    ensureInitialized();
    const row = state.formDefinitions.find((f) => f.id === id);
    if (!row) return null;
    Object.assign(row, patch, { updatedAt: new Date() });
    return row;
  },

  listMarathonEvents() {
    ensureInitialized();
    return [...state.marathonEvents].sort((a, b) =>
      a.eventDate.localeCompare(b.eventDate)
    );
  },

  upsertMarathonEvent(payload: {
    id: string;
    titleHi: string;
    titleEn: string;
    themeHi: string;
    themeEn: string;
    scope: string;
    stateName: string;
    district: string;
    subDistrict: string;
    villageOrTown: string;
    eventDate: string;
    dateDisplayHi: string;
    dateDisplayEn: string;
    venueHi: string;
    venueEn: string;
    bannerUrl: string;
    routeNotesHi: string;
    routeNotesEn: string;
    rulesHi: string;
    rulesEn: string;
    safetyInfoHi: string;
    safetyInfoEn: string;
    postEventReportUrl: string;
    countdownEnabled: boolean;
    status: string;
    raceCategories: RaceCategorySpec[];
    schedule: MarathonScheduleSpec[];
    guests: EventGuestSponsorSpec[];
    sponsors: EventGuestSponsorSpec[];
    registrationOpen: boolean;
  }) {
    ensureInitialized();
    const existing = state.marathonEvents.find((e) => e.id === payload.id);
    if (existing) {
      Object.assign(existing, payload, { updatedAt: new Date() });
      return existing;
    }
    const created: MarathonEventRow = { ...payload, updatedAt: new Date() };
    state.marathonEvents.push(created);
    return created;
  },

  deleteMarathonEvent(id: string) {
    ensureInitialized();
    const idx = state.marathonEvents.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const [deleted] = state.marathonEvents.splice(idx, 1);
    return deleted;
  },

  listDistricts() {
    ensureInitialized();
    return [...state.districts].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  upsertDistrict(payload: {
    slug: string;
    stateSlug: string;
    stateNameHi: string;
    stateNameEn: string;
    nameHi: string;
    nameEn: string;
    regionTagHi: string;
    regionTagEn: string;
    focusSummaryHi: string;
    focusSummaryEn: string;
    coordinatorName: string;
    outreachNotes: string;
    progressNotesHi: string;
    progressNotesEn: string;
    mapX: number;
    mapY: number;
    subDistricts: string[];
    villages: string[];
    galleryUrls: string[];
    outreachItems: DistrictOutreachItemSpec[];
    isActive: boolean;
    displayOrder: number;
  }) {
    ensureInitialized();
    const existing = state.districts.find((d) => d.slug === payload.slug);
    if (existing) {
      Object.assign(existing, payload, { updatedAt: new Date() });
      return existing;
    }
    const created: DistrictRow = { ...payload, updatedAt: new Date() };
    state.districts.push(created);
    return created;
  },

  deleteDistrict(slug: string) {
    ensureInitialized();
    const idx = state.districts.findIndex((d) => d.slug === slug);
    if (idx === -1) return null;
    const [deleted] = state.districts.splice(idx, 1);
    return deleted;
  },

  listProjects() {
    ensureInitialized();
    return [...state.projects].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  },

  upsertProject(payload: {
    id: string;
    titleHi: string;
    titleEn: string;
    locationHi: string;
    locationEn: string;
    scope: string;
    stateName: string;
    district: string;
    subDistrict: string;
    villageOrTown: string;
    missionCategoryHi: string;
    missionCategoryEn: string;
    status: string;
    objectivesHi: string;
    objectivesEn: string;
    beneficiaryHi: string;
    beneficiaryEn: string;
    noteHi: string;
    noteEn: string;
    startDate: string;
    progressPeriod: string;
    imageUrl: string;
    reportUrl: string;
    partnerName: string;
    partnerConfirmedForPublic: boolean;
  }) {
    ensureInitialized();
    const existing = state.projects.find((p) => p.id === payload.id);
    if (existing) {
      Object.assign(existing, payload, { updatedAt: new Date() });
      return existing;
    }
    const created: ProjectRow = { ...payload, updatedAt: new Date() };
    state.projects.push(created);
    return created;
  },

  deleteProject(id: string) {
    ensureInitialized();
    const idx = state.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const [deleted] = state.projects.splice(idx, 1);
    return deleted;
  },

  listCampaigns() {
    ensureInitialized();
    return [...state.campaigns].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  },

  upsertCampaign(payload: {
    id: string;
    campaignCode: string;
    titleHi: string;
    titleEn: string;
    summaryHi: string;
    summaryEn: string;
    missionPillar: string;
    scope: string;
    stateSlug: string;
    stateName: string;
    district: string;
    subDistrict: string;
    villageOrTown: string;
    startDate: string;
    endDate: string;
    status: string;
    isPublished: boolean;
    bannerUrl: string;
    roles: CampaignRoleSpec[];
  }) {
    ensureInitialized();
    const existing = state.campaigns.find((c) => c.id === payload.id);
    if (existing) {
      Object.assign(existing, payload, {
        roles: payload.roles.map((r) => ({ ...r })),
        updatedAt: new Date(),
      });
      return existing;
    }
    const created: CampaignRow = {
      ...payload,
      roles: payload.roles.map((r) => ({ ...r })),
      updatedAt: new Date(),
    };
    state.campaigns.unshift(created);
    return created;
  },

  deleteCampaign(id: string) {
    ensureInitialized();
    const idx = state.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const [deleted] = state.campaigns.splice(idx, 1);
    return deleted;
  },

  listImpactMetrics() {
    ensureInitialized();
    return [...state.impactMetrics].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  updateImpactMetric(
    metricKey: string,
    patch: {
      verifiedValue: number;
      unitLabel: string;
      verificationNote: string;
      isPublished: boolean;
      updatedBy: string;
    }
  ) {
    ensureInitialized();
    const row = state.impactMetrics.find((m) => m.metricKey === metricKey);
    if (!row) return null;
    Object.assign(row, patch, { updatedAt: new Date() });
    return row;
  },

  listContentItems() {
    ensureInitialized();
    return [...state.contentItems].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  },

  upsertContentItem(payload: {
    id: string;
    slug: string;
    sectionType: string;
    titleHi: string;
    titleEn: string;
    summaryHi: string;
    summaryEn: string;
    bodyHi: string;
    bodyEn: string;
    authorName: string;
    seoDescription: string;
    stateName: string;
    districtName: string;
    subDistrict: string;
    villageOrTown: string;
    mediaUrl: string;
    mediaType: string;
    videoUrl: string;
    pdfUrl: string;
    relatedMissionSlug: string;
    courseMeta: ContentCourseMetaSpec | null;
    categoryTag: string;
    status: string;
  }) {
    ensureInitialized();
    const existing = state.contentItems.find((c) => c.id === payload.id);
    if (existing) {
      Object.assign(existing, payload, { updatedAt: new Date() });
      return existing;
    }
    const now = new Date();
    const created: ContentItemRow = {
      ...payload,
      publishedAt: now,
      updatedAt: now,
    };
    state.contentItems.push(created);
    return created;
  },

  deleteContentItem(id: string) {
    ensureInitialized();
    const idx = state.contentItems.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const [deleted] = state.contentItems.splice(idx, 1);
    return deleted;
  },

  listDonationReports() {
    ensureInitialized();
    return [...state.donationReports].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  upsertDonationReport(payload: {
    id: string;
    title: string;
    fiscalPeriod: string;
    donorCategory: string;
    amountInr: number;
    receiptStatus: string;
    transparencyNote: string;
  }) {
    ensureInitialized();
    const existing = state.donationReports.find((d) => d.id === payload.id);
    if (existing) {
      Object.assign(existing, payload);
      return existing;
    }
    const created: DonationReportRow = {
      ...payload,
      createdAt: new Date(),
    };
    state.donationReports.push(created);
    return created;
  },

  deleteDonationReport(id: string) {
    ensureInitialized();
    const idx = state.donationReports.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    const [deleted] = state.donationReports.splice(idx, 1);
    return deleted;
  },

  listCsrProposals() {
    ensureInitialized();
    return [...state.csrProposals].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  },

  upsertCsrProposal(payload: {
    id: string;
    titleHi: string;
    titleEn: string;
    missionPillar: string;
    targetDistricts: string;
    budgetLabel: string;
    beneficiaryScopeHi: string;
    beneficiaryScopeEn: string;
    summaryHi: string;
    summaryEn: string;
    proposalPdfUrl: string;
    status: string;
    isPublished: boolean;
  }) {
    ensureInitialized();
    const existing = state.csrProposals.find((c) => c.id === payload.id);
    if (existing) {
      Object.assign(existing, payload, { updatedAt: new Date() });
      return existing;
    }
    const created: CsrProposalRow = { ...payload, updatedAt: new Date() };
    state.csrProposals.push(created);
    return created;
  },

  deleteCsrProposal(id: string) {
    ensureInitialized();
    const idx = state.csrProposals.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const [deleted] = state.csrProposals.splice(idx, 1);
    return deleted;
  },

  getSiteGovernance() {
    ensureInitialized();
    return state.siteGovernance;
  },

  updateSiteGovernance(patch: {
    magazineTitleHi: string;
    magazineTitleEn: string;
    magazineRegStatus: string;
    magazineRegNumber: string;
    magazineLatestPdfUrl: string;
    geoMrvStatus: string;
    geoMrvUrl: string;
    geoMrvNoteHi: string;
    geoMrvNoteEn: string;
    officeConfirmedForPublic: boolean;
    headOfficeAddressHi: string;
    headOfficeAddressEn: string;
    officialPhone: string;
    bankConfirmedForPublic: boolean;
    bankAccountSummary: string;
    paymentGatewayEnabled: boolean;
    eightyGApproved: boolean;
    fcraApproved: boolean;
    cinNumber: string;
    panNumber: string;
    darpanId: string;
    msmeNumber: string;
    leadershipRoster: LeadershipMemberSpec[];
    annualReports: AnnualReportDocSpec[];
  }) {
    ensureInitialized();
    Object.assign(state.siteGovernance, patch, { updatedAt: new Date() });
    return state.siteGovernance;
  },

  listPaymentTransactions(filters?: {
    status?: string;
    purpose?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) {
    ensureInitialized();
    let rows = [...state.paymentTransactions].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    if (filters?.status && filters.status !== 'all') {
      rows = rows.filter((r) => r.status === filters.status);
    }
    if (filters?.purpose && filters.purpose !== 'all') {
      rows = rows.filter((r) => r.purpose === filters.purpose);
    }
    if (filters?.dateFrom) {
      const fromDt = parseDateFilterBound(filters.dateFrom, 'start');
      if (fromDt) rows = rows.filter((r) => r.createdAt.getTime() >= fromDt.getTime());
    }
    if (filters?.dateTo) {
      const toDt = parseDateFilterBound(filters.dateTo, 'end');
      if (toDt) rows = rows.filter((r) => r.createdAt.getTime() <= toDt.getTime());
    }
    const q = (filters?.q ?? '').trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.paymentId.toLowerCase().includes(q) ||
          r.referenceId.toLowerCase().includes(q) ||
          r.payerName.toLowerCase().includes(q) ||
          r.payerMobile.toLowerCase().includes(q) ||
          r.categoryName.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q)
      );
    }
    return rows;
  },

  createPaymentTransaction(input: {
    orderId: string;
    purpose: string;
    referenceId: string;
    eventId: string;
    categoryName: string;
    payerName: string;
    payerMobile: string;
    district: string;
    amountInr: number;
    notes?: string;
  }) {
    ensureInitialized();
    const row: PaymentTransactionRow = {
      id: state.nextPaymentId++,
      orderId: input.orderId,
      paymentId: '',
      purpose: input.purpose,
      referenceId: input.referenceId,
      eventId: input.eventId,
      categoryName: input.categoryName,
      payerName: input.payerName,
      payerMobile: input.payerMobile,
      district: input.district,
      amountInr: input.amountInr,
      currency: 'INR',
      status: 'CREATED',
      paymentMethod: '',
      signatureVerified: false,
      webhookVerified: false,
      notes: input.notes ?? '',
      createdAt: new Date(),
      paidAt: null,
    };
    state.paymentTransactions.unshift(row);
    return row;
  },

  findPaymentByOrderId(orderId: string) {
    ensureInitialized();
    return state.paymentTransactions.find((p) => p.orderId === orderId) ?? null;
  },

  markPaymentCaptured(input: {
    orderId: string;
    paymentId: string;
    paymentMethod?: string;
    signatureVerified?: boolean;
    webhookVerified?: boolean;
    notes?: string;
  }) {
    ensureInitialized();
    const row = state.paymentTransactions.find((p) => p.orderId === input.orderId);
    if (!row) return null;
    row.paymentId = input.paymentId || row.paymentId;
    row.status = 'CAPTURED';
    if (input.paymentMethod) row.paymentMethod = input.paymentMethod;
    if (input.signatureVerified) row.signatureVerified = true;
    if (input.webhookVerified) row.webhookVerified = true;
    if (input.notes) row.notes = input.notes;
    if (!row.paidAt) row.paidAt = new Date();
    // Sync linked submission if present
    if (row.referenceId) {
      const sub = state.formSubmissions.find(
        (s) => s.applicationId.toUpperCase() === row.referenceId.toUpperCase()
      );
      if (sub) {
        sub.customFields = {
          ...sub.customFields,
          paymentStatus: 'PAID',
          paymentOrderId: row.orderId,
          paymentId: row.paymentId,
          amountPaidInr: String(row.amountInr),
        };
      }
    }
    return row;
  },

  markPaymentFailedOrRefunded(input: {
    orderId: string;
    paymentId?: string;
    status: 'FAILED' | 'REFUNDED';
    webhookVerified?: boolean;
    notes?: string;
  }) {
    ensureInitialized();
    const row = state.paymentTransactions.find((p) => p.orderId === input.orderId);
    if (!row) return null;
    if (input.paymentId) row.paymentId = input.paymentId;
    row.status = input.status;
    if (input.webhookVerified) row.webhookVerified = true;
    if (input.notes) row.notes = input.notes;
    if (row.referenceId) {
      const sub = state.formSubmissions.find(
        (s) => s.applicationId.toUpperCase() === row.referenceId.toUpperCase()
      );
      if (sub) {
        sub.customFields = {
          ...sub.customFields,
          paymentStatus: input.status,
        };
      }
    }
    return row;
  },

  listAdminUsers() {
    ensureInitialized();
    return [...state.adminUsers].sort((a, b) => a.id - b.id);
  },

  upsertAdminUser(payload: {
    email: string;
    displayName: string;
    role: AdminRole;
    assignedDistricts: string[];
    isActive: boolean;
  }) {
    ensureInitialized();
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existing = state.adminUsers.find((u) => u.email === normalizedEmail);
    if (existing) {
      existing.displayName = payload.displayName.trim();
      existing.role = payload.role;
      existing.assignedDistricts = payload.assignedDistricts;
      existing.isActive = payload.isActive;
      return existing;
    }
    const created: AdminUserRow = {
      id: state.nextAdminUserId++,
      uid: null,
      email: normalizedEmail,
      displayName: payload.displayName.trim(),
      role: payload.role,
      assignedDistricts: payload.assignedDistricts,
      isActive: payload.isActive,
      lastLoginAt: null,
      createdAt: new Date(),
    };
    state.adminUsers.push(created);
    return created;
  },

  deleteAdminUser(id: number) {
    ensureInitialized();
    const idx = state.adminUsers.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const [deleted] = state.adminUsers.splice(idx, 1);
    return deleted;
  },

  listAuditLogs(limitCount = 100) {
    ensureInitialized();
    return [...state.auditLogs]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limitCount);
  },

  resolveAdminUserOnLogin(identity: { uid: string; email: string; name: string }) {
    ensureInitialized();
    let adminRecord = state.adminUsers.find((u) => u.email === identity.email);
    const now = new Date();
    if (!adminRecord && BOOTSTRAP_SUPER_ADMIN_EMAILS.includes(identity.email)) {
      adminRecord = {
        id: state.nextAdminUserId++,
        uid: identity.uid,
        email: identity.email,
        displayName: identity.name,
        role: 'super_admin',
        assignedDistricts: [],
        isActive: true,
        lastLoginAt: now,
        createdAt: now,
      };
      state.adminUsers.push(adminRecord);
      return { status: 'ok' as const, user: adminRecord };
    }
    if (!adminRecord) {
      return { status: 'not_authorized' as const };
    }
    if (!adminRecord.isActive) {
      return { status: 'deactivated' as const };
    }
    adminRecord.uid = identity.uid;
    adminRecord.displayName = adminRecord.displayName || identity.name;
    adminRecord.lastLoginAt = now;
    return { status: 'ok' as const, user: adminRecord };
  },
};

