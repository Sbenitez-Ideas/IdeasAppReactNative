import React, { createContext, useReducer } from "react";
import { SegmentSelected } from '../../model/classes/flights/SegmentSelected';
import { AvailabilityFilter } from '../../model/classes/availability/bussiness-objects/AvailabilityFilter';
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import { flightsReducer, FlightsState } from "./flightsReducer";


type FlightContextProps = {
    segments: SegmentSelected[];
    searchParams: { adults: number, childrens: number, babys: number, times: string, dates: string, departures: string, arrivals: string, baggage: string, cabine: { name: string, value: string }, direct: boolean, currency: string, language: string };
    type: string;
    airports: Airport[];
    filter: AvailabilityFilter;
    bestPriceSelected: boolean;
    setItemsPricing: ( segmentsArray: SegmentSelected[], typeSearch: string, params: any,  
        airportsArray: Airport[], bestPriceSelected: boolean ) => void
    getSegment: () => void;
    setSearchParams: ( searchParams: { adults: number, childrens: number, babys: number, times: string, dates: string, departures: string, arrivals: string, baggage: string, cabine: { name: string, value: string }, direct: boolean, currency: string, language: string } ) => void;
    setItemFilter: ( availabilityFilter: AvailabilityFilter ) => void
}


const FlightsInitialState: FlightsState = {
    type: '',
    segments: [],
    searchParams: {
        adults: 0, 
        childrens: 0, 
        babys: 0,
        times: '', 
        dates: '', 
        departures: '', 
        arrivals: '', 
        baggage: '', 
        cabine: { 
            name: '', 
            value: '' 
        }, 
        direct: false, 
        currency: '', 
        language: ''
    },
    airports: [],
    bestPriceSelected: false,
    filter: new AvailabilityFilter()

}


export const FlightsContext = createContext( {} as FlightContextProps )

export const FlightsProvider = ({ children }: any ) => {

    const [state, dispatch] = useReducer(flightsReducer, FlightsInitialState);


    const setItemsPricing = ( segmentsArray: SegmentSelected[], typeSearch: string, params: any, airportsArray: Airport[], bestPriceSelected: boolean ) => {
        dispatch({ type: 'setPricingItems', payload: { segmentsArray: segmentsArray, typeSearch: typeSearch, params: params, airportsArray: airportsArray, bestPriceSelected: bestPriceSelected } });
    }

    const getSegment = () => {
        dispatch({ type: 'getSegments' })
    }

    const setSearchParams = ( searchParams: { adults: number, childrens: number, babys: number, times: string, dates: string, departures: string, arrivals: string, baggage: string, cabine: { name: string, value: string }, direct: boolean, currency: string, language: string } ) => {
        dispatch({ type: 'setSearchParams', payload: { searchParams: searchParams } })
    }

    const setItemFilter = ( availabilityFilter: AvailabilityFilter ) => {
        dispatch({ type: 'setItemFilter', payload: { availabilityFilter: availabilityFilter } })
    }

    return (
        <FlightsContext.Provider value={{ 
            ...state,
            setItemsPricing,
            getSegment,
            setSearchParams,
            setItemFilter
        }}>
            { children }
        </FlightsContext.Provider>
    )

}