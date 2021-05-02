import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import * as RootNavigation from '../../navigator/RootNavigation';
import { useTranslation } from 'react-i18next';

export const BottomMenu = () => {

    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const { t } = useTranslation();
    
    return (
        <View style={{

            position: 'absolute',
            backgroundColor: colors.primary,
            bottom: 0,
            width: '100%',
            height: 50,
            flexDirection: 'row',
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 25


        }}>

            <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Icon 
                    name="airplane-outline"
                    color={ buttonText }
                    size={30}
                />
                    <Text style={{ 
                ...styles.textMenus,
                color: buttonText
            }}>{ t('resMisViajes') }</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={{
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon 
                    name="checkbox-outline"
                    color={ buttonText }
                    size={30}
                />
                <Text style={{ 
                    ...styles.textMenus,
                    color: buttonText
                }}>{ t('resAprobaciones') }</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon 
                    name="people-outline"
                    color={ buttonText }
                    size={30}
                />
                <Text style={{ 
                    ...styles.textMenus,
                    color: buttonText
                }}>{ t('resTerceros') }</Text>
            </TouchableOpacity>
                
        
            <TouchableOpacity style={{
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon 
                    name="call-outline"
                    color={ buttonText }
                    size={30}
                />
                <Text style={{ 
                    ...styles.textMenus,
                    color: buttonText
                }}>{ t('resAyuda') }</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={ () => RootNavigation.navigate('HomeScreen') } 
                style={{
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                    <Icon 
                        name="play-forward-outline"
                        color={ buttonText }
                        size={30}
                    />
                <Text style={{ 
                    ...styles.textMenus,
                    color: buttonText
                }}>{ t('resMenu') }</Text>
            </TouchableOpacity>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontWeight: 'bold'
    }
})