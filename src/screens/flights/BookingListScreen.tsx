import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Header } from '../../components/common/Header';
import { RootStackParams } from '../../navigator/Navigator';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faMoneyCheckAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { BookingsRQ } from '../../model/classes/flights/BookingsRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { flightsApi } from '../../api/flightsApi';
import { Booking } from '../../model/interfaces/flights/Bookings';
import { BookingsRS } from '../../model/classes/flights/BookingsRS';
import { DynamicText } from '../../components/common/DynamicText';
import Moment from 'moment';
import { setStateBookingList } from '../../helpers/bookings/setStateBookingList';
import { setStateColorBookingList } from '../../helpers/bookings/setStateColorBookingList';
import { commonStyles } from '../../styles/commonStyles';
import { getServiceIcon } from '../../helpers/common/getServiceIcon';

interface Props extends StackScreenProps<RootStackParams, 'BookingListScreen'>{};

export const BookingListScreen = ( { navigation, route }: Props ) => {

    const { type } = route.params;
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const { userData } = useContext( AuthContext );
    const [response, setResponse] = useState<BookingsRS>( new BookingsRS );
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([])
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, } } = useContext( ThemeContext );

    const { getBookings } = flightsApi()

    useEffect(() => {

        const request = new BookingsRQ( userData.IDUser, userData.IDEntityDefault );
        request.pageIndex = 1;
        setResponse( new BookingsRS );
        setBookings( [] );
        switch (type) {
            case 'flown':
                request.showOwnedValue = true;
                request.showApproverValue = false;
                setTitle( t( 'resMisViajes' ) )
                break;
            case 'others':
                request.showOwnedValue = true;
                request.showApproverValue = false;
                setTitle( t( 'resSolicitudes' ) );
                break;
            case 'approver': 
                setTitle( t( 'resAprobacionesPendientes' ) )
                request.showOwnedValue = false;
                request.showApproverValue = true;
                request.state = 0;
            default:
                break;
        }

        getBooking( request )

    }, [type])

    useEffect(() => {
    }, [bookings])

    useEffect(() => {
        setBookingsData()

    }, [response.Data])

    const getBooking = ( request:  BookingsRQ ) => {
        request.period = '12M';
        getBookings( request )
            .then(( response ) => {
                if ( response.success ) {
                    setResponse( response.list[0] );
                    setBookingsData();
                }
                setLoading( false );
            })

    }
    

    const setBookingsData = () => {
        const tempBookings: Booking[] = [];

        if( response ) {
            response?.Data?.forEach( booking => {
                if ( type !== 'approver' || booking.statuscorporate === 'P' ) {
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
                    }

                    tempBookings.push( newBooking );

                }
            })
            setBookings( tempBookings );
        }
    }

    const renderBookingCard = ( item: Booking, index: number ) => {
        const bottomPadding: number = ( bookings.length > 0  && bookings.length  === ( index + 1 )) ?  150 : 0;
        return (
            <View key={ index } style={{ paddingBottom: bottomPadding }} >
                <TouchableOpacity
                    style={[styles.contain, {shadowColor: colors.border}]}
                    onPress={ () => navigation.navigate( 'ReviewScreen', {
                        loc: item.loc,
                        products: item.products
                    }) }
                    activeOpacity={0.9}>
                    <View
                        style={[
                            styles.nameContent,
                            {
                            borderBottomColor: colors.card,
                            backgroundColor: colors.primary,
                            },
                        ]}>
                        <DynamicText body2 whiteColor fontFamily={ 'semibold' }>
                            { item.loc }
                        </DynamicText>
                        <FontAwesomeIcon
                            icon={ getServiceIcon( item.products ) }
                            color={ whiteColor }
                            size={ 18 }
                        />
                    </View>
                    <View
                        style={[styles.mainContent, {backgroundColor: colors.primary}]}>
                        <DynamicText header whiteColor numberOfLines={1}>
                        { item.passengers }
                        </DynamicText>
                        <View style={{ flexDirection: 'row' }}>
                            
                            <DynamicText body2 whiteColor>
                            { Moment(item.goingDate).format('llll') }
                            </DynamicText>
                            <FontAwesomeIcon
                                style={{ marginLeft: 5, marginRight: 5  }}
                                icon={ faExchangeAlt }
                                color={ whiteColor }
                                size={ 18 }
                            />
                            <DynamicText body2 whiteColor>
                            { Moment(item.endDate).format('llll') }
                            </DynamicText>
                        </View>
                        <DynamicText body2 whiteColor>
                            { item.rute }
                        </DynamicText>
                        
                    </View>
                    <View style={[styles.validContent, {backgroundColor: whiteColor}]}>
                        <DynamicText overline semibold numberOfLines={1}  style={{ fontSize: 15 }}>
                        { item.internalLoc }
                        </DynamicText>
                        <View style={{ ...commonStyles.stateContainer,  backgroundColor: setStateColorBookingList(item.state) }}>
                            <DynamicText numberOfLines={ 1 } style={{ fontSize: 15,  textAlign: 'center', color: buttonText }}>{ t( setStateBookingList( item.state ) ) }</DynamicText>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
            
            
    }

    return (
        <>
            <Header 
                title={ title }
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

                style={{ backgroundColor: fieldColor }}

                renderRight={ () => {
                    return (
                        <ProfileNavigation color={ colors.primary } navigation={ navigation } />
                    )
                } }
            />

            { loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fieldColor }}>
                    <ActivityIndicator
                        size="large"
                        animating={ true }
                        color={ colors.primary }
                    ></ActivityIndicator>
                </View>
            }

            <ScrollView style={{ width: '97%', alignSelf:'center', backgroundColor: fieldColor }}>
                { 
                    bookings.map(( item, index ) => {
                        return ( 
                            renderBookingCard( item, index )
                        )
                    })
                }
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create({
    contain: {
        marginTop: 10,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1.0,
    },
    nameContent: {
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    validContent: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 8,
        justifyContent: 'space-between',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    mainContent: {padding: 8, alignItems: 'flex-start'},
    

})
