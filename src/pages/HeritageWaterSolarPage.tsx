import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, Droplets, Landmark } from 'lucide-react';
import {
  MissionEditorialHero,
  GovedaSevenStepModelBand,
  EditorialSectionHeader,
  EditorialSafeguardCallout,
  ExplanatorySvgFrame,
  MissionQuietJoinBanner,
} from '../components/MissionEditorialShell';
import {
  HeritageWaterCutawaySvg,
  WaterEightFactorBlueprintSvg,
} from '../components/MissionExplanatoryIllustrationsB';
import { GENERATED_ASSETS } from '../data/assets';
import type { Language, RegistrationRecord } from '../types/goveda';

interface HeritageWaterSolarPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const HERITAGE_ACTIONS = [
  { hi: 'शेखावाटी की ऐतिहासिक हवेलियों के संवेदनशील संरक्षण में सहयोग', en: 'Sensitive conservation outreach for historic Shekhawati havelis' },
  { hi: 'पारंपरिक भारतीय वास्तुकला व भित्तिचित्र धरोहर के प्रति जागरूकता', en: 'Public awareness on traditional sandstone & fresco architecture' },
  { hi: 'स्थानीय पारंपरिक कारीगरों (चूना-कारीगरी व शिल्प) के कौशल का संरक्षण', en: 'Preserving skills of local traditional lime-plaster & stone artisans' },
  { hi: 'विरासत भवनों के पर्यावरण-अनुकूल सामुदायिक उपयोग की संभावनाएँ', en: 'Exploring eco-friendly adaptive community use of heritage buildings' },
  { hi: 'प्रवासी राजस्थानी (Pravasi Rajasthani) परिवारों के साथ संरक्षण सहयोग', en: 'Collaborative engagement with Pravasi Rajasthani diaspora families' },
  { hi: 'वास्तु एवं संरक्षण विशेषज्ञों के माध्यम से तकनीकी मार्गदर्शन', en: 'Technical conservation guidance through accredited heritage experts' },
];

const WATER_ACTIONS = [
  { hi: 'पारंपरिक जोहड़ और ग्रामीण तालाबों का संरक्षण व पुनर्जीवन', en: 'Conservation and revival of traditional village johads and talabs' },
  { hi: 'बावड़ी और पारंपरिक वर्षा जल संरचनाओं के पुनर्जीवन का वैज्ञानिक अध्ययन', en: 'Scientific revival studies for historic stepwells (baoris) & kunds' },
  { hi: 'भवनों व संस्थानों में स्वच्छ रूफटॉप रेनवाटर हार्वेस्टिंग', en: 'Clean rooftop rainwater harvesting across homes & heritage buildings' },
  { hi: 'स्थानीय जलग्रहण क्षेत्र (Catchment Area) की सुरक्षा व अतिक्रमण-मुक्ति संवाद', en: 'Local catchment protection and unobstructed rainwater inflow channels' },
  { hi: 'ग्रामीण एवं शहरी समुदायों में भूजल संरक्षण जागरूकता', en: 'Groundwater conservation and responsible pumping awareness' },
  { hi: 'स्कूलों और गाँवों में व्यावहारिक जल साक्षरता (Water Literacy)', en: 'Practical water literacy sessions in village schools and panchayats' },
  { hi: 'गाँव स्तर पर सहभागी सामुदायिक जल बजट (Community Water Budget)', en: 'Participatory village-level Community Water Budgeting' },
];

const FAQS = [
  {
    qHi: 'किसी ऐतिहासिक हवेली या विरासत भवन में संरक्षण कार्य से पहले कौन-सी कानूनी जाँच अनिवार्य है?',
    qEn: 'What compliance checks are required before any intervention on a historic building?',
    aHi: 'ऐतिहासिक भवनों में किसी भी बदलाव या संरक्षण कार्य से पहले स्वामित्व (Ownership), लागू विरासत संरक्षण नियमों और संबंधित विभागों की सभी आवश्यक अनुमतियों की स्पष्ट जाँच अनिवार्य रूप से की जाती है।',
    aEn: 'Before any physical work on a historic structure, GOVEDA requires verified ownership consent, full compliance with applicable heritage conservation laws, and all statutory departmental clearances.',
  },
  {
    qHi: 'जोहड़, तालाब या बावड़ी के पुनर्जीवन से पहले कौन-से वैज्ञानिक अध्ययन किए जाते हैं?',
    qEn: 'What scientific assessments are conducted before reviving a johad, talab, or baori?',
    aHi: 'प्रत्येक जल संरक्षण परियोजना से पहले 8 प्रमुख मानकों — स्थानीय वर्षा रिकॉर्ड, जलग्रहण क्षेत्र, मिट्टी की पारगम्यता, भूजल स्तर, पानी की गुणवत्ता, गाद व प्रदूषण स्थिति, संरचना सुरक्षा और विभागीय अनुमतियों — का अध्ययन किया जाता है।',
    aEn: 'Eight essential factors are assessed prior to action: local rainfall records, catchment area, soil permeability, groundwater table, water quality, silt & pollution load, structural safety, and departmental permissions.',
  },
];

