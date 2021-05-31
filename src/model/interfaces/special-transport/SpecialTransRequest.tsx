import { Detailspecialtransportation } from "../../classes/corporate/offline-object/DetailSpecialTransportation";
import { TravelerCorporate } from "../../classes/corporate/TravelerCorporate";

export interface SpecialTransRequest {
    mainTraveler: TravelerCorporate;
    travelers: TravelerCorporate[];
    transports: Detailspecialtransportation[];
    valuePolicy: number;
    valueRequest: number;
    valueAprov: number;
    valueAgent: number;
    currency: string;
    feeValue: number;
    currencyFee: string;
}
