import type {
  AnchorTabItem,
  MissionFaqItem,
  RealityColumnItem,
  VisualJourneyStep,
} from '../components/MinimalistMissionPrimitives';

export interface GaushalaProductItem {
  no: number;
  hi: string;
  en: string;
}

export interface GaushalaProductCategory {
  code: string;
  shortHi: string;
  shortEn: string;
  titleHi: string;
  titleEn: string;
  highlightHi: string;
  highlightEn: string;
  items: GaushalaProductItem[];
}

export const GAUSHALA_ANCHOR_TABS: readonly AnchorTabItem[] = [
  { id: 'gs-why', hi: 'दिक्कत और हल', en: 'Why It Matters' },
  { id: 'gs-circular', hi: '5 आसान कदम', en: '5 Simple Steps' },
  { id: 'gs-procurement', hi: 'गोबर संग्रह', en: 'Dung Collection' },
  { id: 'gs-manure', hi: 'खाद और खेती', en: 'Compost & Farm' },
  { id: 'gs-biogas', hi: 'गोबर से गैस', en: 'Biogas & Energy' },
  { id: 'gs-products', hi: '48 गोबर उत्पाद', en: '48 Eco Products' },
  { id: 'gs-welfare', hi: 'गायों की सेवा', en: 'Cow Care First' },
  { id: 'gs-dairy', hi: 'शुद्ध डेयरी', en: 'Pure Dairy' },
  { id: 'gs-schemes', hi: 'सरकारी मदद', en: 'Govt Schemes' },
  { id: 'gs-market', hi: 'काम और बाज़ार', en: 'Jobs & Market' },
  { id: 'gs-register', hi: 'गौशाला जोड़ें', en: 'Join Mission' },
  { id: 'gs-faqs', hi: 'सवाल-जवाब', en: 'FAQs' },
] as const;

export const GAUSHALA_REALITIES: RealityColumnItem[] = [
  {
    num: '01',
    titleHi: 'सिर्फ़ चंदे के भरोसे चलना मुश्किल है',
    titleEn: 'Running on donations alone is hard',
    descHi:
      'आज ज़्यादातर गाँव की गौशालाएँ सिर्फ़ दान-चंदे से चलती हैं। जब गर्मी या सूखा पड़ता है और चारा महँगा हो जाता है, तो गायों का पेट भरना बड़ी चुनौती बन जाता है।',
    descEn:
      'Most village Gaushalas rely only on seasonal donations. When summer hits and dry fodder gets costly, feeding every cow becomes a daily struggle.',
  },
  {
    num: '02',
    titleHi: 'रोज़ का गोबर यूं ही पड़ा रहता है',
    titleEn: 'Daily cow dung sits unused',
    descHi:
      'एक स्वस्थ गाय रोज़ 8 से 10 किलो गोबर देती है। सही तरीका न होने से यह बाहर ढेर बनकर पड़ा रहता है — जबकि इसी से खाद, रसोई गैस और गाँव का काम चल सकता है।',
    descEn:
      'One healthy cow gives 8–10 kg of dung every day. Without a simple setup, it piles up outside—even though it can make compost, kitchen gas, and village jobs.',
  },
  {
    num: '03',
    titleHi: 'सरकारी मदद की सही समझ नहीं मिल पाती',
    titleEn: 'Many shelters miss out on govt support',
    descHi:
      'गाँवों की बहुत-सी गौशालाएँ अभी रजिस्टर्ड नहीं हैं या उन्हें कागज़ात की साफ जानकारी नहीं होती। इस वजह से वे सरकारी चारा अनुदान और योजनाओं का लाभ नहीं ले पातीं।',
    descEn:
      'Many community cow shelters are unregistered or unsure about paperwork, so they miss out on state fodder grants, GOBARdhan, and CSR help.',
  },
  {
    num: '04',
    titleHi: 'गौशाला और खेत अलग-अलग पड़ गए हैं',
    titleEn: 'Gaushalas and village farms are disconnected',
    descHi:
      'पास के किसान को खेत सुधारने के लिए अच्छी गोबर खाद चाहिए, और गौशाला को गायों के लिए हरा चारा। दोनों एक-दूसरे के काम आ सकते हैं, बस एक सीधा रास्ता चाहिए।',
    descEn:
      'Local farmers need good cow-dung manure to heal their fields, and Gaushalas need fresh green fodder. They can help each other—they just need a simple bridge.',
  },
];

export const GAUSHALA_WHY_JOIN_BENEFITS = [
  {
    num: '01',
    titleHi: 'गोबर से काम शुरू करने का आसान नक्शा',
    titleEn: 'A simple plan to use daily dung',
    descHi:
      'गोबर के ढेर को साफ केंचुआ खाद, जीवामृत, बायोगैस या आसान उत्पादों में कैसे बदलें — इसका सीधा, जमीनी तरीका और प्रशिक्षण साथ मिलकर तय करते हैं।',
    descEn:
      'Step-by-step guidance to turn raw dung heaps into clean vermicompost beds, Jeevamrut drums, kitchen biogas, or simple village products.',
  },
  {
    num: '02',
    titleHi: 'रजिस्टर्ड और नई — दोनों गौशालाओं का साथ',
    titleEn: 'Guidance for registered & informal shelters',
    descHi:
      'अगर आपकी गौशाला रजिस्टर्ड है तो सरकारी व CSR मदद की तैयारी समझाते हैं, और अगर अभी रजिस्टर्ड नहीं है तो कागज़ बनवाने से लेकर तुरंत खाद शुरू करने में साथ देते हैं।',
    descEn:
      'Registered shelters get help preparing for govt and CSR schemes; unregistered village shelters get a clear path to register while starting compost right away.',
  },
  {
    num: '03',
    titleHi: 'गाँव की महिलाओं और युवाओं को सम्मान का काम',
    titleEn: 'Dignified work for village women & youth',
    descHi:
      'आसपास की बहनों (महिला समूह) और युवाओं को खाद छानना, गमले-धूप बनाना और साफ पैकिंग करना सिखाते हैं — ताकि गाँव में ही रोज़गार बने और गौशाला को भी सहारा मिले।',
    descEn:
      'Local women self-help groups and youth learn compost grading, eco-pots, dhoop making, and neat packing—creating village livelihoods alongside Gaushala income.',
  },
  {
    num: '04',
    titleHi: 'आसपास के किसानों और बाज़ार से सीधा जोड़',
    titleEn: 'Direct link with nearby farmers & buyers',
    descHi:
      '15–20 किमी के किसानों को खाद और देशी पौधे देकर गौशाला के लिए पक्के खरीदार और हरे चारे का आपसी सहयोग खड़ा करते हैं।',
    descEn:
      'Connecting with farmers within 15–20 km for organic manure and native saplings builds steady local buyers and a reliable green-fodder loop.',
  },
];

