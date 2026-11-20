import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  ChevronDown,
  Code2,
  Cpu,
  Database,
  Droplets,
  FileSpreadsheet,
  Flame,
  Globe,
  GraduationCap,
  Handshake,
  HeartPulse,
  KeyRound,
  Languages,
  Laptop,
  Leaf,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Monitor,
  Package,
  Palette,
  PhoneCall,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Sprout,
  Sun,
  Tractor,
  TrendingUp,
  UserCheck,
  Users,
  Utensils,
  Wallet,
  Wrench,
} from 'lucide-react';
import { EditorialSectionHeader, EditorialSafeguardCallout } from '../components/MissionEditorialShell';
import { ResilientImage } from '../components/ResilientImage';
import { usePublicPortal } from '../context/PublicPortalContext';
import { filterUnifiedProgrammes } from '../utils/adminLogic';
import { normalizeMobile } from '../utils/govedaLogic';
import type { Language, RegistrationRecord } from '../types/goveda';

interface SkillDevelopmentPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const WHY_NEEDED_PILLARS = [
  {
    num: '01',
    icon: Briefcase,
    hiTitle: 'डिग्री के बावजूद व्यावहारिक कौशल का अभाव',
    enTitle: 'Education Without Practical Job Skills',
    hiBody:
      'ग्रामीण और कस्बाई क्षेत्रों में बड़ी संख्या में शिक्षित युवा बेरोज़गारी से जूझते हैं क्योंकि उनके पास आज के बाजार, डिजिटल कार्य और तकनीकी उद्योग की ज़रूरत के अनुसार व्यावहारिक कौशल नहीं होता।',
    enBody:
      'Many rural and semi-urban youth remain jobless despite formal schooling because they lack hands-on digital, language, or technical skills aligned with today’s workplaces.',
  },
  {
    num: '02',
    icon: Sprout,
    hiTitle: 'पारंपरिक खेती की बढ़ती लागत और जल संकट',
    enTitle: 'Rising Farming Costs & Water Stress',
    hiBody:
      'आधुनिक सिंचाई, मिट्टी-पानी परीक्षण, पॉलीहाउस और उच्च-मूल्य फसलों के प्रशिक्षण के बिना छोटे किसान अधिक मेहनत के बावजूद कम आय और संसाधन संकट में फँसे रहते हैं।',
    enBody:
      'Without training in water-saving drip systems, soil testing, protected cultivation, and grading, smallholder farmers face rising input costs and fragile incomes.',
  },
  {
    num: '03',
    icon: Scissors,
    hiTitle: 'महिलाओं के हुनर को उद्यम व बाजार से जोड़ने की ज़रूरत',
    enTitle: 'Unrecognised Rural Women’s Enterprise Potential',
    hiBody:
      'लाखों ग्रामीण महिलाओं के पास सिलाई, खाद्य प्रसंस्करण और हस्तशिल्प की क्षमता है, लेकिन पैकेजिंग, वित्तीय साक्षरता और ऑनलाइन बिक्री की जानकारी न होने से वे आत्मनिर्भर नहीं बन पातीं।',
    enBody:
      'Rural women carry deep craft and food-processing talent, yet lack structured training in packaging, financial literacy, SHG management, and online selling.',
  },
  {
    num: '04',
    icon: ShieldAlert,
    hiTitle: 'बढ़ता डिजिटल उपयोग और ऑनलाइन धोखाधड़ी का जोखिम',
    enTitle: 'Rapid Digital Adoption Without Cyber Safety',
    hiBody:
      'UPI, मोबाइल बैंकिंग और इंटरनेट अब हर गाँव तक पहुँच गए हैं, लेकिन साइबर जागरूकता के अभाव में किसान, महिलाएं और बुजुर्ग फ़र्ज़ी लिंक व ठगी के शिकार हो जाते हैं।',
    enBody:
      'Mobile payments and internet access have reached every village, yet rural families, elders, and students remain vulnerable to phishing links and UPI fraud.',
  },
];

const FOUR_JOURNEY_STAGES = [
  {
    step: '01',
    icon: BookOpen,
    hiLabel: 'सीखें (Learn)',
    enLabel: 'Learn',
    hiDesc: 'कृषि, भाषा, डिजिटल या तकनीकी क्षेत्र के मूल सिद्धांत सरल और व्यावहारिक भाषा में समझें।',
    enDesc: 'Build clear fundamentals in agriculture, languages, digital work, or technical trades.',
  },
  {
    step: '02',
    icon: Wrench,
    hiLabel: 'अभ्यास करें (Practice)',
    enLabel: 'Practice',
    hiDesc: 'प्रशिक्षकों के मार्गदर्शन में उपकरणों, सॉफ्टवेयर, संवाद और खेत/कार्यशाला अभ्यास से अनुभव लें।',
    enDesc: 'Practise directly with tools, software, conversation labs, and supervised field demonstrations.',
  },
  {
    step: '03',
    icon: Award,
    hiLabel: 'कौशल विकसित करें (Develop Skills)',
    enLabel: 'Develop Skills',
    hiDesc: 'केवल प्रमाणपत्र नहीं, बल्कि वास्तविक कार्य-दक्षता, गुणवत्ता समझ और आत्मविश्वास अर्जित करें।',
    enDesc: 'Move beyond paper certificates toward genuine work competence, quality discipline, and confidence.',
  },
  {
    step: '04',
    icon: TrendingUp,
    hiLabel: 'अवसर तलाशें (Explore Opportunities)',
    enLabel: 'Explore Opportunities',
    hiDesc: 'रोज़गार की तैयारी, स्वरोज़गार, उच्च-मूल्य खेती या स्थानीय उद्यम के व्यावहारिक रास्ते पहचानें।',
    enDesc: 'Explore realistic pathways for employment readiness, self-employment, or rural micro-enterprise.',
  },
];

const MODERN_AGRI_TOPICS = [
  { icon: Sprout, hi: 'आधुनिक खेती (Modern Farming)', en: 'Modern Scientific Farming' },
  { icon: Sparkles, hi: 'इजराइली कृषि तकनीक', en: 'Israeli Agricultural Techniques' },
  { icon: Droplets, hi: 'ड्रिप एवं माइक्रो इरिगेशन', en: 'Drip & Micro Irrigation' },
  { icon: Droplets, hi: 'स्प्रिंकलर व स्मार्ट सिंचाई', en: 'Smart Sprinkler Systems' },
  { icon: Building2, hi: 'पॉलीहाउस एवं ग्रीनहाउस खेती', en: 'Greenhouse & Polyhouse' },
  { icon: Leaf, hi: 'शेडनेट हाउस खेती', en: 'Shade-Net Farming' },
  { icon: Sprout, hi: 'हाइड्रोपोनिक्स व एरोपोनिक्स परिचय', en: 'Hydroponics & Aeroponics Intro' },
  { icon: Database, hi: 'मिट्टी व पानी परीक्षण (pH व पोषक तत्व)', en: 'Soil & Water Testing (pH & Nutrients)' },
  { icon: Droplets, hi: 'फर्टिगेशन एवं संतुलित पोषण', en: 'Fertigation & Nutrient Balance' },
  { icon: Leaf, hi: 'जैविक, प्राकृतिक खेती व वर्मी कम्पोस्ट', en: 'Organic Farming & Vermicompost' },
  { icon: Tractor, hi: 'कृषि मशीनरी एवं ड्रोन का परिचय', en: 'Agri Machinery & Drone Basics' },
  { icon: Sprout, hi: 'नर्सरी, पौध व हाई-वैल्यू फल-सब्जी', en: 'Nursery & High-Value Crops' },
  { icon: Package, hi: 'ग्रेडिंग, पैकेजिंग और मार्केटिंग', en: 'Crop Grading, Packaging & Marketing' },
];

const ISRAELI_TECH_POINTS = [
  { hi: 'ड्रिप इरिगेशन एवं पानी की बचत', en: 'Precision Drip & Water Savings' },
  { hi: 'प्रिसिजन एग्रीकल्चर व सेंसर सिंचाई', en: 'Precision & Sensor-Based Irrigation' },
  { hi: 'ग्रीनहाउस एवं नियंत्रित वातावरण खेती', en: 'Controlled-Environment Greenhouses' },
  { hi: 'फर्टिगेशन व हाई-डेंसिटी प्लांटेशन', en: 'Fertigation & High-Density Plantation' },
  { hi: 'आधुनिक नर्सरी एवं गुणवत्ता प्रबंधन', en: 'Modern Nurseries & Market Quality' },
];

const FOREIGN_LANGUAGES = [
  { code: 'DE', hi: 'जर्मन (German)', en: 'German', featured: true, noteHi: 'विशेष प्राथमिकता', noteEn: 'Priority Focus' },
  { code: 'EN', hi: 'अंग्रेजी (English)', en: 'English', featured: false },
  { code: 'FR', hi: 'फ्रेंच (French)', en: 'French', featured: false },
  { code: 'ES', hi: 'स्पेनिश (Spanish)', en: 'Spanish', featured: false },
  { code: 'IT', hi: 'इटालियन (Italian)', en: 'Italian', featured: false },
  { code: 'JA', hi: 'जापानी (Japanese)', en: 'Japanese', featured: false },
  { code: 'KO', hi: 'कोरियन (Korean)', en: 'Korean', featured: false },
  { code: 'AR', hi: 'अरबी (Arabic)', en: 'Arabic', featured: false },
];

