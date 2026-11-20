import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Flower2,
  Recycle,
  ShoppingBag,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { RegistrationPortal } from '../components/RegistrationForms';
import { OrganicEditorialHeading } from '../components/OrganicFarmingSections';
import { GENERATED_ASSETS } from '../data/assets';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface CleanIndiaPlasticFreePageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'ci-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'ci-cycle', hi: 'पृथक्करण व कपड़े के थैले', en: 'Segregation & Cloth Bags' },
  { id: 'ci-temple', hi: 'मंदिर पुष्प खाद', en: 'Temple Compost' },
  { id: 'ci-calc', hi: 'प्लास्टिक बचत अनुमानक', en: 'Impact Estimator' },
  { id: 'ci-join', hi: 'अभियान से जुड़ें', en: 'Join Campaign' },
  { id: 'ci-faqs', hi: 'सामान्य प्रश्न', en: 'FAQs' },
] as const;

const CLEAN_INDIA_FAQS = [
  {
    qHi: 'तीन रंग के डस्टबिन (हरा, पीला, नीला) में कौन-सा कचरा डालना चाहिए?',
    qEn: 'How does 3-bin source segregation work in villages and towns?',
    aHi: 'हरा डिब्बा गीले जैविक कचरे (सब्जी के छिलके, पत्तियाँ, बचा भोजन) के लिए जिससे खाद बनती है; पीला डिब्बा पुनर्चक्रण योग्य स्वच्छ प्लास्टिक/कागज के लिए; और नीला डिब्बा सूखे गैर-जैविक कचरे के लिए होता है।',
    aEn: 'Green bins collect biodegradable wet waste (peels, leaves, food scraps) for composting; yellow collects clean recyclables (paper, clean bottles); blue collects dry inert waste for safe handling.',
  },
  {
    qHi: 'कपड़े के थैले कहाँ बनते हैं और क्या संस्थाएँ या दुकानदार थोक ऑर्डर के लिए संपर्क कर सकते हैं?',
    qEn: 'Who stitches the cotton cloth bags and can shops or institutions request bulk batches?',
    aHi: 'ये टिकाऊ सूती कपड़े के थैले ग्रामीण महिला स्वयं सहायता समूहों (Women SHGs) द्वारा तैयार किए जाते हैं। विद्यालय, कॉर्पोरेट, मंदिर ट्रस्ट और स्थानीय बाजार नीचे संस्थागत सहभागिता फॉर्म के माध्यम से संपर्क कर सकते हैं।',
    aEn: 'Durable cotton bags are stitched by rural Women Self-Help Groups (SHGs). Schools, temples, retail associations, and CSR partners can submit bulk collaboration inquiries via the portal below.',
  },
  {
    qHi: 'मंदिरों के फूलों और पूजन सामग्री का क्या किया जाता है?',
    qEn: 'How is temple floral waste managed respectfully?',
    aHi: 'नदियों या कचरे के ढेर में फेंकने के बजाय, मंदिर परिसर में ही हवादार लकड़ी के कम्पोस्ट बक्सों में फूलों को जैविक खाद और प्राकृतिक धूप-अगरबत्ती सामग्री में बदला जाता है।',
    aEn: 'Instead of entering drains or landfills, marigold and rose offerings are collected in woven baskets and turned inside breathable temple compost chambers into fertile humus for tulsi and saplings.',
  },
];