export const GAUSHALA_CIRCULAR_STEPS: VisualJourneyStep[] = [
  {
    step: '01',
    assetKey: 'medallionGaushala',
    titleHi: 'पहले हाल समझें और गायों की देखभाल पक्की करें',
    titleEn: 'Understand the shelter & secure cow care',
    descHi:
      'गौशाला में कितनी गायें हैं, छाया-पानी-चारा कैसा है और रोज़ कितना गोबर आता है — यह सब साथ बैठकर लिखते हैं।',
    descEn:
      'We sit with the Gaushala team to note cattle count, shade, water, fodder needs, and how much dung is available each day.',
  },
  {
    step: '02',
    assetKey: 'vignetteGaushalaCompost',
    titleHi: 'खाद, जीवामृत और देशी पौधों से तुरंत शुरुआत',
    titleEn: 'Start fast with compost, Jeevamrut & saplings',
    descHi:
      'सबसे पहले कम खर्च वाले काम शुरू होते हैं — छाया में केंचुआ खाद, जीवामृत और खेजड़ी-नीम-आंवला की छोटी नर्सरी।',
    descEn:
      'Begin with practical low-cost work: shaded vermicompost beds, Jeevamrut drums, and a small native sapling nursery.',
  },
  {
    step: '03',
    assetKey: 'vignetteBiogasDome',
    titleHi: 'गायों की संख्या के हिसाब से बायोगैस लगाएँ',
    titleEn: 'Add right-sized biogas for fuel & slurry',
    descHi:
      'जितनी गायें हों, उसी लायक बायोगैस प्लांट लगाते हैं — ताकि रसोई की लकड़ी-गैस बचे और नीचे से खेतों के लिए बढ़िया स्लरी खाद मिले।',
    descEn:
      'Match the biogas unit to cattle strength so the shelter saves kitchen fuel while getting rich liquid slurry for nearby fields.',
  },
  {
    step: '04',
    assetKey: 'medallionWomen',
    titleHi: 'गाँव की महिलाओं को 2–3 खास उत्पाद सिखाएँ',
    titleEn: 'Train village women on 2–3 local products',
    descHi:
      'हर चीज़ एक साथ नहीं बनानी — बस अपने इलाके में जो बिके (जैसे गमले, धूप, दीये या गोबर की लकड़ी), वही 2–3 चीज़ें साफ पैकिंग में बनाते हैं।',
    descEn:
      'No need to make everything—just pick 2–3 items that sell well locally (like sapling pots, dhoop, diyas, or fuel logs) and pack them cleanly.',
  },
  {
    step: '05',
    assetKey: 'medallionOrganic',
    titleHi: 'गाँव-बाज़ार में बेचें और पैसा गायों पर लगाएँ',
    titleEn: 'Sell locally & reinvest in the cows',
    descHi:
      'किसानों, मंदिरों और स्थानीय बाज़ार से जो आमदनी हो, उसे फिर से हरे चारे, बेहतर शेड और गायों के इलाज में लगाया जाता है।',
    descEn:
      'Proceeds from nearby farmers, temples, and village markets go straight back into green fodder, clean sheds, and veterinary care.',
  },
];

export const GAUSHALA_TEN_ACTIVITIES = [
  {
    no: '01',
    titleHi: 'गोबर से बढ़िया खाद',
    titleEn: 'Good Cow-Dung Compost',
    detailHi: 'छाया में केंचुआ खाद और सड़ी गोबर खाद बनाना, ताकि खेतों को शुद्ध पोषण मिले।',
    detailEn: 'Making clean vermicompost and well-rotted manure in shaded beds for nearby farms.',
  },
  {
    no: '02',
    titleHi: 'जीवामृत और देसी घोल',
    titleEn: 'Jeevamrut & Farm Tonics',
    detailHi: 'गोबर, गोमूत्र, गुड़ और बेसन से आसान घोल बनाना जो खेत की मिट्टी को ज़िंदा करता है।',
    detailEn: 'Simple fermented mixes of dung, urine, jaggery, and gram flour that revive soil.',
  },
  {
    no: '03',
    titleHi: 'गौशाला बायोगैस प्लांट',
    titleEn: 'Gaushala Biogas Unit',
    detailHi: 'गोबर से धुआँ-रहित रसोई गैस और खेतों के लिए पोषक तरल स्लरी खाद बनाना।',
    detailEn: 'Clean smokeless cooking fuel for the shelter plus rich bio-slurry for crops.',
  },
  {
    no: '04',
    titleHi: 'जिला स्तर पर बायो-CNG (प्रस्तावित)',
    titleEn: 'District Bio-CNG / CBG (Proposed)',
    detailHi: 'कई गौशालाओं के गोबर से बड़े प्लांट की जाँच-पड़ताल और सुरक्षा मानकों का अध्ययन।',
    detailEn: 'Feasibility study for pooling dung across clusters strictly under safety approvals.',
  },
  {
    no: '05',
    titleHi: 'गोमूत्र से खेती व सफाई उत्पाद',
    titleEn: 'Safe Gomutra Inputs',
    detailHi: 'खेती के कीट-नियंत्रक घोल और सफाई उत्पाद — पूरी जांच और नियमों के पालन के साथ।',
    detailEn: 'Agricultural pest repellents and cleaning items made with strict hygiene and rules.',
  },
  {
    no: '06',
    titleHi: 'गौशाला की पौध नर्सरी',
    titleEn: 'Native Sapling Nursery',
    detailHi: 'अपनी ही खाद से खेजड़ी, नीम, आंवला के पौधे उगाकर गाँव व हरित राजस्थान को देना।',
    detailEn: 'Growing Khejri, Neem, and Amla saplings using campus compost for local plantations.',
  },
  {
    no: '07',
    titleHi: 'अपनी ज़मीन पर हरा चारा',
    titleEn: 'Growing Green Fodder',
    detailHi: 'नेपियर घास, रिजका और ज्वार उगाकर बाहर से चारा खरीदने का खर्च घटाना।',
    detailEn: 'Cultivating Napier grass, lucerne, and sorghum to lower outside fodder expenses.',
  },
  {
    no: '08',
    titleHi: 'समय पर टीका व पशु इलाज',
    titleEn: 'Timely Vaccines & Vet Care',
    detailHi: 'बीमारी आने से पहले टीकाकरण, साफ पानी और पशु डॉक्टर से नियमित जाँच।',
    detailEn: 'Preventive vaccination camps, clean water troughs, and regular veterinary checkups.',
  },
  {
    no: '09',
    titleHi: 'गाँव के लिए सीखने का केंद्र',
    titleEn: 'Hands-On Village Training Hub',
    detailHi: 'गौशाला संचालकों, किसानों और महिलाओं को सामने करके सिखाने की व्यवस्था।',
    detailEn: 'Practical demonstrations where managers, farmers, and women SHGs learn by doing.',
  },
  {
    no: '10',
    titleHi: 'चुने हुए 2–3 गोबर उत्पाद',
    titleEn: '2–3 Chosen Eco Products',
    detailHi: 'दीये, धूपबत्ती, नर्सरी गमले, गोबर की लकड़ी या प्राकृतिक पेंट — स्थानीय मांग के अनुसार।',
    detailEn: 'Diyas, dhoop, sapling pots, fuel logs, or natural paint matched to local demand.',
  },
];

export const GAUSHALA_GOVT_SCHEMES = {
  registered: [
    {
      titleHi: 'राजस्थान सरकार का गौशाला चारा अनुदान',
      titleEn: 'Rajasthan State Gaushala Fodder Grant',
      descHi:
        'रजिस्टर्ड गौशालाओं को गायों के चारे-पानी के लिए सरकारी अनुदान मिलता है। इसके लिए गायों की टैगिंग, सही रजिस्टर और ऑडिट कैसे पूरा रखें — इसकी साफ समझ।',
      descEn:
        'Registered shelters can qualify for Rajasthan state fodder grants. We explain the simple ear-tagging, daily ledger, and audit steps needed.',
    },
    {
      titleHi: 'गोबर-धन योजना (स्वच्छ भारत मिशन ग्रामीण)',
      titleEn: 'GOBARdhan Scheme (Rural Cleanliness)',
      descHi:
        'ग्राम पंचायत और गौशाला के साथ मिलकर सामुदायिक बायोगैस और खाद इकाई लगवाने के लिए जिला प्रशासन से जुड़ने का रास्ता।',
      descEn:
        'How Gram Panchayats and registered Gaushalas can coordinate with district offices for community biogas and organic waste units.',
    },
    {
      titleHi: 'राष्ट्रीय गोकुल मिशन और NABARD मदद',
      titleEn: 'Rashtriya Gokul Mission & NABARD Support',
      descHi:
        'देसी नस्ल बचाव, चारा विकास, वर्मीकम्पोस्ट शेड और गाँव के काम के लिए सरकारी व बैंक योजनाओं की सीधी जानकारी।',
      descEn:
        'Plain guidance on government and NABARD schemes supporting indigenous breeds, fodder plots, and shaded compost units.',
    },
    {
      titleHi: 'कंपनियों (CSR) से शेड, सोलर व पानी की मदद',
      titleEn: 'Corporate CSR Help for Sheds & Solar',
      descHi:
        'अच्छी कंपनियाँ टिन शेड, सोलर पंप, बायोगैस या चारा बैंक के लिए मदद करती हैं — बस साफ हिसाब और सही प्रोजेक्ट कागज़ तैयार हों।',
      descEn:
        'Helping shelters prepare clear proposals and transparent records so CSR partners can fund sheds, solar pumps, or chaff cutters.',
    },
  ],
  unregistered: [
    {
      titleHi: 'कदम 1: ट्रस्ट या सोसायटी कैसे रजिस्टर करवाएँ',
      titleEn: 'Step 1: Register as a Society or Trust',
      descHi:
        'जो ग्राम गौशालाएँ अभी बिना रजिस्ट्रेशन चल रही हैं, उन्हें राजस्थान सोसायटी या पब्लिक ट्रस्ट बनवाने की सरल, कदम-दर-कदम जानकारी।',
      descEn:
        'Simple step-by-step guidance to formally register a village cow shelter under the Rajasthan Societies Act or as a Public Trust.',
    },
    {
      titleHi: 'कदम 2: रोज़ का साफ रजिस्टर शुरू करें',
      titleEn: 'Step 2: Keep Clean Daily Records',
      descHi:
        'गायों की गिनती, इलाज की कॉपी, ज़मीन की सहमति और आने-जाने वाले पैसे का साफ हिसाब रखना — ताकि आगे सरकारी मदद आसानी से मिल सके।',
      descEn:
        'Start keeping simple cattle count books, vet notes, land consent, and clean expense ledgers so the shelter becomes grant-ready.',
    },
    {
      titleHi: 'कदम 3: कागज़ बनने तक काम न रोकें — खाद से शुरू करें',
      titleEn: 'Step 3: Don’t wait—start compost right away',
      descHi:
        'रजिस्ट्रेशन की प्रक्रिया चलती रहे, तब तक आप केंचुआ खाद, जीवामृत, देशी पौधे और महिला समूह के आसान काम तुरंत शुरू कर सकते हैं।',
      descEn:
        'Even while paperwork is underway, the Gaushala can immediately start vermicompost beds, Jeevamrut, saplings, and local SHG crafts.',
    },
    {
      titleHi: 'कदम 4: ग्राम पंचायत और किसानों से हाथ मिलाएँ',
      titleEn: 'Step 4: Team up with Gram Panchayat & farmers',
      descHi:
        'गाँव की चारागाह ज़मीन, स्वच्छता अभियान और आसपास के किसानों के साथ “खाद लो, भूसा-चारा दो” जैसा सीधा स्थानीय मेलजोल।',
      descEn:
        'Partner with the Gram Panchayat on village grazing land and arrange simple manure-for-straw exchanges with neighboring farmers.',
    },
  ],
};

