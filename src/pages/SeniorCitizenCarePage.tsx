import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  HeartHandshake,
  Building2,
  Stethoscope,
  PhoneCall,
} from 'lucide-react';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { RegistrationPortal } from '../components/RegistrationForms';
import {
  ElderlyCareHero,
  ElderlyWhyMatters,
  ElderlyHolisticModel,
  ElderlyDignifiedCareAndFood,
  ElderlyExperienceTrio,
  ElderlyDailyRoutine,
  ElderlyCommunityAndInterconnections,
  ElderlyProposedVisionBanner,
} from '../components/ElderlyCareSections';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface SeniorCitizenCarePageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'ec-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'ec-model', hi: 'समग्र मॉडल', en: 'Holistic Model' },
  { id: 'ec-care', hi: 'आवास व भोजन', en: 'Living & Food' },
  { id: 'ec-wellness', hi: 'गौसेवा, प्रकृति व योग', en: 'Gauseva & Yoga' },
  { id: 'ec-routine', hi: 'दैनिक दिनचर्या', en: 'Daily Routine' },
  { id: 'ec-interconnections', hi: 'अन्य मिशनों से जुड़ाव', en: 'Mission Links' },
  { id: 'ec-vision', hi: 'प्रस्तावित विज़न', en: 'Proposed Vision' },
  { id: 'ec-join', hi: 'जुड़ें व सहयोग करें', en: 'Collaborate' },
  { id: 'ec-faqs', hi: 'सामान्य प्रश्न', en: 'FAQs' },
] as const;

