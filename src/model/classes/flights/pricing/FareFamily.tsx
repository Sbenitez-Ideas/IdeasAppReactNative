import { Characteristics } from "./Characteristics";
import { DescriptionFamily } from "./DescriptionFamily";


export class FareFamily {
    Carrier: string;
    IataOrigin: string;
    IataDestination: string;
    Warning: string;
    Markert: string;
    ExternalLink: string;
    Airline: string;
    Cabine: string;
    NameTechFamily: string;
    CommercialNameFamily: string;
    DescriptionFamily: DescriptionFamily;
    ColorFamily: string;
    IconFamily: string;
    Characteristics: Characteristics;
    FareBase: string;
    ServiceClass: string;
}
