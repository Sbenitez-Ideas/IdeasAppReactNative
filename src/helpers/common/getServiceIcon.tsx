import { faPlane, faCar, faMoneyCheckAlt, faExclamationCircle, faBed } from '@fortawesome/free-solid-svg-icons';


export const getServiceIcon = ( product: string ) => {
    switch ( product ) {
        case 'AEREO':
            return faPlane;
        case 'AUTO':
            return faCar;
        case 'HOTEL':
            return faBed;
        case 'VIATICO':
            return faMoneyCheckAlt;
    
        default:
            return faExclamationCircle;
    }
}