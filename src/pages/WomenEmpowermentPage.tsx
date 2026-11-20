import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  HeartPulse,
  Landmark,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { RegistrationPortal } from '../components/RegistrationForms';
import { OrganicEditorialHeading } from '../components/OrganicFarmingSections';
import { GENERATED_ASSETS } from '../data/assets';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface WomenEmpowermentPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'we-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'we-shg', hi: 'SHG एवं उद्यमिता', en: 'SHG Enterprise' },
  { id: 'we-health', hi: 'स्वास्थ्य व वित्तीय साक्षरता', en: 'Health & Digital' },
  { id: 'we-planner', hi: 'समूह मार्गदर्शक', en: 'SHG Track Guide' },
  { id: 'we-join', hi: 'मिशन से जुड़ें', en: 'Join Mission' },
  { id: 'we-faqs', hi: 'सामान्य प्रश्न', en: 'FAQs' },
] as const;

const SHG_TRACKS = [
  {
    id: 'cloth-bags',
    hiTitle: 'सूती कपड़े के थैले व सिलाई इकाई',
    enTitle: 'Cotton Cloth-Bag & Tailoring Unit',
    hiDesc: 'प्लास्टिक-मुक्त अभियान के साथ जुड़कर स्कूलों, मंदिरों और स्थानीय दुकानों के लिए मजबूत सूती थैले बनाना।',
    enDesc: 'Stitching reusable cotton bags linked directly with Clean India campaigns for local shops, temples, and schools.',
    hiSteps: ['5–15 महिलाओं का समूह गठन', 'सिलाई व गुणवत्ता मानक प्रशिक्षण', 'स्थानीय बाजार व संस्थागत ऑर्डर संपर्क'],
    enSteps: ['Form a 5–15 member Women SHG', 'Tailoring & finishing quality workshop', 'Connect with local retail & CSR orders'],
  },
  {
    id: 'eco-crafts',
    hiTitle: 'जैविक मसाले, अचार व ग्रामीण हस्तशिल्प',
    enTitle: 'Organic Foods, Spices & Eco-Crafts',
    hiDesc: 'स्वच्छ पैकेजिंग, देशी खाद्य प्रसंस्करण, गोबर दीये-धूप और पारंपरिक बांस-कपड़ा हस्तशिल्प।',
    enDesc: 'Hygienic food processing, clean packaging, eco-friendly diyas/dhoop, and traditional basketry & crafts.',
    hiSteps: ['स्वच्छता व पैकेजिंग प्रशिक्षण', 'FSSAI व नियामकीय मानक मार्गदर्शन', 'स्थानीय मेलों व जिला प्रदर्शनी में सहभागिता'],
    enSteps: ['Hygiene & packaging orientation', 'FSSAI & regulatory licensing guidance', 'District exhibition & local market linkages'],
  },
  {
    id: 'nursery-green',
    hiTitle: 'ग्राम पौध नर्सरी व डिजिटल सखी',
    enTitle: 'Village Sapling Nursery & Digital Sakhi',
    hiDesc: 'हरित राजस्थान के लिए देशी पौधशाला प्रबंधन तथा सुरक्षित UPI, खाता-बही और सरकारी योजना साक्षरता।',
    enDesc: 'Managing native sapling nurseries for Harit Rajasthan alongside safe UPI banking and community digital literacy.',
    hiSteps: ['देशी बीज व पौध देखभाल प्रशिक्षण', 'बचत खाता व सुरक्षित डिजिटल भुगतान', 'ग्राम सभा हरित नेतृत्व में भागीदारी'],
    enSteps: ['Native seed & nursery care training', 'Bookkeeping & safe UPI financial literacy', 'Leadership on village green committees'],
  },
] as const;

