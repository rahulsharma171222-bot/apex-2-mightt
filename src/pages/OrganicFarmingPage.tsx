import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  FlaskConical,
  PhoneCall,
  Sprout,
  Users,
} from 'lucide-react';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { RegistrationPortal } from '../components/RegistrationForms';
import {
  OrganicEditorialHeading,
  OrganicFarmingHero,
  OrganicWhyMatters,
  OrganicLivingSoilSection,
  OrganicWaterTestingSection,
  OrganicCircularVillageSection,
  OrganicPhasedTransitionSection,
  OrganicGovedaRoleAndModules,
} from '../components/OrganicFarmingSections';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface OrganicFarmingPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'of-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'of-soil', hi: 'जीवित मिट्टी', en: 'Living Soil' },
  { id: 'of-water', hi: 'जाँच व जल संरक्षण', en: 'Testing & Water' },
  { id: 'of-village', hi: 'ग्राम विकास चक्र', en: 'Village Cycle' },
  { id: 'of-transition', hi: '3-वर्षीय योजनाकार', en: 'Transition Planner' },
  { id: 'of-modules', hi: 'GOVEDA भूमिका व मॉड्यूल', en: 'Role & Modules' },
  { id: 'of-join', hi: 'मिशन से जुड़ें', en: 'Join Mission' },
  { id: 'of-faqs', hi: 'सामान्य प्रश्न', en: 'FAQs' },
] as const;

const ORGANIC_FAQS = [
  {
    qHi: 'क्या जैविक खेती शुरू करने के लिए पहले ही वर्ष पूरे खेत में रासायनिक खाद बंद करनी होगी?',
    qEn: 'Do I have to stop all synthetic fertilisers across my whole farm in Year 1?',
    aHi: 'बिल्कुल नहीं। GOVEDA चरणबद्ध (Phased) बदलाव की सलाह देता है—पहले मिट्टी व पानी की लैब जाँच कराकर केवल 25–35% पायलट भूमि पर वर्मीकम्पोस्ट, जीवामृत और मल्चिंग शुरू करें, ताकि परिवार की फसल और आय पूरी तरह सुरक्षित रहे।',
    aEn: 'Not at all. GOVEDA strongly advocates a phased transition: start with lab soil & water testing and pilot vermicompost, Jeevamrit, and mulching on 25–35% of your land so family harvest security is never jeopardised.',
  },
  {
    qHi: 'यदि हमारे बोरवेल का पानी खारा (High TDS / EC) है, तो क्या जैविक खेती संभव है?',
    qEn: 'Is organic or natural farming possible if our borewell water is saline (high EC/TDS)?',
    aHi: 'हाँ, लेकिन इसके लिए सही वैज्ञानिक प्रबंधन आवश्यक है। पहले पानी की EC व SAR जाँच कराएँ, खुले बाढ़ सिंचाई की जगह ड्रिप सिंचाई व पुआल मल्चिंग अपनाएँ, भरपूर गोबर-वर्मीकम्पोस्ट डालें और लवण-सहिष्णु फसलें (जैसे जौ, सरसों, ग्वार, देशी बेर) चुनें।',
    aEn: 'Yes, with disciplined science. First test water EC/SAR, replace open flood irrigation with drip lines and straw mulching, build soil humus with mature compost, and select salt-tolerant crops like Barley, Mustard, Cluster Bean, and native Ber.',
  },
  {
    qHi: 'क्या GOVEDA किसानों को तुरंत जैविक प्रमाण-पत्र (Organic Certificate) या गारंटीकृत ऊँचा दाम देता है?',
    qEn: 'Does GOVEDA promise instant organic certification or guaranteed premium crop prices?',
    aHi: 'नहीं। भारत में आधिकारिक जैविक प्रमाणीकरण (NPOP / PGS-India) एक सत्यापित 2–3 वर्षीय रूपांतरण प्रक्रिया का पालन करता है। GOVEDA केवल सही प्रशिक्षण, लैब समन्वय, गौशाला-खाद लिंक और स्थानीय FPO/बाज़ार संपर्क में सहयोग करता है—कोई झूठा वादा नहीं।',
    aEn: 'No. Recognised certification in India (NPOP / PGS-India) requires a documented 2–3 year conversion period. GOVEDA focuses honestly on training, lab linkages, Gaushala compost access, and FPO/market orientation without false price promises.',
  },
  {
    qHi: 'गाँव की गौशाला से किसानों को वर्मीकम्पोस्ट और जीवामृत कैसे मिल सकता है?',
    qEn: 'How can village Gaushalas supply vermicompost and Jeevamrit to nearby farmers?',
    aHi: 'आत्मनिर्भर गौशाला मिशन के अंतर्गत स्थानीय गौशाला समितियों को छायादार वर्मीकम्पोस्ट बेड, जीवामृत इकाई और हरे चारे के आदान-प्रदान मॉडल से जोड़ा जाता है—जहाँ किसान चारा देते हैं और किफायती जैविक खाद प्राप्त करते हैं।',
    aEn: 'Under the Self-Reliant Gaushala Mission, village Gaushalas are guided to set up shaded vermicompost beds and Jeevamrit units linked with local farmers through green-fodder and affordable compost exchange.',
  },
  {
    qHi: 'किसान प्रशिक्षण, डेमो प्लॉट या कृषि विशेषज्ञ सहायता के लिए कैसे पंजीकरण करें?',
    qEn: 'How can farmers, Gaushalas, or agronomy experts register for field training?',
    aHi: 'आप नीचे दिए गए पंजीकरण पोर्टल में किसान, हरित मित्र, कृषि विशेषज्ञ/प्रशिक्षक या गौशाला श्रेणी चुनकर अपना विवरण दर्ज कर सकते हैं। प्रत्येक आवेदन को एक यूनिक Reference ID मिलती है।',
    aEn: 'Use the registration portal below to enrol as a Farmer, Harit Mitra, Agronomy Expert/Trainer, or Gaushala partner. Every submission generates a unique tracking Reference ID.',
  },
];

