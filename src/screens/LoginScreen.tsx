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



interface Props extends StackScreenProps<any, any>{};

export const LoginScreen = ({ navigation }: Props ) => {
    
    const { t } = useTranslation();
    const { width } = Dimensions.get('window');
    const { signIn, errorMessage, removeError } = useContext( AuthContext );
    const { theme: { colors, secondary } } = useContext( ThemeContext );
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
            }
        }
        else {
            setData({
                ...data,
                UserName: '',
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    return (
        <View style={{ 
            ...loginStyles.container,
            backgroundColor: colors.primary
        }}>
            <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
            <View style={loginStyles.header}>
                <Text style={loginStyles.text_header}>{ t('resBienvenido') }!</Text>
            </View>
            <Animatable.View 
                animation="fadeInUpBig"
                style={[loginStyles.footer, {
                backgroundColor: colors.background
                }]}>
                <Text style={[loginStyles.text_footer, {
                    color: colors.text
                }]}>{ t( 'resUsuario' ) }</Text>
                <View style={loginStyles.action}>
                    <Icon 
                        name="person-outline"
                        color={colors.text}
                        size={20} />
                    <TextInput 
                        placeholder={ t( 'resIngresaUsuario' ) }
                        placeholderTextColor="#666666"
                        style={[loginStyles.textInput, {
                            color: colors.text
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
                        <Text style={loginStyles.errorMsg}>{ t( 'resIngresaUsuario' ) }</Text>
                    </Animatable.View>
                }
               
                <Text style={[loginStyles.text_footer, {
                    color: colors.text,
                    marginTop: 35
                }]}>{ t( 'resContraseña' ) }</Text>
                <View style={loginStyles.action}>
                    <Icon 
                        name="lock-closed-outline"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        ref={ ref => ref && ref.setNativeProps({ style: { fontFamily: 'Helvetica' } }) }
                        placeholder={ t( 'resIngresaContraseña' ) }
                        placeholderTextColor="#666666"
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
                            color="grey"
                            size={20}
                        />
                        :
                        <Icon 
                            name="eye-outline"
                            color="grey"
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
                            <Text style={[loginStyles.textSign, {
                                color:'#fff'
                            }]}>{ t('resIngresar') }</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

        </Animatable.View>
    </View>
        
    )
}
