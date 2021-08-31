

import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarDay, faMapMarkerAlt, faFilter, faUser, faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { StyleSheet, View, StatusBar, TouchableOpacity } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { useFont } from '../../hooks/common/useFont';
import { ItinerarySearch } from '../../model/classes/availability/bussiness-objects/ItinerarySearch';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';
import { navigate } from '../../navigator/RootNavigation';
import { useNavigation } from '@react-navigation/native';

interface Props {
    params: { adults: number, childrens: number, babys: number, times: string, dates: string, departures: string, arrivals: string, baggage: string, cabine: { name: string, value: string }, direct: boolean },
    itineraries: ItinerarySearch[],
    type: 'price' | 'single'
}

export const FlightHeaderScreen = ({ params, itineraries, type }: Props ) => {
    const navigation = useNavigation();
    const [itiTemp, setItiTemp] = useState<ItinerarySearch[][]>([]);
    const [dates, setDates] = useState<Date[][]>([]);
    const { t } = useTranslation();
    useEffect(() => {
        let itineraryTemp: ItinerarySearch[][] = [];
        let count = 0;
        for (let i = 0;  i < itineraries.length; i++) {
            if (!dates[count]) {
                dates[count] = [];
            }
            const dat = itineraries[i].DateDeparture.split('-');
            dates[count].push( new Date(Number(dat[0]), Number(dat[1]) - 1, Number(dat[2]) ));
      
            if (!itineraryTemp[count]) {
                itineraryTemp[count] = [];
            }
            itineraryTemp[count].push( itineraries[i] );
      
            if ( i === 1 || i === 3 || i === 5) {
                count++;
            }
        }

        setItiTemp( itineraryTemp );


    }, [])

    const { theme: { colors, secondary, accent, backgroundDarken, whiteColor, fieldColor } } = useContext( ThemeContext );
    const { semibold, bold } = useFont();
    return (
        <View style={{ backgroundColor: fieldColor }}>
            <StatusBar backgroundColor={ backgroundDarken } barStyle="light-content" /> 
            <View style={{ backgroundColor: colors.primary, }}>
                <View style={{ margin: 8, flexDirection: "row", justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        { 
                            itiTemp[0]?.map(( itinerary, index ) => {
                                return ( 
                                    <View
                                        key={ index }
                                    >
                                        <View
                                            style={[ styles.row, { margin: 5 } ]}   
                                        >  
                                            { index === 0 &&
                                                <FontAwesomeIcon 
                                                    icon={ faMapMarkerAlt }
                                                    size={ 15 }
                                                    color={ accent }
                                                />
                                            }
                                            <View style={[ styles.row, { marginLeft: 5 } ]}>
                                                <DynamicText fontFamily={ bold } style={{ color: whiteColor }}>{ `${ itinerary.IATADeparture } | ${ itinerary.IATAArrival }` }</DynamicText>
                                            </View> 
                                        </View>
                                        <View
                                            style={[ styles.row, { margin: 5 } ]}   
                                        >
                                            <FontAwesomeIcon 
                                                icon={ faCalendarDay }
                                                size={ 15 }
                                                color={ accent }
                                            />
                                            <View style={[ styles.row, { marginTop: 2, marginLeft: 5 } ]}>
                                                <DynamicText fontFamily={ semibold } style={{ color: whiteColor, fontSize: 12 }}>{ `${ Moment( dates[0][ index ] ).format( 'ddd DD MMM YYYY' ) }` }</DynamicText>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })

                        }
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        { 
                            itiTemp[1]?.map(( itinerary, index ) => {
                                return ( 
                                    <View
                                        key={ index }
                                    >  
                                        <View
                                            style={[ styles.row, { margin: 5 } ]}
                                        >
                                            { index === 0 &&
                                                <FontAwesomeIcon 
                                                    icon={ faCalendarDay }
                                                    size={ 15 }
                                                    color={ accent }
                                                />
                                            }
                                            <View style={[ styles.row, { marginLeft: 5 } ]}>
                                                <DynamicText fontFamily={ bold } style={{ color: whiteColor }}>{ `${ itinerary.IATADeparture } | ${ itinerary.IATAArrival }` }</DynamicText>
                                            </View> 
                                        </View>
                                        <View
                                            style={[ styles.row, { margin: 5 } ]}   
                                        >
                                            <FontAwesomeIcon 
                                                icon={ faCalendarDay }
                                                size={ 15 }
                                                color={ accent }
                                            />
                                            <View style={[ styles.row, { marginTop: 2, marginLeft: 5 } ]}>
                                                <DynamicText fontFamily={ semibold } style={{ color: whiteColor, fontSize: 12 }}>{ `${ Moment( dates[0][ index ] ).format( 'ddd DD MMM YYYY' ) }` }</DynamicText>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })

                        }
                    </View>
                    <TouchableOpacity
                        style={[ styles.row, { justifyContent: 'flex-end', maxHeight: 35, marginTop: 5 } ]}
                        onPress={ () => navigation.navigate( 'FlightFilterScreen',  { type: type } ) }
                    >  
                        <View style={{ backgroundColor: secondary, flexDirection: 'row', padding: 6, borderRadius: 10 }}>
                            <FontAwesomeIcon 
                                style={{ marginTop: 2 }}
                                icon={ faFilter }
                                size={ 15 }
                                color={ accent }
                            />
                            <View style={[ styles.row, { marginTop: 4, marginLeft: 5 } ]}>
                                <DynamicText fontFamily={ semibold } style={{ color: whiteColor }}>{ t( 'resFiltrar' ) }</DynamicText>
                            </View> 
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    }
})