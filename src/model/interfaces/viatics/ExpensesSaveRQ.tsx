import { GExpenses } from "./GExpenses";

export class ExpensesSaveRQ {
    Data: GExpenses[];
    Action: 'save' | 'legalize';
    IDUserApprover: number;
}