export const GAUSHALA_PROCUREMENT_TIERS = [
  {
    tier: 'कदम 1 · गाँव स्तर',
    titleHi: 'गौशाला में साफ गोबर इकट्ठा करना',
    titleEn: 'Step 1: Clean Collection at the Gaushala',
    descHi:
      'गौशाला में पक्के फर्श पर रोज़ का गोबर साफ इकट्ठा किया जाता है। इसमें से प्लास्टिक व पत्थर अलग करके रोज़ का वजन कॉपी में लिखा जाता है।',
    descEn:
      'Fresh dung is collected daily on a clean paved pad, kept free of plastic or stones, and logged simply in a daily register.',
  },
  {
    tier: 'कदम 2 · तहसील स्तर',
    titleHi: 'आसपास की 8–15 गौशालाओं को एक साथ जोड़ना',
    titleEn: 'Step 2: Pooling 8–15 Nearby Shelters Together',
    descHi:
      'अकेली छोटी गौशाला से गाड़ी चलाना महँगा पड़ता है। इसलिए पास की 8–15 गौशालाओं का गोबर एक तय रास्ते से तहसील केंद्र पर लाया जाता है।',
    descEn:
      'Sending a truck to one tiny shelter costs too much, so scheduled routes collect surplus dung from 8–15 nearby shelters to a tehsil hub.',
  },
  {
    tier: 'कदम 3 · जिला स्तर',
    titleHi: 'बड़ी खाद इकाई और प्रस्तावित ऊर्जा प्लांट',
    titleEn: 'Step 3: Large Compost Hub & Proposed Energy Study',
    descHi:
      'इकट्ठा हुए गोबर से बड़ी मात्रा में केंचुआ खाद, गोबर की लकड़ी और — पूरी जाँच व मंजूरी मिलने पर — बड़े बायो-CNG प्लांट की संभावना देखी जाती है।',
    descEn:
      'At district scale, pooled dung supports bulk vermicompost, fuel logs, and—strictly after feasibility and approvals—proposed Bio-CNG studies.',
  },
];

export const GAUSHALA_BIOGAS_SCALES = [
  {
    scale: '20 से 100 गायें',
    scaleEn: '20 to 100 Cattle',
    titleHi: 'छोटा गौशाला बायोगैस प्लांट',
    titleEn: 'Small Gaushala Biogas Unit',
    statusHi: 'आसान और आजमाया हुआ मॉडल',
    statusEn: 'Simple & Proven Model',
    pointsHi: [
      'रोज़ 200 से 1,000 किलो गोबर से कम दबाव की साफ रसोई गैस बनती है।',
      'गौशाला की रसोई, गायों के लिए गर्म पानी और रोशनी में लकड़ी-सिलेंडर का खर्च सीधा बचता है।',
      'नीचे आउटलेट से तुरंत खेतों के लिए ताकतवर तरल स्लरी खाद निकलती है।',
    ],
    pointsEn: [
      'Uses 200–1,000 kg of daily dung to make gentle, clean cooking biogas.',
      'Directly cuts firewood and LPG bills for shelter cooking, warm water, and lighting.',
      'Outputs ready-to-use liquid bio-slurry that boosts neighboring crops.',
    ],
  },
  {
    scale: '100 से 500 गायें',
    scaleEn: '100 to 500 Cattle',
    titleHi: 'मध्यम सामुदायिक बायोगैस व खाद इकाई',
    titleEn: 'Medium Community Biogas & Slurry Unit',
    statusHi: 'जगह और खर्च की जाँच के बाद स्थापना',
    statusEn: 'Built After Site Feasibility',
    pointsHi: [
      'इससे चारा काटने की मशीन, पानी की मोटर (जनरेटर) और बड़ी रसोई आराम से चल सकती है।',
      'मशीन से स्लरी छानकर सूखी खाद और तरल खाद — दोनों अलग-अलग बेचने लायक बन जाते हैं।',
      'सरकारी गोबर-धन योजना और CSR सहयोग के लिए यह सबसे उपयुक्त आकार है।',
    ],
    pointsEn: [
      'Generates enough energy to run chaff-cutters, biogas gensets, and community kitchens.',
      'Separates solid organic manure and liquid crop booster for local farm sales.',
      'Ideal size for GOBARdhan government convergence and CSR infrastructure grants.',
    ],
  },
  {
    scale: 'जिला समूह (10+ टन गोबर रोज़)',
    scaleEn: 'District Cluster (10+ Tons/Day)',
    titleHi: 'बड़ा बायो-CNG (CBG) प्लांट',
    titleEn: 'District Commercial Bio-CNG (CBG) Plant',
    statusHi: 'अभी प्रस्तावित — जाँच व अध्ययन के चरण में',
    statusEn: 'Proposed — Under Feasibility Study',
    pointsHi: [
      'कच्ची बायोगैस को मशीन से साफ करके 90% से ज़्यादा शुद्ध मीथेन गैस बनाई जाती है।',
      'इसे केवल सरकारी PESO मानक वाले बड़े सिलेंडरों में भरकर गाड़ियों या फैक्ट्री में उपयोग किया जाता है।',
      'यह तभी चलता है जब जमीन, प्रदूषण, PESO सुरक्षा और वित्तीय जाँच पूरी तरह पास हो जाए।',
    ],
    pointsEn: [
      'Raw biogas is scrubbed clean to over 90% pure methane for vehicle or industrial fuel.',
      'Compressed strictly into PESO-certified cascade cylinders—never domestic cylinders.',
      'Proceeds only after complete technical, environmental, financial, and PESO clearances.',
    ],
  },
];

