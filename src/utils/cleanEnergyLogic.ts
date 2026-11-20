// Pure domain logic for GOVEDA Mission 04 — Clean Energy (Solar, Biogas & Proposed CBG)
// Provides conservative, transparent orientation estimates — never promises guaranteed revenue or instant CBG plants.

export type CleanEnergyGoal = 'household' | 'gaushala' | 'district-cbg';

export interface CleanEnergyEstimatorInput {
  cattleCount: number;
  solarKw: number;
  goal: CleanEnergyGoal;
}

export interface CleanEnergyEstimatorOutput {
  cattleCount: number;
  solarKw: number;
  dailyDungKg: number;
  dailyRawBiogasM3: number;
  monthlyLpgEquivCylinders: number;
  monthlyOrganicSlurryKg: number;
  monthlySolarUnitsKwh: number;
  recommendedScaleHi: string;
  recommendedScaleEn: string;
  technicalNoteHi: string;
  technicalNoteEn: string;
  cbgClusterEligible: boolean;
}

export function clampCattleCount(value: number): number {
  if (!Number.isFinite(value) || value < 2) return 2;
  if (value > 1500) return 1500;
  return Math.round(value);
}

export function clampSolarKw(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  if (value > 50) return 50;
  return Math.round(value * 2) / 2;
}

/**
 * Conservative rural bio-energy & Rajasthan rooftop solar orientation model:
 * - ~10 kg collectible fresh dung per adult indigenous cow/day
 * - ~0.04 m³ raw biogas per kg fresh dung (ambient Rajasthan climate)
 * - ~33 m³ raw biogas ≈ energy equivalent of one 14.2 kg domestic LPG cylinder
 * - ~8.5 kg enriched semi-solid bio-slurry residue per 10 kg fresh dung (after moisture balance)
 * - ~125 kWh/month per installed kW of Rajasthan solar PV (~300+ clear sunny days/year)
 * - Viable commercial CBG plants generally require >= 10,000 kg/day (10+ tonnes/day, ~1,000+ cattle cluster)
 *   plus dedicated purification (>90% CH4), high-pressure compression, and PESO statutory approvals.
 */
