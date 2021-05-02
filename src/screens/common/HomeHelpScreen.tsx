import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useContext } from 'react'
import { Dimensions, FlatList, Linking, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles'
import { getHelpMenu } from '../../helpers/common/getHelpMenu';
import { RootStackParams } from '../../navigator/Navigator';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

interface Props extends StackScreenProps<RootStackParams, 'HomeHelpScreen'>{};

export const HomeHelpScreen = ( { navigation }: Props ) => {
    const { t } = useTranslation();
    const { height } = Dimensions.get('window')
    const { theme: { colors, buttonText } } = useContext( ThemeContext );
    const setRoutes = ( item: any ) => {
        if ( item.route !== '' ) {
            navigation.navigate( item.route )
        } else if ( item.external === 'assistance' ) {
            Linking.openURL(`tel:${7954750}`)
        }  else if ( item.external !== '' ) {
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
                    { t( 'resHomeHelpTitulo' ) }
                </Text>
                <FlatList
                    
                    data={ getHelpMenu() }
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
                            
                            <Icon style={{
                                ...commonStyles.iconsMenu, 
                                color: buttonText }} 
                                name={ item.icon }
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
