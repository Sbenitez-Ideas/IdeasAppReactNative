import React, { useContext } from 'react'
import { I18nManager, TextInput, View, StyleSheet } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext';


interface Props {
    style?: any,
    onChangeText?: ( value: string ) => void,
    onFocus?: ( ) => void,
    placeholder?: string,
    success?: true,
    value?: string,
    secureTextEntry?: boolean,
    keyboardType?: 'default',
    multiline?: boolean,
    textAlignVertical?: 'center',
    onSubmitEditing?: ( ) => void,
    editable?: boolean

}


export const DynamicTextInput = ({
    style,
    placeholder,
    onFocus,
    onChangeText,
    onSubmitEditing,
    value,
    success,
    secureTextEntry,
    keyboardType,
    multiline,
    textAlignVertical,
    editable
}: Props ) => {
    const { theme: { colors, grayColor, fieldColor } } = useContext( ThemeContext );

    return (
        <View style={[styles.textInput, { backgroundColor: fieldColor}, style ]}>
            <TextInput
                style={{
                    fontFamily: 'Raleway',
                    flex: 1,
                    height: '100%',
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                    color: colors.text,
                    paddingTop: 5,
                    paddingBottom: 5,
                }}
                editable={ editable }
                onChangeText={ text => (onChangeText !== undefined) && onChangeText( text ) }
                onFocus={ () => ( onFocus !== undefined ) && onFocus() }
                autoCorrect={ false }
                placeholder={ placeholder }
                placeholderTextColor={ grayColor }
                secureTextEntry={ secureTextEntry }
                value={value}
                selectionColor={colors.primary}
                keyboardType={ keyboardType }
                multiline={ multiline }
                textAlignVertical={ textAlignVertical }
                onSubmitEditing={ onSubmitEditing }
            />
        </View>
    )
}


const styles = StyleSheet.create({
    textInput: {
        height: 46,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
})