export function calculateCleanEnergyFeasibility(
  raw: CleanEnergyEstimatorInput
): CleanEnergyEstimatorOutput {
  const cattleCount = clampCattleCount(raw.cattleCount);
  const solarKw = clampSolarKw(raw.solarKw);

  const dailyDungKg = Math.round(cattleCount * 10);
  const dailyRawBiogasM3 = Math.round(dailyDungKg * 0.04 * 10) / 10;
  const monthlyBiogasM3 = dailyRawBiogasM3 * 30;
  const monthlyLpgEquivCylinders = Math.round((monthlyBiogasM3 / 33) * 10) / 10;
  const monthlyOrganicSlurryKg = Math.round(dailyDungKg * 0.85 * 30);
  const monthlySolarUnitsKwh = Math.round(solarKw * 125);

  const cbgClusterEligible = dailyDungKg >= 10000;

  let recommendedScaleHi: string;
  let recommendedScaleEn: string;
  let technicalNoteHi: string;
  let technicalNoteEn: string;

  if (raw.goal === 'district-cbg') {
    if (cbgClusterEligible) {
      recommendedScaleHi = 'प्रस्तावित जिला-स्तरीय CBG क्लस्टर व्यवहार्यता अध्ययन योग्य (10+ टन गोबर/दिन)';
      recommendedScaleEn = 'Eligible for Proposed District CBG Feasibility Study (10+ Tonnes Dung/Day)';
      technicalNoteHi =
        'यह अनुमानित गोबर मात्रा जिला-स्तरीय CBG व्यवहार्यता मूल्यांकन (DPR) की प्रारंभिक सीमा के अनुरूप है। वास्तविक संयंत्र हेतु गैस शुद्धिकरण (>90% मीथेन), PESO सुरक्षा स्वीकृति, जल उपलब्धता और गैस-ऑफटेक अनुबंध आवश्यक होंगे।';
      technicalNoteEn =
        'This cluster feedstock reaches the preliminary threshold for a formal District CBG feasibility study (DPR). Actual deployment requires >90% CH₄ scrubbing, PESO safety approvals, assured water supply, and verified offtake agreements.';
    } else {
      recommendedScaleHi = 'वर्तमान संख्या घरेलू/गौशाला बायोगैस के लिए उपयुक्त (CBG हेतु 1,000+ पशु क्लस्टर आवश्यक)';
      recommendedScaleEn = 'Best Suited for Village/Gaushala Biogas (CBG Needs ~1,000+ Cattle Cluster)';
      technicalNoteHi =
        'वाहन-योग्य CBG (Bio-CNG) के लिए कम से कम 10–20 टन दैनिक गोबर (लगभग 1,000+ पशुओं का साझा क्लस्टर) और औद्योगिक शुद्धिकरण संयंत्र आवश्यक होता है। वर्तमान संख्या पर रसोई बायोगैस + जैव-स्लरी खाद सबसे सुरक्षित और व्यावहारिक विकल्प है।';
      technicalNoteEn =
        'Vehicle-grade CBG typically needs 10–20 tonnes of daily feedstock (~1,000+ pooled cattle) plus industrial purification & compression. At this herd size, low-pressure cooking biogas + farm bio-slurry is far safer and more viable.';
    }
  } else if (cattleCount <= 12) {
    recommendedScaleHi = 'घरेलू / किसान परिवार बायोगैस इकाई (2–4 m³ डाइजेस्टर)';
    recommendedScaleEn = 'Household / Smallholder Biogas Unit (2–4 m³ Digester)';
    technicalNoteHi =
      'कम दबाव वाले विशेष बायोगैस चूल्हे में धुआँ-रहित रसोई गैस और खेत के लिए प्रति माह समृद्ध जैव-स्लरी खाद—घरेलू LPG सिलेंडर में भरने का प्रयास कभी न करें।';
    technicalNoteEn =
      'Supplies low-pressure smokeless kitchen gas via a dedicated biogas burner plus monthly organic farm slurry—never attempt to compress raw biogas into domestic LPG cylinders.';
  } else if (cattleCount <= 250) {
    recommendedScaleHi = 'सामुदायिक / आत्मनिर्भर गौशाला बायोगैस संयंत्र (10–85 m³)';
    recommendedScaleEn = 'Community / Self-Reliant Gaushala Biogas Plant (10–85 m³)';
    technicalNoteHi =
      'गौशाला की रसोई, गर्म पानी, चारा प्रसंस्करण या बायोगैस जेनसेट तथा स्थानीय किसानों को वर्मीकम्पोस्ट/जैव-स्लरी आपूर्ति के लिए अत्यंत व्यावहारिक मॉडल।';
    technicalNoteEn =
      'Practical institutional scale for Gaushala kitchens, water heating, clean power support, and enriching vermicompost/bio-slurry for surrounding organic farms.';
  } else {
    recommendedScaleHi = 'बृहद गौशाला क्लस्टर बायोगैस / प्रस्तावित CBG मूल्यांकन स्तर';
    recommendedScaleEn = 'Large Gaushala Cluster Biogas / Proposed CBG Assessment Tier';
    technicalNoteHi =
      'बड़े पशुधन क्लस्टर में सामुदायिक तापीय ऊर्जा, जैव-स्लरी उर्वरक इकाई या अधिकृत इंजीनियरिंग साझेदारों के साथ CBG व्यवहार्यता अध्ययन किया जा सकता है।';
    technicalNoteEn =
      'Large pooled herds can support institutional thermal energy, regional bio-slurry fertiliser units, or a formal engineering feasibility study for a compliant CBG plant.';
  }

  return {
    cattleCount,
    solarKw,
    dailyDungKg,
    dailyRawBiogasM3,
    monthlyLpgEquivCylinders,
    monthlyOrganicSlurryKg,
    monthlySolarUnitsKwh,
    recommendedScaleHi,
    recommendedScaleEn,
    technicalNoteHi,
    technicalNoteEn,
    cbgClusterEligible,
  };
}
