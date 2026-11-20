import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  Globe2,
  GraduationCap,
  HardHat,
  Laptop,
  ShieldAlert,
  Sprout,
} from 'lucide-react';
import { MissionAnchorNav } from '../components/MinimalistMissionPrimitives';
import { RegistrationPortal } from '../components/RegistrationForms';
import { OrganicEditorialHeading } from '../components/OrganicFarmingSections';
import { GENERATED_ASSETS } from '../data/assets';
import { MISSIONS_DATA } from '../data/missionsData';
import type { Language, RegistrationCategory, RegistrationRecord } from '../types/goveda';

interface SkillDevelopmentPageProps {
  lang: Language;
  records: RegistrationRecord[];
  onAddRecord: (record: RegistrationRecord) => void;
  onNavigate: (path: string) => void;
}

const ANCHOR_TABS = [
  { id: 'sd-why', hi: 'क्यों ज़रूरी', en: 'Why It Matters' },
  { id: 'sd-lab', hi: 'भाषा व डिजिटल लैब', en: 'Language & Digital' },
  { id: 'sd-trades', hi: 'हरित कौशल व सुरक्षा', en: 'Green Trades & Safety' },
  { id: 'sd-courses', hi: 'प्रस्तावित पाठ्यक्रम', en: 'Training Courses' },
  { id: 'sd-join', hi: 'प्रशिक्षण से जुड़ें', en: 'Register Now' },
  { id: 'sd-faqs', hi: 'सामान्य प्रश्न', en: 'FAQs' },
] as const;

const SKILL_FAQS = [
  {
    qHi: 'क्या जर्मन या अंग्रेजी भाषा प्रशिक्षण के बाद विदेश में नौकरी या वीज़ा की गारंटी मिलती है?',
    qEn: 'Does German or English language training guarantee overseas jobs or visas?',
    aHi: 'बिल्कुल नहीं। GOVEDA केवल ईमानदार भाषा शिक्षा, परीक्षा तैयारी और संवाद आत्मविश्वास को सुदृढ़ करती है। विदेश में रोजगार, वीज़ा अथवा विश्वविद्यालय प्रवेश की कोई गारंटी नहीं दी जाती।',
    aEn: 'No. GOVEDA provides structured language literacy, exam readiness, and career preparation only—we never guarantee overseas jobs, visas, or university admissions.',
  },
  {
    qHi: 'क्या ग्रामीण क्षेत्रों के विद्यार्थी और महिलाएँ निःशुल्क बैच में शामिल हो सकते हैं?',
    qEn: 'Are free community batches available for rural youth and women?',
    aHi: 'हाँ। अंग्रेजी संवाद, बेसिक कंप्यूटर व ग्रामीण हरित उद्यमिता के सामुदायिक बैच पात्र ग्रामीण युवाओं और महिला समूहों के लिए निःशुल्क या समुदाय-समर्थित मॉडल में प्रस्तावित हैं।',
    aEn: 'Yes. Foundational English communication, digital literacy, and rural green enterprise batches are planned on a free or community-supported model for eligible rural learners.',
  },
  {
    qHi: 'कार्यस्थल सुरक्षा, प्राथमिक उपचार और ड्राइवर प्रशिक्षण किनके लिए उपयोगी है?',
    qEn: 'Who benefits from Workplace Safety, First Aid, and Driver Orientation?',
    aHi: 'औद्योगिक श्रमिक, सोलर तकनीशियन, ग्रामीण वाहन चालक और फील्ड स्वयंसेवक सुरक्षित कार्य-प्रणाली, आपातकालीन प्राथमिक चिकित्सा और सड़क सुरक्षा अनुशासन सीख सकते हैं।',
    aEn: 'Industrial workers, solar technicians, commercial/rural drivers, and field volunteers learn practical workplace safety, emergency first aid, and defensive driving discipline.',
  },
];

