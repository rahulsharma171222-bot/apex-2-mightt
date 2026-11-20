import React from 'react';
import { ResilientImage } from './ResilientImage';
import { GovedaMissionSvg } from './GovedaIcons';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';

export const SCENIC_PANORAMAS = {
  village: GENERATED_ASSETS.scenicHills,
  fort: GENERATED_ASSETS.scenicFortWindmills,
  carbon: GENERATED_ASSETS.scenicCarbonAgro,
  gaushala: GENERATED_ASSETS.scenicGaushalaWater,
  water: GENERATED_ASSETS.scenicGaushalaWater,
  skills: GENERATED_ASSETS.scenicSkillsCampus,
  sandstone: GENERATED_ASSETS.whoWeAreSandstoneHorizon,
};

export type ScenicVariant =
  | 'village'
  | 'fort'
  | 'carbon'
  | 'gaushala'
  | 'water'
  | 'skills'
  | 'sandstone';

const VARIANT_DEFAULT_ASSET: Record<ScenicVariant, AssetKey> = {
  village: 'haritRajasthan',
  fort: 'heritageSolar',
  carbon: 'carbonFarmer',
  gaushala: 'gaushalaBiogas',
  water: 'waterJohadKund',
  skills: 'youthSkillLab',
  sandstone: 'heritageSolar',
};

const VARIANT_HORIZON_ASSET: Record<ScenicVariant, AssetKey> = {
  village: 'scenicHills',
  fort: 'scenicFortWindmills',
  carbon: 'scenicCarbonAgro',
  gaushala: 'scenicGaushalaWater',
  water: 'scenicGaushalaWater',
  skills: 'scenicSkillsCampus',
  sandstone: 'whoWeAreSandstoneHorizon',
};

/**
 * Rich Multi-Layered Panoramic Vector Landscape Artwork.
 * Uses detailed 2D editorial vector landscape illustrations (banyan canopies, green hills,
 * Rajasthan sandstone forts, chhatris, stepwells, solar arrays, and rural eco-cottages)
 * feathered seamlessly into the page background with atmospheric mist dissolves.
 */
