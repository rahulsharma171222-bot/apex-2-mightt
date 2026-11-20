import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowRight,
  MapPin,
  Calendar,
  Download,
  Building2,
  Users,
} from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import {
  ScenicPageHeader,
  SeamlessPhotoCanvas,
  ScenicHorizonStrip,
} from '../components/ScenicElements';
import { ABOUT_SECTIONS, PROJECTS_DATA } from '../data/siteContent';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { Language } from '../types/goveda';

interface AboutPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function AboutPage({ lang, onNavigate }: AboutPageProps) {
  const { bootstrap } = usePublicPortal();
  const gov = bootstrap?.siteGovernance ?? null;

  const legalRows = [
    {
      label: lang === 'hi' ? 'संस्था स्वरूप (Legal Structure)' : 'Legal Structure',
      value: 'Section 8 Non-Profit Company (India)',
    },
    {
      label: lang === 'hi' ? 'CIN / पंजीकरण संख्या' : 'CIN / Registration No.',
      value:
        gov?.cinNumber?.trim() ||
        (lang === 'hi'
          ? 'औपचारिक पोर्टल समन्वय पर प्रकाशित'
          : 'Published upon official portal sync'),
    },
    {
      label: 'PAN / TAN',
      value:
        gov?.panNumber?.trim() ||
        (lang === 'hi'
          ? 'CSR जांच हेतु सत्यापित वैधानिक अभिलेख उपलब्ध'
          : 'Verified statutory records available for CSR due diligence'),
    },
    {
      label: 'NGO Darpan / MSME',
      value:
        [gov?.darpanId?.trim(), gov?.msmeNumber?.trim()].filter(Boolean).join(' · ') ||
        (lang === 'hi'
          ? 'वैध सक्रिय अनुमोदनों के अनुसार प्रकाशित'
          : 'Displayed strictly per valid active approvals'),
    },
    {
      label: lang === 'hi' ? '80G एवं FCRA स्थिति' : '80G & FCRA Status',
      value: gov
        ? `80G: ${
            gov.eightyGApproved
              ? lang === 'hi'
                ? 'स्वीकृत / सक्रिय'
                : 'Approved & Active'
              : lang === 'hi'
              ? 'प्रक्रियाधीन / औपचारिक पुष्टि उपरांत'
              : 'Pending / Per Formal Approval'
          } · FCRA: ${
            gov.fcraApproved
              ? lang === 'hi'
                ? 'स्वीकृत / सक्रिय'
                : 'Approved & Active'
              : lang === 'hi'
              ? 'प्रक्रियाधीन / औपचारिक पुष्टि उपरांत'
              : 'Pending / Per Formal Approval'
          }`
        : lang === 'hi'
        ? 'केवल सक्रिय वैधानिक स्वीकृति के अनुसार प्रदर्शित'
        : 'Displayed strictly per valid active approvals',
    },
  ];

