import React, { useContext, useEffect, useState } from 'react'
import { ImageBackground, View, StyleSheet, TouchableOpacity } from 'react-native';
import { HotelOfflineRequest } from '../../../model/interfaces/hotel/HotelOfflineRequest'
import * as Animatable from 'react-native-animatable';
import { DynamicText } from '../../../components/common/DynamicText';
import { useFont } from '../../../hooks/common/useFont';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCalendar, faMapMarkedAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../../contexts/theme/ThemeContext';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';
import { commonStyles } from '../../../styles/commonStyles';
import NumberFormat from 'react-number-format';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { corporateApi } from '../../../api/corporateApi';
import { GetHotelOfflineEntityRQ } from '../../../model/classes/corporate/GetHotelOfflineEntityRQ';
import { GetHotelOfflineEntityRS } from '../../../model/classes/corporate/GetHotelOfflineEntityRS';


interface Props {
    hotel: HotelOfflineRequest[]
}

export const ReviewHotelScreen = ({ hotel }:Props ) => {
    const { t } = useTranslation();
    const { getHotelOffline } = corporateApi()
    const { theme: { colors, whiteColor, buttonText, grayColor, lightDark, accent} } = useContext( ThemeContext );
    const { semibold, bold } = useFont();
    const [modalInfo, setModalInfo] = useState(false);
    const [hotelOfflineInfo, setHotelOfflineInfo] = useState( new GetHotelOfflineEntityRS );
    const total: number[] = [];

    /* if ( hotel.length > 0 ) {
        hotel.forEach( h => {
            total.push
        } )
    } */


    useEffect(() => {

        const request = new GetHotelOfflineEntityRQ();
        request.HotelId = hotel[0].hotel.ID.toString();
        getHotelOffline( request )
            .then(( response ) => {
                setHotelOfflineInfo( response );
            })
    }, [])

    const calculateDates = ( item: HotelOfflineRequest ) => {
        let dateCheckin = new Date( item.checkIn );
        let dateCheckout = new Date( item.checkOut );
        if ( dateCheckin.getUTCHours() === 0 ) {
            dateCheckin.setHours( dateCheckin.getUTCHours() + 15 );
        }
        if ( dateCheckout.getUTCHours() === 0 ) {
            dateCheckout.setHours( dateCheckout.getUTCHours() + 11 );
        }
        
        return { checkin: dateCheckin, checkout: dateCheckout };
    }

    const showInfoHotel = () => {
        setModalInfo( !modalInfo );
    }
    
    return (
        <View style={[ commonStyles.reviewContainer, { backgroundColor: accent }]}>
            <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}> { t( 'resHotel' ) } </DynamicText>
            {
                hotel?.map( ( item, index ) => {
                    return (
                        <Animatable.View 
                            key={ index }
                            animation='fadeIn'
                            style={{ alignItems: 'center' }}
                        >
                            <View style={{ width: '97%', alignSelf: 'center' }}>
                                <ImageBackground 
                                    style={{ 
                                        width: '100%', 
                                        height: 180,  
                                        justifyContent: 'center'
                                    }} 
                                    source={ require( '../../../../assets/images/common/room-5.jpg' ) }
                                    imageStyle={{ borderRadius: 10 }}
                                >          
                                    <TouchableOpacity
                                        style={{ zIndex: 100 }}
                                        onPress={ () => setModalInfo( true ) }
                                    >
                                        <FontAwesomeIcon 
                                            style={{ alignSelf: 'flex-end', marginHorizontal: 10 }}
                                            icon={ faInfoCircle }
                                            size={ 20 }
                                            color={ whiteColor }
                                        />
                                    </TouchableOpacity>                          
                                    <DynamicText fontFamily={ semibold } style={[styles.imageLabel, { color: whiteColor, fontSize: 25 } ]}>{ item.hotel.Name }</DynamicText>
                                    <DynamicText style={[styles.imageLabel, { color: whiteColor, fontSize: 15 } ]}>{ item.location.name }</DynamicText>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', top: '5%',  marginHorizontal: 10}}>
                                        {
                                            item.stars.map(() => {
                                                return (
                                                    <FontAwesomeIcon 
                                                        icon={ faStar }
                                                        size={ 15 }
                                                        color={ colors.primary }
                                                    />
                                                )
                                            })
                                        }
                                    </View>                                   
                                </ImageBackground> 
                            </View>
                            
                            <View style={{ width: '90%', marginTop: 10 }}> 
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>  
                                    <FontAwesomeIcon 
                                        icon={ faCalendar }
                                        size={ 30 }
                                        color={ colors.primary }
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                        <DynamicText fontFamily={ semibold } style={{ ...styles.hotelLabel, color: colors.primary }}> Checkin:  </DynamicText>
                                            <DynamicText style={ styles.hotelLabel }>{ Moment( calculateDates( item ).checkin ).format( 'llll' ) }</DynamicText>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <DynamicText fontFamily={ semibold } style={{ ...styles.hotelLabel, color: colors.primary }}> Checkout:  </DynamicText>
                                            <DynamicText style={ styles.hotelLabel }>{ Moment( calculateDates( item ).checkout ).format( 'llll' ) }</DynamicText>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                        <DynamicText fontFamily={ semibold } style={{ ...styles.hotelLabel, color: colors.primary }}>{ `${ t( 'resNumeroDias' ) }: ` }</DynamicText>
                                            <DynamicText style={ styles.hotelLabel }>{ item.days }</DynamicText>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <FontAwesomeIcon
                                        icon={ faMapMarkedAlt } 
                                        size={ 30 }
                                        color={ colors.primary }
                                    />
                                    <View style={{ marginLeft: 15, marginTop: 5 }}>
                                        <DynamicText>{ item.hotel.Address }</DynamicText>
                                    </View>      
                                </View>
                                <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                                    <DynamicText fontFamily={ semibold } style={{ fontSize: 18, color: colors.primary }}>{ `${ t( 'resSubtotal' ) }: ` }</DynamicText>
                                    <NumberFormat value={ ( item.hotel.Fare * item.days ) } displayType='text' thousandSeparator={ true }  prefix={ ` ${ item.currency } ` }
                                        renderText={ valueRender => (
                                            <DynamicText fontFamily={ semibold } style={{ fontSize: 18, color: lightDark }}>{ valueRender }</DynamicText>
                                        )}
                                    />
                                    
                                </View>
                            </View>
                           
                        </Animatable.View>
                    )
                } )
            }

            <Modal
                key={ 'hotelInfo' }
                swipeDirection="right"
                onSwipeComplete={ showInfoHotel }
                style={{ alignItems: 'center'}} 
                isVisible={ modalInfo }
            >
                <View style={{ borderRadius: 10, width: 380, height: 213, backgroundColor: colors.background}}>
                    <View style={ commonStyles.rightButtonContainer }>
                        <Icon
                            onPress={ showInfoHotel }
                            name="close-circle"
                            color={ colors.primary }
                            size={ 30}
                        />
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <DynamicText style={{ 
                            ...commonStyles.title,
                            fontSize: 20,
                            color: colors.primary,
                            marginTop: 0,
                            marginBottom: 10
                        }}>
                            { hotelOfflineInfo?.HotelInfo?.City }
                        </DynamicText>
                    </View>
                    <View style={{ maxWidth: '97%', marginHorizontal: 10, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <DynamicText fontFamily={ bold} style={{ color: colors.primary }}> { `${ t( 'resNombre' ) }: ` } </DynamicText>
                            <DynamicText> { hotelOfflineInfo?.HotelInfo?.Name } </DynamicText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <DynamicText fontFamily={ bold} style={{ color: colors.primary }}> { `${ t( 'resDireccion' ) }: ` } </DynamicText>
                            <DynamicText> { hotelOfflineInfo?.HotelInfo?.Address } </DynamicText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                        <DynamicText fontFamily={ bold} style={{ color: colors.primary }}> { `${ t( 'resTelefonoContacto' ) }: ` } </DynamicText>
                            <DynamicText> { hotelOfflineInfo?.HotelInfo?.Phone } </DynamicText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <DynamicText fontFamily={ bold} style={{ color: colors.primary }}> { `${ t( 'resZona' ) }: ` } </DynamicText>
                            <DynamicText> { hotelOfflineInfo?.HotelInfo?.Zone } </DynamicText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <DynamicText fontFamily={ bold} style={{ color: colors.primary }}> { `${ t( 'resTipoHabitacion' ) }: ` } </DynamicText>
                            <DynamicText> { hotelOfflineInfo?.HotelInfo?.RoomType } </DynamicText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <DynamicText fontFamily={ bold} style={{ color: colors.primary }}> { `${ t( 'resTipoAlimentacion' ) }: ` } </DynamicText>
                            <DynamicText> { hotelOfflineInfo?.HotelInfo?.FeedingType } </DynamicText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <DynamicText fontFamily={ bold} style={{ color: colors.primary }}> { `${ t( 'resPolitica' ) }` } </DynamicText>
                            <DynamicText> { hotelOfflineInfo?.HotelInfo?.Policy } </DynamicText>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}


const styles = StyleSheet.create({
    hotelLabel: {
        fontSize: 15
    },
    imageLabel: {
        paddingHorizontal: 10, 
    }

})