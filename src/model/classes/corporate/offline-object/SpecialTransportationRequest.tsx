import { RequestStatus } from "../../../enums/RequestStatus";
import { Detailspecialtransportation } from "./DetailSpecialTransportation";


export class SpecialTransportationRequest {

    Code: number;
    RequestCode: number;
    ResponseCode: number;
    codReserva: number;
    isSendEmailPerson: boolean;
    isSendEmailAgent: boolean;
    isSendEmailApprov: boolean;
    Status: RequestStatus;
    countPax: number;
    typeCar: string;
    numberCar: string;
    contact: string;
    driver: string;
    currency: string;
    valueInitial: number;
    valuePerson: number;
    valueAgent: number;
    valueApprov: number;
    Observations: string;
    FeeTransport: number;
    CurrencyFee: string;
    DetailsTransp: Detailspecialtransportation[];
}

