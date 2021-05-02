export interface EntityParams {

    AddTaxesRate: boolean;
    AlterFeeValuesQuotation: boolean;
    CanChangePassword: boolean;
    CanGroupBookings: boolean;
    CanUpdateProfile: boolean;
    CurrencyFlightSearch: string;
    CurrencyInternationalFlights: string;
    DisableAirlinesFilter: boolean;
    DisableFilters: boolean;
    DisableSourceSelection: boolean;
    FareTypeDefault: string;
    FlightSearchMode: string;
    ForceBaggage: boolean;
    ForceBaggageInter: boolean;
    HidePromocode: boolean;
    HideTaxesFlights: boolean;
    JustSeeFlightAvailability: boolean;
    NumRecommendations: number;
    NumberDaysAhead: string;
    RememberLastSearch: boolean;
    SearchButtonDependingRoute: boolean;
    ShowDiscriminatedValue: boolean;
    ShowFlightSources: boolean;
    ShowFlightsCalendar: boolean;
    ShowIntScheduleSearchBtn: boolean;
    ShowSearchHotelSourceList: boolean;

    MOSTRARLISTABROKERSBUSQHOTELES: string;
    AUTOFILLHOTELPAXFORM: string;
    MOSTRARHOTELBROKERRESULTADOS: string;
    B2C2_NumHabitaHoteles: number;
    B2C2_DeltaFechaHoteles: number;
    B2C2_OffsetFechaHoteles: number;
    B2C2_NumAdultosHoteles: number;
    NUMEROADULTOSBUSCADORHOTEL: number;
    B2C2_NumNinosHoteles: number;
    B2C2_EdadesNinosHoteles: number;
    RECORDARULTIMACONSULTA: string;
    HOTELFORCEOMNIBEESCORPCODE: string;
    VISUALIZACOMISIONHOTELES: string;
    HOTEL_SHOWSOURCERETRIEVE: string;
    OCULTARMARKUPHOTELESRETRIEVE: string;
    HOTEL_SEARCHBOXHOTELNAME: string;
    HOTEL_SEARCHBOXHOTELRATING: string;
    HOTELSHOWNAMADEUSCRITERIA: string;

    // params hotel search
    NumHotelRoom: number;
    UseCodeOmnibees: string;
    DeltaDateHotels: number;
    NumberAdultsRoom: number;
    NumberChildrenRoom: number;
    AgeChildren: number;
    NumberAdultSelect: number;
    SearchHotelRating: boolean;
    SearchHotelName: boolean;
    OffsetSearchDate: number;

    // Other Hotel
    TARIFAINTERNACIONALHOTELOFFLINE: number;
    TARIFANACIONALHOTELOFFLINE: number;

    // Expenses
    MOSTRARCOMPONENTETAXI: string;

    /// Transporte Especial
    MONEDATRANSPORTEESPECIAL: string;
    VALORBASETRANSPORTEESPECIAL: number;
    USADESTINOSCOMBOVIATICOS: string;

    // Buscador viaticos
    PERMITEMODIFICARDIASVIATICOS: boolean;

    // Consultar y mostrar reservas duplicadas
    MOSTRARRESERVASDUPLICADAS: boolean;
    RestrictedBudget: boolean;
    NatAvailableDays: string;
    IntAvailableDays: string;
    FEEMANEJAFEEVIATICOS: string;
    FEEMANEJAFEEHOTELOFFLINE: string;
    FEEMODOFEEHOTELOFFLINE: string;
    FEEHOTELOFFLINEVALORINTER: number;
    FEEHOTELOFFLINEMONEDAINTER: string;
    FEEHOTELOFFLINEVALORNAL: number;
    FEEHOTELOFFLINEMONEDANAL: string;
    FEEMODOFEEVIATICOS: string;
    FEEVIATICOVALOROTROSSERVICIOSINTER: number;
    FEEVIATICOMONEDAINTER: string;
    FEEVIATICOVALOROTROSSERVICIOSNAL: number;
    FEEVIATICOMONEDANAL: string;
    FEEVIATICOVALORNAL: number;
    FEEVIATICOVALORINTER: number;
    FEEMANEJAFEETRANSPESPECIAL: string;
    FEEMODOFEETRANSPORTEESPECIAL: string;
    FEETRANSPEXPECIALVALORINTER: number;
    FEETRANSPESPECIALMONEDAINTER: string;
    FEETRANSPEXPECIALVALORNAL: number;
    FEETRANSPESPECIALMONEDANAL: string;

    //Viaticos

    VIATSOLICITARESTABLECIMIENTOS: string;
    CREARACTIAUTOMAAPP: string;
    
}