const LANGUAGE_LEVELS = [
  { hi: 'प्रारंभिक स्तर (Beginner Level)', en: 'Beginner Level' },
  { hi: 'दैनिक संवाद (Basic Communication)', en: 'Basic Communication' },
  { hi: 'A1 एवं A2 स्तर की तैयारी', en: 'A1 & A2 Level Preparation' },
  { hi: 'B1 एवं B2 तैयारी (प्रशिक्षक उपलब्धता अनुसार)', en: 'B1 & B2 Prep (Subject to Trainer Availability)' },
  { hi: 'Speaking, Listening, Reading व Writing अभ्यास', en: 'Speaking, Listening, Reading & Writing' },
  { hi: 'इंटरव्यू एवं व्यावसायिक संवाद तैयारी', en: 'Interview & Workplace Communication' },
];

const DIGITAL_IT_COURSES = [
  { icon: Monitor, hi: 'बेसिक कंप्यूटर कोर्स', en: 'Basic Computer Course' },
  { icon: FileSpreadsheet, hi: 'MS Office एवं Excel', en: 'MS Office & Excel' },
  { icon: Mail, hi: 'इंटरनेट एवं ईमेल उपयोग', en: 'Internet & Email' },
  { icon: Laptop, hi: 'डिजिटल साक्षरता (Digital Literacy)', en: 'Digital Literacy' },
  { icon: Database, hi: 'डेटा एंट्री अभ्यास', en: 'Data Entry Skills' },
  { icon: Palette, hi: 'ग्राफिक डिजाइनिंग', en: 'Graphic Designing' },
  { icon: Globe, hi: 'वेबसाइट डेवलपमेंट', en: 'Website Development' },
  { icon: Code2, hi: 'बेसिक कोडिंग', en: 'Basic Coding' },
  { icon: Code2, hi: 'Python प्रोग्रामिंग', en: 'Python Programming' },
  { icon: Cpu, hi: 'Artificial Intelligence का परिचय', en: 'Introduction to AI' },
  { icon: TrendingUp, hi: 'Data Analytics का परिचय', en: 'Introduction to Data Analytics' },
  { icon: Megaphone, hi: 'डिजिटल मार्केटिंग', en: 'Digital Marketing' },
  { icon: MessageSquare, hi: 'सोशल मीडिया प्रबंधन', en: 'Social Media Management' },
  { icon: ShoppingBag, hi: 'ई-कॉमर्स व ऑनलाइन व्यवसाय प्रबंधन', en: 'E-Commerce & Online Business' },
  { icon: Wallet, hi: 'डिजिटल अकाउंटिंग एवं Tally परिचय', en: 'Digital Accounting & Tally' },
];

const CYBER_TOPICS = [
  { icon: ShieldCheck, hi: 'साइबर सुरक्षा की बुनियादी समझ', en: 'Cybersecurity Basics' },
  { icon: ShieldAlert, hi: 'ऑनलाइन धोखाधड़ी से बचाव', en: 'Online Fraud Prevention' },
  { icon: Wallet, hi: 'बैंकिंग और UPI सुरक्षा', en: 'Banking & UPI Safety' },
  { icon: KeyRound, hi: 'पासवर्ड एवं डेटा सुरक्षा', en: 'Password & Data Security' },
  { icon: Users, hi: 'सोशल मीडिया सुरक्षा', en: 'Social Media Safety' },
  { icon: Lock, hi: 'Phishing और Fake Links की पहचान', en: 'Identifying Phishing & Fake Links' },
  { icon: Smartphone, hi: 'मोबाइल एवं कंप्यूटर सुरक्षा', en: 'Mobile & Computer Safety' },
  { icon: Globe, hi: 'सुरक्षित इंटरनेट उपयोग', en: 'Safe Internet Usage' },
  { icon: Code2, hi: 'Ethical Hacking का कानूनी व अधिकृत परिचय', en: 'Lawful & Authorised Ethical Hacking Intro' },
  { icon: GraduationCap, hi: 'विद्यार्थियों, किसानों व बुजुर्गों हेतु जागरूकता', en: 'Cyber Awareness for Students, Farmers & Elders' },
];

const WOMEN_SKILLS = [
  { icon: Scissors, hi: 'सिलाई एवं फैशन डिजाइनिंग', en: 'Tailoring & Fashion Design' },
  { icon: Utensils, hi: 'खाद्य प्रसंस्करण (Food Processing)', en: 'Food Processing' },
  { icon: Package, hi: 'अचार, पापड़ एवं स्थानीय खाद्य उत्पाद', en: 'Pickles, Papad & Local Foods' },
  { icon: Sprout, hi: 'डेयरी उत्पाद निर्माण', en: 'Dairy Product Preparation' },
  { icon: Leaf, hi: 'जैविक खाद व पर्यावरण-अनुकूल उत्पाद', en: 'Organic Fertiliser & Eco Products' },
  { icon: Sparkles, hi: 'हस्तशिल्प एवं पारंपरिक कला', en: 'Handicrafts & Artisan Goods' },
  { icon: Megaphone, hi: 'डिजिटल मार्केटिंग', en: 'Digital Marketing' },
  { icon: ShoppingBag, hi: 'ऑनलाइन उत्पाद बिक्री', en: 'Online Product Selling' },
  { icon: Laptop, hi: 'कंप्यूटर प्रशिक्षण', en: 'Computer Training' },
  { icon: Users, hi: 'स्वयं सहायता समूह (SHG) प्रबंधन', en: 'Self-Help Group Management' },
  { icon: Package, hi: 'पैकेजिंग एवं ब्रांडिंग', en: 'Packaging & Branding' },
  { icon: Wallet, hi: 'छोटे व्यवसाय की योजना व वित्तीय साक्षरता', en: 'Business Planning & Financial Literacy' },
];

const TECHNICAL_SKILLS = [
  { icon: Sparkles, hi: 'इलेक्ट्रिशियन (Electrician)', en: 'Electrician' },
  { icon: Wrench, hi: 'प्लंबिंग (Plumbing)', en: 'Plumbing' },
  { icon: Sun, hi: 'सोलर पैनल इंस्टॉलेशन', en: 'Solar Panel Installation' },
  { icon: Flame, hi: 'बायोगैस प्लांट ऑपरेशन', en: 'Biogas Plant Operation' },
  { icon: Wrench, hi: 'मशीनरी मेंटेनेंस', en: 'Machinery Maintenance' },
  { icon: Flame, hi: 'वेल्डिंग (Welding)', en: 'Welding' },
  { icon: Car, hi: 'ड्राइविंग एवं रोड सेफ्टी', en: 'Driving & Road Safety' },
  { icon: HeartPulse, hi: 'फर्स्ट एड (First Aid)', en: 'First Aid' },
  { icon: Utensils, hi: 'हॉस्पिटैलिटी (Hospitality)', en: 'Hospitality' },
  { icon: ShoppingBag, hi: 'रिटेल एवं सेल्स', en: 'Retail & Sales' },
  { icon: Briefcase, hi: 'उद्यमिता विकास (Entrepreneurship)', en: 'Entrepreneurship Development' },
  { icon: MessageSquare, hi: 'कम्युनिकेशन स्किल', en: 'Communication Skills' },
  { icon: UserCheck, hi: 'इंटरव्यू की तैयारी', en: 'Interview Preparation' },
];

const DELIVERY_MODES = [
  {
    key: 'online',
    assetKey: 'sdModeOnline' as const,
    badgeHi: 'माध्यम A · ऑनलाइन',
    badgeEn: 'Mode A · Online',
    icon: Laptop,
    hiTitle: 'ऑनलाइन प्रशिक्षण (Online Training)',
    enTitle: 'Online Training',
    hiDesc: 'प्रस्तावित कार्यक्रम उपलब्धता के अनुसार घर बैठे मोबाइल या लैपटॉप के माध्यम से डिजिटल अध्ययन सामग्री और मार्गदर्शित सत्रों से सीखें।',
    enDesc: 'Learn from home via mobile or laptop using structured digital study resources and guided sessions, subject to programme availability.',
    hiTag: 'घर से सुविधाजनक सीख',
    enTag: 'Flexible Home Learning',
  },
  {
    key: 'offline',
    assetKey: 'sdModeOffline' as const,
    badgeHi: 'माध्यम B · ऑफलाइन',
    badgeEn: 'Mode B · Offline',
    icon: Building2,
    hiTitle: 'ऑफलाइन प्रशिक्षण (Offline Training)',
    enTitle: 'Offline Training',
    hiDesc: 'भविष्य में जिला प्रशिक्षण केंद्रों और साझेदार शैक्षणिक संस्थानों के माध्यम से व्यवस्थित कक्षा-आधारित प्रशिक्षण सत्र।',
    enDesc: 'Future classroom-based training conducted through district centres and collaborating partner institutions.',
    hiTag: 'कक्षा-आधारित मार्गदर्शन',
    enTag: 'Structured Classroom Batches',
  },
  {
    key: 'practical',
    assetKey: 'sdModePractical' as const,
    badgeHi: 'माध्यम C · व्यावहारिक',
    badgeEn: 'Mode C · Practical',
    icon: Wrench,
    hiTitle: 'व्यावहारिक प्रशिक्षण (Practical Training)',
    enTitle: 'Practical Training',
    hiDesc: 'खेतों, कृषि प्रदर्शन केंद्रों, तकनीकी कार्यशालाओं और उपयुक्त कार्यस्थलों पर उपकरणों व मशीनरी के साथ सीधा व्यावहारिक अनुभव।',
    enDesc: 'Hands-on learning directly with equipment, tools, machinery, and agricultural demonstrations at farms and technical hubs.',
    hiTag: 'प्रत्यक्ष उपकरण अभ्यास',
    enTag: 'Hands-On Field Practice',
  },
];

