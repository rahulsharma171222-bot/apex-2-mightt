import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Flame,
  PhoneCall,
  Wrench,
} from 'lucide-react';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { RegistrationPortal } from '../components/RegistrationForms';
import { OrganicEditorialHeading } from '../components/OrganicFarmingSections';
import {
  CleanEnergyHero,
  CleanEnergyWhyMatters,
  CleanEnergyDigesterSection,
  CleanEnergySolarSection,
  CleanEnergyBiogasVsCbgSection,
  CleanEnergySlurryCircleAndEstimator,
  CleanEnergyGovedaRoleAndModules,
} from '../components/CleanEnergySections';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface CleanEnergyPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'ce-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'ce-digester', hi: 'बायोगैस विज्ञान', en: 'Digester Science' },
  { id: 'ce-solar', hi: 'ग्रामीण सौर ऊर्जा', en: 'Rural Solar' },
  { id: 'ce-cbg', hi: 'बायोगैस बनाम CBG', en: 'Biogas vs. CBG' },
  { id: 'ce-estimator', hi: 'व्यवहार्यता अनुमानक', en: 'Feasibility Tool' },
  { id: 'ce-modules', hi: 'सुरक्षा व 10 मॉड्यूल', en: 'Safety & Modules' },
  { id: 'ce-join', hi: 'मिशन से जुड़ें', en: 'Join Mission' },
  { id: 'ce-faqs', hi: 'सामान्य प्रश्न', en: 'FAQs' },
] as const;

const CLEAN_ENERGY_FAQS = [
  {
    qHi: 'क्या घरेलू बायोगैस को सामान्य LPG सिलेंडर में भरकर उपयोग किया जा सकता है?',
    qEn: 'Can raw household biogas be filled into regular domestic LPG cylinders?',
    aHi: 'बिल्कुल नहीं। कच्ची बायोगैस में CO₂, नमी व H₂S होते हैं और घरेलू LPG सिलेंडर उच्च-दबाव मीथेन के लिए नहीं बने होते। घरेलू बायोगैस का उपयोग केवल कम-दबाव पाइप और विशेष बायोगैस बर्नर में ही सुरक्षित है।',
    aEn: 'Never. Raw biogas contains CO₂, moisture, and trace H₂S, and domestic LPG cylinders are not engineered for compressed methane. Raw biogas must only be piped at low pressure to dedicated biogas burners.',
  },
  {
    qHi: 'क्या GOVEDA के जिला-स्तरीय CBG (Bio-CNG) संयंत्र वर्तमान में चालू हैं?',
    qEn: 'Are GOVEDA district-level CBG (Bio-CNG) plants currently operational?',
    aHi: 'नहीं। वर्तमान में जिला-स्तरीय CBG क्लस्टर केवल प्रस्तावित एवं तकनीकी व्यवहार्यता अध्ययन (Feasibility / DPR) चरण में हैं। वास्तविक संयंत्र केवल पर्याप्त गोबर क्लस्टर (10+ टन/दिन), तकनीकी साझेदारी और PESO वैधानिक स्वीकृतियों के बाद ही स्थापित होंगे।',
    aEn: 'No. District-scale CBG clusters are currently at the proposed / feasibility-study stage. Any future plant requires verified 10+ tonnes/day feedstock pooling, accredited engineering partners, and full PESO statutory clearances.',
  },
  {
    qHi: 'बायोगैस बनने के बाद निकलने वाली जैव-स्लरी क्या गोबर खाद से कम उपयोगी होती है?',
    qEn: 'Does extracting biogas reduce the fertiliser value of cow dung?',
    aHi: 'नहीं, बल्कि उल्टा होता है। बायोगैस डाइजेस्टर केवल कार्बन-हाइड्रोजन ऊर्जा गैस निकालता है, जबकि पौधों के पोषक तत्व (नाइट्रोजन, फॉस्फोरस, पोटाश व सूक्ष्म तत्व) जैव-स्लरी में और अधिक सुलभ रूप में सुरक्षित रहते हैं—और खरपतवार के बीज भी नष्ट हो जाते हैं।',
    aEn: 'No—in fact it improves usability. Digestion extracts methane gas while preserving NPK and micronutrients in more plant-available form, reducing odour and neutralising most weed seeds.',
  },
  {
    qHi: 'एक छोटे किसान परिवार या गौशाला को बायोगैस शुरू करने के लिए कितने पशुओं की आवश्यकता होती है?',
    qEn: 'How many cattle are needed for a household or Gaushala biogas unit?',
    aHi: 'घरेलू रसोई के लिए 2–5 वयस्क गोवंश (लगभग 20–50 किग्रा ताज़ा गोबर प्रतिदिन) एक 2 m³ इकाई के लिए पर्याप्त होते हैं। 50–250 गोवंश वाली गौशालाएँ सामुदायिक रसोई, चारा-ताप व जैव-स्लरी खाद केंद्र के रूप में बड़ी इकाई चला सकती हैं।',
    aEn: 'A rural family with 2–5 adult cattle (~20–50 kg fresh dung/day) can run a 2 m³ household unit. Gaushalas with 50–250 cattle can power institutional kitchens and supply rich bio-slurry to neighbouring farms.',
  },
  {
    qHi: 'सौर ऊर्जा, बायोगैस या स्वच्छ ऊर्जा तकनीक साझेदारी के लिए कौन जुड़ सकता है?',
    qEn: 'Who can partner with GOVEDA on solar, biogas, or clean energy pilots?',
    aHi: 'गौशाला समितियाँ, किसान परिवार, नवीकरणीय ऊर्जा इंजीनियर/संस्थान, CSR भागीदार और ग्राम पंचायतें नीचे दिए गए पंजीकरण पोर्टल के माध्यम से अपनी रुचि या तकनीकी प्रस्ताव दर्ज कर सकते हैं।',
    aEn: 'Gaushala committees, farming families, accredited solar/biogas engineers, CSR partners, and Gram Panchayats can register directly via the portal below.',
  },
];

