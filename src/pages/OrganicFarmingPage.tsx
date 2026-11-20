import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Droplets,
  FlaskConical,
  Leaf,
  Lock,
  PhoneCall,
  Scale,
  ShieldCheck,
  Sprout,
  Trees,
  Users,
} from 'lucide-react';
import {
  MissionEditorialHero,
  EditorialSectionHeader,
  EditorialSafeguardCallout,
} from '../components/MissionEditorialShell';
import { RegistrationPortal } from '../components/RegistrationForms';
import { ResilientImage } from '../components/ResilientImage';
import type { Language, RegistrationRecord } from '../types/goveda';

interface OrganicFarmingPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

/* ============================================================================
   PLAIN-LANGUAGE STORYTELLING DATA (5th-Grade & Small-Farmer Friendly)
   Grounded 100% in GOVEDA 6-Mission Master Plan — Part 3 (3.1 – 3.5)
   ============================================================================ */

const WHY_REASONS = [
  {
    num: '01',
    hiTitle: 'मिट्टी की जान और ताकत घट रही है',
    enTitle: 'Soil Is Losing Its Natural Life',
    hiBody:
      'लगातार ज़्यादा रासायनिक खाद डालने से मिट्टी सख़्त हो जाती है। खेत के सबसे अच्छे दोस्त — केंचुए और लाभकारी सूक्ष्मजीव — कम होने लगते हैं और जमीन की प्राकृतिक उपजाऊ शक्ति घट जाती है।',
    enBody:
      'Years of heavy chemical fertilisers harden farm soil and drive away earthworms and friendly microbes—slowly weakening the land’s natural fertility.',
  },
  {
    num: '02',
    hiTitle: 'खेती का खर्च बढ़ रहा है, बचत घट रही है',
    enTitle: 'Rising Costs Shrink Family Savings',
    hiBody:
      'हर मौसम में महँगी खाद और दवाइयाँ खरीदने में किसान की कमाई का बड़ा हिस्सा निकल जाता है। सही मिट्टी जाँच और देसी खाद से अनावश्यक खर्च धीरे-धीरे कम किया जा सकता है।',
    enBody:
      'Buying expensive fertilisers and sprays every season eats into a small farmer’s earnings. Soil testing and local bio-manure help cut avoidable input costs step by step.',
  },
  {
    num: '03',
    hiTitle: 'पानी की एक-एक बूँद बचाना ज़रूरी है',
    enTitle: 'Every Drop of Water Counts',
    hiBody:
      'राजस्थान जैसे कम वर्षा वाले क्षेत्रों में खुली सिंचाई से बहुत पानी भाप बनकर उड़ जाता है। मल्चिंग, ड्रिप सिंचाई और खेत के वर्षा जल संग्रहण से कम पानी में भी फसल हरी-भरी रहती है।',
    enBody:
      'In arid regions like Rajasthan, open flood watering loses precious moisture to evaporation. Straw mulching, drip lines, and farm rainwater ponds keep crops thriving with far less water.',
  },
  {
    num: '04',
    hiTitle: 'सरल भाषा में: जैविक पदार्थ बनाम जैविक कार्बन',
    enTitle: 'Simple Science: Organic Matter vs. Organic Carbon',
    hiBody:
      'जैसे इंसान को ताकत के लिए खाना चाहिए, वैसे ही गोबर, सूखी पत्तियाँ और फसल अवशेष मिट्टी का खाना (जैविक पदार्थ — SOM) हैं। इनके सड़ने से मिट्टी में जो असली ऊर्जा और नमी पकड़ने की ताकत जमा होती है, वही जैविक कार्बन (SOC) है।',
    enBody:
      'Just like people need food for strength, cow dung, dry leaves, and crop residue are food for soil (Soil Organic Matter — SOM). The lasting energy and sponge-like water-holding carbon stored inside soil from them is Soil Organic Carbon (SOC).',
  },
];

const FOCUS_AREAS = [
  {
    code: '01',
    icon: FlaskConical,
    hiTitle: 'मिट्टी स्वास्थ्य जाँच',
    enTitle: 'Soil Health Testing',
    hiDesc:
      'अंदाज़े से नहीं, जांच के बाद खाद डालें — मान्यता प्राप्त लैब में pH, नमक (EC), नाइट्रोजन, फॉस्फोरस, पोटाश, जैविक कार्बन और सूक्ष्म तत्वों की जाँच।',
    enDesc:
      'Stop guessing fertilisers—test pH, salinity (EC), Nitrogen, Phosphorus, Potash, Organic Carbon, and micronutrients at accredited labs.',
  },
  {
    code: '02',
    icon: Leaf,
    hiTitle: 'गोबर और गौशाला की खाद',
    enTitle: 'Gaushala Compost & Bio-Inputs',
    hiDesc:
      'आत्मनिर्भर गौशालाओं से जुड़कर जाँच की हुई कम्पोस्ट, वर्मीकम्पोस्ट, जीवामृत और बायोगैस की उपचारित स्लरी किसानों तक पहुँचाना।',
    enDesc:
      'Partnering with Self-Reliant Gaushalas to supply quality-checked compost, vermicompost, Jeevamrit, and treated biogas slurry.',
  },
  {
    code: '03',
    icon: Droplets,
    hiTitle: 'कम पानी में स्मार्ट सिंचाई',
    enTitle: 'Water-Smart Irrigation',
    hiDesc:
      'ड्रिप और स्प्रिंकलर सिंचाई, सूखे पत्तों की मल्चिंग, खेत की ढलान अनुसार वर्षा जल संचयन और गाँव का स्थानीय जल बजट।',
    enDesc:
      'Drip and sprinkler systems, crop-stage watering, straw mulching, slope-aware rainwater ponds, and village water budgeting.',
  },
  {
    code: '04',
    icon: Scale,
    hiTitle: '4-प्लॉट प्रदर्शन खेत',
    enTitle: '4-Plot Field Trials',
    hiDesc:
      'चयनित खेतों में 4 तरीकों की सीधी तुलना — ताकि किसान खुद अपनी आँखों से लागत, पानी, मेहनत और शुद्ध कमाई का सच्चा फर्क देख सकें।',
    enDesc:
      'Side-by-side comparison of 4 farming methods on real plots so farmers see actual cost, water use, effort, and net profit with their own eyes.',
  },
  {
    code: '05',
    icon: Trees,
    hiTitle: 'फसल विविधता व कृषि वानिकी',
    enTitle: 'Crop Diversity & Agroforestry',
    hiDesc:
      'दालें, हरा चारा, फलदार पौधे, खेत की मेड़ों पर देसी पेड़ तथा बाजार की माँग व जोखिम समझकर नई फसलों का चुनाव।',
    enDesc:
      'Pulses, green fodder, fruit plants, native boundary trees, and medicinal crops—always chosen after explaining market demand, cost, and risk.',
  },
  {
    code: '06',
    icon: Users,
    hiTitle: 'गाँव में नई आजीविका व बाजार',
    enTitle: 'Village Livelihoods & Markets',
    hiDesc:
      'किसान उत्पादक संगठन (FPO), कृषि प्रसंस्करण, ग्रामीण हस्तशिल्प, महिला उद्यम, युवा प्रशिक्षण और डिजिटल बिक्री मार्गदर्शन।',
    enDesc:
      'FPO collaboration, food processing, rural handicrafts, women’s enterprises, youth training, and digital sales guidance.',
  },
];

