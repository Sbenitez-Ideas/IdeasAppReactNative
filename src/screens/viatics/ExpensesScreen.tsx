import React, { useContext, useEffect, useState } from 'react'
import { Switch, View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { GActivities } from '../../model/interfaces/viatics/GActivities';
import * as Animatable from 'react-native-animatable';
import { viaticsApi } from '../../api/viaticsApi';
import { ExpensesRQ } from '../../model/interfaces/viatics/ExpensesRQ';
import { ExpensesRS } from '../../model/interfaces/viatics/ExpensesRS';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { GExpenses } from '../../model/interfaces/viatics/GExpenses';
import { getTotalExpense } from '../../helpers/viatics/getTotalExpense';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import { Col, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/Ionicons'
import { faEllipsisH, faExclamationCircle, faTimes, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';
import { RootStackParams } from '../../navigator/Navigator';
import { StackScreenProps } from '@react-navigation/stack';
import { Header } from '../../components/common/Header';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from '../../components/common/DynamicText';
import Moment from 'moment';
import { FloatMenuExpenses } from '../../components/viatics/FloatMenuExpenses';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import { commonStyles } from '../../styles/commonStyles';
import { LinkExpenses } from '../../model/classes/viatics/LinkExpenses';
import { DownloadImageRQ } from '../../model/classes/viatics/DownloadImages';
import { convertLink } from '../../helpers/viatics/convertLink';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { CategoriesEntity } from '../../model/classes/viatics/CategoriesEntity';
import { ExpenseCategories } from '../../model/classes/viatics/ExpenseCategories';
import { ChangeState } from '../../components/viatics/ChangeState';

interface Props extends StackScreenProps<RootStackParams, 'ExpensesScreen'> {
    /* currentActivity: GActivities,
    menus: { menuExpense: boolean ,menuActivity: boolean };
    cleanSelected: boolean;
    parentCallBack: (childData: GExpenses) => void;
    selectedExpenses: ( data: any ) => void; */
}

export const ExpensesScreen = ( { route, navigation }: Props ) => {
    const { t } = useTranslation();
    const [menus, setMenus] = useState({
        menuExpense: false,
        currentExpenseData: new GExpenses()
    });
    const [expenses, setExpenses] = useState<ExpensesRS>({
        Expenses: [],
        Total: 0,
        Error:  ''
    });
    const [expensesSelected, setExpensesSelected] = useState<GExpenses[]>([]);
    const [showChangeState, setShowChangeState] = useState(false);
    const { currentActivity, type } = route.params;
    const [completeSelectedExpense, setCompleteSelectedExpense] = useState<GExpenses[]>([]);
    const { userData, } = useContext( AuthContext );
    const [haveExpensesSelected, setHaveExpensesSelected] = useState(false);
    const [images, setImages] = useState<LinkExpenses[]>([])
    const [selectExpense, setSelectExpense] = useState({
        listExpense: Array<any>()
    });
    const [categoriesList, setCategoriesList] = useState<ExpenseCategories[]>( [] );
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const { theme: { colors, secondary, grayColor, buttonText } } = useContext( ThemeContext );
    const { getExpense, downloadImages, getCategories } = viaticsApi();
    const request: ExpensesRQ ={
        IDGroup: currentActivity?.IDGroup
    }
    const [modalButtons, setModalButtons] = useState({
        supportsExpense: false,
    })
    const isDeleted = ( deleted: boolean ) => {

        if ( deleted ) {
            Toast.show({
                text1: t( 'resGastoEliminado' ),
                type: 'success',
                visibilityTime: 2000,
            });
            getExpense( request )
                .then(( response ) =>{
                    setExpenses(response);
                    const expensesList: any[] = [];
                    response.Expenses.forEach(element => {
                        const objectExpense = {
                            expense: element.IDExpense,
                            selected: false
                        }
                        expensesList.push( objectExpense );
                    });
                    setSelectExpense({
                        ...selectExpense,
                        listExpense: expensesList
                    })
                })
        } else {
            Toast.show({
                text1: t( 'resGastoNoEliminado' ),
                type: 'success',
                visibilityTime: 2000,
            });
        } 
    }


    const getSupportImages = ( expense:GExpenses ) => {
        const request = new DownloadImageRQ();
        request.Action = 'get';
        request.Data = [];
        request.ListImages = [];
        request.Description = expense.Description;
        request.Value = getTotalExpense( expense ).toString();
        request.IDExpense = expense.IDExpense;
        downloadImages( request )
            .then(( response ) => {
                if ( response?.Links?.length > 0 )
                setImages( response.Links );
                showSupports();
            })
    }
    
    const isSendLegalized = ( legalized: boolean, status: string ) => {

        switch (status) {
            case 'R':
                if ( legalized ) {
                    Toast.show({
                        text1: t( 'resGuardado' ),
                        text2: t( 'resGastosLegalizados' ),
                        type: 'success',
                        visibilityTime: 2000,
                    });
                } else {
                    Toast.show({
                        text1: 'Error',
                        text2: t( 'resGastosNoLegalizados' ),
                        type: 'error',
                        visibilityTime: 2000,
                    });
                }
                
                break;
        
            default:
                break;
        }

        navigation.navigate( 'ActivitiesListScreen', {
            type: 'allActivities'
        } )
        
    }

     useEffect(() => {
    }, [selectExpense, images ])
    
    const setSwitchValue = (val: boolean, ind: number) => {
        const tempData = selectExpense.listExpense;
        tempData[ind].selected = val;
        setSelectExpense({
            listExpense: tempData
        });
        sendData();
    }

    const showSupports = () => {
        setModalButtons({
            ...modalButtons,
            supportsExpense: !modalButtons.supportsExpense
        })
    }

    const findRequiredAttachments = ( cleanSelected: GExpenses[] ): GExpenses[] => {
        let newSelected: GExpenses[] = [];
        let categoryId = 0;
        cleanSelected.forEach( element => {
            categoryId = element.IDCategory;
            const category = categoriesList.find( category => category.ID === categoryId );

            if ( category?.RequiredDocuments && element.HasAttach ) {
                newSelected.push( element );
            } else if ( !category?.RequiredDocuments || category?.RequiredDocuments && element.HasAttach ) {
                newSelected.push( element );
            } 
        })

        return newSelected;
    }

    const sendLegalize = ( status: string ) => {
        setStatus( status );
        if ( completeSelectedExpense.length > 0 ) {
            let cleanSelected = completeSelectedExpense.filter(row => {
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
            if ( cleanSelected.length > 0 ) {
                cleanSelected = findRequiredAttachments( cleanSelected );
                setCompleteSelectedExpense( cleanSelected );
                if (cleanSelected.length > 0) {
                    setShowChangeState( !showChangeState );
                } else {
                    Toast.show({
                        text1: 'Error',
                        text2: t( 'resAlgunosGastosRequierenAdjuntos' ) ,
                        type: 'error',
                        visibilityTime: 2000,
                    });
                }

            } else {
                Toast.show({
                    text1: 'Error',
                    text2: t( 'resNoGastosCriterio' ) ,
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

    useEffect(() => {
    }, [selectExpense.listExpense])

    const sendData = () => {
        const selecteExpenses: GExpenses[] = [];
        selectExpense.listExpense.map(checked => {
            if ( checked.selected ) {
                expenses.Expenses.map(element => {
                    if ( element.IDExpense === checked.expense ) {
                        selecteExpenses.push( element );
                    } else {
                        const result = completeSelectedExpense.find( a => a.IDExpense === element.IDExpense );
                        if ( result ) {
                            let position = completeSelectedExpense.indexOf(element);
                            completeSelectedExpense.splice(position, 1);
                        }                        
                    }
                });
            }
        });

        setCompleteSelectedExpense( selecteExpenses );
    }

    const handleChangeState = () => {
        setShowChangeState( !showChangeState );
    }


    const getAllCategories = ( ) => {
        const request = new  CategoriesEntity();
        request.IDEntity = userData.IDEntityDefault;
        getCategories( request )
            .then(( response ) => {
                setCategoriesList( response );
            })
    }

    useEffect(() => {
        getExpense(request)
            .then(( response ) => {
                setExpenses(response);
                const expensesList: any[] = [];
                response.Expenses.forEach(element => {
                    const objectExpense = {
                        expense: element.IDExpense,
                        selected: false
                    }
                    expensesList.push( objectExpense );
                });
                setSelectExpense({
                    ...selectExpense,
                    listExpense: expensesList
                })
                setLoading( true );
            })
        getAllCategories();
    }, [])

    const havePedingLegalize = (): boolean => {
        const pending = expenses?.Expenses.filter( expense => expense.State === 'R' );
        if ( pending.length > 0 && expenses?.Expenses.length === pending.length ) {
            return false;
        } else {
            return true;''
        }
    }

    const havePendingApprove = (): boolean => {
        const pending = expenses?.Expenses.filter( expense => expense.State === 'A' || expense.State === 'X' );
        if ( pending.length > 0 && expenses?.Expenses.length === pending.length ) {
            return false;
        } else {
            return true;''
        }
    }

    
    return (
        <>
            <Header 
                title={ t( 'resGastos' ) }
                subTitle={ currentActivity.Description }
                onPressRight={ () => {
                    navigation.goBack()
                } }
                renderRight={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faTimes }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }
            />
            { ( selectExpense.listExpense.some( expense => expense.selected === true ) && type !== 'pendingApprove' ) && ( havePedingLegalize() ) &&
                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', right: 10, marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={ () => sendLegalize( 'R' ) }
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
                            }]}> { t( 'resEnviarLegalizar' ) } </DynamicText>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            }
            { ( selectExpense.listExpense.some( expense => expense.selected === true ) && type === 'pendingApprove' ) && ( havePendingApprove() || havePedingLegalize() ) &&
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', right: 10, marginTop: 10 }}>
                        <TouchableOpacity
                            onPress={ () => sendLegalize( 'A' ) }
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
                                }]}> { t( 'resAprobar' ) } </DynamicText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', right: 10, marginTop: 10 }}>
                        <TouchableOpacity
                            onPress={ () => sendLegalize( 'J' ) }
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
                                }]}> { t( 'resRechazar' ) } </DynamicText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            }   
                        
            {!loading 
                &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator
                            size="large"
                            animating={ true }
                            color={ colors.primary }
                        ></ActivityIndicator>
                    </View>           
            }
        
            {
                ( loading && expenses.Expenses.length > 0 )
                &&
                <Animatable.View
                    animation="fadeIn"
                >
                    <Grid>
                        <Col>
                            <DynamicText style={{
                                ...styles.headerTitle,
                            color: colors.primary}}>{ t('resDescripcion') }</DynamicText>
                        </Col>
                        <Col> 
                            <DynamicText style={{ 
                                ...styles.headerTitle,
                                marginRight: 70,
                                color: colors.primary}}>{ t( 'resValor' ) }</DynamicText>
                        </Col>
                        <Col>
                            <DynamicText style={{
                                ...styles.headerTitle,
                                marginRight: 60, 
                                color: colors.primary,}}>{ t( 'resEstado' ) }</DynamicText>
                        </Col>
                    </Grid>

                    <FlatList
                        data={ expenses?.Expenses }
                        keyExtractor={ (expense: GExpenses ) => expense.IDExpense  }
                        renderItem={ ({ item, index }) => (
                            <View style={{ marginTop: 10 }}>  
                                <View
                                    style={[styles.content, {backgroundColor: colors.card},]}>
                                    <View style={[styles.contentTop, {borderBottomColor: colors.border}]}>
                                        <View style={{flex: 1}}>
                                        <DynamicText title2>{ item.Description }</DynamicText>
                                            <View style={{ 
                                                backgroundColor: setStateColor(item.State),
                                                ...styles.stateContainer
                                                }}>
                                            <DynamicText style={{ ...styles.stateTitle,  color: 'white' }}>{ t( setStateActivity(item.State) ) }</DynamicText>
                                        </View>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <TouchableOpacity
                                            onPress={ () =>  setMenus({
                                                ...menus,                                                
                                                menuExpense: !menus.menuExpense,
                                                currentExpenseData: item
                                            })}
                                        >
                                            <FontAwesomeIcon
                                                style={{ marginLeft: 50 }}
                                                icon={ faEllipsisH }
                                                color={ colors.primary }
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                        <DynamicText footnote light>
                                            {Moment( item.Date ).format('ll')}
                                        </DynamicText>
                                        </View>
                                    </View>
                                    <View style={styles.contentBottom}>
                                        <View style={styles.bottomLeft}>
                                            <Switch
                                                trackColor={{ false: '#ECECEC', true: secondary }}
                                                thumbColor={( selectExpense?.listExpense[index]?.selected ) ? colors.primary : "#ECECEC"}
                                                onValueChange={(value) => {
                                                    setSwitchValue(value, index)
                                                }}
                                                value={ selectExpense.listExpense[index].selected ? true : false }
                                            ></Switch>
                                            {  item.HasAttach &&

                                                    <TouchableOpacity
                                                        onPress={ () => getSupportImages( item ) }
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={ faPaperclip } 
                                                            size={ 16 }
                                                            color={ grayColor }
                                                        />    
                                                    </TouchableOpacity>
                                            }
                                            
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                        
                                        <NumberFormat value={ getTotalExpense(item) } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                                            renderText={
                                                                            value => <DynamicText fontFamily='Raleway-SemiBold' title3 semibold primaryColor>{ value }</DynamicText>
                                                                            } 
                                            />
                                        <DynamicText caption1 light style={{marginLeft: 5}}>
                                            { item.Currency }
                                        </DynamicText>
                                        </View>
                                    </View>
                                </View>
                            </View>
                                                            
                        )}
                    />                             
                </Animatable.View>   
            }
            { loading && expenses.Expenses.length === 0
                &&
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <FontAwesomeIcon
                            icon={ faExclamationCircle }
                            color={ colors.primary }
                            size={ 20 }
                        />
                        <DynamicText style={{
                            left: 10, 
                            fontSize: 15,
                            color: colors.primary,
                            marginBottom: 10,
                            fontWeight: 'bold'
                        }}>
                            { t( 'resNoEncontraronGastos' ) }
                        </DynamicText>
                    </View>

            }
            { menus.menuExpense &&

                <FloatMenuExpenses isDeleted={ isDeleted }  expense={ menus.currentExpenseData } navigation={ navigation } />

            }

            <ChangeState  show={ showChangeState } isSendLegalized={ isSendLegalized  }  idApprover={ currentActivity.IDApproverUser }  status={ status }  expensesSelected={ completeSelectedExpense }  showHandle={ handleChangeState } />

            <Modal
                key={'supports'}
                swipeDirection="right"
                onSwipeComplete={ showSupports }
                /* onModalHide={ () => hideMenu( false ) } */
                style={{ alignItems: 'center'}} isVisible={modalButtons.supportsExpense}>
                    <View style={{ borderRadius: 10, width: 370, height: 420, marginBottom: 40, backgroundColor: colors.background}}>
                        <View style={ commonStyles.rightButtonContainer }>
                            <Icon
                                onPress={showSupports }
                                name="close-circle"
                                color={ colors.primary }
                                size={ 30}
                            />
                        </View>
                        <View style={{ marginLeft: 10, marginBottom: 20 }}>
                            <DynamicText style={{ 
                                ...commonStyles.title,
                                color: colors.primary,
                                marginTop: 0,
                            }}>
                                { t( 'resSoportes' ) }
                            </DynamicText>
                        </View>

                        <View style={{ flexDirection: 'row' }}> 
                            <TouchableOpacity style={{ alignItems: 'center', marginLeft: 10 }}>
                                
                                <Icon 
                                    name="camera"
                                    color={ colors.primary }
                                    size={ 30 }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: 'center' }}>
                                <Icon 
                                    name="image"
                                    color={ colors.primary }
                                    size={ 30 }
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                            <FlatList
                                data={ images }
                                numColumns={ 4 }
                                keyExtractor={ (menu: LinkExpenses) => menu.IDImage }
                                renderItem={ ({ item })  => (
                                    <View style={{ paddingLeft: 10, marginTop: 10, top: 0, bottom: 50 }}>  
                                        <View style={{ ...commonStyles.rightButtonContainer }}>
                                            <Icon
                                                    onPress={ showSupports }
                                                    name="close-outline"
                                                    color={ colors.primary }
                                                    size={ 30}
                                                />
                                            </View>
                                        <TouchableOpacity>
                                            <Image 
                                                style={{ width: 80, height: 80  }}
                                                source={{ uri: convertLink(item.Link) }}
                                                />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
            </Modal>
        </>
    
    )
}


const styles = StyleSheet.create({
    stateContainer: {
        borderRadius: 4,
        width: 120
    },
    stateTitle: {
        fontSize: 12, 
        fontWeight: 'bold',
        textAlign: 'center' 
    
    },
    headerTitle: {
        textAlign: 'center', 
        fontWeight: 'bold'
    },
    content: {
        padding: 10,
        borderRadius: 8,
        width: '90%',        
        alignSelf: 'center'
      },
      contentTop: {
        flexDirection: "row",
        paddingBottom: 10,
        borderBottomWidth: 1
      },
      line: {
        width: "100%",
        height: 1,
        borderWidth: 0.5,
        borderStyle: "dashed"
      },
      contentLine: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      },
      dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: "absolute"
      },
      contentBottom: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between"
      },
      bottomLeft: { flexDirection: "row", alignItems: "center" },
      image: { width: 32, height: 32, marginRight: 10, borderRadius: 16 }
})