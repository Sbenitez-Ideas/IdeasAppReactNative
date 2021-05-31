import { TypeFare } from "../../../enums/TypeFare";
import { FareRuleText } from "../business-objects/FareRuleText";


export class FareRule {
    public DepartureAirport: string;
    public ArrivalAirport: string;
    public TypePass: string;
    public RuleText: FareRuleText[];
    public TypeFare: TypeFare;
}