export function OrganicFarmingPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: OrganicFarmingPageProps) {
  const [activeTab, setActiveTab] = useState<string>('of-why');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('farmer');
  const [portalFocusKey, setPortalFocusKey] = useState(0);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const ids = ANCHOR_TABS.map((t) => t.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveTab(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openPortalWithRole = (cat: RegistrationCategory) => {
    setSelectedCategory(cat);
    setPortalFocusKey((k) => k + 1);
    const portalEl = document.getElementById('of-portal-form');
    if (portalEl) {
      portalEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pathways: {
    category: RegistrationCategory;
    icon: typeof Sprout;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
    ctaHi: string;
    ctaEn: string;
  }[] = [
    {
      category: 'farmer',
      icon: Sprout,
      titleHi: 'किसान सहभागिता (Farmer Registration)',
      titleEn: 'Farmer Registration',
      descHi:
        'मृदा-जल परीक्षण मार्गदर्शन, वर्ष-1 पायलट डेमो प्लॉट, वर्मीकम्पोस्ट व ड्रिप प्रशिक्षण के लिए जुड़ें।',
      descEn:
        'Register for soil-water testing orientation, Year-1 pilot demo plots, vermicompost access, and local field schools.',
      ctaHi: 'किसान फॉर्म खोलें',
      ctaEn: 'Open Farmer Form',
    },
    {
      category: 'expert-trainer',
      icon: FlaskConical,
      titleHi: 'कृषि वैज्ञानिक, KVK व प्रशिक्षक',
      titleEn: 'Agronomists, Soil Labs & Trainers',
      descHi:
        'स्थानीय भाषा में किसान कार्यशाला, मिट्टी रिपोर्ट विश्लेषण और प्राकृतिक आदान प्रशिक्षण में मार्गदर्शन दें।',
      descEn:
        'Collaborate on vernacular farmer workshops, soil report interpretation, and drought-resilient crop mentorship.',
      ctaHi: 'विशेषज्ञ फॉर्म खोलें',
      ctaEn: 'Open Expert Form',
    },
    {
      category: 'gaushala',
      icon: Users,
      titleHi: 'गौशाला समिति एवं ग्राम FPO / SHG',
      titleEn: 'Gaushala Committees, FPOs & SHGs',
      descHi:
        'वर्मीकम्पोस्ट इकाई, देशी पौध नर्सरी और हरे चारे के चक्रीय ग्राम मॉडल में साझेदारी करें।',
      descEn:
        'Partner to build village vermicompost units, women-led native nurseries, and circular fodder-to-farm linkages.',
      ctaHi: 'संस्थागत फॉर्म खोलें',
      ctaEn: 'Open Partner Form',
    },
  ];

  return (
    <div className="bg-[#FBFAF6] text-[#144721]">
      {/* 1. REFERENCE-MATCHED SEAMLESS EDITORIAL HERO (Desktop + Mobile Unified) */}
      <OrganicFarmingHero lang={lang} onScrollTo={scrollToSection} />

      {/* STICKY ANCHOR NAVIGATION */}
      <MissionAnchorNav
        tabs={ANCHOR_TABS}
        activeTab={activeTab}
        onSelect={scrollToSection}
        lang={lang}
        ariaLabel={
          lang === 'hi'
            ? 'जैविक खेती एवं ग्रामीण विकास पेज सेक्शन'
            : 'Organic Farming and Rural Development Page Sections'
        }
      />

      {/* 2. WHY IT MATTERS — 4 GROUND REALITIES */}
      <OrganicWhyMatters lang={lang} />

      {/* 3. INTERACTIVE LIVING SOIL ANATOMY CUTAWAY */}
      <OrganicLivingSoilSection lang={lang} />

      {/* 4. SOIL-WATER TESTING, RAINWATER KUND & DRIP IRRIGATION */}
      <OrganicWaterTestingSection lang={lang} />

      {/* 5. CIRCULAR VILLAGE ECONOMY PANORAMA */}
      <OrganicCircularVillageSection lang={lang} onNavigate={onNavigate} />

      {/* 6. 3-YEAR PHASED TRANSITION ROADMAP + INTERACTIVE PLANNER */}
      <OrganicPhasedTransitionSection lang={lang} />

      {/* 7. GOVEDA'S ROLE, HONEST AGRONOMY SAFEGUARD & 10 MODULES */}
      <OrganicGovedaRoleAndModules lang={lang} />

      {/* 8. JOIN THIS MISSION — LIVE REGISTRATION PORTAL */}
      <section
        id="of-join"
        className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <OrganicEditorialHeading
            eyebrowHi="07 · मिशन से जुड़ें"
            eyebrowEn="07 · Join This Mission"
            titleHi="किसान, गौशाला, विशेषज्ञ या ग्राम साझेदार के रूप में जुड़ें"
            titleEn="Join as a Farmer, Gaushala, Agronomist or Rural Partner"
            leadHi="अपनी भूमिका चुनें और सीधे ऑनलाइन पंजीकरण दर्ज करें—हर पंजीकरण की पारदर्शी ट्रैकिंग Reference ID के माध्यम से होती है।"
            leadEn="Select your pathway and register directly below—every submission receives a unique transparent tracking Reference ID."
            lang={lang}
          />

          {/* 3 Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pathways.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedCategory === p.category;
              return (
                <div
                  key={p.category}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#F4F8EC] border-[#6F9C33]'
                      : 'bg-[#FBFAF6] border-[#E3D7BA]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#DFCFAF] text-[#154A24] flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3
                      className={`text-base font-extrabold text-[#144721] ${
                        lang === 'hi' ? 'font-hindi' : 'font-editorial'
                      }`}
                    >
                      {lang === 'hi' ? p.titleHi : p.titleEn}
                    </h3>
                    <p
                      className={`text-xs sm:text-[13px] text-[#3E5143] leading-relaxed ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? p.descHi : p.descEn}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPortalWithRole(p.category)}
                    className={`mt-5 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#79B432] text-[#102E16]'
                        : 'bg-[#154A24] text-white hover:bg-[#1C612F]'
                    } ${lang === 'hi' ? 'font-hindi' : ''}`}
                  >
                    <span>{lang === 'hi' ? p.ctaHi : p.ctaEn}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Embedded Registration Portal */}
          <div
            id="of-portal-form"
            className="scroll-mt-32 rounded-3xl bg-[#FBFAF6] border border-[#DFCFAF] p-4 sm:p-6"
          >
            <RegistrationPortal
              key={`${selectedCategory}-${portalFocusKey}`}
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory={selectedCategory}
              allowedCategories={[
                'farmer',
                'harit-mitra',
                'gaushala',
                'expert-trainer',
                'csr-partner',
              ]}
            />
          </div>

          {/* Direct Coordination Strip */}
          <div className="rounded-2xl bg-[#154A24] text-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D3F59B]">
                <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {lang === 'hi'
                    ? 'ग्राम पंचायत · KVK · गौशाला एवं CSR समन्वय डेस्क'
                    : 'Gram Panchayat · KVK · Gaushala & CSR Coordination Desk'}
                </span>
              </div>
              <p
                className={`text-sm sm:text-base font-bold ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi'
                  ? 'अपने गाँव या जिले में मिट्टी-जल परीक्षण शिविर अथवा जैविक डेमो प्लॉट आयोजित करने हेतु संपर्क करें।'
                  : 'Connect with our field team to host a soil-water testing camp or organic farming demo plot in your village or district.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8CC740] text-[#102E16] text-xs sm:text-sm font-bold hover:bg-[#9FD954] transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              <span>{lang === 'hi' ? 'संपर्क पृष्ठ देखें' : 'Contact Our Desk'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. TRANSPARENT BILINGUAL FAQs */}
      <section id="of-faqs" className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <OrganicEditorialHeading
            eyebrowHi="08 · स्पष्ट एवं ईमानदार उत्तर"
            eyebrowEn="08 · Clear & Honest Answers"
            titleHi="जैविक खेती मिशन से जुड़े सामान्य प्रश्न (FAQs)"
            titleEn="Frequently Asked Questions"
            lang={lang}
            align="center"
          />

          <div className="divide-y divide-[#DFCFAF] border-y border-[#DFCFAF] bg-white rounded-2xl overflow-hidden">
            {ORGANIC_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.qEn}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FBFAF6]/80 transition-colors cursor-pointer"
                  >
                    <span
                      className={`text-sm sm:text-[15px] font-bold text-[#144721] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? item.qHi : item.qEn}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5A7B3B] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-0.5">
                      <p
                        className={`text-xs sm:text-sm text-[#394B3E] leading-relaxed ${
                          lang === 'hi' ? 'font-hindi' : ''
                        }`}
                      >
                        {lang === 'hi' ? item.aHi : item.aEn}
                      </p>
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
