import i18next from "i18next";
import i18n from "i18next";
import moment from "moment";
import { initReactI18next } from "react-i18next";
import { NativeModules, Platform } from "react-native";
import translationEN from './en.json';
import translationES from './es.json';
import translationPT from './pt.json';
import Moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/en-ca';
import 'moment/locale/pt';


let deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;



	switch( deviceLanguage ) {
		case 'en_US':
		case 'en_CA':
		case 'en':
			deviceLanguage = 'en';
			break;
		case 'es':
		case 'es_CO':
		case 'es_CL':
		case 'es_CU':
		case 'es_MX':
		case 'es_US':
		case 'es_BO':
			deviceLanguage = 'es';
			break;
		case 'pt':
		case 'pt_AO':
		case 'pt_BR':
		case 'pt_CV':
		case 'pt_GW':
		case 'pt_MO':
		case 'pt_MZ':
		case 'pt_PT':
		case 'pt_ST':
		case 'pt_TL':
			deviceLanguage = 'pt';
			break;
	}


// the translations
const resources = {
    en: {
        translation: translationEN
    },
    es: {
        translation: translationES
    },
    pt: {
        translation: translationPT
    }
};

moment.locale( deviceLanguage );

i18n
  .use(initReactI18next) // passes i18n down to react_i18next
  .init({
    resources,
    lng: deviceLanguage,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;