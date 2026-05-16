export type Lang = 'sv' | 'en';

export type AgeGroupId = '3-4' | '5-7' | '8-9' | '10-12';

export type RegionId =
  | 'letterglade'
  | 'numberbrook'
  | 'critter-cove'
  | 'hue-hills'
  | 'feelings-meadow';

export type ChallengeId = string;

export type SparkForm = 'blob' | 'fox' | 'bird';

export interface A11ySettings {
  bigText: boolean;
  fontFamily: 'system' | 'dyslexic';
  motion: 'full' | 'reduced' | 'off';
  contrast: 'normal' | 'high';
  calm: boolean;
  captions: boolean;
  readToMe: boolean;
  simpleLanguage: boolean;
  dwellMs: number;
  oneSwitch: boolean;
}

export const defaultA11y: A11ySettings = {
  bigText: false,
  fontFamily: 'system',
  motion: 'full',
  contrast: 'normal',
  calm: false,
  captions: true,
  readToMe: true,
  simpleLanguage: false,
  dwellMs: 0,
  oneSwitch: false,
};

export interface SparkLook {
  form: SparkForm;
  palette: 'sun' | 'sky' | 'meadow' | 'berry';
  outfit: 'none' | 'hat' | 'scarf';
}

export interface KidProfile {
  id: string;
  name: string;
  ageGroup: AgeGroupId;
  lang: Lang;
  spark: SparkLook;
  a11y: A11ySettings;
  createdAt: number;
}

export type BloomTier = 0 | 1 | 2 | 3;

export interface ProfileProgress {
  profileId: string;
  bloomTier: Partial<Record<RegionId, BloomTier>>;
  completed: Record<ChallengeId, { attempts: number; stars: 1 | 2 | 3 }>;
  seeds: number;
  inventory: {
    stickers: string[];
    outfits: string[];
    lullabies: string[];
    secrets: string[];
  };
}

export interface ChallengeResult {
  success: true;
  stars?: 1 | 2 | 3;
  attempts: number;
}
