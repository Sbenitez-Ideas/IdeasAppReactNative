import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { DynamicText } from '../../components/common/DynamicText';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { Header } from '../../components/common/Header';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { FilledInputText } from '../../components/common/FilledInputText';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';


interface Props {
    justified: ( confirm: boolean, value?: string ) => void;
}

export const JustificationModalScreen = ( { justified }:Props ) => {
    const { t } = useTranslation();
    const { theme: { colors } } = useContext( ThemeContext );
    const [justification, setJustification] = useState('');


    const validateField = () => {
        if ( justification  !== '' ) {
            justified( true, justification );
        } else {
            Toast.show({
                text1: 'Error',
                text2: 'La justificacion esta vacia',
                type: 'error',
                visibilityTime: 2000,
            });
        }
        
    }

    return (
        <>
            <Header 
                title={ 'Justificacion de Rechazo' }
                onPressLeft={ () => {
                    justified( false );
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faTimes }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }

                renderRight={ () => {
                    return (
                        <TouchableOpacity onPress={ () =>  validateField( ) }>
                            <DynamicText style={{ fontSize: 15 }} headline primaryColor numberOfLines={1}>
                                { t( 'resConfirmar' ) }
                            </DynamicText>
                        </TouchableOpacity>
                    )
                } }
            />

            <View style={{ flex: 1 }}>
                <DynamicText style={{ alignSelf: 'center', marginTop: 30 }}>¿Cuál es el motivo de rechazo para la solicitud?</DynamicText>
                <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }}>
                    <FilledInputText 
                        disabled={ false }
                        label='justificacion'
                        onChangeText={ ( text ) => setJustification( text ) }
                        value={ justification }
                    />
                </View>
                
            </View>
        </>
    )
}
