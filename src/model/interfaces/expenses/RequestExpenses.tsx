import { ExpenseAdvanceDefaultRS } from "../../classes/expenses/ExpenseAdvanceDefaultRS";
import { GeoLocation } from '../corporate/Geolocation';


export class RequestExpenses {

    startDate: Date;
    finalDate: Date;
    location: GeoLocation;
    international: boolean;
    days: number;
    expenseDefault: ExpenseAdvanceDefaultRS | undefined;
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

