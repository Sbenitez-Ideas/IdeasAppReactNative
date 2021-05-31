import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native-animatable'
import Toast from 'react-native-toast-message';
import i18n from '../i18n/i18n';
import { Header } from '../components/common/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ThemeContext } from '../contexts/theme/ThemeContext';
import { faArrowLeft, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/core';
import { AuthContext } from '../contexts/auth/AuthContext';
import i18next from 'i18next';
import { DynamicText } from '../components/common/DynamicText';
import { useFont } from '../hooks/common/useFont';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { getCurrentLanguage } from '../helpers/common/getCurrentLanguage';
import { ScrollView, StyleSheet } from 'react-native';
import { DynamicTextInput } from '../components/common/DynamicTextInput';
import { TravelerCorporateRQ } from '../model/classes/corporate/TravelerCorporateRQ';
import { SearchFieldTraveler } from '../model/enums/SearchFieldTraveler';
import { corporateApi } from '../api/corporateApi';
import { TravelerCorporate } from '../model/classes/corporate/TravelerCorporate';
import Moment from 'moment';

export const ProfileScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { semibold } = useFont();
    const { theme: { colors, grayColor, whiteColor } } = useContext( ThemeContext );
    const { userData } = useContext( AuthContext );
    const { getTraveler } = corporateApi();
    const [profile, setProfile] = useState<TravelerCorporate>();


    useEffect(() => {

        const request: TravelerCorporateRQ = new TravelerCorporateRQ();
        request.SearchValue = userData.IDUser.toString();
        request.IDEntity = userData.IDEntityDefault;
        request.SearchField = SearchFieldTraveler.id;
        request.Language = 'EN';
        getTraveler( request )
            .then(( response ) => {
                setProfile( response[0] );
            })

        
    }, [])

    return (
        <View>
            <Header 
                title={  ` ${ userData.FirstName} ${ userData.LastName } `  }
                subTitle={ t( 'resPerfil' ) }
                renderLeft={ () => {
                    return ( 
                        <FontAwesomeIcon 
                            icon={ faArrowLeft }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }
                onPressLeft={ () => navigation.goBack() }
            />

            <TouchableOpacity style={{ alignSelf: 'flex-end', marginHorizontal: 10, flexDirection: 'row' }}
                onPress={ () => navigation.navigate( 'ChangeLanguageScreen' ) }
            >
                <FontAwesomeIcon 
                    icon={ faGlobe }
                    color={ colors.primary }
                    size={ 20 }
                />
                <DynamicText fontFamily={ semibold } style={{ color: grayColor }}>  { t( getCurrentLanguage( i18next.language ) ) }  </DynamicText>
                
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.contain}>
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Nombre' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    onChangeText={ ( text ) => console.log( text ) }
                    placeholder={ 'Ingresa tu nombre' }
                    value={ profile?.FullName }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'DNI' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    onChangeText={ ( text ) => console.log( text ) }
                    placeholder={ 'Ingresa tu dni' }
                    value={ profile?.IDNumber }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Fecha de nacimiento' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ Moment(  profile?.BirthDate ).format( 'LL' ) }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'E-mail' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ profile?.Email }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Celular' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ profile?.HomePhone }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Nacionalidad' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'No. Pasaporte' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ profile?.PassportNumber }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Fecha de Vencimiento' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ Moment( profile?.PassportExpirationDate ).format( 'LL' ) }
                />
                <View style={styles.contentTitle}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Centro de Costos' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                <View style={{ flex:1, backgroundColor: colors.primary, marginTop: 20, width: '100%', borderRadius: 5 }}>
                    <DynamicText fontFamily={ semibold } style={{ fontSize: 20, alignSelf: 'center', color: whiteColor }}> Contacto en caso de emergencia </DynamicText>
                </View>

                <View style={[styles.contentTitle, { marginTop: 10 }]}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Nombre' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                <View style={[styles.contentTitle, { marginTop: 10 }]}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Telefono de Contacto' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                <View style={[styles.contentTitle, { marginTop: 10 }]}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'FidelityName' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                <View style={[styles.contentTitle, { marginTop: 10 }]}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'FidelityNumber' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                <View style={[styles.contentTitle, { marginTop: 10 }]}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Aerolínea' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                <View style={[styles.contentTitle, { marginTop: 10 }]}>
                    <DynamicText fontFamily={ semibold }  headline semibold>
                    { 'Preferencia de silla' }
                    </DynamicText>
                </View>
                <DynamicTextInput 
                    value={ '' }
                />
                

            </ScrollView>

            {/* <TouchableOpacity
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
            </TouchableOpacity> */}

        </View>
    )
}


const styles = StyleSheet.create({
    contain: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 150
    },
    contentTitle: {
        alignItems: 'flex-start',
        width: '100%',
        height: 32,
        justifyContent: 'center',
    },
})