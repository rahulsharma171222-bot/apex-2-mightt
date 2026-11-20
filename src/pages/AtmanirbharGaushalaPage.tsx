import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import { RegistrationPortal } from '../components/RegistrationForms';
import {
  MinimalistEditorialHeader,
  MissionAnchorNav,
  MissionFaqAccordion,
} from '../components/MinimalistMissionPrimitives';
import {
  GaushalaArtisticHero,
  GaushalaWhyOriginalShowcase,
  GaushalaRadialEcosystem,
  GaushalaStepByStepRoadmap,
  GaushalaAnnotatedDioramaStage,
  GaushalaLivingSoilShowcase,
  GaushalaSlicedLivelihoodStrip,
  GaushalaProductsArtisanShowcase,
  GaushalaWhyJoinIllustrated,
  GaushalaTenActivitiesShowcase,
  GaushalaPartnerMeadowBanner,
  type AnnotatedLandmark,
} from '../components/GaushalaArtisticSections';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import {
  GAUSHALA_ANCHOR_TABS,
  GAUSHALA_CIRCULAR_STEPS,
  GAUSHALA_GOVT_SCHEMES,
  GAUSHALA_PROCUREMENT_TIERS,
  GAUSHALA_BIOGAS_SCALES,
  GAUSHALA_DAIRY_PRODUCTS,
  GAUSHALA_MARKET_CHANNELS,
  GAUSHALA_INFRA_PILLARS,
  GAUSHALA_FAQS,
} from '../data/gaushalaCatalogData';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { Language, RegistrationRecord } from '../types/goveda';

interface AtmanirbharGaushalaPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