export const GAUSHALA_48_PRODUCTS: GaushalaProductCategory[] = [
  {
    code: 'CAT-01',
    shortHi: '1. खेती व खाद (1–10)',
    shortEn: '1. Farm & Manure (1–10)',
    titleHi: '1. खेती और जैविक खाद वाले उत्पाद (01–10)',
    titleEn: '1. Farm Manure & Soil Care Items (01–10)',
    highlightHi: 'आसपास के किसानों को साल भर ज़रूरत रहती है — सबसे भरोसेमंद शुरुआत',
    highlightEn: 'Farmers need these all year round—the easiest and steadier starting point',
    items: [
      { no: 1, hi: 'केंचुआ खाद / वर्मीकम्पोस्ट (5, 25 और 50 किलो बोरी)', en: 'Enriched Vermicompost (5 kg / 25 kg / 50 kg bags)' },
      { no: 2, hi: 'PROM खाद (DAP का देसी जैविक विकल्प)', en: 'PROM Organic Fertilizer (Natural alternative to DAP)' },
      { no: 3, hi: 'दानेदार बायो-स्लरी खाद', en: 'Granulated Bio-Slurry Organic Manure' },
      { no: 4, hi: 'तरल स्लरी स्प्रे (फसल बढ़ाने वाला घोल)', en: 'Filtered Liquid Bio-Slurry Crop Spray' },
      { no: 5, hi: 'जीवामृत घोल (खेत की मिट्टी जगाने के लिए)', en: 'Jeevamrut Liquid Soil Culture' },
      { no: 6, hi: 'सूखा घन-जीवामृत (बुवाई से पहले डालने वाला)', en: 'Ghan-Jeevamrut Dry Soil Powder' },
      { no: 7, hi: 'बीजामृत (बुवाई से पहले बीज बचाने का घोल)', en: 'Beejamrut Natural Seed Treatment' },
      { no: 8, hi: 'पंचगव्य फसल टॉनिक', en: 'Panchagavya Crop Growth Tonic' },
      { no: 9, hi: 'नीमास्त्र व ब्रह्मास्त्र (देसी कीट भगाने का घोल)', en: 'Neemastra & Brahmastra Natural Pest Repellents' },
      { no: 10, hi: 'घर के गमलों और छत बगीचे की तैयार मिट्टी (पॉटिंग मिक्स)', en: 'Ready-to-Use Home & Terrace Garden Potting Mix' },
    ],
  },
  {
    code: 'CAT-02',
    shortHi: '2. नर्सरी व गमले (11–18)',
    shortEn: '2. Nursery & Pots (11–18)',
    titleHi: '2. पौधशाला, नर्सरी और बागवानी उत्पाद (11–18)',
    titleEn: '2. Nursery, Sapling & Garden Items (11–18)',
    highlightHi: 'प्लास्टिक की थैली की जगह गोबर के गमले — मिट्टी में घुलकर खाद बन जाते हैं',
    highlightEn: 'Replaces plastic nursery bags—melts straight into the soil as plant food',
    items: [
      { no: 11, hi: 'गोबर के गमले (4 से 12 इंच — पौधे सहित ज़मीन में लगाएँ)', en: 'Biodegradable Cow-Dung Nursery Pots (4" to 12")' },
      { no: 12, hi: 'छोटे बीज उगाने के कप और ट्रे', en: 'Biodegradable Seedling Cups & Trays' },
      { no: 13, hi: 'सीड बॉल्स (गोबर व मिट्टी में लिपटे देशी पेड़ों के बीज)', en: 'Native Tree Seed Balls (Cow Dung + Clay + Neem)' },
      { no: 14, hi: 'पौधे की जड़ में नमी रोकने वाली गोबर चकती (मल्च डिस्क)', en: 'Root Moisture-Saving Mulch Discs' },
      { no: 15, hi: 'टाँगने वाले गमलों की इको लाइनर टोकरी', en: 'Biodegradable Hanging Basket Liners' },
      { no: 16, hi: 'बगीचे और पार्क की घास के लिए बारीक खाद', en: 'Fine Organic Lawn & Park Top-Dressing' },
      { no: 17, hi: 'फलदार पेड़ों के तने पर लगाने वाला सुरक्षा लेप', en: 'Protective Cow-Dung & Clay Tree Trunk Paste' },
      { no: 18, hi: 'पौधे की जड़ मज़बूत करने वाले खाद के ब्लॉक', en: 'Compressed Nursery Root-Starter Blocks' },
    ],
  },
  {
    code: 'CAT-03',
    shortHi: '3. पूजा व त्योहार (19–28)',
    shortEn: '3. Pooja & Festive (19–28)',
    titleHi: '3. पूजा, हवन और त्योहारों के उत्पाद (19–28)',
    titleEn: '3. Pooja, Hawan & Festival Items (19–28)',
    highlightHi: 'बिना कोयले और बिना केमिकल के — मंदिरों और घरों में खूब पसंद किए जाते हैं',
    highlightEn: 'Charcoal-free and chemical-free—loved in temples and households',
    items: [
      { no: 19, hi: 'हर्बल धूपबत्ती (चंदन, गूगल, लोबान, गुलाब)', en: 'Herbal Cow-Dung Dhoop Cones (Sandal, Guggal, Rose)' },
      { no: 20, hi: 'बिना बांस और बिना कोयले की देसी अगरबत्ती', en: 'Bamboo-less & Charcoal-Free Herbal Incense' },
      { no: 21, hi: 'तैयार हवन कप (सांबरानी कप)', en: 'Ready-to-Light Herbal Sambrani / Hawan Cups' },
      { no: 22, hi: 'हवन और अग्निहोत्र के लिए साफ सुखाए कंडे / उपले', en: 'Clean Dried Hawan & Agnihotra Cow-Dung Cakes' },
      { no: 23, hi: 'अग्निहोत्र किट (तांबा पात्र + घी + छोटे कंडे)', en: 'Complete Daily Agnihotra Kit' },
      { no: 24, hi: 'नीम-गोबर से बनी मच्छर भगाने की कॉइल व स्टिक', en: 'Natural Neem & Lemongrass Mosquito Coils' },
      { no: 25, hi: 'दीपावली के गोबर के दीये (जलाने के बाद खाद बनें)', en: 'Eco-Friendly Diwali Cow-Dung Diyas' },
      { no: 26, hi: 'तैयार घी-बत्ती वाले दीये', en: 'Ready-to-Light Pure Ghee Wick Diyas' },
      { no: 27, hi: 'पानी में घुलने वाली गणेश-लक्ष्मी जी की मूर्तियाँ', en: 'Water-Soluble Eco Festival Idols' },
      { no: 28, hi: 'पारंपरिक विधि से बनी शुद्ध पूजा भस्म / विभूति', en: 'Traditionally Prepared Sacred Vibhuti' },
    ],
  },
  {
    code: 'CAT-04',
    shortHi: '4. हरित ईंधन (29–34)',
    shortEn: '4. Green Fuel (29–34)',
    titleHi: '4. लकड़ी बचाने वाले हरित ईंधन उत्पाद (29–34)',
    titleEn: '4. Tree-Saving Green Fuel Products (29–34)',
    highlightHi: 'जंगल की लकड़ी और कोयले की जगह स्वच्छ व सस्ता विकल्प',
    highlightEn: 'Saves forest trees by replacing firewood and coal',
    items: [
      { no: 29, hi: 'गौ-काष्ठ / गोबर की लकड़ी (श्मशान घाट व भट्ठियों के लिए)', en: 'Gau-Kashth (Cow-Dung Logs for Crematoria & Boilers)' },
      { no: 30, hi: 'गोबर और फसल अवशेष के ईंधन ब्रिकेट्स (ढाबों व उद्योगों के लिए)', en: 'Biomass Fuel Briquettes for Kilns & Kitchens' },
      { no: 31, hi: 'बर्नर के लिए छोटे बायो-पैलेट्स', en: 'Uniform Bio-Pellets for Commercial Burners' },
      { no: 32, hi: 'गौशाला की रसोई और चारा मशीन के लिए कच्ची बायोगैस', en: 'Raw Biogas for Shelter Kitchens & Chaff Cutters' },
      { no: 33, hi: 'शुद्ध बायो-CNG / CBG (प्रस्तावित — केवल PESO सुरक्षा मानकों के साथ)', en: 'Purified Bio-CNG / CBG (Proposed PESO Standard)' },
      { no: 34, hi: 'मिट्टी सुधारने वाला बायो-चारकोल (Bio-Char)', en: 'Cow-Dung Bio-Char for Soil Carbon' },
    ],
  },
  {
    code: 'CAT-05',
    shortHi: '5. देसी पेंट व घर (35–41)',
    shortEn: '5. Paint & Home (35–41)',
    titleHi: '5. गोबर का प्राकृतिक पेंट और घर ठंडा रखने वाले उत्पाद (35–41)',
    titleEn: '5. Natural Wall Paint & Cool-Home Items (35–41)',
    highlightHi: 'राजस्थान की तेज़ गर्मी में कमरों को प्राकृतिक ठंडक देने वाले उत्पाद',
    highlightEn: 'Non-toxic finishes that keep rooms naturally cooler in Rajasthan summers',
    items: [
      { no: 35, hi: 'गोबर से बना प्राकृतिक दीवार पेंट (इमल्शन व डिस्टेंपर)', en: 'Natural Non-Toxic Cow-Dung Wall Paint' },
      { no: 36, hi: 'वैदिक प्लास्टर (दीवारों को ठंडा रखने वाला जिप्सम-गोबर प्लास्टर)', en: 'Cooling Vedic Gypsum & Cow-Dung Wall Plaster' },
      { no: 37, hi: 'हल्की और गर्मी रोकने वाली गोबर-मिट्टी ईंटें', en: 'Heat-Insulating Lightweight Eco-Bricks' },
      { no: 38, hi: 'छत को धूप से ठंडा रखने वाली टाइल्स', en: 'Heat-Reflective Cool-Roof Tiles' },
      { no: 39, hi: 'कमरे के पार्टीशन और आवाज़ सोखने वाले बोर्ड', en: 'Dung-Fiber Acoustic & Partition Boards' },
      { no: 40, hi: 'आँगन और कॉटेज के फर्श पर लीपने का तैयार पेस्ट', en: 'Ready-Mix Heritage Courtyard Floor Coat' },
      { no: 41, hi: 'लकड़ी को दीमक से बचाने वाला देसी लेप', en: 'Natural Anti-Termite Wood Base Coat' },
    ],
  },
  {
    code: 'CAT-06',
    shortHi: '6. हस्तशिल्प व उपहार (42–48)',
    shortEn: '6. Crafts & Gifts (42–48)',
    titleHi: '6. हस्तशिल्प, ऑफिस उपहार और रोज़मर्रा के उत्पाद (42–48)',
    titleEn: '6. Village Handicrafts & Eco Gifts (42–48)',
    highlightHi: 'गाँव की महिला समूहों (SHG) के लिए सबसे अच्छा हुनर और सम्मानजनक कमाई',
    highlightEn: 'Great artisan craft opportunities for village Women Self-Help Groups',
    items: [
      { no: 42, hi: 'गोबर से बनी दीवार घड़ी, नेम-प्लेट और शुभ-लाभ तोरण', en: 'Handcrafted Eco Wall Clocks, Nameplates & Torans' },
      { no: 43, hi: 'ऑफिस के लिए पेन स्टैंड और मोबाइल होल्डर', en: 'Eco Office Pen Stands & Mobile Holders' },
      { no: 44, hi: 'हाथ से रंगी की-चेन और सजावटी स्मृति चिन्ह', en: 'Hand-Painted Craft Keychains & Souvenirs' },
      { no: 45, hi: 'गोबर के रेशे से बना हस्तनिर्मित कागज़, लिफाफे और बीज डायरी', en: 'Cow-Dung Handmade Paper, Envelopes & Seed Diaries' },
      { no: 46, hi: 'इको कैलेंडर और कार्यक्रमों के लिए ट्रॉफी-स्मृति चिन्ह', en: 'Eco Calendars & Conference Mementos' },
      { no: 47, hi: 'मुल्तानी-पंचगव्य स्नान साबुन व उबटन (केवल वैध लाइसेंस के बाद)', en: 'Traditional Multani-Panchagavya Bath Bars (Licensed)' },
      { no: 48, hi: 'पौधा उगाने वाली बीज राखी और त्योहार गिफ्ट हैंपर', en: 'Plantable Seed Rakhis & Festival Gift Hampers' },
    ],
  },
];

