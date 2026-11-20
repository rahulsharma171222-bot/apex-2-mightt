import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  Compass,
  Download,
  Flag,
  FolderKanban,
  GitBranch,
  Layers,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  Sprout,
  Trophy,
  Users,
} from 'lucide-react';
import { SpringButton } from '../components/SpringMotion';
import { usePublicPortal } from '../context/PublicPortalContext';
import { MISSIONS_DATA } from '../data/missionsData';
import { PROJECTS_DATA } from '../data/siteContent';
import {
  INDIA_STATES_DIRECTORY,
  findStateByNameOrSlug,
  getCitiesAndGramsForDistrict,
} from '../data/indiaLocations';
import {
  buildProgrammeHierarchyTree,
  filterUnifiedProgrammes,
} from '../utils/adminLogic';
import type {
  ProgrammeOperationalStatus,
  ProgrammeType,
  UnifiedProgrammeRecord,
} from '../admin/types';
import type { Language } from '../types/goveda';

interface ProjectsAndCampaignsPageProps {
  lang: Language;
  onNavigate: (path: string) => void;
  initialTypeFilter?: 'all' | ProgrammeType;
}

const MISSION_ROUTE_MAP: Record<string, string> = {
  'carbon-climate': '/missions/carbon-credit',
  'harit-rajasthan': '/missions/harit-rajasthan',
  'atmanirbhar-gaushala': '/missions/atmanirbhar-gaushala',
  'senior-care-mental-health': '/missions/senior-citizen-care',
  'organic-farming': '/missions/organic-farming',
  'swachh-urja': '/missions/biogas-cbg',
  'heritage-water': '/missions/heritage-solar-water',
  'clean-india': '/missions/clean-india-plastic-free',
  'women-empowerment': '/missions/women-empowerment',
  'skill-development': '/missions/skill-development',
};

const MISSION_META_BY_SLUG: Record<
  string,
  { number: number; titleHi: string; titleEn: string; path: string }
> = {
  'carbon-climate': {
    number: 1,
    titleHi: 'कार्बन क्रेडिट एवं जलवायु परिवर्तन',
    titleEn: 'Carbon Credit & Climate Action',
    path: '/missions/carbon-credit',
  },
  'harit-rajasthan': {
    number: 2,
    titleHi: 'हरित राजस्थान एवं वृक्षारोपण',
    titleEn: 'Harit Rajasthan & Tree Plantation',
    path: '/missions/harit-rajasthan',
  },
  'atmanirbhar-gaushala': {
    number: 3,
    titleHi: 'आत्मनिर्भर गौशाला एवं गोवंश संरक्षण',
    titleEn: 'Self-Reliant Gaushala & Cow Protection',
    path: '/missions/atmanirbhar-gaushala',
  },
  'senior-care-mental-health': {
    number: 4,
    titleHi: 'वरिष्ठ नागरिक देखभाल एवं वृद्धाश्रम',
    titleEn: 'Senior Citizen Care & Vriddha Ashram',
    path: '/missions/senior-citizen-care',
  },
  'organic-farming': {
    number: 5,
    titleHi: 'जैविक खेती एवं किसान समृद्धि',
    titleEn: 'Organic Farming & Farmer Prosperity',
    path: '/missions/organic-farming',
  },
  'swachh-urja': {
    number: 6,
    titleHi: 'स्वच्छ ऊर्जा — बायोगैस, CBG व सौर',
    titleEn: 'Clean Energy — Biogas, CBG & Solar',
    path: '/missions/biogas-cbg',
  },
  'heritage-water': {
    number: 7,
    titleHi: 'सांस्कृतिक धरोहर एवं जल संरक्षण',
    titleEn: 'Cultural Heritage & Water Conservation',
    path: '/missions/heritage-solar-water',
  },
  'clean-india': {
    number: 8,
    titleHi: 'स्वच्छ भारत एवं प्लास्टिक-मुक्त अभियान',
    titleEn: 'Clean India & Plastic-Free Campaign',
    path: '/missions/clean-india-plastic-free',
  },
  'women-empowerment': {
    number: 9,
    titleHi: 'महिला सशक्तिकरण एवं स्व-सहायता समूह',
    titleEn: 'Women Empowerment & SHGs',
    path: '/missions/women-empowerment',
  },
  'skill-development': {
    number: 10,
    titleHi: 'कौशल विकास एवं युवा रोजगार',
    titleEn: 'Skill Development & Youth Employment',
    path: '/missions/skill-development',
  },
};

function formatOperationalStatus(
  status: string,
  type: ProgrammeType,
  lang: Language
): string {
  const norm = status.toLowerCase();
  const entityHi =
    type === 'project'
      ? 'परियोजना'
      : type === 'campaign'
      ? 'अभियान'
      : type === 'training'
      ? 'प्रशिक्षण'
      : 'कार्यक्रम';

  if (norm === 'proposed') {
    return lang === 'hi' ? `प्रस्तावित ${entityHi} (Proposed)` : `Proposed ${type === 'project' ? 'Project' : type === 'campaign' ? 'Campaign' : 'Initiative'}`;
  }
  if (norm === 'planned') {
    return lang === 'hi' ? `आगामी / नियोजित ${entityHi}` : 'Upcoming / Planned';
  }
  if (norm === 'under assessment') {
    return lang === 'hi' ? 'मूल्यांकनाधीन (Under Assessment)' : 'Under Assessment';
  }
  if (norm === 'approved') {
    return lang === 'hi' ? 'स्वीकृत एवं आगामी (Approved)' : 'Approved · Upcoming';
  }
  if (norm === 'ongoing' || norm === 'in progress') {
    return lang === 'hi' ? `सक्रिय / चालू ${entityHi}` : 'Active / Ongoing';
  }
  if (norm.includes('completed')) {
    return lang === 'hi' ? 'पूर्ण एवं सत्यापित' : 'Completed & Verified';
  }
  return status;
}

function getStatusAccentClass(status: string): string {
  const norm = status.toLowerCase();
  if (norm === 'ongoing' || norm === 'in progress') return 'text-[#14532D]';
  if (norm.includes('completed')) return 'text-[#0F5132]';
  if (norm === 'approved') return 'text-[#1D4ED8]';
  if (norm === 'planned' || norm === 'proposed' || norm === 'under assessment') {
    return 'text-[#9A3412]';
  }
  return 'text-[#47554B]';
}

function normalizeToken(val: string): string {
  return val.trim().toLowerCase();
}

