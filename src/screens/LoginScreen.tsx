import React, { useContext, useEffect, useRef } from 'react'
import { Text, View, TextInput, StatusBar, Alert, Dimensions, ActivityIndicator } from 'react-native'
import { ThemeContext } from '../contexts/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { loginStyles } from '../styles/loginStyles';
import { useState } from 'react';
import { AuthContext } from '../contexts/auth/AuthContext';
import Toast from 'react-native-toast-message';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { DynamicText } from '../components/common/DynamicText';
import { useFont } from '../hooks/common/useFont';



interface Props extends StackScreenProps<any, any>{};

export const LoginScreen = ({ navigation }: Props ) => {
    
    const { t } = useTranslation();
    const { semibold, regular } = useFont()
    const { width } = Dimensions.get('window');
    const { signIn, errorMessage, removeError } = useContext( AuthContext );
    const { theme: { colors, secondary, grayColor } } = useContext( ThemeContext );
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        UserName: '',
        Password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });


    useEffect(() => {

        if (errorMessage.length > 0) {
            Toast.show({
                text1: 'Error',
                text2: errorMessage,
                type: 'error',
                visibilityTime: 2000,
                onHide: () => {
                    removeError()
                }
            })

            setLoading( !loading );
        }

    }, [errorMessage])

    const textInputChange = (val: string): void => {
        if( val.trim().length > 0 ) {
            setData({
                ...data,
                UserName: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                UserName: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val: string): void => {
        if( val.trim().length > 0 ) {
            setData({
                ...data,
                Password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                Password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = (): void => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    /**
     * Envia una peticion al servicio para loguear a la usuario actual.
     *
     * @param {string} userName Nombre del usuario.
     * @param {string} password Contraseña del usuario.
     */
    const loginHandle = (userName: string, password: string): void => {
        setLoading( !loading );
        if (userName.length > 0) {
            if (password.length > 0) {
                signIn({UserName: userName, Password: password});
            }
            else {
                setData({
                    ...data,
                    Password: '',
                    isValidPassword: false
                });
                setLoading( !loading );
            }
        }
        else {
            setData({
                ...data,
                UserName: '',
                check_textInputChange: false,
                isValidUser: false
            });
            setLoading( !loading );
        }
    }

    return (
        <View style={{ 
            ...loginStyles.container,
            backgroundColor: colors.primary
        }}>
            <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
            <View style={loginStyles.header}>
                <DynamicText fontFamily={ semibold } style={loginStyles.text_header}>{ t('resBienvenido') }!</DynamicText>
            </View>
            <Animatable.View 
                animation="fadeInUpBig"
                style={[loginStyles.footer, {
                backgroundColor: colors.background
                }]}>
                <DynamicText fontFamily={ semibold } style={[loginStyles.text_footer, {
                    color: colors.text
                }]}>{ t( 'resUsuario' ) }</DynamicText>
                <View style={loginStyles.action}>
                    <Icon 
                        name="person-outline"
                        color={colors.text}
                        size={20} />
                    <TextInput
                        
                        placeholder={ t( 'resIngresaUsuario' ) }
                        placeholderTextColor={ grayColor }
                        style={[loginStyles.textInput, {
                            color: colors.text,
                            fontFamily:  regular
                        }]}

                        onChangeText={ (val) => textInputChange(val) }
                        value={ data.UserName }/>
                    {data.UserName.length > 0 ? 
                    <Animatable.View
                        animation="bounceIn"
                    >
                        <Icon 
                            name="checkmark-circle-outline"
                            color="green"
                            size={20}
                        />
                    </Animatable.View>
                    : null}
                </View>
                { data.isValidUser ? null : 
                    <Animatable.View animation="fadeInLeft" duration={ 500 }>
                        <DynamicText style={loginStyles.errorMsg}>{ t( 'resIngresaUsuario' ) }</DynamicText>
                    </Animatable.View>
                }
               
                <DynamicText fontFamily={ semibold }  style={[loginStyles.text_footer, {
                    color: colors.text,
                    marginTop: 35
                }]}>{ t( 'resContraseña' ) }</DynamicText>
                <View style={loginStyles.action}>
                    <Icon 
                        name="lock-closed-outline"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        ref={ ref => ref && ref.setNativeProps({ style: { fontFamily: regular } }) }
                        placeholder={ t( 'resIngresaContraseña' ) }
                        placeholderTextColor={ grayColor }
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[loginStyles.textInput, {
                            color: colors.text,
                        }]} 
                        onChangeText={ (val) => handlePasswordChange(val) }
                        value={ data.Password }
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        onPress={ updateSecureTextEntry }>
                        {data.secureTextEntry ? 
                        <Icon 
                            name="eye-off-outline"
                            color={ grayColor }
                            size={20}
                        />
                        :
                        <Icon 
                            name="eye-outline"
                            color={ grayColor }
                            size={20}
                        /> 
                        }
                    </TouchableOpacity>
                </View>
                { data.isValidPassword ? null : 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={loginStyles.errorMsg}>{ t( 'resIngresaContraseña' ) }</Text>
                    </Animatable.View>
                }

                { loading && 
                    <ActivityIndicator
                        style={{ marginTop: 5 }}
                        size="large"
                        animating={ true }
                        color={ colors.primary }
                    ></ActivityIndicator>
                }

                <View style={loginStyles.button}>
                    <TouchableOpacity onPress={ () => loginHandle( data.UserName, data.Password ) }
                        style={loginStyles.signIn}>
                        <LinearGradient
                            colors={[colors.primary, secondary]}
                            style={{...loginStyles.signIn, width: width * .98}}
                        >
                            <DynamicText fontFamily={ semibold } style={[loginStyles.textSign, {
                                color:'#fff'
                            }]}>{ t('resIngresar') }</DynamicText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

        </Animatable.View>
    </View>
        
    )
}
