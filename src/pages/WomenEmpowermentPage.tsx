import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  MissionEditorialHero,
  GovedaSevenStepModelBand,
  EditorialSectionHeader,
  EditorialSafeguardCallout,
  ExplanatorySvgFrame,
  MissionQuietJoinBanner,
} from '../components/MissionEditorialShell';
import { WomenShgEnterpriseSvg } from '../components/MissionExplanatoryIllustrationsB';
import type { Language, RegistrationRecord } from '../types/goveda';

interface WomenEmpowermentPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const PROPOSED_ACTIVITIES_GROUPS = [
  {
    icon: ShoppingBag,
    hiTitle: 'समूह उत्पादन एवं स्थानीय उद्यम',
    enTitle: 'Collective Production & Local Enterprises',
    items: [
      { hi: 'स्वयं सहायता समूहों (SHG) के साथ दीर्घकालिक साझेदारी', en: 'Long-term partnerships with rural & town Self-Help Groups' },
      { hi: 'प्लास्टिक-मुक्त अभियान हेतु सूती कपड़े और जूट के थैले निर्माण', en: 'Cotton and jute reusable bag making linked with Clean India' },
      { hi: 'ग्रामीण हस्तशिल्प एवं पारंपरिक स्थानीय उत्पादों का संवर्धन', en: 'Promotion of rural handicrafts and authentic local crafts' },
      { hi: 'जैविक खाद एवं कृषि आधारित महिला उद्यम विकास', en: 'Organic compost & agriculture-linked women micro-enterprises' },
      { hi: 'स्वच्छ मानकों के साथ स्थानीय खाद्य प्रसंस्करण पहल', en: 'Hygienic local food-processing & preserve enterprises' },
    ],
  },
  {
    icon: Smartphone,
    hiTitle: 'डिजिटल, वित्तीय एवं ब्रांडिंग सक्षमता',
    enTitle: 'Digital, Financial & Market Readiness',
    items: [
      { hi: 'सुरक्षित डिजिटल भुगतान (UPI) एवं व्यावहारिक वित्तीय साक्षरता', en: 'Safe digital payments (UPI), savings & practical financial literacy' },
      { hi: 'व्यावहारिक महिला उद्यमिता और सूक्ष्म व्यवसाय प्रबंधन प्रशिक्षण', en: 'Hands-on women entrepreneurship & micro-business mentoring' },
      { hi: 'उत्पादों की स्वच्छ पैकेजिंग, गुणवत्ता और आकर्षक ब्रांडिंग', en: 'Clean product packaging, quality standards & local branding' },
      { hi: 'महिला उद्यमियों को सीधे बाजार एवं CSR नेटवर्क से जोड़ना', en: 'Connecting women entrepreneurs to retail markets & CSR buyers' },
    ],
  },
  {
    icon: ShieldCheck,
    hiTitle: 'नेतृत्व, सम्मान एवं कार्यस्थल सुरक्षा',
    enTitle: 'Leadership, Safety & Workplace Dignity',
    items: [
      { hi: 'ग्राम एवं सामुदायिक स्तर पर महिला नेतृत्व विकास कार्यक्रम', en: 'Women leadership programmes across village & green committees' },
      { hi: 'महिला सुरक्षा और कार्यस्थल सम्मान संबंधी व्यापक जागरूकता', en: 'Awareness on women’s safety and workplace dignity' },
      { hi: 'समान अवसर, सहयोगात्मक परिवेश और आत्मविश्वास निर्माण', en: 'Supportive peer circles building collective confidence & voice' },
    ],
  },
];

const FAQS = [
  {
    qHi: 'महिला सशक्तीकरण मिशन और कौशल विकास मिशन में क्या अंतर है?',
    qEn: 'How does Women Empowerment differ from the Skill Development Mission?',
    aHi: 'कौशल विकास मिशन सभी पात्र युवाओं और वयस्कों के लिए रोजगार व व्यावसायिक प्रशिक्षण प्रदान करता है (जैसे सिलाई प्रशिक्षण सीखना)। महिला सशक्तीकरण मिशन विशेष रूप से महिलाओं की आर्थिक भागीदारी, स्वयं सहायता समूह गठन, उत्पाद ब्रांडिंग, नेतृत्व और सीधे बाजार जुड़ाव पर केंद्रित है।',
    aEn: 'Skill Development provides vocational training for all eligible youth and adults (for example, learning tailoring). Women Empowerment & Livelihoods focuses specifically on women’s economic agency—forming an SHG to manufacture, brand, package, and sell products in local markets.',
  },
  {
    qHi: 'क्या महिला समूहों की आय संबंधी आंकड़ों को लेकर GOVEDA की कोई पारदर्शी नीति है?',
    qEn: 'How does GOVEDA report women’s income and enterprise progress?',
    aHi: 'हाँ। महिलाओं की आय संबंधी उपलब्धियों को केवल सत्यापित वास्तविक डेटा के आधार पर ही प्रदर्शित किया जाएगा — कोई काल्पनिक दावा या निश्चित वेतन का भ्रामक वादा नहीं किया जाता।',
    aEn: 'Women’s livelihood and income achievements are published strictly on verified real ground data—with zero fabricated claims or misleading income guarantees.',
  },
];

