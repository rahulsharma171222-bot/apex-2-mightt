import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Compass,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Flag,
  FolderKanban,
  GitBranch,
  Inbox,
  IndianRupee,
  Printer,
  Recycle,
  Search,
  SlidersHorizontal,
  Trophy,
  UserPlus,
} from 'lucide-react';
import type {
  AdminCampaignRecord,
  AdminOverviewPayload,
  AdminSubmissionRecord,
  MissionAdminConfig,
  ProgrammeType,
  StaticPageRecord,
  UnifiedProgrammeRecord,
  WasteActivityRecord,
} from './types';
import {
  summarizeWasteRecords,
  type AdminModuleKey,
  type TimeframeKey,
} from '../utils/adminLogic';

interface AdminOverviewProps {
  data: AdminOverviewPayload | null;
  loading: boolean;
  timeframe: TimeframeKey;
  canViewSubmissions: boolean;
  campaigns: AdminCampaignRecord[];
  wasteRecords: WasteActivityRecord[];
  staticPages: StaticPageRecord[];
  missionConfigs: MissionAdminConfig[];
  programmes?: UnifiedProgrammeRecord[];
  totalPaymentsInr: number;
  verifiedPaymentsCount: number;
  onChangeTimeframe: (tf: TimeframeKey) => void;
  onFilterByFormType: (formType: string) => void;
  onInspectSubmission: (record: AdminSubmissionRecord) => void;
  onGoToSubmissions: () => void;
  onNavigateModule: (mod: AdminModuleKey) => void;
  onQuickCreateProgramme?: (type: ProgrammeType) => void;
  onExportCsv: () => Promise<void>;
  onExportJson: () => Promise<void>;
}

const TIMEFRAMES: { key: TimeframeKey; label: string }[] = [
  { key: '1d', label: '1d' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '16m', label: '16m' },
  { key: 'max', label: 'Max' },
];

function StatusText({ status }: { status: string }) {
  const tone =
    status === 'Approved'
      ? 'text-emerald-700'
      : status === 'Rejected'
      ? 'text-red-700'
      : 'text-amber-700';
  return <span className={`text-xs font-semibold ${tone}`}>{status}</span>;
}

