export class PolicyRetrieve {
    Type: string;
    Code: string;
    Text: string;
    Penalty: number;
    Currency: string;
    Name: string;
    nonRefundable: boolean;

    constructor() {
        this.Type = '';
        this.Code = '';
        this.Text = '';
        this.Currency = '';
        this.Name = '';
    }
}
