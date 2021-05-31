import { StatusCorporate } from '../../enums/StatusCorporate';


export class SetStatusCorporateRQ {
    InternalRecordLocator: string;
    Status: StatusCorporate;
    ApprovalJustification: string;
    RequestedAmount: number;
    ApprovedAmount: number;
    Currency: string;
    ApprovalNotes: string;
    ReasonTrip: string;
    Manager: string;
    JobTittle: string;
    RequestNotes: string;
}
