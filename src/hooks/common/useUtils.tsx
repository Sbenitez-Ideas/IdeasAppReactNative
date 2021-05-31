import {
    Platform,
    UIManager,
    LayoutAnimation,
    PixelRatio,
    Dimensions,
    I18nManager,
} from 'react-native';
import RNRestart from 'react-native-restart';

export const useUtils = () => {

    const scaleValue = PixelRatio.get() / 2;
  
    const enableExperimental = () => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };
  
    const scaleWithPixel = ( size:  number, limitScale = 1.2 ) => {
        /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
        const value = scaleValue > limitScale ? limitScale : scaleValue;
        return size * value;
    };
  
    const heightHeader = () => {
        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;
        const landscape = width > height;
        
        if (Platform.OS === 'android') return 45;
        switch (height) {
        case 375:
        case 414:
        case 812:
        case 896:
            return landscape ? 45 : 88;
        default:
            return landscape ? 45 : 65;
        }
    };
  
    const heightTabView = () => {
        const height = Dimensions.get('window').height;
        let size = height - heightHeader();
        switch (height) {
        case 375:
        case 414:
        case 812:
        case 896:
            size -= 30;
            break;
        default:
            break;
        }
    
        return size;
    };
  
    const getWidthDevice = () => {
        return Dimensions.get('window').width;
    };
  
    const getHeightDevice = () => {
        return Dimensions.get('window').height;
    };
  
    const scrollEnabled = (contentWidth: number, contentHeight: number) => {
        return contentHeight > Dimensions.get('window').height - heightHeader();
    };
  
 /*  const languageFromCode = code => {
    switch (code) {
      case 'en':
        return 'English';
      case 'vi':
        return 'Vietnamese';
      case 'ar':
        return 'Arabic';
      case 'da':
        return 'Danish';
      case 'de':
        return 'German';
      case 'el':
        return 'Greek';
      case 'fr':
        return 'French';
      case 'he':
        return 'Hebrew';
      case 'id':
        return 'Indonesian';
      case 'ja':
        return 'Japanese';
      case 'ko':
        return 'Korean';
      case 'lo':
        return 'Lao';
      case 'nl':
        return 'Dutch';
      case 'zh':
        return 'Chinese';
      case 'fa':
        return 'Iran';
      case 'km':
        return 'Cambodian';
      default:
        return 'Unknown';
    }
  };
  
  const isLanguageRTL = code => {
    switch (code) {
      case 'ar':
      case 'he':
        return true;
      default:
        return false;
    }
  };
  
  const reloadLocale = (oldLanguage, newLanguage) => {
    const oldStyle = isLanguageRTL(oldLanguage);
    const newStyle = isLanguageRTL(newLanguage);
    if (oldStyle != newStyle) {
      I18nManager.forceRTL(newStyle);
      RNRestart.Restart();
    }
  };
   */


    return {
        enableExperimental,
        scaleWithPixel,
        heightHeader,
        heightTabView,
        getWidthDevice,
        getHeightDevice,
        scrollEnabled
    } 

}
  