  const confirmedLeadership = (gov?.leadershipRoster ?? []).filter(
    (m) => m.confirmedForPublic !== false && m.name?.trim()
  );

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={lang === 'hi' ? 'हमारे बारे में' : 'About GOVEDA'}
        title={
          lang === 'hi'
            ? 'GOVEDA कार्बन एवं क्लाइमेट इंडिया फाउंडेशन'
            : 'GOVEDA Carbon & Climate India Foundation'
        }
        subtitle={ABOUT_SECTIONS.intro[lang]}
        iconName="Trees"
        variant="fort"
        assetKey="heritageSolar"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl bg-[#F4F8F3] border border-[#479D27]/20 p-6">
                <h2 className="text-base font-bold text-[#144527] mb-1.5">
                  {lang === 'hi' ? 'दृष्टिकोण (Vision)' : 'Vision (2026–2030)'}
                </h2>
                <p className="text-xs sm:text-sm text-[#2A3A30] leading-relaxed">
                  {ABOUT_SECTIONS.vision[lang]}
                </p>
              </div>
              <div className="rounded-3xl bg-[#FAFBF8] border border-[#479D27]/20 p-6">
                <h2 className="text-base font-bold text-[#144527] mb-1.5">
                  {lang === 'hi' ? 'उद्देश्य (Mission)' : 'Mission'}
                </h2>
                <p className="text-xs sm:text-sm text-[#2A3A30] leading-relaxed">
                  {ABOUT_SECTIONS.mission[lang]}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SeamlessPhotoCanvas
              assetKey="haritRajasthan"
              alt="Rajasthan landscape representing GOVEDA vision"
              iconName="Trees"
              scenicVariant="fort"
              kicker={lang === 'hi' ? 'राष्ट्रीय जन-अभियान' : 'National People’s Initiative'}
              title={
                lang === 'hi'
                  ? 'प्रकृति, किसान, गौशाला एवं ग्रामीण उत्थान का एकीकृत दृष्टिकोण'
                  : 'Uniting Nature Conservation, Farmers, Gaushalas & Rural Empowerment'
              }
              imageHeightClass="h-64 sm:h-72"
            />
          </div>
        </div>

        <ScenicHorizonStrip variant="village" />

        {/* Core Objectives */}
        <section className="rounded-3xl bg-[#FAFBF8] border border-[#1B5A32]/15 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-[#144527]">
            {lang === 'hi' ? 'मुख्य उद्देश्य (Core Objectives)' : 'Core Institutional Objectives'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ABOUT_SECTIONS.objectives.map((obj) => (
              <div key={obj.en} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#1B5A32]/10">
                <CheckCircle2 className="w-5 h-5 text-[#4BA348] shrink-0 mt-0.5" />
                <p className="text-sm text-[#1E2923] leading-relaxed">{obj[lang]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder Message, Leadership & Legal Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 rounded-2xl border border-[#1B5A32]/15 p-6 bg-white space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#368737]">
              {ABOUT_SECTIONS.founderMessage.title[lang]}
            </p>
            <blockquote className="text-sm sm:text-base text-[#1E2923] leading-relaxed italic">
              &ldquo;{ABOUT_SECTIONS.founderMessage.quote[lang]}&rdquo;
            </blockquote>
            <p className="text-xs text-[#44544A] pt-2 border-t border-[#1B5A32]/10">
              {ABOUT_SECTIONS.founderMessage.note[lang]}
            </p>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-[#1B5A32]/15 p-6 bg-[#F4F8F3] space-y-4">
            <div className="flex items-center gap-2 text-[#144527]">
              <ShieldCheck className="w-5 h-5 text-[#368737]" />
              <h2 className="text-lg font-bold">
                {lang === 'hi' ? 'वैधानिक पंजीकरण एवं अनुपालन' : 'Legal Registration & Compliance'}
              </h2>
            </div>
            <dl className="divide-y divide-[#1B5A32]/10 text-xs sm:text-sm">
              {legalRows.map((slot) => (
                <div key={slot.label} className="py-2.5 flex justify-between gap-4">
                  <dt className="font-semibold text-[#144527]">{slot.label}</dt>
                  <dd className="text-[#44544A] text-right">{slot.value}</dd>
                </div>
              ))}
            </dl>
            <div className="pt-2 flex flex-wrap gap-2">
              <SpringButton variant="primary" size="sm" onClick={() => onNavigate('/partnership')}>
                <span>{lang === 'hi' ? 'CSR एवं सहयोग' : 'CSR & Partnership'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </SpringButton>
              <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/contact')}>
                <span>{lang === 'hi' ? 'संपर्क करें' : 'Contact Office'}</span>
              </SpringButton>
            </div>
          </div>
        </div>

        {/* Confirmed Leadership Roster OR Institutional Confirmation Notice */}
        {confirmedLeadership.length > 0 ? (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#368737]" />
                <h2 className="text-xl font-bold text-[#144527]">
                  {lang === 'hi'
                    ? 'अधिकृत नेतृत्व एवं सलाहकार मंडल'
                    : 'Confirmed Leadership & Advisory Roster'}
                </h2>
              </div>
              <span className="text-xs text-[#44544A]">
                {lang === 'hi'
                  ? 'केवल औपचारिक रूप से सत्यापित पदाधिकारी प्रकाशित'
                  : 'Only formally confirmed office bearers & advisors published'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {confirmedLeadership.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-5 flex items-start gap-4"
                >
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-16 h-16 rounded-xl object-cover border border-[#1B5A32]/15 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#E8F2E6] text-[#144527] font-bold flex items-center justify-center shrink-0 text-lg">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#1B5A32]/15 text-[#368737]">
                      {member.category === 'Advisory'
                        ? lang === 'hi'
                          ? 'सलाहकार मंडल'
                          : 'Advisory Board'
                        : lang === 'hi'
                        ? 'नेतृत्व / टीम'
                        : 'Leadership'}
                    </span>
                    <h3 className="text-sm font-bold text-[#144527]">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#368737]">
                      {lang === 'hi' ? member.roleHi || member.roleEn : member.roleEn || member.roleHi}
                    </p>
                    {(member.bioEn || member.bioHi) && (
                      <p className="text-xs text-[#44544A] leading-relaxed">
                        {lang === 'hi' ? member.bioHi || member.bioEn : member.bioEn || member.bioHi}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: { hi: 'नेतृत्व एवं टीम', en: 'Leadership & Team' },
                body: {
                  hi: 'केवल अधिकृत एवं औपचारिक रूप से पुष्टि किए गए पदाधिकारियों के नाम, पदनाम व प्रोफाइल ही यहाँ प्रकाशित किए जाएंगे।',
                  en: 'Only formally confirmed and authorised office bearers will appear in the public leadership roster.',
                },
              },
              {
                title: { hi: 'सलाहकार मंडल (Advisory Board)', en: 'Advisory Board' },
                body: {
                  hi: 'कृषि, जलवायु, गौशाला प्रबंधन, शिक्षा और सामाजिक कल्याण से जुड़े विशेषज्ञ सलाहकार मंडल का गठन प्रगति पर है।',
                  en: 'Specialist advisors across agronomy, climate science, Gaushala care, and education are confirmed upon formal consent.',
                },
              },
              {
                title: { hi: 'वार्षिक रिपोर्ट एवं पारदर्शिता', en: 'Annual Reports & Transparency' },
                body: {
                  hi: 'वार्षिक गतिविधि रिपोर्ट, अंकेक्षित वित्तीय विवरण और सार्वजनिक दस्तावेज़ प्रत्येक चक्र पूर्ण होने पर उपलब्ध कराए जाएंगे।',
                  en: 'Annual activity reports, audited statements, and public compliance filings are published upon completion of each cycle.',
                },
              },
            ].map((box) => (
              <div key={box.title.en} className="rounded-2xl border border-[#1B5A32]/15 bg-white p-5 space-y-2">
                <FileText className="w-5 h-5 text-[#368737]" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#144527]">{box.title[lang]}</h3>
                <p className="text-xs text-[#44544A] leading-relaxed">{box.body[lang]}</p>
              </div>
            ))}
          </section>
        )}

        {/* Public Annual Reports & Compliance PDFs (Synced with Admin Site Governance) */}
        <section id="annual-reports" className="rounded-3xl border border-[#1B5A32]/15 bg-[#FBFAF6] p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E6] text-[#154A24] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#144527]">
                  {lang === 'hi'
                    ? 'वार्षिक रिपोर्ट एवं सार्वजनिक दस्तावेज़ (Annual Reports)'
                    : 'Annual Reports & Public Governance Documents'}
                </h2>
                <p className="text-xs text-[#4C5F52]">
                  {lang === 'hi'
                    ? 'एडमिन कंसोल द्वारा प्रकाशित सत्यापित PDF रिपोर्ट यहाँ सीधे डाउनलोड के लिए उपलब्ध हैं।'
                    : 'Verified PDF reports uploaded via the Governance Console appear here immediately for public download.'}
                </p>
              </div>
            </div>
          </div>

          {(() => {
            const publishedReports = (gov?.annualReports ?? []).filter(
              (r) => r.isPublished !== false && r.pdfUrl?.trim()
            );
            if (publishedReports.length === 0) {
              return (
                <div className="rounded-2xl bg-white border border-[#E5DEC8] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#144527]">
                      {lang === 'hi'
                        ? 'प्रथम वार्षिक रिपोर्ट चक्र प्रकाशन हेतु तैयार किया जा रहा है'
                        : 'First Annual Transparency Cycle Under Compilation'}
                    </p>
                    <p className="text-xs text-[#44544A] leading-relaxed">
                      {lang === 'hi'
                        ? 'वित्तीय वर्ष पूर्ण होने पर अंकेक्षित वार्षिक रिपोर्ट व गतिविधि PDF यहाँ अपलोड एवं प्रकाशित किए जाएंगे।'
                        : 'Audited annual activity reports and compliance filings will appear here as downloadable PDFs upon completion of each fiscal cycle.'}
                    </p>
                  </div>
                  <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/partnership')}>
                    <span>{lang === 'hi' ? 'CSR दस्तावेज़ अनुरोध' : 'Request CSR Dossier'}</span>
                  </SpringButton>
                </div>
              );
            }
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publishedReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="rounded-2xl bg-white border border-[#DFD8C5] p-5 flex flex-col justify-between gap-4 hover:border-[#4BA348] transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EAF4E6] text-[#154A24] text-[11px] font-bold">
                          {rep.fiscalYear || 'FY 2025-26'}
                        </span>
                        <span className="text-[10.5px] font-semibold text-[#5A7B3B]">
                          {rep.docCategory}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#144527] leading-snug">
                        {lang === 'hi' ? rep.titleHi || rep.titleEn : rep.titleEn || rep.titleHi}
                      </h3>
                      {rep.publishedDate && (
                        <p className="text-[11px] text-[#5B6E60]">
                          {lang === 'hi' ? 'प्रकाशन तिथि:' : 'Published:'} {rep.publishedDate}
                        </p>
                      )}
                    </div>
                    <a
                      href={rep.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#154A24] hover:bg-[#0F361A] text-white px-4 py-2.5 text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'PDF डाउनलोड / पढ़ें' : 'Download / View PDF'}</span>
                    </a>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      </div>
    </div>
  );
}

interface ProjectsPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

interface ExtendedProjectView {
  id: string;
  title: { hi: string; en: string };
  location: { hi: string; en: string };
  missionCategory: { hi: string; en: string };
  status: 'Proposed' | 'Under Assessment' | 'Approved' | 'Ongoing' | 'Completed';
  objectives: { hi: string; en: string };
  beneficiaryCategory: { hi: string; en: string };
  note: { hi: string; en: string };
  startDate?: string;
  progressPeriod?: string;
  imageUrl?: string;
  reportUrl?: string;
  partnerName?: string;
}

export function ProjectsPage({ lang, onNavigate }: ProjectsPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { bootstrap } = usePublicPortal();

  const liveProjects: ExtendedProjectView[] =
    bootstrap?.projects && bootstrap.projects.length > 0
      ? bootstrap.projects.map((p) => ({
          id: p.id,
          title: { hi: p.titleHi, en: p.titleEn },
          location: { hi: p.locationHi, en: p.locationEn },
          missionCategory: { hi: p.missionCategoryHi, en: p.missionCategoryEn },
          status: p.status,
          objectives: { hi: p.objectivesHi, en: p.objectivesEn },
          beneficiaryCategory: { hi: p.beneficiaryHi, en: p.beneficiaryEn },
          note: { hi: p.noteHi, en: p.noteEn },
          startDate: p.startDate,
          progressPeriod: p.progressPeriod,
          imageUrl: p.imageUrl,
          reportUrl: p.reportUrl,
          // Backend already blanks partnerName unless partnerConfirmedForPublic is true
          partnerName: p.partnerConfirmedForPublic ? p.partnerName : '',
        }))
      : PROJECTS_DATA;

  const publishedMetrics = (bootstrap?.impactMetrics ?? []).filter(
    (m) => m.isPublished
  );

  const filtered =
    statusFilter === 'All'
      ? liveProjects
      : liveProjects.filter((p) => p.status === statusFilter);

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={lang === 'hi' ? 'परियोजनाएँ एवं प्रभाव' : 'Projects & Impact'}
        title={lang === 'hi' ? 'परियोजना पोर्टफोलियो एवं सत्यापित डैशबोर्ड' : 'Projects Portfolio & Verified Impact'}
        subtitle={
          lang === 'hi'
            ? 'स्पष्ट स्थिति: प्रस्तावित (Proposed), मूल्यांकनाधीन (Under Assessment), स्वीकृत (Approved), चालू (Ongoing) या पूर्ण (Completed)।'
            : 'Transparent status classification. Unstarted or proposed initiatives are strictly never presented as completed achievements.'
        }
        iconName="CloudSun"
        variant="carbon"
        assetKey="organicAgroforestry"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {publishedMetrics.length > 0 && (
          <section className="rounded-2xl border border-[#1B5A32]/15 bg-[#F4F8F3] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#144527]">
                {lang === 'hi'
                  ? 'सत्यापित सार्वजनिक प्रगति आँकड़े'
                  : 'Verified Public Impact Counters'}
              </h2>
              <span className="text-[11px] text-[#44544A]">
                {lang === 'hi'
                  ? 'केवल ऑडिट व सत्यापित आँकड़े प्रकाशित'
                  : 'Only audited & published figures displayed'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {publishedMetrics.map((m) => (
                <div
                  key={m.metricKey}
                  className="rounded-xl bg-white border border-[#1B5A32]/12 p-3.5"
                >
                  <p className="text-xl font-bold text-[#144527] tabular-nums">
                    {m.verifiedValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] font-semibold text-[#1E2923] mt-0.5 leading-snug">
                    {lang === 'hi' ? m.labelHi : m.labelEn}
                  </p>
                  <p className="text-[10px] text-[#5B6B60] mt-1">{m.unitLabel}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Proposed', 'Under Assessment', 'Approved', 'Ongoing', 'Completed'].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === st
                    ? 'bg-[#1B5A32] text-white'
                    : 'bg-[#F4F8F3] text-[#144527] hover:bg-[#E8F2E6]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        {/* Projects List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-8 text-center text-sm text-[#44544A]">
            {lang === 'hi'
              ? `"${statusFilter}" श्रेणी में अभी कोई प्रकाशित परियोजना नहीं है। केवल सत्यापित व सक्रिय स्थिति ही दिखाई जाती है।`
              : `No projects are currently listed under "${statusFilter}". Only verified and active statuses are displayed.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] overflow-hidden flex flex-col justify-between"
              >
                {proj.imageUrl && (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title[lang]}
                    className="w-full h-44 object-cover border-b border-[#1B5A32]/10"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#368737] inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {proj.location[lang]}
                      </span>
                      <span className="font-bold text-[#144527] bg-white px-2.5 py-0.5 rounded-md border border-[#1B5A32]/20">
                        {proj.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#144527]">{proj.title[lang]}</h2>
                    <p className="text-xs font-medium text-[#368737]">{proj.missionCategory[lang]}</p>
                    <p className="text-sm text-[#2A3A30] leading-relaxed">{proj.objectives[lang]}</p>

                    {(proj.startDate || proj.progressPeriod || proj.partnerName) && (
                      <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#44544A]">
                        {proj.startDate && (
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#1B5A32]/10">
                            <Calendar className="w-3 h-3 text-[#368737]" />
                            {lang === 'hi' ? 'प्रारंभ:' : 'Start:'} {proj.startDate}
                          </span>
                        )}
                        {proj.progressPeriod && (
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#1B5A32]/10">
                            {lang === 'hi' ? 'प्रगति अवधि:' : 'Period:'} {proj.progressPeriod}
                          </span>
                        )}
                        {proj.partnerName && (
                          <span className="inline-flex items-center gap-1 bg-[#E8F2E6] text-[#144527] font-semibold px-2.5 py-1 rounded-md">
                            <Building2 className="w-3 h-3 text-[#368737]" />
                            {lang === 'hi' ? 'सहयोगी:' : 'Partner:'} {proj.partnerName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#1B5A32]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-[#44544A]">{proj.note[lang]}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {proj.reportUrl && (
                        <a
                          href={proj.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1B5A32]/20 text-[#144527] font-semibold hover:bg-[#E8F2E6]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'रिपोर्ट PDF' : 'Report PDF'}</span>
                        </a>
                      )}
                      <SpringButton
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('/partnership')}
                      >
                        <span>{lang === 'hi' ? 'सहयोग पूछताछ' : 'Partner Inquiry'}</span>
                      </SpringButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

