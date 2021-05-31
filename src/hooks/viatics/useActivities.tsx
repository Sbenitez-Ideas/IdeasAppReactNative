import { useEffect, useState, useContext } from 'react';
import { ExpenseActivitiesRS } from '../../model/interfaces/viatics/ExpenseActivitiesRS';
import { ExpenseActivitiesRQ } from '../../model/classes/viatics/ExpenseActivitiesRQ';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { consolidatorApi } from '../../api/consolidatorApi';
import { ConfigContext } from '../../contexts/config/ConfigContext';
import axios from 'axios';
import authApi from '../../api/authApi';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { GActivities } from '../../model/interfaces/viatics/GActivities';



export const useActivities = ( type: 'allActivities' |  'pendingLegalize' | 'pendingApprove' | 'filter', request: ExpenseActivitiesRQ, dataFilter?: { dateStart: string, dateEnd: string, state: string } ) => {

    const [activitiesList, setActivitiesList] = useState<ExpenseActivitiesRS>({
        Error: '',
        totalRecords: 0,
        ListActivities: [],
        ExpenseGroup: []
    });

    const [loading, setLoading] = useState(false);
    const { AppData } = useContext( ConfigContext );
    const { token } = useContext( AuthContext );


    useEffect(() => {
        
        getActivities();

    }, [])

    const getActivities = async() => {
            const baseURL = AppData?.AppEndPoint.EndPoint;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ token }`
                }
            };
            try {
                const { data } = await axios.post<ExpenseActivitiesRS>( baseURL + '/ActivitiesList' , request, config );
                data.ListActivities = setActivitieFilter(data.ListActivities);
                setLoading( true );
                setActivitiesList( data ); 
            } catch (error) {
            }
            
               
    }
        

    const setActivitieFilter = ( response: GActivities[] ): GActivities[]  => {
        switch (type) {
            case 'allActivities':
                return response = response.filter(a =>
                    (a.TypeOwner === 'S'  || a.TypeOwner === 'A') && (a.State !== 'A' && a.State !== 'F'));
            
            case 'pendingLegalize':
                return response = response.filter(a =>
                    (a.TypeOwner === 'S'  || a.TypeOwner === 'A') && (a.State === 'J' || a.State === 'P'));

            case 'pendingApprove':
                return response = response.filter(a =>
                    (a.TypeOwner === 'P') && (a.State !== 'F'));
            
            case 'filter': 
                    const dateStart: Date = new Date( dataFilter?.dateStart as string );
                    const dateEnd: Date = new Date( dataFilter?.dateEnd as string );

                if ( dataFilter?.dateStart !== '' && dataFilter?.dateEnd !== '' && dataFilter?.state !== '' ) {
                    return response = response.filter( a => (new Date(a.DateSta) >=  dateStart)  && (new Date(a.DateEnd) <= dateEnd)  && a.State === dataFilter?.state )
                    
                } else if ( dataFilter?.dateStart !== '' && dataFilter?.dateEnd !== '' ) {
                    return response = response.filter( a => (new Date(a.DateSta) >=  dateStart)  && (new Date(a.DateEnd) <= dateEnd))
                } else {
                    return response = response.filter( a => a.State === dataFilter?.state )
                }
            default:
                return response = response;
        }
    }

    


    return {
        activitiesList,
        loading,
        getActivities
    }

}