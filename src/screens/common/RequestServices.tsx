import React, { useContext, useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native';
import { Header } from '../../components/common/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import * as Animatable from 'react-native-animatable';
import { DynamicText } from '../../components/common/DynamicText';
import { useFont } from '../../hooks/common/useFont';
import { FilledInputText } from '../../components/common/FilledInputText';
import { TravelerCorporateRQ } from '../../model/classes/corporate/TravelerCorporateRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { SearchFieldTraveler } from '../../model/enums/SearchFieldTraveler';
import { corporateApi } from '../../api/corporateApi';
import { TravelerCorporate } from '../../model/classes/corporate/TravelerCorporate';
import { TravelerPolicyByIDRQ } from '../../model/classes/corporate/TravelerPolicyByIDRQ';
import { HotelParams } from '../../model/classes/corporate/HotelParams';
import { FlightParams } from '../../model/classes/corporate/FlightParams';
import { Services } from '../../model/enums/Services';
import { Information } from '../../components/common/Information';
import { CostCenter } from '../../components/common/CostCenter';
import { TravelMotive } from '../../components/common/TravelMotive';
import { TravelServices } from './TravelServices';
import { Approver } from '../../components/common/Approver';
import { TouchableOpacity } from 'react-native';
import { loginStyles } from '../../styles/loginStyles';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { ApproverListRS } from '../../model/classes/corporate/ApproverListRS';
import { GetCostCenterRS } from '../../model/classes/backoffice/GetCostCenterRS';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Passenger } from '../../model/classes/foundation/Passenger';

interface Props extends StackScreenProps<RootStackParams, 'RequestServices'> {};

