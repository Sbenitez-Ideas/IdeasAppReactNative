import { WSResponse } from "../../foundation/WSResponse";
import { Fare } from "../business-objects/fare";
import { TotalFares } from "../business-objects/TotalFares";
import { SegmentBase } from "./SegmentBase";


export class PricingBaseFlight extends WSResponse {
    Fares: Fare[];
    TotalFare: TotalFares;
    SegmentsBase: SegmentBase[];
}