const FIVE_STEPS = [
  {
    step: '01',
    hiTitle: 'मिट्टी और पानी को समझना',
    enTitle: 'Understand Your Soil & Water',
    hiDesc:
      'सबसे पहले किसान भाई की सहमति से खेत की स्थिति दर्ज होती है और प्रयोगशाला में मिट्टी के 6 ज़रूरी गुणों की जाँच की जाती है।',
    enDesc:
      'First, with the farmer’s consent, we understand field crops and water sources, then test 6 essential soil nutrients in an accredited lab.',
  },
  {
    step: '02',
    hiTitle: 'सही प्राकृतिक या जैविक खाद',
    enTitle: 'Choose Right Bio-Inputs',
    hiDesc:
      'जाँच के अनुसार गौशाला से बनी शुद्ध वर्मीकम्पोस्ट, कम्पोस्ट, जीवामृत या उपचारित बायोगैस स्लरी का संतुलित उपयोग सिखाया जाता है।',
    enDesc:
      'Based on test results, farmers learn balanced use of quality-checked vermicompost, compost, Jeevamrit, or treated biogas slurry.',
  },
  {
    step: '03',
    hiTitle: 'कम पानी से ज़्यादा नमी',
    enTitle: 'Save Every Drop of Water',
    hiDesc:
      'ड्रिप-स्प्रिंकलर सिंचाई, फसल के चरण अनुसार पानी देना, मल्चिंग और खेत में वर्षा जल रोककर मिट्टी में नमी लंबे समय तक रखी जाती है।',
    enDesc:
      'Drip/sprinkler lines, right-time watering, straw mulching, and rainwater collection keep soil moist even during dry spells.',
  },
  {
    step: '04',
    hiTitle: '4-प्लॉट खेत में सच्ची जाँच',
    enTitle: 'Test Side-by-Side (4 Plots)',
    hiDesc:
      'एक साथ पूरे खेत में जोखिम नहीं — छोटे हिस्सों में 4 तरीकों की तुलना कर वास्तविक खर्च, उपज, पानी और शुद्ध लाभ का रिकॉर्ड रखा जाता है।',
    enDesc:
      'Never risk the whole farm at once—compare 4 methods side-by-side and record real cost, water use, labour, yield, and net income.',
  },
  {
    step: '05',
    hiTitle: 'विविध फसलें और गाँव की कमाई',
    enTitle: 'Diversify & Grow Village Income',
    hiDesc:
      'दलहन, चारा, मेड़ पर फलदार व देसी वृक्ष, FPO सहयोग, खाद्य प्रसंस्करण और सीधे बाजार जुड़कर परिवार की आय को मज़बूत बनाया जाता है।',
    enDesc:
      'Combine pulses, fodder, boundary trees, FPOs, agri-processing, and direct market links to build steady year-round family earnings.',
  },
];

const FOUR_TRIAL_PLOTS = [
  {
    id: 'current',
    code: 'प्लॉट 1',
    codeEn: 'Plot 1',
    hiName: 'किसान की वर्तमान खेती',
    enName: 'Current Farming Practice',
    hiDetail:
      'जिस तरीके से किसान आज खेती कर रहे हैं — इसे आधार (Baseline) मानकर खर्च, पानी और उपज लिखी जाती है ताकि तुलना बिल्कुल ईमानदार रहे।',
    enDetail:
      'The farmer’s existing method serves as an honest baseline so cost, water, and harvest are compared fairly.',
  },
  {
    id: 'organic',
    code: 'प्लॉट 2',
    codeEn: 'Plot 2',
    hiName: 'उपयुक्त जैविक खेती',
    enName: 'Suitable Organic Farming',
    hiDetail:
      'निर्धारित जैविक मानकों के अनुसार गुणवत्तापूर्ण वर्मीकम्पोस्ट, जैविक पोषण और सुरक्षित जैविक कीट नियंत्रण का व्यावहारिक परीक्षण।',
    enDetail:
      'Structured organic standards using quality-tested vermicompost, permitted bio-nutrients, and safe organic pest control.',
  },
  {
    id: 'natural',
    code: 'प्लॉट 3',
    codeEn: 'Plot 3',
    hiName: 'प्राकृतिक खेती पद्धति',
    enName: 'Natural Farming Approach',
    hiDetail:
      'स्थानीय देसी संसाधनों, जीवामृत, सूखे अवशेषों की मल्चिंग और सह-फसल विविधता के माध्यम से कम लागत वाली खेती का परीक्षण।',
    enDetail:
      'Low-cost on-farm ecological farming using Jeevamrit, thick straw mulching, and diverse companion crops.',
  },
  {
    id: 'inm',
    code: 'प्लॉट 4',
    codeEn: 'Plot 4',
    hiName: 'वैज्ञानिक समेकित पोषण व कीट प्रबंधन',
    enName: 'Scientific Guided INM & IPM',
    hiDetail:
      'कृषि वैज्ञानिक की सलाह से मिट्टी परीक्षण आधारित संतुलित पोषण और सुरक्षित कीट नियंत्रण — ताकि किसान बिना नुकसान के चरणबद्ध बदलाव कर सकें।',
    enDetail:
      'Agronomist-guided Integrated Nutrient & Pest Management based on lab soil reports for safe, step-by-step transition.',
  },
];

