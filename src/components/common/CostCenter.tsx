import React, { useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { DynamicText } from './DynamicText'
import { FilledInputText } from './FilledInputText'
import { AuthContext } from '../../contexts/auth/AuthContext';
import { GetCostCenterRQ } from '../../model/classes/backoffice/GetCostCenterRQ';
import { backofficeApi } from '../../api/backofficeApi';
import { GetCostCenterRS } from '../../model/classes/backoffice/GetCostCenterRS';
import { BudgetReservationRQ } from '../../model/classes/backoffice/BudgetReservationRQ';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { add } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    idCostcenter: number;
    costCenterData: {  costCenter: GetCostCenterRS, index: number  }
}

export const CostCenter = ({ idCostcenter, costCenterData }: Props ) => {
    const { width } = Dimensions.get( 'window' );
    const { theme: { colors, whiteColor, buttonText, grayColor, accent, } } = useContext( ThemeContext );
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { userData } = useContext( AuthContext );
    const [costCenters, setCostCenters] = useState<GetCostCenterRS[]>( [] );
    const [motive, setMotive] = useState('');
    const [showPercentage, setShowPercentage] = useState({
        show: false,
        index: -1
    });
    const [percentage, setPercentage] = useState<number[]>([]);
    const [selected, setSelected] = useState({
        costCenter: [{
            costCenter: '', percentage: 0, index: 0, percentageIndex: -1,
            availableBudget: 0, budgetSrc: '', budget: 0, costCenterName: '',
            budgetExecute: 0
        }]
    });
    const { getCostCenters, getBudgets } = backofficeApi();
    useEffect(() => { 
        if ( idCostcenter ) {
           requestCostCenter();
        }
    }, [idCostcenter])


    useEffect(() => {
        if ( costCenterData.costCenter.id ) {
            let newArray = [ ...selected.costCenter ];
            newArray[costCenterData.index].costCenter = costCenterData.costCenter.id;
            newArray[costCenterData.index].index = costCenterData.index;
            newArray[costCenterData.index].costCenterName = costCenterData.costCenter.CostCenterName;
            setSelected({
                costCenter: newArray
            });
        }

        
    }, [costCenterData])

    useEffect(() => {
        if ( costCenters.length > 0 )  {
            try {
                findTravelerCostCenter();
            } catch (error) {
                console.error( 'error', error );
            }
        }        
    }, [costCenters])


    useEffect(() => {
        setPercentage( [] );
        for ( let i = 100; i > 0; i-=10 ) {
            setPercentage( percentage => [ ...percentage, i ] )
        }
    }, [])
    
    const requestCostCenter = async() => {
        const request = new GetCostCenterRQ();
        request.EntityId = userData.IDEntityDefault;
        request.id = idCostcenter.toString();
        await getCostCenters( request )
            .then(( response ) => {
                if ( response && response.list && response.list.length > 0 ) {
                    setCostCenters( response.list as GetCostCenterRS[] )
                }
            })
    }


    const findTravelerCostCenter = () => {
        if ( costCenters ) {
            let indexSelected: number = -1;
            let costName: string = '';
            costCenters.map(( item, index ) => {
                if ( item.id.toString() === idCostcenter.toString() ) {
                    indexSelected = index;
                    costName = item.CostCenterName;
                    return true;
                }
                return false;
            });

            setSelected({
                costCenter: [{
                    costCenter: idCostcenter.toString(),
                    percentage: 100,
                    index: indexSelected,
                    percentageIndex: 0,
                    availableBudget: 0,
                    budgetSrc: 'sin_presupuesto',
                    budget: 0,
                    costCenterName: costName,
                    budgetExecute: 0
                }]
            })

            evaluateBudget(null, 0);
        }
    }

    const evaluateBudget = ( motive: string | null, index: number )  => {
        if (motive) {
            setMotive(motive);
        }

        if ( motive && index ) {
            getBudget(index);
        } else if (selected.costCenter.length > 0 && selected.costCenter[0].costCenter) {
            selected.costCenter.forEach((info, indexSelected) => {
                getBudget(indexSelected);
            });
        }
    }
    

    const getBudget = (index: number) => {
        if (true) {
            const request = new BudgetReservationRQ();
            request.MotiveCode = '-1';// this.motive;
            request.EntityCode = userData.IDEntityDefault;
            request.CostCenterCode = parseInt(selected.costCenter[index].costCenter, 10);
            getBudgets(request)
                .then(( response ) => {
                    selected.costCenter[index].availableBudget = response.Available ?
                        ( response.AvailableBalance * 100 ) / ( response.AvailableBalance + response.PptoExec ) : 0;
                    selected.costCenter[index].budget = response.AvailableBalance;
                    selected.costCenter[index].budgetSrc = getBudgetSrc( selected.costCenter[index].availableBudget );
                    selected.costCenter[index].budgetExecute = response.PptoExec;
                    /* user.travelerRequestData.costCenter = selected.costCenter; */

                    if ( !response.Available ) {
                        /* showWarning(); */
                    }
                }),
                () => {
                    console.log( 'error cost center',  )
                }
        } else {
            Toast.show({
                text1: '¡Error!',
                text2: 'Seleccione un pasajero',
                type: 'error'
            });
        } 
    }

    const openSelect = ( index: number  ) => {
        navigation.navigate( 'AutoCompleteSearch',  {
            type: 'CostCenter',
            index: index,
            screen: 'RequestServices',
        } )
    }

    const getBudgetSrc = ( budget: number ) => {
        let src = 'bateria_';
        if (budget < 10) {
            src = 'sin_presupuesto';
        } else if (budget >= 10 && budget < 15) {
            src += '15_10';
        } else if (budget >= 15 && budget < 20) {
            src += '20_15';
        } else if (budget >= 20 && budget < 30) {
            src += '30_20';
        } else if (budget >= 30 && budget < 40) {
            src += '40_30';
        } else if (budget >= 40 && budget < 50) {
            src += '50_40';
        } else if (budget >= 50 && budget < 60) {
            src += '60_50';
        } else if (budget >= 60 && budget < 70) {
            src += '70_60';
        } else if (budget >= 70 && budget < 80) {
            src += '80_70';
        } else if (budget >= 80 && budget < 90) {
            src += '80_90';
        } else if (budget >= 90 && budget <= 100) {
            src += '100';
        } else {
            src = 'sin_presupuesto';
        }

        return src;
    }

    const addCostCenter = () => {
        if ( selected.costCenter.length < 3 ) {

            const newCostCenter = {
                costCenter: '',
                percentage: 0,
                index: -1,
                percentageIndex: 0,
                availableBudget: 0,
                budgetSrc: 'sin_presupuesto',
                budget: 0,
                costCenterName: '',
                budgetExecute: 0
            }
            setSelected({
                ...selected,
                costCenter: [ ...selected.costCenter, newCostCenter ]
            })
        } else {
            Toast.show({
                text1: 'Información!',
                text2: 'No se puede seleccionar mas de 3 centros de costo.',
                type: 'info',
                visibilityTime: 2000
            })
        }
    }

    const subCostCenter = ( index: number ) => {
        if ( selected.costCenter.length > 1 ) {
            let array = [ ...selected.costCenter ];
            if ( index !== -1 ) {
                array.splice( index, 1 );
                setSelected({
                    ...selected,
                    costCenter: array
                })
            }
        } else {
            Toast.show({
                text1: 'Información!',
                text2: 'La solicitud debe tener minino un centro de costo',
                type: 'info',
                visibilityTime: 2000
            })
        }
    }

    const showPercentageValues = () => {
        setShowPercentage({
            ...showPercentage,
            show: !showPercentage.show
        });
    }


    const assignPercentage = ( item: number, index: number ) => {
        console.log(showPercentage );
        let newArray = [ ...selected.costCenter ].reverse();
        newArray[showPercentage.index].percentageIndex = item;
        newArray[showPercentage.index].percentage = percentage[  index ];
        setSelected({
            costCenter: newArray
        });
        
        setShowPercentage({
            ...showPercentage,
            show: !showPercentage.show
        });
    }

    return (
        <View>
            {
                selected.costCenter.reverse().map(( item, indexCostCenter ) => {
                    return (
                        <View key={ indexCostCenter } style={{ backgroundColor: accent, borderRadius: 10, marginBottom: 5 }}>
                            <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                                { indexCostCenter === selected.costCenter.length - 1 &&
                                    <TouchableOpacity style={{ margin: 5 }}
                                        onPress={ ()  =>  addCostCenter() }
                                    >
                                        <FontAwesomeIcon 
                                            icon={ faPlusCircle }
                                            size={ 20 }
                                            color={ colors.primary }
                                        />
                                    </TouchableOpacity>
                                }
                                { indexCostCenter !== selected.costCenter.length - 1 &&
                                    <TouchableOpacity style={{ margin: 5 }}
                                        onPress={ () =>  subCostCenter( indexCostCenter ) }
                                    >
                                        <FontAwesomeIcon 
                                            icon={ faMinusCircle }
                                            size={ 20 }
                                            color={ colors.primary }
                                        />
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity style={{ margin: 5 }}
                                    onPress={ () => setShowPercentage({
                                        ...showPercentage,
                                        show: !showPercentage.show,
                                        index: indexCostCenter
                                    }) }
                                >
                                    <DynamicText>
                                        { `${item.percentage}%` }
                                    </DynamicText>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={ ()  => openSelect( indexCostCenter )} style={{ maxWidth: '90%', left: width /20 }}>
                            <FilledInputText 
                                
                                disabled={ true }
                                label={ t( 'resCentroCostos' ) }
                                value={  item.costCenterName }  
                            />
                            </TouchableOpacity>
                        </View>
                    )        
                })
            }
            <Modal
                swipeDirection="right"
                onSwipeComplete={ () => showPercentageValues() }
                style={{ alignItems: 'center' }}
                isVisible={ showPercentage.show }
            >
                <View style={{ borderRadius: 10, width: 300, height: 430, backgroundColor: colors.background}}>
                        <View style={ commonStyles.rightButtonContainer }>
                            <Icon
                                onPress={ showPercentageValues }
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
                                marginBottom: 10
                            }}>
                                Porcentajes
                            </DynamicText>

                            {
                                percentage.map(( item, index ) => {
                                    return (
                                        <TouchableOpacity key={ index } style={{ alignSelf: 'center', marginTop: 7 }}
                                            onPress={ () => assignPercentage( item, index  ) }
                                        >
                                            <DynamicText style={{ fontSize: 20 }}>{ item }</DynamicText>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>                
            </Modal>
        </View>
    )
}
