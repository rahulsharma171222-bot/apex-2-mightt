import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS_DATA } from '../data/missionsData';
import { MISSION_RICH_CONTENT, resolveMissionSlug } from '../data/missionRichContent';
import {
  GAUSHALA_48_PRODUCTS,
  GAUSHALA_ANCHOR_TABS,
  GAUSHALA_BIOGAS_SCALES,
  GAUSHALA_ECOSYSTEM_NODES,
  GAUSHALA_FAQS,
  GAUSHALA_GOVT_SCHEMES,
  GAUSHALA_INFRA_PILLARS,
  GAUSHALA_LAND_USES,
  GAUSHALA_NATURAL_INPUTS,
  GAUSHALA_PROCUREMENT_TIERS,
  GAUSHALA_SOIL_PRINCIPLES,
  GAUSHALA_TEN_ACTIVITIES,
} from '../data/gaushalaCatalogData';

test('resolveMissionSlug resolves aliases and canonical slugs cleanly', () => {
  assert.equal(resolveMissionSlug('rural-upliftment'), 'women-empowerment');
  assert.equal(resolveMissionSlug('water-conservation'), 'heritage-solar-water');
  assert.equal(resolveMissionSlug('biogas-cbg'), 'biogas-cbg');
  assert.equal(resolveMissionSlug('  Self-Reliant-Gaushala '), 'self-reliant-gaushala');
  assert.equal(resolveMissionSlug(undefined), undefined);
});

test('every mission from 3 to 10 has complete rich sequential content and FAQs', () => {
  const missions3To10 = MISSIONS_DATA.filter((m) => m.number >= 3 && m.number <= 10);
  assert.equal(missions3To10.length, 8);

  for (const mission of missions3To10) {
    const rich = MISSION_RICH_CONTENT[mission.slug];
    assert.ok(rich, `Missing rich content for mission ${mission.number} (${mission.slug})`);
    assert.equal(rich.realities.length, 4, `${mission.slug} should have 4 why-it-matters realities`);
    assert.ok(rich.steps.length >= 5, `${mission.slug} should have at least 5 visual journey steps`);
    assert.equal(rich.rolePillars.length, 3, `${mission.slug} should have 3 GOVEDA role pillars`);
    assert.ok(rich.safeguardPoints.length >= 2, `${mission.slug} should have honest safeguard disclosures`);
    assert.ok(rich.faqs.length >= 6, `${mission.slug} should have at least 6 FAQs`);
  }
});

test('Atmanirbhar Gaushala catalog includes all 48 numbered products, 8 orbit nodes, soil principles, natural inputs, 10 activities, schemes, and 10 FAQs', () => {
  assert.equal(GAUSHALA_ANCHOR_TABS.length, 12);
  assert.equal(GAUSHALA_ECOSYSTEM_NODES.length, 8);
  assert.equal(GAUSHALA_SOIL_PRINCIPLES.length, 4);
  assert.equal(GAUSHALA_NATURAL_INPUTS.length, 4);
  assert.equal(GAUSHALA_LAND_USES.length, 5);
  assert.equal(GAUSHALA_INFRA_PILLARS.length, 4);
  assert.equal(GAUSHALA_48_PRODUCTS.length, 6);
  const allItems = GAUSHALA_48_PRODUCTS.flatMap((c) => c.items);
  assert.equal(allItems.length, 48);
  allItems.forEach((item, idx) => {
    assert.equal(item.no, idx + 1);
    assert.ok(item.hi.length > 4 && item.en.length > 4);
  });
  assert.equal(GAUSHALA_TEN_ACTIVITIES.length, 10);
  assert.equal(GAUSHALA_GOVT_SCHEMES.registered.length, 4);
  assert.equal(GAUSHALA_GOVT_SCHEMES.unregistered.length, 4);
  assert.equal(GAUSHALA_PROCUREMENT_TIERS.length, 3);
  assert.equal(GAUSHALA_BIOGAS_SCALES.length, 3);
  assert.equal(GAUSHALA_FAQS.length, 10);
});
