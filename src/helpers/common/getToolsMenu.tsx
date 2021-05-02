import { faLightbulb, faMedkit, faPassport } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export const getToolsMenu = (): any[] => {
    const { t } = useTranslation();
    const menus: any[] = [
        {
            label: t( 'resDocumentosViaje' ),
            route: '',
            icon: faPassport,
            external: 'https://aeroviajespacifico.co/documentacion-de-viaje/'
        },
        {
            label: t( 'resRestriccionesCovid' ),
            route: '',
            icon: faMedkit,
            external: 'https://aeroviajespacifico.co/covid-19/'
        },
        {
            label: t( 'resTipsViaje' ),
            route: '',
            icon: faLightbulb,
            external: 'https://aeroviajespacifico.co/tips-de-viaje/'
        },
        
    ]


    return menus;
}