import React, { useState } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { ThemeContext } from '../contexts/theme/ThemeContext';
import { LoginScreen } from '../screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import { SplashScreen } from '../screens/SplashScreen';
import { AuthContext } from '../contexts/auth/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { RegisterExpensesScreen } from '../screens/viatics/RegisterExpensesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProfileNavigation } from '../components/common/ProfileNavigation';
import { HomeViaticsScreen } from '../screens/viatics/HomeViaticsScreen';
import { ActivitiesListScreen } from '../screens/viatics/ActivitiesListScreen';
import { FilterActivitiesScreen } from '../screens/viatics/FilterActivitiesScreen';
import { BottomMenu } from '../components/common/BottomMenu';
import { navigationRef } from './RootNavigation';
import { AutoCompleteSearch } from '../components/common/AutoCompleteSearch';
import { GActivities } from '../model/interfaces/viatics/GActivities';
import { ExpenseCategories } from '../model/classes/viatics/ExpenseCategories';
import { CurrencyTypes } from '../model/classes/viatics/CurrencyTypes';
import { Establishment } from '../model/classes/viatics/Establishment';
import { RegisterActivityScreen } from '../screens/viatics/RegisterActivityScreen';
import { GExpenses } from '../model/interfaces/viatics/GExpenses';
import { HomeHelpScreen } from '../screens/common/HomeHelpScreen';
import { HomeToolsScreen } from '../screens/common/HomeToolsScreen';
import { CheckinScreen } from '../screens/common/CheckinScreen';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { ExpensesScreen } from '../screens/viatics/ExpensesScreen';
import { BookingListScreen } from '../screens/flights/BookingListScreen';
import { ReviewScreen } from '../screens/review/ReviewScreen';
import { Chat } from '../components/common/Chat';
import { MoreScreen } from '../screens/common/MoreScreen';
import { Menu } from '../model/classes/common/Menu';
import { ChangeLanguageScreen } from '../screens/common/ChangeLanguageScreen';
import { MyServicesScreen } from '../screens/corporate/MyServicesScreen';
import { Booking } from '../model/interfaces/flights/Bookings';
import { RequestServices } from '../screens/common/RequestServices';
import { SlidesScreen } from '../screens/common/SlidesScreen';
import { TravelerCorporate } from '../model/classes/corporate/TravelerCorporate';
import { ApproverListRS } from '../model/classes/corporate/ApproverListRS';
import { GetCostCenterRS } from '../model/classes/backoffice/GetCostCenterRS';
import { FlightSearchScreen } from '../screens/flights/FlightSearchScreen';
import { FilterRequestsScreen } from '../screens/corporate/FilterRequestsScreen';
import { GeoLocation } from '../model/interfaces/corporate/Geolocation';
import { FlightAvailabilityScreen } from '../screens/flights/FlightAvailabilityScreen';


export type RootStackParams = {
    SplashScreen: undefined,
    LoginScreen: undefined,
    HomeScreen: undefined,
    HomeViaticsScreen: undefined,
    RegisterExpensesScreen: { activity?: GActivities, category?: ExpenseCategories, currencyType?: CurrencyTypes, establishments?: Establishment, expense?: GExpenses, type?: string },
    ProfileScreen: undefined,
    ActivitiesListScreen: { type: 'allActivities' |  'pendingLegalize' | 'pendingApprove' | 'filter', refresh?: boolean, dataFilter?: { dateStart: string, dateEnd: string, state: string } },
    FilterActivitiesScreen: { activities: GActivities[], alreadyFiltered?: boolean, beforeFiltered?: { dateStart: string, dateEnd: string, state: string } },
    BottomMenu: undefined,
    ScreenSCS: undefined,
    AutoCompleteSearch: { type: 'Activities' | 'Category' | 'CurrencyType' | 'Establishment' | 'Traveler' |  'Approvers' | 'CostCenter' | 'Location', screen: 'RegisterExpensesScreen' | 'RegisterActivityScreen' | 'RequestServices' | 'FlightSearchScreen', index?: number, typeSearch?: string },
    RegisterActivityScreen: { currencyType?: CurrencyTypes, activity?: GActivities, type?: string},
    HomeHelpScreen: undefined,
    HomeToolsScreen: undefined,
    CheckinScreen: undefined,
    ExpensesScreen: {currentActivity: GActivities,  type?: 'allActivities' |  'pendingLegalize' | 'pendingApprove' | 'filter' },
    BookingListScreen: { type: 'flown' | 'approver' | 'others', dataFilter?: { dateStart: string, dateEnd: string, state: number, flow: string } },
    ReviewScreen: { loc?: string, products?: string, booking?: Booking, typeScreen?: string },
    Chat: undefined,
    MoreScreen: { items: Menu[] },
    ChangeLanguageScreen: undefined,
    MyServicesScreen: { dataFilter?: { dateStart: string, dateEnd: string, state: number, flow: string } },
    RequestServices: { traveler?: TravelerCorporate, approver?: ApproverListRS, costCenter?: GetCostCenterRS, index?: number },
    SlidesScreen: undefined,
    FlightSearchScreen: { location?: GeoLocation, typeSearch?: string, index?: number },
    FilterRequestsScreen: { alreadyFiltered?: boolean, beforeFiltered?: { dateStart: string, dateEnd: string, state: number, flow: string } }
    FlightAvailabilityScreen: { searchParams: { adults: number, childrens: number, babys: number, times: string, dates: string, departures: string, arrivals: string, baggage: string, cabine: { name: string, value: string }, direct: boolean}, type: 'price' | 'single' }
    
    


}