const ELDERLY_FAQS = [
  {
    qHi: 'क्या GOVEDA के वृद्धजन देखभाल केंद्र वर्तमान में संचालित हो रहे हैं?',
    qEn: 'Are GOVEDA Senior Citizen Care centres operational right now?',
    aHi: 'नहीं। यह वर्तमान में एक दीर्घकालीन प्रस्तावित राष्ट्रीय विज़न और योजना अध्ययन है। वास्तविक केंद्र स्थापित होने, प्रशिक्षित स्टाफ नियुक्त होने और आवश्यक वैधानिक लाइसेंस प्राप्त होने के बाद ही उन्हें सक्रिय संचालित केंद्र के रूप में प्रदर्शित किया जाएगा।',
    aEn: 'No. This is currently a long-term proposed national vision and feasibility study. Centres will only be presented as operational once physically established, staffed with trained caregivers, and granted statutory licensing.',
  },
  {
    qHi: 'क्या वृद्धजनों के लिए गौसेवा या जैविक बागवानी करना अनिवार्य होगा?',
    qEn: 'Will Gauseva or organic gardening be mandatory for senior residents?',
    aHi: 'बिल्कुल नहीं। गौसेवा, चारा-पानी देना या हल्की बागवानी 100% स्वैच्छिक और केवल इच्छानुसार व स्वास्थ्य के अनुकूल होगी। किसी भी वरिष्ठ नागरिक पर काम या श्रम करने का कोई दबाव नहीं होगा।',
    aEn: 'Never. Gauseva, feeding green fodder, and light gardening are 100% optional and strictly guided by each resident’s own wish and health comfort. There is zero mandatory work or labor.',
  },
  {
    qHi: 'गौशाला से जुड़े सात्विक भोजन की क्या व्यवस्था प्रस्तावित है?',
    qEn: 'How is Gaushala-linked sattvic food envisioned in this model?',
    aHi: 'प्रस्तावित मॉडल में नजदीकी गौशाला और स्थानीय जैविक रसोई बाग से गुणवत्ता-जाँचा शुद्ध दूध, दही, छाछ, लस्सी, पनीर और ताज़ी मौसमी सब्ज़ियाँ शामिल करने की परिकल्पना है—जिन्हें प्रत्येक व्यक्ति के स्वास्थ्य व चिकित्सकीय सलाह के अनुसार ही परोसा जाएगा। किसी विशेष चिकित्सीय इलाज का दावा नहीं किया जाता।',
    aEn: 'The proposed model links with partner Gaushalas and campus kitchen gardens for quality-tested milk, curd, buttermilk, lassi, paneer, and seasonal organic vegetables—always tailored to individual health and doctor advice, with no clinical cure claims.',
  },
  {
    qHi: 'योग, ध्यान और मानसिक स्वास्थ्य सहायता किस प्रकार दी जाएगी?',
    qEn: 'How will yoga, meditation, and mental health support be provided?',
    aHi: 'सुबह-शाम शांत ध्यान, प्रशिक्षित मार्गदर्शक के साथ हल्का योग, चेयर योग, सुरक्षित श्वसन अभ्यास, स्वैच्छिक सत्संग, संगीत, पुस्तकालय व इनडोर खेल (कैरम, शतरंज) प्रस्तावित हैं। मानसिक स्वास्थ्य परामर्श के लिए योग्य चिकित्सकों व मनोवैज्ञानिकों का सहयोग लिया जाएगा, और गंभीर स्थितियों की देखभाल केवल प्रशिक्षित स्टाफ व आवश्यक लाइसेंस के अंतर्गत ही होगी।',
    aEn: 'Morning/evening meditation, guided gentle & chair yoga, safe breathing, voluntary satsang, music, library, and indoor games (carrom, chess) are planned. Counseling involves qualified doctors and psychologists, and serious mental-health conditions will only be handled with trained staff and proper statutory licensing.',
  },
  {
    qHi: 'क्या इस वेबसाइट पर ऑनलाइन एडमिशन या मेडिकल रिकॉर्ड पोर्टल उपलब्ध है?',
    qEn: 'Does this Phase-1 website include an online admission or medical record portal?',
    aHi: 'नहीं। वर्तमान चरण-1 पोर्टल में केवल जानकारी, विज़न और सहयोग/पूछताछ पंजीकरण शामिल है। वृद्धाश्रम प्रबंधन सॉफ्टवेयर, मेडिकल रिकॉर्ड प्रणाली और प्रवेश पोर्टल आवश्यकतानुसार चरण-2 में विकसित किए जाएँगे।',
    aEn: 'No. Phase-1 intentionally focuses on transparent information, mission vision, and collaboration inquiries. Management software, medical record systems, and admission portals are deferred to Phase-2.',
  },
  {
    qHi: 'चिकित्सक, योग प्रशिक्षक, स्वयंसेवक या CSR साझेदार कैसे जुड़ सकते हैं?',
    qEn: 'How can doctors, yoga trainers, volunteers, donors, or CSR partners collaborate?',
    aHi: 'आप नीचे दिए गए पंजीकरण एवं रुचि फॉर्म में अपनी श्रेणी (स्वयंसेवक, विशेषज्ञ/प्रशिक्षक, CSR या संस्थागत साझेदार) चुनकर सीधे विवरण दर्ज कर सकते हैं या संपर्क पृष्ठ के माध्यम से हमारी टीम से संवाद कर सकते हैं।',
    aEn: 'You can select your role (Volunteer, Expert/Doctor/Yoga Trainer, CSR or Institutional Partner) in the collaboration portal below, or reach our coordination desk directly via the Contact page.',
  },
];

