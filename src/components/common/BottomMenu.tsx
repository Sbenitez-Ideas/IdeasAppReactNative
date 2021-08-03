import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import * as RootNavigation from '../../navigator/RootNavigation';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckSquare, faForward, faPlane, faUsers } from '@fortawesome/free-solid-svg-icons';


interface Props {
    stateScreen: any
}

export const BottomMenu = ({stateScreen: {routes}}: Props) => {
    const { theme: { colors, grayColor } } = useContext( ThemeContext );
    const { t } = useTranslation();
    const [screenName, setScreenName] = useState('');
    const [bookingParam, setBookingParam] = useState('');
    useEffect(() => {
        setScreenName( routes[ routes.length - 1 ].name );    
        setBookingParam( routes[ routes.length - 1 ].params?.type );
    }, [routes[ routes.length - 1 ].name, routes[ routes.length - 1 ].params?.type], )

    return (
        <View style={{

            position: 'absolute',
            backgroundColor: colors.background,
            borderWidth: .5,
            borderTopColor: '#9B9B9B' ,
            bottom: 0,
            width: '100%',
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 25,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
        }}>

            <TouchableOpacity style={ styles.container }
                onPress={ () => RootNavigation.navigate( 'MyServicesScreen') }
            >
                <FontAwesomeIcon 
                    icon={ faPlane }
                    color={ ( screenName === 'MyServicesScreen') ? colors.primary : grayColor }
                    size={20}
                />
                    <Text style={{ 
                ...styles.textMenus,
                color: ( screenName === 'MyServicesScreen') ?  colors.primary : grayColor
            }}>{ t('resMisServicios') }</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={ styles.container }
                onPress={ () => RootNavigation.navigate('BookingListScreen', { type: 'others'}) }
            >
                <FontAwesomeIcon 
                    icon={ faUsers }
                    color={ ( screenName === 'BookingListScreen' && bookingParam === 'others' ) ? colors.primary : grayColor }
                    size={20}
                />
                <Text style={{ 
                    ...styles.textMenus,
                    color: ( screenName === 'BookingListScreen' && bookingParam === 'others' ) ?  colors.primary : grayColor
                }}>{ t('resSolicitudes') }</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={ styles.container }
                onPress={ () => RootNavigation.navigate('BookingListScreen', { type: 'approver'}) }
            >
                <FontAwesomeIcon 
                    icon={ faCheckSquare }
                    color={ ( screenName === 'BookingListScreen' && bookingParam === 'approver' ) ? colors.primary : grayColor }
                    size={20}
                />
                <Text style={{ 
                    ...styles.textMenus,
                    color: ( screenName === 'BookingListScreen' && bookingParam === 'approver' ) ?  colors.primary : grayColor
                }}
                >{ t('resAprobacion') }</Text>
            </TouchableOpacity>
                
            {/* <TouchableOpacity 
                onPress={ () => RootNavigation.navigate('Chat')  }
                style={ styles.container }
            >
                <FontAwesomeIcon 
                    icon={ faPhoneSquare }
                    color={ ( screenName === 'Chat') ? colors.primary : grayColor }
                    size={20}
                />
                <Text style={{ 
                    ...styles.textMenus,
                    color: ( screenName === 'Chat') ?  colors.primary : grayColor
                }}>{ 'Chat' }</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
                onPress={ () => RootNavigation.navigate('HomeScreen') } 
                style={ styles.container }
            >
                    <FontAwesomeIcon 
                        icon={ faForward }
                        color={ ( screenName === 'HomeScreen' ) ?  colors.primary : grayColor }
                        size={20}
                    />
                <Text style={{ 
                    ...styles.textMenus,
                    color: ( screenName === 'HomeScreen' ) ?  colors.primary : grayColor
                }}>{ t('resMenu') }</Text>
            </TouchableOpacity>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    menu: {
        backgroundColor: 'red'
    },
    
    textMenus: {
        justifyContent:'center',
        alignItems:'center',
        fontFamily: 'Raleway-Regular'
    }
})