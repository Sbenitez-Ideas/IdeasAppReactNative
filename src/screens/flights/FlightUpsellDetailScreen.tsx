import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext } from 'react'
import { DynamicText } from '../../components/common/DynamicText';
import { RootStackParams } from '../../navigator/Navigator'
import { Header } from '../../components/common/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { StyleSheet, View } from 'react-native';
import { calculateColor } from '../../helpers/flights/calculateColor';
import { useFont } from '../../hooks/common/useFont';
import NumberFormat from 'react-number-format';
import { upsell } from '../../helpers/common/upsell';
import { Option } from '../../model/classes/flights/pricing/Option';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

interface Props extends StackScreenProps<RootStackParams, 'FlightUpsellDetailScreen'>{};

export const FlightUpsellDetailScreen = ( { navigation, route }: Props ) => {
    const { t } = useTranslation();
    const { theme:{ colors, fieldColor, grayColor, whiteColor, backgroundDarken, secondary, lightDark, cancelColor } } = useContext( ThemeContext );
    const { bold, semibold } = useFont();
    const options = route?.params?.options;
    const fareFamily = route?.params?.fareFamily;
    const fares = route?.params?.faresTotal;



    const getItems = ( option: Option ) => {
        return (
            <>
                <DynamicText style={{ fontSize: 15 }}>{`${option.Name} `}</DynamicText>
                <DynamicText>{ option.AdditionalInfo }</DynamicText>
            </>
        )
    }

    return (
        <>
            <Header 
                title={ t( 'resTarifaHorario' ) }
                renderRight={ () => (
                    <FontAwesomeIcon
                        icon={ faTimes } 
                        size={ 20 }
                        color={ colors.primary }
                    />
                ) }

                onPressRight={ ()  => navigation.goBack() }
            />

            <ScrollView style={{ flex: 1, backgroundColor: fieldColor, marginBottom: 50 }}>

                <DynamicText fontFamily={ semibold } style={{ margin: 10, fontSize: 25, color: backgroundDarken }}>{ t( 'resDetalleTarifa' ) }</DynamicText>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ margin: 10, width: 20, borderRightWidth: 10, borderRightColor: calculateColor( fareFamily?.CommercialNameFamily ), height: 50, borderRadius: 5, alignSelf: 'flex-start' }}>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <DynamicText fontFamily={ bold } style={[ styles.title, { color: lightDark, borderBottomColor: grayColor }]}>{ fareFamily?.CommercialNameFamily }</DynamicText>
                        <NumberFormat value={ fares } displayType={ 'text' } thousandSeparator={ true } prefix={ '$' } 
                            renderText={
                                value => <DynamicText fontFamily={ semibold } style={{ color: lightDark, marginTop: 25, marginLeft: 30, fontSize: 20 }}>{ value }</DynamicText>
                            } 
                        />
                    </View>
                </View>
                { upsell( options )?.length > 0 &&
                    <View>
                        <View style={{ margin: 20 }}>
                            <DynamicText fontFamily={ semibold } headline style={{ color: backgroundDarken }}>{ `${ t( 'resEstaTarifaIncluye' ) }: ` }</DynamicText>
                        </View>
                        <View style={{ backgroundColor: whiteColor, padding: 10, borderRadius: 10, width: '95%', alignSelf: 'center' }}>
                            { upsell( options ).map(( item, index ) => {
                                return (
                                    <View 
                                        key={ index }
                                    >
                                        <View
                                            style={{ flexDirection:'row',}}
                                        >
                                            <FontAwesomeIcon 
                                                icon={ faCheck }
                                                size={ 20 }
                                                color={ '#ACD1AF' }
                                                style={ styles.icon }
                                            />
                                            <View style={styles.items}>
                                                { getItems( item ) }    
                                            </View>
                                        </View>
                                    </View>
                                )
                            })

                            }
                        </View>
                    </View>
                    
                }
                { upsell( options, 'CHARGE' )?.length > 0 &&
                    <View>
                        <View style={{ margin: 20 }}>
                            <DynamicText fontFamily={ semibold } headline style={{ color: backgroundDarken }}>{ `${ t( 'resPodrasComprar' ) }: ` }</DynamicText>
                        </View>
                        <View style={{ backgroundColor: whiteColor, padding: 10, borderRadius: 10, width: '95%', alignSelf: 'center' }}>
                            { upsell(options, 'CHARGE').map(( item, index ) => {
                                return (
                                    <View 
                                        key={ index }
                                    >
                                        <View
                                            style={{ flexDirection:'row',}}
                                        >
                                            <FontAwesomeIcon 
                                                icon={ faShoppingCart }
                                                size={ 20 }
                                                color={ backgroundDarken }
                                                style={ styles.icon }
                                            />
                                            <View style={styles.items}>
                                                { getItems( item ) }
                                            </View>
                                        </View>
                                    </View>
                                )
                            })

                            }
                        </View>
                    </View>
                }
                { upsell( options, 'NO' )?.length > 0 &&
                    <View>
                        <View style={{ margin: 20 }}>
                            <DynamicText fontFamily={ semibold } headline style={{ color: backgroundDarken }}>{ `${ t( 'resNoPermite' ) }: ` }</DynamicText>
                        </View>
                        <View style={{ backgroundColor: whiteColor, padding: 10, borderRadius: 10, width: '95%', alignSelf: 'center' }}>
                            { upsell(options, 'NO').map(( item, index ) => {
                                return (
                                    <View 
                                        key={ index }
                                    >
                                        <View
                                            style={{ flexDirection:'row',}}
                                        >
                                            <FontAwesomeIcon 
                                                icon={ faTimes }
                                                size={ 20 }
                                                color={ cancelColor }
                                                style={ styles.icon }
                                            />
                                            <View style={styles.items}>
                                                { getItems( item ) }
                                            </View>
                                        </View>
                                    </View>
                                )
                            })

                            }
                        </View>
                    </View>
                }
            </ScrollView>
            
        </>
    )
}



const styles = StyleSheet.create({
    title: {
        marginLeft: 10, 
        marginTop: 20, 
        fontSize: 20, 
        borderBottomWidth: .7, 
        width: '60%', 
    },
    items: {
        justifyContent: 'space-between', 
        flexDirection: 'row',
        margin: 5 
    },
    icon: {
        margin: 5
    }
})