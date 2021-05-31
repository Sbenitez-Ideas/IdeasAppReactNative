import { Tax } from "./Tax";


export class Airline
    {
        
        airlineIata:string;
        airlineName: string;
        taxesAgency: Tax[];
        taxesAirline: Tax[];
        totalAgency: number;
        totalAirline: number;
    }