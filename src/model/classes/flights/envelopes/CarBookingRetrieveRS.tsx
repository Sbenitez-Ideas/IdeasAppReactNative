import { BookStatus } from "../../../enums/BookStatus";
import { ErrorInfo } from "../../insurances/bussiness-objects/ErrorInfo";

export class CarBookingRetrieveRS
{
    BookingCode: number;
    CodeGDS: string;
    SourceName: string;
    Record: string;
    Cia: string;
    ArrivalDate: Date | string;//llegada
    DepartureDate: Date | string;//salida
    ArrivalCity: string;
    DepartureCity: string;
    ArrivalTime: Date | string;
    DepartureTime: Date | string;
    Observations: string;
    Status: BookStatus;
    TotalValue: number;
    CodeCia: string;
    TRM: number;
    Currency: string;
    TypeVehicle: string;
    CodeVehicle: number;
    ArrivalAddress: string;
    ArrivalPhone: string;
    DepartureAddress: string;
    DeparturePhone: string;
    DescriptionVehicle: string;
    PaymentOnArrival: string;
    UrlImage: string;
    ReservationDate: Date | string;
    VRCost: number;
    TravelerFrequent: string;
    UserAgency: string;
    PromoCode: string;
    RateCode: string;
    Marketing: string;
    DescriptionTax: string;
    DetailsVehicle: string;
    UnlimitedKM: boolean;
    IncludeTaxes: boolean;
    PolicyDamages: boolean;
    PolicyDamagesOthers: boolean;
    AdditionalDriver: boolean;
    FullFuelTank: boolean;
    GPS: boolean;
    PaymentRent: string;
    Remarks: string;        
    PaymentOnArrivalValue: number;
    PaymentAgencyValue: number;
    SpecialEquipament: string;
    Days: number;
    TravelerName: string;
    TravlerLastName: string; 
    Rules: string;
    Company: string;
    CodeCompany: string;
    ExpirationDate: Date | string;
    ErrorInfo: ErrorInfo;
}