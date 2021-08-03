import React, { useContext } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ThemeContext } from '../contexts/theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ConfigContext } from '../contexts/config/ConfigContext';
import { IFTPEndPointRQ } from '../model/interfaces/auth/IFTPEndPointRQ';
import { NAME_APP } from 'react-native-dotenv';
import { useTranslation } from 'react-i18next';
import { DynamicText } from '../components/common/DynamicText';
import { useFont } from '../hooks/common/useFont';

interface Props extends StackScreenProps<any, any>{};

export const SplashScreen = ({ navigation }: Props ) => {
    const { t } = useTranslation();
    const { semibold } = useFont();
    const { theme: { colors, secondary } } = useContext( ThemeContext );
    const { getEndpointData } = useContext( ConfigContext );

    const calculateNextScreen = () => {
        navigation.navigate('SlidesScreen');
        onStarted()
        /* navigation.navigate('LoginScreen');  */
        
    }

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
                source={{ uri: `http://ideasfractal.com/wp-content/uploads/2017/04/Logo-IdeasFractal-transpararente.png` }}
                style={styles.logo}
                resizeMode='contain'
            />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig"
        >
            <DynamicText fontFamily={ semibold } style={[styles.title, {
                color: colors.text
            }]}>{ t( 'resViajesUnClic' ) }</DynamicText>
            <View style={styles.button}>
                <TouchableOpacity onPress={() => { calculateNextScreen() }}>
                    <LinearGradient
                        colors={[colors.primary, secondary]}
                        style={styles.signIn}
                    >
                        <DynamicText fontFamily={ semibold } style={styles.textSign}>{ t( 'resEmpezar' ) }</DynamicText>
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

const {height, width} = Dimensions.get("screen");
const width_logo = width;
const height_logo = height * .15;

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
        width: width_logo,
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
  
