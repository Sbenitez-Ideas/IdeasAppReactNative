import { TravelerCorporate } from "../corporate/TravelerCorporate";


export class Address {
    Street: string;
    AddressNumber: string;
    County: string;
    City: string;
    State: string;
    Country: string;
    PostalCode: string;

    constructor( traveler: TravelerCorporate ) {
        if (traveler !== null) { // TODO: Crear campos formulario
            this.Street = traveler.AddressPassenger;
            this.AddressNumber = '';
            this.PostalCode = '';
        }
    }
}
