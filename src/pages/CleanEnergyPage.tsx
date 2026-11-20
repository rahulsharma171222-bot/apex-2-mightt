import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Flame,
  Handshake,
  MapPin,
  ShieldCheck,
  Sprout,
  Sun,
  Users,
  Wind,
} from 'lucide-react';
import {
  InteractiveProcessDiagram,
  ConceptMiniIcon,
  type DiagramHotspot,
  type DiagramFlowPath,
} from '../components/CleanEnergyInteractiveDiagrams';
import { EditorialSectionHeader, EditorialSafeguardCallout } from '../components/MissionEditorialShell';
import { ResilientImage } from '../components/ResilientImage';
import { usePublicPortal } from '../context/PublicPortalContext';
import { filterUnifiedProgrammes } from '../utils/adminLogic';
import type { Language, RegistrationRecord } from '../types/goveda';

interface CleanEnergyPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

/* ============================================================================
   EDITABLE INTERACTIVE DIAGRAM DATASETS (Bilingual Hindi + English)
   Structured cleanly so every label can be edited via CMS or config later.
   ============================================================================ */

const ECOSYSTEM_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'eco-gaushala',
    number: '01',
    x: 195,
    y: 195,
    color: '#76523A',
    hiTitle: 'गौशाला और जैविक फीडस्टॉक संग्रह',
    enTitle: 'Gaushala & Organic Feedstock',
    hiShort: 'गाय का गोबर और उपयुक्त सड़ने वाला जैविक कचरा साफ-सुथरे तरीके से एकत्र होता है।',
    enShort: 'Cattle dung and suitable biodegradable farm/kitchen waste are collected cleanly at source.',
    hiInput: 'गोबर व उपयुक्त जैविक अपशिष्ट',
    enInput: 'Cattle dung & suitable organics',
    hiProcess: 'पत्थर-प्लास्टिक अलग कर फीडिंग पिट में तैयारी',
    enProcess: 'Sorting & preparing clean slurry mix',
    hiOutput: 'डाइजेस्टर योग्य जैविक फीडस्टॉक',
    enOutput: 'Digester-ready organic feedstock',
    hiUse: 'बायोगैस संयंत्र के लिए नियमित कच्चा माल',
    enUse: 'Steady daily feed for anaerobic digester',
  },
  {
    id: 'eco-digester',
    number: '02',
    x: 420,
    y: 145,
    color: '#17834D',
    hiTitle: 'ऑक्सीजन-रहित बायोगैस डाइजेस्टर',
    enTitle: 'Anaerobic Biogas Digester',
    hiShort: 'बंद टैंक में प्राकृतिक सूक्ष्मजीव गोबर व जैविक कचरे को बायोगैस और जैव-स्लरी में बदलते हैं।',
    enShort: 'Inside a sealed airtight chamber, natural microbes convert organic slurry into raw biogas and digestate.',
    hiInput: 'पानी मिश्रित जैविक घोल (Slurry)',
    enInput: 'Water-mixed organic slurry',
    hiProcess: 'ऑक्सीजन-रहित किण्वन (Anaerobic Digestion)',
    enProcess: 'Sealed anaerobic microbial digestion',
    hiOutput: 'कच्ची बायोगैस (CH₄ + CO₂) व पोषक स्लरी',
    enOutput: 'Raw biogas & nutrient-rich digestate',
    hiUse: 'सीधा रसोई ईंधन या CBG शुद्धिकरण इकाई',
    enUse: 'Direct clean cooking fuel or CBG upgrading',
  },
  {
    id: 'eco-kitchen',
    number: '03',
    x: 165,
    y: 355,
    color: '#17834D',
    hiTitle: 'बायोगैस रसोई व स्थानीय ऊर्जा उपयोग',
    enTitle: 'Local Biogas Cooking & Power',
    hiShort: 'कंडीशन की हुई बायोगैस पाइपलाइन से रसोई चूल्हे और उपयुक्त स्थानीय जनरेटर तक पहुँचती है।',
    enShort: 'Conditioned biogas flows safely through dedicated pipes to smokeless stoves and compatible generators.',
    hiInput: 'नमी-रहित स्वच्छ बायोगैस',
    enInput: 'Moisture-trapped biogas',
    hiProcess: 'नियंत्रित दबाव और सुरक्षित बर्नर दहन',
    enProcess: 'Regulated safe low-pressure combustion',
    hiOutput: 'धुआँ-रहित रसोई लौ व स्थानीय बिजली/ताप',
    enOutput: 'Smokeless thermal energy & local power',
    hiUse: 'ग्रामीण घर, सामुदायिक रसोई व गौशाला परिसर',
    enUse: 'Village kitchens, schools & Gaushala utilities',
  },
  {
    id: 'eco-cbg',
    number: '04',
    x: 465,
    y: 280,
    color: '#0F766E',
    hiTitle: 'गैस शुद्धिकरण एवं CBG भंडारण',
    enTitle: 'Gas Upgrading & CBG Cascade',
    hiShort: 'अशुद्धियाँ व CO₂ हटाकर शुद्ध मीथेन गैस को सुरक्षित उच्च-दाब सिलेंडरों में संपीड़ित किया जाता है।',
    enShort: 'Raw biogas is scrubbed of impurities and CO₂, quality-tested, and compressed into industrial CBG cascades.',
    hiInput: 'कच्ची बायोगैस (बड़े संयंत्र स्तर पर)',
    enInput: 'Raw biogas at cluster/plant scale',
    hiProcess: 'शुद्धिकरण (Scrubbing), सुखाना व संपीड़न',
    enProcess: 'Upgrading, drying & multi-stage compression',
    hiOutput: 'कॉम्प्रेस्ड बायोगैस (CBG)',
    enOutput: 'Compressed Biogas (CBG)',
    hiUse: 'उपयुक्त परिवहन, औद्योगिक व ऑफटेक ईंधन',
    enUse: 'Approved clean fuel & commercial offtake',
  },
  {
    id: 'eco-slurry',
    number: '05',
    x: 460,
    y: 430,
    color: '#76523A',
    hiTitle: 'जैव-स्लरी प्रसंस्करण एवं खेतों को खाद',
    enTitle: 'Digestate Fertiliser → Farms',
    hiShort: 'डाइजेस्टर से निकली उपचारित जैव-स्लरी सुखाकर या कम्पोस्ट बनाकर खेतों की मिट्टी को उपजाऊ बनाती है।',
    enShort: 'Treated digestate leaving the digester is processed into organic soil fertiliser returning nutrients to fields.',
    hiInput: 'उपचारित बायोगैस स्लरी (Digestate)',
    enInput: 'Digested bio-slurry',
    hiProcess: 'सुरक्षित सुखाना, कम्पोस्टिंग व गुणवत्ता जाँच',
    enProcess: 'Safe dewatering, composting & quality checks',
    hiOutput: 'जैविक खाद एवं मृदा पोषक तत्व',
    enOutput: 'Nutrient-rich organic manure',
    hiUse: 'आसपास के खेतों में मिट्टी स्वास्थ्य सुधार',
    enUse: 'Returning organic nutrients to village farms',
  },
  {
    id: 'eco-solar',
    number: '06',
    x: 755,
    y: 215,
    color: '#F3BD42',
    hiTitle: 'अलग और पूरक सौर ऊर्जा प्रणाली',
    enTitle: 'Distinct Solar Electricity Pathway',
    hiShort: 'सौर ऊर्जा एक स्वतंत्र विद्युत मार्ग है — सूर्य की रोशनी सीधे पैनल और इन्वर्टर के माध्यम से गाँव को बिजली देती है।',
    enShort: 'Solar power operates as a clean, distinct electrical pathway—converting sunlight directly into village electricity.',
    hiInput: 'सीधा सूर्य का प्रकाश (Solar Radiation)',
    enInput: 'Direct natural sunlight',
    hiProcess: 'फोटोवोल्टिक पैनल (DC) → इन्वर्टर (AC)',
    enProcess: 'PV panels (DC) → Inverter (AC)',
    hiOutput: 'स्वच्छ विद्युत (वैकल्पिक बैटरी के साथ)',
    enOutput: 'Clean AC electricity (optional battery)',
    hiUse: 'स्कूल, गौशाला, प्रकाश, पंखे व जल पंप',
    enUse: 'Schools, Gaushalas, lights, fans & pumps',
  },
];

const ECOSYSTEM_FLOWS: DiagramFlowPath[] = [
  {
    id: 'f-dung-digester',
    d: 'M 250 185 Q 325 140 382 145',
    color: '#76523A',
    relatedIds: ['eco-gaushala', 'eco-digester'],
  },
  {
    id: 'f-digester-kitchen',
    d: 'M 378 188 Q 275 265 198 332',
    color: '#17834D',
    relatedIds: ['eco-digester', 'eco-kitchen'],
  },
  {
    id: 'f-digester-cbg',
    d: 'M 442 185 Q 465 225 465 252',
    color: '#0F766E',
    relatedIds: ['eco-digester', 'eco-cbg'],
  },
  {
    id: 'f-digester-slurry',
    d: 'M 425 225 Q 410 340 445 405',
    color: '#76523A',
    relatedIds: ['eco-digester', 'eco-slurry'],
  },
  {
    id: 'f-sun-solar',
    d: 'M 915 70 Q 845 125 785 185',
    color: '#F3BD42',
    relatedIds: ['eco-solar'],
  },
  {
    id: 'f-solar-village',
    d: 'M 755 255 Q 810 330 890 360',
    color: '#29B6D8',
    relatedIds: ['eco-solar'],
  },
];

const SOLAR_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'sol-sun',
    number: '01',
    x: 108,
    y: 95,
    color: '#F3BD42',
    hiTitle: 'सूर्य का प्रकाश (Solar Radiation)',
    enTitle: 'Sunlight Reaching Panels',
    hiShort: 'राजस्थान में वर्ष के अधिकांश दिनों में उपलब्ध प्राकृतिक सौर विकिरण सीधे सोलर पैनलों पर पड़ता है।',
    enShort: 'Abundant natural solar radiation falls directly onto properly angled photovoltaic modules.',
    hiInput: 'प्राकृतिक सूर्य की किरणें',
    enInput: 'Natural daylight & solar irradiance',
    hiProcess: 'छाया-मुक्त दिशा और सही झुकाव पर प्रकाश संग्रह',
    enProcess: 'Shadow-free angled sunlight capture',
    hiOutput: 'फोटोवोल्टिक ऊर्जा सक्रियण',
    enOutput: 'Photovoltaic cell excitation',
    hiUse: 'छत (Rooftop) या ज़मीन पर लगे पैनल',
    enUse: 'Rooftop & ground-mounted arrays',
  },
  {
    id: 'sol-panels',
    number: '02',
    x: 525,
    y: 122,
    color: '#F3BD42',
    hiTitle: 'सोलर पैनल (DC विद्युत उत्पादन)',
    enTitle: 'Solar PV Panels (DC Electricity)',
    hiShort: 'पैनल के भीतर मौजूद फोटोवोल्टिक सेल सूर्य के प्रकाश को बिना शोर और बिना धुएँ के DC बिजली में बदलते हैं।',
    enShort: 'Photovoltaic cells inside each panel silently convert sunlight into Direct Current (DC) electricity.',
    hiInput: 'सौर विकिरण (Sunlight)',
    enInput: 'Solar radiation',
    hiProcess: 'फोटोवोल्टिक प्रभाव से इलेक्ट्रॉन प्रवाह',
    enProcess: 'Photovoltaic silicon conversion',
    hiOutput: 'डायरेक्ट करंट (DC) बिजली',
    enOutput: 'Direct Current (DC) power',
    hiUse: 'केबल द्वारा सीधे सोलर इन्वर्टर तक',
    enUse: 'Routed via insulated DC cables to inverter',
  },
  {
    id: 'sol-inverter',
    number: '03',
    x: 672,
    y: 315,
    color: '#29B6D8',
    hiTitle: 'सोलर इन्वर्टर (DC से AC रूपांतरण)',
    enTitle: 'Solar Inverter (DC to AC)',
    hiShort: 'इन्वर्टर पैनल से आने वाली DC बिजली को घरेलू व संस्थागत उपकरणों के योग्य सुरक्षित AC बिजली में बदलता है।',
    enShort: 'The inverter converts raw DC electricity into stable, usable AC electricity for everyday appliances.',
    hiInput: 'पैनल से प्राप्त DC बिजली',
    enInput: 'DC electricity from solar panels',
    hiProcess: 'वोल्टेज नियंत्रण, सुरक्षा व AC रूपांतरण',
    enProcess: 'MPPT optimisation & DC-to-AC conversion',
    hiOutput: 'उपयोग योग्य AC विद्युत',
    enOutput: 'Standard usable AC electricity',
    hiUse: 'डिस्ट्रीब्यूशन बोर्ड के ज़रिए भवन लोड तक',
    enUse: 'Supplied via distribution panel to loads',
  },
  {
    id: 'sol-loads',
    number: '04',
    x: 590,
    y: 230,
    color: '#29B6D8',
    hiTitle: 'ऊर्जा उपयोग (उपकरण एवं प्रकाश)',
    enTitle: 'Connected Appliances & Loads',
    hiShort: 'स्वच्छ AC बिजली से स्कूल, गौशाला, ग्रामीण घर या केंद्र में एलईडी लाइट, पंखे, कंप्यूटर व उपयुक्त जल पंप चलते हैं।',
    enShort: 'Usable AC power runs LED lighting, fans, classroom tools, and compatible water pumps inside the facility.',
    hiInput: 'नियंत्रित AC विद्युत आपूर्ति',
    enInput: 'Regulated AC electricity',
    hiProcess: 'सुरक्षित वायरिंग और लोड के अनुसार वितरण',
    enProcess: 'Balanced electrical load distribution',
    hiOutput: 'नियमित रोशनी, पंपिंग व कार्य क्षमता',
    enOutput: 'Reliable lighting, ventilation & pumping',
    hiUse: 'घर, विद्यालय, पंचायत व गौशाला परिसर',
    enUse: 'Homes, schools, community hubs & Gaushalas',
  },
  {
    id: 'sol-battery',
    number: '05',
    x: 795,
    y: 410,
    color: '#17834D',
    hiTitle: 'ऊर्जा भंडारण (वैकल्पिक बैटरी / ग्रिड)',
    enTitle: 'Optional Battery Storage & Grid Link',
    hiShort: 'आवश्यकता और बजट के अनुसार वैकल्पिक बैटरी बैंक (शाम के उपयोग हेतु) या लागू होने पर ग्रिड कनेक्शन जोड़ा जा सकता है।',
    enShort: 'Where installed, an optional battery bank stores surplus daytime power—or an approved grid tie exports/draws balance power.',
    hiInput: 'दिन में बची अतिरिक्त सौर बिजली',
    enInput: 'Surplus daytime solar electricity',
    hiProcess: 'वैकल्पिक बैटरी चार्जिंग या अनुमोदित नेट-मीटरिंग',
    enProcess: 'Optional battery storage or approved grid tie',
    hiOutput: 'बैकअप विद्युत या संतुलित ग्रिड आपूर्ति',
    enOutput: 'Evening backup power or grid balancing',
    hiUse: 'जहाँ निरंतर बिजली आवश्यक हो (पूर्णतः वैकल्पिक)',
    enUse: 'Optional add-on based on site feasibility',
  },
];

