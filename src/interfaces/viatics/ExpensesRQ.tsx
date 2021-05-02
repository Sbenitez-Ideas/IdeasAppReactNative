export interface ExpensesRQ {
    Skip?: number;
    Take?: number;
    Filters?: string[];
    IDGroup: string;
    Sort?: string;
    Desc?: boolean;
    State?: string;
}