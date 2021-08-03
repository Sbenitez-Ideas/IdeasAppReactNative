import React, { createContext,useReducer } from "react";
import { configReducer, configState } from './configReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IFTPEndPointRQ } from "../../model/interfaces/auth/IFTPEndPointRQ";
import { IFTPEndPointRS } from "../../model/interfaces/auth/IFTPEndPointRS";
import authApi from "../../api/authApi";

type ConfigContextProps = {
    AppData: IFTPEndPointRS | null;
    getEndpointData: (request: IFTPEndPointRQ) => void;
}

const configInitialState: configState = {
    AppData: null,
    Status: false,
    Msg: ''
}

export const ConfigContext = createContext({} as ConfigContextProps)


export const ConfigProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(configReducer, configInitialState);

    const getEndpointData = async(request: IFTPEndPointRQ) => {
        try {
            const { data } = await authApi.post<IFTPEndPointRS>('', request);
            /* use Temporally */
            data.AppEndPoint.EndPoint = 'https://serv-rest.kontroltravel.com';
            console.log( 'aqui', data.AppEndPoint.EndPoint );
            dispatch({ 
                type: 'getEndpointData',
                payload: {
                    AppData: data
                }
            });
            await AsyncStorage.setItem('endpointData', JSON.stringify(data));
        } catch (error) {
        }
    }

    return (
        <ConfigContext.Provider value={{
            ...state,            
            getEndpointData
        }}>
            { children }
        </ConfigContext.Provider>
    )
}