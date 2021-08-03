import { Segment } from "../../flights/business-objects/Segment";

export class Journey {
    public JourneyId: number;
    public DepartureStation: string;
    public ArrivalStation: string;
    public DepartureDate: Date;
    public Segments: Segment[];
    public Key: string;
    public FareFamilies: string[];
    public ItineraryRPH: string;

    constructor() {
        this.JourneyId = 0;
        this.Segments = [];
    }
}
