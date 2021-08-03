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
    const { t } = useTranslation();
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, accent} } = useContext( ThemeContext );
    const { semibold, bold } = useFont();

    return (
        <View style={[ commonStyles.reviewContainer, { backgroundColor: accent } ]}>
            <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ t( 'resViaticos' ) }</DynamicText>
            <DynamicText fontFamily={ semibold } style={{ alignSelf: 'center', color: colors.primary, ...styles.labelViatics }}> { Moment( viatic.startDate ).format( 'ddd DD MMM YYYY' )  } - { Moment( viatic.finalDate ).format( 'ddd DD MMM YYYY' ) } </DynamicText>
            <View style={ styles.labelInfo }>
                <DynamicText fontFamily={ semibold } style={{ ...styles.labelViatics, color: colors.primary }}> Numero de dias: </DynamicText>
                <DynamicText style={ styles.labelViatics }>{ viatic.days }</DynamicText>
            </View>
            <View style={ styles.labelInfo }>
                <DynamicText fontFamily={ semibold } style={{ ...styles.labelViatics, color: colors.primary }}> Total Manutencion: </DynamicText>
                <NumberFormat value={ viatic.expenseDefault?.FoodValue } displayType='text' thousandSeparator={ true } prefix='$'
                    renderText={ valueRender => (
                        <DynamicText style={ styles.labelViatics }>{ valueRender }</DynamicText>
                    )}
                />
            </View>
            <View style={ styles.labelInfo }>
                <DynamicText fontFamily={ semibold } style={{ ...styles.labelViatics, color: colors.primary }}> Total transporte: </DynamicText>
                <NumberFormat value={ viatic.expenseDefault?.TaxisValue  } displayType='text' thousandSeparator={ true } prefix='$'
                    renderText={ valueRender => (
                        <DynamicText style={ styles.labelViatics }>{ valueRender }</DynamicText>
                    )}
                />
            </View>
            
            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', marginHorizontal: 10 }}>
                <DynamicText fontFamily={ semibold } style={{ ...styles.labelViatics, color: colors.primary }}> Total Viáticos: </DynamicText>
                <NumberFormat value={ viatic.expenseDefault?.ExpensesValue } displayType='text' thousandSeparator={ true } prefix='$'
                    renderText={ valueRender => (
                        <DynamicText style={ styles.labelViatics }>{ valueRender }</DynamicText>
                    )}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    labelInfo: {
        marginHorizontal: 10,
        marginTop: 15,
        flexDirection: 'row'
    },
    labelViatics: {
        fontSize: 15
    }
})