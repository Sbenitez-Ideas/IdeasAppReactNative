import { TravelerTypes } from "../../../enums/TravelerTypes";
import { FareRuleText } from "./FareRuleText";
import { Tax } from "./Tax";


export class Fare {
    public FareId: number;
    public PaxType: TravelerTypes;
    public Quantity: number;
    public ForeignCurrency: string;
    public ForeignFareAmount: number;
    public FareCurrency: string;
    public FareAmount: number;
    public TaxesAmount: number;
    public FeeAmount: number;
    public FeeType: string;
    public FeeCharged: number;
    public FeeRCType: string;
    public FeeRCCharged: number;
    public FareRules: string;
    public BaggageAllowance: string;
    public BaggageWeight: string;
    public Taxes: Tax[];
    public FarePublic: boolean;
    public FarePrivate: boolean;
    public FarePromo: boolean;
    public FareCorporate: boolean;
    public FareNumber: number;
    public LastTicketDate: Date;
    public ExpiryDate: Date;
    public PTC: String;
    public FeeRC: number;
    public ValidatingCarrier: String;
    public Class: String;
    public Farebasis: String;
    public FareFamily: String;
    public DUAmount: number;
    public TaxYQAmount: number;
    public HiddenFeeAmount: number;
    public SegmentCodes: number[];
    public IATASegments: String[];
    public FareSourceType: String;
    public MiniRules: FareRuleText[];

    constructor() {
        this.PaxType = TravelerTypes.adult;
        this.Quantity = 0;
        this.ForeignCurrency = '';
        this.ForeignFareAmount = 0;
        this.FareCurrency = '';
        this.FareAmount = 0;
        this.TaxesAmount = 0;
        this.FeeAmount = 0;
        this.FeeRC = 0;
        this.FeeCharged = 0;
        this.FeeRCCharged = 0;
        this.FareRules = '';
        this.BaggageAllowance = '';
        this.BaggageWeight = '';
        this.Taxes = [];
        this.FarePublic = false;
        this.FarePrivate = false;
        this.FarePromo = false;
        this.FareCorporate = false;
        this.FareNumber = 0;
        this.PTC = 'ADT';
        this.FeeRC = 0;
        this.ValidatingCarrier = '';
        this.Class = '';
        this.Farebasis = '';
        this.FareFamily = '';
    }

    addTaxes(flightTax: Tax) {
        if (this.Taxes == null) {
            this.Taxes = [];
        } else {
            this.Taxes.length++;
        }

        this.Taxes[this.Taxes.length - 1] = flightTax;
    }
}
