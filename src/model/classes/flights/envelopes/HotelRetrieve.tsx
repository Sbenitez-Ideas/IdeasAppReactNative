import { ContactInfo } from "../../foundation/ContactInfo";
import { RoomStays } from "../../hotel-retrieve/RoomStaysRetrieve";
import { ServiceTotal } from "../../hotel-retrieve/ServiceTotal";
import { PolicyRetrieve } from "../../hotels/ota/PolicyRetrieve";


export class HotelRetrieveRS {
  ReservationDate: Date;
  LOC: string;
  TransactionCode: string;
  DeadLine: Date | string;
  CheckIn: Date | string;
  CheckOut: Date | string;
  HotelName: string;
  HotelCode: string;
  contactInfo: ContactInfo;
  StarLevel: number;
  roomstays: RoomStays[];
  total: ServiceTotal;
  policies: PolicyRetrieve;
  Markup: number;
  Remark: string;
  Status: string;
  SourceStatus: string;
  urlImage: string;
  SourceName: string;
  numRooms: number;
  sourceLOC: string;
  codEntidade: number;
  resh: number;
  numNights: number;
  AdtCount: number;
  ChdCount: number;
}
