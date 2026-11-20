import type { DistrictData } from '../types/goveda';

export const DISTRICTS_DATA: DistrictData[] = [
  {
    slug: 'bhilwara',
    name: { hi: 'भीलवाड़ा', en: 'Bhilwara' },
    regionTag: { hi: 'मेवाड़ क्षेत्र • प्रथम चरण', en: 'Mewar Region · Phase I Focus' },
    focusSummary: {
      hi: 'हरित मैराथन 2026, जनजागरूकता, किसान पंजीकरण और संस्थागत सहभागिता',
      en: 'Harit Marathon 2026, public awareness, farmer onboarding & institutional participation',
    },
    introduction: {
      hi: 'भीलवाड़ा हरित राजस्थान अभियान का प्रमुख प्रारंभिक केंद्र है, जहाँ 20 दिसंबर 2026 को प्रस्तावित "हरित मैराथन — भीलवाड़ा" के साथ किसानों, विद्यालयों, गौशालाओं और नागरिक संस्थाओं को जोड़ा जा रहा है।',
      en: 'Bhilwara serves as a flagship launch district for Harit Rajasthan, uniting farmers, schools, Gaushalas, and civic institutions alongside the upcoming Harit Marathon Bhilwara on 20 December 2026.',
    },
    objectives: [
      { hi: 'ग्राम पंचायत स्तर पर हरित मित्र नेटवर्क एवं किसान जागरूकता संवाद', en: 'Gram Panchayat-level Harit Mitra outreach and farmer orientation' },
      { hi: 'भीलवाड़ा क्षेत्र के लिए दीर्घकालिक व्यापक वृक्षारोपण परिकल्पना (प्रस्तावित लक्ष्य)', en: 'Long-term district greening aspiration across rural clusters (proposed target)' },
      { hi: 'स्कूल-कॉलेज हरित परिसर और हरित मैराथन जनजागरूकता', en: 'School & college Green Campus drives and Harit Marathon mobilisation' },
      { hi: 'गौशाला आत्मनिर्भरता एवं स्थानीय जल संरक्षण सर्वेक्षण', en: 'Gaushala self-reliance assessment and local water conservation drives' },
    ],
    campaigns: [
      { hi: 'भीलवाड़ा हरित अभियान (1,840 ग्राम परिकल्पना — प्रस्तावित लक्ष्य)', en: 'Bhilwara Green Aspiration (1,840-village outreach framework — proposed target)' },
      { hi: 'मेड़ वृक्षारोपण एवं मृदा स्वास्थ्य जागरूकता', en: 'Farm boundary plantation & soil testing literacy' },
      { hi: 'प्लास्टिक-मुक्त बाजार एवं महिला SHG थैला पहल', en: 'Plastic-free marketplace & women SHG cotton bag initiative' },
    ],
    eventsHighlight: {
      hi: 'हरित मैराथन भीलवाड़ा • 20 दिसंबर 2026 — "Run for Green Rajasthan"',
      en: 'Harit Marathon Bhilwara · 20 December 2026 — "Run for Green Rajasthan"',
    },
    imageKey: 'haritRajasthan',
    mapCoords: { x: 56, y: 68, labelOffset: 'bottom' },
  },
  {
    slug: 'churu',
    name: { hi: 'चूरू', en: 'Churu' },
    regionTag: { hi: 'शेखावाटी / शुष्क क्षेत्र • प्रथम चरण', en: 'Shekhawati & Arid Zone · Phase I' },
    focusSummary: {
      hi: 'जल संरक्षण, शुष्क क्षेत्र वृक्षारोपण (खेजड़ी/रोहिड़ा), गौशाला और जैविक खेती',
      en: 'Water conservation, arid-zone native plantation, Gaushalas & organic farming',
    },
    introduction: {
      hi: 'चूरू के शुष्क और चरम तापमान वाले क्षेत्रों में पानी की उपलब्धता, पारंपरिक कुंडों का संरक्षण, और खेजड़ी-रोहिड़ा-नीम जैसी सूखा-सहिष्णु देशी प्रजातियों का रोपण प्राथमिक केंद्र है।',
      en: 'In Churu’s arid climate, the focus centres on water harvesting, traditional kund revival, drought-resilient native species (Khejri, Rohida, Neem), and Gaushala-linked organic farming.',
    },
    objectives: [
      { hi: 'शुष्क क्षेत्रों के अनुकूल कम पानी वाली देशी प्रजातियों का रोपण व सुरक्षा', en: 'Drought-resilient native plantation with survival protection' },
      { hi: 'सिंचाई जल की लवणता एवं मृदा परीक्षण जागरूकता (मारवाड़ी/बागड़ी सहयोग सहित)', en: 'Salinity & soil testing guidance supported in local Marwari/Bagri dialects' },
      { hi: 'चूरू-शेखावाटी की हवेलियों एवं कुंडों का जल व सोलर संरक्षण', en: 'Water & rooftop solar integration for historic Shekhawati havelis & kunds' },
    ],
    campaigns: [
      { hi: 'शुष्क क्षेत्र खेजड़ी व देशी वृक्ष संरक्षण', en: 'Arid-zone Khejri & native tree conservation' },
      { hi: 'पारंपरिक कुंड व वर्षा जल संचयन', en: 'Traditional kund & rainwater harvesting revival' },
      { hi: 'गौशाला वर्मीकम्पोस्ट एवं चारा विकास', en: 'Gaushala vermicompost & green fodder initiative' },
    ],
    eventsHighlight: {
      hi: 'चूरू किसान एवं गौशाला संवाद अभियान — प्रथम चरण सर्वेक्षण',
      en: 'Churu Farmer & Gaushala Outreach — Phase I Assessment',
    },
    imageKey: 'waterJohadKund',
    mapCoords: { x: 60, y: 27, labelOffset: 'top' },
  },
  {
    slug: 'bikaner',
    name: { hi: 'बीकानेर', en: 'Bikaner' },
    regionTag: { hi: 'मरुस्थल क्षेत्र • प्रथम चरण', en: 'Desert Zone · Phase I Focus' },
    focusSummary: {
      hi: 'गोबर संसाधन, चारा उत्पादन, स्थानीय नर्सरी और पशुपालन आधारित आत्मनिर्भरता',
      en: 'Dung resource value, fodder development, local nurseries & livestock resilience',
    },
    introduction: {
      hi: 'बीकानेर की समृद्ध पशुपालन व गौशाला परंपरा को देखते हुए यहाँ गोबर से जैविक खाद, बायोगैस व्यवहार्यता, स्थानीय पौध नर्सरी और मरुस्थलीय कृषि वानिकी पर कार्य प्रस्तावित है।',
      en: 'Building on Bikaner’s strong pastoral and Gaushala heritage, initiatives focus on organic dung-based manure, biogas feasibility, local nurseries, and desert agroforestry.',
    },
    objectives: [
      { hi: 'गौशाला सर्वेक्षण एवं गोबर आधारित खाद व बायोगैस मॉडल', en: 'Gaushala mapping and dung-to-compost/biogas circular models' },
      { hi: 'रेगिस्तानी मिट्टी के अनुकूल पौध नर्सरी एवं चारा विकास', en: 'Desert-adapted sapling nurseries and fodder development' },
      { hi: 'किसान एवं पशुपालक प्रशिक्षण कार्यक्रम', en: 'Farmer and pastoralist climate-resilience workshops' },
    ],
    campaigns: [
      { hi: 'बीकानेर नर्सरी एवं देशी चारा अभियान', en: 'Bikaner Nursery & Native Fodder Drive' },
      { hi: 'आत्मनिर्भर गौशाला संसाधन सर्वेक्षण', en: 'Self-Reliant Gaushala Resource Survey' },
    ],
    eventsHighlight: {
      hi: 'बीकानेर गौशाला एवं पशुपालक समन्वय बैठक',
      en: 'Bikaner Gaushala & Livestock Stewardship Outreach',
    },
    imageKey: 'gaushalaBiogas',
    mapCoords: { x: 39, y: 29, labelOffset: 'top' },
  },
  {
    slug: 'phalodi',
    name: { hi: 'फलोदी', en: 'Phalodi' },
    regionTag: { hi: 'पश्चिमी मरुस्थल • प्रथम चरण', en: 'Western Desert · Phase I Focus' },
    focusSummary: {
      hi: 'जल दक्षता, स्थानीय मरुस्थलीय पौधे और पारंपरिक जल स्रोतों का संवर्धन',
      en: 'Water efficiency, desert flora & traditional water stewardship',
    },
    introduction: {
      hi: 'फलोदी जैसे अति-शुष्क जिले में प्रत्येक बूँद का महत्व है। यहाँ मल्चिंग, ड्रिप सिंचाई जागरूकता, स्थानीय मरुस्थलीय वनस्पति संरक्षण और ग्राम स्तर पर जल संरक्षण पर ध्यान केंद्रित है।',
      en: 'In arid Phalodi, every drop counts. GOVEDA prioritises moisture conservation, mulching, native desert flora protection, and village-level water stewardship.',
    },
    objectives: [
      { hi: 'मृदा नमी संरक्षण, मल्चिंग और ड्रिप सिंचाई शिक्षा', en: 'Soil-moisture retention, mulching & drip irrigation literacy' },
      { hi: 'मरुस्थलीय जलवायु के अनुकूल स्थानीय वृक्षों की जीवितता देखभाल', en: 'Survival care for hardy desert-native saplings' },
      { hi: 'सौर ऊर्जा एवं सामुदायिक जल कुंड जागरूकता', en: 'Solar awareness & traditional kund stewardship' },
    ],
    campaigns: [
      { hi: 'जल दक्षता एवं मरुस्थलीय हरित पट्टी', en: 'Water Efficiency & Desert Green Belt Initiative' },
      { hi: 'फलोदी ग्राम हरित मित्र संपर्क', en: 'Phalodi Village Harit Mitra Outreach' },
    ],
    eventsHighlight: {
      hi: 'फलोदी जल एवं मरुस्थल संरक्षण संवाद',
      en: 'Phalodi Water & Desert Ecology Dialogue',
    },
    imageKey: 'organicAgroforestry',
    mapCoords: { x: 33, y: 46, labelOffset: 'left' },
  },
  {
    slug: 'jodhpur',
    name: { hi: 'जोधपुर', en: 'Jodhpur' },
    regionTag: { hi: 'मारवाड़ केंद्र • प्रथम चरण', en: 'Marwar Hub · Phase I Focus' },
    focusSummary: {
      hi: 'शहरी स्वच्छता, प्लास्टिक विकल्प, ग्रीन कैंपस, युवा कौशल और CSR सहभागिता',
      en: 'Urban cleanliness, plastic alternatives, Green Campus, youth skills & CSR',
    },
    introduction: {
      hi: 'जोधपुर में ग्रामीण वृक्षारोपण के साथ-साथ विश्वविद्यालयों व विद्यालयों में ग्रीन कैंपस, शहरी स्वच्छता, महिला SHG द्वारा कपड़े के थैले और संस्थागत CSR सहभागिता का समन्वय किया जा रहा है।',
      en: 'In Jodhpur, rural greening connects with university Green Campuses, urban waste segregation, women SHG cloth-bag production, and CSR collaboration.',
    },
    objectives: [
      { hi: 'शैक्षणिक संस्थानों में ग्रीन कैंपस एवं युवा हरित मित्र क्लब', en: 'University & school Green Campus clubs and youth leadership' },
      { hi: 'शहरी स्वच्छता, कचरा पृथक्करण और प्लास्टिक-मुक्त पहल', en: 'Urban cleanliness, segregation & plastic-free market drives' },
      { hi: 'कौशल विकास, महिला उद्यमिता एवं तकनीकी संस्थान सहयोग', en: 'Youth skill development, women SHGs & academic collaboration' },
    ],
    campaigns: [
      { hi: 'जोधपुर ग्रीन कैंपस एवं युवा अभियान', en: 'Jodhpur Green Campus & Youth Initiative' },
      { hi: 'मारवाड़ जल एवं विरासत संरक्षण', en: 'Marwar Water & Heritage Conservation' },
    ],
    eventsHighlight: {
      hi: 'जोधपुर ग्रीन कैंपस एवं संस्थागत सहभागिता श्रृंखला',
      en: 'Jodhpur Green Campus & Institutional Outreach Series',
    },
    imageKey: 'womenSkill',
    mapCoords: { x: 41, y: 56, labelOffset: 'bottom' },
  },
];
