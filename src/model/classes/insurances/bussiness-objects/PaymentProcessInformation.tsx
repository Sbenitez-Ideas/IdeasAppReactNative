/**
 * Has the information booking.
 *
 * @export
 * @class paymentprocesspnformation
 */
 export class PaymentProcessInformation {
    status: boolean;
    message: string;
    LOC: string;
    codTransacao: string;
    paymentreference: string;

    constructor() {
        this.status = false;
        this.message = '';
        this.LOC = '';
        this.codTransacao = '';
        this.paymentreference = '';
    }

}
