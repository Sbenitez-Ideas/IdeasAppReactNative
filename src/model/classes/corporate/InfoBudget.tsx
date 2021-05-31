import { InfoBudgetProduct } from "./InfoBudgetProduct";
import { InfoBudgetProductTotal } from "./InfoBudgetProductTotal";

export class InfoBudget {

    Name: string;
    Budget: InfoBudgetProduct[];
    BudgetExecuted: InfoBudgetProduct[];
    BudgetAvailable: InfoBudgetProduct[];
    Percent: string;
    TotalProduct: InfoBudgetProductTotal[];
    Summary: number;
}
