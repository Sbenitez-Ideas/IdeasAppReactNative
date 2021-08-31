import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useEffect, useState } from 'react'
import { Text, View, StyleSheet, Dimensions, Image, Platform, ActivityIndicator } from 'react-native';
import { RootStackParams } from '../../navigator/Navigator'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faExclamationCircle, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { EnhancedRetrieveInternalRQ } from '../../model/classes/common/EnhancedRetrieveInternalRQ';
import { commonApi } from '../../api/commonApi';
import { EnhancedRetrieveRS } from '../../model/classes/common/EnhancedRetrieveRS';
import { RetrieveRS } from '../../model/classes/flights/envelopes/RetrieveRS';
import { TravelerCorporate } from '../../model/classes/corporate/TravelerCorporate';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { RetrieveData } from '../../model/interfaces/corporate/RetrieveData';
import { HotelOfflineRequest } from '../../model/interfaces/hotel/HotelOfflineRequest';
import { GeoLocation } from '../../model/interfaces/corporate/Geolocation';
import { ExpenseAdvanceDefaultRS } from '../../model/classes/expenses/ExpenseAdvanceDefaultRS';
import { RequestExpenses } from '../../model/interfaces/expenses/RequestExpenses';
import * as Animatable from 'react-native-animatable';
import { DynamicText } from '../../components/common/DynamicText';
import { commonStyles } from '../../styles/commonStyles';
import { useFont } from '../../hooks/common/useFont';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';
import { setStateRetrieve } from '../../helpers/bookings/setStateRetrieve';
import NumberFormat from 'react-number-format';
import { ReviewFlightScreen } from './review-flight/ReviewFlightScreen';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { ReviewHotelScreen } from './review-hotel/ReviewHotelScreen';
import { ReviewViaticsScreen } from './review-viatics/ReviewViaticsScreen';
import { DynamicTextInput } from '../../components/common/DynamicTextInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { SetStatusCorporateRQ } from '../../model/classes/corporate/SetStatusCorporateRQ';
import { corporateApi } from '../../api/corporateApi';
import Toast from 'react-native-toast-message';
import { JustificationModalScreen } from '../common/JustificationModalScreen';
import { AdditionalFields } from '../common/AdditionalFields';
import { CostCenterInfo } from '../common/CostCenterInfo';
import { ResumeScreen } from './ResumeScreen';
import { FloatingMenu } from 'react-native-floating-action-menu';
import { ApproversScreen } from './ApproversScreen';



interface Props extends StackScreenProps<RootStackParams, 'ReviewScreen'>{};