export function SkillDevelopmentPage({
  lang,
  records,
  onAddRecord,
}: SkillDevelopmentPageProps) {
  const [activeTab, setActiveTab] = useState<string>('sd-why');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('skill-training');
  const [portalFocusKey, setPortalFocusKey] = useState(0);

  const skillMission = MISSIONS_DATA.find((m) => m.slug === 'skill-development');
  const courses = skillMission?.courses ?? [];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const ids = ANCHOR_TABS.map((t) => t.id);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveTab(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const openPortalWithRole = (cat: RegistrationCategory) => {
    setSelectedCategory(cat);
    setPortalFocusKey((k) => k + 1);
    document.getElementById('sd-portal-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FBFAF6] text-[#144721]">
      {/* 1. SEAMLESS EDITORIAL WATERCOLOR HERO (Matched to User Reference #4) */}
      <section className="relative bg-[#FBFAF6] overflow-hidden border-b border-[#E8E2D2]">
        <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
          <img
            src={GENERATED_ASSETS.skillsLanguageDigitalLab}
            alt={
              lang === 'hi'
                ? 'कौशल विकास एवं रोजगार — भाषा प्रयोगशाला, डिजिटल कौशल और करियर मार्गदर्शन'
                : 'Skill Development & Employment — Language Lab, Digital Skills and Mentorship'
            }
            className="w-full h-full object-cover object-right"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #FBFAF6 0%, #FBFAF6 40%, rgba(251,250,246,0.92) 48%, rgba(251,250,246,0.22) 60%, rgba(251,250,246,0) 72%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: 'linear-gradient(180deg, rgba(251,250,246,0) 0%, #FBFAF6 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-8 pb-4 lg:py-16 xl:py-20">
          <div className="max-w-xl lg:max-w-[560px]">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
              <span className="text-[10.5px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-[#1E3B25]">
                GOVEDA • SKILLS • OPPORTUNITY • LIVELIHOODS
              </span>
              <span className="h-[1.5px] w-7 sm:w-10 bg-[#C8922A]" aria-hidden="true" />
            </div>

            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold tracking-tight leading-[1.12] text-[2.25rem] sm:text-[3.15rem] lg:text-[3.8rem]">
                <span className="block text-[#114720]">कौशल विकास</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  एवं रोजगार
                </span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold tracking-tight leading-[1.08] text-[2.15rem] sm:text-[3rem] lg:text-[3.55rem]">
                <span className="block text-[#114720]">Skill Development</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#567F21] via-[#3A701E] to-[#23561F]">
                  &amp; Employment
                </span>
              </h1>
            )}

            <svg viewBox="0 0 360 22" className="w-60 sm:w-72 lg:w-80 h-4 mt-1.5 mb-3" aria-hidden="true">
              <defs>
                <linearGradient id="sdSwoosh" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D4A024" />
                  <stop offset="55%" stopColor="#8DB433" />
                  <stop offset="100%" stopColor="#2B6E29" />
                </linearGradient>
              </defs>
              <path d="M6,15 C110,4 235,20 352,8" fill="none" stroke="url(#sdSwoosh)" strokeWidth="4.2" strokeLinecap="round" />
            </svg>

            <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F4F1DF] via-[#EBF2DE] to-transparent">
              <p className="italic font-semibold text-[#1E5426] text-xs sm:text-sm lg:text-[15px]">
                {lang === 'hi'
                  ? 'कौशल • अवसर • सम्मानजनक आजीविका।'
                  : 'Skills • Opportunity • Dignified Livelihoods.'}
              </p>
            </div>

            <div className="border-l-[2.5px] border-[#C8922A] pl-4 mb-6 sm:mb-7 max-w-lg">
              <p className={`text-sm sm:text-base lg:text-[17px] text-[#243B2A] leading-relaxed font-medium ${lang === 'hi' ? 'font-hindi' : ''}`}>
                {lang === 'hi'
                  ? 'युवाओं और महिलाओं के लिए विदेशी व अंग्रेजी भाषा प्रशिक्षण, डिजिटल साक्षरता, ग्रामीण हरित उद्यमिता, कार्यस्थल सुरक्षा और आजीविका के व्यावहारिक अवसर।'
                  : 'Practical language training, digital literacy, rural green entrepreneurship, workplace safety, and honest career preparation for youth and women.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('sd-join')}
                className="inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0E3619] text-white px-6 py-3 text-sm font-bold shadow-[0_10px_24px_-10px_rgba(21,74,36,0.55)] transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'प्रशिक्षण से जुड़ें' : 'Join Training'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('sd-courses')}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-[#144721] border border-[#1E5629]/45 px-5 py-3 text-sm font-bold transition-all cursor-pointer"
              >
                <span>{lang === 'hi' ? 'अवसर जानें' : 'Explore Courses'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hero Artwork */}
        <div className="lg:hidden relative w-full mt-2 overflow-hidden">
          <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src={GENERATED_ASSETS.skillsLanguageDigitalLab}
              alt={lang === 'hi' ? 'कौशल विकास एवं रोजगार' : 'Skill Development & Employment'}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-x-0 top-0 h-14 pointer-events-none" style={{ background: 'linear-gradient(180deg, #FBFAF6 0%, rgba(251,250,246,0) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none" style={{ background: 'linear-gradient(0deg, #FBFAF6 0%, rgba(251,250,246,0) 100%)' }} />
          </div>
        </div>
      </section>

      <MissionAnchorNav
        tabs={ANCHOR_TABS}
        activeTab={activeTab}
        lang={lang}
        onSelect={scrollToSection}
        ariaLabel={lang === 'hi' ? 'कौशल विकास अनुभाग' : 'Skill development sections'}
      />

      {/* 2. FOUR SKILL TRACKS */}
      <section id="sd-why" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '01 · चार व्यावहारिक प्रशिक्षण क्षेत्र' : '01 · FOUR PRACTICAL SKILL PILLARS'}
            titleHi="शिक्षा और वास्तविक कार्य-दक्षता के बीच सेतु"
            titleEn="Bridging Classroom Learning With Real-World Readiness"
            lang={lang}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Globe2, hiT: 'जर्मन व अंग्रेजी भाषा', enT: 'German & English Fluency', hiD: 'A1–A2 जर्मन फाउंडेशन, दैनिक अंग्रेजी संवाद और साक्षात्कार आत्मविश्वास।', enD: 'Structured German A1–A2 foundation, spoken English, and mock interview practice.' },
              { icon: Laptop, hiT: 'कंप्यूटर व डिजिटल साक्षरता', enT: 'Computer & E-Governance', hiD: 'स्प्रेडशीट, दस्तावेज़ निर्माण, सुरक्षित डिजिटल बैंकिंग व ऑनलाइन पोर्टल उपयोग।', enD: 'Office tools, spreadsheets, cyber safety, and digital citizen services.' },
              { icon: Sprout, hiT: 'ग्रामीण हरित उद्यमिता', enT: 'Rural Green Enterprise', hiD: 'पौध नर्सरी, वर्मीकम्पोस्ट, सोलर रखरखाव और महिला सिलाई-पैकेजिंग व्यवसाय।', enD: 'Sapling nurseries, vermicompost hubs, solar upkeep, and SHG micro-enterprises.' },
              { icon: HardHat, hiT: 'कार्यस्थल सुरक्षा व प्राथमिक उपचार', enT: 'Workplace Safety & First Aid', hiD: 'औद्योगिक सुरक्षा मानक, आपातकालीन फर्स्ट-एड और सुरक्षित ड्राइवर प्रशिक्षण।', enD: 'Occupational safety discipline, emergency first-aid response, and driver training.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.enT} className="rounded-2xl bg-[#FBFAF6] border border-[#E5DEC8] p-5 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4E6] text-[#154A24] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#114720]">{lang === 'hi' ? item.hiT : item.enT}</h3>
                  <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">{lang === 'hi' ? item.hiD : item.enD}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VISUAL EXPLAINER 1: LANGUAGE & DIGITAL STUDIO */}
      <section id="sd-lab" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '02 · जिला शिक्षण केंद्र परिकल्पना' : '02 · DISTRICT LEARNING HUB'}
            titleHi="भाषा संवाद, डिजिटल कौशल और करियर परामर्श एक साथ"
            titleEn="Language Practice, Digital Fluency & Honest Career Mentoring"
            lang={lang}
          />
          <img
            src={GENERATED_ASSETS.skillsLanguageDigitalLab}
            alt={lang === 'hi' ? 'भाषा व डिजिटल प्रशिक्षण केंद्र' : 'Language and digital training studio'}
            className="w-full h-auto mix-blend-multiply"
          />
        </div>
      </section>

      {/* 4. VISUAL EXPLAINER 2: GREEN TRADES, SOLAR & WORKPLACE SAFETY */}
      <section id="sd-trades" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '03 · व्यावहारिक क्षेत्र कौशल' : '03 · HANDS-ON GREEN TRADES & SAFETY'}
            titleHi="सौर ऊर्जा रखरखाव, हरित नर्सरी और कार्यस्थल सुरक्षा"
            titleEn="Solar Maintenance, Green Nurseries & First-Aid Safety"
            lang={lang}
          />
          <img
            src={GENERATED_ASSETS.skillsGreenTradesSafety}
            alt={lang === 'hi' ? 'हरित कौशल, सोलर और सुरक्षा प्रशिक्षण' : 'Green trades, solar and workplace safety illustration'}
            className="w-full h-auto mix-blend-multiply"
          />
        </div>
      </section>

      {/* 5. STRUCTURED COURSES CATALOG + TRANSPARENCY NOTICE */}
      <section id="sd-courses" className="py-12 sm:py-16 bg-[#FBFAF6] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '04 · प्रस्तावित प्रशिक्षण पाठ्यक्रम' : '04 · PROPOSED TRAINING CURRICULA'}
            titleHi="युवाओं एवं महिलाओं के लिए प्रमुख पाठ्यक्रम"
            titleEn="Core Foundational Courses & Community Batches"
            lang={lang}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((c) => (
              <div key={c.name.en} className="rounded-2xl bg-white border border-[#DFD8C5] p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF4E6] text-[#154A24]">
                    {c.duration[lang]}
                  </span>
                  <span className="text-[11px] font-bold text-[#8E6212]">{c.feeStatus[lang]}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#114720]">{c.name[lang]}</h3>
                <p className="text-xs sm:text-sm text-[#395040] leading-relaxed">{c.description[lang]}</p>
                <div className="pt-2 border-t border-[#EDF2EC] grid grid-cols-2 gap-2 text-[11px] text-[#4C5F52]">
                  <div>
                    <strong className="text-[#144721]">{lang === 'hi' ? 'पात्रता:' : 'Eligibility:'}</strong> {c.eligibility[lang]}
                  </div>
                  <div>
                    <strong className="text-[#144721]">{lang === 'hi' ? 'माध्यम:' : 'Mode:'}</strong> {c.mode[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#FAF6E8] border border-[#E5D3A3] p-5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#8E6212] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#4A3B14] leading-relaxed">
              {lang === 'hi'
                ? 'पारदर्शिता सूचना: कौशल एवं भाषा प्रशिक्षण केवल योग्यता और परीक्षा तैयारी को सुदृढ़ करने के लिए है; विदेश में नौकरी, वीज़ा अथवा विश्वविद्यालय प्रवेश की कोई गारंटी नहीं दी जाती है।'
                : 'Transparency Disclosure: Language and vocational courses strengthen skills and exam readiness only. GOVEDA does not guarantee overseas employment, visas, or university admissions.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. JOIN & PORTAL */}
      <section id="sd-join" className="py-12 sm:py-16 bg-white border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-8">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '05 · प्रशिक्षण पंजीकरण' : '05 · REGISTER FOR TRAINING'}
            titleHi="आगामी कौशल बैच में अपनी रुचि दर्ज करें"
            titleEn="Register Interest as Learner, Trainer or CSR Sponsor"
            lang={lang}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { cat: 'skill-training' as RegistrationCategory, icon: GraduationCap, hi: 'युवा व कौशल प्रशिक्षण पंजीकरण', en: 'Youth & Skill Learner Form' },
              { cat: 'expert-trainer' as RegistrationCategory, icon: BookOpen, hi: 'भाषा / आईटी / सुरक्षा प्रशिक्षक', en: 'Join as Faculty / Trainer' },
              { cat: 'csr-partner' as RegistrationCategory, icon: Briefcase, hi: 'CSR कौशल छात्रवृत्ति सहयोग', en: 'CSR Skill Scholarship Partner' },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.cat}
                  type="button"
                  onClick={() => openPortalWithRole(p.cat)}
                  className="text-left rounded-2xl bg-[#FBFAF6] border border-[#DFD8C5] hover:border-[#368737] p-5 flex items-center justify-between gap-3 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF4E6] text-[#154A24] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-[#114720]">{lang === 'hi' ? p.hi : p.en}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#368737] shrink-0" />
                </button>
              );
            })}
          </div>
          <div id="sd-portal-form" key={portalFocusKey}>
            <RegistrationPortal
              lang={lang}
              initialCategory={selectedCategory}
              allowedCategories={['skill-training', 'expert-trainer', 'csr-partner', 'women-shg']}
              records={records}
              onAddRecord={onAddRecord}
            />
          </div>
        </div>
      </section>

      {/* 7. FAQS */}
      <section id="sd-faqs" className="py-12 sm:py-16 bg-[#FBFAF6]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-6">
          <OrganicEditorialHeading
            eyebrow={lang === 'hi' ? '06 · सामान्य प्रश्न' : '06 · FREQUENTLY ASKED QUESTIONS'}
            titleHi="कौशल विकास और प्रशिक्षण से जुड़े प्रश्न"
            titleEn="Common Questions on Skill Development"
            lang={lang}
          />
          <div className="space-y-3">
            {SKILL_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.qEn} className="rounded-2xl border border-[#E5DEC8] bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#114720] cursor-pointer"
                  >
                    <span>{lang === 'hi' ? faq.qHi : faq.qEn}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[#395040] leading-relaxed border-t border-[#E8E2D2] pt-3">
                      {lang === 'hi' ? faq.aHi : faq.aEn}
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
