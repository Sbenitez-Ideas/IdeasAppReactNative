import { TotalFares } from "../../flights/business-objects/TotalFares";

export class AvailabilitySummaryCarrierDetail {
    public StopsNumber: number;
    public MinimumTotalFare: TotalFares;

    constructor() {
        this.MinimumTotalFare = new TotalFares();
    }
}
