import React, { useContext } from 'react'
import { WebView } from 'react-native-webview';
import { RootStackParams } from '../../navigator/Navigator';
import { Header } from './Header';
import { StackScreenProps } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ProfileNavigation } from './ProfileNavigation';


interface Props extends StackScreenProps<RootStackParams, 'Chat'>{};

export const Chat = ( { navigation }:Props ) => {

    const { theme: { colors } } = useContext( ThemeContext );

    return (
        <>
            <Header 
                title={ 'Chat' }
                onPressLeft={ () => {
                    navigation.goBack()
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
                        <ProfileNavigation navigation={ navigation } />
                    )
                } }
            />
            <WebView  style={{ bottom: 50 }} source={{ uri: 'https://aeroviajes.kontroltravel.com/Utilities/helperApp.aspx?typeApp=chat&codEntidade=31966' }} />
        </>
    )
}
