import { ExpenseEstablishment } from "./ExpenseEstablishment";


export class ExpenseEstablishmentRQ extends ExpenseEstablishment {
    Action: string;
    Skip: number;
    Take: number;
    Filter: string[];
    Sort: string;
    Desc: boolean;
    EstablishmentId: string;
    SearchName: string;
}
