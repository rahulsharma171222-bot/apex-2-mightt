import React, { useState } from 'react';
import { Mail, MapPin, ShieldCheck, Phone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { SCENIC_PANORAMAS } from './ScenicElements';
import { BRAND_INFO } from '../data/siteContent';
import { usePublicPortal } from '../context/PublicPortalContext';
import type { Language } from '../types/goveda';

interface FooterProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

const POLICY_COPY: Record<
  string,
  { title: { hi: string; en: string }; body: { hi: string; en: string } }
> = {
  privacy: {
    title: { hi: 'गोपनीयता नीति (Privacy Policy)', en: 'Privacy Policy' },
    body: {
      hi: 'GOVEDA Carbon & Climate India Foundation पंजीकरण फॉर्म के माध्यम से केवल आवश्यक संपर्क व प्रारंभिक सहभागिता विवरण एकत्र करता है। किसी भी आवेदक, किसान या महिला की व्यक्तिगत या स्वास्थ्य जानकारी बिना स्पष्ट सहमति के सार्वजनिक नहीं की जाती।',
      en: 'GOVEDA Carbon & Climate India Foundation collects only essential registration and outreach details. Personal contact records, land documents (if later required for verified screening), and health education inquiries are handled strictly confidentially.',
    },
  },
  terms: {
    title: { hi: 'नियम एवं शर्तें (Terms & Conditions)', en: 'Terms & Conditions' },
    body: {
      hi: 'इस वेबसाइट पर दी गई सामग्री जन-जागरूकता, शिक्षा और सामुदायिक सहभागिता के लिए है। किसी भी आवेदन का सबमिट होना स्वतः परियोजना पात्रता, रोजगार या वित्तीय लाभ की स्वीकृति नहीं है।',
      en: 'Content on this portal is intended for public awareness, education, and community participation. Submitting an interest form does not constitute automatic project approval, employment, or financial entitlement.',
    },
  },
  disclaimer: {
    title: { hi: 'अस्वीकरण (Disclaimer)', en: 'Institutional Disclaimer' },
    body: {
      hi: 'कार्बन क्रेडिट, जैविक खेती आय या प्रशिक्षण के संदर्भ में किसी भी निश्चित कमाई, रोजगार अथवा विदेश वीज़ा की गारंटी नहीं दी जाती। प्रस्तावित परियोजनाओं को केवल प्रस्तावित अथवा मूल्यांकनाधीन के रूप में दर्शाया गया है।',
      en: 'GOVEDA does not guarantee fixed income from carbon credits, overseas placement from language courses, or operational status for proposed feasibility projects. Only verified progress metrics are published.',
    },
  },
  donation: {
    title: { hi: 'दान नीति (Donation Policy)', en: 'Donation & CSR Transparency Policy' },
    body: {
      hi: 'वित्तीय योगदान एवं CSR सहयोग केवल औपचारिक रूप से सत्यापित संस्थागत बैंक विवरण और वैध वैधानिक अनुमोदनों (Section 8 / 12A / 80G लागू होने पर) के अनुरूप ही स्वीकार किए जाते हैं।',
      en: 'Contributions and CSR grants are processed strictly through verified institutional bank channels accompanied by official receipts compliant with active statutory approvals.',
    },
  },
};

export function Footer({ lang, onNavigate }: FooterProps) {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const { bootstrap } = usePublicPortal();
  const gov = bootstrap?.siteGovernance ?? null;

  const confirmedOfficeAddress = gov?.officeConfirmedForPublic
    ? lang === 'hi'
      ? gov.headOfficeAddressHi || gov.headOfficeAddressEn
      : gov.headOfficeAddressEn || gov.headOfficeAddressHi
    : '';
  const confirmedPhone = gov?.officeConfirmedForPublic ? gov.officialPhone?.trim() : '';

  return (
    <footer className="relative bg-[#1B522B] text-[#EAF5E8] overflow-hidden mt-10">
      {/* Seamless Panoramic Rajasthan Village, Windmill & Fort Horizon Transition */}
      <div className="relative w-full bg-white overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <img
          src={SCENIC_PANORAMAS.fort}
          alt=""
          className="w-full max-w-[1600px] mx-auto h-16 sm:h-24 lg:h-28 object-cover object-bottom block"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-gradient-to-b from-transparent via-[#1B522B]/70 to-[#1B522B]"
          aria-hidden="true"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-white/15">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-3">
            <BrandLogo onDark />
            <p className="text-xs font-semibold tracking-[0.14em] text-[#9CD668]">
              {BRAND_INFO.motto}
            </p>
            <p className="text-xs text-[#CBE0CA] leading-relaxed max-w-sm">
              {lang === 'hi'
                ? 'Section 8 गैर-लाभकारी संस्था — पर्यावरण संरक्षण, किसान समृद्धि, आत्मनिर्भर गौशाला, कौशल विकास एवं हरित राजस्थान अभियान।'
                : 'A Section 8 Non-Profit Organisation uniting climate literacy, tree plantation, self-reliant Gaushalas, rural skills, and heritage conservation.'}
            </p>
            <div className="pt-1 space-y-1.5 text-xs text-[#E6F1E5]">
              <a
                href={`mailto:${BRAND_INFO.email}`}
                className="inline-flex items-center gap-2 hover:text-[#9CD668] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#9CD668]" aria-hidden="true" />
                <span>{BRAND_INFO.email}</span>
              </a>
              {confirmedPhone && (
                <div>
                  <a
                    href={`tel:${confirmedPhone}`}
                    className="inline-flex items-center gap-2 hover:text-[#9CD668] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9CD668]" aria-hidden="true" />
                    <span>{confirmedPhone}</span>
                  </a>
                </div>
              )}
              <p className="flex items-start gap-2 text-[#CBE0CA]">
                <MapPin className="w-3.5 h-3.5 text-[#9CD668] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {confirmedOfficeAddress
                    ? confirmedOfficeAddress
                    : lang === 'hi'
                    ? 'राजस्थान (भीलवाड़ा, चूरू, बीकानेर, फलोदी, जोधपुर प्रथम चरण)'
                    : 'Rajasthan (Bhilwara, Churu, Bikaner, Phalodi, Jodhpur Phase I)'}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CD668] mb-3">
              {lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                { path: '/', label: lang === 'hi' ? 'होम' : 'Home' },
                { path: '/about', label: lang === 'hi' ? 'हमारे बारे में' : 'About Us' },
                { path: '/missions', label: lang === 'hi' ? 'हमारे 10 मिशन' : 'Our 10 Missions' },
                { path: '/harit-rajasthan', label: lang === 'hi' ? 'हरित राजस्थान' : 'Harit Rajasthan' },
                { path: '/harit-bharat', label: lang === 'hi' ? 'हरित भारत (पैन-इंडिया)' : 'Harit Bharat (Pan-India)' },
                { path: '/projects', label: lang === 'hi' ? 'परियोजनाएँ एवं प्रभाव' : 'Projects & Impact' },
                { path: '/harit-marathon', label: lang === 'hi' ? 'हरित मैराथन 2026' : 'Harit Marathon 2026' },
                { path: '/join', label: lang === 'hi' ? 'हमसे जुड़ें' : 'Join GOVEDA' },
                { path: '/contact', label: lang === 'hi' ? 'संपर्क करें' : 'Contact Us' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className="text-[#DCEAD9] hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Missions */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CD668] mb-3">
              {lang === 'hi' ? 'प्रमुख मिशन' : 'Our Missions'}
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                { path: '/missions/carbon-credit', label: lang === 'hi' ? 'कार्बन क्रेडिट एवं जलवायु' : 'Carbon Credit & Climate Action' },
                { path: '/missions/self-reliant-gaushala', label: lang === 'hi' ? 'आत्मनिर्भर गौशाला' : 'Self-Reliant Gaushala' },
                { path: '/missions/biogas-cbg', label: lang === 'hi' ? 'बायोगैस एवं बायो-CNG' : 'Biogas & Bio-CNG/CBG' },
                { path: '/missions/organic-farming', label: lang === 'hi' ? 'जैविक व आधुनिक खेती' : 'Organic & Modern Farming' },
                { path: '/missions/skill-development', label: lang === 'hi' ? 'कौशल विकास एवं भाषा' : 'Skill Development & Employment' },
                { path: '/missions/heritage-solar-water', label: lang === 'hi' ? 'विरासत, सोलर व जल संरक्षण' : 'Heritage, Solar & Water' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className="text-[#DCEAD9] hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Governance */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9CD668] mb-3">
              {lang === 'hi' ? 'महत्वपूर्ण नीतियाँ' : 'Governance & Policies'}
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                { key: 'privacy', label: lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy' },
                { key: 'terms', label: lang === 'hi' ? 'नियम एवं शर्तें' : 'Terms & Conditions' },
                { key: 'disclaimer', label: lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer' },
                { key: 'donation', label: lang === 'hi' ? 'दान नीति' : 'Donation Policy' },
              ].map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() =>
                      setActivePolicy(activePolicy === item.key ? null : item.key)
                    }
                    className="text-[#DCEAD9] hover:text-white hover:underline underline-offset-4 cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-white/15 space-y-2.5">
              <p className="text-[11px] text-[#CBE0CA] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9CD668] shrink-0" />
                <span>{lang === 'hi' ? 'पारदर्शी डिजिटल पहल' : 'Verified Public Charter'}</span>
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/admin')}
                className="text-[11px] font-medium text-[#9CD668] hover:text-white hover:underline underline-offset-4 cursor-pointer text-left"
              >
                {lang === 'hi' ? 'अधिकृत एडमिन कंसोल →' : 'Authorised Admin Console →'}
              </button>
            </div>
          </div>
        </div>

        {/* Inline Policy Drawer */}
        {activePolicy && POLICY_COPY[activePolicy] && (
          <div className="mt-5 p-4 rounded-xl bg-[#0E2C19] border border-[#9CD668]/30 text-xs text-[#E6F1E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-[#9CD668] mb-1">
                {POLICY_COPY[activePolicy].title[lang]}
              </p>
              <p className="leading-relaxed text-[#DCEAD9]">
                {POLICY_COPY[activePolicy].body[lang]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActivePolicy(null)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 self-start cursor-pointer"
            >
              {lang === 'hi' ? 'बंद करें' : 'Close'}
            </button>
          </div>
        )}

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#B9D4B8]">
          <p>
            © {new Date().getFullYear()} GOVEDA Carbon &amp; Climate India Foundation.{' '}
            {lang === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </p>
          <p>
            {lang === 'hi'
              ? 'केवल सत्यापित प्रगति आँकड़े ही सार्वजनिक रूप से प्रकाशित किए जाते हैं।'
              : 'Official Institutional Portal · Only verified progress figures are published.'}
          </p>
        </div>
      </div>

    </footer>
  );
}
