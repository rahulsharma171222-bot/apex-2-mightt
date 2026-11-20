import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Gauge,
  Leaf,
  ShieldAlert,
  Sprout,
  Sun,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import { GENERATED_ASSETS } from '../data/assets';
import { MISSIONS_DATA } from '../data/missionsData';
import { OrganicEditorialHeading } from './OrganicFarmingSections';
import {
  calculateCleanEnergyFeasibility,
  type CleanEnergyGoal,
} from '../utils/cleanEnergyLogic';
import type { Language } from '../types/goveda';

/* ============================================================================
   1. SEAMLESS HERO SECTION — MATCHED TO GOVEDA EDITORIAL WATERCOLOR SYSTEM
   Desktop (1440px) & Mobile (390px) preserve identical reference typography,
   antique-gold hairlines, 2-line deep forest-green/olive headline, sweeping
   gold-green curved brush underline, italic pale-sage brush ribbon, delicate
   gold lead rule, dual side-by-side rounded pill CTAs, and seamless art.
   ============================================================================ */
interface CleanEnergyHeroProps {
  lang: Language;
  onScrollTo: (sectionId: string) => void;
}

export function CleanEnergyHero({ lang, onScrollTo }: CleanEnergyHeroProps) {
  return (
    <section
      aria-label={
        lang === 'hi'
          ? 'स्वच्छ ऊर्जा: सौर, बायोगैस एवं CBG मुख्य परिचय'
          : 'Clean Energy: Solar, Biogas and CBG Hero'
      }
      className="relative overflow-hidden bg-[#FBFAF6] border-b border-[#E8DFC8]"
    >
      {/* DESKTOP FULL-BLEED RIGHT-WEIGHTED EDITORIAL WATERCOLOR BACKDROP */}
      <div
        className="hidden lg:block absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <img
          src={GENERATED_ASSETS.cleanEnergyHeroEditorial}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #FBFAF6 0%, #FBFAF6 33%, rgba(251,250,246,0.92) 44%, rgba(251,250,246,0.45) 54%, rgba(251,250,246,0) 66%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{
            background:
              'linear-gradient(to top, #FBFAF6 0%, rgba(251,250,246,0.5) 45%, transparent 100%)',
          }}
        />
      </div>

      {/* HERO CONTENT CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-5 sm:pt-11 sm:pb-10 lg:pt-14 lg:pb-16 lg:min-h-[600px] flex items-center">
        <div className="w-full lg:w-[50%] xl:w-[48%] space-y-4 sm:space-y-5">
          {/* Eyebrow: — GOVEDA • PEOPLE • PLANET • PROSPERITY — */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <span
              className="h-[1.5px] w-7 sm:w-9 bg-[#C8922A] shrink-0"
              aria-hidden="true"
            />
            <span className="text-[10px] sm:text-[11.5px] font-bold tracking-[0.17em] uppercase text-[#203D24] whitespace-nowrap">
              GOVEDA • PEOPLE • PLANET • PROSPERITY
            </span>
            <span
              className="h-[1.5px] w-7 sm:w-9 bg-[#C8922A] shrink-0"
              aria-hidden="true"
            />
          </div>

          {/* 2-Line Editorial Display Headline */}
          <div>
            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold leading-[1.12] tracking-tight">
                <span className="block text-[2.45rem] sm:text-[3.35rem] lg:text-[3.7rem] text-[#114720]">
                  स्वच्छ ऊर्जा
                </span>
                <span className="block text-[2.05rem] sm:text-[2.85rem] lg:text-[3.15rem] bg-gradient-to-r from-[#567F21] via-[#3E6F20] to-[#23561F] bg-clip-text text-transparent">
                  सौर, बायोगैस एवं CBG
                </span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold leading-[1.08] tracking-tight">
                <span className="block text-[2.25rem] sm:text-[3.1rem] lg:text-[3.45rem] text-[#114720]">
                  Clean Energy:
                </span>
                <span className="block text-[2.05rem] sm:text-[2.85rem] lg:text-[3.1rem] bg-gradient-to-r from-[#567F21] via-[#3E6F20] to-[#23561F] bg-clip-text text-transparent">
                  Solar, Biogas &amp; CBG
                </span>
              </h1>
            )}

            {/* Sweeping Organic Gold-to-Green Brush Underline */}
            <svg
              viewBox="0 0 380 30"
              fill="none"
              aria-hidden="true"
              className="mt-1 w-[275px] sm:w-[355px] lg:w-[385px] h-6"
            >
              <defs>
                <linearGradient
                  id="cleanEnergyHeroBrush"
                  x1="0"
                  y1="15"
                  x2="380"
                  y2="15"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#E4B03C" stopOpacity="0.22" />
                  <stop offset="26%" stopColor="#DCA128" />
                  <stop offset="66%" stopColor="#6D9B2A" />
                  <stop offset="100%" stopColor="#265E20" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path
                d="M4 25 C98 2 222 1 374 18 C274 9 138 11 10 28 Z"
                fill="url(#cleanEnergyHeroBrush)"
              />
            </svg>
          </div>

          {/* Pale-Sage Organic Brush Ribbon Tagline */}
          <div className="pt-0.5">
            <p
              className="inline-block px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-editorial italic text-[14px] sm:text-[17px] lg:text-[18px] text-[#154A24] tracking-normal"
              style={{
                background:
                  'linear-gradient(90deg, rgba(235,241,219,0.92) 0%, rgba(242,245,227,0.85) 75%, rgba(251,250,246,0) 100%)',
              }}
            >
              Clean Sunlight. Smokeless Kitchens. Circular Bio-Energy.
            </p>
            {lang === 'en' && (
              <p className="mt-1 pl-3.5 text-xs font-hindi font-medium text-[#526958]">
                सौर प्रकाश · धुआँ-रहित रसोई · चक्रीय जैव-ऊर्जा
              </p>
            )}
          </div>

          {/* Lead Paragraph with Delicate 2.5px Warm-Gold Vertical Rule */}
          <div className="flex items-stretch gap-3 max-w-[46ch] pt-0.5">
            <span
              className="w-[2.5px] shrink-0 rounded-full bg-[#C8922A]"
              aria-hidden="true"
            />
            <p
              className={`text-[14.5px] sm:text-[16.5px] lg:text-[17.5px] text-[#1E2F22] leading-[1.6] font-medium ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'सौर ऊर्जा, गोबर से बायोगैस, खेतों के लिए जैव-स्लरी और जिला-स्तरीय CBG व्यवहार्यता की पारदर्शी ग्रामीण पहल।'
                : 'A transparent rural initiative connecting Rajasthan solar power, smokeless cattle-dung biogas, fertile farm bio-slurry, and district CBG feasibility.'}
            </p>
          </div>

          {/* Dual Rounded-Pill CTAs Side-by-Side (Desktop AND Mobile) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onScrollTo('ce-join')}
              className={`spring-btn inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#154A24] hover:bg-[#1B5E2E] text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer whitespace-nowrap ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              <span>{lang === 'hi' ? 'मिशन से जुड़ें' : 'Join This Mission'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('ce-digester')}
              className={`spring-btn inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/95 hover:bg-[#F4F8EE] text-[#154A24] border border-[#154A24]/45 text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              <span>{lang === 'hi' ? 'तकनीक समझें' : 'Understand the Science'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET SEAMLESS WATERCOLOR ARTWORK (FULL-BLEED RIGHT SCENE, ZERO BOX) */}
      <div className="lg:hidden relative w-full mt-1 overflow-hidden select-none">
        <div className="relative w-full aspect-[16/11] sm:aspect-[16/9] overflow-hidden">
          <img
            src={GENERATED_ASSETS.cleanEnergyHeroEditorial}
            alt={
              lang === 'hi'
                ? 'राजस्थान के गाँव में सौर पैनल, बायोगैस डाइजेस्टर गुंबद, जैव-स्लरी खाद और नीम वृक्षों का संपादकीय जलरंग चित्रण'
                : 'Editorial watercolor illustration of Rajasthan village solar panels, brick biogas digester dome, organic slurry bed, and sunlit Neem trees'
            }
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right scale-[1.52] sm:scale-[1.24] origin-right"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-12"
            style={{
              background:
                'linear-gradient(to bottom, #FBFAF6 0%, rgba(251,250,246,0.65) 45%, transparent 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
            style={{
              background: 'linear-gradient(to top, #FBFAF6 0%, transparent 100%)',
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   2. WHY CLEAN RURAL ENERGY MATTERS — 4 GROUND REALITIES
   ============================================================================ */
export function CleanEnergyWhyMatters({ lang }: { lang: Language }) {
  const realities = [
    {
      num: '01',
      titleHi: 'रसोई के धुएँ से परिवार के स्वास्थ्य पर असर',
      titleEn: 'Indoor Kitchen Smoke & Family Health',
      descHi:
        'पारंपरिक चूल्हे में लकड़ी व उपले जलाने से निकलने वाला धुआँ ग्रामीण महिलाओं और बच्चों के फेफड़ों व आँखों को नुकसान पहुँचाता है—साथ ही स्थानीय वृक्ष भी कटते हैं।',
      descEn:
        'Burning firewood and dung cakes indoors exposes rural women and children to chronic smoke while accelerating local tree loss.',
    },
    {
      num: '02',
      titleHi: 'बढ़ते ईंधन व बिजली बिल का ग्रामीण बोझ',
      titleEn: 'Rising Fuel, Diesel & Power Bills',
      descHi:
        'महँगे गैस सिलेंडर, डीज़ल पंप और अनियमित बिजली ग्रामीण परिवारों, किसानों और गौशाला समितियों के मासिक खर्च पर सीधा दबाव डालते हैं।',
      descEn:
        'Escalating cooking gas, diesel irrigation, and electricity costs steadily squeeze village households, farms, and Gaushala budgets.',
    },
    {
      num: '03',
      titleHi: 'खुले गोबर से मीथेन हानि व पोषक तत्वों का नुकसान',
      titleEn: 'Uncaptured Methane & Lost Soil Nutrients',
      descHi:
        'खुले ढेर में सड़ता गोबर वातावरण में मीथेन छोड़ता है और उपले जलाने से जैविक खाद राख बन जाती है। बायोगैस पहले स्वच्छ गैस देती है और फिर बेहतर स्लरी खाद लौटाती है।',
      descEn:
        'Open rotting dung emits methane into the air and burning cakes turns nutrients into ash. Biogas captures fuel first and returns richer bio-slurry to soil.',
    },
    {
      num: '04',
      titleHi: 'बायोगैस बनाम CBG पर ईमानदार तकनीकी स्पष्टता',
      titleEn: 'Honest Technical Clarity: Biogas vs. CBG',
      descHi:
        'ग्रामीण समुदायों को सही वैज्ञानिक जानकारी मिलनी चाहिए कि घरेलू कम-दबाव बायोगैस और वाहन-उपयुक्त उच्च-दबाव CBG एक ही चीज़ नहीं हैं—सुरक्षा सर्वोपरि है।',
      descEn:
        'Communities deserve plain honesty: low-pressure village biogas and purified high-pressure vehicle CBG are distinct engineering systems with strict safety rules.',
    },
  ];

  return (
    <section
      id="ce-why"
      className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="01 · धरातलीय आवश्यकता"
          eyebrowEn="01 · Rural Reality"
          titleHi="स्वच्छ सौर व जैव-ऊर्जा ग्रामीण भारत के लिए क्यों ज़रूरी है?"
          titleEn="Why Decentralized Solar & Bio-Energy Matter in Rural India"
          leadHi="राजस्थान में वर्ष के 300 से अधिक दिन तेज धूप और लाखों स्वदेशी गोवंश हैं—सही विज्ञान से यही दोनों संसाधन गाँव को स्वच्छ ऊर्जा और खेत को उपजाऊ खाद दे सकते हैं।"
          leadEn="Rajasthan enjoys 300+ clear sunny days and vibrant livestock communities—with sound engineering, sunlight and cattle dung can power villages cleanly while restoring farm soils."
          lang={lang}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {realities.map((item) => (
            <article
              key={item.num}
              className="pt-4 border-t-2 border-[#D7C497] space-y-2.5"
            >
              <span className="text-xs font-extrabold tracking-[0.14em] text-[#6B8B2D] tabular-nums">
                {item.num}
              </span>
              <h3
                className={`text-[16px] font-extrabold text-[#144721] leading-snug ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi' ? item.titleHi : item.titleEn}
              </h3>
              <p
                className={`text-[13.5px] text-[#394B3E] leading-[1.7] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi' ? item.descHi : item.descEn}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   3. INTERACTIVE ANAEROBIC BIOGAS DIGESTER CUTAWAY (4 CLICKABLE STAGES)
   ============================================================================ */
interface DigesterStage {
  id: string;
  num: string;
  posClass: string;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  specHi: string;
  specEn: string;
}

const DIGESTER_STAGES: DigesterStage[] = [
  {
    id: 'inlet',
    num: '01',
    posClass: 'top-[32%] left-[18%]',
    titleHi: 'गोबर-जल मिश्रण टैंक (Inlet Mixing Chamber)',
    titleEn: 'Dung & Water Mixing Inlet Tank',
    summaryHi:
      'ताज़ा गोबर और पानी को लगभग 1:1 के अनुपात में घोलकर ढलानदार पाइप के माध्यम से भूमिगत कक्ष में भेजा जाता है, जिससे ठोस गांठें नहीं बनतीं और पाचन सुचारू रहता है।',
    summaryEn:
      'Fresh cattle dung and water are blended in roughly a 1:1 ratio and fed smoothly down an angled inlet pipe into the sealed underground digester.',
    specHi: 'अनुपात: ~10 किग्रा गोबर + 10 लीटर पानी प्रति वयस्क गोवंश/दिन',
    specEn: 'Typical feed: ~10 kg fresh dung + 10 L water per adult cow/day',
  },
  {
    id: 'dome',
    num: '02',
    posClass: 'top-[47%] left-[50%]',
    titleHi: 'भूमिगत अवायवीय गुंबद (Anaerobic Dome Chamber)',
    titleEn: 'Sealed Anaerobic Digester Dome',
    summaryHi:
      'ऑक्सीजन-रहित बंद ईंट-प्लास्टर गुंबद में प्राकृतिक जीवाणु 30–40 दिनों में गोबर को विघटित कर 55–60% मीथेन युक्त स्वच्छ बायोगैस बनाते हैं, जो गुंबद के ऊपरी हिस्से में एकत्र होती है।',
    summaryEn:
      'Inside the airtight underground dome, natural anaerobic bacteria digest slurry over 30–40 days, releasing 55–60% methane biogas that collects cleanly beneath the crown.',
    specHi: 'भूमिगत डिज़ाइन राजस्थान की तीव्र गर्मी व सर्दी में स्थिर तापमान रखता है',
    specEn: 'Underground masonry buffers desert heat and winter nights cleanly',
  },
  {
    id: 'burner',
    num: '03',
    posClass: 'top-[22%] left-[76%]',
    titleHi: 'कम दबाव पाइप व धुआँ-रहित नीली लौ (Biogas Cookstove)',
    titleEn: 'Low-Pressure Pipe & Clean Blue Cooking Flame',
    summaryHi:
      'गुंबद के शीर्ष वाल्व से कम दबाव पाइप द्वारा गैस सीधे रसोई के विशेष बायोगैस बर्नर तक पहुँचती है—जो बिना धुएँ और बिना कालिख के स्वच्छ नीली लौ से भोजन पकाती है।',
    summaryEn:
      'A brass crown valve channels low-pressure gas straight to a dedicated biogas stove, burning with a soot-free, smokeless blue flame for rural homes or Gaushala kitchens.',
    specHi: 'केवल प्रमाणित बायोगैस बर्नर व वाटर-ट्रैप के साथ सुरक्षित उपयोग',
    specEn: 'Operates strictly at low pressure with dedicated biogas stoves & traps',
  },
  {
    id: 'slurry',
    num: '04',
    posClass: 'top-[57%] left-[84%]',
    titleHi: 'पोषक जैव-स्लरी आउटलेट (Nutrient-Rich Bio-Slurry)',
    titleEn: 'Nutrient-Rich Organic Bio-Slurry Outlet',
    summaryHi:
      'गैस बनने के बाद विस्थापन टैंक से बाहर निकलने वाली पकी हुई जैव-स्लरी खरपतवार-बीज से मुक्त होती है और नाइट्रोजन, सूक्ष्म पोषक तत्वों व जैविक कार्बन से भरपूर होती है—जो सीधे खेतों व वर्मीकम्पोस्ट को समृद्ध करती है।',
    summaryEn:
      'Digested bio-slurry exiting the displacement tank is virtually weed-seed free and rich in bio-available nitrogen and humus—ideal for direct farm channels or enriched vermicompost.',
    specHi: 'ऊर्जा निकलने के बाद भी खाद की गुणवत्ता कच्चे गोबर से अधिक बेहतर रहती है',
    specEn: 'Retains full NPK and organic carbon while delivering clean cooking fuel first',
  },
];

export function CleanEnergyDigesterSection({ lang }: { lang: Language }) {
  const [activeId, setActiveId] = useState<string>(DIGESTER_STAGES[1].id);
  const activeStage =
    DIGESTER_STAGES.find((item) => item.id === activeId) ?? DIGESTER_STAGES[0];

  return (
    <section
      id="ce-digester"
      className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20 border-b border-[#E8DFC8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <OrganicEditorialHeading
          eyebrowHi="02 · बायोगैस का विज्ञान"
          eyebrowEn="02 · Inside an Anaerobic Digester"
          titleHi="एक ही गोबर से स्वच्छ गैस और उत्तम खाद कैसे बनती है?"
          titleEn="How One Digester Delivers Both Clean Gas & Fertile Slurry"
          taglineHi="गोबर-जल मिश्रण → बंद अवायवीय पाचन → धुआँ-रहित नीली लौ + खेतों के लिए समृद्ध जैव-स्लरी।"
          taglineEn="Dung & water inlet → airtight anaerobic dome → smokeless blue flame + nutrient-rich bio-slurry."
          lang={lang}
          align="center"
        />

        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden">
            <img
              src={GENERATED_ASSETS.cleanEnergyDigesterCutaway}
              alt={
                lang === 'hi'
                  ? 'बायोगैस डाइजेस्टर के आंतरिक भाग, गैस बुलबुले, नीली रसोई लौ और जैव-स्लरी का वैज्ञानिक जलरंग चित्रण'
                  : 'Scientific editorial watercolor cutaway of fixed-dome anaerobic biogas digester showing inlet tank, gas dome, clean blue stove flame, and bio-slurry outlet'
              }
              referrerPolicy="no-referrer"
              className="w-full h-auto block select-none"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, #FBFAF6 0%, transparent 9%, transparent 88%, #FBFAF6 100%), linear-gradient(to right, #FBFAF6 0%, transparent 6%, transparent 94%, #FBFAF6 100%)',
              }}
            />

            {/* Interactive Hotspots on Tablet/Desktop */}
            <div className="hidden sm:block">
              {DIGESTER_STAGES.map((stage) => {
                const isSelected = stage.id === activeStage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveId(stage.id)}
                    aria-pressed={isSelected}
                    aria-label={
                      lang === 'hi'
                        ? `${stage.num}: ${stage.titleHi}`
                        : `${stage.num}: ${stage.titleEn}`
                    }
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all cursor-pointer shadow-md ${
                      stage.posClass
                    } ${
                      isSelected
                        ? 'bg-[#154A24] text-[#E6F8B2] ring-4 ring-[#C8922A]/50 scale-110'
                        : 'bg-[#FBFAF6]/95 text-[#154A24] border-2 border-[#C8922A] hover:scale-105'
                    }`}
                  >
                    {stage.num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage Selector Tabs + Active Detail Panel */}
          <div className="mt-6 space-y-5">
            <div
              role="tablist"
              aria-label={
                lang === 'hi'
                  ? 'बायोगैस डाइजेस्टर के 4 मुख्य चरण'
                  : 'Four stages inside a biogas digester'
              }
              className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
            >
              {DIGESTER_STAGES.map((stage) => {
                const isSelected = stage.id === activeStage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveId(stage.id)}
                    className={`text-left px-3.5 py-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#154A24] text-white border-[#154A24] shadow-sm'
                        : 'bg-white/90 text-[#1A4224] border-[#E0D4B6] hover:border-[#6F9C33]'
                    }`}
                  >
                    <span
                      className={`block text-[11px] font-bold tracking-[0.14em] tabular-nums ${
                        isSelected ? 'text-[#D6F598]' : 'text-[#8C6A23]'
                      }`}
                    >
                      {stage.num}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs sm:text-[13.5px] font-bold leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? stage.titleHi : stage.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              className="border-t-2 border-b border-[#D7C497] bg-white/85 px-5 sm:px-7 py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.12em] uppercase text-[#5E8226]">
                  <Flame className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? `चरण ${activeStage.num} · वैज्ञानिक कार्यप्रणाली`
                      : `Stage ${activeStage.num} · Process Insight`}
                  </span>
                </div>
                <h3
                  className={`text-lg sm:text-xl font-extrabold text-[#144721] ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {lang === 'hi' ? activeStage.titleHi : activeStage.titleEn}
                </h3>
                <p
                  className={`text-sm text-[#324537] leading-[1.7] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? activeStage.summaryHi : activeStage.summaryEn}
                </p>
              </div>
              <div className="md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-[#DFCFAF] pt-3 md:pt-1 md:pl-5">
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C6A23]">
                  {lang === 'hi' ? 'व्यावहारिक मानक' : 'Field Benchmark'}
                </span>
                <p
                  className={`mt-1 text-xs sm:text-[13.5px] font-semibold text-[#154A24] leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? activeStage.specHi : activeStage.specEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   4. DECENTRALIZED RURAL SOLAR POWER IN RAJASTHAN
   ============================================================================ */
export function CleanEnergySolarSection({ lang }: { lang: Language }) {
  const solarApps = [
    {
      icon: Sun,
      num: '01',
      titleHi: 'गौशाला व चारा कटर हेतु रूफटॉप सोलर',
      titleEn: 'Gaushala & Chaff-Cutter Rooftop Solar',
      descHi:
        'गौशाला शेड की छत पर सौर पैनल लगाकर प्रकाश, पानी की मोटर, पंखे और चारा काटने की मशीन को कम बिजली खर्च पर चलाया जा सकता है।',
      descEn:
        'Mounting solar panels atop cattle shelters powers lighting, water pumping, ventilation, and green-fodder chaff cutters cleanly.',
    },
    {
      icon: Zap,
      num: '02',
      titleHi: 'सौर सिंचाई पंप एवं वर्षा कुंड एकीकरण',
      titleEn: 'Solar Drip Pumping & Rainwater Kunds',
      descHi:
        'दिन के समय सीधे सूर्य से चलने वाले सौर पंपों को ड्रिप सिंचाई और फार्म-पॉन्ड से जोड़कर किसानों का डीज़ल खर्च और रात्रि सिंचाई संकट घटता है।',
      descEn:
        'Daytime solar water pumps paired with farm ponds and drip lines replace costly diesel and eliminate night-time irrigation risk.',
    },
    {
      icon: Users,
      num: '03',
      titleHi: 'ग्राम कौशल केंद्र, स्कूल व SHG कार्यशाला',
      titleEn: 'Village Skill Labs, Schools & SHG Rooms',
      descHi:
        'ग्रामीण प्रशिक्षण केंद्रों, सिलाई इकाइयों और डिजिटल कक्षाओं में विश्वसनीय सौर बैकअप से प्रशिक्षण बिना रुकावट चलता है।',
      descEn:
        'Reliable micro-solar keeps village computer classrooms, women SHG tailoring units, and evening study spaces running steadily.',
    },
    {
      icon: Leaf,
      num: '04',
      titleHi: 'स्वच्छ सोलर स्ट्रीट लाइट एवं सामुदायिक सुरक्षा',
      titleEn: 'Community Solar Street Lighting',
      descHi:
        'गाँव की गलियों, पारंपरिक बावड़ियों, कुंडों और पंचायत परिसरों में कम रखरखाव वाली सौर लाइटिंग स्वच्छ और सुरक्षित सामुदायिक जीवन देती है।',
      descEn:
        'Low-maintenance solar lamps along village lanes, stepwells, and Gaushala gates enhance evening safety with zero recurring grid bills.',
    },
  ];

  return (
    <section
      id="ce-solar"
      className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="03 · विकेंद्रीकृत ग्रामीण सौर ऊर्जा"
          eyebrowEn="03 · Decentralized Rural Solar"
          titleHi="राजस्थान की धूप से खेत, गौशाला और ग्राम परिसर को स्वच्छ शक्ति"
          titleEn="Harnessing Rajasthan Sunlight for Farms, Gaushalas & Village Spaces"
          leadHi="वर्ष में 300+ स्वच्छ धूप वाले दिनों के साथ राजस्थान में विकेंद्रीकृत सौर ऊर्जा—विशेषकर सिंचाई, गौशाला संचालन और ग्राम कौशल केंद्रों के लिए—सबसे व्यावहारिक ऊर्जा आधार है।"
          leadEn="With 300+ sunlit days each year, decentralized solar energy offers Rajasthan’s most practical clean power foundation for irrigation, Gaushalas, and rural training hubs."
          lang={lang}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 relative">
            <img
              src={GENERATED_ASSETS.cleanEnergySolarMicrogrid}
              alt={
                lang === 'hi'
                  ? 'सोलर परगोला, वर्षा जल कुंड, सौर सिंचाई पंप, गौशाला छत और सोलर स्ट्रीट लाइट का संपादकीय जलरंग दृश्य'
                  : 'Editorial watercolor view of a Rajasthan solar pergola beside a stone rainwater kund, solar irrigation pump, village hall rooftops, and solar street lamps'
              }
              referrerPolicy="no-referrer"
              className="w-full h-auto block select-none"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, #FFFFFF 0%, transparent 8%, transparent 90%, #FFFFFF 100%), linear-gradient(to right, #FFFFFF 0%, transparent 6%, transparent 94%, #FFFFFF 100%)',
              }}
            />
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {solarApps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="pt-4 border-t border-[#DFCFAF] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F3F7EC] text-[#154A24] border border-[#D8E5C5]">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-extrabold text-[#8C6A23] tabular-nums">
                      {item.num}
                    </span>
                  </div>
                  <h3
                    className={`text-[15.5px] font-extrabold text-[#144721] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {lang === 'hi' ? item.titleHi : item.titleEn}
                  </h3>
                  <p
                    className={`text-[13px] text-[#3B4D40] leading-[1.68] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? item.descHi : item.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   5. BIOGAS VS. COMPRESSED BIOGAS (CBG) — CLEAR TECHNICAL COMPARISON
   Enforces mandatory honest technical distinction & proposed CBG status.
   ============================================================================ */
export function CleanEnergyBiogasVsCbgSection({ lang }: { lang: Language }) {
  const rows = [
    {
      labelHi: 'मुख्य उपयोग (Primary Use)',
      labelEn: 'Primary Application',
      biogasHi: 'घरेलू व गौशाला रसोई, जल तापन, छोटा बायोगैस जेनसेट',
      biogasEn: 'Household & Gaushala kitchens, water heating, small gensets',
      cbgHi: 'वाहन ईंधन (Bio-CNG), वाणिज्यिक/औद्योगिक गैस नेटवर्क आपूर्ति',
      cbgEn: 'Vehicle transport fuel (Bio-CNG), industrial & city gas networks',
    },
    {
      labelHi: 'मीथेन शुद्धता (Methane Purity)',
      labelEn: 'Methane Composition',
      biogasHi: 'लगभग 55–60% मीथेन (कच्ची गैस; CO₂ व नमी सहित)',
      biogasEn: '~55–60% CH₄ (raw unpurified gas containing CO₂ & moisture)',
      cbgHi: '90%+ शुद्ध मीथेन (CO₂, H₂S व नमी हटाने हेतु औद्योगिक स्क्रबिंग अनिवार्य)',
      cbgEn: '>90% pure CH₄ (requires industrial scrubbing of CO₂, H₂S & moisture)',
    },
    {
      labelHi: 'दबाव व भंडारण (Pressure & Safety)',
      labelEn: 'Operating Pressure & Safety',
      biogasHi: 'अत्यंत कम दबाव — सीधे पाइप से विशेष बायोगैस चूल्हे में उपयोग',
      biogasEn: 'Very low pressure — piped straight into dedicated biogas burners',
      cbgHi: 'उच्च दबाव संपीड़न (~200–250 bar) — केवल प्रमाणित CNG सिलेंडर व PESO स्वीकृति',
      cbgEn: 'High-pressure compression (~200–250 bar) — PESO-certified vessels only',
    },
    {
      labelHi: 'आवश्यक गोबर पैमाना (Feedstock Scale)',
      labelEn: 'Minimum Feedstock Scale',
      biogasHi: '2–5 पशु (घरेलू) से लेकर 50–250 पशु (गौशाला इकाई)',
      biogasEn: '2–5 cattle (household) up to 50–250 cattle (Gaushala plant)',
      cbgHi: 'कम से कम 10–20+ टन गोबर/जैव-अवशेष प्रतिदिन (बहु-ग्राम जिला क्लस्टर)',
      cbgEn: 'Typically 10–20+ tonnes feedstock/day (multi-village district cluster)',
    },
    {
      labelHi: 'वर्तमान स्थिति (GOVEDA Status)',
      labelEn: 'Current GOVEDA Status',
      biogasHi: 'सक्रिय जागरूकता, गौशाला मॉडलिंग एवं तकनीकी मार्गदर्शन',
      biogasEn: 'Active awareness, Gaushala planning & field orientation',
      cbgHi: 'प्रस्तावित एवं व्यवहार्यता अध्ययनाधीन (Feasibility / DPR Stage)',
      cbgEn: 'Proposed & under feasibility/engineering study (not yet commissioned)',
    },
  ];

  return (
    <section
      id="ce-cbg"
      className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20 border-b border-[#E8DFC8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <OrganicEditorialHeading
          eyebrowHi="04 · तकनीकी स्पष्टता एवं सुरक्षा"
          eyebrowEn="04 · Technical Clarity & Safety"
          titleHi="ग्रामीण बायोगैस बनाम जिला-स्तरीय बायो-CNG (CBG) — स्पष्ट अंतर"
          titleEn="Village Biogas vs. District-Level Bio-CNG (CBG) — Clear Distinction"
          taglineHi="घरेलू बायोगैस और वाहन-उपयुक्त CBG एक ही उत्पाद नहीं हैं—दोनों के पैमाने, शुद्धिकरण और सुरक्षा नियम अलग हैं।"
          taglineEn="Raw village biogas and vehicle-grade CBG are distinct engineering tiers with separate purification and safety norms."
          lang={lang}
          align="center"
        />

        {/* Seamless Left-to-Right Visual Comparison Panorama */}
        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <img
            src={GENERATED_ASSETS.cleanEnergyBiogasVsCbgFlow}
            alt={
              lang === 'hi'
                ? 'बाईं ओर ग्रामीण गौशाला बायोगैस इकाई और दाईं ओर प्रस्तावित जिला-स्तरीय CBG शुद्धिकरण व संपीड़न संयंत्र का तुलनात्मक जलरंग चित्रण'
                : 'Editorial watercolor comparison showing village Gaushala biogas dome and kitchen on the left versus an orderly district-scale CBG purification and compression facility on the right'
            }
            referrerPolicy="no-referrer"
            className="w-full h-auto block select-none"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, #FBFAF6 0%, transparent 9%, transparent 88%, #FBFAF6 100%), linear-gradient(to right, #FBFAF6 0%, transparent 5%, transparent 95%, #FBFAF6 100%)',
            }}
          />
        </div>

        {/* Clean Responsive Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#DFCFAF] bg-white">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#DFCFAF] bg-[#F6F4EC]">
                <th className="py-3.5 px-5 text-xs font-extrabold uppercase tracking-wider text-[#5A6D5E] w-[24%]">
                  {lang === 'hi' ? 'तकनीकी मानदंड' : 'Engineering Parameter'}
                </th>
                <th className="py-3.5 px-5 text-xs sm:text-sm font-extrabold text-[#144721] w-[38%]">
                  {lang === 'hi'
                    ? 'कच्ची बायोगैस (घरेलू / गौशाला स्तर)'
                    : 'Raw Biogas (Household / Gaushala Scale)'}
                </th>
                <th className="py-3.5 px-5 text-xs sm:text-sm font-extrabold text-[#5E4A18] w-[38%]">
                  {lang === 'hi'
                    ? 'बायो-CNG / CBG (प्रस्तावित जिला क्लस्टर स्तर)'
                    : 'Bio-CNG / CBG (Proposed District Cluster Scale)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE4CE]">
              {rows.map((r) => (
                <tr key={r.labelEn} className="align-top">
                  <td
                    className={`py-3.5 px-5 text-xs sm:text-[13px] font-bold text-[#144721] bg-[#FCFBF7] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? r.labelHi : r.labelEn}
                  </td>
                  <td
                    className={`py-3.5 px-5 text-xs sm:text-[13.5px] text-[#2F4334] leading-relaxed ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? r.biogasHi : r.biogasEn}
                  </td>
                  <td
                    className={`py-3.5 px-5 text-xs sm:text-[13.5px] text-[#453B24] leading-relaxed ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? r.cbgHi : r.cbgEn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   6. CIRCULAR SLURRY LOOP + INTERACTIVE CLEAN ENERGY FEASIBILITY ESTIMATOR
   Uses pure tested logic from `/src/utils/cleanEnergyLogic.ts`
   ============================================================================ */
export function CleanEnergySlurryCircleAndEstimator({
  lang,
  onNavigate,
}: {
  lang: Language;
  onNavigate: (path: string) => void;
}) {
  const [cattleCount, setCattleCount] = useState<number>(40);
  const [solarKw, setSolarKw] = useState<number>(3);
  const [goal, setGoal] = useState<CleanEnergyGoal>('gaushala');

  const estimate = calculateCleanEnergyFeasibility({
    cattleCount,
    solarKw,
    goal,
  });

  const goals: { id: CleanEnergyGoal; hi: string; en: string }[] = [
    { id: 'household', hi: 'घरेलू रसोई बायोगैस', en: 'Household Biogas' },
    { id: 'gaushala', hi: 'आत्मनिर्भर गौशाला इकाई', en: 'Gaushala Self-Reliance' },
    { id: 'district-cbg', hi: 'जिला CBG क्लस्टर व्यवहार्यता', en: 'District CBG Feasibility' },
  ];

  const missionLinks = [
    {
      path: '/missions/self-reliant-gaushala',
      hi: 'आत्मनिर्भर गौशाला मिशन',
      en: 'Self-Reliant Gaushala',
    },
    {
      path: '/missions/organic-farming',
      hi: 'जैविक खेती व जैव-स्लरी',
      en: 'Organic Farming & Bio-Slurry',
    },
    {
      path: '/missions/carbon-credit',
      hi: 'कार्बन क्रेडिट व मीथेन कमी',
      en: 'Carbon Credit & Methane Reduction',
    },
  ];

  return (
    <section
      id="ce-estimator"
      className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="05 · चक्रीय जैव-स्लरी एवं व्यवहार्यता अनुमान"
          eyebrowEn="05 · Circular Bio-Slurry & Feasibility Tool"
          titleHi="गौशाला से रसोई और खेत तक — स्वच्छ ऊर्जा व्यवहार्यता अनुमानक"
          titleEn="From Gaushala to Kitchen & Fields — Clean Energy Feasibility Estimator"
          leadHi="अपनी गौशाला, किसान समूह या जिला क्लस्टर में उपलब्ध पशुधन संख्या और सौर क्षमता के आधार पर दैनिक गोबर, अनुमानित बायोगैस, जैव-स्लरी खाद और उपयुक्त संयंत्र स्तर की प्रारंभिक गणना देखें।"
          leadEn="Estimate conservative daily cattle dung, raw biogas yield, organic bio-slurry fertiliser, Rajasthan rooftop solar kWh, and the right engineering tier for your household, Gaushala, or district cluster."
          lang={lang}
        />

        {/* Seamless Circular Bio-Energy Panorama */}
        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <img
            src={GENERATED_ASSETS.cleanEnergySlurryCircle}
            alt={
              lang === 'hi'
                ? 'स्वदेशी गौशाला, बायोगैस गुंबद, जैव-स्लरी खाद बेड, हरे चारे के खेत और धुआँ-रहित रसोई में भोजन पकाती ग्रामीण महिला का जलरंग दृश्य'
                : 'Editorial watercolor panorama connecting indigenous Gaushala cattle, biogas dome, bio-slurry beds, lush green fodder fields, and a smokeless rural kitchen'
            }
            referrerPolicy="no-referrer"
            className="w-full h-auto block select-none"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, #FFFFFF 0%, transparent 9%, transparent 88%, #FFFFFF 100%), linear-gradient(to right, #FFFFFF 0%, transparent 5%, transparent 95%, #FFFFFF 100%)',
            }}
          />
        </div>

        {/* Interactive Estimator Workspace */}
        <div className="rounded-3xl bg-[#FBFAF6] border border-[#DFCFAF] p-5 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E3D7BA] pb-5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8C6A23]">
                {lang === 'hi'
                  ? 'इंटरएक्टिव प्रारंभिक मूल्यांकन टूल'
                  : 'Interactive Preliminary Assessment Tool'}
              </span>
              <h3
                className={`mt-1 text-xl sm:text-2xl font-extrabold text-[#144721] ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi'
                  ? 'सौर, बायोगैस एवं CBG व्यवहार्यता अनुमानक'
                  : 'Solar, Biogas & CBG Feasibility Estimator'}
              </h3>
            </div>
            <p
              className={`text-xs text-[#546657] max-w-md ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'नोट: यह रूढ़िवादी (Conservative) शैक्षणिक अनुमान है; वास्तविक डिज़ाइन हेतु साइट-सर्वे और प्रमाणित इंजीनियरिंग DPR आवश्यक है।'
                : 'Note: Conservative orientation model only; real sizing requires an on-site survey and certified engineering DPR.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT CONTROLS */}
            <div className="lg:col-span-5 space-y-6">
              {/* Goal Selector */}
              <fieldset className="space-y-2.5">
                <legend
                  className={`text-sm font-bold text-[#144721] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? 'प्रमुख उद्देश्य चुनें' : 'Select Primary Objective'}
                </legend>
                <div className="grid grid-cols-1 gap-2">
                  {goals.map((g) => {
                    const active = goal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setGoal(g.id);
                          if (g.id === 'household' && cattleCount > 15) setCattleCount(6);
                          if (g.id === 'gaushala' && (cattleCount < 20 || cattleCount > 300)) {
                            setCattleCount(80);
                          }
                          if (g.id === 'district-cbg' && cattleCount < 200) setCattleCount(1200);
                        }}
                        aria-pressed={active}
                        className={`text-left px-4 py-2.5 rounded-xl border text-xs sm:text-[13.5px] font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          active
                            ? 'bg-[#154A24] text-white border-[#154A24]'
                            : 'bg-white text-[#23412B] border-[#DFCFAF] hover:border-[#6F9C33]'
                        } ${lang === 'hi' ? 'font-hindi' : ''}`}
                      >
                        <span>{lang === 'hi' ? g.hi : g.en}</span>
                        {active && (
                          <CheckCircle2
                            className="w-4 h-4 text-[#C6F28E] shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Cattle Count Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ce-cattle-range"
                    className={`text-sm font-bold text-[#144721] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? 'उपलब्ध वयस्क गोवंश संख्या' : 'Available Adult Cattle Count'}
                  </label>
                  <span
                    data-testid="ce-cattle-value"
                    className="px-3 py-1 rounded-full bg-[#154A24] text-[#DDF7A4] text-xs font-extrabold tabular-nums"
                  >
                    {estimate.cattleCount.toLocaleString('en-IN')}{' '}
                    {lang === 'hi' ? 'गोवंश' : 'cattle'}
                  </span>
                </div>
                <input
                  id="ce-cattle-range"
                  type="range"
                  min={2}
                  max={1500}
                  step={2}
                  value={cattleCount}
                  onChange={(e) => setCattleCount(Number(e.target.value))}
                  className="w-full accent-[#154A24] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5B6D5F] tabular-nums">
                  <span>2</span>
                  <span>100</span>
                  <span>500</span>
                  <span>1,500</span>
                </div>
              </div>

              {/* Rooftop Solar kW Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ce-solar-range"
                    className={`text-sm font-bold text-[#144721] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? 'रूफटॉप सौर पैनल क्षमता (kW)' : 'Rooftop Solar Capacity (kW)'}
                  </label>
                  <span
                    data-testid="ce-solar-value"
                    className="px-3 py-1 rounded-full bg-[#EEF5E4] text-[#154A24] border border-[#CFE0B8] text-xs font-extrabold tabular-nums"
                  >
                    {estimate.solarKw} kW
                  </span>
                </div>
                <input
                  id="ce-solar-range"
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={solarKw}
                  onChange={(e) => setSolarKw(Number(e.target.value))}
                  className="w-full accent-[#C8922A] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5B6D5F] tabular-nums">
                  <span>0 kW</span>
                  <span>5 kW</span>
                  <span>15 kW</span>
                  <span>25 kW</span>
                </div>
              </div>
            </div>

            {/* RIGHT LIVE ESTIMATES */}
            <div className="lg:col-span-7 space-y-5" data-testid="ce-estimator-results">
              {/* 4 Key Conservative Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'दैनिक ताज़ा गोबर' : 'Daily Fresh Dung'}
                  </span>
                  <span
                    data-testid="ce-dung-kg"
                    className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums"
                  >
                    {estimate.dailyDungKg.toLocaleString('en-IN')} kg
                  </span>
                  <span className="text-[11px] text-[#5B6D5F]">
                    {lang === 'hi' ? 'प्रतिदिन (अनुमानित)' : 'per day (est.)'}
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'कच्ची बायोगैस उत्पादन' : 'Raw Biogas Yield'}
                  </span>
                  <span
                    data-testid="ce-biogas-m3"
                    className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums"
                  >
                    {estimate.dailyRawBiogasM3.toLocaleString('en-IN')} m³
                  </span>
                  <span className="text-[11px] font-semibold text-[#7A5D1F] tabular-nums">
                    ≈ {estimate.monthlyLpgEquivCylinders}{' '}
                    {lang === 'hi' ? 'LPG समतुल्य/माह' : 'LPG equiv/mo'}
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'जैव-स्लरी खाद' : 'Organic Bio-Slurry'}
                  </span>
                  <span
                    data-testid="ce-slurry-kg"
                    className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums"
                  >
                    {estimate.monthlyOrganicSlurryKg.toLocaleString('en-IN')} kg
                  </span>
                  <span className="text-[11px] text-[#5B6D5F]">
                    {lang === 'hi' ? 'प्रति माह (खेतों हेतु)' : 'per month (for soil)'}
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'राजस्थान सौर ऊर्जा' : 'Rajasthan Solar PV'}
                  </span>
                  <span
                    data-testid="ce-solar-kwh"
                    className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums"
                  >
                    {estimate.monthlySolarUnitsKwh.toLocaleString('en-IN')} kWh
                  </span>
                  <span className="text-[11px] text-[#5B6D5F]">
                    {lang === 'hi' ? 'यूनिट/माह (अनुमानित)' : 'units/mo (indicative)'}
                  </span>
                </div>
              </div>

              {/* Recommended Tier & Honest Technical Guidance */}
              <div className="rounded-2xl bg-white border border-[#D7C497] p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#5E8226]">
                  <Gauge className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {lang === 'hi' ? 'उपयुक्त संयंत्र श्रेणी' : 'Recommended Engineering Tier'}
                  </span>
                </div>
                <h4
                  data-testid="ce-recommended-scale"
                  className={`text-base sm:text-lg font-extrabold text-[#144721] ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {lang === 'hi' ? estimate.recommendedScaleHi : estimate.recommendedScaleEn}
                </h4>
                <p
                  className={`text-xs sm:text-[13.5px] text-[#35483A] leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? estimate.technicalNoteHi : estimate.technicalNoteEn}
                </p>
              </div>

              {/* Connected Mission Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-[#5B6D5F]">
                  {lang === 'hi' ? 'जुड़े मिशन:' : 'Linked Missions:'}
                </span>
                {missionLinks.map((m) => (
                  <button
                    key={m.path}
                    type="button"
                    onClick={() => onNavigate(m.path)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D7C497] text-[#154A24] hover:bg-[#154A24] hover:text-white text-xs font-semibold transition-colors cursor-pointer ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    <span>{lang === 'hi' ? m.hi : m.en}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   7. GOVEDA'S ROLE, MANDATORY TECHNICAL SAFETY DISCLOSURE & 10 MODULES (A–J)
   ============================================================================ */
export function CleanEnergyGovedaRoleAndModules({ lang }: { lang: Language }) {
  const mission = MISSIONS_DATA.find((m) => m.slug === 'biogas-cbg');
  const modules = mission?.subpages ?? [];

  const roles = [
    {
      icon: Users,
      titleHi: 'गौशाला एवं ग्राम क्लस्टर गोबर मानचित्रण',
      titleEn: 'Gaushala & Village Feedstock Mapping',
      descHi:
        'जिला-स्तर पर गौशालाओं और पशुपालक समूहों की दैनिक गोबर उपलब्धता, जल स्रोत और स्थानीय ऊर्जा आवश्यकता का यथार्थवादी सर्वेक्षण।',
      descEn:
        'Realistic district assessment of daily dung availability, water access, and rural energy demand across Gaushalas and livestock clusters.',
    },
    {
      icon: Wrench,
      titleHi: 'प्रमाणित तकनीक व इंजीनियरिंग साझेदारी',
      titleEn: 'Accredited Clean-Tech Partnerships',
      descHi:
        'घरेलू/गौशाला बायोगैस, रूफटॉप सोलर और प्रस्तावित CBG व्यवहार्यता अध्ययन हेतु प्रमाणित तकनीकी संस्थानों व इंजीनियरिंग साझेदारों से समन्वय।',
      descEn:
        'Coordinating with accredited solar, biogas, and CBG engineering specialists for safe design, maintenance training, and formal feasibility studies.',
    },
    {
      icon: Sprout,
      titleHi: 'जैव-स्लरी से जैविक खेती एकीकरण',
      titleEn: 'Bio-Slurry to Organic Farm Integration',
      descHi:
        'बायोगैस संयंत्र से प्राप्त पोषक जैव-स्लरी को स्थानीय किसानों की वर्मीकम्पोस्ट इकाइयों और खेतों तक पहुँचाने का चक्रीय मॉडल।',
      descEn:
        'Connecting digested organic bio-slurry directly to surrounding farmers and vermicompost units so clean energy strengthens soil carbon.',
    },
  ];

  const safetyPoints = [
    {
      hi: 'कच्ची बायोगैस और वाहन-उपयुक्त CBG (Bio-CNG) एक ही उत्पाद नहीं हैं। CBG के लिए 90%+ मीथेन शुद्धिकरण, उच्च-दबाव संपीड़न और PESO सहित वैधानिक सुरक्षा स्वीकृतियाँ अनिवार्य हैं।',
      en: 'Raw biogas and vehicle-grade CBG are not the same product. CBG requires >90% methane purification, high-pressure compression, and statutory PESO safety approvals.',
    },
    {
      hi: 'घरेलू LPG सिलेंडर में कच्ची बायोगैस या CBG भरने का प्रयास पूर्णतः असुरक्षित एवं प्रतिबंधित है—घरेलू बायोगैस का उपयोग केवल कम-दबाव पाइप व विशेष बायोगैस चूल्हे में ही किया जाता है।',
      en: 'Standard domestic LPG cylinders must NEVER be filled with raw biogas or CBG. Household biogas is strictly piped at low pressure into dedicated biogas stoves.',
    },
    {
      hi: 'GOVEDA के जिला-स्तरीय CBG क्लस्टर वर्तमान में प्रस्तावित एवं व्यवहार्यता अध्ययन (Feasibility / DPR) चरण में हैं; हम किसी निश्चित व्यावसायिक आय या गारंटीकृत सब्सिडी का दावा नहीं करते।',
      en: 'District-scale CBG clusters under GOVEDA are currently at the proposed / feasibility-study stage; no guaranteed revenue or automatic subsidy approvals are claimed.',
    },
  ];

  return (
    <section
      id="ce-modules"
      className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20 border-b border-[#E8DFC8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="06 · GOVEDA की भूमिका एवं 10 कार्य मॉड्यूल"
          eyebrowEn="06 · GOVEDA’s Role & 10 Structured Modules"
          titleHi="व्यावहारिक समन्वय, सुरक्षा नीति एवं 10 कार्यक्रम मॉड्यूल"
          titleEn="Practical Coordination, Safety Policy & All 10 Modules (A–J)"
          lang={lang}
        />

        {/* 3 Grounded Roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.titleEn}
                className="rounded-2xl bg-white border border-[#E2D6BA] p-5 sm:p-6 space-y-3"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EEF5E4] text-[#154A24] border border-[#D4E4BF]">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h3
                  className={`text-base font-extrabold text-[#144721] ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {lang === 'hi' ? r.titleHi : r.titleEn}
                </h3>
                <p
                  className={`text-xs sm:text-[13.5px] text-[#3B4D40] leading-[1.7] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? r.descHi : r.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mandatory Technical & Safety Disclosure Box */}
        <div className="rounded-2xl bg-[#FFF9EE] border border-[#D99B38]/45 p-5 sm:p-7 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldAlert
              className="w-5 h-5 text-[#9C5C0A] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <h3
              className={`text-sm sm:text-base font-extrabold text-[#6E3D04] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'अनिवार्य तकनीकी एवं सुरक्षा स्पष्टीकरण (Mandatory Technical Clarification)'
                : 'Mandatory Technical & Safety Clarification'}
            </h3>
          </div>
          <ul className="space-y-2 pl-8 list-disc text-xs sm:text-[13.5px] text-[#5B3B12] leading-relaxed">
            {safetyPoints.map((pt, idx) => (
              <li key={idx} className={lang === 'hi' ? 'font-hindi' : ''}>
                {lang === 'hi' ? pt.hi : pt.en}
              </li>
            ))}
          </ul>
        </div>

        {/* All 10 Structured Modules (A–J) */}
        {modules.length > 0 && (
          <div className="space-y-4">
            <h3
              className={`text-lg sm:text-xl font-extrabold text-[#144721] ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi'
                ? 'स्वच्छ ऊर्जा मिशन के 10 मुख्य घटक (Modules A–J)'
                : 'Ten Structured Clean Energy Modules (A–J)'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {modules.map((mod) => (
                <div
                  key={mod.code}
                  className="pt-3.5 border-t border-[#D7C497] bg-white/80 rounded-b-xl px-3.5 pb-4 space-y-1.5"
                >
                  <span className="inline-block text-[11px] font-extrabold tracking-[0.14em] text-[#7A5D1F]">
                    MODULE {mod.code}
                  </span>
                  <h4
                    className={`text-sm font-bold text-[#144721] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? mod.title.hi : mod.title.en}
                  </h4>
                  <p
                    className={`text-xs text-[#415346] leading-relaxed ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? mod.summary.hi : mod.summary.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
