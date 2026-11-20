import React, { useState } from 'react';
import { GENERATED_ASSETS, type AssetKey } from '../data/assets';
import type { Language } from '../types/goveda';

interface WhyItMattersShowcaseProps {
  lang: Language;
  onNavigate?: (path: string) => void;
}

interface MatterColumn {
  id: 'heat' | 'rain' | 'pollution' | 'livelihood';
  assetKey: AssetKey;
  fallbackGradient: [string, string];
  dotColor: string;
  slug: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  altHi: string;
  altEn: string;
  clipPathD: string;
  imgBox: { x: number; y: number; width: number; height: number };
}

const MATTER_COLUMNS: MatterColumn[] = [
  {
    id: 'heat',
    assetKey: 'whyMattersHeat',
    fallbackGradient: ['#E87A24', '#8B3E12'],
    dotColor: '#F59E0B',
    slug: '/missions/harit-rajasthan',
    titleHi: 'बढ़ता तापमान',
    titleEn: 'Rising Temperatures',
    descHi:
      'लगातार बढ़ती गर्मी से फसल उत्पादन, जन स्वास्थ्य और पशुधन पर दबाव बढ़ रहा है।',
    descEn:
      'Relentless heatwaves are placing severe stress on crop yields, public health, and rural livestock.',
    altHi: 'तपते सूरज, सूखे पेड़ और दरकती जमीन का दृश्य — बढ़ता तापमान',
    altEn: 'Blazing desert sun over a solitary leafless tree and parched cracked earth',
    clipPathD:
      'M 14 306 C 52 172 118 22 224 22 C 268 22 304 32 328 46 C 314 148 274 252 198 330 C 138 352 66 346 14 306 Z',
    imgBox: { x: -4, y: 0, width: 356, height: 374 },
  },
  {
    id: 'rain',
    assetKey: 'whyMattersRain',
    fallbackGradient: ['#233B4E', '#4A6E44'],
    dotColor: '#6EB83A',
    slug: '/harit-rajasthan',
    titleHi: 'अनियमित वर्षा',
    titleEn: 'Erratic Rainfall',
    descHi:
      'कभी लंबे सूखे, तो कभी अचानक भारी बारिश — खेती और जल प्रबंधन दोनों प्रभावित होते हैं।',
    descEn:
      'Prolonged droughts followed by sudden downpours disrupt both agricultural cycles and water conservation.',
    altHi: 'घने बादलों से भारी बारिश और ग्रामीण जोहड़/तालाब में लहरें — अनियमित वर्षा',
    altEn: 'Heavy monsoon storm rain pouring over rural Rajasthan greenery and a stone-lined village pond',
    clipPathD:
      'M 214 334 C 289 254 329 150 344 48 C 406 8 502 8 586 42 C 572 146 532 254 456 334 C 376 364 290 360 214 334 Z',
    imgBox: { x: 204, y: -4, width: 396, height: 382 },
  },
  {
    id: 'pollution',
    assetKey: 'whyMattersPollution',
    fallbackGradient: ['#586066', '#9FA5A1'],
    dotColor: '#6EB83A',
    slug: '/missions/biogas-cbg',
    titleHi: 'बढ़ता प्रदूषण',
    titleEn: 'Rising Pollution',
    descHi:
      'वायु, जल और भूमि प्रदूषण से पर्यावरण और जीवन की गुणवत्ता पर खतरा बढ़ रहा है।',
    descEn:
      'Growing air, water, and soil pollution poses an urgent threat to rural ecosystems and quality of life.',
    altHi: 'औद्योगिक चिमनियों से निकलता घना धुआँ और धुंध — बढ़ता प्रदूषण',
    altEn: 'Industrial factory smokestacks billowing dense dark smoke into a hazy polluted sky',
    clipPathD:
      'M 472 338 C 547 256 587 148 602 46 C 666 10 764 10 844 46 C 830 148 790 256 714 338 C 634 366 548 362 472 338 Z',
    imgBox: { x: 462, y: -4, width: 396, height: 382 },
  },
  {
    id: 'livelihood',
    assetKey: 'whyMattersLivelihood',
    fallbackGradient: ['#D8B472', '#5A7B33'],
    dotColor: '#6EB83A',
    slug: '/missions/organic-farming',
    titleHi: 'ग्रामीण आजीविका पर दबाव',
    titleEn: 'Rural Livelihood Stress',
    descHi:
      'खेती की अनिश्चितता, संसाधनों की कमी और सीमित अवसर आज ग्रामीण परिवारों के सामने बड़ी चुनौती बन रहे हैं।',
    descEn:
      'Crop uncertainty, scarce resources, and limited local opportunities continue to challenge rural families.',
    altHi: 'अपने खेत के किनारे बैठकर फसल और पहाड़ियों को निहारता राजस्थानी किसान — ग्रामीण आजीविका पर दबाव',
    altEn: 'Traditional Rajasthani farmer in cream pagdi and terracotta gamcha gazing thoughtfully across sunlit fields',
    clipPathD:
      'M 730 340 C 805 258 845 150 860 48 C 922 24 998 28 1064 52 L 1064 148 C 1062 248 988 326 868 344 C 818 352 770 350 730 340 Z',
    imgBox: { x: 716, y: 4, width: 356, height: 364 },
  },
];

