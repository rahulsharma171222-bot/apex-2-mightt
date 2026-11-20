import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Search,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { SpringButton } from './SpringMotion';
import { GovedaMissionSvg } from './GovedaIcons';
import { validateRegistrationInput } from '../utils/govedaLogic';
import {
  ApiError,
  createPaymentOrder,
  lookupPublicApplicationStatus,
  submitPublicForm,
  verifyPaymentSignature,
} from '../admin/apiClient';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { AdminFormDefinition, AdminPaymentTransaction } from '../admin/types';
import type {
  BilingualText,
  Language,
  RegistrationCategory,
  RegistrationRecord,
} from '../types/goveda';

export interface CustomFieldSpec {
  key: string;
  label: BilingualText;
  type: 'text' | 'select' | 'textarea' | 'number' | 'date' | 'email' | 'checkbox';
  required?: boolean;
  placeholder?: BilingualText;
  options?: { value: string; label: BilingualText }[];
}

export interface CategoryFormSpec {
  id: RegistrationCategory;
  number: number;
  iconName: string;
  label: BilingualText;
  subtitle: BilingualText;
  orgLabel: BilingualText;
  orgPlaceholder: BilingualText;
  detailsLabel: BilingualText;
  detailsPlaceholder: BilingualText;
  isOpen?: boolean;
  closedMessage?: BilingualText;
  customFields: CustomFieldSpec[];
}