const SOLAR_FLOWS: DiagramFlowPath[] = [
  {
    id: 'sf-sun-roof',
    d: 'M 150 110 Q 320 95 480 118',
    color: '#F3BD42',
    relatedIds: ['sol-sun', 'sol-panels'],
  },
  {
    id: 'sf-roof-inv',
    d: 'M 575 142 Q 655 190 672 282',
    color: '#29B6D8',
    relatedIds: ['sol-panels', 'sol-inverter'],
  },
  {
    id: 'sf-inv-loads',
    d: 'M 650 302 Q 620 268 608 250',
    color: '#29B6D8',
    relatedIds: ['sol-inverter', 'sol-loads'],
  },
  {
    id: 'sf-inv-bat',
    d: 'M 695 345 Q 735 390 765 405',
    color: '#17834D',
    relatedIds: ['sol-inverter', 'sol-battery'],
  },
];

const BIOGAS_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'bg-feedstock',
    number: '01',
    x: 155,
    y: 165,
    color: '#76523A',
    hiTitle: 'चरण 1 — जैविक फीडस्टॉक संग्रह',
    enTitle: 'Stage 1 — Feedstock Collection',
    hiShort: 'गाय का ताज़ा गोबर और उपयुक्त सड़ने वाला जैविक कचरा (सब्जी/फल अवशेष) बिना प्लास्टिक के इकट्ठा किया जाता है।',
    enShort: 'Fresh cattle dung and suitable biodegradable food/organic material are collected free of plastic or grit.',
    hiInput: 'गोबर व उपयुक्त जैविक अपशिष्ट',
    enInput: 'Cattle dung & suitable organic waste',
    hiProcess: 'अशुद्धियाँ व प्लास्टिक अलग करना',
    enProcess: 'Pre-sorting to exclude plastics & stones',
    hiOutput: 'स्वच्छ जैविक कच्चा माल',
    enOutput: 'Clean biodegradable feedstock',
    hiUse: 'मिक्सिंग टैंक में डालने हेतु तैयार',
    enUse: 'Ready for slurry mixing chamber',
  },
  {
    id: 'bg-inlet',
    number: '02',
    x: 272,
    y: 225,
    color: '#76523A',
    hiTitle: 'चरण 2 — फीड तैयारी व इनलेट पाइप',
    enTitle: 'Stage 2 — Mixing & Inlet Pipe',
    hiShort: 'आवश्यकतानुसार पानी मिलाकर एकसमान घोल तैयार किया जाता है जो इनलेट पाइप से सीधे डाइजेस्टर के भीतर जाता है।',
    enShort: 'Feedstock is mixed with water to the right consistency and fed smoothly downward through the sealed inlet pipe.',
    hiInput: 'गोबर + उचित अनुपात में पानी',
    enInput: 'Feedstock + balanced water ratio',
    hiProcess: 'एकसमान घोल बनाना और पाइप से प्रवेश',
    enProcess: 'Homogenised slurry mixing & feeding',
    hiOutput: 'प्रवाह-योग्य जैविक घोल',
    enOutput: 'Uniform organic slurry',
    hiUse: 'डाइजेस्टर के निचले कक्ष में प्रवेश',
    enUse: 'Enters lower anaerobic chamber',
  },
  {
    id: 'bg-digester',
    number: '03',
    x: 495,
    y: 350,
    color: '#17834D',
    hiTitle: 'चरण 3 — ऑक्सीजन-रहित पाचन (Anaerobic Digestion)',
    enTitle: 'Stage 3 — Sealed Anaerobic Digester',
    hiShort: 'बंद कक्ष के भीतर बिना हवा के प्राकृतिक सूक्ष्मजीव घोल को पचाते हैं — नीचे स्लरी रहती है और ऊपर स्वच्छ बायोगैस के बुलबुले जमा होते हैं।',
    enShort: 'Inside the airtight cutaway chamber, anaerobic microbes break down slurry—releasing biogas bubbles that rise cleanly into the upper gas dome.',
    hiInput: 'बंद कक्ष में जैविक स्लरी',
    enInput: 'Organic slurry inside sealed tank',
    hiProcess: 'ऑक्सीजन-रहित सूक्ष्मजीव किण्वन',
    enProcess: 'Natural microbial anaerobic breakdown',
    hiOutput: 'ऊपरी गुंबद में बायोगैस · नीचे उपचारित स्लरी',
    enOutput: 'Biogas in dome · Digestate below',
    hiUse: 'गैस और खाद का स्पष्ट पृथक्करण',
    enUse: 'Clean separation of gas and manure',
  },
  {
    id: 'bg-pipe',
    number: '04',
    x: 615,
    y: 140,
    color: '#17834D',
    hiTitle: 'चरण 4 — गैस संग्रह, वाल्व और मॉइस्चर ट्रैप',
    enTitle: 'Stage 4 — Gas Collection & Conditioning',
    hiShort: 'गुंबद के शीर्ष से लीक-प्रूफ वाल्व और मॉइस्चर ट्रैप (नमी हटाने वाले फ़िल्टर) के ज़रिए बायोगैस सुरक्षित पाइपलाइन में जाती है।',
    enShort: 'Accumulated gas exits through a leak-checked control valve and moisture trap before reaching end-use equipment.',
    hiInput: 'डाइजेस्टर गुंबद में संचित बायोगैस',
    enInput: 'Biogas from upper dome',
    hiProcess: 'रिसाव नियंत्रण, नमी व H₂S शुद्धिकरण',
    enProcess: 'Leak control, moisture trap & scrubbing',
    hiOutput: 'उपयोग हेतु सुरक्षित स्वच्छ बायोगैस',
    enOutput: 'Conditioned clean biogas',
    hiUse: 'सुरक्षित पाइपलाइन द्वारा उपकरणों तक',
    enUse: 'Piped safely to stove or generator',
  },
  {
    id: 'bg-use',
    number: '05',
    x: 818,
    y: 235,
    color: '#29B6D8',
    hiTitle: 'चरण 5 — बायोगैस का सुरक्षित उपयोग',
    enTitle: 'Stage 5 — Biogas Utilisation',
    hiShort: 'शुद्ध की हुई बायोगैस से धुआँ-रहित रसोई चूल्हा जलता है अथवा उपयुक्त कंडीशनिंग के साथ बायोगैस जनरेटर चलाया जा सकता है।',
    enShort: 'Biogas powers a clean blue-flame cooking burner or a compatible biogas generator with proper conditioning.',
    hiInput: 'नियंत्रित दबाव पर बायोगैस',
    enInput: 'Regulated clean biogas',
    hiProcess: 'उचित बर्नर या अनुकूल जनरेटर में उपयोग',
    enProcess: 'Clean combustion in stove / generator',
    hiOutput: 'धुआँ-रहित ताप और स्थानीय ऊर्जा',
    enOutput: 'Smokeless cooking heat & local power',
    hiUse: 'ग्रामीण रसोई, गौशाला व सामुदायिक केंद्र',
    enUse: 'Rural kitchens, Gaushalas & institutions',
  },
  {
    id: 'bg-slurry',
    number: '06',
    x: 765,
    y: 425,
    color: '#76523A',
    hiTitle: 'चरण 6 — डाइजेस्टेट (जैव-स्लरी) प्रबंधन',
    enTitle: 'Stage 6 — Digestate & Fertiliser Use',
    hiShort: 'आउटलेट से निकली उपचारित जैव-स्लरी सुखाने की क्यारी में एकत्र होकर खेती के लिए पोषक जैविक खाद बनती है।',
    enShort: 'Nutrient-rich digestate flows out into drying/compost beds for safe agricultural nutrient management.',
    hiInput: 'पाचन के बाद निकली तरल जैव-स्लरी',
    enInput: 'Digested nutrient-rich slurry',
    hiProcess: 'सुखाना, कम्पोस्टिंग और गुणवत्ता जाँच',
    enProcess: 'Safe drying, composting & testing',
    hiOutput: 'पोषक जैविक खाद (Bio-Slurry Manure)',
    enOutput: 'Safe organic soil amendment',
    hiUse: 'खेतों में मिट्टी की उर्वरता बढ़ाने हेतु',
    enUse: 'Applied to local farm fields',
  },
];

const BIOGAS_FLOWS: DiagramFlowPath[] = [
  {
    id: 'bf-in',
    d: 'M 190 190 L 345 355',
    color: '#76523A',
    relatedIds: ['bg-feedstock', 'bg-inlet', 'bg-digester'],
  },
  {
    id: 'bf-gas-up',
    d: 'M 495 315 L 495 145 L 590 140',
    color: '#17834D',
    relatedIds: ['bg-digester', 'bg-pipe'],
  },
  {
    id: 'bf-gas-use',
    d: 'M 642 145 Q 710 155 752 225',
    color: '#29B6D8',
    relatedIds: ['bg-pipe', 'bg-use'],
  },
  {
    id: 'bf-slurry',
    d: 'M 665 362 Q 725 370 755 405',
    color: '#76523A',
    relatedIds: ['bg-digester', 'bg-slurry'],
  },
];

