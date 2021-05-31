import React, { useEffect } from 'react'
import { StatusBar, TouchableOpacity, View, StyleSheet } from 'react-native';
import { DynamicText } from './DynamicText';

interface Props {
    style?: any,
    styleLeft?: Array<any>,
    styleCenter?: Array<any>,
    styleRight?: Array<any>,
    styleRightSecond?: Array<any>,
    title?: string,
    subTitle?: string,
    onPressLeft?:() => any,
    onPressRight?: () => any,
    onPressRightSecond?: () => any,
    renderLeft?:() => JSX.Element,
    renderRightSecond?:() => any,
    renderRight?:() => any,
    barStyle?: string
}

export const Header = ({
    style,
    styleLeft,
    styleCenter,
    styleRight,
    styleRightSecond,
    title,
    subTitle,
    onPressLeft,
    onPressRight,
    onPressRightSecond,
    renderLeft,
    renderRightSecond,
    renderRight,
    barStyle
}: Props) => {



    return (
        <View style={[styles.contain, style]}>
            <View style={{flex: 1}}>
                <TouchableOpacity
                    style={[styles.contentLeft, styleLeft]}
                    onPress={onPressLeft}>
                    {renderLeft !== undefined && renderLeft()}
                </TouchableOpacity>
            </View>
            <View style={[styles.contentCenter, styleCenter]}>
                <DynamicText headline numberOfLines={1}>
                {title}
                </DynamicText>
                {subTitle !== undefined && (
                <DynamicText caption2 light>
                    {subTitle}
                </DynamicText>
                )}
            </View>
            <View style={styles.right}>
                <TouchableOpacity
                    style={[styles.contentRightSecond, styleRightSecond]}
                    onPress={onPressRightSecond}>
                    { renderRightSecond !== undefined && renderRightSecond() }
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.contentRight, styleRight]}
                    onPress={onPressRight}>
                    { renderRight !== undefined && renderRight() }
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    contain: { height: 45, flexDirection: 'row' },
  contentLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: 60,
  },
  contentCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 20,
    height: '100%',
  },
  contentRightSecond: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
  right: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})