import { RequestStatus } from "../../enums/RequestStatus";
import { SpecialTransRequest } from "../../interfaces/special-transport/SpecialTransRequest";
import { Passenger } from "../foundation/Passenger";
import { AdditionalFieldsValues } from "./AdditionalFieldsValues";
import { AdditionalInfoRates } from "./AdditionalInfoRates";
import { AdvanceRetrieveRS } from "./AdvanceRetrieveRS";
import { ApproverBooking } from "./ApproverBooking";
import { ContactInfo } from "./ContactInfo";
import { CorporateFlowInfo } from "./CorporateFlowInfo";
import { CostCenterBooking } from "./CostCenterBooking";
import { GroundServicesRequestExpense } from "./GroundServicesRequestExpense";
import { InfoBudget } from "./InfoBudget";
import { SpecialTransportationRequest } from "./offline-object/SpecialTransportationRequest";
import { OfflineHotelsBasic } from "./OfflineHotelsBasic";
import { TaxiRequestExpense } from "./TaxiRequestExpense";
import { TravelerCorporate } from "./TravelerCorporate";
import { TravelerPolicyByIDRS } from "./TravelerPolicyByIdRS";
import { TravelExpensesService } from "./TravelExpensesService";


/**
 * Info about the booking with the corporate fields.
 *
 * @export
 * @class CorporateBookingInfo
 */
export class CorporateBookingInfo {
    ApprovalType: string;
    AutoAproverBooking: boolean;
    AutocompletePassengers: boolean;
    InternationalApprover: boolean;
    UpdateApprovers: boolean;
    UpdateCenterCost: string;
    UserIsApprover: boolean;
    ValidateApprover: boolean;
    ValidateCostCenter: boolean;
    AdvanceRetrieve: AdvanceRetrieveRS;
    viatical: TravelExpensesService;
    viaticalTaxiList: TaxiRequestExpense[];
    viaticalJourneyList: GroundServicesRequestExpense[];
    AdditionalInfoRates: AdditionalInfoRates[];
    ApproverList: ApproverBooking[];
    CheckPolicy: boolean;
    ContactInfo: ContactInfo;
    CorporateFlowInfo: CorporateFlowInfo;
    CostCenterList: CostCenterBooking[];
    IDPassenger: number;
    IDReason: number;
    IDTypeJustification: number;
    JustificationPolicy: string;
    PolicyResult: boolean;
    ReasonText: string;
    OfflineHotelsBasic: OfflineHotelsBasic[];

    // udids
    AdditionalFields: AdditionalFieldsValues[];
    XploraCode: string;
    Passengers: Passenger[];

    // Poperties new
    InfoBudget: InfoBudget[];
    DepartureDate: Date;
    ReturnDate: Date;
    TotalFare: number;
    Currency: string;
    International: boolean;
    DepartureStation: string;
    ArrivalStation: string;
    SpecialTransport: SpecialTransportationRequest;