export const RequestServices = ( { navigation, route }: Props) => {
    const { t } = useTranslation();
    const { width } = Dimensions.get( 'window' );
    const params = route.params;
    const { semibold } = useFont();
    const { userData, travelerRequestData, selectedTravelers } = useContext( AuthContext );
    const { assignSelectedTravelers, assignPassenger, assignSelectedServices } = useContext( AuthContext )
    const authContext = useContext( AuthContext );
    const { getTraveler, getPolicyUser } = corporateApi();
    const { theme: { colors, secondary } } = useContext( ThemeContext );
    const [passengerName, setPassengerName] = useState<string>('');
    const [passenger, setPassenger] = useState<TravelerCorporate>( new TravelerCorporate );
    const [approverInfo, setApproverInfo] = useState<boolean>(false);
    const [allowButton, setAllowButton] = useState(false);
    const [selectedServices, setSelectedServices] = useState<{ service: string, completed: boolean }[]>([]);
    const [approver, setApprover] = useState( new ApproverListRS );
    const [switchServices, setSwitchServices] = useState({
        flights: false,
        hotels: false,
        viatics: false,
        cars: false
    })
    const [costCenter, setCostCenter] = useState({
        index: -1,
        list: new GetCostCenterRS()
    })
    const allowBookingGuess = userData.BookingGuestPass;
    const allowBookingOfficialPax = userData.BookigOfficialPass;
    const canRequestOthers = allowBookingGuess || allowBookingOfficialPax;

    useEffect(() => {
        const request = setTravelerRQ();
        getTraveler( request )
            .then(( response: TravelerCorporate[] ) => {
                if ( response && response.length > 0 ) {
                    const result = response[0];
                    setPassengerName( result.FullName );
                    setPassenger( result );
                    assignSelectedTravelers( response );
                    assignPassenger( response[0].IDUser );
                    checkApprover( result ) ? getPoliciesUser() : showApproverInfo()

                }
            })
    }, [])


    useEffect(() => {
        if ( authContext.selectedTravelers.length > 0 ) {
            checkApprover( authContext.selectedTravelers[0] );
        }
    }, [ authContext?.selectedTravelers[0]?.FullName ])

    useEffect(() => {
        if ( params?.traveler ) {
            checkTravelerPermissions( params.traveler )
        }

        if ( params?.approver ) {
            setApprover( params.approver )
            checkApprover( authContext.selectedTravelers[0] );
        }
        if ( params?.costCenter !== undefined && params?.index !== undefined ) {
            setCostCenter({
                index: params.index,
                list: params.costCenter
            })
        }
    }, [params])


    useEffect(() => {
        saveServices();
    }, [switchServices])


    useEffect(() => {
        assignSelectedServices( selectedServices );
    }, [selectedServices])

    const showApproverInfo = () => {
        setApproverInfo( true );
    }

    const getPoliciesUser = () => {
        const request = setPolicyUserRQ(); 

    }

    const setPolicyUserRQ = () => {
        const request = new TravelerPolicyByIDRQ();
        request.IDUser = userData.IDUser;
        request.IdCostCenter  /*  fix tomorrow  */;
        request.IdCeco1 = 0;
        request.IdCeco2 = 0;
        request.IdCeco3 = 0;
        request.IdCeco4 = 0;
        request.IdCeco5 = 0;
        request.IdCeco6 = 0;
        request.Language = 'ES';
        request.MotiveCode = '';
        request.agentCode = userData.IDUser;
        request.service = Services.FLIGHTS;
        request.serviceCharge = 0;
        request.serviceDate = new Date();
        request.flightParams = new FlightParams();
        request.hotelParams = new HotelParams();

    }

    const checkApprover = ( passenger: TravelerCorporate ) => {
        if ( passenger.Approver1 !== '' || passenger.Approver2 !== '' || passenger.Approver3 !== '' ||
        passenger.Approver4 !== '' ) {
            setAllowButton( true )
            return true;
        }
        else {
            return false;
        }
    }

    const setTravelerRQ = (): TravelerCorporateRQ => {
        const request =  new TravelerCorporateRQ();
        request.SearchValue = userData.IDUser.toString();
        request.IDEntity = userData.IDEntityDefault;
        request.Language = 'ES';
        request.SearchField = SearchFieldTraveler.id;
        return request;
    }

    const openSearchModal = () => {
        if ( canRequestOthers ) {
            navigation.navigate( 'AutoCompleteSearch', {
                type: 'Traveler',
                screen: 'RequestServices'
            })
        }
    }

    const checkTravelerPermissions = ( result: TravelerCorporate ) => {
        if ((result.PassengerTypeCode === 1 && allowBookingOfficialPax)
            || (result.PassengerTypeCode === 2 && allowBookingGuess)) {
            assignSelectedTravelers( [result] )
            assignPassenger(result.IDUser);
            setPassengerName( result.FullName );
            setPassenger( result );
        } else {
            assignSelectedTravelers( [] );
            assignPassenger( 0 );

            /* this.toast.error({
                title: 'Error!',
                message: 'No se permite reservar para este tipo de pasajero.'
            }); */
        }
    }

    const accept = () => {
        console.log( 'travelrequestData', travelerRequestData.motive );
        if ( !travelerRequestData || !travelerRequestData.passenger ) {
            Toast.show({
                text1: '¡Error!',
                text2: 'Todos los campos son obligatorios',
                type: 'error'
            });
        } else if ( selectedTravelers[0].Approver1 === '' && selectedTravelers[0].Approver2 === '' && selectedTravelers[0].Approver3 === '' &&
            selectedTravelers[0].Approver4 === '' ) {
            Toast.show({
                text1: '¡Error!',
                text2: 'No hay un aprobador asignado.',
                type: 'error'
            });
        } else if ( travelerRequestData.motive === undefined ) {
            Toast.show({
                text1: '¡Error!',
                text2: 'No hay un motivo asignado.',
                type: 'error'
            });
        } else if ( switchServices.flights || switchServices.hotels || switchServices.viatics || switchServices.cars ) {
            navigation.navigate( authContext.selectedServices[0].service );
        } else {
            Toast.show({
                text1: 'Error!',
                text2: 'Selecciona al menos un servicio',
                type: 'error'
            })
        }
    }


    const saveServices = () => {
        const validateFlights = selectedServices.filter( serv => serv.service === 'flights' );
        const validateHotels = selectedServices.filter( serv =>  serv.service === 'hotels' );
        const validateViatics = selectedServices.filter( serv =>  serv.service === 'viatics' );
        const validateCars = selectedServices.filter( serv =>  serv.service === 'cars' );

        if ( switchServices.flights && validateFlights.length === 0 ) {
            setSelectedServices( selectServices => [ ...selectServices, { service: 'FlightSearchScreen', completed:  false  } ] )
        } else if ( !switchServices.flights && validateFlights.length > 0 ) {
            let array = selectedServices;
            let index = selectedServices.map(( item ) => {
                return item.service
            }).indexOf( 'FlightSearchScreen' );
            if ( index !== -1 ) {
                array.splice( index, 1 );
                setSelectedServices( array );
            }
        }
        if ( switchServices.hotels && validateHotels.length === 0 ) {
            setSelectedServices( selectServices => [ ...selectServices, { service: 'HotelSearchScreen', completed:  false  } ] )
        } else if ( !switchServices.hotels && validateHotels.length > 0 ) {
            let array = selectedServices;
            let index = selectedServices.map(( item ) => {
                return item.service
            }).indexOf( 'HotelSearchScreen' );
            if ( index !== -1 ) {
                array.splice( index, 1 );
                setSelectedServices( array );
            }
        }

        if ( switchServices.viatics && validateViatics.length === 0 ) {
            setSelectedServices( selectServices => [ ...selectServices, { service: 'ViaticSearchScreen', completed:  false  } ] )
        } else if ( !switchServices.viatics && validateViatics.length > 0 ) {
            let array = selectedServices;
            let index = selectedServices.map(( item ) => {
                return item.service
            }).indexOf( 'ViaticSearchScreen' );
            if ( index !== -1 ) {
                array.splice( index, 1 );
                setSelectedServices( array );
            }
        }
        if ( switchServices.cars && validateCars.length === 0 ) {
            setSelectedServices( selectServices => [ ...selectServices, { service: 'CarSearchScreen', completed:  false  } ] )
        } else if ( !switchServices.viatics && validateViatics.length > 0 ) {
            let array = selectedServices;
            let index = selectedServices.map(( item ) => {
                return item.service
            }).indexOf( 'CarSearchScreen' );
            if ( index !== -1 ) {
                array.splice( index, 1 );
                setSelectedServices( array );
            }
        }
    }

    const selectServices = ( services: { 
        flights: boolean,
        hotels: boolean,
        viatics: boolean,
        cars: boolean } ) => {
            setSwitchServices( services );
    }

    return (
        <>
           <Header 
                title={ 'Solicitud de Servicios' }
                onPressLeft={ () => {
                    navigation.goBack()
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faArrowLeft }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }

                renderRight={ () => {
                    return (
                        <ProfileNavigation color={ colors.primary } navigation={ navigation } />
                    )
                } }
            />

            { approverInfo &&
                <>
                    <Information title={ '¡Información!' } type={ 'approver' } />
                </>
            }

            <View 
                style={{ flex: 1, backgroundColor: colors.background }}
            >
                <ScrollView style={{ marginBottom: 50 }}>
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity onPress={ () => openSearchModal() }>
                            <FilledInputText 
                                disabled={ true }
                                label={ 'Pasajero' }
                                value={  passengerName }
                            />
                        </TouchableOpacity>
                        
                        <TravelMotive />
                        <Approver approver={ approver } />
                        <CostCenter idCostcenter={ passenger.IDCostCenter } costCenterData={ { costCenter: costCenter.list, index: costCenter.index } } />
                        <TravelServices selectServices={ selectServices } />
                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity
                                style={ loginStyles.signIn }
                                onPress={ () => accept() }
                            >
                                <LinearGradient
                                    colors={[colors.primary,secondary]}
                                    style={{...loginStyles.signIn, width: width * .50}}
                                >
                                    <DynamicText fontFamily={ semibold } style={[loginStyles.textSign, {
                                        color:'#fff'
                                    }]}>{ t( 'resAceptar' ) }</DynamicText>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </ScrollView>
            </View> 
            

        </>
    )
}
