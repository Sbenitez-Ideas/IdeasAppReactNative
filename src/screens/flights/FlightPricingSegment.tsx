import React, { useContext } from 'react'
import { Segment } from '../../model/classes/flights/business-objects/Segment'
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import { StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from '../../components/common/DynamicText';
import Moment from 'moment';
import { useFont } from '../../hooks/common/useFont';
import { transformAirports } from '../../helpers/common/transformAirports';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import { getHours } from '../../helpers/common/getHours';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { transformHours } from '../../helpers/common/transformHours';

interface Props  {
    segment: Segment,
    airports: Airport[],
    showRules: boolean,
    showRuleSegment?: ( data: { departure: string, arrival: string } ) => void
}

export const FlightPricingSegment = ( { segment, airports, showRules = true, showRuleSegment }: Props ) => {

    const { theme: { colors, grayColor, whiteColor, lightDark, grayDarken, lightGray } } = useContext( ThemeContext );
    const { bold, semibold } = useFont();
    const { t } = useTranslation();

    const displayRule = () => {
        if ( showRuleSegment ) {
            showRuleSegment({ departure: segment.DepartureStation, arrival: segment.ArrivalStation });
        }
    }
    const calculateDuration = () => {        
        let time: number = 0;
        segment.Flights.map(( flight, index ) => {
            time+= flight.FlightTimeMinutes;
            time+= flight.WaitingTime * 60;
        });    
        return parseInt(time.toString());
    }

    return (
        <View style={{ width: '80%', alignSelf: 'center', marginBottom: 10 }}>
            { segment.Flights.map(( flight, indexFlight ) => {
                return (
                    <Animatable.View  animation= "fadeIn"  key={ indexFlight }>
                        <Animatable.View style={{ borderWidth: .3, borderRadius: 10, padding: 10, backgroundColor: whiteColor, borderColor: grayColor }}
                            animation="fadeIn"
                        >
                            <View style={{ borderBottomWidth: .2, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Animatable.Image 
                                        animation="bounceIn"
                                        duration={ 1500 }
                                        source={{ uri: `https://ltn.xnet.travel/Images/Airlines/${flight.CarrierCode}.png` }}
                                        style={styles.airlineImage}
                                        resizeMode="stretch"
                                    />
                                    <DynamicText fontFamily={ bold } style={{ margin: 5, color: lightDark }}>{ flight.OperatedBy }</DynamicText>
                                </View>
                                <View style={{ margin: 5 }}>
                                    <DynamicText style={{ color: lightDark, fontSize: 10 }}>{ `${ t( 'resVuelo' ) } #${flight.FlightNumber}` }</DynamicText>
                                    <DynamicText style={{ color: lightDark, fontSize: 10 }}>{ `${ t( 'resTipoVuelo' ) } ${flight.AircraftType}` }</DynamicText>
                                    <DynamicText style={{ color: lightDark, fontSize: 10 }}>{ `${ t( 'resClase' ) } ${flight.FareOption.Class}` }</DynamicText>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ marginBottom: 10, alignItems: 'center' }}>
                                        <DynamicText>{ Moment( flight.DepartureDateTime ).format( 'ddd DD MMM' ) }</DynamicText>
                                        <DynamicText fontFamily={ bold } headline style={{ color: lightDark, fontSize: 20 }}>{ Moment( flight.DepartureDateTime ).format( 'LT' ) }</DynamicText>
                                    </View>
                                    <View style={{ marginBottom: 10, alignItems: 'center' }}>
                                        <DynamicText fontFamily={ semibold } style={{ color: grayDarken, fontSize: 17 }}>{  flight.DepartureStation }</DynamicText>
                                        <DynamicText style={{ color: grayDarken, fontSize: 15 }}>{ `${ airports.find( cityInfo => cityInfo.Code === flight.DepartureStation )?.CityName }` }</DynamicText>
                                    </View>

                                    <View style={{ maxWidth: 100, alignSelf: 'center', marginTop: 20 }}>
                                        <DynamicText style={{ color: grayDarken, fontSize: 13, alignSelf: 'center' }}>{ transformAirports( flight.DepartureStation, airports, 'airport' ) }</DynamicText>
                                    </View>
                                </View>
                                <View style={{ marginTop: 40, alignItems: 'center' }}>
                                    <FontAwesomeIcon 
                                        icon={ faClock }
                                        color={ colors.primary }
                                    />
                                    <DynamicText style={{ color: grayDarken }}>{ t( 'resDuracion' ) }</DynamicText>
                                    <DynamicText style={{ color: grayDarken }}>{ getHours( flight.FlightTimeMinutes ) }</DynamicText>

                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ marginBottom: 10, alignItems: 'center' }}>
                                        <DynamicText>{ Moment( flight.ArrivalDateTime ).format( 'ddd DD MMM' ) }</DynamicText>
                                        <DynamicText fontFamily={ bold } headline style={{ color: lightDark,fontSize: 20 }}>{ Moment( flight.ArrivalDateTime ).format( 'LT' ) }</DynamicText>
                                    </View>

                                    <View style={{ marginBottom: 10, alignItems: 'center' }}>
                                        <DynamicText fontFamily={ semibold } style={{ color: grayDarken, fontSize: 17 }}>{ flight.ArrivalStation }</DynamicText>
                                        <DynamicText style={{ color: grayDarken, fontSize: 15 }}>{ `${ airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.CityName }` }</DynamicText>
                                    </View>

                                    <View style={{ maxWidth: 100, alignSelf: 'center', marginTop: 20 }}>
                                        <DynamicText style={{ color: grayDarken, fontSize: 13, alignSelf: 'center' }}>{ transformAirports( flight.ArrivalStation, airports, 'airport' ) }</DynamicText>    
                                    </View>
                                </View>
                            </View>
                            <View style={{ borderTopWidth: .3, paddingTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
                                <DynamicText style={{ color: lightDark }}>{ `${ t( 'resCabina' ) }: ` }</DynamicText>
                                <DynamicText style={{ color: lightDark }}>{ flight.FareOption.Cabin }</DynamicText>
                            </View>
                        </Animatable.View>
                        
                        
                        { segment.Flights.length !== ( indexFlight + 1 ) &&
                            <>
                                <Animatable.View animation="fadeIn" style={{ alignItems: 'center' }}>
                                    <FontAwesomeIcon 
                                        icon={ faGripLinesVertical }
                                        size={ 15 }
                                        color={ grayDarken }
                                    />
                                </Animatable.View>
                                <Animatable.View animation="fadeIn" style={[ styles.waitingTimeContainer, { backgroundColor: lightGray }]}>
                                    <Icon 
                                        name={ 'time-outline' }
                                        size={ 15 }
                                        color={ lightDark }
                                    />
                                    <DynamicText>{ t( 'resEsperaDe' ) }</DynamicText>
                                    <DynamicText fontFamily={ semibold }>{ transformHours( flight.WaitingTime, false, true  ) }</DynamicText>
                                    <DynamicText>{ ` ${ t( 'resEn' ) } ${ airports.find( cityInfo => cityInfo.Code === flight.ArrivalStation )?.CityName } ` }</DynamicText>
                                    
                                </Animatable.View>
                                <Animatable.View animation="fadeIn" style={{ alignItems: 'center' }}>
                                    <FontAwesomeIcon 
                                        icon={ faGripLinesVertical }
                                        size={ 15 }
                                        color={ grayDarken }
                                    />
                                </Animatable.View>
                            </>
                        }
                    </Animatable.View>
                    
                )
            })}
            <Animatable.View animation="fadeIn" style={[ styles.waitingTimeContainer, { height: 30, backgroundColor: lightGray, marginTop: 10, marginBottom: 10 }]}>
                <DynamicText>{ `${ t( 'resDuracion' ) }: ` }</DynamicText>
                <DynamicText fontFamily={ semibold }>{ getHours(calculateDuration()) }</DynamicText>
                
            </Animatable.View>
            { showRules &&
                <Animatable.View
                    animation="fadeIn"
                    style={{ alignItems: 'center' }}
                >
                    <TouchableOpacity
                        onPress={ ()  => displayRule() }
                    >
                        <DynamicText style={{ borderBottomWidth: 1, borderBottomColor: colors.primary, color: colors.primary }}>{ t( 'resReglasTarifa' ) }</DynamicText>
                    </TouchableOpacity>
                </Animatable.View>
            }
            
        </View>
    )
}


const styles = StyleSheet.create({
    stopsText: {
        fontSize: 12
    },
    airlineImage: {
        width: 25,
        height: 25 ,
        marginLeft: 10,
        marginBottom: 10
    },
    waitingTimeContainer: {
        height: 50, 
        borderRadius: 10, 
        borderWidth: .5, 
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
})