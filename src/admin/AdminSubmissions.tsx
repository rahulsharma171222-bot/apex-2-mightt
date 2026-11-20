import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileJson,
  GitBranch,
  KeyRound,
  Link2,
  MapPin,
  Phone,
  Search,
  Table2,
  Tag,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import type {
  AdminDistrictRecord,
  AdminFormDefinition,
  AdminSubmissionRecord,
  HaritMitraNetworkNode,
} from './types';
import {
  VALID_SUBMISSION_STATUSES,
  type AdminRole,
  type SubmissionStatus,
} from '../utils/adminLogic';
import { INDIA_STATES_DIRECTORY, findStateByNameOrSlug } from '../data/indiaLocations';

interface AdminSubmissionsProps {
  role: AdminRole;
  submissions: AdminSubmissionRecord[];
  forms: AdminFormDefinition[];
  districts: AdminDistrictRecord[];
  haritMitraNetwork: {
    nodes: HaritMitraNetworkNode[];
    unlinkedFarmers: AdminSubmissionRecord[];
    allHaritMitras: AdminSubmissionRecord[];
  } | null;
  loading: boolean;
  selectedFormType: string;
  selectedStatus: string;
  selectedDistrict: string;
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
  activeRecord: AdminSubmissionRecord | null;
  onChangeFilters: (next: {
    formType?: string;
    status?: string;
    district?: string;
    dateFrom?: string;
    dateTo?: string;
    q?: string;
  }) => void;
  onSelectRecord: (record: AdminSubmissionRecord | null) => void;
  onCreateRecord: (payload: {
    formType: string;
    applicantName: string;
    mobile: string;
    district: string;
    villageOrOrg: string;
    details?: string;
    status?: SubmissionStatus;
    adminNotes?: string;
    customFields?: Record<string, string>;
  }) => Promise<AdminSubmissionRecord | null>;
  onUpdateRecord: (
    id: number,
    patch: {
      status?: SubmissionStatus;
      adminNotes?: string;
      customFields?: Record<string, string>;
      generateReferralCode?: boolean;
      generateUniqueId?: boolean;
    },
    options?: { closeAfterSave?: boolean }
  ) => Promise<void>;
  onBulkUpdate: (ids: number[], status: SubmissionStatus) => Promise<void>;
  onDeleteRecord: (id: number) => Promise<void>;
  onExportCsv: () => Promise<void>;
  onExportJson: () => Promise<void>;
}

