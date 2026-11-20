import React, { useEffect, useState } from 'react';
import {
  Bold,
  Building2,
  Check,
  Copy,
  Database,
  Eye,
  FileText,
  Globe,
  Heading2,
  Heading3,
  Image as ImageIcon,
  IndianRupee,
  Italic,
  Landmark,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pencil,
  Plus,
  Quote,
  Save,
  Shield,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Video,
} from 'lucide-react';
import type {
  AdminAuditLog,
  AdminContentItem,
  AdminCsrProposal,
  AdminDistrictRecord,
  AdminDonationReport,
  AdminSiteGovernance,
  AdminTeamMember,
} from './types';
import type { AnnualReportDocSpec, LeadershipMemberSpec } from '../db/schema';
import { MISSIONS_DATA } from '../data/missionsData';
import { ADVISORY_DOMAIN_CATEGORIES, INDIA_STATES_DIRECTORY } from '../data/indiaLocations';
import { ROLE_LABELS, slugifyTitle, type AdminRole } from '../utils/adminLogic';

interface AdminContentViewProps {
  items: AdminContentItem[];
  initialFilter?: string;
  onSaveItem: (item: Partial<AdminContentItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onUploadMedia: (file: File) => Promise<{
    url: string;
    mediaType: 'image' | 'video' | 'pdf';
    fileName: string;
    sizeBytes: number;
  }>;
}

const EMPTY_COURSE_META = {
  eligibilityEn: '',
  eligibilityHi: '',
  durationEn: '',
  durationHi: '',
  modeEn: '',
  modeHi: '',
  trainerName: '',
  feeStatusEn: '',
  feeStatusHi: '',
  applyRoute: 'training',
};

export function AdminContentView({
  items,
  initialFilter = 'all',
  onSaveItem,
  onDeleteItem,
  onUploadMedia,
}: AdminContentViewProps) {
  const [filterType, setFilterType] = useState<string>(initialFilter);
  React.useEffect(() => {
    setFilterType(initialFilter);
  }, [initialFilter]);
  const [editing, setEditing] = useState<Partial<AdminContentItem> | null>(null);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [activeBodyLang, setActiveBodyLang] = useState<'en' | 'hi'>('en');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<'image' | 'inlineImage' | 'video' | 'pdf' | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const visibleItems =
    filterType === 'all' ? items : items.filter((i) => i.sectionType === filterType);

  const insertSnippet = (snippet: string) => {
    if (!editing) return;
    if (activeBodyLang === 'en') {
      const curr = editing.bodyEn ?? '';
      setEditing({ ...editing, bodyEn: curr ? `${curr}\n\n${snippet}` : snippet });
    } else {
      const curr = editing.bodyHi ?? '';
      setEditing({ ...editing, bodyHi: curr ? `${curr}\n\n${snippet}` : snippet });
    }
  };

  const handleFileUpload = async (
    file: File | undefined,
    target: 'image' | 'inlineImage' | 'video' | 'pdf'
  ) => {
    if (!file || !editing) return;
    setUploadingField(target);
    setUploadError(null);
    try {
      const uploaded = await onUploadMedia(file);
      if (target === 'image') {
        setEditing({ ...editing, mediaUrl: uploaded.url });
      } else if (target === 'inlineImage') {
        insertSnippet(`![${file.name.replace(/\.[^.]+$/, '')}](${uploaded.url})`);
      } else if (target === 'video') {
        setEditing({ ...editing, videoUrl: uploaded.url, mediaType: 'video' });
      } else {
        setEditing({ ...editing, pdfUrl: uploaded.url, mediaType: 'pdf' });
      }
    } catch (err: any) {
      setUploadError(err?.message || 'File upload failed.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.titleEn?.trim()) return;
    setSaving(true);
    try {
      const finalSlug = editing.slug?.trim() || slugifyTitle(editing.titleEn);
      await onSaveItem({
        ...editing,
        slug: finalSlug,
        courseMeta: editing.sectionType === 'training' ? editing.courseMeta ?? EMPTY_COURSE_META : null,
      });
      setEditing(null);
      setEditorTab('write');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Content, Magazine, Courses &amp; Media Gallery
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Publish News, Training Courses, Quarterly Magazine PDFs, Mission Updates, and Image/Video Gallery entries
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap items-center bg-[#F3F6F3] p-1 rounded-xl text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'news', label: 'News' },
              { id: 'magazine', label: 'Magazine' },
              { id: 'training', label: 'Training' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'mission_update', label: 'Mission Update' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterType(t.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                  filterType === t.id
                    ? 'bg-white text-[#144527] shadow-2xs'
                    : 'text-[#55685C]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setEditorTab('write');
              setEditing({
                id: '',
                slug: '',
                sectionType: 'news',
                titleEn: '',
                titleHi: '',
                summaryEn: '',
                summaryHi: '',
                bodyEn: '',
                bodyHi: '',
                authorName: 'GOVEDA Editorial Desk',
                seoDescription: '',
                stateName: 'Rajasthan',
                districtName: '',
                subDistrict: '',
                villageOrTown: '',
                mediaUrl: '',
                mediaType: 'article',
                videoUrl: '',
                pdfUrl: '',
                relatedMissionSlug: '',
                courseMeta: null,
                categoryTag: 'Foundation Update',
                status: 'Published',
              });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#144527] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-[#368737]/40 p-5 space-y-4 text-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#142119]">
              {editing.id ? 'Edit Content Entry' : 'Publish New Content'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-[#55685C] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {uploadError && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {uploadError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={editing.sectionType ?? 'news'}
              onChange={(e) => {
                const nextType = e.target.value as AdminContentItem['sectionType'];
                setEditing({
                  ...editing,
                  sectionType: nextType,
                  courseMeta:
                    nextType === 'training' ? editing.courseMeta ?? { ...EMPTY_COURSE_META } : editing.courseMeta,
                });
              }}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="news">News &amp; Press</option>
              <option value="magazine">Quarterly Magazine</option>
              <option value="training">Training &amp; Courses</option>
              <option value="gallery">Photo / Video Gallery</option>
              <option value="mission_update">Mission Update</option>
            </select>
            <select
              value={editing.mediaType ?? 'article'}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  mediaType: e.target.value as AdminContentItem['mediaType'],
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="article">Format: Article / Course</option>
              <option value="image">Format: Photo / Image</option>
              <option value="video">Format: Video Clip</option>
              <option value="pdf">Format: PDF Document</option>
            </select>
            <select
              value={editing.relatedMissionSlug ?? ''}
              onChange={(e) => setEditing({ ...editing, relatedMissionSlug: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="">General / All Missions</option>
              {MISSIONS_DATA.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.number}. {m.shortTitle.en}
                </option>
              ))}
            </select>
            <select
              value={editing.status ?? 'Published'}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  status: e.target.value as 'Draft' | 'Published',
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Title (English)"
              value={editing.titleEn ?? ''}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setEditing({
                  ...editing,
                  titleEn: nextTitle,
                  slug: editing.id ? editing.slug : slugifyTitle(nextTitle),
                });
              }}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Title (Hindi)"
              value={editing.titleHi ?? ''}
              onChange={(e) => setEditing({ ...editing, titleHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Category Tag (e.g. Field Dispatch, Magazine)"
              value={editing.categoryTag ?? ''}
              onChange={(e) => setEditing({ ...editing, categoryTag: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
          </div>

          {/* URL Slug, Author & SEO Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="URL Slug (auto-generated, e.g. harit-bharat-launch)"
              value={editing.slug ?? ''}
              onChange={(e) => setEditing({ ...editing, slug: slugifyTitle(e.target.value) })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono text-[11px]"
            />
            <input
              type="text"
              placeholder="Author / Desk Name"
              value={editing.authorName ?? ''}
              onChange={(e) => setEditing({ ...editing, authorName: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="SEO Meta Description"
              value={editing.seoDescription ?? ''}
              onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
          </div>

          {/* Pan-India Location Tagging */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 bg-[#FAFBF8] p-3 rounded-xl border border-[#E5ECE6]">
            <select
              value={editing.stateName ?? ''}
              onChange={(e) => setEditing({ ...editing, stateName: e.target.value })}
              className="rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
            >
              <option value="">Pan-India / All States</option>
              {INDIA_STATES_DIRECTORY.map((st) => (
                <option key={st.slug} value={st.nameEn}>
                  {st.nameEn}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="District (Optional)"
              value={editing.districtName ?? ''}
              onChange={(e) => setEditing({ ...editing, districtName: e.target.value })}
              className="rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
            />
            <input
              type="text"
              placeholder="Tehsil / City (Optional)"
              value={editing.subDistrict ?? ''}
              onChange={(e) => setEditing({ ...editing, subDistrict: e.target.value })}
              className="rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
            />
            <input
              type="text"
              placeholder="Kasba / Village (Optional)"
              value={editing.villageOrTown ?? ''}
              onChange={(e) => setEditing({ ...editing, villageOrTown: e.target.value })}
              className="rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <textarea
              rows={2}
              placeholder="Short Excerpt / Card Summary (English)"
              value={editing.summaryEn ?? ''}
              onChange={(e) => setEditing({ ...editing, summaryEn: e.target.value })}
              className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Short Excerpt / Card Summary (Hindi)"
              value={editing.summaryHi ?? ''}
              onChange={(e) => setEditing({ ...editing, summaryHi: e.target.value })}
              className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
          </div>

          {/* WordPress-Style Rich Article Editor with Toolbar & Live Preview */}
          <div className="rounded-xl border border-[#DCE5DE] overflow-hidden bg-white">
            <div className="bg-[#F4F8F3] border-b border-[#DCE5DE] px-3 py-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  title="Heading 2"
                  onClick={() => insertSnippet('## Section Heading')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Heading 3"
                  onClick={() => insertSnippet('### Sub-Heading')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Bold"
                  onClick={() => insertSnippet('**Bold highlight text**')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => insertSnippet('*Italic emphasis*')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Bullet List"
                  onClick={() => insertSnippet('- Key field milestone 1\n- Key field milestone 2')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Numbered List"
                  onClick={() => insertSnippet('1. First step\n2. Second step')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Blockquote / Callout"
                  onClick={() => insertSnippet('> Institutional insight or farmer testimonial...')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Insert Link"
                  onClick={() => insertSnippet('[Read More](/harit-bharat)')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Insert YouTube Embed"
                  onClick={() => insertSnippet('[youtube:https://www.youtube.com/watch?v=VIDEO_ID]')}
                  className="p-1.5 rounded-lg hover:bg-white text-[#144527] cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
                <label
                  title="Upload & Insert Inline Photo"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-[#DCE5DE] text-[11px] font-semibold text-[#144527] cursor-pointer hover:bg-[#EDF5EE]"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'inlineImage' ? '...' : 'Insert Photo'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], 'inlineImage')}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex bg-white p-0.5 rounded-lg border border-[#DCE5DE]">
                  <button
                    type="button"
                    onClick={() => setActiveBodyLang('en')}
                    className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      activeBodyLang === 'en' ? 'bg-[#144527] text-white' : 'text-[#55685C]'
                    }`}
                  >
                    EN Body
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBodyLang('hi')}
                    className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      activeBodyLang === 'hi' ? 'bg-[#144527] text-white' : 'text-[#55685C]'
                    }`}
                  >
                    HI Body
                  </button>
                </div>
                <div className="inline-flex bg-white p-0.5 rounded-lg border border-[#DCE5DE]">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      editorTab === 'write' ? 'bg-[#144527] text-white' : 'text-[#55685C]'
                    }`}
                  >
                    <Pencil className="w-3 h-3" /> Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold cursor-pointer ${
                      editorTab === 'preview' ? 'bg-[#144527] text-white' : 'text-[#55685C]'
                    }`}
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>
              </div>
            </div>

            {editorTab === 'write' ? (
              <textarea
                rows={8}
                placeholder={
                  activeBodyLang === 'en'
                    ? 'Write full article body in English using Markdown headings (##), bold (**text**), lists, quotes (>), or inline uploaded photos...'
                    : 'पूरा लेख हिंदी में लिखें (## शीर्षक, **मोटा अक्षर**, सूची, उद्धरण > आदि)...'
                }
                value={activeBodyLang === 'en' ? editing.bodyEn ?? '' : editing.bodyHi ?? ''}
                onChange={(e) =>
                  setEditing(
                    activeBodyLang === 'en'
                      ? { ...editing, bodyEn: e.target.value }
                      : { ...editing, bodyHi: e.target.value }
                  )
                }
                className="w-full p-3.5 text-xs font-mono leading-relaxed focus:outline-none"
              />
            ) : (
              <div className="p-5 bg-[#FAFBF8] space-y-2.5 min-h-[180px] text-xs text-[#223227]">
                <p className="text-[11px] font-mono text-[#368737]">
                  Public URL: /articles/{editing.slug || slugifyTitle(editing.titleEn || 'draft')}
                </p>
                <h4 className="text-base font-bold text-[#142119]">
                  {activeBodyLang === 'hi' ? editing.titleHi || editing.titleEn : editing.titleEn || 'Untitled Article'}
                </h4>
                {(activeBodyLang === 'hi' ? editing.bodyHi || editing.bodyEn || '' : editing.bodyEn || '')
                  .split('\n\n')
                  .filter(Boolean)
                  .map((block, i) => {
                    if (block.startsWith('## ')) {
                      return (
                        <h5 key={i} className="text-sm font-bold text-[#144527] pt-2">
                          {block.slice(3)}
                        </h5>
                      );
                    }
                    if (block.startsWith('### ')) {
                      return (
                        <h6 key={i} className="text-xs font-bold text-[#142119] pt-1">
                          {block.slice(4)}
                        </h6>
                      );
                    }
                    if (block.startsWith('> ')) {
                      return (
                        <blockquote
                          key={i}
                          className="pl-3 border-l-2 border-[#368737] italic text-[#44544A]"
                        >
                          {block.slice(2)}
                        </blockquote>
                      );
                    }
                    return (
                      <p key={i} className="leading-relaxed whitespace-pre-line">
                        {block}
                      </p>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Media Upload Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 bg-[#F8FAF8] p-3.5 rounded-xl border border-[#E5ECE6]">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#142119] block">
                Cover Image URL / Upload
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="/assets/... or URL"
                  value={editing.mediaUrl ?? ''}
                  onChange={(e) => setEditing({ ...editing, mediaUrl: e.target.value })}
                  className="flex-1 min-w-0 rounded-xl border border-[#DCE5DE] px-2.5 py-1.5 font-mono bg-white"
                />
                <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#EDF5EE] font-semibold text-[#144527] cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'image' ? '...' : 'Image'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], 'image')}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#142119] block">
                Video URL / Upload (MP4/WEBM)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="/uploads/... or YouTube/MP4 URL"
                  value={editing.videoUrl ?? ''}
                  onChange={(e) => setEditing({ ...editing, videoUrl: e.target.value })}
                  className="flex-1 min-w-0 rounded-xl border border-[#DCE5DE] px-2.5 py-1.5 font-mono bg-white"
                />
                <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#EDF5EE] font-semibold text-[#144527] cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'video' ? '...' : 'Video'}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], 'video')}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#142119] block">
                PDF Attachment URL / Upload
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="/uploads/...pdf"
                  value={editing.pdfUrl ?? ''}
                  onChange={(e) => setEditing({ ...editing, pdfUrl: e.target.value })}
                  className="flex-1 min-w-0 rounded-xl border border-[#DCE5DE] px-2.5 py-1.5 font-mono bg-white"
                />
                <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#DCE5DE] bg-white hover:bg-[#EDF5EE] font-semibold text-[#144527] cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'pdf' ? '...' : 'PDF'}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0], 'pdf')}
                  />
                </label>
              </div>
            </div>
          </div>

          {editing.sectionType === 'training' && (
            <div className="p-4 rounded-xl bg-[#FAFBF8] border border-[#E2EAE4] space-y-3">
              <p className="font-bold text-[#144527]">
                Course &amp; Training Batch Details (Rendered on Training &amp; Courses Page)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Eligibility (English)"
                  value={editing.courseMeta?.eligibilityEn ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), eligibilityEn: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Eligibility (Hindi)"
                  value={editing.courseMeta?.eligibilityHi ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), eligibilityHi: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Trainer / Faculty Panel"
                  value={editing.courseMeta?.trainerName ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), trainerName: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Duration (English, e.g. 12 Weeks)"
                  value={editing.courseMeta?.durationEn ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), durationEn: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Duration (Hindi)"
                  value={editing.courseMeta?.durationHi ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), durationHi: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Apply Form Slug (e.g. training)"
                  value={editing.courseMeta?.applyRoute ?? 'training'}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), applyRoute: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Mode (English, e.g. Hybrid / Online)"
                  value={editing.courseMeta?.modeEn ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), modeEn: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Mode (Hindi)"
                  value={editing.courseMeta?.modeHi ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: { ...(editing.courseMeta ?? EMPTY_COURSE_META), modeHi: e.target.value },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
                <input
                  type="text"
                  placeholder="Fee Status (English / Hindi)"
                  value={editing.courseMeta?.feeStatusEn ?? ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      courseMeta: {
                        ...(editing.courseMeta ?? EMPTY_COURSE_META),
                        feeStatusEn: e.target.value,
                        feeStatusHi: editing.courseMeta?.feeStatusHi || e.target.value,
                      },
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Content'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#55685C]">
                <span className="font-semibold text-[#368737] capitalize">
                  {item.sectionType.replace('_', ' ')} · {item.categoryTag}
                  {item.relatedMissionSlug ? ` · #${item.relatedMissionSlug}` : ''}
                </span>
                <span
                  className={
                    item.status === 'Published'
                      ? 'text-emerald-700 font-semibold'
                      : 'text-amber-700 font-semibold'
                  }
                >
                  {item.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#142119]">{item.titleEn}</h3>
              {item.titleHi && <p className="text-xs text-[#368737]">{item.titleHi}</p>}
              <p className="text-xs text-[#55685C] leading-relaxed">{item.summaryEn}</p>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#6B7E71]">
                {item.mediaUrl && <span className="truncate max-w-[200px]">IMG: {item.mediaUrl}</span>}
                {item.videoUrl && <span className="truncate max-w-[200px]">VID: {item.videoUrl}</span>}
                {item.pdfUrl && <span className="truncate max-w-[200px]">PDF: {item.pdfUrl}</span>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
              <button
                type="button"
                onClick={() => setEditing(item)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE5DE] text-xs font-semibold text-[#144527] hover:bg-[#EDF5EE] cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
                aria-label={`Delete ${item.titleEn}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface AdminDonationsViewProps {
  reports: AdminDonationReport[];
  csrProposals: AdminCsrProposal[];
  initialSubTab?: 'csr' | 'ledger';
  onSaveReport: (r: Partial<AdminDonationReport>) => Promise<void>;
  onDeleteReport: (id: string) => Promise<void>;
  onSaveCsrProposal: (p: Partial<AdminCsrProposal>) => Promise<void>;
  onDeleteCsrProposal: (id: string) => Promise<void>;
  onUploadMedia: (file: File) => Promise<{
    url: string;
    mediaType: 'image' | 'video' | 'pdf';
    fileName: string;
    sizeBytes: number;
  }>;
}

export function AdminDonationsView({
  reports,
  csrProposals,
  initialSubTab = 'csr',
  onSaveReport,
  onDeleteReport,
  onSaveCsrProposal,
  onDeleteCsrProposal,
  onUploadMedia,
}: AdminDonationsViewProps) {
  const [subTab, setSubTab] = useState<'csr' | 'ledger'>(initialSubTab);
  React.useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);
  const [editingReport, setEditingReport] = useState<Partial<AdminDonationReport> | null>(null);
  const [editingProposal, setEditingProposal] = useState<Partial<AdminCsrProposal> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport?.title?.trim()) return;
    setSaving(true);
    try {
      await onSaveReport(editingReport);
      setEditingReport(null);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProposal?.titleEn?.trim()) return;
    setSaving(true);
    try {
      await onSaveCsrProposal(editingProposal);
      setEditingProposal(null);
    } finally {
      setSaving(false);
    }
  };

  const handleProposalPdfUpload = async (file: File | undefined) => {
    if (!file || !editingProposal) return;
    setUploadingPdf(true);
    try {
      const res = await onUploadMedia(file);
      setEditingProposal({ ...editingProposal, proposalPdfUrl: res.url });
    } finally {
      setUploadingPdf(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            CSR Project Proposals &amp; Donation Transparency
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Publish structured CSR project tracks to the Partnership page and track verified institutional receipts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-[#F3F6F3] p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setSubTab('csr')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                subTab === 'csr' ? 'bg-white text-[#144527] shadow-2xs' : 'text-[#55685C]'
              }`}
            >
              CSR Proposals ({csrProposals.length})
            </button>
            <button
              type="button"
              onClick={() => setSubTab('ledger')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                subTab === 'ledger' ? 'bg-white text-[#144527] shadow-2xs' : 'text-[#55685C]'
              }`}
            >
              Receipt Ledger ({reports.length})
            </button>
          </div>
          {subTab === 'csr' ? (
            <button
              type="button"
              onClick={() =>
                setEditingProposal({
                  id: '',
                  titleEn: '',
                  titleHi: '',
                  missionPillar: 'Harit Rajasthan & Tree Plantation',
                  targetDistricts: 'Bhilwara, Churu',
                  budgetLabel: 'CSR / Co-Funding Concept Note',
                  beneficiaryScopeEn: '',
                  beneficiaryScopeHi: '',
                  summaryEn: '',
                  summaryHi: '',
                  proposalPdfUrl: '',
                  status: 'Proposed',
                  isPublished: true,
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add CSR Proposal</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setEditingReport({
                  id: '',
                  title: '',
                  fiscalPeriod: 'FY 2026–27',
                  donorCategory: 'CSR Grant',
                  amountInr: 0,
                  receiptStatus: 'Pending Verification',
                  transparencyNote: '',
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Report</span>
            </button>
          )}
        </div>
      </div>

      {subTab === 'csr' && (
        <>
          {editingProposal && (
            <form
              onSubmit={handleSaveProposal}
              className="bg-white rounded-2xl border border-[#368737]/40 p-5 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#142119]">
                  {editingProposal.id ? 'Edit CSR Project Proposal' : 'New CSR Project Proposal'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProposal(null)}
                  className="text-[#55685C] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Proposal Title (English)"
                  value={editingProposal.titleEn ?? ''}
                  onChange={(e) => setEditingProposal({ ...editingProposal, titleEn: e.target.value })}
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Proposal Title (Hindi)"
                  value={editingProposal.titleHi ?? ''}
                  onChange={(e) => setEditingProposal({ ...editingProposal, titleHi: e.target.value })}
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Mission Pillar"
                  value={editingProposal.missionPillar ?? ''}
                  onChange={(e) =>
                    setEditingProposal({ ...editingProposal, missionPillar: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Target Districts"
                  value={editingProposal.targetDistricts ?? ''}
                  onChange={(e) =>
                    setEditingProposal({ ...editingProposal, targetDistricts: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Indicative Budget / Scale Label"
                  value={editingProposal.budgetLabel ?? ''}
                  onChange={(e) =>
                    setEditingProposal({ ...editingProposal, budgetLabel: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <select
                  value={editingProposal.status ?? 'Proposed'}
                  onChange={(e) =>
                    setEditingProposal({
                      ...editingProposal,
                      status: e.target.value as AdminCsrProposal['status'],
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                >
                  <option value="Proposed">Proposed</option>
                  <option value="Open for CSR">Open for CSR</option>
                  <option value="Supported">Supported</option>
                </select>
                <input
                  type="text"
                  placeholder="Beneficiary Scope (English)"
                  value={editingProposal.beneficiaryScopeEn ?? ''}
                  onChange={(e) =>
                    setEditingProposal({ ...editingProposal, beneficiaryScopeEn: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Beneficiary Scope (Hindi)"
                  value={editingProposal.beneficiaryScopeHi ?? ''}
                  onChange={(e) =>
                    setEditingProposal({ ...editingProposal, beneficiaryScopeHi: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <textarea
                  rows={2}
                  placeholder="Proposal Overview (English)"
                  value={editingProposal.summaryEn ?? ''}
                  onChange={(e) =>
                    setEditingProposal({ ...editingProposal, summaryEn: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <textarea
                  rows={2}
                  placeholder="Proposal Overview (Hindi)"
                  value={editingProposal.summaryHi ?? ''}
                  onChange={(e) =>
                    setEditingProposal({ ...editingProposal, summaryHi: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <input
                    type="text"
                    placeholder="CSR Concept Note PDF URL"
                    value={editingProposal.proposalPdfUrl ?? ''}
                    onChange={(e) =>
                      setEditingProposal({ ...editingProposal, proposalPdfUrl: e.target.value })
                    }
                    className="flex-1 rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DCE5DE] bg-[#F8FAF8] font-semibold text-[#144527] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPdf ? 'Uploading...' : 'Upload PDF'}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleProposalPdfUpload(e.target.files?.[0])}
                    />
                  </label>
                </div>
                <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
                  <input
                    type="checkbox"
                    checked={editingProposal.isPublished !== false}
                    onChange={(e) =>
                      setEditingProposal({ ...editingProposal, isPublished: e.target.checked })
                    }
                  />
                  <span>Published on CSR Partnership Page</span>
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save CSR Proposal'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {csrProposals.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#368737]">{p.missionPillar}</span>
                    <span className="font-semibold text-[#144527]">
                      {p.status} {p.isPublished ? '· Live' : '· Hidden'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#142119]">{p.titleEn}</h3>
                  {p.titleHi && <p className="text-xs text-[#368737]">{p.titleHi}</p>}
                  <p className="text-xs text-[#55685C]">{p.summaryEn}</p>
                  <p className="text-[11px] font-mono text-[#6B7E71]">
                    Districts: {p.targetDistricts} · {p.budgetLabel}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
                  <button
                    type="button"
                    onClick={() => setEditingProposal(p)}
                    className="px-3 py-1.5 rounded-lg border border-[#DCE5DE] text-xs font-semibold text-[#144527] hover:bg-[#EDF5EE] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCsrProposal(p.id)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
                    aria-label={`Delete ${p.titleEn}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {subTab === 'ledger' && (
        <>
          {editingReport && (
            <form
              onSubmit={handleSaveReport}
              className="bg-white rounded-2xl border border-[#368737]/40 p-5 space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Report / Receipt Title"
                  value={editingReport.title ?? ''}
                  onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value })}
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Fiscal Period (e.g. FY 2026–27 Q3)"
                  value={editingReport.fiscalPeriod ?? ''}
                  onChange={(e) =>
                    setEditingReport({ ...editingReport, fiscalPeriod: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Donor / CSR Category"
                  value={editingReport.donorCategory ?? ''}
                  onChange={(e) =>
                    setEditingReport({ ...editingReport, donorCategory: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Amount (INR)"
                    value={editingReport.amountInr ?? 0}
                    onChange={(e) =>
                      setEditingReport({
                        ...editingReport,
                        amountInr: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono tabular-nums"
                  />
                  <select
                    value={editingReport.receiptStatus ?? 'Pending Verification'}
                    onChange={(e) =>
                      setEditingReport({
                        ...editingReport,
                        receiptStatus: e.target.value as 'Pending Verification' | 'Verified',
                      })
                    }
                    className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
              </div>
              <textarea
                rows={2}
                placeholder="Statutory compliance / receipt transparency note..."
                value={editingReport.transparencyNote ?? ''}
                onChange={(e) =>
                  setEditingReport({ ...editingReport, transparencyNote: e.target.value })
                }
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-3 py-2 text-[#55685C] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Report'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDF2EE] bg-[#FAFBF8] text-[11px] font-semibold text-[#55685C]">
                  <th className="py-3 px-5">Report Title</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1]">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAFBF8]">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-[#142119]">{r.title}</div>
                      <div className="text-[11px] text-[#6B7E71]">{r.transparencyNote}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">{r.fiscalPeriod}</td>
                    <td className="py-3.5 px-4">{r.donorCategory}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                      <span className="inline-flex items-center gap-0.5">
                        <IndianRupee className="w-3 h-3" />
                        {r.amountInr.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={
                          r.receiptStatus === 'Verified'
                            ? 'text-emerald-700 font-semibold'
                            : 'text-amber-700 font-semibold'
                        }
                      >
                        {r.receiptStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setEditingReport(r)}
                        className="px-2.5 py-1 rounded-lg border border-[#DCE5DE] text-[#144527] font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteReport(r.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-700 cursor-pointer align-middle"
                        aria-label={`Delete ${r.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

interface AdminTeamViewProps {
  currentUserId: number;
  team: AdminTeamMember[];
  districts: AdminDistrictRecord[];
  onSaveMember: (member: {
    email: string;
    displayName: string;
    role: AdminRole;
    assignedDistricts: string[];
    isActive: boolean;
  }) => Promise<void>;
  onDeleteMember: (id: number) => Promise<void>;
}

export function AdminTeamView({
  currentUserId,
  team,
  districts,
  onSaveMember,
  onDeleteMember,
}: AdminTeamViewProps) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<AdminRole>('district_coordinator');
  const [assignedDistricts, setAssignedDistricts] = useState<string[]>(['Bhilwara']);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const toggleDistrict = (name: string) => {
    setAssignedDistricts((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSaving(true);
    try {
      await onSaveMember({
        email,
        displayName: displayName || email.split('@')[0],
        role,
        assignedDistricts: role === 'district_coordinator' ? assignedDistricts : [],
        isActive,
      });
      setEmail('');
      setDisplayName('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 space-y-4 text-xs"
      >
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-[#368737]" />
          <h2 className="text-base font-bold text-[#142119]">
            Authorize Admin Team Member (3-Tier RBAC)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="email"
            required
            placeholder="Google Email Address (e.g. coordinator@gmail.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-[#DCE5DE] px-3 py-2"
          />
          <input
            type="text"
            placeholder="Full Name / Desk Title"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="rounded-xl border border-[#DCE5DE] px-3 py-2"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
          >
            <option value="super_admin">Super Admin (Full Control)</option>
            <option value="district_coordinator">District Coordinator (District-Scoped)</option>
            <option value="content_editor">Content Editor (No Applicant PII)</option>
          </select>
        </div>

        {role === 'district_coordinator' && (
          <div className="space-y-2">
            <p className="font-semibold text-[#142119]">
              Assign Authorized Districts (SQL-enforced boundary):
            </p>
            <div className="flex flex-wrap gap-2">
              {districts.map((d) => {
                const selected = assignedDistricts.includes(d.nameEn);
                return (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => toggleDistrict(d.nameEn)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      selected
                        ? 'border-[#144527] bg-[#EDF5EE] text-[#144527]'
                        : 'border-[#DCE5DE] bg-white text-[#55685C]'
                    }`}
                  >
                    {d.nameEn}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-[#144527]"
            />
            <span>Account Active</span>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Authorizing...' : 'Save Team Role'}</span>
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EDF2EE] bg-[#FAFBF8] text-[11px] font-semibold text-[#55685C]">
                <th className="py-3 px-5">Admin User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">District Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F1]">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-[#FAFBF8]">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-[#142119]">{member.displayName}</div>
                    <div className="font-mono text-[11px] text-[#6B7E71]">{member.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#144527]">
                    {ROLE_LABELS[member.role]}
                  </td>
                  <td className="py-3.5 px-4 text-[#55685C]">
                    {member.role === 'super_admin'
                      ? 'All Districts'
                      : member.role === 'content_editor'
                      ? 'Content Only (No PII)'
                      : member.assignedDistricts.join(', ') || 'None assigned'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={
                        member.isActive
                          ? 'text-emerald-700 font-semibold'
                          : 'text-red-700 font-semibold'
                      }
                    >
                      {member.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(member.email);
                        setDisplayName(member.displayName);
                        setRole(member.role);
                        setAssignedDistricts(member.assignedDistricts);
                        setIsActive(member.isActive);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-[#DCE5DE] text-[#144527] font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    {member.id !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => onDeleteMember(member.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-700 cursor-pointer align-middle"
                        aria-label={`Remove ${member.email}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const SUPABASE_RLS_SQL = `-- GOVEDA Carbon & Climate India Foundation
-- Supabase Production Row Level Security (RLS) Handoff Script
-- Run after pushing your Drizzle PostgreSQL schema (npx drizzle-kit push) to Supabase:

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public can read open form definitions & insert new submissions (never read PII)
CREATE POLICY "public_read_forms" ON form_definitions
  FOR SELECT USING (true);

CREATE POLICY "public_submit_form" ON form_submissions
  FOR INSERT WITH CHECK (consent_accepted = true);

-- 2. Super Admin full access to submissions
CREATE POLICY "super_admin_all_submissions" ON form_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
        AND au.role = 'super_admin'
        AND au.is_active = true
    )
  );

-- 3. District Coordinator scoped access by assigned_districts JSONB array
CREATE POLICY "coordinator_district_submissions" ON form_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
        AND au.role = 'district_coordinator'
        AND au.is_active = true
        AND au.assigned_districts ? form_submissions.district
    )
  );`;

interface AdminAuditLogViewProps {
  logs: AdminAuditLog[];
}

export function AdminAuditLogView({ logs }: AdminAuditLogViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_RLS_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden">
        <div className="p-5 border-b border-[#EDF2EE] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#368737]">
              <Shield className="w-4 h-4" />
              <span>Immutable Governance Record</span>
            </div>
            <h2 className="text-base font-bold text-[#142119] mt-0.5">
              Security Audit Trail
            </h2>
          </div>
          <span className="text-xs font-mono text-[#6B7E71] tabular-nums">
            {logs.length} recent events
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#55685C]">
            <FileText className="w-6 h-6 mx-auto mb-2 text-[#98AA9D]" />
            No administrative mutations logged yet. Status changes, form edits, CSV exports, and role updates appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDF2EE] bg-[#FAFBF8] text-[11px] font-semibold text-[#55685C]">
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-5">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAFBF8]">
                    <td className="py-3 px-5 font-mono text-[11px] text-[#6B7E71] tabular-nums whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[#142119]">{log.actorEmail}</span>
                      <span className="text-[#6B7E71]"> · {log.actorRole}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#144527] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#55685C] whitespace-nowrap">
                      {log.entityType}/{log.entityId}
                    </td>
                    <td className="py-3 px-5 text-[#2A3A30]">{log.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Supabase Production Handoff Reference */}
      <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#368737]">
              <Database className="w-4 h-4" />
              <span>Supabase Production Cutover Blueprint</span>
            </div>
            <h3 className="text-sm font-bold text-[#142119] mt-0.5">
              PostgreSQL Schema &amp; Row Level Security (RLS) Ready for Supabase
            </h3>
            <p className="text-xs text-[#55685C] mt-0.5">
              Because all 10 tables use standard PostgreSQL + Drizzle ORM, moving to Supabase requires only pointing Drizzle at Supabase Postgres, swapping the single token verifier in auth middleware, and running this RLS script.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCE5DE] hover:bg-[#EDF5EE] text-xs font-semibold text-[#144527] cursor-pointer self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL' : 'Copy RLS SQL'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-[#142119] text-[#D7ECD9] text-[11px] font-mono overflow-x-auto leading-relaxed">
          {SUPABASE_RLS_SQL}
        </pre>
      </section>
    </div>
  );
}

interface AdminSiteGovernanceViewProps {
  governance: AdminSiteGovernance | null;
  onSaveGovernance: (patch: Partial<AdminSiteGovernance>) => Promise<void>;
  onUploadMedia: (file: File) => Promise<{
    url: string;
    mediaType: 'image' | 'video' | 'pdf';
    fileName: string;
    sizeBytes: number;
  }>;
}

export function AdminSiteGovernanceView({
  governance,
  onSaveGovernance,
  onUploadMedia,
}: AdminSiteGovernanceViewProps) {
  const [draft, setDraft] = useState<AdminSiteGovernance | null>(governance);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<LeadershipMemberSpec>({
    id: '',
    name: '',
    category: 'Advisory',
    advisoryDomain: ADVISORY_DOMAIN_CATEGORIES[0].id,
    roleEn: '',
    roleHi: '',
    qualification: '',
    bioEn: '',
    bioHi: '',
    photoUrl: '',
    linkedinUrl: '',
    confirmedForPublic: false,
  });
  const [newReport, setNewReport] = useState<AnnualReportDocSpec>({
    id: '',
    fiscalYear: 'FY 2026-27',
    titleEn: '',
    titleHi: '',
    docCategory: 'Annual Report',
    pdfUrl: '',
    publishedDate: new Date().toISOString().slice(0, 10),
    isPublished: false,
  });

  useEffect(() => {
    setDraft(governance);
  }, [governance]);

  if (!draft) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-8 text-center text-xs text-[#55685C]">
        Loading Site &amp; Legal Governance configuration...
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveGovernance(draft);
    } finally {
      setSaving(false);
    }
  };

  const handleMagPdfUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingKey('mag');
    try {
      const res = await onUploadMedia(file);
      setDraft({ ...draft, magazineLatestPdfUrl: res.url });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleMemberPhotoUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingKey('member');
    try {
      const res = await onUploadMedia(file);
      setNewMember({ ...newMember, photoUrl: res.url });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleReportPdfUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingKey('annualReport');
    try {
      const res = await onUploadMedia(file);
      setNewReport({ ...newReport, pdfUrl: res.url });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleAddReport = () => {
    if (!draft || !newReport.titleEn.trim() || !newReport.pdfUrl.trim()) return;
    const item: AnnualReportDocSpec = {
      ...newReport,
      id: newReport.id || `rep-${Date.now().toString(36)}`,
      titleEn: newReport.titleEn.trim(),
      titleHi: newReport.titleHi.trim() || newReport.titleEn.trim(),
      pdfUrl: newReport.pdfUrl.trim(),
    };
    setDraft({
      ...draft,
      annualReports: [...(draft.annualReports ?? []), item],
    });
    setNewReport({
      id: '',
      fiscalYear: 'FY 2026-27',
      titleEn: '',
      titleHi: '',
      docCategory: 'Annual Report',
      pdfUrl: '',
      publishedDate: new Date().toISOString().slice(0, 10),
      isPublished: false,
    });
  };

  const handleAddLeader = () => {
    if (!newMember.name.trim() || !newMember.roleEn.trim()) return;
    const item: LeadershipMemberSpec = {
      ...newMember,
      id: newMember.id || `ldr-${Date.now().toString(36)}`,
      name: newMember.name.trim(),
      roleEn: newMember.roleEn.trim(),
      roleHi: newMember.roleHi.trim() || newMember.roleEn.trim(),
    };
    setDraft({
      ...draft,
      leadershipRoster: [...(draft.leadershipRoster ?? []), item],
    });
    setNewMember({
      id: '',
      name: '',
      category: 'Advisory',
      advisoryDomain: ADVISORY_DOMAIN_CATEGORIES[0].id,
      roleEn: '',
      roleHi: '',
      qualification: '',
      bioEn: '',
      bioHi: '',
      photoUrl: '',
      linkedinUrl: '',
      confirmedForPublic: false,
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs">
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Site, Legal &amp; Transparency Governance
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Strict Institutional Honesty Controls — unconfirmed office addresses, banking accounts, or leadership profiles stay hidden from public endpoints automatically
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Governance'}</span>
        </button>
      </div>

      {/* 1. Magazine & Geo-MRV */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#142119]">
            <FileText className="w-4 h-4 text-[#368737]" />
            <span>Quarterly Magazine Controls</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              placeholder="Magazine Title (English)"
              value={draft.magazineTitleEn}
              onChange={(e) => setDraft({ ...draft, magazineTitleEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Magazine Title (Hindi)"
              value={draft.magazineTitleHi}
              onChange={(e) => setDraft({ ...draft, magazineTitleHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <select
              value={draft.magazineRegStatus}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  magazineRegStatus: e.target.value as 'Proposed' | 'Registered',
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="Proposed">RNI Status: Proposed</option>
              <option value="Registered">RNI Status: Registered</option>
            </select>
            <input
              type="text"
              placeholder="RNI / Registration No. (if Registered)"
              value={draft.magazineRegNumber}
              onChange={(e) => setDraft({ ...draft, magazineRegNumber: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Latest Digital Issue PDF URL"
              value={draft.magazineLatestPdfUrl}
              onChange={(e) => setDraft({ ...draft, magazineLatestPdfUrl: e.target.value })}
              className="flex-1 rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
            />
            <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DCE5DE] bg-[#F8FAF8] font-semibold text-[#144527] cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingKey === 'mag' ? '...' : 'Upload PDF'}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleMagPdfUpload(e.target.files?.[0])}
              />
            </label>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-[#142119]">
            <Globe className="w-4 h-4 text-[#368737]" />
            <span>Carbon Geo-MRV Software Integration</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <select
              value={draft.geoMrvStatus}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  geoMrvStatus: e.target.value as 'coming_soon' | 'active',
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="coming_soon">Status: Coming Soon (Separate Software)</option>
              <option value="active">Status: Active Geo-MRV Portal Live</option>
            </select>
            <input
              type="text"
              placeholder="External Geo-MRV Portal URL"
              value={draft.geoMrvUrl}
              onChange={(e) => setDraft({ ...draft, geoMrvUrl: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Geo-MRV Status Disclosure (English)"
            value={draft.geoMrvNoteEn}
            onChange={(e) => setDraft({ ...draft, geoMrvNoteEn: e.target.value })}
            className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
          />
          <textarea
            rows={2}
            placeholder="Geo-MRV Status Disclosure (Hindi)"
            value={draft.geoMrvNoteHi}
            onChange={(e) => setDraft({ ...draft, geoMrvNoteHi: e.target.value })}
            className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
          />
        </section>
      </div>

      {/* 2. Verified Office & Banking/Legal Gates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#142119]">
              <Building2 className="w-4 h-4 text-[#368737]" />
              <span>Office Contact Verification Gate</span>
            </div>
            <label className="inline-flex items-center gap-1.5 font-semibold text-[#144527] cursor-pointer">
              <input
                type="checkbox"
                checked={draft.officeConfirmedForPublic}
                onChange={(e) =>
                  setDraft({ ...draft, officeConfirmedForPublic: e.target.checked })
                }
              />
              <span>Publish Office Address &amp; Phone</span>
            </label>
          </div>
          <textarea
            rows={2}
            placeholder="Verified Office Street Address (English)"
            value={draft.headOfficeAddressEn}
            onChange={(e) => setDraft({ ...draft, headOfficeAddressEn: e.target.value })}
            className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
          />
          <textarea
            rows={2}
            placeholder="Verified Office Street Address (Hindi)"
            value={draft.headOfficeAddressHi}
            onChange={(e) => setDraft({ ...draft, headOfficeAddressHi: e.target.value })}
            className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
          />
          <input
            type="text"
            placeholder="Official Helpline Phone Number"
            value={draft.officialPhone}
            onChange={(e) => setDraft({ ...draft, officialPhone: e.target.value })}
            className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
          />
        </section>

        <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#142119]">
              <Landmark className="w-4 h-4 text-[#368737]" />
              <span>Statutory Approvals &amp; Banking Controls</span>
            </div>
            <label className="inline-flex items-center gap-1.5 font-semibold text-[#144527] cursor-pointer">
              <input
                type="checkbox"
                checked={draft.bankConfirmedForPublic}
                onChange={(e) =>
                  setDraft({ ...draft, bankConfirmedForPublic: e.target.checked })
                }
              />
              <span>Publish Verified Bank Details</span>
            </label>
          </div>
          <textarea
            rows={2}
            placeholder="Verified Bank Account / IFSC Summary (shown ONLY if checked above)"
            value={draft.bankAccountSummary}
            onChange={(e) => setDraft({ ...draft, bankAccountSummary: e.target.value })}
            className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
          />
          <div className="grid grid-cols-3 gap-2">
            <label className="inline-flex items-center gap-1.5 font-semibold text-[#142119]">
              <input
                type="checkbox"
                checked={draft.paymentGatewayEnabled}
                onChange={(e) =>
                  setDraft({ ...draft, paymentGatewayEnabled: e.target.checked })
                }
              />
              <span>Online Gateway Live</span>
            </label>
            <label className="inline-flex items-center gap-1.5 font-semibold text-[#142119]">
              <input
                type="checkbox"
                checked={draft.eightyGApproved}
                onChange={(e) => setDraft({ ...draft, eightyGApproved: e.target.checked })}
              />
              <span>80G Approved</span>
            </label>
            <label className="inline-flex items-center gap-1.5 font-semibold text-[#142119]">
              <input
                type="checkbox"
                checked={draft.fcraApproved}
                onChange={(e) => setDraft({ ...draft, fcraApproved: e.target.checked })}
              />
              <span>FCRA Approved</span>
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="CIN / Reg No."
              value={draft.cinNumber}
              onChange={(e) => setDraft({ ...draft, cinNumber: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-2.5 py-2 font-mono"
            />
            <input
              type="text"
              placeholder="PAN"
              value={draft.panNumber}
              onChange={(e) => setDraft({ ...draft, panNumber: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-2.5 py-2 font-mono"
            />
            <input
              type="text"
              placeholder="NGO Darpan ID"
              value={draft.darpanId}
              onChange={(e) => setDraft({ ...draft, darpanId: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-2.5 py-2 font-mono"
            />
            <input
              type="text"
              placeholder="Udyam / MSME"
              value={draft.msmeNumber}
              onChange={(e) => setDraft({ ...draft, msmeNumber: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-2.5 py-2 font-mono"
            />
          </div>
        </section>
      </div>

      {/* 3. Annual Reports & Statutory Compliance PDFs */}
      <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-[#142119]">
          <FileText className="w-4 h-4 text-[#368737]" />
          <span>Annual Reports &amp; Statutory Compliance PDF Library</span>
        </div>
        <p className="text-xs text-[#55685C]">
          Upload official Annual Reports, Audited Financial Statements, CSR Disclosures, or Section 8 Governance PDFs. Only documents marked &quot;Published&quot; appear publicly on the About Us Transparency Hub.
        </p>

        <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E5ECE6] space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <select
              value={newReport.docCategory}
              onChange={(e) =>
                setNewReport({
                  ...newReport,
                  docCategory: e.target.value as AnnualReportDocSpec['docCategory'],
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="Annual Report">Annual Report</option>
              <option value="Audited Financials">Audited Financials</option>
              <option value="CSR Impact">CSR Impact Report</option>
              <option value="Statutory Filing">Statutory Filing</option>
            </select>
            <input
              type="text"
              placeholder="Fiscal Year (e.g. FY 2026-27)"
              value={newReport.fiscalYear}
              onChange={(e) => setNewReport({ ...newReport, fiscalYear: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white font-mono"
            />
            <input
              type="text"
              placeholder="Document Title (English) *"
              value={newReport.titleEn}
              onChange={(e) => setNewReport({ ...newReport, titleEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            />
            <input
              type="text"
              placeholder="Document Title (Hindi)"
              value={newReport.titleHi}
              onChange={(e) => setNewReport({ ...newReport, titleHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2 flex gap-2">
              <input
                type="text"
                placeholder="PDF URL or upload document *"
                value={newReport.pdfUrl}
                onChange={(e) => setNewReport({ ...newReport, pdfUrl: e.target.value })}
                className="flex-1 rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white font-mono"
              />
              <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DCE5DE] bg-white font-semibold text-[#144527] cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingKey === 'annualReport' ? '...' : 'Upload PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleReportPdfUpload(e.target.files?.[0])}
                />
              </label>
            </div>
            <input
              type="date"
              value={newReport.publishedDate}
              onChange={(e) => setNewReport({ ...newReport, publishedDate: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white font-mono"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
              <input
                type="checkbox"
                checked={newReport.isPublished}
                onChange={(e) =>
                  setNewReport({ ...newReport, isPublished: e.target.checked })
                }
              />
              <span>Publish on Public About Us Page</span>
            </label>
            <button
              type="button"
              onClick={handleAddReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Report PDF (Save Governance to Persist)</span>
            </button>
          </div>
        </div>

        {(draft.annualReports ?? []).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(draft.annualReports ?? []).map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl border border-[#E2EAE4] bg-white flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] font-semibold text-[#368737] font-mono">
                    {rep.fiscalYear} · {rep.docCategory} · {rep.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <h4 className="font-bold text-sm text-[#142119] truncate">{rep.titleEn}</h4>
                  <p className="text-[11px] font-mono text-[#6B7E71] truncate">{rep.pdfUrl}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        annualReports: (draft.annualReports ?? []).map((r) =>
                          r.id === rep.id ? { ...r, isPublished: !r.isPublished } : r
                        ),
                      })
                    }
                    className="px-2.5 py-1 rounded-lg border border-[#DCE5DE] text-[11px] font-semibold text-[#144527] cursor-pointer"
                  >
                    {rep.isPublished ? 'Hide' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        annualReports: (draft.annualReports ?? []).filter((r) => r.id !== rep.id),
                      })
                    }
                    className="p-1.5 rounded-lg border border-red-200 text-red-700 cursor-pointer"
                    aria-label={`Remove ${rep.titleEn}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Leadership & 10-Domain Advisory Roster */}
      <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-[#142119]">
          <UserCheck className="w-4 h-4 text-[#368737]" />
          <span>Leadership &amp; 10-Domain Advisory Board Roster</span>
        </div>
        <p className="text-xs text-[#55685C]">
          Add directors or domain advisors across GOVEDA&apos;s 10 official advisory domains. Only members with written consent (&quot;Confirmed for Public&quot;) appear on the About Us page.
        </p>

        <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E5ECE6] space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <input
              type="text"
              placeholder="Full Name *"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            />
            <select
              value={newMember.category}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  category: e.target.value as 'Leadership' | 'Advisory',
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              <option value="Advisory">Advisory Board</option>
              <option value="Leadership">Leadership</option>
            </select>
            <select
              value={newMember.advisoryDomain ?? ADVISORY_DOMAIN_CATEGORIES[0].id}
              onChange={(e) =>
                setNewMember({ ...newMember, advisoryDomain: e.target.value })
              }
              className="sm:col-span-2 rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              {ADVISORY_DOMAIN_CATEGORIES.map((dom) => (
                <option key={dom.id} value={dom.id}>
                  Domain: {dom.en}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              placeholder="Designation (English) *"
              value={newMember.roleEn}
              onChange={(e) => setNewMember({ ...newMember, roleEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            />
            <input
              type="text"
              placeholder="Designation (Hindi)"
              value={newMember.roleHi}
              onChange={(e) => setNewMember({ ...newMember, roleHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            />
            <input
              type="text"
              placeholder="Qualification / Affiliation (e.g. PhD, Ex-IFS)"
              value={newMember.qualification ?? ''}
              onChange={(e) => setNewMember({ ...newMember, qualification: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              placeholder="Short Bio / Domain Expertise (English)"
              value={newMember.bioEn}
              onChange={(e) => setNewMember({ ...newMember, bioEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Photo URL (Optional)"
                value={newMember.photoUrl}
                onChange={(e) => setNewMember({ ...newMember, photoUrl: e.target.value })}
                className="flex-1 rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white font-mono"
              />
              <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#DCE5DE] bg-white font-semibold text-[#144527] cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingKey === 'member' ? '...' : 'Photo'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleMemberPhotoUpload(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
              <input
                type="checkbox"
                checked={newMember.confirmedForPublic}
                onChange={(e) =>
                  setNewMember({ ...newMember, confirmedForPublic: e.target.checked })
                }
              />
              <span>Written Consent Received — Confirmed for Public Display</span>
            </label>
            <button
              type="button"
              onClick={handleAddLeader}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Roster (Save Governance to Persist)</span>
            </button>
          </div>
        </div>

        {draft.leadershipRoster.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {draft.leadershipRoster.map((member) => {
              const domainMeta = ADVISORY_DOMAIN_CATEGORIES.find(
                (d) => d.id === member.advisoryDomain
              );
              return (
                <div
                  key={member.id}
                  className="p-4 rounded-xl border border-[#E2EAE4] bg-white flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="text-[11px] font-semibold text-[#368737]">
                      {member.category}
                      {domainMeta ? ` · ${domainMeta.en}` : ''} ·{' '}
                      {member.confirmedForPublic ? 'Confirmed Live' : 'Internal Only'}
                    </span>
                    <h4 className="font-bold text-sm text-[#142119]">{member.name}</h4>
                    <p className="text-xs text-[#55685C]">
                      {member.roleEn}
                      {member.qualification ? ` · ${member.qualification}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          leadershipRoster: draft.leadershipRoster.map((m) =>
                            m.id === member.id
                              ? { ...m, confirmedForPublic: !m.confirmedForPublic }
                              : m
                          ),
                        })
                      }
                      className="px-2.5 py-1 rounded-lg border border-[#DCE5DE] text-[11px] font-semibold text-[#144527] cursor-pointer"
                    >
                      {member.confirmedForPublic ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          leadershipRoster: draft.leadershipRoster.filter(
                            (m) => m.id !== member.id
                          ),
                        })
                      }
                      className="p-1.5 rounded-lg border border-red-200 text-red-700 cursor-pointer"
                      aria-label={`Remove ${member.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </form>
  );
}