function matchesLocationHierarchy(
  item: UnifiedProgrammeRecord,
  selectedState: string,
  selectedDistrict: string,
  selectedCity: string,
  selectedGram: string
): boolean {
  // India-wide initiatives apply everywhere unless a very narrow Gram/Ward is chosen
  // (we still surface India-wide entries when filtering by State/District if they list that location or are pan-India)
  if (!selectedState) return true;

  const stNorm = normalizeToken(selectedState);
  const distNorm = normalizeToken(selectedDistrict);
  const cityNorm = normalizeToken(selectedCity);
  const gramNorm = normalizeToken(selectedGram);

  const locs = item.locations ?? [];
  const textCorpus = `${item.titleEn} ${item.titleHi} ${item.summaryEn} ${item.venueOrMode} ${locs
    .map((l) => `${l.stateName} ${l.district} ${l.localityName}`)
    .join(' ')}`.toLowerCase();

  // Check state
  const stateMatched =
    item.coverageScope === 'india-wide' ||
    locs.some((l) => normalizeToken(l.stateName) === stNorm);
  if (!stateMatched) return false;

  if (!distNorm) return true;

  // Check district
  const districtMatched =
    locs.some((l) => normalizeToken(l.district) === distNorm) ||
    (item.coverageScope === 'india-wide' && !cityNorm && !gramNorm);
  if (!districtMatched) return false;

  if (!cityNorm) return true;

  // Check city / tehsil / block: extract meaningful words from city label (e.g. "Bhilwara City / Suwana")
  const cityTokens = cityNorm
    .split(/[\/,&-]+/)
    .map((t) => t.replace(/\b(city|tehsil|block|municipal|area|urban|rural|belt)\b/g, '').trim())
    .filter((t) => t.length >= 3);

  const cityMatched =
    locs.some((l) => {
      const locStr = `${l.district} ${l.localityName}`.toLowerCase();
      if (locStr.includes(cityNorm)) return true;
      if (l.locationLevel === 'Entire District' && normalizeToken(l.district) === distNorm) {
        return true;
      }
      return cityTokens.some((tok) => locStr.includes(tok));
    }) || cityTokens.some((tok) => textCorpus.includes(tok));

  if (!cityMatched) return false;

  if (!gramNorm) return true;

  // Check gram / village / ward
  const gramTokens = gramNorm
    .split(/[\/,&-]+/)
    .map((t) =>
      t
        .replace(/\b(gram|panchayat|cluster|kasba|urban|rural|belt|town|village|area)\b/g, '')
        .trim()
    )
    .filter((t) => t.length >= 3);

  const gramMatched =
    locs.some((l) => {
      const locStr = `${l.localityName}`.toLowerCase();
      if (locStr.includes(gramNorm)) return true;
      if (l.locationLevel === 'Entire District' && normalizeToken(l.district) === distNorm) {
        return true;
      }
      return gramTokens.some((tok) => locStr.includes(tok));
    }) || gramTokens.some((tok) => textCorpus.includes(tok));

  return gramMatched;
}

