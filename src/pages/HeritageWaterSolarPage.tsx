import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Droplets,
  Landmark,
  ShieldCheck,
  Sprout,
  Sun,
  Wrench,
} from 'lucide-react';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { RegistrationPortal } from '../components/RegistrationForms';
import { OrganicEditorialHeading } from '../components/OrganicFarmingSections';
import { GENERATED_ASSETS } from '../data/assets';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface HeritageWaterSolarPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'hw-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'hw-rainwater', hi: 'वर्षा जल व कुंड', en: 'Rainwater & Kund' },
  { id: 'hw-terrace', hi: 'सोलर व टेरेस उद्यान', en: 'Solar & Terrace' },
  { id: 'hw-estimator', hi: 'जल-सौर अनुमानक', en: 'Water & Solar Tool' },
  { id: 'hw-modules', hi: '10 संरक्षण चरण', en: '10 Focus Tracks' },
  { id: 'hw-join', hi: 'मिशन से जुड़ें', en: 'Join Mission' },
  { id: 'hw-faqs', hi: 'सामान्य प्रश्न', en: 'FAQs' },
] as const;

const HERITAGE_FAQS = [
  {
    qHi: 'क्या पुरानी हवेली या धर्मशाला पर रूफटॉप सोलर लगाने से उसकी ऐतिहासिक सुंदरता प्रभावित होती है?',
    qEn: 'Does rooftop solar harm the architectural beauty of historic havelis or dharamshalas?',
    aHi: 'नहीं। संवेदनशील विरासत डिज़ाइन में सोलर पैनल छत की मुंडेर (parapet) के पीछे कम-ऊँचाई पर लगाए जाते हैं ताकि गली से हवेली के झरोखे व भित्तिचित्र पूरी तरह सुरक्षित और मूल रूप में दिखें।',
    aEn: 'No. Heritage-sensitive solar design positions low-profile panels discreetly behind sandstone parapet walls so street-level facades, carved jharokhas, and frescoes remain completely untouched.',
  },
  {
    qHi: 'राजस्थान के शुष्क जिलों में छत के वर्षा जल संचयन से कितना पानी बचाया जा सकता है?',
    qEn: 'How much rainwater can rooftop harvesting save in arid Rajasthan districts?',
    aHi: 'लगभग 350–450 मिमी वार्षिक वर्षा वाले क्षेत्र में 2,000 वर्ग फुट छत से प्रति वर्ष लगभग 50,000 से 65,000 लीटर स्वच्छ वर्षा जल फ़िल्टर करके पारंपरिक कुंड या भूमिगत टांके में सहेजा जा सकता है।',
    aEn: 'Even in 350–450 mm rainfall zones, a 2,000 sq. ft. roof can capture roughly 50,000–65,000 litres of clean filtered rainwater each monsoon into an underground tanka or revived kund.',
  },
  {
    qHi: 'कौन-से भवन स्वामी, ट्रस्ट या ग्राम पंचायतें इस पहल से जुड़ सकते हैं?',
    qEn: 'Which property owners, trusts, or Gram Panchayats can register?',
    aHi: 'शेखावाटी व राजस्थान की हवेली स्वामियों के परिवार, धर्मशाला ट्रस्ट, मंदिर समितियाँ, विद्यालय और ग्राम पंचायतें प्रारंभिक तकनीकी मूल्यांकन और संरक्षण मार्गदर्शन के लिए नीचे पंजीकरण कर सकते हैं।',
    aEn: 'Shekhawati and Rajasthan haveli families, dharamshala trusts, temple committees, schools, and Gram Panchayats can register below for preliminary assessment and conservation guidance.',
  },
  {
    qHi: 'क्या GOVEDA निजी हवेलियों की सीधी मरम्मत का खर्च उठाती है?',
    qEn: 'Does GOVEDA directly fund private haveli renovations?',
    aHi: 'वर्तमान में GOVEDA सामुदायिक कुंडों, धर्मशालाओं, सार्वजनिक धरोहरों और CSR-समर्थित जल-सौर पायलट मॉडलों पर तकनीकी मार्गदर्शन व समन्वय प्रदान करती है; निजी भवनों के लिए विशेषज्ञ परामर्श व साझेदारी मॉडल तलाशे जाते हैं।',
    aEn: 'GOVEDA focuses on community kunds, public dharamshalas, technical guidance, and CSR-aligned water-solar pilots; private heritage owners receive assessment guidance and partnership pathways.',
  },
];

