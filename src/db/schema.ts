import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';

export interface FormFieldOptionSpec {
  value: string;
  labelHi: string;
  labelEn: string;
}

export interface DynamicFormFieldSpec {
  key: string;
  labelHi: string;
  labelEn: string;
  type: 'text' | 'select' | 'textarea' | 'number' | 'date' | 'email' | 'checkbox';
  required?: boolean;
  placeholderHi?: string;
  placeholderEn?: string;
  options?: FormFieldOptionSpec[];
}

export interface RaceCategorySpec {
  name: string;
  age: string;
  fee: string;
  feeInr?: number;
}

export interface MarathonScheduleSpec {
  time: string;
  activityHi: string;
  activityEn: string;
}

export interface DistrictOutreachItemSpec {
  id: string;
  roleLabel: string;
  officeName: string;
  status: 'Pending' | 'Invited' | 'Confirmed';
  confirmedForPublic: boolean;
  notes?: string;
}

export interface EventGuestSponsorSpec {
  id: string;
  name: string;
  designationOrTier: string;
  confirmedForPublic: boolean;
}

export interface ContentCourseMetaSpec {
  eligibilityHi: string;
  eligibilityEn: string;
  durationHi: string;
  durationEn: string;
  modeHi: string;
  modeEn: string;
  trainerName: string;
  feeStatusHi: string;
  feeStatusEn: string;
  applyRoute?: string;
}

export interface LeadershipMemberSpec {
  id: string;
  name: string;
  category:
    | 'Leadership'
    | 'Advisory'
    | 'Board of Directors'
    | 'Founder & President'
    | 'Office Bearers'
    | 'Advisory Board'
    | 'Executive Team'
    | 'District Coordinators'
    | 'Volunteers / Experts'
    | string;
  advisoryDomain?: string;
  roleHi: string;
  roleEn: string;
  qualification?: string;
  experience?: string;
  expertise?: string;
  responsibilitiesEn?: string;
  responsibilitiesHi?: string;
  founderMessageEn?: string;
  founderMessageHi?: string;
  assignedDistrict?: string;
  bioHi: string;
  bioEn: string;
  photoUrl: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  publicationStatus?: 'Draft' | 'Review' | 'Published';
  consentConfirmed?: boolean;
  confirmedForPublic: boolean;
}

export interface AnnualReportDocSpec {
  id: string;
  titleEn: string;
  titleHi: string;
  docCategory:
    | 'Annual Report'
    | 'Financial Transparency'
    | 'Statutory Certificate'
    | 'Project Progress'
    | 'CSR Report'
    | 'Environmental Impact'
    | 'Audit & Compliance'
    | 'Governance Policy';
  fiscalYear: string;
  pdfUrl: string;
  publishedDate: string;
  isPublished: boolean;
}

export interface CampaignRoleSpec {
  id: string;
  roleCode: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  formType: string;
  maxSlots: number;
  isOpen: boolean;
}

export const adminUsers = pgTable(
  'admin_users',
  {
    id: serial('id').primaryKey(),
    uid: text('uid').unique(),
    email: text('email').notNull().unique(),
    displayName: text('display_name').notNull(),
    role: text('role').notNull().default('content_editor'), // 'super_admin' | 'district_coordinator' | 'content_editor'
    assignedDistricts: jsonb('assigned_districts').$type<string[]>().notNull().default([]),
    isActive: boolean('is_active').notNull().default(true),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('admin_users_email_idx').on(table.email)]
);

