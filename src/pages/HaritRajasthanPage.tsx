import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Trees,
  Droplets,
  GraduationCap,
  Handshake,
  Sprout,
  Users,
  AlertCircle,
} from 'lucide-react';
import { SpringButton, SpringCard } from '../components/SpringMotion';
import { RajasthanMap } from '../components/RajasthanMap';
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
import { SeamlessInlinePhoto } from '../components/ScenicElements';
import { GENERATED_ASSETS } from '../data/assets';
import { usePublicPortal } from '../context/PublicPortalContext';
import { mergePublicDistricts } from '../utils/publicDataBridge';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface HaritRajasthanPageProps {
  lang: Language;
  districtSlug?: string;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const HARIT_ANCHOR_TABS = [
  { id: 'hr-overview', hi: 'परिचय', en: 'Overview' },
  { id: 'hr-plantation', hi: 'वृक्षारोपण', en: 'Plantation' },
  { id: 'hr-districts', hi: 'जिले', en: 'Districts' },
  { id: 'hr-farmers', hi: 'किसान', en: 'Farmers' },
  { id: 'hr-harit-mitra', hi: 'हरित मित्र', en: 'Harit Mitra' },
  { id: 'hr-institutions', hi: 'शिक्षण संस्थान', en: 'Institutions' },
  { id: 'hr-csr', hi: 'CSR सहयोग', en: 'CSR' },
  { id: 'hr-carbon', hi: 'कार्बन क्रेडिट', en: 'Carbon Credit' },
  { id: 'hr-gallery', hi: 'गैलरी व प्रगति', en: 'Gallery' },
  { id: 'hr-join', hi: 'जुड़ें', en: 'Join Us' },
] as const;

const NATIVE_SPECIES = [
  {
    hi: 'खेजड़ी (राज्य वृक्ष)',
    en: 'Khejri (State Tree)',
    descHi: 'कम पानी में पनपने वाला, मिट्टी में नाइट्रोजन बढ़ाने वाला और चारा-छाया देने वाला जीवनदायी वृक्ष।',
    descEn: 'Drought-resilient Rajasthan icon that fixes soil nitrogen and provides fodder and deep shade.',
  },
  {
    hi: 'नीम (Neem)',
    en: 'Neem',
    descHi: 'प्राकृतिक कीट-नियंत्रक, स्वच्छ हवा और औषधीय गुणों से भरपूर सदाबहार देशी पेड़।',
    descEn: 'Hardy native shade tree supporting natural pest resilience and cooler village air.',
  },
  {
    hi: 'रोहिड़ा व बबूल',
    en: 'Rohida & Native Acacia',
    descHi: 'शुष्क जलवायु के अनुकूल, मिट्टी का कटाव रोकने और जैव-विविधता बचाने वाले स्थानीय वृक्ष।',
    descEn: 'Desert-hardy natives stabilizing sandy soils and supporting native pollinators.',
  },
  {
    hi: 'आंवला, जामुन व सहजन',
    en: 'Amla, Jamun & Moringa',
    descHi: 'खेतों व स्कूलों के लिए पोषण, फल और ग्रामीण परिवारों के लिए अतिरिक्त उपयोगी प्रजातियाँ।',
    descEn: 'Fruit and nutrition-bearing native trees ideal for farm borders and school green campuses.',
  },
];

const HARIT_FAQS = [
  {
    qHi: 'हरित राजस्थान अभियान किस प्रकार एक साधारण वृक्षारोपण कार्यक्रम से अलग है?',
    qEn: 'How is Harit Rajasthan different from a one-day plantation drive?',
    aHi: 'हम केवल पौधा लगाने की संख्या नहीं गिनते, बल्कि राजस्थान की जलवायु के अनुकूल देशी प्रजातियाँ चुनने, ट्री-गार्ड लगाने, 2–3 वर्ष पानी-देखभाल और स्थानीय हरित मित्रों द्वारा जीवितता निगरानी पर ध्यान देते हैं।',
    aEn: 'Instead of counting one-day saplings, we emphasize native Rajasthan species, tree guards, 2–3 years of watering care, and local Harit Mitra survival stewardship.',
  },
  {
    qHi: 'क्या प्रारंभिक 5 जिलों के बाहर के किसान या स्कूल भी पंजीकरण कर सकते हैं?',
    qEn: 'Can farmers or schools outside the 5 initial focus districts register?',
    aHi: 'हाँ। भीलवाड़ा, चूरू, बीकानेर, फलोदी और जोधपुर प्रथम चरण (Phase-1) के फोकस जिले हैं, लेकिन राजस्थान के अन्य जिलों से भी इच्छुक किसान, स्वयंसेवक और संस्थान पंजीकरण कर सकते हैं।',
    aEn: 'Yes. Bhilwara, Churu, Bikaner, Phalodi, and Jodhpur are Phase-1 focus districts, while participants from across Rajasthan are welcome to register as the campaign expands.',
  },
  {
    qHi: 'क्या हरित राजस्थान में पेड़ लगाने पर कार्बन क्रेडिट की गारंटी मिलती है?',
    qEn: 'Does planting trees under Harit Rajasthan guarantee carbon credits?',
    aHi: 'नहीं। वृक्षारोपण से पर्यावरण, छाया, मिट्टी और जल को तुरंत लाभ मिलता है, लेकिन कार्बन क्रेडिट एक अलग वैज्ञानिक, बहु-वर्षीय और स्वतंत्र सत्यापन प्रक्रिया पर निर्भर करता है—इसकी कोई गारंटी नहीं दी जाती।',
    aEn: 'No. Trees immediately deliver shade, soil health, and water benefits, whereas carbon credits depend on separate eligibility, multi-year MRV, and independent verification with zero guarantee.',
  },
  {
    qHi: 'हरित मित्र कौन बन सकता है? क्या यह सरकारी या सवेतन नौकरी है?',
    qEn: 'Who can become a Harit Mitra? Is it a paid job?',
    aHi: 'पर्यावरण प्रेमी कोई भी नागरिक, युवा, शिक्षक या किसान हरित मित्र बन सकता है। यह पूर्णतः स्वैच्छिक सामुदायिक सहभागिता है—यह कोई सवेतन नौकरी नहीं है।',
    aEn: 'Any environmentally committed citizen, student, teacher, or farmer can join. It is strictly voluntary community stewardship—not paid employment.',
  },
  {
    qHi: 'कंपनियाँ (CSR) और शिक्षण संस्थान इस अभियान में कैसे जुड़ सकते हैं?',
    qEn: 'How can companies (CSR) and schools/universities participate?',
    aHi: 'नीचे “Join Us” सेक्शन में Institutional या CSR श्रेणी चुनकर फॉर्म भरें। हम ग्राम-स्तरीय वृक्षारोपण, ग्रीन कैंपस और पारदर्शी प्रगति रिपोर्टिंग हेतु समन्वय करते हैं।',
    aEn: 'Select Institutional Partnership or CSR Partnership in the Join Us portal below to initiate green-campus drives or transparent district plantation collaborations.',
  },
  {
    qHi: 'क्या भविष्य में हर जिले या गतिविधि के अलग पेज जुड़ेंगे?',
    qEn: 'Will detailed district pages remain accessible as campaigns grow?',
    aHi: 'हाँ। Phase-1 में यह एकीकृत मुख्य पेज सभी 10 पहलुओं को एक जगह दिखाता है, और पाँचों फोकस जिलों के समर्पित जिला पृष्ठ पहले से सक्रिय हैं जिन्हें भविष्य में विस्तारित किया जा सकता है।',
    aEn: 'Yes. Phase-1 keeps everything clear on one unified page while dedicated district pages for all five focus districts are already live and expandable.',
  },
];

export function HaritRajasthanPage({
  lang,
  districtSlug,
  records,
  onAddRecord,
  onNavigate,
}: HaritRajasthanPageProps) {
  const [activeTab, setActiveTab] = useState<string>('hr-overview');
  const [portalCategory, setPortalCategory] = useState<RegistrationCategory>('harit-mitra');
  const [portalFocusKey, setPortalFocusKey] = useState(0);

  const { bootstrap } = usePublicPortal();
  const liveDistricts = mergePublicDistricts(bootstrap?.districts);
  const selectedDistrict = districtSlug
    ? liveDistricts.find((d) => d.slug === districtSlug)
    : undefined;

  const haritUpdates = (bootstrap?.contentItems ?? []).filter(
    (item) =>
      item.status === 'Published' &&
      (item.relatedMissionSlug === 'harit-rajasthan' || item.categoryTag.toLowerCase().includes('harit'))
  );

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openJoinCategory = (cat: RegistrationCategory) => {
    setPortalCategory(cat);
    setPortalFocusKey((k) => k + 1);
    scrollToSection('hr-join');
  };

  /* ==========================================================================
     DISTRICT DETAIL TEMPLATE VIEW (/harit-rajasthan/:slug) — PRESERVED & REFINED
     ========================================================================== */
  if (selectedDistrict) {
    return (
      <div className="bg-white text-[#153E1E]">
        <section className="bg-[#FCF8F0] border-b border-[#DFCFAF]/75 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <button
              type="button"
              onClick={() => onNavigate('/missions/harit-rajasthan')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5A32] hover:underline mb-5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{lang === 'hi' ? 'हरित राजस्थान मुख्य पेज पर वापस जाएँ' : 'Back to Harit Rajasthan Main Page'}</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs font-bold tracking-[0.14em] text-[#2F6D26]">
                  {selectedDistrict.regionTag[lang]}
                </p>
                <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#153E1E] leading-tight text-balance">
                  {selectedDistrict.name[lang]}{' '}
                  {lang === 'hi' ? '— हरित राजस्थान जिला अभियान' : '— Harit Rajasthan District Campaign'}
                </h1>
                <svg viewBox="0 0 220 16" fill="none" aria-hidden="true" className="w-40 h-3">
                  <path d="M2 12 C62 3 144 1 216 9 C158 8 80 10 4 15 Z" fill="#82C341" />
                </svg>
                <p className={`text-sm sm:text-base text-[#2A3A30] leading-relaxed max-w-[62ch] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {selectedDistrict.introduction[lang]}
                </p>
                <div className="pt-1 flex flex-wrap gap-2.5">
                  <SpringButton
                    variant="primary"
                    size="sm"
                    onClick={() => document.getElementById('district-reg-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="!bg-[#153E1E]"
                  >
                    <span>{lang === 'hi' ? 'जिला अभियान में पंजीकरण करें' : 'Register for District Campaign'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </SpringButton>
                  <SpringButton
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('/join/harit-mitra')}
                  >
                    <span>{lang === 'hi' ? 'हरित मित्र बनें' : 'Become Harit Mitra'}</span>
                  </SpringButton>
                </div>
              </div>
              <div className="lg:col-span-5 flex justify-center">
                <FloatingVignette
                  assetKey="missionVignette02Tree"
                  alt={selectedDistrict.name.en}
                  caption={`${selectedDistrict.name[lang]} · ${selectedDistrict.regionTag[lang]}`}
                  size="md"
                />
              </div>
            </div>
          </div>
          <OpenSkyHorizon variant="sandstone" fadeFrom="cream" heightClass="h-24 sm:h-32" />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-[#DFCFAF] p-6 bg-white">
                <h2 className="text-lg font-bold text-[#153E1E] mb-3 font-hindi">
                  {lang === 'hi' ? 'जिला मिशन उद्देश्य (District Objectives)' : 'District Mission Objectives'}
                </h2>
                <ul className="space-y-2.5 text-sm text-[#2A3A30]">
                  {selectedDistrict.objectives.map((obj) => (
                    <li key={obj.en} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#4B8E27] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{obj[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#DFCFAF] p-6 bg-[#FCF8F0]">
                <h2 className="text-lg font-bold text-[#153E1E] mb-3 font-hindi">
                  {lang === 'hi' ? 'प्रमुख जिला अभियान (Proposed District Campaigns)' : 'Proposed District Campaigns'}
                </h2>
                <ul className="space-y-2.5 text-sm text-[#2A3A30]">
                  {selectedDistrict.campaigns.map((camp) => (
                    <li key={camp.en} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1B5A32] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{camp[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-2xl border border-[#DFCFAF] p-5 bg-[#F4F9F0]">
                <p className="text-xs font-bold tracking-[0.12em] text-[#2F6D26]">
                  {lang === 'hi' ? 'आयोजन एवं सहभागिता' : 'Events & Participation'}
                </p>
                <p className="text-sm font-bold text-[#153E1E] mt-1">
                  {selectedDistrict.eventsHighlight[lang]}
                </p>
                {selectedDistrict.slug === 'bhilwara' && (
                  <SpringButton
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('/harit-marathon')}
                    className="mt-3 !bg-[#153E1E]"
                  >
                    <span>{lang === 'hi' ? 'हरित मैराथन पेज खोलें' : 'Open Harit Marathon Page'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </SpringButton>
                )}
              </div>

              <div className="rounded-2xl border border-[#DFCFAF] p-5 bg-white space-y-3">
                <h3 className="text-sm font-bold text-[#153E1E]">
                  {lang === 'hi' ? 'जिला सहभागिता विकल्प' : 'District Participation Channels'}
                </h3>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {[
                    { cat: 'farmer', label: lang === 'hi' ? 'ग्राम एवं किसान सहभागिता (Farmer Reg)' : 'Village & Farmer Participation' },
                    { cat: 'gaushala', label: lang === 'hi' ? 'गौशाला सहभागिता (Gaushala Reg)' : 'Gaushala Participation' },
                    { cat: 'school-college', label: lang === 'hi' ? 'स्कूल व कॉलेज ग्रीन कैंपस' : 'School & College Green Campus' },
                    { cat: 'csr-partner', label: lang === 'hi' ? 'CSR व संस्थागत सहयोग' : 'CSR & Institutional Partnership' },
                  ].map((item) => (
                    <button
                      key={item.cat}
                      type="button"
                      onClick={() => onNavigate(`/join/${item.cat}`)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FCF8F0] hover:bg-[#EBF4E2] text-[#153E1E] font-semibold cursor-pointer transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#DFCFAF] p-5 bg-white text-xs text-[#44544A] space-y-2.5">
                <p className="font-bold text-[#153E1E]">
                  {lang === 'hi' ? 'जिला टीम एवं सत्यापित प्रगति' : 'District Team & Verified Progress'}
                </p>
                {selectedDistrict.coordinatorName && (
                  <p className="text-[#142119]">
                    <span className="font-semibold">
                      {lang === 'hi' ? 'जिला समन्वयक:' : 'District Coordinator:'}
                    </span>{' '}
                    {selectedDistrict.coordinatorName}
                  </p>
                )}
                {(lang === 'hi'
                  ? selectedDistrict.progressNotesHi || selectedDistrict.progressNotesEn
                  : selectedDistrict.progressNotesEn || selectedDistrict.progressNotesHi) && (
                  <p className="leading-relaxed text-[#2A3A30]">
                    {lang === 'hi'
                      ? selectedDistrict.progressNotesHi || selectedDistrict.progressNotesEn
                      : selectedDistrict.progressNotesEn || selectedDistrict.progressNotesHi}
                  </p>
                )}
                {selectedDistrict.outreachItems.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {selectedDistrict.outreachItems.map((item) => (
                      <li key={item.id} className="flex items-start gap-2 text-[#1E2923]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#388E3C] shrink-0 mt-0.5" />
                        <span>
                          <strong>{item.roleLabel}:</strong> {item.officeName} ({item.status})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p>
                  {lang === 'hi'
                    ? 'जिला समन्वयक, संस्थागत अतिथि एवं सत्यापित प्रगति आँकड़े औपचारिक सहमति और फील्ड सत्यापन के बाद ही प्रकाशित किए जाएंगे।'
                    : 'District coordinators, administrative guests, and verified metrics are published strictly after formal confirmation and field verification.'}
                </p>
              </div>
            </div>
          </div>

          {selectedDistrict.galleryUrls.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#153E1E]">
                {lang === 'hi' ? 'जिला क्षेत्रीय छायाचित्र (Field Gallery)' : 'District Field Gallery'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDistrict.galleryUrls.map((url, idx) => (
                  <div
                    key={`${selectedDistrict.slug}-gal-${idx}`}
                    className="rounded-2xl overflow-hidden border border-[#DFCFAF] bg-[#FCF8F0] h-48"
                  >
                    <img
                      src={url}
                      alt={`${selectedDistrict.name.en} field activity ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <div id="district-reg-form" className="pt-6 border-t border-[#DFCFAF] space-y-4">
            <h2 className="text-xl font-bold text-[#153E1E] font-hindi">
              {lang === 'hi'
                ? `${selectedDistrict.name.hi} जिला अभियान पंजीकरण फॉर्म`
                : `${selectedDistrict.name.en} District Campaign Registration`}
            </h2>
            <RegistrationPortal
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory="harit-mitra"
              allowedCategories={['harit-mitra', 'farmer', 'school-college', 'gaushala']}
            />
          </div>

          <div className="pt-4 border-t border-[#DFCFAF]">
            <p className="text-xs font-bold tracking-[0.14em] text-[#2F6D26] mb-3">
              {lang === 'hi' ? 'अन्य फोकस जिले देखें' : 'Switch Focus District'}
            </p>
            <div className="flex flex-wrap gap-2">
              {liveDistricts.map((d) => (
                <SpringButton
                  key={d.slug}
                  variant={d.slug === selectedDistrict.slug ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onNavigate(`/harit-rajasthan/${d.slug}`)}
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{d.name[lang]}</span>
                </SpringButton>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     MAIN MISSION 02: HARIT RAJASTHAN 10-SECTION SINGLE MAIN PAGE
     ========================================================================== */
  return (
    <div className="bg-white text-[#153E1E]">
      {/* HERO — MINIMALIST HOMEPAGE EDITORIAL CANVAS + FLOATING TREE VIGNETTE + DESERT HORIZON */}
      <section className="relative bg-[#FCF8F0] border-b border-[#DFCFAF]/75 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-[#2F6D26]">
              <button
                type="button"
                onClick={() => onNavigate('/missions')}
                className="hover:underline cursor-pointer"
              >
                {lang === 'hi' ? 'हमारे 10 मिशन' : 'Our 10 Missions'}
              </button>
              <span aria-hidden="true">·</span>
              <span>{lang === 'hi' ? 'मिशन 02 · क्षेत्रीय हरित अभियान' : 'Mission 02 · Regional Green Initiative'}</span>
            </div>

            <div>
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-[#153E1E] leading-[1.1] tracking-tight text-balance">
                {lang === 'hi' ? 'हरित राजस्थान — वृक्षारोपण एवं संरक्षण मिशन' : 'Harit Rajasthan — Tree Plantation Mission'}
              </h1>
              <p className="mt-2 font-hindi text-lg sm:text-xl font-bold text-[#1B5A32]">
                {lang === 'hi'
                  ? 'Building a Greener Rajasthan, Village by Village'
                  : 'गाँव-गाँव हरियाली, देशी वृक्ष संरक्षण और जन-सहभागिता'}
              </p>
              <svg viewBox="0 0 264 20" fill="none" aria-hidden="true" className="mt-2.5 w-48 sm:w-56 h-3.5">
                <path d="M2 14 C72 3 168 1 258 10 C192 9 98 11 4 18 Z" fill="#82C341" />
              </svg>
            </div>

            <p className={`text-sm sm:text-[15.5px] text-[#28362B] leading-[1.72] max-w-[64ch] ${lang === 'hi' ? 'font-hindi' : ''}`}>
              {lang === 'hi'
                ? 'भीलवाड़ा, चूरू, बीकानेर, फलोदी और जोधपुर सहित पूरे राजस्थान में किसानों, हरित मित्रों, शिक्षण संस्थानों और CSR साझेदारों को जोड़कर देशी वृक्षारोपण, पौधा संरक्षण और जल संवर्धन की जन-सहभागिता पहल।'
                : 'Uniting farmers, voluntary Harit Mitras, schools, universities, and CSR partners across Bhilwara, Churu, Bikaner, Phalodi, Jodhpur, and beyond to plant, protect, and nurture native trees.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => openJoinCategory('harit-mitra')}
                className="spring-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#153E1E] text-white text-sm font-bold hover:bg-[#1E562A] cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'hi' ? 'हरित मित्र बनें' : 'Join as Harit Mitra'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('hr-districts')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#153E1E] border border-[#3E7B2E]/40 text-sm font-bold hover:border-[#6EB83A] hover:bg-[#F4FAF0] cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'hi' ? 'फोकस जिले देखें' : 'Explore Focus Districts'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <FloatingVignette
              assetKey="missionVignette02Tree"
              alt={
                lang === 'hi'
                  ? 'राजस्थान की पहाड़ियों के ऊपर लहराता हरा-भरा देशी वृक्ष का न्यूनतम जलरंग चित्र'
                  : 'Minimalist editorial watercolor vignette of a lush native Rajasthan tree above soft desert hills'
              }
              caption={
                lang === 'hi'
                  ? 'केवल पौधा लगाना नहीं—उसे सुरक्षित बड़ा पेड़ बनाना हमारा संकल्प है'
                  : 'Not just planting saplings—nurturing resilient native trees to maturity'
              }
              size="lg"
            />
          </div>
        </div>

        <OpenSkyHorizon variant="sandstone" fadeFrom="cream" heightClass="h-24 sm:h-32 md:h-40" />
      </section>

      {/* STICKY 10-SECTION ANCHOR NAVIGATION */}
      <MissionAnchorNav
        tabs={HARIT_ANCHOR_TABS}
        activeTab={activeTab}
        onSelect={scrollToSection}
        lang={lang}
        ariaLabel={lang === 'hi' ? 'हरित राजस्थान पेज सेक्शन' : 'Harit Rajasthan Page Sections'}
      />

      {/* ====================================================================
          SECTION 1: MISSION OVERVIEW
         ==================================================================== */}
      <section id="hr-overview" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <MinimalistEditorialHeader
            eyebrow={lang === 'hi' ? '01 · मिशन परिचय (Mission Overview)' : '01 · Mission Overview'}
            titleHi="हरित राजस्थान — गाँव-गाँव हरियाली और जलवायु सुरक्षा का संकल्प"
            titleEn="Harit Rajasthan — Why Village-Led Greening Matters Now"
            leadHi="तेज़ लू, घटते भू-जल और कम होते हरित आवरण के बीच राजस्थान के गाँवों को आज सबसे अधिक आवश्यकता देशी पेड़ों, छाया, मिट्टी की नमी और सामूहिक देखभाल की है। हरित राजस्थान अभियान इसी दीर्घकालिक भविष्य की नींव है।"
            leadEn="Across Rajasthan’s arid plains, extreme summer heat and receding groundwater make native tree cover a lifeline. Harit Rajasthan brings communities together to plant locally adapted species and care for them year after year."
            lang={lang}
          />

          <EditorialRealitiesGrid
            lang={lang}
            items={[
              {
                num: '01',
                titleHi: 'तेज़ लू और बढ़ता तापमान',
                titleEn: 'Intense Desert Heatwaves',
                descHi:
                  'सड़कों, स्कूलों और खेतों में छायादार देशी पेड़ों की कमी से गर्मी का प्रकोप हर वर्ष बढ़ रहा है।',
                descEn:
                  'Scarcity of mature shade trees along lanes, schools, and farms intensifies summer heat stress.',
              },
              {
                num: '02',
                titleHi: 'मिट्टी का कटाव और नमी की कमी',
                titleEn: 'Topsoil Erosion & Dryness',
                descHi:
                  'तेज़ आंधियों में बिना पेड़ों वाले खेतों की उपजाऊ ऊपरी मिट्टी उड़ जाती है—वृक्ष प्राकृतिक ढाल बनते हैं।',
                descEn:
                  'Unprotected fields lose fertile topsoil to hot winds; tree belts act as natural windbreaks.',
              },
              {
                num: '03',
                titleHi: 'पौधे लगाने के बाद देखभाल का अभाव',
                titleEn: 'Care Beyond Planting Day',
                descHi:
                  'कई अभियानों में पौधे तो लगते हैं पर पानी व सुरक्षा के बिना सूख जाते हैं—हम जीवितता (Survival) पर ज़ोर देते हैं।',
                descEn:
                  'Saplings fail without watering and tree guards; our model puts 2–3 year survival first.',
              },
              {
                num: '04',
                titleHi: 'जन-सहभागिता से स्थायी परिवर्तन',
                titleEn: 'Community-Owned Future',
                descHi:
                  'जब किसान, छात्र, पंचायत और हरित मित्र एक साथ जुड़ते हैं, तब हर गाँव स्वयं अपनी हरियाली का रक्षक बन जाता है।',
                descEn:
                  'When farmers, students, panchayats, and Harit Mitras co-own trees, green cover lasts for decades.',
              },
            ]}
          />
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: TREE PLANTATION CAMPAIGN (SPECIES + 5-STAGE LIFECYCLE)
         ==================================================================== */}
      <section id="hr-plantation" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <MinimalistEditorialHeader
            eyebrow={lang === 'hi' ? '02 · वृक्षारोपण अभियान (Tree Plantation Campaign)' : '02 · Tree Plantation Campaign'}
            titleHi="राजस्थान के अनुकूल देशी प्रजातियाँ और 5-चरणीय संरक्षण मॉडल"
            titleEn="Native Rajasthan Species & 5-Stage Tree Care Lifecycle"
            leadHi="विदेशी या अधिक पानी माँगने वाले पौधों के बजाय हम राजस्थान की मिट्टी में सदियों से पनपने वाली देशी, छायादार, फलदार और चारा प्रजातियों को प्राथमिकता देते हैं।"
            leadEn="Rather than water-hungry exotic plants, we prioritize hardy native Rajasthan trees that thrive in low rainfall while supporting soil, birds, and rural families."
            lang={lang}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NATIVE_SPECIES.map((sp, idx) => (
              <div key={sp.en} className="rounded-2xl bg-white border border-[#DFCFAF] p-5 space-y-2">
                <span className="text-xs font-bold text-[#5A7B3B] tabular-nums">
                  0{idx + 1} · {lang === 'hi' ? 'देशी प्रजाति' : 'Native Species'}
                </span>
                <h3 className={`text-base font-bold text-[#153E1E] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? sp.hi : sp.en}
                </h3>
                <p className={`text-xs text-[#3C4F42] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? sp.descHi : sp.descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <CircularMedallionJourney
              lang={lang}
              steps={[
                {
                  step: '01',
                  assetKey: 'medallionHarit',
                  titleHi: 'उपयुक्त स्थान व प्रजाति',
                  titleEn: 'Site & Native Species',
                  descHi: 'मिट्टी और पानी के अनुसार सही देशी पौधे और स्थान का चयन।',
                  descEn: 'Matching native trees to local soil, school yards, or farm bunds.',
                },
                {
                  step: '02',
                  assetKey: 'carbonPlantingHands',
                  titleHi: 'वैज्ञानिक पौधारोपण',
                  titleEn: 'Proper Pit & Planting',
                  descHi: 'जैविक खाद व उचित गड्ढे में मानसून-अनुकूल रोपण।',
                  descEn: 'Monsoon-timed planting with organic compost and firm root settling.',
                },
                {
                  step: '03',
                  assetKey: 'carbonTreeGuard',
                  titleHi: 'ट्री-गार्ड व सुरक्षा',
                  titleEn: 'Tree Guard Protection',
                  descHi: 'पशुओं व तेज़ हवा से बचाने हेतु स्थानीय ट्री-गार्ड या बाड़।',
                  descEn: 'Bamboo, thorn, or mesh tree guards shielding saplings from grazing.',
                },
                {
                  step: '04',
                  assetKey: 'carbonWateringCare',
                  titleHi: 'नियमित पानी व मल्चिंग',
                  titleEn: 'Watering & Mulching',
                  descHi: 'गर्मियों में सीमित पानी और मल्चिंग से जड़ों में नमी बनाए रखना।',
                  descEn: 'Scheduled summer watering and organic mulching during years 1–3.',
                },
                {
                  step: '05',
                  assetKey: 'medallionCarbon',
                  titleHi: 'जीवितता निगरानी',
                  titleEn: 'Survival Tracking',
                  descHi: 'स्थानीय हरित मित्र व समुदाय द्वारा पौधे की वृद्धि का नियमित फॉलो-अप।',
                  descEn: 'Ongoing follow-up by local Harit Mitras to ensure lasting survival.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: DISTRICT-WISE PLANTATION (5 FOCUS DISTRICTS + MAP)
         ==================================================================== */}
      <section id="hr-districts" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <MinimalistEditorialHeader
            eyebrow={lang === 'hi' ? '03 · जिलावार अभियान (District-wise Plantation)' : '03 · District-wise Plantation'}
            titleHi="राजस्थान के 5 प्रारंभिक फोकस जिले — भीलवाड़ा, चूरू, बीकानेर, फलोदी व जोधपुर"
            titleEn="5 Initial Focus Districts Across Rajasthan"
            leadHi="प्रथम चरण (Phase-1) में पाँच जिलों से संगठित अभियान शुरू किया जा रहा है। किसी भी जिले पर क्लिक कर उसका पूरा जिला अभियान विवरण, उद्देश्य और स्थानीय गतिविधि देखें।"
            leadEn="Phase-1 focuses on five priority districts—with scalable architecture ready to expand across all Rajasthan districts as local teams grow. Click any district to open its dedicated campaign view."
            lang={lang}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <RajasthanMap
                lang={lang}
                onSelectDistrict={(slug) => onNavigate(`/harit-rajasthan/${slug}`)}
              />
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveDistricts.map((d) => (
                <SpringCard
                  key={d.slug}
                  asButton
                  onClick={() => onNavigate(`/harit-rajasthan/${d.slug}`)}
                  className="bg-[#FCF8F0] rounded-2xl border border-[#DFCFAF] overflow-hidden text-left hover:border-[#6EB83A] flex flex-col justify-between"
                >
                  <SeamlessInlinePhoto
                    assetKey={d.imageKey}
                    alt={d.name.en}
                    className="h-28 w-full rounded-none"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <p className="text-[11px] font-semibold text-[#5A7B3B]">
                        {d.regionTag[lang]}
                      </p>
                      <h3 className="text-base font-bold text-[#153E1E] mt-0.5 font-hindi">
                        {d.name[lang]}
                      </h3>
                      <p className="text-xs text-[#445649] mt-1 line-clamp-2 leading-relaxed">
                        {d.introduction[lang]}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1B5A32] pt-1">
                      <span>{lang === 'hi' ? 'जिला अभियान देखें' : 'Open District Page'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </SpringCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4 & 5: FARMER PARTICIPATION + HARIT MITRA NETWORK
         ==================================================================== */}
      <section id="hr-farmers" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Section 4: Farmer Participation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <MinimalistEditorialHeader
                eyebrow={lang === 'hi' ? '04 · किसान सहभागिता (Farmer Participation)' : '04 · Farmer Participation'}
                titleHi="खेत की मेड़ पर वृक्षारोपण — किसान की मिट्टी, छाया और अतिरिक्त मजबूती"
                titleEn="Farm-Border Agroforestry Built Around Farmer Prosperity"
                leadHi="खेत की मेड़ों पर देशी और फलदार पेड़ लगाने से मुख्य फसल को बिना नुकसान पहुँचाए गर्म हवाओं से सुरक्षा, बेहतर मृदा नमी, फल, चारा और दीर्घकालिक पर्यावरणीय लाभ मिलता है।"
                leadEn="Planting native and fruit trees along farm bunds shields main crops from scorching desert winds, preserves soil moisture, and supplies fruit, shade, and fodder."
                lang={lang}
              />
              <ul className="space-y-2.5 text-sm text-[#2A3A30]">
                {[
                  {
                    hi: 'खेत की मेड़ व खाली भूमि के लिए उपयुक्त प्रजाति चयन में मार्गदर्शन।',
                    en: 'Guidance on spacing and native species that complement standing crops.',
                  },
                  {
                    hi: 'जमीन व पेड़ों का 100% अधिकार पूरी तरह किसान के पास सुरक्षित रहता है।',
                    en: '100% ownership of land and trees always remains strictly with the farmer.',
                  },
                  {
                    hi: 'प्रारंभिक पंजीकरण बिल्कुल सरल—कोई संवेदनशील भूमि दस्तावेज़ आवश्यक नहीं।',
                    en: 'Simple onboarding—no sensitive land papers collected during initial registration.',
                  },
                ].map((pt) => (
                  <li key={pt.en} className="flex items-start gap-2.5">
                    <Sprout className="w-4 h-4 text-[#2F6D26] shrink-0 mt-1" aria-hidden="true" />
                    <span className={lang === 'hi' ? 'font-hindi' : ''}>{pt[lang]}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => openJoinCategory('farmer')}
                className="spring-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#153E1E] text-white text-xs sm:text-sm font-bold hover:bg-[#1E562A] cursor-pointer"
              >
                <span>{lang === 'hi' ? 'किसान पंजीकरण फॉर्म खोलें' : 'Open Farmer Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <FloatingVignette
                assetKey="missionVignette05Organic"
                alt={lang === 'hi' ? 'हरित खेत और देशी पौधों का जलरंग चित्र' : 'Minimalist watercolor vignette of organic fields and native farm sprouts'}
                caption={
                  lang === 'hi'
                    ? 'मेड़ पर वृक्षारोपण से खेत की मिट्टी में नमी और उर्वरता बढ़ती है'
                    : 'Border trees conserve field moisture and strengthen soil health'
                }
                size="md"
              />
            </div>
          </div>

          {/* Section 5: Harit Mitra Network */}
          <div
            id="hr-harit-mitra"
            className="scroll-mt-32 pt-12 border-t border-[#DFCFAF] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <img
                src={GENERATED_ASSETS.carbonHaritMitraPortrait}
                alt={lang === 'hi' ? 'हरित मित्र स्वयंसेवक समन्वयक' : 'Harit Mitra community coordinator'}
                referrerPolicy="no-referrer"
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-2 border-[#DFCFAF]"
              />
              <p className="mt-3 text-xs font-semibold text-[#5A7B3B]">
                {lang === 'hi' ? 'स्वैच्छिक ग्राम समन्वयक · सवेतन नौकरी नहीं' : 'Voluntary Community Role · Not Paid Employment'}
              </p>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <MinimalistEditorialHeader
                eyebrow={lang === 'hi' ? '05 · हरित मित्र नेटवर्क (Harit Mitra Registration)' : '05 · Harit Mitra Network'}
                titleHi="हरित मित्र — गाँव और प्रकृति के बीच जन-सेतु"
                titleEn="Harit Mitra — Local Champions Guiding Village Plantations"
                leadHi="हरित मित्र अपने गाँव, वार्ड या तहसील में किसानों, युवाओं और स्कूलों को वृक्षारोपण, पौधा देखभाल और जल संरक्षण के लिए प्रेरित करने वाले स्वैच्छिक सामुदायिक सहयोगी हैं।"
                leadEn="Harit Mitras are voluntary local stewards who coordinate village awareness, encourage sapling survival care, and connect farmers and students with district green drives."
                lang={lang}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#2A3A30]">
                {[
                  { hi: 'गाँव में किसानों व युवाओं से सीधा संवाद', en: 'Direct local outreach with farmers & youth' },
                  { hi: 'पौधों की देखभाल व जीवितता के लिए प्रेरित करना', en: 'Encouraging tree guards & regular watering' },
                  { hi: 'स्कूल, पंचायत व स्वच्छता अभियानों में सहयोग', en: 'Supporting school & panchayat green drives' },
                  { hi: 'प्रशिक्षण व जागरूकता कार्यशालाओं में भागीदारी', en: 'Joining orientation & skill workshops' },
                ].map((pt) => (
                  <div key={pt.en} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4B8E27] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className={lang === 'hi' ? 'font-hindi' : ''}>{pt[lang]}</span>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => openJoinCategory('harit-mitra')}
                  className="spring-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#153E1E] text-white text-xs sm:text-sm font-bold hover:bg-[#1E562A] cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'हरित मित्र पंजीकरण करें' : 'Register as Harit Mitra'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6 & 7: INSTITUTIONS (SCHOOLS/COLLEGES/UNIVERSITIES) + CSR
         ==================================================================== */}
      <section id="hr-institutions" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Section 6: School, College & University Participation */}
            <div className="rounded-3xl bg-[#FCF8F0] border border-[#DFCFAF] p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.14em] text-[#2F6D26]">
                  <GraduationCap className="w-4 h-4" aria-hidden="true" />
                  <span>{lang === 'hi' ? '06 · शिक्षण संस्थान सहभागिता' : '06 · School, College & University Participation'}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#153E1E] font-hindi leading-snug">
                  {lang === 'hi'
                    ? 'स्कूल, कॉलेज एवं विश्वविद्यालय — हरित परिसर और छात्र नेतृत्व'
                    : 'Green Campuses, Eco-Clubs & Student Tree Adoption'}
                </h2>
                <p className={`text-xs sm:text-sm text-[#35463A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi'
                    ? 'जब विद्यार्थी अपने परिसर में एक पौधा लगाकर पूरे वर्ष उसकी देखभाल करते हैं, तो पर्यावरण प्रेम जीवन भर की आदत बन जाता है। स्कूल-कॉलेज ग्रीन कैंपस, छात्र इको-क्लब और GOVEDA हरित मैराथन में सहभागी बन सकते हैं।'
                    : 'When students plant and adopt a native sapling through the academic year, environmental stewardship becomes a lifelong habit. Institutions can host green-campus drives, eco-clubs, and join the GOVEDA Harit Marathon.'}
                </p>
                <ul className="space-y-1.5 text-xs text-[#2B3D31] pt-1">
                  <li className="flex items-center gap-2">
                    <Trees className="w-3.5 h-3.5 text-[#4B8E27] shrink-0" />
                    <span>{lang === 'hi' ? 'प्रत्येक कक्षा द्वारा पौधा गोद लेने की प्रणाली' : 'Classroom-level sapling adoption & care logs'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-[#4B8E27] shrink-0" />
                    <span>{lang === 'hi' ? 'परिसर में वर्षा जल संचयन व प्लास्टिक-मुक्ति संवाद' : 'Campus rainwater harvesting & plastic-free pledges'}</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => openJoinCategory('school-college')}
                  className="spring-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#153E1E] text-white text-xs font-bold cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'संस्थान पंजीकरण करें' : 'Institutional Registration'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/harit-marathon')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#DFCFAF] text-[#153E1E] text-xs font-bold hover:border-[#6EB83A] cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'हरित मैराथन देखें' : 'Harit Marathon'}</span>
                </button>
              </div>
            </div>

            {/* Section 7: Corporate & CSR Partnership */}
            <div
              id="hr-csr"
              className="scroll-mt-32 rounded-3xl bg-[#FCF8F0] border border-[#DFCFAF] p-6 sm:p-8 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.14em] text-[#2F6D26]">
                  <Handshake className="w-4 h-4" aria-hidden="true" />
                  <span>{lang === 'hi' ? '07 · कॉर्पोरेट एवं CSR साझेदारी' : '07 · Corporate & CSR Partnership'}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#153E1E] font-hindi leading-snug">
                  {lang === 'hi'
                    ? 'कंपनियों, ट्रस्टों और संस्थाओं के लिए पारदर्शी हरित सहयोग'
                    : 'Transparent Corporate, CSR & Institutional Greening'}
                </h2>
                <p className={`text-xs sm:text-sm text-[#35463A] leading-relaxed ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi'
                    ? 'जिम्मेदार कंपनियाँ और सामाजिक ट्रस्ट किसी गाँव, स्कूल परिसर, गौशाला नर्सरी या जिला वृक्षारोपण ब्लॉक को गोद लेकर स्थानीय ट्री-गार्ड, सिंचाई सहायता और पारदर्शी जीवितता रिपोर्टिंग के माध्यम से स्थायी प्रभाव बना सकते हैं।'
                    : 'Responsible companies and foundations can support village nurseries, tree guards, school green campuses, or district agroforestry clusters with clear milestones and honest survival reporting.'}
                </p>
                <ul className="space-y-1.5 text-xs text-[#2B3D31] pt-1">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4B8E27] shrink-0" />
                    <span>{lang === 'hi' ? 'केवल सत्यापित फील्ड प्रगति और पारदर्शी उपयोग विवरण' : 'Verified field documentation & transparent reporting'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#4B8E27] shrink-0" />
                    <span>{lang === 'hi' ? 'भीलवाड़ा, चूरू, बीकानेर, फलोदी व जोधपुर में जिला विकल्प' : 'Focused district tracks across Rajasthan'}</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => openJoinCategory('csr-partner')}
                  className="spring-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#153E1E] text-white text-xs font-bold cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'CSR साझेदारी फॉर्म खोलें' : 'CSR Partnership Form'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/partnership')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#DFCFAF] text-[#153E1E] text-xs font-bold hover:border-[#6EB83A] cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'विस्तृत साझेदारी पेज' : 'Partnership Hub'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 8: PLANTATION & CARBON CREDIT AWARENESS (ZERO GUARANTEES!)
         ==================================================================== */}
      <section id="hr-carbon" className="scroll-mt-32 bg-[#FCF8F0] py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <MinimalistEditorialHeader
                eyebrow={lang === 'hi' ? '08 · वृक्षारोपण एवं कार्बन क्रेडिट जागरूकता' : '08 · Plantation & Carbon Credit Awareness'}
                titleHi="वृक्षारोपण और कार्बन क्रेडिट — संभावनाएँ व ईमानदार प्रक्रिया"
                titleEn="How Tree Plantation Relates to Carbon Credit Standards"
                leadHi="बड़े पैमाने पर संगठित देशी वृक्षारोपण और कृषि-वानिकी से भविष्य में कार्बन क्रेडिट परियोजनाओं की संभावना बन सकती है, लेकिन इसके लिए कई वर्षों की वैज्ञानिक निगरानी (MRV), भूमि पात्रता और स्वतंत्र ऑडिट अनिवार्य होता है।"
                leadEn="Well-documented agroforestry clusters can explore structured carbon credit pathways over time, provided strict land eligibility, Baseline, Additionality, multi-year MRV, and independent third-party verification are met."
                lang={lang}
              />

              <HonestSafeguardBox
                lang={lang}
                titleHi="स्पष्ट चेतावनी: कार्बन क्रेडिट की कोई गारंटी नहीं दी जाती"
                titleEn="Strict Disclosure: Zero Carbon Credit Guarantee"
                points={[
                  {
                    hi: 'वृक्षारोपण का पहला और सबसे बड़ा लाभ स्वच्छ हवा, छाया, उपजाऊ मिट्टी, भू-जल संरक्षण और फल-चारा है।',
                    en: 'The primary and immediate reward of planting native trees is cooler air, richer soil, water recharge, fruit, and fodder.',
                  },
                  {
                    hi: 'कार्बन क्रेडिट या उससे किसी निश्चित आय की कोई गारंटी नहीं दिखाई जाती—यह पूर्णतः अलग वैज्ञानिक मानकों, जीवित दर, स्वतंत्र सत्यापन और बाज़ार स्थितियों पर निर्भर करता है।',
                    en: 'No carbon credit issuance or guaranteed income is promised; eligibility and outcomes depend strictly on accredited methodologies, survival rates, independent audits, and market conditions.',
                  },
                ]}
              />

              <button
                type="button"
                onClick={() => onNavigate('/missions/carbon-credit')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#153E1E] hover:text-[#2F6D26] cursor-pointer"
              >
                <span>
                  {lang === 'hi'
                    ? 'मिशन 01: कार्बन क्रेडिट की पूरी 10-चरणीय वैज्ञानिक प्रक्रिया समझें'
                    : 'Read Mission 01: Complete 10-Step Carbon Credit Guide'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <FloatingVignette
                assetKey="vignetteCarbonBalance"
                alt={lang === 'hi' ? 'कार्बन संतुलन तराज़ू का जलरंग चित्र' : 'Minimalist watercolor balance scale comparing CO2 and native sapling'}
                caption={
                  lang === 'hi'
                    ? 'कार्बन क्रेडिट केवल स्वतंत्र वैज्ञानिक सत्यापन के बाद ही संभव हो सकते हैं'
                    : 'Carbon credits are only possible after independent scientific verification'
                }
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 9: PHOTO GALLERY, VERIFIED METRICS & CAMPAIGN UPDATES
         ==================================================================== */}
      <section id="hr-gallery" className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#DFCFAF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <MinimalistEditorialHeader
            eyebrow={lang === 'hi' ? '09 · प्रगति रिपोर्ट एवं अभियान अपडेट्स' : '09 · Photo Gallery & Verified Campaign Progress'}
            titleHi="पारदर्शी प्रगति और जमीनी गतिविधियाँ"
            titleEn="Verified Progress Metrics & Field Updates"
            leadHi="हरित राजस्थान से जुड़े केवल सत्यापित प्रगति आँकड़े, क्षेत्रीय गतिविधियाँ और अभियान अपडेट्स यहाँ पारदर्शी रूप से प्रकाशित किए जाते हैं।"
            leadEn="Only verified ground figures, district milestones, and published field updates appear below."
            lang={lang}
          />

          {/* Live Admin-Controlled Verified Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { key: 'districts_in_focus', hi: 'फोकस जिले', en: 'Focus Districts' },
              { key: 'village_campaigns', hi: 'ग्राम अभियान', en: 'Village Campaigns' },
              { key: 'plantation_sites', hi: 'वृक्षारोपण स्थल', en: 'Plantation Sites' },
              { key: 'trees_surviving', hi: 'जीवित वृक्ष', en: 'Trees Surviving' },
              { key: 'harit_mitras', hi: 'हरित मित्र', en: 'Harit Mitras' },
              { key: 'water_initiatives', hi: 'जल पहल', en: 'Water Initiatives' },
            ].map((m) => {
              const matched = (bootstrap?.impactMetrics ?? []).find(
                (im) => im.metricKey === m.key || im.labelEn.toLowerCase() === m.en.toLowerCase()
              );
              const displayVal =
                matched && matched.isPublished
                  ? matched.verifiedValue.toLocaleString('en-IN')
                  : '—';
              return (
                <div
                  key={m.key}
                  className="rounded-2xl bg-[#FCF8F0] border border-[#DFCFAF] p-4 text-center"
                >
                  <p className="text-xl sm:text-2xl font-extrabold text-[#153E1E] tabular-nums">
                    {displayVal}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#445649] font-hindi">
                    {lang === 'hi' ? m.hi : m.en}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4C6051]">
            <ShieldCheck className="w-4 h-4 text-[#2F6D26] shrink-0" aria-hidden="true" />
            <span>
              {lang === 'hi'
                ? 'नोट: केवल सत्यापित (Verified) प्रगति आँकड़े ही Admin Panel से स्वीकृति के बाद प्रकाशित होते हैं—कोई काल्पनिक संख्या नहीं दिखाई जाती।'
                : 'Transparency Policy: Only Admin-verified field metrics are displayed—never inflated or unverified estimates.'}
            </span>
          </div>

          {/* Ground Campaign Highlights & Admin-Published Updates */}
          {haritUpdates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {haritUpdates.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#DFCFAF] bg-[#FCF8F0] p-5 space-y-2.5"
                >
                  {item.mediaUrl && (
                    <img
                      src={item.mediaUrl}
                      alt={item.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover rounded-xl"
                    />
                  )}
                  <p className="text-[11px] font-bold text-[#5A7B3B]">{item.categoryTag}</p>
                  <h3 className="text-base font-bold text-[#153E1E]">
                    {lang === 'hi' && item.titleHi ? item.titleHi : item.titleEn}
                  </h3>
                  <p className="text-xs text-[#3C4F42] leading-relaxed">
                    {lang === 'hi' && item.summaryHi ? item.summaryHi : item.summaryEn}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Ground Activity Visual Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { img: 'missionPhoto02' as const, hi: 'ग्रामीण वृक्षारोपण', en: 'Village Plantation' },
              { img: 'missionPhoto05' as const, hi: 'खेत मेड़ कृषि-वानिकी', en: 'Farm Agroforestry' },
              { img: 'missionPhoto08' as const, hi: 'स्कूल ग्रीन कैंपस', en: 'Green Campuses' },
              { img: 'missionPhoto03' as const, hi: 'गौशाला नर्सरी', en: 'Gaushala Nurseries' },
              { img: 'missionPhoto06' as const, hi: 'जल संरक्षण व कुंड', en: 'Water Conservation' },
              { img: 'haritMarathon' as const, hi: 'हरित मैराथन जागरूकता', en: 'Harit Marathon' },
            ].map((tile) => (
              <div
                key={tile.en}
                className="rounded-2xl border border-[#DFCFAF] bg-[#FCF8F0] overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={GENERATED_ASSETS[tile.img]}
                    alt={lang === 'hi' ? tile.hi : tile.en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="p-2.5 text-xs font-bold text-[#153E1E] text-center font-hindi">
                  {lang === 'hi' ? tile.hi : tile.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 10: JOIN THE MISSION (5 REGISTRATION TRACKS + FAQs + HORIZON)
         ==================================================================== */}
      <section id="hr-join" className="scroll-mt-32 bg-[#FCF8F0] pt-14 sm:pt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <MinimalistEditorialHeader
            eyebrow={lang === 'hi' ? '10 · अभियान से जुड़ें (Join the Mission)' : '10 · Join the Mission'}
            titleHi="हरित राजस्थान में अपनी भूमिका चुनें और अभी पंजीकरण करें"
            titleEn="Choose Your Role & Register Directly Below"
            leadHi="सभी पंजीकरण सीधे GOVEDA के Admin Panel में सुरक्षित होते हैं और आपको तुरंत एक लाइव आवेदन संदर्भ संख्या (Reference Number) प्राप्त होती है।"
            leadEn="Every submission is saved securely to the GOVEDA Admin Panel and generates an instant live reference number for tracking."
            lang={lang}
          />

          {/* 5 Quick Role Selector Buttons matching Client Brief */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { cat: 'harit-mitra', hi: 'हरित मित्र बनें (Harit Mitra)', en: 'Join as Harit Mitra' },
                { cat: 'farmer', hi: 'किसान पंजीकरण (Farmer)', en: 'Farmer Registration' },
                { cat: 'school-college', hi: 'शिक्षण संस्थान (Institutional)', en: 'Institutional Partnership' },
                { cat: 'csr-partner', hi: 'CSR साझेदारी (CSR)', en: 'CSR Partnership' },
                { cat: 'volunteer', hi: 'स्वयंसेवक (Volunteer)', en: 'Volunteer Registration' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.cat}
                type="button"
                onClick={() => openJoinCategory(btn.cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portalCategory === btn.cat
                    ? 'bg-[#153E1E] text-white'
                    : 'bg-white text-[#153E1E] border border-[#DFCFAF] hover:border-[#6EB83A]'
                }`}
              >
                {lang === 'hi' ? btn.hi : btn.en}
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-white border border-[#DFCFAF] p-4 sm:p-6">
            <RegistrationPortal
              key={`${portalCategory}-${portalFocusKey}`}
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory={portalCategory}
              allowedCategories={[
                'harit-mitra',
                'farmer',
                'school-college',
                'csr-partner',
                'volunteer',
              ]}
            />
          </div>

          {/* Practical FAQs */}
          <div className="pt-6 space-y-6">
            <MinimalistEditorialHeader
              eyebrow={lang === 'hi' ? 'सामान्य प्रश्न (FAQs)' : 'Frequently Asked Questions'}
              titleHi="हरित राजस्थान से जुड़े सामान्य प्रश्न"
              titleEn="Common Questions About Harit Rajasthan"
              lang={lang}
            />
            <MissionFaqAccordion faqs={HARIT_FAQS} lang={lang} />
          </div>

          {/* Phase-1 Expandable Architecture Note */}
          <div className="flex items-start gap-2.5 text-xs text-[#4C6051] pt-2">
            <AlertCircle className="w-4 h-4 text-[#5A7B3B] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              {lang === 'hi'
                ? 'Phase-1 एकीकृत संरचना: भविष्य में किसी भी जिले या अभियान की गतिविधियाँ बढ़ने पर बिना वेबसाइट दोबारा बनाए नए समर्पित Sub-Pages स्वतः जोड़े जा सकते हैं।'
                : 'Phase-1 Modular Architecture: Dedicated sub-pages for new districts or local drives can be expanded seamlessly without rebuilding the portal.'}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <OpenSkyHorizon variant="fort" fadeFrom="cream" heightClass="h-24 sm:h-36 md:h-44" />
        </div>
      </section>
    </div>
  );
}