export function ProjectsAndCampaignsPage({
  lang,
  onNavigate,
  initialTypeFilter = 'all',
}: ProjectsAndCampaignsPageProps) {
  const { bootstrap } = usePublicPortal();

  // 4-Level Cascading Geographic Filter State
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedGram, setSelectedGram] = useState<string>('');

  // Programme Type, Mission, Operational Status & Search Filters
  const [typeFilter, setTypeFilter] = useState<'all' | ProgrammeType>(initialTypeFilter);
  const [missionFilter, setMissionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publishedMetrics = (bootstrap?.impactMetrics ?? []).filter((m) => m.isPublished);

  // Live published unified programmes (Projects, Campaigns, Events, Training)
  const publishedProgrammes = useMemo(
    () =>
      filterUnifiedProgrammes(bootstrap?.programmes ?? [], {
        onlyPublished: true,
      }),
    [bootstrap?.programmes]
  );

  // Also include baseline institutional projects from PROJECTS_DATA / bootstrap.projects
  // that aren't already represented in unified programmes, mapped honestly as project records
  const allDisplayProgrammes = useMemo<UnifiedProgrammeRecord[]>(() => {
    const unified = [...publishedProgrammes];
    const existingTitles = new Set(unified.map((u) => u.titleEn.toLowerCase()));

    const legacySource =
      bootstrap?.projects && bootstrap.projects.length > 0
        ? bootstrap.projects.map((p) => ({
            id: `leg-${p.id}`,
            titleEn: p.titleEn,
            titleHi: p.titleHi,
            locationEn: p.locationEn,
            missionCategoryEn: p.missionCategoryEn,
            objectivesEn: p.objectivesEn,
            objectivesHi: p.objectivesHi,
            beneficiaryEn: p.beneficiaryEn,
            status: p.status as ProgrammeOperationalStatus,
            startDate: p.startDate,
            imageUrl: p.imageUrl,
            reportUrl: p.reportUrl,
          }))
        : PROJECTS_DATA.map((p) => ({
            id: `leg-${p.id}`,
            titleEn: p.title.en,
            titleHi: p.title.hi,
            locationEn: p.location.en,
            missionCategoryEn: p.missionCategory.en,
            objectivesEn: p.objectives.en,
            objectivesHi: p.objectives.hi,
            beneficiaryEn: p.beneficiaryCategory.en,
            status: p.status as ProgrammeOperationalStatus,
            startDate: '',
            imageUrl: '',
            reportUrl: '',
          }));

    for (const lp of legacySource) {
      if (existingTitles.has(lp.titleEn.toLowerCase())) continue;
      // Map mission category text to mission slug cleanly
      const cat = lp.missionCategoryEn.toLowerCase();
      const inferredMission = cat.includes('gaushala')
        ? 'atmanirbhar-gaushala'
        : cat.includes('carbon')
        ? 'carbon-climate'
        : cat.includes('clean') || cat.includes('plastic')
        ? 'clean-india'
        : cat.includes('energy') || cat.includes('biogas')
        ? 'swachh-urja'
        : cat.includes('senior') || cat.includes('elder')
        ? 'senior-care-mental-health'
        : cat.includes('organic') || cat.includes('farm')
        ? 'organic-farming'
        : cat.includes('women')
        ? 'women-empowerment'
        : cat.includes('skill')
        ? 'skill-development'
        : cat.includes('water') || cat.includes('heritage')
        ? 'heritage-water'
        : 'harit-rajasthan';

      const locLower = lp.locationEn.toLowerCase();
      const matchedRajasthanDistrict =
        findStateByNameOrSlug('rajasthan')?.districts.find((d) =>
          locLower.includes(d.toLowerCase())
        ) ?? 'Bhilwara';

      unified.push({
        id: lp.id,
        programmeCode: `GVD-PRJ-${matchedRajasthanDistrict.slice(0, 3).toUpperCase()}-2026`,
        type: 'project',
        parentId: null,
        titleEn: lp.titleEn,
        titleHi: lp.titleHi,
        summaryEn: lp.objectivesEn,
        summaryHi: lp.objectivesHi,
        objectivesEn: lp.objectivesEn,
        objectivesHi: lp.objectivesHi,
        coverageScope: locLower.includes('multi') || locLower.includes('rajasthan') ? 'specific' : 'specific',
        locations: [
          {
            id: `loc-${lp.id}`,
            stateName: 'Rajasthan',
            district: matchedRajasthanDistrict,
            locationLevel: 'Entire District',
            localityName: lp.locationEn,
          },
        ],
        missionSlug: inferredMission,
        missionSlugs: [inferredMission],
        linkedFormType: 'partnership',
        linkedFormTypes: ['csr-partner', 'farmer'],
        publicationStatus: 'Published',
        operationalStatus: lp.status,
        startDate: lp.startDate || '',
        endDate: '',
        venueOrMode: lp.locationEn,
        targetAudience: lp.beneficiaryEn,
        seoTitle: lp.titleEn,
        seoDescription: lp.objectivesEn,
        media: lp.imageUrl
          ? [
              {
                id: `med-${lp.id}`,
                mediaType: 'photo',
                url: lp.imageUrl,
                title: lp.titleEn,
                caption: lp.locationEn,
                altText: lp.titleEn,
                capturedDate: '',
                locationLabel: lp.locationEn,
                isCover: true,
                isPublic: true,
                displayOrder: 1,
              },
            ]
          : [],
        roles: [],
        updatedAt: '',
      });
    }

    return unified;
  }, [publishedProgrammes, bootstrap?.projects]);

  // Cascading Step 2: Districts of Selected State
  const availableDistricts = useMemo(() => {
    if (!selectedState) return [];
    const st = findStateByNameOrSlug(selectedState);
    return st?.districts ?? [];
  }, [selectedState]);

  // Cascading Step 3: Cities / Tehsils / Blocks of Selected District
  const cityGroups = useMemo(() => {
    if (!selectedDistrict) return [];
    const matchedAdminDistrict = (bootstrap?.districts ?? []).find(
      (d) => d.nameEn.toLowerCase() === selectedDistrict.toLowerCase()
    );
    const progLocalities = allDisplayProgrammes
      .flatMap((p) => p.locations)
      .filter((l) => l.district.toLowerCase() === selectedDistrict.toLowerCase())
      .map((l) => l.localityName)
      .filter(Boolean);

    return getCitiesAndGramsForDistrict(
      selectedDistrict,
      matchedAdminDistrict?.subDistricts ?? [],
      [...(matchedAdminDistrict?.villages ?? []), ...progLocalities]
    );
  }, [selectedDistrict, bootstrap?.districts, allDisplayProgrammes]);

  // Cascading Step 4: Grams / Villages / Wards of Selected City
  const availableGramsAndWards = useMemo(() => {
    if (!selectedCity) return [];
    const found = cityGroups.find((g) => g.name === selectedCity);
    return found?.villages ?? [];
  }, [selectedCity, cityGroups]);

  // Filter programmes across all dimensions
  const filteredProgrammes = useMemo(() => {
    return allDisplayProgrammes.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      if (missionFilter !== 'all') {
        const linkedMissions =
          item.missionSlugs && item.missionSlugs.length > 0
            ? item.missionSlugs
            : [item.missionSlug];
        if (!linkedMissions.includes(missionFilter)) return false;
      }

      if (statusFilter !== 'all') {
        const st = item.operationalStatus.toLowerCase();
        if (statusFilter === 'proposed' && st !== 'proposed') return false;
        if (
          statusFilter === 'upcoming' &&
          st !== 'planned' &&
          st !== 'approved' &&
          st !== 'under assessment'
        ) {
          return false;
        }
        if (statusFilter === 'active' && st !== 'ongoing' && st !== 'in progress') {
          return false;
        }
        if (statusFilter === 'completed' && !st.includes('completed')) return false;
      }

      if (
        !matchesLocationHierarchy(
          item,
          selectedState,
          selectedDistrict,
          selectedCity,
          selectedGram
        )
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const hay = `${item.titleEn} ${item.titleHi} ${item.summaryEn} ${item.summaryHi} ${item.programmeCode} ${item.locations
          .map((l) => `${l.stateName} ${l.district} ${l.localityName}`)
          .join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [
    allDisplayProgrammes,
    typeFilter,
    missionFilter,
    statusFilter,
    selectedState,
    selectedDistrict,
    selectedCity,
    selectedGram,
    searchQuery,
  ]);

  const projectItems = useMemo(
    () => filteredProgrammes.filter((p) => p.type === 'project'),
    [filteredProgrammes]
  );
  const campaignItems = useMemo(
    () => filteredProgrammes.filter((p) => p.type === 'campaign'),
    [filteredProgrammes]
  );
  const activityItems = useMemo(
    () => filteredProgrammes.filter((p) => p.type === 'event' || p.type === 'training'),
    [filteredProgrammes]
  );

  // Map parentId -> child programmes for showing nested campaigns under a project
  const childrenByParentId = useMemo(() => {
    const map = new Map<string, UnifiedProgrammeRecord[]>();
    for (const p of allDisplayProgrammes) {
      if (p.parentId) {
        const list = map.get(p.parentId) ?? [];
        list.push(p);
        map.set(p.parentId, list);
      }
    }
    return map;
  }, [allDisplayProgrammes]);

  // Also keep parent lookup so a campaign card can show its parent Project
  const programmeById = useMemo(() => {
    const map = new Map<string, UnifiedProgrammeRecord>();
    for (const p of allDisplayProgrammes) {
      map.set(p.id, p);
    }
    return map;
  }, [allDisplayProgrammes]);

  const hasActiveFilters = Boolean(
    selectedState ||
      selectedDistrict ||
      selectedCity ||
      selectedGram ||
      typeFilter !== 'all' ||
      missionFilter !== 'all' ||
      statusFilter !== 'all' ||
      searchQuery.trim()
  );

  const resetAllFilters = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCity('');
    setSelectedGram('');
    setTypeFilter('all');
    setMissionFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  const locationTrail = [selectedState, selectedDistrict, selectedCity, selectedGram].filter(
    Boolean
  );

  const totalCounts = useMemo(
    () => ({
      all: allDisplayProgrammes.length,
      project: allDisplayProgrammes.filter((p) => p.type === 'project').length,
      campaign: allDisplayProgrammes.filter((p) => p.type === 'campaign').length,
      eventTraining: allDisplayProgrammes.filter(
        (p) => p.type === 'event' || p.type === 'training'
      ).length,
    }),
    [allDisplayProgrammes]
  );

  const buildJoinUrl = (item: UnifiedProgrammeRecord, formOverride?: string) => {
    const targetForm =
      formOverride ||
      (item.linkedFormType === 'partnership' ? 'csr-partner' : item.linkedFormType) ||
      (item.type === 'campaign' ? 'harit-mitra' : 'farmer');
    const firstDistrict =
      selectedDistrict || item.locations[0]?.district || 'Bhilwara';
    return `/join/${encodeURIComponent(targetForm)}?campaign=${encodeURIComponent(
      item.programmeCode
    )}&campaignTitle=${encodeURIComponent(item.titleEn)}&district=${encodeURIComponent(
      firstDistrict
    )}`;
  };

  const renderMissionMeta = (item: UnifiedProgrammeRecord) => {
    const slugs =
      item.missionSlugs && item.missionSlugs.length > 0
        ? item.missionSlugs
        : [item.missionSlug];

    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="text-[#5C6B60] font-medium">
          {lang === 'hi' ? 'संबंधित मिशन:' : 'Under Mission:'}
        </span>
        {slugs.map((slug, idx) => {
          const meta = MISSION_META_BY_SLUG[slug];
          if (!meta) return null;
          return (
            <React.Fragment key={slug}>
              {idx > 0 && <span className="text-[#99A69C]" aria-hidden="true">·</span>}
              <button
                type="button"
                onClick={() => onNavigate(meta.path)}
                className="font-semibold text-[#144527] hover:text-[#2E7D32] hover:underline cursor-pointer"
              >
                {String(meta.number).padStart(2, '0')}.{' '}
                {lang === 'hi' ? meta.titleHi : meta.titleEn}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderProgrammeCard = (item: UnifiedProgrammeRecord) => {
    const cover =
      item.media.find((m) => m.isCover && m.url) ??
      item.media.find((m) => m.mediaType === 'photo' && m.url);
    const pdfDoc = item.media.find((m) => m.mediaType === 'pdf' && m.url);
    const childActivities = childrenByParentId.get(item.id) ?? [];
    const parentProject = item.parentId ? programmeById.get(item.parentId) : null;
    const isCampaign = item.type === 'campaign';
    const isProject = item.type === 'project';

    const locText =
      item.coverageScope === 'india-wide'
        ? lang === 'hi'
          ? `संपूर्ण भारत (${item.locations.map((l) => l.district).join(', ')})`
          : `India-Wide (${item.locations.map((l) => l.district).join(', ')})`
        : item.locations
            .map((l) =>
              l.localityName
                ? `${l.localityName}, ${l.district} (${l.stateName})`
                : `${l.district}, ${l.stateName}`
            )
            .join(' · ');

    return (
      <article
        key={item.id}
        className="bg-white rounded-2xl border border-[#E3DDD0] overflow-hidden flex flex-col justify-between transition-colors hover:border-[#B6C5B9]"
      >
        <div>
          {cover && (
            <div className="relative h-48 w-full overflow-hidden border-b border-[#ECE6DA] bg-[#F2F0EA]">
              <img
                src={cover.url}
                alt={cover.altText || item.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-3.5">
            {/* Clean Unboxed Metadata Line (Zero Pill Spam) */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2 font-semibold">
                <span className="text-[#144527] uppercase tracking-[0.08em]">
                  {isProject
                    ? lang === 'hi'
                      ? 'परियोजना · Project'
                      : 'Project'
                    : isCampaign
                    ? lang === 'hi'
                      ? 'अभियान · Campaign'
                      : 'Campaign'
                    : item.type === 'training'
                    ? lang === 'hi'
                      ? 'प्रशिक्षण · Training'
                      : 'Training'
                    : lang === 'hi'
                    ? 'कार्यक्रम · Event'
                    : 'Event'}
                </span>
                <span className="text-[#B8C2BA]" aria-hidden="true">·</span>
                <span className={`font-bold ${getStatusAccentClass(item.operationalStatus)}`}>
                  {formatOperationalStatus(item.operationalStatus, item.type, lang)}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#68756C] tabular-nums">
                {item.programmeCode}
              </span>
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold text-[#143D21] leading-snug ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
              {lang === 'hi' ? item.titleHi || item.titleEn : item.titleEn}
            </h3>

            {/* Mission Link */}
            {renderMissionMeta(item)}

            {/* Parent Project Reference for Campaigns / Events */}
            {parentProject && (
              <p className="text-xs text-[#4C5E52] flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" aria-hidden="true" />
                <span>
                  {lang === 'hi' ? 'मूल परियोजना:' : 'Part of Project:'}{' '}
                  <strong className="text-[#143D21]">
                    {lang === 'hi'
                      ? parentProject.titleHi || parentProject.titleEn
                      : parentProject.titleEn}
                  </strong>
                </span>
              </p>
            )}

            {/* Description */}
            <p className="text-sm text-[#3A473E] leading-relaxed">
              {lang === 'hi' ? item.summaryHi || item.summaryEn : item.summaryEn}
            </p>

            {/* Structured Location, Schedule & Target Audience */}
            <dl className="pt-3 border-t border-[#F0EBE1] space-y-1.5 text-xs text-[#4E5C52]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{locText}</span>
              </div>
              {item.targetAudience && (
                <div className="flex items-start gap-2">
                  <Users className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-[#1D3525]">
                      {lang === 'hi' ? 'सहभागी वर्ग:' : 'Participants:'}
                    </strong>{' '}
                    {item.targetAudience}
                  </span>
                </div>
              )}
              {item.startDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-mono tabular-nums">
                    {item.startDate}
                    {item.endDate && item.endDate !== item.startDate ? ` → ${item.endDate}` : ''}
                  </span>
                </div>
              )}
            </dl>

            {/* Linked Child Campaigns / Field Drives (Shown on Project Cards) */}
            {childActivities.length > 0 && (
              <div className="pt-3 border-t border-[#F0EBE1] space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2E6F36]">
                  {lang === 'hi'
                    ? `इस परियोजना के अंतर्गत संचालित अभियान व गतिविधियाँ (${childActivities.length})`
                    : `Campaigns & Field Drives Under This Project (${childActivities.length})`}
                </p>
                <ul className="space-y-1.5">
                  {childActivities.map((child) => (
                    <li
                      key={child.id}
                      className="flex items-center justify-between gap-2 text-xs text-[#23382A] bg-[#FAF8F3] rounded-lg px-3 py-2 border border-[#ECE6DA]"
                    >
                      <span className="truncate">
                        <strong className="text-[#144527] uppercase text-[10.5px] mr-1.5">
                          {child.type}
                        </strong>
                        {lang === 'hi' ? child.titleHi || child.titleEn : child.titleEn}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate(buildJoinUrl(child))}
                        className="text-[11.5px] font-bold text-[#144527] hover:underline shrink-0 cursor-pointer"
                      >
                        {lang === 'hi' ? 'जुड़ें →' : 'Join →'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Open Public Roles (Shown on Campaign Cards) */}
            {isCampaign && item.roles.length > 0 && (
              <div className="pt-3 border-t border-[#F0EBE1] space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9A3412]">
                  {lang === 'hi' ? 'खुली जन-सहभागिता भूमिकाएँ' : 'Open Community Participation Roles'}
                </p>
                <div className="space-y-1.5">
                  {item.roles
                    .filter((r) => r.isOpen)
                    .map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between gap-2 text-xs bg-[#FAF8F3] rounded-lg px-3 py-2 border border-[#ECE6DA]"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[#143D21] truncate">
                            {lang === 'hi' ? role.titleHi || role.titleEn : role.titleEn}
                          </p>
                          <p className="text-[11px] text-[#556358] truncate">
                            {lang === 'hi'
                              ? role.descriptionHi || role.descriptionEn
                              : role.descriptionEn}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate(buildJoinUrl(item, role.formType))}
                          className="text-[11.5px] font-bold text-[#144527] hover:underline shrink-0 cursor-pointer"
                        >
                          {lang === 'hi' ? 'आवेदन →' : 'Apply →'}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-6 py-4 bg-[#FAF8F3] border-t border-[#ECE6DA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SpringButton
              variant="primary"
              size="sm"
              onClick={() => onNavigate(buildJoinUrl(item))}
            >
              <span>
                {isCampaign
                  ? lang === 'hi'
                    ? 'अभियान में शामिल हों'
                    : 'Join Campaign'
                  : isProject
                  ? lang === 'hi'
                    ? 'परियोजना से जुड़ें'
                    : 'Participate / Partner'
                  : lang === 'hi'
                  ? 'पंजीकरण करें'
                  : 'Register'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </SpringButton>

            {isProject && (
              <SpringButton
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/partnership')}
              >
                <span>{lang === 'hi' ? 'CSR सहयोग' : 'CSR Inquiry'}</span>
              </SpringButton>
            )}
          </div>

          {pdfDoc && (
            <a
              href={pdfDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#144527] hover:underline"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{lang === 'hi' ? 'दस्तावेज़ PDF' : 'Brief PDF'}</span>
            </a>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="bg-[#FAF8F3] text-[#1C2720] min-h-screen">
      {/* =====================================================================
          SECTION 1: REDESIGNED INSTITUTIONAL HERO (ARCHIVAL EDITORIAL SPLIT)
          Gives clear context about GOVEDA + how Missions become Projects & Campaigns
         ===================================================================== */}
      <section className="bg-white border-b border-[#E5DFD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Editorial Narrative (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#2E6F36]">
                  {lang === 'hi'
                    ? 'GOVEDA कार्बन एवं क्लाइमेट इंडिया फाउंडेशन · Section 8 संस्था'
                    : 'GOVEDA Carbon & Climate India Foundation · Section 8 Non-Profit'}
                </p>

                <h1
                  className={`text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#143D21] leading-[1.14] [text-wrap:balance] ${
                    lang === 'hi' ? 'font-hindi' : 'font-editorial'
                  }`}
                >
                  {lang === 'hi'
                    ? 'हमारे 10 मिशन धरातल पर कैसे उतरते हैं — परियोजनाएँ एवं जन-अभियान'
                    : 'Turning Our Ten Missions Into Ground Reality — Projects & Campaigns'}
                </h1>

                <p className="text-base sm:text-[17px] text-[#3B4A40] leading-[1.7] max-w-2xl">
                  {lang === 'hi'
                    ? 'GOVEDA पर्यावरण संरक्षण, हरित राजस्थान, आत्मनिर्भर गौशाला, जैविक कृषि, स्वच्छ ऊर्जा, प्लास्टिक-मुक्त ग्राम और ग्रामीण स्वावलंबन हेतु समर्पित एक Section 8 गैर-लाभकारी संस्था है। यहाँ आप राज्य, जिला, शहर और ग्राम/वार्ड के स्तर पर हमारी सभी प्रस्तावित, आगामी एवं सक्रिय परियोजनाओं और जन-अभियानों को पारदर्शिता के साथ खोज सकते हैं।'
                    : 'GOVEDA is a Section 8 non-profit organisation working across ecological restoration, Harit Rajasthan agroforestry, self-reliant Gaushalas, organic farming, clean energy, plastic-free villages, and rural resilience. Explore every proposed, upcoming, and active Project and Campaign transparently down to your State, District, City, and Gram or Ward.'}
                </p>
              </div>

              {/* Action Row + Honest Governance Note */}
              <div className="space-y-5 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <SpringButton
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const el = document.getElementById('location-filter-hub');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>
                      {lang === 'hi'
                        ? 'अपने क्षेत्र में अभियान खोजें'
                        : 'Find Initiatives by Location'}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </SpringButton>
                  <SpringButton
                    variant="outline"
                    size="md"
                    onClick={() => onNavigate('/harit-rajasthan')}
                  >
                    <span>
                      {lang === 'hi'
                        ? 'हरित राजस्थान जिला प्लेटफ़ॉर्म'
                        : 'Harit Rajasthan Platform'}
                    </span>
                  </SpringButton>
                </div>

                {/* Quiet Institutional Transparency Strip (No Pills, Clean Hairline Top) */}
                <div className="pt-5 border-t border-[#ECE6DA] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-xl font-bold text-[#143D21] tabular-nums">
                      {totalCounts.project}
                    </p>
                    <p className="text-[#56645A] mt-0.5">
                      {lang === 'hi' ? 'सूचीबद्ध परियोजनाएँ' : 'Listed Projects'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#143D21] tabular-nums">
                      {totalCounts.campaign}
                    </p>
                    <p className="text-[#56645A] mt-0.5">
                      {lang === 'hi' ? 'प्रस्तावित व सक्रिय अभियान' : 'Public Campaigns'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#143D21] tabular-nums">10</p>
                    <p className="text-[#56645A] mt-0.5">
                      {lang === 'hi' ? 'संबद्ध GOVEDA मिशन' : 'Linked Core Missions'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#143D21] tabular-nums">36</p>
                    <p className="text-[#56645A] mt-0.5">
                      {lang === 'hi' ? 'राज्य व केंद्रशासित प्रदेश' : 'States & UTs Supported'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Framed Editorial Photography (5 Columns, Stretched to Match Height) */}
            <div className="lg:col-span-5 flex flex-col">
              <figure className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-[#E3DDD0] bg-[#143D21]">
                <img
                  src="/assets/hero-harit-clean.jpg"
                  alt={
                    lang === 'hi'
                      ? 'राजस्थान के ग्रामीण हरित क्षेत्र में वृक्षारोपण एवं कृषि-वानिकी दृश्य'
                      : 'Green countryside, native trees and rural community ecology in Rajasthan'
                  }
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B17]/85 via-[#0D2B17]/20 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1.5">
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#C8EBB0]">
                    {lang === 'hi' ? 'ईमानदार प्रगति नीति' : 'Transparent Status Governance'}
                  </p>
                  <p className="text-sm leading-relaxed text-white/95">
                    {lang === 'hi'
                      ? 'प्रत्येक पहल की वास्तविक स्थिति — प्रस्तावित (Proposed), आगामी (Planned), मूल्यांकनाधीन, चालू या पूर्ण — स्पष्ट रूप से अंकित की जाती है।'
                      : 'Every initiative clearly separates Proposed, Planned, Under Assessment, Ongoing, and Verified Completed stages — never presenting proposed ideas as finished work.'}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* =====================================================================
              EDITORIAL CLARITY BAND: HOW PROJECTS & CAMPAIGNS DIFFER
             ===================================================================== */}
          <div className="mt-12 pt-10 border-t border-[#ECE6DA] grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[#143D21]">
                <FolderKanban className="w-4 h-4 text-[#2E6F36]" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-[0.1em]">
                  {lang === 'hi'
                    ? 'परियोजना (Project) क्या है?'
                    : 'What Is a GOVEDA Project?'}
                </h2>
              </div>
              <p className="text-sm text-[#3F4D44] leading-relaxed">
                {lang === 'hi'
                  ? 'परियोजना एक दीर्घकालिक, संरचित और मापनीय संस्थागत मॉडल है — जिसमें स्थल मूल्यांकन, निर्धारित उद्देश्य, बहु-वर्षीय समय-सीमा, साझेदारी (जैसे ग्राम पंचायत, गौशाला या CSR) और पारदर्शी ऑडिट शामिल होता है। उदाहरण: भीलवाड़ा हरित ग्राम विकास परियोजना या चूरू आत्मनिर्भर गौशाला मॉडल।'
                  : 'A Project is a structured, long-term institutional programme with formal site assessment, defined multi-year milestones, partner governance (Panchayats, Gaushalas, or CSR), and audited reporting — for example, Bhilwara Green Village Development or the Proposed Churu Self-Reliant Gaushala Model.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[#143D21]">
                <Flag className="w-4 h-4 text-[#9A3412]" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-[0.1em]">
                  {lang === 'hi'
                    ? 'अभियान (Campaign) क्या है?'
                    : 'What Is a GOVEDA Campaign?'}
                </h2>
              </div>
              <p className="text-sm text-[#3F4D44] leading-relaxed">
                {lang === 'hi'
                  ? 'अभियान एक समय-बद्ध या मौसमी जन-सहभागिता आंदोलन है जो किसी मिशन या परियोजना के अंतर्गत नागरिकों, किसानों, विद्यार्थियों, महिला समूहों और हरित मित्रों को सीधे धरातल पर जोड़ता है। उदाहरण: मांडलगढ़ मानसून वृक्षारोपण अभियान या सरदारशहर प्लास्टिक-मुक्त बाज़ार अभियान।'
                  : 'A Campaign is a focused, participatory public drive — seasonal, civic, or village-level — that mobilises farmers, youth, schools, women SHGs, and Harit Mitras to act directly under a Mission or parent Project — for example, the Mandalgarh Monsoon Plantation Campaign or Sardarshahar Plastic-Free Market Campaign.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: 4-LEVEL CASCADING LOCATION FILTER + MISSION/STATUS CONTROLS
          State -> District -> City / Tehsil -> Gram / Village / Ward
         ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section
          id="location-filter-hub"
          aria-label={lang === 'hi' ? 'स्थान आधारित फ़िल्टर' : 'Location Filter'}
          className="bg-white rounded-2xl border border-[#E3DDD0] p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EFEAE0] pb-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
                {lang === 'hi'
                  ? 'स्थान एवं मिशन के अनुसार खोजें'
                  : 'Cascading Geographic & Mission Filter'}
              </p>
              <h2 className={`text-2xl font-bold text-[#143D21] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
                {lang === 'hi'
                  ? 'राज्य → जिला → शहर/तहसील → ग्राम/वार्ड चुनें'
                  : 'Select State → District → City / Tehsil → Gram / Ward'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {selectedState !== 'Rajasthan' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState('Rajasthan');
                    setSelectedDistrict('');
                    setSelectedCity('');
                    setSelectedGram('');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#EEF5EB] hover:bg-[#E0EEDB] text-xs font-semibold text-[#144527] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {lang === 'hi' ? 'त्वरित चयन: राजस्थान' : 'Quick Select: Rajasthan'}
                </button>
              )}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DCD6C8] text-xs font-semibold text-[#47554B] hover:bg-[#FAF8F3] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{lang === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 4-Step Cascading Location Dropdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1: State */}
            <label className="space-y-1.5 block">
              <span className="text-xs font-bold text-[#143D21] block">
                1. {lang === 'hi' ? 'राज्य चुनें (State)' : 'Select State'}
              </span>
              <select
                aria-label="Select State"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('');
                  setSelectedCity('');
                  setSelectedGram('');
                }}
                className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] focus:bg-white focus:border-[#144527] px-3.5 py-2.5 text-sm text-[#1C2720] outline-none transition-colors"
              >
                <option value="">
                  {lang === 'hi' ? 'सभी राज्य एवं केंद्रशासित प्रदेश' : 'All States & UTs'}
                </option>
                {INDIA_STATES_DIRECTORY.map((st) => (
                  <option key={st.slug} value={st.nameEn}>
                    {lang === 'hi' ? `${st.nameHi} (${st.nameEn})` : st.nameEn}
                  </option>
                ))}
              </select>
            </label>

            {/* Step 2: District */}
            <label className="space-y-1.5 block">
              <span className="text-xs font-bold text-[#143D21] block">
                2. {lang === 'hi' ? 'जिला चुनें (District)' : 'Select District'}
              </span>
              <select
                aria-label="Select District"
                value={selectedDistrict}
                disabled={!selectedState}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedCity('');
                  setSelectedGram('');
                }}
                className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] focus:bg-white focus:border-[#144527] disabled:opacity-55 disabled:cursor-not-allowed px-3.5 py-2.5 text-sm text-[#1C2720] outline-none transition-colors"
              >
                <option value="">
                  {!selectedState
                    ? lang === 'hi'
                      ? 'पहले राज्य चुनें'
                      : 'Choose a state first'
                    : lang === 'hi'
                    ? `${selectedState} के सभी जिले (${availableDistricts.length})`
                    : `All Districts in ${selectedState} (${availableDistricts.length})`}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </label>

            {/* Step 3: City / Tehsil / Block */}
            <label className="space-y-1.5 block">
              <span className="text-xs font-bold text-[#143D21] block">
                3. {lang === 'hi' ? 'शहर / तहसील चुनें (City)' : 'Select City / Tehsil'}
              </span>
              <select
                aria-label="Select City or Tehsil"
                value={selectedCity}
                disabled={!selectedDistrict}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedGram('');
                }}
                className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] focus:bg-white focus:border-[#144527] disabled:opacity-55 disabled:cursor-not-allowed px-3.5 py-2.5 text-sm text-[#1C2720] outline-none transition-colors"
              >
                <option value="">
                  {!selectedDistrict
                    ? lang === 'hi'
                      ? 'पहले जिला चुनें'
                      : 'Choose a district first'
                    : lang === 'hi'
                    ? `${selectedDistrict} के सभी शहर/तहसील (${cityGroups.length})`
                    : `All Cities / Tehsils (${cityGroups.length})`}
                </option>
                {cityGroups.map((grp) => (
                  <option key={grp.name} value={grp.name}>
                    {grp.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Step 4: Gram / Village / Ward */}
            <label className="space-y-1.5 block">
              <span className="text-xs font-bold text-[#143D21] block">
                4. {lang === 'hi' ? 'ग्राम / वार्ड चुनें (Gram / Ward)' : 'Select Gram / Ward'}
              </span>
              <select
                aria-label="Select Gram or Ward"
                value={selectedGram}
                disabled={!selectedCity}
                onChange={(e) => setSelectedGram(e.target.value)}
                className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] focus:bg-white focus:border-[#144527] disabled:opacity-55 disabled:cursor-not-allowed px-3.5 py-2.5 text-sm text-[#1C2720] outline-none transition-colors"
              >
                <option value="">
                  {!selectedCity
                    ? lang === 'hi'
                      ? 'पहले शहर/तहसील चुनें'
                      : 'Choose a city first'
                    : lang === 'hi'
                    ? `${selectedCity} के सभी ग्राम व वार्ड (${availableGramsAndWards.length})`
                    : `All Grams & Wards (${availableGramsAndWards.length})`}
                </option>
                {availableGramsAndWards.map((gw) => (
                  <option key={gw} value={gw}>
                    {gw}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Secondary Filter Row: Type Segmented Tabs + Mission + Status + Search */}
          <div className="pt-4 border-t border-[#EFEAE0] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Segmented Type Control */}
            <div className="lg:col-span-5 flex flex-wrap items-center gap-1 p-1 bg-[#F3EFE6] rounded-xl">
              {[
                { key: 'all', hi: 'सभी', en: 'All', count: totalCounts.all },
                { key: 'project', hi: 'परियोजनाएँ', en: 'Projects', count: totalCounts.project },
                { key: 'campaign', hi: 'अभियान', en: 'Campaigns', count: totalCounts.campaign },
                { key: 'event', hi: 'कार्यक्रम', en: 'Events', count: allDisplayProgrammes.filter((x) => x.type === 'event').length },
                { key: 'training', hi: 'प्रशिक्षण', en: 'Training', count: allDisplayProgrammes.filter((x) => x.type === 'training').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setTypeFilter(tab.key as 'all' | ProgrammeType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    typeFilter === tab.key
                      ? 'bg-white text-[#143D21] shadow-2xs'
                      : 'text-[#526056] hover:text-[#143D21]'
                  }`}
                >
                  {lang === 'hi' ? tab.hi : tab.en}{' '}
                  <span className="opacity-70 tabular-nums">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Mission Filter */}
            <div className="lg:col-span-3">
              <select
                aria-label="Filter by Mission"
                value={missionFilter}
                onChange={(e) => setMissionFilter(e.target.value)}
                className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] px-3 py-2 text-xs font-medium text-[#1C2720] outline-none focus:border-[#144527]"
              >
                <option value="all">
                  {lang === 'hi' ? 'सभी 10 मिशन (All Missions)' : 'All 10 GOVEDA Missions'}
                </option>
                {Object.entries(MISSION_META_BY_SLUG).map(([slug, meta]) => (
                  <option key={slug} value={slug}>
                    {String(meta.number).padStart(2, '0')}.{' '}
                    {lang === 'hi' ? meta.titleHi : meta.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Operational Status Filter */}
            <div className="lg:col-span-2">
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] px-3 py-2 text-xs font-medium text-[#1C2720] outline-none focus:border-[#144527]"
              >
                <option value="all">
                  {lang === 'hi' ? 'सभी स्थिति' : 'All Statuses'}
                </option>
                <option value="proposed">
                  {lang === 'hi' ? 'प्रस्तावित (Proposed)' : 'Proposed (Prastavit)'}
                </option>
                <option value="upcoming">
                  {lang === 'hi' ? 'आगामी / स्वीकृत (Upcoming)' : 'Upcoming / Planned'}
                </option>
                <option value="active">
                  {lang === 'hi' ? 'सक्रिय / चालू (Active)' : 'Active / Ongoing'}
                </option>
                <option value="completed">
                  {lang === 'hi' ? 'पूर्ण (Completed)' : 'Completed'}
                </option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="lg:col-span-2 relative">
              <Search
                className="w-3.5 h-3.5 text-[#68756C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'खोजें...' : 'Search...'}
                className="w-full rounded-xl border border-[#D7D1C4] bg-[#FAF8F3] pl-8 pr-3 py-2 text-xs text-[#1C2720] outline-none focus:border-[#144527] focus:bg-white"
              />
            </div>
          </div>

          {/* Active Location Breadcrumb & Results Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4C5B51]">
            <div className="flex flex-wrap items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2E6F36]" aria-hidden="true" />
              {locationTrail.length > 0 ? (
                <span>
                  {lang === 'hi' ? 'चयनित क्षेत्र:' : 'Selected Location:'}{' '}
                  <strong className="text-[#143D21]">{locationTrail.join(' → ')}</strong>
                </span>
              ) : (
                <span>
                  {lang === 'hi'
                    ? 'संपूर्ण भारत की प्रकाशित परियोजनाएँ एवं अभियान प्रदर्शित किए जा रहे हैं।'
                    : 'Showing all published GOVEDA projects and campaigns across India.'}
                </span>
              )}
            </div>
            <span className="font-semibold text-[#143D21] tabular-nums">
              {filteredProgrammes.length}{' '}
              {lang === 'hi' ? 'परिणाम मिले' : filteredProgrammes.length === 1 ? 'result matched' : 'results matched'}
            </span>
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: FILTERED RESULTS — STRUCTURED CLEARLY BY PROJECTS VS CAMPAIGNS
           ===================================================================== */}
        {filteredProgrammes.length === 0 ? (
          <section className="bg-white rounded-2xl border border-[#E3DDD0] p-8 sm:p-12 text-center space-y-4">
            <Compass className="w-9 h-9 text-[#2E6F36] mx-auto" aria-hidden="true" />
            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className={`text-xl font-bold text-[#143D21] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
                {locationTrail.length > 0
                  ? lang === 'hi'
                    ? `${locationTrail[locationTrail.length - 1]} में अभी कोई प्रकाशित परियोजना या अभियान दर्ज नहीं है`
                    : `No published project or campaign in ${locationTrail[locationTrail.length - 1]} yet`
                  : lang === 'hi'
                  ? 'चयनित फ़िल्टर के अनुसार कोई पहल नहीं मिली'
                  : 'No initiatives matched your current filters'}
              </h3>
              <p className="text-sm text-[#4D5C52] leading-relaxed">
                {lang === 'hi'
                  ? 'GOVEDA केवल सत्यापित एवं आधिकारिक रूप से प्रस्तावित या सक्रिय कार्यक्रम ही प्रदर्शित करता है। आप अपने ग्राम, वार्ड या शहर में हरित अभियान शुरू करने हेतु हरित मित्र या स्वयंसेवक के रूप में जुड़ सकते हैं।'
                  : 'GOVEDA only publishes verified, officially proposed, or active initiatives. You can nominate your village, ward, or town to launch a local Harit Mitra plantation or Clean India drive.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <SpringButton
                variant="primary"
                size="sm"
                onClick={() =>
                  onNavigate(
                    `/join/harit-mitra?district=${encodeURIComponent(
                      selectedDistrict || 'Bhilwara'
                    )}`
                  )
                }
              >
                <span>
                  {lang === 'hi'
                    ? `${selectedGram || selectedCity || selectedDistrict || 'अपने क्षेत्र'} में अभियान प्रस्तावित करें`
                    : `Nominate ${selectedGram || selectedCity || selectedDistrict || 'Your Area'}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </SpringButton>
              <SpringButton variant="outline" size="sm" onClick={resetAllFilters}>
                <span>{lang === 'hi' ? 'सभी पहल देखें' : 'Show All Initiatives'}</span>
              </SpringButton>
            </div>
          </section>
        ) : (
          <div className="space-y-12">
            {/* PROJECTS SECTION */}
            {projectItems.length > 0 && (
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E3DDD0]">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
                      {lang === 'hi'
                        ? 'दीर्घकालिक संस्थागत मॉडल'
                        : 'Structured Institutional Programmes'}
                    </p>
                    <h2 className={`text-2xl sm:text-3xl font-bold text-[#143D21] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
                      {lang === 'hi'
                        ? `परियोजनाएँ — प्रस्तावित एवं सक्रिय (${projectItems.length})`
                        : `Projects — Proposed & Active (${projectItems.length})`}
                    </h2>
                  </div>
                  <p className="text-xs text-[#546358]">
                    {lang === 'hi'
                      ? 'प्रत्येक परियोजना अपने संबद्ध मिशन और क्षेत्रीय अभियानों से जुड़ी है'
                      : 'Each project connects to its core Mission and local ground campaigns'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projectItems.map(renderProgrammeCard)}
                </div>
              </section>
            )}

            {/* CAMPAIGNS SECTION */}
            {campaignItems.length > 0 && (
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E3DDD0]">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#9A3412]">
                      {lang === 'hi'
                        ? 'जन-सहभागिता एवं क्षेत्रीय आंदोलन'
                        : 'Participatory Public Drives'}
                    </p>
                    <h2 className={`text-2xl sm:text-3xl font-bold text-[#143D21] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
                      {lang === 'hi'
                        ? `अभियान — प्रस्तावित, आगामी एवं सक्रिय (${campaignItems.length})`
                        : `Campaigns — Proposed, Upcoming & Active (${campaignItems.length})`}
                    </h2>
                  </div>
                  <p className="text-xs text-[#546358]">
                    {lang === 'hi'
                      ? 'नागरिक, किसान, विद्यार्थी और हरित मित्र सीधे सहभागी बन सकते हैं'
                      : 'Open for citizens, farmers, schools, women SHGs, and Harit Mitras'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {campaignItems.map(renderProgrammeCard)}
                </div>
              </section>
            )}

            {/* EVENTS & TRAINING ACTIVITIES SECTION */}
            {activityItems.length > 0 && (
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#E3DDD0]">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#2E6F36]">
                      {lang === 'hi' ? 'क्षेत्रीय शिविर एवं प्रशिक्षण' : 'Field Camps & Capacity Building'}
                    </p>
                    <h2 className={`text-2xl font-bold text-[#143D21] ${lang === 'hi' ? 'font-hindi' : 'font-editorial'}`}>
                      {lang === 'hi'
                        ? `संबंधित कार्यक्रम एवं प्रशिक्षण (${activityItems.length})`
                        : `Linked Events & Training Programmes (${activityItems.length})`}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activityItems.map(renderProgrammeCard)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Verified Public Impact Counters (Displayed cleanly beneath listings) */}
        {publishedMetrics.length > 0 && (
          <section className="bg-white rounded-2xl border border-[#E3DDD0] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-[#143D21]">
                {lang === 'hi'
                  ? 'सत्यापित सार्वजनिक प्रगति आँकड़े'
                  : 'Audited & Published Impact Counters'}
              </h2>
              <span className="text-xs text-[#59675D]">
                {lang === 'hi'
                  ? 'केवल ऑडिट एवं सत्यापित आँकड़े प्रदर्शित'
                  : 'Strictly audited and verified figures only'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {publishedMetrics.map((m) => (
                <div
                  key={m.metricKey}
                  className="rounded-xl bg-[#FAF8F3] border border-[#EAE4D7] p-3.5"
                >
                  <p className="text-xl font-bold text-[#143D21] tabular-nums">
                    {m.verifiedValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs font-semibold text-[#233228] mt-0.5 leading-snug">
                    {lang === 'hi' ? m.labelHi : m.labelEn}
                  </p>
                  <p className="text-[11px] text-[#606F64] mt-1">{m.unitLabel}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
