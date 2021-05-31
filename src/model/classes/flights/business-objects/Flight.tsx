import { ClassOfService } from "./ClassOfService";
import { FareOption } from "./FareOption";
import { Leg } from "./Leg";


export class Flight {
    public FlightId: number;
    public InternalId: string;
    public DepartureStation: string;
    public DepartureStationName: string;
    public DepartureCity: string;
    public ArrivalStation: string;
    public ArrivalStationName: string;
    public ArrivalCity: string;
    public DepartureDateTime: Date;
    public ArrivalDateTime: Date;
    public CarrierCode: string;
    public OperatedBy: string;
    public FlightNumber: string;
    public Stops: number;
    public AircraftType: string;
    public Status: string;
    public ConnectingFlight: boolean;
    public InternalRecordLocator: string;
    public StopOver: boolean;
    public Surface: boolean;
    public FareOption: FareOption;
    public Legs: Leg[];
    public ETicket: boolean;
    public ClassOfServices: ClassOfService[];
    public MarriageGrp: string;
    public Key: string;
    public AvailabilitySource: string;
    public AvailabilityDisplayType: string;
    public FlightTimeMinutes: number;
    public Distance: number;
    public DateVariation: number;
    public OptionalServicesIndicator: boolean;
    public PolledAvailabilityOption: string;
    public LinkAvailability: boolean;
    public ParticipantLevel: string;
    public CodeshareInfo: string;
    public CodeshareOperatingCarrier: string;
    public CodeshareOperatingFlightNumber: string;
    public ConnectionSegmentIndex: string;
    public Terminal: string;

    constructor() {
        this.FlightId = 0;
        this.InternalId = '';
        this.DepartureStation = '';
        this.DepartureStationName = '';
        this.DepartureCity = '';
        this.ArrivalStation = '';
        this.ArrivalStationName = '';
        this.ArrivalCity = '';
        this.CarrierCode = '';
        this.OperatedBy = '';
        this.FlightNumber = '';
        this.Stops = 0;
        this.AircraftType = '';
        this.Status = '';
        this.ConnectingFlight = false;
        this.InternalRecordLocator = '';
        this.StopOver = false;
        this.Surface = false;
        this.FareOption = new FareOption;
        this.Legs = [];
        this.ETicket = true;
        this.ClassOfServices = [];
        this.MarriageGrp = '0';
        this.Key = '';
        this.AvailabilitySource = '';
        this.AvailabilityDisplayType = '';
        this.FlightTimeMinutes = 0;
        this.Distance = 0;
        this.DateVariation = 0;
        this.OptionalServicesIndicator = false;
        this.PolledAvailabilityOption = '';
        this.LinkAvailability = false;
        this.ParticipantLevel = '';
        this.CodeshareInfo = '';
        this.ConnectionSegmentIndex = '';
        this.Terminal = '';
    }

}
