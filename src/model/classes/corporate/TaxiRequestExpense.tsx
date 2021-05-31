/**
 * Taxi expenses information list
 *
 * @export
 * @class TaxiRequestExpense
 */
 export class TaxiRequestExpense {

    public TaxiRequestCode: number;
    public BookingCode: number;
    public TaxiQuantity: number;
    public TaxiServiceValue: number;
    public TaxiTotalValue: number;
    public TaxiServiceDate: Date;
    public TaxiObservation: string;

    constructor( viaticalTaxi: any ) {
        this.TaxiQuantity = viaticalTaxi.quantityTaxis;
        this.TaxiServiceValue = viaticalTaxi.unitaryValueTaxis;
        this.TaxiTotalValue = viaticalTaxi.totalTaxis;
        this.TaxiServiceDate = new Date (Date.now());
        this.TaxiObservation = viaticalTaxi.taxisObservations;
    }
}
