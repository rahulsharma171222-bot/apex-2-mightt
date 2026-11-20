import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sprout,
  Droplets,
  Sun,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import {
  GAUSHALA_REALITIES,
  GAUSHALA_WHY_JOIN_BENEFITS,
  GAUSHALA_TEN_ACTIVITIES,
  GAUSHALA_ECOSYSTEM_NODES,
  GAUSHALA_SOIL_PRINCIPLES,
  GAUSHALA_NATURAL_INPUTS,
  GAUSHALA_LAND_USES,
  GAUSHALA_48_PRODUCTS,
} from '../data/gaushalaCatalogData';
import type { Language } from '../types/goveda';

/* ============================================================================
   FLOATING BOTANICAL LEAF ACCENT (LIVING MOTION, COMPOSITOR-ONLY)
   ============================================================================ */
function FloatingLeafSvg({
  className = '',
  tone = '#82C341',
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M3 20 C8 6 22 2 37 5 C32 16 20 22 3 20 Z"
        fill={tone}
        fillOpacity="0.88"
      />
      <path
        d="M4 19.5 C14 14 24 10 35 6"
        stroke="#1B5A32"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================================
   1. GAUSHALA ARTISTIC HERO — FULL-BLEED LUMINOUS DIORAMA + SOFT ORGANIC CLOUDS
      Directly faithful to user's reference art: big commanding artwork,
      borderless floating callouts, thick green circular flow arrows, 3 pillars
   ============================================================================ */
interface GaushalaArtisticHeroProps {
  lang: Language;
  onNavigate: (path: string) => void;
  onScrollTo: (sectionId: string) => void;
}

interface HeroDioramaCallout {
  id: string;
  badge?: string;
  targetId: string;
  titleHi: string;
  titleEn: string;
  subHi: string;
  subEn: string;
  cardStyle: React.CSSProperties;
  dot: [number, number];
  lineFrom: [number, number];
  icon: React.ReactNode;
}

const GAUSHALA_HERO_CALLOUTS: HeroDioramaCallout[] = [
  {
    id: 'welfare',
    badge: '1',
    targetId: 'gs-welfare',
    titleHi: 'पशु कल्याण',
    titleEn: 'Animal Welfare',
    subHi: 'स्वस्थ, सुरक्षित और मानवीय देखभाल',
    subEn: 'Healthy, safe & humane shelter care',
    cardStyle: { top: '0%', left: '34%', width: '215px' },
    lineFrom: [414, 72],
    dot: [414, 152],
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" stroke="#1E6B2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12c-2-.9-3.2-2.7-2.8-4.5 1.5.7 2.7 1.7 3.8 2.9" />
        <path d="M24 12c2-.9 3.2-2.7 2.8-4.5-1.5.7-2.7 1.7-3.8 2.9" />
        <path d="M9.5 12.5c0-2.1 2.8-3.5 6.5-3.5s6.5 1.4 6.5 3.5v4.8c0 3.9-2.8 6.9-6.5 6.9s-6.5-3-6.5-6.9v-4.8z" />
        <circle cx="13.5" cy="15.5" r="0.9" fill="#1E6B2E" stroke="none" />
        <circle cx="18.5" cy="15.5" r="0.9" fill="#1E6B2E" stroke="none" />
        <path d="M13.6 20c1.4.8 3.4.8 4.8 0" />
      </svg>
    ),
  },
  {
    id: 'water',
    badge: '2',
    targetId: 'gs-welfare',
    titleHi: 'जल प्रबंधन',
    titleEn: 'Water Management',
    subHi: 'वर्षा जल संचयन और स्वच्छ जल संरक्षण',
    subEn: 'Rainwater harvesting & clean trough',
    cardStyle: { top: '19%', left: '0%', width: '196px' },
    lineFrom: [152, 198],
    dot: [176, 266],
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" stroke="#1E6B2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 5.5C16 5.5 8.5 14 8.5 19.5a7.5 7.5 0 0 0 15 0C23.5 14 16 5.5 16 5.5z" />
        <path d="M12.5 20.5a3.5 3.5 0 0 0 3.5 3.2" stroke="#6EB83A" />
      </svg>
    ),
  },
  {
    id: 'fodder',
    badge: '3',
    targetId: 'gs-circular',
    titleHi: 'हरा चारा',
    titleEn: 'Green Fodder',
    subHi: 'पोषणयुक्त चारे का स्थानीय उत्पादन',
    subEn: 'Nutritious local Napier & green feed',
    cardStyle: { bottom: '5%', left: '1%', width: '192px' },
    lineFrom: [190, 424],
    dot: [270, 360],
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" stroke="#1E6B2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 25V9" />
        <path d="M16 25c-1-6-4-10-8-13" />
        <path d="M16 25c1-6 4-10 8-13" />
        <path d="M11 25c-1.5-4-3.5-7-6-8.5" stroke="#6EB83A" />
        <path d="M21 25c1.5-4 3.5-7 6-8.5" stroke="#6EB83A" />
      </svg>
    ),
  },
  {
    id: 'compost',
    badge: '4',
    targetId: 'gs-manure',
    titleHi: 'गोबर से जैविक खाद',
    titleEn: 'Organic Compost',
    subHi: 'गोबर का वैज्ञानिक प्रबंधन व खाद निर्माण',
    subEn: 'Scientific dung-to-vermicompost unit',
    cardStyle: { bottom: '0%', left: '43%', width: '215px' },
    lineFrom: [446, 456],
    dot: [412, 398],
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" stroke="#7A4F26" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 23c2-5 5.5-8 10-8s8 3 10 8H6z" fill="#E8D8BE" />
        <path d="M16 15v-5" stroke="#1E6B2E" />
        <path d="M16 11c-3 0-5-1.8-5-4.5 2.7 0 4.8 1.6 5 4.5z" stroke="#1E6B2E" />
        <path d="M16 10c3 0 5-1.8 5-4.5-2.7 0-4.8 1.6-5 4.5z" stroke="#6EB83A" />
      </svg>
    ),
  },
  {
    id: 'farming',
    badge: '5',
    targetId: 'gs-manure',
    titleHi: 'प्राकृतिक खेती',
    titleEn: 'Natural Farming',
    subHi: 'जैविक खाद से रसायनमुक्त स्वस्थ खेती',
    subEn: 'Chemical-free living soil cultivation',
    cardStyle: { bottom: '13%', right: '0%', width: '196px' },
    lineFrom: [612, 396],
    dot: [552, 344],
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" stroke="#1E6B2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 25V13" />
        <path d="M16 18c-5.5 0-8.5-3.2-8.5-8 4.8 0 8 2.8 8.5 8z" />
        <path d="M16 15c5 0 8.5-3 8.5-7.5-4.5 0-8 2.6-8.5 7.5z" stroke="#6EB83A" />
        <path d="M9 26c4-1.2 10-1.2 14 0" stroke="#7A4F26" />
      </svg>
    ),
  },
  {
    id: 'vet-health',
    targetId: 'gs-welfare',
    titleHi: 'पशु स्वास्थ्य',
    titleEn: 'Animal Health',
    subHi: 'नियमित जाँच, टीकाकरण और उपचार',
    subEn: 'Routine checkups & veterinary care',
    cardStyle: { top: '6%', right: '0%', width: '190px' },
    lineFrom: [690, 146],
    dot: [656, 232],
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" stroke="#1E6B2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 7v7a5 5 0 0 0 10 0V7" />
        <path d="M14 19v3a4 4 0 0 0 8 0v-4" />
        <circle cx="22" cy="15.5" r="2.2" stroke="#6EB83A" />
      </svg>
    ),
  },
];

const GAUSHALA_THREE_PILLARS = [
  {
    id: 'pillar-welfare',
    targetId: 'gs-welfare',
    hi: 'पशु कल्याण',
    en: 'Animal Welfare',
    subHi: 'आवास, जल, चारा व चिकित्सा',
    subEn: 'Shelter, water, fodder & vet care',
    icon: (
      <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none" stroke="#1B5A32" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14c-2.5-1-4-3.2-3.5-5.5 1.8.8 3.2 2 4.5 3.5" />
        <path d="M27 14c2.5-1 4-3.2 3.5-5.5-1.8.8-3.2 2-4.5 3.5" />
        <path d="M10.5 14.5c0-2.5 3.2-4 7.5-4s7.5 1.5 7.5 4v5.5c0 4.5-3.2 8-7.5 8s-7.5-3.5-7.5-8v-5.5z" />
        <circle cx="15" cy="18" r="1.1" fill="#1B5A32" stroke="none" />
        <circle cx="21" cy="18" r="1.1" fill="#1B5A32" stroke="none" />
        <path d="M15.2 23.2c1.6 1 4 1 5.6 0" />
      </svg>
    ),
  },
  {
    id: 'pillar-resources',
    targetId: 'gs-circular',
    hi: 'संसाधनों का सदुपयोग',
    en: 'Resource Efficiency',
    subHi: 'गोबर से खाद, बायोगैस व जल संरक्षण',
    subEn: 'Compost, biogas & rainwater reuse',
    icon: (
      <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none" stroke="#1B5A32" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 7a11 11 0 1 1-9.5 5.5" />
        <path d="M6.5 9.5L8.5 13l3.8-.8" />
        <path d="M18 23v-8" stroke="#6EB83A" />
        <path d="M18 18c-4 0-6-2.4-6-5.5 3.5 0 5.8 2 6 5.5z" fill="#82C341" fillOpacity="0.28" stroke="#4D8E27" />
        <path d="M18 16c3.8 0 6-2.2 6-5.2-3.3 0-5.6 1.8-6 5.2z" fill="#82C341" fillOpacity="0.28" stroke="#4D8E27" />
      </svg>
    ),
  },
  {
    id: 'pillar-self-reliance',
    targetId: 'gs-products',
    hi: 'गौशाला आत्मनिर्भरता',
    en: 'Gaushala Self-Reliance',
    subHi: '48 गोबर उत्पाद, नर्सरी व महिला SHG',
    subEn: '48 eco products, nursery & women SHGs',
    icon: (
      <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" fill="none" stroke="#1B5A32" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 17.5L18 8l11.5 9.5" />
        <path d="M10 15.5V27h16V15.5" />
        <path d="M18 26.5v-6" stroke="#6EB83A" />
        <path d="M18 22.5c-3.2 0-5-1.8-5-4.5 2.8 0 4.8 1.5 5 4.5z" fill="#82C341" fillOpacity="0.35" stroke="#4D8E27" />
        <path d="M18 21.5c3.2 0 5-1.8 5-4.5-2.8 0-4.8 1.5-5 4.5z" fill="#82C341" fillOpacity="0.35" stroke="#4D8E27" />
      </svg>
    ),
  },
];

