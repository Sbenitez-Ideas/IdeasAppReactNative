import React, { useContext, useState } from 'react';
import { Dimensions, FlatList, Linking, StatusBar, StyleSheet, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ThemeContext } from '../contexts/theme/ThemeContext';
import { getHomeMenu } from '../helpers/common/getHomeMenu';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { commonStyles } from '../styles/commonStyles';

interface Props extends StackScreenProps<any, any>{};

export const HomeScreen = ({ navigation }: Props ) => {
    const { theme: { colors, buttonText } } = useContext( ThemeContext );
    const { height } = Dimensions.get('window');
    const setRoutes = ( item: any ) => {
        if ( item.route !== '' ) {
            navigation.navigate( item.route )
        } else if ( item.external !== '' ) {
            Linking.openURL( item.external);
        }
    }

    return (
        <>
            <View style={ commonStyles.container }>
                <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
                <FlatList
                    
                    data={ getHomeMenu()  }
                    keyExtractor={ (menu)  => menu.label}
                    numColumns={2}
                    renderItem={ ({ item }) => (
                        <TouchableOpacity  
                            style={{ 
                                height: height * 0.2,
                                ...commonStyles.goutContainer, 
                                backgroundColor: colors.primary 
                            }}
                            onPress={ () => setRoutes( item )}>
                            
                            <FontAwesomeIcon style={{
                                ...commonStyles.iconsMenu, 
                                color: buttonText }} 
                                icon={ item.icon }
                                size={ 50 }
                            />

                            <Text style={{ 
                                ...commonStyles.textMenu,
                                color: buttonText
                            }}>{ item.label }</Text>
                        </TouchableOpacity>
                    )}
                />

            </View>
            
        </>
    )

}
