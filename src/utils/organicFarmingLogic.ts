// Pure domain logic for GOVEDA Mission 05 — Organic Farming & Rural Development
// Computes honest, indicative phased-transition guidance (never guarantees yields or prices)

export type WaterSourceType = 'saline-borewell' | 'sweet-well' | 'rainfed';
export type FarmSoilCondition = 'chemical-heavy' | 'mixed' | 'traditional-low-input';

export interface TransitionPlannerInput {
  bigha: number; // Rajasthan standard rural measure (1 Bigha ≈ 0.25 Hectare / ~0.62 Acre)
  waterSource: WaterSourceType;
  soilCondition: FarmSoilCondition;
}

export interface TransitionPlannerOutput {
  totalBigha: number;
  pilotSharePct: number;
  year1PilotBigha: number;
  estimatedCompostKgPerYear: number;
  estimatedJeevamritLitersPerMonth: number;
  recommendedBorderSaplings: number;
  priorityTests: { hi: string; en: string }[];
  recommendedCrops: { hi: string; en: string }[];
  waterStrategy: { hi: string; en: string };
  transitionTimeline: {
    year: string;
    sharePct: number;
    focusHi: string;
    focusEn: string;
  }[];
}

export function clampBigha(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  if (value > 100) return 100;
  return Math.round(value * 10) / 10;
}

/**
 * Computes a cautious, phased 3-year organic transition guide tailored to Rajasthan
 * arid/semi-arid soil & water realities. Strictly indicative for orientation only.
 */
