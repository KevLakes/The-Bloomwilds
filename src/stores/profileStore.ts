import { create } from 'zustand';
import i18n from '@/i18n';
import { idbAdapter } from '@/systems/persistence/idbAdapter';
import { defaultA11y, type KidProfile, type Lang, type AgeGroupId, type SparkLook } from '@/types';
import { useA11yStore } from '@/stores/a11yStore';

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface ProfileState {
  ready: boolean;
  profiles: KidProfile[];
  activeId?: string;
  active?: KidProfile;

  init(): Promise<void>;
  reload(): Promise<void>;
  create(input: {
    name: string;
    ageGroup: AgeGroupId;
    lang: Lang;
    spark: SparkLook;
  }): Promise<KidProfile>;
  update(id: string, patch: Partial<KidProfile>): Promise<void>;
  remove(id: string): Promise<void>;
  setActive(id: string | undefined): Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  ready: false,
  profiles: [],
  activeId: undefined,
  active: undefined,

  async init() {
    await idbAdapter.init();
    await get().reload();
    set({ ready: true });
  },

  async reload() {
    const profiles = await idbAdapter.listProfiles();
    const activeId = await idbAdapter.getActiveProfileId();
    const active = activeId ? profiles.find((p) => p.id === activeId) : undefined;
    if (active) {
      // hydrate language + a11y from active profile
      if (i18n.language !== active.lang) await i18n.changeLanguage(active.lang);
      useA11yStore.getState().replace(active.a11y);
    }
    set({ profiles, activeId, active });
  },

  async create({ name, ageGroup, lang, spark }) {
    const profile: KidProfile = {
      id: genId(),
      name,
      ageGroup,
      lang,
      spark,
      a11y: { ...defaultA11y },
      createdAt: Date.now(),
    };
    await idbAdapter.saveProfile(profile);
    await idbAdapter.setActiveProfileId(profile.id);
    await get().reload();
    return profile;
  },

  async update(id, patch) {
    const existing = await idbAdapter.getProfile(id);
    if (!existing) return;
    const next: KidProfile = { ...existing, ...patch };
    await idbAdapter.saveProfile(next);
    await get().reload();
  },

  async remove(id) {
    await idbAdapter.deleteProfile(id);
    await get().reload();
  },

  async setActive(id) {
    await idbAdapter.setActiveProfileId(id);
    await get().reload();
  },
}));