    constructor(costCenter: any[], xplora: string, motive: any, hotelesOffline: any[] = [], transports: any[] = [], expense: any,
        travelers: TravelerCorporate[] = [], policyResponse: TravelerPolicyByIDRS,
        specialTrans: SpecialTransRequest,
        justificationPolicy: string, flights: any) {

        this.XploraCode = xplora;
        this.IDReason = motive ? motive.ID : '';
        this.ReasonText = motive ? motive.Text : '';
        this.JustificationPolicy = justificationPolicy;

        this.Passengers = [];
        travelers.forEach(traveler => {
            const passenger = new Passenger(traveler);
            this.Passengers.push(passenger);
        });

        // Viatics
        if (expense) {
            this.setViatics(expense);
        }

        this.viaticalTaxiList = [];

        // Cost Centers
        this.CostCenterList = [];
        if (costCenter && costCenter != null && costCenter) {
            costCenter.forEach(element => {
                this.CostCenterList.push(new CostCenterBooking(element));
            });
        }

        this.AdditionalFields = [];
        // TODO: Organize @Lina
        // UDIDs for viatics
        if (expense && expense != null && expense.international) {
            this.setInternationalViatics(expense);
        }

        // Approvers
        this.ApproverList = [];
        if (policyResponse.ApproverUser) {
            this.setAppovers(policyResponse);
        }

        // Intermunicipal transport
        this.viaticalJourneyList = [];
        if (transports && transports != null && transports.length > 0) {
            this.setIntermunicipalTransport(transports);
        }

        // Offline hotels
        this.OfflineHotelsBasic = [];
        if (hotelesOffline && hotelesOffline !== null && hotelesOffline.length > 0) {
            this.setHotelOffline(hotelesOffline);
        }

        if (expense) {
            this.DepartureDate = expense.startDate;
            this.ReturnDate = expense.finalDate;
            this.ArrivalStation = expense.destinations;
        }

        if (flights) {
            this.DepartureStation = flights[0].DepartureStation;
        }

        this.AdvanceRetrieve = new AdvanceRetrieveRS(this.viatical, this.viaticalJourneyList, this.viaticalTaxiList);

        // Special transport
        // if (specialTrans) {
        //     this.setSpecialTransport(specialTrans, travelers.length);
        // }
    }

    /**
     * Sets the viatics object request for booking.
     *
     * @private
     * @param {*} expense Information of the viatics in booking.
     * @memberof CorporateBookingInfo
     */
    private setViatics(expense: any) {
        this.DepartureDate = expense.startDate;
        this.ReturnDate = expense.finalDate;
        this.ArrivalStation = expense.location.iata;
        this.DepartureStation = expense.location.iata;
        this.International = expense.international;

        const data = {
            international: expense.international,
            obsRequest: '',
            countPeople: expense.people,
            jobTitle: ''
        };

        this.viatical = new TravelExpensesService(expense, data);
    }

    /**
     * Sets the UDIDs when there is an international viatics request in the booking.
     *
     * @private
     * @param {*} expense Viatics information.
     * @memberof CorporateBookingInfo
     */
    private setInternationalViatics(expense: any) {
        // Office.
        const oficina = new AdditionalFieldsValues();
        oficina.IdVal = 1845;
        oficina.NameVal = 'Oficina';
        oficina.Required = false;
        oficina.FieldValue = expense.office.value;
        oficina.FieldValueCode = expense.office.value;
        this.AdditionalFields.push(oficina);

        // Picker name information.
        const quienR = new AdditionalFieldsValues();
        quienR.IdVal = 1893;
        quienR.NameVal = 'QuienRecoje';
        quienR.Required = false;
        quienR.FieldValue = expense.dataInternational.name;
        quienR.FieldValueCode = expense.dataInternational.name;
        this.AdditionalFields.push(quienR);

        // Picker ID information.
        const cedulaR = new AdditionalFieldsValues();
        cedulaR.IdVal = 1894;
        cedulaR.NameVal = 'CedulaRecoge';
        cedulaR.Required = false;
        cedulaR.FieldValue = expense.dataInternational.idNumber;
        cedulaR.FieldValueCode = expense.dataInternational.idNumber;
        this.AdditionalFields.push(cedulaR);

    }

    /**
     * Sets the approvers for the booking request according with the traveler selected.
     *
     * @private
     * @param {TravelerPolicyByIDRS} policyResponse Information of the traveler selected.
     * @memberof CorporateBookingInfo
     */
    private setAppovers(policyResponse: TravelerPolicyByIDRS) {
        policyResponse.ApproverUser.forEach(ap => {
            const approver = new ApproverBooking();
            approver.IDApproverUser = Number(ap.IDUser);
            approver.IDUser = ap.IDUser;
            approver.Sequence = ap.Sequence;
            this.ApproverList.push(approver);
        });
    }

