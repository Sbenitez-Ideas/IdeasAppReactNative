import { FareFamily } from "./FareFamily";


export class SegmentBase {
    FareFamilyDescription: FareFamily;
    public SegmentId: number;
    public ItineraryRPH: string;
    public ValidatingCarrier = '';
    public DepartureDateTimeBase: Date;
    public ArrivalDateTimeBase: Date;
    public DepartureStationBase: string;
    public ArrivalStationBase: string;
}