export const formDefinitions = pgTable('form_definitions', {
  id: text('id').primaryKey(), // 'farmer' | 'harit-mitra' | ... | 'membership' | 'contact'
  formNumber: integer('form_number').notNull(),
  codePrefix: text('code_prefix').notNull(),
  iconName: text('icon_name').notNull().default('Sprout'),
  titleHi: text('title_hi').notNull(),
  titleEn: text('title_en').notNull(),
  subtitleHi: text('subtitle_hi').notNull(),
  subtitleEn: text('subtitle_en').notNull(),
  orgLabelHi: text('org_label_hi').notNull(),
  orgLabelEn: text('org_label_en').notNull(),
  orgPlaceholderHi: text('org_placeholder_hi').notNull(),
  orgPlaceholderEn: text('org_placeholder_en').notNull(),
  detailsLabelHi: text('details_label_hi').notNull(),
  detailsLabelEn: text('details_label_en').notNull(),
  detailsPlaceholderHi: text('details_placeholder_hi').notNull(),
  detailsPlaceholderEn: text('details_placeholder_en').notNull(),
  isOpen: boolean('is_open').notNull().default(true),
  closedMessageHi: text('closed_message_hi')
    .notNull()
    .default('यह पंजीकरण फॉर्म वर्तमान में अस्थायी रूप से बंद है। कृपया शीघ्र पुनः जाँच करें।'),
  closedMessageEn: text('closed_message_en')
    .notNull()
    .default('This registration form is temporarily paused. Please check back soon.'),
  customFields: jsonb('custom_fields').$type<DynamicFormFieldSpec[]>().notNull().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const formSubmissions = pgTable(
  'form_submissions',
  {
    id: serial('id').primaryKey(),
    applicationId: text('application_id').notNull().unique(),
    formType: text('form_type')
      .notNull()
      .references(() => formDefinitions.id),
    applicantName: text('applicant_name').notNull(),
    mobile: text('mobile').notNull(),
    district: text('district').notNull(),
    villageOrOrg: text('village_or_org').notNull(),
    details: text('details').notNull(),
    customFields: jsonb('custom_fields').$type<Record<string, string>>().notNull().default({}),
    status: text('status').notNull().default('Submitted'), // 'Submitted' | 'Under Preliminary Review' | 'Field Verification Pending' | 'Approved' | 'Rejected'
    adminNotes: text('admin_notes').notNull().default(''),
    reviewedBy: text('reviewed_by'),
    reviewedAt: timestamp('reviewed_at'),
    consentAccepted: boolean('consent_accepted').notNull().default(true),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },
  (table) => [
    index('form_submissions_form_type_idx').on(table.formType),
    index('form_submissions_district_idx').on(table.district),
    index('form_submissions_status_idx').on(table.status),
    index('form_submissions_submitted_at_idx').on(table.submittedAt),
  ]
);

export const districts = pgTable('districts', {
  slug: text('slug').primaryKey(),
  stateSlug: text('state_slug').notNull().default('rajasthan'),
  stateNameHi: text('state_name_hi').notNull().default('राजस्थान'),
  stateNameEn: text('state_name_en').notNull().default('Rajasthan'),
  nameHi: text('name_hi').notNull(),
  nameEn: text('name_en').notNull(),
  regionTagHi: text('region_tag_hi').notNull(),
  regionTagEn: text('region_tag_en').notNull(),
  focusSummaryHi: text('focus_summary_hi').notNull(),
  focusSummaryEn: text('focus_summary_en').notNull(),
  coordinatorName: text('coordinator_name').notNull().default('District Desk (Pending)'),
  outreachNotes: text('outreach_notes').notNull().default(''),
  progressNotesHi: text('progress_notes_hi').notNull().default(''),
  progressNotesEn: text('progress_notes_en').notNull().default(''),
  mapX: integer('map_x').notNull().default(50),
  mapY: integer('map_y').notNull().default(50),
  subDistricts: jsonb('sub_districts').$type<string[]>().notNull().default([]),
  villages: jsonb('villages').$type<string[]>().notNull().default([]),
  galleryUrls: jsonb('gallery_urls').$type<string[]>().notNull().default([]),
  outreachItems: jsonb('outreach_items').$type<DistrictOutreachItemSpec[]>().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(1),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const marathonEvents = pgTable('marathon_events', {
  id: text('id').primaryKey(),
  titleHi: text('title_hi').notNull(),
  titleEn: text('title_en').notNull(),
  themeHi: text('theme_hi').notNull().default(''),
  themeEn: text('theme_en').notNull().default(''),
  scope: text('scope').notNull().default('District'), // 'National' | 'Statewide' | 'District' | 'Local'
  stateName: text('state_name').notNull().default('Rajasthan'),
  district: text('district').notNull(),
  subDistrict: text('sub_district').notNull().default(''),
  villageOrTown: text('village_or_town').notNull().default(''),
  eventDate: text('event_date').notNull(), // YYYY-MM-DD
  dateDisplayHi: text('date_display_hi').notNull(),
  dateDisplayEn: text('date_display_en').notNull(),
  venueHi: text('venue_hi').notNull(),
  venueEn: text('venue_en').notNull(),
  bannerUrl: text('banner_url').notNull().default(''),
  routeNotesHi: text('route_notes_hi').notNull().default(''),
  routeNotesEn: text('route_notes_en').notNull().default(''),
  rulesHi: text('rules_hi').notNull().default(''),
  rulesEn: text('rules_en').notNull().default(''),
  safetyInfoHi: text('safety_info_hi').notNull().default(''),
  safetyInfoEn: text('safety_info_en').notNull().default(''),
  postEventReportUrl: text('post_event_report_url').notNull().default(''),
  countdownEnabled: boolean('countdown_enabled').notNull().default(true),
  status: text('status').notNull().default('Proposed'), // 'Proposed' | 'Confirmed' | 'Completed'
  raceCategories: jsonb('race_categories').$type<RaceCategorySpec[]>().notNull().default([]),
  schedule: jsonb('schedule').$type<MarathonScheduleSpec[]>().notNull().default([]),
  guests: jsonb('guests').$type<EventGuestSponsorSpec[]>().notNull().default([]),
  sponsors: jsonb('sponsors').$type<EventGuestSponsorSpec[]>().notNull().default([]),
  registrationOpen: boolean('registration_open').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  titleHi: text('title_hi').notNull(),
  titleEn: text('title_en').notNull(),
  locationHi: text('location_hi').notNull(),
  locationEn: text('location_en').notNull(),
  scope: text('scope').notNull().default('District'),
  stateName: text('state_name').notNull().default('Rajasthan'),
  district: text('district').notNull(),
  subDistrict: text('sub_district').notNull().default(''),
  villageOrTown: text('village_or_town').notNull().default(''),
  missionCategoryHi: text('mission_category_hi').notNull(),
  missionCategoryEn: text('mission_category_en').notNull(),
  status: text('status').notNull().default('Proposed'), // 'Proposed' | 'Under Assessment' | 'Approved' | 'Ongoing' | 'Completed'
  objectivesHi: text('objectives_hi').notNull(),
  objectivesEn: text('objectives_en').notNull(),
  beneficiaryHi: text('beneficiary_hi').notNull(),
  beneficiaryEn: text('beneficiary_en').notNull(),
  noteHi: text('note_hi').notNull(),
  noteEn: text('note_en').notNull(),
  startDate: text('start_date').notNull().default(''),
  progressPeriod: text('progress_period').notNull().default(''),
  imageUrl: text('image_url').notNull().default(''),
  reportUrl: text('report_url').notNull().default(''),
  partnerName: text('partner_name').notNull().default(''),
  partnerConfirmedForPublic: boolean('partner_confirmed_for_public').notNull().default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  campaignCode: text('campaign_code').notNull().unique(),
  titleHi: text('title_hi').notNull(),
  titleEn: text('title_en').notNull(),
  summaryHi: text('summary_hi').notNull().default(''),
  summaryEn: text('summary_en').notNull().default(''),
  missionPillar: text('mission_pillar').notNull().default('Harit Rajasthan'),
  scope: text('scope').notNull().default('District'), // 'National' | 'Statewide' | 'District' | 'Local'
  stateSlug: text('state_slug').notNull().default('rajasthan'),
  stateName: text('state_name').notNull().default('Rajasthan'),
  district: text('district').notNull().default('Bhilwara'),
  subDistrict: text('sub_district').notNull().default(''),
  villageOrTown: text('village_or_town').notNull().default(''),
  startDate: text('start_date').notNull().default(''),
  endDate: text('end_date').notNull().default(''),
  status: text('status').notNull().default('Active'), // 'Planned' | 'Active' | 'Completed'
  isPublished: boolean('is_published').notNull().default(true),
  bannerUrl: text('banner_url').notNull().default(''),
  roles: jsonb('roles').$type<CampaignRoleSpec[]>().notNull().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const impactMetrics = pgTable('impact_metrics', {
  metricKey: text('metric_key').primaryKey(),
  labelHi: text('label_hi').notNull(),
  labelEn: text('label_en').notNull(),
  verifiedValue: integer('verified_value').notNull().default(0),
  unitLabel: text('unit_label').notNull().default(''),
  verificationNote: text('verification_note').notNull().default('Verified institutional count'),
  isPublished: boolean('is_published').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(1),
  updatedBy: text('updated_by'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contentItems = pgTable(
  'content_items',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().default(''),
    sectionType: text('section_type').notNull(), // 'news' | 'training' | 'magazine' | 'gallery' | 'mission_update'
    titleHi: text('title_hi').notNull(),
    titleEn: text('title_en').notNull(),
    summaryHi: text('summary_hi').notNull(),
    summaryEn: text('summary_en').notNull(),
    bodyHi: text('body_hi').notNull().default(''),
    bodyEn: text('body_en').notNull().default(''),
    authorName: text('author_name').notNull().default('GOVEDA Editorial Desk'),
    seoDescription: text('seo_description').notNull().default(''),
    stateName: text('state_name').notNull().default(''),
    districtName: text('district_name').notNull().default(''),
    subDistrict: text('sub_district').notNull().default(''),
    villageOrTown: text('village_or_town').notNull().default(''),
    mediaUrl: text('media_url').notNull().default(''),
    mediaType: text('media_type').notNull().default('article'), // 'article' | 'image' | 'video' | 'pdf'
    videoUrl: text('video_url').notNull().default(''),
    pdfUrl: text('pdf_url').notNull().default(''),
    relatedMissionSlug: text('related_mission_slug').notNull().default(''),
    courseMeta: jsonb('course_meta').$type<ContentCourseMetaSpec | null>().default(null),
    categoryTag: text('category_tag').notNull().default('General'),
    status: text('status').notNull().default('Published'), // 'Draft' | 'Published'
    publishedAt: timestamp('published_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('content_items_section_type_idx').on(table.sectionType)]
);

export const donationReports = pgTable('donation_reports', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  fiscalPeriod: text('fiscal_period').notNull(),
  donorCategory: text('donor_category').notNull(),
  amountInr: integer('amount_inr').notNull().default(0),
  receiptStatus: text('receipt_status').notNull().default('Pending Verification'), // 'Pending Verification' | 'Verified'
  transparencyNote: text('transparency_note').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const csrProposals = pgTable('csr_proposals', {
  id: text('id').primaryKey(),
  titleHi: text('title_hi').notNull(),
  titleEn: text('title_en').notNull(),
  missionPillar: text('mission_pillar').notNull().default('Harit Rajasthan'),
  targetDistricts: text('target_districts').notNull().default('Bhilwara, Churu'),
  budgetLabel: text('budget_label').notNull().default('Available on Institutional Discussion'),
  beneficiaryScopeHi: text('beneficiary_scope_hi').notNull().default(''),
  beneficiaryScopeEn: text('beneficiary_scope_en').notNull().default(''),
  summaryHi: text('summary_hi').notNull().default(''),
  summaryEn: text('summary_en').notNull().default(''),
  proposalPdfUrl: text('proposal_pdf_url').notNull().default(''),
  status: text('status').notNull().default('Open for CSR'), // 'Proposed' | 'Open for CSR' | 'Supported'
  isPublished: boolean('is_published').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const siteGovernance = pgTable('site_governance', {
  id: text('id').primaryKey(),
  magazineTitleHi: text('magazine_title_hi')
    .notNull()
    .default('हरित भारत संवाद (प्रस्तावित नाम)'),
  magazineTitleEn: text('magazine_title_en')
    .notNull()
    .default('Harit Bharat Samvad (Proposed Title)'),
  magazineRegStatus: text('magazine_reg_status').notNull().default('Proposed'), // 'Proposed' | 'Registered'
  magazineRegNumber: text('magazine_reg_number').notNull().default(''),
  magazineLatestPdfUrl: text('magazine_latest_pdf_url').notNull().default(''),
  geoMrvStatus: text('geo_mrv_status').notNull().default('coming_soon'), // 'coming_soon' | 'active'
  geoMrvUrl: text('geo_mrv_url').notNull().default(''),
  geoMrvNoteHi: text('geo_mrv_note_hi').notNull().default(''),
  geoMrvNoteEn: text('geo_mrv_note_en').notNull().default(''),
  officeConfirmedForPublic: boolean('office_confirmed_for_public').notNull().default(false),
  headOfficeAddressHi: text('head_office_address_hi').notNull().default(''),
  headOfficeAddressEn: text('head_office_address_en').notNull().default(''),
  officialPhone: text('official_phone').notNull().default(''),
  bankConfirmedForPublic: boolean('bank_confirmed_for_public').notNull().default(false),
  bankAccountSummary: text('bank_account_summary').notNull().default(''),
  paymentGatewayEnabled: boolean('payment_gateway_enabled').notNull().default(false),
  eightyGApproved: boolean('eighty_g_approved').notNull().default(false),
  fcraApproved: boolean('fcra_approved').notNull().default(false),
  cinNumber: text('cin_number').notNull().default('U94990RJ2026NPL118002'),
  panNumber: text('pan_number').notNull().default(''),
  darpanId: text('darpan_id').notNull().default(''),
  msmeNumber: text('msme_number').notNull().default(''),
  leadershipRoster: jsonb('leadership_roster').$type<LeadershipMemberSpec[]>().notNull().default([]),
  annualReports: jsonb('annual_reports').$type<AnnualReportDocSpec[]>().notNull().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const paymentTransactions = pgTable(
  'payment_transactions',
  {
    id: serial('id').primaryKey(),
    orderId: text('order_id').notNull().unique(),
    paymentId: text('payment_id').notNull().default(''),
    purpose: text('purpose').notNull().default('marathon'), // 'marathon' | 'donation'
    referenceId: text('reference_id').notNull().default(''), // Application ID
    eventId: text('event_id').notNull().default(''),
    categoryName: text('category_name').notNull().default(''),
    payerName: text('payer_name').notNull(),
    payerMobile: text('payer_mobile').notNull(),
    district: text('district').notNull().default(''),
    amountInr: integer('amount_inr').notNull().default(0),
    currency: text('currency').notNull().default('INR'),
    status: text('status').notNull().default('CREATED'), // 'CREATED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'
    paymentMethod: text('payment_method').notNull().default(''),
    signatureVerified: boolean('signature_verified').notNull().default(false),
    webhookVerified: boolean('webhook_verified').notNull().default(false),
    notes: text('notes').notNull().default(''),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    paidAt: timestamp('paid_at'),
  },
  (table) => [
    index('payment_transactions_status_idx').on(table.status),
    index('payment_transactions_created_at_idx').on(table.createdAt),
  ]
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: serial('id').primaryKey(),
    actorEmail: text('actor_email').notNull(),
    actorRole: text('actor_role').notNull(),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    summary: text('summary').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('audit_logs_created_at_idx').on(table.createdAt)]
);

export const cmsBlueprintState = pgTable('cms_blueprint_state', {
  id: text('id').primaryKey().default('default'),
  payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default({}),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

