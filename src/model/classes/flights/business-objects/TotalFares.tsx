export class TotalFares {
    Currency: string;
    Total: number;
    TotalFare: number;
    TotalTaxes: number;
    TotalFee: number;
    TotalAdditionalFee: number;
    TotalFeeRC: number;
    TotalHiddenFee: number;
    TotalDU: number;
    TotalAncillary: number;

    constructor() {
        this.Total = 0;
        this.TotalFare = 0;
        this.TotalTaxes = 0;
        this.TotalFee = 0;
        this.TotalAdditionalFee = 0;
        this.TotalFeeRC = 0;
        this.TotalHiddenFee = 0;
        this.TotalDU = 0;
        this.TotalAncillary = 0;
    }
}
