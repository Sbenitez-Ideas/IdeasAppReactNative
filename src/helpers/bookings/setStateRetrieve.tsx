export const setStateRetrieve = ( state: string, stateFlow: string ) => {
    if (state === 'R') {
        switch (stateFlow) {
          case 'Pendente':
            return 'Reservado';
          case 'Aprovada':
            return 'Aprobada';
          case 'Cancelada':
            return 'Cancelado';
          default:
            return 'Reservado';
        }
    } else if (state === 'C') {
        return 'Cancelado';
    }
}