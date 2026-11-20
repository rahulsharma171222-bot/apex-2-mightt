import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  FileText,
  GitBranch,
  HelpCircle,
  MapPin,
  Recycle,
  ShieldCheck,
} from 'lucide-react';
import { usePublicPortal } from '../context/PublicPortalContext';
import { filterUnifiedProgrammes, summarizeWasteRecords } from '../utils/adminLogic';
import type { Language } from '../types/goveda';

interface LiveMissionCmsBlockProps {
  missionSlug: string;
  lang: Language;
  onNavigate: (path: string) => void;
  showWasteDashboard?: boolean;
  hideProgrammes?: boolean;
}

export function LiveMissionCmsBlock({
  missionSlug,
  lang,
  onNavigate,
  showWasteDashboard = false,
  hideProgrammes = false,
}: LiveMissionCmsBlockProps) {
  const { bootstrap } = usePublicPortal();

  const missionConfig = (bootstrap?.missionConfigs ?? []).find(
    (m) => m.slug === missionSlug && m.status === 'Published'
  );

  // Match published static subpages linked to this mission
  const relatedSubpages = (bootstrap?.staticPages ?? []).filter((pg) => {
    if (pg.status !== 'Published') return false;
    const parent = (pg.parentPath || '').toLowerCase();
    if (missionSlug === 'clean-india') return parent.includes('clean india') || parent.includes('waste');
    if (missionSlug === 'harit-rajasthan') return parent.includes('harit rajasthan') || parent.includes('location');
    if (missionSlug === 'carbon-climate') return parent.includes('carbon');
    if (missionSlug === 'atmanirbhar-gaushala') return parent.includes('gaushala');
    if (missionSlug === 'swachh-urja') return parent.includes('energy') || parent.includes('biogas');
    if (missionSlug === 'organic-farming') return parent.includes('organic') || parent.includes('agri');
    if (missionSlug === 'skill-development') return parent.includes('skill');
    if (missionSlug === 'women-empowerment') return parent.includes('women');
    if (missionSlug === 'senior-care-mental-health') return parent.includes('senior');
    if (missionSlug === 'heritage-water') return parent.includes('heritage') || parent.includes('water');
    return false;
  });

  const publicWasteRecords = showWasteDashboard ? bootstrap?.wasteRecords ?? [] : [];
  const activeWastePartners = showWasteDashboard ? bootstrap?.wastePartners ?? [] : [];
  const wasteSummary = summarizeWasteRecords(publicWasteRecords);

  const missionProgrammes = hideProgrammes
    ? []
    : filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
        missionSlug,
        onlyPublished: true,
      });

  if (
    !missionConfig &&
    relatedSubpages.length === 0 &&
    missionProgrammes.length === 0 &&
    (!showWasteDashboard || (publicWasteRecords.length === 0 && activeWastePartners.length === 0))
  ) {
    return null;
  }

  return (
    <section className="bg-[#F4F8F4] border-t border-[#DCE7DE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Live Mission Programme Scope & Subsections from Admin CMS */}
        {missionConfig && (
          <div className="bg-white rounded-3xl border border-[#DCE7DE] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAF1EB] pb-5">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'hi'
                      ? `मिशन #${String(missionConfig.number).padStart(2, '0')} • आधिकारिक कार्यक्रम विवरण`
                      : `Mission #${String(missionConfig.number).padStart(2, '0')} • Official Programme Overview`}
                  </span>
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#113B19]">
                  {lang === 'hi'
                    ? missionConfig.titleHi || missionConfig.titleEn
                    : missionConfig.titleEn}
                </h2>
                <p className="text-sm text-[#43584B] max-w-3xl leading-relaxed">
                  {lang === 'hi'
                    ? missionConfig.introHi || missionConfig.introEn
                    : missionConfig.introEn}
                </p>
              </div>
              {missionConfig.linkedFormType && (
                <button
                  type="button"
                  onClick={() => onNavigate(`/join/${missionConfig.linkedFormType}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#144527] text-white text-xs font-bold hover:bg-[#1B5A32] transition-colors cursor-pointer shrink-0 self-start md:self-auto"
                >
                  <span>
                    {lang === 'hi' ? 'इस मिशन से जुड़ें' : 'Join This Mission'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {(() => {
              const CMS_HI_LABELS: Record<string, string> = {
                'Wet Waste': 'गीला कचरा (जैविक)',
                'Dry Waste': 'सूखा कचरा (पुनर्चक्रण योग्य)',
                'Sanitary Waste': 'सैनिटरी कचरा (पृथक संग्रहण)',
                'Special-Care Waste': 'विशेष देखभाल कचरा',
                'Plastic-Free Initiatives': 'प्लास्टिक-मुक्त पहल',
                'Cloth & Jute Bag Initiative': 'कपड़ा एवं जूट थैला पहल',
                'Temple Waste Management': 'मंदिर परिसर कचरा प्रबंधन',
                'Clean Village & Clean City': 'स्वच्छ ग्राम एवं स्वच्छ शहर',
                'Plastic-Free Market pledges': 'प्लास्टिक-मुक्त बाज़ार संकल्प अभियान',
                'School segregation awareness drives': 'विद्यालयों में 4-श्रेणी कचरा पृथक्करण जागरूकता',
                'Authorised recycler handover tracking': 'अधिकृत रीसाइक्लर को कचरा हस्तांतरण रिकॉर्ड',
                'Temple floral composting units': 'मंदिर पुष्प कम्पोस्टिंग इकाइयाँ',
                'Women SHG cloth bag workshops': 'महिला SHG कपड़ा व जूट थैला कार्यशालाएँ',
                'Solar micro-installations': 'सौर ऊर्जा लघु इकाइयाँ',
                'Biogas & CBG awareness': 'बायोगैस एवं CBG जागरूकता',
                'Rural Skill & Livelihood Workshops': 'ग्रामीण कौशल एवं आजीविका कार्यशालाएँ',
              };
              const localizeItem = (raw: string) =>
                lang === 'hi' ? CMS_HI_LABELS[raw.trim()] || raw : raw;

              return (
                <div className="space-y-7">
                  {/* Modular Architectural Focus Pillar Matrix (Zero vertical checklist!) */}
                  {missionConfig.subsections.length > 0 && (
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#113B19]">
                          {lang === 'hi' ? 'प्रमुख उप-विभाग एवं फोकस क्षेत्र' : 'Key Subsections & Focus Pillars'}
                        </h3>
                        <span className="text-[11px] font-semibold text-[#55685C] tabular-nums">
                          {lang === 'hi'
                            ? `${missionConfig.subsections.length} कार्य-स्तंभ`
                            : `${missionConfig.subsections.length} Core Pillars`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {missionConfig.subsections.map((sub, idx) => (
                          <div
                            key={idx}
                            className="group relative rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] hover:border-[#2E7D32]/50 p-4 flex flex-col justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-extrabold text-[#17834D] tabular-nums">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="h-1 w-6 rounded-full bg-[#DCE7DE] group-hover:bg-[#17834D] transition-colors" aria-hidden="true" />
                            </div>
                            <p className={`text-xs sm:text-[13px] font-extrabold text-[#123D2A] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                              {localizeItem(sub)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Horizontal Stage-by-Stage Action Roadmap Cards */}
                  {missionConfig.proposedActivities.length > 0 && (
                    <div className="space-y-3.5 pt-5 border-t border-[#EAF1EB]">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#113B19]">
                          {lang === 'hi'
                            ? 'प्रस्तावित एवं सक्रिय क्षेत्रीय गतिविधियाँ'
                            : 'Proposed & Active Field Activities'}
                        </h3>
                        <span className="text-[11px] font-semibold text-[#55685C]">
                          {lang === 'hi' ? 'चरणबद्ध क्रियान्वयन रूपरेखा' : 'Structured Field Roadmap'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                        {missionConfig.proposedActivities.map((act, idx) => {
                          const isOddLast =
                            missionConfig.proposedActivities.length % 2 === 1 &&
                            idx === missionConfig.proposedActivities.length - 1;
                          return (
                            <div
                              key={idx}
                              className={`rounded-2xl bg-[#F4F8F4] border border-[#DCE7DE] p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 ${
                                isOddLast ? 'col-span-2 lg:col-span-1' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#17834D] tabular-nums">
                                  {lang === 'hi'
                                    ? `गतिविधि ${String(idx + 1).padStart(2, '0')}`
                                    : `Action ${String(idx + 1).padStart(2, '0')}`}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#8A6548] shrink-0" aria-hidden="true" />
                              </div>
                              <p className={`text-xs sm:text-[13px] font-bold text-[#123D2A] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                                {localizeItem(act)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Live Admin FAQs */}
            {missionConfig.faqs.length > 0 && (
              <div className="pt-4 border-t border-[#EAF1EB] space-y-3">
                <h3 className="text-sm font-bold text-[#144527] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#2E7D32]" />
                  <span>
                    {lang === 'hi' ? 'अतिरिक्त आधिकारिक प्रश्नोत्तर' : 'Official Programme FAQs'}
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {missionConfig.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-[#FAFBF8] border border-[#E5ECE6] p-4 space-y-1.5"
                    >
                      <p className="text-xs font-bold text-[#144527]">{faq.q}</p>
                      <p className="text-xs text-[#4C6556] leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verified Waste Management Public Ledger (Clean India Only) */}
        {showWasteDashboard &&
          (publicWasteRecords.length > 0 || activeWastePartners.length > 0) && (
            <div className="bg-white rounded-3xl border border-[#DCE7DE] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAF1EB] pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
                    <Recycle className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'hi'
                        ? 'सत्यापित स्वच्छ भारत कचरा प्रबंधन रिकॉर्ड'
                        : 'Verified Clean India Waste Ledger'}
                    </span>
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#113B19] mt-0.5">
                    {lang === 'hi'
                      ? 'धरातल पर सत्यापित कचरा संग्रहण एवं अधिकृत रीसाइक्लिंग साझेदार'
                      : 'Ground-Verified Waste Handling & Authorised Recycling Partners'}
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-[#4C6556]">
                  {lang === 'hi'
                    ? 'केवल सत्यापित तौल रिकॉर्ड शामिल'
                    : 'Only verified weighment drives counted'}
                </span>
              </div>

              {/* Verified KPI Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="rounded-2xl bg-[#F4F9F4] border border-[#DCEAE0] p-4">
                  <p className="text-[11px] font-semibold text-[#4C6556]">
                    {lang === 'hi' ? 'सत्यापित कचरा प्रबंधन' : 'Verified Waste Handled'}
                  </p>
                  <p className="text-2xl font-extrabold text-[#144527] mt-1 tabular-nums">
                    {wasteSummary.verifiedTotalKg.toLocaleString('en-IN')} kg
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FAFBF8] border border-[#E5ECE6] p-4">
                  <p className="text-[11px] font-semibold text-[#4C6556]">
                    {lang === 'hi' ? 'सत्यापित अभियान' : 'Verified Field Drives'}
                  </p>
                  <p className="text-2xl font-extrabold text-[#144527] mt-1 tabular-nums">
                    {wasteSummary.verifiedRecordsCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FAFBF8] border border-[#E5ECE6] p-4">
                  <p className="text-[11px] font-semibold text-[#4C6556]">
                    {lang === 'hi' ? 'सहभागी परिवार / दुकानें' : 'Households & Shops Reached'}
                  </p>
                  <p className="text-2xl font-extrabold text-[#144527] mt-1 tabular-nums">
                    {wasteSummary.verifiedHouseholds.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FAFBF8] border border-[#E5ECE6] p-4">
                  <p className="text-[11px] font-semibold text-[#4C6556]">
                    {lang === 'hi' ? 'अधिकृत साझेदार इकाइयाँ' : 'Authorised Partners'}
                  </p>
                  <p className="text-2xl font-extrabold text-[#144527] mt-1 tabular-nums">
                    {activeWastePartners.length}
                  </p>
                </div>
              </div>

              {/* Verified Drives + Active Partners */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {publicWasteRecords.length > 0 && (
                  <div className="lg:col-span-7 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#55685C]">
                      {lang === 'hi' ? 'हाल के सत्यापित अभियान' : 'Verified Collection & Composting Drives'}
                    </h4>
                    <div className="space-y-2">
                      {publicWasteRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className="rounded-2xl border border-[#E5ECE6] bg-[#FAFBF8] p-3.5 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#144527]">{rec.title}</p>
                            <p className="text-[11px] text-[#55685C]">
                              {rec.locationName} · {rec.district}, {rec.stateName} · {rec.activityDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-[#144527] tabular-nums">
                              {rec.quantity} {rec.unit}
                            </p>
                            <p className="text-[10.5px] font-semibold text-emerald-700">
                              {rec.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeWastePartners.length > 0 && (
                  <div className="lg:col-span-5 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#55685C]">
                      {lang === 'hi'
                        ? 'अधिकृत रीसाइक्लिंग एवं महिला SHG साझेदार'
                        : 'Authorised Recyclers & SHG Units'}
                    </h4>
                    <div className="space-y-2">
                      {activeWastePartners.map((partner) => (
                        <div
                          key={partner.id}
                          className="rounded-2xl border border-[#E5ECE6] bg-[#F7FBF7] p-3.5 flex items-start gap-2.5"
                        >
                          <Building2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-[#144527]">{partner.name}</p>
                            <p className="text-[11px] text-[#55685C]">
                              {partner.partnerType} · {partner.district}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Live Unified Programmes grouped cleanly by Type (auto-hides empty subsections!) */}
        {missionProgrammes.length > 0 && (() => {
          const groupedSections = [
            {
              key: 'project',
              titleHi: 'इस मिशन के अंतर्गत परियोजनाएँ',
              titleEn: 'Projects under this mission',
              items: missionProgrammes.filter((p) => p.type === 'project'),
            },
            {
              key: 'campaign',
              titleHi: 'इस मिशन के अंतर्गत अभियान',
              titleEn: 'Campaigns under this mission',
              items: missionProgrammes.filter((p) => p.type === 'campaign'),
            },
            {
              key: 'event',
              titleHi: 'आगामी कार्यक्रम एवं शिविर',
              titleEn: 'Upcoming events',
              items: missionProgrammes.filter((p) => p.type === 'event'),
            },
            {
              key: 'training',
              titleHi: 'प्रशिक्षण कार्यक्रम',
              titleEn: 'Training programmes',
              items: missionProgrammes.filter((p) => p.type === 'training'),
            },
          ].filter((grp) => grp.items.length > 0);

          const FORM_CTA_LABEL: Record<string, { hi: string; en: string }> = {
            farmer: { hi: 'किसान सहभागिता', en: 'Farmer Participation' },
            'harit-mitra': { hi: 'हरित मित्र बनें', en: 'Join as Harit Mitra' },
            volunteer: { hi: 'स्वयंसेवक बनें', en: 'Join as Volunteer' },
            'school-college': { hi: 'संस्थान पंजीकरण', en: 'Register Institution' },
            gaushala: { hi: 'गौशाला साझेदारी', en: 'Gaushala Partner' },
            'women-shg': { hi: 'महिला SHG जुड़ें', en: 'Women SHG Join' },
            'skill-training': { hi: 'प्रशिक्षण पंजीकरण', en: 'Apply for Training' },
            'csr-partner': { hi: 'CSR सहयोग', en: 'CSR Partner' },
          };

          return (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE7DE] pb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#2E7D32]" />
                  <h3 className="text-base sm:text-lg font-extrabold text-[#113B19]">
                    {lang === 'hi'
                      ? 'संबंधित परियोजनाएँ, अभियान एवं कार्यक्रम'
                      : 'Related Projects, Campaigns & Events'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/projects')}
                  className="text-xs font-bold text-[#144527] hover:underline cursor-pointer"
                >
                  {lang === 'hi' ? 'सभी परियोजनाएँ व अभियान देखें →' : 'View All Projects & Campaigns →'}
                </button>
              </div>

              {groupedSections.map((group) => (
                <div key={group.key} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#2E6F36]">
                    {lang === 'hi' ? group.titleHi : group.titleEn} ({group.items.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map((prg) => {
                      const cover =
                        prg.media.find((m) => m.isCover && m.url) ??
                        prg.media.find((m) => m.mediaType === 'photo' && m.url);
                      const locLabel =
                        prg.coverageScope === 'india-wide'
                          ? lang === 'hi'
                            ? `संपूर्ण भारत (${prg.locations.length} केंद्र)`
                            : `India-Wide (${prg.locations.length} hubs)`
                          : prg.locations
                              .slice(0, 2)
                              .map((l) =>
                                l.localityName
                                  ? `${l.localityName}, ${l.district}`
                                  : `${l.district}, ${l.stateName}`
                              )
                              .join(' · ');
                      const firstDistrict = prg.locations[0]?.district || 'Bhilwara';
                      const formsToAttach =
                        prg.linkedFormTypes && prg.linkedFormTypes.length > 0
                          ? prg.linkedFormTypes
                          : [prg.linkedFormType || 'volunteer'];

                      return (
                        <article
                          key={prg.id}
                          className="bg-white rounded-2xl border border-[#DCE7DE] overflow-hidden flex flex-col justify-between shadow-xs"
                        >
                          <div>
                            {cover && (
                              <img
                                src={cover.url}
                                alt={cover.altText || prg.titleEn}
                                referrerPolicy="no-referrer"
                                className="w-full h-36 object-cover border-b border-[#EAF1EB]"
                              />
                            )}
                            <div className="p-4 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                                <span className="font-bold text-[#144527] uppercase tracking-wide">
                                  {prg.type} · {prg.operationalStatus}
                                </span>
                                <span className="font-mono text-[10.5px] text-[#55685C]">
                                  {prg.programmeCode}
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-[#144527] leading-snug">
                                {lang === 'hi' ? prg.titleHi || prg.titleEn : prg.titleEn}
                              </h5>
                              <p className="text-xs text-[#4C6556] leading-relaxed line-clamp-3">
                                {lang === 'hi' ? prg.summaryHi || prg.summaryEn : prg.summaryEn}
                              </p>
                              <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#55685C]">
                                {locLabel && (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#2E7D32]" />
                                    {locLabel}
                                  </span>
                                )}
                                {prg.startDate && (
                                  <span className="inline-flex items-center gap-1 font-mono">
                                    <Calendar className="w-3 h-3 text-[#2E7D32]" />
                                    {prg.startDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-3 border-t border-[#EAF1EB] bg-[#FAFDF9] flex flex-wrap items-center gap-2">
                            {formsToAttach.slice(0, 2).map((formKey) => {
                              const labelObj = FORM_CTA_LABEL[formKey];
                              const registerUrl = `/join/${encodeURIComponent(
                                formKey
                              )}?campaign=${encodeURIComponent(
                                prg.programmeCode
                              )}&campaignTitle=${encodeURIComponent(
                                prg.titleEn
                              )}&district=${encodeURIComponent(firstDistrict)}`;
                              return (
                                <button
                                  key={formKey}
                                  type="button"
                                  onClick={() => onNavigate(registerUrl)}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-[#144527] hover:text-[#2E7D32] cursor-pointer"
                                >
                                  <span>
                                    {labelObj
                                      ? labelObj[lang]
                                      : lang === 'hi'
                                      ? 'सहभागी बनें'
                                      : 'Register'}
                                  </span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              );
                            })}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Linked Published Static Subpages from Admin Pages & Navigation */}
        {relatedSubpages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2E7D32]" />
              <h3 className="text-base font-bold text-[#144527]">
                {lang === 'hi'
                  ? 'संबंधित दिशानिर्देश एवं प्रकाशित उप-पृष्ठ'
                  : 'Related Guidelines & Published Subpages'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedSubpages.map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => onNavigate(`/pages/${pg.slug}`)}
                  className="text-left bg-white rounded-2xl border border-[#DCE7DE] hover:border-[#368737]/50 p-5 transition-all hover:-translate-y-0.5 shadow-xs cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2E7D32]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{pg.parentPath}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#144527]">
                      {lang === 'hi' ? pg.titleHi || pg.titleEn : pg.titleEn}
                    </h4>
                    <p className="text-xs text-[#55685C] leading-relaxed line-clamp-2">
                      {lang === 'hi' ? pg.summaryHi || pg.summaryEn : pg.summaryEn}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#144527]">
                    <span>{lang === 'hi' ? 'विस्तृत मार्गदर्शिका पढ़ें' : 'Read Full Guide'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
