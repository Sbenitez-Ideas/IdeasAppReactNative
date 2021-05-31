import React, { useContext } from 'react'
import { Text, View, StyleSheet } from 'react-native';
import { RequestExpenses } from '../../../model/interfaces/expenses/RequestExpenses';
import { ThemeContext } from '../../../contexts/theme/ThemeContext';
import { commonStyles } from '../../../styles/commonStyles';
import { DynamicText } from '../../../components/common/DynamicText';
import { useFont } from '../../../hooks/common/useFont';
import Moment from 'moment';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';

interface Props {
    viatic: RequestExpenses
}

export const ReviewViaticsScreen = ( { viatic }: Props ) => {
    console.log('viatic', viatic)
    const { t } = useTranslation();
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, accent} } = useContext( ThemeContext );
    const { semibold, bold } = useFont();

    return (
        <View style={[ commonStyles.reviewContainer, { backgroundColor: accent } ]}>
            <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ t( 'resViaticos' ) }</DynamicText>
            <DynamicText fontFamily={ semibold } style={{ alignSelf: 'center', color: colors.primary }}> { Moment( viatic.startDate ).format( 'ddd DD MMM YYYY' )  } - { Moment( viatic.finalDate ).format( 'ddd DD MMM YYYY' ) } </DynamicText>
            <View style={ styles.labelInfo }>
                <DynamicText fontFamily={ semibold }> Numero de dias: </DynamicText>
                <DynamicText>{ viatic.days }</DynamicText>
            </View>
            <View style={ styles.labelInfo }>
                <DynamicText fontFamily={ semibold }> Total Manutencion: </DynamicText>
                <NumberFormat value={ viatic.expenseDefault?.FoodValue } displayType='text' thousandSeparator={ true } prefix='$'
                    renderText={ valueRender => (
                        <DynamicText>{ valueRender }</DynamicText>
                    )}
                />
            </View>
            <View style={ styles.labelInfo }>
                <DynamicText fontFamily={ semibold }> Total transporte: </DynamicText>
                <NumberFormat value={ viatic.expenseDefault?.TaxisValue  } displayType='text' thousandSeparator={ true } prefix='$'
                    renderText={ valueRender => (
                        <DynamicText>{ valueRender }</DynamicText>
                    )}
                />
            </View>
            
            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', marginHorizontal: 10 }}>
                <DynamicText fontFamily={ semibold }> Total Viáticos: </DynamicText>
                <NumberFormat value={ viatic.expenseDefault?.ExpensesValue } displayType='text' thousandSeparator={ true } prefix='$'
                    renderText={ valueRender => (
                        <DynamicText>{ valueRender }</DynamicText>
                    )}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    labelInfo: {
        marginHorizontal: 10,
        fontSize: 15,
        marginTop: 15,
        flexDirection: 'row'
    }
})