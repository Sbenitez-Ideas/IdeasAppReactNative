import { Theme } from '@react-navigation/native';

type ThemeAction = 
    | { type: 'set_exito_theme' }
    | { type: 'set_blue_theme' }
    | { type: 'set_ideas_theme' }

export interface ThemeState extends Theme {
    currentTheme: 'exito' | 'blue' | 'ideas',
    dividerColor: string;
    secondary: string;
    buttonText: string;
    grayColor: string;
    whiteColor: string;
    fieldColor: string;
    accent: string;
    cancelColor: string
    backgroundDarken:string,
    grayDarken: string,
    lightDark: string,
    lightGray: string

}


export const exitoTheme: ThemeState = {
    currentTheme: 'exito',
    dark: false,
    grayColor: '#9B9B9B',
    buttonText: 'white',
    whiteColor: '#FFFFFF',
    fieldColor: '#F5F5F5',
    accent: '#4f4f4f',
    dividerColor: 'black',
    secondary: '#e21239',
    cancelColor: '#dc3545',
    backgroundDarken: "#e21239",
    grayDarken: '#757575',
    lightDark: '#474747',
    lightGray: '#e0e0e0',
    colors: {
        primary: '#DC3545',
        background: 'white',
        card: 'white',
        text: 'black',
        border: '#DC3545',
        notification: 'red'

    }
}


export const ideasTheme: ThemeState = {
    currentTheme: 'ideas',
    dark: false,
    secondary: '#63B4DE',
    grayColor: '#9B9B9B',
    buttonText: 'white',
    dividerColor: '#BDBDBD',
    whiteColor: '#FFFFFF',
    fieldColor: '#F5F5F5',
    accent: '#d9edf7',
    cancelColor: '#ff504d',
    backgroundDarken: "#176892",
    lightGray: '#e0e0e0',
    grayDarken: '#757575',
    lightDark: '#474747',
    colors: {
        primary: '#2195D1',
        background: 'white',
        card: '#F5F5F5',
        text: 'black',
        border: '#c7c7cc',
        notification: 'red'

    }
}

export const themeReducer = ( state: ThemeState, action: ThemeAction): ThemeState => {
    switch (action.type) {
        case 'set_exito_theme':
            return  {
                ...exitoTheme,

            }
        case 'set_ideas_theme':
            return  {
                ...ideasTheme
            }
        default:
            return state;
            break;
    }
}
