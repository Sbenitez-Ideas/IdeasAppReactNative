import { ItemType } from "react-native-dropdown-picker"

export const getPaymentType = ( ) => {
    const paymentType: Array<ItemType>  = [
        {
            label: 'Efectivo',
            value: 'C'
        },
        {
            label: 'Tarjeta Credito',
            value: 'R'
        },
        {
            label: 'Tarjeta Debito',
            value: 'D'
        },
        {
            label: 'Efectivo / Tarjeta Credito',
            value: 'B'
        },
        {
            label: 'Recursos Propios',
            value: 'P'
        }
    ]

    return paymentType;
}