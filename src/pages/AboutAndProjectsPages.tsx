import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowRight,
  MapPin,
  Calendar,
  Download,
  Building2,
  GitBranch,
  Users,
  Globe,
  Linkedin,
  UserRound,
} from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import {
  ScenicPageHeader,
  SeamlessPhotoCanvas,
  ScenicHorizonStrip,
} from '../components/ScenicElements';
import { ABOUT_SECTIONS, PROJECTS_DATA } from '../data/siteContent';
import { usePublicPortal } from '../context/PublicPortalContext';
import {
  buildProgrammeHierarchyTree,
  filterUnifiedProgrammes,
} from '../utils/adminLogic';
import type { Language } from '../types/goveda';

interface AboutPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function AboutPage({ lang, onNavigate }: AboutPageProps) {
  const { bootstrap } = usePublicPortal();
  const gov = bootstrap?.siteGovernance ?? null;
  const founderMessage = bootstrap?.founderMessage ?? null;

  // Allow Admin Pages & Navigation to override "Who We Are" copy if an about-us/who-we-are page is published
  const cmsAboutOverride = (bootstrap?.staticPages ?? []).find(
    (p) =>
      p.status === 'Published' &&
      (p.slug === 'about-us' || p.slug === 'who-we-are' || p.slug === 'about-goveda')
  );

  const legalRows = [
    {
      label: lang === 'hi' ? 'संस्था स्वरूप (Legal Structure)' : 'Legal Structure',
      value: 'Section 8 Non-Profit Company (India)',
    },
    {
      label: lang === 'hi' ? 'CIN / पंजीकरण संख्या' : 'CIN / Registration No.',
      value:
        gov?.cinNumber?.trim() ||
        (lang === 'hi'
          ? 'औपचारिक पोर्टल समन्वय पर प्रकाशित'
          : 'Published upon official portal sync'),
    },
    {
      label: 'PAN / TAN',
      value:
        gov?.panNumber?.trim() ||
        (lang === 'hi'
          ? 'CSR जांच हेतु सत्यापित वैधानिक अभिलेख उपलब्ध'
          : 'Verified statutory records available for CSR due diligence'),
    },
    {
      label: 'NGO Darpan / MSME',
      value:
        [gov?.darpanId?.trim(), gov?.msmeNumber?.trim()].filter(Boolean).join(' · ') ||
        (lang === 'hi'
          ? 'वैध सक्रिय अनुमोदनों के अनुसार प्रकाशित'
          : 'Displayed strictly per valid active approvals'),
    },
    {
      label: lang === 'hi' ? '80G एवं FCRA स्थिति' : '80G & FCRA Status',
      value: gov
        ? `80G: ${
            gov.eightyGApproved
              ? lang === 'hi'
                ? 'स्वीकृत / सक्रिय'
                : 'Approved & Active'
              : lang === 'hi'
              ? 'प्रक्रियाधीन / औपचारिक पुष्टि उपरांत'
              : 'Pending / Per Formal Approval'
          } · FCRA: ${
            gov.fcraApproved
              ? lang === 'hi'
                ? 'स्वीकृत / सक्रिय'
                : 'Approved & Active'
              : lang === 'hi'
              ? 'प्रक्रियाधीन / औपचारिक पुष्टि उपरांत'
              : 'Pending / Per Formal Approval'
          }`
        : lang === 'hi'
        ? 'केवल सक्रिय वैधानिक स्वीकृति के अनुसार प्रदर्शित'
        : 'Displayed strictly per valid active approvals',
    },
  ];

  // Strictly published & consented profiles from Admin Board, Team & Advisory
  const confirmedRoster = (gov?.leadershipRoster ?? []).filter(
    (m) =>
      m.confirmedForPublic === true &&
      (!m.publicationStatus || m.publicationStatus === 'Published') &&
      m.name?.trim()
  );

  const founderProfile =
    confirmedRoster.find((m) => m.category === 'Founder & President') ?? null;

  const vicePresidentProfile =
    confirmedRoster.find(
      (m) =>
        m.id !== founderProfile?.id &&
        (m.roleEn.toLowerCase().includes('vice president') ||
          m.category === 'Office Bearers')
    ) ?? null;

  const advisoryBoard = confirmedRoster.filter((m) =>
    String(m.category || '').toLowerCase().includes('advis')
  );

  const additionalBoardAndTeam = confirmedRoster.filter(
    (m) =>
      m.id !== founderProfile?.id &&
      m.id !== vicePresidentProfile?.id &&
      !String(m.category || '').toLowerCase().includes('advis')
  );

  const publishedReports = (gov?.annualReports ?? []).filter(
    (r) => r.isPublished !== false && r.pdfUrl?.trim()
  );

