

export const setExpenseType = ( paymentType: string ) => {
    switch ( paymentType ) {
        case 'C':
            return  'Efectivo';
        case 'R':
            return 'Tarjeta de Crédito Corporativa';
        case 'B':
            return 'Efectivo / Tarjeta de Crédito Corporativa';
        case 'P':
            return 'Recursos Propios';
        case 'D':
            return 'Tarjeta Débito';
    }
}