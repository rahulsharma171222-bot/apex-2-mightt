import React, { useState } from 'react';
import {
  ArrowRight,
  HeartHandshake,
  Home,
  Utensils,
  Stethoscope,
  Accessibility,
  UserCheck,
  ShieldAlert,
  Sprout,
  Sun,
  Music,
  BookOpen,
  Users,
  Building2,
  Megaphone,
  Flame,
  GraduationCap,
  Trees,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { GENERATED_ASSETS } from '../data/assets';
import type { Language } from '../types/goveda';

/* ============================================================================
   SHARED EDITORIAL FLOURISH — GOVEDA MASTER VISUAL IDENTITY
   ============================================================================ */
function GovedaLeafFlourish({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 112 24"
      fill="none"
      className={`inline-block align-baseline shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M3 19.5C28 19.5 54 19.5 84 12.5"
        stroke="#7CC042"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M84 12.5C90 5 102 3 110 4C108 13 98 20 84 17.5C82 16 82.5 13.8 84 12.5Z"
        fill="#7CC042"
      />
      <path
        d="M84 13.2C92 10.2 99.5 7.8 106.5 5.4"
        stroke="#FCFBF7"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================================
   1. SEAMLESS HERO — "सम्मान, अपनापन और स्वस्थ जीवन"
   Warm sunlit Rajasthani verandah seamlessly blending into warm ivory #FCFBF7
   ============================================================================ */
export function ElderlyCareHero({
  lang,
  onScrollTo,
}: {
  lang: Language;
  onScrollTo: (id: string) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-[#FCFBF7] border-b border-[#E5DEC8]">
      {/* Desktop Seamless Full-Bleed Sunlit Verandah Artwork */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
        <img
          src={GENERATED_ASSETS.elderlyHeroVerandah}
          alt={
            lang === 'hi'
              ? 'धूप से भरे राजस्थानी बरामदे में चाय और पुस्तक के साथ मुस्कुराते वरिष्ठ दंपति और हरित लॉन में शांत ध्यान व पठन करते वृद्धजन'
              : 'Joyful Indian senior couple sharing tea and a book on a sunlit Rajasthani verandah while elders meditate and read on the green lawn'
          }
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-right"
        />
        {/* Smooth organic warm-ivory dissolve across left 46% for effortless readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #FCFBF7 0%, #FCFBF7 30%, rgba(252,251,247,0.92) 43%, rgba(252,251,247,0.45) 56%, rgba(252,251,247,0) 70%)',
          }}
        />
        {/* Delicate warm atmospheric mist at bottom edge */}
        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{
            background:
              'linear-gradient(180deg, rgba(252,251,247,0) 0%, rgba(252,251,247,0.88) 75%, #FCFBF7 100%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-xl lg:max-w-[560px]">
          {/* Mission 09 Kicker with Warm-Gold Hairline */}
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <span className="text-[11px] sm:text-[13px] font-extrabold tracking-[0.12em] uppercase text-[#1D542B]">
              {lang === 'hi' ? 'मिशन 09 · मानवीय कल्याण पहल' : 'Mission 09 · Human Welfare Initiative'}
            </span>
            <span className="h-px w-12 sm:w-20 bg-[#C8B37B]" aria-hidden="true" />
          </div>

          {/* Primary Display Headline + GOVEDA Sweeping Leaf Flourish */}
          <h1
            className={`text-[30px] sm:text-5xl lg:text-[52px] font-extrabold text-[#113B19] leading-[1.16] tracking-[-0.015em] ${
              lang === 'hi' ? 'font-hindi' : 'font-editorial'
            }`}
          >
            {lang === 'hi' ? (
              <>
                सम्मान, अपनापन
                <br />
                और स्वस्थ जीवन
                <GovedaLeafFlourish className="w-16 sm:w-24 h-4 sm:h-5 ml-1.5 sm:ml-2 -mb-0.5 sm:-mb-1" />
              </>
            ) : (
              <>
                Dignity, Belonging
                <br />
                &amp; Healthy Living
                <GovedaLeafFlourish className="w-16 sm:w-24 h-4 sm:h-5 ml-1.5 sm:ml-2 -mb-0.5 sm:-mb-1" />
              </>
            )}
          </h1>

          {/* Bilingual Italic Editorial Subtitle */}
          <p className="mt-2.5 text-[15px] sm:text-xl italic font-editorial text-[#214B29] text-balance">
            {lang === 'hi'
              ? 'Senior Citizen Care & Mental Well-being'
              : 'वृद्धाश्रम एवं मानसिक स्वास्थ्य सहायता केंद्र'}
          </p>

          {/* Short Crisp Leaf-Green Accent Bar */}
          <div className="mt-3 sm:mt-4 h-[2.5px] w-14 sm:w-16 bg-[#8EC549] rounded-full" aria-hidden="true" />

          {/* Concise Mission Lead */}
          <p
            className={`mt-3.5 text-[13.5px] sm:text-base text-[#2D4032] leading-relaxed ${
              lang === 'hi' ? 'font-hindi' : ''
            }`}
          >
            {lang === 'hi'
              ? 'वृद्धजनों के सम्मान, सुरक्षित देखभाल, गौशाला व प्रकृति से स्वैच्छिक जुड़ाव, योग-ध्यान और मानसिक कल्याण के लिए GOVEDA का एक संवेदनशील, समग्र प्रस्तावित मॉडल।'
              : 'A compassionate, integrated GOVEDA proposed model uniting dignified elder care, voluntary Gaushala and nature connection, sattvic nutrition, yoga, meditation, and mental well-being.'}
          </p>

          {/* Dual Clean Editorial CTAs */}
          <div className="mt-5 sm:mt-7 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3.5">
            <button
              type="button"
              onClick={() => onScrollTo('ec-model')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#154A24] hover:bg-[#0F391B] text-white px-4 sm:px-6 py-3 text-[13px] sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              <span>{lang === 'hi' ? 'पहल जानें' : 'Explore Model'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('ec-join')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-white hover:bg-[#F3F8EE] text-[#154A24] border border-[#154A24]/30 px-4 sm:px-6 py-3 text-[13px] sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#4B8E27] shrink-0" aria-hidden="true" />
              <span>{lang === 'hi' ? 'सहयोग करें' : 'Collaborate'}</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Full-Bleed Balanced Photorealistic Verandah Hero (Zero Blank Left Side) */}
        <div className="mt-6 sm:mt-8 lg:hidden -mx-4 sm:mx-0 relative">
          <div className="relative overflow-hidden sm:rounded-2xl">
            <img
              src={GENERATED_ASSETS.elderlyHeroMobile}
              alt={
                lang === 'hi'
                  ? 'धूप से भरे राजस्थानी बरामदे में चाय और पुस्तक के साथ मुस्कुराते वरिष्ठ दंपति और लॉन में ध्यान करते वृद्धजन'
                  : 'Joyful Indian seniors laughing over tea on a sunlit Rajasthani verandah with elders meditating on the courtyard lawn'
              }
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover object-center"
            />
            <div
              className="absolute inset-x-0 top-0 h-12 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, #FCFBF7 0%, rgba(252,251,247,0.45) 45%, rgba(252,251,247,0) 100%)',
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
              style={{
                background: 'linear-gradient(0deg, #FCFBF7 0%, rgba(252,251,247,0.45) 45%, rgba(252,251,247,0) 100%)',
              }}
            />
          </div>
        </div>

        {/* Transparent 4-Pillar Unboxed Hairline Value Strip */}
        <div className="mt-6 sm:mt-10 lg:mt-14 pt-5 sm:pt-6 border-t border-[#DFCFAF]/90 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              kHi: '100% स्वैच्छिक सहभागिता',
              kEn: '100% Voluntary Participation',
              dHi: 'गौसेवा व बागवानी पूरी तरह इच्छानुसार — कोई श्रम दबाव नहीं',
              dEn: 'Gauseva & gardening strictly optional—never mandatory',
            },
            {
              kHi: 'गौशाला से जुड़ा सात्विक आहार',
              kEn: 'Gaushala-Linked Sattvic Food',
              dHi: 'गुणवत्ता-जाँचे दूध, दही, छाछ, पनीर व जैविक सब्ज़ियाँ',
              dEn: 'Quality-tested dairy & locally grown organic vegetables',
            },
            {
              kHi: 'योग, ध्यान व मानसिक सहयोग',
              kEn: 'Yoga, Meditation & Counseling',
              dHi: 'चेयर योग, सत्संग, संगीत व विशेषज्ञ मानसिक परामर्श',
              dEn: 'Guided yoga, satsang, music & specialist mental support',
            },
            {
              kHi: 'प्रस्तावित दीर्घकालीन विज़न',
              kEn: 'Proposed Long-Term Vision',
              dHi: 'चरणबद्ध विकास व पारदर्शी लाइसेंसिंग के साथ स्थापना',
              dEn: 'Phased setup with trained staff & statutory licensing',
            },
          ].map((item) => (
            <div
              key={item.kEn}
              className="rounded-xl bg-white/80 lg:bg-transparent border border-[#EAE2CE] lg:border-0 p-3 lg:p-0 space-y-1"
            >
              <p className={`text-xs sm:text-[13.5px] font-extrabold text-[#123D1B] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? item.kHi : item.kEn}
              </p>
              <p className={`text-[11px] sm:text-xs text-[#46594B] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? item.dHi : item.dEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   2. WHY IT MATTERS & PURPOSE — उद्देश्य और आवश्यकता
   ============================================================================ */
export function ElderlyWhyMatters({ lang }: { lang: Language }) {
  const pillars = [
    {
      num: '01',
      titleHi: 'बढ़ता अकेलापन और भावनात्मक दूरी',
      titleEn: 'Growing Isolation & Emotional Distance',
      descHi:
        'बदलती जीवनशैली, पलायन और व्यस्त दिनचर्या के कारण कई वरिष्ठ नागरिक अपने ही परिवेश में संवाद, अपनत्व और सहारे की कमी महसूस करते हैं।',
      descEn:
        'Shifting lifestyles and rural-urban migration leave many elders without daily conversation, emotional warmth, and reliable companionship.',
    },
    {
      num: '02',
      titleHi: 'संतुलित आहार व सुरक्षित परिवेश का अभाव',
      titleEn: 'Need for Pure Nutrition & Safe Spaces',
      descHi:
        'बढ़ती उम्र में सुपाच्य सात्विक भोजन, स्वच्छ वातावरण, सुगम रास्ते और समय पर स्वास्थ्य जाँच सम्मानजनक जीवन की बुनियादी आवश्यकता हैं।',
      descEn:
        'Aging gracefully requires wholesome, digestible food, clean elder-friendly pathways, tranquil green spaces, and preventive healthcare.',
    },
    {
      num: '03',
      titleHi: 'मानसिक शांति और सार्थक दिनचर्या',
      titleEn: 'Mental Peace & Purposeful Daily Rhythm',
      descHi:
        'योग, ध्यान, सत्संग, संगीत, पुस्तकालय और रचनात्मक गतिविधियाँ मन को शांत रखती हैं तथा जीवन में सकारात्मक ऊर्जा व जुड़ाव बनाए रखती हैं।',
      descEn:
        'Gentle yoga, meditation, satsang, music, reading, and indoor games calm stress and nurture emotional vitality.',
    },
    {
      num: '04',
      titleHi: 'GOVEDA का समग्र मानवीय समाधान',
      titleEn: 'GOVEDA’s Integrated Compassionate Response',
      descHi:
        'GOVEDA वृद्धाश्रम को अलग-थलग इमारत नहीं, बल्कि गौशाला, जैविक उद्यान, हरियाली और समुदाय से जुड़ा एक जीवंत, घर-जैसा कल्याण परिसर बनाने की परिकल्पना करता है।',
      descEn:
        'Rather than isolated institutions, GOVEDA envisions vibrant home-like sanctuaries organically linked with Gaushalas, organic gardens, greenery, and community.',
    },
  ];

  return (
    <section id="ec-why" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#E5DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#1D542B]">
              {lang === 'hi' ? '01 · उद्देश्य — क्यों ज़रूरी है यह पहल?' : '01 · Purpose — Why This Matters'}
            </span>
            <span className="h-px w-16 bg-[#C8B37B]" aria-hidden="true" />
          </div>
          <h2
            className={`text-2xl sm:text-4xl font-extrabold text-[#113B19] leading-tight ${
              lang === 'hi' ? 'font-hindi' : 'font-editorial'
            }`}
          >
            {lang === 'hi'
              ? 'केवल आश्रय नहीं — वृद्धजनों के लिए गरिमा, अपनापन और मानसिक शांति'
              : 'More Than Shelter — Dignity, Warmth & Mental Well-being for Elders'}
            <GovedaLeafFlourish className="w-16 h-4 ml-2 -mb-0.5" />
          </h2>
          <p className="mt-2 text-sm sm:text-base italic font-editorial text-[#285430]">
            {lang === 'hi'
              ? 'Why Compassionate, Nature-Connected Senior Care Matters Today'
              : 'वृद्धजनों को परिवार जैसा स्नेह, प्रकृति का सान्निध्य और सुरक्षित देखभाल'}
          </p>
          <div className="mt-3.5 h-[2.5px] w-14 bg-[#95C954] rounded-full" aria-hidden="true" />
          <p className={`mt-4 text-sm sm:text-[15px] text-[#35463A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
            {lang === 'hi'
              ? 'हमारे वरिष्ठ नागरिक समाज की अनुभव-संपदा हैं। GOVEDA का उद्देश्य ऐसे शांत, सुरक्षित और संवेदनशील केंद्रों की परिकल्पना करना है जहाँ वृद्धजनों को अकेलापन नहीं, बल्कि सम्मान, पौष्टिक सात्विक आहार, स्वास्थ्य सहयोग और सकारात्मक जीवनशैली मिले।'
              : 'Senior citizens carry the wisdom of our communities. GOVEDA envisions calm, dignified, home-like sanctuaries where elders experience belonging, wholesome sattvic food, attentive care, and mental peace.'}
          </p>
        </div>

        {/* 4 Hairline-Divided Editorial Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#E5DEC8] pt-6 border-t border-[#E5DEC8]">
          {pillars.map((p, idx) => (
            <div
              key={p.num}
              className={`space-y-2 ${idx > 0 ? 'lg:pl-6' : ''} ${idx < 3 ? 'lg:pr-6' : ''}`}
            >
              <span className="text-xs font-extrabold tracking-[0.14em] text-[#6A8E3E]">
                {p.num}
              </span>
              <h3 className={`text-base font-extrabold text-[#123D1B] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? p.titleHi : p.titleEn}
              </h3>
              <p className={`text-xs sm:text-[13.5px] text-[#3F5145] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? p.descHi : p.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   3. HOLISTIC CARE MODEL — PANORAMIC CAMPUS WITH HERO-STYLE ELBOW LEADER LINES
   Matches the exact centerpiece of the reference layout!
   ============================================================================ */
interface CampusAnnotation {
  id: string;
  num: number;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  targetX: number; // in 1000x562 viewBox
  targetY: number;
  elbowX: number;
  elbowY: number;
  endX: number;
  endY: number;
  mobileLeft: string;
  mobileTop: string;
}

const CAMPUS_ZONES: CampusAnnotation[] = [
  {
    id: 'gaushala',
    num: 1,
    titleHi: 'गौशाला',
    titleEn: 'Gaushala Courtyard',
    descHi: 'पशु कल्याण, स्वैच्छिक गौसेवा एवं प्राकृतिक संसाधन',
    descEn: 'Cow welfare, voluntary Gauseva & natural resources',
    targetX: 165,
    targetY: 270,
    elbowX: 165,
    elbowY: 96,
    endX: 205,
    endY: 96,
    mobileLeft: '16%',
    mobileTop: '48%',
  },
  {
    id: 'care-home',
    num: 2,
    titleHi: 'वृद्धजन देखभाल केंद्र',
    titleEn: 'Senior Care Home',
    descHi: 'सुरक्षित, सम्मानजनक, घर जैसा और सामुदायिक जीवन',
    descEn: 'Safe, dignified, home-like community living',
    targetX: 555,
    targetY: 205,
    elbowX: 555,
    elbowY: 90,
    endX: 555,
    endY: 90,
    mobileLeft: '56%',
    mobileTop: '37%',
  },
  {
    id: 'green-campus',
    num: 3,
    titleHi: 'हरित वातावरण',
    titleEn: 'Green Environment',
    descHi: 'छायादार वृक्ष, शांत उद्यान, स्वच्छ व सुरक्षित परिसर',
    descEn: 'Shade trees, serene pavilion & peaceful sanctuary',
    targetX: 845,
    targetY: 250,
    elbowX: 845,
    elbowY: 96,
    endX: 805,
    endY: 96,
    mobileLeft: '84%',
    mobileTop: '44%',
  },
  {
    id: 'yoga-wellness',
    num: 4,
    titleHi: 'स्वास्थ्य व कल्याण',
    titleEn: 'Health, Yoga & Meditation',
    descHi: 'प्रातःकालीन योग, ध्यान, प्राणायाम व मानसिक संतुलन',
    descEn: 'Morning yoga, meditation, breathing & mental balance',
    targetX: 375,
    targetY: 405,
    elbowX: 375,
    elbowY: 505,
    endX: 315,
    endY: 505,
    mobileLeft: '37%',
    mobileTop: '72%',
  },
  {
    id: 'organic-garden',
    num: 5,
    titleHi: 'जैविक खेती व रसोई बाग',
    titleEn: 'Organic Kitchen Garden',
    descHi: 'ताज़ा जैविक सब्ज़ियाँ, पौष्टिक आहार व स्वावलंबन',
    descEn: 'Fresh organic produce, wholesome food & self-reliance',
    targetX: 775,
    targetY: 420,
    elbowX: 775,
    elbowY: 505,
    endX: 815,
    endY: 505,
    mobileLeft: '77%',
    mobileTop: '74%',
  },
];

export function ElderlyHolisticModel({ lang }: { lang: Language }) {
  const [activeId, setActiveId] = useState<string>('care-home');
  const activeZone = CAMPUS_ZONES.find((z) => z.id === activeId) ?? CAMPUS_ZONES[1];

  return (
    <section id="ec-model" className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#E5DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header Flanked by Fine Warm-Gold Hairlines (Matching Reference) */}
        <div className="text-center max-w-4xl mx-auto space-y-2.5">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span className="hidden sm:block h-px w-20 md:w-32 bg-[#C8B37B]" aria-hidden="true" />
            <h2
              className={`text-2xl sm:text-4xl font-extrabold text-[#113B19] tracking-tight ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? 'एक समग्र देखभाल मॉडल' : 'A Holistic Model of Elder Care'}
            </h2>
            <span className="hidden sm:block h-px w-20 md:w-32 bg-[#C8B37B]" aria-hidden="true" />
          </div>

          <p className={`text-xs sm:text-[15px] font-bold text-[#2E5933] ${lang === 'hi' ? 'font-hindi' : ''}`}>
            {lang === 'hi'
              ? 'गौशाला + वृद्धजन देखभाल + जैविक खेती + हरित वातावरण + स्वास्थ्य एवं कल्याण'
              : 'Gaushala + Senior Care + Organic Farming + Green Environment + Health & Wellness'}
          </p>
        </div>

        {/* DESKTOP: 3 Top Callouts + Seamless Panorama with Bent SVG Leader Lines + 2 Bottom Callouts */}
        <div className="hidden lg:block mt-10">
          {/* Top 3 Callout Headers */}
          <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto px-4 mb-2">
            {CAMPUS_ZONES.slice(0, 3).map((zone) => {
              const isActive = activeId === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onMouseEnter={() => setActiveId(zone.id)}
                  onFocus={() => setActiveId(zone.id)}
                  onClick={() => setActiveId(zone.id)}
                  className={`text-left rounded-2xl px-4 py-3 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F8FAF3] border-[#6EB83A] shadow-sm'
                      : 'bg-[#FCFBF7]/85 border-[#DFCFAF]/80 hover:border-[#8BBF4D]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isActive ? 'bg-[#154A24] text-[#D7F7B2]' : 'bg-[#EAF3DF] text-[#154A24]'
                      }`}
                    >
                      {zone.num}
                    </span>
                    <div>
                      <p className={`text-sm font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        {lang === 'hi' ? zone.titleHi : zone.titleEn}
                      </p>
                      <p className={`text-xs text-[#435648] leading-snug mt-0.5 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        {lang === 'hi' ? zone.descHi : zone.descEn}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seamless Panorama Canvas + Bent Elbow Leader Lines SVG */}
          <div className="relative max-w-6xl mx-auto -my-5">
            <img
              src={GENERATED_ASSETS.elderlyHolisticCampus}
              alt={
                lang === 'hi'
                  ? 'गौशाला, राजस्थानी वृद्धजन देखभाल केंद्र, जैविक रसोई बाग, प्रातःकालीन योग लॉन और हरित उद्यान को जोड़ता समग्र परिसर'
                  : 'Panoramic seamless illustration of GOVEDA holistic campus connecting Gaushala, Rajasthani senior care home, organic garden, yoga lawn, and green grove'
              }
              referrerPolicy="no-referrer"
              className="w-full aspect-[16/9] object-contain mix-blend-multiply select-none pointer-events-none"
            />

            {/* Crisp Interactive Bent Elbow Leader Lines + Luminous Target Halos */}
            <svg
              viewBox="0 0 1000 562"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              {CAMPUS_ZONES.map((zone) => {
                const isActive = activeId === zone.id;
                const strokeColor = isActive ? '#154A24' : '#6A8F3D';
                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveId(zone.id)}
                    onClick={() => setActiveId(zone.id)}
                  >
                    {/* Bent elbow path */}
                    <polyline
                      points={`${zone.targetX},${zone.targetY} ${zone.elbowX},${zone.elbowY} ${zone.endX},${zone.endY}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isActive ? 2.4 : 1.5}
                      strokeDasharray={isActive ? 'none' : '4 3'}
                      opacity={isActive ? 0.95 : 0.72}
                    />
                    {/* Luminous outer halo */}
                    <circle
                      cx={zone.targetX}
                      cy={zone.targetY}
                      r={isActive ? 13 : 9.5}
                      fill="#7CC042"
                      opacity={isActive ? 0.28 : 0.16}
                    />
                    {/* Crisp target ring */}
                    <circle
                      cx={zone.targetX}
                      cy={zone.targetY}
                      r={isActive ? 7.5 : 6}
                      fill="#FFFFFF"
                      stroke={strokeColor}
                      strokeWidth={2.2}
                    />
                    {/* Center focal dot */}
                    <circle
                      cx={zone.targetX}
                      cy={zone.targetY}
                      r={3.2}
                      fill={isActive ? '#154A24' : '#7CC042'}
                    />
                    {/* Terminal endpoint dot */}
                    <circle
                      cx={zone.endX}
                      cy={zone.endY}
                      r={3.2}
                      fill={strokeColor}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom 2 Callout Headers */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto px-4 mt-2">
            {CAMPUS_ZONES.slice(3, 5).map((zone) => {
              const isActive = activeId === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onMouseEnter={() => setActiveId(zone.id)}
                  onFocus={() => setActiveId(zone.id)}
                  onClick={() => setActiveId(zone.id)}
                  className={`text-left rounded-2xl px-4 py-3 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F8FAF3] border-[#6EB83A] shadow-sm'
                      : 'bg-[#FCFBF7]/85 border-[#DFCFAF]/80 hover:border-[#8BBF4D]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isActive ? 'bg-[#154A24] text-[#D7F7B2]' : 'bg-[#EAF3DF] text-[#154A24]'
                      }`}
                    >
                      {zone.num}
                    </span>
                    <div>
                      <p className={`text-sm font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        {lang === 'hi' ? zone.titleHi : zone.titleEn}
                      </p>
                      <p className={`text-xs text-[#435648] leading-snug mt-0.5 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        {lang === 'hi' ? zone.descHi : zone.descEn}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE & TABLET: Full-Bleed Photorealistic Campus + Tappable Pins + Step Spotlight */}
        <div className="lg:hidden mt-6 space-y-4">
          <div className="relative -mx-4 sm:mx-0">
            <img
              src={GENERATED_ASSETS.elderlyHolisticCampus}
              alt={
                lang === 'hi'
                  ? 'समग्र वृद्धजन देखभाल और गौशाला परिसर का दृश्य'
                  : 'Holistic senior citizen care and Gaushala sanctuary campus'
              }
              referrerPolicy="no-referrer"
              className="w-full aspect-[16/9] object-contain mix-blend-multiply select-none"
            />
            {CAMPUS_ZONES.map((zone) => {
              const isActive = activeId === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setActiveId(zone.id)}
                  style={{ left: zone.mobileLeft, top: zone.mobileTop }}
                  aria-label={lang === 'hi' ? zone.titleHi : zone.titleEn}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-xs font-extrabold flex items-center justify-center border-2 transition-transform cursor-pointer ${
                    isActive
                      ? 'bg-[#154A24] text-[#D7F7B2] border-white scale-115 shadow-lg ring-4 ring-[#7CC042]/35'
                      : 'bg-white/95 text-[#154A24] border-[#6EB83A] shadow-sm'
                  }`}
                >
                  {zone.num}
                </button>
              );
            })}
          </div>

          {/* Active Spotlight Card + Horizontal Scrollable Zone Chips */}
          <div className="rounded-2xl bg-[#FAF8F2] border border-[#DFCFAF] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-[15px] font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                0{activeZone.num} · {lang === 'hi' ? activeZone.titleHi : activeZone.titleEn}
              </p>
              <span className="text-[11px] font-bold text-[#5A7B3B] shrink-0">
                {activeZone.num} / {CAMPUS_ZONES.length}
              </span>
            </div>
            <p className={`text-[13px] text-[#3C4F41] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi' ? activeZone.descHi : activeZone.descEn}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {CAMPUS_ZONES.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setActiveId(z.id)}
                  className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    activeId === z.id
                      ? 'bg-[#154A24] text-white'
                      : 'bg-white border border-[#DFCFAF] text-[#294A30]'
                  }`}
                >
                  {z.num}. {lang === 'hi' ? z.titleHi : z.titleEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   4. DIGNIFIED LIVING, SAFE CAMPUS & GAUSHALA-LINKED SATTVIC FOOD
   ============================================================================ */
export function ElderlyDignifiedCareAndFood({ lang }: { lang: Language }) {
  const facilities = [
    {
      icon: Home,
      hi: 'सुरक्षित एवं स्वच्छ आवास',
      en: 'Safe, Home-Like Living',
      subHi: 'हवादार कमरे, ध्यान कक्ष, भोजन कक्ष व शांत परिसर',
      subEn: 'Clean rooms, meditation hall, dining hall & calm courtyard',
    },
    {
      icon: Utensils,
      hi: 'सात्विक व पौष्टिक भोजन',
      en: 'Sattvic & Pure Meals',
      subHi: 'गौशाला से जुड़े दूध, दही, छाछ, पनीर व जैविक सब्ज़ियाँ',
      subEn: 'Quality-tested dairy & locally grown organic produce',
    },
    {
      icon: Stethoscope,
      hi: 'नियमित स्वास्थ्य जाँच',
      en: 'Preventive Health Checks',
      subHi: 'आवश्यकतानुसार चिकित्सा सहयोग व स्वास्थ्य परामर्श',
      subEn: 'Regular checkups & timely physician coordination',
    },
    {
      icon: Accessibility,
      hi: 'सुगम एवं सुरक्षित आवागमन',
      en: 'Elder-Friendly Access',
      subHi: 'सुरक्षित रास्ते, बैठने की जगह व सुगम शौचालय',
      subEn: 'Non-slip walkways, benches & accessible washrooms',
    },
    {
      icon: UserCheck,
      hi: 'प्रशिक्षित देखभाल सहयोगी',
      en: 'Trained Care Staff',
      subHi: 'संवेदनशील, सम्मानजनक और प्रशिक्षित सेवा सहयोग',
      subEn: 'Compassionate, trained staff supporting daily dignity',
    },
    {
      icon: ShieldAlert,
      hi: 'आपातकालीन सहायता',
      en: 'Emergency Support',
      subHi: 'आवश्यकतानुसार त्वरित चिकित्सा व सुरक्षा समन्वय',
      subEn: 'Prompt medical response & safety coordination',
    },
  ];

  const sattvicItems = [
    { hi: 'गुणवत्ता-जाँचा शुद्ध दूध', en: 'Quality-Tested Pure Milk' },
    { hi: 'ताज़ा दही व छाछ', en: 'Fresh Curd & Buttermilk' },
    { hi: 'प्राकृतिक लस्सी व पनीर', en: 'Natural Lassi & Paneer' },
    { hi: 'स्थानीय जैविक सब्ज़ियाँ व फल', en: 'Local Organic Vegetables & Fruits' },
  ];

  return (
    <section id="ec-care" className="scroll-mt-32 bg-[#FAF8F2] py-14 sm:py-18 border-b border-[#E5DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Row: Left Editorial Intro + Right 6-Icon Strip (Matching Reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3 space-y-2.5">
            <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#5A7B3B]">
              {lang === 'hi' ? '02 · घर जैसा सुरक्षित परिसर' : '02 · Safe Home-Like Campus'}
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold text-[#113B19] leading-tight ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? 'सम्मानजनक आवास एवं देखभाल' : 'Dignified Living & Daily Care'}
            </h2>
            <p className={`text-xs sm:text-sm text-[#415446] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'सुरक्षित, स्वच्छ, आरामदायक और गरिमापूर्ण जीवन के लिए आवश्यक बुनियादी सुविधाएँ।'
                : 'Essential facilities designed for cleanliness, mobility, nourishment, and serene everyday living.'}
            </p>
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-0 lg:divide-x lg:divide-[#E1D7BE]">
            {facilities.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.en}
                  className="flex flex-col items-center text-center px-3 py-2 space-y-2"
                >
                  <div className="w-11 h-11 rounded-full bg-white border border-[#DFCFAF] text-[#1D542B] flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <p className={`text-xs sm:text-[13px] font-extrabold text-[#123D1B] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? f.hi : f.en}
                  </p>
                  <p className={`text-[11px] text-[#4C5F52] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? f.subHi : f.subEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Gaushala-Linked Sattvic Nutrition Strip */}
        <div className="rounded-2xl bg-white border border-[#DFCFAF] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <p className="text-xs font-extrabold tracking-[0.1em] uppercase text-[#5A7B3B]">
              {lang === 'hi' ? 'गौशाला से जुड़ा सात्विक एवं पौष्टिक भोजन' : 'Gaushala-Linked Sattvic & Wholesome Nutrition'}
            </p>
            <h3 className={`text-lg sm:text-xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'शुद्ध, ताज़ा और व्यक्ति के स्वास्थ्य के अनुरूप सात्विक आहार व्यवस्था'
                : 'Fresh, Quality-Tested Sattvic Meals Tailored to Individual Health Needs'}
            </h3>
            <p className={`text-xs sm:text-[13.5px] text-[#3F5145] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'गौशाला और स्थानीय जैविक रसोई बाग से समन्वित होकर शुद्ध व गुणवत्ता-जाँचे डेयरी उत्पाद तथा ताज़ी मौसमी सब्ज़ियाँ उपलब्ध कराने की परिकल्पना है। हर वरिष्ठ नागरिक की आयु, पाचन और चिकित्सकीय सलाह के अनुसार ही भोजन दिया जाएगा।'
                : 'Coordinated with nearby Gaushalas and campus organic kitchen gardens, the model emphasizes clean, quality-tested dairy and fresh seasonal vegetables—always adapted to each resident’s age, digestion, and physician guidance.'}
            </p>
            <p className="pt-1 text-[11.5px] font-semibold text-[#7A4B0C] flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#A45D09]" aria-hidden="true" />
              <span>
                {lang === 'hi'
                  ? 'पारदर्शिता नोट: यह संतुलित पोषण की पहल है; किसी भी खाद्य पदार्थ से विशेष चिकित्सीय उपचार या बीमारी ठीक होने की गारंटी नहीं दी जाती।'
                  : 'Transparency Note: Focused purely on balanced everyday nourishment; no specific medical cure or clinical health outcome is guaranteed.'}
              </span>
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {sattvicItems.map((item) => (
              <div
                key={item.en}
                className="rounded-xl bg-[#FAF8F2] border border-[#E5DEC8] px-3.5 py-3 flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#4B8E27] shrink-0" aria-hidden="true" />
                <span className={`text-xs sm:text-[13px] font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? item.hi : item.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   5. THREE CORE EXPERIENCE PILLARS (Voluntary Gauseva · Nature · Yoga & Mental Health)
   Matches the 3-column painterly trio in the reference layout!
   ============================================================================ */
export function ElderlyExperienceTrio({ lang }: { lang: Language }) {
  return (
    <section id="ec-wellness" className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#E5DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#1D542B]">
              {lang === 'hi' ? '03 · स्वैच्छिक सहभागिता, प्रकृति व मानसिक शांति' : '03 · Voluntary Life, Nature & Mental Peace'}
            </span>
            <span className="h-px w-16 bg-[#C8B37B]" aria-hidden="true" />
          </div>
          <h2
            className={`text-2xl sm:text-4xl font-extrabold text-[#113B19] leading-tight ${
              lang === 'hi' ? 'font-hindi' : 'font-editorial'
            }`}
          >
            {lang === 'hi'
              ? 'गौशाला, प्रकृति, योग और मानसिक कल्याण का संतुलित संगम'
              : 'Gaushala Connection, Nature, Yoga & Mental Well-being'}
            <GovedaLeafFlourish className="w-16 h-4 ml-2 -mb-0.5" />
          </h2>
        </div>

        {/* 3 Photorealistic Editorial Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-7">
          {/* PILLAR 1: Voluntary Gaushala Connection */}
          <article className="flex flex-col">
            <div className="relative overflow-hidden rounded-2xl bg-[#FCFBF7] shadow-xs">
              <img
                src={GENERATED_ASSETS.elderlyGausevaVoluntary}
                alt={
                  lang === 'hi'
                    ? 'गौशाला परिसर में मुस्कुराते हुए देशी गाय को हरा चारा खिलाते वरिष्ठ नागरिक'
                    : 'Smiling Indian senior couple gently offering fresh green fodder to a calm indigenous cow'
                }
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover object-center"
              />
            </div>
            <div className="pt-5 space-y-2.5 flex-1 flex flex-col">
              <h3 className={`text-lg sm:text-xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? 'गौशाला से स्वैच्छिक जुड़ाव' : 'Voluntary Gaushala Connection'}
              </h3>
              <p className={`text-xs sm:text-[14px] text-[#3B4E40] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'इच्छानुसार एवं स्वास्थ्य के अनुसार — गायों का स्नेहपूर्वक अवलोकन, हरा चारा या स्वच्छ जल अर्पित करना और गौशाला के शांत परिवेश में हल्की सैर। पशुओं के सान्निध्य से भावनात्मक सुकून और अपनत्व मिलता है।'
                  : 'Strictly according to personal comfort and health—peaceful observation of indigenous cows, offering green fodder or water, and gentle walks in calm surroundings.'}
              </p>
              <div className="mt-auto pt-3">
                <div className="rounded-xl bg-[#FFF9EE] border border-[#E2C285] px-3.5 py-2.5 flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#A45D09] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className={`text-[11.5px] font-bold text-[#6E3D04] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi'
                      ? 'यह पूरी तरह वैकल्पिक है — किसी भी वरिष्ठ नागरिक पर भाग लेने या श्रम करने का कोई दबाव नहीं।'
                      : '100% optional — zero mandatory participation and strictly no compulsory work or labor.'}
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* PILLAR 2: Life Amidst Nature & Organic Gardening */}
          <article className="flex flex-col">
            <div className="relative overflow-hidden rounded-2xl bg-[#FCFBF7] shadow-xs">
              <img
                src={GENERATED_ASSETS.elderlyNatureGarden}
                alt={
                  lang === 'hi'
                    ? 'जैविक रसोई बाग और फूलों की क्यारी में हल्की बागवानी करते प्रसन्न वरिष्ठ नागरिक'
                    : 'Joyful Indian seniors gently tending an organic vegetable and marigold kitchen garden'
                }
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover object-center"
              />
            </div>
            <div className="pt-5 space-y-2.5 flex-1 flex flex-col">
              <h3 className={`text-lg sm:text-xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? 'प्रकृति के बीच जीवन व जैविक बागवानी' : 'Life Amidst Nature & Organic Gardening'}
              </h3>
              <p className={`text-xs sm:text-[14px] text-[#3B4E40] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'जैविक सब्ज़ी बाग, फलदार व छायादार वृक्ष, औषधीय पौधे, वर्षा जल संचयन और इच्छानुसार हल्का बागवानी कार्य। मिट्टी, हरियाली और ताज़ी हवा के बीच रहने से मन में ताज़गी और सकारात्मकता बनी रहती है।'
                  : 'Organic kitchen gardens, fruit and shade trees, medicinal herbs, rainwater harvesting, and purely voluntary light gardening—bringing fresh air, gentle motion, and joy.'}
              </p>
              <div className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] font-semibold text-[#2C5B33]">
                <span className="inline-flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-[#5A9A32]" aria-hidden="true" />
                  {lang === 'hi' ? 'रसोई बाग व औषधीय पौधे' : 'Kitchen & Herb Gardens'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-[#B58225]" aria-hidden="true" />
                  {lang === 'hi' ? 'छायादार सुरक्षित उद्यान' : 'Shaded Safe Walkways'}
                </span>
              </div>
            </div>
          </article>

          {/* PILLAR 3: Yoga, Meditation, Satsang & Mental Well-being */}
          <article className="flex flex-col">
            <div className="relative overflow-hidden rounded-2xl bg-[#FCFBF7] shadow-xs">
              <img
                src={GENERATED_ASSETS.elderlyYogaWellness}
                alt={
                  lang === 'hi'
                    ? 'धूप से भरे राजस्थानी आँगन में मैट और कुर्सी पर शांत योग व ध्यान करते वरिष्ठ नागरिक'
                    : 'Serene elderly men and women practicing gentle yoga, chair yoga, and morning meditation in a sunlit Rajasthani courtyard'
                }
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover object-center"
              />
            </div>
            <div className="pt-5 space-y-2.5 flex-1 flex flex-col">
              <h3 className={`text-lg sm:text-xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi' ? 'योग, ध्यान, सत्संग और मानसिक कल्याण' : 'Yoga, Meditation, Satsang & Mental Wellness'}
              </h3>
              <p className={`text-xs sm:text-[14px] text-[#3B4E40] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'प्रातः व संध्या ध्यान, प्रशिक्षित मार्गदर्शक के साथ हल्का योग, चेयर योग, सुरक्षित श्वसन अभ्यास व मौन विश्राम। साथ ही स्वैच्छिक सत्संग-भजन, संगीत, पुस्तकालय, कैरम, शतरंज, कहानी संवाद व चित्रकला।'
                  : 'Morning and evening meditation, guided gentle & chair yoga, safe breathing, silent rest, voluntary satsang and inspiring reading, plus music, library, storytelling, painting, carrom, and chess.'}
              </p>
              <div className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] font-semibold text-[#2C5B33]">
                <span className="inline-flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-[#5A9A32]" aria-hidden="true" />
                  {lang === 'hi' ? 'संगीत, सत्संग व इनडोर खेल' : 'Music, Satsang & Games'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#5A9A32]" aria-hidden="true" />
                  {lang === 'hi' ? 'पुस्तकालय व संवाद' : 'Library & Storytelling'}
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* Dedicated Mental Health Support & Statutory Licensing Safeguard Panel */}
        <div className="rounded-2xl bg-[#F5F9F0] border border-[#C8DDB6] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#154A24] text-[#D7F7B2] flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-extrabold tracking-[0.1em] uppercase text-[#4B7F2D]">
                {lang === 'hi' ? 'मानसिक स्वास्थ्य सहायता (Mental Health Support)' : 'Professional Mental Health Support'}
              </p>
              <h3 className={`text-base sm:text-lg font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'योग्य चिकित्सक, मनोवैज्ञानिक एवं मानसिक स्वास्थ्य विशेषज्ञों का परामर्श'
                  : 'Guidance From Qualified Doctors, Psychologists & Mental-Health Specialists'}
              </h3>
              <p className={`text-xs sm:text-[13.5px] text-[#35463A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'तनाव प्रबंधन, भावनात्मक सहारे, स्मृति-सजगता और एकाकीपन से उबरने के लिए संवेदनशील संवाद एवं प्रशिक्षित परामर्शदाताओं का समन्वय प्रस्तावित है।'
                  : 'Compassionate counseling, stress management, and emotional support coordinated with qualified healthcare and psychology professionals.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl bg-white/90 border border-[#D8C59B] p-4 space-y-1.5">
            <p className="text-xs font-extrabold text-[#7B4707] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#A45D09] shrink-0" aria-hidden="true" />
              <span>{lang === 'hi' ? 'गंभीर मानसिक स्वास्थ्य हेतु वैधानिक स्पष्टीकरण' : 'Clinical & Statutory Licensing Safeguard'}</span>
            </p>
            <p className={`text-[11.5px] sm:text-xs text-[#543A14] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'गंभीर मानसिक स्वास्थ्य स्थितियों की देखभाल केवल योग्य चिकित्सकों, प्रशिक्षित स्टाफ तथा आवश्यक वैधानिक लाइसेंस व अनुमतियों के अंतर्गत ही की जाएगी।'
                : 'Support for serious mental-health conditions will strictly be undertaken only with qualified medical specialists, trained staff, and proper statutory licensing.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   6. PROPOSED DAILY ROUTINE — HORIZONTAL LEFT-TO-RIGHT SEQUENTIAL TIMELINE
   Scroll-snap horizontal flow on mobile so progression reads clearly left → right!
   ============================================================================ */
export function ElderlyDailyRoutine({ lang }: { lang: Language }) {
  const steps = [
    {
      step: '01',
      timeHi: 'प्रातःकाल',
      timeEn: 'Early Morning',
      titleHi: 'योग, चेयर योग व ध्यान',
      titleEn: 'Yoga, Chair Yoga & Meditation',
      descHi: 'शांत वातावरण में सुरक्षित श्वसन, हल्का योग और मौन ध्यान।',
      descEn: 'Safe breathing, gentle/chair yoga, and quiet morning meditation.',
    },
    {
      step: '02',
      timeHi: 'सुबह',
      timeEn: 'Morning',
      titleHi: 'पौष्टिक सात्विक नाश्ता',
      titleEn: 'Nutritious Sattvic Breakfast',
      descHi: 'स्वास्थ्य के अनुरूप ताज़ा, सुपाच्य और शुद्ध सात्विक नाश्ता।',
      descEn: 'Fresh, digestible sattvic breakfast adapted to individual health.',
    },
    {
      step: '03',
      timeHi: 'पूर्वाह्न',
      timeEn: 'Late Morning',
      titleHi: 'स्वैच्छिक बागवानी या गौसेवा',
      titleEn: 'Optional Gardening or Gauseva',
      descHi: 'पूरी तरह इच्छानुसार — पौधों को देखना, गौशाला में समय या पठन।',
      descEn: 'Purely voluntary—tending herbs, calm Gaushala time, or reading.',
    },
    {
      step: '04',
      timeHi: 'दोपहर',
      timeEn: 'Afternoon',
      titleHi: 'भोजन एवं शांत विश्राम',
      titleEn: 'Wholesome Lunch & Rest',
      descHi: 'गौशाला-संबद्ध शुद्ध भोजन के बाद आरामदायक दोपहरी विश्राम।',
      descEn: 'Pure lunch followed by peaceful, unhurried afternoon rest.',
    },
    {
      step: '05',
      timeHi: 'अपराह्न',
      timeEn: 'Late Afternoon',
      titleHi: 'सत्संग, संगीत व इनडोर खेल',
      titleEn: 'Satsang, Music & Indoor Games',
      descHi: 'स्वैच्छिक भजन-संवाद, पुस्तकालय, कैरम, शतरंज व चित्रकला।',
      descEn: 'Voluntary satsang, music, library, carrom, chess & storytelling.',
    },
    {
      step: '06',
      timeHi: 'संध्याकाल',
      timeEn: 'Evening',
      titleHi: 'हल्की सैर, ध्यान व सामुदायिक संवाद',
      titleEn: 'Gentle Walk & Warm Companionship',
      descHi: 'हरित उद्यान में सुरक्षित सैर, संध्या प्रार्थना व सुपाच्य रात्रि भोजन।',
      descEn: 'Safe garden stroll, calm evening reflection, and light dinner.',
    },
  ];

  return (
    <section id="ec-routine" className="scroll-mt-32 bg-[#FAF8F2] py-14 sm:py-18 border-b border-[#E5DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#5A7B3B]">
                {lang === 'hi' ? '04 · संतुलित, शांत जीवन लय' : '04 · Gentle Daily Rhythm'}
              </span>
              <span className="h-px w-14 bg-[#C8B37B]" aria-hidden="true" />
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold text-[#113B19] ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? 'प्रस्तावित दैनिक दिनचर्या (पूर्णतः लचीली व स्वैच्छिक)' : 'Proposed Daily Routine (Flexible & Voluntary)'}
            </h2>
          </div>
          <p className="text-xs text-[#4C5F52] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#5A7B3B]" aria-hidden="true" />
            <span>
              {lang === 'hi'
                ? 'बाएँ से दाएँ स्वाइप कर पूरे दिन का क्रम देखें →'
                : 'Swipe left to right to follow the gentle daily flow →'}
            </span>
          </p>
        </div>

        {/* Sequential Left-to-Right Horizontal Strip (Scroll-Snap on Mobile, 6-Col on XL) */}
        <div className="flex xl:grid xl:grid-cols-6 gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 xl:mx-0 xl:px-0">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="snap-start shrink-0 w-[230px] sm:w-[250px] xl:w-auto relative rounded-2xl bg-white border border-[#DFCFAF] p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-extrabold tracking-[0.12em] text-[#5A7B3B]">
                    {s.step} · {lang === 'hi' ? s.timeHi : s.timeEn}
                  </span>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[#8EC549] shrink-0" aria-hidden="true" />
                  )}
                </div>
                <h3 className={`text-sm font-extrabold text-[#113B19] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? s.titleHi : s.titleEn}
                </h3>
                <p className={`mt-1.5 text-xs text-[#44574A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? s.descHi : s.descEn}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EFE8D6] h-1 w-10 rounded-full bg-[#8EC549]/60" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   7. COMMUNITY COMPANIONSHIP + 6-MISSION RADIAL INTERCONNECTION HUB DIAGRAM
   Directly mirrors the bottom half of the reference layout!
   ============================================================================ */
export function ElderlyCommunityAndInterconnections({
  lang,
  onNavigate,
}: {
  lang: Language;
  onNavigate: (path: string) => void;
}) {
  const communityPillars = [
    { icon: HeartHandshake, hi: 'स्वयंसेवक सहयोग', en: 'Volunteer Care' },
    { icon: Users, hi: 'परिवार व समुदाय सहभागिता', en: 'Family & Community' },
    { icon: Building2, hi: 'संस्थागत व CSR साझेदारी', en: 'Institutional & CSR' },
    { icon: Megaphone, hi: 'जागरूकता व संवेदनशीलता कार्यक्रम', en: 'Awareness & Empathy' },
  ];

  const leftMissions = [
    {
      slug: '/missions/self-reliant-gaushala',
      icon: Sparkles,
      titleHi: 'आत्मनिर्भर गौशाला मिशन',
      titleEn: 'Self-Reliant Gaushala Mission',
      descHi: 'सात्विक दुग्ध संसाधन, जैविक खाद और स्वैच्छिक गौसेवा सहयोग',
      descEn: 'Pure dairy, organic compost & voluntary Gauseva connection',
    },
    {
      slug: '/missions/organic-farming',
      icon: Sprout,
      titleHi: 'जैविक एवं आधुनिक खेती',
      titleEn: 'Organic & Modern Farming',
      descHi: 'रसोई बाग, पौष्टिक जैविक आहार और स्थानीय स्वावलंबन',
      descEn: 'Kitchen gardens, chemical-free food & rural self-reliance',
    },
    {
      slug: '/missions/biogas-cbg',
      icon: Flame,
      titleHi: 'बायोगैस एवं Bio-CNG',
      titleEn: 'Biogas & Clean Energy',
      descHi: 'जहाँ स्थानीय रूप से संभव हो, वहाँ स्वच्छ रसोई ऊर्जा संसाधन सहयोग',
      descEn: 'Clean kitchen fuel & eco-energy support wherever locally feasible',
    },
  ];

  const rightMissions = [
    {
      slug: '/missions/skill-development',
      icon: GraduationCap,
      titleHi: 'कौशल विकास एवं रोजगार',
      titleEn: 'Skill Development & Jobs',
      descHi: 'देखभाल सहयोगी प्रशिक्षण, स्थानीय महिलाओं व युवाओं के लिए अवसर',
      descEn: 'Caregiver training & dignified rural youth livelihood skills',
    },
    {
      slug: '/missions/women-empowerment',
      icon: Users,
      titleHi: 'महिला सशक्तिकरण',
      titleEn: 'Women Empowerment',
      descHi: 'स्थानीय सहभागिता, सेवा कार्य और सम्मानजनक आजीविका के अवसर',
      descEn: 'Local women SHG participation, care roles & nutrition services',
    },
    {
      slug: '/missions/harit-rajasthan',
      icon: Trees,
      titleHi: 'हरित राजस्थान / वृक्षारोपण',
      titleEn: 'Harit Rajasthan & Plantation',
      descHi: 'परिसर में छायादार वृक्ष, हरित उद्यान और जल संरक्षण के प्रयास',
      descEn: 'Shade trees, green sanctuary orchards & water conservation',
    },
  ];

  return (
    <section id="ec-interconnections" className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#E5DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* PART A: COMMUNITY COMPANIONSHIP BAR */}
        <div className="rounded-2xl bg-[#FAF8F2] border border-[#E5DEC8] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-1.5">
            <h3 className={`text-xl sm:text-2xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
              {lang === 'hi' ? 'समुदाय का साथ' : 'Community Companionship'}
            </h3>
            <p className={`text-xs sm:text-sm text-[#435648] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'स्वयंसेवकों, परिवारों, स्थानीय समुदाय, चिकित्सकों, योग प्रशिक्षकों और संस्थागत साझेदारों के सहयोग से एक संवेदनशील व सहभागी वातावरण।'
                : 'A warm, participatory ecosystem shaped by volunteers, families, doctors, yoga trainers, local communities, and institutional partners.'}
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-[#DFCFAF]">
            {communityPillars.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.en} className="flex flex-col items-center text-center px-3 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#DFCFAF] text-[#266B2A] flex items-center justify-center">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <p className={`text-xs font-extrabold text-[#153E1E] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? c.hi : c.en}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* PART B: 6-MISSION RADIAL INTERCONNECTION HUB DIAGRAM */}
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <span className="hidden sm:block h-px w-20 md:w-28 bg-[#C8B37B]" aria-hidden="true" />
              <h2
                className={`text-2xl sm:text-3xl font-extrabold text-[#113B19] ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi' ? 'हमारे अन्य मिशनों से जुड़ाव' : 'Connected With Other GOVEDA Missions'}
              </h2>
              <span className="hidden sm:block h-px w-20 md:w-28 bg-[#C8B37B]" aria-hidden="true" />
            </div>
            <p className={`text-xs sm:text-sm text-[#435648] ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'वृद्धजन कल्याण को GOVEDA के व्यापक सामाजिक, पर्यावरणीय और ग्रामीण विकास मिशनों से जोड़ा गया है — किसी भी मिशन पर क्लिक कर विस्तार से जानें।'
                : 'Senior citizen care organically integrates with six core GOVEDA rural and ecological missions — select any mission to explore.'}
            </p>
          </div>

          {/* 3-Column Radial Hub Layout (Left 3 · Center Campus Vignette + Curves · Right 3) */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
            {/* Subtle Desktop Radial Connector Lines Behind Center */}
            <svg
              viewBox="0 0 1000 380"
              fill="none"
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              {/* Left 3 curves to center */}
              <path d="M 325 65 C 385 65, 395 155, 435 170" stroke="#C5B58B" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 325 190 C 370 190, 395 190, 425 190" stroke="#7CC042" strokeWidth="1.8" />
              <path d="M 325 315 C 385 315, 395 225, 435 210" stroke="#C5B58B" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Right 3 curves from center */}
              <path d="M 565 170 C 605 155, 615 65, 675 65" stroke="#C5B58B" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 575 190 C 605 190, 630 190, 675 190" stroke="#7CC042" strokeWidth="1.8" />
              <path d="M 565 210 C 605 225, 615 315, 675 315" stroke="#C5B58B" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Left 3 Connected Missions */}
            <div className="lg:col-span-4 space-y-4 relative z-10">
              {leftMissions.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.slug}
                    type="button"
                    onClick={() => onNavigate(m.slug)}
                    className="w-full text-left rounded-2xl bg-[#FCFBF7] hover:bg-[#F3F8EE] border border-[#E5DEC8] hover:border-[#7CC042] p-4 transition-all group cursor-pointer flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EEF5E6] text-[#1D542B] flex items-center justify-center shrink-0 group-hover:bg-[#154A24] group-hover:text-[#D7F7B2] transition-colors">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-extrabold text-[#113B19] group-hover:text-[#1D632E] flex items-center gap-1 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        <span>{lang === 'hi' ? m.titleHi : m.titleEn}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
                      </p>
                      <p className={`mt-1 text-xs text-[#475A4C] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        {lang === 'hi' ? m.descHi : m.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Center Seamless Architectural Campus Vignette (First on Mobile, Center on Desktop) */}
            <div className="order-first lg:order-none lg:col-span-4 flex flex-col items-center justify-center relative z-10 py-2">
              <div className="w-full max-w-[330px]">
                <img
                  src={GENERATED_ASSETS.elderlyCampusHub}
                  alt={
                    lang === 'hi'
                      ? 'वृद्धजन देखभाल केंद्र का केंद्रीय राजस्थानी हरित परिसर'
                      : 'Central Rajasthani Senior Citizen Care courtyard campus illustration'
                  }
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-contain mix-blend-multiply select-none"
                />
              </div>
              <div className="mt-1 text-center">
                <p className={`text-base sm:text-lg font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? 'वृद्धजन देखभाल केंद्र' : 'Senior Citizen Care Hub'}
                </p>
                <p className="text-xs font-semibold text-[#5A7B3B]">
                  {lang === 'hi' ? '(Senior Citizen Care & Wellness)' : '(वृद्धाश्रम एवं मानसिक कल्याण केंद्र)'}
                </p>
              </div>
            </div>

            {/* Right 3 Connected Missions */}
            <div className="lg:col-span-4 space-y-4 relative z-10">
              {rightMissions.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.slug}
                    type="button"
                    onClick={() => onNavigate(m.slug)}
                    className="w-full text-left rounded-2xl bg-[#FCFBF7] hover:bg-[#F3F8EE] border border-[#E5DEC8] hover:border-[#7CC042] p-4 transition-all group cursor-pointer flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EEF5E6] text-[#1D542B] flex items-center justify-center shrink-0 group-hover:bg-[#154A24] group-hover:text-[#D7F7B2] transition-colors">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-extrabold text-[#113B19] group-hover:text-[#1D632E] flex items-center gap-1 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        <span>{lang === 'hi' ? m.titleHi : m.titleEn}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
                      </p>
                      <p className={`mt-1 text-xs text-[#475A4C] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        {lang === 'hi' ? m.descHi : m.descEn}
                      </p>
                    </div>
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
   8. LONG-TERM PROPOSED VISION BANNER — HONESTY & COMPLIANCE FIRST
   Matches the bottom Rajasthan + 10,000 + ~50 study strip of the reference!
   ============================================================================ */
export function ElderlyProposedVisionBanner({ lang }: { lang: Language }) {
  return (
    <section id="ec-vision" className="scroll-mt-32 bg-[#FAF8F2] py-14 sm:py-18 border-b border-[#E5DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#5A7B3B]">
              {lang === 'hi' ? '05 · दीर्घकालीन परिकल्पना' : '05 · Long-Term Proposed Vision'}
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold text-[#113B19] leading-tight ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? 'प्रस्तावित सेवा केंद्रों की परिकल्पना' : 'Proposed Service Centres Vision'}
            </h2>
            <p className={`text-xs sm:text-sm text-[#435648] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'यह एक दीर्घकालीन प्रस्तावित मॉडल है, जिसके अंतर्गत गौशालाओं के साथ समन्वय कर सम्मानजनक वृद्धजन देखभाल एवं मानसिक स्वास्थ्य सहायता केंद्रों की संभावनाएँ विकसित की जा रही हैं।'
                : 'A phased, long-term proposed model exploring Gaushala-linked senior citizen care and mental well-being sanctuaries across Rajasthan and India.'}
            </p>
          </div>

          {/* Right Vision Milestones — Clearly Marked as Proposed Studies */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white border border-[#DFCFAF] p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#EEF5E6] text-[#1D542B] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className={`text-lg sm:text-xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? 'लगभग 10,000 गौशालाएँ' : '~10,000 Gaushalas'}
                </p>
                <p className={`mt-1 text-xs text-[#435648] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi'
                    ? 'भारत भर में गौशालाओं के आसपास दीर्घकालीन राष्ट्रीय विज़न (संभावना अन्वेषण व अध्ययन)'
                    : 'Long-term national exploratory vision linking senior sanctuaries alongside Gaushalas'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#DFCFAF] p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#FBF4E3] text-[#8E5B13] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className={`text-lg sm:text-xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? 'राजस्थान में लगभग 50 केंद्र' : '~50 Centres in Rajasthan'}
                </p>
                <p className={`mt-1 text-xs text-[#435648] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi'
                    ? 'राजस्थान के प्रमुख जिलों में चरणबद्ध दीर्घकालीन योजना अध्ययन (प्रस्तावित)'
                    : 'Proposed long-term planning study across priority districts of Rajasthan'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prominent Honest Compliance Banner */}
        <div className="rounded-2xl bg-[#FFF9EE] border border-[#DCBA7A] px-5 py-4 space-y-2">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#9A580B] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className={`text-xs sm:text-sm font-extrabold text-[#6E3D04] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'दीर्घकालीन प्रस्तावित विज़न — वर्तमान उपलब्धि नहीं'
                  : 'Long-Term Proposed Vision — Not Current Operational Results'}
              </p>
              <p className={`text-xs text-[#5C3A10] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'उपरोक्त संख्याएँ केवल दीर्घकालीन राष्ट्रीय परिकल्पना और योजना अध्ययन हैं। वास्तविक वृद्धजन देखभाल केंद्र स्थापित होने, योग्य स्टाफ नियुक्त होने व आवश्यक वैधानिक लाइसेंस प्राप्त होने पर ही उन्हें सक्रिय संचालित केंद्र के रूप में प्रदर्शित किया जाएगा। वर्तमान चरण-1 वेबसाइट में कोई वृद्धाश्रम प्रबंधन सॉफ्टवेयर, मेडिकल रिकॉर्ड प्रणाली या ऑनलाइन प्रवेश पोर्टल शामिल नहीं है।'
                  : 'The figures above strictly represent a long-term proposed national vision and feasibility study—not completed centres. Centres will only be listed as active once physically established, staffed with trained personnel, and granted statutory licensing. Phase-1 intentionally excludes management software, medical record portals, or online admission systems.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
