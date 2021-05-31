import React, { useContext, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { DynamicText } from '../../../components/common/DynamicText';
import { useFont } from '../../../hooks/common/useFont';
import { ThemeContext } from '../../../contexts/theme/ThemeContext';
import { commonStyles } from '../../../styles/commonStyles';
import Moment from 'moment';
import { getHours } from '../../../helpers/common/getHours';
import { RetrieveRS } from '../../../model/classes/flights/envelopes/RetrieveRS';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';


interface Props {
    retrieve: RetrieveRS
}

export const ReviewFlightScreen = ( { retrieve }: Props ) => {
    const { semibold, bold } = useFont();
    const { theme: { colors, whiteColor, accent, fieldColor} } = useContext( ThemeContext );
    const { t } = useTranslation();
    
    return (

        <View style={{  backgroundColor: accent, borderRadius: 10 }}>
            <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ t( 'resVuelo' ) }</DynamicText>        
            { 
                retrieve.Segments.map( ( segment, segmentId ) => {
                    return (
                        <Animatable.View animation="fadeIn" style={{ marginBottom: 10 }}>
                            <View style={{ backgroundColor: colors.primary, justifyContent: 'space-between', flexDirection: 'row', height: 35, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                                    <DynamicText fontFamily={ semibold }  style={{ padding: 8, color: whiteColor,}}> { ( segmentId === 0 ? t( 'resIda' ).toLocaleUpperCase() : t('resRegreso').toLocaleUpperCase() ) } </DynamicText>
                                    <DynamicText fontFamily={ semibold } style={{ padding: 8, color: whiteColor }}> { ( segmentId === 0 ? Moment( segment.ArrivalDateTime ).format( 'ddd DD MMM YYYY' )  : Moment( segment.DepartureDateTime ).format( 'ddd DD MMM YYYY' ) ) } </DynamicText>
                            </View>
                            <View key={ segmentId } style={{...styles.flightContainer, backgroundColor: accent }}>
                                {/* <DynamicText>Trayecto { segmentId + 1 }</DynamicText> */}
                                {
                                    segment.Flights.map( ( flight, flightId ) => {
                                        return (
                                            <View key={ flightId }>
                                                <View style={[ commonStyles.basicCard, { margin: 10 } ]}>
                                                    {/* <View style={{ alignSelf: 'flex-end', backgroundColor: colors.primary, ...styles.scales,}}>
                                                        <DynamicText fontFamily={ semibold } style={{ color: whiteColor }}> { segment.Flights.length === 1 ? 'Vuelo Directo' : segment.Flights.length + ' Escalas' }  </DynamicText>
                                                    </View> */}
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                                <DynamicText>AVIANCA</DynamicText>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <DynamicText>{ flight.DepartureStation }</DynamicText>
                                                        <DynamicText> { Moment(flight.DepartureDateTime).format( 'LT' ) } </DynamicText>
                                                    </View>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <DynamicText> { flight.ArrivalStation } </DynamicText>
                                                        <DynamicText> { Moment(flight.ArrivalDateTime).format( 'LT' ) } </DynamicText>
                                                    </View>
                                                    <DynamicText> { flight.FareOption.BaggageAllowance } </DynamicText>
                                                </View>
                                                <View style={{ marginTop: 15, backgroundColor: fieldColor, width: '95%', alignSelf: 'center', borderRadius: 10, padding: 10  }} key={ flightId }>
                                                    <DynamicText  style={{ marginTop: 10, alignSelf: 'center', fontSize: 20, color: colors.primary}}> { `${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.DepartureStation )?.CityName.toLocaleUpperCase() } (${flight.DepartureStation}) A ${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.CityName.toLocaleUpperCase()} (${flight.ArrivalStation})` } </DynamicText>
                                                    <View style={{ flexDirection: 'row', padding: 10 }}>
                                                        <Animatable.Image 
                                                            animation="bounceIn"
                                                            duration={ 1500 }
                                                            source={{ uri: `https://ltn.xnet.travel/Images/Airlines/${segment.ValidatingCarrier}.png` }}
                                                            style={styles.airlineImage}
                                                            resizeMode="stretch"
                                                        />
                                                        <DynamicText fontFamily={ semibold } style={{ marginTop: 5 }}> { /* segment.ValidatingCarrier */ 'AVIANCA' } </DynamicText>                                        
                                                    </View>
                                                    <View>
                                                        <DynamicText>{ Moment(flight.DepartureDateTime).format( 'llll' ) }</DynamicText>
                                                        <DynamicText>{ flight.DepartureStation } {Moment(flight.DepartureDateTime).format( 'LT' )}</DynamicText>
                                                        <DynamicText>{ `${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.DepartureStation )?.CityName }, ${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.DepartureStation )?.Name }` }</DynamicText>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Icon 
                                                            name='chevron-down-outline'
                                                            size={ 50 }
                                                        />
                                                        <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                                            <Icon 
                                                                
                                                                name='time-outline'
                                                                size={ 20 }
                                                            />
                                                            <DynamicText> {  getHours(  flight.FlightTimeMinutes ) } </DynamicText>
                                                        </View>
                                                        
                                                    </View>
                                                    
                                                    <View>
                                                        <DynamicText>{ Moment(flight.ArrivalDateTime).format( 'llll' ) }</DynamicText>
                                                        <DynamicText>{ flight.ArrivalStation } {Moment(flight.ArrivalDateTime).format( 'LT' )}</DynamicText>
                                                        <DynamicText>{ `${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.CityName }, ${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.Name }` }</DynamicText>
                                                    </View>
                                                    
                                                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                                        <DynamicText>{ flight.FlightTimeMinutes }</DynamicText>
                                                        <DynamicText>{ flight.FlightNumber }</DynamicText>
                                                        <DynamicText>{ flight.ClassOfServices[0].Class }</DynamicText>
                                                    </View> */}
                                                </View>
                                            </View>
                                        )
                                    } )
                                }
                            </View>
                        </Animatable.View>

                    )
                    
                } )
            
            

            }
        </View>
    )
}


const styles = StyleSheet.create({
    airlineImage: {
        width: 30,
        height: 20
    },
    scales: {
        width: 100,
        height: 25,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flightContainer: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    }
})
