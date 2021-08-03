import { ImageSourcePropType } from "react-native";

export interface Slide {
    title: string;
    desc: string;
    img: ImageSourcePropType
}

export const items: Slide[] = [
    {
        title: 'Viaja y reserva desde nuestra app',
        desc: 'En esta app podrás realizar, la gestión de tus reservas y todo lo que podrias hacer desde la web pero desde la comidad de tu bolsillo',
        img: require('../../../../assets/images/common/travelers.png')
    },
    {
        title: 'Gran Variedad de servicios',
        desc: 'En la app puedes hacer reservas de vuelos, hoteles, actividades en el destino de tu vuelo, viáticos entre muchos servicios más',
        img: require('../../../../assets/images/common/services.png')
    },
    {
        title: 'Un enfoque corporativo',
        desc: 'De empresas para empresas, esta aplicación cuenta con todo lo necesario, para poder suplir las necesidades de nuestros clientes.',
        img: require('../../../../assets/images/common/business.png')
    },
]