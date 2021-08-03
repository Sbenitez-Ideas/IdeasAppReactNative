import { Recommendation } from "../bussiness-objects/Recommendation";
import { AvailabilityBaseRS } from "./AvailabilityBaseRS";


export class AvailabilityByPriceRS extends AvailabilityBaseRS {
    public Recommendations: Recommendation[];
    /* public AvailabilityFilter: any; */

    constructor() {
        super();
        this.Recommendations = [];
    }
}
