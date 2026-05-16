import type { DBSchema } from 'idb';
import type { KidProfile, ProfileProgress } from '@/types';

export const DB_NAME = 'bloomwilds';
export const DB_VERSION = 1;

export interface BloomwildsDB extends DBSchema {
  profiles: {
    key: string;
    value: KidProfile;
  };
  progress: {
    key: string;
    value: ProfileProgress;
  };
  meta: {
    key: string;
    value: { key: string; value: unknown };
  };
}
