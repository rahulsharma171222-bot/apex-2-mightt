import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  Flag,
  FolderKanban,
  Globe,
  Inbox,
  IndianRupee,
  LayoutDashboard,
  MapPin,
  Menu,
  RefreshCw,
  Shield,
  SlidersHorizontal,
  Trophy,
  Users,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { AdminOverview } from './AdminOverview';
import { AdminSubmissions } from './AdminSubmissions';
import { AdminFormStudio } from './AdminFormStudio';
import { AdminCampaigns } from './AdminCampaigns';
import { AdminPayments } from './AdminPayments';
import {
  AdminDistrictsView,
  AdminEventsView,
  AdminProjectsImpactView,
} from './AdminProgrammes';
import {
  AdminAuditLogView,
  AdminContentView,
  AdminDonationsView,
  AdminSiteGovernanceView,
  AdminTeamView,
} from './AdminPublishingGovernance';
import { ApiError, adminApi } from './apiClient';
import type {
  AdminAuditLog,
  AdminCampaignRecord,
  AdminContentItem,
  AdminCsrProposal,
  AdminDistrictRecord,
  AdminDonationReport,
  AdminFormDefinition,
  AdminImpactMetric,
  AdminMarathonEvent,
  AdminOverviewPayload,
  AdminPaymentTransaction,
  AdminProfile,
  AdminProjectRecord,
  AdminSiteGovernance,
  AdminSubmissionRecord,
  AdminTeamMember,
  HaritMitraNetworkNode,
} from './types';
import {
  ROLE_LABELS,
  type AdminModuleKey,
  type AdminRole,
  type SubmissionStatus,
  type TimeframeKey,
} from '../utils/adminLogic';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onDataMutated?: () => void;
}

interface NavGroup {
  groupLabel: string;
  items: {
    key: AdminModuleKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'Operations',
    items: [
      { key: 'overview', label: 'Overview', icon: LayoutDashboard },
      { key: 'submissions', label: '12-Form Submissions', icon: Inbox },
      { key: 'forms', label: '12-Form Studio', icon: SlidersHorizontal },
    ],
  },
  {
    groupLabel: 'Programmes',
    items: [
      { key: 'campaigns', label: 'Campaigns & Roles', icon: Flag },
      { key: 'events', label: 'Harit Marathon & Events', icon: Trophy },
      { key: 'districts', label: 'Locations & Outreach', icon: MapPin },
      { key: 'projects', label: 'Projects & Impact', icon: FolderKanban },
    ],
  },
  {
    groupLabel: 'Publishing & Finance',
    items: [
      { key: 'content', label: 'Articles, Mag & Courses', icon: FileText },
      { key: 'payments', label: 'Payments & Razorpay', icon: CreditCard },
      { key: 'donations', label: 'CSR & Donations', icon: IndianRupee },
    ],
  },
  {
    groupLabel: 'Governance',
    items: [
      { key: 'governance', label: 'Site & Legal Controls', icon: Globe },
      { key: 'team', label: 'Team & Roles', icon: Users },
      { key: 'audit', label: 'Audit & Supabase', icon: Shield },
    ],
  },
];

function getGreeting(): string {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
}

