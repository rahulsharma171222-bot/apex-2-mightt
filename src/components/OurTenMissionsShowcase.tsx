import React from 'react';
import { ResilientImage } from './ResilientImage';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import type { Language } from '../types/goveda';

interface OurTenMissionsShowcaseProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

interface MissionShowcaseCard {
  num: string;
  slug: string;
  assetKey: AssetKey;
  mobilePhotoKey: AssetKey;
  fallbackGradient: [string, string];
  dotColor: string;
  titleHi: string;
  titleEn: string;
  shortDescHi: string;
  shortDescEn: string;
  imgScaleClass?: string;
  icon: React.ReactNode;
}

const TEN_MISSION_CARDS: MissionShowcaseCard[] = [
  {
    num: '01',
    slug: '/missions/carbon-credit',
    assetKey: 'missionVignette01Carbon',
    mobilePhotoKey: 'missionPhoto01',
    fallbackGradient: ['#4F8E35', '#1F4B24'],
    dotColor: '#F59E0B',
    titleHi: 'कार्बन क्रेडिट एवं जलवायु कार्यवाही',
    titleEn: 'Carbon Credit & Climate Action',
    shortDescHi: 'किसानों व ग्रामीणों के लिए पारदर्शी जलवायु एवं कार्बन शिक्षा।',
    shortDescEn: 'Transparent climate & carbon literacy for rural farmers.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 24C8 14 15.5 8 25 7.5C24.5 17 18.5 23.5 9.5 24" />
        <path d="M6.5 25.5C12.5 22 17.5 16.5 22.5 10" />
      </svg>
    ),
  },
  {
    num: '02',
    slug: '/missions/harit-rajasthan',
    assetKey: 'missionVignette02Tree',
    mobilePhotoKey: 'missionPhoto02',
    fallbackGradient: ['#5DA33C', '#245328'],
    dotColor: '#6EB83A',
    titleHi: 'हरित राजस्थान एवं वृक्षारोपण',
    titleEn: 'Harit Rajasthan & Tree Plantation',
    shortDescHi: 'देशी प्रजातियों का रोपण व दीर्घकालिक पौध संरक्षण।',
    shortDescEn: 'Native species plantation with multi-year survival care.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 26v-9" />
        <path d="M12 26h8" />
        <path d="M9.5 18.5a5 5 0 0 1-.8-9.8 6 6 0 0 1 14.6 0 5 5 0 0 1-.8 9.8Z" />
        <path d="M16 17l3-2.5M16 15l-3-2" />
      </svg>
    ),
  },
  {
    num: '03',
    slug: '/missions/self-reliant-gaushala',
    assetKey: 'missionVignette03Gaushala',
    mobilePhotoKey: 'missionPhoto03',
    fallbackGradient: ['#B88642', '#5A4A24'],
    dotColor: '#6EB83A',
    titleHi: 'आत्मनिर्भर गौशाला मिशन',
    titleEn: 'Self-Reliant Gaushala Mission',
    shortDescHi: 'जैविक खाद, चारा और स्वच्छता से सशक्त गौशालाएँ।',
    shortDescEn: 'Compost, fodder, and sustainable rural Gaushala hubs.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 15.5c0-1.5 1-3 2.5-3.5l2.5-.5c1-1.5 2-2.5 3-2.5 1.2 0 1.5 1 2.2 1.8h6.3c2.2 0 3.5 1.5 3.5 4v6.2h-2v-3.5h-4.5v3.5h-2v-3.5h-5v3.5h-2V18l-2.5.3L6 15.5Z" />
        <path d="M10.5 9.5C9.5 8 8.5 7.5 8 7.5" />
      </svg>
    ),
  },
  {
    num: '04',
    slug: '/missions/biogas-cbg',
    assetKey: 'missionVignette04Biogas',
    mobilePhotoKey: 'missionPhoto04',
    fallbackGradient: ['#3D7D5C', '#1D4738'],
    dotColor: '#6EB83A',
    titleHi: 'स्वच्छ ऊर्जा (बायोगैस, CBG)',
    titleEn: 'Clean Energy (Biogas, CBG)',
    shortDescHi: 'गोबर व जैविक अपशिष्ट से स्वच्छ ग्रामीण ऊर्जा अध्ययन।',
    shortDescEn: 'Clean biogas and CBG feasibility from organic waste.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 5.5C12 10 8.5 14 8.5 18.5a7.5 7.5 0 0 0 15 0c0-4.5-3.5-8.5-7.5-13Z" />
        <path d="M16 25v-8.5" />
        <path d="M16 20.5c2-1.8 4-2 5.2-1.5" />
        <path d="M16 18c-1.8-1.5-3.4-1.8-4.6-1.3" />
      </svg>
    ),
  },
  {
    num: '05',
    slug: '/missions/organic-farming',
    assetKey: 'missionVignette05Organic',
    mobilePhotoKey: 'missionPhoto05',
    fallbackGradient: ['#6E9E35', '#2F5B21'],
    dotColor: '#6EB83A',
    titleHi: 'जैविक खेती एवं प्राकृतिक संसाधन',
    titleEn: 'Organic Farming & Natural Resources',
    shortDescHi: 'मृदा परीक्षण, जीवामृत व कृषि-वानिकी मार्गदर्शन।',
    shortDescEn: 'Soil health testing, natural compost, and agroforestry.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 26V13" />
        <path d="M11 26h10" />
        <path d="M16 14c0-4.5 3.5-7.5 8-7.5 0 4.5-3.5 7.5-8 7.5Z" />
        <path d="M16 17c0-4.2-3.2-7-7.5-7 0 4.2 3.2 7 7.5 7Z" />
      </svg>
    ),
  },
  {
    num: '06',
    slug: '/missions/clean-india-plastic-free',
    assetKey: 'missionVignette06Stepwell',
    mobilePhotoKey: 'missionPhoto06',
    fallbackGradient: ['#357A86', '#214A52'],
    dotColor: '#6EB83A',
    titleHi: 'जल संरक्षण एवं जल सुरक्षा',
    titleEn: 'Water Conservation & Water Security',
    shortDescHi: 'पारंपरिक जोहड़, कुंड और स्वच्छ ग्राम जल संवर्धन।',
    shortDescEn: 'Reviving traditional johads, kunds, and village ponds.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 5.5S9.5 13 9.5 18.5a6.5 6.5 0 0 0 13 0C22.5 13 16 5.5 16 5.5Z" />
        <path d="M13 19.5a3.2 3.2 0 0 0 3.2 2.8" />
      </svg>
    ),
  },
  {
    num: '07',
    slug: '/missions/heritage-solar-water',
    assetKey: 'missionVignette07Fort',
    mobilePhotoKey: 'missionPhoto07',
    fallbackGradient: ['#C78842', '#70441B'],
    dotColor: '#6EB83A',
    titleHi: 'सांस्कृतिक धरोहर संरक्षण',
    titleEn: 'Cultural Heritage Conservation',
    shortDescHi: 'बावड़ी, छतरी व धरोहर स्थलों का हरित संरक्षण।',
    shortDescEn: 'Green solar & water care for historic stepwells and heritage.',
    imgScaleClass:
      'object-cover object-[72%_66%] scale-[1.45] [mask-image:radial-gradient(ellipse_78%_74%_at_54%_55%,black_55%,transparent_96%)]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 25h20" />
        <path d="M8 25V14h16v11" />
        <path d="M12 25v-6a4 4 0 0 1 8 0v6" />
        <path d="M10 14c0-3.5 2.7-6 6-6s6 2.5 6 6" />
        <path d="M16 5.5V8" />
      </svg>
    ),
  },
  {
    num: '08',
    slug: '/missions/skill-development',
    assetKey: 'missionVignette08Skills',
    mobilePhotoKey: 'missionPhoto08',
    fallbackGradient: ['#457A58', '#224734'],
    dotColor: '#6EB83A',
    titleHi: 'कौशल विकास और रोजगार',
    titleEn: 'Skill Development & Livelihoods',
    shortDescHi: 'युवाओं के लिए डिजिटल, भाषा व व्यावहारिक प्रशिक्षण।',
    shortDescEn: 'Practical digital, language, and vocational youth training.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13.5 16 8l11 5.5L16 19 5 13.5Z" />
        <path d="M9.5 16v5.2c0 1.8 2.9 3.3 6.5 3.3s6.5-1.5 6.5-3.3V16" />
        <path d="M25.5 14.5V21" />
      </svg>
    ),
  },
  {
    num: '09',
    slug: '/missions/senior-citizen-care',
    assetKey: 'missionVignette09Senior',
    mobilePhotoKey: 'missionPhoto09',
    fallbackGradient: ['#9D7A4E', '#574229'],
    dotColor: '#6EB83A',
    titleHi: 'वृद्धजन एवं मानसिक स्वास्थ्य',
    titleEn: 'Senior Citizen Care & Mental Well-being',
    shortDescHi: 'वरिष्ठ नागरिकों के सम्मान, संवाद और स्वास्थ्य की पहल।',
    shortDescEn: 'Dignified senior care, community support, and wellness.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 25.5s-8.5-5.2-8.5-11.5A4.8 4.8 0 0 1 16 10.6 4.8 4.8 0 0 1 24.5 14c0 6.3-8.5 11.5-8.5 11.5Z" />
        <path d="M10.5 15.5h2.4l1.4-2.8 2.2 5 1.5-2.2h3.5" />
      </svg>
    ),
  },
  {
    num: '10',
    slug: '/missions/women-empowerment',
    assetKey: 'missionVignette10Women',
    mobilePhotoKey: 'missionPhoto10',
    fallbackGradient: ['#A85D3B', '#5A3122'],
    dotColor: '#6EB83A',
    titleHi: 'ग्रामीण समृद्धि एवं सामाजिक कल्याण',
    titleEn: 'Rural Prosperity & Social Welfare',
    shortDescHi: 'महिला SHG, स्थानीय उद्यम व सामुदायिक आत्मनिर्भरता।',
    shortDescEn: 'Women SHGs, local livelihoods, and rural empowerment.',
    imgScaleClass:
      'object-cover object-[50%_4%] scale-100 [mask-image:radial-gradient(ellipse_68%_78%_at_50%_48%,black_62%,transparent_98%)]',
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="#2D6A2E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="11.5" r="2.8" />
        <path d="M11.2 23.5v-1.8a4.8 4.8 0 0 1 9.6 0v1.8" />
        <circle cx="8.5" cy="13.5" r="2.2" />
        <path d="M5 23.5v-1.2a3.5 3.5 0 0 1 5-3.1" />
        <circle cx="23.5" cy="13.5" r="2.2" />
        <path d="M27 23.5v-1.2a3.5 3.5 0 0 0-5-3.1" />
      </svg>
    ),
  },
];