/* CBG image is cropped cleanly to top 74% (viewBox 1000×416) so ZERO baked captions appear */
const CBG_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'cbg-01',
    number: '01',
    x: 102,
    y: 270,
    color: '#76523A',
    hiTitle: 'जैविक फीडस्टॉक रिसेप्शन',
    enTitle: 'Organic Feedstock Reception',
    hiShort: 'बड़े पैमाने पर गोबर व उपयुक्त कृषि-जैविक सामग्री को तौलकर और छानकर फीडिंग पंप से डाइजेस्टर में भेजा जाता है।',
    enShort: 'Assessed cattle dung and suitable organic biomass enter a covered reception hopper and feed pump.',
    hiInput: 'सर्वेक्षित गोबर व जैविक फीडस्टॉक',
    enInput: 'Surveyed dung & organic biomass',
    hiProcess: 'सफाई, मिश्रण और नियंत्रित पंपिंग',
    enProcess: 'Screening, blending & controlled feeding',
    hiOutput: 'नियमित औद्योगिक फीड प्रवाह',
    enOutput: 'Consistent digester feed stream',
    hiUse: 'डाइजेस्टर टैंक को निरंतर आपूर्ति',
    enUse: 'Steady supply to large digester',
  },
  {
    id: 'cbg-02',
    number: '02',
    x: 248,
    y: 195,
    color: '#17834D',
    hiTitle: 'बायोगैस उत्पादन (Anaerobic Digestion)',
    enTitle: 'Raw Biogas Generation',
    hiShort: 'बड़े सीलबंद डाइजेस्टर में ऑक्सीजन-रहित पाचन से कच्ची बायोगैस बनती है (जिसमें मीथेन के साथ CO₂ व नमी होती है)।',
    enShort: 'Industrial anaerobic digestion generates raw biogas containing methane alongside CO₂, moisture, and trace H₂S.',
    hiInput: 'जैविक स्लरी (Organic Slurry)',
    enInput: 'Organic feedstock slurry',
    hiProcess: 'नियंत्रित तापमान पर ऑक्सीजन-रहित पाचन',
    enProcess: 'Temperature-controlled digestion',
    hiOutput: 'कच्ची बायोगैस (लगभग 55–60% मीथेन)',
    enOutput: 'Raw biogas (~55–60% CH₄)',
    hiUse: 'सीधे सिलेंडर में नहीं — शुद्धिकरण इकाई में',
    enUse: 'Sent to upgrading unit (never bottled raw)',
  },
  {
    id: 'cbg-03',
    number: '03',
    x: 418,
    y: 162,
    color: '#0F766E',
    hiTitle: 'गैस शुद्धिकरण एवं अपग्रेडिंग (Scrubbing)',
    enTitle: 'Gas Cleaning & Upgrading',
    hiShort: 'स्क्रबिंग और अपग्रेडिंग टॉवर कच्ची बायोगैस से कार्बन डाइऑक्साइड (CO₂), H₂S और नमी को हटाकर उच्च-मीथेन गैस बनाते हैं।',
    enShort: 'Industrial scrubbing and upgrading columns remove CO₂, H₂S, and moisture to produce high-purity methane.',
    hiInput: 'कच्ची बायोगैस',
    enInput: 'Raw biogas',
    hiProcess: 'CO₂, H₂S व नमी का वैज्ञानिक पृथक्करण',
    enProcess: 'Chemical/membrane/PSA upgrading',
    hiOutput: 'उच्च-शुद्धता मीथेन गैस (Upgraded Biomethane)',
    enOutput: 'Methane-rich upgraded biomethane',
    hiUse: 'गुणवत्ता जाँच और संपीड़न हेतु तैयार',
    enUse: 'Forwarded to quality verification',
  },
  {
    id: 'cbg-04',
    number: '04',
    x: 585,
    y: 268,
    color: '#29B6D8',
    hiTitle: 'गैस गुणवत्ता व सुरक्षा जाँच',
    enTitle: 'Gas Quality & Safety Checks',
    hiShort: 'संपीड़न से पहले स्वचालित सेंसर और एनालाइज़र मीथेन शुद्धता, नमी और दबाव सुरक्षा मानकों की पुष्टि करते हैं।',
    enShort: 'Automated analysers, dryers, and safety manifolds verify methane purity, dew point, and pressure limits before compression.',
    hiInput: 'शुद्ध की गई बायोमीथेन गैस',
    enInput: 'Upgraded biomethane',
    hiProcess: 'निरंतर शुद्धता मॉनिटरिंग व सुरक्षा परीक्षण',
    enProcess: 'Continuous analyser & safety interlock checks',
    hiOutput: 'मानक-अनुरूप सुरक्षित बायोमीथेन',
    enOutput: 'Standard-compliant clean biomethane',
    hiUse: 'उच्च-दाब कंप्रेसर में सुरक्षित प्रवेश',
    enUse: 'Cleared for high-pressure compression',
  },
  {
    id: 'cbg-05',
    number: '05',
    x: 735,
    y: 185,
    color: '#0F766E',
    hiTitle: 'संपीड़न (Compression) एवं कैस्केड भंडारण',
    enTitle: 'Compression & Cascade Storage',
    hiShort: 'औद्योगिक मल्टी-स्टेज कंप्रेसर शुद्ध गैस को सुरक्षित उच्च दाब पर संपीड़ित कर प्रमाणित CBG सिलेंडर कैस्केड में भरता है।',
    enShort: 'Multi-stage industrial compressors pressurise upgraded gas into certified high-pressure CBG cylinder cascades.',
    hiInput: 'मानक-परीक्षित बायोमीथेन',
    enInput: 'Quality-verified biomethane',
    hiProcess: 'मल्टी-स्टेज औद्योगिक संपीड़न व शीतलन',
    enProcess: 'Multi-stage high-pressure compression',
    hiOutput: 'कॉम्प्रेस्ड बायोगैस (CBG Cascade)',
    enOutput: 'Stored Compressed Biogas (CBG)',
    hiUse: 'स्वीकृत ऑफटेक व वितरण हेतु भंडारण',
    enUse: 'Safe canopy storage awaiting dispatch',
  },
  {
    id: 'cbg-06',
    number: '06',
    x: 892,
    y: 225,
    color: '#123D2A',
    hiTitle: 'CBG वितरण एवं स्वच्छ ईंधन उपयोग',
    enTitle: 'CBG Distribution & Utilisation',
    hiShort: 'प्रमाणित कैस्केड ट्रक या डिस्पेंसर के माध्यम से CBG को उपयुक्त परिवहन, औद्योगिक ऊर्जा या गैस नेटवर्क तक पहुँचाया जाता है।',
    enShort: 'Approved cascade trucks or dispensing units deliver CBG to suitable clean-fuel transport, industrial, or offtake users.',
    hiInput: 'प्रमाणित CBG सिलेंडर कैस्केड',
    enInput: 'Certified CBG storage cascades',
    hiProcess: 'सुरक्षित वितरण और ऑफटेक समझौता',
    enProcess: 'Regulated dispensing & offtake logistics',
    hiOutput: 'स्वच्छ नवीकरणीय गैसीय ईंधन',
    enOutput: 'Clean renewable gaseous fuel',
    hiUse: 'उपयुक्त वाहन, उद्योग व स्वच्छ ईंधन नेटवर्क',
    enUse: 'Suitable transport & industrial fuel uses',
  },
];

const CBG_FLOWS: DiagramFlowPath[] = [
  { id: 'cf-1', d: 'M 140 270 Q 175 245 205 215', color: '#76523A', relatedIds: ['cbg-01', 'cbg-02'] },
  { id: 'cf-2', d: 'M 288 182 Q 345 148 380 158', color: '#17834D', relatedIds: ['cbg-02', 'cbg-03'] },
  { id: 'cf-3', d: 'M 465 162 Q 535 190 568 242', color: '#0F766E', relatedIds: ['cbg-03', 'cbg-04'] },
  { id: 'cf-4', d: 'M 622 260 Q 675 235 705 202', color: '#29B6D8', relatedIds: ['cbg-04', 'cbg-05'] },
  { id: 'cf-5', d: 'M 775 182 Q 830 190 865 212', color: '#0F766E', relatedIds: ['cbg-05', 'cbg-06'] },
];

const CIRCULAR_HOTSPOTS: DiagramHotspot[] = [
  {
    id: 'cir-center',
    number: '01',
    x: 495,
    y: 278,
    color: '#123D2A',
    hiTitle: 'केंद्र: गौशाला एवं हरित ग्रामीण परिसर',
    enTitle: 'Core: Gaushala & Village Farmland',
    hiShort: 'गाँव की गौशाला और आसपास के खेत इस पूरे चक्रीय ग्रामीण ऊर्जा मॉडल के केंद्र में हैं।',
    enShort: 'The local Gaushala and surrounding agricultural fields sit at the heart of the circular rural resource model.',
  },
  {
    id: 'cir-feed',
    number: '02',
    x: 495,
    y: 112,
    color: '#76523A',
    hiTitle: 'पशुधन एवं जैविक संसाधन संग्रह',
    enTitle: 'Cattle & Organic Resource Collection',
    hiShort: 'गोबर और उपयुक्त कृषि अवशेष बिना बर्बादी के नियमित रूप से संकलित होते हैं।',
    enShort: 'Cattle dung and suitable agricultural biomass are collected cleanly instead of being left unmanaged.',
  },
  {
    id: 'cir-digester',
    number: '03',
    x: 695,
    y: 158,
    color: '#17834D',
    hiTitle: 'ऑक्सीजन-रहित बायोगैस पाचन',
    enTitle: 'Anaerobic Biogas Digestion',
    hiShort: 'बंद डाइजेस्टर जैविक संसाधनों को स्वच्छ बायोगैस और उपचारित स्लरी में बदलता है।',
    enShort: 'Sealed digestion converts collected feedstock into renewable biogas and treated organic digestate.',
  },
  {
    id: 'cir-cbg',
    number: '04',
    x: 775,
    y: 295,
    color: '#0F766E',
    hiTitle: 'बायोगैस / CBG स्वच्छ ऊर्जा उपयोग',
    enTitle: 'Biogas & CBG Clean Energy Uses',
    hiShort: 'स्थानीय रसोई व ऊर्जा उपयोग या बड़े स्तर पर व्यवहार्य होने पर शुद्धिकृत CBG का उत्पादन।',
    enShort: 'Used locally for clean cooking/power, or upgraded to CBG where cluster scale and feasibility permit.',
  },
  {
    id: 'cir-compost',
    number: '05',
    x: 645,
    y: 438,
    color: '#76523A',
    hiTitle: 'डाइजेस्टेट एवं जैविक खाद प्रबंधन',
    enTitle: 'Digestate & Organic Fertiliser Beds',
    hiShort: 'स्लरी का सुरक्षित प्रसंस्करण कर गुणवत्तापूर्ण जैविक खाद तैयार की जाती है।',
    enShort: 'Treated digestate is safely processed into nutrient-rich organic compost for local agriculture.',
  },
  {
    id: 'cir-crops',
    number: '06',
    x: 265,
    y: 350,
    color: '#75B843',
    hiTitle: 'उपजाऊ मिट्टी, फसल और हरा चारा',
    enTitle: 'Healthy Soil, Crops & Fodder Return',
    hiShort: 'जैविक खाद मिट्टी को सशक्त बनाती है — जिससे स्वस्थ फसल व पौष्टिक चारा पुनः गाँव व गौशाला तक लौटता है।',
    enShort: 'Organic nutrients rebuild soil fertility, supporting healthy crops and fodder that cycle back to the village.',
  },
  {
    id: 'cir-solar',
    number: '07',
    x: 235,
    y: 105,
    color: '#F3BD42',
    hiTitle: 'अलग एवं पूरक सौर विद्युत प्रणाली',
    enTitle: 'Complementary Separate Solar Power',
    hiShort: 'सौर ऊर्जा एक स्वतंत्र विद्युत प्रणाली के रूप में परिसर की रोशनी, पंपिंग और मशीनरी को स्वच्छ बिजली देती है।',
    enShort: 'Rooftop solar operates independently alongside the bio-cycle, supplying clean electricity to village buildings and pumps.',
  },
];

const CIRCULAR_FLOWS: DiagramFlowPath[] = [
  { id: 'cr-1', d: 'M 548 112 Q 625 118 668 142', color: '#76523A', relatedIds: ['cir-feed', 'cir-digester'] },
  { id: 'cr-2', d: 'M 730 188 Q 765 232 775 268', color: '#17834D', relatedIds: ['cir-digester', 'cir-cbg'] },
  { id: 'cr-3', d: 'M 758 338 Q 722 400 676 425', color: '#0F766E', relatedIds: ['cir-cbg', 'cir-compost'] },
  { id: 'cr-4', d: 'M 588 448 Q 405 462 302 385', color: '#76523A', relatedIds: ['cir-compost', 'cir-crops'] },
  { id: 'cr-5', d: 'M 255 298 Q 275 162 452 118', color: '#75B843', relatedIds: ['cir-crops', 'cir-feed'] },
  { id: 'cr-solar', d: 'M 278 135 Q 355 185 435 235', color: '#F3BD42', relatedIds: ['cir-solar', 'cir-center'] },
];

const SIX_BIOGAS_SAFEGUARDS = [
  {
    num: '01',
    hiTitle: 'उपयुक्त फीडस्टॉक',
    enTitle: 'Suitable Organic Feedstock',
    hiDesc: 'केवल प्लास्टिक-रहित और उचित जैविक सामग्री का ही उपयोग ताकि पाचन प्रक्रिया स्थिर रहे।',
    enDesc: 'Only clean, plastic-free biodegradable feedstock is fed so anaerobic digestion remains stable.',
  },
  {
    num: '02',
    hiTitle: 'सही संयंत्र संचालन',
    enTitle: 'Proper Plant Operation',
    hiDesc: 'नियमित फीडिंग अनुपात, तापमान संतुलन और प्रशिक्षित देखरेख से संयंत्र सुरक्षित चलता है।',
    enDesc: 'Consistent feeding ratios, structural upkeep, and trained supervision keep digesters dependable.',
  },
  {
    num: '03',
    hiTitle: 'मीथेन रिसाव नियंत्रण',
    enTitle: 'Strict Methane Leak Control',
    hiDesc: 'वाल्व, पाइप और सील की नियमित जाँच अनिवार्य है — क्योंकि बिना जले मीथेन का रिसाव पर्यावरण के लिए हानिकारक है।',
    enDesc: 'Routine valve, seal, and pipe inspections are mandatory—unburned methane leakage harms the climate.',
  },
  {
    num: '04',
    hiTitle: 'स्लरी का सुरक्षित प्रबंधन',
    enTitle: 'Safe Slurry Management',
    hiDesc: 'उपचारित डाइजेस्टेट को जल स्रोतों से दूर सुरक्षित क्यारियों में सुखाकर खेती की खाद बनाया जाता है।',
    enDesc: 'Treated digestate is managed safely away from water bodies and converted into quality farm manure.',
  },
  {
    num: '05',
    hiTitle: 'गैस का सुनिश्चित उपयोग',
    enTitle: 'Assured Gas Utilisation',
    hiDesc: 'बनी हुई बायोगैस का नियमित रसोई, तापीय या ऊर्जा उपयोग तय किया जाता है ताकि गैस व्यर्थ न जाए।',
    enDesc: 'Generated gas must match reliable daily cooking, heating, or power demand rather than venting unused.',
  },
  {
    num: '06',
    hiTitle: 'वास्तविक उत्सर्जन आकलन',
    enTitle: 'Honest Emissions Assessment',
    hiDesc: 'पर्यावरणीय लाभ का आकलन वास्तविक मापन पर आधारित होगा — बिना सत्यापन के कोई उत्सर्जन दावा नहीं।',
    enDesc: 'Climate benefits are assessed through real measurement—never claimed automatically without verification.',
  },
];