    /**
     * Sets the intermunicipal transport object request when the booking includes the service.
     *
     * @private
     * @param {any[]} transports Information of the international transport for booking.
     * @memberof CorporateBookingInfo
     */
    private setIntermunicipalTransport(transports: any[]) {
        this.DepartureDate = transports[0].start;
        this.ReturnDate = transports[transports.length - 1].final;
        this.ArrivalStation = transports[transports.length - 1].destination.IATADestination ?
            transports[transports.length - 1].destination.IATADestination :
            transports[transports.length - 1].origin.IATA;
        this.DepartureStation = transports[0].origin.IATA;
        let totalTrans = 0;

        transports.forEach(journey => {
            totalTrans += Number(journey.destination.Total * journey.countTrip);
            if (journey.destination.ListTransfers) {
                journey.destination.ListTransfers.forEach((transfer: any) => {
                    this.viaticalJourneyList.push(new GroundServicesRequestExpense(transfer, journey.countTrip, journey.start));
                });
            }
        });

        if (this.viatical) {
            this.viatical.TransportValue = totalTrans;
            this.viatical.RequestedValue += this.viatical.TransportValue;
            this.viatical.ApprovedValue += this.viatical.TransportValue;
        }
    }

    /**
     * Sets the hotel offline request object if the booking includes the service.
     *
     * @private
     * @param {any[]} hotelesOffline Hotel offline booking information.
     * @memberof CorporateBookingInfo
     */
    private setHotelOffline(hotelesOffline: any[]) {
        this.DepartureDate = hotelesOffline[0].checkIn;
        this.ReturnDate = hotelesOffline[hotelesOffline.length - 1].checkOut;
        this.ArrivalStation = hotelesOffline[0].location.iata;
        this.DepartureStation = hotelesOffline[0].location.iata;

        hotelesOffline.forEach(h => {
            this.OfflineHotelsBasic.push(new OfflineHotelsBasic(h));
        });

        if (this.OfflineHotelsBasic.length > 0 && this.OfflineHotelsBasic.some(h => h.FamilyAccomodation || h.PaymentDestination)) {
            if (!this.viatical) {
                const hotel = hotelesOffline.find(h => h.onFamily || h.payInDestiny);
                if (hotel) {
                    const expenseI = hotel.expenseInfo;
                    const data = {
                        international: hotel.international,
                        obsRequest: '',
                        countPeople: this.Passengers.length,
                        jobTitle: ''
                    };
                    this.viatical = new TravelExpensesService(expenseI, data);

                    if (!this.International) {
                        this.International = hotel.international;
                    }
                }
            }
        }
    }

    /**
     * Sets the special transport request when the request includes it.
     *
     * @private
     * @param {SpecialTransRequest} specialTrans Information of the special transport number request.
     * @param {number} totalPassengers Total number of passengers included in the boooking.
     * @memberof CorporateBookingInfo
     */
    private setSpecialTransport(specialTrans: any, //SpecialTransRequest,
         totalPassengers: number) {
        this.DepartureDate = specialTrans.transports[0].date;
        this.ReturnDate = specialTrans.transports[specialTrans.transports.length - 1].date;

        this.SpecialTransport = new SpecialTransportationRequest();
        this.SpecialTransport.DetailsTransp = specialTrans.transports;
        this.SpecialTransport.isSendEmailAgent = false;
        this.SpecialTransport.isSendEmailAgent = false;
        this.SpecialTransport.isSendEmailApprov = false;
        this.SpecialTransport.Status = RequestStatus.R;
        this.SpecialTransport.countPax = totalPassengers;
        this.SpecialTransport.currency = specialTrans.currency;
        this.SpecialTransport.valueInitial = specialTrans.valuePolicy;
        this.SpecialTransport.valuePerson = specialTrans.valueRequest;

        // Data asesor
        this.SpecialTransport.typeCar = '';
        this.SpecialTransport.numberCar = '';
        this.SpecialTransport.contact = '';
        this.SpecialTransport.driver = '';
        this.SpecialTransport.Observations = '';
    }
}

