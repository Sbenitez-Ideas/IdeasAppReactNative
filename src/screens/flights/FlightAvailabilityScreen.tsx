import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { Header } from '../../components/common/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { AvailabilityRQ } from '../../model/classes/availability/envelopes/AvailabilityRQ';
import { calculateCabine } from '../../helpers/flights/calculateCabine';
import { TripTypes } from '../../model/enums/TripTypes';

interface Props extends StackScreenProps< RootStackParams, 'FlightAvailabilityScreen'> {}; 

export const FlightAvailabilityScreen = ({ navigation, route }: Props ) => {

    const { theme: { colors, fieldColor, secondary, whiteColor, grayColor, accent, cancelColor } } = useContext( ThemeContext );
    const  { type, searchParams } = route.params;
    const [titleType, setTitleType] = useState('');
    const [dates, setDates] = useState<string[]>([]);
    const [departures, setDepartures] = useState<string[]>([]);
    const [arrivals, setArrivals] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [request, setRequest] = useState( new AvailabilityRQ() );
    const [rph, setRph] = useState(0);
    

    useEffect(() => {   
        console.log( 'searchparams', searchParams );
        setDates( searchParams.dates.split(',') );
        setTimes( searchParams.times.split( ',' ) );
        setDepartures( searchParams.departures.split( ',' ) );
        setArrivals( searchParams.arrivals.split( ',' ) );

        switch (type) {
            case 'price':
                setTitleType( 'Precio' );
                break;
            default:
                break;
        }
    }, [])


    useEffect(() => {
        if ( dates.length > 0 && times.length > 0 && departures.length > 0 && arrivals.length > 0 ) {
            fillRequest();
            getFlights();
        }
    }, [ dates, times, departures, arrivals ])


    const getFlights = () => {
        
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
        requestAvailability.Cabin = calculateCabine( searchParams.cabine );
        requestAvailability.MaxStops = 0;
        requestAvailability.BaggageOption = Number(( searchParams.baggage.split(':')[1] ));
        requestAvailability.Currency = 'COP';
        requestAvailability.SourceCode = [];
        requestAvailability.DirectFlight = searchParams.direct;
        requestAvailability.TripType = TripTypes.RT;
        requestAvailability.Itineraries = [];

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
    
    return (
        <>
            <Header 
                title={ 'Disponibilidad de Vuelos' }
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
        </>
    )
}
