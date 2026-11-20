import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Compass,
  Eye,
  EyeOff,
  FilePlus2,
  Globe,
  Layers,
  LayoutTemplate,
  Link2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type {
  AdminCampaignRecord,
  AdminFormDefinition,
  AdminMarathonEvent,
  AdminProjectRecord,
  HomepageSectionConfig,
  MissionAdminConfig,
  StaticPageRecord,
} from './types';

/* ============================================================================
   1. HOMEPAGE & SECTIONS MANAGER (Blueprint §3)
   ============================================================================ */

interface HomepageSectionsProps {
  sections: HomepageSectionConfig[];
  onSaveSections: (sections: HomepageSectionConfig[]) => Promise<void>;
}

export function AdminHomepageSectionsView({
  sections,
  onSaveSections,
}: HomepageSectionsProps) {
  const [draft, setDraft] = useState<HomepageSectionConfig[]>(sections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  React.useEffect(() => {
    setDraft(sections);
    setDirty(false);
  }, [sections]);

  const sorted = useMemo(
    () => [...draft].sort((a, b) => a.displayOrder - b.displayOrder),
    [draft]
  );

  const editingSection = sorted.find((s) => s.id === editingId) ?? null;

  const updateItem = (id: string, patch: Partial<HomepageSectionConfig>) => {
    setDraft((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setDirty(true);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const copy = [...sorted];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    const reordered = copy.map((sec, idx) => ({ ...sec, displayOrder: idx + 1 }));
    setDraft(reordered);
    setDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await onSaveSections(sorted);
      setDirty(false);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const activeVisibleCount = sorted.filter((s) => s.enabled && s.visible).length;

  return (
    <div className="space-y-5">
      <div className="admin-card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Homepage &amp; Sections Control
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
            {activeVisibleCount} of {sorted.length} sections visible live · Reorder, show/hide, edit bilingual headings &amp; CTAs without developer changes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="admin-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Sequence</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : dirty ? 'Save & Publish Layout' : 'Save Layout'}</span>
          </button>
        </div>
      </div>

      {/* Inline Section Editor Drawer Card */}
      {editingSection && (
        <div className="admin-card border-[#368737]/40 p-5 sm:p-6 space-y-4 admin-view-enter">
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#142119]">
                Edit Section #{editingSection.displayOrder} — {editingSection.label}
              </h3>
              <p className="text-xs text-[#55685C]">{editingSection.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              aria-label="Close section editor"
              className="admin-btn-secondary p-2 rounded-xl cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Heading (English)</span>
              <input
                type="text"
                value={editingSection.headingEn}
                onChange={(e) =>
                  updateItem(editingSection.id, { headingEn: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/30"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Heading (Hindi)</span>
              <input
                type="text"
                value={editingSection.headingHi}
                onChange={(e) =>
                  updateItem(editingSection.id, { headingHi: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/30"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Subtitle (English)</span>
              <textarea
                rows={2}
                value={editingSection.subtitleEn}
                onChange={(e) =>
                  updateItem(editingSection.id, { subtitleEn: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/30"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Subtitle (Hindi)</span>
              <textarea
                rows={2}
                value={editingSection.subtitleHi}
                onChange={(e) =>
                  updateItem(editingSection.id, { subtitleHi: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/30"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Button Label (English)</span>
              <input
                type="text"
                value={editingSection.ctaLabelEn}
                onChange={(e) =>
                  updateItem(editingSection.id, { ctaLabelEn: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Button Label (Hindi)</span>
              <input
                type="text"
                value={editingSection.ctaLabelHi}
                onChange={(e) =>
                  updateItem(editingSection.id, { ctaLabelHi: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
              />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="font-semibold text-[#142119]">Button Destination Route / URL</span>
              <input
                type="text"
                value={editingSection.ctaDestination}
                onChange={(e) =>
                  updateItem(editingSection.id, { ctaDestination: e.target.value })
                }
                placeholder="/harit-bharat or /join/farmer"
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white font-mono"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDF2EE]">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="admin-btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Done Editing
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveAll}
              className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Publish Section</span>
            </button>
          </div>
        </div>
      )}

      {/* Ordered List of All 13 Homepage Sections */}
      <div className="admin-card overflow-hidden">
        <div className="divide-y divide-[#EFF4F0]">
          {sorted.map((sec, idx) => (
            <div
              key={sec.id}
              className={`px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                sec.enabled && sec.visible ? 'hover:bg-[#F8FBF9]' : 'bg-[#FAFBF9] opacity-75'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#EDF6EE] text-[#144527] font-mono text-xs font-bold flex items-center justify-center shrink-0 tabular-nums mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#142119]">{sec.label}</span>
                    <span className="text-xs text-[#6B7E71]" aria-hidden="true">·</span>
                    <span className="text-xs font-medium text-[#144527] truncate max-w-[260px]">
                      {sec.headingEn}
                    </span>
                  </div>
                  <p className="text-xs text-[#55685C] mt-0.5">{sec.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6B7E71] mt-1 font-mono">
                    <span>CTA: {sec.ctaLabelEn}</span>
                    <span aria-hidden="true">·</span>
                    <span>Link: {sec.ctaDestination}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, -1)}
                    aria-label={`Move ${sec.label} up`}
                    className="admin-btn-secondary p-1.5 rounded-lg disabled:opacity-35 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sorted.length - 1}
                    onClick={() => moveSection(idx, 1)}
                    aria-label={`Move ${sec.label} down`}
                    className="admin-btn-secondary p-1.5 rounded-lg disabled:opacity-35 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => updateItem(sec.id, { visible: !sec.visible })}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    sec.visible
                      ? 'admin-btn-soft text-[#144527]'
                      : 'admin-btn-secondary text-[#6B7E71]'
                  }`}
                >
                  {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateItem(sec.id, { enabled: !sec.enabled })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    sec.enabled
                      ? 'admin-btn-secondary text-emerald-700'
                      : 'admin-btn-secondary text-amber-700'
                  }`}
                >
                  {sec.enabled ? 'Enabled' : 'Disabled'}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingId(sec.id)}
                  className="admin-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-[#0D1F14]/45 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE5DE] shadow-2xl max-w-2xl w-full max-h-[82vh] flex flex-col overflow-hidden admin-view-enter">
            <div className="px-5 py-4 border-b border-[#EDF2EE] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#142119]">
                  Homepage Sequence Preview ({activeVisibleCount} Active Blocks)
                </h3>
                <p className="text-xs text-[#55685C]">
                  Exact vertical rendering sequence visible to public visitors
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-2.5">
              {sorted
                .filter((s) => s.enabled && s.visible)
                .map((sec, i) => (
                  <div
                    key={sec.id}
                    className="rounded-xl border border-[#E5EDE7] bg-[#FAFBF9] p-3.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-mono text-[#368737] font-bold">
                        {String(i + 1).padStart(2, '0')} · {sec.label}
                      </p>
                      <p className="text-sm font-bold text-[#142119] mt-0.5">{sec.headingEn}</p>
                      <p className="text-xs text-[#55685C]">{sec.subtitleEn}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#144527] whitespace-nowrap">
                      {sec.ctaLabelEn} →
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   2. PAGES & NAVIGATION MANAGER (Blueprint §4)
   ============================================================================ */

interface PagesNavProps {
  pages: StaticPageRecord[];
  forms: AdminFormDefinition[];
  onSavePage: (page: Partial<StaticPageRecord>) => Promise<void>;
  onDeletePage: (id: string) => Promise<void>;
}

const FIXED_MAIN_MENU = [
  '1. Home',
  '2. About GOVEDA',
  '3. Our Missions (10 Missions)',
  '4. Harit Rajasthan & Bharat',
  '5. Harit Marathon',
  '6. Projects & Impact',
  '7. Join / 12 Forms',
  '8. CSR & Partnerships',
  '9. News, Magazine & Gallery',
  '10. Contact & Governance',
];

const PARENT_OPTIONS = [
  'Top-Level Page',
  'About GOVEDA',
  'Our Missions → Carbon Credit',
  'Our Missions → Green Rajasthan',
  'Our Missions → Self-Reliant Gaushala',
  'Our Missions → Renewable Energy',
  'Our Missions → Organic Farming',
  'Our Missions → Clean India',
  'Our Missions → Skill Development',
  'Our Missions → Women Empowerment',
  'Our Missions → Senior Care & Mental Health',
  'Our Missions → Heritage & Water',
  'Harit Rajasthan & Locations',
  'Governance & Policies',
];

export function AdminPagesNavView({
  pages,
  forms,
  onSavePage,
  onDeletePage,
}: PagesNavProps) {
  const [editing, setEditing] = useState<Partial<StaticPageRecord> | null>(null);
  const [previewPage, setPreviewPage] = useState<StaticPageRecord | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredPages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.titleEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.parentPath.toLowerCase().includes(q)
    );
  }, [pages, search]);

  const openBlankPage = () => {
    setEditing({
      id: '',
      titleEn: '',
      titleHi: '',
      slug: '',
      parentPath: 'Our Missions → Clean India',
      summaryEn: '',
      summaryHi: '',
      bodyEn: '',
      bodyHi: '',
      linkedFormType: 'volunteer',
      ctaLabel: 'Join Clean India Mission',
      seoTitle: '',
      seoDescription: '',
      showInNav: false,
      navOrder: pages.length + 1,
      status: 'Published',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.titleEn?.trim()) return;
    setSaving(true);
    try {
      await onSavePage(editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="admin-card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Pages &amp; Navigation Structure
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
            {pages.length} managed static pages &amp; subpages · Fixed 10-item main navigation stays clean while subpages attach under Missions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7C8F82] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages or slugs..."
              className="pl-8 pr-3 py-2 text-xs rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/30 w-52"
            />
          </div>
          <button
            type="button"
            onClick={openBlankPage}
            className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Add New Page</span>
          </button>
        </div>
      </div>

      {/* Create / Edit Page Form */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="admin-card border-[#368737]/40 p-5 sm:p-6 space-y-4 text-xs admin-view-enter"
        >
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3">
            <h3 className="text-sm font-bold text-[#142119]">
              {editing.id ? `Edit Page · ${editing.titleEn}` : 'Create Static Page / Mission Subpage'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              aria-label="Close page editor"
              className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Page Title (English) *</span>
              <input
                type="text"
                required
                placeholder="e.g. Waste Segregation Guidelines"
                value={editing.titleEn ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditing({
                    ...editing,
                    titleEn: val,
                    slug:
                      editing.id
                        ? editing.slug
                        : val
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, ''),
                  });
                }}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Page Title (Hindi)</span>
              <input
                type="text"
                placeholder="उदा. कचरा पृथक्करण दिशानिर्देश"
                value={editing.titleHi ?? ''}
                onChange={(e) => setEditing({ ...editing, titleHi: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">URL Slug</span>
              <input
                type="text"
                placeholder="waste-segregation-guidelines"
                value={editing.slug ?? ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Parent Placement</span>
              <select
                value={editing.parentPath ?? 'Our Missions → Clean India'}
                onChange={(e) => setEditing({ ...editing, parentPath: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
              >
                {PARENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Linked Registration Form</span>
              <select
                value={editing.linkedFormType ?? ''}
                onChange={(e) => setEditing({ ...editing, linkedFormType: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
              >
                <option value="">No Form Attached</option>
                {forms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.titleEn}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Publication Status</span>
              <select
                value={editing.status ?? 'Draft'}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value as 'Draft' | 'Published' | 'Hidden',
                  })
                }
                className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Hidden">Hidden from Public</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Page Content (English)</span>
              <textarea
                rows={3}
                value={editing.bodyEn ?? ''}
                onChange={(e) => setEditing({ ...editing, bodyEn: e.target.value })}
                placeholder="Write structured public content..."
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Page Content (Hindi)</span>
              <textarea
                rows={3}
                value={editing.bodyHi ?? ''}
                onChange={(e) => setEditing({ ...editing, bodyHi: e.target.value })}
                placeholder="हिंदी में पृष्ठ सामग्री..."
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">SEO Meta Title</span>
              <input
                type="text"
                value={editing.seoTitle ?? ''}
                onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">CTA Button Text</span>
              <input
                type="text"
                value={editing.ctaLabel ?? ''}
                onChange={(e) => setEditing({ ...editing, ctaLabel: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EDF2EE]">
            <label className="inline-flex items-center gap-2 font-semibold text-[#144527] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(editing.showInNav)}
                onChange={(e) => setEditing({ ...editing, showInNav: e.target.checked })}
                className="rounded border-[#368737]"
              />
              <span>Show link inside parent dropdown menu</span>
            </label>
            <div className="flex items-center gap-2">
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
                className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Page'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Static Pages & Subpages Table */}
        <div className="xl:col-span-8 admin-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EDF2EE]">
            <h3 className="text-sm font-bold text-[#142119]">Managed Pages &amp; Mission Subpages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDF2EE] bg-[#FAFBF9] text-[11px] font-semibold text-[#55685C]">
                  <th className="py-3 px-5">Page &amp; Slug</th>
                  <th className="py-3 px-4">Parent Hierarchy</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1]">
                {filteredPages.map((pg) => (
                  <tr key={pg.id} className="hover:bg-[#F8FBF9] transition-colors">
                    <td className="py-3 px-5">
                      <p className="font-bold text-[#142119]">{pg.titleEn}</p>
                      <p className="text-[11px] font-mono text-[#6B7E71]">/{pg.slug}</p>
                    </td>
                    <td className="py-3 px-4 text-[#3C5044]">{pg.parentPath}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          pg.status === 'Published'
                            ? 'text-emerald-700'
                            : pg.status === 'Hidden'
                            ? 'text-slate-500'
                            : 'text-amber-700'
                        }`}
                      >
                        {pg.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewPage(pg)}
                        className="admin-btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing({ ...pg })}
                        className="admin-btn-soft inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePage(pg.id)}
                        aria-label={`Delete ${pg.titleEn}`}
                        className="admin-btn-secondary p-1.5 rounded-lg text-red-700 cursor-pointer align-middle"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fixed 10-Item Main Navigation Reference */}
        <div className="xl:col-span-4 admin-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-[#368737]" />
            <h3 className="text-sm font-bold text-[#142119]">Fixed Main Navigation (10 Slots)</h3>
          </div>
          <p className="text-xs text-[#55685C] leading-relaxed">
            Per GOVEDA governance rules, top-level navigation remains anchored at 10 structured destinations so adding new subpages never clutters the header.
          </p>
          <div className="divide-y divide-[#EFF4F0] text-xs pt-1">
            {FIXED_MAIN_MENU.map((slot) => (
              <div key={slot} className="py-2 flex items-center justify-between">
                <span className="font-medium text-[#142119]">{slot}</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {previewPage && (
        <div className="fixed inset-0 z-50 bg-[#0D1F14]/45 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE5DE] shadow-2xl max-w-xl w-full p-6 space-y-4 admin-view-enter">
            <div className="flex items-start justify-between gap-3 border-b border-[#EDF2EE] pb-3">
              <div>
                <p className="text-[11px] font-mono text-[#368737] font-semibold">
                  {previewPage.parentPath} · /{previewPage.slug}
                </p>
                <h3 className="text-lg font-bold text-[#142119] mt-0.5">{previewPage.titleEn}</h3>
                {previewPage.titleHi && (
                  <p className="text-xs text-[#55685C]">{previewPage.titleHi}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewPage(null)}
                aria-label="Close page preview"
                className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#2A3A30] leading-relaxed">
              {previewPage.bodyEn || previewPage.summaryEn || 'No body copy entered yet.'}
            </p>
            {previewPage.linkedFormType && (
              <div className="rounded-xl bg-[#F4F8F4] border border-[#DCE5DE] p-3 flex items-center justify-between text-xs">
                <span className="text-[#55685C]">
                  Linked Form: <strong className="text-[#144527]">{previewPage.linkedFormType}</strong>
                </span>
                <span className="font-bold text-[#144527]">{previewPage.ctaLabel} →</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   3. OUR MISSIONS — ALL 10 MISSIONS MANAGER (Blueprint §5)
   ============================================================================ */

interface MissionsManagerProps {
  missions: MissionAdminConfig[];
  campaigns: AdminCampaignRecord[];
  projects: AdminProjectRecord[];
  events: AdminMarathonEvent[];
  forms: AdminFormDefinition[];
  onSaveMission: (slug: string, patch: Partial<MissionAdminConfig>) => Promise<void>;
}

type MissionEditorTab = 'overview' | 'subsections' | 'linked' | 'faqs' | 'seo';

export function AdminMissionsManagerView({
  missions,
  campaigns,
  projects,
  events,
  forms,
  onSaveMission,
}: MissionsManagerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [tab, setTab] = useState<MissionEditorTab>('overview');
  const [draft, setDraft] = useState<MissionAdminConfig | null>(null);
  const [newSubItem, setNewSubItem] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [saving, setSaving] = useState(false);

  const openEditor = (m: MissionAdminConfig) => {
    setSelectedSlug(m.slug);
    setDraft({
      ...m,
      subsections: [...m.subsections],
      proposedActivities: [...m.proposedActivities],
      faqs: m.faqs.map((f) => ({ ...f })),
    });
    setTab('overview');
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await onSaveMission(draft.slug, draft);
      setSelectedSlug(null);
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  const linkedCampaigns = useMemo(() => {
    if (!draft) return [];
    const key = draft.titleEn.split(' ')[0].toLowerCase();
    return campaigns.filter(
      (c) =>
        c.missionPillar.toLowerCase().includes(key) ||
        c.titleEn.toLowerCase().includes(key)
    );
  }, [draft, campaigns]);

  const linkedProjects = useMemo(() => {
    if (!draft) return [];
    const key = draft.titleEn.split(' ')[0].toLowerCase();
    return projects.filter(
      (p) =>
        p.missionCategoryEn.toLowerCase().includes(key) ||
        p.titleEn.toLowerCase().includes(key)
    );
  }, [draft, projects]);

  return (
    <div className="space-y-5">
      <div className="admin-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Our Missions — All 10 Institutional Pillars
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
            {missions.length} configured mission pages · Click Edit on any mission to manage content, subsections, linked forms, FAQs &amp; SEO
          </p>
        </div>
        <div className="text-xs text-[#55685C] font-mono tabular-nums">
          {missions.filter((m) => m.status === 'Published').length} / {missions.length} Published Live
        </div>
      </div>

      {/* Tabbed Mission Editor */}
      {selectedSlug && draft && (
        <div className="admin-card border-[#368737]/40 p-5 sm:p-6 space-y-5 admin-view-enter">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EDF2EE] pb-3.5">
            <div>
              <p className="text-[11px] font-mono font-bold text-[#368737]">
                Mission #{String(draft.number).padStart(2, '0')} · /missions/{draft.slug}
              </p>
              <h3 className="text-base font-bold text-[#142119] mt-0.5">
                {draft.titleEn} <span className="font-normal text-[#55685C]">({draft.titleHi})</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedSlug(null);
                setDraft(null);
              }}
              aria-label="Close mission editor"
              className="admin-btn-secondary p-2 rounded-xl cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Editor Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#F2F6F3]">
            {(
              [
                ['overview', 'Overview & Content'],
                ['subsections', 'Subsections & Activities'],
                ['linked', 'Linked Programmes'],
                ['faqs', 'Forms & FAQs'],
                ['seo', 'SEO & Publication'],
              ] as [MissionEditorTab, string][]
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  tab === k
                    ? 'bg-white text-[#144527] shadow-xs'
                    : 'text-[#55685C] hover:text-[#142119]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">Mission Title (English)</span>
                <input
                  type="text"
                  value={draft.titleEn}
                  onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">Mission Title (Hindi)</span>
                <input
                  type="text"
                  value={draft.titleHi}
                  onChange={(e) => setDraft({ ...draft, titleHi: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">Mission Introduction (English)</span>
                <textarea
                  rows={3}
                  value={draft.introEn}
                  onChange={(e) => setDraft({ ...draft, introEn: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">Mission Introduction (Hindi)</span>
                <textarea
                  rows={3}
                  value={draft.introHi}
                  onChange={(e) => setDraft({ ...draft, introHi: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </label>
            </div>
          )}

          {tab === 'subsections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-2.5">
                <p className="font-bold text-[#142119]">
                  Subsections ({draft.subsections.length})
                </p>
                <div className="space-y-1.5">
                  {draft.subsections.map((sub, i) => (
                    <div
                      key={`${sub}-${i}`}
                      className="flex items-center justify-between rounded-xl border border-[#E6EFE8] bg-[#FAFBF9] px-3 py-2"
                    >
                      <span className="font-medium text-[#142119]">{sub}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            subsections: draft.subsections.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-red-700 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubItem}
                    onChange={(e) => setNewSubItem(e.target.value)}
                    placeholder="Add subsection (e.g. Temple Waste)..."
                    className="flex-1 rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSubItem.trim()) return;
                      setDraft({
                        ...draft,
                        subsections: [...draft.subsections, newSubItem.trim()],
                      });
                      setNewSubItem('');
                    }}
                    className="admin-btn-soft px-3 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="font-bold text-[#142119]">
                  Proposed Activities ({draft.proposedActivities.length})
                </p>
                <div className="space-y-1.5">
                  {draft.proposedActivities.map((act, i) => (
                    <div
                      key={`${act}-${i}`}
                      className="flex items-center justify-between rounded-xl border border-[#E6EFE8] bg-[#FAFBF9] px-3 py-2"
                    >
                      <span className="text-[#142119]">{act}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            proposedActivities: draft.proposedActivities.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                        className="text-red-700 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="Add proposed activity..."
                    className="flex-1 rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newActivity.trim()) return;
                      setDraft({
                        ...draft,
                        proposedActivities: [...draft.proposedActivities, newActivity.trim()],
                      });
                      setNewActivity('');
                    }}
                    className="admin-btn-soft px-3 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'linked' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-[#E6EFE8] bg-[#FAFBF9] p-4 space-y-2">
                <p className="font-bold text-[#142119]">
                  Linked Campaigns ({linkedCampaigns.length})
                </p>
                {linkedCampaigns.length === 0 ? (
                  <p className="text-[#6B7E71]">No campaigns linked yet.</p>
                ) : (
                  linkedCampaigns.map((c) => (
                    <p key={c.id} className="text-[#144527] font-medium">
                      {c.campaignCode} · {c.titleEn}
                    </p>
                  ))
                )}
              </div>
              <div className="rounded-xl border border-[#E6EFE8] bg-[#FAFBF9] p-4 space-y-2">
                <p className="font-bold text-[#142119]">
                  Related Projects ({linkedProjects.length})
                </p>
                {linkedProjects.length === 0 ? (
                  <p className="text-[#6B7E71]">No projects linked yet.</p>
                ) : (
                  linkedProjects.map((p) => (
                    <p key={p.id} className="text-[#144527] font-medium">
                      {p.titleEn} ({p.status})
                    </p>
                  ))
                )}
              </div>
              <div className="rounded-xl border border-[#E6EFE8] bg-[#FAFBF9] p-4 space-y-2">
                <p className="font-bold text-[#142119]">
                  Upcoming Events ({events.length})
                </p>
                {events.slice(0, 3).map((ev) => (
                  <p key={ev.id} className="text-[#144527] font-medium">
                    {ev.titleEn} ({ev.district})
                  </p>
                ))}
              </div>
            </div>
          )}

          {tab === 'faqs' && (
            <div className="space-y-4 text-xs">
              <label className="block max-w-md space-y-1">
                <span className="font-semibold text-[#142119]">
                  Primary &ldquo;Join this Mission&rdquo; Registration Form
                </span>
                <select
                  value={draft.linkedFormType}
                  onChange={(e) => setDraft({ ...draft, linkedFormType: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  {forms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.titleEn}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#142119]">Mission FAQs ({draft.faqs.length})</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        faqs: [...draft.faqs, { q: '', a: '' }],
                      })
                    }
                    className="admin-btn-soft inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </button>
                </div>
                {draft.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E6EFE8] bg-[#FAFBF9] p-3 grid grid-cols-1 md:grid-cols-2 gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Question..."
                      value={faq.q}
                      onChange={(e) => {
                        const next = [...draft.faqs];
                        next[idx] = { ...next[idx], q: e.target.value };
                        setDraft({ ...draft, faqs: next });
                      }}
                      className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                    />
                    <input
                      type="text"
                      placeholder="Answer..."
                      value={faq.a}
                      onChange={(e) => {
                        const next = [...draft.faqs];
                        next[idx] = { ...next[idx], a: e.target.value };
                        setDraft({ ...draft, faqs: next });
                      }}
                      className="rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'seo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">Publication Status</span>
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      status: e.target.value as 'Draft' | 'Published' | 'Hidden',
                    })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="Published">Published Live</option>
                  <option value="Draft">Draft</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">SEO Title</span>
                <input
                  type="text"
                  value={draft.seoTitle}
                  onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="font-semibold text-[#142119]">SEO Meta Description</span>
                <textarea
                  rows={2}
                  value={draft.seoDescription}
                  onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })}
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDF2EE]">
            <button
              type="button"
              onClick={() => {
                setSelectedSlug(null);
                setDraft(null);
              }}
              className="admin-btn-secondary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Mission...' : 'Save Mission Updates'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 10 Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => (
          <div
            key={m.slug}
            className="admin-card admin-card-interactive p-5 flex flex-col justify-between gap-3.5"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs text-[#55685C]">
                <span className="font-mono font-bold text-[#368737] tabular-nums">
                  Mission {String(m.number).padStart(2, '0')}
                </span>
                <span
                  className={`font-semibold ${
                    m.status === 'Published' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#142119]">{m.titleEn}</h3>
              <p className="text-xs text-[#4F6356]">{m.titleHi}</p>
              <p className="text-xs text-[#55685C] leading-relaxed line-clamp-2 pt-0.5">
                {m.introEn}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#EFF4F0] text-xs">
              <span className="text-[#6B7E71] tabular-nums">
                {m.subsections.length} subsections · Form: <strong className="text-[#144527]">{m.linkedFormType}</strong>
              </span>
              <button
                type="button"
                onClick={() => openEditor(m)}
                className="admin-btn-soft inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Mission</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
