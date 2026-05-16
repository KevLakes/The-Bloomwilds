import type { KidProfile, ProfileProgress } from '@/types';

export interface StorageAdapter {
  init(): Promise<void>;

  listProfiles(): Promise<KidProfile[]>;
  getProfile(id: string): Promise<KidProfile | undefined>;
  saveProfile(profile: KidProfile): Promise<void>;
  deleteProfile(id: string): Promise<void>;

  getProgress(profileId: string): Promise<ProfileProgress | undefined>;
  saveProgress(progress: ProfileProgress): Promise<void>;

  getActiveProfileId(): Promise<string | undefined>;
  setActiveProfileId(id: string | undefined): Promise<void>;
}
