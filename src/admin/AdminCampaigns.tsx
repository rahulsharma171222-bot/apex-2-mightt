import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Flag,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Users,
  X,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import type {
  AdminCampaignRecord,
  AdminDistrictRecord,
  AdminFormDefinition,
} from './types';
import type { CampaignRoleSpec } from '../db/schema';
import { INDIA_STATES_DIRECTORY, findStateByNameOrSlug } from '../data/indiaLocations';
import { generateUniqueCampaignCode } from '../utils/adminLogic';

interface AdminCampaignsProps {
  campaigns: AdminCampaignRecord[];
  districts: AdminDistrictRecord[];
  forms: AdminFormDefinition[];
  onSaveCampaign: (campaign: Partial<AdminCampaignRecord>) => Promise<void>;
  onDeleteCampaign: (id: string) => Promise<void>;
}

const MISSION_PILLARS = [
  'Harit Rajasthan',
  'Harit Bharat',
  'Organic Farming & Rural Development',
  'Clean Energy & Solar',
  'Clean India Plastic-Free',
  'Women Empowerment',
  'Skill Development & Employment',
  'Heritage & Water Conservation',
  'Self-Reliant Gaushala',
  'Senior Care & Mental Wellness',
];

function createBlankRole(index: number): CampaignRoleSpec {
  return {
    id: `role-${Date.now()}-${index}`,
    roleCode: `ROLE-${String(index + 1).padStart(2, '0')}`,
    titleEn: '',
    titleHi: '',
    descriptionEn: '',
    descriptionHi: '',
    formType: 'volunteer',
    maxSlots: 50,
    isOpen: true,
  };
}