function statusClass(status: string): string {
  if (status === 'Approved') return 'text-emerald-700 font-semibold';
  if (status === 'Rejected') return 'text-red-700 font-semibold';
  if (status === 'Needs Follow-up') return 'text-blue-700 font-semibold';
  if (status === 'Field Verification Pending') return 'text-amber-800 font-semibold';
  return 'text-amber-700 font-semibold';
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return String(iso);
  return dt.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function toDatetimeLocalValue(dt: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(
    dt.getHours()
  )}:${pad(dt.getMinutes())}`;
}

function humanizeFieldKey(key: string): string {
  const known: Record<string, string> = {
    referralCode: 'Harit Mitra Referral ID',
    memberUniqueId: 'Unique Member ID',
    referredByHaritMitra: 'Referred By Harit Mitra',
    campaignCode: 'Campaign Unique ID',
    campaignTitle: 'Campaign Name',
    campaignRole: 'Selected Campaign Role',
    landSize: 'Total Landholding',
    irrigationSource: 'Irrigation Source',
    plantationModel: 'Plantation Model',
    saplingTarget: 'Proposed Saplings',
    qualification: 'Qualification',
    mobility: 'Field Mobility',
    weeklyHours: 'Weekly Availability',
    raceCategory: 'Marathon Category',
    tshirtSize: 'T-Shirt Size',
    pledgeTreeSpecies: 'Pledged Tree Species',
  };
  if (known[key]) return known[key];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function initialsOf(name: string): string {
  const parts = String(name || 'G')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function AdminSubmissions({
  role,
  submissions,
  forms,
  districts,
  haritMitraNetwork,
  loading,
  selectedFormType,
  selectedStatus,
  selectedDistrict,
  dateFrom,
  dateTo,
  searchQuery,
  activeRecord,
  onChangeFilters,
  onSelectRecord,
  onCreateRecord,
  onUpdateRecord,
  onBulkUpdate,
  onDeleteRecord,
  onExportCsv,
  onExportJson,
}: AdminSubmissionsProps) {
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<SubmissionStatus>('Under Preliminary Review');
  const [bulkBusy, setBulkBusy] = useState(false);

  // Tree view UI state
  const [treeSearch, setTreeSearch] = useState('');
  const [collapsedHmIds, setCollapsedHmIds] = useState<Record<number, boolean>>({});
  const [treeActionBusyId, setTreeActionBusyId] = useState<number | null>(null);

  // Profile Drawer navigation history (so clicking from HM -> Farmer -> back works smoothly)
  const [profileHistory, setProfileHistory] = useState<AdminSubmissionRecord[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Slide-over drawer state
  const [draftStatus, setDraftStatus] = useState<SubmissionStatus>('Submitted');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftAssignedHmCode, setDraftAssignedHmCode] = useState('');
  const [savingDrawer, setSavingDrawer] = useState(false);
  const [issuingId, setIssuingId] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Create Member + Auto Unique ID modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [newMember, setNewMember] = useState({
    formType: 'harit-mitra',
    applicantName: '',
    mobile: '',
    stateSlug: 'rajasthan',
    district: 'Bhilwara',
    villageOrOrg: '',
    referredByHaritMitra: '',
    details: '',
    status: 'Approved' as SubmissionStatus,
  });

  useEffect(() => {
    if (activeRecord) {
      setDraftStatus(activeRecord.status);
      setDraftNotes(activeRecord.adminNotes ?? '');
      setDraftAssignedHmCode(
        String(activeRecord.customFields?.referredByHaritMitra || '').trim()
      );
      setConfirmDelete(false);
    } else {
      setProfileHistory([]);
    }
  }, [activeRecord]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!activeRecord && !createOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (createOpen) setCreateOpen(false);
        else if (activeRecord) onSelectRecord(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeRecord, createOpen, onSelectRecord]);

  useEffect(() => {
    setCheckedIds((prev) => prev.filter((id) => submissions.some((s) => s.id === id)));
  }, [submissions]);

  const formLabelMap = useMemo(() => {
    const map = new Map<string, AdminFormDefinition>();
    for (const f of forms) map.set(f.id, f);
    return map;
  }, [forms]);

  const allSelected =
    submissions.length > 0 && checkedIds.length === submissions.length;

  const toggleAll = () => {
    if (allSelected) setCheckedIds([]);
    else setCheckedIds(submissions.map((s) => s.id));
  };

  const toggleOne = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch {
      // Ignore if clipboard blocked
    }
  };

  const openProfile = (record: AdminSubmissionRecord, pushCurrentToHistory = false) => {
    if (pushCurrentToHistory && activeRecord && activeRecord.id !== record.id) {
      setProfileHistory((prev) => [...prev, activeRecord]);
    } else if (!pushCurrentToHistory) {
      setProfileHistory([]);
    }
    onSelectRecord(record);
  };

  const goBackProfile = () => {
    setProfileHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const previousRecord = next.pop()!;
      onSelectRecord(previousRecord);
      return next;
    });
  };

  const handleApplyTimePreset = (preset: 'today' | '24h' | '7d' | 'month' | 'all') => {
    if (preset === 'all') {
      onChangeFilters({ dateFrom: '', dateTo: '' });
      return;
    }
    const now = new Date();
    const endVal = toDatetimeLocalValue(now);
    let startDt = new Date(now);
    if (preset === 'today') {
      startDt.setHours(0, 0, 0, 0);
    } else if (preset === '24h') {
      startDt = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (preset === '7d') {
      startDt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (preset === 'month') {
      startDt = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }
    onChangeFilters({
      dateFrom: toDatetimeLocalValue(startDt),
      dateTo: endVal,
    });
  };

  const handleApplyBulk = async () => {
    if (checkedIds.length === 0) return;
    setBulkBusy(true);
    try {
      await onBulkUpdate(checkedIds, bulkStatus);
      setCheckedIds([]);
    } finally {
      setBulkBusy(false);
    }
  };

  // FIX: Save Review Changes now saves AND automatically closes the profile drawer!
  const handleSaveDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord) return;
    setSavingDrawer(true);
    try {
      const patch: {
        status?: SubmissionStatus;
        adminNotes?: string;
        customFields?: Record<string, string>;
      } = {
        status: draftStatus,
        adminNotes: draftNotes,
      };
      if (activeRecord.formType !== 'harit-mitra') {
        const existingCode = String(
          activeRecord.customFields?.referredByHaritMitra || ''
        ).trim();
        if (draftAssignedHmCode.trim() !== existingCode) {
          patch.customFields = {
            ...(activeRecord.customFields || {}),
            referredByHaritMitra: draftAssignedHmCode.trim().toUpperCase(),
          };
        }
      }
      await onUpdateRecord(activeRecord.id, patch, { closeAfterSave: true });
    } finally {
      setSavingDrawer(false);
    }
  };

  const handleIssueUniqueId = async (record: AdminSubmissionRecord) => {
    setIssuingId(true);
    setTreeActionBusyId(record.id);
    try {
      await onUpdateRecord(
        record.id,
        record.formType === 'harit-mitra'
          ? { generateReferralCode: true, generateUniqueId: true }
          : { generateUniqueId: true },
        { closeAfterSave: false }
      );
    } finally {
      setIssuingId(false);
      setTreeActionBusyId(null);
    }
  };

  const handleQuickAssignMember = async (
    member: AdminSubmissionRecord,
    referralCode: string
  ) => {
    if (!referralCode.trim()) return;
    setTreeActionBusyId(member.id);
    try {
      await onUpdateRecord(
        member.id,
        {
          customFields: {
            ...(member.customFields || {}),
            referredByHaritMitra: referralCode.trim().toUpperCase(),
          },
        },
        { closeAfterSave: false }
      );
    } finally {
      setTreeActionBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeRecord) return;
    setSavingDrawer(true);
    try {
      await onDeleteRecord(activeRecord.id);
      onSelectRecord(null);
    } finally {
      setSavingDrawer(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.applicantName.trim() || !newMember.mobile.trim()) return;
    setCreateBusy(true);
    try {
      const customFields: Record<string, string> = {};
      if (newMember.referredByHaritMitra.trim() && newMember.formType !== 'harit-mitra') {
        customFields.referredByHaritMitra = newMember.referredByHaritMitra.trim().toUpperCase();
      }
      const created = await onCreateRecord({
        formType: newMember.formType,
        applicantName: newMember.applicantName.trim(),
        mobile: newMember.mobile.trim(),
        district: newMember.district.trim() || 'Bhilwara',
        villageOrOrg: newMember.villageOrOrg.trim() || newMember.district.trim(),
        details: newMember.details.trim() || 'Registered via Admin Console',
        status: newMember.status,
        customFields,
      });
      if (created) {
        setCreateOpen(false);
        setNewMember({
          formType: 'harit-mitra',
          applicantName: '',
          mobile: '',
          stateSlug: 'rajasthan',
          district: 'Bhilwara',
          villageOrOrg: '',
          referredByHaritMitra: '',
          details: '',
          status: 'Approved',
        });
        openProfile(created, false);
      }
    } finally {
      setCreateBusy(false);
    }
  };

  const activeReferralCode =
    activeRecord?.formType === 'harit-mitra'
      ? String(activeRecord.customFields?.referralCode || '').trim()
      : '';
  const activeUniqueMemberId = String(
    activeRecord?.customFields?.memberUniqueId || ''
  ).trim();

  // All members who joined under the currently inspected Harit Mitra
  const linkedMembersForActiveHm = useMemo(() => {
    if (!activeRecord || activeRecord.formType !== 'harit-mitra') return [];
    if (haritMitraNetwork) {
      const node = haritMitraNetwork.nodes.find(
        (n) =>
          n.haritMitra.id === activeRecord.id ||
          (activeReferralCode &&
            n.referralCode.toUpperCase() === activeReferralCode.toUpperCase())
      );
      if (node) return node.linkedMembers ?? node.linkedFarmers ?? [];
    }
    if (!activeReferralCode) return [];
    const upper = activeReferralCode.toUpperCase();
    return submissions.filter(
      (s) =>
        s.id !== activeRecord.id &&
        String(s.customFields?.referredByHaritMitra || '').trim().toUpperCase() === upper
    );
  }, [activeRecord, activeReferralCode, haritMitraNetwork, submissions]);

  // Reverse Link: Find coordinating Harit Mitra for any inspected non-HM profile
  const parentHaritMitraForMember = useMemo(() => {
    if (!activeRecord || activeRecord.formType === 'harit-mitra') return null;
    const code = String(activeRecord.customFields?.referredByHaritMitra || '')
      .trim()
      .toUpperCase();
    if (!code) return null;
    if (haritMitraNetwork) {
      const match = haritMitraNetwork.allHaritMitras.find(
        (hm) =>
          String(hm.customFields?.referralCode || '').trim().toUpperCase() === code ||
          hm.applicationId.toUpperCase() === code
      );
      if (match) return match;
    }
    return (
      submissions.find(
        (s) =>
          s.formType === 'harit-mitra' &&
          (String(s.customFields?.referralCode || '').trim().toUpperCase() === code ||
            s.applicationId.toUpperCase() === code)
      ) ?? null
    );
  }, [activeRecord, haritMitraNetwork, submissions]);

  const availableHaritMitrasWithCodes = useMemo(() => {
    const list = haritMitraNetwork?.allHaritMitras ?? [];
    return list.filter((hm) =>
      Boolean(String(hm.customFields?.referralCode || hm.applicationId).trim())
    );
  }, [haritMitraNetwork]);

  // Filtered Harit Mitra Tree Nodes
  const treeStats = useMemo(() => {
    const nodes = haritMitraNetwork?.nodes ?? [];
    const totalConnected = nodes.reduce(
      (sum, n) => sum + (n.linkedMembers?.length ?? n.linkedFarmers.length),
      0
    );
    const unlinkedCount = haritMitraNetwork?.unlinkedFarmers.length ?? 0;
    return {
      totalHm: nodes.length,
      totalConnected,
      unlinkedCount,
    };
  }, [haritMitraNetwork]);

  const filteredTreeNodes = useMemo(() => {
    const nodes = haritMitraNetwork?.nodes ?? [];
    const q = treeSearch.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.filter((node) => {
      const members = node.linkedMembers ?? node.linkedFarmers;
      const hmMatches =
        node.haritMitra.applicantName.toLowerCase().includes(q) ||
        node.haritMitra.district.toLowerCase().includes(q) ||
        node.haritMitra.villageOrOrg.toLowerCase().includes(q) ||
        node.referralCode.toLowerCase().includes(q) ||
        node.haritMitra.mobile.includes(q);
      const childMatches = members.some(
        (m) =>
          m.applicantName.toLowerCase().includes(q) ||
          m.villageOrOrg.toLowerCase().includes(q) ||
          m.mobile.includes(q) ||
          m.applicationId.toLowerCase().includes(q)
      );
      return hmMatches || childMatches;
    });
  }, [haritMitraNetwork, treeSearch]);

  const modalDistrictOptions = useMemo(() => {
    const st = findStateByNameOrSlug(newMember.stateSlug);
    return st ? st.districts : districts.map((d) => d.nameEn);
  }, [newMember.stateSlug, districts]);

  const toggleAllTreeNodes = (collapse: boolean) => {
    const next: Record<number, boolean> = {};
    for (const node of haritMitraNetwork?.nodes ?? []) {
      next[node.haritMitra.id] = collapse;
    }
    setCollapsedHmIds(next);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions Bar */}
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#142119]">
              12-Form Applications &amp; Harit Mitra Network CRM
            </h2>
            <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
              {submissions.length} matching records · Click any person to open their full profile, issue Unique IDs, inspect the Harit Mitra tree, or export by exact date &amp; time
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Table vs Harit Mitra Tree View Toggle */}
            <div className="inline-flex bg-[#F3F6F3] p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  viewMode === 'table'
                    ? 'bg-white text-[#144527] shadow-2xs'
                    : 'text-[#55685C] hover:text-[#142119]'
                }`}
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>All Applications</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  viewMode === 'tree'
                    ? 'bg-white text-[#144527] shadow-2xs'
                    : 'text-[#55685C] hover:text-[#142119]'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span className="tabular-nums">
                  Harit Mitra Tree ({treeStats.totalHm})
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CBE0CC] bg-[#F4F8F3] hover:bg-[#E7F2E8] text-[#144527] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Member &amp; Issue ID</span>
            </button>

            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#F4F8F3] text-[#144527] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Backup JSON ({submissions.length})</span>
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({submissions.length})</span>
            </button>
          </div>
        </div>

        {/* Row 1: Search, Category, Status, District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 relative">
            <Search
              className="w-4 h-4 text-[#7C8F82] absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onChangeFilters({ q: e.target.value })}
              placeholder="Search Unique ID, App ID, name, mobile, village, campaign..."
              aria-label="Search submissions"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="sr-only" htmlFor="filter-form-type">
              Filter by Form Type
            </label>
            <select
              id="filter-form-type"
              value={selectedFormType}
              onChange={(e) => onChangeFilters({ formType: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE5DE] bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
            >
              <option value="all">All 12 Forms + Contact</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.formNumber <= 12
                    ? `#${String(f.formNumber).padStart(2, '0')} · ${f.titleEn.replace(/^\d+\.\s*/, '')}`
                    : 'Contact Desk Inquiries'}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="sr-only" htmlFor="filter-status">
              Filter by Status
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => onChangeFilters({ status: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE5DE] bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
            >
              <option value="all">All Statuses</option>
              {VALID_SUBMISSION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="sr-only" htmlFor="filter-district">
              Filter by District
            </label>
            <select
              id="filter-district"
              value={selectedDistrict}
              onChange={(e) => onChangeFilters({ district: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCE5DE] bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d.slug} value={d.nameEn}>
                  {d.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Exact Date & Time Range Filter + Export Presets */}
        <div className="pt-3 border-t border-[#EDF2EE] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#144527]">
              <Clock className="w-3.5 h-3.5 text-[#368737]" />
              <span>Date &amp; Time Export Range:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-[11px] text-[#55685C]">
                <span>From</span>
                <input
                  type="datetime-local"
                  aria-label="From date and time"
                  value={dateFrom}
                  onChange={(e) => onChangeFilters({ dateFrom: e.target.value })}
                  className="px-2.5 py-1.5 text-[11px] rounded-lg border border-[#DCE5DE] bg-[#FAFBF8] focus:bg-white font-mono text-[#142119]"
                />
              </label>
              <label className="inline-flex items-center gap-1.5 text-[11px] text-[#55685C]">
                <span>To</span>
                <input
                  type="datetime-local"
                  aria-label="To date and time"
                  value={dateTo}
                  onChange={(e) => onChangeFilters({ dateTo: e.target.value })}
                  className="px-2.5 py-1.5 text-[11px] rounded-lg border border-[#DCE5DE] bg-[#FAFBF8] focus:bg-white font-mono text-[#142119]"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[#55685C] mr-1">Quick Range:</span>
            {(
              [
                ['today', 'Today'],
                ['24h', 'Last 24h'],
                ['7d', 'Last 7 Days'],
                ['month', 'This Month'],
                ['all', 'All Time'],
              ] as const
            ).map(([presetKey, label]) => (
              <button
                key={presetKey}
                type="button"
                onClick={() => handleApplyTimePreset(presetKey)}
                className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                  presetKey === 'all' && !dateFrom && !dateTo
                    ? 'bg-[#144527] text-white border-[#144527]'
                    : 'bg-white border-[#DCE5DE] text-[#144527] hover:bg-[#F4F8F3]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Strip */}
        {viewMode === 'table' && checkedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EDF2EE] bg-[#F4F8F3] -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 rounded-b-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#144527] tabular-nums">
              <CheckSquare className="w-4 h-4 text-[#368737]" aria-hidden="true" />
              <span>{checkedIds.length} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                aria-label="Bulk target status"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as SubmissionStatus)}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#CBE0CC] bg-white"
              >
                {VALID_SUBMISSION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    Set Status: {st}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={bulkBusy}
                onClick={handleApplyBulk}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#144527] hover:bg-[#0F351E] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{bulkBusy ? 'Updating...' : 'Apply Bulk Update'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* HARIT MITRA VISUAL HIERARCHY TREE VIEW */}
      {viewMode === 'tree' ? (
        <div className="space-y-5">
          {/* Tree Overview & Controls */}
          <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#142119] flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#368737]" />
                  <span>Harit Mitra Referral Tree &amp; Connected Members</span>
                </h3>
                <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
                  {treeStats.totalHm} Harit Mitras · {treeStats.totalConnected} Connected Members · {treeStats.unlinkedCount} Unassigned Farmers · Click any Harit Mitra or joined member to open their full profile
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#7C8F82] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={treeSearch}
                    onChange={(e) => setTreeSearch(e.target.value)}
                    placeholder="Filter tree by name, code, village..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] focus:bg-white w-56"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggleAllTreeNodes(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#DCE5DE] text-xs font-semibold text-[#144527] hover:bg-[#F4F8F3] cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={() => toggleAllTreeNodes(true)}
                  className="px-3 py-1.5 rounded-xl border border-[#DCE5DE] text-xs font-semibold text-[#55685C] hover:bg-[#F4F8F3] cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {!haritMitraNetwork || filteredTreeNodes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2EAE4] p-10 text-center space-y-3">
              <GitBranch className="w-8 h-8 text-[#7C8F82] mx-auto" />
              <p className="text-sm font-bold text-[#142119]">
                No Harit Mitra nodes match your filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setTreeSearch('');
                  setCreateOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white text-xs font-semibold cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New Harit Mitra</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTreeNodes.map((node) => {
                const hm = node.haritMitra;
                const joinedMembers = node.linkedMembers ?? node.linkedFarmers ?? [];
                const isCollapsed = Boolean(collapsedHmIds[hm.id]);
                const hasReferralCode = Boolean(
                  String(hm.customFields?.referralCode || '').trim()
                );
                const code = String(hm.customFields?.referralCode || '').trim();
                const uniqueId = String(hm.customFields?.memberUniqueId || '').trim();
                const approvedCount = joinedMembers.filter(
                  (m) => m.status === 'Approved'
                ).length;

                return (
                  <div
                    key={hm.id}
                    className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden"
                  >
                    {/* Root Harit Mitra Node */}
                    <div className="p-4 sm:p-5 bg-[#FAFBF8] border-b border-[#EDF2EE] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedHmIds((prev) => ({
                              ...prev,
                              [hm.id]: !prev[hm.id],
                            }))
                          }
                          className="mt-1 p-1.5 rounded-lg border border-[#DCE5DE] bg-white hover:bg-[#F0F5F1] text-[#144527] cursor-pointer shrink-0"
                          aria-label={isCollapsed ? 'Expand branch' : 'Collapse branch'}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => openProfile(hm, false)}
                          className="flex items-start gap-3 text-left group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#144527] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {initialsOf(hm.applicantName)}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-[#142119] group-hover:text-[#144527] group-hover:underline">
                                {hm.applicantName}
                              </span>
                              <span className="text-xs text-[#55685C]">·</span>
                              <span className="text-xs font-semibold text-[#144527]">
                                Harit Mitra Coordinator
                              </span>
                              <span className="text-xs text-[#55685C]">·</span>
                              <span className={`text-xs ${statusClass(hm.status)}`}>
                                {hm.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
                              {hm.district} · {hm.villageOrOrg} · {hm.mobile} · Joined{' '}
                              {formatDateTime(hm.submittedAt)}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-mono">
                              <span className="text-[#55685C]">
                                App: <strong className="text-[#142119]">{hm.applicationId}</strong>
                              </span>
                              {hasReferralCode && (
                                <span className="text-[#144527]">
                                  Referral ID: <strong>{code}</strong>
                                </span>
                              )}
                              {uniqueId && (
                                <span className="text-[#55685C]">
                                  Unique ID: <strong className="text-[#142119]">{uniqueId}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pl-10 lg:pl-0">
                        <span className="text-xs font-semibold text-[#144527] tabular-nums mr-1">
                          {joinedMembers.length} Joined ({approvedCount} Approved)
                        </span>

                        {hasReferralCode ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                `${window.location.origin}/join/farmer?ref=${encodeURIComponent(code)}`,
                                `link-${hm.id}`
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBE0CC] bg-white hover:bg-[#F4F8F3] text-[#144527] text-xs font-semibold cursor-pointer whitespace-nowrap"
                          >
                            {copiedText === `link-${hm.id}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Invite Link Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Invite Link</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={treeActionBusyId === hm.id}
                            onClick={() => handleIssueUniqueId(hm)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>
                              {treeActionBusyId === hm.id
                                ? 'Generating...'
                                : 'Generate Unique ID'}
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openProfile(hm, false)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
                        >
                          <span>Full Profile</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Visual Tree Branches — All People Joined Under This Harit Mitra */}
                    {!isCollapsed && (
                      <div className="p-4 sm:p-5 bg-white">
                        {joinedMembers.length === 0 ? (
                          <div className="pl-6 text-xs text-[#6B7E72]">
                            No members have joined under{' '}
                            <span className="font-mono font-semibold text-[#144527]">
                              {code || hm.applicationId}
                            </span>{' '}
                            yet. Share the Invite Link above or assign an unassigned farmer below.
                          </div>
                        ) : (
                          <div className="relative pl-6 sm:pl-9 space-y-2.5 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-0 before:bottom-4 before:w-px before:bg-[#CBE0CC]">
                            {joinedMembers.map((member) => {
                              const formMeta = formLabelMap.get(member.formType);
                              const roleLabel =
                                member.customFields?.campaignRole ||
                                formMeta?.titleEn.replace(/^\d+\.\s*/, '') ||
                                member.formType;
                              return (
                                <div key={member.id} className="relative">
                                  {/* Horizontal Tree Connector Line */}
                                  <span
                                    aria-hidden="true"
                                    className="absolute -left-3 sm:-left-5 top-6 w-3 sm:w-5 h-px bg-[#CBE0CC]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => openProfile(member, false)}
                                    className="w-full text-left rounded-xl border border-[#E5ECE6] hover:border-[#368737] hover:bg-[#F7FAF7] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors cursor-pointer"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-[#EAF4E9] text-[#144527] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                        {initialsOf(member.applicantName)}
                                      </div>
                                      <div>
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                          <span className="font-bold text-[#142119]">
                                            {member.applicantName}
                                          </span>
                                          <span className="text-[#7C8F82]">·</span>
                                          <span className="text-[#144527] font-medium">
                                            {roleLabel}
                                          </span>
                                          <span className="text-[#7C8F82]">·</span>
                                          <span className={statusClass(member.status)}>
                                            {member.status}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-[#55685C] mt-0.5 tabular-nums">
                                          {member.villageOrOrg}, {member.district} · {member.mobile} ·{' '}
                                          <span className="font-mono">{member.applicationId}</span>
                                          {member.customFields?.landSize
                                            ? ` · Land: ${member.customFields.landSize}`
                                            : ''}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 pl-11 sm:pl-0 shrink-0">
                                      <span className="text-[11px] text-[#6B7E72] font-mono tabular-nums">
                                        {formatDateTime(member.submittedAt)}
                                      </span>
                                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#144527]">
                                        <span>Open Profile</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                      </span>
                                    </div>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Unlinked Farmers Quick-Assign Workbench */}
          {haritMitraNetwork && haritMitraNetwork.unlinkedFarmers.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[#142119]">
                  Unassigned Farmers ({haritMitraNetwork.unlinkedFarmers.length})
                </h3>
                <p className="text-xs text-[#55685C]">
                  Click a farmer to inspect their full profile, or assign them straight into a Harit Mitra branch above.
                </p>
              </div>
              <div className="divide-y divide-[#F0F4F1] border border-[#E5ECE6] rounded-xl overflow-hidden">
                {haritMitraNetwork.unlinkedFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="p-3.5 bg-white hover:bg-[#FAFBF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => openProfile(farmer, false)}
                      className="text-left cursor-pointer group"
                    >
                      <p className="text-xs font-bold text-[#142119] group-hover:text-[#144527] group-hover:underline">
                        {farmer.applicantName}{' '}
                        <span className="font-mono font-normal text-[#55685C]">
                          · {farmer.applicationId}
                        </span>
                      </p>
                      <p className="text-[11px] text-[#55685C] tabular-nums">
                        {farmer.district} · {farmer.villageOrOrg} · {farmer.mobile}
                      </p>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        defaultValue=""
                        disabled={treeActionBusyId === farmer.id}
                        aria-label={`Assign ${farmer.applicantName} to Harit Mitra`}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleQuickAssignMember(farmer, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="rounded-lg border border-[#CBE0CC] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#144527]"
                      >
                        <option value="">Assign to Harit Mitra...</option>
                        {availableHaritMitrasWithCodes.map((hm) => {
                          const code =
                            String(hm.customFields?.referralCode || '').trim() ||
                            hm.applicationId;
                          return (
                            <option key={hm.id} value={code}>
                              {hm.applicantName} ({code} · {hm.district})
                            </option>
                          );
                        })}
                      </select>
                      <button
                        type="button"
                        onClick={() => openProfile(farmer, false)}
                        className="px-3 py-1.5 rounded-lg border border-[#DCE5DE] text-xs font-semibold text-[#144527] hover:bg-[#F4F8F3] cursor-pointer"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* HIGH-DENSITY CLICKABLE SUBMISSIONS TABLE */
        <div className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-11 bg-[#F3F6F3] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <p className="text-sm font-bold text-[#142119]">No matching submissions found</p>
              <p className="text-xs text-[#55685C]">
                Adjust your search, category, status, or Date &amp; Time range filters above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBF8] border-b border-[#E2EAE4] text-[11px] font-bold uppercase tracking-wider text-[#55685C]">
                    <th className="py-3 pl-4 pr-2 w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Select all submissions"
                        className="rounded border-[#B8C9BD] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3">Applicant &amp; Contact</th>
                    <th className="py-3 px-3">Application &amp; Unique ID</th>
                    <th className="py-3 px-3">Form / Campaign Role</th>
                    <th className="py-3 px-3">District &amp; Location</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Submitted (Date &amp; Time)</th>
                    <th className="py-3 pr-4 pl-3 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFF3F0] text-xs">
                  {submissions.map((row) => {
                    const formMeta = formLabelMap.get(row.formType);
                    const isChecked = checkedIds.includes(row.id);
                    const refOrUnique =
                      row.customFields?.referralCode ||
                      row.customFields?.memberUniqueId ||
                      '';
                    const referredBy = row.customFields?.referredByHaritMitra || '';

                    return (
                      <tr
                        key={row.id}
                        onClick={() => openProfile(row, false)}
                        className={`transition-colors cursor-pointer ${
                          isChecked ? 'bg-[#F4F8F3]' : 'hover:bg-[#F7FAF7]'
                        }`}
                      >
                        <td
                          className="py-3 pl-4 pr-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleOne(row.id)}
                            aria-label={`Select ${row.applicationId}`}
                            className="rounded border-[#B8C9BD] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#EAF4E9] text-[#144527] font-bold text-[11px] flex items-center justify-center shrink-0">
                              {initialsOf(row.applicantName)}
                            </div>
                            <div>
                              <p className="font-bold text-[#142119] hover:text-[#144527]">
                                {row.applicantName}
                              </p>
                              <p className="text-[11px] text-[#55685C] font-mono tabular-nums">
                                {row.mobile}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-mono font-semibold text-[#144527]">
                            {row.applicationId}
                          </p>
                          {refOrUnique && (
                            <p className="text-[11px] font-mono text-[#368737]">
                              ID: {refOrUnique}
                            </p>
                          )}
                          {referredBy && (
                            <p className="text-[11px] text-[#55685C] font-mono">
                              Via: {referredBy}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#142119]">
                            {formMeta
                              ? formMeta.titleEn.replace(/^\d+\.\s*/, '')
                              : row.formType}
                          </p>
                          {row.customFields?.campaignRole && (
                            <p className="text-[11px] text-[#368737] font-medium">
                              Role: {row.customFields.campaignRole}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#142119]">{row.district}</p>
                          <p className="text-[11px] text-[#55685C] truncate max-w-[180px]">
                            {row.villageOrOrg}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <span className={statusClass(row.status)}>{row.status}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#55685C] tabular-nums whitespace-nowrap">
                          {formatDateTime(row.submittedAt)}
                        </td>
                        <td className="py-3 pr-4 pl-3 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProfile(row, false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DCE5DE] bg-white hover:border-[#368737] text-[#144527] font-semibold cursor-pointer whitespace-nowrap"
                          >
                            <span>Open Profile</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* COMPLETE FULL PROFILE SLIDE-OVER DRAWER */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop — clicking closes the drawer */}
          <div
            className="fixed inset-0 bg-[#0D1F14]/45 backdrop-blur-[1px]"
            onClick={() => onSelectRecord(null)}
            aria-hidden="true"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Full profile for ${activeRecord.applicantName}`}
            className="relative z-10 w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl border-l border-[#DCE5DE] flex flex-col"
          >
            {/* Sticky Profile Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#E2EAE4] px-5 sm:px-6 py-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#144527] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {initialsOf(activeRecord.applicantName)}
                </div>
                <div>
                  {profileHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={goBackProfile}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#368737] hover:underline mb-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>
                        Back to {profileHistory[profileHistory.length - 1].applicantName}
                      </span>
                    </button>
                  )}
                  <h3 className="text-base font-bold text-[#142119]">
                    {activeRecord.applicantName}
                  </h3>
                  <p className="text-xs text-[#55685C] tabular-nums">
                    <span className="font-mono font-semibold text-[#144527]">
                      {activeRecord.applicationId}
                    </span>{' '}
                    ·{' '}
                    {formLabelMap
                      .get(activeRecord.formType)
                      ?.titleEn.replace(/^\d+\.\s*/, '') ?? activeRecord.formType}{' '}
                    · <span className={statusClass(activeRecord.status)}>{activeRecord.status}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectRecord(null)}
                className="p-2 rounded-xl border border-[#E2EAE4] text-[#55685C] hover:bg-[#F3F6F3] hover:text-[#142119] cursor-pointer shrink-0"
                aria-label="Close profile drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Body */}
            <div className="p-5 sm:p-6 space-y-6 flex-1">
              {/* Unique ID & Referral Code Card */}
              <div className="rounded-2xl border border-[#CBE0CC] bg-[#F5FAF5] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#144527]">
                    <KeyRound className="w-4 h-4 text-[#368737]" />
                    <span>Unique Identity &amp; Referral Credentials</span>
                  </div>
                  <button
                    type="button"
                    disabled={issuingId}
                    onClick={() => handleIssueUniqueId(activeRecord)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>
                      {issuingId
                        ? 'Generating...'
                        : activeUniqueMemberId || activeReferralCode
                        ? 'Refresh Unique ID'
                        : 'Generate Unique ID'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white border border-[#DCE5DE] p-3">
                    <p className="text-[11px] text-[#55685C]">Application Reference</p>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono font-bold text-[#142119]">
                        {activeRecord.applicationId}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(activeRecord.applicationId, 'app-id')
                        }
                        className="text-[11px] font-semibold text-[#368737] hover:underline cursor-pointer"
                      >
                        {copiedText === 'app-id' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white border border-[#DCE5DE] p-3">
                    <p className="text-[11px] text-[#55685C]">
                      {activeRecord.formType === 'harit-mitra'
                        ? 'Harit Mitra Referral ID'
                        : 'Unique Member ID'}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono font-bold text-[#144527]">
                        {activeRecord.formType === 'harit-mitra'
                          ? activeReferralCode || 'Not issued yet'
                          : activeUniqueMemberId || 'Not issued yet'}
                      </span>
                      {(activeReferralCode || activeUniqueMemberId) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              activeRecord.formType === 'harit-mitra'
                                ? activeReferralCode
                                : activeUniqueMemberId,
                              'unique-id'
                            )
                          }
                          className="text-[11px] font-semibold text-[#368737] hover:underline cursor-pointer"
                        >
                          {copiedText === 'unique-id' ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {activeRecord.formType === 'harit-mitra' && activeReferralCode && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DCE9DD] text-xs">
                    <span className="text-[#55685C] truncate font-mono text-[11px]">
                      {window.location.origin}/join/farmer?ref={activeReferralCode}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${window.location.origin}/join/farmer?ref=${encodeURIComponent(activeReferralCode)}`,
                          'drawer-invite'
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#144527] hover:underline cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>
                        {copiedText === 'drawer-invite'
                          ? 'Invite Link Copied'
                          : 'Copy Referral Link'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Contact, Location & Submission Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-[#E5ECE6] bg-[#FAFBF8] p-3.5 space-y-1">
                  <p className="text-[11px] text-[#55685C] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#368737]" />
                    <span>Mobile / Contact</span>
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`tel:${activeRecord.mobile}`}
                      className="font-mono font-bold text-[#142119] hover:text-[#144527]"
                    >
                      {activeRecord.mobile}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeRecord.mobile, 'mobile')}
                      className="text-[11px] font-semibold text-[#368737] hover:underline cursor-pointer"
                    >
                      {copiedText === 'mobile' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-[#E5ECE6] bg-[#FAFBF8] p-3.5 space-y-1">
                  <p className="text-[11px] text-[#55685C] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                    <span>District</span>
                  </p>
                  <p className="font-bold text-[#142119]">{activeRecord.district}</p>
                </div>

                <div className="rounded-xl border border-[#E5ECE6] bg-[#FAFBF8] p-3.5 space-y-1">
                  <p className="text-[11px] text-[#55685C] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#368737]" />
                    <span>Village / Gram Panchayat / Org</span>
                  </p>
                  <p className="font-semibold text-[#142119]">{activeRecord.villageOrOrg}</p>
                </div>

                <div className="rounded-xl border border-[#E5ECE6] bg-[#FAFBF8] p-3.5 space-y-1">
                  <p className="text-[11px] text-[#55685C] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#368737]" />
                    <span>Submitted Date &amp; Time</span>
                  </p>
                  <p className="font-mono font-semibold text-[#142119] tabular-nums">
                    {formatDateTime(activeRecord.submittedAt)}
                  </p>
                </div>
              </div>

              {/* HARIT MITRA DOWNLINE TREE INSIDE PROFILE (For Harit Mitra Profiles) */}
              {activeRecord.formType === 'harit-mitra' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#55685C] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#368737]" />
                      <span>
                        Members Joined Under {activeRecord.applicantName} (
                        {linkedMembersForActiveHm.length})
                      </span>
                    </h4>
                  </div>

                  {linkedMembersForActiveHm.length === 0 ? (
                    <p className="text-xs text-[#6B7E72] rounded-xl border border-dashed border-[#DCE5DE] p-4">
                      No members have joined using this Harit Mitra&apos;s code yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {linkedMembersForActiveHm.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => openProfile(child, true)}
                          className="w-full text-left rounded-xl border border-[#DCE5DE] hover:border-[#368737] hover:bg-[#F5FAF5] p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#142119]">
                              {child.applicantName}{' '}
                              <span className="font-normal text-[#55685C]">
                                · {child.formType}
                              </span>
                            </p>
                            <p className="text-[11px] text-[#55685C] tabular-nums">
                              {child.villageOrOrg} · {child.mobile} ·{' '}
                              <span className={statusClass(child.status)}>
                                {child.status}
                              </span>
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#144527] shrink-0">
                            <span>Open</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* REVERSE LINK TO COORDINATING HARIT MITRA (For Non-HM Profiles) */}
              {activeRecord.formType !== 'harit-mitra' && parentHaritMitraForMember && (
                <div className="rounded-xl border border-[#CBE0CC] bg-[#FAFDF9] p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#55685C] flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#368737]" />
                      <span>Coordinating Harit Mitra</span>
                    </p>
                    <p className="text-xs font-bold text-[#142119] mt-0.5">
                      {parentHaritMitraForMember.applicantName} (
                      {parentHaritMitraForMember.customFields?.referralCode ||
                        parentHaritMitraForMember.applicationId}
                      )
                    </p>
                    <p className="text-[11px] text-[#55685C]">
                      {parentHaritMitraForMember.district} ·{' '}
                      {parentHaritMitraForMember.mobile}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openProfile(parentHaritMitraForMember, true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#CBE0CC] text-xs font-semibold text-[#144527] hover:bg-[#F0F7F0] cursor-pointer shrink-0"
                  >
                    <span>Open Harit Mitra</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* All Submitted Custom Form Fields */}
              {Object.keys(activeRecord.customFields ?? {}).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#55685C] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#368737]" />
                    <span>Complete Application Attributes</span>
                  </h4>
                  <div className="rounded-xl border border-[#E5ECE6] divide-y divide-[#EFF3F0] overflow-hidden text-xs">
                    {Object.entries(activeRecord.customFields ?? {})
                      .filter(([, val]) => String(val ?? '').trim().length > 0)
                      .map(([k, v]) => (
                        <div
                          key={k}
                          className="px-3.5 py-2.5 flex items-start justify-between gap-4 bg-white"
                        >
                          <span className="text-[#55685C] font-medium">
                            {humanizeFieldKey(k)}
                          </span>
                          <span className="font-semibold text-[#142119] text-right font-mono sm:font-sans">
                            {v}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Submitted Details Text */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#55685C]">
                  Applicant Notes &amp; Details
                </h4>
                <div className="rounded-xl border border-[#E5ECE6] bg-[#FAFBF8] p-3.5 text-xs text-[#24382C] leading-relaxed whitespace-pre-wrap">
                  {activeRecord.details || 'No additional notes provided.'}
                </div>
              </div>

              {/* Review & Status Update Form (Auto-Closes Drawer on Save!) */}
              <form
                onSubmit={handleSaveDrawer}
                className="border-t border-[#E2EAE4] pt-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#144527]">
                    Review Workflow &amp; Assignment
                  </h4>
                  {activeRecord.reviewedBy && (
                    <span className="text-[11px] text-[#55685C] tabular-nums">
                      Last reviewed by {activeRecord.reviewedBy}
                      {activeRecord.reviewedAt
                        ? ` · ${formatDateTime(activeRecord.reviewedAt)}`
                        : ''}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label
                      htmlFor="drawer-status-select"
                      className="block font-semibold text-[#142119]"
                    >
                      Application Status
                    </label>
                    <select
                      id="drawer-status-select"
                      value={draftStatus}
                      onChange={(e) =>
                        setDraftStatus(e.target.value as SubmissionStatus)
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2 font-medium"
                    >
                      {VALID_SUBMISSION_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeRecord.formType !== 'harit-mitra' && (
                    <div className="space-y-1">
                      <label
                        htmlFor="drawer-hm-select"
                        className="block font-semibold text-[#142119]"
                      >
                        Link Under Harit Mitra
                      </label>
                      <select
                        id="drawer-hm-select"
                        value={draftAssignedHmCode}
                        onChange={(e) => setDraftAssignedHmCode(e.target.value)}
                        className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                      >
                        <option value="">Unassigned / Direct Registration</option>
                        {availableHaritMitrasWithCodes.map((hm) => {
                          const code =
                            String(hm.customFields?.referralCode || '').trim() ||
                            hm.applicationId;
                          return (
                            <option key={hm.id} value={code}>
                              {hm.applicantName} ({code} · {hm.district})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <label
                    htmlFor="drawer-admin-notes"
                    className="block font-semibold text-[#142119]"
                  >
                    Internal Admin Review Notes
                  </label>
                  <textarea
                    id="drawer-admin-notes"
                    rows={3}
                    value={draftNotes}
                    onChange={(e) => setDraftNotes(e.target.value)}
                    placeholder="Record verification remarks, field visit updates, or next actions..."
                    className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div>
                    {role === 'super_admin' &&
                      (confirmDelete ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={savingDrawer}
                            onClick={handleConfirmDelete}
                            className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
                          >
                            Confirm Permanent Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            className="px-2.5 py-2 rounded-xl border border-[#DCE5DE] text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(null)}
                      className="px-4 py-2.5 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#F5F7F5] text-[#142119] text-xs font-semibold cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={savingDrawer}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {savingDrawer ? 'Saving...' : 'Save Review Changes'}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* ADD NEW MEMBER & AUTO-ISSUE UNIQUE ID MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0D1F14]/45 backdrop-blur-[1px]"
            onClick={() => setCreateOpen(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleCreateSubmit}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-[#DCE5DE] shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#142119]">
                  Add New Member &amp; Auto-Generate Unique ID
                </h3>
                <p className="text-[11px] text-[#55685C] mt-0.5">
                  Instantly creates a profile with an Application ID, Unique Member ID, and Harit Mitra Referral Code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="p-1.5 rounded-lg text-[#55685C] hover:bg-[#F3F6F3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-semibold text-[#142119]">
                  Member Category *
                </label>
                <select
                  value={newMember.formType}
                  onChange={(e) =>
                    setNewMember({ ...newMember, formType: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  {forms
                    .filter((f) => f.id !== 'contact')
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.titleEn.replace(/^\d+\.\s*/, '')}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#142119]">
                  Initial Status
                </label>
                <select
                  value={newMember.status}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      status: e.target.value as SubmissionStatus,
                    })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  {VALID_SUBMISSION_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#142119]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar Verma"
                  value={newMember.applicantName}
                  onChange={(e) =>
                    setNewMember({ ...newMember, applicantName: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#142119]">
                  10-Digit Mobile *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9829012345"
                  value={newMember.mobile}
                  onChange={(e) =>
                    setNewMember({ ...newMember, mobile: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#142119]">State</label>
                <select
                  value={newMember.stateSlug}
                  onChange={(e) => {
                    const st = findStateByNameOrSlug(e.target.value);
                    setNewMember({
                      ...newMember,
                      stateSlug: e.target.value,
                      district: st?.districts[0] || '',
                    });
                  }}
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  {INDIA_STATES_DIRECTORY.map((st) => (
                    <option key={st.slug} value={st.slug}>
                      {st.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#142119]">District *</label>
                <select
                  value={newMember.district}
                  onChange={(e) =>
                    setNewMember({ ...newMember, district: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  {modalDistrictOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#142119]">
                Village / Gram Panchayat / Organisation *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mandalgarh Cluster, Bhilwara"
                value={newMember.villageOrOrg}
                onChange={(e) =>
                  setNewMember({ ...newMember, villageOrOrg: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </div>

            {newMember.formType !== 'harit-mitra' && (
              <div className="space-y-1">
                <label className="block font-semibold text-[#142119]">
                  Assign Under Harit Mitra (Optional)
                </label>
                <select
                  value={newMember.referredByHaritMitra}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      referredByHaritMitra: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="">None / Direct Registration</option>
                  {availableHaritMitrasWithCodes.map((hm) => {
                    const code =
                      String(hm.customFields?.referralCode || '').trim() ||
                      hm.applicationId;
                    return (
                      <option key={hm.id} value={code}>
                        {hm.applicantName} ({code} · {hm.district})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-semibold text-[#142119]">Notes</label>
              <textarea
                rows={2}
                placeholder="Role notes, cluster coverage, or onboarding details..."
                value={newMember.details}
                onChange={(e) =>
                  setNewMember({ ...newMember, details: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDF2EE]">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DCE5DE] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBusy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] hover:bg-[#0F351E] disabled:opacity-60 text-white font-semibold cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{createBusy ? 'Issuing ID...' : 'Create & Issue Unique ID'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
