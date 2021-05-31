import { ContactInfo } from "../../foundation/ContactInfo";
import { CreditCard } from "../../foundation/CreditCard";
import { Person } from "../../foundation/Person";
import { Passenger } from "./Passenger";
import { ProductInfo } from "./ProductInfo";
import { SessionInfo } from "./SessionInfo";


export class Payment
    {
        billingAddress:ContactInfo;
        buyer: Person;
        buyerAddress:ContactInfo;
        card:CreditCard;
        cardHolder:Person;
        ConnectionParam: string;
        gatewayName: string;
        international: boolean;
        numberOfPayments: number;
        passengers: Passenger[];
        products: ProductInfo;
        sessionData: SessionInfo;
    }