import { useEffect, useState } from 'react';
import { CustomUserSession } from '../../interfaces/auth/CustomUserSession';
import { EntityParams } from '../../interfaces/common/EntityParams';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const useUserInfo = () => {
    const [user, setUser] = useState<CustomUserSession>({
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

    });


    const getUser = async() => {
        try {
            await AsyncStorage.getItem('userData').then(( value ) => {
                const transformData: CustomUserSession = JSON.parse( value as string );
                setUser( transformData );
            });
        }
        catch (error) {
        }
        
    }
    
    useEffect(() => {

        getUser();

    }, [])

    
    return {
        user
    };

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


