import { ServicePriceDetails } from "./ServicePriceDetails";

export class SsrAvailability {
    public Carrier: string;
    public available: boolean;
    public Code: string;
    public Name: string;
    public AvailableCount: number;
    public FeecCode: string;
    public TotalPrice: number;
    public ServicePrice: ServicePriceDetails[];
}
