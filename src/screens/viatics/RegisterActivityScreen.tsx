import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles'
import * as Animatable from 'react-native-animatable';
import { loginStyles } from '../../styles/loginStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarMinus, faMoneyCheckAlt, faRoute, faSearchDollar } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';
import LinearGradient from 'react-native-linear-gradient';
import { DateObject } from 'react-native-calendars';
import { CalendarSingleDate } from '../../components/common/CalendarSingleDate';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import Moment from 'moment';
import { CurrencyTypes } from '../../classes/viatics/CurrencyTypes';
import Toast from 'react-native-toast-message';
import { ExpenseGroupUpdateRQ } from '../../classes/viatics/ExpenseGroupUpdateRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { GActivities } from '../../interfaces/viatics/GActivities';
import { viaticsApi } from '../../api/viaticsApi';
import { useTranslation } from 'react-i18next';


interface Props extends StackScreenProps<RootStackParams, 'RegisterActivityScreen'>{};

export const RegisterActivityScreen = ({ navigation, route }: Props) => {
    const { t } = useTranslation();
    const params = route.params;
    const { userData: { IDEntityDefault, IDUser } } = useContext( AuthContext );
    const { alterExpenseGroupItem } = viaticsApi();
    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const [minDate, setminDate] = useState('');
    const [openedType, setOpenedType] = useState('');
    const [currency, setCurrency] = useState<CurrencyTypes>( new CurrencyTypes );
    const [showcalendar, setShowcalendar] = useState(false);
    const [showToast, setshowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataManualActivity, setDataManualActivity] = useState<GActivities>( new GActivities );

    const [manualActivity, setManualActivity] = useState({
        activityName: '',
        startDate: '',
        endDate: '',
        budget: '',
        note: ''
    });

    useEffect(() => {
       
        if ( params?.type && params?.activity ) {
            setDataManualActivity( params.activity );
            setOpenedType( params?.type );
        }

        if ( params?.currencyType ) {
            setCurrency(  params.currencyType);
        }

    }, [params])

    const hideCalendar = ( show: boolean ) => {
        setShowcalendar( show );
    }

    

    const setDate =  ( data: DateObject ) => {

        if ( manualActivity.startDate === '' ) {
            setManualActivity({
                ...manualActivity,
                startDate: data.dateString
            });
            setminDate( data.dateString );
            setDataManualActivity({
                ...dataManualActivity,
                DateSta: new Date( data.dateString )
            });
        } else {
            setManualActivity({
                ...manualActivity,
                endDate: data.dateString
            });
            setDataManualActivity({
                ...dataManualActivity,
                DateEnd: new Date( data.dateString )
            });
        }
       
         
    }

    const convertStartDate = (manualActivity.startDate !== '') ? Moment(manualActivity.startDate).format('ll') : manualActivity.startDate;
    const convertEndDate = (manualActivity.endDate !== '') ? Moment(manualActivity.endDate).format('ll') : manualActivity.endDate;

    const openSearch =  ( type: 'Activities' | 'Category' | 'CurrencyType' | 'Establishment') => {
        navigation.navigate('AutoCompleteSearch',  {
            type: type,
            screen: 'RegisterActivityScreen'
        })
    }

    const validateFields = (): boolean => {
        let canSave: boolean = true;

        if ( openedType !== 'edit') {
            if (  (manualActivity.activityName === ''))  {
                loadToast( t( 'resEscribaActividad' ) );
                canSave = false;
            } else if ( manualActivity.startDate === '' ) {
                loadToast( t( 'resIngreseFechaInicial' ) );
                canSave = false;
            } else if ( manualActivity.endDate === '' ) {
                loadToast( t( 'resIngreseFechaFinal' ) );
                canSave = false;
            } else if ( currency.value === undefined ) {
                setshowToast(!showToast);
                loadToast( t( 'resSeleccioneMoneda' ) );
                canSave = false;
            } else if ( manualActivity.budget === '' ) {
                loadToast( t( 'resIngresePresupuestoActividad' ) );
                canSave = false;
            } else if ( manualActivity.note === '' ) {
                loadToast( t( 'resIngreseNota' ) );
                canSave = false;
            }    
        } else if ( openedType === 'edit') {
            if (  (dataManualActivity.Description === ''))  {
                loadToast( t( 'resEscribaActividad' ) );
                canSave = false;
            } else if ( dataManualActivity.DateSta === undefined ) {
                loadToast( t( 'resIngreseFechaInicial' ) );
                canSave = false;
            } else if ( dataManualActivity.DateEnd === undefined ) {
                loadToast( t( 'resIngreseFechaFinal' ) );
                canSave = false;
            } else if ( dataManualActivity.Currency === '' ) {
                loadToast( t( 'resSeleccioneMoneda' ) );
                canSave = false;
            } else if ( dataManualActivity.Budget === undefined ) {
                loadToast( t( 'resIngresePresupuestoActividad' ) );
                canSave = false;
            } else if ( dataManualActivity.Note === '' ) {
                loadToast( t( 'resIngreseNota' ) );
                canSave = false;
            }
    
        }

        
        return canSave;
    }

    const loadToast = ( messageError: string ) => {
        Toast.show({
            text1: 'Error',
            text2: messageError,
            type: 'error',
            visibilityTime: 1000,
        })
    }


    const saveActivity = ( )  => {
        if ( validateFields() ) {
            setLoading( !loading );
            const request = new ExpenseGroupUpdateRQ();
            if ( openedType !== 'edit' ) {
                request.Action = 'sendFlow';
                const act:GActivities =  {
                    BookingCode: 0,
                    Budget: dataManualActivity.Budget,
                    Currency: currency.value,
                    DateEnd: dataManualActivity.DateEnd,
                    DateSta:  dataManualActivity.DateSta,
                    DateSync: new Date(),
                    DateLegalize: null,
                    Description: manualActivity.activityName,
                    EditedLegalize: false,
                    ExpenseGroupCash: 0,
                    IDEntity: IDEntityDefault,
                    IDGroup: '',
                    IDParent: '00000000-0000-0000-0000-000000000000',
                    IDUser: IDUser,
                    IDUserLegalize: 0,
                    LegalizeCash: 0,
                    LegalizeNote: '',
                    LegalizeState: 'P',
                    Note: manualActivity.note,
                    State: 'P',
                    TotalLegalize: 0,
                    Edited: false,
                    PigeOnHole: false,
                    visibleReadOnly: false,
                    TypeOwner: '',
                    UserName: '',
                    EntityName: '',
                    ApproverUserName: '',
                    createBySystem: 'S',
                    Trm: 0,
                    DeliveryTrm: 0,
                    maxDateLegalize: null ,
                    countExpenses: 0,
                    totalExpense: 0,
                    Requestdate: new Date(),
                    ClosedType: 'P',
                    interNal: '',
                    entregadoUsd: false,
                    tipoConsultaReporteAnticipos: '',
                    fechaEntregaAnticipo: new Date(),
                    RefundDate: new Date(),
                    HasAttach: false,
                    TotalRefund: 0,
                    SecondUserApprover: 0,
                    SecondApprover : '',
                    viat_fecAprobacionParcial : '',
                    IdUserParcialLegalize: 0,
                    DateParcialLegalize: new Date(),
                    IDApproverUser: 0,
                    EmailRequester: '',
                    UserApprover: 0,
                    items: []
                };
                request.GroupsItems = {
                    group: act,
                }
            } else {
                dataManualActivity.items = [];
                request.Source = 'WEB';
                request.GroupsItems = {
                    group: dataManualActivity,
                    items: []
                }
            }
                       
            alterExpenseGroupItem( request )
                .then(( response ) => {
                    setLoading( false );
                    if ( response ) {
                        Toast.show({
                            text1: t( 'resGuardado' ),
                            text2: t( 'resActividadManualGuardado' ),
                            type: 'success',
                            visibilityTime: 2000,
                            onHide: () => navigation.navigate(( openedType !== 'edit' ) ? 'ActivitiesListScreen' : 'HomeViaticsScreen', {
                                type: 'allActivities',
                                refresh: true
                            })
                        });
                    } else{
                        Toast.show({
                            text1: 'Error',
                            text2: t( 'resActividadManualNoGuardado' ),
                            type: 'error',
                            visibilityTime: 2000,
                            onHide: () => navigation.navigate('ActivitiesListScreen', {
                                type: 'allActivities',
                                refresh: true
                            })
                        });
                    }
                    
                    
                })

        }
    }
    

    return (

        <ScrollView>            
            <View style={{ 
                ...commonStyles.container,
                alignItems: 'stretch',
                bottom: 40
            }}>
                <Text style={{ 
                    ...commonStyles.title,
                    color: colors.primary,
                }}>
                    { t( 'resRegistroActividad' ) }
                </Text>
                <View 
                    style={{ 
                        ...commonStyles.rightButtonContainer,
                        marginTop: 30
                    }}
                >
                    <TouchableOpacity
                        onPress={ () => navigation.goBack() }
                        style={commonStyles.rightButton}>
                        <LinearGradient
                            colors={[colors.primary, secondary]}
                            style={commonStyles.rightButton}
                        >
                            <Text style={[commonStyles.buttonText, {
                                color:'#fff'
                            }]}>{ t( 'resCancelar' ) }</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            <Animatable.View
                style={[loginStyles.footer, {
                    backgroundColor: colors.background
                    }]}
                animation="fadeInUpBig">
                        <View style={{
                            ...commonStyles.action,
                        }}>
                            <View style={{ 
                                ...commonStyles.icon,
                                backgroundColor: colors.primary,
                                
                            }}>
                                <FontAwesomeIcon 
                                    style={{ 
                                        color: buttonText
                                    }}
                                    icon={ faRoute }
                                    size={20} />
                            </View>
                            <TextInput
                                editable={ ( openedType === 'edit' ) ? false : true }
                                onChangeText={ ( value ) => setManualActivity({
                                    ...manualActivity,
                                    activityName: value
                                })}
                                placeholder={ t( 'resNombreActividad' ) }
                                placeholderTextColor="#666666"
                                style={{
                                    ...commonStyles.textInput,
                                    ...commonStyles.textInputRegister,
                                    color: colors.text,
                                    
                                }}

                                value={ manualActivity.activityName || dataManualActivity.Description }
                            />
                        </View>

                        <View style={{
                            ...commonStyles.action,
                            marginTop: 40
                        }}>
                            <View style={{ 
                                ...commonStyles.icon,
                                backgroundColor: colors.primary,
                                
                            }}>
                                <FontAwesomeIcon 
                                    style={{ 
                                        color: buttonText
                                    }}
                                    icon={ faCalendarMinus }
                                    size={20} />
                            </View>
                            <TouchableOpacity
                                onPress={ () => ( openedType === 'edit' ) ? null : hideCalendar( !showcalendar ) }
                            >
                                <TextInput
                                    editable={ false }
                                    placeholder={ t( 'resFechaInicio' ) }
                                    placeholderTextColor="#666666"
                                    style={{
                                        ...commonStyles.textInput,
                                        ...commonStyles.textInputRegister,
                                        color: colors.text,
                                        
                                    }}
                                    value={ convertStartDate || Moment(dataManualActivity.DateSta).format('ll') }
                                />
                            </TouchableOpacity>
                            
                        </View>
                        { showcalendar &&
                            <CalendarSingleDate minDate={ minDate } showCalendar={ hideCalendar } setDate={ setDate }></CalendarSingleDate>
                        }

                        <View style={{
                            ...commonStyles.action,
                            marginTop: 40
                        }}>
                            <View style={{ 
                                ...commonStyles.icon,
                                backgroundColor: colors.primary,
                                
                            }}>
                                <FontAwesomeIcon 
                                    style={{ 
                                        color: buttonText
                                    }}
                                    icon={ faCalendarMinus }
                                    size={20} />
                            </View>
                            <TouchableOpacity
                                onPress={ () => ( openedType === 'edit' ) ? null :  hideCalendar( !showcalendar ) }
                            >
                                <TextInput
                                    editable={ false }
                                    placeholder={ t( 'resFechaFin' ) }
                                    placeholderTextColor="#666666"
                                    style={{
                                        ...commonStyles.textInput,
                                        ...commonStyles.textInputRegister,
                                        color: colors.text,
                                        
                                    }}
                                    value={ convertEndDate || Moment(dataManualActivity.DateEnd).format('ll') }
                                />
                            </TouchableOpacity>
                            
                        </View>

                        <View style={{
                                ...commonStyles.action,
                                marginTop: 40,
                                zIndex: 5
                            }}>
                                <View style={{ 
                                    ...commonStyles.icon,
                                    backgroundColor: colors.primary,
                                }}>
                                    <FontAwesomeIcon 
                                        style={{ 
                                            color: buttonText
                                        }}
                                        icon={ faSearchDollar }
                                        size={20} />
                                </View>
                                <TouchableOpacity
                                    onPress={ () =>   ( openedType === 'edit' ) ? null : openSearch( 'CurrencyType' ) }
                                >
                                    <TextInput
                                        editable={ false }                                
                                        placeholder={ t( 'resTipoMoneda' ) }
                                        placeholderTextColor="#666666"
                                        style={{
                                            ...commonStyles.textInput,
                                            ...commonStyles.textInputRegister,
                                            color: colors.text,
                                            
                                        }}
                                        value={ currency.label || dataManualActivity.Currency }
                                    />   
                                </TouchableOpacity>                             
                        </View >

                        <View style={{
                            ...commonStyles.action,
                            marginTop: 40,
                        }}>
                            <View style={{ 
                                ...commonStyles.icon,
                                backgroundColor: colors.primary,
                                
                            }}>
                                <FontAwesomeIcon 
                                    style={{ 
                                        color: buttonText
                                    }}
                                    icon={ faMoneyCheckAlt }
                                    size={20} />
                            </View>
                            <NumberFormat value={ manualActivity.budget || dataManualActivity.Budget } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                onValueChange={ ( values ) => {
                                    const {formattedValue, value} = values;
                                    setDataManualActivity({
                                        ...dataManualActivity,
                                        Budget: +value,
                                    });
                                } }
                                renderText={ valueRender => (
                                    <TextInput
                                        editable={ ( openedType === 'edit' ) ? false : true }
                                        keyboardType="numeric"
                                        placeholder={ t( 'resPresupuesto' ) }
                                        placeholderTextColor="#666666"
                                        style={{
                                            ...commonStyles.textInput,
                                            ...commonStyles.textInputRegister,
                                            color: colors.text,    
                                        }}
                                        onChangeText={ ( value ) => 
                                            {
                                                setManualActivity({
                                                    ...manualActivity,
                                                    budget: value,
                                                });
                                                
                                            } 
                                        }
                                        value={ valueRender }
                                    />
                                )}
                            />
                        </View>

                        <View style={{
                            ...commonStyles.action,
                            marginTop: 40
                        }}>
                            <View style={{ 
                                ...commonStyles.icon,
                                backgroundColor: colors.primary,
                                
                            }}>
                                <FontAwesomeIcon 
                                    style={{ 
                                        color: buttonText
                                    }}
                                    icon={ faRoute }
                                    size={20} />
                            </View>
                            <TextInput
                                onChangeText={ ( value ) => {
                                    if ( openedType !== 'edit' ) {
                                        setManualActivity({
                                            ...manualActivity,
                                            note: value
                                        })
                                    } else {
                                        setDataManualActivity({
                                            ...dataManualActivity,
                                            Note: value
                                        })
                                    }
                                }}
                                placeholder={ t( 'resNota' ) }
                                placeholderTextColor="#666666"
                                style={{
                                    ...commonStyles.textInput,
                                    ...commonStyles.textInputRegister,
                                    color: colors.text,
                                    
                                }}
                                value={ manualActivity.note || dataManualActivity.Note }
                            />
                        </View>
                        
                        <View style={commonStyles.buttonCenter}>
                            <TouchableOpacity
                                onPress={ () => saveActivity() }
                                style={{
                                    ...commonStyles.entireButton,
                                    
                                }}>
                                <LinearGradient
                                    colors={[colors.primary, secondary]}
                                    style={ commonStyles.buttonSave }
                                >
                                    <Text style={[commonStyles.buttonText, {
                                        color: buttonText
                                    }]}>{ t( 'resGuardar' ) }</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            {
                                loading &&  
                                <ActivityIndicator
                                    size="large"
                                    animating={ true }
                                    color={ colors.primary }
                                ></ActivityIndicator>
                            }
                            
                        </View>

            </Animatable.View>
            </View>
        </ScrollView>
    )
}
