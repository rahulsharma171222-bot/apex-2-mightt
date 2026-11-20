import { eq } from 'drizzle-orm';
import { db, isDatabaseConfigured } from './index.ts';
import { cmsBlueprintState } from './schema.ts';
import type {
  AdminBlueprintPayload,
  FounderMessageConfig,
  HomepageSectionConfig,
  MissionAdminConfig,
  ProgrammeLocationTag,
  ProgrammeMediaItem,
  StaticPageRecord,
  UnifiedProgrammeRecord,
  WasteActivityRecord,
  WastePartnerRecord,
} from '../admin/types.ts';

let blueprintHydratedFromDb = false;

async function syncBlueprintToPostgres() {
  if (!isDatabaseConfigured) return;
  try {
    await db
      .insert(cmsBlueprintState)
      .values({
        id: 'default',
        payload: blueprintState as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: cmsBlueprintState.id,
        set: {
          payload: blueprintState as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        },
      });
  } catch {
    // Non-blocking fallback to in-memory state when database is offline
  }
}

function buildInitialHomepageSections(): HomepageSectionConfig[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'sec-header',
      sectionKey: 'header',
      label: 'Header & Navigation',
      description: 'Logo, Hindi/English language switch, fixed 10-item navigation and action button',
      enabled: true,
      visible: true,
      displayOrder: 1,
      headingEn: 'GOVEDA Carbon & Climate India Foundation',
      headingHi: 'गोवेदा कार्बन एंड क्लाइमेट इंडिया फाउंडेशन',
      subtitleEn: 'Institutional top navigation bar',
      subtitleHi: 'संस्थागत शीर्ष नेविगेशन बार',
      ctaLabelEn: 'Join Mission',
      ctaLabelHi: 'मिशन से जुड़ें',
      ctaDestination: '/join',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-hero',
      sectionKey: 'hero',
      label: 'Hero Banner',
      description: 'Primary heading, subtitle, editorial banner visual and primary CTA buttons',
      enabled: true,
      visible: true,
      displayOrder: 2,
      headingEn: 'From Green Rajasthan to Green India',
      headingHi: 'हरित राजस्थान से हरित भारत की ओर',
      subtitleEn: 'Farmer-centric agroforestry, clean energy, self-reliant gaushalas and climate stewardship.',
      subtitleHi: 'किसान-केंद्रित कृषि-वानिकी, स्वच्छ ऊर्जा, आत्मनिर्भर गौशाला एवं जलवायु संरक्षण अभियान।',
      ctaLabelEn: 'Explore Harit Bharat',
      ctaLabelHi: 'हरित भारत देखें',
      ctaDestination: '/harit-bharat',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-about',
      sectionKey: 'about',
      label: 'About GOVEDA',
      description: 'Institutional mission introduction, governance transparency and Read More link',
      enabled: true,
      visible: true,
      displayOrder: 3,
      headingEn: 'About GOVEDA Foundation',
      headingHi: 'गोवेदा फाउंडेशन के बारे में',
      subtitleEn: 'Section-8 non-profit dedicated to ecological restoration and rural resilience.',
      subtitleHi: 'पर्यावरण संरक्षण एवं ग्रामीण आत्मनिर्भरता हेतु समर्पित सेक्शन-8 गैर-लाभकारी संस्था।',
      ctaLabelEn: 'Read Institutional Overview',
      ctaLabelHi: 'विस्तृत परिचय पढ़ें',
      ctaDestination: '/about',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-missions',
      sectionKey: 'missions',
      label: '10 Core Missions',
      description: 'Ordered showcase of all 10 GOVEDA environmental and social missions',
      enabled: true,
      visible: true,
      displayOrder: 4,
      headingEn: 'Our 10 Missions for Sustainable India',
      headingHi: 'सतत भारत के लिए हमारे 10 प्रमुख मिशन',
      subtitleEn: 'Integrated programmes spanning carbon action, natural farming, clean energy and dignity.',
      subtitleHi: 'कार्बन संरक्षण, प्राकृतिक खेती, स्वच्छ ऊर्जा और जन-कल्याण के समन्वित कार्यक्रम।',
      ctaLabelEn: 'Explore All Missions',
      ctaLabelHi: 'सभी 10 मिशन देखें',
      ctaDestination: '/missions/carbon-climate',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-harit-rajasthan',
      sectionKey: 'harit_rajasthan',
      label: 'Harit Rajasthan & Pan-India Explorer',
      description: 'Interactive State → District → Tehsil → Village showcase and 5 focus districts',
      enabled: true,
      visible: true,
      displayOrder: 5,
      headingEn: 'Harit Rajasthan to Harit Bharat',
      headingHi: 'हरित राजस्थान से हरित भारत',
      subtitleEn: 'Bhilwara, Churu, Bikaner, Phalodi and Jodhpur Phase-1 outreach expanding pan-India.',
      subtitleHi: 'भीलवाड़ा, चूरू, बीकानेर, फलोदी व जोधपुर प्रथम चरण से संपूर्ण भारत विस्तार।',
      ctaLabelEn: 'Open Location Explorer',
      ctaLabelHi: 'लोकेशन एक्सप्लोरर खोलें',
      ctaDestination: '/harit-bharat',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-marathon',
      sectionKey: 'marathon',
      label: 'Harit Marathon Banner',
      description: 'Event banner, countdown timer, confirmed dates and runner registration link',
      enabled: true,
      visible: true,
      displayOrder: 6,
      headingEn: 'Harit Marathon 2026 — Run for Green Rajasthan',
      headingHi: 'हरित मैराथन 2026 — हरित राजस्थान के लिए दौड़',
      subtitleEn: 'Community climate run uniting youth, runners, institutions and civic leaders.',
      subtitleHi: 'युवाओं, धावकों, शिक्षण संस्थानों एवं समाज को जोड़ता हरित अभियान।',
      ctaLabelEn: 'Register for Marathon',
      ctaLabelHi: 'मैराथन पंजीकरण करें',
      ctaDestination: '/marathon',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-registrations',
      sectionKey: 'registrations',
      label: '12 Registration Pathways',
      description: 'Farmer, Harit Mitra, Gaushala, SHG, School and Volunteer onboarding cards',
      enabled: true,
      visible: true,
      displayOrder: 7,
      headingEn: 'Join the Movement — Dedicated Registration Desk',
      headingHi: 'अभियान से जुड़ें — समर्पित पंजीकरण पोर्टल',
      subtitleEn: 'Choose your participation pathway across 12 structured forms.',
      subtitleHi: '12 समर्पित पंजीकरण प्रपत्रों में से अपनी भूमिका चुनें।',
      ctaLabelEn: 'View All 12 Forms',
      ctaLabelHi: 'सभी 12 फॉर्म देखें',
      ctaDestination: '/join',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-projects',
      sectionKey: 'projects',
      label: 'Projects & Verified Impact',
      description: 'Published field projects and audited impact counters',
      enabled: true,
      visible: true,
      displayOrder: 8,
      headingEn: 'Ground Projects & Verified Impact',
      headingHi: 'प्रमुख परियोजनाएँ एवं सत्यापित प्रभाव',
      subtitleEn: 'Only verified and officially approved programme records are displayed publicly.',
      subtitleHi: 'केवल सत्यापित एवं आधिकारिक रूप से स्वीकृत परियोजना रिकॉर्ड ही प्रकाशित होते हैं।',
      ctaLabelEn: 'Explore Projects',
      ctaLabelHi: 'परियोजनाएँ देखें',
      ctaDestination: '/projects',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-csr',
      sectionKey: 'csr',
      label: 'CSR & Institutional Partnerships',
      description: 'Corporate CSR collaboration deck, partner recognition and enquiry CTA',
      enabled: true,
      visible: true,
      displayOrder: 9,
      headingEn: 'CSR & Institutional Collaboration',
      headingHi: 'सीएसआर एवं संस्थागत सहभागिता',
      subtitleEn: 'Transparent district-level projects built for measurable ecological outcomes.',
      subtitleHi: 'जिला स्तर पर पारदर्शी और मापनीय पर्यावरणीय परियोजनाएँ।',
      ctaLabelEn: 'Explore CSR Proposals',
      ctaLabelHi: 'सीएसआर प्रस्ताव देखें',
      ctaDestination: '/csr',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-news',
      sectionKey: 'news',
      label: 'Latest News & Harit Bharat Samvad',
      description: 'Featured press updates, field dispatches and magazine highlights',
      enabled: true,
      visible: true,
      displayOrder: 10,
      headingEn: 'News, Updates & Publications',
      headingHi: 'समाचार, अपडेट एवं प्रकाशन',
      subtitleEn: 'Field announcements, workshops and Harit Bharat Samvad issues.',
      subtitleHi: 'फील्ड समाचार, प्रशिक्षण कार्यशालाएँ एवं हरित भारत संवाद प्रकाशन।',
      ctaLabelEn: 'Open Knowledge Desk',
      ctaLabelHi: 'समाचार एवं पत्रिका देखें',
      ctaDestination: '/news',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-events',
      sectionKey: 'events',
      label: 'Upcoming Events',
      description: 'Confirmed public awareness drives, plantation camps and seminars',
      enabled: true,
      visible: true,
      displayOrder: 11,
      headingEn: 'Upcoming Drives & Events',
      headingHi: 'आगामी अभियान एवं कार्यक्रम',
      subtitleEn: 'Join scheduled district outreach and training sessions.',
      subtitleHi: 'निर्धारित जिला संपर्क एवं प्रशिक्षण सत्रों में भाग लें।',
      ctaLabelEn: 'View Event Calendar',
      ctaLabelHi: 'कार्यक्रम सूची देखें',
      ctaDestination: '/marathon',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-gallery',
      sectionKey: 'gallery',
      label: 'Photo & Video Gallery',
      description: 'Curated visual documentation from districts, farms and clean-up drives',
      enabled: true,
      visible: true,
      displayOrder: 12,
      headingEn: 'Field Gallery & Visual Documentation',
      headingHi: 'फील्ड गैलरी एवं दृश्य संकलन',
      subtitleEn: 'Verified photographs and reports from participating villages and institutions.',
      subtitleHi: 'सहभागी ग्रामों एवं संस्थानों से सत्यापित छायाचित्र एवं रिपोर्ट।',
      ctaLabelEn: 'Open Media Gallery',
      ctaLabelHi: 'मीडिया गैलरी देखें',
      ctaDestination: '/gallery',
      imageUrl: '',
      updatedAt: now,
    },
    {
      id: 'sec-footer',
      sectionKey: 'footer',
      label: 'Footer & Governance Links',
      description: 'Official contact desk, quick links, legal disclosures and transparency policies',
      enabled: true,
      visible: true,
      displayOrder: 13,
      headingEn: 'GOVEDA Governance & Quick Links',
      headingHi: 'गोवेदा शासन एवं त्वरित लिंक',
      subtitleEn: 'Section-8 Non-Profit · Transparent Environmental Stewardship',
      subtitleHi: 'सेक्शन-8 गैर-लाभकारी संस्था · पारदर्शी पर्यावरण संरक्षण',
      ctaLabelEn: 'Contact Desk',
      ctaLabelHi: 'संपर्क डेस्क',
      ctaDestination: '/contact',
      imageUrl: '',
      updatedAt: now,
    },
  ];
}

