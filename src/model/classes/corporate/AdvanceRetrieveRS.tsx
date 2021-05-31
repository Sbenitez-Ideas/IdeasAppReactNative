
import { TaxiRequestExpense } from './TaxiRequestExpense';
import { GroundServicesRequestExpense } from './GroundServicesRequestExpense';
import { TravelExpensesService } from './TravelExpensesService';

/**
 * Advance retrieve information
 *
 * @export
 * @class AdvanceRetrieveRS
 */
export class AdvanceRetrieveRS {

    public TravelExpenses: TravelExpensesService;
    public GroundServices: Array<GroundServicesRequestExpense>;
    public TaxiServices: Array<TaxiRequestExpense>;

    constructor(travelExpenses: TravelExpensesService,
        groundServices: Array<GroundServicesRequestExpense>, taxiServices: Array<TaxiRequestExpense>){
        this.TravelExpenses = travelExpenses;
        this.GroundServices = groundServices;
        this.TaxiServices = taxiServices;
    }
}
