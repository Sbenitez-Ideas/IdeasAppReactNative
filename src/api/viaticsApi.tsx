import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthContext";
import { ConfigContext } from "../contexts/config/ConfigContext";
import { getHeader } from "../helpers/common/getHeaders";
import { ExpensesRQ } from '../model/interfaces/viatics/ExpensesRQ';
import { ExpensesRS } from '../model/interfaces/viatics/ExpensesRS';
import { ExpenseGroupRS } from '../model/interfaces/viatics/ExpenseGroupRS';
import { ExpenseGroupRQ } from '../model/interfaces/viatics/ExpenseGroupRQ';
import { Establishment } from '../model/classes/viatics/Establishment';
import { ExpenseEstablishmentRQ } from '../model/classes/viatics/ExpenseEstablishmentRQ';
import { ExpenseGroupsEmail } from '../model/classes/viatics/ExpensesGroupsEmail';
import { ExpenseGroupsEmailRS } from "../model/classes/viatics/ExpenseGroupEmailRS";
import { CategoriesEntity } from '../model/classes/viatics/CategoriesEntity';
import { ExpenseCategories } from '../model/classes/viatics/ExpenseCategories';
import { DownloadImageRQ } from '../model/classes/viatics/DownloadImages';
import { DownloadImagesRS } from "../model/classes/viatics/DownloadImagesRS";
import { DropExpenseRQ } from '../model/classes/viatics/DropExpenseRQ';
import { ExpenseActivitiesRQ } from '../model/classes/viatics/ExpenseActivitiesRQ';
import { ExpenseActivitiesRS } from '../model/interfaces/viatics/ExpenseActivitiesRS';
import { ExpensesSaveRQ } from '../model/interfaces/viatics/ExpensesSaveRQ';
import { ExpensesSaveRS } from "../model/classes/viatics/ExpensesSaveRS";
import { GetExpenseImage } from '../model/classes/viatics/GetExpenseImages';
import { ExpenseGroupUpdateRQ } from '../model/classes/viatics/ExpenseGroupUpdateRQ';
import { ExpenseAdvanceDefaultRQ } from '../model/classes/viatics/ExpenseAdvanceDefaultRQ';
import { ExpenseAdvanceDefaultRS } from "../model/classes/expenses/ExpenseAdvanceDefaultRS";


export const viaticsApi = () => {

    const { token } = useContext( AuthContext );
    const { AppData } = useContext( ConfigContext );
    const baseURL = AppData?.AppEndPoint.EndPoint;

    
    const getActivities = async( request: ExpenseActivitiesRQ ) => {
        const { data }  = await axios.post<ExpenseActivitiesRS>( baseURL + '/ActivitiesList', request, getHeader(token as string ) );
        return data;
    }

    const getExpense = async( request: ExpensesRQ ) => {
        const { data } = await axios.post<ExpensesRS>( baseURL + '/expenses', request, getHeader(token as string ) );
        return data;
    }

    const findExpenseGroups = async( request: ExpenseGroupRQ ) => {
        const { data } = await axios.post<ExpenseGroupRS>(  baseURL +  '/ExpenseGroups/ExpenseGroupFind', request, getHeader( token as string ) ); 
        return data;
    }

    const getEstablishments = async( request: ExpenseEstablishmentRQ ) => {
        const { data } = await axios.post<Establishment[]>( baseURL +  '/ExpenseEstablishment/' + request.IDEntity.toString(), request, getHeader( token as string ) );
        return data;
    }

    const sendEmailGroups = async( request: ExpenseGroupsEmail ) => {
        const { data } = await axios.post<ExpenseGroupsEmailRS>( baseURL + '/ExpenseGroups/SendEmail', request, getHeader( token as string ) );
        return data;
    }

    const getCategories = async( request: CategoriesEntity ) => {
        const { data } = await axios.post<ExpenseCategories[]>( baseURL + '/ExpenseCategories/' + request.IDEntity.toString(), request, getHeader( token as string ) );
        return data;
    }

    const downloadImages = async( request: DownloadImageRQ ) => {
        console.log( 'request', request );
        const { data } =  await axios.post<DownloadImagesRS>( baseURL + '/DownloadImages', request, getHeader( token as string ));
        return data;
    }

    const deleteExpense = async( request: DropExpenseRQ ) => {
        const { data } = await axios.post<ExpensesRS> ( baseURL + '/DropActivitie', request, getHeader( token as string ) );
        return data;
    }

    const saveExpenses = async( request: ExpensesSaveRQ ) => {
        const { data } = await axios.post<ExpensesSaveRS> ( baseURL + '/expenses/save', request, getHeader( token as string ) );
        return data;
    }

    const saveImage = async( request: GetExpenseImage ) => {
        const { data } = await axios.post<GetExpenseImage> (  baseURL + '/ExpenseGroups/SendImage', request, getHeader( token as string ) );
        return data;
    }

    const alterExpenseGroupItem = async( request: ExpenseGroupUpdateRQ ) => {   
        const { data } = await axios.post<GetExpenseImage> (  baseURL + '/ExpenseGroupItem/Update', request, getHeader( token as string ) );
        return data;
    }

    const getExpenseDefault = async( request: ExpenseAdvanceDefaultRQ ) => {
        const { data } = await axios.post<ExpenseAdvanceDefaultRS>( baseURL + '/Advance/expenses/byuser', request, getHeader( token as string ) );
        return data;
    }


    return {
        getActivities,
        getExpense,
        findExpenseGroups,
        getEstablishments,
        sendEmailGroups,
        getCategories,
        downloadImages,
        deleteExpense,
        saveExpenses,
        saveImage,
        alterExpenseGroupItem,
        getExpenseDefault
    }

}