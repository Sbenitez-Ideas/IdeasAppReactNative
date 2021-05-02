import { GActivities } from "../../interfaces/viatics/GActivities";
import { RequestType } from "../../interfaces/viatics/requestType";
import { Establishment } from "./Establishment";

export class ExpenseGroupsEmail {
    EmailTo: string;
    Subject: string;
    SendCopyTo: string;
    ListGroups: GActivities[];
    ListEstablishment: Establishment[];
    RequestType: RequestType;
    GenerateLink: boolean;
}