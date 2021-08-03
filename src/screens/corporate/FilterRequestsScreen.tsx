import React, { useContext, useState } from 'react'
import { Header } from '../../components/common/Header';
import { useTranslation } from 'react-i18next';
import { RootStackParams } from '../../navigator/Navigator';
import { FilterActivitiesScreen } from '../viatics/FilterActivitiesScreen';
import { StackScreenProps } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { useUtils } from '../../hooks/common/useUtils';
import { styles } from '../../styles/filterStyle';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { CalendarSingleDate } from '../../components/common/CalendarSingleDate';
import Moment from 'moment';
import { DateObject } from 'react-native-calendars';
import Toast from 'react-native-toast-message';


interface Props extends StackScreenProps<RootStackParams, 'FilterRequestsScreen'>{};

export const FilterRequestsScreen = ({ navigation, route }: Props ) => {

    const [showcalendar, setShowcalendar] = useState(false);
    const [formFilter, setFormFilter] = useState({
        dateStart: '',
        dateEnd: '',
        state: 0,
        flow: ''
    });
    const { theme: { colors, secondary, buttonText, grayColor, fieldColor, } } = useContext( ThemeContext );
    const { t } = useTranslation();
    const [scrollEnable, setScrollEnabled] = useState(true);
    const [minDate, setminDate] = useState('');
    const { scrollEnabled } = useUtils();
    const { alreadyFiltered, beforeFiltered } = route.params;
    const [state, setState] = useState([
        { label:  'Todos' , value: 'All',  selected: !beforeFiltered?.state },
        { label:  t( 'resReservado' ) , value: 1, selected: ( beforeFiltered?.state === 1 )  },
        { label: t( 'resEmitido' ), value: 2, selected:  ( beforeFiltered?.state === 2) },
        { label: t( 'resAnulado' ), value: 3, selected:  ( beforeFiltered?.state === 3) },
    ])

    const [flow, setFlow] = useState([
        { label:  'Todos' , value: 'All', selected: !beforeFiltered?.flow },
        { label:  t( 'resAprobado' ) , value: 'A', selected: ( beforeFiltered?.flow === 'A' ) },
        { label: t( 'resPendiente' ), value: 'P', selected: ( beforeFiltered?.flow === 'P' ) },
        { label: t( 'resRechazado' ), value: 'R', selected: ( beforeFiltered?.flow === 'R' ) },
        { label: t( 'resSinFlujo' ), value: '-', selected: ( beforeFiltered?.flow === '-' ) },
    ])

    const hideCalendar = ( show: boolean ) => {``
        setShowcalendar( show );
    }

    const setDate =  ( data: DateObject ) => {

        if ( formFilter.dateStart === '' ) {
            setFormFilter({
                ...formFilter,
                dateStart: data.dateString
            })
            setminDate( data.dateString );
        } else {
            setFormFilter({
                ...formFilter,
                dateEnd: data.dateString
            })
        }
    }
    
    const loadToast = ( messageError: string ) => {
        Toast.show({
            text1: 'Error',
            text2: messageError,
            type: 'error',
            visibilityTime: 1000,
        })
    }

    const validateFilters = ()  => {
        let formValidate: boolean = true;
        
        if ( formFilter.dateStart === '' && formFilter.dateEnd === '' && formFilter.state === 0 && formFilter.flow === '' ) {
            loadToast( t( 'resSeleccionaFechaOEstado' ) );
            formValidate = false;
        } else if ( formFilter.dateEnd !== '' && formFilter.dateStart === '' ) {
            loadToast( t( 'resIngreseFechaInicial' ) );
            formValidate = false;
        } else if ( formFilter.dateStart !== '' && formFilter.dateEnd === '' ) {
            loadToast( t( 'resIngreseFechaFinal' ) )
        }
        return formValidate;
    }

    const applyFilters = () => {
        if ( validateFilters() ) {
            navigation.navigate('MyServicesScreen', {
                dataFilter: formFilter
            })
        }
    }

    const calculateDatesValues = ( typeDate: 'start' | 'end' ) => {
        console.log( 'beforeFiltered', beforeFiltered );
        switch (typeDate) {
            case 'start':
                if ( formFilter.dateStart !== '' && beforeFiltered === undefined ) {
                   return Moment(formFilter.dateStart).format( 'll' )
                } else if ( beforeFiltered?.dateStart !== '' && alreadyFiltered ) {
                    return Moment(beforeFiltered?.dateStart).format( 'll' )
                } else if ( beforeFiltered?.dateStart === '' && alreadyFiltered ) {
                    return beforeFiltered.dateStart;
                } else if ( formFilter.dateStart === '' &&  beforeFiltered === undefined ) {
                    return formFilter.dateStart;
                }  
        
            case 'end':
                if ( formFilter.dateEnd !== '' &&  beforeFiltered === undefined ) {
                    return Moment(formFilter.dateEnd).format( 'll' )
                } else if ( beforeFiltered?.dateEnd !== '' && alreadyFiltered ) {
                    return Moment(beforeFiltered?.dateEnd).format( 'll' )
                } else if ( beforeFiltered?.dateEnd === '' && alreadyFiltered ) {
                    return beforeFiltered.dateEnd;
                } else if ( formFilter.dateEnd === '' && alreadyFiltered ) {
                    return formFilter.dateEnd;
                }  
           
            default:
                break;
        }


        return ''

    }

    const onSelectedState = (stateData: any, index: number) => {
        setFormFilter({
            ...formFilter,
            state: stateData.value
        }) 
        setState(
            state.map( item  => {
                return {
                    ...item,
                    selected: (state[index].value === item.value) ? !item.selected : (item.selected) ? !item.selected : item.selected
                }
            })
        )
    }

    const onSelectedFlow = (stateData: any, index: number) => {
        setFormFilter({
            ...formFilter,
            flow: stateData.value
        }) 
        setFlow(
            flow.map( item  => {
                return {
                    ...item,
                    selected: (flow[index].value === item.value) ? !item.selected : (item.selected) ? !item.selected : item.selected
                }
            })
        )
    }
    

    return (
        <>
            <Header
                title={ t( 'resFiltrar' ) }
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
                        <TouchableOpacity onPress={ () => applyFilters() }>
                            <DynamicText headline primaryColor numberOfLines={1}>
                                { t( 'resAplicar' ) }
                            </DynamicText>
                        </TouchableOpacity>
                        
                    )
                } }
            />
            
            <ScrollView
                scrollEnabled={scrollEnable}
                onContentSizeChange={(contentWidth, contentHeight) =>
                    setScrollEnabled(scrollEnabled(contentWidth, contentHeight))
                }
            >
                <View style={{padding: 20}}>
                    <DynamicText fontFamily='Raleway-SemiBold' headline semibold>
                        {t('resFecha').toUpperCase()}
                    </DynamicText>
                    <View style={styles.contentResultRange}>
                        <TouchableOpacity onPress={ () => hideCalendar( !showcalendar ) }>
                            <DynamicText  body1>{ t( 'resFechaInicio' ) }</DynamicText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => hideCalendar( !showcalendar ) }>
                            <DynamicText body1>{ t( 'resFechaFin' ) }</DynamicText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentRange}>
                        <DynamicText caption1 greyColor>
                            { calculateDatesValues( 'start' ) }
                        </DynamicText>
                        <DynamicText caption1 greyColor>
                            { calculateDatesValues( 'end' ) }
                        </DynamicText>
                    </View>
                    <View>
                        { showcalendar &&
                            <CalendarSingleDate minDate={ minDate } showCalendar={ hideCalendar } setDate={ setDate }></CalendarSingleDate>
                        }
                    </View>
                    <DynamicText fontFamily='Raleway-SemiBold' headline semibold style={{marginVertical: 20}}>
                        {t('resFlujo').toUpperCase()}
                    </DynamicText>
                    { flow.map(( item, index ) => {
                        return (
                            <TouchableOpacity
                                key={ index.toString() }
                                style={styles.lineCategory}
                                onPress={() =>  onSelectedFlow(item, index) }>
                                
                                <Icon 
                                    name={ item.selected ? 'checkmark-circle-outline' :  'ellipse-outline' }
                                    size={ 24 }
                                    color={ colors.primary }
                                />
                                <DynamicText body1 style={{marginLeft: 10}}>
                                    { item.label }
                                </DynamicText>
                            </TouchableOpacity>
                        )
                    })}
                    <DynamicText fontFamily='Raleway-SemiBold' headline semibold style={{marginVertical: 20}}>
                        {t('resEstado').toUpperCase()}
                    </DynamicText>
                    { state.map(( item, index ) => {
                        return (
                            <TouchableOpacity
                                key={ index.toString() }
                                style={styles.lineCategory}
                                onPress={() => onSelectedState(item, index) }>
                                
                                <Icon 
                                    name={ item.selected ? 'checkmark-circle-outline' :  'ellipse-outline' }
                                    size={ 24 }
                                    color={ colors.primary }
                                />
                                <DynamicText body1 style={{marginLeft: 10}}>
                                    { item.label }
                                </DynamicText>
                            </TouchableOpacity>
                        )
                    })}
                    { alreadyFiltered &&
                        <View style={ commonStyles.rightButtonContainer }>
                            <TouchableOpacity
                                onPress={ () => navigation.navigate('MyServicesScreen', {
                                    dataFilter: undefined
                                } )}
                                style={{...commonStyles.rightButton, marginRight: 0,}}>
                                <LinearGradient
                                    colors={[colors.primary, secondary]}
                                    style={{ 
                                        ...commonStyles.rightButton,
                                        marginRight: 0,
                                        flexDirection: 'row'
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{ 
                                            color: buttonText
                                        }}
                                        icon={ faMinusSquare }
                                        size={20} />
                                    <DynamicText fontFamily='Raleway-SemiBold' headline style={[commonStyles.buttonText, {
                                        marginLeft: 5,
                                        color:'#fff',
                                        textAlign: 'center'
                                    }]}>{ t( 'resLimpiarFiltros' ) }</DynamicText>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </ScrollView>
        </>
    )
}

