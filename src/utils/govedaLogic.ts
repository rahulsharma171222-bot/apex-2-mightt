import type {
  ApplicationStatusType,
  RegistrationCategory,
  RegistrationRecord,
} from '../types/goveda';

const CATEGORY_PREFIX: Record<RegistrationCategory, string> = {
  farmer: 'FRM',
  'harit-mitra': 'HM',
  volunteer: 'VOL',
  gaushala: 'GAU',
  'ngo-institution': 'INS',
  'school-college': 'EDU',
  'women-shg': 'SHG',
  'skill-training': 'SKL',
  'csr-partner': 'CSR',
  'expert-trainer': 'EXP',
  membership: 'MEM',
  marathon: 'MRT',
};

export interface RegistrationValidationInput {
  applicantName: string;
  mobile: string;
  district: string;
  villageOrOrg: string;
  consentAccepted: boolean;
  category: RegistrationCategory;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function normalizeMobile(mobile: string): string {
  return mobile.replace(/\D/g, '').slice(-10);
}

export function validateRegistrationInput(
  input: RegistrationValidationInput,
  existingRecords: RegistrationRecord[]
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.applicantName.trim() || input.applicantName.trim().length < 2) {
    errors.applicantName = 'Please enter a valid full name (at least 2 characters).';
  }

