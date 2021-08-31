import React, { useContext } from 'react'
import { StyleSheet, Text } from 'react-native';
import { FontWeight, Typography } from '../../config/typography';
import { ThemeContext } from '../../contexts/theme/ThemeContext';


const Roboto = {
    100: 'Thin',
    200: 'Thin',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'Medium',
    700: 'Bold',
    800: 'Bold',
    900: 'Black',
    normal: 'Regular',
    bold: 'Bold',
  };
  
  const Raleway = {
    100: '100',
    200: '200',
    300: '300',
    400: '400',
    500: '500',
    600: '500',
    700: '700',
    800: '800',
    900: '900',
    normal: 'Regular',
    bold: 'Bold',
  };
  
  const Merriweather = {
    100: 'Light',
    200: 'Light',
    300: 'Light',
    400: 'Regular',
    500: 'Regular',
    600: 'Bold',
    700: 'Bold',
    800: 'Bold',
    900: 'Black',
    normal: 'Regular',
    bold: 'Bold',
  };

interface Props {
    header?: boolean,
    title1?: boolean,
    title2?: boolean,
    title3?: boolean,
    headline?: boolean,
    body1?: boolean,
    body2?: boolean,
    callout?: boolean,
    subhead?: boolean,
    footnote?: boolean ,
    caption1?: boolean,
    caption2?: boolean,
    overline?: boolean,
    thin?: boolean,
    ultraLight?: boolean,
    light?: boolean,
    regular?: boolean,
    medium?: boolean,
    semibold?: boolean,
    bold?: boolean,
    heavy?: boolean,
    black?: boolean,
    primaryColor?: boolean,
    darkPrimaryColor?: boolean,
    lightPrimaryColor?: boolean,
    accentColor?: boolean,
    greyColor?: boolean,
    dividerColor?: boolean,
    whiteColor?: boolean,
    fieldColor?: boolean,
    numberOfLines?: number,
    textAlign?: boolean,
    style?: any,
    fontFamily?: string,
    children?: any,
}

export const DynamicText = ({ header,
    title1,
    title2,
    title3,
    headline,
    body1,
    body2,
    callout,
    subhead,
    footnote,
    caption1,
    caption2,
    overline,
    thin,
    ultraLight,
    light,
    regular,
    medium,
    semibold,
    bold,
    heavy,
    black,
    primaryColor,
    darkPrimaryColor,
    lightPrimaryColor,
    accentColor,
    greyColor,
    dividerColor,
    whiteColor,
    fieldColor,
    numberOfLines,
    textAlign,
    style,
    fontFamily,
    children } : Props ) => {    
    
    const { theme: { colors, secondary, grayColor, }, theme } = useContext( ThemeContext );
    let textStyle = StyleSheet.flatten([
        {fontFamily: (fontFamily) ? fontFamily : 'Raleway-Regular', textAlign},
        header && Typography.header,
        title1 && Typography.title1,
        title2 && Typography.title2,
        title3 && Typography.title3,
        headline && Typography.headline,
        body1 && Typography.body1,
        body2 && Typography.body2,
        callout && Typography.callout,
        subhead && Typography.subhead,
        footnote && Typography.footnote,
        caption1 && Typography.caption1,
        caption2 && Typography.caption2,
        overline && Typography.overline,
        //custom for font
        thin && {fontWeight: FontWeight.thin},
        ultraLight && {fontWeight: FontWeight.ultraLight},
        light && {fontWeight: FontWeight.light},
        regular && {fontWeight: FontWeight.regular},
        medium && {fontWeight: FontWeight.medium},
        semibold && {fontWeight: FontWeight.semibold},
        bold && {fontWeight: FontWeight.bold},
        heavy && {fontWeight: FontWeight.heavy},
        black && {fontWeight: FontWeight.black},
        // default color
        {color: colors.text},
        //custom for color
        primaryColor && {color: colors.primary},
        /* darkPrimaryColor && {color: theme.primaryDark},
        lightPrimaryColor && {color: theme.primaryLight}, */
        accentColor && {color: theme.accent},
        greyColor && {color: grayColor},
        dividerColor && {color: theme.dividerColor},
        whiteColor && {color: theme.whiteColor},
        fieldColor && {color: theme.fieldColor},
        style && style,
      ]);
    
      if (textStyle.fontFamily) {
        const fontStyle = textStyle.fontStyle == 'italic' ? 'Italic' : '';
        const fontWeight = textStyle.fontWeight ?? 400;
        switch (textStyle.fontFamily) {
          default:
            break;
        }
      }

    return (
        <Text style={{...textStyle, fontWeight: '600'}} numberOfLines={numberOfLines}>
            {children ?? ''}
        </Text>
    )
}
