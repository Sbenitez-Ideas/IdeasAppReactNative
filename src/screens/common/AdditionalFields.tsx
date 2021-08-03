import React, { useContext } from 'react'
import { View } from 'react-native'
import { DynamicText } from '../../components/common/DynamicText'
import { DynamicFields } from '../../model/classes/corporate/DynamicFields'
import { commonStyles } from '../../styles/commonStyles'
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useFont } from '../../hooks/common/useFont';
import { useTranslation } from 'react-i18next'

interface Props {
    fields: DynamicFields[]
}

export const AdditionalFields = ( { fields }: Props ) => {

    const { t } = useTranslation();
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, accent} } = useContext( ThemeContext );
    const { semibold, bold } = useFont();

    return (
        <View style={[ commonStyles.reviewContainer, { backgroundColor: accent } ]}>
            <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ t( 'resCamposAdicionales' ) }</DynamicText>
            <View style={[ commonStyles.basicCard, { margin: 10, borderBottomWidth: 1, borderBottomColor: colors.primary, paddingBottom: 5 }]}>
                <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: colors.primary }}>{ t( 'resNombre' ) }</DynamicText>
                <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: colors.primary }}>{ t( 'resValor' )}</DynamicText>
            </View>
            {
                fields.map( ( field, index ) => {
                    if ( field.Hidden === 'V' ) {
                        return( 
                            
                            <View key={ index } style={[ commonStyles.basicCard, { margin: 10, borderBottomWidth: ( fields.length === index + 1 ? 0 : 1 ), borderBottomColor: colors.primary, paddingBottom: 5 }]}>
                                <DynamicText>{ field.Caption }</DynamicText>
                                <DynamicText>{ field.DefaultValue }</DynamicText>
                            </View>

                        )
                    }
                })
            }
        </View>
    )
}
