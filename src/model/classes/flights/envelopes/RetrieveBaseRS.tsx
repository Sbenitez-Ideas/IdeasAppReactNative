import { CurrencyPair } from "../../foundation/CurrencyPair";
import { Passenger } from "../../foundation/Passenger";
import { ProcessLog } from "../../foundation/ProcessLog";
import { WSResponse } from "../../foundation/WSResponse";
import { Airport } from "../business-objects/Airport";
import { Fare } from "../business-objects/fare";
import { PassengerSeat } from "../business-objects/PassengerSeat";
import { Remark } from "../business-objects/Remark";
import { Segment } from "../business-objects/Segment";
import { Ticket } from "../business-objects/Ticket";
import { TotalFares } from "../business-objects/TotalFares";


export class RetrieveBaseRS extends WSResponse {
    ProcessLog: ProcessLog[];
    LocalCurrencyExchange: CurrencyPair;
    BookingToken: string;
    PricingLocalCurrency: boolean;
    SourceID: number;
    ArrivalDestination: string;
    BookingCode: number;
    InternalRecordLocator: string;
    Tourcode: string;
    Commission: number;
    SourceCode: string;
    RecordLocator: string;
    Segments: Segment[];
    Airports: Airport[];
    Fares: Fare[];
    Passengers: Passenger[];
    TotalFare: TotalFares;
    International: boolean;
    Tickets: Ticket[];
    Remarks: Remark[];
    AlternativeRecLoc: string;
    BookingDate: Date;
    ValidatingCarrier: string;
    B2CUserCode: number;
    PassengerSeats: PassengerSeat[];
}
