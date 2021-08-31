import React, { useContext, useRef, useState } from 'react'
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
import NumberFormat from 'react-number-format';
import { faChevronCircleUp, faChevronCircleDown, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { captureRef } from "react-native-view-shot";
import Share from 'react-native-share';
import { Image } from 'react-native';
import { Segment } from '../../../model/classes/flights/business-objects/Segment';


interface Props {
    retrieve: RetrieveRS,
    showAdditionalFields: boolean
}

export const ReviewFlightScreen = ( { retrieve, showAdditionalFields }: Props ) => {

    const { semibold, bold } = useFont();
    const { theme: { colors, whiteColor, accent, fieldColor, grayColor, lightDark } } = useContext( ThemeContext );
    const { t } = useTranslation();
    const [showFares, setShowFares] = useState(false);
    const [totalFlightTime, setTotalFlightTime] = useState(0);
    const refFlights = useRef(null);


    const onCapture = () => {
        captureRef(refFlights, {
            format: "jpg",
            quality: 0.9,
            result: 'data-uri'
          }).then(
            uri => Share.open({ title: 'itinerario', url: uri }),
            error => console.log("snapshot failed", error));
    }

    const calculateHours = ( segment: Segment ) => {
        let hours = 0;
        segment.Flights.forEach(( flight, index ) => {
            hours += flight.FlightTimeMinutes;
        })

        return (
            <DynamicText fontFamily={ semibold } style={{ fontSize: 12, alignSelf: 'center'  }}> { getHours( hours ) } </DynamicText>
        )
    }

    return (

        <View ref={ refFlights } style={{  backgroundColor: accent, borderRadius: 10, }}>
            { 
                retrieve.Segments.map( ( segment, segmentId ) => {
                    return (
                        <Animatable.View key={ segmentId } animation="fadeIn" style={{ marginBottom: 10 }}>
                            <View style={{ backgroundColor: colors.primary, justifyContent: 'space-between', flexDirection: 'row', height: 35, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                                    <DynamicText fontFamily={ semibold }  style={{ padding: 8, color: whiteColor,}}> { ( segmentId === 0 ? t( 'resIda' ).toLocaleUpperCase() : t('resRegreso').toLocaleUpperCase() ) } </DynamicText>
                                    <DynamicText fontFamily={ semibold } style={{ padding: 8, color: whiteColor }}> { ( segmentId === 0 ? Moment( segment.ArrivalDateTime ).format( 'ddd DD MMM YYYY' )  : Moment( segment.DepartureDateTime ).format( 'ddd DD MMM YYYY' ) ) } </DynamicText>
                            </View>
                            {
                                segmentId <=0 &&

                                <TouchableOpacity style={{ alignSelf: 'flex-end', flexDirection: 'row', margin: 10 }}  onPress={ () => onCapture() }>
                                    <FontAwesomeIcon 
                                        icon={ faShareAlt }
                                        size={ 15 }
                                        color={ grayColor }
                                    />
                                    <DynamicText fontFamily={ semibold } style={{ fontSize: 12, color: grayColor  }}>{ t( 'resExportar' )}</DynamicText>
                                </TouchableOpacity>
                            }
                            {
                                <>
                                    <DynamicText fontFamily={ semibold } style={{ fontSize: 12, alignSelf: 'center'  }}>{ t( 'resTotalHorasVuelos' ) }</DynamicText>
                                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                        <Icon        
                                            name='time-outline'
                                            size={ 20 }
                                        />
                                        { calculateHours( segment ) }
                                    </View>
                                </>
                            }
                            <View key={ segmentId } style={{...styles.flightContainer, backgroundColor: accent }}>
                                {
                                    segment.Flights.map( ( flight, flightId ) => {
                                        return (
                                            <View key={ flightId }>
                                                <View style={[ commonStyles.basicCard ]}>
                                                    {/* <View style={{ alignSelf: 'flex-end', backgroundColor: colors.primary, ...styles.scales,}}>
                                                        <DynamicText fontFamily={ semibold } style={{ color: whiteColor }}> { segment.Flights.length === 1 ? 'Vuelo Directo' : segment.Flights.length + ' Escalas' }  </DynamicText>
                                                    </View> */}
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 10 }}>
                                                    <DynamicText fontFamily={ semibold }>{ flight.CarrierCode  === '4C' ? 'LA' : segment.ValidatingCarrier }</DynamicText>
                                                    <DynamicText fontFamily={ semibold }>{  }</DynamicText>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <DynamicText fontFamily={ semibold }>{ flight.DepartureStation }</DynamicText>
                                                        <DynamicText> { Moment(flight.DepartureDateTime).format( 'LT' ) } </DynamicText>
                                                    </View>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <DynamicText fontFamily={ semibold }> { flight.ArrivalStation } </DynamicText>
                                                        <DynamicText> { Moment(flight.ArrivalDateTime).format( 'LT' ) } </DynamicText>
                                                    </View>
                                                    <DynamicText> { flight.FareOption.BaggageAllowance } </DynamicText>
                                                </View>
                                                <View style={{ marginTop: 15, backgroundColor: fieldColor, width: '95%', alignSelf: 'center', borderRadius: 10, padding: 10  }} key={ flightId }>
                                                    <DynamicText  style={{ marginTop: 10, alignSelf: 'center', fontSize: 20, color: colors.primary, textAlign: 'center'}}> { `${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.DepartureStation )?.CityName.toLocaleUpperCase() } (${flight.DepartureStation}) ${ t( 'resA' ).toLocaleUpperCase() } ${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.CityName.toLocaleUpperCase()} (${flight.ArrivalStation})` } </DynamicText>
                                                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10 }}>
                                                        <Animatable.Image 
                                                            animation="bounceIn"
                                                            duration={ 1500 }
                                                            source={{ uri: `https://ltn.xnet.travel/Images/Airlines/${segment.ValidatingCarrier}.png` }}
                                                            style={styles.airlineImage}
                                                            resizeMode="stretch"
                                                        />
                                                        <View>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <DynamicText fontFamily={ semibold } style={{ marginTop: 5 }}>{ flight.FlightNumber }</DynamicText>
                                                                <DynamicText fontFamily={ semibold } style={{ marginTop: 5 }}> { segment.ValidatingCarrier === '4C' ? 'LA' : segment.ValidatingCarrier } </DynamicText>
                                                            </View>   
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <DynamicText style={{ marginTop: 5 }}>{  `${ t( 'resTipoAvion' ) }: ${ flight.AircraftType }`.toLocaleUpperCase() }</DynamicText>       
                                                                <DynamicText style={{ marginTop: 5 }}>{ ` | ${ t( 'resClase' ) }: ${ flight.FareOption.Class }`.toLocaleUpperCase() }</DynamicText>
                                                            </View>
                                                        </View>
                                                        
                                                        
                                                    </View>
                                                    <View style={{ padding: 10 }}>
                                                        <DynamicText>{ Moment(flight.DepartureDateTime).format( 'ddd DD MMM YYYY, h:mm a' ) }</DynamicText>
                                                        <DynamicText>{ flight.DepartureStation } {Moment(flight.DepartureDateTime).format( 'LT' )}</DynamicText>
                                                        <DynamicText>{ `${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.DepartureStation )?.CityName }, ${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.DepartureStation )?.Name }` }</DynamicText>
                                                    </View>
                                                    <View style={{ flexDirection: 'row',paddingLeft: 10 }}>
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
                                                    
                                                    <View style={{ paddingLeft: 10 }}>
                                                        <DynamicText>{ Moment(flight.ArrivalDateTime).format( 'ddd DD MMM YYYY, h:mm a' ) }</DynamicText>
                                                        <DynamicText>{ flight.ArrivalStation } {Moment(flight.ArrivalDateTime).format( 'LT' )}</DynamicText>
                                                        <DynamicText>{ `${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.CityName }, ${ retrieve.Airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.Name }` }</DynamicText>
                                                    </View>
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
            { showAdditionalFields &&
                <View>
                    <TouchableOpacity 
                        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                        onPress={ () =>  setShowFares( !showFares ) }
                    >
                        <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ t( 'resTarifación' ) }</DynamicText> 
                        <FontAwesomeIcon
                            style={{ marginHorizontal: 10, marginVertical: 5  }}
                            icon={ ( !showFares ) ? faChevronCircleUp : faChevronCircleDown }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    </TouchableOpacity>
                    {   showFares &&
                        <View style={{ alignSelf:'center', marginHorizontal: 20, marginVertical: 10, maxWidth: '100%' }}>
                            {
                                retrieve.Fares.map(( fare, index ) => {
                                    return (
                                        <View key={ index } style={{ width: '95%' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.primary, }}>
                                                <View style={{ flexDirection: 'row', width: '40%', borderRightWidth: 1, borderRightColor: colors.primary, paddingBottom: 3, paddingTop: 3 }}>
                                                    <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: colors.primary }}>{ `${ t( 'resTarifa' ) }: ` }</DynamicText>
                                                    <NumberFormat value={ fare.FareAmount } displayType='text' thousandSeparator={ true } prefix={ ` ${fare.ForeignCurrency} ` }
                                                        renderText={ valueRender => (
                                                            <DynamicText style={{ fontSize: 15, color: colors.text }}>{ valueRender }</DynamicText>
                                                        )}
                                                    />
                                                </View>
                                                <View style={{ flexDirection: 'row',  paddingBottom: 3, paddingTop: 3 }}>
                                                    <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: colors.primary }}>{ `${ t( 'resTasasCargo' ) }: ` }</DynamicText>
                                                    <NumberFormat value={ (fare.FeeAmount + fare.TaxesAmount ) } displayType='text' thousandSeparator={ true }  prefix={ ` ${fare.ForeignCurrency} ` }
                                                        renderText={ valueRender => (
                                                            <DynamicText style={{ fontSize: 15, color: colors.text }}>{ valueRender }</DynamicText>
                                                        )}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 3, paddingTop: 3 }}>
                                                <DynamicText fontFamily={ semibold } style={{ fontSize: 18, color: colors.primary }}>{ `${ t( 'resTotalEstimado' ) }: ` }</DynamicText>
                                                <NumberFormat value={ (fare.FeeAmount + fare.TaxesAmount + fare.FareAmount ) } displayType='text' thousandSeparator={ true }  prefix={ ` ${fare.ForeignCurrency} ` }
                                                    renderText={ valueRender => (
                                                        <DynamicText fontFamily={ semibold } style={{ fontSize: 18, color: lightDark }}>{ valueRender }</DynamicText>
                                                    )}
                                                />
                                            </View>
                                        </View>
                                    )
                                })
                            }                
                        </View>
                    }
                </View>
            }
            
        </View>
    )
}


const styles = StyleSheet.create({
    airlineImage: {
        width: 35,
        height: 35 ,
        marginTop: 5
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
