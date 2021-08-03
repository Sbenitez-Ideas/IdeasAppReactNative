import { DepartureTimeType } from "../../../enums/DepartureTimeType";

export class ItinerarySearch {
    public IATADeparture: string;
    public IATAArrival: string;
    public DateDeparture: string;
    public TimeDeparture: DepartureTimeType;
    public RPH: string;
}
