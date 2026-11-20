import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Trophy,
  Upload,
  X,
} from 'lucide-react';
import type {
  AdminDistrictRecord,
  AdminImpactMetric,
  AdminMarathonEvent,
  AdminProjectRecord,
  AdminSubmissionRecord,
  UnifiedProgrammeRecord,
} from './types';
import type {
  DistrictOutreachItemSpec,
  EventGuestSponsorSpec,
  MarathonScheduleSpec,
  RaceCategorySpec,
} from '../db/schema';
import type { AdminRole } from '../utils/adminLogic';
import { filterUnifiedProgrammes, formatBilingualIsoDate } from '../utils/adminLogic';
import { INDIA_STATES_DIRECTORY, findStateByNameOrSlug } from '../data/indiaLocations';

type UploadMediaFn = (file: File) => Promise<{
  url: string;
  mediaType: 'image' | 'video' | 'pdf';
}>;

interface AdminEventsViewProps {
  events: AdminMarathonEvent[];
  onSaveEvent: (event: Partial<AdminMarathonEvent>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onUploadMedia: UploadMediaFn;
}

export function AdminEventsView({
  events,
  onSaveEvent,
  onDeleteEvent,
  onUploadMedia,
}: AdminEventsViewProps) {
  const [editing, setEditing] = useState<Partial<AdminMarathonEvent> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const openNew = () =>
    setEditing({
      id: '',
      titleEn: '',
      titleHi: '',
      themeEn: '',
      themeHi: '',
      scope: 'District',
      stateName: 'Rajasthan',
      district: 'Bhilwara',
      subDistrict: '',
      villageOrTown: '',
      eventDate: '2026-12-20',
      dateDisplayEn: '20 December 2026',
      dateDisplayHi: '20 दिसंबर 2026',
      venueEn: '',
      venueHi: '',
      bannerUrl: '',
      routeNotesEn: '',
      routeNotesHi: '',
      rulesEn: '',
      rulesHi: '',
      safetyInfoEn: '',
      safetyInfoHi: '',
      postEventReportUrl: '',
      countdownEnabled: true,
      status: 'Proposed',
      registrationOpen: true,
      raceCategories: [
        { name: '10 KM Green Run', age: '18+ Years', fee: '₹499 Registration', feeInr: 499 },
        { name: '5 KM Eco Run', age: '14+ Years', fee: '₹299 Registration', feeInr: 299 },
        { name: '3 KM Community Walk', age: 'All Ages', fee: 'Free Community Walk', feeInr: 0 },
      ],
      schedule: [],
      guests: [],
      sponsors: [],
    });

  const handleFileUpload = async (
    field: 'bannerUrl' | 'postEventReportUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingField(field);
    try {
      const res = await onUploadMedia(file);
      setEditing({ ...editing, [field]: res.url });
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.titleEn?.trim()) return;
    setSaving(true);
    try {
      await onSaveEvent(editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const raceCategories = editing?.raceCategories ?? [];
  const schedule = editing?.schedule ?? [];
  const guests = editing?.guests ?? [];
  const sponsors = editing?.sponsors ?? [];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Harit Marathon &amp; District Events
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Control dates, routes, race categories, schedules, rules, safety info, and strictly confirmed guests/sponsors
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Event / Marathon</span>
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#368737]/40 p-5 sm:p-6 space-y-5 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3">
            <h3 className="text-sm font-bold text-[#142119]">
              {editing.id ? `Edit Event: ${editing.titleEn}` : 'Create New Event / Marathon'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-[#55685C] hover:text-[#142119] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Event Title (English) *"
              value={editing.titleEn ?? ''}
              onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Event Title (Hindi)"
              value={editing.titleHi ?? ''}
              onChange={(e) => setEditing({ ...editing, titleHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Theme / Tagline (English)"
              value={editing.themeEn ?? ''}
              onChange={(e) => setEditing({ ...editing, themeEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Theme / Tagline (Hindi)"
              value={editing.themeHi ?? ''}
              onChange={(e) => setEditing({ ...editing, themeHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={editing.scope ?? 'District'}
                onChange={(e) => setEditing({ ...editing, scope: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
              >
                <option value="National">Scope: National</option>
                <option value="Statewide">Scope: Statewide</option>
                <option value="District">Scope: District</option>
                <option value="Local">Scope: Local / Town</option>
              </select>
              <select
                value={editing.stateName ?? 'Rajasthan'}
                onChange={(e) => {
                  const st = findStateByNameOrSlug(e.target.value);
                  setEditing({
                    ...editing,
                    stateName: e.target.value,
                    district: st?.districts[0] || '',
                    subDistrict: '',
                  });
                }}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
              >
                <option value="All India">All India</option>
                {INDIA_STATES_DIRECTORY.map((st) => (
                  <option key={st.slug} value={st.nameEn}>
                    {st.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(() => {
                const stObj = findStateByNameOrSlug(editing.stateName || 'Rajasthan');
                const distOptions = Array.from(
                  new Set([
                    ...(stObj?.districts ?? []),
                    ...(editing.district ? [editing.district] : []),
                  ])
                ).sort((a, b) => a.localeCompare(b));
                return (
                  <select
                    aria-label="Event district"
                    value={editing.district ?? ''}
                    onChange={(e) => setEditing({ ...editing, district: e.target.value })}
                    className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                  >
                    <option value="">All Districts</option>
                    {distOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                );
              })()}
              <input
                type="text"
                placeholder="Tehsil / City"
                value={editing.subDistrict ?? ''}
                onChange={(e) => setEditing({ ...editing, subDistrict: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Kasba / Village"
                value={editing.villageOrTown ?? ''}
                onChange={(e) => setEditing({ ...editing, villageOrTown: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={editing.eventDate ?? ''}
                onChange={(e) => {
                  const formatted = formatBilingualIsoDate(e.target.value);
                  setEditing({
                    ...editing,
                    eventDate: e.target.value,
                    dateDisplayEn: formatted.en || editing.dateDisplayEn,
                    dateDisplayHi: formatted.hi || editing.dateDisplayHi,
                  });
                }}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
              />
              <select
                value={editing.status ?? 'Proposed'}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value as 'Proposed' | 'Confirmed' | 'Completed',
                  })
                }
                className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
              >
                <option value="Proposed">Proposed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Date Display (English e.g. 20 December 2026)"
              value={editing.dateDisplayEn ?? ''}
              onChange={(e) => setEditing({ ...editing, dateDisplayEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Date Display (Hindi e.g. 20 दिसंबर 2026)"
              value={editing.dateDisplayHi ?? ''}
              onChange={(e) => setEditing({ ...editing, dateDisplayHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Venue / Start Location (English)"
              value={editing.venueEn ?? ''}
              onChange={(e) => setEditing({ ...editing, venueEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Venue / Start Location (Hindi)"
              value={editing.venueHi ?? ''}
              onChange={(e) => setEditing({ ...editing, venueHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
          </div>

          {/* Media Uploads (Banner + Post Event PDF Report) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E2EAE4]">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#142119] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#368737]" />
                Event Banner / Route Map Image
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/uploads/... or URL"
                  value={editing.bannerUrl ?? ''}
                  onChange={(e) => setEditing({ ...editing, bannerUrl: e.target.value })}
                  className="flex-1 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white font-mono"
                />
                <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#144527]/30 bg-white text-[#144527] font-semibold cursor-pointer hover:bg-[#EDF5EE]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'bannerUrl' ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('bannerUrl', e)}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#142119] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#368737]" />
                Post-Event Summary Report (PDF)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/uploads/... or PDF URL"
                  value={editing.postEventReportUrl ?? ''}
                  onChange={(e) =>
                    setEditing({ ...editing, postEventReportUrl: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white font-mono"
                />
                <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#144527]/30 bg-white text-[#144527] font-semibold cursor-pointer hover:bg-[#EDF5EE]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'postEventReportUrl' ? '...' : 'PDF'}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload('postEventReportUrl', e)}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Route, Rules & Safety Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea
              rows={2}
              placeholder="Route Notes (English)"
              value={editing.routeNotesEn ?? ''}
              onChange={(e) => setEditing({ ...editing, routeNotesEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Route Notes (Hindi)"
              value={editing.routeNotesHi ?? ''}
              onChange={(e) => setEditing({ ...editing, routeNotesHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Participant Rules (English)"
              value={editing.rulesEn ?? ''}
              onChange={(e) => setEditing({ ...editing, rulesEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Participant Rules (Hindi)"
              value={editing.rulesHi ?? ''}
              onChange={(e) => setEditing({ ...editing, rulesHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Safety, Hydration & Medical Support Info (English)"
              value={editing.safetyInfoEn ?? ''}
              onChange={(e) => setEditing({ ...editing, safetyInfoEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Safety, Hydration & Medical Support Info (Hindi)"
              value={editing.safetyInfoHi ?? ''}
              onChange={(e) => setEditing({ ...editing, safetyInfoHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
          </div>

          {/* Race Categories Builder (with Server-Authoritative Razorpay Fee INR) */}
          <div className="p-4 rounded-xl border border-[#E2EAE4] bg-[#FAFBF8] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#142119] block">Race Categories &amp; Registration Fees (₹)</span>
                <span className="text-[10px] text-[#6B7E71]">
                  Set Fee INR = 0 for free community tracks, or a positive integer (e.g. 499) for Razorpay checkout
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    ...editing,
                    raceCategories: [
                      ...raceCategories,
                      { name: '', age: 'All Ages', fee: 'Free Community Run', feeInr: 0 },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DCE5DE] text-[#144527] font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Category
              </button>
            </div>
            {raceCategories.map((rc, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Race Name (e.g. 10 KM Green Run)"
                  value={rc.name}
                  onChange={(e) => {
                    const next: RaceCategorySpec[] = [...raceCategories];
                    next[idx] = { ...rc, name: e.target.value };
                    setEditing({ ...editing, raceCategories: next });
                  }}
                  className="sm:col-span-4 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
                />
                <input
                  type="text"
                  placeholder="Age Group"
                  value={rc.age}
                  onChange={(e) => {
                    const next: RaceCategorySpec[] = [...raceCategories];
                    next[idx] = { ...rc, age: e.target.value };
                    setEditing({ ...editing, raceCategories: next });
                  }}
                  className="sm:col-span-2 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
                />
                <input
                  type="text"
                  placeholder="Fee Label (e.g. ₹499 + T-Shirt)"
                  value={rc.fee}
                  onChange={(e) => {
                    const next: RaceCategorySpec[] = [...raceCategories];
                    next[idx] = { ...rc, fee: e.target.value };
                    setEditing({ ...editing, raceCategories: next });
                  }}
                  className="sm:col-span-3 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
                />
                <input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="₹ INR"
                  title="Numeric Razorpay checkout fee in INR (0 = Free)"
                  value={rc.feeInr ?? 0}
                  onChange={(e) => {
                    const val = Math.max(0, Math.round(Number(e.target.value) || 0));
                    const next: RaceCategorySpec[] = [...raceCategories];
                    next[idx] = { ...rc, feeInr: val };
                    setEditing({ ...editing, raceCategories: next });
                  }}
                  className="sm:col-span-2 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white font-mono tabular-nums"
                />
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      raceCategories: raceCategories.filter((_, i) => i !== idx),
                    })
                  }
                  className="sm:col-span-1 text-red-700 hover:bg-red-50 p-1.5 rounded-lg justify-self-end cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Schedule Builder */}
          <div className="p-4 rounded-xl border border-[#E2EAE4] bg-[#FAFBF8] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#142119]">Event Day Schedule</span>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    ...editing,
                    schedule: [
                      ...schedule,
                      { time: '06:00 AM', activityEn: '', activityHi: '' },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DCE5DE] text-[#144527] font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Slot
              </button>
            </div>
            {schedule.map((slot, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="06:00 AM"
                  value={slot.time}
                  onChange={(e) => {
                    const next: MarathonScheduleSpec[] = [...schedule];
                    next[idx] = { ...slot, time: e.target.value };
                    setEditing({ ...editing, schedule: next });
                  }}
                  className="sm:col-span-3 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Activity (English)"
                  value={slot.activityEn}
                  onChange={(e) => {
                    const next: MarathonScheduleSpec[] = [...schedule];
                    next[idx] = { ...slot, activityEn: e.target.value };
                    setEditing({ ...editing, schedule: next });
                  }}
                  className="sm:col-span-4 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
                />
                <input
                  type="text"
                  placeholder="Activity (Hindi)"
                  value={slot.activityHi}
                  onChange={(e) => {
                    const next: MarathonScheduleSpec[] = [...schedule];
                    next[idx] = { ...slot, activityHi: e.target.value };
                    setEditing({ ...editing, schedule: next });
                  }}
                  className="sm:col-span-4 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      schedule: schedule.filter((_, i) => i !== idx),
                    })
                  }
                  className="sm:col-span-1 text-red-700 hover:bg-red-50 p-1.5 rounded-lg justify-self-end cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Confirmed Guests & Sponsors (Honesty Guard Enforced) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#E2EAE4] bg-[#FAFBF8] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#142119] block">Special Guests / Dignitaries</span>
                  <span className="text-[10px] text-[#6B7E71]">
                    Only items marked &quot;Confirmed for Public&quot; display on public site
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      guests: [
                        ...guests,
                        { id: `g-${Date.now()}`, name: '', designationOrTier: '', confirmedForPublic: false },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DCE5DE] text-[#144527] font-semibold cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Guest
                </button>
              </div>
              {guests.map((g, idx) => (
                <div key={g.id || idx} className="space-y-1.5 p-2.5 rounded-lg bg-white border border-[#E2EAE4]">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Guest Name"
                      value={g.name}
                      onChange={(e) => {
                        const next: EventGuestSponsorSpec[] = [...guests];
                        next[idx] = { ...g, name: e.target.value };
                        setEditing({ ...editing, guests: next });
                      }}
                      className="rounded-lg border border-[#DCE5DE] px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Designation / Role"
                      value={g.designationOrTier}
                      onChange={(e) => {
                        const next: EventGuestSponsorSpec[] = [...guests];
                        next[idx] = { ...g, designationOrTier: e.target.value };
                        setEditing({ ...editing, guests: next });
                      }}
                      className="rounded-lg border border-[#DCE5DE] px-2 py-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#144527]">
                      <input
                        type="checkbox"
                        checked={g.confirmedForPublic}
                        onChange={(e) => {
                          const next: EventGuestSponsorSpec[] = [...guests];
                          next[idx] = { ...g, confirmedForPublic: e.target.checked };
                          setEditing({ ...editing, guests: next });
                        }}
                      />
                      Confirmed for Public
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          guests: guests.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-red-700 text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-[#E2EAE4] bg-[#FAFBF8] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#142119] block">Event Sponsors / Partners</span>
                  <span className="text-[10px] text-[#6B7E71]">
                    Unconfirmed sponsors remain internal until checked
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      sponsors: [
                        ...sponsors,
                        { id: `s-${Date.now()}`, name: '', designationOrTier: '', confirmedForPublic: false },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DCE5DE] text-[#144527] font-semibold cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Sponsor
                </button>
              </div>
              {sponsors.map((s, idx) => (
                <div key={s.id || idx} className="space-y-1.5 p-2.5 rounded-lg bg-white border border-[#E2EAE4]">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Sponsor Organisation"
                      value={s.name}
                      onChange={(e) => {
                        const next: EventGuestSponsorSpec[] = [...sponsors];
                        next[idx] = { ...s, name: e.target.value };
                        setEditing({ ...editing, sponsors: next });
                      }}
                      className="rounded-lg border border-[#DCE5DE] px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Sponsorship Tier / Support"
                      value={s.designationOrTier}
                      onChange={(e) => {
                        const next: EventGuestSponsorSpec[] = [...sponsors];
                        next[idx] = { ...s, designationOrTier: e.target.value };
                        setEditing({ ...editing, sponsors: next });
                      }}
                      className="rounded-lg border border-[#DCE5DE] px-2 py-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#144527]">
                      <input
                        type="checkbox"
                        checked={s.confirmedForPublic}
                        onChange={(e) => {
                          const next: EventGuestSponsorSpec[] = [...sponsors];
                          next[idx] = { ...s, confirmedForPublic: e.target.checked };
                          setEditing({ ...editing, sponsors: next });
                        }}
                      />
                      Confirmed for Public
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          sponsors: sponsors.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-red-700 text-[11px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EDF2EE]">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
                <input
                  type="checkbox"
                  checked={Boolean(editing.registrationOpen)}
                  onChange={(e) =>
                    setEditing({ ...editing, registrationOpen: e.target.checked })
                  }
                  className="rounded text-[#144527]"
                />
                <span>Runner Registration Open</span>
              </label>
              <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
                <input
                  type="checkbox"
                  checked={editing.countdownEnabled !== false}
                  onChange={(e) =>
                    setEditing({ ...editing, countdownEnabled: e.target.checked })
                  }
                  className="rounded text-[#144527]"
                />
                <span>Show Live Countdown</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Event'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#368737] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> {ev.district}
                </span>
                <span className="font-mono text-[#55685C] tabular-nums">
                  {ev.status} · {ev.eventDate}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#142119]">{ev.titleEn}</h3>
              {ev.themeEn && <p className="text-xs text-[#368737] font-medium">{ev.themeEn}</p>}
              <p className="text-xs text-[#55685C]">{ev.venueEn || ev.venueHi}</p>
              <p className="text-[11px] text-[#6B7E71] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Registration: {ev.registrationOpen ? 'Open' : 'Paused'} ·{' '}
                  {ev.raceCategories?.length ?? 0} categories ·{' '}
                  {(ev.guests ?? []).filter((g) => g.confirmedForPublic).length} public guests
                </span>
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
              <button
                type="button"
                onClick={() => setEditing(ev)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE5DE] text-xs font-semibold text-[#144527] hover:bg-[#EDF5EE] cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteEvent(ev.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
                aria-label={`Delete ${ev.titleEn}`}
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

interface AdminDistrictsViewProps {
  role: AdminRole;
  districts: AdminDistrictRecord[];
  programmes?: UnifiedProgrammeRecord[];
  submissions?: AdminSubmissionRecord[];
  onOpenProgrammes?: () => void;
  onOpenSubmissions?: () => void;
  onSaveDistrict: (d: Partial<AdminDistrictRecord>) => Promise<void>;
  onDeleteDistrict: (slug: string) => Promise<void>;
  onUploadMedia: UploadMediaFn;
}

export function AdminDistrictsView({
  role,
  districts,
  programmes = [],
  submissions = [],
  onOpenProgrammes,
  onOpenSubmissions,
  onSaveDistrict,
  onDeleteDistrict,
  onUploadMedia,
}: AdminDistrictsViewProps) {
  const [editing, setEditing] = useState<Partial<AdminDistrictRecord> | null>(null);
  const [overviewSlug, setOverviewSlug] = useState<string>(districts[0]?.slug ?? 'bhilwara');
  const [quickRajasthanDist, setQuickRajasthanDist] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const remainingRajasthanDistricts = (
    INDIA_STATES_DIRECTORY.find((s) => s.slug === 'rajasthan')?.districts ?? []
  ).filter(
    (distName) =>
      !districts.some((d) => d.nameEn.toLowerCase() === distName.toLowerCase())
  );

  const inspectedDistrict =
    districts.find((d) => d.slug === overviewSlug) ?? districts[0] ?? null;

  const inspectedProgrammes = inspectedDistrict
    ? filterUnifiedProgrammes(programmes, {
        stateName: inspectedDistrict.stateNameEn || 'Rajasthan',
        district: inspectedDistrict.nameEn,
      })
    : [];

  const inspectedSubmissionsCount = inspectedDistrict
    ? submissions.filter(
        (s) => s.district.toLowerCase() === inspectedDistrict.nameEn.toLowerCase()
      ).length
    : 0;

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingPhoto(true);
    try {
      const res = await onUploadMedia(file);
      const current = editing.galleryUrls ?? [];
      setEditing({ ...editing, galleryUrls: [...current, res.url] });
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.nameEn?.trim()) return;
    setSaving(true);
    try {
      await onSaveDistrict(editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const outreachItems = editing?.outreachItems ?? [];
  const galleryUrls = editing?.galleryUrls ?? [];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#142119]">
            Locations, Districts &amp; Pan-India Outreach Directory
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Add states, districts, tehsils/cities, kasbas/villages, clickable Rajasthan map pins, and Collector/Panchayat/University outreach checklists
          </p>
        </div>
        {role === 'super_admin' && (
          <button
            type="button"
            onClick={() =>
              setEditing({
                slug: '',
                stateSlug: 'rajasthan',
                stateNameEn: 'Rajasthan',
                stateNameHi: 'राजस्थान',
                nameEn: '',
                nameHi: '',
                regionTagEn: 'Harit Bharat Expansion District',
                regionTagHi: 'हरित भारत विस्तार जिला',
                focusSummaryEn: '',
                focusSummaryHi: '',
                coordinatorName: 'District Desk',
                outreachNotes: '',
                progressNotesEn: '',
                progressNotesHi: '',
                mapX: 280,
                mapY: 220,
                subDistricts: [],
                villages: [],
                galleryUrls: [],
                outreachItems: [
                  { id: 'dc', roleLabel: 'District Collector Office', officeName: '', status: 'Pending', confirmedForPublic: false },
                  { id: 'panchayat', roleLabel: 'Gram Panchayat & Zila Parishad', officeName: '', status: 'Pending', confirmedForPublic: false },
                  { id: 'uni', roleLabel: 'Universities & Colleges', officeName: '', status: 'Pending', confirmedForPublic: false },
                ],
                isActive: true,
                displayOrder: districts.length + 1,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add State / District</span>
          </button>
        )}
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-[#368737]/40 p-5 sm:p-6 space-y-4 text-xs"
        >
          <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3">
            <h3 className="text-sm font-bold text-[#142119]">
              {editing.slug ? `Edit District: ${editing.nameEn}` : 'Add Expansion District'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-[#55685C] cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <select
              value={editing.stateSlug ?? 'rajasthan'}
              onChange={(e) => {
                const st = findStateByNameOrSlug(e.target.value);
                setEditing({
                  ...editing,
                  stateSlug: st?.slug ?? e.target.value,
                  stateNameEn: st?.nameEn ?? e.target.value,
                  stateNameHi: st?.nameHi ?? e.target.value,
                });
              }}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
            >
              {INDIA_STATES_DIRECTORY.map((st) => (
                <option key={st.slug} value={st.slug}>
                  State / UT: {st.nameEn} ({st.nameHi})
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="District Name (English) *"
              value={editing.nameEn ?? ''}
              onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="District Name (Hindi)"
              value={editing.nameHi ?? ''}
              onChange={(e) => setEditing({ ...editing, nameHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Region Tag (English)"
              value={editing.regionTagEn ?? ''}
              onChange={(e) => setEditing({ ...editing, regionTagEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Region Tag (Hindi)"
              value={editing.regionTagHi ?? ''}
              onChange={(e) => setEditing({ ...editing, regionTagHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Coordinator / Desk Name"
              value={editing.coordinatorName ?? ''}
              onChange={(e) => setEditing({ ...editing, coordinatorName: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Tehsils / Cities (comma separated)"
              value={(editing.subDistricts ?? []).join(', ')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  subDistricts: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="text"
              placeholder="Kasbas / Villages (comma separated)"
              value={(editing.villages ?? []).join(', ')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  villages: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <input
              type="number"
              min={1}
              placeholder="Display Order"
              value={editing.displayOrder ?? 1}
              onChange={(e) =>
                setEditing({ ...editing, displayOrder: Number(e.target.value) || 1 })
              }
              className="rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
            />
          </div>

          {/* Clickable Rajasthan Mini-Map Pin Placer */}
          {(editing.stateSlug ?? 'rajasthan') === 'rajasthan' && (
            <div className="p-4 rounded-xl bg-[#FAFBF8] border border-[#E2EAE4] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="space-y-1.5 flex-1">
                <p className="font-bold text-[#142119]">
                  Interactive Rajasthan Map Pin Coordinates
                </p>
                <p className="text-[11px] text-[#55685C]">
                  Click anywhere on the Rajasthan silhouette to position this district&apos;s live clickable pin on the public Harit Rajasthan &amp; Harit Bharat maps.
                </p>
                <div className="flex items-center gap-3 pt-1 font-mono text-[11px] text-[#144527]">
                  <span>X: {editing.mapX ?? 280}</span>
                  <span>Y: {editing.mapY ?? 220}</span>
                </div>
              </div>
              <svg
                viewBox="0 0 560 480"
                className="w-44 h-36 rounded-xl border border-[#DCE5DE] bg-[#F1F6F1] cursor-crosshair shrink-0"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 560);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 480);
                  setEditing({ ...editing, mapX: x, mapY: y });
                }}
              >
                <path
                  d="M250,48 L315,72 L365,120 L435,165 L490,210 L460,268 L420,315 L368,362 L322,425 L268,420 L215,375 L155,340 L92,288 L64,225 L105,162 L175,112 Z"
                  fill="#DDE9DD"
                  stroke="#144527"
                  strokeWidth="2.5"
                />
                <circle
                  cx={editing.mapX ?? 280}
                  cy={editing.mapY ?? 220}
                  r="11"
                  fill="#144527"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
              </svg>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea
              rows={2}
              placeholder="Focus Summary (English)"
              value={editing.focusSummaryEn ?? ''}
              onChange={(e) => setEditing({ ...editing, focusSummaryEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Focus Summary (Hindi)"
              value={editing.focusSummaryHi ?? ''}
              onChange={(e) => setEditing({ ...editing, focusSummaryHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Public Progress Update (English)"
              value={editing.progressNotesEn ?? ''}
              onChange={(e) => setEditing({ ...editing, progressNotesEn: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
            <textarea
              rows={2}
              placeholder="Public Progress Update (Hindi)"
              value={editing.progressNotesHi ?? ''}
              onChange={(e) => setEditing({ ...editing, progressNotesHi: e.target.value })}
              className="rounded-xl border border-[#DCE5DE] px-3 py-2"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Internal Outreach Notes"
            value={editing.outreachNotes ?? ''}
            onChange={(e) => setEditing({ ...editing, outreachNotes: e.target.value })}
            className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2"
          />

          {/* District Field Photo Gallery */}
          <div className="p-4 rounded-xl bg-[#FAFBF8] border border-[#E2EAE4] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#142119]">District Photo Gallery</span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#144527]/30 text-[#144527] font-semibold cursor-pointer hover:bg-[#EDF5EE]">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </label>
            </div>
            {galleryUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {galleryUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-16 rounded-lg overflow-hidden border border-[#DCE5DE] bg-white">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          galleryUrls: galleryUrls.filter((_, i) => i !== idx),
                        })
                      }
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Institutional Outreach Tracker */}
          <div className="p-4 rounded-xl bg-[#FAFBF8] border border-[#E2EAE4] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-[#142119] block">
                  District Institutional Outreach Checklist
                </span>
                <span className="text-[10px] text-[#6B7E71]">
                  Strictly private unless &quot;Confirm for Public&quot; is ticked after official written confirmation
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    ...editing,
                    outreachItems: [
                      ...outreachItems,
                      {
                        id: `org-${Date.now()}`,
                        roleLabel: 'Institution',
                        officeName: '',
                        status: 'Pending',
                        confirmedForPublic: false,
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DCE5DE] text-[#144527] font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Body
              </button>
            </div>
            <div className="space-y-2">
              {outreachItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center p-2 rounded-lg bg-white border border-[#E2EAE4]"
                >
                  <input
                    type="text"
                    placeholder="Role (Collector / SP / MP / University)"
                    value={item.roleLabel}
                    onChange={(e) => {
                      const next: DistrictOutreachItemSpec[] = [...outreachItems];
                      next[idx] = { ...item, roleLabel: e.target.value };
                      setEditing({ ...editing, outreachItems: next });
                    }}
                    className="md:col-span-3 rounded-lg border border-[#DCE5DE] px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Office / Organisation Name"
                    value={item.officeName}
                    onChange={(e) => {
                      const next: DistrictOutreachItemSpec[] = [...outreachItems];
                      next[idx] = { ...item, officeName: e.target.value };
                      setEditing({ ...editing, outreachItems: next });
                    }}
                    className="md:col-span-4 rounded-lg border border-[#DCE5DE] px-2 py-1"
                  />
                  <select
                    value={item.status}
                    onChange={(e) => {
                      const next: DistrictOutreachItemSpec[] = [...outreachItems];
                      next[idx] = {
                        ...item,
                        status: e.target.value as 'Pending' | 'Invited' | 'Confirmed',
                      };
                      setEditing({ ...editing, outreachItems: next });
                    }}
                    className="md:col-span-2 rounded-lg border border-[#DCE5DE] px-2 py-1 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Invited">Invited</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                  <label className="md:col-span-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#144527]">
                    <input
                      type="checkbox"
                      checked={item.confirmedForPublic}
                      onChange={(e) => {
                        const next: DistrictOutreachItemSpec[] = [...outreachItems];
                        next[idx] = { ...item, confirmedForPublic: e.target.checked };
                        setEditing({ ...editing, outreachItems: next });
                      }}
                    />
                    <span>Public</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        outreachItems: outreachItems.filter((_, i) => i !== idx),
                      })
                    }
                    className="md:col-span-1 text-red-700 hover:bg-red-50 p-1 rounded justify-self-end cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
              <input
                type="checkbox"
                checked={Boolean(editing.isActive)}
                onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                className="rounded text-[#144527]"
              />
              <span>Active on Public Website</span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save District'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EDF2EE] bg-[#FAFBF8] text-[11px] font-semibold text-[#55685C]">
                <th className="py-3 px-5">District</th>
                <th className="py-3 px-4">Coordinator Desk</th>
                <th className="py-3 px-4">Institutional Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F1]">
              {districts.map((d) => {
                const confirmedOutreach = (d.outreachItems ?? []).filter((o) => o.confirmedForPublic).length;
                return (
                  <tr key={d.slug} className="hover:bg-[#FAFBF8]">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#142119] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                        <span>{d.nameEn}</span>
                        <span className="text-[#6B7E71] font-normal">({d.nameHi})</span>
                      </div>
                      <p className="text-[11px] text-[#6B7E71] mt-0.5">
                        {d.stateNameEn || 'Rajasthan'} · {d.regionTagEn}
                        {(d.subDistricts?.length ?? 0) > 0
                          ? ` · ${d.subDistricts?.length} Tehsils/Cities`
                          : ''}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#2A3A30]">{d.coordinatorName}</td>
                    <td className="py-3.5 px-4 text-[#55685C] max-w-md">
                      <p>{d.progressNotesEn || d.outreachNotes || d.focusSummaryEn}</p>
                      <p className="text-[10px] text-[#6B7E71] mt-0.5">
                        {(d.outreachItems ?? []).length} tracked bodies · {confirmedOutreach} public · {(d.galleryUrls ?? []).length} photos
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={d.isActive ? 'text-emerald-700 font-semibold' : 'text-[#6B7E71]'}>
                        {d.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => setOverviewSlug(d.slug)}
                        className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                          inspectedDistrict?.slug === d.slug
                            ? 'bg-[#144527] text-white border-[#144527]'
                            : 'border-[#DCE5DE] text-[#144527] hover:bg-[#EDF5EE]'
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(d)}
                        className="px-3 py-1.5 rounded-lg border border-[#DCE5DE] text-[#144527] font-semibold hover:bg-[#EDF5EE] cursor-pointer"
                      >
                        Edit
                      </button>
                      {role === 'super_admin' && (
                        <button
                          type="button"
                          onClick={() => onDeleteDistrict(d.slug)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer align-middle"
                          aria-label={`Delete ${d.nameEn}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISTRICT PROGRAMME OVERVIEW + QUICK ACTIVATE REMAINING RAJASTHAN DISTRICTS */}
      {inspectedDistrict && (
        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDF2EE] pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
                District Programme Overview · {inspectedDistrict.stateNameEn || 'Rajasthan'}
              </p>
              <h3 className="text-base font-bold text-[#142119] mt-0.5">
                {inspectedDistrict.nameEn} ({inspectedDistrict.nameHi}) — Linked Programmes &amp; Registrations
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {onOpenProgrammes && (
                <button
                  type="button"
                  onClick={onOpenProgrammes}
                  className="px-3 py-1.5 rounded-xl bg-[#144527] text-white font-semibold hover:bg-[#0F351E] cursor-pointer"
                >
                  Manage in All Programmes
                </button>
              )}
              {onOpenSubmissions && (
                <button
                  type="button"
                  onClick={onOpenSubmissions}
                  className="px-3 py-1.5 rounded-xl border border-[#DCE5DE] text-[#144527] font-semibold hover:bg-[#EDF5EE] cursor-pointer"
                >
                  View Registrations ({inspectedSubmissionsCount})
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Projects', value: inspectedProgrammes.filter((p) => p.type === 'project').length },
              { label: 'Campaigns', value: inspectedProgrammes.filter((p) => p.type === 'campaign').length },
              { label: 'Events', value: inspectedProgrammes.filter((p) => p.type === 'event').length },
              { label: 'Training', value: inspectedProgrammes.filter((p) => p.type === 'training').length },
              { label: 'Registrations', value: inspectedSubmissionsCount },
            ].map((k) => (
              <div key={k.label} className="rounded-xl bg-[#FAFBF8] border border-[#E2EAE4] p-3">
                <p className="text-[11px] text-[#55685C]">{k.label}</p>
                <p className="text-xl font-bold text-[#142119] mt-0.5 tabular-nums">{k.value}</p>
              </div>
            ))}
          </div>

          {inspectedProgrammes.length === 0 ? (
            <p className="text-[#55685C]">
              No linked projects, campaigns, or events are assigned to {inspectedDistrict.nameEn} yet. Create one in All Programmes &amp; assign this district.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inspectedProgrammes.map((prg) => (
                <div
                  key={prg.id}
                  className="rounded-xl border border-[#E2EAE4] bg-[#FAFBF8] p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-bold uppercase text-[#2E7D32]">
                      {prg.type} · {prg.operationalStatus} · {prg.publicationStatus}
                    </p>
                    <p className="font-bold text-[#142119] truncate mt-0.5">{prg.titleEn}</p>
                    <p className="text-[11px] text-[#55685C] font-mono">{prg.programmeCode}</p>
                  </div>
                  {onOpenProgrammes && (
                    <button
                      type="button"
                      onClick={onOpenProgrammes}
                      className="px-2.5 py-1 rounded-lg border border-[#DCE5DE] bg-white text-[#144527] font-semibold hover:bg-[#EDF5EE] shrink-0 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {role === 'super_admin' && remainingRajasthanDistricts.length > 0 && (
            <div className="pt-4 border-t border-[#EDF2EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#142119]">
                  Quick Activate Another Rajasthan District ({remainingRajasthanDistricts.length} remaining of 48)
                </p>
                <p className="text-[11px] text-[#55685C]">
                  Pre-fills a new Rajasthan district hub ready for Harit Rajasthan activation.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={quickRajasthanDist}
                  onChange={(e) => setQuickRajasthanDist(e.target.value)}
                  className="rounded-xl border border-[#DCE5DE] bg-white px-3 py-1.5 text-xs"
                >
                  <option value="">Choose Rajasthan District...</option>
                  {remainingRajasthanDistricts.map((distName) => (
                    <option key={distName} value={distName}>
                      {distName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!quickRajasthanDist}
                  onClick={() => {
                    if (!quickRajasthanDist) return;
                    setEditing({
                      slug: quickRajasthanDist.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      stateSlug: 'rajasthan',
                      stateNameEn: 'Rajasthan',
                      stateNameHi: 'राजस्थान',
                      nameEn: quickRajasthanDist,
                      nameHi: quickRajasthanDist,
                      regionTagEn: 'Harit Rajasthan Expansion District',
                      regionTagHi: 'हरित राजस्थान विस्तार जिला',
                      focusSummaryEn: `Community plantation, water stewardship, and Harit Mitra mobilisation across ${quickRajasthanDist}.`,
                      focusSummaryHi: `${quickRajasthanDist} में जन-सहभागिता वृक्षारोपण, जल संरक्षण और हरित मित्र नेटवर्क विस्तार।`,
                      coordinatorName: `${quickRajasthanDist} Coordination Desk`,
                      outreachNotes: 'District activation initiated via Admin Hub.',
                      progressNotesEn: 'Baseline planning underway; verified field data will appear once campaigns begin.',
                      progressNotesHi: 'प्रारंभिक योजना चरण; सत्यापित प्रगति आँकड़े अभियान प्रारंभ होने पर प्रकाशित होंगे।',
                      mapX: 280,
                      mapY: 220,
                      subDistricts: [],
                      villages: [],
                      galleryUrls: [],
                      outreachItems: [],
                      isActive: true,
                      displayOrder: districts.length + 1,
                    });
                    setQuickRajasthanDist('');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#144527] disabled:opacity-45 text-white font-semibold cursor-pointer whitespace-nowrap"
                >
                  Activate District
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AdminProjectsImpactViewProps {
  role: AdminRole;
  projects: AdminProjectRecord[];
  impactMetrics: AdminImpactMetric[];
  onSaveProject: (project: Partial<AdminProjectRecord>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onSaveMetric: (
    metricKey: string,
    patch: {
      verifiedValue: number;
      unitLabel: string;
      verificationNote: string;
      isPublished: boolean;
    }
  ) => Promise<void>;
  onUploadMedia: UploadMediaFn;
}

export function AdminProjectsImpactView({
  role,
  projects,
  impactMetrics,
  onSaveProject,
  onDeleteProject,
  onSaveMetric,
  onUploadMedia,
}: AdminProjectsImpactViewProps) {
  const [metricDrafts, setMetricDrafts] = useState<
    Record<string, { verifiedValue: number; unitLabel: string; verificationNote: string; isPublished: boolean }>
  >({});
  const [savingMetricKey, setSavingMetricKey] = useState<string | null>(null);
  const [editingProj, setEditingProj] = useState<Partial<AdminProjectRecord> | null>(null);
  const [savingProj, setSavingProj] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const getDraft = (m: AdminImpactMetric) =>
    metricDrafts[m.metricKey] ?? {
      verifiedValue: m.verifiedValue,
      unitLabel: m.unitLabel,
      verificationNote: m.verificationNote,
      isPublished: m.isPublished,
    };

  const handleSaveMetricRow = async (m: AdminImpactMetric) => {
    setSavingMetricKey(m.metricKey);
    try {
      await onSaveMetric(m.metricKey, getDraft(m));
    } finally {
      setSavingMetricKey(null);
    }
  };

  const handleProjectUpload = async (
    field: 'imageUrl' | 'reportUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingProj) return;
    setUploadingField(field);
    try {
      const res = await onUploadMedia(file);
      setEditingProj({ ...editingProj, [field]: res.url });
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj?.titleEn?.trim()) return;
    setSavingProj(true);
    try {
      await onSaveProject(editingProj);
      setEditingProj(null);
    } finally {
      setSavingProj(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Verified Impact Counters Controller */}
      <section className="bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EDF2EE]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#368737]">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Data Honesty Charter</span>
            </div>
            <h2 className="text-base font-bold text-[#142119] mt-0.5">
              Verified Public Impact Counters
            </h2>
            <p className="text-xs text-[#55685C]">
              Only Super Admins can update verified figures published to the public website. Never enter unverified projections here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {impactMetrics.map((m) => {
            const draft = getDraft(m);
            return (
              <div
                key={m.metricKey}
                className="p-4 rounded-xl border border-[#E2EAE4] bg-[#FAFBF8] space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#142119]">{m.labelEn}</span>
                  <span className="font-mono text-[11px] text-[#6B7E71]">{m.labelHi}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#55685C] mb-1">
                      Verified Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      disabled={role !== 'super_admin'}
                      value={draft.verifiedValue}
                      onChange={(e) =>
                        setMetricDrafts((prev) => ({
                          ...prev,
                          [m.metricKey]: {
                            ...draft,
                            verifiedValue: Math.max(0, Number(e.target.value) || 0),
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5 font-mono font-bold tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#55685C] mb-1">
                      Context Tag
                    </label>
                    <input
                      type="text"
                      disabled={role !== 'super_admin'}
                      value={draft.unitLabel}
                      onChange={(e) =>
                        setMetricDrafts((prev) => ({
                          ...prev,
                          [m.metricKey]: { ...draft, unitLabel: e.target.value },
                        }))
                      }
                      className="w-full rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  disabled={role !== 'super_admin'}
                  value={draft.verificationNote}
                  onChange={(e) =>
                    setMetricDrafts((prev) => ({
                      ...prev,
                      [m.metricKey]: { ...draft, verificationNote: e.target.value },
                    }))
                  }
                  placeholder="Verification basis note..."
                  className="w-full rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5 text-[11px]"
                />
                {role === 'super_admin' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#2A3A30]">
                      <input
                        type="checkbox"
                        checked={draft.isPublished}
                        onChange={(e) =>
                          setMetricDrafts((prev) => ({
                            ...prev,
                            [m.metricKey]: { ...draft, isPublished: e.target.checked },
                          }))
                        }
                        className="rounded text-[#144527]"
                      />
                      <span>Published</span>
                    </label>
                    <button
                      type="button"
                      disabled={savingMetricKey === m.metricKey}
                      onClick={() => handleSaveMetricRow(m)}
                      className="px-3 py-1 rounded-lg bg-[#144527] hover:bg-[#0F351E] text-white text-[11px] font-semibold cursor-pointer"
                    >
                      {savingMetricKey === m.metricKey ? 'Saving...' : 'Update'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Projects Registry CRUD */}
      <section className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#142119]">Projects Registry</h2>
            <p className="text-xs text-[#55685C] mt-0.5">
              Strict stage labels: Proposed · Under Assessment · Approved · Ongoing · Completed · Upload photos &amp; 3/6/12-month progress PDFs
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setEditingProj({
                id: '',
                titleEn: '',
                titleHi: '',
                locationEn: 'Bhilwara, Rajasthan',
                locationHi: 'भीलवाड़ा, राजस्थान',
                scope: 'District',
                stateName: 'Rajasthan',
                district: 'Bhilwara',
                subDistrict: '',
                villageOrTown: '',
                missionCategoryEn: 'Harit Rajasthan & Tree Plantation',
                missionCategoryHi: 'हरित राजस्थान एवं वृक्षारोपण',
                status: 'Proposed',
                objectivesEn: '',
                objectivesHi: '',
                beneficiaryEn: '',
                beneficiaryHi: '',
                noteEn: 'Proposed initiative — baseline verification pending.',
                noteHi: 'प्रस्तावित पहल — प्रारंभिक सत्यापन प्रक्रियाधीन।',
                startDate: '2026-11-01',
                progressPeriod: 'Phase I Baseline',
                imageUrl: '',
                reportUrl: '',
                partnerName: '',
                partnerConfirmedForPublic: false,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        {editingProj && (
          <form
            onSubmit={handleSaveProjectForm}
            className="bg-white rounded-2xl border border-[#368737]/40 p-5 sm:p-6 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#EDF2EE] pb-3">
              <h3 className="text-sm font-bold text-[#142119]">
                {editingProj.id ? 'Edit Project' : 'New Project Entry'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProj(null)}
                className="text-[#55685C] cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Project Title (English) *"
                value={editingProj.titleEn ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, titleEn: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Project Title (Hindi)"
                value={editingProj.titleHi ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, titleHi: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editingProj.scope ?? 'District'}
                  onChange={(e) => setEditingProj({ ...editingProj, scope: e.target.value })}
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                >
                  <option value="National">Scope: National</option>
                  <option value="Statewide">Scope: Statewide</option>
                  <option value="District">Scope: District</option>
                  <option value="Local">Scope: Local</option>
                </select>
                <select
                  value={editingProj.stateName ?? 'Rajasthan'}
                  onChange={(e) => {
                    const st = findStateByNameOrSlug(e.target.value);
                    const nextDist = st?.districts[0] || '';
                    setEditingProj({
                      ...editingProj,
                      stateName: e.target.value,
                      district: nextDist,
                      locationEn: nextDist ? `${nextDist}, ${e.target.value}` : e.target.value,
                    });
                  }}
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                >
                  {INDIA_STATES_DIRECTORY.map((st) => (
                    <option key={st.slug} value={st.nameEn}>
                      {st.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(() => {
                  const stObj = findStateByNameOrSlug(editingProj.stateName || 'Rajasthan');
                  const distOptions = Array.from(
                    new Set([
                      ...(stObj?.districts ?? []),
                      ...(editingProj.district ? [editingProj.district] : []),
                    ])
                  ).sort((a, b) => a.localeCompare(b));
                  return (
                    <select
                      aria-label="Project district"
                      value={editingProj.district ?? ''}
                      onChange={(e) =>
                        setEditingProj({
                          ...editingProj,
                          district: e.target.value,
                          locationEn: `${e.target.value}, ${editingProj.stateName || 'Rajasthan'}`,
                        })
                      }
                      className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
                    >
                      <option value="">All Districts</option>
                      {distOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  );
                })()}
                <input
                  type="text"
                  placeholder="Tehsil / City"
                  value={editingProj.subDistrict ?? ''}
                  onChange={(e) => setEditingProj({ ...editingProj, subDistrict: e.target.value })}
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Kasba / Village"
                  value={editingProj.villageOrTown ?? ''}
                  onChange={(e) =>
                    setEditingProj({ ...editingProj, villageOrTown: e.target.value })
                  }
                  className="rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
              </div>
              <select
                value={editingProj.status ?? 'Proposed'}
                onChange={(e) =>
                  setEditingProj({
                    ...editingProj,
                    status: e.target.value as AdminProjectRecord['status'],
                  })
                }
                className="rounded-xl border border-[#DCE5DE] px-3 py-2 bg-white"
              >
                <option value="Proposed">Proposed</option>
                <option value="Under Assessment">Under Assessment</option>
                <option value="Approved">Approved</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="text"
                placeholder="Location Label (English)"
                value={editingProj.locationEn ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, locationEn: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Location Label (Hindi)"
                value={editingProj.locationHi ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, locationHi: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Mission Category (English)"
                value={editingProj.missionCategoryEn ?? ''}
                onChange={(e) =>
                  setEditingProj({ ...editingProj, missionCategoryEn: e.target.value })
                }
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Mission Category (Hindi)"
                value={editingProj.missionCategoryHi ?? ''}
                onChange={(e) =>
                  setEditingProj({ ...editingProj, missionCategoryHi: e.target.value })
                }
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="date"
                value={editingProj.startDate ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, startDate: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2 font-mono"
              />
              <input
                type="text"
                placeholder="Progress Milestone (e.g. 3-Month Survival Audit)"
                value={editingProj.progressPeriod ?? ''}
                onChange={(e) =>
                  setEditingProj({ ...editingProj, progressPeriod: e.target.value })
                }
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Beneficiary Group (English)"
                value={editingProj.beneficiaryEn ?? ''}
                onChange={(e) =>
                  setEditingProj({ ...editingProj, beneficiaryEn: e.target.value })
                }
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Beneficiary Group (Hindi)"
                value={editingProj.beneficiaryHi ?? ''}
                onChange={(e) =>
                  setEditingProj({ ...editingProj, beneficiaryHi: e.target.value })
                }
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea
                rows={2}
                placeholder="Objectives (English)"
                value={editingProj.objectivesEn ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, objectivesEn: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <textarea
                rows={2}
                placeholder="Objectives (Hindi)"
                value={editingProj.objectivesHi ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, objectivesHi: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Transparency / Verification Note (English)"
                value={editingProj.noteEn ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, noteEn: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
              <input
                type="text"
                placeholder="Transparency / Verification Note (Hindi)"
                value={editingProj.noteHi ?? ''}
                onChange={(e) => setEditingProj({ ...editingProj, noteHi: e.target.value })}
                className="rounded-xl border border-[#DCE5DE] px-3 py-2"
              />
            </div>

            {/* Project Photo, PDF Report & Confirmed Partner Guard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E2EAE4]">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Project Photo URL"
                  value={editingProj.imageUrl ?? ''}
                  onChange={(e) => setEditingProj({ ...editingProj, imageUrl: e.target.value })}
                  className="flex-1 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white font-mono"
                />
                <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#144527]/30 bg-white text-[#144527] font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'imageUrl' ? '...' : 'Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleProjectUpload('imageUrl', e)}
                  />
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Progress Report PDF URL"
                  value={editingProj.reportUrl ?? ''}
                  onChange={(e) => setEditingProj({ ...editingProj, reportUrl: e.target.value })}
                  className="flex-1 rounded-lg border border-[#DCE5DE] px-2.5 py-1.5 bg-white font-mono"
                />
                <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#144527]/30 bg-white text-[#144527] font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'reportUrl' ? '...' : 'PDF'}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleProjectUpload('reportUrl', e)}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Partner Institution / CSR Sponsor Name (Optional)"
                  value={editingProj.partnerName ?? ''}
                  onChange={(e) => setEditingProj({ ...editingProj, partnerName: e.target.value })}
                  className="flex-1 min-w-[220px] rounded-xl border border-[#DCE5DE] px-3 py-2"
                />
                <label className="inline-flex items-center gap-1.5 font-semibold text-[#142119]">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProj.partnerConfirmedForPublic)}
                    onChange={(e) =>
                      setEditingProj({
                        ...editingProj,
                        partnerConfirmedForPublic: e.target.checked,
                      })
                    }
                  />
                  <span>Partner Confirmed for Public Display</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={savingProj}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] text-white font-semibold cursor-pointer shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProj ? 'Saving...' : 'Save Project'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#55685C]">
                  <span className="font-semibold text-[#368737]">{p.locationEn}</span>
                  <span className="font-mono font-semibold text-[#144527]">{p.status}</span>
                </div>
                <h3 className="text-sm font-bold text-[#142119]">{p.titleEn}</h3>
                <p className="text-xs text-[#55685C] leading-relaxed">{p.objectivesEn}</p>
                <p className="text-[11px] text-[#6B7E71] italic">{p.noteEn}</p>
                {(p.progressPeriod || p.reportUrl || p.partnerName) && (
                  <p className="text-[10px] text-[#44544A] pt-1">
                    {p.progressPeriod && <span className="font-semibold">{p.progressPeriod} · </span>}
                    {p.reportUrl && <span>PDF Attached · </span>}
                    {p.partnerName && (
                      <span>
                        Partner: {p.partnerName} ({p.partnerConfirmedForPublic ? 'Public' : 'Internal'})
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F4F1]">
                <button
                  type="button"
                  onClick={() => setEditingProj(p)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE5DE] text-xs font-semibold text-[#144527] hover:bg-[#EDF5EE] cursor-pointer"
                >
                  Edit
                </button>
                {role === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => onDeleteProject(p.id)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 cursor-pointer"
                    aria-label={`Delete ${p.titleEn}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

