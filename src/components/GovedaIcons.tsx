import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * Rich Two-Tone Organic Green Vector SVG Icons
 * Matching the approved GOVEDA illustration language: deep forest green (#186327),
 * natural leaf green (#479D27), bright sunlit lime (#83CE3A), and clean white negative space.
 */

export function ClimateActionSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaClimateGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7ECA37" />
          <stop offset="55%" stopColor="#3B9325" />
          <stop offset="100%" stopColor="#165B23" />
        </linearGradient>
      </defs>
      {/* Embracing Outer Leaf Wraps Around Earth Globe */}
      <path
        d="M32 6C17.6 6 6 17.6 6 32c0 8.9 4.5 16.8 11.4 21.5-2.6-6.2-2.2-13.9 2.3-19.6 4.7-6 12.1-8.5 17.3-13.7C41 16.2 42.3 10.6 39.6 7.1 37.2 6.4 34.6 6 32 6Z"
        fill="url(#govedaClimateGrad)"
      />
      <path
        d="M49.5 13.5c2.2 6.8 1.2 15.1-4.8 21.1-5.1 5.1-13 6.9-17.8 12.4-2.5 2.9-3.4 6.6-2.8 10.1 2.5.6 5.2.9 7.9.9 14.4 0 26-11.6 26-26 0-7.2-3-13.8-8.5-18.5Z"
        fill="#1E6B28"
      />
      {/* Delicate Continent / Leaf Vein Detail */}
      <path
        d="M21 20c3.5 1.8 6.4 4.8 7.5 8.6-3.9-.2-7.5-2.1-9.6-5.2-.6-.9-.3-2.2.6-2.9.5-.4 1-.7 1.5-.5ZM42 36c-2.8 2.4-6.3 3.9-10.1 4.2 1.2-3.7 3.9-6.8 7.4-8.5 1-.5 2.2-.1 2.7.9.4.8.4 2.7 0 3.4Z"
        fill="#FFFFFF"
        fillOpacity="0.92"
      />
      {/* Central Sprouting Leaf Crest */}
      <path
        d="M32 23c4.2 0 7.6 3.4 7.6 7.6 0 4.2-3.4 7.6-7.6 7.6-4.2 0-7.6-3.4-7.6-7.6 0-4.2 3.4-7.6 7.6-7.6Z"
        fill="#7ECA37"
        fillOpacity="0.28"
      />
      <path
        d="M32 39c0-5.8 3.6-10.6 9.2-12.5-1 5.6-4.4 10.6-9.2 12.5Z"
        fill="#8EE043"
      />
      <path
        d="M32 39c0-5.8-3.6-10.6-9.2-12.5 1 5.6 4.4 10.6 9.2 12.5Z"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export function TreePlantationSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaTreeCanopy" x1="16" y1="6" x2="50" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8AD63E" />
          <stop offset="60%" stopColor="#429B26" />
          <stop offset="100%" stopColor="#1B6625" />
        </linearGradient>
      </defs>
      {/* Shadow Mound */}
      <ellipse cx="32" cy="56" rx="16" ry="3.2" fill="#83CE3A" fillOpacity="0.35" />
      {/* Back Canopy Layers */}
      <circle cx="20" cy="28" r="10.5" fill="#2A7B26" />
      <circle cx="44" cy="28" r="10.5" fill="#1F6A25" />
      {/* Main Top Canopy */}
      <path
        d="M32 7c-9.8 0-17.8 7.5-17.8 16.8 0 6.7 4.1 12.5 10.1 15.1h15.4c6-2.6 10.1-8.4 10.1-15.1C49.8 14.5 41.8 7 32 7Z"
        fill="url(#govedaTreeCanopy)"
      />
      {/* Sunlit Canopy Highlights */}
      <circle cx="26" cy="18" r="6.2" fill="#9CE54D" fillOpacity="0.45" />
      <circle cx="38" cy="22" r="5" fill="#7ECA37" fillOpacity="0.4" />
      {/* Strong Organic Trunk & Branches */}
      <path
        d="M28.5 55.5c1-4.5 1.3-11.5 1.3-19.5l-5.8-6.2 2.2-1.8 4.4 4.6V24h2.8v9.2l4.8-5 2.1 1.9-6 6.4c0 7.9.4 14.8 1.5 19h-7.3Z"
        fill="#165220"
      />
      {/* Roots Flare */}
      <path
        d="M22.5 56c3.2-1.2 5.2-2.8 6.5-4.8h6c1.3 2 3.3 3.6 6.5 4.8H22.5Z"
        fill="#165220"
      />
    </svg>
  );
}

