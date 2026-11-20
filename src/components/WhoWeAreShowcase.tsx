import React, { useState } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import type { Language } from '../types/goveda';

interface WhoWeAreShowcaseProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

interface OrbitMissionNode {
  id: string;
  number: number;
  slug: string;
  angleDeg: number;
  assetKey: AssetKey;
  cropScaleClass: string;
  accent: 'amber' | 'forest';
  labelAlign: 'left' | 'right' | 'top' | 'bottom';
  mobileLabelPos: 'top' | 'bottom' | 'left' | 'right';
  title: {
    hi: [string, string];
    en: [string, string];
  };
  mobileShort: {
    hi: [string, string];
    en: [string, string];
  };
}

const ORBIT_MISSIONS: OrbitMissionNode[] = [
  {
    id: 'carbon',
    number: 1,
    slug: '/missions/carbon-credit',
    angleDeg: -108,
    assetKey: 'medallionCarbon',
    cropScaleClass: 'scale-[1.42]',
    accent: 'amber',
    labelAlign: 'left',
    mobileLabelPos: 'top',
    title: {
      hi: ['कार्बन क्रेडिट एवं', 'जलवायु कार्रवाई'],
      en: ['Climate &', 'Carbon Action'],
    },
    mobileShort: {
      hi: ['कार्बन व', 'जलवायु'],
      en: ['Climate &', 'Carbon'],
    },
  },
  {
    id: 'energy',
    number: 4,
    slug: '/missions/biogas-cbg',
    angleDeg: -72,
    assetKey: 'medallionEnergy',
    cropScaleClass: 'scale-[1.42]',
    accent: 'forest',
    labelAlign: 'right',
    mobileLabelPos: 'top',
    title: {
      hi: ['स्वच्छ ऊर्जा व', 'बायो-CNG / CBG'],
      en: ['Clean Energy &', 'Low-Carbon Solutions'],
    },
    mobileShort: {
      hi: ['स्वच्छ', 'ऊर्जा'],
      en: ['Clean', 'Energy'],
    },
  },
  {
    id: 'senior',
    number: 9,
    slug: '/missions/senior-citizen-care',
    angleDeg: -36,
    assetKey: 'medallionSenior',
    cropScaleClass: 'scale-[1.34]',
    accent: 'amber',
    labelAlign: 'right',
    mobileLabelPos: 'top',
    title: {
      hi: ['वरिष्ठजन देखभाल', '& मानसिक स्वास्थ्य'],
      en: ['Elderly Care &', 'Mental Wellbeing'],
    },
    mobileShort: {
      hi: ['वरिष्ठजन', 'स्वास्थ्य'],
      en: ['Elderly', 'Care'],
    },
  },
  {
    id: 'women',
    number: 8,
    slug: '/missions/rural-upliftment',
    angleDeg: 0,
    assetKey: 'medallionWomen',
    cropScaleClass: 'scale-[1.36]',
    accent: 'forest',
    labelAlign: 'right',
    mobileLabelPos: 'bottom',
    title: {
      hi: ['महिला सशक्तीकरण', 'एवं ग्राम उत्थान'],
      en: ['Women Empowerment', '& Rural Upliftment'],
    },
    mobileShort: {
      hi: ['महिला', 'उत्थान'],
      en: ['Women', 'Empower'],
    },
  },
  {
    id: 'heritage',
    number: 10,
    slug: '/missions/heritage-solar-water',
    angleDeg: 36,
    assetKey: 'medallionHeritage',
    cropScaleClass: 'scale-[1.45]',
    accent: 'amber',
    labelAlign: 'right',
    mobileLabelPos: 'bottom',
    title: {
      hi: ['सांस्कृतिक धरोहर,', 'सोलर व जल सुरक्षा'],
      en: ['Heritage, Solar &', 'Water Conservation'],
    },
    mobileShort: {
      hi: ['धरोहर व', 'जल'],
      en: ['Heritage', '& Water'],
    },
  },
  {
    id: 'clean-india',
    number: 6,
    slug: '/missions/clean-india-plastic-free',
    angleDeg: 72,
    assetKey: 'medallionCleanVillage',
    cropScaleClass: 'scale-[1.4]',
    accent: 'forest',
    labelAlign: 'bottom',
    mobileLabelPos: 'bottom',
    title: {
      hi: ['स्वच्छ भारत व', 'प्लास्टिक-मुक्त गाँव'],
      en: ['Clean India &', 'Plastic-Free Villages'],
    },
    mobileShort: {
      hi: ['स्वच्छ', 'भारत'],
      en: ['Clean', 'Villages'],
    },
  },
  {
    id: 'skills',
    number: 7,
    slug: '/missions/skill-development',
    angleDeg: 108,
    assetKey: 'medallionSkills',
    cropScaleClass: 'scale-[1.52]',
    accent: 'amber',
    labelAlign: 'left',
    mobileLabelPos: 'bottom',
    title: {
      hi: ['कौशल विकास', 'एवं आजीविका'],
      en: ['Skill Development', '& Livelihoods'],
    },
    mobileShort: {
      hi: ['कौशल', 'विकास'],
      en: ['Skills &', 'Jobs'],
    },
  },
  {
    id: 'organic',
    number: 5,
    slug: '/missions/organic-farming',
    angleDeg: 144,
    assetKey: 'medallionOrganic',
    cropScaleClass: 'scale-[1.38]',
    accent: 'forest',
    labelAlign: 'left',
    mobileLabelPos: 'bottom',
    title: {
      hi: ['जैविक एवं', 'टिकाऊ खेती'],
      en: ['Sustainable &', 'Organic Farming'],
    },
    mobileShort: {
      hi: ['जैविक', 'खेती'],
      en: ['Organic', 'Farming'],
    },
  },
  {
    id: 'harit',
    number: 2,
    slug: '/missions/harit-rajasthan',
    angleDeg: 180,
    assetKey: 'medallionHarit',
    cropScaleClass: 'scale-[1.38]',
    accent: 'forest',
    labelAlign: 'left',
    mobileLabelPos: 'bottom',
    title: {
      hi: ['हरित राजस्थान', '& वृक्षारोपण'],
      en: ['Harit Rajasthan &', 'Tree Plantation'],
    },
    mobileShort: {
      hi: ['हरित', 'राजस्थान'],
      en: ['Harit', 'Plantation'],
    },
  },
  {
    id: 'gaushala',
    number: 3,
    slug: '/missions/self-reliant-gaushala',
    angleDeg: 216,
    assetKey: 'medallionGaushala',
    cropScaleClass: 'scale-[1.38]',
    accent: 'amber',
    labelAlign: 'left',
    mobileLabelPos: 'top',
    title: {
      hi: ['आत्मनिर्भर', 'गौशाला मिशन'],
      en: ['Self-Reliant', 'Gaushala Mission'],
    },
    mobileShort: {
      hi: ['आत्मनिर्भर', 'गौशाला'],
      en: ['Gaushala', 'Mission'],
    },
  },
];