export function CleanEnergyPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: CleanEnergyPageProps) {
  const [activeTab, setActiveTab] = useState<string>('ce-why');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('gaushala');
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
    const portalEl = document.getElementById('ce-portal-form');
    if (portalEl) {
      portalEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pathways: {
    category: RegistrationCategory;
    icon: typeof Flame;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
    ctaHi: string;
    ctaEn: string;
  }[] = [
    {
      category: 'gaushala',
      icon: Flame,
      titleHi: 'गौशाला बायोगैस एवं सोलर सहभागिता',
      titleEn: 'Gaushala Biogas & Rooftop Solar',
      descHi:
        'अपनी गौशाला में गोबर संग्रह, बायोगैस डाइजेस्टर, जैव-स्लरी खाद इकाई और छत पर सोलर मूल्यांकन के लिए जुड़ें।',
      descEn:
        'Register your Gaushala for dung-to-biogas assessment, bio-slurry fertiliser beds, and shelter rooftop solar planning.',
      ctaHi: 'गौशाला फॉर्म खोलें',
      ctaEn: 'Open Gaushala Form',
    },
    {
      category: 'expert-trainer',
      icon: Wrench,
      titleHi: 'सौर, बायोगैस व CBG तकनीकी साझेदार',
      titleEn: 'Solar, Biogas & CBG Technology Experts',
      descHi:
        'प्रमाणित ऊर्जा इंजीनियर, DPR सलाहकार और ग्रामीण तकनीशियन सुरक्षित संयंत्र डिज़ाइन व व्यवहार्यता अध्ययन में सहयोग करें।',
      descEn:
        'Accredited renewable engineers, DPR specialists, and clean-tech providers collaborating on safe rural pilots.',
      ctaHi: 'विशेषज्ञ फॉर्म खोलें',
      ctaEn: 'Open Tech Partner Form',
    },
    {
      category: 'csr-partner',
      icon: Building2,
      titleHi: 'CSR एवं संस्थागत स्वच्छ ऊर्जा सहयोग',
      titleEn: 'CSR & Institutional Clean Energy Support',
      descHi:
        'ग्रामीण सोलर स्ट्रीट लाइट, गौशाला बायोगैस पायलट, धुआँ-रहित रसोई या जिला व्यवहार्यता अध्ययन को सहयोग दें।',
      descEn:
        'Support rural solar lighting, Gaushala biogas demonstrations, smokeless rural kitchens, or feasibility research.',
      ctaHi: 'CSR साझेदारी फॉर्म खोलें',
      ctaEn: 'Open CSR Form',
    },
  ];

  return (
    <div className="bg-[#FBFAF6] text-[#144721]">
      {/* 1. SEAMLESS EDITORIAL HERO (Desktop + Mobile Unified) */}
      <CleanEnergyHero lang={lang} onScrollTo={scrollToSection} />

      {/* STICKY ANCHOR NAVIGATION */}
      <MissionAnchorNav
        tabs={ANCHOR_TABS}
        activeTab={activeTab}
        onSelect={scrollToSection}
        lang={lang}
        ariaLabel={
          lang === 'hi'
            ? 'स्वच्छ ऊर्जा: सौर, बायोगैस एवं CBG पेज सेक्शन'
            : 'Clean Energy: Solar, Biogas and CBG Page Sections'
        }
      />

      {/* 2. WHY IT MATTERS */}
      <CleanEnergyWhyMatters lang={lang} />

      {/* 3. INTERACTIVE BIOGAS DIGESTER CUTAWAY */}
      <CleanEnergyDigesterSection lang={lang} />

      {/* 4. DECENTRALIZED RURAL SOLAR */}
      <CleanEnergySolarSection lang={lang} />

      {/* 5. BIOGAS VS CBG TECHNICAL CLARITY */}
      <CleanEnergyBiogasVsCbgSection lang={lang} />

      {/* 6. CIRCULAR BIO-SLURRY LOOP + INTERACTIVE FEASIBILITY ESTIMATOR */}
      <CleanEnergySlurryCircleAndEstimator lang={lang} onNavigate={onNavigate} />

      {/* 7. GOVEDA'S ROLE, SAFETY POLICY & 10 MODULES */}
      <CleanEnergyGovedaRoleAndModules lang={lang} />

      {/* 8. JOIN THIS MISSION — LIVE REGISTRATION PORTAL */}
      <section
        id="ce-join"
        className="scroll-mt-32 bg-white py-14 sm:py-20 border-b border-[#EAE2CC]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <OrganicEditorialHeading
            eyebrowHi="07 · स्वच्छ ऊर्जा से जुड़ें"
            eyebrowEn="07 · Join Clean Energy Mission"
            titleHi="गौशाला, किसान, तकनीकी विशेषज्ञ या CSR साझेदार के रूप में जुड़ें"
            titleEn="Collaborate as a Gaushala, Farmer, Tech Expert or CSR Partner"
            leadHi="अपनी भूमिका चुनें और सीधे ऑनलाइन पंजीकरण दर्ज करें—हर पंजीकरण को एक यूनिक Reference ID के साथ पारदर्शी रूप से ट्रैक किया जाता है।"
            leadEn="Choose your collaboration pathway below—every submission receives a unique Reference ID for transparent coordination."
            lang={lang}
          />

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

          <div
            id="ce-portal-form"
            className="scroll-mt-32 rounded-3xl bg-[#FBFAF6] border border-[#DFCFAF] p-4 sm:p-6"
          >
            <RegistrationPortal
              key={`${selectedCategory}-${portalFocusKey}`}
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory={selectedCategory}
              allowedCategories={[
                'gaushala',
                'farmer',
                'expert-trainer',
                'csr-partner',
                'ngo-institution',
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
                    ? 'गौशाला क्लस्टर · स्वच्छ ऊर्जा इंजीनियरिंग · CSR संवाद डेस्क'
                    : 'Gaushala Clusters · Clean-Tech Engineering · CSR Dialogue Desk'}
                </span>
              </div>
              <p
                className={`text-sm sm:text-base font-bold ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi'
                  ? 'बायोगैस इकाई, ग्रामीण सोलर पायलट या जिला CBG व्यवहार्यता अध्ययन पर संवाद हेतु संपर्क करें।'
                  : 'Connect directly with our team for Gaushala biogas pilots, rural solar projects, or CBG feasibility discussions.'}
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
      <section id="ce-faqs" className="scroll-mt-32 bg-[#FBFAF6] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <OrganicEditorialHeading
            eyebrowHi="08 · स्पष्ट एवं सुरक्षित उत्तर"
            eyebrowEn="08 · Clear & Safety-First Answers"
            titleHi="स्वच्छ ऊर्जा, बायोगैस व CBG से जुड़े सामान्य प्रश्न (FAQs)"
            titleEn="Frequently Asked Questions"
            lang={lang}
            align="center"
          />

          <div className="divide-y divide-[#DFCFAF] border-y border-[#DFCFAF] bg-white rounded-2xl overflow-hidden">
            {CLEAN_ENERGY_FAQS.map((item, idx) => {
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
