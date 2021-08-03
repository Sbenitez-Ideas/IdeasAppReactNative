import { SearchFieldTraveler } from "../../enums/SearchFieldTraveler";


/**
 * Specifies the request to search for a traveler.
 *
 * @export
 * @class TravelerCorporateRQ
 */
export class TravelerCorporateRQ {
    Language: string;
    IDEntity: number;
    SearchField: SearchFieldTraveler;
    SearchValue: string | null;
}
