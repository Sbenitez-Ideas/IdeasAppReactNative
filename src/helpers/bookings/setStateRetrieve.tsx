export const setStateRetrieve = ( state: string, stateFlow: string ) => {
    if (state === 'R') {
        switch (stateFlow) {
          case 'Pendente':
            return 'resReservado';
          case 'Aprovada':
            return 'resAprobada';
          case 'Cancelada':
            return 'resCancelado';
          default:
            return 'resReservado';
        }
    } else if (state === 'C') {
        return 'resCancelado';
    }
}