import React, { useContext, useEffect, useState } from 'react'
import { ImageBackground, View, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { Header } from '../../components/common/Header';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faEdit, faFilter, faSearch, faTimesCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'MyServicesScreen'>{};

export const MyServicesScreen = ({ navigation, route }: Props) => {
    const [loading, setLoading] = useState( true );
    const { semibold, bold } = useFont();
    const { t } = useTranslation();
    const [response, setResponse] = useState<BookingsRS>( new BookingsRS );
    const [bookings, setBookings] = useState<Booking[]>([])
    const [editServiceName, setEditServiceName] = useState({
        edit: false,
        index: -1
    });
    const { theme: { colors, whiteColor, grayColor, fieldColor, } } = useContext( ThemeContext );
    const { userData } = useContext( AuthContext );
    const { getBookings } = flightsApi();
    const [changeName, setChangeName] = useState({
        name: '',
        index: -1
    })
    const dataFilter = route?.params?.dataFilter;
    const [loc, setLoc] = useState<string>('');
    useEffect(() => {
        getBooking();
    }, [])


    const getBooking = () => {
        setLoading( true );
        setResponse( new BookingsRS );
        setBookings( [] );
        const request = new BookingsRQ( userData.IDUser, userData.IDEntityDefault );
        request.pageIndex = 1;
        request.showOwnedValue = true;
        request.showApproverValue = false;
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

    useEffect(() => {
        getBooking();
        if ( dataFilter?.dateStart !== undefined || dataFilter?.flow !== undefined || dataFilter?.state !== undefined ) {
            Toast.show({
                text1: t( 'resFiltrosAplicados' ),
                type: 'success',
                visibilityTime: 2000,
            });
        }
    }, [ dataFilter ])

    useEffect(() => {
        if ( loc === '' ) {
            console.log( 'entro effect' );
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
    }, [loc])

    useEffect(() => {
        setBookingsData()
    }, [response.Data])

    useEffect(() => {
    }, [bookings])

    const setBookingsData = () => {
        const tempBookings: Booking[] = [];
        if( response ) {
            response?.Data?.forEach( booking => {
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
            });
            setBookings( tempBookings );
        }        
    }

    const navigateReview = ( item: Booking ) => {
        if ( !editServiceName.edit ) {
            navigation.navigate( 'ReviewScreen', {
                booking: item
            })
        }
    }

    const editName = ( index: number ) => {
        setEditServiceName({
            ...editServiceName,
            edit: !editServiceName.edit,
            index: index

        });
    }

    const searchLoc = () => {
        setLoading( true );
        const request = new BookingsRQ( userData.IDUser, userData.IDEntityDefault );
        request.pageIndex = 1;
        request.showOwnedValue = true;
        request.showApproverValue = false;
        request.period = '12M';
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


    const calculateFiltered = () => {
        let alreadyCalculated = false;
        if ( dataFilter ) {
            if ( dataFilter?.dateStart !== '' || dataFilter?.state !== 0 || dataFilter.flow !== '') {
                alreadyCalculated = true;
            }
        }
        return alreadyCalculated;
    }


    return (
        <>
            <Header 
                title={ t( 'resMisServicios' ) }
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

            <View style={[styles.contain]}>
                <View style={{ backgroundColor: fieldColor, borderRadius: 10, height: 35, flexDirection: 'row' }}>
                    <FontAwesomeIcon 
                        style={{ marginTop: 10, marginLeft: 5, marginRight: 10}}
                        icon={ faSearch }
                        size={ 12 }
                        color={ grayColor }
                    /> 
                    <TextInput 
                        style={{ fontSize: 13, color: grayColor }}
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
                                style={{ marginTop: 10, marginRight: 10}}
                                icon={ faTimesCircle }
                                size={ 12 }
                                color={ grayColor }
                            /> 
                        </TouchableOpacity>
                    }
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

            { bookings.length === 0 && !loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fieldColor,  }}>
                    <FontAwesomeIcon 
                        icon={ faInfoCircle }
                        size={ 30 }
                        color={ colors.primary }
                    />
                    <DynamicText fontFamily={ semibold } headline style={{ color: colors.primary, fontSize: 30 }}>{ t( 'resNoDatos' ) }</DynamicText>
                </View>
                
            }

            <ScrollView style={{ backgroundColor: fieldColor }}>
                { !loading &&
                    bookings.map(( item, index ) => {
                        const bottomPadding: number = ( bookings.length  === ( index + 1 )) ? 60 : 0; 
                    
                        return (
                            <TouchableOpacity
                                key={ index } 
                                style={{ width: '90%', alignSelf: 'center', marginTop: 20, paddingBottom: bottomPadding }} 
                                activeOpacity={ .7 }
                                onPress={ () => navigateReview( item ) }
                            >
                                <ImageBackground source={{ uri: item.destinationImage }}   
                                    style={{ 
                                        height: 220,
                                        width: '100%',
                                    }}
                                    imageStyle={{ borderRadius: 10 }}
                                    
                                >
                                    <View style={{ justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row' }}> 
                                        <DynamicText fontFamily={ semibold } style={{ color: whiteColor  }}> { item.loc } </DynamicText>
                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <DynamicText>{ item.products }</DynamicText> */}
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
                                            {/* <FontAwesomeIcon 
                                                style={{ marginLeft: 10 }}
                                                icon={ getServiceIcon( item.products ) }
                                                size={ 20 }
                                                color={ whiteColor }
                                            /> */}
                                        </View>
                                    </View>
                                    <View style={{ maxWidth: '90%', height: 70, justifyContent: 'center', marginLeft: 10, alignSelf: 'center', flexDirection: 'row' }}>
                                        <TextInput
                                            underlineColorAndroid={ ( editServiceName.index === index && editServiceName.edit ) ? whiteColor : 'transparent' }
                                            onChangeText={ ( text ) =>  setChangeName({
                                                name: text,
                                                index: index
                                            }) }
                                            style={{ color: whiteColor, fontSize: 25, fontFamily: semibold }}
                                            editable={ editServiceName.edit && editServiceName.index === index }
                                            value={  (editServiceName.edit && editServiceName.index === index) ? changeName.name : item.rute }
                                        /> 
                                        { (( !editServiceName.edit || editServiceName.index !== index ) && ( item.rute !== '' )) &&
                                            <TouchableOpacity onPress={ () => editName( index ) }>
                                                <FontAwesomeIcon 
                                                    icon={ faEdit }
                                                    size={ 20 }
                                                    style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 25 }}
                                                    color={ fieldColor }
                                                />
                                            </TouchableOpacity>
                                        } 
                                    </View>
                                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginLeft: 10 }}>
                                        { (editServiceName.edit  && editServiceName.index === index) &&
                                            <View style={{ flexDirection: 'row', marginRight: 5 }}>
                                                <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 5, marginRight: 5 }}>
                                                    <DynamicText fontFamily={ bold } style={{ color: whiteColor, padding: 5 }}>{ t( 'resGuardar' ) }</DynamicText>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{ backgroundColor: colors.primary, borderRadius: 5 }}
                                                    onPress={ () => {
                                                            setEditServiceName({
                                                                ...editServiceName,
                                                                edit: !editServiceName.edit,
                                                                index: -1
                                                            }) 
                                                            setChangeName({
                                                                name: '',
                                                                index: -1
                                                            })
                                                        }
                                                    }
                                                >
                                                    <DynamicText fontFamily={ bold } style={{ color: whiteColor, padding: 5 }}>{ t( 'resCancelar' ) }</DynamicText>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        { ((!editServiceName.edit || editServiceName.index !== index) && ( item.rute === '' )) &&
                                            <TouchableOpacity onPress={ () => editName( index ) }>
                                                <FontAwesomeIcon 
                                                    icon={ faEdit }
                                                    size={ 20 }
                                                    style={{ alignSelf: 'flex-end', marginRight: 10 }}
                                                    color={ fieldColor }
                                                />
                                            </TouchableOpacity>
                                        }
                                        
                                    </View>
                                    
                                    
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <View>
                                            <DynamicText fontFamily={ bold } style={{ color: whiteColor, marginLeft: 5, marginTop: 30, fontSize: 15 }}> { item.passengers } </DynamicText>
                                            <DynamicText fontFamily={ bold } style={{ marginLeft: 10, color: whiteColor, fontSize: 15 }}>{ Moment(item.goingDate).format('ddd DD MMM YYYY, h:mm a') }</DynamicText>
                                        </View>
                                        <View>
                                            <DynamicText fontFamily={ bold } style={{ color: whiteColor, marginTop: 40, paddingHorizontal: 7 }}> { t( setStateBookingList( item.state ) )  } </DynamicText>
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

const styles = StyleSheet.create({
    contain: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
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

})