const WOMEN_FAQS = [
  {
    qHi: 'क्या किसी भी ग्रामीण या कस्बाई महिला स्वयं सहायता समूह (SHG) का पंजीकरण निःशुल्क है?',
    qEn: 'Is registration free for rural and town Women Self-Help Groups (SHGs)?',
    aHi: 'हाँ। नए या पहले से सक्रिय महिला समूह नीचे दिए गए समर्पित फॉर्म के माध्यम से निःशुल्क पंजीकरण कर सकते हैं।',
    aEn: 'Yes. Both newly forming and existing Women SHGs can register free of cost through the dedicated form below.',
  },
  {
    qHi: 'स्वास्थ्य व मासिक धर्म स्वच्छता कार्यक्रम में गोपनीयता कैसे सुनिश्चित की जाती है?',
    qEn: 'How is privacy protected in women’s health and menstrual hygiene sessions?',
    aHi: 'स्वास्थ्य जागरूकता सामग्री योग्य महिला चिकित्सकों व स्वास्थ्य सलाहकारों की समीक्षा के साथ तैयार की जाती है। किसी भी महिला या किशोरी की व्यक्तिगत स्वास्थ्य जानकारी कभी सार्वजनिक रूप से एकत्र या प्रदर्शित नहीं की जाती।',
    aEn: 'Health education material is reviewed with qualified female doctors and health educators. No individual personal medical or health data is ever collected or displayed publicly.',
  },
  {
    qHi: 'क्या प्रशिक्षण के बाद निश्चित मासिक वेतन की गारंटी दी जाती है?',
    qEn: 'Does SHG training guarantee fixed monthly salaries?',
    aHi: 'नहीं। GOVEDA पारदर्शिता के साथ कौशल प्रशिक्षण, वित्तीय साक्षरता और स्थानीय बाजार संपर्क में सहायता करती है; आय समूह की मेहनत, उत्पाद गुणवत्ता और स्थानीय बाजार माँग पर निर्भर करती है।',
    aEn: 'No. GOVEDA provides transparent skill building, bookkeeping literacy, and local market linkages; actual earnings depend on collective production quality and local demand.',
  },
];

