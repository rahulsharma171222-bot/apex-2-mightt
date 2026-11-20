import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Compass,
  FileText,
  Flag,
  GitBranch,
  Globe2,
  MapPin,
  RotateCcw,
  Sparkles,
  Sprout,
  Trees,
  Users,
} from 'lucide-react';
import { RajasthanMap } from '../components/RajasthanMap';
import { OrganicEditorialHeading } from '../components/OrganicFarmingSections';
import { GENERATED_ASSETS } from '../data/assets';
import { INDIA_STATES_DIRECTORY } from '../data/indiaLocations';
import { usePublicPortal } from '../context/PublicPortalContext';
import {
  getStatesSummary,
  resolvePanIndiaLocationFeed,
} from '../utils/haritBharatLogic';
import {
  buildProgrammeHierarchyTree,
  filterUnifiedProgrammes,
} from '../utils/adminLogic';
import type { Language } from '../types/goveda';

interface HaritBharatPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function HaritBharatPage({ lang, onNavigate }: HaritBharatPageProps) {
  const { bootstrap } = usePublicPortal();

  const [stateSlug, setStateSlug] = useState<string>('rajasthan');
  const [district, setDistrict] = useState<string>('');
  const [subDistrict, setSubDistrict] = useState<string>('');
  const [villageOrTown, setVillageOrTown] = useState<string>('');

  const summary = useMemo(() => getStatesSummary(bootstrap), [bootstrap]);

  const feed = useMemo(
    () =>
      resolvePanIndiaLocationFeed(bootstrap, {
        stateSlug,
        district,
        subDistrict,
        villageOrTown,
      }),
    [bootstrap, stateSlug, district, subDistrict, villageOrTown]
  );