/** Calm unboxed hairline disclosure note */
function CalmHonestNote({
  label,
  text,
  tone = 'green',
  lang,
}: {
  label: string;
  text: string;
  tone?: 'green' | 'amber';
  lang: Language;
}) {
  return (
    <div className="pt-5 border-t border-[#DCD3BE] flex items-start gap-3 max-w-4xl">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          tone === 'amber'
            ? 'bg-[#FFF3E0] text-[#9A5312]'
            : 'bg-[#EEF6E7] text-[#236B30]'
        }`}
      >
        {tone === 'amber' ? (
          <Flame className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
        )}
      </div>
      <p
        className={`text-[13px] sm:text-[13.5px] text-[#35463A] leading-[1.72] ${
          lang === 'hi' ? 'font-hindi' : ''
        }`}
      >
        <strong className="text-[#153E1E] font-bold">{label}: </strong>
        {text}
      </p>
    </div>
  );
}

/* ============================================================================
   EXACT ANNOTATED LANDMARK COORDINATES FOR EACH LIVING DIORAMA
   (1000×560 SVG coordinate space aligned with each 16:9 watercolor artwork)
   ============================================================================ */
const DUNG_HUB_LANDMARKS: AnnotatedLandmark[] = [
  {
    id: 'dung-1',
    badge: '1',
    titleHi: GAUSHALA_PROCUREMENT_TIERS[0].titleHi,
    titleEn: GAUSHALA_PROCUREMENT_TIERS[0].titleEn,
    descHi: GAUSHALA_PROCUREMENT_TIERS[0].descHi,
    descEn: GAUSHALA_PROCUREMENT_TIERS[0].descEn,
    imgPinPct: [24, 58],
    desktopBoxStyle: { top: '4%', left: '0%', width: '250px' },
    desktopLineFrom: [215, 128],
    desktopDot: [330, 315],
    accent: '#8E531A',
  },
  {
    id: 'dung-2',
    badge: '2',
    titleHi: 'छाया में केंचुआ खाद और सही तौल',
    titleEn: 'Shaded Compost Beds & Honest Weighing',
    descHi: 'सबसे पहले गौशाला की अपनी खाद तैयार होती है और हर बोरी का साफ वजन रजिस्टर में लिखा जाता है।',
    descEn: 'First, clean vermicompost is prepared right on site with every bag weighed and recorded.',
    imgPinPct: [52, 57],
    desktopBoxStyle: { bottom: '2%', left: '16%', width: '265px' },
    desktopLineFrom: [390, 442],
    desktopDot: [510, 325],
    accent: '#236B30',
  },
  {
    id: 'dung-3',
    badge: '3',
    titleHi: GAUSHALA_PROCUREMENT_TIERS[1].titleHi,
    titleEn: GAUSHALA_PROCUREMENT_TIERS[1].titleEn,
    descHi: GAUSHALA_PROCUREMENT_TIERS[1].descHi,
    descEn: GAUSHALA_PROCUREMENT_TIERS[1].descEn,
    imgPinPct: [79, 58],
    desktopBoxStyle: { top: '4%', right: '0%', width: '255px' },
    desktopLineFrom: [785, 138],
    desktopDot: [695, 315],
    accent: '#2F7D32',
  },
  {
    id: 'dung-4',
    badge: '4',
    titleHi: GAUSHALA_PROCUREMENT_TIERS[2].titleHi,
    titleEn: GAUSHALA_PROCUREMENT_TIERS[2].titleEn,
    descHi: GAUSHALA_PROCUREMENT_TIERS[2].descHi,
    descEn: GAUSHALA_PROCUREMENT_TIERS[2].descEn,
    imgPinPct: [71, 74],
    desktopBoxStyle: { bottom: '2%', right: '0%', width: '265px' },
    desktopLineFrom: [750, 446],
    desktopDot: [640, 385],
    accent: '#5A7B3B',
  },
];

const BIOGAS_LANDMARKS: AnnotatedLandmark[] = [
  {
    id: 'bio-1',
    badge: '1',
    titleHi: 'गोबर और बराबर पानी मिलाना',
    titleEn: 'Mix Fresh Dung & Water',
    descHi: 'गायों का ताज़ा गोबर और बराबर पानी ईंट के छोटे टैंक में घोलकर अंदर भेजा जाता है।',
    descEn: 'Fresh cow dung is mixed with equal water in the brick inlet tank before entering the dome.',
    imgPinPct: [30, 58],
    desktopBoxStyle: { bottom: '4%', left: '0%', width: '245px' },
    desktopLineFrom: [238, 438],
    desktopDot: [368, 330],
    accent: '#8E531A',
  },
  {
    id: 'bio-2',
    badge: '2',
    titleHi: 'बंद गुंबद में बनती है शुद्ध गैस',
    titleEn: 'Sealed Dome Creates Clean Gas',
    descHi: 'हवा के बिना अंदर प्राकृतिक रूप से मीथेन गैस बनती है — कोई बदबू या धुआँ नहीं फैलता।',
    descEn: 'Inside the sealed underground dome, natural biogas rises cleanly with zero odour or smoke.',
    imgPinPct: [55, 43],
    desktopBoxStyle: { top: '2%', left: '34%', width: '255px' },
    desktopLineFrom: [492, 108],
    desktopDot: [534, 248],
    accent: '#2E7D32',
  },
  {
    id: 'bio-3',
    badge: '3',
    titleHi: 'रसोई में नीली धुआँ-रहित लौ',
    titleEn: 'Smokeless Blue Kitchen Flame',
    descHi: 'ऊपर पाइप से सीधे गौशाला की रसोई या चारा मशीन को गैस मिलती है — लकड़ी और सिलेंडर बचते हैं।',
    descEn: 'Piped directly to the shelter kitchen stove or chaff cutter—cutting firewood and LPG bills.',
    imgPinPct: [84, 30],
    desktopBoxStyle: { top: '4%', right: '0%', width: '245px' },
    desktopLineFrom: [770, 128],
    desktopDot: [722, 202],
    accent: '#1E6B99',
  },
  {
    id: 'bio-4',
    badge: '4',
    titleHi: 'खेतों के लिए ताकतवर स्लरी खाद',
    titleEn: 'Rich Bio-Slurry for Crops',
    descHi: 'नीचे पाइप से निकलने वाली गाढ़ी तरल खाद सीधे सब्ज़ियों, नर्सरी और खेतों की उपज बढ़ाती है।',
    descEn: 'Nutrient-rich liquid slurry flows out the outlet straight into vegetable beds and village farms.',
    imgPinPct: [72, 65],
    desktopBoxStyle: { bottom: '4%', right: '0%', width: '255px' },
    desktopLineFrom: [755, 442],
    desktopDot: [652, 355],
    accent: '#4B8A2A',
  },
];

const PRODUCTS_CRAFT_LANDMARKS: AnnotatedLandmark[] = [
  {
    id: 'prod-diya',
    badge: '1',
    titleHi: 'पूजा के गोबर दीये',
    titleEn: 'Eco Diwali Diyas',
    descHi: 'दीपावली पर जलने के बाद मिट्टी में घुलकर पौधों की खाद बन जाते हैं।',
    descEn: 'Glow warmly for festivals and dissolve back into garden soil afterward.',
    imgPinPct: [14, 61],
    desktopBoxStyle: { top: '8%', left: '0%', width: '210px' },
    desktopLineFrom: [160, 148],
    desktopDot: [265, 340],
    accent: '#B45D18',
  },
  {
    id: 'prod-pot',
    badge: '2',
    titleHi: 'गोबर के नर्सरी गमले',
    titleEn: 'Biodegradable Sapling Pots',
    descHi: 'प्लास्टिक थैली की छुट्टी — पौधे को गमले सहित सीधे ज़मीन में लगाएँ।',
    descEn: 'Replaces plastic nursery bags—plant the entire pot directly in the earth.',
    imgPinPct: [33, 48],
    desktopBoxStyle: { bottom: '2%', left: '12%', width: '230px' },
    desktopLineFrom: [295, 452],
    desktopDot: [392, 326],
    accent: '#236B30',
  },
  {
    id: 'prod-dhoop',
    badge: '3',
    titleHi: 'हर्बल धूप व मच्छर कॉइल',
    titleEn: 'Herbal Dhoop & Neem Coils',
    descHi: 'बिना कोयले और बिना केमिकल के — मंदिरों व घरों में रोज़ की मांग।',
    descEn: 'Charcoal-free herbal dhoop cones and neem coils loved in homes & temples.',
    imgPinPct: [51, 60],
    desktopBoxStyle: { top: '2%', left: '38%', width: '235px' },
    desktopLineFrom: [502, 114],
    desktopDot: [512, 324],
    accent: '#7A4F26',
  },
  {
    id: 'prod-wood',
    badge: '4',
    titleHi: 'गौ-काष्ठ (गोबर की लकड़ी)',
    titleEn: 'Tree-Saving Gau-Kashth Logs',
    descHi: 'जंगल के पेड़ बचाकर होलिका, हवन व भट्ठियों के लिए स्वच्छ ईंधन।',
    descEn: 'Clean cow-dung logs replacing firewood for crematoria, hawan & kilns.',
    imgPinPct: [67, 58],
    desktopBoxStyle: { bottom: '2%', right: '14%', width: '235px' },
    desktopLineFrom: [690, 452],
    desktopDot: [614, 336],
    accent: '#5A7B3B',
  },
  {
    id: 'prod-paint',
    badge: '5',
    titleHi: 'प्राकृतिक दीवार पेंट',
    titleEn: 'Cooling Natural Wall Paint',
    descHi: 'राजस्थान की गर्मी में कमरों को ठंडा रखने वाला बिना-केमिकल देसी पेंट।',
    descEn: 'Non-toxic cow-dung emulsion that keeps rooms cooler in hot summers.',
    imgPinPct: [85, 58],
    desktopBoxStyle: { top: '8%', right: '0%', width: '215px' },
    desktopLineFrom: [840, 148],
    desktopDot: [735, 332],
    accent: '#9A5312',
  },
];

const WELFARE_LANDMARKS: AnnotatedLandmark[] = [
  {
    id: 'wel-1',
    badge: '1',
    titleHi: GAUSHALA_INFRA_PILLARS[0].titleHi,
    titleEn: GAUSHALA_INFRA_PILLARS[0].titleEn,
    descHi: GAUSHALA_INFRA_PILLARS[0].descHi,
    descEn: GAUSHALA_INFRA_PILLARS[0].descEn,
    imgPinPct: [34, 31],
    desktopBoxStyle: { top: '2%', left: '0%', width: '250px' },
    desktopLineFrom: [235, 118],
    desktopDot: [396, 200],
    accent: '#8E531A',
  },
  {
    id: 'wel-2',
    badge: '2',
    titleHi: GAUSHALA_INFRA_PILLARS[1].titleHi,
    titleEn: GAUSHALA_INFRA_PILLARS[1].titleEn,
    descHi: GAUSHALA_INFRA_PILLARS[1].descHi,
    descEn: GAUSHALA_INFRA_PILLARS[1].descEn,
    imgPinPct: [48, 70],
    desktopBoxStyle: { bottom: '2%', left: '8%', width: '260px' },
    desktopLineFrom: [325, 452],
    desktopDot: [488, 378],
    accent: '#1E6B99',
  },
  {
    id: 'wel-3',
    badge: '3',
    titleHi: GAUSHALA_INFRA_PILLARS[2].titleHi,
    titleEn: GAUSHALA_INFRA_PILLARS[2].titleEn,
    descHi: GAUSHALA_INFRA_PILLARS[2].descHi,
    descEn: GAUSHALA_INFRA_PILLARS[2].descEn,
    imgPinPct: [64, 57],
    desktopBoxStyle: { bottom: '2%', right: '0%', width: '260px' },
    desktopLineFrom: [755, 448],
    desktopDot: [596, 326],
    accent: '#236B30',
  },
  {
    id: 'wel-4',
    badge: '4',
    titleHi: GAUSHALA_INFRA_PILLARS[3].titleHi,
    titleEn: GAUSHALA_INFRA_PILLARS[3].titleEn,
    descHi: GAUSHALA_INFRA_PILLARS[3].descHi,
    descEn: GAUSHALA_INFRA_PILLARS[3].descEn,
    imgPinPct: [68, 42],
    desktopBoxStyle: { top: '2%', right: '0%', width: '250px' },
    desktopLineFrom: [765, 118],
    desktopDot: [618, 245],
    accent: '#4B8A2A',
  },
];

const DAIRY_LANDMARKS: AnnotatedLandmark[] = [
  {
    id: 'dairy-1',
    badge: '1',
    titleHi: 'पहले बछड़े का पूरा हक',
    titleEn: 'The Calf Always Drinks First',
    descHi: 'हर गाय के बछड़े को पूरा दूध मिलने के बाद ही अतिरिक्त दूध निकाला जाता है।',
    descEn: 'Calves always drink their full share naturally before any surplus milk is collected.',
    imgPinPct: [28, 57],
    desktopBoxStyle: { top: '4%', left: '0%', width: '245px' },
    desktopLineFrom: [210, 134],
    desktopDot: [358, 322],
    accent: '#8E531A',
  },
  {
    id: 'dairy-2',
    badge: '2',
    titleHi: 'मिट्टी की मटकी व बिलोना घी',
    titleEn: 'Earthen Curd & Bilona Ghee',
    descHi: 'पूरे दूध का दही जमाकर लकड़ी की मथानी से मक्खन और शुद्ध बिलोना घी बनता है।',
    descEn: 'Whole milk is cultured in clay pots and hand-churned with a wooden bilona into pure ghee.',
    imgPinPct: [68, 51],
    desktopBoxStyle: { top: '2%', right: '18%', width: '245px' },
    desktopLineFrom: [680, 114],
    desktopDot: [618, 294],
    accent: '#B45D18',
  },
  {
    id: 'dairy-3',
    badge: '3',
    titleHi: 'शुद्ध ताज़ा दूध व छाछ',
    titleEn: 'Fresh Milk, Curd & Buttermilk',
    descHi: 'साफ बर्तन व ठंडे भंडारण से आसपास के परिवारों तक शुद्ध देसी दूध-छाछ पहुँचती है।',
    descEn: 'Hygienically chilled surplus milk and fresh spiced buttermilk for local families.',
    imgPinPct: [79, 76],
    desktopBoxStyle: { bottom: '2%', left: '22%', width: '250px' },
    desktopLineFrom: [465, 466],
    desktopDot: [686, 398],
    accent: '#236B30',
  },
  {
    id: 'dairy-4',
    badge: '4',
    titleHi: 'साफ पैकिंग व FSSAI नियम',
    titleEn: 'Clean Packing & FSSAI Hygiene',
    descHi: 'जहाँ अतिरिक्त दूध उपलब्ध हो, वहाँ FSSAI पंजीकरण व पूरी सफाई के साथ बिक्री।',
    descEn: 'All dairy items follow strict hygiene and FSSAI food-safety standards where sold.',
    imgPinPct: [88, 69],
    desktopBoxStyle: { bottom: '6%', right: '0%', width: '235px' },
    desktopLineFrom: [818, 428],
    desktopDot: [744, 366],
    accent: '#4B8A2A',
  },
];

const BUYER_MEDALLIONS: AssetKey[] = [
  'medallionOrganic',
  'vignetteGaushalaEcoProducts',
  'medallionHeritage',
  'vignetteCleanClothbag',
];

export function AtmanirbharGaushalaPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: AtmanirbharGaushalaPageProps) {
  const [activeTab, setActiveTab] = useState<string>('gs-why');
  const [showTenWorkIndex, setShowTenWorkIndex] = useState<boolean>(false);
  const { bootstrap } = usePublicPortal();

  const missionUpdates = (bootstrap?.contentItems ?? []).filter(
    (item) =>
      item.status === 'Published' && item.relatedMissionSlug === 'self-reliant-gaushala'
  );

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const ids = GAUSHALA_ANCHOR_TABS.map((t) => t.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveTab(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0.01 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const joinSteps = [
    {
      no: '1',
      titleHi: 'नीचे छोटा-सा फॉर्म भरें',
      titleEn: 'Fill the short form below',
      descHi: 'अपना नाम, गाँव-जिला, मोबाइल नंबर और गायों की संख्या — बस इतना लिखें।',
      descEn: 'Share your name, village, phone number, and approximate cattle count.',
    },
    {
      no: '2',
      titleHi: 'हमारी टीम आपसे बात करेगी',
      titleEn: 'Our team connects with you',
      descHi: 'GOVEDA की टीम फोन पर या गौशाला आकर जगह, पानी और गोबर को समझेगी।',
      descEn: 'We call or visit to understand your shed, water, spare land, and dung.',
    },
    {
      no: '3',
      titleHi: 'सबसे आसान काम साथ चुनें',
      titleEn: 'Pick the easiest first step',
      descHi: 'सब एक साथ नहीं — पहले खाद, जीवामृत, पौधे या छोटा बायोगैस तय होगा।',
      descEn: 'Start simple—choose compost, Jeevamrut, saplings, or biogas first.',
    },
    {
      no: '4',
      titleHi: 'सीखें, बनाएँ और गाँव से जुड़ें',
      titleEn: 'Learn, make & sell locally',
      descHi: 'गाँव की महिलाओं व युवाओं को सिखाकर किसानों और बाज़ार से सीधा जोड़।',
      descEn: 'Train local hands and link directly with nearby farmers & buyers.',
    },
  ];

  const visionCards: {
    assetKey: AssetKey;
    tagHi: string;
    tagEn: string;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
    accent: string;
  }[] = [
    {
      assetKey: 'medallionSkills',
      tagHi: 'करके सीखने का केंद्र',
      tagEn: 'HANDS-ON TRAINING HUB',
      titleHi: 'गौशाला संचालकों व किसानों के लिए मॉडल केंद्र',
      titleEn: 'Live Demo Center for Managers & Farmers',
      descHi:
        'अच्छी चल रही गौशालाओं को सीखने का केंद्र बनाना, जहाँ लोग आकर खुद खाद, बायोगैस और चारा उगाना सीख सकें।',
      descEn:
        'Turning thriving shelters into demonstration hubs where visiting farmers and teams learn by seeing.',
      accent: '#236B30',
    },
    {
      assetKey: 'vignetteGaushalaCircularHub',
      tagHi: 'भविष्य की अलग योजना',
      tagEn: 'PLANNED SEPARATE TOOL',
      titleHi: 'गौशाला का सरल डिजिटल हिसाब-किताब (आगामी)',
      titleEn: 'Simple Digital Gaushala Ledger (Planned)',
      descHi:
        'गायों की गिनती, टीकाकरण, चारा स्टॉक और खाद का हिसाब रखने वाला अलग सरल सॉफ्टवेयर आगामी चरण में तैयार होगा।',
      descEn:
        'A separate digital ledger for cattle health, vaccines, fodder, and compost is planned for a future phase.',
      accent: '#1E6B99',
    },
    {
      assetKey: 'medallionSenior',
      tagHi: 'दीर्घकालीन मानवीय संकल्प',
      tagEn: 'LONG-TERM HUMAN VISION',
      titleHi: 'गौशाला से जुड़ा बुज़ुर्ग सेवा आश्रम (भविष्य की दृष्टि)',
      titleEn: 'Gaushala-Linked Elderly Care Home (Vision)',
      descHi:
        'जब गौशालाएँ अपने पैरों पर खड़ी हो जाएँ, तो इन्हीं शांत हरे परिसरों के पास बेसहारा बुज़ुर्गों के लिए सम्मानजनक निवास।',
      descEn:
        'As shelters grow self-sustaining, our long-term social vision adds peaceful, dignified homes for elders.',
      accent: '#9A5312',
    },
  ];

  return (
    <div className="bg-white text-[#153E1E]">
      {/* ======================================================================
          HERO — FULL-BLEED LUMINOUS GAUSHALA DIORAMA + BORDERLESS CALLOUTS
         ====================================================================== */}
      <GaushalaArtisticHero
        lang={lang}
        onNavigate={onNavigate}
        onScrollTo={scrollToSection}
      />

      {/* STICKY ONE-PAGE SECTION NAVIGATION */}
      <MissionAnchorNav
        tabs={GAUSHALA_ANCHOR_TABS}
        activeTab={activeTab}
        onSelect={scrollToSection}
        lang={lang}
        ariaLabel="Atmanirbhar Gaushala Sections"
      />

      {/* ======================================================================
          01 (gs-why) — ORIGINAL 2×2 GAUSHALA SHOWCASE (ZERO HOMEPAGE COPY!)
         ====================================================================== */}
      <section id="gs-why" className="scroll-mt-32 border-b border-[#E5DEC9]">
        <GaushalaWhyOriginalShowcase lang={lang} onScrollTo={scrollToSection} />

        {/* 4 Ways GOVEDA Helps — 2×2 Mobile / 4-Col Desktop */}
        <div className="bg-[#FAF8F3] pb-14 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="max-w-2xl space-y-1.5">
              <p className="text-xs font-bold tracking-[0.14em] text-[#2F6D26]">
                {lang === 'hi'
                  ? 'GOVEDA कैसे साथ देता है'
                  : 'HOW GOVEDA HELPS ON THE GROUND'}
              </p>
              <h3
                className={`text-xl sm:text-2xl font-extrabold text-[#153E1E] ${
                  lang === 'hi' ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {lang === 'hi'
                  ? 'गौशाला को मजबूत बनाने में हम 4 सीधी मदद करते हैं'
                  : '4 Straightforward Ways We Help Your Gaushala Grow'}
              </h3>
            </div>

            <GaushalaWhyJoinIllustrated lang={lang} />
          </div>
        </div>
      </section>

      {/* ======================================================================
          02 (gs-circular) — BELOVED ROTATING 8-NODE CIRCLE + 5 SIMPLE STEPS
         ====================================================================== */}
      <section id="gs-circular" className="scroll-mt-32 border-b border-[#E5DEC9]">
        <GaushalaRadialEcosystem lang={lang} onScrollTo={scrollToSection} />

        <div className="bg-white py-14 sm:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="space-y-8">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-bold tracking-[0.14em] text-[#2F6D26]">
                  {lang === 'hi'
                    ? '02 · शुरू से अंत तक सीधी राह'
                    : '02 · STEP BY STEP FROM START TO SELF-RELIANCE'}
                </p>
                <h3
                  className={`text-2xl sm:text-3xl font-extrabold text-[#153E1E] leading-tight ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {lang === 'hi'
                    ? 'एक आम गौशाला 5 आसान कदमों में आत्मनिर्भर कैसे बनती है?'
                    : 'How a Village Gaushala Becomes Self-Reliant in 5 Simple Steps'}
                </h3>
                <p
                  className={`text-sm sm:text-[15px] text-[#3B4E41] leading-[1.7] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi'
                    ? 'सब काम एक दिन में नहीं करने होते। पहले गायों की देखभाल, फिर खाद और नर्सरी, फिर बायोगैस और गाँव का काम — एक के बाद एक आराम से बढ़िए।'
                    : 'You never have to do everything on day one. Move comfortably one step at a time—from cattle care to compost, biogas, and village crafts.'}
                </p>
              </div>

              <GaushalaStepByStepRoadmap steps={GAUSHALA_CIRCULAR_STEPS} lang={lang} />
            </div>

            {/* Expandable 10-Work Quick Index (2-Col Mobile & Desktop) */}
            <div className="pt-7 border-t border-[#E5DEC9] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4
                    className={`text-base sm:text-lg font-extrabold text-[#153E1E] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi'
                      ? 'एक नज़र में देखें: गौशाला में कौन-कौन से 10 काम हो सकते हैं?'
                      : 'At a Glance: All 10 Activities a Gaushala Can Choose From'}
                  </h4>
                  <p
                    className={`text-xs sm:text-[13.5px] text-[#4E6154] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi'
                      ? 'किसी भी काम पर क्लिक करें और सीधे उसकी पूरी सरल जानकारी पढ़ें।'
                      : 'Click any activity to jump straight to its plain step-by-step explanation.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTenWorkIndex((prev) => !prev)}
                  className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full border border-[#C9BE9F] text-xs font-bold text-[#153E1E] hover:border-[#2F6D26] hover:bg-[#FAF8F3] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {showTenWorkIndex
                      ? lang === 'hi'
                        ? 'सूची बंद करें'
                        : 'Hide 10-Work Index'
                      : lang === 'hi'
                        ? 'सभी 10 काम की सूची खोलें'
                        : 'Open 10-Work Index'}
                  </span>
                  {showTenWorkIndex ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {showTenWorkIndex && (
                <GaushalaTenActivitiesShowcase lang={lang} onScrollTo={scrollToSection} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          03 (gs-procurement) — ANNOTATED DUNG COLLECTION DIORAMA (ART + TEXT = ONE!)
         ====================================================================== */}
      <section
        id="gs-procurement"
        className="scroll-mt-32 bg-[#FAF8F3] py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '03 · गोबर को बेकार ढेर से उपयोगी संसाधन कैसे बनाएँ'
                : '03 · HOW DAILY COW DUNG IS COLLECTED CLEANLY'
            }
            titleHi="चित्र में देखिए: गौशाला से खेत व केंद्र तक गोबर कैसे पहुँचता है?"
            titleEn="See It Directly: How Daily Cow Dung Moves From Shed to Useful Work"
            leadHi="अकेली छोटी गौशाला से रोज़ गाड़ी भेजना महँगा पड़ता है। चित्र के चारों बिंदुओं को छूकर समझें कि पहले गौशाला में खाद कैसे बनती है और अतिरिक्त गोबर 8–15 गौशालाओं के साथ कैसे जुड़ता है।"
            leadEn="Explore the 4 points right on the village scene below to see how dung first feeds campus compost beds and how surplus dung is pooled cleanly across 8–15 nearby shelters."
            lang={lang}
          />

          <GaushalaAnnotatedDioramaStage
            assetKey="gaushalaDungHubFlow"
            altHi="गौशाला में साफ गोबर इकट्ठा होना, केंचुआ खाद बेड में पकना और गाड़ी से तहसील केंद्र व खेतों तक पहुँचने का चित्र"
            altEn="Annotated watercolor scene showing cow dung collection, shaded vermicompost beds, honest weighing, and cluster transport to fields"
            landmarks={DUNG_HUB_LANDMARKS}
            lang={lang}
            tone="parchment"
          />

          <CalmHonestNote
            lang={lang}
            tone="green"
            label={lang === 'hi' ? 'सीधी और ईमानदार बात' : 'Plain & Honest Note'}
            text={
              lang === 'hi'
                ? 'हम किसी गौशाला से “इतने रुपये किलो पक्का खरीद लेंगे” जैसा झूठा वादा नहीं करते। गोबर की साफ-सफाई, नमी, दूरी और पास के बाज़ार को देखकर दोनों पक्ष आपसी लिखित सहमति से सही दाम या खाद-साझेदारी तय करते हैं।'
                : 'We never promise a fixed universal per-kg dung rate. Pricing or manure-sharing is always agreed transparently in writing based on cleanliness, moisture, transport distance, and local demand.'
            }
          />
        </div>
      </section>

      {/* ======================================================================
          04 (gs-manure) — CONNECTED SOIL ANATOMY + FUSED SLICED 4-POT & 5-LAND GRIDS
         ====================================================================== */}
      <section
        id="gs-manure"
        className="scroll-mt-32 bg-[#FDFCF7] py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '04 · गोबर से ज़िंदा मिट्टी और स्वस्थ खेती'
                : '04 · FROM COW DUNG TO LIVING SOIL & NATURAL FARMING'
            }
            titleHi="गोबर से खाद कैसे बनती है — और खेत की मिट्टी में क्या जादू करती है?"
            titleEn="How Cow Dung Brings Farm Soil Back to Life — Layer by Layer"
            leadHi="मिट्टी के चित्र पर दिए गए 1 से 4 नंबर देखें — समझिए कैसे सूखी घास, नमी, अच्छे कीटाणु और केंचुए मिलकर खेत को उपजाऊ बनाते हैं, और नीचे हर एक खाद के साथ उसका सीधा काम जानिए।"
            leadEn="Follow markers 1 to 4 right on the soil cross-section to see how mulch, moisture balance, friendly microbes, and earthworms revive fields—then see each farm input paired right below."
            lang={lang}
          />

          <GaushalaLivingSoilShowcase lang={lang} />
        </div>
      </section>

      {/* ======================================================================
          05 (gs-biogas) — ANNOTATED BIOGAS DIORAMA + VISUAL 3-SCALE CARDS
         ====================================================================== */}
      <section
        id="gs-biogas"
        className="scroll-mt-32 bg-[#FAF8F3] py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-11">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '05 · गोबर से धुआँ-रहित रसोई गैस और तरल खाद'
                : '05 · CLEAN COOKING GAS & RICH SLURRY FROM DUNG'
            }
            titleHi="गोबर से बायोगैस कैसे बनती है? — चित्र में 4 कदम समझें"
            titleEn="How Biogas Works Step by Step — Follow 1 to 4 Right on the Scene"
            leadHi="बंद टैंक में गोबर और पानी डालते ही ऊपर से साफ नीली रसोई गैस और नीचे से खेतों के लिए गाढ़ी तरल खाद मिलती है। चित्र के चारों हिस्से देखकर अपनी गायों की संख्या के हिसाब से सही आकार चुनें।"
            leadEn="Follow pins 1 to 4 on the Gaushala biogas scene—from mixing dung and water to cooking on a clean blue flame and feeding liquid slurry to crops—then match the unit size to your herd."
            lang={lang}
          />

          <GaushalaAnnotatedDioramaStage
            assetKey="gaushalaBiogasEnergyFlow"
            altHi="गोबर-पानी मिलाने का टैंक, हरा बायोगैस गुंबद, नीली रसोई गैस पर खाना बनाती महिला और सब्ज़ी की क्यारी में बहती स्लरी खाद"
            altEn="Annotated watercolor scene showing dung-water mixing tank, green biogas dome, clean blue kitchen stove, and slurry outlet feeding vegetables"
            landmarks={BIOGAS_LANDMARKS}
            lang={lang}
            tone="sage"
          />

          {/* 3 Biogas Scales: Clean Full-Width on Mobile, 3-Col on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-7 pt-2">
            {GAUSHALA_BIOGAS_SCALES.map((item, idx) => (
              <div
                key={item.scale}
                className={`rounded-[22px] p-4 sm:p-5 space-y-3 ${
                  idx === 2 ? 'bg-[#FDF6EA]' : 'bg-white/90'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#153E1E] text-white font-extrabold">
                    {lang === 'hi' ? item.scale : item.scaleEn}
                  </span>
                  <span
                    className={`font-bold ${
                      idx === 2 ? 'text-[#9A5312]' : 'text-[#236B30]'
                    }`}
                  >
                    {lang === 'hi' ? item.statusHi : item.statusEn}
                  </span>
                </div>

                <h3
                  className={`text-[14.5px] sm:text-lg font-extrabold text-[#153E1E] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? item.titleHi : item.titleEn}
                </h3>

                <ul className="space-y-2">
                  {(lang === 'hi' ? item.pointsHi : item.pointsEn).map((pt) => (
                    <li
                      key={pt}
                      className={`flex items-start gap-2 text-[11.5px] sm:text-[13.5px] text-[#35463A] leading-[1.6] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      <CheckCircle2
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2F6D26] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <CalmHonestNote
            lang={lang}
            tone="amber"
            label={lang === 'hi' ? 'ज़रूरी सुरक्षा बात' : 'Important Safety Rule'}
            text={
              lang === 'hi'
                ? 'कच्ची बायोगैस को कभी भी घर के लाल LPG सिलेंडर में न भरें — यह खतरनाक और गैर-कानूनी है। छोटी गौशाला के लिए सीधी पाइपलाइन से रसोई गैस सबसे सुरक्षित है। बड़ा बायो-CNG (CBG) प्लांट अभी प्रस्तावित है और वह केवल सरकारी PESO सुरक्षा मानकों व पूरी जाँच के बाद ही बनता है।'
                : 'Never fill raw biogas into domestic LPG cylinders—it is unsafe and illegal. Direct low-pressure kitchen piping is the safe choice for village shelters. Large commercial Bio-CNG (CBG) hubs are currently proposed and proceed only after full feasibility and PESO safety approvals.'
            }
          />
        </div>
      </section>

      {/* ======================================================================
          06 (gs-products) — ANNOTATED CRAFT HERO + 6 ILLUSTRATED ARTISAN GROUPS (48 ITEMS!)
         ====================================================================== */}
      <section
        id="gs-products"
        className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-11">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '06 · एक गौशाला, 2–3 खास उत्पाद'
                : '06 · ONE GAUSHALA, 2–3 SPECIALTY PRODUCTS'
            }
            titleHi="गोबर से बनने वाले 48 संभावित उत्पाद — चित्र देखकर अपने गाँव के 2–3 खास उत्पाद चुनें"
            titleEn="48 Potential Cow-Dung Products — Explore the Craft & Pick 2–3 That Sell Locally"
            leadHi="किसी भी गौशाला को ये सारी 48 चीज़ें एक साथ नहीं बनानी हैं। पहले चित्र में देखें कि गोबर से क्या-क्या सुंदर चीज़ें बनती हैं, और फिर नीचे 6 रंगीन समूहों में अपने इलाके की मांग वाले 2–3 उत्पाद चुनें।"
            leadEn="No shelter needs to make all 48 items. See the flagship cow-dung crafts right in the illustration, then browse the 6 illustrated product families below to pick 2–3 winners for your area."
            lang={lang}
          />

          <GaushalaAnnotatedDioramaStage
            assetKey="gaushalaDungProductsCraft"
            altHi="गोबर के दीये, पौधों के गमले, हर्बल धूपबत्ती, गौ-काष्ठ लकड़ी और प्राकृतिक दीवार पेंट का सुंदर चित्र"
            altEn="Annotated watercolor showcase of cow-dung diyas, biodegradable sapling pots, herbal dhoop cones, Gau-Kashth logs, and natural wall paint"
            landmarks={PRODUCTS_CRAFT_LANDMARKS}
            lang={lang}
            tone="white"
            stageClassName="top-[14%] left-[14%] right-[14%] bottom-[12%]"
          />

          <GaushalaProductsArtisanShowcase lang={lang} />

          <CalmHonestNote
            lang={lang}
            tone="green"
            label={lang === 'hi' ? 'स्पष्ट जानकारी' : 'Clear Scope Note'}
            text={
              lang === 'hi'
                ? 'ये 48 उत्पाद भविष्य के प्रशिक्षण और विकास के विकल्प हैं — इन्हें अभी किसी ऑनलाइन दुकान की तरह बेचा नहीं जा रहा है। साबुन या उबटन जैसे उत्पाद केवल तभी बनाए जाते हैं जब सारे सरकारी लाइसेंस और गुणवत्ता जांच पूरी हों।'
                : 'These 48 items represent future training and village-enterprise options—not a live online store. Personal-care items such as herbal soaps are only pursued where proper regulatory licenses and quality testing are in place.'
            }
          />
        </div>
      </section>

      {/* ======================================================================
          07 (gs-welfare) — ANNOTATED CATTLE WELFARE DIORAMA + 3 ILLUSTRATED VISIONS
         ====================================================================== */}
      <section
        id="gs-welfare"
        className="scroll-mt-32 bg-[#FAF8F3] py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '07 · सबसे पहला नियम — गायों की भलाई'
                : '07 · RULE NUMBER ONE — CATTLE WELFARE COMES FIRST'
            }
            titleHi="आत्मनिर्भरता का पहला मतलब है — छाया, साफ पानी, पूरा चारा और समय पर इलाज"
            titleEn="True Self-Reliance Starts With Shade, Clean Water, Fodder & Timely Vet Care"
            leadHi="गौशाला कोई फैक्ट्री नहीं है। चित्र में देखें कि एक आदर्श गौशाला के चारों ज़रूरी हिस्से — हवादार शेड, साफ पानी की खेली, पशु चिकित्सक और भूसा गोदाम — गायों की सेवा को कैसे सुरक्षित बनाते हैं।"
            leadEn="A Gaushala is a place of compassion first. Explore the 4 care landmarks right on the shelter illustration—airy shade, clean stone water trough, routine vet care, and dry fodder storage."
            lang={lang}
          />

          <GaushalaAnnotatedDioramaStage
            assetKey="gaushalaInfraWelfareScene"
            altHi="हवादार गौशाला शेड, साफ पानी की पत्थर खेली, गाय की जांच करती महिला पशु चिकित्सक और सूखे भूसे का गोदाम"
            altEn="Annotated watercolor showing a shaded airy shed, flowing stone water trough, veterinarian checking a cow, and stacked dry fodder barn"
            landmarks={WELFARE_LANDMARKS}
            lang={lang}
            tone="parchment"
          />

          {/* 3 Illustrated Supporting & Long-Term Visions (Breathable on Mobile, 3-Col Desktop) */}
          <div className="pt-8 border-t border-[#DDD4BE] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {visionCards.map((vc, idx) => (
              <div
                key={vc.titleEn}
                className={`rounded-[22px] bg-white/90 p-4 sm:p-5 space-y-3 ${
                  idx === 2 ? 'sm:col-span-2 md:col-span-1' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#DFCFAF] bg-[#FAF8F3] shrink-0">
                    <img
                      src={GENERATED_ASSETS[vc.assetKey]}
                      alt={lang === 'hi' ? vc.titleHi : vc.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <span
                    className="text-[10.5px] sm:text-xs font-extrabold tracking-wide leading-tight"
                    style={{ color: vc.accent }}
                  >
                    {lang === 'hi' ? vc.tagHi : vc.tagEn}
                  </span>
                </div>
                <h4
                  className={`text-[14px] sm:text-base font-extrabold text-[#153E1E] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? vc.titleHi : vc.titleEn}
                </h4>
                <p
                  className={`text-[11.5px] sm:text-[13.5px] text-[#35463A] leading-[1.65] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? vc.descHi : vc.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          08 (gs-dairy) — ANNOTATED CALF-FIRST DAIRY DIORAMA + 2×2 DAIRY GRID
         ====================================================================== */}
      <section
        id="gs-dairy"
        className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-11">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '08 · पहले बछड़ा, फिर शुद्ध देसी डेयरी'
                : '08 · CALF-FIRST PURE INDIGENOUS DAIRY'
            }
            titleHi="अगर गौशाला में अतिरिक्त दूध हो, तो पूरी सफाई से शुद्ध घी-दही कैसे बने?"
            titleEn="Where Healthy Surplus Milk Exists — Ethical, Clean Bilona Dairy"
            leadHi="हर गौशाला में दूध देने वाली गायें नहीं होतीं, इसलिए डेयरी कभी ज़रूरी शर्त नहीं है। जहाँ बछड़े का पेट भरने के बाद अतिरिक्त दूध बचे, वहाँ चित्र में दिखाए 4 नियमों से शुद्ध देसी उत्पाद बनते हैं।"
            leadEn="Dairy is optional because many shelters serve rescued or older cattle. Where healthy surplus milk exists after the calf feeds first, these 4 visual principles ensure ethical, clean quality."
            lang={lang}
          />

          <GaushalaAnnotatedDioramaStage
            assetKey="gaushalaDairyCalfFirst"
            altHi="बछड़े को दूध पिलाती देसी गाय, मिट्टी की मटकी में बिलोना मथानी, पीतल का दूध पात्र और शुद्ध घी जार"
            altEn="Annotated watercolor of a nursing calf with its mother beside an earthen curd pot, wooden bilona churn, brass milk vessel, and golden ghee jar"
            landmarks={DAIRY_LANDMARKS}
            lang={lang}
            tone="white"
          />

          {/* 2×2 Mobile / 4-Col Desktop Dairy Product Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {GAUSHALA_DAIRY_PRODUCTS.map((dp, idx) => (
              <div
                key={dp.titleEn}
                className="rounded-2xl bg-[#FAF8F3] p-3.5 sm:p-4 space-y-1.5"
              >
                <span className="text-[11px] font-extrabold text-[#8E531A] tabular-nums">
                  0{idx + 1}
                </span>
                <h3
                  className={`text-[14px] sm:text-base font-extrabold text-[#153E1E] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? dp.titleHi : dp.titleEn}
                </h3>
                <p
                  className={`text-[11.5px] sm:text-[13px] text-[#35463A] leading-[1.62] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? dp.descHi : dp.descEn}
                </p>
              </div>
            ))}
          </div>

          <CalmHonestNote
            lang={lang}
            tone="green"
            label={lang === 'hi' ? 'सफाई और नियम' : 'Hygiene & Law'}
            text={
              lang === 'hi'
                ? 'दूध, घी, दही या पनीर बेचने के लिए साफ बर्तन, ठंडा भंडारण और FSSAI खाद्य सुरक्षा पंजीकरण ज़रूरी होता है। हम किसी भी डेयरी उत्पाद के बारे में बढ़ा-चढ़ाकर चिकित्सा दावा नहीं करते।'
                : 'Any dairy sale requires spotless handling, proper cooling, and FSSAI registration where applicable. We never make exaggerated medical claims about dairy products.'
            }
          />
        </div>
      </section>

      {/* ======================================================================
          09 (gs-schemes) — VISUAL 2-TRACK ARTISTIC ROADMAP (REGISTERED VS UNREGISTERED)
         ====================================================================== */}
      <section
        id="gs-schemes"
        className="scroll-mt-32 bg-[#FAF8F3] py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '09 · रजिस्टर्ड और बिना-रजिस्ट्रेशन — दोनों के लिए रास्ता'
                : '09 · SUPPORT PATH FOR REGISTERED & UNREGISTERED SHELTERS'
            }
            titleHi="सरकारी योजनाओं और CSR मदद से कैसे जुड़ें?"
            titleEn="How Both Registered and Informal Village Gaushalas Can Get Support"
            leadHi="बहुत से लोग सोचते हैं कि हमारी गौशाला अभी रजिस्टर्ड नहीं है, तो क्या कोई मदद मिलेगी? जवाब है — हाँ। नीचे दोनों तरह की गौशालाओं के लिए आसान 4-कदम रास्ता दिया है।"
            leadEn="Being unregistered does not close the door. Compare the clear 4-step path for already-registered shelters and informal village Gaushalas side by side."
            lang={lang}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Track A: Registered Gaushalas */}
            <div className="rounded-[26px] bg-[#EEF6E7]/85 p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-full overflow-hidden bg-white ring-2 ring-white shadow-xs shrink-0">
                  <img
                    src={GENERATED_ASSETS.medallionGaushala}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold tracking-wide text-[#236B30]">
                    {lang === 'hi' ? 'रास्ता 01 · रजिस्टर्ड गौशालाएँ' : 'PATH 01 · REGISTERED SHELTERS'}
                  </p>
                  <h3
                    className={`text-lg sm:text-xl font-extrabold text-[#153E1E] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi'
                      ? 'सरकारी अनुदान और CSR के 4 रास्ते'
                      : '4 Govt Grant & CSR Pathways'}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GAUSHALA_GOVT_SCHEMES.registered.map((sch, idx) => (
                  <div
                    key={sch.titleEn}
                    className="rounded-2xl bg-white/92 p-3.5 space-y-1.5"
                  >
                    <span className="inline-flex w-6 h-6 rounded-full bg-[#236B30] text-white text-[11px] font-extrabold items-center justify-center tabular-nums">
                      {idx + 1}
                    </span>
                    <h4
                      className={`text-[13px] sm:text-[14.5px] font-extrabold text-[#153E1E] leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? sch.titleHi : sch.titleEn}
                    </h4>
                    <p
                      className={`text-[11.5px] sm:text-[12.5px] text-[#35463A] leading-[1.58] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? sch.descHi : sch.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Track B: Unregistered Village Gaushalas */}
            <div className="rounded-[26px] bg-[#FDF4E5]/90 p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-full overflow-hidden bg-white ring-2 ring-white shadow-xs shrink-0">
                  <img
                    src={GENERATED_ASSETS.vignetteGaushalaCircularHub}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold tracking-wide text-[#9A5312]">
                    {lang === 'hi'
                      ? 'रास्ता 02 · अभी बिना-रजिस्ट्रेशन वाली गौशालाएँ'
                      : 'PATH 02 · UNREGISTERED VILLAGE SHELTERS'}
                  </p>
                  <h3
                    className={`text-lg sm:text-xl font-extrabold text-[#153E1E] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi'
                      ? 'घबराएँ नहीं — इन 4 कदमों से शुरू करें'
                      : 'Start Immediately With 4 Simple Steps'}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GAUSHALA_GOVT_SCHEMES.unregistered.map((sch, idx) => (
                  <div
                    key={sch.titleEn}
                    className="rounded-2xl bg-white/92 p-3.5 space-y-1.5"
                  >
                    <span className="inline-flex w-6 h-6 rounded-full bg-[#9A5312] text-white text-[11px] font-extrabold items-center justify-center tabular-nums">
                      {idx + 1}
                    </span>
                    <h4
                      className={`text-[13px] sm:text-[14.5px] font-extrabold text-[#153E1E] leading-snug ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? sch.titleHi : sch.titleEn}
                    </h4>
                    <p
                      className={`text-[11.5px] sm:text-[12.5px] text-[#35463A] leading-[1.58] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' ? sch.descHi : sch.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <CalmHonestNote
            lang={lang}
            tone="green"
            label={lang === 'hi' ? 'सरकारी योजना की साफ बात' : 'Clear Note on Govt Grants'}
            text={
              lang === 'hi'
                ? 'GOVEDA केवल सही जानकारी, कागज़ात की तैयारी और मार्गदर्शन में मदद करता है। किसी भी सरकारी अनुदान या योजना की अंतिम मंजूरी संबंधित सरकारी विभाग और उनके नियमों के आधार पर ही होती है।'
                : 'GOVEDA helps with plain information, paperwork readiness, and guidance. Final approval of any government grant or scheme always rests with the respective government department.'
            }
          />
        </div>
      </section>

      {/* ======================================================================
          10 (gs-market) — FUSED 3-STAGE LIVELIHOOD ART + 2×2 ILLUSTRATED BUYERS
         ====================================================================== */}
      <section
        id="gs-market"
        className="scroll-mt-32 bg-white py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '10 · गाँव की महिलाओं का काम और खरीदारों से सीधा जोड़'
                : '10 · VILLAGE WOMEN’S WORK & DIRECT LOCAL BUYERS'
            }
            titleHi="चीज़ें बन तो जाएँ — पर बिकेगी कहाँ? और गाँव को क्या फ़ायदा होगा?"
            titleEn="Who Buys These Products — And How Does the Village Benefit?"
            leadHi="हमारा नियम सीधा है: पहले अपने 15–20 किमी के आसपास के किसान, मंदिर, स्कूल और कस्बे के मेले से जुड़िए — जहाँ ढुलाई खर्च लगभग शून्य रहता है और पूरा भरोसा बनता है।"
            leadEn="Start right within 15–20 km—nearby farmers, temples, schools, and local fairs—where delivery costs stay near zero and village trust builds naturally."
            lang={lang}
          />

          {/* Fused 3-Stage Individual Sliced Art Cards */}
          <GaushalaSlicedLivelihoodStrip lang={lang} />

          {/* 2×2 Mobile / 4-Col Desktop Illustrated Buyer Channels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {GAUSHALA_MARKET_CHANNELS.map((ch, idx) => (
              <div
                key={ch.num}
                className="rounded-2xl bg-[#FAF8F3] p-3.5 sm:p-4 space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#DFCFAF] bg-white shrink-0">
                    <img
                      src={GENERATED_ASSETS[BUYER_MEDALLIONS[idx] ?? 'medallionOrganic']}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <span className="text-[10.5px] sm:text-xs font-extrabold text-[#5A7B3B] tabular-nums">
                    {lang === 'hi' ? `बाज़ार ${ch.num}` : `Buyer ${ch.num}`}
                  </span>
                </div>
                <h3
                  className={`text-[13.5px] sm:text-[15.5px] font-extrabold text-[#153E1E] leading-snug ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? ch.titleHi : ch.titleEn}
                </h3>
                <p
                  className={`text-[11.5px] sm:text-[13px] text-[#35463A] leading-[1.6] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? ch.descHi : ch.descEn}
                </p>
              </div>
            ))}
          </div>

          {/* Visual 2-Column Everyday Balance: Costs Drop ↓ vs Local Income Builds ↑ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 pt-2">
            <div className="rounded-[24px] bg-[#F2F8EA] p-5 sm:p-6 space-y-3">
              <p className="text-xs font-extrabold tracking-wide text-[#236B30]">
                {lang === 'hi' ? 'पहला फ़ायदा · खर्च कम होना ↓' : 'FIRST GAIN · LOWER DAILY COSTS ↓'}
              </p>
              <h4
                className={`text-base sm:text-lg font-extrabold text-[#153E1E] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi'
                  ? 'गौशाला का हर महीने का खर्च कैसे घटता है?'
                  : 'How Monthly Shelter Expenses Drop Naturally'}
              </h4>
              <ul
                className={`space-y-2 text-[12.5px] sm:text-[13.5px] text-[#2D4032] leading-[1.68] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#236B30] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? 'अपनी ज़मीन पर हरा चारा (नेपियर, रिजका) उगने से बाहर से चारा कम खरीदना पड़ता है।'
                      : 'Growing Napier and lucerne on campus directly reduces outside fodder bills.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#236B30] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? 'बायोगैस से रसोई की लकड़ी-सिलेंडर और सोलर पंप से बिजली-डीज़ल का बिल बचता है।'
                      : 'Biogas saves kitchen firewood/LPG while solar pumps trim power and diesel bills.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#236B30] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? 'समय पर टीकाकरण होने से गायों के महँगे इलाज की नौबत बहुत कम आती है।'
                      : 'Preventive vaccination keeps herds healthier and avoids sudden treatment costs.'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-[24px] bg-[#FDF5E7] p-5 sm:p-6 space-y-3">
              <p className="text-xs font-extrabold tracking-wide text-[#9A5312]">
                {lang === 'hi' ? 'दूसरा फ़ायदा · स्थानीय आमदनी ↑' : 'SECOND GAIN · LOCAL INCOME ↑'}
              </p>
              <h4
                className={`text-base sm:text-lg font-extrabold text-[#153E1E] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi'
                  ? 'धीरे-धीरे आमदनी के कौन से रास्ते खुलते हैं?'
                  : 'Practical Ways Steady Local Income Builds'}
              </h4>
              <ul
                className={`space-y-2 text-[12.5px] sm:text-[13.5px] text-[#3B4034] leading-[1.68] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9A5312] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? 'किसानों को केंचुआ खाद, जीवामृत और देशी पौधे देकर साल भर चलने वाली स्थानीय बिक्री।'
                      : 'Year-round sales of vermicompost, Jeevamrut, and native saplings to local farmers.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9A5312] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? 'गाँव की महिला समूहों द्वारा बनाए 2–3 खास उत्पाद — धूप, गमले, दीये या गोबर की लकड़ी।'
                      : '2–3 specialty village products crafted with women SHGs—pots, dhoop, diyas, or fuel logs.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9A5312] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {lang === 'hi'
                      ? 'साफ हिसाब-किताब होने से सरकारी चारा अनुदान और CSR मदद भी आसानी से जुड़ पाती है।'
                      : 'Clean records open doors to state fodder grants and CSR infrastructure partnerships.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {missionUpdates.length > 0 && (
            <div className="pt-8 border-t border-[#E5DEC9] space-y-5">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-[#2F6D26]">
                <Info className="w-4 h-4" aria-hidden="true" />
                <span>
                  {lang === 'hi' ? 'ताज़ा जमीनी समाचार और अपडेट' : 'LATEST FIELD UPDATES'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missionUpdates.map((item) => (
                  <div key={item.id} className="pt-3 border-t border-[#D7CEB8] space-y-1.5">
                    <p className="text-[11px] font-bold text-[#5A7B3B]">
                      {item.categoryTag || item.sectionType}
                      {item.publishedAt || item.updatedAt
                        ? ` · ${(item.publishedAt || item.updatedAt || '').slice(0, 10)}`
                        : ''}
                    </p>
                    <h4
                      className={`text-sm font-extrabold text-[#153E1E] ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' && item.titleHi ? item.titleHi : item.titleEn}
                    </h4>
                    <p
                      className={`text-xs text-[#3F5145] leading-relaxed ${
                        lang === 'hi' ? 'font-hindi' : ''
                      }`}
                    >
                      {lang === 'hi' && item.summaryHi ? item.summaryHi : item.summaryEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================================
          11 (gs-register) — 2×2 MOBILE / 4-COL DESKTOP JOIN STEPS + PORTAL
         ====================================================================== */}
      <section
        id="gs-register"
        className="scroll-mt-32 bg-[#FAF8F3] py-14 sm:py-18 border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9">
          <MinimalistEditorialHeader
            eyebrow={
              lang === 'hi'
                ? '11 · अपनी गौशाला या गाँव को जोड़ें'
                : '11 · JOIN WITH YOUR GAUSHALA OR VILLAGE TEAM'
            }
            titleHi="जुड़ना बिल्कुल आसान है — बस नीचे 4 छोटे कदम देखें"
            titleEn="Joining Is Simple — Here Is What Happens After You Apply"
            leadHi="आप गौशाला चलाते हों, किसान हों, महिला समूह से हों, पशु डॉक्टर हों या CSR सहयोग करना चाहते हों — नीचे आसान फॉर्म भरें। सबमिट करते ही आपको तुरंत अपना Application ID मिल जाएगा।"
            leadEn="Whether you manage a Gaushala, farm nearby, lead a women’s group, practice veterinary care, or represent a CSR partner—fill the simple form below and receive your tracking ID right away."
            lang={lang}
          />

          <ol className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {joinSteps.map((st) => (
              <li key={st.no} className="pt-3.5 border-t border-[#D2C6AA] flex items-start gap-2.5 sm:gap-3">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#153E1E] text-white text-[11px] sm:text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums mt-0.5">
                  {st.no}
                </span>
                <div className="space-y-1">
                  <h3
                    className={`text-[13px] sm:text-sm font-extrabold text-[#153E1E] leading-snug ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? st.titleHi : st.titleEn}
                  </h3>
                  <p
                    className={`text-[11.5px] sm:text-xs text-[#3B4E41] leading-[1.6] ${
                      lang === 'hi' ? 'font-hindi' : ''
                    }`}
                  >
                    {lang === 'hi' ? st.descHi : st.descEn}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl bg-white border border-[#E5DEC9] p-4 sm:p-6">
            <RegistrationPortal
              lang={lang}
              initialCategory="gaushala"
              allowedCategories={[
                'gaushala',
                'farmer',
                'women-shg',
                'csr-partner',
                'expert-trainer',
              ]}
              records={records}
              onAddRecord={onAddRecord}
              onSelectCategoryRoute={(cat) => onNavigate(`/join/${cat}`)}
            />
          </div>
        </div>
      </section>

      {/* ======================================================================
          12 (gs-faqs) — 10 EVERYDAY QUESTIONS + GREEN VILLAGE PARTNER BANNER
         ====================================================================== */}
      <section id="gs-faqs" className="scroll-mt-32 bg-white pt-14 sm:pt-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <MinimalistEditorialHeader
            eyebrow={lang === 'hi' ? '12 · मन के आम सवाल' : '12 · EVERYDAY QUESTIONS ANSWERED'}
            titleHi="लोग अक्सर ये 10 सवाल पूछते हैं — सीधे और सच्चे जवाब"
            titleEn="10 Questions People Commonly Ask — Straight, Honest Answers"
            lang={lang}
          />

          <MissionFaqAccordion faqs={GAUSHALA_FAQS} lang={lang} />

          <div className="pt-6 pb-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DEC9]">
            <SpringButton
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/missions/harit-rajasthan')}
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {lang === 'hi'
                  ? 'पिछला मिशन 02: हरित राजस्थान'
                  : 'Previous Mission 02: Harit Rajasthan'}
              </span>
            </SpringButton>
            <SpringButton
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/missions/biogas-cbg')}
              className="!bg-[#153E1E]"
            >
              <span>
                {lang === 'hi'
                  ? 'अगला मिशन 04: स्वच्छ ऊर्जा (बायोगैस एवं CBG)'
                  : 'Next Mission 04: Biogas & Bio-CNG/CBG'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </SpringButton>
          </div>
        </div>

        <GaushalaPartnerMeadowBanner
          lang={lang}
          onScrollTo={scrollToSection}
          onNavigate={onNavigate}
        />
      </section>
    </div>
  );
}
