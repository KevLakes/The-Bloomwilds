import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import svCommon from './sv/common.json';
import svUi from './sv/ui.json';
import svA11y from './sv/a11y.json';
import svRegions from './sv/regions.json';
import svNarration from './sv/narration.json';
import svChallenges from './sv/challenges.json';

import enCommon from './en/common.json';
import enUi from './en/ui.json';
import enA11y from './en/a11y.json';
import enRegions from './en/regions.json';
import enNarration from './en/narration.json';
import enChallenges from './en/challenges.json';

export const resources = {
  sv: {
    common: svCommon,
    ui: svUi,
    a11y: svA11y,
    regions: svRegions,
    narration: svNarration,
    challenges: svChallenges,
  },
  en: {
    common: enCommon,
    ui: enUi,
    a11y: enA11y,
    regions: enRegions,
    narration: enNarration,
    challenges: enChallenges,
  },
} as const;

export const supportedLngs = ['sv', 'en'] as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'sv',
    supportedLngs: [...supportedLngs],
    ns: ['common', 'ui', 'a11y', 'regions', 'narration', 'challenges'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'bw_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
