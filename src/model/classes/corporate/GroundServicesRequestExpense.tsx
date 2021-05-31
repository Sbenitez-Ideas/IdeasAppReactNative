import { TransferService } from "./TransferService";


/**
 * Land's service requested in booking.
 *
 * @export
 * @class GroundServicesRequestExpense
 */
export class GroundServicesRequestExpense {

    public RequestCode: number;
    public CityTransferCode: number;
    public BookingCode: number;
    public ServiceValue: number;
    public SolicitedValue: number;
    public ServiceDate: Date;
    public Description: string;
    public OriginCity: string;
    public DestinationCity: string;
    public Transfer: TransferService[];
    public numberTrips: number;
    public FeeValue: number;
    public CurrencyFee: number;

    constructor (viaticalJourney: any, countTrip: number, serviceDate: Date) {
        this.CityTransferCode = viaticalJourney.CityTransferCode;
        this.ServiceValue = viaticalJourney.Value;
        this.SolicitedValue = viaticalJourney.Value;
        this.Description = viaticalJourney.journeyObservations;
        this.ServiceDate = serviceDate;
        this.OriginCity = viaticalJourney.CityNameOrigin;
        this.DestinationCity = viaticalJourney.CityName;
        this.numberTrips = countTrip;
    }
}
