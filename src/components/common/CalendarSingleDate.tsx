import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import { Calendar, DateObject } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles';
import { DynamicText } from './DynamicText';
import * as Animatable from 'react-native-animatable';

interface  Props{
    showCalendar: ( show: boolean ) => void;
    setDate: ( date: DateObject ) => void;
    minDate?: string;
    maxDate?: string;
}

export const CalendarSingleDate = ({ showCalendar, setDate, minDate, maxDate }: Props) => {  
    const { t } = useTranslation();
    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const [dateSelected, setDateSelected] = useState<DateObject>({
        day: 0,
        dateString: '',
        month: 0,
        timestamp: 0,
        year: 0
    });

    const setNewDate = ( ) => {
        setDate( dateSelected );
        showCalendar( false );
    }

    return (
        <Animatable.View
            animation='fadeIn'
            style={{ marginBottom: 15 }}
        >
            <Calendar
                minDate={ minDate }
                maxDate={ maxDate }
                markedDates={{
                    [ dateSelected.dateString ]: {selected: true, marked: true, selectedColor: colors.primary}
                }}
                onDayPress={ (day) => setDateSelected( day ) }
                theme={{
                    arrowColor: colors.primary,
                    selectedDayTextColor: buttonText,
                    todayTextColor: secondary,
                  }}
            >

            </Calendar>

           <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    onPress={ setNewDate }
                                    style={{
                                        ...commonStyles.entireButton,
                                    }}>
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={{ 
                                            ...commonStyles.smallButton,
                                            width: 150,
                                            height: 50
                                        }}
                                    >
                                        <DynamicText fontFamily='Raleway-SemiBold' headline style={[commonStyles.buttonText, {
                                            color: buttonText
                                        }]}>{ t( 'resAceptar' ) }</DynamicText>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={ () => showCalendar( false ) }
                                    style={{
                                        ...commonStyles.entireButton,
                                        
                                    }}>
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={{ 
                                            ...commonStyles.smallButton,
                                            width: 150,
                                            height: 50
                                        }}
                                    >
                                        <DynamicText fontFamily='Raleway-SemiBold' headline style={[commonStyles.buttonText, {
                                            color: buttonText
                                        }]}> { t( 'resCancelar' ) } </DynamicText>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
        </Animatable.View>
    )
}
