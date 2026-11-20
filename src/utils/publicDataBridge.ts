import type { AdminDistrictRecord } from '../admin/types';
import type { DistrictOutreachItemSpec } from '../db/schema';
import { DISTRICTS_DATA } from '../data/districtsData';
import type { DistrictData } from '../types/goveda';

export interface MergedPublicDistrict extends DistrictData {
  stateSlug?: string;
  stateNameEn?: string;
  stateNameHi?: string;
  coordinatorName: string;
  outreachNotes: string;
  progressNotesHi: string;
  progressNotesEn: string;
  subDistricts: string[];
  villages: string[];
  galleryUrls: string[];
  outreachItems: DistrictOutreachItemSpec[];
  displayOrder: number;
}

const FALLBACK_COORDS: { x: number; y: number }[] = [
  { x: 72, y: 42 },
  { x: 66, y: 55 },
  { x: 48, y: 58 },
  { x: 78, y: 65 },
  { x: 52, y: 36 },
];

export function mergePublicDistricts(
  liveDistricts?: AdminDistrictRecord[]
): MergedPublicDistrict[] {
  const staticMap = new Map(DISTRICTS_DATA.map((d) => [d.slug, d]));

  if (!liveDistricts || liveDistricts.length === 0) {
    return DISTRICTS_DATA.map((d, idx) => ({
      ...d,
      stateSlug: 'rajasthan',
      stateNameEn: 'Rajasthan',
      stateNameHi: 'राजस्थान',
      coordinatorName: '',
      outreachNotes: '',
      progressNotesHi: '',
      progressNotesEn: '',
      subDistricts: [],
      villages: [],
      galleryUrls: [],
      outreachItems: [],
      displayOrder: idx + 1,
    }));
  }

  let extraIdx = 0;
  return liveDistricts
    .filter((d) => d.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((live) => {
      const base = staticMap.get(live.slug);
      if (base) {
        return {
          ...base,
          stateSlug: live.stateSlug || 'rajasthan',
          stateNameEn: live.stateNameEn || 'Rajasthan',
          stateNameHi: live.stateNameHi || 'राजस्थान',
          name: {
            hi: live.nameHi || base.name.hi,
            en: live.nameEn || base.name.en,
          },
          regionTag: {
            hi: live.regionTagHi || base.regionTag.hi,
            en: live.regionTagEn || base.regionTag.en,
          },
          focusSummary: {
            hi: live.focusSummaryHi || base.focusSummary.hi,
            en: live.focusSummaryEn || base.focusSummary.en,
          },
          coordinatorName: live.coordinatorName || '',
          outreachNotes: live.outreachNotes || '',
          progressNotesHi: live.progressNotesHi || '',
          progressNotesEn: live.progressNotesEn || '',
          subDistricts: Array.isArray(live.subDistricts) ? live.subDistricts : [],
          villages: Array.isArray(live.villages) ? live.villages : [],
          galleryUrls: Array.isArray(live.galleryUrls) ? live.galleryUrls : [],
          outreachItems: Array.isArray(live.outreachItems) ? live.outreachItems : [],
          displayOrder: live.displayOrder,
        };
      }

      const fallbackCoord = FALLBACK_COORDS[extraIdx % FALLBACK_COORDS.length];
      extraIdx += 1;
      return {
        slug: live.slug,
        stateSlug: live.stateSlug || 'rajasthan',
        stateNameEn: live.stateNameEn || 'Rajasthan',
        stateNameHi: live.stateNameHi || 'राजस्थान',
        name: { hi: live.nameHi || live.nameEn, en: live.nameEn || live.nameHi },
        regionTag: {
          hi: live.regionTagHi || 'हरित राजस्थान विस्तारित जिला',
          en: live.regionTagEn || 'Harit Rajasthan Expansion District',
        },
        focusSummary: {
          hi: live.focusSummaryHi || live.focusSummaryEn,
          en: live.focusSummaryEn || live.focusSummaryHi,
        },
        introduction: {
          hi:
            live.progressNotesHi ||
            `${live.nameHi || live.nameEn} जिले में हरित राजस्थान अभियान, किसान संपर्क, वृक्षारोपण एवं जल संरक्षण गतिविधियों का समन्वय।`,
          en:
            live.progressNotesEn ||
            `District greening campaign, farmer outreach, tree plantation, and water conservation coordination in ${live.nameEn}.`,
        },
        objectives: [
          {
            hi: live.focusSummaryHi || 'स्थानीय ग्राम पंचायत एवं हरित मित्र नेटवर्क विस्तार',
            en: live.focusSummaryEn || 'Gram Panchayat outreach & Harit Mitra network expansion',
          },
        ],
        campaigns: [
          {
            hi: live.outreachNotes || 'देशी प्रजाति वृक्षारोपण एवं जल संचयन जागरूकता',
            en: live.outreachNotes || 'Native species plantation & water harvesting awareness',
          },
        ],
        eventsHighlight: {
          hi: `${live.nameHi || live.nameEn} जिला हरित अभियान`,
          en: `${live.nameEn} District Green Drive`,
        },
        imageKey: 'haritRajasthan',
        mapCoords: { x: fallbackCoord.x, y: fallbackCoord.y, labelOffset: 'bottom' },
        coordinatorName: live.coordinatorName || '',
        outreachNotes: live.outreachNotes || '',
        progressNotesHi: live.progressNotesHi || '',
        progressNotesEn: live.progressNotesEn || '',
        subDistricts: Array.isArray(live.subDistricts) ? live.subDistricts : [],
        villages: Array.isArray(live.villages) ? live.villages : [],
        galleryUrls: Array.isArray(live.galleryUrls) ? live.galleryUrls : [],
        outreachItems: Array.isArray(live.outreachItems) ? live.outreachItems : [],
        displayOrder: live.displayOrder,
      };
    });
}
