import { MenuInfo } from '../../interfaces/common/MenuInfo';
import { 
    faPlaneDeparture, 
    faPlane, 
    faGlobeAmericas, 
    faSuitcaseRolling, 
    faHandsHelping, 
    faCalendarPlus, 
    faDonate,
    faComments,
    faShip
} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { useTranslation } from 'react-i18next';

export const getHomeMenu = (): MenuInfo[] => {
    const { t } = useTranslation();
    const { userData: { IDEntityDefault } } = useContext( AuthContext );

    const validateMenus = (): boolean => {
        return ( IDEntityDefault === 33062 ) ? true : false;
    }

    const menus: MenuInfo[] = [
        {
            label: t( 'resSolicitudViaje' ),
            route: 'travel-request',
            icon: faPlane,
            external: ''
        },
        {
            label: ( validateMenus() ) ? t( 'resComoUsarIlisto' ) : t( 'resSolicitudGastos' ),
            route: ( validateMenus() ) ? '' : 'HomeViaticsScreen',
            icon: ( validateMenus() )  ? faSuitcaseRolling : faDonate,
            external:  ( validateMenus() ) ? 'https://docs.zoho.com/folder/7lcp7f8c3b51bfd7841ed8d81314a1266e2fb' : ''
        },
        {
            label: ( validateMenus() ) ? t( 'resAsistenciaInternacional' ) : 'Check-In',
            route: ( validateMenus() ) ? '' : 'CheckinScreen',
            icon: ( validateMenus() ) ?  faGlobeAmericas : faPlaneDeparture,
            external: 'https://www.davivienda.com/wps/portal/personas/nuevo/personas/aqui_puedo/comprar_lo_que_deseo/asistencias_y_beneficios/asistencias_internacionales/df38a1e1-62a9-448d-ad5c-7536876ca1eb/!ut/p/z1/pZJfa8IwFMU_UbhJk-bPYy1W29KJ61yXvIzY6ijTWsZQ9u2X-jBwYip43y45v5N7DxcMvIHp7LH9sN_tobM712vD36lcsqdsEhS5yiSOCpXEL1FB05RDdSkoE0WdAJdxpBZkVoZgHuFzdslf23t5nJOH-MUsuI_HNyrCY_wr6AnoXY9Tfvo_zHVaxv9XBWZMYrwDDXn7BOdAfYJzYl6HRIB2a4rbawqoju3mBKvu8LV3N1gOjn3dNqCbLZWWbAjigVWIMdkg24Q1EiHlUvDava1hjiEbPbv4L3RDoN-vhup-0OfzdFtMKTPLXwo0fXc!/dz/d5/L2dBISEvZ0FBIS9nQSEh/'
        },
        {
            label: ( validateMenus() ) ? 'Check-In' : t( 'resAyudaLinea' ),
            route: ( validateMenus() ) ? 'CheckinScreen' : 'HomeHelpScreen',
            icon: ( validateMenus() ) ? faPlaneDeparture : faComments,
        },
        {
            label: ( validateMenus() ) ? t( 'resNecesitasAyuda' ) : t( 'resHerramientas' ),
            route: ( validateMenus() ) ? 'Questions' : 'HomeToolsScreen',
            icon: ( validateMenus() ) ? faHandsHelping  : faHandsHelping,
        },
        {
            label: ( validateMenus() ) ? t( 'resGastos' ) : t( 'resViajesVacacionales' ),
            route: ( validateMenus() ) ? 'HomeViaticsScreen' : '',
            icon: ( validateMenus() ) ? faCalendarPlus : faShip,
            external: 'https://aeroviajespacifico.co/salidas-especiales/'
        }
    ]


    return menus;
}