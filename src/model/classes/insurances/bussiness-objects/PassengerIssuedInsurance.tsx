import { BookStatus } from "../../../enums/BookStatus";
import { Currencies } from "../../../enums/Currencies";
import { Passenger } from "../../foundation/Passenger";

export class PassengerIssuedInsurance
    {
        /* InsuranceIssued: ParametersInsurance;
         voucher: InsuranceVoucher;
         infoPassanger: PassengerInsurance;*/

        Id: number;

        IssuedInsurance: number;
        
        codCountry: string;
        
        isoCountry: string;

        codVoucher: string;

        codCompletoVoucher: string;
        
        TypePaxVoucher: string;//tipo de pasajero emitido en el voucher

        SufVoucher: string;//sufijo voucher

        Issueddate: Date | string | null;//fecha de emision
        
        codClient: string;

        codAgency: string;

        codRate: string;

        QuantityDaysTravel: number; //cantidad de dias del viaje

        RateIssued: number;// Importe de la tarifa emitida del voucher

        taxIssued: number;// Importe con impuestos incluídos de la tarifa emitida del voucher

        Ratefull: number;//precio de la tarifa TTR

        Rateprint: number;//tarifa impresa en el voucher

        RateInvoiced: number;//tarifa facturada

        cambioTrm: number;//cambio dolar al momento de la emision

        codCurrencyIssued: Currencies;//moneda emision

        startdate: Date | string | null;// Fecha de inicio de vigencia del voucher.

        endDate: Date | string | null;//fecha fin de vigencia.

        codDestination: string;//codigo area destino

        isFamilyPlan: boolean;

        codVerify: string;//codigo verificador voucher

        groupVoucher: string;//Es el número de grupo de voucher. Todos los vouchers de cada emisión tienen el mismo grupoVoucher.

        IDPromotion: string;//codigo de la promocion

        promoter: string;

        consignment: number;

        taxPrint: number;

        taxFull: number;

        taxInvoiced: number;

        consignmentPrint: number;

        consignmentInvoiced: number;

        consignmentfull: number;

        isPrepurchase: string;//1-si, 0-no

        DataAlta: Date | string | null;

        isFirtsgroup: string;//1-si, 0-no

        icardNro: string;

        Shippingcharge: number;

        Interestincrease: number;

        IDCreditcard: string;

        cardpaymentfees: number;

        fecBaja: Date | string | null;

        isCancel: boolean;

        codBonus: string;

        porcBonus: string;

        sucAgency: string;

        typecharge: string;

        codcounter: string;

        /*informacion del pasajero que falta*/
        Countryresidence: string;//codigo pais residencia

        NameContact: string;

        TelephoneContact: string;

        TotalValue: number;

        typoPax: string;

        typeuserissued: string;

        codinterno: string;

        pasaporte: string;

        age: string;

        city: string;

        email: string;

        usersource: string;

        channelissued: string;
       
        /*Informacion producto voucher*/

        Countryproduct: string;//codigo pais  producto

        codProduct: string;

        nameproduct: string;//nombre producto o seguro

        Currenciesprint: Currencies;//codigo moneda impresion

        InvoiceCurrency: Currencies;//codigo moneda facturacion

        NumAdults: number;

        NumOld: number;

        NumYoung: number;

        PrintLegend: string;//: Información a ser mostrada en la impresión de las políticas

        sufPrint: string;//: sufijo del producto a imprimir

        typeProduct: string;

        Category: string;// categoria producto emitido

        rubro: string;

        groupFamily: string;//indica si es grupo familiar 0-no 1-si

        corporate: string;//indica si el producto es corporativo 

        Effectivepayment: boolean;

        PassengerCode: number;        

        status: BookStatus;

        codReservaSource: number;

        TotalPaxAfterMarkup: number;

        Pendingpayment: boolean;

        paymentreference: string;

        isReissue: string;

        TotalPaxAfterMarkupTRM: number;
        
        codCurrencyIssuedTRM: Currencies;//moneda emision

        codMarkApply: number;

        rateisNet: boolean;

        Passenger: Passenger;//viajante reserva
    }