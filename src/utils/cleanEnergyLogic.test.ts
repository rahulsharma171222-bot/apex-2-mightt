import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampCattleCount,
  clampSolarKw,
  calculateCleanEnergyFeasibility,
} from './cleanEnergyLogic';

test('clampCattleCount and clampSolarKw enforce realistic rural bounds', () => {
  assert.equal(clampCattleCount(0), 2);
  assert.equal(clampCattleCount(-10), 2);
  assert.equal(clampCattleCount(5000), 1500);
  assert.equal(clampSolarKw(-2), 0);
  assert.equal(clampSolarKw(3.4), 3.5);
  assert.equal(clampSolarKw(99), 50);
});

test('household scale cattle count yields realistic cooking biogas and bio-slurry', () => {
  const result = calculateCleanEnergyFeasibility({
    cattleCount: 5,
    solarKw: 2,
    goal: 'household',
  });
  assert.equal(result.dailyDungKg, 50);
  assert.equal(result.dailyRawBiogasM3, 2);
  assert.equal(result.monthlyOrganicSlurryKg, 1275);
  assert.equal(result.monthlySolarUnitsKwh, 250);
  assert.equal(result.cbgClusterEligible, false);
  assert.match(result.recommendedScaleEn, /Household/);
});

test('district CBG goal honestly rejects small herds below 10 tonnes/day threshold', () => {
  const result = calculateCleanEnergyFeasibility({
    cattleCount: 120,
    solarKw: 5,
    goal: 'district-cbg',
  });
  assert.equal(result.dailyDungKg, 1200);
  assert.equal(result.cbgClusterEligible, false);
  assert.match(result.recommendedScaleEn, /1,000\+ Cattle Cluster/);
});

test('district CBG goal marks 1,200 cattle cluster as eligible for formal feasibility DPR', () => {
  const result = calculateCleanEnergyFeasibility({
    cattleCount: 1200,
    solarKw: 10,
    goal: 'district-cbg',
  });
  assert.equal(result.dailyDungKg, 12000);
  assert.equal(result.dailyRawBiogasM3, 480);
  assert.equal(result.monthlySolarUnitsKwh, 1250);
  assert.equal(result.cbgClusterEligible, true);
  assert.match(result.recommendedScaleEn, /Feasibility Study/);
});
