import { Fare } from "../../flights/business-objects/fare";
import { TotalFares } from "../../flights/business-objects/TotalFares";
import { Journey } from "./Journey";

export class Recommendation {
    public RecommendationId: number;
    public SourceCode: string;
    public ValidatingCarrier: string;
    public TotalFare: TotalFares;
    public Fares: Fare[];
    public Journeys: Journey[];
    public SourceID: number;

    constructor() {
        this.RecommendationId = 0;
        this.Fares = [];
    }
}
