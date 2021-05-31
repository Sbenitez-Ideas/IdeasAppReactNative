export const setStateBookingList = ( state: string ) => {
    switch (state) {
        case '1':
            return 'resReservado';
        case '2':
            return 'resEmitido';
        case '3':
            return 'resCancelado';
        default:
            return 'desconocido';
    }
}