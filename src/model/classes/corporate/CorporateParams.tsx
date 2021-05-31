import { ApprovalType } from "../../enums/ApprovalType";
import { ApproverUser } from "./ApproverUser";
import { CostCenter } from "./CostCenter";
import { DynamicFields } from "./DynamicFields";
import { DynamicGroupFields } from "./DynamicGroupFields";
import { JutstificationPolicyType } from "./JustificationPolicyType";



export class CorporateParams {
    public ApprovalType: ApprovalType;
    public ApproverUser: ApproverUser[];
    public AutoAproverBooking: boolean;
    public AutocompletePassengers: boolean;
    public CalculateExpenses: boolean;
    public ChooseApprovers: boolean;
    public CostCenter: CostCenter[];
    public DynamicFields: DynamicFields[];
    public DynamicGroupFields: DynamicGroupFields[];
    public ExpensesShowTaxiComponent: string;
    public ExpensesShowTransferComponent: string;
    public ExpensesHideDailValue: boolean;
    public ExpensesShowFormula: boolean;
    public ExpensesUpdateDays: boolean;
    public ExpensesUpdateRecuestedValue: boolean;
    public ExpensesHideAdditionalValue: boolean;
    public IDEntity: number;
    public IgnoreAutocompletePassengers: boolean;
    public InternationalApprover: boolean;
    public JustificationPolicies: boolean;
    public JustificationRequired: boolean;
    public JutstificationPolicyTypes: JutstificationPolicyType[];
    public LocalCurrencyExpenses: string;
    public MaxCenterCost: string;
    public ShowAdditionInfoRate: boolean;
    public ShowCorporateFlowButton: boolean;
    public ShowDynamicFields: boolean;
    public UpdateApprovers: boolean;
    public UpdateCenterCost: string;
    public UserIsApprover: boolean;
    public UserType: string;
    public ValidateCostCenter: boolean;
    public OfflineType: string;
    public OfflineHotelsNumber: number;
    public TravelExpensesMode: string;
    public International: boolean;
    public offlineHotelsActive: boolean;
    public GeneralInfoFormFlag: boolean;
    public ContactPersonFormFlag: boolean;
    public PersonalPreferencesmFlag: boolean;
    public TripDataFormFlag: boolean;
    public TripPoliciesFormFlag: boolean;
    public ApprovalFlowFormFlag: boolean;
    public CompanyInfoFormFlag: boolean;
    public CardDataFormFlag: boolean;
    public ProgramFormFlag: boolean;
}
