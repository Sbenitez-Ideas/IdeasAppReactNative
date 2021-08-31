import React, { useContext } from 'react'
import { Image, View, TouchableOpacity, Switch } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import { Segment } from '../../model/classes/flights/business-objects/Segment';
import Moment from 'moment';
import { transformHours } from '../../helpers/common/transformHours';
import { useFont } from '../../hooks/common/useFont';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSuitcaseRolling } from '@fortawesome/free-solid-svg-icons';
import { FlightsAndAirports } from '../../model/interfaces/flights/FlightsAndAirports';
import { useTranslation } from 'react-i18next';


interface Props  {
    segment: Segment,
    journeyControl: number,
    recommendationControl: number,
    airports: Airport[],
    lastSegment?: boolean,
    showInfoSegments: ( data: { segment: Segment,  airports: Airport[] }, isScales: boolean ) => void,
    price?: boolean,
    checked: boolean,
    flightsSelected: ( data: any, index: number ) => void
}

export const FlightSegmentScreen = ({ segment, lastSegment, showInfoSegments, airports, journeyControl, recommendationControl, checked =  false, flightsSelected, price = true }:Props ) => {
    const { t } = useTranslation()
    const { theme: { colors, secondary, fieldColor, backgroundDarken, grayColor, grayDarken} } = useContext( ThemeContext );
    const { semibold, bold } = useFont();
    
    const calculateScales = ( flightsQuantity: number, data: { segment: Segment, airports: Airport[] } ) => {
        switch( flightsQuantity ) {
            case 1:
                return(
                    <TouchableOpacity 
                        onPress={ () =>  showInfo({ segment: segment, airports: airports }, true) }
                    >
                        <DynamicText style={{ marginBottom: 3 }}>{ t( 'resDirecto' ) }</DynamicText>
                        <View  style={{ borderBottomWidth: 1 }}></View>
                    </TouchableOpacity>  
                )
            case 2:
                return (
                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center' }}
                        onPress={ () =>  showInfo({ segment: segment, airports: airports }, true) }
                    >
                        <DynamicText style={ styles.stopsText }>{ `1 ${ t( 'resEscala' ) }` }</DynamicText>
                        <Image
                            style={{ width: 50, height: 10 }}
                            resizeMode={"cover"}
                            source={{ uri: 'https://ideas.kontroltravel.com/images/flightStops/1stops.png' }}
                        />
                    </TouchableOpacity>
                )
            case 3:
                return (
                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center' }}
                        onPress={ () =>  showInfo({ segment: segment, airports: airports }, true) }
                    >
                        <DynamicText style={ styles.stopsText }>{ `2 ${ t( 'resEscalas' ) }` }</DynamicText>
                        <Image
                            style={{ width: 50, height: 10 }}
                            resizeMode={"cover"}
                            source={{ uri: 'https://ideas.kontroltravel.com/images/flightStops/2stops.png' }}
                        />
                    </TouchableOpacity>
                    
                )
            case 4:
                return (
                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center' }}
                        onPress={ () =>  showInfo({ segment: segment, airports: airports }, true) }
                    >
                        <DynamicText style={ styles.stopsText }>{ `3 ${ t( 'resEscalas' ) }` }</DynamicText>
                        <Image
                            style={{ width: 50, height: 10 }}
                            resizeMode={"cover"}
                            source={{ uri: 'https://ideas.kontroltravel.com/images/flightStops/3stops.png' }}
                        />
                    </TouchableOpacity>
                    
                )
            case 5:
                return (
                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center' }}
                        onPress={ () =>  showInfo({ segment: segment, airports: airports }, true) }
                    >
                        <DynamicText style={ styles.stopsText }>{ `4 ${ t( 'resEscalas' ) }` }</DynamicText>
                        <Image
                            style={{ width: 50, height: 10 }}
                            resizeMode={"cover"}
                            source={{ uri: 'https://ideas.kontroltravel.com/images/flightStops/4stops.png' }}
                        />
                    </TouchableOpacity>
                    
                )
            default:
                return(
                    <TouchableOpacity
                        onPress={ () =>  showInfo({ segment: segment, airports: airports }, true) }
                    >
                        <DynamicText style={{ marginBottom: 3 }}>{ t( 'resEscalas' ) }</DynamicText>
                        <View  style={{ borderBottomWidth: 1 }}></View>
                    </TouchableOpacity>  
                )

        }
    }
    
    const calculateBaggage = ( baggage: string ) => {
        switch (baggage) {
            case '1P':
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialIcon 
                            name="bag-personal"
                            size={ 20 }
                            color={ colors.primary }
                        />
                        <MaterialIcon 
                            name="bag-carry-on"
                            size={ 20 }
                            color={ grayColor }
                        />
                        <FontAwesomeIcon
                            icon={ faSuitcaseRolling }
                            size={ 20 }
                            color={ grayColor }
                        />
                    </View>
                )
            /* case '2P':
                return (

                )
            case '3P':
                return (

                )
            case '4P':
                return (

                ) */
            default:
                case '1P':
                return (
                    <FontAwesomeIcon 
                        icon={ faSuitcaseRolling }
                        size={ 20 }
                        color={ colors.primary }
                    />
                )
        }
    }

    const showInfo = ( data: { segment: Segment, airports: Airport[] }, isScales: boolean = false ) => {
        showInfoSegments( data, isScales );
    }


    const segmentSelected = ( value: boolean ) => {
        let segments: FlightsAndAirports;
        segments = {
            Flights: segment.Flights,
            DeparturesAirports: [],
            ArrivalAirports: [],
            Segment: segment
        }

        flightsSelected({
            JourneyIndex: journeyControl,
            RecommendationIndex: recommendationControl,
            SegmentSelected: segments,
            ResetSelection: false,
            checked: value
        }, -1)
    
    }

    return (
        <View style={{ margin: 10, borderBottomWidth: ( lastSegment ) ? 0 : .5, paddingBottom: 10, borderBottomColor: grayColor }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Animatable.Image 
                        animation="bounceIn"
                        duration={ 1500 }
                        source={{ uri: `https://ltn.xnet.travel/Images/Airlines/${segment.ValidatingCarrier}.png` }}
                        style={styles.airlineImage}
                        resizeMode="stretch"
                    />
                    <DynamicText fontFamily={ semibold } style={{ margin: 5, color: grayColor, fontSize: 15 }}>{ segment.ValidatingCarrier }</DynamicText>
                </View>

                <TouchableOpacity
                    style={{ marginRight: 5 }}
                    onPress={ () => showInfo({ segment: segment, airports: airports }) }
                >
                    <Icon 
                        name="information-circle-outline"
                        color={ colors.primary }
                        size={ 25 }
                    />
                </TouchableOpacity>
                
            </View>
            <View style={{ flexDirection: 'row'}}>
                <Switch 
                    /* style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }} */
                    trackColor={{ false: grayColor, true: secondary }}
                    thumbColor={( checked ) ? backgroundDarken : fieldColor } 
                    value={ false }
                    onValueChange={(value) => {
                        segmentSelected( value );
                    }}
                    value={ checked }
                ></Switch>
                <View style={{ width: '25%' }}>
                    <DynamicText fontFamily={ semibold } style={{ color: grayDarken }}>{ segment?.DepartureStation }</DynamicText>
                    <DynamicText fontFamily={ bold } style={{ color: grayDarken }}>{ Moment( segment?.DepartureDateTime ).format( 'LT' ) }</DynamicText>
                <DynamicText fontFamily={ bold } style={{ color: grayDarken }}>{ Moment( segment?.DepartureDateTime ).format( 'ddd DD MMM' ) }</DynamicText>
                </View>
                <View style={{ marginRight: '8%' }}>
                    { calculateScales(segment.Flights.length, { segment: segment, airports: airports }) }
                </View>
                <View style={{ width: '25%' }}>
                    <DynamicText fontFamily={ semibold } style={{ color: grayDarken }}>{ segment?.ArrivalStation }</DynamicText>
                    <DynamicText fontFamily={ bold } style={{ color: grayDarken }}>{ Moment( segment?.ArrivalDateTime ).format( 'LT' ) }</DynamicText>
                    <DynamicText fontFamily={ bold } style={{ color: grayDarken }}>{ Moment( segment?.ArrivalDateTime ).format( 'ddd DD MMM' ) }</DynamicText>
                </View>
                <View>
                    { calculateBaggage( segment.Flights[0].FareOption.BaggageAllowance ) }
                </View>
                
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 15 }}>
                <DynamicText fontFamily={ semibold } style={{ color: colors.primary }}>{ `${ t( 'resDuracion' ) } ` } </DynamicText>
                <DynamicText style={{ color: grayDarken }}>{ transformHours( segment?.Duration, false, true ) }</DynamicText>
            </View>
            
            
                
            
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
        marginLeft: 10
    },
})
