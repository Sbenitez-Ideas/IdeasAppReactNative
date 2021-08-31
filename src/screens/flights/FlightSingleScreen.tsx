import React, { useContext, useEffect, useState } from 'react'
import { AvailabilitySingleJourneyRS } from '../../model/classes/availability/envelopes/AvailabilitySingleJourneyRS'
import { DynamicText } from '../../components/common/DynamicText';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faCheckCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useFont } from '../../hooks/common/useFont';
import Moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { FlightSegmentScreen } from './FlightSegmentScreen';
import { SegmentSelected } from '../../model/classes/flights/SegmentSelected';
import { Segment } from '../../model/classes/flights/business-objects/Segment';
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import { useNavigation } from '@react-navigation/core';
import { loginStyles } from '../../styles/loginStyles';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { FlightUpsellScreen } from './FlightUpsellScreen';
import { FlightsContext } from '../../contexts/flights/FlightsContext';
import * as Animatable from 'react-native-animatable';

interface Props  {
    availJourneys: AvailabilitySingleJourneyRS[],
    searchParams: {
        adults: number;
        childrens: number;
        babys: number;
        times: string;
        dates: string;
        departures: string;
        arrivals: string;
        baggage: string;
        cabine: {
            name: string;
            value: string;
        };
        direct: boolean;
        currency: string;
        language: string;
    }
}

