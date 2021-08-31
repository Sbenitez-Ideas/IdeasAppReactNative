import React, { useContext, useEffect, useState } from 'react'
import { useWindowDimensions, View, Dimensions, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText'
import { Header } from '../../components/common/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useFont } from '../../hooks/common/useFont';
import { DynamicTextInput } from '../../components/common/DynamicTextInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { GeoLocation } from '../../model/interfaces/corporate/Geolocation';
import { CalendarComplete } from '../../components/common/CalendarComplete';
import Moment from 'moment';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { CheckBox } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { commonStyles } from '../../styles/commonStyles';
import { cabines } from '../../utils/cabines';
import { currencys } from '../../utils/currencys';
import { AuthContext } from '../../contexts/auth/AuthContext';

interface Props extends StackScreenProps<RootStackParams, 'FlightSearchScreen'>{};

export const FlightSearchScreen = ({ navigation, route }: Props ) => {
    const { t } = useTranslation();
    const { userData } = useContext( AuthContext );
    const { theme: { colors, fieldColor, secondary, whiteColor, grayColor, accent, cancelColor } } = useContext( ThemeContext );
    const {  regular, semibold } = useFont()
    const layout = useWindowDimensions();
    const { width, height } = Dimensions.get( 'window' );
    const  location = route?.params?.location;
    const typeSearch = route?.params?.typeSearch;
    const indexTab = (route?.params?.index ?  route?.params?.index : 0);
    const indexSegment = route?.params?.segmentIndex;
    const [index, setIndex] = useState( indexTab );
    const [showOptions, setShowOptions] = useState( false );
    const [calendarComplete, setCalendarComplete] = useState({
        index: -1,
        show: false
    });
    const [routes] = useState([
        { key: 'first', title: t( 'resIdaVuelta' ) },
        { key: 'second', title: t('resSoloIda') },
        { key: 'third', title: t( 'resMultidestino' ) },
    ]);
    const today = new Date();
    const [segments, setSegments] = useState({
        segments: [{
            departureLocation:  new GeoLocation(),
            arrivalLocation: new GeoLocation(),
            departureDate: today,
            arrivalDate: today,
            schedules: { arrival: {name: 'Todos', value: '3', selected: false}, departure: {name: 'Todos', value: '3', selected: false }  }
        }]
    });

    const [moreOptions, setMoreOptions] = useState({
        direct: false,
        baggage: true,
        cabine: { name: 'Economica', value: 'Economica' },
        currency: { name: 'Local', value: 'Local' },
        adults: 1,
        childrens: 0,
        babys: 0,
    })
    const [airline, setAirline] = useState('')
    const [showCabine, setShowCabine] = useState(false);
    const [showCurrency, setShowCurrency ] = useState(false);
    const [showAirline, setShowAirline] = useState(false);
    const [showSchedules, setShowSchedules ] = useState({
        show: false,
        index: -1
    });

    const [schedulesDeparture, setschedulesDeparture] = useState( [
        {
            name: t( 'resTodos' ),
            value: '3',
            selected: true
        },
        {
            name: t( 'resManhana' ),
            value: '0',
            selected: false
        },
        {
            name: t( 'resTarde' ),
            value: '1',
            selected: false
        },
        {
            name: t( 'resNoche' ),
            value: '2',
            selected: false
        },
    ] );

    const [schedulesArrival, setschedulesArrival] = useState( [
        {
            name: t( 'resTodos' ),
            value: '3',
            selected: true
        },
        {
            name: t( 'resManhana' ),
            value: '0',
            selected: false
        },
        {
            name: t( 'resTarde' ),
            value: '1',
            selected: false
        },
        {
            name: t( 'resNoche' ),
            value: '2',
            selected: false
        },
    ]);

    useEffect(() => {

        if ( location ) {
            let newArray = [ ...segments.segments ];
            console.log( 'indexSegment', indexSegment );
            switch( typeSearch ) {
                case 'departure':
                    newArray[ indexSegment as number ].departureLocation = location;
                    break;
                case 'arrival':
                    newArray[ indexSegment as number ].arrivalLocation = location;
            }
            setSegments({
                ...segments,
                segments: newArray
            });
        }
    
    }, [ route.params ])

    useEffect(() => {
        
        switch( index ) {
            
            case 0:
            case 1:
            default:
                let segment = segments.segments;
                segment.splice( 1 );
                setSegments({
                    ...segments,
                    segments: segment
                })
                break;
            case 2:
                if ( segments.segments.length === 1 ) {
                    const segment = JSON.parse( JSON.stringify( segments.segments[0] ) );
                    setSegments({
                        ...segments,
                        segments: [ ...segments.segments, segment ]
                    })
                }
                break;
            
        }

    }, [index])

    const addSegment = () => {
        const segment = JSON.parse( JSON.stringify( segments.segments[ segments.segments.length -1 ] ) );
        setSegments({
            ...segments,
            segments: [ ...segments.segments, segment ]
        })
    }

    const removeSegment = ( index: number ) => {
        if ( segments.segments.length > 2 ) {
            let segment = segments.segments;
                segment.splice( index, 1 );
                setSegments({
                    ...segments,
                    segments: segment
                })
        } else {
            Toast.show({
                text1: t( 'resInformacion' ),
                text2: t( 'resMultritrayectoDebeMinimo2Segmentos' ),
                type: 'info',
                visibilityTime: 1500
            })
        }
    }

    const showCalendarComplete = ( index: number ) => {
        setCalendarComplete({
            ...calendarComplete,
            show: !calendarComplete.show,
            index: index
        });
    }
    
    const cancelSchedules =  () => {
        setShowSchedules({
            show: !showSchedules.show,
            index: -1
        });
        setschedulesDeparture([
            {
                name: 'Todos',
                value: '3',
                selected: true
            },
            {
                name: 'Mañana',
                value: '0',
                selected: false
            },
            {
                name: 'Tarde',
                value: '1',
                selected: false
            },
            {
                name: 'Noche',
                value: '2',
                selected: false
            },
        ]);
        setschedulesArrival([
            {
                name: 'Todos',
                value: '3',
                selected: true
            },
            {
                name: 'Mañana',
                value: '0',
                selected: false
            },
            {
                name: 'Tarde',
                value: '1',
                selected: false
            },
            {
                name: 'Noche',
                value: '2',
                selected: false
            },
        ]);
    }
    const captureDates = ( dates: {  startDate: string, endDate: string }, index: number ) => {
        let newArray = [ ...segments.segments ];
        newArray[ index ].departureDate = new Date( dates.startDate );
        newArray[ index ].departureDate.setDate( newArray[ index ].departureDate .getDate() + 1 );
        newArray[ index ].arrivalDate = new Date( dates.endDate );
        newArray[ index ].arrivalDate.setDate( newArray[ index ].arrivalDate .getDate() + 1 );
        console.log( 'aqui',  newArray[ index ].departureDate );
        setSegments({
            ...segments,
            segments: newArray
        })
    }

    const showMoreOptions = () => {
        setShowOptions( !showOptions );
    }

    const showCabines = () => {
        setShowCabine( !showCabine );
    }

    const showCurrencys = () => {
        setShowCurrency( !showCurrency );
    }

    const showAllSchedules = () => {
        setShowSchedules({
            ...showSchedules,
            show: !showSchedules.show
        });
    }

    const calculateWidth = (): string => {
        switch( index ) {
            case 0:
                return '41%';
            case 1:
                return '90%';
            case 2:
                return '87%'
            default:
                return '93%';
        }
    }

    const validateFields = () => {
        segments.segments.map(( item, index ) => { 
            if ( !item.departureLocation.name || !item.arrivalLocation.name ) {
                Toast.show({
                    text1: 'Error!',
                    text2: t( 'resDebeIncluirOrigenDestino' ),
                    type: 'error',
                    visibilityTime: 1500
                });
                return true;
            } else if ( item.departureLocation.id === item.arrivalLocation.id ) {
                Toast.show({
                    text1: 'Error!',
                    text2: t( 'resOrigenDestinoDiferentes' ),
                    type: 'error',
                    visibilityTime: 1500
                });
                return true;
            }
        })

        return false;
    }

    const searchFlights = ( mode: 'price' | 'single' ) => {
        if ( !validateFields() ) {
            let arrivals = '',
                departures = '',
                dates = '',
                times = '';
            let isInternational = false;
            segments.segments.forEach( segment => {
                isInternational = !isInternational && segment.arrivalLocation.ISOCode !== 'CO';
                if ( departures ) {
                    departures += ',';
                } else {
                    departures = '';
                }
                departures += segment.departureLocation.iata;
                if ( arrivals ) {
                    arrivals != ',';
                } else {
                    arrivals = '';
                }
                arrivals += segment.arrivalLocation.iata;
                if ( dates ) {
                    dates += ',';
                } else {
                    dates = '';
                }

                const departureDate = segment.departureDate;
                dates += departureDate.getFullYear() + '-' + ( departureDate.getMonth() + 1 ) + '-' + departureDate.getDate();

                if (times) {
                    times += ',';
                } else {
                    times = '';
                }
                times += segment.schedules.departure.value;


                if ( index === 0 ) {
                    const arrivalDate = segment.arrivalDate;
                    dates += ',' + arrivalDate.getFullYear() + '-' + ( arrivalDate.getMonth() + 1 ) + '-' + arrivalDate.getDate();
                    times += ',' + segment.schedules.arrival.value;
                }
            }); 
            let baggage = 'baggage:' + ( moreOptions.baggage ? 1 : 0);
            let availableDays: string[];
            if ( isInternational ) {
                /* this.user.removeTransport(); */
                availableDays = userData.Params.IntAvailableDays ? userData.Params.IntAvailableDays.split( ',' ) : [];
            } else {
                availableDays = userData.Params.IntAvailableDays ? userData.Params.IntAvailableDays.split( ',' ) : [];
            }

            if ( availableDays.length > 0 && ( availableDays.indexOf( segments.segments[0].departureDate.getDate().toString()) === -1  ||
                    availableDays.indexOf(segments.segments[segments.segments.length - 1].arrivalDate.getDay().toString()) === -1 )) {
                Toast.show({
                    text1: t( 'resInformacion' ),
                    text2: t( 'resDiasSeleccionadoFueraDiasHabiles' ),
                    type: 'error',
                    visibilityTime: 1500
                });
            }

            console.log( 'modo', mode );
            switch( mode ) {
                
                case 'price':
                    navigation.navigate('FlightAvailabilityScreen', {
                        searchParams: {
                            adults: moreOptions.adults,
                            childrens: moreOptions.childrens,
                            babys: moreOptions.babys,
                            times: times,
                            dates: dates,
                            departures: departures,
                            arrivals: arrivals,
                            baggage: baggage,
                            cabine: moreOptions.cabine,
                            direct: moreOptions.direct,
                            language: 'ES',
                            currency: 'COP'
                        },
                        type: mode
                    });
                    break;
                case 'single':
                    navigation.navigate('FlightAvailabilityScreen', {
                        searchParams: {
                            adults: moreOptions.adults,
                            childrens: moreOptions.childrens,
                            babys: moreOptions.babys,
                            times: times,
                            dates: dates,
                            departures: departures,
                            arrivals: arrivals,
                            baggage: baggage,
                            cabine: moreOptions.cabine,
                            direct: moreOptions.direct,
                            language: 'ES',
                            currency: 'COP'
                        },
                        type: mode 
                    });
            }
        }
    }

    const showAirlines = () => {
        setShowAirline( !showAirline );
    }

    const saveSchedules = () => {
        let newArray = [ ...segments.segments ];
        schedulesArrival.map(( item, index ) => {
            if ( item.selected ) {
                newArray[ showSchedules.index ].schedules.arrival = item;
            }
        });
        schedulesDeparture.map((item, index) => {
            if ( item.selected ) {
                newArray[ showSchedules.index ].schedules.departure = item;
            }
        });
        setSegments({
            ...segments,
            segments: newArray
        });
        setShowSchedules({
            show: !showSchedules.show,
            index: -1
        });
    }

    const DepartureAndReturnRoute = () => {
        return (
            <ScrollView 
                style={{ flex: 1, backgroundColor: colors.primary, marginBottom: 10  }}
            >
                {
                    segments.segments.map(( segment, segmentIndex ) => {
                        const background = index === 2 ? '#176892' : colors.primary;
                        const marginTop = index === 2 ? 40: 0;
                        const paddingBottom = index === 2 ? 40: 0;
                        return (
                            <View key={ segmentIndex } style={{ backgroundColor: background, marginTop: marginTop, borderRadius: 10, paddingBottom: paddingBottom }}>
                                <View>
                                    { index === 2 &&
                                        <View style={[styles.contentTitle, { marginTop: 10, marginBottom: 10 }]}>
                                            <DynamicText fontFamily={ semibold } style={[ styles.text , { color: whiteColor, marginLeft: 10 } ]}  headline semibold>
                                                { `${ t( 'resTramo' ) } ${ segmentIndex + 1 }` }
                                            </DynamicText>
                                        </View>
                                    }
                                    <View style={[styles.contentTitle, { marginTop: 10, marginBottom: 10 }]}>
                                        <DynamicText fontFamily={ semibold } style={[ styles.text , { color: whiteColor, marginLeft: 10 } ]}  headline semibold>
                                            { t( 'resOrigen' ) }
                                        </DynamicText>
                                    </View>
                                    <TouchableOpacity onPress={ () => navigation.navigate( 'AutoCompleteSearch',  {
                                        type: 'Location',
                                        screen: 'FlightSearchScreen',
                                        typeSearch: 'departure',
                                        index: index,
                                        segmentIndex: segmentIndex
                                    })}>
                                        <DynamicTextInput 
                                            editable={ false }
                                            style={{ height: 45, width: '95%', alignSelf: 'center' }}
                                            styleInput={{ fontSize: 17 }}
                                            placeholder={ t( 'resIngresaCiudadOrigen' ) }
                                            value={ segment.departureLocation?.name }
                                        />
                                    </TouchableOpacity>
                                    <View style={[styles.contentTitle, {  marginTop: 10, marginBottom: 10 }]}>
                                        <DynamicText fontFamily={ semibold } style={[ styles.text , { color: whiteColor, marginLeft: 10 } ]} headline semibold>
                                            { t( 'resDestino' ) }
                                        </DynamicText>
                                    </View>
                                    <TouchableOpacity onPress={ () => navigation.navigate( 'AutoCompleteSearch',  {
                                        type: 'Location',
                                        screen: 'FlightSearchScreen',
                                        typeSearch: 'arrival',
                                        index: index,
                                        segmentIndex
                                    })}>
                                        <DynamicTextInput 
                                            style={{ height: 45, width: '95%', alignSelf: 'center' }}
                                            styleInput={{ fontSize: 17 }}
                                            placeholder={ t( 'resIngresaCiudadDestino' ) }
                                            editable={ false }
                                            value={ segment.arrivalLocation?.name }
                                        />
                                    </TouchableOpacity>
                                    
                                
                                
                                    <View style={[styles.contentTitle, {  marginTop: 10, marginBottom: 10, marginLeft: 10 }]}>
                                        <DynamicText fontFamily={ semibold } style={[ styles.text , { color: whiteColor } ]} headline semibold>
                                            { t( 'resFechas' ) }
                                        </DynamicText>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'center' }} onPress={ () => showCalendarComplete( segmentIndex ) }>
                                            <Icon 
                                                name='calendar-outline'
                                                size={ 25 }
                                                color={ colors.text }
                                                style={{ backgroundColor: fieldColor, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, paddingTop: 10, paddingLeft: 5, color: grayColor }}
                                            />
                                            <DynamicTextInput
                                                styleInput={{ fontSize: 14 }} 
                                                editable={ false }
                                                style={{ height: 45, maxWidth: calculateWidth(), borderRadius: 0, borderBottomRightRadius: 5, borderTopRightRadius: 5, marginRight: 5, alignSelf: 'center' }}
                                                placeholder={ t( 'resFechaPartida' ) }
                                                value={ Moment( segment.departureDate ).format( 'ddd DD MMM YYYY' ) }
                                            />

                                        { index === 0 &&
                                            <>
                                                <Icon 
                                                    name='calendar-outline'
                                                    size={ 25 }
                                                    color={ colors.text }
                                                    style={{ backgroundColor: fieldColor, borderBottomLeftRadius: 5, borderTopLeftRadius:  5 , paddingTop: 10, paddingLeft: 5, color: grayColor }}
                                                />
                                                <DynamicTextInput 
                                                    styleInput={{ fontSize: 14 }} 
                                                    editable={ false }
                                                    style={{ height: 45, maxWidth: '39%', borderRadius: 0, marginRight: 5,borderBottomRightRadius: 5, borderTopRightRadius: 5,  }}
                                                    placeholder={ t( 'resFechaRegreso' ) }
                                                    value={ Moment( segment.arrivalDate ).format( 'ddd DD MMM YYYY' ) } 
                                                />
                                            </>
                                            
                                        }
                                    
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.contentTitle, { marginTop: 10, marginBottom: 10, marginLeft: 10 }]}>
                                    <DynamicText fontFamily={ semibold } style={[ styles.text , { color: whiteColor } ]} headline semibold>
                                        { t( 'resHorarios' ) }
                                    </DynamicText>
                                </View>

                                <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'center' }}
                                    onPress={ () => setShowSchedules({
                                        show: !showSchedules.show,
                                        index: segmentIndex
                                    }) }
                                >
                                    <Icon 
                                        name='time-outline'
                                        size={ 25 }
                                        color={ colors.text }
                                        style={{ backgroundColor: fieldColor, borderBottomLeftRadius: 5, borderTopLeftRadius:  5 , paddingTop: 10, paddingLeft: 5, color: grayColor }}
                                    />
                                    <DynamicTextInput 
                                        styleInput={{ fontSize: 17 }} 
                                        editable={ false }
                                        style={{ height: 45, maxWidth: calculateWidth(), borderRadius: 0, marginRight: 5,borderBottomRightRadius: 5, borderTopRightRadius: 5,  }}
                                        placeholder={ t( 'resHorarioSalida' ) }
                                        value={ segment.schedules.departure.name } 
                                    />
                                    {
                                        index === 0 &&
                                        <>
                                            <Icon 
                                                name='time-outline'
                                                size={ 25 }
                                                color={ colors.text }
                                                style={{ backgroundColor: fieldColor, borderBottomLeftRadius: 5, borderTopLeftRadius:  5 , paddingTop: 10, paddingLeft: 5, color: grayColor }}
                                            />
                                            <DynamicTextInput 
                                                styleInput={{ fontSize: 17 }} 
                                                editable={ false }
                                                style={{ height: 45, maxWidth: '39%', borderRadius: 0, marginRight: 5,borderBottomRightRadius: 5, borderTopRightRadius: 5,  }}
                                                placeholder={ t( 'resHorarioRegreso' ) }
                                                value={ segment.schedules.arrival.name } 
                                            />
                                        </>
                                    }
                                </TouchableOpacity>
                                { segmentIndex > 1 &&
                                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }}
                                        onPress={ () => removeSegment( segmentIndex ) }
                                    >
                                        <DynamicText fontFamily={ semibold } style={{ color: cancelColor }}>
                                            { `- ${ t( 'resEliminarTramo' ) }` }
                                        </DynamicText>
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                    })
                    
                }
                { index === 2 &&
                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }}
                        onPress={ () => addSegment() }
                    >
                        <DynamicText fontFamily={ semibold } style={{ color: whiteColor }}>
                            { `+ ${ t( 'resAgregarTramo' ) }` }
                        </DynamicText>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 25, marginBottom: 25 }}
                    onPress={ () => showMoreOptions() }
                >
                    <Icon 
                        name='add-circle-outline'
                        size={ 20 }
                        color={ whiteColor }
                    />
                    <DynamicText fontFamily={ semibold } style={{ color: whiteColor, fontSize: 18 }}  headline semibold>
                        { t( 'resOpciones' ) }
                    </DynamicText>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center' }}>
                    <TouchableOpacity style={{ backgroundColor: accent, borderRadius: 5, marginHorizontal: 3 }}
                        onPress={ () => searchFlights( 'price' ) }
                    >
                        <DynamicText fontFamily={ semibold } style={{ margin: 5, color: colors.primary }}>{ t( 'resBuscarPrecio' ) }</DynamicText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: accent, borderRadius: 5, marginHorizontal: 3  }}
                        onPress={ () => searchFlights( 'single' ) }
                    >
                        <DynamicText fontFamily={ semibold } style={{ margin: 5, color: colors.primary }}>{ t( 'resBuscarHorario' ) }</DynamicText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: accent, borderRadius: 5, marginHorizontal: 3 }}>
                        <DynamicText fontFamily={ semibold } style={{ margin: 5, color: colors.primary }}>{ t( 'resBuscarFamily' ) }</DynamicText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
      
    const renderScene = SceneMap({
        first: DepartureAndReturnRoute,
        second: DepartureAndReturnRoute,
        third: DepartureAndReturnRoute
    });
    

    const changeSchedules = (type: 'arrival' | 'departure', index: number ) => {
        switch( type ) {
            case 'arrival':
                let arrayArrival = [...schedulesArrival];
                schedulesArrival.map(( schedule, indexScheduleArrival ) => {
                    if ( index === indexScheduleArrival ) {
                        arrayArrival[ indexScheduleArrival ].selected = true;
                    } else {
                        arrayArrival[ indexScheduleArrival ].selected = false;
                    }
                });
                setschedulesArrival( arrayArrival );
                break;
            case 'departure':
                let arrayDeparture = [...schedulesDeparture];
                schedulesDeparture.map(( schedule, indexScheduleDeparture ) => {
                    if ( index === indexScheduleDeparture ) {
                        arrayDeparture[ indexScheduleDeparture ].selected = true;
                    } else {
                        arrayDeparture[ indexScheduleDeparture ].selected = false;
                    }
                });
                setschedulesDeparture( arrayDeparture );
                break;
            default:
                break;
        }
    }

    const renderTabBar = (props: any) => {
        return (
            <TabBar
                {...props}
                renderLabel={({ route, focused, color }) => (
                    <View>
                        <DynamicText fontFamily={ semibold } style={{ color: ( focused ) ? colors.primary : 'white', fontSize: 12 }}>
                            {route.title}
                        </DynamicText>
                    </View>
                    
                )}
                activeColor={ colors.primary }
                getLabelText={({ route }) => route.title}
                indicatorStyle={{ backgroundColor: whiteColor, height: '100%', borderRadius: 5 }}
                style={{ backgroundColor: secondary, borderRadius: 10, }}
            />
        )
    }

    return (
        <View>
            <Header 
                title={ t( 'flights' ) }
                subTitle={ t( 'resEligeVuelos' ) }
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
            <View style={{ backgroundColor: fieldColor, height: '100%' }}>
                <View style={{ width: '95%', backgroundColor: colors.primary,  height: height / 1.2,  marginTop: 30, alignSelf: 'center', borderRadius: 5 }}>
                    <TabView 
                        
                        renderTabBar={renderTabBar}
                        style={{ borderRadius: 10, maxWidth: '90%', marginLeft: width / 20, marginTop: 10 }}
                        navigationState={{ index, routes }}
                        renderScene={ renderScene }
                        onIndexChange={ setIndex }
                        initialLayout={{ width: layout.width }}
                    /> 
                </View>
            </View>
            {( showSchedules.show )  &&
                <Modal
                    isVisible={true}
                    swipeDirection={['right']}
                    onSwipeComplete={ showAllSchedules }
                    style={{ alignSelf: 'center' }}
                >
                    <View style={{ borderRadius: 10, width: 330, height: 320, backgroundColor: colors.background }}>
                        <TouchableOpacity style={ commonStyles.rightButtonContainer }>
                            <Icon
                                onPress={ showAllSchedules }
                                name="close-circle"
                                color={ colors.primary }
                                size={ 30}
                            />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <DynamicText style={{ fontSize: 20, margin: 10 }}>{ t( 'resHorarioSalida' ) }</DynamicText>
                            <DynamicText style={{ fontSize: 20, margin: 10 }}>{ t( 'resHorarioRegreso' ) }</DynamicText>
                        </View>
                        <View style={{ marginLeft: 10, alignSelf: 'center', flexDirection: 'row' }}>
                            <View>
                                { schedulesDeparture.map(( item, indexDeparture ) => {
                                    return (
                                        <TouchableOpacity
                                            key={ indexDeparture }
                                            style={{ marginRight: 50, padding: 10, borderRadius: 5, backgroundColor: ( item.selected ) ? colors.primary : whiteColor }}
                                            onPress={ () => changeSchedules( 'departure' ,indexDeparture ) }
                                        >
                                            <DynamicText style={{ fontSize: 20,  color: ( item.selected ) ? whiteColor : colors.text  }}>{ item.name }</DynamicText>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            <View>
                                { schedulesArrival.map(( item, indexArrival ) => {
                                    return (
                                        <TouchableOpacity
                                            key={ indexArrival }
                                            style={{ marginRight: 30, padding: 10, borderRadius: 5, backgroundColor: ( item.selected ) ? colors.primary : whiteColor  }}
                                            onPress={ () => changeSchedules( 'arrival' ,indexArrival ) }
                                        >
                                            <DynamicText style={{ fontSize: 20, color: ( item.selected ) ? whiteColor : colors.text }}>{ item.name }</DynamicText>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 15, marginRight: 10 }}>
                            <TouchableOpacity style={[ styles.buttonSaveSchedule, { backgroundColor: colors.primary, marginRight: 10 } ]}
                                onPress={ () => saveSchedules() }
                            >
                                <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: whiteColor }}>{ t( 'resGuardar' ) }</DynamicText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[ styles.buttonSaveSchedule,  { backgroundColor: colors.primary } ]}
                                onPress={ () => cancelSchedules() }
                            >
                                <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: whiteColor }}>{ t( 'rescancelar') }</DynamicText>
                            </TouchableOpacity>
                        </View>

                    </View>

                </Modal>
            }

            { calendarComplete.show &&
                <CalendarComplete  showcalendar={ showCalendarComplete } captureDates={ captureDates }  index={ index } />
            }
            { showOptions &&
                <Modal
                    isVisible={true}
                    swipeDirection={['down']}
                    onSwipeComplete={ showMoreOptions }
                    style={styles.bottomModal}
                >
                    <View
                        style={[styles.contentFilterBottom, {backgroundColor: colors.background}]}>
                        <View style={styles.contentSwipeDown}>
                            <View style={[styles.lineSwipeDown, { backgroundColor: colors.primary }]} />
                        </View>
                        <View
                            style={[
                            styles.contentActionModalBottom,
                            {borderBottomColor: colors.border},
                            ]}>
                            <TouchableOpacity
                                onPress={ () => showMoreOptions() }
                            >
                                <DynamicText body1>{t( 'resCancelar' )}</DynamicText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() =>  showMoreOptions() }>
                                <DynamicText fontFamily={ semibold } body1 primaryColor>
                                    { t( 'resGuardar' ) }
                                </DynamicText>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.lineRow, {marginBottom: 10}]}>
                            <View style={{alignItems: 'flex-start'}}>
                                <DynamicText body1>{ t( 'resAdultos' ) }</DynamicText>
                                <DynamicText caption1 greyColor>
                                    { t( 'resApartir12Anhos' ) }
                                </DynamicText>
                            </View>
                            <View style={styles.iconRight}>
                            <TouchableOpacity
                                onPress={() => setMoreOptions({
                                    ...moreOptions,
                                    adults: moreOptions.adults - 1
                                })}
                            >
                                <Icon
                                    name="remove-circle"
                                    size={24}
                                    color={ grayColor }
                                />
                            </TouchableOpacity>
                            <DynamicText title1>{ moreOptions.adults }</DynamicText>
                            <TouchableOpacity 
                                onPress={() => setMoreOptions({
                                    ...moreOptions,
                                    adults: moreOptions.adults + 1
                                })}
                            >
                                <Icon 
                                    name="add-circle" 
                                    size={24} 
                                    color={colors.primary} 
                                />
                            </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.lineRow, {marginBottom: 10}]}>
                            <View style={{alignItems: 'flex-start'}}>
                            <DynamicText body1>{ t( 'resNinhos' ) }</DynamicText>
                            <DynamicText caption1 greyColor>
                                { t( 'resHasta12Anhos' ) }
                            </DynamicText>
                            </View>
                            <View style={styles.iconRight}>
                            <TouchableOpacity
                                onPress={() => setMoreOptions({
                                    ...moreOptions,
                                    childrens: moreOptions.childrens - 1
                                })}
                            >
                                <Icon
                                name="remove-circle"
                                size={24}
                                color={ grayColor }
                                />
                            </TouchableOpacity>
                            <DynamicText title1>{ moreOptions.childrens }</DynamicText>
                            <TouchableOpacity
                                onPress={() => setMoreOptions({
                                    ...moreOptions,
                                    childrens: moreOptions.childrens + 1
                                })}
                            >
                                <Icon 
                                    name="add-circle" 
                                    size={24} 
                                    color={colors.primary} 
                                />
                            </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.lineRow, {marginBottom: 10}]}>
                            <View style={{alignItems: 'flex-start'}}>
                            <DynamicText body1>{ t( 'resInfantes' ) }</DynamicText>
                            <DynamicText caption1 greyColor>
                                { t( 'resHasta2Anhos' ) }
                            </DynamicText>
                            </View>
                            <View style={styles.iconRight}>
                            <TouchableOpacity
                                onPress={() => setMoreOptions({
                                    ...moreOptions,
                                    babys: moreOptions.babys - 1
                                })}
                            >
                                <Icon
                                    name="remove-circle"
                                    size={24}
                                    color={ grayColor }
                                />
                            </TouchableOpacity>
                            <DynamicText title1>{ moreOptions.babys }</DynamicText>
                            <TouchableOpacity
                                onPress={() => setMoreOptions({
                                    ...moreOptions,
                                    babys: moreOptions.babys + 1
                                })}
                            >
                                <Icon name="add-circle" size={24} color={colors.primary} />
                            </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: grayColor }}>
                            <View style={{alignItems: 'flex-start', marginBottom: 10}}>
                                <DynamicText fontFamily={ semibold } body1>{ t( 'resFiltrosVuelos' ) }</DynamicText>
                            </View>
                        </View>
                        <View style={[styles.lineRow]}>
                            <View style={{alignItems: 'flex-start', marginTop: 5}}>
                                <DynamicText body1>{ t( 'resVuelosDirectos' ) }</DynamicText>
                                <DynamicText caption1 greyColor>
                                    { t( 'resBusquedaVuelosSoloDirectos' ) }
                                </DynamicText>
                            </View>
                            <View style={{ justifyContent: 'flex-end' }}>
                                <CheckBox 
                                    style={{ backgroundColor: 'red' }}
                                    checked={ moreOptions.direct }
                                    onPress={ () => setMoreOptions({
                                        ...moreOptions,
                                        direct: !moreOptions.direct
                                    }) }
                                    size={ 30 }
                                />
                            </View>
                        </View>
                        <View style={[styles.lineRow]}>
                            <View style={{alignItems: 'flex-start', marginTop: 5}}>
                                <DynamicText body1>{ t( 'resVuelosConEquipaje' ) }</DynamicText>
                                <DynamicText caption1 greyColor>
                                    { t( 'resBusquedaSoloEquipaje' ) }
                                </DynamicText>
                            </View>
                            <View style={{ justifyContent: 'flex-end' }}>
                                <CheckBox 
                                    checked={ moreOptions.baggage }
                                    onPress={ () => setMoreOptions({
                                        ...moreOptions,
                                        baggage: !moreOptions.baggage
                                    }) }
                                    size={ 30 }
                                />
                            </View>
                        </View>
                        <View style={[styles.lineRow, {marginBottom: 10}]}>
                            <View style={{alignItems: 'flex-start'}}>
                            <DynamicText body1>{t( 'resCabina' )}</DynamicText>
                            <DynamicText caption1 greyColor>
                                { t( 'resEligeCabina' ) }
                            </DynamicText>
                            </View>
                            <TouchableOpacity style={{ justifyContent: 'flex-end', flexDirection: 'row' }}
                                onPress={ () => setShowCabine( !showCabine ) }
                            >
                                <TextInput 
                                    editable={ false }
                                    style={{ backgroundColor: fieldColor, width: 180, borderRadius: 10, fontSize: 15 }}
                                    value={ moreOptions.cabine.name }
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.lineRow, {marginBottom: 10, marginTop: 10}]}>
                            <View style={{alignItems: 'flex-start'}}>
                                <DynamicText body1>{ t( 'resAerolinea' ) }</DynamicText>
                                <DynamicText caption1 greyColor>
                                    { t( 'resEligeAreolinea' ) }
                                </DynamicText>
                            </View>
                            <TouchableOpacity style={{ justifyContent: 'flex-end', flexDirection: 'row' }}
                                onPress={ () => showAirlines() }
                            >
                                <Icon 
                                    name='airplane-outline'
                                    size={ 25 }
                                    color={ colors.text }
                                    style={{ backgroundColor: fieldColor, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, paddingTop: 10, paddingLeft: 5, color: grayColor }}
                                />
                                <TextInput 
                                    editable={ false }
                                    style={{ backgroundColor: fieldColor, width: 150, borderTopRightRadius: 10, borderBottomRightRadius: 10, fontSize: 18 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.lineRow, {marginBottom: 10}]}>
                            <View style={{alignItems: 'flex-start'}}>
                            <DynamicText body1>{'Moneda'}</DynamicText>
                            <DynamicText caption1 greyColor>
                                { t( 'resEligeMoneda' ) }
                            </DynamicText>
                            </View>
                            <TouchableOpacity style={{ justifyContent: 'flex-end', flexDirection: 'row' }}
                                onPress={ () => showCurrencys() }
                            >
                                <TextInput 
                                    editable={ false }
                                    style={{ backgroundColor: fieldColor, width: 180, borderRadius: 10, fontSize: 15 }}
                                    value={ moreOptions.currency.name }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
            { (showCabine && showOptions)  &&
                <Modal
                    isVisible={true}
                    swipeDirection={['right']}
                    onSwipeComplete={ showCabines }
                    style={{ alignSelf: 'center' }}
                >
                    <View style={{ borderRadius: 10, width: 300, height: 210, backgroundColor: colors.background}}>
                        <View style={ commonStyles.rightButtonContainer }>
                            <Icon
                                onPress={showCabines }
                                name="close-circle"
                                color={ colors.primary }
                                size={ 30}
                            />
                        </View>
                        <View style={{ marginLeft: 10, marginBottom: 20 }}>
                            { cabines.map(( item, index ) => {
                                return (
                                    <TouchableOpacity
                                        style={{ marginBottom: 10 }}
                                        key={ index }
                                        onPress={ () =>  {
                                            setMoreOptions({
                                                ...moreOptions,
                                                cabine: item
                                            })
                                            setShowCabine( !showCabine )
                                        }}
                                    >
                                        <DynamicText style={{ fontSize: 20 }}>{ item.name }</DynamicText>
                                    </TouchableOpacity>
                                )
                            })

                            }
                        </View>

                    </View>

                </Modal>
            }
            {(showCurrency && showOptions)  &&
                <Modal
                    isVisible={true}
                    swipeDirection={['right']}
                    onSwipeComplete={ showCurrencys }
                    style={{ alignSelf: 'center' }}
                >
                    <View style={{ borderRadius: 10, width: 300, height: 120, backgroundColor: colors.background}}>
                        <TouchableOpacity style={ commonStyles.rightButtonContainer }>
                            <Icon
                                onPress={ showCurrencys }
                                name="close-circle"
                                color={ colors.primary }
                                size={ 30}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10, marginBottom: 20 }}>
                            { currencys.map(( item, index ) => {
                                return (
                                    <TouchableOpacity
                                        style={{ marginBottom: 10 }}
                                        key={ index }
                                        onPress={ () =>  {
                                            setMoreOptions({
                                                ...moreOptions,
                                                currency: item
                                            })
                                            setShowCurrency( !showCurrency )
                                        }}
                                    >
                                        <DynamicText style={{ fontSize: 20 }}>{ item.name }</DynamicText>
                                    </TouchableOpacity>
                                )
                            })

                            }
                        </View>

                    </View>

                </Modal>
            }
            { /* (showAirline && showOptions)  &&
                <Modal
                    isVisible={ showAirline }
                    backdropTransitionOutTiming={0}
                    onBackdropPress={() => setShowAirline( !showAirline  ) }
                    onModalHide={() => setAirline( '' )}
                    onBackButtonPress={() => setShowAirline( !showAirline ) }
                    animationIn={'zoomIn'}
                    animationOut={'zoomOut'}
                >
                    <View style={[styles.modalContent]}>
                        <View style={styles.header}>
                            <TextInput
                                style={styles.inputText}
                                placeholder={ 'Busca tu aerolinea' }
                                onChangeText={(text) => {
                                    findCity( text )
                                }}
                                value={ airline }
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowAirline( !showAirline )}
                            >
                                <DynamicText style={styles.closeButtonText}>×</DynamicText>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            style={styles.list}
                            data={ airlines }
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={[styles.item]}
                                    onPress={() => {
                                        calculateSetData( item );
                                    }}>
                                    <DynamicText style={[styles.itemText ]}>
                                        {item.name}
                                    </DynamicText>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </Modal>
            */}
        </View>        
    )
}


const styles = StyleSheet.create({
    text: {
        fontSize: 20
    },
    contain: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 150
    },
    contentTitle: {
        alignItems: 'flex-start',
        width: '100%',
        height: 32,
        justifyContent: 'center',
    },
    contentFilterBottom: {
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 20,
    },
    contentActionModalBottom: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginBottom: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
    },
    lineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    iconRight: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentSwipeDown: {
        paddingTop: 10,
        alignItems: 'center',
      },
    lineSwipeDown: {
        width: 30,
        height: 2.5,
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    buttonSaveSchedule: {
        padding: 10,
        borderRadius: 10,
    },
    modalContent: {
        backgroundColor: "white",
        padding: 10
    },
    closeButton: {
        width: 40,
        padding: 5,
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputText: {
        width: "100%",
        paddingLeft: 10,
        paddingBottom: 5,
        flex: 1,
        borderBottomWidth: 1,
        borderColor: "#c7c7c7"
    },
    list: {
        width: '100%',
        marginVertical: 10
    },
    item: {
        padding: 10
    },
    itemText: {
        fontSize: 18
    },
    header: {
        flexDirection: 'row'
    },
})