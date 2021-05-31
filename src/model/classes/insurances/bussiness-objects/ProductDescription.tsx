/**
 * Has the information of a product for insurance.
 *
 * @export
 * @class ProductDescription
 */
 export class ProductDescription {
    feature: string;
    codfeature: string;
    idfeature: string;
    codproduct: string;
    amountSource: string;
    currency: string;
    value: string;

    constructor() {
        this.feature = '';
        this.codfeature = '';
        this.idfeature = '';
        this.codproduct = '';
        this.amountSource = '';
        this.currency = '';
        this.value = '';
    }
}


