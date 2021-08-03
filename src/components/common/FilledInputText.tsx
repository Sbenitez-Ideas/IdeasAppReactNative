import React, { useContext } from 'react'
import { FilledTextField } from 'rn-material-ui-textfield';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useFont } from '../../hooks/common/useFont';

interface Props {
    disabled: boolean,
    label: string,
    onChangeText?: ( value: string ) => void,
    value: string,
    onBlur?: () => void,
    keyboardType?: any,
    title?: string
}

export const FilledInputText = ( { disabled, label, title, onChangeText, value, onBlur, keyboardType }: Props ) => {

    const { regular } = useFont();
    const { theme: { colors, fieldColor, accent } } = useContext( ThemeContext );

    return (
        <FilledTextField
            keyboardType={ keyboardType }
            disabled={ disabled }
            label={ label }
            title={ title }
            tintColor={ colors.primary }
            baseColor={ colors.primary }
            titleTextStyle={{ fontFamily: regular }}
            labelTextStyle={{ fontFamily: regular }}
            labelFontSize={ 18 }
            fontSize={ 14 }
            inputContainerStyle={{ borderBottomWidth: 0.4, borderBottomColor: colors.primary, backgroundColor: fieldColor, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}
            disabledLineWidth={ 0 }
            activeLineWidth={ 0 }
            lineWidth={ 0 }
            contentInset={{ top: 10 }}
            onBlur={ onBlur }
            onChangeText={ ( value ) => ( onChangeText !== undefined )  && onChangeText( value ) }
            value={ value }
        />
    )
}
