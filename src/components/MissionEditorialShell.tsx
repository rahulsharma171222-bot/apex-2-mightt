import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { Language } from '../types/goveda';

/* ============================================================================
   1. MISSION EDITORIAL HERO (Seamless Botanical Split Hero)
   - Displays the user's uploaded hero illustration cleanly on the right half
     without any baked-in Hindi text bleeding through, while rendering crisp
     bilingual typography and working buttons on the warm ivory left half.
   ============================================================================ */

export interface MissionEditorialHeroProps {
  lang: Language;
  eyebrow: string;
  titleLine1Hi: string;
  titleLine2Hi: string;
  titleLine1En: string;
  titleLine2En: string;
  taglineHi: string;
  taglineEn: string;
  summaryHi: string;
  summaryEn: string;
  primaryCtaHi: string;
  primaryCtaEn: string;
  secondaryCtaHi: string;
  secondaryCtaEn: string;
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
  imageSrc: string;
  imageAltHi: string;
  imageAltEn: string;
  /**
   * When true, the uploaded source image has baked-in typography on its left
   * ~45% and the pure botanical illustration on its right ~55%. We frame ONLY
   * the pure right-hand artwork seamlessly so zero baked text ever leaks.
   */
  cropRightArtworkOnly?: boolean;
  /** Optional custom width multiplier for right-artwork framing (default 185%) */
  artworkZoomPercent?: number;
  extraAction?: React.ReactNode;
}

