import React, { useContext, useState, memo, useMemo, useEffect } from 'react';
import { Animated, Dimensions, FlatList, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ThemeContext } from '../contexts/theme/ThemeContext'
import { StackScreenProps } from '@react-navigation/stack';
import { commonStyles } from '../styles/commonStyles';
import { AuthContext } from '../contexts/auth/AuthContext';
import { useUtils } from '../hooks/common/useUtils';
import { DynamicText } from '../components/common/DynamicText';
import { BaseStyle } from '../config';
import * as Animatable from 'react-native-animatable';
import { commonApi } from '../api/commonApi';
import { MenuRQ } from '../model/classes/common/MenuRQ';
import { Menu } from '../model/classes/common/Menu';
import { setMenuIcon } from '../helpers/common/setMenuIcon';
import IconFA from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/common/Header';
import { ProfileNavigation } from '../components/common/ProfileNavigation';
import { faArrowLeft, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { navigate } from '../navigator/RootNavigation';
import { useFont } from '../hooks/common/useFont';
import { SvgUri } from 'react-native-svg';

interface Props extends StackScreenProps<any, any>{};

const { scaleWithPixel, heightHeader } = useUtils();

export const HomeScreen = ({ navigation }: Props ) => {
    const { theme: { colors, grayColor, whiteColor } } = useContext( ThemeContext );
    const { semibold } = useFont();
    const { t } = useTranslation();
    const { getMainMenu } = commonApi();
    const [heightHeaders,  setHeightHeader] = useState( heightHeader());
    const { height } = Dimensions.get('window');
    const [menu, setMenu] = useState<Menu[]>( [] );
    const setRoutes = ( item: any ) => {
        if ( item.route !== '' ) {
            navigation.navigate( item.route )
        } else if ( item.external !== '' ) {
            Linking.openURL( item.external);
        }
    }
    const heightImageBanner = scaleWithPixel(140);
    const marginTopBanner = heightImageBanner - heightHeaders;
    useEffect(() => {
        const request: MenuRQ = new MenuRQ();
        request.Language = 'ES';
        request.MenuName = 'Appmovil';
        getMainMenu( request )
            .then(( response ) => {
                response.Items.map(( element, index ) => {
                    if ( element.Items.length > 0 && !response.Items.find( menu => menu.MenuName === 'MoreScreen' ) ) {
                        const moreMenu: Menu = new Menu();
                        moreMenu.Label = 'More';
                        moreMenu.MenuName = 'more';
                        moreMenu.ID = index;
                        moreMenu.Link = 'MoreScreen';
                        moreMenu.CssClass = 'ellipsis-horizontal';
                        response.Items.push( moreMenu );
                    }
                });
                setMenu( response.Items );
            })
    }, [])


    const setRouteParams = ( link: string ) => {
        switch ( link ) {
            case 'ActivitiesListScreen':
                return navigation.navigate( link, {
                    type: 'allActivities'
                });

            case 'MoreScreen': 
                return navigation.navigate( link, {
                    items: menu
                })
        
            default:
                return navigation.navigate( link );
                
        }
    }


    const renderIconService = () => {

        return (
            <FlatList 
                data={ menu }
                keyExtractor={ (menu) => menu.ID.toString() }
                numColumns={ 3 }
                renderItem={ ({ item }) => (
                    <TouchableOpacity
                        style={styles.itemService}
                        onPress={( ) => setRouteParams( item.Link ) }
                    >
                        <View
                            style={[styles.iconContent, {backgroundColor: colors.card}]}
                        >
                            <Icon 
                                name={ item.CssClass }
                                color={ colors.primary }
                                size={ 25 }
                            />
                        </View>
                        <DynamicText footnote greyColor numberOfLines={1}>
                            { t( item.MenuName )  }
                        </DynamicText>
                    </TouchableOpacity>
                    
                )}
            />
        )
    }


    return (
         <>
            <TouchableOpacity  style={{ position: 'absolute', bottom: '95%', zIndex: 300, alignSelf: 'flex-end', right: '3%'  }} onPress={ () => navigation.navigate( 'ProfileScreen' ) }>
                <FontAwesomeIcon
                    icon={ faUserCircle }
                    color={ whiteColor }
                    size={ 20 }
                />
            </TouchableOpacity>
            
            {/* <View style={ commonStyles.container }>
                <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
                <FlatList
                    
                    data={ getHomeMenu() }
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

            </View> */}
            <Animatable.View 
            animation='fadeIn'
            style={{flex: 1}}
        >
            <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
            <Image
                source={ require( '../../assets/images/common/trip-3.jpg' ) }
                style={[
                    styles.imageBackground,
                ]}
            />
            <SafeAreaView style={{flex: 1}} >
                <ScrollView
                    onContentSizeChange={() => setHeightHeader( heightHeader() )}
                    scrollEventThrottle={8}>
                    <View style={{paddingHorizontal: 20}}>
                        <View
                            style={[
                                styles.searchForm,
                                {
                                marginTop: marginTopBanner,
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                                shadowColor: colors.border,
                                },
                            ]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Search')}
                                activeOpacity={0.9}>
                                <View
                                    style={{ ...styles.textInput, backgroundColor: colors.card}}
                                >
                                    <DynamicText  fontFamily={ semibold } style={{ color: grayColor }} body1 greyColor>
                                        Búsqueda de Vuelo
                                    </DynamicText>
                                </View>
                            </TouchableOpacity>
                            { renderIconService() }
                        </View>
                    </View>
                    <View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Animatable.View>
            
        </> 

        
    )

}


const styles = StyleSheet.create({
    imageBackground: {
        height: 140,
        width: '100%',
        position: 'absolute',
      },
      searchForm: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        width: '100%',
        shadowColor: "red",
        shadowOffset: {
	        width: 0,
	        height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 10,
      },
      contentServiceIcon: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      contentCartPromotion: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      btnPromotion: {
        height: 25,
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      contentHiking: {
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 10,
      },
      promotionBanner: {
        height: scaleWithPixel(100),
        width: '100%',
        marginTop: 10,
      },
      line: {
        height: 1,
        marginTop: 10,
        marginBottom: 15,
      },
      iconContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      itemService: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingTop: 10,
      },
      promotionItem: {
        width: scaleWithPixel(200),
        height: scaleWithPixel(250),
      },
      tourItem: {
        width: scaleWithPixel(135),
        height: scaleWithPixel(160),
      },
      titleView: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
      },
      textInput: {
        height: 46,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      },
})