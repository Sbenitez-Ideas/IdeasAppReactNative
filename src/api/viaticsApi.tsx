import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthContext";
import { ConfigContext } from "../contexts/config/ConfigContext";
import { getHeader } from "../helpers/common/getHeaders";
import { ExpensesRQ } from '../interfaces/viatics/ExpensesRQ';
import { ExpensesRS } from '../interfaces/viatics/ExpensesRS';
import { ExpenseGroupRS } from '../interfaces/viatics/ExpenseGroupRS';
import { ExpenseGroupRQ } from '../interfaces/viatics/ExpenseGroupRQ';
import { Establishment } from '../classes/viatics/Establishment';
import { ExpenseEstablishmentRQ } from '../classes/viatics/ExpenseEstablishmentRQ';
import { ExpenseGroupsEmail } from '../classes/viatics/ExpensesGroupsEmail';
import { ExpenseGroupsEmailRS } from "../classes/viatics/ExpenseGroupEmailRS";
import { CategoriesEntity } from '../classes/viatics/CategoriesEntity';
import { ExpenseCategories } from '../classes/viatics/ExpenseCategories';
import { DownloadImageRQ } from '../classes/viatics/DownloadImages';
import { DownloadImagesRS } from "../classes/viatics/DownloadImagesRS";
import { DropExpenseRQ } from '../classes/viatics/DropExpenseRQ';
import { ExpenseActivitiesRQ } from '../classes/viatics/ExpenseActivitiesRQ';
import { ExpenseActivitiesRS } from '../interfaces/viatics/ExpenseActivitiesRS';
import { ExpensesSaveRQ } from '../interfaces/viatics/ExpensesSaveRQ';
import { ExpensesSaveRS } from "../classes/viatics/ExpensesSaveRS";
import { GetExpenseImage } from '../classes/viatics/GetExpenseImages';
import { ExpenseGroupUpdateRQ } from '../classes/viatics/ExpenseGroupUpdateRQ';


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
        alterExpenseGroupItem
    }

}