const CORE_VALUES = [
  {
    id: 'people',
    hi: ['जन-केंद्रित', 'पहल'],
    en: ['People', 'Centered'],
    icon: (
      <svg viewBox="0 0 36 32" className="w-8 h-7 mx-auto mb-1.5" fill="none" stroke="#C57B27" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="10" r="3.4" />
        <path d="M12.5 23v-2a5.5 5.5 0 0 1 11 0v2" />
        <circle cx="9.5" cy="13" r="2.6" />
        <path d="M5.5 23v-1.5a4 4 0 0 1 6.5-3.1" />
        <circle cx="26.5" cy="13" r="2.6" />
        <path d="M30.5 23v-1.5a4 4 0 0 0-6.5-3.1" />
      </svg>
    ),
  },
  {
    id: 'sustainability',
    hi: ['सतत विकास', 'आधारित'],
    en: ['Sustainability', 'Driven'],
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7 mx-auto mb-1.5" fill="none" stroke="#4B8A2A" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 25C8.5 13.5 17 7.5 26 7c-.5 10.5-6.5 17-16.5 17.5" />
        <path d="M6 26c6.5-3.5 12-9 17.5-16" />
      </svg>
    ),
  },
  {
    id: 'rural',
    hi: ['ग्रामीण', 'प्रभाव'],
    en: ['Rural', 'Impact'],
    icon: (
      <svg viewBox="0 0 34 32" className="w-8 h-7 mx-auto mb-1.5" fill="none" stroke="#6FA32D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="17" cy="9" r="3" />
        <circle cx="9.5" cy="21" r="2.5" />
        <circle cx="24.5" cy="21" r="2.5" />
        <path d="M15 11.5L11 18.8M19 11.5L23 18.8M12 21h10" />
        <path d="M6.5 26.5c3.5-1 17.5-1 21 0" />
      </svg>
    ),
  },
];

