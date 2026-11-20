import { and, asc, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { db, isDatabaseConfigured } from './index.ts';
import { blueprintStore } from './blueprintStore.ts';
import { memoryRepo } from './memoryStore.ts';
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

let seedPromise: Promise<void> | null = null;
let seededOnce = false;
let useMemoryFallback = !isDatabaseConfigured;

function isConnectionError(error: unknown): boolean {
  const err = error as { code?: string; message?: string; cause?: { code?: string; message?: string } };
  const code = err?.code || err?.cause?.code || '';
  const msg = `${err?.message || ''} ${err?.cause?.message || ''}`.toLowerCase();
  return (
    ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNRESET', '57P01', '3D000'].includes(code) ||
    msg.includes('connect') ||
    msg.includes('connection') ||
    msg.includes('database environment variables not configured') ||
    msg.includes('not a function')
  );
}

async function withFallback<T>(dbOp: () => Promise<T>, memOp: () => T | Promise<T>): Promise<T> {
  if (useMemoryFallback) {
    return await memOp();
  }
  try {
    return await dbOp();
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('[AI Studio] PostgreSQL unavailable — falling back to in-memory store');
      useMemoryFallback = true;
      return await memOp();
    }
    throw error;
  }
}

/**
 * Lazy idempotent seed executed on first API request (never at module load time).
 */
export async function ensureSeeded(): Promise<void> {
  if (useMemoryFallback || seededOnce) return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const existingForms = await db
        .select({ id: formDefinitions.id })
        .from(formDefinitions)
        .limit(1);

      if (existingForms.length === 0) {
        for (const f of DEFAULT_FORM_DEFINITIONS) {
          await db
            .insert(formDefinitions)
            .values(f)
            .onConflictDoNothing({ target: formDefinitions.id });
        }
      }

      const existingDistricts = await db
        .select({ slug: districts.slug })
        .from(districts)
        .limit(1);
      if (existingDistricts.length === 0) {
        for (const d of DEFAULT_DISTRICTS) {
          await db
            .insert(districts)
            .values(d)
            .onConflictDoNothing({ target: districts.slug });
        }
      }

      const existingEvents = await db
        .select({ id: marathonEvents.id })
        .from(marathonEvents)
        .limit(1);
      if (existingEvents.length === 0) {
        for (const ev of DEFAULT_MARATHON_EVENTS) {
          await db
            .insert(marathonEvents)
            .values(ev)
            .onConflictDoNothing({ target: marathonEvents.id });
        }
      }

      const existingProjects = await db
        .select({ id: projects.id })
        .from(projects)
        .limit(1);
      if (existingProjects.length === 0) {
        for (const p of DEFAULT_PROJECTS) {
          await db
            .insert(projects)
            .values(p)
            .onConflictDoNothing({ target: projects.id });
        }
      }

      const existingCampaigns = await db
        .select({ id: campaigns.id })
        .from(campaigns)
        .limit(1);
      if (existingCampaigns.length === 0) {
        for (const c of DEFAULT_CAMPAIGNS) {
          await db
            .insert(campaigns)
            .values(c)
            .onConflictDoNothing({ target: campaigns.id });
        }
      }

      const existingMetrics = await db
        .select({ metricKey: impactMetrics.metricKey })
        .from(impactMetrics)
        .limit(1);
      if (existingMetrics.length === 0) {
        for (const m of DEFAULT_IMPACT_METRICS) {
          await db
            .insert(impactMetrics)
            .values(m)
            .onConflictDoNothing({ target: impactMetrics.metricKey });
        }
      }

      const existingContent = await db
        .select({ id: contentItems.id })
        .from(contentItems)
        .limit(1);
      if (existingContent.length === 0) {
        for (const c of DEFAULT_CONTENT_ITEMS) {
          await db
            .insert(contentItems)
            .values(c)
            .onConflictDoNothing({ target: contentItems.id });
        }
      }

      const existingDonations = await db
        .select({ id: donationReports.id })
        .from(donationReports)
        .limit(1);
      if (existingDonations.length === 0) {
        for (const d of DEFAULT_DONATION_REPORTS) {
          await db
            .insert(donationReports)
            .values(d)
            .onConflictDoNothing({ target: donationReports.id });
        }
      }

      const existingCsr = await db
        .select({ id: csrProposals.id })
        .from(csrProposals)
        .limit(1);
      if (existingCsr.length === 0) {
        for (const c of DEFAULT_CSR_PROPOSALS) {
          await db
            .insert(csrProposals)
            .values(c)
            .onConflictDoNothing({ target: csrProposals.id });
        }
      }

      const existingGov = await db
        .select({ id: siteGovernance.id })
        .from(siteGovernance)
        .limit(1);
      if (existingGov.length === 0) {
        await db
          .insert(siteGovernance)
          .values(DEFAULT_SITE_GOVERNANCE)
          .onConflictDoNothing({ target: siteGovernance.id });
      }

      const existingAdmins = await db
        .select({ id: adminUsers.id })
        .from(adminUsers)
        .limit(1);
      if (existingAdmins.length === 0) {
        for (const email of BOOTSTRAP_SUPER_ADMIN_EMAILS) {
          await db
            .insert(adminUsers)
            .values({
              email,
              displayName:
                email === 'rahulsharmarahulworld@gmail.com'
                  ? 'Rahul Sharma (Founder Admin)'
                  : 'GOVEDA Foundation Desk',
              role: 'super_admin',
              assignedDistricts: [],
              isActive: true,
            })
            .onConflictDoNothing({ target: adminUsers.email });
        }
      }

      const existingSubmissions = await db
        .select({ id: formSubmissions.id })
        .from(formSubmissions)
        .limit(1);
      if (existingSubmissions.length === 0) {
        for (const s of buildInitialSeedSubmissions()) {
          const cleanCustomFields: Record<string, string> = {};
          for (const [k, v] of Object.entries(s.customFields)) {
            if (typeof v === 'string') cleanCustomFields[k] = v;
          }
          await db
            .insert(formSubmissions)
            .values({
              ...s,
              customFields: cleanCustomFields,
            })
            .onConflictDoNothing({ target: formSubmissions.applicationId });
        }
      }

      seededOnce = true;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn('[AI Studio] Database seed skipped (offline) — using in-memory store');
        useMemoryFallback = true;
        seedPromise = null;
        return;
      }
      console.error('Database seed initialization error:', error);
      seedPromise = null;
      throw new Error('Database initialization failed. Please try again shortly.', {
        cause: error,
      });
    }
  })();

  return seedPromise;
}

