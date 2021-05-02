import React, { createContext, useReducer } from 'react';
import { ThemeState, themeReducer, exitoTheme } from './themeReducer';


interface ThemeContextProps {
    theme: ThemeState;

}


export const ThemeContext = createContext({} as ThemeContextProps)

export const ThemeProvider = ({ children }: any) => {

    const [theme, dispatch] = useReducer(themeReducer, exitoTheme );

    const setCustomTheme = () => {
        /* dispatch({type: GLOBAL_THEME }) */
    }

    return (
        <ThemeContext.Provider value={{
            theme
        }}>
            { children }
        </ThemeContext.Provider>
    )
}