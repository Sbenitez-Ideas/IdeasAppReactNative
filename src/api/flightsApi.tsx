import axios from "axios";
import { useContext } from "react";
import { ResponseList } from "../model/classes/common/ResponseList";
import { BookingsRQ } from "../model/classes/flights/BookingsRQ";
import { AuthContext } from "../contexts/auth/AuthContext";
import { ConfigContext } from "../contexts/config/ConfigContext";
import { getHeader } from '../helpers/common/getHeaders';



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


    return {
        getBookings
    }

}