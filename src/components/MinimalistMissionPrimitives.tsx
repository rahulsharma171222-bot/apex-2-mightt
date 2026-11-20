import React, { useState } from 'react';
import { ChevronDown, ShieldAlert, Leaf } from 'lucide-react';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import type { Language } from '../types/goveda';

/* ============================================================================
   1. FLOATING MINIMALIST WATERCOLOR VIGNETTE
      Matches homepage OurTenMissionsShowcase & WhoWeAreShowcase aesthetic:
      isolated hand-painted gouache/watercolor artwork melting effortlessly
      into warm ivory (#FCF8F0) or crisp white (#FFFFFF) via mix-blend-multiply
      and soft radial edge feathering — ZERO boxy frames or stretched walls.
   ============================================================================ */
interface FloatingVignetteProps {
  assetKey: AssetKey;
  alt: string;
  caption?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<FloatingVignetteProps['size']>, string> = {
  sm: 'max-w-[220px]',
  md: 'max-w-[300px] sm:max-w-[340px]',
  lg: 'max-w-[360px] sm:max-w-[430px]',
  xl: 'max-w-[400px] sm:max-w-[500px]',
};

export function FloatingVignette({
  assetKey,
  alt,
  caption,
  size = 'lg',
  className = '',
}: FloatingVignetteProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <figure className={`mx-auto flex flex-col items-center ${SIZE_CLASSES[size]} ${className}`}>
      <div className="relative w-full flex items-center justify-center">
        {!imgFailed ? (
          <img
            src={GENERATED_ASSETS[assetKey]}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-auto object-contain mix-blend-multiply brightness-[1.04] contrast-[1.05] select-none pointer-events-none"
            style={{
              WebkitMaskImage:
                'radial-gradient(ellipse 74% 74% at 50% 50%, #000 52%, transparent 94%)',
              maskImage:
                'radial-gradient(ellipse 74% 74% at 50% 50%, #000 52%, transparent 94%)',
            }}
          />
        ) : (
          <div className="w-full aspect-[4/3] rounded-3xl bg-[#F4F8EE] border border-[#DFCFAF] flex flex-col items-center justify-center p-6 text-center text-[#1B5A32]">
            <Leaf className="w-8 h-8 mb-2 opacity-70" />
            <span className="text-xs font-medium">{alt}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs italic text-[#5B6B60] max-w-[42ch] text-balance leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ============================================================================
   2. OPEN-SKY MINIMALIST HORIZON STRIP
      Matches homepage WhoWeAreShowcase sandstone desert dunes & Footer
      village/trees/windmills — low silhouette with generous breathing sky.
   ============================================================================ */
export type HorizonArtVariant =
  | 'sandstone'
  | 'fort'
  | 'gaushala'
  | 'carbon'
  | 'skills'
  | 'hills';

const HORIZON_MAP: Record<HorizonArtVariant, AssetKey> = {
  sandstone: 'whoWeAreSandstoneHorizon',
  fort: 'scenicFortWindmills',
  gaushala: 'scenicGaushalaWater',
  carbon: 'scenicCarbonAgro',
  skills: 'scenicSkillsCampus',
  hills: 'scenicHills',
};

interface OpenSkyHorizonProps {
  variant?: HorizonArtVariant;
  fadeFrom?: 'cream' | 'white';
  heightClass?: string;
}

export function OpenSkyHorizon({
  variant = 'sandstone',
  fadeFrom = 'cream',
  heightClass = 'h-24 sm:h-32 md:h-40',
}: OpenSkyHorizonProps) {
  const fromColor = fadeFrom === 'cream' ? '#FCF8F0' : '#FFFFFF';
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) return null;

  return (
    <div
      className="pointer-events-none relative w-full overflow-hidden select-none"
      aria-hidden="true"
    >
      <div className={`relative w-full max-w-[1600px] mx-auto ${heightClass}`}>
        <img
          src={GENERATED_ASSETS[HORIZON_MAP[variant]]}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-bottom mix-blend-multiply opacity-85 block"
        />
        <div
          className="absolute inset-x-0 top-0 h-14 sm:h-16"
          style={{
            background: `linear-gradient(to bottom, ${fromColor} 0%, transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================================
   3. MINIMALIST EDITORIAL SECTION HEADING (HOMEPAGE SIGNATURE BRUSHSTROKE)
   ============================================================================ */
interface MinimalistEditorialHeaderProps {
  eyebrow: string;
  titleHi: string;
  titleEn: string;
  leadHi?: string;
  leadEn?: string;
  lang: Language;
  align?: 'left' | 'center';
}

export function MinimalistEditorialHeader({
  eyebrow,
  titleHi,
  titleEn,
  leadHi,
  leadEn,
  lang,
  align = 'left',
}: MinimalistEditorialHeaderProps) {
  const isCenter = align === 'center';
  const primaryTitle = lang === 'hi' ? titleHi : titleEn;
  const secondaryTitle = lang === 'hi' ? titleEn : titleHi;
  const lead = lang === 'hi' ? leadHi : leadEn;

  return (
    <div className={isCenter ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}>
      <div
        className={`flex items-center gap-3 mb-2.5 ${
          isCenter ? 'justify-center' : ''
        }`}
      >
        {isCenter && (
          <span
            className="h-[1px] w-10 bg-gradient-to-l from-[#C68932] to-transparent"
            aria-hidden="true"
          />
        )}
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] text-[#2F6D26]">
          {eyebrow}
        </span>
        <span
          className="h-[1px] w-14 bg-gradient-to-r from-[#2F6D26] to-[#C68932]/60"
          aria-hidden="true"
        />
      </div>

      <h2
        className={`text-2xl sm:text-3xl lg:text-[2.45rem] font-extrabold text-[#153E1E] leading-[1.15] tracking-tight text-balance ${
          lang === 'hi' ? 'font-hindi' : 'font-editorial'
        }`}
      >
        {primaryTitle}
      </h2>

      <p
        className={`mt-1.5 text-sm font-medium text-[#526958] ${
          lang === 'hi' ? '' : 'font-hindi'
        }`}
      >
        {secondaryTitle}
      </p>

      {/* Homepage Signature Tapered Lime-Green Brushstroke Arc */}
      <svg
        viewBox="0 0 264 20"
        fill="none"
        aria-hidden="true"
        className={`mt-2.5 w-40 sm:w-52 h-3.5 ${isCenter ? 'mx-auto' : ''}`}
      >
        <path
          d="M2 14 C72 3 168 1 258 10 C192 9 98 11 4 18 Z"
          fill="#82C341"
        />
      </svg>

      {lead && (
        <p
          className={`mt-4 text-sm sm:text-[15.5px] text-[#2B3A2F] leading-[1.72] font-normal max-w-[68ch] ${
            isCenter ? 'mx-auto' : ''
          } ${lang === 'hi' ? 'font-hindi' : ''}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ============================================================================
   4. STICKY ONE-PAGE ANCHOR NAVIGATION BAR (SINGLE-LINE TABS)
   ============================================================================ */
export interface AnchorTabItem {
  id: string;
  hi: string;
  en: string;
}

interface MissionAnchorNavProps {
  tabs: readonly AnchorTabItem[];
  activeTab: string;
  onSelect: (id: string) => void;
  lang: Language;
  ariaLabel: string;
}

export function MissionAnchorNav({
  tabs,
  activeTab,
  onSelect,
  lang,
  ariaLabel,
}: MissionAnchorNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-[72px] lg:top-[76px] z-30 bg-[#FCF8F0]/95 backdrop-blur-md border-b border-[#DFCFAF]/75"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelect(tab.id)}
                className={`whitespace-nowrap shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#153E1E] text-white'
                    : 'text-[#2D4334] hover:bg-[#EBF4E2] hover:text-[#153E1E]'
                }`}
              >
                {lang === 'hi' ? tab.hi : tab.en}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ============================================================================
   5. EDITORIAL HAIRLINE COLUMNS (WHY IT MATTERS / REALITIES)
      Matches homepage WhyItMattersShowcase vertical hairline columns cleanly,
      with clean symmetrical 2x2 grid on mobile (ZERO zigzags).
   ============================================================================ */
export interface RealityColumnItem {
  num: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
}

export function EditorialRealitiesGrid({
  items,
  lang,
}: {
  items: RealityColumnItem[];
  lang: Language;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
      {items.map((item) => (
        <div
          key={item.num}
          className="pt-4 border-t border-[#DFCFAF] space-y-2"
        >
          <span className="text-xs font-semibold text-[#5A7B3B] tabular-nums">
            {item.num}
          </span>
          <h3
            className={`text-[15.5px] font-bold text-[#153E1E] leading-snug ${
              lang === 'hi' ? 'font-hindi' : ''
            }`}
          >
            {lang === 'hi' ? item.titleHi : item.titleEn}
          </h3>
          <p
            className={`text-[13px] text-[#3B4B40] leading-[1.68] ${
              lang === 'hi' ? 'font-hindi' : ''
            }`}
          >
            {lang === 'hi' ? item.descHi : item.descEn}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
   6. CIRCULAR MEDALLION SEQUENTIAL STEPS (HOMEPAGE WHO WE ARE MEDALLION DNA)
   ============================================================================ */
export interface VisualJourneyStep {
  step: string;
  assetKey: AssetKey;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
}

export function CircularMedallionJourney({
  steps,
  lang,
}: {
  steps: VisualJourneyStep[];
  lang: Language;
}) {
  const colsClass =
    steps.length === 4
      ? 'lg:grid-cols-4'
      : steps.length === 6
      ? 'lg:grid-cols-3'
      : 'lg:grid-cols-5';

  return (
    <div className="relative">
      {steps.length <= 5 && (
        <div
          className="hidden lg:block pointer-events-none absolute top-[62px] left-[10%] right-[10%] h-px border-t border-dashed border-[#82C341]/70 z-0"
          aria-hidden="true"
        />
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${colsClass} gap-7 relative z-10`}>
        {steps.map((st) => (
          <div
            key={st.step}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#FCF8F0] border-2 border-[#DFCFAF] group-hover:border-[#6EB83A] overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]">
                <img
                  src={GENERATED_ASSETS[st.assetKey]}
                  alt={lang === 'hi' ? st.titleHi : st.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-[1.05]"
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#153E1E] text-[#D2F7A6] text-[11px] font-bold tabular-nums">
                {st.step}
              </span>
            </div>

            <h3
              className={`text-sm sm:text-[15px] font-bold text-[#153E1E] leading-snug ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? st.titleHi : st.titleEn}
            </h3>
            <p
              className={`mt-1.5 text-xs sm:text-[13px] text-[#3F5145] leading-relaxed max-w-[26ch] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? st.descHi : st.descEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   7. HONEST SAFEGUARD DISCLOSURE PANEL (ZERO FALSE CLAIMS)
   ============================================================================ */
export function HonestSafeguardBox({
  titleHi,
  titleEn,
  points,
  lang,
}: {
  titleHi: string;
  titleEn: string;
  points: { hi: string; en: string }[];
  lang: Language;
}) {
  return (
    <div className="rounded-2xl bg-[#FFF9EE] border border-[#D98A2B]/35 p-5 sm:p-6 space-y-3">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#A45D09] shrink-0 mt-0.5" aria-hidden="true" />
        <h3
          className={`text-sm sm:text-base font-bold text-[#6E3D04] ${
            lang === 'hi' ? 'font-hindi' : ''
          }`}
        >
          {lang === 'hi' ? titleHi : titleEn}
        </h3>
      </div>
      <ul className="space-y-2 pl-8 list-disc text-xs sm:text-[13.5px] text-[#5C3A10] leading-relaxed">
        {points.map((pt, idx) => (
          <li key={idx} className={lang === 'hi' ? 'font-hindi' : ''}>
            {lang === 'hi' ? pt.hi : pt.en}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================================
   8. MISSION FAQ ACCORDION (ACCESSIBLE DISCLOSURE)
   ============================================================================ */
export interface MissionFaqItem {
  qHi: string;
  qEn: string;
  aHi: string;
  aEn: string;
}

export function MissionFaqAccordion({
  faqs,
  lang,
}: {
  faqs: MissionFaqItem[];
  lang: Language;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#DFCFAF]/80 border-y border-[#DFCFAF]/80">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={faq.qEn} className="py-1">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full text-left py-4 px-2 flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-semibold text-[#5A7B3B] tabular-nums shrink-0">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span
                  className={`text-sm sm:text-[15.5px] font-bold text-[#153E1E] group-hover:text-[#2F6D26] transition-colors ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? faq.qHi : faq.qEn}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#5A7B3B] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="pb-4 pl-9 pr-4">
                <p
                  className={`text-xs sm:text-sm text-[#35463A] leading-[1.72] max-w-[72ch] ${
                    lang === 'hi' ? 'font-hindi' : ''
                  }`}
                >
                  {lang === 'hi' ? faq.aHi : faq.aEn}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