export async function writeAuditLog(entry: {
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
}): Promise<void> {
  if (useMemoryFallback) {
    memoryRepo.writeAuditLog(entry);
    return;
  }
  try {
    await db.insert(auditLogs).values(entry);
  } catch (error) {
    if (isConnectionError(error)) {
      useMemoryFallback = true;
      memoryRepo.writeAuditLog(entry);
      return;
    }
    console.error('Failed to write audit log:', error);
  }
}

export async function getPublicBootstrapData() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.getPublicBootstrapData();
      const [
        forms,
        districtRows,
        eventRows,
        projectRows,
        campaignRows,
        metricRows,
        contentRows,
        csrRows,
        govRows,
      ] = await Promise.all([
        db.select().from(formDefinitions).orderBy(asc(formDefinitions.formNumber)),
        db
          .select()
          .from(districts)
          .where(eq(districts.isActive, true))
          .orderBy(asc(districts.displayOrder)),
        db.select().from(marathonEvents).orderBy(asc(marathonEvents.eventDate)),
        db.select().from(projects).orderBy(desc(projects.updatedAt)),
        db
          .select()
          .from(campaigns)
          .where(eq(campaigns.isPublished, true))
          .orderBy(desc(campaigns.updatedAt)),
        db
          .select()
          .from(impactMetrics)
          .where(eq(impactMetrics.isPublished, true))
          .orderBy(asc(impactMetrics.displayOrder)),
        db
          .select()
          .from(contentItems)
          .where(eq(contentItems.status, 'Published'))
          .orderBy(desc(contentItems.publishedAt)),
        db
          .select()
          .from(csrProposals)
          .where(eq(csrProposals.isPublished, true))
          .orderBy(desc(csrProposals.updatedAt)),
        db.select().from(siteGovernance).where(eq(siteGovernance.id, 'default')).limit(1),
      ]);

      const rawGov = govRows[0] ?? {
        ...DEFAULT_SITE_GOVERNANCE,
        updatedAt: new Date(),
      };

      const sanitized = sanitizePublicRecords({
        districts: districtRows,
        marathonEvents: eventRows,
        projects: projectRows,
        siteGovernance: rawGov,
      });

      await blueprintStore.hydrateFromDatabase();

      return {
        forms,
        districts: sanitized.districts,
        marathonEvents: sanitized.marathonEvents,
        projects: sanitized.projects,
        campaigns: campaignRows,
        impactMetrics: metricRows,
        contentItems: contentRows,
        csrProposals: csrRows,
        siteGovernance: sanitized.siteGovernance,
        ...blueprintStore.getPublicBlueprintPayload(),
      };
    },
    () => memoryRepo.getPublicBootstrapData()
  );
}

