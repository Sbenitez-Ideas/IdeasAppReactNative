import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { Header } from '../../components/common/Header';
import { RootStackParams } from '../../navigator/Navigator';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faExchangeAlt, faInfoCircle, faSearch, faTimesCircle, faFilter } from '@fortawesome/free-solid-svg-icons';
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
import { useFont } from '../../hooks/common/useFont';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'BookingListScreen'>{};

export const BookingListScreen = ( { navigation, route }: Props ) => {
    const { semibold, bold } = useFont();
    const { type } = route.params;
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const { userData } = useContext( AuthContext );
    const [response, setResponse] = useState<BookingsRS>( new BookingsRS );
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([])
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, } } = useContext( ThemeContext );
    const [loc, setLoc] = useState<string>('');
    const [passengerName, setPassengerName] = useState('');
    const { getBookings } = flightsApi()
    const dataFilter = route?.params?.dataFilter;


    useEffect(() => {
        const request = new BookingsRQ( userData.IDUser, userData.IDEntityDefault );
        switch (type) {
            case 'flown':
                request.showOwnedValue = true;
                request.showApproverValue = false;
                setTitle( t( 'resMisViajes' ) )
                break;
            case 'others':
                request.showOwnedValue = false;
                request.showApproverValue = false;
                setTitle( t( 'resSolicitudes' ) );
                break;
            case 'approver': 
                setTitle( t( 'resAprobacionesPendientes' ) )
                request.showOwnedValue = false;
                request.showCancelledValue = false;
                request.showApproverValue = true;
                request.state = 0;
            default:
                break;
        }

        if ( dataFilter?.dateStart !== undefined || dataFilter?.flow !== undefined || dataFilter?.state !== undefined ) {
            Toast.show({
                text1: t( 'resFiltrosAplicados' ),
                type: 'success',
                visibilityTime: 2000,
            });
        }

        getBooking( request )

    }, [type, dataFilter])

    useEffect(() => {
    }, [bookings])

    useEffect(() => {
        setBookingsData()

    }, [response.Data])

    useEffect(() => {
        if ( loc === '' ) {
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
        }
    }, [loc, passengerName])
    

    const getBooking = ( request:  BookingsRQ ) => {
        setLoading( true );
        setResponse( new BookingsRS );
        setBookings( [] );
        request.pageIndex = 1;
        request.period = '12M';
        request.state = ( dataFilter?.state !== undefined ) ? dataFilter.state : 0;
        request.flow = ( dataFilter?.flow !== undefined ) ? dataFilter.flow : '';
        request.dateTo = ( dataFilter?.dateStart !== undefined ) ? new Date( dataFilter.dateStart ) : null;
        request.dateTo = ( dataFilter?.dateEnd !== undefined ) ? new Date( dataFilter.dateEnd ) : null;
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
                    if( tempBookings.length > 0 ) {
                        tempBookings.map(( item, index ) => {
                            if ( item.loc === booking.loc ) {
                                tempBookings[ index ].products.push( booking.tiposource )
                            } else {
                                const newBooking: Booking = {
                                    products: [booking.tiposource],
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
                            }
                        });
                    } else {
                        const newBooking: Booking = {
                            products: [booking.tiposource],
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
                    }
                }
            })
            setBookings( tempBookings );
        }
    }

    const searchLoc = () => {
        setLoading( true );
        const request = new BookingsRQ( userData.IDUser, userData.IDEntityDefault );
        request.loc = loc;
        getBookings( request )
            .then(( response ) => {
                if ( response.success ) {
                    setResponse( response.list[0] );
                    setBookingsData();
                    setLoading( true );

                }
                setLoading( false );

            })
        if ( loc !== '' ) {
            Toast.show({
                text1: t( 'resFiltrosAplicados' ),
                text2: t( 'resFiltradoLocalizador' ),
                type: 'success',
                visibilityTime: 1000
            })
        }
        
    }

    const searchPassenger = () => {
        setLoading( true );
        const request = new BookingsRQ( userData.IDUser, userData.IDEntityDefault );
        request.pageIndex = 1;
        request.showOwnedValue = true;
        request.showApproverValue = false;
        request.period = '12M';
        request.passangerName = passengerName;
        getBookings( request )
            .then(( response ) => { 
                if ( response.success ) {
                    setResponse( response.list[0] );
                    setBookingsData();
                    setLoading( true );

                }
                setLoading( false );

            })
        if ( passengerName !== '' ) {
            Toast.show({
                text1: t( 'resFiltrosAplicados' ),
                text2: t( 'resFiltradoPasajero' ),
                type: 'success',
                visibilityTime: 1000
            })
        }
    }

    const calculateFiltered = () => {
        let alreadyCalculated = false;
        if ( dataFilter ) {
            if ( dataFilter?.dateStart !== '' || dataFilter?.state !== 0 || dataFilter.flow !== '') {
                alreadyCalculated = true;
            }
        }

        return alreadyCalculated;
    }

    const renderBookingCard = ( item: Booking, index: number ) => {
        const bottomPadding: number = ( bookings.length > 0  && bookings.length  === ( index + 1 )) ?  150 : 0;
        return (
            <View key={ index } style={{ paddingBottom: bottomPadding }} >
                <TouchableOpacity
                    style={[styles.contain, {shadowColor: colors.border}]}
                    onPress={ () => navigation.navigate( 'ReviewScreen', {
                        loc: item.loc,
                        products: item.products,
                        booking: item,
                        typeScreen: type
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
                        <DynamicText style={{ fontSize: 20 }} whiteColor fontFamily={ 'semibold' }>
                            { item.loc }
                        </DynamicText>
                        <View style={{ flexDirection: 'row' }}>
                            { item?.products?.map(( product, indexProduct ) => {
                                return (
                                    <FontAwesomeIcon 
                                        key={ indexProduct }
                                        style={{ marginLeft: 10 }}
                                        icon={ getServiceIcon( product ) }
                                        size={ 20 }
                                        color={ whiteColor }
                                    />
                                )
                            })

                            }    
                        </View>
                    </View>
                    <View
                        style={[styles.mainContent, {backgroundColor: colors.primary}]}>
                        <DynamicText style={{ fontSize: 25 }} whiteColor numberOfLines={1}>
                        { item.passengers }
                        </DynamicText>
                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                            
                            <DynamicText body2 whiteColor>
                            { Moment(item.goingDate).format('ddd DD MMM YYYY, h:mm a') }
                            </DynamicText>
                            <FontAwesomeIcon
                                style={{ marginLeft: 5, marginRight: 5  }}
                                icon={ faExchangeAlt }
                                color={ whiteColor }
                                size={ 18 }
                            />
                            <DynamicText body2 whiteColor>
                            { Moment(item.endDate).format('ddd DD MMM YYYY, h:mm a') }
                            </DynamicText>
                        </View>
                        <DynamicText style={{ alignSelf: 'center', fontSize: 16 }} body2 whiteColor>
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
            <View style={[styles.containFilter]}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ backgroundColor: fieldColor, borderRadius: 10, height: 35, flexDirection: 'row' }}>
                        <FontAwesomeIcon 
                            style={{ marginTop: 10, marginLeft: 5, marginRight: 5 }}
                            icon={ faSearch }
                            size={ 12 }
                            color={ grayColor }
                        /> 
                        <TextInput 
                            style={{ fontSize: 13, }}
                            placeholder={ t( 'resBusquedaLoc' ) }
                            placeholderTextColor={ grayColor }
                            onChangeText={ ( text ) => setLoc( text.toUpperCase() ) }
                            onSubmitEditing={ () =>  searchLoc() }
                            value={ loc }
                        />
                        { loc !== '' &&
                            <TouchableOpacity
                                onPress={ () => {
                                    setLoc( '' )
                                    setLoading( true )
                                } }
                            >
                                <FontAwesomeIcon 
                                    style={{ marginTop: 10, marginRight: 5 }}
                                    icon={ faTimesCircle }
                                    size={ 12 }
                                    color={ grayColor }
                                /> 
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ backgroundColor: fieldColor, borderRadius: 10, height: 35, flexDirection: 'row', marginLeft: 5 }}>
                        <FontAwesomeIcon 
                            style={{ marginTop: 10, marginLeft: 5, marginRight: 5 }}
                            icon={ faSearch }
                            size={ 12 }
                            color={ grayColor }
                        /> 
                        <TextInput 
                            style={{ fontSize: 13, }}
                            placeholder={ t( 'resBusquedaPasajero' ) }
                            placeholderTextColor={ grayColor }
                            onChangeText={ ( text ) => setPassengerName( text ) }
                            onSubmitEditing={ () =>  searchPassenger() }
                            value={ passengerName }
                        />
                        { passengerName !== '' &&
                            <TouchableOpacity
                                onPress={ () => {
                                    setPassengerName( '' )
                                    setLoading( true )
                                } }
                            >
                                <FontAwesomeIcon 
                                    style={{ marginTop: 10, marginRight: 5 }}
                                    icon={ faTimesCircle }
                                    size={ 12 }
                                    color={ grayColor }
                                /> 
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{ ...styles.line, backgroundColor: grayColor}} />
                    <TouchableOpacity style={styles.contentFilter}
                        onPress={ () => navigation.navigate('FilterRequestsScreen', {
                            alreadyFiltered:  calculateFiltered(),
                            beforeFiltered: dataFilter
                        }) }
                    >
                        <FontAwesomeIcon
                            icon={ faFilter }
                            size={ 16 }
                            color={ grayColor }
                            />
                        <DynamicText headline greyColor style={{marginLeft: 5}}>
                            {t('resFiltrar')}
                        </DynamicText>
                    </TouchableOpacity>
                </View>
            </View>

            { loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fieldColor }}>
                    <ActivityIndicator
                        size="large"
                        animating={ true }
                        color={ colors.primary }
                    ></ActivityIndicator>
                </View>
            }

            { bookings.length === 0 && !loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fieldColor,  }}>
                    <FontAwesomeIcon 
                        icon={ faInfoCircle }
                        size={ 30 }
                        color={ colors.primary }
                    />
                    <DynamicText fontFamily={ semibold } headline style={{ color: colors.primary, fontSize: 30 }}> No hay Datos </DynamicText>
                </View>
                
            }

            <ScrollView style={{ width: '97%', alignSelf:'center', backgroundColor: fieldColor }}>
                { !loading &&
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
    line: {
        width: 1,
        height: 14,
        marginLeft: 10
    },
    contentFilter: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10
    },
    containFilter: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },

})
