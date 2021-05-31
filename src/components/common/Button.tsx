import React, { useContext } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { FontWeight, Typography } from '../../config/typography';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from './DynamicText';

interface Props {
    style?: Array<any>,
    styleText?: any,
    icon?: any,
    outline?: boolean,
    full?: boolean,
    round?: boolean,
    loading?: boolean,
    children?: any,
    onPress: () => any
}

const { theme: { colors, whiteColor } } = useContext( ThemeContext );
export const Button = ({  
    style,
    styleText,
    icon,
    outline,
    full,
    round,
    loading,
    children,
    onPress }: Props) => {
    return (
        <TouchableOpacity
            { ...onPress() }
            style={StyleSheet.flatten([
            [styles.default, { backgroundColor: colors.primary }],
            outline && [
                styles.outline,
                { backgroundColor: colors.card, borderColor: colors.primary }
            ],
            full && styles.full,
            round && styles.round,
            style
            ])}
            activeOpacity={0.9}
        >
            {icon ? icon : null}
            <DynamicText
                style={StyleSheet.flatten([
                    styles.textDefault,
                    outline && { color: colors.primary },
                    styleText
                ])}
                numberOfLines={1}
            >
                {children || "Button"}
            </DynamicText>
            {loading ? (
            <ActivityIndicator
                size="small"
                color={outline ? colors.primary : whiteColor}
                style={{ paddingLeft: 5 }}
            />
            ) : null}
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    default: {
        height: 56,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    textDefault: {
        ...Typography.headline,
        color: whiteColor ,
        fontWeight: 'bold'
    },
    outline: {
        borderWidth: 1
    },
    
    full: {
        width: "100%",
        alignSelf: "auto"
    },
    round: {
        borderRadius: 28
    }
})
