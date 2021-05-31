

export const setStateColorBookingList = ( state: string ): string => {
    switch (state) {
        case '1':
            return '#0062CC';
        case '2':
            return '#218838';
        case '3':
            return '#C82333';
        default:
            return '#FFFFFF';
    }
}