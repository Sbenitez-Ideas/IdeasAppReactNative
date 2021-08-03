import { AvailabilitySearchType } from "../../../enums/AvailabilitySearchType";
import { CabinType } from "../../../enums/CabinType";
import { TripTypes } from "../../../enums/TripTypes";
import { FareFamily } from "../../flights/pricing/FareFamily";
import { CurrencyPair } from "../../foundation/CurrencyPair";
import { AvailabilityFilter } from "../bussiness-objects/AvailabilityFilter";
import { CAgreementFlight } from "../bussiness-objects/CAgreementFlight";
import { ExemptTax } from "../bussiness-objects/ExemptTax";
import { ItinerarySearch } from "../bussiness-objects/ItinerarySearch";



export class AvailabilityRQ {
    public Language: string;
    public SourceCode: string[];
    public Itineraries: ItinerarySearch[];
    public PreferredAirlines: string[];
    public Cabin: CabinType;
    public DirectFlight: boolean;
    public MaxStops: number;
    public TripType: TripTypes;
    public PaxAdults: number;
    public PaxChildren: number;
    public PaxInfants: number;
    public Currency: string;
    public Agreements: CAgreementFlight[];
    public FareFamilies: FareFamily[];
    public SearchType: AvailabilitySearchType;
    public ExcludeAirlines: string[];
    public ExcludeAirlinesAll: string[];
    public MaxRecommendations: number;
    public DayInterval: number;
    public PTCAdults: string[];
    public PTCChildren: string[];
    public PTCInfants: string[];
    public SessionToken: string;
    public RecordSkip: number;
    public RecordTake: number;
    public AvailabilityFilter: AvailabilityFilter;
    public InternationalItin: boolean;
    public BaggageOption: number;
    public LocalCurrencyExchange: CurrencyPair;
    public PenaltyOption: boolean;
    public ConnectionCities: string[];
    public Overnight: boolean;
    public ExemptTaxes: ExemptTax[];
    public LongConnectTimeMin: number;
    public LongConnectTimeMax: number;
    public Radius: number;
    public AgeChild: number[];
    public FareClass: string[];
    public FareBasis: string[];

    public Validate(): void {
        if (this.Itineraries == null) {
            // tslint:disable-next-line:no-string-throw
            throw ('Thez Itineraries field can\'t be null');
        }
    }

    constructor() {
        this.PTCAdults = ['ADT'];
        this.PTCChildren = ['CHD'];
        this.PTCInfants = ['INF'];
        this.MaxStops = -1;
        this.BaggageOption = 2;
        this.SourceCode = new Array(0);
    }
}