export const FlightSingleScreen = ({ availJourneys, searchParams }:Props ) => {
    const { width } = Dimensions.get( 'window' );
    const { theme:{ colors, lightDark, grayColor, whiteColor, accent, secondary, lightGray, backgroundDarken, } } = useContext(ThemeContext);
    const { t } = useTranslation();
    const { setSearchParams, setItemsPricing } = useContext( FlightsContext );
    const { bold, semibold } = useFont();
    const [selectedFlight, setSelectedFlight] = useState<SegmentSelected[]>([]);
    const [checkedSegment, setCheckedSegment] = useState<any[][]>([]);
    const [collapseSegment, setCollapseSegment] = useState<any[]>([]);
    const [journeyCurrent, setJourneyCurrent] = useState<number>(0);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [showInfo, setShowInfo] = useState<boolean[][]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        let airport: Airport[] = [];
        let newCheckedSegment = [ ...checkedSegment ];
        let newShowInfo = [ ...showInfo ];
        let newCollapseSegment = [ ...collapseSegment ];
        if ( availJourneys ) {
            availJourneys.map(( a, index ) => {
                Array.prototype.push.apply(airport, a.Airports);
                newCollapseSegment.push(  false );
                newCheckedSegment[ index ] = [];
                newShowInfo[ index ] = [];
                a.Journey.Segments.map(( s ) => {
                    newCheckedSegment[ index ].push( false );
                    newShowInfo[ index ].push( false );
                })
            });

            if ( newCollapseSegment.length > 0 ) {
                newCollapseSegment[0] =  true;
            }

            setCollapseSegment( newCollapseSegment );
            setCheckedSegment( newCheckedSegment );
            setShowInfo( newShowInfo );
            setSearchParams( searchParams )
            setAirports( airport );
        }
    }, [])

    const segmentsSelected = (selectedItem: SegmentSelected, idJourney: number, idSegment: number) => {
        let newSelectedFlight = [ ...selectedFlight ];
        let newCheckedSegment = [ ...checkedSegment ];
        let newCollapseSegment = [ ...collapseSegment ];
        let count = 0;
        newSelectedFlight[ idJourney ] = selectedItem;
        newCheckedSegment[ idJourney ] = newCheckedSegment[ idJourney ].map( i => i = false );
        newCheckedSegment[ idJourney ][ idSegment ] = true;

        if ( ( idJourney + 1 ) === newCollapseSegment.length ) {
            newCollapseSegment[ idJourney ] = true;    
        } else {
            newCollapseSegment[ idJourney ] = false;
        }        
        if (availJourneys.length !== (idJourney + 1)) {
            newCollapseSegment[ idJourney + 1 ] = true;
            setJourneyCurrent( journeyCurrent + 1 );
        }
        setSelectedFlight( newSelectedFlight );
        setCheckedSegment( newCheckedSegment );
        setCollapseSegment( newCollapseSegment );

        
    }


    const changeCollapseSegments = ( idJourney: number ) => {
        let newCollapseSegment = [ ...collapseSegment ];

        newCollapseSegment.map(( cSegment, index ) => {
            if ( index === idJourney ) {
                newCollapseSegment[ index ] = true;
            } else {
                newCollapseSegment[ index ] = false;
            }
        });
        setCollapseSegment( newCollapseSegment );

    }

    const showInfoSegment = ( data: { segment: Segment, airports: Airport[] }, journeyIndex: number, index: number, isScales: boolean ) => {
        if ( isScales ) {
            navigation.navigate( 'FlightInfoScreen', { data } )   
        } else {
            let newShowInfo = [ ...showInfo ];
            newShowInfo[ journeyIndex ][ index ] = !newShowInfo[ journeyIndex ][ index ];
            setShowInfo( newShowInfo );
        }
    }

    const enableContinue = () => {
        if ( selectedFlight.length ==  availJourneys.length ) {
            return true
        } else {
            return false;
        }
    }

    const pricing = () => {
        setItemsPricing( selectedFlight , 'single', searchParams, airports, false );
        navigation.navigate( 'FlightPricingScreen' );
    }

    return (
        <ScrollView>
                <View style={{ backgroundColor: whiteColor, padding: 5, borderRadius: 5, borderWidth: .5, borderColor: grayColor, width: '95%', alignSelf: 'center', marginTop: 3, opacity: 1 }}>
                    { availJourneys.length > 0 &&
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                            <View style={{ flexDirection: 'row' }}>
                                { selectedFlight[0]?.SegmentSelected &&
                                    <Animatable.View
                                        animation='fadeIn'
                                    >
                                        <FontAwesomeIcon 
                                            color={ '#ACD1AF' }
                                            style={{ marginTop: 2, marginRight: 5 }}
                                            icon={ faCheckCircle }
                                            size={ 15 }
                                        />
                                    </Animatable.View>
                                }
                                <DynamicText fontFamily={ bold } headline style={{ color: lightDark }}>{ t( 'resIda' ).toUpperCase() }</DynamicText>
                            </View>
                            { availJourneys.length > 1 &&
                                <>
                                    <FontAwesomeIcon 
                                        icon={ faChevronRight }
                                        size={ 30 }
                                        style={{ marginLeft: 20 }}
                                        color={ lightDark }
                                    />
                                    <View style={{ flexDirection: 'row' }}>
                                        { selectedFlight[1]?.SegmentSelected &&
                                            <Animatable.View
                                                animation='fadeIn'
                                            >
                                                <FontAwesomeIcon 
                                                    color={ '#ACD1AF' }
                                                    style={{ marginTop: 2, marginRight: 5 }}
                                                    icon={ faCheckCircle }
                                                    size={ 15 }
                                                />
                                            </Animatable.View>
                                        }
                                        
                                        <DynamicText fontFamily={ bold } headline style={{ color: lightDark }}>{ t( 'resRegreso' ).toUpperCase() }</DynamicText>
                                    </View>
                                </>
                            }
                            
                        </View>
                    }
                        
                    <View style={{ flexDirection: 'row', justifyContent: ( selectedFlight.length === 1 ? 'flex-start' : 'space-around' ), }}>
                        
                        { selectedFlight.length > 0 &&
                            selectedFlight.map(( selected, item ) => {
                                return (
                                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                        <Animatable.Image 
                                            animation="bounceIn"
                                            duration={ 1500 }
                                            source={{ uri: `https://ltn.xnet.travel/Images/Airlines/${selected.SegmentSelected.Segment.ValidatingCarrier}.png` }}
                                            style={ styles.flightImageHeader }
                                            resizeMode="stretch"
                                        />
                                        <View style={{ alignItems: 'center' }}>
                                            <DynamicText fontFamily={ semibold } style={{ color: lightDark, fontSize: 14.5 }}>{ Moment( selected.SegmentSelected.Segment.DepartureDateTime ).format( 'll' ) }</DynamicText>
                                            <DynamicText fontFamily={ semibold } style={{ color: lightDark, fontSize: 14 }}>{ Moment( selected.SegmentSelected.Segment.DepartureDateTime ).format( 'LT' ) }</DynamicText>
                                            <DynamicText fontFamily={ semibold } style={{ color: lightDark, fontSize: 13 }}>{ `${ selected.SegmentSelected.Segment.DepartureStation } - ${ selected.SegmentSelected.Segment.ArrivalStation }` }</DynamicText>
                                        </View>
                                        
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={{ margin: 2, alignSelf: 'flex-end' }}>
                        <TouchableOpacity
                            disabled={ !enableContinue() ? true : false }
                            onPress={ () => pricing() }
                        >
                                <LinearGradient
                                    colors={ enableContinue() ? [colors.primary,secondary]  : [ lightGray, lightGray] }
                                    style={{padding: 10, borderRadius: 5, width: width * .24 }}
                                >
                                    <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: ( enableContinue() ? whiteColor : grayColor ), alignSelf: 'center' }}>{ t( 'resContinuar' ) }</DynamicText>
                                </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: '1.5%' }}>
                    { availJourneys.map(( journey, index ) => {
                        return (
                            <View key={ index } style={{ marginTop: 5 }}>
                                {( index === 0 && availJourneys.length > 0 && availJourneys.length === 2 ) && 
                                    <TouchableOpacity
                                        onPress={ () => changeCollapseSegments( index ) }
                                        style={{ height: collapseSegment[ index ] ? 41 : 31, marginTop: collapseSegment[ index ] ? 0 : 10,  marginBottom: 8  }}
                                    >
                                        <View style={[ styles.tabs, { borderColor: grayColor, backgroundColor: collapseSegment[ index ] ? backgroundDarken : whiteColor }]}>
                                            <DynamicText fontFamily={ bold } style={{ fontSize: 14, color: collapseSegment[ index ] ? accent : lightDark,  alignSelf: 'center'}}>{ t( 'resEligeIda' ) }</DynamicText>                            
                                            <View style={{ flexDirection: 'row' }}>
                                                <FontAwesomeIcon 
                                                    icon={ faPlaneDeparture }
                                                    color={ collapseSegment[ index ] ? whiteColor : backgroundDarken }
                                                    size={ 20 }
                                                    style={{ marginRight: 5 }}
                                                />  
                                                <DynamicText fontFamily={ bold } style={{ fontSize: 18, color: collapseSegment[ index ] ? whiteColor : lightDark }}>{ journey.Journey.DepartureStation + '-' }</DynamicText>                            
                                                <DynamicText fontFamily={ bold } style={{ fontSize: 18, color: collapseSegment[ index ] ? whiteColor : lightDark }}>{ journey.Journey.ArrivalStation }</DynamicText>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                }
                                { ( index === 1 && availJourneys.length > 0 && availJourneys.length === 2 ) && 
                                    <TouchableOpacity
                                        onPress={ () => changeCollapseSegments( index ) }
                                        style={{ height: collapseSegment[ index ] ? 41 : 31, marginTop: collapseSegment[ index ] ? 0 : 10, marginBottom: 8 }}
                                    >
                                        <View style={[ styles.tabs, { borderColor: grayColor, backgroundColor: collapseSegment[ index ] ? backgroundDarken : whiteColor  }]}>
                                            <DynamicText fontFamily={ bold } style={{ fontSize: 14, color: collapseSegment[ index ] ? accent : lightDark,  alignSelf: 'center'}}>{ t( 'resEligeRegreso' ) }</DynamicText>                            
                                            <View style={{ flexDirection: 'row' }}>
                                                <FontAwesomeIcon 
                                                    icon={ faPlaneArrival }
                                                    color={ collapseSegment[ index ] ? whiteColor : backgroundDarken }
                                                    size={ 20 }
                                                    style={{ marginRight: 5 }}
                                                />
                                                <DynamicText fontFamily={ bold } style={{ fontSize: 18, color: collapseSegment[ index ] ? whiteColor : lightDark }}>{ journey.Journey.DepartureStation + '-' }</DynamicText>                                
                                                <DynamicText fontFamily={ bold } style={{ fontSize: 18, color: collapseSegment[ index ] ? whiteColor : lightDark }}>{ journey.Journey.ArrivalStation }</DynamicText>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                    })}
                </View>

            <View style={[ styles.flightsContainer, {borderColor: grayColor, backgroundColor: whiteColor, marginTop: 10 }]}>
                { availJourneys.map(( journey, journeyIndex ) => {
                    return (
                        <>
                            { collapseSegment[journeyIndex] &&
                                <View key={ journeyIndex }>
                                    <DynamicText fontFamily={ bold } style={{ alignSelf: 'center', fontSize: 15, margin: 10, color: lightDark }}>{ ` ${ t( 'resEligeTu' ) } ` + ( journeyIndex === 0 ? t( 'resIda' ) : ` ${ t( 'resRegreso' ) } ` ) + Moment( journey.Journey.DepartureDate ).format( 'llll' ) }</DynamicText>
                                    { journey.Journey.Segments.map(( segment, index ) => {
                                        
                                        return (
                                            <View
                                                key={ index }
                                            >
                                                <FlightSegmentScreen 
                                                    segment={ segment }
                                                    price={ false }
                                                    journeyControl={ journeyIndex }
                                                    recommendationControl={ 0 }
                                                    airports={ airports }
                                                    checked={  checkedSegment[journeyIndex][index]}
                                                    flightsSelected={ (data: any ) => segmentsSelected( data, journeyIndex, index ) }
                                                    showInfoSegments={ ( data, isScales ) =>  showInfoSegment( data, journeyIndex, index, isScales ) }
                                                />
                                                { showInfo[ journeyIndex ][ index ] &&
                                                    <FlightUpsellScreen 
                                                        segment={ segment } 
                                                        journeyControl={ journeyIndex }
                                                        recommendationControl={ 0 } 
                                                        showSegmentUpsell={ showInfo[ journeyIndex ][ index ] }
                                                        changeSegmentSelected={ ( data: any ) => segmentsSelected( data, journeyIndex, index ) }
                                                    />
                                                }
                                                

                                            </View>
                                        )
                                    })

                                    }
                                </View>
                            }
                        </>
                        
                    )
                })}

            </View>
        </ScrollView>
    )
}



const styles = StyleSheet.create({
    tabs: {
        borderWidth: .5, 
        padding: 10,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    flightsContainer: {
        borderWidth: .5, 
        width: '97%', 
        alignSelf: 'center', 
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },

    flightImageHeader: {
        width: 30, 
        height: 30,
        marginTop: 9
    }

})