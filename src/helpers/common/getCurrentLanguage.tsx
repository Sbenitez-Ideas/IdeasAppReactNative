import { useTranslation } from 'react-i18next';

export const getCurrentLanguage = ( language: string  ) => {
    switch (language) {
        case 'es':
            return 'resEspañol';
        case 'en': 
            return 'resIngles';
        case 'pt': 
            return 'resPortugues';
        default:
            return ''
            
    }
}