const POTENTIAL_BENEFITS = [
  {
    kind: 'solar' as const,
    hiTitle: 'नवीकरणीय ऊर्जा के व्यावहारिक अवसर',
    enTitle: 'Renewable Energy Opportunities',
    hiDesc: 'गाँवों, विद्यालयों और संस्थागत परिसरों में सूर्य के प्रकाश व स्थानीय जैविक संसाधनों से स्वच्छ ऊर्जा अपनाने की संभावना।',
    enDesc: 'Practical pathways for villages, schools, and community institutions to adopt clean solar and bio-energy.',
  },
  {
    kind: 'biogas' as const,
    hiTitle: 'जैविक संसाधनों का उत्पादक उपयोग',
    enTitle: 'Productive Use of Organic Resources',
    hiDesc: 'गोबर और उपयुक्त सड़ने वाले जैविक कचरे को खुले ढेर में छोड़ने के बजाय स्वच्छ ऊर्जा और उपयोगी संसाधन में बदलना।',
    enDesc: 'Turning cattle dung and suitable biodegradable waste into useful clean fuel rather than unmanaged heaps.',
  },
  {
    kind: 'research' as const,
    hiTitle: 'गौशाला आत्मनिर्भरता में संभावित सहयोग',
    enTitle: 'Potential Support for Gaushala Self-Reliance',
    hiDesc: 'तकनीकी व्यवहार्यता के आधार पर गौशालाओं में स्वच्छ ऊर्जा और खाद प्रबंधन से संचालन क्षमता को सहयोग मिल सकता है।',
    enDesc: 'Where technically feasible, biogas and compost systems can help strengthen long-term Gaushala operations.',
  },
  {
    kind: 'slurry' as const,
    hiTitle: 'डाइजेस्टेट एवं कृषि पोषण प्रबंधन',
    enTitle: 'Digestate & Soil Nutrient Management',
    hiDesc: 'बायोगैस संयंत्र से प्राप्त उपचारित जैव-स्लरी को सुरक्षित तरीके से खेतों के पोषण और मिट्टी स्वास्थ्य सुधार में उपयोग करना।',
    enDesc: 'Safely processing digester slurry to return organic nutrients to nearby agricultural soils.',
  },
  {
    kind: 'safety' as const,
    hiTitle: 'ग्रामीण तकनीकी कौशल एवं रोजगार अवसर',
    enTitle: 'Rural Technical Skills & Livelihoods',
    hiDesc: 'सोलर रखरखाव, बायोगैस संचालन, सुरक्षा निरीक्षण और खाद प्रबंधन में स्थानीय युवाओं के लिए सीखने व काम के नए अवसर।',
    enDesc: 'Opening practical skill pathways for rural youth in solar maintenance, digester operation, and safety checks.',
  },
  {
    kind: 'cbg' as const,
    hiTitle: 'पारंपरिक ईंधनों पर निर्भरता में संभावित कमी',
    enTitle: 'Reduced Reliance on Conventional Fuels',
    hiDesc: 'जहाँ उपयुक्त और व्यावहारिक हो, वहाँ लकड़ी, कोयला या डीजल जैसे पारंपरिक ईंधनों का स्वच्छ विकल्प उपलब्ध कराना।',
    enDesc: 'Offering cleaner local alternatives to firewood, diesel, or conventional fuels wherever site conditions fit.',
  },
];

const LEARNING_MODULES = [
  {
    kind: 'solar' as const,
    hiTitle: 'सौर प्रणाली जागरूकता',
    enTitle: 'Solar System Awareness',
    hiDesc: 'सही क्षमता चयन, छाया-मुक्त छत मूल्यांकन, इन्वर्टर समझ और पैनल की सुरक्षित सफाई।',
    enDesc: 'Right-sizing rooftop solar, shade checks, inverter basics, and safe panel upkeep.',
  },
  {
    kind: 'biogas' as const,
    hiTitle: 'बायोगैस संयंत्र संचालन',
    enTitle: 'Biogas Plant Operation',
    hiDesc: 'दैनिक गोबर-पानी अनुपात, गैस प्रेशर समझ और घरेलू व गौशाला संयंत्र का नियमित संचालन।',
    enDesc: 'Daily dung-to-water ratios, pressure monitoring, and dependable household/Gaushala operation.',
  },
  {
    kind: 'cbg' as const,
    hiTitle: 'CBG तकनीक परिचय',
    enTitle: 'CBG Technology Introduction',
    hiDesc: 'गैस शुद्धिकरण, संपीड़न, फीडस्टॉक लॉजिस्टिक्स और ऑफटेक व्यवस्था की वैज्ञानिक समझ।',
    enDesc: 'Clear introduction to scrubbing, compression, feedstock supply chains, and commercial offtake.',
  },
  {
    kind: 'safety' as const,
    hiTitle: 'उपकरण एवं गैस सुरक्षा',
    enTitle: 'Equipment & Gas Safety',
    hiDesc: 'मीथेन रिसाव जाँच, वेंटिलेशन, इलेक्ट्रिकल अर्थिंग और आपातकालीन शट-ऑफ प्रोटोकॉल।',
    enDesc: 'Methane leak checks, ventilation, electrical earthing, and emergency shut-off standards.',
  },
  {
    kind: 'slurry' as const,
    hiTitle: 'जैविक संसाधन व स्लरी प्रबंधन',
    enTitle: 'Organic Resource & Slurry Care',
    hiDesc: 'फीडस्टॉक छंटाई, जैव-स्लरी कम्पोस्टिंग और गुणवत्तापूर्ण जैविक खाद तैयारी।',
    enDesc: 'Clean feedstock sorting, digestate dewatering, and high-grade agricultural compost prep.',
  },
  {
    kind: 'research' as const,
    hiTitle: 'व्यवहार्यता एवं रखरखाव',
    enTitle: 'Feasibility & Maintenance',
    hiDesc: 'संयंत्र लगाने से पहले लागत-लाभ सर्वेक्षण, परिवहन गणित और दीर्घकालिक रखरखाव योजना।',
    enDesc: 'Pre-project feedstock surveys, transport cost modelling, and preventive maintenance planning.',
  },
];

const PARTICIPATION_OPTIONS = [
  {
    icon: Building2,
    route: '/join/gaushala',
    hiTitle: 'गौशाला सहभागिता',
    enTitle: 'Gaushala Participation',
    hiDesc: 'गौशाला आधारित बायोगैस, छत पर सोलर और जैव-स्लरी खाद व्यवहार्यता मूल्यांकन के लिए जुड़ें।',
    enDesc: 'Explore technical feasibility for Gaushala biogas digesters, rooftop solar, and bio-slurry.',
  },
  {
    icon: Sprout,
    route: '/join/farmer',
    hiTitle: 'किसान पूछताछ एवं पंजीकरण',
    enTitle: 'Farmer Enquiry & Onboarding',
    hiDesc: 'घरेलू बायोगैस जागरूकता, सोलर जानकारी और उपचारित जैव-स्लरी खाद उपयोग के लिए जुड़ें।',
    enDesc: 'Connect for household biogas guidance, solar awareness, and treated bio-slurry manure.',
  },
  {
    icon: Users,
    route: '/join/volunteer',
    hiTitle: 'तकनीकी विशेषज्ञ / प्रशिक्षक',
    enTitle: 'Technical Expert / Trainer',
    hiDesc: 'सोलर, बायोगैस, CBG इंजीनियरिंग या ग्रामीण सुरक्षा प्रशिक्षण में तकनीकी सहयोग दें।',
    enDesc: 'Contribute engineering review, feasibility mentoring, or rural safety training.',
  },
  {
    icon: BookOpen,
    route: '/join/ngo-institution',
    hiTitle: 'संस्थागत एवं शैक्षणिक सहयोग',
    enTitle: 'Institutional Collaboration',
    hiDesc: 'विद्यालयों, कॉलेजों, शोध संस्थानों व ग्राम पंचायतों के साथ स्वच्छ ऊर्जा अध्ययन व जागरूकता।',
    enDesc: 'Partner across schools, universities, research bodies, and Panchayats for clean-energy studies.',
  },
  {
    icon: Handshake,
    route: '/join/csr',
    hiTitle: 'CSR एवं परियोजना साझेदारी',
    enTitle: 'CSR & Project Partnership',
    hiDesc: 'सत्यापित व्यवहार्यता अध्ययन, पायलट सोलर/बायोगैस मॉडल और ग्रामीण प्रशिक्षण में सहभागिता।',
    enDesc: 'Co-develop feasibility assessments, pilot clean-energy installations, and rural training.',
  },
];

const FAQS = [
  {
    qHi: 'क्या कच्ची बायोगैस को सीधे सामान्य सिलेंडर में भरकर CBG बनाया जा सकता है?',
    qEn: 'Can raw biogas simply be filled into an ordinary cylinder to make CBG?',
    aHi: 'बिल्कुल नहीं — यह असुरक्षित और गलत है। CBG (कॉम्प्रेस्ड बायोगैस) बनाने के लिए कच्ची बायोगैस से CO₂, हाइड्रोजन सल्फाइड (H₂S) और नमी को औद्योगिक शुद्धिकरण इकाई में हटाया जाता है, गुणवत्ता व सुरक्षा जाँच की जाती है और फिर प्रमाणित मल्टी-स्टेज कंप्रेसर से उच्च-दाब कैस्केड में संग्रहित किया जाता है।',
    aEn: 'Never—that is unsafe and technically incorrect. Producing CBG requires industrial scrubbing to remove CO₂, H₂S, and moisture, continuous gas quality & safety verification, and certified multi-stage compression into approved high-pressure cascades.',
  },
  {
    qHi: 'गौशाला मिशन और स्वच्छ ऊर्जा मिशन में क्या अंतर है? क्या एक ही बायोगैस संयंत्र दो बार गिना जाएगा?',
    qEn: 'How does the Clean Energy Mission differ from the Self-Reliant Gaushala Mission?',
    aHi: 'आत्मनिर्भर गौशाला मिशन का फोकस पशु स्वास्थ्य, कल्याण, प्रबंधन और गौशाला की समग्र आत्मनिर्भरता है; जबकि स्वच्छ ऊर्जा मिशन का फोकस सौर, बायोगैस व CBG जैसी स्वच्छ ऊर्जा प्रणालियों और ऊर्जा दक्षता पर है। किसी गौशाला-आधारित बायोगैस परियोजना को दोनों से लिंक किया जा सकता है, लेकिन उसकी मात्रा और पर्यावरणीय उपलब्धि कभी दो बार नहीं गिनी जाएगी।',
    aEn: 'The Gaushala Mission centres on cattle health, welfare, and overall shelter sustainability; the Clean Energy Mission focuses on renewable power, biogas/CBG systems, and energy efficiency. A Gaushala biogas unit may be cross-linked, but its output and environmental impact are strictly never double-counted.',
  },
  {
    qHi: 'क्या हर बायोगैस या CBG परियोजना स्वतः मुनाफे या कार्बन क्रेडिट की गारंटी देती है?',
    qEn: 'Does every biogas or CBG setup automatically guarantee profit or carbon credits?',
    aHi: 'नहीं। प्रत्येक परियोजना की सफलता स्थानीय फीडस्टॉक उपलब्धता, परिवहन लागत, सही संचालन, मीथेन रिसाव नियंत्रण, स्लरी प्रबंधन और सुनिश्चित गैस उपयोग (ऑफटेक) पर निर्भर करती है। GOVEDA पहले वैज्ञानिक व्यवहार्यता अध्ययन करती है और बिना स्वतंत्र सत्यापन के कोई वित्तीय या उत्सर्जन गारंटी नहीं देती।',
    aEn: 'No. Real performance depends on consistent feedstock availability, transport logistics, safe leak-free operation, slurry handling, and assured gas offtake. GOVEDA conducts feasibility studies first and never guarantees automatic returns or carbon credits without independent verification.',
  },
];

