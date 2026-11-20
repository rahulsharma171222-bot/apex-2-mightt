import React, { useState } from 'react';
import { ResilientImage } from './ResilientImage';
import type { AssetKey } from '../data/assets';
import type { Language } from '../types/goveda';

/* ============================================================================
   INTERACTIVE EXPLANATORY PROCESS DIAGRAM ENGINE
   Combines high-resolution 2.5D / 3D isometric & cutaway artwork with:
   - Colour-coded SVG directional flow lines (subtle motion-safe animation)
   - Click / tap / hover numbered hotspot markers positioned on real equipment
   - Clean HTML/CSS bilingual callout panel (Input → Process → Output → Use)
   ============================================================================ */

export interface DiagramHotspot {
  id: string;
  number: string;
  /** X position on a 0–1000 coordinate system */
  x: number;
  /** Y position on a 0–height coordinate system */
  y: number;
  color: string;
  hiTitle: string;
  enTitle: string;
  hiShort: string;
  enShort: string;
  hiInput?: string;
  enInput?: string;
  hiProcess?: string;
  enProcess?: string;
  hiOutput?: string;
  enOutput?: string;
  hiUse?: string;
  enUse?: string;
}

export interface DiagramFlowPath {
  id: string;
  /** SVG path `d` in the same 0–1000 × 0–viewHeight coordinate space */
  d: string;
  color: string;
  /** Hotspot IDs that highlight this flow path when selected */
  relatedIds: string[];
  labelHi?: string;
  labelEn?: string;
}

export interface FlowLegendItem {
  color: string;
  hi: string;
  en: string;
}

interface InteractiveProcessDiagramProps {
  lang: Language;
  assetKey: AssetKey;
  imageAltHi: string;
  imageAltEn: string;
  hotspots: DiagramHotspot[];
  flows: DiagramFlowPath[];
  legend: FlowLegendItem[];
  /** Height of the SVG viewBox relative to width 1000 (default 562 for 16:9) */
  viewHeight?: number;
  /** Optional aspect-ratio class and object-position for surgical edge cropping */
  aspectClass?: string;
  objectPosition?: string;
  captionHi: string;
  captionEn: string;
  darkSurface?: boolean;
}