export const CATEGORY_OPTIONS: CategoryFormSpec[] = [
  {
    id: 'farmer',
    number: 1,
    iconName: 'Sprout',
    label: { hi: '1. किसान पंजीकरण फॉर्म', en: '1. Farmer Registration Form' },
    subtitle: {
      hi: 'कृषि वानिकी, मेड़ वृक्षारोपण, जैविक खेती एवं कार्बन परियोजना पात्रता हेतु',
      en: 'For agroforestry, boundary plantation, organic farming & carbon project onboarding',
    },
    orgLabel: { hi: 'गाँव / ग्राम पंचायत / तहसील *', en: 'Village / Gram Panchayat / Tehsil *' },
    orgPlaceholder: { hi: 'उदा. मांडलगढ़ ग्राम पंचायत', en: 'e.g. Mandalgarh Gram Panchayat' },
    detailsLabel: {
      hi: 'खेत की मिट्टी, वर्तमान फसल एवं विशेष विवरण',
      en: 'Soil Type, Current Crops & Additional Notes',
    },
    detailsPlaceholder: {
      hi: 'खेजड़ी, नीम, आँवला या रोहिड़ा रोपण में रुचि...',
      en: 'Interest in Khejri, Neem, Amla boundary plantation...',
    },
    customFields: [
      {
        key: 'landSize',
        label: { hi: 'कुल कृषि भूमि (बीघा / हेक्टेयर) *', en: 'Total Landholding (Bigha / Hectare) *' },
        type: 'text',
        placeholder: { hi: 'उदा. 5 बीघा / 1.2 हेक्टेयर', en: 'e.g. 5 Bigha / 1.2 Hectare' },
      },
      {
        key: 'irrigationSource',
        label: { hi: 'सिंचाई का मुख्य साधन', en: 'Primary Irrigation Source' },
        type: 'select',
        options: [
          { value: 'Borewell / Tube-well', label: { hi: 'बोरवेल / ट्यूबवेल', en: 'Borewell / Tube-well' } },
          { value: 'Drip / Farm Pond', label: { hi: 'ड्रिप सिंचाई / फार्म पॉन्ड', en: 'Drip Irrigation / Farm Pond' } },
          { value: 'Rainfed (Barani)', label: { hi: 'वर्षा आधारित (बारानी)', en: 'Rainfed (Barani)' } },
          { value: 'Canal / Well', label: { hi: 'नहर / कुआँ', en: 'Canal / Traditional Well' } },
        ],
      },
      {
        key: 'plantationModel',
        label: { hi: 'वृक्षारोपण मॉडल प्राथमिकता', en: 'Preferred Plantation Model' },
        type: 'select',
        options: [
          { value: 'Farm Boundary Agroforestry', label: { hi: 'खेत की मेड़ पर कृषि वानिकी', en: 'Farm Boundary Agroforestry' } },
          { value: 'Native Trees (Khejri/Neem/Rohida)', label: { hi: 'देशी वृक्ष (खेजड़ी, नीम, रोहिड़ा)', en: 'Native Shade Trees (Khejri, Neem, Rohida)' } },
          { value: 'Horticulture (Amla/Ber/Moringa)', label: { hi: 'फलदार पौधे (आँवला, बेर, सहजन)', en: 'Fruit & Medicinal (Amla, Ber, Moringa)' } },
        ],
      },
      {
        key: 'saplingTarget',
        label: { hi: 'प्रस्तावित पौधों की संख्या', en: 'Proposed Number of Saplings' },
        type: 'select',
        options: [
          { value: '50 - 100 Saplings', label: { hi: '50 – 100 पौधे', en: '50 – 100 Saplings' } },
          { value: '100 - 250 Saplings', label: { hi: '100 – 250 पौधे', en: '100 – 250 Saplings' } },
          { value: '250 - 500+ Saplings', label: { hi: '250 – 500+ पौधे', en: '250 – 500+ Saplings' } },
        ],
      },
    ],
  },
  {
    id: 'harit-mitra',
    number: 2,
    iconName: 'Users',
    label: { hi: '2. हरित मित्र पंजीकरण फॉर्म', en: '2. Harit Mitra Registration Form' },
    subtitle: {
      hi: 'ग्राम स्तर पर किसानों को जोड़ने, पौध जीवितता निगरानी और जनजागरूकता समन्वय हेतु',
      en: 'Village-level coordinator for farmer onboarding, sapling care & climate awareness',
    },
    orgLabel: { hi: 'ग्राम पंचायत / क्लस्टर क्षेत्र *', en: 'Gram Panchayat / Cluster Area *' },
    orgPlaceholder: { hi: 'उदा. सरदारशहर ग्रामीण क्लस्टर', en: 'e.g. Sardarshahar Rural Cluster' },
    detailsLabel: { hi: 'पूर्व सामाजिक / पर्यावरण कार्य अनुभव', en: 'Prior Social or Environmental Experience' },
    detailsPlaceholder: { hi: 'ग्राम सभा, किसान समूह या युवा मंडल अनुभव...', en: 'Experience working with farmers or village youth...' },
    customFields: [
      {
        key: 'qualification',
        label: { hi: 'शैक्षणिक योग्यता', en: 'Educational Qualification' },
        type: 'select',
        options: [
          { value: '12th Pass / Higher Secondary', label: { hi: '12वीं उत्तीर्ण', en: '12th Pass / Higher Secondary' } },
          { value: 'Graduate / Post-Graduate', label: { hi: 'स्नातक / स्नातकोत्तर', en: 'Graduate / Post-Graduate' } },
          { value: 'Agriculture / Technical Diploma', label: { hi: 'कृषि / तकनीकी डिप्लोमा', en: 'Agriculture / Technical Diploma' } },
          { value: 'Experienced Community Leader', label: { hi: 'अनुभवी ग्राम सामाजिक कार्यकर्ता', en: 'Experienced Community Leader' } },
        ],
      },
      {
        key: 'mobility',
        label: { hi: 'स्मार्टफोन एवं क्षेत्रीय आवागमन सुविधा', en: 'Smartphone & Field Mobility' },
        type: 'select',
        options: [
          { value: 'Smartphone + Two-Wheeler', label: { hi: 'स्मार्टफोन + दोपहिया वाहन उपलब्ध', en: 'Smartphone + Two-Wheeler Available' } },
          { value: 'Smartphone (Local Village Focus)', label: { hi: 'स्मार्टफोन (स्थानीय ग्राम स्तर)', en: 'Smartphone (Local Village Focus)' } },
        ],
      },
      {
        key: 'weeklyHours',
        label: { hi: 'साप्ताहिक उपलब्ध समय', en: 'Weekly Time Availability' },
        type: 'select',
        options: [
          { value: '10-15 Hours / Week', label: { hi: '10–15 घंटे / सप्ताह', en: '10–15 Hours / Week' } },
          { value: 'Full-Time Community Outreach', label: { hi: 'नियमित क्षेत्रीय समन्वय', en: 'Regular Field Coordination' } },
          { value: 'Weekends & Campaign Days', label: { hi: 'सप्ताहांत एवं अभियान दिवस', en: 'Weekends & Campaign Days' } },
        ],
      },
    ],
  },
  {
    id: 'gaushala',
    number: 3,
    iconName: 'Home',
    label: { hi: '3. आत्मनिर्भर गौशाला पंजीकरण फॉर्म', en: '3. Self-Reliant Gaushala Form' },
    subtitle: {
      hi: 'गौशाला को वर्मीकम्पोस्ट, जीवामृत, बायोगैस/CBG और हरा चारा मॉडल से जोड़ने हेतु',
      en: 'Connect your Gaushala with vermicompost, biogas/CBG feasibility, and fodder programs',
    },
    orgLabel: { hi: 'गौशाला का पूरा नाम एवं स्थान *', en: 'Gaushala Full Name & Location *' },
    orgPlaceholder: { hi: 'उदा. श्री गोपाल गौशाला समिति, बीकानेर', en: 'e.g. Shri Gopal Gaushala Samiti, Bikaner' },
    detailsLabel: { hi: 'गौशाला की वर्तमान आवश्यकताएँ एवं भूमि विवरण', en: 'Current Infrastructure & Support Requirements' },
    detailsPlaceholder: { hi: 'कम्पोस्ट शेड, बायोगैस, चारा या पशु चिकित्सा आवश्यकता...', en: 'Compost unit, biogas assessment, fodder or veterinary support...' },
    customFields: [
      {
        key: 'registrationStatus',
        label: { hi: 'पंजीकरण स्थिति व विवरण (रजिस्टर्ड / गैर-रजिस्टर्ड)', en: 'Registration Status & Reg. Number' },
        type: 'text',
        placeholder: { hi: 'उदा. सोसायटी/ट्रस्ट पंजीकृत (क्रमांक) या अभी अपंजीकृत', en: 'e.g. Registered Trust/Society (Reg No.) or Unregistered' },
      },
      {
        key: 'cattleCount',
        label: { hi: 'कुल गोवंश संख्या', en: 'Total Cattle Strength' },
        type: 'select',
        options: [
          { value: 'Up to 100 Cattle', label: { hi: '100 तक गोवंश', en: 'Up to 100 Cattle' } },
          { value: '100 - 300 Cattle', label: { hi: '100 – 300 गोवंश', en: '100 – 300 Cattle' } },
          { value: '300 - 800 Cattle', label: { hi: '300 – 800 गोवंश', en: '300 – 800 Cattle' } },
          { value: '800+ Cattle', label: { hi: '800 से अधिक गोवंश', en: '800+ Cattle' } },
        ],
      },
      {
        key: 'dailyDungKg',
        label: { hi: 'अनुमानित दैनिक गोबर उपलब्धता (किग्रा/दिन)', en: 'Approx. Daily Dung Availability (kg/day)' },
        type: 'text',
        placeholder: { hi: 'उदा. 1,500 किग्रा प्रतिदिन', en: 'e.g. 1,500 kg per day' },
      },
      {
        key: 'existingFacilities',
        label: { hi: 'वर्तमान उपलब्ध सुविधाएँ (शेड, पानी, चारा भूमि, कम्पोस्ट पिट)', en: 'Existing Facilities (Shed, Water, Land, Compost Pit)' },
        type: 'text',
        placeholder: { hi: 'उदा. 2 टिन शेड, ट्यूबवेल व 3 बीघा भूमि उपलब्ध', en: 'e.g. 2 sheds, borewell, and 3 bigha land available' },
      },
      {
        key: 'gaushalaPriority',
        label: { hi: 'प्रमुख सहयोग प्राथमिकता', en: 'Primary Self-Reliance Priority' },
        type: 'select',
        options: [
          { value: 'Vermicompost & Organic Manure Unit', label: { hi: 'वर्मीकम्पोस्ट एवं जैविक खाद इकाई', en: 'Vermicompost & Organic Manure Unit' } },
          { value: 'Cow-Dung Eco Products & SHG Training', label: { hi: 'गोबर उत्पाद निर्माण एवं महिला SHG प्रशिक्षण', en: 'Cow-Dung Eco Products & SHG Training' } },
          { value: 'Biogas / Bio-CNG (CBG) Feasibility', label: { hi: 'बायोगैस / CBG व्यवहार्यता मूल्यांकन', en: 'Biogas / Bio-CNG (CBG) Feasibility' } },
          { value: 'Green Fodder & Sapling Nursery', label: { hi: 'हरा चारा विकास एवं पौध नर्सरी', en: 'Green Fodder & Sapling Nursery' } },
          { value: 'Veterinary Care & Govt Scheme Guidance', label: { hi: 'पशु चिकित्सा शिविर एवं सरकारी योजना मार्गदर्शन', en: 'Veterinary Care & Govt Scheme Guidance' } },
        ],
      },
    ],
  },
  {
    id: 'school-college',
    number: 4,
    iconName: 'GraduationCap',
    label: { hi: '4. स्कूल / कॉलेज ग्रीन कैंपस फॉर्म', en: '4. School / College Green Campus Form' },
    subtitle: {
      hi: 'शैक्षणिक संस्थानों में वृक्षारोपण, इको-क्लब, जलवायु कार्यशाला एवं छात्र सहभागिता हेतु',
      en: 'Campus tree plantation, student eco-clubs, climate literacy & skill workshops',
    },
    orgLabel: { hi: 'विद्यालय / महाविद्यालय / विश्वविद्यालय का नाम *', en: 'School / College / University Name *' },
    orgPlaceholder: { hi: 'उदा. राजकीय महाविद्यालय, जोधपुर', en: 'e.g. Government College, Jodhpur' },
    detailsLabel: { hi: 'कैंपस में उपलब्ध वृक्षारोपण स्थान एवं प्रस्तावित गतिविधि', en: 'Campus Plantation Space & Proposed Student Activity' },
    detailsPlaceholder: { hi: 'परिसर में 100 छायादार पौधे व इको-क्लब कार्यशाला...', en: 'Space for 100 native saplings & student eco-club session...' },
    customFields: [
      {
        key: 'institutionType',
        label: { hi: 'संस्थान का प्रकार', en: 'Institution Category' },
        type: 'select',
        options: [
          { value: 'Government School', label: { hi: 'राजकीय विद्यालय', en: 'Government School' } },
          { value: 'Private / Aided School', label: { hi: 'निजी / सहायता प्राप्त विद्यालय', en: 'Private / Aided School' } },
          { value: 'College / University', label: { hi: 'महाविद्यालय / विश्वविद्यालय', en: 'College / University' } },
          { value: 'ITI / Polytechnic / Coaching', label: { hi: 'आईटीआई / पॉलिटेक्निक संस्थान', en: 'ITI / Polytechnic Institute' } },
        ],
      },
      {
        key: 'studentStrength',
        label: { hi: 'कुल छात्र संख्या', en: 'Total Student Strength' },
        type: 'text',
        placeholder: { hi: 'उदा. 650 विद्यार्थी', en: 'e.g. 650 Students' },
      },
      {
        key: 'campusProgram',
        label: { hi: 'पसंदीदा ग्रीन कैंपस कार्यक्रम', en: 'Preferred Campus Program' },
        type: 'select',
        options: [
          { value: 'Green Campus Tree Plantation Drive', label: { hi: 'ग्रीन कैंपस वृक्षारोपण अभियान', en: 'Green Campus Tree Plantation Drive' } },
          { value: 'Eco-Club & Climate Action Workshop', label: { hi: 'इको-क्लब एवं जलवायु जागरूकता सेमिनार', en: 'Eco-Club & Climate Action Seminar' } },
          { value: 'Career, Digital & Foreign Language Session', label: { hi: 'करियर, डिजिटल व विदेशी भाषा कार्यशाला', en: 'Career, Digital & Language Workshop' } },
          { value: 'Harit Marathon Student Group Participation', label: { hi: 'हरित मैराथन छात्र दल सहभागिता', en: 'Harit Marathon Student Contingent' } },
        ],
      },
    ],
  },
  {
    id: 'women-shg',
    number: 5,
    iconName: 'Users',
    label: { hi: '5. महिला स्वयं सहायता समूह (SHG) फॉर्म', en: '5. Women SHG & Enterprise Form' },
    subtitle: {
      hi: 'कपड़े के थैले निर्माण, ग्रामीण महिला उद्यमिता, डिजिटल-वित्तीय साक्षरता एवं स्वास्थ्य जागरूकता',
      en: 'Cloth-bag production, women micro-enterprise, digital literacy & health workshops',
    },
    orgLabel: { hi: 'महिला समूह (SHG) का नाम एवं गाँव/वार्ड *', en: 'Women SHG Name & Village / Ward *' },
    orgPlaceholder: { hi: 'उदा. शक्ति महिला स्वयं सहायता समूह', en: 'e.g. Shakti Mahila Self-Help Group' },
    detailsLabel: { hi: 'वर्तमान कार्य एवं प्रशिक्षण / बाजार सहयोग की आवश्यकता', en: 'Current Craft Activity & Training / Market Linkage Need' },
    detailsPlaceholder: { hi: 'सिलाई मशीन उपलब्धता, कॉटन बैग ऑर्डर या प्रशिक्षण...', en: 'Tailoring capacity, cotton bag institutional orders, training...' },
    customFields: [
      {
        key: 'memberCount',
        label: { hi: 'समूह में महिला सदस्यों की संख्या', en: 'Number of Women Members in Group' },
        type: 'text',
        placeholder: { hi: 'उदा. 12 महिला सदस्य', en: 'e.g. 12 Women Members' },
      },
      {
        key: 'shgActivity',
        label: { hi: 'प्रमुख आजीविका / प्रशिक्षण रुचि', en: 'Primary Livelihood / Training Track' },
        type: 'select',
        options: [
          { value: 'Eco Cotton & Jute Bag Stitching', label: { hi: 'कपड़े व जूट के थैले निर्माण (प्लास्टिक विकल्प)', en: 'Eco Cotton & Jute Bag Stitching' } },
          { value: 'Sapling Nursery & Vermicompost', label: { hi: 'पौध नर्सरी एवं वर्मीकम्पोस्ट उत्पादन', en: 'Sapling Nursery & Vermicompost' } },
          { value: 'Organic Spices & Rural Food Products', label: { hi: 'जैविक मसाले एवं ग्रामीण खाद्य प्रसंस्करण', en: 'Organic Spices & Food Products' } },
          { value: 'Financial, Digital & Health Literacy', label: { hi: 'वित्तीय, डिजिटल एवं महिला स्वास्थ्य जागरूकता', en: 'Financial, Digital & Health Literacy' } },
        ],
      },
    ],
  },
  {
    id: 'skill-training',
    number: 6,
    iconName: 'GraduationCap',
    label: { hi: '6. कौशल विकास एवं विदेशी भाषा फॉर्म', en: '6. Skill & Foreign Language Course Form' },
    subtitle: {
      hi: 'जर्मन, जापानी, फ्रेंच, स्पोकन इंग्लिश, कंप्यूटर साक्षरता एवं हरित उद्यमिता प्रशिक्षण हेतु',
      en: 'Admission inquiry for German, Japanese, English, Digital Skills & Green Jobs courses',
    },
    orgLabel: { hi: 'शहर / गाँव / वर्तमान शिक्षण संस्थान *', en: 'City / Village / Current Institution *' },
    orgPlaceholder: { hi: 'उदा. भीलवाड़ा शहर / राजकीय पॉलिटेक्निक', en: 'e.g. Bhilwara / Polytechnic College' },
    detailsLabel: { hi: 'करियर लक्ष्य एवं अतिरिक्त प्रश्न', en: 'Career Goal & Additional Learning Notes' },
    detailsPlaceholder: { hi: 'भाषा सीखने या कौशल प्रशिक्षण का उद्देश्य...', en: 'Your learning objective or batch preference...' },
    customFields: [
      {
        key: 'courseTrack',
        label: { hi: 'पसंदीदा प्रशिक्षण पाठ्यक्रम चुनें', en: 'Select Preferred Training Course' },
        type: 'select',
        options: [
          { value: 'German Language Foundation (A1/A2)', label: { hi: 'जर्मन भाषा फाउंडेशन (A1 / A2 मार्गदर्शन)', en: 'German Language Foundation (A1 / A2)' } },
          { value: 'Japanese / French Introductory Track', label: { hi: 'जापानी / फ्रेंच प्रारंभिक संवाद पाठ्यक्रम', en: 'Japanese / French Introductory Track' } },
          { value: 'Spoken English & Interview Readiness', label: { hi: 'अंग्रेजी संवाद एवं साक्षात्कार तैयारी', en: 'Spoken English & Interview Readiness' } },
          { value: 'Computer, Digital & E-Governance Skills', label: { hi: 'कंप्यूटर, डिजिटल कौशल एवं ई-गवर्नेंस', en: 'Computer, Digital & E-Governance Skills' } },
          { value: 'Rural Agro, Nursery & Green Enterprise', label: { hi: 'ग्रामीण कृषि, नर्सरी एवं हरित उद्यमिता', en: 'Rural Agro, Nursery & Green Enterprise' } },
        ],
      },
      {
        key: 'educationLevel',
        label: { hi: 'वर्तमान शैक्षणिक योग्यता', en: 'Current Qualification' },
        type: 'select',
        options: [
          { value: '10th / 12th Student', label: { hi: '10वीं / 12वीं विद्यार्थी', en: '10th / 12th Student' } },
          { value: 'Undergraduate / Graduate', label: { hi: 'स्नातक / कॉलेज विद्यार्थी', en: 'Undergraduate / Graduate' } },
          { value: 'Nursing / ITI / Technical Diploma', label: { hi: 'नर्सिंग / आईटीआई / तकनीकी डिप्लोमा', en: 'Nursing / ITI / Technical Diploma' } },
        ],
      },
      {
        key: 'learningMode',
        label: { hi: 'पसंदीदा प्रशिक्षण माध्यम', en: 'Preferred Learning Mode' },
        type: 'select',
        options: [
          { value: 'Hybrid (Online + District Center)', label: { hi: 'हाइब्रिड (ऑनलाइन + जिला केंद्र)', en: 'Hybrid (Online + District Center)' } },
          { value: 'Offline District Classroom', label: { hi: 'ऑफलाइन जिला प्रशिक्षण केंद्र', en: 'Offline District Classroom' } },
          { value: 'Online Live Batch', label: { hi: 'ऑनलाइन लाइव बैच', en: 'Online Live Batch' } },
        ],
      },
    ],
  },
  {
    id: 'volunteer',
    number: 7,
    iconName: 'HeartHandshake',
    label: { hi: '7. स्वयंसेवक एवं युवा अभियान फॉर्म', en: '7. Volunteer & Youth Campaign Form' },
    subtitle: {
      hi: 'वृक्षारोपण, स्वच्छ ग्राम अभियान, वरिष्ठ नागरिक सेवा और जनजागरूकता में योगदान हेतु',
      en: 'Join weekend plantation drives, cleanliness campaigns, senior care & public outreach',
    },
    orgLabel: { hi: 'शहर / गाँव / कॉलेज या कार्यस्थल *', en: 'City / Village / College or Workplace *' },
    orgPlaceholder: { hi: 'उदा. चूरू / युवा स्वयंसेवक समूह', en: 'e.g. Churu / Youth Volunteer Circle' },
    detailsLabel: { hi: 'आप किस प्रकार योगदान देना चाहते हैं?', en: 'How would you like to contribute?' },
    detailsPlaceholder: { hi: 'वृक्षारोपण, फोटोग्राफी, सोशल मीडिया, इवेंट प्रबंधन...', en: 'Plantation, media outreach, event coordination, senior seva...' },
    customFields: [
      {
        key: 'volunteerTrack',
        label: { hi: 'प्रमुख सेवा क्षेत्र चुनें', en: 'Primary Volunteering Area' },
        type: 'select',
        options: [
          { value: 'Tree Plantation & Sapling Survival Care', label: { hi: 'वृक्षारोपण एवं पौध जीवितता देखभाल', en: 'Tree Plantation & Sapling Survival Care' } },
          { value: 'Clean Village & Plastic-Free Markets', label: { hi: 'स्वच्छ ग्राम एवं प्लास्टिक-मुक्त अभियान', en: 'Clean Village & Plastic-Free Markets' } },
          { value: 'Senior Citizen Care & Mental Well-being', label: { hi: 'वरिष्ठ नागरिक सम्मान एवं मानसिक स्वास्थ्य सेवा', en: 'Senior Citizen Care & Mental Well-being' } },
          { value: 'Media, Design & Community Awareness', label: { hi: 'मीडिया, लेखन एवं जन-जागरूकता', en: 'Media, Design & Community Awareness' } },
        ],
      },
      {
        key: 'availability',
        label: { hi: 'उपलब्धता', en: 'Availability Schedule' },
        type: 'select',
        options: [
          { value: 'Weekends (Saturday / Sunday)', label: { hi: 'सप्ताहांत (शनिवार / रविवार)', en: 'Weekends (Saturday / Sunday)' } },
          { value: 'Special Campaign & Event Days', label: { hi: 'विशेष अभियान एवं आयोजन दिवस', en: 'Special Campaign & Event Days' } },
          { value: 'Regular Weekly Volunteering', label: { hi: 'नियमित साप्ताहिक सहभागिता', en: 'Regular Weekly Volunteering' } },
        ],
      },
    ],
  },
  {
    id: 'marathon',
    number: 8,
    iconName: 'Users',
    label: { hi: '8. हरित मैराथन 2026 धावक फॉर्म', en: '8. Harit Marathon 2026 Runner Form' },
    subtitle: {
      hi: '20 दिसंबर 2026 • भीलवाड़ा — "Run for Green Rajasthan" में प्रतिभागी पंजीकरण',
      en: '20 December 2026 · Bhilwara — Official runner & green walk participant registration',
    },
    orgLabel: { hi: 'शहर / गाँव / क्लब या संस्थान का नाम *', en: 'City / Village / Running Club or School *' },
    orgPlaceholder: { hi: 'उदा. भीलवाड़ा रनर्स क्लब / सुखाड़िया सर्कल', en: 'e.g. Bhilwara Runners Club' },
    detailsLabel: { hi: 'आपातकालीन संपर्क नाम व नंबर एवं स्वास्थ्य नोट', en: 'Emergency Contact Name & Number' },
    detailsPlaceholder: { hi: 'आपातकालीन संपर्क व्यक्ति व मोबाइल नंबर...', en: 'Emergency contact person & phone number...' },
    customFields: [
      {
        key: 'raceCategory',
        label: { hi: 'मैराथन दौड़ श्रेणी चुनें *', en: 'Select Marathon Race Category *' },
        type: 'select',
        options: [
          { value: '10 KM Green Run (18+ Yrs)', label: { hi: '10 KM ग्रीन रन (18+ वर्ष)', en: '10 KM Green Run (18+ Yrs)' } },
          { value: '5 KM Youth & Fitness Run (14+ Yrs)', label: { hi: '5 KM यूथ एवं फिटनेस रन (14+ वर्ष)', en: '5 KM Youth & Fitness Run (14+ Yrs)' } },
          { value: '2 KM Family & Senior Walk (All Ages)', label: { hi: '2 KM हरित परिवार एवं वरिष्ठजन वॉक', en: '2 KM Family & Senior Walk (All Ages)' } },
        ],
      },
      {
        key: 'tshirtSize',
        label: { hi: 'टी-शर्ट साइज (T-Shirt Size)', en: 'Runner T-Shirt Size' },
        type: 'select',
        options: [
          { value: 'M (Medium)', label: { hi: 'M (Medium)', en: 'M (Medium)' } },
          { value: 'L (Large)', label: { hi: 'L (Large)', en: 'L (Large)' } },
          { value: 'S (Small)', label: { hi: 'S (Small)', en: 'S (Small)' } },
          { value: 'XL (Extra Large)', label: { hi: 'XL (Extra Large)', en: 'XL (Extra Large)' } },
          { value: 'XXL', label: { hi: 'XXL', en: 'XXL' } },
        ],
      },
      {
        key: 'pledgeTreeSpecies',
        label: { hi: 'आपके नाम से संकल्पित वृक्ष प्रजाति', en: 'Your Pledged Native Tree Species' },
        type: 'select',
        options: [
          { value: 'Khejri (State Tree)', label: { hi: 'खेजड़ी (राज्य वृक्ष)', en: 'Khejri (State Tree)' } },
          { value: 'Neem', label: { hi: 'नीम', en: 'Neem' } },
          { value: 'Rohida (State Flower Tree)', label: { hi: 'रोहिड़ा', en: 'Rohida' } },
          { value: 'Deshi Amla / Peepal', label: { hi: 'देशी आँवला / पीपल', en: 'Deshi Amla / Peepal' } },
        ],
      },
    ],
  },
  {
    id: 'csr-partner',
    number: 9,
    iconName: 'Landmark',
    label: { hi: '9. CSR एवं कॉर्पोरेट साझेदारी फॉर्म', en: '9. CSR & Corporate Partnership Form' },
    subtitle: {
      hi: 'कंपनियों, उद्योगों और फाउंडेशनों के लिए जिला हरित अभियान, गौशाला व कौशल CSR सहयोग',
      en: 'For corporate CSR heads, ESG foundations & institutional grant partnerships',
    },
    orgLabel: { hi: 'कंपनी / कॉर्पोरेट संगठन का नाम एवं पदनाम *', en: 'Company / Organisation Name & Designation *' },
    orgPlaceholder: { hi: 'उदा. ABC Industries Ltd. — CSR Head', en: 'e.g. ABC Industries Ltd. — CSR Lead' },
    detailsLabel: { hi: 'CSR प्रस्ताव, लक्षित जिला एवं संभावित सहयोग विवरण', en: 'CSR Proposal Scope, Target Districts & Timeline' },
    detailsPlaceholder: { hi: 'वृक्षारोपण, गौशाला बायोगैस या ग्रीन कैंपस CSR सहयोग...', en: 'Outline CSR focus area, target Rajasthan district & timeline...' },
    customFields: [
      {
        key: 'officialEmail',
        label: { hi: 'आधिकारिक कॉर्पोरेट ईमेल (Official Email)', en: 'Official Corporate Email' },
        type: 'text',
        placeholder: { hi: 'csr@company.com', en: 'csr@company.com' },
      },
      {
        key: 'csrTheme',
        label: { hi: 'प्रमुख CSR फोकस क्षेत्र', en: 'Primary CSR Focus Pillar' },
        type: 'select',
        options: [
          { value: 'District Afforestation & Rural Agroforestry', label: { hi: 'जिला वृक्षारोपण एवं कृषि वानिकी', en: 'District Afforestation & Agroforestry' } },
          { value: 'Self-Reliant Gaushala & Biogas Cluster', label: { hi: 'आत्मनिर्भर गौशाला एवं बायोगैस क्लस्टर', en: 'Self-Reliant Gaushala & Biogas Cluster' } },
          { value: 'Water Conservation (Johad/Kund) & Solar', label: { hi: 'जल संरक्षण (कुंड/जोहड़) एवं सोलर', en: 'Water Conservation & Heritage Solar' } },
          { value: 'Rural Youth Skill Lab & Women SHG Bags', label: { hi: 'युवा कौशल प्रयोगशाला एवं महिला SHG थैला प्रोजेक्ट', en: 'Youth Skill Lab & Women SHG Enterprise' } },
          { value: 'Harit Marathon 2026 Event Sponsorship', label: { hi: 'हरित मैराथन 2026 मुख्य प्रायोजन', en: 'Harit Marathon 2026 Event Sponsorship' } },
        ],
      },
    ],
  },
  {
    id: 'ngo-institution',
    number: 10,
    iconName: 'Trees',
    label: { hi: '10. ग्राम पंचायत / NGO / संस्था सहयोग फॉर्म', en: '10. Gram Panchayat, FPO & NGO Form' },
    subtitle: {
      hi: 'ग्राम पंचायतों, किसान उत्पादक संगठनों (FPO) और सामाजिक संस्थाओं के साथ संयुक्त अभियान',
      en: 'Joint village campaigns with Gram Panchayats, FPOs, cooperatives & grassroots NGOs',
    },
    orgLabel: { hi: 'ग्राम पंचायत / NGO / FPO का नाम *', en: 'Gram Panchayat / NGO / FPO Name *' },
    orgPlaceholder: { hi: 'उदा. ग्राम पंचायत फलोदी / मरुधर किसान FPO', en: 'e.g. Gram Panchayat / Local FPO Name' },
    detailsLabel: { hi: 'सामुदायिक भूमि / जल स्रोत एवं प्रस्तावित संयुक्त कार्य', en: 'Community Land / Water Body & Joint Action Plan' },
    detailsPlaceholder: { hi: 'पंचायत चारागाह भूमि, जोहड़ जीर्णोद्धार या नर्सरी...', en: 'Panchayat pasture land, kund restoration, or farmer mobilisation...' },
    customFields: [
      {
        key: 'entityCategory',
        label: { hi: 'संस्था की श्रेणी', en: 'Institution / Body Type' },
        type: 'select',
        options: [
          { value: 'Gram Panchayat / Local Civic Body', label: { hi: 'ग्राम पंचायत / स्थानीय निकाय', en: 'Gram Panchayat / Local Civic Body' } },
          { value: 'Farmer Producer Organisation (FPO)', label: { hi: 'किसान उत्पादक संगठन (FPO)', en: 'Farmer Producer Organisation (FPO)' } },
          { value: 'Registered NGO / Public Trust', label: { hi: 'पंजीकृत एनजीओ / सार्वजनिक ट्रस्ट', en: 'Registered NGO / Public Trust' } },
          { value: 'Temple Trust / Community Samiti', label: { hi: 'मंदिर ट्रस्ट / सामुदायिक विकास समिति', en: 'Temple Trust / Community Samiti' } },
        ],
      },
      {
        key: 'collaborationArea',
        label: { hi: 'संयुक्त अभियान प्राथमिकता', en: 'Joint Campaign Priority' },
        type: 'select',
        options: [
          { value: 'Village Pasture & Community Plantation', label: { hi: 'ग्राम चारागाह एवं सामुदायिक वृक्षारोपण', en: 'Village Pasture & Community Plantation' } },
          { value: 'Traditional Kund / Johad Water Revival', label: { hi: 'पारंपरिक कुंड / जोहड़ जल संरक्षण', en: 'Traditional Kund / Johad Water Revival' } },
          { value: 'Temple Floral Waste Composting & Plastic-Free', label: { hi: 'मंदिर अपशिष्ट कम्पोस्ट एवं प्लास्टिक-मुक्त बाजार', en: 'Temple Waste Composting & Plastic-Free' } },
        ],
      },
    ],
  },
  {
    id: 'expert-trainer',
    number: 11,
    iconName: 'GraduationCap',
    label: { hi: '11. विशेषज्ञ / प्रशिक्षक एवं सलाहकार फॉर्म', en: '11. Expert, Trainer & Advisor Form' },
    subtitle: {
      hi: 'कृषि वैज्ञानिक, कार्बन MRV विशेषज्ञ, भाषा प्रशिक्षक, पशु चिकित्सक एवं मनोवैज्ञानिक पैनल',
      en: 'Empanelment for agronomists, carbon specialists, language faculty, vets & counselors',
    },
    orgLabel: { hi: 'वर्तमान संस्थान / विश्वविद्यालय / विशेषज्ञता *', en: 'Current Affiliation / University / Practice *' },
    orgPlaceholder: { hi: 'उदा. कृषि विश्वविद्यालय / वरिष्ठ भाषा प्रशिक्षक', en: 'e.g. Agriculture University / Language Trainer' },
    detailsLabel: { hi: 'शैक्षणिक योग्यता, अनुभव एवं योगदान का स्वरूप', en: 'Academic Credentials, Publications & Contribution Plan' },
    detailsPlaceholder: { hi: 'किसान प्रशिक्षण, पाठ्यक्रम निर्माण या तकनीकी सलाह...', en: 'Farmer workshops, curriculum design, or technical advisory...' },
    customFields: [
      {
        key: 'domainExpertise',
        label: { hi: 'विशेषज्ञता का मुख्य क्षेत्र', en: 'Primary Domain of Expertise' },
        type: 'select',
        options: [
          { value: 'Agronomy, Soil Science & Organic Farming', label: { hi: 'कृषि विज्ञान, मृदा परीक्षण एवं जैविक खेती', en: 'Agronomy, Soil Science & Organic Farming' } },
          { value: 'Carbon Credit, Forestry & MRV Auditing', label: { hi: 'कार्बन क्रेडिट, वानिकी एवं MRV मूल्यांकन', en: 'Carbon Credit, Forestry & MRV Auditing' } },
          { value: 'Foreign Languages (German, Japanese, English)', label: { hi: 'विदेशी भाषा प्रशिक्षण (जर्मन, जापानी, अंग्रेजी)', en: 'Foreign Languages (German, Japanese, English)' } },
          { value: 'Veterinary Science & Gaushala Management', label: { hi: 'पशु चिकित्सा विज्ञान एवं गौशाला प्रबंधन', en: 'Veterinary Science & Gaushala Management' } },
          { value: 'Mental Health, Yoga & Senior Citizen Care', label: { hi: 'मानसिक स्वास्थ्य, योग एवं वरिष्ठ नागरिक देखभाल', en: 'Mental Health, Yoga & Senior Citizen Care' } },
        ],
      },
      {
        key: 'experienceYears',
        label: { hi: 'कुल कार्य अनुभव (वर्षों में)', en: 'Total Years of Experience' },
        type: 'text',
        placeholder: { hi: 'उदा. 8 वर्ष का अनुभव', en: 'e.g. 8 Years Experience' },
      },
    ],
  },
  {
    id: 'membership',
    number: 12,
    iconName: 'CloudSun',
    label: { hi: '12. पत्रिका लेख, सदस्यता एवं सामान्य पूछताछ फॉर्म', en: '12. Magazine, Membership & Public Inquiry Form' },
    subtitle: {
      hi: '"हरित भारत संवाद" पत्रिका हेतु लेख/कहानी भेजने, संस्थागत सदस्यता एवं सामान्य संवाद हेतु',
      en: 'Submit articles for Harit Bharat Samvad magazine, membership inquiries & public feedback',
    },
    orgLabel: { hi: 'शहर / गाँव / व्यवसाय या संगठन *', en: 'City / Village / Profession or Organisation *' },
    orgPlaceholder: { hi: 'उदा. जयपुर / पर्यावरण लेखक एवं नागरिक', en: 'e.g. Jaipur / Environmental Writer' },
    detailsLabel: { hi: 'लेख का सारांश / सदस्यता रुचि या विस्तृत संदेश *', en: 'Article Summary, Membership Interest or Detailed Inquiry *' },
    detailsPlaceholder: { hi: 'अपना संदेश, लेख का विषय या सुझाव यहाँ लिखें...', en: 'Write your article synopsis, membership query, or feedback...' },
    customFields: [
      {
        key: 'inquirySubType',
        label: { hi: 'पूछताछ / सबमिशन का प्रकार चुनें', en: 'Select Submission / Inquiry Type' },
        type: 'select',
        options: [
          { value: 'Harit Bharat Samvad Magazine Article / Story', label: { hi: 'पत्रिका हेतु लेख / ग्रामीण सफलता की कहानी', en: 'Magazine Article / Rural Success Story' } },
          { value: 'Institutional Membership & Advisory Circle', label: { hi: 'संस्थागत सदस्यता एवं नागरिक जुड़ाव', en: 'Institutional Membership & Civic Circle' } },
          { value: 'Magazine Subscription & Media Inquiry', label: { hi: 'पत्रिका सदस्यता एवं मीडिया संपर्क', en: 'Magazine Subscription & Media Inquiry' } },
          { value: 'District Office General Inquiry / Feedback', label: { hi: 'जिला कार्यालय सामान्य पूछताछ / सुझाव', en: 'District Office General Inquiry / Feedback' } },
        ],
      },
    ],
  },
];

