import { CurrencyTypes } from "../../model/classes/viatics/CurrencyTypes";


export const getCurrencyType = () => {
    const currencyType: Array<CurrencyTypes> = [
        
        {
            label: 'Pesos Colombianos',
            value: 'COP',
        },
        { 
            label: 'Dolar',
            value: 'USD'
        },
        {
            label: 'Euros',
            value: 'EUR'
        },
        { 
            label: 'Reales',
            value: 'BRL'
        },
        { 
            label: 'Peso Chileno',
            value: 'CLP'
        },
        { 
            label: 'Peso Argentino',
            value: 'ARS'
        },
        { 
            label: 'Peso Mexicano',
            value: 'MXN'
        },
        { 
            label: 'Quetzal',
            value: 'GTQ'
        },
        { 
            label: 'Nuevo Sol',
            value: 'PEN'
        },
        { 
            label: 'Boliviano',
            value: 'BOB'
        },
        { 
            label: 'Peso Uruguayo',
            value: 'UYU'
        },
        { 
            label: 'Bolivar Fuerte',
            value: 'VEF'
        },
        { 
            label: 'Guarani',
            value: 'PYG'
        },
        { 
            label: 'Córdoba Nicaragüense',
            value: 'NIO'
        },
        { 
            label: 'Peso Dominicano',
            value: 'DOP'
        },
        { 
            label: 'Colon Costaricence',
            value: 'CRC'
        },
        { 
            label: 'Lempira Hondureño',
            value: 'HNL'
        },
        { 
            label: 'Dólar Canadiense',
            value: 'CAD'
        },
        { 
            label: 'Rupia',
            value: 'INR'
        },
        { 
            label: 'Yen',
            value: 'JPY'
        },
        { 
            label: 'Yuan Chino',
            value: 'CNY'
        },
        { 
            label: 'Zloty',
            value: 'PLN'
        }
    ]


    return currencyType;
}