const COLLAB_PILLARS = [
  { icon: Sprout, hi: 'कृषि विश्वविद्यालय एवं अनुसंधान केंद्र', en: 'Agricultural Universities & Research Hubs' },
  { icon: Wrench, hi: 'तकनीकी एवं व्यावसायिक प्रशिक्षण संस्थान', en: 'Technical & Vocational Institutes' },
  { icon: Languages, hi: 'अनुभवी विदेशी भाषा प्रशिक्षक', en: 'Experienced Foreign Language Trainers' },
  { icon: GraduationCap, hi: 'कौशल विकास एवं शैक्षणिक संगठन', en: 'Skill-Development Organisations' },
  { icon: Building2, hi: 'स्थानीय प्रशिक्षण एवं प्रदर्शन केंद्र', en: 'Local Training & Demonstration Centres' },
  { icon: Handshake, hi: 'उद्योग एवं ज्ञान साझेदार', en: 'Industry & Knowledge Partners' },
];

const INTEREST_SUBJECTS = [
  { value: 'Modern Agriculture & Israeli Farming', hi: 'आधुनिक कृषि एवं इजराइली खेती तकनीक', en: 'Modern Agriculture & Israeli Farming' },
  { value: 'Foreign Language – German (A1/A2)', hi: 'विदेशी भाषा – जर्मन (विशेष प्राथमिकता)', en: 'Foreign Language – German (Priority)' },
  { value: 'Foreign Languages – English / French / Japanese / Others', hi: 'विदेशी भाषा – अंग्रेजी / फ्रेंच / जापानी / अन्य', en: 'Foreign Languages – English / French / Japanese / Others' },
  { value: 'Computer, IT, AI & Digital Marketing', hi: 'कंप्यूटर, IT, AI एवं डिजिटल स्किल', en: 'Computer, IT, AI & Digital Skills' },
  { value: 'Cybersecurity & Digital Safety Awareness', hi: 'साइबर सुरक्षा एवं डिजिटल जागरूकता', en: 'Cybersecurity & Digital Safety Awareness' },
  { value: 'Women Skill Development & Self-Employment', hi: 'महिला कौशल विकास एवं स्वरोजगार', en: 'Women Skill Development & Self-Employment' },
  { value: 'Technical & Vocational Trades (Solar, Electrician, Biogas, etc.)', hi: 'तकनीकी व रोजगारपरक ट्रेड (सोलर, इलेक्ट्रिशियन, बायोगैस आदि)', en: 'Technical & Vocational Trades (Solar, Electrician, Biogas, etc.)' },
];

const FAQS = [
  {
    qHi: 'क्या इस पेज से प्रशिक्षण में रुचि दर्ज करने पर निश्चित नौकरी, वीज़ा या 10 गुना आय की गारंटी मिलती है?',
    qEn: 'Does registering interest guarantee a job, overseas visa, or 10x farming income?',
    aHi: 'नहीं। GOVEDA ईमानदार और व्यावहारिक कौशल प्रशिक्षण, मार्गदर्शन तथा संसाधन जानकारी पर केंद्रित है। किसी भी विदेशी नौकरी, वीज़ा, परीक्षा सफलता, मुफ्त प्रशिक्षण या निश्चित आय की कोई गारंटी नहीं दी जाती। वास्तविक परिणाम सीखने वाले के अभ्यास, योग्यता, बाजार और स्थानीय परिस्थितियों पर निर्भर करते हैं।',
    aEn: 'No. GOVEDA focuses strictly on honest, practical skill development and transparent guidance. There is no guarantee of overseas jobs, visas, exam success, free training, or fixed income; real outcomes depend on learner effort, eligibility, local markets, and field conditions.',
  },
  {
    qHi: 'पर्यावरण व पौधारोपण से जुड़े किसान परिवारों को प्रशिक्षण में क्या लाभ मिल सकता है?',
    qEn: 'How are environmentally active farming families considered for training opportunities?',
    aHi: 'GOVEDA के पौधारोपण, हरित मित्र, जल संरक्षण या कार्बन-जागरूकता कार्यक्रमों में सक्रिय भागीदारी करने वाले परिवारों के इच्छुक युवाओं को उपलब्ध बैचों में प्राथमिकता पर विचार करने का प्रस्ताव है — यह पूर्णतः पात्रता, उपलब्ध सीटों, साझेदार संस्थानों के नियमों और पारदर्शी चयन प्रक्रिया के अधीन होगा।',
    aEn: 'Youth from farmer families actively participating in GOVEDA plantation, Harit Mitra, water-conservation, or environmental programmes may receive priority consideration for available seats—strictly subject to eligibility, capacity, partner rules, and transparent selection.',
  },
  {
    qHi: 'क्या अभी स्टूडेंट लॉगिन, लाइव क्लास ऐप या ऑनलाइन फीस भुगतान की सुविधा उपलब्ध है?',
    qEn: 'Is there a student login portal, live class app, or online course fee checkout right now?',
    aHi: 'नहीं। वर्तमान Phase 1 मॉड्यूल एक स्पष्ट, सूचनात्मक वेबसाइट और “प्रशिक्षण में रुचि दर्ज करें” पूछताछ प्रणाली है। स्टूडेंट लॉगिन, LMS, ऑनलाइन परीक्षा या भुगतान प्रणाली भविष्य के अलग Phase 2 सॉफ्टवेयर चरण का विषय हैं।',
    aEn: 'No. This Phase 1 release is purely an informational skill-development module paired with a simple Register Your Interest enquiry form. Student logins, LMS platforms, live-class software, exams, and fee payments belong to a future Phase 2 project.',
  },
];

