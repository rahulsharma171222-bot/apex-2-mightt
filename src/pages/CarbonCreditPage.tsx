import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Wind,
  Droplets,
  Sprout,
  Users,
  CloudCog,
  ShieldCheck,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Satellite,
  PhoneCall,
  AlertCircle,
  MapPin,
  Scale,
} from 'lucide-react';
import { RegistrationPortal } from '../components/RegistrationForms';
import {
  EditorialSectionHeading,
  CarbonArtisticHero,
  CarbonNaturePeopleApproach,
  CarbonHowImpactFlow,
  CarbonWhyWaveShowcase,
  CarbonGovedaBridgeShowcase,
  CarbonTreeAnatomyShowcase,
  CarbonPlantationMedallions,
  CarbonTenStepJourney,
  CarbonHundredSaplingModel,
  CarbonIndicativeCalculator,
  CarbonClimateSolutionCta,
} from '../components/CarbonEditorialSections';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { GENERATED_ASSETS } from '../data/assets';
import { CARBON_FAQS } from '../data/siteContent';
import { MISSIONS_DATA } from '../data/missionsData';
import { calculateBhilwaraProposedTarget } from '../utils/govedaLogic';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { Language, RegistrationRecord } from '../types/goveda';

interface CarbonCreditPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'cc-approach', hi: 'हमारा दृष्टिकोण', en: 'Our Approach' },
  { id: 'cc-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'cc-what', hi: 'कार्बन क्रेडिट क्या है', en: 'What Is It' },
  { id: 'cc-tree', hi: 'पेड़ और कार्बन', en: 'Tree Carbon Cycle' },
  { id: 'cc-plantation', hi: 'पौधे से संरक्षण तक', en: 'Plantation' },
  { id: 'cc-role', hi: 'GOVEDA की भूमिका', en: 'Our Role' },
  { id: 'cc-steps', hi: '10 चरणीय प्रक्रिया', en: '10-Step Process' },
  { id: 'cc-example', hi: '100 पौधे व अनुमानक', en: '100-Sapling & Calculator' },
  { id: 'cc-mrv', hi: 'Baseline व MRV', en: 'Baseline & MRV' },
  { id: 'cc-bhilwara', hi: 'भीलवाड़ा लक्ष्य', en: 'Bhilwara Target' },
  { id: 'cc-register', hi: 'पंजीकरण व स्थिति', en: 'Join & Status' },
  { id: 'cc-faqs', hi: 'FAQs', en: 'FAQs' },
] as const;

