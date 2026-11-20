import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Flag,
  FolderKanban,
  GitBranch,
  Globe,
  Image as ImageIcon,
  Layers,
  MapPin,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Video,
  X,
} from 'lucide-react';
import type {
  AdminFormDefinition,
  AdminSubmissionRecord,
  MissionAdminConfig,
  ProgrammeLocationLevel,
  ProgrammeLocationTag,
  ProgrammeMediaItem,
  ProgrammeOperationalStatus,
  ProgrammePublicationStatus,
  ProgrammeType,
  UnifiedProgrammeRecord,
} from './types';
import { INDIA_STATES_DIRECTORY, findStateByNameOrSlug } from '../data/indiaLocations';
import {
  buildProgrammeHierarchyTree,
  filterUnifiedProgrammes,
  generateProgrammeCode,
  type ProgrammeTreeNode,
} from '../utils/adminLogic';

interface AdminProgrammeHubProps {
  programmes: UnifiedProgrammeRecord[];
  missions: MissionAdminConfig[];
  forms: AdminFormDefinition[];
  submissions: AdminSubmissionRecord[];
  initialCreateTrigger?: ProgrammeType | null;
  onClearCreateTrigger?: () => void;
  onSaveProgramme: (payload: Partial<UnifiedProgrammeRecord>) => Promise<void>;
  onDeleteProgramme: (id: string) => Promise<void>;
}

const TYPE_META: Record<
  ProgrammeType,
  {
    label: string;
    short: string;
    badgeCls: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  project: {
    label: 'Project',
    short: 'Project',
    badgeCls: 'bg-[#E5F2E7] text-[#144527]',
    icon: FolderKanban,
  },
  campaign: {
    label: 'Campaign',
    short: 'Campaign',
    badgeCls: 'bg-amber-50 text-amber-800',
    icon: Flag,
  },
  event: {
    label: 'Event / Activity',
    short: 'Event',
    badgeCls: 'bg-sky-50 text-sky-800',
    icon: Trophy,
  },
  training: {
    label: 'Training Programme',
    short: 'Training',
    badgeCls: 'bg-violet-50 text-violet-800',
    icon: BookOpen,
  },
};

const PUB_STATUS_OPTIONS: ProgrammePublicationStatus[] = [
  'Draft',
  'Review',
  'Published',
  'Archived',
];

const OPS_STATUS_OPTIONS: ProgrammeOperationalStatus[] = [
  'Proposed',
  'Planned',
  'Under Assessment',
  'Approved',
  'In Progress',
  'Ongoing',
  'Completed',
  'Completed / Verified',
];

const LOCATION_LEVELS: ProgrammeLocationLevel[] = [
  'Entire District',
  'Tehsil / Block',
  'Village / Gram Panchayat',
  'City / Municipality / Ward',
];

function createBlankDraft(
  type: ProgrammeType = 'project',
  parent?: UnifiedProgrammeRecord | null
): Partial<UnifiedProgrammeRecord> {
  const inheritedLocs = parent?.locations?.length
    ? parent.locations.map((l, idx) => ({ ...l, id: `loc-inh-${Date.now()}-${idx}` }))
    : [
        {
          id: `loc-${Date.now()}`,
          stateName: 'Rajasthan',
          district: 'Bhilwara',
          locationLevel: 'Village / Gram Panchayat' as ProgrammeLocationLevel,
          localityName: '',
        },
      ];

  return {
    id: '',
    programmeCode: generateProgrammeCode(type, inheritedLocs[0]?.district || 'IND'),
    type,
    parentId: parent?.id ?? null,
    titleEn: '',
    titleHi: '',
    summaryEn: '',
    summaryHi: '',
    objectivesEn: '',
    objectivesHi: '',
    coverageScope: parent?.coverageScope ?? 'specific',
    locations: inheritedLocs,
    missionSlug: parent?.missionSlug ?? 'harit-rajasthan',
    linkedFormType:
      parent?.linkedFormType ??
      (type === 'project'
        ? 'farmer'
        : type === 'campaign'
        ? 'harit-mitra'
        : type === 'training'
        ? 'skill-training'
        : 'volunteer'),
    publicationStatus: 'Published',
    operationalStatus: 'Proposed',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    venueOrMode: '',
    targetAudience: '',
    seoTitle: '',
    seoDescription: '',
    media: [],
    roles: [],
  };
}

