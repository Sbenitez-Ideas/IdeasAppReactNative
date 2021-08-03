import axios from "axios";
import { useContext } from "react";
import { ResponseList } from "../model/classes/common/ResponseList";
import { BookingsRQ } from "../model/classes/flights/BookingsRQ";
import { AuthContext } from "../contexts/auth/AuthContext";
import { ConfigContext } from "../contexts/config/ConfigContext";
import { getHeader } from '../helpers/common/getHeaders';
import { AvailabilityRQ } from '../model/classes/availability/envelopes/AvailabilityRQ';
import { AvailabilityByPriceRS } from "../model/classes/availability/envelopes/AvailabilityByPriceRS";
import { AvailabilitySingleJourneyRS } from "../model/classes/availability/envelopes/AvailabilitySingleJourneyRS";



export const flightsApi = () => {
    const { token } = useContext( AuthContext );
    const { AppData } = useContext( ConfigContext );
    const baseURL = AppData?.AppEndPoint.EndPoint;

    const url = baseURL + '/corporate/';
    const urlTravelers = baseURL + 'travelers';

    const getBookings  = async( request: BookingsRQ ) => {  
        const { data } = await axios.post<ResponseList>( url + 'getBookings', request, getHeader( token as string ) );
        return data;
    }

    const getAvailability = async ( type: 'single' | 'price', request: AvailabilityRQ ) => {
        const { data } = await axios.post<AvailabilityByPriceRS | AvailabilitySingleJourneyRS[]>( url + 'availability/' + type, request, getHeader( token as string ) );
        return data;

    }

    return {
        getBookings,
        getAvailability
    }

}