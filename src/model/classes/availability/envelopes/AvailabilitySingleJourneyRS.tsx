import { Journey } from "../bussiness-objects/Journey";
import { AvailabilityBaseRS } from "./AvailabilityBaseRS";



export class AvailabilitySingleJourneyRS extends AvailabilityBaseRS {
    Journey: Journey;
    constructor() {
        super();
    }
}
