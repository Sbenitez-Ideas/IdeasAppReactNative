import axios from "axios";
import { useContext } from "react"
import { AuthContext } from '../contexts/auth/AuthContext';
import { ConfigContext } from "../contexts/config/ConfigContext";
import { getHeader } from '../helpers/common/getHeaders';



export const geolocationApi = () => {

    const { token } = useContext( AuthContext );
    const { AppData } = useContext( ConfigContext );
    const baseURL = AppData?.AppEndPoint.EndPoint;
    

    const searchLocation = async( request: any ) => {
        const { data } = await axios.post<any>( baseURL + '/geolocation', request, getHeader( token as string ) )
        return data;
    }

    return {
        searchLocation
    }
}