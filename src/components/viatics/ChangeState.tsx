import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native-animatable'
import { commonStyles } from '../../styles/commonStyles'
import Modal from 'react-native-modal';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { loginStyles } from '../../styles/loginStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { GExpenses } from '../../model/interfaces/viatics/GExpenses';
import { activitiesStyles } from '../../styles/activitiesStyles';
import NumberFormat from 'react-number-format';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import Moment from 'moment';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { getTotalExpense } from '../../helpers/viatics/getTotalExpense';
import { ExpensesSaveRQ } from '../../model/interfaces/viatics/ExpensesSaveRQ';
import { viaticsApi } from '../../api/viaticsApi';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { DynamicText } from '../common/DynamicText';
import { useFont } from '../../hooks/common/useFont';

interface Props {
    showHandle: ( status?: string ) => void;
    show: boolean;
    expensesSelected: GExpenses[];
    status: string;
    idApprover: number;
    isSendLegalized: ( legalized: boolean, status: string ) => void;
}

export const ChangeState = ({ showHandle, show, expensesSelected, status, idApprover, isSendLegalized }: Props) => {
    const { t } = useTranslation();
    const { theme: { colors, secondary, fieldColor } } = useContext( ThemeContext );
    const [sendLegalized, setSendLegalized] = useState(false);
    const { saveExpenses } = viaticsApi();
    const [changeStateOptions, setChangeStateOptions] = useState({
        title: '',
        subtitle: '',
        error: ''
    })
    const { width } = Dimensions.get('window');
    const { semibold } = useFont();
    const approveNote = ( value: string, id: number ) => {
        const tempData = expensesSelected;
        tempData[ id ].LegalizeNote = value;
    }


    useEffect(() => {
        switch ( status ) {
            case 'R':
                setChangeStateOptions({
                    ...changeStateOptions,
                    title: t( 'resConfirmacionLegalizacion' ),
                    subtitle: t( 'resSeguroEnviarLegalizar' )
                })
                break;
            case 'A':
                setChangeStateOptions({
                    ...changeStateOptions,
                    title: t( 'resConfirmacionAprobacion' ),
                    subtitle: t( 'resSeguroEnviarAprobar' )
                })
                break;
            case 'J':
                setChangeStateOptions({
                    ...changeStateOptions,
                    title: t( 'resConfirmacionJustificacion' ),
                    subtitle: t( 'resSeguroEnviarJustificar' )
                })
                break;
            default:
                break;
        } 
    }, [status])


    const validateJustify = (): boolean => {
        let canChangeState: boolean = false;
        let expensesCount: number = 0;
        if (status === 'J') {
            expensesSelected.map(row => {
                if (row.LegalizeNote === '' || row.LegalizeNote === undefined) {
                    canChangeState = false;
                    Toast.show({
                        text1: 'Error',
                        text2: t( 'resAgregarJustificacionAprobador' ),
                        type: 'error',
                        visibilityTime: 2000,
                    });
                }
                else  {
                    expensesCount = expensesCount + 1;
                }
            });
            if (expensesCount === expensesSelected.length) {
                canChangeState = true;
            }
        }  
        else {
            canChangeState = true;
        }

        return canChangeState;
    }

    const expensesSave = () => {
        if (validateJustify()) {
            setSendLegalized( true );
            const request = new ExpensesSaveRQ();
            request.Action = 'legalize';
            request.Data = expensesSelected;
            request.IDUserApprover = idApprover;
            request.Data.forEach(row =>{
                row.State = status
            });
            saveExpenses( request )
                .then(( response ) => {
                    if (response.Success) {
                        setSendLegalized( false );
                        isSendLegalized( response.Success, status )
                    } else {
                        isSendLegalized( false, status );
                    }
                    showHandle()
                })
        }
    }

    return (
        <View>
             <Modal
                swipeDirection="right"
                onSwipeComplete={() => showHandle() }
                style={{ alignItems: 'center'}} isVisible={ show }>
                    <View style={{ borderRadius: 10, width: width / 1.05 , height: 500, backgroundColor: colors.background}}>
                        <View style={ commonStyles.rightButtonContainer }>
                            <Icon
                                onPress={ () => showHandle() }
                                name="close-circle"
                                color={ colors.primary }
                                size={ 30}
                            />
                        </View>
                        <View>
                        <DynamicText fontFamily={ semibold } style={{ 
                            ...commonStyles.title,
                            marginTop: 0,
                            color: colors.primary,
                            fontSize: 25,
                            marginBottom: 10
                        }}>
                            { changeStateOptions.title }
                        </DynamicText>
                        <DynamicText style={{ 
                            ...commonStyles.title,
                            marginTop: 0,
                            color: colors.primary,
                            fontSize: 15,
                            marginBottom: 10
                        }}>
                            { changeStateOptions.subtitle }
                        </DynamicText>
                        </View>
                        <View style={{  flex: 1, marginTop: 20, bottom: 10, }}>
                        <FlatList 
                                data={ expensesSelected }
                                keyExtractor={ ( item: GExpenses )  => item.IDExpense}
                                renderItem={ ({ item, index }) => (
                                    <View style={{  ...styles.expenseContainer, backgroundColor: fieldColor }}>
                                        <View style={{  ...activitiesStyles.dataContainer, }}>
                                            <DynamicText fontFamily={ semibold } style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resConceptoGasto' ) }:  </DynamicText>
                                            <DynamicText style={{color: colors.text}}>{ item.Description }</DynamicText>
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <DynamicText fontFamily={ semibold } style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resFecha' ) }:  </DynamicText>
                                            <Text style={{color: colors.text}}>{ Moment( item.Date ).format('ll')  }</Text>
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <DynamicText fontFamily={ semibold } style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resEstado' ) }:  </DynamicText>
                                            <View style={{ 
                                                backgroundColor: setStateColor(item.State),
                                                ...styles.stateContainer
                                            }}>
                                                <DynamicText style={{ ...styles.stateTitle,  color: 'white' }}>{ t( setStateActivity(item.State) ) }</DynamicText>
                                            </View>
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <DynamicText fontFamily={ semibold } style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resVImpuestos' ) }:  </DynamicText>
                                            <NumberFormat value={ item.TaxValue } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                renderText={
                                                    value => <DynamicText>{ value }</DynamicText>
                                                } 
                                            />
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <DynamicText fontFamily={ semibold } style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resVPropina' ) }:  </DynamicText>
                                            <NumberFormat value={ item.TipValue } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                renderText={
                                                    value => <DynamicText>{ value }</DynamicText>
                                                } 
                                            /> 
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <DynamicText fontFamily={ semibold } style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resTotalGastos' ) }:  </DynamicText>
                                            <NumberFormat value={ getTotalExpense( item ) } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                renderText={
                                                    value => <DynamicText>{ value }</DynamicText>
                                                } 
                                            /> 
                                        </View>
                                        { status === 'J' &&
                                            <View style={{ ...activitiesStyles.dataContainer }}>
                                                <DynamicText style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resNotaAprobador' ) }:  </DynamicText>
                                                <TextInput 
                                                    placeholder={ t( 'resEscribeNota' ) }
                                                    style={{ width: '70%', bottom: 15 }} 
                                                    underlineColorAndroid={  colors.primary }
                                                    onChangeText={ ( value ) => approveNote( value, index ) }
                                                />
                                            </View>
                                        }
                                        
                                    </View>
                                ) }
                            />
                            <View style={{
                                ...styles.buttonsContainer
                            }}>
                                <TouchableOpacity 
                                    style={ styles.buttons }
                                    onPress={ () => expensesSave() }
                                >
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={ styles.buttons }
                                    >
                                        <DynamicText fontFamily={ semibold } style={[loginStyles.textSign, {
                                            color:'#fff'
                                        }]}>{ t( 'resConfirmar' ) }</DynamicText>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={ () => showHandle() }
                                    style={ styles.buttons }>
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={ styles.buttons }
                                    >
                                        <DynamicText fontFamily={ semibold } style={[loginStyles.textSign, {
                                            color:'#fff'
                                        }]}>{ t( 'resCancelar' ) }</DynamicText>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            { 
                                sendLegalized 
                                ?
                                    <ActivityIndicator
                                        style={{ marginTop: 5 }}
                                        size="small"
                                        animating={ true }
                                        color={ colors.primary }
                                    ></ActivityIndicator>
                                
                                : null
                            }
                        </View>
                    </View>
                </Modal>
            
        </View>
    )
}


const styles = StyleSheet.create({
    stateContainer: {
        borderRadius: 4,
        width: 150
    },
    stateTitle: {
        fontSize: 12, 
        fontWeight: 'bold',
        textAlign: 'center' 
    
    },
    headerTitle: {
        fontSize: 10,
        textAlign: 'center', 
        fontWeight: 'bold'
    },buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    buttons: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    expenseContainer: {
        marginTop: 10, 
        paddingBottom: 5, 
        width: '97%', 
        alignSelf: 'center',
        borderRadius: 10,
    }
})