function buildInitialStaticPages(): StaticPageRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'pg-waste-guidelines',
      titleEn: 'Waste Segregation Guidelines',
      titleHi: 'कचरा पृथक्करण दिशानिर्देश',
      slug: 'waste-segregation-guidelines',
      parentPath: 'Our Missions → Clean India',
      summaryEn: 'Practical household and market guide for wet, dry, sanitary and special-care waste streams.',
      summaryHi: 'गीले, सूखे, सैनिटरी एवं विशेष-देखभाल कचरे के सही पृथक्करण हेतु व्यावहारिक मार्गदर्शिका।',
      bodyEn:
        'Four-stream source segregation enables clean composting of wet organic waste, authorised recycling of dry plastic/paper/metal, safe disposal of sanitary waste, and dedicated collection of e-waste/medical special-care items.',
      bodyHi:
        'चार-स्तरीय स्रोत पृथक्करण से गीले कचरे की खाद, सूखे प्लास्टिक/कागज का अधिकृत पुनर्चक्रण और सैनिटरी व विशेष कचरे का सुरक्षित निपटान संभव होता है।',
      linkedFormType: 'volunteer',
      ctaLabel: 'Join Clean India Mission',
      seoTitle: 'Waste Segregation Guidelines — GOVEDA Clean India',
      seoDescription: 'Official GOVEDA guide for wet, dry, sanitary and special-care waste segregation.',
      showInNav: false,
      navOrder: 1,
      status: 'Published',
      updatedAt: now,
    },
    {
      id: 'pg-cloth-bag',
      titleEn: 'Cloth & Jute Bag SHG Initiative',
      titleHi: 'कपड़ा एवं जूट थैला महिला समूह पहल',
      slug: 'cloth-jute-bag-initiative',
      parentPath: 'Our Missions → Clean India',
      summaryEn: 'Replacing single-use plastic bags in district markets with women SHG-stitched cloth and jute bags.',
      summaryHi: 'स्थानीय बाजारों में सिंगल-यूज़ प्लास्टिक के स्थान पर महिला स्व-सहायता समूहों द्वारा निर्मित कपड़े के थैले।',
      bodyEn:
        'Local Mahila SHGs produce durable washable cotton and jute shopping bags distributed through partner markets, temples and community melas.',
      bodyHi:
        'स्थानीय महिला स्व-सहायता समूह टिकाऊ सूती एवं जूट थैले तैयार करती हैं जिन्हें बाजारों, मंदिरों व मेलों में बढ़ावा दिया जाता है।',
      linkedFormType: 'women-shg',
      ctaLabel: 'Register Women SHG Unit',
      seoTitle: 'Cloth & Jute Bag Initiative — GOVEDA Foundation',
      seoDescription: 'SHG-led reusable bag alternative to single-use plastic in Rajasthan districts.',
      showInNav: false,
      navOrder: 2,
      status: 'Published',
      updatedAt: now,
    },
    {
      id: 'pg-harit-mitra-handbook',
      titleEn: 'Harit Mitra Field Coordinator Handbook',
      titleHi: 'हरित मित्र फील्ड समन्वयक मार्गदर्शिका',
      slug: 'harit-mitra-handbook',
      parentPath: 'Harit Rajasthan & Locations',
      summaryEn: 'Step-by-step rural onboarding checklist, farmer consent protocol and sapling survival tracking.',
      summaryHi: 'ग्रामीण पंजीकरण, किसान सहमति प्रोटोकॉल और पौध जीवितता निगरानी हेतु चरणबद्ध मार्गदर्शिका।',
      bodyEn:
        'Each verified Harit Mitra receives a unique referral ID to onboard local farmers, schools and gaushalas transparently with clear district oversight.',
      bodyHi:
        'प्रत्येक सत्यापित हरित मित्र को एक विशिष्ट रेफरल आईडी प्रदान की जाती है जिससे वे पारदर्शी रूप से किसानों और संस्थाओं को जोड़ सकते हैं।',
      linkedFormType: 'harit-mitra',
      ctaLabel: 'Apply as Harit Mitra',
      seoTitle: 'Harit Mitra Handbook — GOVEDA Foundation',
      seoDescription: 'Field guidelines for GOVEDA Harit Mitra coordinators.',
      showInNav: true,
      navOrder: 3,
      status: 'Published',
      updatedAt: now,
    },
    {
      id: 'pg-temple-waste',
      titleEn: 'Temple Organic Waste Composting Protocol',
      titleHi: 'मंदिर पुष्प एवं जैविक अपशिष्ट खाद प्रोटोकॉल',
      slug: 'temple-organic-waste-protocol',
      parentPath: 'Our Missions → Clean India',
      summaryEn: 'Respectful conversion of temple flowers and organic offerings into natural incense and compost.',
      summaryHi: 'मंदिरों के पुष्पों एवं जैविक अवशेषों का सम्मानजनक रूप से प्राकृतिक खाद में रूपांतरण।',
      bodyEn:
        'Draft operational SOP for temple committees, municipal volunteers and gaushala composting units.',
      bodyHi:
        'मंदिर समितियों, स्वयंसेवकों एवं गौशाला खाद इकाइयों के लिए प्रस्तावित संचालन प्रक्रिया।',
      linkedFormType: 'panchayat-ngo',
      ctaLabel: 'Partner as Temple / Institution',
      seoTitle: 'Temple Waste Composting — GOVEDA',
      seoDescription: 'Responsible temple floral waste handling protocol.',
      showInNav: false,
      navOrder: 4,
      status: 'Draft',
      updatedAt: now,
    },
  ];
}