export async function getFormDefinitionById(formId: string) {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.getFormDefinitionById(formId);
      const rows = await db
        .select()
        .from(formDefinitions)
        .where(eq(formDefinitions.id, formId))
        .limit(1);
      return rows[0] ?? null;
    },
    () => memoryRepo.getFormDefinitionById(formId)
  );
}

export async function findDuplicateSubmission(formType: string, cleanMobile: string) {
  return withFallback(
    async () => {
      const rows = await db
        .select({
          applicationId: formSubmissions.applicationId,
          mobile: formSubmissions.mobile,
        })
        .from(formSubmissions)
        .where(
          and(eq(formSubmissions.formType, formType), eq(formSubmissions.mobile, cleanMobile))
        )
        .limit(1);
      return rows[0] ?? null;
    },
    () => memoryRepo.findDuplicateSubmission(formType, cleanMobile)
  );
}

export async function createPublicSubmission(input: {
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
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.createPublicSubmission(input);
      const countRes = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(formSubmissions);
      const baseSeq = (countRes[0]?.count ?? 0) + 1001;
      const year = new Date().getFullYear();
      const randSuffix = Math.floor(10 + Math.random() * 89);
      const applicationId = `GVD-${input.codePrefix}-${year}-${String(baseSeq).padStart(4, '0')}`;

      try {
        const inserted = await db
          .insert(formSubmissions)
          .values({
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
            consentAccepted: input.consentAccepted,
          })
          .returning();
        return inserted[0];
      } catch (err) {
        if (isConnectionError(err)) throw err;
        const fallbackId = `GVD-${input.codePrefix}-${year}-${String(baseSeq).padStart(4, '0')}${randSuffix}`;
        const inserted = await db
          .insert(formSubmissions)
          .values({
            applicationId: fallbackId,
            formType: input.formType,
            applicantName: input.applicantName,
            mobile: input.mobile,
            district: input.district,
            villageOrOrg: input.villageOrOrg,
            details: input.details,
            customFields: input.customFields,
            status: 'Submitted',
            adminNotes: '',
            consentAccepted: input.consentAccepted,
          })
          .returning();
        return inserted[0];
      }
    },
    () => memoryRepo.createPublicSubmission(input)
  );
}

export async function findSubmissionByApplicationId(applicationId: string) {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.findSubmissionByApplicationId(applicationId);
      const normalized = applicationId.trim().toUpperCase();
      const rows = await db
        .select()
        .from(formSubmissions)
        .where(sql`UPPER(${formSubmissions.applicationId}) = ${normalized}`)
        .limit(1);
      return rows[0] ?? null;
    },
    () => memoryRepo.findSubmissionByApplicationId(applicationId)
  );
}

export async function listSubmissionsScoped(params: {
  role: AdminRole;
  assignedDistricts: string[];
  formType?: string;
  status?: string;
  district?: string;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
}) {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listSubmissionsScoped(params);
      const conditions = [];

      if (params.role === 'district_coordinator') {
        if (!params.assignedDistricts.length) {
          return [];
        }
        conditions.push(inArray(formSubmissions.district, params.assignedDistricts));
      }

      if (params.formType && params.formType !== 'all') {
        conditions.push(eq(formSubmissions.formType, params.formType));
      }

      if (params.status && params.status !== 'all') {
        conditions.push(eq(formSubmissions.status, params.status));
      }

      if (params.district && params.district !== 'all') {
        conditions.push(eq(formSubmissions.district, params.district));
      }

      if (params.dateFrom) {
        const d = parseDateFilterBound(params.dateFrom, 'start');
        if (d) {
          conditions.push(gte(formSubmissions.submittedAt, d));
        }
      }

      if (params.dateTo) {
        const d = parseDateFilterBound(params.dateTo, 'end');
        if (d) {
          conditions.push(lte(formSubmissions.submittedAt, d));
        }
      }

      const rows =
        conditions.length > 0
          ? await db
              .select()
              .from(formSubmissions)
              .where(and(...conditions))
              .orderBy(desc(formSubmissions.submittedAt))
          : await db
              .select()
              .from(formSubmissions)
              .orderBy(desc(formSubmissions.submittedAt));

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
    () => memoryRepo.listSubmissionsScoped(params)
  );
}

