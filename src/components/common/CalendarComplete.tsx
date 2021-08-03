import React, { useContext, useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { CalendarList, CustomMarking, DateObject, PeriodMarking } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { View, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { DynamicText } from './DynamicText';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFont } from '../../hooks/common/useFont';
import Moment from 'moment';

interface Props {
    showcalendar: ( index: number ) => void;
    captureDates: ( dates: {  startDate: string, endDate: string }, index: number ) => void;
    index: number
}

export const CalendarComplete = ({ showcalendar, captureDates, index }: Props ) => {

    const { theme: { colors, buttonText, secondary, whiteColor } } = useContext( ThemeContext );
    const { t } = useTranslation();
    const { semibold } = useFont();
    const [datesSelected, setDatesSelected] = useState<DateObject[]>([]);
    const [dataPeriod, setdataPeriod] = useState<{ markedDates: { [date: string]: PeriodMarking }, isStartDatePicked: boolean, isEndDatePicked: boolean, startDate: string, endDate: string }>({
        markedDates: {},
        isStartDatePicked: false,
        isEndDatePicked: false,
        startDate: '',
        endDate: ''
    })

    useEffect(() => {
        
        console.log( 'calendar complete', dataPeriod.markedDates )
        
    }, [dataPeriod.markedDates])

    const onDayPress = ( date: DateObject ) => {
        if ( !dataPeriod.isStartDatePicked ) {
            let markedDates: { [date: string]: PeriodMarking } = {};
            markedDates[ date.dateString ] = { startingDay: true, color: colors.primary, textColor: whiteColor }
            setdataPeriod({
                ...dataPeriod,
                markedDates: markedDates,
                isStartDatePicked: true,
                isEndDatePicked: false,
                startDate: date.dateString,
                endDate: ''
            })
        } else {
            let markedDates =  JSON.parse(JSON.stringify(dataPeriod.markedDates));
            let startDate = Moment(dataPeriod.startDate);
            let endDate = Moment(date.dateString);
            let range = endDate.diff(startDate, 'days')
            if (range > 0) {
                for (let i = 1; i <= range; i++) {
                    let tempDate: any = startDate.add(1, 'day');
                    tempDate = Moment(tempDate).format('YYYY-MM-DD')
                    if (i < range) {
                        markedDates[tempDate] = { color: colors.primary, textColor: whiteColor };
                    } else {
                        markedDates[tempDate] = { endingDay: true, color: colors.primary, textColor: whiteColor };
                    }
                }

                setdataPeriod({
                    ...dataPeriod,
                    markedDates: markedDates,
                    isStartDatePicked: false,
                    isEndDatePicked: true,
                    endDate: date.dateString
                })
            } else {
                console.error('Select an upcomming date!');
            }
        }
    }

    return (
        
        <Modal
            key={ 'complete' }
            swipeDirection="right"
            /* onSwipeComplete={ null } */
            onModalHide={ () => console }
            isVisible={ true }
        >
            <Animatable.View
                animation="fadeIn"
                style={{ marginBottom: 15, maxHeight: '100%', backgroundColor: colors.background, borderRadius: 10, paddingBottom: 103 }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <TouchableOpacity style={ commonStyles.rightButtonContainer }
                        onPress={ () => showcalendar( index ) }
                    >
                        <FontAwesomeIcon 
                            icon={ faTimes }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ () =>  {
                            captureDates( { startDate: dataPeriod.startDate, endDate: dataPeriod.endDate }, index ) 
                            showcalendar( index )
                        }}
                    >
                        <DynamicText headline primaryColor numberOfLines={1}>
                                { t( 'resAplicar' ) }
                            </DynamicText>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                    <View>
                        <DynamicText fontFamily={ semibold } headline primaryColor numberOfLines={1}>
                            { t( 'resIda' ).toUpperCase() }
                        </DynamicText>
                    </View>
                    <View>
                        <DynamicText fontFamily={ semibold } headline primaryColor numberOfLines={1}>
                            { t( 'resVuelta' ).toUpperCase() }
                        </DynamicText>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <DynamicText caption1 greyColor 
                        style={{ fontSize: 13, alignSelf: 'center' }}
                    >
                        { ( dataPeriod.startDate !== '' ) ? Moment(dataPeriod.startDate).format( 'll' ) : '' }
                    </DynamicText>
                    <DynamicText caption1 greyColor 
                        style={{ fontSize: 13, alignSelf: 'center' }}
                    >
                        { ( dataPeriod.endDate !== '' ) ? Moment(dataPeriod.endDate).format( 'll' ) : '' }
                    </DynamicText>
                </View>
                
                <CalendarList
                    minDate={ new Date()  }
                    markingType={ 'period' }
                    monthFormat={"MMMM yyyy"}
                    markedDates={ dataPeriod.markedDates }
                    onDayPress={ onDayPress }
                    /* theme={{
                        arrowColor: colors.primary,
                        selectedDayTextColor: buttonText,
                        todayTextColor: secondary,
                    }} */
                />
            </Animatable.View>

        </Modal>
            
    )
}
