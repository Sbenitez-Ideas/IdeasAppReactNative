import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { commonStyles } from '../../styles/commonStyles';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ExpenseActivitiesRQ } from '../../classes/viatics/ExpenseActivitiesRQ';
import { useActivities } from '../../hooks/viatics/useActivities';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { FlatList, } from 'react-native-gesture-handler';
import { GActivities } from '../../interfaces/viatics/GActivities';
import Icon from 'react-native-vector-icons/Ionicons'
import Moment from 'moment';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import { ExpensesScreen } from './ExpensesScreen';
import { ActivityIndicator } from 'react-native';
import { activitiesStyles } from '../../styles/activitiesStyles';
import { GExpenses } from '../../interfaces/viatics/GExpenses';
import { MenuActivity } from '../../components/viatics/MenuActivity';
import { MenuExpense } from '../../components/viatics/MenuExpense';
import Toast from 'react-native-toast-message';
import NumberFormat from 'react-number-format';
import { ChangeState } from '../../components/viatics/ChangeState';
import { useTranslation } from 'react-i18next';


interface Props extends StackScreenProps<RootStackParams, 'ActivitiesListScreen'>{};

export const ActivitiesListScreen = ( { route, navigation }: Props ) => {
    const { t } = useTranslation();
    const { userData } = useContext( AuthContext );
    const request: ExpenseActivitiesRQ = {
        IDUser: userData.IDUser,
        IDEntity: userData.IDEntityDefault,
        excludeImages: true
    };
    const { type, dataFilter } = route.params;
    const { loading, activitiesList, getActivities } = useActivities(  type, request, dataFilter );
    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const [status, setStatus] = useState('');
    const [selectedExpense, setSelectedExpense] = useState<GExpenses[]>([]);
    const [cleanSelectedExpenses, setCleanSelectedExpenses] = useState(false);
    const [showChangeState, setShowChangeState] = useState(false);
    const [expenseActivitie, setExpenseActivitie] = useState({
        showExpense: false,
        currentIndex: -1
    });


    const [menus, setMenus] = useState({
        menuExpense: false,
        menuActivity: false,
        currentActivityData: new GActivities(),
        currentExpenseData: new GExpenses()
    });

    useEffect(() => {
        getActivities();
        if ( type === 'filter' ) {
            Toast.show({
                text1: t( 'resFiltrosAplicados' ),
                type: 'success',
                visibilityTime: 2000,
            });
        }
    }, [expenseActivitie, dataFilter])

    const [currentExpense, setCurrentExpense] = useState({
        data: new GExpenses()
    });
    
    useEffect(() => {
        switch( type ) {
            case 'allActivities':
                navigation.setOptions({
                    title: t( 'resActividadesGenerales' )
                });
                break;
            case 'pendingApprove':
                navigation.setOptions({
                    title: t( 'resPendientesAprobar' )
                });
                break;
            case 'pendingLegalize':
                navigation.setOptions({
                    title: t( 'resPendienteLegalizar' )
                });
                break;
            default:
                navigation.setOptions({
                    title:  t( 'resActividades' )
                });
                break;
        }
    }, []);

    
    const showExpenses = (index: number) => {

        setExpenseActivitie({
            ...expenseActivitie,
            showExpense: !expenseActivitie.showExpense,
            currentIndex: index
        })
    }



    const selectedExpenses = ( data: any ) => {
        setSelectedExpense( data );
    }

    const handleCallBack = (childData: GExpenses) => {
        setCurrentExpense({
            ...currentExpense,
            data: childData,
        })
        setMenus({
            ...menus,
            menuExpense: !menus.menuExpense,
            menuActivity: (menus.menuActivity) && false
            
        })
    }

    const hideExpenseMenu = ( show: boolean ) => {
        setMenus({
            ...menus,
            menuExpense: show,
        })
    }

    const hideActivityMenu = ( show: boolean ) => {

        setExpenseActivitie({
            ...expenseActivitie,
            showExpense: !expenseActivitie.showExpense
        })
        setMenus({
            ...menus,
            menuActivity: show,
        })
    }
    
    const sentEmailNotify = ( sent: boolean ) => {
        if (sent) {
            Toast.show({
                text1: t( 'resEnviado' ),
                text2: t( 'resCorreoEnviado' ),
                type: 'success',
                visibilityTime: 2000,
            });
        }
        else {
            Toast.show({
                text1: 'Error',
                text2: t( 'resCorreoNoEnviado' ),
                type: 'error',
                visibilityTime: 2000,
            });
        }
    }


    const isSendLegalized = ( legalized:  boolean ) => {
        if (legalized) {
            Toast.show({
                text1: t( 'resEnviado' ),
                text2: t( 'resGastosLegalizados ' ),
                type: 'success',
                visibilityTime: 2000,
            });
        }
        else {
            Toast.show({
                text1: 'Error',
                text2: t( 'resGastosNoLegalizados' ),
                type: 'error',
                visibilityTime: 2000,
            });
        }

        setExpenseActivitie({
            ...expenseActivitie,
            showExpense: !expenseActivitie.showExpense
        })
        setCleanSelectedExpenses( true );

    }

    const expenseDeleted = ( deleted: boolean ) => {
        if ( deleted ) {
            Toast.show({
                text1: t( 'resEliminado' ),
                text2: t( 'resGastoEliminado' ),
                type: 'success',
                visibilityTime: 2000,
            });
        }
        else {
            Toast.show({
                text1: 'Error',
                text2: t( 'resGastoNoEliminado' ),
                type: 'error',
                visibilityTime: 2000,
            });
        } 

        setMenus({
            ...menus,
            menuExpense: !menus.menuExpense
        })

        setExpenseActivitie({
            ...expenseActivitie,
            showExpense: !expenseActivitie.showExpense,
        })
    }

    const sendLegalize = ( status: string ) => {
        setStatus( status );
        if ( selectedExpense.length > 0 ) {
            let cleanSelected = selectedExpense.filter(row => {
                switch (status) {
                    case 'R':
                        return row.State === 'P' || row.State === 'J';
                    case 'A':
                    case 'J':
                        return row.State === 'R' || row.State === 'X';
                    case 'X':
                        return row.State === 'R';
                }
            })
            setSelectedExpense( cleanSelected );

            if ( cleanSelected.length > 0 ) {
                setShowChangeState( !showChangeState );
            } else {
                Toast.show({
                    text1: 'Error',
                    text2: t( 'resNoGastosCriterio' ),
                    type: 'error',
                    visibilityTime: 2000,
                });
            }
        } else {
            Toast.show({
                text1: 'Error',
                text2: t( 'resNoGastoSeleccionado' ),
                type: 'error',
                visibilityTime: 2000,
            });
        }
    }

    const canAddExpenses = ( data: GActivities ) => {
        let allowInsertExpense: boolean = false;
        if ( type === 'allActivities') {
            if ((data.State !== 'F') && (data.State !== 'A') && (data.State !== 'X') && (data.TypeOwner === 'S' || data.TypeOwner === 'A')) {
                allowInsertExpense = false;
            } else {
                allowInsertExpense = true;
            }
        }
        else {
            allowInsertExpense = true;
        }

        return allowInsertExpense;
    }

    const handleChangeState = () => {
        setShowChangeState( !showChangeState );
    }


    const calculateFiltered = ( ) => {
        let alreadyCalculated = false;
        if ( dataFilter !== undefined ) {
            if ( dataFilter.dateStart !== '' || dataFilter.state !== '') {
                alreadyCalculated = true;
            }
        }

        return alreadyCalculated;
    }

    const renderActivitieCard = ( activitie: GActivities, index: number ) => {
        const bottomPadding: number = ( activitiesList.ListActivities.length  === ( index + 1 )  &&  ( menus.menuActivity || menus.menuExpense ) ) ? 80 : 0;        
        return (
            <> 
                <View style={{ paddingBottom: bottomPadding }}>           
                    <View style={{ ...activitiesStyles.datesContainer, backgroundColor: colors.primary,}}>
                        <Text style={{ color: buttonText, fontSize: 12, marginLeft: 4 }}>
                            { Moment(activitie.DateSta).format('DD/MMMM/YYYY') }
                        </Text>
                        <Icon
                            name="repeat"
                            color={ buttonText }
                            size={ 30 }

                        />
                        <Text style={{ color: buttonText, fontSize: 12 }}>
                            { Moment(activitie.DateEnd).format('DD/MMMM/YYYY') }
                        </Text>
                        <View style={{  ...activitiesStyles.activityState, backgroundColor: setStateColor(activitie.State) }}>
                            <Text style={{ textAlign: 'center', color: buttonText }}>{ t(setStateActivity(activitie.State))  }</Text>
                        </View>
                    </View>  
                    <View style={{ borderWidth: 2, marginBottom: 10, borderColor: colors.primary, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                        <View style={{ marginTop: 10, marginBottom: 5 }}>
                            <View style={{  ...activitiesStyles.dataContainer, }}>
                                <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t('resPasajero') }:  </Text>
                                <Text style={{color: colors.text}}>{ activitie.UserName }</Text>
                            </View>
                            <View style={{ ...activitiesStyles.dataContainer }}>
                                <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resActividad' ) }:  </Text>
                                <Text style={{color: colors.text}}>{ activitie.Description }</Text>
                            </View>
                            <View style={{ ...activitiesStyles.dataContainer }}>
                                <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resGastosRegistrados' ) }:  </Text>
                                <Text style={{color: colors.text}}>{ activitie.countExpenses }</Text>
                            </View>
                            <View style={{ ...activitiesStyles.dataContainer }}>
                                <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resRegistrado' ) }:  </Text>

                                <NumberFormat value={ activitie.totalExpense } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                    renderText={
                                        value => <Text>{ value } { t( 'resDe' ) } </Text>
                                    } 
                                /> 
                                <NumberFormat value={ activitie.Budget } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                    renderText={
                                        value => <Text>{ value }</Text>
                                    } 
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    
                                    onPress={ () => showExpenses(index) }
                                    style={{
                                        ...commonStyles.entireButton,
                                        
                                    }}>
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={ commonStyles.smallButton }
                                    >
                                        <Text style={[commonStyles.buttonText, {
                                            color: buttonText
                                        }]}>{ t( 'resVerGastos' ) }</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                { type !== 'pendingApprove' &&
                                    <>
                                        <TouchableOpacity
                                            disabled={ canAddExpenses( activitie ) }
                                            onPress={ () => navigation.navigate('RegisterExpensesScreen', {
                                                activity: activitie
                                            }) }
                                            style={{
                                                ...commonStyles.entireButton,
                                                
                                            }}>
                                            <LinearGradient
                                                colors={[colors.primary, secondary]}
                                                style={ commonStyles.smallButton }
                                            >
                                                <Text style={[commonStyles.buttonText, {
                                                    color: buttonText
                                                }]}> { t( 'resAdicionarGasto' ) } </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={ () => setMenus({
                                                ...menus,
                                                menuActivity: !menus.menuActivity,
                                                menuExpense: (menus.menuExpense) && false,
                                                currentActivityData: activitie
                                            })}
                                            style={{
                                                ...commonStyles.entireButton,
                                                
                                            }}>
                                            <LinearGradient
                                                colors={[colors.primary, secondary]}
                                                style={ commonStyles.smallButton }
                                            >
                                                <Text style={[commonStyles.buttonText, {
                                                    color: buttonText
                                                }]}> + { t( 'resOpciones' ) } </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                }
                                { type === 'pendingApprove' &&
                                    <>
                                        <TouchableOpacity
                                            onPress={ () => {
                                                setMenus({
                                                    ...menus,
                                                    currentActivityData: activitie
                                                })
                                                sendLegalize( 'A' )
                                            }}
                                            style={{
                                                ...commonStyles.entireButton,
                                                
                                            }}>
                                            <LinearGradient
                                                colors={[colors.primary, secondary]}
                                                style={ commonStyles.smallButton }
                                            >
                                                <Text style={[commonStyles.buttonText, {
                                                    color: buttonText
                                                }]}> { t( 'resAprobar' ) } </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={ () => {
                                                setMenus({
                                                    ...menus,
                                                    currentActivityData: activitie
                                                })
                                                sendLegalize( 'J' )
                                            }}
                                            style={{
                                                ...commonStyles.entireButton,
                                                
                                            }}>
                                            <LinearGradient
                                                colors={[colors.primary, secondary]}
                                                style={ commonStyles.smallButton }
                                            >
                                                <Text style={[commonStyles.buttonText, {
                                                    color: buttonText
                                                }]}> { t( 'resRechazar' ) } </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </>
                                }
                            </View>
                            { (expenseActivitie.showExpense === true && expenseActivitie.currentIndex === index ) &&
                                <ExpensesScreen  cleanSelected={ cleanSelectedExpenses }    currentActivity={ activitie } menus={ menus } parentCallBack= { handleCallBack }  selectedExpenses={ selectedExpenses }  />
                            }
                        </View>
                    </View>
                   
                </View>
            </>
        )
    }
    

    return (
        <>
                <View style={{ 
                    ...commonStyles.container,
                    alignItems: 'stretch',
                    bottom: 50,
                }}>
                    <Text style={{ 
                        ...commonStyles.title,
                        color: colors.primary,
                        marginBottom: 10
                    }}>
                        { t( 'resActividadesGastos' ) }
                    </Text>
                    <ChangeState  show={ showChangeState } isSendLegalized={ isSendLegalized  }  idApprover={ menus.currentActivityData.IDApproverUser }  status={ status }  expensesSelected={ selectedExpense }  showHandle={ handleChangeState } />
                    <View style={ commonStyles.rightButtonContainer }>
                        <TouchableOpacity
                            disabled={( activitiesList.ListActivities.length > 0) ? false : true }
                            onPress={ () => navigation.navigate('FilterActivitiesScreen',{
                                activities: activitiesList.ListActivities,
                                alreadyFiltered: calculateFiltered(),
                                beforeFiltered: dataFilter
                            } )}
                            style={commonStyles.rightButton}>
                            <LinearGradient
                                colors={[colors.primary, secondary]}
                                style={{ 
                                    ...commonStyles.rightButton,
                                    flexDirection: 'row'
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{ 
                                        color: buttonText
                                    }}
                                    icon={ faFilter }
                                    size={20} />
                                <Text style={[commonStyles.buttonText, {
                                    color:'#fff'
                                }]}>{ t( 'resFiltrar' ) }</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {
                        !loading &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator
                                size="large"
                                animating={ true }
                                color={ colors.primary }
                            ></ActivityIndicator>
                        </View> 
                       
                    }
                    { 
                        ( loading && activitiesList.ListActivities.length > 0 ) 
                        &&
                            <View style={{ marginTop: 10, flex: 1, width: '100%' }}>
                                <FlatList 
                                    data={ activitiesList.ListActivities }
                                    keyExtractor={ (activie: GActivities) => activie.IDGroup }
                                    renderItem={ ({ item, index }) => renderActivitieCard( item, index ) }
                                />
                            </View>
                    }
                    {
                        ( loading && activitiesList.ListActivities.length === 0 ) 
                        &&
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <FontAwesomeIcon
                                    icon={ faExclamationCircle }
                                    color={ colors.primary }
                                    size={ 100 }
                                />
                                <Text style={{ 
                                    ...commonStyles.title,
                                    fontSize: 25,
                                    color: colors.primary,
                                    marginBottom: 10
                                }}>
                                    { t( 'resNoEncontraronActividades' ) }
                                </Text>
                            </View>
                    }                    
                </View>
                { menus.menuActivity &&
                    <MenuActivity expenses={ selectedExpense }  activitie={ menus.currentActivityData } isSentEmail={ sentEmailNotify } isSendLegalized={ isSendLegalized  }  hideMenu={ hideActivityMenu } />
                }
                {
                    menus.menuExpense &&
                    <MenuExpense expense={ currentExpense.data } isDeleted={ expenseDeleted }  hideMenu={ hideExpenseMenu } />
                }

        </>

    )
}