export async function getHaritMitraNetwork(params: {
  role: AdminRole;
  assignedDistricts: string[];
}) {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.getHaritMitraNetwork(params);
      const rows = await listSubmissionsScoped({
        role: params.role,
        assignedDistricts: params.assignedDistricts,
      });
      const haritMitras = rows.filter((r) => r.formType === 'harit-mitra');
      const farmers = rows.filter((r) => r.formType === 'farmer');

      const nodes = haritMitras.map((hm) => {
        const code = (hm.customFields?.referralCode || '').trim().toUpperCase();
        const memberId = (hm.customFields?.memberUniqueId || '').trim().toUpperCase();
        const appId = hm.applicationId.toUpperCase();
        const linkedMembers = rows.filter((candidate) => {
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
        });
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
    () => memoryRepo.getHaritMitraNetwork(params)
  );
}

export async function getSubmissionById(id: number) {
  return withFallback(
    async () => {
      const rows = await db
        .select()
        .from(formSubmissions)
        .where(eq(formSubmissions.id, id))
        .limit(1);
      return rows[0] ?? null;
    },
    () => memoryRepo.getSubmissionById(id)
  );
}

export async function updateSubmissionReview(input: {
  id: number;
  status?: string;
  adminNotes?: string;
  customFields?: Record<string, string>;
  reviewerEmail: string;
}) {
  return withFallback(
    async () => {
      const existing = await getSubmissionById(input.id);
      if (!existing) return null;
      const patch: Record<string, unknown> = {
        reviewedBy: input.reviewerEmail,
        reviewedAt: new Date(),
      };
      if (input.status !== undefined) patch.status = input.status;
      if (input.adminNotes !== undefined) patch.adminNotes = input.adminNotes;
      if (input.customFields !== undefined) {
        patch.customFields = { ...existing.customFields, ...input.customFields };
      }

      const updated = await db
        .update(formSubmissions)
        .set(patch)
        .where(eq(formSubmissions.id, input.id))
        .returning();
      return updated[0] ?? null;
    },
    () => memoryRepo.updateSubmissionReview(input)
  );
}

export async function bulkUpdateSubmissionStatus(input: {
  ids: number[];
  status: string;
  reviewerEmail: string;
}) {
  return withFallback(
    async () => {
      if (input.ids.length === 0) return [];
      return await db
        .update(formSubmissions)
        .set({
          status: input.status,
          reviewedBy: input.reviewerEmail,
          reviewedAt: new Date(),
        })
        .where(inArray(formSubmissions.id, input.ids))
        .returning();
    },
    () => memoryRepo.bulkUpdateSubmissionStatus(input)
  );
}

export async function deleteSubmissionById(id: number) {
  return withFallback(
    async () => {
      const deleted = await db
        .delete(formSubmissions)
        .where(eq(formSubmissions.id, id))
        .returning();
      return deleted[0] ?? null;
    },
    () => memoryRepo.deleteSubmissionById(id)
  );
}

export async function listAllFormDefinitions() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listAllFormDefinitions();
      return await db
        .select()
        .from(formDefinitions)
        .orderBy(asc(formDefinitions.formNumber));
    },
    () => memoryRepo.listAllFormDefinitions()
  );
}

export async function updateFormDefinition(
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
  return withFallback(
    async () => {
      const updated = await db
        .update(formDefinitions)
        .set({
          ...patch,
          updatedAt: new Date(),
        })
        .where(eq(formDefinitions.id, id))
        .returning();
      return updated[0] ?? null;
    },
    () => memoryRepo.updateFormDefinition(id, patch)
  );
}

export async function listMarathonEvents() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listMarathonEvents();
      return await db.select().from(marathonEvents).orderBy(asc(marathonEvents.eventDate));
    },
    () => memoryRepo.listMarathonEvents()
  );
}

