import React, { useContext, useState, useEffect } from 'react';
import { Dimensions, FlatList, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ThemeContext } from '../contexts/theme/ThemeContext'
import { StackScreenProps } from '@react-navigation/stack';
import { useUtils } from '../hooks/common/useUtils';
import { DynamicText } from '../components/common/DynamicText';
import * as Animatable from 'react-native-animatable';
import { commonApi } from '../api/commonApi';
import { MenuRQ } from '../model/classes/common/MenuRQ';
import { Menu } from '../model/classes/common/Menu';
import Icon from 'react-native-vector-icons/Ionicons';
import { Icon as IconProp } from 'react-native-elements'
import { useTranslation } from 'react-i18next';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useFont } from '../hooks/common/useFont';
import { Card } from '../components/common/Card';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/auth/AuthContext';
import { MenuInfo } from '../model/interfaces/common/MenuInfo';

interface Props extends StackScreenProps<any, any>{};

const { scaleWithPixel, heightHeader } = useUtils();

export const HomeScreen = ({ navigation }: Props ) => {
    const { theme: { colors, whiteColor } } = useContext( ThemeContext );
    const { semibold } = useFont();
    const { t } = useTranslation();
    const { getMainMenu } = commonApi();
    const [heightHeaders,  setHeightHeader] = useState( heightHeader());
    const { userData: { ApproverExpenses } } = useContext( AuthContext );
    const deltaY = new Animated.Value(0);
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
    const PromotionData = [
        {
          id: "1",
          image: require( '../../assets/images/common/plane.jpeg' ),
          title1: "Conoce las nuevas restricciones aeroportuarias",
          title2: "Mundo",
          subtitle: 'Vuelos'
        },
        {
          id: "2",
          image:  require( '../../assets/images/common/hotel.jpg' ),
          title1: "Adiós a pagar hoteles en efectivo",
          title2: "Estados Unidos",
          subtitle: 'Hoteles'
        },
        {
          id: "3",
          image: require( '../../assets/images/common/covid.jpg' ),
          title1: "Nueva cepa de covid en el continente asiático",
          title2: "Japón",
          subtitle: 'Covid'
        }        
      ];
      
    useEffect(() => {
        const request: MenuRQ = new MenuRQ();
        request.Language = 'ES';
        request.MenuName = 'Appmovil';
        getMainMenu( request )
            .then(( response ) => {
               /*  console.log( 'response', response );
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
                }); */
                setMenu( response.Items );
            })
    }, [])

    const setRouteParams = ( item: Menu ) => {
        switch ( item.Link ) {
            case 'ActivitiesListScreen':
                switch ( item.MenuName ) {
                    case 'allActivities':
                        return navigation.navigate( item.Link, {
                            type: 'allActivities'
                        });
                       
                    case 'pendingApprove':
                        if ( ApproverExpenses ) {
                            return navigation.navigate( item.Link, {
                                type: 'pendingApprove'
                            });
                        } else {
                            return Toast.show({
                                text2: t( 'resNoTienePermisosAprobador' ),
                                type: 'info',
                                visibilityTime: 1000,
                                props: { height: 100 }
                            })
                        }          
                    case 'pendingLegalize':
                        return navigation.navigate( item.Link, {
                            type: 'pendingLegalize'
                        });

                    default:
                        return navigation.navigate( item.Link, {
                            type: 'allActivities'
                        });
                }
            case 'MoreScreen': 
                return navigation.navigate( item.Link, {
                    items: menu
                })
        
            default:
                return navigation.navigate( item.Link );
                
        }
    }


    const calculateParamsServices = ( item: Menu ) => {
        switch ( item.Link ) {
            case 'BookingListScreen':
                return navigation.navigate( item.Link, {
                    type: item.MenuName
                })
            default: 
                return navigation.navigate( item.Link )
        }
    }

    const  renderViatics = (  ) => {
        let menuViatics: Menu = new Menu;
        menu.forEach(element => {
            if ( element.MenuName === 'viatics' ) {     
                menuViatics = element;           
            }
        });

        return (
            <FlatList 
                data={ menuViatics.Items }
                keyExtractor={ (menu) => menu.ID.toString() }
                numColumns={ 2 }
                renderItem={ ({ item }) => (
                    <TouchableOpacity
                        style={styles.itemService}
                        onPress={( ) => setRouteParams( item ) }
                    >
                        <View
                            style={[styles.iconContent, {backgroundColor: colors.card}]}
                        >
                            <IconProp
                                name={ item.CssClass }
                                type='font-awesome'
                                color={ colors.primary }
                                style={{marginHorizontal: 10}}
                            />
                        </View>
                        <DynamicText footnote greyColor numberOfLines={1}>
                            { t( item.Label )  }
                        </DynamicText>
                    </TouchableOpacity>
                    
                )}
            />
        )
    }

    const renderIconService = ( ) => {

        return (
            <FlatList 
                data={ menu }
                keyExtractor={ (menu) => menu.ID.toString() }
                numColumns={ 3 }
                renderItem={ ({ item }) => (
                    <>
                    { item.Link !== '?' &&
                        <TouchableOpacity
                            style={styles.itemService}
                            onPress={( ) => calculateParamsServices(item) }
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
                                { t( item.Label )  }
                            </DynamicText>
                        </TouchableOpacity>
                    }
                    </>                    
                )}
            />
        )
    }


    return (
        <>
            <TouchableOpacity  style={{ position: 'absolute', bottom: '95%', zIndex: 300, alignSelf: 'flex-end', right: '3%'  }} onPress={ () => navigation.navigate( 'ProfileScreen' ) }>
                <FontAwesomeIcon
                    icon={ faUserCircle }
                    color={ colors.primary }
                    size={ 20 }
                />
            </TouchableOpacity>
            <View 
                style={{flex: 1, marginBottom: 55}}
            >
                <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
                <Animated.Image
                    source={ require( '../../assets/images/common/trip-3.jpg' ) }
                    style={[
                    styles.imageBackground,
                    {
                        height: deltaY.interpolate({
                        inputRange: [
                            0,
                            scaleWithPixel(100),
                            scaleWithPixel(100),
                        ],
                        outputRange: [heightImageBanner, heightHeaders, 0],
                        }),
                    },
                    ]}
                />
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView
                        onScroll={Animated.event([
                            {
                            nativeEvent: {
                                contentOffset: {y: deltaY},
                            },
                            },
                        ])}
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
                                    <View
                                        style={{ ...styles.textInput,}}
                                    >
                                        <DynamicText  fontFamily={ semibold } body1 greyColor>
                                            { t( 'resBusquedaServicios' ) }
                                        </DynamicText>
                                    </View>
                                { renderIconService( ) }
                            </View>
                        </View>
                        {
                            menu.find( menu => menu.MenuName === 'viatics' ) &&
                            <View style={{paddingHorizontal: 20}}>
                                <View
                                    style={[
                                        styles.searchForm,
                                        {
                                        marginTop: 30,
                                        backgroundColor: colors.background,
                                        borderColor: colors.border,
                                        shadowColor: colors.border,
                                        },
                                    ]}>
                                        <View
                                            style={{ ...styles.textInput, height: 40 }}
                                        >
                                            <DynamicText  fontFamily={ semibold } body1 greyColor>
                                                { t( 'resViaticosLegalizacionGastos' ) }
                                            </DynamicText>
                                        </View>
                                    { renderViatics() }
                                </View>
                            </View>
                            
                        } 
                        <View>
                            <DynamicText title3 semibold style={styles.titleView}>
                                { t( 'resNoticias' ) }
                            </DynamicText>
                            <FlatList
                            contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={PromotionData}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({item, index}) => (
                                <Card
                                    style={[styles.promotionItem, {marginLeft: 15}]}
                                    image={item.image}
                                    onPress={() => Linking.openURL( 'https://ideas.kontroltravel.com' )}
                                >
                                    <DynamicText subhead whiteColor>
                                        {item.title1}
                                    </DynamicText>
                                    <DynamicText title2 whiteColor semibold>
                                        {item.title2}
                                    </DynamicText>
                                    <View style={styles.contentCartPromotion}>
                                        {/* <Button
                                        style={styles.btnPromotion}
                                        onPress={() => {
                                            navigation.navigate('PreviewBooking');
                                        }}> */}
                                        <DynamicText body2 semibold whiteColor>
                                            { item.subtitle }
                                        </DynamicText>
                                    </View>
                                </Card>
                            )}
                            />
                        </View>                
                    </ScrollView>
                    <TouchableOpacity 
                        style={{position: 'absolute', bottom: 10, right: 10, alignSelf: 'flex-end', backgroundColor: whiteColor, borderRadius: 100 }}
                        onPress={ () => Linking.openURL('whatsapp://send?text=Quiero conocer sus servicios&phone=573133869820')
                            .then((data) => {
                                console.log('WhatsApp Opened');
                            }).catch(() => {
                                Toast.show({
                                    text1: 'Información',
                                    text2: 'Asegurate de tener instalado whatsapp para hablar con un asesor',
                                    visibilityTime: 2000,
                                    type: 'info'
                                });
                            }) }
                    >
                        <Icon
                            name='logo-whatsapp'
                            color={ colors.primary }
                            size={ 50 }
                        />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
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
        height: 30,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      },
})