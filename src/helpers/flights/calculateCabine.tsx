import { CabinType } from '../../model/enums/CabinType';
export const calculateCabine = ( cabine: { name: string, value: string } ) => {

    switch (cabine.value) {
        case '-1':
            return CabinType.All;
        case 'Economica':
            return CabinType.Economy;
        case 'EconomicaPremium':
            return CabinType.PremiumEconomy;
        case 'Primeira':
            return CabinType.FirstClass;
        case 'Executiva':
            return CabinType.Business;
        default:
            return CabinType.All;
    }
}