export function AgroforestrySproutSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaSproutLeaf" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8FD83E" />
          <stop offset="100%" stopColor="#267925" />
        </linearGradient>
      </defs>
      {/* Soil Mound */}
      <path d="M18 55c4.5-3.2 9-4.5 14-4.5s9.5 1.3 14 4.5H18Z" fill="#74BF33" fillOpacity="0.45" />
      {/* Central Stem */}
      <path d="M32 54V20" stroke="#1E6B28" strokeWidth="3.6" strokeLinecap="round" />
      {/* Lower Left Leaf */}
      <path
        d="M31.5 43c-10.5 0-17.5-6-17.5-15.5 10 0 17.5 5.5 17.5 15.5Z"
        fill="#2E8526"
      />
      <path d="M18 31.5c4.2 3.5 8.8 7 13 10.5" stroke="#A6EA5E" strokeWidth="1.4" strokeLinecap="round" />
      {/* Lower Right Leaf */}
      <path
        d="M32.5 43c10.5 0 17.5-6 17.5-15.5-10 0-17.5 5.5-17.5 15.5Z"
        fill="#1F6A25"
      />
      <path d="M46 31.5c-4.2 3.5-8.8 7-13 10.5" stroke="#8AD63E" strokeWidth="1.4" strokeLinecap="round" />
      {/* Upper Left Sunlit Leaf */}
      <path
        d="M31.5 27C20 27 12.5 20.5 12.5 10c10.8 0 19 6 19 17Z"
        fill="url(#govedaSproutLeaf)"
      />
      <path d="M16.5 14.5c4.5 3.6 9.5 7.4 14 11" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round" />
      {/* Upper Right Sunlit Leaf */}
      <path
        d="M32.5 27C44 27 51.5 20.5 51.5 10c-10.8 0-19 6-19 17Z"
        fill="#4EA528"
      />
      <path d="M47.5 14.5c-4.5 3.6-9.5 7.4-14 11" stroke="#A6EA5E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function WaterConservationSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaDropGrad" x1="18" y1="8" x2="46" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7AD038" />
          <stop offset="55%" stopColor="#2E882B" />
          <stop offset="100%" stopColor="#145824" />
        </linearGradient>
      </defs>
      {/* Soft Ripple Base */}
      <ellipse cx="32" cy="54.5" rx="15" ry="3.2" stroke="#53AD30" strokeWidth="2" strokeOpacity="0.45" />
      {/* Outer Outline Droplet */}
      <path
        d="M32 7C24 18.5 15 27.6 15 37.5 15 47 22.6 54 32 54s17-7 17-16.5C49 27.6 40 18.5 32 7Z"
        fill="#E9F6E3"
        stroke="url(#govedaDropGrad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Inner Solid Leaf-Water Droplet */}
      <path
        d="M32 16c-5.6 8.3-11.5 14.5-11.5 21.4 0 6.4 5.1 11.4 11.5 11.4s11.5-5 11.5-11.4C43.5 30.5 37.6 24.3 32 16Z"
        fill="url(#govedaDropGrad)"
      />
      {/* Glossy Highlight & Leaf Wave Inside Droplet */}
      <path
        d="M25.5 36.5c0 4 2.7 7 6.5 7.7"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      <path
        d="M33.5 24.5c2.2 3.3 4.2 6.2 4.8 9"
        stroke="#A4EA5E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GaushalaCowSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaCowGrad" x1="8" y1="14" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#77C836" />
          <stop offset="60%" stopColor="#3B9325" />
          <stop offset="100%" stopColor="#1B6424" />
        </linearGradient>
      </defs>
      {/* Green Pasture Ground */}
      <path d="M9 53c12-3 34-3 46 0" stroke="#7ECA37" strokeWidth="2.8" strokeLinecap="round" strokeOpacity="0.55" />
      {/* Indian Cow (Gir/Kankrej Hump Profile) in Rich Green Gradient */}
      <path
        d="M49 23.5c-2.5-3.2-5.5-5-9.5-5-1.5 0-3 .3-4.2.8-1.4-2.5-3.6-4.1-6.5-4.1-3.3 0-5.6 1.9-7.1 4.6-2.4.7-4.9 1.6-7.6 2-2.2.3-4.3-1-5.8-3-.7.8-.7 2.2 0 3.3-1.6.9-2.7 2.6-2.5 4.4.3 2.5 2.1 5.1 4.4 6.1 1.4.6 3-.1 4.2-1.1l2.8-2.3c1.6 3.5 4.1 6 7.8 6.8v14.5h4.2V40.3c2.4.3 5 .3 7.4-.1v10.3h4.1v-11c1.8-.8 3.3-2 4.4-3.7l1.9 14.7h3.8l-1-18.8c1-2.6.8-5.7-.8-8.2Z"
        fill="url(#govedaCowGrad)"
      />
      {/* Subtle Horn & Ear Highlight */}
      <path
        d="M14.2 19.5c-.5-2.6.7-5 2.7-6.3.4 2.1 1.6 3.8 3.2 4.9"
        stroke="#185C22"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14.2" cy="24.2" r="1.2" fill="#FFFFFF" />
      {/* Leaf Accent Above */}
      <path
        d="M39 14c0-3.8 2.8-6.8 7-7.2-.2 4-3 7.2-7 7.2Z"
        fill="#84CE38"
      />
    </svg>
  );
}