export function AdminDashboard({ onExitAdmin, onDataMutated }: AdminDashboardProps) {
  // Session state (Direct access while Firebase Auth is disabled prior to Supabase migration)
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [allowedModules, setAllowedModules] = useState<AdminModuleKey[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  // Shell UI state
  const [activeModule, setActiveModule] = useState<AdminModuleKey>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Module Data state
  const [timeframe, setTimeframe] = useState<TimeframeKey>('30d');
  const [overviewData, setOverviewData] = useState<AdminOverviewPayload | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const [forms, setForms] = useState<AdminFormDefinition[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmissionRecord[]>([]);
  const [haritMitraNetwork, setHaritMitraNetwork] = useState<{
    nodes: HaritMitraNetworkNode[];
    unlinkedFarmers: AdminSubmissionRecord[];
    allHaritMitras: AdminSubmissionRecord[];
  } | null>(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [subFilters, setSubFilters] = useState({
    formType: 'all',
    status: 'all',
    district: 'all',
    dateFrom: '',
    dateTo: '',
    q: '',
  });
  const [inspectedSubmission, setInspectedSubmission] =
    useState<AdminSubmissionRecord | null>(null);

  const [paymentData, setPaymentData] = useState<{
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
  }>({
    transactions: [],
    summary: {
      totalCollectedInr: 0,
      capturedCount: 0,
      pendingCount: 0,
      failedOrRefundedCount: 0,
      categoryBreakdown: [],
    },
    gatewayConfig: { mode: 'sandbox', hasKeys: false, webhookConfigured: false },
  });
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentFilters, setPaymentFilters] = useState({
    status: 'all',
    purpose: 'all',
    dateFrom: '',
    dateTo: '',
    q: '',
  });

  const [campaigns, setCampaigns] = useState<AdminCampaignRecord[]>([]);
  const [events, setEvents] = useState<AdminMarathonEvent[]>([]);
  const [districts, setDistricts] = useState<AdminDistrictRecord[]>([]);
  const [projects, setProjects] = useState<AdminProjectRecord[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<AdminImpactMetric[]>([]);
  const [contentItems, setContentItems] = useState<AdminContentItem[]>([]);
  const [donationReports, setDonationReports] = useState<AdminDonationReport[]>([]);
  const [csrProposals, setCsrProposals] = useState<AdminCsrProposal[]>([]);
  const [governance, setGovernance] = useState<AdminSiteGovernance | null>(null);
  const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const verifySession = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const me = await adminApi.getMe();
      setAdminUser(me.user);
      setAllowedModules(me.allowedModules);
    } catch (err) {
      setAdminUser(null);
      setAllowedModules([]);
      if (err instanceof ApiError) {
        setAuthError(err.message);
      } else {
        setAuthError('Unable to open Admin Console right now.');
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Data loaders
  const loadOverview = useCallback(
    async (tf: TimeframeKey = timeframe) => {
      if (!adminUser) return;
      setOverviewLoading(true);
      try {
        const res = await adminApi.getOverview(tf);
        setOverviewData(res);
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to load dashboard overview.');
      } finally {
        setOverviewLoading(false);
      }
    },
    [adminUser, timeframe, showToast]
  );

  const loadFormsAndDistricts = useCallback(async () => {
    if (!adminUser) return;
    try {
      const [formsRes, distRes] = await Promise.all([
        adminApi.getForms(),
        allowedModules.includes('districts')
          ? adminApi.getDistricts()
          : Promise.resolve({ districts: [] }),
      ]);
      setForms(formsRes.forms);
      if (distRes.districts.length > 0) setDistricts(distRes.districts);
    } catch {
      // Handled per view
    }
  }, [adminUser, allowedModules]);

  const loadHaritMitraNetwork = useCallback(async () => {
    if (!adminUser || !allowedModules.includes('submissions')) return;
    try {
      const net = await adminApi.getHaritMitraNetwork();
      setHaritMitraNetwork(net);
    } catch {
      // Non-blocking
    }
  }, [adminUser, allowedModules]);

  const loadSubmissions = useCallback(
    async (filters = subFilters) => {
      if (!adminUser || !allowedModules.includes('submissions')) return;
      setSubmissionsLoading(true);
      try {
        const res = await adminApi.getSubmissions(filters);
        setSubmissions(res.submissions);
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to load submissions.');
      } finally {
        setSubmissionsLoading(false);
      }
    },
    [adminUser, allowedModules, subFilters, showToast]
  );

  const loadPayments = useCallback(
    async (filters = paymentFilters) => {
      if (!adminUser || !allowedModules.includes('payments')) return;
      setPaymentsLoading(true);
      try {
        const res = await adminApi.getPayments(filters);
        setPaymentData(res);
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to load payment transactions.');
      } finally {
        setPaymentsLoading(false);
      }
    },
    [adminUser, allowedModules, paymentFilters, showToast]
  );

  const loadActiveModuleData = useCallback(
    async (mod: AdminModuleKey) => {
      if (!adminUser) return;
      try {
        if (mod === 'overview') {
          await Promise.all([loadOverview(timeframe), loadFormsAndDistricts()]);
        } else if (mod === 'submissions') {
          await Promise.all([
            loadSubmissions(subFilters),
            loadHaritMitraNetwork(),
            loadFormsAndDistricts(),
          ]);
        } else if (mod === 'forms') {
          const res = await adminApi.getForms();
          setForms(res.forms);
        } else if (mod === 'campaigns') {
          const [cmpRes] = await Promise.all([
            adminApi.getCampaigns(),
            loadFormsAndDistricts(),
          ]);
          setCampaigns(cmpRes.campaigns);
        } else if (mod === 'events') {
          const res = await adminApi.getEvents();
          setEvents(res.events);
        } else if (mod === 'districts') {
          const res = await adminApi.getDistricts();
          setDistricts(res.districts);
        } else if (mod === 'projects') {
          const res = await adminApi.getProjectsAndImpact();
          setProjects(res.projects);
          setImpactMetrics(res.impactMetrics);
        } else if (mod === 'content') {
          const res = await adminApi.getContent();
          setContentItems(res.items);
        } else if (mod === 'payments') {
          await loadPayments(paymentFilters);
        } else if (mod === 'donations') {
          const [donRes, csrRes] = await Promise.all([
            adminApi.getDonations(),
            adminApi.getCsrProposals(),
          ]);
          setDonationReports(donRes.reports);
          setCsrProposals(csrRes.proposals);
        } else if (mod === 'governance') {
          const res = await adminApi.getGovernance();
          setGovernance(res.governance);
        } else if (mod === 'team') {
          const [teamRes, distRes] = await Promise.all([
            adminApi.getTeam(),
            adminApi.getDistricts(),
          ]);
          setTeamMembers(teamRes.users);
          setDistricts(distRes.districts);
        } else if (mod === 'audit') {
          const res = await adminApi.getAuditLogs();
          setAuditLogs(res.logs);
        }
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to refresh workspace data.');
      }
    },
    [
      adminUser,
      timeframe,
      subFilters,
      paymentFilters,
      loadOverview,
      loadFormsAndDistricts,
      loadSubmissions,
      loadHaritMitraNetwork,
      loadPayments,
      showToast,
    ]
  );

  useEffect(() => {
    if (adminUser) {
      loadActiveModuleData(activeModule);
    }
  }, [adminUser, activeModule]);

  // Refetch submissions when filters change while on submissions view
  useEffect(() => {
    if (adminUser && activeModule === 'submissions') {
      const timer = setTimeout(() => {
        loadSubmissions(subFilters);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [subFilters, adminUser, activeModule]);

  // Refetch payments when filters change while on payments view
  useEffect(() => {
    if (adminUser && activeModule === 'payments') {
      const timer = setTimeout(() => {
        loadPayments(paymentFilters);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [paymentFilters, adminUser, activeModule]);

  if (!adminUser) {
    return (
      <div className="min-h-dvh bg-[#F7F9F7] text-[#142119] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2EAE4] p-7 space-y-4 text-center">
          <BrandLogo compact />
          {authLoading ? (
            <div className="space-y-3 py-4" aria-busy="true" aria-label="Loading Admin Console">
              <div className="h-10 rounded-xl bg-[#EEF3EE] animate-pulse" />
              <p className="text-xs text-[#55685C]">Opening GOVEDA Admin Console...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {authError || 'Unable to load admin workspace.'}
              </p>
              <div className="flex gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={verifySession}
                  className="px-4 py-2 rounded-xl bg-[#144527] text-white text-xs font-semibold cursor-pointer"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={onExitAdmin}
                  className="px-4 py-2 rounded-xl border border-[#D4E0D7] text-xs font-medium text-[#142119] cursor-pointer"
                >
                  Back to Public Site
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const canViewSubmissions = allowedModules.includes('submissions');
  const pendingBadgeCount = overviewData?.kpis.pendingReview ?? 0;
  const todayLabel = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleSelectModule = (mod: AdminModuleKey) => {
    setActiveModule(mod);
    setMobileMenuOpen(false);
  };

  const handleFilterFromOverview = (formType: string) => {
    setSubFilters((prev) => ({ ...prev, formType }));
    setActiveModule('submissions');
  };

  const handleInspectFromOverview = (record: AdminSubmissionRecord) => {
    setInspectedSubmission(record);
    setActiveModule('submissions');
  };

  const notifyPublicRefresh = () => {
    if (onDataMutated) onDataMutated();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-[#EDF2EE] flex items-center justify-between gap-2">
          {!sidebarCollapsed && <BrandLogo compact />}
          {sidebarCollapsed && (
            <div className="w-9 h-9 rounded-xl bg-[#144527] text-white font-bold text-sm flex items-center justify-center mx-auto">
              G
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#E2EAE4] text-[#55685C] hover:bg-[#F4F8F3] cursor-pointer shrink-0"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav aria-label="Admin Navigation" className="p-3 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter((it) =>
              allowedModules.includes(it.key)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.groupLabel} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-3 pb-1 text-[11px] font-semibold text-[#7C8F82]">
                    {group.groupLabel}
                  </p>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeModule === item.key;
                  const showCount = item.key === 'submissions' && pendingBadgeCount > 0;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleSelectModule(item.key)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#144527] text-white'
                          : 'text-[#3C4F43] hover:bg-[#EEF4EF] hover:text-[#142119]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </span>
                      {!sidebarCollapsed && showCount && (
                        <span
                          className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded-md ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-[#EDF5EE] text-[#144527]'
                          }`}
                        >
                          {pendingBadgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Return Control */}
      <div className="p-3 border-t border-[#EDF2EE] space-y-1.5">
        <button
          type="button"
          onClick={onExitAdmin}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#44544A] hover:bg-[#F4F8F3] hover:text-[#144527] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Back to Public Website</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-[#F7F9F7] text-[#142119] flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 bg-white border-r border-[#E2EAE4] sticky top-0 h-dvh transition-[width] duration-200 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white h-full border-r border-[#E2EAE4] shadow-2xl relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close admin menu"
              className="absolute right-3 top-4 w-8 h-8 rounded-lg border border-[#E2EAE4] flex items-center justify-center text-[#55685C]"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </div>
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex-1 bg-[#0E1E14]/35"
          />
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Greeting & Context Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E2EAE4] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open admin navigation"
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#DCE5DE] text-[#142119] shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-[#142119] truncate">
                {getGreeting()}, {adminUser.displayName}
              </h1>
              <p className="text-[11px] text-[#55685C] truncate">
                {ROLE_LABELS[adminUser.role]}
                {adminUser.role === 'district_coordinator' &&
                  adminUser.assignedDistricts.length > 0 &&
                  ` · ${adminUser.assignedDistricts.join(', ')}`}
                {' · '}
                {adminUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#55685C] font-mono tabular-nums pr-2">
              <Calendar className="w-3.5 h-3.5 text-[#368737]" aria-hidden="true" />
              {todayLabel}
            </span>
            <button
              type="button"
              onClick={() => loadActiveModuleData(activeModule)}
              aria-label="Refresh current view"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#F4F8F3] text-xs font-semibold text-[#142119] cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {canViewSubmissions && activeModule !== 'submissions' && (
              <button
                type="button"
                onClick={() => setActiveModule('submissions')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Review Forms</span>
              </button>
            )}
          </div>
        </header>

        {/* Inline Toast Feedback */}
        {toast && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <div
              role="status"
              className={`rounded-xl border px-4 py-2.5 text-xs font-medium flex items-center justify-between gap-2 ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <span className="flex items-center gap-2">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                )}
                <span>{toast.message}</span>
              </span>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Dismiss message"
                className="opacity-70 hover:opacity-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Active Module Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {activeModule === 'overview' && (
            <AdminOverview
              data={overviewData}
              loading={overviewLoading}
              timeframe={timeframe}
              canViewSubmissions={canViewSubmissions}
              onChangeTimeframe={(tf) => {
                setTimeframe(tf);
                loadOverview(tf);
              }}
              onFilterByFormType={handleFilterFromOverview}
              onInspectSubmission={handleInspectFromOverview}
              onGoToSubmissions={() => setActiveModule('submissions')}
            />
          )}

          {activeModule === 'submissions' && (
            <AdminSubmissions
              role={adminUser.role}
              submissions={submissions}
              forms={forms}
              districts={districts}
              haritMitraNetwork={haritMitraNetwork}
              loading={submissionsLoading}
              selectedFormType={subFilters.formType}
              selectedStatus={subFilters.status}
              selectedDistrict={subFilters.district}
              dateFrom={subFilters.dateFrom}
              dateTo={subFilters.dateTo}
              searchQuery={subFilters.q}
              activeRecord={inspectedSubmission}
              onChangeFilters={(patch) =>
                setSubFilters((prev) => ({ ...prev, ...patch }))
              }
              onSelectRecord={setInspectedSubmission}
              onCreateRecord={async (payload) => {
                try {
                  const res = await adminApi.createSubmission(payload);
                  setSubmissions((prev) => [res.submission, ...prev]);
                  loadHaritMitraNetwork();
                  loadOverview(timeframe);
                  const issuedId =
                    res.submission.customFields?.referralCode ||
                    res.submission.customFields?.memberUniqueId ||
                    res.submission.applicationId;
                  showToast(
                    'success',
                    `Created ${res.submission.applicantName} with Unique ID ${issuedId}.`
                  );
                  return res.submission;
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to create member record.');
                  return null;
                }
              }}
              onUpdateRecord={async (id, patch, options) => {
                try {
                  const res = await adminApi.updateSubmission(id, patch);
                  setSubmissions((prev) =>
                    prev.map((s) => (s.id === id ? res.submission : s))
                  );
                  if (options?.closeAfterSave) {
                    setInspectedSubmission(null);
                  } else {
                    setInspectedSubmission(res.submission);
                  }
                  loadHaritMitraNetwork();
                  loadOverview(timeframe);
                  const toastMsg =
                    patch.generateUniqueId || patch.generateReferralCode
                      ? `Issued Unique ID for ${res.submission.applicantName} (${
                          res.submission.customFields?.referralCode ||
                          res.submission.customFields?.memberUniqueId ||
                          res.submission.applicationId
                        }).`
                      : `Saved review updates for ${res.submission.applicationId}.`;
                  showToast('success', toastMsg);
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to update submission.');
                }
              }}
              onBulkUpdate={async (ids, status) => {
                try {
                  const res = await adminApi.bulkUpdateSubmissions(ids, status);
                  await Promise.all([
                    loadSubmissions(subFilters),
                    loadHaritMitraNetwork(),
                    loadOverview(timeframe),
                  ]);
                  showToast(
                    'success',
                    `Updated ${res.updatedCount} submissions to "${status}".`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Bulk update failed.');
                }
              }}
              onDeleteRecord={async (id) => {
                try {
                  await adminApi.deleteSubmission(id);
                  setSubmissions((prev) => prev.filter((s) => s.id !== id));
                  loadHaritMitraNetwork();
                  loadOverview(timeframe);
                  showToast('success', 'Submission permanently deleted and logged.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete submission.');
                }
              }}
              onExportCsv={async () => {
                try {
                  await adminApi.downloadSubmissionsCsv(subFilters);
                  showToast('success', 'Sanitized CSV exported successfully.');
                } catch (err: any) {
                  showToast('error', err?.message || 'CSV export failed.');
                }
              }}
              onExportJson={async () => {
                try {
                  await adminApi.downloadSubmissionsJson(subFilters);
                  showToast('success', 'JSON backup exported successfully.');
                } catch (err: any) {
                  showToast('error', err?.message || 'JSON backup failed.');
                }
              }}
            />
          )}

          {activeModule === 'forms' && (
            <AdminFormStudio
              forms={forms}
              loading={forms.length === 0}
              onSaveForm={async (id, patch) => {
                try {
                  const res = await adminApi.updateForm(id, patch);
                  setForms((prev) => prev.map((f) => (f.id === id ? res.form : f)));
                  notifyPublicRefresh();
                  showToast(
                    'success',
                    `Published live updates for ${res.form.titleEn} (${res.form.isOpen ? 'Open' : 'Paused'}).`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save form definition.');
                }
              }}
            />
          )}

          {activeModule === 'campaigns' && (
            <AdminCampaigns
              campaigns={campaigns}
              districts={districts}
              forms={forms}
              onSaveCampaign={async (cmp) => {
                try {
                  const saved = await adminApi.saveCampaign(cmp);
                  const res = await adminApi.getCampaigns();
                  setCampaigns(res.campaigns);
                  notifyPublicRefresh();
                  showToast(
                    'success',
                    `Campaign "${saved.campaign.titleEn}" (${saved.campaign.campaignCode}) published with ${saved.campaign.roles.length} frontend roles.`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save campaign.');
                }
              }}
              onDeleteCampaign={async (id) => {
                try {
                  await adminApi.deleteCampaign(id);
                  setCampaigns((prev) => prev.filter((c) => c.id !== id));
                  notifyPublicRefresh();
                  showToast('success', 'Campaign deleted.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete campaign.');
                }
              }}
            />
          )}

          {activeModule === 'events' && (
            <AdminEventsView
              events={events}
              onUploadMedia={adminApi.uploadMedia}
              onSaveEvent={async (ev) => {
                try {
                  await adminApi.saveEvent(ev);
                  const res = await adminApi.getEvents();
                  setEvents(res.events);
                  notifyPublicRefresh();
                  showToast('success', 'Event saved and synced.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save event.');
                }
              }}
              onDeleteEvent={async (id) => {
                try {
                  await adminApi.deleteEvent(id);
                  setEvents((prev) => prev.filter((e) => e.id !== id));
                  notifyPublicRefresh();
                  showToast('success', 'Event deleted.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete event.');
                }
              }}
            />
          )}

          {activeModule === 'districts' && (
            <AdminDistrictsView
              role={adminUser.role}
              districts={districts}
              onUploadMedia={adminApi.uploadMedia}
              onSaveDistrict={async (d) => {
                try {
                  await adminApi.saveDistrict(d);
                  const res = await adminApi.getDistricts();
                  setDistricts(res.districts);
                  notifyPublicRefresh();
                  showToast('success', 'District record saved.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save district.');
                }
              }}
              onDeleteDistrict={async (slug) => {
                try {
                  await adminApi.deleteDistrict(slug);
                  setDistricts((prev) => prev.filter((d) => d.slug !== slug));
                  notifyPublicRefresh();
                  showToast('success', 'District removed.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete district.');
                }
              }}
            />
          )}

          {activeModule === 'projects' && (
            <AdminProjectsImpactView
              role={adminUser.role}
              projects={projects}
              impactMetrics={impactMetrics}
              onUploadMedia={adminApi.uploadMedia}
              onSaveProject={async (p) => {
                try {
                  await adminApi.saveProject(p);
                  const res = await adminApi.getProjectsAndImpact();
                  setProjects(res.projects);
                  setImpactMetrics(res.impactMetrics);
                  notifyPublicRefresh();
                  showToast('success', 'Project saved.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save project.');
                }
              }}
              onDeleteProject={async (id) => {
                try {
                  await adminApi.deleteProject(id);
                  setProjects((prev) => prev.filter((p) => p.id !== id));
                  notifyPublicRefresh();
                  showToast('success', 'Project deleted.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete project.');
                }
              }}
              onSaveMetric={async (metricKey, patch) => {
                try {
                  const res = await adminApi.updateImpactMetric(metricKey, patch);
                  setImpactMetrics((prev) =>
                    prev.map((m) => (m.metricKey === metricKey ? res.metric : m))
                  );
                  notifyPublicRefresh();
                  showToast(
                    'success',
                    `Verified counter "${res.metric.labelEn}" updated to ${res.metric.verifiedValue}.`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to update verified metric.');
                }
              }}
            />
          )}

          {activeModule === 'content' && (
            <AdminContentView
              items={contentItems}
              onUploadMedia={adminApi.uploadMedia}
              onSaveItem={async (item) => {
                try {
                  await adminApi.saveContent(item);
                  const res = await adminApi.getContent();
                  setContentItems(res.items);
                  notifyPublicRefresh();
                  showToast('success', 'Content entry saved.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save content.');
                }
              }}
              onDeleteItem={async (id) => {
                try {
                  await adminApi.deleteContent(id);
                  setContentItems((prev) => prev.filter((i) => i.id !== id));
                  notifyPublicRefresh();
                  showToast('success', 'Content entry deleted.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete content.');
                }
              }}
            />
          )}

          {activeModule === 'payments' && (
            <AdminPayments
              transactions={paymentData.transactions}
              summary={paymentData.summary}
              gatewayConfig={paymentData.gatewayConfig}
              loading={paymentsLoading}
              filters={paymentFilters}
              onChangeFilters={(patch) =>
                setPaymentFilters((prev) => ({ ...prev, ...patch }))
              }
              onExportCsv={async () => {
                try {
                  await adminApi.downloadPaymentsCsv(paymentFilters);
                  showToast('success', 'Payment reconciliation CSV exported.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Payments CSV export failed.');
                }
              }}
            />
          )}

          {activeModule === 'donations' && (
            <AdminDonationsView
              reports={donationReports}
              csrProposals={csrProposals}
              onUploadMedia={adminApi.uploadMedia}
              onSaveReport={async (r) => {
                try {
                  await adminApi.saveDonation(r);
                  const res = await adminApi.getDonations();
                  setDonationReports(res.reports);
                  showToast('success', 'Donation transparency report saved.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save report.');
                }
              }}
              onDeleteReport={async (id) => {
                try {
                  await adminApi.deleteDonation(id);
                  setDonationReports((prev) => prev.filter((r) => r.id !== id));
                  showToast('success', 'Donation report removed.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete report.');
                }
              }}
              onSaveCsrProposal={async (p) => {
                try {
                  await adminApi.saveCsrProposal(p);
                  const res = await adminApi.getCsrProposals();
                  setCsrProposals(res.proposals);
                  notifyPublicRefresh();
                  showToast('success', 'CSR project proposal saved and synced.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save CSR proposal.');
                }
              }}
              onDeleteCsrProposal={async (id) => {
                try {
                  await adminApi.deleteCsrProposal(id);
                  setCsrProposals((prev) => prev.filter((p) => p.id !== id));
                  notifyPublicRefresh();
                  showToast('success', 'CSR proposal removed.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete CSR proposal.');
                }
              }}
            />
          )}

          {activeModule === 'governance' && (
            <AdminSiteGovernanceView
              governance={governance}
              onUploadMedia={adminApi.uploadMedia}
              onSaveGovernance={async (patch) => {
                try {
                  const res = await adminApi.saveGovernance(patch);
                  setGovernance(res.governance);
                  notifyPublicRefresh();
                  showToast('success', 'Site & legal governance controls saved.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save governance settings.');
                }
              }}
            />
          )}

          {activeModule === 'team' && (
            <AdminTeamView
              currentUserId={adminUser.id}
              team={teamMembers}
              districts={districts}
              onSaveMember={async (member) => {
                try {
                  await adminApi.saveTeamMember(member);
                  const res = await adminApi.getTeam();
                  setTeamMembers(res.users);
                  showToast(
                    'success',
                    `Authorized ${member.email} as ${ROLE_LABELS[member.role]}.`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save team member.');
                }
              }}
              onDeleteMember={async (id) => {
                try {
                  await adminApi.deleteTeamMember(id);
                  setTeamMembers((prev) => prev.filter((m) => m.id !== id));
                  showToast('success', 'Team member removed.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to remove team member.');
                }
              }}
            />
          )}

          {activeModule === 'audit' && <AdminAuditLogView logs={auditLogs} />}
        </main>
      </div>
    </div>
  );
}