  const cleanMobile = normalizeMobile(input.mobile);
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    errors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
  }

  if (!input.district.trim()) {
    errors.district = 'Please select or enter a district.';
  }

  if (!input.villageOrOrg.trim()) {
    errors.villageOrOrg = 'Please enter your village, gram panchayat, or organisation name.';
  }

  if (!input.consentAccepted) {
    errors.consentAccepted = 'Privacy & communication consent is required before submission.';
  }

  if (!errors.mobile) {
    const duplicate = existingRecords.find(
      (r) =>
        r.category === input.category &&
        normalizeMobile(r.mobile) === cleanMobile
    );
    if (duplicate) {
      errors.duplicate = `An application (${duplicate.applicationId}) is already registered with this mobile number for this category.`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateApplicationId(
  category: RegistrationCategory,
  sequenceNumber: number,
  year = 2026
): string {
  const prefix = CATEGORY_PREFIX[category] ?? 'GEN';
  const padded = String(Math.max(1, sequenceNumber)).padStart(4, '0');
  return `GVD-${prefix}-${year}-${padded}`;
}

export function lookupApplicationStatus(
  records: RegistrationRecord[],
  queryId: string
): RegistrationRecord | null {
  const normalized = queryId.trim().toUpperCase();
  if (!normalized) return null;
  return (
    records.find((record) => record.applicationId.toUpperCase() === normalized) ?? null
  );
}

export interface MarathonCountdown {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
}

export function getMarathonCountdown(now: Date, targetIso = '2026-12-20T06:00:00+05:30'): MarathonCountdown {
  const target = new Date(targetIso).getTime();
  const diff = target - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, isPast: false };
}

export function calculateBhilwaraProposedTarget(
  villages: number,
  farmersPerVillage: number,
  saplingsPerFarmer: number
): {
  saplingsPerVillage: number;
  totalRuralSaplings: number;
  inCrores: number;
} {
  const v = Math.max(0, Math.floor(villages));
  const f = Math.max(0, Math.floor(farmersPerVillage));
  const s = Math.max(0, Math.floor(saplingsPerFarmer));
  const saplingsPerVillage = f * s;
  const totalRuralSaplings = v * saplingsPerVillage;
  return {
    saplingsPerVillage,
    totalRuralSaplings,
    inCrores: Number((totalRuralSaplings / 10_000_000).toFixed(2)),
  };
}

export interface IndicativeCarbonInput {
  saplings: number;
  years: number;
  survivalRatePercent: number;
}

export interface IndicativeCarbonEstimate {
  plantedSaplings: number;
  survivingTrees: number;
  years: number;
  survivalRatePercent: number;
  indicativeCo2TonnesLow: number;
  indicativeCo2TonnesHigh: number;
  indicativeCreditsLow: number;
  indicativeCreditsHigh: number;
  illustrativeNetInrLow: number;
  illustrativeNetInrHigh: number;
}

/**
 * Educational, non-binding illustrative carbon absorption & credit range model
 * for arid/semi-arid Rajasthan native agroforestry (Khejri, Neem, Amla, etc.).
 * Explicitly accounts for survival mortality, ~20% registry permanence buffer,
 * and indicative project/MRV/verification cost deductions (~30–40%).
 * Never promises fixed carbon prices or guaranteed farmer payouts.
 */
export function estimateIndicativeCarbonImpact(
  input: IndicativeCarbonInput
): IndicativeCarbonEstimate {
  const plantedSaplings = Math.max(10, Math.min(10000, Math.round(input.saplings)));
  const years = Math.max(5, Math.min(30, Math.round(input.years)));
  const survivalRatePercent = Math.max(40, Math.min(95, Math.round(input.survivalRatePercent)));

  const survivingTrees = Math.round((plantedSaplings * survivalRatePercent) / 100);

  // Conservative annual CO2e uptake per surviving native dryland tree (kg/tree/year):
  // Early years accumulate slower; maturity increases annual sequestration modestly.
  const maturityFactor = years <= 5 ? 0.65 : years <= 10 ? 0.85 : years <= 15 ? 1.0 : 1.1;
  const lowKgPerTreePerYear = 10 * maturityFactor;
  const highKgPerTreePerYear = 18 * maturityFactor;

  const rawTonnesLow = (survivingTrees * lowKgPerTreePerYear * years) / 1000;
  const rawTonnesHigh = (survivingTrees * highKgPerTreePerYear * years) / 1000;

  // Apply 20% registry permanence/uncertainty buffer for indicative issuable credits
  const bufferMultiplier = 0.8;
  const indicativeCreditsLow = Number((rawTonnesLow * bufferMultiplier).toFixed(1));
  const indicativeCreditsHigh = Number((rawTonnesHigh * bufferMultiplier).toFixed(1));

  // Illustrative educational net range (INR) assuming highly variable voluntary market
  // scenarios (~₹450–₹950/credit gross) minus ~35% project/MRV/audit/registry expenses
  const netRetention = 0.65;
  const illustrativeNetInrLow = Math.round(indicativeCreditsLow * 450 * netRetention);
  const illustrativeNetInrHigh = Math.round(indicativeCreditsHigh * 950 * netRetention);

  return {
    plantedSaplings,
    survivingTrees,
    years,
    survivalRatePercent,
    indicativeCo2TonnesLow: Number(rawTonnesLow.toFixed(1)),
    indicativeCo2TonnesHigh: Number(rawTonnesHigh.toFixed(1)),
    indicativeCreditsLow,
    indicativeCreditsHigh,
    illustrativeNetInrLow,
    illustrativeNetInrHigh,
  };
}

export function serializeRegistrationsToCsv(records: RegistrationRecord[]): string {
  const headers = [
    'Application ID',
    'Category',
    'Applicant Name',
    'Mobile',
    'District',
    'Village / Organisation',
    'Details',
    'Status',
    'Submitted At',
  ];
  const escapeCell = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const rows = records.map((r) =>
    [
      r.applicationId,
      r.category,
      r.applicantName,
      r.mobile,
      r.district,
      r.villageOrOrg,
      r.details,
      r.status,
      r.submittedAt,
    ]
      .map(escapeCell)
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export const SEED_REGISTRATIONS: RegistrationRecord[] = [
  {
    applicationId: 'GVD-FRM-2026-1001',
    category: 'farmer',
    applicantName: 'Rameshwar Jat',
    mobile: '9829011223',
    district: 'Bhilwara',
    villageOrOrg: 'Mandalgarh Gram Panchayat',
    details: '2.5 Bigha · Interested in Neem, Khejri & Deshi Amla boundary plantation',
    submittedAt: '2026-11-10',
    status: 'Under Preliminary Review' as ApplicationStatusType,
    consentAccepted: true,
  },
  {
    applicationId: 'GVD-HM-2026-1002',
    category: 'harit-mitra',
    applicantName: 'Kavita Choudhary',
    mobile: '9414022334',
    district: 'Churu',
    villageOrOrg: 'Sardarshahar Cluster',
    details: 'Graduate · Village outreach & nursery awareness volunteer',
    submittedAt: '2026-11-12',
    status: 'Field Verification Pending' as ApplicationStatusType,
    consentAccepted: true,
  },
];