function GovedaCenterEmblem({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={GENERATED_ASSETS.officialLogo}
      alt="GOVEDA Carbon & Climate India Foundation Official Logo"
      referrerPolicy="no-referrer"
      className={
        compact
          ? 'w-full h-full object-cover scale-[1.03] select-none'
          : 'w-full h-full object-cover scale-[1.03] select-none'
      }
    />
  );
}

export function WhoWeAreShowcase({ lang, onNavigate }: WhoWeAreShowcaseProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Orbit geometry for the 10-mission constellation
  const ORBIT_RADIUS = 30.5;
  const CENTER_RADIUS = 18.5;
  const MOBILE_ORBIT_RADIUS = 33.5;
  const MOBILE_CENTER_RADIUS = 18.5;

  return (
    <section
      id="who-we-are"
      className="relative overflow-hidden bg-[#FCF8F0] pt-10 sm:pt-14 pb-24 sm:pb-36 lg:pb-44"
    >
      {/* Top Soft Blend From White Hero/8-Icon Strip Into Warm Sandstone Parchment */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white via-white/60 to-transparent z-0"
        aria-hidden="true"
      />

      {/* Subtle Radial Warm Glow Behind Constellation */}
      <div
        className="pointer-events-none absolute right-[8%] top-12 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(243,231,203,0.45)_0%,rgba(252,248,240,0)_70%)] z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* LEFT EDITORIAL COLUMN */}
          <div className="lg:col-span-5 space-y-5 lg:pr-4">
            <div className="flex items-center gap-3.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#2B3328]">
                {lang === 'hi' ? 'फाउंडेशन परिचय · ABOUT GOVEDA' : 'ABOUT GOVEDA'}
              </span>
              <span
                className="h-[1.5px] w-16 bg-gradient-to-r from-[#C68932] to-[#E6C78F]"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[3.45rem] font-bold text-[#184426] leading-[1.06] tracking-tight">
                {lang === 'hi' ? 'हम कौन हैं' : 'Who We Are'}
              </h2>
              <p className="mt-2.5 text-xl sm:text-2xl text-[#3A4338] leading-snug font-normal">
                {lang === 'hi' ? (
                  <>
                    एक जन-आधारित संस्था —{' '}
                    <span className="font-bold text-[#184426]">
                      जन, प्रकृति और समृद्धि
                    </span>{' '}
                    के लिए
                  </>
                ) : (
                  <>
                    A People&apos;s Foundation for{' '}
                    <span className="font-bold text-[#184426]">
                      People, Planet
                    </span>{' '}
                    &amp;{' '}
                    <span className="font-bold text-[#184426]">Prosperity</span>
                  </>
                )}
              </p>
            </div>

            {/* MOBILE (< sm): 10-MISSION CIRCULAR ORBITAL WHEEL DIRECTLY BELOW TITLE & SUBTITLE AND ABOVE EXPLANATION */}
            <div className="sm:hidden relative w-full max-w-[376px] mx-auto pt-4 pb-5">
              <div className="relative w-full aspect-square">
                <svg
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={MOBILE_ORBIT_RADIUS}
                    fill="none"
                    stroke="#C98838"
                    strokeWidth="0.4"
                    strokeOpacity="0.65"
                  />
                  {ORBIT_MISSIONS.map((node, idx) => {
                    const rad = (node.angleDeg * Math.PI) / 180;
                    const xEdge = 50 + MOBILE_CENTER_RADIUS * Math.cos(rad);
                    const yEdge = 50 + MOBILE_CENTER_RADIUS * Math.sin(rad);
                    const xOrbit = 50 + MOBILE_ORBIT_RADIUS * Math.cos(rad);
                    const yOrbit = 50 + MOBILE_ORBIT_RADIUS * Math.sin(rad);
                    const midRad = ((node.angleDeg + 18) * Math.PI) / 180;
                    const xArcDot = 50 + MOBILE_ORBIT_RADIUS * Math.cos(midRad);
                    const yArcDot = 50 + MOBILE_ORBIT_RADIUS * Math.sin(midRad);
                    const strokeColor = node.accent === 'amber' ? '#C77D26' : '#3C7A2E';

                    return (
                      <g key={`m-spoke-${node.id}`}>
                        <line
                          x1={xEdge}
                          y1={yEdge}
                          x2={xOrbit}
                          y2={yOrbit}
                          stroke={strokeColor}
                          strokeWidth="0.35"
                          strokeOpacity="0.72"
                        />
                        <circle cx={xEdge} cy={yEdge} r="0.85" fill={strokeColor} />
                        <circle
                          cx={xArcDot}
                          cy={yArcDot}
                          r="0.7"
                          fill={idx % 2 === 0 ? '#4B8A2A' : '#C77D26'}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* MOBILE CENTER OFFICIAL GOVEDA® SEAL LOGO */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] aspect-square rounded-full bg-white ring-2 ring-[#E6A817]/75 shadow-[0_10px_24px_-10px_rgba(21,62,30,0.3)] overflow-hidden z-10 flex items-center justify-center">
                  <GovedaCenterEmblem compact />
                </div>

                {/* MOBILE 10 MISSION MEDALLIONS ORBITING AROUND CENTER */}
                {ORBIT_MISSIONS.map((node) => {
                  const rad = (node.angleDeg * Math.PI) / 180;
                  const leftPct = 50 + MOBILE_ORBIT_RADIUS * Math.cos(rad);
                  const topPct = 50 + MOBILE_ORBIT_RADIUS * Math.sin(rad);

                  return (
                    <button
                      key={`mob-${node.id}`}
                      type="button"
                      onClick={() => onNavigate(node.slug)}
                      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer active:scale-95 transition-transform"
                      aria-label={`${node.title[lang][0]} ${node.title[lang][1]}`}
                    >
                      <div className="w-[46px] h-[46px] rounded-full bg-[#FBF4E4] border-[1.5px] border-[#DFCFAF] overflow-hidden shadow-sm">
                        <ResilientImage
                          assetKey={node.assetKey}
                          alt={`${node.title[lang][0]} ${node.title[lang][1]}`}
                          className={`w-full h-full object-cover ${node.cropScaleClass}`}
                        />
                      </div>

                      <div
                        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center leading-[1.08] px-1 py-[1px] rounded bg-[#FCF8F0]/88 ${
                          node.mobileLabelPos === 'top' ? 'bottom-full mb-0.5' : 'top-full mt-0.5'
                        }`}
                      >
                        <span className="block text-[8px] font-bold text-[#184426]">
                          {node.mobileShort[lang][0]}
                        </span>
                        <span className="block text-[7.5px] font-semibold text-[#314034]">
                          {node.mobileShort[lang][1]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-l-[3px] border-[#4B8A2A] pl-4 py-0.5 max-w-[430px]">
              <p className="text-sm sm:text-[15px] text-[#354035] leading-relaxed">
                {lang === 'hi'
                  ? 'GOVEDA Carbon & Climate India Foundation एक Section 8 गैर-लाभकारी संस्था है, जो राजस्थान व भारत भर में जलवायु कार्रवाई, आत्मनिर्भर गौशालाओं, ग्राम विकास, कौशल आजीविका, सामाजिक कल्याण और सांस्कृतिक धरोहर संरक्षण के 10 एकीकृत मिशनों को साथ जोड़ती है।'
                  : 'GOVEDA Carbon & Climate India Foundation is a Section 8 non-profit organisation uniting 10 grassroots missions across Rajasthan and India — spanning climate & carbon action, self-reliant gaushalas, rural development, youth & women livelihoods, social care, and heritage conservation.'}
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[#DFD5C0] pt-1 pb-1 max-w-[430px]">
              {CORE_VALUES.map((val) => (
                <div key={val.id} className="px-2 first:pl-0 text-center">
                  {val.icon}
                  <span className="block text-xs sm:text-[13px] font-bold text-[#1C2A21] leading-tight">
                    {val[lang][0]}
                  </span>
                  <span className="block text-xs sm:text-[13px] font-bold text-[#1C2A21] leading-tight">
                    {val[lang][1]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C4D27] hover:bg-[#133A1C] text-white text-xs sm:text-sm font-semibold shadow-sm cursor-pointer"
              >
                <span>{lang === 'hi' ? 'विस्तार से जानें' : 'Read Our Full Story'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/missions')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-[#F5F9F2] text-[#184426] border border-[#3E7B2E]/50 text-xs sm:text-sm font-semibold shadow-2xs cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-[#2F6D26]" />
                <span>{lang === 'hi' ? 'हमारे 10 मिशन' : 'Our 10 Missions'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: ALL 10 MISSIONS INTERACTIVE RADIAL WHEEL (DESKTOP / TABLET sm+ ONLY) */}
          <div className="hidden sm:block lg:col-span-7">
            <div className="relative w-full max-w-[610px] mx-auto lg:ml-auto lg:mr-4 aspect-[1.08/1]">
              {/* Orbital Ring & Radial Spokes SVG */}
              <svg
                viewBox="0 0 100 100"
                className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={ORBIT_RADIUS}
                  fill="none"
                  stroke="#C98838"
                  strokeWidth="0.32"
                  strokeOpacity="0.65"
                />

                {ORBIT_MISSIONS.map((node, idx) => {
                  const rad = (node.angleDeg * Math.PI) / 180;
                  const xEdge = 50 + CENTER_RADIUS * Math.cos(rad);
                  const yEdge = 50 + CENTER_RADIUS * Math.sin(rad);
                  const xOrbit = 50 + ORBIT_RADIUS * Math.cos(rad);
                  const yOrbit = 50 + ORBIT_RADIUS * Math.sin(rad);
                  const midRad = ((node.angleDeg + 18) * Math.PI) / 180;
                  const xArcDot = 50 + ORBIT_RADIUS * Math.cos(midRad);
                  const yArcDot = 50 + ORBIT_RADIUS * Math.sin(midRad);
                  const isHighlighted = activeId === node.id;
                  const strokeColor = node.accent === 'amber' ? '#C77D26' : '#3C7A2E';

                  return (
                    <g key={`spoke-${node.id}`}>
                      <line
                        x1={xEdge}
                        y1={yEdge}
                        x2={xOrbit}
                        y2={yOrbit}
                        stroke={strokeColor}
                        strokeWidth={isHighlighted ? '0.48' : '0.28'}
                        strokeOpacity={isHighlighted ? '0.95' : '0.72'}
                      />
                      <circle
                        cx={xEdge}
                        cy={yEdge}
                        r={isHighlighted ? '1.0' : '0.75'}
                        fill={strokeColor}
                      />
                      <circle
                        cx={xArcDot}
                        cy={yArcDot}
                        r="0.6"
                        fill={idx % 2 === 0 ? '#4B8A2A' : '#C77D26'}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* CENTRAL OFFICIAL GOVEDA® SEAL LOGO */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] aspect-square rounded-full bg-white ring-2 ring-[#E6A817]/80 shadow-[0_18px_42px_-14px_rgba(21,62,30,0.28)] overflow-hidden z-10 flex items-center justify-center">
                <GovedaCenterEmblem />
              </div>

              {/* ALL 10 LARGE FULL-BLEED EDITORIAL ILLUSTRATED MEDALLIONS ON ORBIT */}
              {ORBIT_MISSIONS.map((node) => {
                const rad = (node.angleDeg * Math.PI) / 180;
                const leftPct = 50 + ORBIT_RADIUS * Math.cos(rad);
                const topPct = 50 + ORBIT_RADIUS * Math.sin(rad);

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => onNavigate(node.slug)}
                    onMouseEnter={() => setActiveId(node.id)}
                    onMouseLeave={() => setActiveId(null)}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus-visible:outline-none"
                    aria-label={`${node.title[lang][0]} ${node.title[lang][1]}`}
                  >
                    {/* Large Circular Medallion with Edge-to-Edge Vector Artwork */}
                    <div
                      className={`w-[72px] h-[72px] md:w-[82px] md:h-[82px] lg:w-[88px] lg:h-[88px] rounded-full bg-[#FBF4E4] border-[2px] overflow-hidden transition-all duration-250 shadow-[0_8px_22px_-8px_rgba(95,68,28,0.3)] group-hover:scale-108 group-hover:shadow-md ${
                        activeId === node.id
                          ? 'border-[#184426] ring-2 ring-[#76C032]/45'
                          : 'border-[#E1D2B4]'
                      }`}
                    >
                      <ResilientImage
                        assetKey={node.assetKey}
                        alt={`${node.title[lang][0]} ${node.title[lang][1]}`}
                        className={`w-full h-full object-cover ${node.cropScaleClass}`}
                      />
                    </div>

                    {/* Outside Positioned Label Matching Reference Diagram */}
                    <div
                      className={`pointer-events-none absolute whitespace-nowrap leading-[1.2] transition-colors ${
                        node.labelAlign === 'bottom'
                          ? 'top-full left-1/2 -translate-x-1/2 mt-1.5 text-center'
                          : node.labelAlign === 'right'
                            ? 'left-full top-1/2 -translate-y-1/2 ml-2.5 text-left'
                            : 'right-full top-1/2 -translate-y-1/2 mr-2.5 text-right'
                      }`}
                    >
                      <span className="block text-[11px] lg:text-[12px] font-bold text-[#1D2B22] group-hover:text-[#184426]">
                        {node.title[lang][0]}
                      </span>
                      <span className="block text-[11px] lg:text-[12px] font-bold text-[#1D2B22] group-hover:text-[#184426]">
                        {node.title[lang][1]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SEAMLESS AMALGAMATED BOTTOM RAJASTHAN SANDSTONE FORT, DUNES & CHHATRI HORIZON */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="relative w-full max-w-[1600px] mx-auto h-32 sm:h-48 lg:h-56">
          <img
            src={GENERATED_ASSETS.whoWeAreSandstoneHorizon}
            alt=""
            className="w-full h-full object-cover object-bottom mix-blend-multiply opacity-95 block"
          />
          <div
            className="absolute inset-x-0 top-0 h-10 sm:h-12 bg-gradient-to-b from-[#FCF8F0] via-[#FCF8F0]/45 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#FAFBF8] via-[#FAFBF8]/55 to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
