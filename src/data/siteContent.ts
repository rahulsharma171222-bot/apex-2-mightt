import type { BilingualText, ProjectItem, TrainingArticle } from '../types/goveda';

export const BRAND_INFO = {
  shortName: 'GOVEDA',
  fullName: 'GOVEDA CARBON & CLIMATE INDIA FOUNDATION',
  motto: 'PEOPLE | PLANET | PROSPERITY',
  email: 'govedaindiafoundation@gmail.com',
  entityType: {
    hi: 'Section 8 गैर-लाभकारी संस्था (Non-Profit Organisation)',
    en: 'Section 8 Non-Profit Organisation',
  },
  vision2030: {
    hi: 'हरित राजस्थान से हरित भारत (2026–2030)',
    en: 'Green Rajasthan to Green India (2026–2030)',
  },
};

export const ABOUT_SECTIONS = {
  intro: {
    hi: 'GOVEDA Carbon & Climate India Foundation एक Section 8 Non-Profit Organisation है, जिसकी स्थापना पर्यावरण संरक्षण, ग्रामीण विकास, गौशाला आत्मनिर्भरता, कार्बन जागरूकता, कौशल विकास, महिला सशक्तीकरण और सामाजिक कल्याण को एकीकृत डिजिटल मिशन के रूप में आगे बढ़ाने के उद्देश्य से की गई है।',
    en: 'GOVEDA Carbon & Climate India Foundation is a Section 8 Non-Profit Organisation established to unite environmental conservation, farmer prosperity, self-reliant Gaushalas, climate & carbon literacy, youth skill development, women empowerment, and heritage preservation into a structured grassroots mission.',
  },
  vision: {
    hi: 'हरित, स्वच्छ, आत्मनिर्भर और समृद्ध भारत का निर्माण — जहाँ प्रकृति, किसान, गौवंश और समाज साथ-साथ आगे बढ़ें।',
    en: 'Building a green, clean, self-reliant, and prosperous India where nature, farmers, cattle, and communities thrive together.',
  },
  mission: {
    hi: 'पर्यावरण संरक्षण, वैज्ञानिक खेती, आत्मनिर्भर गौशाला मॉडल, कौशल विकास, महिला सशक्तीकरण और जन-भागीदारी को व्यावहारिक व पारदर्शी अभियानों से जोड़ना।',
    en: 'Integrating tree plantation, climate education, self-reliant Gaushalas, rural employment, women’s collectives, and civic participation through transparent grassroots action.',
  },
  objectives: [
    { hi: 'भीलवाड़ा, चूरू, बीकानेर, फलोदी और जोधपुर से प्रारंभ कर राजस्थान व भारत स्तर पर हरित आवरण विस्तार', en: 'Phased green expansion beginning in Bhilwara, Churu, Bikaner, Phalodi, and Jodhpur across Rajasthan and India' },
    { hi: 'किसानों व ग्रामीण युवाओं को कार्बन क्रेडिट और जलवायु कार्रवाई की स्पष्ट, यथार्थपरक व गारंटी-मुक्त शिक्षा देना', en: 'Providing clear, realistic, non-guaranteed carbon literacy and agroforestry guidance to farmers' },
    { hi: 'गौशालाओं को जैविक खाद, चारा और स्वच्छ ऊर्जा के आत्मनिर्भर केंद्रों के रूप में विकसित करना', en: 'Developing Gaushalas into self-reliant rural hubs through compost, fodder, and clean energy feasibility' },
    { hi: 'पारदर्शी रिपोर्टिंग: केवल सत्यापित कार्य और वास्तविक प्रगति को ही सार्वजनिक रूप से प्रकाशित करना', en: 'Publishing strictly verified progress figures and maintaining full institutional transparency' },
  ],
  founderMessage: {
    title: { hi: 'संस्थापक एवं अध्यक्ष का संदेश', en: 'Founder & President’s Message' },
    quote: {
      hi: 'हमारा उद्देश्य केवल एक पारंपरिक एनजीओ चलाना नहीं, बल्कि राजस्थान के गाँव-गाँव से जन-भागीदारी का ऐसा विश्वासपूर्ण आंदोलन खड़ा करना है जहाँ पेड़, पानी, मिट्टी, गौशाला और ग्रामीण आजीविका एक दूसरे को मजबूत बनाएँ। हम बिना किसी झूठे वादे के, वैज्ञानिक सोच और पूरी पारदर्शिता के साथ 2026 से 2030 की इस हरित यात्रा में आप सभी का स्वागत करते हैं।',
      en: 'Our vision goes beyond running a conventional organisation—we aim to build a trustworthy people’s movement starting from Rajasthan’s villages where trees, water, soil, Gaushalas, and rural livelihoods reinforce one another. With scientific grounding and transparent reporting, we invite every citizen, farmer, student, and institution to walk with us on this 2026–2030 journey.',
    },
    note: {
      hi: 'अधिकृत पदाधिकारी एवं सलाहकार मंडल के विस्तृत प्रोफाइल औपचारिक सत्यापन के उपरांत प्रकाशित किए जाएंगे।',
      en: 'Authorised office bearers, verified leadership profiles, and Advisory Board members will be published following formal confirmation.',
    },
  },
  legalSlots: [
    { label: 'Legal Structure', value: 'Section 8 Non-Profit Company (India)' },
    { label: 'CIN / Registration No.', value: 'Published upon official portal sync' },
    { label: 'PAN / TAN', value: 'Verified statutory records available for CSR due diligence' },
    { label: 'MSME / Darpan / 12A / 80G', value: 'Displayed strictly per valid active approvals' },
  ],
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-harit-bhilwara',
    title: { hi: 'हरित राजस्थान — भीलवाड़ा ग्राम एवं परिसर अभियान', en: 'Harit Rajasthan — Bhilwara Village & Campus Drive' },
    location: { hi: 'भीलवाड़ा, राजस्थान', en: 'Bhilwara, Rajasthan' },
    missionCategory: { hi: 'हरित राजस्थान एवं वृक्षारोपण', en: 'Harit Rajasthan & Tree Plantation' },
    status: 'Proposed',
    objectives: {
      hi: 'किसान पंजीकरण, हरित मित्र समन्वय, स्कूल-कॉलेज हरित परिसर और दीर्घकालिक पौध जीवितता निगरानी की नींव रखना।',
      en: 'Establish farmer onboarding, Harit Mitra coordination, Green Campus partnerships, and multi-year sapling survival tracking.',
    },
    beneficiaryCategory: { hi: 'किसान, ग्राम पंचायत एवं शिक्षण संस्थान', en: 'Farmers, Gram Panchayats & Educational Campuses' },
    note: {
      hi: 'प्रस्तावित रूपरेखा — प्रारंभिक सर्वेक्षण एवं जन-पंजीकरण चरण।',
      en: 'Proposed framework — currently in baseline outreach & registration phase.',
    },
  },
  {
    id: 'proj-arid-churu-bikaner',
    title: { hi: 'शुष्क क्षेत्र जल संरक्षण, नर्सरी एवं गौशाला समन्वय', en: 'Arid-Zone Water, Nursery & Gaushala Assessment' },
    location: { hi: 'चूरू, बीकानेर एवं फलोदी', en: 'Churu, Bikaner & Phalodi' },
    missionCategory: { hi: 'आत्मनिर्भर गौशाला एवं जल संरक्षण', en: 'Self-Reliant Gaushala & Water' },
    status: 'Under Assessment',
    objectives: {
      hi: 'गौशाला संसाधन सर्वेक्षण, पारंपरिक कुंड संवर्धन, मृदा-जल लवणता परीक्षण तथा देशी नर्सरी मॉडल का आकलन।',
      en: 'Gaushala resource mapping, traditional kund assessment, soil-water salinity testing, and native nursery feasibility.',
    },
    beneficiaryCategory: { hi: 'गौशालाएँ, पशुपालक एवं शुष्क क्षेत्र किसान', en: 'Gaushalas, Livestock Caretakers & Arid-Zone Farmers' },
    note: {
      hi: 'मूल्यांकनाधीन — क्षेत्र सर्वेक्षण एवं संस्थागत संपर्क जारी।',
      en: 'Under Assessment — baseline survey and district institutional outreach underway.',
    },
  },
  {
    id: 'proj-jodhpur-shg-campus',
    title: { hi: 'जोधपुर प्लास्टिक-मुक्त एवं महिला SHG थैला पहल', en: 'Jodhpur Plastic-Free & Women SHG Cloth Bag Model' },
    location: { hi: 'जोधपुर, राजस्थान', en: 'Jodhpur, Rajasthan' },
    missionCategory: { hi: 'स्वच्छ भारत एवं महिला सशक्तीकरण', en: 'Clean India & Women Empowerment' },
    status: 'Proposed',
    objectives: {
      hi: 'महिला स्वयं सहायता समूहों द्वारा कपड़े के थैले निर्माण को स्थानीय बाजार व शैक्षणिक परिसरों से जोड़ना।',
      en: 'Link women SHG reusable cotton bag production with local markets and university Green Campuses.',
    },
    beneficiaryCategory: { hi: 'महिला SHG एवं युवा स्वयंसेवक', en: 'Women Self-Help Groups & Campus Youth' },
    note: {
      hi: 'प्रस्तावित सामुदायिक पायलट पहल।',
      en: 'Proposed community pilot initiative.',
    },
  },
  {
    id: 'proj-cbg-feasibility',
    title: { hi: 'जिला-स्तरीय गोबर से बायोगैस / CBG व्यवहार्यता अध्ययन', en: 'District-Level Biogas & CBG Feasibility Study' },
    location: { hi: 'बीकानेर एवं भीलवाड़ा क्लस्टर', en: 'Bikaner & Bhilwara Clusters' },
    missionCategory: { hi: 'बायोगैस एवं बायो-CNG/CBG', en: 'Biogas & Bio-CNG/CBG' },
    status: 'Under Assessment',
    objectives: {
      hi: 'गोबर संग्रह क्षमता, शुद्धिकरण तकनीक, जैव-स्लरी उपयोग और नियामकीय स्वीकृतियों का तकनीकी अध्ययन।',
      en: 'Technical assessment of dung aggregation, gas purification, organic slurry utility, and statutory permissions.',
    },
    beneficiaryCategory: { hi: 'गौशाला क्लस्टर एवं ग्रामीण किसान', en: 'Gaushala Clusters & Rural Farmers' },
    note: {
      hi: 'केवल व्यवहार्यता अध्ययनाधीन — कोई सक्रिय CBG प्लांट अभी संचालित नहीं है।',
      en: 'Feasibility study only — not displayed as an operational plant.',
    },
  },
];