export function CarbonCreditPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: CarbonCreditPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<string>('cc-approach');
  const [selectedPortalCategory, setSelectedPortalCategory] = useState<
    'farmer' | 'harit-mitra' | 'expert-trainer'
  >('farmer');
  const [portalFocusKey, setPortalFocusKey] = useState(0);

  const { bootstrap } = usePublicPortal();
  const gov = bootstrap?.siteGovernance;
  const carbonUpdates = (bootstrap?.contentItems ?? []).filter(
    (c) => c.status === 'Published' && c.relatedMissionSlug === 'carbon-credit'
  );
  const bhilwaraMath = calculateBhilwaraProposedTarget(1840, 100, 100);
  const carbonMission = MISSIONS_DATA[0];

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

  const openRoleInPortal = (role: 'farmer' | 'harit-mitra' | 'expert-trainer') => {
    setSelectedPortalCategory(role);
    setPortalFocusKey((k) => k + 1);
    scrollToSection('cc-register');
  };

  const climateBenefits = [
    {
      icon: Wind,
      hi: 'स्वच्छ हवा व ठंडक',
      en: 'Cooler Clean Air',
      subHi: 'लू व धूल से प्राकृतिक बचाव',
      subEn: 'Natural heat & dust buffer',
    },
    {
      icon: Droplets,
      hi: 'जल संरक्षण',
      en: 'Water Security',
      subHi: 'जड़ों से भू-जल रिचार्ज',
      subEn: 'Root-led aquifer recharge',
    },
    {
      icon: Sprout,
      hi: 'उपजाऊ मिट्टी',
      en: 'Richer Farm Soil',
      subHi: 'जैविक ह्यूमस व नमी में वृद्धि',
      subEn: 'Higher organic carbon',
    },
    {
      icon: Users,
      hi: 'ग्रामीण सशक्तिकरण',
      en: 'Rural Strength',
      subHi: 'फल, चारा व स्थानीय कौशल',
      subEn: 'Fruit, fodder & stewardship',
    },
    {
      icon: CloudCog,
      hi: 'CO₂ अवशोषण',
      en: 'CO₂ Storage',
      subHi: 'पेड़ व मिट्टी में कार्बन भंडार',
      subEn: 'Living biomass carbon sink',
    },
    {
      icon: ShieldCheck,
      hi: 'जलवायु सुरक्षा',
      en: 'Climate Resilience',
      subHi: 'आने वाली पीढ़ियों का भविष्य',
      subEn: 'Generational protection',
    },
  ];

  const mrvPillars = [
    {
      letter: 'M',
      titleHi: 'Monitoring — नियमित फील्ड निगरानी',
      titleEn: 'Monitoring — Field Growth Tracking',
      descHi:
        'पौधारोपण के बाद जीवित रहने की दर, वृक्ष प्रजाति, तने की गोलाई, ऊँचाई और प्लॉट सीमा का बहु-वर्षीय वैज्ञानिक रिकॉर्ड।',
      descEn:
        'Multi-year field measurement of sapling survival, species mix, trunk diameter, tree height, and plot boundaries.',
    },
    {
      letter: 'R',
      titleHi: 'Reporting — पारदर्शी वैज्ञानिक रिपोर्टिंग',
      titleEn: 'Reporting — Methodology Accounting',
      descHi:
        'मापी गई फील्ड जानकारी को मान्यता प्राप्त वैज्ञानिक सूत्र (Methodology) में दर्ज कर स्पष्ट प्रगति रिपोर्ट तैयार करना।',
      descEn:
        'Compiling measured plot growth and biomass calculations into transparent, methodology-compliant reports.',
    },
    {
      letter: 'V',
      titleHi: 'Verification — स्वतंत्र तीसरे पक्ष का ऑडिट',
      titleEn: 'Verification — Independent Third-Party Audit',
      descHi:
        'GOVEDA से पूरी तरह स्वतंत्र मान्यता प्राप्त ऑडिटर (VVB) द्वारा फील्ड व डेटा की निष्पक्ष जाँच और अंतिम पुष्टि।',
      descEn:
        'Impartial site inspection and audit by an accredited third-party verifier completely independent of GOVEDA.',
    },
  ];

  return (
    <div className="bg-white text-[#153E1E]">
      {/* ====================================================================
          HERO — "GROWING A GREENER FUTURE" SUNLIT TREE + GLOWING ROOTS
          + CO₂ INTAKE BUBBLE + 3 LEADER CALLOUTS + 4-COLUMN TRANSPARENT BAR
         ==================================================================== */}
      <CarbonArtisticHero
        lang={lang}
        onNavigate={onNavigate}
        onScrollTo={scrollToSection}
      />

      {/* STICKY ONE-PAGE ANCHOR NAVIGATION */}
      <MissionAnchorNav
        tabs={ANCHOR_TABS}
        activeTab={activeTab}
        onSelect={scrollToSection}
        lang={lang}
        ariaLabel={lang === 'hi' ? 'कार्बन क्रेडिट पेज सेक्शन' : 'Carbon Credit Page Sections'}
      />

      {/* ====================================================================
          UNIFIED EDITORIAL APPROACH — NATURE. PEOPLE. CARBON. + FOCUS AREAS
         ==================================================================== */}
      <CarbonNaturePeopleApproach lang={lang} onScrollTo={scrollToSection} />

      {/* ====================================================================
          HOW CARBON CREDIT CREATES IMPACT — 4-STAGE SEQUENTIAL FLOW RIBBON
         ==================================================================== */}
      <CarbonHowImpactFlow lang={lang} onScrollTo={scrollToSection} />

      {/* ====================================================================
          SECTION 1: WHY IT MATTERS FIRST — PANORAMIC EDITORIAL SHOWCASE
         ==================================================================== */}
      <section
        id="cc-why"
        className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CarbonWhyWaveShowcase lang={lang} />
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: WHAT IS A CARBON CREDIT? — MASTER BRASS BALANCE SCALE
         ==================================================================== */}
      <section id="cc-what" className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#E2ECD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <EditorialSectionHeading
                eyebrow={lang === 'hi' ? '02 · सरल परिभाषा' : '02 · Plain-Language Concept'}
                titleHi="कार्बन क्रेडिट क्या है?"
                titleEn="What Is a Carbon Credit?"
                leadHi="जब कारखानों व वाहनों से हवा में कार्बन (CO₂) बढ़ता है, तो संतुलन बनाने के लिए प्रमाणित वृक्षारोपण और हरित परियोजनाएँ उस कार्बन को वापस सोखती हैं। इसी सत्यापित कटौती या हटाव की अंतर्राष्ट्रीय इकाई को कार्बन क्रेडिट कहते हैं।"
                leadEn="As industry and transport release excess CO₂, verified tree plantations and climate projects draw carbon back into living trees and soils. One Carbon Credit is the audited global unit measuring that verified balance."
                lang={lang}
              />

              {/* Crisp Typographic Equation Plaque */}
              <div className="rounded-2xl bg-[#FAF8F2] border border-[#E0D4B9] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#153E1E] text-[#C8F19E] flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.12em] text-[#5A7B3B]">
                    {lang === 'hi' ? 'प्रमाणित मानक इकाई' : 'Verified Global Standard Unit'}
                  </p>
                  <p className="mt-0.5 text-lg sm:text-xl font-extrabold text-[#153E1E]">
                    1 Carbon Credit = 1 {lang === 'hi' ? 'मीट्रिक टन CO₂e' : 'Metric Tonne CO₂e'}
                  </p>
                  <p className="text-xs text-[#4C5F52] mt-0.5">
                    {lang === 'hi'
                      ? '(1,000 किलोग्राम ग्रीनहाउस गैस का सत्यापित हटाव या कटौती)'
                      : '(1,000 kg of greenhouse gas verified as removed or reduced)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: LARGE Seamless Master Style Botanical Brass Balance Scale */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-[540px] aspect-[4/3] flex items-center justify-center">
                <img
                  src={GENERATED_ASSETS.carbonMasterBalanceScale}
                  alt={
                    lang === 'hi'
                      ? 'वायुमंडलीय कार्बन और जीवित देशी वृक्ष व उपजाऊ मिट्टी के बीच संतुलन दर्शाती पीतल की तराज़ू का कलात्मक चित्र'
                      : 'Museum-grade editorial illustration of an antique brushed-brass balance scale harmonizing atmospheric emissions with a thriving native tree in living soil'
                  }
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02] select-none"
                />
              </div>
              <p className={`mt-1 text-center text-xs italic text-[#526557] ${lang === 'hi' ? 'font-hindi not-italic' : ''}`}>
                {lang === 'hi'
                  ? 'उत्सर्जन (CO₂) और वृक्ष-अवशोषण के बीच वैज्ञानिक संतुलन की इकाई'
                  : 'Balancing atmospheric CO₂ with living native agroforestry biomass'}
              </p>
            </div>
          </div>

          {/* 3 Clean Hairline Reading Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#DFCFAF]">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#9A580B]">
                01 · {lang === 'hi' ? 'उत्सर्जन (Emissions)' : 'Emissions'}
              </p>
              <p className={`text-xs sm:text-[13.5px] text-[#354439] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'ऊर्जा, परिवहन, उद्योग और भूमि क्षरण से वायुमंडल में अतिरिक्त CO₂ जमा होती है, जिससे तापमान और मौसम का संतुलन बिगड़ता है।'
                  : 'Energy, transport, industry, and land degradation add excess CO₂ to the atmosphere, driving extreme heat.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#153E1E]">
                02 · {lang === 'hi' ? 'वैज्ञानिक सत्यापन (Verification)' : 'Scientific Verification'}
              </p>
              <p className={`text-xs sm:text-[13.5px] text-[#354439] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'जब किसी पात्र परियोजना में 1,000 किग्रा (1 टन) CO₂ की कमी या हटाव स्वतंत्र ऑडिट में सिद्ध होता है, तब 1 कार्बन क्रेडिट बनता है।'
                  : 'When an eligible project proves 1,000 kg (1 tonne) of CO₂ removal under independent audit, it equals 1 Carbon Credit.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#2F6D26]">
                03 · {lang === 'hi' ? 'प्रकृति व किसान को लाभ' : 'Climate & Village Value'}
              </p>
              <p className={`text-xs sm:text-[13.5px] text-[#354439] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'कार्बन क्रेडिट के अतिरिक्त भी वृक्षारोपण से गाँव को ठंडी हवा, बेहतर मिट्टी, भू-जल सुरक्षा, फल और चारे का स्थायी लाभ मिलता है।'
                  : 'Even beyond carbon markets, living trees reward villages with cooler air, richer soil, groundwater, fruit, and fodder.'}
              </p>
            </div>
          </div>

          {/* 6 Direct Climate Co-Benefits */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {climateBenefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.en}
                  className="rounded-2xl bg-white border border-[#DFCFAF]/85 p-4 text-center flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FCF8F0] border border-[#DFCFAF] text-[#1B5A32] flex items-center justify-center mb-2.5">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <p className={`text-xs sm:text-sm font-bold text-[#153E1E] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? b.hi : b.en}
                  </p>
                  <p className="mt-1 text-[11px] text-[#4C5F52] leading-snug">
                    {lang === 'hi' ? b.subHi : b.subEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: FLOATING BOTANICAL PLATE — HOW TREES ABSORB & STORE CARBON
         ==================================================================== */}
      <section
        id="cc-tree"
        className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialSectionHeading
            eyebrow={lang === 'hi' ? '03 · प्रकृति का कार्बन चक्र' : '03 · Nature’s Carbon Cycle'}
            titleHi="पेड़ कैसे कार्बन को अवशोषित और संग्रहित करता है?"
            titleEn="How a Tree Absorbs & Stores Carbon"
            leadHi="एक स्वस्थ देशी पेड़ पत्तियों से लेकर तने, गहरी जड़ों और मिट्टी तक 4 स्तरों पर कार्बन को सुरक्षित रखता है। चारों स्तरों को सीधे नीचे देखें।"
            leadEn="A thriving native tree locks carbon across four living layers—leaves, woody trunk, deep roots, and dark organic humus. All four layers are mapped directly below."
            lang={lang}
            align="center"
          />

          <CarbonTreeAnatomyShowcase lang={lang} />
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: 5-STAGE CIRCULAR MEDALLION PLANTATION STORY
         ==================================================================== */}
      <section id="cc-plantation" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-11">
          <EditorialSectionHeading
            eyebrow={lang === 'hi' ? '04 · पौधे से संरक्षण तक' : '04 · Sapling to Living Canopy'}
            titleHi="वृक्षारोपण कार्यक्रम — केवल पौधा लगाना नहीं, जीवित रखना लक्ष्य है"
            titleEn="Tree Plantation Programme — From Planting to Multi-Year Survival"
            leadHi="सफल जलवायु कार्रवाई एक दिन के फोटो से नहीं, बल्कि सही देशी प्रजाति चुनने, सावधानी से लगाने, नियमित पानी देने और ट्री-गार्ड से बचाने पर निर्भर करती है।"
            leadEn="Real climate action is built over years, not on planting day alone—from picking resilient native species to watering and protecting saplings until they thrive."
            lang={lang}
            align="center"
          />

          <CarbonPlantationMedallions lang={lang} />
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: WHERE GOVEDA COMES INTO PLAY — ANNOTATED BRIDGE ILLUSTRATION
         ==================================================================== */}
      <section id="cc-role" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialSectionHeading
            eyebrow={lang === 'hi' ? '05 · यहाँ GOVEDA कैसे काम करता है' : '05 · Where GOVEDA Comes Into Play'}
            titleHi="किसान, विज्ञान और पारदर्शी व्यवस्था के बीच GOVEDA का सेतु"
            titleEn="How GOVEDA Bridges Rural Farmers & Science-Led Climate Action"
            leadHi="गाँव के किसान के पास भूमि और मेहनत है, लेकिन कार्बन मानकों की तकनीकी प्रक्रिया, क्लस्टर निर्माण और स्वतंत्र ऑडिट अकेले करना कठिन होता है। नीचे दी गई चित्र-व्याख्या दिखाती है कि GOVEDA इन सभी कड़ियों को ईमानदारी से कैसे जोड़ता है।"
            leadEn="Smallholders bring land and stewardship, while carbon standards, cluster aggregation, and independent audits require coordination. Explore the annotated visual bridge below to see how GOVEDA connects each link transparently."
            lang={lang}
            align="center"
          />

          <CarbonGovedaBridgeShowcase lang={lang} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                kickerHi: 'गाँव व किसान',
                kickerEn: 'Farmers & Villages',
                titleHi: 'सच्ची जागरूकता और सामूहिक क्लस्टर',
                titleEn: 'Honest Awareness & Village Clusters',
                descHi:
                  'भ्रामक अफवाहों से बचाकर किसानों को सरल हिंदी में सही जानकारी देना और आसपास के गाँवों को एकजुट क्लस्टर के रूप में तैयार करना ताकि छोटे किसान भी पात्र पहल से जुड़ सकें।',
                descEn:
                  'Replacing false promises with honest local education and organizing neighbouring smallholders into viable village-level agroforestry clusters.',
              },
              {
                num: '02',
                kickerHi: 'GOVEDA व हरित मित्र',
                kickerEn: 'GOVEDA & Harit Mitra',
                titleHi: 'फील्ड समन्वय, पद्धति व MRV तैयारी',
                titleEn: 'Field Guidance, Methodology & MRV',
                descHi:
                  'स्थानीय स्वैच्छिक हरित मित्रों और तकनीकी टीम के माध्यम से पंजीकरण सहायता, पौधा देखभाल मार्गदर्शन, Baseline/Additionality रिकॉर्ड और समर्पित MRV दस्तावेज़ीकरण की तैयारी।',
                descEn:
                  'Voluntary local Harit Mitras and technical coordinators support registration, sapling survival tracking, Baseline records, and structured MRV readiness.',
              },
              {
                num: '03',
                kickerHi: 'सत्यापन व पारदर्शिता',
                kickerEn: 'Audit & Stewardship',
                titleHi: 'स्वतंत्र ऑडिट, CSR व लिखित लाभ-साझेदारी',
                titleEn: 'Independent Audit & Transparent Sharing',
                descHi:
                  'मान्यता प्राप्त स्वतंत्र ऑडिटर (VVB), रजिस्ट्री मानकों और जिम्मेदार CSR/संस्थागत साझेदारों के साथ पारदर्शी समन्वय—और लिखित अनुबंध के तहत ही संभावित शुद्ध लाभ का वितरण।',
                descEn:
                  'Coordinating with accredited independent verifiers, registries, and responsible CSR partners under clear written agreements.',
              },
            ].map((item) => (
              <div key={item.num} className="pt-5 border-t border-[#DFCFAF] space-y-2">
                <p className="text-xs font-bold text-[#5A7B3B]">
                  {item.num} · {lang === 'hi' ? item.kickerHi : item.kickerEn}
                </p>
                <h3 className={`text-base font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? item.titleHi : item.titleEn}
                </h3>
                <p className={`text-xs sm:text-[13.5px] text-[#35463A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#F4F9F0] border border-[#6EB83A]/30 px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-[#153E1E]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4B8E27] shrink-0" aria-hidden="true" />
              <span>
                {lang === 'hi'
                  ? 'भूमि का 100% मालिकाना हक किसान के पास सुरक्षित'
                  : '100% land ownership always remains with the farmer'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4B8E27] shrink-0" aria-hidden="true" />
              <span>
                {lang === 'hi'
                  ? 'प्रारंभिक पंजीकरण में कोई जमीन दस्तावेज़ अनिवार्य नहीं'
                  : 'Zero sensitive land documents required upfront'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4B8E27] shrink-0" aria-hidden="true" />
              <span>
                {lang === 'hi'
                  ? 'अन्य मिशनों से पृथक, पूर्णतः पारदर्शी कार्बन प्रक्रिया'
                  : 'Strictly focused & transparent climate governance'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: 10-STEP CARBON PROJECT JOURNEY
         ==================================================================== */}
      <section id="cc-steps" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialSectionHeading
            eyebrow={lang === 'hi' ? '06 · संपूर्ण 10 चरणीय यात्रा' : '06 · Complete 10-Step Lifecycle'}
            titleHi="कार्बन परियोजना विकास की 10 चरणीय प्रक्रिया"
            titleEn="Carbon Project Development — 10-Step Roadmap"
            leadHi="किसी भी वास्तविक कार्बन परियोजना को प्रारंभिक पंजीकरण (01) से लेकर स्वतंत्र सत्यापन और संभावित लाभ-साझेदारी (10) तक तीन स्पष्ट अध्यायों में पूरा किया जाता है।"
            leadEn="Every credible carbon project advances through 10 transparent steps across three clear phases—from light village registration to independent verification and benefit sharing."
            lang={lang}
          />

          <CarbonTenStepJourney lang={lang} />
        </div>
      </section>

      {/* ====================================================================
          SECTION 7: 100-SAPLING FARMER MODEL
         ==================================================================== */}
      <section id="cc-example" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialSectionHeading
            eyebrow={lang === 'hi' ? '07 · किसान उदाहरण मॉडल' : '07 · Illustrative Farmer Model'}
            titleHi="100 पौधों का उदाहरण — सरल क्रम में समझें पूरी सच्चाई"
            titleEn="The 100-Sapling Farmer Journey — Step-by-Step Example"
            leadHi="यदि कोई किसान अपने खेत पर 100 देशी पौधे लगाता है, तो पौधारोपण से लेकर कई वर्षों की देखभाल, वैज्ञानिक मापन और संभावित शुद्ध लाभ तक की वास्तविक प्रक्रिया कैसी दिखती है:"
            leadEn="Follow a farmer’s 100-sapling journey across six clear stages—from planting day to multi-year care, scientific measurement, independent audit, and honest net benefit accounting."
            lang={lang}
          />

          <CarbonHundredSaplingModel lang={lang} />

          {/* Sequential Interactive Indicative (Sambhavit) Carbon & Co-Benefit Estimator */}
          <CarbonIndicativeCalculator
            lang={lang}
            onScrollToRegister={() => scrollToSection('cc-register')}
          />
        </div>
      </section>

      {/* ====================================================================
          SECTION 8: BASELINE, ADDITIONALITY & MRV — UNIFIED FULL-WIDTH DIORAMA
          Left arid soil aligns with Baseline card · Right lush trees + bamboo
          guards + measuring tape + solar sensor aligns with Additionality card!
         ==================================================================== */}
      <section id="cc-mrv" className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#E2ECD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <EditorialSectionHeading
            eyebrow={lang === 'hi' ? '08 · वैज्ञानिक आधार — Baseline, Additionality व MRV' : '08 · Science of Baseline, Additionality & MRV'}
            titleHi="क्यों ज़रूरी है वैज्ञानिक तुलना और स्वतंत्र निगरानी (MRV)?"
            titleEn="Baseline, Additionality & Field Verification (MRV)"
            leadHi="अंतर्राष्ट्रीय कार्बन मानक केवल यह नहीं देखते कि पेड़ कितने हैं—वे वैज्ञानिक प्रमाण माँगते हैं कि परियोजना के बिना भूमि की स्थिति क्या थी (Baseline) और परियोजना से कितना वास्तविक अतिरिक्त बदलाव आया (Additionality)।"
            leadEn="Credible carbon standards require scientific proof comparing what the land looked like without the project (Baseline) against the real extra trees and carbon added (Additionality)."
            lang={lang}
            align="center"
          />

          {/* UNIFIED VISUAL + EXPLANATION COMPOSITION: FULL-WIDTH BASELINE → ADDITIONALITY DIORAMA */}
          <div className="space-y-6">
            <div className="mx-auto max-w-[920px]">
              <img
                src={GENERATED_ASSETS.carbonMasterMrvBaseline}
                alt={
                  lang === 'hi'
                    ? 'बाईं ओर सूखी बंजर भूमि (Baseline) से दाईं ओर बांस ट्री-गार्ड, नापने के फीते और सोलर सेंसर के साथ हरे-भरे देशी वृक्षों (Additionality व MRV) में परिवर्तन का कलात्मक दृश्य'
                    : 'Unified editorial terrain cutaway transitioning from dry unplanted baseline soil on the left to dark humus with bamboo-guarded native trees, measuring tape, and solar sensor on the right'
                }
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/9] object-contain mix-blend-multiply contrast-[1.03] brightness-[1.02] select-none"
              />
            </div>

            {/* Aligned Left (Baseline) vs. Right (Additionality) Directly Beneath Their Halves */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pt-2 border-t border-[#E2ECD5]">
              <div className="pt-4 space-y-1.5">
                <p className="text-xs font-extrabold tracking-[0.1em] text-[#9A580B]">
                  ← {lang === 'hi' ? 'बाईं ओर · Baseline (परियोजना से पहले)' : 'LEFT · Baseline (Without Project)'}
                </p>
                <h3 className="text-base sm:text-lg font-extrabold text-[#153E1E] font-hindi">
                  {lang === 'hi'
                    ? 'परियोजना के बिना खाली, तपते खेत'
                    : 'Unplanted ground with low carbon'}
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#3F5145] leading-relaxed">
                  {lang === 'hi'
                    ? 'पौधारोपण से पूर्व की सूखी भूमि, मौजूदा वृक्ष घनत्व और मिट्टी के जैविक कार्बन का प्रारंभिक वैज्ञानिक रिकॉर्ड—जिससे आगे की तुलना होती है।'
                    : 'Documenting pre-project fallow ground, existing tree cover, and baseline soil carbon as the scientific reference point.'}
                </p>
              </div>

              <div className="pt-4 md:pl-6 md:border-l md:border-[#E2ECD5] space-y-1.5">
                <p className="text-xs font-extrabold tracking-[0.1em] text-[#266B2A]">
                  {lang === 'hi' ? 'दाईं ओर · Additionality व MRV (परियोजना के बाद) →' : 'RIGHT · Additionality & MRV (With Project) →'}
                </p>
                <h3 className="text-base sm:text-lg font-extrabold text-[#153E1E] font-hindi">
                  {lang === 'hi'
                    ? 'ट्री-गार्ड, नाप-जोख व वैज्ञानिक निगरानी से वास्तविक अतिरिक्त कार्बन'
                    : 'Verified new agroforestry removal with field MRV'}
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#3F5145] leading-relaxed">
                  {lang === 'hi'
                    ? 'बांस के ट्री-गार्ड से सुरक्षित नए देशी पेड़, तने की गोलाई का फील्ड मापन और सोलर मृदा निगरानी—यह सिद्ध करते हैं कि अतिरिक्त कार्बन इसी संगठित पहल से बना।'
                    : 'Bamboo-protected native trees, trunk girth measurement, and soil monitoring prove that new surviving biomass occurs directly because of the project.'}
                </p>
              </div>
            </div>
          </div>

          {/* M · R · V 3-Column Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mrvPillars.map((m) => (
              <div
                key={m.letter}
                className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#153E1E] text-[#C8F19E] font-extrabold text-lg flex items-center justify-center">
                  {m.letter}
                </div>
                <h3 className={`text-sm sm:text-base font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? m.titleHi : m.titleEn}
                </h3>
                <p className={`text-xs sm:text-[13px] text-[#35463A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? m.descHi : m.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* Leakage Safeguard + GPS Honesty Notice + Admin Geo-MRV Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 rounded-2xl bg-[#FFF9EE] border border-[#D98A2B]/40 p-5 flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-[#A45D09] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1.5">
                <h4 className={`text-sm font-bold text-[#6E3D04] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi'
                    ? 'केवल GPS फोटो अपलोड करने से कार्बन क्रेडिट नहीं बनते'
                    : 'Uploading a GPS Photo Alone Does Not Generate Carbon Credits'}
                </h4>
                <p className="text-xs sm:text-[13px] text-[#5C3A10] leading-relaxed">
                  {lang === 'hi'
                    ? 'GPS और जियो-टैगिंग केवल पारदर्शिता का सहायक उपकरण है। वास्तविक कार्बन क्रेडिट के लिए पात्र भूमि, Baseline, Additionality, Leakage नियंत्रण, बहु-वर्षीय MRV, स्वतंत्र सत्यापन और रजिस्ट्री की स्वीकृति अनिवार्य है।'
                    : 'GPS geo-tagging is only one transparency tool. Real credit issuance always requires eligible land, Baseline, Additionality, Leakage safeguards, multi-year MRV, independent verification, and registry approval.'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-white border border-[#DFCFAF] p-5 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <Satellite className="w-5 h-5 text-[#1B5A32] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold text-[#1B5A32]">
                    {lang === 'hi' ? 'समर्पित Geo-MRV सॉफ्टवेयर मॉड्यूल' : 'Dedicated Geo-MRV Module'}
                  </p>
                  <p className="mt-1 text-xs text-[#35463A] leading-relaxed">
                    {gov
                      ? lang === 'hi'
                        ? gov.geoMrvNoteHi
                        : gov.geoMrvNoteEn
                      : lang === 'hi'
                      ? 'वृक्ष-स्तरीय GPS जियो-टैगिंग, ऊँचाई/वृद्धि ट्रैकिंग और फील्ड सत्यापन के लिए अलग समर्पित MRV सॉफ्टवेयर मॉड्यूल विकसित किया जा रहा है।'
                      : 'Tree-level GPS geo-tagging, growth logs, and field audits will operate via a separate dedicated Geo-MRV software module.'}
                  </p>
                </div>
              </div>

              {gov?.geoMrvStatus === 'active' && gov.geoMrvUrl && (
                <a
                  href={gov.geoMrvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#153E1E] text-white text-xs font-bold hover:bg-[#1E562A]"
                >
                  <span>{lang === 'hi' ? 'Geo-MRV पोर्टल खोलें' : 'Open Geo-MRV Portal'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 9: BHILWARA HARIT ABHIYAN — LUSH GREEN FOREST & FARM BANNER
          (Zero desert strip! Rich emerald landscape for Harit Abhiyan!)
         ==================================================================== */}
      <section
        id="cc-bhilwara"
        className="scroll-mt-32 relative overflow-hidden border-b border-[#1A4E27]"
      >
        {/* Lush Green Bhilwara Valley & Plantation Backdrop with Deep Emerald Readability Scrim */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img
            src={GENERATED_ASSETS.carbonBhilwaraPanorama}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E3119]/92 via-[#133D20]/84 to-[#164726]/86" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 space-y-8 relative z-10 text-white">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-[1.5px] w-10 bg-[#A7E464]" aria-hidden="true" />
                <span className="text-xs font-extrabold tracking-[0.18em] text-[#C8F19E]">
                  {lang === 'hi'
                    ? '09 · भीलवाड़ा हरित अभियान — प्रस्तावित दृष्टि'
                    : '09 · REGIONAL PROPOSED VISION'}
                </span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl lg:text-[2.3rem] font-extrabold text-white leading-[1.15] tracking-tight text-balance ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi'
                  ? 'भीलवाड़ा हरित अभियान — प्रस्तावित लक्ष्य (Proposed Targets)'
                  : 'Real Climate Action. Measurable Proposed Targets.'}
              </h2>
              <p
                className={`text-sm sm:text-[15px] text-[#E3F3E0] leading-[1.7] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi'
                  ? 'राजस्थान के प्रारंभिक पाँच फोकस जिलों (भीलवाड़ा, चूरू, बीकानेर, फलोदी व जोधपुर) में से भीलवाड़ा के लिए ग्राम-स्तरीय सहभागिता आधारित एक प्रस्तावित हरित लक्ष्य मॉडल तैयार किया गया है।'
                  : 'Across our five initial Rajasthan focus districts (Bhilwara, Churu, Bikaner, Phalodi, and Jodhpur), Bhilwara serves as our village-scale proposed agroforestry target framework.'}
              </p>
            </div>
            <p className="text-xs font-bold text-[#FDE39D] shrink-0">
              {lang === 'hi'
                ? 'प्रस्तावित लक्ष्य (उपलब्धि नहीं) · Proposed Target Only'
                : 'Proposed Target Only · Not Achieved Results'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
            <div className="rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 p-5 text-center flex flex-col justify-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                {(1840).toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#D6EFCE]">
                {lang === 'hi' ? 'गाँव (Villages)' : 'Villages'}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 p-5 text-center flex flex-col justify-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">× 100</p>
              <p className="mt-1 text-xs font-semibold text-[#D6EFCE]">
                {lang === 'hi' ? 'किसान प्रति गाँव' : 'Farmers / Village'}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 p-5 text-center flex flex-col justify-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">× 100</p>
              <p className="mt-1 text-xs font-semibold text-[#D6EFCE]">
                {lang === 'hi' ? 'पौधे प्रति किसान' : 'Saplings / Farmer'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#276B35]/80 backdrop-blur-xs border border-[#9FE064]/50 p-5 text-center flex flex-col justify-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#D5F8A9] tabular-nums">
                {bhilwaraMath.inCrores.toFixed(2)} {lang === 'hi' ? 'करोड़' : 'Cr'}
              </p>
              <p className="mt-1 text-xs font-semibold text-white">
                {lang === 'hi' ? 'प्रस्तावित ग्रामीण लक्ष्य' : 'Proposed Rural Target'}
              </p>
            </div>

            <div className="col-span-2 lg:col-span-1 rounded-2xl bg-[#82C341] text-[#0E2D15] p-5 text-center flex flex-col justify-center">
              <p className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                2.5 – 3 {lang === 'hi' ? 'करोड़' : 'Cr'}
              </p>
              <p className="mt-1 text-xs font-bold leading-snug">
                {lang === 'hi'
                  ? 'विस्तारित प्रस्तावित लक्ष्य (शहरी व अतिरिक्त रोपण सहित)'
                  : 'Expanded Proposed Target (incl. Urban & Institutional)'}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#0B2613]/70 border border-[#F3C86A]/45 px-4 py-3 flex items-start gap-2.5 text-xs text-[#FBEBC2]">
            <AlertCircle className="w-4 h-4 text-[#F5C55B] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              {lang === 'hi'
                ? 'ये सभी आँकड़े प्रस्तावित योजनागत लक्ष्य (Proposed Targets) हैं, न कि वर्तमान में प्राप्त उपलब्धि (Achieved Results)। वास्तविक प्रगति चरणबद्ध सहभागिता और संस्थागत सहयोग से सत्यापित की जाएगी।'
                : 'All figures above represent Proposed Planning Targets, NOT achieved results. Actual field progress will be published transparently as verified phases advance.'}
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 10: JOIN MISSION — CLEAN CIRCULAR PORTRAIT CARDS + LIVE PORTAL
         ==================================================================== */}
      <section id="cc-register" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9">
          <EditorialSectionHeading
            eyebrow={lang === 'hi' ? '10 · पंजीकरण एवं आवेदन स्थिति' : '10 · Registration & Live Status'}
            titleHi="मिशन से जुड़ें — किसान, हरित मित्र या विशेषज्ञ के रूप में"
            titleEn="Join the Carbon Mission & Check Application Status"
            leadHi={carbonMission.disclaimer?.hi}
            leadEn={carbonMission.disclaimer?.en}
            lang={lang}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Farmer Role Card */}
            <div
              className={`rounded-2xl p-5 border transition-colors flex flex-col justify-between ${
                selectedPortalCategory === 'farmer'
                  ? 'border-[#153E1E] bg-[#153E1E] text-white'
                  : 'border-[#DFCFAF] bg-white text-[#153E1E]'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={GENERATED_ASSETS.carbonFarmerPortrait}
                  alt={lang === 'hi' ? 'राजस्थानी किसान' : 'Rajasthani farmer'}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#DFCFAF] shrink-0"
                />
                <div>
                  <p className={`text-[11px] font-semibold ${selectedPortalCategory === 'farmer' ? 'text-[#C8F19E]' : 'text-[#5A7B3B]'}`}>
                    {lang === 'hi' ? '100% भूमि स्वामित्व सुरक्षित' : '100% Farmer Land Ownership'}
                  </p>
                  <h3 className="mt-0.5 text-base font-bold font-hindi">
                    {lang === 'hi' ? 'किसान पंजीकरण' : 'Farmer Registration'}
                  </h3>
                  <p className={`mt-1.5 text-xs leading-relaxed ${selectedPortalCategory === 'farmer' ? 'text-white/85' : 'text-[#3F5145]'}`}>
                    {lang === 'hi'
                      ? 'वृक्षारोपण व कृषि-वानिकी में भाग लेने हेतु सरल पंजीकरण। प्रारंभ में कोई भूमि कागजात अनिवार्य नहीं।'
                      : 'Simple initial registration for agroforestry. Zero land papers required upfront.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openRoleInPortal('farmer')}
                className={`mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold cursor-pointer ${
                  selectedPortalCategory === 'farmer'
                    ? 'bg-[#82C341] text-[#102E16]'
                    : 'bg-[#153E1E] text-white hover:bg-[#1E562A]'
                }`}
              >
                <span>{lang === 'hi' ? 'किसान के रूप में जुड़ें' : 'Join as Farmer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Harit Mitra Role Card */}
            <div
              className={`rounded-2xl p-5 border transition-colors flex flex-col justify-between ${
                selectedPortalCategory === 'harit-mitra'
                  ? 'border-[#153E1E] bg-[#153E1E] text-white'
                  : 'border-[#DFCFAF] bg-white text-[#153E1E]'
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={GENERATED_ASSETS.carbonHaritMitraPortrait}
                  alt={lang === 'hi' ? 'हरित मित्र समन्वयक' : 'Harit Mitra coordinator'}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#DFCFAF] shrink-0"
                />
                <div>
                  <p className={`text-[11px] font-semibold ${selectedPortalCategory === 'harit-mitra' ? 'text-[#C8F19E]' : 'text-[#5A7B3B]'}`}>
                    {lang === 'hi' ? 'स्वैच्छिक सामुदायिक भूमिका' : 'Voluntary Community Role'}
                  </p>
                  <h3 className="mt-0.5 text-base font-bold font-hindi">
                    {lang === 'hi' ? 'हरित मित्र पंजीकरण' : 'Harit Mitra Registration'}
                  </h3>
                  <p className={`mt-1.5 text-xs leading-relaxed ${selectedPortalCategory === 'harit-mitra' ? 'text-white/85' : 'text-[#3F5145]'}`}>
                    {lang === 'hi'
                      ? 'गाँव में किसानों को जोड़ने, जागरूकता बढ़ाने और रेफरल समन्वय में सहयोग करें (सवेतन नौकरी नहीं)।'
                      : 'Guide local farmers, spread awareness, and support village drives (voluntary role, not paid employment).'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openRoleInPortal('harit-mitra')}
                className={`mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold cursor-pointer ${
                  selectedPortalCategory === 'harit-mitra'
                    ? 'bg-[#82C341] text-[#102E16]'
                    : 'bg-[#153E1E] text-white hover:bg-[#1E562A]'
                }`}
              >
                <span>{lang === 'hi' ? 'हरित मित्र बनें' : 'Join as Harit Mitra'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Expert Support Card */}
            <div
              className={`rounded-2xl p-5 border transition-colors flex flex-col justify-between ${
                selectedPortalCategory === 'expert-trainer'
                  ? 'border-[#153E1E] bg-[#153E1E] text-white'
                  : 'border-[#DFCFAF] bg-white text-[#153E1E]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 border-[#DFCFAF] ${
                    selectedPortalCategory === 'expert-trainer'
                      ? 'bg-white/15 text-[#C8F19E]'
                      : 'bg-[#FCF8F0] text-[#1B5A32]'
                  }`}
                >
                  <PhoneCall className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className={`text-[11px] font-semibold ${selectedPortalCategory === 'expert-trainer' ? 'text-[#C8F19E]' : 'text-[#5A7B3B]'}`}>
                    {lang === 'hi' ? 'तकनीकी व प्रशिक्षण योगदान' : 'Technical & Advisory'}
                  </p>
                  <h3 className="mt-0.5 text-base font-bold font-hindi">
                    {lang === 'hi' ? 'विशेषज्ञ मार्गदर्शन' : 'Expert Support'}
                  </h3>
                  <p className={`mt-1.5 text-xs leading-relaxed ${selectedPortalCategory === 'expert-trainer' ? 'text-white/85' : 'text-[#3F5145]'}`}>
                    {lang === 'hi'
                      ? 'कृषि-वानिकी, मृदा विज्ञान, MRV या प्रशिक्षण विशेषज्ञ के रूप में मिशन से जुड़ें।'
                      : 'Join as an agroforestry, soil science, MRV, or farmer-training specialist.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openRoleInPortal('expert-trainer')}
                className={`mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold cursor-pointer ${
                  selectedPortalCategory === 'expert-trainer'
                    ? 'bg-[#82C341] text-[#102E16]'
                    : 'bg-[#153E1E] text-white hover:bg-[#1E562A]'
                }`}
              >
                <span>{lang === 'hi' ? 'विशेषज्ञ फॉर्म खोलें' : 'Open Expert Form'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-[#DFCFAF] p-4 sm:p-6">
            <RegistrationPortal
              key={`${selectedPortalCategory}-${portalFocusKey}`}
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory={selectedPortalCategory}
              allowedCategories={['farmer', 'harit-mitra', 'expert-trainer']}
            />
          </div>

          <div className="rounded-2xl bg-[#153E1E] text-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C8F19E]">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {lang === 'hi'
                    ? 'ग्राम पंचायत · विश्वविद्यालय · CSR साझेदारी संवाद'
                    : 'Gram Panchayat · University · CSR Dialogue'}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold font-hindi">
                {lang === 'hi'
                  ? 'संस्थागत वृक्षारोपण, किसान प्रशिक्षण या पारदर्शी जलवायु सहयोग के लिए हमारी तकनीकी टीम से सीधे जुड़ें।'
                  : 'Connect directly with our team for institutional tree drives, farmer orientation, or transparent CSR partnerships.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#82C341] text-[#102E16] text-xs sm:text-sm font-bold hover:bg-[#95D456] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>{lang === 'hi' ? 'विशेषज्ञ से संपर्क करें' : 'Contact Expert Desk'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 11: LEARNING RESOURCES, FIELD UPDATES & 14 FAQs + VILLAGE HORIZON
         ==================================================================== */}
      <section id="cc-faqs" className="scroll-mt-32 bg-white pt-14 sm:pt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-[#5A7B3B]">
                  {lang === 'hi' ? 'सीखने के संसाधन' : 'Carbon Learning Center'}
                </p>
                <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#153E1E] font-hindi">
                  {lang === 'hi'
                    ? 'कार्बन जागरूकता लेख, वीडियो व मार्गदर्शिकाएँ'
                    : 'Awareness Articles, Video Guides & Field Handbooks'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/training')}
                className="self-start sm:self-end inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#153E1E] hover:text-[#2F6D26] cursor-pointer"
              >
                <span>{lang === 'hi' ? 'प्रशिक्षण व संसाधन केंद्र खोलें' : 'Open Training & Resources'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                {
                  icon: BookOpen,
                  hi: 'सरल लेख (Articles)',
                  en: 'Plain-Language Articles',
                  subHi: 'कृषि-वानिकी व मृदा कार्बन',
                  subEn: 'Agroforestry & soil science',
                  path: '/magazine',
                },
                {
                  icon: Video,
                  hi: 'वीडियो मार्गदर्शन',
                  en: 'Video Orientation',
                  subHi: 'किसानों व हरित मित्रों हेतु',
                  subEn: 'Visual Hindi/English guides',
                  path: '/training',
                },
                {
                  icon: FileText,
                  hi: 'PDF पुस्तिकाएँ',
                  en: 'PDF Field Guides',
                  subHi: 'पौधा देखभाल व पात्रता नियम',
                  subEn: 'Sapling survival handbooks',
                  path: '/training',
                },
                {
                  icon: HelpCircle,
                  hi: '14 सामान्य प्रश्न',
                  en: '14 Honest FAQs',
                  subHi: 'नीचे हर प्रश्न का सीधा उत्तर',
                  subEn: 'Clear answers directly below',
                  path: '',
                },
              ].map((res) => {
                const Icon = res.icon;
                return (
                  <button
                    key={res.en}
                    type="button"
                    onClick={() => (res.path ? onNavigate(res.path) : scrollToSection('cc-faq-list'))}
                    className="text-left rounded-2xl bg-[#FCF8F0] border border-[#DFCFAF] p-4 hover:border-[#6EB83A] transition-colors cursor-pointer flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-white text-[#1B5A32] border border-[#DFCFAF] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#153E1E]">
                        {lang === 'hi' ? res.hi : res.en}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#4C5F52]">
                        {lang === 'hi' ? res.subHi : res.subEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {carbonUpdates.length > 0 && (
              <div className="pt-2 space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-[#153E1E]">
                  {lang === 'hi'
                    ? 'कार्बन कार्यक्रम — नवीनतम फ़ील्ड एवं नीति अपडेट्स'
                    : 'Carbon Programme — Latest Field & Policy Updates'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carbonUpdates.map((u) => (
                    <div
                      key={u.id}
                      className="rounded-2xl border border-[#DFCFAF] bg-[#FCF8F0] p-4 space-y-1.5"
                    >
                      <span className="text-[11px] font-bold text-[#5A7B3B]">
                        {u.categoryTag}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-[#153E1E]">
                        {lang === 'hi' && u.titleHi ? u.titleHi : u.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#384A3E] leading-relaxed">
                        {lang === 'hi' && u.summaryHi ? u.summaryHi : u.summaryEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 14 Transparent FAQs Accordion */}
          <div id="cc-faq-list" className="scroll-mt-32 space-y-6">
            <EditorialSectionHeading
              eyebrow={lang === 'hi' ? '11 · सभी शंकाओं का सीधा समाधान' : '11 · Frequently Asked Questions'}
              titleHi="अक्सर पूछे जाने वाले 14 महत्वपूर्ण प्रश्न (FAQs)"
              titleEn="14 Honest Questions & Clear Answers"
              lang={lang}
            />

            <div className="divide-y divide-[#DFCFAF]/85 border-y border-[#DFCFAF]/85">
              {CARBON_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q.en} className="py-1">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left py-4 px-2 flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold text-[#5A7B3B] tabular-nums shrink-0">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span
                          className={`text-sm sm:text-[15.5px] font-bold text-[#153E1E] group-hover:text-[#2F6D26] transition-colors ${
                            lang === 'hi' ? 'font-hindi' : ''
                          }`}
                        >
                          {faq.q[lang]}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#5A7B3B] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-4 pl-9 pr-4">
                        <p
                          className={`text-xs sm:text-sm text-[#35463A] leading-[1.72] max-w-[72ch] ${
                            lang === 'hi' ? 'font-hindi' : ''
                          }`}
                        >
                          {faq.a[lang]}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clean Climate Solution CTA Card — Transitions Into Single Global Footer (Zero Duplicate Horizon!) */}
        <div className="mt-10">
          <CarbonClimateSolutionCta
            lang={lang}
            onScrollToRegister={() => scrollToSection('cc-register')}
            onNavigate={onNavigate}
          />
        </div>
      </section>
    </div>
  );
}
