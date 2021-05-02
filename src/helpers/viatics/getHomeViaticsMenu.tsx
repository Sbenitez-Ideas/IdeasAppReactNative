import { MenuInfo } from '../../interfaces/common/MenuInfo';
import { 
    faFileInvoiceDollar,
    faFileContract,
    faGavel,
    faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export const getHomeViaticsMenu = (): MenuInfo[] => {
    const { t } = useTranslation();

    const menus: MenuInfo[] = [
        {
            label: t( 'resRegistroGastos' ),
            route: 'RegisterExpensesScreen',
            icon: faFileInvoiceDollar
        },
        {
            label: t( 'resActividadesGastos' ),
            route: 'ActivitiesListScreen',
            icon: faFileContract,
            haveParameter: true,
            parameters: {type: 'allActivities'}
        },
        {
            label: t( 'resPendienteLegalizar' ),
            route: 'ActivitiesListScreen',
            icon: faGavel,
            haveParameter: true,
            parameters: {type: 'pendingLegalize'}
        },
        {
            label: t( 'resPendienteAprobar' ),
            route: 'ActivitiesListScreen',
            icon: faUserCheck,
            haveParameter: true,
            parameters: {type: 'pendingApprove'}
        }
    ]


    return menus;
}