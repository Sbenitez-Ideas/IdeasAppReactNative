import { CarPolicy } from "./CarPolicy";
import { FlightPolicy } from "./FlightPolicy";
import { GeneralPolicy } from "./GeneralPolicy";
import { HotelPolicy } from "./HotelPolicy";

export class GeneralPolicies {
    generalPolicy: GeneralPolicy;
    flightPolicy: FlightPolicy;
    hotelPolicy: HotelPolicy;
    carPolicy: CarPolicy;
    _paxParams: any;
    isChecked: boolean;
    result: boolean;
    isRestrictive: boolean;
}
