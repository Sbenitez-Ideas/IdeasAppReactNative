import { DownloadImagesExpenseRQ } from "./DownloadImagesExpenseRQ";
import { LinkExpenses } from "./LinkExpenses";

export class DownloadImageRQ extends DownloadImagesExpenseRQ {

    Description: string;
    Value: string;
    IDExpense: string;
    Action: string;
    Data: Array<LinkExpenses>;

}