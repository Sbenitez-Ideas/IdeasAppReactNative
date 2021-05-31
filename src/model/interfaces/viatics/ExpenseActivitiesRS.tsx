import { ExpenseGroupRS } from "./ExpenseGroupRS";
import { GActivities } from "./GActivities";

export interface ExpenseActivitiesRS  extends ExpenseGroupRS{


    Error: string;
    totalRecords: number;
    ListActivities: Array<GActivities>;
    
}