export function InteractiveProcessDiagram({
  lang,
  assetKey,
  imageAltHi,
  imageAltEn,
  hotspots,
  flows,
  legend,
  viewHeight = 562,
  aspectClass = 'aspect-[16/9]',
  objectPosition = 'object-center',
  captionHi,
  captionEn,
  darkSurface = false,
}: InteractiveProcessDiagramProps) {
  const [activeId, setActiveId] = useState<string>(hotspots[0]?.id ?? '');
  const hi = lang === 'hi';
  const active = hotspots.find((h) => h.id === activeId) ?? hotspots[0];

  const cardSurface = darkSurface
    ? 'bg-[#0E3122] border-white/15 text-white'
    : 'bg-white border-[#DFD8C4] text-[#26352E]';

  return (
    <div className={`rounded-3xl border overflow-hidden shadow-[0_20px_50px_-28px_rgba(18,61,42,0.22)] ${cardSurface}`}>
      {/* Legend & Interaction Hint Header */}
      <div
        className={`px-5 sm:px-7 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
          darkSurface
            ? 'border-white/10 bg-[#0B281B]'
            : 'border-[#EAE4D3] bg-[#FAF8F1]'
        }`}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {legend.map((item) => (
            <span
              key={item.en}
              className={`inline-flex items-center gap-2 text-xs font-bold ${
                darkSurface ? 'text-white/85' : 'text-[#26352E]'
              }`}
            >
              <span
                className="w-5 h-[3px] rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className={hi ? 'font-hindi' : ''}>{hi ? item.hi : item.en}</span>
            </span>
          ))}
        </div>
        <span
          className={`text-[11.5px] font-semibold ${
            darkSurface ? 'text-[#F3BD42]' : 'text-[#17834D]'
          }`}
        >
          {hi
            ? 'किसी भी नंबर (01–0' + hotspots.length + ') पर क्लिक या टैप करें'
            : 'Click or tap any numbered marker (01–0' + hotspots.length + ')'}
        </span>
      </div>

      {/* Main 3D / 2.5D Artwork Stage with Aligned SVG Flow Lines & Numbered Hotspots */}
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#FAF8F1]`}>
        <ResilientImage
          assetKey={assetKey}
          alt={hi ? imageAltHi : imageAltEn}
          className="w-full h-full object-cover select-none"
          objectPosition={objectPosition}
        />

        {/* SVG Directional Flow Paths + Subtle Animated Arrows */}
        <svg
          viewBox={`0 0 1000 ${viewHeight}`}
          className="pointer-events-none absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            {flows.map((flow) => (
              <marker
                key={`mk-${flow.id}`}
                id={`arrow-${assetKey}-${flow.id}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5.5"
                markerHeight="5.5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.2 L 8.5 5 L 0 8.8 z" fill={flow.color} />
              </marker>
            ))}
          </defs>

          {flows.map((flow) => {
            const isHighlighted = flow.relatedIds.includes(active?.id ?? '');
            return (
              <g key={flow.id}>
                {/* Crisp Halo Under-Stroke for Instant Visibility on Detailed 3D Artwork */}
                <path
                  d={flow.d}
                  fill="none"
                  stroke="#FAF8F1"
                  strokeOpacity={isHighlighted ? 0.85 : 0.45}
                  strokeWidth={isHighlighted ? 8 : 5.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Colour-Coded Animated Directional Flow Path */}
                <path
                  d={flow.d}
                  fill="none"
                  stroke={flow.color}
                  strokeOpacity={isHighlighted ? 0.98 : 0.62}
                  strokeWidth={isHighlighted ? 4.2 : 2.8}
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd={`url(#arrow-${assetKey}-${flow.id})`}
                  className="motion-safe:animate-orbit-dash"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive HTML Numbered Callout Pins */}
        {hotspots.map((spot) => {
          const isActive = spot.id === active?.id;
          const leftPct = (spot.x / 1000) * 100;
          const topPct = (spot.y / viewHeight) * 100;

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => setActiveId(spot.id)}
              onMouseEnter={() => setActiveId(spot.id)}
              aria-pressed={isActive}
              aria-label={`${spot.number} ${hi ? spot.hiTitle : spot.enTitle}`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                backgroundColor: isActive ? spot.color : '#123D2A',
                borderColor: '#FAF8F1',
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 text-white font-extrabold text-[11px] sm:text-xs tabular-nums flex items-center justify-center transition-transform duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F3BD42] ${
                isActive
                  ? 'scale-115 shadow-[0_0_0_6px_rgba(250,248,241,0.55),0_10px_22px_rgba(18,61,42,0.45)]'
                  : 'hover:scale-108 shadow-[0_6px_14px_rgba(18,61,42,0.38)] opacity-95'
              }`}
            >
              {spot.number}
            </button>
          );
        })}
      </div>

      {/* Interactive Explanatory Detail Inspector (Pure Editable HTML/CSS — Crisp Hindi & English) */}
      {active && (
        <div
          className={`p-5 sm:p-7 border-t space-y-5 ${
            darkSurface
              ? 'border-white/10 bg-[#123D2A]'
              : 'border-[#EAE4D3] bg-[#FAF8F1]'
          }`}
        >
          {/* Active Stage Spotlight */}
          <div
            className={`rounded-2xl p-5 sm:p-6 border ${
              darkSurface
                ? 'bg-[#0C2C1E] border-white/15'
                : 'bg-white border-[#DFD8C4]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-extrabold tabular-nums shrink-0"
                    style={{ backgroundColor: active.color }}
                  >
                    {active.number}
                  </span>
                  <h3
                    className={`text-lg sm:text-xl font-extrabold leading-snug ${
                      darkSurface ? 'text-white' : 'text-[#123D2A]'
                    } ${hi ? 'font-hindi' : 'font-editorial'}`}
                  >
                    {hi ? active.hiTitle : active.enTitle}
                  </h3>
                </div>
                <p
                  className={`text-sm sm:text-[15.5px] leading-[1.7] ${
                    darkSurface ? 'text-white/85' : 'text-[#26352E]'
                  } ${hi ? 'font-hindi' : ''}`}
                >
                  {hi ? active.hiShort : active.enShort}
                </p>
              </div>
              <span
                className={`text-[11px] font-bold tracking-[0.14em] uppercase shrink-0 ${
                  darkSurface ? 'text-[#F3BD42]' : 'text-[#76523A]'
                }`}
              >
                {hi ? active.enTitle : active.hiTitle}
              </span>
            </div>

            {/* Structured 4-Part Process Breakdown (Input → Inside → Output → Use) */}
            {(active.hiInput || active.hiProcess || active.hiOutput || active.hiUse) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#E6DFCE]/60">
                {active.hiInput && (
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#76523A]">
                      {hi ? '1. क्या जाता है (Input)' : '1. Input'}
                    </p>
                    <p
                      className={`text-xs sm:text-[13px] leading-relaxed ${
                        darkSurface ? 'text-white/90' : 'text-[#26352E]'
                      } ${hi ? 'font-hindi' : ''}`}
                    >
                      {hi ? active.hiInput : active.enInput}
                    </p>
                  </div>
                )}
                {active.hiProcess && (
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#17834D]">
                      {hi ? '2. अंदर क्या होता है' : '2. Inside Process'}
                    </p>
                    <p
                      className={`text-xs sm:text-[13px] leading-relaxed ${
                        darkSurface ? 'text-white/90' : 'text-[#26352E]'
                      } ${hi ? 'font-hindi' : ''}`}
                    >
                      {hi ? active.hiProcess : active.enProcess}
                    </p>
                  </div>
                )}
                {active.hiOutput && (
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#29B6D8]">
                      {hi ? '3. क्या बनता है (Output)' : '3. Useful Output'}
                    </p>
                    <p
                      className={`text-xs sm:text-[13px] leading-relaxed ${
                        darkSurface ? 'text-white/90' : 'text-[#26352E]'
                      } ${hi ? 'font-hindi' : ''}`}
                    >
                      {hi ? active.hiOutput : active.enOutput}
                    </p>
                  </div>
                )}
                {active.hiUse && (
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#D2951B]">
                      {hi ? '4. कहाँ उपयोग होता है' : '4. Practical Use'}
                    </p>
                    <p
                      className={`text-xs sm:text-[13px] leading-relaxed ${
                        darkSurface ? 'text-white/90' : 'text-[#26352E]'
                      } ${hi ? 'font-hindi' : ''}`}
                    >
                      {hi ? active.hiUse : active.enUse}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All Numbered Stage Selectors — Accessible Grid for Desktop & Mobile Tap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {hotspots.map((spot) => {
              const isSelected = spot.id === active.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveId(spot.id)}
                  className={`text-left rounded-xl px-4 py-3 border transition-colors cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? darkSurface
                        ? 'bg-[#17834D] border-[#75B843] text-white'
                        : 'bg-[#123D2A] border-[#123D2A] text-white'
                      : darkSurface
                        ? 'bg-white/5 border-white/10 text-white/85 hover:bg-white/10'
                        : 'bg-white border-[#E5DEC9] text-[#26352E] hover:bg-[#F2F6EE]'
                  }`}
                >
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-extrabold text-white tabular-nums shrink-0 mt-0.5"
                    style={{
                      backgroundColor: isSelected ? '#F3BD42' : spot.color,
                      color: isSelected ? '#123D2A' : '#FFFFFF',
                    }}
                  >
                    {spot.number}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-xs sm:text-[13px] font-extrabold leading-snug ${
                        hi ? 'font-hindi' : ''
                      }`}
                    >
                      {hi ? spot.hiTitle : spot.enTitle}
                    </span>
                    <span
                      className={`block text-[11.5px] leading-snug mt-0.5 line-clamp-2 ${
                        isSelected
                          ? 'text-white/85'
                          : darkSurface
                            ? 'text-white/65'
                            : 'text-[#4B5E53]'
                      } ${hi ? 'font-hindi' : ''}`}
                    >
                      {hi ? spot.hiShort : spot.enShort}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <p
            className={`text-xs leading-relaxed ${
              darkSurface ? 'text-white/70' : 'text-[#526559]'
            } ${hi ? 'font-hindi' : ''}`}
          >
            {hi ? captionHi : captionEn}
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   BESPOKE SMALL CONCEPT ILLUSTRATION ICONS
   (Research, Solar, Biogas, Compressed Biogas CBG, Digestate, Safety)
   ============================================================================ */

export function ConceptMiniIcon({
  kind,
  className = 'w-11 h-11',
}: {
  kind: 'solar' | 'biogas' | 'cbg' | 'research' | 'slurry' | 'safety';
  className?: string;
}) {
  if (kind === 'solar') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#FEF7E2" />
        <circle cx="14" cy="14" r="5" fill="#F3BD42" />
        <path d="M14 5v2M14 21v2M5 14h2M21 14h2M8 8l1.5 1.5M18.5 18.5L20 20" stroke="#D99B16" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 36l6-14h18l6 14H12z" fill="#123D2A" stroke="#29B6D8" strokeWidth="1.6" />
        <path d="M15 29h24M24 22l-2 14M30 22l2 14" stroke="#29B6D8" strokeWidth="1.4" />
        <rect x="23" y="36" width="8" height="4" rx="1" fill="#76523A" />
      </svg>
    );
  }
  if (kind === 'biogas') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#E9F5EE" />
        <path d="M12 26a12 12 0 0 1 24 0v10H12V26z" fill="#17834D" />
        <path d="M14 28h20v6H14z" fill="#76523A" />
        <circle cx="20" cy="24" r="1.6" fill="#9CE5B4" />
        <circle cx="26" cy="21" r="2" fill="#9CE5B4" />
        <path d="M24 14V9h10v4" fill="none" stroke="#123D2A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 15c2 2.2 2 4.5 0 5.5-2-1-2-3.3 0-5.5z" fill="#29B6D8" />
      </svg>
    );
  }
  if (kind === 'cbg') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#E6F5F6" />
        <rect x="10" y="15" width="7" height="23" rx="3.5" fill="#0F766E" />
        <rect x="20.5" y="13" width="7" height="25" rx="3.5" fill="#17834D" />
        <rect x="31" y="15" width="7" height="23" rx="3.5" fill="#0F766E" />
        <path d="M13.5 15v-3h21v3M24 10v3" stroke="#123D2A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2.6" fill="#F3BD42" />
      </svg>
    );
  }
  if (kind === 'research') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#EEF4FA" />
        <circle cx="21" cy="21" r="9" fill="#FFFFFF" stroke="#123D2A" strokeWidth="2.2" />
        <path d="M17 24l3-4 2.5 2.5L26 18" fill="none" stroke="#17834D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 28l9 9" stroke="#123D2A" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="34" cy="14" r="3" fill="#F3BD42" />
      </svg>
    );
  }
  if (kind === 'slurry') {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#F5EFE6" />
        <path d="M10 34c3-5 8-7 14-7s11 2 14 7H10z" fill="#76523A" />
        <path d="M24 27V15" stroke="#17834D" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M24 19c-6 0-9-4-9-8 5 0 9 3 9 8z" fill="#75B843" />
        <path d="M24 17c6 0 9-4 9-8-5 0-9 3-9 8z" fill="#17834D" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#EAF4EE" />
      <path d="M24 8l13 5v10c0 8.5-5.5 14.5-13 17-7.5-2.5-13-8.5-13-17V13l13-5z" fill="#123D2A" />
      <path d="M18.5 24.5l3.8 3.8 7.5-8" fill="none" stroke="#F3BD42" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
