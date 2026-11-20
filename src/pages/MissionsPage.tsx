import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Sun,
  Recycle,
  HeartHandshake,
  ShieldCheck,
  Sprout,
  Flame,
  Building2,
} from 'lucide-react';
import { SpringButton, SpringCard } from '../components/SpringMotion';
import { RegistrationPortal } from '../components/RegistrationForms';
import {
  FloatingVignette,
  OpenSkyHorizon,
  MinimalistEditorialHeader,
  MissionAnchorNav,
  EditorialRealitiesGrid,
  CircularMedallionJourney,
  HonestSafeguardBox,
  MissionFaqAccordion,
} from '../components/MinimalistMissionPrimitives';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import { MISSIONS_DATA } from '../data/missionsData';
import { MISSION_RICH_CONTENT, resolveMissionSlug } from '../data/missionRichContent';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface MissionsPageProps {
  lang: Language;
  missionSlug?: string;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const MISSION_DETAIL_TABS = [
  { id: 'ms-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'ms-what', hi: 'क्या है यह मिशन', en: 'What Is It' },
  { id: 'ms-how', hi: 'कैसे काम करता है', en: 'How It Works' },
  { id: 'ms-model', hi: 'मुख्य मॉडल', en: 'Core Model' },
  { id: 'ms-role', hi: 'GOVEDA की भूमिका', en: 'Our Role' },
  { id: 'ms-modules', hi: 'सभी मॉड्यूल', en: 'Modules' },
  { id: 'ms-register', hi: 'पंजीकरण करें', en: 'Join Mission' },
  { id: 'ms-faqs', hi: 'FAQs', en: 'FAQs' },
] as const;

const DIRECTORY_VIGNETTE_BY_SLUG: Record<string, AssetKey> = {
  'carbon-credit': 'missionVignette01Carbon',
  'harit-rajasthan': 'missionVignette02Tree',
  'self-reliant-gaushala': 'missionVignette03Gaushala',
  'biogas-cbg': 'missionVignette04Biogas',
  'organic-farming': 'missionVignette05Organic',
  'clean-india-plastic-free': 'vignetteCleanClothbag',
  'skill-development': 'missionVignette08Skills',
  'women-empowerment': 'missionVignette10Women',
  'senior-citizen-care': 'missionVignette09Senior',
  'heritage-solar-water': 'vignetteHeritageKund',
};

function getMissionFormConfig(slug: string): {
  initialCategory: RegistrationCategory;
  allowedCategories: RegistrationCategory[];
} {
  switch (slug) {
    case 'self-reliant-gaushala':
      return {
        initialCategory: 'gaushala',
        allowedCategories: ['gaushala', 'farmer', 'csr-partner', 'expert-trainer'],
      };
    case 'biogas-cbg':
      return {
        initialCategory: 'gaushala',
        allowedCategories: ['gaushala', 'csr-partner', 'expert-trainer', 'farmer'],
      };
    case 'organic-farming':
      return {
        initialCategory: 'farmer',
        allowedCategories: ['farmer', 'expert-trainer', 'harit-mitra', 'gaushala'],
      };
    case 'clean-india-plastic-free':
      return {
        initialCategory: 'volunteer',
        allowedCategories: ['volunteer', 'school-college', 'women-shg', 'ngo-institution'],
      };
    case 'skill-development':
      return {
        initialCategory: 'skill-training',
        allowedCategories: ['skill-training', 'expert-trainer', 'school-college', 'volunteer'],
      };
    case 'women-empowerment':
      return {
        initialCategory: 'women-shg',
        allowedCategories: ['women-shg', 'skill-training', 'ngo-institution', 'volunteer'],
      };
    case 'senior-citizen-care':
      return {
        initialCategory: 'volunteer',
        allowedCategories: ['volunteer', 'expert-trainer', 'membership', 'csr-partner'],
      };
    case 'heritage-solar-water':
      return {
        initialCategory: 'harit-mitra',
        allowedCategories: ['harit-mitra', 'csr-partner', 'volunteer', 'ngo-institution'],
      };
    default:
      return {
        initialCategory: 'farmer',
        allowedCategories: ['farmer', 'harit-mitra', 'volunteer', 'csr-partner'],
      };
  }
}

export function MissionsPage({
  lang,
  missionSlug,
  records,
  onAddRecord,
  onNavigate,
}: MissionsPageProps) {
  const [activeTab, setActiveTab] = useState<string>('ms-why');
  const { bootstrap } = usePublicPortal();

  const resolvedSlug = resolveMissionSlug(missionSlug);
  const selected = resolvedSlug
    ? MISSIONS_DATA.find((m) => m.slug === resolvedSlug)
    : undefined;
  const rich = selected ? MISSION_RICH_CONTENT[selected.slug] : undefined;

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ==========================================================================
     INDIVIDUAL MISSION DETAIL EXPERIENCE (/missions/:slug — Missions 3 to 10)
     Built with pure Homepage Minimalist Watercolor Vignette & Sandstone DNA
     ========================================================================== */
  if (selected && rich) {
    const formConfig = getMissionFormConfig(selected.slug);
    const missionUpdates = (bootstrap?.contentItems ?? []).filter(
      (item) => item.status === 'Published' && item.relatedMissionSlug === selected.slug
    );

    return (
      <div className="bg-white text-[#153E1E]">
        {/* ====================================================================
            HERO — AIRY #FCF8F0 CANVAS + FLOATING MINIMALIST VIGNETTE + HORIZON
           ==================================================================== */}
        <section className="relative bg-[#FCF8F0] border-b border-[#DFCFAF]/75 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 relative z-10">
            <button
              type="button"
              onClick={() => onNavigate('/missions')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5A32] hover:underline mb-5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{lang === 'hi' ? 'सभी 10 मिशन देखें' : 'All 10 Missions'}</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs font-bold tracking-[0.16em] text-[#2F6D26]">
                  {lang === 'hi'
                    ? `मिशन ${String(selected.number).padStart(2, '0')} · GOVEDA राष्ट्रीय पहल`
                    : `Mission ${String(selected.number).padStart(2, '0')} · GOVEDA Foundation`}
                </p>

                <div>
                  <h1
                    className={`text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-[#153E1E] leading-[1.12] tracking-tight text-balance ${
                      lang === 'hi' ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {selected.title[lang]}
                  </h1>
                  <p className={`mt-2 text-base sm:text-lg font-bold text-[#1B5A32] ${lang === 'hi' ? '' : 'font-hindi'}`}>
                    {selected.tagline[lang]}
                  </p>
                  <svg viewBox="0 0 264 20" fill="none" aria-hidden="true" className="mt-2.5 w-44 sm:w-52 h-3.5">
                    <path d="M2 14 C72 3 168 1 258 10 C192 9 98 11 4 18 Z" fill="#82C341" />
                  </svg>
                </div>

                <p className={`text-sm sm:text-[15.5px] text-[#2A3A30] leading-[1.72] max-w-[64ch] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {selected.description[lang]}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('ms-register')}
                    className="spring-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#153E1E] text-white text-sm font-bold hover:bg-[#1E562A] cursor-pointer whitespace-nowrap"
                  >
                    <span>{lang === 'hi' ? 'इस मिशन से जुड़ें' : 'Join This Mission'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('ms-why')}
                    className="spring-btn inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#153E1E] border border-[#3E7B2E]/40 text-sm font-bold hover:border-[#6EB83A] cursor-pointer whitespace-nowrap"
                  >
                    <span>{lang === 'hi' ? 'सरल क्रम में समझें' : 'Read Step-by-Step'}</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <FloatingVignette
                  assetKey={rich.heroVignette}
                  alt={selected.title[lang]}
                  size="lg"
                />
              </div>
            </div>
          </div>

          <OpenSkyHorizon variant={rich.horizonTop} fadeFrom="cream" heightClass="h-24 sm:h-32 md:h-36" />
        </section>

        {/* STICKY ONE-PAGE ANCHOR TABS */}
        <MissionAnchorNav
          tabs={MISSION_DETAIL_TABS}
          activeTab={activeTab}
          onSelect={scrollToSection}
          lang={lang}
          ariaLabel={`${selected.title.en} Sections`}
        />

        {/* ====================================================================
            SECTION 1: WHY THIS MISSION MATTERS (4 VILLAGE REALITIES)
           ==================================================================== */}
        <section id="ms-why" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <MinimalistEditorialHeader
              eyebrow={lang === 'hi' ? rich.whyEyebrowHi : rich.whyEyebrowEn}
              titleHi={rich.whyTitleHi}
              titleEn={rich.whyTitleEn}
              leadHi={rich.whyLeadHi}
              leadEn={rich.whyLeadEn}
              lang={lang}
            />

            <EditorialRealitiesGrid items={rich.realities} lang={lang} />
          </div>
        </section>

        {/* ====================================================================
            SECTION 2: PLAIN-LANGUAGE EXPLAINER + FLOATING WATERCOLOR VIGNETTE
           ==================================================================== */}
        <section id="ms-what" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <MinimalistEditorialHeader
                eyebrow={lang === 'hi' ? '02 · सरल शब्दों में समझें' : '02 · Explained Simply'}
                titleHi={rich.whatTitleHi}
                titleEn={rich.whatTitleEn}
                lang={lang}
              />

              <div className="space-y-4">
                {rich.whatParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={`text-sm sm:text-[15.5px] text-[#2A3A30] leading-[1.78] max-w-[66ch] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {para[lang]}
                  </p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <FloatingVignette
                assetKey={rich.explainerVignette}
                alt={lang === 'hi' ? rich.whatTitleHi : rich.whatTitleEn}
                caption={lang === 'hi' ? rich.explainerCaptionHi : rich.explainerCaptionEn}
                size="lg"
              />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 3: STEP-BY-STEP VISUAL JOURNEY (CIRCULAR MEDALLIONS)
           ==================================================================== */}
        <section id="ms-how" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-11">
            <MinimalistEditorialHeader
              eyebrow={lang === 'hi' ? '03 · चरण-दर-चरण प्रक्रिया' : '03 · Step-by-Step Process'}
              titleHi={rich.howTitleHi}
              titleEn={rich.howTitleEn}
              leadHi={rich.howLeadHi}
              leadEn={rich.howLeadEn}
              lang={lang}
              align="center"
            />

            <CircularMedallionJourney steps={rich.steps} lang={lang} />
          </div>
        </section>

        {/* ====================================================================
            SECTION 4: MISSION-SPECIFIC PRACTICAL DOMAIN SHOWCASE
           ==================================================================== */}
        <section id="ms-model" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Mission 03: 10-Activity Self-Reliant Gaushala Circular Model */}
            {selected.slug === 'self-reliant-gaushala' && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · 10-गतिविधि स्वावलंबन मॉडल' : '04 · 10-Activity Circular Model'}
                  titleHi="आत्मनिर्भर गौशाला के 10 व्यावहारिक स्तंभ"
                  titleEn="10 Practical Pillars of a Self-Reliant Gaushala"
                  lang={lang}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
                  {[
                    { n: '01', hi: 'गोबर से खाद', en: 'Dung Compost', dHi: 'कम्पोस्ट, वर्मीकम्पोस्ट और गुणवत्ता नियंत्रण', dEn: 'Vermicompost & organic soil manure' },
                    { n: '02', hi: 'जीवामृत इकाई', en: 'Jeevamrit Unit', dHi: 'सरल निर्माण विधि व खेत उपयोग', dEn: 'Preparation & safe field application' },
                    { n: '03', hi: 'बायोगैस ऊर्जा', en: 'Biogas Energy', dHi: 'गौशाला रसोई ऊर्जा व पोषक जैव-स्लरी', dEn: 'Clean cooking fuel & organic slurry' },
                    { n: '04', hi: 'CBG व्यवहार्यता', en: 'CBG Feasibility', dHi: 'प्रस्तावित क्लस्टर एवं शुद्धिकरण अध्ययन', dEn: 'Cluster feasibility & purification norms' },
                    { n: '05', hi: 'जैव-इनपुट मानक', en: 'Bio-Inputs', dHi: 'सुरक्षित उपयोग व नियामकीय अनुपालन', dEn: 'Quality & regulatory compliance' },
                    { n: '06', hi: 'स्थानीय नर्सरी', en: 'Native Nursery', dHi: 'देशी पौध तैयारी व संरक्षण', dEn: 'Native sapling cultivation' },
                    { n: '07', hi: 'हरा चारा विकास', en: 'Fodder Plot', dHi: 'पौष्टिक हरा चारा व पशु पोषण', dEn: 'Local green fodder security' },
                    { n: '08', hi: 'पशु चिकित्सा', en: 'Veterinary Care', dHi: 'नियमित टीकाकरण व रोकथाम', dEn: 'Vaccination & disease prevention' },
                    { n: '09', hi: 'गौसेवक प्रशिक्षण', en: 'Training', dHi: 'प्रबंधक व गौसेवक कौशल विकास', dEn: 'Manager & caretaker capacity building' },
                    { n: '10', hi: 'गोकाष्ठ व उत्पाद', en: 'Gokashth Goods', dHi: 'पर्यावरण-अनुकूल गोकाष्ठ व स्वीकृत उत्पाद', dEn: 'Eco-friendly dung logs & certified goods' },
                  ].map((cell) => (
                    <div key={cell.n} className="bg-white rounded-2xl border border-[#DFCFAF] p-4 space-y-1.5">
                      <span className="text-[11px] font-bold text-[#5A7B3B] tabular-nums">{cell.n}</span>
                      <p className="font-bold text-[#153E1E] text-sm font-hindi">{lang === 'hi' ? cell.hi : cell.en}</p>
                      <p className="text-[#445649] leading-relaxed">{lang === 'hi' ? cell.dHi : cell.dEn}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Mission 04: Biogas vs CBG Side-by-Side Clarity */}
            {selected.slug === 'biogas-cbg' && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · तकनीकी स्पष्टता' : '04 · Clear Technical Comparison'}
                  titleHi="घरेलू/गौशाला बायोगैस बनाम वाहन-योग्य CBG"
                  titleEn="Household Biogas vs. Industrial Vehicle-Grade CBG"
                  lang={lang}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-white border border-[#DFCFAF] p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2F6D26]">
                      <Flame className="w-4 h-4" aria-hidden="true" />
                      <span>{lang === 'hi' ? 'घरेलू व गौशाला स्तर' : 'Household & Gaushala Scale'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#153E1E] font-hindi">
                      {lang === 'hi' ? 'कच्ची बायोगैस (Raw Biogas)' : 'Raw Biogas (Low Pressure)'}
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#35463A]">
                      <li>• {lang === 'hi' ? 'लगभग 55–60% मीथेन, कम दबाव पाइपलाइन' : '~55–60% methane flowing through safe low-pressure pipe'}</li>
                      <li>• {lang === 'hi' ? 'विशेष बायोगैस बर्नर पर धुआँ-रहित रसोई उपयोग' : 'Smokeless cooking on dedicated biogas cookstoves'}</li>
                      <li>• {lang === 'hi' ? '2–4 पशुओं वाले परिवार या किसी भी गौशाला में सरल संचालन' : 'Practical for 2–4 cattle families and rural Gaushalas'}</li>
                      <li>• {lang === 'hi' ? 'साथ में तुरंत खेतों के लिए पोषक जैव-स्लरी खाद' : 'Outputs fertile bio-slurry daily for nearby crops'}</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-white border border-[#DFCFAF] p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#9A580B]">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                      <span>{lang === 'hi' ? 'प्रस्तावित क्लस्टर व औद्योगिक स्तर' : 'Proposed Cluster / Industrial Scale'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#153E1E] font-hindi">
                      {lang === 'hi' ? 'कंप्रेस्ड बायोगैस (Bio-CNG / CBG)' : 'Compressed Biogas (Bio-CNG / CBG)'}
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#35463A]">
                      <li>• {lang === 'hi' ? 'CO₂ व H₂S शुद्धिकरण के बाद 90%+ शुद्ध मीथेन' : '>90% pure methane after industrial CO₂ & H₂S scrubbing'}</li>
                      <li>• {lang === 'hi' ? 'केवल प्रमाणित उच्च-दबाव संयंत्र व PESO मानक सिलेंडर' : 'Requires certified high-pressure compressors & PESO cylinders'}</li>
                      <li>• {lang === 'hi' ? 'प्रतिदिन कई टन गोबर व जैव-अवशेष क्लस्टर की आवश्यकता' : 'Needs multi-tonne daily feedstock across clusters'}</li>
                      <li>• {lang === 'hi' ? 'वर्तमान स्थिति: जिला व्यवहार्यता एवं प्रस्ताव चरण' : 'Current status: District feasibility & proposal stage only'}</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {/* Mission 05: Soil & Water Science Parameters */}
            {selected.slug === 'organic-farming' && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · वैज्ञानिक खेती के 4 आधार' : '04 · 4 Scientific Farm Diagnostics'}
                  titleHi="खेत बदलने से पहले इन 4 चीज़ों को समझें"
                  titleEn="Four Essential Diagnostics Before Changing Farm Inputs"
                  lang={lang}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Sprout, hi: 'मिट्टी pH व जैविक कार्बन', en: 'Soil pH & Organic Carbon', dHi: 'खेत की अम्लीयता/क्षारीयता और जीवित ह्यूमस का सटीक स्तर जानना।', dEn: 'Measures topsoil alkalinity and living humus levels.' },
                    { icon: Droplets, hi: 'सिंचाई पानी लवणता (EC)', en: 'Irrigation Water EC', dHi: 'बोरवेल का पानी कितना खारा है—ताकि सही फसल व जिप्सम/खाद तय हो।', dEn: 'Identifies borewell salt load to prevent soil crusting.' },
                    { icon: Sun, hi: 'ड्रिप व मल्चिंग नमी', en: 'Drip & Straw Mulching', dHi: 'सीधे जड़ों में बूंद-बूंद पानी और मिट्टी को धूप से ढककर नमी बचाना।', dEn: 'Cuts desert evaporation and lowers pumping electricity.' },
                    { icon: ShieldCheck, hi: '2–3 वर्ष चरणबद्ध बदलाव', en: '2–3 Year Phased Shift', dHi: 'अचानक रसायन बंद न कर पहले 25% क्षेत्र में सुरक्षित प्रयोग।', dEn: 'Protects family harvest while living soil recovers.' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.en} className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2">
                        <Icon className="w-5 h-5 text-[#1B5A32]" aria-hidden="true" />
                        <h3 className="text-sm sm:text-base font-bold text-[#153E1E] font-hindi">
                          {lang === 'hi' ? item.hi : item.en}
                        </h3>
                        <p className="text-xs text-[#445649] leading-relaxed">
                          {lang === 'hi' ? item.dHi : item.dEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Mission 06: 3-Bin Segregation & Clean Village Matrix */}
            {selected.slug === 'clean-india-plastic-free' && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · सरल कचरा पृथक्करण' : '04 · Simple Household Segregation'}
                  titleHi="गाँव व घर में 3 आसान श्रेणियाँ — कचरा बने संसाधन"
                  titleEn="Three Clear Waste Streams That Protect Soil & Cattle"
                  lang={lang}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { color: 'text-[#2F6D26]', hi: 'गीला / जैविक कचरा (हरा)', en: 'Wet Organic Waste (Green)', dHi: 'सब्जी के छिलके, बचा भोजन, मंदिर के फूल और सूखे पत्ते → 45–60 दिनों में कम्पोस्ट खाद।', dEn: 'Kitchen scraps, temple flowers, and leaves → clean pit compost in 45–60 days.' },
                    { color: 'text-[#1E56A0]', hi: 'सूखा पुनर्चक्रण योग्य (नीला)', en: 'Dry Recyclables (Blue)', dHi: 'कागज़, गत्ता, साफ प्लास्टिक बोतलें व धातु → अलग रखकर अधिकृत रीसाइक्लिंग संग्रहण को दें।', dEn: 'Paper, cardboard, clean bottles, and metal → sorted cleanly for local recycling.' },
                    { color: 'text-[#9A3412]', hi: 'घरेलू खतरनाक (सावधानी)', en: 'Domestic Hazardous (Care)', dHi: 'बैटरी, टूटा काँच, एक्सपायर्ड दवाइयाँ → कभी खुले में या खेतों में न फेंकें, सुरक्षित अलग रखें।', dEn: 'Batteries, broken glass, expired medicines → kept strictly out of drains and grazing paths.' },
                  ].map((bin) => (
                    <div key={bin.en} className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2">
                      <Recycle className={`w-5 h-5 ${bin.color}`} aria-hidden="true" />
                      <h3 className={`text-base font-bold ${bin.color} font-hindi`}>
                        {lang === 'hi' ? bin.hi : bin.en}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#35463A] leading-relaxed">
                        {lang === 'hi' ? bin.dHi : bin.dEn}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Mission 07: Full 4-Course Training Catalog */}
            {selected.courses && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · संरचित प्रशिक्षण पाठ्यक्रम' : '04 · Structured Course Catalog'}
                  titleHi="युवाओं के लिए 4 प्रमुख प्रशिक्षण धाराएँ"
                  titleEn="4 Practical Skill & Language Training Tracks"
                  lang={lang}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selected.courses.map((course) => (
                    <div
                      key={course.name.en}
                      className="rounded-2xl border border-[#DFCFAF] bg-white p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#153E1E] font-hindi">
                          {course.name[lang]}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#3C4F42] leading-relaxed">
                          {course.description[lang]}
                        </p>
                        <dl className="grid grid-cols-2 gap-3 pt-2 border-t border-[#DFCFAF]/70 text-xs">
                          <div>
                            <dt className="text-[#5B6B60]">{lang === 'hi' ? 'पात्रता' : 'Eligibility'}</dt>
                            <dd className="font-bold text-[#153E1E] mt-0.5">{course.eligibility[lang]}</dd>
                          </div>
                          <div>
                            <dt className="text-[#5B6B60]">{lang === 'hi' ? 'अवधि' : 'Duration'}</dt>
                            <dd className="font-bold text-[#153E1E] mt-0.5">{course.duration[lang]}</dd>
                          </div>
                          <div>
                            <dt className="text-[#5B6B60]">{lang === 'hi' ? 'माध्यम' : 'Mode'}</dt>
                            <dd className="font-bold text-[#153E1E] mt-0.5">{course.mode[lang]}</dd>
                          </div>
                          <div>
                            <dt className="text-[#5B6B60]">{lang === 'hi' ? 'शुल्क स्थिति' : 'Fee Status'}</dt>
                            <dd className="font-bold text-[#2F6D26] mt-0.5">{course.feeStatus[lang]}</dd>
                          </div>
                        </dl>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToSection('ms-register')}
                        className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FCF8F0] border border-[#DFCFAF] text-xs font-bold text-[#153E1E] hover:border-[#6EB83A] cursor-pointer"
                      >
                        <span>{lang === 'hi' ? 'इस कोर्स के लिए पंजीकरण करें' : 'Register for This Track'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Mission 08: Women Empowerment 4 Integrated Pillars */}
            {selected.slug === 'women-empowerment' && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · महिला सशक्तिकरण के 4 क्षेत्र' : '04 · 4 Integrated Empowerment Tracks'}
                  titleHi="आजीविका, डिजिटल सुरक्षा, स्वास्थ्य व नेतृत्व का समन्वित मॉडल"
                  titleEn="Livelihood, Safe Finance, Dignified Health & Village Leadership"
                  lang={lang}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { hi: 'SHG कपड़े के थैले व शिल्प', en: 'SHG Cloth Bags & Craft', dHi: 'प्लास्टिक-मुक्त गाँवों हेतु टिकाऊ सूती थैले और स्थानीय घरेलू उत्पादों का निर्माण।', dEn: 'Stitching durable cotton bags and value-added local goods.' },
                    { hi: 'वित्तीय व सुरक्षित UPI ज्ञान', en: 'Safe Banking & UPI', dHi: 'बचत डायरी, लागत-गणना और ऑनलाइन ठगी से सुरक्षित डिजिटल लेनदेन।', dEn: 'Bookkeeping, fair pricing, and scam-safe UPI transactions.' },
                    { hi: 'डॉक्टर-समीक्षित स्वास्थ्य संवाद', en: 'Doctor-Reviewed Hygiene', dHi: 'पूर्ण गोपनीयता के साथ मासिक धर्म स्वच्छता, आयरन पोषण व स्वास्थ्य जागरूकता।', dEn: 'Private, medically reviewed menstrual hygiene and nutrition guidance.' },
                    { hi: 'हरित ग्राम महिला नेतृत्व', en: 'Women Eco-Leadership', dHi: 'गाँव की नर्सरी, जल संचयन और वृक्ष संरक्षण समितियों में सक्रिय भूमिका।', dEn: 'Co-leading village nurseries, water care, and tree stewardship.' },
                  ].map((p, i) => (
                    <div key={p.en} className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2">
                      <span className="text-xs font-bold text-[#5A7B3B] tabular-nums">0{i + 1}</span>
                      <h3 className="text-sm sm:text-base font-bold text-[#153E1E] font-hindi">
                        {lang === 'hi' ? p.hi : p.en}
                      </h3>
                      <p className="text-xs text-[#445649] leading-relaxed">
                        {lang === 'hi' ? p.dHi : p.dEn}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Mission 09: Senior Citizen Care & Mental Well-being Rhythm */}
            {selected.slug === 'senior-citizen-care' && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · वरिष्ठजन एवं मानसिक कल्याण रूपरेखा' : '04 · Holistic Care & Wellness Framework'}
                  titleHi="सेवा, योग, संवाद और प्रस्तावित हरित आश्रम दृष्टि"
                  titleEn="Service, Gentle Yoga, Youth Dialogue & Proposed Green Ashram"
                  lang={lang}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { hi: 'प्रातःकालीन योग व प्राणायाम', en: 'Morning Yoga & Breathwork', dHi: 'वरिष्ठजनों के शरीर के अनुकूल हल्का योगाभ्यास व शांत ध्यान।', dEn: 'Gentle age-adapted stretching, breathing, and calm meditation.' },
                    { hi: 'निवारक स्वास्थ्य शिविर', en: 'Preventive Health Camps', dHi: 'नेत्र, बीपी, शुगर और पोषण जागरूकता हेतु स्थानीय चिकित्सक समन्वय।', dEn: 'Periodic vision, blood-pressure, and nutrition awareness camps.' },
                    { hi: 'मानसिक स्वास्थ्य संवाद', en: 'Open Mental Wellness Talks', dHi: 'अकेलेपन व तनाव पर संवेदनशील चर्चा और सही चिकित्सकीय मार्गदर्शन।', dEn: 'Stigma-free emotional support and referral to qualified clinicians.' },
                    { hi: 'प्रस्तावित हरित वृद्धाश्रम', en: 'Proposed Green Ashram', dHi: 'पेड़ों, बगीचे और परिवार-सम आत्मीयता वाले प्रस्तावित सेवा केंद्र की संकल्पना।', dEn: 'Proposed nature-integrated senior sanctuary concept for future phases.' },
                  ].map((c, idx) => (
                    <div key={c.en} className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2">
                      <HeartHandshake className="w-5 h-5 text-[#1B5A32]" aria-hidden="true" />
                      <h3 className="text-sm sm:text-base font-bold text-[#153E1E] font-hindi">
                        {String(idx + 1).padStart(2, '0')}. {lang === 'hi' ? c.hi : c.en}
                      </h3>
                      <p className="text-xs text-[#445649] leading-relaxed">
                        {lang === 'hi' ? c.dHi : c.dEn}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Mission 10: Heritage + Solar + Kund + Terrace 4-Layer Architecture */}
            {selected.slug === 'heritage-solar-water' && (
              <>
                <MinimalistEditorialHeader
                  eyebrow={lang === 'hi' ? '04 · 4-स्तरीय हरित विरासत मॉडल' : '04 · 4-Layer Sustainable Heritage Architecture'}
                  titleHi="छत से कुंड तक — ऐतिहासिक भवनों का आधुनिक हरित कायाकल्प"
                  titleEn="From Rooftop Sun to Underground Kund — 4 Conservation Layers"
                  lang={lang}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: Building2, hi: 'हवेली व धर्मशाला संरक्षण', en: 'Haveli & Dharamshala Care', dHi: 'शेखावाटी व राजस्थान की ऐतिहासिक वास्तुकला व भित्तिचित्रों का सम्मानजनक संरक्षण।', dEn: 'Respecting original stonework, frescoes, and architectural lines.' },
                    { icon: Sun, hi: 'संवेदनशील रूफटॉप सोलर', en: 'Low-Impact Rooftop Solar', dHi: 'मुंडेर के भीतर कम कोण के सोलर पैनल से बिजली बचत—बिना सौंदर्य बिगाड़े।', dEn: 'Discreet parapet-screened solar lowering operational energy bills.' },
                    { icon: Droplets, hi: 'वर्षा जल → पारंपरिक कुंड', en: 'Rainwater to Historic Kund', dHi: 'फिल्टर चैंबर द्वारा छत का मीठा वर्षा जल सीधे भूमिगत कुंड व टांकों में।', dEn: 'Filtered monsoon roof runoff recharging cleaned traditional kunds.' },
                    { icon: Sprout, hi: 'टेरेस जैविक उद्यान', en: 'Cooling Terrace Gardens', dHi: 'स्टैंड पर हल्के गमलों में तुलसी व औषधीय पौधे जो भवन को ठंडा रखें।', dEn: 'Raised dry-safe planters providing natural thermal cooling.' },
                  ].map((layer) => {
                    const Icon = layer.icon;
                    return (
                      <div key={layer.en} className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2">
                        <Icon className="w-5 h-5 text-[#1B5A32]" aria-hidden="true" />
                        <h3 className="text-sm sm:text-base font-bold text-[#153E1E] font-hindi">
                          {lang === 'hi' ? layer.hi : layer.en}
                        </h3>
                        <p className="text-xs text-[#445649] leading-relaxed">
                          {lang === 'hi' ? layer.dHi : layer.dEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ====================================================================
            SECTION 5: WHERE GOVEDA HELPS + HONEST SAFEGUARD DISCLOSURE
           ==================================================================== */}
        <section id="ms-role" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <MinimalistEditorialHeader
              eyebrow={lang === 'hi' ? '05 · GOVEDA की पारदर्शी भूमिका' : '05 · Where GOVEDA Comes Into Play'}
              titleHi={rich.roleTitleHi}
              titleEn={rich.roleTitleEn}
              leadHi={rich.roleLeadHi}
              leadEn={rich.roleLeadEn}
              lang={lang}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rich.rolePillars.map((pillar) => (
                <div key={pillar.num} className="pt-5 border-t border-[#DFCFAF] space-y-2">
                  <span className="text-xs font-bold text-[#5A7B3B] tabular-nums">{pillar.num}</span>
                  <h3 className={`text-base font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? pillar.titleHi : pillar.titleEn}
                  </h3>
                  <p className={`text-xs sm:text-[13.5px] text-[#35463A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? pillar.descHi : pillar.descEn}
                  </p>
                </div>
              ))}
            </div>

            <HonestSafeguardBox
              lang={lang}
              titleHi={rich.safeguardTitleHi}
              titleEn={rich.safeguardTitleEn}
              points={rich.safeguardPoints}
            />
          </div>
        </section>

        {/* ====================================================================
            SECTION 6: ALL MISSION MODULES IN CLEAR SEQUENCE (ZERO HIDDEN TEXT)
           ==================================================================== */}
        <section id="ms-modules" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <MinimalistEditorialHeader
              eyebrow={lang === 'hi' ? '06 · संपूर्ण कार्यक्षेत्र मॉड्यूल' : '06 · Complete Module Directory'}
              titleHi="इस मिशन के सभी कार्यक्षेत्र और उप-अध्याय"
              titleEn="All Modules & Activity Tracks Under This Mission"
              lang={lang}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selected.subpages.map((sub) => (
                <div
                  key={sub.code}
                  className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#5A7B3B]">
                    <span>{lang === 'hi' ? `मॉड्यूल ${sub.code}` : `Module ${sub.code}`}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#6EB83A]" aria-hidden="true" />
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {sub.title[lang]}
                  </h3>
                  <p className={`text-xs text-[#3F5145] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {sub.summary[lang]}
                  </p>
                </div>
              ))}
            </div>

            {/* Live Admin-Published Mission Updates, Videos & PDFs */}
            {missionUpdates.length > 0 && (
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-bold text-[#153E1E] font-hindi">
                  {lang === 'hi'
                    ? 'अद्यतन कार्यक्रम, प्रशिक्षण एवं संसाधन'
                    : 'Latest Mission Updates, Media & Resources'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {missionUpdates.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#DFCFAF] bg-white p-5 space-y-3"
                    >
                      {item.videoUrl && (
                        <video controls src={item.videoUrl} className="w-full rounded-xl max-h-52 bg-black" />
                      )}
                      {!item.videoUrl && item.mediaUrl && (
                        <img
                          src={item.mediaUrl}
                          alt={item.titleEn}
                          referrerPolicy="no-referrer"
                          className="w-full h-44 object-cover rounded-xl"
                        />
                      )}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#5A7B3B]">{item.categoryTag}</span>
                        <h4 className="text-base font-bold text-[#153E1E]">
                          {lang === 'hi' && item.titleHi ? item.titleHi : item.titleEn}
                        </h4>
                        <p className="text-xs text-[#445649] leading-relaxed">
                          {lang === 'hi' && item.summaryHi ? item.summaryHi : item.summaryEn}
                        </p>
                      </div>
                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl}
                          download
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#153E1E] hover:underline"
                        >
                          <span>{lang === 'hi' ? 'संबंधित PDF डाउनलोड करें →' : 'Download Attached PDF →'}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================================
            SECTION 7: DEDICATED MISSION REGISTRATION FORM
           ==================================================================== */}
        <section id="ms-register" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <MinimalistEditorialHeader
              eyebrow={lang === 'hi' ? '07 · मिशन पंजीकरण' : '07 · Dedicated Registration'}
              titleHi={`${selected.title.hi} — पंजीकरण एवं सहभागिता`}
              titleEn={`${selected.title.en} — Register Your Participation`}
              leadHi="इस मिशन से जुड़ने, अपने गाँव/संस्थान को पंजीकृत करने या प्रशिक्षण अनुरोध भेजने के लिए नीचे समर्पित विवरण भरें।"
              leadEn="Complete the mission-specific form below to join, nominate your village or institution, or request local orientation."
              lang={lang}
            />

            <div className="rounded-3xl bg-[#FCF8F0]/65 border border-[#DFCFAF] p-4 sm:p-6">
              <RegistrationPortal
                lang={lang}
                records={records}
                onAddRecord={onAddRecord}
                initialCategory={formConfig.initialCategory}
                allowedCategories={formConfig.allowedCategories}
                onSelectCategoryRoute={(cat) => onNavigate(`/join/${cat}`)}
              />
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION 8: PRACTICAL MISSION FAQs + SEAMLESS OPEN-SKY HORIZON
           ==================================================================== */}
        <section id="ms-faqs" className="scroll-mt-32 bg-[#FCF8F0] pt-14 sm:pt-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <MinimalistEditorialHeader
              eyebrow={lang === 'hi' ? '08 · सामान्य प्रश्न (FAQs)' : '08 · Frequently Asked Questions'}
              titleHi="इस मिशन से जुड़े महत्वपूर्ण प्रश्न और सीधे उत्तर"
              titleEn="Common Questions Answered Honestly"
              lang={lang}
            />

            <MissionFaqAccordion faqs={rich.faqs} lang={lang} />

            {/* Next / All Missions Exploration Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/missions')}>
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{lang === 'hi' ? 'सभी 10 मिशन देखें' : 'View All 10 Missions'}</span>
              </SpringButton>
              {(() => {
                const nextNum = selected.number === 10 ? 1 : selected.number + 1;
                const nextMission = MISSIONS_DATA.find((m) => m.number === nextNum);
                if (!nextMission) return null;
                return (
                  <SpringButton
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate(`/missions/${nextMission.slug}`)}
                    className="!bg-[#153E1E]"
                  >
                    <span>
                      {lang === 'hi'
                        ? `अगला मिशन ${String(nextMission.number).padStart(2, '0')}: ${nextMission.title.hi}`
                        : `Next Mission ${String(nextMission.number).padStart(2, '0')}: ${nextMission.title.en}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </SpringButton>
                );
              })()}
            </div>
          </div>

          <div className="mt-10">
            <OpenSkyHorizon variant={rich.horizonBottom} fadeFrom="cream" heightClass="h-24 sm:h-36 md:h-44" />
          </div>
        </section>
      </div>
    );
  }

  /* ==========================================================================
     ALL 10 MISSIONS DIRECTORY (/missions) — MINIMALIST VIGNETTE GALLERY
     ========================================================================== */
  return (
    <div className="bg-white text-[#153E1E]">
      <section className="relative bg-[#FCF8F0] border-b border-[#DFCFAF]/75 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 relative z-10">
          <MinimalistEditorialHeader
            eyebrow={lang === 'hi' ? 'GOVEDA कार्यक्षेत्र · 10 मिशन' : 'GOVEDA Foundation · 10 Missions'}
            titleHi="हमारे 10 प्रमुख मिशन — प्रकृति, गाँव और भविष्य का साझा संकल्प"
            titleEn="Our 10 Major Missions — Climate, Villages & Heritage"
            leadHi="कार्बन क्रेडिट जागरूकता और हरित राजस्थान से लेकर आत्मनिर्भर गौशाला, स्वच्छ बायोगैस, जैविक खेती, प्लास्टिक-मुक्त गाँव, युवा कौशल, महिला सशक्तिकरण, वरिष्ठजन सेवा और विरासत-जल संरक्षण तक—प्रत्येक मिशन को सरल क्रम और चित्रों में जानें।"
            leadEn="From Carbon Credit literacy and Harit Rajasthan to self-reliant Gaushalas, clean biogas, organic farming, plastic-free villages, youth skills, women empowerment, senior well-being, and heritage water conservation—explore each mission step by step."
            lang={lang}
          />
        </div>
        <OpenSkyHorizon variant="sandstone" fadeFrom="cream" heightClass="h-24 sm:h-32 md:h-40" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MISSIONS_DATA.map((mission) => {
            const vignetteKey = DIRECTORY_VIGNETTE_BY_SLUG[mission.slug] ?? 'missionVignette02Tree';
            return (
              <SpringCard
                key={mission.id}
                asButton
                onClick={() => onNavigate(`/missions/${mission.slug}`)}
                className="bg-[#FCF8F0]/70 rounded-3xl border border-[#DFCFAF] overflow-hidden grid grid-cols-1 sm:grid-cols-12 hover:border-[#6EB83A] transition-colors"
              >
                <div className="sm:col-span-4 bg-[#FCF8F0] p-4 flex items-center justify-center">
                  <img
                    src={GENERATED_ASSETS[vignetteKey]}
                    alt={mission.title[lang]}
                    referrerPolicy="no-referrer"
                    className="w-32 h-32 sm:w-full sm:h-36 object-contain mix-blend-multiply brightness-[1.04] contrast-[1.05]"
                  />
                </div>
                <div className="sm:col-span-8 p-5 sm:p-6 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5A7B3B] font-bold mb-1.5">
                      <span className="tabular-nums">
                        {lang === 'hi'
                          ? `मिशन ${String(mission.number).padStart(2, '0')}`
                          : `Mission ${String(mission.number).padStart(2, '0')}`}
                      </span>
                      <span className="text-[11px] font-medium text-[#5B6B60] tabular-nums">
                        {mission.subpages.length} {lang === 'hi' ? 'मॉड्यूल' : 'modules'}
                      </span>
                    </div>
                    <h2 className={`text-lg font-bold text-[#153E1E] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                      {mission.title[lang]}
                    </h2>
                    <p className={`text-xs text-[#3F5145] mt-1.5 leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                      {mission.description[lang]}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#DFCFAF]/70 inline-flex items-center gap-1.5 text-xs font-bold text-[#153E1E]">
                    <span>{lang === 'hi' ? 'पूरा सचित्र विवरण व पंजीकरण देखें' : 'Read Illustrated Guide & Join'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>
              </SpringCard>
            );
          })}
        </div>
      </div>

      <OpenSkyHorizon variant="fort" fadeFrom="white" heightClass="h-24 sm:h-36" />
    </div>
  );
}
