export class CurrencyPair {
    private currencyFromValue: string;
    private currecyToValue: string;
    public Rate: number;

    public get currencyFrom(): string {
        return this.currencyFromValue;
    }

    public set currencyFrom(value: string) {
        this.currencyFromValue = value.toUpperCase();
    }

    public get currencyTo(): string {
        return this.currecyToValue;
    }

    public set currencyTo(value: string) {
        this.currecyToValue = value.toUpperCase();
    }
}