export const GAUSHALA_DAIRY_PRODUCTS = [
  {
    titleHi: 'शुद्ध देसी दूध',
    titleEn: 'Pure Indigenous Milk',
    descHi: 'पहले बछड़े को पूरा दूध — उसके बाद बचे हुए दूध को साफ काँच की बोतल में आसपास के परिवारों तक पहुँचाना।',
    descEn: 'The calf always feeds first; only surplus milk is chilled in clean glass bottles for nearby families.',
  },
  {
    titleHi: 'पारंपरिक बिलोना घी',
    titleEn: 'Traditional Bilona Ghee',
    descHi: 'पूरे दूध का दही जमाकर, लकड़ी की मथानी से मक्खन निकालकर धीमी आँच पर पारंपरिक तरीके से बना घी।',
    descEn: 'Whole milk set into curd, hand-churned with a wooden bilona, and slow-simmered into golden ghee.',
  },
  {
    titleHi: 'ताज़ा दही और छाछ',
    titleEn: 'Fresh Curd & Buttermilk',
    descHi: 'मिट्टी के बर्तन में जमा ताज़ा दही और ठंडी छाछ — गाँव व कस्बे के परिवारों के लिए।',
    descEn: 'Earthen-pot curd and fresh spiced buttermilk serving local neighborhood wellness.',
  },
  {
    titleHi: 'ताज़ा पनीर व मावा',
    titleEn: 'Fresh Paneer & Mawa',
    descHi: 'केवल वहीं जहाँ पर्याप्त अतिरिक्त दूध हो और FSSAI खाद्य सुरक्षा लाइसेंस व पूरी सफाई मौजूद हो।',
    descEn: 'Made strictly where healthy surplus milk exists inside an FSSAI-licensed hygienic kitchen.',
  },
];

export const GAUSHALA_MARKET_CHANNELS = [
  {
    num: '01',
    titleHi: 'आसपास के किसान (सबसे पक्के ग्राहक)',
    titleEn: 'Nearby Farmers (Most Reliable Buyers)',
    descHi:
      '15–20 किमी के दायरे के किसान केंचुआ खाद, जीवामृत और देशी पौधों के सबसे बड़े खरीदार होते हैं — और ढुलाई खर्च भी बहुत कम रहता है।',
    descEn:
      'Farmers within 15–20 km are steady buyers for vermicompost, Jeevamrut, and native saplings—with almost no freight cost.',
  },
  {
    num: '02',
    titleHi: 'मंदिर, आश्रम और त्योहारों के मेले',
    titleEn: 'Temples, Ashrams & Festival Fairs',
    descHi:
      'धूपबत्ती, बिना कोयले की अगरबत्ती, हवन कंडे, गोबर दीये और गौ-काष्ठ की सीधी मांग मंदिरों और दीपावली-होली के मेलों में रहती है।',
    descEn:
      'Temples, ashrams, and Diwali/Holi fairs create natural local demand for dhoop, hawan cakes, diyas, and gau-kashth.',
  },
  {
    num: '03',
    titleHi: 'स्कूल, कॉलेज, दफ़्तर और CSR कंपनियाँ',
    titleEn: 'Schools, Offices & CSR Partners',
    descHi:
      'पौधों के गोबर गमले, सीड डायरी, त्योहार उपहार और कैंपस के बगीचे की खाद के लिए संस्थानों से सीधी बात।',
    descEn:
      'Institutional buyers order cow-dung sapling pots, seed diaries, festive hampers, and campus garden compost.',
  },
  {
    num: '04',
    titleHi: 'साफ पैकिंग और गौशाला की सीधी पहचान',
    titleEn: 'Clean Packing & Direct Gaushala Identity',
    descHi:
      'हर पैकेट पर गौशाला का नाम, गाँव-जिला, वजन और बनाने की तारीख साफ लिखी हो — ताकि खरीदने वाले का भरोसा बढ़े।',
    descEn:
      'Every pack clearly prints the Gaushala name, village, weight, and date—so buyers trust real rural craft.',
  },
];

