import { openDB, type IDBPDatabase } from 'idb';
import type { KidProfile, ProfileProgress } from '@/types';
import type { StorageAdapter } from './adapter';
import { DB_NAME, DB_VERSION, type BloomwildsDB } from './schema';

const ACTIVE_KEY = 'activeProfileId';

class IDBAdapter implements StorageAdapter {
  private db?: IDBPDatabase<BloomwildsDB>;

  async init(): Promise<void> {
    if (this.db) return;
    this.db = await openDB<BloomwildsDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('profiles', { keyPath: 'id' });
          db.createObjectStore('progress', { keyPath: 'profileId' });
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      },
    });
  }

  private require(): IDBPDatabase<BloomwildsDB> {
    if (!this.db) throw new Error('idbAdapter not initialized');
    return this.db;
  }

  async listProfiles(): Promise<KidProfile[]> {
    return this.require().getAll('profiles');
  }
  async getProfile(id: string): Promise<KidProfile | undefined> {
    return this.require().get('profiles', id);
  }
  async saveProfile(profile: KidProfile): Promise<void> {
    await this.require().put('profiles', profile);
  }
  async deleteProfile(id: string): Promise<void> {
    const db = this.require();
    await db.delete('profiles', id);
    await db.delete('progress', id);
    const active = await this.getActiveProfileId();
    if (active === id) await this.setActiveProfileId(undefined);
  }

  async getProgress(profileId: string): Promise<ProfileProgress | undefined> {
    return this.require().get('progress', profileId);
  }
  async saveProgress(progress: ProfileProgress): Promise<void> {
    await this.require().put('progress', progress);
  }

  async getActiveProfileId(): Promise<string | undefined> {
    const row = await this.require().get('meta', ACTIVE_KEY);
    return (row?.value as string | undefined) ?? undefined;
  }
  async setActiveProfileId(id: string | undefined): Promise<void> {
    await this.require().put('meta', { key: ACTIVE_KEY, value: id });
  }
}

export const idbAdapter: StorageAdapter = new IDBAdapter();
