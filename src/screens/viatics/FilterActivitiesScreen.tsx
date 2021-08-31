import React, { useContext, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faMinusSquare,  } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { CalendarSingleDate } from '../../components/common/CalendarSingleDate';
import { DateObject } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { GActivities } from '../../model/interfaces/viatics/GActivities';
import Moment from 'moment';
import Toast from 'react-native-toast-message';
import { Header } from '../../components/common/Header';
import { DynamicText } from '../../components/common/DynamicText';
import { useUtils } from '../../hooks/common/useUtils';

interface Props extends StackScreenProps<RootStackParams, 'FilterActivitiesScreen'>{};

export const FilterActivitiesScreen = ({ navigation, route }: Props) => {
    const { t } = useTranslation();
    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const [scrollEnable, setScrollEnabled] = useState(true);
    const [minDate, setminDate] = useState('');
    const [formFilter, setFormFilter] = useState({
        dateStart: '',
        dateEnd: '',
        state:''
    })
    const { scrollEnabled } = useUtils();
    const [showcalendar, setShowcalendar] = useState(false);
    const { activities, alreadyFiltered, beforeFiltered } = route.params;

    const hideCalendar = ( show: boolean ) => {
        setShowcalendar( show );
    }
    const [state, setState] = useState([
        { label:  t( 'resTodos' ) , value: 'All', selected: (!beforeFiltered?.state) },
        { label:  t( 'resEnviadoLegalizar' ) , value: 'R', selected: (beforeFiltered?.state === 'R') },
        { label: t( 'resPendienteLegalizar' ), value: 'P', selected: (beforeFiltered?.state === 'P') },
        { label: t( 'resCerrado' ), value: 'F', selected: (beforeFiltered?.state === 'F') },
        { label: t( 'resPreAprobador' ), value: 'X', selected: (beforeFiltered?.state === 'X') },
        { label: t( 'resJustificar' ), value: 'J', selected: (beforeFiltered?.state === 'J') },
        { label: t( 'resAprobado' ), value: 'A', selected: (beforeFiltered?.state === 'A') }
    ])
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
        
        if ( formFilter.dateStart === '' && formFilter.dateEnd === '' && formFilter.state === '' ) {
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
            const filterActivity: GActivities[] = [];
            activities.map( act => {
                if ( act.State === formFilter.state  ) {
                    filterActivity.push(act);
                }
            })
            navigation.navigate('ActivitiesListScreen', {
                type: 'filter',
                dataFilter: formFilter
            })
        }
    }

    const calculateDatesValues = ( typeDate: 'start' | 'end' ) => {
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
                    if ( formFilter.dateEnd !== '' && beforeFiltered === undefined ) {
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
                        {t('resEstado').toUpperCase()}
                    </DynamicText>
                    { state.map(( item, index ) => {
                        return (
                            <TouchableOpacity
                                key={ index.toString() }
                                style={styles.lineCategory}
                                onPress={() => onSelectedState(item, index)}>
                                
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
                                onPress={ () => navigation.navigate('ActivitiesListScreen',{
                                    type: 'allActivities',
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

const styles = StyleSheet.create({
    subtitleContainer: {
        marginLeft: 10,
        flexDirection: 'row',
        borderBottomWidth: 3,
    },
    titleFilter: {
        fontSize: 35
    },
    textInput: {
        fontSize: 20,
        paddingTop: 20,
        paddingLeft: 20
    },
    icon: {
        width: 40,
        textAlign: 'center',
        borderTopLeftRadius: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30
    },
    buttons: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    contentRange: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        marginTop: 10
      },
      contentResultRange: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
      },
      lineCategory: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
      }
})