export function WomenEmpowermentPage({ lang, onNavigate }: WomenEmpowermentPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const hi = lang === 'hi';

  return (
    <div className="bg-[#FAF9F4] text-[#144721]">
      {/* 1. USER-UPLOADED CRISP PNG HERO ARTWORK */}
      <MissionEditorialHero
        lang={lang}
        eyebrow="GOVEDA • PEOPLE • PLANET • PROSPERITY"
        titleLine1Hi="महिला सशक्तीकरण"
        titleLine2Hi="एवं आजीविका"
        titleLine1En="Women Empowerment"
        titleLine2En="& Sustainable Livelihoods"
        taglineHi="सशक्त महिलाएँ। सुदृढ़ समुदाय। आत्मनिर्भर भविष्य।"
        taglineEn="Empowering Women. Strengthening Communities."
        summaryHi="महिलाओं को आर्थिक, सामाजिक, डिजिटल और उद्यमिता के क्षेत्र में सक्षम बनाना — स्वयं सहायता समूहों, कौशल, ब्रांडिंग, वित्तीय साक्षरता, कार्यस्थल सम्मान और बाजार जुड़ाव के माध्यम से आत्मनिर्भरता को बढ़ावा।"
        summaryEn="Strengthening women economically, socially, digitally, and entrepreneurially through Self-Help Group collectives, eco-products, packaging & branding, financial literacy, workplace dignity, and direct market access."
        primaryCtaHi="मिशन से जुड़ें"
        primaryCtaEn="Join Mission"
        secondaryCtaHi="SHG मॉडल समझें"
        secondaryCtaEn="Explore SHG Pathway"
        onPrimaryCta={() => onNavigate('/join/women-shg')}
        onSecondaryCta={() =>
          document.getElementById('we-enterprise-model')?.scrollIntoView({ behavior: 'smooth' })
        }
        imageSrc="/assets/aistudio/file_00000000fc208211bdb71d97121c9656_de2bac0c.png"
        imageAltHi="महिला सशक्तीकरण एवं आजीविका — सिलाई, हस्तशिल्प, डिजिटल साक्षरता और नेतृत्व"
        imageAltEn="Women Empowerment & Livelihoods — tailoring, handicrafts, digital literacy and rural leadership"
        cropRightArtworkOnly
        artworkZoomPercent={184}
      />

      {/* 2. GOVEDA 7-STEP SCIENTIFIC METHODOLOGY BAND */}
      <GovedaSevenStepModelBand lang={lang} />

      {/* 3. LARGE EXPLANATORY SVG: SHG VALUE CHAIN + SKILL VS WOMEN DISTINCTION */}
      <section id="we-enterprise-model" className="py-14 sm:py-18 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="01"
            kickerHi="SHG सामूहिक उद्यमिता श्रृंखला एवं मिशन स्पष्टता"
            kickerEn="SHG Collective Enterprise Value Chain & Mission Distinction"
            titleHi="समूह गठन से उत्पाद ब्रांडिंग, डिजिटल भुगतान और सीधे बाजार तक"
            titleEn="From Collective Formation to Branding, Digital Literacy & Direct Markets"
            leadHi="जब ग्रामीण और कस्बाई महिलाएँ स्वयं सहायता समूह के माध्यम से उत्पादन, पैकेजिंग और डिजिटल लेन-देन में दक्ष बनती हैं, तो आजीविका स्थायी और सम्मानजनक बनती है।"
            leadEn="When women move beyond isolated training into collective production, clean branding, safe digital finance, and direct buyer networks, livelihoods become resilient and dignified."
            lang={lang}
          />

          <ExplanatorySvgFrame
            lang={lang}
            captionHi="चित्र 01: महिला स्वयं सहायता समूह की 5-चरणीय उद्यमिता यात्रा तथा कौशल विकास मिशन व महिला सशक्तीकरण मिशन के बीच स्पष्ट कार्य-सीमा।"
            captionEn="Figure 01: 5-stage Women SHG enterprise pathway alongside the clear conceptual boundary separating Skill Development from Women Empowerment & Livelihoods."
          >
            <WomenShgEnterpriseSvg lang={lang} />
          </ExplanatorySvgFrame>
        </div>
      </section>

      {/* 4. ALL 11 PROPOSED ACTIVITIES (PDF 5.2) */}
      <section className="py-14 sm:py-18 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="02"
            kickerHi="प्रस्तावित गतिविधियाँ (11 मुख्य पहल)"
            kickerEn="Proposed Activities Across Three Dimensions"
            titleHi="आर्थिक स्वावलंबन, डिजिटल आत्मविश्वास और सामुदायिक नेतृत्व"
            titleEn="Economic Self-Reliance, Digital Confidence & Community Leadership"
            lang={lang}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PROPOSED_ACTIVITIES_GROUPS.map((grp) => {
              const Icon = grp.icon;
              return (
                <article
                  key={grp.enTitle}
                  className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-6 space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4E3] text-[#144721] flex items-center justify-center">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className={`text-lg font-extrabold text-[#124520] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                    {hi ? grp.hiTitle : grp.enTitle}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-[#32493A] leading-relaxed">
                    {grp.items.map((pt) => (
                      <li key={pt.en} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#3A7D2C] shrink-0 mt-0.5" aria-hidden="true" />
                        <span className={hi ? 'font-hindi' : ''}>{hi ? pt.hi : pt.en}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <EditorialSafeguardCallout
            lang={lang}
            titleHi="सत्यापित डेटा एवं पारदर्शी आय रिपोर्टिंग नीति"
            titleEn="Verified Income & Dignity Commitment"
            bodyHi="महिलाओं की आय संबंधी उपलब्धियों को केवल सत्यापित वास्तविक डेटा के आधार पर ही प्रदर्शित किया जाएगा। GOVEDA कौशल, ब्रांडिंग, वित्तीय साक्षरता और बाजार समन्वय में सहयोग करती है — कोई भ्रामक या निश्चित आय का दावा नहीं करती।"
            bodyEn="Women’s enterprise and income progress is reported strictly on verified field data. GOVEDA focuses honestly on collective capacity, packaging quality, safe digital finance, and real market access."
          />
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="py-14 bg-[#FAF9F4]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <EditorialSectionHeader
            index="03"
            kickerHi="सामान्य प्रश्न"
            kickerEn="Frequently Asked Questions"
            titleHi="महिला सशक्तीकरण एवं आजीविका मिशन से जुड़े प्रश्न"
            titleEn="Key Questions on Women SHGs & Livelihoods"
            lang={lang}
          />
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.qEn} className="rounded-2xl border border-[#E5DEC9] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-[15px] text-[#124520] cursor-pointer"
                  >
                    <span className={hi ? 'font-hindi' : ''}>{hi ? faq.qHi : faq.qEn}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className={`px-5 pb-4 pt-2 border-t border-[#E5DEC9] text-xs sm:text-sm text-[#354B3C] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                      {hi ? faq.aHi : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CLEAN PARTICIPATION INVITATION */}
      <MissionQuietJoinBanner
        lang={lang}
        titleHi="अपने महिला स्वयं सहायता समूह (SHG) को GOVEDA से जोड़ें"
        titleEn="Connect Your Women Self-Help Group With GOVEDA"
        descHi="कपड़े के थैले निर्माण, हस्तशिल्प, जैविक उत्पाद, डिजिटल साक्षरता और बाजार नेटवर्क से जुड़ने के लिए सहभागिता दर्ज करें।"
        descEn="Join GOVEDA’s Women Empowerment & Livelihoods network for SHG enterprise mentoring, eco-product branding, and market collaboration."
        ctaHi="महिला समूह के रूप में जुड़ें"
        ctaEn="Join as Women SHG"
        onJoin={() => onNavigate('/join/women-shg')}
        secondaryHi="परियोजनाएँ व अभियान देखें"
        secondaryEn="Explore Projects & Campaigns"
        onSecondary={() => onNavigate('/projects')}
      />
    </div>
  );
}
