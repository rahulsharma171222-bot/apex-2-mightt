import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  X,
  Sprout,
  Users,
  Trophy,
  ArrowRight,
  MapPin,
  BookOpen,
  Building2,
  Compass,
  Calendar,
  PhoneCall,
  Sparkles,
  FileText,
  Flag,
  GitBranch,
  Handshake,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { MISSIONS_DATA } from '../data/missionsData';
import { DISTRICTS_DATA } from '../data/districtsData';
import { usePublicPortal } from '../context/PublicPortalContext';
import { filterUnifiedProgrammes } from '../utils/adminLogic';
import type { Language } from '../types/goveda';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

type DesktopMenuKey = 'missions' | 'harit' | 'join' | 'projects' | 'events' | null;

const JOIN_GROUPS = [
  {
    groupHi: 'ग्रामीण, किसान व गौशाला',
    groupEn: 'Rural, Farmers & Gaushalas',
    items: [
      { num: '01', cat: 'farmer', hi: 'किसान पंजीकरण', en: 'Farmer Registration' },
      { num: '02', cat: 'harit-mitra', hi: 'हरित मित्र बनें', en: 'Become a Harit Mitra' },
      { num: '03', cat: 'gaushala', hi: 'गौशाला साझेदारी', en: 'Gaushala Partnership' },
      { num: '05', cat: 'women-shg', hi: 'महिला SHG एवं उद्यमिता', en: 'Women SHG & Enterprise' },
    ],
  },
  {
    groupHi: 'युवा, विद्यार्थी व नागरिक',
    groupEn: 'Youth, Students & Citizens',
    items: [
      { num: '07', cat: 'volunteer', hi: 'स्वयंसेवक (Volunteer)', en: 'Civic & Youth Volunteer' },
      { num: '04', cat: 'school-college', hi: 'स्कूल / कॉलेज ग्रीन कैंपस', en: 'School / College Campus' },
      { num: '06', cat: 'skill-training', hi: 'कौशल एवं विदेशी भाषा', en: 'Skill & Language Courses' },
      { num: '08', cat: 'marathon', hi: 'हरित मैराथन धावक', en: 'Harit Marathon Runner' },
    ],
  },
  {
    groupHi: 'संस्था, CSR व विशेषज्ञ',
    groupEn: 'Institutions, CSR & Experts',
    items: [
      { num: '09', cat: 'csr-partner', hi: 'CSR व कॉर्पोरेट साझेदारी', en: 'CSR & Corporate Partner' },
      { num: '10', cat: 'ngo-institution', hi: 'NGO एवं संस्था सहयोग', en: 'NGO & Institutional MoU' },
      { num: '11', cat: 'expert-trainer', hi: 'चिकित्सक, योग व विशेषज्ञ', en: 'Experts, Doctors & Trainers' },
      { num: '12', cat: 'membership', hi: 'सदस्यता एवं पत्रिका', en: 'Membership & Magazine' },
    ],
  },
] as const;

