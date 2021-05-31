import { faPlane, faCar, faHotel, faMoneyCheckAlt, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';


export const getServiceIcon = ( product: string ) => {
    switch ( product ) {
        case 'AEREO':
            return faPlane;
        case 'AUTO':
            return faCar;
        case 'HOTEL':
            return faHotel;
        case 'VIATICO':
            return faMoneyCheckAlt;
    
        default:
            return faExclamationCircle;
    }
}