const SIX_SOIL_CHECKS = [
  { hi: 'मिट्टी का pH (अम्लीय या क्षारीय)', en: 'Soil pH (Acidity / Alkalinity)' },
  { hi: 'विद्युत चालकता (EC — नमक का स्तर)', en: 'Electrical Conductivity (Salinity)' },
  { hi: 'उपलब्ध नाइट्रोजन, फॉस्फोरस व पोटाश (NPK)', en: 'Available Nitrogen, Phosphorus & Potash' },
  { hi: 'जैविक कार्बन (Soil Organic Carbon)', en: 'Soil Organic Carbon (SOC)' },
  { hi: 'आवश्यक सूक्ष्म पोषक तत्व (जिंक, लोहा आदि)', en: 'Essential Micronutrients (Zinc, Iron, etc.)' },
  { hi: 'फसल और मिट्टी अनुसार सटीक खाद सलाह', en: 'Crop & Soil-Specific Nutrient Plan' },
];

const RURAL_LIVELIHOODS = [
  { hi: 'ग्रामीण कृषि उद्यमिता', en: 'Rural Agri-Entrepreneurship' },
  { hi: 'किसान उत्पादक संगठन (FPO) सहयोग', en: 'FPO Collaboration' },
  { hi: 'कृषि उत्पाद प्रसंस्करण (दाल, मसाले, पैकिंग)', en: 'Local Agri-Processing' },
  { hi: 'ग्रामीण हस्तशिल्प एवं पारंपरिक शिल्प', en: 'Rural Handicrafts' },
  { hi: 'स्थानीय महिला सूक्ष्म उद्यम', en: 'Women Micro-Enterprises' },
  { hi: 'पर्यावरण-अनुकूल उत्पाद निर्माण', en: 'Eco-Friendly Rural Products' },
  { hi: 'ग्रामीण युवाओं का व्यावहारिक प्रशिक्षण', en: 'Practical Youth Training' },
  { hi: 'बाजार संपर्क एवं डिजिटल बिक्री मार्गदर्शन', en: 'Market & Digital Sales Guidance' },
];

const IMPACT_METRICS = [
  { hi: 'प्रति हेक्टेयर वास्तविक उपज', en: 'Actual Yield per Hectare' },
  { hi: 'खेती की कुल लागत', en: 'Total Cultivation Cost' },
  { hi: 'किसान की शुद्ध कमाई (Net Income)', en: 'Farmer’s Net Income' },
  { hi: 'सिंचाई में लगे पानी की बचत', en: 'Irrigation Water Used & Saved' },
  { hi: 'मिट्टी परीक्षण रिपोर्ट में सुधार', en: 'Lab Soil-Health Improvements' },
  { hi: 'किसान परिवार की वास्तविक संतुष्टि', en: 'Genuine Farmer Satisfaction' },
];

const FAQS = [
  {
    qHi: 'क्या प्राकृतिक खेती और जैविक खेती एक ही बात हैं?',
    qEn: 'Are Natural Farming and Organic Farming the same thing?',
    aHi: 'नहीं। दोनों अलग-अलग पद्धतियाँ हैं। प्राकृतिक खेती में खेत के अंदर के ही देसी संसाधनों (गोबर, जीवामृत, मल्चिंग, मिली-जुली फसलें) से मिट्टी को जीवित रखा जाता है। जबकि जैविक खेती में तय जैविक मानकों के अनुसार अनुमत खाद, कीट प्रबंधन और ज़रूरत पड़ने पर आधिकारिक प्रमाणन (Certification) अपनाया जाता है।',
    aEn: 'No—they are two distinct methods. Natural Farming relies on local on-farm inputs like cow dung, Jeevamrit, mulching, and companion cropping. Organic Farming follows structured organic standards, permitted organic inputs, pest control, and formal certification when required.',
  },
  {
    qHi: 'क्या पहले ही साल से दोगुनी उपज या निश्चित कमाई का वादा किया जाता है?',
    qEn: 'Does GOVEDA promise doubled yields or guaranteed income from year one?',
    aHi: 'बिल्कुल नहीं। GOVEDA बिना स्थानीय खेत परीक्षण के कोई भी झूठा दावा नहीं करती। 4-प्लॉट प्रदर्शन खेत में किसान खुद लागत, पानी, मेहनत और शुद्ध लाभ की तुलना देखते हैं — और मौसम, भूमि तथा बाजार भाव का असर भी ईमानदारी से जोड़ा जाता है।',
    aEn: 'Never. GOVEDA does not make unverified yield or income promises without local trials. On 4-plot demonstration farms, farmers evaluate real cost, water use, labour, and net profit—honestly accounting for weather, soil quality, and market prices.',
  },
  {
    qHi: 'यदि मैं छोटा किसान हूँ और मेरे पास 2–3 बीघा जमीन है, तो क्या मैं जुड़ सकता हूँ?',
    qEn: 'Can a small farmer with 2–3 bigha of land join this mission?',
    aHi: 'हाँ, बिल्कुल! यह मिशन खासतौर पर छोटे और सीमांत किसानों के लिए ही बनाया गया है। आप नीचे दिए गए सरल फॉर्म में अपनी जानकारी भरकर मिट्टी जाँच जागरूकता, प्रशिक्षण और प्रदर्शन खेत की जानकारी प्राप्त कर सकते हैं।',
    aEn: 'Yes, absolutely! This mission is built specifically to support small and marginal farmers. Simply fill out the farmer registration form below to connect for soil-health awareness, training, and local guidance.',
  },
  {
    qHi: 'क्या मेरा मोबाइल नंबर या जमीन के कागज़ वेबसाइट पर सबको दिखाई देंगे?',
    qEn: 'Will my mobile number or land details be shown publicly on the website?',
    aHi: 'कभी नहीं। किसान की सहमति से ली गई भूमि जानकारी, मोबाइल नंबर और व्यक्तिगत विवरण पूरी तरह सुरक्षित व गोपनीय रखे जाते हैं — इन्हें कभी सार्वजनिक नहीं किया जाता।',
    aEn: 'Never. Land details, phone numbers, and personal profiles collected with your consent are kept strictly confidential and are never published publicly.',
  },
];