export function Header({ lang, onToggleLang, currentPath, onNavigate }: HeaderProps) {
  const { bootstrap } = usePublicPortal();
  const [openMenu, setOpenMenu] = useState<DesktopMenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>('missions');
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const liveHubProgrammes = filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
    onlyPublished: true,
  });

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDesktopMenu = (menu: DesktopMenuKey) => {
    clearCloseTimer();
    setOpenMenu(menu);
  };

  const scheduleCloseDesktopMenu = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      clearCloseTimer();
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Prevent background body scrolling when full-screen mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile drawer automatically if viewport widens to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const go = (path: string) => {
    clearCloseTimer();
    setOpenMenu(null);
    setMobileOpen(false);
    onNavigate(path);
  };

  const isActive = (prefix: string) =>
    prefix === '/' ? currentPath === '/' : currentPath.startsWith(prefix);

  const isProjectsCampaignsActive =
    isActive('/projects') || isActive('/harit-bharat');
  const isEventsMediaActive =
    isActive('/events') || isActive('/harit-marathon') || isActive('/magazine');

  const navBtnClass = (active: boolean) =>
    `inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-[13px] xl:text-[13.5px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
      active
        ? 'bg-[#EEF6E7] text-[#113B19]'
        : 'text-[#213327] hover:bg-[#F3F8EE] hover:text-[#113B19]'
    }`;

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={scheduleCloseDesktopMenu}
        className="sticky top-0 z-50 bg-[#FCFBF7]/96 backdrop-blur-md border-b border-[#E4DCC6]"
      >
        {/* TIER 1: BRAND MARK + LANGUAGE SWITCHER + SEPARATE DONATE NOW HEADER BUTTON */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-[64px] lg:h-[66px] flex items-center justify-between gap-3">
          {/* ZONE 1: BRAND MARK */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              go('/');
            }}
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-[#2E7D32] rounded-lg"
            aria-label="GOVEDA Carbon & Climate India Foundation Home"
          >
            <BrandLogo compact />
          </a>

          {/* ZONE 2: LANGUAGE SWITCHER + SEPARATE DONATE NOW BUTTON + MOBILE HAMBURGER */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Segmented Language Pill */}
            <div
              role="group"
              aria-label="Language Selector"
              className="inline-flex items-center bg-white border border-[#D8CEB4] rounded-full p-0.5 text-xs sm:text-[13px] font-semibold shadow-2xs"
            >
              <button
                type="button"
                onClick={() => onToggleLang('hi')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-[#154A24] text-white'
                    : 'text-[#4B5B50] hover:text-[#113B19]'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#154A24] text-white'
                    : 'text-[#4B5B50] hover:text-[#113B19]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Separate Dedicated Header Button: Donate Now */}
            <button
              type="button"
              onClick={() => go('/partnership')}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#154A24] hover:bg-[#0F391B] text-white px-4 lg:px-5 py-2 text-[13px] lg:text-[13.5px] font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{lang === 'hi' ? 'सहयोग करें (Donate Now)' : 'Donate Now'}</span>
              <Heart className="w-3.5 h-3.5 fill-[#9EE35B] text-[#9EE35B]" aria-hidden="true" />
            </button>

            {/* Mobile / Tablet Menu Toggle Button */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="goveda-mobile-nav-drawer"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#D8CEB4] text-[#113B19] hover:bg-[#EEF6E7] active:scale-95 transition-all cursor-pointer touch-manipulation shrink-0"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* TIER 2: RECOMMENDED 10-ITEM MAIN MENU BAR (Desktop lg+) */}
        <div className="hidden lg:block border-t border-[#ECE4D2] bg-[#FAF8F2]/90">
          <nav
            aria-label="Main Navigation"
            className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[44px] flex items-center justify-between gap-0.5 overflow-x-auto no-scrollbar"
          >
            {/* 1. Home */}
            <a
              href="#/"
              onMouseEnter={() => openDesktopMenu(null)}
              onClick={(e) => {
                e.preventDefault();
                go('/');
              }}
              className={navBtnClass(isActive('/'))}
            >
              {lang === 'hi' ? 'होम' : 'Home'}
            </a>

            {/* 2. About Us */}
            <a
              href="#/about"
              onMouseEnter={() => openDesktopMenu(null)}
              onClick={(e) => {
                e.preventDefault();
                go('/about');
              }}
              className={navBtnClass(isActive('/about'))}
            >
              {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
            </a>

            {/* 3. Our Missions */}
            <div
              className="relative"
              onMouseEnter={() => openDesktopMenu('missions')}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'missions'}
                onClick={() =>
                  setOpenMenu(openMenu === 'missions' ? null : 'missions')
                }
                className={navBtnClass(isActive('/missions') || openMenu === 'missions')}
              >
                <span>{lang === 'hi' ? 'हमारे मिशन' : 'Our Missions'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                    openMenu === 'missions' ? 'rotate-180 text-[#154A24]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 4. Harit Rajasthan */}
            <div
              className="relative"
              onMouseEnter={() => openDesktopMenu('harit')}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'harit'}
                onClick={() => go('/harit-rajasthan')}
                className={navBtnClass(
                  isActive('/harit-rajasthan') || openMenu === 'harit'
                )}
              >
                <span>{lang === 'hi' ? 'हरित राजस्थान' : 'Harit Rajasthan'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                    openMenu === 'harit' ? 'rotate-180 text-[#154A24]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 5. Join GOVEDA */}
            <div
              className="relative"
              onMouseEnter={() => openDesktopMenu('join')}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'join'}
                onClick={() => setOpenMenu(openMenu === 'join' ? null : 'join')}
                className={navBtnClass(isActive('/join') || openMenu === 'join')}
              >
                <span>{lang === 'hi' ? 'GOVEDA से जुड़ें' : 'Join GOVEDA'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                    openMenu === 'join' ? 'rotate-180 text-[#154A24]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 6. Training & Knowledge */}
            <a
              href="#/training"
              onMouseEnter={() => openDesktopMenu(null)}
              onClick={(e) => {
                e.preventDefault();
                go('/training');
              }}
              className={navBtnClass(isActive('/training'))}
            >
              {lang === 'hi' ? 'प्रशिक्षण व ज्ञान' : 'Training & Knowledge'}
            </a>

            {/* 7. Projects & Campaigns (Dedicated Menu) */}
            <div
              className="relative"
              onMouseEnter={() => openDesktopMenu('projects')}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'projects'}
                onClick={() => go('/projects')}
                className={navBtnClass(
                  isProjectsCampaignsActive || isActive('/campaigns') || openMenu === 'projects'
                )}
              >
                <span>{lang === 'hi' ? 'परियोजनाएँ व अभियान' : 'Projects & Campaigns'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                    openMenu === 'projects' ? 'rotate-180 text-[#154A24]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 8. Events & Media */}
            <div
              className="relative"
              onMouseEnter={() => openDesktopMenu('events')}
            >
              <button
                type="button"
                aria-expanded={openMenu === 'events'}
                onClick={() =>
                  setOpenMenu(openMenu === 'events' ? null : 'events')
                }
                className={navBtnClass(isEventsMediaActive || openMenu === 'events')}
              >
                <span>{lang === 'hi' ? 'कार्यक्रम व मीडिया' : 'Events & Media'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                    openMenu === 'events' ? 'rotate-180 text-[#154A24]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* 9. Partnership & Donation */}
            <a
              href="#/partnership"
              onMouseEnter={() => openDesktopMenu(null)}
              onClick={(e) => {
                e.preventDefault();
                go('/partnership');
              }}
              className={navBtnClass(isActive('/partnership'))}
            >
              {lang === 'hi' ? 'साझेदारी व सहयोग' : 'Partnership & Donation'}
            </a>

            {/* 10. Contact Us */}
            <a
              href="#/contact"
              onMouseEnter={() => openDesktopMenu(null)}
              onClick={(e) => {
                e.preventDefault();
                go('/contact');
              }}
              className={navBtnClass(isActive('/contact'))}
            >
              {lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}
            </a>
          </nav>
        </div>

      {/* ====================================================================
          FULL-WIDTH EDITORIAL MEGA-MENU PANEL (Desktop lg+)
          Spacious, scannable, zero tiny scrollboxes!
         ==================================================================== */}
      {openMenu && (
        <div
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleCloseDesktopMenu}
          className="hidden lg:block absolute inset-x-0 top-full bg-white/98 backdrop-blur-lg border-b border-[#DFCFAF] shadow-[0_24px_48px_-16px_rgba(17,59,25,0.14)] z-50"
        >
          <div className="max-w-7xl mx-auto px-8 py-7">
            {/* PANEL: OUR 10 MISSIONS (2-Column Editorial Grid + Side Highlight) */}
            {openMenu === 'missions' && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-9 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ECE4D2] pb-3">
                    <div>
                      <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#5A7B3B]">
                        {lang === 'hi' ? 'GOVEDA के 10 प्रमुख मिशन' : '10 Core GOVEDA Missions'}
                      </p>
                      <p className="text-sm text-[#435648] mt-0.5">
                        {lang === 'hi'
                          ? 'जलवायु कार्रवाई, हरित राजस्थान, गौशाला स्वावलंबन और वृद्धजन कल्याण का समग्र दृष्टिकोण'
                          : 'Integrated rural climate resilience, eco-restoration, Gaushala self-reliance & human welfare'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => go('/missions')}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#154A24] hover:text-[#3A7D24] cursor-pointer"
                    >
                      <span>{lang === 'hi' ? 'सभी मिशन पृष्ठ देखें' : 'View All Missions'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                    {MISSIONS_DATA.map((m) => {
                      const active = currentPath === `/missions/${m.slug}`;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => go(`/missions/${m.slug}`)}
                          className={`group text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                            active
                              ? 'bg-[#EEF6E7] border-[#7CC042]/60'
                              : 'bg-transparent border-transparent hover:bg-[#FAF8F2] hover:border-[#E5DEC8]'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 tabular-nums transition-colors ${
                              active
                                ? 'bg-[#154A24] text-[#D7F7B2]'
                                : 'bg-[#EEF5E6] text-[#1D542B] group-hover:bg-[#154A24] group-hover:text-[#D7F7B2]'
                            }`}
                          >
                            {String(m.number).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <p className={`text-[13.5px] font-bold text-[#113B19] group-hover:text-[#1D632E] leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                              {m.shortTitle[lang]}
                            </p>
                            <p className="text-[11.5px] text-[#526557] line-clamp-1 mt-0.5">
                              {m.tagline[lang]}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Editorial Spotlight */}
                <div className="col-span-3 rounded-2xl bg-[#FAF8F2] border border-[#E5DEC8] p-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.12em] uppercase text-[#5A7B3B]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'प्रमुख समर्पित पृष्ठ' : 'Featured Mission Pages'}</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        path: '/missions/organic-farming',
                        hi: 'जैविक खेती एवं ग्रामीण विकास',
                        en: 'Organic Farming & Rural Growth',
                      },
                      {
                        path: '/missions/biogas-cbg',
                        hi: 'स्वच्छ ऊर्जा (सौर, बायोगैस, CBG)',
                        en: 'Clean Energy: Solar & Biogas',
                      },
                      {
                        path: '/missions/heritage-solar-water',
                        hi: 'सांस्कृतिक धरोहर व जल संरक्षण',
                        en: 'Heritage, Solar & Water Care',
                      },
                      {
                        path: '/missions/clean-india-plastic-free',
                        hi: 'स्वच्छ भारत प्लास्टिक मुक्त',
                        en: 'Clean India & Plastic-Free',
                      },
                      {
                        path: '/missions/women-empowerment',
                        hi: 'महिला सशक्तीकरण',
                        en: 'Women Empowerment',
                      },
                      {
                        path: '/missions/skill-development',
                        hi: 'कौशल विकास एवं रोजगार',
                        en: 'Skill Development & Jobs',
                      },
                    ].map((spot) => (
                      <button
                        key={spot.path}
                        type="button"
                        onClick={() => go(spot.path)}
                        className="w-full text-left px-3 py-2 rounded-xl bg-white border border-[#E5DEC8] hover:border-[#7CC042] text-xs font-bold text-[#113B19] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      >
                        <span className={lang === 'hi' ? 'font-hindi' : ''}>
                          {lang === 'hi' ? spot.hi : spot.en}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#5A7B3B] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: HARIT RAJASTHAN */}
            {openMenu === 'harit' && (
              <div className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-4 space-y-3">
                  <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#5A7B3B]">
                    {lang === 'hi' ? 'हरित राजस्थान अभियान' : 'Harit Rajasthan Campaign'}
                  </p>
                  <h3 className={`text-xl font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
                    {lang === 'hi' ? 'प्रारंभिक 5 फोकस जिलों से हरियाली संकल्प' : 'Starting With 5 Priority Districts'}
                  </h3>
                  <p className="text-xs text-[#435648] leading-relaxed">
                    {lang === 'hi'
                      ? 'भीलवाड़ा, चूरू, बीकानेर, फलोदी और जोधपुर में स्थानीय हरित मित्रों व किसानों के सहयोग से देशी वृक्षारोपण और संरक्षण पहल।'
                      : 'Native agroforestry, sapling protection, and local Harit Mitra networks beginning across Bhilwara, Churu, Bikaner, Phalodi, and Jodhpur.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => go('/harit-rajasthan')}
                      className="inline-flex items-center gap-2 rounded-full bg-[#154A24] text-white px-4 py-2 text-xs font-bold hover:bg-[#0F391B] cursor-pointer"
                    >
                      <span>{lang === 'hi' ? 'हरित राजस्थान मानचित्र' : 'Explore Rajasthan Map'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go('/harit-bharat')}
                      className="inline-flex items-center gap-2 rounded-full bg-[#FAF6E8] border border-[#C8922A]/50 text-[#113B19] px-4 py-2 text-xs font-bold hover:bg-[#F3EBD1] cursor-pointer"
                    >
                      <span>{lang === 'hi' ? 'हरित भारत (पैन-इंडिया)' : 'Harit Bharat (Pan-India)'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8E6212]" />
                    </button>
                  </div>
                </div>

                <div className="col-span-5 grid grid-cols-1 gap-2">
                  <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#7C8C7F] px-2">
                    {lang === 'hi' ? 'प्रारंभिक फोकस जिले चुनें' : 'Select Focus District'}
                  </p>
                  {DISTRICTS_DATA.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => go(`/harit-rajasthan/${d.slug}`)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F2] border border-transparent hover:border-[#E5DEC8] flex items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#5A7B3B] shrink-0" />
                        <div>
                          <p className={`text-sm font-bold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                            {d.name[lang]}
                          </p>
                          <p className="text-[11px] text-[#526557]">{d.regionTag[lang]}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#5A7B3B]" />
                    </button>
                  ))}
                </div>

                <div className="col-span-3 rounded-2xl bg-[#153E1E] text-white p-5 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C8F19E]">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? '20 दिसंबर 2026' : '20 December 2026'}</span>
                  </div>
                  <h4 className={`text-base font-extrabold leading-snug ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? 'हरित मैराथन 2026' : 'Harit Marathon 2026'}
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {lang === 'hi'
                      ? 'प्रकृति, स्वास्थ्य और स्वच्छ पर्यावरण के लिए सामूहिक जन-जागरूकता दौड़ में पंजीकरण करें।'
                      : 'Join Rajasthan’s community green run for climate awareness and healthy living.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => go('/events/harit-marathon')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#82C341] text-[#102E16] px-4 py-2 text-xs font-extrabold hover:bg-[#95D456] cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'मैराथन विवरण देखें' : 'View Marathon'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* PANEL: JOIN US (Categorized 3-Column Portal — Zero Scrolling!) */}
            {openMenu === 'join' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#ECE4D2] pb-3">
                  <div>
                    <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#5A7B3B]">
                      {lang === 'hi' ? 'हमसे जुड़ें — 12 समर्पित पंजीकरण फॉर्म' : 'Join GOVEDA — 12 Dedicated Registration Forms'}
                    </p>
                    <p className="text-xs text-[#435648] mt-0.5">
                      {lang === 'hi'
                        ? 'अपनी भूमिका चुनें और सीधे ऑनलाइन पंजीकरण व आवेदन स्थिति ट्रैकिंग प्राप्त करें'
                        : 'Select your role to submit an application and track your registration status online'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => go('/join')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#154A24] text-white px-4 py-2 text-xs font-bold hover:bg-[#0F391B] cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'संपूर्ण पंजीकरण पोर्टल' : 'Open Full Portal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {JOIN_GROUPS.map((grp) => (
                    <div key={grp.groupEn} className="space-y-2">
                      <p className="text-xs font-extrabold text-[#5A7B3B] px-2.5">
                        {lang === 'hi' ? grp.groupHi : grp.groupEn}
                      </p>
                      <div className="space-y-1">
                        {grp.items.map((item) => (
                          <button
                            key={item.cat}
                            type="button"
                            onClick={() => go(`/join/${item.cat}`)}
                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#FAF8F2] border border-transparent hover:border-[#E5DEC8] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[11px] font-extrabold text-[#4B8E27] tabular-nums w-5">
                                {item.num}
                              </span>
                              <span className={`text-[13.5px] font-semibold text-[#153E1E] truncate ${lang === 'hi' ? 'font-hindi' : ''}`}>
                                {lang === 'hi' ? item.hi : item.en}
                              </span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-[#8A9D8E] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PANEL: PROJECTS & CAMPAIGNS (Dedicated Unified Programmes & Campaigns Menu) */}
            {openMenu === 'projects' && (
              <div className="grid grid-cols-12 gap-7 items-start">
                <div className="col-span-7 grid grid-cols-2 gap-4">
                  {[
                    {
                      path: '/projects',
                      icon: Sprout,
                      hi: 'परियोजनाएँ एवं प्रभाव पोर्टफोलियो',
                      en: 'Projects & Verified Impact',
                      subHi: 'प्रस्तावित, स्वीकृत व सक्रिय परियोजनाएँ और प्रोजेक्ट → अभियान श्रृंखला',
                      subEn: 'Unified Project → Campaign → Activity portfolio & transparent status tracking',
                    },
                    {
                      path: '/harit-bharat',
                      icon: Flag,
                      hi: 'सक्रिय अभियान एवं पैन-इंडिया खोज',
                      en: 'Active Campaigns & Location Explorer',
                      subHi: 'राज्य, जिला व ग्राम स्तर के अभियान और खुली सहभागिता भूमिकाएँ',
                      subEn: 'Explore state, district & village campaigns with direct role applications',
                    },
                    {
                      path: '/harit-rajasthan',
                      icon: MapPin,
                      hi: 'हरित राजस्थान क्षेत्रीय अभियान',
                      en: 'Harit Rajasthan Regional Drives',
                      subHi: 'भीलवाड़ा, चूरू, बीकानेर, फलोदी और जोधपुर में वृक्षारोपण अभियान',
                      subEn: 'Phase-1 focus district drives across Bhilwara, Churu, Bikaner, Phalodi & Jodhpur',
                    },
                    {
                      path: '/missions/clean-india-plastic-free',
                      icon: Compass,
                      hi: 'स्वच्छ भारत व कचरा प्रबंधन अभियान',
                      en: 'Clean India & Waste Drives',
                      subHi: 'सत्यापित कचरा संग्रहण रिकॉर्ड, प्लास्टिक-मुक्त बाज़ार व महिला SHG इकाइयाँ',
                      subEn: 'Ground-verified waste handling ledger & plastic-free market campaigns',
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => go(item.path)}
                        className="text-left p-4 rounded-2xl bg-[#FCFBF7] hover:bg-[#F2F8EC] border border-[#E5DEC8] hover:border-[#7CC042] transition-all space-y-2 cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#DFCFAF] text-[#154A24] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className={`text-sm font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                          {lang === 'hi' ? item.hi : item.en}
                        </p>
                        <p className="text-xs text-[#4C5F52] leading-relaxed">
                          {lang === 'hi' ? item.subHi : item.subEn}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Live Active Projects & Campaigns pulled directly from Central Hub */}
                <div className="col-span-5 rounded-2xl bg-[#FAF8F2] border border-[#E5DEC8] p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.12em] uppercase text-[#5A7B3B]">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'सक्रिय परियोजनाएँ व अभियान' : 'Live Programmes & Campaigns'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => go('/projects')}
                      className="text-[11px] font-bold text-[#154A24] hover:underline cursor-pointer"
                    >
                      {lang === 'hi' ? 'सभी देखें →' : 'View All →'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {liveHubProgrammes.slice(0, 4).map((prg) => (
                      <button
                        key={prg.id}
                        type="button"
                        onClick={() =>
                          go(
                            prg.type === 'campaign'
                              ? '/harit-bharat'
                              : prg.type === 'event'
                              ? '/events'
                              : prg.type === 'training'
                              ? '/training'
                              : '/projects'
                          )
                        }
                        className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DEC8] hover:border-[#7CC042] transition-colors flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A7B3B]">
                            {prg.type} · {prg.operationalStatus}
                          </span>
                          <p className="text-xs font-bold text-[#113B19] truncate">
                            {lang === 'hi' ? prg.titleHi || prg.titleEn : prg.titleEn}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#5A7B3B] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: EVENTS & MEDIA */}
            {openMenu === 'events' && (
              <div className="grid grid-cols-3 gap-5 max-w-5xl">
                {[
                  {
                    path: '/events',
                    icon: Calendar,
                    hi: 'कार्यक्रम, गैलरी एवं मीडिया',
                    en: 'Events, Gallery & Media',
                    subHi: 'जिला स्तरीय अभियान, संवाद, फोटो गैलरी व प्रेस अपडेट्स',
                    subEn: 'District drives, field activities, photo gallery & press releases',
                  },
                  {
                    path: '/events/harit-marathon',
                    icon: Trophy,
                    hi: 'हरित मैराथन — 20 Dec 2026',
                    en: 'Harit Marathon — 20 Dec 2026',
                    subHi: 'पर्यावरण व स्वस्थ जीवन के लिए विशेष जन-मैराथन व पंजीकरण',
                    subEn: 'Flagship green run for climate resilience, categories & registration',
                  },
                  {
                    path: '/magazine',
                    icon: FileText,
                    hi: 'हरित भारत संवाद पत्रिका',
                    en: 'Quarterly Magazine & Reports',
                    subHi: 'त्रैमासिक संपादकीय प्रकाशन, वार्षिक रिपोर्ट व जन-ज्ञान संसाधन',
                    subEn: 'Quarterly foundation publication, field stories & downloadable PDFs',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => go(item.path)}
                      className="text-left p-4 rounded-2xl bg-[#FCFBF7] hover:bg-[#F2F8EC] border border-[#E5DEC8] hover:border-[#7CC042] transition-all space-y-2 cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#DFCFAF] text-[#154A24] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className={`text-sm font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                        {lang === 'hi' ? item.hi : item.en}
                      </p>
                      <p className="text-xs text-[#4C5F52] leading-relaxed">
                        {lang === 'hi' ? item.subHi : item.subEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      </header>

      {/* ====================================================================
          MOBILE / TABLET FULL-HEIGHT LUXURY DRAWER (< lg)
          Portaled into document.body so header backdrop-blur never traps
          position: fixed or collapses drawer height!
         ==================================================================== */}
      {mobileOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="goveda-mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'hi' ? 'मुख्य नेविगेशन मेन्यू' : 'Main Navigation Menu'}
            className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-[70] bg-[#FCFBF7] flex flex-col border-t border-[#E4DCC6] shadow-2xl"
          >
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-3">
            {/* Quick Top Home & About Links */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => go('/')}
                className={`px-4 py-3 rounded-2xl border text-left text-sm font-bold transition-colors cursor-pointer ${
                  isActive('/')
                    ? 'bg-[#154A24] text-white border-[#154A24]'
                    : 'bg-white text-[#113B19] border-[#E4DCC6]'
                }`}
              >
                {lang === 'hi' ? 'होम (Home)' : 'Home'}
              </button>
              <button
                type="button"
                onClick={() => go('/about')}
                className={`px-4 py-3 rounded-2xl border text-left text-sm font-bold transition-colors cursor-pointer ${
                  isActive('/about')
                    ? 'bg-[#154A24] text-white border-[#154A24]'
                    : 'bg-white text-[#113B19] border-[#E4DCC6]'
                }`}
              >
                {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
              </button>
            </div>

            {/* Accordion 1: ALL 10 MISSIONS */}
            <div className="rounded-2xl bg-white border border-[#E4DCC6] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileExpanded(mobileExpanded === 'missions' ? null : 'missions')
                }
                aria-expanded={mobileExpanded === 'missions'}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer"
              >
                <div>
                  <p className={`text-[15px] font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                    {lang === 'hi' ? 'हमारे 10 प्रमुख मिशन' : 'Our 10 Major Missions'}
                  </p>
                  <p className="text-[11px] text-[#5A7B3B] font-semibold">
                    {lang === 'hi' ? 'सीधे किसी भी मिशन पृष्ठ पर जाएँ' : 'Jump directly to any mission'}
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#154A24] transition-transform ${
                    mobileExpanded === 'missions' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileExpanded === 'missions' && (
                <div className="px-3 pb-3 pt-1 border-t border-[#F0E9D8] space-y-1">
                  <button
                    type="button"
                    onClick={() => go('/missions')}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-[#EEF6E7] text-[#113B19] text-xs font-extrabold flex items-center justify-between cursor-pointer mb-1.5"
                  >
                    <span>{lang === 'hi' ? 'सभी 10 मिशन का अवलोकन देखें' : 'View All 10 Missions Overview'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {MISSIONS_DATA.map((m) => {
                    const active = currentPath === `/missions/${m.slug}`;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => go(`/missions/${m.slug}`)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-[13.5px] transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#154A24] text-white font-bold'
                            : 'text-[#1D3024] hover:bg-[#FAF8F2] font-medium'
                        }`}
                      >
                        <span
                          className={`text-[11px] font-extrabold tabular-nums w-5 ${
                            active ? 'text-[#C8F19E]' : 'text-[#5A7B3B]'
                          }`}
                        >
                          {String(m.number).padStart(2, '0')}
                        </span>
                        <span className={`flex-1 ${lang === 'hi' ? 'font-hindi' : ''}`}>
                          {m.shortTitle[lang]}
                        </span>
                        <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 2: HARIT RAJASTHAN */}
            <div className="rounded-2xl bg-white border border-[#E4DCC6] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileExpanded(mobileExpanded === 'harit' ? null : 'harit')
                }
                aria-expanded={mobileExpanded === 'harit'}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer"
              >
                <p className={`text-[15px] font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? 'हरित राजस्थान (5 फोकस जिले)' : 'Harit Rajasthan (5 Districts)'}
                </p>
                <ChevronDown
                  className={`w-5 h-5 text-[#154A24] transition-transform ${
                    mobileExpanded === 'harit' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileExpanded === 'harit' && (
                <div className="px-3 pb-3 pt-1 border-t border-[#F0E9D8] space-y-1">
                  <button
                    type="button"
                    onClick={() => go('/harit-rajasthan')}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-[#EEF6E7] text-[#113B19] text-xs font-extrabold flex items-center justify-between cursor-pointer mb-1"
                  >
                    <span>{lang === 'hi' ? 'हरित राजस्थान मानचित्र व अवलोकन' : 'Rajasthan Overview & Map'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go('/harit-bharat')}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-[#FAF6E8] border border-[#DFCFAF] text-[#113B19] text-xs font-extrabold flex items-center justify-between cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'हरित भारत — पैन-इंडिया लोकेशन एक्सप्लोरर' : 'Harit Bharat — Pan-India Explorer'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8E6212]" />
                  </button>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DISTRICTS_DATA.map((d) => (
                      <button
                        key={d.slug}
                        type="button"
                        onClick={() => go(`/harit-rajasthan/${d.slug}`)}
                        className="text-left px-3 py-2.5 rounded-xl bg-[#FAF8F2] text-xs font-bold text-[#153E1E] flex items-center justify-between cursor-pointer"
                      >
                        <span>{d.name[lang]}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#5A7B3B]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: JOIN US (12 FORMS) */}
            <div className="rounded-2xl bg-white border border-[#E4DCC6] overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileExpanded(mobileExpanded === 'join' ? null : 'join')
                }
                aria-expanded={mobileExpanded === 'join'}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer"
              >
                <p className={`text-[15px] font-extrabold text-[#113B19] ${lang === 'hi' ? 'font-hindi' : ''}`}>
                  {lang === 'hi' ? 'हमसे जुड़ें (12 पंजीकरण फॉर्म)' : 'Join GOVEDA (12 Forms)'}
                </p>
                <ChevronDown
                  className={`w-5 h-5 text-[#154A24] transition-transform ${
                    mobileExpanded === 'join' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileExpanded === 'join' && (
                <div className="px-3 pb-3 pt-1 border-t border-[#F0E9D8] space-y-3">
                  <button
                    type="button"
                    onClick={() => go('/join')}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-[#EEF6E7] text-[#113B19] text-xs font-extrabold flex items-center justify-between cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'सभी 12 फॉर्म पोर्टल खोलें' : 'Open All 12 Forms Portal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {JOIN_GROUPS.map((grp) => (
                    <div key={grp.groupEn} className="space-y-1">
                      <p className="text-[11px] font-extrabold text-[#5A7B3B] px-2">
                        {lang === 'hi' ? grp.groupHi : grp.groupEn}
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {grp.items.map((item) => (
                          <button
                            key={item.cat}
                            type="button"
                            onClick={() => go(`/join/${item.cat}`)}
                            className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FAF8F2] text-xs font-semibold text-[#1D3024] flex items-center justify-between cursor-pointer"
                          >
                            <span>
                              {item.num}. {lang === 'hi' ? item.hi : item.en}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Secondary Pages Grid (Aligned with Recommended 10-Item Menu) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {[
                { path: '/training', icon: BookOpen, hi: 'प्रशिक्षण व ज्ञान', en: 'Training & Knowledge' },
                { path: '/projects', icon: Sprout, hi: 'परियोजनाएँ व अभियान', en: 'Projects & Campaigns' },
                { path: '/harit-bharat', icon: Flag, hi: 'सक्रिय अभियान खोजें', en: 'Active Campaigns' },
                { path: '/events', icon: Calendar, hi: 'कार्यक्रम व मीडिया', en: 'Events & Media' },
                { path: '/events/harit-marathon', icon: Trophy, hi: 'हरित मैराथन', en: 'Harit Marathon' },
                { path: '/partnership', icon: Handshake, hi: 'साझेदारी व सहयोग', en: 'Partnership & Donation' },
                { path: '/magazine', icon: FileText, hi: 'गोवेदा पत्रिका', en: 'Magazine' },
                { path: '/contact', icon: PhoneCall, hi: 'संपर्क करें', en: 'Contact Us' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => go(link.path)}
                    className="px-3.5 py-3 rounded-2xl bg-white border border-[#E4DCC6] text-left flex items-center gap-2.5 text-xs font-bold text-[#153E1E] hover:bg-[#F2F8EC] cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#4B8E27] shrink-0" />
                    <span className={lang === 'hi' ? 'font-hindi' : ''}>
                      {lang === 'hi' ? link.hi : link.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pinned Bottom Action Bar inside Mobile Drawer */}
          <div className="p-4 bg-white border-t border-[#E4DCC6] grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => go('/join/farmer')}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#EEF6E7] text-[#113B19] border border-[#7CC042]/40 px-4 py-3 text-xs font-extrabold cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#4B8E27]" />
              <span>{lang === 'hi' ? 'किसान पंजीकरण' : 'Farmer Join'}</span>
            </button>
            <button
              type="button"
              onClick={() => go('/partnership')}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#154A24] text-white px-4 py-3 text-xs font-extrabold cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-[#9EE35B] text-[#9EE35B]" />
              <span>{lang === 'hi' ? 'सहयोग / Donate' : 'Donate Now'}</span>
            </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