export function AdminProgrammeHub({
  programmes,
  missions,
  forms,
  submissions,
  initialCreateTrigger,
  onClearCreateTrigger,
  onSaveProgramme,
  onDeleteProgramme,
}: AdminProgrammeHubProps) {
  const [typeFilter, setTypeFilter] = useState<'all' | ProgrammeType>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [pubFilter, setPubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'table'>('hierarchy');

  const [editing, setEditing] = useState<Partial<UnifiedProgrammeRecord> | null>(null);
  const [editorTab, setEditorTab] = useState<
    'overview' | 'locations' | 'media' | 'forms' | 'children' | 'distribution'
  >('overview');
  const [saving, setSaving] = useState(false);

  // Location builder mini-state inside Locations tab
  const [newLocState, setNewLocState] = useState('Rajasthan');
  const [newLocDistrict, setNewLocDistrict] = useState('Bhilwara');
  const [newLocLevel, setNewLocLevel] = useState<ProgrammeLocationLevel>(
    'Village / Gram Panchayat'
  );
  const [newLocLocality, setNewLocLocality] = useState('');

  // Media builder mini-state inside Media & Documents tab
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video' | 'pdf'>('photo');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [newMediaLoc, setNewMediaLoc] = useState('');

  React.useEffect(() => {
    if (initialCreateTrigger) {
      setEditing(createBlankDraft(initialCreateTrigger, null));
      setEditorTab('overview');
      onClearCreateTrigger?.();
    }
  }, [initialCreateTrigger, onClearCreateTrigger]);

  const counts = useMemo(
    () => ({
      all: programmes.length,
      project: programmes.filter((p) => p.type === 'project').length,
      campaign: programmes.filter((p) => p.type === 'campaign').length,
      event: programmes.filter((p) => p.type === 'event').length,
      training: programmes.filter((p) => p.type === 'training').length,
    }),
    [programmes]
  );

  const filteredList = useMemo(
    () =>
      filterUnifiedProgrammes(programmes, {
        type: typeFilter,
        stateName: stateFilter,
        publicationStatus: pubFilter,
        query: searchQuery,
      }),
    [programmes, typeFilter, stateFilter, pubFilter, searchQuery]
  );

  const hierarchyTree = useMemo(
    () => buildProgrammeHierarchyTree(filteredList),
    [filteredList]
  );

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    for (const p of programmes) {
      for (const loc of p.locations) {
        if (loc.stateName) set.add(loc.stateName);
      }
    }
    return Array.from(set).sort();
  }, [programmes]);

  const districtOptionsForNewLoc = useMemo(() => {
    const found = findStateByNameOrSlug(newLocState);
    return found?.districts ?? ['Bhilwara', 'Churu', 'Bikaner', 'Phalodi', 'Jodhpur'];
  }, [newLocState]);

  const validParentsForEditing = useMemo(() => {
    if (!editing) return [];
    const currentId = editing.id;
    if (editing.type === 'project') return [];
    if (editing.type === 'campaign') {
      return programmes.filter((p) => p.type === 'project' && p.id !== currentId);
    }
    // Event or Training can live under a Project OR under a Campaign
    return programmes.filter(
      (p) => (p.type === 'project' || p.type === 'campaign') && p.id !== currentId
    );
  }, [editing, programmes]);

  const openCreateNew = (type: ProgrammeType, parent?: UnifiedProgrammeRecord | null) => {
    setEditing(createBlankDraft(type, parent));
    setEditorTab('overview');
  };

  const openEditExisting = (item: UnifiedProgrammeRecord) => {
    setEditing({
      ...item,
      locations: item.locations.map((l) => ({ ...l })),
      media: item.media.map((m) => ({ ...m })),
      roles: item.roles.map((r) => ({ ...r })),
    });
    setEditorTab('overview');
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editing?.titleEn?.trim()) return;
    setSaving(true);
    try {
      await onSaveProgramme(editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const addLocationTag = () => {
    if (!editing) return;
    const tag: ProgrammeLocationTag = {
      id: `loc-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      stateName: newLocState,
      district: newLocDistrict,
      locationLevel: newLocLevel,
      localityName: newLocLocality.trim(),
    };
    setEditing({
      ...editing,
      locations: [...(editing.locations ?? []), tag],
    });
    setNewLocLocality('');
  };

  const removeLocationTag = (id: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      locations: (editing.locations ?? []).filter((l) => l.id !== id),
    });
  };

  const addMediaItem = () => {
    if (!editing || (!newMediaTitle.trim() && !newMediaUrl.trim())) return;
    const list = editing.media ?? [];
    const item: ProgrammeMediaItem = {
      id: `med-${Date.now()}`,
      mediaType: newMediaType,
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || 'Programme Media',
      caption: newMediaCaption.trim(),
      altText: newMediaTitle.trim() || 'GOVEDA field documentation',
      capturedDate: new Date().toISOString().slice(0, 10),
      locationLabel:
        newMediaLoc.trim() ||
        editing.locations?.[0]?.district ||
        'Rajasthan',
      isCover: newMediaType === 'photo' && !list.some((m) => m.isCover),
      isPublic: true,
      displayOrder: list.length + 1,
    };
    setEditing({
      ...editing,
      media: [...list, item],
    });
    setNewMediaTitle('');
    setNewMediaUrl('');
    setNewMediaCaption('');
    setNewMediaLoc('');
  };

  const setCoverMedia = (id: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      media: (editing.media ?? []).map((m) => ({ ...m, isCover: m.id === id })),
    });
  };

  const toggleMediaPublic = (id: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      media: (editing.media ?? []).map((m) =>
        m.id === id ? { ...m, isPublic: !m.isPublic } : m
      ),
    });
  };

  const moveMedia = (idx: number, dir: -1 | 1) => {
    if (!editing) return;
    const arr = [...(editing.media ?? [])];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    const [moved] = arr.splice(idx, 1);
    arr.splice(target, 0, moved);
    setEditing({
      ...editing,
      media: arr.map((m, i) => ({ ...m, displayOrder: i + 1 })),
    });
  };

  const removeMediaItem = (id: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      media: (editing.media ?? []).filter((m) => m.id !== id),
    });
  };

  const getMissionLabel = (slug?: string) => {
    const m = missions.find((x) => x.slug === slug);
    return m ? `${String(m.number).padStart(2, '0')}. ${m.titleEn}` : slug || '—';
  };

  const getFormLabel = (id?: string) => {
    const f = forms.find((x) => x.id === id);
    return f ? f.titleEn : id || 'None';
  };

  const getParentTitle = (parentId?: string | null) => {
    if (!parentId) return null;
    return programmes.find((p) => p.id === parentId)?.titleEn ?? null;
  };

  // Recursive visual hierarchy card renderer (Project -> Campaign -> Event / Training)
  const renderTreeNode = (
    node: ProgrammeTreeNode<UnifiedProgrammeRecord>,
    depth: number
  ) => {
    const p = node.item;
    const meta = TYPE_META[p.type] ?? TYPE_META.project;
    const Icon = meta.icon;
    const cover = p.media.find((m) => m.isCover && m.url) ?? p.media.find((m) => m.mediaType === 'photo' && m.url);

    return (
      <div
        key={p.id}
        className={depth > 0 ? 'ml-5 sm:ml-8 pl-4 border-l-2 border-[#CFE2D3] space-y-3' : 'space-y-3'}
      >
        <div className="admin-card p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {cover ? (
              <img
                src={cover.url}
                alt={cover.altText || p.titleEn}
                className="w-16 h-16 rounded-xl object-cover border border-[#DCE5DE] shrink-0"
              />
            ) : (
              <span
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${meta.badgeCls}`}
              >
                <Icon className="w-5 h-5" />
              </span>
            )}

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className={`px-2 py-0.5 rounded-md font-bold ${meta.badgeCls}`}>
                  {meta.label}
                </span>
                <span className="font-mono font-semibold text-[#55685C]">{p.programmeCode}</span>
                <span
                  className={`font-semibold ${
                    p.publicationStatus === 'Published'
                      ? 'text-emerald-700'
                      : p.publicationStatus === 'Review'
                      ? 'text-amber-700'
                      : 'text-[#6B7E71]'
                  }`}
                >
                  · {p.publicationStatus}
                </span>
                <span className="text-[#144527] font-semibold">· {p.operationalStatus}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[#142119] leading-snug">
                {p.titleEn}
              </h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#55685C]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                  {p.coverageScope === 'india-wide'
                    ? `India-Wide (${p.locations.length} hub${p.locations.length === 1 ? '' : 's'})`
                    : p.locations.length > 0
                    ? p.locations
                        .slice(0, 2)
                        .map((l) => `${l.district}${l.localityName ? ` (${l.localityName})` : ''}`)
                        .join(' · ') +
                      (p.locations.length > 2 ? ` +${p.locations.length - 2} more` : '')
                    : 'No location tagged'}
                </span>
                <span>· Form: {p.linkedFormType || '—'}</span>
                <span>· {p.media.length} media</span>
                {node.children.length > 0 && (
                  <span className="font-semibold text-[#144527]">
                    · {node.children.length} nested child{node.children.length === 1 ? '' : 'ren'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Bar: Add Child Hierarchy + Edit + Delete */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {p.type === 'project' && (
              <button
                type="button"
                onClick={() => openCreateNew('campaign', p)}
                className="admin-btn-soft inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Campaign</span>
              </button>
            )}
            {(p.type === 'project' || p.type === 'campaign') && (
              <button
                type="button"
                onClick={() => openCreateNew('event', p)}
                className="admin-btn-secondary inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event / Activity</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => openEditExisting(p)}
              className="admin-btn-primary inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer whitespace-nowrap"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Manage</span>
            </button>
            <button
              type="button"
              onClick={() => onDeleteProgramme(p.id)}
              aria-label={`Delete ${p.titleEn}`}
              className="admin-btn-secondary p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {node.children.length > 0 && (
          <div className="space-y-3">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Command Banner */}
      <div className="admin-card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
            <GitBranch className="w-3.5 h-3.5" />
            <span>One Central Creation System · Multi-Page Auto-Distribution</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#142119] mt-0.5">
            All Programmes — Project → Campaign → Event &amp; Training Hierarchy
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Create or edit once here. Published records automatically appear across Harit Rajasthan, National Projects, Mission Pages, Events, and Training.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openCreateNew('project', null)}
            className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Programme</span>
          </button>
        </div>
      </div>

      {/* Central Creation & 6-Tab Editor Panel */}
      {editing && (
        <div className="admin-card border-[#368737]/40 p-5 sm:p-6 space-y-5 admin-view-enter">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDF2EE] pb-3.5">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#142119]">
                {editing.id
                  ? `Manage ${TYPE_META[editing.type ?? 'project'].label} · ${editing.titleEn}`
                  : `Create New Programme`}
              </h3>
              <p className="text-[11px] text-[#55685C] font-mono mt-0.5">
                {editing.programmeCode}
                {getParentTitle(editing.parentId)
                  ? ` · Child of "${getParentTitle(editing.parentId)}"`
                  : ' · Top-Level Programme'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              aria-label="Close programme studio"
              className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Live Selection Preview Strip (per User Spec §3) */}
          <div className="rounded-2xl bg-[#F4F9F5] border border-[#DCEAE0] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#1E3326]">
              <span>
                <strong>Type:</strong> {TYPE_META[editing.type ?? 'project'].label}
              </span>
              <span>
                <strong>Coverage:</strong>{' '}
                {editing.coverageScope === 'india-wide'
                  ? 'India-Wide'
                  : (editing.locations ?? []).length > 0
                  ? `${editing.locations![0].stateName} → ${editing.locations![0].district} (${editing.locations!.length} tag${editing.locations!.length === 1 ? '' : 's'})`
                  : 'Assign locations'}
              </span>
              <span>
                <strong>Mission:</strong> {getMissionLabel(editing.missionSlug)}
              </span>
              <span>
                <strong>Form:</strong> {editing.linkedFormType || 'None'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded-md bg-white border border-[#DCE5DE] text-[#144527]">
                Pub: {editing.publicationStatus}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-[#DCE5DE] text-amber-800">
                Ops: {editing.operationalStatus}
              </span>
            </div>
          </div>

          {/* 6 Inspector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#EDF2EE] pb-3">
            {(
              [
                ['overview', '1. Overview & Hierarchy'],
                ['locations', `2. Locations (${(editing.locations ?? []).length})`],
                ['media', `3. Media & Docs (${(editing.media ?? []).length})`],
                ['forms', '4. Registration Form'],
                ['children', '5. Child Items'],
                ['distribution', '6. Live Public Displays'],
              ] as const
            ).map(([tabKey, tabLabel]) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setEditorTab(tabKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  editorTab === tabKey ? 'admin-btn-primary' : 'admin-btn-secondary'
                }`}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* TAB 1: OVERVIEW & HIERARCHY */}
            {editorTab === 'overview' && (
              <div className="space-y-4">
                {/* Step 1: What are you creating? */}
                <div className="space-y-1.5">
                  <span className="font-bold text-[#142119]">1. What are you creating? *</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['project', 'campaign', 'event', 'training'] as ProgrammeType[]).map((t) => {
                      const MIcon = TYPE_META[t].icon;
                      const active = editing.type === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              type: t,
                              parentId: t === 'project' ? null : editing.parentId ?? null,
                              programmeCode: editing.id
                                ? editing.programmeCode
                                : generateProgrammeCode(
                                    t,
                                    editing.locations?.[0]?.district || 'IND'
                                  ),
                            })
                          }
                          className={`p-3 rounded-xl flex items-center gap-2 font-semibold cursor-pointer transition-all ${
                            active ? 'admin-btn-primary' : 'admin-btn-secondary'
                          }`}
                        >
                          <MIcon className="w-4 h-4 shrink-0" />
                          <span>{TYPE_META[t].label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Parent Hierarchy + Unique Code */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">
                      Parent Programme (Hierarchy Link)
                    </span>
                    <select
                      disabled={editing.type === 'project'}
                      value={editing.parentId ?? ''}
                      onChange={(e) =>
                        setEditing({ ...editing, parentId: e.target.value || null })
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2 disabled:bg-[#F5F7F6]"
                    >
                      <option value="">
                        {editing.type === 'project'
                          ? 'Top-Level Project (No Parent)'
                          : 'Standalone (No Parent)'}
                      </option>
                      {validParentsForEditing.map((par) => (
                        <option key={par.id} value={par.id}>
                          [{TYPE_META[par.type].short}] {par.titleEn}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Primary Mission (10 Pillars) *</span>
                    <select
                      value={editing.missionSlug ?? 'harit-rajasthan'}
                      onChange={(e) => {
                        const primary = e.target.value;
                        const existing = editing.missionSlugs ?? [];
                        const merged = Array.from(new Set([primary, ...existing]));
                        setEditing({ ...editing, missionSlug: primary, missionSlugs: merged });
                      }}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                    >
                      {missions.map((m) => (
                        <option key={m.slug} value={m.slug}>
                          {String(m.number).padStart(2, '0')}. {m.titleEn}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="space-y-1">
                    <span className="font-semibold text-[#142119]">Unique Programme ID</span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={editing.programmeCode ?? ''}
                        onChange={(e) =>
                          setEditing({ ...editing, programmeCode: e.target.value.toUpperCase() })
                        }
                        className="flex-1 rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            programmeCode: generateProgrammeCode(
                              editing.type ?? 'project',
                              editing.locations?.[0]?.district || 'IND'
                            ),
                          })
                        }
                        className="admin-btn-soft px-2.5 py-2 rounded-xl font-semibold cursor-pointer"
                        title="Generate fresh unique ID"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Linked Missions (One record -> multiple relevant Mission pages) */}
                <div className="rounded-xl bg-[#F7FAF7] border border-[#DCE7DE] p-3.5 space-y-2">
                  <p className="font-semibold text-[#142119]">
                    Additional Relevant Missions (Auto-publishes on selected Mission pages without duplicating)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {missions.map((m) => {
                      const activeSet = new Set(
                        editing.missionSlugs && editing.missionSlugs.length > 0
                          ? editing.missionSlugs
                          : [editing.missionSlug ?? 'harit-rajasthan']
                      );
                      const checked = activeSet.has(m.slug);
                      return (
                        <label
                          key={m.slug}
                          className="inline-flex items-center gap-2 text-[11px] text-[#2A3A30] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = new Set(activeSet);
                              if (e.target.checked) {
                                next.add(m.slug);
                              } else if (m.slug !== editing.missionSlug) {
                                next.delete(m.slug);
                              }
                              setEditing({ ...editing, missionSlugs: Array.from(next) });
                            }}
                          />
                          <span className="truncate">
                            {String(m.number).padStart(2, '0')}. {m.titleEn}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bilingual Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Programme Title (English) *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bhilwara Green Village Development"
                      value={editing.titleEn ?? ''}
                      onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">कार्यक्रम शीर्षक (Hindi)</span>
                    <input
                      type="text"
                      placeholder="उदा. भीलवाड़ा हरित ग्राम विकास परियोजना"
                      value={editing.titleHi ?? ''}
                      onChange={(e) => setEditing({ ...editing, titleHi: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>
                </div>

                {/* Dual Status Workflow (Publication vs Operational) + Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Publication Status</span>
                    <select
                      value={editing.publicationStatus ?? 'Draft'}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          publicationStatus: e.target.value as ProgrammePublicationStatus,
                        })
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                    >
                      {PUB_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Operational Status</span>
                    <select
                      value={editing.operationalStatus ?? 'Proposed'}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          operationalStatus: e.target.value as ProgrammeOperationalStatus,
                        })
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                    >
                      {OPS_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Start Date</span>
                    <input
                      type="date"
                      value={editing.startDate ?? ''}
                      onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">End Date</span>
                    <input
                      type="date"
                      value={editing.endDate ?? ''}
                      onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>
                </div>

                {/* Summaries & Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Overview / Summary (English)</span>
                    <textarea
                      rows={3}
                      value={editing.summaryEn ?? ''}
                      onChange={(e) => setEditing({ ...editing, summaryEn: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">संक्षिप्त विवरण (Hindi)</span>
                    <textarea
                      rows={3}
                      value={editing.summaryHi ?? ''}
                      onChange={(e) => setEditing({ ...editing, summaryHi: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">
                      Venue / Implementation Mode
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Mandalgarh Panchayat Ground / Hybrid Workshop"
                      value={editing.venueOrMode ?? ''}
                      onChange={(e) => setEditing({ ...editing, venueOrMode: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Target Participants</span>
                    <input
                      type="text"
                      placeholder="e.g. Farmers, Youth Volunteers, Women SHGs"
                      value={editing.targetAudience ?? ''}
                      onChange={(e) => setEditing({ ...editing, targetAudience: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: MULTI-LOCATION & INDIA-WIDE COVERAGE */}
            {editorTab === 'locations' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, coverageScope: 'specific' })}
                    className={`px-3.5 py-2 rounded-xl font-semibold cursor-pointer ${
                      editing.coverageScope !== 'india-wide'
                        ? 'admin-btn-primary'
                        : 'admin-btn-secondary'
                    }`}
                  >
                    Specific State / District(s)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, coverageScope: 'india-wide' })}
                    className={`px-3.5 py-2 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-1.5 ${
                      editing.coverageScope === 'india-wide'
                        ? 'admin-btn-primary'
                        : 'admin-btn-secondary'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Multiple States / India-Wide</span>
                  </button>
                </div>

                {/* Add Location Tag Row */}
                <div className="rounded-2xl bg-[#F7FAF7] border border-[#DCE7DE] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">State / UT</span>
                    <select
                      value={newLocState}
                      onChange={(e) => {
                        const st = e.target.value;
                        setNewLocState(st);
                        const match = findStateByNameOrSlug(st);
                        setNewLocDistrict(match?.districts[0] ?? '');
                      }}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    >
                      {INDIA_STATES_DIRECTORY.map((st) => (
                        <option key={st.slug} value={st.nameEn}>
                          {st.nameEn}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">District</span>
                    <select
                      value={newLocDistrict}
                      onChange={(e) => setNewLocDistrict(e.target.value)}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    >
                      {districtOptionsForNewLoc.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Location Level</span>
                    <select
                      value={newLocLevel}
                      onChange={(e) =>
                        setNewLocLevel(e.target.value as ProgrammeLocationLevel)
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    >
                      {LOCATION_LEVELS.map((lv) => (
                        <option key={lv} value={lv}>
                          {lv}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">
                      Village / Block / Ward
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Mandalgarh GP"
                      value={newLocLocality}
                      onChange={(e) => setNewLocLocality(e.target.value)}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={addLocationTag}
                    className="admin-btn-primary inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign Location</span>
                  </button>
                </div>

                {/* Assigned Locations List */}
                <div className="space-y-2">
                  <p className="font-semibold text-[#142119]">
                    Assigned Locations ({(editing.locations ?? []).length})
                  </p>
                  {(editing.locations ?? []).length === 0 ? (
                    <p className="text-[#6B7E71] py-3">
                      No specific districts tagged yet. Add one or more locations above.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {(editing.locations ?? []).map((loc) => (
                        <div
                          key={loc.id}
                          className="rounded-xl border border-[#DCE5DE] bg-white px-3.5 py-2.5 flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-bold text-[#142119]">
                              {loc.stateName} → {loc.district}
                              {loc.localityName ? ` → ${loc.localityName}` : ''}
                            </p>
                            <p className="text-[11px] text-[#55685C]">{loc.locationLevel}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLocationTag(loc.id)}
                            aria-label={`Remove location ${loc.district}`}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: REUSABLE MEDIA & DOCUMENTS */}
            {editorTab === 'media' && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#F7FAF7] border border-[#DCE7DE] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Asset Type</span>
                    <select
                      value={newMediaType}
                      onChange={(e) =>
                        setNewMediaType(e.target.value as 'photo' | 'video' | 'pdf')
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    >
                      <option value="photo">Photograph</option>
                      <option value="video">Video Link</option>
                      <option value="pdf">PDF Report / Guide</option>
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Title / Alt Text</span>
                    <input
                      type="text"
                      placeholder="e.g. Sapling Planting Day 1"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">URL / Asset Path</span>
                    <input
                      type="text"
                      placeholder="/assets/hero-harit-clean.jpg"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Caption &amp; Location</span>
                    <input
                      type="text"
                      placeholder="Brief caption..."
                      value={newMediaCaption}
                      onChange={(e) => setNewMediaCaption(e.target.value)}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-2"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={addMediaItem}
                    className="admin-btn-primary inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach Media</span>
                  </button>
                </div>

                {(editing.media ?? []).length === 0 ? (
                  <p className="text-[#6B7E71] py-3">
                    No photographs, videos, or PDF reports attached yet. Attach assets above—they automatically display on linked District, Project, Mission, and Gallery views without duplicating files.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {(editing.media ?? []).map((m, idx) => (
                      <div
                        key={m.id}
                        className="rounded-xl border border-[#DCE5DE] bg-white p-3 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {m.mediaType === 'photo' && m.url ? (
                            <img
                              src={m.url}
                              alt={m.altText || m.title}
                              className="w-12 h-12 rounded-lg object-cover border border-[#DCE5DE] shrink-0"
                            />
                          ) : (
                            <span className="w-10 h-10 rounded-lg bg-[#EDF6EE] text-[#144527] flex items-center justify-center shrink-0">
                              {m.mediaType === 'video' ? (
                                <Video className="w-4 h-4" />
                              ) : m.mediaType === 'pdf' ? (
                                <FileText className="w-4 h-4" />
                              ) : (
                                <ImageIcon className="w-4 h-4" />
                              )}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-[#142119] truncate">
                              {m.title}{' '}
                              {m.isCover && (
                                <span className="text-emerald-700 font-semibold">· Cover</span>
                              )}
                            </p>
                            <p className="text-[11px] text-[#55685C] truncate">
                              {m.caption || m.url || 'Document attached'} · {m.capturedDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {m.mediaType === 'photo' && !m.isCover && (
                            <button
                              type="button"
                              onClick={() => setCoverMedia(m.id)}
                              className="admin-btn-soft px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" />
                              <span>Set Cover</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleMediaPublic(m.id)}
                            className="admin-btn-secondary px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                          >
                            {m.isPublic ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-700" />
                                <span>Public</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-[#6B7E71]" />
                                <span>Private</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMedia(idx, -1)}
                            aria-label="Move media up"
                            className="admin-btn-secondary p-1 rounded-lg cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMedia(idx, 1)}
                            aria-label="Move media down"
                            className="admin-btn-secondary p-1 rounded-lg cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMediaItem(m.id)}
                            aria-label={`Remove ${m.title}`}
                            className="admin-btn-secondary p-1 rounded-lg text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: REUSABLE REGISTRATION FORM */}
            {editorTab === 'forms' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">
                      Connected Registration / Participation Form
                    </span>
                    <select
                      value={editing.linkedFormType ?? 'farmer'}
                      onChange={(e) => {
                        const primary = e.target.value;
                        const prevList = editing.linkedFormTypes ?? [];
                        const merged = primary
                          ? Array.from(new Set([primary, ...prevList]))
                          : [];
                        setEditing({
                          ...editing,
                          linkedFormType: primary,
                          linkedFormTypes: merged,
                        });
                      }}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                    >
                      <option value="">No Registration Form</option>
                      {forms
                        .filter((f) => f.id !== 'contact')
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.titleEn} ({f.isOpen ? 'Open' : 'Closed'})
                          </option>
                        ))}
                    </select>
                  </label>
                  <div className="rounded-2xl bg-[#F4F9F5] border border-[#DCEAE0] p-3.5 space-y-1">
                    <p className="font-bold text-[#144527]">Automatic Source Attribution</p>
                    <p className="text-[11px] text-[#4C6556] leading-relaxed">
                      When visitors click Register on this programme, the link automatically passes{' '}
                      <code className="font-mono text-[#144527]">
                        /join/{editing.linkedFormType || 'farmer'}?campaign={editing.programmeCode}
                      </code>{' '}
                      so every applicant is linked to this exact programme and district in Registrations &amp; Applications.
                    </p>
                  </div>
                </div>

                {/* Multi-Form Attachment */}
                <div className="rounded-xl bg-[#F7FAF7] border border-[#DCE7DE] p-4 space-y-2.5">
                  <p className="font-semibold text-[#142119]">
                    Attach Additional Participation Forms (e.g. Volunteer + Farmer + School/College)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {forms
                      .filter((f) => f.id !== 'contact')
                      .map((f) => {
                        const activeForms = new Set(
                          editing.linkedFormTypes && editing.linkedFormTypes.length > 0
                            ? editing.linkedFormTypes
                            : editing.linkedFormType
                            ? [editing.linkedFormType]
                            : []
                        );
                        const isChecked = activeForms.has(f.id);
                        return (
                          <label
                            key={f.id}
                            className="inline-flex items-center gap-2 text-[11px] text-[#2A3A30] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const next = new Set(activeForms);
                                if (e.target.checked) next.add(f.id);
                                else next.delete(f.id);
                                const arr = Array.from(next);
                                setEditing({
                                  ...editing,
                                  linkedFormType: arr[0] ?? '',
                                  linkedFormTypes: arr,
                                });
                              }}
                            />
                            <span className="truncate">{f.titleEn}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CHILD HIERARCHY */}
            {editorTab === 'children' && (
              <div className="space-y-3">
                {!editing.id ? (
                  <p className="text-[#55685C]">
                    Save this programme first, then add nested Campaigns, Events, or Training Programmes directly under it.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-[#142119]">
                        Nested Children under &ldquo;{editing.titleEn}&rdquo;
                      </p>
                      <div className="flex gap-2">
                        {editing.type === 'project' && (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateNew('campaign', editing as UnifiedProgrammeRecord)
                            }
                            className="admin-btn-soft px-3 py-1.5 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Child Campaign</span>
                          </button>
                        )}
                        {(editing.type === 'project' || editing.type === 'campaign') && (
                          <button
                            type="button"
                            onClick={() =>
                              openCreateNew('event', editing as UnifiedProgrammeRecord)
                            }
                            className="admin-btn-secondary px-3 py-1.5 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Child Event / Activity</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {programmes.filter((c) => c.parentId === editing.id).length === 0 ? (
                      <p className="text-[#6B7E71] py-2">
                        No child campaigns or events linked yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {programmes
                          .filter((c) => c.parentId === editing.id)
                          .map((child) => (
                            <div
                              key={child.id}
                              className="rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] px-3.5 py-2.5 flex items-center justify-between gap-2"
                            >
                              <div>
                                <span className="font-bold text-[#142119]">{child.titleEn}</span>
                                <span className="ml-2 text-[11px] text-[#55685C]">
                                  ({TYPE_META[child.type].label} · {child.publicationStatus})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => openEditExisting(child)}
                                className="admin-btn-secondary px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer"
                              >
                                Open
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 6: LIVE PUBLIC DISPLAY MAP & LINKED SUBMISSIONS */}
            {editorTab === 'distribution' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      dest: 'Harit Bharat & Harit Rajasthan Location Explorer',
                      path: '/harit-bharat',
                      active:
                        editing.publicationStatus === 'Published' &&
                        (editing.coverageScope === 'india-wide' ||
                          (editing.locations ?? []).length > 0),
                      reason:
                        'Displayed automatically whenever a visitor selects any tagged State or District.',
                    },
                    {
                      dest: 'National Projects & Impact Directory',
                      path: '/projects',
                      active:
                        editing.publicationStatus === 'Published' &&
                        editing.type === 'project',
                      reason:
                        'Shows this project with its nested campaigns, events, photos, and reports.',
                    },
                    {
                      dest: `Our Missions → ${getMissionLabel(editing.missionSlug)}`,
                      path: `/missions/${editing.missionSlug}`,
                      active: editing.publicationStatus === 'Published',
                      reason:
                        'Appears automatically inside the Mission page under Active Programmes.',
                    },
                    {
                      dest:
                        editing.type === 'training'
                          ? 'Training & Knowledge Portal'
                          : 'Events & Marathon Portal',
                      path: editing.type === 'training' ? '/training' : '/events',
                      active:
                        editing.publicationStatus === 'Published' &&
                        (editing.type === 'event' || editing.type === 'training'),
                      reason:
                        'Automatically listed in the national Events or Training calendar.',
                    },
                  ].map((d) => (
                    <div
                      key={d.dest}
                      className="rounded-2xl border border-[#DCE5DE] bg-[#FAFBF8] p-3.5 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-[#142119]">{d.dest}</p>
                        <span
                          className={`text-[11px] font-bold ${
                            d.active ? 'text-emerald-700' : 'text-[#7A8C80]'
                          }`}
                        >
                          {d.active ? 'Live Synced' : 'Inactive / Draft'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#55685C]">{d.reason}</p>
                    </div>
                  ))}
                </div>

                {editing.programmeCode && (
                  <div className="rounded-2xl border border-[#DCE5DE] bg-white p-4 space-y-1">
                    <p className="font-bold text-[#142119]">
                      Submissions Attributed to {editing.programmeCode}:{' '}
                      <span className="text-[#144527]">
                        {
                          submissions.filter(
                            (s) =>
                              s.customFields?.campaignCode === editing.programmeCode ||
                              s.details?.includes(editing.programmeCode || '')
                          ).length
                        }
                      </span>
                    </p>
                    <p className="text-[11px] text-[#55685C]">
                      Linked Form: {getFormLabel(editing.linkedFormType)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Save Footer */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#EDF2EE]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="admin-btn-secondary px-4 py-2 rounded-xl font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn-primary inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-semibold cursor-pointer disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save & Sync Programme'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Toolbar + View Switcher */}
      <div className="admin-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                ['all', `All (${counts.all})`],
                ['project', `Projects (${counts.project})`],
                ['campaign', `Campaigns (${counts.campaign})`],
                ['event', `Events (${counts.event})`],
                ['training', `Training (${counts.training})`],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTypeFilter(k)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  typeFilter === k ? 'admin-btn-primary' : 'admin-btn-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F1F6F2] p-1 rounded-xl border border-[#E2ECE4]">
            <button
              type="button"
              onClick={() => setViewMode('hierarchy')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 ${
                viewMode === 'hierarchy'
                  ? 'bg-white text-[#144527] shadow-xs'
                  : 'text-[#5C6F63]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Hierarchy Tree</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-[#144527] shadow-xs'
                  : 'text-[#5C6F63]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7E71] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, district, village, mission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#DCE5DE] pl-8 pr-3 py-2"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
          >
            <option value="all">All States &amp; India-Wide</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <select
            value={pubFilter}
            onChange={(e) => setPubFilter(e.target.value)}
            className="rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
          >
            <option value="all">All Publication Statuses</option>
            {PUB_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Visual Hierarchy Tree OR Table */}
      {filteredList.length === 0 ? (
        <div className="admin-card p-10 text-center space-y-2">
          <p className="text-sm font-bold text-[#142119]">No matching programmes</p>
          <p className="text-xs text-[#55685C]">
            Clear your filters or click Create Programme to add a new Project, Campaign, Event, or Training Programme.
          </p>
        </div>
      ) : viewMode === 'hierarchy' ? (
        <div className="space-y-4">
          {hierarchyTree.map((rootNode) => renderTreeNode(rootNode, 0))}
        </div>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#EDF2EE] text-[#5C6F63]">
              <tr>
                <th className="py-3 px-4 font-semibold">Programme &amp; Code</th>
                <th className="py-3 px-3 font-semibold">Type &amp; Parent</th>
                <th className="py-3 px-3 font-semibold">Coverage / Locations</th>
                <th className="py-3 px-3 font-semibold">Publication / Ops</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F1]">
              {filteredList.map((p) => (
                <tr key={p.id} className="hover:bg-[#F7FAF7]">
                  <td className="py-3 px-4">
                    <p className="font-bold text-[#142119]">{p.titleEn}</p>
                    <p className="font-mono text-[11px] text-[#55685C]">{p.programmeCode}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-bold ${TYPE_META[p.type].badgeCls}`}
                    >
                      {TYPE_META[p.type].label}
                    </span>
                    {getParentTitle(p.parentId) && (
                      <p className="text-[11px] text-[#55685C] mt-0.5">
                        ↳ {getParentTitle(p.parentId)}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[#2E4236]">
                    {p.coverageScope === 'india-wide'
                      ? 'India-Wide'
                      : p.locations.map((l) => l.district).join(', ') || '—'}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-emerald-700">{p.publicationStatus}</p>
                    <p className="text-[11px] text-[#55685C]">{p.operationalStatus}</p>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEditExisting(p)}
                      className="admin-btn-secondary px-2.5 py-1 rounded-lg font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProgramme(p.id)}
                      className="admin-btn-secondary px-2 py-1 rounded-lg text-rose-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