export function OurTenMissionsShowcase({ lang, onNavigate }: OurTenMissionsShowcaseProps) {
  return (
    <section
      id="our-10-missions"
      className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FBFDF7] to-[#F7FBF1] pt-10 md:pt-16 pb-24 sm:pb-36 lg:pb-44"
    >
      {/* Top-Left Botanical Hanging Leaf Branch Decorative Accent (Desktop & Tablet) */}
      <svg
        viewBox="0 0 220 140"
        fill="none"
        className="pointer-events-none hidden md:block absolute left-0 top-0 w-40 sm:w-56 lg:w-64 h-auto opacity-95 z-10 select-none"
        aria-hidden="true"
      >
        <path d="M-10 -5 Q65 18 118 8" stroke="#4D8A2B" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M35 10 Q48 45 25 82" stroke="#4D8A2B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M75 14 Q95 36 92 66" stroke="#4D8A2B" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M18 32C4 34 0 46 8 56c10-2 15-12 10-24Z" fill="#67AC36" />
        <path d="M36 44c14 2 18 14 10 24-10-2-15-12-10-24Z" fill="#468324" />
        <path d="M22 68c-12 5-14 18-4 26 9-4 12-15 4-26Z" fill="#7AC043" />
        <path d="M62 18c-8 14-4 28 8 34 8-10 6-24-8-34Z" fill="#5D9E31" />
        <path d="M94 24c14 6 20 20 14 32-12-4-18-16-14-32Z" fill="#79BE44" />
        <path d="M114 8c14-4 28 3 34 15-12 6-26 1-34-15Z" fill="#4C8A28" />
        <path d="M138 30c14 3 22 14 18 26-12-2-20-12-18-26Z" fill="#82C54C" />
      </svg>

      {/* Top-Right Soft Botanical Hills Background Wave */}
      <svg
        viewBox="0 0 640 240"
        fill="none"
        className="pointer-events-none absolute right-0 top-0 w-[60%] sm:w-[46%] h-auto opacity-65 z-0 select-none"
        aria-hidden="true"
      >
        <path d="M120 240 C260 175 370 110 640 12 L640 240 Z" fill="#EDF6E5" />
        <path d="M250 240 C385 185 490 130 640 65 L640 240 Z" fill="#E4F1D9" opacity="0.7" />
      </svg>

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* ================================================================= */}
        {/* DESKTOP & TABLET (md+): EXISTING CENTERED HEADER + 10 VIGNETTE CARDS (UNTOUCHED) */}
        {/* ================================================================= */}
        <div className="hidden md:block">
          {/* CENTERED EDITORIAL BRAND & SECTION HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-9 sm:mb-11">
            <div className="flex items-center justify-center gap-4 sm:gap-7 mb-2.5">
              <span className="h-[1px] flex-1 max-w-[140px] bg-[#A7B89E]" aria-hidden="true" />
              <div className="inline-flex flex-col items-center">
                <div className="inline-flex items-center gap-2">
                  <svg viewBox="0 0 32 28" className="w-6 h-5" fill="none" aria-hidden="true">
                    <path d="M4 21C6 9 16 3 28 3c-2 11-9 18-20 18-1.5 0-3-0.3-4 0z" fill="#6BB635" />
                    <path d="M2 23c7-2 14-7 21-15" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M1 24c5 1 11 0 16-2.5" stroke="#2D6A2E" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span className="text-xl sm:text-2xl font-extrabold tracking-[0.06em] text-[#1D4A26]">
                    GOVEDA
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-[#2F4133] uppercase mt-0.5">
                  CARBON &amp; CLIMATE INDIA FOUNDATION
                </span>
              </div>
              <span className="h-[1px] flex-1 max-w-[140px] bg-[#A7B89E]" aria-hidden="true" />
            </div>

            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-[#153D1E] leading-[1.06] tracking-tight">
              Our 10 Missions
            </h2>
            <p className="mt-1.5 text-xl sm:text-2xl lg:text-[1.72rem] font-bold text-[#1D4426] leading-snug">
              हमारे 10 प्रमुख मिशन
            </p>
            <p className="mt-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.34em] text-[#5B685B] uppercase">
              PEOPLE &nbsp;&nbsp;|&nbsp;&nbsp; PLANET &nbsp;&nbsp;|&nbsp;&nbsp; PROSPERITY
            </p>
          </div>

          {/* 2x5 GRID OF 10 HIGH-CRAFT MISSION CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {TEN_MISSION_CARDS.map((card) => (
              <button
                key={card.num}
                type="button"
                onClick={() => onNavigate(card.slug)}
                className="group relative text-left bg-[#FBF9F2] hover:bg-[#FFFFFF] rounded-[22px] border border-[#E2E7D8] hover:border-[#8AB86E] shadow-[0_6px_20px_-14px_rgba(24,68,38,0.18)] hover:shadow-[0_14px_30px_-14px_rgba(24,68,38,0.24)] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-250 hover:-translate-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1E5B2A]"
              >
                {/* TOP HALF: NUMBER BADGE + SEAMLESS ISOLATED VIGNETTE ILLUSTRATION */}
                <div className="relative w-full aspect-[3/2] mb-2.5 flex items-center justify-center overflow-hidden rounded-xl bg-transparent">
                  <span className="absolute top-0 left-0 z-10 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full rounded-tl-xl bg-[#DCECC9] text-[#1A4322] font-bold text-xs tabular-nums">
                    {card.num}
                  </span>

                  <ResilientImage
                    assetKey={card.assetKey}
                    alt={`${card.titleHi} - ${card.titleEn}`}
                    className={`w-full h-full mix-blend-multiply brightness-[1.035] contrast-[1.03] transition-transform duration-300 group-hover:scale-105 ${
                      card.imgScaleClass ??
                      'object-contain scale-100 [mask-image:radial-gradient(ellipse_92%_90%_at_50%_50%,black_72%,transparent_99%)]'
                    }`}
                  />
                </div>

                {/* BOTTOM HALF: MONOLINE GREEN SVG ICON + DUAL-LANGUAGE HINDI/ENGLISH TITLE */}
                <div className="flex items-start gap-2.5 pt-1 border-t border-[#ECEFE3]">
                  <div className="w-10 h-10 rounded-full bg-white/90 border border-[#DCE6D3] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:border-[#76B947] transition-colors">
                    {card.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14.5px] sm:text-[15px] font-bold text-[#142D1B] leading-[1.28] group-hover:text-[#1D5A2A]">
                      {card.titleHi}
                    </h3>
                    <p className="mt-1 text-[12px] font-medium text-[#465448] leading-[1.3]">
                      {card.titleEn}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* MOBILE ONLY (< md): EDITORIAL HEADER + CLEAN SYMMETRICAL 2-COLUMN GRID */}
        {/* ================================================================= */}
        <div className="md:hidden space-y-6">
          {/* Editorial Heading Matching WhyItMattersShowcase Creative Signature */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1C4A25]">
                OUR 10 MISSIONS
              </span>
              <span className="h-[1.5px] w-14 bg-[#2F6D26]" aria-hidden="true" />
            </div>

            <div>
              <h2 className="font-editorial text-[2.3rem] sm:text-[2.65rem] font-extrabold text-[#153E1E] leading-[1.08] tracking-tight text-balance">
                {lang === 'hi' ? (
                  <>
                    हमारे 10{' '}
                    <br />
                    प्रमुख मिशन
                  </>
                ) : (
                  <>
                    Our 10{' '}
                    <br />
                    Key Missions
                  </>
                )}
              </h2>
              {/* Signature Tapered Fresh Lime-Green Brushstroke Curve */}
              <svg
                viewBox="0 0 264 20"
                fill="none"
                className="w-52 sm:w-60 h-4 mt-1.5"
                aria-hidden="true"
              >
                <path
                  d="M2 14 C72 3 168 1 258 10 C192 9 98 11 4 18 Z"
                  fill="#82C341"
                />
              </svg>
            </div>

            <div className="flex items-stretch gap-3 max-w-[390px]">
              <span
                className="w-[3.5px] shrink-0 rounded-full bg-[#82C341]"
                aria-hidden="true"
              />
              <div className="space-y-1 py-0.5">
                <p className="text-[13.5px] text-[#283329] leading-[1.6] font-medium">
                  {lang === 'hi'
                    ? 'पर्यावरण संरक्षण, किसान समृद्धि, आत्मनिर्भर गौशाला, स्वच्छ ऊर्जा, कौशल विकास और ग्रामीण कल्याण के दस एकीकृत स्तंभ।'
                    : 'Ten integrated grassroots pillars uniting climate resilience, tree plantation, self-reliant Gaushalas, rural skills, and heritage conservation.'}
                </p>
                <p className="text-[10px] font-bold tracking-[0.26em] text-[#4B634E] uppercase">
                  PEOPLE · PLANET · PROSPERITY
                </p>
              </div>
            </div>
          </div>

          {/* Clean, Normal, Uniform 2-Column Editorial Card Grid (01 through 10) */}
          <div className="grid grid-cols-2 gap-3.5">
            {TEN_MISSION_CARDS.map((card) => (
              <button
                key={`mob-card-${card.num}`}
                type="button"
                onClick={() => onNavigate(card.slug)}
                className="group text-left bg-white rounded-[18px] border border-[#DDE7D7] shadow-[0_6px_18px_-12px_rgba(20,58,29,0.2)] overflow-hidden flex flex-col cursor-pointer active:scale-[0.985] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#368737]"
              >
                {/* Clean Full-Bleed Photorealistic Mission Header */}
                <div
                  className="relative w-full aspect-[4/3] overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${card.fallbackGradient[0]}, ${card.fallbackGradient[1]})`,
                  }}
                >
                  <img
                    src={GENERATED_ASSETS[card.mobilePhotoKey]}
                    alt={lang === 'hi' ? card.titleHi : card.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Subtle Contrast Scrim at Top-Left for Numeral Legibility */}
                  <div
                    className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/35 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                  <span className="absolute top-2 left-2 inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#143A1D]/80 text-white font-bold text-[11px] tabular-nums">
                    {card.num}
                  </span>
                </div>

                {/* Crisp Lime-Green Accent Divider Line */}
                <div
                  className="h-[2.5px] w-full bg-gradient-to-r from-[#82C341] via-[#6BB635] to-[#DCECC9]"
                  aria-hidden="true"
                />

                {/* Clean Editorial Card Body */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="text-[13.5px] sm:text-[14.5px] font-bold text-[#153D1E] leading-[1.3]">
                      {lang === 'hi' ? card.titleHi : card.titleEn}
                    </h3>
                    <p className="mt-1 text-[11.5px] text-[#3B483C] leading-[1.48]">
                      {lang === 'hi' ? card.shortDescHi : card.shortDescEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#EDF2E8] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#2E7D32]">
                      {lang === 'hi' ? 'विस्तार से जानें →' : 'Explore →'}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-[#F4F9F0] border border-[#DCE8D4] flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                      {card.icon}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SEAMLESS PANORAMIC HORIZON: GREEN HILLS LEFT + SANDSTONE RAJASTHAN FORT RIGHT */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="relative w-full max-w-[1600px] mx-auto h-24 sm:h-40 lg:h-48">
          {/* Left Lush Green Aravalli Hills Panorama */}
          <img
            src={GENERATED_ASSETS.scenicCarbonAgro}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute left-0 bottom-0 w-[62%] h-full object-cover object-bottom mix-blend-multiply opacity-70 [mask-image:linear-gradient(to_right,black_55%,transparent_100%)]"
          />
          {/* Right Golden Sandstone Rajasthan Hilltop Fort */}
          <img
            src={GENERATED_ASSETS.whoWeAreCenterFort}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute right-0 bottom-0 w-[56%] h-full object-cover object-bottom mix-blend-multiply opacity-85 [mask-image:linear-gradient(to_left,black_60%,transparent_100%)]"
          />
          <div
            className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#F7FBF1] via-[#F7FBF1]/70 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white/75 to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
