import type {
  AnnualReportDocSpec,
  CampaignRoleSpec,
  ContentCourseMetaSpec,
  DistrictOutreachItemSpec,
  DynamicFormFieldSpec,
  EventGuestSponsorSpec,
  LeadershipMemberSpec,
  MarathonScheduleSpec,
  RaceCategorySpec,
} from '../db/schema';
import type {
  AdminModuleKey,
  AdminRole,
  AnalyticsPoint,
  FormTypeBreakdownRow,
  SubmissionStatus,
  TimeframeKey,
} from '../utils/adminLogic';

export interface AdminProfile {
  id: number;
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  assignedDistricts: string[];
  isActive: boolean;
}

export interface AdminSubmissionRecord {
  id: number;
  applicationId: string;
  formType: string;
  applicantName: string;
  mobile: string;
  district: string;
  villageOrOrg: string;
  details: string;
  customFields: Record<string, string>;
  status: SubmissionStatus;
  adminNotes: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  consentAccepted: boolean;
  submittedAt: string;
}

export interface AdminFormDefinition {
  id: string;
  formNumber: number;
  codePrefix: string;
  iconName: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  orgLabelHi: string;
  orgLabelEn: string;
  orgPlaceholderHi: string;
  orgPlaceholderEn: string;
  detailsLabelHi: string;
  detailsLabelEn: string;
  detailsPlaceholderHi: string;
  detailsPlaceholderEn: string;
  isOpen: boolean;
  closedMessageHi: string;
  closedMessageEn: string;
  customFields: DynamicFormFieldSpec[];
  updatedAt: string;
}

export interface AdminDistrictRecord {
  slug: string;
  stateSlug?: string;
  stateNameHi?: string;
  stateNameEn?: string;
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
  mapX?: number;
  mapY?: number;
  subDistricts?: string[];
  villages?: string[];
  galleryUrls: string[];
  outreachItems: DistrictOutreachItemSpec[];
  isActive: boolean;
  displayOrder: number;
  updatedAt?: string;
}

export interface AdminMarathonEvent {
  id: string;
  titleHi: string;
  titleEn: string;
  themeHi: string;
  themeEn: string;
  scope?: 'National' | 'Statewide' | 'District' | 'Local' | string;
  stateName?: string;
  district: string;
  subDistrict?: string;
  villageOrTown?: string;
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
  status: 'Proposed' | 'Confirmed' | 'Completed';
  raceCategories: RaceCategorySpec[];
  schedule: MarathonScheduleSpec[];
  guests: EventGuestSponsorSpec[];
  sponsors: EventGuestSponsorSpec[];
  registrationOpen: boolean;
  updatedAt?: string;
}

export interface AdminProjectRecord {
  id: string;
  titleHi: string;
  titleEn: string;
  locationHi: string;
  locationEn: string;
  scope?: string;
  stateName?: string;
  district: string;
  subDistrict?: string;
  villageOrTown?: string;
  missionCategoryHi: string;
  missionCategoryEn: string;
  status: 'Proposed' | 'Under Assessment' | 'Approved' | 'Ongoing' | 'Completed';
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
  updatedAt?: string;
}

export interface AdminCampaignRecord {
  id: string;
  campaignCode: string;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  missionPillar: string;
  scope: 'National' | 'Statewide' | 'District' | 'Local' | string;
  stateSlug: string;
  stateName: string;
  district: string;
  subDistrict: string;
  villageOrTown: string;
  startDate: string;
  endDate: string;
  status: 'Planned' | 'Active' | 'Completed';
  isPublished: boolean;
  bannerUrl: string;
  roles: CampaignRoleSpec[];
  updatedAt?: string;
}

export interface AdminImpactMetric {
  metricKey: string;
  labelHi: string;
  labelEn: string;
  verifiedValue: number;
  unitLabel: string;
  verificationNote: string;
  isPublished: boolean;
  displayOrder: number;
  updatedBy: string | null;
  updatedAt: string;
}

