import { CabinType } from "../../../enums/CabinType";
import { CAgreementFlight } from "../../availability/bussiness-objects/CAgreementFlight";
import { Segment } from "../business-objects/Segment";


export class PricingBaseRQ {
    BestBuy: boolean;
    Agreement: CAgreementFlight;
    Segments: Segment[];
    PaxAdults: number;
    PaxChildren: number;
    PaxInfants: number;
    Currency: string;
    GetFareRules: boolean;
    GetCorporateParams: boolean;
    Cabin: CabinType;
    SessionToken: string;
    PMR: boolean;
    PTCAdults: string;
    PTCChildren: string;
    PTCInfants: string;
    LOCInt: string;
    IncludeUpsell: boolean;

    constructor() {
        this.GetCorporateParams = true;
        this.Segments = [];
    }
}
