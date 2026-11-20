import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sprout,
  Trees,
  Trophy,
  Users,
} from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import { RajasthanMap } from '../components/RajasthanMap';
import { RegistrationPortal } from '../components/RegistrationForms';
import { usePublicPortal } from '../context/PublicPortalContext';
import { mergePublicDistricts } from '../utils/publicDataBridge';
import { filterUnifiedProgrammes } from '../utils/adminLogic';
import {
  INDIA_STATES_DIRECTORY,
  getCitiesAndGramsForDistrict,
} from '../data/indiaLocations';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface HaritRajasthanGeographicPageProps {
  lang: Language;
  districtSlug?: string;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

type DistrictTabKey =
  | 'overview'
  | 'projects'
  | 'campaigns'
  | 'villages'
  | 'green-campus'
  | 'harit-mitra'
  | 'events'
  | 'progress'
  | 'gallery'
  | 'join';

const DISTRICT_TABS: { key: DistrictTabKey; hi: string; en: string }[] = [
  { key: 'overview', hi: 'परिचय', en: 'Overview' },
  { key: 'projects', hi: 'परियोजनाएँ', en: 'Projects' },
  { key: 'campaigns', hi: 'अभियान', en: 'Campaigns' },
  { key: 'villages', hi: 'ग्राम व तहसील', en: 'Villages' },
  { key: 'green-campus', hi: 'ग्रीन कैंपस', en: 'Green Campus' },
  { key: 'harit-mitra', hi: 'हरित मित्र', en: 'Harit Mitra' },
  { key: 'events', hi: 'कार्यक्रम', en: 'Events' },
  { key: 'progress', hi: 'प्रगति डैशबोर्ड', en: 'Progress' },
  { key: 'gallery', hi: 'गैलरी', en: 'Gallery' },
  { key: 'join', hi: 'जुड़ें', en: 'Join Us' },
];

const PROPOSED_CAMPAIGN_CATEGORIES = [
  { hi: 'ग्राम वृक्षारोपण अभियान', en: 'Village Plantation Drive' },
  { hi: 'किसान मेड़ एवं कृषि-वानिकी अभियान', en: 'Farmer Boundary Agroforestry Drive' },
  { hi: 'स्कूल एवं कॉलेज ग्रीन कैंपस अभियान', en: 'School & College Green Campus Drive' },
  { hi: 'प्लास्टिक-मुक्त ग्राम एवं बाज़ार अभियान', en: 'Plastic-Free Village & Market Campaign' },
  { hi: 'जल संरक्षण एवं तालाब पुनरुद्धार अभियान', en: 'Water Conservation & Pond Restoration' },
  { hi: 'हरित मित्र वृक्ष संरक्षण संकल्प अभियान', en: 'Harit Mitra Tree Stewardship Pledge' },
];

export function HaritRajasthanGeographicPage({
  lang,
  districtSlug,
  records,
  onAddRecord,
  onNavigate,
}: HaritRajasthanGeographicPageProps) {
  const { bootstrap } = usePublicPortal();

  const mergedDistricts = useMemo(
    () => mergePublicDistricts(bootstrap?.districts),
    [bootstrap?.districts]
  );

  const rajasthanDistricts = useMemo(
    () =>
      mergedDistricts.filter(
        (d) => !d.stateSlug || d.stateSlug === 'rajasthan'
      ),
    [mergedDistricts]
  );

  const all48RajasthanNames = useMemo(
    () =>
      INDIA_STATES_DIRECTORY.find((s) => s.slug === 'rajasthan')?.districts ?? [],
    []
  );

  const [selectedSlug, setSelectedSlug] = useState<string>(
    districtSlug || rajasthanDistricts[0]?.slug || 'bhilwara'
  );
  const [activeTab, setActiveTab] = useState<DistrictTabKey>('overview');
  const [districtSearch, setDistrictSearch] = useState('');
  const [showAll48, setShowAll48] = useState(false);

  // Sync if URL param districtSlug changes
  React.useEffect(() => {
    if (districtSlug) {
      setSelectedSlug(districtSlug);
      setActiveTab('overview');
    }
  }, [districtSlug]);

  const activeDistrict =
    rajasthanDistricts.find((d) => d.slug === selectedSlug) ??
    rajasthanDistricts[0];

  // Village drill-down state inside Villages tab
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');

  React.useEffect(() => {
    setSelectedCity('');
    setSelectedVillage('');
  }, [activeDistrict?.slug]);

  const districtProgrammes = useMemo(() => {
    if (!activeDistrict) return [];
    return filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
      stateName: 'Rajasthan',
      district: activeDistrict.name.en,
      onlyPublished: true,
    });
  }, [bootstrap?.programmes, activeDistrict]);

  const districtProjects = useMemo(
    () => districtProgrammes.filter((p) => p.type === 'project'),
    [districtProgrammes]
  );
  const districtCampaigns = useMemo(
    () => districtProgrammes.filter((p) => p.type === 'campaign'),
    [districtProgrammes]
  );
  const districtEventsFromHub = useMemo(
    () => districtProgrammes.filter((p) => p.type === 'event' || p.type === 'training'),
    [districtProgrammes]
  );
  const districtMarathonEvents = useMemo(
    () =>
      (bootstrap?.marathonEvents ?? []).filter(
        (ev) =>
          activeDistrict &&
          ev.district.toLowerCase() === activeDistrict.name.en.toLowerCase()
      ),
    [bootstrap?.marathonEvents, activeDistrict]
  );

  const cityGroups = useMemo(() => {
    if (!activeDistrict) return [];
    const progLocs = districtProgrammes
      .flatMap((p) => p.locations)
      .filter((l) => l.district.toLowerCase() === activeDistrict.name.en.toLowerCase())
      .map((l) => l.localityName)
      .filter(Boolean);
    return getCitiesAndGramsForDistrict(
      activeDistrict.name.en,
      activeDistrict.subDistricts ?? [],
      [...(activeDistrict.villages ?? []), ...progLocs]
    );
  }, [activeDistrict, districtProgrammes]);

  const selectedCityVillages = useMemo(() => {
    if (!selectedCity) return [];
    return cityGroups.find((g) => g.name === selectedCity)?.villages ?? [];
  }, [selectedCity, cityGroups]);

  // Approved Harit Mitra count for this district (never expose phone numbers)
  const approvedHaritMitraCount = useMemo(() => {
    if (!activeDistrict) return 0;
    return records.filter(
      (r) =>
        r.category === 'harit-mitra' &&
        r.district.toLowerCase() === activeDistrict.name.en.toLowerCase()
    ).length;
  }, [records, activeDistrict]);

  const districtGallery = useMemo(() => {
    const urls: { url: string; caption: string }[] = [];
    for (const u of activeDistrict?.galleryUrls ?? []) {
      if (u) urls.push({ url: u, caption: activeDistrict.name[lang] });
    }
    for (const prg of districtProgrammes) {
      for (const m of prg.media) {
        if (m.mediaType === 'photo' && m.isPublic && m.url) {
          urls.push({ url: m.url, caption: m.caption || m.title });
        }
      }
    }
    return urls;
  }, [activeDistrict, districtProgrammes, lang]);

  const filtered48Districts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase();
    if (!q) return all48RajasthanNames;
    return all48RajasthanNames.filter((name) => name.toLowerCase().includes(q));
  }, [all48RajasthanNames, districtSearch]);

  const [joinCategory, setJoinCategory] = useState<RegistrationCategory>('harit-mitra');

  const handleSelectDistrict = (slug: string) => {
    setSelectedSlug(slug);
    setActiveTab('overview');
    if (districtSlug) {
      onNavigate(`/harit-rajasthan/${slug}`);
    } else {
      const el = document.getElementById('district-workspace');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#FAF8F3] text-[#1C2720] min-h-screen">
      {/* =====================================================================
          HERO: GEOGRAPHIC PROGRAMME PLATFORM (DISTINCT FROM MISSION 02)
         ===================================================================== */}
      <section className="bg-white border-b border-[#E5DFD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                {districtSlug && (
                  <button
                    type="button"
                    onClick={() => onNavigate('/harit-rajasthan')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#144527] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {lang === 'hi'
                        ? 'सभी हरित राजस्थान जिलों पर वापस जाएँ'
                        : 'Back to All Harit Rajasthan Districts'}
                    </span>
                  </button>
                )}

                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#2E6F36]">
                  {lang === 'hi'
                    ? 'भौगोलिक कार्यक्रम प्लेटफ़ॉर्म · हरित राजस्थान से हरित भारत'
                    : 'Geographic Programme Platform · Harit Rajasthan to Harit Bharat'}
                </p>

                <h1
                  className={`text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#143D21] leading-[1.15] [text-wrap:balance] ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {districtSlug && activeDistrict
                    ? lang === 'hi'
                      ? `हरित ${activeDistrict.name.hi} | Green ${activeDistrict.name.en}`
                      : `Green ${activeDistrict.name.en} — Harit Rajasthan District Hub`
                    : lang === 'hi'
                    ? 'हरित राजस्थान — जिला, तहसील एवं ग्राम स्तरीय अभियान प्लेटफ़ॉर्म'
                    : 'Harit Rajasthan — District, Tehsil & Village Programme Platform'}
                </h1>

                <p className="text-base text-[#3B4A40] leading-relaxed max-w-2xl">
                  {lang === 'hi'
                    ? 'हमारा संकल्प – स्वच्छ गाँव, हरित शहर, जल संरक्षण और जनभागीदारी। यहाँ राजस्थान के 5 प्राथमिकता जिलों (भीलवाड़ा, चूरू, बीकानेर, फलोदी, जोधपुर) तथा विस्तार के लिए तैयार सभी 48 जिलों की स्थानीय परियोजनाएँ, अभियान, ग्राम विवरण और सहभागिता देखें।'
                    : 'Our resolve — clean villages, green cities, water conservation, and community participation. Explore Rajasthan’s 5 Phase-1 priority districts (Bhilwara, Churu, Bikaner, Phalodi, Jodhpur) and all 48 districts prepared for phased activation.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <SpringButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('/projects')}
                >
                  <span>
                    {lang === 'hi'
                      ? 'परियोजनाएँ व अभियान फ़िल्टर खोलें'
                      : 'Open Projects & Campaigns Filter'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </SpringButton>
                <SpringButton
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/missions/harit-rajasthan')}
                >
                  <span>
                    {lang === 'hi'
                      ? 'मिशन 02: वृक्षारोपण अवधारणा पढ़ें'
                      : 'Read Mission 02: Tree Plantation'}
                  </span>
                </SpringButton>
                <SpringButton
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/harit-bharat')}
                >
                  <span>
                    {lang === 'hi' ? 'हरित भारत (अन्य राज्य)' : 'Harit Bharat (Pan-India)'}
                  </span>
                </SpringButton>
              </div>
            </div>

            {/* Interactive Rajasthan Map Panel */}
            <div className="lg:col-span-5 rounded-2xl border border-[#E3DDD0] bg-[#FAF8F3] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#EAE4D7]">
                <span className="text-xs font-bold text-[#143D21]">
                  {lang === 'hi'
                    ? 'राजस्थान प्राथमिकता जिले मानचित्र'
                    : 'Rajasthan Priority Districts Map'}
                </span>
                <span className="text-[11px] text-[#5D6C62]">
                  {lang === 'hi' ? 'जिले पर क्लिक करें' : 'Click a district pin'}
                </span>
              </div>
              <div className="my-2">
                <RajasthanMap
                  lang={lang}
                  activeDistrictSlug={activeDistrict?.slug}
                  onSelectDistrict={handleSelectDistrict}
                />
              </div>
            </div>
          </div>

          {/* 5 Priority District Quick Selector Strip + Searchable All 48 Rajasthan Districts */}
          <div className="pt-6 border-t border-[#ECE6DA] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#143D21] uppercase tracking-[0.08em]">
                  {lang === 'hi'
                    ? 'प्रथम चरण (Phase-1) के 5 प्राथमिकता जिले'
                    : 'Phase-1 Priority Districts (Active Hub Templates)'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAll48((v) => !v)}
                className="text-xs font-semibold text-[#144527] hover:underline cursor-pointer"
              >
                {showAll48
                  ? lang === 'hi'
                    ? 'सभी 48 जिलों की सूची छिपाएँ'
                    : 'Hide All 48 Rajasthan Districts'
                  : lang === 'hi'
                  ? `राजस्थान के सभी ${all48RajasthanNames.length} जिले देखें →`
                  : `Browse All ${all48RajasthanNames.length} Rajasthan Districts →`}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {rajasthanDistricts.map((d) => {
                const isSelected = activeDistrict?.slug === d.slug;
                return (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => handleSelectDistrict(d.slug)}
                    className={`text-left rounded-xl border px-4 py-3.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#143D21] text-white border-[#143D21]'
                        : 'bg-[#FAF8F3] text-[#143D21] border-[#E3DDD0] hover:border-[#2E6F36]'
                    }`}
                  >
                    <p className="text-[11px] font-medium opacity-80">
                      {d.regionTag[lang]}
                    </p>
                    <p className={`text-base font-bold mt-0.5 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                      {d.name[lang]}
                    </p>
                    <p className="text-[11px] mt-1 opacity-75">
                      {lang === 'hi' ? 'प्राथमिकता जिला' : 'Priority District'}
                    </p>
                  </button>
                );
              })}
            </div>

            {showAll48 && (
              <div className="rounded-2xl bg-[#FAF8F3] border border-[#E3DDD0] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#143D21]">
                      {lang === 'hi'
                        ? 'राजस्थान के सभी 48 जिले (चरणबद्ध विस्तार हेतु तैयार)'
                        : 'All 48 Rajasthan Districts (Ready for Phased Admin Activation)'}
                    </p>
                    <p className="text-[11px] text-[#5B695F]">
                      {lang === 'hi'
                        ? 'प्रथम चरण के जिलों के अतिरिक्त अन्य जिले एडमिन पैनल से सक्रिय किए जा सकते हैं।'
                        : 'Priority districts are live today; remaining districts can be activated anytime from Admin.'}
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#68756C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      placeholder={lang === 'hi' ? 'जिला खोजें...' : 'Search district...'}
                      className="w-full rounded-lg border border-[#D7D1C4] bg-white pl-8 pr-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
                  {filtered48Districts.map((distName) => {
                    const activeObj = rajasthanDistricts.find(
                      (rd) => rd.name.en.toLowerCase() === distName.toLowerCase()
                    );
                    if (activeObj) {
                      return (
                        <button
                          key={distName}
                          type="button"
                          onClick={() => handleSelectDistrict(activeObj.slug)}
                          className="text-left px-3 py-2 rounded-lg bg-[#E6F1E5] text-[#143D21] font-bold hover:bg-[#D5E9D3] cursor-pointer"
                        >
                          {distName} · {lang === 'hi' ? 'सक्रिय' : 'Active'}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={distName}
                        type="button"
                        onClick={() =>
                          onNavigate(`/join/harit-mitra?district=${encodeURIComponent(distName)}`)
                        }
                        className="text-left px-3 py-2 rounded-lg bg-white border border-[#E6E0D3] text-[#4C5B51] hover:border-[#2E6F36] cursor-pointer"
                      >
                        {distName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          UNIFIED 10-TAB DISTRICT WORKSPACE TEMPLATE
         ===================================================================== */}
      {activeDistrict && (
        <section id="district-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          {/* District Header + 10-Tab Strip */}
          <div className="bg-white rounded-2xl border border-[#E3DDD0] overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-[#EFEAE0] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
                  Rajasthan → {activeDistrict.name.en} · {activeDistrict.regionTag[lang]}
                </p>
                <h2 className={`text-2xl sm:text-3xl font-bold text-[#143D21] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
                  {lang === 'hi'
                    ? `हरित ${activeDistrict.name.hi} | Green ${activeDistrict.name.en}`
                    : `Harit ${activeDistrict.name.en} District Programme Hub`}
                </h2>
              </div>
              {!districtSlug && (
                <SpringButton
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(`/harit-rajasthan/${activeDistrict.slug}`)}
                >
                  <span>
                    {lang === 'hi' ? 'समर्पित जिला पृष्ठ खोलें' : 'Open Full District Page'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </SpringButton>
              )}
            </div>

            {/* 10-Tab Unified Template Navigation */}
            <div className="px-4 sm:px-6 py-3 bg-[#FAF8F3] border-b border-[#EFEAE0] flex items-center gap-1.5 overflow-x-auto">
              {DISTRICT_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === t.key
                      ? 'bg-[#143D21] text-white'
                      : 'text-[#44544A] hover:bg-white hover:text-[#143D21]'
                  }`}
                >
                  {lang === 'hi' ? t.hi : t.en}
                </button>
              ))}
            </div>

            {/* TAB CONTENT BODY */}
            <div className="p-6 sm:p-8">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#143D21]">
                        {lang === 'hi' ? 'जिला परिचय एवं प्रमुख उद्देश्य' : 'District Overview & Main Objectives'}
                      </h3>
                      <p className="text-sm text-[#3A473E] leading-relaxed">
                        {activeDistrict.focusSummary[lang]}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#2E6F36]">
                        {lang === 'hi' ? 'प्रस्तावित क्षेत्रीय प्राथमिकताएँ' : 'Planned Local Priorities'}
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeDistrict.campaigns.map((camp, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 rounded-xl bg-[#FAF8F3] border border-[#EAE4D7] p-3.5 text-xs text-[#243429]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#2E6F36] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{camp[lang]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-2xl bg-[#FAF8F3] border border-[#EAE4D7] p-5 space-y-3 text-xs">
                      <p className="font-bold text-[#143D21] uppercase tracking-[0.08em]">
                        {lang === 'hi' ? 'जिला समन्वय स्थिति' : 'District Coordination Status'}
                      </p>
                      <dl className="space-y-2 divide-y divide-[#ECE6DA]">
                        <div className="pt-2 flex justify-between gap-2">
                          <dt className="text-[#5C6B60]">{lang === 'hi' ? 'समन्वय डेस्क' : 'Desk'}</dt>
                          <dd className="font-semibold text-[#143D21] text-right">
                            {activeDistrict.coordinatorName || (lang === 'hi' ? 'प्रस्तावित जिला डेस्क' : 'District Coordination Desk')}
                          </dd>
                        </div>
                        <div className="pt-2 flex justify-between gap-2">
                          <dt className="text-[#5C6B60]">{lang === 'hi' ? 'प्रकाशित परियोजनाएँ' : 'Projects'}</dt>
                          <dd className="font-bold text-[#143D21] tabular-nums">{districtProjects.length}</dd>
                        </div>
                        <div className="pt-2 flex justify-between gap-2">
                          <dt className="text-[#5C6B60]">{lang === 'hi' ? 'प्रकाशित अभियान' : 'Campaigns'}</dt>
                          <dd className="font-bold text-[#143D21] tabular-nums">{districtCampaigns.length}</dd>
                        </div>
                        <div className="pt-2 flex justify-between gap-2">
                          <dt className="text-[#5C6B60]">{lang === 'hi' ? 'तहसील / ब्लॉक' : 'Tehsils / Cities'}</dt>
                          <dd className="font-bold text-[#143D21] tabular-nums">{cityGroups.length}</dd>
                        </div>
                      </dl>
                      {(lang === 'hi' ? activeDistrict.progressNotesHi : activeDistrict.progressNotesEn) && (
                        <p className="pt-2 text-[11.5px] text-[#4C5B51] leading-relaxed">
                          {lang === 'hi' ? activeDistrict.progressNotesHi : activeDistrict.progressNotesEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#143D21]">
                    {lang === 'hi'
                      ? `${activeDistrict.name.hi} की परियोजनाएँ (${districtProjects.length})`
                      : `Projects in ${activeDistrict.name.en} (${districtProjects.length})`}
                  </h3>
                  {districtProjects.length === 0 ? (
                    <div className="rounded-xl bg-[#FAF8F3] border border-[#EAE4D7] p-6 text-sm text-[#4C5B51]">
                      {lang === 'hi'
                        ? `${activeDistrict.name.hi} जिले में अभी कोई परियोजना प्रकाशित नहीं हुई है। एडमिन पैनल में नई परियोजना प्रकाशित करते ही यहाँ स्वतः दिखाई देगी।`
                        : `No projects have been published for ${activeDistrict.name.en} yet. Once published from the Admin Hub, they appear here automatically.`}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {districtProjects.map((prg) => (
                        <div
                          key={prg.id}
                          className="rounded-xl border border-[#E3DDD0] bg-[#FAF8F3] p-5 space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-[#144527]">{prg.operationalStatus}</span>
                            <span className="font-mono text-[#68756C]">{prg.programmeCode}</span>
                          </div>
                          <h4 className="text-base font-bold text-[#143D21]">
                            {lang === 'hi' ? prg.titleHi || prg.titleEn : prg.titleEn}
                          </h4>
                          <p className="text-xs text-[#435248] leading-relaxed">
                            {lang === 'hi' ? prg.summaryHi || prg.summaryEn : prg.summaryEn}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              onNavigate(
                                `/join/${encodeURIComponent(
                                  prg.linkedFormType || 'farmer'
                                )}?campaign=${encodeURIComponent(
                                  prg.programmeCode
                                )}&district=${encodeURIComponent(activeDistrict.name.en)}`
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#144527] hover:underline pt-1 cursor-pointer"
                          >
                            <span>{lang === 'hi' ? 'सहभागिता हेतु जुड़ें' : 'Participate in Project'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CAMPAIGNS */}
              {activeTab === 'campaigns' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#143D21]">
                      {lang === 'hi'
                        ? `${activeDistrict.name.hi} के प्रकाशित एवं प्रस्तावित अभियान`
                        : `Published & Proposed Campaigns in ${activeDistrict.name.en}`}
                    </h3>
                    {districtCampaigns.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {districtCampaigns.map((cmp) => (
                          <div
                            key={cmp.id}
                            className="rounded-xl border border-[#E3DDD0] bg-[#FAF8F3] p-5 space-y-2.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#9A3412]">{cmp.operationalStatus}</span>
                              <span className="font-mono text-[#68756C]">{cmp.programmeCode}</span>
                            </div>
                            <h4 className="text-base font-bold text-[#143D21]">
                              {lang === 'hi' ? cmp.titleHi || cmp.titleEn : cmp.titleEn}
                            </h4>
                            <p className="text-xs text-[#435248] leading-relaxed">
                              {lang === 'hi' ? cmp.summaryHi || cmp.summaryEn : cmp.summaryEn}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate(
                                  `/join/${encodeURIComponent(
                                    cmp.linkedFormType || 'harit-mitra'
                                  )}?campaign=${encodeURIComponent(
                                    cmp.programmeCode
                                  )}&district=${encodeURIComponent(activeDistrict.name.en)}`
                                )
                              }
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#144527] hover:underline pt-1 cursor-pointer"
                            >
                              <span>{lang === 'hi' ? 'अभियान में शामिल हों' : 'Join Campaign'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#4C5B51]">
                        {lang === 'hi'
                          ? 'अभी जिला-स्तरीय अभियान प्रस्तावना चरण में हैं। नीचे प्रस्तावित अभियान श्रेणियाँ देखें।'
                          : 'District campaigns are currently in the proposed planning stage. See the proposed campaign categories below.'}
                      </p>
                    )}
                  </div>

                  <div className="pt-5 border-t border-[#EFEAE0] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#2E6F36]">
                      {lang === 'hi' ? 'प्रस्तावित जन-अभियान श्रेणियाँ' : 'Proposed District Campaign Tracks'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {PROPOSED_CAMPAIGN_CATEGORIES.map((cat) => (
                        <div
                          key={cat.en}
                          className="rounded-xl border border-[#EAE4D7] bg-white p-4 flex items-center justify-between gap-2"
                        >
                          <span className="text-xs font-semibold text-[#143D21]">
                            {lang === 'hi' ? cat.hi : cat.en}
                          </span>
                          <span className="text-[11px] text-[#9A3412] font-medium shrink-0">
                            {lang === 'hi' ? 'प्रस्तावित' : 'Proposed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VILLAGES (CASCADING TEHSIL -> GRAM/WARD DRILL-DOWN) */}
              {activeTab === 'villages' && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#143D21]">
                      {lang === 'hi'
                        ? `${activeDistrict.name.hi} — तहसील / शहर एवं ग्राम / वार्ड खोजें`
                        : `${activeDistrict.name.en} — Explore Tehsils, Cities, Grams & Wards`}
                    </h3>
                    <p className="text-xs text-[#556358]">
                      Rajasthan → {activeDistrict.name.en}
                      {selectedCity ? ` → ${selectedCity}` : ''}
                      {selectedVillage ? ` → ${selectedVillage}` : ''}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="space-y-1.5 block">
                      <span className="text-xs font-bold text-[#143D21]">
                        {lang === 'hi' ? 'तहसील / शहर / ब्लॉक चुनें' : 'Select Tehsil / City / Block'}
                      </span>
                      <select
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          setSelectedVillage('');
                        }}
                        className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] px-3.5 py-2.5 text-sm"
                      >
                        <option value="">
                          {lang === 'hi' ? 'सभी तहसील / शहर' : 'All Tehsils / Cities'}
                        </option>
                        {cityGroups.map((g) => (
                          <option key={g.name} value={g.name}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5 block">
                      <span className="text-xs font-bold text-[#143D21]">
                        {lang === 'hi' ? 'ग्राम / पंचायत / वार्ड चुनें' : 'Select Gram / Village / Ward'}
                      </span>
                      <select
                        value={selectedVillage}
                        disabled={!selectedCity}
                        onChange={(e) => setSelectedVillage(e.target.value)}
                        className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] disabled:opacity-55 px-3.5 py-2.5 text-sm"
                      >
                        <option value="">
                          {lang === 'hi' ? 'ग्राम या वार्ड चुनें' : 'Choose Gram or Ward'}
                        </option>
                        {selectedCityVillages.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {selectedVillage && (
                    <div className="rounded-xl bg-[#FAF8F3] border border-[#E3DDD0] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#143D21]">
                          {selectedVillage} ({selectedCity}, {activeDistrict.name.en})
                        </p>
                        <p className="text-xs text-[#556358]">
                          {lang === 'hi'
                            ? 'वृक्षारोपण व जीवितता प्रगति: अभी अभियान प्रारंभ नहीं हुआ है (Data not yet available)'
                            : 'Plantation & survival progress: Data not yet available'}
                        </p>
                      </div>
                      <SpringButton
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          onNavigate(
                            `/join/harit-mitra?district=${encodeURIComponent(activeDistrict.name.en)}`
                          )
                        }
                      >
                        <span>{lang === 'hi' ? 'इस ग्राम से जुड़ें' : 'Join From This Village'}</span>
                      </SpringButton>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GREEN CAMPUS */}
              {activeTab === 'green-campus' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#143D21]">
                    <GraduationCap className="w-5 h-5 text-[#2E6F36]" />
                    <h3 className="text-lg font-bold">
                      {lang === 'hi' ? 'स्कूल एवं कॉलेज ग्रीन कैंपस नेटवर्क' : 'School & College Green Campus Network'}
                    </h3>
                  </div>
                  <p className="text-sm text-[#3E4C43] max-w-3xl leading-relaxed">
                    {lang === 'hi'
                      ? `${activeDistrict.name.hi} के विद्यालयों, महाविद्यालयों और विश्वविद्यालयों में विद्यार्थी इको-क्लब, देशी छायादार वृक्षारोपण और प्लास्टिक-मुक्त कैंपस पहल के लिए पंजीकरण खुला है।`
                      : `Schools, colleges, and universities across ${activeDistrict.name.en} can register for student Eco-Clubs, native campus tree corridors, and plastic-free campus stewardship.`}
                  </p>
                  <SpringButton
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      onNavigate(`/join/school-college?district=${encodeURIComponent(activeDistrict.name.en)}`)
                    }
                  >
                    <span>{lang === 'hi' ? 'ग्रीन कैंपस पंजीकरण करें' : 'Register Green Campus'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </SpringButton>
                </div>
              )}

              {/* TAB 6: HARIT MITRA */}
              {activeTab === 'harit-mitra' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#143D21]">
                    {lang === 'hi'
                      ? `${activeDistrict.name.hi} हरित मित्र नेटवर्क`
                      : `${activeDistrict.name.en} Harit Mitra Network`}
                  </h3>
                  <div className="rounded-xl bg-[#FAF8F3] border border-[#EAE4D7] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#556358]">
                        {lang === 'hi'
                          ? 'सत्यापित एवं स्वीकृत हरित मित्र (व्यक्तिगत मोबाइल नंबर गोपनीय रखे जाते हैं)'
                          : 'Verified Harit Mitras (Personal phone numbers are never publicly exposed)'}
                      </p>
                      <p className="text-2xl font-bold text-[#143D21] mt-1 tabular-nums">
                        {approvedHaritMitraCount > 0
                          ? approvedHaritMitraCount
                          : lang === 'hi'
                          ? 'पंजीकरण प्रारंभ'
                          : 'Onboarding Open'}
                      </p>
                    </div>
                    <SpringButton
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        onNavigate(`/join/harit-mitra?district=${encodeURIComponent(activeDistrict.name.en)}`)
                      }
                    >
                      <span>{lang === 'hi' ? 'हरित मित्र बनें' : 'Become a Harit Mitra'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </SpringButton>
                  </div>
                </div>
              )}

              {/* TAB 7: EVENTS */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#143D21]">
                    {lang === 'hi'
                      ? `${activeDistrict.name.hi} के कार्यक्रम एवं हरित मैराथन`
                      : `Events & Harit Marathon in ${activeDistrict.name.en}`}
                  </h3>
                  {districtMarathonEvents.length === 0 && districtEventsFromHub.length === 0 ? (
                    <p className="text-sm text-[#4C5B51]">
                      {lang === 'hi'
                        ? 'इस जिले में अभी कोई सार्वजनिक कार्यक्रम घोषित नहीं हुआ है।'
                        : 'No upcoming district events have been announced yet.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {districtMarathonEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-xl border border-[#E3DDD0] bg-[#FAF8F3] p-5 space-y-2"
                        >
                          <p className="text-xs font-bold text-[#9A3412]">
                            {ev.status} · {lang === 'hi' ? ev.dateDisplayHi : ev.dateDisplayEn}
                          </p>
                          <h4 className="text-base font-bold text-[#143D21]">
                            {lang === 'hi' ? ev.titleHi || ev.titleEn : ev.titleEn}
                          </h4>
                          <p className="text-xs text-[#4C5B51]">
                            {lang === 'hi' ? ev.venueHi || ev.venueEn : ev.venueEn}
                          </p>
                          <button
                            type="button"
                            onClick={() => onNavigate('/events/harit-marathon')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#144527] hover:underline cursor-pointer pt-1"
                          >
                            <span>{lang === 'hi' ? 'विवरण एवं पंजीकरण' : 'Details & Registration'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {districtEventsFromHub.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-xl border border-[#E3DDD0] bg-[#FAF8F3] p-5 space-y-2"
                        >
                          <p className="text-xs font-bold text-[#144527]">
                            {ev.type.toUpperCase()} · {ev.operationalStatus} · {ev.startDate}
                          </p>
                          <h4 className="text-base font-bold text-[#143D21]">
                            {lang === 'hi' ? ev.titleHi || ev.titleEn : ev.titleEn}
                          </h4>
                          <p className="text-xs text-[#4C5B51]">
                            {lang === 'hi' ? ev.summaryHi || ev.summaryEn : ev.summaryEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: PROGRESS (STRICT HONESTY GOVERNANCE) */}
              {activeTab === 'progress' && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#143D21]">
                      {lang === 'hi'
                        ? `${activeDistrict.name.hi} — पारदर्शी प्रगति डैशबोर्ड`
                        : `${activeDistrict.name.en} — Honest Progress Dashboard`}
                    </h3>
                    <p className="text-xs text-[#556358]">
                      {lang === 'hi'
                        ? 'GOVEDA कभी भी असत्यापित या अनुमानित वृक्षारोपण संख्या प्रदर्शित नहीं करता।'
                        : 'GOVEDA never publishes unverified or estimated plantation numbers.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: lang === 'hi' ? 'नियोजित / प्रस्तावित (Planned)' : 'Planned / Proposed',
                        value: districtProgrammes.filter((p) =>
                          ['proposed', 'planned', 'under assessment', 'approved'].includes(
                            p.operationalStatus.toLowerCase()
                          )
                        ).length,
                      },
                      {
                        label: lang === 'hi' ? 'सक्रिय / प्रगति पर (In Progress)' : 'In Progress / Ongoing',
                        value: districtProgrammes.filter((p) =>
                          ['ongoing', 'in progress'].includes(p.operationalStatus.toLowerCase())
                        ).length,
                      },
                      {
                        label: lang === 'hi' ? 'सत्यापित पूर्ण (Completed)' : 'Completed & Verified',
                        value: districtProgrammes.filter((p) =>
                          p.operationalStatus.toLowerCase().includes('completed')
                        ).length,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl bg-[#FAF8F3] border border-[#EAE4D7] p-4"
                      >
                        <p className="text-xs text-[#556358]">{stat.label}</p>
                        <p className="text-2xl font-bold text-[#143D21] mt-1 tabular-nums">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-[#E3DDD0] overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FAF8F3] border-b border-[#E3DDD0] text-[#556358]">
                          <th className="py-3 px-4 font-semibold">
                            {lang === 'hi' ? 'मानदंड' : 'Indicator'}
                          </th>
                          <th className="py-3 px-4 font-semibold">
                            {lang === 'hi' ? 'सत्यापित स्थिति' : 'Verified Status'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFEAE0]">
                        <tr>
                          <td className="py-3 px-4 font-medium text-[#143D21]">
                            {lang === 'hi' ? 'कुल रोपित पौधे (Actual Planted)' : 'Actual Saplings Planted'}
                          </td>
                          <td className="py-3 px-4 text-[#556358]">
                            {lang === 'hi'
                              ? 'अभी अभियान प्रारंभ नहीं हुआ है (Data not yet available)'
                              : 'Data not yet available'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-[#143D21]">
                            {lang === 'hi' ? 'सत्यापित जीवितता दर (Verified Survival)' : 'Verified Survival Rate'}
                          </td>
                          <td className="py-3 px-4 text-[#556358]">
                            {lang === 'hi'
                              ? 'प्रथम मानसून ऑडिट के पश्चात उपलब्ध (Data not yet available)'
                              : 'Data not yet available'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs text-[#5B695F]">
                    {lang === 'hi'
                      ? 'नोट: वृक्ष-स्तरीय GPS / GIS और MRV ऑडिट डेटा एक पृथक समर्पित निगरानी सॉफ्टवेयर द्वारा सत्यापित होने के उपरांत ही यहाँ सारांश रूप में प्रकाशित किया जाएगा।'
                      : 'Note: Tree-level GPS/GIS and MRV monitoring are managed in a separate dedicated verification system; only audited summary indicators appear publicly.'}
                  </p>
                </div>
              )}

              {/* TAB 9: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#143D21]">
                    {lang === 'hi'
                      ? `${activeDistrict.name.hi} — फील्ड गैलरी`
                      : `${activeDistrict.name.en} — Field Gallery`}
                  </h3>
                  {districtGallery.length === 0 ? (
                    <p className="text-sm text-[#4C5B51]">
                      {lang === 'hi'
                        ? 'इस जिले की सत्यापित फील्ड तस्वीरें अभियान संचालन के उपरांत यहाँ प्रकाशित की जाएंगी।'
                        : 'Verified field photographs for this district will be published here once activities commence.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {districtGallery.map((img, i) => (
                        <figure
                          key={i}
                          className="rounded-xl overflow-hidden border border-[#E3DDD0] bg-[#FAF8F3]"
                        >
                          <img
                            src={img.url}
                            alt={img.caption}
                            referrerPolicy="no-referrer"
                            className="w-full h-48 object-cover"
                          />
                          <figcaption className="p-3 text-xs text-[#4C5B51]">
                            {img.caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 10: JOIN US */}
              {activeTab === 'join' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {(
                      [
                        ['harit-mitra', 'हरित मित्र', 'Harit Mitra'],
                        ['farmer', 'किसान', 'Farmer'],
                        ['school-college', 'ग्रीन कैंपस', 'Green Campus'],
                        ['gaushala', 'गौशाला', 'Gaushala'],
                        ['volunteer', 'स्वयंसेवक', 'Volunteer'],
                        ['csr-partner', 'CSR साझेदार', 'CSR Partner'],
                      ] as const
                    ).map(([cat, hi, en]) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setJoinCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          joinCategory === cat
                            ? 'bg-[#143D21] text-white'
                            : 'bg-[#FAF8F3] border border-[#E3DDD0] text-[#143D21]'
                        }`}
                      >
                        {lang === 'hi' ? hi : en}
                      </button>
                    ))}
                  </div>
                  <RegistrationPortal
                    lang={lang}
                    initialCategory={joinCategory}
                    records={records}
                    onAddRecord={onAddRecord}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