export function RuralLivelihoodsSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaGroupMain" x1="20" y1="12" x2="44" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7CCB37" />
          <stop offset="100%" stopColor="#267925" />
        </linearGradient>
      </defs>
      {/* Left Person */}
      <circle cx="16.5" cy="26" r="5.2" fill="#4BA329" />
      <path
        d="M7 51v-7.5c0-5 4-9 9-9 2.2 0 4.2.8 5.8 2.1-3.3 2.5-5.3 6.4-5.3 10.9V51H7Z"
        fill="#4BA329"
      />
      {/* Right Person */}
      <circle cx="47.5" cy="26" r="5.2" fill="#206B25" />
      <path
        d="M47.5 51v-3.5c0-4.5-2-8.4-5.3-10.9 1.6-1.3 3.6-2.1 5.8-2.1 5 0 9 4 9 9V51h-9.5Z"
        fill="#206B25"
      />
      {/* Central Leader Person */}
      <circle cx="32" cy="19.5" r="7.2" fill="url(#govedaGroupMain)" stroke="#FFFFFF" strokeWidth="1.5" />
      <path
        d="M18.5 53v-9.5c0-7.4 6-13.5 13.5-13.5s13.5 6.1 13.5 13.5V53h-27Z"
        fill="url(#govedaGroupMain)"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Subtle Leaf Crest on Chest */}
      <path
        d="M32 45.5c0-4.2 2.8-7.6 6.8-8.6-.5 4.2-3 7.5-6.8 8.6Z"
        fill="#FFFFFF"
        fillOpacity="0.88"
      />
    </svg>
  );
}

export function CleanEnergySvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaEnergyGrad" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#85D23A" />
          <stop offset="100%" stopColor="#1B6625" />
        </linearGradient>
      </defs>
      {/* Rolling Green Hill */}
      <path d="M8 53c14-5 34-5 48 0H8Z" fill="#74BF33" fillOpacity="0.4" />
      {/* Wind Turbine 1 */}
      <rect x="23.6" y="25" width="3.2" height="27" rx="1.6" fill="#185C22" />
      <path
        d="M25.2 25L22 9c3.4 3.5 5.4 8.7 3.2 16ZM25.2 25l14-5.5c-4.5 5.3-9 7.5-14 5.5ZM25.2 25l-11 9.5c2-6 5.5-9.5 11-9.5Z"
        fill="url(#govedaEnergyGrad)"
      />
      <circle cx="25.2" cy="25" r="2.6" fill="#FFFFFF" stroke="#185C22" strokeWidth="1.5" />
      {/* Wind Turbine 2 */}
      <rect x="44" y="33" width="2.6" height="19" rx="1.3" fill="#2A7D27" />
      <path
        d="M45.3 33L43 21c2.5 2.5 4 6.5 2.3 12ZM45.3 33l10-4c-3.2 3.8-6.4 5.4-10 4ZM45.3 33l-8 7c1.5-4.3 4-7 8-7Z"
        fill="#5EB82F"
      />
      <circle cx="45.3" cy="33" r="2" fill="#FFFFFF" stroke="#2A7D27" strokeWidth="1.2" />
    </svg>
  );
}