export function MissionEditorialHero({
  lang,
  eyebrow,
  titleLine1Hi,
  titleLine2Hi,
  titleLine1En,
  titleLine2En,
  taglineHi,
  taglineEn,
  summaryHi,
  summaryEn,
  primaryCtaHi,
  primaryCtaEn,
  secondaryCtaHi,
  secondaryCtaEn,
  onPrimaryCta,
  onSecondaryCta,
  imageSrc,
  imageAltHi,
  imageAltEn,
  cropRightArtworkOnly = true,
  artworkZoomPercent = 186,
  extraAction,
}: MissionEditorialHeroProps) {
  return (
    <section className="relative bg-[#FAF9F4] overflow-hidden border-b border-[#E5DEC9]">
      {/* Mobile-only right-anchored botanical artwork so mobile mirrors the laptop split composition */}
      <div className="lg:hidden pointer-events-none absolute inset-y-0 right-0 w-[62%] sm:w-[58%] overflow-hidden">
        {cropRightArtworkOnly ? (
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            loading="eager"
            style={{ width: `${artworkZoomPercent}%` }}
            className="absolute right-0 top-0 max-w-none h-full object-cover object-right select-none"
          />
        ) : (
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="w-full h-full object-cover object-right select-none"
          />
        )}
        {/* Smooth warm-ivory horizontal feather so left typography stays 100% crisp like desktop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #FAF9F4 0%, rgba(250,249,244,0.95) 26%, rgba(250,249,244,0.58) 54%, rgba(250,249,244,0.12) 84%, rgba(250,249,244,0) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-10"
          style={{
            background: 'linear-gradient(0deg, #FAF9F4 0%, rgba(250,249,244,0) 100%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[300px] sm:min-h-[380px] lg:min-h-[500px] py-7 sm:py-10 lg:py-12">
          {/* Left Editorial Typography Column — same visual hierarchy & left-anchored framing on mobile & laptop */}
          <div className="w-[78%] sm:w-[66%] lg:w-full lg:col-span-6 relative z-10 space-y-3 sm:space-y-4 lg:space-y-5">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <span className="h-[1.5px] w-3.5 sm:w-8 bg-[#C48E28] shrink-0" aria-hidden="true" />
              <span className="text-[8.5px] sm:text-[11px] font-bold tracking-[0.08em] sm:tracking-[0.18em] uppercase text-[#204229] whitespace-nowrap">
                {eyebrow}
              </span>
              <span className="hidden sm:inline-block h-[1.5px] w-8 bg-[#C48E28] shrink-0" aria-hidden="true" />
            </div>

            {lang === 'hi' ? (
              <h1 className="font-hindi font-extrabold tracking-tight leading-[1.12] text-[1.68rem] sm:text-[2.65rem] lg:text-[3.55rem]">
                <span className="block text-[#124520]">{titleLine1Hi}</span>
                <span className="block text-[#356F20]">{titleLine2Hi}</span>
              </h1>
            ) : (
              <h1 className="font-editorial font-extrabold tracking-tight leading-[1.08] text-[1.6rem] sm:text-[2.55rem] lg:text-[3.35rem]">
                <span className="block text-[#124520]">{titleLine1En}</span>
                <span className="block text-[#356F20]">{titleLine2En}</span>
              </h1>
            )}

            {/* Golden-Botanical Signature Brush Accent */}
            <svg
              viewBox="0 0 340 20"
              className="w-40 sm:w-56 lg:w-68 h-3 sm:h-4 -mt-1"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="missionHeroSwoosh" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D19A24" />
                  <stop offset="58%" stopColor="#86B232" />
                  <stop offset="100%" stopColor="#266828" />
                </linearGradient>
              </defs>
              <path
                d="M4,14 C105,3 224,18 334,7"
                fill="none"
                stroke="url(#missionHeroSwoosh)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            <p className="italic font-semibold text-[#1E5426] text-[12px] sm:text-[15px] lg:text-[15.5px] leading-snug tracking-wide">
              {lang === 'hi' ? taglineHi : taglineEn}
            </p>

            <p
              className={`text-[12px] sm:text-[15px] lg:text-[17px] text-[#223828] leading-[1.58] sm:leading-[1.72] max-w-[54ch] ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? summaryHi : summaryEn}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
              <button
                type="button"
                onClick={onPrimaryCta}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#144721] hover:bg-[#0D3417] text-white px-3.5 sm:px-6 py-2 sm:py-3 text-[11.5px] sm:text-sm font-bold shadow-[0_10px_22px_-10px_rgba(20,71,33,0.55)] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'hi' ? primaryCtaHi : primaryCtaEn}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onSecondaryCta}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/95 hover:bg-[#F3F6EE] text-[#144721] border border-[#1E5629]/35 px-3 sm:px-5 py-2 sm:py-3 text-[11.5px] sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'hi' ? secondaryCtaHi : secondaryCtaEn}</span>
              </button>

              {extraAction}
            </div>
          </div>

          {/* Desktop Right Botanical Artwork Showcase Column */}
          <div className="hidden lg:block lg:col-span-6 relative">
            <div className="relative w-full aspect-[5/4] rounded-3xl overflow-hidden bg-[#FAF9F4]">
              {cropRightArtworkOnly ? (
                <img
                  src={imageSrc}
                  alt={lang === 'hi' ? imageAltHi : imageAltEn}
                  loading="eager"
                  style={{ width: `${artworkZoomPercent}%` }}
                  className="absolute right-0 top-0 max-w-none h-full object-cover object-right select-none"
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={lang === 'hi' ? imageAltHi : imageAltEn}
                  loading="eager"
                  className="w-full h-full object-cover object-center select-none"
                />
              )}

              {/* Subtle ivory edge feathering so the artwork sits natively on the cream paper */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-20"
                style={{
                  background:
                    'linear-gradient(90deg, #FAF9F4 0%, rgba(250,249,244,0.65) 45%, rgba(250,249,244,0) 100%)',
                }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
                style={{
                  background:
                    'linear-gradient(0deg, #FAF9F4 0%, rgba(250,249,244,0) 100%)',
                }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-8"
                style={{
                  background:
                    'linear-gradient(180deg, #FAF9F4 0%, rgba(250,249,244,0) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   2. EDITORIAL SECTION HEADING (Clean Numbered Institutional Style)
   ============================================================================ */

export function EditorialSectionHeader({
  index,
  kickerHi,
  kickerEn,
  titleHi,
  titleEn,
  leadHi,
  leadEn,
  lang,
}: {
  index: string;
  kickerHi: string;
  kickerEn: string;
  titleHi: string;
  titleEn: string;
  leadHi?: string;
  leadEn?: string;
  lang: Language;
}) {
  return (
    <div className="max-w-3xl space-y-2.5">
      <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#2E6F36]">
        {index} · {lang === 'hi' ? kickerHi : kickerEn}
      </p>
      <h2
        className={`text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#124520] leading-[1.2] [text-wrap:balance] ${
          lang === 'hi' ? 'font-hindi' : 'font-editorial'
        }`}
      >
        {lang === 'hi' ? titleHi : titleEn}
      </h2>
      {(leadHi || leadEn) && (
        <p
          className={`text-sm sm:text-base text-[#364B3C] leading-[1.7] ${
            lang === 'hi' ? 'font-hindi' : ''
          }`}
        >
          {lang === 'hi' ? leadHi : leadEn}
        </p>
      )}
    </div>
  );
}

/* ============================================================================
   3. GOVEDA 7-STEP SCIENTIFIC METHODOLOGY BAND (PDF PART 1)
   Research -> Awareness -> Community Participation -> Pilot -> Measurement -> Verification -> Expansion
   ============================================================================ */

const SEVEN_STEPS = [
  { num: '01', hi: 'अध्ययन', en: 'Research' },
  { num: '02', hi: 'जागरूकता', en: 'Awareness' },
  { num: '03', hi: 'जनभागीदारी', en: 'Participation' },
  { num: '04', hi: 'पायलट मॉडल', en: 'Pilot Project' },
  { num: '05', hi: 'मापन', en: 'Measurement' },
  { num: '06', hi: 'स्वतंत्र सत्यापन', en: 'Verification' },
  { num: '07', hi: 'विस्तार', en: 'Expansion' },
];

export function GovedaSevenStepModelBand({ lang }: { lang: Language }) {
  return (
    <section className="bg-white border-b border-[#E5DEC9] py-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs font-bold tracking-[0.14em] uppercase text-[#144721]">
            {lang === 'hi'
              ? 'GOVEDA की चरणबद्ध वैज्ञानिक कार्यप्रणाली (2026–2030)'
              : 'GOVEDA Step-by-Step Scientific Execution Model (2026–2030)'}
          </p>
          <p className="text-xs text-[#546458]">
            {lang === 'hi'
              ? 'प्रस्तावित गतिविधियाँ — बिना सत्यापन के उपलब्धि के रूप में प्रदर्शित नहीं की जातीं'
              : 'Proposed mission roadmap — verified on ground before reporting as achievement'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {SEVEN_STEPS.map((s) => (
            <div
              key={s.num}
              className="rounded-xl bg-[#FAF9F4] border border-[#E6DFCE] px-3 py-2.5 flex items-center gap-2.5"
            >
              <span className="text-xs font-extrabold text-[#B57D1E] tabular-nums">
                {s.num}
              </span>
              <span
                className={`text-xs sm:text-[13px] font-bold text-[#144721] ${
                  lang === 'hi' ? 'font-hindi' : ''
                }`}
              >
                {lang === 'hi' ? s.hi : s.en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   4. EDITORIAL SAFEGUARD CALLOUT (Clean Hairline Box, Zero Thick Left Border)
   ============================================================================ */

export function EditorialSafeguardCallout({
  titleHi,
  titleEn,
  bodyHi,
  bodyEn,
  lang,
}: {
  titleHi: string;
  titleEn: string;
  bodyHi: string;
  bodyEn: string;
  lang: Language;
}) {
  return (
    <div className="rounded-2xl bg-[#FBF7EA] border border-[#E2D2A8] p-5 sm:p-6 flex items-start gap-3.5">
      <div className="w-9 h-9 rounded-xl bg-[#EFE4C3] text-[#7A5410] flex items-center justify-center shrink-0 mt-0.5">
        <ShieldCheck className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3
          className={`text-sm sm:text-[15px] font-extrabold text-[#573B08] ${
            lang === 'hi' ? 'font-hindi' : ''
          }`}
        >
          {lang === 'hi' ? titleHi : titleEn}
        </h3>
        <p
          className={`text-xs sm:text-sm text-[#4F4326] leading-relaxed ${
            lang === 'hi' ? 'font-hindi' : ''
          }`}
        >
          {lang === 'hi' ? bodyHi : bodyEn}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   5. LARGE ILLUSTRATION FRAME (Clean Museum Frame for Explanatory SVGs)
   ============================================================================ */

export function ExplanatorySvgFrame({
  captionHi,
  captionEn,
  lang,
  children,
}: {
  captionHi: string;
  captionEn: string;
  lang: Language;
  children: React.ReactNode;
}) {
  return (
    <figure className="rounded-3xl bg-white border border-[#E5DEC9] overflow-hidden shadow-[0_14px_40px_-28px_rgba(20,71,33,0.18)]">
      <div className="p-3 sm:p-5 lg:p-6 bg-gradient-to-b from-[#FCFBF7] to-white">
        {children}
      </div>
      <figcaption
        className={`px-5 sm:px-6 py-3.5 border-t border-[#ECE5D5] bg-[#FAF9F4] text-xs sm:text-[13px] text-[#4A5E50] ${
          lang === 'hi' ? 'font-hindi' : ''
        }`}
      >
        {lang === 'hi' ? captionHi : captionEn}
      </figcaption>
    </figure>
  );
}

/* ============================================================================
   6. QUIET INSTITUTIONAL PARTICIPATION INVITATION (NO Embedded Forms!)
   ============================================================================ */

export function MissionQuietJoinBanner({
  lang,
  titleHi,
  titleEn,
  descHi,
  descEn,
  ctaHi,
  ctaEn,
  onJoin,
  secondaryHi,
  secondaryEn,
  onSecondary,
}: {
  lang: Language;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  ctaHi: string;
  ctaEn: string;
  onJoin: () => void;
  secondaryHi?: string;
  secondaryEn?: string;
  onSecondary?: () => void;
}) {
  return (
    <section className="py-14 bg-[#FAF9F4] border-t border-[#E5DEC9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="rounded-3xl bg-[#134420] text-white p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#C7E69C]">
              {lang === 'hi' ? 'जन-सहभागिता · GOVEDA मिशन' : 'COMMUNITY PARTICIPATION · GOVEDA'}
            </p>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold leading-tight ${
                lang === 'hi' ? 'font-hindi' : 'font-editorial'
              }`}
            >
              {lang === 'hi' ? titleHi : titleEn}
            </h2>
            <p
              className={`text-sm sm:text-base text-white/85 leading-relaxed ${
                lang === 'hi' ? 'font-hindi' : ''
              }`}
            >
              {lang === 'hi' ? descHi : descEn}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onJoin}
              className="inline-flex items-center gap-2 rounded-full bg-[#92CA47] hover:bg-[#A3D959] text-[#0E2E15] px-6 py-3 text-sm font-extrabold transition-colors cursor-pointer"
            >
              <span>{lang === 'hi' ? ctaHi : ctaEn}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            {secondaryHi && secondaryEn && onSecondary && (
              <button
                type="button"
                onClick={onSecondary}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-3 text-sm font-bold transition-colors cursor-pointer"
              >
                <span>{lang === 'hi' ? secondaryHi : secondaryEn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
