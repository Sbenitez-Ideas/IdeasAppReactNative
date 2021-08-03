import { Airport } from "../../flights/business-objects/Airport";
import { FilterAirlines } from "./FilterAirlines";
import { FilterSchedule } from "./FilterSchedule";
import { TotalFareFilter } from "./TotalFareFilter";


export class AvailabilityFilter {
    public FilterAirlines: FilterAirlines;
    public FilterAirportDeparture: Airport[];
    public FilterAirportArrival: Airport[];
    public FilterAirportReturn: Airport[];
    public FilterConnections: number[];
    public FilterScheduleDeparture: FilterSchedule[];
    public FilterScheduleArrival: FilterSchedule[];
    public FilterScheduleReturn: FilterSchedule[];
    public FilterTotalFare: TotalFareFilter;

    constructor() {
        this.FilterAirlines = new FilterAirlines();
        this.FilterAirportDeparture = [];
        this.FilterAirportArrival = [];
        this.FilterAirportReturn = [];
        this.FilterConnections = [];
        this.FilterScheduleDeparture = [];
        this.FilterScheduleArrival = [];
        this.FilterScheduleReturn = [];
        this.FilterTotalFare = new TotalFareFilter();
    }
}