export function OrganicFarmingPage({
  lang,
  records,
  onAddRecord,
  onNavigate,
}: OrganicFarmingPageProps) {
  const [selectedPlot, setSelectedPlot] = useState<string>('current');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const hi = lang === 'hi';

  const activePlot =
    FOUR_TRIAL_PLOTS.find((p) => p.id === selectedPlot) ?? FOUR_TRIAL_PLOTS[0];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF9F4] text-[#144721]">
      {/* 1. SEAMLESS BOTANICAL SPLIT HERO — IDENTICAL VISUAL COMPOSITION ON LAPTOP & MOBILE */}
      <MissionEditorialHero
        lang={lang}
        eyebrow="GOVEDA • PEOPLE • PLANET • PROSPERITY"
        titleLine1Hi="जैविक खेती एवं"
        titleLine2Hi="ग्रामीण विकास"
        titleLine1En="Organic Farming &"
        titleLine2En="Rural Development"
        taglineHi="स्वस्थ मिट्टी। सुदृढ़ खेत। समृद्ध और आत्मनिर्भर गाँव।"
        taglineEn="Healthy Soil. Resilient Farms. Thriving Villages."
        summaryHi="छोटे से छोटे किसान को सरल भाषा में वैज्ञानिक, कम पानी और कम लागत वाली खेती से जोड़ना — ताकि मिट्टी जीवित रहे, खर्च घटे और पूरे गाँव की कमाई बढ़े।"
        summaryEn="Helping every farmer—small or large—adopt simple, water-saving, soil-friendly farming that cuts avoidable costs, restores living soil, and strengthens village livelihoods."
        primaryCtaHi="किसान पंजीकरण करें"
        primaryCtaEn="Register as Farmer"
        secondaryCtaHi="यह क्यों ज़रूरी है?"
        secondaryCtaEn="Why It Matters"
        onPrimaryCta={() => scrollToSection('farmer-registration')}
        onSecondaryCta={() => scrollToSection('why-it-matters')}
        imageSrc="/assets/aistudio/file_00000000c7348211a9bdc99726e00c04_c44af84b.png"
        imageAltHi="जैविक खेती एवं ग्रामीण विकास — अरावली खेत, वर्षा जल कुंड, कम्पोस्ट व जीवित मिट्टी"
        imageAltEn="Organic Farming & Rural Development — terraced farms, rainwater pond, compost and living soil"
        cropRightArtworkOnly
        artworkZoomPercent={190}
      />

      {/* 2. SECTION 01 — WHY IT MATTERS (CLEAR THE WHY FIRST, 5TH-GRADE SIMPLE!) */}
      <section
        id="why-it-matters"
        className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="01"
            kickerHi="सबसे पहला सवाल — यह क्यों ज़रूरी है?"
            kickerEn="First Things First — Why This Mission Matters"
            titleHi="मिट्टी जीवित रहेगी, तभी खेत और किसान खुशहाल रहेंगे"
            titleEn="When Soil Comes Back to Life, Farms and Families Thrive"
            leadHi="मिट्टी सिर्फ धूल नहीं है — यह करोड़ों सूक्ष्मजीवों और केंचुओं का घर है। आज खेती की बढ़ती लागत, गिरते भूजल और कमजोर होती जमीन को बचाने के लिए हमें मिट्टी की सेहत से शुरुआत करनी होगी।"
            leadEn="Soil is not lifeless dust—it is a living home for earthworms, roots, and friendly microbes. To lower rising farm costs and protect scarce water, everything begins with healing the soil."
            lang={lang}
          />

          {/* Commissioned Large Editorial Artwork #1: Living Soil Cutaway */}
          <figure className="rounded-3xl overflow-hidden border border-[#E5DEC9] bg-[#FAF9F4]">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <ResilientImage
                assetKey="jaivikWhyLivingSoil"
                alt={
                  hi
                    ? 'जीवित मिट्टी का दृश्य — ऊपर लहलहाती हरी फसल और नीचे गहरी जड़ें, केंचुए व नमी से भरपूर उपजाऊ मिट्टी'
                    : 'Living soil cross-section showing lush green crops above ground and deep white roots, plump earthworms, and rich dark moist humus below'
                }
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption
              className={`px-5 sm:px-7 py-3.5 text-xs sm:text-[13.5px] text-[#455A4B] border-t border-[#E5DEC9] ${
                hi ? 'font-hindi' : ''
              }`}
            >
              {hi
                ? 'स्वस्थ और जीवित मिट्टी: ऊपर हरी-भरी फसलें और नीचे मजबूत जड़ें, केंचुए, प्राकृतिक खाद व नमी — यही टिकाऊ खेती की असली नींव है।'
                : 'Healthy living soil: thriving crops above ground nourished by deep roots, earthworms, organic humus, and trapped rainwater below.'}
            </figcaption>
          </figure>

          {/* 4 Simple Farmer-Friendly "Why" Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHY_REASONS.map((item) => (
              <article
                key={item.num}
                className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-6 sm:p-7 space-y-2.5"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-extrabold text-[#B57D1E] tabular-nums">
                    {item.num}
                  </span>
                  <h3
                    className={`text-lg sm:text-[19px] font-extrabold text-[#124520] leading-snug ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi ? item.hiTitle : item.enTitle}
                  </h3>
                </div>
                <p
                  className={`text-sm sm:text-[15px] text-[#314738] leading-[1.72] ${
                    hi ? 'font-hindi' : ''
                  }`}
                >
                  {hi ? item.hiBody : item.enBody}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SECTION 02 — NATURAL VS ORGANIC FARMING (PDF 3.2 — NEVER CONFUSE THE TWO!) */}
      <section className="py-14 sm:py-20 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="02"
            kickerHi="सही समझ — दोनों एक नहीं हैं"
            kickerEn="Clear Distinction — Two Different Methods"
            titleHi="प्राकृतिक खेती और जैविक खेती में सीधा-सरल अंतर"
            titleEn="Natural Farming vs. Organic Farming — Explained Simply"
            leadHi="अक्सर लोग प्राकृतिक खेती और जैविक खेती को एक ही समझ लेते हैं। GOVEDA दोनों को बिल्कुल अलग और साफ़ तरीके से समझाती है ताकि किसान अपनी सुविधा और जमीन के हिसाब से सही रास्ता चुन सकें।"
            leadEn="People often mix up Natural Farming and Organic Farming. GOVEDA explains both clearly and separately so every farmer can choose what truly fits their land and budget."
            lang={lang}
          />

          {/* Commissioned Large Editorial Artwork #2: Natural vs Organic Side-by-Side */}
          <figure className="rounded-3xl overflow-hidden border border-[#E5DEC9] bg-white">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <ResilientImage
                assetKey="jaivikNaturalVsOrganic"
                alt={
                  hi
                    ? 'बाईं ओर मिट्टी के घड़े में जीवामृत व सूखे भूसे की मल्चिंग (प्राकृतिक खेती) और दाईं ओर वर्मीकम्पोस्ट व प्रमाणित जैविक सब्जियाँ (जैविक खेती)'
                    : 'Left side showing traditional Jeevamrit clay pot and golden straw mulching for Natural Farming; right side showing vermicompost bed, neem leaves, and graded Organic Farming produce'
                }
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption
              className={`px-5 sm:px-7 py-3.5 text-xs sm:text-[13.5px] text-[#455A4B] border-t border-[#E5DEC9] ${
                hi ? 'font-hindi' : ''
              }`}
            >
              {hi
                ? 'बाएँ: जीवामृत, सूखे भूसे की मल्चिंग और सह-फसलों पर आधारित प्राकृतिक खेती · दाएँ: वर्मीकम्पोस्ट, जैविक मानकों और प्रमाणन पर आधारित जैविक खेती।'
                : 'Left: Natural Farming using on-farm Jeevamrit, straw mulching, and companion crops · Right: Organic Farming using structured vermicompost, permitted bio-inputs, and certified harvest standards.'}
            </figcaption>
          </figure>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Natural Farming Card */}
            <article className="rounded-3xl bg-white border border-[#D9E3CF] p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#2E7D32]">
                  {hi ? 'पद्धति 01 · Natural Farming' : 'Approach 01 · Natural Farming'}
                </span>
                <Sprout className="w-5 h-5 text-[#2E7D32]" aria-hidden="true" />
              </div>
              <h3
                className={`text-xl sm:text-2xl font-extrabold text-[#124520] ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi ? 'प्राकृतिक खेती (Natural Farming)' : 'Natural Farming'}
              </h3>
              <p
                className={`text-sm sm:text-[15.5px] text-[#314738] leading-[1.72] ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? 'यह पूरी तरह खेत और गाँव के स्थानीय संसाधनों पर आधारित तरीका है — जिसमें देसी गाय के गोबर-गोमूत्र से बना जीवामृत, सूखे अवशेषों से जमीन ढकना (मल्चिंग) और एक साथ अलग-अलग फसलें उगाकर मिट्टी की कुदरती ताकत बढ़ाई जाती है।'
                  : 'An ecological approach rooted in local on-farm resources—using Jeevamrit, crop-residue mulching, and mixed cropping to awaken the soil’s own natural ecosystem with minimal outside purchases.'}
              </p>
              <ul className="space-y-2 pt-1 text-sm text-[#2A4231]">
                {(hi
                  ? [
                      'स्थानीय जैविक संसाधन और जीवामृत जैसे घरेलू इनपुट',
                      'मल्चिंग से नमी की सुरक्षा और खरपतवार नियंत्रण',
                      'फसल विविधता — एक खेत में सहायक फसलों का मेल',
                    ]
                  : [
                      'On-farm bio-inputs such as Jeevamrit and local biomass',
                      'Straw mulching to lock in moisture and shade soil',
                      'Crop diversity and companion planting to protect soil health',
                    ]
                ).map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-[#2E7D32] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span className={hi ? 'font-hindi' : ''}>{pt}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Organic Farming Card */}
            <article className="rounded-3xl bg-[#144721] text-white border border-[#144721] p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#E5C168]">
                  {hi ? 'पद्धति 02 · Organic Farming' : 'System 02 · Organic Farming'}
                </span>
                <ShieldCheck className="w-5 h-5 text-[#E5C168]" aria-hidden="true" />
              </div>
              <h3
                className={`text-xl sm:text-2xl font-extrabold text-white ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi ? 'जैविक खेती (Organic Farming)' : 'Organic Farming'}
              </h3>
              <p
                className={`text-sm sm:text-[15.5px] text-white/90 leading-[1.72] ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? 'यह तय किए गए जैविक मानकों पर आधारित व्यवस्थित कृषि प्रणाली है — इसमें अनुमत जैविक खाद (जैसे कम्पोस्ट व वर्मीकम्पोस्ट), सुरक्षित जैविक कीट नियंत्रण, मिट्टी प्रबंधन और बाजार के लिए आवश्यकतानुसार आधिकारिक प्रमाणन (Certification) शामिल होता है।'
                  : 'A standards-based farming system that uses permitted organic inputs (such as tested compost and vermicompost), structured soil and pest management, and formal organic certification when needed for market access.'}
              </p>
              <ul className="space-y-2 pt-1 text-sm text-white/90">
                {(hi
                  ? [
                      'निर्धारित जैविक मानकों के अनुसार अनुमत खाद व इनपुट',
                      'वैज्ञानिक मिट्टी प्रबंधन व सुरक्षित जैविक कीट नियंत्रण',
                      'आवश्यकतानुसार प्रमाणन (Certification) और गुणवत्ता मानक',
                    ]
                  : [
                      'Permitted organic manure and inputs meeting prescribed standards',
                      'Structured soil fertility and biological pest management',
                      'Formal organic certification and quality labelling where required',
                    ]
                ).map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-[#E5C168] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span className={hi ? 'font-hindi' : ''}>{pt}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 4. SECTION 03 — WHAT GOVEDA WILL WORK ON (6 FOCUS AREAS + WATER-SMART FARM ARTWORK) */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="03"
            kickerHi="हम किन क्षेत्रों पर काम करना चाहते हैं?"
            kickerEn="Our Focus Areas — Practical Support on the Ground"
            titleHi="मिट्टी जाँच, देसी खाद, जल बचत और गाँव की कमाई — 6 मुख्य स्तंभ"
            titleEn="Six Connected Ways GOVEDA Supports Small Farmers & Villages"
            leadHi="अकेले खाद बदलने से काम नहीं चलता — मिट्टी, पानी, बीज, गौशाला खाद, फसल चयन और बाजार जब साथ जुड़ते हैं, तभी किसान को असली लाभ मिलता है।"
            leadEn="Real change happens when soil health, water efficiency, Gaushala bio-inputs, field trials, crop diversity, and village markets work hand in hand."
            lang={lang}
          />

          {/* 6 Crisp Focus Cards (Reference-Inspired Clarity) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FOCUS_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <article
                  key={area.code}
                  className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E2DAC6] text-[#144721] flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-extrabold text-[#B57D1E] tabular-nums">
                      {area.code}
                    </span>
                  </div>
                  <h3
                    className={`text-lg font-extrabold text-[#124520] ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi ? area.hiTitle : area.enTitle}
                  </h3>
                  <p
                    className={`text-sm text-[#354B3C] leading-[1.68] ${
                      hi ? 'font-hindi' : ''
                    }`}
                  >
                    {hi ? area.hiDesc : area.enDesc}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Commissioned Large Editorial Artwork #3: Drip Irrigation, Mulch & Rainwater Farm Pond */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center pt-2">
            <figure className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#E5DEC9] bg-[#FAF9F4]">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <ResilientImage
                  assetKey="jaivikWaterDripFarm"
                  alt={
                    hi
                      ? 'ड्रिप सिंचाई, सूखे भूसे की मल्चिंग, खेत तलाई (वर्षा जल कुंड) और अरावली की पहाड़ियों के बीच हरा-भरा राजस्थान का खेत'
                      : 'Water-smart Rajasthan farm with drip irrigation releasing water droplets onto mulched tomato plants beside a stone-lined rainwater pond and Aravalli hills'
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption
                className={`px-5 py-3 text-xs text-[#455A4B] border-t border-[#E5DEC9] ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? 'ड्रिप सिंचाई + मल्चिंग + वर्षा जल संग्रहण (खेत तलाई) — कम पानी में भी स्वस्थ फसल।'
                  : 'Drip irrigation + straw mulching + rainwater farm pond — keeping dryland crops resilient.'}
              </figcaption>
            </figure>

            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#1D6FA3]">
                  {hi ? 'जल संरक्षण और गोबर खाद का मेल' : 'Water Security Meets Gaushala Compost'}
                </p>
                <h3
                  className={`text-xl sm:text-2xl font-extrabold text-[#124520] leading-snug ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'गौशाला से शुद्ध खाद और खेत में हर बूँद की बचत'
                    : 'Quality Gaushala Compost & Smart Water Conservation'}
                </h3>
                <p
                  className={`text-sm sm:text-[15px] text-[#354B3C] leading-[1.7] ${
                    hi ? 'font-hindi' : ''
                  }`}
                >
                  {hi
                    ? 'आत्मनिर्भर गौशाला मिशन से जुड़कर गुणवत्तापूर्ण कम्पोस्ट, वर्मीकम्पोस्ट और बायोगैस की उपचारित स्लरी किसानों तक पहुँचाई जाएगी। किसी भी खाद या उत्पाद को बाजार में बेचने से पहले उसकी गुणवत्ता, लेबलिंग और सरकारी नियमों की पूरी जाँच होगी।'
                    : 'Working alongside Self-Reliant Gaushalas, GOVEDA helps connect farmers with tested compost, vermicompost, and treated biogas slurry. Before any product is sold in the market, all quality, labelling, and statutory rules are strictly verified.'}
                </p>
              </div>

              {/* 6 Soil Lab Tests Mini Checklist */}
              <div className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-5 space-y-3">
                <p className="text-xs font-extrabold tracking-[0.12em] uppercase text-[#144721]">
                  {hi
                    ? 'प्रयोगशाला मिट्टी जाँच में क्या देखा जाता है?'
                    : 'What Accredited Lab Soil Testing Checks:'}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-[13px] text-[#2F4636]">
                  {SIX_SOIL_CHECKS.map((chk) => (
                    <li key={chk.en} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-[#3A7D2C] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className={hi ? 'font-hindi' : ''}>
                        {hi ? chk.hi : chk.en}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 04 — STEP-BY-STEP SEQUENCE: HEALTHY SOIL TO BETTER FARMING (5 STEPS + 4-PLOT TRIAL) */}
      <section className="py-14 sm:py-20 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="04"
            kickerHi="कदम-दर-कदम आसान प्रक्रिया"
            kickerEn="Step-by-Step Journey — Healthy Soil to Better Farming"
            titleHi="स्वस्थ मिट्टी से बेहतर खेती तक — 5 सरल कदम"
            titleEn="Five Practical Steps Every Small Farmer Can Follow"
            leadHi="बिना किसी बड़े जोखिम के, अपने खेत को धीरे-धीरे मजबूत और कम लागत वाला बनाने का व्यावहारिक रास्ता।"
            leadEn="A clear, low-risk sequence designed so any small farmer can improve soil health and reduce avoidable costs at their own pace."
            lang={lang}
          />

          {/* 5-Step Connected Flow Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {FIVE_STEPS.map((item, idx) => (
              <div
                key={item.step}
                className="relative rounded-2xl bg-white border border-[#E5DEC9] p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#144721] text-white text-xs font-extrabold tabular-nums">
                      {item.step}
                    </span>
                    {idx < FIVE_STEPS.length - 1 && (
                      <ArrowRight
                        className="hidden md:block w-4 h-4 text-[#B57D1E]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <h3
                    className={`text-[15.5px] font-extrabold text-[#124520] leading-snug ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi ? item.hiTitle : item.enTitle}
                  </h3>
                  <p
                    className={`text-xs sm:text-[13.5px] text-[#354B3C] leading-[1.65] ${
                      hi ? 'font-hindi' : ''
                    }`}
                  >
                    {hi ? item.hiDesc : item.enDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Commissioned Large Editorial Artwork #4: Farmer + Soil Scientist Training + Interactive 4-Plot Trial */}
          <div className="rounded-3xl bg-white border border-[#E5DEC9] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6 min-h-[260px] lg:min-h-full">
                <ResilientImage
                  assetKey="jaivikFarmerTrainingField"
                  alt={
                    hi
                      ? 'खेत में राजस्थानी किसान और कृषि विशेषज्ञ साथ बैठकर उपजाऊ जैविक मिट्टी और फसलों की जाँच करते हुए'
                      : 'Rajasthani farmer in traditional turban and Indian soil scientist examining rich organic compost and healthy seedlings together in a sunlit drip-irrigated field'
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col justify-center">
                <div className="space-y-2">
                  <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#B57D1E]">
                    {hi
                      ? 'किसान प्रदर्शन खेत · पहले खेत पर देखें, फिर भरोसा करें'
                      : 'Farmer Demonstration Plots · See Proof on Real Land'}
                  </p>
                  <h3
                    className={`text-xl sm:text-2xl font-extrabold text-[#124520] ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi
                      ? '4-प्लॉट तुलनात्मक परीक्षण कैसे काम करता है?'
                      : 'How the 4-Plot Side-by-Side Trial Works'}
                  </h3>
                  <p
                    className={`text-sm text-[#354B3C] leading-[1.68] ${
                      hi ? 'font-hindi' : ''
                    }`}
                  >
                    {hi
                      ? 'चयनित किसानों के खेत में 4 छोटे हिस्सों पर अलग-अलग तरीके आज़माए जाते हैं। नीचे किसी भी प्लॉट पर क्लिक करके समझें:'
                      : 'Four methods are tested side by side on small plots so every farmer sees honest numbers. Select any plot below:'}
                  </p>
                </div>

                {/* Interactive Segmented Selector for the 4 Trial Plots */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                  role="tablist"
                  aria-label={hi ? '4 प्लॉट परीक्षण चयन' : '4-Plot Trial Selector'}
                >
                  {FOUR_TRIAL_PLOTS.map((plot) => {
                    const isActive = plot.id === activePlot.id;
                    return (
                      <button
                        key={plot.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedPlot(plot.id)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center ${
                          isActive
                            ? 'bg-[#144721] text-white'
                            : 'bg-[#FAF9F4] text-[#144721] border border-[#E5DEC9] hover:bg-[#EDF5E6]'
                        }`}
                      >
                        {hi ? plot.code : plot.codeEn}
                      </button>
                    );
                  })}
                </div>

                {/* Active Plot Explanation */}
                <div className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-5 space-y-2">
                  <h4
                    className={`text-base sm:text-lg font-extrabold text-[#124520] ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi ? activePlot.hiName : activePlot.enName}
                  </h4>
                  <p
                    className={`text-sm text-[#354B3C] leading-[1.7] ${
                      hi ? 'font-hindi' : ''
                    }`}
                  >
                    {hi ? activePlot.hiDetail : activePlot.enDetail}
                  </p>
                  <p className="text-xs font-bold text-[#2E7D32] pt-1">
                    {hi
                      ? 'तुलना के 5 पैमाने: कुल लागत · वास्तविक उत्पादन · पानी की खपत · श्रम · शुद्ध लाभ'
                      : 'Compared across 5 facts: Total Cost · Actual Yield · Water Used · Labour · Net Profit'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <EditorialSafeguardCallout
            lang={lang}
            titleHi="ईमानदार वचन — बिना स्थानीय परीक्षण के कोई झूठा दावा नहीं"
            titleEn="Our Honest Commitment — No Unverified Promises"
            bodyHi="बिना स्थानीय खेत परीक्षण के किसी भी खेती पद्धति से निश्चित रूप से अधिक उपज या दोगुनी आय होने का दावा नहीं किया जाता। नई फसल अपनाने से पहले किसान को बाजार की माँग, लागत और संभावित जोखिम साफ-साफ समझाया जाता है।"
            bodyEn="GOVEDA never claims guaranteed higher yields or fixed income without local field proof. Before advising any new crop, farmers are clearly informed about real market demand, cultivation costs, and potential risks."
          />
        </div>
      </section>

      {/* 6. SECTION 05 — RURAL LIVELIHOODS BEYOND FARMING (PDF 3.4) & HONEST MEASUREMENT (PDF 3.5) */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="05"
            kickerHi="खेती के साथ पूरे गाँव की आत्मनिर्भरता"
            kickerEn="Rural Livelihoods Beyond the Farm"
            titleHi="ग्रामीण विकास केवल खेत तक सीमित नहीं — पूरे परिवार के लिए अवसर"
            titleEn="Strengthening the Entire Village Economy Across Eight Pathways"
            leadHi="जब खेती की उपज के साथ स्थानीय प्रसंस्करण, महिला उद्यम, हस्तशिल्प, युवा प्रशिक्षण और सीधा बाजार जुड़ता है, तब गाँव के युवाओं और महिलाओं को अपने घर के पास सम्मानजनक रोजगार मिलता है।"
            leadEn="When sustainable harvests connect with local processing, women’s enterprises, rural crafts, youth skills, and direct markets, entire village families gain steady year-round dignity."
            lang={lang}
          />

          {/* Commissioned Large Editorial Artwork #5: Prosperous Indian Village Hub */}
          <figure className="rounded-3xl overflow-hidden border border-[#E5DEC9] bg-[#FAF9F4]">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <ResilientImage
                assetKey="jaivikRuralLivelihoodHarvest"
                alt={
                  hi
                    ? 'समृद्ध भारतीय गाँव का दृश्य — नीम के पेड़ के नीचे किसान व महिलाएँ ताज़ी जैविक सब्ज़ियाँ, दालें और जैविक खाद तैयार करते हुए'
                    : 'Vibrant Indian village agricultural hub under a Neem tree where farmers and women artisans sort fresh organic produce, pulses, and organic compost beside a solar storehouse'
                }
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption
              className={`px-5 sm:px-7 py-3.5 text-xs sm:text-[13.5px] text-[#455A4B] border-t border-[#E5DEC9] ${
                hi ? 'font-hindi' : ''
              }`}
            >
              {hi
                ? 'खेती से ग्रामीण उद्यम तक: ताज़ी उपज, जैविक खाद, महिला व युवा सहभागिता और स्थानीय बाजार नेटवर्क।'
                : 'From farm to village enterprise: graded produce, organic compost, women and youth participation, and direct market channels.'}
            </figcaption>
          </figure>

          {/* 8 Livelihood Pathways */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RURAL_LIVELIHOODS.map((item, idx) => (
              <div
                key={item.en}
                className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-5 space-y-1.5"
              >
                <span className="text-xs font-extrabold text-[#B57D1E] tabular-nums">
                  0{idx + 1}
                </span>
                <p
                  className={`text-sm sm:text-[15px] font-bold text-[#124520] leading-snug ${
                    hi ? 'font-hindi' : ''
                  }`}
                >
                  {hi ? item.hi : item.en}
                </p>
              </div>
            ))}
          </div>

          {/* Transparent Impact Measurement Strip (PDF 3.5) */}
          <div className="rounded-3xl bg-[#144721] text-white p-6 sm:p-8 lg:p-10 space-y-5">
            <div className="space-y-1.5 max-w-3xl">
              <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#E5C168]">
                {hi ? 'सफलता कैसे मापी जाएगी?' : 'How We Measure Real Progress'}
              </p>
              <h3
                className={`text-xl sm:text-2xl font-extrabold text-white ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi
                  ? 'कागज़ी आँकड़े नहीं — खेत के 6 असली पैमानों पर पारदर्शी मूल्यांकन'
                  : 'Transparent Evaluation Across Six Real Farm Indicators'}
              </h3>
              <p
                className={`text-sm text-white/85 leading-relaxed ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? 'प्रत्येक परिणाम का आकलन करते समय मौसम, फसल, भूमि की किस्म और बाजार मूल्य के असर को भी पूरी ईमानदारी से शामिल किया जाता है।'
                  : 'Every outcome transparently accounts for seasonal weather, crop type, soil condition, and local market price changes.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {IMPACT_METRICS.map((metric) => (
                <div
                  key={metric.en}
                  className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 flex items-center gap-2.5 text-sm font-semibold text-white"
                >
                  <CheckCircle2
                    className="w-4 h-4 text-[#E5C168] shrink-0"
                    aria-hidden="true"
                  />
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? metric.hi : metric.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 06 — SIMPLE FARMER FAQs */}
      <section className="py-14 sm:py-16 bg-[#FAF9F4] border-b border-[#E5DEC9]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <EditorialSectionHeader
            index="06"
            kickerHi="किसानों के मन में आने वाले सामान्य सवाल"
            kickerEn="Common Farmer Questions"
            titleHi="सीधे और ईमानदार उत्तर"
            titleEn="Straightforward, Honest Answers"
            lang={lang}
          />
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.qEn}
                  className="rounded-2xl border border-[#E5DEC9] bg-white overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-[15.5px] text-[#124520] cursor-pointer"
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
                      className={`px-5 pb-5 pt-2.5 border-t border-[#E5DEC9] text-sm text-[#354B3C] leading-[1.72] ${
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

      {/* 8. SECTION 07 — HOW FARMERS CAN JOIN + LIVE FARMER REGISTRATION FORM */}
      <section id="farmer-registration" className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="07"
            kickerHi="किसान कैसे जुड़ सकते हैं?"
            kickerEn="How Farmers Can Join"
            titleHi="3 आसान चरणों में GOVEDA किसान नेटवर्क से जुड़ें"
            titleEn="Connect With GOVEDA’s Farming Mission in 3 Simple Steps"
            leadHi="मिट्टी स्वास्थ्य जागरूकता, प्राकृतिक व जैविक खेती प्रशिक्षण, 4-प्लॉट प्रदर्शन खेत या कृषि विशेषज्ञ मार्गदर्शन के लिए नीचे अपना पंजीकरण दर्ज करें।"
            leadEn="Register below to connect with our team for soil health awareness, natural & organic farming workshops, demonstration plots, and local field guidance."
            lang={lang}
          />

          {/* 3-Step Visual Joining Guide (Reference-Inspired Clarity) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '1',
                icon: Sprout,
                hiTitle: 'सरल फॉर्म में अपनी जानकारी भरें',
                enTitle: 'Share Your Farm Details',
                hiDesc:
                  'अपना नाम, गाँव, जिला, जमीन का आकार, मुख्य फसल और सिंचाई स्रोत लिखें।',
                enDesc:
                  'Enter your name, village, district, landholding, primary crops, and irrigation source.',
              },
              {
                num: '2',
                icon: PhoneCall,
                hiTitle: 'GOVEDA टीम आपसे संपर्क करेगी',
                enTitle: 'Our Field Team Contacts You',
                hiDesc:
                  'हमारी स्थानीय टीम या हरित मित्र आपसे बात कर आपकी मिट्टी व फसल की जरूरत समझेंगे।',
                enDesc:
                  'Our local coordinator or Harit Mitra reaches out to understand your soil and crop needs.',
              },
              {
                num: '3',
                icon: Users,
                hiTitle: 'प्रशिक्षण, जाँच व व्यावहारिक मार्गदर्शन',
                enTitle: 'Training, Testing & Guidance',
                hiDesc:
                  'आपको नज़दीकी मिट्टी जाँच शिविर, किसान प्रशिक्षण और प्रदर्शन खेत की जानकारी मिलेगी।',
                enDesc:
                  'Receive updates on nearby soil-testing camps, practical workshops, and demonstration fields.',
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-2xl bg-[#FAF9F4] border border-[#E5DEC9] p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#144721] text-white text-xs font-extrabold tabular-nums">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-[#2E7D32]" aria-hidden="true" />
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-extrabold text-[#124520] ${
                      hi ? 'font-hindi' : 'font-editorial'
                    }`}
                  >
                    {hi ? step.hiTitle : step.enTitle}
                  </h3>
                  <p
                    className={`text-sm text-[#354B3C] leading-relaxed ${
                      hi ? 'font-hindi' : ''
                    }`}
                  >
                    {hi ? step.hiDesc : step.enDesc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Privacy Guarantee Banner (PDF 3.3A) */}
          <div className="rounded-2xl bg-[#F2F7EE] border border-[#CBE0BE] px-5 py-4 flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-[#144721] shrink-0 mt-0.5" aria-hidden="true" />
            <p
              className={`text-xs sm:text-sm text-[#1E4728] leading-relaxed ${
                hi ? 'font-hindi' : ''
              }`}
            >
              <strong className="font-extrabold">
                {hi ? 'किसान गोपनीयता गारंटी: ' : 'Farmer Privacy Guarantee: '}
              </strong>
              {hi
                ? 'आपकी सहमति से ली गई भूमि जानकारी, मोबाइल नंबर और व्यक्तिगत विवरण कभी सार्वजनिक रूप से वेबसाइट पर नहीं दिखाए जाएँगे। यह जानकारी केवल GOVEDA के कृषि मार्गदर्शन व प्रशिक्षण समन्वय के लिए सुरक्षित रहती है।'
                : 'Your land details, phone number, and personal information collected with consent are never displayed publicly on the website—they remain confidential for GOVEDA’s farming guidance and training coordination.'}
            </p>
          </div>

          {/* Real Live Farmer Registration Form (Synced with Admin CMS) */}
          <div className="rounded-3xl border border-[#E5DEC9] bg-[#FAF9F4] p-4 sm:p-6 lg:p-8">
            <RegistrationPortal
              lang={lang}
              records={records}
              onAddRecord={onAddRecord}
              initialCategory="farmer"
              allowedCategories={['farmer']}
            />
          </div>

          {/* Quiet Link to Projects & Campaigns */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E5DEC9]">
            <p className={`text-sm text-[#354B3C] ${hi ? 'font-hindi' : ''}`}>
              {hi
                ? 'क्या आप इस मिशन के अंतर्गत सक्रिय परियोजनाएँ और अभियान देखना चाहते हैं?'
                : 'Want to explore active district projects and campaigns across Rajasthan?'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/projects')}
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#F3F6EE] text-[#144721] border border-[#144721]/30 px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>
                {hi ? 'परियोजनाएँ व अभियान देखें' : 'Explore Projects & Campaigns'}
              </span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
