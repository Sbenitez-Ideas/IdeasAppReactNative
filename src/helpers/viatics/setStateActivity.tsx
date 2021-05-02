import { useTranslation } from "react-i18next";


export const setStateActivity = ( state: string): string =>  {
    switch (state) {
        case 'P':
            return 'resPendienteLegalizar';
        case 'A':
            return 'resAprobado';
        case 'J': 
            return 'resJustificar';
        case 'X':
            return 'resPreAprobador';
        case 'F':
            return 'resCerrado' ;
        case 'R':
            return 'resEnviadoLegalizar';
        default:
            return 'resDesconocido';
    }
}