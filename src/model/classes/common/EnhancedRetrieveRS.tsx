import { BookStatus } from "../../enums/BookStatus";
import { CorporateBookingInfo } from "../corporate/CorporateBookingInfo";
import { CorporateParams } from "../corporate/CorporateParams";
import { CostServicesCharges } from "../flights/business-objects/CostServicesCharges";
import { CarBookingRetrieveRS } from "../flights/envelopes/CarBookingRetrieveRS";
import { HotelRetrieveRS } from "../flights/envelopes/HotelRetrieve";
import { RetrieveRS } from "../flights/envelopes/RetrieveRS";
import { Messages } from "../foundation/Messages";
import { WSResponse } from "../foundation/WSResponse";
import { ErrorInfo } from "../insurances/bussiness-objects/ErrorInfo";
import { InsuranceRetrieveRS } from "../insurances/InsuranceRetrieveRS";

export class EnhancedRetrieveRS extends WSResponse {
    CorporateBookingInfo: CorporateBookingInfo;
    CorporateParams: CorporateParams;
    InternalRecordLocator: string;
    BookingCode: number;
    FlightsRetrieve: RetrieveRS[];
    HotelsRetrieve: HotelRetrieveRS[];
    InsurancesRetrieve: InsuranceRetrieveRS[];
    CarsRetrieve: CarBookingRetrieveRS[];
    Status: BookStatus;
    AgencyName: string;
    International: boolean;
    ErrorInfo: ErrorInfo;
    BookingDate: Date;
    IssueDate: Date;
    CostServicesCharges: CostServicesCharges[];
    Messages: Messages[];
}
