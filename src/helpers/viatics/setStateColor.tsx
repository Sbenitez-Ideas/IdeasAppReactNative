

export const setStateColor = ( state: string ): string => {
    switch (state) {
        case 'P':
            return '#ED7D00';
        case 'R':
            return '#0056FF';
        case 'A':
            return '#7ED321';
        case 'F':
            return '#417505';
        case 'J':
            return '#D0021B';
        case 'X':
            return '#039BE5';
        default:
            return 'Desconocido';
    }
}