const { width } = Dimensions.get('window');
const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 250;
export const ReviewScreen = ({ navigation, route }: Props ) => {
    const routes = navigation.dangerouslyGetState().routes;
    const showAdditionalFields = ( routes[ routes.length - 2 ].name === 'BookingListScreen') ? true : false;
    const [loading, setLoading] = useState( true );
    const { loc, products, booking, typeScreen } = route.params;
    const { getInternalRetrieve } = commonApi();
    const { changeStatusBooking } = corporateApi();
    const { t } = useTranslation();
    const { semibold } = useFont();
    const { userData:{ IDUser, IDEntityDefault } } = useContext( AuthContext );
    const { theme: { colors, whiteColor, fieldColor, grayColor, accent, secondary } } = useContext( ThemeContext );
    const [retrieveRS, setRetrieveRS] = useState<EnhancedRetrieveRS>( new EnhancedRetrieveRS);
    const [traveler, setTraveler] = useState<TravelerCorporate>( new TravelerCorporate );
    const [travelers, setTravelers ] = useState<TravelerCorporate[]>( [] );
    const [isApprover, setIsApprover] = useState<boolean>();
    const [status, setStatus] = useState('');
    const [viatic, setViatic] = useState<RequestExpenses>( new RequestExpenses );
    const [hideHeader, setHideHeader] = useState(false);
    const [statusCorporate, setStatusCorporate] = useState('');
    const [hotel, setHotels] = useState<HotelOfflineRequest[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showFlights, setShowFlights] = useState(false);
    const [type, setType] = useState<'justification' | 'policy' | 'hotel'>();
    const [motive, setMotive] = useState({
        ID: '',
        Text: ''
    });
    const [retrieveData, setRetrieveData] = useState<RetrieveData>();
    const [costCenter, setCostCenter] = useState<{ 
        costCenter: string,
        percentage: number,
        index: number,
        percentageIndex: number,
        availableBudget: number,
        budgetSrc: string,
        budget: number,
        costCenterName: string,
    }[]>([]);
    const [showItems, setShowItems] = useState(false);
    const [retrieveResponse, setRetrieveResponse] = useState<RetrieveRS>( new RetrieveRS );
    const items = [
        { 
            label: t( 'resAprobar' ), 
            labelStyle: styles.labelMenu, 
            fa: faThumbsUp, 
            onPress: () => approve( true ),
        },
        { 
            label: t( 'resRechazar' ), 
            labelStyle: styles.labelMenu, 
            fa: faThumbsDown, 
            onPress: () => approve( false ),
        },
    ];
    useEffect(() => {
        navigation.setOptions({  headerRight: ()  => (
            <ProfileNavigation color={ whiteColor } navigation={ navigation } />
        ) })        
        if ( loc ) {
            const request = new EnhancedRetrieveInternalRQ();
            request.RecordLocator = loc;
            request.Language = 'ES';
            getRetrieveInternal( request );
        } else if ( booking ) {
            const request = new EnhancedRetrieveInternalRQ();
            request.RecordLocator = booking.loc;
            request.Language = 'ES';
            getRetrieveInternal( request );
        }

    }, [])

    useEffect(() => {

        if ( showModal ) {
            navigation.setOptions({
                headerShown: false
            })
        }
        else {
            navigation.setOptions({
                headerShown: true
            })
        }
        
    }, [ showModal ])

    /* useEffect(() => {
        if (retrieveResponse.Segments !== undefined) {
            setShowFlights( true );
        }
    }, [retrieveResponse.Segments !== undefined]) */

    useEffect(() => {
        
        if ( retrieveRS.BookingCode ) {
            getTravelers();
            getCostCenter();
            getApprovers();
            getRetrieveData();
            setMotive({
                ID: retrieveRS.CorporateBookingInfo && retrieveRS.CorporateBookingInfo.CorporateFlowInfo ?
                    retrieveRS.CorporateBookingInfo.CorporateFlowInfo.IDReason : '',
                Text: retrieveRS.CorporateBookingInfo &&
                        retrieveRS.CorporateBookingInfo.CorporateFlowInfo ?
                    retrieveRS.CorporateBookingInfo.CorporateFlowInfo.ReasonText : ''
            });
            setStatus( retrieveRS.FlightsRetrieve && retrieveRS.FlightsRetrieve.length > 0 ?
                retrieveRS.FlightsRetrieve[0].StatusId : retrieveRS.Status.toString() );
            setStatusCorporate( retrieveRS.CorporateBookingInfo ?
                (retrieveRS.CorporateBookingInfo.CorporateFlowInfo ?
                    retrieveRS.CorporateBookingInfo.CorporateFlowInfo.Status : '') : '' );
                    
            if (retrieveRS.FlightsRetrieve && retrieveRS.FlightsRetrieve.length > 0) {
                setRetrieveResponse(retrieveRS.FlightsRetrieve[0]);
            }

            if (retrieveRS.CorporateBookingInfo) {
                if (retrieveRS.CorporateBookingInfo.OfflineHotelsBasic &&
                    retrieveRS.CorporateBookingInfo.OfflineHotelsBasic.length > 0) {
                    setHotel();
                }

                /// Object Expense
                if (retrieveRS.CorporateBookingInfo.AdvanceRetrieve &&
                        retrieveRS.CorporateBookingInfo.AdvanceRetrieve.TravelExpenses &&
                        retrieveRS.CorporateBookingInfo.AdvanceRetrieve.TravelExpenses.ApprovedValue !== 0) {
                    setViatics();
                }

                /*  /// Object Transport
                if (retrieveRS.CorporateBookingInfo.AdvanceRetrieve &&
                        retrieveRS.CorporateBookingInfo.AdvanceRetrieve.GroundServices
                        && retrieveRS.CorporateBookingInfo.AdvanceRetrieve.GroundServices.length > 0) {
                    setTransport();
                }

                /// Object Special
                if (retrieveRS.CorporateBookingInfo.SpecialTransport &&
                    retrieveRS.CorporateBookingInfo.SpecialTransport.DetailsTransp.length > 0) {
                    setSpecialTransport();
                } */
            }

        }
    }, [retrieveRS])

    const getRetrieveInternal = ( request: EnhancedRetrieveInternalRQ ) => {
        getInternalRetrieve( request )
            .then(( response ) => {
                setRetrieveRS( response );
                setLoading( false );
            },
            ( error ) => {
                console.error( error );
                setLoading( false );
            });
    }

    const handleMenuToggle = () => {
        setShowItems( !showItems )
    }

    const justified = ( confirm: boolean, value?: string ) => {
        if ( confirm ) {
            setShowModal( false );
            changeBookingStatus( setStatusCorporateRQ( 3, value as string ) );
            navigation.navigate( routes[ routes.length - 2 ].name );
        } else {
            setShowModal( false );
        }
    }
    
    const getRetrieveData = () => {
        if ( retrieveRS ) {
            setRetrieveData({
                locator:  retrieveRS.InternalRecordLocator,
                bookingCode: retrieveRS.BookingCode,
                bookingDate: retrieveRS.BookingDate,
                status: retrieveRS.FlightsRetrieve && retrieveRS.FlightsRetrieve.length > 0 ?
                    retrieveRS.FlightsRetrieve[0].StatusId : retrieveRS.Status.toString(),
                statusFlowC: retrieveRS.CorporateBookingInfo &&
                        retrieveRS.CorporateBookingInfo.CorporateFlowInfo ?
                    retrieveRS.CorporateBookingInfo.CorporateFlowInfo.Status : ''
            }); 
        }
    }

    const getApprovers = () => {
        const approver = retrieveRS.CorporateBookingInfo && retrieveRS.CorporateBookingInfo.ApproverList ?
            retrieveRS.CorporateBookingInfo.ApproverList.find(
                (app) => app.IDApproverUser === IDUser )
            : null;
        if (approver) {
            setIsApprover( true );
        }
    }

    const getTravelers = () => {
        if ( retrieveResponse && retrieveResponse.Passengers && retrieveResponse.Passengers.length > 0 ) {
            setTraveler( retrieveResponse.Passengers[0] as any );
            setTravelers( retrieveResponse.Passengers as any[] );
        } else if ( retrieveRS && retrieveRS.CorporateBookingInfo &&
                    retrieveRS.CorporateBookingInfo.Passengers ) {
            setTraveler( retrieveRS.CorporateBookingInfo.Passengers[0] as any );
            setTravelers( retrieveRS.CorporateBookingInfo.Passengers as any[] );
        } else if (retrieveRS && retrieveRS.FlightsRetrieve && retrieveRS.FlightsRetrieve.length > 0) {
            setTraveler( retrieveRS.FlightsRetrieve[0].Passengers[0] as any );
            setTravelers( retrieveRS.FlightsRetrieve[0].Passengers as any[] );
        }
    }


    const getCostCenter = () => {
        if ( retrieveRS.CorporateBookingInfo && retrieveRS.CorporateBookingInfo.CostCenterList ) {
            retrieveRS.CorporateBookingInfo.CostCenterList.forEach((cc, i) => {
                const budgetInfo: number = retrieveRS.CorporateBookingInfo.InfoBudget &&
                    retrieveRS.CorporateBookingInfo.InfoBudget.length > 0 &&
                    retrieveRS.CorporateBookingInfo.InfoBudget[i] &&
                    retrieveRS.CorporateBookingInfo.InfoBudget[i].BudgetAvailable &&
                    retrieveRS.CorporateBookingInfo.InfoBudget[i].BudgetAvailable.length > 0 &&
                    retrieveRS.CorporateBookingInfo.InfoBudget[i].BudgetAvailable[0] ?
                        parseInt(
                            retrieveRS.CorporateBookingInfo.InfoBudget[i].BudgetAvailable[0].Value.split(' ')[1],
                            10
                        ) : 0;
                costCenter.push({
                    availableBudget: 0,
                    budget: budgetInfo,
                    budgetSrc: '',
                    costCenter: cc.IDCostCenter.toString(),
                    costCenterName: cc.Name,
                    index: i,
                    percentage: 0,
                    percentageIndex: 0
                });
            });
        }
    }


    /* const setFlights = () => {
        const pricing: PricingSingleRS = new PricingSingleRS;
        pricing.CorporateBookingInfo = retrieveResponse.CorporateBookingInfo;
        pricing.CorporateParams = retrieveResponse.CorporateParams;
        pricing.PricingBySource = [new PricingRS()];
        pricing.PricingBySource[0].Segments = retrieveResponse.Segments;
        pricing.PricingBySource[0].TotalFare = retrieveResponse.TotalFare;

        setFlight( pricing );
        
        if ( flight ) {
            setShowFlights( true )
        }
    } */

    const setHotel = () => {
        retrieveRS.CorporateBookingInfo.OfflineHotelsBasic.forEach((item) => {
            const hot: HotelOfflineRequest = {
                location: {
                    ISOCode: item.cityIATA,
                    iataCity: item.cityIATA,
                    name: item.City,
                    iata: item.cityIATA,
                    id: 0,
                    locationType: 'city',
                    score: 5,
                    stateName: '',
                    type: 'hotel'
                },
                checkIn: item.CheckIn,
                checkOut: item.CheckOut,
                onFamily: item.FamilyAccomodation,
                payInDestiny: item.PaymentDestination,
                hotel: {
                    Address: item.City,
                    City: item.City,
                    StarLevel: (item.Hotels.length > 0 && item.Hotels[0].Category) ?
                        parseInt(item.Hotels[0].Category, 10) : 0,
                    Fare: (item.Hotels.length > 0 && item.Hotels[0].Value) ? item.Hotels[0].Value : 0,
                    FeedingType: '',
                    ID: (item.Hotels.length > 0 && item.Hotels[0].ID) ? item.Hotels[0].ID : 0,
                    IDEntity: IDEntityDefault,
                    IDGeon: 0,
                    Name: (item.Hotels.length > 0 && item.Hotels[0].Name) ? item.Hotels[0].Name : '',
                    Phone: '',
                    Policy: '',
                    RoomType: '',
                    Zone: item.City,
                    Longitude: 0,
                    Latitude: 0,
                    FeeHotel: (item.Hotels.length > 0 && item.Hotels[0].FeeHotel) ? item.Hotels[0].FeeHotel : 0,
                    FeeCurrencyHotel: (item.Hotels.length > 0 && item.Hotels[0].FeeCurrencyHotel) ?
                    item.Hotels[0].FeeCurrencyHotel : ''
                },
                otherHotel: item.OtherHotel,
                minDate: null,
                maxDate: null,
                observations: item.Notes,
                observationHint: '',
                listHotels: [],
                hotels: null,
                stars: Array(item.Hotels.length > 0 && item.Hotels[0].Category !== '' ?
                        parseInt(item.Hotels[0].Category, 10) : 0)
                    .fill(item.Hotels.length > 0 && item.Hotels[0].Category !== '' ?
                        parseInt(item.Hotels[0].Category, 10) : 0),
                locationCountry: '',
                valueOtherHotel: item.FareOtherHotel,
                days: (((new Date(item.CheckOut)).getTime() - (new Date(item.CheckIn)).getTime()) / 86400000),
                valuePayDestiny: item.FareOtherHotel,
                valueFamily: item.FareOtherHotel,
                currency: retrieveRS.CorporateBookingInfo.International ? 'USD' : 'COP',
                expenseInfo: null,
                international: retrieveRS.CorporateBookingInfo.International,
                feeValueOtherHotel: (item.FeeHotel) ? item.FeeHotel : 0,
                currencyFee: (item.FeeCurrencyHotel) ? item.FeeCurrencyHotel : ''
            };
            hot.valueOtherHotel = hot.valueOtherHotel;
            setHotels( hotel => [ ...hotel, hot ] );
        });
    }


    

    const setViatics = () => {
        const aditionalFields = retrieveRS.CorporateBookingInfo.AdditionalFields;
        const travelExpense = retrieveRS.CorporateBookingInfo.AdvanceRetrieve.TravelExpenses;
        const international = travelExpense.InternationalDayValue === 0 ? false : true;

        const expenseDf = new ExpenseAdvanceDefaultRS();
        expenseDf.ExpensesValue = travelExpense.ApprovedValue;
        expenseDf.FoodValue = travelExpense.Days *
            (international ? travelExpense.InternationalDayValue : travelExpense.NationalDayValue);
        expenseDf.TaxisValue = travelExpense.TransportValue;
        expenseDf.Currency = travelExpense.Currency;
        expenseDf.feeViatico = travelExpense.TotalFeeValue;
        expenseDf.monedaFeeViatico = travelExpense.CurrencyFee;

        let office: any = null;
        let name = null;
        let id:any = null;
        let officies = [];  
        let dataOf = null;
        // Data International
        if (international) {
            officies = [{ value: 'OFTORRE', display: 'Oficina torre central Davivienda' },
            { value: 'OFCENTRO', display: 'Oficina centro de Comercio Internacional CCI' }];

            office = aditionalFields.find((x) => x.IdVal === 1845);
            name = aditionalFields.find((x) => x.IdVal === 1893);
            id = aditionalFields.find((x) => x.IdVal === 1894);
            dataOf = office ? officies.find((o) => o.value === office.FieldValue) : null;
        }

        const geo: GeoLocation = {
            id: 0,
            locationType: '',
            name: travelExpense.DestinationCity,
            iata: travelExpense.DestinationCity,
            score: 0,
            stateName: '',
            type: '',
            ISOCode: '',
            iataCity: travelExpense.DestinationCity
        };

        setViatic({
            startDate: travelExpense.TravelDate,
            finalDate: travelExpense.ReturnDate,
            location: geo,
            international,
            days: travelExpense.Days,
            expenseDefault: expenseDf,
            office: international && dataOf ? { value: dataOf.value, text: dataOf.display } : undefined,
            dataInternational: international && name ?
                { name: name.FieldValue, idType: 'CC', idNumber: id.FieldValue } : undefined,
            people: travelExpense.NumberTravelers,
            food: true,
            transport: false,
            hasFlight: false,
            hasTransport: false,
            hasHotel: false,
            destinations: ''
        })
    }

    const setStatusCorporateRQ = ( status: number = 2, justification: string  = ''): SetStatusCorporateRQ => {
        const request = new SetStatusCorporateRQ();
        request.Status = status;
        request.ApprovalJustification = justification ? justification : '';
        request.ApprovalNotes = '';
        request.InternalRecordLocator = retrieveRS.InternalRecordLocator;

        if ( status === 2 && retrieveRS.CorporateBookingInfo &&
            retrieveRS.CorporateBookingInfo.AdvanceRetrieve &&
            retrieveRS.CorporateBookingInfo.AdvanceRetrieve.TravelExpenses ) {
                request.ApprovedAmount = retrieveRS.CorporateBookingInfo.AdvanceRetrieve.TravelExpenses.ApprovedValue;
            }
        return request;
    }

    const setColorStateRetrieve = ( ): string => {
        let color: string = '';
        if ( retrieveData?.status === 'R' ) {
            if ( retrieveData.statusFlowC === 'Pendente' ) {
                color = '#0069D9;'
            } else if ( retrieveData.statusFlowC === 'Aprovada' ) {
                color = '#1E7E34';
            }
        } else if ( retrieveData?.status === 'C' || retrieveData?.statusFlowC === 'Cancelada' ) {
            color = '#BD2130';
        }

        return color;
    }
    

    const changeBookingStatus = ( request: SetStatusCorporateRQ ) => {
        changeStatusBooking( request )
            .then(( response ) => {
                if ( response.Errors && response.Errors.length > 0 && response.IDStatusResponse !== 2 ) {
                    Toast.show({
                        text1: t( 'resNoPudoRealizarSolicitud' ),
                        type: 'error',
                        visibilityTime: 2000,
                    });
                } else {
                    Toast.show({
                        text1: t( 'resOperacionCompletada' ),
                        type: 'success',
                        visibilityTime: 2000,
                    });
                    if ( response.IDStatusResponse === 5 ) {
                        setStatusCorporate( 'Cancelada' );
                    }
                }
                navigation.goBack();
                setLoading( !loading );
            }),
            () => {
                Toast.show({
                    text1: 'No se pudo realizar la solicitud.',
                    type: 'error',
                    visibilityTime: 2000,
                });
            }
    }

    const approve = ( option: boolean ) => {
        setLoading( true );
        if ( option ) {
            changeBookingStatus( setStatusCorporateRQ() );

        } else {
            setType( 'justification' );
            setShowModal( true );
        }

        setShowItems( !showItems );
    }

    const renderModal = () => {
        switch ( type ) {
            case 'justification':
                return (
                    <JustificationModalScreen justified={ justified } />
                )
            default:
                break;
        }
    }


    console.log( 'retrieveresopnse', retrieveResponse?.CorporateParams?.DynamicFields );

    return (

        <>
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
            { !loading &&
                <>
                    { showModal && 
                        renderModal() 
                    }
                    {
                        ( isApprover && status !== 'C' && statusCorporate !== 'Aprovada' && statusCorporate !== 'Reprovada' && showAdditionalFields && typeScreen === 'approver' ) &&
                        <FloatingMenu
                            bottom={ 60 }
                            right={ 10 }
                            items={items}
                            isOpen={ showItems }
                            onMenuToggle={ handleMenuToggle }
                            borderColor={ colors.primary }
                            primaryColor={ fieldColor }
                            renderMenuIcon={ () => { return (
                                <FontAwesomeIcon
                                    icon={ faBars }
                                    color={ colors.primary }
                                    size={ 30 }
                                />
                            )}}
                            renderItemIcon= { ( item: any, index: any, menuState: any )  => {
                                if ( item.fa ) {
                                    return (
                                        <FontAwesomeIcon
                                            icon={item.fa}
                                            size={25}
                                            color={ colors.primary }
                                        />
                                    )
                                }
                            }}
                        />
                    }
                    { !loading && !showModal &&
                        <View style={{ flex: 1 }} >
                            <HeaderImageScrollView
                                maxHeight={MAX_HEIGHT}
                                minHeight={MIN_HEIGHT}
                                maxOverlayOpacity={0.6}
                                minOverlayOpacity={0.3}
                                contentContainerStyle={{ backgroundColor: fieldColor }}
                                fadeOutForeground
                                renderHeader={ () => <Image style={{ width: Dimensions.get( 'window' ).width, height: MAX_HEIGHT, alignSelf: 'stretch', resizeMode: 'cover' }} source={{ uri: 'https://www.pixelstalk.net/wp-content/uploads/2016/06/Miami-Background-Free-Download.jpg' }}  /> }
                                    renderForeground={() => (
                                    <>
                                        { !hideHeader && 
                                            <Animatable.View 
                                                animation='fadeInDown'
                                                style={{ flex: 1,
                                                    alignSelf: 'stretch',
                                                    justifyContent: 'center',
                                                    alignItems: 'center', 
                                                    maxWidth: '100%'
                                                }}
                                            >
                                                <DynamicText 
                                                    fontFamily={ semibold }
                                                    style={{ 
                                                        color: whiteColor,
                                                        backgroundColor: 'transparent',
                                                        fontSize: 24
                                                    }}
                                                > 
                                                    { booking?.rute } 
                                                </DynamicText>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxHeight: '90%' }}>
                                                    <View style={{ flexDirection: 'column', top: 70 }}>
                                                        <Icon 
                                                            name='trending-down-outline'
                                                            size={ 30 }
                                                            color={ whiteColor }
                                                            style={{ alignSelf: 'center' }}
                                                        />
                                                        <DynamicText 
                                                            style={{ 
                                                                color: whiteColor,
                                                                fontSize: 15,
                                                                marginHorizontal: 10,
                                                            
                                                            }}
                                                        >{ Moment(booking?.goingDate).format( 'ddd DD MMM YYYY, h:mm a' ) }
                                                        </DynamicText>
                                                    </View>
                                                    <Icon
                                                        style={{ top: 95 }}
                                                        name='time-outline'
                                                        color={ whiteColor }
                                                        size={ 20 }
                                                    />
                                                    <View style={{ flexDirection: 'column', top: 70 }}>
                                                        <Icon 
                                                            name='trending-up-outline'
                                                            size={ 30 }
                                                            color={ whiteColor }
                                                            style={{ alignSelf: 'center' }}
                                                        />
                                                        <DynamicText 
                                                            style={{ 
                                                                color: whiteColor,
                                                                fontSize: 15,
                                                                marginHorizontal: 10
                                                            }}
                                                        >{ Moment(booking?.comingDate).format( 'ddd DD MMM YYYY, h:mm a' ) }
                                                        </DynamicText>
                                                    </View>
                                                </View>
                                                
                                            </Animatable.View>

                                        }
                                    </>
                                )}
                                renderFixedForeground={() =>  {
                                    return (
                                        <>
                                            { hideHeader &&
                                                <Animatable.View animation='fadeIn' style={{ alignSelf: 'center', height: MIN_HEIGHT, justifyContent: 'center' }}/*  ref={navTitleView} */ >
                                                <Text 
                                                    style={{ 
                                                        color: 'white',
                                                        fontSize: 18,
                                                        backgroundColor: 'transparent' 
                                                    }}
                                                >{  booking?.rute }</Text>
                                                </Animatable.View>
                                            }
                                        </>
                                        )
                                } }
                            >   
                                <View style={{ backgroundColor: fieldColor, marginBottom: 110 }}>
                                    <TriggeringView
                                        onDisplay={ () => { setHideHeader( false ) }}
                                        onBeginHidden={ () => { setHideHeader( true ) }}
                                    >
                                        <View style={{  ...styles.fatherContainer, backgroundColor: whiteColor, marginTop: 10 }}>
                                            <View style={{ borderLeftWidth: 4, marginLeft: 10, marginTop: 10, marginBottom: 10, padding: 5, borderLeftColor: colors.primary }}>
                                                { showAdditionalFields || retrieveResponse.Segments === undefined &&
                                                    <View style={{ ...commonStyles.dataContainer, ...styles.containerRetrieve }}>
                                                        <DynamicText fontFamily={ semibold }  style={{ ...commonStyles.infoExpense, color: colors.text}}>{ t( 'resLocalizadorSolicitud' ) }:  </DynamicText>
                                                        <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ retrieveData?.locator }</DynamicText>
                                                    </View>
                                                }
                                                { retrieveResponse.Segments &&
                                                    <View style={{ ...commonStyles.dataContainer, ...styles.containerRetrieve }}>
                                                        <DynamicText fontFamily={ semibold }  style={{ ...commonStyles.infoExpense, color: colors.text}}>{ t( 'resLocalizadorAerolinea' ) }:  </DynamicText>
                                                        <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ retrieveResponse.RecordLocator }</DynamicText>
                                                    </View>
                                                }
                                                { retrieveResponse.Segments &&
                                                    <View style={{ ...commonStyles.dataContainer, ...styles.containerRetrieve }}>
                                                        <DynamicText fontFamily={ semibold }  style={{ ...commonStyles.infoExpense, color: colors.text}}>{ t( 'resLocalizadorInterno' ) }:  </DynamicText>
                                                        <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ retrieveResponse.InternalRecordLocator }</DynamicText>
                                                    </View>
                                                }
                                                { showAdditionalFields &&
                                                    <View style={{ ...commonStyles.dataContainer, ...styles.containerRetrieve }}>
                                                        <DynamicText fontFamily={ semibold }  style={{ ...commonStyles.infoExpense, color: colors.text}}>{ t( 'resCodigoReserva' ) }:  </DynamicText>
                                                        <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ retrieveData?.bookingCode }</DynamicText>
                                                    </View>
                                                }
                                                <View style={{ ...commonStyles.dataContainer, ...styles.containerRetrieve }}>
                                                    <DynamicText fontFamily={ semibold }  style={{ ...commonStyles.infoExpense, color: colors.text}}>{ t( 'resFechaSolicitud' ) }:  </DynamicText>
                                                    <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{  Moment( retrieveData?.bookingDate ).format( 'ddd DD MMM YYYY, h:mm a' )  }</DynamicText>
                                                </View>
                                                
                                                <View style={{ ...commonStyles.dataContainer, ...styles.containerRetrieve }}>
                                                    <DynamicText fontFamily={ semibold }  style={{ ...commonStyles.infoExpense, marginTop: 7,  color: colors.text}}>{ t( 'resEstadoSolicitud' ) }: </DynamicText>
                                                    { statusCorporate !== 'Reprovada' &&
                                                        <View style={[ commonStyles.stateContainer,  { backgroundColor:  setColorStateRetrieve(), }  ]}>
                                                            <DynamicText numberOfLines={ 1 } fontFamily={ semibold } style={{ fontSize: 15,  color: whiteColor }}>{ t( setStateRetrieve(retrieveData?.status as string, retrieveData?.statusFlowC as string ) as string )}</DynamicText>
                                                        </View>
                                                    }
                                                    {
                                                        statusCorporate === 'Reprovada' &&
                                                        <DynamicText style={{ ...commonStyles.infoExpense, marginTop: 7,  color: colors.text}}> { t( 'resRechazado' ) } </DynamicText>
                                                    }
                                                    {
                                                        ( statusCorporate === 'Pendente' ) && ( retrieveData?.status !== 'C' ) &&
                                                        <DynamicText style={{ ...commonStyles.infoExpense, marginTop: 7,  color: colors.text}}>{ t( 'resPendiente' ) }</DynamicText>
                                                    }
                                                </View>
                                                { status !== 'C' &&
                                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <DynamicText fontFamily={ semibold }  style={{ ...commonStyles.infoExpense, color: colors.text}}>{ t( 'resPasajeros' ) }:  </DynamicText>
                                                        <View>
                                                            {
                                                                travelers.map(( item, index) => {
                                                                    return (
                                                                        <DynamicText key={ index } style={{ ...commonStyles.infoExpense, color: colors.text}}> { item.FullName } </DynamicText>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    </View> 
                                                }
                                            </View>
                                        </View>
                                        { ( retrieveResponse.Segments !== undefined && status !== 'C' ) &&
                                            <View style={{  ...styles.fatherContainer, backgroundColor: whiteColor, marginTop: 10,   }}>
                                                <ReviewFlightScreen retrieve={ retrieveResponse } showAdditionalFields={ showAdditionalFields } />
                                            </View>     
                                        }
                                        { ( hotel.length > 0 && status !== 'C' ) &&
                                            <ReviewHotelScreen hotel={ hotel } />
                                        }
                                        { (  viatic.startDate && status !== 'C' ) &&
                                            <ReviewViaticsScreen viatic={ viatic } /> 
                                        }
                                        { showAdditionalFields &&
                                            <CostCenterInfo costCenter={ costCenter }  />
                                        }
                                        {
                                            ( retrieveRS && !retrieveRS?.CorporateBookingInfo?.PolicyResult && showAdditionalFields ) &&
                                            <View style={[ styles.fatherContainer, { backgroundColor: accent, marginTop: 20 } ]}>
                                                <View style={{ flexDirection: 'row', marginTop: 40, alignSelf: 'center'  }}>
                                                    <FontAwesomeIcon 
                                                        icon={ faExclamationCircle }
                                                        color={ grayColor }
                                                        size={ 30 }
                                                    />
                                                    <DynamicText style={{ color: grayColor, fontSize: 15, marginTop: 6 }}>{ t( 'resPasajeroIncumplePoliticasViaje' ) }</DynamicText>
                                                </View>
                                                <View style={styles.contentTitle}>
                                                    <DynamicText fontFamily={ semibold } style={{ color: colors.primary }}  headline semibold>
                                                        { 'Justificacion' }
                                                    </DynamicText>
                                                </View>
                                                <DynamicTextInput
                                                    style={{ width: '95%', margin: 10 }}
                                                    editable={  false }
                                                    value={ retrieveRS?.CorporateBookingInfo?.JustificationPolicy }
                                                />
                                            </View>

                                        }
                                        {
                                            ( retrieveRS && status !== 'C' && retrieveRS.CorporateBookingInfo?.ApproverList?.length > 0 && showAdditionalFields ) &&  
                                            <ApproversScreen approvers={ retrieveRS.CorporateBookingInfo.ApproverList  } />
                                        }
                                        { ( retrieveRS && status !== 'C' ) &&  
                                            <ResumeScreen  servicesData={ { hotels: hotel, flights: retrieveResponse, viatics: viatic } } />
                                        }
                                    </TriggeringView>      
                                </View>
                            </HeaderImageScrollView>  
                        </View>
                    }
                </>
            }
        </>
    )
}


const styles = StyleSheet.create({
    containerRetrieve: {
        marginTop: 10,
        justifyContent: 'space-between' 
    },
    fatherContainer: {
        width: '97%', 
        alignSelf: 'center',
        borderRadius: 10,
    
    },
    cardText: {
        margin: 10,
        marginTop: 15
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        backgroundColor: 'white',
    },
    navTitleView: {
        height: MIN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 40 : 5,
        opacity: 0,
    },
    contentTitle: {
        alignItems: 'flex-start',
        width: '100%',
        justifyContent: 'center',
        marginLeft: 10,
        marginTop: 10
    },
    buttonsAction: {
        paddingLeft:  20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 5
    },
    labelMenu: {
        fontSize: 13, 
        fontFamily: 'Raleway-Regular', 
        fontWeight: '900'
    },
})
