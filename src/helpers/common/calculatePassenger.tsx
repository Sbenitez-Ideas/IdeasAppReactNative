
export const calculatePassenger = ( passenger: string ) => {
    switch (passenger) {
        case 'ADT':
            return 'resAdulto(s)';
        case 'CHD':
            return 'resNiño(s)';
        case 'INF':
            return 'resInfante(s)'
        default:
            return 'resAdulto(s)';
    }
}