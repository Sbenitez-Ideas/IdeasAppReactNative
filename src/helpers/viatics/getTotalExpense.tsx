import { GExpenses } from '../../interfaces/viatics/GExpenses';


export const getTotalExpense =  (data: GExpenses) => {
    let totalExpenseValue = 0;
        switch(data.PaymentType) {
            case 'C':
                totalExpenseValue = data.ExpenseCash + data.TipValue + data.TaxValue;
                break;
            case 'R':
                totalExpenseValue = data.ExpenseCC + data.TaxValue + data.TipValue;
                break;
            case 'B':
                totalExpenseValue = data.TipValue + data.TaxValue + data.ExpenseCash + data.ExpenseCC;
                break;
            case 'P':
            case 'D':
                totalExpenseValue = data.TipValue + data.TaxValue + data.ExpenseCash;
                break;
        }
        return totalExpenseValue;

}