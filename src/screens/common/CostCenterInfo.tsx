import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { useFont } from '../../hooks/common/useFont';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles';
import { DynamicText } from '../../components/common/DynamicText';
import NumberFormat from 'react-number-format';

interface Props {
    costCenter: { 
        costCenter: string,
        percentage: number,
        index: number,
        percentageIndex: number,
        availableBudget: number,
        budgetSrc: string,
        budget: number,
        costCenterName: string,
    }[];
}

export const CostCenterInfo = ( { costCenter }: Props ) => {

    const { t } = useTranslation();
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, accent} } = useContext( ThemeContext );
    const { semibold, bold } = useFont();
    return (
        <>
            {
                costCenter.map(( item, index ) => {
                    return (
                        <View key={ index } style={[ commonStyles.reviewContainer, { backgroundColor: accent } ]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ t( 'resCentroCostos' ) }</DynamicText>
                            </View>
                        
                            <View style={{ ...styles.fatherContainer, marginTop: 20, backgroundColor: accent, borderRadius: 10 }}>
                                <View style={[ commonStyles.basicCard ]}>
                                    <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.primary, ...styles.cardText }}> { t( 'resNombre' ) } </DynamicText>
                                    <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.primary, ...styles.cardText }}> { t( 'resPresupuesto' ) } </DynamicText>
                                    <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.primary, ...styles.cardText }}>{ `${ t( 'resPorcentaje' ) } `}</DynamicText>
                                </View>
                                <View style={[ commonStyles.basicCard ]}>
                                    <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text, ...styles.cardText }}>{ item.costCenterName }</DynamicText>
                                    <NumberFormat value={ item.budget } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                        renderText={
                                            value => <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text, ...styles.cardText }}>{ value }</DynamicText>
                                        } 
                                    /> 
                                    <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text, ...styles.cardText }}>{ item.percentage }%</DynamicText>
                                </View>
                            </View>
                        </View>
                    )
                
                })
            }
        </>
    )
}


const styles = StyleSheet.create({

    fatherContainer: {
        width: '97%', 
        alignSelf: 'center',
        borderRadius: 10,
    
    },
    cardText: {
        margin: 5,
    },

})