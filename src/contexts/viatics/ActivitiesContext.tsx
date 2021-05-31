import React ,{ createContext } from "react";
import { useReducer } from 'react';
import { useEnpointInfo } from "../../hooks/common/useEnpointInfo";
import { ExpenseActivitiesRQ } from "../../model/interfaces/viatics/ExpenseActivitiesRQ";
import { ExpenseActivitiesRS } from "../../model/interfaces/viatics/ExpenseActivitiesRS";
import { activitiesReducer } from "./ActivitiesReducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHeader } from '../../helpers/common/getHeaders';
import { consolidatorApi } from "../../api/consolidatorApi";


type ActivitiesContextProps = {
    type: 'all' | 'pendingApprove' | 'pedingLegalize',
    errorMessage: string;
    activitiesData: ExpenseActivitiesRS | null;
    getActivities: ( request: ExpenseActivitiesRQ ) => void;
}

const ActivitiesInitialState: any = {
    type: 'all',
    errorMessage: '',
    activitiesData:  null
}


export const ActivitiesContext = createContext( {}  as ActivitiesContextProps );

export const ActivitiesProvider = ({ children }: any ) => {

    const [state, dispatch] = useReducer(activitiesReducer, ActivitiesInitialState );

    const getActivities = async( request: ExpenseActivitiesRQ ) => {
    
        try {
            
            const token =  await AsyncStorage.getItem('token');
            const { data } = await consolidatorApi().post<ExpenseActivitiesRS>( '/ActivitiesList', request, getHeader( token as string ));
            dispatch({
                type: 'getActivities', payload: {
                    type: 'all',   
                    activitiesData: data
                }
            })

        } catch (error) {            
        }
        
       
        
    }

    return (
        <ActivitiesContext.Provider value={{
            ...state,
            getActivities
        }}>
            { children }
        </ActivitiesContext.Provider>
    )

}