function buildInitialMissionConfigs(): MissionAdminConfig[] {
  const now = new Date().toISOString();
  return [
    {
      slug: 'carbon-climate',
      number: 1,
      titleEn: 'Carbon Credit & Climate Action',
      titleHi: 'कार्बन क्रेडिट एवं जलवायु संरक्षण',
      introEn: 'Farmer-centric carbon awareness, agroforestry MRV preparedness and transparent eligibility guidance.',
      introHi: 'किसान-केंद्रित कार्बन जागरूकता, कृषि-वानिकी MRV तैयारी एवं पारदर्शी पात्रता मार्गदर्शन।',
      subsections: ['Carbon Awareness', 'Eligible Project Models', 'Farmer Onboarding', 'MRV Methodology'],
      proposedActivities: ['District climate literacy workshops', 'Boundary tree baseline surveys', 'Digital MRV readiness orientation'],
      linkedFormType: 'farmer',
      status: 'Published',
      seoTitle: 'Carbon Credit & Climate Action — GOVEDA Foundation',
      seoDescription: 'Transparent farmer onboarding and climate stewardship under GOVEDA Mission 1.',
      faqs: [
        { q: 'Are carbon credit returns guaranteed?', a: 'No. Carbon credits depend strictly on verified survival, independent audit and registry approval.' },
      ],
      updatedAt: now,
    },
    {
      slug: 'harit-rajasthan',
      number: 2,
      titleEn: 'Green Rajasthan & Tree Plantation',
      titleHi: 'हरित राजस्थान एवं वृक्षारोपण अभियान',
      introEn: 'Native desert and semi-arid plantation, 3-year sapling care, Harit Mitra network and Green Campus drives.',
      introHi: 'देशी वृक्षारोपण, 3-वर्षीय पौध देखभाल, हरित मित्र नेटवर्क एवं ग्रीन कैंपस अभियान।',
      subsections: ['Native Species Plantation', '3-Year Sapling Care', 'Harit Mitra Network', 'Green Campus Institutions'],
      proposedActivities: ['Monsoon boundary plantation drives', 'School & college Green Campus onboarding', 'Harit Mitra referral tree tracking'],
      linkedFormType: 'harit-mitra',
      status: 'Published',
      seoTitle: 'Green Rajasthan & Tree Plantation — GOVEDA',
      seoDescription: 'Phase-1 plantation across Bhilwara, Churu, Bikaner, Phalodi and Jodhpur.',
      faqs: [
        { q: 'Which native species are prioritized?', a: 'Khejri, Neem, Rohida, Karanj, Ber, Jamun, Peepal and region-suitable fruit trees.' },
      ],
      updatedAt: now,
    },
    {
      slug: 'atmanirbhar-gaushala',
      number: 3,
      titleEn: 'Self-Reliant Gaushala',
      titleHi: 'आत्मनिर्भर गौशाला अभियान',
      introEn: 'Sustainable gaushala model integrating animal welfare, 48 cow-based products, vermicompost and market linkage.',
      introHi: 'गौ-संरक्षण, 48 पंचगव्य/गोबर उत्पाद, वर्मीकम्पोस्ट एवं बाजार जुड़ाव आधारित आत्मनिर्भर गौशाला मॉडल।',
      subsections: ['Gaushala Self-Reliance Model', 'Animal Welfare & Shelter', '48 Panchagavya & Dung Products', 'Organic Compost & Market Linkage'],
      proposedActivities: ['Gaushala baseline onboarding', 'Dung-log & vermicompost training', 'SHG product packaging workshops'],
      linkedFormType: 'gaushala',
      status: 'Published',
      seoTitle: 'Self-Reliant Gaushala — GOVEDA Foundation',
      seoDescription: 'Circular gaushala economics through compost, biogas and indigenous cow products.',
      faqs: [],
      updatedAt: now,
    },
    {
      slug: 'swachh-urja',
      number: 4,
      titleEn: 'Renewable Energy, Biogas & CBG',
      titleHi: 'स्वच्छ ऊर्जा, बायोगैस एवं सीबीजी',
      introEn: 'Household biogas, cluster-scale Bio-CNG (CBG) feasibility, dung collection models and rural solar micro-grids.',
      introHi: 'घरेलू बायोगैस, क्लस्टर बायो-सीएनजी (CBG) संभाव्यता, गोबर संग्रहण मॉडल एवं ग्रामीण सौर ऊर्जा।',
      subsections: ['Household & Gaushala Biogas', 'Cluster CBG Feasibility', 'Biomass Collection Model', 'Rural Solar Energy'],
      proposedActivities: ['Cattle-cluster feasibility assessments', 'Clean cooking biogas demonstrations', 'Solar pump awareness camps'],
      linkedFormType: 'gaushala',
      status: 'Published',
      seoTitle: 'Renewable Energy, Biogas & CBG — GOVEDA',
      seoDescription: 'Clean rural energy through biogas, CBG feasibility and solar adoption.',
      faqs: [],
      updatedAt: now,
    },
    {
      slug: 'organic-farming',
      number: 5,
      titleEn: 'Sustainable Agriculture & Rural Livelihoods',
      titleHi: 'जैविक खेती एवं ग्रामीण विकास',
      introEn: 'Natural farming transition, soil carbon health, water testing, Jeevamrit/compost inputs and micro-irrigation.',
      introHi: 'प्राकृतिक खेती रूपांतरण, मिट्टी स्वास्थ्य, जल परीक्षण, जीवामृत/जैविक खाद एवं सूक्ष्म सिंचाई।',
      subsections: ['Natural & Organic Farming', 'Soil Health & Testing', 'Water Conservation & Irrigation', 'Farmer Livelihood Resilience'],
      proposedActivities: ['Year-1 25% pilot farm transition planning', 'Jeevamrit & Beejamrit field training', 'Soil organic carbon testing camps'],
      linkedFormType: 'farmer',
      status: 'Published',
      seoTitle: 'Organic Farming & Rural Development — GOVEDA',
      seoDescription: 'Healthy soil, resilient farms and thriving villages across Rajasthan.',
      faqs: [],
      updatedAt: now,
    },
    {
      slug: 'clean-india',
      number: 6,
      titleEn: 'Clean India & Plastic Pollution Reduction',
      titleHi: 'स्वच्छ भारत — प्लास्टिक मुक्त अभियान',
      introEn: 'Four-stream waste segregation, single-use plastic reduction, SHG cloth bags, temple waste composting and authorised recycling.',
      introHi: 'कचरा पृथक्करण, सिंगल-यूज़ प्लास्टिक में कमी, कपड़े के थैले, मंदिर पुष्प खाद एवं अधिकृत पुनर्चक्रण।',
      subsections: ['Wet Waste', 'Dry Waste', 'Sanitary Waste', 'Special-Care Waste', 'Plastic-Free Initiatives', 'Cloth & Jute Bag Initiative', 'Temple Waste Management', 'Clean Village & Clean City'],
      proposedActivities: ['Plastic-Free Market pledges', 'School segregation awareness drives', 'Authorised recycler handover tracking'],
      linkedFormType: 'volunteer',
      status: 'Published',
      seoTitle: 'Clean India & Plastic-Free Mission — GOVEDA',
      seoDescription: 'Source waste segregation, plastic reduction and clean village/market drives.',
      faqs: [],
      updatedAt: now,
    },
    {
      slug: 'skill-development',
      number: 7,
      titleEn: 'Skill Development & Employment',
      titleHi: 'कौशल विकास एवं रोजगार',
      introEn: 'Practical vocational skills, digital literacy, foreign language training and green rural enterprise pathways for youth.',
      introHi: 'युवाओं एवं महिलाओं के लिए व्यावहारिक कौशल प्रशिक्षण, डिजिटल साक्षरता, विदेशी भाषा एवं हरित रोजगार।',
      subsections: ['Foreign Language Courses', 'Digital & IT Skills', 'Green Technical & Solar Trades', 'Vocational Livelihood Placement'],
      proposedActivities: ['German & Japanese orientation cohorts', 'Solar & biogas technician modules', 'Youth career guidance workshops'],
      linkedFormType: 'skill-training',
      status: 'Published',
      seoTitle: 'Skill Development & Employment — GOVEDA',
      seoDescription: 'Skills, opportunity and green livelihoods for Rajasthan youth.',
      faqs: [],
      updatedAt: now,
    },
    {
      slug: 'women-empowerment',
      number: 8,
      titleEn: 'Women Empowerment & Livelihoods',
      titleHi: 'महिला सशक्तिकरण एवं आजीविका',
      introEn: 'Strengthening Mahila Self-Help Groups (SHGs), cloth-bag & agro-processing micro-enterprises and financial literacy.',
      introHi: 'महिला स्व-सहायता समूह (SHG), सूती थैला व कृषि-प्रसंस्करण उद्यम और वित्तीय साक्षरता को बढ़ावा।',
      subsections: ['Mahila SHG Strengthening', 'Micro-Enterprise & Stitching Units', 'Natural Product Development', 'Financial & Digital Literacy'],
      proposedActivities: ['SHG cloth bag production orders', 'Rural women banking & accounting clinics', 'Local exhibition stalls'],
      linkedFormType: 'women-shg',
      status: 'Published',
      seoTitle: 'Women Empowerment & Livelihoods — GOVEDA',
      seoDescription: 'Empowering women and strengthening communities through SHG livelihoods.',
      faqs: [],
      updatedAt: now,
    },
    {
      slug: 'senior-care-mental-health',
      number: 9,
      titleEn: 'Senior Citizen Care & Mental Well-being',
      titleHi: 'वरिष्ठ नागरिक सेवा एवं मानसिक स्वास्थ्य',
      introEn: 'Proposed community senior care model, yoga, pranayama, meditation circles and intergenerational emotional support.',
      introHi: 'प्रस्तावित वरिष्ठ नागरिक सेवा मॉडल, योग, प्राणायाम, ध्यान सत्र एवं सामुदायिक मानसिक स्वास्थ्य सहयोग।',
      subsections: ['Proposed Senior Care Model', 'Yoga & Meditation Circles', 'Mental Well-being Awareness', 'Intergenerational Community Support'],
      proposedActivities: ['Morning yoga & pranayama camps', 'Senior citizen health listening circles', 'Youth-elder community volunteering'],
      linkedFormType: 'volunteer',
      status: 'Published',
      seoTitle: 'Senior Care & Mental Wellness — GOVEDA',
      seoDescription: 'Dignity, community care, yoga and mental well-being initiatives.',
      faqs: [],
      updatedAt: now,
    },
    {
      slug: 'heritage-water',
      number: 10,
      titleEn: 'Heritage Conservation & Water Security',
      titleHi: 'सांस्कृतिक धरोहर एवं जल संरक्षण',
      introEn: 'Preserving Shekhawati heritage structures, reviving traditional johads/baoris and promoting rooftop rainwater harvesting.',
      introHi: 'शेखावाटी सांस्कृतिक धरोहर संरक्षण, पारंपरिक जोहड़/बावड़ी पुनर्जीवन एवं वर्षा जल संचयन।',
      subsections: ['Shekhawati Cultural Heritage', 'Traditional Baoris & Johads', 'Rooftop Rainwater Harvesting', 'Solar Water Conservation'],
      proposedActivities: ['Village johad desilting awareness', 'School rainwater harvesting audits', 'Heritage documentation walks'],
      linkedFormType: 'panchayat-ngo',
      status: 'Published',
      seoTitle: 'Heritage Conservation & Water Security — GOVEDA',
      seoDescription: 'Protecting traditional water structures and cultural heritage across Rajasthan.',
      faqs: [],
      updatedAt: now,
    },
  ];
}

