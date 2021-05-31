import React, { useContext, useEffect, useState } from 'react'
import { ImageBackground, Text, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header } from '../../components/common/Header';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from '../../components/common/DynamicText';
import { useFont } from '../../hooks/common/useFont';
import { flightsApi } from '../../api/flightsApi';
import { BookingsRQ } from '../../model/classes/flights/BookingsRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { BookingsRS } from '../../model/classes/flights/BookingsRS';
import { Booking } from '../../model/interfaces/flights/Bookings';
import { ScrollView } from 'react-native-gesture-handler';
import Moment from 'moment';
import { setStateBookingList } from '../../helpers/bookings/setStateBookingList';
import { useTranslation } from 'react-i18next';
import { getServiceIcon } from '../../helpers/common/getServiceIcon';

interface Props extends StackScreenProps<RootStackParams, 'MyServicesScreen'>{};

export const MyServicesScreen = ({ navigation, route }: Props) => {
    const [loading, setLoading] = useState( true );
    const { height, width } = Dimensions.get( 'window' );
    const { semibold, bold } = useFont();
    const { t } = useTranslation();
    const [response, setResponse] = useState<BookingsRS>( new BookingsRS );
    const [bookings, setBookings] = useState<Booking[]>([])
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, } } = useContext( ThemeContext );
    const { userData } = useContext( AuthContext );
    const { getBookings } = flightsApi();


    useEffect(() => {
        setResponse( new BookingsRS );
        setBookings( [] );
        const request = new BookingsRQ( userData.IDUser, userData.IDEntityDefault );
        request.pageIndex = 1;
        request.showOwnedValue = true;
        request.showApproverValue = false;
        request.period = '12M';
        getBookings( request )
            .then(( response ) => {
                if ( response.success ) {
                    setResponse( response.list[0] );
                    setBookingsData();

                }
                setLoading( false );

            })

    }, [])

    useEffect(() => {
        setBookingsData()
    }, [response.Data])

    useEffect(() => {
    }, [bookings])

    const setBookingsData = () => {
        const tempBookings: Booking[] = [];
        if( response ) {
            response?.Data?.forEach( booking => {
                const newBooking: Booking = {
                    products: booking.tiposource,
                    company: booking.logocia,
                    loc: booking.loc,
                    internalLoc: booking.codreserva.toString(),
                    creationDate: booking.dataCreacion,
                    goingDate: booking.data,
                    comingDate: new Date(),
                    endDate: booking.plazoemissao,
                    state: booking.status,
                    flow: booking.statuscorporate,
                    rute: booking.ruta,
                    passengers: booking.paxnome,
                    clientName: booking.nomeCliente,
                    offline: booking.offline,
                    destinationImage: 'https://www.pixelstalk.net/wp-content/uploads/2016/06/Miami-Background-Free-Download.jpg',
                    ciaName: booking.nomecia
                }

                tempBookings.push( newBooking );
            })
            setBookings( tempBookings );
        }        
    }

    return (
        <>
            <Header 
                title={ 'Mis servicios' }
                onPressLeft={ () => {
                    navigation.goBack()
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faTimes }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }

                /* style={{ backgroundColor:  }} */

                renderRight={ () => {
                    return (
                        <ProfileNavigation navigation={ navigation } />
                    )
                } }
            />

            {
                loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fieldColor }}>
                    <ActivityIndicator
                        size="large"
                        animating={ true }
                        color={ colors.primary }
                    ></ActivityIndicator>
                </View> 
            }

            <ScrollView style={{ backgroundColor: fieldColor }}>
                {
                    bookings.map(( item, index ) => {
                        const bottomPadding: number = ( bookings.length  === ( index + 1 )) ? 60 : 0; 
                    
                        return (
                            <TouchableOpacity
                                key={ index } 
                                style={{ width: '90%', alignSelf: 'center', marginTop: 20, paddingBottom: bottomPadding }} 
                                activeOpacity={ .7 }
                                onPress={ () => navigation.navigate( 'ReviewScreen', {
                                    booking: item
                                })}
                            >
                                <ImageBackground source={{ uri: item.destinationImage }}   
                                    style={{ 
                                        height: 200,
                                        width: '100%',
                                    }}
                                    imageStyle={{ borderRadius: 10 }}
                                    
                                >
                                    <View style={{ justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row' }}> 
                                        <DynamicText fontFamily={ semibold } style={{ color: whiteColor  }}> { item.loc } </DynamicText>
                                        <View style={{ flexDirection: 'row' }}>
                                            <FontAwesomeIcon 
                                                style={{ marginLeft: 10 }}
                                                icon={ getServiceIcon( item.products ) }
                                                size={ 20 }
                                                color={ whiteColor }
                                            />
                                        </View>
                                    </View>
                                    <View style={{ maxWidth: '100%', marginLeft: 10, marginTop: 30 }}>
                                        <DynamicText fontFamily={ bold } style={{ color: whiteColor, fontSize: 40 }}> { item.rute } </DynamicText>
                                    </View>
                                    <View  style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <View>
                                            <DynamicText fontFamily={ bold } style={{ color: whiteColor, marginLeft: 5, marginTop: 40, fontSize: 15 }}> { item.passengers } </DynamicText>
                                            <DynamicText fontFamily={ bold } style={{ marginLeft: 10, color: whiteColor, fontSize: 15 }}>{ Moment(item.goingDate).format('llll') }</DynamicText>
                                        </View>
                                        <View>
                                            <DynamicText fontFamily={ bold } style={{ color: whiteColor, marginTop: 50, paddingHorizontal: 7 }}> { t( setStateBookingList( item.state ) )  } </DynamicText>
                                        </View>
                                    </View>
                                </ImageBackground>    
                            </TouchableOpacity>
                            
                        )
                    })
                }    
            </ScrollView>                           
        </>
    )
    
}