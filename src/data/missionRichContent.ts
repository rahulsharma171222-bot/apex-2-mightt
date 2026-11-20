import type { AssetKey } from './assets';
import type {
  HorizonArtVariant,
  MissionFaqItem,
  RealityColumnItem,
  VisualJourneyStep,
} from '../components/MinimalistMissionPrimitives';

export interface GovedaRolePillar {
  num: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
}

export interface MissionRichStory {
  slug: string;
  heroVignette: AssetKey;
  explainerVignette: AssetKey;
  explainerCaptionHi: string;
  explainerCaptionEn: string;
  horizonTop: HorizonArtVariant;
  horizonBottom: HorizonArtVariant;
  whyEyebrowHi: string;
  whyEyebrowEn: string;
  whyTitleHi: string;
  whyTitleEn: string;
  whyLeadHi: string;
  whyLeadEn: string;
  realities: RealityColumnItem[];
  whatTitleHi: string;
  whatTitleEn: string;
  whatParagraphs: { hi: string; en: string }[];
  howTitleHi: string;
  howTitleEn: string;
  howLeadHi: string;
  howLeadEn: string;
  steps: VisualJourneyStep[];
  roleTitleHi: string;
  roleTitleEn: string;
  roleLeadHi: string;
  roleLeadEn: string;
  rolePillars: GovedaRolePillar[];
  safeguardTitleHi: string;
  safeguardTitleEn: string;
  safeguardPoints: { hi: string; en: string }[];
  faqs: MissionFaqItem[];
}

const SLUG_ALIASES: Record<string, string> = {
  'rural-upliftment': 'women-empowerment',
  'water-conservation': 'heritage-solar-water',
};

export function resolveMissionSlug(rawSlug?: string): string | undefined {
  if (!rawSlug) return undefined;
  const normalized = rawSlug.trim().toLowerCase();
  return SLUG_ALIASES[normalized] ?? normalized;
}

