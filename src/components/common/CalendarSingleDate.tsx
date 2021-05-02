import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import { Calendar, DateObject } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles';

interface  Props{
    showCalendar: ( show: boolean ) => void;
    setDate: ( date: DateObject ) => void;
    minDate?: string;
}

export const CalendarSingleDate = ({ showCalendar, setDate, minDate }: Props) => {  
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
        <>
            <Calendar
                minDate={ minDate }
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
                                        <Text style={[commonStyles.buttonText, {
                                            color: buttonText
                                        }]}>{ t( 'resAceptar' ) }</Text>
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
                                        <Text style={[commonStyles.buttonText, {
                                            color: buttonText
                                        }]}> { t( 'resCancelar' ) } </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
        </>
    )
}
