import type {
  AdminAuditLog,
  AdminBlueprintPayload,
  AdminCampaignRecord,
  AdminContentItem,
  AdminCsrProposal,
  AdminDistrictRecord,
  AdminDonationReport,
  AdminFormDefinition,
  AdminImpactMetric,
  AdminMarathonEvent,
  AdminMePayload,
  AdminOverviewPayload,
  AdminPaymentTransaction,
  AdminProjectRecord,
  AdminSiteGovernance,
  AdminSubmissionRecord,
  AdminTeamMember,
  FounderMessageConfig,
  HaritMitraNetworkNode,
  HomepageSectionConfig,
  MissionAdminConfig,
  PublicBootstrapPayload,
  StaticPageRecord,
  UnifiedProgrammeRecord,
  WasteActivityRecord,
  WastePartnerRecord,
} from './types';
import type { AdminRole, SubmissionStatus, TimeframeKey } from '../utils/adminLogic';

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string>;

  constructor(message: string, status: number, code?: string, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

function getAdminAuthHeaders(): Record<string, string> {
  try {
    if (typeof window === 'undefined') return {};
    const directToken =
      window.localStorage.getItem('goveda_admin_token') ||
      window.sessionStorage.getItem('goveda_admin_token');
    if (directToken && directToken.trim()) {
      return { Authorization: `Bearer ${directToken.trim()}` };
    }
    // Automatically pick up Supabase Auth session access token if present
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const token = parsed?.access_token || parsed?.currentSession?.access_token;
        if (typeof token === 'string' && token.trim()) {
          return { Authorization: `Bearer ${token.trim()}` };
        }
      }
    }
  } catch {
    // Ignore storage read issues safely
  }
  return {};
}

async function requestJson<T>(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    authenticated?: boolean;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.authenticated ? getAdminAuthHeaders() : {}),
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      data?.error || `Request failed (${response.status})`,
      response.status,
      data?.code,
      data?.errors
    );
  }
  return data as T;
}

// =========================================================================
// PUBLIC API CLIENT
// =========================================================================

export function fetchPublicBootstrap(): Promise<PublicBootstrapPayload> {
  return requestJson<PublicBootstrapPayload>('/api/public/bootstrap');
}

export function submitPublicForm(payload: {
  formType: string;
  applicantName: string;
  mobile: string;
  district: string;
  villageOrOrg: string;
  details: string;
  customFields: Record<string, string>;
  consentAccepted: boolean;
}) {
  return requestJson<{
    submission: {
      applicationId: string;
      formType: string;
      applicantName: string;
      maskedMobile: string;
      district: string;
      status: string;
      submittedAt: string;
    };
  }>('/api/public/submissions', {
    method: 'POST',
    body: payload,
  });
}

export function lookupPublicApplicationStatus(applicationId: string) {
  return requestJson<{
    record: {
      applicationId: string;
      formType: string;
      applicantName: string;
      maskedMobile: string;
      district: string;
      status: string;
      submittedAt: string;
    };
  }>(`/api/public/status/${encodeURIComponent(applicationId.trim())}`);
}

export function createPaymentOrder(payload: {
  purpose: 'marathon' | 'donation';
  referenceId?: string;
  eventId?: string;
  categoryName?: string;
  payerName: string;
  payerMobile: string;
  district?: string;
  amountInr?: number;
}) {
  return requestJson<{
    freeCategory: boolean;
    mode?: 'live' | 'test' | 'sandbox';
    keyId?: string;
    orderId?: string;
    amountInr: number;
    amountPaise?: number;
    currency?: string;
    sandboxToken?: string;
    message?: string;
  }>('/api/payments/create-order', {
    method: 'POST',
    body: payload,
  });
}

export function verifyPaymentSignature(payload: {
  orderId: string;
  paymentId: string;
  signature: string;
  paymentMethod?: string;
}) {
  return requestJson<{
    verified: boolean;
    transaction: AdminPaymentTransaction;
  }>('/api/payments/verify', {
    method: 'POST',
    body: payload,
  });
}

// =========================================================================
// PROTECTED ADMIN API CLIENT
// =========================================================================

