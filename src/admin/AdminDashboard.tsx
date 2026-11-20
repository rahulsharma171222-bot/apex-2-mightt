import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  CreditCard,
  FileText,
  Flag,
  FolderKanban,
  GitBranch,
  Globe,
  Handshake,
  Image as ImageIcon,
  Inbox,
  IndianRupee,
  LayoutDashboard,
  LayoutTemplate,
  MapPin,
  Menu,
  Newspaper,
  Recycle,
  RefreshCw,
  Settings,
  Shield,
  SlidersHorizontal,
  Trophy,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { GENERATED_ASSETS } from '../data/assets';
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
import {
  AdminHomepageSectionsView,
  AdminMissionsManagerView,
  AdminPagesNavView,
} from './AdminWebsiteStudio';
import {
  AdminBoardAdvisoryView,
  AdminSettingsBackupView,
  AdminWasteManagementView,
} from './AdminBoardWasteStudio';
import { AdminProgrammeHub } from './AdminProgrammeHub';
import { ApiError, adminApi } from './apiClient';
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
  AdminOverviewPayload,
  AdminPaymentTransaction,
  AdminProfile,
  AdminProjectRecord,
  AdminSiteGovernance,
  AdminSubmissionRecord,
  AdminTeamMember,
  HaritMitraNetworkNode,
  ProgrammeType,
} from './types';
import {
  ROLE_LABELS,
  type AdminModuleKey,
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

// Fixed Blueprint Sidebar Architecture (Admin_panel_450431ad.pdf §§1-10)
const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'Overview',
    items: [{ key: 'overview', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    groupLabel: 'Website Management',
    items: [
      { key: 'homepage', label: 'Homepage & Sections', icon: LayoutTemplate },
      { key: 'pages', label: 'Pages & Navigation', icon: FileText },
      { key: 'missions', label: 'Our Missions (10)', icon: Compass },
      { key: 'districts', label: 'Harit Rajasthan & Locations', icon: MapPin },
      { key: 'board', label: 'Board, Team & Advisory', icon: UserCheck },
      { key: 'gallery', label: 'Gallery & Media', icon: ImageIcon },
      { key: 'content', label: 'News, Magazine & Reports', icon: Newspaper },
    ],
  },
  {
    groupLabel: 'Programme Management',
    items: [
      { key: 'programmes', label: 'All Programmes', icon: GitBranch },
      { key: 'projects', label: 'Projects & Initiatives', icon: FolderKanban },
      { key: 'campaigns', label: 'Campaign Management', icon: Flag },
      { key: 'events', label: 'Events & Marathon', icon: Trophy },
      { key: 'waste', label: 'Waste Management', icon: Recycle },
      { key: 'training', label: 'Training & Knowledge', icon: BookOpen },
    ],
  },
  {
    groupLabel: 'Forms & Finance',
    items: [
      { key: 'forms', label: 'Form Builder', icon: SlidersHorizontal },
      { key: 'submissions', label: 'Registrations & Applications', icon: Inbox },
      { key: 'payments', label: 'Razorpay & Payments', icon: CreditCard },
      { key: 'donations', label: 'Donations & Receipts', icon: IndianRupee },
      { key: 'csr', label: 'CSR & Partnerships', icon: Handshake },
      { key: 'impact', label: 'Impact & Reports', icon: BarChart3 },
    ],
  },
  {
    groupLabel: 'System Settings',
    items: [
      { key: 'governance', label: 'Language & SEO', icon: Globe },
      { key: 'team', label: 'Users & Permissions', icon: Users },
      { key: 'audit', label: 'Activity Log', icon: Shield },
      { key: 'settings', label: 'Settings, Backup & Security', icon: Settings },
    ],
  },
];

const MODULE_TITLES: Record<AdminModuleKey, string> = {
  overview: 'Control Centre Dashboard',
  homepage: 'Homepage & Sections',
  pages: 'Pages & Navigation',
  missions: 'Our Missions (10 Pillars)',
  districts: 'Harit Rajasthan & Locations',
  board: 'Board, Team & Advisory',
  gallery: 'Gallery & Media Library',
  content: 'News, Magazine & Reports',
  programmes: 'All Programmes & Hierarchy',
  projects: 'Projects & Initiatives',
  campaigns: 'Campaign Management',
  events: 'Events & Marathon',
  waste: 'Waste Management',
  training: 'Training & Knowledge',
  forms: 'Form Builder (12 Forms)',
  submissions: 'Registrations & Applications',
  payments: 'Razorpay & Payments',
  donations: 'Donations & Receipts',
  csr: 'CSR & Partnerships',
  impact: 'Impact & Reports',
  governance: 'Language, SEO & Legal Controls',
  team: 'Users & Permissions',
  audit: 'Activity Log',
  settings: 'Settings, Backup & Security',
};

function getGreeting(): string {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
}

export function AdminDashboard({ onExitAdmin, onDataMutated }: AdminDashboardProps) {
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [allowedModules, setAllowedModules] = useState<AdminModuleKey[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

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

  const [createProgrammeType, setCreateProgrammeType] = useState<ProgrammeType | null>(null);
  const [blueprint, setBlueprint] = useState<AdminBlueprintPayload>({
    homepageSections: [],
    staticPages: [],
    missionConfigs: [],
    wasteRecords: [],
    wastePartners: [],
    programmes: [],
  });

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
    const t = setTimeout(() => setToast(null), 4200);
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

  const loadBlueprint = useCallback(async () => {
    if (!adminUser) return;
    try {
      const bp = await adminApi.getBlueprint();
      setBlueprint(bp);
    } catch {
      // Non-blocking
    }
  }, [adminUser]);

  const loadOverview = useCallback(
    async (tf: TimeframeKey = timeframe) => {
      if (!adminUser) return;
      setOverviewLoading(true);
      try {
        const [res, bp, cmpRes, payRes] = await Promise.all([
          adminApi.getOverview(tf),
          adminApi.getBlueprint().catch(() => null),
          allowedModules.includes('campaigns')
            ? adminApi.getCampaigns().catch(() => ({ campaigns: [] }))
            : Promise.resolve({ campaigns: [] }),
          allowedModules.includes('payments')
            ? adminApi.getPayments({}).catch(() => null)
            : Promise.resolve(null),
        ]);
        setOverviewData(res);
        if (bp) setBlueprint(bp);
        if (cmpRes.campaigns) setCampaigns(cmpRes.campaigns);
        if (payRes) setPaymentData(payRes);
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to load dashboard overview.');
      } finally {
        setOverviewLoading(false);
      }
    },
    [adminUser, timeframe, allowedModules, showToast]
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
        } else if (mod === 'homepage' || mod === 'waste') {
          await loadBlueprint();
        } else if (mod === 'programmes') {
          await Promise.all([
            loadBlueprint(),
            loadFormsAndDistricts(),
            canViewSubmissions ? loadSubmissions(subFilters) : Promise.resolve(),
          ]);
        } else if (mod === 'pages') {
          await Promise.all([loadBlueprint(), loadFormsAndDistricts()]);
        } else if (mod === 'missions') {
          const [, cmpRes, projRes, evRes] = await Promise.all([
            loadBlueprint(),
            allowedModules.includes('campaigns')
              ? adminApi.getCampaigns().catch(() => ({ campaigns: [] }))
              : Promise.resolve({ campaigns: [] }),
            allowedModules.includes('projects')
              ? adminApi.getProjectsAndImpact().catch(() => ({ projects: [], impactMetrics: [] }))
              : Promise.resolve({ projects: [], impactMetrics: [] }),
            allowedModules.includes('events')
              ? adminApi.getEvents().catch(() => ({ events: [] }))
              : Promise.resolve({ events: [] }),
            loadFormsAndDistricts(),
          ]);
          setCampaigns(cmpRes.campaigns);
          setProjects(projRes.projects);
          setEvents(evRes.events);
        } else if (mod === 'board' || mod === 'governance') {
          const res = await adminApi.getGovernance();
          setGovernance(res.governance);
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
        } else if (mod === 'projects' || mod === 'impact') {
          const res = await adminApi.getProjectsAndImpact();
          setProjects(res.projects);
          setImpactMetrics(res.impactMetrics);
        } else if (mod === 'content' || mod === 'gallery' || mod === 'training') {
          const res = await adminApi.getContent();
          setContentItems(res.items);
        } else if (mod === 'payments') {
          await loadPayments(paymentFilters);
        } else if (mod === 'donations' || mod === 'csr') {
          const [donRes, csrRes] = await Promise.all([
            adminApi.getDonations(),
            adminApi.getCsrProposals(),
          ]);
          setDonationReports(donRes.reports);
          setCsrProposals(csrRes.proposals);
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
        } else if (mod === 'settings') {
          await loadBlueprint();
        }
      } catch (err: any) {
        showToast('error', err?.message || 'Failed to refresh workspace data.');
      }
    },
    [
      adminUser,
      timeframe,
      allowedModules,
      subFilters,
      paymentFilters,
      loadOverview,
      loadBlueprint,
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

  useEffect(() => {
    if (adminUser && activeModule === 'submissions') {
      const timer = setTimeout(() => {
        loadSubmissions(subFilters);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [subFilters, adminUser, activeModule]);

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
      <div className="min-h-dvh admin-canvas text-[#142119] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full admin-card p-7 space-y-4 text-center">
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
                  className="admin-btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={onExitAdmin}
                  className="admin-btn-secondary px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
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

  const handleExportBlueprintJson = () => {
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goveda-cms-blueprint-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Full CMS & Waste Blueprint JSON backup downloaded.');
  };

  const adminInitials = adminUser.displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Top Brand + Profile Card (Inspired by Dribbble Reference 1799) */}
      <div className="p-3.5 border-b border-[#EDF2EE] space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2 px-0.5">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img
                src={GENERATED_ASSETS.officialLogo}
                alt="GOVEDA Carbon & Climate India Foundation Official Seal"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-[#D9C89C] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-extrabold tracking-tight text-[#144527] leading-tight truncate">
                  GOVEDA<sup className="text-[9px] ml-0.5">®</sup>
                </p>
                <p className="text-[9.5px] font-semibold tracking-wider uppercase text-[#5C6F63] truncate">
                  Admin Control Centre
                </p>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl admin-btn-primary font-bold text-sm flex items-center justify-center mx-auto">
              G
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:inline-flex items-center justify-center w-7 h-7 rounded-lg admin-btn-secondary text-[#55685C] cursor-pointer shrink-0"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="rounded-xl bg-[#F5F9F6] border border-[#E5EFE7] p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#144527] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {adminInitials || 'GA'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#142119] truncate">
                  {adminUser.displayName}
                </p>
                <p className="text-[10.5px] text-[#55685C] truncate">
                  {ROLE_LABELS[adminUser.role]}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectModule('settings')}
              aria-label="Open System Settings"
              className="p-1.5 rounded-lg text-[#55685C] hover:bg-white hover:text-[#144527] transition-colors cursor-pointer shrink-0"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Fixed Blueprint Navigation Groups */}
      <nav
        aria-label="Admin Navigation"
        className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar"
      >
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((it) =>
            allowedModules.includes(it.key)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.groupLabel} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 pb-1 text-[10.5px] font-bold tracking-wider uppercase text-[#7C8F82]">
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
                    className={`admin-nav-btn w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      active
                        ? 'admin-nav-btn-active'
                        : 'text-[#364A3E] hover:bg-[#EDF5EE] hover:text-[#142119]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {!sidebarCollapsed && showCount && (
                      <span
                        className={`font-mono text-[10.5px] tabular-nums px-1.5 py-0.5 rounded-md ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-[#E5F2E7] text-[#144527]'
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

      {/* Bottom Return Control */}
      <div className="p-3 border-t border-[#EDF2EE] shrink-0">
        <button
          type="button"
          onClick={onExitAdmin}
          className="admin-btn-secondary w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          {!sidebarCollapsed && <span>Back to Public Website</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh admin-canvas text-[#142119] flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 bg-white/95 backdrop-blur-md border-r border-[#E4ECE6] sticky top-0 h-dvh transition-[width] duration-200 ${
          sidebarCollapsed ? 'w-[78px]' : 'w-[272px]'
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
              className="absolute right-3 top-4 w-8 h-8 rounded-lg admin-btn-secondary flex items-center justify-center text-[#55685C] z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </div>
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex-1 bg-[#0E1E14]/35 backdrop-blur-[1px]"
          />
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sleek Top Context Bar */}
        <header className="sticky top-0 z-30 bg-white/88 backdrop-blur-md border-b border-[#E4ECE6] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open admin navigation"
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl admin-btn-secondary text-[#142119] shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-[#6B7E71]">
                <span>GOVEDA Admin</span>
                <span aria-hidden="true">/</span>
                <span className="font-semibold text-[#144527] truncate">
                  {MODULE_TITLES[activeModule]}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-[#142119] truncate">
                {activeModule === 'overview'
                  ? `${getGreeting()}, ${adminUser.displayName}`
                  : MODULE_TITLES[activeModule]}
              </h1>
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
              className="admin-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            {canViewSubmissions && activeModule !== 'submissions' && (
              <button
                type="button"
                onClick={() => setActiveModule('submissions')}
                className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Review Forms</span>
              </button>
            )}
          </div>
        </header>

        {/* Smooth Toast Banner */}
        {toast && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <div
              role="status"
              className={`admin-view-enter rounded-xl border px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm ${
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

        {/* Active Module Viewport with Smooth Keyed Transition */}
        <main
          key={activeModule}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto admin-view-enter"
        >
          {activeModule === 'overview' && (
            <AdminOverview
              data={overviewData}
              loading={overviewLoading}
              timeframe={timeframe}
              canViewSubmissions={canViewSubmissions}
              campaigns={campaigns}
              wasteRecords={blueprint.wasteRecords}
              staticPages={blueprint.staticPages}
              missionConfigs={blueprint.missionConfigs}
              programmes={blueprint.programmes}
              totalPaymentsInr={paymentData.summary.totalCollectedInr}
              verifiedPaymentsCount={paymentData.summary.capturedCount}
              onChangeTimeframe={(tf) => {
                setTimeframe(tf);
                loadOverview(tf);
              }}
              onFilterByFormType={handleFilterFromOverview}
              onInspectSubmission={handleInspectFromOverview}
              onGoToSubmissions={() => setActiveModule('submissions')}
              onNavigateModule={handleSelectModule}
              onQuickCreateProgramme={(type) => {
                setCreateProgrammeType(type);
                handleSelectModule('programmes');
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

          {activeModule === 'homepage' && (
            <AdminHomepageSectionsView
              sections={blueprint.homepageSections}
              onSaveSections={async (sections) => {
                try {
                  const res = await adminApi.saveHomepageSections(sections);
                  setBlueprint((prev) => ({
                    ...prev,
                    homepageSections: res.homepageSections,
                  }));
                  notifyPublicRefresh();
                  showToast('success', 'Homepage section order & visibility published.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save homepage sections.');
                }
              }}
            />
          )}

          {activeModule === 'pages' && (
            <AdminPagesNavView
              pages={blueprint.staticPages}
              forms={forms}
              onSavePage={async (page) => {
                try {
                  const res = await adminApi.saveStaticPage(page);
                  setBlueprint((prev) => ({ ...prev, staticPages: res.staticPages }));
                  notifyPublicRefresh();
                  showToast('success', `Saved page "${res.page.titleEn}" (${res.page.status}).`);
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save static page.');
                }
              }}
              onDeletePage={async (id) => {
                try {
                  await adminApi.deleteStaticPage(id);
                  setBlueprint((prev) => ({
                    ...prev,
                    staticPages: prev.staticPages.filter((p) => p.id !== id),
                  }));
                  notifyPublicRefresh();
                  showToast('success', 'Static page removed.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete page.');
                }
              }}
            />
          )}

          {activeModule === 'missions' && (
            <AdminMissionsManagerView
              missions={blueprint.missionConfigs}
              campaigns={campaigns}
              projects={projects}
              events={events}
              forms={forms}
              onSaveMission={async (slug, patch) => {
                try {
                  const res = await adminApi.saveMissionConfig(slug, patch);
                  setBlueprint((prev) => ({
                    ...prev,
                    missionConfigs: res.missionConfigs,
                  }));
                  notifyPublicRefresh();
                  showToast(
                    'success',
                    `Updated Mission #${res.mission.number} — ${res.mission.titleEn}.`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save mission updates.');
                }
              }}
            />
          )}

          {activeModule === 'programmes' && (
            <AdminProgrammeHub
              programmes={blueprint.programmes}
              missions={blueprint.missionConfigs}
              forms={forms}
              submissions={submissions}
              initialCreateTrigger={createProgrammeType}
              onClearCreateTrigger={() => setCreateProgrammeType(null)}
              onSaveProgramme={async (payload) => {
                try {
                  const res = await adminApi.saveProgramme(payload);
                  setBlueprint((prev) => ({
                    ...prev,
                    programmes: res.programmes,
                  }));
                  notifyPublicRefresh();
                  showToast(
                    'success',
                    `Saved ${res.programme.type} "${res.programme.titleEn}" (${res.programme.programmeCode}) · ${res.programme.publicationStatus}.`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save programme.');
                }
              }}
              onDeleteProgramme={async (id) => {
                try {
                  const res = await adminApi.deleteProgramme(id);
                  setBlueprint((prev) => ({
                    ...prev,
                    programmes: res.programmes,
                  }));
                  notifyPublicRefresh();
                  showToast('success', 'Programme removed from central hub.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete programme.');
                }
              }}
            />
          )}

          {activeModule === 'board' && (
            <AdminBoardAdvisoryView
              governance={governance}
              founderMessage={blueprint.founderMessage}
              onUploadMedia={adminApi.uploadMedia}
              onSaveFounderMessage={async (patch) => {
                try {
                  const res = await adminApi.saveFounderMessage(patch);
                  setBlueprint((prev) => ({ ...prev, founderMessage: res.founderMessage }));
                  notifyPublicRefresh();
                  showToast('success', 'Founder message updated on About Us.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save founder message.');
                }
              }}
              onSaveRoster={async (leadershipRoster) => {
                try {
                  const res = await adminApi.saveGovernance({ leadershipRoster });
                  setGovernance(res.governance);
                  notifyPublicRefresh();
                  showToast('success', 'Board, Team & Advisory directory updated.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to update board roster.');
                }
              }}
            />
          )}

          {activeModule === 'waste' && (
            <AdminWasteManagementView
              records={blueprint.wasteRecords}
              partners={blueprint.wastePartners}
              onSaveRecord={async (rec) => {
                try {
                  const res = await adminApi.saveWasteRecord(rec);
                  setBlueprint((prev) => ({ ...prev, wasteRecords: res.wasteRecords }));
                  notifyPublicRefresh();
                  showToast(
                    'success',
                    `Saved waste record "${res.record.title}" (${res.record.quantity} ${res.record.unit} · ${res.record.verificationStatus}).`
                  );
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save waste record.');
                }
              }}
              onDeleteRecord={async (id) => {
                try {
                  await adminApi.deleteWasteRecord(id);
                  setBlueprint((prev) => ({
                    ...prev,
                    wasteRecords: prev.wasteRecords.filter((w) => w.id !== id),
                  }));
                  notifyPublicRefresh();
                  showToast('success', 'Waste activity record deleted.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete waste record.');
                }
              }}
              onSavePartner={async (partner) => {
                try {
                  const res = await adminApi.saveWastePartner(partner);
                  setBlueprint((prev) => ({
                    ...prev,
                    wastePartners: res.wastePartners,
                  }));
                  notifyPublicRefresh();
                  showToast('success', `Saved partner "${res.partner.name}".`);
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to save waste partner.');
                }
              }}
              onDeletePartner={async (id) => {
                try {
                  await adminApi.deleteWastePartner(id);
                  setBlueprint((prev) => ({
                    ...prev,
                    wastePartners: prev.wastePartners.filter((p) => p.id !== id),
                  }));
                  notifyPublicRefresh();
                  showToast('success', 'Waste partner removed.');
                } catch (err: any) {
                  showToast('error', err?.message || 'Unable to delete partner.');
                }
              }}
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
              programmes={blueprint.programmes}
              submissions={submissions}
              onOpenProgrammes={() => setActiveModule('programmes')}
              onOpenSubmissions={() => setActiveModule('submissions')}
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

          {(activeModule === 'projects' || activeModule === 'impact') && (
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

          {(activeModule === 'content' ||
            activeModule === 'gallery' ||
            activeModule === 'training') && (
            <AdminContentView
              items={contentItems}
              initialFilter={
                activeModule === 'gallery'
                  ? 'gallery'
                  : activeModule === 'training'
                  ? 'training'
                  : 'all'
              }
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

          {(activeModule === 'donations' || activeModule === 'csr') && (
            <AdminDonationsView
              reports={donationReports}
              csrProposals={csrProposals}
              initialSubTab={activeModule === 'donations' ? 'ledger' : 'csr'}
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

          {activeModule === 'settings' && (
            <AdminSettingsBackupView
              onExportSubmissionsCsv={async () => {
                await adminApi.downloadSubmissionsCsv({});
                showToast('success', 'All submissions CSV exported.');
              }}
              onExportSubmissionsJson={async () => {
                await adminApi.downloadSubmissionsJson({});
                showToast('success', 'All submissions JSON backup downloaded.');
              }}
              onExportPaymentsCsv={async () => {
                await adminApi.downloadPaymentsCsv({});
                showToast('success', 'Payments ledger CSV exported.');
              }}
              onExportBlueprintJson={handleExportBlueprintJson}
              onGoToGovernance={() => handleSelectModule('governance')}
              onGoToAudit={() => handleSelectModule('audit')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