export const GAUSHALA_FAQS: MissionFaqItem[] = [
  {
    qHi: 'हमारी गाँव की गौशाला अभी रजिस्टर्ड नहीं है — क्या हम भी GOVEDA से जुड़ सकते हैं?',
    qEn: 'Our village Gaushala is not registered yet—can we still join GOVEDA?',
    aHi: 'जी हाँ, बिल्कुल। गाँवों की बहुत-सी गौशालाएँ अभी बिना रजिस्ट्रेशन के गायों की सेवा कर रही हैं। हम उन्हें ट्रस्ट या सोसायटी रजिस्ट्रेशन की आसान प्रक्रिया समझाते हैं, और तब तक वे केंचुआ खाद, जीवामृत व पौध नर्सरी का काम शुरू कर सकती हैं।',
    aEn: 'Yes, absolutely. Many village shelters serve cattle informally today. We guide them step by step on Society/Trust registration while helping them start vermicompost, Jeevamrut, and sapling nurseries right away.',
  },
  {
    qHi: 'क्या GOVEDA हर गौशाला से तय भाव पर गोबर खरीदने की पक्की गारंटी देता है?',
    qEn: 'Does GOVEDA guarantee a fixed per-kg cow dung buyback rate?',
    aHi: 'नहीं, हम पहले से कोई झूठा वादा नहीं करते। गोबर संग्रह या खरीद का भाव, रोज़ की मात्रा और गाड़ी का खर्च — यह सब उस गौशाला के साथ बैठकर, स्थानीय हालत देखकर और लिखित समझौते से तय होता है।',
    aEn: 'No—we stay completely honest. Any dung collection rate, daily volume, and transport arrangement is decided together with each Gaushala based on local feasibility and a written agreement.',
  },
  {
    qHi: 'क्या एक गौशाला को ये सभी 48 गोबर उत्पाद बनाने पड़ते हैं?',
    qEn: 'Does one Gaushala have to make all 48 cow-dung items?',
    aHi: 'बिल्कुल नहीं! 48 चीज़ों की सूची सिर्फ़ यह दिखाने के लिए है कि गोबर से क्या-क्या बन सकता है। हमारा सीधा नियम है — एक गौशाला अपने इलाके की मांग देखकर सिर्फ़ 2 या 3 बढ़िया चीज़ें (जैसे खाद + गमले + धूपबत्ती) चुनकर शुरू करे।',
    aEn: 'Not at all! The 48 items simply show what is possible. Our practical rule is “One Gaushala, One Specialty”—pick just 2 or 3 items that sell easily nearby (like compost, sapling pots, and dhoop).',
  },
  {
    qHi: 'क्या गौशाला की बायोगैस को घर के सामान्य LPG सिलेंडर में भरा जा सकता है?',
    qEn: 'Can Gaushala biogas be filled into normal home LPG cylinders?',
    aHi: 'कभी नहीं — यह बहुत खतरनाक और गैर-कानूनी है। गौशाला की कच्ची बायोगैस सीधी पाइपलाइन से खास चूल्हे में जलती है। गाड़ियों में चलने वाली बायो-CNG (CBG) के लिए बड़ी सफाई मशीन और सरकारी PESO मानक वाले खास सिलेंडर ज़रूरी होते हैं।',
    aEn: 'Never—it is unsafe and illegal. Raw Gaushala biogas goes through low-pressure pipes straight to a biogas burner. Vehicle-grade Bio-CNG (CBG) requires industrial scrubbing and PESO-certified cylinders.',
  },
  {
    qHi: 'बड़े जिला-स्तरीय बायो-CNG (CBG) प्लांट अभी चालू हैं या प्रस्तावित?',
    qEn: 'Are district Bio-CNG (CBG) plants running right now or proposed?',
    aHi: 'अभी ये प्रस्तावित और जाँच-पड़ताल (Feasibility Study) के चरण में हैं। जब तक किसी प्लांट को जमीन, गोबर आपूर्ति, प्रदूषण और PESO सुरक्षा की पूरी मंजूरी न मिल जाए, हम उसे चालू प्लांट नहीं बताते।',
    aEn: 'They are currently in the Proposed / Feasibility Study stage. We never show any plant as running until land, feedstock, pollution, and PESO safety clearances are actually complete.',
  },
  {
    qHi: 'हमारी गौशाला में ज़्यादातर बूढ़ी और बेसहारा गायें हैं, दूध नहीं होता — क्या फिर भी आत्मनिर्भर बन सकते हैं?',
    qEn: 'Most cows in our shelter are old or rescued and don’t give milk—can we still become self-reliant?',
    aHi: 'हाँ! दरअसल ज़्यादातर गौशालाओं की असली ताकत दूध नहीं, बल्कि गोबर, गोमूत्र, केंचुआ खाद, पौध नर्सरी, बायोगैस और गोबर उत्पाद हैं। डेयरी सिर्फ़ वहीं की जाती है जहाँ स्वस्थ दुधारू गायें हों, बछड़े को पूरा दूध मिले और FSSAI लाइसेंस हो।',
    aEn: 'Yes! For most shelters, the real engine is not milk—it is daily cow dung, vermicompost, native sapling nurseries, biogas, and eco-products. Dairy applies only where healthy milking cows, calf-first feeding, and FSSAI licensing exist.',
  },
  {
    qHi: 'गाँव की महिलाओं और युवाओं को इस मिशन से कैसे काम मिलता है?',
    qEn: 'How do village women and youth get work through this mission?',
    aHi: 'गौशाला या पास के प्रशिक्षण केंद्र में गाँव की महिलाओं (SHG) और युवाओं को खाद छानना, गमले-दीये-धूप बनाना, साफ पैकिंग और बिक्री सिखाई जाती है। इससे उन्हें गाँव में ही सम्मानजनक काम मिलता है।',
    aEn: 'Village women SHGs and youth receive hands-on training in compost grading, eco-pots, dhoop/diya crafting, neat packing, and local selling—creating dignified work right inside the village.',
  },
  {
    qHi: 'क्या गायों की हाज़िरी या बीमारी पहचानने वाला सॉफ्टवेयर अभी इसी वेबसाइट पर चालू है?',
    qEn: 'Is cattle attendance or AI disease detection software live on this website right now?',
    aHi: 'नहीं, हम साफ बात रखते हैं। पशु हाज़िरी, स्टाफ रिकॉर्ड, AI बीमारी पहचान और ऑनलाइन डॉक्टर सहायता के लिए आगे एक अलग सॉफ्टवेयर बनाया जाएगा। अभी इस वेबसाइट पर पूरी जानकारी, गौशाला सर्वे और जुड़ने का फॉर्म उपलब्ध है।',
    aEn: 'No—we keep full transparency. Cattle attendance, staff logs, AI disease detection, and telemedicine are planned as a separate future software module. Today this site handles guidance, surveys, and registration.',
  },
  {
    qHi: 'गौशाला की पौध नर्सरी “हरित राजस्थान” से कैसे जुड़ती है?',
    qEn: 'How does a Gaushala sapling nursery connect with Harit Rajasthan?',
    aHi: 'गौशाला के पास अपनी गोबर खाद, पानी और देखभाल करने वाले लोग पहले से होते हैं। वहाँ गोबर के गमलों में खेजड़ी, नीम, आंवला और जामुन के पौधे तैयार करके हरित राजस्थान अभियान और पास के किसानों को दिए जा सकते हैं।',
    aEn: 'Gaushalas already have compost, water, and caretakers on site. Raising Khejri, Neem, Amla, and Jamun saplings in cow-dung pots directly supplies Harit Rajasthan drives and local farmers.',
  },
  {
    qHi: 'कोई दानदाता या CSR कंपनी किसी गौशाला की मदद कैसे कर सकती है?',
    qEn: 'How can a donor or CSR company help a village Gaushala?',
    aHi: 'कंपनियाँ या दानदाता टिन शेड, केंचुआ खाद बेड, सोलर पानी पंप, चारा मशीन, बायोगैस या पशु चिकित्सा शिविर में मदद करने के लिए नीचे दिए गए फॉर्म से जुड़ सकते हैं। पूरा काम साफ रिपोर्ट और पारदर्शिता से होता है।',
    aEn: 'Donors and CSR teams can support shaded sheds, compost beds, solar pumps, chaff cutters, biogas units, or vet camps through the partnership form below with full transparency.',
  },
];

export interface GaushalaEcosystemNode {
  id: string;
  angleDeg: number;
  assetKey:
    | 'medallionGaushala'
    | 'medallionOrganic'
    | 'vignetteGaushalaCompost'
    | 'vignetteBiogasDome'
    | 'medallionHarit'
    | 'medallionWomen'
    | 'vignetteGaushalaEcoProducts'
    | 'vignetteGaushalaFodderVet';
  accent: 'forest' | 'amber';
  labelAlign: 'left' | 'right' | 'top' | 'bottom';
  mobileLabelPos: 'top' | 'bottom';
  targetSectionId: string;
  titleHi: [string, string];
  titleEn: [string, string];
  shortHi: [string, string];
  shortEn: [string, string];
  summaryHi: string;
  summaryEn: string;
}

