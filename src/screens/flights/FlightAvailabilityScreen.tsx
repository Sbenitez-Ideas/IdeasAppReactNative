import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { Header } from '../../components/common/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { AvailabilityRQ } from '../../model/classes/availability/envelopes/AvailabilityRQ';
import { TripTypes } from '../../model/enums/TripTypes';
import { flightsApi } from '../../api/flightsApi';
import { FlightHeaderScreen } from './FlightHeaderScreen';
import { AvailabilityByPriceRS } from '../../model/classes/availability/envelopes/AvailabilityByPriceRS';
import { AvailabilitySingleJourneyRS } from '../../model/classes/availability/envelopes/AvailabilitySingleJourneyRS';
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import { Recommendation } from '../../model/classes/availability/bussiness-objects/Recommendation';
import Toast from 'react-native-toast-message';
import { FlightPriceScreen } from './FlightPriceScreen';
import { Segment } from '../../model/classes/flights/business-objects/Segment';
import { ScrollView } from 'react-native-gesture-handler';
import { FlightSingleScreen } from './FlightSingleScreen';
import { CabinType } from '../../model/enums/CabinType';
import { useFont } from '../../hooks/common/useFont';
import { useTranslation } from 'react-i18next';
import { FlightsContext } from '../../contexts/flights/FlightsContext';

interface Props extends StackScreenProps< RootStackParams, 'FlightAvailabilityScreen'> {}; 

