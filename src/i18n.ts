'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '@/locales/en/common.json';
import trCommon from '@/locales/tr/common.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'tr', 
    fallbackLng: 'tr',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        common: enCommon,
      },
      tr: {
        common: trCommon,
      },
    },
    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