export const adminApi = {
  getMe: () => requestJson<AdminMePayload>('/api/admin/me', { authenticated: true }),

  getOverview: (timeframe: TimeframeKey) =>
    requestJson<AdminOverviewPayload>(`/api/admin/overview?timeframe=${timeframe}`, {
      authenticated: true,
    }),

  getSubmissions: (params: {
    formType?: string;
    status?: string;
    district?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params.formType && params.formType !== 'all') sp.set('formType', params.formType);
    if (params.status && params.status !== 'all') sp.set('status', params.status);
    if (params.district && params.district !== 'all') sp.set('district', params.district);
    if (params.dateFrom) sp.set('dateFrom', params.dateFrom);
    if (params.dateTo) sp.set('dateTo', params.dateTo);
    if (params.q && params.q.trim()) sp.set('q', params.q.trim());
    const qs = sp.toString();
    return requestJson<{ submissions: AdminSubmissionRecord[] }>(
      `/api/admin/submissions${qs ? `?${qs}` : ''}`,
      { authenticated: true }
    );
  },

  getHaritMitraNetwork: () =>
    requestJson<{
      nodes: HaritMitraNetworkNode[];
      unlinkedFarmers: AdminSubmissionRecord[];
      allHaritMitras: AdminSubmissionRecord[];
    }>('/api/admin/submissions/harit-mitra-network', { authenticated: true }),

  createSubmission: (payload: {
    formType: string;
    applicantName: string;
    mobile: string;
    district: string;
    villageOrOrg: string;
    details?: string;
    status?: SubmissionStatus;
    adminNotes?: string;
    customFields?: Record<string, string>;
  }) =>
    requestJson<{ submission: AdminSubmissionRecord }>('/api/admin/submissions', {
      method: 'POST',
      body: payload,
      authenticated: true,
    }),

  updateSubmission: (
    id: number,
    patch: {
      status?: SubmissionStatus;
      adminNotes?: string;
      customFields?: Record<string, string>;
      generateReferralCode?: boolean;
      generateUniqueId?: boolean;
    }
  ) =>
    requestJson<{ submission: AdminSubmissionRecord }>(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      body: patch,
      authenticated: true,
    }),

  bulkUpdateSubmissions: (ids: number[], status: SubmissionStatus) =>
    requestJson<{ updatedCount: number }>('/api/admin/submissions/bulk-status', {
      method: 'POST',
      body: { ids, status },
      authenticated: true,
    }),

  deleteSubmission: (id: number) =>
    requestJson<{ deleted: boolean }>(`/api/admin/submissions/${id}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  downloadSubmissionsCsv: async (params: {
    formType?: string;
    status?: string;
    district?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params.formType && params.formType !== 'all') sp.set('formType', params.formType);
    if (params.status && params.status !== 'all') sp.set('status', params.status);
    if (params.district && params.district !== 'all') sp.set('district', params.district);
    if (params.dateFrom) sp.set('dateFrom', params.dateFrom);
    if (params.dateTo) sp.set('dateTo', params.dateTo);
    if (params.q && params.q.trim()) sp.set('q', params.q.trim());
    const qs = sp.toString();
    const response = await fetch(`/api/admin/submissions/export.csv${qs ? `?${qs}` : ''}`, {
      headers: getAdminAuthHeaders(),
    });
    if (!response.ok) {
      throw new ApiError('Unable to export CSV.', response.status);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goveda-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  downloadSubmissionsJson: async (params: {
    formType?: string;
    status?: string;
    district?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params.formType && params.formType !== 'all') sp.set('formType', params.formType);
    if (params.status && params.status !== 'all') sp.set('status', params.status);
    if (params.district && params.district !== 'all') sp.set('district', params.district);
    if (params.dateFrom) sp.set('dateFrom', params.dateFrom);
    if (params.dateTo) sp.set('dateTo', params.dateTo);
    if (params.q && params.q.trim()) sp.set('q', params.q.trim());
    const qs = sp.toString();
    const response = await fetch(`/api/admin/submissions/export.json${qs ? `?${qs}` : ''}`, {
      headers: getAdminAuthHeaders(),
    });
    if (!response.ok) {
      throw new ApiError('Unable to download JSON backup.', response.status);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goveda-submissions-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  getPayments: (params?: {
    status?: string;
    purpose?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params?.status && params.status !== 'all') sp.set('status', params.status);
    if (params?.purpose && params.purpose !== 'all') sp.set('purpose', params.purpose);
    if (params?.dateFrom) sp.set('dateFrom', params.dateFrom);
    if (params?.dateTo) sp.set('dateTo', params.dateTo);
    if (params?.q && params.q.trim()) sp.set('q', params.q.trim());
    const qs = sp.toString();
    return requestJson<{
      transactions: AdminPaymentTransaction[];
      summary: {
        totalCollectedInr: number;
        capturedCount: number;
        pendingCount: number;
        failedOrRefundedCount: number;
        categoryBreakdown: { category: string; count: number; amountInr: number }[];
      };
      gatewayConfig: {
        mode: 'live' | 'test' | 'sandbox';
        hasKeys: boolean;
        webhookConfigured: boolean;
      };
    }>(`/api/admin/payments${qs ? `?${qs}` : ''}`, { authenticated: true });
  },

  downloadPaymentsCsv: async (params?: {
    status?: string;
    purpose?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) => {
    const sp = new URLSearchParams();
    if (params?.status && params.status !== 'all') sp.set('status', params.status);
    if (params?.purpose && params.purpose !== 'all') sp.set('purpose', params.purpose);
    if (params?.dateFrom) sp.set('dateFrom', params.dateFrom);
    if (params?.dateTo) sp.set('dateTo', params.dateTo);
    if (params?.q && params.q.trim()) sp.set('q', params.q.trim());
    const qs = sp.toString();
    const response = await fetch(`/api/admin/payments/export.csv${qs ? `?${qs}` : ''}`, {
      headers: getAdminAuthHeaders(),
    });
    if (!response.ok) {
      throw new ApiError('Unable to export payments CSV.', response.status);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goveda-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  getForms: () =>
    requestJson<{ forms: AdminFormDefinition[] }>('/api/admin/forms', {
      authenticated: true,
    }),

  updateForm: (id: string, patch: Partial<AdminFormDefinition>) =>
    requestJson<{ form: AdminFormDefinition }>(`/api/admin/forms/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: patch,
      authenticated: true,
    }),

  getCampaigns: () =>
    requestJson<{ campaigns: AdminCampaignRecord[] }>('/api/admin/campaigns', {
      authenticated: true,
    }),

  saveCampaign: (campaign: Partial<AdminCampaignRecord>) =>
    requestJson<{ campaign: AdminCampaignRecord }>('/api/admin/campaigns', {
      method: 'POST',
      body: campaign,
      authenticated: true,
    }),

  deleteCampaign: (id: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/campaigns/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  getEvents: () =>
    requestJson<{ events: AdminMarathonEvent[] }>('/api/admin/events', {
      authenticated: true,
    }),

  saveEvent: (event: Partial<AdminMarathonEvent>) =>
    requestJson<{ event: AdminMarathonEvent }>('/api/admin/events', {
      method: 'POST',
      body: event,
      authenticated: true,
    }),

  deleteEvent: (id: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/events/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  getDistricts: () =>
    requestJson<{ districts: AdminDistrictRecord[] }>('/api/admin/districts', {
      authenticated: true,
    }),

  saveDistrict: (district: Partial<AdminDistrictRecord>) =>
    requestJson<{ district: AdminDistrictRecord }>('/api/admin/districts', {
      method: 'POST',
      body: district,
      authenticated: true,
    }),

  deleteDistrict: (slug: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/districts/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  getProjectsAndImpact: () =>
    requestJson<{ projects: AdminProjectRecord[]; impactMetrics: AdminImpactMetric[] }>(
      '/api/admin/projects',
      { authenticated: true }
    ),

  saveProject: (project: Partial<AdminProjectRecord>) =>
    requestJson<{ project: AdminProjectRecord }>('/api/admin/projects', {
      method: 'POST',
      body: project,
      authenticated: true,
    }),

  deleteProject: (id: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  updateImpactMetric: (
    metricKey: string,
    patch: {
      verifiedValue: number;
      unitLabel: string;
      verificationNote: string;
      isPublished: boolean;
    }
  ) =>
    requestJson<{ metric: AdminImpactMetric }>(
      `/api/admin/impact-metrics/${encodeURIComponent(metricKey)}`,
      {
        method: 'PATCH',
        body: patch,
        authenticated: true,
      }
    ),

  getContent: () =>
    requestJson<{ items: AdminContentItem[] }>('/api/admin/content', {
      authenticated: true,
    }),

  saveContent: (item: Partial<AdminContentItem>) =>
    requestJson<{ item: AdminContentItem }>('/api/admin/content', {
      method: 'POST',
      body: item,
      authenticated: true,
    }),

  deleteContent: (id: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/content/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  getDonations: () =>
    requestJson<{ reports: AdminDonationReport[] }>('/api/admin/donations', {
      authenticated: true,
    }),

  saveDonation: (report: Partial<AdminDonationReport>) =>
    requestJson<{ report: AdminDonationReport }>('/api/admin/donations', {
      method: 'POST',
      body: report,
      authenticated: true,
    }),

  deleteDonation: (id: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/donations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  uploadMedia: async (file: File) => {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read selected file.'));
      reader.readAsDataURL(file);
    });
    return requestJson<{
      url: string;
      mediaType: 'image' | 'video' | 'pdf';
      fileName: string;
      sizeBytes: number;
    }>('/api/admin/upload', {
      method: 'POST',
      body: { fileName: file.name, base64Data },
      authenticated: true,
    });
  },

  getCsrProposals: () =>
    requestJson<{ proposals: AdminCsrProposal[] }>('/api/admin/csr-proposals', {
      authenticated: true,
    }),

  saveCsrProposal: (proposal: Partial<AdminCsrProposal>) =>
    requestJson<{ proposal: AdminCsrProposal }>('/api/admin/csr-proposals', {
      method: 'POST',
      body: proposal,
      authenticated: true,
    }),

  deleteCsrProposal: (id: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/csr-proposals/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  getGovernance: () =>
    requestJson<{ governance: AdminSiteGovernance }>('/api/admin/governance', {
      authenticated: true,
    }),

  saveGovernance: (governance: Partial<AdminSiteGovernance>) =>
    requestJson<{ governance: AdminSiteGovernance }>('/api/admin/governance', {
      method: 'PATCH',
      body: governance,
      authenticated: true,
    }),

  getTeam: () =>
    requestJson<{ users: AdminTeamMember[] }>('/api/admin/team', {
      authenticated: true,
    }),

  saveTeamMember: (member: {
    email: string;
    displayName: string;
    role: AdminRole;
    assignedDistricts: string[];
    isActive: boolean;
  }) =>
    requestJson<{ user: AdminTeamMember }>('/api/admin/team', {
      method: 'POST',
      body: member,
      authenticated: true,
    }),

  deleteTeamMember: (id: number) =>
    requestJson<{ deleted: boolean }>(`/api/admin/team/${id}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  getAuditLogs: () =>
    requestJson<{ logs: AdminAuditLog[] }>('/api/admin/audit-logs', {
      authenticated: true,
    }),

  getBlueprint: () =>
    requestJson<AdminBlueprintPayload>('/api/admin/blueprint', {
      authenticated: true,
    }),

  saveHomepageSections: (sections: HomepageSectionConfig[]) =>
    requestJson<{ homepageSections: HomepageSectionConfig[] }>(
      '/api/admin/homepage-sections',
      {
        method: 'PUT',
        body: { sections },
        authenticated: true,
      }
    ),

  saveStaticPage: (page: Partial<StaticPageRecord>) =>
    requestJson<{ page: StaticPageRecord; staticPages: StaticPageRecord[] }>(
      '/api/admin/pages',
      {
        method: 'POST',
        body: page,
        authenticated: true,
      }
    ),

  deleteStaticPage: (id: string) =>
    requestJson<{ deleted: boolean }>(`/api/admin/pages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      authenticated: true,
    }),

  saveMissionConfig: (slug: string, patch: Partial<MissionAdminConfig>) =>
    requestJson<{ mission: MissionAdminConfig; missionConfigs: MissionAdminConfig[] }>(
      `/api/admin/missions/${encodeURIComponent(slug)}`,
      {
        method: 'PUT',
        body: patch,
        authenticated: true,
      }
    ),

  saveWasteRecord: (record: Partial<WasteActivityRecord>) =>
    requestJson<{ record: WasteActivityRecord; wasteRecords: WasteActivityRecord[] }>(
      '/api/admin/waste/records',
      {
        method: 'POST',
        body: record,
        authenticated: true,
      }
    ),

  deleteWasteRecord: (id: string) =>
    requestJson<{ deleted: boolean }>(
      `/api/admin/waste/records/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        authenticated: true,
      }
    ),

  saveWastePartner: (partner: Partial<WastePartnerRecord>) =>
    requestJson<{ partner: WastePartnerRecord; wastePartners: WastePartnerRecord[] }>(
      '/api/admin/waste/partners',
      {
        method: 'POST',
        body: partner,
        authenticated: true,
      }
    ),

  deleteWastePartner: (id: string) =>
    requestJson<{ deleted: boolean }>(
      `/api/admin/waste/partners/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        authenticated: true,
      }
    ),

  saveProgramme: (payload: Partial<UnifiedProgrammeRecord>) =>
    requestJson<{
      programme: UnifiedProgrammeRecord;
      programmes: UnifiedProgrammeRecord[];
    }>('/api/admin/programmes', {
      method: 'POST',
      body: payload,
      authenticated: true,
    }),

  deleteProgramme: (id: string) =>
    requestJson<{ deleted: boolean; programmes: UnifiedProgrammeRecord[] }>(
      `/api/admin/programmes/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        authenticated: true,
      }
    ),

  saveFounderMessage: (payload: Partial<FounderMessageConfig>) =>
    requestJson<{ founderMessage: FounderMessageConfig }>('/api/admin/founder-message', {
      method: 'PUT',
      body: payload,
      authenticated: true,
    }),
};



