import { Currencies } from "../../enums/Currencies";

export class RateDetails
{
    Currency: Currencies;
    Amount: number;
    netAmount: number;
    Markup: number;
}