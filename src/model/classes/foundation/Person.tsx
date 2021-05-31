import { Gender } from "../../enums/Gender";
import { TravelerIDTypes } from "../../enums/TravelerIDTypes";
import { TravelerCorporate } from "../corporate/TravelerCorporate";

/**
 * Describes the general information of a person in the system.
 *
 * @export
 * @class Person
 */
export class Person {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Gender: Gender;
    BirthDate: Date | null;
    Identification: string;
    IdType: TravelerIDTypes;
    phoneNumber: string;

    /**
     * Creates an instance of Person.
     * @memberof Person
     */
    constructor(traveler: TravelerCorporate) {
        if (traveler !== null) {
            this.FirstName = traveler.Name;
            this.MiddleName = traveler.MiddleName;
            this.LastName = traveler.Surname;
            /* this.Gender = Gender[traveler.Gender]; */
            this.BirthDate = traveler.BirthDate;
            this.Identification = traveler.IDNumber;
            /* this.IdType = TravelerIDTypes.internal[  ]; */
            this.phoneNumber = traveler.HomePhone;
        } else {
            this.FirstName = '';
            this.MiddleName = '';
            this.LastName = '';
            this.Gender = Gender.male;
            this.BirthDate =  null;
            this.Identification = '';
            this.IdType = TravelerIDTypes.internal;
            this.phoneNumber = '';
        }
    }
}


