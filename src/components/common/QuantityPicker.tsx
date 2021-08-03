import React, { useContext, useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from './DynamicText';

interface Props {
    style?: any,
    label: string,
    detail: string,
    values: number
}

export const QuantityPicker = ( { style, label, detail, values }: Props ) => {

    const [value, setValue] = useState(values);

    const {theme:{ colors, fieldColor, grayColor } } = useContext( ThemeContext );

    return (
        <View
            style={[styles.contentPicker, { backgroundColor: colors.card }, style]}
        >
            <DynamicText body1 numberOfLines={1} style={{ marginBottom: 5 }}>
                { label }
            </DynamicText>
            <DynamicText caption1 light style={{ marginBottom: 5 }}>
                { detail }
            </DynamicText>
            <TouchableOpacity onPress={() => console.log( 'up' )}>
                <Icon name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
            <DynamicText title1>{ value }</DynamicText>
            <TouchableOpacity onPress={() => console.log("down")}>
                <Icon name="remove-circle" size={24} color={ grayColor } />
            </TouchableOpacity>
    </View>
    )
}


const styles = StyleSheet.create({
    contentPicker: {
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: "center"
    }
})