export const FlightAvailabilityScreen = ({ navigation, route }: Props ) => {
    const { bold } = useFont();
    const { theme: { colors, lightDark } } = useContext( ThemeContext );
    const { setItemFilter } = useContext( FlightsContext )
    const { getAvailability } = flightsApi();
    const  { type, searchParams } = route.params;
    const [titleType, setTitleType] = useState('');
    const [dates, setDates] = useState<string[]>([]);
    const [departures, setDepartures] = useState<string[]>([]);
    const [arrivals, setArrivals] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState( new AvailabilityRQ() );
    const [rph, setRph] = useState(0);
    const [response, setResponse] = useState<AvailabilityByPriceRS | AvailabilitySingleJourneyRS[]>();
    const [airports, setAirports] = useState<Airport[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [showAvailability, setShowAvailability] = useState(false);
    const [totalRecommendations, setTotalRecommendations] = useState<number>();
    const [numberJourneys, setNumberJourneys] = useState<number>();
    const [displayInfo, setDisplayInfo] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {   
        setDates( searchParams.dates.split(',') );
        setTimes( searchParams.times.split( ',' ) );
        setDepartures( searchParams.departures.split( ',' ) );
        setArrivals( searchParams.arrivals.split( ',' ) );
        switch (type) {
            case 'price':
                setTitleType( t( 'resPrecio' ) );
                break;
            case 'single':
                setTitleType( t( 'resHorario' ) );
            default:
                break;
        }
    }, [])


    useEffect(() => {
       
        if ( request?.Itineraries?.length > 0 ) {
            getFlights();
        }

    }, [ request?.Itineraries ])

    useEffect(() => {
        if ( dates.length > 0 && times.length > 0 && departures.length > 0 && arrivals.length > 0 ) {
            fillRequest();
        }
    }, [ dates, times, departures, arrivals ])

    const getFlights = () => {
        setLoading( true );
        getAvailability( type, request )
            .then(( response ) => {
                if ( response && type == 'price' ? (response as AvailabilityByPriceRS).TotalRecommendation > 0 :
                    (response as AvailabilitySingleJourneyRS[])[0].Journey.Segments.length > 0 ) {
                    setResponse( type === 'price' ? response as AvailabilityByPriceRS : response as AvailabilitySingleJourneyRS[] );
                    if ( type === 'price' ) {
                        const objRes = response as AvailabilityByPriceRS;
                        if ( objRes.Recommendations ) {
                            if ( objRes.Recommendations.length > 0 ) {
                                setAirports( objRes.Airports );
                                setRecommendations( objRes.Recommendations );
                                setTotalRecommendations( objRes.TotalRecommendation );
                                setNumberJourneys( objRes.Recommendations[0].Journeys.length );
                                setItemFilter( objRes.AvailabilityFilter );

                            } else {
                                if ( objRes.TotalRecommendation === 0 ) {

                                } else {

                                }
                            }
                        } else if ( objRes.TotalRecommendation !== 0 ) {

                        }
                    } else if ( type === 'single' ) {
                        const objRes = response as AvailabilitySingleJourneyRS[];
                        if ( objRes.length > 0 ) {
                            setNumberJourneys( objRes.length );
                        } else {

                        }
                    }
                } else {
                    Toast.show({
                        text1: 'Error',
                        text2: t( 'resNoEncontraronVuelosCriteriosBusqueda' ),
                        type: 'error',
                        visibilityTime: 1500
                    });
                    navigation.navigate( 'FlightSearchScreen',  {} );
                }
                setLoading( false );
            },
            error => {
                Toast.show({
                    text1: 'Error',
                    text2: t( 'resErrorBuscandoVuelos' ),
                    type: 'error',
                    visibilityTime: 1500
                });
                navigation.navigate( 'FlightSearchScreen',  {} );
            }
        )
    }

    const fillRequest = () => {
        const requestAvailability = new AvailabilityRQ();
        requestAvailability.PaxAdults = searchParams.adults;
        requestAvailability.PaxChildren = searchParams.childrens;
        requestAvailability.PaxInfants = searchParams.babys;
        requestAvailability.Language = 'ES';
        requestAvailability.RecordSkip = 0;
        requestAvailability.RecordSkip = type === 'price' ? 10 : -1;
        requestAvailability.PreferredAirlines = [];
        requestAvailability.Cabin = /* calculateCabine( searchParams.cabine ); */ CabinType.All;
        requestAvailability.MaxStops = 0;
        requestAvailability.BaggageOption = Number(( searchParams.baggage.split(':')[1] ));
        requestAvailability.Currency = 'COP';
        requestAvailability.SourceCode = [];
        requestAvailability.DirectFlight = searchParams.direct;
        requestAvailability.TripType = TripTypes.RT;
        requestAvailability.Itineraries = [];

        searchParams.language = request.Language;
        searchParams.currency = requestAvailability.Currency;

        times.forEach(( time, index ) => {
            addItinerary(
                convertDate( dates[index].split('-') ),
                departures.length !== 1 ? departures[ index ] : ( index === 0 ? departures[0] : arrivals[0] ),
                arrivals.length !== 1 ? arrivals[ index ] : ( index === 0 ? arrivals[0] : departures[0] ),
                parseInt( time ),
                requestAvailability
            );

            if ( type === 'single' ) {
                setRph( rph + 1 );
            }
        })

        setRequest( requestAvailability );
    }

    const addItinerary = ( departureDate: string, departureIata: string, arrivalIata: string, time: number, request: AvailabilityRQ) => {
        request.Itineraries.push({
            DateDeparture: departureDate,
            IATADeparture: departureIata,
            IATAArrival: arrivalIata,
            TimeDeparture: time,
            RPH: rph.toString()
        })
    }

    const convertDate = ( date: string[] ): string => {
        let convertDate: string = '';
        convertDate = date[0];
        for ( let i = 1; i < 3; i++ ) {
            if ( date[i].length === 1 ) {
                convertDate += '-0' + date[i];
            } else {
                convertDate += '-' + date[i];
            }
        }
        return convertDate;
    }

    const delay = () => {

    }

    const displayFlightInfo = ( data: { segment: Segment,  airports: Airport[] } ) => {
        navigation.navigate( 'FlightInfoScreen', { data } )   
    }
    
    return (
        <View style={{ backgroundColor: '#f4f4f4', flex: 1 }}>
            <Header 
                title={ t( 'resDisponibilidadVuelos' ) }
                subTitle={ titleType }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faArrowLeft }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }
                onPressLeft={ () => navigation.goBack() }
                renderRight={ () => {
                    return (
                        <ProfileNavigation color={ colors.primary } navigation={ navigation } />
                    )
                } }
            />
            <View style={{ backgroundColor: '#f4f4f4' }}>
                { request?.Itineraries?.length > 0 &&
                    <FlightHeaderScreen params={ searchParams } itineraries={ request.Itineraries } type={ type } />
                }
                { ( type === 'single' && response ) &&
                    <ScrollView style={{ backgroundColor: '#f4f4f4' }}>
                        <FlightSingleScreen availJourneys={ response as AvailabilitySingleJourneyRS[] } searchParams={ searchParams } />
                    </ScrollView>
                }
                { ( type === 'price' && response ) &&
                    <ScrollView style={{ backgroundColor: '#f4f4f4' }}>
                        <FlightPriceScreen availByPrice={ response as AvailabilityByPriceRS } searchParams={ searchParams } request={ request } displayFlightInfo={  displayFlightInfo } />
                    </ScrollView>
                }
            
            </View>
            { loading &&
                <View style={{ flex: 1,  backgroundColor: '#f4f4f4', justifyContent: 'center' }}>
                    <Image 
                        source={ require( '../../../assets/images/loading/loadingFlight.gif' ) }  
                        style={ styles.loading }
                    />
                    <DynamicText fontFamily={ bold } style={{ fontSize: 25, alignSelf: 'center', color: lightDark }}>{ t( 'resCargandoDisponibilidad' ) }</DynamicText>
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    loading: {
        marginLeft: 80,
        alignSelf: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 100,
    }
})