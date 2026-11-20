import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  MapPin,
  Sprout,
  Sun,
  Trees,
  Users,
} from 'lucide-react';
import {
  MissionEditorialHero,
  GovedaSevenStepModelBand,
  EditorialSectionHeader,
  EditorialSafeguardCallout,
  ExplanatorySvgFrame,
  MissionQuietJoinBanner,
} from '../components/MissionEditorialShell';
import {
  HaritPlantationLifecycleSvg,
  HaritHeatCarbonNetworkSvg,
} from '../components/MissionExplanatoryIllustrationsB';
import type { Language, RegistrationRecord } from '../types/goveda';

interface HaritRajasthanPageProps {
  lang: Language;
  districtSlug?: string;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const HEAT_MEASURES = [
  { hi: 'स्थानीय छायादार वृक्षों का संरक्षण', en: 'Conservation of existing native shade trees' },
  { hi: 'स्कूलों और सार्वजनिक स्थानों पर छाया व्यवस्था', en: 'Shaded green spaces at schools & public hubs' },
  { hi: 'गर्मी के प्रति संवेदनशील क्षेत्रों (हॉटस्पॉट) की पहचान', en: 'Mapping heat-vulnerable rural & town zones' },
  { hi: 'उपयुक्त कूल रूफ और भवन ऊर्जा दक्षता', en: 'Suitable cool-roof coatings & building efficiency' },
  { hi: 'ग्राम व नगर स्तर पर जल संरक्षण', en: 'Community water conservation & storage' },
  { hi: 'वर्षा जल प्रबंधन एवं भूजल पुनर्भरण', en: 'Rainwater management & aquifer recharge' },
  { hi: 'शहरी हरित क्षेत्र (Urban Green Pockets)', en: 'Urban green belts & shaded avenues' },
  { hi: 'नागरिकों व विद्यार्थियों में हीटवेव जागरूकता', en: 'Seasonal heatwave safety awareness drives' },
  { hi: 'स्थानीय प्रशासन की Heat Action Plan गतिविधियों में सहयोग', en: 'Supporting district Heat Action Plan initiatives' },
];

const FAQS = [
  {
    qHi: 'हरित राजस्थान मिशन और हरित राजस्थान जिला प्लेटफ़ॉर्म में क्या अंतर है?',
    qEn: 'How is this Harit Rajasthan Mission page different from the Harit Rajasthan District Platform?',
    aHi: 'यह पृष्ठ हरित राजस्थान मिशन की वैज्ञानिक वृक्षारोपण प्रणाली, हरित मित्र नेटवर्क, भीलवाड़ा प्रस्तावित पायलट, हीटवेव सुरक्षा और कार्बन क्रेडिट सीमा को समझाता है। जिलों, तहसीलों व ग्रामों के स्थानीय कार्यक्रम देखने के लिए आप ऊपर दिए बटन से हरित राजस्थान जिला प्लेटफ़ॉर्म खोल सकते हैं।',
    aEn: 'This mission page explains the scientific 10-step plantation methodology, Harit Mitra stewardship, Bhilwara pilot design, heat resilience, and carbon-credit rules. To explore Rajasthan’s districts, tehsils, and local initiatives, open the dedicated Harit Rajasthan Geographic Platform.',
  },
  {
    qHi: 'क्या हर वृक्षारोपण परियोजना स्वतः कार्बन क्रेडिट परियोजना बन जाती है?',
    qEn: 'Does every tree plantation automatically qualify for carbon credits?',
    aHi: 'नहीं। हर वृक्षारोपण स्वतः कार्बन क्रेडिट नहीं बनता। इसके लिए उपयुक्त अंतर्राष्ट्रीय/राष्ट्रीय मानक, पात्रता, अतिरिक्तता (Additionality), बेसलाइन, दीर्घकालिक निगरानी (MRV), स्वतंत्र सत्यापन, भूमि व कार्बन अधिकार तथा स्थायित्व का वैज्ञानिक मूल्यांकन आवश्यक है।',
    aEn: 'No. Trees provide immediate ecological, shade, and soil benefits, whereas carbon credits require separate standards compliance, additionality, baseline studies, multi-year MRV, independent verification, and clear land/carbon rights.',
  },
  {
    qHi: 'भीलवाड़ा मॉडल में 100 किसान व 100 पौधे के लक्ष्य को किस रूप में देखा जाना चाहिए?',
    qEn: 'How should the Bhilwara model’s 100-farmer / 100-tree scale be understood?',
    aHi: 'इन्हें प्रारंभिक प्रस्तावित योजना (Proposed Target) के रूप में रखा गया है — उपलब्धि के रूप में नहीं। वास्तविक संख्या प्रत्येक गाँव में भूमि, जल उपलब्धता, उपयुक्त देशी पौधों, किसान सहमति और वित्तीय व्यवहार्यता के आधार पर तय होगी।',
    aEn: 'Those figures represent an initial proposed planning scale—never a claimed achievement. Actual ground scale in every village depends strictly on land, water, native sapling supply, farmer consent, and financial feasibility.',
  },
];

export function HaritRajasthanPage({ lang, onNavigate }: HaritRajasthanPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const hi = lang === 'hi';

  return (
    <div className="bg-[#FAF9F4] text-[#144721]">
      {/* 1. SEAMLESS EDITORIAL HERO + CROSS-LINK TO GEOGRAPHIC PLATFORM */}
      <MissionEditorialHero
        lang={lang}
        eyebrow="GOVEDA • MISSION 02 • GREEN RAJASTHAN TO GREEN INDIA"
        titleLine1Hi="हरित राजस्थान,"
        titleLine2Hi="वृक्षारोपण व जलवायु संरक्षण"
        titleLine1En="Harit Rajasthan,"
        titleLine2En="Plantation & Climate Care"
        taglineHi="केवल पौधे लगाना नहीं — देशज प्रजाति, जल उपलब्धता और दीर्घकालिक जीवितता संरक्षण।"
        taglineEn="Beyond Planting Saplings — Native Species, Water Care & Long-Term Survival."
        summaryHi="राजस्थान से शुरुआत करके स्थानीय परिस्थितियों के अनुकूल वृक्षारोपण, वृक्ष संरक्षण, हरित ग्राम, हरित विद्यालय, हरित मित्र नेटवर्क, बढ़ती गर्मी से बचाव और पर्यावरण जागरूकता का वैज्ञानिक मॉडल विकसित करना।"
        summaryEn="Starting from Rajasthan to build locally adapted native tree plantation, tree stewardship, Harit Gram, Harit Vidyalaya, Harit Mitra village networks, heatwave resilience, and environmental awareness."
        primaryCtaHi="हरित मित्र बनें"
        primaryCtaEn="Become Harit Mitra"
        secondaryCtaHi="10-चरणीय मॉडल समझें"
        secondaryCtaEn="10-Step Scientific Model"
        onPrimaryCta={() => onNavigate('/join/harit-mitra')}
        onSecondaryCta={() =>
          document.getElementById('hr-scientific-model')?.scrollIntoView({ behavior: 'smooth' })
        }
        imageSrc="/assets/hero-harit-clean.jpg"
        imageAltHi="हरित राजस्थान — राजस्थान के ग्रामीण खेतों में देशी वृक्षारोपण एवं कृषि वानिकी"
        imageAltEn="Harit Rajasthan — native agroforestry and green village landscape in Rajasthan"
        cropRightArtworkOnly={false}
        extraAction={
          <button
            type="button"
            onClick={() => onNavigate('/harit-rajasthan')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF5E6] hover:bg-[#E1EED4] text-[#144721] px-4 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#2E6F36]" aria-hidden="true" />
            <span>{hi ? 'जिला प्लेटफ़ॉर्म खोलें' : 'Open District Platform'}</span>
          </button>
        }
      />

      {/* 2. GOVEDA 7-STEP SCIENTIFIC METHODOLOGY BAND */}
      <GovedaSevenStepModelBand lang={lang} />

      {/* 3. LARGE EXPLANATORY SVG 1: 10-STEP SCIENTIFIC PLANTATION LIFECYCLE */}
      <section id="hr-scientific-model" className="py-14 sm:py-18 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="01"
            kickerHi="वृक्षारोपण का 10-चरणीय वैज्ञानिक मॉडल"
            kickerEn="10-Step Scientific Tree Plantation Model"
            titleHi="केवल पौधे लगाना पर्याप्त नहीं — 10 चरणों में सुनिश्चित जीवितता"
            titleEn="Planting Alone Is Never Enough — Ten Steps From Consent to Mature Canopy"
            leadHi="प्रत्येक वृक्षारोपण पहल भूमि की वैध सहमति और स्थानीय जलवायु-मिट्टी अध्ययन से शुरू होकर ट्री-गार्ड सुरक्षा, नियमित निरीक्षण, प्रतिस्थापन और दीर्घकालिक संरक्षण तक चलती है।"
            leadEn="Every plantation initiative begins with informed land consent and soil-climate study, and continues through native species selection, protection, survival monitoring, gap replacement, and multi-year stewardship."
            lang={lang}
          />

          <ExplanatorySvgFrame
            lang={lang}
            captionHi="चित्र 01: हरित राजस्थान की 10-चरणीय वैज्ञानिक वृक्षारोपण प्रक्रिया, देशज प्रजातियाँ (खेजड़ी, नीम, रोहिड़ा, आंवला) तथा शुष्क घासभूमि पारिस्थितिकी सुरक्षा नियम।"
            captionEn="Figure 01: The 10-step scientific plantation lifecycle, drought-resilient Rajasthan native species, and the arid grassland ecological safeguard."
          >
            <HaritPlantationLifecycleSvg lang={lang} />
          </ExplanatorySvgFrame>
        </div>
      </section>

      {/* 4. LARGE EXPLANATORY SVG 2: HARIT MITRA, HEATWAVE RESILIENCE & CARBON BOUNDARY */}
      <section className="py-14 sm:py-18 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="02"
            kickerHi="हरित मित्र, हीटवेव सुरक्षा एवं कार्बन क्रेडिट सीमा"
            kickerEn="Harit Mitra Network, Heat Resilience & Carbon Boundary"
            titleHi="ग्राम स्तर पर सामुदायिक नेतृत्व, शीतलन उपाय और ईमानदार कार्बन मानक"
            titleEn="Village Stewardship, Extreme Heat Protection & Transparent Carbon Governance"
            lang={lang}
          />

          <ExplanatorySvgFrame
            lang={lang}
            captionHi="चित्र 02: चयनित गाँवों में हरित मित्र की 7 भूमिकाएँ, बढ़ती गर्मी से बचाव के स्थानीय उपाय तथा कार्बन क्रेडिट पात्रता व मॉड्यूल पृथक्करण सीमा।"
            captionEn="Figure 02: Seven Harit Mitra village roles, local heatwave cooling interventions, and the strict Carbon Credit eligibility and module separation boundary."
          >
            <HaritHeatCarbonNetworkSvg lang={lang} />
          </ExplanatorySvgFrame>
        </div>
      </section>

      {/* 5. BHILWARA PROPOSED PILOT MODEL & EXTREME HEAT MEASURES */}
      <section className="py-14 sm:py-18 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bhilwara Pilot Card */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E5DEC9] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF4E3] text-[#144721] flex items-center justify-center">
                  <Sprout className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#B57D1E]">
                    {hi ? 'प्रस्तावित पायलट मॉडल (PROPOSED PILOT)' : 'PROPOSED PILOT MODEL'}
                  </p>
                  <h3 className={`text-xl font-extrabold text-[#124520] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                    {hi ? 'भीलवाड़ा प्रस्तावित पायलट मॉडल' : 'Bhilwara Proposed Pilot Model'}
                  </h3>
                </div>
              </div>
              <p className={`text-sm text-[#32493A] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'भीलवाड़ा जिले में गाँव-वार किसान पंजीकरण, हरित मित्र समन्वय और वैज्ञानिक वृक्षारोपण का एक प्रस्तावित पायलट मॉडल विकसित किया जाएगा।'
                  : 'A proposed village-wise farmer registration, Harit Mitra coordination, and native tree plantation pilot is being designed for Bhilwara district.'}
              </p>
              <div className="rounded-xl bg-[#FBF7EA] border border-[#E3D3A7] p-4 space-y-1.5 text-xs sm:text-sm text-[#544019]">
                <p className="font-bold">
                  {hi ? 'प्रारंभिक योजना लक्ष्य — उपलब्धि नहीं:' : 'Initial Planning Scale — Not a Claimed Achievement:'}
                </p>
                <p className={hi ? 'font-hindi' : ''}>
                  {hi
                    ? 'प्रति गाँव 100 किसानों और प्रति किसान 100 पौधों जैसे लक्ष्य प्रारंभिक योजना के रूप में रखे जा सकते हैं, लेकिन वास्तविक लक्ष्य भूमि, जल, पौधों की उपलब्धता, किसान सहमति और वित्तीय व्यवहार्यता के आधार पर तय होंगे।'
                    : 'Indicative planning scales such as 100 farmers per village and 100 saplings per farmer serve strictly as proposed planning benchmarks; final village targets depend on land, water, sapling supply, farmer consent, and financial feasibility.'}
                </p>
              </div>
            </div>

            {/* Heatwave Resilience 9 Measures */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E5DEC9] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF4DE] text-[#8F530B] flex items-center justify-center">
                  <Sun className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#8F530B]">
                    {hi ? 'जलवायु अनुकूलन · हीटवेव सुरक्षा' : 'CLIMATE ADAPTATION · HEAT RESILIENCE'}
                  </p>
                  <h3 className={`text-xl font-extrabold text-[#124520] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                    {hi ? 'बढ़ती गर्मी से निपटने के 9 उपाय' : 'Nine Practical Measures Against Extreme Heat'}
                  </h3>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-[13.5px] text-[#32493A]">
                {HEAT_MEASURES.map((m) => (
                  <li key={m.en} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3A7D2C] shrink-0 mt-1" aria-hidden="true" />
                    <span className={hi ? 'font-hindi' : ''}>{hi ? m.hi : m.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <EditorialSafeguardCallout
            lang={lang}
            titleHi="शहरी शीतलन एवं GPS निगरानी पारदर्शिता नोट"
            titleEn="Urban Cooling & Phased Monitoring Honesty Note"
            bodyHi="शहरी हरियाली और छायादार वृक्ष स्थानीय स्तर पर गर्मी कम करने में सहायक होते हैं, लेकिन किसी एक परियोजना से पूरे शहर का तापमान निश्चित मात्रा में घटने का दावा नहीं किया जाता। GPS आधारित विस्तृत निगरानी अलग समर्पित सॉफ्टवेयर चरण में विकसित की जाएगी।"
            bodyEn="Local shade canopies and urban greenery help cool microclimates, but GOVEDA never claims that a single plantation reduces an entire city’s temperature by a fixed number of degrees. Detailed GPS-level monitoring will be built in a dedicated software phase."
          />
        </div>
      </section>

      {/* 6. FAQs */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <EditorialSectionHeader
            index="03"
            kickerHi="सामान्य प्रश्न"
            kickerEn="Frequently Asked Questions"
            titleHi="हरित राजस्थान मिशन से जुड़े स्पष्ट उत्तर"
            titleEn="Key Questions on Harit Rajasthan"
            lang={lang}
          />
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.qEn} className="rounded-2xl border border-[#E5DEC9] bg-[#FAF9F4] overflow-hidden">
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

      {/* 7. CLEAN PARTICIPATION INVITATION */}
      <MissionQuietJoinBanner
        lang={lang}
        titleHi="हरित मित्र, किसान या हरित विद्यालय के रूप में जुड़ें"
        titleEn="Join Harit Rajasthan as a Harit Mitra, Farmer or Green Campus"
        descHi="स्थानीय देशी वृक्षारोपण, पौध जीवितता देखभाल और राजस्थान के जिलों में सामुदायिक हरियाली पहल में सहभागी बनें।"
        descEn="Participate in native tree care, village coordination, or explore district-wise updates on the Harit Rajasthan Geographic Platform."
        ctaHi="हरित मित्र के रूप में जुड़ें"
        ctaEn="Become Harit Mitra"
        onJoin={() => onNavigate('/join/harit-mitra')}
        secondaryHi="हरित राजस्थान जिला प्लेटफ़ॉर्म"
        secondaryEn="Open District Platform"
        onSecondary={() => onNavigate('/harit-rajasthan')}
      />
    </div>
  );
}
