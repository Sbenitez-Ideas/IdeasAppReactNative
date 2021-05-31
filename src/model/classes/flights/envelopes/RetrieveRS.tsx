import { CorporateBookingInfo } from "../../corporate/CorporateBookingInfo";
import { CorporateParams } from "../../corporate/CorporateParams";
import { StatusRetrieve } from "../business-objects/StatusRetrieve";
import { RetrieveBaseRS } from "./RetrieveBaseRS";


export class RetrieveRS extends RetrieveBaseRS {
    /**Corporate params */
    CorporateBookingInfo: CorporateBookingInfo;
    /**Corporate booking info */
    CorporateParams: CorporateParams;
    /**Status of booking */
    StatusRetrieve: StatusRetrieve;
    /**Agency name */
    AgencyName: string;
    /**Entity code or ID */
    IDEntity: number;
    /**Booking code of source */
    BookingCodeSource: number;
    Status: string;
    StatusId: string;

    constructor() {
        super();
    }
}
