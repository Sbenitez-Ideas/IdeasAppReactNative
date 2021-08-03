import { useContext } from "react"
import { AuthContext } from '../contexts/auth/AuthContext';
import { ConfigContext } from "../contexts/config/ConfigContext";
import axios from 'axios';
import { EnhancedRetrieveRS } from "../model/classes/common/EnhancedRetrieveRS";
import { getHeader } from '../helpers/common/getHeaders';
import { EnhancedRetrieveInternalRQ } from '../model/classes/common/EnhancedRetrieveInternalRQ';
import { MenuRQ } from '../model/classes/common/MenuRQ';
import { Menu } from "../model/classes/common/Menu";



export const commonApi = () => {

    const { token } = useContext( AuthContext );
    const { AppData } = useContext( ConfigContext );
    const baseURL = AppData?.AppEndPoint.EndPoint;
    


    const getMainMenu = async( request: MenuRQ) => {
        console.log('baseURL', baseURL )
        const { data } = await axios.post<Menu>( baseURL + '/Base/Menu', request, getHeader( token as string ) );
        return data;
    }

    const getInternalRetrieve = async( request: EnhancedRetrieveInternalRQ ) => {
        const { data } = await axios.post<EnhancedRetrieveRS>( baseURL + '/common/retrieve_internal', request, getHeader( token as string ) );
        return data;
    } 

    return  {
        getInternalRetrieve,
        getMainMenu
    }

}