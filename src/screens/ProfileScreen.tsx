import React from 'react'
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native-animatable'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import i18n from '../i18n/i18n';

export const ProfileScreen = () => {
    const { t } = useTranslation();


    const currentLanguage = ( language: 'es' | 'en' | 'pt'  ) => {
        switch (language) {
            case 'es':
                return t( 'resEspañol' );
            case 'en': 
                return t( 'resIngles' );
            case 'pt': 
                return t( 'resPortugues' );
            default:
                break;
        }
    }

    const changeLanguage = ( language: 'es' | 'en' | 'pt' ) => {
        i18n.changeLanguage( language )
        Toast.show({
            text1: t( 'resIdiomaCambiado' ),
            text2: currentLanguage( language ),
            type: 'success',
            visibilityTime: 2000,
        });
    }

    return (
        <View>

            <TouchableOpacity
                onPress={ ( ) =>  changeLanguage( 'es' ) }
            >
                <Text>{ t( 'resEspañol' ) }</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={ ( ) => changeLanguage( 'en' ) }
            >
                <Text>{ t( 'resIngles' ) }</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={ ( ) => changeLanguage( 'pt' ) }
            >
                <Text>{ t( 'resPortugues' ) }</Text>
            </TouchableOpacity>

        </View>
    )
}
