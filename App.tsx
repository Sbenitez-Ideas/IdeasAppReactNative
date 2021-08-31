import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { Navigator } from './src/navigator/Navigator';
import { ThemeProvider } from './src/contexts/theme/ThemeContext';
import { AuthContext, AuthProvider } from './src/contexts/auth/AuthContext';
import { ConfigProvider } from './src/contexts/config/ConfigContext';
import Toast from 'react-native-toast-message';
import FlashMessage from 'react-native-flash-message';
import { FlightsProvider } from './src/contexts/flights/FlightsContext';

const App = () => {

	const { status } = useContext( AuthContext );

	return (
		<>
			<AppFlightState>
				<AppConfigState>
					<AppAuthState>
						<AppThemeState>
							<Navigator />
						</AppThemeState>
					</AppAuthState>
				</AppConfigState>	
			</AppFlightState>	
			<Toast ref={( ref ) => Toast.setRef( ref ) } />
			<FlashMessage position="top" />
		</>
  	)
}


const AppThemeState = ({ children }: any ) => {
	return (
		<ThemeProvider>
			{ children }
		</ThemeProvider>
	)
}

const AppAuthState = ({ children }: any ) => {
	return (
		<AuthProvider>
			{ children }
		</AuthProvider>
	)
}

const AppFlightState = ({ children }: any)  => {
	return (
		<FlightsProvider>
			{ children }
		</FlightsProvider>
	)
}

const AppConfigState = ({ children }: any ) => {
	return(
		<ConfigProvider>
			{ children }
		</ConfigProvider>
	)
}


export default App;