import type { AssetKey } from '../data/assets';

export type Language = 'hi' | 'en';

export interface BilingualText {
  hi: string;
  en: string;
}

export type RoutePath =
  | '/'
  | '/about'
  | '/missions'
  | `/missions/${string}`
  | '/harit-rajasthan'
  | `/harit-rajasthan/${string}`
  | '/join'
  | `/join/${string}`
  | '/training'
  | '/projects'
  | '/events'
  | '/harit-marathon'
  | '/magazine'
  | '/partnership'
  | '/contact'
  | '/admin';

export interface MissionSubpage {
  code: string;
  title: BilingualText;
  summary: BilingualText;
  highlights?: BilingualText[];
}

export interface CourseItem {
  name: BilingualText;
  eligibility: BilingualText;
  duration: BilingualText;
  mode: BilingualText;
  trainer: BilingualText;
  feeStatus: BilingualText;
  description: BilingualText;
}

export interface MissionData {
  id: string;
  number: number;
  slug: string;
  title: BilingualText;
  shortTitle: BilingualText;
  tagline: BilingualText;
  description: BilingualText;
  imageKey: AssetKey;
  iconName: string;
  treePosition?: {
    x: number;
    y: number;
    side: 'left' | 'right';
  };
  disclaimer?: BilingualText;
  subpages: MissionSubpage[];
  courses?: CourseItem[];
}

export interface DistrictData {
  slug: string;
  name: BilingualText;
  regionTag: BilingualText;
  focusSummary: BilingualText;
  introduction: BilingualText;
  objectives: BilingualText[];
  campaigns: BilingualText[];
  eventsHighlight: BilingualText;
  imageKey: AssetKey;
  mapCoords: {
    x: number;
    y: number;
    labelOffset?: 'top' | 'bottom' | 'left' | 'right';
  };
}

export type RegistrationCategory =
  | 'farmer'
  | 'harit-mitra'
  | 'gaushala'
  | 'school-college'
  | 'women-shg'
  | 'skill-training'
  | 'volunteer'
  | 'marathon'
  | 'csr-partner'
  | 'ngo-institution'
  | 'expert-trainer'
  | 'membership';

export type ApplicationStatusType =
  | 'Submitted'
  | 'Under Preliminary Review'
  | 'Field Verification Pending'
  | 'Approved'
  | 'Rejected';

export interface RegistrationRecord {
  applicationId: string;
  category: RegistrationCategory;
  applicantName: string;
  mobile: string;
  district: string;
  villageOrOrg: string;
  details: string;
  formFields?: Record<string, string>;
  submittedAt: string;
  status: ApplicationStatusType;
  consentAccepted: boolean;
}

export interface ProjectItem {
  id: string;
  title: BilingualText;
  location: BilingualText;
  missionCategory: BilingualText;
  status: 'Proposed' | 'Under Assessment' | 'Approved' | 'Ongoing' | 'Completed';
  objectives: BilingualText;
  beneficiaryCategory: BilingualText;
  note: BilingualText;
}

export interface TrainingArticle {
  id: string;
  category: BilingualText;
  title: BilingualText;
  summary: BilingualText;
  ruralExample?: BilingualText;
  readTime: string;
  hasPdf: boolean;
}
