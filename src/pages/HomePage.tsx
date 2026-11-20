import React from 'react';
import {
  Users,
  HeartHandshake,
  ArrowRight,
  MapPin,
  Trophy,
  FileCheck2,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { SpringButton, SpringCard } from '../components/SpringMotion';
import { RajasthanMap } from '../components/RajasthanMap';
import {
  ClimateActionSvg,
  TreePlantationSvg,
  AgroforestrySproutSvg,
  WaterConservationSvg,
  GaushalaCowSvg,
  RuralLivelihoodsSvg,
  CleanEnergySvg,
  HeritageFortSvg,
  SkillEducationSvg,
  SeniorCareSvg,
  GovedaMissionSvg,
} from '../components/GovedaIcons';
import {
  ScenicHorizonStrip,
  SeamlessPhotoCanvas,
  SeamlessInlinePhoto,
} from '../components/ScenicElements';
import { WhoWeAreShowcase } from '../components/WhoWeAreShowcase';
import { WhyItMattersShowcase } from '../components/WhyItMattersShowcase';
import { OurTenMissionsShowcase } from '../components/OurTenMissionsShowcase';
import { mergePublicDistricts } from '../utils/publicDataBridge';
import { MARATHON_INFO, MAGAZINE_INFO } from '../data/siteContent';
import { getMarathonCountdown } from '../utils/govedaLogic';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { Language } from '../types/goveda';

interface HomePageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

interface TreeLeafNode {
  id: string;
  slug: string;
  cx: string;
  cy: string;
  line1: { hi: string; en: string };
  line2: { hi: string; en: string };
  icon: React.ReactNode;
}

const TREE_LEAF_NODES: TreeLeafNode[] = [
  {
    id: 'clean-energy',
    slug: '/missions/biogas-cbg',
    cx: '54.8%',
    cy: '23.0%',
    line1: { hi: 'स्वच्छ ऊर्जा', en: 'Clean Energy' },
    line2: { hi: '(सौर, बायोगैस, CBG)', en: '(Solar, Biogas, CBG)' },
    icon: (
      <svg viewBox="0 0 32 32" className="w-[1.8vw] min-w-[16px] max-w-[26px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="5.5" />
        <path d="M16 5v3M16 24v3M5 16h3M24 16h3M8.2 8.2l2.1 2.1M21.7 21.7l2.1 2.1M23.8 8.2l-2.1 2.1M10.3 21.7l-2.1 2.1" />
      </svg>
    ),
  },
  {
    id: 'heritage',
    slug: '/missions/heritage-solar-water',
    cx: '71.7%',
    cy: '16.2%',
    line1: { hi: 'सांस्कृतिक धरोहर', en: 'Cultural Heritage' },
    line2: { hi: '(शेखावाटी मिशन)', en: '(Shekhawati Mission)' },
    icon: (
      <svg viewBox="0 0 36 32" className="w-[2.0vw] min-w-[18px] max-w-[28px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 27h28M6 27V15l4-3 4 3v12M22 27V15l4-3 4 3v12M14 27V11l4-4 4 4v16" />
        <path d="M16 27v-5a2 2 0 0 1 4 0v5" />
      </svg>
    ),
  },
  {
    id: 'gaushala',
    slug: '/missions/self-reliant-gaushala',
    cx: '50.8%',
    cy: '36.8%',
    line1: { hi: 'आत्मनिर्भर', en: 'Self-Reliant' },
    line2: { hi: 'गौशाला मिशन', en: 'Gaushala Mission' },
    icon: (
      <svg viewBox="0 0 32 32" className="w-[1.8vw] min-w-[16px] max-w-[26px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 15L16 6l11 9" />
        <path d="M8 13.5V26h16V13.5" />
        <path d="M13 26v-6a3 3 0 0 1 6 0v6" />
      </svg>
    ),
  },
  {
    id: 'skills',
    slug: '/missions/skill-development',
    cx: '88.8%',
    cy: '23.0%',
    line1: { hi: 'कौशल विकास', en: 'Skill Development' },
    line2: { hi: 'और रोजगार', en: '& Employment' },
    icon: (
      <svg viewBox="0 0 34 32" className="w-[1.9vw] min-w-[17px] max-w-[27px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 13L17 6l14 7-14 7-14-7z" />
        <path d="M8 16v6c0 2.5 4 4.5 9 4.5s9-2 9-4.5v-6" />
        <path d="M31 13v8" />
      </svg>
    ),
  },
  {
    id: 'farming',
    slug: '/missions/organic-farming',
    cx: '52.2%',
    cy: '53.4%',
    line1: { hi: 'जैविक खेती', en: 'Organic Farming' },
    line2: { hi: 'और ग्रामीण विकास', en: '& Rural Development' },
    icon: (
      <svg viewBox="0 0 32 32" className="w-[1.8vw] min-w-[16px] max-w-[26px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 27V14" />
        <path d="M16 19c-6 0-10-4-10-10 6 0 10 4 10 10z" />
        <path d="M16 16c5.5 0 9.5-3.5 9.5-9-5.5 0-9.5 3.5-9.5 9z" />
      </svg>
    ),
  },
  {
    id: 'senior',
    slug: '/missions/senior-citizen-care',
    cx: '92.6%',
    cy: '43.2%',
    line1: { hi: 'वृद्धाश्रम एवं', en: 'Senior Care &' },
    line2: { hi: 'मानसिक स्वास्थ्य', en: 'Mental Well-being' },
    icon: (
      <svg viewBox="0 0 32 32" className="w-[1.8vw] min-w-[16px] max-w-[26px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 19s-6.5-4.2-6.5-8.5A3.8 3.8 0 0 1 16 7.8a3.8 3.8 0 0 1 6.5 2.7C22.5 14.8 16 19 16 19z" />
        <path d="M6 23.5c3-1.5 6.5-1.5 10 0 3.5 1.5 7 1.5 10-1" />
      </svg>
    ),
  },
  {
    id: 'carbon',
    slug: '/missions/carbon-credit',
    cx: '45.9%',
    cy: '72.4%',
    line1: { hi: 'कार्बन क्रेडिट एवं', en: 'Carbon Credit &' },
    line2: { hi: 'जलवायु कार्रवाई', en: 'Climate Action' },
    icon: (
      <svg viewBox="0 0 32 32" className="w-[1.8vw] min-w-[16px] max-w-[26px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 27v-7" />
        <path d="M12 27h8" />
        <path d="M9.5 19.5a5.5 5.5 0 0 1-.8-10.8 6.5 6.5 0 0 1 12.6-1.2 5 5 0 0 1 1.2 9.8H9.5z" />
      </svg>
    ),
  },
  {
    id: 'water',
    slug: '/harit-rajasthan',
    cx: '88.5%',
    cy: '64.4%',
    line1: { hi: 'जल संरक्षण', en: 'Water Conservation' },
    line2: { hi: 'और हरित गाँव', en: '& Green Village' },
    icon: (
      <svg viewBox="0 0 32 32" className="w-[1.8vw] min-w-[16px] max-w-[26px] h-auto text-white" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 5s8 9.2 8 15a8 8 0 0 1-16 0c0-5.8 8-15 8-15z" />
        <path d="M12.5 21a4 4 0 0 0 4 3" />
      </svg>
    ),
  },
];

const HERO_BOTTOM_ICONS = [
  {
    slug: '/missions/carbon-credit',
    line1: { hi: 'कार्बन कार्रवाई', en: 'Carbon Action' },
    line2: { hi: 'और नेट-ज़ीरो', en: '& Net-Zero' },
    svg: <ClimateActionSvg className="w-10 h-10 mx-auto" />,
  },
  {
    slug: '/missions/self-reliant-gaushala',
    line1: { hi: 'गौशाला', en: 'Gaushala' },
    line2: { hi: 'आत्मनिर्भरता', en: 'Self-Reliance' },
    svg: <GaushalaCowSvg className="w-10 h-10 mx-auto" />,
  },
  {
    slug: '/missions/senior-citizen-care',
    line1: { hi: 'सामाजिक', en: 'Social' },
    line2: { hi: 'कल्याण', en: 'Welfare' },
    svg: <RuralLivelihoodsSvg className="w-10 h-10 mx-auto" />,
  },
  {
    slug: '/missions/skill-development',
    line1: { hi: 'कौशल विकास', en: 'Skill Development' },
    line2: { hi: 'और आजीविका', en: '& Livelihoods' },
    svg: <SkillEducationSvg className="w-10 h-10 mx-auto" />,
  },
  {
    slug: '/harit-rajasthan',
    line1: { hi: 'जल संरक्षण', en: 'Water Conservation' },
    line2: { hi: 'और जल सुरक्षा', en: '& Water Security' },
    svg: <WaterConservationSvg className="w-10 h-10 mx-auto" />,
  },
  {
    slug: '/missions/heritage-solar-water',
    line1: { hi: 'सांस्कृतिक', en: 'Cultural' },
    line2: { hi: 'धरोहर संरक्षण', en: 'Heritage Protection' },
    svg: <HeritageFortSvg className="w-10 h-10 mx-auto" />,
  },
  {
    slug: '/missions/organic-farming',
    line1: { hi: 'जैविक खेती', en: 'Organic Farming' },
    line2: { hi: 'और प्राकृतिक संसाधन', en: '& Natural Resources' },
    svg: <AgroforestrySproutSvg className="w-10 h-10 mx-auto" />,
  },
  {
    slug: '/missions/biogas-cbg',
    line1: { hi: 'स्वच्छ ऊर्जा', en: 'Clean Energy' },
    line2: { hi: '(बायोगैस, CBG, सोलर)', en: '(Biogas, CBG, Solar)' },
    svg: <CleanEnergySvg className="w-10 h-10 mx-auto" />,
  },
];

export function HomePage({ lang, onNavigate }: HomePageProps) {
  const { bootstrap } = usePublicPortal();
  const liveDistricts = mergePublicDistricts(bootstrap?.districts);
  const liveEvent = bootstrap?.marathonEvents?.[0];
  const gov = bootstrap?.siteGovernance;
  const countdownTarget = liveEvent?.eventDate
    ? `${liveEvent.eventDate}T06:00:00+05:30`
    : undefined;
  const countdown = getMarathonCountdown(new Date(), countdownTarget);
  const showCountdown =
    liveEvent?.countdownEnabled !== false && !countdown.isPast;
  const publishedNews = (bootstrap?.contentItems ?? []).filter(
    (c) => c.status === 'Published' && (c.sectionType === 'news' || c.sectionType === 'mission_update')
  );
  const publishedMetrics = (bootstrap?.impactMetrics ?? []).filter((m) => m.isPublished);

  // Live Admin Homepage & Sections CMS controls (visibility, ordering, bilingual headings & CTAs)
  const cmsSections = bootstrap?.homepageSections ?? [];
  const cmsSectionMap = new Map(cmsSections.map((s) => [s.sectionKey, s]));
  const isSectionVisible = (key: string): boolean => {
    const cfg = cmsSectionMap.get(key);
    return !cfg || (cfg.enabled && cfg.visible);
  };
  const getSectionOrder = (key: string, fallback: number): number => {
    const cfg = cmsSectionMap.get(key);
    return cfg ? cfg.displayOrder : fallback;
  };
  const getSectionText = (
    key: string,
    field: 'heading' | 'subtitle' | 'ctaLabel',
    fallback: string
  ): string => {
    const cfg = cmsSectionMap.get(key);
    if (!cfg) return fallback;
    const raw =
      field === 'heading'
        ? lang === 'hi'
          ? cfg.headingHi || cfg.headingEn
          : cfg.headingEn || cfg.headingHi
        : field === 'subtitle'
        ? lang === 'hi'
          ? cfg.subtitleHi || cfg.subtitleEn
          : cfg.subtitleEn || cfg.subtitleHi
        : lang === 'hi'
        ? cfg.ctaLabelHi || cfg.ctaLabelEn
        : cfg.ctaLabelEn || cfg.ctaLabelHi;
    return raw?.trim() || fallback;
  };
  const getSectionCtaDest = (key: string, fallback: string): string => {
    const dest = cmsSectionMap.get(key)?.ctaDestination?.trim();
    return dest || fallback;
  };

  return (
    <div className="bg-white flex flex-col">
      {/* SECTION 2: REAL INTERACTIVE HERO SECTION — DESKTOP PANORAMA + MOBILE VISUAL-TOP FULL-SCREEN */}
      {isSectionVisible('hero') && (
      <section
        style={{ order: getSectionOrder('hero', 1) }}
        className="relative bg-white overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto">
          {/* MOBILE (< md): CREATIVE UNIFIED FULL-CANOPY TREE + SVG RAJASTHAN HORIZON + FROSTED TYPOGRAPHY AMALGAMATION */}
          <div className="md:hidden relative flex flex-col bg-gradient-to-b from-[#F2F9EF] via-white to-white overflow-hidden">
            {/* Top Atmospheric Sky Crown with Floating Kicker Badge */}
            <div className="relative z-20 pt-3 px-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-[#479D27]/25 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#68B836]" aria-hidden="true" />
                <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-[#154A21]">
                  A NATIONAL PEOPLE&apos;S INITIATIVE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#68B836]" aria-hidden="true" />
              </div>
            </div>

            {/* FULL FITTED TREE CANOPY (x=33.5%..99.5% mapped to 0%..100% viewport — ZERO leaf clipping!) */}
            <div className="relative w-full -mt-1 overflow-hidden select-none">
              <div className="relative w-[151%] -ml-[50.5%] aspect-[1600/670]">
                <img
                  src="/assets/hero-home-clean.jpg"
                  alt="GOVEDA Rajasthan Landscape and Central Mission Tree"
                  className="w-full h-full object-contain block pointer-events-none"
                />
                {TREE_LEAF_NODES.map((node) => (
                  <button
                    key={`mob-${node.id}`}
                    type="button"
                    onClick={() => onNavigate(node.slug)}
                    style={{ left: node.cx, top: node.cy }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center text-center px-1 py-0.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <span className="mb-0.5 scale-75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                      {node.icon}
                    </span>
                    <span className="block text-white font-bold text-[7.5px] sm:text-[9px] leading-[1.08] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
                      {node.line1[lang]}
                    </span>
                    <span className="block text-white/95 font-semibold text-[6.8px] sm:text-[8px] leading-[1.08] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap">
                      {node.line2[lang]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Multi-layered Atmospheric Mist Rising Out of the Tree Roots */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent"
                aria-hidden="true"
              />
            </div>

            {/* UNIFIED BOTANICAL TYPOGRAPHY & SVG LANDSCAPE RISING DIRECTLY FROM THE TREE ROOTS */}
            <div className="relative z-20 -mt-11 px-4 pt-2 pb-4 text-center">
              {/* Subtle Custom SVG Chhatri & Aravalli Botanical Watermark Behind Title */}
              <svg
                viewBox="0 0 400 110"
                fill="none"
                className="pointer-events-none absolute inset-x-0 -top-6 w-full h-28 opacity-25 select-none"
                aria-hidden="true"
              >
                <path d="M0 95 Q95 35 200 72 T400 52 L400 110 L0 110 Z" fill="#8BD448" />
                <g transform="translate(22, 28)" fill="#2E7D32">
                  <path d="M8 38 H36 L40 43 H4 Z" />
                  <path d="M11 22 V38 M18 22 V38 M26 22 V38 M33 22 V38" stroke="#2E7D32" strokeWidth="2" />
                  <path d="M6 22 Q22 4 38 22 Z" />
                </g>
                <g transform="translate(338, 22)" stroke="#2E7D32" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="16" y1="18" x2="16" y2="52" />
                  <path d="M16 18 L5 10 M16 18 L28 11 M16 18 L15 32" />
                </g>
              </svg>

              <h1 className="relative text-[2.15rem] leading-[1.1] font-extrabold text-[#154A21] tracking-tight">
                <span className="block">हरित राजस्थान से</span>
                <span className="inline-flex items-center justify-center gap-2 mt-0.5">
                  <span>हरित भारत</span>
                  <svg viewBox="0 0 64 52" className="w-9 h-7 inline-block shrink-0" fill="none" aria-hidden="true">
                    <path d="M10 42C12 18 34 6 58 6c-4 22-18 36-40 36-3 0-6-0.5-8 0z" fill="#76C032" />
                    <path d="M4 46c14-4 28-14 42-30" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M2 47c10 2 22 0 32-5" stroke="#2E7D32" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="relative mt-1 text-base font-bold italic text-[#236B31]">
                Green Rajasthan to Green India
              </p>

              {/* Amalgamated Botanical Pillar Chips */}
              <div className="relative mt-3 flex flex-wrap items-center justify-center gap-1.5">
                {(lang === 'hi'
                  ? [
                      'पर्यावरण संरक्षण',
                      'ग्रामीण समृद्धि',
                      'सामाजिक कल्याण',
                      'गौशाला आत्मनिर्भरता',
                      'सांस्कृतिक धरोहर',
                      'जल व ऊर्जा सुरक्षा',
                    ]
                  : [
                      'Environment',
                      'Rural Prosperity',
                      'Social Welfare',
                      'Gaushala Self-Reliance',
                      'Cultural Heritage',
                      'Water & Energy',
                    ]
                ).map((pillar) => (
                  <span
                    key={pillar}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F2F9EF]/90 border border-[#479D27]/25 text-[11px] font-semibold text-[#1B4324]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5BB439]" aria-hidden="true" />
                    <span>{pillar}</span>
                  </span>
                ))}
              </div>

              {/* Integrated Action Buttons */}
              <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/missions')}
                  className="spring-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1E5B2A] hover:bg-[#15461F] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'हमारे मिशन देखें' : 'Explore Missions'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/join/harit-mitra')}
                  className="spring-btn inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/95 hover:bg-[#F3F9F1] text-[#1A3820] border border-[#2E7D32]/75 text-xs font-semibold cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{lang === 'hi' ? 'हरित मित्र बनें' : 'Become Harit Mitra'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/partnership')}
                  className="spring-btn inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/95 hover:bg-[#F3F9F1] text-[#1A3820] border border-[#2E7D32]/75 text-xs font-semibold cursor-pointer"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{lang === 'hi' ? 'सहयोग करें' : 'Partner With Us'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* DESKTOP / TABLET (md+): APPROVED PANORAMIC HERO CANVAS (1600x670) */}
          <div className="hidden md:block relative w-full aspect-[1600/670] bg-white select-none overflow-hidden">
            {/* Spotless Background Illustration (Chhatri + Central Tree + 8 Velvety Leaves + Fort + Wave) */}
            <img
              src="/assets/hero-home-clean.jpg"
              alt="GOVEDA Rajasthan Landscape and Central Mission Tree"
              className="w-full h-full object-cover block pointer-events-none"
            />

            {/* LEFT COLUMN: 100% REAL SELECTABLE HTML TEXT & REAL INTERACTIVE BUTTONS (Desktop/Tablet md+) */}
            <div className="hidden md:flex flex-col justify-start absolute left-[3.5%] top-[6.2%] w-[36.5%] z-10 select-text">
              {/* Kicker */}
              <div className="flex items-center gap-3 mb-[1.1vw]">
                <span className="text-[0.88vw] min-text-[10px] font-bold tracking-[0.16em] uppercase text-[#1E2923]">
                  A NATIONAL PEOPLE&apos;S INITIATIVE
                </span>
                <span className="w-[3.4vw] h-[1.5px] bg-[#76C032]" aria-hidden="true" />
              </div>

              {/* Main Hindi Heading + Tilted Lime Leaf SVG */}
              <h1 className="text-[4.15vw] font-extrabold text-[#154A21] leading-[1.13] tracking-tight">
                <span className="block whitespace-nowrap">हरित राजस्थान से</span>
                <span className="inline-flex items-center gap-[0.6vw] whitespace-nowrap mt-[0.15vw]">
                  <span>हरित भारत</span>
                  <svg
                    viewBox="0 0 76 62"
                    className="w-[4.4vw] h-[3.6vw] inline-block shrink-0 -ml-[0.2vw] translate-y-[0.15vw]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M14 48C16 20 40 6 70 5c-5 27-22 44-48 44-3.5 0-6-0.4-8-1z"
                      fill="#76C032"
                    />
                    <path
                      d="M14 48C26 36 44 22 68 6c-12 22-28 36-54 42z"
                      fill="#62AD25"
                      fillOpacity="0.45"
                    />
                    <path
                      d="M6 53c16-4 34-16 50-34"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M34 33l10-2M26 40l11-2M43 24l8-1.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 55c12 3 26 1 38-5"
                      stroke="#2E7D32"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* English Subheading */}
              <p className="mt-[0.55vw] text-[1.72vw] font-semibold italic text-[#236B31] tracking-tight">
                Green Rajasthan to Green India
              </p>

              {/* Two-Line Mission Pillars (Real Selectable Text) */}
              <div className="mt-[1.25vw] text-[1.06vw] text-[#223026] font-medium leading-[1.65]">
                <p className="whitespace-nowrap">
                  {lang === 'hi' ? (
                    <>
                      पर्यावरण संरक्षण <span className="mx-[0.45vw] text-stone-400">|</span> ग्रामीण समृद्धि{' '}
                      <span className="mx-[0.45vw] text-stone-400">|</span> सामाजिक कल्याण
                    </>
                  ) : (
                    <>
                      Environmental Protection <span className="mx-[0.35vw] text-stone-400">|</span> Rural Prosperity{' '}
                      <span className="mx-[0.35vw] text-stone-400">|</span> Social Welfare
                    </>
                  )}
                </p>
                <p className="whitespace-nowrap">
                  {lang === 'hi' ? (
                    <>
                      गौशाला आत्मनिर्भरता <span className="mx-[0.45vw] text-stone-400">|</span> सांस्कृतिक धरोहर{' '}
                      <span className="mx-[0.45vw] text-stone-400">|</span> जल व ऊर्जा सुरक्षा
                    </>
                  ) : (
                    <>
                      Gaushala Self-Reliance <span className="mx-[0.35vw] text-stone-400">|</span> Cultural Heritage{' '}
                      <span className="mx-[0.35vw] text-stone-400">|</span> Water &amp; Energy Security
                    </>
                  )}
                </p>
              </div>

              {/* 3 Real Interactive HTML Pill Buttons */}
              <div className="mt-[1.65vw] flex items-center gap-[0.8vw]">
                <button
                  type="button"
                  onClick={() => onNavigate('/missions')}
                  className="spring-btn inline-flex items-center justify-center gap-[0.45vw] px-[1.35vw] py-[0.68vw] rounded-full bg-[#1E5B2A] hover:bg-[#14431D] text-white text-[0.92vw] font-semibold shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
                >
                  <span>{lang === 'hi' ? 'हमारे मिशन देखें' : 'Explore Missions'}</span>
                  <span aria-hidden="true" className="text-[1vw] leading-none">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/join?category=harit-mitra')}
                  className="spring-btn inline-flex items-center justify-center gap-[0.45vw] px-[1.25vw] py-[0.65vw] rounded-full bg-white/95 hover:bg-[#F2F9F0] text-[#1A3620] border-[1.5px] border-[#2E7D32]/75 text-[0.92vw] font-semibold shadow-2xs hover:shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Users className="w-[1.15vw] h-[1.15vw] text-[#236B31] shrink-0" />
                  <span>{lang === 'hi' ? 'हरित मित्र बनें' : 'Become Harit Mitra'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/partnership')}
                  className="spring-btn inline-flex items-center justify-center gap-[0.45vw] px-[1.25vw] py-[0.65vw] rounded-full bg-white/95 hover:bg-[#F2F9F0] text-[#1A3620] border-[1.5px] border-[#2E7D32]/75 text-[0.92vw] font-semibold shadow-2xs hover:shadow-md cursor-pointer whitespace-nowrap"
                >
                  <HeartHandshake className="w-[1.15vw] h-[1.15vw] text-[#236B31] shrink-0" />
                  <span>{lang === 'hi' ? 'सहयोग करें' : 'Partner With Us'}</span>
                </button>
              </div>
            </div>

            {/* RIGHT CANOPY: 8 REAL INTERACTIVE HTML + VECTOR SVG MISSION NODES INSIDE THE 8 TREE LEAVES */}
            {TREE_LEAF_NODES.map((node) => (
              <button
                key={node.id}
                type="button"
                data-testid={`hero-leaf-${node.id}`}
                onClick={() => onNavigate(node.slug)}
                style={{ left: node.cx, top: node.cy }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center text-center px-1.5 py-1 bg-transparent border-0 ring-0 focus-visible:outline-2 focus-visible:outline-white rounded-xl cursor-pointer select-text transition-transform duration-200 hover:scale-108"
              >
                <span className="mb-[0.15vw] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                  {node.icon}
                </span>
                <span className="block text-white font-bold text-[0.86vw] leading-[1.18] tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] group-hover:text-[#F4FFE9] whitespace-nowrap">
                  {node.line1[lang]}
                </span>
                <span className="block text-white font-bold text-[0.82vw] leading-[1.18] tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] group-hover:text-[#F4FFE9] whitespace-nowrap">
                  {node.line2[lang]}
                </span>
              </button>
            ))}
          </div>

          {/* BOTTOM 8-ICON STRIP: SEAMLESS FROSTED BAND WITH RICH DUAL-TONE GREEN SVGS */}
          <div className="relative z-10 bg-gradient-to-b from-white/90 via-[#FAFDF9] to-white px-3 sm:px-6 lg:px-10 pt-2 pb-5">
            <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-[#479D27]/15 shadow-[0_8px_24px_-12px_rgba(20,69,39,0.12)] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-y sm:divide-y-0 sm:divide-x divide-[#479D27]/15">
              {HERO_BOTTOM_ICONS.map((item) => (
                <button
                  key={item.slug + item.line1.en}
                  type="button"
                  onClick={() => onNavigate(item.slug)}
                  className="group px-2 py-3 flex flex-col items-center text-center hover:bg-[#F2F9F0]/90 transition-colors cursor-pointer select-text"
                >
                  <div className="mb-1.5 group-hover:scale-110 transition-transform duration-200">
                    {item.svg}
                  </div>
                  <span className="block text-xs sm:text-[13px] font-bold text-[#1B2B21] group-hover:text-[#1E5B2A] leading-snug">
                    {item.line1[lang]}
                  </span>
                  <span className="block text-xs sm:text-[13px] font-bold text-[#1B2B21] group-hover:text-[#1E5B2A] leading-snug">
                    {item.line2[lang]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* SECTION 4: WHO WE ARE — EDITORIAL SANDSTONE SHOWCASE + 10-MISSION RADIAL WHEEL + BLENDED FORT HORIZON */}
      {isSectionVisible('about') && (
        <div style={{ order: getSectionOrder('about', 2) }}>
          <WhoWeAreShowcase lang={lang} onNavigate={onNavigate} />
        </div>
      )}

      {/* SECTION 4.5: WHY IT MATTERS / क्यों ज़रूरी है यह मिशन? */}
      {isSectionVisible('about') && (
        <div style={{ order: getSectionOrder('about', 2) }}>
          <WhyItMattersShowcase lang={lang} onNavigate={onNavigate} />
        </div>
      )}

      {/* SECTION 5: OUR 10 MISSIONS / हमारे 10 प्रमुख मिशन */}
      {isSectionVisible('missions') && (
        <div style={{ order: getSectionOrder('missions', 3) }}>
          <OurTenMissionsShowcase lang={lang} onNavigate={onNavigate} />
        </div>
      )}

      {/* SECTION 6: HARIT RAJASTHAN CAMPAIGN + INTERACTIVE MAP & 5 FOCUS DISTRICTS */}
      {isSectionVisible('harit_rajasthan') && (
      <section
        style={{ order: getSectionOrder('harit_rajasthan', 4) }}
        className="py-14 lg:py-20 bg-white px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#388E3C]">
                {getSectionText(
                  'harit_rajasthan',
                  'subtitle',
                  lang === 'hi' ? 'GOVEDA की क्षेत्रीय हरित पहल' : "GOVEDA's Regional Green Initiative"
                )}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#144527] mt-1">
                {getSectionText(
                  'harit_rajasthan',
                  'heading',
                  lang === 'hi'
                    ? 'हरित राजस्थान — गाँव-गाँव से हरित क्रांति'
                    : 'Harit Rajasthan — Building a Greener Rajasthan, Village by Village'
                )}
              </h2>
            </div>
            <SpringButton
              variant="primary"
              size="md"
              onClick={() => onNavigate(getSectionCtaDest('harit_rajasthan', '/harit-rajasthan'))}
            >
              <span>
                {getSectionText(
                  'harit_rajasthan',
                  'ctaLabel',
                  lang === 'hi' ? 'हरित राजस्थान पेज देखें' : 'Open Harit Rajasthan Page'
                )}
              </span>
              <ArrowRight className="w-4 h-4" />
            </SpringButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <RajasthanMap
                lang={lang}
                onSelectDistrict={(slug) => onNavigate(`/harit-rajasthan/${slug}`)}
              />
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="p-4 sm:p-5 rounded-3xl bg-[#F3F8F2]/90 border border-[#479D27]/20 flex items-start gap-3.5">
                <TreePlantationSvg className="w-11 h-11 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-[#144527]">
                    {lang === 'hi'
                      ? 'प्रारंभिक फोकस जिले (Initial Focus Districts)'
                      : 'Initial Focus Districts — Phase 1'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                    {lang === 'hi'
                      ? 'हरित राजस्थान के प्रथम चरण में भीलवाड़ा, चूरू, बीकानेर, फलोदी और जोधपुर को प्रारंभिक फोकस क्षेत्र के रूप में चुना गया है। यह सूची आवश्यकता और सहयोग के अनुसार आगे विस्तारित की जा सकती है।'
                      : 'In Phase 1 of Harit Rajasthan, Bhilwara, Churu, Bikaner, Phalodi, and Jodhpur have been selected as initial focus districts. This list will expand according to local needs and partnerships.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {liveDistricts.map((d) => (
                  <SpringCard
                    key={d.slug}
                    onClick={() => onNavigate(`/harit-rajasthan/${d.slug}`)}
                    className="rounded-[24px] border border-[#479D27]/15 bg-white overflow-hidden shadow-xs hover:border-[#388E3C] group"
                  >
                    <SeamlessInlinePhoto
                      assetKey={d.imageKey}
                      alt={d.name[lang]}
                      className="h-28 w-full rounded-none"
                    />
                    <div className="p-3.5 -mt-2 relative z-10">
                      <h4 className="text-sm font-bold text-[#144527]">{d.name[lang]}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                        {d.focusSummary[lang]}
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32]">
                        <span>{lang === 'hi' ? 'अभियान देखें' : 'Explore Campaign'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </SpringCard>
                ))}

                {/* 6th Card: Join From Any District — Clean White Outlined Card */}
                <SpringCard
                  onClick={() => onNavigate('/join')}
                  className="rounded-2xl border-2 border-dashed border-[#388E3C]/35 bg-[#F6FAF5] p-4 flex flex-col justify-between hover:border-[#2E7D32]"
                >
                  <div>
                    <MapPin className="w-6 h-6 text-[#2E7D32] mb-2" />
                    <h4 className="text-sm font-bold text-[#144527]">
                      {lang === 'hi' ? 'अन्य जिले से जुड़ें' : 'Join From Your District'}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {lang === 'hi'
                        ? 'अपने गाँव या जिले में हरित अभियान शुरू करने हेतु रुचि दर्ज करें।'
                        : 'Register interest to start a green campaign in your village or district.'}
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1E5B2A]">
                    <span>{lang === 'hi' ? 'अभी जुड़ें →' : 'Register Now →'}</span>
                  </div>
                </SpringCard>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* SECTION 7: CARBON CREDIT SIMPLE EXPLANATION */}
      {isSectionVisible('projects') && (
      <section
        style={{ order: getSectionOrder('projects', 5) }}
        className="py-14 lg:py-20 bg-[#F3F8F2] px-4 sm:px-6 lg:px-8 border-y border-[#388E3C]/15"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">
                {lang === 'hi' ? 'किसान-केंद्रित सरल शिक्षा' : 'Farmer-Focused Climate Education'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#144527] leading-tight">
                {lang === 'hi'
                  ? 'कार्बन क्रेडिट क्या है और यह किसानों से कैसे जुड़ता है?'
                  : 'What Is a Carbon Credit & How Does It Connect Farmers?'}
              </h2>
              <p className="text-sm text-[#2D3B32] leading-relaxed">
                {lang === 'hi'
                  ? 'जब किसान और समुदाय वृक्षारोपण, कृषि वानिकी और टिकाऊ कृषि अपनाते हैं, तो पेड़ वायुमंडल से कार्बन डाइऑक्साइड (CO₂) सोखकर संचित करते हैं। वैज्ञानिक सत्यापन और रजिस्ट्री नियमों के अनुसार प्रमाणित होने पर 1 टन CO₂e की कमी या अवशोषण को 1 कार्बन क्रेडिट माना जाता है।'
                  : 'When farmers and communities adopt tree plantation, agroforestry, and sustainable practices, trees absorb and store atmospheric CO₂. Verified under recognized standards, 1 Tonne of CO₂e reduction or removal equals 1 Carbon Credit.'}
              </p>

              {/* Visual Equation Card */}
              <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-[#479D27]/25 shadow-xs flex items-center justify-around text-center">
                <div>
                  <AgroforestrySproutSvg className="w-11 h-11 mx-auto mb-1" />
                  <p className="text-sm font-bold text-[#144527]">
                    {lang === 'hi' ? '1 कार्बन क्रेडिट' : '1 Carbon Credit'}
                  </p>
                  <p className="text-[11px] text-stone-500">Verified Unit</p>
                </div>
                <span className="text-2xl font-bold text-[#388E3C]">=</span>
                <div>
                  <ClimateActionSvg className="w-11 h-11 mx-auto mb-1" />
                  <p className="text-sm font-bold text-[#144527]">
                    {lang === 'hi' ? '1 टन CO₂e' : '1 Tonne CO₂e'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'hi' ? 'कमी या अवशोषण' : 'Reduction or Removal'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <SpringButton
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('/missions/carbon-credit')}
                >
                  <span>{lang === 'hi' ? 'कार्बन क्रेडिट विस्तार से समझें' : 'Understand Carbon Credit'}</span>
                  <ArrowRight className="w-4 h-4" />
                </SpringButton>
                <SpringButton
                  variant="soft"
                  size="md"
                  onClick={() => onNavigate('/join?category=farmer')}
                >
                  <span>{lang === 'hi' ? 'किसान पंजीकरण' : 'Farmer Registration'}</span>
                </SpringButton>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-[#144527]">
                  {lang === 'hi'
                    ? 'कार्बन प्रोजेक्ट की 8-चरणीय प्रक्रिया (How a Carbon Project Works)'
                    : '8-Step Carbon Project Journey'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { step: '01', hi: 'परियोजना क्षेत्र चयन', en: 'Project Area' },
                    { step: '02', hi: 'बेसलाइन अध्ययन', en: 'Baseline Study' },
                    { step: '03', hi: 'पद्धति व पात्रता', en: 'Methodology' },
                    { step: '04', hi: 'वृक्षारोपण व क्रियान्वयन', en: 'Implementation' },
                    { step: '05', hi: 'वैज्ञानिक निगरानी (MRV)', en: 'Monitoring (MRV)' },
                    { step: '06', hi: 'स्वतंत्र सत्यापन', en: 'Verification' },
                    { step: '07', hi: 'रजिस्ट्री व क्रेडिट जारी', en: 'Credit Issuance' },
                    { step: '08', hi: 'पारदर्शी लाभ-साझेदारी', en: 'Benefit Sharing' },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="p-3 rounded-xl bg-[#FAFBF8] border border-stone-200/80"
                    >
                      <span className="text-xs font-bold text-[#388E3C] tabular-nums">
                        {item.step}.
                      </span>
                      <p className="text-xs font-semibold text-[#144527] mt-1">
                        {lang === 'hi' ? item.hi : item.en}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-600 bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 leading-relaxed">
                  {lang === 'hi'
                    ? 'महत्वपूर्ण सूचना: 100 पौधे लगाने का अर्थ स्वतः 100 कार्बन क्रेडिट मिलना नहीं है। कार्बन क्रेडिट या निश्चित आय की कोई गारंटी नहीं है; वास्तविक परिणाम परियोजना की पात्रता, वैज्ञानिक मापन, पौधों की जीवितता, स्वतंत्र सत्यापन और बाजार नियमों पर निर्भर करेगा।'
                    : 'Important Notice: Planting 100 saplings does not automatically equal 100 carbon credits. No guaranteed income is claimed; actual outcomes depend on eligibility, survival, scientific MRV, third-party verification, and market conditions.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* SECTION 8 & 9: GAUSHALA, BIOGAS & ORGANIC FARMING WITH SEAMLESS PHOTO CANVASES */}
      {isSectionVisible('projects') && (
      <section
        style={{ order: getSectionOrder('projects', 6) }}
        className="py-14 lg:py-20 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SeamlessPhotoCanvas
            assetKey="gaushalaBiogas"
            alt="Self-Reliant Gaushala and Biogas"
            iconName="Home"
            scenicVariant="gaushala"
            kicker={lang === 'hi' ? 'गौ-आधारित ग्रामीण अर्थव्यवस्था' : 'Cow-Centric Rural Economy'}
            title={
              lang === 'hi'
                ? 'आत्मनिर्भर गौशाला एवं बायोगैस / CBG मिशन'
                : 'Self-Reliant Gaushala & Biogas / CBG Mission'
            }
            description={
              lang === 'hi'
                ? 'गौशालाओं को केवल दान पर निर्भर न रखकर गोबर व गौ-मूत्र से जैविक खाद, वर्मी-कम्पोस्ट, बायोगैस, बायो-CNG (CBG) और प्राकृतिक उत्पादों के माध्यम से आर्थिक रूप से स्वावलंबी बनाना।'
                : 'Transforming Gaushalas from charity-dependent shelters into self-sustaining rural units through organic manure, vermicompost, biogas, and Bio-CNG (CBG).'
            }
            imageHeightClass="h-60 sm:h-68"
            actions={
              <>
                <SpringButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('/missions/self-reliant-gaushala')}
                >
                  <span>{lang === 'hi' ? 'गौशाला मिशन' : 'Gaushala Mission'}</span>
                </SpringButton>
                <SpringButton
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/join/gaushala')}
                >
                  <span>{lang === 'hi' ? 'गौशाला पंजीकरण' : 'Register Gaushala'}</span>
                </SpringButton>
              </>
            }
          />

          <SeamlessPhotoCanvas
            assetKey="organicAgroforestry"
            alt="Organic Farming and Water Conservation"
            iconName="Sprout"
            scenicVariant="water"
            kicker={lang === 'hi' ? 'टिकाऊ कृषि व संसाधन संरक्षण' : 'Sustainable Agriculture & Resources'}
            title={
              lang === 'hi'
                ? 'जैविक खेती, आधुनिक कृषि एवं कचरा प्रबंधन'
                : 'Organic Farming, Smart Agriculture & Waste Management'
            }
            description={
              lang === 'hi'
                ? 'रासायनिक उर्वरकों पर निर्भरता घटाकर मृदा स्वास्थ्य सुधारना, ड्रिप सिंचाई व कृषि वानिकी अपनाना और गाँव व शहर को जोड़ने वाला स्वच्छ कचरा रीसाइक्लिंग मॉडल विकसित करना।'
                : 'Reducing chemical dependency, restoring soil carbon, adopting drip irrigation and agroforestry, and building rural-urban waste recycling systems.'
            }
            imageHeightClass="h-60 sm:h-68"
            actions={
              <>
                <SpringButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('/missions/organic-farming')}
                >
                  <span>{lang === 'hi' ? 'जैविक व आधुनिक खेती' : 'Organic Farming'}</span>
                </SpringButton>
                <SpringButton
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/missions/clean-india-plastic-free')}
                >
                  <span>{lang === 'hi' ? 'स्वच्छ भारत मिशन' : 'Clean India Mission'}</span>
                </SpringButton>
              </>
            }
          />
        </div>
      </section>
      )}

      <div style={{ order: getSectionOrder('projects', 6) }}>
        <ScenicHorizonStrip variant="fort" />
      </div>

      {/* SECTION 10 & 11: SKILL DEVELOPMENT, FOREIGN LANGUAGES & SOCIAL WELFARE */}
      {isSectionVisible('missions') && (
      <section
        style={{ order: getSectionOrder('missions', 7) }}
        className="py-14 lg:py-20 bg-[#FAFBF8] px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <SeamlessPhotoCanvas
              assetKey="youthSkillLab"
              alt="Women entrepreneurship and youth skill development"
              iconName="GraduationCap"
              scenicVariant="skills"
              kicker={lang === 'hi' ? 'ग्रामीण युवा एवं महिला सशक्तिकरण' : 'Youth & Women Empowerment'}
              title={
                lang === 'hi'
                  ? 'कौशल विकास, उद्यमिता और विदेशी भाषा प्रशिक्षण'
                  : 'Skill Development, Entrepreneurship & Foreign Languages'
              }
              description={
                lang === 'hi'
                  ? 'जापानी, जर्मन, फ्रेंच और अंग्रेजी संवाद कौशल के साथ-साथ डिजिटल साक्षरता, ग्रीन जॉब्स और ग्रामीण महिला स्वरोजगार प्रशिक्षण।'
                  : 'Japanese, German, French, and English communication training alongside digital literacy, green jobs, and women entrepreneurship.'
              }
              imageHeightClass="h-64 sm:h-72"
              actions={
                <SpringButton variant="soft" size="sm" onClick={() => onNavigate('/join/skill-training')}>
                  <span>{lang === 'hi' ? 'प्रशिक्षण पंजीकरण' : 'Register for Training'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </SpringButton>
              }
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white/95 border border-[#479D27]/15 shadow-xs flex flex-col justify-between">
                <div>
                  <SkillEducationSvg className="w-10 h-10 mb-2.5" />
                  <h4 className="text-sm font-bold text-[#144527]">
                    {lang === 'hi' ? 'कौशल व विदेशी भाषाएँ' : 'Skills & Languages'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {lang === 'hi'
                      ? 'ग्रामीण युवाओं को राष्ट्रीय व अंतर्राष्ट्रीय रोजगार अवसरों के लिए तैयार करना।'
                      : 'Preparing rural youth for national and international career opportunities.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/missions/skill-development')}
                  className="mt-3 text-xs font-semibold text-[#1B5A32] hover:underline cursor-pointer text-left"
                >
                  {lang === 'hi' ? 'मिशन 7 देखें →' : 'View Mission 7 →'}
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-white/95 border border-[#479D27]/15 shadow-xs flex flex-col justify-between">
                <div>
                  <RuralLivelihoodsSvg className="w-10 h-10 mb-2.5" />
                  <h4 className="text-sm font-bold text-[#144527]">
                    {lang === 'hi' ? 'ग्रामीण उत्थान व सशक्तिकरण' : 'Rural Upliftment'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {lang === 'hi'
                      ? 'स्वयं सहायता समूह, महिला उद्यमिता और पर्यावरण संरक्षण गतिविधियाँ।'
                      : 'Self-help groups, women micro-enterprises, and green village initiatives.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/missions/women-empowerment')}
                  className="mt-3 text-xs font-semibold text-[#1B5A32] hover:underline cursor-pointer text-left"
                >
                  {lang === 'hi' ? 'मिशन 8 देखें →' : 'View Mission 8 →'}
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-white/95 border border-[#479D27]/15 shadow-xs flex flex-col justify-between">
                <div>
                  <SeniorCareSvg className="w-10 h-10 mb-2.5" />
                  <h4 className="text-sm font-bold text-[#144527]">
                    {lang === 'hi' ? 'वरिष्ठ नागरिक व मानसिक स्वास्थ्य' : 'Senior Care & Well-being'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {lang === 'hi'
                      ? 'बुजुर्गों के लिए सम्मानजनक देखभाल, परामर्श और अंतर-पीढ़ीगत जुड़ाव।'
                      : 'Dignified elder care, counseling support, and intergenerational bonding.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/missions/senior-citizen-care')}
                  className="mt-3 text-xs font-semibold text-[#1B5A32] hover:underline cursor-pointer text-left"
                >
                  {lang === 'hi' ? 'मिशन 9 देखें →' : 'View Mission 9 →'}
                </button>
              </div>
            </div>

            {/* Section 12: Heritage, Solar & Water Conservation Bar */}
            <div className="p-6 rounded-3xl bg-[#F3F8F2] border border-[#479D27]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <HeritageFortSvg className="w-12 h-12 shrink-0" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#8A6B2E] block">
                    {lang === 'hi'
                      ? 'मिशन 10 • शेखावाटी विरासत, सोलर एवं जल संरक्षण'
                      : 'Mission 10 • Heritage, Solar & Water Conservation'}
                  </span>
                  <h4 className="text-base font-bold text-[#144527]">
                    {lang === 'hi'
                      ? 'पारंपरिक बावड़ियों, जोहड़ों व ऐतिहासिक हवेलियों का संरक्षण और सौर ऊर्जा'
                      : 'Preserving Stepwells, Johads & Heritage Architecture Alongside Solar Adoption'}
                  </h4>
                </div>
              </div>
              <SpringButton
                variant="soft"
                size="sm"
                onClick={() => onNavigate('/missions/heritage-solar-water')}
                className="shrink-0"
              >
                <span>{lang === 'hi' ? 'विरासत मिशन देखें' : 'Explore Heritage Mission'}</span>
              </SpringButton>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* SECTION 13 & 14: UPCOMING EVENT (HARIT MARATHON) & ANNUAL MAGAZINE */}
      {(isSectionVisible('marathon') || isSectionVisible('news') || isSectionVisible('events')) && (
      <section
        style={{ order: getSectionOrder('marathon', 8) }}
        className="py-14 lg:py-20 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Harit Marathon Card — Driven dynamically from Admin Events */}
          <div className="lg:col-span-7 rounded-3xl bg-[#F3F8F2] border border-[#388E3C]/30 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">
                  {liveEvent?.status === 'Completed'
                    ? lang === 'hi'
                      ? 'संपन्न जन-अभियान'
                      : 'Completed Public Event'
                    : lang === 'hi'
                    ? 'आगामी प्रमुख जन-अभियान'
                    : 'Upcoming Flagship Public Event'}
                </span>
                <span className="text-xs font-semibold text-[#1E5B2A] bg-white px-3 py-1 rounded-full border border-[#388E3C]/25 tabular-nums">
                  {showCountdown
                    ? `${countdown.days} ${lang === 'hi' ? 'दिन शेष •' : 'Days Left •'} ${
                        liveEvent
                          ? lang === 'hi'
                            ? liveEvent.dateDisplayHi
                            : liveEvent.dateDisplayEn
                          : MARATHON_INFO.dateDisplay[lang]
                      }`
                    : liveEvent
                    ? lang === 'hi'
                      ? liveEvent.dateDisplayHi
                      : liveEvent.dateDisplayEn
                    : MARATHON_INFO.dateDisplay[lang]}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-[#144527]">
                {liveEvent
                  ? lang === 'hi'
                    ? liveEvent.titleHi
                    : liveEvent.titleEn
                  : MARATHON_INFO.title[lang]}
              </h3>
              <p className="text-sm text-[#2D3B32] leading-relaxed">
                {liveEvent
                  ? `${lang === 'hi' ? liveEvent.themeHi : liveEvent.themeEn} — ${
                      lang === 'hi' ? liveEvent.venueHi : liveEvent.venueEn
                    }`
                  : `${MARATHON_INFO.theme[lang]} — ${MARATHON_INFO.venue[lang]}`}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(liveEvent?.raceCategories && liveEvent.raceCategories.length > 0
                  ? liveEvent.raceCategories
                  : MARATHON_INFO.categories
                ).map((c) => (
                  <span
                    key={c.name}
                    className="text-xs bg-white border border-[#388E3C]/25 text-[#144527] px-3 py-1 rounded-lg font-medium"
                  >
                    {c.name} ({c.age})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#388E3C]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#1E5B2A] font-medium">
                <Trophy className="w-4 h-4 text-[#2E7D32]" />
                <span>
                  {lang === 'hi'
                    ? 'प्रत्येक धावक के नाम हरित राजस्थान के अंतर्गत वृक्षारोपण संकल्प'
                    : 'Every runner linked with a tree plantation pledge under Harit Rajasthan'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <SpringButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('/events/harit-marathon')}
                  className="!bg-[#1E5B2A]"
                >
                  <span>{lang === 'hi' ? 'मैराथन विवरण व पंजीकरण' : 'Marathon Details & Register'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </SpringButton>
              </div>
            </div>
          </div>

          {/* Quarterly Magazine Card — Driven dynamically from Site Governance */}
          <div className="lg:col-span-5 rounded-3xl bg-[#FAFBF8] border border-stone-200 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#2E7D32] uppercase tracking-wider">
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'त्रैमासिक प्रकाशन एवं ज्ञान मंच' : 'Quarterly Publication & Knowledge'}</span>
                </span>
                {gov && (
                  <span className="text-[10px] font-bold bg-[#E8F2E6] text-[#144527] px-2 py-0.5 rounded">
                    {gov.magazineRegStatus}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#144527]">
                {gov
                  ? lang === 'hi'
                    ? gov.magazineTitleHi
                    : gov.magazineTitleEn
                  : MAGAZINE_INFO.proposedName[lang]}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {MAGAZINE_INFO.note[lang]}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {MAGAZINE_INFO.sections.slice(0, 4).map((sec) => (
                  <span
                    key={sec.en}
                    className="text-[11px] bg-white border border-stone-200 text-stone-700 px-2.5 py-1 rounded-lg"
                  >
                    {sec[lang]}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
              <SpringButton
                variant="soft"
                size="sm"
                onClick={() => onNavigate('/magazine')}
              >
                <span>{lang === 'hi' ? 'पत्रिका पेज खोलें' : 'Open Magazine Page'}</span>
              </SpringButton>
              <SpringButton
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/training')}
              >
                <span>{lang === 'hi' ? 'ज्ञान केंद्र देखें' : 'Knowledge Hub'}</span>
              </SpringButton>
            </div>
          </div>
        </div>

        {/* Live Admin-Published News & Field Updates Strip (if any published) */}
        {publishedNews.length > 0 && (
          <div className="rounded-3xl border border-[#479D27]/20 bg-[#FAFBF8] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[#144527]">
                {lang === 'hi' ? 'ताज़ा समाचार एवं क्षेत्रीय अपडेट्स' : 'Latest Foundation News & Field Updates'}
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('/events')}
                className="text-xs font-semibold text-[#1B5A32] hover:underline cursor-pointer"
              >
                {lang === 'hi' ? 'सभी अपडेट्स देखें →' : 'View All Events & Media →'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishedNews.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-stone-200 p-4 space-y-1.5"
                >
                  <span className="text-[11px] font-semibold text-[#368737]">{item.categoryTag}</span>
                  <h4 className="text-sm font-bold text-[#144527]">
                    {lang === 'hi' && item.titleHi ? item.titleHi : item.titleEn}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {lang === 'hi' && item.summaryHi ? item.summaryHi : item.summaryEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      )}

      {/* SECTION 15: JOIN GOVEDA — 12 DEDICATED PARTICIPATION & REGISTRATION PATHWAYS */}
      {isSectionVisible('registrations') && (
      <section
        style={{ order: getSectionOrder('registrations', 9) }}
        className="py-14 lg:py-20 bg-[#F3F8F2] px-4 sm:px-6 lg:px-8 border-t border-[#388E3C]/15"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">
              {getSectionText(
                'registrations',
                'subtitle',
                lang === 'hi'
                  ? 'जन-सहभागिता मंच • 12 समर्पित पंजीकरण फॉर्म'
                  : 'Public Participation Portal • 12 Dedicated Registration Forms'
              )}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#144527] mt-1">
              {getSectionText(
                'registrations',
                'heading',
                lang === 'hi'
                  ? 'GOVEDA से जुड़ें — अपनी समर्पित श्रेणी चुनें'
                  : 'Join GOVEDA — Choose Your Dedicated Form'
              )}
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              {lang === 'hi'
                ? 'किसान, हरित मित्र, गौशाला, स्कूल/कॉलेज, महिला SHG, कौशल प्रशिक्षण, स्वयंसेवक, मैराथन या CSR साझेदार के लिए अलग-अलग समर्पित फॉर्म उपलब्ध हैं।'
                : 'Select any of our 12 specialized forms tailored for Farmers, Harit Mitras, Gaushalas, Green Campuses, Women SHGs, Skill Courses, Volunteers, Marathon Runners, CSR Partners, NGOs, Trainers, and Members.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                cat: 'farmer',
                num: '01',
                iconName: 'Sprout',
                hi: 'किसान पंजीकरण (Farmer Form)',
                en: 'Farmer Registration Form',
                descHi: 'कृषि वानिकी, वृक्षारोपण, भूमि विवरण, सिंचाई व कार्बन परियोजनाओं हेतु।',
                descEn: 'Landholding, irrigation, plantation count & agroforestry carbon registration.',
              },
              {
                cat: 'harit-mitra',
                num: '02',
                iconName: 'Users',
                hi: 'हरित मित्र पंजीकरण (Harit Mitra)',
                en: 'Harit Mitra Registration Form',
                descHi: 'ग्राम समन्वय, किसान जागरूकता एवं पौध जीवितता निगरानी हेतु।',
                descEn: 'Village cluster coordination, farmer outreach & sapling survival monitoring.',
              },
              {
                cat: 'gaushala',
                num: '03',
                iconName: 'Home',
                hi: 'गौशाला साझेदारी (Gaushala Form)',
                en: 'Gaushala Partnership Form',
                descHi: 'गौवंश संख्या, गोबर उपलब्धता, जैविक खाद एवं बायोगैस/CBG संयंत्र हेतु।',
                descEn: 'Cattle count, dung capacity, vermicompost & biogas/CBG unit registration.',
              },
              {
                cat: 'school-college',
                num: '04',
                iconName: 'GraduationCap',
                hi: 'स्कूल / कॉलेज हरित परिसर',
                en: 'School / College Green Campus',
                descHi: 'संस्थान प्रमुख, छात्र संख्या, इको-क्लब एवं कैंपस वृक्षारोपण हेतु।',
                descEn: 'Principal contact, student count, Eco-Club & Green Campus plantation drive.',
              },
              {
                cat: 'women-shg',
                num: '05',
                iconName: 'Users',
                hi: 'महिला SHG एवं ग्राम उत्थान',
                en: 'Women SHG & Rural Enterprise',
                descHi: 'स्वयं सहायता समूह सदस्य संख्या, कपड़े के थैले, नर्सरी व कुटीर उद्योग हेतु।',
                descEn: 'SHG group size, cloth-bag stitching, organic packaging & micro-enterprise.',
              },
              {
                cat: 'skill-training',
                num: '06',
                iconName: 'GraduationCap',
                hi: 'कौशल एवं विदेशी भाषा प्रशिक्षण',
                en: 'Youth Skill & Language Course',
                descHi: 'जापानी, जर्मन, फ्रेंच, अंग्रेजी संवाद व ग्रीन जॉब्स कोर्स में प्रवेश हेतु।',
                descEn: 'Japanese, German, French, Spoken English & Green Jobs course admission.',
              },
              {
                cat: 'volunteer',
                num: '07',
                iconName: 'HeartHandshake',
                hi: 'स्वयंसेवक पंजीकरण (Volunteer)',
                en: 'Youth & Civic Volunteer Form',
                descHi: 'वृक्षारोपण अभियान, मीडिया, ग्राउंड सर्वे एवं सामुदायिक सेवा हेतु।',
                descEn: 'Field plantation drives, digital media, MRV surveys & community service.',
              },
              {
                cat: 'marathon',
                num: '08',
                iconName: 'SunMedium',
                hi: 'हरित मैराथन 2026 (Marathon)',
                en: 'Harit Marathon Runner Form',
                descHi: '3K, 5K, 10K व 21K दौड़ श्रेणी, आयु वर्ग एवं टी-शर्ट आकार पंजीकरण।',
                descEn: '3K, 5K, 10K & 21K run category, age group & runner kit registration.',
              },
              {
                cat: 'csr-partner',
                num: '09',
                iconName: 'Landmark',
                hi: 'CSR एवं कॉर्पोरेट साझेदारी',
                en: 'CSR & Corporate Partnership',
                descHi: 'कंपनी विवरण, CSR फोकस क्षेत्र, जिला चयन एवं परियोजना बजट समन्वय।',
                descEn: 'Corporate CSR desk, ESG focus pillar, target district & project proposal.',
              },
              {
                cat: 'ngo-institution',
                num: '10',
                iconName: 'Trees',
                hi: 'NGO एवं सामाजिक संस्था सहयोग',
                en: 'NGO & Institutional MoU Form',
                descHi: 'पंजीकरण प्रकार, कार्यक्षेत्र एवं संयुक्त ग्राम हरित अभियान हेतु।',
                descEn: 'Trust/Society registration, active blocks & joint field implementation.',
              },
              {
                cat: 'expert-trainer',
                num: '11',
                iconName: 'CloudSun',
                hi: 'कृषि / पर्यावरण विशेषज्ञ व प्रशिक्षक',
                en: 'Expert, Scientist & Trainer Form',
                descHi: 'कृषि विज्ञान, कार्बन MRV, पशु चिकित्सा व भाषा प्रशिक्षक पैनल हेतु।',
                descEn: 'Agronomy, Carbon MRV, Veterinary, Biogas & Language faculty onboarding.',
              },
              {
                cat: 'membership',
                num: '12',
                iconName: 'HeartHandshake',
                hi: 'सामान्य सदस्यता एवं पत्रिका',
                en: 'General Membership & Magazine',
                descHi: 'आजीवन/वार्षिक सदस्यता एवं हरित भारत संवाद पत्रिका से जुड़ने हेतु।',
                descEn: 'Foundation membership, green pledge & Harit Bharat Samvad subscription.',
              },
            ].map((item) => (
              <SpringCard
                key={item.cat}
                onClick={() => onNavigate(`/join/${item.cat}`)}
                className="bg-white/95 rounded-3xl p-5 border border-[#479D27]/20 shadow-xs hover:border-[#388E3C] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F3F8F2] border border-[#479D27]/20 flex items-center justify-center p-1.5">
                      <GovedaMissionSvg iconName={item.iconName} className="w-full h-full" />
                    </div>
                    <span className="text-[11px] font-bold text-[#2E7D32] bg-[#F3F8F2] px-2.5 py-1 rounded-full border border-[#479D27]/20 tabular-nums">
                      Form #{item.num}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#144527]">
                    {lang === 'hi' ? item.hi : item.en}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {lang === 'hi' ? item.descHi : item.descEn}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#1B5A32]">
                  <span>{lang === 'hi' ? 'समर्पित फॉर्म खोलें' : 'Open Dedicated Form'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </SpringCard>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* SECTION 16: TRANSPARENCY & GOVERNANCE COMMITMENT */}
      {isSectionVisible('csr') && (
      <section
        style={{ order: getSectionOrder('csr', 10) }}
        className="py-12 bg-white px-4 sm:px-6 lg:px-8 border-t border-stone-200/80"
      >
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-[#FAFBF8] border border-stone-200 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2E7D32]">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? 'पारदर्शिता, सत्यनिष्ठा और अनुपालन प्रतिबद्धता'
                    : 'Transparency, Integrity & Governance Commitment'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#144527]">
                {lang === 'hi'
                  ? 'केवल सत्यापित प्रगति आँकड़े • कोई काल्पनिक दावा नहीं'
                  : 'Only Verified Progress Figures Published • Zero Fake Claims'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'GOVEDA Carbon & Climate India Foundation एक पंजीकृत Section 8 गैर-लाभकारी संस्था है। हमारी नीति है कि किसी भी मिशन या जिले में केवल धरातल पर सत्यापित आँकड़े ही प्रकाशित किए जाते हैं और किसानों या सहभागियों से कोई भ्रामक वित्तीय वादा नहीं किया जाता।'
                  : 'GOVEDA Carbon & Climate India Foundation is a registered Section 8 non-profit institution. We publish only ground-verified figures and never make misleading financial or guaranteed-return claims to farmers or participants.'}
              </p>
              {publishedMetrics.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-3">
                  {publishedMetrics.slice(0, 4).map((m) => (
                    <span
                      key={m.metricKey}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#479D27]/25 text-xs font-semibold text-[#144527]"
                    >
                      <span className="font-mono font-bold tabular-nums">
                        {m.verifiedValue.toLocaleString('en-IN')}
                      </span>
                      <span className="text-stone-600 font-normal">
                        {lang === 'hi' ? m.labelHi : m.labelEn}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
              <SpringButton
                variant="soft"
                size="md"
                onClick={() => onNavigate('/projects')}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{lang === 'hi' ? 'प्रगति डैशबोर्ड' : 'Progress Dashboard'}</span>
              </SpringButton>
              <SpringButton
                variant="outline"
                size="md"
                onClick={() => onNavigate('/legal/disclaimer')}
              >
                <span>{lang === 'hi' ? 'अस्वीकरण पढ़ें' : 'Read Disclaimer'}</span>
              </SpringButton>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