export function HeritageWaterSolarPage({ lang, onNavigate }: HeritageWaterSolarPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const hi = lang === 'hi';

  return (
    <div className="bg-[#FAF9F4] text-[#144721]">
      {/* 1. SEAMLESS BOTANICAL SANDSTONE HERO */}
      <MissionEditorialHero
        lang={lang}
        eyebrow="GOVEDA • HERITAGE CONSERVATION & WATER SECURITY"
        titleLine1Hi="सांस्कृतिक धरोहर"
        titleLine2Hi="एवं जल संरक्षण"
        titleLine1En="Cultural Heritage"
        titleLine2En="& Water Security"
        taglineHi="ऐतिहासिक हवेलियाँ। पारंपरिक जोहड़-बावड़ियाँ। वैज्ञानिक जल सुरक्षा।"
        taglineEn="Historic Havelis. Traditional Baoris & Johads. Scientific Water Security."
        summaryHi="भारत की सांस्कृतिक धरोहर, शेखावाटी की ऐतिहासिक हवेलियों, पारंपरिक कारीगरी और जोहड़-तालाब-बावड़ी जैसी जल संरचनाओं के पर्यावरण-अनुकूल संरक्षण एवं वैज्ञानिक भूजल पुनर्भरण को बढ़ावा देने की पहल।"
        summaryEn="Advancing respectful conservation of India’s cultural heritage, Shekhawati havelis, traditional craftsmanship, and time-tested water structures—johads, talabs, baoris, and rooftop rainwater harvesting."
        primaryCtaHi="मिशन से जुड़ें"
        primaryCtaEn="Join Mission"
        secondaryCtaHi="संरक्षण प्रणाली समझें"
        secondaryCtaEn="Explore Conservation Blueprint"
        onPrimaryCta={() => onNavigate('/join/ngo-institution')}
        onSecondaryCta={() =>
          document.getElementById('hw-cutaway')?.scrollIntoView({ behavior: 'smooth' })
        }
        imageSrc={GENERATED_ASSETS.heritageHeroEditorial}
        imageAltHi="सांस्कृतिक धरोहर एवं जल संरक्षण — शेखावाटी हवेली, बावड़ी और जल संचयन"
        imageAltEn="Cultural Heritage & Water Security — Shekhawati sandstone haveli, stepwell and rainwater capture"
        cropRightArtworkOnly={true}
        artworkZoomPercent={195}
      />

      {/* 2. GOVEDA 7-STEP SCIENTIFIC METHODOLOGY BAND */}
      <GovedaSevenStepModelBand lang={lang} />

      {/* 3. LARGE EXPLANATORY SVG 1: SHEKHAWATI HAVELI & BAORI AQUIFER CUTAWAY */}
      <section id="hw-cutaway" className="py-14 sm:py-18 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="01"
            kickerHi="विरासत वास्तुकला और पारंपरिक जल अभियांत्रिकी"
            kickerEn="Heritage Architecture & Traditional Water Engineering"
            titleHi="शेखावाटी हवेली से रूफटॉप रेनवाटर, बावड़ी-जोहड़ और भूजल पुनर्भरण तक"
            titleEn="How Heritage Roofs, Baoris & Johads Recharge Rajasthan’s Underground Aquifers"
            leadHi="राजस्थान की पारंपरिक हवेलियाँ और बावड़ियाँ केवल स्मारक नहीं, बल्कि सदियों से परखी हुई जलवायु-अनुकूल जल संचयन प्रणाली हैं।"
            leadEn="Rajasthan’s historic havelis, tankas, baoris, and johads are living blueprints of arid-zone climate resilience—harvesting monsoon rain cleanly into local aquifers."
            lang={lang}
          />

          <ExplanatorySvgFrame
            lang={lang}
            captionHi="चित्र 01: शेखावाटी हवेली की छत से फ़िल्टर होकर भूमिगत टांके, पारंपरिक बावड़ी व ग्राम जोहड़ द्वारा भूजल स्तर के वैज्ञानिक पुनर्भरण का दृश्य।"
            captionEn="Figure 01: Architectural cutaway showing filtered rooftop rainwater from a Shekhawati haveli alongside stepped baori and village johad recharging the groundwater aquifer."
          >
            <HeritageWaterCutawaySvg lang={lang} />
          </ExplanatorySvgFrame>
        </div>
      </section>

      {/* 4. TWO CORE TRACKS: HERITAGE CONSERVATION & WATER CONSERVATION */}
      <section className="py-14 sm:py-18 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="02"
            kickerHi="प्रस्तावित कार्यक्षेत्र"
            kickerEn="Proposed Action Pillars"
            titleHi="सांस्कृतिक विरासत संरक्षण और सामुदायिक जल सुरक्षा"
            titleEn="Heritage Stewardship & Community Water Conservation"
            lang={lang}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FBF2DC] text-[#8F530B] flex items-center justify-center">
                  <Landmark className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className={`text-xl font-extrabold text-[#124520] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                  {hi ? 'धरोहर संरक्षण (Heritage Conservation)' : 'Heritage Conservation'}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#32493A] leading-relaxed">
                {HERITAGE_ACTIONS.map((a) => (
                  <li key={a.en} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B57D1E] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className={hi ? 'font-hindi' : ''}>{hi ? a.hi : a.en}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F4FA] text-[#124769] flex items-center justify-center">
                  <Droplets className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className={`text-xl font-extrabold text-[#124520] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                  {hi ? 'जल संरक्षण (Water Conservation)' : 'Water Conservation'}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#32493A] leading-relaxed">
                {WATER_ACTIONS.map((a) => (
                  <li key={a.en} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1D6FA3] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className={hi ? 'font-hindi' : ''}>{hi ? a.hi : a.en}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <EditorialSafeguardCallout
            lang={lang}
            titleHi="विरासत स्वामित्व एवं वैधानिक अनुमति नीति"
            titleEn="Heritage Ownership & Statutory Compliance Safeguard"
            bodyHi="ऐतिहासिक भवनों, हवेलियों या पारंपरिक जल संरचनाओं में किसी भी बदलाव अथवा संरक्षण हस्तक्षेप से पहले स्पष्ट स्वामित्व, लागू विरासत संरक्षण नियमों और संबंधित सरकारी विभागों की आवश्यक अनुमतियों की अनिवार्य जाँच की जाएगी।"
            bodyEn="Before any conservation intervention on historic havelis or heritage water structures, clear ownership consent, applicable heritage laws, and mandatory departmental approvals are verified."
          />
        </div>
      </section>

      {/* 5. LARGE EXPLANATORY SVG 2: 8-FACTOR SCIENTIFIC WATER METHODOLOGY */}
      <section className="py-14 sm:py-18 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <EditorialSectionHeader
            index="03"
            kickerHi="वैज्ञानिक कार्यप्रणाली (8 अनिवार्य अध्ययन)"
            kickerEn="8-Factor Scientific Water Methodology"
            titleHi="बिना वैज्ञानिक जाँच कोई जल संरचना हस्तक्षेप नहीं"
            titleEn="Eight Scientific Assessments Guiding Every Water Revival Project"
            leadHi="जल संरक्षण कार्यों को स्थायी और सुरक्षित बनाने के लिए वर्षा, जलग्रहण, मिट्टी पारगम्यता, भूजल, गुणवत्ता, गाद, सुरक्षा और अनुमतियों का समग्र अध्ययन आवश्यक है।"
            leadEn="Sustainable water security requires studying rainfall patterns, catchment flows, soil permeability, groundwater depth, water quality, silt load, masonry safety, and statutory permissions before ground work."
            lang={lang}
          />

          <ExplanatorySvgFrame
            lang={lang}
            captionHi="चित्र 02: जल संरक्षण परियोजनाओं के लिए GOVEDA द्वारा अपनाई जाने वाली 8-चरणीय वैज्ञानिक व वैधानिक मूल्यांकन प्रणाली।"
            captionEn="Figure 02: GOVEDA’s 8-factor scientific and regulatory assessment checklist for traditional water body revival and rainwater harvesting."
          >
            <WaterEightFactorBlueprintSvg lang={lang} />
          </ExplanatorySvgFrame>
        </div>
      </section>

      {/* 6. FAQs */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <EditorialSectionHeader
            index="04"
            kickerHi="सामान्य प्रश्न"
            kickerEn="Frequently Asked Questions"
            titleHi="धरोहर एवं जल संरक्षण से जुड़े प्रश्न"
            titleEn="Key Questions on Heritage & Water Conservation"
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
        titleHi="विरासत संरक्षण, प्रवासी राजस्थानी सहयोग या जल साक्षरता से जुड़ें"
        titleEn="Collaborate on Heritage Conservation & Community Water Security"
        descHi="ग्राम पंचायत, धर्मशाला/हवेली ट्रस्ट, जल विशेषज्ञ या स्वयंसेवक के रूप में पारंपरिक धरोहर व जल स्रोतों के संरक्षण में सहभागी बनें।"
        descEn="Partner with GOVEDA as a Gram Panchayat, heritage trust, Pravasi Rajasthani family, technical advisor, or volunteer."
        ctaHi="साझेदारी हेतु जुड़ें"
        ctaEn="Partner With GOVEDA"
        onJoin={() => onNavigate('/join/ngo-institution')}
        secondaryHi="परियोजनाएँ व अभियान देखें"
        secondaryEn="Explore Projects & Campaigns"
        onSecondary={() => onNavigate('/projects')}
      />
    </div>
  );
}
