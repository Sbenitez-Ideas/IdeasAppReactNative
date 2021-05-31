// tslint:disable:max-line-length

import { TravelerCorporate } from "../corporate/TravelerCorporate";
import { ContactInfo } from "./ContactInfo";
import { FidelityProgram } from "./FidelityProgram";
import { Traveler } from "./Traveler";

/**
 * Specifies the necessary info for a passenger.
 *
 * @export
 * @class Passenger
 * @extends {Traveler}
 */
export class Passenger extends Traveler {
    ContactInfo: ContactInfo;
    FrecuentFlyer: string;
    PassportNumber: string;
    PassportExpiration: Date | null;
    PassportCountryIssue: string;
    VisaNumber: string;
    VisaCountryIssue: string;
    VisaCityIssue: string;
    VisaExpiration: Date | null;
    BirthPlace: string;
    Remarks: string[];
    Number: string;
    Reference: string;
    FidelityPrograms: FidelityProgram[];
    roomID: number;
    FullName: string;
    /**
     * Creates an instance of Passenger.
     * @memberof Passenger
     */
    constructor(traveler: TravelerCorporate) {
        super(traveler);
        if (traveler !== null) {
            this.ContactInfo = new ContactInfo(traveler);
            this.FrecuentFlyer = ''; // TODO;
            this.PassportNumber = traveler.PassportNumber;
            this.PassportExpiration = traveler.PassportExpirationDate;
            this.PassportCountryIssue = traveler.CountryPassport;
            this.VisaNumber = '';
            this.VisaCountryIssue =  ''; // TODO: Crear campo para el formulario
            this.VisaCityIssue = ''; // TODO: Crear campo para el formulario
            this.VisaExpiration = traveler.USAVisaExpirationDate;
            this.BirthPlace = traveler.CountryPassenger;
            this.FidelityPrograms = [new FidelityProgram()];

            if (traveler.FidelityProgramUser && traveler.FidelityProgramUser.length > 0) {
                this.FidelityPrograms = [];
                traveler.FidelityProgramUser.forEach(fide => {
                    this.FidelityPrograms.push(new FidelityProgram(fide.CompanyCode.toString(), fide.FidelityName, fide.FidelityNumber));
                });
            }

        } else {
            this.FrecuentFlyer = '';
            this.PassportNumber = '';
            this.PassportExpiration =  null;
            this.PassportCountryIssue = '';
            this.VisaNumber = '';
            this.VisaCountryIssue = '';
            this.VisaCityIssue = '';
            this.VisaExpiration = null;
            this.BirthPlace = '';
            this.FidelityPrograms = [new FidelityProgram()];
        }
    }
}