export function WhyItMattersShowcase({ lang, onNavigate }: WhyItMattersShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<MatterColumn['id'] | null>(null);

  return (
    <section
      id="why-it-matters"
      className="relative overflow-hidden bg-gradient-to-b from-[#FAFBF7] via-[#FCFBF6] to-[#FFFFFF] pt-10 sm:pt-14 pb-20 sm:pb-24 lg:pb-28"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-5 items-start">
          {/* LEFT EDITORIAL COLUMN */}
          <div className="lg:col-span-4 space-y-5 lg:pr-4 pt-2 sm:pt-4">
            <div className="flex items-center gap-3.5">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#1C4A25]">
                WHY IT MATTERS
              </span>
              <span className="h-[1.5px] w-16 bg-[#2F6D26]" aria-hidden="true" />
            </div>

            <div>
              <h2 className="font-editorial text-4xl sm:text-[3rem] lg:text-[3.35rem] font-extrabold text-[#153E1E] leading-[1.08] tracking-tight text-balance">
                {lang === 'hi' ? (
                  <>
                    क्यों ज़रूरी है{' '}
                    <br />
                    यह मिशन?
                  </>
                ) : (
                  <>
                    Why This{' '}
                    <br />
                    Mission Matters?
                  </>
                )}
              </h2>
              {/* Tapered Fresh Lime-Green Brushstroke Curve */}
              <svg
                viewBox="0 0 264 20"
                fill="none"
                className="w-56 sm:w-64 h-4 mt-2"
                aria-hidden="true"
              >
                <path
                  d="M2 14 C72 3 168 1 258 10 C192 9 98 11 4 18 Z"
                  fill="#82C341"
                />
              </svg>
            </div>

            <div className="flex items-stretch gap-3.5 max-w-[390px]">
              <span
                className="w-[3.5px] shrink-0 rounded-full bg-[#82C341]"
                aria-hidden="true"
              />
              <p className="text-sm sm:text-[15.5px] text-[#283329] leading-[1.68] font-medium py-0.5">
                {lang === 'hi'
                  ? 'बढ़ती गर्मी, बदलता मौसम, प्रदूषण और ग्रामीण आजीविका पर बढ़ता दबाव हमारे किसानों, प्राकृतिक संसाधनों और आने वाली पीढ़ियों के भविष्य के लिए गंभीर चुनौती है।'
                  : 'Rising temperatures, erratic monsoons, growing pollution, and mounting stress on rural livelihoods present an urgent challenge to our farmers, natural resources, and future generations.'}
              </p>
            </div>
          </div>

          {/* RIGHT AREA: UNIFIED 4-SLICE INTERLOCKING S-WAVE EDITORIAL RIBBON + ALIGNED COLUMNS */}
          <div className="lg:col-span-8 relative">
            {/* DESKTOP & TABLET (md+): PRECISION SVG CLIPPED 4-SLICE WAVE RIBBON */}
            <div className="hidden md:block">
              <div className="relative">
                <svg
                  viewBox="0 0 1080 376"
                  className="w-full h-auto block select-none overflow-visible"
                  role="img"
                  aria-label={
                    lang === 'hi'
                      ? 'बढ़ता तापमान, अनियमित वर्षा, बढ़ता प्रदूषण और ग्रामीण आजीविका पर दबाव दर्शाती चार खंडीय चित्र श्रृंखला'
                      : 'Four-part panoramic wave illustration depicting rising heatwaves, erratic rainfall, pollution, and rural livelihood stress'
                  }
                >
                  <defs>
                    <linearGradient id="whyLeafSwoosh" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#B8E073" stopOpacity="0.88" />
                      <stop offset="55%" stopColor="#8CC944" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#6DB336" stopOpacity="0.98" />
                    </linearGradient>

                    <filter id="whyRibbonShadow" x="-4%" y="-6%" width="108%" height="118%">
                      <feDropShadow
                        dx="0"
                        dy="12"
                        stdDeviation="11"
                        floodColor="#1B3622"
                        floodOpacity="0.16"
                      />
                    </filter>

                    {MATTER_COLUMNS.map((col) => (
                      <React.Fragment key={`defs-${col.id}`}>
                        <clipPath id={`why-clip-${col.id}`}>
                          <path d={col.clipPathD} />
                        </clipPath>
                        <linearGradient
                          id={`why-fallback-${col.id}`}
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor={col.fallbackGradient[0]} />
                          <stop offset="100%" stopColor={col.fallbackGradient[1]} />
                        </linearGradient>
                      </React.Fragment>
                    ))}
                  </defs>

                  {/* Iconic Tapered Lime-Green Leaf Swoosh Hugging the Lower-Right Curve of Slice 4 */}
                  <path
                    d="M 744 345 C 824 364 926 364 998 312 C 1044 278 1068 228 1070 164 C 1062 222 1034 272 982 304 C 918 342 828 346 744 345 Z"
                    fill="url(#whyLeafSwoosh)"
                  />

                  {/* Subtle Soft Lime Under-Wave Highlight Flowing Under Slices 3–4 */}
                  <path
                    d="M 548 352 C 632 365 712 362 792 350 C 718 355 636 356 548 352 Z"
                    fill="#9ED359"
                    opacity="0.55"
                  />

                  {/* 4 Interactive Clipped High-Resolution Photorealistic Slices */}
                  <g filter="url(#whyRibbonShadow)">
                    {MATTER_COLUMNS.map((col) => {
                      const isHovered = hoveredId === col.id;
                      const cx = col.imgBox.x + col.imgBox.width / 2;
                      const cy = col.imgBox.y + col.imgBox.height / 2;

                      return (
                        <g
                          key={`slice-${col.id}`}
                          role="button"
                          tabIndex={0}
                          aria-label={lang === 'hi' ? col.titleHi : col.titleEn}
                          onClick={() => onNavigate?.(col.slug)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onNavigate?.(col.slug);
                            }
                          }}
                          onMouseEnter={() => setHoveredId(col.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onFocus={() => setHoveredId(col.id)}
                          onBlur={() => setHoveredId(null)}
                          className="cursor-pointer outline-none"
                        >
                          <g clipPath={`url(#why-clip-${col.id})`}>
                            {/* Thematic Gradient Backdrop (Zero-Broken-Image Fallback) */}
                            <rect
                              x={col.imgBox.x}
                              y={col.imgBox.y}
                              width={col.imgBox.width}
                              height={col.imgBox.height}
                              fill={`url(#why-fallback-${col.id})`}
                            />
                            {/* High-Res Editorial Illustration with Subtle Hover Zoom */}
                            <image
                              href={GENERATED_ASSETS[col.assetKey]}
                              x={col.imgBox.x}
                              y={col.imgBox.y}
                              width={col.imgBox.width}
                              height={col.imgBox.height}
                              preserveAspectRatio="xMidYMid slice"
                              style={{
                                transformOrigin: `${cx}px ${cy}px`,
                                transform: isHovered ? 'scale(1.045)' : 'scale(1)',
                                transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                              }}
                            />
                          </g>

                          {/* Crisp Subtle Edge Highlight on Active/Hover */}
                          <path
                            d={col.clipPathD}
                            fill="none"
                            stroke={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                            strokeWidth={isHovered ? 3.5 : 1.2}
                            style={{ transition: 'stroke 180ms ease, stroke-width 180ms ease' }}
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* 4 ALIGNED CAPTION COLUMNS DIRECTLY BELOW WAVE PANELS */}
              <div className="grid grid-cols-4 gap-4 lg:gap-5 pt-3 pl-2 pr-1">
                {MATTER_COLUMNS.map((col) => {
                  const isHovered = hoveredId === col.id;
                  return (
                    <button
                      key={`col-${col.id}`}
                      type="button"
                      onClick={() => onNavigate?.(col.slug)}
                      onMouseEnter={() => setHoveredId(col.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="group relative text-left pl-4 border-l border-[#D5DDD0] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#368737] rounded-r-lg py-0.5"
                    >
                      <span
                        className={`absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#FCFBF6] transition-transform duration-200 ${
                          isHovered ? 'scale-125' : ''
                        }`}
                        style={{ backgroundColor: col.dotColor }}
                        aria-hidden="true"
                      />
                      <h3
                        className={`text-[15px] lg:text-[16.5px] font-bold leading-snug transition-colors duration-200 ${
                          isHovered ? 'text-[#2E7D32]' : 'text-[#153D1E]'
                        }`}
                      >
                        {lang === 'hi' ? col.titleHi : col.titleEn}
                      </h3>
                      <p className="mt-1.5 text-[12px] lg:text-[12.8px] text-[#354035] leading-[1.58]">
                        {lang === 'hi' ? col.descHi : col.descEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MOBILE (< md): TWO PAIRED 2-COLUMN SCULPTED WAVE GRIDS MATCHING DESKTOP */}
            <div className="md:hidden space-y-8">
              {[
                {
                  pairId: 'pair-1',
                  items: [MATTER_COLUMNS[0], MATTER_COLUMNS[1]] as const,
                  showLeafSwoosh: false,
                },
                {
                  pairId: 'pair-2',
                  items: [MATTER_COLUMNS[2], MATTER_COLUMNS[3]] as const,
                  showLeafSwoosh: true,
                },
              ].map((row) => {
                const [leftCol, rightCol] = row.items;
                const leftClipPath =
                  'M 10 214 C 34 114 86 14 186 14 C 242 14 290 16 324 24 C 312 104 290 176 252 232 C 172 252 74 248 10 214 Z';
                const rightClipPath =
                  'M 266 236 C 304 178 326 106 338 26 C 416 6 514 10 588 34 L 588 106 C 586 184 524 238 424 248 C 364 254 310 248 266 236 Z';

                return (
                  <div key={row.pairId} className="space-y-3">
                    {/* Paired 2-Slice Interlocking Curved Wave Ribbon */}
                    <svg
                      viewBox="0 0 600 260"
                      className="w-full h-auto block select-none overflow-visible"
                      role="img"
                      aria-label={`${lang === 'hi' ? leftCol.titleHi : leftCol.titleEn} & ${
                        lang === 'hi' ? rightCol.titleHi : rightCol.titleEn
                      }`}
                    >
                      <defs>
                        <clipPath id={`mob-clip-${row.pairId}-left`}>
                          <path d={leftClipPath} />
                        </clipPath>
                        <clipPath id={`mob-clip-${row.pairId}-right`}>
                          <path d={rightClipPath} />
                        </clipPath>
                        <linearGradient
                          id={`mob-fb-${leftCol.id}`}
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor={leftCol.fallbackGradient[0]} />
                          <stop offset="100%" stopColor={leftCol.fallbackGradient[1]} />
                        </linearGradient>
                        <linearGradient
                          id={`mob-fb-${rightCol.id}`}
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor={rightCol.fallbackGradient[0]} />
                          <stop offset="100%" stopColor={rightCol.fallbackGradient[1]} />
                        </linearGradient>
                        <linearGradient
                          id={`mob-swoosh-${row.pairId}`}
                          x1="0%"
                          y1="100%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#B8E073" stopOpacity="0.88" />
                          <stop offset="55%" stopColor="#8CC944" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#6DB336" stopOpacity="0.98" />
                        </linearGradient>
                        <filter
                          id={`mob-shadow-${row.pairId}`}
                          x="-4%"
                          y="-6%"
                          width="108%"
                          height="118%"
                        >
                          <feDropShadow
                            dx="0"
                            dy="8"
                            stdDeviation="7"
                            floodColor="#1B3622"
                            floodOpacity="0.16"
                          />
                        </filter>
                      </defs>

                      {row.showLeafSwoosh ? (
                        <path
                          d="M 284 242 C 362 258 472 258 540 214 C 574 190 592 154 594 112 C 586 154 566 188 524 210 C 464 240 366 244 284 242 Z"
                          fill={`url(#mob-swoosh-${row.pairId})`}
                        />
                      ) : (
                        <path
                          d="M 312 242 C 392 256 490 250 548 214 C 492 242 396 246 312 242 Z"
                          fill="#A4D562"
                          opacity="0.6"
                        />
                      )}

                      <g filter={`url(#mob-shadow-${row.pairId})`}>
                        {/* Left Slice */}
                        <g
                          role="button"
                          tabIndex={0}
                          aria-label={lang === 'hi' ? leftCol.titleHi : leftCol.titleEn}
                          onClick={() => onNavigate?.(leftCol.slug)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onNavigate?.(leftCol.slug);
                            }
                          }}
                          className="cursor-pointer outline-none"
                        >
                          <g clipPath={`url(#mob-clip-${row.pairId}-left)`}>
                            <rect
                              x="-4"
                              y="0"
                              width="336"
                              height="256"
                              fill={`url(#mob-fb-${leftCol.id})`}
                            />
                            <image
                              href={GENERATED_ASSETS[leftCol.assetKey]}
                              x="-4"
                              y="0"
                              width="336"
                              height="256"
                              preserveAspectRatio="xMidYMid slice"
                            />
                          </g>
                          <path
                            d={leftClipPath}
                            fill="none"
                            stroke="rgba(255,255,255,0.28)"
                            strokeWidth="1.2"
                          />
                        </g>

                        {/* Right Slice */}
                        <g
                          role="button"
                          tabIndex={0}
                          aria-label={lang === 'hi' ? rightCol.titleHi : rightCol.titleEn}
                          onClick={() => onNavigate?.(rightCol.slug)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onNavigate?.(rightCol.slug);
                            }
                          }}
                          className="cursor-pointer outline-none"
                        >
                          <g clipPath={`url(#mob-clip-${row.pairId}-right)`}>
                            <rect
                              x="260"
                              y="0"
                              width="334"
                              height="256"
                              fill={`url(#mob-fb-${rightCol.id})`}
                            />
                            <image
                              href={GENERATED_ASSETS[rightCol.assetKey]}
                              x="260"
                              y="0"
                              width="334"
                              height="256"
                              preserveAspectRatio="xMidYMid slice"
                            />
                          </g>
                          <path
                            d={rightClipPath}
                            fill="none"
                            stroke="rgba(255,255,255,0.28)"
                            strokeWidth="1.2"
                          />
                        </g>
                      </g>
                    </svg>

                    {/* Paired 2-Column Captions Aligned Directly Below */}
                    <div className="grid grid-cols-2 gap-3.5 pl-1.5 pr-0.5">
                      {row.items.map((col) => (
                        <button
                          key={`mob-col-${col.id}`}
                          type="button"
                          onClick={() => onNavigate?.(col.slug)}
                          className="relative text-left pl-3 border-l border-[#D5DDD0] py-0.5 cursor-pointer active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#368737] rounded-r-md"
                        >
                          <span
                            className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#FCFBF6]"
                            style={{ backgroundColor: col.dotColor }}
                            aria-hidden="true"
                          />
                          <h3 className="text-[14px] sm:text-[15px] font-bold text-[#153D1E] leading-snug">
                            {lang === 'hi' ? col.titleHi : col.titleEn}
                          </h3>
                          <p className="mt-1 text-[11.5px] sm:text-[12.5px] text-[#354035] leading-[1.52]">
                            {lang === 'hi' ? col.descHi : col.descEn}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LEFT & HORIZON BLENDED RAJASTHAN WATERCOLOR FORT + RURAL VILLAGE LANDSCAPE */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="relative w-full max-w-[1600px] mx-auto h-24 sm:h-32 lg:h-36">
          <img
            src={GENERATED_ASSETS.whoWeAreSandstoneHorizon}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-bottom mix-blend-multiply opacity-80 block"
          />
          <div
            className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#FCFBF6] via-[#FCFBF6]/70 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white via-white/60 to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
