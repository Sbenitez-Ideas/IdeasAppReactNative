import { HotelsOffline } from "../../classes/corporate/HotelsOffline";
import { GeoLocation } from "../corporate/Geolocation";

;

export interface HotelOfflineRequest {
    location: GeoLocation;
    checkIn: Date;
    checkOut: Date;
    onFamily: boolean;
    payInDestiny: boolean;
    hotel: HotelsOffline;
    otherHotel: boolean;
    minDate: Date | null;
    maxDate: Date | null;
    observations: string;
    observationHint: string;
    listHotels: HotelsOffline[];
    hotels: any;
    stars: number[];
    locationCountry: string;
    valueOtherHotel: number;
    days: number;
    valuePayDestiny: number;
    valueFamily: number;
    currency: string;
    expenseInfo: any;
    international: boolean;
    feeValueOtherHotel: number;
    currencyFee: string;
}
