import { useContext } from "react"
import { AuthContext } from "../contexts/auth/AuthContext";
import { ConfigContext } from "../contexts/config/ConfigContext";
import { GetCostCenterRQ } from "../model/classes/backoffice/GetCostCenterRQ";
import axios from 'axios';
import { ResponseList } from '../model/classes/common/ResponseList';
import { getHeader } from '../helpers/common/getHeaders';
import { BudgetReservationRQ } from '../model/classes/backoffice/BudgetReservationRQ';
import { GetBudgetReservation } from '../model/classes/backoffice/GetBudgetReservation';



export const backofficeApi = () => {
    
    const { token } = useContext( AuthContext );
    const { AppData } = useContext( ConfigContext );
    const baseURL = AppData?.AppEndPoint.EndPoint;
    const url = baseURL + '/backoffice/';

    /**
     * Makes a call to get cost centers and return it for subscription.
     *
     * @param {GetCostCenterRQ} request Cost center request params.
     * @returns {Observable<ResponseList>} Response list object with the cost center information.
     * @memberof BackofficeService
     */
    const getCostCenters = async( request: GetCostCenterRQ ) => {
        const { data } =  await axios.post<ResponseList>( url + 'getCostCenter', request,  getHeader( token as string ) );
        return data;
    }

    const getBudgets = async( request: BudgetReservationRQ ) => {
        const { data } = await axios.post<GetBudgetReservation>( url + 'budgetExec/getBudget', request, getHeader( token as string ) );
        return data;
    }



    return {
        getCostCenters,
        getBudgets
    }

}