export function WomenEmpowermentPage({
  lang,
  records,
  onAddRecord,
}: WomenEmpowermentPageProps) {
  const [activeTab, setActiveTab] = useState<string>('we-why');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTrackId, setActiveTrackId] = useState<string>('cloth-bags');
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('women-shg');
  const [portalFocusKey, setPortalFocusKey] = useState(0);

  const activeTrack = SHG_TRACKS.find((t) => t.id === activeTrackId) ?? SHG_TRACKS[0];

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
    document.getElementById('we-portal-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FBFAF6] text-[#144721]">
      {/* 1. SEAMLESS EDITORIAL WATERCOLOR HERO (Matched to User Reference #2) */}
      <section className="relative bg-[#FBFAF6] overflow-hidden border-b border-[#E8E2D2]">
        <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
          <img
            src={GENERATED_ASSETS.womenHeroEditorial}
            alt={
              lang === 'hi'
                ? 'महिला सशक्तीकरण — कौशल, सिलाई, डिजिटल साक्षरता और नेतृत्व चित्रण'
                : 'Women Empowerment — Craft, Tailoring, Digital Literacy and Leadership Illustration'
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
                GOVEDA • PEOPLE • PLANET • PROSPERITY
              </span>
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
            </div>

            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold tracking-tight leading-[1.12] text-[2.3rem] sm:text-[3.25rem] lg:text-[3.9rem]">
                <span className="block text-[#114720]">महिला</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  सशक्तीकरण
                </span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold tracking-tight leading-[1.08] text-[2.2rem] sm:text-[3.1rem] lg:text-[3.65rem]">
                <span className="block text-[#114720]">Women</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  Empowerment
                </span>
              </h1>
            )}

            <svg viewBox="0 0 360 22" className="w-60 sm:w-72 lg:w-80 h-4 mt-1.5 mb-3" aria-hidden="true">
              <defs>
                <linearGradient id="weSwoosh" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4A024" />
                  <stop offset="55%" stopColor="#8DB433" />
                  <stop offset="100%" stopColor="#2B6E29" />
                </linearGradient>
              </defs>
              <path d="M6,15 C110,4 235,20 352,8" fill="none" stroke="url(#weSwoosh)" strokeWidth="4.2" strokeLinecap="round" />
            </svg>

            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F4F1DF] via-[#EBF2DE] to-transparent">
              <p className="italic font-semibold text-[#1E5426] text-xs sm:text-sm lg:text-[15px]">
                {lang === 'hi'
                  ? 'सशक्त महिलाएँ। समृद्ध परिवार। आत्मनिर्भर समुदाय।'
                  : 'Empowering Women. Strengthening Communities.'}
              </p>
            </div>

            <div className="border-l-[2.5px] border-[#C8922A] pl-4 mb-6 sm:mb-7 max-w-lg">
              <p className={`text-sm sm:text-base lg:text-[17px] text-[#243B2A] leading-relaxed font-medium ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'कौशल, आजीविका, स्वयं सहायता समूह, डिजिटल व वित्तीय साक्षरता और सामुदायिक सहभागिता के माध्यम से महिलाओं के आत्मविश्वास और आत्मनिर्भरता को बढ़ावा।'
                  : 'Advancing women’s confidence and self-reliance through Self-Help Group enterprises, cloth-bag livelihoods, financial & digital literacy, health awareness, and village leadership.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('we-join')}
                className="inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0E3619] text-white px-6 py-3 text-sm font-bold shadow-[0_10px_24px_-10px_rgba(21,74,36,0.55)] transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'मिशन से जुड़ें' : 'Join Mission'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('we-shg')}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-[#144721] border border-[#1E5629]/45 px-5 py-3 text-sm font-bold transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'हमारी पहल जानें' : 'Explore Initiatives'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hero Artwork */}
        <div className="lg:hidden relative w-full mt-2 overflow-hidden">
          <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src={GENERATED_ASSETS.womenHeroEditorial}
              alt={lang === 'hi' ? 'महिला सशक्तीकरण' : 'Women Empowerment'}
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
        ariaLabel={lang === 'hi' ? 'महिला सशक्तीकरण अनुभाग' : 'Women empowerment sections'}
      />

      {/* 2. FOUR CORE PILLARS */}
      <section id="we-why" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '01 · चार सशक्तीकरण स्तंभ' : '01 · FOUR EMPOWERMENT PILLARS'}
            titleHi="आजीविका, स्वास्थ्य, डिजिटल ज्ञान और नेतृत्व का संगम"
            titleEn="Uniting Livelihoods, Health Awareness, Digital Skills & Leadership"
            lang={lang}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: ShoppingBag, hiT: 'SHG सूक्ष्म उद्यमिता', enT: 'SHG Micro-Enterprises', hiD: 'कपड़े के थैले, जैविक खाद्य पैकेजिंग और हस्तशिल्प से स्थानीय आय के सम्मानजनक अवसर।', enD: 'Cotton bags, clean spice & preserve packaging, and rural crafts connected to local markets.' },
              { icon: Smartphone, hiT: 'वित्तीय व डिजिटल साक्षरता', enT: 'Financial & Digital Literacy', hiD: 'सुरक्षित UPI, समूह खाता-बही, बचत योजना और ऑनलाइन ऑर्डर प्रबंधन का व्यावहारिक प्रशिक्षण।', enD: 'Safe UPI payments, SHG ledger bookkeeping, banking basics, and smartphone confidence.' },
              { icon: HeartPulse, hiT: 'स्वास्थ्य व स्वच्छता शिक्षा', enT: 'Doctor-Reviewed Health Literacy', hiD: 'एनीमिया, पोषण और मासिक धर्म स्वच्छता पर चिकित्सक-समीक्षित व संवेदनशील संवाद।', enD: 'Anemia, nutrition, and menstrual hygiene awareness reviewed with qualified medical advisors.' },
              { icon: Landmark, hiT: 'ग्राम सभा व हरित नेतृत्व', enT: 'Village & Green Leadership', hiD: 'जल संरक्षण, नर्सरी प्रबंधन और ग्राम स्वच्छता समितियों में महिला नेतृत्व को प्रोत्साहन।', enD: 'Encouraging women leaders across village water committees, nurseries, and green drives.' },
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

      {/* 3. VISUAL EXPLAINER: SHG ENTERPRISE CIRCLE */}
      <section id="we-shg" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '02 · स्वयं सहायता समूह मॉडल' : '02 · COLLECTIVE SHG ENTERPRISE FLOW'}
            titleHi="कपड़े के थैले व उत्पाद निर्माण से खाता-बही और सीधे बाजार तक"
            titleEn="From Cooperative Production to Digital Bookkeeping & Village Markets"
            lang={lang}
          />
          <img
            src={GENERATED_ASSETS.womenShgEnterpriseCircle}
            alt={lang === 'hi' ? 'महिला स्वयं सहायता समूह उद्यमिता चक्र' : 'Women Self-Help Group collective enterprise illustration'}
            className="w-full h-auto mix-blend-multiply"
          />
        </div>
      </section>

      {/* 4. HEALTH, PRIVACY & FINANCIAL LITERACY */}
      <section id="we-health" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <OrganicEditorialHeading
              eyebrow={lang === 'hi' ? '03 · स्वास्थ्य व गोपनीयता मानक' : '03 · HEALTH LITERACY & PRIVACY'}
              titleHi="संवेदनशील स्वास्थ्य जागरूकता एवं व्यक्तिगत गोपनीयता"
              titleEn="Respectful Health Education with Strict Privacy Protection"
              leadHi="ग्रामीण महिलाओं व किशोरियों के लिए पोषण, एनीमिया रोकथाम और मासिक धर्म स्वच्छता पर योग्य महिला चिकित्सकों द्वारा समीक्षित सत्र आयोजित किए जाते हैं।"
              leadEn="Community workshops on nutrition, anemia prevention, and menstrual hygiene are crafted with qualified female medical advisors in supportive village circles."
              lang={lang}
            />
            <div className="rounded-2xl bg-[#FAF6E8] border border-[#E5D3A3] p-5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#8E6212] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#4A3B14] leading-relaxed">
                {lang === 'hi'
                  ? 'गोपनीयता आश्वासन: किसी भी महिला की व्यक्तिगत स्वास्थ्य जानकारी सार्वजनिक वेबसाइट पर कभी प्रदर्शित या साझा नहीं की जाती।'
                  : 'Privacy Commitment: Individual personal health information is never publicly collected, shared, or displayed on this website.'}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <img
              src={GENERATED_ASSETS.womenSkill}
              alt={lang === 'hi' ? 'महिला समूह कौशल व सामुदायिक संवाद' : 'Women community skills and learning'}
              className="w-full h-auto rounded-3xl border border-[#E5DEC8]"
            />
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE SHG TRACK EXPLORER */}
      <section id="we-planner" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '04 · आजीविका मार्गदर्शक' : '04 · SHG LIVELIHOOD TRACK EXPLORER'}
            titleHi="अपने महिला समूह के लिए उपयुक्त कार्यक्षेत्र चुनें"
            titleEn="Explore Practical Enterprise Tracks for Your SHG"
            lang={lang}
          />
          <div className="flex flex-wrap gap-2.5">
            {SHG_TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTrackId(t.id)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTrack.id === t.id
                    ? 'bg-[#154A24] text-white'
                    : 'bg-white border border-[#DFD8C5] text-[#144721] hover:border-[#368737]'
                }`}
              >
                {lang === 'hi' ? t.hiTitle : t.enTitle}
              </button>
            ))}
          </div>
          <div className="rounded-3xl bg-white border border-[#DFD8C5] p-6 sm:p-8 space-y-5">
            <h3 className="text-xl font-extrabold text-[#114720]">
              {lang === 'hi' ? activeTrack.hiTitle : activeTrack.enTitle}
            </h3>
            <p className="text-sm text-[#395040] leading-relaxed">
              {lang === 'hi' ? activeTrack.hiDesc : activeTrack.enDesc}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(lang === 'hi' ? activeTrack.hiSteps : activeTrack.enSteps).map((step, i) => (
                <div key={step} className="rounded-2xl bg-[#FBFAF6] border border-[#E5DEC8] p-4 space-y-1">
                  <span className="text-[11px] font-extrabold text-[#C8922A]">STAGE 0{i + 1}</span>
                  <p className="text-xs sm:text-sm font-bold text-[#114720]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. JOIN & PORTAL */}
      <section id="we-join" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '05 · पंजीकरण एवं सहयोग' : '05 · REGISTER YOUR SHG OR PARTNER'}
            titleHi="महिला स्वयं सहायता समूह पंजीकरण"
            titleEn="Connect Your Women Self-Help Group With GOVEDA"
            lang={lang}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { cat: 'women-shg' as RegistrationCategory, icon: Users, hi: 'महिला स्वयं सहायता समूह (SHG)', en: 'Women SHG Registration' },
              { cat: 'skill-training' as RegistrationCategory, icon: Sparkles, hi: 'महिला कौशल एवं डिजिटल प्रशिक्षण', en: 'Women Skill & Digital Training' },
              { cat: 'csr-partner' as RegistrationCategory, icon: ShoppingBag, hi: 'कपड़े के थैले व CSR आजीविका सहयोग', en: 'CSR Livelihood & Cloth-Bag Support' },
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
          <div id="we-portal-form" key={portalFocusKey}>
            <RegistrationPortal
              lang={lang}
              initialCategory={selectedCategory}
              allowedCategories={['women-shg', 'skill-training', 'volunteer', 'csr-partner']}
              records={records}
              onAddRecord={onAddRecord}
            />
          </div>
        </div>
      </section>

      {/* 7. FAQS */}
      <section id="we-faqs" className="py-12 sm:py-16 bg-[#FBFAF6]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '06 · सामान्य प्रश्न' : '06 · FREQUENTLY ASKED QUESTIONS'}
            titleHi="महिला सशक्तीकरण मिशन से जुड़े प्रश्न"
            titleEn="Common Questions on Women SHGs & Support"
            lang={lang}
          />
          <div className="space-y-3">
            {WOMEN_FAQS.map((faq, idx) => {
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
