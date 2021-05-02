import React, { useContext, useEffect, useState } from 'react'
import { Switch, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { GActivities } from '../../interfaces/viatics/GActivities';
import * as Animatable from 'react-native-animatable';
import { viaticsApi } from '../../api/viaticsApi';
import { ExpensesRQ } from '../../interfaces/viatics/ExpensesRQ';
import { ExpensesRS } from '../../interfaces/viatics/ExpensesRS';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { GExpenses } from '../../interfaces/viatics/GExpenses';
import { getTotalExpense } from '../../helpers/viatics/getTotalExpense';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import { Col, Grid } from "react-native-easy-grid";
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import NumberFormat from 'react-number-format';
import { useTranslation } from 'react-i18next';

interface Props {
    currentActivity: GActivities,
    menus: { menuExpense: boolean ,menuActivity: boolean };
    cleanSelected: boolean;
    parentCallBack: (childData: GExpenses) => void;
    selectedExpenses: ( data: any ) => void;
}

export const ExpensesScreen = ( { currentActivity, menus, parentCallBack, selectedExpenses, cleanSelected }: Props ) => {
    const { t } = useTranslation();
    const [expenses, setExpenses] = useState<ExpensesRS>({
        Expenses: [],
        Total: 0,
        Error:  ''
    });
    const [completeSelectedExpense, setCompleteSelectedExpense] = useState<GExpenses[]>([]);
    const [selectExpense, setSelectExpense] = useState({
        listExpense: Array<any>()
    });
    const [loading, setLoading] = useState(false);
    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const { getExpense } = viaticsApi();

    const request: ExpensesRQ ={
        IDGroup: currentActivity.IDGroup
    }

    useEffect(() => {
       
       /*  if ( cleanSelected ) {
            selectExpense.listExpense = [];
        } */
        

    }, [cleanSelected])

     useEffect(() => {
    }, [selectExpense ])

    useEffect(() => {

        sendData();
    }, [completeSelectedExpense ])
    
    const setSwitchValue = (val: boolean, ind: number) => {
        const tempData = selectExpense.listExpense;
        tempData[ind].selected = val;
        setSelectExpense({
            listExpense: tempData
        });

        sendData()
    }

    const sendData = () => {
        const selecteExpenses: GExpenses[] = [];
        selectExpense.listExpense.map(checked => {
            if ( checked.selected ) {
                expenses.Expenses.map(element => {
                    if ( element.IDExpense === checked.expense ) {
                        const result = completeSelectedExpense.find( a => a.IDExpense === element.IDExpense );
                        if ( !result ) {
                            selecteExpenses.push( element );
                        } else {
                            if ( result ) {
                                let position = completeSelectedExpense.indexOf(element);
                                completeSelectedExpense.splice(position, 1);
                            }
                        }
                    }
                });
            }

        });

        selectedExpenses( selecteExpenses );

    }

    useEffect(() => {
    }, [selectExpense.listExpense])

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
    }, [])


    return (
        <>
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
                            <Text style={{
                                ...styles.headerTitle,
                            color: colors.primary}}>{ t('resDescripcion') }</Text>
                        </Col>
                        <Col> 
                            <Text style={{ 
                                ...styles.headerTitle,
                                marginRight: 70,
                                color: colors.primary}}>{ t( 'resValor' ) }</Text>
                        </Col>
                        <Col>
                            <Text style={{
                                ...styles.headerTitle,
                                marginRight: 60, 
                                color: colors.primary,}}>{ t( 'resEstado' ) }</Text>
                        </Col>
                    </Grid>

                    <FlatList
                        data={ expenses?.Expenses }
                        keyExtractor={ (expense: GExpenses ) => expense.IDExpense  }
                        renderItem={ ({ item, index }) => (
                            <View style={{ marginTop: 10 }}>  
                                <Grid>
                                    <Switch
                                        trackColor={{ false: '#ECECEC', true: secondary }}
                                        thumbColor={( selectExpense?.listExpense[index]?.selected ) ? colors.primary : "#ECECEC"}
                                        onValueChange={(value) => {
                                            setSwitchValue(value, index)
                                        }}
                                        value={ selectExpense.listExpense[index].selected ? true : false }
                                    ></Switch>
                                    <Col>
                                        <Text>{ item.Description } </Text>
                                    </Col>
                                    <Col>                                        
                                        <NumberFormat value={ getTotalExpense(item) } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                            renderText={
                                            value => <Text>{ value }</Text>
                                            } 
                                        />
                                    </Col>
                                    <Col>
                                        <View style={{ 
                                            backgroundColor: setStateColor(item.State),
                                            ...styles.stateContainer
                                        }}>
                                            <Text style={{ ...styles.stateTitle,  color: 'white' }}>{ setStateActivity(item.State) }</Text>
                                        </View>
                                    </Col>
                                    <Col>
                                        <TouchableOpacity
                                            onPress={ () => parentCallBack(item) }
                                        >
                                            <Icon
                                                style={{ marginLeft: 50 }}
                                                name="eye"
                                                color={ colors.primary }
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                        
                                    
                                    </Col>
                                </Grid>
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
                        <Text style={{
                            left: 10, 
                            fontSize: 15,
                            color: colors.primary,
                            marginBottom: 10,
                            fontWeight: 'bold'
                        }}>
                            { t( 'resNoEncontraronGastos' ) }
                        </Text>
                    </View>

            }
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
})