  return (
    <div className="bg-[#FBF9F5] text-[#1C1917]">
      {/* =====================================================================
          SECTION 1: INSTITUTIONAL HERO BANNER — ABOUT US
         ===================================================================== */}
      <section className="relative border-b border-[#E5E0D5] bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#14532D]">
              GOVEDA Carbon &amp; Climate India Foundation · {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
            </p>
            <div className="space-y-2">
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-[#143D21] leading-[1.12] text-balance">
                {lang === 'hi' ? 'हरित राजस्थान से हरित भारत' : 'हरित राजस्थान से हरित भारत'}
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#2E6F36]">
                Green Rajasthan to Green India
              </p>
            </div>
            <p className="text-sm sm:text-base text-[#3D4740] leading-[1.75] max-w-[60ch]">
              {lang === 'hi'
                ? 'पर्यावरण संरक्षण, ग्रामीण विकास और जन-सहभागिता के माध्यम से एक सतत, हरित और आत्मनिर्भर भविष्य का निर्माण।'
                : 'Building a sustainable future through environmental protection, rural development, and community participation.'}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <SpringButton variant="primary" size="sm" onClick={() => onNavigate('/missions')}>
                <span>{lang === 'hi' ? 'हमारे 10 मिशन देखें' : 'Explore Our 10 Missions'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </SpringButton>
              <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/harit-rajasthan')}>
                <span>{lang === 'hi' ? 'हरित राजस्थान मंच' : 'Harit Rajasthan Platform'}</span>
              </SpringButton>
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure className="h-full min-h-[260px] lg:min-h-[340px] rounded-2xl overflow-hidden border border-[#E5E0D5] bg-[#EFECE4] relative">
              <img
                src="/assets/hero-harit-clean.jpg"
                alt="Green farms, rural village, and Aravalli landscape in Rajasthan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 py-4 text-xs text-white/95">
                {lang === 'hi'
                  ? 'राजस्थान के ग्रामीण समुदाय, खेतों और अरावली परिदृश्य से हरित भारत की यात्रा'
                  : 'Rooted in Rajasthan’s rural communities, farms, and Aravalli landscape'}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* =====================================================================
            SECTION 2: WHO WE ARE, OUR VISION & CORE OBJECTIVES
           ===================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
              01 · {lang === 'hi' ? 'हम कौन हैं' : 'Who We Are'}
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#143D21] text-balance">
              {cmsAboutOverride
                ? lang === 'hi'
                  ? cmsAboutOverride.titleHi || cmsAboutOverride.titleEn
                  : cmsAboutOverride.titleEn
                : lang === 'hi'
                ? 'जन-सहभागिता पर आधारित Section 8 गैर-लाभकारी संस्था'
                : 'A Section 8 Non-Profit Built on Community Participation'}
            </h2>
            <div className="space-y-4 text-sm sm:text-[15.5px] text-[#3A443D] leading-[1.8] max-w-[65ch]">
              {cmsAboutOverride && (cmsAboutOverride.bodyEn || cmsAboutOverride.bodyHi) ? (
                <p>
                  {lang === 'hi'
                    ? cmsAboutOverride.bodyHi || cmsAboutOverride.bodyEn
                    : cmsAboutOverride.bodyEn}
                </p>
              ) : (
                <>
                  <p>
                    {lang === 'hi'
                      ? 'GOVEDA Carbon & Climate India Foundation एक पंजीकृत Section 8 गैर-लाभकारी संस्था है, जो पर्यावरण संरक्षण, ग्रामीण विकास, आत्मनिर्भर गौशाला, जल व ऊर्जा सुरक्षा और सामाजिक कल्याण के लिए कार्यरत है।'
                      : 'GOVEDA Carbon & Climate India Foundation is a Section 8 non-profit organisation focused on environmental sustainability, rural development, community participation, and social well-being.'}
                  </p>
                  <p>
                    {lang === 'hi'
                      ? 'हमारा दृष्टिकोण किसानों, शिक्षण संस्थानों, गौशालाओं, ग्राम पंचायतों और नागरिकों को एक साथ जोड़कर एक हरित और सतत भविष्य का निर्माण करना है।'
                      : 'Our approach brings together people, farmers, Gaushalas, institutions, and local communities to work towards a greener and more resilient future.'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Editorial Vision Block — Hairline top & bottom rules, zero thick left border */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-8 space-y-5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
              {lang === 'hi' ? 'हमारा दृष्टिकोण · Our Vision' : 'Our Vision'}
            </p>
            <blockquote className="py-4 border-y border-[#E5E0D5] space-y-3">
              <p className="font-hindi text-lg sm:text-xl font-bold text-[#143D21] leading-relaxed">
                &ldquo;हर गौशाला आत्मनिर्भर बने, हर गाँव हरित बने, हर किसान समृद्ध बने और हर वृद्धजन को सम्मानपूर्ण जीवन मिले।&rdquo;
              </p>
              <p className="text-sm text-[#49564C] italic leading-relaxed">
                Every gaushala self-reliant, every village greener, every farmer empowered, and every senior citizen treated with dignity.
              </p>
            </blockquote>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#143D21]">
                {lang === 'hi' ? 'मुख्य उद्देश्य' : 'Core Institutional Objectives'}
              </p>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#3F4B43]">
                {ABOUT_SECTIONS.objectives.slice(0, 4).map((obj) => (
                  <li key={obj.en} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E6F36] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{obj[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: OUR LEADERSHIP — FOUNDER & PRESIDENT + VICE PRESIDENT + FOUNDER MESSAGE
           ===================================================================== */}
        <section className="space-y-8 pt-6 border-t border-[#E5E0D5]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
                02 · {lang === 'hi' ? 'संस्था नेतृत्व' : 'Our Leadership'}
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#143D21]">
                {lang === 'hi' ? 'फाउंडेशन का नेतृत्व' : 'Meet the People Leading the Foundation'}
              </h2>
            </div>
            <p className="text-xs text-[#5B685E]">
              {lang === 'hi'
                ? 'वर्तमान अधिकृत पदाधिकारियों के सत्यापित प्रोफाइल'
                : 'Published strictly per current appointed leadership & approval'}
            </p>
          </div>

          {/* Primary 2-Person Leadership Grid: Founder & President (1 unified profile) + Vice President */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile 1: Founder & President (Single Combined Profile) */}
            <article className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-6">
              {founderProfile?.photoUrl ? (
                <img
                  src={founderProfile.photoUrl}
                  alt={founderProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl object-cover border border-[#E5E0D5] shrink-0"
                />
              ) : (
                <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl bg-[#F2F5F0] border border-[#DCE5DE] flex flex-col items-center justify-center text-center p-3 shrink-0">
                  <UserRound className="w-8 h-8 text-[#5F7665] mb-1.5" />
                  <span className="text-[10.5px] font-semibold text-[#4D6353] leading-snug">
                    {lang === 'hi' ? 'आधिकारिक फोटो अद्यतन हेतु' : 'Official portrait awaiting upload'}
                  </span>
                </div>
              )}

              <div className="space-y-2.5 min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#2E6F36]">
                  {lang === 'hi'
                    ? founderProfile?.roleHi || 'संस्थापक एवं अध्यक्ष'
                    : founderProfile?.roleEn || 'Founder & President'}
                </p>
                <h3 className="font-editorial text-xl font-bold text-[#143D21]">
                  {founderProfile?.name || 'Raj Kumar Poonia'}
                </h3>
                {founderProfile?.qualification && (
                  <p className="text-xs text-[#5A675D]">
                    {founderProfile.qualification}
                  </p>
                )}
                <p className="text-sm text-[#3A443D] leading-relaxed">
                  {founderProfile
                    ? lang === 'hi'
                      ? founderProfile.bioHi || founderProfile.bioEn
                      : founderProfile.bioEn || founderProfile.bioHi
                    : lang === 'hi'
                    ? 'GOVEDA कार्बन एवं क्लाइमेट इंडिया फाउंडेशन के संस्थापक एवं अध्यक्ष।'
                    : 'Founder & President of GOVEDA Carbon & Climate India Foundation, guiding its climate, agroforestry, Gaushala, and rural community initiatives.'}
                </p>
                {(founderProfile?.responsibilitiesEn || founderProfile?.responsibilitiesHi) && (
                  <p className="text-xs text-[#546257] leading-relaxed pt-1 border-t border-[#F0ECE2]">
                    <span className="font-semibold text-[#143D21]">
                      {lang === 'hi' ? 'प्रमुख दायित्व: ' : 'Focus & Stewardship: '}
                    </span>
                    {lang === 'hi'
                      ? founderProfile.responsibilitiesHi || founderProfile.responsibilitiesEn
                      : founderProfile.responsibilitiesEn || founderProfile.responsibilitiesHi}
                  </p>
                )}
                {(founderProfile?.linkedinUrl || founderProfile?.websiteUrl) && (
                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-[#144527]">
                    {founderProfile.linkedinUrl && (
                      <a
                        href={founderProfile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {founderProfile.websiteUrl && (
                      <a
                        href={founderProfile.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>

            {/* Profile 2: Vice President (Live when published in Office Bearers; honest pending state while Draft) */}
            {vicePresidentProfile ? (
              <article className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-6">
                {vicePresidentProfile.photoUrl ? (
                  <img
                    src={vicePresidentProfile.photoUrl}
                    alt={vicePresidentProfile.name}
                    referrerPolicy="no-referrer"
                    className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl object-cover border border-[#E5E0D5] shrink-0"
                  />
                ) : (
                  <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl bg-[#F2F5F0] border border-[#DCE5DE] flex flex-col items-center justify-center text-center p-3 shrink-0">
                    <UserRound className="w-8 h-8 text-[#5F7665] mb-1.5" />
                    <span className="text-[10.5px] font-semibold text-[#4D6353] leading-snug">
                      {lang === 'hi' ? 'आधिकारिक फोटो अद्यतन हेतु' : 'Official portrait awaiting upload'}
                    </span>
                  </div>
                )}
                <div className="space-y-2.5 min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#2E6F36]">
                    {lang === 'hi'
                      ? vicePresidentProfile.roleHi || 'उपाध्यक्ष'
                      : vicePresidentProfile.roleEn || 'Vice President'}
                  </p>
                  <h3 className="font-editorial text-xl font-bold text-[#143D21]">
                    {vicePresidentProfile.name}
                  </h3>
                  {vicePresidentProfile.qualification && (
                    <p className="text-xs text-[#5A675D]">
                      {vicePresidentProfile.qualification}
                    </p>
                  )}
                  <p className="text-sm text-[#3A443D] leading-relaxed">
                    {lang === 'hi'
                      ? vicePresidentProfile.bioHi || vicePresidentProfile.bioEn
                      : vicePresidentProfile.bioEn || vicePresidentProfile.bioHi}
                  </p>
                  {(vicePresidentProfile.responsibilitiesEn ||
                    vicePresidentProfile.responsibilitiesHi) && (
                    <p className="text-xs text-[#546257] leading-relaxed pt-1 border-t border-[#F0ECE2]">
                      <span className="font-semibold text-[#143D21]">
                        {lang === 'hi' ? 'प्रमुख दायित्व: ' : 'Responsibilities: '}
                      </span>
                      {lang === 'hi'
                        ? vicePresidentProfile.responsibilitiesHi ||
                          vicePresidentProfile.responsibilitiesEn
                        : vicePresidentProfile.responsibilitiesEn ||
                          vicePresidentProfile.responsibilitiesHi}
                    </p>
                  )}
                  {(vicePresidentProfile.linkedinUrl || vicePresidentProfile.websiteUrl) && (
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-[#144527]">
                      {vicePresidentProfile.linkedinUrl && (
                        <a
                          href={vicePresidentProfile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {vicePresidentProfile.websiteUrl && (
                        <a
                          href={vicePresidentProfile.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ) : (
              <article className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-6">
                <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl bg-[#F5F3EC] border border-[#E5E0D5] flex flex-col items-center justify-center text-center p-3 shrink-0">
                  <UserRound className="w-8 h-8 text-[#7C867E] mb-1.5" />
                  <span className="text-[10.5px] font-semibold text-[#647067] leading-snug">
                    {lang === 'hi' ? 'फोटो व सहमति प्रतीक्षारत' : 'Portrait pending approval'}
                  </span>
                </div>
                <div className="space-y-2.5 flex-1">
                  <p className="text-xs font-semibold text-[#2E6F36]">
                    {lang === 'hi' ? 'उपाध्यक्ष · Office Bearer' : 'Vice President · Office Bearer'}
                  </p>
                  <h3 className="font-editorial text-xl font-bold text-[#143D21]">
                    {lang === 'hi' ? 'उपाध्यक्ष (Vice President)' : 'Vice President'}
                  </h3>
                  <p className="text-sm text-[#4A574E] leading-relaxed">
                    {lang === 'hi'
                      ? 'उपाध्यक्ष का स्वीकृत नाम, परिचय, दायित्व और आधिकारिक छायाचित्र औपचारिक प्रकाशन सहमति के उपरांत एडमिन पैनल (Office Bearers) से यहाँ स्वतः प्रकाशित होगा।'
                      : 'The Vice President’s approved name, biography, responsibilities, and photograph will appear here automatically once published with consent from Board, Team & Advisory.'}
                  </p>
                </div>
              </article>
            )}
          </div>

          {/* Dedicated Founder Message Block — Controlled Live by Founder Message Manager */}
          {founderMessage?.showOnAboutUs !== false && (
            <div className="bg-white rounded-2xl border border-[#E5E0D5] px-6 sm:px-10 py-8 sm:py-10">
              <div className="max-w-3xl mx-auto space-y-5 text-center">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#2E6F36]">
                  {lang === 'hi'
                    ? founderMessage?.headingHi || 'संस्थापक का संदेश'
                    : founderMessage?.headingEn || 'A Message from Our Founder'}
                </p>
                <blockquote className="font-editorial text-lg sm:text-2xl text-[#143D21] leading-relaxed italic">
                  &ldquo;
                  {lang === 'hi'
                    ? founderMessage?.messageHi ||
                      founderProfile?.founderMessageHi ||
                      ABOUT_SECTIONS.founderMessage.quote.hi
                    : founderMessage?.messageEn ||
                      founderProfile?.founderMessageEn ||
                      ABOUT_SECTIONS.founderMessage.quote.en}
                  &rdquo;
                </blockquote>
                <div className="pt-3 border-t border-[#EDE9DF] flex flex-col items-center gap-2">
                  {founderMessage?.signatureImageUrl && (
                    <img
                      src={founderMessage.signatureImageUrl}
                      alt="Founder signature"
                      className="h-12 max-w-[200px] object-contain"
                    />
                  )}
                  <p className="text-sm font-bold text-[#143D21]">
                    {lang === 'hi'
                      ? founderMessage?.attributionHi || 'राज कुमार पूनिया – संस्थापक एवं अध्यक्ष'
                      : founderMessage?.attributionEn || 'Raj Kumar Poonia – Founder & President'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Additional Board & Leadership — ONLY rendered if additional appointed members exist */}
          {additionalBoardAndTeam.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold tracking-[0.12em] uppercase text-[#2E6F36]">
                {lang === 'hi'
                  ? 'निदेशक मंडल एवं अतिरिक्त नेतृत्व'
                  : 'Board of Directors & Leadership Team'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {additionalBoardAndTeam.map((member) => (
                  <article
                    key={member.id}
                    className="bg-white rounded-2xl border border-[#E5E0D5] p-5 flex items-start gap-4"
                  >
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5E0D5] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#F2F5F0] text-[#143D21] font-bold flex items-center justify-center shrink-0">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <p className="text-[11px] font-semibold text-[#2E6F36]">
                        {member.category}
                        {member.assignedDistrict ? ` · ${member.assignedDistrict}` : ''}
                      </p>
                      <h4 className="text-sm font-bold text-[#143D21]">{member.name}</h4>
                      <p className="text-xs font-medium text-[#4D5D52]">
                        {lang === 'hi' ? member.roleHi || member.roleEn : member.roleEn}
                      </p>
                      {(member.bioEn || member.bioHi) && (
                        <p className="text-xs text-[#556358] leading-relaxed">
                          {lang === 'hi' ? member.bioHi || member.bioEn : member.bioEn}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* =====================================================================
            SECTION 4: ADVISORY BOARD (ZERO EMPTY CARDS — HONEST NOTICE UNTIL APPOINTED)
           ===================================================================== */}
        <section className="space-y-6 pt-6 border-t border-[#E5E0D5]">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
              03 · {lang === 'hi' ? 'सलाहकार मंडल' : 'Advisory Board'}
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#143D21]">
              {lang === 'hi' ? 'विशेषज्ञ सलाहकार मंडल' : 'Advisory Board'}
            </h2>
          </div>

          {advisoryBoard.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {advisoryBoard.map((advisor) => (
                <article
                  key={advisor.id}
                  className="bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-3"
                >
                  <div className="flex items-start gap-4">
                    {advisor.photoUrl ? (
                      <img
                        src={advisor.photoUrl}
                        alt={advisor.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5E0D5] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#F2F5F0] text-[#143D21] font-bold flex items-center justify-center shrink-0">
                        {advisor.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 space-y-0.5">
                      {advisor.advisoryDomain && (
                        <p className="text-[11px] font-semibold text-[#2E6F36]">
                          {advisor.advisoryDomain}
                        </p>
                      )}
                      <h3 className="text-base font-bold text-[#143D21]">{advisor.name}</h3>
                      <p className="text-xs font-medium text-[#4D5D52]">
                        {lang === 'hi' ? advisor.roleHi || advisor.roleEn : advisor.roleEn}
                      </p>
                    </div>
                  </div>
                  {(advisor.qualification || advisor.experience) && (
                    <p className="text-xs text-[#556358]">
                      {[advisor.qualification, advisor.experience].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {(advisor.bioEn || advisor.bioHi) && (
                    <p className="text-xs text-[#3A443D] leading-relaxed">
                      {lang === 'hi' ? advisor.bioHi || advisor.bioEn : advisor.bioEn}
                    </p>
                  )}
                  {(advisor.linkedinUrl || advisor.websiteUrl) && (
                    <div className="flex items-center gap-4 pt-2 border-t border-[#F0ECE2] text-xs font-semibold text-[#144527]">
                      {advisor.linkedinUrl && (
                        <a
                          href={advisor.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {advisor.websiteUrl && (
                        <a
                          href={advisor.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <h3 className="text-base font-bold text-[#143D21]">
                  {lang === 'hi'
                    ? 'सलाहकार मंडल के प्रोफाइल यहाँ प्रकाशित किए जाएंगे'
                    : 'Advisory Board profiles will be published here'}
                </h3>
                <p className="text-sm text-[#4A574E] leading-relaxed">
                  {lang === 'hi'
                    ? 'कृषि, जलवायु, गौशाला प्रबंधन, स्वच्छ ऊर्जा, जल संरक्षण, शिक्षा और प्रशासन से जुड़े विशेषज्ञों की औपचारिक नियुक्ति एवं प्रकाशन सहमति की पुष्टि होने के बाद ही उनके प्रोफाइल प्रदर्शित किए जाएंगे।'
                    : 'Expert profiles will appear here once formal appointments and publication consent are confirmed across GOVEDA’s ten advisory domains.'}
                </p>
              </div>
              <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/join/expert-trainer')}>
                <span>{lang === 'hi' ? 'विशेषज्ञ पैनल संपर्क' : 'Expert Panel Inquiry'}</span>
              </SpringButton>
            </div>
          )}
        </section>

        {/* =====================================================================
            SECTION 5: LEGAL & TRANSPARENCY + ANNUAL REPORTS (NEWLY INCORPORATED NOTICE)
           ===================================================================== */}
        <section id="annual-reports" className="space-y-8 pt-6 border-t border-[#E5E0D5]">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
              04 · {lang === 'hi' ? 'वैधानिक पंजीकरण एवं पारदर्शिता' : 'Legal & Transparency'}
            </p>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#143D21]">
              {lang === 'hi'
                ? 'वैधानिक अभिलेख, सुशासन एवं वार्षिक रिपोर्ट'
                : 'Section 8 Registration, Governance & Annual Reports'}
            </h2>
            <p className="text-sm text-[#4A574E] max-w-2xl">
              {lang === 'hi'
                ? 'यहाँ केवल सत्यापित एवं स्वीकृत वैधानिक दस्तावेज़ और रिपोर्ट ही प्रकाशित की जाती हैं।'
                : 'Only verified and approved statutory documents, compliance disclosures, and audited reports are published here.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Statutory Compliance Table */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#143D21]">
                <ShieldCheck className="w-5 h-5 text-[#2E6F36]" />
                <h3 className="text-base font-bold">
                  {lang === 'hi'
                    ? 'Section 8 पंजीकरण एवं अनुपालन विवरण'
                    : 'Section 8 Registration & Legal Compliance'}
                </h3>
              </div>
              <dl className="divide-y divide-[#EEEAE0] text-xs sm:text-sm">
                {legalRows.map((slot) => (
                  <div key={slot.label} className="py-3 flex justify-between gap-4">
                    <dt className="font-semibold text-[#143D21]">{slot.label}</dt>
                    <dd className="text-[#4A574E] text-right font-mono text-xs sm:text-[13px]">
                      {slot.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="pt-2 flex flex-wrap gap-2.5">
                <SpringButton variant="primary" size="sm" onClick={() => onNavigate('/partnership')}>
                  <span>{lang === 'hi' ? 'CSR एवं सहयोग' : 'CSR & Partnership'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </SpringButton>
                <SpringButton variant="outline" size="sm" onClick={() => onNavigate('/contact')}>
                  <span>{lang === 'hi' ? 'कार्यालय संपर्क' : 'Contact Office'}</span>
                </SpringButton>
              </div>
            </div>

            {/* Annual Reports & Governance Documents */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-[#143D21]">
                <FileText className="w-5 h-5 text-[#2E6F36]" />
                <h3 className="text-base font-bold">
                  {lang === 'hi'
                    ? 'वार्षिक रिपोर्ट एवं पारदर्शिता अभिलेख'
                    : 'Annual Reports & Transparency'}
                </h3>
              </div>

              {publishedReports.length === 0 ? (
                <div className="rounded-xl bg-[#FAF8F3] border border-[#E8E3D7] p-5 space-y-2.5">
                  <p className="text-sm font-bold text-[#143D21]">
                    {lang === 'hi'
                      ? 'प्रथम वार्षिक रिपोर्ट अभी प्रकाशित नहीं हुई है'
                      : 'First Annual Report Not Yet Available'}
                  </p>
                  <p className="text-xs sm:text-sm text-[#4A574E] leading-relaxed">
                    {lang === 'hi'
                      ? 'GOVEDA Carbon & Climate India Foundation नव-पंजीकृत Section 8 संस्था है। प्रथम वित्तीय वर्ष एवं वैधानिक अंकेक्षण पूर्ण होने के उपरांत पहली वार्षिक रिपोर्ट और अनुपालन PDF यहाँ सार्वजनिक डाउनलोड के लिए प्रकाशित की जाएगी।'
                      : 'GOVEDA Carbon & Climate India Foundation is a newly incorporated Section 8 organisation. Our first audited Annual Report and statutory compliance filings will be published here for open download upon completion of the inaugural financial year.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {publishedReports.map((rep) => (
                    <div
                      key={rep.id}
                      className="rounded-xl border border-[#E5E0D5] p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-semibold text-[#2E6F36]">
                          {rep.fiscalYear || 'FY 2026-27'} · {rep.docCategory}
                        </p>
                        <h4 className="text-sm font-bold text-[#143D21]">
                          {lang === 'hi' ? rep.titleHi || rep.titleEn : rep.titleEn || rep.titleHi}
                        </h4>
                      </div>
                      <a
                        href={rep.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#143D21] hover:bg-[#0F311A] text-white px-3.5 py-2 text-xs font-semibold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#EEEAE0] text-xs text-[#4A574E]">
                <div>
                  <p className="font-semibold text-[#143D21]">
                    {lang === 'hi' ? 'सुशासन एवं अनुपालन' : 'Governance & Compliance'}
                  </p>
                  <p className="mt-0.5 leading-relaxed">
                    {lang === 'hi'
                      ? 'Section 8 चार्टर के अनुरूप शून्य-भ्रामक दावा नीति और सत्यापित रिपोर्टिंग।'
                      : 'Non-profit Section 8 charter with zero-exaggeration impact reporting.'}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#143D21]">
                    {lang === 'hi' ? 'सत्यापित दस्तावेज़ नीति' : 'Verified Document Policy'}
                  </p>
                  <p className="mt-0.5 leading-relaxed">
                    {lang === 'hi'
                      ? 'प्रत्येक प्रमाणपत्र और वार्षिक प्रतिवेदन अनुमोदन के बाद ही सार्वजनिक किया जाता है।'
                      : 'Statutory certificates and reports are uploaded via News, Magazine & Reports upon approval.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

interface ProjectsPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

interface ExtendedProjectView {
  id: string;
  title: { hi: string; en: string };
  location: { hi: string; en: string };
  missionCategory: { hi: string; en: string };
  status: 'Proposed' | 'Under Assessment' | 'Approved' | 'Ongoing' | 'Completed';
  objectives: { hi: string; en: string };
  beneficiaryCategory: { hi: string; en: string };
  note: { hi: string; en: string };
  startDate?: string;
  progressPeriod?: string;
  imageUrl?: string;
  reportUrl?: string;
  partnerName?: string;
}

export function ProjectsPage({ lang, onNavigate }: ProjectsPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { bootstrap } = usePublicPortal();

  const liveProjects: ExtendedProjectView[] =
    bootstrap?.projects && bootstrap.projects.length > 0
      ? bootstrap.projects.map((p) => ({
          id: p.id,
          title: { hi: p.titleHi, en: p.titleEn },
          location: { hi: p.locationHi, en: p.locationEn },
          missionCategory: { hi: p.missionCategoryHi, en: p.missionCategoryEn },
          status: p.status,
          objectives: { hi: p.objectivesHi, en: p.objectivesEn },
          beneficiaryCategory: { hi: p.beneficiaryHi, en: p.beneficiaryEn },
          note: { hi: p.noteHi, en: p.noteEn },
          startDate: p.startDate,
          progressPeriod: p.progressPeriod,
          imageUrl: p.imageUrl,
          reportUrl: p.reportUrl,
          // Backend already blanks partnerName unless partnerConfirmedForPublic is true
          partnerName: p.partnerConfirmedForPublic ? p.partnerName : '',
        }))
      : PROJECTS_DATA;

  const publishedMetrics = (bootstrap?.impactMetrics ?? []).filter(
    (m) => m.isPublished
  );

  const publishedUnifiedProgrammes = filterUnifiedProgrammes(
    bootstrap?.programmes ?? [],
    { onlyPublished: true }
  );
  const unifiedHierarchy = buildProgrammeHierarchyTree(publishedUnifiedProgrammes);

  const filtered =
    statusFilter === 'All'
      ? liveProjects
      : liveProjects.filter((p) => p.status === statusFilter);

  return (
    <div className="bg-white">
      <ScenicPageHeader
        kicker={lang === 'hi' ? 'परियोजनाएँ एवं प्रभाव' : 'Projects & Impact'}
        title={lang === 'hi' ? 'परियोजना पोर्टफोलियो एवं सत्यापित डैशबोर्ड' : 'Projects Portfolio & Verified Impact'}
        subtitle={
          lang === 'hi'
            ? 'स्पष्ट स्थिति: प्रस्तावित (Proposed), मूल्यांकनाधीन (Under Assessment), स्वीकृत (Approved), चालू (Ongoing) या पूर्ण (Completed)।'
            : 'Transparent status classification. Unstarted or proposed initiatives are strictly never presented as completed achievements.'
        }
        iconName="CloudSun"
        variant="carbon"
        assetKey="organicAgroforestry"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {publishedMetrics.length > 0 && (
          <section className="rounded-2xl border border-[#1B5A32]/15 bg-[#F4F8F3] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#144527]">
                {lang === 'hi'
                  ? 'सत्यापित सार्वजनिक प्रगति आँकड़े'
                  : 'Verified Public Impact Counters'}
              </h2>
              <span className="text-[11px] text-[#44544A]">
                {lang === 'hi'
                  ? 'केवल ऑडिट व सत्यापित आँकड़े प्रकाशित'
                  : 'Only audited & published figures displayed'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {publishedMetrics.map((m) => (
                <div
                  key={m.metricKey}
                  className="rounded-xl bg-white border border-[#1B5A32]/12 p-3.5"
                >
                  <p className="text-xl font-bold text-[#144527] tabular-nums">
                    {m.verifiedValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] font-semibold text-[#1E2923] mt-0.5 leading-snug">
                    {lang === 'hi' ? m.labelHi : m.labelEn}
                  </p>
                  <p className="text-[10px] text-[#5B6B60] mt-1">{m.unitLabel}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Unified Programme Hierarchy from Central Hub (Project -> Campaign -> Event / Training) */}
        {unifiedHierarchy.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#2E7D32]" />
                <h2 className="text-lg sm:text-xl font-bold text-[#144527]">
                  {lang === 'hi'
                    ? 'सक्रिय एकीकृत कार्यक्रम श्रृंखला (परियोजना → अभियान → गतिविधि)'
                    : 'Live Unified Programme Portfolio (Project → Campaign → Activity)'}
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#44544A]">
                {lang === 'hi'
                  ? 'प्रकाशन स्थिति व क्षेत्रीय प्रगति पृथक रूप से प्रदर्शित'
                  : 'Publication & operational status tracked separately'}
              </span>
            </div>

            <div className="space-y-5">
              {unifiedHierarchy.map((root) => {
                const p = root.item;
                const cover =
                  p.media.find((m) => m.isCover && m.url) ??
                  p.media.find((m) => m.mediaType === 'photo' && m.url);
                const pdfDoc = p.media.find((m) => m.mediaType === 'pdf' && m.url);
                const firstDistrict = p.locations[0]?.district || 'Bhilwara';
                const joinUrl = `/join/${encodeURIComponent(
                  p.linkedFormType || 'farmer'
                )}?campaign=${encodeURIComponent(p.programmeCode)}&campaignTitle=${encodeURIComponent(
                  p.titleEn
                )}&district=${encodeURIComponent(firstDistrict)}`;

                return (
                  <div
                    key={p.id}
                    className="rounded-3xl border border-[#1B5A32]/20 bg-[#FAFBF8] overflow-hidden"
                  >
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {cover && (
                        <div className="lg:col-span-4">
                          <img
                            src={cover.url}
                            alt={cover.altText || p.titleEn}
                            className="w-full h-48 rounded-2xl object-cover border border-[#1B5A32]/15"
                          />
                        </div>
                      )}
                      <div className={`${cover ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-3`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#E8F2E6] text-[#144527] font-bold uppercase">
                              {p.type}
                            </span>
                            <span className="font-mono font-semibold text-[#368737]">
                              {p.programmeCode}
                            </span>
                          </div>
                          <span className="font-bold text-[#144527] bg-white px-2.5 py-0.5 rounded-md border border-[#1B5A32]/20">
                            {p.operationalStatus}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#144527]">
                          {lang === 'hi' ? p.titleHi || p.titleEn : p.titleEn}
                        </h3>
                        <p className="text-sm text-[#2A3A30] leading-relaxed">
                          {lang === 'hi' ? p.summaryHi || p.summaryEn : p.summaryEn}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#44544A]">
                          <span className="inline-flex items-center gap-1 font-semibold text-[#368737]">
                            <MapPin className="w-3.5 h-3.5" />
                            {p.coverageScope === 'india-wide'
                              ? `India-Wide (${p.locations.map((l) => l.district).join(', ')})`
                              : p.locations
                                  .map((l) =>
                                    l.localityName
                                      ? `${l.localityName}, ${l.district} (${l.stateName})`
                                      : `${l.district}, ${l.stateName}`
                                  )
                                  .join(' · ')}
                          </span>
                          {p.startDate && (
                            <span className="inline-flex items-center gap-1 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-[#368737]" />
                              {p.startDate}
                            </span>
                          )}
                        </div>
                        <div className="pt-2 flex flex-wrap items-center gap-2.5">
                          <SpringButton
                            variant="primary"
                            size="sm"
                            onClick={() => onNavigate(joinUrl)}
                          >
                            <span>{lang === 'hi' ? 'इस परियोजना से जुड़ें' : 'Participate / Register'}</span>
                          </SpringButton>
                          {pdfDoc && (
                            <a
                              href={pdfDoc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1B5A32]/20 text-xs font-semibold text-[#144527] hover:bg-[#E8F2E6]"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{pdfDoc.title}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {root.children.length > 0 && (
                      <div className="border-t border-[#1B5A32]/12 bg-white px-6 py-4 space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#368737]">
                          {lang === 'hi'
                            ? `संलग्न अभियान, कार्यक्रम एवं प्रशिक्षण (${root.children.length})`
                            : `Linked Campaigns, Events & Trainings Under This Project (${root.children.length})`}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {root.children.map((ch) => (
                            <div
                              key={ch.item.id}
                              className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-4 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-2 text-[11px]">
                                <span className="font-bold uppercase text-[#144527]">
                                  {ch.item.type} · {ch.item.programmeCode}
                                </span>
                                <span className="font-semibold text-[#368737]">
                                  {ch.item.operationalStatus}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-[#144527]">
                                {lang === 'hi' ? ch.item.titleHi || ch.item.titleEn : ch.item.titleEn}
                              </h4>
                              <p className="text-xs text-[#44544A] line-clamp-2">
                                {lang === 'hi' ? ch.item.summaryHi || ch.item.summaryEn : ch.item.summaryEn}
                              </p>
                              {ch.children.length > 0 && (
                                <div className="pt-1.5 border-t border-[#1B5A32]/10 space-y-1">
                                  {ch.children.map((gc) => (
                                    <div
                                      key={gc.item.id}
                                      className="flex items-center justify-between gap-2 text-[11px] text-[#2A3A30]"
                                    >
                                      <span className="font-medium truncate">
                                        ↳ [{gc.item.type}] {lang === 'hi' ? gc.item.titleHi || gc.item.titleEn : gc.item.titleEn}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onNavigate(
                                            `/join/${encodeURIComponent(
                                              gc.item.linkedFormType || 'volunteer'
                                            )}?campaign=${encodeURIComponent(
                                              gc.item.programmeCode
                                            )}&campaignTitle=${encodeURIComponent(
                                              gc.item.titleEn
                                            )}&district=${encodeURIComponent(
                                              gc.item.locations[0]?.district || firstDistrict
                                            )}`
                                          )
                                        }
                                        className="font-bold text-[#144527] hover:underline shrink-0 cursor-pointer"
                                      >
                                        {lang === 'hi' ? 'जुड़ें →' : 'Join →'}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Proposed', 'Under Assessment', 'Approved', 'Ongoing', 'Completed'].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === st
                    ? 'bg-[#1B5A32] text-white'
                    : 'bg-[#F4F8F3] text-[#144527] hover:bg-[#E8F2E6]'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        {/* Projects List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] p-8 text-center text-sm text-[#44544A]">
            {lang === 'hi'
              ? `"${statusFilter}" श्रेणी में अभी कोई प्रकाशित परियोजना नहीं है। केवल सत्यापित व सक्रिय स्थिति ही दिखाई जाती है।`
              : `No projects are currently listed under "${statusFilter}". Only verified and active statuses are displayed.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl border border-[#1B5A32]/15 bg-[#FAFBF8] overflow-hidden flex flex-col justify-between"
              >
                {proj.imageUrl && (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title[lang]}
                    className="w-full h-44 object-cover border-b border-[#1B5A32]/10"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#368737] inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {proj.location[lang]}
                      </span>
                      <span className="font-bold text-[#144527] bg-white px-2.5 py-0.5 rounded-md border border-[#1B5A32]/20">
                        {proj.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#144527]">{proj.title[lang]}</h2>
                    <p className="text-xs font-medium text-[#368737]">{proj.missionCategory[lang]}</p>
                    <p className="text-sm text-[#2A3A30] leading-relaxed">{proj.objectives[lang]}</p>

                    {(proj.startDate || proj.progressPeriod || proj.partnerName) && (
                      <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#44544A]">
                        {proj.startDate && (
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#1B5A32]/10">
                            <Calendar className="w-3 h-3 text-[#368737]" />
                            {lang === 'hi' ? 'प्रारंभ:' : 'Start:'} {proj.startDate}
                          </span>
                        )}
                        {proj.progressPeriod && (
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#1B5A32]/10">
                            {lang === 'hi' ? 'प्रगति अवधि:' : 'Period:'} {proj.progressPeriod}
                          </span>
                        )}
                        {proj.partnerName && (
                          <span className="inline-flex items-center gap-1 bg-[#E8F2E6] text-[#144527] font-semibold px-2.5 py-1 rounded-md">
                            <Building2 className="w-3 h-3 text-[#368737]" />
                            {lang === 'hi' ? 'सहयोगी:' : 'Partner:'} {proj.partnerName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#1B5A32]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-[#44544A]">{proj.note[lang]}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {proj.reportUrl && (
                        <a
                          href={proj.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1B5A32]/20 text-[#144527] font-semibold hover:bg-[#E8F2E6]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'रिपोर्ट PDF' : 'Report PDF'}</span>
                        </a>
                      )}
                      <SpringButton
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('/partnership')}
                      >
                        <span>{lang === 'hi' ? 'सहयोग पूछताछ' : 'Partner Inquiry'}</span>
                      </SpringButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