export const GAUSHALA_ECOSYSTEM_NODES: GaushalaEcosystemNode[] = [
  {
    id: 'cow-care',
    angleDeg: -135,
    assetKey: 'medallionGaushala',
    accent: 'amber',
    labelAlign: 'left',
    mobileLabelPos: 'top',
    targetSectionId: 'gs-welfare',
    titleHi: ['गायों की', 'अच्छी देखभाल'],
    titleEn: ['Safe Cow', 'Care First'],
    shortHi: ['गायों की', 'देखभाल'],
    shortEn: ['Cow Care', '& Health'],
    summaryHi:
      'सबसे पहला काम: हवादार छाया वाला शेड, साफ पानी की कुंडी, समय पर टीका और पशु डॉक्टर की देखभाल।',
    summaryEn:
      'Step one is always the cow: airy shade against heat, clean stone water troughs, vaccines, and caring veterinary checkups.',
  },
  {
    id: 'fodder',
    angleDeg: -90,
    assetKey: 'vignetteGaushalaFodderVet',
    accent: 'forest',
    labelAlign: 'top',
    mobileLabelPos: 'top',
    targetSectionId: 'gs-welfare',
    titleHi: ['हरा चारा', 'अपना उत्पादन'],
    titleEn: ['Local Green', 'Fodder'],
    shortHi: ['हरा चारा', 'उगाना'],
    shortEn: ['Green', 'Fodder'],
    summaryHi:
      'गौशाला की ज़मीन और पास के खेतों में नेपियर घास, रिजका व ज्वार उगाना — ताकि बाहर से चारा खरीदने का बड़ा खर्च बचे।',
    summaryEn:
      'Growing Napier grass, lucerne, and sorghum on campus and partner farms cuts heavy outside fodder bills year-round.',
  },
  {
    id: 'dung-hub',
    angleDeg: -45,
    assetKey: 'vignetteGaushalaCompost',
    accent: 'amber',
    labelAlign: 'right',
    mobileLabelPos: 'top',
    targetSectionId: 'gs-procurement',
    titleHi: ['साफ गोबर', 'संग्रह व खाद'],
    titleEn: ['Clean Dung', '& Compost'],
    shortHi: ['गोबर', 'संग्रह'],
    shortEn: ['Dung &', 'Compost'],
    summaryHi:
      'एक गाय से रोज़ मिलने वाले 8–10 किलो गोबर को प्लास्टिक-पत्थर से अलग करके साफ केंचुआ खाद और क्लस्टर काम में लाना।',
    summaryEn:
      'Keeping daily 8–10 kg cow dung clean and plastic-free so it turns into quality vermicompost or pooled feedstock.',
  },
  {
    id: 'natural-inputs',
    angleDeg: 0,
    assetKey: 'medallionOrganic',
    accent: 'forest',
    labelAlign: 'right',
    mobileLabelPos: 'bottom',
    targetSectionId: 'gs-manure',
    titleHi: ['खेतों के लिए', 'जीवामृत व खाद'],
    titleEn: ['Farm Tonics', '(Jeevamrut)'],
    shortHi: ['जीवामृत', 'व खाद'],
    shortEn: ['Natural', 'Inputs'],
    summaryHi:
      'जीवामृत, घनजीवामृत, बीजामृत और केंचुआ खाद सीधे आसपास के किसानों के खेतों में जाकर मिट्टी की जान वापस लाती है।',
    summaryEn:
      'Jeevamrut, Ghanjeevamrut, Beejamrut, and vermicompost go straight to nearby village farms to restore living soil.',
  },
  {
    id: 'biogas',
    angleDeg: 45,
    assetKey: 'vignetteBiogasDome',
    accent: 'amber',
    labelAlign: 'right',
    mobileLabelPos: 'bottom',
    targetSectionId: 'gs-biogas',
    titleHi: ['गोबर से गैस', 'और स्लरी'],
    titleEn: ['Biogas &', 'Rich Slurry'],
    shortHi: ['बायोगैस', 'ऊर्जा'],
    shortEn: ['Biogas', 'Energy'],
    summaryHi:
      'गायों की गिनती के हिसाब से बायोगैस प्लांट — ऊपर से रसोई की धुआँ-रहित गैस और नीचे से खेतों के लिए तरल खाद।',
    summaryEn:
      'Right-sized biogas turns the same dung into smokeless kitchen gas above and fertile bio-slurry for crops below.',
  },
  {
    id: 'nursery',
    angleDeg: 90,
    assetKey: 'medallionHarit',
    accent: 'forest',
    labelAlign: 'bottom',
    mobileLabelPos: 'bottom',
    targetSectionId: 'gs-manure',
    titleHi: ['पौध नर्सरी', 'और बागवानी'],
    titleEn: ['Sapling Nursery', '& Orchard'],
    shortHi: ['नर्सरी व', 'बागवानी'],
    shortEn: ['Nursery &', 'Orchard'],
    summaryHi:
      'गौशाला की खाली ज़मीन पर खेजड़ी-नीम के पौधे, ताज़ी सब्ज़ियाँ और किसानों को सिखाने का छोटा प्राकृतिक खेत।',
    summaryEn:
      'Raising native Khejri and Neem saplings, fresh vegetables, fruit trees, and a simple farmer learning plot on spare campus land.',
  },
  {
    id: 'shg-training',
    angleDeg: 135,
    assetKey: 'medallionWomen',
    accent: 'amber',
    labelAlign: 'left',
    mobileLabelPos: 'bottom',
    targetSectionId: 'gs-products',
    titleHi: ['गाँव की बहनें', 'और 2–3 उत्पाद'],
    titleEn: ['Women SHGs', '& 2–3 Crafts'],
    shortHi: ['महिला काम', 'व उत्पाद'],
    shortEn: ['Women', '& Crafts'],
    summaryHi:
      'गाँव की महिलाओं और युवाओं को धूपबत्ती, दीये, गोबर के गमले या गोबर की लकड़ी बनाना सिखाकर रोज़गार देना।',
    summaryEn:
      'Training local women and youth to craft 2–3 easy-to-sell items like dhoop, diyas, nursery pots, or cow-dung fuel logs.',
  },
  {
    id: 'market',
    angleDeg: 180,
    assetKey: 'vignetteGaushalaEcoProducts',
    accent: 'forest',
    labelAlign: 'left',
    mobileLabelPos: 'top',
    targetSectionId: 'gs-market',
    titleHi: ['सीधा बाज़ार', 'और पुनर्निवेश'],
    titleEn: ['Local Sales', '& Reinvestment'],
    shortHi: ['बाज़ार व', 'सहयोग'],
    shortEn: ['Market', '& Sales'],
    summaryHi:
      'आसपास के किसानों, मंदिरों और स्थानीय बाज़ार में बेचकर जो पैसा आता है, वह फिर से गायों के चारे व सेवा में लगता है।',
    summaryEn:
      'Selling directly to nearby farmers, temples, and local buyers cycles every rupee of surplus right back into cow welfare.',
  },
];

