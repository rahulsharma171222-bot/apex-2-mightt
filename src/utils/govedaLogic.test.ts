import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBhilwaraProposedTarget,
  estimateIndicativeCarbonImpact,
  generateApplicationId,
  getMarathonCountdown,
  lookupApplicationStatus,
  SEED_REGISTRATIONS,
  serializeRegistrationsToCsv,
  validateRegistrationInput,
} from './govedaLogic';

test('generateApplicationId formats prefix, year, and padded sequence', () => {
  assert.equal(generateApplicationId('farmer', 1, 2026), 'GVD-FRM-2026-0001');
  assert.equal(generateApplicationId('harit-mitra', 42, 2026), 'GVD-HM-2026-0042');
  assert.equal(generateApplicationId('marathon', 105, 2026), 'GVD-MRT-2026-0105');
});

test('validateRegistrationInput rejects invalid mobile, missing consent, and duplicate mobile', () => {
  const invalid = validateRegistrationInput(
    {
      applicantName: 'A',
      mobile: '12345',
      district: '',
      villageOrOrg: '',
      consentAccepted: false,
      category: 'farmer',
    },
    SEED_REGISTRATIONS
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.applicantName);
  assert.ok(invalid.errors.mobile);
  assert.ok(invalid.errors.consentAccepted);

  const duplicate = validateRegistrationInput(
    {
      applicantName: 'Rameshwar Jat',
      mobile: '9829011223',
      district: 'Bhilwara',
      villageOrOrg: 'Mandalgarh',
      consentAccepted: true,
      category: 'farmer',
    },
    SEED_REGISTRATIONS
  );
  assert.equal(duplicate.valid, false);
  assert.ok(duplicate.errors.duplicate);

  const valid = validateRegistrationInput(
    {
      applicantName: 'Suresh Sharma',
      mobile: '9829099887',
      district: 'Jodhpur',
      villageOrOrg: 'Osian',
      consentAccepted: true,
      category: 'farmer',
    },
    SEED_REGISTRATIONS
  );
  assert.equal(valid.valid, true);
});

test('lookupApplicationStatus matches case-insensitively', () => {
  const found = lookupApplicationStatus(SEED_REGISTRATIONS, ' gvd-frm-2026-1001 ');
  assert.ok(found);
  assert.equal(found?.district, 'Bhilwara');
  assert.equal(lookupApplicationStatus(SEED_REGISTRATIONS, 'GVD-UNKNOWN'), null);
});

test('calculateBhilwaraProposedTarget computes 1.84 crore rural aspiration accurately', () => {
  const target = calculateBhilwaraProposedTarget(1840, 100, 100);
  assert.equal(target.saplingsPerVillage, 10000);
  assert.equal(target.totalRuralSaplings, 18400000);
  assert.equal(target.inCrores, 1.84);
});

test('estimateIndicativeCarbonImpact enforces survival, permanence buffer, and non-1:1 reality', () => {
  const sample100 = estimateIndicativeCarbonImpact({
    saplings: 100,
    years: 10,
    survivalRatePercent: 75,
  });
  assert.equal(sample100.plantedSaplings, 100);
  assert.equal(sample100.survivingTrees, 75);
  assert.ok(sample100.indicativeCo2TonnesLow > 0);
  assert.ok(sample100.indicativeCo2TonnesHigh > sample100.indicativeCo2TonnesLow);
  // Permanence buffer ensures issuable credits stay below raw tonnes CO2e
  assert.ok(sample100.indicativeCreditsHigh < sample100.indicativeCo2TonnesHigh);
  // 100 saplings over 10 years NEVER produces 100 credits
  assert.ok(sample100.indicativeCreditsHigh < 50);

  const sample500 = estimateIndicativeCarbonImpact({
    saplings: 500,
    years: 15,
    survivalRatePercent: 80,
  });
  assert.ok(sample500.indicativeCreditsHigh > sample100.indicativeCreditsHigh);
  assert.ok(sample500.illustrativeNetInrHigh > sample500.illustrativeNetInrLow);
});

test('getMarathonCountdown calculates positive days before 20 Dec 2026', () => {
  const sampleNow = new Date('2026-11-18T06:00:00+05:30');
  const countdown = getMarathonCountdown(sampleNow);
  assert.equal(countdown.isPast, false);
  assert.equal(countdown.days, 32);
});

test('serializeRegistrationsToCsv outputs RFC-safe CSV with headers', () => {
  const csv = serializeRegistrationsToCsv(SEED_REGISTRATIONS);
  assert.ok(csv.startsWith('Application ID,Category,Applicant Name'));
  assert.ok(csv.includes('GVD-FRM-2026-1001'));
});