interface PublicLookupDisplay {
  applicationId: string;
  formType: string;
  applicantName: string;
  maskedMobile: string;
  district: string;
  status: string;
  submittedAt: string;
}

function mapAdminFormToSpec(form: AdminFormDefinition): CategoryFormSpec {
  return {
    id: form.id as RegistrationCategory,
    number: form.formNumber,
    iconName: form.iconName || 'Sprout',
    label: { hi: form.titleHi, en: form.titleEn },
    subtitle: { hi: form.subtitleHi, en: form.subtitleEn },
    orgLabel: { hi: form.orgLabelHi, en: form.orgLabelEn },
    orgPlaceholder: { hi: form.orgPlaceholderHi, en: form.orgPlaceholderEn },
    detailsLabel: { hi: form.detailsLabelHi, en: form.detailsLabelEn },
    detailsPlaceholder: { hi: form.detailsPlaceholderHi, en: form.detailsPlaceholderEn },
    isOpen: form.isOpen,
    closedMessage: { hi: form.closedMessageHi, en: form.closedMessageEn },
    customFields: (form.customFields || []).map((f) => ({
      key: f.key,
      label: { hi: f.labelHi, en: f.labelEn },
      type: f.type,
      required: f.required,
      placeholder:
        f.placeholderHi || f.placeholderEn
          ? { hi: f.placeholderHi ?? '', en: f.placeholderEn ?? '' }
          : undefined,
      options: f.options?.map((o) => ({
        value: o.value,
        label: { hi: o.labelHi, en: o.labelEn },
      })),
    })),
  };
}

