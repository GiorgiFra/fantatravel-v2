import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import it from './locales/it/translation.json';

i18n
    .use(LanguageDetector) // opzionale: rileva lingua browser
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            it: { translation: it },
        },
        fallbackLng: 'it',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        parseMissingKeyHandler: (key) => {
            const parts = key.split('.');
            return parts[parts.length - 1]; // Ritorna solo l'ultima parte della chiave
        },
    });

export default i18n;
