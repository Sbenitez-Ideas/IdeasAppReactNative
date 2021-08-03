export class BudgetReservationRQ {
    EntityCode: number;
    CostCenterCode: number;
    NalInter: string;
    BudgetValue: number;
    ProccessDate: Date;
    ProductType: string;
    PaxCode: number;
    MotiveCode: string;

    constructor() {
        this.NalInter = '';
        this.BudgetValue = 0;
        this.ProccessDate = new Date();
        this.ProductType = '';
    }
}
