import axios, { AxiosInstance } from 'axios';
import { useContext } from 'react';
import { useEnpointInfo } from '../hooks/common/useEnpointInfo';
import { ConfigContext } from '../contexts/config/ConfigContext';


export const consolidatorApi = () => {

    const { AppData } = useContext( ConfigContext );

    
    const baseURL =  AppData?.AppEndPoint.EndPoint;

    const consolidatorApi = axios.create({  baseURL });

    return  consolidatorApi;

}









