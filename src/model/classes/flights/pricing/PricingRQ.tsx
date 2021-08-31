import { PricingBaseRQ } from "./PricingBaseRQ";

export class PricingRQ extends PricingBaseRQ {
    sourceCode: string;
    language: string;

    constructor() {
        super();
        this.sourceCode = '';
        this.language = '';
    }
}
