import { ImageSourcePropType } from "react-native";
import { useTranslation } from 'react-i18next';

export interface Slide {
    title: string;
    desc: string;
    img: ImageSourcePropType
}



export const slidesItems = () => {
    const { t } = useTranslation();
    return [
        {
            title: t( 'resViajaReservaApp' ),
            desc: t( 'resAppPodras' ),
            img: require('../../../../assets/images/common/travelers.png')
        },
        {
            title: t( 'resVariedadServicios' ),
            desc: t( 'resAppPuedes' ),
            img: require('../../../../assets/images/common/services.png')
        },
        {
            title: t( 'resEnfoqueCorporativo' ),
            desc: t( 'resEmpresasParaEmpresas' ),
            img: require('../../../../assets/images/common/business.png')
        },
    ]

}
