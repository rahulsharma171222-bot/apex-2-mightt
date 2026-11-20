import React, { useRef, useState } from 'react';
import {
  Leaf,
  Trees,
  Sprout,
  Layers,
  AlertTriangle,
  Info,
  ArrowRight,
  ArrowLeft,
  Droplets,
  Users,
  Sun,
  ShieldCheck,
  Award,
  SlidersHorizontal,
  Heart,
  ChevronsRight,
} from 'lucide-react';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import { MinimalistEditorialHeader } from './MinimalistMissionPrimitives';
import { estimateIndicativeCarbonImpact } from '../utils/govedaLogic';
import type { Language } from '../types/goveda';

/* ============================================================================
   1. EDITORIAL SECTION HEADING (Re-exported cleanly for CarbonCreditPage)
   ============================================================================ */
export { MinimalistEditorialHeader as EditorialSectionHeading };

/* ============================================================================
   2. HERO — "GROWING A GREENER FUTURE"
      Monumental borderless Master Style tree + glowing golden roots +
      subtle organic sage contour waves behind soil flare + floating CO₂ glass
      orb + 3 crisp unboxed SVG elbow leader callouts (matching reference!)
   ============================================================================ */
interface CarbonArtisticHeroProps {
  lang: Language;
  onNavigate: (path: string) => void;
  onScrollTo: (sectionId: string) => void;
}

interface HeroTreeAnnotation {
  id: 'air' | 'wood' | 'soil';
  pinNum: string;
  titleHi: string;
  titleEn: string;
  subHi: string;
  subEn: string;
  /** Target node on tree inside 780x560 SVG coordinate space */
  node: [number, number];
  /** Elbow + endpoint connecting directly to right-side circular emblem */
  elbow: [number, number];
  end: [number, number];
  /** Mobile pin % coordinates on the 4:3 hero tree image */
  mobTop: string;
  mobLeft: string;
  cardTop: string;
  icon: React.ReactNode;
}

const HERO_TREE_ANNOTATIONS: HeroTreeAnnotation[] = [
  {
    id: 'air',
    pinNum: '1',
    titleHi: 'हवा से CO₂ अवशोषित करता है',
    titleEn: 'Absorbs CO₂ from the air',
    subHi: 'सूर्य की रोशनी में हरी पत्तियाँ हवा से कार्बन खींचकर ऑक्सीजन छोड़ती हैं',
    subEn: 'Sunlit foliage draws atmospheric CO₂ and releases clean oxygen',
    node: [386, 174],
    elbow: [468, 92],
    end: [544, 92],
    mobTop: '30%',
    mobLeft: '62%',
    cardTop: '10.5%',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" aria-hidden="true">
        <path
          d="M7 24 C9 11 18 6 27 7 C24 18 17 24 7 24 Z"
          fill="#69B332"
        />
        <path
          d="M8.5 22.5 C14 17 19.5 12.5 25.5 8.5"
          stroke="#154A22"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'wood',
    pinNum: '2',
    titleHi: 'तने व लकड़ी में कार्बन संग्रहण',
    titleEn: 'Stores carbon in wood',
    subHi: 'मजबूत तने, शाखाओं और छाल में दशकों तक ठोस जैविक कार्बन सुरक्षित रहता है',
    subEn: 'Solid trunk and branches lock carbon safely for decades',
    node: [338, 304],
    elbow: [458, 286],
    end: [544, 286],
    mobTop: '56%',
    mobLeft: '54%',
    cardTop: '45%',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.45" aria-hidden="true">
        <circle cx="16" cy="16" r="11" fill="#F2F9E6" />
        <circle cx="16" cy="16" r="7.5" />
        <circle cx="16" cy="16" r="4" />
        <circle cx="16" cy="16" r="1.3" fill="#154A22" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'soil',
    pinNum: '3',
    titleHi: 'मिट्टी में दीर्घकालिक जैविक कार्बन',
    titleEn: 'Builds long-term soil carbon',
    subHi: 'गहरी चमकती जड़ें और जैविक ह्यूमस खेत की मिट्टी को उपजाऊ व नम बनाते हैं',
    subEn: 'Deep branching roots build rich living farm humus underground',
    node: [396, 444],
    elbow: [472, 462],
    end: [544, 462],
    mobTop: '78%',
    mobLeft: '60%',
    cardTop: '76.5%',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#154A22" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="16,7 26,12 16,17 6,12" fill="#DCEFC2" />
        <polyline points="6,17 16,22 26,17" />
        <polyline points="6,22 16,27 26,22" stroke="#5EA433" />
      </svg>
    ),
  },
];

const HERO_TRANSPARENT_HIGHLIGHTS = [
  {
    id: 'unit',
    targetId: 'cc-what',
    valueHi: '1 क्रेडिट = 1 tCO₂e',
    valueEn: '1 Credit = 1 tCO₂e',
    subHi: 'मानक सत्यापित कार्बन इकाई',
    subEn: 'Verified Standard Unit',
    icon: Leaf,
  },
  {
    id: 'ownership',
    targetId: 'cc-role',
    valueHi: '100% किसान स्वामित्व',
    valueEn: '100% Farmer Land',
    subHi: 'भूमि का पूर्ण अधिकार किसान के पास',
    subEn: 'Ownership Always With Farmer',
    icon: ShieldCheck,
  },
  {
    id: 'lifecycle',
    targetId: 'cc-steps',
    valueHi: '10-चरणीय प्रक्रिया',
    valueEn: '10-Step Lifecycle',
    subHi: 'वैज्ञानिक MRV व स्वतंत्र ऑडिट',
    subEn: 'Scientific MRV & Audit',
    icon: Award,
  },
  {
    id: 'districts',
    targetId: 'cc-bhilwara',
    valueHi: '5 फोकस जिले',
    valueEn: '5 Focus Districts',
    subHi: 'भीलवाड़ा, चूरू, बीकानेर, फलोदी, जोधपुर',
    subEn: 'Rajasthan Phase-1 Rollout',
    icon: Trees,
  },
];

