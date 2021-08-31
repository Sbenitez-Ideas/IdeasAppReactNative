import { FlightsAndAirports } from "../../interfaces/flights/FlightsAndAirports";

export class SegmentSelected {
    JourneyIndex: number;
    RecommendationIndex: number;
    SegmentSelected: FlightsAndAirports;
    ResetSelection: boolean;
}
