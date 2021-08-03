import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth/AuthContext';
import { ConfigContext } from "../contexts/config/ConfigContext";
import { TravelerCorporateRQ } from '../model/classes/corporate/TravelerCorporateRQ';
import { TravelerCorporate } from '../model/classes/corporate/TravelerCorporate';
import { getHeader } from '../helpers/common/getHeaders';
import { SetStatusCorporateRQ } from '../model/classes/corporate/SetStatusCorporateRQ';
import { SetStatusCorporateRS } from '../model/classes/corporate/SetStatusCorporateRS';
import { TravelerPolicyByIDRQ } from '../model/classes/corporate/TravelerPolicyByIDRQ';
import { TravelerPolicyByIDRS } from '../model/classes/corporate/TravelerPolicyByIDRS';
import { GetHotelOfflineEntityRS } from '../model/classes/corporate/GetHotelOfflineEntityRS';
import { GetHotelOfflineEntityRQ } from '../model/classes/corporate/GetHotelOfflineEntityRQ';
import { ApproverListRQ } from '../model/classes/corporate/ApproverListRQ';
import { ApproverListRS } from '../model/classes/corporate/ApproverListRS';
import { TripReasonRQ } from '../model/classes/corporate/TripReasonRQ';
import { TripReason } from '../model/classes/corporate/TripReason';




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

    const getPolicyUser = async( request: TravelerPolicyByIDRQ ) => {
        const { data } = await axios.post<TravelerPolicyByIDRS>( urlTravelers + 'policies', request, getHeader( token as string ) );
        return data;
    }

    const getHotelOffline = async( request: GetHotelOfflineEntityRQ ) => {
        const { data } = await axios.post<GetHotelOfflineEntityRS>( url + 'offline/hotelOfflineEntity', request, getHeader( token as string ) );
        return data;
    }

    const getApproverList = async( request: ApproverListRQ ) => {
        const { data } = await axios.post<ApproverListRS[]>( urlTravelers + 'approverList', request, getHeader( token as string ));
        return data;
    }

    const getTripReasons = async( request: TripReasonRQ ) => {
        const { data } = await axios.post<TripReason[]>( url + 'tripreasons', request, getHeader( token as string ));
        return data;
    }

    return {
        getTraveler,
        changeStatusBooking,
        getPolicyUser,
        getHotelOffline,
        getApproverList,
        getTripReasons
    }

}