function buildInitialWasteRecords(): WasteActivityRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'wst-1001',
      title: 'Bhilwara Main Market Dry Plastic Collection Drive',
      campaignOrProject: 'Plastic-Free Market Campaign (Bhilwara)',
      stateName: 'Rajasthan',
      district: 'Bhilwara',
      locationName: 'Azad Chowk Market & Pratap Nagar, Bhilwara',
      activityDate: '2026-11-12',
      category: 'Dry Plastic',
      quantity: 125,
      unit: 'kg',
      householdsCount: 64,
      participantsCount: 42,
      collectionPartner: 'Mewar Authorised Plastic Recyclers',
      recyclingDestination: 'RIICO Authorised Granulation Unit, Bhilwara',
      evidenceNote: 'Weighment slip #BH-2026-014 and handover receipt logged for audit.',
      verificationStatus: 'Verified',
      isPublic: true,
      updatedAt: now,
    },
    {
      id: 'wst-1002',
      title: 'Sardarshahar Temple Floral & Organic Composting Batch',
      campaignOrProject: 'Clean Village & Temple Waste Pilot',
      stateName: 'Rajasthan',
      district: 'Churu',
      locationName: 'Sardarshahar Ward 4 & Shri Krishna Gaushala',
      activityDate: '2026-11-15',
      category: 'Temple Organic Waste',
      quantity: 210,
      unit: 'kg',
      householdsCount: 18,
      participantsCount: 24,
      collectionPartner: 'Churu Gaushala Compost Cooperative',
      recyclingDestination: 'On-site Vermicompost Pit #2, Sardarshahar',
      evidenceNote: 'Segregated floral offerings weighed before aerobic pit transfer.',
      verificationStatus: 'Published',
      isPublic: true,
      updatedAt: now,
    },
    {
      id: 'wst-1003',
      title: 'Mandore School Four-Stream Segregation Workshop & Audit',
      campaignOrProject: 'Green Campus & Plastic-Free Schools',
      stateName: 'Rajasthan',
      district: 'Jodhpur',
      locationName: 'Adarsh Vidya Mandir Campus, Mandore',
      activityDate: '2026-11-18',
      category: 'Wet Waste',
      quantity: 48,
      unit: 'kg',
      householdsCount: 12,
      participantsCount: 135,
      collectionPartner: 'Campus Eco-Club & Jodhpur Municipal Link',
      recyclingDestination: 'School Garden Aerobic Composter',
      evidenceNote: 'Submitted by District Coordinator — awaiting weighment photo sign-off.',
      verificationStatus: 'Submitted',
      isPublic: false,
      updatedAt: now,
    },
  ];
}

function buildInitialWastePartners(): WastePartnerRecord[] {
  return [
    {
      id: 'wp-1',
      name: 'Mewar Authorised Plastic Recyclers',
      partnerType: 'Authorised Recycler',
      district: 'Bhilwara',
      contactPerson: 'Rajendra Somani',
      status: 'Active',
      notes: 'RSPCB-registered dry plastic baling & granulation partner.',
    },
    {
      id: 'wp-2',
      name: 'Marudhar Shakti Mahila SHG Cloth Bag Unit',
      partnerType: 'SHG Cloth Bag Unit',
      district: 'Jodhpur',
      contactPerson: 'Sunita Devi Bishnoi',
      status: 'Active',
      notes: 'Produces washable cotton & jute shopping bags for plastic-free markets.',
    },
    {
      id: 'wp-3',
      name: 'Churu Gaushala Compost Cooperative',
      partnerType: 'Compost & Biogas Unit',
      district: 'Churu',
      contactPerson: 'Kavita Choudhary',
      status: 'Active',
      notes: 'Processes temple floral & kitchen wet waste into vermicompost.',
    },
  ];
}

