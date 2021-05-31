import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useContext } from 'react'
import { Header } from '../../components/common/Header';
import { faAngleRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { FlatList, RefreshControl, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from '../../components/common/DynamicText';
import { Menu } from '../../model/classes/common/Menu';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements'
import { useFont } from '../../hooks/common/useFont';
import { getParamsUri } from '../../helpers/common/getParamsUri';
import { useNavigation } from '@react-navigation/native';


interface Props extends StackScreenProps<RootStackParams, 'MoreScreen'>{};

export const MoreScreen = ({ route }: Props) => {
    const { theme: { colors, secondary, buttonText, grayColor, fieldColor, } } = useContext( ThemeContext );
    const { items } = route.params;
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { semibold } = useFont()

    const calculateRoute = ( menu: Menu ) => {
        switch ( menu.Link ) {
            case 'ActivitiesListScreen':
                return navigation.navigate( menu.Link, {
                    type: menu.MenuName
                } );
            default:
                return navigation.navigate( menu.Link );
                
        }
    }

    return (
        <> 
            <Header 
                title={ 'Otras opciones' }
                renderLeft={ () => {
                    return ( 
                        <FontAwesomeIcon 
                            icon={ faArrowLeft }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }
                onPressLeft={ () => navigation.goBack() }
            />

            {/* <FlatList
                contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 10,
                }}
                data={ items }
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                    calculateItems( item, index )
                )}
            /> */}

             <View style={{ marginTop: 15 }}>
                {items.map( ( fatherItem, index ) => {
                    return (
                        <View key={ index }>
                            { fatherItem?.Items?.length > 0 &&
                                <DynamicText fontFamily={ semibold } style={{ color: colors.primary }}  headline> { t( fatherItem.MenuName ) } </DynamicText>
                            }
                            
                            {
                                fatherItem?.Items?.map( ( childItem, index ) => {
                                    return ( 
                                        <TouchableOpacity key={ index }
                                            style={[styles.item, {borderBottomColor: colors.border}]}
                                            onPress={() => calculateRoute( childItem ) }>
                                            <View style={{flexDirection: 'row'}}>
                                                <Icon
                                                    name={ childItem.CssClass }
                                                    type='font-awesome'
                                                    color={ colors.primary }
                                                    style={{marginHorizontal: 10}}
                                                />
                                                <DynamicText body1>{  t( childItem.Label )}</DynamicText>
                                            </View>
                                            <FontAwesomeIcon
                                                icon={ faAngleRight }
                                                size={18}
                                                color={colors.primary}
                                            />
                                        </TouchableOpacity>

                                    )
                                })
                            }
                        </View>
                    )}
                )}
                </View>
            
            
        </>
    )
}


const styles = StyleSheet.create({
    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})