export const TRAINING_ARTICLES: TrainingArticle[] = [
  {
    id: 'art-carbon-basics',
    category: { hi: 'कार्बन क्रेडिट पाठशाला', en: 'Carbon Credit Learning' },
    title: { hi: 'कार्बन क्रेडिट क्या है? किसान के लिए सरल समझ', en: 'What is a Carbon Credit? A Clear Guide for Farmers' },
    summary: {
      hi: 'पेड़ कैसे वातावरण से CO₂ सोखते हैं, 1 टन CO₂e का अर्थ क्या है और किसी परियोजना को सत्यापित होने में क्या चरण लगते हैं।',
      en: 'How trees sequester CO₂, what 1 tonne CO₂e means, and why rigorous eligibility and verification precede any issuance.',
    },
    ruralExample: {
      hi: 'ग्रामीण भाषा उदाहरण: "पेड़ लगाकर उनकी देखभाल करो और खेती में पर्यावरण का ध्यान रखो। आगे चलकर कोई सही कार्बन योजना बनी तो पात्र किसानों को कमाई का मौका मिल सकता है। लेकिन पैसा मिलने की पक्की गारंटी नहीं है।"',
      en: 'Plain-language guidance: "Plant trees, care for them, and farm sustainably. If a verified carbon project qualifies in the future, eligible farmers may benefit—but earnings are never guaranteed."',
    },
    readTime: '4 min',
    hasPdf: true,
  },
  {
    id: 'art-soil-testing',
    category: { hi: 'जैविक व आधुनिक खेती', en: 'Organic Farming' },
    title: { hi: 'बुवाई से पहले मिट्टी और पानी की जाँच क्यों ज़रूरी है?', en: 'Why Soil & Water Testing Matters Before Sowing' },
    summary: {
      hi: 'pH, EC, कार्बनिक कार्बन और सिंचाई जल की लवणता समझकर रासायनिक खाद का अंधाधुंध खर्च कम करने के व्यावहारिक तरीके।',
      en: 'Understanding pH, EC, organic carbon, and water salinity to reduce excessive chemical costs through phased organic transition.',
    },
    ruralExample: {
      hi: 'ग्रामीण भाषा उदाहरण: "भाई साहब, खेत की मिट्टी की जाँच करवाओ। गोबर की अच्छी सड़ी खाद और सही खेती के तरीके अपनाओ। इससे जमीन की सेहत सुधारने में मदद मिल सकती है और खर्च भी कम हो सकता है।"',
      en: 'Plain-language guidance: "Test your soil first, use well-decomposed cow-dung compost, and transition steadily to protect soil health and reduce input expenses."',
    },
    readTime: '5 min',
    hasPdf: true,
  },
  {
    id: 'art-gaushala-model',
    category: { hi: 'गौशाला प्रशिक्षण', en: 'Gaushala Training' },
    title: { hi: 'गौशाला को आत्मनिर्भर संसाधन केंद्र कैसे बनाएँ?', en: 'Turning a Gaushala into a Self-Reliant Resource Hub' },
    summary: {
      hi: 'वर्मीकम्पोस्ट बेड, जीवामृत निर्माण, हरा चारा उत्पादन और स्वच्छता प्रबंधन के व्यावहारिक नियम।',
      en: 'Practical methods for vermicompost beds, Jeevamrit preparation, local green fodder cultivation, and herd hygiene.',
    },
    readTime: '6 min',
    hasPdf: true,
  },
  {
    id: 'art-biogas-safety',
    category: { hi: 'बायोगैस एवं CBG ज्ञान', en: 'Biogas/CBG Knowledge' },
    title: { hi: 'बायोगैस और CBG में तकनीकी अंतर एवं सुरक्षा मानक', en: 'Technical Difference Between Raw Biogas & Vehicle-Grade CBG' },
    summary: {
      hi: 'क्यों बायोगैस को शुद्ध और संपीड़ित किए बिना वाहन ईंधन या सामान्य घरेलू सिलेंडर में नहीं भरा जा सकता।',
      en: 'Why biogas must undergo scrubbing, compression, and regulatory certification before CBG use—never domestic LPG cylinders.',
    },
    readTime: '5 min',
    hasPdf: true,
  },
];

