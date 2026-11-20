import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Inbox,
  MapPin,
  Search,
} from 'lucide-react';
import type { AdminOverviewPayload, AdminSubmissionRecord } from './types';
import type { TimeframeKey } from '../utils/adminLogic';

interface AdminOverviewProps {
  data: AdminOverviewPayload | null;
  loading: boolean;
  timeframe: TimeframeKey;
  canViewSubmissions: boolean;
  onChangeTimeframe: (tf: TimeframeKey) => void;
  onFilterByFormType: (formType: string) => void;
  onInspectSubmission: (record: AdminSubmissionRecord) => void;
  onGoToSubmissions: () => void;
}

const TIMEFRAMES: { key: TimeframeKey; label: string }[] = [
  { key: '1d', label: '1d' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '16m', label: '16m' },
  { key: 'max', label: 'Max' },
];

function StatusIndicator({ status }: { status: string }) {
  const tone =
    status === 'Approved'
      ? 'text-emerald-700'
      : status === 'Rejected'
      ? 'text-red-700'
      : 'text-amber-700';

  return <span className={`text-xs font-semibold ${tone}`}>{status}</span>;
}

export function AdminOverview({
  data,
  loading,
  timeframe,
  canViewSubmissions,
  onChangeTimeframe,
  onFilterByFormType,
  onInspectSubmission,
  onGoToSubmissions,
}: AdminOverviewProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [recentSearch, setRecentSearch] = useState('');

  const chartGeometry = useMemo(() => {
    const series = data?.series ?? [];
    const width = 680;
    const height = 220;
    const padLeft = 32;
    const padRight = 18;
    const padTop = 18;
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
      return { ...pt, x, y };
    });

    if (coords.length === 0) {
      return { width, height, padLeft, padTop, plotH, maxCount, coords, linePath: '', areaPath: '' };
    }

    // Smooth cubic bezier curve through points
    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.x + p1.x) / 2;
      linePath += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const baseY = padTop + plotH;
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`;

    return { width, height, padLeft, padTop, plotH, maxCount, coords, linePath, areaPath };
  }, [data?.series]);

  const filteredRecent = useMemo(() => {
    const list = data?.recentSubmissions ?? [];
    const q = recentSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.applicationId.toLowerCase().includes(q) ||
        r.applicantName.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.formType.toLowerCase().includes(q)
    );
  }, [data?.recentSubmissions, recentSearch]);

  if (loading && !data) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-[#E2EAE4] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7 h-80 rounded-2xl bg-white border border-[#E2EAE4] animate-pulse" />
          <div className="xl:col-span-5 h-80 rounded-2xl bg-white border border-[#E2EAE4] animate-pulse" />
        </div>
      </div>
    );
  }

  const kpis = data?.kpis;
  const maxFormCount = Math.max(1, ...(data?.formBreakdown ?? []).map((f) => f.total));
  const activePoint =
    hoveredIdx !== null && chartGeometry.coords[hoveredIdx]
      ? chartGeometry.coords[hoveredIdx]
      : chartGeometry.coords[chartGeometry.coords.length - 1] ?? null;

  return (
    <div className="space-y-6">
      {/* Row 1: 4 Saledash-inspired Crisp KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#55685C]">Total Form Submissions</span>
            <span className="w-8 h-8 rounded-xl bg-[#EDF5EE] text-[#144527] flex items-center justify-center">
              <Inbox className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#142119] tabular-nums">
              {canViewSubmissions ? (kpis?.totalSubmissions ?? 0).toLocaleString('en-IN') : '—'}
            </span>
            <span className="text-xs font-medium text-[#368737] tabular-nums">
              {kpis?.openFormsCount ?? 0}/{kpis?.totalFormsCount ?? 12} Forms Open
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#55685C]">Awaiting Review</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#142119] tabular-nums">
              {canViewSubmissions ? (kpis?.pendingReview ?? 0).toLocaleString('en-IN') : '—'}
            </span>
            <span className="text-xs font-medium text-amber-700">
              {canViewSubmissions ? 'Action queue' : 'PII Restricted'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#55685C]">Approved Applications</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#142119] tabular-nums">
              {canViewSubmissions ? (kpis?.approvedCount ?? 0).toLocaleString('en-IN') : '—'}
            </span>
            <span className="text-xs font-medium text-emerald-700 tabular-nums">
              {canViewSubmissions ? `${kpis?.approvalRate ?? 0}% rate` : 'Editor View'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#55685C]">Active Districts &amp; Drives</span>
            <span className="w-8 h-8 rounded-xl bg-[#EDF5EE] text-[#144527] flex items-center justify-center">
              <MapPin className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#142119] tabular-nums">
              {kpis?.activeDistricts ?? 5}
            </span>
            <span className="text-xs text-[#55685C] tabular-nums">
              {kpis?.totalProjects ?? 0} Projects · {kpis?.totalEvents ?? 0} Events
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Smooth Trend Analytics + 12-Form Type Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Smooth SVG Area/Line Chart (Saledash Style) */}
        <section className="xl:col-span-7 bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#142119]">
                Registration Intake Trend
              </h2>
              <p className="text-xs text-[#55685C] mt-0.5">
                {activePoint
                  ? `${activePoint.label} · ${activePoint.count} submissions (${activePoint.approved} approved)`
                  : 'Chronological activity across all active GOVEDA forms'}
              </p>
            </div>

            {/* Segmented Timeframe Filter Control */}
            <div
              role="group"
              aria-label="Analytics Timeframe"
              className="inline-flex items-center bg-[#F3F6F3] p-1 rounded-xl self-start sm:self-auto"
            >
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.key}
                  type="button"
                  onClick={() => onChangeTimeframe(tf.key)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    timeframe === tf.key
                      ? 'bg-white text-[#144527] shadow-2xs'
                      : 'text-[#55685C] hover:text-[#142119]'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
              className="w-full h-56 select-none"
              role="img"
              aria-label="Submissions trend chart"
            >
              <defs>
                <linearGradient id="govedaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#368737" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#368737" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartGeometry.padTop + chartGeometry.plotH * (1 - ratio);
                const val = Math.round(chartGeometry.maxCount * ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1={chartGeometry.padLeft}
                      y1={y}
                      x2={chartGeometry.width - 18}
                      y2={y}
                      stroke="#ECF1ED"
                      strokeDasharray="3 4"
                    />
                    <text
                      x={chartGeometry.padLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[#7C8F82] text-[10px] tabular-nums"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area + Curve */}
              {chartGeometry.areaPath && (
                <path d={chartGeometry.areaPath} fill="url(#govedaAreaGrad)" />
              )}
              {chartGeometry.linePath && (
                <path
                  d={chartGeometry.linePath}
                  fill="none"
                  stroke="#1B5A32"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Hover Guide + Points */}
              {chartGeometry.coords.map((pt, idx) => {
                const isSelected =
                  hoveredIdx === idx ||
                  (hoveredIdx === null && idx === chartGeometry.coords.length - 1);
                const showLabel =
                  chartGeometry.coords.length <= 8 ||
                  idx % 2 === 0 ||
                  idx === chartGeometry.coords.length - 1;
                return (
                  <g key={pt.key}>
                    {isSelected && (
                      <line
                        x1={pt.x}
                        y1={chartGeometry.padTop}
                        x2={pt.x}
                        y2={chartGeometry.padTop + chartGeometry.plotH}
                        stroke="#144527"
                        strokeOpacity="0.25"
                        strokeDasharray="3 3"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 5 : 3}
                      fill={isSelected ? '#144527' : '#ffffff'}
                      stroke="#1B5A32"
                      strokeWidth="2"
                    />
                    {/* Invisible generous hover hit target */}
                    <rect
                      x={pt.x - 20}
                      y={chartGeometry.padTop}
                      width={40}
                      height={chartGeometry.plotH + 24}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onClick={() => setHoveredIdx(idx)}
                    />
                    {showLabel && (
                      <text
                        x={pt.x}
                        y={chartGeometry.height - 8}
                        textAnchor="middle"
                        className="fill-[#6A7D70] text-[10px] tabular-nums"
                      >
                        {pt.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Dark Floating Tooltip (Matching Reference Dashboard) */}
              {activePoint && (
                <g
                  transform={`translate(${Math.min(
                    chartGeometry.width - 138,
                    Math.max(chartGeometry.padLeft + 6, activePoint.x - 62)
                  )}, ${Math.max(8, activePoint.y - 52)})`}
                >
                  <rect
                    width="124"
                    height="40"
                    rx="10"
                    fill="#142119"
                    fillOpacity="0.95"
                  />
                  <text x="12" y="17" className="fill-[#A7C4AE] text-[10px] font-medium">
                    {activePoint.label}
                  </text>
                  <text
                    x="12"
                    y="32"
                    className="fill-white text-[12px] font-bold tabular-nums"
                  >
                    {activePoint.count} total · {activePoint.approved} ok
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* District Distribution Footer */}
          {data && data.districtBreakdown.length > 0 && (
            <div className="pt-3 border-t border-[#EDF2EE] flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#55685C]">
              <span className="font-semibold text-[#142119]">Top Districts:</span>
              {data.districtBreakdown.slice(0, 5).map((d) => (
                <span key={d.district} className="tabular-nums">
                  {d.district} <strong className="text-[#144527]">{d.count}</strong>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Right: Complete 12-Form Type Breakdown (Click to Filter!) */}
        <section className="xl:col-span-5 bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#142119]">
                Submissions by Form Type (12 Forms)
              </h2>
              <p className="text-xs text-[#55685C] mt-0.5">
                Click any category to inspect its applicants
              </p>
            </div>
            <FileSpreadsheet className="w-4 h-4 text-[#368737] shrink-0" aria-hidden="true" />
          </div>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {(data?.formBreakdown ?? []).map((row) => {
              const pct = Math.round((row.total / maxFormCount) * 100);
              const cleanTitle = row.titleEn.replace(/^\d+\.\s*/, '');
              return (
                <button
                  key={row.formType}
                  type="button"
                  disabled={!canViewSubmissions}
                  onClick={() => onFilterByFormType(row.formType)}
                  className="w-full text-left group p-2 rounded-xl hover:bg-[#F4F8F4] disabled:cursor-default transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] font-semibold text-[#368737] w-6 shrink-0 tabular-nums">
                        {row.formNumber <= 12
                          ? `#${String(row.formNumber).padStart(2, '0')}`
                          : 'CNT'}
                      </span>
                      <span className="font-medium text-[#142119] truncate group-hover:text-[#144527]">
                        {cleanTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 tabular-nums text-[11px]">
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
                      className="h-full rounded-full bg-[#368737] transition-all duration-300"
                      style={{ width: `${row.total > 0 ? Math.max(8, pct) : 0}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Row 3: Recent Submissions Table (Saledash Style) */}
      {canViewSubmissions ? (
        <section className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden">
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDF2EE]">
            <div>
              <h2 className="text-base font-bold text-[#142119]">
                Recent Applications Queue
              </h2>
              <p className="text-xs text-[#55685C] mt-0.5">
                Latest submissions received across all 12 dedicated forms
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search
                  className="w-3.5 h-3.5 text-[#7C8F82] absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={recentSearch}
                  onChange={(e) => setRecentSearch(e.target.value)}
                  placeholder="Quick filter ID or name..."
                  aria-label="Filter recent applications"
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/40 w-48 sm:w-56"
                />
              </div>
              <button
                type="button"
                onClick={onGoToSubmissions}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Open All</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {filteredRecent.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#55685C]">
              No matching recent submissions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EDF2EE] bg-[#FAFBF8] text-[11px] font-semibold text-[#55685C]">
                    <th className="py-3 px-5">Application ID</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Form Category</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F4F1] text-xs">
                  {filteredRecent.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onInspectSubmission(row)}
                      className="hover:bg-[#F7FAF7] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-5 font-mono font-semibold text-[#144527] tabular-nums whitespace-nowrap">
                        {row.applicationId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#142119]">{row.applicantName}</div>
                        <div className="text-[11px] text-[#6B7E71] truncate max-w-[200px]">
                          {row.villageOrOrg}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#2A3A30] whitespace-nowrap">
                        {row.formType}
                      </td>
                      <td className="py-3 px-4 text-[#2A3A30] whitespace-nowrap">
                        {row.district}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusIndicator status={row.status} />
                      </td>
                      <td className="py-3 px-5 text-right font-mono text-[#6B7E71] tabular-nums whitespace-nowrap">
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
        <section className="bg-white rounded-2xl border border-[#E2EAE4] p-6 text-sm text-[#55685C]">
          <p className="font-semibold text-[#142119]">Content Editor Scope Active</p>
          <p className="text-xs mt-1 leading-relaxed">
            Personal applicant submissions are isolated from Content Editor accounts for strict privacy compliance. Use the left navigation to manage Harit Marathon Events, News, Training Articles, Harit Bharat Samvad Magazine, and Gallery media.
          </p>
        </section>
      )}
    </div>
  );
}
