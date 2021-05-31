import { FamilyRules } from "./FamilyRules";

export class ClassOfService {
    public Class: string;
    public FareBase: string;
    public FareFamily: string;
    public CabinType: string;
    public SeatsAvailable: number;
    public FlightIndicator: string;
    public BaggageAllowance: string;
    public BaggageWeight: string;
    public FamilyRules: FamilyRules;

    constructor() {
        this.Class = '';
        this.FareBase = '';
        this.FareFamily = '';
        this.CabinType = '';
        this.SeatsAvailable = 0;
        this.BaggageAllowance = '';
        this.BaggageWeight = '';
    }
}
