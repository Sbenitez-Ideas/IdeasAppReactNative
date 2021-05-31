import { Products } from "./Products";

export class BookingAttempt
{
    Id: number;
    Date: Date | string;
    LOC: string;
    codSource: number;
    codReserva: number;
    codUsuario: number;
    connectionId: number;
    companyId: number;
    companyName: string;
    Product: Products;
    Destination: string;
    Origin: string;
    startDate: Date | string | null;
    endDate: Date | string | null;
    Provider: string;
    Criteria_1: string;//Nombre hotel en el caso de hoteles
    Criteria_2: string;
    Successful: boolean;
    sourceLoc: string;
    userName: string;
    Amount: number;
    netAmount: number;
    Currency: string;
    Error: string;
    sourceDestination: string;
    eMailAddressList: string[];    
}