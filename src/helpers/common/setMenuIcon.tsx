import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCar, faDonate, faHiking, faHotel, faPlaneDeparture, faTired } from "@fortawesome/free-solid-svg-icons";

export const setMenuIcon = ( menuName: string /* 'flights' |  'hotels' | 'cars' | 'viatics' | 'activities' */ ): { icon: IconProp, route?: string, label: string } => {

    switch ( menuName ) {
        case 'flights':
            return {
                icon: faPlaneDeparture,
                route: '',
                label: 'Vuelos'
            };
        case 'hotels':
            return  {
                icon: faHotel,
                route: '',
                label: 'Hoteles'
            }
        case 'cars': {
            return {
                icon: faCar,
                route: '',
                label: 'Autos'
            }
        }
        case 'viatics':
            return {
                icon: faDonate,
                route: '',
                label: 'Viaticos'
            }
        case 'activities':
            return {
                icon: faHiking,
                route: '',
                label: 'Actividades'
            }
        default:
            return {
                icon: faTired,
                label: 'not-found'
            };
    }


}