export function CleanIndiaPlasticFreePage({
  lang,
  records,
  onAddRecord,
}: CleanIndiaPlasticFreePageProps) {
  const [activeTab, setActiveTab] = useState<string>('ci-why');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('volunteer');
  const [portalFocusKey, setPortalFocusKey] = useState(0);

  // Interactive Plastic Replacement Estimator
  const [households, setHouseholds] = useState<number>(150);
  const bagsAvoidedYear = households * 260; // ~5 single-use bags/week/household
  const clothBagsNeeded = households * 3;
  const wetWasteCompostKg = Math.round(households * 180);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const ids = ANCHOR_TABS.map((t) => t.id);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveTab(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const openPortalWithRole = (cat: RegistrationCategory) => {
    setSelectedCategory(cat);
    setPortalFocusKey((k) => k + 1);
    document.getElementById('ci-portal-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FBFAF6] text-[#144721]">
      {/* 1. SEAMLESS EDITORIAL WATERCOLOR HERO (Matched to User Reference #1) */}
      <section className="relative bg-[#FBFAF6] overflow-hidden border-b border-[#E8E2D2]">
        <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
          <img
            src={GENERATED_ASSETS.cleanIndiaHeroEditorial}
            alt={
              lang === 'hi'
                ? 'स्वच्छ भारत एवं प्लास्टिक मुक्त अभियान — कचरा पृथक्करण और स्वच्छ राजस्थान नगर'
                : 'Clean India & Plastic-Free Campaign — Source Segregation and Clean Village Street'
            }
            className="w-full h-full object-cover object-right"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #FBFAF6 0%, #FBFAF6 40%, rgba(251,250,246,0.92) 48%, rgba(251,250,246,0.18) 60%, rgba(251,250,246,0) 70%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: 'linear-gradient(180deg, rgba(251,250,246,0) 0%, #FBFAF6 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-4 lg:py-16 xl:py-20">
          <div className="max-w-xl lg:max-w-[560px]">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
              <span className="text-[10.5px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#1E3B25]">
                GOVEDA • CLEAN INDIA INITIATIVE
              </span>
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
            </div>

            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold tracking-tight leading-[1.12] text-[2.25rem] sm:text-[3.15rem] lg:text-[3.75rem]">
                <span className="block text-[#114720]">स्वच्छ भारत</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  प्लास्टिक मुक्त अभियान
                </span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold tracking-tight leading-[1.08] text-[2.15rem] sm:text-[3rem] lg:text-[3.55rem]">
                <span className="block text-[#114720]">Clean India &amp;</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  Plastic-Free Villages
                </span>
              </h1>
            )}

            <svg viewBox="0 0 360 22" className="w-60 sm:w-72 lg:w-80 h-4 mt-1.5 mb-3" aria-hidden="true">
              <defs>
                <linearGradient id="ciSwoosh" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4A024" />
                  <stop offset="55%" stopColor="#8DB433" />
                  <stop offset="100%" stopColor="#2B6E29" />
                </linearGradient>
              </defs>
              <path d="M6,15 C110,4 235,20 352,8" fill="none" stroke="url(#ciSwoosh)" strokeWidth="4.2" strokeLinecap="round" />
            </svg>

            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F4F1DF] via-[#EBF2DE] to-transparent">
              <p className="italic font-semibold text-[#1E5426] text-xs sm:text-sm lg:text-[15px]">
                {lang === 'hi'
                  ? 'कचरा पृथक्करण। सूती कपड़े के थैले। स्वच्छ गाँव व शहर।'
                  : 'Source Segregation. Women-Crafted Cloth Bags. Zero-Litter Communities.'}
              </p>
            </div>

            <div className="border-l-[2.5px] border-[#C8922A] pl-4 mb-6 sm:mb-7 max-w-lg">
              <p className={`text-sm sm:text-base lg:text-[17px] text-[#243B2A] leading-relaxed font-medium ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'कचरे का सही पृथक्करण, एकल-उपयोग प्लास्टिक में कमी, मंदिर पुष्प खाद और महिला समूहों द्वारा कपड़े के थैलों के माध्यम से स्वच्छ समुदायों की ओर।'
                  : 'Moving toward cleaner villages and towns through 3-bin waste segregation, single-use plastic reduction, temple floral composting, and reusable cotton bags stitched by Women SHGs.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('ci-join')}
                className="inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0E3619] text-white px-6 py-3 text-sm font-bold shadow-[0_10px_24px_-10px_rgba(21,74,36,0.55)] transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'अभियान से जुड़ें' : 'Join Campaign'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('ci-cycle')}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-[#144721] border border-[#1E5629]/45 px-5 py-3 text-sm font-bold transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'अभियान को समझें' : 'Understand the Model'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hero Artwork */}
        <div className="lg:hidden relative w-full mt-2 overflow-hidden">
          <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src={GENERATED_ASSETS.cleanIndiaHeroEditorial}
              alt={lang === 'hi' ? 'स्वच्छ भारत प्लास्टिक मुक्त अभियान' : 'Clean India Plastic-Free Campaign'}
              className="w-full h-full object-cover object-right scale-[1.52] sm:scale-[1.24] origin-right"
              loading="eager"
            />
            <div className="absolute inset-x-0 top-0 h-14 pointer-events-none" style={{ background: 'linear-gradient(180deg, #FBFAF6 0%, rgba(251,250,246,0) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none" style={{ background: 'linear-gradient(0deg, #FBFAF6 0%, rgba(251,250,246,0) 100%)' }} />
          </div>
        </div>
      </section>

      <MissionAnchorNav
        tabs={ANCHOR_TABS}
        activeTab={activeTab}
        lang={lang}
        onSelect={scrollToSection}
        ariaLabel={lang === 'hi' ? 'स्वच्छ भारत अनुभाग' : 'Clean India campaign sections'}
      />

      {/* 2. FOUR PRACTICAL PILLARS */}
      <section id="ci-why" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '01 · समस्या और व्यावहारिक समाधान' : '01 · PRACTICAL ZERO-WASTE PILLARS'}
            titleHi="प्लास्टिक मुक्त गाँव — केवल नारा नहीं, दैनिक अभ्यास"
            titleEn="Plastic-Free Communities — Built Through Everyday Habits"
            leadHi="सिंगल-यूज पॉलिथीन गौवंश, मिट्टी की उर्वरता और जल स्रोतों को गंभीर नुकसान पहुँचाती है। GOVEDA व्यावहारिक विकल्प और सामुदायिक भागीदारी को प्राथमिकता देती है।"
            leadEn="Single-use plastic harms grazing cattle, clogs drains, and degrades soil. GOVEDA pairs practical household segregation with affordable reusable cotton alternatives."
            lang={lang}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Trash2, hiT: '3-बिन कचरा पृथक्करण', enT: '3-Bin Source Segregation', hiD: 'गीला (खाद), पीला (पुनर्चक्रण) व नीला (सूखा) कचरा घर व स्कूल स्तर पर ही अलग करना।', enD: 'Separating wet organic, recyclable, and dry inert waste right at homes, schools, and shops.' },
              { icon: ShoppingBag, hiT: 'SHG सूती कपड़े के थैले', enT: 'SHG Cotton Cloth Bags', hiD: 'महिला स्वयं सहायता समूहों द्वारा निर्मित मजबूत थैले — प्लास्टिक कैरी बैग का सम्मानजनक विकल्प।', enD: 'Durable reusable bags stitched by rural Women SHGs, creating local income while eliminating polythene.' },
              { icon: Flower2, hiT: 'मंदिर पुष्प कम्पोस्ट', enT: 'Temple Floral Composting', hiD: 'पूजन के फूलों को जल स्रोतों में डालने के बजाय जैविक खाद व प्राकृतिक धूप में परिवर्तित करना।', enD: 'Respectful aerobic composting of marigold and rose offerings into fertile soil humus.' },
              { icon: Recycle, hiT: 'स्वच्छ ग्राम व बाजार अभियान', enT: 'Clean Village & Bazaar Drives', hiD: 'ग्राम पंचायत, व्यापार संघ और छात्रों के साथ नियमित स्वच्छता व रीफिल-वॉटर पहल।', enD: 'Community cleanups and drinking-water refill points with Gram Panchayats and local merchants.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.enT} className="rounded-2xl bg-[#FBFAF6] border border-[#E5DEC8] p-5 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4E6] text-[#154A24] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#114720]">{lang === 'hi' ? item.hiT : item.enT}</h3>
                  <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">{lang === 'hi' ? item.hiD : item.enD}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VISUAL EXPLAINER 1: SEGREGATION -> CLOTH BAGS -> CLEAN BAZAAR */}
      <section id="ci-cycle" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '02 · चक्रीय स्वच्छता मॉडल' : '02 · CIRCULAR CLEANLINESS FLOW'}
            titleHi="घर से पृथक्करण → महिला समूह के थैले → प्लास्टिक-मुक्त बाजार"
            titleEn="Home Segregation → Women SHG Cloth Bags → Plastic-Free Markets"
            leadHi="जब स्वच्छता और ग्रामीण आजीविका एक साथ जुड़ती हैं, तो अभियान टिकाऊ बनता है।"
            leadEn="When cleanliness connects directly with local women’s livelihoods, plastic reduction becomes self-sustaining."
            lang={lang}
          />
          <img
            src={GENERATED_ASSETS.cleanIndiaSegregationCycle}
            alt={lang === 'hi' ? 'कचरा पृथक्करण से स्वच्छ बाजार तक चक्रीय प्रवाह' : 'Source segregation to cloth bag enterprise and clean village market'}
            className="w-full h-auto mix-blend-multiply"
          />
        </div>
      </section>

      {/* 4. VISUAL EXPLAINER 2: TEMPLE FLORAL COMPOSTING */}
      <section id="ci-temple" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '03 · आस्था और प्रकृति का सम्मान' : '03 · SACRED FLORAL COMPOSTING'}
            titleHi="मंदिर अपशिष्ट से सुगंधित जैविक खाद एवं पौध पोषण"
            titleEn="Turning Temple Floral Offerings Into Living Compost"
            leadHi="मंदिरों व धार्मिक स्थलों से प्रतिदिन निकलने वाले फूलों का सम्मानजनक पुनर्चक्रण — जल स्रोतों को स्वच्छ रखते हुए पवित्र पौधों को पोषण।"
            leadEn="Daily floral offerings collected respectfully into breathable wooden compost chambers—keeping water bodies pristine while nourishing tulsi and native saplings."
            lang={lang}
          />
          <img
            src={GENERATED_ASSETS.cleanIndiaTempleCompost}
            alt={lang === 'hi' ? 'मंदिर पुष्प कम्पोस्ट पहल' : 'Temple floral composting courtyard illustration'}
            className="w-full h-auto mix-blend-multiply"
          />
        </div>
      </section>

      {/* 5. INTERACTIVE COMMUNITY PLASTIC REDUCTION ESTIMATOR */}
      <section id="ci-calc" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '04 · सामुदायिक प्रभाव अनुमानक' : '04 · COMMUNITY IMPACT ESTIMATOR'}
            titleHi="एक गाँव या वार्ड में प्लास्टिक-मुक्त पहल का असर"
            titleEn="Estimate Annual Plastic Reduction in Your Village or Ward"
            lang={lang}
          />
          <div className="rounded-3xl bg-white border border-[#DFD8C5] p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-bold text-[#144721] mb-2">
                <span>{lang === 'hi' ? 'सहभागी परिवार / दुकानें' : 'Participating Households / Local Shops'}</span>
                <span className="font-mono text-[#368737]">{households.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={25}
                max={1000}
                step={25}
                value={households}
                onChange={(e) => setHouseholds(Number(e.target.value))}
                className="w-full accent-[#154A24]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#EEF5E6] border border-[#CFE3BC] p-5">
                <p className="text-[11px] font-extrabold uppercase text-[#3A6A28]">
                  {lang === 'hi' ? 'बचाए गए प्लास्टिक बैग/वर्ष' : 'Single-Use Bags Avoided / Yr'}
                </p>
                <p className="text-2xl font-extrabold text-[#114720] mt-1 tabular-nums">
                  ~{bagsAvoidedYear.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FAF5E6] border border-[#E5D3A3] p-5">
                <p className="text-[11px] font-extrabold uppercase text-[#8E6212]">
                  {lang === 'hi' ? 'आवश्यक SHG कपड़े के थैले' : 'SHG Cotton Bags Needed'}
                </p>
                <p className="text-2xl font-extrabold text-[#114720] mt-1 tabular-nums">
                  {clothBagsNeeded.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl bg-[#F2F7F4] border border-[#D4E3D9] p-5">
                <p className="text-[11px] font-extrabold uppercase text-[#2A5E3E]">
                  {lang === 'hi' ? 'गीले कचरे से खाद क्षमता' : 'Wet Waste Diverted / Yr'}
                </p>
                <p className="text-2xl font-extrabold text-[#114720] mt-1 tabular-nums">
                  ~{(wetWasteCompostKg / 1000).toFixed(1)} T
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. JOIN & PORTAL */}
      <section id="ci-join" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '05 · जन सहभागिता' : '05 · JOIN THE CLEAN CAMPAIGN'}
            titleHi="स्वच्छता स्वयंसेवक, महिला समूह या संस्था के रूप में जुड़ें"
            titleEn="Join as Volunteer, Women SHG, School or CSR Partner"
            lang={lang}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { cat: 'volunteer' as RegistrationCategory, icon: Sparkles, hi: 'स्वच्छता स्वयंसेवक पंजीकरण', en: 'Clean-Up Volunteer Registration' },
              { cat: 'women-shg' as RegistrationCategory, icon: Users, hi: 'कपड़े के थैले — महिला SHG', en: 'Women SHG Cloth-Bag Unit' },
              { cat: 'ngo-institution' as RegistrationCategory, icon: Building2, hi: 'विद्यालय / मंदिर / पंचायत साझेदारी', en: 'School, Temple or Panchayat' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.cat}
                  type="button"
                  onClick={() => openPortalWithRole(p.cat)}
                  className="text-left rounded-2xl bg-[#FBFAF6] border border-[#DFD8C5] hover:border-[#368737] p-5 flex items-center justify-between gap-3 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF4E6] text-[#154A24] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-[#114720]">{lang === 'hi' ? p.hi : p.en}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#368737] shrink-0" />
                </button>
              );
            })}
          </div>
          <div id="ci-portal-form" key={portalFocusKey}>
            <RegistrationPortal
              lang={lang}
              initialCategory={selectedCategory}
              allowedCategories={['volunteer', 'women-shg', 'ngo-institution', 'csr-partner']}
              records={records}
              onAddRecord={onAddRecord}
            />
          </div>
        </div>
      </section>

      {/* 7. FAQS */}
      <section id="ci-faqs" className="py-12 sm:py-16 bg-[#FBFAF6]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '06 · सामान्य प्रश्न' : '06 · FREQUENTLY ASKED QUESTIONS'}
            titleHi="स्वच्छ भारत व प्लास्टिक-मुक्त अभियान के प्रश्न"
            titleEn="Common Questions on Clean Village Drives"
            lang={lang}
          />
          <div className="space-y-3">
            {CLEAN_INDIA_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.qEn} className="rounded-2xl border border-[#E5DEC8] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#114720] cursor-pointer"
                  >
                    <span>{lang === 'hi' ? faq.qHi : faq.qEn}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[#395040] leading-relaxed border-t border-[#E8E2D2] pt-3">
                      {lang === 'hi' ? faq.aHi : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