export function HeritageWaterSolarPage({
  lang,
  records,
  onAddRecord,
}: HeritageWaterSolarPageProps) {
  const [activeTab, setActiveTab] = useState<string>('hw-why');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('ngo-institution');
  const [portalFocusKey, setPortalFocusKey] = useState(0);

  // Interactive Indicative Estimator
  const [roofSqFt, setRoofSqFt] = useState<number>(2200);
  const [rainfallMm, setRainfallMm] = useState<number>(420);

  const roofSqM = roofSqFt * 0.0929;
  const estRainLitres = Math.round(roofSqM * rainfallMm * 0.8);
  const estSolarKw = Math.max(1, Math.round((roofSqFt * 0.45) / 100));
  const estAnnualUnits = estSolarKw * 1450;

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    document.getElementById('hw-portal-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FBFAF6] text-[#144721]">
      {/* 1. SEAMLESS EDITORIAL WATERCOLOR HERO */}
      <section className="relative bg-[#FBFAF6] overflow-hidden border-b border-[#E8E2D2]">
        <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
          <img
            src={GENERATED_ASSETS.heritageHeroEditorial}
            alt={
              lang === 'hi'
                ? 'सांस्कृतिक धरोहर, सोलर एवं जल संरक्षण — हवेली, कुंड और रूफटॉप सोलर चित्रण'
                : 'Heritage, Solar & Water Conservation — Sandstone Haveli, Kund & Rooftop Solar Illustration'
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
            style={{
              background: 'linear-gradient(180deg, rgba(251,250,246,0) 0%, #FBFAF6 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-4 lg:py-16 xl:py-20">
          <div className="max-w-xl lg:max-w-[560px]">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
              <span className="text-[10.5px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#1E3B25]">
                GOVEDA • HERITAGE • SOLAR • WATER
              </span>
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
            </div>

            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold tracking-tight leading-[1.12] text-[2.2rem] sm:text-[3.1rem] lg:text-[3.7rem]">
                <span className="block text-[#114720]">सांस्कृतिक धरोहर</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  सोलर एवं जल संरक्षण
                </span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold tracking-tight leading-[1.08] text-[2.15rem] sm:text-[3rem] lg:text-[3.55rem]">
                <span className="block text-[#114720]">Cultural Heritage,</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  Solar &amp; Water Care
                </span>
              </h1>
            )}

            <svg viewBox="0 0 360 22" className="w-60 sm:w-72 lg:w-80 h-4 mt-1.5 mb-3" aria-hidden="true">
              <defs>
                <linearGradient id="hwSwoosh" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4A024" />
                  <stop offset="55%" stopColor="#8DB433" />
                  <stop offset="100%" stopColor="#2B6E29" />
                </linearGradient>
              </defs>
              <path d="M6,15 C110,4 235,20 352,8" fill="none" stroke="url(#hwSwoosh)" strokeWidth="4.2" strokeLinecap="round" />
            </svg>

            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F4F1DF] via-[#EBF2DE] to-transparent">
              <p className="italic font-semibold text-[#1E5426] text-xs sm:text-sm lg:text-[15px]">
                {lang === 'hi'
                  ? 'जीवंत विरासत। स्वच्छ सौर ऊर्जा। सहेजा हुआ वर्षा जल।'
                  : 'Living Heritage. Clean Rooftop Solar. Revived Traditional Water.'}
              </p>
            </div>

            <div className="border-l-[2.5px] border-[#C8922A] pl-4 mb-6 sm:mb-7 max-w-lg">
              <p className={`text-sm sm:text-base lg:text-[17px] text-[#243B2A] leading-relaxed font-medium ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'शेखावाटी व राजस्थान की ऐतिहासिक हवेलियों, धर्मशालाओं और पारंपरिक कुंडों का संरक्षण — स्वच्छ रूफटॉप सोलर, वर्षा जल संचयन और शीतल टेरेस उद्यान के साथ।'
                  : 'Preserving Shekhawati and Rajasthan’s historic sandstone havelis, dharamshalas, and stepwells by blending respectful conservation with rooftop solar, rainwater harvesting, and terrace gardens.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('hw-join')}
                className="inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0E3619] text-white px-6 py-3 text-sm font-bold shadow-[0_10px_24px_-10px_rgba(21,74,36,0.55)] transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'मिशन से जुड़ें' : 'Join This Mission'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('hw-rainwater')}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-[#144721] border border-[#1E5629]/45 px-5 py-3 text-sm font-bold transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'संरक्षण मॉडल समझें' : 'Explore Our Model'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hero Artwork */}
        <div className="lg:hidden relative w-full mt-2 overflow-hidden">
          <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src={GENERATED_ASSETS.heritageHeroEditorial}
              alt={lang === 'hi' ? 'सांस्कृतिक धरोहर और जल संरक्षण' : 'Cultural Heritage & Water Conservation'}
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
        ariaLabel={lang === 'hi' ? 'धरोहर एवं जल संरक्षण अनुभाग' : 'Heritage and water conservation sections'}
      />

      {/* 2. WHY IT MATTERS */}
      <section id="hw-why" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '01 · विरासत और जलवायु संगम' : '01 · WHY HERITAGE & WATER MATTER'}
            titleHi="पुरानी हवेलियाँ और कुंड — सदियों पुरानी जलवायु बुद्धिमत्ता"
            titleEn="Historic Havelis & Kunds — Centuries of Arid-Zone Wisdom"
            leadHi="राजस्थान की पारंपरिक वास्तुकला प्राकृतिक शीतलन, छत के वर्षा जल संचयन और सामुदायिक जल भंडारण के लिए बनी थी। आधुनिक सोलर के साथ इनका पुनर्जीवन आज की सबसे टिकाऊ पहल है।"
            leadEn="Rajasthan’s traditional sandstone architecture was engineered for passive desert cooling and community rainwater storage. Pairing this heritage with rooftop solar creates living, resilient civic hubs."
            lang={lang}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Landmark,
                hiTitle: 'हवेली व धर्मशाला संरक्षण',
                enTitle: 'Haveli & Dharamshala Care',
                hiDesc: 'शेखावाटी व राजस्थान की अनमोल पत्थर नक्काशी और चूना-प्लास्टर विरासत का संवेदनशील संरक्षण।',
                enDesc: 'Respectful lime-plaster and sandstone care preserving Shekhawati’s irreplaceable architectural heritage.',
              },
              {
                icon: Droplets,
                hiTitle: 'पारंपरिक कुंड व जोहड़',
                enTitle: 'Traditional Kund Revival',
                hiDesc: 'बावड़ियों, कुंडों व भूमिगत टांकों की सफाई, सिल्ट निकासी और छतों से वर्षा जल जोड़ना।',
                enDesc: 'Desilting historic stepwells, kunds, and underground tankas connected to clean rooftop catchment channels.',
              },
              {
                icon: Sun,
                hiTitle: 'अदृश्य रूफटॉप सोलर',
                enTitle: 'Heritage-Safe Rooftop Solar',
                hiDesc: 'सामुदायिक भवनों व धर्मशालाओं के बिजली खर्च को कम करने हेतु मुंडेर के पीछे सुरक्षित सोलर पैनल।',
                enDesc: 'Low-profile solar arrays mounted discreetly behind parapet walls to power civic halls cleanly.',
              },
              {
                icon: Sprout,
                hiTitle: 'शीतल टेरेस जैविक उद्यान',
                enTitle: 'Cooling Terrace Gardens',
                hiDesc: 'तपती छतों पर औषधीय व जैविक पौधों की बागवानी जिससे भवन का भीतर का तापमान घटता है।',
                enDesc: 'Earthen-pot herb and vegetable terrace gardens lowering indoor heat during harsh summers.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.enTitle} className="rounded-2xl bg-[#FBFAF6] border border-[#E5DEC8] p-5 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4E6] text-[#154A24] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-base font-extrabold text-[#114720] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? item.hiTitle : item.enTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">
                    {lang === 'hi' ? item.hiDesc : item.enDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VISUAL EXPLAINER 1: RAINWATER & KUND CUTAWAY */}
      <section id="hw-rainwater" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '02 · छत से भूजल तक' : '02 · ROOFTOP TO AQUIFER FLOW'}
            titleHi="वर्षा जल संचयन और पारंपरिक कुंड पुनर्जीवन"
            titleEn="How Rooftop Rainwater Recharges Stepwells & Groundwater"
            leadHi="मानसून की हर बूँद को छत की नालियों और प्राकृतिक कंकड़-रेत-चारकोल फ़िल्टर से गुज़ारकर कुंड व भूजल स्तर तक पहुँचाया जाता है।"
            leadEn="Every monsoon drop travels from sandstone rooftops through natural pebble-sand-charcoal filter chambers into clean stepped kunds and deep village aquifers."
            lang={lang}
          />
          <div className="relative overflow-hidden">
            <img
              src={GENERATED_ASSETS.heritageKundRainwater}
              alt={lang === 'hi' ? 'छत से कुंड और भूजल रिचार्ज चित्रण' : 'Rooftop rainwater to kund and aquifer cutaway illustration'}
              className="w-full h-auto rounded-none mix-blend-multiply"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                hiT: 'स्वच्छ छत संग्रहण',
                enT: 'Clean Rooftop Catchment',
                hiD: 'मानसून से पूर्व छत की सफाई व फर्स्ट-फ्लश डायवर्टर द्वारा शुरुआती धूल अलग की जाती है।',
                enD: 'Pre-monsoon roof cleaning and first-flush diverters keep dust out before storage begins.',
              },
              {
                step: '02',
                hiT: 'प्राकृतिक रेत-कंकड़ फ़िल्टर',
                enT: 'Natural Pebble-Sand Filter',
                hiD: 'तीन स्तरीय कंकड़, बजरी और सक्रिय चारकोल चैंबर से पानी शुद्ध होकर कुंड में पहुँचता है।',
                enD: 'Multi-layer gravel, coarse sand, and charcoal beds clarify rainwater naturally before storage.',
              },
              {
                step: '03',
                hiT: 'कुंड भंडारण व भूजल रिचार्ज',
                enT: 'Kund Storage & Aquifer Recharge',
                hiD: 'अतिरिक्त जल रिचार्ज बोर के माध्यम से भूजल बढ़ाता है और आसपास के देशी वृक्षों को जीवन देता है।',
                enD: 'Overflow feeds recharge shafts, reviving groundwater levels and sustaining mature village trees.',
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white border border-[#E5DEC8] p-5 space-y-2">
                <span className="text-xs font-extrabold tracking-widest text-[#C8922A]">STEP {s.step}</span>
                <h3 className="text-base font-extrabold text-[#114720]">{lang === 'hi' ? s.hiT : s.enT}</h3>
                <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">{lang === 'hi' ? s.hiD : s.enD}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISUAL EXPLAINER 2: ARTISAN RESTORATION & TERRACE SOLAR */}
      <section id="hw-terrace" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '03 · टिकाऊ विरासत मॉडल' : '03 · SUSTAINABLE HERITAGE MODEL'}
            titleHi="स्थानीय कारीगर, रूफटॉप सोलर और जीवंत सामुदायिक केंद्र"
            titleEn="Local Artisans, Rooftop Solar & Living Cultural Centres"
            leadHi="संरक्षित हवेलियाँ और धर्मशालाएँ केवल संग्रहालय नहीं, बल्कि सौर-संचालित पुस्तकालय, महिला शिल्प कक्ष और पर्यावरण शिक्षा केंद्र बन सकती हैं।"
            leadEn="Conserved havelis and dharamshalas can thrive as solar-powered reading rooms, women’s craft studios, and ecological education centres."
            lang={lang}
          />
          <div className="relative overflow-hidden">
            <img
              src={GENERATED_ASSETS.heritageTerraceRestoration}
              alt={lang === 'hi' ? 'हवेली संरक्षण और टेरेस सोलर उद्यान' : 'Haveli conservation and terrace solar garden'}
              className="w-full h-auto mix-blend-multiply"
            />
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE RAINWATER & ROOFTOP SOLAR ESTIMATOR */}
      <section id="hw-estimator" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '04 · सांकेतिक जल एवं सौर अनुमानक' : '04 · INDICATIVE WATER & SOLAR ESTIMATOR'}
            titleHi="अपने भवन या धर्मशाला की जल व सौर क्षमता जानें"
            titleEn="Estimate Rooftop Rainwater & Solar Potential"
            leadHi="नीचे छत का क्षेत्रफल और स्थानीय औसत वर्षा चुनें (यह केवल शैक्षणिक सांकेतिक अनुमान है — वास्तविक डिज़ाइन स्थल सर्वेक्षण पर आधारित होता है)।"
            leadEn="Adjust roof area and annual rainfall below for an educational estimate (actual installations require on-site structural and engineering assessment)."
            lang={lang}
          />
          <div className="rounded-3xl bg-white border border-[#DFD8C5] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#144721] mb-2">
                  <span>{lang === 'hi' ? 'छत का क्षेत्रफल (Roof Area)' : 'Rooftop Catchment Area'}</span>
                  <span className="font-mono text-[#368737]">{roofSqFt.toLocaleString()} sq. ft.</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={10000}
                  step={100}
                  value={roofSqFt}
                  onChange={(e) => setRoofSqFt(Number(e.target.value))}
                  className="w-full accent-[#154A24]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-[#144721] mb-2">
                  <span>{lang === 'hi' ? 'वार्षिक औसत वर्षा (राजस्थान क्षेत्र)' : 'Annual Rainfall (Arid–Semi-Arid)'}</span>
                  <span className="font-mono text-[#368737]">{rainfallMm} mm / yr</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={800}
                  step={20}
                  value={rainfallMm}
                  onChange={(e) => setRainfallMm(Number(e.target.value))}
                  className="w-full accent-[#154A24]"
                />
              </div>
              <p className="text-[11px] text-[#5B6E60] flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C8922A] shrink-0 mt-0.5" />
                <span>
                  {lang === 'hi'
                    ? 'सांकेतिक गणना: 80% रन-ऑफ गुणांक और विरासत-सुरक्षित 45% छत सोलर उपयोग पर आधारित।'
                    : 'Indicative calculation using 80% catchment efficiency and heritage-safe 45% usable rooftop area.'}
                </span>
              </p>
            </div>
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#EEF6FA] border border-[#C2DFEC] p-5 space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#1C5C78]">
                  {lang === 'hi' ? 'अनुमानित वर्षा जल बचत' : 'Est. Annual Rainwater'}
                </p>
                <p className="text-2xl font-extrabold text-[#113D52] tabular-nums">
                  {estRainLitres.toLocaleString()} L
                </p>
                <p className="text-xs text-[#345C6E]">
                  {lang === 'hi' ? 'प्रति मानसून कुंड/टांका संचयन' : 'Clean filtered storage per monsoon'}
                </p>
              </div>
              <div className="rounded-2xl bg-[#FAF5E6] border border-[#E5D3A3] p-5 space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8E6212]">
                  {lang === 'hi' ? 'विरासत-सुरक्षित सोलर' : 'Heritage-Safe Solar'}
                </p>
                <p className="text-2xl font-extrabold text-[#114720] tabular-nums">~{estSolarKw} kW</p>
                <p className="text-xs text-[#4C5F52] tabular-nums">
                  ~{estAnnualUnits.toLocaleString()} {lang === 'hi' ? 'यूनिट/वर्ष' : 'kWh / year'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 10 CONSERVATION TRACKS */}
      <section id="hw-modules" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '05 · 10 कार्यक्षेत्र' : '05 · 10 STRUCTURED PATHWAYS'}
            titleHi="धरोहर, सौर और जल संरक्षण के 10 प्रमुख स्तंभ"
            titleEn="10 Pillars of Heritage, Solar & Water Stewardship"
            lang={lang}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { c: 'A', hi: 'मिशन परिचय', en: 'Mission Introduction' },
              { c: 'B', hi: 'हवेली संरक्षण', en: 'Haveli Restoration' },
              { c: 'C', hi: 'रूफटॉप सोलर', en: 'Rooftop Solar' },
              { c: 'D', hi: 'वर्षा जल संचयन', en: 'Rainwater Harvesting' },
              { c: 'E', hi: 'कुंड जीर्णोद्धार', en: 'Traditional Kund Revival' },
              { c: 'F', hi: 'टेरेस जैविक उद्यान', en: 'Terrace Organic Gardens' },
              { c: 'G', hi: 'टिकाऊ विरासत मॉडल', en: 'Sustainable Heritage Hub' },
              { c: 'H', hi: 'भवन स्वामी पंजीकरण', en: 'Property Owner Registry' },
              { c: 'I', hi: 'CSR सहभागिता', en: 'CSR Heritage Grants' },
              { c: 'J', hi: 'तकनीकी मूल्यांकन', en: 'Technical Assessment' },
            ].map((m) => (
              <div key={m.c} className="rounded-2xl bg-[#FBFAF6] border border-[#E5DEC8] p-4 space-y-1">
                <span className="text-[11px] font-extrabold text-[#C8922A]">MODULE {m.c}</span>
                <p className="text-sm font-bold text-[#114720]">{lang === 'hi' ? m.hi : m.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. JOIN & PORTAL */}
      <section id="hw-join" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '06 · सहभागिता पोर्टल' : '06 · JOIN THIS MISSION'}
            titleHi="धरोहर एवं जल संरक्षण पहल से जुड़ें"
            titleEn="Partner to Preserve Historic Water & Architecture"
            lang={lang}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { cat: 'ngo-institution' as RegistrationCategory, icon: Landmark, hi: 'हवेली / धर्मशाला / पंचायत पंजीकरण', en: 'Haveli, Trust or Panchayat' },
              { cat: 'csr-partner' as RegistrationCategory, icon: Building2, hi: 'CSR जल व धरोहर सहयोग', en: 'CSR Water & Heritage Support' },
              { cat: 'expert-trainer' as RegistrationCategory, icon: Wrench, hi: 'संरक्षण वास्तुकार / सोलर विशेषज्ञ', en: 'Conservation & Solar Experts' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.cat}
                  type="button"
                  onClick={() => openPortalWithRole(p.cat)}
                  className="text-left rounded-2xl bg-white border border-[#DFD8C5] hover:border-[#368737] p-5 flex items-center justify-between gap-3 transition-all cursor-pointer"
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
          <div id="hw-portal-form" key={portalFocusKey}>
            <RegistrationPortal
              lang={lang}
              initialCategory={selectedCategory}
              allowedCategories={['ngo-institution', 'csr-partner', 'expert-trainer', 'volunteer']}
              records={records}
              onAddRecord={onAddRecord}
            />
          </div>
        </div>
      </section>

      {/* 8. FAQS */}
      <section id="hw-faqs" className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '07 · सामान्य प्रश्न' : '07 · FREQUENTLY ASKED QUESTIONS'}
            titleHi="धरोहर, सोलर व जल संरक्षण से जुड़े प्रश्न"
            titleEn="Common Questions on Heritage & Water Care"
            lang={lang}
          />
          <div className="space-y-3">
            {HERITAGE_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.qEn} className="rounded-2xl border border-[#E5DEC8] bg-[#FBFAF6] overflow-hidden">
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
