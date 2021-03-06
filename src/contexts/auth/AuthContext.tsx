import React, { createContext, useContext, useReducer, useState } from "react";
import { authReducer, AuthState } from "./AuthReducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../../api/authApi';
import { AuthenticateResponse } from "../../model/interfaces/auth/AuthenticateResponse";
import { UserCredentials } from "../../model/interfaces/auth/UserCredentials";
import { ConfigContext } from '../config/ConfigContext';
import { IFTPEndPointRS } from '../../model/interfaces/auth/IFTPEndPointRS';
import { EndPointApp } from '../../model/interfaces/auth/EndPointApp';
import { CustomUserSession } from '../../model/interfaces/auth/CustomUserSession';
import { EntityParams } from "../../model/interfaces/common/EntityParams";
import Toast from 'react-native-toast-message';
import { TravelerCorporate } from '../../model/classes/corporate/TravelerCorporate';
import { useTranslation } from 'react-i18next';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    userData: CustomUserSession;
    travelerRequestData: any;
    selectedTravelers: TravelerCorporate[];
    selectedServices: { service: any, completed: boolean }[];
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signIn: (userCredentials: UserCredentials) => void;
    logOut: () => void;
    assignSelectedTravelers: ( travelers: TravelerCorporate[] ) => void;
    assignMotive: ( motive: { ID: string, Text: string } ) => void;
    assignApprover: ( approver: { approverName: string, idApprover: number } ) => void;
    assignPassenger: ( IDUser: number ) => void;
    removeError: () => void;
    assignSelectedServices: ( services: { service: any, completed: boolean }[] ) => void;
}


const params: EntityParams = {
    AddTaxesRate: false,
    AlterFeeValuesQuotation: false,
    CanChangePassword: false,
    CanGroupBookings: false,
    CanUpdateProfile: false,
    CurrencyFlightSearch: '',
    CurrencyInternationalFlights: '',
    DisableAirlinesFilter: false,
    DisableFilters: false,
    DisableSourceSelection: false,
    FareTypeDefault: '',
    FlightSearchMode: '',
    ForceBaggage: false,
    ForceBaggageInter: false,
    HidePromocode: false,
    HideTaxesFlights: false,
    JustSeeFlightAvailability: false,
    NumRecommendations: 0,
    NumberDaysAhead: '',
    RememberLastSearch: false,
    SearchButtonDependingRoute: false,
    ShowDiscriminatedValue: false,
    ShowFlightSources: false,
    ShowFlightsCalendar: false,
    ShowIntScheduleSearchBtn: false,
    ShowSearchHotelSourceList: false,

    MOSTRARLISTABROKERSBUSQHOTELES: '',
    AUTOFILLHOTELPAXFORM: '',
    MOSTRARHOTELBROKERRESULTADOS: '',
    B2C2_NumHabitaHoteles: 0,
    B2C2_DeltaFechaHoteles: 0,
    B2C2_OffsetFechaHoteles: 0,
    B2C2_NumAdultosHoteles: 0,
    NUMEROADULTOSBUSCADORHOTEL: 0,
    B2C2_NumNinosHoteles: 0,
    B2C2_EdadesNinosHoteles: 0,
    RECORDARULTIMACONSULTA: '',
    HOTELFORCEOMNIBEESCORPCODE: '',
    VISUALIZACOMISIONHOTELES: '',
    HOTEL_SHOWSOURCERETRIEVE: '',
    OCULTARMARKUPHOTELESRETRIEVE: '',
    HOTEL_SEARCHBOXHOTELNAME: '',
    HOTEL_SEARCHBOXHOTELRATING: '',
    HOTELSHOWNAMADEUSCRITERIA: '',

    // params hotel search
    NumHotelRoom: 0,
    UseCodeOmnibees: '',
    DeltaDateHotels: 0,
    NumberAdultsRoom: 0,
    NumberChildrenRoom: 0,
    AgeChildren: 0,
    NumberAdultSelect: 0,
    SearchHotelRating: false,
    SearchHotelName: false,
    OffsetSearchDate: 0,

    // Other Hotel
    TARIFAINTERNACIONALHOTELOFFLINE: 0,
    TARIFANACIONALHOTELOFFLINE: 0,

    // Expenses
    MOSTRARCOMPONENTETAXI: '',

    /// Transporte Especial
    MONEDATRANSPORTEESPECIAL: '',
    VALORBASETRANSPORTEESPECIAL: 0,
    USADESTINOSCOMBOVIATICOS: '',

    // Buscador viaticos
    PERMITEMODIFICARDIASVIATICOS: false,

    // Consultar y mostrar reservas duplicadas
    MOSTRARRESERVASDUPLICADAS: false,
    RestrictedBudget: false,
    NatAvailableDays: '',
    IntAvailableDays: '',
    FEEMANEJAFEEVIATICOS: '',
    FEEMANEJAFEEHOTELOFFLINE: '',
    FEEMODOFEEHOTELOFFLINE: '',
    FEEHOTELOFFLINEVALORINTER: 0,
    FEEHOTELOFFLINEMONEDAINTER: '',
    FEEHOTELOFFLINEVALORNAL: 0,
    FEEHOTELOFFLINEMONEDANAL: '',
    FEEMODOFEEVIATICOS: '',
    FEEVIATICOVALOROTROSSERVICIOSINTER: 0,
    FEEVIATICOMONEDAINTER: '',
    FEEVIATICOVALOROTROSSERVICIOSNAL: 0,
    FEEVIATICOMONEDANAL: '',
    FEEVIATICOVALORNAL: 0,
    FEEVIATICOVALORINTER: 0,
    FEEMANEJAFEETRANSPESPECIAL: '',
    FEEMODOFEETRANSPORTEESPECIAL: '',
    FEETRANSPEXPECIALVALORINTER: 0,
    FEETRANSPESPECIALMONEDAINTER: '',
    FEETRANSPEXPECIALVALORNAL: 0,
    FEETRANSPESPECIALMONEDANAL: '',

    //Viaticos

    VIATSOLICITARESTABLECIMIENTOS: '',
    CREARACTIAUTOMAAPP: '',
}