function buildInitialUnifiedProgrammes(): UnifiedProgrammeRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'prg-bhilwara-green-village',
      programmeCode: 'GVD-PRJ-BHI-2026-1001',
      type: 'project',
      parentId: null,
      titleEn: 'Bhilwara Green Village Development',
      titleHi: 'भीलवाड़ा हरित ग्राम विकास परियोजना',
      summaryEn:
        'Flagship district agroforestry, farm-boundary plantation, and soil moisture restoration project uniting rural households across Mandalgarh and Shahpura clusters.',
      summaryHi:
        'मांडलगढ़ एवं शाहपुरा क्लस्टर के ग्रामीण परिवारों को कृषि-वानिकी, मेड़ वृक्षारोपण और मृदा नमी संरक्षण से जोड़ने वाली प्रमुख जिला परियोजना।',
      objectivesEn:
        'Establish multi-village native tree corridors, train local Harit Mitras, and verify 3-year sapling survival with full community ownership.',
      objectivesHi:
        'बहु-ग्राम देशी वृक्ष गलियारे बनाना, स्थानीय हरित मित्रों को प्रशिक्षित करना और 3-वर्षीय पौध जीवितता सत्यापन सुनिश्चित करना।',
      coverageScope: 'specific',
      locations: [
        {
          id: 'loc-bhi-1',
          stateName: 'Rajasthan',
          district: 'Bhilwara',
          locationLevel: 'Village / Gram Panchayat',
          localityName: 'Mandalgarh Gram Panchayat Cluster',
        },
        {
          id: 'loc-bhi-2',
          stateName: 'Rajasthan',
          district: 'Bhilwara',
          locationLevel: 'Tehsil / Block',
          localityName: 'Shahpura Rural Block',
        },
      ],
      missionSlug: 'harit-rajasthan',
      linkedFormType: 'farmer',
      publicationStatus: 'Published',
      operationalStatus: 'Ongoing',
      startDate: '2026-07-01',
      endDate: '2027-06-30',
      venueOrMode: 'Multi-Village Field Implementation',
      targetAudience: 'Farmers, Gram Panchayats & Harit Mitras',
      seoTitle: 'Bhilwara Green Village Development — GOVEDA Foundation',
      seoDescription:
        'District-wide agroforestry and native tree plantation project across Bhilwara villages.',
      media: [
        {
          id: 'med-bhi-1',
          mediaType: 'photo',
          url: '/assets/hero-harit-clean.jpg',
          title: 'Mandalgarh Boundary Plantation Overview',
          caption: 'Native Khejri, Neem, and Amla farm-boundary agroforestry alignment.',
          altText: 'Rural farm boundary native tree plantation in Bhilwara Rajasthan',
          capturedDate: '2026-11-10',
          locationLabel: 'Mandalgarh, Bhilwara',
          isCover: true,
          isPublic: true,
          displayOrder: 1,
        },
        {
          id: 'med-bhi-2',
          mediaType: 'pdf',
          url: '',
          title: 'Bhilwara Village Baseline Assessment Framework (Draft)',
          caption: 'Methodological checklist for village sapling audit and farmer consent.',
          altText: 'Baseline assessment PDF document',
          capturedDate: '2026-11-12',
          locationLabel: 'Bhilwara District',
          isCover: false,
          isPublic: true,
          displayOrder: 2,
        },
      ],
      roles: [],
      updatedAt: now,
    },
    {
      id: 'prg-mandalgarh-monsoon-campaign',
      programmeCode: 'GVD-CMP-BHI-2026-1002',
      type: 'campaign',
      parentId: 'prg-bhilwara-green-village',
      titleEn: 'Mandalgarh Monsoon Farm-Boundary Plantation Campaign',
      titleHi: 'मांडलगढ़ मानसून मेड़ वृक्षारोपण अभियान',
      summaryEn:
        'Seasonal community campaign under Bhilwara Green Village Development mobilising farmers, youth volunteers, and schools for native sapling planting and 3-year care pledges.',
      summaryHi:
        'भीलवाड़ा हरित ग्राम विकास परियोजना के अंतर्गत किसानों, युवा स्वयंसेवकों व विद्यालयों का मौसमी वृक्षारोपण एवं संरक्षण अभियान।',
      objectivesEn:
        'Coordinate village-level Harit Mitras, collect farmer boundary requests, and organise transparent sapling distribution.',
      objectivesHi:
        'ग्राम स्तर पर हरित मित्रों का समन्वय, किसान पंजीकरण और पारदर्शी पौध वितरण सुनिश्चित करना।',
      coverageScope: 'specific',
      locations: [
        {
          id: 'loc-bhi-c1',
          stateName: 'Rajasthan',
          district: 'Bhilwara',
          locationLevel: 'Village / Gram Panchayat',
          localityName: 'Mandalgarh & Bigod Gram Panchayats',
        },
      ],
      missionSlug: 'harit-rajasthan',
      linkedFormType: 'harit-mitra',
      publicationStatus: 'Published',
      operationalStatus: 'Ongoing',
      startDate: '2026-07-15',
      endDate: '2026-12-31',
      venueOrMode: 'Village Outreach & Panchayat Drives',
      targetAudience: 'Harit Mitras, Farmers & School Eco-Clubs',
      seoTitle: 'Mandalgarh Monsoon Plantation Campaign — GOVEDA',
      seoDescription: 'Community plantation campaign under Bhilwara Green Village Development.',
      media: [
        {
          id: 'med-bhi-c1',
          mediaType: 'photo',
          url: '/assets/carbon-stage1-sapling.jpg',
          title: 'Farmer & Harit Mitra Field Orientation',
          caption: 'Village coordination briefing for native sapling spacing and mulching.',
          altText: 'Farmer and field coordinator reviewing plantation plan',
          capturedDate: '2026-11-14',
          locationLabel: 'Bigod, Bhilwara',
          isCover: true,
          isPublic: true,
          displayOrder: 1,
        },
      ],
      roles: [
        {
          id: 'role-mnd-1',
          roleCode: 'HM-LEAD',
          titleEn: 'Village Harit Mitra Coordinator',
          titleHi: 'ग्राम हरित मित्र समन्वयक',
          descriptionEn: 'Verify farmer boundaries and track monthly sapling survival.',
          descriptionHi: 'किसान मेड़ का सत्यापन एवं मासिक पौध जीवितता निगरानी।',
          formType: 'harit-mitra',
          maxSlots: 25,
          isOpen: true,
        },
      ],
      updatedAt: now,
    },
    {
      id: 'prg-mandalgarh-sapling-event',
      programmeCode: 'GVD-EVT-BHI-2026-1003',
      type: 'event',
      parentId: 'prg-mandalgarh-monsoon-campaign',
      titleEn: 'Gram Panchayat Sapling Distribution & Pledge Camp',
      titleHi: 'ग्राम पंचायत पौध वितरण एवं संरक्षण संकल्प शिविर',
      summaryEn:
        'On-ground community distribution event under the Mandalgarh Monsoon Campaign featuring native Khejri, Neem, and Amla saplings with soil-care guidance.',
      summaryHi:
        'मांडलगढ़ मानसून अभियान के अंतर्गत देशी खेजड़ी, नीम एवं आँवला पौध वितरण और मृदा संरक्षण शिविर।',
      objectivesEn:
        'Distribute verified nursery saplings to registered farmers and record geotagged survival pledge cards.',
      objectivesHi:
        'पंजीकृत किसानों को सत्यापित नर्सरी पौध वितरण और संरक्षण संकल्प कार्ड दर्ज करना।',
      coverageScope: 'specific',
      locations: [
        {
          id: 'loc-bhi-e1',
          stateName: 'Rajasthan',
          district: 'Bhilwara',
          locationLevel: 'Village / Gram Panchayat',
          localityName: 'Mandalgarh Panchayat Bhawan Grounds',
        },
      ],
      missionSlug: 'harit-rajasthan',
      linkedFormType: 'volunteer',
      publicationStatus: 'Published',
      operationalStatus: 'Approved',
      startDate: '2026-12-06',
      endDate: '2026-12-06',
      venueOrMode: 'Mandalgarh Gram Panchayat Ground, 07:30 AM',
      targetAudience: 'Registered Farmers, Youth Volunteers & Local Elders',
      seoTitle: 'Gram Panchayat Sapling Camp Bhilwara — GOVEDA',
      seoDescription: 'Community sapling distribution event under Bhilwara Green Village Development.',
      media: [],
      roles: [],
      updatedAt: now,
    },
    {
      id: 'prg-farmer-mrv-training',
      programmeCode: 'GVD-TRN-BHI-2026-1004',
      type: 'training',
      parentId: 'prg-bhilwara-green-village',
      titleEn: 'Agroforestry, Soil Health & Carbon MRV Orientation Workshop',
      titleHi: 'कृषि-वानिकी, मृदा स्वास्थ्य एवं कार्बन MRV प्रशिक्षण कार्यशाला',
      summaryEn:
        'Practical 1-day bilingual training for Bhilwara farmers and Harit Mitras on organic mulching, Jeevamrit preparation, and transparent carbon project readiness.',
      summaryHi:
        'भीलवाड़ा के किसानों एवं हरित मित्रों हेतु जैविक मल्चिंग, जीवामृत निर्माण व पारदर्शी कार्बन परियोजना तैयारी पर व्यावहारिक प्रशिक्षण।',
      objectivesEn:
        'Equip rural coordinators with scientific plantation spacing, organic soil inputs, and honest MRV documentation practices.',
      objectivesHi:
        'ग्रामीण समन्वयकों को वैज्ञानिक पौध दूरी, जैविक खाद एवं सटीक दस्तावेज़ीकरण का प्रशिक्षण देना।',
      coverageScope: 'specific',
      locations: [
        {
          id: 'loc-bhi-t1',
          stateName: 'Rajasthan',
          district: 'Bhilwara',
          locationLevel: 'City / Municipality / Ward',
          localityName: 'Bhilwara Krishi Kendra Training Hall',
        },
      ],
      missionSlug: 'carbon-climate',
      linkedFormType: 'skill-training',
      publicationStatus: 'Published',
      operationalStatus: 'Approved',
      startDate: '2026-12-12',
      endDate: '2026-12-12',
      venueOrMode: 'In-Person Field Workshop + Bilingual Printed Handbook',
      targetAudience: 'Farmers, Harit Mitras & Agriculture Students',
      seoTitle: 'Farmer Agroforestry & Carbon MRV Workshop — GOVEDA',
      seoDescription: 'Hands-on farmer training programme in Bhilwara.',
      media: [],
      roles: [],
      updatedAt: now,
    },
    {
      id: 'prg-clean-india-plastic-free',
      programmeCode: 'GVD-PRJ-IND-2026-1005',
      type: 'project',
      parentId: null,
      titleEn: 'Clean India — Four-Stream Market & Temple Waste Initiative',
      titleHi: 'स्वच्छ भारत — चार-स्तरीय बाजार एवं मंदिर कचरा प्रबंधन पहल',
      summaryEn:
        'Multi-district initiative connecting local markets, temples, and women SHG cloth-bag units across Rajasthan with authorised recyclers and organic composting.',
      summaryHi:
        'स्थानीय बाजारों, मंदिरों एवं महिला स्व-सहायता समूहों को चार-स्तरीय कचरा पृथक्करण, जैविक खाद और अधिकृत रीसाइक्लिंग से जोड़ने वाली बहु-जिला पहल।',
      objectivesEn:
        'Eliminate single-use plastic in partner markets, convert floral temple offerings into compost, and publish only verified weighment totals.',
      objectivesHi:
        'बाजारों में सिंगल-यूज़ प्लास्टिक रोकना, मंदिर पुष्प से जैविक खाद बनाना और केवल सत्यापित तौल आँकड़े प्रकाशित करना।',
      coverageScope: 'india-wide',
      locations: [
        {
          id: 'loc-ci-1',
          stateName: 'Rajasthan',
          district: 'Bhilwara',
          locationLevel: 'City / Municipality / Ward',
          localityName: 'Azad Chowk Market & Pratap Nagar',
        },
        {
          id: 'loc-ci-2',
          stateName: 'Rajasthan',
          district: 'Churu',
          locationLevel: 'City / Municipality / Ward',
          localityName: 'Sardarshahar Ward 4',
        },
        {
          id: 'loc-ci-3',
          stateName: 'Rajasthan',
          district: 'Jodhpur',
          locationLevel: 'Tehsil / Block',
          localityName: 'Mandore School Cluster',
        },
      ],
      missionSlug: 'clean-india',
      linkedFormType: 'volunteer',
      publicationStatus: 'Published',
      operationalStatus: 'Ongoing',
      startDate: '2026-10-01',
      endDate: '2027-09-30',
      venueOrMode: 'Multi-District Markets, Schools & Temples',
      targetAudience: 'Market Associations, Women SHGs, Schools & Volunteers',
      seoTitle: 'Clean India Plastic-Free Market & Temple Initiative — GOVEDA',
      seoDescription: 'Multi-district waste segregation and plastic-free market project.',
      media: [
        {
          id: 'med-ci-1',
          mediaType: 'photo',
          url: '/assets/hero-home-clean.jpg',
          title: 'Four-Stream Source Segregation & Cloth Bag Drive',
          caption: 'Community waste segregation and SHG cotton bag adoption across local streets.',
          altText: 'Clean India waste segregation and plastic-free market initiative',
          capturedDate: '2026-11-15',
          locationLabel: 'Bhilwara & Churu, Rajasthan',
          isCover: true,
          isPublic: true,
          displayOrder: 1,
        },
      ],
      roles: [],
      updatedAt: now,
    },
    {
      id: 'prg-churu-gaushala-pilot',
      programmeCode: 'GVD-PRJ-CHU-2026-1006',
      type: 'project',
      parentId: null,
      titleEn: 'Churu Self-Reliant Gaushala & Biogas Model (Proposed)',
      titleHi: 'चूरू आत्मनिर्भर गौशाला एवं बायोगैस मॉडल (प्रस्तावित परियोजना)',
      summaryEn:
        'Proposed rural circular-economy project connecting Thathawata and Sardarshahar Gaushalas with organic vermicompost, green fodder cultivation, and clean biogas energy.',
      summaryHi:
        'थाठावता एवं सरदारशहर की गौशालाओं को जैविक वर्मीकम्पोस्ट, हरित चारा उत्पादन और स्वच्छ बायोगैस ऊर्जा से आत्मनिर्भर बनाने की प्रस्तावित परियोजना।',
      objectivesEn:
        'Conduct baseline Gaushala livestock & fodder assessment, design sustainable dung-to-energy workflows, and link local farmers to organic manure.',
      objectivesHi:
        'गौशाला पशुधन व चारा मूल्यांकन, गोबर से ऊर्जा एवं जैविक खाद उत्पादन प्रणाली तैयार करना और स्थानीय किसानों को जोड़ना।',
      coverageScope: 'specific',
      locations: [
        {
          id: 'loc-chu-1',
          stateName: 'Rajasthan',
          district: 'Churu',
          locationLevel: 'Village / Gram Panchayat',
          localityName: 'Thathawata',
        },
        {
          id: 'loc-chu-2',
          stateName: 'Rajasthan',
          district: 'Churu',
          locationLevel: 'Tehsil / Block',
          localityName: 'Sardarshahar',
        },
      ],
      missionSlug: 'atmanirbhar-gaushala',
      missionSlugs: ['atmanirbhar-gaushala', 'swachh-urja', 'organic-farming'],
      linkedFormType: 'gaushala',
      linkedFormTypes: ['gaushala', 'farmer', 'csr-partner'],
      publicationStatus: 'Published',
      operationalStatus: 'Proposed',
      startDate: '2027-01-15',
      endDate: '2028-12-31',
      venueOrMode: 'Gaushala Site Feasibility & Community Partnership',
      targetAudience: 'Gaushala Committees, Local Farmers & CSR Partners',
      seoTitle: 'Churu Self-Reliant Gaushala Proposed Project — GOVEDA',
      seoDescription: 'Proposed self-reliant Gaushala and biogas model in Churu, Rajasthan.',
      media: [
        {
          id: 'med-chu-1',
          mediaType: 'photo',
          url: '/assets/hero-carbon-clean.jpg',
          title: 'Thathawata Rural Landscape & Gaushala Corridor',
          caption: 'Proposed circular rural ecology belt in Sardarshahar block, Churu.',
          altText: 'Rural Rajasthan farmland and green corridor in Churu district',
          capturedDate: '2026-11-16',
          locationLabel: 'Thathawata, Sardarshahar, Churu',
          isCover: true,
          isPublic: true,
          displayOrder: 1,
        },
      ],
      roles: [],
      updatedAt: now,
    },
    {
      id: 'prg-bikaner-phalodi-green-campus-campaign',
      programmeCode: 'GVD-CMP-BIK-2026-1007',
      type: 'campaign',
      parentId: null,
      titleEn: 'Desert Green Campus & Native Tree Pledge Campaign (Proposed)',
      titleHi: 'मरुधरा ग्रीन कैंपस एवं देशी वृक्ष संकल्प अभियान (प्रस्तावित अभियान)',
      summaryEn:
        'Proposed public participation campaign mobilising schools, colleges, and youth across Bikaner, Phalodi, and Jodhpur to adopt native Khejri, Rohida, and Neem saplings with student care pledges.',
      summaryHi:
        'बीकानेर, फलोदी एवं जोधपुर के विद्यालयों, महाविद्यालयों और युवाओं को खेजड़ी, रोहिड़ा व नीम संरक्षण संकल्प से जोड़ने वाला प्रस्तावित जन-अभियान।',
      objectivesEn:
        'Onboard participating schools and colleges, establish student Eco-Clubs, and coordinate seasonal native plantation drives.',
      objectivesHi:
        'सहभागी विद्यालयों व कॉलेजों को जोड़ना, विद्यार्थी इको-क्लब बनाना और मौसमी देशी वृक्षारोपण संचालित करना।',
      coverageScope: 'specific',
      locations: [
        {
          id: 'loc-bik-1',
          stateName: 'Rajasthan',
          district: 'Bikaner',
          locationLevel: 'Tehsil / Block',
          localityName: 'Nokha',
        },
        {
          id: 'loc-pha-1',
          stateName: 'Rajasthan',
          district: 'Phalodi',
          locationLevel: 'Village / Gram Panchayat',
          localityName: 'Khichan',
        },
        {
          id: 'loc-jod-1',
          stateName: 'Rajasthan',
          district: 'Jodhpur',
          locationLevel: 'Tehsil / Block',
          localityName: 'Osian',
        },
      ],
      missionSlug: 'harit-rajasthan',
      missionSlugs: ['harit-rajasthan', 'skill-development'],
      linkedFormType: 'school-college',
      linkedFormTypes: ['school-college', 'harit-mitra', 'volunteer'],
      publicationStatus: 'Published',
      operationalStatus: 'Planned',
      startDate: '2027-02-01',
      endDate: '2027-09-30',
      venueOrMode: 'Schools, Colleges & Village Youth Clubs',
      targetAudience: 'Students, Teachers, School Principals & Youth Volunteers',
      seoTitle: 'Desert Green Campus Proposed Campaign — GOVEDA',
      seoDescription: 'Upcoming school and college green campus campaign across Bikaner, Phalodi and Jodhpur.',
      media: [
        {
          id: 'med-bik-1',
          mediaType: 'photo',
          url: '/assets/carbon-stage3-mrv-audit.jpg',
          title: 'Youth Eco-Club Field Plantation Preparation',
          caption: 'Planned native species education and green campus adoption across western Rajasthan.',
          altText: 'Desert green campus and youth tree stewardship preparation',
          capturedDate: '2026-11-16',
          locationLabel: 'Bikaner, Phalodi & Jodhpur',
          isCover: true,
          isPublic: true,
          displayOrder: 1,
        },
      ],
      roles: [
        {
          id: 'role-gc-1',
          roleCode: 'ECO-CLUB',
          titleEn: 'Campus Green Coordinator',
          titleHi: 'कैंपस हरित समन्वयक',
          descriptionEn: 'Lead school/college sapling care teams and monthly survival checklists.',
          descriptionHi: 'विद्यालय/कॉलेज में पौध देखभाल दल और मासिक निगरानी का नेतृत्व।',
          formType: 'school-college',
          maxSlots: 40,
          isOpen: true,
        },
      ],
      updatedAt: now,
    },
    {
      id: 'prg-churu-plastic-free-campaign',
      programmeCode: 'GVD-CMP-CHU-2026-1008',
      type: 'campaign',
      parentId: 'prg-clean-india-plastic-free',
      titleEn: 'Sardarshahar Plastic-Free Market & Cloth Bag Campaign (Proposed)',
      titleHi: 'सरदारशहर प्लास्टिक-मुक्त बाज़ार एवं कपड़े का थैला अभियान (प्रस्तावित)',
      summaryEn:
        'Proposed civic awareness campaign inviting local shopkeepers, women SHG artisans, and ward volunteers in Sardarshahar to transition away from single-use plastic.',
      summaryHi:
        'सरदारशहर के व्यापारियों, महिला स्व-सहायता समूहों और वार्ड स्वयंसेवकों को सिंगल-यूज़ प्लास्टिक से मुक्ति दिलाने वाला प्रस्तावित जन-अभियान।',
      objectivesEn:
        'Distribute SHG-stitched cloth bags, install segregated bins in Ward 4 markets, and verify plastic reduction transparently.',
      objectivesHi:
        'महिला समूहों द्वारा निर्मित कपड़े के थैले उपलब्ध कराना और वार्ड 4 बाज़ारों में कचरा पृथक्करण लागू करना।',
      coverageScope: 'specific',
      locations: [
        {
          id: 'loc-chu-pf1',
          stateName: 'Rajasthan',
          district: 'Churu',
          locationLevel: 'City / Municipality / Ward',
          localityName: 'Sardarshahar Ward 4',
        },
        {
          id: 'loc-chu-pf2',
          stateName: 'Rajasthan',
          district: 'Churu',
          locationLevel: 'Village / Gram Panchayat',
          localityName: 'Thathawata',
        },
      ],
      missionSlug: 'clean-india',
      missionSlugs: ['clean-india', 'women-empowerment'],
      linkedFormType: 'volunteer',
      linkedFormTypes: ['volunteer', 'women-shg'],
      publicationStatus: 'Published',
      operationalStatus: 'Proposed',
      startDate: '2027-01-26',
      endDate: '2027-06-30',
      venueOrMode: 'Local Markets, Municipal Wards & SHG Centres',
      targetAudience: 'Shopkeepers, Women SHGs, Youth Volunteers & Residents',
      seoTitle: 'Sardarshahar Plastic-Free Market Proposed Campaign — GOVEDA',
      seoDescription: 'Proposed plastic-free market and women SHG cloth bag campaign in Sardarshahar, Churu.',
      media: [],
      roles: [],
      updatedAt: now,
    },
  ];
}