export function GaushalaArtisticHero({
  lang,
  onNavigate,
  onScrollTo,
}: GaushalaArtisticHeroProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [activeCallout, setActiveCallout] = useState<string>('welfare');

  return (
    <section className="relative bg-gradient-to-b from-[#FCFDF9] via-white to-[#F4FAEC] overflow-hidden border-b border-[#DCEAD0]">
      {/* Warm Sunlit Organic Aura Behind Diorama */}
      <div
        className="pointer-events-none hidden lg:block absolute right-[4%] top-[6%] w-[780px] h-[520px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(235,244,210,0.62)_0%,rgba(255,250,234,0.38)_42%,rgba(255,255,255,0)_74%)] z-0"
        aria-hidden="true"
      />

      {/* Soft Organic Botanical Waves Along Base */}
      <svg
        viewBox="0 0 1440 220"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-36 sm:h-48 z-0 select-none"
      >
        <path
          d="M0 95 C140 65 260 155 440 165 C650 175 940 165 1140 125 C1280 98 1370 42 1440 28 L1440 220 L0 220 Z"
          fill="#EFF7E4"
        />
        <path
          d="M0 132 C125 110 220 185 370 220 L0 220 Z"
          fill="#DCEFC4"
          fillOpacity="0.88"
        />
        <path
          d="M1130 220 C1235 190 1335 120 1440 78 L1440 220 Z"
          fill="#8AC744"
          fillOpacity="0.82"
        />
        <path
          d="M1230 220 C1310 198 1385 152 1440 128 L1440 220 Z"
          fill="#5AA630"
          fillOpacity="0.65"
        />
      </svg>

      <FloatingLeafSvg
        tone="#82C341"
        className="hidden sm:block absolute top-12 left-[40%] w-9 h-5 animate-leaf-drift z-20 opacity-85"
      />
      <FloatingLeafSvg
        tone="#63A832"
        className="hidden lg:block absolute top-24 right-8 w-7 h-4 animate-leaf-drift-reverse z-20 opacity-75"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-8 sm:pb-10 relative z-10">
        <button
          type="button"
          onClick={() => onNavigate('/missions')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5A32] hover:underline mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{lang === 'hi' ? 'सभी 10 मिशन देखें' : 'Back to All 10 Missions'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center">
          {/* LEFT EDITORIAL COLUMN */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.18em] text-[#285E2B]">
                GOVEDA · PEOPLE | PLANET | PROSPERITY
              </span>
              <span className="h-[1.5px] w-12 bg-[#82C341]" aria-hidden="true" />
            </div>

            <div className="relative inline-block">
              <h1
                className={`text-[2.3rem] sm:text-[3.1rem] xl:text-[3.55rem] font-extrabold text-[#153E1E] leading-[1.06] tracking-tight text-balance ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi' ? (
                  <>
                    <span className="block">आत्मनिर्भर</span>
                    <span className="relative inline-block text-[#153E1E]">
                      गौशाला मिशन
                      <svg
                        viewBox="0 0 42 28"
                        fill="none"
                        aria-hidden="true"
                        className="inline-block w-9 h-6 sm:w-11 sm:h-7 -mt-6 ml-1 align-top"
                      >
                        <path d="M3 24 C8 9 23 2 40 3 C35 17 22 25 3 24 Z" fill="#82C341" />
                        <path d="M5 23 C15 16 26 10 38 4" stroke="#2B6E24" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block">Self-Reliant</span>
                    <span className="relative inline-block text-[#153E1E]">
                      Gaushala Mission
                      <svg
                        viewBox="0 0 42 28"
                        fill="none"
                        aria-hidden="true"
                        className="inline-block w-8 h-6 -mt-5 ml-1.5 align-top"
                      >
                        <path d="M3 24 C8 9 23 2 40 3 C35 17 22 25 3 24 Z" fill="#82C341" />
                        <path d="M5 23 C15 16 26 10 38 4" stroke="#2B6E24" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </>
                )}
              </h1>
            </div>

            <div className="inline-block rounded-2xl bg-[#EAF6D5] px-4 py-2.5">
              <p
                className={`text-sm sm:text-[16.5px] font-bold italic text-[#153E1E] leading-snug ${
                  lang === 'hi' ? '' : 'font-hindi not-italic'
                }`}
              >
                {lang === 'hi'
                  ? 'Building Self-Reliant, Caring & Resource-Efficient Gaushalas'
                  : 'गौसेवा, स्वच्छ संसाधन प्रबंधन और ग्रामीण आत्मनिर्भरता का एकीकृत केंद्र'}
              </p>
            </div>

            {/* MOBILE / TABLET (< lg): HERO ILLUSTRATION DIRECTLY AFTER SUBTITLE WITH INTERACTIVE PINS */}
            {!heroImgFailed && (
              <div className="lg:hidden space-y-2.5 pt-1">
                <div className="relative -mx-2 sm:mx-0">
                  <img
                    src={GENERATED_ASSETS.gaushalaHeroPanoramic}
                    alt={
                      lang === 'hi'
                        ? 'आत्मनिर्भर गौशाला परिसर का उज्ज्वल 3D-चित्र'
                        : 'Luminous 3D-painterly Gaushala campus diorama'
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-auto object-contain mix-blend-multiply brightness-[1.03] contrast-[1.04]"
                  />

                  {/* Clean Tappable Numbered Pins Right On the Hero Artwork (Zero Bulky Repeated Cards) */}
                  {GAUSHALA_HERO_CALLOUTS.map((c, idx) => {
                    const pinPos: [number, number][] = [
                      [52, 34], // 1. Cattle welfare
                      [26, 52], // 2. Water management
                      [33, 72], // 3. Green fodder
                      [59, 74], // 4. Compost
                      [78, 68], // 5. Natural farming
                      [80, 44], // 6. Vet health
                    ];
                    const [px, py] = pinPos[idx] ?? [50, 50];
                    const isFocused = (activeCallout ?? GAUSHALA_HERO_CALLOUTS[0].id) === c.id;
                    return (
                      <button
                        key={`mob-pin-${c.id}`}
                        type="button"
                        onClick={() => setActiveCallout(c.id)}
                        style={{ left: `${px}%`, top: `${py}%` }}
                        aria-label={lang === 'hi' ? c.titleHi : c.titleEn}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-md transition-transform cursor-pointer ${
                          isFocused
                            ? 'bg-[#153E1E] text-white scale-120 z-20'
                            : 'bg-[#2F7D32]/92 text-white z-10'
                        }`}
                      >
                        {c.badge ?? '+'}
                      </button>
                    );
                  })}
                </div>

                {/* Single Sleek Interactive Spotlight Strip for Active Pin */}
                {(() => {
                  const current =
                    GAUSHALA_HERO_CALLOUTS.find((c) => c.id === activeCallout) ??
                    GAUSHALA_HERO_CALLOUTS[0];
                  return (
                    <button
                      type="button"
                      onClick={() => onScrollTo(current.targetId)}
                      className="w-full text-left rounded-2xl bg-white/92 shadow-[0_8px_20px_-14px_rgba(21,62,30,0.22)] px-3.5 py-2.5 flex items-center gap-3 cursor-pointer"
                    >
                      <div className="shrink-0">{current.icon}</div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-extrabold text-[#153E1E] leading-tight ${
                            lang === 'hi' ? 'font-hindi' : ''
                          }`}
                        >
                          {current.badge ? `${current.badge}. ` : ''}
                          {lang === 'hi' ? current.titleHi : current.titleEn}
                        </p>
                        <p
                          className={`text-[11px] text-[#455B4B] leading-snug mt-0.5 ${
                            lang === 'hi' ? 'font-hindi' : ''
                          }`}
                        >
                          {lang === 'hi' ? current.subHi : current.subEn}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#2F7D32] shrink-0" aria-hidden="true" />
                    </button>
                  );
                })()}
              </div>
            )}

            <p
              className={`text-sm sm:text-[15.5px] text-[#283B2E] leading-[1.72] max-w-[46ch] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'सीधी बात — जब गौशाला की गायों की अच्छी देखभाल हो और रोज़ का गोबर खाद, गैस, पौधों व गाँव के काम में लगे, तो गौशाला केवल चंदे पर नहीं बल्कि अपने पैरों पर खड़ी हो सकती है।'
                : 'Put simply: when cows are cared for well and daily dung is turned into compost, clean kitchen gas, saplings, and village crafts, a Gaushala can stand on its own feet instead of depending only on donations.'}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onScrollTo('gs-circular')}
                className="spring-btn inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#154A22] text-white text-xs sm:text-sm font-bold hover:bg-[#1E622E] cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>{lang === 'hi' ? 'आसान भाषा में समझें' : 'See How It Works'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onScrollTo('gs-register')}
                className="spring-btn inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white text-[#153E1E] border border-[#2C6432]/60 text-xs sm:text-sm font-bold hover:bg-[#F3FAE9] hover:border-[#154A22] cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-[#2A6F2B]" aria-hidden="true" />
                <span>{lang === 'hi' ? 'अपनी गौशाला जोड़ें' : 'Join With Your Gaushala'}</span>
              </button>
            </div>

            <p
              className={`text-[11.5px] text-[#4E6154] leading-relaxed ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'साफ और ईमानदार बात: सबसे पहले गायों की भलाई · तय कमाई या गोबर भाव की कोई झूठी गारंटी नहीं · हर काम सुरक्षा व नियमों के साथ'
                : 'Honest approach: Cattle welfare comes first · No false income or fixed dung-rate promises · Strict safety & FSSAI/PESO rules'}
            </p>
          </div>

          {/* RIGHT COLUMN — BIG, COMMANDING LUMINOUS DIORAMA + BORDERLESS CALLOUT CLOUDS */}
          <div className="lg:col-span-7">
            {/* DESKTOP (lg+) */}
            <div className="hidden lg:block relative w-full h-[525px] xl:h-[565px] select-none">
              {!heroImgFailed && (
                <div className="absolute top-[7%] left-[4%] right-[3%] bottom-[8%] flex items-center justify-center">
                  <img
                    src={GENERATED_ASSETS.gaushalaHeroPanoramic}
                    alt={
                      lang === 'hi'
                        ? 'आत्मनिर्भर गौशाला परिसर का उज्ज्वल 3D-चित्र: सुरक्षित शेड, स्वस्थ गोवंश, वर्षा जल कुंड, हरा चारा, जैविक खाद, प्राकृतिक खेती और पशु चिकित्सालय'
                        : 'Luminous 3D-painterly Gaushala diorama showing cows in shelter, rainwater stone well, green fodder, brick compost pit, vegetable beds, and veterinary clinic'
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-contain mix-blend-multiply brightness-[1.03] contrast-[1.04] scale-[1.06]"
                  />
                </div>
              )}

              {/* Thick Organic Curving Flow Arrows + Clean Pointer Pins */}
              <svg
                viewBox="0 0 800 540"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full z-10"
              >
                {/* Bold Lush Green Flow Arrows Wrapping the Gaushala (Matching User Reference) */}
                <path
                  d="M526 92 C574 96 610 112 636 138"
                  stroke="#7DC142"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />
                <polygon points="644,144 628,141 638,128" fill="#7DC142" />

                <path
                  d="M750 286 C754 334 738 372 712 400"
                  stroke="#7DC142"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.86"
                />
                <polygon points="706,406 710,391 721,400" fill="#7DC142" />

                <path
                  d="M368 472 C308 474 260 464 220 442"
                  stroke="#7DC142"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.88"
                />
                <polygon points="212,438 228,437 222,450" fill="#7DC142" />

                <path
                  d="M102 308 C100 264 112 228 134 198"
                  stroke="#7DC142"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.85"
                />
                <polygon points="139,191 126,198 138,207" fill="#7DC142" />

                {GAUSHALA_HERO_CALLOUTS.map((c) => {
                  const isFocused = activeCallout === c.id;
                  return (
                    <g key={`line-${c.id}`}>
                      <line
                        x1={c.lineFrom[0]}
                        y1={c.lineFrom[1]}
                        x2={c.dot[0]}
                        y2={c.dot[1]}
                        stroke={isFocused ? '#1E6B2E' : '#6DB637'}
                        strokeWidth={isFocused ? '2.4' : '1.75'}
                      />
                      <circle
                        cx={c.dot[0]}
                        cy={c.dot[1]}
                        r={isFocused ? '9.5' : '7'}
                        fill="#82C341"
                        fillOpacity="0.34"
                      />
                      <circle
                        cx={c.dot[0]}
                        cy={c.dot[1]}
                        r="4.2"
                        fill="#FFFFFF"
                        stroke="#1E6B2E"
                        strokeWidth="2.1"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Soft Borderless Luminous Floating Callout Clouds */}
              {GAUSHALA_HERO_CALLOUTS.map((c) => {
                const isFocused = activeCallout === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    style={c.cardStyle}
                    onMouseEnter={() => setActiveCallout(c.id)}
                    onFocus={() => setActiveCallout(c.id)}
                    onClick={() => onScrollTo(c.targetId)}
                    className={`absolute z-20 text-left rounded-[26px] px-3.5 py-2.5 flex items-start gap-2.5 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6D26] ${
                      isFocused
                        ? 'bg-white/96 shadow-[0_14px_30px_-10px_rgba(21,62,30,0.26)] ring-2 ring-[#7DC142]/70 -translate-y-0.5'
                        : 'bg-white/88 backdrop-blur-sm shadow-[0_8px_22px_-12px_rgba(21,62,30,0.16)] hover:bg-white/95'
                    }`}
                  >
                    <div className="mt-0.5">{c.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {c.badge && (
                          <span className="w-4 h-4 rounded-full bg-[#1E6B2E] text-white text-[10px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                            {c.badge}
                          </span>
                        )}
                        <span
                          className={`text-[13px] font-extrabold text-[#153E1E] leading-tight ${
                            lang === 'hi' ? 'font-hindi' : ''
                          }`}
                        >
                          {lang === 'hi' ? c.titleHi : c.titleEn}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 text-[11px] text-[#3F5445] leading-[1.35] ${
                          lang === 'hi' ? 'font-hindi' : ''
                        }`}
                      >
                        {lang === 'hi' ? c.subHi : c.subEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FLOATING 3-PILLAR BASE BAR — COMPACT 3-COL ROW ON MOBILE, FULL PILL BAR ON DESKTOP */}
        <div className="mt-5 lg:mt-3 max-w-5xl mx-auto">
          <div className="grid grid-cols-3 divide-x divide-[#DCEAD0] bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-full shadow-[0_14px_34px_-18px_rgba(21,62,30,0.22)] overflow-hidden">
            {GAUSHALA_THREE_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => onScrollTo(pillar.targetId)}
                className="group px-2 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1.5 sm:gap-3 hover:bg-[#F4FBEA] transition-colors cursor-pointer"
              >
                <div className="scale-85 sm:scale-100 transition-transform duration-200 group-hover:scale-105 shrink-0">
                  {pillar.icon}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[11.5px] sm:text-[15.5px] font-extrabold text-[#153E1E] group-hover:text-[#1F6A2B] leading-tight ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? pillar.hi : pillar.en}
                  </p>
                  <p
                    className={`hidden sm:block text-[11px] text-[#4E6454] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? pillar.subHi : pillar.subEn}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   2. ORIGINAL GAUSHALA "WHY IT MATTERS" SHOWCASE (ZERO HOMEPAGE S-WAVE COPY!)
      Bespoke 2×2 Organic Botanical Story Tiles (2×2 on BOTH Mobile & Desktop)
      fusing authentic Gaushala watercolor art directly with everyday Hindi
   ============================================================================ */
const GAUSHALA_WHY_CARDS: {
  id: string;
  assetKey: AssetKey;
  targetId: string;
  dotColor: string;
  tagHi: string;
  tagEn: string;
  idx: number;
}[] = [
  {
    id: 'fodder-crunch',
    assetKey: 'gaushalaRealityFodderSun',
    targetId: 'gs-welfare',
    dotColor: '#D97B1E',
    tagHi: 'दिक्कत 01 · चारा व चंदा',
    tagEn: 'Challenge 01 · Donations',
    idx: 0,
  },
  {
    id: 'dung-wealth',
    assetKey: 'gaushalaDungHubFlow',
    targetId: 'gs-procurement',
    dotColor: '#4E8F2C',
    tagHi: 'दिक्कत 02 · अप्रयुक्त गोबर',
    tagEn: 'Challenge 02 · Unused Dung',
    idx: 1,
  },
  {
    id: 'scheme-gap',
    assetKey: 'gaushalaHeroStorybook',
    targetId: 'gs-schemes',
    dotColor: '#B56E22',
    tagHi: 'दिक्कत 03 · योजना की दूरी',
    tagEn: 'Challenge 03 · Scheme Gap',
    idx: 2,
  },
  {
    id: 'farm-bridge',
    assetKey: 'gaushalaPartnerMeadowBanner',
    targetId: 'gs-manure',
    dotColor: '#2E7D32',
    tagHi: 'दिक्कत 04 · खेत से दूरी',
    tagEn: 'Challenge 04 · Farm Link',
    idx: 3,
  },
];

export function GaushalaWhyOriginalShowcase({
  lang,
  onScrollTo,
}: {
  lang: Language;
  onScrollTo: (id: string) => void;
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAF9F3] to-[#F5F9EE] pt-12 sm:pt-16 pb-10 sm:pb-14">
      {/* Original Soft Organic Sage Leaf Curve Backdrop */}
      <svg
        viewBox="0 0 1440 240"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-36 opacity-60 z-0"
      >
        <path
          d="M0 160 C280 80 560 220 920 140 C1180 82 1340 120 1440 96 L1440 240 L0 240 Z"
          fill="#EAF4DC"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT EDITORIAL COLUMN */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#236B30]">
                {lang === 'hi' ? '01 · आज की असली तस्वीर' : '01 · WHY THIS MATTERS'}
              </span>
              <span className="h-[1.5px] w-14 bg-[#82C341]" aria-hidden="true" />
            </div>

            <div>
              <h2
                className={`text-3xl sm:text-[2.55rem] font-extrabold text-[#153E1E] leading-[1.12] tracking-tight text-balance ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi'
                  ? 'गौशाला को आत्मनिर्भर बनाना क्यों ज़रूरी है?'
                  : 'Why Must Village Gaushalas Become Self-Reliant?'}
              </h2>
              <svg
                viewBox="0 0 264 20"
                fill="none"
                className="w-44 sm:w-52 h-3.5 mt-2"
                aria-hidden="true"
              >
                <path
                  d="M2 14 C72 3 168 1 258 10 C192 9 98 11 4 18 Z"
                  fill="#82C341"
                />
              </svg>
            </div>

            <p
              className={`text-sm sm:text-[15.5px] text-[#283B2E] leading-[1.75] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'आज ज़्यादातर गाँव की गौशालाएँ सिर्फ़ चंदे पर टिकी हैं। गर्मी में चारा महँगा होता है और रोज़ निकलने वाला गोबर बिना उपयोग पड़ा रहता है। जब यही गोबर खेत की खाद, रसोई गैस और गाँव की बहनों के काम से जुड़ जाता है, तो गौशाला और गाँव — दोनों मज़बूत हो जाते हैं।'
                : 'Most village cow shelters still rely only on seasonal donations. Fodder prices surge every summer while daily cow dung goes unused. When that dung connects to local farms, clean cooking gas, and village crafts, both the Gaushala and the village grow stronger.'}
            </p>

            {/* Visual Before → After Natural Pill Strip */}
            <div className="pt-4 border-t border-[#D8CEB8] grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-extrabold text-[#9A5312]">
                  {lang === 'hi' ? 'आज की परेशानी' : 'TODAY’S STRUGGLE'}
                </p>
                <p
                  className={`mt-1 text-xs sm:text-[13px] text-[#3B4E41] leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi'
                    ? 'सिर्फ़ चंदे पर निर्भरता, महँगा चारा और बेकार पड़ा गोबर'
                    : 'Only donations, pricey summer fodder, and unused dung heaps'}
                </p>
              </div>
              <div className="pl-4 border-l border-[#D8CEB8]">
                <p className="text-[11px] font-extrabold text-[#236B30]">
                  {lang === 'hi' ? 'आत्मनिर्भर रास्ता' : 'SELF-RELIANT WAY'}
                </p>
                <p
                  className={`mt-1 text-xs sm:text-[13px] text-[#153E1E] font-medium leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi'
                    ? 'खाद, गैस, पौधे और गाँव का काम — जिससे गायों की सेवा खुद चले'
                    : 'Compost, biogas, saplings & local jobs funding better cow care'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT 2×2 ORGANIC WATERCOLOR STORY GRID (2×2 ON BOTH MOBILE & DESKTOP!) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3.5 sm:gap-5">
            {GAUSHALA_WHY_CARDS.map((card) => {
              const item = GAUSHALA_REALITIES[card.idx];
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onScrollTo(card.targetId)}
                  className="group text-left flex flex-col rounded-[22px] bg-white/88 hover:bg-white shadow-[0_10px_26px_-16px_rgba(21,62,30,0.22)] hover:shadow-[0_14px_32px_-14px_rgba(21,62,30,0.28)] overflow-hidden transition-all duration-200 cursor-pointer"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F7F5EE]">
                    <img
                      src={GENERATED_ASSETS[card.assetKey]}
                      alt={lang === 'hi' ? item.titleHi : item.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/92 backdrop-blur-xs text-[10px] sm:text-[11px] font-extrabold text-[#153E1E] flex items-center gap-1.5 shadow-xs"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: card.dotColor }}
                      />
                      <span>{lang === 'hi' ? card.tagHi : card.tagEn}</span>
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5">
                    <h3
                      className={`text-[13px] sm:text-[15.5px] font-extrabold text-[#153E1E] group-hover:text-[#236B30] leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? item.titleHi : item.titleEn}
                    </h3>
                    <p
                      className={`text-[11.5px] sm:text-[13px] text-[#3B4E41] leading-[1.58] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? item.descHi : item.descEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   3. BELOVED INTERACTIVE 8-NODE ROTATING ECOSYSTEM WHEEL (KEPT INTACT!)
   ============================================================================ */
export function GaushalaRadialEcosystem({
  lang,
  onScrollTo,
}: {
  lang: Language;
  onScrollTo: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(GAUSHALA_ECOSYSTEM_NODES[0].id);
  const activeNode =
    GAUSHALA_ECOSYSTEM_NODES.find((n) => n.id === selectedId) ?? GAUSHALA_ECOSYSTEM_NODES[0];

  const DESKTOP_ORBIT_R = 35.5;
  const DESKTOP_CENTER_R = 20.5;
  const MOBILE_ORBIT_R = 36;
  const MOBILE_CENTER_R = 19.5;

  return (
    <div className="relative overflow-hidden bg-[#FCF8F0] py-12 sm:py-16 border-y border-[#DFCFAF]/75">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(232,206,143,0.38)_0%,rgba(252,248,240,0)_70%)] animate-sun-pulse z-0"
        aria-hidden="true"
      />
      <FloatingLeafSvg
        tone="#82C341"
        className="hidden sm:block absolute top-14 right-[12%] w-9 h-5 animate-leaf-drift z-10 opacity-80"
      />
      <FloatingLeafSvg
        tone="#5EA330"
        className="hidden sm:block absolute bottom-20 left-[9%] w-8 h-5 animate-leaf-drift-reverse z-10 opacity-75"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* LEFT: EDITORIAL STORY + LIVE INTERACTIVE NODE EXPLAINER */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#2F6D26]">
                {lang === 'hi'
                  ? '02 · पूरा चक्र एक नज़र में'
                  : '02 · HOW EVERYTHING CONNECTS'}
              </span>
              <span
                className="h-[1.5px] w-14 bg-gradient-to-r from-[#C68932] to-[#82C341]"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                className={`text-2xl sm:text-3xl lg:text-[2.45rem] font-extrabold text-[#153E1E] leading-[1.12] tracking-tight text-balance ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi'
                  ? 'गौशाला से जुड़ा पूरे गाँव का घूमता चक्र'
                  : 'How One Gaushala Powers the Whole Village'}
              </h2>
              <svg
                viewBox="0 0 264 20"
                fill="none"
                aria-hidden="true"
                className="mt-2 w-44 sm:w-52 h-3.5"
              >
                <path
                  d="M2 14 C72 3 168 1 258 10 C192 9 98 11 4 18 Z"
                  fill="#82C341"
                />
              </svg>
            </div>

            {/* MOBILE (< sm) RADIAL ECOSYSTEM WHEEL */}
            <div className="sm:hidden relative w-full max-w-[360px] mx-auto pt-3 pb-4">
              <div className="relative w-full aspect-square">
                <svg
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={MOBILE_ORBIT_R}
                    fill="none"
                    stroke="#82C341"
                    strokeWidth="0.55"
                    strokeDasharray="2.2 1.8"
                    className="animate-orbit-dash"
                  />
                  {GAUSHALA_ECOSYSTEM_NODES.map((node) => {
                    const rad = (node.angleDeg * Math.PI) / 180;
                    const x1 = 50 + MOBILE_CENTER_R * Math.cos(rad);
                    const y1 = 50 + MOBILE_CENTER_R * Math.sin(rad);
                    const x2 = 50 + MOBILE_ORBIT_R * Math.cos(rad);
                    const y2 = 50 + MOBILE_ORBIT_R * Math.sin(rad);
                    const active = selectedId === node.id;
                    return (
                      <line
                        key={`m-sp-${node.id}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={active ? '#153E1E' : node.accent === 'amber' ? '#C77D26' : '#4B8A2A'}
                        strokeWidth={active ? '0.75' : '0.35'}
                        strokeOpacity={active ? '1' : '0.68'}
                      />
                    );
                  })}
                </svg>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-square rounded-full bg-[#FCF8F0] border-2 border-[#C69C5D] shadow-md overflow-hidden z-10">
                  <img
                    src={GENERATED_ASSETS.gaushalaCenterEcosystem}
                    alt={lang === 'hi' ? 'आत्मनिर्भर गौशाला केंद्र' : 'Self-Reliant Gaushala Center'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-[1.12]"
                  />
                </div>

                {GAUSHALA_ECOSYSTEM_NODES.map((node) => {
                  const rad = (node.angleDeg * Math.PI) / 180;
                  const leftPct = 50 + MOBILE_ORBIT_R * Math.cos(rad);
                  const topPct = 50 + MOBILE_ORBIT_R * Math.sin(rad);
                  const active = selectedId === node.id;

                  return (
                    <button
                      key={`mob-eco-${node.id}`}
                      type="button"
                      onClick={() => setSelectedId(node.id)}
                      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus-visible:outline-none"
                      aria-label={`${node.titleHi[0]} ${node.titleHi[1]}`}
                      aria-pressed={active}
                    >
                      <div
                        className={`w-[44px] h-[44px] rounded-full bg-white border-2 overflow-hidden transition-transform ${
                          active
                            ? 'border-[#153E1E] ring-2 ring-[#82C341]/70 scale-110 shadow-md'
                            : 'border-[#DFCFAF] shadow-xs'
                        }`}
                      >
                        <img
                          src={GENERATED_ASSETS[node.assetKey]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover scale-[1.22]"
                        />
                      </div>
                      <span
                        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center leading-[1.05] px-1 py-0.5 rounded bg-[#FCF8F0]/90 text-[8px] font-bold text-[#153E1E] ${
                          node.mobileLabelPos === 'top' ? 'bottom-full mb-0.5' : 'top-full mt-0.5'
                        }`}
                      >
                        {lang === 'hi' ? node.shortHi[0] : node.shortEn[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p
              className={`text-sm sm:text-[15.5px] text-[#2B3B30] leading-[1.72] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'एक स्वस्थ देसी गाय रोज़ लगभग 8–10 किलो गोबर और 4–5 लीटर गोमूत्र देती है। चक्र के किसी भी हिस्से को छूकर देखें कि एक काम दूसरे काम की मदद कैसे करता है:'
                : 'One healthy cow produces roughly 8–10 kg of dung and 4–5 liters of urine every day. Tap any circle on the wheel to see how each part supports the next:'}
            </p>

            <div
              data-testid="ecosystem-active-spotlight"
              className="pt-5 border-t border-[#D6C7A8] space-y-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-white border border-[#DFCFAF] overflow-hidden shrink-0">
                  <img
                    src={GENERATED_ASSETS[activeNode.assetKey]}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-[1.2]"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wide text-[#5A7B3B]">
                    {lang === 'hi' ? 'अभी चुना हुआ हिस्सा' : 'Currently viewing'}
                  </p>
                  <h3
                    className={`text-lg sm:text-xl font-extrabold text-[#153E1E] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi'
                      ? `${activeNode.titleHi[0]} ${activeNode.titleHi[1]}`
                      : `${activeNode.titleEn[0]} ${activeNode.titleEn[1]}`}
                  </h3>
                </div>
              </div>
              <p
                className={`text-sm sm:text-[15px] text-[#2E3F33] leading-[1.72] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi' ? activeNode.summaryHi : activeNode.summaryEn}
              </p>
              <button
                type="button"
                onClick={() => onScrollTo(activeNode.targetSectionId)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B5A32] hover:underline cursor-pointer"
              >
                <span>{lang === 'hi' ? 'नीचे विस्तार से समझें' : 'Read step-by-step below'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* RIGHT (sm+): LARGE INTERACTIVE 8-NODE RADIAL ECOSYSTEM WHEEL */}
          <div className="hidden sm:block lg:col-span-7">
            <div className="relative w-full max-w-[600px] mx-auto aspect-[1.06/1]">
              <svg
                viewBox="0 0 100 100"
                className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={DESKTOP_ORBIT_R}
                  fill="none"
                  stroke="#82C341"
                  strokeWidth="0.48"
                  strokeDasharray="2.4 1.6"
                  className="animate-orbit-dash"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={DESKTOP_CENTER_R + 2.4}
                  fill="none"
                  stroke="#C98838"
                  strokeWidth="0.3"
                  strokeOpacity="0.55"
                />

                {GAUSHALA_ECOSYSTEM_NODES.map((node, idx) => {
                  const rad = (node.angleDeg * Math.PI) / 180;
                  const xEdge = 50 + DESKTOP_CENTER_R * Math.cos(rad);
                  const yEdge = 50 + DESKTOP_CENTER_R * Math.sin(rad);
                  const xOrbit = 50 + DESKTOP_ORBIT_R * Math.cos(rad);
                  const yOrbit = 50 + DESKTOP_ORBIT_R * Math.sin(rad);
                  const midRad = ((node.angleDeg + 22.5) * Math.PI) / 180;
                  const xMid = 50 + DESKTOP_ORBIT_R * Math.cos(midRad);
                  const yMid = 50 + DESKTOP_ORBIT_R * Math.sin(midRad);
                  const isActive = selectedId === node.id;
                  const strokeColor = isActive
                    ? '#153E1E'
                    : node.accent === 'amber'
                      ? '#C77D26'
                      : '#3C7A2E';

                  return (
                    <g key={`d-sp-${node.id}`}>
                      <line
                        x1={xEdge}
                        y1={yEdge}
                        x2={xOrbit}
                        y2={yOrbit}
                        stroke={strokeColor}
                        strokeWidth={isActive ? '0.68' : '0.32'}
                        strokeOpacity={isActive ? '1' : '0.72'}
                      />
                      <circle cx={xEdge} cy={yEdge} r={isActive ? '1.05' : '0.7'} fill={strokeColor} />
                      <circle cx={xMid} cy={yMid} r="0.72" fill={idx % 2 === 0 ? '#6EB83A' : '#C77D26'} />
                    </g>
                  );
                })}
              </svg>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42%] aspect-square rounded-full bg-[#FCF8F0] border-[2.5px] border-[#C69C5D] shadow-[0_18px_42px_-12px_rgba(95,68,28,0.3)] overflow-hidden z-10">
                <img
                  src={GENERATED_ASSETS.gaushalaCenterEcosystem}
                  alt={
                    lang === 'hi'
                      ? 'एकीकृत आत्मनिर्भर गौशाला केंद्र का जलरंग चित्र'
                      : 'Watercolor circular illustration of an integrated self-reliant village Gaushala'
                  }
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-[1.12]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#153E1E]/85 via-[#153E1E]/45 to-transparent pt-5 pb-2.5 px-2 text-center">
                  <span
                    className={`block text-[11px] lg:text-xs font-extrabold text-[#FCF8F0] tracking-wide ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? 'आत्मनिर्भर गौशाला केंद्र' : 'Self-Reliant Gaushala Hub'}
                  </span>
                </div>
              </div>

              {GAUSHALA_ECOSYSTEM_NODES.map((node) => {
                const rad = (node.angleDeg * Math.PI) / 180;
                const leftPct = 50 + DESKTOP_ORBIT_R * Math.cos(rad);
                const topPct = 50 + DESKTOP_ORBIT_R * Math.sin(rad);
                const isActive = selectedId === node.id;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedId(node.id)}
                    onMouseEnter={() => setSelectedId(node.id)}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    aria-label={
                      lang === 'hi'
                        ? `${node.titleHi[0]} ${node.titleHi[1]}`
                        : `${node.titleEn[0]} ${node.titleEn[1]}`
                    }
                    aria-pressed={isActive}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus-visible:outline-none"
                  >
                    <div
                      className={`w-[70px] h-[70px] md:w-[78px] md:h-[78px] rounded-full bg-white border-2 overflow-hidden transition-all duration-200 shadow-[0_8px_20px_-8px_rgba(95,68,28,0.3)] ${
                        isActive
                          ? 'border-[#153E1E] ring-3 ring-[#82C341]/60 scale-110'
                          : 'border-[#DFCFAF] group-hover:scale-105'
                      }`}
                    >
                      <img
                        src={GENERATED_ASSETS[node.assetKey]}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover scale-[1.22]"
                      />
                    </div>

                    <div
                      className={`pointer-events-none absolute whitespace-nowrap leading-[1.18] ${
                        node.labelAlign === 'top'
                          ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5 text-center'
                          : node.labelAlign === 'bottom'
                            ? 'top-full left-1/2 -translate-x-1/2 mt-1.5 text-center'
                            : node.labelAlign === 'right'
                              ? 'left-full top-1/2 -translate-y-1/2 ml-2.5 text-left'
                              : 'right-full top-1/2 -translate-y-1/2 mr-2.5 text-right'
                      }`}
                    >
                      <span
                        className={`block text-[11px] lg:text-[12px] font-bold transition-colors ${
                          isActive ? 'text-[#153E1E]' : 'text-[#243428]'
                        } ${lang === 'hi' ? 'font-hindi' : ''}`}
                      >
                        {lang === 'hi' ? node.titleHi[0] : node.titleEn[0]}
                      </span>
                      <span
                        className={`block text-[10.5px] lg:text-[11.5px] font-semibold transition-colors ${
                          isActive ? 'text-[#2F6D26]' : 'text-[#4D5E52]'
                        } ${lang === 'hi' ? 'font-hindi' : ''}`}
                      >
                        {lang === 'hi' ? node.titleHi[1] : node.titleEn[1]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   4. MINIMALIST STEP-BY-STEP ROADMAP — 2-COL GRID ON MOBILE, 5-COL ON DESKTOP!
   ============================================================================ */
export function GaushalaStepByStepRoadmap({
  steps,
  lang,
}: {
  steps: {
    step: string;
    assetKey: AssetKey;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
  }[];
  lang: Language;
}) {
  return (
    <div className="relative">
      <div
        className="hidden lg:block absolute top-11 left-[10%] right-[10%] h-px bg-[#D7CEB8]"
        aria-hidden="true"
      />
      <ol className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 relative z-10">
        {steps.map((st, idx) => (
          <li
            key={st.step}
            className={`flex flex-col items-center text-center space-y-2.5 sm:space-y-3.5 ${
              idx === steps.length - 1 ? 'col-span-2 lg:col-span-1 max-w-xs mx-auto lg:max-w-none' : ''
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#DFCFAF] bg-[#FCF8F0] shadow-[0_8px_20px_-14px_rgba(21,62,30,0.28)]">
                  <img
                    src={GENERATED_ASSETS[st.assetKey]}
                    alt={lang === 'hi' ? st.titleHi : st.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-[1.12]"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#153E1E] text-white text-[11px] sm:text-xs font-extrabold flex items-center justify-center tabular-nums ring-2 ring-white">
                  {idx + 1}
                </span>
              </div>
              <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.12em] text-[#5A7B3B]">
                {lang === 'hi' ? `कदम ${idx + 1}` : `Step ${idx + 1}`}
              </span>
            </div>

            <div className="space-y-1">
              <h4
                className={`text-[13.5px] sm:text-[15px] font-extrabold text-[#153E1E] leading-snug ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi' ? st.titleHi : st.titleEn}
              </h4>
              <p
                className={`text-[11.5px] sm:text-[13px] text-[#3B4E41] leading-[1.62] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi' ? st.descHi : st.descEn}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ============================================================================
   5. ANNOTATED LIVING DIORAMA STAGE — ART + TEXT FUSED AS ONE!!
      Desktop: Huge luminous watercolor centered in an organic stage with
               borderless floating callouts + exact pointer lines onto the art!
      Mobile:  Full-width artwork with clickable numbered pins ON the art
               + tight 2-column visual grid right beneath!
   ============================================================================ */
export interface AnnotatedLandmark {
  id: string;
  badge: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  /** Exact target spot on the 16:9 image in % (0..100) */
  imgPinPct: [number, number];
  /** Desktop SVG stage coordinates (1000x560 canvas) for pointer line & callout placement */
  desktopBoxStyle: React.CSSProperties;
  desktopLineFrom: [number, number];
  desktopDot: [number, number];
  accent?: string;
}

export function GaushalaAnnotatedDioramaStage({
  assetKey,
  altHi,
  altEn,
  landmarks,
  lang,
  tone = 'parchment',
  stageClassName = 'top-[12%] left-[18%] right-[18%] bottom-[10%]',
}: {
  assetKey: AssetKey;
  altHi: string;
  altEn: string;
  landmarks: AnnotatedLandmark[];
  lang: Language;
  tone?: 'parchment' | 'white' | 'sage';
  stageClassName?: string;
}) {
  const [activeId, setActiveId] = useState<string>(landmarks[0]?.id ?? '');
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  const auraBg =
    tone === 'sage'
      ? 'radial-gradient(ellipse at center, rgba(226,243,204,0.55) 0%, rgba(250,248,243,0) 74%)'
      : tone === 'white'
        ? 'radial-gradient(ellipse at center, rgba(235,244,218,0.42) 0%, rgba(255,255,255,0) 74%)'
        : 'radial-gradient(ellipse at center, rgba(239,227,196,0.45) 0%, rgba(250,248,243,0) 74%)';

  return (
    <div className="relative">
      {/* DESKTOP (lg+): ONE INTEGRATED ARTISTIC CANVAS WITH DIRECT POINTER CALLOUTS */}
      <div className="hidden lg:block relative w-full max-w-[1220px] mx-auto h-[540px] xl:h-[580px] select-none">
        {/* Soft Atmospheric Botanical Glow Fusing Art Into Page */}
        <div
          className="pointer-events-none absolute inset-4 rounded-full"
          style={{ background: auraBg }}
          aria-hidden="true"
        />

        {/* Commanding Watercolor Artwork (no z-index stacking isolation so mix-blend-multiply fuses into parchment) */}
        <div className={`absolute ${stageClassName} flex items-center justify-center`}>
          <img
            src={GENERATED_ASSETS[assetKey]}
            alt={lang === 'hi' ? altHi : altEn}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-full object-contain mix-blend-multiply brightness-[1.06] contrast-[1.06]"
          />
        </div>

        {/* Direct Pointer Lines & Glowing Target Rings on Exact Landmarks */}
        <svg
          viewBox="0 0 1000 560"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full z-20"
        >
          {landmarks.map((lm) => {
            const focused = activeId === lm.id;
            const color = lm.accent ?? '#236B30';
            return (
              <g key={`ptr-${lm.id}`}>
                <line
                  x1={lm.desktopLineFrom[0]}
                  y1={lm.desktopLineFrom[1]}
                  x2={lm.desktopDot[0]}
                  y2={lm.desktopDot[1]}
                  stroke={focused ? color : '#6DB637'}
                  strokeWidth={focused ? '2.6' : '1.7'}
                  strokeDasharray={focused ? undefined : '5 4'}
                />
                <circle
                  cx={lm.desktopDot[0]}
                  cy={lm.desktopDot[1]}
                  r={focused ? '11' : '8'}
                  fill={focused ? color : '#82C341'}
                  fillOpacity="0.28"
                />
                <circle
                  cx={lm.desktopDot[0]}
                  cy={lm.desktopDot[1]}
                  r="4.8"
                  fill="#FFFFFF"
                  stroke={focused ? color : '#1E6B2E'}
                  strokeWidth="2.3"
                />
              </g>
            );
          })}
        </svg>

        {/* Borderless Luminous Callout Explanations Around the Painting */}
        {landmarks.map((lm) => {
          const focused = activeId === lm.id;
          return (
            <button
              key={lm.id}
              type="button"
              style={lm.desktopBoxStyle}
              onMouseEnter={() => setActiveId(lm.id)}
              onFocus={() => setActiveId(lm.id)}
              onClick={() => setActiveId(lm.id)}
              className={`absolute z-30 text-left rounded-[22px] px-4 py-3 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6D26] ${
                focused
                  ? 'bg-white/97 shadow-[0_14px_32px_-10px_rgba(21,62,30,0.28)] ring-2 ring-[#7DC142]/80 -translate-y-0.5'
                  : 'bg-white/88 backdrop-blur-sm shadow-[0_8px_22px_-12px_rgba(21,62,30,0.16)] hover:bg-white/96'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="w-6 h-6 rounded-full text-white text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums mt-0.5"
                  style={{ backgroundColor: focused ? (lm.accent ?? '#153E1E') : '#236B30' }}
                >
                  {lm.badge}
                </span>
                <div className="min-w-0 space-y-0.5">
                  <h4
                    className={`text-[13.5px] font-extrabold text-[#153E1E] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? lm.titleHi : lm.titleEn}
                  </h4>
                  <p
                    className={`text-[11.5px] text-[#3A4D40] leading-[1.48] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? lm.descHi : lm.descEn}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MOBILE / TABLET (< lg): FULL-WIDTH ART WITH TAPPABLE PINS + TIGHT 2-COL GRID! */}
      <div className="lg:hidden space-y-4">
        <div className="relative w-full overflow-hidden rounded-2xl">
          <img
            src={GENERATED_ASSETS[assetKey]}
            alt={lang === 'hi' ? altHi : altEn}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="w-full h-auto object-contain mix-blend-multiply brightness-[1.04] contrast-[1.06]"
          />
          {landmarks.map((lm) => {
            const focused = activeId === lm.id;
            return (
              <button
                key={`mpin-${lm.id}`}
                type="button"
                onClick={() => setActiveId(lm.id)}
                style={{ left: `${lm.imgPinPct[0]}%`, top: `${lm.imgPinPct[1]}%` }}
                aria-label={lang === 'hi' ? lm.titleHi : lm.titleEn}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[11px] font-extrabold flex items-center justify-center transition-transform cursor-pointer ring-2 ring-white shadow-md ${
                  focused
                    ? 'bg-[#153E1E] text-white scale-120 z-20'
                    : 'bg-[#2F7D32]/92 text-white hover:scale-110 z-10'
                }`}
              >
                {lm.badge}
              </button>
            );
          })}
        </div>

        {/* Tight 2-Column Visual Grid Directly Beneath the Artwork */}
        <div className="grid grid-cols-2 gap-3">
          {landmarks.map((lm, idx) => {
            const focused = activeId === lm.id;
            const isOddLast = landmarks.length % 2 === 1 && idx === landmarks.length - 1;
            return (
              <button
                key={`mcard-${lm.id}`}
                type="button"
                onClick={() => setActiveId(lm.id)}
                className={`text-left rounded-2xl p-3 transition-all cursor-pointer ${
                  isOddLast ? 'col-span-2' : ''
                } ${
                  focused
                    ? 'bg-white shadow-[0_8px_22px_-10px_rgba(21,62,30,0.24)] ring-1.5 ring-[#4F9A32]'
                    : 'bg-white/80 shadow-[0_4px_14px_-10px_rgba(21,62,30,0.16)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#153E1E] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                    {lm.badge}
                  </span>
                  <h4
                    className={`text-[12.5px] font-extrabold text-[#153E1E] leading-tight ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? lm.titleHi : lm.titleEn}
                  </h4>
                </div>
                <p
                  className={`text-[11.5px] text-[#3B4E41] leading-[1.52] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? lm.descHi : lm.descEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   6. LIVING SOIL ANATOMY WITH DIRECT LAYER POINTERS + FUSED SLICED ART GRIDS
      - Soil Cross-Section: Real curved pointer lines connecting layers to text!
      - 4 Natural Inputs: Each individual clay pot/jar cropped directly above its text (2×2 mobile!)
      - 5 Spare Land Uses: Each individual farm scene cropped directly above its text (2-col mobile!)
   ============================================================================ */
const SOIL_LAYER_PINS: [number, number][] = [
  [54, 34], // 1. Straw mulch layer on top
  [52, 50], // 2. Root water/air Whapasa zone
  [65, 67], // 3. Golden friendly microbe clusters
  [44, 75], // 4. Earthworms loosening deep soil
];

const INPUT_SLICE_X = ['2.5%', '34.5%', '69.5%', '97.5%'];
const LAND_SLICE_X = ['1%', '27%', '50%', '75%', '99%'];

export function GaushalaLivingSoilShowcase({ lang }: { lang: Language }) {
  const [activeSoilIdx, setActiveSoilIdx] = useState<number>(0);
  const [soilFailed, setSoilFailed] = useState(false);

  const principleIcons = [Sun, Droplets, Sparkles, Sprout];

  return (
    <div className="space-y-16">
      {/* PART A: LIVING SOIL CROSS-SECTION WITH DIRECT VISUAL LAYER POINTERS */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center">
          {/* Soil Artwork with Glowing Numbered Layer Landmarks */}
          <div className="lg:col-span-6 relative">
            {!soilFailed && (
              <div className="relative mx-auto max-w-[600px]">
                <img
                  src={GENERATED_ASSETS.gaushalaSoilCrossSection}
                  alt={
                    lang === 'hi'
                      ? 'खेत की जीवित मिट्टी का चित्र: ऊपर हरी फसल, सूखी घास की परत, नीचे गहरी जड़ें, नमी, केंचुए और अच्छे कीटाणु'
                      : 'Botanical watercolor cross-section of living farm soil showing crops, straw mulch, deep roots, moisture, earthworms, and helpful microbes'
                  }
                  referrerPolicy="no-referrer"
                  onError={() => setSoilFailed(true)}
                  className="w-full h-auto object-contain mix-blend-multiply brightness-[1.07] contrast-[1.08] select-none"
                />

                {/* Interactive Numbered Layer Pins Right ON the Soil Cross-Section */}
                {GAUSHALA_SOIL_PRINCIPLES.map((item, idx) => {
                  const [px, py] = SOIL_LAYER_PINS[idx] ?? [50, 50];
                  const focused = activeSoilIdx === idx;
                  return (
                    <button
                      key={`soil-pin-${item.code}`}
                      type="button"
                      onClick={() => setActiveSoilIdx(idx)}
                      onMouseEnter={() => setActiveSoilIdx(idx)}
                      style={{
                        left: `${px}%`,
                        top: `${py}%`,
                        backgroundColor: focused ? item.accent : '#153E1E',
                      }}
                      aria-label={lang === 'hi' ? item.titleHi : item.titleEn}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-white text-xs font-extrabold flex items-center justify-center ring-3 ring-white shadow-md transition-transform cursor-pointer ${
                        focused ? 'scale-125 z-20' : 'scale-100 opacity-90 hover:scale-110 z-10'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Connecting Desktop Pointer Lines (Visual Bridge Fusing Soil Layers → Explanations) */}
          <div className="hidden lg:block lg:col-span-1 h-[360px] relative" aria-hidden="true">
            <svg viewBox="0 0 80 360" fill="none" className="w-full h-full overflow-visible">
              {[
                { y1: 112, y2: 46, color: '#4B8A2A' },
                { y1: 174, y2: 136, color: '#2B7A78' },
                { y1: 238, y2: 226, color: '#C77D26' },
                { y1: 280, y2: 316, color: '#7A4F2B' },
              ].map((ln, idx) => {
                const focused = activeSoilIdx === idx;
                return (
                  <g key={`soil-bridge-${idx}`}>
                    <path
                      d={`M -16 ${ln.y1} C 24 ${ln.y1}, 48 ${ln.y2}, 86 ${ln.y2}`}
                      stroke={focused ? ln.color : '#B8C4AE'}
                      strokeWidth={focused ? '2.4' : '1.4'}
                      strokeDasharray={focused ? undefined : '4 3'}
                    />
                    <circle
                      cx="84"
                      cy={ln.y2}
                      r={focused ? '4.5' : '3'}
                      fill={focused ? ln.color : '#8AA37C'}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 4 Soil Principle Explanations: 2×2 Grid on Mobile, Connected 4 Rows on Desktop */}
          <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-2.5">
            {GAUSHALA_SOIL_PRINCIPLES.map((item, idx) => {
              const Icon = principleIcons[idx] ?? Sprout;
              const focused = activeSoilIdx === idx;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setActiveSoilIdx(idx)}
                  onMouseEnter={() => setActiveSoilIdx(idx)}
                  className={`text-left rounded-2xl p-3 sm:p-3.5 transition-all cursor-pointer flex flex-col lg:flex-row items-start gap-2.5 lg:gap-3.5 ${
                    focused
                      ? 'bg-white shadow-[0_10px_26px_-14px_rgba(21,62,30,0.22)] ring-1.5 ring-[#7DC142]/70'
                      : 'bg-white/65 hover:bg-white/95'
                  }`}
                >
                  <div className="flex items-center gap-2 lg:mt-0.5 shrink-0">
                    <span
                      className="w-6 h-6 rounded-full text-white text-[11px] font-extrabold flex items-center justify-center tabular-nums"
                      style={{ backgroundColor: item.accent }}
                    >
                      {idx + 1}
                    </span>
                    <Icon
                      className="w-4 h-4 hidden sm:block"
                      style={{ color: item.accent }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3
                      className={`text-[13px] sm:text-[15px] font-extrabold text-[#153E1E] leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? item.titleHi : item.titleEn}
                    </h3>
                    <p
                      className={`text-[11.5px] sm:text-[13px] text-[#35463A] leading-[1.6] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? item.descHi : item.descEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PART B: 4 COW-BASED FARM INPUTS — EACH VESSEL FUSED DIRECTLY WITH ITS OWN EXPLANATION! */}
      <div className="space-y-6 pt-10 border-t border-[#DDD4BE]">
        <div className="max-w-2xl space-y-1.5">
          <p className="text-xs font-bold tracking-[0.14em] text-[#2F6D26]">
            {lang === 'hi'
              ? 'गौशाला में बनने वाली 4 आसान खादें'
              : '4 SIMPLE FARM INPUTS MADE AT THE GAUSHALA'}
          </p>
          <h3
            className={`text-xl sm:text-2xl font-extrabold text-[#153E1E] ${
              lang === 'hi' ? 'font-hindi' : 'font-editorial'
            }`}
          >
            {lang === 'hi'
              ? 'गौशाला से सीधे खेत तक — किस खाद का क्या काम है?'
              : 'Straight From Gaushala to Field — What Each One Does'}
          </h3>
        </div>

        {/* 2×2 Mobile / 4-Col Desktop — Individual Cropped Watercolor Vessel Directly Above Text */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GAUSHALA_NATURAL_INPUTS.map((inp, idx) => (
            <div
              key={inp.id}
              className="group flex flex-col items-center text-center sm:items-start sm:text-left space-y-2.5 pt-2"
            >
              {/* Individual Vessel Sliced Seamlessly From gaushalaNaturalInputsSet */}
              <div className="w-full aspect-[4/3] max-w-[210px] sm:max-w-none overflow-hidden rounded-2xl bg-[#FAF8F1] flex items-center justify-center relative">
                <div
                  role="img"
                  aria-label={lang === 'hi' ? inp.titleHi : inp.titleEn}
                  className="w-full h-full mix-blend-multiply brightness-[1.05] contrast-[1.06] transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${GENERATED_ASSETS.gaushalaNaturalInputsSet})`,
                    backgroundSize: '420% auto',
                    backgroundPosition: `${INPUT_SLICE_X[idx] ?? '50%'} 52%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#153E1E] text-white text-[10.5px] font-extrabold flex items-center justify-center tabular-nums">
                  {idx + 1}
                </span>
              </div>

              <div className="space-y-1 w-full">
                <p className="text-[10.5px] sm:text-[11px] font-bold text-[#8E531A]">
                  {lang === 'hi' ? inp.tagHi : inp.tagEn}
                </p>
                <h4
                  className={`text-[14.5px] sm:text-base font-extrabold text-[#153E1E] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? inp.titleHi : inp.titleEn}
                </h4>
                <p
                  className={`text-[11.5px] sm:text-[13px] text-[#35463A] leading-[1.62] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? inp.descHi : inp.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PART C: 5 SPARE LAND USES — EACH INDIVIDUAL SCENE FUSED DIRECTLY WITH ITS OWN EXPLANATION! */}
      <div className="space-y-6 pt-10 border-t border-[#DDD4BE]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-bold tracking-[0.14em] text-[#2F6D26]">
              {lang === 'hi'
                ? 'गौशाला की खाली ज़मीन का सही इस्तेमाल'
                : 'PUTTING SPARE GAUSHALA LAND TO WORK'}
            </p>
            <h3
              className={`text-xl sm:text-2xl font-extrabold text-[#153E1E] ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi'
                ? 'अगर गौशाला के पास थोड़ी खाली ज़मीन हो, तो ये 5 काम करें'
                : '5 Practical Things to Grow on Spare Gaushala Land'}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A7B3B]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>
              {lang === 'hi' ? 'हरित राजस्थान नर्सरी से सीधा जुड़ाव' : 'Connects with Harit Rajasthan'}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {GAUSHALA_LAND_USES.map((lu, idx) => (
            <div
              key={lu.no}
              className={`group flex flex-col space-y-2.5 ${
                idx === 4 ? 'col-span-2 lg:col-span-1 max-w-xs mx-auto lg:max-w-none w-full' : ''
              }`}
            >
              <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl bg-[#F7F9F2] relative">
                <div
                  role="img"
                  aria-label={lang === 'hi' ? lu.titleHi : lu.titleEn}
                  className="w-full h-full mix-blend-multiply brightness-[1.03] contrast-[1.05] transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${GENERATED_ASSETS.gaushalaLandFiveStrip})`,
                    backgroundSize: '485% auto',
                    backgroundPosition: `${LAND_SLICE_X[idx] ?? '50%'} 52%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#153E1E] text-white text-[10px] font-extrabold tabular-nums">
                  {lu.no}
                </span>
              </div>

              <div className="space-y-1">
                <h4
                  className={`text-[13.5px] sm:text-[14.5px] font-extrabold text-[#153E1E] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? lu.titleHi : lu.titleEn}
                </h4>
                <p
                  className={`text-[11.5px] sm:text-[12.5px] text-[#3B4E41] leading-[1.6] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? lu.descHi : lu.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   7. FUSED 3-STAGE LIVELIHOOD SLICED ART STRIP (JOBS & VILLAGE MARKET)
      Slices gaushalaLivelihoodThreeStrip directly into 3 visual connected steps
   ============================================================================ */
const LIVELIHOOD_SLICE_X = ['0%', '50%', '100%'];

export function GaushalaSlicedLivelihoodStrip({ lang }: { lang: Language }) {
  const steps = [
    {
      no: '1',
      titleHi: 'साफ गोबर व देसी सामग्री की तैयारी',
      titleEn: 'Preparing Clean Raw Dung & Herbs',
      descHi: 'साफ गोबर, नीम पत्तियाँ और मिट्टी तैयार करके गाँव की महिला समूह को देना।',
      descEn: 'Clean dung, neem leaves, and natural clay prepared for village women groups.',
    },
    {
      no: '2',
      titleHi: 'महिला समूह (SHG) का प्रशिक्षण व हुनर',
      titleEn: 'Women SHG Training & Craftwork',
      descHi: 'गाँव की बहनें मिलकर गमले, धूपबत्ती, दीये और खाद के पैकेट तैयार करती हैं।',
      descEn: 'Local village women train together to craft eco-pots, dhoop, diyas & compost packs.',
    },
    {
      no: '3',
      titleHi: 'गौशाला स्टॉल और सीधा स्थानीय बाज़ार',
      titleEn: 'Gaushala Stall & Direct Village Sales',
      descHi: 'साफ पैकिंग में अपने ही गाँव, मंदिर और कस्बे के मेले में सीधी बिक्री।',
      descEn: 'Neatly packed items sold directly at local stalls, temples, and village fairs.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7">
      {steps.map((st, idx) => (
        <div key={st.no} className="group relative flex flex-col space-y-3">
          <div className="w-full aspect-[16/11] overflow-hidden rounded-2xl bg-[#FAF8F2] relative">
            <div
              role="img"
              aria-label={lang === 'hi' ? st.titleHi : st.titleEn}
              className="w-full h-full mix-blend-multiply brightness-[1.03] contrast-[1.05] transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url(${GENERATED_ASSETS.gaushalaLivelihoodThreeStrip})`,
                backgroundSize: '300% auto',
                backgroundPosition: `${LIVELIHOOD_SLICE_X[idx]} 50%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#153E1E] text-white text-[11px] font-extrabold">
              {lang === 'hi' ? `कदम ${st.no}` : `Step ${st.no}`}
            </span>
          </div>

          <div className="space-y-1 px-0.5">
            <h4
              className={`text-[15px] sm:text-base font-extrabold text-[#153E1E] leading-snug ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? st.titleHi : st.titleEn}
            </h4>
            <p
              className={`text-[12.5px] sm:text-[13.5px] text-[#3B4E41] leading-[1.65] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? st.descHi : st.descEn}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   8. VISUAL 6-CATEGORY ARTISAN SHOWCASE FOR ALL 48 COW-DUNG PRODUCTS
      Zero bland text dumps! 2×3 visual showcase (mobile 2-col, desktop 3-col)
      with watercolor craft medallions, story tags, flagship items & expand!
   ============================================================================ */
const PRODUCT_CAT_VISUALS: Record<
  string,
  { assetKey: AssetKey; tint: string; accent: string }
> = {
  'CAT-01': { assetKey: 'vignetteGaushalaCompost', tint: '#F2F8EA', accent: '#236B30' },
  'CAT-02': { assetKey: 'medallionHarit', tint: '#EEF7EC', accent: '#2E7D32' },
  'CAT-03': { assetKey: 'vignetteGaushalaEcoProducts', tint: '#FDF6EB', accent: '#B45D18' },
  'CAT-04': { assetKey: 'vignetteBiogasDome', tint: '#F4F7ED', accent: '#3F6E24' },
  'CAT-05': { assetKey: 'medallionHeritage', tint: '#FBF5EC', accent: '#8E531A' },
  'CAT-06': { assetKey: 'medallionWomen', tint: '#F6F3FA', accent: '#5A4B81' },
};

export function GaushalaProductsArtisanShowcase({ lang }: { lang: Language }) {
  const [expandedCode, setExpandedCode] = useState<string | null>('CAT-01');
  const [filterCode, setFilterCode] = useState<string>('ALL');

  const categories =
    filterCode === 'ALL'
      ? GAUSHALA_48_PRODUCTS
      : GAUSHALA_48_PRODUCTS.filter((c) => c.code === filterCode);

  return (
    <div className="space-y-7">
      {/* Quick Category Filter Pills — Clean Single-Row Horizontal Scroll on Mobile */}
      <div
        className="flex items-center gap-2 overflow-x-auto sm:flex-wrap pb-1 -mx-1 px-1"
        role="tablist"
        aria-label={lang === 'hi' ? 'गोबर उत्पाद श्रेणियाँ' : 'Cow dung product categories'}
      >
        <button
          type="button"
          role="tab"
          aria-selected={filterCode === 'ALL'}
          onClick={() => setFilterCode('ALL')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            filterCode === 'ALL'
              ? 'bg-[#153E1E] text-white'
              : 'bg-[#F5F2EA] text-[#283B2E] hover:bg-[#EAF4DC]'
          }`}
        >
          {lang === 'hi' ? 'सभी 6 समूह (48 उत्पाद)' : 'All 6 Groups (48 Items)'}
        </button>
        {GAUSHALA_48_PRODUCTS.map((cat) => (
          <button
            key={cat.code}
            type="button"
            role="tab"
            aria-selected={filterCode === cat.code}
            onClick={() => {
              setFilterCode(cat.code);
              setExpandedCode(cat.code);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              filterCode === cat.code
                ? 'bg-[#153E1E] text-white'
                : 'bg-[#F5F2EA] text-[#283B2E] hover:bg-[#EAF4DC]'
            }`}
          >
            {lang === 'hi' ? cat.shortHi : cat.shortEn}
          </button>
        ))}
      </div>

      {/* Breathable Full-Width Cards on Mobile, 2-Col Tablet, 3-Col Desktop */}
      <div
        className={`grid gap-4 sm:gap-6 ${
          filterCode === 'ALL'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 max-w-4xl'
        }`}
      >
        {categories.map((cat) => {
          const vis = PRODUCT_CAT_VISUALS[cat.code] ?? {
            assetKey: 'vignetteGaushalaEcoProducts',
            tint: '#FAF8F3',
            accent: '#153E1E',
          };
          const isExpanded = filterCode !== 'ALL' || expandedCode === cat.code;
          const visibleItems = isExpanded ? cat.items : cat.items.slice(0, 4);

          return (
            <div
              key={cat.code}
              className="rounded-[22px] p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all"
              style={{ backgroundColor: vis.tint }}
            >
              <div className="space-y-3">
                {/* Illustrated Medallion Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white shadow-xs ring-2 ring-white shrink-0">
                    <img
                      src={GENERATED_ASSETS[vis.assetKey]}
                      alt={lang === 'hi' ? cat.shortHi : cat.shortEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className="text-[11px] font-extrabold tracking-wide"
                      style={{ color: vis.accent }}
                    >
                      {cat.items.length} {lang === 'hi' ? 'संभावित उत्पाद' : 'Potential Items'}
                    </span>
                    <h3
                      className={`text-[15.5px] sm:text-base font-extrabold text-[#153E1E] leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? cat.shortHi : cat.shortEn}
                    </h3>
                  </div>
                </div>

                {/* Why Villages Pick This Group */}
                <p
                  className={`text-[12.5px] sm:text-[13px] text-[#35463A] leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? cat.highlightHi : cat.highlightEn}
                </p>

                {/* Comfortable Readable Numbered Product List */}
                <ol
                  className={`grid gap-2 pt-2.5 border-t border-black/8 ${
                    filterCode !== 'ALL' ? 'grid-cols-1 sm:grid-cols-2 gap-x-6' : 'grid-cols-1'
                  }`}
                >
                  {visibleItems.map((item) => (
                    <li
                      key={item.no}
                      className="flex items-baseline gap-2.5 text-[13px] text-[#1E3224]"
                    >
                      <span
                        className="text-[11px] font-extrabold tabular-nums shrink-0"
                        style={{ color: vis.accent }}
                      >
                        {String(item.no).padStart(2, '0')}.
                      </span>
                      <span className={lang === 'hi' ? 'font-hindi leading-snug' : 'leading-snug'}>
                        {lang === 'hi' ? item.hi : item.en}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Smooth Expand / Collapse Toggle When Viewing All 6 Groups */}
              {filterCode === 'ALL' && cat.items.length > 4 && (
                <button
                  type="button"
                  onClick={() => setExpandedCode(isExpanded ? null : cat.code)}
                  className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-xs font-extrabold cursor-pointer self-start pt-1 hover:underline"
                  style={{ color: vis.accent }}
                >
                  <span>
                    {isExpanded
                      ? lang === 'hi'
                        ? 'सूची समेटें'
                        : 'Show fewer'
                      : lang === 'hi'
                        ? `सभी ${cat.items.length} उत्पाद देखें`
                        : `See all ${cat.items.length} items`}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   9. HOW GOVEDA HELPS — 2×2 MOBILE / 4-COL DESKTOP ILLUSTRATED MEDALLIONS
   ============================================================================ */
const WHY_JOIN_ART_ASSETS: AssetKey[] = [
  'vignetteGaushalaCompost',
  'vignetteGaushalaCircularHub',
  'medallionWomen',
  'vignetteGaushalaFodderVet',
];

export function GaushalaWhyJoinIllustrated({ lang }: { lang: Language }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7">
      {GAUSHALA_WHY_JOIN_BENEFITS.map((item, idx) => {
        const artKey = WHY_JOIN_ART_ASSETS[idx] ?? 'medallionGaushala';
        return (
          <div key={item.num} className="pt-4 border-t border-[#D6C7A8] space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#DFCFAF] bg-white shrink-0">
                <img
                  src={GENERATED_ASSETS[artKey]}
                  alt={lang === 'hi' ? item.titleHi : item.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10.5px] sm:text-xs font-extrabold tracking-[0.12em] text-[#5A7B3B] tabular-nums">
                {lang === 'hi' ? `मदद ${item.num}` : `Help ${item.num}`}
              </span>
            </div>
            <h4
              className={`text-[13.5px] sm:text-[15.5px] font-extrabold text-[#153E1E] leading-snug ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? item.titleHi : item.titleEn}
            </h4>
            <p
              className={`text-[11.5px] sm:text-[13.5px] text-[#35463A] leading-[1.62] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? item.descHi : item.descEn}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
   10. MINIMALIST 10-ACTIVITY QUICK INDEX (2-COLUMN GRID ON MOBILE & DESKTOP)
   ============================================================================ */
const TEN_ACTIVITY_ASSETS: AssetKey[] = [
  'vignetteGaushalaCompost',
  'medallionOrganic',
  'vignetteBiogasDome',
  'medallionEnergy',
  'vignetteGaushalaDairyBilona',
  'medallionHarit',
  'vignetteGaushalaFodderVet',
  'medallionGaushala',
  'medallionSkills',
  'vignetteGaushalaEcoProducts',
];

const TEN_ACTIVITY_TARGETS: string[] = [
  'gs-manure',
  'gs-manure',
  'gs-biogas',
  'gs-biogas',
  'gs-dairy',
  'gs-manure',
  'gs-welfare',
  'gs-welfare',
  'gs-market',
  'gs-products',
];

export function GaushalaTenActivitiesShowcase({
  lang,
  onScrollTo,
}: {
  lang: Language;
  onScrollTo: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-x-10 sm:gap-y-2">
      {GAUSHALA_TEN_ACTIVITIES.map((act, idx) => {
        const artKey = TEN_ACTIVITY_ASSETS[idx] ?? 'medallionGaushala';
        const targetId = TEN_ACTIVITY_TARGETS[idx] ?? 'gs-circular';
        return (
          <button
            key={act.no}
            type="button"
            onClick={() => onScrollTo(targetId)}
            className="group w-full text-left py-3 px-2.5 sm:px-3 rounded-2xl bg-[#FAF8F3]/80 sm:bg-transparent sm:border-b sm:border-[#E4DCC9] sm:rounded-none hover:bg-[#F3F8EB] flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#DFCFAF] bg-white shrink-0 transition-transform duration-200 group-hover:scale-105">
              <img
                src={GENERATED_ASSETS[artKey]}
                alt={lang === 'hi' ? act.titleHi : act.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10.5px] font-extrabold text-[#8E531A] tabular-nums">
                  {act.no}
                </span>
                <h4
                  className={`text-[12.5px] sm:text-[14.5px] font-extrabold text-[#153E1E] group-hover:text-[#236B30] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? act.titleHi : act.titleEn}
                </h4>
              </div>
              <p
                className={`text-[11px] sm:text-[13px] text-[#3E5144] leading-snug sm:leading-relaxed ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi' ? act.detailHi : act.detailEn}
              </p>
            </div>
            <ArrowRight
              className="hidden sm:block w-4 h-4 text-[#5A7B3B] shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================================
   11. LUSH GREEN VILLAGE GAUSHALA PARTNER BANNER (WARM CONVERSATIONAL INVITE)
   ============================================================================ */
export function GaushalaPartnerMeadowBanner({
  lang,
  onScrollTo,
  onNavigate,
}: {
  lang: Language;
  onScrollTo: (id: string) => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="relative overflow-hidden bg-[#FCF8F0] border-t border-[#DFCFAF]/80">
      <div
        className="pointer-events-none hidden md:block absolute inset-0 z-0 select-none"
        aria-hidden="true"
      >
        <img
          src={GENERATED_ASSETS.gaushalaPartnerMeadowBanner}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right opacity-95"
        />
        <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-[#FCF8F0] via-[#FCF8F0]/95 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-4">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#2F6D26]">
              {lang === 'hi'
                ? 'मिलकर शुरुआत करें · PARTNER WITH GOVEDA'
                : 'START TOGETHER WITH GOVEDA'}
            </p>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold text-[#153E1E] leading-tight text-balance ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi'
                ? 'आइए, अपने गाँव की गौशाला को मिलकर आत्मनिर्भर बनाएँ'
                : 'Let Us Help Your Village Gaushala Stand on Its Own Feet'}
            </h2>
            <p
              className={`text-sm sm:text-[15px] text-[#2E3F33] leading-[1.7] max-w-xl ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'आप गौशाला चलाते हों, किसान हों, गाँव की महिला समूह से हों, पशु डॉक्टर हों या मदद करना चाहते हों — बस नीचे जुड़िए। हम साथ बैठकर आपकी जगह के हिसाब से सबसे आसान शुरुआत तय करेंगे।'
                : 'Whether you run a Gaushala, farm nearby, lead a women’s group, work as a vet, or want to support via CSR—reach out below. We will sit together and plan the simplest practical start for your village.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onScrollTo('gs-register')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#153E1E] text-white text-xs sm:text-sm font-bold hover:bg-[#1E562A] cursor-pointer shadow-sm"
              >
                <span>{lang === 'hi' ? 'अपनी गौशाला जोड़ें' : 'Register Your Gaushala'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/partnership')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#153E1E] border border-[#C69C5D] text-xs sm:text-sm font-bold hover:bg-[#FCF8F0] hover:border-[#2F6D26] cursor-pointer"
              >
                <span>{lang === 'hi' ? 'CSR व सहयोग के तरीके' : 'Ways to Support / CSR'}</span>
              </button>
            </div>
          </div>

          <div className="md:hidden -mx-4 sm:mx-0">
            <img
              src={GENERATED_ASSETS.gaushalaPartnerMeadowBanner}
              alt={
                lang === 'hi'
                  ? 'आत्मनिर्भर गौशाला एवं ग्रामीण साझेदारी का हरित जलरंग चित्र'
                  : 'Lush green village Gaushala and rural community partnership watercolor illustration'
              }
              referrerPolicy="no-referrer"
              className="w-full aspect-[16/9] object-cover object-right sm:rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
