import React, { useContext } from 'react'
import { ImageBackground, Text, View, Alert, StyleSheet } from 'react-native';
import { HotelOfflineRequest } from '../../../model/interfaces/hotel/HotelOfflineRequest'
import * as Animatable from 'react-native-animatable';
import { DynamicText } from '../../../components/common/DynamicText';
import { useFont } from '../../../hooks/common/useFont';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faCalendar, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../../contexts/theme/ThemeContext';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';
import { commonStyles } from '../../../styles/commonStyles';


interface Props {
    hotel: HotelOfflineRequest[]
}

export const ReviewHotelScreen = ({ hotel }:Props ) => {
    const { t } = useTranslation();
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, accent} } = useContext( ThemeContext );
    const { semibold, bold } = useFont();
    const total: number[] = [];

    /* if ( hotel.length > 0 ) {
        hotel.forEach( h => {
            total.push
        } )
    } */

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
                                    <DynamicText fontFamily={ semibold } style={[styles.imageLabel, { color: whiteColor, fontSize: 25 } ]}>{ item.hotel.Name }</DynamicText>
                                    <DynamicText style={[styles.imageLabel, { color: whiteColor, fontSize: 15 } ]}>{ item.location.name }</DynamicText>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', top: '10%',  marginHorizontal: 10}}>
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
                                            <DynamicText style={ styles.hotelLabel }> Checkin:  </DynamicText>
                                            <DynamicText style={ styles.hotelLabel }>{ Moment( item.checkIn ).format( 'llll' ) }</DynamicText>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <DynamicText style={ styles.hotelLabel }> Checkout:  </DynamicText>
                                            <DynamicText style={ styles.hotelLabel }>{ Moment( item.checkOut ).format( 'llll' ) }</DynamicText>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <FontAwesomeIcon
                                        icon={ faMapMarkedAlt } 
                                        size={ 30 }
                                        color={ colors.primary }
                                    />
                                    <View style={{ marginLeft: 15, marginTop: 5 }}>
                                        <DynamicText>{ item.hotel.Address }</DynamicText>
                                    </View>
                                    
                                </View>
                            </View>
                           
                        </Animatable.View>
                    )
                } )
            }
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