function buildInitialFounderMessage(): FounderMessageConfig {
  return {
    headingEn: 'A Message from Our Founder',
    headingHi: 'संस्थापक का संदेश',
    messageEn:
      'Environmental restoration endures only when farmers, Gaushalas, villages, youth, and institutions stand together as partners. GOVEDA Carbon & Climate India Foundation has been established as a Section 8 non-profit organisation with a clear commitment: honest ground action, transparent verification, and shared stewardship from Harit Rajasthan to Harit Bharat.',
    messageHi:
      'पर्यावरण संरक्षण तभी स्थायी होता है जब किसान, गौशालाएँ, ग्राम समाज, युवा और संस्थाएँ एक साथ सहभागी बनें। GOVEDA कार्बन एवं क्लाइमेट इंडिया फाउंडेशन एक Section 8 गैर-लाभकारी संस्था के रूप में ईमानदार धरातलीय कार्य, पारदर्शी सत्यापन और हरित राजस्थान से हरित भारत के सामूहिक संकल्प के साथ स्थापित की गई है।',
    attributionEn: 'Raj Kumar Poonia – Founder & President',
    attributionHi: 'राज कुमार पूनिया – संस्थापक एवं अध्यक्ष',
    signatureImageUrl: '',
    showOnAboutUs: true,
    updatedAt: new Date().toISOString(),
  };
}

