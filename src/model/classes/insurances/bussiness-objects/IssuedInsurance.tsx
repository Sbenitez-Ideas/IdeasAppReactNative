import { BookStatus } from "../../../enums/BookStatus";
import { Currencies } from "../../../enums/Currencies";
import { BookingAttempt } from "./BookingAttempt";
import { ErrorInfo } from "./ErrorInfo";
import { PassengerIssuedInsurance } from "./PassengerIssuedInsurance";
import { Payment } from "./Payment";
import { PaymentProcessInformation } from "./PaymentProcessInformation";

export class IssuedInsurance
{
            
    Id: number;

    codReserva: number;

    codSource: number;

    ConnectionID: number;

    Userid: string;//codusuariosAgency

    Status: BookStatus;

    BookDate: Date | string;

    numADT: number | null;

    numOLD: number | null;

    numCHD: number | null;

    codAgency: string;

    codrate: string;

    QuantityDays: number | null;

    startdate: Date | string | null;

    enddate: Date | string | null;

    isFamilyPlan: boolean;

    coddestination: string;

    nameDestination: string;

    Effectivepayment: boolean;

    idcountry: string;

    rubro: string;

    nameinsurance: string;

    PrintLegend: string;

    sufPrint: string;

    idmodality: string;

    corporate: string;

    Currencyprint: Currencies;

    Invoicecurrency: Currencies;

    iscancel: boolean;

    datecancel: Date | string | null;

    category: string;

    codgroupvoucher: string;

    codinsurance: string;

    typeproduct: string;

    error: ErrorInfo;

    provider: string;

    LOC: string;

    TotalIssuedInsurance: number;

    TotalIssuedInsuranceAfterMarkup: number;

    pasarelaAutoriza: string;

    pasarelaMessage: string;

    TimeOutError: string;

    codcountrysource: string;

    TotalIssuedInsuranceAfterMarkupTRM: number;

    CurrencyIssuedTRM: Currencies;

    listVouchers: PassengerIssuedInsurance[];

    bookingAttempt: BookingAttempt;

    totalIssued: number;

    infoprocess: PaymentProcessInformation;

    paymentdata: Payment;
}