export function HeritageFortSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaFortGrad" x1="10" y1="12" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#79CA37" />
          <stop offset="100%" stopColor="#1B6424" />
        </linearGradient>
      </defs>
      {/* Hilltop Base */}
      <path d="M6 54c14-7 38-7 52 0H6Z" fill="#7AC837" fillOpacity="0.45" />
      {/* Rajasthan Fort & Haveli Silhouette */}
      <path
        d="M11 52V28h4v-4h5v4h5v-7l7-6 7 6v7h5v-4h5v4h4v24H11Z"
        fill="url(#govedaFortGrad)"
      />
      {/* Battlements & Crenellations */}
      <path
        d="M11 26h3v3h-3v-3Zm8 0h3v3h-3v-3Zm23 0h3v3h-3v-3Zm8 0h3v3h-3v-3Z"
        fill="#165220"
      />
      {/* Central Rajasthan Arch Gate & Jharokha Windows */}
      <path
        d="M27 52V39c0-3 2.2-5.2 5-5.2s5 2.2 5 5.2v13H27Z"
        fill="#FFFFFF"
      />
      <path
        d="M16 40c0-1.6 1.2-2.8 2.6-2.8s2.6 1.2 2.6 2.8v5H16v-5Zm26.8 0c0-1.6 1.2-2.8 2.6-2.8s2.6 1.2 2.6 2.8v5h-5.2v-5Z"
        fill="#FFFFFF"
        fillOpacity="0.88"
      />
      <circle cx="32" cy="24.5" r="2.2" fill="#FFFFFF" />
    </svg>
  );
}

export function SkillEducationSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaSkillGrad" x1="8" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#85D23A" />
          <stop offset="100%" stopColor="#1B6625" />
        </linearGradient>
      </defs>
      {/* Graduation Cap */}
      <path d="M6 25L32 13l26 12-26 12L6 25Z" fill="url(#govedaSkillGrad)" />
      <path
        d="M16 31.5V43c0 4.5 7.2 8 16 8s16-3.5 16-8V31.5l-16 7.5-16-7.5Z"
        fill="#1E6B28"
      />
      {/* Bright White Accent Spine & Tassel */}
      <path d="M52 27.5v14" stroke="#62B72E" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="52" cy="43.5" r="3" fill="#85D23A" />
      <path d="M27 25h10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
}

export function SeniorCareSvg({ className = 'w-11 h-11' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="govedaHeartGrad" x1="16" y1="10" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#85D23A" />
          <stop offset="100%" stopColor="#267925" />
        </linearGradient>
      </defs>
      {/* Heart-Leaf Above Caring Hands */}
      <path
        d="M32 38s-12-7.8-12-16.4A7.4 7.4 0 0 1 32 16a7.4 7.4 0 0 1 12 5.6C44 30.2 32 38 32 38Z"
        fill="url(#govedaHeartGrad)"
      />
      <path
        d="M32 30.5c0-4 2.4-7.2 6-8.3-.4 3.8-2.6 7-6 8.3Z"
        fill="#FFFFFF"
        fillOpacity="0.88"
      />
      {/* Cupped Hands Base */}
      <path
        d="M10 42c4.5-2.2 10-1.5 15 1.8l7 4.4 7-4.4c5-3.3 10.5-4 15-1.8-3 6-10 11.5-22 13-12-1.5-19-7-22-13Z"
        fill="#1E6B28"
      />
    </svg>
  );
}

export function GovedaMissionSvg({
  iconName,
  className = 'w-11 h-11',
}: {
  iconName?: string;
  className?: string;
}) {
  switch (iconName) {
    case 'CloudSun':
      return <ClimateActionSvg className={className} />;
    case 'Trees':
      return <TreePlantationSvg className={className} />;
    case 'Home':
      return <GaushalaCowSvg className={className} />;
    case 'Zap':
      return <CleanEnergySvg className={className} />;
    case 'Sprout':
      return <AgroforestrySproutSvg className={className} />;
    case 'Recycle':
      return <WaterConservationSvg className={className} />;
    case 'GraduationCap':
      return <SkillEducationSvg className={className} />;
    case 'Users':
      return <RuralLivelihoodsSvg className={className} />;
    case 'HeartHandshake':
      return <SeniorCareSvg className={className} />;
    case 'Landmark':
      return <HeritageFortSvg className={className} />;
    default:
      return <AgroforestrySproutSvg className={className} />;
  }
}
