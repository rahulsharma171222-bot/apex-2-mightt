import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrganicTransitionPlan,
  clampBigha,
} from './organicFarmingLogic';

test('clampBigha enforces sensible rural bounds', () => {
  assert.equal(clampBigha(0), 1);
  assert.equal(clampBigha(-5), 1);
  assert.equal(clampBigha(Number.NaN), 1);
  assert.equal(clampBigha(4.56), 4.6);
  assert.equal(clampBigha(250), 100);
});

test('chemical-heavy farm starts cautiously at 25% Year-1 pilot area', () => {
  const plan = calculateOrganicTransitionPlan({
    bigha: 8,
    waterSource: 'saline-borewell',
    soilCondition: 'chemical-heavy',
  });

  assert.equal(plan.pilotSharePct, 25);
  assert.equal(plan.year1PilotBigha, 2);
  assert.equal(plan.estimatedCompostKgPerYear, 1200);
  assert.equal(plan.estimatedJeevamritLitersPerMonth, 200);
  assert.equal(plan.transitionTimeline.length, 3);
  assert.equal(plan.transitionTimeline[0].sharePct, 25);
  assert.equal(plan.transitionTimeline[2].sharePct, 100);
  assert.ok(
    plan.priorityTests.some((t) => t.en.toLowerCase().includes('salinity')),
    'saline borewell must recommend EC/TDS salinity testing'
  );
});

test('rainfed traditional farm receives higher pilot share and rainwater bund strategy', () => {
  const plan = calculateOrganicTransitionPlan({
    bigha: 4,
    waterSource: 'rainfed',
    soilCondition: 'traditional-low-input',
  });

  assert.equal(plan.pilotSharePct, 50);
  assert.equal(plan.year1PilotBigha, 2);
  assert.ok(plan.waterStrategy.en.toLowerCase().includes('bunding'));
  assert.ok(plan.recommendedBorderSaplings >= 12);
});
