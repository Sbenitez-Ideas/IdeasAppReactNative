import { PaymentType } from "../../../enums/PaymentType";
import { PaymentCardType } from "../payments/PaymentCardType";

export class Ticket {
    TicketId: number;
    PassengerId: number;
    TicketType: string;
    Issued: boolean;
    Status: string;
    Number: string;
    TourCode: string;
    IssuanceDate: Date;
    FareId: number;
    Amount: number;
    PaymentType: PaymentType;
    PaymentCreditCard: PaymentCardType;
    Commission: number;

    constructor() {
        this.TicketType = 'eTicket';
        this.Status = 'pending';
        this.TourCode = '';
        this.Amount = 0;
        this.Commission = 0;
    }
}