export async function upsertMarathonEvent(payload: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(marathonEvents)
        .values({ ...payload, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: marathonEvents.id,
          set: { ...payload, updatedAt: new Date() },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertMarathonEvent(payload)
  );
}

export async function deleteMarathonEvent(id: string) {
  return withFallback(
    async () => {
      const rows = await db
        .delete(marathonEvents)
        .where(eq(marathonEvents.id, id))
        .returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.deleteMarathonEvent(id)
  );
}

export async function listDistricts() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listDistricts();
      return await db.select().from(districts).orderBy(asc(districts.displayOrder));
    },
    () => memoryRepo.listDistricts()
  );
}

export async function upsertDistrict(payload: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(districts)
        .values({ ...payload, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: districts.slug,
          set: { ...payload, updatedAt: new Date() },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertDistrict(payload)
  );
}

export async function deleteDistrict(slug: string) {
  return withFallback(
    async () => {
      const rows = await db.delete(districts).where(eq(districts.slug, slug)).returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.deleteDistrict(slug)
  );
}

export async function listProjects() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listProjects();
      return await db.select().from(projects).orderBy(desc(projects.updatedAt));
    },
    () => memoryRepo.listProjects()
  );
}

export async function upsertProject(payload: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(projects)
        .values({ ...payload, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: projects.id,
          set: { ...payload, updatedAt: new Date() },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertProject(payload)
  );
}

export async function deleteProject(id: string) {
  return withFallback(
    async () => {
      const rows = await db.delete(projects).where(eq(projects.id, id)).returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.deleteProject(id)
  );
}

export async function listImpactMetrics() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listImpactMetrics();
      return await db
        .select()
        .from(impactMetrics)
        .orderBy(asc(impactMetrics.displayOrder));
    },
    () => memoryRepo.listImpactMetrics()
  );
}

export async function updateImpactMetric(
  metricKey: string,
  patch: {
    verifiedValue: number;
    unitLabel: string;
    verificationNote: string;
    isPublished: boolean;
    updatedBy: string;
  }
) {
  return withFallback(
    async () => {
      const rows = await db
        .update(impactMetrics)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(impactMetrics.metricKey, metricKey))
        .returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.updateImpactMetric(metricKey, patch)
  );
}

export async function listContentItems() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listContentItems();
      return await db
        .select()
        .from(contentItems)
        .orderBy(desc(contentItems.updatedAt));
    },
    () => memoryRepo.listContentItems()
  );
}

export async function upsertContentItem(payload: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(contentItems)
        .values({ ...payload, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: contentItems.id,
          set: { ...payload, updatedAt: new Date() },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertContentItem(payload)
  );
}

export async function deleteContentItem(id: string) {
  return withFallback(
    async () => {
      const rows = await db
        .delete(contentItems)
        .where(eq(contentItems.id, id))
        .returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.deleteContentItem(id)
  );
}

export async function listDonationReports() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listDonationReports();
      return await db
        .select()
        .from(donationReports)
        .orderBy(desc(donationReports.createdAt));
    },
    () => memoryRepo.listDonationReports()
  );
}

export async function upsertDonationReport(payload: {
  id: string;
  title: string;
  fiscalPeriod: string;
  donorCategory: string;
  amountInr: number;
  receiptStatus: string;
  transparencyNote: string;
}) {
  return withFallback(
    async () => {
      const rows = await db
        .insert(donationReports)
        .values(payload)
        .onConflictDoUpdate({
          target: donationReports.id,
          set: payload,
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertDonationReport(payload)
  );
}

export async function deleteDonationReport(id: string) {
  return withFallback(
    async () => {
      const rows = await db
        .delete(donationReports)
        .where(eq(donationReports.id, id))
        .returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.deleteDonationReport(id)
  );
}

export async function listCsrProposals() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listCsrProposals();
      return await db
        .select()
        .from(csrProposals)
        .orderBy(desc(csrProposals.updatedAt));
    },
    () => memoryRepo.listCsrProposals()
  );
}

export async function upsertCsrProposal(payload: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(csrProposals)
        .values({ ...payload, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: csrProposals.id,
          set: { ...payload, updatedAt: new Date() },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertCsrProposal(payload)
  );
}

export async function deleteCsrProposal(id: string) {
  return withFallback(
    async () => {
      const rows = await db
        .delete(csrProposals)
        .where(eq(csrProposals.id, id))
        .returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.deleteCsrProposal(id)
  );
}

export async function getSiteGovernance() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.getSiteGovernance();
      const rows = await db
        .select()
        .from(siteGovernance)
        .where(eq(siteGovernance.id, 'default'))
        .limit(1);
      return rows[0] ?? memoryRepo.getSiteGovernance();
    },
    () => memoryRepo.getSiteGovernance()
  );
}

