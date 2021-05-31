import { TravelerCorporate } from "../corporate/TravelerCorporate";
import { Address } from "./Address";
import { PhoneNumber } from "./PhoneNumber";


export class ContactInfo {
    Email: string;
    URL: string;
    Address: Address;
    PhoneNumbers: PhoneNumber[];

    constructor(traveler: TravelerCorporate) {
        if (traveler !== null) {
            this.Email = traveler.Email;
            this.URL = ''; // TODO: Crear campo formulario
            this.Address = new Address(traveler); // TODO: Crear campos formulario
            const phoneNumber = new PhoneNumber();
            phoneNumber.Number = traveler.ContactPhone;
            phoneNumber.Type = 'HOME';
            this.PhoneNumbers = [ phoneNumber ];
        }
    }
}
