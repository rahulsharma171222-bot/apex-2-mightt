import type {
  AdminCampaignRecord,
  AdminContentItem,
  AdminDistrictRecord,
  AdminMarathonEvent,
  AdminProjectRecord,
  PublicBootstrapPayload,
} from '../admin/types';
import { INDIA_STATES_DIRECTORY, findStateByNameOrSlug } from '../data/indiaLocations';

export interface PanIndiaLocationFilter {
  stateSlug: string;
  district: string;
  subDistrict: string;
  villageOrTown: string;
}

export interface PanIndiaFilteredResults {
  selectedStateNameEn: string;
  selectedStateNameHi: string;
  availableDistricts: string[];
  availableSubDistricts: string[];
  availableVillages: string[];
  campaigns: AdminCampaignRecord[];
  districts: AdminDistrictRecord[];
  projects: AdminProjectRecord[];
  events: AdminMarathonEvent[];
  updates: AdminContentItem[];
  totalMatches: number;
}

function norm(val?: string | null): string {
  return (val ?? '').trim().toLowerCase();
}

function matchesLocationValue(recordVal: string | undefined | null, filterVal: string): boolean {
  if (!filterVal.trim()) return true;
  const r = norm(recordVal);
  const f = norm(filterVal);
  if (!r) return false;
  return r === f || r.includes(f) || f.includes(r);
}

