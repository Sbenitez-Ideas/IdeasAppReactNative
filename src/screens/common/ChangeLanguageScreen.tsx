import { faAngleRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { Header } from '../../components/common/Header';
import { RootStackParams } from '../../navigator/Navigator';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '../../helpers/common/getCurrentLanguage';
import { SvgCssUri, SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import i18next from 'i18next';
import i18n from '../../i18n/i18n';
import Toast from 'react-native-toast-message';




interface Props extends StackScreenProps<RootStackParams, 'ChangeLanguageScreen'>{};

export const ChangeLanguageScreen = ({ navigation }: Props ) => {
    const [language, setLanguage] = useState( '' );
    const [languages, setLanguages] = useState([
        { language: 'en', selected: (i18next.language === 'en') },
        { language: 'es', selected: (i18next.language === 'es') },
        { language: 'pt', selected: (i18next.language === 'pt') }
    ]);

    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const { t } = useTranslation();


    const calculateImageLanguage = ( language: string ) => {
        switch (language) {
            case 'es':
                return require( '../../../assets/images/languages/spain.png' );
            case 'en':
                return require( '../../../assets/images/languages/us.png' );
            case 'pt':
                return require( '../../../assets/images/languages/brazil.png' );
            default:
                break;
        }
    }

    const onSelectedLanguage = (language: { language: string, selected: boolean }, index: number) => {
        if ( !language.selected  ) {
            setLanguage( language.language );
        }
        setLanguages(
            languages.map( lng => {
                return {
                    ...lng,
                    selected: ( languages[ index ].language === lng.language ) ? !lng.selected : (lng.selected) ? !lng.selected : lng.selected
                }
            } )
        )
    }

    const applyLanguage = () => {
        if ( language ) {
            i18n.changeLanguage( language )
            Toast.show({
                text1: t( 'resIdiomaCambiado' ),
                text2: t( getCurrentLanguage( language )),
                type: 'success',
                visibilityTime: 800,
            });
            navigation.goBack();
        } else {
            i18n.changeLanguage( language )
            Toast.show({
                text1: 'Seleccione un idioma',
                type: 'error',
                visibilityTime: 800,
            });
        }
    }

    return (
        <>
            <Header
                title={ t( 'resFiltrar' ) }
                onPressLeft={ () => {
                    navigation.goBack()
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faArrowLeft }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }

                renderRight={ () => {
                    return (
                        <TouchableOpacity onPress={ () => applyLanguage() }>
                            <DynamicText headline primaryColor numberOfLines={1}>
                                { t( 'resAplicar' ) }
                            </DynamicText>
                        </TouchableOpacity>
                        
                    )
                } }
            />

            {
                languages.map( ( lng, index ) => {
                    return ( 
                        
                        <TouchableOpacity key={ index }
                            style={[styles.item, {borderBottomColor: colors.border}]}
                            onPress={() => onSelectedLanguage(lng, index) }>
                            <View style={{flexDirection: 'row'}}>
                                <Image
                                    style={{ maxHeight: 25, maxWidth: 25, marginHorizontal:  10 }}
                                    source={ calculateImageLanguage(  lng.language ) } 
                                />
                                <DynamicText body1 style={{ marginHorizontal: 10 }}>{  t( getCurrentLanguage( lng.language ) )}</DynamicText>
                            </View>
                            <Icon 
                                name={ ( lng.selected ) ? 'checkmark-circle-outline' :  'ellipse-outline' }
                                size={ 24 }
                                color={ colors.primary }
                            />
                        </TouchableOpacity>
                    )
                } )
            }
            
        </>
    )
}


const styles = StyleSheet.create({
    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})