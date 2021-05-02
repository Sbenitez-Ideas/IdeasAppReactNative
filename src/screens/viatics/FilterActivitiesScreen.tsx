import React, { useContext, useState } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles'
import { color } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { loginStyles } from '../../styles/loginStyles';
import { faCalendar, faMinusSquare, faThLarge } from '@fortawesome/free-solid-svg-icons';
import LinearGradient from 'react-native-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import DropDownPicker from 'react-native-dropdown-picker';
import { CalendarSingleDate } from '../../components/common/CalendarSingleDate';
import { DateObject } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { GActivities } from '../../interfaces/viatics/GActivities';
import Moment from 'moment';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<RootStackParams, 'FilterActivitiesScreen'>{};

export const FilterActivitiesScreen = ({ navigation, route }: Props) => {
    const { t } = useTranslation();
    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const [minDate, setminDate] = useState('');
    const [formFilter, setFormFilter] = useState({
        dateStart: '',
        dateEnd: '',
        state:''
    })

    const [showcalendar, setShowcalendar] = useState(false);
    const { activities, alreadyFiltered, beforeFiltered } = route.params;

    const hideCalendar = ( show: boolean ) => {
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
        /* setRegisterForm({
            ...registerForm,
            date: data.dateString
        })
        setExpense({
            ...expense,
            Date: new Date(data.dateString)
        }) */
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
                    } else if ( formFilter.dateStart === '' ) {
                        return formFilter.dateStart;
                    } else if ( beforeFiltered?.dateStart !== '' && alreadyFiltered ) {
                        return Moment(beforeFiltered?.dateStart).format( 'll' )
                    } else if ( beforeFiltered?.dateStart === '' && alreadyFiltered ) {
                        return beforeFiltered.dateStart;
                    }
            
                case 'end':
                    if ( formFilter.dateEnd !== '' && beforeFiltered === undefined ) {
                        return Moment(formFilter.dateEnd).format( 'll' )
                    } else if ( formFilter.dateEnd === '' ) {
                        return formFilter.dateEnd;
                    } else if ( beforeFiltered?.dateEnd !== '' && alreadyFiltered ) {
                        return Moment(beforeFiltered?.dateEnd).format( 'll' )
                    } else if ( beforeFiltered?.dateEnd === '' && alreadyFiltered ) {
                        return beforeFiltered.dateEnd;
                    }

                default:
                    break;
            }


            return ''

        
    }
    
    return (
        <ScrollView>
                <View style={{
            ...commonStyles.container,
            alignItems: 'stretch',
        }}>
            <Text style={{ 
                    ...commonStyles.title,
                    color: colors.primary,
                    marginBottom: 20,
                }}>
                   { t( 'resActividadesGastos' ) }     
            </Text>

            { alreadyFiltered &&
                <View style={ commonStyles.rightButtonContainer }>
                    <TouchableOpacity
                        onPress={ () => navigation.navigate('ActivitiesListScreen',{
                            type: 'allActivities',
                            dataFilter: undefined
                        } )}
                        style={commonStyles.rightButton}>
                        <LinearGradient
                            colors={[colors.primary, secondary]}
                            style={{ 
                                ...commonStyles.rightButton,
                                flexDirection: 'row'
                            }}
                        >
                            <FontAwesomeIcon
                                style={{ 
                                    color: buttonText
                                }}
                                icon={ faMinusSquare }
                                size={20} />
                            <Text style={[commonStyles.buttonText, {
                                marginLeft: 5,
                                color:'#fff'
                            }]}>{ t( 'resLimpiarFiltros' ) }</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            }

            <View style={{ 
                ...styles.subtitleContainer,
                borderBottomColor: colors.primary
            }}>

                <Icon
                    name="filter"
                    color={ colors.primary }
                    size={ 50 }
                />
                <Text style={{ 
                    ...styles.titleFilter,
                    color: colors.primary
                }}>{ t( 'resFiltrar' ) }</Text>
            </View>

            <Animatable.View
                style={[loginStyles.footer, {
                    backgroundColor: colors.background,
                    marginBottom: 60
                    }]}
                animation="fadeInUpBig">
                    <View style={{ flexDirection: 'row' }}>
                    <View style={{ 
                            ...styles.icon,
                            backgroundColor: colors.primary,
                            
                        }}>
                            <FontAwesomeIcon 
                                style={{ 
                                    color: buttonText
                                }}
                                icon={ faThLarge }
                                size={20} />
                        </View>
                        <DropDownPicker
                            defaultValue={ beforeFiltered?.state }
                            dropDownMaxHeight={ 200 }
                            placeholder={ t( 'resEstado' ) }
                            labelStyle={{ 
                                color: '#666666',
                                fontSize: 20
                            }}
                            items={ [
                                {label:  t( 'resEnviadoLegalizar' ) , value: 'R'},
                                {label: t( 'resPendienteLegalizar' ), value: 'P'},
                                {label: t( 'resCerrado' ), value: 'F'},
                                {label: t( 'resPreAprobador' ), value: 'X'},
                                {label: t( 'resJustificar' ), value: 'F'},
                                {label: t( 'resAprobado' ), value: 'A'}
                            ]}
                            containerStyle={{ width: 300, height: 40}}
                            style={{
                                backgroundColor: colors.background,
                                borderColor: 'transparent',
                            }}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: colors.background}}
                            onChangeItem={(item) =>  setFormFilter({
                                ...formFilter,
                                state: item.value
                            }) }
                        />
                    </View>

                    <View style={{
                        ...commonStyles.action,
                    }}>
                        <View style={{ 
                            ...styles.icon,
                            backgroundColor: colors.primary,
                            
                        }}>
                            <FontAwesomeIcon 
                                style={{ 
                                    color: buttonText
                                }}
                                icon={ faCalendar }
                                size={20} />
                        </View>
                        <TouchableOpacity
                            onPress={ () => hideCalendar( !showcalendar ) }
                        >
                            <TextInput
                                editable={ false }
                                autoCorrect={ false }
                                keyboardType="visible-password"
                                placeholder={ t( 'resFechaInicio' ) }
                                autoCapitalize="none"
                                placeholderTextColor="#666666"
                                style={{
                                    ...commonStyles.textInput,
                                    ...styles.textInput,
                                    color: colors.text,
                                }}
                                value={ calculateDatesValues( 'start' ) }
                            />
                        </TouchableOpacity>                        
                        
                        
                    </View>

                    { showcalendar &&
                        <CalendarSingleDate minDate={ minDate } showCalendar={ hideCalendar } setDate={ setDate }></CalendarSingleDate>
                    }

                    <View style={{
                        ...commonStyles.action,
                    }}>
                        <View style={{ 
                            ...styles.icon,
                            backgroundColor: colors.primary,
                            
                        }}>
                            <FontAwesomeIcon 
                                style={{ 
                                    color: buttonText
                                }}
                                icon={ faCalendar }
                                size={20} />
                        </View>
                        <TouchableOpacity
                            onPress={ () => hideCalendar( !showcalendar ) }
                        >
                            <TextInput
                                editable={ false }
                                autoCorrect={ false }
                                keyboardType="visible-password"
                                placeholder={ t( 'resFechaFin' ) }
                                autoCapitalize="none"
                                placeholderTextColor="#666666"
                                style={{
                                    ...commonStyles.textInput,
                                    ...styles.textInput,
                                    color: colors.text,
                                }}

                                value={ calculateDatesValues( 'end' ) }
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        ...styles.buttonsContainer
                    }}>
                        <TouchableOpacity 
                        onPress={ () => applyFilters() }
                        style={ styles.buttons }>
                        <LinearGradient
                            colors={[colors.primary, secondary]}
                            style={ styles.buttons }
                        >
                            <Text style={[loginStyles.textSign, {
                                color:'#fff'
                            }]}>{ t( 'resFiltrar' ) }</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={ () => navigation.goBack() }
                        style={ styles.buttons }>
                        <LinearGradient
                            colors={[colors.primary, secondary]}
                            style={ styles.buttons }
                        >
                            <Text style={[loginStyles.textSign, {
                                color:'#fff'
                            }]}>{ t( 'resCancelar' ) }</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    </View>
                </Animatable.View>
            
        </View>

        </ScrollView>
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
})