export interface AdminContentItem {
  id: string;
  slug?: string;
  sectionType: 'news' | 'training' | 'magazine' | 'gallery' | 'mission_update';
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  bodyHi?: string;
  bodyEn?: string;
  authorName?: string;
  seoDescription?: string;
  stateName?: string;
  districtName?: string;
  subDistrict?: string;
  villageOrTown?: string;
  mediaUrl: string;
  mediaType: 'article' | 'image' | 'video' | 'pdf';
  videoUrl: string;
  pdfUrl: string;
  relatedMissionSlug: string;
  courseMeta: ContentCourseMetaSpec | null;
  categoryTag: string;
  status: 'Draft' | 'Published';
  publishedAt?: string;
  updatedAt?: string;
}

export interface AdminPaymentTransaction {
  id: number;
  orderId: string;
  paymentId: string;
  purpose: 'marathon' | 'donation' | string;
  referenceId: string;
  eventId: string;
  categoryName: string;
  payerName: string;
  payerMobile: string;
  district: string;
  amountInr: number;
  currency: string;
  status: 'CREATED' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | string;
  paymentMethod: string;
  signatureVerified: boolean;
  webhookVerified: boolean;
  notes: string;
  createdAt: string;
  paidAt: string | null;
}

export interface HaritMitraNetworkNode {
  haritMitra: AdminSubmissionRecord;
  referralCode: string;
  linkedFarmers: AdminSubmissionRecord[];
  linkedMembers?: AdminSubmissionRecord[];
}

export interface AdminDonationReport {
  id: string;
  title: string;
  fiscalPeriod: string;
  donorCategory: string;
  amountInr: number;
  receiptStatus: 'Pending Verification' | 'Verified';
  transparencyNote: string;
  createdAt?: string;
}

export interface AdminCsrProposal {
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
  status: 'Proposed' | 'Open for CSR' | 'Supported';
  isPublished: boolean;
  updatedAt?: string;
}

export interface AdminSiteGovernance {
  id: string;
  magazineTitleHi: string;
  magazineTitleEn: string;
  magazineRegStatus: 'Proposed' | 'Registered';
  magazineRegNumber: string;
  magazineLatestPdfUrl: string;
  geoMrvStatus: 'coming_soon' | 'active';
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
  annualReports?: AnnualReportDocSpec[];
  updatedAt?: string;
}

export interface AdminTeamMember {
  id: number;
  uid: string | null;
  email: string;
  displayName: string;
  role: AdminRole;
  assignedDistricts: string[];
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminAuditLog {
  id: number;
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  createdAt: string;
}

export interface AdminOverviewPayload {
  timeframe: TimeframeKey;
  kpis: {
    totalSubmissions: number;
    pendingReview: number;
    approvedCount: number;
    rejectedCount: number;
    approvalRate: number;
    activeDistricts: number;
    openFormsCount: number;
    totalFormsCount: number;
    totalEvents: number;
    totalProjects: number;
    publishedContentCount: number;
  };
  series: AnalyticsPoint[];
  formBreakdown: FormTypeBreakdownRow[];
  districtBreakdown: { district: string; count: number }[];
  recentSubmissions: AdminSubmissionRecord[];
  impactMetrics: AdminImpactMetric[];
}

export interface PublicBootstrapPayload {
  forms: AdminFormDefinition[];
  districts: AdminDistrictRecord[];
  marathonEvents: AdminMarathonEvent[];
  projects: AdminProjectRecord[];
  campaigns?: AdminCampaignRecord[];
  impactMetrics: AdminImpactMetric[];
  contentItems: AdminContentItem[];
  csrProposals: AdminCsrProposal[];
  siteGovernance: AdminSiteGovernance | null;
}

export interface AdminMePayload {
  user: AdminProfile;
  allowedModules: AdminModuleKey[];
}
