import { AvailabilityFilter } from "../../model/classes/availability/bussiness-objects/AvailabilityFilter";
import { Airport } from "../../model/classes/flights/business-objects/Airport";
import { SegmentSelected } from "../../model/classes/flights/SegmentSelected";


export interface FlightsState {

    segments: SegmentSelected[];
    searchParams: { adults: number, childrens: number, babys: number, times: string, dates: string, departures: string, arrivals: string, baggage: string, cabine: { name: string, value: string }, direct: boolean, currency: string, language: string  };
    type: string;
    airports: Airport[];
    filter: AvailabilityFilter;
    bestPriceSelected: boolean;

}


type FlightsAction =
    | { type: 'setPricingItems', payload: { segmentsArray: SegmentSelected[], typeSearch: string, params: any, airportsArray: Airport[], bestPriceSelected: boolean} }
    | { type: 'getSegments' }
    | { type: 'setSearchParams', payload: { searchParams: { adults: number, childrens: number, babys: number, times: string, dates: string, departures: string, arrivals: string, baggage: string, cabine: { name: string, value: string }, direct: boolean, currency: string, language: string } } }
    | { type: 'setItemFilter', payload: { availabilityFilter: AvailabilityFilter } }



export const flightsReducer = ( state: FlightsState, action: FlightsAction ) => {
    switch ( action.type ) {
        case 'setPricingItems':
            return  {
                ...state,
                segments: action.payload.segmentsArray,
                type: action.payload.typeSearch,
                searchParams: action.payload.params,
                airports: action.payload.airportsArray,
                bestPriceSelected: action.payload.bestPriceSelected
            }

        case 'getSegments': 
            return {
                ...state,
                segments: state.segments
            }
        
        case 'setSearchParams':
            return {
                ...state,
                searchParams: action.payload.searchParams
            }
        case 'setItemFilter':
            return {
                ...state,
                filter: action.payload.availabilityFilter
            }

        default:
            return state;
    }
}