const blueprintState: AdminBlueprintPayload = {
  homepageSections: buildInitialHomepageSections(),
  staticPages: buildInitialStaticPages(),
  missionConfigs: buildInitialMissionConfigs(),
  wasteRecords: buildInitialWasteRecords(),
  wastePartners: buildInitialWastePartners(),
  programmes: buildInitialUnifiedProgrammes(),
  founderMessage: buildInitialFounderMessage(),
};

export const blueprintStore = {
  getAll(): AdminBlueprintPayload {
    return {
      homepageSections: [...blueprintState.homepageSections].sort(
        (a, b) => a.displayOrder - b.displayOrder
      ),
      staticPages: [...blueprintState.staticPages].sort((a, b) => a.navOrder - b.navOrder),
      missionConfigs: [...blueprintState.missionConfigs].sort((a, b) => a.number - b.number),
      wasteRecords: [...blueprintState.wasteRecords].sort((a, b) =>
        b.activityDate.localeCompare(a.activityDate)
      ),
      wastePartners: [...blueprintState.wastePartners],
      programmes: [...blueprintState.programmes].sort((a, b) =>
        (b.updatedAt || '').localeCompare(a.updatedAt || '')
      ),
      founderMessage: blueprintState.founderMessage
        ? { ...blueprintState.founderMessage }
        : buildInitialFounderMessage(),
    };
  },

  saveFounderMessage(patch: Partial<FounderMessageConfig>): FounderMessageConfig {
    const current = blueprintState.founderMessage ?? buildInitialFounderMessage();
    const updated: FounderMessageConfig = {
      headingEn: String(patch.headingEn ?? current.headingEn).trim() || 'A Message from Our Founder',
      headingHi: String(patch.headingHi ?? current.headingHi).trim() || 'संस्थापक का संदेश',
      messageEn: String(patch.messageEn ?? current.messageEn).trim(),
      messageHi: String(patch.messageHi ?? current.messageHi).trim(),
      attributionEn:
        String(patch.attributionEn ?? current.attributionEn).trim() ||
        'Raj Kumar Poonia – Founder & President',
      attributionHi:
        String(patch.attributionHi ?? current.attributionHi).trim() ||
        'राज कुमार पूनिया – संस्थापक एवं अध्यक्ष',
      signatureImageUrl: String(patch.signatureImageUrl ?? current.signatureImageUrl).trim(),
      showOnAboutUs:
        typeof patch.showOnAboutUs === 'boolean' ? patch.showOnAboutUs : current.showOnAboutUs,
      updatedAt: new Date().toISOString(),
    };
    blueprintState.founderMessage = updated;
    void syncBlueprintToPostgres();
    return { ...updated };
  },

  saveHomepageSections(sections: HomepageSectionConfig[]): HomepageSectionConfig[] {
    const now = new Date().toISOString();
    blueprintState.homepageSections = sections
      .map((s, idx) => ({
        ...s,
        displayOrder: Number(s.displayOrder) || idx + 1,
        updatedAt: now,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
    void syncBlueprintToPostgres();
    return [...blueprintState.homepageSections];
  },

  upsertStaticPage(page: Partial<StaticPageRecord>): StaticPageRecord {
    const now = new Date().toISOString();
    const id =
      page.id && page.id.trim()
        ? page.id.trim()
        : `pg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const existingIdx = blueprintState.staticPages.findIndex((p) => p.id === id);
    const titleEn = String(page.titleEn || 'Untitled Page').trim();
    const rawSlug =
      String(page.slug || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '') ||
      titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const record: StaticPageRecord = {
      id,
      titleEn,
      titleHi: String(page.titleHi || titleEn).trim(),
      slug: rawSlug || id,
      parentPath: String(page.parentPath || 'Top-Level Page').trim(),
      summaryEn: String(page.summaryEn || '').trim(),
      summaryHi: String(page.summaryHi || '').trim(),
      bodyEn: String(page.bodyEn || '').trim(),
      bodyHi: String(page.bodyHi || '').trim(),
      linkedFormType: String(page.linkedFormType || '').trim(),
      ctaLabel: String(page.ctaLabel || 'Join Mission').trim(),
      seoTitle: String(page.seoTitle || `${titleEn} — GOVEDA Foundation`).trim(),
      seoDescription: String(page.seoDescription || page.summaryEn || '').trim(),
      showInNav: Boolean(page.showInNav),
      navOrder: Number(page.navOrder) || blueprintState.staticPages.length + 1,
      status:
        page.status === 'Published' || page.status === 'Hidden' ? page.status : 'Draft',
      updatedAt: now,
    };

    if (existingIdx >= 0) {
      blueprintState.staticPages[existingIdx] = record;
    } else {
      blueprintState.staticPages.push(record);
    }
    void syncBlueprintToPostgres();
    return record;
  },

  deleteStaticPage(id: string): StaticPageRecord | null {
    const idx = blueprintState.staticPages.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const [deleted] = blueprintState.staticPages.splice(idx, 1);
    void syncBlueprintToPostgres();
    return deleted;
  },

  updateMissionConfig(
    slug: string,
    patch: Partial<MissionAdminConfig>
  ): MissionAdminConfig | null {
    const existing = blueprintState.missionConfigs.find((m) => m.slug === slug);
    if (!existing) return null;
    Object.assign(existing, {
      ...patch,
      slug: existing.slug,
      number: existing.number,
      updatedAt: new Date().toISOString(),
    });
    void syncBlueprintToPostgres();
    return { ...existing };
  },

  upsertWasteRecord(rec: Partial<WasteActivityRecord>): WasteActivityRecord {
    const now = new Date().toISOString();
    const id =
      rec.id && rec.id.trim()
        ? rec.id.trim()
        : `wst-${Date.now().toString().slice(-5)}`;
    const idx = blueprintState.wasteRecords.findIndex((w) => w.id === id);
    const record: WasteActivityRecord = {
      id,
      title: String(rec.title || 'Waste Management Drive').trim(),
      campaignOrProject: String(rec.campaignOrProject || 'Clean India Mission').trim(),
      stateName: String(rec.stateName || 'Rajasthan').trim(),
      district: String(rec.district || 'Bhilwara').trim(),
      locationName: String(rec.locationName || '').trim(),
      activityDate: String(rec.activityDate || now.slice(0, 10)).trim(),
      category: (rec.category as WasteActivityRecord['category']) || 'Dry Plastic',
      quantity: Math.max(0, Number(rec.quantity) || 0),
      unit: rec.unit === 'tonnes' ? 'tonnes' : 'kg',
      householdsCount: Math.max(0, Number(rec.householdsCount) || 0),
      participantsCount: Math.max(0, Number(rec.participantsCount) || 0),
      collectionPartner: String(rec.collectionPartner || '').trim(),
      recyclingDestination: String(rec.recyclingDestination || '').trim(),
      evidenceNote: String(rec.evidenceNote || '').trim(),
      verificationStatus:
        rec.verificationStatus === 'Verified' || rec.verificationStatus === 'Published'
          ? rec.verificationStatus
          : 'Submitted',
      isPublic: Boolean(rec.isPublic),
      updatedAt: now,
    };

    if (idx >= 0) {
      blueprintState.wasteRecords[idx] = record;
    } else {
      blueprintState.wasteRecords.unshift(record);
    }
    void syncBlueprintToPostgres();
    return record;
  },

  deleteWasteRecord(id: string): WasteActivityRecord | null {
    const idx = blueprintState.wasteRecords.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    const [deleted] = blueprintState.wasteRecords.splice(idx, 1);
    void syncBlueprintToPostgres();
    return deleted;
  },

  upsertWastePartner(partner: Partial<WastePartnerRecord>): WastePartnerRecord {
    const id =
      partner.id && partner.id.trim()
        ? partner.id.trim()
        : `wp-${Date.now().toString().slice(-5)}`;
    const idx = blueprintState.wastePartners.findIndex((p) => p.id === id);
    const record: WastePartnerRecord = {
      id,
      name: String(partner.name || 'Authorised Partner').trim(),
      partnerType:
        (partner.partnerType as WastePartnerRecord['partnerType']) ||
        'Authorised Recycler',
      district: String(partner.district || 'Bhilwara').trim(),
      contactPerson: String(partner.contactPerson || '').trim(),
      status: partner.status === 'Pending Verification' ? 'Pending Verification' : 'Active',
      notes: String(partner.notes || '').trim(),
    };
    if (idx >= 0) {
      blueprintState.wastePartners[idx] = record;
    } else {
      blueprintState.wastePartners.push(record);
    }
    void syncBlueprintToPostgres();
    return record;
  },

  deleteWastePartner(id: string): WastePartnerRecord | null {
    const idx = blueprintState.wastePartners.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const [deleted] = blueprintState.wastePartners.splice(idx, 1);
    void syncBlueprintToPostgres();
    return deleted;
  },

  upsertProgramme(input: Partial<UnifiedProgrammeRecord>): UnifiedProgrammeRecord {
    const now = new Date().toISOString();
    const type: UnifiedProgrammeRecord['type'] =
      input.type === 'campaign' || input.type === 'event' || input.type === 'training'
        ? input.type
        : 'project';
    const id =
      input.id && input.id.trim()
        ? input.id.trim()
        : `prg-${type.slice(0, 3)}-${Date.now().toString().slice(-6)}`;
    const idx = blueprintState.programmes.findIndex((p) => p.id === id);

    const locations: ProgrammeLocationTag[] = Array.isArray(input.locations)
      ? input.locations
          .filter((l) => l && (l.stateName || l.district))
          .map((l, i) => ({
            id: l.id || `loc-${Date.now()}-${i}`,
            stateName: String(l.stateName || 'Rajasthan').trim(),
            district: String(l.district || '').trim(),
            locationLevel: l.locationLevel || 'Entire District',
            localityName: String(l.localityName || '').trim(),
          }))
      : [];

    const media: ProgrammeMediaItem[] = Array.isArray(input.media)
      ? input.media
          .filter((m) => m && (m.title || m.url))
          .map((m, i) => ({
            id: m.id || `med-${Date.now()}-${i}`,
            mediaType: (m.mediaType === 'video' || m.mediaType === 'pdf'
              ? m.mediaType
              : 'photo') as ProgrammeMediaItem['mediaType'],
            url: String(m.url || '').trim(),
            title: String(m.title || 'Programme Media').trim(),
            caption: String(m.caption || '').trim(),
            altText: String(m.altText || m.title || '').trim(),
            capturedDate: String(m.capturedDate || now.slice(0, 10)).trim(),
            locationLabel: String(m.locationLabel || '').trim(),
            isCover: Boolean(m.isCover),
            isPublic: m.isPublic !== false,
            displayOrder: Number(m.displayOrder) || i + 1,
          }))
          .sort((a, b) => a.displayOrder - b.displayOrder)
      : [];

    const firstDist = locations[0]?.district || (input.coverageScope === 'india-wide' ? 'IND' : 'RAJ');
    const typeCode =
      type === 'project' ? 'PRJ' : type === 'campaign' ? 'CMP' : type === 'event' ? 'EVT' : 'TRN';
    const locPrefix = firstDist
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 3)
      .padEnd(3, 'X');
    const generatedCode = `GVD-${typeCode}-${locPrefix}-${new Date().getFullYear()}-${String(
      1001 + blueprintState.programmes.length
    ).padStart(4, '0')}`;

    const titleEn = String(input.titleEn || 'Untitled Programme').trim();
    const record: UnifiedProgrammeRecord = {
      id,
      programmeCode:
        input.programmeCode && input.programmeCode.trim()
          ? input.programmeCode.trim().toUpperCase()
          : idx >= 0
          ? blueprintState.programmes[idx].programmeCode
          : generatedCode,
      type,
      parentId:
        input.parentId && input.parentId.trim() && input.parentId !== id
          ? input.parentId.trim()
          : null,
      titleEn,
      titleHi: String(input.titleHi || titleEn).trim(),
      summaryEn: String(input.summaryEn || '').trim(),
      summaryHi: String(input.summaryHi || input.summaryEn || '').trim(),
      objectivesEn: String(input.objectivesEn || '').trim(),
      objectivesHi: String(input.objectivesHi || input.objectivesEn || '').trim(),
      coverageScope: input.coverageScope === 'india-wide' ? 'india-wide' : 'specific',
      locations,
      missionSlug: String(input.missionSlug || 'harit-rajasthan').trim(),
      missionSlugs: Array.isArray(input.missionSlugs)
        ? Array.from(
            new Set(
              [String(input.missionSlug || 'harit-rajasthan').trim(), ...input.missionSlugs]
                .map((s) => String(s).trim())
                .filter(Boolean)
            )
          )
        : [String(input.missionSlug || 'harit-rajasthan').trim()],
      linkedFormType: String(input.linkedFormType || 'farmer').trim(),
      linkedFormTypes: Array.isArray(input.linkedFormTypes)
        ? Array.from(
            new Set(
              [String(input.linkedFormType || 'farmer').trim(), ...input.linkedFormTypes]
                .map((s) => String(s).trim())
                .filter(Boolean)
            )
          )
        : [String(input.linkedFormType || 'farmer').trim()],
      publicationStatus:
        input.publicationStatus === 'Review' ||
        input.publicationStatus === 'Published' ||
        input.publicationStatus === 'Archived'
          ? input.publicationStatus
          : 'Draft',
      operationalStatus:
        input.operationalStatus === 'Planned' ||
        input.operationalStatus === 'In Progress' ||
        input.operationalStatus === 'Completed' ||
        input.operationalStatus === 'Under Assessment' ||
        input.operationalStatus === 'Approved' ||
        input.operationalStatus === 'Ongoing' ||
        input.operationalStatus === 'Completed / Verified'
          ? input.operationalStatus
          : 'Proposed',
      startDate: String(input.startDate || now.slice(0, 10)).trim(),
      endDate: String(input.endDate || '').trim(),
      venueOrMode: String(input.venueOrMode || '').trim(),
      targetAudience: String(input.targetAudience || '').trim(),
      seoTitle: String(input.seoTitle || `${titleEn} — GOVEDA Foundation`).trim(),
      seoDescription: String(input.seoDescription || input.summaryEn || '').trim(),
      media,
      roles: Array.isArray(input.roles) ? input.roles : [],
      updatedAt: now,
    };

    if (idx >= 0) {
      blueprintState.programmes[idx] = record;
    } else {
      blueprintState.programmes.unshift(record);
    }
    void syncBlueprintToPostgres();
    return record;
  },

  deleteProgramme(id: string): UnifiedProgrammeRecord | null {
    const idx = blueprintState.programmes.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const [deleted] = blueprintState.programmes.splice(idx, 1);
    // Detach any direct children safely so no orphan references crash tree rendering
    for (const p of blueprintState.programmes) {
      if (p.parentId === id) {
        p.parentId = null;
      }
    }
    void syncBlueprintToPostgres();
    return deleted;
  },

  async hydrateFromDatabase(): Promise<void> {
    if (!isDatabaseConfigured || blueprintHydratedFromDb) return;
    blueprintHydratedFromDb = true;
    try {
      const rows = await db
        .select()
        .from(cmsBlueprintState)
        .where(eq(cmsBlueprintState.id, 'default'))
        .limit(1);
      const saved = rows[0]?.payload as Partial<AdminBlueprintPayload> | undefined;
      if (saved && typeof saved === 'object') {
        if (Array.isArray(saved.homepageSections) && saved.homepageSections.length > 0) {
          blueprintState.homepageSections = saved.homepageSections;
        }
        if (Array.isArray(saved.staticPages)) {
          blueprintState.staticPages = saved.staticPages;
        }
        if (Array.isArray(saved.missionConfigs) && saved.missionConfigs.length > 0) {
          blueprintState.missionConfigs = saved.missionConfigs;
        }
        if (Array.isArray(saved.wasteRecords)) {
          blueprintState.wasteRecords = saved.wasteRecords;
        }
        if (Array.isArray(saved.wastePartners)) {
          blueprintState.wastePartners = saved.wastePartners;
        }
        if (Array.isArray(saved.programmes) && saved.programmes.length > 0) {
          blueprintState.programmes = saved.programmes;
        }
        if (saved.founderMessage && typeof saved.founderMessage === 'object') {
          blueprintState.founderMessage = {
            ...buildInitialFounderMessage(),
            ...saved.founderMessage,
          };
        }
      }
    } catch {
      // Remain cleanly on seeded in-memory Blueprint state
    }
  },

  persistAsync(): void {
    void syncBlueprintToPostgres();
  },

  /**
   * Publicly sanitized Blueprint CMS payload:
   * - Exposes ordered homepage sections
   * - Exposes ONLY Published static pages & Published mission configs
   * - Exposes ONLY Published unified programmes (with only isPublic media)
   * - Exposes ONLY Verified/Published & Public waste records (unverified weighments stay private)
   * - Exposes ONLY Active recycling/SHG partners
   * - Exposes Founder Message Manager settings
   */
  getPublicBlueprintPayload(): AdminBlueprintPayload {
    return {
      homepageSections: [...blueprintState.homepageSections].sort(
        (a, b) => a.displayOrder - b.displayOrder
      ),
      staticPages: blueprintState.staticPages
        .filter((p) => p.status === 'Published')
        .sort((a, b) => a.navOrder - b.navOrder),
      missionConfigs: blueprintState.missionConfigs
        .filter((m) => m.status === 'Published')
        .sort((a, b) => a.number - b.number),
      wasteRecords: blueprintState.wasteRecords.filter(
        (w) =>
          w.isPublic === true &&
          (w.verificationStatus === 'Verified' || w.verificationStatus === 'Published')
      ),
      wastePartners: blueprintState.wastePartners.filter((p) => p.status === 'Active'),
      programmes: blueprintState.programmes
        .filter((p) => p.publicationStatus === 'Published')
        .map((p) => ({
          ...p,
          media: p.media.filter((m) => m.isPublic !== false),
        })),
      founderMessage: blueprintState.founderMessage
        ? { ...blueprintState.founderMessage }
        : buildInitialFounderMessage(),
    };
  },
};


