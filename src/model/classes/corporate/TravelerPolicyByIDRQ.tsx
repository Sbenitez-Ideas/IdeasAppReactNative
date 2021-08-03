import { Services } from "../../enums/Services";
import { CarParams } from "./CarParams";
import { FlightParams } from "./FlightParams";
import { HotelParams } from "./HotelParams";


export class TravelerPolicyByIDRQ  {

    Language: string;
    IDUser: number;
    serviceDate: Date;
    service: Services;
    agentCode: number;
    serviceCharge: number;
    flightParams: FlightParams;
    hotelParams: HotelParams;
    CarParams: CarParams;
    IdCostCenter: number;
    IdCeco1: number;
    IdCeco2: number;
    IdCeco3: number;
    IdCeco4: number;
    IdCeco5: number;
    IdCeco6: number;
    MotiveCode: string;
    International: boolean;
}

