import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { Navigator } from './src/navigator/Navigator';
import { ThemeProvider } from './src/contexts/theme/ThemeContext';
import { AuthContext, AuthProvider } from './src/contexts/auth/AuthContext';
import { ConfigProvider } from './src/contexts/config/ConfigContext';
import Toast from 'react-native-toast-message';
import FlashMessage from 'react-native-flash-message';

const App = () => {

	const { status } = useContext( AuthContext );

	return (
		<>
				<AppConfigState>
					<AppAuthState>
						<AppThemeState>
							<Navigator />
						</AppThemeState>
					</AppAuthState>
				</AppConfigState>		
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

const AppConfigState = ({ children }: any ) => {
	return(
		<ConfigProvider>
			{ children }
		</ConfigProvider>
	)
}


export default App;