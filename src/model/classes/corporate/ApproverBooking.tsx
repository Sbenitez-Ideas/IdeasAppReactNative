/**
 * Info of the approver of booking.
 *
 * @export
 * @class ApproverBooking
 */
 export class ApproverBooking {

    IDCorporateApprover: number;
    IDBookingCorporate: number;
    IDApproverUser: number;
    IDStatusCorporate: number;
    StatusDate: Date;
    JustificativaAprovador: string;
    Sequence: number;
    EmailSent: boolean;
    EmailTo: string;
    EmailDate: Date;
    StatusEmail: string;
    IDUserSent: number;
    IDUser: string;
    Date: Date;
    Process: string;
    FullName: string;

    constructor() {
    }
}