export const GAUSHALA_SOIL_PRINCIPLES = [
  {
    code: '01',
    accent: '#4B8A2A',
    titleHi: 'मिट्टी को ढककर रखें (आच्छादन / Mulching)',
    titleEn: 'Keep Soil Covered (Mulching)',
    descHi:
      'खेत की खुली मिट्टी पर सूखी घास या फसल के डंठल बिछा देने से राजस्थान की तेज़ धूप पानी नहीं उड़ा पाती और जड़ें ठंडी रहती हैं।',
    descEn:
      'Spreading dry grass or crop straw over bare soil stops hot sun from drying out moisture and keeps plant roots cool.',
  },
  {
    code: '02',
    accent: '#2B7A78',
    titleHi: 'हवा और नमी बराबर रहे (वापसा / Whapasa)',
    titleEn: 'Balance Air & Moisture (Whapasa)',
    descHi:
      'पौधों की जड़ों को सिर्फ़ भरा हुआ पानी नहीं, बल्कि आधी हवा और आधी नमी चाहिए — इससे बहुत कम सिंचाई में भी फसल हरी-भरी रहती है।',
    descEn:
      'Roots need half air and half moisture—not waterlogged soil. With this balance, crops stay strong using far less irrigation water.',
  },
  {
    code: '03',
    accent: '#C77D26',
    titleHi: 'मिट्टी के दोस्त कीटाणु (सूक्ष्मजीव)',
    titleEn: 'Friendly Soil Microbes',
    descHi:
      'देसी गाय के ताज़ा गोबर और जीवामृत में करोड़ों अच्छे कीटाणु होते हैं, जो ज़मीन के अंदर छिपे पोषण को पौधों की जड़ों तक पहुँचाते हैं।',
    descEn:
      'Fresh indigenous cow dung and Jeevamrut carry millions of helpful microbes that unlock natural nutrients right at the roots.',
  },
  {
    code: '04',
    accent: '#7A4F2B',
    titleHi: 'देसी केंचुए — खेत का प्राकृतिक हल',
    titleEn: 'Earthworms — Nature’s Own Plough',
    descHi:
      'जब खेत में ज़्यादा रासायनिक दवाई नहीं पड़ती, तो देसी केंचुए लौट आते हैं। वे मिट्टी को नरम बनाते हैं और बारिश का पानी सोखने में मदद करते हैं।',
    descEn:
      'When harsh chemicals are reduced, native earthworms return—loosening hard earth and helping fields soak up rainwater naturally.',
  },
];

export const GAUSHALA_NATURAL_INPUTS = [
  {
    id: 'jeevamrut',
    titleHi: 'जीवामृत',
    titleEn: 'Jeevamrut',
    tagHi: 'सिंचाई के साथ देने वाला घोल',
    tagEn: 'Liquid Soil Booster',
    descHi:
      'ताज़ा गोबर, गोमूत्र, थोड़ा गुड़, बेसन और मेड़ की मिट्टी को पानी में 2–3 दिन रखकर बनता है। सिंचाई के पानी के साथ खेत में चलाने से मिट्टी में जान आ जाती है।',
    descEn:
      'Fresh cow dung, urine, a little jaggery, gram flour, and live field soil fermented for 2–3 days—mixed into irrigation water to wake up the soil.',
  },
  {
    id: 'ghanjeevamrut',
    titleHi: 'घनजीवामृत',
    titleEn: 'Ghanjeevamrut',
    tagHi: 'सूखा खाद पाउडर (महीनों चले)',
    tagEn: 'Dry Long-Shelf Manure',
    descHi:
      'यही जीवामृत छाया में सुखाकर सूखा तैयार किया जाता है। इसे बोरी में महीनों रख सकते हैं और बुवाई से पहले सीधे खेत में बिखेर सकते हैं।',
    descEn:
      'The shade-dried solid form of Jeevamrut. Easy to store in bags for months and spread directly on fields before sowing.',
  },
  {
    id: 'beejamrut',
    titleHi: 'बीजामृत',
    titleEn: 'Beejamrut',
    tagHi: 'बुवाई से पहले बीज सुरक्षा',
    tagEn: 'Natural Seed Coating',
    descHi:
      'बुवाई से पहले बीजों पर गोबर, गोमूत्र और थोड़े चूने का हल्का लेप चढ़ाया जाता है। इससे अंकुरण अच्छा होता है और छोटे पौधे जड़ रोग से बचते हैं।',
    descEn:
      'A gentle pre-sowing coat of cow dung, urine, and lime on seeds so they sprout stronger and stay safe from early root disease.',
  },
  {
    id: 'vermicompost',
    titleHi: 'केंचुआ खाद (वर्मीकम्पोस्ट)',
    titleEn: 'Vermicompost',
    tagHi: 'काली भुरभुरी बढ़िया खाद',
    tagEn: 'Rich Black Humus',
    descHi:
      'छाया में 45–60 दिन में तैयार होने वाली गंध-रहित काली खाद। खेतों, सब्ज़ी की क्यारियों, पौध नर्सरी और घर के गमलों — सबके लिए सबसे आसान खाद।',
    descEn:
      'Odorless, soft black humus ready in 45–60 days under shade. Works wonderfully for village farms, vegetable beds, nurseries, and home pots.',
  },
];

export const GAUSHALA_LAND_USES = [
  {
    no: '01',
    titleHi: 'ताज़ी सब्ज़ियाँ',
    titleEn: 'Fresh Vegetables',
    descHi: 'गौशाला की रसोई और गाँव के परिवारों के लिए बिना दवाई की मौसमी सब्ज़ियाँ।',
    descEn: 'Chemical-free seasonal vegetables for the shelter kitchen and village homes.',
  },
  {
    no: '02',
    titleHi: 'फलों के पेड़',
    titleEn: 'Fruit Trees',
    descHi: 'आंवला, बेर, अमरूद, अनार और सहजन जैसे कम पानी में चलने वाले देसी पेड़।',
    descEn: 'Water-wise Rajasthan trees like Amla, Ber, Guava, Pomegranate, and Moringa.',
  },
  {
    no: '03',
    titleHi: 'हरा चारा',
    titleEn: 'Green Fodder',
    descHi: 'नेपियर घास, रिजका और ज्वार उगाकर बाहर से चारा खरीदने का खर्च बचाना।',
    descEn: 'Growing Napier grass, lucerne, and sorghum right on campus to save fodder money.',
  },
  {
    no: '04',
    titleHi: 'देशी पौध नर्सरी',
    titleEn: 'Native Sapling Nursery',
    descHi: 'गोबर के गमलों में खेजड़ी, नीम और रोहिड़ा के पौधे — हरित राजस्थान के लिए।',
    descEn: 'Raising Khejri, Neem, and Rohida saplings in cow-dung pots for local planting.',
  },
  {
    no: '05',
    titleHi: 'सीखने का छोटा खेत',
    titleEn: 'Farmer Learning Plot',
    descHi: 'आसपास के किसान खुद आकर देख सकें कि गोबर खाद और जीवामृत से फसल कैसी होती है।',
    descEn: 'A small live plot where visiting farmers can see natural farming results firsthand.',
  },
];

export const GAUSHALA_INFRA_PILLARS = [
  {
    code: '01',
    titleHi: 'धूप, लू और सर्दी से बचाने वाला हवादार शेड',
    titleEn: 'Cool, Airy Shed Against Heat & Cold',
    descHi:
      'राजस्थान की तेज़ गर्मी, ठंडी हवा और बारिश से गायों को बचाने के लिए ऊँची छायादार छत और साफ-सफाई वाला पक्का फर्श।',
    descEn:
      'High shaded roofs and clean non-slip floors that keep cattle comfortable through scorching summers, winter cold, and monsoon rain.',
  },
  {
    code: '02',
    titleHi: 'साफ पीने का पानी और बारिश का जल बचाना',
    titleEn: 'Clean Drinking Water & Rainwater Tank',
    descHi:
      'छत से बारिश का पानी टांके में बचाना, सोलर से पानी खींचना और रोज़ साफ होने वाली पत्थर की पानी खेली।',
    descEn:
      'Storing rooftop rainwater in tanks, running solar water pumps, and keeping stone drinking troughs scrubbed clean.',
  },
  {
    code: '03',
    titleHi: 'समय पर टीका और पशु डॉक्टर की देखभाल',
    titleEn: 'Timely Vaccines & Vet Checkups',
    descHi:
      'खुरपका-मुँहपका और लम्पी से पहले ही टीकाकरण, बीमार गाय के लिए अलग शांत कमरा और पशु डॉक्टर से नियमित संपर्क।',
    descEn:
      'Preventive vaccination camps, a quiet separate bay for sick or injured cows, and regular visits from qualified vets.',
  },
  {
    code: '04',
    titleHi: 'सूखे भूसे का गोदाम और हरा चारा',
    titleEn: 'Dry Fodder Store & Green Feed',
    descHi:
      'भूसा भीगने से बचाने के लिए सुरक्षित गोदाम, चारा काटने की कुट्टी मशीन और साल भर के लिए संतुलित चारा योजना।',
    descEn:
      'Weatherproof storage for dry straw, chaff cutters to stop feed waste, mineral blocks, and planned green fodder.',
  },
];