const Stack = createStackNavigator<RootStackParams>();

export const Navigator = () => {
    const { t } = useTranslation();
    const { status } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const [screenState, setScreenState] = useState<any>();

    return (
        <>
        <NavigationContainer
            ref={ navigationRef }
            theme={ theme }
            onStateChange={ async ( state ) => {
                setScreenState( state );
            } }
        >
            <Stack.Navigator
                screenOptions={ ({navigation }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center',
                    headerTintColor: theme.colors.text,
                    headerStyle: { backgroundColor: 'white', elevation: 0,  },
                    headerRight: () => (
                        <ProfileNavigation navigation={ navigation } />
                    )
                    
                })}
            > 
                {
                    status !== 'authenticated'
                    ? (
                        <>
                            <Stack.Screen options={{headerShown: false}} name="SplashScreen" component={ SplashScreen } />
                            <Stack.Screen options={{headerShown: false}} name="LoginScreen" component={ LoginScreen } />
                            <Stack.Screen name="SlidesScreen" component={ SlidesScreen } />
                        </>
                    )
                    : (
                        <>
                            <Stack.Screen name="HomeScreen" component={ HomeScreen } />
                            <Stack.Screen name="BottomMenu" component={ BottomMenu } />
                            <Stack.Screen name="HomeViaticsScreen" component={ HomeViaticsScreen } />
                            <Stack.Screen name="HomeHelpScreen" component={ HomeHelpScreen } />
                            <Stack.Screen name="HomeToolsScreen" component={ HomeToolsScreen } />
                            <Stack.Screen name="CheckinScreen" component={ CheckinScreen } />
                            <Stack.Screen name="RegisterExpensesScreen" component={ RegisterExpensesScreen } />
                            <Stack.Screen name="ProfileScreen" component={ ProfileScreen } />
                            <Stack.Screen name="ActivitiesListScreen" component={ ActivitiesListScreen } />
                            <Stack.Screen name="FilterActivitiesScreen" component={ FilterActivitiesScreen } />
                            <Stack.Screen name="AutoCompleteSearch" component={ AutoCompleteSearch } />
                            <Stack.Screen name="RegisterActivityScreen" component={ RegisterActivityScreen } />
                            <Stack.Screen name="ExpensesScreen" component={ ExpensesScreen } />
                            <Stack.Screen name="BookingListScreen" component={ BookingListScreen } />
                            <Stack.Screen name="Chat" component={ Chat } />
                            <Stack.Screen name="MoreScreen" component={ MoreScreen } />
                            <Stack.Screen name="ChangeLanguageScreen" component={ ChangeLanguageScreen } />
                            <Stack.Screen name="MyServicesScreen" component={ MyServicesScreen } />
                            <Stack.Screen 
                                name="ReviewScreen" 
                                component={ ReviewScreen }
                                options={{ 
                                    headerShown: true,
                                    headerTitle: '',
                                    headerBackTitleVisible: false,
                                    headerTransparent: true,
                                    headerTintColor: '#fff'

                                }} 
                            />
                            <Stack.Screen name="RequestServices" component={ RequestServices } />
                            <Stack.Screen name="FlightSearchScreen" component={ FlightSearchScreen } />
                            <Stack.Screen name="FilterRequestsScreen" component={ FilterRequestsScreen } />
                            <Stack.Screen name="FlightAvailabilityScreen" component={ FlightAvailabilityScreen } />
                        </>
                    )
                }                
            </Stack.Navigator>
        </NavigationContainer>
        { 
            status === 'authenticated'
            ? (
                <BottomMenu stateScreen={ screenState } />
            )
            : null
        }
        </>
    );
}