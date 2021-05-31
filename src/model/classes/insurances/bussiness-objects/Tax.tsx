import { TaxType } from "../../../enums/TaxType";


export interface Tax
{        
    amount: number;
    type: TaxType;
}