export async function updateSiteGovernance(patch: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(siteGovernance)
        .values({ id: 'default', ...patch, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteGovernance.id,
          set: { ...patch, updatedAt: new Date() },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.updateSiteGovernance(patch)
  );
}

export async function listPaymentTransactions(filters?: {
  status?: string;
  purpose?: string;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
}) {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listPaymentTransactions(filters);
      const conditions = [];
      if (filters?.status && filters.status !== 'all') {
        conditions.push(eq(paymentTransactions.status, filters.status));
      }
      if (filters?.purpose && filters.purpose !== 'all') {
        conditions.push(eq(paymentTransactions.purpose, filters.purpose));
      }
      if (filters?.dateFrom) {
        const d = parseDateFilterBound(filters.dateFrom, 'start');
        if (d) conditions.push(gte(paymentTransactions.createdAt, d));
      }
      if (filters?.dateTo) {
        const d = parseDateFilterBound(filters.dateTo, 'end');
        if (d) conditions.push(lte(paymentTransactions.createdAt, d));
      }
      const rows =
        conditions.length > 0
          ? await db
              .select()
              .from(paymentTransactions)
              .where(and(...conditions))
              .orderBy(desc(paymentTransactions.createdAt))
          : await db
              .select()
              .from(paymentTransactions)
              .orderBy(desc(paymentTransactions.createdAt));

      const q = (filters?.q ?? '').trim().toLowerCase();
      if (!q) return rows;
      return rows.filter(
        (r) =>
          r.orderId.toLowerCase().includes(q) ||
          r.paymentId.toLowerCase().includes(q) ||
          r.referenceId.toLowerCase().includes(q) ||
          r.payerName.toLowerCase().includes(q) ||
          r.payerMobile.toLowerCase().includes(q) ||
          r.categoryName.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q)
      );
    },
    () => memoryRepo.listPaymentTransactions(filters)
  );
}

export async function createPaymentTransaction(input: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(paymentTransactions)
        .values({
          orderId: input.orderId,
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
          notes: input.notes ?? '',
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.createPaymentTransaction(input)
  );
}

export async function findPaymentByOrderId(orderId: string) {
  return withFallback(
    async () => {
      const rows = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.orderId, orderId))
        .limit(1);
      return rows[0] ?? null;
    },
    () => memoryRepo.findPaymentByOrderId(orderId)
  );
}

export async function markPaymentCaptured(input: {
  orderId: string;
  paymentId: string;
  paymentMethod?: string;
  signatureVerified?: boolean;
  webhookVerified?: boolean;
  notes?: string;
}) {
  return withFallback(
    async () => {
      const existing = await findPaymentByOrderId(input.orderId);
      if (!existing) return null;
      const updated = await db
        .update(paymentTransactions)
        .set({
          paymentId: input.paymentId || existing.paymentId,
          status: 'CAPTURED',
          paymentMethod: input.paymentMethod || existing.paymentMethod,
          signatureVerified: Boolean(input.signatureVerified || existing.signatureVerified),
          webhookVerified: Boolean(input.webhookVerified || existing.webhookVerified),
          notes: input.notes || existing.notes,
          paidAt: existing.paidAt ?? new Date(),
        })
        .where(eq(paymentTransactions.orderId, input.orderId))
        .returning();
      const row = updated[0] ?? null;
      if (row && row.referenceId) {
        const sub = await findSubmissionByApplicationId(row.referenceId);
        if (sub) {
          await updateSubmissionReview({
            id: sub.id,
            customFields: {
              paymentStatus: 'PAID',
              paymentOrderId: row.orderId,
              paymentId: row.paymentId,
              amountPaidInr: String(row.amountInr),
            },
            reviewerEmail: 'razorpay-payment-verifier',
          });
        }
      }
      return row;
    },
    () => memoryRepo.markPaymentCaptured(input)
  );
}

export async function markPaymentFailedOrRefunded(input: {
  orderId: string;
  paymentId?: string;
  status: 'FAILED' | 'REFUNDED';
  webhookVerified?: boolean;
  notes?: string;
}) {
  return withFallback(
    async () => {
      const existing = await findPaymentByOrderId(input.orderId);
      if (!existing) return null;
      const updated = await db
        .update(paymentTransactions)
        .set({
          paymentId: input.paymentId || existing.paymentId,
          status: input.status,
          webhookVerified: Boolean(input.webhookVerified || existing.webhookVerified),
          notes: input.notes || existing.notes,
        })
        .where(eq(paymentTransactions.orderId, input.orderId))
        .returning();
      return updated[0] ?? null;
    },
    () => memoryRepo.markPaymentFailedOrRefunded(input)
  );
}

