import React from 'react';
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
import { GActivities } from '../interfaces/viatics/GActivities';
import { ExpenseCategories } from '../classes/viatics/ExpenseCategories';
import { CurrencyTypes } from '../classes/viatics/CurrencyTypes';
import { Establishment } from '../classes/viatics/Establishment';
import { RegisterActivityScreen } from '../screens/viatics/RegisterActivityScreen';
import { GExpenses } from '../interfaces/viatics/GExpenses';
import { HomeHelpScreen } from '../screens/common/HomeHelpScreen';
import { HomeToolsScreen } from '../screens/common/HomeToolsScreen';
import { CheckinScreen } from '../screens/common/CheckinScreen';
import { useTranslation } from 'react-i18next';


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
    AutoCompleteSearch: { type: 'Activities' | 'Category' | 'CurrencyType' | 'Establishment', screen: 'RegisterExpensesScreen' | 'RegisterActivityScreen' },
    RegisterActivityScreen: { currencyType?: CurrencyTypes, activity?: GActivities, type?: string},
    HomeHelpScreen: undefined,
    HomeToolsScreen: undefined,
    CheckinScreen: undefined
    
    


}

const Stack = createStackNavigator<RootStackParams>();

interface Props extends StackScreenProps<any, any>{};


export const Navigator = ({ navigation }: any ) => {
    const { t } = useTranslation();
    const { status } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

    return (
        <>
        <NavigationContainer
            ref={ navigationRef }
            theme={ theme }
        >
            <Stack.Navigator
                screenOptions={ ({navigation }) => ({
                    headerTitleAlign: 'center',
                    headerTintColor: theme.buttonText,
                    headerStyle: { backgroundColor: theme.colors.primary, elevation: 0,  },
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
                        </>
                    )
                    : (
                        <>
                            <Stack.Screen options={{title: 'Home'}} name="HomeScreen" component={ HomeScreen } />
                            <Stack.Screen name="BottomMenu" component={ BottomMenu } />
                            <Stack.Screen options={{title: t('resViaticos')}}  name="HomeViaticsScreen" component={ HomeViaticsScreen } />
                            <Stack.Screen options={{title: t( 'resAyudaLinea' )}}  name="HomeHelpScreen" component={ HomeHelpScreen } />
                            <Stack.Screen options={{title: t( 'resHerramientas' )}}  name="HomeToolsScreen" component={ HomeToolsScreen } />
                            <Stack.Screen options={{title: 'Check-In'}}  name="CheckinScreen" component={ CheckinScreen } />
                            <Stack.Screen options={{title: t( 'resRegistroGastos' )}}  name="RegisterExpensesScreen" component={ RegisterExpensesScreen } />
                            <Stack.Screen options={{title: t('resPerfil') }} name="ProfileScreen" component={ ProfileScreen } />
                            <Stack.Screen options={{title: t( 'resActividades' ) }} name="ActivitiesListScreen" component={ ActivitiesListScreen } />
                            <Stack.Screen options={{title: t( 'resFiltrarActividades' ) }} name="FilterActivitiesScreen" component={ FilterActivitiesScreen } />
                            <Stack.Screen options={{title: t( 'resBusqueda' ) }} name="AutoCompleteSearch" component={ AutoCompleteSearch } />
                            <Stack.Screen options={{title: t( 'resActividadesManuales' ) }} name="RegisterActivityScreen" component={ RegisterActivityScreen } />
                        </>
                    )
                }                
            </Stack.Navigator>
        </NavigationContainer>
        { 
            status === 'authenticated'
            ? (
                <BottomMenu />
            )
            : null
        }
        </>
    );
}