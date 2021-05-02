export class ExpenseGroupRQ {
    IDGroup?: string;
    IDUser: number;
    IDEntity: number;
    ClosedFilter?: boolean;
    DateFrom?: Date;
    DateTo?: Date;
    excludeImages: boolean;
    GetItems?: boolean;
}