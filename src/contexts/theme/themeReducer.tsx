import { Theme } from '@react-navigation/native';

type ThemeAction = 
    | { type: 'set_exito_theme' }
    | { type: 'set_blue_theme' }

export interface ThemeState extends Theme {
    currentTheme: 'exito' | 'blue',
    dividerColor: string;
    secondary: string;
    buttonText: string;
}


export const exitoTheme: ThemeState = {
    currentTheme: 'exito',
    dark: false,
    dividerColor: 'black',
    secondary: '#e21239',
    buttonText: 'white',
    colors: {
        primary: '#DC3545',
        background: 'white',
        card: 'white',
        text: 'black',
        border: '#DC3545',
        notification: 'red'

    }
}

export const themeReducer = ( state: ThemeState, action: ThemeAction): ThemeState => {
    switch (action.type) {
        case 'set_exito_theme':
            return  {
                ...exitoTheme,

            }
        default:
            return state;
            break;
    }
}