export function calculateOrganicTransitionPlan(
  raw: TransitionPlannerInput
): TransitionPlannerOutput {
  const totalBigha = clampBigha(raw.bigha);

  // Conservative Year-1 pilot share so family food/income security is never put at risk
  const pilotSharePct =
    raw.soilCondition === 'chemical-heavy'
      ? 25
      : raw.soilCondition === 'mixed'
        ? 35
        : 50;

  const year1PilotBigha = Math.max(
    0.5,
    Math.round(((totalBigha * pilotSharePct) / 100) * 10) / 10
  );

  // Indicative organic matter baseline: ~450–600 kg mature vermicompost per Bigha/year on pilot area
  const compostRatePerBigha =
    raw.soilCondition === 'chemical-heavy' ? 600 : raw.soilCondition === 'mixed' ? 500 : 400;
  const estimatedCompostKgPerYear = Math.round(year1PilotBigha * compostRatePerBigha);

  // Indicative Jeevamrit: ~50 L per Bigha applied twice monthly during active cropping
  const estimatedJeevamritLitersPerMonth = Math.round(year1PilotBigha * 100);

  // Native windbreak border saplings (~12–16 hardy native trees along perimeter per Bigha, capped sensibly)
  const recommendedBorderSaplings = Math.min(250, Math.max(12, Math.round(totalBigha * 14)));

  const priorityTests: { hi: string; en: string }[] = [
    {
      hi: 'मिट्टी का pH और जैविक कार्बन (Organic Carbon %)',
      en: 'Soil pH & Organic Carbon (%) baseline',
    },
    {
      hi: 'उपलब्ध नाइट्रोजन, फॉस्फोरस, पोटाश व सूक्ष्म पोषक तत्व (Zn, Fe)',
      en: 'Available NPK & micronutrients (Zinc, Iron)',
    },
  ];

  if (raw.waterSource === 'saline-borewell') {
    priorityTests.push({
      hi: 'बोरवेल सिंचाई जल की लवणता (EC / TDS) एवं सोडियम (SAR) जाँच',
      en: 'Borewell irrigation salinity (EC / TDS) & Sodium (SAR) test',
    });
  } else if (raw.waterSource === 'sweet-well') {
    priorityTests.push({
      hi: 'सिंचाई जल pH व बाइकार्बोनेट परीक्षण (ड्रिप नोज़ल सुरक्षा हेतु)',
      en: 'Water pH & bicarbonate check (to keep drip emitters clear)',
    });
  } else {
    priorityTests.push({
      hi: 'मिट्टी की जल-धारण क्षमता (Water Holding Capacity) एवं ढलान आकलन',
      en: 'Soil moisture-retention assessment & rainwater bund planning',
    });
  }

  const recommendedCrops: { hi: string; en: string }[] =
    raw.waterSource === 'saline-borewell'
      ? [
          { hi: 'जौ, सरसों व ग्वार (लवण-सहिष्णु फसलें)', en: 'Barley, Mustard & Cluster Bean (salt-tolerant)' },
          { hi: 'जीरा, ईसबगोल व देशी बेर / अनार (ड्रिप के साथ)', en: 'Cumin, Isabgol & Native Ber / Pomegranate (with drip)' },
          { hi: 'मेड़ पर खेजड़ी, नीम व करंज के रक्षक वृक्ष', en: 'Khejri, Neem & Karanj windbreak border trees' },
        ]
      : raw.waterSource === 'sweet-well'
        ? [
            { hi: 'मूँग, मोठ, चना व देशी सब्ज़ियाँ (फसल चक्र में)', en: 'Moong, Moth, Gram & seasonal vegetables (in rotation)' },
            { hi: 'आँवला, नींबू, अमरूद व मौसमी बागवानी', en: 'Amla, Lemon, Guava & orchard intercropping' },
            { hi: 'गौशाला हेतु नेपियर घास व रिजका हरा चारा पट्टी', en: 'Napier grass & Lucerne green fodder strip' },
          ]
        : [
            { hi: 'बाजरा + मोठ / मूँग (पारंपरिक मिश्रित बारानी खेती)', en: 'Pearl Millet (Bajra) + Moth / Moong mixed cropping' },
            { hi: 'तिल, ग्वार व कम पानी वाली दलहन', en: 'Sesame, Cluster Bean & low-water native pulses' },
            { hi: 'खेत की मेड़ पर खेजड़ी, रोहिड़ा व बेर (मल्चिंग सहित)', en: 'Khejri, Rohida & Ber border agroforestry with mulching' },
          ];

  const waterStrategy =
    raw.waterSource === 'saline-borewell'
      ? {
          hi: 'खारे पानी वाले खेत में सीधे खुले पानी से सिंचाई घटाकर ड्रिप सिंचाई, फसल अवशेष मल्चिंग, पर्याप्त गोबर-वर्मीकम्पोस्ट और विशेषज्ञ सलाह से जिप्सम प्रबंधन अपनाएँ।',
          en: 'Avoid open flood irrigation with saline water; adopt drip lines, dense straw mulching, generous compost humus, and lab-guided gypsum balancing.',
        }
      : raw.waterSource === 'sweet-well'
        ? {
            hi: 'मीठे जल का सदुपयोग करने हेतु बूंद-बूंद (Drip) प्रणाली, मल्चिंग और खेत के एक कोने में वर्षा जल संचयन कुंड/फार्म पॉन्ड जोड़ें—जिससे 40–50% तक जल बचत संभव है।',
            en: 'Pair sweet well water with drip irrigation, organic straw mulching, and a corner farm pond (kund) to reduce evaporation and groundwater extraction.',
          }
        : {
            hi: 'बारानी (वर्षा-आधारित) भूमि में गहरी जुताई के बजाय मेड़बंदी (Contour Bunding), पुआल मल्चिंग और खेत-तालाब/कुंड बनाकर मानसून की हर बूंद को मिट्टी की जड़ों में रोकें।',
            en: 'On rainfed land, prioritise field bunding, crop-residue mulching, and farm-pond catchment so every monsoon shower percolates deep into the root zone.',
        };

  const year2Share = Math.min(70, pilotSharePct + 30);

  return {
    totalBigha,
    pilotSharePct,
    year1PilotBigha,
    estimatedCompostKgPerYear,
    estimatedJeevamritLitersPerMonth,
    recommendedBorderSaplings,
    priorityTests,
    recommendedCrops,
    waterStrategy,
    transitionTimeline: [
      {
        year: 'Year 1',
        sharePct: pilotSharePct,
        focusHi: `लैब मिट्टी-जल जाँच + केवल ${year1PilotBigha} बीघा (${pilotSharePct}%) पर जैविक खाद, जीवामृत व मल्चिंग का सुरक्षित पायलट प्रयोग।`,
        focusEn: `Lab soil & water test + safe pilot on ${year1PilotBigha} Bigha (${pilotSharePct}%) using vermicompost, Jeevamrit & straw mulching.`,
      },
      {
        year: 'Year 2',
        sharePct: year2Share,
        focusHi: `पहले वर्ष के परिणाम देखकर ${year2Share}% भूमि तक विस्तार, ड्रिप सिंचाई एकीकरण, दलहन फसल चक्र और मेड़ पर देशी पौध संरक्षण।`,
        focusEn: `Expand to ${year2Share}% area based on Year-1 soil recovery, integrate drip irrigation, pulse rotation, and care for border saplings.`,
      },
      {
        year: 'Year 3+',
        sharePct: 100,
        focusHi: 'पुनर्जीवित जीवित मिट्टी, कम बाहरी लागत, गौशाला/FPO सामूहिक विपणन और दीर्घकालिक जलवायु-सक्षम खेत।',
        focusEn: 'Revived living soil, lower external input bills, local Gaushala/SHG value linkage, and climate-resilient multi-crop harvests.',
      },
    ],
  };
}
