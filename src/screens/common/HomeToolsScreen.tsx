import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Dimensions, FlatList, Linking, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { getToolsMenu } from '../../helpers/common/getToolsMenu';
import { RootStackParams } from '../../navigator/Navigator';
import { commonStyles } from '../../styles/commonStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTranslation } from 'react-i18next';

interface Props extends StackScreenProps<RootStackParams, 'HomeToolsScreen'>{};

export const HomeToolsScreen = ({ navigation }:Props ) => {
    const { t } = useTranslation();
    const { height } = Dimensions.get('window')
    const { theme: { colors, buttonText } } = useContext( ThemeContext );
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
                <Text style={{ 
                    ...commonStyles.title,
                    color: colors.primary
                }}>
                    { t( 'resHomeToolsTitulo' ) }
                </Text>
                <FlatList
                    
                    data={ getToolsMenu() }
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
