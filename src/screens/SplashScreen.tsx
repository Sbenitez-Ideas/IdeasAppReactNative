import React, { useContext } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ThemeContext } from '../contexts/theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ConfigContext } from '../contexts/config/ConfigContext';
import { IFTPEndPointRQ } from '../interfaces/auth/IFTPEndPointRQ';
import { NAME_APP } from 'react-native-dotenv';
import { useTranslation } from 'react-i18next';

interface Props extends StackScreenProps<any, any>{};



export const SplashScreen = ({ navigation }: Props ) => {
    const { t } = useTranslation();
    const { theme: { colors, secondary } } = useContext( ThemeContext );
    const { getEndpointData } = useContext( ConfigContext );
    const onStarted = () => {
        const request: IFTPEndPointRQ = {
            appName: NAME_APP,
            appPlataform: (Platform.OS === 'android') ? 'android': 'ios',
            appVerison: '1.0'

        };
        getEndpointData( request );
    }

    return (
        <View style={{ 
            ...styles.container,
            backgroundColor: colors.primary
        }}>
          <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duration={ 1500 }
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="stretch"
            />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: colors.text
            }]}>{ t( 'resViajesUnClic' ) }</Text>
            <View style={styles.button}>
                <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen'); onStarted()}}>
                    <LinearGradient
                        colors={[colors.primary, secondary]}
                        style={styles.signIn}
                    >
                        <Text style={styles.textSign}>{ t( 'resEmpezar' ) }</Text>
                        <Icon 
                            name="chevron-forward-outline"
                            color="#fff"
                            size={20}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    )
}

const {height} = Dimensions.get("screen");
const height_logo = height * 0.40;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop:5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
  });
  