interface RegistrationPortalProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  initialCategory?: RegistrationCategory;
  allowedCategories?: RegistrationCategory[];
  showDirectoryGrid?: boolean;
  onSelectCategoryRoute?: (category: RegistrationCategory) => void;
}

export function RegistrationPortal({
  lang,
  records,
  onAddRecord,
  initialCategory = 'farmer',
  allowedCategories,
  showDirectoryGrid = false,
  onSelectCategoryRoute,
}: RegistrationPortalProps) {
  const { bootstrap, onNavigate } = usePublicPortal();

  const mergedOptions = useMemo<CategoryFormSpec[]>(() => {
    const dynamicMap = new Map<string, AdminFormDefinition>();
    for (const f of bootstrap?.forms ?? []) {
      if (f.id !== 'contact') {
        dynamicMap.set(f.id, f);
      }
    }

    return CATEGORY_OPTIONS.map((staticOpt) => {
      const live = dynamicMap.get(staticOpt.id);
      return live ? mapAdminFormToSpec(live) : { ...staticOpt, isOpen: true };
    });
  }, [bootstrap?.forms]);

  const options = useMemo(
    () =>
      allowedCategories
        ? mergedOptions.filter((o) => allowedCategories.includes(o.id))
        : mergedOptions,
    [allowedCategories, mergedOptions]
  );

  const districtSelectOptions = useMemo(() => {
    const baseList = [
      { value: 'Bhilwara', label: 'Bhilwara (भीलवाड़ा — प्रथम चरण)' },
      { value: 'Churu', label: 'Churu (चूरू — प्रथम चरण)' },
      { value: 'Bikaner', label: 'Bikaner (बीकानेर — प्रथम चरण)' },
      { value: 'Phalodi', label: 'Phalodi (फलोदी — प्रथम चरण)' },
      { value: 'Jodhpur', label: 'Jodhpur (जोधपुर — प्रथम चरण)' },
      { value: 'Jaipur', label: 'Jaipur (जयपुर)' },
      { value: 'Sikar', label: 'Sikar (सीकर)' },
      { value: 'Jhunjhunu', label: 'Jhunjhunu (झुंझुनू)' },
      { value: 'Udaipur', label: 'Udaipur (उदयपुर)' },
      { value: 'Ajmer', label: 'Ajmer (अजमेर)' },
      { value: 'Nagaur', label: 'Nagaur (नागौर)' },
    ];
    const seen = new Set(baseList.map((d) => d.value.toLowerCase()));
    const merged = [...baseList];
    for (const d of bootstrap?.districts ?? []) {
      if (d.isActive && !seen.has(d.nameEn.toLowerCase())) {
        seen.add(d.nameEn.toLowerCase());
        merged.splice(5, 0, {
          value: d.nameEn,
          label: `${d.nameEn} (${d.nameHi})`,
        });
      }
    }
    return merged;
  }, [bootstrap?.districts]);

  const [category, setCategory] = useState<RegistrationCategory>(initialCategory);
  const [applicantName, setApplicantName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('Bhilwara');
  const [villageOrOrg, setVillageOrOrg] = useState('');
  const [details, setDetails] = useState('');
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<PublicLookupDisplay | null>(null);

  // Tamper-proof Harit Marathon Razorpay / Sandbox Checkout state
  const [marathonPaymentOrder, setMarathonPaymentOrder] = useState<{
    freeCategory: boolean;
    mode?: string;
    keyId?: string;
    orderId?: string;
    amountInr: number;
    amountPaise?: number;
    currency?: string;
    sandboxToken?: string;
    message?: string;
    categoryName: string;
    payerName: string;
    payerMobile: string;
  } | null>(null);
  const [sandboxPayMethod, setSandboxPayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [verifiedTx, setVerifiedTx] = useState<AdminPaymentTransaction | null>(null);

  const [lookupId, setLookupId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<PublicLookupDisplay | null | undefined>(
    undefined
  );
  const formCardRef = useRef<HTMLDivElement | null>(null);

  const [campaignContext, setCampaignContext] = useState<{
    campaignCode: string;
    campaignTitle: string;
    roleTitle: string;
    refCode: string;
  } | null>(null);

  useEffect(() => {
    setCategory(initialCategory);
    setErrors({});
    setSubmittedRecord(null);
    setMarathonPaymentOrder(null);
    setVerifiedTx(null);
    setPaymentError(null);

    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const urlDistrict = (sp.get('district') || '').trim();
      const urlCampaign = (sp.get('campaign') || '').trim();
      const urlCampaignTitle = (sp.get('campaignTitle') || '').trim();
      const urlRole = (sp.get('role') || '').trim();
      const urlRef = (sp.get('ref') || '').trim().toUpperCase();

      if (urlDistrict) {
        setDistrict(urlDistrict);
      }
      if (urlCampaign || urlRole || urlRef) {
        setCampaignContext({
          campaignCode: urlCampaign,
          campaignTitle: urlCampaignTitle,
          roleTitle: urlRole,
          refCode: urlRef,
        });
      } else {
        setCampaignContext(null);
      }
    }
  }, [initialCategory]);

  const activeOption =
    options.find((o) => o.id === category) ?? options[0] ?? CATEGORY_OPTIONS[0];
  const isFormOpen = activeOption.isOpen !== false;

  // Ensure select custom fields have sensible default values whenever form or schema updates
  useEffect(() => {
    const urlRef =
      typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('ref') || '').trim().toUpperCase()
        : '';
    setCustomValues((prev) => {
      const next: Record<string, string> = {};
      for (const f of activeOption.customFields) {
        if (f.key === 'referredByHaritMitra' && urlRef) {
          next[f.key] = urlRef;
        } else if (prev[f.key] !== undefined && prev[f.key] !== '') {
          next[f.key] = prev[f.key];
        } else if (f.type === 'select' && f.options && f.options.length > 0) {
          next[f.key] = f.options[0].value;
        } else {
          next[f.key] = '';
        }
      }
      return next;
    });
  }, [activeOption.id, activeOption.customFields]);

  const handleCategorySwitch = (nextCat: RegistrationCategory) => {
    setCategory(nextCat);
    setErrors({});
    setSubmittedRecord(null);
    if (onSelectCategoryRoute) {
      onSelectCategoryRoute(nextCat);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormOpen) return;

    const validation = validateRegistrationInput(
      {
        applicantName,
        mobile,
        district,
        villageOrOrg,
        consentAccepted,
        category,
      },
      []
    );

    const nextErrors: Record<string, string> = { ...validation.errors };
    for (const field of activeOption.customFields) {
      if (field.required && !(customValues[field.key] ?? '').trim()) {
        nextErrors[`custom_${field.key}`] =
          lang === 'hi'
            ? `${field.label.hi.replace(' *', '')} आवश्यक है।`
            : `${field.label.en.replace(' *', '')} is required.`;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const customSummaryParts = activeOption.customFields
      .map((field) => {
        const val = (customValues[field.key] ?? '').trim();
        return val ? `${field.label.en.replace(' *', '')}: ${val}` : '';
      })
      .filter(Boolean);

    const combinedDetails =
      [...customSummaryParts, details.trim()].filter(Boolean).join(' · ') ||
      'Initial registration submitted';

    const enrichedCustomFields: Record<string, string> = { ...customValues };
    if (campaignContext?.campaignCode) {
      enrichedCustomFields.campaignCode = campaignContext.campaignCode;
    }
    if (campaignContext?.campaignTitle) {
      enrichedCustomFields.campaignTitle = campaignContext.campaignTitle;
    }
    if (campaignContext?.roleTitle) {
      enrichedCustomFields.campaignRole = campaignContext.roleTitle;
    }
    if (campaignContext?.refCode && !enrichedCustomFields.referredByHaritMitra) {
      enrichedCustomFields.referredByHaritMitra = campaignContext.refCode;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const res = await submitPublicForm({
        formType: category,
        applicantName: applicantName.trim(),
        mobile: mobile.trim(),
        district,
        villageOrOrg: villageOrOrg.trim(),
        details: combinedDetails,
        customFields: enrichedCustomFields,
        consentAccepted: true,
      });

      const created: PublicLookupDisplay = {
        applicationId: res.submission.applicationId,
        formType: res.submission.formType,
        applicantName: res.submission.applicantName,
        maskedMobile: res.submission.maskedMobile,
        district: res.submission.district,
        status: res.submission.status,
        submittedAt: res.submission.submittedAt,
      };

      onAddRecord({
        applicationId: created.applicationId,
        category,
        applicantName: created.applicantName,
        mobile: created.maskedMobile,
        district: created.district,
        villageOrOrg: villageOrOrg.trim(),
        details: combinedDetails,
        formFields: { ...customValues },
        submittedAt: created.submittedAt.slice(0, 10),
        status: 'Submitted',
        consentAccepted: true,
      });

      setSubmittedRecord(created);
      setMarathonPaymentOrder(null);
      setVerifiedTx(null);
      setPaymentError(null);

      // Tamper-proof server fee lookup & Razorpay/Sandbox order creation for Harit Marathon
      if (category === 'marathon') {
        const liveEvent =
          bootstrap?.marathonEvents?.find((ev) => ev.registrationOpen) ??
          bootstrap?.marathonEvents?.[0];
        const chosenCategoryRaw =
          customValues.raceCategory ||
          customValues.runCategory ||
          customValues.category ||
          Object.values(customValues).find((v) => /km|walk|run/i.test(v)) ||
          liveEvent?.raceCategories?.[0]?.name ||
          '10 KM Green Run (18+ Yrs)';
        try {
          const orderRes = await createPaymentOrder({
            purpose: 'marathon',
            referenceId: created.applicationId,
            eventId: liveEvent?.id || 'harit-marathon-bhilwara-2026',
            categoryName: chosenCategoryRaw,
            payerName: applicantName.trim(),
            payerMobile: mobile.trim(),
            district,
          });
          setMarathonPaymentOrder({
            ...orderRes,
            categoryName: chosenCategoryRaw,
            payerName: applicantName.trim(),
            payerMobile: mobile.trim(),
          });
        } catch (payErr: any) {
          setPaymentError(
            payErr?.message ||
              (lang === 'hi'
                ? 'भुगतान आदेश बनाने में अस्थायी त्रुटि हुई।'
                : 'Unable to initialize payment order.')
          );
        }
      }

      setApplicantName('');
      setMobile('');
      setVillageOrOrg('');
      setDetails('');
      setConsentAccepted(false);
      const resetCustom: Record<string, string> = {};
      for (const f of activeOption.customFields) {
        resetCustom[f.key] =
          f.type === 'select' && f.options && f.options.length > 0
            ? f.options[0].value
            : '';
      }
      setCustomValues(resetCustom);
      setLookupId(created.applicationId);
      setLookupResult(created);
      formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors && Object.keys(err.errors).length > 0) {
          setErrors(err.errors);
        } else if (err.status === 409) {
          setErrors({ duplicate: err.message });
        } else {
          setErrors({ duplicate: err.message });
        }
      } else {
        setErrors({
          duplicate:
            lang === 'hi'
              ? 'आवेदन जमा करने में अस्थायी समस्या आई। कृपया पुनः प्रयास करें।'
              : 'Unable to submit application right now. Please try again.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteMarathonPayment = async () => {
    if (!marathonPaymentOrder || !marathonPaymentOrder.orderId) return;
    setVerifyingPayment(true);
    setPaymentError(null);
    try {
      // Live Razorpay Checkout when live keys & Razorpay script are present
      const rzpCtor = (window as any).Razorpay;
      if (
        marathonPaymentOrder.mode === 'live' &&
        marathonPaymentOrder.keyId &&
        marathonPaymentOrder.keyId !== 'rzp_sandbox_dev' &&
        typeof rzpCtor === 'function'
      ) {
        await new Promise<void>((resolve, reject) => {
          const instance = new rzpCtor({
            key: marathonPaymentOrder.keyId,
            amount: marathonPaymentOrder.amountPaise,
            currency: marathonPaymentOrder.currency || 'INR',
            name: 'GOVEDA Foundation — Harit Marathon',
            description: marathonPaymentOrder.categoryName,
            order_id: marathonPaymentOrder.orderId,
            prefill: {
              name: marathonPaymentOrder.payerName,
              contact: marathonPaymentOrder.payerMobile,
            },
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              try {
                const verified = await verifyPaymentSignature({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  paymentMethod: 'razorpay_checkout',
                });
                setVerifiedTx(verified.transaction);
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: () =>
                reject(
                  new Error(
                    lang === 'hi'
                      ? 'भुगतान विंडो बंद की गई। आप पुनः प्रयास कर सकते हैं।'
                      : 'Checkout window closed. You can retry payment anytime.'
                  )
                ),
            },
          });
          instance.open();
        });
      } else {
        // Server-Signed Sandbox Test Mode Verification (until live Razorpay keys are supplied)
        const syntheticPaymentId = `pay_sandbox_${Date.now().toString(36)}`;
        const verified = await verifyPaymentSignature({
          orderId: marathonPaymentOrder.orderId,
          paymentId: syntheticPaymentId,
          signature: marathonPaymentOrder.sandboxToken || '',
          paymentMethod: `sandbox_${sandboxPayMethod}`,
        });
        setVerifiedTx(verified.transaction);
      }
    } catch (err: any) {
      setPaymentError(
        err?.message ||
          (lang === 'hi'
            ? 'भुगतान सत्यापन विफल रहा। कृपया पुनः प्रयास करें।'
            : 'Payment signature verification failed. Please retry.')
      );
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleStatusSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = lookupId.trim();
    if (!cleaned) {
      setLookupResult(null);
      return;
    }

    setLookupLoading(true);
    try {
      const res = await lookupPublicApplicationStatus(cleaned);
      setLookupResult(res.record);
    } catch {
      const localFallback = records.find(
        (r) => r.applicationId.toUpperCase() === cleaned.toUpperCase()
      );
      if (localFallback) {
        const digits = localFallback.mobile.replace(/\D/g, '');
        setLookupResult({
          applicationId: localFallback.applicationId,
          formType: localFallback.category,
          applicantName: localFallback.applicantName,
          maskedMobile:
            digits.length >= 4 ? `******${digits.slice(-4)}` : '******',
          district: localFallback.district,
          status: localFallback.status,
          submittedAt: localFallback.submittedAt,
        });
      } else {
        setLookupResult(null);
      }
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 12 Dedicated Form Pages Selector Grid (when viewing Join Hub or multi-category portal) */}
      {(showDirectoryGrid || options.length > 1) && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2E7D32] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? `पंजीकरण फॉर्म चुनें (${options.length} समर्पित फॉर्म प्रकार)`
                  : `Select Dedicated Registration Form (${options.length} Form Types)`}
              </span>
            </p>
            <span className="text-[11px] text-stone-500">
              {lang === 'hi'
                ? 'प्रत्येक श्रेणी के लिए अलग समर्पित फॉर्म और यूनिक ID'
                : 'Each pathway features its own tailored fields & unique Reference ID'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {options.map((opt) => {
              const isSelected = opt.id === activeOption.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleCategorySwitch(opt.id)}
                  className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#1E5B2A] text-white border-[#1E5B2A] shadow-sm'
                      : 'bg-[#F7FAF6] hover:bg-[#EAF4E8] text-[#144527] border-[#479D27]/20'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 p-1 ${
                      isSelected ? 'bg-white/95' : 'bg-white border border-[#479D27]/15'
                    }`}
                  >
                    <GovedaMissionSvg iconName={opt.iconName} className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected ? 'text-white' : 'text-[#144527]'
                      }`}
                    >
                      {opt.label[lang]}
                    </p>
                    {opt.isOpen === false && (
                      <span
                        className={`inline-block mt-1 text-[10px] font-semibold ${
                          isSelected ? 'text-amber-200' : 'text-amber-700'
                        }`}
                      >
                        {lang === 'hi' ? 'अस्थायी रूप से बंद' : 'Temporarily Closed'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Tailored Category-Specific Registration Form */}
        <div
          ref={formCardRef}
          className="lg:col-span-7 scroll-mt-24 bg-gradient-to-b from-[#F5FAF3] via-white to-white rounded-[30px] border border-[#479D27]/25 shadow-[0_16px_40px_-20px_rgba(20,69,39,0.16)] p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#479D27]/15">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
                <span>
                  {lang === 'hi'
                    ? `समर्पित फॉर्म #${activeOption.number}`
                    : `Dedicated Form #${activeOption.number}`}
                </span>
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#144527] mt-0.5">
                {activeOption.label[lang]}
              </h3>
              <p className="text-xs sm:text-sm text-[#35463B] mt-1 leading-relaxed">
                {activeOption.subtitle[lang]}
              </p>
            </div>
            <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-[#479D27]/20 p-2 shrink-0 flex items-center justify-center">
              <GovedaMissionSvg iconName={activeOption.iconName} className="w-full h-full" />
            </div>
          </div>

          {campaignContext && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#EEF6EC] border border-[#368737]/30 text-xs text-[#144527] space-y-1">
              {campaignContext.campaignCode && (
                <p className="font-bold">
                  {lang === 'hi' ? 'चयनित अभियान: ' : 'Selected Campaign: '}
                  {campaignContext.campaignTitle || campaignContext.campaignCode}{' '}
                  <span className="font-mono text-[#2E7D32]">
                    ({campaignContext.campaignCode})
                  </span>
                </p>
              )}
              {campaignContext.roleTitle && (
                <p className="font-semibold">
                  {lang === 'hi' ? 'चयनित भूमिका: ' : 'Selected Role: '}
                  <span>{campaignContext.roleTitle}</span>
                </p>
              )}
              {campaignContext.refCode && (
                <p className="font-semibold">
                  {lang === 'hi' ? 'हरित मित्र रेफरल कोड: ' : 'Harit Mitra Referral Code: '}
                  <span className="font-mono">{campaignContext.refCode}</span>
                </p>
              )}
            </div>
          )}

          {submittedRecord && (
            <div
              role="status"
              className="mb-6 p-4 rounded-2xl bg-[#E8F2E6] border border-[#368737]/35 text-[#144527]"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1B5A32] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-bold">
                    {lang === 'hi'
                      ? 'आपका आवेदन सफलतापूर्वक दर्ज हो गया है!'
                      : 'Your application has been submitted successfully!'}
                  </p>
                  <p>
                    {lang === 'hi'
                      ? 'आवेदन संदर्भ संख्या (Application ID):'
                      : 'Application Reference ID:'}{' '}
                    <strong className="font-mono text-[#103820] select-all">
                      {submittedRecord.applicationId}
                    </strong>
                  </p>
                  <p className="text-xs text-[#2A3A30]">
                    {lang === 'hi'
                      ? 'कृपया भविष्य में स्थिति जाँचने के लिए यह ID सुरक्षित रखें।'
                      : 'Please keep this Reference ID to check your application status anytime.'}
                  </p>
                </div>
              </div>

              {/* Tamper-Proof Server-Verified Harit Marathon Payment Step */}
              {marathonPaymentOrder && (
                <div className="mt-4 pt-4 border-t border-[#368737]/25 space-y-3">
                  {marathonPaymentOrder.freeCategory ? (
                    <div className="rounded-xl bg-white/90 border border-[#368737]/25 px-4 py-3 flex items-center gap-2.5 text-xs font-semibold text-[#144527]">
                      <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
                      <span>
                        {lang === 'hi'
                          ? `${marathonPaymentOrder.categoryName} — निःशुल्क सामुदायिक श्रेणी (कोई शुल्क देय नहीं)।`
                          : `${marathonPaymentOrder.categoryName} — Free Community Pass confirmed (₹0 fee).`}
                      </span>
                    </div>
                  ) : verifiedTx ? (
                    <div className="rounded-xl bg-white border border-emerald-300 p-4 space-y-2 text-xs text-[#142119]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-800">
                          <ShieldCheck className="w-4 h-4" />
                          {lang === 'hi'
                            ? 'भुगतान सर्वर द्वारा सत्यापित एवं पूर्ण (CAPTURED)'
                            : 'Payment Server-Verified & Captured'}
                        </span>
                        <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          ₹{verifiedTx.amountInr} INR
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px] text-[#3B5143]">
                        <p>Order ID: {verifiedTx.orderId}</p>
                        <p>Payment ID: {verifiedTx.paymentId}</p>
                      </div>
                      <p className="text-[11px] text-[#4C6253]">
                        {lang === 'hi'
                          ? 'आपकी भुगतान रसीद एडमिन पैनल (Payments Reconciliation) में तुरंत दर्ज हो गई है।'
                          : 'Your verified payment receipt is immediately logged in the Admin Payments ledger.'}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-white border border-[#C8922A]/45 p-4 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-wider text-[#8E6212]">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>
                              {marathonPaymentOrder.mode === 'live'
                                ? 'Razorpay Live Checkout'
                                : 'Razorpay Sandbox Test Mode'}
                            </span>
                          </span>
                          <p className="text-sm font-extrabold text-[#144527] mt-0.5">
                            {marathonPaymentOrder.categoryName}
                          </p>
                          <p className="text-[11px] font-mono text-[#526557]">
                            Server Order: {marathonPaymentOrder.orderId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10.5px] font-semibold text-[#526557]">
                            {lang === 'hi' ? 'सर्वर-सत्यापित शुल्क' : 'Server-Locked Fee'}
                          </p>
                          <p className="text-xl font-extrabold text-[#144527] tabular-nums">
                            ₹{marathonPaymentOrder.amountInr}
                          </p>
                        </div>
                      </div>

                      {marathonPaymentOrder.mode !== 'live' && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-[#44544A]">
                            {lang === 'hi' ? 'टेस्ट भुगतान माध्यम:' : 'Test Method:'}
                          </span>
                          {(['upi', 'card', 'netbanking'] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setSandboxPayMethod(m)}
                              className={`px-2.5 py-1 rounded-lg border font-bold uppercase text-[10.5px] cursor-pointer ${
                                sandboxPayMethod === m
                                  ? 'bg-[#154A24] text-white border-[#154A24]'
                                  : 'bg-[#FAFBF8] text-[#144527] border-[#D4E0D7]'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}

                      {paymentError && (
                        <p className="text-xs text-red-700 font-semibold">{paymentError}</p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[11px] text-[#526557] max-w-sm">
                          {lang === 'hi'
                            ? 'शुल्क सीधे सर्वर डेटाबेस से लॉक होता है और HMAC-SHA256 हस्ताक्षर से सत्यापित होता है।'
                            : 'Fee is calculated server-side (tamper-proof) and confirmed via HMAC-SHA256 signature verification.'}
                        </p>
                        <button
                          type="button"
                          disabled={verifyingPayment}
                          onClick={handleCompleteMarathonPayment}
                          className="inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0E3619] disabled:opacity-60 text-white px-5 py-2.5 text-xs font-extrabold cursor-pointer"
                        >
                          {verifyingPayment ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {verifyingPayment
                              ? lang === 'hi'
                                ? 'सत्यापित हो रहा है...'
                                : 'Verifying...'
                              : lang === 'hi'
                              ? `₹${marathonPaymentOrder.amountInr} भुगतान व सत्यापन करें`
                              : `Pay ₹${marathonPaymentOrder.amountInr} & Verify`}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {errors.duplicate && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <span>{errors.duplicate}</span>
            </div>
          )}

          {!isFormOpen ? (
            <div
              role="status"
              className="rounded-2xl bg-amber-50/90 border border-amber-200 p-6 space-y-2.5 text-amber-950"
            >
              <div className="flex items-center gap-2 text-sm font-bold">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? 'यह पंजीकरण फॉर्म वर्तमान में अस्थायी रूप से बंद है'
                    : 'This Registration Form Is Temporarily Paused'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {activeOption.closedMessage?.[lang] ||
                  (lang === 'hi'
                    ? 'इस श्रेणी के आवेदन शीघ्र ही पुनः प्रारंभ किए जाएंगे। किसी भी प्रश्न के लिए कृपया संपर्क पेज से संदेश भेजें।'
                    : 'Applications for this pathway will reopen shortly. Please reach out via the Contact page for inquiries.')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-semibold text-[#144527] mb-1"
                  >
                    {lang === 'hi' ? 'आवेदक / प्रतिनिधि का पूरा नाम *' : 'Applicant Full Name *'}
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder={lang === 'hi' ? 'अपना पूरा नाम लिखें' : 'Enter full name'}
                    className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2.5 text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                  />
                  {errors.applicantName && (
                    <p className="text-xs text-red-700 mt-1">{errors.applicantName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-mobile"
                    className="block text-xs font-semibold text-[#144527] mb-1"
                  >
                    {lang === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Mobile Number (10 digits) *'}
                  </label>
                  <input
                    id="reg-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2.5 text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                  />
                  {errors.mobile && (
                    <p className="text-xs text-red-700 mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-district"
                    className="block text-xs font-semibold text-[#144527] mb-1"
                  >
                    {lang === 'hi' ? 'जिला चुनें *' : 'Select District *'}
                  </label>
                  <select
                    id="reg-district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2.5 text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                  >
                    {districtSelectOptions.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                    <option value="Other Rajasthan District">
                      {lang === 'hi' ? 'अन्य जिला (राजस्थान / भारत)' : 'Other District (Rajasthan / India)'}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="reg-org"
                    className="block text-xs font-semibold text-[#144527] mb-1"
                  >
                    {activeOption.orgLabel[lang]}
                  </label>
                  <input
                    id="reg-org"
                    type="text"
                    value={villageOrOrg}
                    onChange={(e) => setVillageOrOrg(e.target.value)}
                    placeholder={activeOption.orgPlaceholder[lang]}
                    className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2.5 text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                  />
                  {errors.villageOrOrg && (
                    <p className="text-xs text-red-700 mt-1">{errors.villageOrOrg}</p>
                  )}
                </div>
              </div>

              {/* Category-Specific Custom Domain Fields (Dynamically Synced with Admin Form Studio) */}
              {activeOption.customFields.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#F3F9F1]/90 border border-[#479D27]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeOption.customFields.map((field) => (
                    <div
                      key={field.key}
                      className={
                        field.type === 'textarea' ||
                        (activeOption.customFields.length % 2 === 1 &&
                          field.key ===
                            activeOption.customFields[activeOption.customFields.length - 1].key)
                          ? 'sm:col-span-2'
                          : ''
                      }
                    >
                      <label
                        htmlFor={`custom-${field.key}`}
                        className="block text-xs font-semibold text-[#144527] mb-1"
                      >
                        {field.label[lang]}
                        {field.required && !field.label[lang].includes('*') ? ' *' : ''}
                      </label>
                      {field.type === 'select' && field.options ? (
                        <select
                          id={`custom-${field.key}`}
                          value={customValues[field.key] ?? field.options[0]?.value ?? ''}
                          onChange={(e) =>
                            setCustomValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label[lang]}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={`custom-${field.key}`}
                          rows={2}
                          value={customValues[field.key] ?? ''}
                          onChange={(e) =>
                            setCustomValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder?.[lang] ?? ''}
                          className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                        />
                      ) : (
                        <input
                          id={`custom-${field.key}`}
                          type="text"
                          value={customValues[field.key] ?? ''}
                          onChange={(e) =>
                            setCustomValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder?.[lang] ?? ''}
                          className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2 text-xs sm:text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                        />
                      )}
                      {errors[`custom_${field.key}`] && (
                        <p className="text-xs text-red-700 mt-1">
                          {errors[`custom_${field.key}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label
                  htmlFor="reg-details"
                  className="block text-xs font-semibold text-[#144527] mb-1"
                >
                  {activeOption.detailsLabel[lang]}
                </label>
                <textarea
                  id="reg-details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={activeOption.detailsPlaceholder[lang]}
                  className="w-full rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2.5 text-sm text-[#1E2923] focus:outline-none focus:ring-2 focus:ring-[#368737]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#2A3A30] leading-relaxed">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#1B5A32] text-[#1B5A32] focus:ring-[#368737]"
                  />
                  <span>
                    {lang === 'hi'
                      ? 'मैं गोपनीयता नीति से सहमत हूँ और समझता/समझती हूँ कि यह प्रारंभिक पंजीकरण है (किसी निश्चित वित्तीय आय, कार्बन क्रेडिट या रोजगार की स्वतः गारंटी नहीं है)। *'
                      : 'I agree to the Privacy Policy and understand this is an initial registration/inquiry without guaranteed financial return, carbon credit, or employment entitlement. *'}
                  </span>
                </label>
                {errors.consentAccepted && (
                  <p className="text-xs text-red-700 mt-1">{errors.consentAccepted}</p>
                )}
              </div>

              <div className="pt-2">
                <SpringButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  <span>
                    {submitting
                      ? lang === 'hi'
                        ? 'आवेदन सुरक्षित किया जा रहा है...'
                        : 'Submitting Application...'
                      : lang === 'hi'
                      ? `${activeOption.label.hi} सबमिट करें`
                      : `Submit ${activeOption.label.en}`}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </SpringButton>
              </div>
            </form>
          )}
        </div>

        {/* Right: Privacy-Safe Application Status Lookup + Authenticated Admin Console Handoff */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F4F8F3] rounded-[28px] border border-[#1B5A32]/15 p-6">
            <h3 className="text-lg font-bold text-[#144527]">
              {lang === 'hi'
                ? 'आवेदन की स्थिति देखें (Application Status)'
                : 'Check Application Status'}
            </h3>
            <p className="text-xs text-[#44544A] mt-1 mb-4">
              {lang === 'hi'
                ? 'अपनी यूनिक Application ID दर्ज करें (उदा. GVD-FRM-2026-1001 या GVD-HM-2026-1002)'
                : 'Enter your unique Application Reference ID (e.g. GVD-FRM-2026-1001)'}
            </p>

            <form onSubmit={handleStatusSearch} className="flex gap-2">
              <input
                type="text"
                aria-label={lang === 'hi' ? 'Application ID दर्ज करें' : 'Application Reference ID'}
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="GVD-FRM-2026-1001"
                className="flex-1 min-w-0 rounded-xl border border-[#1B5A32]/25 bg-white px-3.5 py-2 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#368737]"
              />
              <SpringButton type="submit" variant="primary" size="sm" disabled={lookupLoading}>
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>{lookupLoading ? '...' : lang === 'hi' ? 'देखें' : 'Check'}</span>
              </SpringButton>
            </form>

            {lookupResult === null && (
              <p className="mt-3 text-xs text-red-700">
                {lang === 'hi'
                  ? 'इस Application ID से कोई रिकॉर्ड नहीं मिला। कृपया ID पुनः जाँचें।'
                  : 'No record found for this Application Reference ID. Please verify the code.'}
              </p>
            )}

            {lookupResult && (
              <div className="mt-4 p-4 rounded-xl bg-white border border-[#1B5A32]/20 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#1B5A32]/10 pb-2">
                  <span className="font-mono font-bold text-[#144527]">
                    {lookupResult.applicationId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#E8F2E6] text-[#144527] font-semibold">
                    {lookupResult.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-[#2A3A30]">
                  <div>
                    <span className="text-[#5B6B60] block">
                      {lang === 'hi' ? 'आवेदक' : 'Applicant'}
                    </span>
                    <strong className="text-[#1E2923]">{lookupResult.applicantName}</strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B60] block">
                      {lang === 'hi' ? 'जिला' : 'District'}
                    </span>
                    <strong className="text-[#1E2923]">{lookupResult.district}</strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B60] block">
                      {lang === 'hi' ? 'पंजीकृत मोबाइल' : 'Registered Mobile'}
                    </span>
                    <strong className="text-[#1E2923] font-mono">
                      {lookupResult.maskedMobile}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5B6B60] block">
                      {lang === 'hi' ? 'तिथि' : 'Submitted On'}
                    </span>
                    <strong className="text-[#1E2923] tabular-nums">
                      {lookupResult.submittedAt.slice(0, 10)}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Institutional Data Privacy & Authorised Admin Console Handoff */}
          <div className="bg-white rounded-[28px] border border-[#1B5A32]/15 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#144527] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#368737]" aria-hidden="true" />
                <span>
                  {lang === 'hi'
                    ? 'सुरक्षित डेटा एवं अधिकृत एडमिन कंसोल'
                    : 'Protected Registry & Admin Console'}
                </span>
              </h4>
            </div>
            <p className="text-xs text-[#44544A] leading-relaxed">
              {lang === 'hi'
                ? 'सभी 12 समर्पित पंजीकरण फॉर्मों का डेटा सुरक्षित रूप से संचित होता है। आवेदक की गोपनीयता के लिए पूर्ण सूची और CSV निर्यात केवल अधिकृत GOVEDA सुपर एडमिन व जिला समन्वयकों के लिए उपलब्ध है।'
                : 'Applications across all 12 dedicated forms are stored with strict privacy controls. Full submission records, district verification workflows, and CSV exports are restricted to authorised GOVEDA staff.'}
            </p>
            <SpringButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/admin')}
              className="w-full"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {lang === 'hi'
                  ? 'अधिकृत एडमिन पैनल खोलें'
                  : 'Open Authorised Admin Console'}
              </span>
            </SpringButton>
          </div>
        </div>
      </div>
    </div>
  );
}