export function CarbonArtisticHero({
  lang,
  onNavigate,
  onScrollTo,
}: CarbonArtisticHeroProps) {
  const [activeNote, setActiveNote] = useState<'air' | 'wood' | 'soil'>('air');
  const activeDetail =
    HERO_TREE_ANNOTATIONS.find((n) => n.id === activeNote) ?? HERO_TREE_ANNOTATIONS[0];

  return (
    <section className="relative bg-white overflow-hidden border-b border-[#E3EED8]">
      {/* SUBTLE WARM SUNLIGHT WASH AT TOP-RIGHT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-[8%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(246,232,178,0.28)_0%,rgba(246,232,178,0.08)_46%,rgba(255,255,255,0)_74%)]"
      />

      {/* DELICATE TRANSLUCENT SAGE TOPOGRAPHIC WAVES & FINE CONTOUR LINEWORK
          (Flows behind the tree soil flare & across the bottom margin without any box!) */}
      <svg
        viewBox="0 0 1440 360"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[270px] sm:h-[340px] lg:h-[390px] select-none"
      >
        <defs>
          <linearGradient id="ccHeroWaveSoft1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5FAEE" stopOpacity="0.1" />
            <stop offset="55%" stopColor="#EAF5DC" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#DCEEC4" stopOpacity="0.82" />
          </linearGradient>
          <linearGradient id="ccHeroWaveSoft2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EDF6E2" stopOpacity="0.72" />
            <stop offset="48%" stopColor="#D7ECBA" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#C4E29C" stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id="ccHeroWaveBase" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E4F1D3" stopOpacity="0.58" />
            <stop offset="35%" stopColor="#A8D466" stopOpacity="0.46" />
            <stop offset="72%" stopColor="#E7F3D8" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#9ED05A" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* High misty wave behind tree trunk & right soil flare */}
        <path
          d="M520 215 C740 120 960 210 1160 118 C1275 64 1368 62 1440 82 L1440 360 L520 360 Z"
          fill="url(#ccHeroWaveSoft1)"
        />
        {/* Mid sweeping wave curving beneath roots */}
        <path
          d="M0 292 C230 225 460 318 760 250 C1040 186 1255 154 1440 198 L1440 360 L0 360 Z"
          fill="url(#ccHeroWaveSoft2)"
        />
        {/* Ground undulating sage-lime wave */}
        <path
          d="M0 322 C240 282 470 356 770 304 C1060 254 1275 268 1440 242 L1440 360 L0 360 Z"
          fill="url(#ccHeroWaveBase)"
        />

        {/* Whisper-thin organic topographic contour lines flowing gently up and down */}
        <path
          d="M0 278 C175 242 350 314 580 272 C820 228 1085 262 1440 202"
          stroke="#95C466"
          strokeOpacity="0.34"
          strokeWidth="1.15"
        />
        <path
          d="M0 290 C190 256 365 328 595 284 C835 240 1095 274 1440 216"
          stroke="#A8D17B"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
        <path
          d="M0 302 C205 270 380 340 612 296 C850 252 1105 288 1440 230"
          stroke="#89BA58"
          strokeOpacity="0.24"
          strokeWidth="0.9"
        />
        <path
          d="M0 315 C220 284 398 352 630 308 C868 264 1118 302 1440 246"
          stroke="#79AE48"
          strokeOpacity="0.2"
          strokeWidth="0.85"
        />
      </svg>

      {/* Main Content Container — NOTE: No z-index stacking trap here so mix-blend-multiply
          melts the white backdrop of the hero tree directly into the organic contour waves! */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-8 sm:pb-11 relative">
        {/* Back Breadcrumb */}
        <button
          type="button"
          onClick={() => onNavigate('/missions')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5A32] hover:underline mb-3 sm:mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{lang === 'hi' ? 'सभी 10 मिशन देखें' : 'Back to All 10 Missions'}</span>
        </button>

        {/* ============================================================
            DESKTOP HERO LAYOUT (lg+): EXACT REFERENCE ALIGNMENT
            Left Editorial Copy (5 cols) + Right Monumental Seamless Tree
            with CO₂ Glass Orbs & 3 Unboxed Bent Leader Callouts (7 cols)
           ============================================================ */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-2 items-center">
          {/* LEFT EDITORIAL COLUMN */}
          <div className="lg:col-span-5 space-y-5 pr-2">
            <div className="flex items-center gap-3.5">
              <span className={`text-[12px] font-extrabold tracking-[0.14em] text-[#245A28] ${lang === 'hi' ? 'font-hindi tracking-[0.04em]' : 'uppercase'}`}>
                {lang === 'hi'
                  ? 'मिशन 01 · GOVEDA मुख्य मिशन'
                  : 'Mission 01 · GOVEDA Flagship Mission'}
              </span>
              <span className="h-[1.5px] w-14 bg-[#C4A662]" aria-hidden="true" />
            </div>

            <h1
              className={`text-[2.75rem] xl:text-[3.45rem] font-extrabold text-[#123D1B] leading-[1.08] tracking-tight text-balance ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? (
                <>
                  <span className="block">कार्बन क्रेडिट एवं</span>
                  <span className="inline-flex items-end gap-2 text-[#1B5A32]">
                    <span>जलवायु कार्रवाई</span>
                    <svg
                      viewBox="0 0 64 26"
                      fill="none"
                      aria-hidden="true"
                      className="w-11 h-5 mb-1 shrink-0"
                    >
                      <path
                        d="M2 20 C22 24 42 18 58 6 C53 16 42 23 24 23 C14 23 6 22 2 20 Z"
                        fill="#7BC043"
                      />
                      <path
                        d="M42 14 C47 6 55 3 62 4 C59 12 52 17 42 14 Z"
                        fill="#6BB235"
                      />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  <span className="block">Carbon Credit &amp;</span>
                  <span className="inline-flex items-end gap-2 text-[#1B5A32]">
                    <span>Climate Action</span>
                    <svg
                      viewBox="0 0 64 26"
                      fill="none"
                      aria-hidden="true"
                      className="w-11 h-5 mb-1 shrink-0"
                    >
                      <path
                        d="M2 20 C22 24 42 18 58 6 C53 16 42 23 24 23 C14 23 6 22 2 20 Z"
                        fill="#7BC043"
                      />
                      <path
                        d="M42 14 C47 6 55 3 62 4 C59 12 52 17 42 14 Z"
                        fill="#6BB235"
                      />
                    </svg>
                  </span>
                </>
              )}
            </h1>

            {/* Clean Unboxed Editorial Subtitle + Lime Hairline Rule */}
            <div className="space-y-2">
              <p
                className={`text-[15.5px] font-semibold italic text-[#25522B] ${
                  lang === 'hi' ? 'font-editorial' : 'font-hindi not-italic'
                }`}
              >
                {lang === 'hi'
                  ? 'हरित भविष्य की ओर एक कदम · Growing a Greener Future'
                  : 'Growing a Greener Future · कार्बन क्रेडिट एवं जलवायु कार्रवाई'}
              </p>
              <span className="block h-[2px] w-24 rounded-full bg-[#8DC64B]" aria-hidden="true" />
            </div>

            <p
              className={`text-[15.5px] text-[#2D4032] leading-[1.72] max-w-[44ch] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'किसानों और ग्रामीण समुदायों के साथ मिलकर पात्र वृक्ष-आधारित जलवायु परियोजनाओं के माध्यम से पारिस्थितिकी पुनरुद्धार, कार्बन अवशोषण और टिकाऊ ग्रामीण भविष्य का निर्माण।'
                : 'Working with farmers and communities on eligible tree-based and climate projects to restore ecosystems, sequester carbon and build long-term environmental value.'}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-1 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onScrollTo('cc-approach')}
                className="spring-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#154A22] text-white text-sm font-bold hover:bg-[#1E622E] cursor-pointer whitespace-nowrap shadow-[0_12px_24px_-12px_rgba(21,74,34,0.6)]"
              >
                <span>{lang === 'hi' ? 'मिशन को जानें' : 'Explore the Mission'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onScrollTo('cc-register')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/95 text-[#153E1E] border border-[#2C6432]/45 text-sm font-bold hover:bg-[#F3FAE9] hover:border-[#154A22] cursor-pointer whitespace-nowrap"
              >
                <Sprout className="w-4 h-4 text-[#2F6D26]" aria-hidden="true" />
                <span>{lang === 'hi' ? 'रुचि पंजीकृत करें' : 'Register Interest'}</span>
              </button>
            </div>

            <p
              className={`text-[12px] text-[#4C6152] leading-relaxed ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'ईमानदार नीति · कोई गारंटीकृत आय नहीं · 100% भूमि स्वामित्व किसान के पास · स्वतंत्र MRV सत्यापन'
                : 'Honest Policy · Zero guaranteed income claims · 100% farmer land ownership · Independent MRV'}
            </p>
          </div>

          {/* RIGHT MONUMENTAL SEAMLESS TREE STAGE (NO BOXES, NO WHITE BORDERS!) */}
          <div className="lg:col-span-7 relative h-[535px] xl:h-[575px] select-none -ml-6">
            {/* Subtle concentric botanical aura rings behind canopy & soil flare */}
            <svg
              viewBox="0 0 780 560"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full"
            >
              <circle
                cx="315"
                cy="275"
                r="225"
                stroke="#C5E09C"
                strokeOpacity="0.28"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <circle
                cx="315"
                cy="275"
                r="172"
                stroke="#DFC98A"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            </svg>

            {/* MASSIVE BORDERLESS TREE & GLOWING ROOTS ARTWORK
                mix-blend-multiply dissolves pure #FFFFFF invisibly into the sage waves below! */}
            <img
              src={GENERATED_ASSETS.carbonMasterHeroTree}
              alt={
                lang === 'hi'
                  ? 'सूरज की रोशनी में खिला विशाल देशी वृक्ष और चमकती जड़ों का चित्र जो हवा से CO₂ अवशोषित कर तने व मिट्टी में संग्रहित करता है'
                  : 'Monumental sunlit native broadleaf tree with glowing golden root network absorbing atmospheric CO2 into wood and soil'
              }
              referrerPolicy="no-referrer"
              className="absolute -top-4 left-0 w-[78%] h-[106%] object-contain object-center mix-blend-multiply contrast-[1.03] brightness-[1.02] pointer-events-none"
            />

            {/* Floating Translucent Glass CO₂ Bubble Cluster + Curved Organic Intake Arrow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[6%] left-[2%] flex items-center"
            >
              <div className="relative w-[78px] h-[78px] rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.98)_0%,rgba(232,246,238,0.88)_55%,rgba(195,227,212,0.72)_100%)] border border-white/95 shadow-[0_12px_26px_-10px_rgba(27,90,50,0.22)] flex items-center justify-center">
                <span className="text-[22px] font-extrabold text-[#153E1E] tracking-tight">
                  CO<sub className="text-xs font-bold">2</sub>
                </span>
                <span className="absolute -top-2.5 -left-2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#CFE5D7_100%)] border border-white/80 opacity-85" />
                <span className="absolute top-2 -right-3 w-3 h-3 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#CFE5D7_100%)] border border-white/80 opacity-80" />
                <span className="absolute -bottom-3 left-2 w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#CFE5D7_100%)] border border-white/80 opacity-75" />
              </div>
              <svg viewBox="0 0 78 52" className="w-[74px] h-[48px] -ml-2 mt-9" fill="none">
                <defs>
                  <linearGradient id="ccIntakeArrow" x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#A6DC66" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#65AF2F" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                <path
                  d="M4 10 C22 25 42 32 62 32"
                  stroke="url(#ccIntakeArrow)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <polygon points="75,32 56,21 59,41" fill="#65AF2F" />
              </svg>
            </div>

            {/* Crisp Thin Bent Elbow Leader Lines + Luminous Target Rings */}
            <svg
              viewBox="0 0 780 560"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full"
            >
              {HERO_TREE_ANNOTATIONS.map((note) => {
                const isFocused = activeNote === note.id;
                return (
                  <g key={`hero-line-${note.id}`}>
                    <polyline
                      points={`${note.node[0]},${note.node[1]} ${note.elbow[0]},${note.elbow[1]} ${note.end[0]},${note.end[1]}`}
                      stroke={isFocused ? '#154A22' : '#4E7D44'}
                      strokeWidth={isFocused ? '2' : '1.4'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
                    />
                    {/* Soft glowing botanical halo around target point */}
                    <circle
                      cx={note.node[0]}
                      cy={note.node[1]}
                      r={isFocused ? '14' : '10'}
                      fill="#BCEB76"
                      fillOpacity={isFocused ? '0.62' : '0.38'}
                    />
                    <circle
                      cx={note.node[0]}
                      cy={note.node[1]}
                      r="5"
                      fill="#FFFFFF"
                      stroke="#2B7230"
                      strokeWidth="2.4"
                    />
                  </g>
                );
              })}
            </svg>

            {/* 3 UNBOXED EDITORIAL RIGHT-SIDE CALLOUTS (EXACT REFERENCE ALIGNMENT!) */}
            {HERO_TREE_ANNOTATIONS.map((note) => {
              const isFocused = activeNote === note.id;
              return (
                <button
                  key={note.id}
                  type="button"
                  style={{ top: note.cardTop, left: '70.5%', width: '29.5%' }}
                  onMouseEnter={() => setActiveNote(note.id)}
                  onFocus={() => setActiveNote(note.id)}
                  onClick={() => {
                    setActiveNote(note.id);
                    onScrollTo('cc-tree');
                  }}
                  className="group absolute text-left flex items-center gap-3 py-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6D26] rounded-xl"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isFocused
                        ? 'bg-white border-[1.5px] border-[#2E7D32] shadow-[0_10px_24px_-10px_rgba(21,74,34,0.34)] scale-105'
                        : 'bg-white/90 border border-[#CFE4B2] group-hover:border-[#6EB83A]'
                    }`}
                  >
                    {note.icon}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[14px] xl:text-[15px] font-extrabold leading-[1.22] transition-colors ${
                        isFocused ? 'text-[#0E3618]' : 'text-[#1E4726]'
                      } ${lang === 'hi' ? 'font-hindi' : ''}`}
                    >
                      {lang === 'hi' ? note.titleHi : note.titleEn}
                    </p>
                    <p
                      className={`mt-1 text-[11px] leading-snug transition-opacity duration-200 ${
                        isFocused ? 'text-[#395440] opacity-100' : 'text-[#597060] opacity-80'
                      } ${lang === 'hi' ? 'font-hindi' : ''}`}
                    >
                      {lang === 'hi' ? note.subHi : note.subEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            MOBILE & TABLET HERO (< lg):
            Title -> Subtitle -> Full-Width Borderless Tree w/ Tappable Glowing
            Nodes + 1 Clean Explanation Line -> Copy + CTAs
           ============================================================ */}
        <div className="lg:hidden space-y-5">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className={`text-[11.5px] font-extrabold tracking-[0.12em] text-[#245A28] ${lang === 'hi' ? 'font-hindi tracking-[0.03em]' : 'uppercase'}`}>
                {lang === 'hi'
                  ? 'मिशन 01 · GOVEDA मुख्य मिशन'
                  : 'Mission 01 · GOVEDA Flagship Mission'}
              </span>
              <span className="h-[1.5px] w-10 bg-[#C4A662]" aria-hidden="true" />
            </div>

            <h1
              className={`text-[2rem] sm:text-[2.65rem] font-extrabold text-[#123D1B] leading-[1.12] tracking-tight text-balance ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi'
                ? 'कार्बन क्रेडिट एवं जलवायु कार्रवाई'
                : 'Carbon Credit & Climate Action'}
            </h1>

            <div className="space-y-1.5">
              <p
                className={`text-xs sm:text-sm font-semibold italic text-[#25522B] ${
                  lang === 'hi' ? 'font-editorial' : 'font-hindi not-italic'
                }`}
              >
                {lang === 'hi'
                  ? 'हरित भविष्य की ओर एक कदम · Growing a Greener Future'
                  : 'Growing a Greener Future · कार्बन क्रेडिट एवं जलवायु कार्रवाई'}
              </p>
              <span className="block h-[2px] w-20 rounded-full bg-[#8DC64B]" aria-hidden="true" />
            </div>
          </div>

          {/* Mobile Borderless Tree Illustration + Always-Visible Bent SVG Leader Lines (Just Like Desktop!) */}
          <div className="relative mx-auto max-w-[430px] pt-2 pb-1">
            <div className="relative w-full aspect-[10/9] flex items-center justify-center">
              <img
                src={GENERATED_ASSETS.carbonMasterHeroTree}
                alt={
                  lang === 'hi'
                    ? 'सूरज की रोशनी में खिला देशी वृक्ष और चमकती जड़ों का चित्र'
                    : 'Sunlit native tree with glowing root network storing carbon in wood and soil'
                }
                referrerPolicy="no-referrer"
                className="w-[74%] h-[88%] object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02] select-none pointer-events-none"
              />

              {/* Floating CO₂ mini-bubble at top-left */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[6%] left-[3%] w-11 h-11 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff_0%,#DCEFE5_100%)] border border-white shadow-sm flex items-center justify-center"
              >
                <span className="text-[11px] font-extrabold text-[#153E1E]">
                  CO<sub>2</sub>
                </span>
              </div>

              {/* Crisp Bent SVG Elbow Leader Lines Branching Left & Right from Leaves, Trunk, and Roots */}
              <svg
                viewBox="0 0 400 360"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full"
              >
                {/* 1. Leaves → Top-Right Elbow */}
                <polyline
                  points="232,118 268,62 302,62"
                  stroke={activeNote === 'air' ? '#154A22' : '#4E7D44'}
                  strokeWidth={activeNote === 'air' ? 2.1 : 1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="232" cy="118" r={activeNote === 'air' ? 9 : 6.5} fill="#BCEB76" fillOpacity="0.55" />
                <circle cx="232" cy="118" r="3.8" fill="#FFFFFF" stroke="#2B7230" strokeWidth="2" />

                {/* 2. Trunk → Mid-Left Elbow */}
                <polyline
                  points="192,196 142,196 106,196"
                  stroke={activeNote === 'wood' ? '#154A22' : '#4E7D44'}
                  strokeWidth={activeNote === 'wood' ? 2.1 : 1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="192" cy="196" r={activeNote === 'wood' ? 9 : 6.5} fill="#BCEB76" fillOpacity="0.55" />
                <circle cx="192" cy="196" r="3.8" fill="#FFFFFF" stroke="#2B7230" strokeWidth="2" />

                {/* 3. Roots → Bottom-Right Elbow */}
                <polyline
                  points="224,268 264,300 296,300"
                  stroke={activeNote === 'soil' ? '#154A22' : '#4E7D44'}
                  strokeWidth={activeNote === 'soil' ? 2.1 : 1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="224" cy="268" r={activeNote === 'soil' ? 9 : 6.5} fill="#BCEB76" fillOpacity="0.55" />
                <circle cx="224" cy="268" r="3.8" fill="#FFFFFF" stroke="#2B7230" strokeWidth="2" />
              </svg>

              {/* Direct Visual Callout 1 — Top-Right (Leaves / CO₂) */}
              <button
                type="button"
                onClick={() => setActiveNote('air')}
                className={`absolute top-[4%] right-[1%] max-w-[132px] text-left rounded-xl px-2.5 py-1.5 transition-all cursor-pointer border ${
                  activeNote === 'air'
                    ? 'bg-white border-[#5EA433] shadow-sm'
                    : 'bg-white/90 border-[#D8E7C5]'
                }`}
              >
                <p className={`text-[10.5px] font-extrabold text-[#123D1B] leading-tight ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? '1. हवा से CO₂ अवशोषण' : '1. Absorbs CO₂'}
                </p>
                <p className="text-[9.5px] text-[#455B4B] leading-tight mt-0.5">
                  {lang === 'hi' ? 'हरी पत्तियों द्वारा' : 'Through sunlit leaves'}
                </p>
              </button>

              {/* Direct Visual Callout 2 — Mid-Left (Trunk / Wood) */}
              <button
                type="button"
                onClick={() => setActiveNote('wood')}
                className={`absolute top-[46%] left-[1%] max-w-[122px] text-left rounded-xl px-2.5 py-1.5 transition-all cursor-pointer border ${
                  activeNote === 'wood'
                    ? 'bg-white border-[#5EA433] shadow-sm'
                    : 'bg-white/90 border-[#D8E7C5]'
                }`}
              >
                <p className={`text-[10.5px] font-extrabold text-[#123D1B] leading-tight ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? '2. तने में संग्रहण' : '2. Wood Storage'}
                </p>
                <p className="text-[9.5px] text-[#455B4B] leading-tight mt-0.5">
                  {lang === 'hi' ? 'दशकों तक ठोस कार्बन' : 'Locked in trunk'}
                </p>
              </button>

              {/* Direct Visual Callout 3 — Bottom-Right (Roots / Soil) */}
              <button
                type="button"
                onClick={() => setActiveNote('soil')}
                className={`absolute bottom-[3%] right-[1%] max-w-[136px] text-left rounded-xl px-2.5 py-1.5 transition-all cursor-pointer border ${
                  activeNote === 'soil'
                    ? 'bg-white border-[#5EA433] shadow-sm'
                    : 'bg-white/90 border-[#D8E7C5]'
                }`}
              >
                <p className={`text-[10.5px] font-extrabold text-[#123D1B] leading-tight ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? '3. मिट्टी व जड़ों में' : '3. Soil Carbon'}
                </p>
                <p className="text-[9.5px] text-[#455B4B] leading-tight mt-0.5">
                  {lang === 'hi' ? 'उपजाऊ जैविक ह्यूमस' : 'Deep living roots'}
                </p>
              </button>
            </div>
          </div>

          {/* Crisp Detailed Explanation Bar for Selected Part */}
          <div className="rounded-2xl bg-white/95 border border-[#D4E6BE] px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F3FAE8] border border-[#CBE4A5] flex items-center justify-center shrink-0">
              {activeDetail.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs sm:text-sm font-extrabold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {activeDetail.pinNum}. {lang === 'hi' ? activeDetail.titleHi : activeDetail.titleEn}
              </p>
              <p className={`text-[11.5px] text-[#455B4B] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? activeDetail.subHi : activeDetail.subEn}
              </p>
            </div>
          </div>

          {/* Plain-Language Explanation & Action Buttons */}
          <div className="space-y-4">
            <p className={`text-sm text-[#2D4032] leading-[1.7] ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'किसानों और ग्रामीण समुदायों के साथ मिलकर पात्र वृक्ष-आधारित जलवायु परियोजनाओं के माध्यम से पारिस्थितिकी पुनरुद्धार, कार्बन अवशोषण और टिकाऊ ग्रामीण भविष्य का निर्माण।'
                : 'Working with farmers and communities on eligible tree-based and climate projects to restore ecosystems, sequester carbon and build long-term environmental value.'}
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onScrollTo('cc-approach')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#154A22] text-white text-xs sm:text-sm font-bold hover:bg-[#1E622E] cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'hi' ? 'मिशन को जानें' : 'Explore the Mission'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onScrollTo('cc-register')}
                className="spring-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#153E1E] border border-[#2C6432]/45 text-xs sm:text-sm font-bold hover:bg-[#F3FAE9] cursor-pointer whitespace-nowrap"
              >
                <Sprout className="w-4 h-4 text-[#2F6D26]" aria-hidden="true" />
                <span>{lang === 'hi' ? 'रुचि पंजीकृत करें' : 'Register Interest'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* FLOATING 4-COLUMN HONEST SCOPE STRIP AT HERO BASE */}
        <div className="mt-6 lg:mt-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#DCEAD0] bg-white/92 backdrop-blur-xs rounded-2xl border border-[#DCEAD0] shadow-[0_14px_34px_-20px_rgba(21,62,30,0.22)] overflow-hidden">
            {HERO_TRANSPARENT_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onScrollTo(item.targetId)}
                  className="group px-3.5 py-3.5 sm:px-5 sm:py-4 flex items-center gap-3 text-left hover:bg-[#F4FAEC] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F6D26]"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EDF7DA] text-[#1E6B2E] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-[15px] font-extrabold text-[#153E1E] leading-tight tabular-nums ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? item.valueHi : item.valueEn}
                    </p>
                    <p
                      className={`mt-0.5 text-[10.5px] sm:text-[11px] text-[#4A6050] leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? item.subHi : item.subEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   3. "प्रकृति. किसान. कार्बन संतुलन." — FULL-BLEED PANORAMIC EDITORIAL MASTERPIECE
      Directly inspired by the user's panoramic Rajasthan fort + village pond +
      terraced agroforestry valley + right tree with glowing roots + sculpted
      double-curve ivory wave foreground with 3 unboxed editorial columns!
   ============================================================================ */
export function CarbonNaturePeopleApproach({
  lang,
  onScrollTo,
}: {
  lang: Language;
  onScrollTo: (sectionId: string) => void;
}) {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const pillars = [
    {
      id: 'eco',
      titleHi: 'पारिस्थितिकी पुनर्स्थापन',
      titleEn: 'Ecological Restoration',
      descHi: 'वृक्षारोपण, देशी प्रजातियाँ और प्राकृतिक पारिस्थितिक तंत्र की पुनर्बहाली',
      descEn: 'Native tree plantation, resilient species, and living ecosystem recovery',
      deepHi:
        'राजस्थान की मिट्टी व वर्षा के अनुरूप खेजड़ी, नीम, रोहिड़ा, आंवला और स्थानीय फलदार वृक्ष लगाकर उजड़ी मेड़ों व खेतों को फिर से जीवित बनाना।',
      deepEn:
        'Planting climate-adapted Khejri, Neem, Rohida, and Amla along farm borders and degraded pastures to bring back shade, pollinators, and moisture.',
      icon: (
        <svg viewBox="0 0 60 44" className="w-14 h-11" fill="none" aria-hidden="true">
          <path d="M16 34V22" stroke="#235F2B" strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="16" cy="18" r="6.5" stroke="#235F2B" strokeWidth="1.9" fill="#F2F9E6" />
          <path d="M30 35V18" stroke="#195224" strokeWidth="2.3" strokeLinecap="round" />
          <circle cx="30" cy="13" r="8" stroke="#195224" strokeWidth="2" fill="#E6F4CF" />
          <path d="M44 34V24" stroke="#235F2B" strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="44" cy="20" r="6" stroke="#235F2B" strokeWidth="1.9" fill="#F2F9E6" />
          <path d="M10 36 C22 33 38 33 50 36" stroke="#76B83E" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M16 40 C26 38 36 38 44 40" stroke="#A4D169" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'farmers',
      titleHi: 'किसान व समुदाय सशक्तिकरण',
      titleEn: 'Farmer & Community Empowerment',
      descHi: 'जल, मृदा और आय आधारित जलवायु-संवेदनशील खेती को बढ़ावा',
      descEn: 'Strengthening water, soil health, and climate-resilient rural farming',
      deepHi:
        'गाँव-गाँव में स्थानीय हरित मित्रों व किसान समूहों के साथ मिलकर पेड़ बचाना—ताकि भूमि का 100% स्वामित्व किसान के पास रहते हुए फल, चारा व बेहतर फसल मिले।',
      deepEn:
        'Organizing village clusters with local Harit Mitras so smallholders keep 100% land ownership while gaining shade, fodder, fruit, and soil moisture.',
      icon: (
        <svg viewBox="0 0 60 44" className="w-14 h-11" fill="none" aria-hidden="true">
          {/* Center Sprout */}
          <path d="M30 22V10" stroke="#235F2B" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 16 C25 14 23 11 23 8 C27 8 29.5 11 30 16 Z" fill="#76B83E" />
          <path d="M30 13 C35 11 37 8 37 5 C33 5 30.5 8 30 13 Z" fill="#3B822D" />
          {/* Three community silhouettes */}
          <circle cx="17" cy="24" r="3.4" stroke="#235F2B" strokeWidth="1.9" />
          <path d="M11 36 C11 31.5 13.5 29.5 17 29.5 C20.5 29.5 23 31.5 23 36" stroke="#235F2B" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="43" cy="24" r="3.4" stroke="#235F2B" strokeWidth="1.9" />
          <path d="M37 36 C37 31.5 39.5 29.5 43 29.5 C46.5 29.5 49 31.5 49 36" stroke="#235F2B" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="30" cy="25" r="3.8" stroke="#154A22" strokeWidth="2" fill="#EBF7D8" />
          <path d="M23.5 37.5 C23.5 32.5 26.2 30.2 30 30.2 C33.8 30.2 36.5 32.5 36.5 37.5" stroke="#154A22" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="39.5" x2="48" y2="39.5" stroke="#76B83E" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'carbon',
      titleHi: 'पारदर्शी कार्बन मूल्य',
      titleEn: 'Transparent Carbon Value',
      descHi: 'वैज्ञानिक MRV, सत्यापित कार्बन क्रेडिट और निष्पक्ष लाभ साझेदारी',
      descEn: 'Scientific MRV, independent verification, and fair written benefit sharing',
      deepHi:
        'बिना किसी झूठे वादे के, बहु-वर्षीय वैज्ञानिक निगरानी और स्वतंत्र तीसरे पक्ष के ऑडिट के बाद ही कार्बन क्रेडिट जारी होते हैं व पूर्व लिखित समझौते से शुद्ध लाभ साझा होता है।',
      deepEn:
        'Zero false guarantees: multi-year scientific MRV and accredited independent audits verify every credit, with net proceeds shared under prior written terms.',
      icon: (
        <svg viewBox="0 0 60 44" className="w-14 h-11" fill="none" aria-hidden="true">
          <path
            d="M15 29 H36 A8 8 0 0 0 37 13.2 A10.5 10.5 0 0 0 17.5 11 A7.5 7.5 0 0 0 15 29 Z"
            fill="#F2F9E6"
            stroke="#1E5D28"
            strokeWidth="2"
          />
          <text x="26" y="24" textAnchor="middle" fill="#153E1E" fontSize="10.5" fontWeight="800">
            CO₂
          </text>
          <path
            d="M42 20 L51 23.5 V30 C51 35 47 38.5 42 40 C37 38.5 33 35 33 30 V23.5 L42 20 Z"
            fill="#FFFFFF"
            stroke="#1E5D28"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M38.5 30 L41 32.5 L46 27.5" stroke="#5EA433" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const focusAreas = [
    { icon: Trees, hi: 'वृक्ष-आधारित कार्बन पहल', en: 'Tree-Based Carbon', targetId: 'cc-plantation' },
    { icon: Droplets, hi: 'जल एवं भूमि पुनरुद्धार', en: 'Water & Soil', targetId: 'cc-why' },
    { icon: Sprout, hi: 'टिकाऊ कृषि-वानिकी', en: 'Agroforestry', targetId: 'cc-example' },
    { icon: Leaf, hi: 'जैव-विविधता संरक्षण', en: 'Biodiversity', targetId: 'cc-tree' },
    { icon: Users, hi: 'ग्रामीण आजीविका मजबूती', en: 'Rural Livelihoods', targetId: 'cc-role' },
    { icon: Sun, hi: 'भीलवाड़ा हरित लक्ष्य', en: 'Regional Targets', targetId: 'cc-bhilwara' },
  ];

  return (
    <section
      id="cc-approach"
      className="scroll-mt-32 relative bg-[#FCFBF7] border-b border-[#DCEAD0] overflow-hidden"
    >
      {/* FULL-BLEED PANORAMIC CANVAS WITH LUMINOUS SKY TOP & SUNLIT RAJASTHAN VALLEY */}
      <div className="relative w-full">
        {/* Top Clean Sky Gradient Melting Smoothly Into Panoramic Landscape */}
        <div className="relative w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[640px] flex flex-col justify-between overflow-hidden">
          {/* Panoramic Editorial Artwork */}
          <img
            src={GENERATED_ASSETS.carbonMasterApproachPanorama}
            alt={
              lang === 'hi'
                ? 'राजस्थान के पहाड़ी किले, ग्रामीण जल सरोवर, हरी-भरी सीढ़ीदार खेती और चमकती जड़ों वाले देशी वृक्ष का विहंगम दृश्य'
                : 'Panoramic Rajasthan restoration landscape showing sandstone hill fort, village johad water pond, emerald terraced farmland, and sunlit tree with glowing roots'
            }
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-[center_74%] sm:object-[center_58%] select-none"
          />

          {/* Soft Luminous Ivory Sky Scrim at Top for Razor-Sharp Editorial Typography on Mobile & Desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[66%] sm:h-[56%] bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/95 sm:via-[#FFFFFF]/88 to-transparent"
          />

          {/* CENTERED MONUMENTAL HEADLINE OVER LUMINOUS SKY (EXACT REFERENCE COMPOSITION!) */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 text-center">
            <div className="inline-flex items-center justify-center gap-3">
              <span className="h-[1.5px] w-10 sm:w-14 bg-[#8DC454]" aria-hidden="true" />
              <Leaf className="w-4 h-4 text-[#5DA432] shrink-0" aria-hidden="true" />
              <span
                className={`text-xs sm:text-sm font-extrabold tracking-[0.12em] text-[#245C29] ${
                  lang === 'hi' ? 'font-hindi tracking-normal' : 'uppercase'
                }`}
              >
                {lang === 'hi'
                  ? 'कार्बन क्रेडिट एवं जलवायु कार्य'
                  : 'Carbon Credit & Climate Action'}
              </span>
              <span className="h-[1.5px] w-10 sm:w-14 bg-[#8DC454]" aria-hidden="true" />
            </div>

            <h2
              className={`mt-3 text-[2rem] sm:text-[3rem] lg:text-[3.75rem] font-extrabold text-[#123D1B] leading-[1.12] tracking-tight text-balance ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? (
                <>
                  प्रकृति. किसान.{' '}
                  <span className="relative inline-block">
                    कार्बन संतुलन.
                    <svg
                      viewBox="0 0 260 16"
                      fill="none"
                      aria-hidden="true"
                      className="absolute -bottom-2 left-0 w-full h-3.5 pointer-events-none"
                    >
                      <path
                        d="M6 10 C82 2 184 16 254 5"
                        stroke="#7EC043"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  Nature. Farmers.{' '}
                  <span className="relative inline-block">
                    Carbon Balance.
                    <svg
                      viewBox="0 0 260 16"
                      fill="none"
                      aria-hidden="true"
                      className="absolute -bottom-2 left-0 w-full h-3.5 pointer-events-none"
                    >
                      <path
                        d="M6 10 C82 2 184 16 254 5"
                        stroke="#7EC043"
                        strokeWidth="4.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </>
              )}
            </h2>

            <p
              className={`mt-4 mx-auto max-w-[60ch] text-sm sm:text-base lg:text-[17px] text-[#243B2B] font-medium leading-[1.68] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'GOVEDA एक समग्र मॉडल के माध्यम से पारिस्थितिकी पुनर्स्थापन, किसान कल्याण और विज्ञान-आधारित कार्बन मूल्य को एक ही कड़ी में जोड़ता है।'
                : 'GOVEDA connects ecological restoration, farmer well-being, and science-led carbon value into one cohesive rural climate model.'}
            </p>
          </div>

          {/* Subtle Floating CO₂ Down-Flow Indicator Over the Terraced Green Valley */}
          <div
            aria-hidden="true"
            className="hidden sm:flex relative z-10 justify-end max-w-6xl w-full mx-auto px-12 pb-16 lg:pb-24 pointer-events-none"
          >
            <div className="mr-[16%] lg:mr-[22%] flex flex-col items-center">
              <span className="text-lg font-extrabold text-[#4B7736] drop-shadow-[0_1px_6px_rgba(255,255,255,0.95)]">
                CO<sub className="text-xs">2</sub>
              </span>
              <svg viewBox="0 0 20 26" className="w-4 h-5 text-[#5D9E32] -mt-0.5" fill="none">
                <path d="M5 4l5 5 5-5M5 11l5 5 5-5M5 18l5 5 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* SCULPTED DOUBLE-CURVED ORGANIC IVORY WAVE RISING OVER LOWER PANORAMA */}
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="relative z-10 w-full h-14 sm:h-20 lg:h-24 -mb-px block select-none"
          >
            {/* Soft translucent sage outer wave crest */}
            <path
              d="M0 44 C260 -12 520 76 820 42 C1100 10 1290 58 1440 20 L1440 120 L0 120 Z"
              fill="#CFE0AE"
              fillOpacity="0.65"
            />
            {/* Main clean warm-ivory foreground curve */}
            <path
              d="M0 62 C250 12 510 92 820 56 C1095 24 1295 72 1440 36 L1440 120 L0 120 Z"
              fill="#FBFBF6"
            />
          </svg>
        </div>

        {/* 3 UNBOXED EDITORIAL PILLARS CRADLED IN THE SCULPTED IVORY FOREGROUND */}
        <div className="bg-gradient-to-b from-[#FBFBF6] via-[#FAF9F2] to-white pb-12 sm:pb-16 pt-2">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#C8DCAA]">
              {pillars.map((p, idx) => {
                const isSelected = selectedPillar === idx;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPillar(idx)}
                    className={`group py-6 md:py-3 md:px-7 flex flex-col items-center text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6D26] ${
                      isSelected ? 'bg-white/70 md:bg-transparent' : ''
                    }`}
                  >
                    <div className="mb-2.5 transition-transform duration-200 group-hover:-translate-y-0.5">
                      {p.icon}
                    </div>
                    <h3
                      className={`text-lg sm:text-[19px] font-extrabold leading-snug transition-colors ${
                        isSelected ? 'text-[#123D1B]' : 'text-[#1B4A24] group-hover:text-[#123D1B]'
                      } ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}
                    >
                      {lang === 'hi' ? p.titleHi : p.titleEn}
                    </h3>
                    <p
                      className={`mt-1.5 text-xs sm:text-[13.5px] text-[#354B3B] leading-[1.62] max-w-[30ch] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? p.descHi : p.descEn}
                    </p>
                    <span
                      className={`mt-3 h-0.5 rounded-full transition-all duration-200 ${
                        isSelected ? 'w-12 bg-[#69B332]' : 'w-5 bg-[#CFE2B4] group-hover:w-8'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            {/* Quiet Expanded Editorial Ground-Reality Note for Selected Pillar */}
            <div className="max-w-3xl mx-auto text-center border-y border-[#E2ECD5] py-3.5 px-4">
              <p className={`text-xs sm:text-sm text-[#2A4231] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                <span className="font-extrabold text-[#1E622B]">
                  {lang === 'hi' ? pillars[selectedPillar].titleHi : pillars[selectedPillar].titleEn}:{' '}
                </span>
                {lang === 'hi' ? pillars[selectedPillar].deepHi : pillars[selectedPillar].deepEn}
              </p>
            </div>

            {/* Quiet Hairline Focus-Area Quick Navigation Ribbon */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
              {focusAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <button
                    key={area.en}
                    type="button"
                    onClick={() => onScrollTo(area.targetId)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#27542D] hover:text-[#123D1B] hover:underline underline-offset-4 cursor-pointer py-1"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#66AE35]" aria-hidden="true" />
                    <span className={lang === 'hi' ? 'font-hindi' : ''}>
                      {lang === 'hi' ? area.hi : area.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   4. "कार्बन क्रेडिट कैसे जनरेट होता है?" — MUSEUM-GRADE 4-STAGE SEQUENTIAL FLOW
      Desktop: 4-column horizontal left-to-right flow with sage curve & » chevrons.
      Mobile: Sequential horizontal left-to-right scroll-snap track with live »
      connectors & interactive 01 → 02 → 03 → 04 stage rail so progression is
      immediately visible from left to right!
   ============================================================================ */
export function CarbonHowImpactFlow({
  lang,
  onScrollTo,
}: {
  lang: Language;
  onScrollTo: (sectionId: string) => void;
}) {
  const [activeStage, setActiveStage] = useState<number>(0);
  const mobileRailRef = useRef<HTMLDivElement | null>(null);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const flowStages: {
    id: string;
    stepNum: string;
    assetKey: AssetKey;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
    detailHi: string;
    detailEn: string;
    targetId: string;
    targetLabelHi: string;
    targetLabelEn: string;
  }[] = [
    {
      id: 'eco',
      stepNum: '01',
      assetKey: 'carbonMasterStage1Sapling',
      titleHi: 'स्वस्थ पारिस्थितिकी',
      titleEn: 'Healthy Ecosystem',
      descHi: 'स्थानीय वृक्षारोपण, स्वस्थ मिट्टी और पुनर्स्थापित भूमि।',
      descEn: 'Native tree plantation, living humus soil, and restored rural land.',
      detailHi:
        'राजस्थान के मौसम के अनुकूल देशी पौधे (खेजड़ी, नीम, आंवला) लगाकर और शुरुआती वर्षों में पानी व ट्री-गार्ड देकर मज़बूत हरित नींव बनाई जाती है।',
      detailEn:
        'Climate-resilient native saplings (Khejri, Neem, Amla) are planted with watering and tree guards so roots establish firmly in rural soil.',
      targetId: 'cc-plantation',
      targetLabelHi: '04 · वृक्षारोपण प्रक्रिया देखें',
      targetLabelEn: '04 · View Plantation Guide',
    },
    {
      id: 'seq',
      stepNum: '02',
      assetKey: 'carbonMasterStage2Absorption',
      titleHi: 'कार्बन अवशोषण',
      titleEn: 'Carbon Absorption',
      descHi: 'वृक्ष और मिट्टी वायुमंडल से CO₂ अवशोषित कर दीर्घकाल तक संचित करते हैं।',
      descEn: 'Growing trees and living soil draw atmospheric CO₂ and lock it safely.',
      detailHi:
        'हर वर्ष पेड़ के बढ़ते तने, शाखाओं, गहरी जड़ों और पत्तियों से बने जैविक ह्यूमस में सैकड़ों किलोग्राम CO₂ प्राकृतिक रूप से जमा होता जाता है।',
      detailEn:
        'Year after year, carbon builds into solid wood, deep root systems, and dark organic humus underground—naturally cooling the microclimate.',
      targetId: 'cc-tree',
      targetLabelHi: '03 · पेड़ का कार्बन चक्र देखें',
      targetLabelEn: '03 · View Tree Carbon Cycle',
    },
    {
      id: 'cert',
      stepNum: '03',
      assetKey: 'carbonMasterStage3MrvAudit',
      titleHi: 'सत्यापित कार्बन क्रेडिट',
      titleEn: 'Verified Carbon Credit',
      descHi: 'वैज्ञानिक मापन, नियमित निगरानी और स्वतंत्र सत्यापन के बाद ही क्रेडिट जारी हो सकते हैं।',
      descEn: 'Credits can only be issued after scientific measurement, monitoring, and independent audit.',
      detailHi:
        'समर्पित MRV डेटा (पौधों की जीवितता, तने की मोटाई, सैटेलाइट व फील्ड रिकॉर्ड) की जाँच GOVEDA से स्वतंत्र तीसरे पक्ष के ऑडिटर (VVB) करते हैं।',
      detailEn:
        'Dedicated MRV records (survival count, trunk girth, satellite and plot logs) are audited by an accredited verifier completely independent of GOVEDA.',
      targetId: 'cc-mrv',
      targetLabelHi: '08 · Baseline व MRV ऑडिट देखें',
      targetLabelEn: '08 · View Baseline & MRV',
    },
    {
      id: 'impact',
      stepNum: '04',
      assetKey: 'carbonMasterStage4VillageImpact',
      titleHi: 'वास्तविक ग्रामीण प्रभाव',
      titleEn: 'Real Rural Impact',
      descHi: 'भूमि की गुणवत्ता, हरित आजीविका के अवसर और समुदाय को संभावित साझा लाभ।',
      descEn: 'Richer farm soil, shade, fruit & fodder, and potential shared community value.',
      detailHi:
        'कार्बन बिक्री होने पर वास्तविक परियोजना व ऑडिट खर्च घटाकर पूर्व लिखित समझौते से शुद्ध लाभ साझा होता है—और खेत की हरियाली व फल-चारा हमेशा किसान के रहते हैं।',
      detailEn:
        'If credits are sold, net proceeds after actual project and audit costs are shared under written agreements—while richer soil, shade, and fruit remain permanently with farmers.',
      targetId: 'cc-example',
      targetLabelHi: '07 · 100 पौधे व किसान मॉडल देखें',
      targetLabelEn: '07 · View 100-Sapling Model',
    },
  ];

  const selectStageAndScrollMobile = (idx: number) => {
    setActiveStage(idx);
    const cardEl = mobileCardRefs.current[idx];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const current = flowStages[activeStage];

  return (
    <section className="relative bg-white py-14 sm:py-20 border-b border-[#E3EED8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9 sm:space-y-12">
        {/* CENTERED MUSEUM-GRADE HEADER */}
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-3.5">
            <span className="h-px w-14 sm:w-24 bg-[#C4A662]" aria-hidden="true" />
            <Leaf className="w-5 h-5 text-[#5FA332]" aria-hidden="true" />
            <span className="h-px w-14 sm:w-24 bg-[#C4A662]" aria-hidden="true" />
          </div>

          <h2
            className={`text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#123D1B] leading-[1.15] tracking-tight text-balance ${
              lang === 'hi' ? 'font-hindi' : 'font-editorial'
            }`}
          >
            {lang === 'hi'
              ? 'कार्बन क्रेडिट कैसे जनरेट होता है?'
              : 'How Carbon Credits Are Generated'}
          </h2>

          <div className="flex items-center justify-center gap-3 pt-0.5">
            <span className="h-px w-8 sm:w-16 bg-[#D6BF89]" aria-hidden="true" />
            <p
              className={`text-sm sm:text-base italic text-[#36543C] ${
                lang === 'hi' ? 'font-editorial' : 'font-hindi not-italic'
              }`}
            >
              {lang === 'hi'
                ? 'How Carbon Credits Are Generated'
                : 'कार्बन क्रेडिट कैसे जनरेट होता है?'}
            </p>
            <span className="h-px w-8 sm:w-16 bg-[#D6BF89]" aria-hidden="true" />
          </div>
        </div>

        {/* ============================================================
            MOBILE & TABLET (< lg): CLEAN 2x2 LEFT-TO-RIGHT PROGRESSION GRID
            Row 1: 01 → 02 horizontally · Clean ↓ flow cue · Row 2: 03 → 04 horizontally
            Zero clipped pills, zero awkward scroll peeking!
           ============================================================ */}
        <div className="lg:hidden space-y-3">
          {/* ROW 1: Stage 01 → Stage 02 */}
          <div className="relative grid grid-cols-2 gap-3">
            {flowStages.slice(0, 2).map((stage, idx) => {
              const isSelected = activeStage === idx;
              return (
                <button
                  key={`mob-grid-${stage.id}`}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`text-center rounded-2xl p-3.5 flex flex-col items-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#FAFDF6] border-[#6EB83A] shadow-sm'
                      : 'bg-white border-[#E4EEDB]'
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold tabular-nums mb-1.5 ${
                      isSelected
                        ? 'bg-[#154A22] text-[#D7FAAC]'
                        : 'bg-[#EFF6E7] text-[#356C2C]'
                    }`}
                  >
                    {lang === 'hi' ? `चरण ${stage.stepNum}` : `Stage ${stage.stepNum}`}
                  </span>
                  <div className="w-full aspect-[4/3] mb-2 flex items-center justify-center">
                    <img
                      src={GENERATED_ASSETS[stage.assetKey]}
                      alt={lang === 'hi' ? stage.titleHi : stage.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02] select-none"
                    />
                  </div>
                  <h3
                    className={`text-[13.5px] font-extrabold leading-snug ${
                      isSelected ? 'text-[#123D1B]' : 'text-[#1C4A25]'
                    } ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}
                  >
                    {lang === 'hi' ? stage.titleHi : stage.titleEn}
                  </h3>
                  <p className={`mt-1 text-[11px] text-[#455A4B] leading-snug line-clamp-2 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? stage.descHi : stage.descEn}
                  </p>
                </button>
              );
            })}

            {/* Centered Horizontal Arrow Badge Between 01 → 02 */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-[#B9DA92] shadow-xs flex items-center justify-center text-[#3D8228]"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Subtle Flow Bridge From Row 1 (01→02) Down to Row 2 (03→04) */}
          <div aria-hidden="true" className="flex items-center justify-center gap-2 py-0.5">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#BBD89A]" />
            <span className="text-[10.5px] font-extrabold text-[#4C8430] tracking-wider px-2.5 py-0.5 rounded-full bg-[#F2F8EA] border border-[#D8E8C5]">
              01 → 02 ↓ 03 → 04
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#BBD89A]" />
          </div>

          {/* ROW 2: Stage 03 → Stage 04 */}
          <div className="relative grid grid-cols-2 gap-3">
            {flowStages.slice(2, 4).map((stage, offset) => {
              const idx = offset + 2;
              const isSelected = activeStage === idx;
              return (
                <button
                  key={`mob-grid-${stage.id}`}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`text-center rounded-2xl p-3.5 flex flex-col items-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#FAFDF6] border-[#6EB83A] shadow-sm'
                      : 'bg-white border-[#E4EEDB]'
                  }`}
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold tabular-nums mb-1.5 ${
                      isSelected
                        ? 'bg-[#154A22] text-[#D7FAAC]'
                        : 'bg-[#EFF6E7] text-[#356C2C]'
                    }`}
                  >
                    {lang === 'hi' ? `चरण ${stage.stepNum}` : `Stage ${stage.stepNum}`}
                  </span>
                  <div className="w-full aspect-[4/3] mb-2 flex items-center justify-center">
                    <img
                      src={GENERATED_ASSETS[stage.assetKey]}
                      alt={lang === 'hi' ? stage.titleHi : stage.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02] select-none"
                    />
                  </div>
                  <h3
                    className={`text-[13.5px] font-extrabold leading-snug ${
                      isSelected ? 'text-[#123D1B]' : 'text-[#1C4A25]'
                    } ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}
                  >
                    {lang === 'hi' ? stage.titleHi : stage.titleEn}
                  </h3>
                  <p className={`mt-1 text-[11px] text-[#455A4B] leading-snug line-clamp-2 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? stage.descHi : stage.descEn}
                  </p>
                </button>
              );
            })}

            {/* Centered Horizontal Arrow Badge Between 03 → 04 */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-[#B9DA92] shadow-xs flex items-center justify-center text-[#3D8228]"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ============================================================
            DESKTOP (lg+): 4 LARGE BORDERLESS VIGNETTES WITH FLOW THREAD
           ============================================================ */}
        <div className="hidden lg:block relative">
          {/* Delicate Sweeping Organic Connecting Curve Across Vignettes on Desktop */}
          <svg
            viewBox="0 0 1200 120"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute top-[110px] inset-x-0 w-full h-24 opacity-85"
          >
            <path
              d="M90 66 C230 96 340 42 465 64 C595 86 700 38 830 62 C955 84 1045 48 1125 60"
              stroke="#C9DCA9"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
          </svg>

          <div className="grid grid-cols-4 divide-x divide-[#E6EEDF]">
            {flowStages.map((stage, idx) => {
              const isSelected = activeStage === idx;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveStage(idx);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="relative px-5 flex flex-col items-center text-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6D26]"
                >
                  {/* Floating Circular » Chevron Connector Between Columns on Desktop */}
                  {idx < flowStages.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="flex absolute -right-4 top-[132px] z-10 w-8 h-8 rounded-full bg-white border border-[#D4E4BC] shadow-xs items-center justify-center text-[#5A9730]"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </span>
                  )}

                  <span className="text-[11px] font-extrabold tracking-[0.14em] text-[#548636] tabular-nums mb-1">
                    {lang === 'hi' ? `चरण ${stage.stepNum}` : `Stage ${stage.stepNum}`}
                  </span>

                  {/* LARGE SEAMLESS VIGNETTE ON PURE WHITE (ZERO BORDER, ZERO BOX!) */}
                  <div className="relative w-full max-w-[290px] aspect-[4/3] mb-3 flex items-center justify-center">
                    <img
                      src={GENERATED_ASSETS[stage.assetKey]}
                      alt={lang === 'hi' ? stage.titleHi : stage.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02] transition-transform duration-300 group-hover:scale-[1.035] select-none"
                    />
                  </div>

                  {/* Clean Unboxed Typography Directly Below Artwork */}
                  <h3
                    className={`text-[19px] font-extrabold leading-snug transition-colors ${
                      isSelected ? 'text-[#123D1B]' : 'text-[#1C4A25] group-hover:text-[#123D1B]'
                    } ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}
                  >
                    {lang === 'hi' ? stage.titleHi : stage.titleEn}
                  </h3>
                  <p
                    className={`mt-2 text-[13.5px] text-[#394D3E] leading-[1.65] max-w-[28ch] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? stage.descHi : stage.descEn}
                  </p>

                  {/* Subtle active hairline indicator */}
                  <span
                    aria-hidden="true"
                    className={`mt-3.5 h-[2px] rounded-full transition-all duration-200 ${
                      isSelected ? 'w-12 bg-[#5DA432]' : 'w-4 bg-[#D8E6C4] group-hover:w-8'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Contextual Ground-Level Detail Bar with Explicit Destination Label */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#F8FBF4] border border-[#DCEAD0] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="space-y-1">
            <p className={`text-xs font-extrabold text-[#27612A] tabular-nums ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? `चरण ${current.stepNum} · ${current.titleHi}`
                : `Stage ${current.stepNum} · ${current.titleEn}`}
            </p>
            <p className={`text-xs sm:text-[13.5px] text-[#2F4435] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi' ? current.detailHi : current.detailEn}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onScrollTo(current.targetId)}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#CFE1BE] text-xs font-bold text-[#154A22] hover:bg-[#EDF7E0] hover:border-[#6EB83A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className={lang === 'hi' ? 'font-hindi' : ''}>
              {lang === 'hi' ? current.targetLabelHi : current.targetLabelEn}
            </span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* SIGNATURE BOTTOM HONESTY NOTE FLANKED BY FINE GOLD LINES */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 pt-1">
          <span className="hidden sm:block h-px w-16 md:w-28 bg-[#D3BC87]" aria-hidden="true" />
          <div className="inline-flex items-center gap-2.5 border-y border-[#DFCFAF] px-4 sm:px-6 py-2.5 text-center">
            <Leaf className="w-4 h-4 text-[#5DA432] shrink-0" aria-hidden="true" />
            <span className={`text-xs sm:text-[13.5px] font-semibold text-[#1B4022] ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'क्रेडिट जारी होना परियोजना की पात्रता, निगरानी और स्वतंत्र सत्यापन पर निर्भर करता है।'
                : 'Credit issuance strictly depends on project eligibility, multi-year monitoring, and independent verification.'}
            </span>
          </div>
          <span className="hidden sm:block h-px w-16 md:w-28 bg-[#D3BC87]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   5. WHY IT MATTERS — CONTINUOUS SEAMLESS PANORAMIC EDITORIAL STORYTELLING
      Matches the exact GOVEDA visual design language from the client's
      reference plate: warm luminous paper canvas, forest headline with sweeping
      lime leaf flourish, full-width feathered panoramic landscape painting
      (parched earth → storm rain → factory smoke → lush village & backlit tree),
      and 4 hairline-divided fine-line botanical icon columns directly beneath!
   ============================================================================ */
interface ClimatePillar {
  id: 'heat' | 'rain' | 'pollution' | 'livelihood';
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  actionHi: string;
  actionEn: string;
  iconBg: string;
  icon: React.ReactNode;
}

const CARBON_WHY_PILLARS: ClimatePillar[] = [
  {
    id: 'heat',
    titleHi: 'बढ़ता तापमान और सूखती मिट्टी',
    titleEn: 'Rising Heat & Parched Soils',
    descHi: 'लंबी गर्मी और सूखा मिट्टी की नमी घटाते हैं और फसलों पर दबाव बढ़ाते हैं।',
    descEn: 'Longer summers and drought deplete soil moisture and place severe stress on farm crops.',
    actionHi:
      'GOVEDA समाधान: खेत की मेड़ों पर खेजड़ी, नीम व रोहिड़ा की घनी छांव मिट्टी का तापमान कम करती है और फसलों को लू से बचाती है।',
    actionEn:
      'GOVEDA Response: Native Khejri, Neem, and Rohida border rows cool farm microclimates and shield crops from harsh hot winds.',
    iconBg: 'bg-[#FDF4DC]',
    icon: (
      <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="6.2" stroke="#8A611C" strokeWidth="1.75" fill="#FDECB8" />
        <path
          d="M18 5.5v3M18 27.5v3M5.5 18h3M27.5 18h3M9.2 9.2l2.1 2.1M24.7 24.7l2.1 2.1M26.8 9.2l-2.1 2.1M11.3 24.7l-2.1 2.1"
          stroke="#8A611C"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'rain',
    titleHi: 'अनियमित वर्षा और जल संकट',
    titleEn: 'Erratic Rainfall & Water Stress',
    descHi: 'कभी तेज़ बारिश, कभी लंबा सूखा; इससे खेती और पानी की उपलब्धता प्रभावित होती है।',
    descEn: 'Sudden downpours followed by dry spells disrupt both farming cycles and local water availability.',
    actionHi:
      'GOVEDA समाधान: गहरी जड़ों वाले देशी वृक्ष और ग्रामीण जोहड़ मिलकर बारिश की हर बूँद को ज़मीन के भीतर उतारते हैं।',
    actionEn:
      'GOVEDA Response: Deep-rooted native agroforestry paired with village johads slows monsoon runoff and replenishes aquifers.',
    iconBg: 'bg-[#EEF6E7]',
    icon: (
      <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none" aria-hidden="true">
        <path
          d="M11.5 21.5h13.5a5 5 0 0 0 .8-9.93 6.8 6.8 0 0 0-12.9-1.67A4.6 4.6 0 0 0 11.5 21.5Z"
          stroke="#225529"
          strokeWidth="1.7"
          fill="#E4F2D8"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 25l-1 3M18 25l-1 3M23.5 25l-1 3"
          stroke="#225529"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'pollution',
    titleHi: 'हवा में बढ़ती कार्बन गैसें',
    titleEn: 'Rising Carbon Emissions',
    descHi: 'कार्बन उत्सर्जन जलवायु परिवर्तन को तेज़ करता है और संतुलन बिगाड़ता है।',
    descEn: 'Excess greenhouse emissions accelerate climate warming and disturb our natural ecological balance.',
    actionHi:
      'GOVEDA समाधान: संगठित ग्राम-स्तरीय वृक्षारोपण और वैज्ञानिक MRV इस प्राकृतिक कार्बन हटाव को पारदर्शी रूप से दर्ज करता है।',
    actionEn:
      'GOVEDA Response: Organized village tree clusters and rigorous MRV transparently measure natural CO₂ drawdown over time.',
    iconBg: 'bg-[#EEF5E8]',
    icon: (
      <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none" aria-hidden="true">
        <path
          d="M8 28V16.5l6.5 3.5v-3.5l6.5 3.5V12h5v16H8Z"
          stroke="#225529"
          strokeWidth="1.7"
          fill="#E7F3DC"
          strokeLinejoin="round"
        />
        <path
          d="M23.5 10c0-2 1.8-2.4 2.5-3.8.5-1 .2-2.2-.8-2.7M12 24h2M17 24h2"
          stroke="#225529"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'livelihood',
    titleHi: 'किसान और ग्रामीण भविष्य की सुरक्षा',
    titleEn: 'Protecting Farmers & Rural Futures',
    descHi: 'पेड़, टिकाऊ खेती और जल संरक्षण से गाँवों की जलवायु सहनशीलता बढ़ सकती है।',
    descEn: 'Trees, sustainable farming, and water conservation strengthen climate resilience across villages.',
    actionHi:
      'GOVEDA समाधान: किसान की ज़मीन का 100% अधिकार सुरक्षित रखते हुए फल, चारा, उपजाऊ मिट्टी और संभावित सत्यापित कार्बन मूल्य जोड़ना।',
    actionEn:
      'GOVEDA Response: Preserving 100% farmer land ownership while combining fruit, fodder, richer soil, and potential verified carbon value.',
    iconBg: 'bg-[#EEF6E5]',
    icon: (
      <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none" aria-hidden="true">
        <path
          d="M19.5 19V11.5M19.5 14c-3.2-.2-5-2.1-5.2-4.8 2.8-.2 4.8 1.5 5.2 4.8ZM19.5 12.5c3-.4 4.8-2.2 5-4.8-2.7-.1-4.6 1.6-5 4.8Z"
          stroke="#225529"
          strokeWidth="1.6"
          fill="#CDE8A8"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 23.5h5.8l4.4 2c1 .4 2.1.4 3.1 0l6.2-2.4c.9-.3 1.8.3 1.8 1.2 0 .6-.4 1.1-1 1.4l-7.2 2.8c-1.4.5-3 .5-4.4 0l-4.2-1.5H7.5v-3.5Z"
          stroke="#225529"
          strokeWidth="1.65"
          fill="#F4FAEC"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function CarbonWhyWaveShowcase({ lang }: { lang: Language }) {
  const [activeId, setActiveId] = useState<ClimatePillar['id']>('heat');
  const activePillar =
    CARBON_WHY_PILLARS.find((p) => p.id === activeId) ?? CARBON_WHY_PILLARS[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* TOP EDITORIAL HEADER — EXACT DESIGN LANGUAGE OF REFERENCE PLATE */}
      <div className="max-w-4xl space-y-3">
        <div className="flex items-center gap-3.5">
          <span
            className={`text-xs sm:text-[13px] font-extrabold text-[#1A4D24] ${
              lang === 'hi' ? 'font-hindi' : 'tracking-[0.12em] uppercase'
            }`}
          >
            {lang === 'hi' ? '01 · जलवायु क्यों ज़रूरी है?' : '01 · Why Climate Action Matters'}
          </span>
          <span className="h-px w-16 sm:w-20 bg-[#C8B37B]" aria-hidden="true" />
        </div>

        <h2
          className={`text-[1.75rem] sm:text-[2.45rem] lg:text-[2.9rem] font-extrabold text-[#113B19] leading-[1.14] tracking-tight text-balance ${
            lang === 'hi' ? 'font-hindi' : 'font-editorial'
          }`}
        >
          <span>
            {lang === 'hi'
              ? 'क्यों ज़रूरी है कार्बन क्रेडिट और जलवायु कार्रवाई?'
              : 'Why Carbon Action & Climate Resilience Matter Now'}
          </span>
          {/* Signature Sweeping Lime Leaf Flourish */}
          <svg
            viewBox="0 0 88 32"
            fill="none"
            aria-hidden="true"
            className="inline-block w-12 sm:w-16 h-6 sm:h-7 ml-2 -mb-1 align-baseline"
          >
            <path
              d="M2 24 C28 28 54 22 76 7 C68 20 52 27 28 27 C16 27 8 26 2 24 Z"
              fill="#7CC042"
            />
            <path
              d="M54 17 C60 6 72 2 84 4 C79 15 69 22 54 17 Z"
              fill="#6BB235"
            />
          </svg>
        </h2>

        <p
          className={`text-sm sm:text-base italic font-medium text-[#274F2D] ${
            lang === 'hi' ? 'font-editorial' : 'font-hindi not-italic'
          }`}
        >
          {lang === 'hi'
            ? 'Why Carbon Action & Climate Resilience Matter Now'
            : 'क्यों ज़रूरी है कार्बन क्रेडिट और जलवायु कार्रवाई?'}
        </p>

        <span className="block h-[2px] w-28 sm:w-36 bg-[#95C954] rounded-full" aria-hidden="true" />

        <p
          className={`pt-1 text-sm sm:text-[15.5px] text-[#26382A] leading-[1.72] max-w-[74ch] ${
            lang === 'hi' ? 'font-hindi' : ''
          }`}
        >
          {lang === 'hi'
            ? 'कार्बन क्रेडिट को समझने से पहले यह जानना ज़रूरी है कि बदलती जलवायु का असर हमारी खेती, गाँवों और आने वाली पीढ़ियों पर पड़ रहा है। बढ़ती गर्मी, अनियमित बारिश और हवा में बढ़ती कार्बन गैसें मिट्टी, पानी और खेती के संतुलन को प्रभावित करती हैं।'
            : 'Before understanding carbon credits, it is essential to see how shifting weather affects our farms, villages, and future generations. Rising heat, erratic monsoons, and growing carbon emissions disrupt the balance of soil, water, and agriculture.'}
        </p>
      </div>

      {/* FULL-WIDTH SEAMLESS FEATHERED CONTINUOUS PANORAMIC ILLUSTRATION */}
      <div className="relative -mx-2 sm:mx-0 overflow-hidden">
        <div className="relative w-full aspect-[16/7.6] sm:aspect-[16/6.6] flex items-center justify-center">
          <img
            src={GENERATED_ASSETS.carbonWhyPanoramaClean}
            alt={
              lang === 'hi'
                ? 'बाईं ओर सूखी दरकती भूमि और तपते सूरज से लेकर अनियमित बारिश, औद्योगिक धुआँ और दाईं ओर हरे-भरे खेतों, गाँव व खिले देशी वृक्ष का निरंतर परिदृश्य'
                : 'Continuous seamless landscape transforming from parched cracked earth and drought sun on the left, through monsoon rain and distant emissions, to lush green terraced farms, rural cottages, and a radiant sunlit tree on the right'
            }
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center mix-blend-multiply select-none"
          />
          {/* Ultra-soft edge feathering so painting melts cleanly into pure white */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-8 sm:h-12 bg-gradient-to-b from-white via-white/65 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-14 bg-gradient-to-t from-white via-white/75 to-transparent"
          />
        </div>
      </div>

      {/* 4 UNBOXED FINE-LINE BOTANICAL ICON COLUMNS DIRECTLY BENEATH THEIR MATCHING ZONES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[#E1D8C5]">
        {CARBON_WHY_PILLARS.map((col) => {
          const isSelected = activeId === col.id;
          return (
            <button
              key={col.id}
              type="button"
              onMouseEnter={() => setActiveId(col.id)}
              onClick={() => setActiveId(col.id)}
              className={`group text-left py-4 sm:py-3 lg:py-2 px-1 sm:px-4 lg:px-5 first:lg:pl-1 last:lg:pr-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6D26] rounded-lg ${
                isSelected ? 'bg-[#FAFDF6] lg:bg-transparent' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${col.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
                >
                  {col.icon}
                </div>
                <h3
                  className={`text-[15px] sm:text-[16px] font-extrabold leading-snug pt-0.5 transition-colors ${
                    isSelected ? 'text-[#1B662A]' : 'text-[#123D1B] group-hover:text-[#1B662A]'
                  } ${lang === 'hi' ? 'font-hindi' : ''}`}
                >
                  {lang === 'hi' ? col.titleHi : col.titleEn}
                </h3>
              </div>
              <p
                className={`mt-2.5 text-[12.5px] sm:text-[13px] text-[#324336] leading-[1.62] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi' ? col.descHi : col.descEn}
              </p>
              <span
                aria-hidden="true"
                className={`mt-2.5 block h-[2px] rounded-full transition-all duration-200 ${
                  isSelected ? 'w-10 bg-[#76B83E]' : 'w-0 bg-[#CFE2B4] group-hover:w-6'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Concise Interactive GOVEDA Response Strip */}
      <div className="rounded-2xl bg-[#F6FAF1] border border-[#D8E8C7] px-5 py-3.5 flex items-start gap-3">
        <Sprout className="w-4 h-4 text-[#2F722B] shrink-0 mt-0.5" aria-hidden="true" />
        <p className={`text-xs sm:text-[13.5px] text-[#24422C] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
          {lang === 'hi' ? activePillar.actionHi : activePillar.actionEn}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   5B. HOW GOVEDA BRIDGES RURAL FARMERS & SCIENCE-LED CLIMATE ACTION
       Matches the beloved Hero SVG bent elbow leader-line language:
       Borderless sunlit Rajasthani farmer → Harit Mitra → Scientific MRV &
       thriving village diorama with interactive glowing target nodes and
       crisp bent leader lines radiating to unboxed bilingual explanations!
   ============================================================================ */
interface BridgeAnnotation {
  id: 'farmer' | 'mitra' | 'mrv' | 'village';
  pinNum: string;
  titleHi: string;
  titleEn: string;
  subHi: string;
  subEn: string;
  /** Target node on 1200x675 SVG coordinate space over the 16:9 bridge artwork */
  node: [number, number];
  elbow: [number, number];
  end: [number, number];
  /** Desktop callout box positioning (%) */
  cardStyle: { top: string; left: string; width: string };
  /** Mobile tappable pin % coordinates over the 16:9 image */
  mobTop: string;
  mobLeft: string;
  icon: React.ReactNode;
}

const GOVEDA_BRIDGE_ANNOTATIONS: BridgeAnnotation[] = [
  {
    id: 'farmer',
    pinNum: '1',
    titleHi: 'किसान व ग्राम क्लस्टर',
    titleEn: 'Rural Farmers & Village Clusters',
    subHi: '100% भूमि स्वामित्व किसान के पास; देशी पौधे व ट्री-गार्ड से हरित शुरुआत',
    subEn: '100% farmer land ownership; native saplings planted with bamboo guards',
    node: [262, 336],
    elbow: [210, 146],
    end: [252, 146],
    cardStyle: { top: '4%', left: '2%', width: '28%' },
    mobTop: '52%',
    mobLeft: '24%',
    icon: <Sprout className="w-5 h-5 text-[#2C722D]" aria-hidden="true" />,
  },
  {
    id: 'mitra',
    pinNum: '2',
    titleHi: 'हरित मित्र व फील्ड समन्वय',
    titleEn: 'Harit Mitra Field Stewardship',
    subHi: 'स्थानीय हरित मित्र पौधों की जीवितता, ऊँचाई व तने की मोटाई दर्ज करते हैं',
    subEn: 'Local Harit Mitras log sapling survival, height, and trunk girth on-site',
    node: [596, 294],
    elbow: [560, 118],
    end: [590, 118],
    cardStyle: { top: '3%', left: '34.5%', width: '29%' },
    mobTop: '45%',
    mobLeft: '51%',
    icon: <Users className="w-5 h-5 text-[#1D5B2A]" aria-hidden="true" />,
  },
  {
    id: 'mrv',
    pinNum: '3',
    titleHi: 'वैज्ञानिक MRV व स्वतंत्र ऑडिट',
    titleEn: 'Scientific MRV & Independent Audit',
    subHi: 'मृदा निगरानी, बेसलाइन डेटा और तीसरे पक्ष के ऑडिटर (VVB) द्वारा निष्पक्ष जाँच',
    subEn: 'Soil sensors, baseline records, and impartial third-party verification',
    node: [838, 408],
    elbow: [782, 578],
    end: [738, 578],
    cardStyle: { top: '76%', left: '33%', width: '30%' },
    mobTop: '62%',
    mobLeft: '70%',
    icon: <ShieldCheck className="w-5 h-5 text-[#1B5A32]" aria-hidden="true" />,
  },
  {
    id: 'village',
    pinNum: '4',
    titleHi: 'स्थायी हरियाली व साझा लाभ',
    titleEn: 'Thriving Villages & Shared Value',
    subHi: 'ठंडी हवा, उपजाऊ मिट्टी, फल-चारा और लिखित अनुबंध से संभावित शुद्ध लाभ',
    subEn: 'Cooler air, fertile soil, fruit & fodder, plus written net-benefit sharing',
    node: [945, 226],
    elbow: [1015, 116],
    end: [985, 116],
    cardStyle: { top: '4%', left: '68.5%', width: '29.5%' },
    mobTop: '38%',
    mobLeft: '82%',
    icon: <Award className="w-5 h-5 text-[#588F2C]" aria-hidden="true" />,
  },
];

export function CarbonGovedaBridgeShowcase({ lang }: { lang: Language }) {
  const [activeId, setActiveId] = useState<BridgeAnnotation['id']>('farmer');
  const activeItem =
    GOVEDA_BRIDGE_ANNOTATIONS.find((a) => a.id === activeId) ?? GOVEDA_BRIDGE_ANNOTATIONS[0];

  return (
    <div className="space-y-5">
      {/* ============================================================
          DESKTOP (lg+): BORDERLESS BRIDGE DIORAMA WITH HERO-STYLE
          SVG BENT ELBOW LEADER LINES & UNBOXED EXPLANATIONS
         ============================================================ */}
      <div className="hidden lg:block relative mx-auto max-w-[1160px] select-none pt-14 pb-10">
        <div className="relative w-full aspect-[16/9]">
          {/* Seamless Borderless Farmer → Harit Mitra → Science & Village Illustration */}
          <img
            src={GENERATED_ASSETS.carbonGovedaBridgeAnnotated}
            alt={
              lang === 'hi'
                ? 'राजस्थानी किसान, पौधारोपण, स्थानीय हरित मित्र द्वारा मापन, सोलर मृदा सेंसर और समृद्ध हरित गाँव के बीच GOVEDA का वैज्ञानिक सेतु'
                : 'Editorial illustration showing how GOVEDA bridges a Rajasthani farmer planting guarded saplings, a Harit Mitra measuring growth, solar soil MRV monitoring, and a thriving green village'
            }
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply contrast-[1.02] brightness-[1.01] pointer-events-none"
          />

          {/* Crisp Thin Bent Elbow Leader Lines + Luminous Botanical Target Halos */}
          <svg
            viewBox="0 0 1200 675"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
          >
            {GOVEDA_BRIDGE_ANNOTATIONS.map((note) => {
              const isFocused = activeId === note.id;
              return (
                <g key={`bridge-line-${note.id}`}>
                  <polyline
                    points={`${note.node[0]},${note.node[1]} ${note.elbow[0]},${note.elbow[1]} ${note.end[0]},${note.end[1]}`}
                    stroke={isFocused ? '#154A22' : '#528046'}
                    strokeWidth={isFocused ? '2.1' : '1.45'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'stroke 200ms ease, stroke-width 200ms ease' }}
                  />
                  {/* Subtle glowing botanical halo around target point */}
                  <circle
                    cx={note.node[0]}
                    cy={note.node[1]}
                    r={isFocused ? '16' : '11'}
                    fill="#BCEB76"
                    fillOpacity={isFocused ? '0.62' : '0.38'}
                  />
                  <circle
                    cx={note.node[0]}
                    cy={note.node[1]}
                    r="5.5"
                    fill="#FFFFFF"
                    stroke="#2B7230"
                    strokeWidth="2.4"
                  />
                </g>
              );
            })}
          </svg>

          {/* 4 UNBOXED EDITORIAL CALLOUTS CONNECTED BY LEADER LINES */}
          {GOVEDA_BRIDGE_ANNOTATIONS.map((note) => {
            const isFocused = activeId === note.id;
            return (
              <button
                key={`bridge-card-${note.id}`}
                type="button"
                style={note.cardStyle}
                onMouseEnter={() => setActiveId(note.id)}
                onFocus={() => setActiveId(note.id)}
                onClick={() => setActiveId(note.id)}
                className="group absolute text-left flex items-start gap-2.5 p-2 rounded-xl bg-white/90 backdrop-blur-[2px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6D26]"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isFocused
                      ? 'bg-[#EDF8DC] border-[1.5px] border-[#2E7D32] scale-105'
                      : 'bg-white border border-[#CFE4B2] group-hover:border-[#6EB83A]'
                  }`}
                >
                  {note.icon}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[13.5px] xl:text-[14.5px] font-extrabold leading-snug transition-colors ${
                      isFocused ? 'text-[#0E3618]' : 'text-[#1E4726]'
                    } ${lang === 'hi' ? 'font-hindi' : ''}`}
                  >
                    <span className="text-[#5A9330] mr-1 tabular-nums">{note.pinNum}.</span>
                    {lang === 'hi' ? note.titleHi : note.titleEn}
                  </p>
                  <p
                    className={`mt-0.5 text-[11.5px] leading-snug transition-opacity ${
                      isFocused ? 'text-[#2D4533] opacity-100' : 'text-[#526858] opacity-85'
                    } ${lang === 'hi' ? 'font-hindi' : ''}`}
                  >
                    {lang === 'hi' ? note.subHi : note.subEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          MOBILE & TABLET (< lg): FULL-WIDTH BORDERLESS BRIDGE ARTWORK
          WITH 4 TAPPABLE GLOWING PINS + INTERACTIVE SPOTLIGHT BAR
         ============================================================ */}
      <div className="lg:hidden space-y-4">
        <div className="relative mx-auto max-w-[600px]">
          <img
            src={GENERATED_ASSETS.carbonGovedaBridgeAnnotated}
            alt={
              lang === 'hi'
                ? 'किसान, हरित मित्र और वैज्ञानिक MRV के बीच GOVEDA का सेतु'
                : 'How GOVEDA bridges rural farmers, Harit Mitras, and scientific MRV verification'
            }
            referrerPolicy="no-referrer"
            className="w-full aspect-[16/9] object-contain mix-blend-multiply contrast-[1.02] brightness-[1.01]"
          />

          {GOVEDA_BRIDGE_ANNOTATIONS.map((note) => {
            const isFocused = activeId === note.id;
            return (
              <button
                key={`mob-bridge-pin-${note.id}`}
                type="button"
                onClick={() => setActiveId(note.id)}
                aria-label={lang === 'hi' ? note.titleHi : note.titleEn}
                style={{ top: note.mobTop, left: note.mobLeft }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-transform cursor-pointer tabular-nums ${
                  isFocused
                    ? 'bg-[#154A22] text-[#D7FAAC] ring-4 ring-[#AEE466]/70 scale-110'
                    : 'bg-white/95 text-[#154A22] border border-[#6EB83A] shadow-sm'
                }`}
              >
                {note.pinNum}
              </button>
            );
          })}
        </div>

        {/* Interactive Spotlight Card Directly Beneath Illustration */}
        <div className="rounded-2xl bg-[#F8FBF4] border border-[#D4E6BE] px-4 py-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-[#CBE4A5] flex items-center justify-center shrink-0">
            {activeItem.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs sm:text-sm font-extrabold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {activeItem.pinNum}. {lang === 'hi' ? activeItem.titleHi : activeItem.titleEn}
            </p>
            <p className={`mt-0.5 text-[11.5px] sm:text-xs text-[#3C5242] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi' ? activeItem.subHi : activeItem.subEn}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            {GOVEDA_BRIDGE_ANNOTATIONS.map((n) => (
              <button
                key={`mob-bridge-dot-${n.id}`}
                type="button"
                onClick={() => setActiveId(n.id)}
                aria-label={n.pinNum}
                className={`w-6 h-6 rounded-full text-[11px] font-bold cursor-pointer tabular-nums ${
                  activeId === n.id
                    ? 'bg-[#154A22] text-white'
                    : 'bg-[#EAF4DE] text-[#285E2B]'
                }`}
              >
                {n.pinNum}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   6. MONUMENTAL BORDERLESS BOTANICAL PLATE — HOW A TREE ABSORBS & STORES CARBON
      Uses our large Master Style tree with glowing golden roots directly on
      pure #FFFFFF with curved hairline SVG leader connectors & 4 interactive zones!
   ============================================================================ */
interface TreeZone {
  id: 'leaves' | 'trunk' | 'roots' | 'soil';
  side: 'left' | 'right';
  num: string;
  labelHi: string;
  labelEn: string;
  roleHi: string;
  roleEn: string;
  detailHi: string;
  detailEn: string;
  pinTop: string;
  pinLeft: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TREE_ZONES: TreeZone[] = [
  {
    id: 'leaves',
    side: 'left',
    num: '01',
    labelHi: 'पत्तियाँ — प्रकाश संश्लेषण',
    labelEn: 'Leaves — Photosynthesis',
    roleHi: 'वायुमंडल से CO₂ सोखना',
    roleEn: 'Draws CO₂ from air',
    detailHi:
      'सूर्य की रोशनी व पानी से पत्तियाँ हवा की CO₂ गैस को ग्रहण कर ऑक्सीजन छोड़ती हैं और कार्बन को पेड़ के पोषण में बदलती हैं।',
    detailEn:
      'Sunlight powers green leaves to absorb atmospheric CO₂, release clean oxygen, and convert carbon into living plant fuel.',
    pinTop: '28%',
    pinLeft: '36%',
    icon: Leaf,
  },
  {
    id: 'roots',
    side: 'left',
    num: '03',
    labelHi: 'गहरी जड़ें — भूमिगत भंडार',
    labelEn: 'Deep Roots — Below-Ground Lock',
    roleHi: 'मिट्टी में कार्बन व जल संतुलन',
    roleEn: 'Channels carbon underground',
    detailHi:
      'मजबूत जड़ें मिट्टी का कटाव रोकती हैं, वर्षा जल को जमीन में उतारती हैं और कार्बन का बड़ा हिस्सा जड़ तंत्र में जमा करती हैं।',
    detailEn:
      'Sprawling native roots hold soil moisture, aid groundwater recharge, and anchor stored carbon deep below ground.',
    pinTop: '75%',
    pinLeft: '38%',
    icon: Sprout,
  },
  {
    id: 'trunk',
    side: 'right',
    num: '02',
    labelHi: 'तना व शाखाएँ — ठोस बायोमास',
    labelEn: 'Trunk & Branches — Woody Bank',
    roleHi: 'दशकों तक सुरक्षित भंडारण',
    roleEn: 'Decades-long solid storage',
    detailHi:
      'जैसे-जैसे पेड़ बड़ा होता है, उसके मजबूत तने, शाखाओं और छाल में कार्बन वर्षों व दशकों तक ठोस रूप में सुरक्षित जमा रहता है।',
    detailEn:
      'Year after year, carbon builds into solid wood inside the trunk, branches, and bark—remaining locked as long as the tree stands.',
    pinTop: '54%',
    pinLeft: '54%',
    icon: Trees,
  },
  {
    id: 'soil',
    side: 'right',
    num: '04',
    labelHi: 'मिट्टी — जैविक कार्बन बैंक',
    labelEn: 'Soil Organic Carbon Sink',
    roleHi: 'उपजाऊ ह्यूमस व खेत की सेहत',
    roleEn: 'Richer humus & farm fertility',
    detailHi:
      'सूखी पत्तियाँ, जड़ों के अवशेष और सूक्ष्मजीव मिलकर मिट्टी में Soil Organic Carbon बढ़ाते हैं—जिससे खेत अधिक उपजाऊ और नम बनता है।',
    detailEn:
      'Fallen leaves and soil microbes build dark organic humus—storing carbon while visibly improving farm soil fertility.',
    pinTop: '84%',
    pinLeft: '63%',
    icon: Layers,
  },
];

export function CarbonTreeAnatomyShowcase({ lang }: { lang: Language }) {
  const [activeId, setActiveId] = useState<TreeZone['id']>('leaves');
  const leftZones = TREE_ZONES.filter((z) => z.side === 'left');
  const rightZones = TREE_ZONES.filter((z) => z.side === 'right');

  const renderZoneNote = (zone: TreeZone) => {
    const Icon = zone.icon;
    const isActive = activeId === zone.id;
    return (
      <button
        key={zone.id}
        type="button"
        onClick={() => setActiveId(zone.id)}
        onMouseEnter={() => setActiveId(zone.id)}
        className={`w-full text-left py-4 px-4 sm:px-5 rounded-2xl transition-colors cursor-pointer border ${
          isActive
            ? 'bg-[#F6FAF1] border-[#2E7D32]'
            : 'bg-white border-[#E4EBD9] hover:border-[#8BC34A]'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isActive
                ? 'bg-[#153E1E] text-[#D2F7A6]'
                : 'bg-[#EEF6E7] text-[#1B5A32]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold tracking-[0.08em] text-[#547A38] tabular-nums">
              {zone.num} · {lang === 'hi' ? zone.roleHi : zone.roleEn}
            </span>
            <h3
              className={`mt-0.5 text-sm sm:text-[15.5px] font-bold text-[#153E1E] leading-snug ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? zone.labelHi : zone.labelEn}
            </h3>
            <p
              className={`mt-1.5 text-xs sm:text-[13px] text-[#35463A] leading-relaxed ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? zone.detailHi : zone.detailEn}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
        {/* Left Callouts (Desktop) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between gap-7">
          {leftZones.map(renderZoneNote)}
        </div>

        {/* Center LARGE Seamless Master Tree Plate (6 cols — Generous Museum Scale!) */}
        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-[560px] aspect-[4/3]">
            <img
              src={GENERATED_ASSETS.carbonMasterHeroTree}
              alt={
                lang === 'hi'
                  ? 'पेड़ की पत्तियों, तने, गहरी जड़ों और जैविक मिट्टी में कार्बन भंडारण का विस्तृत चित्र'
                  : 'Detailed sunlit tree cutaway showing canopy photosynthesis, woody trunk storage, deep roots, and soil humus'
              }
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02] select-none"
            />

            {TREE_ZONES.map((zone) => {
              const isActive = activeId === zone.id;
              return (
                <button
                  key={`pin-${zone.id}`}
                  type="button"
                  onClick={() => setActiveId(zone.id)}
                  onMouseEnter={() => setActiveId(zone.id)}
                  aria-label={lang === 'hi' ? zone.labelHi : zone.labelEn}
                  style={{ top: zone.pinTop, left: zone.pinLeft }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-transform cursor-pointer tabular-nums ${
                    isActive
                      ? 'bg-[#153E1E] text-[#D7FAAC] ring-4 ring-[#9ED55E]/70 scale-110'
                      : 'bg-white/95 text-[#153E1E] border border-[#6EB83A] shadow-xs hover:scale-105'
                  }`}
                >
                  {zone.num}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs italic text-[#526557]">
            {lang === 'hi'
              ? 'CO₂ यात्रा: वायुमंडल → पत्तियाँ → तना → गहरी जड़ें → जैविक मिट्टी'
              : 'CO₂ Path: Air → Leaves → Trunk → Deep Roots → Organic Soil'}
          </p>
        </div>

        {/* Right Callouts (Desktop) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between gap-7">
          {rightZones.map(renderZoneNote)}
        </div>

        {/* Mobile & Tablet (< lg): Clean Symmetrical Grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {TREE_ZONES.map(renderZoneNote)}
        </div>
      </div>

      {/* Bottom Science Highlight Strip */}
      <div className="rounded-2xl bg-[#FAF8F2] border border-[#E0D4B9] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#1B5A32] shrink-0 mt-0.5" aria-hidden="true" />
        <p className={`text-xs sm:text-sm text-[#2B3D31] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
          {lang === 'hi'
            ? 'वैज्ञानिक तथ्य: एक पौधा लगाने के पहले दिन ही कार्बन भंडारण पूरा नहीं होता। जैसे-जैसे पेड़ 3, 5, 10 और 20 वर्षों तक जीवित व स्वस्थ बढ़ता है, उसके तने, जड़ों और मिट्टी में कार्बन का भंडार लगातार बढ़ता जाता है।'
            : 'Scientific Reality: Carbon storage does not happen on planting day. As a tree survives and grows across 3, 5, 10, and 20+ years, the carbon locked in its trunk, roots, and surrounding soil grows steadily year after year.'}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   7. 5-STAGE CIRCULAR MEDALLION PLANTATION STORY
   ============================================================================ */
export function CarbonPlantationMedallions({ lang }: { lang: Language }) {
  const stages: {
    num: string;
    assetKey: AssetKey;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
  }[] = [
    {
      num: '01',
      assetKey: 'medallionHarit',
      titleHi: 'उपयुक्त देशी प्रजाति चुनें',
      titleEn: 'Select Native Species',
      descHi:
        'राजस्थान की मिट्टी व पानी के अनुसार खेजड़ी, नीम, रोहिड़ा, आंवला, जामुन व फलदार पौधों का सही चयन।',
      descEn:
        'Match resilient native species—Khejri, Neem, Rohida, Amla, Jamun—to local soil and rainfall.',
    },
    {
      num: '02',
      assetKey: 'carbonPlantingHands',
      titleHi: 'सही विधि से पौधारोपण',
      titleEn: 'Plant With Care',
      descHi:
        'खेत की मेड़, ब्लॉक या सामुदायिक भूमि पर उचित दूरी, जैविक खाद और स्वस्थ जड़ संरक्षण के साथ रोपण।',
      descEn:
        'Plant along farm borders or agroforestry rows with proper spacing, compost, and gentle root care.',
    },
    {
      num: '03',
      assetKey: 'carbonWateringCare',
      titleHi: 'नियमित सिंचाई व देखभाल',
      titleEn: 'Water & Nurture',
      descHi:
        'शुरुआती 2–3 वर्षों में समय पर पानी, मल्चिंग और मौसमी देखभाल से पौधे की जड़ें गहरी और मजबूत बनती हैं।',
      descEn:
        'Regular watering and mulching across the first 2–3 summers help young roots establish deeply.',
    },
    {
      num: '04',
      assetKey: 'carbonTreeGuard',
      titleHi: 'ट्री-गार्ड व सुरक्षा कवच',
      titleEn: 'Protect With Guards',
      descHi:
        'बांस/जाली के ट्री-गार्ड, बाड़ और सामुदायिक जागरूकता से मवेशियों व तेज़ हवा से पौधों की सुरक्षा।',
      descEn:
        'Bamboo or wire guards and village stewardship shield young saplings from grazing and hot winds.',
    },
    {
      num: '05',
      assetKey: 'medallionCarbon',
      titleHi: 'बहु-वर्षीय स्वस्थ वृक्ष',
      titleEn: 'Multi-Year Thriving Tree',
      descHi:
        'जीवित और स्वस्थ बड़ा पेड़ छाया, फल, चारा, उपजाऊ मिट्टी और दीर्घकालिक कार्बन भंडारण देता है।',
      descEn:
        'Surviving mature canopies deliver shade, fruit, fodder, richer soil, and long-term carbon storage.',
    },
  ];

  return (
    <div className="relative">
      <div
        className="hidden lg:block pointer-events-none absolute top-[66px] left-[9%] right-[9%] h-px border-t border-dashed border-[#82C341]/70"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-5 relative">
        {stages.map((st) => (
          <div key={st.num} className="flex flex-col items-center text-center group">
            <div className="relative mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border-2 border-[#D8CEB5] group-hover:border-[#6EB83A] overflow-hidden shadow-[0_12px_28px_-18px_rgba(21,62,30,0.28)] transition-transform duration-300 group-hover:scale-[1.03]">
                <img
                  src={GENERATED_ASSETS[st.assetKey]}
                  alt={lang === 'hi' ? st.titleHi : st.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-[1.06]"
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#153E1E] text-[#D2F7A6] text-[11px] font-bold tabular-nums">
                {st.num}
              </span>
            </div>

            <h3
              className={`text-sm sm:text-[15.5px] font-bold text-[#153E1E] leading-snug ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? st.titleHi : st.titleEn}
            </h3>
            <p
              className={`mt-1.5 text-xs sm:text-[12.5px] text-[#3F5145] leading-relaxed max-w-[26ch] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? st.descHi : st.descEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   8. 10-STEP CARBON PROJECT JOURNEY — 3 MUSEUM-GRADE MASTER ARTWORK CHAPTERS
      Generous pure-white editorial illustrations crowning each phase — ZERO tiny
      clumsy icons or cramped thumbnails!
   ============================================================================ */
interface ChapterStep {
  num: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
}

interface ProjectChapter {
  id: string;
  phaseLabelHi: string;
  phaseLabelEn: string;
  titleHi: string;
  titleEn: string;
  artworkKey: AssetKey;
  steps: ChapterStep[];
}

const PROJECT_CHAPTERS: ProjectChapter[] = [
  {
    id: 'ch-1',
    phaseLabelHi: 'अध्याय 01 · चरण 01 – 03',
    phaseLabelEn: 'Phase 01 · Steps 01 – 03',
    titleHi: 'ग्राम तैयारी, पंजीकरण व भूमि पात्रता',
    titleEn: 'Village Preparation & Land Eligibility',
    artworkKey: 'carbonMasterStage1Sapling',
    steps: [
      {
        num: '01',
        titleHi: 'प्रारंभिक पंजीकरण (Initial Registration)',
        titleEn: 'Initial Registration',
        descHi:
          'किसान या ग्राम समूह नाम, मोबाइल, गाँव और अनुमानित भूमि रुचि दर्ज करते हैं—प्रारंभ में कोई संवेदनशील भूमि दस्तावेज़ नहीं माँगा जाता।',
        descEn:
          'Farmers submit basic contact, village, and plantation interest—no sensitive land papers are collected upfront.',
      },
      {
        num: '02',
        titleHi: 'प्रारंभिक जाँच (Preliminary Screening)',
        titleEn: 'Preliminary Screening',
        descHi:
          'मिट्टी, जल उपलब्धता, उपयुक्त देशी प्रजातियों और आसपास के गाँवों के सामूहिक क्लस्टर की व्यावहारिक जाँच।',
        descEn:
          'Assessing local soil, rainfall, water access, suitable native species, and cluster potential across nearby farms.',
      },
      {
        num: '03',
        titleHi: 'भूमि व परियोजना पात्रता (Land Eligibility)',
        titleEn: 'Land & Project Eligibility',
        descHi:
          'मानक नियमों के तहत किसान की स्वैच्छिक सहमति और स्पष्ट भूमि अधिकार की पुष्टि—जमीन का मालिकाना हक 100% किसान के पास रहता है।',
        descEn:
          'Confirming voluntary consent and clear land eligibility under carbon rules—ownership stays 100% with the farmer.',
      },
    ],
  },
  {
    id: 'ch-2',
    phaseLabelHi: 'अध्याय 02 · चरण 04 – 06',
    phaseLabelEn: 'Phase 02 · Steps 04 – 06',
    titleHi: 'वैज्ञानिक पद्धति, दस्तावेज़ व बहु-वर्षीय निगरानी',
    titleEn: 'Methodology, Design & Multi-Year MRV',
    artworkKey: 'carbonMasterStage3MrvAudit',
    steps: [
      {
        num: '04',
        titleHi: 'पद्धति आकलन (Methodology Assessment)',
        titleEn: 'Methodology Assessment',
        descHi:
          'मान्यता प्राप्त राष्ट्रीय/अंतर्राष्ट्रीय कार्बन मानक की वैज्ञानिक पद्धति का चयन जो Baseline और बायोमास गणना तय करती है।',
        descEn:
          'Matching an accredited scientific methodology that defines Baseline, Additionality, and carbon equations.',
      },
      {
        num: '05',
        titleHi: 'परियोजना दस्तावेज़ तैयार करना (PDD)',
        titleEn: 'Project Design Documentation',
        descHi:
          'वृक्ष प्रजाति योजना, प्लॉट सीमा, सामुदायिक सुरक्षा और बहु-वर्षीय देखभाल कैलेंडर का विस्तृत तकनीकी दस्तावेज़।',
        descEn:
          'Drafting the formal Project Design Document covering species mix, safeguards, and multi-year care schedule.',
      },
      {
        num: '06',
        titleHi: 'निरंतर वैज्ञानिक निगरानी (Monitoring)',
        titleEn: 'Multi-Year Field Monitoring',
        descHi:
          'कई वर्षों तक पौधों की जीवितता, तने की मोटाई, ऊँचाई और जियो-टैग्ड प्लॉट डेटा की नियमित वैज्ञानिक ट्रैकिंग।',
        descEn:
          'Tracking survival rates, trunk girth, height, and geo-tagged plots across multiple growth years in dedicated MRV.',
      },
    ],
  },
  {
    id: 'ch-3',
    phaseLabelHi: 'अध्याय 03 · चरण 07 – 10',
    phaseLabelEn: 'Phase 03 · Steps 07 – 10',
    titleHi: 'स्वतंत्र ऑडिट, रजिस्ट्री व संभावित लाभ-साझेदारी',
    titleEn: 'Independent Audit, Registry & Sharing',
    artworkKey: 'carbonMasterBalanceScale',
    steps: [
      {
        num: '07',
        titleHi: 'स्वतंत्र सत्यापन (Independent Verification)',
        titleEn: 'Independent Verification',
        descHi:
          'GOVEDA से पूरी तरह स्वतंत्र मान्यता प्राप्त तीसरे पक्ष के ऑडिटर (VVB) फील्ड और डेटा की निष्पक्ष जाँच करते हैं।',
        descEn:
          'Accredited third-party auditors independent of GOVEDA verify field plots and measured carbon records.',
      },
      {
        num: '08',
        titleHi: 'रजिस्ट्री प्रक्रिया (Registry Review)',
        titleEn: 'Registry Compliance Review',
        descHi:
          'अधिकृत कार्बन रजिस्ट्री में ऑडिट रिपोर्ट की अंतिम तकनीकी समीक्षा और दोहरी गिनती (Double Counting) रोकने के नियम।',
        descEn:
          'Formal registry audit review, permanence buffer allocation, and safeguards preventing double counting.',
      },
      {
        num: '09',
        titleHi: 'संभावित कार्बन क्रेडिट जारी होना',
        titleEn: 'Potential Credit Issuance',
        descHi:
          'सभी वैज्ञानिक व रजिस्ट्री मानदंड पूर्ण होने पर ही सत्यापित टन CO₂e के अनुरूप संभावित कार्बन क्रेडिट जारी हो सकते हैं।',
        descEn:
          'Only after every scientific and registry criterion passes can verified carbon credits potentially be issued.',
      },
      {
        num: '10',
        titleHi: 'संभावित बिक्री व पारदर्शी लाभ-साझेदारी',
        titleEn: 'Possible Sale & Benefit Sharing',
        descHi:
          'बाजार बिक्री होने पर परियोजना व सत्यापन लागत समायोजन के बाद पूर्व-निर्धारित लिखित समझौते से संभावित शुद्ध लाभ साझा होता है।',
        descEn:
          'If credits are sold, net proceeds after actual project and audit costs are shared under prior written agreements.',
      },
    ],
  },
];

export function CarbonTenStepJourney({ lang }: { lang: Language }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
      {PROJECT_CHAPTERS.map((chapter) => (
        <div
          key={chapter.id}
          className="rounded-3xl bg-white border border-[#E2EBD6] p-6 sm:p-7 flex flex-col"
        >
          {/* Generous Borderless Master Style Editorial Artwork Crowning Each Phase */}
          <div className="pb-5 border-b border-[#E5ECDC] flex flex-col items-center text-center">
            <div className="w-full max-w-[230px] aspect-[4/3] mb-3 flex items-center justify-center">
              <img
                src={GENERATED_ASSETS[chapter.artworkKey]}
                alt={lang === 'hi' ? chapter.titleHi : chapter.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02]"
              />
            </div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#547A38]">
              {lang === 'hi' ? chapter.phaseLabelHi : chapter.phaseLabelEn}
            </p>
            <h3
              className={`mt-1 text-base sm:text-[17.5px] font-extrabold text-[#153E1E] leading-snug ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? chapter.titleHi : chapter.titleEn}
            </h3>
          </div>

          <ol className="pt-5 space-y-4 flex-1">
            {chapter.steps.map((step) => (
              <li key={step.num} className="space-y-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xs font-extrabold text-[#547A38] tabular-nums shrink-0">
                    {step.num}.
                  </span>
                  <h4
                    className={`text-sm font-bold text-[#153E1E] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? step.titleHi : step.titleEn}
                  </h4>
                </div>
                <p
                  className={`pl-6 text-xs sm:text-[12.5px] text-[#3C4F42] leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? step.descHi : step.descEn}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   9. 100-SAPLING FARMER MODEL — CRISP SEQUENTIAL EDITORIAL WALKTHROUGH
      Clean numbered typography (zero recycled small thumbnails!) + honest formula
   ============================================================================ */
export function CarbonHundredSaplingModel({ lang }: { lang: Language }) {
  const panels = [
    {
      step: '01',
      titleHi: '100 देशी पौधे लगाएँ',
      titleEn: 'Plant 100 Native Saplings',
      descHi:
        'किसान अपने खेत की मेड़ या भूमि पर स्थानीय जलवायु के अनुकूल 100 पौधे (खेजड़ी, नीम, आंवला आदि) लगाता है।',
      descEn:
        'A farmer plants 100 climate-suited native saplings (Khejri, Neem, Amla) along farm borders or blocks.',
    },
    {
      step: '02',
      titleHi: 'कई वर्षों की देखभाल',
      titleEn: 'Multi-Year Water & Care',
      descHi:
        'समय पर सिंचाई, मल्चिंग और ट्री-गार्ड से अधिकतम पौधों को 3–5+ वर्षों तक जीवित व स्वस्थ रखा जाता है।',
      descEn:
        'Consistent watering, mulching, and tree guards ensure strong survival across 3–5+ growth seasons.',
    },
    {
      step: '03',
      titleHi: 'स्वस्थ वृक्ष वृद्धि',
      titleEn: 'Healthy Canopy Growth',
      descHi:
        'जैसे-जैसे तना, शाखाएँ और जड़ें बढ़ती हैं, पेड़ में संग्रहित जैविक कार्बन (Biomass) धीरे-धीरे बढ़ता जाता है।',
      descEn:
        'As trunks thicken and canopies spread, living woody biomass gradually stores measurable CO₂.',
    },
    {
      step: '04',
      titleHi: 'वैज्ञानिक मापन व GPS लॉग',
      titleEn: 'Scientific Measurement',
      descHi:
        'समर्पित MRV प्रक्रिया में जीवित संख्या, तने की गोलाई, ऊँचाई और प्लॉट रिकॉर्ड का पारदर्शी वैज्ञानिक मापन।',
      descEn:
        'Dedicated MRV logs record tree survival counts, trunk girth, height, and geo-tagged plot boundaries.',
    },
    {
      step: '05',
      titleHi: 'स्वतंत्र ऑडिट व रजिस्ट्री',
      titleEn: 'Independent Verification',
      descHi:
        'स्वतंत्र तीसरे पक्ष के ऑडिटर की जाँच व रजिस्ट्री स्वीकृति के बाद ही सत्यापित टन CO₂e के अनुसार क्रेडिट तय होते हैं।',
      descEn:
        'Only after independent third-party audit and registry sign-off can verified credits be determined.',
    },
    {
      step: '06',
      titleHi: 'संभावित शुद्ध लाभ-साझेदारी',
      titleEn: 'Possible Net Benefit Share',
      descHi:
        'यदि क्रेडिट बिकते हैं, तो वास्तविक परियोजना व ऑडिट लागत घटाकर पूर्व लिखित अनुबंध से संभावित शुद्ध लाभ साझा होता है।',
      descEn:
        'If credits are sold, net proceeds after actual project & audit costs are shared via prior written terms.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 pt-2">
        {panels.map((panel) => (
          <div
            key={panel.step}
            className="pt-5 border-t border-[#DCE6CF] space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-[0.12em] text-[#547A38] tabular-nums">
                {lang === 'hi' ? `चरण ${panel.step}` : `STEP ${panel.step}`}
              </span>
              <span className="text-xl font-editorial font-bold text-[#CBE0B0] tabular-nums" aria-hidden="true">
                {panel.step}
              </span>
            </div>
            <h3
              className={`text-base font-extrabold text-[#153E1E] leading-snug ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? panel.titleHi : panel.titleEn}
            </h3>
            <p
              className={`text-xs sm:text-[13.5px] text-[#3B4E40] leading-[1.68] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? panel.descHi : panel.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Transparent Formula + Explicit Non-Guarantee Disclosure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6 rounded-2xl bg-[#FAF8F2] border border-[#E0D4B9] p-5 sm:p-6 space-y-2.5">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#2F6D26]">
            {lang === 'hi' ? 'पारदर्शी गणना सूत्र' : 'Transparent Accounting Formula'}
          </p>
          <p className="text-base sm:text-lg font-extrabold text-[#153E1E] leading-snug">
            {lang === 'hi'
              ? 'संभावित शुद्ध लाभ = (सत्यापित कार्बन क्रेडिट × बाज़ार मूल्य) − वास्तविक परियोजना, MRV व ऑडिट लागत'
              : 'Potential Net Proceeds = (Verified Carbon Credits × Market Price) − Actual Project, MRV & Audit Costs'}
          </p>
          <p className="text-xs text-[#445649] leading-relaxed">
            {lang === 'hi'
              ? 'लाभ-साझेदारी का अनुपात परियोजना आरंभ होने से पहले स्पष्ट लिखित समझौते (Prior Written Agreement) में तय किया जाता है।'
              : 'Exact benefit-sharing ratios are documented transparently in a prior written agreement before project enrollment.'}
          </p>
        </div>

        <div className="lg:col-span-6 rounded-2xl bg-[#FFF9EE] border border-[#D98A2B]/40 p-5 sm:p-6 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-[#A45D09] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1.5">
            <h4 className="text-sm sm:text-base font-bold text-[#6E3D04] font-hindi">
              {lang === 'hi'
                ? 'महत्वपूर्ण सच: 100 पौधे लगाने का अर्थ 100 कार्बन क्रेडिट मिलना नहीं है'
                : 'Honest Reality: Planting 100 Saplings Does NOT Equal 100 Carbon Credits'}
            </h4>
            <p className="text-xs sm:text-[13px] text-[#5C3A10] leading-relaxed">
              {lang === 'hi'
                ? 'यह केवल प्रक्रिया समझाने का उदाहरण है। प्रति पेड़ कोई निश्चित रुपये या निश्चित आय की गारंटी नहीं दी जाती। वास्तविक परिणाम प्रजाति, जीवित दर, वैज्ञानिक मापन, स्वतंत्र सत्यापन और बाज़ार स्थितियों पर निर्भर करते हैं।'
                : 'This is strictly an educational walkthrough. Zero fixed rupee-per-tree figure or guaranteed income is promised. Real outcomes depend on species, survival rates, scientific measurement, independent verification, and market conditions.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   10. INTERACTIVE SEQUENTIAL "SAMBHAVIT" (INDICATIVE) CARBON ESTIMATOR
       Strictly sequential & educational with prominent honesty disclosures.
   ============================================================================ */
export function CarbonIndicativeCalculator({
  lang,
  onScrollToRegister,
}: {
  lang: Language;
  onScrollToRegister: () => void;
}) {
  const [saplings, setSaplings] = useState<number>(100);
  const [years, setYears] = useState<number>(10);
  const [survivalRate, setSurvivalRate] = useState<number>(75);

  const est = estimateIndicativeCarbonImpact({
    saplings,
    years,
    survivalRatePercent: survivalRate,
  });

  const presets = [100, 250, 500, 1000, 2000];
  const yearOptions = [5, 10, 15, 20];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#F7FBF3] via-white to-[#FAF8F2] border border-[#D4E2C4] p-5 sm:p-8 shadow-[0_16px_40px_-24px_rgba(21,62,30,0.18)] space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-4 border-b border-[#DCEAD0]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-[#286329]">
            <SlidersHorizontal className="w-4 h-4 text-[#5EA433]" aria-hidden="true" />
            <span>
              {lang === 'hi'
                ? 'संभावित कार्बन एवं लाभ अनुमानक (केवल शैक्षिक मॉडल)'
                : 'INDICATIVE CARBON & CO-BENEFIT ESTIMATOR (EDUCATIONAL MODEL)'}
            </span>
          </div>
          <h3
            className={`text-xl sm:text-2xl font-extrabold text-[#153E1E] leading-snug ${
              lang === 'hi' ? 'font-hindi' : 'font-editorial'
            }`}
          >
            {lang === 'hi'
              ? 'पौधों की संख्या, वर्षों और जीवितता के अनुसार संभावित क्रमबद्ध अनुमान समझें'
              : 'Explore the Sequential Carbon Pathway by Saplings, Years & Survival'}
          </h3>
        </div>
        <p className="text-[11.5px] font-semibold text-[#8A4B08] shrink-0">
          {lang === 'hi'
            ? 'कोई गारंटीकृत आय नहीं · सांकेतिक उदाहरण'
            : 'Non-Binding · Indicative Estimate Only'}
        </p>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white border border-[#DCEAD0] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="cc-calc-saplings"
              className={`text-xs font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}
            >
              {lang === 'hi' ? '1. लगाए गए देशी पौधे' : '1. Native Saplings Planted'}
            </label>
            <span className="text-base font-extrabold text-[#1B5A32] tabular-nums">
              {saplings.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            id="cc-calc-saplings"
            type="range"
            min={50}
            max={2000}
            step={50}
            value={saplings}
            onChange={(e) => setSaplings(Number(e.target.value))}
            className="w-full accent-[#1E6B2E] cursor-pointer"
          />
          <div className="flex flex-wrap gap-1.5">
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSaplings(val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer tabular-nums ${
                  saplings === val
                    ? 'bg-[#153E1E] text-white'
                    : 'bg-[#F3FAE8] text-[#285E2B] hover:bg-[#E1F2C9]'
                }`}
              >
                {val.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#DCEAD0] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi' ? '2. वृक्ष वृद्धि अवधि (वर्ष)' : '2. Growth Horizon (Years)'}
            </span>
            <span className="text-base font-extrabold text-[#1B5A32] tabular-nums">
              {years} {lang === 'hi' ? 'वर्ष' : 'yrs'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {yearOptions.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setYears(yr)}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer tabular-nums ${
                  years === yr
                    ? 'bg-[#153E1E] text-[#C8F19E]'
                    : 'bg-[#F3FAE8] text-[#153E1E] hover:bg-[#E1F2C9]'
                }`}
              >
                {yr} {lang === 'hi' ? 'वर्ष' : 'Y'}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#4C6152] leading-snug">
            {lang === 'hi'
              ? 'लंबी अवधि और स्वस्थ वृद्धि से तने व मिट्टी में कार्बन भंडार बढ़ता है।'
              : 'Longer multi-year growth steadily expands woody & soil carbon stocks.'}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#DCEAD0] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="cc-calc-survival"
              className={`text-xs font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}
            >
              {lang === 'hi' ? '3. अनुमानित जीवित दर' : '3. Expected Survival Rate'}
            </label>
            <span className="text-base font-extrabold text-[#1B5A32] tabular-nums">
              {survivalRate}%
            </span>
          </div>
          <input
            id="cc-calc-survival"
            type="range"
            min={60}
            max={85}
            step={5}
            value={survivalRate}
            onChange={(e) => setSurvivalRate(Number(e.target.value))}
            className="w-full accent-[#1E6B2E] cursor-pointer"
          />
          <p className="text-[11px] text-[#4C6152] leading-snug">
            {lang === 'hi'
              ? 'सिंचाई, मल्चिंग और ट्री-गार्ड से जितने अधिक पौधे जीवित रहते हैं, लाभ उतना बढ़ता है।'
              : 'Consistent watering, mulching, and tree guards directly improve survival.'}
          </p>
        </div>
      </div>

      {/* SEQUENTIAL 4-STEP OUTPUT PIPELINE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-white border border-[#DCEAD0] p-4 space-y-1">
          <p className="text-[11px] font-bold text-[#5A7B3B]">
            {lang === 'hi' ? 'चरण 1 · जीवित वृक्ष' : 'Step 1 · Surviving Trees'}
          </p>
          <p className="text-2xl font-extrabold text-[#153E1E] tabular-nums">
            ~{est.survivingTrees.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#4A5F50]">
            {lang === 'hi'
              ? `${est.plantedSaplings.toLocaleString('en-IN')} पौधों में से ${est.survivalRatePercent}% जीवितता पर`
              : `At ${est.survivalRatePercent}% survival of ${est.plantedSaplings.toLocaleString('en-IN')} saplings`}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#DCEAD0] p-4 space-y-1">
          <p className="text-[11px] font-bold text-[#5A7B3B]">
            {lang === 'hi' ? 'चरण 2 · संभावित CO₂e अवशोषण' : 'Step 2 · Indicative CO₂e Stored'}
          </p>
          <p className="text-2xl font-extrabold text-[#153E1E] tabular-nums">
            {est.indicativeCo2TonnesLow} – {est.indicativeCo2TonnesHigh}{' '}
            <span className="text-sm font-bold text-[#2F6D26]">tCO₂e</span>
          </p>
          <p className="text-[11px] text-[#4A5F50]">
            {lang === 'hi'
              ? `${est.years} वर्षों में राजस्थान की शुष्क/अर्ध-शुष्क प्रजातियों का सांकेतिक दायरा`
              : `Dryland native range across ${est.years} years`}
          </p>
        </div>

        <div className="rounded-2xl bg-[#F3FAE8] border border-[#9FD159]/70 p-4 space-y-1">
          <p className="text-[11px] font-bold text-[#265E29]">
            {lang === 'hi' ? 'चरण 3 · संभावित क्रेडिट (20% बफर बाद)' : 'Step 3 · Potential Credits (After 20% Buffer)'}
          </p>
          <p className="text-2xl font-extrabold text-[#153E1E] tabular-nums">
            {est.indicativeCreditsLow} – {est.indicativeCreditsHigh}
          </p>
          <p className="text-[11px] text-[#35523C]">
            {lang === 'hi'
              ? 'रजिस्ट्री बफर व स्वतंत्र MRV सत्यापन के अधीन'
              : 'Subject to registry buffer & independent audit'}
          </p>
        </div>

        <div className="rounded-2xl bg-[#153E1E] text-white p-4 space-y-1">
          <p className="text-[11px] font-bold text-[#C8F19E]">
            {lang === 'hi' ? 'चरण 4 · सांकेतिक शुद्ध मूल्य दायरा*' : 'Step 4 · Illustrative Net Range*'}
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
            ₹{est.illustrativeNetInrLow.toLocaleString('en-IN')} – ₹
            {est.illustrativeNetInrHigh.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-white/80">
            {lang === 'hi'
              ? 'MRV/ऑडिट लागत घटाकर · बाज़ार दर अनिश्चित'
              : 'Post MRV/audit costs · variable market scenario'}
          </p>
        </div>
      </div>

      {/* Prominent Mandatory Legal & Honesty Disclaimer + Register CTA */}
      <div className="rounded-2xl bg-[#FFF9EE] border border-[#D98A2B]/40 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#A45D09] shrink-0 mt-0.5" aria-hidden="true" />
          <p className={`text-xs text-[#5C3A10] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
            <strong>
              {lang === 'hi' ? '*महत्वपूर्ण पारदर्शिता सूचना: ' : '*Mandatory Transparency Notice: '}
            </strong>
            {lang === 'hi'
              ? 'उपरोक्त आँकड़े केवल प्रक्रिया को सरल रूप से समझाने हेतु शैक्षिक व सांकेतिक अनुमान हैं। GOVEDA किसी भी निश्चित आय, निश्चित कार्बन कीमत या गारंटीकृत भुगतान का वादा नहीं करता। वास्तविक परिणाम प्रजाति, जीवित दर, वैज्ञानिक MRV, स्वतंत्र ऑडिट, रजिस्ट्री स्वीकृति और बाजार दर पर निर्भर करेंगे—तथा वृक्षों से फल, चारा, छांव व उपजाऊ मिट्टी का सीधा लाभ सदैव किसान का रहता है।'
              : 'Figures above are strictly educational and illustrative to help farmers understand how survival, registry buffers, and audit costs work. GOVEDA promises zero fixed income, fixed credit price, or guaranteed payout. Actual results depend on species, survival, MRV, independent verification, and market conditions—while shade, fruit, fodder, and richer soil always benefit the farmer directly.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onScrollToRegister}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#153E1E] text-white text-xs font-bold hover:bg-[#1E562A] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span>{lang === 'hi' ? 'किसान पंजीकरण करें' : 'Register Interest'}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   11. CLEAN BOTTOM "BE A PART OF THE CLIMATE SOLUTION" CTA BAR
       Single seamless transition into global Footer (Zero duplicate horizon!)
   ============================================================================ */
export function CarbonClimateSolutionCta({
  lang,
  onScrollToRegister,
  onNavigate,
}: {
  lang: Language;
  onScrollToRegister: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="relative bg-gradient-to-b from-white to-[#F3FAE8] pt-8 pb-12 sm:pb-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl bg-white border border-[#DCEAD0] shadow-[0_18px_42px_-22px_rgba(21,62,30,0.22)] px-6 py-6 sm:px-9 sm:py-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF6D5] border border-[#CBE4A5] flex items-center justify-center shrink-0">
              <Sprout className="w-7 h-7 text-[#1E6B2E]" aria-hidden="true" />
            </div>
            <div>
              <h3
                className={`text-lg sm:text-xl font-extrabold text-[#153E1E] leading-snug ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi'
                  ? 'जलवायु समाधान का हिस्सा बनें।'
                  : 'Be a Part of the Climate Solution.'}
              </h3>
              <p
                className={`mt-1 text-xs sm:text-sm text-[#3F5546] max-w-[52ch] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi'
                  ? 'भारत भर में किसान-केंद्रित वृक्षारोपण, पारदर्शी कार्बन परियोजनाओं और ग्रामीण पर्यावरण पहल में साझेदारी या सहयोग करें।'
                  : 'Support, partner, or collaborate on science-led, community-rooted tree and climate projects across Rajasthan and India.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onScrollToRegister}
              className="spring-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#154A22] text-white text-xs sm:text-sm font-bold hover:bg-[#1E622E] cursor-pointer whitespace-nowrap"
            >
              <span>{lang === 'hi' ? 'मिशन में साझेदार बनें' : 'Partner With Us'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/donate')}
              className="spring-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#153E1E] border border-[#2C6432]/50 text-xs sm:text-sm font-bold hover:bg-[#F3FAE8] cursor-pointer whitespace-nowrap"
            >
              <span>{lang === 'hi' ? 'सहयोग / दान करें' : 'Donate Now'}</span>
              <Heart className="w-4 h-4 text-[#2F6D26]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
