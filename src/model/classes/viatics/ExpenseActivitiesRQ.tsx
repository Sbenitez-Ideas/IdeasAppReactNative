import { ExpenseGroupRQ } from "../../interfaces/viatics/ExpenseGroupRQ";
import { FilterActivitiesType } from "../../enums/FilterActivitiesType";


export class ExpenseActivitiesRQ extends ExpenseGroupRQ {
    skip?: number;
    take?: number;
    Filter?: string;
    grouping?: any[];
    FilterType?: FilterActivitiesType;
}