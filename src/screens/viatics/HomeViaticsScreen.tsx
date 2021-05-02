import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react'
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-animatable';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { getHomeViaticsMenu } from '../../helpers/viatics/getHomeViaticsMenu';
import { commonStyles } from '../../styles/commonStyles';
import { MenuInfo } from '../../interfaces/common/MenuInfo';
import { AuthContext } from '../../contexts/auth/AuthContext';
import Toast from 'react-native-toast-message';

interface Props extends StackScreenProps<any, any>{};

export const HomeViaticsScreen = ({ navigation }: Props ) => {
    const { t } = useTranslation();
    const { height } = Dimensions.get('window');
    const { userData: { ApproverExpenses } } = useContext( AuthContext );
    const { theme: { colors, buttonText } } = useContext( ThemeContext );
    

    const calculateApprover = ( item: MenuInfo ) => {
        let action: any;
        if ( item.haveParameter ) {
            if ( item?.parameters?.type ===  'pendingApprove') {
                if ( ApproverExpenses ) {
                    action = navigation.navigate( item.route, {...item.parameters} )
                } else {
                    action = Toast.show({
                        text2: t( 'resNoTienePermisosAprobador' ),
                        type: 'info',
                        visibilityTime: 2000,
                        props: { height: 100 }
                        
                    });
                }
            } else {
                action = navigation.navigate( item.route, {...item.parameters} )
            }
        } else {
            action = navigation.navigate( item.route )
        }

        return action;

    }

    return (
        <>
            <View style={ commonStyles.container }>
                <Text style={{ 
                    ...commonStyles.title,
                    color: colors.primary
                }}>
                   { t('resViaticosTitulo') } 
                </Text>
                <FlatList
                    style={{ marginTop: 20 }}
                    data={ getHomeViaticsMenu()  }
                    keyExtractor={ (menu)  => menu.label}
                    numColumns={2}
                    renderItem={ ({ item }) => (
                        <TouchableOpacity
                            style={{ 
                                height: height * 0.2,
                                ...commonStyles.goutContainer, 
                                backgroundColor: colors.primary,
                            }}
                            onPress={ () =>  calculateApprover( item ) }
                        >
                            
                            <FontAwesomeIcon style={{
                                ...commonStyles.iconsMenu, 
                                color: buttonText }} 
                                icon={ item.icon }
                                size={ 50 }
                            />

                            <Text style={{ 
                                ...commonStyles.textMenu,
                                color: buttonText
                            }}>{ item.label }</Text>
                        </TouchableOpacity>) }
                />

            </View>
            
        </>

        
    )
}