export function CleanEnergyPage({ lang, onNavigate }: CleanEnergyPageProps) {
  const { bootstrap } = usePublicPortal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const hi = lang === 'hi';

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* Live CMS Programmes linked to Clean Energy Mission (Section 10 & Training Section 9) */
  const { projects, campaigns, events, trainings } = useMemo(() => {
    const allPublished = filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
      missionSlug: 'swachh-urja',
      onlyPublished: true,
    });
    return {
      projects: allPublished.filter((p) => p.type === 'project'),
      campaigns: allPublished.filter((p) => p.type === 'campaign'),
      events: allPublished.filter((p) => p.type === 'event'),
      trainings: allPublished.filter((p) => p.type === 'training'),
    };
  }, [bootstrap?.programmes]);

  const hasAnyRelatedProgrammes =
    projects.length > 0 || campaigns.length > 0 || events.length > 0;

  return (
    <div className="bg-[#FAF8F1] text-[#26352E]">
      {/* ====================================================================
          SECTION 1 — CINEMATIC 2.5D HERO: CLEAN ENERGY FOR RURAL INDIA
         ==================================================================== */}
      <section className="relative bg-[#123D2A] text-white overflow-hidden border-b border-[#1E563B]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Editorial Narrative (5 columns ~42%) */}
            <div className="lg:col-span-5 space-y-5 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="h-[2px] w-7 bg-[#F3BD42]" aria-hidden="true" />
                <span className="text-xs font-extrabold tracking-[0.14em] text-[#F3BD42]">
                  {hi
                    ? 'स्वच्छ ऊर्जा मिशन | Clean Energy Mission'
                    : 'Clean Energy Mission | स्वच्छ ऊर्जा मिशन'}
                </span>
              </div>

              <h1
                className={`font-extrabold tracking-tight leading-[1.12] text-[2.1rem] sm:text-[2.85rem] lg:text-[3.15rem] text-white text-balance ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi
                  ? 'गाँव की शक्ति, स्वच्छ ऊर्जा से समृद्धि'
                  : 'Powering Rural India Through Clean Energy'}
              </h1>

              <p className="text-sm sm:text-[15.5px] font-bold tracking-wide text-[#9CE5B4]">
                Solar Energy • Biogas • Compressed Biogas (CBG)
              </p>

              <p
                className={`text-sm sm:text-base text-white/85 leading-[1.72] max-w-[48ch] ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? 'ग्रामीण क्षेत्रों में स्वच्छ ऊर्जा, जैविक संसाधनों के उपयोग और टिकाऊ ऊर्जा समाधानों को बढ़ावा देने की दिशा में एक पहल।'
                  : 'An initiative advancing practical solar electricity, safe biogas systems, and scientifically feasible Compressed Biogas (CBG) across rural India.'}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => scrollTo('ce-why-ecosystem')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F3BD42] hover:bg-[#E2AC2D] text-[#123D2A] px-6 py-3 text-sm font-extrabold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{hi ? 'मिशन को जानें' : 'Explore the Mission'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('ce-participate')}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/18 text-white border border-white/25 px-5 py-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{hi ? 'सहयोग एवं भागीदारी' : 'Collaborate & Join'}</span>
                </button>
              </div>

              {/* Three Visual Technology Jump Indicators */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => scrollTo('ce-solar-section')}
                  className="rounded-2xl bg-white/8 hover:bg-white/15 border border-white/15 p-3 text-left transition-colors cursor-pointer space-y-1.5"
                >
                  <ConceptMiniIcon kind="solar" className="w-8 h-8" />
                  <span className="block text-xs font-extrabold text-white leading-tight">
                    {hi ? 'सौर ऊर्जा' : 'Solar Energy'}
                  </span>
                  <span className="block text-[10.5px] text-[#F3BD42] font-semibold">
                    DC → AC
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('ce-biogas-section')}
                  className="rounded-2xl bg-white/8 hover:bg-white/15 border border-white/15 p-3 text-left transition-colors cursor-pointer space-y-1.5"
                >
                  <ConceptMiniIcon kind="biogas" className="w-8 h-8" />
                  <span className="block text-xs font-extrabold text-white leading-tight">
                    {hi ? 'बायोगैस' : 'Biogas'}
                  </span>
                  <span className="block text-[10.5px] text-[#9CE5B4] font-semibold">
                    {hi ? 'गैस + खाद' : 'Gas + Slurry'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('ce-cbg-section')}
                  className="rounded-2xl bg-white/8 hover:bg-white/15 border border-white/15 p-3 text-left transition-colors cursor-pointer space-y-1.5"
                >
                  <ConceptMiniIcon kind="cbg" className="w-8 h-8" />
                  <span className="block text-xs font-extrabold text-white leading-tight">
                    CBG
                  </span>
                  <span className="block text-[10.5px] text-[#7BE3F5] font-semibold">
                    {hi ? 'शुद्धिकृत ईंधन' : 'Upgraded Fuel'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right 58–62% Cinematic 2.5D Illustration with Subtle Educational Process Flow Trails */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-[0_28px_65px_-22px_rgba(0,0,0,0.55)] bg-[#0E3122]">
                <div className="aspect-[16/9] w-full relative">
                  <ResilientImage
                    assetKey="ceHeroCinematic"
                    alt={
                      hi
                        ? 'ग्रामीण भारत में स्वच्छ ऊर्जा का एकीकृत 2.5D दृश्य — बाएँ गौशाला व बायोगैस डाइजेस्टर, केंद्र में CBG शुद्धिकरण व तकनीशियन, दाएँ सौर पैनल युक्त भवन व हरित गाँव'
                        : 'Cinematic 2.5D rural India clean-energy landscape showing a Gaushala and biogas digester on the left, CBG upgrading tower and illustrated technician in the centre, and rooftop solar on a rural building overlooking green farms on the right'
                    }
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle Animated Process Flow Trails Linking the Three Real Systems */}
                  <svg
                    viewBox="0 0 1000 562"
                    className="pointer-events-none absolute inset-0 w-full h-full"
                    aria-hidden="true"
                  >
                    <defs>
                      <marker id="heroArrowGold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 1 L 8.5 5 L 0 9 z" fill="#F3BD42" />
                      </marker>
                      <marker id="heroArrowGreen" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 1 L 8.5 5 L 0 9 z" fill="#75B843" />
                      </marker>
                      <marker id="heroArrowTeal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 1 L 8.5 5 L 0 9 z" fill="#29B6D8" />
                      </marker>
                    </defs>
                    {/* Golden trail: Sunlight -> Rooftop Solar Panels */}
                    <path
                      d="M 275 48 Q 565 65 815 112"
                      fill="none"
                      stroke="#F3BD42"
                      strokeWidth="3.2"
                      strokeDasharray="9 7"
                      strokeOpacity="0.92"
                      markerEnd="url(#heroArrowGold)"
                      className="motion-safe:animate-orbit-dash"
                    />
                    {/* Green trail: Gaushala dung -> Biogas digester */}
                    <path
                      d="M 190 320 Q 250 375 305 405"
                      fill="none"
                      stroke="#75B843"
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                      strokeOpacity="0.95"
                      markerEnd="url(#heroArrowGreen)"
                      className="motion-safe:animate-orbit-dash"
                    />
                    {/* Blue-green trail: Biogas -> CBG Scrubber -> Storage Cylinders */}
                    <path
                      d="M 415 352 Q 495 310 618 282"
                      fill="none"
                      stroke="#29B6D8"
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                      strokeOpacity="0.95"
                      markerEnd="url(#heroArrowTeal)"
                      className="motion-safe:animate-orbit-dash"
                    />
                  </svg>
                </div>

                {/* Clean Legend Bar Below Hero Artwork */}
                <div className="px-4 sm:px-5 py-3 bg-[#0C2A1D] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-semibold text-white/85">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-1 rounded-full bg-[#75B843]" aria-hidden="true" />
                    <span>{hi ? 'गौशाला → बायोगैस डाइजेस्टर' : 'Gaushala → Biogas'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-1 rounded-full bg-[#29B6D8]" aria-hidden="true" />
                    <span>{hi ? 'बायोगैस शुद्धिकरण → CBG भंडारण' : 'Upgrading → CBG'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-1 rounded-full bg-[#F3BD42]" aria-hidden="true" />
                    <span>{hi ? 'सूर्य प्रकाश → सोलर बिजली' : 'Sunlight → Solar Power'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2 — WHY CLEAN ENERGY MATTERS + INTEGRATED RURAL ECOSYSTEM
         ==================================================================== */}
      <section
        id="ce-why-ecosystem"
        className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="01"
            kickerHi="यह क्यों ज़रूरी है और ग्रामीण विकास से कैसे जुड़ता है?"
            kickerEn="Why Clean Energy Matters & How It Connects to Rural Development"
            titleHi="स्वच्छ ऊर्जा केवल बिजली नहीं — स्वस्थ रसोई, गोबर का सही उपयोग और आत्मनिर्भर गाँव है"
            titleEn="Connecting Clean Electricity, Organic Waste & Soil Nutrients Across Rural India"
            leadHi="ग्रामीण क्षेत्रों में ईंधन का बढ़ता खर्च, रसोई का धुआँ, गोबर व जैविक संसाधनों का अपर्याप्त उपयोग और बिजली की अनियमितता बड़ी चुनौतियाँ हैं। नीचे दिए गए इंटरैक्टिव चित्र में देखें कि सौर बिजली और बायोगैस/CBG किस प्रकार दो अलग लेकिन पूरक मार्गों से गाँव को सशक्त बनाते हैं।"
            leadEn="Rising rural fuel expenses, smoky kitchens, underutilised cattle dung, and uneven power affect village resilience. Explore the interactive ecosystem below to see how Solar Electricity and Biogas/CBG operate as two distinct yet complementary rural pathways."
            lang={lang}
          />

          {/* 3 Concise "Why It Matters" Anchors with Small Technical Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                kind: 'biogas' as const,
                hiTitle: 'जैविक संसाधन बर्बाद न हों',
                enTitle: 'Unlock Unused Organic Resources',
                hiDesc:
                  'गोबर और उपयुक्त सड़ने वाले जैविक कचरे को खुले ढेर में छोड़ने के बजाय वैज्ञानिक पाचन द्वारा स्वच्छ ऊर्जा और पोषक खाद में बदला जा सकता है।',
                enDesc:
                  'Cattle dung and suitable biodegradable waste can yield clean cooking/thermal energy and nutrient-rich manure instead of unmanaged heaps.',
              },
              {
                kind: 'solar' as const,
                hiTitle: 'सूर्य की ऊर्जा से ग्रामीण आत्मनिर्भरता',
                enTitle: 'Abundant Sunlight Into Reliable Power',
                hiDesc:
                  'राजस्थान जैसे धूप वाले राज्यों में घरों, स्कूलों और गौशालाओं की छतों पर सौर ऊर्जा व्यावहारिक बिजली व ऊर्जा दक्षता का बड़ा आधार बन सकती है।',
                enDesc:
                  'Sun-rich regions like Rajasthan offer strong potential for rooftop solar across rural schools, Gaushalas, homes, and community hubs.',
              },
              {
                kind: 'research' as const,
                hiTitle: 'वैज्ञानिक व्यवहार्यता — बिना दोहरी गणना',
                enTitle: 'Feasibility First & Zero Double-Counting',
                hiDesc:
                  'GOVEDA पहले फीडस्टॉक, लागत, सुरक्षा और उपयोग का अध्ययन करती है। गौशाला-लिंक्ड बायोगैस की उपलब्धि कभी दो मिशनों में दो बार नहीं गिनी जाती।',
                enDesc:
                  'Every project starts with feedstock, cost, safety, and demand studies. Gaushala-linked biogas outputs are strictly never double-counted across missions.',
              },
            ].map((item) => (
              <article
                key={item.enTitle}
                className="rounded-2xl bg-white border border-[#E5DEC9] p-6 space-y-3"
              >
                <ConceptMiniIcon kind={item.kind} className="w-11 h-11" />
                <h3
                  className={`text-lg font-extrabold text-[#123D2A] ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi ? item.hiTitle : item.enTitle}
                </h3>
                <p
                  className={`text-sm text-[#394C42] leading-[1.68] ${
                    hi ? 'font-hindi' : ''
                  }`}
                >
                  {hi ? item.hiDesc : item.enDesc}
                </p>
              </article>
            ))}
          </div>

          {/* Interactive 3D Isometric Integrated Ecosystem Diagram */}
          <InteractiveProcessDiagram
            lang={lang}
            assetKey="ceEcosystemIsometric"
            imageAltHi="ग्रामीण स्वच्छ ऊर्जा पारिस्थितिकी तंत्र का 3D आइसोमेट्रिक चित्र — बाएँ गौशाला, बायोगैस डाइजेस्टर, CBG व खाद मार्ग तथा दाएँ स्वतंत्र सौर ऊर्जा मार्ग"
            imageAltEn="3D isometric rural clean-energy ecosystem clearly separating the bio-energy/digestate pathways on the left from the solar electricity pathway on the right"
            hotspots={ECOSYSTEM_HOTSPOTS}
            flows={ECOSYSTEM_FLOWS}
            legend={[
              { color: '#76523A', hi: 'जैविक फीडस्टॉक व स्लरी खाद', en: 'Organic Feedstock & Slurry' },
              { color: '#17834D', hi: 'बायोगैस मार्ग', en: 'Biogas Flow' },
              { color: '#0F766E', hi: 'शुद्धिकृत CBG मार्ग', en: 'Upgraded CBG' },
              { color: '#F3BD42', hi: 'सौर प्रकाश', en: 'Solar Radiation' },
              { color: '#29B6D8', hi: 'स्वच्छ विद्युत', en: 'Electricity' },
            ]}
            captionHi="चित्र 01: एकीकृत ग्रामीण ऊर्जा तंत्र — ध्यान दें कि सौर बिजली (दाएँ) और बायोगैस/CBG/स्लरी खाद (बाएँ) दो अलग लेकिन एक-दूसरे की पूरक ऊर्जा प्रणालियाँ हैं।"
            captionEn="Figure 01: Integrated rural energy ecosystem — showing clearly that solar electricity (right) and biogas/CBG/digestate (left) are separate yet complementary rural pathways."
          />
        </div>
      </section>

      {/* ====================================================================
          SECTION 3 — SOLAR ENERGY: HOW SOLAR POWER WORKS (3D ISOMETRIC)
         ==================================================================== */}
      <section
        id="ce-solar-section"
        className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <EditorialSectionHeader
                index="02"
                kickerHi="सौर ऊर्जा प्रणाली · Solar Energy Architecture"
                kickerEn="Solar Energy · How Photovoltaic Power Works"
                titleHi="सूर्य की किरण से उपयोगी बिजली तक — 5 चरणों में समझें"
                titleEn="From Sunlight to Usable Rural Electricity in 5 Clear Stages"
                leadHi="ग्रामीण घरों, स्कूलों, सामुदायिक भवनों और गौशालाओं में सोलर पैनल कैसे DC बिजली बनाते हैं और इन्वर्टर उसे उपयोगी AC बिजली में कैसे बदलता है — हर पुर्ज़े पर क्लिक करके देखें।"
                leadEn="See how rooftop and ground-mounted panels turn sunlight into DC power, how the inverter converts it to usable AC electricity, and where optional battery storage fits."
                lang={lang}
              />
            </div>
            <div className="lg:col-span-4 rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-5 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#B88212]">
                {hi ? 'GOVEDA की सौर ऊर्जा पहल (PDF 4.2)' : 'GOVEDA Solar Scope'}
              </p>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#26352E]">
                {(hi
                  ? [
                      'ग्रामीण एवं संस्थागत सोलर जागरूकता',
                      'छतों पर सोलर लगाने की तकनीकी जानकारी',
                      'ऊर्जा दक्षता एवं बिजली बचत कार्यक्रम',
                      'सामुदायिक सोलर परियोजनाओं की व्यवहार्यता जाँच',
                    ]
                  : [
                      'Rural & institutional solar awareness',
                      'Technical guidance for rooftop solar',
                      'Practical power-saving & efficiency workshops',
                      'Community solar feasibility evaluation',
                    ]
                ).map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#17834D] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className={hi ? 'font-hindi' : ''}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <InteractiveProcessDiagram
            lang={lang}
            assetKey="ceSolarIsometric"
            imageAltHi="ग्रामीण भवन पर लगे सोलर पैनल, इन्वर्टर, बिजली वितरण, पंखे-लाइट, पंप और वैकल्पिक बैटरी भंडारण का 3D आइसोमेट्रिक चित्र"
            imageAltEn="3D isometric illustration of a rural institutional rooftop and ground solar system showing sunlight, PV panels, DC-to-AC inverter, indoor appliances, optional battery cabinet, and grid connection"
            hotspots={SOLAR_HOTSPOTS}
            flows={SOLAR_FLOWS}
            legend={[
              { color: '#F3BD42', hi: 'सूर्य का प्रकाश (Solar Energy)', en: 'Sunlight' },
              { color: '#29B6D8', hi: 'विद्युत प्रवाह (DC → AC)', en: 'Electrical Flow (DC → AC)' },
              { color: '#17834D', hi: 'वैकल्पिक भंडारण (Optional Battery)', en: 'Optional Storage' },
            ]}
            captionHi="चित्र 02: 3D आइसोमेट्रिक सौर प्रणाली — 01 सूर्य का प्रकाश → 02 सोलर पैनल (DC) → 03 इन्वर्टर (AC) → 04 उपकरण उपयोग → 05 वैकल्पिक बैटरी/ग्रिड।"
            captionEn="Figure 02: 3D isometric solar workflow — 01 Sunlight → 02 PV Panels (DC) → 03 Inverter (AC) → 04 Connected Loads → 05 Optional Battery Storage."
          />
        </div>
      </section>

      {/* ====================================================================
          SECTION 4 — BIOGAS: 3D CUTAWAY DIGESTER + 6 SCIENTIFIC SAFEGUARDS
         ==================================================================== */}
      <section
        id="ce-biogas-section"
        className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="03"
            kickerHi="बायोगैस प्रणाली · 3D कटअवे (अंदर से देखें)"
            kickerEn="Biogas · Inside the Anaerobic Digester (3D Cutaway)"
            titleHi="जैविक कचरे से स्वच्छ गैस और उपजाऊ खाद कैसे बनती है?"
            titleEn="From Organic Waste to Clean Cooking Fuel & Nutrient-Rich Slurry"
            leadHi="घरेलू, सामुदायिक और गौशाला आधारित बायोगैस संयंत्र के भीतर वास्तव में क्या होता है — नीचे दिए गए 3D कटअवे चित्र में चरण 01 से 06 तक स्पर्श करके पूरा चक्र समझें।"
            leadEn="Look inside a sealed anaerobic biogas digester through this 3D cross-sectional view—tap stages 01 through 06 to trace feedstock, microbial digestion, safe gas conditioning, and organic digestate."
            lang={lang}
          />

          <InteractiveProcessDiagram
            lang={lang}
            assetKey="ceBiogasCutaway"
            imageAltHi="बायोगैस संयंत्र का 3D कटअवे चित्र — बाएँ फीडस्टॉक व मिक्सिंग टैंक, बीच में सीलबंद डाइजेस्टर के भीतर स्लरी व ऊपर जमा बायोगैस, दाएँ ऊपर गैस पाइप व चूल्हा और दाएँ नीचे जैव-स्लरी खाद क्यारी"
            imageAltEn="3D cross-sectional cutaway of an anaerobic biogas plant revealing feedstock collection, inlet mixing, microbial digestion inside the sealed chamber, biogas dome & moisture trap leading to a stove/generator, and slurry outlet feeding organic compost beds"
            hotspots={BIOGAS_HOTSPOTS}
            flows={BIOGAS_FLOWS}
            legend={[
              { color: '#76523A', hi: 'गोबर व जैविक स्लरी (Feedstock / Digestate)', en: 'Feedstock & Digestate' },
              { color: '#17834D', hi: 'बायोगैस उत्पादन व संग्रह', en: 'Biogas Generation' },
              { color: '#29B6D8', hi: 'स्वच्छ रसोई व ऊर्जा उपयोग', en: 'Conditioned Utilisation' },
            ]}
            captionHi="चित्र 03: बायोगैस डाइजेस्टर का 3D कटअवे — एक ही बंद प्रणाली से धुआँ-रहित स्वच्छ ईंधन और खेती के लिए पोषक जैव-स्लरी खाद दोनों प्राप्त होते हैं।"
            captionEn="Figure 03: 3D cutaway of an anaerobic biogas plant — yielding both clean fuel from the upper gas dome and nutrient-rich bio-slurry from the outlet."
          />

          {/* PDF 4.4 — 6 Mandatory Scientific Biogas Safeguards */}
          <div className="rounded-3xl bg-[#123D2A] text-white p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/15 pb-5">
              <div className="space-y-1.5 max-w-3xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#F3BD42]">
                  {hi
                    ? 'वैज्ञानिक सावधानियाँ (PDF 4.4) · सुरक्षा सर्वोपरि'
                    : 'Six Mandatory Scientific Safeguards'}
                </p>
                <h3
                  className={`text-xl sm:text-2xl font-extrabold text-white ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'बायोगैस परियोजना तभी पर्यावरण के लिए लाभकारी है जब ये 6 मानक पूरे हों'
                    : 'A Biogas Plant Only Protects the Climate When All 6 Safeguards Hold'}
                </h3>
              </div>
              <ConceptMiniIcon kind="safety" className="w-12 h-12 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIX_BIOGAS_SAFEGUARDS.map((item) => (
                <div
                  key={item.num}
                  className="rounded-2xl bg-white/8 border border-white/12 p-5 space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-extrabold text-[#F3BD42] tabular-nums">
                      {item.num}
                    </span>
                    <h4
                      className={`text-sm sm:text-[15.5px] font-extrabold text-white ${
                        hi ? 'font-hindi' : ''
                      }`}
                    >
                      {hi ? item.hiTitle : item.enTitle}
                    </h4>
                  </div>
                  <p
                    className={`text-xs sm:text-[13.5px] text-white/80 leading-relaxed ${
                      hi ? 'font-hindi' : ''
                    }`}
                  >
                    {hi ? item.hiDesc : item.enDesc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5 — CBG: HOW BIOGAS BECOMES COMPRESSED BIOGAS (6 STAGES)
         ==================================================================== */}
      <section
        id="ce-cbg-section"
        className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="space-y-3">
            <EditorialSectionHeader
              index="04"
              kickerHi="कॉम्प्रेस्ड बायोगैस (CBG) · औद्योगिक शुद्धिकरण प्रक्रिया"
              kickerEn="From Organic Resources to Upgraded, Compressed Renewable Gas"
              titleHi="बायोगैस से CBG तक का सफर"
              titleEn="How Raw Biogas Becomes Compressed Biogas (CBG)"
              leadHi="महत्वपूर्ण तथ्य: CBG का अर्थ कच्ची बायोगैस को सीधे किसी सामान्य सिलेंडर में भर देना नहीं है। इसके लिए वैज्ञानिक स्क्रबिंग द्वारा CO₂ व अशुद्धियाँ हटाना, गुणवत्ता व सुरक्षा जाँच करना और प्रमाणित औद्योगिक कंप्रेसर से उच्च-दाब कैस्केड में संग्रहित करना अनिवार्य है।"
              leadEn="Crucial distinction: CBG is NOT raw biogas simply pumped into an ordinary cylinder. Raw biogas must undergo industrial scrubbing to remove CO₂ and impurities, strict quality & safety monitoring, and certified multi-stage compression into industrial cascades."
              lang={lang}
            />
          </div>

          {/* Interactive 6-Stage Horizontal 3D Isometric CBG Diagram (Cropped cleanly above bottom captions) */}
          <InteractiveProcessDiagram
            lang={lang}
            assetKey="ceCbgIsometricProcess"
            imageAltHi="बायोगैस से CBG निर्माण के 6 औद्योगिक चरण — फीडस्टॉक हॉपर, डाइजेस्टर, गैस स्क्रबिंग टॉवर, गुणवत्ता व सुरक्षा एनालाइज़र, उच्च-दाब कंप्रेसर, सिलेंडर कैस्केड व CBG डिस्पेंसिंग स्टेशन"
            imageAltEn="Horizontal 3D isometric CBG industrial workflow across 6 connected equipment zones: feedstock hopper, anaerobic digester, CO2/H2S scrubbing columns, gas quality & safety analyser, high-pressure compressor & cylinder cascades, and CBG dispensing truck"
            hotspots={CBG_HOTSPOTS}
            flows={CBG_FLOWS}
            viewHeight={416}
            aspectClass="aspect-[1000/416]"
            objectPosition="object-top"
            legend={[
              { color: '#76523A', hi: 'जैविक फीडस्टॉक', en: 'Organic Feedstock' },
              { color: '#17834D', hi: 'कच्ची बायोगैस', en: 'Raw Biogas' },
              { color: '#0F766E', hi: 'शुद्धिकृत व संपीड़ित CBG', en: 'Upgraded & Compressed CBG' },
              { color: '#29B6D8', hi: 'गुणवत्ता व सुरक्षा परीक्षण', en: 'Quality & Safety Checks' },
            ]}
            captionHi="चित्र 04: बायोगैस से CBG तक के 6 वैज्ञानिक चरण — कच्ची गैस की सफाई और सुरक्षा जाँच के बाद ही संपीड़न व वितरण संभव है।"
            captionEn="Figure 04: Six-stage industrial journey from organic feedstock to quality-tested, compressed renewable CBG."
          />

          {/* PDF 4.2 CBG Feasibility & Planning Pillars */}
          <div className="rounded-3xl bg-[#FAF8F1] border border-[#E5DEC9] p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <ConceptMiniIcon kind="research" className="w-11 h-11 shrink-0" />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0F766E]">
                  {hi
                    ? 'CBG परियोजना से पहले अनिवार्य तकनीकी-वित्तीय अध्ययन'
                    : 'Mandatory Pre-Project CBG Feasibility Studies'}
                </p>
                <h3
                  className={`text-lg sm:text-xl font-extrabold text-[#123D2A] ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'CBG संयंत्र की सफलता इन 8 वैज्ञानिक आधारों पर तय होती है'
                    : 'Eight Feasibility Checks Before Any CBG Facility Is Proposed'}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {(hi
                ? [
                    'गोबर व उपयुक्त फीडस्टॉक का वैज्ञानिक सर्वेक्षण',
                    'पूरे वर्ष कच्चे माल की उपलब्धता का आकलन',
                    'संग्रहण दूरी, परिवहन लागत और लॉजिस्टिक्स गणित',
                    'संयंत्र की तकनीकी एवं वित्तीय व्यवहार्यता',
                    'गैस शुद्धिकरण और मानक गुणवत्ता नियंत्रण',
                    'डाइजेस्टेट और स्लरी का सुरक्षित कृषि प्रबंधन',
                    'स्वीकृत ऑफटेक (Offtake) व बिक्री व्यवस्था',
                    'तकनीकी संस्थानों एवं निवेशकों के साथ साझेदारी',
                  ]
                : [
                    'Scientific dung & organic feedstock survey',
                    'Year-round raw material availability assessment',
                    'Collection radius, transport cost & logistics',
                    'Technical & financial viability modelling',
                    'Gas scrubbing & purity compliance standards',
                    'Safe digestate & slurry nutrient management',
                    'Verified commercial offtake arrangements',
                    'Technical institute & investor partnerships',
                  ]
              ).map((pt, idx) => (
                <div
                  key={pt}
                  className="rounded-xl bg-white border border-[#E5DEC9] px-4 py-3.5 flex items-start gap-2.5 text-xs sm:text-[13.5px] font-semibold text-[#26352E]"
                >
                  <span className="text-[#0F766E] font-extrabold tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className={hi ? 'font-hindi' : ''}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6 — BIOGAS VS CBG VS SOLAR ENERGY (3-COLUMN VISUAL COMPARISON)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="05"
            kickerHi="तीनों तकनीकों की स्पष्ट तुलना"
            kickerEn="Side-by-Side Technology Comparison"
            titleHi="सौर ऊर्जा बनाम बायोगैस बनाम CBG — एक नज़र में अंतर समझें"
            titleEn="Solar Energy vs. Biogas vs. CBG — Clear Differences at a Glance"
            leadHi="तीनों स्वच्छ ऊर्जा समाधान अलग-अलग इनपुट, अलग तकनीक और अलग ग्रामीण आवश्यकताओं के लिए बने हैं।"
            leadEn="Each clean-energy technology transforms a different input through a distinct process to meet specific rural and institutional needs."
            lang={lang}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                assetKey: 'ceSolarIsometric' as const,
                kind: 'solar' as const,
                accent: '#D2951B',
                objectPos: 'object-center',
                hiName: 'सौर ऊर्जा (Solar Energy)',
                enName: 'Solar Energy',
                hiInput: 'सूर्य का प्रकाश (Sunlight)',
                enInput: 'Direct natural sunlight',
                hiOutput: 'स्वच्छ विद्युत (Electricity)',
                enOutput: 'Clean AC Electricity',
                hiApps: 'रोशनी, पंखे, स्कूल/गौशाला उपकरण व उपयुक्त जल पंप',
                enApps: 'Lighting, fans, institutional equipment & suitable water pumps',
              },
              {
                assetKey: 'ceBiogasCutaway' as const,
                kind: 'biogas' as const,
                accent: '#17834D',
                objectPos: 'object-center',
                hiName: 'बायोगैस (Biogas)',
                enName: 'Biogas',
                hiInput: 'गोबर व उपयुक्त सड़ने वाला जैविक कचरा',
                enInput: 'Cattle dung & suitable biodegradable organics',
                hiOutput: 'कच्ची/कंडीशन बायोगैस + पोषक जैव-स्लरी खाद',
                enOutput: 'Biogas + nutrient-rich organic digestate',
                hiApps: 'धुआँ-रहित रसोई चूल्हा, स्थानीय तापीय उपयोग व अनुकूल जनरेटर',
                enApps: 'Clean rural cooking systems, thermal heat & compatible generators',
              },
              {
                assetKey: 'ceCbgIsometricProcess' as const,
                kind: 'cbg' as const,
                accent: '#0F766E',
                objectPos: 'object-top',
                hiName: 'कॉम्प्रेस्ड बायोगैस (CBG)',
                enName: 'Compressed Biogas (CBG)',
                hiInput: 'कच्ची बायोगैस (बड़े संयंत्र स्तर पर)',
                enInput: 'Raw biogas at cluster / industrial scale',
                hiOutput: 'शुद्धिकृत, उच्च-दाब संपीड़ित नवीकरणीय गैस (CBG)',
                enOutput: 'Upgraded, high-pressure compressed renewable gas',
                hiApps: 'उपयुक्त परिवहन ईंधन, औद्योगिक ऊष्मा एवं स्वीकृत गैस वितरण',
                enApps: 'Suitable clean transport fuel, industry & approved distribution',
              },
            ].map((col) => (
              <article
                key={col.enName}
                className="rounded-3xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#FAF8F1] border-b border-[#EAE4D3]">
                  <ResilientImage
                    assetKey={col.assetKey}
                    alt={hi ? col.hiName : col.enName}
                    className="w-full h-full object-cover"
                    objectPosition={col.objectPos}
                  />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ConceptMiniIcon kind={col.kind} className="w-10 h-10 shrink-0" />
                      <h3
                        className={`text-lg font-extrabold text-[#123D2A] ${
                          hi ? 'font-hindi' : 'font-editorial'
                        }`}
                      >
                        {hi ? col.hiName : col.enName}
                      </h3>
                    </div>

                    <dl className="space-y-3 text-sm border-t border-[#EEE8D8] pt-3.5">
                      <div>
                        <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#76523A]">
                          {hi ? 'इनपुट (Input)' : 'Input'}
                        </dt>
                        <dd className={`font-semibold text-[#26352E] mt-0.5 ${hi ? 'font-hindi' : ''}`}>
                          {hi ? col.hiInput : col.enInput}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ color: col.accent }}>
                          {hi ? 'आउटपुट (Output)' : 'Output'}
                        </dt>
                        <dd className={`font-semibold text-[#26352E] mt-0.5 ${hi ? 'font-hindi' : ''}`}>
                          {hi ? col.hiOutput : col.enOutput}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#123D2A]">
                          {hi ? 'प्रमुख उपयोग (Applications)' : 'Example Applications'}
                        </dt>
                        <dd className={`text-[#3E5247] leading-relaxed mt-0.5 ${hi ? 'font-hindi' : ''}`}>
                          {hi ? col.hiApps : col.enApps}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 7 — THE CIRCULAR RURAL ENERGY ECOSYSTEM
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#123D2A] text-white border-b border-[#1E563B]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-[#F3BD42]">
              {hi
                ? '06 · चक्रीय ग्रामीण ऊर्जा पारिस्थितिकी'
                : '06 · The Circular Rural Energy Ecosystem'}
            </p>
            <h2
              className={`text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold tracking-tight leading-[1.18] text-white ${
                hi ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {hi
                ? 'जहाँ कुछ भी व्यर्थ नहीं जाता — गौशाला से स्वच्छ ऊर्जा और मिट्टी तक पूर्ण चक्र'
                : 'A Circular Rural Model Linking Gaushalas, Clean Fuel & Fertile Soil'}
            </h2>
            <p
              className={`text-sm sm:text-base text-white/85 leading-[1.72] ${
                hi ? 'font-hindi' : ''
              }`}
            >
              {hi
                ? 'पशुधन व जैविक संसाधन → फीडस्टॉक संग्रह → बायोगैस डाइजेस्टर → स्वच्छ बायोगैस/CBG एवं जैव-स्लरी खाद → उपजाऊ कृषि भूमि → फसल व चारा। वहीं सौर ऊर्जा एक स्वतंत्र पूरक विद्युत प्रणाली के रूप में गाँव को रोशन करती है।'
                : 'Cattle & Organic Resources → Feedstock Collection → Anaerobic Digestion → Biogas/CBG + Digestate Management → Healthy Farm Soil → Crops & Fodder—complemented by a separate solar power system.'}
            </p>
          </div>

          <InteractiveProcessDiagram
            lang={lang}
            assetKey="ceCircularEcosystem"
            imageAltHi="चक्रीय ग्रामीण ऊर्जा मॉडल का 3D आइसोमेट्रिक वृत्त — केंद्र में गौशाला व हरित खेत, चारों ओर फीडस्टॉक, बायोगैस, CBG, जैव-स्लरी खाद व फसल चक्र तथा ऊपर बाएँ अलग सौर ऊर्जा प्रणाली"
            imageAltEn="3D isometric circular rural diorama showing a central Gaushala and green farmland surrounded by feedstock, biogas digester, CBG tanks, digestate compost beds, and fertile crops, with a separate rooftop solar array in the upper corner"
            hotspots={CIRCULAR_HOTSPOTS}
            flows={CIRCULAR_FLOWS}
            darkSurface
            legend={[
              { color: '#76523A', hi: 'जैविक संसाधन व खाद', en: 'Organic & Digestate' },
              { color: '#17834D', hi: 'बायोगैस चक्र', en: 'Biogas Stage' },
              { color: '#0F766E', hi: 'CBG शुद्धिकरण', en: 'CBG Upgrading' },
              { color: '#75B843', hi: 'मिट्टी व फसल वापसी', en: 'Soil & Crop Return' },
              { color: '#F3BD42', hi: 'पूरक सौर बिजली', en: 'Separate Solar Power' },
            ]}
            captionHi="चित्र 05: चक्रीय ग्रामीण ऊर्जा मॉडल — यह एक संभावित एकीकृत विकास रूपरेखा है जिसकी सफलता स्थानीय संसाधनों, तकनीकी व्यवहार्यता और बुनियादी ढाँचे पर निर्भर करती है।"
            captionEn="Figure 05: Circular rural energy model — presented as a potential integrated framework dependent on site feasibility, feedstock, infrastructure, and local governance."
          />

          {/* Honest Boundary Callout — Zero Double Counting & No Automatic Claims */}
          <div className="rounded-2xl bg-white/8 border border-white/15 p-5 sm:p-6 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#F3BD42] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className={`text-sm sm:text-base font-extrabold text-white ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'ईमानदार पारदर्शिता एवं गौशाला मिशन से स्पष्ट अंतर (PDF 4.3)'
                  : 'Transparent Feasibility & Zero Double-Counting Policy'}
              </h3>
              <p className={`text-xs sm:text-sm text-white/85 leading-[1.7] ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'यह एक संभावित एकीकृत ग्रामीण विकास मॉडल है — हर परियोजना स्वतः मुनाफे या कार्बन क्रेडिट के लिए पात्र नहीं होती; वास्तविक परिणाम तकनीकी व्यवहार्यता, फीडस्टॉक, अवसंरचना और स्थानीय परिस्थितियों पर निर्भर करते हैं। आत्मनिर्भर गौशाला मिशन से जुड़ी किसी भी बायोगैस इकाई की मात्रा या पर्यावरणीय उपलब्धि कभी दो बार नहीं गिनी जाएगी।'
                  : 'This is a potential integrated rural model dependent on technical feasibility, feedstock consistency, infrastructure, and local conditions—not a guarantee of automatic profitability or carbon-credit eligibility. Any biogas project linked with the Self-Reliant Gaushala Mission is strictly never double-counted.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 8 — POTENTIAL BENEFITS AND APPLICATIONS (6 CARDS)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="07"
            kickerHi="संभावित लाभ एवं व्यावहारिक अनुप्रयोग"
            kickerEn="Potential Benefits & Real-World Applications"
            titleHi="ग्रामीण भारत को स्वच्छ ऊर्जा से मिलने वाले 6 संभावित लाभ"
            titleEn="Six Realistic Ways Clean Energy Can Strengthen Rural Communities"
            leadHi="बिना किसी अतिशयोक्ति या झूठी गारंटी के — सही तकनीकी डिजाइन और संचालन से ग्रामीण समाज को ये व्यावहारिक लाभ मिल सकते हैं।"
            leadEn="Grounded in honest science without promising guaranteed income, savings, or emission numbers—here is where well-engineered systems can make a tangible difference."
            lang={lang}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POTENTIAL_BENEFITS.map((item, idx) => (
              <article
                key={item.enTitle}
                className="rounded-2xl bg-white border border-[#E5DEC9] p-6 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <ConceptMiniIcon kind={item.kind} className="w-12 h-12" />
                  <span className="text-xs font-extrabold text-[#76523A] tabular-nums">
                    0{idx + 1}
                  </span>
                </div>
                <h3
                  className={`text-base sm:text-lg font-extrabold text-[#123D2A] leading-snug ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi ? item.hiTitle : item.enTitle}
                </h3>
                <p
                  className={`text-sm text-[#394C42] leading-[1.68] ${
                    hi ? 'font-hindi' : ''
                  }`}
                >
                  {hi ? item.hiDesc : item.enDesc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 9 — TRAINING, KNOWLEDGE & AWARENESS (CONNECTED TO LIVE MODULE)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="08"
            kickerHi="प्रशिक्षण, ज्ञान एवं तकनीकी जागरूकता"
            kickerEn="Training, Knowledge & Practical Awareness"
            titleHi="किसानों, गौशाला प्रतिनिधियों और ग्रामीण युवाओं के लिए व्यावहारिक सीख"
            titleEn="Hands-On Learning for Farmers, Gaushalas & Rural Technicians"
            leadHi="स्वच्छ ऊर्जा तकनीक तभी सफल होती है जब स्थानीय समुदाय उसका सुरक्षित संचालन, रखरखाव और व्यवहार्यता खुद समझ सकें।"
            leadEn="Clean-energy infrastructure thrives long-term only when local farmers, Gaushala teams, and rural youth understand safe operation, maintenance, and feasibility."
            lang={lang}
          />

          {/* Large Illustrated Learning Pavilion Scene */}
          <figure className="rounded-3xl overflow-hidden border border-[#E5DEC9] bg-[#FAF8F1]">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <ResilientImage
                assetKey="ceTrainingLearning"
                alt={
                  hi
                    ? 'ग्रामीण प्रशिक्षण मंडप में प्रशिक्षक द्वारा किसानों, गौशाला प्रतिनिधियों व युवाओं को बायोगैस और सौर ऊर्जा मॉडल समझाते हुए 2.5D चित्र'
                    : 'Stylised 2.5D illustration of an Indian trainer demonstrating a tabletop biogas cutaway and solar model to attentive rural farmers, Gaushala representatives, and young technicians under a solar-roofed pavilion'
                }
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption
              className={`px-5 sm:px-7 py-3.5 text-xs sm:text-[13.5px] text-[#455A4B] border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3 ${
                hi ? 'font-hindi' : ''
              }`}
            >
              <span>
                {hi
                  ? 'व्यावहारिक प्रशिक्षण: सोलर प्रणाली, बायोगैस संचालन, CBG परिचय, गैस सुरक्षा व जैविक संसाधन प्रबंधन।'
                  : 'Practical workshops covering solar awareness, biogas operation, CBG fundamentals, equipment safety, and maintenance.'}
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/training')}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#123D2A] hover:text-[#17834D] cursor-pointer whitespace-nowrap"
              >
                <span>{hi ? 'प्रशिक्षण व ज्ञान केंद्र खोलें' : 'Open Training & Knowledge Hub'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </figcaption>
          </figure>

          {/* 6 Practical Learning Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LEARNING_MODULES.map((mod) => (
              <div
                key={mod.enTitle}
                className="rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-5 flex items-start gap-4"
              >
                <ConceptMiniIcon kind={mod.kind} className="w-11 h-11 shrink-0" />
                <div className="space-y-1">
                  <h3
                    className={`text-[15.5px] font-extrabold text-[#123D2A] ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi ? mod.hiTitle : mod.enTitle}
                  </h3>
                  <p
                    className={`text-xs sm:text-[13.5px] text-[#394C42] leading-relaxed ${
                      hi ? 'font-hindi' : ''
                    }`}
                  >
                    {hi ? mod.hiDesc : mod.enDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Live Published Training Programmes from Admin CMS (Hidden Automatically When Empty) */}
          {trainings.length > 0 && (
            <div className="rounded-3xl bg-[#F2F7EE] border border-[#CBE0BE] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3
                  className={`text-lg font-extrabold text-[#123D2A] ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'प्रकाशित स्वच्छ ऊर्जा प्रशिक्षण कार्यक्रम'
                    : 'Published Clean Energy Training Programmes'}
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigate('/training')}
                  className="text-xs font-extrabold text-[#17834D] hover:underline cursor-pointer"
                >
                  {hi ? 'सभी प्रशिक्षण देखें →' : 'View All Trainings →'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainings.map((tr) => {
                  const trLoc = tr.locations[0];
                  const trLocText = trLoc
                    ? [trLoc.district, trLoc.stateName].filter(Boolean).join(', ')
                    : hi
                    ? 'राजस्थान'
                    : 'Rajasthan';
                  return (
                    <article
                      key={tr.id}
                      className="rounded-2xl bg-white border border-[#DCE7DE] p-5 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold text-[#17834D]">
                          {trLocText} · {tr.operationalStatus}
                        </p>
                        <h4 className={`text-sm font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : ''}`}>
                          {hi ? tr.titleHi || tr.titleEn : tr.titleEn}
                        </h4>
                        <p className={`text-xs text-[#394C42] line-clamp-2 ${hi ? 'font-hindi' : ''}`}>
                          {hi ? tr.summaryHi || tr.summaryEn : tr.summaryEn}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/projects?code=${encodeURIComponent(tr.programmeCode)}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#123D2A] hover:text-[#17834D] pt-2 cursor-pointer"
                      >
                        <span>{hi ? 'विवरण देखें' : 'View Details'}</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION 10 — DYNAMIC PROJECTS, CAMPAIGNS & EVENTS (HIDDEN WHEN EMPTY)
         ==================================================================== */}
      {hasAnyRelatedProgrammes && (
        <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
            <EditorialSectionHeader
              index="09"
              kickerHi="सक्रिय व प्रकाशित कार्यक्रम · GOVEDA CMS से लाइव"
              kickerEn="Live Published Programmes · Connected to Admin CMS"
              titleHi="स्वच्छ ऊर्जा मिशन से जुड़ी परियोजनाएँ, अभियान और कार्यक्रम"
              titleEn="Related Projects, Campaigns & Upcoming Events"
              lang={lang}
            />

            {[
              {
                key: 'projects',
                items: projects,
                hiHeading: 'संबंधित परियोजनाएँ (Related Projects)',
                enHeading: 'Related Projects',
              },
              {
                key: 'campaigns',
                items: campaigns,
                hiHeading: 'संबंधित अभियान (Related Campaigns)',
                enHeading: 'Related Campaigns',
              },
              {
                key: 'events',
                items: events,
                hiHeading: 'आगामी कार्यक्रम (Upcoming Events)',
                enHeading: 'Upcoming Events',
              },
            ]
              .filter((group) => group.items.length > 0)
              .map((group) => (
                <div key={group.key} className="space-y-4">
                  <h3
                    className={`text-lg sm:text-xl font-extrabold text-[#123D2A] ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi ? group.hiHeading : group.enHeading}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((prog) => {
                      const cover =
                        prog.media.find((m) => m.isCover && m.url) ??
                        prog.media.find((m) => m.mediaType === 'photo' && m.url);
                      const firstLoc = prog.locations[0];
                      const locText = firstLoc
                        ? [firstLoc.localityName, firstLoc.district, firstLoc.stateName]
                            .filter(Boolean)
                            .join(', ')
                        : hi
                        ? 'राजस्थान'
                        : 'Rajasthan';
                      const formKey = prog.linkedFormTypes?.[0] || prog.linkedFormType;

                      return (
                        <article
                          key={prog.id}
                          className="rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            {cover?.url && (
                              <div className="aspect-[16/9] w-full overflow-hidden bg-[#EAE4D3]">
                                <img
                                  src={cover.url}
                                  alt={cover.altText || (hi ? prog.titleHi || prog.titleEn : prog.titleEn)}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-5 space-y-2.5">
                              <div className="flex items-center gap-2 text-xs font-bold text-[#17834D]">
                                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>{locText}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#76523A]">{prog.operationalStatus}</span>
                              </div>
                              <h4
                                className={`text-base font-extrabold text-[#123D2A] ${
                                  hi ? 'font-hindi' : 'font-editorial'
                                }`}
                              >
                                {hi ? prog.titleHi || prog.titleEn : prog.titleEn}
                              </h4>
                              <p
                                className={`text-xs sm:text-sm text-[#394C42] leading-relaxed line-clamp-3 ${
                                  hi ? 'font-hindi' : ''
                                }`}
                              >
                                {hi ? prog.summaryHi || prog.summaryEn : prog.summaryEn}
                              </p>
                              {prog.startDate && (
                                <p className="inline-flex items-center gap-1.5 text-xs text-[#5A6C61]">
                                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>{prog.startDate}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="px-5 pb-5 pt-2 flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => onNavigate(`/projects?code=${encodeURIComponent(prog.programmeCode)}`)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F1] hover:bg-[#EDF4EA] text-[#123D2A] border border-[#D8D1BD] px-4 py-2 text-xs font-extrabold transition-colors cursor-pointer"
                            >
                              <span>{hi ? 'विवरण देखें' : 'View Details'}</span>
                              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            {formKey && (
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigate(
                                    `/join/${encodeURIComponent(formKey)}?campaign=${encodeURIComponent(
                                      prog.programmeCode
                                    )}&campaignTitle=${encodeURIComponent(prog.titleEn)}`
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#123D2A] hover:bg-[#17834D] text-white px-4 py-2 text-xs font-extrabold transition-colors cursor-pointer"
                              >
                                <span>{hi ? 'पंजीकरण करें' : 'Join / Register'}</span>
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          FAQs — HONEST SCIENTIFIC CLARITY
         ==================================================================== */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <EditorialSectionHeader
            index={hasAnyRelatedProgrammes ? '10' : '09'}
            kickerHi="सामान्य तकनीकी प्रश्न"
            kickerEn="Frequently Asked Questions"
            titleHi="सौर, बायोगैस और CBG पर स्पष्ट वैज्ञानिक उत्तर"
            titleEn="Straightforward Answers on Solar, Biogas & CBG"
            lang={lang}
          />
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.qEn}
                  className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F1] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-[15.5px] text-[#123D2A] cursor-pointer"
                  >
                    <span className={hi ? 'font-hindi' : ''}>
                      {hi ? faq.qHi : faq.qEn}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      className={`px-5 pb-5 pt-2.5 border-t border-[#E5DEC9] bg-white text-sm text-[#394C42] leading-[1.72] ${
                        hi ? 'font-hindi' : ''
                      }`}
                    >
                      {hi ? faq.aHi : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 11 — PARTICIPATE IN THE CLEAN ENERGY MISSION + JOIN CTA
         ==================================================================== */}
      <section id="ce-participate" className="py-14 sm:py-20 bg-[#FAF8F1]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index={hasAnyRelatedProgrammes ? '11' : '10'}
            kickerHi="स्वच्छ ऊर्जा मिशन में सहभागिता"
            kickerEn="Participate in the Clean Energy Mission"
            titleHi="गौशाला, किसान, तकनीकी विशेषज्ञ या संस्था के रूप में जुड़ें"
            titleEn="Collaborate Across Solar, Biogas & CBG Initiatives"
            leadHi="नीचे दी गई किसी भी श्रेणी को चुनकर सीधे GOVEDA के आधिकारिक पंजीकरण एवं पूछताछ पोर्टल से जुड़ें।"
            leadEn="Select any participation track below to connect directly with GOVEDA’s official registration and enquiry portal."
            lang={lang}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PARTICIPATION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.enTitle}
                  type="button"
                  onClick={() => onNavigate(opt.route)}
                  className="text-left rounded-2xl bg-white hover:bg-[#F2F7EE] border border-[#E5DEC9] hover:border-[#17834D] p-5 space-y-3 transition-colors cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF4EE] text-[#123D2A] group-hover:bg-[#123D2A] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3
                      className={`text-sm sm:text-[15px] font-extrabold text-[#123D2A] leading-snug ${
                        hi ? 'font-hindi' : 'font-editorial'
                      }`}
                    >
                      {hi ? opt.hiTitle : opt.enTitle}
                    </h3>
                    <p
                      className={`text-xs text-[#455A4B] leading-relaxed ${
                        hi ? 'font-hindi' : ''
                      }`}
                    >
                      {hi ? opt.hiDesc : opt.enDesc}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#17834D] pt-2">
                    <span>{hi ? 'आगे बढ़ें' : 'Proceed'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>

          <EditorialSafeguardCallout
            lang={lang}
            titleHi="वैज्ञानिक एवं पारदर्शी परियोजना मानक"
            titleEn="Scientific & Transparent Reporting Standard"
            bodyHi="इस पृष्ठ पर वर्णित गतिविधियाँ GOVEDA की प्रस्तावित कार्ययोजना (2026–2030) हैं। किसी भी संयंत्र, ऊर्जा उत्पादन या उत्सर्जन कमी को बिना वास्तविक स्थापना और स्वतंत्र सत्यापन के उपलब्धि के रूप में प्रदर्शित नहीं किया जाता।"
            bodyEn="Activities presented on this page reflect GOVEDA’s proposed roadmap (2026–2030). No installation, energy output, or emission reduction is ever displayed as a completed achievement without physical execution and independent verification."
          />

          {/* Final Prominent "Join the Mission" Banner with Clean Energy Illustration */}
          <div className="rounded-3xl bg-[#123D2A] text-white overflow-hidden border border-[#1E563B]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-7 sm:p-10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F3BD42]">
                  <Sun className="w-4 h-4" aria-hidden="true" />
                  <Flame className="w-4 h-4" aria-hidden="true" />
                  <Wind className="w-4 h-4" aria-hidden="true" />
                  <span>{hi ? 'स्वच्छ ऊर्जा · आत्मनिर्भर गाँव' : 'Clean Energy · Self-Reliant Villages'}</span>
                </div>
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold text-white leading-tight ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'स्वच्छ ऊर्जा मिशन का हिस्सा बनें'
                    : 'Join the Clean Energy Mission'}
                </h2>
                <p
                  className={`text-sm sm:text-base text-white/85 leading-relaxed max-w-xl ${
                    hi ? 'font-hindi' : ''
                  }`}
                >
                  {hi
                    ? 'सोलर जागरूकता, गौशाला व घरेलू बायोगैस मॉडल, CBG व्यवहार्यता अध्ययन या ग्रामीण तकनीकी प्रशिक्षण से जुड़ने के लिए अभी मिशन में सहभागी बनें।'
                    : 'Connect with GOVEDA to collaborate on rooftop solar awareness, household or Gaushala biogas feasibility, CBG studies, or rural clean-energy training.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/join')}
                    className="inline-flex items-center gap-2 rounded-full bg-[#F3BD42] hover:bg-[#E2AC2D] text-[#123D2A] px-7 py-3.5 text-sm sm:text-base font-extrabold shadow-[0_12px_28px_-10px_rgba(243,189,66,0.5)] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{hi ? 'मिशन से जुड़ें (Join the Mission)' : 'Join the Mission'}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/projects')}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/18 text-white border border-white/25 px-5 py-3.5 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{hi ? 'परियोजनाएँ व अभियान देखें' : 'Explore Projects & Campaigns'}</span>
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 h-56 sm:h-64 lg:h-full">
                <ResilientImage
                  assetKey="ceHeroCinematic"
                  alt={
                    hi
                      ? 'स्वच्छ ऊर्जा मिशन — सौर, बायोगैस एवं CBG ग्रामीण सहभागिता'
                      : 'Clean Energy Mission rural solar, biogas and CBG collaboration'
                  }
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