export function ThemeVectorLandscapeSvg({
  variant = 'village',
  className = 'w-full h-24 sm:h-36',
  topFadeHex = '#FFFFFF',
  bottomFadeHex = '#FFFFFF',
}: {
  variant?: ScenicVariant;
  className?: string;
  topFadeHex?: string;
  bottomFadeHex?: string;
}) {
  const horizonAssetKey = VARIANT_HORIZON_ASSET[variant] || 'scenicHills';

  return (
    <div
      className={`relative w-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <ResilientImage
        assetKey={horizonAssetKey}
        alt=""
        className="w-full h-full object-cover object-bottom mix-blend-multiply"
      />
      {/* Top Atmospheric Mist Dissolve so upper ridge/canopy melts from background */}
      <div
        className="absolute inset-x-0 top-0 h-10 sm:h-14"
        style={{
          background: `linear-gradient(to bottom, ${topFadeHex} 0%, transparent 100%)`,
        }}
      />
      {/* Side Vignettes so wide edges dissolve organically */}
      <div
        className="absolute inset-y-0 left-0 w-10 sm:w-24"
        style={{
          background: `linear-gradient(to right, ${topFadeHex} 0%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-10 sm:w-24"
        style={{
          background: `linear-gradient(to left, ${topFadeHex} 0%, transparent 100%)`,
        }}
      />
      {/* Soft Mist Feather + Organic Curve Along Bottom Seam */}
      <div
        className="absolute inset-x-0 bottom-0 h-6 sm:h-8"
        style={{
          background: `linear-gradient(to top, ${bottomFadeHex} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

interface ScenicHorizonStripProps {
  variant?: ScenicVariant;
  className?: string;
  opacityClass?: string;
  topFadeHex?: string;
  bottomFadeHex?: string;
}

/**
 * Seamless Panoramic Landscape Horizon Divider.
 * Renders rich multi-layered 2D vector landscape artwork dissolved smoothly between sections.
 */
export function ScenicHorizonStrip({
  variant = 'village',
  className = '',
  opacityClass = 'opacity-100',
  topFadeHex = '#FFFFFF',
  bottomFadeHex = '#FAFBF8',
}: ScenicHorizonStripProps) {
  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none select-none ${opacityClass} ${className}`}
      aria-hidden="true"
    >
      <div className="max-w-[1600px] mx-auto relative">
        <ThemeVectorLandscapeSvg
          variant={variant}
          topFadeHex={topFadeHex}
          bottomFadeHex={bottomFadeHex}
          className="w-full h-24 sm:h-36 lg:h-44"
        />
      </div>
    </div>
  );
}

interface SeamlessPhotoCanvasProps {
  assetKey: AssetKey;
  alt: string;
  iconName?: string;
  scenicVariant?: ScenicVariant;
  kicker?: string;
  title: string;
  description?: string;
  imageHeightClass?: string;
  className?: string;
  actions?: React.ReactNode;
}

/**
 * Integrated "Oneness" Vector Illustration + Frosted Canvas Showcase:
 * Eliminates harsh 4-corner photo boxes. The rich 2D vector illustration dissolves
 * through a feathered mist and an organic vector wave directly into the frosted text canvas.
 */
export function SeamlessPhotoCanvas({
  assetKey,
  alt,
  iconName,
  kicker,
  title,
  description,
  imageHeightClass = 'h-72 sm:h-88',
  className = '',
  actions,
}: SeamlessPhotoCanvasProps) {
  return (
    <div
      className={`relative rounded-[32px] overflow-hidden bg-gradient-to-b from-white via-white to-white shadow-[0_20px_50px_-24px_rgba(20,69,39,0.18)] border border-[#479D27]/18 ${className}`}
    >
      {/* Rich Vector Illustration Area with Feathered Sky & Bottom Wave */}
      <div className={`relative w-full ${imageHeightClass} overflow-hidden bg-white`}>
        <ResilientImage
          assetKey={assetKey}
          alt={alt}
          className="w-full h-full object-cover object-center"
        />
        {/* Soft Top & Side Atmospheric Feather Vignette */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(255,255,255,0.28)_100%)]"
          aria-hidden="true"
        />
        {/* Rising Mist Gradient into the Text Panel */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent"
          aria-hidden="true"
        />
        {/* Organic Vector Ribbon Wave Blending Illustration into Text Canvas */}
        <svg
          viewBox="0 0 800 44"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 -bottom-px w-full h-7 sm:h-9 block z-10"
          aria-hidden="true"
        >
          <path
            d="M0 24 Q200 2 420 22 T800 14 L800 44 L0 44 Z"
            fill="#68B836"
            fillOpacity="0.25"
          />
          <path
            d="M0 32 Q220 12 450 30 T800 22 L800 44 L0 44 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Frosted Blur Transition Band Rising Smoothly Out of the Illustration */}
      <div className="relative -mt-6 z-20 mx-2 sm:mx-3 mb-2 sm:mb-3 rounded-[26px] backdrop-blur-md bg-gradient-to-b from-white/88 via-white/96 to-white px-5 sm:px-6 pt-5 pb-5">
        {iconName && (
          <div className="absolute -top-7 right-5 w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_8px_22px_-6px_rgba(20,69,39,0.22)] flex items-center justify-center p-2 border border-[#479D27]/25">
            <GovedaMissionSvg iconName={iconName} className="w-10 h-10" />
          </div>
        )}

        {kicker && (
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2E7D32] pr-14 flex items-center gap-2">
            <span>{kicker}</span>
            <span className="inline-block w-6 h-[1.5px] bg-[#76C032]" aria-hidden="true" />
          </p>
        )}
        <h3 className="text-lg sm:text-xl font-bold text-[#144527] mt-1 leading-snug pr-12">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-[#35463B] mt-2 leading-relaxed">
            {description}
          </p>
        )}
        {actions && <div className="mt-4 flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

interface SeamlessInlinePhotoProps {
  assetKey: AssetKey;
  alt: string;
  className?: string;
  mistTone?: 'white' | 'sage';
}

/**
 * Feather-blended inline vector illustration with organic SVG wave contour
 * so mission cards, district cards, and section visuals feel woven into the page.
 */
export function SeamlessInlinePhoto({
  assetKey,
  alt,
  className = 'h-44 w-full',
  mistTone = 'white',
}: SeamlessInlinePhotoProps) {
  const fillHex = mistTone === 'sage' ? '#FAFBF8' : '#FFFFFF';
  const mistClass =
    mistTone === 'sage'
      ? 'from-[#FAFBF8]/90 via-[#FAFBF8]/20 to-transparent'
      : 'from-white/90 via-white/20 to-transparent';

  return (
    <div className={`relative rounded-[26px] overflow-hidden bg-white ${className}`}>
      <ResilientImage
        assetKey={assetKey}
        alt={alt}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t ${mistClass}`}
        aria-hidden="true"
      />
      {/* Organic Vector Wave Blending Illustration Edge Into Card Body */}
      <svg
        viewBox="0 0 400 28"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-px w-full h-4 sm:h-5 block"
        aria-hidden="true"
      >
        <path
          d="M0 16 Q110 2 215 15 T400 10 L400 28 L0 28 Z"
          fill="#68B836"
          fillOpacity="0.3"
        />
        <path
          d="M0 21 Q130 8 240 20 T400 16 L400 28 L0 28 Z"
          fill={fillHex}
        />
      </svg>
    </div>
  );
}

interface ScenicPageHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
  iconName?: string;
  variant?: ScenicVariant;
  assetKey?: AssetKey;
  action?: React.ReactNode;
}

/**
 * Amalgamated Institutional Page Hero:
 * Fuses a feathered thematic 2D vector illustration, rich panoramic vector landscape strip,
 * frosted glassmorphic mission emblem, and bilingual typography into ONE seamless composition.
 */
export function ScenicPageHeader({
  kicker,
  title,
  subtitle,
  iconName = 'Sprout',
  variant = 'fort',
  assetKey,
  action,
}: ScenicPageHeaderProps) {
  const resolvedAsset = assetKey ?? VARIANT_DEFAULT_ASSET[variant];

  return (
    <section className="relative bg-gradient-to-b from-[#F4FAF2] via-[#FAFDF9] to-white pt-6 sm:pt-10 pb-0 overflow-hidden">
      {/* Feathered Background Vector Illustration Amalgamated on Right / Top */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[56%] opacity-35 sm:opacity-55 select-none overflow-hidden"
        aria-hidden="true"
      >
        <ResilientImage
          assetKey={resolvedAsset}
          alt=""
          className="w-full h-full object-cover object-center scale-102 mix-blend-multiply"
        />
        {/* Multi-directional Mist Mask so Illustration Has Zero Hard Edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4FAF2] via-[#F4FAF2]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-[#F4FAF2]/70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl backdrop-blur-[2px] bg-white/50 sm:bg-transparent rounded-3xl p-4 sm:p-0">
            <div className="inline-flex items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1E5B2A]">
                {kicker}
              </span>
              <span className="h-[1.5px] w-10 bg-[#76C032]" aria-hidden="true" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#144527] leading-tight text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-[#26352B] leading-relaxed max-w-2xl font-medium">
                {subtitle}
              </p>
            )}
            {action && <div className="pt-2 flex flex-wrap gap-2.5">{action}</div>}
          </div>

          <div className="hidden sm:flex items-center justify-center w-22 h-22 rounded-[28px] bg-white/90 backdrop-blur-md shadow-[0_14px_34px_-10px_rgba(20,69,39,0.22)] border border-[#479D27]/25 shrink-0 p-4">
            <GovedaMissionSvg iconName={iconName} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Rich Multi-Layered Panoramic Vector Landscape Bridging Into Page Content */}
      <div className="relative z-10 mt-2 pointer-events-none select-none" aria-hidden="true">
        <ThemeVectorLandscapeSvg
          variant={variant}
          className="w-full max-w-[1600px] mx-auto h-20 sm:h-28 lg:h-32"
        />
      </div>
    </section>
  );
}