export function AdminCampaigns({
  campaigns,
  districts,
  forms,
  onSaveCampaign,
  onDeleteCampaign,
}: AdminCampaignsProps) {
  const [editing, setEditing] = useState<Partial<AdminCampaignRecord> | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openNewCampaign = () => {
    const defaultDistrict = 'Bhilwara';
    setEditing({
      id: '',
      campaignCode: generateUniqueCampaignCode(defaultDistrict),
      titleEn: '',
      titleHi: '',
      summaryEn: '',
      summaryHi: '',
      missionPillar: 'Harit Rajasthan',
      scope: 'District',
      stateSlug: 'rajasthan',
      stateName: 'Rajasthan',
      district: defaultDistrict,
      subDistrict: '',
      villageOrTown: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2026-12-31',
      status: 'Active',
      isPublished: true,
      bannerUrl: '',
      roles: [
        {
          id: `role-${Date.now()}-1`,
          roleCode: 'HM-COORD',
          titleEn: 'Village Harit Mitra Coordinator',
          titleHi: 'ग्राम हरित मित्र समन्वयक',
          descriptionEn: 'Lead local village outreach, registrations, and sapling follow-up.',
          descriptionHi: 'स्थानीय ग्राम संपर्क, पंजीकरण एवं पौध निगरानी समन्वय।',
          formType: 'harit-mitra',
          maxSlots: 25,
          isOpen: true,
        },
        {
          id: `role-${Date.now()}-2`,
          roleCode: 'VOLUNTEER',
          titleEn: 'Community Campaign Volunteer',
          titleHi: 'सामुदायिक अभियान स्वयंसेवक',
          descriptionEn: 'Participate in plantation drives, cleanups, and awareness events.',
          descriptionHi: 'वृक्षारोपण, स्वच्छता एवं जनजागरूकता गतिविधियों में सहभागिता।',
          formType: 'volunteer',
          maxSlots: 100,
          isOpen: true,
        },
      ],
    });
  };

  // Cascading districts list for the currently selected State in the editor
  const editorDistrictOptions = useMemo(() => {
    if (!editing) return [];
    const st = findStateByNameOrSlug(editing.stateSlug || editing.stateName || 'rajasthan');
    const fromDirectory = st ? st.districts : [];
    const fromAdmin = districts
      .filter((d) => !st || (d.stateSlug || 'rajasthan') === st.slug)
      .map((d) => d.nameEn);
    const current = editing.district ? [editing.district] : [];
    return Array.from(new Set([...fromDirectory, ...fromAdmin, ...current])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [editing, districts]);

  // Sub-district suggestions for the selected district
  const editorSubDistrictSuggestions = useMemo(() => {
    if (!editing?.district) return [];
    const match = districts.find(
      (d) => d.nameEn.toLowerCase() === String(editing.district).toLowerCase()
    );
    return match?.subDistricts ?? [];
  }, [editing?.district, districts]);

  // Filter bar options
  const filterDistrictOptions = useMemo(() => {
    const st =
      filterState !== 'all' ? findStateByNameOrSlug(filterState) : undefined;
    const fromCampaigns = campaigns
      .filter((c) => !st || c.stateSlug === st.slug || c.stateName === st.nameEn)
      .map((c) => c.district)
      .filter(Boolean);
    const fromDir = st ? st.districts : [];
    return Array.from(new Set([...fromCampaigns, ...fromDir])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [campaigns, filterState]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (filterState !== 'all' && c.stateSlug !== filterState && c.stateName !== filterState) {
        return false;
      }
      if (filterDistrict !== 'all' && c.district !== filterDistrict) {
        return false;
      }
      return true;
    });
  }, [campaigns, filterState, filterDistrict]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // Clipboard fallback not required
    }
  };

  const handleStateChange = (nextStateSlug: string) => {
    if (!editing) return;
    if (nextStateSlug === 'all-india') {
      setEditing({
        ...editing,
        scope: 'National',
        stateSlug: 'all-india',
        stateName: 'All India',
        district: 'All Districts',
        subDistrict: '',
        villageOrTown: '',
      });
      return;
    }
    const st = findStateByNameOrSlug(nextStateSlug);
    const firstDist = st?.districts[0] ?? '';
    setEditing({
      ...editing,
      stateSlug: st?.slug ?? nextStateSlug,
      stateName: st?.nameEn ?? nextStateSlug,
      district: firstDist,
      subDistrict: '',
      villageOrTown: '',
    });
  };

  const handleRegenerateCampaignId = () => {
    if (!editing) return;
    const locSeed = editing.district || editing.stateName || 'IND';
    setEditing({
      ...editing,
      campaignCode: generateUniqueCampaignCode(locSeed),
    });
  };

  const handleAddRole = () => {
    if (!editing) return;
    const roles = editing.roles ?? [];
    setEditing({
      ...editing,
      roles: [...roles, createBlankRole(roles.length)],
    });
  };

  const handleUpdateRole = (idx: number, patch: Partial<CampaignRoleSpec>) => {
    if (!editing) return;
    const roles = [...(editing.roles ?? [])];
    roles[idx] = { ...roles[idx], ...patch };
    setEditing({ ...editing, roles });
  };

  const handleRemoveRole = (idx: number) => {
    if (!editing) return;
    const roles = (editing.roles ?? []).filter((_, i) => i !== idx);
    setEditing({ ...editing, roles });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.titleEn?.trim()) return;
    setSaving(true);
    try {
      await onSaveCampaign(editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const registrableForms = useMemo(
    () => forms.filter((f) => f.id !== 'contact'),
    [forms]
  );

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Location Campaigns &amp; Frontend Participation Roles
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
            {campaigns.length} total campaigns · Create location-specific drives (State → District → Tehsil → Village), generate Unique Campaign IDs, and define selectable frontend Roles
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter campaigns by state"
            value={filterState}
            onChange={(e) => {
              setFilterState(e.target.value);
              setFilterDistrict('all');
            }}
            className="px-3 py-2 text-xs rounded-xl border border-[#DCE5DE] bg-white"
          >
            <option value="all">All States</option>
            {INDIA_STATES_DIRECTORY.map((st) => (
              <option key={st.slug} value={st.slug}>
                {st.nameEn}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter campaigns by district"
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#DCE5DE] bg-white"
          >
            <option value="all">All Districts</option>
            {filterDistrictOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={openNewCampaign}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaign Editor Panel */}
      {editing && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#368737]/45 p-5 sm:p-6 space-y-6 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3.5">
            <div>
              <h3 className="text-sm font-bold text-[#142119]">
                {editing.id
                  ? `Edit Campaign · ${editing.titleEn}`
                  : 'Create New Location Campaign & Frontend Roles'}
              </h3>
              <p className="text-[11px] text-[#55685C] mt-0.5">
                Published campaigns and their custom Roles appear immediately on Harit Bharat Explorer and link directly to the Registration Forms.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="p-2 rounded-lg text-[#55685C] hover:bg-[#F3F6F3] hover:text-[#142119] cursor-pointer"
              aria-label="Close campaign editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step 1: Unique Campaign ID & Core Info */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#55685C]">
              1. Campaign Identity &amp; Unique ID
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-5 space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Unique Campaign ID
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={editing.campaignCode ?? ''}
                    onChange={(e) =>
                      setEditing({ ...editing, campaignCode: e.target.value.toUpperCase() })
                    }
                    className="flex-1 rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] px-3 py-2 font-mono font-bold text-[#144527]"
                    placeholder="GVD-CMP-BHL-2026-1001"
                  />
                  <button
                    type="button"
                    onClick={handleRegenerateCampaignId}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#CBE0CC] bg-[#F4F8F3] hover:bg-[#E7F2E8] text-[#144527] font-semibold cursor-pointer whitespace-nowrap shrink-0"
                    title="Generate a fresh Unique Campaign ID"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Generate ID</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Mission Pillar
                </label>
                <select
                  value={editing.missionPillar ?? 'Harit Rajasthan'}
                  onChange={(e) =>
                    setEditing({ ...editing, missionPillar: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  {MISSION_PILLARS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3 space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Status
                </label>
                <select
                  value={editing.status ?? 'Active'}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as 'Planned' | 'Active' | 'Completed',
                    })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Campaign Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhilwara Harit Gram Agroforestry Campaign 2026"
                  value={editing.titleEn ?? ''}
                  onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Campaign Title (Hindi)
                </label>
                <input
                  type="text"
                  placeholder="उदा. भीलवाड़ा हरित ग्राम कृषि-वानिकी अभियान 2026"
                  value={editing.titleHi ?? ''}
                  onChange={(e) => setEditing({ ...editing, titleHi: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Summary &amp; Goals (English)
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain campaign objectives and community participation..."
                  value={editing.summaryEn ?? ''}
                  onChange={(e) => setEditing({ ...editing, summaryEn: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Summary &amp; Goals (Hindi)
                </label>
                <textarea
                  rows={2}
                  placeholder="अभियान का उद्देश्य और जन-सहभागिता विवरण..."
                  value={editing.summaryHi ?? ''}
                  onChange={(e) => setEditing({ ...editing, summaryHi: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Pan-India Cascading Location Hierarchy */}
          <div className="border-t border-[#EDF2EE] pt-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#55685C]">
              2. Target Location Hierarchy (State → District → Tehsil/City → Village/Kasba)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Scope
                </label>
                <select
                  value={editing.scope ?? 'District'}
                  onChange={(e) => setEditing({ ...editing, scope: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="District">District Level</option>
                  <option value="Local">Local / Tehsil / Village</option>
                  <option value="Statewide">Statewide</option>
                  <option value="National">National (All India)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  State / UT *
                </label>
                <select
                  value={editing.stateSlug ?? 'rajasthan'}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="all-india">All India (National)</option>
                  {INDIA_STATES_DIRECTORY.map((st) => (
                    <option key={st.slug} value={st.slug}>
                      {st.nameEn} ({st.districts.length} dist.)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  District ({editorDistrictOptions.length}) *
                </label>
                <select
                  value={editing.district ?? ''}
                  onChange={(e) =>
                    setEditing({ ...editing, district: e.target.value, subDistrict: '' })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="">All Districts in State</option>
                  {editorDistrictOptions.map((dName) => (
                    <option key={dName} value={dName}>
                      {dName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Sub-District / City / Tehsil
                </label>
                <input
                  type="text"
                  list="campaign-subdistricts-list"
                  placeholder="e.g. Mandalgarh / Sardarshahar"
                  value={editing.subDistrict ?? ''}
                  onChange={(e) => setEditing({ ...editing, subDistrict: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <datalist id="campaign-subdistricts-list">
                  {editorSubDistrictSuggestions.map((sd) => (
                    <option key={sd} value={sd} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Town / Kasba / Village
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gharsisar / Mandore"
                  value={editing.villageOrTown ?? ''}
                  onChange={(e) =>
                    setEditing({ ...editing, villageOrTown: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  Start Date
                </label>
                <input
                  type="date"
                  value={editing.startDate ?? ''}
                  onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#142119]">
                  End Date
                </label>
                <input
                  type="date"
                  value={editing.endDate ?? ''}
                  onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
                />
              </div>
              <label className="flex items-center gap-2.5 pt-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(editing.isPublished ?? true)}
                  onChange={(e) =>
                    setEditing({ ...editing, isPublished: e.target.checked })
                  }
                  className="rounded border-[#368737]"
                />
                <span className="font-semibold text-[#144527]">
                  Publish live on Public Website (Harit Bharat Explorer)
                </span>
              </label>
            </div>
          </div>

          {/* Step 3: Frontend Custom Participation Roles Builder */}
          <div className="border-t border-[#EDF2EE] pt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#55685C]">
                  3. Frontend Campaign Roles ({(editing.roles ?? []).length})
                </p>
                <p className="text-[11px] text-[#55685C] mt-0.5">
                  Each role added below appears as a selectable role card on the public Campaign section and pre-fills the linked registration form.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRole}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4F8F3] hover:bg-[#E7F2E8] border border-[#CBE0CC] text-[#144527] font-semibold cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Frontend Role</span>
              </button>
            </div>

            {(editing.roles ?? []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#DCE5DE] p-5 text-center text-[#55685C]">
                No frontend participation roles added yet. Click &ldquo;Add Frontend Role&rdquo; to let visitors join this campaign in specific roles.
              </div>
            ) : (
              <div className="space-y-3">
                {(editing.roles ?? []).map((roleItem, idx) => (
                  <div
                    key={roleItem.id || idx}
                    className="rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#144527] font-mono">
                        Role #{idx + 1} · {roleItem.roleCode || `ROLE-0${idx + 1}`}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#144527] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={roleItem.isOpen !== false}
                            onChange={(e) =>
                              handleUpdateRole(idx, { isOpen: e.target.checked })
                            }
                            className="rounded border-[#368737]"
                          />
                          <span>Open on Frontend</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Role Title (English) *"
                        value={roleItem.titleEn}
                        onChange={(e) =>
                          handleUpdateRole(idx, { titleEn: e.target.value })
                        }
                        className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Role Title (Hindi)"
                        value={roleItem.titleHi}
                        onChange={(e) =>
                          handleUpdateRole(idx, { titleHi: e.target.value })
                        }
                        className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-2"
                      />
                      <select
                        value={roleItem.formType}
                        onChange={(e) =>
                          handleUpdateRole(idx, { formType: e.target.value })
                        }
                        className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-2"
                        aria-label="Linked Registration Form"
                      >
                        {registrableForms.length > 0 ? (
                          registrableForms.map((f) => (
                            <option key={f.id} value={f.id}>
                              Form: {f.titleEn.replace(/^\d+\.\s*/, '')}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="harit-mitra">Form: Harit Mitra</option>
                            <option value="farmer">Form: Farmer</option>
                            <option value="volunteer">Form: Volunteer</option>
                            <option value="women-shg">Form: Women SHG</option>
                            <option value="school-college">Form: School / College</option>
                          </>
                        )}
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Code (e.g. HM-01)"
                          value={roleItem.roleCode}
                          onChange={(e) =>
                            handleUpdateRole(idx, {
                              roleCode: e.target.value.toUpperCase(),
                            })
                          }
                          className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-2 font-mono"
                        />
                        <input
                          type="number"
                          min={0}
                          placeholder="Slots (0=Any)"
                          title="Target Slots (0 = Unlimited)"
                          value={roleItem.maxSlots}
                          onChange={(e) =>
                            handleUpdateRole(idx, {
                              maxSlots: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-2 font-mono tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Short role responsibility (English)"
                        value={roleItem.descriptionEn}
                        onChange={(e) =>
                          handleUpdateRole(idx, { descriptionEn: e.target.value })
                        }
                        className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                      />
                      <input
                        type="text"
                        placeholder="संक्षिप्त भूमिका विवरण (Hindi)"
                        value={roleItem.descriptionHi}
                        onChange={(e) =>
                          handleUpdateRole(idx, { descriptionHi: e.target.value })
                        }
                        className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save & Close Footer */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-[#EDF2EE]">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2.5 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#F5F7F5] text-[#142119] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] disabled:opacity-60 text-white font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Campaign...' : 'Save & Publish Campaign'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Campaigns List */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-10 text-center space-y-3">
          <Flag className="w-8 h-8 text-[#7C8F82] mx-auto" />
          <p className="text-sm font-bold text-[#142119]">
            No campaigns match the selected location filter
          </p>
          <p className="text-xs text-[#55685C]">
            Create a district or village campaign with custom frontend participation roles.
          </p>
          <button
            type="button"
            onClick={openNewCampaign}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCampaigns.map((cmp) => {
            const locParts = [
              cmp.villageOrTown,
              cmp.subDistrict,
              cmp.district,
              cmp.stateName,
            ].filter(Boolean);
            return (
              <div
                key={cmp.id}
                className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#55685C]">
                      <span className="font-mono font-bold text-[#144527]">
                        {cmp.campaignCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(cmp.campaignCode)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#368737] hover:underline cursor-pointer"
                        title="Copy Unique Campaign ID"
                      >
                        {copiedCode === cmp.campaignCode ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                      <span aria-hidden="true">·</span>
                      <span>{cmp.missionPillar}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          cmp.status === 'Active'
                            ? 'text-emerald-700 font-semibold'
                            : cmp.status === 'Completed'
                            ? 'text-slate-600 font-semibold'
                            : 'text-amber-700 font-semibold'
                        }
                      >
                        {cmp.status}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{cmp.isPublished ? 'Published Live' : 'Draft Only'}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#142119]">
                      {cmp.titleEn}
                      {cmp.titleHi && cmp.titleHi !== cmp.titleEn ? (
                        <span className="font-normal text-[#4F6356] ml-2 text-sm">
                          ({cmp.titleHi})
                        </span>
                      ) : null}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#55685C]">
                      <span className="inline-flex items-center gap-1 font-medium text-[#144527]">
                        <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                        {locParts.join(', ')} ({cmp.scope})
                      </span>
                      {(cmp.startDate || cmp.endDate) && (
                        <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                          <Calendar className="w-3.5 h-3.5 text-[#7C8F82]" />
                          {cmp.startDate || 'TBD'} → {cmp.endDate || 'Ongoing'}
                        </span>
                      )}
                    </div>

                    {cmp.summaryEn && (
                      <p className="text-xs text-[#3C5044] leading-relaxed max-w-4xl">
                        {cmp.summaryEn}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...cmp, roles: cmp.roles.map((r) => ({ ...r })) })}
                      className="px-3.5 py-2 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#F4F8F3] text-[#144527] text-xs font-semibold cursor-pointer"
                    >
                      Edit Campaign &amp; Roles
                    </button>
                    {confirmDeleteId === cmp.id ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={async () => {
                            await onDeleteCampaign(cmp.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-2 rounded-xl border border-[#DCE5DE] text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(cmp.id)}
                        className="p-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
                        aria-label={`Delete ${cmp.titleEn}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Frontend Roles Table inside Campaign Card */}
                <div className="border-t border-[#EDF2EE] pt-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#55685C] inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#368737]" />
                      <span>Configured Frontend Roles ({cmp.roles.length})</span>
                    </p>
                    <a
                      href="/harit-bharat"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#144527] hover:underline"
                    >
                      <span>View Live on Harit Bharat</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {cmp.roles.length === 0 ? (
                    <p className="text-xs text-[#7C8F82] italic">
                      No frontend roles configured for this campaign yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {cmp.roles.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-xl border border-[#E5ECE6] bg-[#FAFBF8] p-3 flex flex-col justify-between gap-1.5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 text-[11px] text-[#55685C]">
                              <span className="font-mono font-bold text-[#144527]">
                                {r.roleCode}
                              </span>
                              <span
                                className={
                                  r.isOpen
                                    ? 'text-emerald-700 font-semibold'
                                    : 'text-slate-500'
                                }
                              >
                                {r.isOpen ? 'Open' : 'Paused'}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#142119] mt-0.5">
                              {r.titleEn}
                            </p>
                            {r.descriptionEn && (
                              <p className="text-[11px] text-[#55685C] mt-0.5 line-clamp-2">
                                {r.descriptionEn}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#55685C] pt-1.5 border-t border-[#EAEFEA] tabular-nums">
                            <span>Form: {r.formType}</span>
                            <span>
                              {r.maxSlots > 0 ? `${r.maxSlots} slots` : 'Open slots'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
