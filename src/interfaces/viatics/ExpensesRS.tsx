import { GExpenses } from "./GExpenses";


export interface ExpensesRS {
    Expenses: GExpenses[];
    Total: number;
    Error: string;
}
