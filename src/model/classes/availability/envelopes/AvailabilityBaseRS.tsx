import { TripTypes } from "../../../enums/TripTypes";
import { Airport } from "../../flights/business-objects/Airport";
import { CurrencyPair } from "../../foundation/CurrencyPair";
import { WSResponse } from "../../foundation/WSResponse";
import { AvailabilityFilter } from "../bussiness-objects/AvailabilityFilter";
import { AvailabilitySummary } from "../bussiness-objects/AvailabilitySummary";

export class AvailabilityBaseRS extends WSResponse {
    public TripType: TripTypes;
    public SourceCode: string[];
    public Airports: Airport[];
    public TotalRecommendation: number;
    public AvailabilitySummary: AvailabilitySummary;
    public LocalCurrencyExchange: CurrencyPair;
    public SourceID = 0;
    public ResponseKey: string;
    public IsFromCache: boolean;
    public International: boolean;

    constructor() {
        super();
    }
}
