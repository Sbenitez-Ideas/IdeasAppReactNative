import { WSResponse } from "../../foundation/WSResponse";
import { SsrAvailability } from "./SsrAvailability";


export class AncillaryAvailabilityRS extends WSResponse {
    public ErrorMessage: string;
    public StatusCode: string;
    public StatusMessage: string;
    public ArrivalStation: string;
    public DepartureStation: string;
    public SegmentId: number;
    public SegmentKey: string;
    public FligthNumber: string;
    public SsrAvailability: SsrAvailability[];
    }
