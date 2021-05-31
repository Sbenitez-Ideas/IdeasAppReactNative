export class Menu  {
    MenuName: string;
    ID: number;
    ParentID: number;
    Level: number;
    Picture1: string;
    Picture2: string;
    Link: /* 'RegisterExpensesScreen' | 'ActivitiesListScreen' | 'SplashScreen' | 'LoginScreen' | 'HomeScreen' | 'HomeViaticsScreen' | 'ProfileScreen' | 'BottomMenu' | 'ScreenSCS' | 'AutoCompleteSearch' | 'RegisterActivityScreen' | 'HomeHelpScreen' | 'HomeToolsScreen' | 'CheckinScreen' | 'ExpensesScreen' | 'BookingListScreen' | 'ReviewScreen' | 'Chat' | 'MoreScreen' |  */string;
    UniqueID: number;
    Languaje: number;
    Label: string;
    CssClass: string;
    Window: boolean;
    Items: Array<Menu>;
    Order: number;
    MenuNameAlt: string;
}