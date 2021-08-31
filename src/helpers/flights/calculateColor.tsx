export const calculateColor = ( type: string ) => {
    switch ( type ) {
        case 'XS':
            return '#008BFF' 
        case 'S':
            return '#99CC33';
        case 'M':
            return '#00B5AE';
        case 'L':
            return '#FFA500';
        case 'XL':
            return '#301934';
        case 'XXL':
            return '#D236BB';
        default:
            return '#008BFF';
    }
}