const intialUserdata: CustomUserSession = {
    IDUser: 0,
    PhotoUrl: '',
    IDEntity: 0,
    IDEntityDefault: 0,
    IDEntityAssigned: 0,
    EntityName: '',
    LogoEntity: '',
    SymbolLogoEntity: '',
    JobTitle: '',
    Password: '',
    UserState: '',
    UserType: '',
    ResetPassword: false,
    EntityDefaultName: '',
    EntityAssignedName: '',
    TypeEntity: 0,
    TypeEntityDefault: 0,
    TypeEntityAssigned: 0,
    ISO2pais: '',
    CurrencyDomain: '',
    CurrencyConversion: '',
    ConversionValue: 0,
    Login: '',
    TCAccepted: false,
    Params: params,
    BookigOfficialPass: false,
    BookingGuestPass: false,
    ApproverExpenses: false,
    Address2: '',
    City: '',
    State: '',
    Country: '',
    Culture: '',
    FullName: '',
    Gender: '',
    Language: '',
    MailAddress: '',
    Nickname: '',
    Address: '',
    PostalCode: '',
    RequestTokenSecret: '',
    CreatedAt: new Date(),
    LastModified: new Date(),
    Roles: [],
    Permissions: [],
    IsAuthenticated: false,
    FromToken: false,
    ProfileUrl: '',
    Sequence: '',
    Tag: 0,
    TimeZone: '',
    AuthProvider: '',
    BirthDateRaw: '',
    PhoneNumber: '',
    ReferrerUrl: '',
    Id: '',
    UserAuthId: '',
    BirthDate: new Date(),
    UserName: '',
    TwitterUserId: '',
    TwitterScreenName: '',
    UserAuthName: '',
    FacebookUserName: '',
    FirstName: '',
    LastName: '',
    DisplayName: '',
    Company: '',
    Email: '',
    PrimaryEmail: '',
    FacebookUserId: '',
    ProviderOAuthAccess: [],

}

const AuthInitialState: AuthState = { 
    status: 'checking',
    token: null,
    user: null,
    errorMessage: '',
    travelerRequestData: {},
    selectedTravelers: [],
    selectedServices: [],
    userData: intialUserdata


}


export const AuthContext = createContext( {} as AuthContextProps );
export const AuthProvider = ({ children }: any) => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(authReducer, AuthInitialState);

    const getEnpointData = async(): Promise<IFTPEndPointRS> => {
        const EndPointData = await AsyncStorage.getItem('endpointData')
        const transformData: IFTPEndPointRS = JSON.parse(EndPointData as string)
        return transformData;
    }

    const signIn = async( request: UserCredentials ) => {
        const enpointData = await getEnpointData();
        console.log(  )
        const tokenUrl = enpointData.AppEndPoint.EndPoint + '/auth/credentials';
        try {
            const { data } = await authApi.post<AuthenticateResponse>( tokenUrl, request );
            await AsyncStorage.setItem('token', JSON.stringify( data.BearerToken ));
            await getUserInfo( enpointData.AppEndPoint.EndPoint, data );
            

        } catch( error ) {
            console.log( 'error aqui',error )
            dispatch({ type: 'addError', payload: 'Usuario o Contrase??a invalidos' })
        }
    };

    const getUserInfo = async( url: string, dataAuth: AuthenticateResponse ) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ dataAuth.BearerToken }`
            }
        }
        const urlUserSession = url + '/iftp_log';
        try{
            const { data } = await  authApi.post<any>( urlUserSession, {}, config );
            Toast.show({
                text1: t( 'resBienvenido' ),
                text2: `${ data.CurrentUserSession.FirstName } ${ data.CurrentUserSession.LastName }`,
                type: 'info',
                visibilityTime: 1000,
            });
            dispatch({ type: 'signUp', payload: {
                token: dataAuth.BearerToken,
                user: dataAuth.UserName,
                userData:  data.CurrentUserSession as CustomUserSession
            }})
        } catch( error ) {
            dispatch({ type: 'addError', payload: t( 'resErrorDatosUsuario' ) })
        }
        
    }

    const assignSelectedTravelers = ( selectedTravelers: TravelerCorporate[] ) => {
        dispatch({ type: 'assignTravelers', payload: { travelers:  selectedTravelers } })
    }

    const assignMotive = ( motive: { ID: string, Text: string }) => {
        dispatch({ type: 'assignMotive', payload: { motive: motive } })
    }

    const assignApprover = ( approver: { approverName: string, idApprover: number } ) => {
        dispatch({ type: 'assignApprover', payload: { approver: approver } })
    }

    const assignPassenger = ( IDUser: number ) => {
        dispatch({ type: 'assignPassenger', payload: { IDUser: IDUser } })
    }

    const assignSelectedServices = ( services: { service: string, completed: boolean }[] ) => {
        dispatch({ type: 'assignSelectedServices', payload: { services: services } });
    }

    const logOut = () => {};

    const removeError = () => {
        dispatch({ type: 'removeError' })
    };
    

    return (
        <AuthContext.Provider value={{
            ...state,
            signIn,
            logOut,
            removeError,
            assignSelectedTravelers,
            assignMotive,
            assignApprover,
            assignPassenger,
            assignSelectedServices
        }}>
            { children }
        </AuthContext.Provider>
    )

}