export const CARBON_FAQS: { q: BilingualText; a: BilingualText }[] = [
  {
    q: { hi: 'क्या पेड़ लगाने पर निश्चित रूप से कार्बन क्रेडिट और पैसा मिलेगा?', en: 'Does planting trees guarantee carbon credits or income?' },
    a: { hi: 'नहीं। केवल पेड़ लगाने या पंजीकरण करने से कार्बन क्रेडिट मिलना निश्चित नहीं होता। यह परियोजना की पात्रता, भूमि अधिकार, स्वीकृत पद्धति, वैज्ञानिक निगरानी (MRV), स्वतंत्र सत्यापन, रजिस्ट्री नियमों और बाजार अनुबंध पर निर्भर करता है।', en: 'No. Tree planting or registration alone does not guarantee credits or earnings. Issuance depends on land eligibility, approved methodologies, multi-year MRV, independent verification, registry approval, and market buyers.' },
  },
  {
    q: { hi: '1 कार्बन क्रेडिट का क्या अर्थ है?', en: 'What does 1 Carbon Credit mean?' },
    a: { hi: 'सामान्यतः 1 कार्बन क्रेडिट 1 मीट्रिक टन कार्बन डाइऑक्साइड समतुल्य (1 tCO₂e) उत्सर्जन में कमी या वातावरण से कार्बन हटाने को दर्शाता है, जिसे स्वतंत्र संस्था द्वारा सत्यापित किया जाता है।', en: 'One carbon credit represents 1 metric tonne of carbon dioxide equivalent (1 tCO₂e) reduced or removed from the atmosphere and verified under an accredited standard.' },
  },
  {
    q: { hi: 'क्या 100 पौधे लगाने पर 100 कार्बन क्रेडिट मिलते हैं?', en: 'Does planting 100 saplings equal 100 carbon credits?' },
    a: { hi: 'नहीं। 100 पौधे लगाने का अर्थ 100 कार्बन क्रेडिट मिलना बिल्कुल नहीं है। एक पेड़ के जीवनकाल, प्रजाति, जीवित रहने की दर और जलवायु के अनुसार कार्बन अवशोषण अलग होता है और मापन पूरे क्लस्टर स्तर पर वैज्ञानिक सूत्र से होता है।', en: 'No. Planting 100 saplings does not equal 100 credits. Carbon sequestration varies by species, age, survival rate, and climate, and is calculated scientifically across aggregated project areas.' },
  },
  {
    q: { hi: 'क्या इस मिशन से जुड़ने पर किसान की जमीन के मालिकाना हक पर कोई असर पड़ता है?', en: 'Does participating affect the farmer’s ownership or control of their land?' },
    a: { hi: 'बिल्कुल नहीं। भूमि का पूरा मालिकाना हक और नियंत्रण 100% किसान के पास ही सुरक्षित रहता है। यह केवल हरित वृक्षारोपण, जागरूकता और पात्र जलवायु परियोजना सहभागिता की पहल है।', en: 'Not at all. Land ownership and decision-making remain 100% with the farmer. Participation only covers voluntary plantation, care, and eligible climate documentation.' },
  },
  {
    q: { hi: 'क्या केवल GPS फोटो लेने से कार्बन क्रेडिट मिल जाते हैं?', en: 'Does uploading a GPS-tagged photo alone generate carbon credits?' },
    a: { hi: 'नहीं। GPS जियो-टैगिंग केवल पारदर्शी रिकॉर्ड रखने का एक प्रारंभिक चरण है। कार्बन क्रेडिट के लिए पात्र भूमि, Baseline, Additionality, Leakage नियंत्रण, बहु-वर्षीय निगरानी (MRV), स्वतंत्र ऑडिट और रजिस्ट्री स्वीकृति आवश्यक होती है।', en: 'No. GPS geo-tagging is only one transparency tool. Credit issuance requires eligible land, Baseline, Additionality, Leakage controls, multi-year MRV, independent audit, and registry approval.' },
  },
  {
    q: { hi: 'Baseline, Additionality और Leakage का सरल अर्थ क्या है?', en: 'What do Baseline, Additionality, and Leakage mean in simple terms?' },
    a: { hi: 'Baseline का अर्थ है कि परियोजना न होने पर भूमि की स्थिति क्या रहती; Additionality का अर्थ है कि यह वृक्षारोपण सामान्य स्थिति से अतिरिक्त कार्बन हटा रहा है; और Leakage का अर्थ है कि यहाँ पेड़ लगाने से कहीं और पेड़ों की कटाई न बढ़े।', en: 'Baseline measures what the land would look like without the project; Additionality proves the plantation removes extra carbon beyond business-as-usual; Leakage ensures planting here does not trigger tree loss elsewhere.' },
  },
  {
    q: { hi: 'पेड़ों की वैज्ञानिक निगरानी और कार्बन आकलन में कितना समय लगता है?', en: 'How many years does multi-year tree growth and carbon monitoring take?' },
    a: { hi: 'पौधे लगाने के तुरंत बाद कार्बन क्रेडिट नहीं बनते। पौधों के सुरक्षित जीवित रहने, तने व ऊँचाई की वृद्धि और वैज्ञानिक MRV सत्यापन के लिए कई वर्षों (सामान्यतः 3 से 5+ वर्ष से आगे निरंतर चक्र) की देखभाल और निगरानी आवश्यक होती है।', en: 'Credits are never generated immediately after planting. Saplings require multi-year protection, survival monitoring, measurable trunk/canopy growth, and periodic verification cycles over several years.' },
  },
  {
    q: { hi: 'राजस्थान की जलवायु के लिए कौन-सी वृक्ष प्रजातियाँ उपयुक्त मानी जाती हैं?', en: 'Which tree species are suited to Rajasthan’s climate and agroforestry?' },
    a: { hi: 'स्थानीय मिट्टी, पानी और कृषि आवश्यकता के अनुसार खेजड़ी, नीम, रोहिड़ा, आंवला, जामुन, शीशम, बेर, सहजन, पीपल, बरगद और फलदार/चारा प्रजातियों का चयन कृषि-वानिकी विशेषज्ञों के मार्गदर्शन में किया जाता है।', en: 'Depending on local soil and water availability, resilient native and agroforestry species such as Khejri, Neem, Rohida, Amla, Jamun, Sheesham, Ber, Moringa, Peepal, and Banyan are prioritized with technical guidance.' },
  },
  {
    q: { hi: 'हरित मित्र बनने का क्या अर्थ है? क्या यह सरकारी या सवेतन नौकरी है?', en: 'What is the role of a Harit Mitra? Is it paid employment?' },
    a: { hi: 'हरित मित्र एक स्वैच्छिक सामुदायिक सहभागिता भूमिका है जो किसानों, विद्यालयों और ग्राम समुदायों के बीच जागरूकता व समन्वय में सहयोग करती है। यह कोई रोजगार या वेतन की गारंटी नहीं है।', en: 'Harit Mitra is a voluntary community participation role helping connect farmers, schools, and local green drives. It is a community fellowship, not an employment guarantee.' },
  },
  {
    q: { hi: 'किसान पंजीकरण के समय क्या जमीन के कागजात अपलोड करने होंगे?', en: 'Are sensitive land documents mandatory during initial registration?' },
    a: { hi: 'नहीं। प्रारंभिक चरण में केवल नाम, मोबाइल, जिला, गाँव, भूमि का अनुमानित क्षेत्रफल और पौधारोपण रुचि ली जाती है। भूमि सत्यापन दस्तावेज़ केवल पात्र परियोजना चरण में सुरक्षित प्रक्रिया से लिए जाएंगे।', en: 'No. Initial registration only captures contact details, location, approximate landholding, and interest. Formal documents are requested securely only if an area advances to project screening.' },
  },
  {
    q: { hi: 'जियो-टैगिंग और प्रत्येक पेड़ का डेटा कहाँ दर्ज होगा?', en: 'Where will tree-level GPS geo-tagging and MRV data be recorded?' },
    a: { hi: 'विस्तृत GPS, जियो-टैगिंग, ट्री-लेवल डेटा और फील्ड सत्यापन के लिए अलग समर्पित MRV सॉफ्टवेयर मॉड्यूल विकसित किया जाएगा ताकि मुख्य वेबसाइट सरल और तेज बनी रहे।', en: 'Detailed GPS geo-tagging, tree-level growth tracking, and field audits will be handled in a separate dedicated MRV software module integrated securely via API.' },
  },
  {
    q: { hi: 'राजस्थान के किन जिलों से शुरुआत की जा रही है?', en: 'Which Rajasthan districts are in the initial focus phase?' },
    a: { hi: 'प्रारंभिक पाँच फोकस जिले भीलवाड़ा, चूरू, बीकानेर, फलोदी और जोधपुर हैं। भविष्य में आवश्यकता और सहयोग के अनुसार अन्य जिलों व राज्यों तक विस्तार किया जाएगा।', en: 'The initial five focus districts are Bhilwara, Churu, Bikaner, Phalodi, and Jodhpur, with modular expansion planned across other districts and states.' },
  },
  {
    q: { hi: 'क्या कंपनियाँ, संस्थान या CSR पार्टनर इस अभियान से जुड़ सकते हैं?', en: 'Can companies, institutions, or CSR partners collaborate on this mission?' },
    a: { hi: 'हाँ। कंपनियाँ, विश्वविद्यालय, ग्राम पंचायतें और संस्थाएँ पारदर्शी दस्तावेज़ीकरण के साथ वृक्षारोपण, किसान प्रशिक्षण और दीर्घकालिक हरित परियोजनाओं में संस्थागत सहयोग कर सकती हैं।', en: 'Yes. Corporates, universities, gram panchayats, and institutional partners can collaborate on documented plantation drives, farmer training, and long-term rural climate resilience initiatives.' },
  },
  {
    q: { hi: 'मैं अपने आवेदन की स्थिति कैसे देख सकता हूँ?', en: 'How can I check my registration application status?' },
    a: { hi: 'पंजीकरण सबमिट करने पर आपको एक यूनिक Application ID (जैसे GVD-FRM-2026-XXXX) मिलता है। आप इसी पेज के "आवेदन स्थिति / Application Status" सेक्शन में यह ID दर्ज कर स्थिति देख सकते हैं।', en: 'Upon submission, you receive a unique Application ID (e.g., GVD-FRM-2026-XXXX). Enter this ID in the Application Status checker on this page or the Join GOVEDA page.' },
  },
];

