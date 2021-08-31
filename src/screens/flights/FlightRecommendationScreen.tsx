import React, { useContext, useState } from 'react'
import { FlightHeaderScreen } from './FlightHeaderScreen'
import { Header } from '../../components/common/Header';
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import { Recommendation } from '../../model/classes/availability/bussiness-objects/Recommendation';
import { FlightSegmentScreen } from './FlightSegmentScreen';
import { TouchableOpacity, View } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useFont } from '../../hooks/common/useFont';
import { transformAirports } from '../../helpers/common/transformAirports';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import { Journey } from '../../model/classes/availability/bussiness-objects/Journey';
import Moment from 'moment';
import { Segment } from '../../model/classes/flights/business-objects/Segment';
import { SegmentSelected } from '../../model/classes/flights/SegmentSelected';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';


interface Props {
    recommendation: Recommendation,
    airports: Airport[],
    showInfoSegment: ( data: { segment: Segment,  airports: Airport[] } ) => void,
    checkedSegment: any[][];
    flightsSelected: ( data: any ) => void;
}

export const FlightRecommendationScreen = ( { recommendation, airports, showInfoSegment, checkedSegment, flightsSelected }: Props ) => {
    const { semibold, bold } = useFont();
    const { theme: { colors, whiteColor, accent, lightGray, grayColor } } = useContext( ThemeContext );
    const [showItems, setShowItems] = useState(false);
    const { t } = useTranslation();
    
    const showInfoSegments = ( data: { segment: Segment, airports: Airport[] } ) => {
        showInfoSegment( data );
    }


    const calculateHeader = ( journey: Journey, index: number ) => {
        if ( recommendation.Journeys.length === 2 ) {
            switch( index ) {
                case 0: 
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', margin: 5 }}>
                                <FontAwesomeIcon 
                                    icon={ faPlaneDeparture }
                                    size={ 20 }
                                    color={ colors.primary }
                                />
                                <DynamicText fontFamily={ bold } style={{ color: colors.primary, margin: 2 }}>{ t( 'resIda' ).toUpperCase() }</DynamicText>
                            </View>
                            <DynamicText fontFamily={ bold } style={{ color: colors.primary, margin: 8  }}>{ Moment( journey.DepartureDate ).format( 'ddd DD MMM YYYY' ) }</DynamicText>
                        </View>
                    )
                case 1:
                    return (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', margin: 5 }}>
                                <FontAwesomeIcon 
                                    icon={ faPlaneArrival }
                                    size={ 20 }
                                    color={ colors.primary }
                                />
                                <DynamicText fontFamily={ bold } style={{ color: colors.primary, margin: 2 }}>{ t( 'resRegreso' ).toUpperCase() }</DynamicText>
                            </View>
                            <DynamicText fontFamily={ bold } style={{ color: colors.primary, margin: 8 }}>{ Moment( journey.DepartureDate ).format( 'ddd DD MMM YYYY' ) }</DynamicText>
                        </View>
                        
                    )
            }
        }
    }


    const selected = (data: any, index: number) => {
        flightsSelected({ SegmentSelected: data, idSegment: index });

    }

    return (
        
        <View style={{backgroundColor: whiteColor, borderRadius: 5 }}>
            { recommendation.Journeys.map(( journey, JourneyIndex ) => {
                return (
                    <View 
                        key={ JourneyIndex }
                    >
                        <View style={{ backgroundColor: accent, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            { calculateHeader( journey, JourneyIndex ) }
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                            <View style={{ alignItems: 'center' }}>
                                <DynamicText fontFamily={ semibold } style={{ color: grayColor, fontSize: 15 }}>{  transformAirports( journey.DepartureStation, airports ) }</DynamicText>
                                
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <DynamicText fontFamily={ semibold } style={{ color: grayColor, fontSize: 15 }}>{transformAirports( journey.ArrivalStation, airports ) }</DynamicText>
                            </View>
                        </View>
                        <View>
                            { journey.Segments.map(( segment, segmentIndex ) => {
                                return (
                                    
                                    <View
                                        key={ segmentIndex }
                                    >
                                        { (segmentIndex <= 2 || showItems ) &&
                                            <FlightSegmentScreen 
                                                lastSegment={ segmentIndex + 1 === journey.Segments.length  ? true : false  }
                                                segment={ segment }
                                                journeyControl={ JourneyIndex }
                                                recommendationControl={ recommendation.RecommendationId }
                                                airports={ airports }
                                                showInfoSegments={ showInfoSegments }
                                                checked={ checkedSegment[JourneyIndex][segmentIndex] }
                                                flightsSelected={ (data: any, index: number) => selected( data, segmentIndex ) }
                                            />
                                        }
                                    </View>
                                )
                            })}

                            { ( journey.Segments.length > 3 && !showItems ) &&
                                <LinearGradient
                                    colors={[ 'transparent', lightGray ]}
                                    style={{ padding: 20 }}
                                > 
                                    <TouchableOpacity onPress={ () => setShowItems( true ) }>
                                        <DynamicText fontFamily={ semibold } headline style={{ alignSelf: 'center', color: colors.primary }}> Ver mas vuelos </DynamicText>
                                    </TouchableOpacity>
                                </LinearGradient>
                            }
                        </View>
                    </View>
                )
            })

            }
        </View>
    )
}