function RadialGauge({
  percent,
  label,
  sublabel,
  strokeColor,
  trackColor,
}: {
  percent: number;
  label: string;
  sublabel: string;
  strokeColor: string;
  trackColor: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (clamped / 100) * circ;

  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <div className="relative w-[72px] h-[72px] flex items-center justify-center">
        <svg className="w-[72px] h-[72px] -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth="6.5"
          />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="admin-ring-progress"
          />
        </svg>
        <span className="absolute text-sm font-bold text-[#142119] tabular-nums">
          {clamped}%
        </span>
      </div>
      <div>
        <p className="text-[11px] font-bold text-[#142119] leading-tight">{label}</p>
        <p className="text-[10px] text-[#6B7E71] mt-0.5 tabular-nums">{sublabel}</p>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = String(name || 'G').trim().split(/\s+/);
  return ((parts[0]?.[0] || 'G') + (parts[1]?.[0] || '')).toUpperCase();
}

export function AdminOverview({
  data,
  loading,
  timeframe,
  canViewSubmissions,
  campaigns,
  wasteRecords,
  staticPages,
  missionConfigs,
  programmes = [],
  totalPaymentsInr,
  verifiedPaymentsCount,
  onChangeTimeframe,
  onFilterByFormType,
  onInspectSubmission,
  onGoToSubmissions,
  onNavigateModule,
  onQuickCreateProgramme,
  onExportCsv,
  onExportJson,
}: AdminOverviewProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredGrowthIdx, setHoveredGrowthIdx] = useState<number | null>(null);
  const [recentSearch, setRecentSearch] = useState('');
  const [recentStatusFilter, setRecentStatusFilter] = useState<string>('all');

  const wasteSummary = useMemo(() => summarizeWasteRecords(wasteRecords), [wasteRecords]);

  // Chart 1: Smooth Dual-Series Spline (Total Submissions vs Approved)
  const intakeChart = useMemo(() => {
    const series = data?.series ?? [];
    const width = 640;
    const height = 228;
    const padLeft = 34;
    const padRight = 18;
    const padTop = 20;
    const padBottom = 30;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const maxCount = Math.max(4, ...series.map((p) => p.count));
    const coords = series.map((pt, idx) => {
      const x =
        series.length <= 1
          ? padLeft + plotW / 2
          : padLeft + (idx / (series.length - 1)) * plotW;
      const y = padTop + plotH - (pt.count / maxCount) * plotH;
      const yApproved = padTop + plotH - (pt.approved / maxCount) * plotH;
      return { ...pt, x, y, yApproved };
    });

    const buildSmoothPath = (pts: { x: number; y: number }[]) => {
      if (pts.length === 0) return '';
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const cx = (p0.x + p1.x) / 2;
        path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
      }
      return path;
    };

    const totalPath = buildSmoothPath(coords.map((c) => ({ x: c.x, y: c.y })));
    const approvedPath = buildSmoothPath(coords.map((c) => ({ x: c.x, y: c.yApproved })));
    const baseY = padTop + plotH;
    const areaPath =
      coords.length > 0
        ? `${totalPath} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`
        : '';

    return {
      width,
      height,
      padLeft,
      padTop,
      plotH,
      maxCount,
      coords,
      totalPath,
      approvedPath,
      areaPath,
    };
  }, [data?.series]);

  // Chart 2: Smooth Cumulative Growth Sweep Profile (Screenshot 1799 Right Chart)
  const growthChart = useMemo(() => {
    const series = data?.series ?? [];
    const width = 420;
    const height = 190;
    const padLeft = 32;
    const padRight = 14;
    const padTop = 18;
    const padBottom = 28;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    let running = 0;
    const cumulative = series.map((pt) => {
      running += pt.count;
      return { label: pt.label, key: pt.key, total: running, delta: pt.count };
    });

    const maxVal = Math.max(5, ...cumulative.map((c) => c.total));
    const coords = cumulative.map((pt, idx) => {
      const x =
        cumulative.length <= 1
          ? padLeft + plotW / 2
          : padLeft + (idx / (cumulative.length - 1)) * plotW;
      const y = padTop + plotH - (pt.total / maxVal) * plotH;
      return { ...pt, x, y };
    });

    let linePath = '';
    if (coords.length > 0) {
      linePath = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i];
        const p1 = coords[i + 1];
        const cx = (p0.x + p1.x) / 2;
        linePath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
      }
    }
    const baseY = padTop + plotH;
    const areaPath =
      coords.length > 0
        ? `${linePath} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`
        : '';

    return { width, height, padLeft, padTop, plotH, maxVal, coords, linePath, areaPath };
  }, [data?.series]);

  const filteredRecent = useMemo(() => {
    const list = data?.recentSubmissions ?? [];
    const q = recentSearch.trim().toLowerCase();
    return list.filter((r) => {
      if (recentStatusFilter !== 'all' && r.status !== recentStatusFilter) return false;
      if (!q) return true;
      return (
        r.applicationId.toLowerCase().includes(q) ||
        r.applicantName.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.formType.toLowerCase().includes(q)
      );
    });
  }, [data?.recentSubmissions, recentSearch, recentStatusFilter]);

  if (loading && !data) {
    return (
      <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard overview">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 admin-card animate-pulse" />
            ))}
          </div>
          <div className="xl:col-span-4 h-32 admin-card animate-pulse" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7 h-80 admin-card animate-pulse" />
          <div className="xl:col-span-5 h-80 admin-card animate-pulse" />
        </div>
      </div>
    );
  }

  const kpis = data?.kpis;
  const maxFormCount = Math.max(1, ...(data?.formBreakdown ?? []).map((f) => f.total));
  const activePoint =
    hoveredIdx !== null && intakeChart.coords[hoveredIdx]
      ? intakeChart.coords[hoveredIdx]
      : intakeChart.coords[intakeChart.coords.length - 1] ?? null;

  const activeGrowthPoint =
    hoveredGrowthIdx !== null && growthChart.coords[hoveredGrowthIdx]
      ? growthChart.coords[hoveredGrowthIdx]
      : growthChart.coords[growthChart.coords.length - 1] ?? null;

  const openFormsPct =
    kpis && kpis.totalFormsCount > 0
      ? Math.round((kpis.openFormsCount / kpis.totalFormsCount) * 100)
      : 100;
  const verifiedWastePct =
    wasteSummary.totalRecords > 0
      ? Math.round((wasteSummary.verifiedRecordsCount / wasteSummary.totalRecords) * 100)
      : 0;
  const publishedPagesCount = staticPages.filter((p) => p.status === 'Published').length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === 'Active').length;

  const publishedProgrammesCount = programmes.filter(
    (p) => p.publicationStatus === 'Published'
  ).length;

  const QUICK_ACTIONS: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    target: AdminModuleKey;
    primary?: boolean;
    createProgrammeType?: ProgrammeType;
  }[] = [
    {
      label: 'Create Programme',
      icon: GitBranch,
      target: 'programmes',
      primary: true,
      createProgrammeType: 'project',
    },
    { label: 'Create Campaign', icon: Flag, target: 'campaigns' },
    { label: 'Add Project', icon: FolderKanban, target: 'projects' },
    { label: 'Create Event', icon: Trophy, target: 'events' },
    { label: 'Form Builder', icon: SlidersHorizontal, target: 'forms' },
    { label: 'Publish News', icon: FileText, target: 'content' },
    { label: 'Add Board Member', icon: UserPlus, target: 'board' },
    { label: 'Log Waste Activity', icon: Recycle, target: 'waste' },
  ];

  return (
    <div className="space-y-5">
      {/* ROW 1: Blueprint KPI Cards (8 cols, Screenshot 1800 Medallions) + Performance Donut Rings (4 cols, Screenshot 1799) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Applications */}
          <button
            type="button"
            onClick={() => onNavigateModule('submissions')}
            className="admin-card admin-card-interactive p-4 text-left flex flex-col justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Inbox className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-semibold text-amber-700 tabular-nums">
                {canViewSubmissions ? `${kpis?.pendingReview ?? 0} pending` : 'Restricted'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#5C6F63]">Applications</p>
              <p className="text-2xl font-bold text-[#142119] mt-0.5 tabular-nums">
                {canViewSubmissions && (kpis?.totalSubmissions ?? 0) > 0
                  ? (kpis?.totalSubmissions ?? 0).toLocaleString('en-IN')
                  : '—'}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1 tabular-nums">
                {kpis?.approvedCount ?? 0} verified &amp; approved
              </p>
            </div>
          </button>

          {/* Card 2: Verified Payments */}
          <button
            type="button"
            onClick={() => onNavigateModule('payments')}
            className="admin-card admin-card-interactive p-4 text-left flex flex-col justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tabular-nums">
                {verifiedPaymentsCount > 0 ? `${verifiedPaymentsCount} txn` : 'Sandbox'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#5C6F63]">Verified Payments</p>
              <p className="text-2xl font-bold text-[#142119] mt-0.5 tabular-nums">
                {totalPaymentsInr > 0
                  ? `₹${totalPaymentsInr.toLocaleString('en-IN')}`
                  : '—'}
              </p>
              <p className="text-[11px] text-[#5C6F63] mt-1">
                Razorpay verified ledger
              </p>
            </div>
          </button>

          {/* Card 3: Active Programmes, Campaigns & Projects */}
          <button
            type="button"
            onClick={() => onNavigateModule('programmes')}
            className="admin-card admin-card-interactive p-4 text-left flex flex-col justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <GitBranch className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-semibold text-[#144527] tabular-nums">
                {publishedProgrammesCount} live hub
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#5C6F63]">Unified Programmes</p>
              <p className="text-2xl font-bold text-[#142119] mt-0.5 tabular-nums">
                {programmes.length > 0
                  ? programmes.length
                  : activeCampaignsCount + (kpis?.totalProjects ?? 0) || '—'}
              </p>
              <p className="text-[11px] text-[#5C6F63] mt-1 tabular-nums">
                {activeCampaignsCount} campaigns · {kpis?.totalProjects ?? 0} projects
              </p>
            </div>
          </button>

          {/* Card 4: Missions & Focus Districts */}
          <button
            type="button"
            onClick={() => onNavigateModule('missions')}
            className="admin-card admin-card-interactive p-4 text-left flex flex-col justify-between gap-3 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="w-10 h-10 rounded-full bg-[#EDF6EE] text-[#144527] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-semibold text-[#368737] tabular-nums">
                {kpis?.activeDistricts ?? 5} districts
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-[#5C6F63]">Configured Missions</p>
              <p className="text-2xl font-bold text-[#142119] mt-0.5 tabular-nums">
                {missionConfigs.length || 10}
              </p>
              <p className="text-[11px] text-[#5C6F63] mt-1 tabular-nums">
                {publishedPagesCount} published subpages
              </p>
            </div>
          </button>
        </div>

        {/* Right 4 cols: Operations Performance Radial Gauges (Screenshot 1799 Top-Right) */}
        <section className="xl:col-span-4 admin-card p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#142119]">Operations Performance</h2>
              <p className="text-[11px] text-[#6B7E71]">Live ratios from verified records</p>
            </div>
            <span className="text-[11px] font-semibold text-[#144527] font-mono">
              {timeframe.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <RadialGauge
              percent={canViewSubmissions ? kpis?.approvalRate ?? 0 : 0}
              label="Approved"
              sublabel={`${kpis?.approvedCount ?? 0} forms`}
              strokeColor="#1B6B3B"
              trackColor="#E8F3EB"
            />
            <RadialGauge
              percent={openFormsPct}
              label="Forms Open"
              sublabel={`${kpis?.openFormsCount ?? 0}/${kpis?.totalFormsCount ?? 12}`}
              strokeColor="#D97706"
              trackColor="#FEF3C7"
            />
            <RadialGauge
              percent={verifiedWastePct}
              label="Waste Verified"
              sublabel={`${wasteSummary.verifiedTotalKg} kg`}
              strokeColor="#0F766E"
              trackColor="#CCFBF1"
            />
          </div>
        </section>
      </div>

      {/* ROW 2: Quick Actions Command Strip (Blueprint Page 4) */}
      <div className="admin-card px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#142119] pr-1">Quick Actions</span>
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_ACTIONS.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                type="button"
                onClick={() => {
                  if (act.createProgrammeType && onQuickCreateProgramme) {
                    onQuickCreateProgramme(act.createProgrammeType);
                  } else {
                    onNavigateModule(act.target);
                  }
                }}
                className={`${
                  act.primary ? 'admin-btn-primary' : 'admin-btn-secondary'
                } inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ROW 3: Dual Smooth Interactive Charts (Screenshot 1799 Center Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left (7 cols): Smooth Dual-Series Spline Analytics */}
        <section className="xl:col-span-7 admin-card p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#142119]">
                Registration &amp; Activity Analytics
              </h2>
              <div className="flex flex-wrap items-baseline gap-2.5 mt-1">
                <span className="text-2xl font-bold text-[#142119] tabular-nums">
                  {canViewSubmissions ? (kpis?.totalSubmissions ?? 0).toLocaleString('en-IN') : '—'}
                </span>
                <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                  {activePoint
                    ? `${activePoint.label}: ${activePoint.count} total · ${activePoint.approved} approved`
                    : 'Across all 12 active GOVEDA forms'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#55685C]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#144527] rounded-full inline-block" />
                  Total
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#6E9E7A] rounded-full inline-block" />
                  Approved
                </span>
              </div>

              <div
                role="group"
                aria-label="Analytics Timeframe"
                className="inline-flex items-center bg-[#F1F5F2] p-1 rounded-xl"
              >
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.key}
                    type="button"
                    onClick={() => onChangeTimeframe(tf.key)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      timeframe === tf.key
                        ? 'bg-white text-[#144527] shadow-xs'
                        : 'text-[#55685C] hover:text-[#142119]'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${intakeChart.width} ${intakeChart.height}`}
              className="w-full h-56 select-none"
              role="img"
              aria-label="Submissions and approval trend chart"
            >
              <defs>
                <linearGradient id="govedaSmoothArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B6B3B" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#1B6B3B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = intakeChart.padTop + intakeChart.plotH * (1 - ratio);
                const val = Math.round(intakeChart.maxCount * ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1={intakeChart.padLeft}
                      y1={y}
                      x2={intakeChart.width - 16}
                      y2={y}
                      stroke="#EEF3EF"
                      strokeDasharray="3 4"
                    />
                    <text
                      x={intakeChart.padLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[#7C8F82] text-[10px] tabular-nums"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {intakeChart.areaPath && (
                <path
                  d={intakeChart.areaPath}
                  fill="url(#govedaSmoothArea)"
                  className="admin-chart-path"
                />
              )}
              {intakeChart.approvedPath && (
                <path
                  d={intakeChart.approvedPath}
                  fill="none"
                  stroke="#7AA887"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  className="admin-chart-path"
                />
              )}
              {intakeChart.totalPath && (
                <path
                  d={intakeChart.totalPath}
                  fill="none"
                  stroke="#144527"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  className="admin-chart-path"
                />
              )}

              {intakeChart.coords.map((pt, idx) => {
                const isSelected =
                  hoveredIdx === idx ||
                  (hoveredIdx === null && idx === intakeChart.coords.length - 1);
                const showLabel =
                  intakeChart.coords.length <= 8 ||
                  idx % 2 === 0 ||
                  idx === intakeChart.coords.length - 1;
                return (
                  <g key={pt.key}>
                    {isSelected && (
                      <line
                        x1={pt.x}
                        y1={intakeChart.padTop}
                        x2={pt.x}
                        y2={intakeChart.padTop + intakeChart.plotH}
                        stroke="#144527"
                        strokeOpacity="0.22"
                        strokeWidth="1.2"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.yApproved}
                      r={isSelected ? 3.8 : 2}
                      fill="#7AA887"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 5.5 : 3}
                      fill={isSelected ? '#144527' : '#ffffff'}
                      stroke="#144527"
                      strokeWidth="2.2"
                    />
                    <rect
                      x={pt.x - 20}
                      y={intakeChart.padTop}
                      width={40}
                      height={intakeChart.plotH + 24}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onClick={() => setHoveredIdx(idx)}
                    />
                    {showLabel && (
                      <text
                        x={pt.x}
                        y={intakeChart.height - 8}
                        textAnchor="middle"
                        className="fill-[#6A7D70] text-[10px] tabular-nums"
                      >
                        {pt.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Elevated Dark Floating Tooltip */}
              {activePoint && (
                <g
                  transform={`translate(${Math.min(
                    intakeChart.width - 146,
                    Math.max(intakeChart.padLeft + 6, activePoint.x - 68)
                  )}, ${Math.max(6, activePoint.y - 54)})`}
                >
                  <rect width="136" height="44" rx="10" fill="#132219" fillOpacity="0.96" />
                  <text x="12" y="17" className="fill-[#9BBFA6] text-[10px] font-medium">
                    {activePoint.label}
                  </text>
                  <text x="12" y="34" className="fill-white text-[12px] font-bold tabular-nums">
                    {activePoint.count} total · {activePoint.approved} ok
                  </text>
                </g>
              )}
            </svg>
          </div>

          {data && data.districtBreakdown.length > 0 && (
            <div className="pt-3 border-t border-[#EFF4F0] flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#55685C]">
              <span className="font-semibold text-[#142119]">Active Districts:</span>
              {data.districtBreakdown.slice(0, 5).map((d) => (
                <span key={d.district} className="tabular-nums">
                  {d.district} <strong className="text-[#144527]">{d.count}</strong>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Right (5 cols): Cumulative Programme Growth Profile (Screenshot 1799 Smooth Sweeping Area) */}
        <section className="xl:col-span-5 admin-card p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#142119]">Programme Growth Profile</h2>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#142119] tabular-nums">
                  {wasteSummary.verifiedTotalKg.toLocaleString('en-IN')} kg
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  Verified Waste Handled
                </span>
              </div>
              <p className="text-[11px] text-[#6B7E71] mt-0.5">
                Cumulative intake momentum &amp; verified Clean India operations
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateModule('waste')}
              className="admin-btn-soft px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer whitespace-nowrap"
            >
              Waste Desk →
            </button>
          </div>

          <div className="relative w-full">
            <svg
              viewBox={`0 0 ${growthChart.width} ${growthChart.height}`}
              className="w-full h-44 select-none"
              role="img"
              aria-label="Cumulative intake growth area chart"
            >
              <defs>
                <linearGradient id="govedaSweepGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1B6B3B" stopOpacity="0.88" />
                  <stop offset="55%" stopColor="#2F8E4F" stopOpacity="0.68" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.82" />
                </linearGradient>
              </defs>

              {[0, 0.5, 1].map((ratio) => {
                const y = growthChart.padTop + growthChart.plotH * (1 - ratio);
                const val = Math.round(growthChart.maxVal * ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1={growthChart.padLeft}
                      y1={y}
                      x2={growthChart.width - 14}
                      y2={y}
                      stroke="#EEF3EF"
                      strokeDasharray="3 4"
                    />
                    <text
                      x={growthChart.padLeft - 7}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[#7C8F82] text-[10px] tabular-nums"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {growthChart.areaPath && (
                <path
                  d={growthChart.areaPath}
                  fill="url(#govedaSweepGrad)"
                  className="admin-chart-path"
                />
              )}
              {growthChart.linePath && (
                <path
                  d={growthChart.linePath}
                  fill="none"
                  stroke="#103820"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}

              {growthChart.coords.map((pt, idx) => {
                const active =
                  hoveredGrowthIdx === idx ||
                  (hoveredGrowthIdx === null && idx === growthChart.coords.length - 1);
                const showLabel =
                  idx === 0 ||
                  idx === Math.floor(growthChart.coords.length / 2) ||
                  idx === growthChart.coords.length - 1;
                return (
                  <g key={pt.key}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={active ? 4.5 : 0}
                      fill="#ffffff"
                      stroke="#103820"
                      strokeWidth="2"
                    />
                    <rect
                      x={pt.x - 16}
                      y={growthChart.padTop}
                      width={32}
                      height={growthChart.plotH + 22}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredGrowthIdx(idx)}
                      onClick={() => setHoveredGrowthIdx(idx)}
                    />
                    {showLabel && (
                      <text
                        x={pt.x}
                        y={growthChart.height - 8}
                        textAnchor="middle"
                        className="fill-[#6A7D70] text-[10px] tabular-nums"
                      >
                        {pt.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {activeGrowthPoint && (
                <g
                  transform={`translate(${Math.min(
                    growthChart.width - 118,
                    Math.max(growthChart.padLeft + 4, activeGrowthPoint.x - 52)
                  )}, ${Math.max(4, activeGrowthPoint.y - 36)})`}
                >
                  <rect width="118" height="28" rx="8" fill="#132219" fillOpacity="0.94" />
                  <text
                    x="10"
                    y="18"
                    className="fill-white text-[10.5px] font-bold tabular-nums"
                  >
                    {activeGrowthPoint.label}: {activeGrowthPoint.total} total
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EFF4F0] text-center">
            <div>
              <p className="text-sm font-bold text-[#142119] tabular-nums">
                {activeCampaignsCount}
              </p>
              <p className="text-[11px] text-[#6B7E71]">Active Campaigns</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#142119] tabular-nums">
                {wasteSummary.verifiedHouseholds}
              </p>
              <p className="text-[11px] text-[#6B7E71]">Eco-Households</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#142119] tabular-nums">
                {kpis?.publishedContentCount ?? 0}
              </p>
              <p className="text-[11px] text-[#6B7E71]">Published Posts</p>
            </div>
          </div>
        </section>
      </div>

      {/* ROW 4: 12-Form Type Breakdown (5 cols) + Recent Applications Queue (7 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: 12-Form Category Breakdown */}
        <section className="xl:col-span-5 admin-card p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#142119]">
                12-Form Submission Breakdown
              </h2>
              <p className="text-xs text-[#6B7E71] mt-0.5">
                Click any category to filter applications directly
              </p>
            </div>
            <FileSpreadsheet className="w-4 h-4 text-[#368737] shrink-0" aria-hidden="true" />
          </div>

          <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
            {(data?.formBreakdown ?? []).map((row) => {
              const pct = Math.round((row.total / maxFormCount) * 100);
              const cleanTitle = row.titleEn.replace(/^\d+\.\s*/, '');
              return (
                <button
                  key={row.formType}
                  type="button"
                  disabled={!canViewSubmissions}
                  onClick={() => onFilterByFormType(row.formType)}
                  className="w-full text-left group p-2 rounded-xl hover:bg-[#F3F8F4] disabled:cursor-default transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] font-bold text-[#368737] w-7 shrink-0 tabular-nums">
                        {row.formNumber <= 12
                          ? `#${String(row.formNumber).padStart(2, '0')}`
                          : 'CNT'}
                      </span>
                      <span className="font-medium text-[#142119] truncate group-hover:text-[#144527]">
                        {cleanTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 tabular-nums text-[11px]">
                      {!row.isOpen && (
                        <span className="text-red-600 font-semibold">Paused</span>
                      )}
                      <span className="font-bold text-[#142119]">{row.total}</span>
                      {row.pending > 0 && (
                        <span className="text-amber-700">({row.pending} new)</span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#EEF3EE] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#144527] to-[#368737] transition-all duration-500"
                      style={{ width: `${row.total > 0 ? Math.max(8, pct) : 0}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right: Recent Applications Queue (Screenshot 1800/1799 Table) */}
        {canViewSubmissions ? (
          <section className="xl:col-span-7 admin-card overflow-hidden flex flex-col">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFF4F0]">
              <div>
                <h2 className="text-sm font-bold text-[#142119]">
                  Recent Applications Queue
                </h2>
                <p className="text-xs text-[#6B7E71] mt-0.5">
                  Click any applicant to open full profile &amp; review controls
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search
                    className="w-3.5 h-3.5 text-[#7C8F82] absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={recentSearch}
                    onChange={(e) => setRecentSearch(e.target.value)}
                    placeholder="Filter ID or name..."
                    aria-label="Filter recent applications"
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#DCE5DE] bg-[#FAFBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/30 w-40 sm:w-44"
                  />
                </div>
                <select
                  aria-label="Filter recent status"
                  value={recentStatusFilter}
                  onChange={(e) => setRecentStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-[#DCE5DE] bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Preliminary Review">In Review</option>
                  <option value="Approved">Approved</option>
                </select>
                <button
                  type="button"
                  onClick={onExportCsv}
                  title="Export CSV"
                  aria-label="Export recent submissions CSV"
                  className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onExportJson}
                  title="Backup JSON"
                  aria-label="Export submissions JSON"
                  className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
                >
                  <FileJson className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  title="Print Dashboard Summary"
                  aria-label="Print dashboard summary"
                  className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onGoToSubmissions}
                  className="admin-btn-primary inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Open All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {filteredRecent.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#55685C]">
                No matching recent submissions found.
              </div>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EFF4F0] bg-[#FAFBF9] text-[11px] font-semibold text-[#55685C]">
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-3">ID &amp; Form</th>
                      <th className="py-3 px-3">District</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F2] text-xs">
                    {filteredRecent.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => onInspectSubmission(row)}
                        className="hover:bg-[#F5FAF6] transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full bg-[#EBF5EC] text-[#144527] font-bold text-[11px] flex items-center justify-center shrink-0">
                              {getInitials(row.applicantName)}
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-[#142119] truncate max-w-[155px]">
                                {row.applicantName}
                              </div>
                              <div className="text-[11px] text-[#6B7E71] truncate max-w-[155px]">
                                {row.villageOrOrg}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-mono font-semibold text-[#144527] text-[11px] tabular-nums">
                            {row.applicationId}
                          </div>
                          <div className="text-[11px] text-[#6B7E71]">{row.formType}</div>
                        </td>
                        <td className="py-3 px-3 text-[#2A3A30] whitespace-nowrap">
                          {row.district}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusText status={row.status} />
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[11px] text-[#6B7E71] tabular-nums whitespace-nowrap">
                          {String(row.submittedAt).slice(0, 10)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
          <section className="xl:col-span-7 admin-card p-6 text-sm text-[#55685C]">
            <p className="font-bold text-[#142119]">Content Editor Scope Active</p>
            <p className="text-xs mt-1.5 leading-relaxed">
              Personal applicant submissions are isolated from Content Editor accounts for strict privacy compliance. Use the left navigation to manage Homepage Sections, Pages, Missions, Events, News, Training, and Gallery media.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
