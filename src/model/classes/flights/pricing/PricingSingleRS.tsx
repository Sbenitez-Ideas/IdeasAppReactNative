import { CorporateBookingInfo } from "../../corporate/CorporateBookingInfo";
import { CorporateParams } from "../../corporate/CorporateParams";
import { FormRequirements } from "../../foundation/FormRequeriments";
import { PricingRS } from "./PricingRS";


export class PricingSingleRS {

    constructor() {
    }

    PricingBySource: PricingRS[];
    CorporateParams: CorporateParams;
    FormRequirements: FormRequirements;
    CorporateBookingInfo: CorporateBookingInfo;
    BestBuy: boolean;
}
