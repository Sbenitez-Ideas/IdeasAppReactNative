import { CurrencyPair } from "../../foundation/CurrencyPair";
import { Segment } from "../business-objects/Segment";
import { AncillaryAvailabilityRS } from "./AncillaryAvailabilityRS";
import { FareRule } from "./FareRule";
import { PricingBaseFlight } from "./PricingBaseFlight";


export class PricingRS extends PricingBaseFlight {

    Segments: Segment[];
    public International: boolean;
    public RulesInfo: FareRule[];
    public SourceCode: string;
    public ApplyCurrencyExhange: boolean;
    public BookingToken: string;
    public LocalCurrencyExchange: CurrencyPair;
    public Ancillary: AncillaryAvailabilityRS[];
    OtherOptionsUpsell: PricingBaseFlight[];

    constructor() {
        super();
        this.ApplyCurrencyExhange = false;
    }
}