export function SkillDevelopmentPage({ lang, onAddRecord, onNavigate }: SkillDevelopmentPageProps) {
  const hi = lang === 'hi';
  const { bootstrap } = usePublicPortal();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Phase 1 Register Your Interest form state (strictly 5 fields as specified)
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [stateAndDistrict, setStateAndDistrict] = useState('');
  const [subject, setSubject] = useState(INTEREST_SUBJECTS[0].value);
  const [modePref, setModePref] = useState<'Online' | 'Offline' | 'Either'>('Online');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Section 13 — Live published CMS programmes linked to Skill Development
  const { projects, campaigns, events, trainings } = useMemo(() => {
    const allPublished = filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
      missionSlug: 'skill-development',
      onlyPublished: true,
    });
    return {
      projects: allPublished.filter((p) => p.type === 'project'),
      campaigns: allPublished.filter((p) => p.type === 'campaign'),
      events: allPublished.filter((p) => p.type === 'event'),
      trainings: allPublished.filter((p) => p.type === 'training'),
    };
  }, [bootstrap?.programmes]);

  const hasAnyPublishedProgrammes =
    projects.length > 0 || campaigns.length > 0 || events.length > 0 || trainings.length > 0;

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const cleanName = fullName.trim();
    const cleanPhone = normalizeMobile(mobile);
    const cleanLoc = stateAndDistrict.trim();

    if (cleanName.length < 2) {
      setSubmitError(hi ? 'कृपया अपना पूरा नाम लिखें।' : 'Please enter your full name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setSubmitError(hi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (cleanLoc.length < 2) {
      setSubmitError(hi ? 'कृपया अपना राज्य और जिला लिखें।' : 'Please enter your state and district.');
      return;
    }

    setSubmitting(true);
    const year = new Date().getFullYear();
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    const localId = `GVD-SKL-${year}-${rand}`;
    const [districtPart, statePart] = cleanLoc.includes(',')
      ? cleanLoc.split(',').map((s) => s.trim())
      : [cleanLoc, 'Rajasthan'];

    const payloadRecord: RegistrationRecord = {
      applicationId: localId,
      category: 'skill-training',
      applicantName: cleanName,
      mobile: cleanPhone,
      district: districtPart || cleanLoc,
      villageOrOrg: cleanLoc,
      details: `Subject: ${subject} | Mode: ${modePref}`,
      formFields: {
        stateAndDistrict: cleanLoc,
        state: statePart || 'Rajasthan',
        courseTrack: subject,
        learningMode: modePref,
        sourceModule: 'Skill Development & Rural Livelihood Mission (Phase 1 Inquiry)',
      },
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      consentAccepted: true,
    };

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadRecord),
      });
      if (res.ok) {
        const data = (await res.json()) as { applicationId?: string; submittedAt?: string };
        const finalRecord: RegistrationRecord = {
          ...payloadRecord,
          applicationId: data.applicationId || localId,
          submittedAt: data.submittedAt || payloadRecord.submittedAt,
        };
        onAddRecord(finalRecord);
        setSubmittedRef(finalRecord.applicationId);
      } else {
        onAddRecord(payloadRecord);
        setSubmittedRef(localId);
      }
      setFullName('');
      setMobile('');
      setStateAndDistrict('');
    } catch {
      onAddRecord(payloadRecord);
      setSubmittedRef(localId);
      setFullName('');
      setMobile('');
      setStateAndDistrict('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F1] text-[#123D2A]">
      {/* ====================================================================
          SECTION 01 — CINEMATIC SPLIT HERO: LEARN NEW SKILLS, BUILD A BETTER FUTURE
         ==================================================================== */}
      <section className="relative overflow-hidden bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Editorial Copy Column (~45%) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#17834D]">
                <span className="w-7 h-px bg-[#17834D]" aria-hidden="true" />
                <span>GOVEDA SKILL DEVELOPMENT MISSION</span>
              </div>

              <div className="space-y-2.5">
                <h1
                  className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#123D2A] leading-[1.14] tracking-tight ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'सीखें नए कौशल, बनाएँ आत्मनिर्भर भविष्य'
                    : 'Learn New Skills. Create Opportunities. Build Self-Reliance.'}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-[#17834D]">
                  {hi
                    ? 'Learn New Skills. Create Opportunities. Build Self-Reliance.'
                    : 'सीखें नए कौशल, बनाएँ आत्मनिर्भर भविष्य — कौशल विकास एवं ग्रामीण आजीविका मिशन'}
                </p>
              </div>

              <p
                className={`text-sm sm:text-[15.5px] text-[#2D4336] leading-relaxed ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? 'आधुनिक खेती, डिजिटल शिक्षा, विदेशी भाषाओं, तकनीकी प्रशिक्षण और स्वरोजगार के अवसरों से ग्रामीण युवाओं, किसानों एवं महिलाओं को जोड़ने की एक पहल।'
                  : 'An initiative connecting rural youth, farmers, women, students, and families with modern agriculture, digital education, foreign languages, technical trades, and self-employment pathways.'}
              </p>

              <p
                className={`text-xs sm:text-[13px] font-semibold text-[#76523A] pt-1 ${
                  hi ? 'font-hindi' : ''
                }`}
              >
                {hi
                  ? '“GOVEDA Skill Development Mission – सीखें नए कौशल, बढ़ाएँ रोजगार और आत्मनिर्भरता के अवसर।”'
                  : '“From modern agriculture to digital technology, from foreign languages to self-employment — a new direction for rural India’s skill growth.”'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('sd-register-interest')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#123D2A] hover:bg-[#17834D] text-white px-6 py-3 text-sm font-extrabold transition-colors cursor-pointer"
                >
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'प्रशिक्षण में रुचि दर्ज करें' : 'Register Your Interest'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('sd-modern-agri')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#EDF5EC] text-[#123D2A] border border-[#C9D6C8] px-5 py-3 text-sm font-bold transition-colors cursor-pointer"
                >
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'प्रशिक्षण के क्षेत्र देखें' : 'Explore Training Domains'}
                  </span>
                </button>
              </div>
            </div>

            {/* Dominant Hero 2.5D Artwork (~55%) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#123D2A]">
                <ResilientImage
                  assetKey="sdHeroLearners"
                  alt={
                    hi
                      ? 'कौशल विकास मिशन — डिजिटल शिक्षा, महिला उद्यमिता, आधुनिक कृषि और सोलर तकनीकी प्रशिक्षण'
                      : 'GOVEDA Skill Development Mission — digital learning, women enterprise, smart farming and technical solar training'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
                {/* Clean bottom visual legend bar */}
                <div className="bg-[#123D2A] text-white px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => document.getElementById('sd-digital-it')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 text-left hover:text-[#F3BD42] transition-colors cursor-pointer"
                  >
                    <Laptop className="w-3.5 h-3.5 text-[#F3BD42] shrink-0" aria-hidden="true" />
                    <span className="truncate">{hi ? 'डिजिटल व IT' : 'Digital & IT'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('sd-women-skills')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 text-left hover:text-[#F3BD42] transition-colors cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#F3BD42] shrink-0" aria-hidden="true" />
                    <span className="truncate">{hi ? 'महिला उद्यमिता' : 'Women Enterprise'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('sd-modern-agri')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 text-left hover:text-[#F3BD42] transition-colors cursor-pointer"
                  >
                    <Sprout className="w-3.5 h-3.5 text-[#75B843] shrink-0" aria-hidden="true" />
                    <span className="truncate">{hi ? 'आधुनिक कृषि' : 'Modern Farming'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('sd-technical')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1.5 text-left hover:text-[#F3BD42] transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5 text-[#29B6D8] shrink-0" aria-hidden="true" />
                    <span className="truncate">{hi ? 'तकनीकी ट्रेड' : 'Technical Trades'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 02 — WHY THIS MISSION IS NEEDED & OUR 4-STAGE APPROACH
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
          {/* Part A: Why Needed (Jobless Youth, Skill Gap, Farming & Cyber Reality) */}
          <div className="space-y-8">
            <EditorialSectionHeader
              index="01"
              kickerHi="यह मिशन क्यों आवश्यक है"
              kickerEn="Why Skill Development Matters Today"
              titleHi="बेरोज़गारी और कौशल-अंतर से आत्मनिर्भर आजीविका की ओर"
              titleEn="Closing the Rural Skill Gap With Practical, Real-World Capability"
              leadHi="हमारा लक्ष्य केवल प्रमाणपत्र बाँटना नहीं, बल्कि ग्रामीण युवाओं, किसानों और महिलाओं को ऐसे व्यावहारिक कौशल सिखाना है जो उनकी कार्य-क्षमता, स्वरोज़गार और आत्मविश्वास को मजबूत करें।"
              leadEn="Our goal is never merely issuing certificates—it is equipping rural youth, farmers, and women with real, usable capabilities that widen dignified livelihood options."
              lang={lang}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY_NEEDED_PILLARS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.num}
                    className="rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-5 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-[#EAF4E8] text-[#123D2A] flex items-center justify-center">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <span className="text-xs font-mono font-bold text-[#76523A]">{item.num}</span>
                      </div>
                      <h3
                        className={`text-base font-extrabold text-[#123D2A] leading-snug ${
                          hi ? 'font-hindi' : 'font-editorial'
                        }`}
                      >
                        {hi ? item.hiTitle : item.enTitle}
                      </h3>
                      <p className={`text-xs sm:text-[13.5px] text-[#394C42] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                        {hi ? item.hiBody : item.enBody}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Part B: Wide Editorial Journey Illustration (LEARN -> PRACTICE -> DEVELOP -> EXPLORE) */}
          <div className="space-y-6 pt-4 border-t border-[#E5DEC9]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#17834D]">
                  {hi ? 'हमारा प्रशिक्षण दृष्टिकोण · OUR APPROACH' : 'OUR SKILL DEVELOPMENT APPROACH'}
                </p>
                <h3
                  className={`text-2xl sm:text-3xl font-extrabold text-[#123D2A] ${
                    hi ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {hi
                    ? 'सीखने से व्यावहारिक अवसर तक — 4 चरणों की स्पष्ट यात्रा'
                    : 'From Guided Learning to Real-World Readiness in 4 Clear Stages'}
                </h3>
              </div>
              <p className={`text-xs text-[#5A6C61] max-w-sm ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'प्रशिक्षण का उद्देश्य योग्यता व तैयारी बढ़ाना है — निश्चित नौकरी या तय आय की भ्रामक गारंटी नहीं।'
                  : 'Focused on genuine skill capability and readiness—never misleading guarantees of jobs or fixed income.'}
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1]">
              <ResilientImage
                assetKey="sdWhyJourney"
                alt={
                  hi
                    ? 'सीखें, अभ्यास करें, कौशल विकसित करें और अवसर तलाशें — 4 चरणों की प्रशिक्षण यात्रा'
                    : 'Four-stage learning journey from guided instruction and hands-on practice to skilled mastery and enterprise opportunities'
                }
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5DEC9] bg-[#FAF8F1] border-t border-[#E5DEC9]">
                {FOUR_JOURNEY_STAGES.map((st, idx) => {
                  const Icon = st.icon;
                  return (
                    <div key={st.step} className="p-5 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#17834D]">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          <span>{st.step}</span>
                        </span>
                        {idx < 3 && (
                          <ArrowRight
                            className="hidden lg:block w-4 h-4 text-[#76523A]/60"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <h4 className={`text-sm font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : ''}`}>
                        {hi ? st.hiLabel : st.enLabel}
                      </h4>
                      <p className={`text-xs text-[#394C42] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                        {hi ? st.hiDesc : st.enDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 03 — MODERN AGRICULTURE & ADVANCED FARMING (+ ISRAELI TECH)
         ==================================================================== */}
      <section id="sd-modern-agri" className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="02"
            kickerHi="कृषि नवाचार एवं जल-कुशल खेती · MODERN AGRICULTURE"
            kickerEn="Modern Agriculture & Israeli Precision Farming"
            titleHi="आधुनिक कृषि एवं एडवांस फार्मिंग प्रशिक्षण"
            titleEn="Modern Agriculture & Advanced Scientific Farming Training"
            leadHi="पारंपरिक खेती के अनुभव को वैज्ञानिक मिट्टी-पानी जाँच, ड्रिप सिंचाई, पॉलीहाउस, हाइड्रोपोनिक्स और बाजार-तैयारी से जोड़कर खेती को जल-कुशल व लाभकारी बनाने का प्रस्तावित प्रशिक्षण।"
            leadEn="Pairing traditional farming wisdom with soil-water science, drip irrigation, protected polyhouse cultivation, hydroponics, and grading-to-market readiness."
            lang={lang}
          />

          {/* Large Feature Illustration + Israeli Farming Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#DCE5D9] bg-white">
              <ResilientImage
                assetKey="sdModernAgri"
                alt={
                  hi
                    ? 'आधुनिक ग्रीनहाउस, ड्रिप सिंचाई, हाइड्रोपोनिक्स, मिट्टी जाँच और कृषि ड्रोन का 2.5D प्रशिक्षण दृश्य'
                    : 'Modern Indian polyhouse demonstration farm with farmer learning soil testing, drip irrigation, hydroponics and agri-drone monitoring'
                }
                className="w-full h-full min-h-[260px] object-cover"
              />
            </div>

            <div className="lg:col-span-5 rounded-3xl bg-[#123D2A] text-white p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#F3BD42]">
                  {hi ? 'विशेष प्रशिक्षण मॉड्यूल · SPECIAL FOCUS' : 'SPECIALISED MODULE'}
                </p>
                <h3 className={`text-xl sm:text-2xl font-extrabold leading-snug ${hi ? 'font-hindi' : 'font-editorial'}`}>
                  {hi ? 'इजराइली कृषि तकनीक का विशेष प्रशिक्षण' : 'Israeli Water-Efficient Agricultural Techniques'}
                </h3>
                <p className={`text-xs sm:text-sm text-white/85 leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                  {hi
                    ? 'कम पानी में अधिक गुणवत्तापूर्ण उत्पादन के लिए विश्व-प्रसिद्ध संरक्षित और सटीक खेती तकनीकों का व्यावहारिक परिचय, कृषि विशेषज्ञों के मार्गदर्शन और संभावित विश्वविद्यालय सहयोग के साथ।'
                    : 'Practical introduction to globally proven water-efficient protected farming methods, supported by agricultural experts, demonstration plots, and proposed university collaboration.'}
                </p>
                <ul className="space-y-2.5 pt-2">
                  {ISRAELI_TECH_POINTS.map((pt) => (
                    <li key={pt.en} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-white/95">
                      <CheckCircle2 className="w-4 h-4 text-[#75B843] shrink-0 mt-0.5" aria-hidden="true" />
                      <span className={hi ? 'font-hindi' : ''}>{hi ? pt.hi : pt.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-white/15 text-[11.5px] text-[#F3BD42]/95 leading-relaxed">
                {hi
                  ? 'आधुनिक तकनीक सीखें, जल-संसाधन का सही प्रबंधन समझें और उच्च-मूल्य खेती के बेहतर विकल्प जानें।'
                  : 'Learn modern techniques, understand resource stewardship, and explore improved agricultural practices.'}
              </div>
            </div>
          </div>

          {/* Compact Icon-Supported Training Topic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {MODERN_AGRI_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.en}
                  className="rounded-xl bg-white border border-[#E5DEC9] px-4 py-3.5 flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#EAF4E8] text-[#17834D] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className={`text-xs sm:text-[13px] font-bold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                    {hi ? topic.hi : topic.en}
                  </span>
                </div>
              );
            })}
          </div>

          <EditorialSafeguardCallout
            lang={lang}
            titleHi="किसानों की आय के विषय में ईमानदार स्पष्टता"
            titleEn="Transparent Note on Farming Income Potential"
            bodyHi="हमारा दीर्घकालिक विज़न फसल चयन, जल बचत, लागत नियंत्रण और उच्च-मूल्य खेती के माध्यम से किसानों के लिए आय बढ़ाने की संभावनाओं का अध्ययन और प्रदर्शन करना है। तथापि प्रत्येक किसान की आय कई गुना या 10 गुना होने की कोई गारंटी नहीं दी जाती — वास्तविक परिणाम भूमि, पानी, निवेश, फसल, बाजार और तकनीकी परिस्थितियों पर निर्भर करते हैं।"
            bodyEn="Our long-term vision studies and demonstrates water-efficient, high-value farming options that can improve farmer resilience—however, GOVEDA never guarantees multiplied or 10x income for every farm. Real outcomes depend on soil, water, investment, crop selection, market prices, and technical execution."
          />
        </div>
      </section>

      {/* ====================================================================
          SECTION 04 — FOREIGN LANGUAGE TRAINING (GERMAN PRIORITY FOCUS)
         ==================================================================== */}
      <section id="sd-languages" className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy & German Spotlight */}
            <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
              <EditorialSectionHeader
                index="03"
                kickerHi="वैश्विक संवाद एवं भाषा दक्षता · FOREIGN LANGUAGES"
                kickerEn="Global Communication & Language Readiness"
                titleHi="विदेशी भाषा प्रशिक्षण"
                titleEn="Foreign Language Training"
                leadHi="ग्रामीण युवाओं और विद्यार्थियों को घर बैठे ऑनलाइन लाइव क्लास व अध्ययन सामग्री के माध्यम से अंतर्राष्ट्रीय भाषाओं में दक्ष बनाने की प्रस्तावित योजना।"
                leadEn="Planned home-accessible online live sessions and guided study resources to help rural youth build global communication proficiency."
                lang={lang}
              />

              {/* Featured German Language Card */}
              <div className="rounded-2xl bg-[#FAF8F1] border-2 border-[#17834D] p-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#17834D]">
                    <Languages className="w-4 h-4" aria-hidden="true" />
                    <span>{hi ? 'विशेष प्राथमिकता · PRIORITY TRACK' : 'PRIORITY FOCUS TRACK'}</span>
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#123D2A]">DE · A1–B2</span>
                </div>
                <h3 className={`text-lg font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                  {hi ? 'जर्मन भाषा प्रशिक्षण (German Language Training)' : 'German Language Training (Special Emphasis)'}
                </h3>
                <p className={`text-xs sm:text-[13.5px] text-[#394C42] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                  {hi
                    ? 'जर्मनी एवं यूरोपीय देशों में उच्च शिक्षा, तकनीकी प्रशिक्षण (Ausbildung) और वैश्विक अवसरों की तैयारी हेतु संरचित भाषा मार्गदर्शन, संवाद अभ्यास व इंटरव्यू तैयारी।'
                    : 'Structured language coaching, conversation practice, and interview communication for youth preparing toward higher education or technical pathways in Germany and Europe.'}
                </p>
              </div>
            </div>

            {/* Right Dominant 2.5D Studio Illustration */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1]">
                <ResilientImage
                  assetKey="sdForeignLang"
                  alt={
                    hi
                      ? 'विदेशी भाषा प्रशिक्षण स्टूडियो में भारतीय विद्यार्थी व प्रशिक्षक संवाद और ऑनलाइन अभ्यास करते हुए'
                      : 'Modern foreign-language learning studio with Indian young adults practising conversation and online laptop language lessons'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>
          </div>

          {/* 8 Language Cards + Proposed Learning Levels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            <div className="lg:col-span-7 space-y-3">
              <h3 className={`text-sm font-extrabold uppercase tracking-wider text-[#123D2A] ${hi ? 'font-hindi' : ''}`}>
                {hi ? 'प्रस्तावित प्रमुख भाषाएँ (अन्य भाषाएँ प्रशिक्षक व मांग के अनुसार)' : 'Proposed Languages (Additional Languages Subject to Demand & Trainers)'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FOREIGN_LANGUAGES.map((l) => (
                  <div
                    key={l.code}
                    className={`rounded-xl p-3.5 border transition-colors ${
                      l.featured
                        ? 'bg-[#123D2A] text-white border-[#123D2A]'
                        : 'bg-[#FAF8F1] text-[#123D2A] border-[#E5DEC9]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[11px] font-mono font-extrabold ${
                          l.featured ? 'text-[#F3BD42]' : 'text-[#17834D]'
                        }`}
                      >
                        {l.code}
                      </span>
                      <Globe
                        className={`w-3.5 h-3.5 ${l.featured ? 'text-[#F3BD42]' : 'text-[#76523A]'}`}
                        aria-hidden="true"
                      />
                    </div>
                    <p className={`text-xs sm:text-[13px] font-extrabold ${hi ? 'font-hindi' : ''}`}>
                      {hi ? l.hi : l.en}
                    </p>
                    {l.featured && (
                      <p className="text-[10.5px] font-semibold text-[#F3BD42] mt-0.5">
                        {hi ? l.noteHi : l.noteEn}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[#FAF8F1] border border-[#E5DEC9] p-5 space-y-3">
              <h3 className={`text-sm font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : ''}`}>
                {hi ? 'प्रस्तावित प्रशिक्षण स्तर एवं प्रारूप' : 'Proposed Proficiency Levels & Format'}
              </h3>
              <ul className="space-y-2">
                {LANGUAGE_LEVELS.map((lv) => (
                  <li key={lv.en} className="flex items-start gap-2 text-xs sm:text-[13px] text-[#2D4336]">
                    <CheckCircle2 className="w-4 h-4 text-[#17834D] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className={hi ? 'font-hindi' : ''}>{hi ? lv.hi : lv.en}</span>
                  </li>
                ))}
              </ul>
              <p className={`text-[11.5px] text-[#76523A] pt-2 border-t border-[#E5DEC9] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'पारदर्शी नोट: किसी भी विदेशी नौकरी, वीज़ा, विदेशी प्रवेश अथवा भाषा परीक्षा में सफलता की कोई गारंटी नहीं दी जाती।'
                  : 'Transparent Note: Overseas employment, visas, university admissions, and examination results are never guaranteed.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 05 — COMPUTER, IT & DIGITAL SKILLS
         ==================================================================== */}
      <section id="sd-digital-it" className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#0F1E2E]">
                <ResilientImage
                  assetKey="sdDigitalIt"
                  alt={
                    hi
                      ? 'कंप्यूटर, कोडिंग, ग्राफिक डिजाइन, डेटा एनालिटिक्स, AI और ई-कॉमर्स सीखते हुए युवा शिक्षार्थी'
                      : 'Modern Indian digital skills workstation illustrating programming, graphic design, analytics, AI and e-commerce learning'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <EditorialSectionHeader
                index="04"
                kickerHi="आधुनिक डिजिटल क्षमता · COMPUTER & IT"
                kickerEn="Modern Digital & Technology Workforce Skills"
                titleHi="कंप्यूटर, IT एवं डिजिटल स्किल"
                titleEn="Computer, IT & Digital Skills"
                leadHi="बुनियादी कंप्यूटर साक्षरता से लेकर ग्राफिक डिज़ाइन, वेबसाइट निर्माण, Python कोडिंग, AI परिचय और ऑनलाइन व्यवसाय प्रबंधन तक — युवाओं को रोज़गार व स्वरोज़गार के लिए तैयार करना।"
                leadEn="From foundational digital literacy and Excel to web design, Python coding, AI basics, digital accounting, and online business operations."
                lang={lang}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {DIGITAL_IT_COURSES.map((course) => {
              const Icon = course.icon;
              return (
                <div
                  key={course.en}
                  className="rounded-xl bg-white border border-[#E5DEC9] px-3.5 py-3 flex items-center gap-2.5"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#0F1E2E]/8 text-[#0F1E2E] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className={`text-xs font-bold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                    {hi ? course.hi : course.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 06 — CYBERSECURITY & DIGITAL AWARENESS (DARK NAVY FEATURE BAND)
         ==================================================================== */}
      <section id="sd-cyber" className="py-14 sm:py-20 bg-[#0F1E2E] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#29B6D8]">
                <span className="w-6 h-px bg-[#29B6D8]" aria-hidden="true" />
                <span>05 · {hi ? 'डिजिटल सुरक्षा कवच' : 'DIGITAL SAFETY FOR EVERY HOME'}</span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi ? 'साइबर सुरक्षा एवं डिजिटल जागरूकता' : 'Cybersecurity & Digital Awareness'}
              </h2>
              <p className={`text-sm text-white/80 leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'ग्रामीण परिवारों, महिलाओं, विद्यार्थियों, किसानों और वरिष्ठ नागरिकों को सरल भाषा में UPI सुरक्षा, फ़र्ज़ी लिंक पहचान और सुरक्षित इंटरनेट उपयोग का व्यावहारिक प्रशिक्षण।'
                  : 'Accessible, jargon-free cyber safety education built especially for rural families, women, students, farmers, and senior citizens to protect against UPI scams and phishing.'}
              </p>
              <div className="rounded-xl bg-white/8 border border-[#29B6D8]/30 p-4 text-xs text-white/90 leading-relaxed">
                <strong className="text-[#29B6D8]">
                  {hi ? 'सरल सुरक्षा सिद्धांत: ' : 'Simple Safety Principle: '}
                </strong>
                <span className={hi ? 'font-hindi' : ''}>
                  {hi
                    ? 'OTP, UPI PIN या बैंक पासवर्ड कभी किसी कॉल या अनजान लिंक पर साझा न करें — जागरूकता ही सबसे बड़ा डिजिटल सुरक्षा कवच है।'
                    : 'Never share OTPs, UPI PINs, or passwords over unknown calls or links—everyday awareness is the strongest digital shield.'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-white/15 bg-[#0A1522]">
                <ResilientImage
                  assetKey="sdCyberSafety"
                  alt={
                    hi
                      ? 'डिजिटल सुरक्षा कवच के भीतर लैपटॉप और मोबाइल सुरक्षित उपयोग करते भारतीय युवा व बुजुर्ग'
                      : 'Indian family member and elder protected inside a translucent digital cybersecurity shield while blocking phishing threats'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {CYBER_TOPICS.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.en}
                  className="rounded-xl bg-white/6 border border-white/12 px-3.5 py-3 flex items-start gap-2.5"
                >
                  <Icon className="w-4 h-4 text-[#29B6D8] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className={`text-xs font-semibold text-white/95 leading-snug ${hi ? 'font-hindi' : ''}`}>
                    {hi ? t.hi : t.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 07 — WOMEN SKILL DEVELOPMENT & SELF-EMPLOYMENT
         ==================================================================== */}
      <section id="sd-women-skills" className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1]">
                <ResilientImage
                  assetKey="sdWomenEnterprise"
                  alt={
                    hi
                      ? 'महिला कौशल विकास कार्यशाला — सिलाई, खाद्य प्रसंस्करण, ऑनलाइन ऑर्डर प्रबंधन और हस्तशिल्प पैकेजिंग'
                      : 'Indian women cooperative studio showing tailoring, artisanal food processing, online sales management and packaged handicrafts'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <EditorialSectionHeader
                index="06"
                kickerHi="आत्मनिर्भर ग्रामीण महिला उद्यम · WOMEN LIVELIHOODS"
                kickerEn="Women’s Practical Skills & Self-Employment"
                titleHi="महिला कौशल विकास एवं स्वरोजगार"
                titleEn="Women Skill Development & Self-Employment"
                leadHi="सिलाई, खाद्य प्रसंस्करण, हस्तशिल्प, पैकेजिंग-ब्रांडिंग, स्वयं सहायता समूह प्रबंधन और ऑनलाइन बिक्री के व्यावहारिक प्रशिक्षण से महिलाओं के आत्मविश्वास और आय के अवसरों को सुदृढ़ करना।"
                leadEn="Practical enterprise skills spanning tailoring, food processing, handicrafts, packaging, SHG management, financial literacy, and digital sales."
                lang={lang}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {WOMEN_SKILLS.map((w) => {
              const Icon = w.icon;
              return (
                <div
                  key={w.en}
                  className="rounded-xl bg-[#FAF8F1] border border-[#E5DEC9] px-4 py-3.5 flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#EAF4E8] text-[#17834D] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className={`text-xs sm:text-[13px] font-bold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                    {hi ? w.hi : w.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 08 — EMPLOYMENT-ORIENTED & TECHNICAL SKILLS
         ==================================================================== */}
      <section id="sd-technical" className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              <EditorialSectionHeader
                index="07"
                kickerHi="व्यावहारिक ट्रेड एवं कार्य-दक्षता · TECHNICAL WORKSHOPS"
                kickerEn="Employment-Oriented & Vocational Trades"
                titleHi="रोजगारपरक एवं तकनीकी कौशल"
                titleEn="Employment-Oriented & Technical Skills"
                leadHi="भविष्य में प्रशिक्षण संस्थानों और तकनीकी साझेदारों के सहयोग से सोलर इंस्टॉलेशन, इलेक्ट्रिशियन, बायोगैस संचालन, प्लंबिंग, वेल्डिंग, सुरक्षा और इंटरव्यू तैयारी जैसे उपयोगी ट्रेड उपलब्ध कराने की योजना।"
                leadEn="Planned vocational training delivered with technical partners covering solar installation, electrical wiring, biogas operation, plumbing, welding, safety, and workplace readiness."
                lang={lang}
              />
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-white">
                <ResilientImage
                  assetKey="sdTechnicalWorkshop"
                  alt={
                    hi
                      ? 'तकनीकी प्रशिक्षण कार्यशाला — सोलर पैनल, इलेक्ट्रिकल बोर्ड, वेल्डिंग, प्लंबिंग व बायोगैस उपकरण अभ्यास'
                      : 'Technical training workshop featuring electrical testing, solar panel mounting rig, welding booth, plumbing and biogas equipment'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {TECHNICAL_SKILLS.map((sk) => {
              const Icon = sk.icon;
              return (
                <div
                  key={sk.en}
                  className="rounded-xl bg-white border border-[#E5DEC9] px-4 py-3 flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#FEF6DF] text-[#76523A] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className={`text-xs sm:text-[13px] font-bold text-[#123D2A] leading-snug ${hi ? 'font-hindi' : ''}`}>
                    {hi ? sk.hi : sk.en}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 09 — LEARNING OPPORTUNITIES FOR ENVIRONMENTALLY ACTIVE FAMILIES
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1] grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ResilientImage
                assetKey="sdEnvFamily"
                alt={
                  hi
                    ? 'पौधारोपण व जल संरक्षण करने वाला किसान परिवार और कौशल अध्ययन करते उनके युवा सदस्य'
                    : 'Rural farming family tending saplings and rainwater tank transitioning to their youth studying modern skills'
                }
                className="w-full h-full min-h-[260px] object-cover"
              />
            </div>

            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-5">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#17834D]">
                <Leaf className="w-4 h-4" aria-hidden="true" />
                <span>
                  {hi ? '08 · पर्यावरण भागीदारी से कौशल अवसर' : '08 · ENVIRONMENTAL STEWARDSHIP LINK'}
                </span>
              </div>

              <h2
                className={`text-2xl sm:text-3xl font-extrabold text-[#123D2A] leading-snug ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi
                  ? 'पर्यावरण एवं कार्बन कार्यक्रमों से जुड़े परिवारों को प्राथमिकता'
                  : 'Priority Consideration for Environmentally Active Families'}
              </h2>

              <p className={`text-sm text-[#394C42] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'GOVEDA के पौधारोपण, हरित मित्र, जल संरक्षण और पर्यावरण कार्यक्रमों में सक्रिय भागीदारी करने वाले किसानों व परिवारों के पात्र सदस्यों को उपलब्ध प्रशिक्षण अवसरों में प्राथमिकता देने का प्रस्ताव है।'
                  : 'Eligible farmers and family members actively participating in GOVEDA plantation, Harit Mitra, water conservation, and environmental programmes may receive priority consideration for available training seats.'}
              </p>

              <div className="rounded-2xl bg-white border border-[#E5DEC9] p-4 space-y-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#76523A]">
                  {hi ? 'व्यावहारिक उदाहरण' : 'Illustrative Example'}
                </p>
                <p className={`text-xs sm:text-[13px] text-[#2D4336] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                  {hi
                    ? 'यदि किसी किसान परिवार ने पौधारोपण और पर्यावरण संरक्षण में सक्रिय योगदान दिया है, तो उस परिवार के इच्छुक युवा को जर्मन भाषा, कंप्यूटर, आधुनिक खेती या अन्य उपलब्ध बैच में प्राथमिकता पर विचार किया जा सकता है।'
                    : 'If a rural family contributes actively to tree care and local water stewardship, an interested youth from that household may be considered for priority seats in German language, computer skills, or modern farming batches.'}
                </p>
              </div>

              <p className={`text-xs text-[#5A6C61] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'नियम एवं पारदर्शिता: प्राथमिकता पात्रता, उपलब्ध सीटों, साझेदार संस्थानों के नियमों और पारदर्शी चयन प्रक्रिया के अधीन होगी। यह किसी निश्चित प्रवेश, मुफ्त प्रशिक्षण, नौकरी या आय की गारंटी नहीं है।'
                  : 'Governance Rule: Priority consideration is strictly subject to eligibility, seat availability, partner institute norms, and transparent selection—never a guarantee of free admission, jobs, or income.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 10 — HOW TRAINING CAN BE PROVIDED (3 DISTINCT VISUAL CARDS)
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
          <EditorialSectionHeader
            index="09"
            kickerHi="प्रस्तावित प्रशिक्षण प्रारूप · DELIVERY MODELS"
            kickerEn="How Training Can Be Provided"
            titleHi="तीन व्यावहारिक माध्यमों से सीखने की व्यवस्था"
            titleEn="Online, Offline & Hands-On Practical Learning Pathways"
            lang={lang}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DELIVERY_MODES.map((m) => {
              const Icon = m.icon;
              return (
                <article
                  key={m.key}
                  className="rounded-3xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#EAE4D3]">
                      <ResilientImage
                        assetKey={m.assetKey}
                        alt={hi ? m.hiTitle : m.enTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#17834D]">
                        <span>{hi ? m.badgeHi : m.badgeEn}</span>
                        <Icon className="w-4 h-4 text-[#123D2A]" aria-hidden="true" />
                      </div>
                      <h3
                        className={`text-lg font-extrabold text-[#123D2A] ${
                          hi ? 'font-hindi' : 'font-editorial'
                        }`}
                      >
                        {hi ? m.hiTitle : m.enTitle}
                      </h3>
                      <p className={`text-xs sm:text-sm text-[#394C42] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                        {hi ? m.hiDesc : m.enDesc}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-3.5 border-t border-[#EFEAD9] bg-[#FAF8F1] text-xs font-bold text-[#76523A]">
                    {hi ? m.hiTag : m.enTag}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 11 — EXPERTS & INSTITUTIONAL COLLABORATION
         ==================================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E5DEC9]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <EditorialSectionHeader
                index="10"
                kickerHi="संस्थागत समन्वय · COLLABORATIVE ECOSYSTEM"
                kickerEn="Experts & Institutional Collaboration"
                titleHi="विशेषज्ञों एवं शैक्षणिक संस्थानों के साथ संभावित साझेदारी"
                titleEn="Building Training Quality Through Institutional Partnerships"
                leadHi="गुणवत्तापूर्ण और प्रामाणिक प्रशिक्षण के लिए कृषि विश्वविद्यालयों, तकनीकी संस्थानों, भाषा प्रशिक्षकों और उद्योग विशेषज्ञों के साथ समन्वय स्थापित करने की योजना।"
                leadEn="Proposed collaboration with agricultural universities, technical institutes, language educators, and industry practitioners to maintain real-world training quality."
                lang={lang}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLLAB_PILLARS.map((col) => {
                  const Icon = col.icon;
                  return (
                    <div
                      key={col.en}
                      className="rounded-xl bg-[#FAF8F1] border border-[#E5DEC9] px-4 py-3 flex items-center gap-2.5"
                    >
                      <Icon className="w-4 h-4 text-[#17834D] shrink-0" aria-hidden="true" />
                      <span className={`text-xs font-bold text-[#123D2A] ${hi ? 'font-hindi' : ''}`}>
                        {hi ? col.hi : col.en}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className={`text-xs text-[#5A6C61] leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'नोट: किसी भी साझेदार संस्थान का नाम या लोगो केवल औपचारिक लिखित सहमति के बाद ही प्रकाशित किया जाता है।'
                  : 'Note: Partner names and logos are displayed only after formal institutional confirmation.'}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-[#DCE5D9] bg-[#FAF8F1]">
                <ResilientImage
                  assetKey="sdExpertsCollab"
                  alt={
                    hi
                      ? 'कृषि वैज्ञानिक, तकनीकी प्रशिक्षक और शिक्षा समन्वयक संयुक्त प्रशिक्षण योजना पर चर्चा करते हुए'
                      : 'Agricultural scientist, technical workshop instructor and education coordinator collaborating over training blueprints'
                  }
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 12 — REGISTER YOUR INTEREST (5-FIELD PHASE 1 INQUIRY FORM)
         ==================================================================== */}
      <section
        id="sd-register-interest"
        className="py-14 sm:py-20 bg-[#123D2A] text-white border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Inspiring Message & Direct Form-Builder Option */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#F3BD42]">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                <span>{hi ? '11 · प्रशिक्षण में रुचि दर्ज करें' : '11 · REGISTER YOUR INTEREST'}</span>
              </div>

              <h2
                className={`text-3xl sm:text-4xl font-extrabold text-white leading-tight ${
                  hi ? 'font-hindi' : 'font-editorial'
                }`}
              >
                {hi ? 'आप भी सीखने की शुरुआत करें' : 'Take the First Step Towards Learning a New Skill.'}
              </h2>

              <p className="text-sm font-semibold text-[#F3BD42]">
                {hi
                  ? 'Take the First Step Towards Learning a New Skill.'
                  : 'आप भी सीखने की शुरुआत करें — सरल प्रशिक्षण पूछताछ फॉर्म'}
              </p>

              <p className={`text-sm text-white/80 leading-relaxed ${hi ? 'font-hindi' : ''}`}>
                {hi
                  ? 'यह एक सरल प्रशिक्षण पूछताछ फॉर्म है। आपकी रुचि दर्ज होने के बाद संबंधित विषय का बैच या कार्यशाला प्रारंभ होने पर GOVEDA टीम आपसे संपर्क कर सकेगी।'
                  : 'This is a straightforward Phase 1 training enquiry form. Submitting your interest helps GOVEDA notify you when relevant sessions or partner batches open in your area.'}
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#75B843] shrink-0" aria-hidden="true" />
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'कोई लॉगिन या ऑनलाइन फीस भुगतान आवश्यक नहीं' : 'No student login or online fee payment required'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#75B843] shrink-0" aria-hidden="true" />
                  <span className={hi ? 'font-hindi' : ''}>
                    {hi ? 'GOVEDA के आधिकारिक फॉर्म सिस्टम से सीधे जुड़ा हुआ' : 'Connected directly to GOVEDA’s central registration system'}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('/join/skill-training')}
                  className="inline-flex items-center gap-2 rounded-full bg-white/12 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <span>{hi ? 'विस्तृत कौशल फॉर्म खोलें' : 'Open Full Form Builder Page'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/training')}
                  className="inline-flex items-center gap-2 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 px-4 py-2.5 text-xs font-bold text-white/90 transition-colors cursor-pointer"
                >
                  <span>{hi ? 'प्रशिक्षण एवं ज्ञान केंद्र देखें' : 'Visit Training & Knowledge Hub'}</span>
                </button>
              </div>
            </div>

            {/* Right Clean 5-Field Register Your Interest Form */}
            <div className="lg:col-span-7 rounded-3xl bg-[#FAF8F1] text-[#123D2A] p-6 sm:p-8 border border-[#E5DEC9]">
              {submittedRef ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF4E8] text-[#17834D] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h3 className={`text-xl font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                    {hi ? 'आपकी प्रशिक्षण रुचि सफलतापूर्वक दर्ज हो गई है' : 'Your Training Interest Has Been Recorded'}
                  </h3>
                  <p className={`text-sm text-[#394C42] max-w-md mx-auto ${hi ? 'font-hindi' : ''}`}>
                    {hi
                      ? 'संदर्भ क्रमांक सहेजें। उपयुक्त बैच या प्रशिक्षण सत्र की सूचना के लिए हमारी टीम आपसे संपर्क करेगी।'
                      : 'Please note your reference ID below. Our team will reach out when relevant training sessions open.'}
                  </p>
                  <p className="inline-block rounded-xl bg-white border border-[#DCE5D9] px-4 py-2 font-mono text-sm font-extrabold text-[#17834D]">
                    {submittedRef}
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => setSubmittedRef(null)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#123D2A] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#17834D] cursor-pointer"
                    >
                      <span>{hi ? 'एक और रुचि दर्ज करें' : 'Submit Another Enquiry'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInterestSubmit} className="space-y-4">
                  <div className="border-b border-[#E5DEC9] pb-3">
                    <h3 className={`text-lg font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                      {hi ? 'प्रशिक्षण में रुचि दर्ज करें — Register Your Interest' : 'Register Your Interest — Training Enquiry'}
                    </h3>
                    <p className={`text-xs text-[#5A6C61] mt-0.5 ${hi ? 'font-hindi' : ''}`}>
                      {hi ? 'कृपया केवल ये 5 सामान्य जानकारियाँ भरें:' : 'Please complete these 5 simple details:'}
                    </p>
                  </div>

                  {submitError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-800">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-bold text-[#123D2A]">
                        1. {hi ? 'पूरा नाम *' : 'Full Name *'}
                      </span>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={hi ? 'अपना पूरा नाम लिखें' : 'Enter your full name'}
                        className="w-full rounded-xl bg-white border border-[#D4DEC9] px-3.5 py-2.5 text-sm text-[#123D2A] focus:outline-none focus:border-[#17834D]"
                      />
                    </label>

                    <label className="block space-y-1.5">
                      <span className="text-xs font-bold text-[#123D2A] flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5 text-[#17834D]" aria-hidden="true" />
                        <span>2. {hi ? 'मोबाइल नंबर *' : 'Mobile Number *'}</span>
                      </span>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder={hi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                        className="w-full rounded-xl bg-white border border-[#D4DEC9] px-3.5 py-2.5 text-sm text-[#123D2A] focus:outline-none focus:border-[#17834D]"
                      />
                    </label>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-[#123D2A] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#17834D]" aria-hidden="true" />
                      <span>3. {hi ? 'जिला एवं राज्य *' : 'District & State *'}</span>
                    </span>
                    <input
                      type="text"
                      required
                      value={stateAndDistrict}
                      onChange={(e) => setStateAndDistrict(e.target.value)}
                      placeholder={hi ? 'उदा. भीलवाड़ा, राजस्थान' : 'e.g. Bhilwara, Rajasthan'}
                      className="w-full rounded-xl bg-white border border-[#D4DEC9] px-3.5 py-2.5 text-sm text-[#123D2A] focus:outline-none focus:border-[#17834D]"
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-[#123D2A]">
                      4. {hi ? 'इच्छित प्रशिक्षण विषय *' : 'Preferred Training Subject *'}
                    </span>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl bg-white border border-[#D4DEC9] px-3.5 py-2.5 text-sm text-[#123D2A] focus:outline-none focus:border-[#17834D]"
                    >
                      {INTEREST_SUBJECTS.map((sub) => (
                        <option key={sub.value} value={sub.value}>
                          {hi ? sub.hi : sub.en}
                        </option>
                      ))}
                    </select>
                  </label>

                  <fieldset className="space-y-1.5">
                    <legend className="text-xs font-bold text-[#123D2A]">
                      5. {hi ? 'ऑनलाइन या ऑफलाइन प्रशिक्षण की प्राथमिकता *' : 'Online or Offline Training Preference *'}
                    </legend>
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      {(
                        [
                          { id: 'Online', hi: 'ऑनलाइन', en: 'Online' },
                          { id: 'Offline', hi: 'ऑफलाइन', en: 'Offline' },
                          { id: 'Either', hi: 'दोनों उपयुक्त', en: 'Either' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setModePref(opt.id)}
                          className={`rounded-xl border px-3 py-2.5 text-xs font-extrabold transition-colors cursor-pointer ${
                            modePref === opt.id
                              ? 'bg-[#123D2A] text-white border-[#123D2A]'
                              : 'bg-white text-[#123D2A] border-[#D4DEC9] hover:border-[#17834D]'
                          }`}
                        >
                          {hi ? opt.hi : opt.en}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#17834D] hover:bg-[#123D2A] disabled:opacity-60 text-white px-6 py-3.5 text-sm font-extrabold transition-colors cursor-pointer"
                  >
                    <span className={hi ? 'font-hindi' : ''}>
                      {submitting
                        ? hi
                          ? 'दर्ज किया जा रहा है...'
                          : 'Submitting...'
                        : hi
                        ? 'प्रशिक्षण में रुचि दर्ज करें'
                        : 'Register Your Interest'}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 13 — RELATED PROJECTS, CAMPAIGNS, EVENTS & TRAININGS (LIVE CMS)
          Auto-hides empty categories and hides entire section when all empty
         ==================================================================== */}
      {hasAnyPublishedProgrammes && (
        <section className="py-14 sm:py-20 bg-[#FAF8F1] border-b border-[#E5DEC9]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10">
            <EditorialSectionHeader
              index="12"
              kickerHi="लाइव प्रकाशित कार्यक्रम · GOVEDA CMS"
              kickerEn="Live Published Programmes · Connected to Admin CMS"
              titleHi="कौशल विकास से जुड़ी परियोजनाएँ, अभियान, प्रशिक्षण एवं कार्यक्रम"
              titleEn="Related Projects, Campaigns, Trainings & Events"
              lang={lang}
            />

            {[
              { key: 'trainings', items: trainings, hi: 'प्रकाशित प्रशिक्षण कार्यक्रम', en: 'Published Training Programmes' },
              { key: 'projects', items: projects, hi: 'संबंधित परियोजनाएँ', en: 'Related Projects' },
              { key: 'campaigns', items: campaigns, hi: 'संबंधित अभियान', en: 'Related Campaigns' },
              { key: 'events', items: events, hi: 'आगामी कार्यक्रम', en: 'Upcoming Events' },
            ]
              .filter((grp) => grp.items.length > 0)
              .map((grp) => (
                <div key={grp.key} className="space-y-4">
                  <h3 className={`text-lg font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                    {hi ? grp.hi : grp.en}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grp.items.map((prog) => {
                      const cover =
                        prog.media.find((m) => m.isCover && m.url) ??
                        prog.media.find((m) => m.mediaType === 'photo' && m.url);
                      const loc = prog.locations[0];
                      const locText = loc
                        ? [loc.localityName, loc.district, loc.stateName].filter(Boolean).join(', ')
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
                              <h4 className={`text-base font-extrabold text-[#123D2A] ${hi ? 'font-hindi' : 'font-editorial'}`}>
                                {hi ? prog.titleHi || prog.titleEn : prog.titleEn}
                              </h4>
                              <p className={`text-xs sm:text-sm text-[#394C42] leading-relaxed line-clamp-3 ${hi ? 'font-hindi' : ''}`}>
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
                                <span>{hi ? 'पंजीकरण करें' : 'Register'}</span>
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
          FAQs — HONEST CLARITY & PHASE 1 TRANSPARENCY
         ==================================================================== */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <EditorialSectionHeader
            index={hasAnyPublishedProgrammes ? '13' : '12'}
            kickerHi="स्पष्ट प्रश्नोत्तर · FAQS"
            kickerEn="Frequently Asked Questions"
            titleHi="कौशल विकास मिशन से जुड़े प्रमुख प्रश्न"
            titleEn="Key Questions on Training, Eligibility & Transparency"
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
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-[15px] text-[#123D2A] cursor-pointer"
                  >
                    <span className={hi ? 'font-hindi' : ''}>{hi ? faq.qHi : faq.qEn}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      className={`px-5 pb-4 pt-2 border-t border-[#E5DEC9] bg-white text-xs sm:text-sm text-[#394C42] leading-relaxed ${
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
    </div>
  );
}