export async function listAdminUsers() {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listAdminUsers();
      return await db.select().from(adminUsers).orderBy(asc(adminUsers.id));
    },
    () => memoryRepo.listAdminUsers()
  );
}

export async function upsertAdminUser(payload: {
  email: string;
  displayName: string;
  role: AdminRole;
  assignedDistricts: string[];
  isActive: boolean;
}) {
  return withFallback(
    async () => {
      const normalizedEmail = payload.email.trim().toLowerCase();
      const rows = await db
        .insert(adminUsers)
        .values({
          email: normalizedEmail,
          displayName: payload.displayName.trim(),
          role: payload.role,
          assignedDistricts: payload.assignedDistricts,
          isActive: payload.isActive,
        })
        .onConflictDoUpdate({
          target: adminUsers.email,
          set: {
            displayName: payload.displayName.trim(),
            role: payload.role,
            assignedDistricts: payload.assignedDistricts,
            isActive: payload.isActive,
          },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertAdminUser(payload)
  );
}

export async function deleteAdminUser(id: number) {
  return withFallback(
    async () => {
      const rows = await db.delete(adminUsers).where(eq(adminUsers.id, id)).returning();
      return rows[0] ?? null;
    },
    () => memoryRepo.deleteAdminUser(id)
  );
}

export async function listAuditLogs(limitCount = 100) {
  return withFallback(
    async () => {
      await ensureSeeded();
      if (useMemoryFallback) return memoryRepo.listAuditLogs(limitCount);
      return await db
        .select()
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limitCount);
    },
    () => memoryRepo.listAuditLogs(limitCount)
  );
}

export async function resolveAdminUserOnLogin(identity: {
  uid: string;
  email: string;
  name: string;
}) {
  return withFallback(
    async () => {
      const existingRows = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, identity.email))
        .limit(1);

      let adminRecord = existingRows[0];

      if (!adminRecord && BOOTSTRAP_SUPER_ADMIN_EMAILS.includes(identity.email)) {
        const inserted = await db
          .insert(adminUsers)
          .values({
            uid: identity.uid,
            email: identity.email,
            displayName: identity.name,
            role: 'super_admin',
            assignedDistricts: [],
            isActive: true,
            lastLoginAt: new Date(),
          })
          .onConflictDoUpdate({
            target: adminUsers.email,
            set: {
              uid: identity.uid,
              displayName: identity.name,
              lastLoginAt: new Date(),
            },
          })
          .returning();
        adminRecord = inserted[0];
      } else if (adminRecord) {
        if (!adminRecord.isActive) {
          return { status: 'deactivated' as const };
        }
        const updated = await db
          .update(adminUsers)
          .set({
            uid: identity.uid,
            displayName: adminRecord.displayName || identity.name,
            lastLoginAt: new Date(),
          })
          .where(eq(adminUsers.id, adminRecord.id))
          .returning();
        adminRecord = updated[0] ?? adminRecord;
      }

      if (!adminRecord) {
        return { status: 'not_authorized' as const };
      }

      return { status: 'ok' as const, user: adminRecord };
    },
    () => memoryRepo.resolveAdminUserOnLogin(identity)
  );
}

export async function listCampaigns() {
  return withFallback(
    async () => {
      await ensureSeeded();
      return await db.select().from(campaigns).orderBy(desc(campaigns.updatedAt));
    },
    () => memoryRepo.listCampaigns()
  );
}

export async function upsertCampaign(payload: {
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
  return withFallback(
    async () => {
      const rows = await db
        .insert(campaigns)
        .values({ ...payload, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: campaigns.id,
          set: { ...payload, updatedAt: new Date() },
        })
        .returning();
      return rows[0];
    },
    () => memoryRepo.upsertCampaign(payload)
  );
}

export async function deleteCampaign(id: string) {
  return withFallback(
    async () => {
      const deleted = await db
        .delete(campaigns)
        .where(eq(campaigns.id, id))
        .returning();
      return deleted[0] ?? null;
    },
    () => memoryRepo.deleteCampaign(id)
  );
}