function splitCleanList(values: (string | undefined | null)[]): string[] {
  const seen = new Map<string, string>();
  for (const raw of values) {
    if (!raw) continue;
    for (const part of raw.split(/[,/]/)) {
      const cleaned = part.trim();
      if (!cleaned) continue;
      const key = cleaned.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, cleaned);
      }
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

export function resolvePanIndiaLocationFeed(
  bootstrap: PublicBootstrapPayload | null,
  filter: PanIndiaLocationFilter
): PanIndiaFilteredResults {
  const stateObj =
    findStateByNameOrSlug(filter.stateSlug) ??
    (filter.stateSlug ? undefined : undefined);

  const selectedStateNameEn = stateObj?.nameEn ?? '';
  const selectedStateNameHi = stateObj?.nameHi ?? '';

  const allDistricts = (bootstrap?.districts ?? []).filter((d) => d.isActive !== false);
  const allCampaigns = (bootstrap?.campaigns ?? []).filter((c) => c.isPublished !== false);
  const allProjects = bootstrap?.projects ?? [];
  const allEvents = bootstrap?.marathonEvents ?? [];
  const allUpdates = (bootstrap?.contentItems ?? []).filter((c) => c.status === 'Published');

  // 1. State-level matching
  const stateMatches = (stateField?: string | null, stateSlugField?: string | null, fallbackDistrict?: string | null): boolean => {
    if (!stateObj) return true;
    if (norm(stateSlugField) === 'all-india' || norm(stateField) === 'all india') return true;
    if (norm(stateSlugField) === stateObj.slug) return true;
    if (norm(stateField) === norm(stateObj.nameEn) || norm(stateField) === norm(stateObj.nameHi)) return true;
    // Legacy Rajasthan records without explicit stateName
    if (stateObj.slug === 'rajasthan' && !norm(stateField) && fallbackDistrict) {
      return stateObj.districts.some((d) => norm(d) === norm(fallbackDistrict));
    }
    return false;
  };

  const stateDistrictRecords = allDistricts.filter((d) =>
    stateMatches(d.stateNameEn, d.stateSlug, d.nameEn)
  );
  const stateCampaigns = allCampaigns.filter((c) =>
    c.scope === 'National' || stateMatches(c.stateName, c.stateSlug, c.district)
  );
  const stateProjects = allProjects.filter((p) =>
    stateMatches(p.stateName, undefined, p.district)
  );
  const stateEvents = allEvents.filter((e) =>
    stateMatches(e.stateName, undefined, e.district)
  );
  const stateUpdates = allUpdates.filter((u) =>
    stateMatches(u.stateName, undefined, u.districtName)
  );

  // 2. Available districts for selected state (directory + any custom admin districts)
  const availableDistricts = stateObj
    ? Array.from(
        new Set([
          ...stateObj.districts,
          ...stateDistrictRecords.map((d) => d.nameEn),
          ...stateCampaigns
            .map((c) => c.district)
            .filter((d) => d && norm(d) !== 'all districts'),
          ...stateProjects.map((p) => p.district).filter(Boolean),
          ...stateEvents.map((e) => e.district).filter(Boolean),
        ])
      ).sort((a, b) => a.localeCompare(b))
    : Array.from(
        new Set([
          ...allDistricts.map((d) => d.nameEn),
          ...allCampaigns
            .map((c) => c.district)
            .filter((d) => d && norm(d) !== 'all districts'),
          ...allProjects.map((p) => p.district).filter(Boolean),
          ...allEvents.map((e) => e.district).filter(Boolean),
        ])
      ).sort((a, b) => a.localeCompare(b));

  // 3. Filter down by District
  const districtFilteredRecords = filter.district
    ? stateDistrictRecords.filter((d) => matchesLocationValue(d.nameEn, filter.district))
    : stateDistrictRecords;

  const districtFilteredCampaigns = filter.district
    ? stateCampaigns.filter(
        (c) =>
          c.scope === 'National' ||
          c.scope === 'Statewide' ||
          norm(c.district) === 'all districts' ||
          matchesLocationValue(c.district, filter.district)
      )
    : stateCampaigns;

  const districtFilteredProjects = filter.district
    ? stateProjects.filter(
        (p) =>
          matchesLocationValue(p.district, filter.district) ||
          matchesLocationValue(p.locationEn, filter.district)
      )
    : stateProjects;

  const districtFilteredEvents = filter.district
    ? stateEvents.filter((e) => matchesLocationValue(e.district, filter.district))
    : stateEvents;

  const districtFilteredUpdates = filter.district
    ? stateUpdates.filter((u) => matchesLocationValue(u.districtName, filter.district))
    : stateUpdates;

  // 4. Available Sub-Districts / Cities / Tehsils derived from active data for that district
  const availableSubDistricts = splitCleanList([
    ...districtFilteredRecords.flatMap((d) => d.subDistricts ?? []),
    ...districtFilteredCampaigns.map((c) => c.subDistrict),
    ...districtFilteredProjects.map((p) => p.subDistrict),
    ...districtFilteredEvents.map((e) => e.subDistrict),
    ...districtFilteredUpdates.map((u) => u.subDistrict),
  ]);

  // 5. Filter down by Sub-District
  const subDistrictCampaigns = filter.subDistrict
    ? districtFilteredCampaigns.filter(
        (c) =>
          !c.subDistrict || matchesLocationValue(c.subDistrict, filter.subDistrict)
      )
    : districtFilteredCampaigns;

  const subDistrictProjects = filter.subDistrict
    ? districtFilteredProjects.filter((p) => matchesLocationValue(p.subDistrict, filter.subDistrict))
    : districtFilteredProjects;

  const subDistrictEvents = filter.subDistrict
    ? districtFilteredEvents.filter((e) => matchesLocationValue(e.subDistrict, filter.subDistrict))
    : districtFilteredEvents;

  const subDistrictUpdates = filter.subDistrict
    ? districtFilteredUpdates.filter((u) => matchesLocationValue(u.subDistrict, filter.subDistrict))
    : districtFilteredUpdates;

  const subDistrictRecords = filter.subDistrict
    ? districtFilteredRecords.filter((d) =>
        (d.subDistricts ?? []).some((sd) => matchesLocationValue(sd, filter.subDistrict))
      )
    : districtFilteredRecords;

  // 6. Available Towns / Kasbas / Villages derived from matching records
  const availableVillages = splitCleanList([
    ...subDistrictRecords.flatMap((d) => d.villages ?? []),
    ...subDistrictCampaigns.map((c) => c.villageOrTown),
    ...subDistrictProjects.map((p) => p.villageOrTown),
    ...subDistrictEvents.map((e) => e.villageOrTown),
    ...subDistrictUpdates.map((u) => u.villageOrTown),
  ]);

  // 7. Filter down by Town / Kasba / Village
  const finalCampaigns = filter.villageOrTown
    ? subDistrictCampaigns.filter(
        (c) =>
          !c.villageOrTown ||
          matchesLocationValue(c.villageOrTown, filter.villageOrTown)
      )
    : subDistrictCampaigns;

  const finalProjects = filter.villageOrTown
    ? subDistrictProjects.filter((p) =>
        matchesLocationValue(p.villageOrTown, filter.villageOrTown)
      )
    : subDistrictProjects;

  const finalEvents = filter.villageOrTown
    ? subDistrictEvents.filter((e) =>
        matchesLocationValue(e.villageOrTown, filter.villageOrTown)
      )
    : subDistrictEvents;

  const finalUpdates = filter.villageOrTown
    ? subDistrictUpdates.filter((u) =>
        matchesLocationValue(u.villageOrTown, filter.villageOrTown)
      )
    : subDistrictUpdates;

  const finalDistricts = filter.villageOrTown
    ? subDistrictRecords.filter((d) =>
        (d.villages ?? []).some((v) => matchesLocationValue(v, filter.villageOrTown))
      )
    : subDistrictRecords;

  return {
    selectedStateNameEn,
    selectedStateNameHi,
    availableDistricts,
    availableSubDistricts,
    availableVillages,
    campaigns: finalCampaigns,
    districts: finalDistricts,
    projects: finalProjects,
    events: finalEvents,
    updates: finalUpdates,
    totalMatches:
      finalCampaigns.length +
      finalDistricts.length +
      finalProjects.length +
      finalEvents.length +
      finalUpdates.length,
  };
}

export function getStatesSummary(bootstrap: PublicBootstrapPayload | null) {
  const activeStateSlugs = new Set<string>();
  for (const d of bootstrap?.districts ?? []) {
    if (d.stateSlug) activeStateSlugs.add(d.stateSlug.toLowerCase());
    else activeStateSlugs.add('rajasthan');
  }
  for (const c of bootstrap?.campaigns ?? []) {
    const st = findStateByNameOrSlug(c.stateSlug || c.stateName || '');
    if (st) activeStateSlugs.add(st.slug);
  }
  for (const p of bootstrap?.projects ?? []) {
    const st = findStateByNameOrSlug(p.stateName ?? '');
    if (st) activeStateSlugs.add(st.slug);
  }
  for (const e of bootstrap?.marathonEvents ?? []) {
    const st = findStateByNameOrSlug(e.stateName ?? '');
    if (st) activeStateSlugs.add(st.slug);
  }
  return {
    totalStatesAndUts: INDIA_STATES_DIRECTORY.length,
    activeStatesCount: Math.max(1, activeStateSlugs.size),
    activeStateSlugs: Array.from(activeStateSlugs),
  };
}