export const MISSION_RICH_CONTENT: Record<string, MissionRichStory> = {
  /* ==========================================================================
     MISSION 03: SELF-RELIANT GAUSHALA MISSION
     ========================================================================== */
  'self-reliant-gaushala': {
    slug: 'self-reliant-gaushala',
    heroVignette: 'missionVignette03Gaushala',
    explainerVignette: 'vignetteGaushalaCompost',
    explainerCaptionHi:
      'गोबर कम्पोस्ट, जीवामृत और स्थानीय पौध—गौशाला को दान-निर्भरता से स्वावलंबन की ओर ले जाने वाला चक्र।',
    explainerCaptionEn:
      'Organic vermicompost, Jeevamrit bio-inputs, and native sprouts turning cattle shelters into rural soil hubs.',
    horizonTop: 'gaushala',
    horizonBottom: 'sandstone',
    whyEyebrowHi: '01 · क्यों ज़रूरी है आत्मनिर्भर गौशाला?',
    whyEyebrowEn: '01 · Why Self-Reliant Gaushalas Matter',
    whyTitleHi: 'केवल चंदे के भरोसे गौशालाएँ लंबे समय तक नहीं चल सकतीं',
    whyTitleEn: 'Donation-Only Models Cannot Sustain Rural Gaushalas Forever',
    whyLeadHi:
      'राजस्थान व भारत के हज़ारों गाँवों में गौशालाएँ सेवा भाव से चलती हैं, लेकिन चारे, पानी और चिकित्सा का खर्च हर साल बढ़ रहा है। जब गोबर और गोमूत्र को वैज्ञानिक तरीके से खाद, बायोगैस और कृषि इनपुट में बदला जाता है, तो गौशाला पूरे गाँव की ताकत बन जाती है।',
    whyLeadEn:
      'Across Rajasthan, dedicated rural Gaushalas care for thousands of cattle while facing rising fodder, water, and veterinary expenses. Transforming daily dung into certified compost, Jeevamrit, and biogas helps shelters move steadily toward dignity and self-reliance.',
    realities: [
      {
        num: '01',
        titleHi: 'चारे और देखभाल का बढ़ता खर्च',
        titleEn: 'Rising Fodder & Care Costs',
        descHi:
          'सूखे के महीनों में हरा चारा, पानी और पशु चिकित्सा का खर्च पूरा करना केवल मौसमी दान से कठिन हो जाता है।',
        descEn:
          'During dry summers, meeting green fodder, water, and medical needs purely through seasonal donations becomes unsustainable.',
      },
      {
        num: '02',
        titleHi: 'गोबर का सही मूल्यवर्धन न होना',
        titleEn: 'Under-Utilised Organic Dung',
        descHi:
          'प्रतिदिन निकलने वाला गोबर यदि खुले में पड़ा रहे तो बर्बाद होता है—जबकि सही विधि से यही खेतों का सबसे अच्छा पोषण है।',
        descEn:
          'Daily cattle dung often sits unused in piles when structured composting can turn it into high-demand organic manure.',
      },
      {
        num: '03',
        titleHi: 'खेतों को जैविक खाद की ज़रूरत',
        titleEn: 'Farms Need Living Humus',
        descHi:
          'गाँव के किसान महँगे रासायनिक उर्वरकों से परेशान हैं—गौशाला और किसान जुड़ें तो दोनों को सीधा लाभ मिलता है।',
        descEn:
          'Local farmers need affordable, clean compost and Jeevamrit to restore hardened soil—creating a natural village exchange.',
      },
      {
        num: '04',
        titleHi: 'प्रशिक्षण व प्रबंधन व्यवस्था की कमी',
        titleEn: 'Need for Modern Management',
        descHi:
          'सरल बहीखाता, गुणवत्ता जाँच और गोसेवक प्रशिक्षण मिलने पर छोटी गौशाला भी सुव्यवस्थित और विश्वसनीय बन सकती है।',
        descEn:
          'Structured record-keeping, quality checks, and caretaker training turn informal shelters into trusted rural institutions.',
      },
    ],
    whatTitleHi: 'आत्मनिर्भर गौशाला मॉडल कैसे काम करता है? (सरल भाषा में)',
    whatTitleEn: 'How the Circular Self-Reliant Gaushala Model Works',
    whatParagraphs: [
      {
        hi: 'आत्मनिर्भर गौशाला का अर्थ है कि गौशाला केवल आश्रय स्थल न रहे, बल्कि गाँव का एक जीवंत “जैविक कृषि और ऊर्जा केंद्र” बने। रोज़ाना मिलने वाले गोबर से कम्पोस्ट, वर्मीकम्पोस्ट, जीवामृत, गोकाष्ठ और बायोगैस तैयार होती है।',
        en: 'A self-reliant Gaushala evolves from a purely donation-dependent shelter into a living rural agro-ecology centre. Daily dung is systematically converted into vermicompost, Jeevamrit, Gokashth logs, and clean biogas.',
      },
      {
        hi: 'इसी परिसर में हरे चारे की छोटी इकाई और देशी पौधों की नर्सरी भी जुड़ती है। आसपास के किसान गौशाला से शुद्ध जैविक खाद व पौधे लेते हैं और बदले में चारे व स्थानीय सहयोग से गौशाला को सशक्त बनाते हैं।',
        en: 'Paired with a green fodder plot and a native tree nursery on site, neighbouring farmers source clean organic inputs and saplings directly from the Gaushala—keeping village wealth circulating locally.',
      },
    ],
    howTitleHi: 'गौशाला को स्वावलंबी बनाने के 5 व्यावहारिक चरण',
    howTitleEn: '5 Practical Steps Toward a Self-Reliant Gaushala',
    howLeadHi:
      'एक साधारण ग्रामीण गौशाला बिना बड़े कर्ज़ के, चरणबद्ध तरीके से अपने संसाधनों का सही उपयोग कैसे शुरू कर सकती है:',
    howLeadEn:
      'How any village Gaushala can gradually move toward clean operations and local income without heavy debt:',
    steps: [
      {
        step: '01',
        assetKey: 'medallionGaushala',
        titleHi: 'पशु संख्या व दैनिक गोबर आकलन',
        titleEn: 'Cattle & Dung Assessment',
        descHi:
          'गौशाला में पशु संख्या, दैनिक गोबर उपलब्धता, पानी और उपलब्ध भूमि का सरल प्रारंभिक सर्वेक्षण।',
        descEn:
          'Simple baseline review of herd size, daily dung volume, water access, and yard space.',
      },
      {
        step: '02',
        assetKey: 'vignetteGaushalaCompost',
        titleHi: 'वर्मीकम्पोस्ट व जीवामृत इकाई',
        titleEn: 'Compost & Jeevamrit Unit',
        descHi:
          'कम लागत वाले कम्पोस्ट बेड और जीवामृत ड्रम से मानक गुणवत्ता वाली जैविक खाद का नियमित उत्पादन।',
        descEn:
          'Low-cost vermicompost beds and Jeevamrit drums producing reliable, farm-ready organic manure.',
      },
      {
        step: '03',
        assetKey: 'medallionEnergy',
        titleHi: 'बायोगैस व जैव-स्लरी एकीकरण',
        titleEn: 'Biogas & Slurry Link',
        descHi:
          'गौशाला रसोई या सामुदायिक उपयोग हेतु बायोगैस और उससे निकलने वाली पोषक स्लरी का खेतों में उपयोग।',
        descEn:
          'Clean cooking biogas for shelter needs while nutrient-rich spent slurry enriches nearby fields.',
      },
      {
        step: '04',
        assetKey: 'medallionHarit',
        titleHi: 'हरा चारा व देशी पौध नर्सरी',
        titleEn: 'Fodder Plot & Native Nursery',
        descHi:
          'गौशाला परिसर में हरा चारा और खेजड़ी-नीम-आंवला की नर्सरी तैयार कर स्थानीय हरियाली से जोड़ना।',
        descEn:
          'Cultivating local green fodder alongside native saplings to serve village plantation drives.',
      },
      {
        step: '05',
        assetKey: 'medallionOrganic',
        titleHi: 'किसान जुड़ाव व पशु चिकित्सा',
        titleEn: 'Farmer Link & Vet Care',
        descHi:
          'स्थानीय किसानों को गुणवत्तापूर्ण खाद उपलब्ध कराना, टीकाकरण और पारदर्शी बहीखाता बनाए रखना।',
        descEn:
          'Supplying local farmers with honest bio-inputs while maintaining regular vaccination and transparent accounts.',
      },
    ],
    roleTitleHi: 'इस मिशन में GOVEDA की भूमिका क्या है?',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'GOVEDA किसी गौशाला का स्वामित्व नहीं लेता—बल्कि तकनीकी मार्गदर्शन, प्रशिक्षण और स्थानीय बाज़ार-संपर्क का सेतु बनता है।',
    roleLeadEn:
      'GOVEDA does not take over Gaushala ownership—we act as a practical training, technical planning, and community-linkage partner.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'प्रबंधक एवं गौसेवक प्रशिक्षण',
        titleEn: 'Caretaker & Manager Training',
        descHi:
          'वर्मीकम्पोस्ट, जीवामृत, स्वच्छता और पशु पोषण के व्यावहारिक हिंदी प्रशिक्षण सत्र।',
        descEn:
          'Hands-on workshops on composting, Jeevamrit hygiene, cattle nutrition, and clean shelter management.',
      },
      {
        num: '02',
        titleHi: 'किसान व नर्सरी क्लस्टर जुड़ाव',
        titleEn: 'Village Farmer Linkage',
        descHi:
          'आसपास के जैविक किसानों और हरित राजस्थान अभियान को गौशाला की खाद व नर्सरी से जोड़ना।',
        descEn:
          'Connecting local organic farmers and Harit Rajasthan plantation drives to Gaushala compost and nurseries.',
      },
      {
        num: '03',
        titleHi: 'तकनीकी व CSR संवाद समन्वय',
        titleEn: 'Technical & CSR Facilitation',
        descHi:
          'योग्य गौशालाओं के लिए बायोगैस व्यवहार्यता आकलन और पारदर्शी संस्थागत सहयोग का मार्ग।',
        descEn:
          'Assisting eligible shelters with biogas feasibility reviews and transparent institutional or CSR dialogue.',
      },
    ],
    safeguardTitleHi: 'ईमानदार स्पष्टीकरण एवं प्रबंधन सूचना',
    safeguardTitleEn: 'Honest Disclosure & Software Scope',
    safeguardPoints: [
      {
        hi: 'प्रत्येक गौशाला का संचालन और स्वामित्व पूरी तरह संबंधित स्थानीय ट्रस्ट/समिति के पास ही रहता है।',
        en: 'Every Gaushala remains 100% owned and governed by its local trust or community committee.',
      },
      {
        hi: 'गोबर आधारित उत्पादों की आय स्थानीय गुणवत्ता, प्रबंधन और क्षेत्रीय मांग पर निर्भर करती है—कोई निश्चित मुनाफे की गारंटी नहीं दी जाती।',
        en: 'Revenue from compost or bio-inputs depends on consistent quality and local demand; no fixed profit is guaranteed.',
      },
      {
        hi: 'बड़े स्तर के पशु रिकॉर्ड व खाद-बिक्री लेखा हेतु समर्पित Gaushala Management Software भविष्य के चरण में जोड़ा जाएगा।',
        en: 'Dedicated Gaushala herd, fodder, and inventory software is planned as a separate future phase module.',
      },
    ],
    faqs: [
      {
        qHi: 'क्या छोटी ग्रामीण गौशाला (30–50 गायें) भी इस मिशन से जुड़ सकती है?',
        qEn: 'Can a small village Gaushala (30–50 cattle) join this mission?',
        aHi: 'हाँ। छोटी गौशालाएँ वर्मीकम्पोस्ट, जीवामृत और स्थानीय नर्सरी से बेहद कम खर्च में शुरुआत कर सकती हैं और आसपास के किसानों के साथ जुड़ सकती हैं।',
        aEn: 'Yes. Smaller shelters can begin immediately with low-cost vermicompost beds, Jeevamrit units, and native sapling nurseries serving nearby farms.',
      },
      {
        qHi: 'क्या पंजीकरण करने पर गौशाला को सीधा अनुदान (Grant) मिलता है?',
        qEn: 'Does registering automatically provide a cash grant?',
        aHi: 'नहीं। पंजीकरण पहला चरण है जिससे हम आपकी गौशाला की आवश्यकता, पशु संख्या और प्रशिक्षण ज़रूरतों को समझते हैं। किसी भी CSR या संस्थागत सहयोग के लिए अलग पात्रता और सत्यापन प्रक्रिया होती है।',
        aEn: 'No. Registration is the orientation step to understand your shelter’s needs and training priorities. Any CSR or institutional support requires separate verification.',
      },
      {
        qHi: 'गोबर से खाद बनाने में कितना समय लगता है?',
        qEn: 'How long does it take to prepare clean vermicompost?',
        aHi: 'सही नमी, छाया और केंचुआ प्रबंधन के साथ लगभग 60 से 75 दिनों में उच्च गुणवत्ता वाली भुरभुरी जैविक खाद तैयार हो जाती है।',
        aEn: 'With proper shade, moisture, and earthworm beds, nutrient-rich vermicompost typically matures in 60 to 75 days.',
      },
      {
        qHi: 'क्या गौशाला में बनने वाले उत्पादों के लिए सरकारी मानक ज़रूरी हैं?',
        qEn: 'Do value-added cow-based products need regulatory compliance?',
        aHi: 'हाँ। जीवामृत व कम्पोस्ट के लिए गुणवत्ता नियंत्रण तथा अन्य मूल्यवर्धित या अर्क आधारित उत्पादों के लिए लागू नियामकीय मानकों का पालन अनिवार्य है।',
        aEn: 'Yes. Compost requires quality checks, and any packaged bio-inputs or Ark-based goods must strictly follow applicable Indian regulatory norms.',
      },
      {
        qHi: 'गौशाला के लिए हरा चारा कैसे बढ़ाया जा सकता है?',
        qEn: 'How can Gaushalas improve green fodder availability?',
        aHi: 'कम पानी वाले नेपियर घास, रिजका और चारा-वृक्षों (जैसे खेजड़ी/सुबबूल के नियंत्रित ब्लॉक) की खेती और वर्षा जल संचयन से चारे का खर्च घटता है।',
        aEn: 'Growing drought-tolerant fodder grasses, lucerne, and native fodder trees paired with rainwater harvesting significantly reduces dry-season purchase costs.',
      },
      {
        qHi: 'क्या GOVEDA पशु चिकित्सा शिविर भी आयोजित करता है?',
        qEn: 'Does GOVEDA support veterinary awareness?',
        aHi: 'हम स्थानीय पशु चिकित्सकों, सरकारी पशु चिकित्सा केंद्रों और स्वयंसेवकों के साथ समन्वय कर नियमित टीकाकरण व रोकथाम जागरूकता को बढ़ावा देते हैं।',
        aEn: 'We coordinate with local veterinarians, public animal clinics, and volunteers to encourage regular vaccination and preventive cattle care.',
      },
    ],
  },

  /* ==========================================================================
     MISSION 04: CLEAN ENERGY — BIOGAS & BIO-CNG / CBG
     ========================================================================== */
  'biogas-cbg': {
    slug: 'biogas-cbg',
    heroVignette: 'missionVignette04Biogas',
    explainerVignette: 'vignetteBiogasDome',
    explainerCaptionHi:
      'बंद डाइजेस्टर में गोबर से स्वच्छ रसोई गैस (बायोगैस) और खेतों के लिए पोषक जैव-स्लरी एक साथ मिलती है।',
    explainerCaptionEn:
      'Inside an anaerobic dome, cattle dung produces clean blue cooking fuel while releasing fertile organic slurry for farms.',
    horizonTop: 'gaushala',
    horizonBottom: 'fort',
    whyEyebrowHi: '01 · क्यों ज़रूरी है स्वच्छ ग्रामीण ऊर्जा?',
    whyEyebrowEn: '01 · Why Clean Biogas & Bio-Energy Matter',
    whyTitleHi: 'लकड़ी के धुएँ से मुक्ति और गोबर से ऊर्जा का दोहरा लाभ',
    whyTitleEn: 'Ending Kitchen Smoke While Turning Waste Into Clean Fuel & Manure',
    whyLeadHi:
      'गाँवों में रसोई के लिए लकड़ी या उपले जलाने से महिलाओं के स्वास्थ्य पर गहरा असर पड़ता है, पेड़ों की कटाई होती है और गोबर की उपजाऊ शक्ति राख में बदल जाती है। बायोगैस एक ही गोबर से पहले स्वच्छ गैस देती है और फिर और भी बेहतर खाद (स्लरी) वापस लौटाती है।',
    whyLeadEn:
      'Burning firewood and dung cakes fills rural kitchens with smoke, cuts down local trees, and destroys organic nutrients. Biogas captures clean cooking energy first—and returns even richer bio-slurry to farm soils afterward.',
    realities: [
      {
        num: '01',
        titleHi: 'रसोई के धुएँ से स्वास्थ्य संकट',
        titleEn: 'Indoor Smoke & Family Health',
        descHi:
          'पारंपरिक चूल्हों का धुआँ ग्रामीण महिलाओं व बच्चों के फेफड़ों और आँखों के लिए हानिकारक है।',
        descEn:
          'Traditional biomass smoke harms the lungs and eyes of rural women and children every single day.',
      },
      {
        num: '02',
        titleHi: 'महँगे ईंधन पर ग्रामीण खर्च',
        titleEn: 'Rising Rural Fuel Costs',
        descHi:
          'घरेलू गैस सिलेंडर और डीज़ल की बढ़ती कीमतें ग्रामीण परिवारों व गौशालाओं का बजट बिगाड़ती हैं।',
        descEn:
          'Rising cylinder and diesel costs strain village households, dairy farmers, and rural shelters alike.',
      },
      {
        num: '03',
        titleHi: 'खुले गोबर से मीथेन उत्सर्जन',
        titleEn: 'Uncaptured Methane Loss',
        descHi:
          'खुले ढेर में सड़ता गोबर हवा में मीथेन (एक प्रबल ग्रीनहाउस गैस) छोड़ता है, जिसे बंद डाइजेस्टर ऊर्जा में बदलता है।',
        descEn:
          'Open rotting dung releases methane into the air; closed digesters safely trap that energy for useful cooking.',
      },
      {
        num: '04',
        titleHi: 'बायोगैस व CBG में भ्रम दूर करना',
        titleEn: 'Need for Clear Technical Safety',
        descHi:
          'ग्रामीणों को सरल भाषा में यह जानना ज़रूरी है कि घरेलू बायोगैस और वाहन-योग्य CBG (Compressed Biogas) में क्या अंतर है।',
        descEn:
          'Communities deserve honest clarity on the technical difference between raw household biogas and purified vehicle-grade CBG.',
      },
    ],
    whatTitleHi: 'बायोगैस और CBG में क्या अंतर है? — सरल वैज्ञानिक समझ',
    whatTitleEn: 'Biogas vs. Compressed Biogas (CBG) — Explained Plainly',
    whatParagraphs: [
      {
        hi: '1) कच्ची बायोगैस (Raw Biogas): गोबर और पानी को बंद गड्ढे (Anaerobic Digester) में बिना हवा के सड़ाने पर जो गैस बनती है, वह कम दबाव पर सीधे रसोई के विशेष बायोगैस चूल्हे में जलती है। इसमें लगभग 55–60% मीथेन होती है और यह घर, डेयरी या गौशाला के लिए सबसे सरल व सुरक्षित समाधान है।',
        en: '1) Raw Biogas: Produced inside an airtight digester from dung and water (roughly 55–60% methane), raw biogas flows safely at low pressure directly into dedicated biogas cookstoves for homes, dairies, and Gaushalas.',
      },
      {
        hi: '2) बायो-सीएनजी / CBG: वाहन या औद्योगिक उपयोग के लिए कच्ची बायोगैस से CO₂, H₂S और नमी हटाकर 90%+ शुद्ध मीथेन बनाई जाती है और फिर प्रमाणित उच्च-दबाव संयंत्र में संपीड़ित (Compress) किया जाता है। यह बड़े क्लस्टर व औद्योगिक स्तर का प्रोजेक्ट है—घरेलू स्तर का नहीं।',
        en: '2) Bio-CNG / CBG: Vehicle-grade CBG requires industrial purification (removing CO₂, H₂S, and moisture to >90% methane) and certified high-pressure compression. It operates strictly at approved cluster/plant scale—never as a backyard setup.',
      },
    ],
    howTitleHi: 'गोबर से स्वच्छ ऊर्जा व खाद तक की 6-चरणीय प्रक्रिया',
    howTitleEn: '6-Stage Journey From Daily Dung to Clean Energy & Slurry',
    howLeadHi:
      'घरेलू बायोगैस चरण 1–3 पर ही पूरा हो जाता है, जबकि प्रस्तावित क्लस्टर CBG मॉडल के लिए चरण 4–6 की अतिरिक्त औद्योगिक शुद्धिकरण प्रक्रिया होती है:',
    howLeadEn:
      'Household/Gaushala biogas finishes cleanly at Stage 3; industrial cluster CBG requires the additional purification and compression stages 4–6:',
    steps: [
      {
        step: '01',
        assetKey: 'medallionGaushala',
        titleHi: 'दैनिक गोबर व जैव-अवशेष संग्रह',
        titleEn: 'Daily Dung Collection',
        descHi:
          'गौशाला या पशुपालक परिवार से ताज़ा गोबर व पानी का सही अनुपात (लगभग 1:1) में मिश्रण।',
        descEn:
          'Mixing fresh cattle dung and water cleanly in a balanced slurry ratio.',
      },
      {
        step: '02',
        assetKey: 'vignetteBiogasDome',
        titleHi: 'बंद डाइजेस्टर (Anaerobic Digestion)',
        titleEn: 'Anaerobic Digester Dome',
        descHi:
          'ऑक्सीजन-रहित बंद टैंक में प्राकृतिक जीवाणु गोबर से मीथेन-समृद्ध बायोगैस तैयार करते हैं।',
        descEn:
          'Natural microbes inside the sealed chamber convert organic matter into clean biogas.',
      },
      {
        step: '03',
        assetKey: 'medallionEnergy',
        titleHi: 'रसोई उपयोग व जैव-स्लरी खाद',
        titleEn: 'Clean Cooking & Bio-Slurry',
        descHi:
          'कम दबाव पाइप से धुआँ-रहित रसोई गैस और आउटलेट से खेतों के लिए पोषक तरल जैव-स्लरी।',
        descEn:
          'Smokeless low-pressure cooking fuel plus rich nitrogen-balanced organic slurry for crops.',
      },
      {
        step: '04',
        assetKey: 'vignetteGaushalaCompost',
        titleHi: 'गैस शुद्धिकरण (केवल CBG संयंत्र)',
        titleEn: 'Purification (CBG Plants Only)',
        descHi:
          'बड़े क्लस्टर संयंत्र में अशुद्धियाँ (CO₂, H₂S, नमी) हटाकर मीथेन शुद्धता 90%+ करना।',
        descEn:
          'Industrial scrubbers remove CO₂, H₂S, and moisture to achieve >90% pure methane.',
      },
      {
        step: '05',
        assetKey: 'medallionCleanVillage',
        titleHi: 'मानक संपीड़न व सुरक्षा जाँच',
        titleEn: 'Certified Compression',
        descHi:
          'PESO एवं सरकारी मानकों के अनुसार स्वीकृत उच्च-दबाव कैस्केड सिलेंडर में संपीड़न।',
        descEn:
          'Compressing purified gas into PESO-certified high-pressure cylinders under strict safety norms.',
      },
      {
        step: '06',
        assetKey: 'medallionOrganic',
        titleHi: 'स्वच्छ परिवहन व जैविक खेती',
        titleEn: 'Clean Mobility & Farm Return',
        descHi:
          'प्रमाणित CBG का स्वच्छ ईंधन उपयोग और फ़र्मेन्टेड ऑर्गेनिक खाद (FOM) का खेतों में लाभ।',
        descEn:
          'Using certified CBG for clean transport while returning fermented organic manure to district farms.',
      },
    ],
    roleTitleHi: 'इस मिशन में GOVEDA की भूमिका',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'हम सही तकनीकी जानकारी, गोबर क्लस्टर आकलन और सुरक्षित बायोगैस मॉडल अपनाने में ग्रामीण समुदायों व गौशालाओं का मार्गदर्शन करते हैं।',
    roleLeadEn:
      'We focus on honest technical literacy, dung-cluster feasibility reviews, and safe biogas adoption across villages and Gaushalas.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'घरेलू व गौशाला बायोगैस जागरूकता',
        titleEn: 'Safe Biogas Literacy',
        descHi:
          'सही क्षमता के बायोगैस प्लांट, रखरखाव और जैव-स्लरी के कृषि उपयोग पर सरल हिंदी मार्गदर्शन।',
        descEn:
          'Practical guidance on choosing the right plant size, maintenance habits, and applying bio-slurry to soil.',
      },
      {
        num: '02',
        titleHi: 'जिला CBG व्यवहार्यता अध्ययन',
        titleEn: 'Cluster CBG Feasibility',
        descHi:
          'आसपास की गौशालाओं व डेयरियों के गोबर आकलन हेतु प्रारंभिक व्यवहार्यता और तकनीकी साझेदार संवाद।',
        descEn:
          'Mapping multi-Gaushala dung availability to evaluate proposed district-level CBG plant feasibility.',
      },
      {
        num: '03',
        titleHi: 'सुरक्षा एवं नियामक स्पष्टता',
        titleEn: 'Safety & Regulatory Clarity',
        descHi:
          'गलत या असुरक्षित जुगाड़ विधियों से ग्रामीणों को सचेत रखना और केवल प्रमाणित इंजीनियरिंग मानकों को बढ़ावा देना।',
        descEn:
          'Protecting villagers from unsafe improvised filling methods and promoting certified engineering norms.',
      },
    ],
    safeguardTitleHi: 'अत्यंत महत्वपूर्ण तकनीकी एवं सुरक्षा चेतावनी',
    safeguardTitleEn: 'Critical Technical & Safety Notice',
    safeguardPoints: [
      {
        hi: 'कच्ची बायोगैस या CBG को कभी भी घरेलू LPG सिलेंडर में न भरें—यह गंभीर सुरक्षा जोखिम है और कानूनन प्रतिबंधित है।',
        en: 'NEVER fill raw biogas or CBG into domestic LPG cylinders—this is extremely dangerous and strictly illegal.',
      },
      {
        hi: 'जिला स्तरीय CBG संयंत्र अभी प्रस्तावित एवं व्यवहार्यता अध्ययन (Feasibility / Proposal) चरण में हैं, इन्हें चालू संयंत्र के रूप में न माना जाए।',
        en: 'District-level CBG plants are currently at feasibility and proposal stage and are NOT presented as operational plants.',
      },
      {
        hi: 'किसी भी बायोगैस या CBG इकाई की स्थापना केवल प्रमाणित तकनीकी विशेषज्ञों व लागू सरकारी सुरक्षा स्वीकृतियों के अधीन ही की जाती है।',
        en: 'Any biogas or CBG installation requires qualified engineers and compliance with applicable Indian safety regulations.',
      },
    ],
    faqs: [
      {
        qHi: 'एक सामान्य किसान परिवार के लिए कितने पशुओं से बायोगैस चल सकती है?',
        qEn: 'How many cattle are needed for a family household biogas unit?',
        aHi: 'सामान्यतः 2 से 4 स्वस्थ गाय/भैंसों के दैनिक गोबर से एक छोटे परिवार के लिए प्रतिदिन रसोई योग्य बायोगैस तैयार हो सकती है।',
        aEn: 'Typically, daily dung from 2 to 4 healthy cattle is sufficient to run a 2 m³ household cooking biogas unit.',
      },
      {
        qHi: 'क्या बायोगैस निकालने के बाद गोबर की खाद कमजोर हो जाती है?',
        qEn: 'Does dung lose fertilizer value after making biogas?',
        aHi: 'बिल्कुल नहीं—बल्कि डाइजेस्टर से निकलने वाली जैव-स्लरी (Bio-Slurry) खरपतवार के बीजों से मुक्त और नाइट्रोजन से भरपूर होने के कारण कच्चे गोबर से अधिक प्रभावी खाद बनती है।',
        aEn: 'On the contrary—digested bio-slurry retains rich nitrogen and micronutrients while eliminating weed seeds, making it superior to raw dung.',
      },
      {
        qHi: 'क्या बायोगैस को सामान्य LPG सिलेंडर में भरकर इस्तेमाल किया जा सकता है?',
        qEn: 'Can biogas be filled into normal domestic LPG cylinders?',
        aHi: 'कभी नहीं। LPG और बायोगैस के दबाव व रासायनिक गुण पूरी तरह भिन्न हैं। घरेलू बायोगैस केवल कम दबाव के सीधे पाइप और बायोगैस बर्नर से ही उपयोग की जानी चाहिए।',
        aEn: 'Never. LPG and methane have completely different pressures and safety specs. Household biogas must only flow via low-pressure piping to dedicated biogas burners.',
      },
      {
        qHi: 'CBG प्लांट लगाने के लिए कितनी गोबर मात्रा चाहिए होती है?',
        qEn: 'How much feedstock does a commercial CBG plant need?',
        aHi: 'व्यावसायिक CBG संयंत्र के लिए प्रतिदिन कई टन गोबर व कृषि अवशेषों की निरंतर आपूर्ति, शुद्धिकरण मशीनरी और सरकारी स्वीकृतियाँ आवश्यक होती हैं—इसीलिए क्लस्टर व्यवहार्यता अध्ययन ज़रूरी है।',
        aEn: 'Commercial CBG requires many tonnes of consistent daily dung/biomass, industrial scrubbers, and statutory approvals—making cluster feasibility studies essential.',
      },
      {
        qHi: 'सर्दियों में बायोगैस उत्पादन कम क्यों होता है और इसका उपाय क्या है?',
        qEn: 'Why does biogas slow slightly in winter?',
        aHi: 'ठंडे मौसम में जीवाणुओं की गतिविधि धीमी पड़ती है। धूप वाले स्थान का चयन, गुनगुना पानी मिलाना और उचित इन्सुलेशन से सर्दियों में भी अच्छा उत्पादन मिलता है।',
        aEn: 'Cold temperatures slow microbial digestion. Sunny siting, lukewarm mixing water, and good dome insulation keep winter output steady.',
      },
      {
        qHi: 'मेरी गौशाला या डेयरी इस मिशन में कैसे जुड़ सकती है?',
        qEn: 'How can my Gaushala or dairy express interest?',
        aHi: 'नीचे दिए गए पंजीकरण फॉर्म में गौशाला/पशुपालक श्रेणी चुनकर अपने जिले और पशु संख्या की जानकारी दर्ज करें ताकि तकनीकी आकलन संवाद शुरू हो सके।',
        aEn: 'Use the mission registration form below under Gaushala or Farmer category with your district and cattle count to initiate a feasibility dialogue.',
      },
    ],
  },

  /* ==========================================================================
     MISSION 05: ORGANIC & MODERN FARMING
     ========================================================================== */
  'organic-farming': {
    slug: 'organic-farming',
    heroVignette: 'missionVignette05Organic',
    explainerVignette: 'vignetteGaushalaCompost',
    explainerCaptionHi:
      'मिट्टी की जाँच, जीवामृत, मल्चिंग और ड्रिप सिंचाई—कम पानी में उपजाऊ और टिकाऊ खेती का वैज्ञानिक संगम।',
    explainerCaptionEn:
      'Soil testing, organic humus, mulching, and drip irrigation—blending traditional wisdom with modern agronomy.',
    horizonTop: 'carbon',
    horizonBottom: 'sandstone',
    whyEyebrowHi: '01 · क्यों ज़रूरी है जैविक एवं आधुनिक खेती?',
    whyEyebrowEn: '01 · Why Soil-First Modern Farming Matters',
    whyTitleHi: 'कठोर होती मिट्टी, गिरता भू-जल और बढ़ती खेती की लागत',
    whyTitleEn: 'Hardening Soils, Falling Water Tables & Rising Input Costs',
    whyLeadHi:
      'असंतुलित रासायनिक खाद व कीटनाशकों के अत्यधिक उपयोग से खेतों की मिट्टी सख्त हो रही है, सूक्ष्मजीव कम हो रहे हैं और किसान की लागत लगातार बढ़ रही है। विज्ञान आधारित जैविक व आधुनिक खेती (ड्रिप, मिट्टी जाँच, कृषि-वानिकी) किसान की जमीन को फिर से जीवित बनाती है।',
    whyLeadEn:
      'Years of unbalanced chemical use have depleted organic carbon and beneficial microbes from farm soils while driving up annual input bills. Combining soil testing, drip irrigation, and phased organic nutrition revives living earth.',
    realities: [
      {
        num: '01',
        titleHi: 'मिट्टी में घटता जैविक कार्बन',
        titleEn: 'Depleted Soil Organic Carbon',
        descHi:
          'जैविक पदार्थ कम होने से मिट्टी की पानी रोकने की क्षमता घट जाती है और फसल को बार-बार सिंचाई चाहिए।',
        descEn:
          'Without organic humus, topsoil loses moisture rapidly and crops suffer quickly during dry spells.',
      },
      {
        num: '02',
        titleHi: 'खारे पानी व सिंचाई की चुनौती',
        titleEn: 'Water Salinity & Scarcity',
        descHi:
          'राजस्थान के अनेक क्षेत्रों में बोरवेल का पानी खारा (High EC) है—बिना जाँच के सिंचाई से खेत ऊसर होने लगते हैं।',
        descEn:
          'High salinity in groundwater gradually degrades topsoil unless tested and managed with drip and gypsum/organic matter.',
      },
      {
        num: '03',
        titleHi: 'बढ़ता रासायनिक खाद-दवा का खर्च',
        titleEn: 'Escalating Input Debt',
        descHi:
          'हर मौसम में महँगी दवाइयों व खाद पर निर्भरता किसान की शुद्ध बचत को कम कर देती है।',
        descEn:
          'Heavy dependence on purchased chemical sprays erodes smallholder margins season after season.',
      },
      {
        num: '04',
        titleHi: 'सही वैज्ञानिक मार्गदर्शन का अभाव',
        titleEn: 'Need for Practical Agronomy',
        descHi:
          'किसान जैविक खेती अपनाना चाहते हैं, पर अचानक बदलाव में उपज गिरने का डर रहता है—इसलिए चरणबद्ध (Phased) तरीका ज़रूरी है।',
        descEn:
          'Farmers want cleaner farming without sudden yield shock—which is why a phased, soil-tested transition is vital.',
      },
    ],
    whatTitleHi: 'जैविक + आधुनिक खेती = संतुलित और समझदार कृषि',
    whatTitleEn: 'Organic Wisdom Meets Modern Precision Farming',
    whatParagraphs: [
      {
        hi: 'GOVEDA जैविक खेती को अंधे प्रयोग के रूप में नहीं, बल्कि विज्ञान के साथ जोड़ता है। शुरुआत हमेशा “मिट्टी और सिंचाई पानी की लैब जाँच” (pH, EC, Organic Carbon) से होती है, ताकि किसान जान सके कि उसके खेत को वास्तव में किस पोषण की ज़रूरत है।',
        en: 'GOVEDA approaches organic farming scientifically, not blindly. Every field journey starts with soil and irrigation water testing (pH, EC, Organic Carbon) so farmers know exactly what their land needs.',
      },
      {
        hi: 'ड्रिप सिंचाई, मल्चिंग, गौशाला के जीवामृत/वर्मीकम्पोस्ट और खेत की मेड़ों पर देशी पेड़ों (कृषि-वानिकी) को जोड़कर पानी की भारी बचत और मिट्टी की प्राकृतिक उर्वरता का पुनर्निर्माण किया जाता है।',
        en: 'By pairing drip irrigation and crop-residue mulching with Gaushala compost, Jeevamrit, and farm-border native trees, farmers conserve water while rebuilding resilient soil life.',
      },
    ],
    howTitleHi: 'चरणबद्ध जैविक बदलाव की 5 वैज्ञानिक सीढ़ियाँ',
    howTitleEn: '5 Scientific Steps to a Safe, Phased Transition',
    howLeadHi:
      'एक ही दिन में सब रसायन बंद करने के बजाय, 2–3 वर्षों के समझदार क्रम से मिट्टी की सेहत और उपज दोनों सुरक्षित रखें:',
    howLeadEn:
      'Protect your harvest while restoring soil health through a calm, multi-season transition:',
    steps: [
      {
        step: '01',
        assetKey: 'medallionOrganic',
        titleHi: 'मिट्टी व पानी की वैज्ञानिक जाँच',
        titleEn: 'Soil & Water Testing',
        descHi:
          'खेत की मिट्टी का pH, जैविक कार्बन और बोरवेल पानी की लवणता (EC) की रिपोर्ट समझना।',
        descEn:
          'Testing topsoil pH, organic carbon, and borewell water salinity before altering inputs.',
      },
      {
        step: '02',
        assetKey: 'vignetteGaushalaCompost',
        titleHi: 'जैविक खाद व जीवामृत निर्माण',
        titleEn: 'On-Farm Bio-Inputs',
        descHi:
          'गोबर खाद, वर्मीकम्पोस्ट, जीवामृत व नीमास्त्र से मिट्टी के लाभकारी जीवाणु वापस बढ़ाना।',
        descEn:
          'Rebuilding soil microbes with vermicompost, Jeevamrit, and natural neem-based pest shields.',
      },
      {
        step: '03',
        assetKey: 'medallionCleanVillage',
        titleHi: 'ड्रिप सिंचाई व मल्चिंग',
        titleEn: 'Drip & Moisture Mulching',
        descHi:
          'बूंद-बूंद सिंचाई और फसल अवशेष की मल्चिंग से वाष्पीकरण रोकना व 40–50% तक जल संरक्षण।',
        descEn:
          'Using drip lines and organic straw mulching to keep roots cool and cut irrigation waste.',
      },
      {
        step: '04',
        assetKey: 'medallionHarit',
        titleHi: 'मेड़ पर पेड़ व फसल विविधता',
        titleEn: 'Border Agroforestry',
        descHi:
          'खेत की मेड़ पर देशी व फलदार पेड़ तथा दलहन-तिलहन मिश्रित खेती से अतिरिक्त सुरक्षा।',
        descEn:
          'Planting native border trees and legumes that fix nitrogen and buffer crops from hot desert winds.',
      },
      {
        step: '05',
        assetKey: 'medallionCarbon',
        titleHi: 'चरणबद्ध बदलाव व रिकॉर्ड',
        titleEn: 'Phased Scaling & Records',
        descHi:
          'पहले छोटे हिस्से (20–30%) पर प्रयोग कर अनुभव लेना और सफल होने पर पूरे खेत में विस्तार।',
        descEn:
          'Starting on 20–30% of farm area, tracking real harvest outcomes, and scaling steadily.',
      },
    ],
    roleTitleHi: 'किसानों के साथ GOVEDA की भूमिका',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'कृषि विज्ञान केंद्रों, मिट्टी जाँच प्रयोगशालाओं और अनुभवी प्रशिक्षकों के ज्ञान को सरल भाषा में किसान के खेत तक पहुँचाना।',
    roleLeadEn:
      'Translating soil science, water management, and agroforestry practices into clear, village-level farmer orientation.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'मिट्टी व जल परीक्षण मार्गदर्शन',
        titleEn: 'Lab Testing Orientation',
        descHi:
          'सरकारी/मान्यता प्राप्त लैब में सही मिट्टी सैंपल लेने की विधि और रिपोर्ट पढ़ने का सरल प्रशिक्षण।',
        descEn:
          'Teaching proper soil sampling techniques and helping farmers interpret official soil health cards.',
      },
      {
        num: '02',
        titleHi: 'मॉडल खेत व किसान पाठशाला',
        titleEn: 'Demo Plots & Field Schools',
        descHi:
          'गाँव स्तर पर जैविक खाद निर्माण, मल्चिंग और ड्रिप प्रबंधन के व्यावहारिक प्रदर्शन।',
        descEn:
          'Practical village demonstrations of composting, mulching, and integrated pest management.',
      },
      {
        num: '03',
        titleHi: 'गौशाला व कृषि-वानिकी से जुड़ाव',
        titleEn: 'Gaushala & Tree Integration',
        descHi:
          'नज़दीकी गौशालाओं से शुद्ध जैविक खाद और हरित राजस्थान अभियान से देशी पौधों का समन्वय।',
        descEn:
          'Linking farms with nearby Gaushala manure supplies and native border saplings.',
      },
    ],
    safeguardTitleHi: 'ईमानदार कृषि सलाह (Honest Agronomy Note)',
    safeguardTitleEn: 'Honest Agronomy & Transition Safeguard',
    safeguardPoints: [
      {
        hi: 'यदि खेत वर्षों से रासायनिक उर्वरकों पर निर्भर रहा है, तो रातोंरात सभी रासायनिक खाद बंद न करें—इससे प्रारंभिक उपज में गिरावट आ सकती है। हमेशा 2–3 वर्षों में चरणबद्ध (Phased) बदलाव अपनाएँ।',
        en: 'Never stop all chemical fertilizers overnight on heavily depleted soil, as sudden shock can reduce initial yields. Always transition gradually over 2–3 seasons.',
      },
      {
        hi: 'किसी भी “जैविक सर्टिफिकेट” या निश्चित अतिरिक्त बाज़ार भाव का झूठा आश्वासन नहीं दिया जाता—प्रमाणन सरकारी/मान्यता प्राप्त एजेंसियों के मानकों के अधीन होता है।',
        en: 'No automatic organic certification or guaranteed premium price is promised; formal certification follows official agency timelines.',
      },
    ],
    faqs: [
      {
        qHi: 'क्या जैविक खेती शुरू करते ही पहले साल उपज कम हो जाती है?',
        qEn: 'Does harvest always drop in Year 1 of organic farming?',
        aHi: 'यदि बिना तैयारी के एक साथ सारे रसायन बंद किए जाएँ तो उपज घट सकती है। लेकिन पहले छोटे हिस्से में, पर्याप्त कम्पोस्ट व जीवामृत के साथ चरणबद्ध बदलाव करने पर मिट्टी संभलती है और नुकसान से बचा जा सकता है।',
        aEn: 'Sudden cold-turkey switches can dip yields. Starting on a portion of land with ample vermicompost, Jeevamrit, and soil-test guidance prevents yield shock.',
      },
      {
        qHi: 'खेत की मिट्टी की जाँच कितने समय में करवानी चाहिए?',
        qEn: 'How often should farmers test their soil?',
        aHi: 'हर 2 से 3 वर्ष में एक बार, फसल कटाई के बाद और बुवाई से पहले मिट्टी की जाँच करवाना सबसे उपयोगी होता है।',
        aEn: 'Testing once every 2 to 3 years between harvest and the next sowing gives the clearest picture of soil recovery.',
      },
      {
        qHi: 'राजस्थान के कम पानी वाले क्षेत्रों में कौन-सी तकनीक सबसे कारगर है?',
        qEn: 'Which technique saves the most water in arid Rajasthan?',
        aHi: 'ड्रिप सिंचाई, फसल अवशेष से मल्चिंग और खेत की मेड़ों पर छायादार देशी वृक्ष (खेजड़ी, रोहिड़ा, आंवला) हवा की गर्मी घटाकर नमी बचाते हैं।',
        aEn: 'Drip irrigation combined with straw mulching and windbreak native border trees cuts evaporation dramatically.',
      },
      {
        qHi: 'क्या जीवामृत घर पर बिना बड़ी लागत के बनाया जा सकता है?',
        qEn: 'Can Jeevamrit be made affordably on the farm?',
        aHi: 'हाँ। देशी गाय का गोबर, गोमूत्र, गुड़, बेसन और मेड़ की जीवित मिट्टी से 200 लीटर ड्रम में बेहद कम खर्च पर जीवामृत तैयार होता है।',
        aEn: 'Yes—using indigenous cow dung, urine, jaggery, pulse flour, and living bund soil in a simple 200-litre drum.',
      },
      {
        qHi: 'खेत की मेड़ पर पेड़ लगाने से मुख्य फसल को छाया से नुकसान तो नहीं होगा?',
        qEn: 'Will border trees shade out my main crops?',
        aHi: 'सही दूरी और राजस्थान की उपयुक्त प्रजातियों (जैसे खेजड़ी—जो मिट्टी में नाइट्रोजन बढ़ाती है) के चयन से फसल को लू से सुरक्षा मिलती है और उपज बेहतर रहती है।',
        aEn: 'Proper spacing and Rajasthan-native species like Khejri actually protect crops from scorching winds and enrich topsoil nitrogen.',
      },
      {
        qHi: 'किसान प्रशिक्षण शिविर में कैसे शामिल हो सकते हैं?',
        qEn: 'How can farmers join an orientation workshop?',
        aHi: 'नीचे किसान पंजीकरण फॉर्म भरकर अपना गाँव व जिला दर्ज करें—नज़दीकी प्रशिक्षण सत्र की सूचना आपको दी जाएगी।',
        aEn: 'Fill out the Farmer Registration form below with your village and district to receive local workshop announcements.',
      },
    ],
  },

  /* ==========================================================================
     MISSION 06: CLEAN INDIA & PLASTIC-FREE VILLAGES
     ========================================================================== */
  'clean-india-plastic-free': {
    slug: 'clean-india-plastic-free',
    heroVignette: 'vignetteCleanClothbag',
    explainerVignette: 'missionVignette06Stepwell',
    explainerCaptionHi:
      'कपड़े का थैला, गीले-सूखे कचरे का पृथक्करण और स्वच्छ जल स्रोत—हर गाँव को प्लास्टिक-मुक्त बनाने की व्यावहारिक शुरुआत।',
    explainerCaptionEn:
      'Reusable cotton bags, dry/wet segregation, and clean village water sources—simple daily habits that protect soil and cattle.',
    horizonTop: 'hills',
    horizonBottom: 'fort',
    whyEyebrowHi: '01 · क्यों ज़रूरी है स्वच्छ व प्लास्टिक-मुक्त गाँव?',
    whyEyebrowEn: '01 · Why Plastic-Free, Clean Villages Matter',
    whyTitleHi: 'सिंगल-यूज़ प्लास्टिक हमारी मिट्टी, नालियों और गोवंश के लिए गंभीर खतरा है',
    whyTitleEn: 'Single-Use Plastic Chokes Village Soil, Drains & Stray Cattle',
    whyLeadHi:
      'आज गाँवों के बाज़ारों, मेलों, मंदिरों और खेतों के किनारे उड़ती पॉलीथिन न केवल गंदगी फैलाती है, बल्कि गायों के पेट में जाकर उनकी जान लेती है और वर्षा जल को जमीन में उतरने से रोकती है। समाधान बड़ा नहीं—हर घर की छोटी आदत से शुरू होता है।',
    whyLeadEn:
      'Discarded polythene around rural haats, temples, and drains is swallowed by grazing cattle, blocks monsoon recharge, and pollutes farm earth for centuries. The solution starts with simple, affordable community alternatives.',
    realities: [
      {
        num: '01',
        titleHi: 'गोवंश व पशुधन पर सीधा संकट',
        titleEn: 'Lethal Danger to Village Cattle',
        descHi:
          'खाने के साथ फेंकी गई पॉलीथिन निगलने से हज़ारों निराश्रित गायें व पशु गंभीर बीमारी का शिकार होते हैं।',
        descEn:
          'Stray cows ingest food scraps wrapped in plastic bags, causing severe suffering and preventable deaths.',
      },
      {
        num: '02',
        titleHi: 'जल स्रोतों व नालियों का जाम होना',
        titleEn: 'Clogged Drains & Polluted Ponds',
        descHi:
          'प्लास्टिक कचरा गाँव के जोहड़, तालाब व नालियों को अवरुद्ध कर गंदे पानी और मच्छरों को बढ़ावा देता है।',
        descEn:
          'Plastic waste blocks village drainage channels and contaminates traditional ponds and stepwells.',
      },
      {
        num: '03',
        titleHi: 'कचरा जलाने से ज़हरीला धुआँ',
        titleEn: 'Toxic Open Waste Burning',
        descHi:
          'प्लास्टिक व मिश्रित कचरा जलाने से हवा में घातक गैसें फैलती हैं जो बच्चों व बुजुर्गों के स्वास्थ्य को नुकसान पहुँचाती हैं।',
        descEn:
          'Burning unsorted plastic piles releases toxic fumes directly into rural courtyards and schools.',
      },
      {
        num: '04',
        titleHi: 'मंदिर फूलों व जैविक कचरे की अनदेखी',
        titleEn: 'Untapped Organic Compost Value',
        descHi:
          'गीले कचरे और मंदिर के फूलों को अलग रखें तो वे दुर्गंध नहीं, बल्कि उत्तम कम्पोस्ट खाद बन जाते हैं।',
        descEn:
          'Separated wet kitchen waste and temple flowers easily turn into fragrant organic compost instead of litter.',
      },
    ],
    whatTitleHi: 'स्वच्छ और प्लास्टिक-मुक्त गाँव का सरल व्यावहारिक मॉडल',
    whatTitleEn: 'A Practical, Everyday Model for Clean Rural Communities',
    whatParagraphs: [
      {
        hi: 'स्वच्छता केवल एक दिन झाड़ू लगाने का कार्यक्रम नहीं है—यह “विकल्प और आदत” का संगम है। जब गाँव के महिला स्वयं सहायता समूह (SHGs) मजबूत, सस्ते कपड़े के थैले बनाते हैं और दुकानदार-ग्राहक उन्हें अपनाते हैं, तो पॉलीथिन अपने आप बाहर हो जाती है।',
        en: 'Cleanliness is built through practical alternatives, not one-day photo drives. When local Women SHGs stitch durable, affordable cotton bags adopted by village shops and families, single-use polythene fades out naturally.',
      },
      {
        hi: 'इसके साथ हर घर व स्कूल में दो-डिब्बा पृथक्करण (गीला कचरा → खाद, सूखा कचरा → रीसाइक्लिंग) और मंदिरों के फूलों से कम्पोस्ट निर्माण को जोड़कर गाँव को स्थायी रूप से स्वच्छ रखा जाता है।',
        en: 'Paired with two-bin home and school segregation (wet waste to compost, dry waste to recycling) and temple floral composting, villages achieve lasting sanitation.',
      },
    ],
    howTitleHi: 'प्लास्टिक-मुक्त गाँव की 5 सरल कड़ियाँ',
    howTitleEn: '5 Simple Steps to a Plastic-Free Village',
    howLeadHi:
      'स्कूल, पंचायत, दुकानदार और महिला समूह मिलकर किसी भी गाँव में यह मॉडल लागू कर सकते हैं:',
    howLeadEn:
      'How schools, shopkeepers, panchayats, and women’s groups transform village hygiene together:',
    steps: [
      {
        step: '01',
        assetKey: 'vignetteCleanClothbag',
        titleHi: 'कपड़े के थैले का विकल्प',
        titleEn: 'SHG Cloth Bag Drive',
        descHi:
          'महिला स्वयं सहायता समूहों द्वारा तैयार मजबूत सूती थैलों का गाँव के बाज़ार व मेलों में प्रसार।',
        descEn:
          'Circulating durable cotton bags stitched by local Women SHGs across haats and grocery shops.',
      },
      {
        step: '02',
        assetKey: 'medallionCleanVillage',
        titleHi: 'गीला व सूखा कचरा पृथक्करण',
        titleEn: 'Two-Bin Segregation',
        descHi:
          'हर घर, स्कूल और दुकान पर गीले (जैविक) व सूखे (पुनर्चक्रण योग्य) कचरे को अलग रखने की आदत।',
        descEn:
          'Simple wet-and-dry waste separation at homes, schools, and local shops.',
      },
      {
        step: '03',
        assetKey: 'vignetteGaushalaCompost',
        titleHi: 'मंदिर फूल व जैविक खाद',
        titleEn: 'Floral & Wet Composting',
        descHi:
          'मंदिरों के फूलों व रसोई के गीले कचरे को पिट-कम्पोस्ट में बदलकर बगीचों व पौधों में उपयोग।',
        descEn:
          'Turning temple flower offerings and kitchen organics into clean pit compost for village saplings.',
      },
      {
        step: '04',
        assetKey: 'medallionSkills',
        titleHi: 'स्कूल स्वच्छता क्लब व युवा दल',
        titleEn: 'School Eco-Clubs',
        descHi:
          'बच्चों व कॉलेज छात्रों को प्लास्टिक-मुक्त टिफिन, बोतल और स्वच्छ परिसर का नेतृत्व देना।',
        descEn:
          'Empowering students to lead plastic-free campuses, eco-pledges, and clean water awareness.',
      },
      {
        step: '05',
        assetKey: 'medallionHeritage',
        titleHi: 'मासिक श्रमदान व जल स्रोत सफ़ाई',
        titleEn: 'Water Body & Lane Care',
        descHi:
          'बावड़ियों, तालाबों, मंदिर परिसरों और मुख्य मार्गों की नियमित सामुदायिक स्वच्छता।',
        descEn:
          'Monthly community drives keeping stepwells, ponds, temples, and village lanes plastic-free.',
      },
    ],
    roleTitleHi: 'स्वच्छता अभियान में GOVEDA की भूमिका',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'जागरूकता सामग्री, महिला SHG थैला प्रशिक्षण और स्कूल-पंचायत समन्वय के ज़रिए स्वच्छ आदतों को स्थायी बनाना।',
    roleLeadEn:
      'Connecting awareness workshops, SHG cloth-bag production, and school/panchayat volunteer drives.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'महिला SHG कपड़े के थैले की पहल',
        titleEn: 'Cloth-Bag Livelihood Link',
        descHi:
          'स्वच्छता को महिला आजीविका से जोड़कर गाँव में ही किफ़ायती सूती थैलों की उपलब्धता बढ़ाना।',
        descEn:
          'Linking waste reduction directly to rural women’s income through community cloth-bag stitching.',
      },
      {
        num: '02',
        titleHi: 'स्कूल व कॉलेज स्वच्छता संवाद',
        titleEn: 'Student Clean-Campus Drives',
        descHi:
          'बच्चों के माध्यम से हर परिवार तक पॉलीथिन बहिष्कार व कचरा पृथक्करण का संदेश पहुँचाना।',
        descEn:
          'Mobilising school and college students as everyday ambassadors for plastic-free households.',
      },
      {
        num: '03',
        titleHi: 'मंदिर व सामुदायिक कम्पोस्ट मॉडल',
        titleEn: 'Temple & Village Composting',
        descHi:
          'सार्वजनिक स्थलों व मंदिरों के लिए सरल फूल-कम्पोस्टिंग और स्वच्छ जल निकासी मार्गदर्शन।',
        descEn:
          'Guiding temples and gram committees on simple, odour-free floral and organic waste composting.',
      },
    ],
    safeguardTitleHi: 'सामुदायिक सहभागिता एवं पारदर्शिता सूचना',
    safeguardTitleEn: 'Community Participation & Practical Scope',
    safeguardPoints: [
      {
        hi: 'स्वच्छता व प्लास्टिक-मुक्ति अभियान स्थानीय ग्राम पंचायत, नगर निकाय, स्कूल और स्वयंसेवकों के साझा सहयोग से ही सफल होते हैं।',
        en: 'Clean-village initiatives work in collaboration with Gram Panchayats, local municipalities, schools, and voluntary citizens.',
      },
      {
        hi: 'कचरा जलाने के बजाय सदैव सुरक्षित पृथक्करण, कम्पोस्टिंग और अधिकृत रीसाइक्लिंग श्रृंखला का ही समर्थन किया जाता है।',
        en: 'We strictly discourage burning waste and promote safe source segregation, composting, and authorized recycling.',
      },
    ],
    faqs: [
      {
        qHi: 'क्या हमारा स्कूल या कॉलेज स्वच्छता अभियान से जुड़ सकता है?',
        qEn: 'Can our school or college host a clean-campus drive?',
        aHi: 'हाँ। नीचे पंजीकरण फॉर्म में “स्कूल / कॉलेज” श्रेणी चुनकर आप स्वच्छ परिसर व प्लास्टिक-मुक्त जागरूकता सत्र के लिए पंजीकरण कर सकते हैं।',
        aEn: 'Yes. Register under the School / College category below to coordinate a plastic-free awareness and eco-club session.',
      },
      {
        qHi: 'महिला समूह कपड़े के थैले बनाने के अभियान से कैसे जुड़ें?',
        qEn: 'How can Women SHGs join the cloth-bag initiative?',
        aHi: 'नीचे “महिला SHG” श्रेणी में पंजीकरण करें। यह पहल मिशन 6 (स्वच्छता) और मिशन 8 (महिला सशक्तिकरण) दोनों को जोड़ती है।',
        aEn: 'Select the Women SHG category in the form below—this bridges Mission 6 (Clean Villages) directly with Mission 8 (Women Empowerment).',
      },
      {
        qHi: 'मंदिर के फूलों से खाद बनाने में बदबू तो नहीं आती?',
        qEn: 'Does temple floral composting produce bad odour?',
        aHi: 'नहीं। यदि फूलों में से प्लास्टिक/धागा हटाकर उन्हें सूखे पत्तों व थोड़ी मिट्टी की परतों के साथ हवादार पिट में रखा जाए, तो 45–60 दिन में बिना दुर्गंध की उत्तम खाद बनती है।',
        aEn: 'Not at all. Once plastic ribbons are removed and petals are layered with dry leaves and soil in an aerated pit, clean odour-free compost forms in 45–60 days.',
      },
      {
        qHi: 'गाँव में सूखे प्लास्टिक कचरे का क्या किया जाए?',
        qEn: 'What should villages do with dry recyclable plastic?',
        aHi: 'इसे कभी न जलाएँ। साफ सूखे प्लास्टिक को अलग बोरों में एकत्रित कर स्थानीय कबाड़ी/अधिकृत रीसाइक्लिंग संग्रहण केंद्र तक पहुँचाया जाता है।',
        aEn: 'Never burn it. Clean dry plastic is bagged separately and handed over to local aggregators or authorized recycling channels.',
      },
      {
        qHi: 'क्या स्वयंसेवक बनने के लिए कोई शुल्क है?',
        qEn: 'Is there any fee to join as a cleanliness volunteer?',
        aHi: 'नहीं। सामुदायिक स्वच्छता स्वयंसेवक के रूप में जुड़ना पूरी तरह स्वैच्छिक और निःशुल्क है।',
        aEn: 'No. Joining as a community cleanliness volunteer is completely voluntary and free.',
      },
      {
        qHi: 'क्या यह अभियान केवल गाँवों के लिए है या शहरों के लिए भी?',
        qEn: 'Is this mission only for villages or towns too?',
        aHi: 'यह ग्रामीण व शहरी दोनों समुदायों—विशेषकर बाज़ारों, स्कूलों, मंदिरों और ऐतिहासिक जल स्रोतों—के लिए समान रूप से खुला है।',
        aEn: 'It serves both villages and towns—especially local markets, schools, temples, and historic water bodies.',
      },
    ],
  },

  /* ==========================================================================
     MISSION 07: SKILL DEVELOPMENT & EMPLOYMENT
     ========================================================================== */
  'skill-development': {
    slug: 'skill-development',
    heroVignette: 'missionVignette08Skills',
    explainerVignette: 'medallionSkills',
    explainerCaptionHi:
      'व्यावहारिक भाषा, डिजिटल कौशल, कार्यस्थल सुरक्षा और हरित उद्यमिता—युवाओं को आत्मविश्वासी बनाने वाला प्रशिक्षण मंच।',
    explainerCaptionEn:
      'Practical language fluency, digital literacy, workplace safety, and green entrepreneurship built for rural and semi-urban youth.',
    horizonTop: 'skills',
    horizonBottom: 'sandstone',
    whyEyebrowHi: '01 · क्यों ज़रूरी है कौशल विकास और भाषा प्रशिक्षण?',
    whyEyebrowEn: '01 · Why Practical Skills & Language Matter',
    whyTitleHi: 'डिग्री के साथ व्यावहारिक कौशल, संवाद और सुरक्षा अनुशासन ही असली आत्मविश्वास देता है',
    whyTitleEn: 'Practical Skills, Communication & Safety Discipline Unlock Real Opportunity',
    whyLeadHi:
      'ग्रामीण व कस्बाई युवाओं में अपार प्रतिभा और मेहनत है, लेकिन अंग्रेज़ी/विदेशी भाषा की झिझक, बुनियादी कंप्यूटर ज्ञान की कमी और असुरक्षित पलायन-अफवाहें उनकी राह रोकती हैं। सही प्रशिक्षण और ईमानदार मार्गदर्शन से युवा देश-विदेश के अवसरों के लिए स्वयं को सक्षम बना सकते हैं।',
    whyLeadEn:
      'Rural and small-town youth have immense talent, yet language hesitation, limited digital readiness, and misleading overseas-job rumours hold them back. Honest training builds genuine capability and safe career awareness.',
    realities: [
      {
        num: '01',
        titleHi: 'भाषा और संवाद की झिझक',
        titleEn: 'Language & Interview Hesitation',
        descHi:
          'योग्य होने के बावजूद अंग्रेज़ी या अंतर्राष्ट्रीय कार्य-संवाद की कमी से ग्रामीण युवा पीछे रह जाते हैं।',
        descEn:
          'Talented students often lose confidence in interviews simply due to lack of spoken English or structured language guidance.',
      },
      {
        num: '02',
        titleHi: 'डिजिटल व ऑफिस कौशल की कमी',
        titleEn: 'Digital Workplace Gap',
        descHi:
          'आज हर क्षेत्र में कंप्यूटर, डॉक्यूमेंट, स्प्रेडशीट और सुरक्षित ऑनलाइन कार्य का ज्ञान अनिवार्य हो गया है।',
        descEn:
          'Modern offices, agritech hubs, and small businesses rely daily on spreadsheets, documentation, and digital safety.',
      },
      {
        num: '03',
        titleHi: 'भ्रामक विदेश-नौकरी एजेंटों का खतरा',
        titleEn: 'Risk of Unverified Job Promises',
        descHi:
          'कई युवा बिना सही भाषा और नियम जाने झूठे वीज़ा/नौकरी के वादों में फँस जाते हैं—सच्ची जानकारी ही सबसे बड़ी सुरक्षा है।',
        descEn:
          'Unverified agents exploit youth with fake overseas job guarantees; honest pathway education protects families.',
      },
      {
        num: '04',
        titleHi: 'स्थानीय हरित स्वरोज़गार की संभावना',
        titleEn: 'Local Green Entrepreneurship',
        descHi:
          'पौध नर्सरी, जैविक खाद, सोलर रखरखाव और डिजिटल सेवाएँ गाँव में ही सम्मानजनक आजीविका दे सकती हैं।',
        descEn:
          'Native nurseries, organic compost units, solar maintenance, and rural tech services create dignified livelihoods at home.',
      },
    ],
    whatTitleHi: 'कौशल निर्माण + नैतिक मार्गदर्शन — बिना किसी झूठे वादे के',
    whatTitleEn: 'Structured Skill Building — With Zero False Guarantees',
    whatParagraphs: [
      {
        hi: 'GOVEDA का कौशल विकास मिशन चार व्यावहारिक धाराओं पर केंद्रित है: (1) जर्मन भाषा आधार (A1/A2), (2) अंग्रेज़ी संवाद व साक्षात्कार कौशल, (3) कंप्यूटर व डिजिटल कार्यकुशलता, और (4) ग्रामीण कृषि-आधारित हरित उद्यमिता।',
        en: 'GOVEDA’s Skill Development mission focuses on four practical tracks: (1) German A1/A2 foundation, (2) spoken English & interview confidence, (3) computer & digital literacy, and (4) rural green agro-entrepreneurship.',
      },
      {
        hi: 'इसके साथ सड़क सुरक्षा, कार्यस्थल अनुशासन, प्राथमिक उपचार (First Aid) और ड्राइवर सुरक्षा जागरूकता को भी शामिल किया गया है, ताकि युवा न केवल कुशल बल्कि जिम्मेदार नागरिक बनें।',
        en: 'Alongside core courses, we integrate workplace safety, First Aid fundamentals, and responsible driver discipline so learners grow into capable, dependable professionals.',
      },
    ],
    howTitleHi: 'कौशल प्रशिक्षण से करियर तैयारी के 5 स्पष्ट चरण',
    howTitleEn: '5 Clear Steps From Orientation to Career Readiness',
    howLeadHi:
      'पंजीकरण से लेकर बैच आवंटन, व्यावहारिक अभ्यास और ईमानदार करियर मार्गदर्शन तक की पूरी प्रक्रिया:',
    howLeadEn:
      'A transparent pathway from initial interest to hands-on practice and realistic career guidance:',
    steps: [
      {
        step: '01',
        assetKey: 'medallionSkills',
        titleHi: 'रुचि व योग्यता पंजीकरण',
        titleEn: 'Course Interest Registration',
        descHi:
          'भाषा, कंप्यूटर या हरित उद्यमिता—अपनी शिक्षा व लक्ष्य के अनुसार सही ट्रैक का चयन।',
        descEn:
          'Select your preferred track—German, English, Digital Skills, or Green Enterprise.',
      },
      {
        step: '02',
        assetKey: 'missionVignette08Skills',
        titleHi: 'काउंसलिंग व बैच निर्धारण',
        titleEn: 'Honest Orientation & Batching',
        descHi:
          'कोर्स अवधि, माध्यम (ऑनलाइन/ऑफलाइन) और आवश्यक मेहनत की स्पष्ट जानकारी।',
        descEn:
          'Clear briefing on schedule, online/hybrid format, study commitment, and realistic outcomes.',
      },
      {
        step: '03',
        assetKey: 'medallionWomen',
        titleHi: 'व्यावहारिक अभ्यास व संवाद',
        titleEn: 'Interactive Practice Sessions',
        descHi:
          'केवल किताबें नहीं—रोज़ाना बोलने का अभ्यास, प्रोजेक्ट कार्य और डिजिटल असाइनमेंट।',
        descEn:
          'Daily speaking drills, hands-on computer tasks, and practical rural enterprise case studies.',
      },
      {
        step: '04',
        assetKey: 'medallionSenior',
        titleHi: 'कार्यस्थल सुरक्षा व अनुशासन',
        titleEn: 'Safety, First Aid & Ethics',
        descHi:
          'समयबद्धता, कार्यस्थल सुरक्षा, सड़क नियम और प्राथमिक उपचार का बुनियादी प्रशिक्षण।',
        descEn:
          'Essential habits of punctuality, workplace safety, road discipline, and basic First Aid.',
      },
      {
        step: '05',
        assetKey: 'medallionCarbon',
        titleHi: 'स्व-मूल्यांकन व अगला मार्गदर्शन',
        titleEn: 'Assessment & Next-Step Map',
        descHi:
          'प्रमाणित परीक्षाओं (जैसे Goethe A1/A2 आदि) या स्थानीय स्वरोज़गार की सही दिशा दिखाना।',
        descEn:
          'Guidance on appearing for recognized external exams or launching local green micro-ventures.',
      },
    ],
    roleTitleHi: 'इस मिशन में GOVEDA की भूमिका',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'अनुभवी प्रशिक्षकों, शैक्षणिक संस्थानों और ग्राम-स्तरीय युवाओं के बीच एक विश्वसनीय व किफ़ायती प्रशिक्षण सेतु।',
    roleLeadEn:
      'Bridging experienced trainers, educational institutions, and rural youth through accessible, honest skill programmes.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'किफ़ायती व सुलभ ग्रामीण बैच',
        titleEn: 'Accessible Rural Batches',
        descHi:
          'गाँव व छोटे कस्बों के छात्रों के लिए सरल हिंदी-सहायक व्याख्या के साथ व्यवस्थित प्रशिक्षण।',
        descEn:
          'Structured beginner-friendly batches designed specifically for Hindi-medium and rural learners.',
      },
      {
        num: '02',
        titleHi: 'अनुभवी प्रशिक्षकों का नेटवर्क',
        titleEn: 'Vetted Trainer Network',
        descHi:
          'भाषा शिक्षकों, आईटी पेशेवरों और कृषि उद्यमियों को छात्रों के मार्गदर्शन से जोड़ना।',
        descEn:
          'Connecting language teachers, IT mentors, and agro-entrepreneurs directly with learners.',
      },
      {
        num: '03',
        titleHi: 'पारदर्शी करियर साक्षरता',
        titleEn: 'Ethical Career Literacy',
        descHi:
          'युवाओं व अभिभावकों को आधिकारिक प्रक्रियाओं की सच्ची जानकारी देकर ठगी से बचाना।',
        descEn:
          'Educating youth and parents on official exam/admission processes to protect against fraud.',
      },
    ],
    safeguardTitleHi: 'अत्यंत महत्वपूर्ण पारदर्शिता सूचना (Zero Guarantee Policy)',
    safeguardTitleEn: 'Strict Transparency Policy — No Job or Visa Guarantees',
    safeguardPoints: [
      {
        hi: 'GOVEDA किसी भी विदेशी नौकरी, वीज़ा, वर्क परमिट, विश्वविद्यालय प्रवेश या निश्चित प्लेसमेंट की गारंटी नहीं देता है।',
        en: 'GOVEDA does NOT guarantee any overseas job, visa, work permit, university admission, or fixed placement.',
      },
      {
        hi: 'जर्मन (A1/A2) एवं अन्य प्रशिक्षण केवल भाषा, कौशल और जागरूकता निर्माण हेतु हैं—आधिकारिक प्रमाणन संबंधित अधिकृत परीक्षा बोर्ड के अधीन होता है।',
        en: 'German (A1/A2) and all training modules are purely for skill and language readiness; external certification depends on accredited exam boards.',
      },
      {
        hi: 'हर बैच की अवधि, माध्यम और शुल्क स्थिति (निःशुल्क / नाममात्र शुल्क) बैच आरंभ होने से पहले लिखित रूप में स्पष्ट की जाती है।',
        en: 'Exact batch duration, online/offline mode, and fee status are disclosed transparently before enrolment.',
      },
    ],
    faqs: [
      {
        qHi: 'क्या जर्मन A1/A2 सीखने के बाद जर्मनी में नौकरी या वीज़ा पक्का मिलता है?',
        qEn: 'Does completing German A1/A2 guarantee a job or visa in Germany?',
        aHi: 'नहीं। भाषा सीखना केवल पहला योग्यता चरण है। वीज़ा, प्रवेश या रोजगार पूरी तरह आधिकारिक दूतावास नियमों, नियोक्ता चयन और आपकी योग्यता पर निर्भर करता है। GOVEDA कोई गारंटी नहीं देता।',
        aEn: 'No. Language learning is only a foundational skill step. Visas, admissions, and hiring depend strictly on official rules and employer selection. GOVEDA gives zero guarantees.',
      },
      {
        qHi: 'क्या 10वीं या 12वीं के हिंदी माध्यम छात्र भी ये कोर्स कर सकते हैं?',
        qEn: 'Can 10th or 12th pass Hindi-medium students enrol?',
        aHi: 'हाँ। हमारे सभी फाउंडेशन कोर्स विशेष रूप से ग्रामीण व हिंदी माध्यम विद्यार्थियों की सुविधा को ध्यान में रखकर बनाए गए हैं।',
        aEn: 'Yes. All foundation tracks are crafted specifically to support Hindi-medium and rural learners comfortably.',
      },
      {
        qHi: 'क्या प्रशिक्षण ऑनलाइन होता है या केंद्र पर आकर?',
        qEn: 'Are classes held online or in person?',
        aHi: 'कोर्स और जिले के अनुसार ऑनलाइन, ऑफलाइन और हाइब्रिड (दोनों का संयोजन) बैच संचालित किए जाते हैं।',
        aEn: 'Depending on the track and district, batches run in online, offline, or hybrid formats.',
      },
      {
        qHi: 'हरित उद्यमिता कोर्स में क्या सिखाया जाता है?',
        qEn: 'What does Rural Agro & Green Entrepreneurship cover?',
        aHi: 'स्थानीय पौध नर्सरी प्रबंधन, वर्मीकम्पोस्ट इकाई, पैकेजिंग, लागत गणना और स्थानीय स्तर पर वितरण की व्यावहारिक समझ।',
        aEn: 'Practical basics of setting up a local sapling nursery, vermicompost unit, cost accounting, and community distribution.',
      },
      {
        qHi: 'क्या अनुभवी शिक्षक या विशेषज्ञ प्रशिक्षक के रूप में जुड़ सकते हैं?',
        qEn: 'Can experienced teachers volunteer or join as trainers?',
        aHi: 'हाँ! नीचे पंजीकरण पोर्टल में “विशेषज्ञ / प्रशिक्षक” श्रेणी चुनकर आप अपनी विशेषज्ञता साझा कर सकते हैं।',
        aEn: 'Yes! Select the Expert / Trainer tab in the registration portal below to share your teaching background.',
      },
      {
        qHi: 'क्या कोर्स की फीस होती है?',
        qEn: 'Are these courses free or paid?',
        aHi: 'कई जागरूकता सत्र निःशुल्क होते हैं और विशेष प्रशिक्षक-आधारित बैचों में नाममात्र/सामुदायिक सहयोग शुल्क हो सकता है—जो बैच घोषणा के समय स्पष्ट बताया जाता है।',
        aEn: 'Many orientation sessions are free, while dedicated multi-week trainer batches may have a nominal fee clearly disclosed upfront.',
      },
    ],
  },

  /* ==========================================================================
     MISSION 08: WOMEN EMPOWERMENT & RURAL UPLIFTMENT
     ========================================================================== */
  'women-empowerment': {
    slug: 'women-empowerment',
    heroVignette: 'missionVignette10Women',
    explainerVignette: 'vignetteCleanClothbag',
    explainerCaptionHi:
      'महिला स्वयं सहायता समूह, सूती थैला व हस्तशिल्प उद्यम, वित्तीय साक्षरता और सम्मानजनक स्वास्थ्य जागरूकता।',
    explainerCaptionEn:
      'Women Self-Help Groups, cotton-bag micro-enterprises, safe digital literacy, and dignified health awareness.',
    horizonTop: 'sandstone',
    horizonBottom: 'gaushala',
    whyEyebrowHi: '01 · क्यों ज़रूरी है महिला सशक्तिकरण व ग्राम उत्थान?',
    whyEyebrowEn: '01 · Why Women’s Dignity & Livelihoods Transform Villages',
    whyTitleHi: 'जब गाँव की महिला आर्थिक, डिजिटल और स्वास्थ्य रूप से सशक्त होती है, तब पूरा परिवार आगे बढ़ता है',
    whyTitleEn: 'When Rural Women Thrive in Livelihood & Health, Entire Villages Rise',
    whyLeadHi:
      'ग्रामीण भारत में महिलाएं घर, खेती और पशुधन की रीढ़ हैं, फिर भी स्वतंत्र आय, सुरक्षित बैंकिंग/डिजिटल ज्ञान और स्वास्थ्य-स्वच्छता पर खुलकर बात करने के अवसर सीमित रहते हैं। महिला समूहों को कौशल, बाज़ार और संवेदनशील स्वास्थ्य जानकारी से जोड़ना पूरे समाज को मजबूत करता है।',
    whyLeadEn:
      'Rural women carry homes, farms, and livestock every day, yet often lack independent micro-enterprise links, safe digital banking skills, and private doctor-guided health education. Strengthening women’s groups lifts whole generations.',
    realities: [
      {
        num: '01',
        titleHi: 'स्थानीय सम्मानजनक आय के सीमित साधन',
        titleEn: 'Limited Local Income Avenues',
        descHi:
          'सिलाई, हस्तशिल्प व खाद्य प्रसंस्करण का हुनर होने पर भी महिलाओं को उचित प्रशिक्षण व स्थानीय मांग से जुड़ाव नहीं मिल पाता।',
        descEn:
          'Skilled rural women often lack structured group training and reliable links to local village and institutional demand.',
      },
      {
        num: '02',
        titleHi: 'वित्तीय व डिजिटल सुरक्षा का अंतर',
        titleEn: 'Digital & Financial Literacy Gap',
        descHi:
          'बचत खाते, सुरक्षित UPI भुगतान और ऑनलाइन धोखाधड़ी से बचाव की सरल जानकारी हर महिला का अधिकार है।',
        descEn:
          'Understanding savings accounts, safe UPI usage, and fraud prevention builds everyday independence.',
      },
      {
        num: '03',
        titleHi: 'मासिक धर्म स्वच्छता पर संकोच',
        titleEn: 'Silence Around Women’s Hygiene',
        descHi:
          'सही और वैज्ञानिक स्वास्थ्य जानकारी के अभाव में ग्रामीण महिलाओं व किशोरियों को अनावश्यक स्वास्थ्य समस्याओं का सामना करना पड़ता है।',
        descEn:
          'Stigma and lack of medically sound menstrual hygiene and nutrition guidance affect rural women and adolescent girls.',
      },
      {
        num: '04',
        titleHi: 'ग्राम नेतृत्व में भागीदारी की ज़रूरत',
        titleEn: 'Need for Women’s Eco-Leadership',
        descHi:
          'वृक्षारोपण, जल संरक्षण और स्वच्छता अभियानों में महिलाओं के नेतृत्व से परिणाम कहीं अधिक टिकाऊ होते हैं।',
        descEn:
          'When women co-lead village tree care, water stewardship, and plastic-free drives, survival and impact soar.',
      },
    ],
    whatTitleHi: 'आजीविका, वित्तीय सुरक्षा और स्वास्थ्य—तीनों का एकीकृत मंच',
    whatTitleEn: 'Integrating Livelihoods, Safe Finance & Dignified Health',
    whatParagraphs: [
      {
        hi: 'यह मिशन महिला स्वयं सहायता समूहों (SHGs) को चार ठोस क्षेत्रों में सशक्त बनाता है: (1) कपड़े के थैले, सिलाई व स्थानीय पारंपरिक उत्पादों का उत्पादन, (2) बचत, लागत-गणना और सुरक्षित UPI डिजिटल साक्षरता, (3) डॉक्टर-समीक्षित महिला स्वास्थ्य, पोषण व मासिक धर्म स्वच्छता संवाद, और (4) हरित ग्राम समितियों में महिला नेतृत्व।',
        en: 'This mission strengthens Women Self-Help Groups across four pillars: (1) stitching cloth bags and local craft micro-enterprises, (2) household savings, simple costing, and safe UPI literacy, (3) private, doctor-reviewed menstrual hygiene and nutrition education, and (4) women’s leadership in village green committees.',
      },
      {
        hi: 'खास बात यह है कि कपड़े के थैलों का उत्पादन सीधे हमारे मिशन 6 (प्लास्टिक-मुक्त गाँव) की स्थानीय ज़रूरत से जुड़ता है—जिससे स्वच्छता भी बढ़ती है और गाँव की बहनों को सम्मानजनक काम भी मिलता है।',
        en: 'Crucially, SHG cloth-bag stitching links directly with Mission 6 (Plastic-Free Villages)—solving rural plastic waste while generating dignified local enterprise.',
      },
    ],
    howTitleHi: 'महिला समूह सशक्तिकरण के 5 व्यावहारिक चरण',
    howTitleEn: '5 Practical Steps to Empower Women Self-Help Groups',
    howLeadHi:
      'गाँव की महिलाओं के छोटे समूह से लेकर आत्मनिर्भर उत्पादन और सामुदायिक नेतृत्व तक की सरल यात्रा:',
    howLeadEn:
      'From gathering a village SHG to quality craftsmanship, safe digital banking, and green leadership:',
    steps: [
      {
        step: '01',
        assetKey: 'medallionWomen',
        titleHi: 'महिला समूह (SHG) का जुड़ाव',
        titleEn: 'SHG Registration & Listening',
        descHi:
          'गाँव की महिलाओं के मौजूदा या नए समूह की रुचियों, कौशल और स्थानीय आवश्यकताओं को समझना।',
        descEn:
          'Listening to existing or newly formed village women’s groups to map skills and goals.',
      },
      {
        step: '02',
        assetKey: 'vignetteCleanClothbag',
        titleHi: 'कपड़े का थैला व सूक्ष्म-उद्यम कौशल',
        titleEn: 'Cloth-Bag & Craft Training',
        descHi:
          'सिलाई गुणवत्ता, मजबूत सूती थैले, मसाला/जैविक पैकेजिंग और हस्तशिल्प सुधार का प्रशिक्षण।',
        descEn:
          'Hands-on quality training in reusable cloth bags, clean food/agro packaging, and local crafts.',
      },
      {
        step: '03',
        assetKey: 'medallionSkills',
        titleHi: 'वित्तीय व सुरक्षित UPI साक्षरता',
        titleEn: 'Financial & Safe UPI Skills',
        descHi:
          'समूह बहीखाता, लागत-मूल्य निर्धारण, बैंकिंग सुरक्षा और डिजिटल धोखाधड़ी से बचाव की सीख।',
        descEn:
          'Simple bookkeeping, fair pricing math, banking confidence, and protection against digital scams.',
      },
      {
        step: '04',
        assetKey: 'medallionSenior',
        titleHi: 'महिला स्वास्थ्य एवं पोषण संवाद',
        titleEn: 'Private Health & Nutrition',
        descHi:
          'महिला चिकित्सक/विशेषज्ञ द्वारा समीक्षित मासिक धर्म स्वच्छता, एनीमिया रोकथाम व पोषण सत्र।',
        descEn:
          'Respectful, private, doctor-reviewed sessions on menstrual hygiene, anaemia prevention, and nutrition.',
      },
      {
        step: '05',
        assetKey: 'medallionHarit',
        titleHi: 'ग्राम नेतृत्व व बाज़ार संपर्क',
        titleEn: 'Local Demand & Leadership',
        descHi:
          'स्थानीय मेलों, स्कूलों, पंचायतों व हरित अभियानों में महिला समूहों की सक्रिय भागीदारी।',
        descEn:
          'Connecting SHG goods with schools, village fairs, and green events while elevating women leaders.',
      },
    ],
    roleTitleHi: 'इस मिशन में GOVEDA की भूमिका',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'महिलाओं की निजता, सम्मान और स्वावलंबन को सर्वोच्च प्राथमिकता देते हुए प्रशिक्षण और स्थानीय अवसरों का समन्वय।',
    roleLeadEn:
      'Putting dignity, privacy, and local self-reliance first across every workshop and enterprise linkage.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'आजीविका व कौशल समन्वय',
        titleEn: 'Skill & Micro-Enterprise Hub',
        descHi:
          'कपड़े के थैले, सिलाई और जैविक उत्पाद पैकेजिंग हेतु व्यावहारिक प्रशिक्षक व डिज़ाइन सहायता।',
        descEn:
          'Arranging practical trainers for cloth bags, stitching standards, and rural value-added goods.',
      },
      {
        num: '02',
        titleHi: 'डॉक्टर-समीक्षित स्वास्थ्य सामग्री',
        titleEn: 'Doctor-Reviewed Health Guides',
        descHi:
          'महिला प्रशिक्षिकाओं के माध्यम से संवेदनशील, वैज्ञानिक और पूर्णतः गोपनीय स्वास्थ्य संवाद।',
        descEn:
          'Sensitive women-led sessions built strictly on medically verified health and hygiene guidance.',
      },
      {
        num: '03',
        titleHi: 'हरित ग्राम समितियों में नेतृत्व',
        titleEn: 'Green Committee Leadership',
        descHi:
          'नर्सरी संचालन, जल संरक्षण और प्लास्टिक-मुक्त बाज़ारों में महिलाओं की नेतृत्व भूमिका को सम्मान।',
        descEn:
          'Encouraging women leaders in community nurseries, rainwater care, and clean market drives.',
      },
    ],
    safeguardTitleHi: 'स्वास्थ्य, निजता एवं आजीविका पारदर्शिता सूचना',
    safeguardTitleEn: 'Health Privacy & Livelihood Integrity Policy',
    safeguardPoints: [
      {
        hi: 'मासिक धर्म स्वच्छता व महिला स्वास्थ्य से जुड़ी सभी सामग्री केवल योग्य चिकित्सकों द्वारा समीक्षित जागरूकता हेतु है—व्यक्तिगत चिकित्सा हेतु सदैव डॉक्टर से परामर्श लें।',
        en: 'All menstrual hygiene and nutrition materials are doctor-reviewed educational resources—always consult a qualified physician for personal medical care.',
      },
      {
        hi: 'किसी भी महिला प्रतिभागी का व्यक्तिगत स्वास्थ्य विवरण कभी भी सार्वजनिक या डिजिटल रिकॉर्ड में एकत्रित नहीं किया जाता—गोपनीयता का पूर्ण सम्मान किया जाता है।',
        en: 'No personal health data of any woman participant is ever published or collected publicly; strict privacy and dignity are upheld.',
      },
      {
        hi: 'SHG उत्पादों की आय स्थानीय उत्पादन गुणवत्ता और बाज़ार बिक्री पर निर्भर करती है—कोई निश्चित मासिक वेतन का दावा नहीं किया जाता।',
        en: 'SHG enterprise earnings depend on product quality and local sales demand; no fixed monthly salary is promised.',
      },
    ],
    faqs: [
      {
        qHi: 'क्या गाँव का कोई भी नया महिला समूह (8–15 महिलाएं) जुड़ सकता है?',
        qEn: 'Can a newly formed village group of 8–15 women register?',
        aHi: 'हाँ। चाहे आपका समूह पहले से पंजीकृत हो या नया बन रहा हो, नीचे महिला SHG फॉर्म भरकर आप प्रशिक्षण व मार्गदर्शन हेतु जुड़ सकती हैं।',
        aEn: 'Yes. Both existing SHGs and newly gathering village groups can register below for training and orientation.',
      },
      {
        qHi: 'क्या कपड़े के थैले बनाने के लिए सिलाई मशीन पहले से होना ज़रूरी है?',
        qEn: 'Must every woman already own a sewing machine to join?',
        aHi: 'अनिवार्य नहीं। समूह स्तर पर साझा मशीनों, प्रशिक्षण केंद्रों या हाथ-कटाई/फिनिशिंग व पैकेजिंग भूमिकाओं से भी शुरुआत की जा सकती है।',
        aEn: 'Not mandatory. Groups often start with shared machines, community training batches, or cutting, finishing, and packaging roles.',
      },
      {
        qHi: 'महिला स्वास्थ्य व स्वच्छता सत्र कौन संचालित करता है?',
        qEn: 'Who conducts the women’s health and hygiene sessions?',
        aHi: 'ये सत्र महिला प्रशिक्षिकाओं और स्थानीय महिला चिकित्सकों/स्वास्थ्य कर्मियों के मार्गदर्शन में पूर्णतः सुरक्षित व संवेदनशील वातावरण में होते हैं।',
        aEn: 'Sessions are conducted by women facilitators and local female health professionals in a respectful, private setting.',
      },
      {
        qHi: 'डिजिटल साक्षरता में महिलाओं को क्या सिखाया जाता है?',
        qEn: 'What does the digital & financial literacy module cover?',
        aHi: 'बैंक पासबुक समझना, सुरक्षित UPI उपयोग, OTP कभी साझा न करने के नियम, और समूह की आय-व्यय डायरी लिखना।',
        aEn: 'Reading bank statements, safe UPI transactions, OTP scam protection, and keeping clear SHG income-expense ledgers.',
      },
      {
        qHi: 'क्या यह मिशन केवल ग्रामीण महिलाओं के लिए है?',
        qEn: 'Is this programme limited strictly to villages?',
        aHi: 'प्राथमिकता ग्रामीण और अर्ध-शहरी महिला समूहों की है, लेकिन कस्बों के महिला संगठन व स्वयंसेवी शिक्षिकाएँ भी इसमें सहभागी बन सकती हैं।',
        aEn: 'While focused on rural and semi-urban women’s groups, town-based women’s collectives and volunteer educators are equally welcome.',
      },
      {
        qHi: 'महिला SHG पंजीकरण के बाद अगला कदम क्या होता है?',
        qEn: 'What happens after submitting the Women SHG form?',
        aHi: 'पंजीकरण के बाद आपको एक संदर्भ संख्या मिलती है और जिला समन्वय टीम प्रशिक्षण व आगामी कार्यशाला के लिए आपसे संपर्क करती है।',
        aEn: 'You receive a live reference number immediately, and our district coordination team follows up regarding upcoming local workshops.',
      },
    ],
  },

  /* ==========================================================================
     MISSION 09: SENIOR CITIZEN CARE & MENTAL WELL-BEING
     ========================================================================== */
  'senior-citizen-care': {
    slug: 'senior-citizen-care',
    heroVignette: 'missionVignette09Senior',
    explainerVignette: 'medallionSenior',
    explainerCaptionHi:
      'बुजुर्गों का सम्मान, प्रातःकालीन योग-प्राणायाम, युवाओं से आत्मीय संवाद और मानसिक शांति का साझा मंच।',
    explainerCaptionEn:
      'Respect for elders, gentle morning yoga, inter-generational warmth, and open conversations on mental well-being.',
    horizonTop: 'hills',
    horizonBottom: 'sandstone',
    whyEyebrowHi: '01 · क्यों ज़रूरी है वरिष्ठजन सेवा व मानसिक स्वास्थ्य संवाद?',
    whyEyebrowEn: '01 · Why Senior Dignity & Mental Well-Being Matter',
    whyTitleHi: 'बदलते दौर में बुजुर्गों का अकेलापन और अनकहा मानसिक तनाव एक मौन चुनौती है',
    whyTitleEn: 'Loneliness Among Elders & Unspoken Mental Stress Deserve Gentle Care',
    whyLeadHi:
      'काम के लिए युवाओं के शहरों की ओर पलायन और तेज़ भागदौड़ भरी जीवनशैली के कारण गाँवों व शहरों दोनों में अनेक वरिष्ठ नागरिक अकेलेपन का अनुभव करते हैं। साथ ही मानसिक स्वास्थ्य पर खुलकर बात न होने से तनाव बढ़ता है। सम्मान, योग और अंतर-पीढ़ी जुड़ाव समाज को फिर से आत्मीय बनाता है।',
    whyLeadEn:
      'As families disperse for work and daily life accelerates, many elders in villages and towns experience quiet loneliness, while stigma silences mental health conversations. Warm community circles, yoga, and inter-generational dialogue restore belonging.',
    realities: [
      {
        num: '01',
        titleHi: 'वरिष्ठ नागरिकों का बढ़ता अकेलापन',
        titleEn: 'Growing Elder Isolation',
        descHi:
          'शारीरिक सुविधाओं के साथ-साथ बुजुर्गों को सुनने वाले, बात करने वाले और सम्मान देने वाले अपनों की सबसे अधिक आवश्यकता होती है।',
        descEn:
          'Beyond basic shelter, senior citizens deeply need patient listeners, companionship, and active community respect.',
      },
      {
        num: '02',
        titleHi: 'नियमित स्वास्थ्य जाँच व गतिशीलता की कमी',
        titleEn: 'Preventive Wellness Gaps',
        descHi:
          'बीपी, शुगर, आँखों की जाँच और हल्के प्राणायाम-व्यायाम के अभाव में छोटी परेशानियाँ बड़ी बन जाती हैं।',
        descEn:
          'Without periodic health camps and gentle daily mobility, manageable age-related issues escalate.',
      },
      {
        num: '03',
        titleHi: 'मानसिक स्वास्थ्य पर बोलने का संकोच',
        titleEn: 'Silence Around Mental Wellness',
        descHi:
          'गाँवों व छोटे शहरों में तनाव, अवसाद या चिंता पर खुलकर संवाद और संवेदनशील मार्गदर्शन बहुत कम उपलब्ध है।',
        descEn:
          'Stress, anxiety, and emotional fatigue remain taboo topics in many communities despite affecting every age group.',
      },
      {
        num: '04',
        titleHi: 'पीढ़ियों के बीच अनुभव-सेतु की ज़रूरत',
        titleEn: 'Bridging Youth & Elders',
        descHi:
          'बुजुर्गों के पास खेती, पानी, लोक-संस्कृति और जीवन का अमूल्य अनुभव है—युवाओं से संवाद दोनों पीढ़ियों को समृद्ध करता है।',
        descEn:
          'Elders hold priceless wisdom on water, nature, and culture—connecting youth with seniors enriches both generations.',
      },
    ],
    whatTitleHi: 'आत्मीय देखभाल, योग और प्रस्तावित हरित वृद्धाश्रम दृष्टि',
    whatTitleEn: 'Community Care, Morning Yoga & Proposed Green Senior Vision',
    whatParagraphs: [
      {
        hi: 'GOVEDA वरिष्ठजन सेवा को दया नहीं, बल्कि “सम्मान और सहभागिता” के रूप में देखता है। इसके अंतर्गत सामुदायिक प्रातःकालीन योग-प्राणायाम, नियमित स्वास्थ्य जागरूकता शिविर, और स्कूल-कॉलेज युवाओं के साथ अंतर-पीढ़ी संवाद कार्यक्रम आयोजित करने की रूपरेखा है।',
        en: 'GOVEDA approaches senior care through dignity and companionship—not pity. Activities centre on gentle morning yoga and pranayama circles, preventive health awareness camps, and inter-generational visits with students and youth volunteers.',
      },
      {
        hi: 'दीर्घकालिक दृष्टि के रूप में एक शांत, पेड़ों से घिरे और परिवार-सम वातावरण वाले “प्रस्तावित हरित वृद्धाश्रम मॉडल” की संकल्पना भी तैयार की गई है—जहाँ वरिष्ठजन प्रकृति, बागवानी और आध्यात्मिक शांति के साथ सम्मानपूर्वक रह सकें।',
        en: 'As a long-term vision, we are also shaping a Proposed Green Vriddha Ashram concept—a calm, tree-shaded, family-like sanctuary integrating gentle gardening, wellness, and community life.',
      },
    ],
    howTitleHi: 'वरिष्ठजन व मानसिक स्वास्थ्य पहल के 5 संवेदनशील चरण',
    howTitleEn: '5 Compassionate Pillars of This Mission',
    howLeadHi:
      'एक संवेदनशील और हरित सामुदायिक सेवा संस्कृति कैसे विकसित की जाती है:',
    howLeadEn:
      'How community volunteers, wellness guides, and families nurture elder dignity together:',
    steps: [
      {
        step: '01',
        assetKey: 'medallionSenior',
        titleHi: 'स्थानीय वरिष्ठजन मिलन केंद्र',
        titleEn: 'Community Elder Circles',
        descHi:
          'गाँव व मोहल्ले में साप्ताहिक आत्मीय संवाद, भजन-संगीत और अनुभव साझा करने के सहज अवसर।',
        descEn:
          'Warm weekly gatherings in villages and towns for conversation, storytelling, and fellowship.',
      },
      {
        step: '02',
        assetKey: 'missionVignette09Senior',
        titleHi: 'प्रातःकालीन योग एवं प्राणायाम',
        titleEn: 'Gentle Yoga & Pranayama',
        descHi:
          'उम्र के अनुकूल हल्का व्यायाम, श्वास अभ्यास और ध्यान सत्र—शारीरिक व मानसिक संतुलन हेतु।',
        descEn:
          'Age-friendly breathing, light stretching, and calm mindfulness sessions guided by trained volunteers.',
      },
      {
        step: '03',
        assetKey: 'medallionSkills',
        titleHi: 'युवा-वरिष्ठ अंतर-पीढ़ी संवाद',
        titleEn: 'Inter-Generational Visits',
        descHi:
          'स्कूल व कॉलेज के युवाओं को बुजुर्गों के अनुभव सुनने और डिजिटल सहायता देने से जोड़ना।',
        descEn:
          'Students visiting seniors to listen, help with smartphones/banking basics, and learn local heritage.',
      },
      {
        step: '04',
        assetKey: 'medallionWomen',
        titleHi: 'मानसिक स्वास्थ्य जागरूकता',
        titleEn: 'Mental Health Literacy',
        descHi:
          'तनाव व अकेलेपन पर बिना झिझक संवाद और आवश्यकता पड़ने पर योग्य परामर्शदाता/चिकित्सक तक मार्गदर्शन।',
        descEn:
          'Open, stigma-free awareness talks that encourage families to seek qualified clinical support when needed.',
      },
      {
        step: '05',
        assetKey: 'medallionHarit',
        titleHi: 'प्रस्तावित हरित सेवा केंद्र दृष्टि',
        titleEn: 'Proposed Green Ashram Plan',
        descHi:
          'भविष्य में संस्थागत सहयोग से शांत, हरित और प्रकृति-आधारित वरिष्ठजन सेवा केंद्र का निर्माण।',
        descEn:
          'Long-term community-backed planning for a serene, garden-integrated senior care centre.',
      },
    ],
    roleTitleHi: 'इस मिशन में GOVEDA की भूमिका',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'स्वयंसेवकों, चिकित्सकों, योग प्रशिक्षकों और सामाजिक संस्थाओं को एक संवेदनशील सेवा नेटवर्क में जोड़ना।',
    roleLeadEn:
      'Bringing together volunteers, doctors, yoga mentors, and civic trusts in a compassionate care network.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'स्वास्थ्य व योग शिविर समन्वय',
        titleEn: 'Wellness & Camp Coordination',
        descHi:
          'स्थानीय अस्पतालों, नेत्र शिविरों और योग प्रशिक्षकों के साथ नियमित सामुदायिक कार्यक्रम।',
        descEn:
          'Coordinating preventive health check-up awareness and gentle yoga circles with local clinics.',
      },
      {
        num: '02',
        titleHi: 'स्वयंसेवक व युवा संवेदनशीलता',
        titleEn: 'Youth Volunteer Care Network',
        descHi:
          'कॉलेज छात्रों और स्थानीय युवाओं को वरिष्ठजनों की सेवा व संवाद से जोड़ना।',
        descEn:
          'Mobilising youth volunteers for friendly companionship visits and community festivals.',
      },
      {
        num: '03',
        titleHi: 'संस्थागत व CSR योजना संवाद',
        titleEn: 'Institutional & Trust Dialogue',
        descHi:
          'प्रस्तावित हरित वरिष्ठजन सेवा केंद्र की पारदर्शी रूपरेखा हेतु ट्रस्टों व समाजसेवियों से समन्वय।',
        descEn:
          'Collaborating with healthcare trusts and philanthropic partners on the proposed senior care model.',
      },
    ],
    safeguardTitleHi: 'ईमानदार स्थिति एवं चिकित्सा स्पष्टीकरण',
    safeguardTitleEn: 'Honest Status & Clinical Care Notice',
    safeguardPoints: [
      {
        hi: '“हरित वृद्धाश्रम मॉडल” वर्तमान में प्रस्तावित संकल्पना (Proposed Concept) चरण में है—अभी कोई आवासीय वृद्धाश्रम संचालित होने का दावा नहीं किया जाता।',
        en: 'The Green Vriddha Ashram Model is currently at Proposed Concept stage; GOVEDA does not claim an already operational residential facility.',
      },
      {
        hi: 'योग, ध्यान और सामुदायिक संवाद केवल निवारक कल्याण व जागरूकता हेतु हैं—किसी भी गंभीर शारीरिक या मानसिक चिकित्सा स्थिति के लिए योग्य डॉक्टर/मनोचिकित्सक से परामर्श अनिवार्य है।',
        en: 'Yoga and community circles are for preventive well-being and companionship only—always consult licensed doctors or mental health clinicians for clinical care.',
      },
    ],
    faqs: [
      {
        qHi: 'क्या GOVEDA का वृद्धाश्रम अभी चालू है जहाँ प्रवेश लिया जा सके?',
        qEn: 'Is GOVEDA’s Vriddha Ashram already open for admission?',
        aHi: 'नहीं। यह अभी प्रस्तावित सेवा मॉडल (Proposed Model) है। वर्तमान में हम सामुदायिक जागरूकता, योग सत्र, स्वयंसेवक संवाद और संस्थागत समन्वय पर कार्य कर रहे हैं।',
        aEn: 'No. It is currently a Proposed Model. Today our focus is on community wellness circles, yoga, inter-generational visits, and institutional partnerships.',
      },
      {
        qHi: 'मैं एक डॉक्टर या योग प्रशिक्षक हूँ—इस मिशन में कैसे योगदान दे सकता हूँ?',
        qEn: 'As a doctor or yoga instructor, how can I contribute?',
        aHi: 'नीचे पंजीकरण फॉर्म में “विशेषज्ञ / प्रशिक्षक” या “स्वयंसेवक” श्रेणी चुनकर अपना जिला और उपलब्धता साझा करें।',
        aEn: 'Register below under Expert / Trainer or Volunteer with your district and preferred schedule to support local wellness sessions.',
      },
      {
        qHi: 'क्या मानसिक स्वास्थ्य सत्रों में युवा और परिवार भी शामिल हो सकते हैं?',
        qEn: 'Are mental well-being talks open to youth and families too?',
        aHi: 'हाँ। तनाव प्रबंधन, नींद, परिवारिक संवाद और अकेलेपन से बाहर निकलने के सत्र सभी आयु वर्ग के लिए खुले होते हैं।',
        aEn: 'Yes. Open conversations on stress, sleep, family empathy, and emotional health welcome youth, parents, and elders alike.',
      },
      {
        qHi: 'क्या ये सामुदायिक योग व संवाद कार्यक्रम निःशुल्क होते हैं?',
        qEn: 'Are community yoga and elder dialogue sessions free?',
        aHi: 'हाँ, सामुदायिक जागरूकता और वरिष्ठजन मिलन सत्र निःशुल्क सेवा भाव से आयोजित किए जाते हैं।',
        aEn: 'Yes, community senior circles and awareness workshops are organised free of cost in a spirit of service.',
      },
      {
        qHi: 'हमारी सामाजिक संस्था या अस्पताल इस मिशन में कैसे साझेदारी करे?',
        qEn: 'How can a healthcare trust or NGO partner with this mission?',
        aHi: 'आप नीचे संस्थागत/CSR पंजीकरण फॉर्म भरकर या संपर्क पृष्ठ के माध्यम से संयुक्त स्वास्थ्य शिविर का प्रस्ताव भेज सकते हैं।',
        aEn: 'Use the CSR / Institutional form below or our Contact page to propose joint senior health camps.',
      },
      {
        qHi: 'अंतर-पीढ़ी संवाद कार्यक्रम में क्या होता है?',
        qEn: 'What happens during an inter-generational programme?',
        aHi: 'स्कूल-कॉलेज के विद्यार्थी बुजुर्गों के साथ समय बिताते हैं, उनके लोक-ज्ञान व अनुभव सुनते हैं और उन्हें मोबाइल/ऑनलाइन सेवाएँ समझने में मदद करते हैं।',
        aEn: 'Students spend joyful time listening to elders’ life stories and local wisdom while helping them navigate phones or everyday digital tasks.',
      },
    ],
  },

  /* ==========================================================================
     MISSION 10: CULTURAL HERITAGE, ROOFTOP SOLAR & WATER CONSERVATION
     ========================================================================== */
  'heritage-solar-water': {
    slug: 'heritage-solar-water',
    heroVignette: 'vignetteHeritageKund',
    explainerVignette: 'missionVignette07Fort',
    explainerCaptionHi:
      'शेखावाटी व राजस्थान की ऐतिहासिक हवेलियाँ, छत पर स्वच्छ सौर ऊर्जा और पारंपरिक कुंडों में वर्षा जल संचयन का अद्भुत संगम।',
    explainerCaptionEn:
      'Preserving Shekhawati & Rajasthan havelis while pairing low-impact rooftop solar with traditional stepwell rainwater harvesting.',
    horizonTop: 'sandstone',
    horizonBottom: 'fort',
    whyEyebrowHi: '01 · क्यों ज़रूरी है विरासत, सोलर व पारंपरिक जल संरक्षण?',
    whyEyebrowEn: '01 · Why Heritage, Solar & Traditional Water Matter Together',
    whyTitleHi: 'हमारे पुरखों की हवेलियाँ, कुंड और बावड़ियाँ जलवायु-अनुकूल जीवन की सबसे बड़ी पाठशाला हैं',
    whyTitleEn: 'Rajasthan’s Havelis, Kunds & Stepwells Are Living Lessons in Climate Wisdom',
    whyLeadHi:
      'शेखावाटी व राजस्थान की ऐतिहासिक हवेलियाँ, धर्मशालाएँ, कुंड और जोहड़ सदियों पहले कम पानी और तेज़ गर्मी से निपटने के लिए वैज्ञानिक ढंग से बनाए गए थे। आज उपेक्षा के कारण ये धरोहरें जर्जर हो रही हैं। इन्हें रूफटॉप सोलर और वर्षा जल संचयन से जोड़कर हम अतीत की शान और भविष्य की सुरक्षा दोनों बचा सकते हैं।',
    whyLeadEn:
      'Centuries ago, Rajasthan’s havelis, dharamshalas, kunds, and johads were engineered for extreme desert heat and scarce rainfall. Today many lie neglected. Restoring them with low-impact rooftop solar and rainwater harvesting unites cultural pride with modern sustainability.',
    realities: [
      {
        num: '01',
        titleHi: 'उपेक्षित होती ऐतिहासिक हवेलियाँ',
        titleEn: 'Fading Architectural Heritage',
        descHi:
          'रखरखाव और बिजली-पानी के खर्च के कारण शेखावाटी व राजस्थान की सैकड़ों सुंदर हवेलियाँ बंद या जर्जर हो रही हैं।',
        descEn:
          'High upkeep costs leave iconic frescoed havelis and community dharamshalas shuttered or deteriorating.',
      },
      {
        num: '02',
        titleHi: 'सूखते पारंपरिक कुंड, टांके व बावड़ियाँ',
        titleEn: 'Neglected Kunds & Stepwells',
        descHi:
          'छतों का मीठा वर्षा जल आज नालियों में बह जाता है, जबकि सदियों पुराने भूमिगत कुंड सफाई व मरम्मत की राह देख रहे हैं।',
        descEn:
          'Pure monsoon roof runoff drains away unused while historic underground kunds and johads sit silted.',
      },
      {
        num: '03',
        titleHi: 'राजस्थान की प्रचुर धूप का स्वच्छ उपयोग',
        titleEn: 'Abundant Untapped Desert Sun',
        descHi:
          'राजस्थान में साल के 300+ दिन तेज़ धूप मिलती है—धर्मशालाओं, स्कूलों व हवेलियों की छतों पर सोलर बिजली खर्च घटाता है।',
        descEn:
          'With 300+ sunny days a year, thoughtful rooftop solar drastically cuts electricity bills for heritage trusts and community halls.',
      },
      {
        num: '04',
        titleHi: 'धरोहर के सौंदर्य को नुकसान न हो',
        titleEn: 'Need for Sensitive Restoration',
        descHi:
          'आधुनिक तकनीक (सोलर व जल संचयन) इस तरह लगे कि ऐतिहासिक वास्तुकला और भित्तिचित्रों की मूल सुंदरता पूरी तरह सुरक्षित रहे।',
        descEn:
          'Modern solar and rainwater retrofits must respect historic facades and frescoes without visual or structural harm.',
      },
    ],
    whatTitleHi: 'विरासत + सोलर + वर्षा जल = टिकाऊ सांस्कृतिक पुनर्जागरण',
    whatTitleEn: 'Heritage + Solar + Rainwater = Sustainable Cultural Revival',
    whatParagraphs: [
      {
        hi: 'यह मिशन राजस्थान की ऐतिहासिक पहचान और आधुनिक पर्यावरण तकनीक को एक सूत्र में पिरोता है: ऐतिहासिक हवेलियों व धर्मशालाओं का संवेदनशील संरक्षण, छतों पर कम-दृश्य प्रभाव वाला रूफटॉप सोलर, छत के वर्षा जल को फिल्टर कर पारंपरिक कुंडों/टांकों में सहेजना, और छत पर शीतलता देने वाले टेरेस जैविक उद्यान।',
        en: 'This mission weaves Rajasthan’s cultural soul with clean sustainability: sensitive haveli and dharamshala restoration, low-visual-impact rooftop solar, filtered rainwater harvesting into traditional underground kunds, and cooling terrace herb gardens.',
      },
      {
        hi: 'जब कोई धर्मशाला या ऐतिहासिक भवन अपनी बिजली सूर्य से और पानी बारिश के कुंड से स्वयं संचित करता है, तो वह न केवल आत्मनिर्भर बनता है बल्कि पूरे क्षेत्र के लिए “जीवंत हरित विरासत पाठशाला” बन जाता है।',
        en: 'When a historic dharamshala or haveli generates clean solar power and stores monsoon rainwater in its traditional kund, it lowers upkeep costs and becomes a living sustainability showcase.',
      },
    ],
    howTitleHi: 'हरित विरासत व जल संरक्षण के 5 व्यवस्थित चरण',
    howTitleEn: '5 Thoughtful Steps to Revive Heritage, Solar & Water',
    howLeadHi:
      'किसी हवेली, धर्मशाला या ग्राम जल स्रोत को पुनर्जीवित करने की चरणबद्ध प्रक्रिया:',
    howLeadEn:
      'How historic property trusts, villages, and CSR partners revive heritage and water systems responsibly:',
    steps: [
      {
        step: '01',
        assetKey: 'medallionHeritage',
        titleHi: 'धरोहर व जल स्रोत सर्वेक्षण',
        titleEn: 'Heritage & Water Site Survey',
        descHi:
          'हवेली, धर्मशाला, कुंड या जोहड़ की संरचनात्मक स्थिति, छत क्षेत्र और स्थानीय आवश्यकता का प्रारंभिक आकलन।',
        descEn:
          'Preliminary review of building structure, roof catchment area, traditional kunds, and community value.',
      },
      {
        step: '02',
        assetKey: 'vignetteHeritageKund',
        titleHi: 'कुंड सफाई व वर्षा जल संचयन',
        titleEn: 'Kund Revival & Rainwater Filter',
        descHi:
          'पारंपरिक कुंडों-टांकों की गाद सफाई, मरम्मत और छत के वर्षा जल हेतु प्रथम-फ्लश फिल्टर पाइपलाइन।',
        descEn:
          'Desilting traditional kunds/stepwells and routing roof rainwater through clean first-flush filters.',
      },
      {
        step: '03',
        assetKey: 'medallionEnergy',
        titleHi: 'संवेदनशील रूफटॉप सोलर',
        titleEn: 'Low-Impact Rooftop Solar',
        descHi:
          'भवन की ऐतिहासिक छवि को सुरक्षित रखते हुए सामुदायिक छतों पर स्वच्छ सौर पैनल योजना।',
        descEn:
          'Integrating clean rooftop solar neatly on flat parapet roofs without marring historic facades.',
      },
      {
        step: '04',
        assetKey: 'medallionOrganic',
        titleHi: 'टेरेस जैविक व औषधीय उद्यान',
        titleEn: 'Cooling Terrace Gardens',
        descHi:
          'छतों पर हल्के गमलों में तुलसी, एलोवेरा, सब्जियाँ व छायादार लताएँ—जो भवन को प्राकृतिक रूप से ठंडा रखें।',
        descEn:
          'Lightweight potted herbs and shade creepers that naturally cool sunlit sandstone roofs.',
      },
      {
        step: '05',
        assetKey: 'medallionSkills',
        titleHi: 'सांस्कृतिक व पर्यावरण शिक्षा केंद्र',
        titleEn: 'Living Heritage & Eco Tourism',
        descHi:
          'संरक्षित भवनों को छात्रों, शोधकर्ताओं और जिम्मेदार सांस्कृतिक पर्यटन के जीवंत केंद्र से जोड़ना।',
        descEn:
          'Opening restored sites to student heritage walks, water workshops, and responsible eco-cultural visits.',
      },
    ],
    roleTitleHi: 'इस मिशन में GOVEDA की भूमिका',
    roleTitleEn: 'Where GOVEDA Comes Into Play',
    roleLeadHi:
      'भवन स्वामियों, धर्मशाला ट्रस्टों, संरक्षण विशेषज्ञों और CSR साझेदारों को एक पारदर्शी मंच पर लाना।',
    roleLeadEn:
      'Connecting historic property trusts, conservation advisors, village water stewards, and CSR partners.',
    rolePillars: [
      {
        num: '01',
        titleHi: 'भवन स्वामी व ट्रस्ट संवाद',
        titleEn: 'Property & Trust Onboarding',
        descHi:
          'शेखावाटी व राजस्थान की इच्छुक हवेलियों व धर्मशालाओं के संरक्षण व ग्रीन रेट्रोफिट हेतु प्रारंभिक मूल्यांकन।',
        descEn:
          'Preliminary conservation and green-retrofit assessment for interested haveli and dharamshala trusts.',
      },
      {
        num: '02',
        titleHi: 'पारंपरिक जल निकाय पुनर्जीवन',
        titleEn: 'Community Kund & Johad Drives',
        descHi:
          'गाँव के जोहड़, बावड़ी और सामुदायिक कुंडों की स्वच्छता व जल संचयन हेतु जन-सहभागिता।',
        descEn:
          'Mobilising villages and volunteers to clean, desilt, and protect historic ponds and stepwells.',
      },
      {
        num: '03',
        titleHi: 'CSR व विशेषज्ञ तकनीकी समन्वय',
        titleEn: 'CSR & Technical Linkage',
        descHi:
          'सौर ऊर्जा, जल इंजीनियरिंग और धरोहर संरक्षण में कॉर्पोरेट व संस्थागत साझेदारी का पारदर्शी सेतु।',
        descEn:
          'Facilitating transparent CSR tracks for public water bodies, school solar roofs, and heritage learning.',
      },
    ],
    safeguardTitleHi: 'धरोहर संरक्षण एवं तकनीकी स्पष्टीकरण',
    safeguardTitleEn: 'Conservation Ethics & Technical Notice',
    safeguardPoints: [
      {
        hi: 'किसी भी ऐतिहासिक हवेली, मंदिर या संरक्षित स्मारक पर कोई भी सोलर या संरचनात्मक कार्य केवल भवन स्वामी/ट्रस्ट की लिखित सहमति और लागू पुरातत्व/नगर नियमों के अधीन ही किया जाता है।',
        en: 'Any solar or restoration intervention on historic buildings occurs strictly with owner/trust consent and in compliance with applicable heritage and municipal rules.',
      },
      {
        hi: 'प्रारंभिक पंजीकरण तकनीकी सर्वेक्षण व संवाद का प्रथम चरण है—वित्तीय अनुदान या सोलर सब्सिडी संबंधित सरकारी योजनाओं व CSR स्वीकृति के अधीन होती है।',
        en: 'Initial registration opens a technical feasibility dialogue; financial support or solar subsidies depend on official government schemes or approved CSR tracks.',
      },
    ],
    faqs: [
      {
        qHi: 'क्या हमारी पुरानी पारिवारिक हवेली या धर्मशाला इस मिशन में पंजीकृत हो सकती है?',
        qEn: 'Can our family haveli or community dharamshala register?',
        aHi: 'हाँ। नीचे पंजीकरण फॉर्म भरकर अपने भवन का स्थान, आयु और संरक्षण/सोलर/कुंड रुचि दर्ज करें—हमारी टीम प्रारंभिक मूल्यांकन संवाद हेतु संपर्क करेगी।',
        aEn: 'Yes. Submit the registration form below with location and restoration/solar/water interest to initiate a preliminary site dialogue.',
      },
      {
        qHi: 'क्या हवेली की छत पर सोलर पैनल लगाने से उसकी सुंदरता खराब नहीं होगी?',
        qEn: 'Will rooftop solar panels spoil the historic look of a haveli?',
        aHi: 'संवेदनशील डिज़ाइन में सोलर पैनल ऊँची मुंडेर (Parapet) के भीतर कम कोण पर लगाए जाते हैं ताकि सड़क या आँगन से ऐतिहासिक वास्तुकला व भित्तिचित्र बिल्कुल प्रभावित न हों।',
        aEn: 'With sensitive low-profile placement tucked behind historic roof parapets, solar arrays remain largely invisible from street level and courtyards.',
      },
      {
        qHi: 'छत के वर्षा जल को पुराने कुंड में कैसे सहेजा जाता है?',
        qEn: 'How is rooftop rainwater safely stored in an old kund?',
        aHi: 'पहली बारिश की धूल निकालने हेतु First-Flush Diverter और रेत-गिट्टी-चारकोल फिल्टर चैंबर के बाद साफ वर्षा जल को भूमिगत कुंड या रिचार्ज पिट में उतारा जाता है।',
        aEn: 'Rainwater passes through a first-flush diverter and a multi-layer sand-gravel-charcoal filter before entering the cleaned underground kund or recharge pit.',
      },
      {
        qHi: 'क्या गाँव के सार्वजनिक जोहड़ या बावड़ी के जीर्णोद्धार का सुझाव दे सकते हैं?',
        qEn: 'Can villagers propose a public stepwell or johad for revival?',
        aHi: 'बिल्कुल। ग्राम पंचायत, हरित मित्र या स्वयंसेवक नीचे फॉर्म में सार्वजनिक जल स्रोत की जानकारी दर्ज कर सकते हैं।',
        aEn: 'Absolutely. Gram Panchayats, Harit Mitras, and volunteers can nominate community stepwells and johads via the form below.',
      },
      {
        qHi: 'क्या टेरेस गार्डन से पुरानी छत में सीलन का खतरा नहीं होता?',
        qEn: 'Could terrace gardening cause dampness on an old roof?',
        aHi: 'हम पुरानी छतों पर सीधे मिट्टी फैलाने के बजाय स्टैंड पर रखे हल्के गमलों, वाटरप्रूफ ट्रे और ड्रिप/सीमित पानी विधि की ही सलाह देते हैं जिससे सीलन न हो।',
        aEn: 'We never recommend loose soil directly on old roofs—only raised lightweight planters on stands with drip trays to keep masonry completely dry.',
      },
      {
        qHi: 'CSR कंपनियाँ जल और धरोहर संरक्षण में कैसे जुड़ सकती हैं?',
        qEn: 'How can CSR partners support water and heritage revival?',
        aHi: 'नीचे CSR साझेदार श्रेणी में पंजीकरण करें—हम सामुदायिक कुंड, स्कूल रूफटॉप सोलर और पारदर्शी जिला जल परियोजनाओं की विस्तृत रूपरेखा साझा करते हैं।',
        aEn: 'Register under CSR Partner below to receive structured proposals for village kund revival, school rooftop solar, and transparent impact reporting.',
      },
    ],
  },
};
