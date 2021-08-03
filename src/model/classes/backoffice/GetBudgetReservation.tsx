export class GetBudgetReservation {
    Available: boolean;
    AvailableBalance: number;
    PptoExec: number;
    PptoExecDom: number;
    PptoExecInter: number;
    PptoUsed: string;
    ValueExceeded: number;
    Type: string;
    varyMonth: string;
    varyNalInter: string;
    IdBudgetTable: number;
    Error: string;

    constructor () {
        this.Available = false;
        this.AvailableBalance = 0;
        this.PptoExec = 0;
        this.PptoExecDom = 0;
        this.PptoExecInter = 0;
        this.PptoUsed = '';
        this.ValueExceeded = 0;
        this.Type = '';
        this.varyMonth = '';
        this.varyNalInter = '';
        this.IdBudgetTable = 0;
        this.Error = '';
    }
}
