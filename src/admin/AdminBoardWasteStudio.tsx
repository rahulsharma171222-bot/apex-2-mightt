import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileJson,
  FileSpreadsheet,
  Globe,
  Image as ImageIcon,
  Linkedin,
  MessageSquareQuote,
  Pencil,
  Plus,
  Recycle,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import type { LeadershipMemberSpec } from '../db/schema';
import type {
  AdminSiteGovernance,
  FounderMessageConfig,
  WasteActivityRecord,
  WastePartnerRecord,
} from './types';
import { INDIA_STATES_DIRECTORY, findStateByNameOrSlug } from '../data/indiaLocations';
import {
  ADVISORY_EXPERTISE_CATEGORIES,
  summarizeWasteRecords,
} from '../utils/adminLogic';

/* ============================================================================
   1. BOARD, TEAM & ADVISORY MANAGER + FOUNDER MESSAGE MANAGER
   Strictly separates Founder & President, Office Bearers (Vice President),
   Board of Directors, Advisory Board (10 domains), District Coordinators, etc.
   ============================================================================ */

interface BoardAdvisoryProps {
  governance: AdminSiteGovernance | null;
  founderMessage?: FounderMessageConfig | null;
  onSaveRoster: (roster: LeadershipMemberSpec[]) => Promise<void>;
  onSaveFounderMessage?: (msg: Partial<FounderMessageConfig>) => Promise<void>;
  onUploadMedia?: (file: File) => Promise<{
    url: string;
    mediaType: 'image' | 'video' | 'pdf';
    fileName: string;
    sizeBytes: number;
  }>;
}

const BOARD_CATEGORIES = [
  { key: 'All', label: 'All Profiles' },
  { key: 'Founder & President', label: 'Founder & President' },
  { key: 'Office Bearers', label: 'Office Bearers' },
  { key: 'Board of Directors', label: 'Board of Directors' },
  { key: 'Advisory Board', label: 'Advisory Board' },
  { key: 'Executive Team', label: 'Executive Team' },
  { key: 'District Coordinators', label: 'District Coordinators' },
  { key: 'Volunteers / Experts', label: 'Volunteers / Experts' },
];

const RAJASTHAN_DISTRICTS =
  INDIA_STATES_DIRECTORY.find((s) => s.slug === 'rajasthan')?.districts ?? [
    'Bhilwara',
    'Churu',
    'Bikaner',
    'Phalodi',
    'Jodhpur',
  ];

