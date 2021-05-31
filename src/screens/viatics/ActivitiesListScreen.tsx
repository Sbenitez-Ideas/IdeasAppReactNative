import React, { useContext, useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View, Dimensions, RefreshControl } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { commonStyles } from '../../styles/commonStyles';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendarAlt, faFilter, faMoneyCheckAlt, faSortAmountUpAlt } from '@fortawesome/free-solid-svg-icons';
import { ExpenseActivitiesRQ } from '../../model/classes/viatics/ExpenseActivitiesRQ';
import { useActivities } from '../../hooks/viatics/useActivities';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { GActivities } from '../../model/interfaces/viatics/GActivities';
import Icon from 'react-native-vector-icons/Ionicons'
import Moment from 'moment';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import { ActivityIndicator } from 'react-native';
import { activitiesStyles } from '../../styles/activitiesStyles';
import { GExpenses } from '../../model/interfaces/viatics/GExpenses';
import Toast from 'react-native-toast-message';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { DynamicText } from '../../components/common/DynamicText';
import { FloatMenuActivity } from '../../components/viatics/FloatMenuActivity';


interface Props extends StackScreenProps<RootStackParams, 'ActivitiesListScreen'>{};


export const ActivitiesListScreen = ( { route, navigation }: Props ) => {
    const { theme: { colors, secondary, buttonText, grayColor, fieldColor, } } = useContext( ThemeContext );
    const { t } = useTranslation();
    const { userData } = useContext( AuthContext );
    const request: ExpenseActivitiesRQ = {
        IDUser: userData.IDUser,
        IDEntity: userData.IDEntityDefault,
        excludeImages: true
    };
    const scrollAnim = new Animated.Value(0);
    const { type, dataFilter } = route.params;
    const { loading, activitiesList, getActivities } = useActivities(  type, request, dataFilter );
    const [status, setStatus] = useState('');
    const [selectedExpense, setSelectedExpense] = useState<GExpenses[]>([]);
    const [cleanSelectedExpenses, setCleanSelectedExpenses] = useState(false);
    const [showChangeState, setShowChangeState] = useState(false);
    const [expenseActivitie, setExpenseActivitie] = useState({
        showExpense: false,
        currentIndex: -1
    });
    const [refreshing, setRefreshing] = useState(false);
    const { width } = Dimensions.get('window');
    const [menus, setMenus] = useState({
        menuExpense: false,
        menuActivity: false,
        currentActivityData: new GActivities(),
        currentExpenseData: new GExpenses()
    });
    const [title, setTitle] = useState('');
    const [currentExpense, setCurrentExpense] = useState({
        data: new GExpenses()
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
    
    useEffect(() => {
        switch( type ) {
            case 'allActivities':
                setTitle( t( 'resActividadesGenerales' ) )
                break;
            case 'pendingApprove':
                setTitle( t( 'resPendientesAprobar' ) )
                break;
            case 'pendingLegalize':
               setTitle( t( 'resPendienteLegalizar' ) )
                break;
            default:
                setTitle( t( 'resActividades' ) )
                break;
        }
    }, []);

    /**
     * Cambia el estado del menu de gastos para mostrar o no el mismo.
     *
     * @param {number} index Identificador de la actividad seleccionada.
     */
    const showExpenses = (activitie: GActivities) => {
        navigation.navigate( 'ExpensesScreen',  {
            currentActivity: activitie,
            type: type
        } )  

       /*  setExpenseActivitie({
            ...expenseActivitie,
            showExpense: !expenseActivitie.showExpense,
            currentIndex: index
        }) */
    }

    const statusType = [
        {label:  t( 'resEnviadoLegalizar' ) , value: 'R'},
        {label: t( 'resPendienteLegalizar' ), value: 'P'},
        {label: t( 'resCerrado' ), value: 'F'},
        {label: t( 'resPreAprobador' ), value: 'X'},
        {label: t( 'resJustificar' ), value: 'F'},
        {label: t( 'resAprobado' ), value: 'A'}
    ];

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

        setMenus({  
            ...menus,
            menuActivity: false
        })
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
            <View style={{ paddingBottom: bottomPadding }}> 
            
                <View
                    style={[styles.listContent, {backgroundColor: colors.background, width: width * .97, marginBottom: 10 }]}>
                    <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{  ...activitiesStyles.activityState, backgroundColor: setStateColor(activitie.State) }}>
                            <DynamicText numberOfLines={ 1 } style={{ fontSize: 10,  textAlign: 'center', color: buttonText }}>{ t(setStateActivity(activitie.State))  }</DynamicText>
                        </View>
                        { type !== 'pendingApprove' &&
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
                                    <DynamicText style={[commonStyles.buttonText, {
                                        color: buttonText
                                    }]}> + { t( 'resOpciones' ) } </DynamicText>
                                </LinearGradient>
                            </TouchableOpacity>
                        }
                    </View>
                    <DynamicText headline semibold numberOfLines={1} style={{marginVertical: 5}}>
                        { activitie.Description }
                    </DynamicText>
                    <View style={styles.listLineMap}>
                    <DynamicText caption1 greyColor>
                        { activitie.UserName }
                    </DynamicText>
                    </View>
                    <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                    }}>
                        <FontAwesomeIcon
                            icon={ faCalendarAlt }
                            color={ grayColor }
                            size={ 16 }
                        />
                    <DynamicText 
                        caption1 greyColor
                        style={{
                            marginLeft: 5,
                        }}
                    >
                        { Moment(activitie.DateSta).format('DD/MMMM/YYYY') }
                    </DynamicText>
                    <Icon
                        style={{ marginLeft: 5 }}
                        name="repeat"
                        color={ grayColor }
                        size={ 15 }
                    />
                        <DynamicText caption1 greyColor
                    style={{
                        marginLeft: 5,
                        }}>
                            { Moment(activitie.DateEnd).format('DD/MMMM/YYYY') }
                        </DynamicText>
                    </View>
                    <View style={styles.listRow}>
                    <View style={{alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity
                            onPress={ () => showExpenses( activitie ) }
                            style={{
                                ...commonStyles.entireButton,
                                marginLeft: 10
                            }}>
                            <LinearGradient
                                colors={[colors.primary, secondary]}
                                style={{ ...commonStyles.smallButton, paddingLeft: 2, paddingRight: 2  }}
                            >
                                <DynamicText style={[commonStyles.buttonText, {
                                    color: buttonText
                                }]}>{ t( 'resVerGastos' ) }</DynamicText>
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
                                        marginLeft: 10
                                        
                                    }}>
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={ commonStyles.smallButton }
                                    >
                                        <DynamicText style={[commonStyles.buttonText, {
                                            color: buttonText
                                        }]}> { t( 'resAdicionarGasto' ) } </DynamicText>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        }
                            
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                        }}>

                            <FontAwesomeIcon 
                                icon={ faMoneyCheckAlt }
                                color={ grayColor }
                                style={{ marginRight: 5 }}
                                size={ 15 }
                            />

                            <NumberFormat value={ activitie.totalExpense } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                    renderText={
                                        value => <DynamicText caption1 greyColor>{ value } { t( 'resDe' ) } </DynamicText>
                                    } 
                                /> 
                                <NumberFormat value={ activitie.Budget } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                    renderText={
                                        value => <DynamicText caption1 greyColor>{ value }</DynamicText>
                                    } 
                                />
                        </View>
                    </View>
                    </View>
                </View>
            </View>
        )
    }
    

    return (
        <>
            <Header 
                title={ title }
                onPressLeft={ () => {
                    navigation.goBack()
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faArrowLeft }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }

                renderRight={ () => {
                    return (
                        <ProfileNavigation navigation={ navigation } />
                    )
                } }
            />
            
            <View style={[styles.contain]}>
                <TouchableOpacity>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{ ...styles.line, backgroundColor: grayColor}} />
                    <TouchableOpacity style={styles.contentFilter}
                        disabled={( activitiesList.ListActivities.length > 0) ? false : true }
                        onPress={ () => navigation.navigate('FilterActivitiesScreen',{
                            activities: activitiesList.ListActivities,
                            alreadyFiltered: calculateFiltered(),
                            beforeFiltered: dataFilter
                        } ) }
                    >
                        <FontAwesomeIcon
                            icon={ faFilter }
                            size={ 16 }
                            color={ grayColor }
                            />
                        <DynamicText headline greyColor style={{marginLeft: 5}}>
                            {t('resFiltrar')}
                        </DynamicText>
                    </TouchableOpacity>
                </View>
            </View>

            {
                !loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fieldColor }}>
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
                <View 
                style={{  alignItems: 'center',
                    backgroundColor: fieldColor,
                    flex: 1,
                    marginBottom: 50
                }}
            >
                <Animated.FlatList 
                    contentContainerStyle={{
                        paddingTop: 10,
                    }}
                    refreshControl={
                        <RefreshControl
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing( !refreshing ); 
                                getActivities().then(( ) => {
                                    setRefreshing( false ); 
                                })
                            }}
                        />
                    }

                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                contentOffset: {
                                    y: scrollAnim,
                                },
                                },
                            },
                        ],
                        {useNativeDriver: true},
                    )}
                
                    showsVerticalScrollIndicator={false}
                    data={activitiesList.ListActivities}
                    keyExtractor={ (activie: GActivities) => activie.IDGroup }
                    renderItem={ ({ item, index }) => (
                        renderActivitieCard(item, index)
                    )}
                />
                </View>
            }
            { menus.menuActivity &&
                <FloatMenuActivity isSentEmail={ sentEmailNotify } navigation={ navigation } activity={ menus.currentActivityData } />
            }
        </>

    )
}


const styles = StyleSheet.create({
    listLineMap: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      listContent: {
        padding: 10,
        borderRadius: 10,
      },
      listRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      contain: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between"
      },
      line: {
        width: 1,
        height: 14,
        marginLeft: 10
      },
      contentModeView: {
        width: 30,
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "center"
      },
      contentFilter: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10
      },
      bottomModal: {
        justifyContent: "flex-end",
        margin: 0
      },
      contentFilterBottom: {
        width: "100%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 20
      },
      contentSwipeDown: {
        paddingTop: 10,
        alignItems: "center"
      },
      lineSwipeDown: {
        width: 30,
        height: 2.5,
      },
      contentActionModalBottom: {
        flexDirection: "row",
        paddingVertical: 15,
        justifyContent: "space-between",
        borderBottomWidth: 1
      }
})