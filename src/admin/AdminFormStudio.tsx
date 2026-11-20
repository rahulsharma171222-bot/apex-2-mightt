import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Lock,
  Pencil,
  Plus,
  Save,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';
import type { AdminFormDefinition } from './types';
import type { DynamicFormFieldSpec } from '../db/schema';

interface AdminFormStudioProps {
  forms: AdminFormDefinition[];
  loading: boolean;
  onSaveForm: (id: string, patch: Partial<AdminFormDefinition>) => Promise<void>;
}

const INPUT_TYPE_OPTIONS: { value: DynamicFormFieldSpec['type']; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'select', label: 'Dropdown Select (Bilingual)' },
  { value: 'textarea', label: 'Multi-line Textarea' },
  { value: 'number', label: 'Numeric Input' },
  { value: 'date', label: 'Date Picker' },
  { value: 'email', label: 'Email Address' },
  { value: 'checkbox', label: 'Checkbox Consent / Confirmation' },
];

export function AdminFormStudio({ forms, loading, onSaveForm }: AdminFormStudioProps) {
  const [selectedId, setSelectedId] = useState<string>(forms[0]?.id ?? 'farmer');
  const [saving, setSaving] = useState(false);
  const [paneTab, setPaneTab] = useState<'edit' | 'preview'>('edit');
  const [previewLang, setPreviewLang] = useState<'en' | 'hi'>('en');

  const selectedForm = forms.find((f) => f.id === selectedId) ?? forms[0] ?? null;

  const [isOpen, setIsOpen] = useState(true);
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleHi, setSubtitleHi] = useState('');
  const [closedMessageEn, setClosedMessageEn] = useState('');
  const [closedMessageHi, setClosedMessageHi] = useState('');
  const [customFields, setCustomFields] = useState<DynamicFormFieldSpec[]>([]);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedForm) return;
    setSelectedId(selectedForm.id);
    setIsOpen(selectedForm.isOpen);
    setTitleEn(selectedForm.titleEn);
    setTitleHi(selectedForm.titleHi);
    setSubtitleEn(selectedForm.subtitleEn);
    setSubtitleHi(selectedForm.subtitleHi);
    setClosedMessageEn(selectedForm.closedMessageEn);
    setClosedMessageHi(selectedForm.closedMessageHi);
    const cloned = Array.isArray(selectedForm.customFields)
      ? selectedForm.customFields.map((f) => ({
          ...f,
          options: f.options ? f.options.map((o) => ({ ...o })) : undefined,
        }))
      : [];
    setCustomFields(cloned);
    setSavedKeys(new Set(cloned.map((f) => f.key)));
    setUnlockedKeys(new Set());
  }, [selectedForm?.id, selectedForm?.updatedAt]);

  const addField = () => {
    const key = `customField${customFields.length + 1}_${Date.now().toString(36).slice(-3)}`;
    setCustomFields((prev) => [
      ...prev,
      {
        key,
        labelEn: 'New Custom Question',
        labelHi: 'नया प्रश्न',
        type: 'text',
        required: false,
        placeholderEn: 'Enter details...',
        placeholderHi: 'विवरण लिखें...',
      },
    ]);
  };

  const updateField = (index: number, patch: Partial<DynamicFormFieldSpec>) => {
    setCustomFields((prev) =>
      prev.map((field, idx) => {
        if (idx !== index) return field;
        const merged = { ...field, ...patch };
        if (merged.type === 'select' && (!merged.options || merged.options.length === 0)) {
          merged.options = [
            { value: 'Option 1', labelEn: 'Option 1', labelHi: 'विकल्प 1' },
            { value: 'Option 2', labelEn: 'Option 2', labelHi: 'विकल्प 2' },
          ];
        }
        return merged;
      })
    );
  };

  const moveField = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= customFields.length) return;
    setCustomFields((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const removeField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleUnlockKey = (key: string) => {
    setUnlockedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;
    setSaving(true);
    try {
      await onSaveForm(selectedForm.id, {
        isOpen,
        titleEn,
        titleHi,
        subtitleEn,
        subtitleHi,
        closedMessageEn,
        closedMessageHi,
        customFields,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async (form: AdminFormDefinition) => {
    await onSaveForm(form.id, { isOpen: !form.isOpen });
  };

  if (loading && forms.length === 0) {
    return <div className="h-96 rounded-2xl bg-white border border-[#E2EAE4] animate-pulse" />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      {/* Left: All 12 Forms + Contact List */}
      <aside className="xl:col-span-4 bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden self-start">
        <div className="p-4 border-b border-[#EDF2EE]">
          <h2 className="text-sm font-bold text-[#142119]">12 Dedicated Forms Studio</h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Toggle availability, edit bilingual fields, and preview live forms
          </p>
        </div>
        <div className="divide-y divide-[#F0F4F1] max-h-[680px] overflow-y-auto">
          {forms.map((form) => {
            const active = form.id === selectedForm?.id;
            return (
              <div
                key={form.id}
                className={`px-4 py-3 flex items-center justify-between gap-2 transition-colors ${
                  active ? 'bg-[#EDF5EE]' : 'hover:bg-[#FAFBF8]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(form.id)}
                  className="text-left min-w-0 flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#368737] tabular-nums">
                      {form.formNumber <= 12
                        ? `#${String(form.formNumber).padStart(2, '0')}`
                        : 'CNT'}
                    </span>
                    <span className="text-xs font-semibold text-[#142119] truncate">
                      {form.titleEn.replace(/^\d+\.\s*/, '')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7E71] mt-0.5 tabular-nums">
                    {form.customFields.length} custom fields ·{' '}
                    <span
                      className={
                        form.isOpen ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'
                      }
                    >
                      {form.isOpen ? 'Open' : 'Paused'}
                    </span>
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickToggle(form)}
                  aria-label={`Toggle ${form.titleEn} ${form.isOpen ? 'closed' : 'open'}`}
                  className="p-1 text-[#144527] hover:opacity-80 cursor-pointer shrink-0"
                >
                  {form.isOpen ? (
                    <ToggleRight className="w-6 h-6 text-[#368737]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-[#98AA9D]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right: Selected Form Editor + Live Preview */}
      {selectedForm && (
        <form
          onSubmit={handleSave}
          className="xl:col-span-8 bg-white rounded-2xl border border-[#E2EAE4] p-5 sm:p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDF2EE]">
            <div>
              <span className="font-mono text-xs font-semibold text-[#368737]">
                CODE: GVD-{selectedForm.codePrefix}-YYYY · ROUTE: /join/{selectedForm.id}
              </span>
              <h3 className="text-lg font-bold text-[#142119] mt-0.5">{titleEn || selectedForm.titleEn}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex bg-[#F3F6F3] p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setPaneTab('edit')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                    paneTab === 'edit' ? 'bg-white text-[#144527] shadow-2xs' : 'text-[#55685C]'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Fields</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaneTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                    paneTab === 'preview' ? 'bg-white text-[#144527] shadow-2xs' : 'text-[#55685C]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  isOpen
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {isOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                <span>{isOpen ? 'Open' : 'Paused'}</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#144527] hover:bg-[#0F351E] disabled:opacity-60 text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
              </button>
            </div>
          </div>

          {paneTab === 'preview' ? (
            /* LIVE INTERACTIVE PREVIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 bg-[#F4F8F3] px-4 py-2.5 rounded-xl border border-[#DCEADF] text-xs">
                <span className="font-semibold text-[#144527]">
                  Live Public Form Preview (Unsaved changes reflected immediately)
                </span>
                <div className="inline-flex bg-white p-0.5 rounded-lg border border-[#DCE5DE]">
                  <button
                    type="button"
                    onClick={() => setPreviewLang('en')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      previewLang === 'en' ? 'bg-[#144527] text-white' : 'text-[#55685C]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang('hi')}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      previewLang === 'hi' ? 'bg-[#144527] text-white' : 'text-[#55685C]'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#DCE5DE] bg-[#FAFBF8] p-6 space-y-5">
                {!isOpen ? (
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <p className="font-bold">Form Currently Paused</p>
                    <p>{previewLang === 'hi' ? closedMessageHi : closedMessageEn}</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-lg font-bold text-[#142119]">
                        {previewLang === 'hi' ? titleHi || titleEn : titleEn}
                      </h4>
                      <p className="text-xs text-[#55685C] mt-1">
                        {previewLang === 'hi' ? subtitleHi || subtitleEn : subtitleEn}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs opacity-75">
                      <div className="space-y-1">
                        <label className="font-semibold text-[#142119]">
                          {previewLang === 'hi' ? 'आवेदक का पूरा नाम *' : 'Applicant Full Name *'}
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder="Standard core field"
                          className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-[#142119]">
                          {previewLang === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                        </label>
                        <input
                          type="text"
                          disabled
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                        />
                      </div>
                    </div>

                    {customFields.length > 0 && (
                      <div className="pt-3 border-t border-[#E2EAE4] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {customFields.map((field, i) => {
                          const label = previewLang === 'hi' ? field.labelHi || field.labelEn : field.labelEn;
                          const ph =
                            previewLang === 'hi'
                              ? field.placeholderHi || field.placeholderEn || ''
                              : field.placeholderEn || '';
                          return (
                            <div
                              key={`${field.key}-${i}`}
                              className={
                                field.type === 'textarea' || field.type === 'checkbox'
                                  ? 'sm:col-span-2 space-y-1'
                                  : 'space-y-1'
                              }
                            >
                              {field.type === 'checkbox' ? (
                                <label className="inline-flex items-center gap-2 font-semibold text-[#142119]">
                                  <input type="checkbox" className="rounded text-[#144527]" />
                                  <span>
                                    {label} {field.required ? '*' : ''}
                                  </span>
                                </label>
                              ) : (
                                <>
                                  <label className="block font-semibold text-[#142119]">
                                    {label} {field.required ? '*' : ''}
                                  </label>
                                  {field.type === 'select' ? (
                                    <select className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2">
                                      <option value="">
                                        {previewLang === 'hi' ? '-- चुनें --' : '-- Select --'}
                                      </option>
                                      {(field.options ?? []).map((opt, oi) => (
                                        <option key={oi} value={opt.value}>
                                          {previewLang === 'hi' ? opt.labelHi || opt.labelEn : opt.labelEn}
                                        </option>
                                      ))}
                                    </select>
                                  ) : field.type === 'textarea' ? (
                                    <textarea
                                      rows={2}
                                      placeholder={ph}
                                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                                    />
                                  ) : (
                                    <input
                                      type={field.type}
                                      placeholder={ph}
                                      className="w-full rounded-xl border border-[#DCE5DE] bg-white px-3 py-2"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* FIELD BUILDER MODE */
            <>
              {/* Titles & Subtitles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#142119]">Form Title (English)</label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#142119]">Form Title (Hindi)</label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#142119]">Subtitle (English)</label>
                  <input
                    type="text"
                    value={subtitleEn}
                    onChange={(e) => setSubtitleEn(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#142119]">Subtitle (Hindi)</label>
                  <input
                    type="text"
                    value={subtitleHi}
                    onChange={(e) => setSubtitleHi(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5DE] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
                  />
                </div>
              </div>

              {/* Closed Notice */}
              {!isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-red-50/50 border border-red-200 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-red-900">Pause Banner Message (English)</label>
                    <input
                      type="text"
                      value={closedMessageEn}
                      onChange={(e) => setClosedMessageEn(e.target.value)}
                      className="w-full rounded-xl border border-red-200 bg-white px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-red-900">Pause Banner Message (Hindi)</label>
                    <input
                      type="text"
                      value={closedMessageHi}
                      onChange={(e) => setClosedMessageHi(e.target.value)}
                      className="w-full rounded-xl border border-red-200 bg-white px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Custom Fields Builder */}
              <div className="space-y-3 pt-2 border-t border-[#EDF2EE]">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#142119]">
                      Category-Specific Custom Fields
                    </h4>
                    <p className="text-xs text-[#55685C]">
                      Supports text, bilingual dropdowns, numbers, dates, emails, checkboxes &amp; textareas
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addField}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBE0CC] bg-[#F4F8F3] hover:bg-[#E8F2E6] text-[#144527] text-xs font-semibold cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Field</span>
                  </button>
                </div>

                {customFields.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-[#D4E0D7] text-center text-xs text-[#55685C]">
                    No custom fields configured yet. Click &quot;Add Field&quot; to capture extra information for this form.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customFields.map((field, idx) => {
                      const isSavedExisting = savedKeys.has(field.key);
                      const isKeyLocked = isSavedExisting && !unlockedKeys.has(field.key);

                      return (
                        <div
                          key={`${field.key}-${idx}`}
                          className="p-4 rounded-xl border border-[#E2EAE4] bg-[#FAFBF8] space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] font-semibold text-[#368737]">
                              Field #{idx + 1} · key: {field.key}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveField(idx, -1)}
                                disabled={idx === 0}
                                aria-label="Move field up"
                                className="p-1.5 rounded-lg border border-[#DCE5DE] bg-white disabled:opacity-40 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveField(idx, 1)}
                                disabled={idx === customFields.length - 1}
                                aria-label="Move field down"
                                className="p-1.5 rounded-lg border border-[#DCE5DE] bg-white disabled:opacity-40 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeField(idx)}
                                aria-label={`Remove field ${field.labelEn}`}
                                className="p-1.5 rounded-lg border border-red-200 bg-white text-red-700 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] font-semibold text-[#55685C]">
                                  Field Key {isKeyLocked ? '(Locked)' : ''}
                                </label>
                                {isSavedExisting && (
                                  <button
                                    type="button"
                                    onClick={() => toggleUnlockKey(field.key)}
                                    title="Renaming an existing key can separate historical submission responses"
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 hover:underline cursor-pointer"
                                  >
                                    {isKeyLocked ? (
                                      <>
                                        <Lock className="w-3 h-3" /> Unlock
                                      </>
                                    ) : (
                                      <>
                                        <Unlock className="w-3 h-3" /> Lock
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                disabled={isKeyLocked}
                                value={field.key}
                                onChange={(e) =>
                                  updateField(idx, {
                                    key: e.target.value.replace(/[^a-zA-Z0-9_]/g, ''),
                                  })
                                }
                                className={`w-full rounded-lg border px-2.5 py-1.5 font-mono ${
                                  isKeyLocked
                                    ? 'border-[#E2EAE4] bg-[#F1F4F1] text-[#6B7E71] cursor-not-allowed'
                                    : 'border-[#DCE5DE] bg-white'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#55685C] mb-1">
                                Input Type
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) =>
                                  updateField(idx, {
                                    type: e.target.value as DynamicFormFieldSpec['type'],
                                  })
                                }
                                className="w-full rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                              >
                                {INPUT_TYPE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-end pb-1.5">
                              <label className="inline-flex items-center gap-2 font-semibold text-[#142119] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(field.required)}
                                  onChange={(e) => updateField(idx, { required: e.target.checked })}
                                  className="rounded border-[#C5D3C9] text-[#144527]"
                                />
                                <span>Required Field</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#55685C] mb-1">
                                Label (English)
                              </label>
                              <input
                                type="text"
                                value={field.labelEn}
                                onChange={(e) => updateField(idx, { labelEn: e.target.value })}
                                className="w-full rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#55685C] mb-1">
                                Label (Hindi)
                              </label>
                              <input
                                type="text"
                                value={field.labelHi}
                                onChange={(e) => updateField(idx, { labelHi: e.target.value })}
                                className="w-full rounded-lg border border-[#DCE5DE] bg-white px-2.5 py-1.5"
                              />
                            </div>
                          </div>

                          {/* Structured Bilingual Dropdown Options Editor (Never overwrites Hindi labels!) */}
                          {field.type === 'select' && (
                            <div className="space-y-2 pt-1 border-t border-[#E6EEE8]">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-[#144527]">
                                  Bilingual Dropdown Options (Value · English · Hindi)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = field.options ?? [];
                                    updateField(idx, {
                                      options: [
                                        ...current,
                                        {
                                          value: `Option ${current.length + 1}`,
                                          labelEn: `Option ${current.length + 1}`,
                                          labelHi: `विकल्प ${current.length + 1}`,
                                        },
                                      ],
                                    });
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#DCE5DE] bg-white text-[#144527] text-[11px] font-semibold cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" /> Add Option
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                {(field.options ?? []).map((opt, optIdx) => (
                                  <div
                                    key={optIdx}
                                    className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Stored Value"
                                      value={opt.value}
                                      onChange={(e) => {
                                        const next = [...(field.options ?? [])];
                                        next[optIdx] = { ...opt, value: e.target.value };
                                        updateField(idx, { options: next });
                                      }}
                                      className="sm:col-span-3 rounded-lg border border-[#DCE5DE] bg-white px-2 py-1 font-mono text-[11px]"
                                    />
                                    <input
                                      type="text"
                                      placeholder="English Label"
                                      value={opt.labelEn}
                                      onChange={(e) => {
                                        const next = [...(field.options ?? [])];
                                        next[optIdx] = { ...opt, labelEn: e.target.value };
                                        updateField(idx, { options: next });
                                      }}
                                      className="sm:col-span-4 rounded-lg border border-[#DCE5DE] bg-white px-2 py-1 text-[11px]"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Hindi Label (हिंदी)"
                                      value={opt.labelHi}
                                      onChange={(e) => {
                                        const next = [...(field.options ?? [])];
                                        next[optIdx] = { ...opt, labelHi: e.target.value };
                                        updateField(idx, { options: next });
                                      }}
                                      className="sm:col-span-4 rounded-lg border border-[#DCE5DE] bg-white px-2 py-1 text-[11px]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = (field.options ?? []).filter(
                                          (_, i) => i !== optIdx
                                        );
                                        updateField(idx, { options: next });
                                      }}
                                      aria-label="Remove dropdown option"
                                      className="sm:col-span-1 text-red-700 hover:bg-red-50 p-1 rounded justify-self-end cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
