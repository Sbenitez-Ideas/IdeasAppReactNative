import React, { useContext } from 'react'
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeContext';


interface Props {
    style?: any,
    children?: any,
    styleContent?: any,
    image?: any,
    onPress: () => void
}

export const Card = ({  style, children, styleContent, image, onPress }:Props ) => {
    const { theme: { colors, grayColor, fieldColor } } = useContext( ThemeContext );
    return (
        <TouchableOpacity
            style={[styles.card, {borderColor: colors.border}, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Image source={image} style={styles.imageBanner} />
            <View style={[styles.content, styleContent]}>{children}</View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    imageBanner: {flex: 1, borderRadius: 8, width: 230, height : 500 },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    content: {
        position: 'absolute',
        alignItems: 'flex-start',
        bottom: 0,
        padding: 10,
    },
});