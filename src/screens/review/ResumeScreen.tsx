import React, { useContext, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { RetrieveRS } from '../../model/classes/flights/envelopes/RetrieveRS'
import { RequestExpenses } from '../../model/interfaces/expenses/RequestExpenses'
import { HotelOfflineRequest } from '../../model/interfaces/hotel/HotelOfflineRequest'
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles'
import { DynamicText } from '../../components/common/DynamicText'
import { useFont } from '../../hooks/common/useFont';
import NumberFormat from 'react-number-format'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'
import { TouchableOpacity } from 'react-native-gesture-handler';


interface Props  {
    servicesData: {
        hotels: HotelOfflineRequest[]
        flights: RetrieveRS
        viatics: RequestExpenses
    }
}

export const ResumeScreen = ( { servicesData }: Props ) => {
    const { theme: { colors, whiteColor, buttonText, grayColor, lightDark, accent} } = useContext( ThemeContext );
    const [showResume, setShowResume] = useState(true);
    const { semibold, bold } = useFont();
    const [haveHotels, setHaveHotels] = useState(false);
    const [haveFlights, setHaveFlights] = useState(false);
    const [haveViatics, setHaveViatics] = useState(false);

    useEffect(() => {

        if ( servicesData.flights.BookingCode ) {
            setHaveFlights( true );
        }

        if ( servicesData.viatics.startDate ) {
            setHaveViatics( true );
        }

        if ( servicesData.hotels.length > 0 ) {
            setHaveHotels( true );
        }

    }, [])

    const calculateTotal = (): number => {
        let totalValue = 0;
        if ( haveFlights ) {
            totalValue+= servicesData.flights.Fares[0].FareAmount + servicesData.flights.Fares[0].TaxesAmount + servicesData.flights.Fares[0].FeeAmount;
        }
        if ( haveHotels ) {
            totalValue+= servicesData.hotels[0].hotel.Fare * servicesData.hotels[0].days;
        }
        if ( haveViatics ) {
            totalValue+= servicesData.viatics.expenseDefault.ExpensesValue;
        }

        return totalValue;
    }

    return (
        <>
            <View style={[ commonStyles.reviewContainer, { backgroundColor: accent } ]}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                    onPress={ () => setShowResume( !showResume ) }
                >
                    <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ 'Resumen de Servicios' }</DynamicText>
                    <FontAwesomeIcon
                        style={{ marginHorizontal: 10, marginVertical: 5  }}
                        icon={ ( !showResume ) ? faChevronCircleUp : faChevronCircleDown }
                        size={ 20 }
                        color={ colors.primary }
                    />
                </TouchableOpacity>
                
                { showResume &&
                    <View style={{ alignItems: 'center', justifyContent :'space-between' }}>
                        { haveFlights &&
                            <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 3, borderBottomColor: colors.primary }}>
                                <DynamicText fontFamily={ semibold } style={{ color: colors.text, fontSize: 17 }}> Vuelos  </DynamicText>
                                <NumberFormat value={ servicesData.flights.Fares[0].FareAmount + servicesData.flights.Fares[0].TaxesAmount + servicesData.flights.Fares[0].FeeAmount } displayType='text' thousandSeparator={ true } prefix='$'
                                    renderText={ valueRender => (
                                        <DynamicText style={{ fontSize: 17 }}>{ valueRender }</DynamicText>
                                    )}
                                />
                            </View>
                        }
                        { haveHotels &&
                            <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 3, borderBottomColor: colors.primary }}>
                                <DynamicText fontFamily={ semibold } style={{ color: colors.text, fontSize: 17  }}> Hoteles  </DynamicText>
                                <NumberFormat value={ servicesData.hotels[0].hotel.Fare * servicesData.hotels[0].days } displayType='text' thousandSeparator={ true } prefix='$'
                                    renderText={ valueRender => (
                                        <DynamicText style={{ fontSize: 17 }}>{ valueRender }</DynamicText>
                                    )}
                                />
                            </View>
                        }
                        { haveViatics &&
                            <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 3, borderBottomColor: colors.primary }}>
                                <DynamicText fontFamily={ semibold } style={{ color: colors.text, fontSize: 17 }}> Viáticos  </DynamicText>
                                <NumberFormat value={ servicesData.viatics.expenseDefault.ExpensesValue } displayType='text' thousandSeparator={ true } prefix='$'
                                    renderText={ valueRender => (
                                        <DynamicText style={{ fontSize: 17 }}>{ valueRender }</DynamicText>
                                    )}
                                />
                            </View>
                        } 
                        <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'flex-end' }}>
                                <DynamicText fontFamily={ semibold } style={{ color: colors.text, fontSize: 18 }}> Total  </DynamicText>
                                <NumberFormat value={ calculateTotal() } displayType='text' thousandSeparator={ true } prefix='$'
                                    renderText={ valueRender => (
                                        <DynamicText fontFamily={ semibold } style={{ fontSize: 18, color: lightDark }}>{ valueRender }</DynamicText>
                                    )}
                                />
                        </View>
                    </View>
                }
            </View>
            
        </>
    )
}
