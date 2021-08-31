import { Airport } from '../../classes/flights/business-objects/Airport';
import { Flight } from '../../classes/flights/business-objects/Flight';
import { Segment } from '../../classes/flights/business-objects/Segment';

export interface FlightsAndAirports {
    Flights: Flight[];
    DeparturesAirports: Airport[];
    ArrivalAirports: Airport[];
    Segment: Segment;
}
