import { CardHolderType } from "../../enums/CardHolderType";


export class CreditCard {
    CardHolderType: CardHolderType;
    CardIssuedOffshore: boolean;
    CardIssuer: string;
    CardNumber: string;
    ExpDate: string;
    HolderName: string;
    Country: string;
    SecurityId: string;
}