export function AdminBoardAdvisoryView({
  governance,
  founderMessage,
  onSaveRoster,
  onSaveFounderMessage,
  onUploadMedia,
}: BoardAdvisoryProps) {
  const roster = governance?.leadershipRoster ?? [];
  const [subView, setSubView] = useState<'directory' | 'founder_message'>('directory');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [editing, setEditing] = useState<Partial<LeadershipMemberSpec> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [syncFounderMsgOnSave, setSyncFounderMsgOnSave] = useState(true);

  // Dedicated Founder Message Manager state
  const [msgDraft, setMsgDraft] = useState<FounderMessageConfig>({
    headingEn: founderMessage?.headingEn || 'A Message from Our Founder',
    headingHi: founderMessage?.headingHi || 'संस्थापक का संदेश',
    messageEn: founderMessage?.messageEn || '',
    messageHi: founderMessage?.messageHi || '',
    attributionEn: founderMessage?.attributionEn || 'Raj Kumar Poonia – Founder & President',
    attributionHi: founderMessage?.attributionHi || 'राज कुमार पूनिया – संस्थापक एवं अध्यक्ष',
    signatureImageUrl: founderMessage?.signatureImageUrl || '',
    showOnAboutUs: founderMessage?.showOnAboutUs !== false,
  });
  const [savingMsg, setSavingMsg] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);

  useEffect(() => {
    if (!founderMessage) return;
    setMsgDraft({
      headingEn: founderMessage.headingEn || 'A Message from Our Founder',
      headingHi: founderMessage.headingHi || 'संस्थापक का संदेश',
      messageEn: founderMessage.messageEn || '',
      messageHi: founderMessage.messageHi || '',
      attributionEn: founderMessage.attributionEn || 'Raj Kumar Poonia – Founder & President',
      attributionHi: founderMessage.attributionHi || 'राज कुमार पूनिया – संस्थापक एवं अध्यक्ष',
      signatureImageUrl: founderMessage.signatureImageUrl || '',
      showOnAboutUs: founderMessage.showOnAboutUs !== false,
    });
  }, [founderMessage]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return roster;
    return roster.filter((m) => {
      const cat = (m.category || '').toLowerCase();
      if (activeCategory === 'Advisory Board') return cat.includes('advis');
      if (activeCategory === 'Board of Directors')
        return cat.includes('director') || cat === 'leadership';
      return m.category === activeCategory;
    });
  }, [roster, activeCategory]);

  const openNewMember = (presetCategory?: string) => {
    const chosenCat =
      presetCategory || (activeCategory === 'All' ? 'Office Bearers' : activeCategory);
    setFormError(null);
    setShowPreview(false);
    setEditing({
      id: '',
      name: '',
      category: chosenCat,
      roleEn: chosenCat === 'Founder & President' ? 'Founder & President' : '',
      roleHi: chosenCat === 'Founder & President' ? 'संस्थापक एवं अध्यक्ष' : '',
      advisoryDomain:
        chosenCat === 'Advisory Board' ? ADVISORY_EXPERTISE_CATEGORIES[0] : '',
      qualification: '',
      experience: '',
      expertise: '',
      responsibilitiesEn: '',
      responsibilitiesHi: '',
      founderMessageEn: '',
      founderMessageHi: '',
      assignedDistrict: chosenCat === 'District Coordinators' ? 'Bhilwara' : '',
      bioEn: '',
      bioHi: '',
      photoUrl: '',
      linkedinUrl: '',
      websiteUrl: '',
      publicationStatus: 'Draft',
      consentConfirmed: false,
      confirmedForPublic: false,
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing || !onUploadMedia) return;
    setUploadingPhoto(true);
    setFormError(null);
    try {
      const res = await onUploadMedia(file);
      setEditing({ ...editing, photoUrl: res.url });
    } catch (err: any) {
      setFormError(err?.message || 'Unable to upload photograph.');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadMedia) return;
    setUploadingSig(true);
    try {
      const res = await onUploadMedia(file);
      setMsgDraft((prev) => ({ ...prev, signatureImageUrl: res.url }));
    } finally {
      setUploadingSig(false);
      e.target.value = '';
    }
  };

  const saveMemberWithStatus = async (targetStatus: 'Draft' | 'Review' | 'Published') => {
    if (!editing?.name?.trim()) {
      setFormError('Full name is required before saving.');
      return;
    }
    if (!editing?.roleEn?.trim()) {
      setFormError('Designation / Role (English) is required before saving.');
      return;
    }
    if (targetStatus === 'Published' && !editing.consentConfirmed) {
      setFormError('Confirm formal publication consent before publishing to About Us.');
      return;
    }

    setFormError(null);
    setSaving(true);
    try {
      const id = editing.id && editing.id.trim() ? editing.id.trim() : `ldr-${Date.now()}`;
      const isPublished = targetStatus === 'Published';
      const record: LeadershipMemberSpec = {
        id,
        name: editing.name.trim(),
        category: editing.category || 'Office Bearers',
        advisoryDomain: (editing.advisoryDomain || '').trim() || undefined,
        roleEn: (editing.roleEn || '').trim(),
        roleHi: (editing.roleHi || editing.roleEn || '').trim(),
        qualification: (editing.qualification || '').trim() || undefined,
        experience: (editing.experience || '').trim() || undefined,
        expertise: (editing.expertise || '').trim() || undefined,
        responsibilitiesEn: (editing.responsibilitiesEn || '').trim() || undefined,
        responsibilitiesHi: (editing.responsibilitiesHi || '').trim() || undefined,
        founderMessageEn: (editing.founderMessageEn || '').trim() || undefined,
        founderMessageHi: (editing.founderMessageHi || '').trim() || undefined,
        assignedDistrict: (editing.assignedDistrict || '').trim() || undefined,
        bioEn: (editing.bioEn || '').trim(),
        bioHi: (editing.bioHi || editing.bioEn || '').trim(),
        photoUrl: (editing.photoUrl || '').trim(),
        linkedinUrl: (editing.linkedinUrl || '').trim() || undefined,
        websiteUrl: (editing.websiteUrl || '').trim() || undefined,
        publicationStatus: targetStatus,
        consentConfirmed: Boolean(editing.consentConfirmed),
        confirmedForPublic: isPublished,
      };
      const exists = roster.some((m) => m.id === id);
      const nextRoster = exists
        ? roster.map((m) => (m.id === id ? record : m))
        : [...roster, record];
      await onSaveRoster(nextRoster);

      // Sync Founder Message section automatically when saving Founder & President if requested
      if (
        record.category === 'Founder & President' &&
        syncFounderMsgOnSave &&
        onSaveFounderMessage &&
        (record.founderMessageEn || record.founderMessageHi)
      ) {
        await onSaveFounderMessage({
          messageEn: record.founderMessageEn || msgDraft.messageEn,
          messageHi: record.founderMessageHi || msgDraft.messageHi,
          attributionEn: `${record.name} – ${record.roleEn}`,
          attributionHi: `${record.name} – ${record.roleHi || record.roleEn}`,
        });
      }

      setEditing(null);
      setShowPreview(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFounderMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveFounderMessage) return;
    setSavingMsg(true);
    try {
      await onSaveFounderMessage(msgDraft);
    } finally {
      setSavingMsg(false);
    }
  };

  const togglePublic = async (member: LeadershipMemberSpec) => {
    const nextPublic = !member.confirmedForPublic;
    const next = roster.map((m) =>
      m.id === member.id
        ? {
            ...m,
            confirmedForPublic: nextPublic,
            publicationStatus: (nextPublic ? 'Published' : 'Draft') as
              | 'Draft'
              | 'Review'
              | 'Published',
            consentConfirmed: nextPublic ? true : m.consentConfirmed,
          }
        : m
    );
    await onSaveRoster(next);
  };

  const moveMember = async (id: string, dir: -1 | 1) => {
    const idx = roster.findIndex((m) => m.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= roster.length) return;
    const copy = [...roster];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    await onSaveRoster(copy);
  };

  const removeMember = async (id: string) => {
    await onSaveRoster(roster.filter((m) => m.id !== id));
  };

  const editingCat = editing?.category || 'Office Bearers';
  const isFounderCat = editingCat === 'Founder & President';
  const isAdvisoryCat = editingCat === 'Advisory Board';
  const isDistrictCoordCat = editingCat === 'District Coordinators';
  const isVolunteerExpertCat = editingCat === 'Volunteers / Experts';

  return (
    <div className="space-y-5">
      {/* Header & Sub-Module Switcher */}
      <div className="admin-card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Board, Team, Advisory &amp; Founder Message
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
            {roster.length} profiles ({roster.filter((m) => m.confirmedForPublic).length} published on About Us) · Updating a photo, bio, or Founder Message updates About Us automatically
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-1 rounded-xl bg-[#F0F4F1] border border-[#DCE5DE]">
            <button
              type="button"
              onClick={() => setSubView('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                subView === 'directory'
                  ? 'bg-white text-[#144527] shadow-xs'
                  : 'text-[#55685C] hover:text-[#142119]'
              }`}
            >
              Leadership Directory
            </button>
            <button
              type="button"
              onClick={() => setSubView('founder_message')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                subView === 'founder_message'
                  ? 'bg-white text-[#144527] shadow-xs'
                  : 'text-[#55685C] hover:text-[#142119]'
              }`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Founder Message Manager</span>
            </button>
          </div>

          {subView === 'directory' && (
            <button
              type="button"
              onClick={() => openNewMember()}
              className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          SUB-VIEW B: DEDICATED FOUNDER MESSAGE MANAGER
         ===================================================================== */}
      {subView === 'founder_message' && (
        <form
          onSubmit={handleSaveFounderMessage}
          className="admin-card p-6 space-y-5 text-xs admin-view-enter"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDF2EE] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#142119]">
                Founder Message Manager (Displayed on About Us)
              </h3>
              <p className="text-[11px] text-[#55685C] mt-0.5">
                Appears directly below the Founder &amp; President profile as a dedicated editorial message block.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 font-semibold text-[#144527] cursor-pointer">
              <input
                type="checkbox"
                checked={msgDraft.showOnAboutUs}
                onChange={(e) =>
                  setMsgDraft({ ...msgDraft, showOnAboutUs: e.target.checked })
                }
                className="rounded border-[#368737]"
              />
              <span>Show message on About Us</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Section Heading (English)</span>
              <input
                type="text"
                value={msgDraft.headingEn}
                onChange={(e) => setMsgDraft({ ...msgDraft, headingEn: e.target.value })}
                placeholder="A Message from Our Founder"
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Section Heading (Hindi)</span>
              <input
                type="text"
                value={msgDraft.headingHi}
                onChange={(e) => setMsgDraft({ ...msgDraft, headingHi: e.target.value })}
                placeholder="संस्थापक का संदेश"
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>

            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Message Text (English)</span>
              <textarea
                rows={5}
                value={msgDraft.messageEn}
                onChange={(e) => setMsgDraft({ ...msgDraft, messageEn: e.target.value })}
                placeholder="Enter the founder's approved message to visitors, supporters, farmers and partners..."
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 leading-relaxed"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Message Text (Hindi)</span>
              <textarea
                rows={5}
                value={msgDraft.messageHi}
                onChange={(e) => setMsgDraft({ ...msgDraft, messageHi: e.target.value })}
                placeholder="किसानों, समर्थकों और साझेदारों के लिए संस्थापक का संदेश..."
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 leading-relaxed"
              />
            </label>

            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Signature / Attribution (English)</span>
              <input
                type="text"
                value={msgDraft.attributionEn}
                onChange={(e) => setMsgDraft({ ...msgDraft, attributionEn: e.target.value })}
                placeholder="Raj Kumar Poonia – Founder & President"
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Signature / Attribution (Hindi)</span>
              <input
                type="text"
                value={msgDraft.attributionHi}
                onChange={(e) => setMsgDraft({ ...msgDraft, attributionHi: e.target.value })}
                placeholder="राज कुमार पूनिया – संस्थापक एवं अध्यक्ष"
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
          </div>

          {/* Optional Signature Image Upload */}
          <div className="rounded-2xl border border-[#E2EAE4] bg-[#F8FBF9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-[#142119]">Optional Signature Image</p>
              <p className="text-[11px] text-[#55685C]">
                Upload a clean PNG/JPG/WebP signature image (transparent background recommended).
              </p>
              {msgDraft.signatureImageUrl && (
                <div className="pt-2 flex items-center gap-3">
                  <img
                    src={msgDraft.signatureImageUrl}
                    alt="Founder signature preview"
                    className="h-12 max-w-[180px] object-contain bg-white border border-[#DCE5DE] rounded-lg px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => setMsgDraft({ ...msgDraft, signatureImageUrl: '' })}
                    className="text-[11px] font-semibold text-red-700 hover:underline cursor-pointer"
                  >
                    Remove signature
                  </button>
                </div>
              )}
            </div>
            <label className="admin-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold cursor-pointer self-start sm:self-auto whitespace-nowrap">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingSig ? 'Uploading...' : 'Upload Signature Image'}</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleSignatureUpload}
                className="hidden"
                disabled={uploadingSig || !onUploadMedia}
              />
            </label>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#EDF2EE]">
            <button
              type="submit"
              disabled={savingMsg}
              className="admin-btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingMsg ? 'Saving Message...' : 'Save Founder Message'}</span>
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          SUB-VIEW A: LEADERSHIP DIRECTORY & CONDITIONAL PROFILE EDITOR
         ===================================================================== */}
      {subView === 'directory' && (
        <>
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {BOARD_CATEGORIES.map((c) => {
              const active = activeCategory === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveCategory(c.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                    active ? 'admin-btn-primary' : 'admin-btn-secondary'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Conditional Add / Edit Member Profile Form */}
          {editing && (
            <div className="admin-card border-[#368737]/40 p-5 sm:p-6 space-y-5 text-xs admin-view-enter">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDF2EE] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#142119]">
                    {editing.id
                      ? `Edit Profile · ${editing.name}`
                      : `Add Profile (${editingCat})`}
                  </h3>
                  <p className="text-[11px] text-[#55685C] mt-0.5">
                    {isFounderCat
                      ? 'One combined profile for Founder & President — includes dedicated Founder Message field.'
                      : isAdvisoryCat
                      ? 'Select one of the 10 advisory expertise domains and attach verified qualifications & consent.'
                      : isDistrictCoordCat
                      ? 'Assign this coordinator to their Rajasthan / India focus district.'
                      : 'Complete separated biography, qualifications, responsibilities, and photo upload.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setShowPreview(false);
                  }}
                  aria-label="Close member form"
                  className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-800">
                  {formError}
                </div>
              )}

              {/* Core Identity + Photo Upload */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-4 rounded-2xl border border-[#E2EAE4] bg-[#F8FBF9] p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <span className="font-semibold text-[#142119] block">
                      Professional Photograph
                    </span>
                    <div className="flex items-center gap-3.5">
                      {editing.photoUrl ? (
                        <img
                          src={editing.photoUrl}
                          alt={editing.name || 'Profile preview'}
                          className="w-20 h-20 rounded-2xl object-cover border border-[#DCE5DE] bg-white shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-[#EBF5EC] text-[#144527] font-bold text-lg flex items-center justify-center border border-[#DCE5DE] shrink-0">
                          <ImageIcon className="w-6 h-6 text-[#5B7763]" />
                        </div>
                      )}
                      <div className="space-y-1.5 min-w-0">
                        <label className="admin-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={uploadingPhoto || !onUploadMedia}
                          />
                        </label>
                        <p className="text-[10.5px] text-[#55685C]">JPG, PNG or WebP</p>
                        {editing.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditing({ ...editing, photoUrl: '' })}
                            className="text-[10.5px] font-semibold text-red-700 hover:underline cursor-pointer block"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <label className="space-y-1 pt-2 border-t border-[#E6EEE8]">
                    <span className="text-[11px] font-semibold text-[#55685C]">
                      Or paste photo URL
                    </span>
                    <input
                      type="text"
                      placeholder="/uploads/... or /assets/..."
                      value={editing.photoUrl ?? ''}
                      onChange={(e) => setEditing({ ...editing, photoUrl: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-2.5 py-1.5 text-[11px]"
                    />
                  </label>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Member Category *</span>
                    <select
                      value={editingCat}
                      onChange={(e) => {
                        const nextCat = e.target.value;
                        setEditing({
                          ...editing,
                          category: nextCat,
                          advisoryDomain:
                            nextCat === 'Advisory Board'
                              ? editing.advisoryDomain || ADVISORY_EXPERTISE_CATEGORIES[0]
                              : editing.advisoryDomain,
                          assignedDistrict:
                            nextCat === 'District Coordinators'
                              ? editing.assignedDistrict || 'Bhilwara'
                              : editing.assignedDistrict,
                        });
                      }}
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                    >
                      {BOARD_CATEGORIES.filter((c) => c.key !== 'All').map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Full Name *</span>
                    <input
                      type="text"
                      required
                      placeholder={
                        isFounderCat ? 'Raj Kumar Poonia' : 'Enter full verified name'
                      }
                      value={editing.name ?? ''}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">
                      Designation / Role (English) *
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={
                        isFounderCat
                          ? 'Founder & President'
                          : editingCat === 'Office Bearers'
                          ? 'Vice President'
                          : 'Climate & Soil Advisor'
                      }
                      value={editing.roleEn ?? ''}
                      onChange={(e) => setEditing({ ...editing, roleEn: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="font-semibold text-[#142119]">Designation (Hindi)</span>
                    <input
                      type="text"
                      placeholder={
                        isFounderCat
                          ? 'संस्थापक एवं अध्यक्ष'
                          : editingCat === 'Office Bearers'
                          ? 'उपाध्यक्ष'
                          : 'उदा. जलवायु सलाहकार'
                      }
                      value={editing.roleHi ?? ''}
                      onChange={(e) => setEditing({ ...editing, roleHi: e.target.value })}
                      className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                    />
                  </label>

                  {/* Conditional Category-Specific Fields */}
                  {isAdvisoryCat && (
                    <label className="space-y-1 md:col-span-2">
                      <span className="font-semibold text-[#142119]">
                        Advisory Board Expertise Category (10 Domains) *
                      </span>
                      <select
                        value={editing.advisoryDomain || ADVISORY_EXPERTISE_CATEGORIES[0]}
                        onChange={(e) =>
                          setEditing({ ...editing, advisoryDomain: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                      >
                        {ADVISORY_EXPERTISE_CATEGORIES.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {isDistrictCoordCat && (
                    <label className="space-y-1 md:col-span-2">
                      <span className="font-semibold text-[#142119]">
                        Assigned District (Harit Rajasthan) *
                      </span>
                      <select
                        value={editing.assignedDistrict || 'Bhilwara'}
                        onChange={(e) =>
                          setEditing({ ...editing, assignedDistrict: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                      >
                        {RAJASTHAN_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {(isAdvisoryCat || isVolunteerExpertCat) && (
                    <label className="space-y-1 md:col-span-2">
                      <span className="font-semibold text-[#142119]">
                        Area of Expertise / Specialisation
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Agroforestry MRV, Soil Microbiology, Rural Governance..."
                        value={editing.expertise ?? ''}
                        onChange={(e) => setEditing({ ...editing, expertise: e.target.value })}
                        className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Split Fields: Qualifications, Experience, Biography, Responsibilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-[#EDF2EE]">
                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">Qualifications</span>
                  <input
                    type="text"
                    placeholder="Verified academic or professional qualifications"
                    value={editing.qualification ?? ''}
                    onChange={(e) =>
                      setEditing({ ...editing, qualification: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">Experience</span>
                  <input
                    type="text"
                    placeholder="Key institutional, field, or leadership experience"
                    value={editing.experience ?? ''}
                    onChange={(e) => setEditing({ ...editing, experience: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">Short Biography (English)</span>
                  <textarea
                    rows={3}
                    placeholder="Concise, verified background and introduction..."
                    value={editing.bioEn ?? ''}
                    onChange={(e) => setEditing({ ...editing, bioEn: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">Short Biography (Hindi)</span>
                  <textarea
                    rows={3}
                    placeholder="संक्षिप्त हिंदी परिचय..."
                    value={editing.bioHi ?? ''}
                    onChange={(e) => setEditing({ ...editing, bioHi: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">
                    Role &amp; Responsibilities in GOVEDA (English)
                  </span>
                  <textarea
                    rows={2}
                    placeholder="Primary responsibilities and governance scope..."
                    value={editing.responsibilitiesEn ?? ''}
                    onChange={(e) =>
                      setEditing({ ...editing, responsibilitiesEn: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">
                    Role &amp; Responsibilities (Hindi)
                  </span>
                  <textarea
                    rows={2}
                    placeholder="संस्था में प्रमुख दायित्व..."
                    value={editing.responsibilitiesHi ?? ''}
                    onChange={(e) =>
                      setEditing({ ...editing, responsibilitiesHi: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>

                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">LinkedIn Profile (Optional)</span>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={editing.linkedinUrl ?? ''}
                    onChange={(e) => setEditing({ ...editing, linkedinUrl: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-semibold text-[#142119]">
                    Professional Website (Optional)
                  </span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editing.websiteUrl ?? ''}
                    onChange={(e) => setEditing({ ...editing, websiteUrl: e.target.value })}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
                  />
                </label>
              </div>

              {/* Conditional Founder Message Field — ONLY for Founder & President */}
              {isFounderCat && (
                <div className="rounded-2xl border border-[#C6DEC9] bg-[#F4F9F5] p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[#144527] inline-flex items-center gap-1.5">
                      <MessageSquareQuote className="w-4 h-4" />
                      <span>Founder Message (Shown in Dedicated About Us Message Block)</span>
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#144527] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={syncFounderMsgOnSave}
                        onChange={(e) => setSyncFounderMsgOnSave(e.target.checked)}
                        className="rounded border-[#368737]"
                      />
                      <span>Sync to Founder Message Manager on save</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <textarea
                      rows={3}
                      placeholder="Founder's vision and message (English)..."
                      value={editing.founderMessageEn ?? ''}
                      onChange={(e) =>
                        setEditing({ ...editing, founderMessageEn: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                    />
                    <textarea
                      rows={3}
                      placeholder="संस्थापक का संदेश (हिंदी)..."
                      value={editing.founderMessageHi ?? ''}
                      onChange={(e) =>
                        setEditing({ ...editing, founderMessageHi: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* Live Inline Public Card Preview */}
              {showPreview && (
                <div className="rounded-2xl border border-[#DCE5DE] bg-[#FAF9F5] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F6D26]">
                      Live About Us Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPreview(false)}
                      className="text-[11px] font-semibold text-[#55685C] hover:underline cursor-pointer"
                    >
                      Hide Preview
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#E5E0D4] p-5 flex flex-col sm:flex-row items-start gap-5">
                    {editing.photoUrl ? (
                      <img
                        src={editing.photoUrl}
                        alt={editing.name || 'Preview'}
                        className="w-24 h-28 rounded-xl object-cover border border-[#E5E0D4] shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-28 rounded-xl bg-[#F0F4EF] border border-[#DCE5DE] flex items-center justify-center text-lg font-bold text-[#144527] shrink-0">
                        {(editing.name || 'G').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-1.5 min-w-0">
                      <p className="text-[11px] font-semibold text-[#2E7D32]">
                        {editingCat}
                        {isAdvisoryCat && editing.advisoryDomain
                          ? ` · ${editing.advisoryDomain}`
                          : ''}
                        {isDistrictCoordCat && editing.assignedDistrict
                          ? ` · ${editing.assignedDistrict}`
                          : ''}
                      </p>
                      <h4 className="text-base font-bold text-[#142119]">
                        {editing.name || 'Full Name'}
                      </h4>
                      <p className="text-xs font-semibold text-[#3C5044]">
                        {editing.roleEn || 'Designation'}
                      </p>
                      {editing.qualification && (
                        <p className="text-[11px] text-[#55685C]">
                          Qualifications: {editing.qualification}
                        </p>
                      )}
                      {editing.bioEn && (
                        <p className="text-xs text-[#2F4035] leading-relaxed pt-1">
                          {editing.bioEn}
                        </p>
                      )}
                      {editing.responsibilitiesEn && (
                        <p className="text-[11px] text-[#55685C]">
                          <strong>Responsibilities:</strong> {editing.responsibilitiesEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Consent + Draft / Review / Preview / Publish Workflow Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-[#EDF2EE]">
                <label className="inline-flex items-start gap-2 font-semibold text-[#144527] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.consentConfirmed)}
                    onChange={(e) =>
                      setEditing({ ...editing, consentConfirmed: e.target.checked })
                    }
                    className="rounded border-[#368737] mt-0.5"
                  />
                  <span>
                    Formal appointment &amp; public display consent confirmed (required before publishing)
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview((p) => !p)}
                    className="admin-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveMemberWithStatus('Draft')}
                    className="admin-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveMemberWithStatus('Review')}
                    className="admin-btn-soft inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Send to Review</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveMemberWithStatus('Published')}
                    className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Publish to About Us'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Member Cards Grid */}
          {filtered.length === 0 ? (
            <div className="admin-card p-10 text-center space-y-3">
              <Users className="w-8 h-8 text-[#7C8F82] mx-auto" />
              <p className="text-sm font-bold text-[#142119]">
                No profiles in &ldquo;{activeCategory}&rdquo; yet
              </p>
              <p className="text-xs text-[#55685C] max-w-md mx-auto">
                Add formally appointed leadership, office bearers, or advisory members. Only consented, published profiles appear on the About Us page.
              </p>
              <button
                type="button"
                onClick={() => openNewMember()}
                className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Profile</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((m) => {
                const initials = m.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase() || '')
                  .join('');
                const pubState =
                  m.publicationStatus || (m.confirmedForPublic ? 'Published' : 'Draft');
                return (
                  <div
                    key={m.id}
                    className="admin-card admin-card-interactive p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3.5">
                        {m.photoUrl ? (
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-[#DCE5DE] shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-[#EBF5EC] text-[#144527] font-bold text-sm flex items-center justify-center shrink-0">
                            {initials || 'G'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-[#368737]">
                            {m.category}
                            {m.advisoryDomain ? ` · ${m.advisoryDomain}` : ''}
                            {m.assignedDistrict ? ` · ${m.assignedDistrict}` : ''}
                          </p>
                          <h3 className="text-sm font-bold text-[#142119] truncate">{m.name}</h3>
                          <p className="text-xs text-[#55685C]">{m.roleEn}</p>
                        </div>
                      </div>

                      {m.bioEn && (
                        <p className="text-xs text-[#3C5044] leading-relaxed line-clamp-2">
                          {m.bioEn}
                        </p>
                      )}

                      {(m.qualification || m.linkedinUrl || m.websiteUrl) && (
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#55685C]">
                          {m.qualification && <span className="truncate">{m.qualification}</span>}
                          {m.linkedinUrl && (
                            <span className="inline-flex items-center gap-1 text-[#144527]">
                              <Linkedin className="w-3 h-3" /> LinkedIn
                            </span>
                          )}
                          {m.websiteUrl && (
                            <span className="inline-flex items-center gap-1 text-[#144527]">
                              <Globe className="w-3 h-3" /> Website
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#EFF4F0]">
                      <button
                        type="button"
                        onClick={() => togglePublic(m)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                          m.confirmedForPublic ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {m.confirmedForPublic ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{pubState === 'Review' ? 'Under Review' : 'Draft'}</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveMember(m.id, -1)}
                          aria-label={`Move ${m.name} earlier`}
                          className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMember(m.id, 1)}
                          aria-label={`Move ${m.name} later`}
                          className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormError(null);
                            setShowPreview(false);
                            setEditing({
                              ...m,
                              consentConfirmed:
                                m.consentConfirmed ?? Boolean(m.confirmedForPublic),
                            });
                          }}
                          aria-label={`Edit ${m.name}`}
                          className="admin-btn-soft p-1.5 rounded-lg cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMember(m.id)}
                          aria-label={`Remove ${m.name}`}
                          className="admin-btn-secondary p-1.5 rounded-lg text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================================
   2. WASTE MANAGEMENT ADMINISTRATION MODULE (Blueprint §10)
   ============================================================================ */

interface WasteManagementProps {
  records: WasteActivityRecord[];
  partners: WastePartnerRecord[];
  onSaveRecord: (rec: Partial<WasteActivityRecord>) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
  onSavePartner: (partner: Partial<WastePartnerRecord>) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
}

const WASTE_CATEGORIES: WasteActivityRecord['category'][] = [
  'Dry Plastic',
  'Wet Waste',
  'Temple Organic Waste',
  'Sanitary Waste',
  'Special-Care Waste',
];

export function AdminWasteManagementView({
  records,
  partners,
  onSaveRecord,
  onDeleteRecord,
  onSavePartner,
  onDeletePartner,
}: WasteManagementProps) {
  const [subTab, setSubTab] = useState<'records' | 'partners' | 'impact'>('records');
  const [editingRec, setEditingRec] = useState<Partial<WasteActivityRecord> | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<WastePartnerRecord> | null>(null);
  const [saving, setSaving] = useState(false);

  const summary = useMemo(() => summarizeWasteRecords(records), [records]);

  const selectedState = findStateByNameOrSlug(editingRec?.stateName || 'Rajasthan');
  const districtOptions = selectedState?.districts ?? ['Bhilwara', 'Churu', 'Bikaner', 'Phalodi', 'Jodhpur'];

  const handleSaveRec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRec?.title?.trim()) return;
    setSaving(true);
    try {
      await onSaveRecord(editingRec);
      setEditingRec(null);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner?.name?.trim()) return;
    setSaving(true);
    try {
      await onSavePartner(editingPartner);
      setEditingPartner(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & KPI Strip */}
      <div className="admin-card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Waste Management — Clean India &amp; Plastic-Free Operations
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5 tabular-nums">
            Track wet, dry plastic, temple organic, sanitary &amp; special-care drives · Only verified weighments count in public totals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSubTab('partners');
              setEditingPartner({
                id: '',
                name: '',
                partnerType: 'Authorised Recycler',
                district: 'Bhilwara',
                contactPerson: '',
                status: 'Active',
                notes: '',
              });
            }}
            className="admin-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Recycler Partner</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubTab('records');
              setEditingRec({
                id: '',
                title: '',
                campaignOrProject: 'Plastic-Free Market Campaign',
                stateName: 'Rajasthan',
                district: 'Bhilwara',
                locationName: '',
                activityDate: new Date().toISOString().slice(0, 10),
                category: 'Dry Plastic',
                quantity: 0,
                unit: 'kg',
                householdsCount: 0,
                participantsCount: 0,
                collectionPartner: partners[0]?.name || '',
                recyclingDestination: '',
                evidenceNote: '',
                verificationStatus: 'Submitted',
                isPublic: false,
              });
            }}
            className="admin-btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <Recycle className="w-3.5 h-3.5" />
            <span>Log Waste Activity</span>
          </button>
        </div>
      </div>

      {/* Verified KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="admin-card p-5">
          <p className="text-xs font-medium text-[#55685C]">Verified Waste Handled</p>
          <p className="text-2xl font-bold text-[#142119] mt-2 tabular-nums">
            {summary.verifiedTotalKg.toLocaleString('en-IN')} kg
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 tabular-nums">
            {summary.verifiedRecordsCount} verified drives
          </p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-medium text-[#55685C]">Pending Weighment Sign-Off</p>
          <p className="text-2xl font-bold text-[#142119] mt-2 tabular-nums">
            {summary.pendingRecordsCount}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            Excluded from public totals until verified
          </p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-medium text-[#55685C]">Verified Households &amp; Shops</p>
          <p className="text-2xl font-bold text-[#142119] mt-2 tabular-nums">
            {summary.verifiedHouseholds.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#55685C] mt-1 tabular-nums">
            {summary.verifiedParticipants} participants logged
          </p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-medium text-[#55685C]">Authorised Partners</p>
          <p className="text-2xl font-bold text-[#142119] mt-2 tabular-nums">
            {partners.length}
          </p>
          <p className="text-[11px] text-[#368737] font-semibold mt-1">
            Recyclers, SHG units &amp; composters
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E2EAE4] shadow-2xs">
        {(
          [
            ['records', `Waste Activity Records (${records.length})`],
            ['partners', `Recycling & SHG Partners (${partners.length})`],
            ['impact', 'Verified Waste Breakdown'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSubTab(key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
              subTab === key
                ? 'admin-btn-primary'
                : 'text-[#55685C] hover:text-[#142119]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Log Waste Activity Editor */}
      {editingRec && (
        <form
          onSubmit={handleSaveRec}
          className="admin-card border-[#368737]/40 p-5 sm:p-6 space-y-4 text-xs admin-view-enter"
        >
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3">
            <h3 className="text-sm font-bold text-[#142119]">
              {editingRec.id ? `Edit Waste Record · ${editingRec.title}` : 'Log Verified Waste Management Activity'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingRec(null)}
              aria-label="Close waste activity form"
              className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <label className="space-y-1 md:col-span-2">
              <span className="font-semibold text-[#142119]">Activity Title *</span>
              <input
                type="text"
                required
                placeholder="e.g. Bhilwara Main Market Dry Plastic Collection Drive"
                value={editingRec.title ?? ''}
                onChange={(e) => setEditingRec({ ...editingRec, title: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Activity Date</span>
              <input
                type="date"
                value={editingRec.activityDate ?? ''}
                onChange={(e) => setEditingRec({ ...editingRec, activityDate: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">State</span>
              <select
                value={editingRec.stateName ?? 'Rajasthan'}
                onChange={(e) => {
                  const st = findStateByNameOrSlug(e.target.value);
                  setEditingRec({
                    ...editingRec,
                    stateName: st?.nameEn || e.target.value,
                    district: st?.districts[0] || '',
                  });
                }}
                className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
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
                value={editingRec.district ?? 'Bhilwara'}
                onChange={(e) => setEditingRec({ ...editingRec, district: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
              >
                {districtOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Market / Village / Campus</span>
              <input
                type="text"
                placeholder="e.g. Azad Chowk Market"
                value={editingRec.locationName ?? ''}
                onChange={(e) => setEditingRec({ ...editingRec, locationName: e.target.value })}
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Waste Category</span>
              <select
                value={editingRec.category ?? 'Dry Plastic'}
                onChange={(e) =>
                  setEditingRec({
                    ...editingRec,
                    category: e.target.value as WasteActivityRecord['category'],
                  })
                }
                className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
              >
                {WASTE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">Quantity *</span>
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  required
                  value={editingRec.quantity ?? 0}
                  onChange={(e) =>
                    setEditingRec({ ...editingRec, quantity: Number(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono tabular-nums"
                />
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-[#142119]">Unit</span>
                <select
                  value={editingRec.unit ?? 'kg'}
                  onChange={(e) =>
                    setEditingRec({
                      ...editingRec,
                      unit: e.target.value as 'kg' | 'tonnes',
                    })
                  }
                  className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="kg">kg</option>
                  <option value="tonnes">tonnes</option>
                </select>
              </label>
            </div>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Verification Status</span>
              <select
                value={editingRec.verificationStatus ?? 'Submitted'}
                onChange={(e) =>
                  setEditingRec({
                    ...editingRec,
                    verificationStatus: e.target.value as WasteActivityRecord['verificationStatus'],
                  })
                }
                className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
              >
                <option value="Submitted">Submitted for Verification</option>
                <option value="Verified">Verified (Weighment Checked)</option>
                <option value="Published">Published Live</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-[#142119]">Authorised Collection / Recycling Partner</span>
              <input
                type="text"
                value={editingRec.collectionPartner ?? ''}
                onChange={(e) =>
                  setEditingRec({ ...editingRec, collectionPartner: e.target.value })
                }
                placeholder="e.g. Mewar Authorised Plastic Recyclers"
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="font-semibold text-[#142119]">Weighment / Handover Evidence Note</span>
              <input
                type="text"
                value={editingRec.evidenceNote ?? ''}
                onChange={(e) => setEditingRec({ ...editingRec, evidenceNote: e.target.value })}
                placeholder="Receipt #, weighment slip or photo documentation reference..."
                className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDF2EE]">
            <button
              type="button"
              onClick={() => setEditingRec(null)}
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
              <span>{saving ? 'Saving...' : 'Save Waste Activity'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Records Table */}
      {subTab === 'records' && (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDF2EE] bg-[#FAFBF9] text-[11px] font-semibold text-[#55685C]">
                  <th className="py-3 px-5">Activity &amp; Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Partner</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1]">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F8FBF9] transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-[#142119]">{rec.title}</p>
                      <p className="text-[11px] text-[#6B7E71]">
                        {rec.locationName ? `${rec.locationName} · ` : ''}
                        {rec.district}, {rec.stateName} · {rec.activityDate}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#144527] whitespace-nowrap">
                      {rec.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#142119] tabular-nums whitespace-nowrap">
                      {rec.quantity} {rec.unit}
                    </td>
                    <td className="py-3.5 px-4 text-[#3C5044]">
                      {rec.collectionPartner || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`font-semibold ${
                          rec.verificationStatus === 'Published' ||
                          rec.verificationStatus === 'Verified'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {rec.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap space-x-1.5">
                      {rec.verificationStatus === 'Submitted' && (
                        <button
                          type="button"
                          onClick={() =>
                            onSaveRecord({ ...rec, verificationStatus: 'Verified', isPublic: true })
                          }
                          className="admin-btn-primary inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verify</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEditingRec({ ...rec })}
                        className="admin-btn-soft inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id)}
                        aria-label={`Delete ${rec.title}`}
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
      )}

      {/* Partners Tab */}
      {subTab === 'partners' && (
        <div className="space-y-4">
          {editingPartner && (
            <form
              onSubmit={handleSavePartnerSubmit}
              className="admin-card border-[#368737]/40 p-5 space-y-3.5 text-xs admin-view-enter"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#142119]">
                  Add / Edit Authorised Waste Partner
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="admin-btn-secondary p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Partner Name *"
                  value={editingPartner.name ?? ''}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <select
                  value={editingPartner.partnerType ?? 'Authorised Recycler'}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      partnerType: e.target.value as WastePartnerRecord['partnerType'],
                    })
                  }
                  className="rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                >
                  <option value="Authorised Recycler">Authorised Recycler</option>
                  <option value="Collection Agency">Collection Agency</option>
                  <option value="SHG Cloth Bag Unit">SHG Cloth Bag Unit</option>
                  <option value="Compost & Biogas Unit">Compost &amp; Biogas Unit</option>
                </select>
                <input
                  type="text"
                  placeholder="District"
                  value={editingPartner.district ?? ''}
                  onChange={(e) =>
                    setEditingPartner({ ...editingPartner, district: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="admin-btn-secondary px-3.5 py-2 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary px-4 py-2 rounded-xl font-semibold cursor-pointer"
                >
                  Save Partner
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map((p) => (
              <div key={p.id} className="admin-card p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#368737]">{p.partnerType}</span>
                  <span className="text-emerald-700 font-semibold">{p.status}</span>
                </div>
                <h3 className="text-sm font-bold text-[#142119]">{p.name}</h3>
                <p className="text-xs text-[#55685C]">
                  {p.district} {p.contactPerson ? `· ${p.contactPerson}` : ''}
                </p>
                {p.notes && <p className="text-xs text-[#3C5044]">{p.notes}</p>}
                <div className="flex justify-end pt-2 border-t border-[#EFF4F0]">
                  <button
                    type="button"
                    onClick={() => onDeletePartner(p.id)}
                    className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Breakdown Tab */}
      {subTab === 'impact' && (
        <div className="admin-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#142119]">
            Verified Quantity by Waste Stream
          </h3>
          {summary.byCategoryKg.length === 0 ? (
            <p className="text-xs text-[#55685C]">
              No verified weighment records yet. Verify a waste activity record to display stream totals.
            </p>
          ) : (
            <div className="space-y-3">
              {summary.byCategoryKg.map((row) => {
                const pct =
                  summary.verifiedTotalKg > 0
                    ? Math.round((row.kg / summary.verifiedTotalKg) * 100)
                    : 0;
                return (
                  <div key={row.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#142119]">{row.category}</span>
                      <span className="font-mono font-bold text-[#144527] tabular-nums">
                        {row.kg.toLocaleString('en-IN')} kg ({pct}% · {row.count} drives)
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#EDF3EE] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#144527] to-[#368737] transition-all duration-500"
                        style={{ width: `${Math.max(6, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   3. SETTINGS, BACKUP & SECURITY MODULE (Blueprint System Settings)
   ============================================================================ */

interface SettingsBackupProps {
  onExportSubmissionsCsv: () => Promise<void>;
  onExportSubmissionsJson: () => Promise<void>;
  onExportPaymentsCsv: () => Promise<void>;
  onExportBlueprintJson: () => void;
  onGoToGovernance: () => void;
  onGoToAudit: () => void;
}

export function AdminSettingsBackupView({
  onExportSubmissionsCsv,
  onExportSubmissionsJson,
  onExportPaymentsCsv,
  onExportBlueprintJson,
  onGoToGovernance,
  onGoToAudit,
}: SettingsBackupProps) {
  return (
    <div className="space-y-5">
      <div className="admin-card p-5">
        <h2 className="text-base font-bold text-[#142119]">
          Settings, Data Backups &amp; Security Controls
        </h2>
        <p className="text-xs text-[#55685C] mt-0.5">
          Download sanitized CSV/JSON backups at any time and audit public visibility &amp; PII protection safeguards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="admin-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#EDF6EE] text-[#144527] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#142119]">One-Click Data Backups</h3>
              <p className="text-xs text-[#55685C]">
                Formula-injection-sanitized spreadsheets and structured JSON archives
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onExportSubmissionsCsv}
              className="admin-btn-secondary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#144527]" />
              <span>Export All Submissions CSV</span>
            </button>
            <button
              type="button"
              onClick={onExportSubmissionsJson}
              className="admin-btn-secondary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <FileJson className="w-4 h-4 text-[#144527]" />
              <span>Backup Submissions JSON</span>
            </button>
            <button
              type="button"
              onClick={onExportPaymentsCsv}
              className="admin-btn-secondary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#144527]" />
              <span>Payments Ledger CSV</span>
            </button>
            <button
              type="button"
              onClick={onExportBlueprintJson}
              className="admin-btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Full CMS Blueprint JSON</span>
            </button>
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#142119]">Governance &amp; Security Posture</h3>
              <p className="text-xs text-[#55685C]">
                Active safeguards across public endpoints and admin actions
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#2E4236]">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Public status lookup automatically masks applicant phone numbers &amp; strips admin notes.</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Unconfirmed officials, partners, bank details &amp; unverified waste entries stay hidden publicly.</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Every campaign, form, page, mission &amp; review update writes an immutable audit log entry.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EDF2EE]">
            <button
              type="button"
              onClick={onGoToGovernance}
              className="admin-btn-soft px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Open Language, SEO &amp; Legal Controls
            </button>
            <button
              type="button"
              onClick={onGoToAudit}
              className="admin-btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Inspect Activity Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
