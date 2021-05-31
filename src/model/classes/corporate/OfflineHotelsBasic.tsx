import { HotelOfflineRetrieve } from "./HotelOfflineRetrieve";


export class OfflineHotelsBasic {
    cityIATA: string;
    City: string;
    CheckIn: Date;
    CheckOut: Date;
    Notes: string;
    ShareRoom: boolean;
    Companion: string;
    FamilyAccomodation: boolean;
    Hotels: HotelOfflineRetrieve[];
    OtherHotel: boolean;
    PaymentDestination: boolean;
    FareOtherHotel: number;
    FeeHotel: number;
    FeeCurrencyHotel: string;

    constructor(hotelData: any) {
        this.cityIATA = hotelData.location.iata;
        this.City = hotelData.location.name;
        this.CheckIn = new Date(hotelData.checkIn);
        this.CheckOut = new Date(hotelData.checkOut);
        this.Notes = hotelData.observations;
        // TODO: Para flujos diferentes a davivienda

        this.ShareRoom = false;
        this.Companion = '';
        this.FamilyAccomodation = hotelData.onFamily;
        this.OtherHotel = hotelData.otherHotel;
        this.FareOtherHotel = hotelData.otherHotel ? hotelData.valueOtherHotel : 0;
        this.PaymentDestination = hotelData.payInDestiny;
        this.Hotels = [];
        if (hotelData.hotel) {
            const days = ((this.CheckOut.getTime() - this.CheckIn.getTime()) / 86400000);
            this.Hotels.push(new HotelOfflineRetrieve(hotelData.hotel, days));
        }

    }
}