export const MARATHON_INFO = {
  title: { hi: 'हरित मैराथन — भीलवाड़ा 2026', en: 'HARIT MARATHON — BHILWARA 2026' },
  dateDisplay: { hi: '20 दिसंबर 2026', en: '20 December 2026' },
  theme: { hi: 'हरित राजस्थान के लिए दौड़ — Run for Green Rajasthan', en: 'Run for Green Rajasthan — हरित राजस्थान के लिए दौड़' },
  venue: { hi: 'भीलवाड़ा, राजस्थान (अंतिम रूट व स्थल प्रशासनिक पुष्टि के उपरांत अद्यतन)', en: 'Bhilwara, Rajasthan (Exact route & venue updated after administrative confirmation)' },
  categories: [
    { name: '10 KM Green Run', age: '18+ Years', fee: 'Community Participation' },
    { name: '5 KM Eco Awareness Run', age: '14+ Years', fee: 'Students & Youth' },
    { name: '2 KM Family & Senior Walk', age: 'All Ages', fee: 'Families & Seniors' },
  ],
  schedule: [
    { time: '05:45 AM', activity: { hi: 'प्रतिभागी रिपोर्टिंग एवं चेस्ट नंबर वितरण', en: 'Participant reporting & bib distribution' } },
    { time: '06:30 AM', activity: { hi: 'समारोह उद्बोधन एवं हरित संकल्प', en: 'Opening address & Green Rajasthan Pledge' } },
    { time: '06:45 AM', activity: { hi: '10 KM एवं 5 KM फ्लैग-ऑफ', en: '10 KM & 5 KM Run Flag-off' } },
    { time: '07:15 AM', activity: { hi: '2 KM परिवार एवं वरिष्ठजन वॉक', en: '2 KM Family & Senior Citizen Walk' } },
    { time: '08:30 AM', activity: { hi: 'पौधा वितरण एवं डिजिटल प्रमाणपत्र सूचना', en: 'Sapling distribution & digital certificate notice' } },
  ],
};

export const MAGAZINE_INFO = {
  proposedName: { hi: 'हरित भारत संवाद (प्रस्तावित नाम)', en: 'Harit Bharat Samvad (Proposed Title)' },
  note: {
    hi: 'त्रैमासिक डिजिटल एवं मुद्रित पत्रिका — अंतिम प्रकाशन नाम, RNI व वैधानिक पंजीकरण की पुष्टि के उपरांत अद्यतन किया जाएगा।',
    en: 'Quarterly digital magazine — final title and publication registration details will be updated following formal statutory approvals.',
  },
  sections: [
    { hi: 'संपादकीय दृष्टिकोण (2026–2030 हरित यात्रा)', en: 'Editorial Vision (2026–2030 Green Roadmap)' },
    { hi: 'किसान एवं गौशाला अनुभव संवाद', en: 'Farmer & Gaushala Field Reflections' },
    { hi: 'जलवायु, मृदा एवं जल संरक्षण शोध लेख', en: 'Climate, Soil & Water Conservation Research Notes' },
    { hi: 'युवा, महिला SHG एवं ग्रीन कैंपस समाचार', en: 'Youth, Women SHG & Green Campus Dispatches' },
  ],
};
