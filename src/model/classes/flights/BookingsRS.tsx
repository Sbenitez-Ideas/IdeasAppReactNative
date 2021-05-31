import { BookingCompanies } from "./BookingCompanies";
import { BookingData } from "./BookingData";
import { BookingFlows } from "./BookingFlows";
import { BookingSources } from "./BookingSources";
import { BookingStates } from "./BookingStates";


export class BookingsRS {
    Data: BookingData[];
    Sources: BookingSources[];
    Companies: BookingCompanies[];
    States: BookingStates[];
    Flows: BookingFlows[];
}
