
/**
 * Information about travel expenses.
 *
 * @export
 * @class TravelExpensesService
 */
 export class TravelExpensesService {

    public Code: number;
    public RequestCode: number;
    public ReserveCode: number;
    public DateRequest: Date;
    public ApprovalDate: Date;
    public TravelDate: Date;
    public ReturnDate: Date;
    public Days: number;
    public NationalDayValue: number;
    public InternationalDayValue: number;
    public RequestedValue: number;
    public ApprovedValue: number;
    public ObservationsRequest: string;
    public ObservationsApproval: string;
    public NumberTravelers: number;
    public PassengerNames: string;
    public TripType: string;
    public OriginCity: string;
    public DestinationCity: string;
    public UserCodeRequest: number;
    public UserCodeApproval: number;
    public JobTitle: string;
    public ManagersName: string;
    public TravelReason: string;
    public Currency: string;
    public ValueRefund: number;
    public ObservationsRefund: string;
    public AdditionalValue: number;
    public TransportValue: number;
    public TravelPolicyCode: number;
    public UserCodeAuthorized: number;
    public PayTravelExpenses: number;
    public ExportAdvance: string;
    public ExportExpense: string;
    public DateExportAdvance: Date;
    public DateExportExpense: Date;
    public DateCloseExpense: Date;
    public Checksum: string;
    public PassengerID: number;
    public UserCodeTreasurer: number;
    public CountBreakfast: number;
    public CountLunch: number;
    public CountDinner: number;
    public TotalBreakfast: number;
    public TotalLunch: number;
    public TotalDinner: number;
    public TotalFeeValue: number;
    public CurrencyFee: string;

    constructor(expense: any, data: any) {
        const viatical = expense.expenseDefault;
        this.DateRequest = new Date(Date.now());
        this.Days = viatical.NumberOfDays;
        this.NationalDayValue = data.international ? 0 : (viatical.ExpensesValue / (viatical.NumberOfDays > 0 ? viatical.NumberOfDays : 1));
        this.InternationalDayValue =  data.international ?
                                    (viatical.ExpensesValue / (viatical.NumberOfDays > 0 ? viatical.NumberOfDays : 1)) : 0;
        this.RequestedValue = viatical.ExpensesValue + viatical.TaxisValue;
        this.ApprovedValue = viatical.ExpensesValue + viatical.TaxisValue;
        this.ObservationsRequest = data.obsRequest; // TODO: viatical.observations;
        this.ObservationsApproval = ''; // TODO viatical.approvalObservations;
        this.NumberTravelers = data.countPeople;
        this.JobTitle = data.tobTitle; // viatical.jobRole;
        this.ManagersName = ''; // viatical.manager;
        this.Currency = viatical.Currency;
        this.AdditionalValue = viatical.AdditionalValue;
        this.TransportValue = viatical.TaxisValue;
        this.TravelDate = expense.startDate;
        this.ReturnDate = expense.finalDate;
        this.DestinationCity = viatical.Destinations;
        this.CountBreakfast = viatical.countBreakfast;
        this.CountLunch = viatical.countLunch;
        this.CountDinner = viatical.countDinner;
        this.TotalBreakfast = viatical.totalBreakfast;
        this.TotalLunch = viatical.totalLunch;
        this.TotalDinner = viatical.totalDinner;
    }
}
