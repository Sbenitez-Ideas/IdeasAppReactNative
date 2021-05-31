import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthContext";
import { ConfigContext } from "../contexts/config/ConfigContext";
import { TravelerCorporateRQ } from '../model/classes/corporate/TravelerCorporateRQ';
import { TravelerCorporate } from '../model/classes/corporate/TravelerCorporate';
import { getHeader } from '../helpers/common/getHeaders';
import { SetStatusCorporateRQ } from '../model/classes/corporate/SetStatusCorporateRQ';
import { SetStatusCorporateRS } from "../model/classes/corporate/SetStatusCorporateRS";




export const corporateApi = () => {

    const { token } = useContext( AuthContext );
    const { AppData } = useContext( ConfigContext );
    const baseURL = AppData?.AppEndPoint.EndPoint;

    const url = baseURL + '/corporate/';
    const urlTravelers = baseURL + '/travelers/';

    const getTraveler = async( request: TravelerCorporateRQ ) => {
        const { data } = await axios.post<TravelerCorporate[]>( urlTravelers + 'entity', request, getHeader( token as string ) )
        return data;
    }

    const changeStatusBooking = async( request: SetStatusCorporateRQ ) => {
        const { data } = await axios.post<SetStatusCorporateRS>( baseURL + '/CorporateFlow/SetStatusCorporate', request, getHeader( token as string ) )
        return data;
    }


    return {
        getTraveler,
        changeStatusBooking
    }

}