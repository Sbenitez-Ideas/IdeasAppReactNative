import { PolicyRetrieve } from "../hotels/ota/PolicyRetrieve";
import { Guest } from "./GuestHotelRetrieve";
import { RateDetails } from "./RateDetails";

export class RoomStays
{
    id: number;
    Rate: RateDetails;
    roomType: string;
    roomTypeCode: number;
    ratePlan: string;        
    guest: Guest[]; 
    roomPolicies: PolicyRetrieve;
}