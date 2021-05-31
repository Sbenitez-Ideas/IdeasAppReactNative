export class HotelOfflineRetrieve {
    ID: number;
    Name: string;
    Category: string;
    Value: number;
    TotalValue: number;
    FeeHotel: number;
    FeeCurrencyHotel: string;

    constructor(hotel: any, days: number) {
        this.ID = hotel.ID;
        this.Name = hotel.Name;
        this.Category = '';
        this.Value = hotel.Fare;
        this.TotalValue = (hotel.Fare * days);
    }
}