export function SeniorCitizenCarePage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: SeniorCitizenCarePageProps) {
  const [activeTab, setActiveTab] = useState<string>('ec-why');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('volunteer');
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

  const openCollaborationForm = (cat: RegistrationCategory) => {
    setSelectedCategory(cat);
    setPortalFocusKey((k) => k + 1);
    const portalEl = document.getElementById('ec-portal-form');
    if (portalEl) {
      portalEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const joinPathways: {
    category: RegistrationCategory;
    icon: typeof HeartHandshake;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
    ctaHi: string;
    ctaEn: string;
  }[] = [
    {
      category: 'volunteer',
      icon: HeartHandshake,
      titleHi: 'स्वयंसेवक सहयोग (Volunteer Support)',
      titleEn: 'Volunteer Support',
      descHi:
        'वृद्धजनों के साथ संवाद, पुस्तकालय, संगीत, सत्संग, बागवानी या स्थानीय सामुदायिक सेवा में स्वैच्छिक योगदान के लिए जुड़ें।',
      descEn:
        'Contribute compassionately through companionship, reading, music, storytelling, or gentle community activities.',
      ctaHi: 'स्वयंसेवक फॉर्म खोलें',
      ctaEn: 'Open Volunteer Form',
    },
    {
      category: 'expert-trainer',
      icon: Stethoscope,
      titleHi: 'चिकित्सक, मनोवैज्ञानिक व योग प्रशिक्षक',
      titleEn: 'Doctors, Psychologists & Yoga Trainers',
      descHi:
        'चिकित्सीय सलाह, मानसिक स्वास्थ्य परामर्श, सुरक्षित चेयर योग व ध्यान मार्गदर्शन हेतु विशेषज्ञ के रूप में सहयोग करें।',
      descEn:
        'Partner as a qualified physician, psychologist, mental-health advisor, or certified senior yoga & meditation instructor.',
      ctaHi: 'विशेषज्ञ फॉर्म खोलें',
      ctaEn: 'Open Specialist Form',
    },
    {
      category: 'csr-partner',
      icon: Building2,
      titleHi: 'संस्थागत, दानदाता व CSR साझेदारी',
      titleEn: 'CSR, Donors & Institutional Partners',
      descHi:
        'गौशाला-संबद्ध वृद्धजन कल्याण मॉडल के अध्ययन, परिसर विकास, पोषण या स्वास्थ्य संसाधनों में संस्थागत सहभागिता।',
      descEn:
        'Collaborate through CSR, philanthropy, Gaushala partnerships, or health & nutrition infrastructure planning.',
      ctaHi: 'साझेदारी फॉर्म खोलें',
      ctaEn: 'Open Partnership Form',
    },
  ];

  return (
    <div className="bg-white text-[#153E1E]">
      {/* 1. SEAMLESS SUNLIT VERANDAH HERO */}
      <ElderlyCareHero lang={lang} onScrollTo={scrollToSection} />

      {/* STICKY ANCHOR NAVIGATION */}
      <MissionAnchorNav
        tabs={ANCHOR_TABS}
        activeTab={activeTab}
        onSelect={scrollToSection}
        lang={lang}
        ariaLabel={
          lang === 'hi'
            ? 'वृद्धजन देखभाल एवं मानसिक स्वास्थ्य पेज सेक्शन'
            : 'Senior Citizen Care & Mental Well-being Sections'
        }
      />

      {/* 2. PURPOSE & WHY IT MATTERS */}
      <ElderlyWhyMatters lang={lang} />

      {/* 3. HOLISTIC CARE MODEL — PANORAMIC CAMPUS WITH HERO-STYLE ELBOW LEADER LINES */}
      <ElderlyHolisticModel lang={lang} />

      {/* 4. DIGNIFIED LIVING, SAFE CAMPUS & GAUSHALA-LINKED SATTVIC FOOD */}
      <ElderlyDignifiedCareAndFood lang={lang} />

      {/* 5. THREE CORE EXPERIENCE PILLARS (Voluntary Gauseva · Nature · Yoga & Mental Health) */}
      <ElderlyExperienceTrio lang={lang} />

      {/* 6. PROPOSED FLEXIBLE DAILY ROUTINE (Sequential Left-to-Right Flow) */}
      <ElderlyDailyRoutine lang={lang} />

      {/* 7. COMMUNITY COMPANIONSHIP + 6-MISSION RADIAL INTERCONNECTION HUB */}
      <ElderlyCommunityAndInterconnections lang={lang} onNavigate={onNavigate} />

      {/* 8. LONG-TERM PROPOSED VISION & HONEST COMPLIANCE BANNER */}
      <ElderlyProposedVisionBanner lang={lang} />

      {/* 9. COLLABORATION & LIVE INQUIRY PORTAL */}
      <section id="ec-join" className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#E5DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#5A7B3B]">
                {lang === 'hi' ? '06 · सहयोग एवं सहभागिता' : '06 · Collaboration & Support'}
              </span>
              <span className="h-px w-16 bg-[#C8B37B]" aria-hidden="true" />
            </div>
            <h2
              className={`text-2xl sm:text-4xl font-extrabold text-[#113B19] ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? 'कैसे जुड़ें? एवं अपनी रुचि दर्ज करें' : 'How to Collaborate & Express Interest'}
            </h2>
            <p className={`text-xs sm:text-[15px] text-[#415446] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'इस मानवीय पहल को आगे बढ़ाने के लिए स्वयंसेवक, चिकित्सक, योग प्रशिक्षक, दानदाता और CSR/संस्थागत साझेदार विभिन्न रूपों में सहयोग कर सकते हैं।'
                : 'Volunteers, doctors, psychologists, yoga trainers, donors, and CSR institutions can collaborate to help shape and support this compassionate vision.'}
            </p>
          </div>

          {/* 3 Interactive Collaboration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {joinPathways.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedCategory === p.category;
              return (
                <div
                  key={p.category}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#F5F9F0] border-[#6EB83A]'
                      : 'bg-[#FCFBF7] border-[#E5DEC8]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#DFCFAF] text-[#1D542B] flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className={`text-base font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                      {lang === 'hi' ? p.titleHi : p.titleEn}
                    </h3>
                    <p className={`text-xs sm:text-[13px] text-[#435648] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                      {lang === 'hi' ? p.descHi : p.descEn}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCollaborationForm(p.category)}
                    className={`mt-5 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#7CC042] text-[#102E16]'
                        : 'bg-[#154A24] text-white hover:bg-[#1D632E]'
                    }`}
                  >
                    <span>{lang === 'hi' ? p.ctaHi : p.ctaEn}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Embedded Live Registration & Inquiry Portal */}
          <div id="ec-portal-form" className="scroll-mt-32 rounded-3xl bg-[#FCFBF7] border border-[#DFCFAF] p-4 sm:p-6">
            <RegistrationPortal
              key={`${selectedCategory}-${portalFocusKey}`}
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory={selectedCategory}
              allowedCategories={[
                'volunteer',
                'expert-trainer',
                'csr-partner',
                'ngo-institution',
                'membership',
              ]}
            />
          </div>

          {/* Direct Dialogue Strip */}
          <div className="rounded-2xl bg-[#153E1E] text-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C8F19E]">
                <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {lang === 'hi'
                    ? 'गौशाला समिति · चिकित्सक · CSR एवं समाजसेवी संवाद'
                    : 'Gaushala Committees · Healthcare Specialists · CSR Dialogue'}
                </span>
              </div>
              <p className={`text-sm sm:text-base font-bold ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'प्रस्तावित वृद्धजन देखभाल एवं मानसिक स्वास्थ्य पहल से जुड़ने या सुझाव साझा करने के लिए सीधे संपर्क करें।'
                  : 'Connect directly with our team to share ideas, institutional support, or Gaushala collaboration proposals.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#82C341] text-[#102E16] text-xs sm:text-sm font-bold hover:bg-[#95D456] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>{lang === 'hi' ? 'संपर्क पृष्ठ देखें' : 'Contact Our Desk'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 10. TRANSPARENT BILINGUAL FAQs */}
      <section id="ec-faqs" className="scroll-mt-32 bg-[#FAF8F2] py-14 sm:py-18">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#5A7B3B]">
              {lang === 'hi' ? '07 · स्पष्ट एवं ईमानदार उत्तर' : '07 · Clear & Honest Answers'}
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold text-[#113B19] ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi'
                ? 'वृद्धजन देखभाल मिशन से जुड़े सामान्य प्रश्न (FAQs)'
                : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="divide-y divide-[#DFCFAF] border-y border-[#DFCFAF] bg-white rounded-2xl overflow-hidden">
            {ELDERLY_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.qEn}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F2]/70 transition-colors cursor-pointer"
                  >
                    <span className={`text-sm sm:text-[15px] font-bold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
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
                      <p className={`text-xs sm:text-sm text-[#3F5145] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
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
