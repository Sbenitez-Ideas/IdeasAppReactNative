import { GeoLocation } from "../../interfaces/corporate/Geolocation";
import { ExpenseAdvanceDefaultRS } from "../expenses/ExpenseAdvanceDefaultRS";


export class RequestExpenses {

    startDate: Date;
    finalDate: Date;
    location: GeoLocation;
    international: boolean;
    days: number;
    expenseDefault: ExpenseAdvanceDefaultRS;
    office: any;
    dataInternational: any;
    people: number;
    food: boolean;
    transport: boolean;
    hasFlight: boolean;
    hasTransport: boolean;
    hasHotel: boolean;
    destinations: string;
}

