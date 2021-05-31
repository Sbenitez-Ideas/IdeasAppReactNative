import { Fare } from './fare';
import { TotalFares } from './TotalFares';
export class FareOption {
    public Cabin: string;
    public Class: string;
    public FareBase: string;
    public SellKey: string;
    public FareFamily: string;
    public RuleNumber: string;
    public InboundOutbound: string;
    public BaggageAllowance: string;
    public BaggageWeight: string;
    public Fares: Fare[];
    public TotalFare: TotalFares;

    constructor() {
        this.Cabin = '';
        this.Class = '';
        this.FareBase = '';
        this.SellKey = '';
        this.FareFamily = '';
        this.Fares = [];
        this.BaggageAllowance = '';
    }

    getUniqueID() {
        return this.Cabin + this.Class + this.FareBase + this.SellKey + this.FareFamily;
    }

    addFlight(flightFare: Fare) {
        if (this.Fares == null) {
            /* this.Fares = new Fare[1]; */
        } else {
            this.Fares.length++;
        }

        this.Fares[this.Fares.length - 1] = flightFare;
    }
}
 