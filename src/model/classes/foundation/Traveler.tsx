import { concat } from "react-native-reanimated";
import { Titles } from "../../enums/Titles";
import { TravelerTypes } from "../../enums/TravelerTypes";
import { TravelerCorporate } from "../corporate/TravelerCorporate";
import { AgeDelimiter } from "./AgeDelimiter";
import { Person } from "./Person";

/**
 * Specifies the info required for a traveler.
 *
 * @export
 * @class Traveler
 * @extends {Person}
 */
export class Traveler extends Person {
    Code: number;
    Id: number;
    Age: number;
    Title: Titles;
    documentId: string;
    AgeDelimiter: AgeDelimiter;
    Type: TravelerTypes;
    TypeSpecified: boolean;
    Nationality: string;
    ResidentCountry: string;
    email: string;
    private Today: Date;
    private temp_age: number;
    /*output fullname*/
    private outPutF: string;
    /* output Traveler */
    private outPutT: TravelerTypes;
    /*output Ages */
    private outPutA: number;

    /**
     * Creates an instance of Traveler.
     * @memberof Traveler
     */
    constructor(traveler: TravelerCorporate ) {
        super(traveler);
        if (traveler !== null) {
            this.Id = traveler.IDUser;
            /* this.Title = Titles[traveler.NamePrefix]; */
            this.documentId = traveler.IDNumber;
            this.AgeDelimiter = new AgeDelimiter();
            this.Type = TravelerTypes.adult; // TODO: Obtener el tipo cuando hay formulario
            this.Nationality = traveler.Nationality;
            this.ResidentCountry = traveler.CountryPassenger;
            this.email = traveler.Email;
        } else {
            this.AgeDelimiter = new AgeDelimiter();
            this.Nationality = '';
        }
    }

    /**
     * Gets the full name of the traveler.
     *
     * @returns {string} The full name depending of first, middle and/or last name.
     * @memberof Traveler
     */
    fullName(): string {
        if (this.FirstName !== null && this.FirstName !== '') {
            this.outPutF = this.FirstName;
        }
        if (this.MiddleName !== null && this.MiddleName !== '') {
            this.outPutF += concat(' ', this.MiddleName);
        }
        if (this.LastName !== null && this.LastName !== '') {
            this.outPutF += concat(' ', this.LastName);
        }

        return this.outPutF;
    }

    /**
     * Gets the type of traveler depending of the age.
     *
     * @returns {TravelerTypes} Type of traveler depending of age.
     * @memberof Traveler
     */
    getType(): TravelerTypes {
        if (this.TypeSpecified) {
            return this.Type;
        }

        // Sets the adult age.
        this.temp_age = 18;

        if (this.Age != null) {
            this.temp_age = this.Age;
        }

        if (this.getAgeByBirthDate() != null) {
            this.temp_age = this.getAgeByBirthDate();
        }

        this.outPutT = TravelerTypes.adult;

        if (this.temp_age < this.AgeDelimiter.ChildStartAge) {
            this.outPutT = TravelerTypes.infant;
        }

        if (this.temp_age >= this.AgeDelimiter.ChildStartAge && this.temp_age < this.AgeDelimiter.AdultStartAge) {
            this.outPutT = TravelerTypes.child;
        }

        return this.outPutT;
    }

    /**
     * Gets the age of traveler depending of birthdate.
     *
     * @returns {number} Age of traveler in years.
     * @memberof Traveler
     */
    getAgeByBirthDate(): number {
        if (this.BirthDate != null) {
            this.Today = new Date;
            this.outPutA = this.Today.getFullYear() - new Date(this.BirthDate).getFullYear();
            this.Today.setFullYear(this.Today.getFullYear() - this.outPutA);

            if (this.BirthDate.getDate() > this.Today.getDate()) {
                this.outPutA--;
            }
        }

        return this.outPutA;
    }

}