  const matchingUnifiedProgrammes = useMemo(
    () =>
      filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
        stateName: feed.selectedStateNameEn || 'all',
        district: district || 'all',
        query: villageOrTown || subDistrict || '',
        onlyPublished: true,
      }),
    [bootstrap?.programmes, feed.selectedStateNameEn, district, subDistrict, villageOrTown]
  );

  const unifiedTree = useMemo(
    () => buildProgrammeHierarchyTree(matchingUnifiedProgrammes),
    [matchingUnifiedProgrammes]
  );

  const combinedMatchCount = feed.totalMatches + matchingUnifiedProgrammes.length;

  const handleStateChange = (nextStateSlug: string) => {
    setStateSlug(nextStateSlug);
    setDistrict('');
    setSubDistrict('');
    setVillageOrTown('');
  };

  const handleDistrictChange = (nextDistrict: string) => {
    setDistrict(nextDistrict);
    setSubDistrict('');
    setVillageOrTown('');
  };

  const handleSubDistrictChange = (nextSub: string) => {
    setSubDistrict(nextSub);
    setVillageOrTown('');
  };

  const handleReset = () => {
    setStateSlug('');
    setDistrict('');
    setSubDistrict('');
    setVillageOrTown('');
  };

  const activeBreadcrumb = [
    stateSlug
      ? lang === 'hi'
        ? feed.selectedStateNameHi || feed.selectedStateNameEn
        : feed.selectedStateNameEn
      : lang === 'hi'
      ? 'संपूर्ण भारत (सभी राज्य)'
      : 'All India (All States & UTs)',
    district,
    subDistrict,
    villageOrTown,
  ].filter(Boolean);

  return (
    <div className="bg-[#FBFAF6] text-[#144721]">
      {/* 1. SEAMLESS EDITORIAL WATERCOLOR HERO */}
      <section className="relative bg-[#FBFAF6] overflow-hidden border-b border-[#E8E2D2]">
        <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
          <img
            src={GENERATED_ASSETS.organicHeroEditorial}
            alt={
              lang === 'hi'
                ? 'हरित भारत — राजस्थान से संपूर्ण भारत हरित अभियान दृश्य'
                : 'Harit Bharat — Expanding from Rajasthan across India'
            }
            className="w-full h-full object-cover object-right"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #FBFAF6 0%, #FBFAF6 40%, rgba(251,250,246,0.92) 48%, rgba(251,250,246,0.22) 60%, rgba(251,250,246,0) 70%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16"
            style={{
              background:
                'linear-gradient(180deg, rgba(251,250,246,0) 0%, #FBFAF6 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-4 lg:py-16 xl:py-20">
          <div className="max-w-xl lg:max-w-[560px]">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
              <span className="text-[10.5px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#1E3B25]">
                GOVEDA • HARIT RAJASTHAN → HARIT BHARAT
              </span>
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
            </div>

            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold tracking-tight leading-[1.12] text-[2.3rem] sm:text-[3.2rem] lg:text-[3.85rem]">
                <span className="block text-[#114720]">हरित भारत</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  राष्ट्रीय नेटवर्क
                </span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold tracking-tight leading-[1.08] text-[2.25rem] sm:text-[3.1rem] lg:text-[3.65rem]">
                <span className="block text-[#114720]">Harit Bharat</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  Pan-India Explorer
                </span>
              </h1>
            )}

            <svg
              viewBox="0 0 360 22"
              className="w-60 sm:w-72 lg:w-80 h-4 mt-1.5 mb-3"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hbSwoosh" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4A024" />
                  <stop offset="55%" stopColor="#8DB433" />
                  <stop offset="100%" stopColor="#2B6E29" />
                </linearGradient>
              </defs>
              <path
                d="M6,15 C110,4 235,20 352,8"
                fill="none"
                stroke="url(#hbSwoosh)"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
            </svg>

            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F4F1DF] via-[#EBF2DE] to-transparent">
              <p className="italic font-semibold text-[#1E5426] text-xs sm:text-sm lg:text-[15px]">
                {lang === 'hi'
                  ? 'राजस्थान के 5 फोकस जिलों से देश के हर राज्य, जिले, तहसील और गाँव तक।'
                  : 'Rooted in Rajasthan. Connecting States, Districts, Tehsils & Villages Across India.'}
              </p>
            </div>

            <div className="border-l-[2.5px] border-[#C8922A] pl-4 mb-6 sm:mb-7 max-w-lg">
              <p
                className={`text-sm sm:text-base lg:text-[17px] text-[#243B2A] leading-relaxed font-medium ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi'
                  ? 'अपना राज्य, जिला, तहसील/शहर और कस्बा/गाँव चुनें — जानें कि आपके क्षेत्र में GOVEDA के कौन से अभियान, परियोजनाएँ, मैराथन या प्रशिक्षण सक्रिय हैं, या अपने गाँव से जुड़ें।'
                  : 'Select your State, District, Sub-District/City, and Town/Village below to discover live GOVEDA campaigns, projects, marathons, and training near you—or initiate local outreach.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#hb-explorer"
                className="inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0E3619] text-white px-6 py-3 text-sm font-bold shadow-[0_10px_24px_-10px_rgba(21,74,36,0.55)] transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'अपना क्षेत्र खोजें' : 'Explore Your Location'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => onNavigate('/join/harit-mitra')}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-[#144721] border border-[#1E5629]/45 px-5 py-3 text-sm font-bold transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'अपने जिले से जुड़ें' : 'Connect From Your District'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hero Artwork */}
        <div className="lg:hidden relative w-full mt-2 overflow-hidden">
          <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src={GENERATED_ASSETS.organicHeroEditorial}
              alt={lang === 'hi' ? 'हरित भारत' : 'Harit Bharat'}
              className="w-full h-full object-cover object-right scale-[1.52] sm:scale-[1.24] origin-right"
              loading="eager"
            />
            <div
              className="absolute inset-x-0 top-0 h-14 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, #FBFAF6 0%, rgba(251,250,246,0) 100%)',
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
              style={{
                background:
                  'linear-gradient(0deg, #FBFAF6 0%, rgba(251,250,246,0) 100%)',
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. PAN-INDIA CASCADING LOCATION EXPLORER */}
      <section id="hb-explorer" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <OrganicEditorialHeading
              eyebrow={lang === 'hi' ? 'पैन-इंडिया लोकेशन एक्सप्लोरर' : 'PAN-INDIA LOCATION EXPLORER'}
              titleHi="राज्य → जिला → तहसील/शहर → कस्बा/गाँव खोजें"
              titleEn="Explore by State → District → Sub-District → Town / Village"
              leadHi="एडमिन पैनल में जैसे ही किसी भी राज्य (राजस्थान, गुजरात, मध्यप्रदेश आदि) के जिले, शहर या गाँव का अभियान प्रकाशित किया जाता है, वह यहाँ तुरंत दिखाई देता है।"
              leadEn="Whenever a campaign, marathon, project, or training is published for any State, District, Sub-District, or Village in the Admin Console, it appears live right here."
              lang={lang}
            />

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-[#FAF8F2] border border-[#E5DEC8] text-xs font-bold text-[#144721] tabular-nums">
                <Globe2 className="w-3.5 h-3.5 inline mr-1.5 text-[#368737]" />
                {summary.totalStatesAndUts}{' '}
                {lang === 'hi' ? 'राज्य व केंद्रशासित प्रदेश' : 'States & UTs Indexed'}
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#1E5629]/25 bg-white hover:bg-[#F4F8F2] text-xs font-bold text-[#144721] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'फ़िल्टर रीसेट' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* 4-Level Cascading Dropdown Bar */}
          <div className="rounded-3xl bg-[#FBFAF6] border border-[#DFD8C5] p-5 sm:p-7 shadow-[0_14px_34px_-22px_rgba(20,71,33,0.18)] space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1: State */}
              <div>
                <label
                  htmlFor="hb-state"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-[#5A7B3B] mb-1.5"
                >
                  1. {lang === 'hi' ? 'राज्य / केंद्रशासित प्रदेश' : 'State / UT'}
                </label>
                <select
                  id="hb-state"
                  value={stateSlug}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#142119] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                >
                  <option value="">
                    {lang === 'hi' ? '— संपूर्ण भारत (सभी 36 राज्य/UT) —' : '— All India (36 States & UTs) —'}
                  </option>
                  {INDIA_STATES_DIRECTORY.map((st) => (
                    <option key={st.slug} value={st.slug}>
                      {lang === 'hi' ? `${st.nameHi} (${st.nameEn})` : st.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: District */}
              <div>
                <label
                  htmlFor="hb-district"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-[#5A7B3B] mb-1.5"
                >
                  2. {lang === 'hi' ? 'जिला चुनें (District)' : 'District'}
                </label>
                <select
                  id="hb-district"
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#142119] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                >
                  <option value="">
                    {lang === 'hi'
                      ? `सभी जिले (${feed.availableDistricts.length})`
                      : `All Districts (${feed.availableDistricts.length})`}
                  </option>
                  {feed.availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Sub-District / City / Tehsil */}
              <div>
                <label
                  htmlFor="hb-subdistrict"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-[#5A7B3B] mb-1.5"
                >
                  3. {lang === 'hi' ? 'तहसील / उपखंड / शहर' : 'Sub-District / City / Tehsil'}
                </label>
                <select
                  id="hb-subdistrict"
                  value={subDistrict}
                  onChange={(e) => handleSubDistrictChange(e.target.value)}
                  disabled={feed.availableSubDistricts.length === 0}
                  className="w-full rounded-xl border border-[#1B5A32]/25 bg-white disabled:bg-[#F3F4F1] disabled:text-[#6E7D72] px-3.5 py-2.5 text-sm font-semibold text-[#142119] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                >
                  <option value="">
                    {feed.availableSubDistricts.length > 0
                      ? lang === 'hi'
                        ? `सभी तहसील/शहर (${feed.availableSubDistricts.length})`
                        : `All Sub-Districts (${feed.availableSubDistricts.length})`
                      : lang === 'hi'
                      ? 'सक्रिय तहसील डेटा प्रतीक्षित'
                      : 'All / Awaiting local campaigns'}
                  </option>
                  {feed.availableSubDistricts.map((sd) => (
                    <option key={sd} value={sd}>
                      {sd}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 4: Town / Kasba / Village */}
              <div>
                <label
                  htmlFor="hb-village"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-[#5A7B3B] mb-1.5"
                >
                  4. {lang === 'hi' ? 'कस्बा / ग्राम / नगर' : 'Town / Kasba / Village'}
                </label>
                <select
                  id="hb-village"
                  value={villageOrTown}
                  onChange={(e) => setVillageOrTown(e.target.value)}
                  disabled={feed.availableVillages.length === 0}
                  className="w-full rounded-xl border border-[#1B5A32]/25 bg-white disabled:bg-[#F3F4F1] disabled:text-[#6E7D72] px-3.5 py-2.5 text-sm font-semibold text-[#142119] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                >
                  <option value="">
                    {feed.availableVillages.length > 0
                      ? lang === 'hi'
                        ? `सभी कस्बे/गाँव (${feed.availableVillages.length})`
                        : `All Towns / Villages (${feed.availableVillages.length})`
                      : lang === 'hi'
                      ? 'ग्राम स्तर अभियान प्रतीक्षित'
                      : 'All / Awaiting village drives'}
                  </option>
                  {feed.availableVillages.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Phase-1 District Shortcuts + Active Selection Summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6DFCE]">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-[#5A7B3B]">
                  {lang === 'hi' ? 'चयनित स्थान:' : 'Selected Scope:'}
                </span>
                <span className="font-extrabold text-[#114720]">
                  {activeBreadcrumb.join(' › ')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4E6] text-[#154A24] font-bold tabular-nums">
                  {combinedMatchCount}{' '}
                  {lang === 'hi' ? 'सक्रिय रिकॉर्ड' : 'Live Matches'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {['Bhilwara', 'Churu', 'Bikaner', 'Phalodi', 'Jodhpur'].map((dName) => (
                  <button
                    key={dName}
                    type="button"
                    onClick={() => {
                      setStateSlug('rajasthan');
                      setDistrict(dName);
                      setSubDistrict('');
                      setVillageOrTown('');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      stateSlug === 'rajasthan' && district === dName
                        ? 'bg-[#154A24] text-white'
                        : 'bg-white border border-[#DFD8C5] text-[#144721] hover:border-[#368737]'
                    }`}
                  >
                    {dName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LIVE MATCHING RESULTS */}
          {combinedMatchCount === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#C8922A]/50 bg-[#FBFAF6] p-8 sm:p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF5E6] text-[#154A24] mx-auto flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#114720]">
                {lang === 'hi'
                  ? `${activeBreadcrumb.join(', ')} में नया हरित अध्याय शुरू करें`
                  : `Bring Harit Bharat to ${activeBreadcrumb.join(', ')}`}
              </h3>
              <p className="max-w-xl mx-auto text-sm text-[#395040] leading-relaxed">
                {lang === 'hi'
                  ? 'वर्तमान में GOVEDA का प्रथम चरण राजस्थान के 5 फोकस जिलों में सक्रिय है। यदि आप अपने राज्य, जिले या गाँव में हरित मित्र, किसान समूह, गौशाला या संस्थागत अभियान प्रारंभ करना चाहते हैं, तो अभी जुड़ें।'
                  : 'GOVEDA Phase-1 outreach is anchored in Rajasthan and expanding steadily across India. Register as a local Harit Mitra, community volunteer, or institutional partner to initiate activities in your district.'}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/join/harit-mitra')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0E3619] text-white px-6 py-2.5 text-sm font-bold cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'हरित मित्र बनें' : 'Register as Harit Mitra'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-[#1E5629]/35 text-[#144721] px-5 py-2.5 text-sm font-bold cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'जिला समन्वय संपर्क' : 'Contact Expansion Desk'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Unified Central Programmes (Project -> Campaign -> Event / Training) */}
              {unifiedTree.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                    <GitBranch className="w-4 h-4" />
                    <span>
                      {lang === 'hi'
                        ? `एकीकृत परियोजनाएँ, अभियान व क्षेत्रीय गतिविधियाँ (${matchingUnifiedProgrammes.length})`
                        : `Live Unified Programmes — Projects, Campaigns & Activities (${matchingUnifiedProgrammes.length})`}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {unifiedTree.map((root) => {
                      const p = root.item;
                      const cover =
                        p.media.find((m) => m.isCover && m.url) ??
                        p.media.find((m) => m.mediaType === 'photo' && m.url);
                      const firstDistrict = p.locations[0]?.district || district || 'Bhilwara';
                      const regUrl = `/join/${encodeURIComponent(
                        p.linkedFormType || 'farmer'
                      )}?campaign=${encodeURIComponent(p.programmeCode)}&campaignTitle=${encodeURIComponent(
                        p.titleEn
                      )}&district=${encodeURIComponent(firstDistrict)}`;

                      return (
                        <div
                          key={p.id}
                          className="rounded-3xl bg-[#FBFAF6] border border-[#DFD8C5] overflow-hidden"
                        >
                          <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-5">
                            {cover && (
                              <img
                                src={cover.url}
                                alt={cover.altText || p.titleEn}
                                className="w-full lg:w-56 h-40 rounded-2xl object-cover border border-[#E5DEC8] shrink-0"
                              />
                            )}
                            <div className="flex-1 space-y-2.5">
                              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4E6] text-[#154A24] font-bold uppercase">
                                  {p.type}
                                </span>
                                <span className="font-mono font-bold text-[#144721]">
                                  {p.programmeCode}
                                </span>
                                <span className="font-semibold text-[#8E6212]">
                                  · {p.operationalStatus}
                                </span>
                              </div>
                              <h3 className="text-lg sm:text-xl font-extrabold text-[#114720]">
                                {lang === 'hi' ? p.titleHi || p.titleEn : p.titleEn}
                              </h3>
                              <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">
                                {lang === 'hi' ? p.summaryHi || p.summaryEn : p.summaryEn}
                              </p>
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                <span className="text-xs font-semibold text-[#4B6353] inline-flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                                  {p.coverageScope === 'india-wide'
                                    ? `India-Wide (${p.locations.map((l) => l.district).join(', ')})`
                                    : p.locations
                                        .map((l) =>
                                          l.localityName
                                            ? `${l.localityName}, ${l.district} (${l.stateName})`
                                            : `${l.district}, ${l.stateName}`
                                        )
                                        .join(' · ')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onNavigate(regUrl)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#154A24] hover:bg-[#0E3619] text-white px-4 py-2 text-xs font-bold cursor-pointer"
                                >
                                  <span>{lang === 'hi' ? 'सहभागिता दर्ज करें' : 'Join / Register'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Nested Child Campaigns / Events / Trainings */}
                          {root.children.length > 0 && (
                            <div className="border-t border-[#E6DFCE] bg-white/80 px-5 sm:px-6 py-4 space-y-2.5">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A7B3B]">
                                {lang === 'hi'
                                  ? `इस परियोजना के अंतर्गत सक्रिय अभियान व गतिविधियाँ (${root.children.length})`
                                  : `Nested Campaigns & Field Activities (${root.children.length})`}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {root.children.map((ch) => {
                                  const cp = ch.item;
                                  const cRegUrl = `/join/${encodeURIComponent(
                                    cp.linkedFormType || 'volunteer'
                                  )}?campaign=${encodeURIComponent(
                                    cp.programmeCode
                                  )}&campaignTitle=${encodeURIComponent(
                                    cp.titleEn
                                  )}&district=${encodeURIComponent(
                                    cp.locations[0]?.district || firstDistrict
                                  )}`;
                                  return (
                                    <div
                                      key={cp.id}
                                      className="rounded-2xl border border-[#E5DEC8] bg-[#FBFAF6] p-3.5 space-y-1.5"
                                    >
                                      <div className="flex items-center justify-between gap-2 text-[10.5px]">
                                        <span className="font-bold uppercase text-[#154A24]">
                                          {cp.type} · {cp.programmeCode}
                                        </span>
                                        <span className="font-semibold text-[#8E6212]">
                                          {cp.operationalStatus}
                                        </span>
                                      </div>
                                      <h4 className="text-sm font-bold text-[#114720]">
                                        {lang === 'hi' ? cp.titleHi || cp.titleEn : cp.titleEn}
                                      </h4>
                                      {ch.children.length > 0 && (
                                        <p className="text-[11px] text-[#368737] font-semibold">
                                          +{ch.children.length}{' '}
                                          {lang === 'hi' ? 'संलग्न कार्यक्रम/प्रशिक्षण' : 'scheduled activities/trainings'}
                                        </p>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => onNavigate(cRegUrl)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#154A24] hover:underline cursor-pointer pt-0.5"
                                      >
                                        <span>{lang === 'hi' ? 'अभी जुड़ें' : 'Participate Now'}</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Live Location Campaigns & Admin-Defined Participation Roles */}
              {feed.campaigns.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                    <Flag className="w-4 h-4" />
                    <span>
                      {lang === 'hi'
                        ? `सक्रिय अभियान एवं सहभागिता भूमिकाएँ (${feed.campaigns.length})`
                        : `Active Location Campaigns & Open Roles (${feed.campaigns.length})`}
                    </span>
                  </div>
                  <div className="space-y-5">
                    {feed.campaigns.map((cmp) => {
                      const openRoles = (cmp.roles ?? []).filter((r) => r.isOpen !== false);
                      const locLine = [
                        cmp.villageOrTown,
                        cmp.subDistrict,
                        cmp.district,
                        cmp.stateName,
                      ]
                        .filter(Boolean)
                        .join(', ');

                      return (
                        <div
                          key={cmp.id}
                          className="rounded-3xl bg-[#FBFAF6] border border-[#DFD8C5] p-5 sm:p-6 space-y-5"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A7B3B]">
                                <span className="font-mono font-bold text-[#144721]">
                                  {cmp.campaignCode}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold">{cmp.missionPillar}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold text-[#154A24]">
                                  {cmp.status}
                                </span>
                              </div>
                              <h3 className="text-lg sm:text-xl font-extrabold text-[#114720]">
                                {lang === 'hi' ? cmp.titleHi || cmp.titleEn : cmp.titleEn}
                              </h3>
                              <p className="text-xs font-semibold text-[#4B6353] flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                                  {locLine}
                                </span>
                                {(cmp.startDate || cmp.endDate) && (
                                  <span className="inline-flex items-center gap-1.5 font-mono">
                                    <Calendar className="w-3.5 h-3.5 text-[#5A7B3B]" />
                                    {cmp.startDate || 'Active'} → {cmp.endDate || 'Ongoing'}
                                  </span>
                                )}
                              </p>
                              {(cmp.summaryHi || cmp.summaryEn) && (
                                <p className="text-xs sm:text-sm text-[#395040] leading-relaxed max-w-4xl pt-1">
                                  {lang === 'hi'
                                    ? cmp.summaryHi || cmp.summaryEn
                                    : cmp.summaryEn || cmp.summaryHi}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Selectable Frontend Roles Defined in Admin */}
                          {openRoles.length > 0 && (
                            <div className="border-t border-[#E6DFCE] pt-4 space-y-3">
                              <p className="text-xs font-bold text-[#144721] flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-[#368737]" />
                                <span>
                                  {lang === 'hi'
                                    ? `इस अभियान में अपनी भूमिका चुनें (${openRoles.length} खुली भूमिकाएँ)`
                                    : `Choose Your Participation Role (${openRoles.length} Open Roles)`}
                                </span>
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {openRoles.map((roleItem) => {
                                  const query = new URLSearchParams({
                                    campaign: cmp.campaignCode,
                                    campaignTitle: cmp.titleEn,
                                    role: roleItem.titleEn,
                                    district: cmp.district || 'Bhilwara',
                                  }).toString();
                                  const targetRoute = `/join/${encodeURIComponent(
                                    roleItem.formType || 'volunteer'
                                  )}?${query}`;

                                  return (
                                    <div
                                      key={roleItem.id}
                                      className="rounded-2xl bg-white border border-[#E5DEC8] p-4 flex flex-col justify-between gap-3 hover:border-[#368737] transition-colors"
                                    >
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-2 text-[11px] text-[#5B6E60]">
                                          <span className="font-mono font-bold text-[#144721]">
                                            {roleItem.roleCode}
                                          </span>
                                          <span className="tabular-nums">
                                            {roleItem.maxSlots > 0
                                              ? lang === 'hi'
                                                ? `${roleItem.maxSlots} स्थान`
                                                : `${roleItem.maxSlots} slots`
                                              : lang === 'hi'
                                              ? 'खुली सहभागिता'
                                              : 'Open slots'}
                                          </span>
                                        </div>
                                        <h4 className="text-sm font-extrabold text-[#114720]">
                                          {lang === 'hi'
                                            ? roleItem.titleHi || roleItem.titleEn
                                            : roleItem.titleEn}
                                        </h4>
                                        {(roleItem.descriptionHi || roleItem.descriptionEn) && (
                                          <p className="text-xs text-[#3F5546] leading-relaxed">
                                            {lang === 'hi'
                                              ? roleItem.descriptionHi || roleItem.descriptionEn
                                              : roleItem.descriptionEn}
                                          </p>
                                        )}
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => onNavigate(targetRoute)}
                                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#154A24] hover:bg-[#0E3619] text-white px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer"
                                      >
                                        <span>
                                          {lang === 'hi'
                                            ? 'इस भूमिका के लिए जुड़ें'
                                            : 'Apply for this Role'}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Districts Cards */}
              {feed.districts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {lang === 'hi'
                        ? `सक्रिय जिला केंद्र (${feed.districts.length})`
                        : `Active District Hubs (${feed.districts.length})`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {feed.districts.map((d) => (
                      <div
                        key={d.slug}
                        className="rounded-2xl bg-[#FBFAF6] border border-[#E5DEC8] p-5 flex flex-col justify-between gap-4 hover:border-[#567F21]/60 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                              {lang === 'hi'
                                ? d.stateNameHi || d.stateNameEn || 'राजस्थान'
                                : d.stateNameEn || 'Rajasthan'}
                            </span>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF4E6] text-[#154A24]">
                              {lang === 'hi' ? d.regionTagHi : d.regionTagEn}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-[#114720]">
                            {lang === 'hi' ? `${d.nameHi} (${d.nameEn})` : d.nameEn}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">
                            {lang === 'hi' ? d.focusSummaryHi : d.focusSummaryEn}
                          </p>
                          {(d.subDistricts?.length || d.villages?.length) ? (
                            <p className="text-[11px] text-[#5B6E60] pt-1">
                              {[
                                d.subDistricts?.length
                                  ? `${lang === 'hi' ? 'तहसील' : 'Tehsils'}: ${d.subDistricts.join(', ')}`
                                  : '',
                                d.villages?.length
                                  ? `${lang === 'hi' ? 'ग्राम' : 'Villages'}: ${d.villages.join(', ')}`
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D2]">
                          <button
                            type="button"
                            onClick={() => onNavigate(`/harit-rajasthan/${d.slug}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#154A24] hover:text-[#368737] cursor-pointer"
                          >
                            <span>{lang === 'hi' ? 'जिला पृष्ठ खोलें' : 'Open District Hub'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('/join/harit-mitra')}
                            className="text-xs font-bold text-[#5A7B3B] hover:underline cursor-pointer"
                          >
                            {lang === 'hi' ? 'जुड़ें' : 'Join'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Regional Projects */}
              {feed.projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                    <Sprout className="w-4 h-4" />
                    <span>
                      {lang === 'hi'
                        ? `क्षेत्रीय परियोजनाएँ (${feed.projects.length})`
                        : `Regional Projects & Initiatives (${feed.projects.length})`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {feed.projects.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-2xl bg-white border border-[#E5DEC8] p-5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-[#5A7B3B]">
                            {lang === 'hi' ? p.missionCategoryHi : p.missionCategoryEn}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF6E8] text-[#8E6212] border border-[#E5D3A3]">
                            {p.status}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-[#114720]">
                          {lang === 'hi' ? p.titleHi : p.titleEn}
                        </h3>
                        <p className="text-xs font-semibold text-[#4B6353] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#368737]" />
                          <span>
                            {[p.villageOrTown, p.subDistrict, p.district, p.stateName]
                              .filter(Boolean)
                              .join(', ') || (lang === 'hi' ? p.locationHi : p.locationEn)}
                          </span>
                        </p>
                        <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">
                          {lang === 'hi' ? p.objectivesHi : p.objectivesEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Events & Marathons */}
              {feed.events.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {lang === 'hi'
                        ? `आगामी कार्यक्रम एवं हरित मैराथन (${feed.events.length})`
                        : `Regional Events & Harit Marathons (${feed.events.length})`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {feed.events.map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-2xl bg-[#154A24] text-white p-6 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-[#D7F7B2]">
                            {lang === 'hi' ? ev.dateDisplayHi : ev.dateDisplayEn}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/15 font-semibold">
                            {ev.scope || 'District'} · {ev.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold">
                          {lang === 'hi' ? ev.titleHi : ev.titleEn}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#D8ECD8]">
                          {lang === 'hi' ? ev.venueHi : ev.venueEn}
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate('/events/harit-marathon')}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#82C341] text-[#102E16] px-4 py-2 text-xs font-extrabold hover:bg-[#95D456] cursor-pointer"
                        >
                          <span>{lang === 'hi' ? 'मैराथन पंजीकरण देखें' : 'View Event & Register'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Articles, News & Training */}
              {feed.updates.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                    <FileText className="w-4 h-4" />
                    <span>
                      {lang === 'hi'
                        ? `क्षेत्रीय समाचार, लेख एवं प्रशिक्षण (${feed.updates.length})`
                        : `Local Updates, Articles & Training (${feed.updates.length})`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {feed.updates.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-[#FBFAF6] border border-[#E5DEC8] p-5 space-y-2"
                      >
                        <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#5A7B3B]">
                          {item.categoryTag || item.sectionType}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#114720] leading-snug">
                          {lang === 'hi' ? item.titleHi : item.titleEn}
                        </h4>
                        <p className="text-xs text-[#3F5546] leading-relaxed line-clamp-3">
                          {lang === 'hi' ? item.summaryHi : item.summaryEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. INTERACTIVE RAJASTHAN PHASE-1 MAP */}
      <section className="py-12 sm:py-16 bg-[#FBFAF6]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? 'प्रथम चरण — राजस्थान मानचित्र' : 'PHASE 1 ANCHOR · RAJASTHAN MAP'}
            titleHi="हरित राजस्थान से हरित भारत की यात्रा"
            titleEn="From Harit Rajasthan’s 5 Focus Districts to Pan-India"
            leadHi="मानचित्र पर किसी भी सक्रिय जिले पर क्लिक करें और वहाँ के वृक्षारोपण, हरित मित्र व स्थानीय अभियानों का विवरण देखें।"
            leadEn="Click any active district pin on the interactive Rajasthan map to inspect local nurseries, agroforestry outreach, and district stewardship."
            lang={lang}
          />
          <RajasthanMap
            lang={lang}
            onSelectDistrict={(slug) => onNavigate(`/harit-rajasthan/${slug}`)}
          />
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white border border-[#E5DEC8] p-5">
            <div className="flex items-center gap-3">
              <Trees className="w-6 h-6 text-[#368737] shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-[#233A2A]">
                {lang === 'hi'
                  ? 'अपने राज्य या जिले में नया हरित अभियान, प्रशिक्षण कार्यशाला या CSR पायलट प्रस्तावित करें।'
                  : 'Want to start a district plantation drive, farmer workshop, or CSR pilot in your state?'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('/join')}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#154A24] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#0E3619] cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? '12 पंजीकरण श्रेणियाँ देखें' : 'Open 12 Registration Forms'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/partnership')}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#1E5629]/35 bg-[#FBFAF6] text-[#144721] px-5 py-2.5 text-xs font-bold hover:bg-white cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'CSR सहभागिता' : 'CSR Partnership'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
