import { faArrowLeft, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { Header } from '../../components/common/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import * as Animatable from 'react-native-animatable';
import { FilledInputText } from '../../components/common/FilledInputText';
import { useFont } from '../../hooks/common/useFont';
import { useTranslation } from 'react-i18next';
import { DynamicTextInput } from '../../components/common/DynamicTextInput';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import { loginStyles } from '../../styles/loginStyles';
import LinearGradient from 'react-native-linear-gradient';
import { RequestExpenses } from '../../model/interfaces/expenses/RequestExpenses';
import { GeoLocation } from '../../model/interfaces/corporate/Geolocation';
import Moment from 'moment';
import { ExpenseAdvanceDefaultRS } from '../../model/classes/expenses/ExpenseAdvanceDefaultRS';
import { ExpenseAdvanceDefaultRQ } from '../../model/classes/viatics/ExpenseAdvanceDefaultRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { viaticsApi } from '../../api/viaticsApi';
import NumberFormat from 'react-number-format';
import { CalendarComplete } from '../../components/common/CalendarComplete';

interface Props extends StackScreenProps<RootStackParams, 'ViaticSearchScreen'>{};

export const ViaticSearchScreen = ({ navigation, route }: Props ) => {
    const { width } = Dimensions.get('window');
    const { theme: { colors, fieldColor, secondary, whiteColor, grayColor, accent, cancelColor } } = useContext( ThemeContext );
    const { getExpenseDefault } = viaticsApi();
    const { userData } = useContext( AuthContext );
    const { t } = useTranslation();
    const { semibold } = useFont();
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requestExpenses, setRequestExpenses] = useState<RequestExpenses>({
        startDate: new Date(),
        finalDate: new Date(),
        location: new GeoLocation(),
        international: false,
        days: 1,
        expenseDefault: undefined,
        office: {
            value: 'OFTORRE',
            text: 'Oficina torre central Davivienda'
        },
        dataInternational: {
            name: '',
            idType: 'CC',
            idNumber: ''
        },
        people: 1,
        food: true,
        transport: false,
        hasFlight: /* this.user.selectedServices.find(x => x === 'flight') !== undefined, */ false,
        hasHotel: /* this.user.selectedServices.find(x => x === 'hotel') !== undefined, */false,
        hasTransport: /* this.user.selectedServices.find(x => x === 'inter') !== undefined, */false,
        destinations: ""
    });
    const [calendarComplete, setCalendarComplete] = useState({
        index: -1,
        show: false
    });
    const [searchParams, setSearchParams] = useState({
        location: new GeoLocation(),
        days: 1
    })
    const [showAlert, setShowAlert] = useState(true);
    const location = route?.params?.location;

    /* const startDate = this.user.hotelSelected && this.user.hotelSelected.length > 0 ? this.user.hotelSelected[0].checkIn :
            this.user.segments && this.user.segments.length > 0 ? this.user.segments[0].departureDate : today;
    const finalDate = this.user.hotelSelected && this.user.hotelSelected.length > 0 ?
        this.user.hotelSelected[this.user.hotelSelected.length - 1].checkOut :
        this.user.segments && this.user.segments.length > 0 && this.user.segments.length === 1 &&
        this.user.segments[0].arrivalDate > new Date() ? this.user.segments[0].arrivalDate :
        this.user.segments && this.user.segments.length > 1 ?
        this.user.segments[this.user.segments.length - 1].departureDate : startDate; */
        /* const destination: GeoLocation = this.user.segments && this.user.segments.length > 0 ? this.user.segments[0].arrivalLocation :
        this.user.hotelSelected && this.user.hotelSelected.length > 0 ? this.user.hotelSelected[0].location : undefined; */

    const showOptions = () => {
        setSearchParams({
            ...searchParams,
            days: requestExpenses?.days
        })
        setShowMoreOptions( !showMoreOptions );
    }

    

    const getExpensesUser = () => {
        const request = new ExpenseAdvanceDefaultRQ();
        request.IDUser = userData.IDUser;
        request.Destination = location?.iata as string;
        request.ProcessType = 'O';
        request.StartTime = 0;
        request.EndTime = 3;
        request.International = false;
        request.NumberOfDays = 1;
        request.FamilyHome = false;
        request.PaymentExpenses = true;
        request.PaymentDestination = 'N';
        request.HasFlight = /* this.user.selectedServices.find(x => x === 'flight') !== undefined; */ false;
        request.HasHotel = /* this.user.selectedServices.find(x => x === 'hotel') !== undefined; */ false;
        request.HasTransport = /* this.user.selectedServices.find(x => x === 'inter') !== undefined; */ false;
        getExpenseDefault( request )
            .then(( response ) => {
                setRequestExpenses({
                    ...requestExpenses,
                    expenseDefault: response
                })
                setLoading( false );
            })


    }

    const showCalendarComplete = () => {
        setCalendarComplete({
            ...calendarComplete,
            show: !calendarComplete.show
        });
    }

    const captureDates = ( dates: {  startDate: string, endDate: string }, index: number ) => {
        let start = new Date( dates.startDate );
        let end = new Date( dates.endDate );
        start.setDate( start.getDate() + 1 );
        end.setDate( end.getDate() + 1 );
        setRequestExpenses({
           ...requestExpenses,
            startDate: start,
            finalDate: end
        })
    }

    const canEditDays = () => {
        if ( userData.Params.PERMITEMODIFICARDIASVIATICOS ) {
            setShowMoreOptions( !showMoreOptions )
        }
    }

    const setDays = () => {
        setShowMoreOptions(false);
        setRequestExpenses({
            ...requestExpenses,
            days:  searchParams.days
        })
    }

    useEffect(() => {
        
        setRequestExpenses({
            startDate: new Date(),
            finalDate: new Date(),
            location: new GeoLocation(),
            international: false,
            days: 1,
            expenseDefault: undefined,
            office: {
                value: 'OFTORRE',
                text: 'Oficina torre central Davivienda'
            },
            dataInternational: {
                name: '',
                idType: 'CC',
                idNumber: ''
            },
            people: 1,
            food: true,
            transport: false,
            hasFlight: /* this.user.selectedServices.find(x => x === 'flight') !== undefined, */ false,
            hasHotel: /* this.user.selectedServices.find(x => x === 'hotel') !== undefined, */false,
            hasTransport: /* this.user.selectedServices.find(x => x === 'inter') !== undefined, */false,
            destinations: ""
        })
    }, [])


    useEffect(() => {
        if ( location?.name ) {
            setSearchParams({
                ...searchParams,
                location: location
            })
            setLoading( true );
            getExpensesUser();
        }
    }, [location])

    useEffect(() => {
       console.log( 'requestExpense', requestExpenses );
    }, [requestExpenses])

    return (
        <View>
            <Header 
                title={ t( 'resViaticos' ) }
                subTitle={ t( 'resSolicitudViaticos' ) }
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
            <Animatable.View
                animation="fadeIn"
                style={{ width: '90%', alignSelf: 'center' }}
            >
                <ScrollView
                    style={{ marginBottom: 50 }}
                >
                    { loading &&
                        <ActivityIndicator
                            size="small"
                            color={ colors.primary }
                            style={{ paddingLeft: 5 }}
                        />
                    }
                    <View style={[styles.contentTitle, {  marginTop: 10, marginBottom: 10, marginLeft: 10 }]}>
                        <DynamicText fontFamily={ semibold } style={[ styles.text , { color: grayColor } ]} headline semibold>
                            { t( 'resCiudad' ) }
                        </DynamicText>
                    </View>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignSelf: 'center' }}
                        onPress={ () => navigation.navigate( 'AutoCompleteSearch', {
                            type: 'Location',
                            screen: 'ViaticSearchScreen'
                        } ) }
                    >
                        <Icon 
                            name='trail-sign-outline'
                            size={ 25 }
                            color={ colors.primary }
                            style={[ styles.icon, { backgroundColor: fieldColor }]}
                        />
                        <DynamicTextInput
                            styleInput={{ fontSize: 17 }} 
                            editable={ false }
                            style={{ width: '90%' }}
                            placeholder={ t( 'resIngresaUbicacion' ) }
                            value={ searchParams?.location?.name }
                        />
                    </TouchableOpacity>

                    <View style={[styles.contentTitle, {  marginTop: 10, marginBottom: 10, marginLeft: 10 }]}>
                        <DynamicText fontFamily={ semibold } style={[ styles.text , { color: grayColor } ]} headline semibold>
                            { t('resFechas') }
                        </DynamicText>
                    </View>
                    <TouchableOpacity 
                        style={{ flexDirection: 'row', alignSelf: 'center' }}
                        onPress={ () => showCalendarComplete() } 
                    >
                        <Icon 
                            name='calendar-outline'
                            size={ 25 }
                            color={ colors.primary }
                            style={[ styles.icon, { backgroundColor: fieldColor }]}
                        />
                        <DynamicTextInput
                            styleInput={{ fontSize: 17 }} 
                            editable={ false }
                            style={ styles.inputText }
                            placeholder={ t('resFechaPartida') }
                            value={ Moment( requestExpenses?.startDate ).format( 'll' ) }
                        />

                        
                        <Icon 
                            name='calendar-outline'
                            size={ 25 }
                            color={ colors.primary }
                            style={[ styles.icon, { backgroundColor: fieldColor }]}
                        />
                        <DynamicTextInput 
                            styleInput={{ fontSize: 17 }} 
                            editable={ false }
                            style={ styles.inputText }
                            placeholder={ t('resFechaRegreso') }
                            value={ Moment( requestExpenses?.finalDate ).format( 'll' ) }
                        />
                    
                    
                    </TouchableOpacity>

                    { showAlert &&
                        <View style={{ marginTop: 20, backgroundColor: accent, padding: 5, borderRadius: 10, }}>
                            <TouchableOpacity 
                                style={{ alignSelf: 'flex-end' }}
                                onPress={ () => setShowAlert( false ) }
                            >
                                <FontAwesomeIcon 
                                    icon={ faTimesCircle }
                                    size={ 15 }
                                    color={ colors.primary }
                                />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', maxWidth: '95%' }}>
                                <FontAwesomeIcon 
                                    icon={ faExclamationTriangle }
                                    size={ 35 }
                                    color={ colors.primary }
                                />
                                <DynamicText fontFamily={ semibold } style={{ marginLeft: 10, color: colors.primary, fontSize: 15, maxWidth: '95%' }}>{ t( 'resRecordatorioViaticos' ) }</DynamicText>
                            </View>
                        </View>
                    }

                    <View style={[styles.contentTitle, {  marginTop: 10, marginBottom: 10, marginLeft: 10 }]}>
                        <DynamicText fontFamily={ semibold } style={[ styles.text , { color: grayColor } ]} headline semibold>
                            { t( 'resNumeroDias' ) }
                        </DynamicText>
                    </View>
                    <TouchableOpacity 
                        style={{ flexDirection: 'row' }}
                        onPress={ () => canEditDays() }
                    >
                        <Icon 
                            name='partly-sunny-outline'
                            size={ 25 }
                            color={ colors.primary }
                            style={[ styles.icon, { backgroundColor: fieldColor }]}
                        />
                        <DynamicTextInput
                            styleInput={{ fontSize: 17 }} 
                            editable={ false }
                            style={{ width: '40%' }}
                            value={ requestExpenses?.days.toString() }
                        />
                    </TouchableOpacity>
                    <View
                        style={{ marginTop: 30 }}
                    >
                        <View style={{ flexDirection: 'row', }}>
                            <View style={[{  marginTop: 10, marginBottom: 10, alignSelf: 'flex-end'  }]}>
                                <DynamicText fontFamily={ semibold } style={[ styles.text , { color: grayColor } ]} headline semibold>
                                    { t( 'resTotalManutencion' ) }
                                </DynamicText>
                            </View>
                            <View style={[{  marginTop: 10, marginBottom: 10, alignSelf: 'flex-end' }]}>
                                <DynamicText fontFamily={ semibold } style={[ styles.text , { color: grayColor } ]} headline semibold>
                                    { `   ${t( 'resTotalTaxis' )}` }
                                </DynamicText>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            
                            <TouchableOpacity 
                                style={{ flexDirection: 'row', alignSelf: 'flex-end', width: '40%', marginRight: '10%' }}
                            >
                                <Icon 
                                    name='card-outline'
                                    size={ 25 }
                                    color={ colors.primary }
                                    style={[ styles.icon, { backgroundColor: fieldColor }]}
                                />
                                <NumberFormat value={ requestExpenses?.expenseDefault?.FoodValue } displayType={'text'} thousandSeparator={true} prefix={'$'}
                                    renderText={ valueRender => (
                                        <DynamicTextInput
                                            styleInput={{ fontSize: 17 }} 
                                            editable={ false }
                                            value={ valueRender }
                                        />
                                    ) }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{ flexDirection: 'row', alignSelf: 'flex-end', width: '40%'  }}
                            >
                                <Icon 
                                    name='car-outline'
                                    size={ 25 }
                                    color={ colors.primary }
                                    style={[ styles.icon, { backgroundColor: fieldColor }]}
                                />
                                <NumberFormat value={ requestExpenses?.expenseDefault?.TaxisValue } displayType={'text'} thousandSeparator={true} prefix={'$'}
                                    renderText={ valueRender => (
                                        <DynamicTextInput
                                            styleInput={{ fontSize: 17 }} 
                                            editable={ false }
                                            value={ valueRender }
                                        />
                                    ) }
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[{  marginTop: 10, marginBottom: 10, marginLeft: 10, alignSelf: 'flex-end' }]}>
                            <DynamicText fontFamily={ semibold } style={[ styles.text , { color: grayColor } ]} headline semibold>
                                { t( 'resTotalViaticos' ) }
                            </DynamicText>
                        </View>
                        <View 
                            style={{ flexDirection: 'row', alignSelf: 'flex-end'  }}
                        >
                            <Icon 
                                name='cash-outline'
                                size={ 25 }
                                color={ colors.primary }
                                style={[ styles.icon, { backgroundColor: fieldColor }]}
                            />
                            <NumberFormat value={ requestExpenses?.expenseDefault?.ExpensesValue } displayType={'text'} thousandSeparator={true} prefix={'$'}
                                renderText={ valueRender => (
                                    <DynamicTextInput
                                        styleInput={{ fontSize: 17 }} 
                                        style={{ width: '40%' }}
                                        editable={ false }
                                        value={ valueRender }
                                    />
                                ) }
                            />
                        </View>
                    </View>
                    { calendarComplete.show &&
                        <CalendarComplete  showcalendar={ showCalendarComplete } captureDates={ captureDates } />
                    }
                    { showMoreOptions &&
                        <Modal
                            isVisible={true}
                            swipeDirection={['down']}
                            onSwipeComplete={ showOptions }
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
                                        onPress={ () => showOptions() }
                                    >
                                        <DynamicText body1>{t( 'resCancelar' )}</DynamicText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() =>  setDays() }>
                                        <DynamicText fontFamily={ semibold } body1 primaryColor>
                                            { t( 'resGuardar' ) }
                                        </DynamicText>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.lineRow, {marginBottom: 10}]}>
                                    <View style={{alignItems: 'flex-start'}}>
                                        <DynamicText body1>{'Días'}</DynamicText>
                                        <DynamicText caption1 greyColor>
                                            {'Cuantos dias quieres cubrir'}
                                        </DynamicText>
                                    </View>
                                    <View style={styles.iconRight}>
                                    <TouchableOpacity
                                         onPress={() => setSearchParams({
                                            ...searchParams,
                                            days: searchParams.days - 1
                                        })}
                                    >
                                        <Icon
                                            name="remove-circle"
                                            size={24}
                                            color={ grayColor }
                                        />
                                    </TouchableOpacity>
                                    <DynamicText title1>{ searchParams?.days.toString() }</DynamicText>
                                    <TouchableOpacity 
                                        onPress={() => setSearchParams({
                                            ...searchParams,
                                            days: searchParams.days + 1
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
                            </View>
                        </Modal>
                    }
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity
                            style={ loginStyles.signIn }
                        >
                            <LinearGradient
                                colors={[colors.primary,secondary]}
                                style={{...loginStyles.signIn, width: width * .90}}
                            >
                                <DynamicText fontFamily={ semibold } style={[loginStyles.textSign, {
                                    color: whiteColor
                                }]}>{ t( 'resContinuar' ) }</DynamicText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </Animatable.View>
        </View>
    )
}


const styles = StyleSheet.create({
    contentTitle: {
        alignItems: 'flex-start',
        width: '100%',
        height: 32,
        justifyContent: 'center',
    },
    text: {
        fontSize: 20
    },
    icon: {
        borderBottomLeftRadius: 5, 
        borderTopLeftRadius: 5, 
        paddingTop: 10, 
        paddingLeft: 5, 
        
    },
    inputText: {
        height: 45, 
        maxWidth: '40%', 
        borderRadius: 0, 
        borderBottomRightRadius: 5, 
        borderTopRightRadius: 5, 
        marginRight: 5, 
        alignSelf: 'center'
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
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
    contentActionModalBottom: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginBottom: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
    },
    contentFilterBottom: {
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 20,
    },
    contentSwipeDown: {
        paddingTop: 10,
        alignItems: 'center',
      },
    lineSwipeDown: {
        width: 30,
        height: 2.5,
    },
})