import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Leaf,
  ShieldAlert,
  Sprout,
  Sun,
  Trees,
  Users,
  Wheat,
} from 'lucide-react';
import { GENERATED_ASSETS } from '../data/assets';
import { MISSIONS_DATA } from '../data/missionsData';
import {
  calculateOrganicTransitionPlan,
  type FarmSoilCondition,
  type WaterSourceType,
} from '../utils/organicFarmingLogic';
import type { Language } from '../types/goveda';

/* ============================================================================
   SHARED EDITORIAL TYPOGRAPHY PRIMITIVE
   Mirrors the exact reference hero DNA throughout the entire page:
   - Antique-gold horizontal hairlines flanking eyebrow text
   - Bold deep-forest-green display title with sweeping antique-gold-to-leaf-green
     curved brush underline
   - Optional pale-sage italic brush ribbon tagline + 2px gold vertical lead bar
   ============================================================================ */
interface OrganicEditorialHeadingProps {
  eyebrow?: string;
  eyebrowHi?: string;
  eyebrowEn?: string;
  titleHi: string;
  titleEn: string;
  taglineHi?: string;
  taglineEn?: string;
  leadHi?: string;
  leadEn?: string;
  lang: Language;
  align?: 'left' | 'center';
}

export function OrganicEditorialHeading({
  eyebrow: eyebrowSingle,
  eyebrowHi,
  eyebrowEn,
  titleHi,
  titleEn,
  taglineHi,
  taglineEn,
  leadHi,
  leadEn,
  lang,
  align = 'left',
}: OrganicEditorialHeadingProps) {
  const isCenter = align === 'center';
  const eyebrow = eyebrowSingle ?? (lang === 'hi' ? eyebrowHi ?? '' : eyebrowEn ?? '');
  const title = lang === 'hi' ? titleHi : titleEn;
  const tagline = lang === 'hi' ? taglineHi : taglineEn;
  const lead = lang === 'hi' ? leadHi : leadEn;

  return (
    <div className={isCenter ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}>
      {/* Eyebrow with antique-gold horizontal hairlines */}
      <div
        className={`flex items-center gap-3 mb-2.5 ${
          isCenter ? 'justify-center' : ''
        }`}
      >
        <span
          className="h-[1.5px] w-7 sm:w-10 bg-gradient-to-r from-[#D4A039]/30 to-[#C88E28]"
          aria-hidden="true"
        />
        <span className="text-[10.5px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#2A4C2C]">
          {eyebrow}
        </span>
        <span
          className="h-[1.5px] w-7 sm:w-10 bg-gradient-to-l from-[#D4A039]/30 to-[#C88E28]"
          aria-hidden="true"
        />
      </div>

      {/* Main Heading */}
      <h2
        className={`text-2xl sm:text-3xl lg:text-[2.45rem] font-extrabold text-[#144721] leading-[1.15] tracking-tight text-balance ${
          lang === 'hi' ? 'font-hindi' : 'font-editorial'
        }`}
      >
        {title}
      </h2>

      {/* Signature Antique-Gold to Botanical-Green Sweeping Brush Underline */}
      <svg
        viewBox="0 0 320 22"
        fill="none"
        aria-hidden="true"
        className={`mt-2 w-48 sm:w-64 h-4 ${isCenter ? 'mx-auto' : ''}`}
      >
        <defs>
          <linearGradient id="organicSwooshGrad" x1="0" y1="11" x2="320" y2="11" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D7A134" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#D49A2A" />
            <stop offset="72%" stopColor="#72A42C" />
            <stop offset="100%" stopColor="#3B7A28" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path
          d="M4 17 C88 4 196 2 314 14 C236 10 120 11 8 20 Z"
          fill="url(#organicSwooshGrad)"
        />
      </svg>

      {/* Optional Pale-Sage Brush Ribbon Tagline */}
      {tagline && (
        <div className={`mt-3 ${isCenter ? 'flex justify-center' : ''}`}>
          <p
            className="inline-block px-4 py-1.5 rounded-full text-[13px] sm:text-sm italic font-editorial text-[#1C4D27] bg-gradient-to-r from-[#EEF3DF] via-[#F4F6E6] to-transparent"
          >
            {tagline}
          </p>
        </div>
      )}

      {/* Optional Lead Paragraph with 2px Warm-Gold Vertical Accent Bar */}
      {lead && (
        <div
          className={`mt-4 flex items-stretch gap-3 ${
            isCenter ? 'justify-center text-left max-w-2xl mx-auto' : 'max-w-[66ch]'
          }`}
        >
          <span
            className="w-[2.5px] shrink-0 rounded-full bg-gradient-to-b from-[#D49A2A] via-[#C68924] to-[#D49A2A]/40"
            aria-hidden="true"
          />
          <p
            className={`text-sm sm:text-[15.5px] text-[#2B3D2F] leading-[1.72] ${
              lang === 'hi' ? 'font-hindi' : ''
            }`}
          >
            {lead}
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   1. SEAMLESS HERO SECTION — DIRECT VISUAL MATCH TO REFERENCE IMAGE #3
   Desktop (1440px) AND Mobile (390px) preserve identical typography,
   antique-gold hairlines, 2-line forest-green/botanical-green headline,
   sweeping gold-green curved underline, italic pale-sage brush ribbon,
   gold vertical lead rule, dual rounded-pill CTAs, and seamless watercolor art.
   ============================================================================ */
interface OrganicFarmingHeroProps {
  lang: Language;
  onScrollTo: (sectionId: string) => void;
}

export function OrganicFarmingHero({ lang, onScrollTo }: OrganicFarmingHeroProps) {
  return (
    <section
      aria-label={
        lang === 'hi'
          ? 'जैविक खेती एवं ग्रामीण विकास मुख्य परिचय'
          : 'Organic Farming and Rural Development Hero'
      }
      className="relative overflow-hidden bg-[#FBFAF6] border-b border-[#E8DFC8]"
    >
      {/* DESKTOP FULL-BLEED RIGHT-WEIGHTED EDITORIAL WATERCOLOR BACKDROP */}
      <div
        className="hidden lg:block absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <img
          src={GENERATED_ASSETS.organicHeroEditorial}
          alt=""
          className="w-full h-full object-cover object-right"
        />
        {/* Seamless warm-ivory horizontal dissolve on the left text zone */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #FBFAF6 0%, #FBFAF6 33%, rgba(251,250,246,0.92) 44%, rgba(251,250,246,0.45) 54%, rgba(251,250,246,0) 66%)',
          }}
        />
        {/* Soft ivory bottom feather */}
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

          {/* 2-Line Editorial Display Headline matching Reference Image #3 */}
          <div>
            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold leading-[1.12] tracking-tight">
                <span className="block text-[2.45rem] sm:text-[3.35rem] lg:text-[3.7rem] text-[#114720]">
                  जैविक खेती{' '}
                  <span className="text-[1.75rem] sm:text-[2.4rem] lg:text-[2.65rem] font-bold text-[#1D5428]">
                    एवं
                  </span>
                </span>
                <span className="block text-[2.45rem] sm:text-[3.35rem] lg:text-[3.7rem] bg-gradient-to-r from-[#567F21] via-[#3E6F20] to-[#23561F] bg-clip-text text-transparent">
                  ग्रामीण विकास
                </span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold leading-[1.08] tracking-tight">
                <span className="block text-[2.25rem] sm:text-[3.1rem] lg:text-[3.45rem] text-[#114720]">
                  Organic Farming &amp;
                </span>
                <span className="block text-[2.25rem] sm:text-[3.1rem] lg:text-[3.45rem] bg-gradient-to-r from-[#567F21] via-[#3E6F20] to-[#23561F] bg-clip-text text-transparent">
                  Rural Development
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
                  id="heroGoldGreenBrush"
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
                fill="url(#heroGoldGreenBrush)"
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
              {lang === 'hi'
                ? 'Healthy Soil. Resilient Farms. Thriving Villages.'
                : 'Healthy Soil. Resilient Farms. Thriving Villages.'}
            </p>
            {lang === 'en' && (
              <p className="mt-1 pl-3.5 text-xs font-hindi font-medium text-[#526958]">
                स्वस्थ मिट्टी · सक्षम खेत · समृद्ध गाँव
              </p>
            )}
          </div>

          {/* Lead Paragraph with 2.5px Antique-Gold Vertical Bar */}
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
                ? 'प्राकृतिक खेती, मिट्टी की सेहत, जल संरक्षण और ग्रामीण आजीविका को मजबूत बनाने की पहल।'
                : 'An initiative strengthening natural farming, living soil health, rainwater conservation, and resilient rural livelihoods.'}
            </p>
          </div>

          {/* Dual Rounded-Pill CTAs Side-by-Side (Desktop AND Mobile) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onScrollTo('of-join')}
              className={`spring-btn inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#154A24] hover:bg-[#1B5E2E] text-white text-xs sm:text-sm font-bold shadow-sm cursor-pointer whitespace-nowrap ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              <span>{lang === 'hi' ? 'मिशन से जुड़ें' : 'Join This Mission'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('of-why')}
              className={`spring-btn inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/95 hover:bg-[#F4F8EE] text-[#154A24] border border-[#154A24]/45 text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              <span>{lang === 'hi' ? 'हमारी पहल जानें' : 'Explore Our Initiative'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET SEAMLESS WATERCOLOR ARTWORK (SAME ARTWORK, FULL-BLEED RIGHT SCENE, ZERO BOX/FRAME) */}
      <div className="lg:hidden relative w-full mt-1 overflow-hidden select-none">
        <div className="relative w-full aspect-[16/11] sm:aspect-[16/9] overflow-hidden">
          <img
            src={GENERATED_ASSETS.organicHeroEditorial}
            alt={
              lang === 'hi'
                ? 'राजस्थान के गाँव में जैविक खेती, वर्षा जल कुंड, कम्पोस्ट और जीवित मिट्टी की जड़ों का चित्रण'
                : 'Editorial watercolor illustration of organic farming, stone rainwater kund, bamboo compost, vegetables, and living soil in Rajasthan'
            }
            className="w-full h-full object-cover object-right scale-[1.52] sm:scale-[1.24] origin-right"
          />
          {/* Seamless top dissolve into #FBFAF6 hero copy */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-12"
            style={{
              background:
                'linear-gradient(to bottom, #FBFAF6 0%, rgba(251,250,246,0.65) 45%, transparent 100%)',
            }}
          />
          {/* Subtle bottom ivory melt */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
            style={{
              background:
                'linear-gradient(to top, #FBFAF6 0%, transparent 100%)',
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   2. WHY IT MATTERS — 4 GROUND REALITIES OF RAJASTHAN FARMING
   ============================================================================ */
export function OrganicWhyMatters({ lang }: { lang: Language }) {
  const realities = [
    {
      num: '01',
      titleHi: 'घटता मृदा जैविक कार्बन (Soil Organic Carbon)',
      titleEn: 'Depleting Soil Organic Carbon',
      descHi:
        'दशकों के असंतुलित रासायनिक खाद उपयोग और कम गोबर खाद से मिट्टी सख्त हो रही है, जिससे केंचुए, सूक्ष्मजीव और पानी सोखने की प्राकृतिक क्षमता घटती जा रही है।',
      descEn:
        'Years of unbalanced synthetic fertiliser use with minimal organic matter harden topsoil, reducing earthworms, beneficial microbes, and natural moisture retention.',
    },
    {
      num: '02',
      titleHi: 'बढ़ती जल लवणता एवं गिरता भूजल स्तर',
      titleEn: 'Rising Groundwater Salinity & Scarcity',
      descHi:
        'चूरू, बीकानेर, फलोदी, जोधपुर और भीलवाड़ा के अनेक क्षेत्रों में बोरवेल का पानी खारा (High EC/TDS) है। बिना जल परीक्षण खुले पानी से सिंचाई मिट्टी को लवणीय बना देती है।',
      descEn:
        'Across arid Rajasthan districts like Churu, Bikaner, Phalodi, Jodhpur, and Bhilwara, saline borewell water without testing gradually turns fertile soil alkaline.',
    },
    {
      num: '03',
      titleHi: 'महँगे बाहरी आदान और घटता किसान मुनाफा',
      titleEn: 'Rising External Input Costs & Shrinking Margins',
      descHi:
        'हर मौसम में रासायनिक खाद और कीटनाशक की मात्रा व कीमत बढ़ती जाती है, जिससे छोटे और सीमांत किसानों पर कर्ज और आर्थिक अनिश्चितता का दबाव बढ़ता है।',
      descEn:
        'Escalating chemical fertiliser and pesticide bills every season tighten cashflow for smallholder farmers while soil responsiveness declines.',
    },
    {
      num: '04',
      titleHi: 'एकदम बदलाव से उपज घटने का वास्तविक डर',
      titleEn: 'Genuine Fear of Abrupt Yield Drop',
      descHi:
        'किसान की आजीविका उसकी फसल पर टिकी है। किसी भी खेत में एक दिन में रसायन बंद करना जोखिम भरा हो सकता है—इसीलिए GOVEDA वैज्ञानिक जाँच और चरणबद्ध बदलाव को प्राथमिकता देता है।',
      descEn:
        'A family’s livelihood depends on harvest security. Stopping chemicals overnight can dip yields—which is why GOVEDA champions lab testing and phased 2–3 year transitions.',
    },
  ];

  return (
    <section
      id="of-why"
      className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="01 · धरातलीय वास्तविकता"
          eyebrowEn="01 · Ground Reality"
          titleHi="स्वस्थ मिट्टी और व्यावहारिक जैविक खेती क्यों आवश्यक है?"
          titleEn="Why Living Soil & Practical Organic Farming Matter Today"
          leadHi="राजस्थान की शुष्क और अर्ध-शुष्क खेती में बदलाव नारों से नहीं, बल्कि मिट्टी की जाँच, जल की बचत, देशी गोवंश के संसाधनों और किसान की आय की सुरक्षा से आता है।"
          leadEn="In Rajasthan’s arid and semi-arid districts, resilient farming comes not from slogans, but from lab soil-water diagnostics, water discipline, indigenous cattle nutrients, and protecting farmer livelihoods."
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
   3. LIVING SOIL & NATURAL FARMING ANATOMY (INTERACTIVE EDITORIAL CUTAWAY)
   Seamless full-width editorial illustration with 4 accessible interactive
   exploration tabs explaining canopy, mulching, living soil & deep roots.
   ============================================================================ */
interface SoilLayerItem {
  id: string;
  num: string;
  posClass: string;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  actionHi: string;
  actionEn: string;
}

const SOIL_LAYERS: SoilLayerItem[] = [
  {
    id: 'canopy',
    num: '01',
    posClass: 'top-[22%] left-[24%]',
    titleHi: 'देशी वृक्षों की मेड़ और कृषि-वानिकी (Khejri & Neem)',
    titleEn: 'Native Windbreak Canopy (Khejri & Neem)',
    summaryHi:
      'खेत की मेड़ पर खेजड़ी, नीम और रोहिड़ा के वृक्ष गर्म लू की गति कम करते हैं, फसल को हल्की छाया देते हैं और प्राकृतिक कीट नियंत्रण में मदद करते हैं।',
    summaryEn:
      'Perimeter Khejri, Neem, and Rohida trees break scorching desert winds, moderate micro-climate heat, and shelter beneficial pollinators and birds.',
    actionHi: 'प्रत्येक बीघा मेड़ पर 12–16 स्थानीय प्रजाति के पौधे व ट्री-गार्ड',
    actionEn: '12–16 hardy native perimeter saplings per Bigha with tree guards',
  },
  {
    id: 'mulch',
    num: '02',
    posClass: 'top-[48%] left-[56%]',
    titleHi: 'फसल अवशेष आच्छादन (Golden Straw Mulching)',
    titleEn: 'Crop-Residue Straw Mulching',
    summaryHi:
      'सूखे पुआल, पत्तियों और फसल अवशेष की परत मिट्टी को सीधी धूप से ढकती है, वाष्पीकरण को 35–45% तक कम करती है और सड़कर प्राकृतिक ह्यूमस बनाती है।',
    summaryEn:
      'A protective blanket of golden straw shields topsoil from harsh sun, cuts moisture evaporation significantly, suppresses weeds, and decomposes into rich humus.',
    actionHi: 'फसल अवशेष जलाने के बजाय पंक्तियों के बीच मल्चिंग बिछाना',
    actionEn: 'Spreading crop residue between rows instead of burning stubble',
  },
  {
    id: 'microbes',
    num: '03',
    posClass: 'top-[65%] left-[57%]',
    titleHi: 'केंचुए और लाभकारी सूक्ष्मजीव (Living Soil Biology)',
    titleEn: 'Earthworms & Living Soil Microbes',
    summaryHi:
      'वर्मीकम्पोस्ट, जीवामृत और गोबर खाद से मिट्टी में करोड़ों सूक्ष्मजीव व केंचुए सक्रिय होते हैं, जो बंधे हुए पोषक तत्वों को पौधों की जड़ों के लिए उपलब्ध कराते हैं।',
    summaryEn:
      'Vermicompost and Jeevamrit awaken earthworms and beneficial rhizosphere microbes that unlock bound minerals and build crumbly, porous topsoil.',
    actionHi: 'देशी गोवंश के गोबर-गोमूत्र से स्थानीय जीवामृत व वर्मीकम्पोस्ट निर्माण',
    actionEn: 'On-farm Jeevamrit & Gaushala-linked vermicompost application',
  },
  {
    id: 'roots',
    num: '04',
    posClass: 'top-[76%] left-[72%]',
    titleHi: 'गहरी जड़ें, वर्षा जल अवशोषण व कार्बन संचयन',
    titleEn: 'Deep Roots, Moisture & Soil Carbon',
    summaryHi:
      'भुरभुरी और जीवित मिट्टी में बारिश की बूंदें बहने के बजाय गहराई तक रिसती हैं। दलहन (मूँग, मोठ, चना) की जड़ें नाइट्रोजन स्थिरीकरण कर अगली फसल को पोषण देती हैं।',
    summaryEn:
      'Porous living soil lets rainwater percolate deep into the root zone while nitrogen-fixing pulses (Moong, Moth, Gram) naturally enrich the soil for the next cycle.',
    actionHi: 'मिश्रित फसल चक्र: बाजरा/जौ के साथ दलहन और कम पानी वाली फसलें',
    actionEn: 'Multi-crop rotation pairing millets/barley with native pulses',
  },
];

export function OrganicLivingSoilSection({ lang }: { lang: Language }) {
  const [activeLayerId, setActiveLayerId] = useState<string>(SOIL_LAYERS[2].id);
  const activeLayer =
    SOIL_LAYERS.find((item) => item.id === activeLayerId) ?? SOIL_LAYERS[0];

  return (
    <section
      id="of-soil"
      className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20 border-b border-[#E8DFC8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <OrganicEditorialHeading
          eyebrowHi="02 · जीवित मिट्टी का विज्ञान"
          eyebrowEn="02 · Living Soil Anatomy"
          titleHi="जीवित मिट्टी कैसे काम करती है?"
          titleEn="How a Living Organic Soil Ecosystem Works"
          taglineHi="ऊपर देशी वृक्षों की छाया, मध्य में पुआल मल्चिंग और नीचे केंचुओं व जड़ों का समृद्ध तंत्र।"
          taglineEn="Native shade above, straw mulch on the surface, and active roots & microbes below."
          lang={lang}
          align="center"
        />

        {/* Seamless Full-Width Gouache Cutaway Illustration + Subtle Interactive Hotspots */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative overflow-hidden">
            <img
              src={GENERATED_ASSETS.organicLivingSoilAnatomy}
              alt={
                lang === 'hi'
                  ? 'खेजड़ी-नीम वृक्ष, बाजरा-दलहन फसल, पुआल मल्चिंग, केंचुए और गहरी जड़ों का संपादकीय जलरंग चित्रण'
                  : 'Editorial gouache cutaway of native Khejri and Neem trees, millets, golden straw mulch, earthworms, and deep roots'
              }
              className="w-full h-auto block select-none"
            />
            {/* Seamless radial/edge warm-ivory dissolve (Zero box borders) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, #FBFAF6 0%, transparent 9%, transparent 88%, #FBFAF6 100%), linear-gradient(to right, #FBFAF6 0%, transparent 6%, transparent 94%, #FBFAF6 100%)',
              }}
            />

            {/* Interactive Numbered Editorial Hotspots on Desktop/Tablet */}
            <div className="hidden sm:block">
              {SOIL_LAYERS.map((layer) => {
                const isSelected = layer.id === activeLayer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setActiveLayerId(layer.id)}
                    aria-pressed={isSelected}
                    aria-label={
                      lang === 'hi'
                        ? `${layer.num}: ${layer.titleHi}`
                        : `${layer.num}: ${layer.titleEn}`
                    }
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all cursor-pointer shadow-md ${
                      layer.posClass
                    } ${
                      isSelected
                        ? 'bg-[#154A24] text-[#E6F8B2] ring-4 ring-[#C8922A]/50 scale-110'
                        : 'bg-[#FBFAF6]/95 text-[#154A24] border-2 border-[#C8922A] hover:scale-105'
                    }`}
                  >
                    {layer.num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Layer Selector Tabs + Active Agronomic Explanation */}
          <div className="mt-6 space-y-5">
            <div
              role="tablist"
              aria-label={
                lang === 'hi'
                  ? 'जीवित मिट्टी के 4 प्रमुख स्तर'
                  : 'Four layers of living organic soil'
              }
              className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
            >
              {SOIL_LAYERS.map((layer) => {
                const isSelected = layer.id === activeLayer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveLayerId(layer.id)}
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
                      {layer.num}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs sm:text-[13.5px] font-bold leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? layer.titleHi : layer.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail Panel for Selected Layer */}
            <div
              role="tabpanel"
              className="border-t-2 border-b border-[#D7C497] bg-white/85 px-5 sm:px-7 py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.12em] uppercase text-[#5E8226]">
                  <Sprout className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? `स्तर ${activeLayer.num} · व्यावहारिक समझ`
                      : `Layer ${activeLayer.num} · Practical Field Insight`}
                  </span>
                </div>
                <h3
                  className={`text-lg sm:text-xl font-extrabold text-[#144721] ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {lang === 'hi' ? activeLayer.titleHi : activeLayer.titleEn}
                </h3>
                <p
                  className={`text-sm text-[#324537] leading-[1.7] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? activeLayer.summaryHi : activeLayer.summaryEn}
                </p>
              </div>
              <div className="md:w-72 shrink-0 border-l-2 border-[#C8922A] pl-4 py-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C6A23]">
                  {lang === 'hi' ? 'खेत पर अनुप्रयोग' : 'On-Farm Practice'}
                </span>
                <p
                  className={`mt-1 text-xs sm:text-[13.5px] font-semibold text-[#154A24] leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? activeLayer.actionHi : activeLayer.actionEn}
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
   4. SCIENTIFIC SOIL-WATER TESTING, RAINWATER KUND & DRIP IRRIGATION
   ============================================================================ */
export function OrganicWaterTestingSection({ lang }: { lang: Language }) {
  const diagnostics = [
    {
      icon: FlaskConical,
      num: '01',
      titleHi: 'मृदा परीक्षण (Soil Testing First)',
      titleEn: 'Scientific Soil Testing First',
      descHi:
        'किसी भी जैविक या एकीकृत योजना से पहले pH, जैविक कार्बन (OC%), उपलब्ध NPK और जिंक-आयरन की लैब जाँच—ताकि खाद का चुनाव अनुमान नहीं, रिपोर्ट के आधार पर हो।',
      descEn:
        'Before changing inputs, test soil pH, Organic Carbon %, available NPK, and Zinc/Iron at accredited labs so nutrient plans rely on real evidence, not guesswork.',
    },
    {
      icon: Droplets,
      num: '02',
      titleHi: 'सिंचाई जल लवणता जाँच (Water EC & TDS)',
      titleEn: 'Irrigation Water Salinity (EC / TDS)',
      descHi:
        'शुष्क राजस्थान के बोरवेल पानी में लवणता (EC/SAR) की जाँच अनिवार्य है। रिपोर्ट के अनुसार ही फसल, बागवानी और जिप्सम/खाद प्रबंधन तय किया जाता है।',
      descEn:
        'Testing borewell salinity (EC/TDS/SAR) in arid Rajasthan prevents soil crusting and guides salt-tolerant crop selection and compost balancing.',
    },
    {
      icon: Sun,
      num: '03',
      titleHi: 'वर्षा जल कुंड, ड्रिप व मल्चिंग एकीकरण',
      titleEn: 'Rainwater Kund, Drip & Mulching',
      descHi:
        'खेत में पारंपरिक कुंड या फार्म-पॉन्ड से वर्षा जल संचयन और बूंद-बूंद (Drip) सिंचाई जोड़कर 40–50% तक पानी की बचत और बेहतर जड़ विकास संभव होता है।',
      descEn:
        'Pairing traditional rainwater kunds with drip irrigation and straw mulching cuts evaporation loss and delivers moisture directly to crop roots.',
    },
    {
      icon: Leaf,
      num: '04',
      titleHi: 'स्थानीय जैव-आदान (जीवामृत, बीजामृत, नीमास्त्र)',
      titleEn: 'Local Bio-Inputs (Jeevamrit, Beejamrit, Neemastr)',
      descHi:
        'देशी गोबर, गोमूत्र, गुड़, बेसन और नीम पत्तियों से खेत पर ही कम लागत वाले सूक्ष्मजीव संवर्धक और वनस्पति कीट-रोधी घोल तैयार करने का व्यावहारिक प्रशिक्षण।',
      descEn:
        'Hands-on village preparation of low-cost Jeevamrit, Beejamrit seed treatment, and Neem-based botanical pest repellents using local farm resources.',
    },
  ];

  return (
    <section
      id="of-water"
      className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="03 · वैज्ञानिक जाँच एवं जल संरक्षण"
          eyebrowEn="03 · Diagnostics & Water Discipline"
          titleHi="मिट्टी-जल परीक्षण, वर्षा कुंड और सूक्ष्म सिंचाई"
          titleEn="Soil-Water Testing, Rainwater Kunds & Micro-Irrigation"
          leadHi="अंदाज़े से नहीं, बल्कि मिट्टी और पानी की वैज्ञानिक जाँच से शुरू होती है टिकाऊ खेती। राजस्थान के हर बूँद पानी का सम्मान ही समृद्ध खेत की नींव है।"
          leadEn="Sustainable agriculture begins with laboratory soil and water diagnostics—not guesswork. Respecting every drop of Rajasthan’s water is the true foundation of a resilient farm."
          lang={lang}
        />

        {/* Two-column editorial weave: Seamless Watercolor Illustration + 4 Structured Diagnostic Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 relative">
            <img
              src={GENERATED_ASSETS.organicWaterDripKund}
              alt={
                lang === 'hi'
                  ? 'राजस्थान के पारंपरिक पत्थर के वर्षा जल कुंड, ड्रिप सिंचाई और मिट्टी-जल परीक्षण करते किसान का संपादकीय जलरंग चित्रण'
                  : 'Editorial watercolor illustration of Rajasthan sandstone rainwater kund, drip-irrigated beds, and farmer inspecting soil and water samples'
              }
              className="w-full h-auto block select-none"
            />
            {/* Seamless white-to-canvas edge melt */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, #FFFFFF 0%, transparent 8%, transparent 90%, #FFFFFF 100%), linear-gradient(to right, #FFFFFF 0%, transparent 6%, transparent 94%, #FFFFFF 100%)',
              }}
            />
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {diagnostics.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.num}
                  className="pt-4 border-t border-[#DFCFAF] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F3F7EC] text-[#154A24] border border-[#D8E5C5]">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-extrabold text-[#8C6A23] tabular-nums">
                      {d.num}
                    </span>
                  </div>
                  <h3
                    className={`text-[15.5px] font-extrabold text-[#144721] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {lang === 'hi' ? d.titleHi : d.titleEn}
                  </h3>
                  <p
                    className={`text-[13px] text-[#3B4D40] leading-[1.68] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? d.descHi : d.descEn}
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
   5. CIRCULAR VILLAGE & RURAL DEVELOPMENT ECOSYSTEM
   Seamless wordless gouache panorama (`organicVillageCycle`) showing how
   Gaushala → Vermicompost/Jeevamrit → Organic Farms & Women Nurseries →
   Local Rural Markets form a self-reinforcing village economy.
   ============================================================================ */
export function OrganicCircularVillageSection({
  lang,
  onNavigate,
}: {
  lang: Language;
  onNavigate: (path: string) => void;
}) {
  const cycleSteps = [
    {
      step: '01',
      titleHi: 'आत्मनिर्भर गौशाला एवं स्वदेशी गोवंश',
      titleEn: 'Self-Reliant Gaushala & Indigenous Cattle',
      descHi:
        'गाँव की गौशाला और पशुपालकों से नियमित गोबर, गोमूत्र एवं बायोगैस स्लरी का स्वच्छ संकलन।',
      descEn:
        'Clean collection of cow dung, gomutra, and nutrient-rich biogas slurry from village Gaushalas and livestock families.',
    },
    {
      step: '02',
      titleHi: 'वर्मीकम्पोस्ट, जीवामृत व स्थानीय खाद इकाई',
      titleEn: 'Vermicompost & Jeevamrit Bio-Units',
      descHi:
        'गाँव स्तर पर छायादार वर्मीकम्पोस्ट बेड व जीवामृत ड्रम इकाई—जिससे किसानों को भरोसेमंद जैविक खाद पास ही मिलती है।',
      descEn:
        'Shaded village vermicompost beds and Jeevamrit units giving farmers affordable, locally verified organic nutrition.',
    },
    {
      step: '03',
      titleHi: 'जैविक खेत, हरा चारा व महिला पौध नर्सरी',
      titleEn: 'Organic Farms, Green Fodder & Women Nurseries',
      descHi:
        'खेतों में स्वस्थ फसलें और गौशाला हेतु पौष्टिक हरा चारा उगता है; महिला स्वयं सहायता समूह देशी पौध नर्सरी व बीज बैंक सँभालती हैं।',
      descEn:
        'Healthy crops and nutritious green fodder return to Gaushalas while Women SHGs lead native sapling nurseries and seed banks.',
    },
    {
      step: '04',
      titleHi: 'स्थानीय ग्राम बाज़ार व ग्रामीण आजीविका',
      titleEn: 'Village Value Addition & Rural Livelihoods',
      descHi:
        'स्वच्छ ग्रेडिंग, कपड़े के थैलों में पैकेजिंग और स्थानीय बाज़ार/FPO संपर्क से ग्रामीण परिवारों की आय गाँव में ही टिकती है।',
      descEn:
        'Clean grading, eco-packaging, and local market/FPO linkages keep value addition and dignified livelihoods inside the village.',
    },
  ];

  const missionLinks = [
    {
      path: '/missions/self-reliant-gaushala',
      hi: 'आत्मनिर्भर गौशाला मिशन',
      en: 'Self-Reliant Gaushala',
    },
    {
      path: '/missions/harit-rajasthan',
      hi: 'हरित राजस्थान व नर्सरी',
      en: 'Harit Rajasthan & Nurseries',
    },
    {
      path: '/missions/carbon-credit',
      hi: 'कार्बन क्रेडिट व कृषि-वानिकी',
      en: 'Carbon Credit & Agroforestry',
    },
    {
      path: '/missions/women-empowerment',
      hi: 'महिला सशक्तिकरण (SHG)',
      en: 'Women Empowerment (SHG)',
    },
  ];

  return (
    <section
      id="of-village"
      className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20 border-b border-[#E8DFC8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <OrganicEditorialHeading
          eyebrowHi="04 · चक्रीय ग्रामीण अर्थव्यवस्था"
          eyebrowEn="04 · Circular Rural Economy"
          titleHi="जैविक खेती से आत्मनिर्भर ग्राम विकास का चक्रीय मॉडल"
          titleEn="From Organic Farms to a Self-Reliant Village Economy"
          taglineHi="जब गौशाला, खेत, महिला नर्सरी और ग्राम बाज़ार एक-दूसरे से जुड़ते हैं, तब ग्रामीण समृद्धि स्थायी बनती है।"
          taglineEn="When Gaushalas, farms, women-led nurseries, and local markets reinforce each other, rural prosperity endures."
          lang={lang}
          align="center"
        />

        {/* Seamless Panoramic Gouache Illustration (Clean Wordless Version) */}
        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <img
            src={GENERATED_ASSETS.organicVillageCycle}
            alt={
              lang === 'hi'
                ? 'स्वदेशी गौशाला, वर्मीकम्पोस्ट इकाई, जैविक खेत, महिला पौध नर्सरी और ग्रामीण हाट का संपादकीय जलरंग दृश्य'
                : 'Editorial watercolor panorama linking indigenous Gaushala, shaded vermicompost beds, organic fields, women sapling nursery, and village produce stand'
            }
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

        {/* 4 Sequential Connected Stages beneath Panorama */}
        <div className="relative">
          <div
            className="hidden lg:block pointer-events-none absolute top-4 left-[12%] right-[12%] h-px border-t border-dashed border-[#C8922A]/70"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {cycleSteps.map((st) => (
              <div key={st.step} className="space-y-2.5">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#154A24] text-[#DDF7A4] text-xs font-extrabold tabular-nums">
                  {st.step}
                </div>
                <h3
                  className={`text-[15.5px] font-extrabold text-[#144721] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {lang === 'hi' ? st.titleHi : st.titleEn}
                </h3>
                <p
                  className={`text-[13px] text-[#3B4D40] leading-[1.68] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? st.descHi : st.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Mission Links Row */}
        <div className="pt-4 border-t border-[#E3D7BA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span
            className={`text-xs font-bold uppercase tracking-[0.12em] text-[#5B7830] ${
              lang === 'hi' ? 'font-hindi' : ''
            }`}
          >
            {lang === 'hi'
              ? 'संबंधित GOVEDA मिशन जो इस ग्राम मॉडल को सशक्त बनाते हैं:'
              : 'Connected GOVEDA missions powering this circular village model:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {missionLinks.map((m) => (
              <button
                key={m.path}
                type="button"
                onClick={() => onNavigate(m.path)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#D7C497] text-[#154A24] hover:bg-[#154A24] hover:text-white text-xs font-semibold transition-colors cursor-pointer ${
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
    </section>
  );
}

/* ============================================================================
   6. PHASED 3-YEAR TRANSITION ROADMAP + INTERACTIVE FARM TRANSITION PLANNER
   Uses pure tested logic from `/src/utils/organicFarmingLogic.ts`
   ============================================================================ */
export function OrganicPhasedTransitionSection({ lang }: { lang: Language }) {
  const [bigha, setBigha] = useState<number>(6);
  const [waterSource, setWaterSource] = useState<WaterSourceType>('sweet-well');
  const [soilCondition, setSoilCondition] = useState<FarmSoilCondition>('mixed');

  const plan = calculateOrganicTransitionPlan({
    bigha,
    waterSource,
    soilCondition,
  });

  const waterOptions: { id: WaterSourceType; hi: string; en: string }[] = [
    { id: 'sweet-well', hi: 'मीठा कुआँ / ट्यूबवेल', en: 'Sweet Well / Tubewell' },
    { id: 'saline-borewell', hi: 'खारा बोरवेल जल (High EC)', en: 'Saline Borewell (High EC)' },
    { id: 'rainfed', hi: 'बारानी / वर्षा आधारित', en: 'Rainfed (Monsoon-only)' },
  ];

  const soilOptions: { id: FarmSoilCondition; hi: string; en: string }[] = [
    { id: 'chemical-heavy', hi: 'अधिक रासायनिक खाद उपयोग', en: 'Chemical-Heavy Usage' },
    { id: 'mixed', hi: 'मिश्रित (गोबर + रसायन)', en: 'Mixed (Manure + Chemical)' },
    { id: 'traditional-low-input', hi: 'पारंपरिक / कम रासायनिक', en: 'Traditional Low-Input' },
  ];

  return (
    <section
      id="of-transition"
      className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="05 · सुरक्षित चरणबद्ध रूपांतरण"
          eyebrowEn="05 · Safe 3-Year Phased Transition"
          titleHi="एक दिन में नहीं, 3 वर्ष में सुरक्षित जैविक बदलाव"
          titleEn="Not Overnight — A Safe, Scientific 3-Year Farm Transition"
          leadHi="अपनी भूमि के आकार, पानी के प्रकार और वर्तमान खेती पद्धति के अनुसार वर्ष-1 के सुरक्षित पायलट क्षेत्र, अनुमानित जैविक खाद व प्राथमिकता परीक्षण की प्रारंभिक मार्गदर्शिका देखें।"
          leadEn="Explore an indicative Year-1 pilot area, organic input guide, priority lab tests, and drought/salinity-suited crops tailored to your landholding, water source, and soil history."
          lang={lang}
        />

        {/* Seamless Left-to-Right 3-Year Landscape Illustration */}
        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <img
            src={GENERATED_ASSETS.organicPhasedTransition}
            alt={
              lang === 'hi'
                ? 'सूखी मिट्टी से चरणबद्ध रूप से जैविक खाद, ड्रिप सिंचाई और हरे-भरे बहुफसलीय खेत की ओर 3-वर्षीय परिवर्तन का जलरंग चित्रण'
                : 'Editorial watercolor panorama showing left-to-right 3-year phased farm transition from dry topsoil to compost pilot, drip irrigation, and lush multi-crop harvest'
            }
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

        {/* Interactive Phased Farm Transition Planner */}
        <div className="rounded-3xl bg-[#FBFAF6] border border-[#DFCFAF] p-5 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E3D7BA] pb-5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8C6A23]">
                {lang === 'hi'
                  ? 'इंटरएक्टिव किसान मार्गदर्शन टूल'
                  : 'Interactive Farmer Orientation Tool'}
              </span>
              <h3
                className={`mt-1 text-xl sm:text-2xl font-extrabold text-[#144721] ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi'
                  ? 'चरणबद्ध जैविक खेती योजनाकार (Phased Transition Planner)'
                  : 'Phased Organic Farm Transition Planner'}
              </h3>
            </div>
            <p
              className={`text-xs text-[#546657] max-w-md ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi'
                ? 'नोट: यह केवल प्रारंभिक मार्गदर्शन है; अंतिम मात्रा आपकी लैब मिट्टी-जल रिपोर्ट और कृषि विशेषज्ञ की सलाह पर निर्भर करेगी।'
                : 'Note: Indicative orientation only; final doses must follow your accredited soil & water lab report and agronomy advice.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT CONTROLS */}
            <div className="lg:col-span-5 space-y-6">
              {/* Farm Size in Bigha */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="organic-bigha-range"
                    className={`text-sm font-bold text-[#144721] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? 'कुल कृषि भूमि (बीघा में)' : 'Total Farm Area (in Bigha)'}
                  </label>
                  <span
                    data-testid="planner-bigha-value"
                    className="px-3 py-1 rounded-full bg-[#154A24] text-[#DDF7A4] text-xs font-extrabold tabular-nums"
                  >
                    {plan.totalBigha} {lang === 'hi' ? 'बीघा' : 'Bigha'}
                  </span>
                </div>
                <input
                  id="organic-bigha-range"
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={bigha}
                  onChange={(e) => setBigha(Number(e.target.value))}
                  className="w-full accent-[#154A24] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#5B6D5F] tabular-nums">
                  <span>1 {lang === 'hi' ? 'बीघा' : 'Bigha'}</span>
                  <span>10</span>
                  <span>20</span>
                  <span>40 {lang === 'hi' ? 'बीघा' : 'Bigha'}</span>
                </div>
              </div>

              {/* Water Source Selector */}
              <fieldset className="space-y-2.5">
                <legend
                  className={`text-sm font-bold text-[#144721] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? 'सिंचाई जल का प्रकार' : 'Irrigation Water Source'}
                </legend>
                <div className="grid grid-cols-1 gap-2">
                  {waterOptions.map((opt) => {
                    const active = waterSource === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setWaterSource(opt.id)}
                        aria-pressed={active}
                        className={`text-left px-4 py-2.5 rounded-xl border text-xs sm:text-[13.5px] font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          active
                            ? 'bg-[#154A24] text-white border-[#154A24]'
                            : 'bg-white text-[#23412B] border-[#DFCFAF] hover:border-[#6F9C33]'
                        } ${lang === 'hi' ? 'font-hindi' : ''}`}
                      >
                        <span>{lang === 'hi' ? opt.hi : opt.en}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-[#C6F28E] shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Current Soil Practice Selector */}
              <fieldset className="space-y-2.5">
                <legend
                  className={`text-sm font-bold text-[#144721] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? 'वर्तमान खेती पद्धति' : 'Current Soil Input Pattern'}
                </legend>
                <div className="grid grid-cols-1 gap-2">
                  {soilOptions.map((opt) => {
                    const active = soilCondition === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSoilCondition(opt.id)}
                        aria-pressed={active}
                        className={`text-left px-4 py-2.5 rounded-xl border text-xs sm:text-[13.5px] font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          active
                            ? 'bg-[#154A24] text-white border-[#154A24]'
                            : 'bg-white text-[#23412B] border-[#DFCFAF] hover:border-[#6F9C33]'
                        } ${lang === 'hi' ? 'font-hindi' : ''}`}
                      >
                        <span>{lang === 'hi' ? opt.hi : opt.en}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-[#C6F28E] shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* RIGHT LIVE OUTPUT */}
            <div className="lg:col-span-7 space-y-6" data-testid="planner-results">
              {/* 4 Key Indicative Figures */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'वर्ष-1 सुरक्षित पायलट' : 'Year-1 Safe Pilot'}
                  </span>
                  <span
                    data-testid="planner-pilot-bigha"
                    className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums"
                  >
                    {plan.year1PilotBigha} {lang === 'hi' ? 'बीघा' : 'Bigha'}
                  </span>
                  <span className="text-[11px] font-bold text-[#7A5D1F] tabular-nums">
                    ({plan.pilotSharePct}% {lang === 'hi' ? 'भाग' : 'share'})
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'अनुमानित वर्मीकम्पोस्ट' : 'Indicative Compost'}
                  </span>
                  <span
                    data-testid="planner-compost-kg"
                    className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums"
                  >
                    {plan.estimatedCompostKgPerYear.toLocaleString('en-IN')} kg
                  </span>
                  <span className="text-[11px] text-[#5B6D5F]">
                    {lang === 'hi' ? 'प्रति वर्ष (पायलट हेतु)' : 'per year (pilot)'}
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'जीवामृत घोल' : 'Jeevamrit Culture'}
                  </span>
                  <span
                    data-testid="planner-jeevamrit-l"
                    className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums"
                  >
                    {plan.estimatedJeevamritLitersPerMonth} L
                  </span>
                  <span className="text-[11px] text-[#5B6D5F]">
                    {lang === 'hi' ? 'प्रति माह (फसल अवधि)' : 'per month (active)'}
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-3.5">
                  <span className="block text-[11px] font-semibold text-[#5B6D5F]">
                    {lang === 'hi' ? 'मेड़ पर देशी पौधे' : 'Border Saplings'}
                  </span>
                  <span className="mt-1 block text-lg sm:text-xl font-extrabold text-[#154A24] tabular-nums">
                    {plan.recommendedBorderSaplings}
                  </span>
                  <span className="text-[11px] text-[#5B6D5F]">
                    {lang === 'hi' ? 'खेजड़ी · नीम · रोहिड़ा' : 'Khejri · Neem · Ber'}
                  </span>
                </div>
              </div>

              {/* 3-Year Phased Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {plan.transitionTimeline.map((stage) => (
                  <div
                    key={stage.year}
                    className="rounded-2xl bg-white border border-[#E2D6BA] p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#154A24]">
                        {stage.year}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EEF5E4] text-[#285E23] text-[11px] font-bold tabular-nums">
                        {stage.sharePct}%
                      </span>
                    </div>
                    <p
                      className={`text-xs text-[#384A3D] leading-relaxed ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? stage.focusHi : stage.focusEn}
                    </p>
                  </div>
                ))}
              </div>

              {/* Priority Lab Tests + Suited Crops + Water Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#154A24]">
                    <FlaskConical className="w-4 h-4 text-[#7D601E]" aria-hidden="true" />
                    <span>
                      {lang === 'hi' ? 'प्रमुख लैब परीक्षण (प्रारंभ से पहले)' : 'Priority Lab Tests First'}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#374A3C]">
                    {plan.priorityTests.map((t, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 ${lang === 'hi' ? 'font-hindi' : ''}`}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#6F9C33] shrink-0" />
                        <span>{lang === 'hi' ? t.hi : t.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-white border border-[#E2D6BA] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#154A24]">
                    <Wheat className="w-4 h-4 text-[#7D601E]" aria-hidden="true" />
                    <span>
                      {lang === 'hi' ? 'उपयुक्त फसल एवं कृषि-वानिकी' : 'Suited Crops & Agroforestry'}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#374A3C]">
                    {plan.recommendedCrops.map((c, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 ${lang === 'hi' ? 'font-hindi' : ''}`}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C8922A] shrink-0" />
                        <span>{lang === 'hi' ? c.hi : c.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Water Strategy Bar */}
              <div className="border-l-4 border-[#154A24] bg-[#F2F7EB] rounded-r-2xl px-4 py-3.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#154A24]">
                  <Droplets className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {lang === 'hi' ? 'सिंचाई व नमी संरक्षण रणनीति' : 'Water & Moisture Conservation Strategy'}
                  </span>
                </div>
                <p
                  className={`mt-1 text-xs sm:text-[13px] text-[#283E2E] leading-relaxed ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? plan.waterStrategy.hi : plan.waterStrategy.en}
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
   7. GOVEDA'S ROLE, HONEST AGRONOMY SAFEGUARD & 10 MISSION MODULES (A–J)
   ============================================================================ */
export function OrganicGovedaRoleAndModules({ lang }: { lang: Language }) {
  const mission = MISSIONS_DATA.find((m) => m.slug === 'organic-farming');
  const modules = mission?.subpages ?? [];

  const govedaRoles = [
    {
      icon: FlaskConical,
      titleHi: 'मृदा एवं जल जाँच समन्वय',
      titleEn: 'Soil & Water Testing Linkage',
      descHi:
        'किसानों को सरकारी/प्रमाणित मृदा परीक्षण प्रयोगशालाओं, KVK और सही नमूना लेने की विधि से जोड़ना।',
      descEn:
        'Connecting farmers with accredited soil labs, Krishi Vigyan Kendras (KVKs), and proper sampling protocols.',
    },
    {
      icon: Users,
      titleHi: 'स्थानीय भाषा में फील्ड स्कूल व डेमो प्लॉट',
      titleEn: 'Dialect-Friendly Field Schools & Demo Plots',
      descHi:
        'हिंदी, मारवाड़ी और मेवाड़ी में गाँव के ही खेतों पर जीवामृत, मल्चिंग, ड्रिप और फसल चक्र का व्यावहारिक प्रदर्शन।',
      descEn:
        'Practical demonstrations in Hindi, Marwari, and Mewari right on village demo plots for Jeevamrit, mulching, and drip care.',
    },
    {
      icon: Trees,
      titleHi: 'गौशाला, नर्सरी और FPO सेतु',
      titleEn: 'Gaushala, Nursery & FPO Bridge',
      descHi:
        'किसानों को स्थानीय गौशालाओं से वर्मीकम्पोस्ट/गोबर खाद, हरित राजस्थान नर्सरी से देशी पौधे और सामूहिक विपणन से जोड़ना।',
      descEn:
        'Linking farmers to village Gaushalas for vermicompost, Harit Rajasthan nurseries for saplings, and local FPO/SHG markets.',
    },
  ];

  const safeguards = [
    {
      hi: 'हम किसी भी किसान को एक ही मौसम में 100% रासायनिक उर्वरक बंद करने की सलाह नहीं देते—मिट्टी परीक्षण के बाद केवल 25–35% पायलट भूमि से चरणबद्ध शुरुआत की जाती है।',
      en: 'We never advise stopping 100% of synthetic inputs overnight—transition begins safely on 25–35% pilot plots after soil and water testing.',
    },
    {
      hi: 'GOVEDA तत्काल जैविक प्रमाण-पत्र (Organic Certificate), निश्चित प्रीमियम बाज़ार मूल्य या गारंटीकृत उपज वृद्धि का कोई झूठा दावा नहीं करता।',
      en: 'GOVEDA makes zero false promises of instant organic certification, guaranteed premium market prices, or overnight yield jumps.',
    },
    {
      hi: 'गंभीर कीट या मिट्टी-लवणता समस्या के लिए हमेशा प्रमाणित कृषि वैज्ञानिकों (KVK / कृषि विश्वविद्यालय) के परामर्श को प्राथमिकता दी जाती है।',
      en: 'For severe pest outbreaks or high soil salinity, guidance from accredited agronomists (KVKs / Agricultural Universities) is always prioritised.',
    },
  ];

  return (
    <section
      id="of-modules"
      className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20 border-b border-[#E8DFC8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <OrganicEditorialHeading
          eyebrowHi="06 · GOVEDA की भूमिका एवं 10 कार्य मॉड्यूल"
          eyebrowEn="06 · GOVEDA’s Role & 10 Structured Modules"
          titleHi="किसानों के साथ व्यावहारिक सहभागिता और 10 मिशन मॉड्यूल"
          titleEn="Practical Field Support & All 10 Mission Modules (A–J)"
          lang={lang}
        />

        {/* 3 Grounded Roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {govedaRoles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.titleEn}
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
                  {lang === 'hi' ? role.titleHi : role.titleEn}
                </h3>
                <p
                  className={`text-xs sm:text-[13.5px] text-[#3B4D40] leading-[1.7] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? role.descHi : role.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Honest Agronomy Disclosure Panel */}
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
                ? 'ईमानदार कृषि नीति एवं किसान सुरक्षा स्पष्टीकरण (Honest Agronomy Safeguard)'
                : 'Honest Agronomy Policy & Farmer Safeguard Disclosure'}
            </h3>
          </div>
          <ul className="space-y-2 pl-8 list-disc text-xs sm:text-[13.5px] text-[#5B3B12] leading-relaxed">
            {safeguards.map((s, idx) => (
              <li key={idx} className={lang === 'hi' ? 'font-hindi' : ''}>
                {lang === 'hi' ? s.hi : s.en}
              </li>
            ))}
          </ul>
        </div>

        {/* 10 Structured Modules Grid (A–J) from MISSIONS_DATA */}
        {modules.length > 0 && (
          <div className="space-y-4">
            <h3
              className={`text-lg sm:text-xl font-extrabold text-[#144721] ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi'
                ? 'मिशन के 10 मुख्य कार्यक्रम घटक (Modules A–J)'
                : 'Ten Structured Programme Modules (A–J)'}
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
