import React from 'react';
import { MapPin } from 'lucide-react';
import { usePublicPortal } from '../context/PublicPortalContext';
import { mergePublicDistricts } from '../utils/publicDataBridge';
import type { Language } from '../types/goveda';

interface RajasthanMapProps {
  lang: Language;
  activeDistrictSlug?: string;
  onSelectDistrict: (slug: string) => void;
}

export function RajasthanMap({
  lang,
  activeDistrictSlug,
  onSelectDistrict,
}: RajasthanMapProps) {
  const { bootstrap } = usePublicPortal();
  const districts = mergePublicDistricts(bootstrap?.districts);

  return (
    <div className="relative w-full max-w-[380px] mx-auto select-none">
      <svg
        viewBox="0 0 360 320"
        className="w-full h-auto drop-shadow-sm"
        role="img"
        aria-label={
          lang === 'hi'
            ? 'राजस्थान के प्रारंभिक फोकस जिले मानचित्र'
            : 'Map of Rajasthan highlighting focus districts'
        }
      >
        {/* Simplified artistic silhouette of Rajasthan matching reference aesthetic */}
        <path
          d="M148,22 L182,34 L205,54 L236,68 L254,96 L284,114 L318,134 L334,158 L314,174 L298,194 L272,202 L262,232 L242,248 L224,274 L196,292 L170,276 L152,258 L128,244 L106,232 L82,216 L54,202 L32,174 L28,144 L54,118 L72,88 L104,64 L126,38 Z"
          fill="#E4F3DE"
          stroke="#4BA348"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <text
          x="185"
          y="168"
          textAnchor="middle"
          fill="#1B5A32"
          opacity="0.28"
          fontSize="18"
          fontWeight="700"
          letterSpacing="3"
        >
          RAJASTHAN
        </text>
      </svg>

      {/* Interactive Accessible District Pin Buttons */}
      {districts.map((d) => {
        const isActive = activeDistrictSlug === d.slug;
        return (
          <button
            key={d.slug}
            type="button"
            onClick={() => onSelectDistrict(d.slug)}
            style={{
              left: `${d.mapCoords.x}%`,
              top: `${d.mapCoords.y}%`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#144527] rounded-lg p-0.5 transition-transform duration-200 hover:scale-110 ${
              isActive ? 'z-20 scale-110' : 'z-10'
            }`}
            aria-label={`${d.name[lang]} District Campaign`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm border transition-colors ${
                isActive
                  ? 'bg-[#144527] text-white border-white'
                  : 'bg-white text-[#1B5A32] border-[#368737] group-hover:bg-[#1B5A32] group-hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
            </span>
            <span
              className={`mt-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold leading-none whitespace-nowrap shadow-xs ${
                isActive
                  ? 'bg-[#144527] text-white'
                  : 'bg-white/95 text-[#144527]'
              }`}
            >
              {d.name[lang]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
