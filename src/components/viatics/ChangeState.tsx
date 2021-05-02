import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native-animatable'
import { commonStyles } from '../../styles/commonStyles'
import Modal from 'react-native-modal';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { loginStyles } from '../../styles/loginStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { GExpenses } from '../../interfaces/viatics/GExpenses';
import { activitiesStyles } from '../../styles/activitiesStyles';
import NumberFormat from 'react-number-format';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import Moment from 'moment';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { getTotalExpense } from '../../helpers/viatics/getTotalExpense';
import { ExpensesSaveRQ } from '../../interfaces/viatics/ExpensesSaveRQ';
import { viaticsApi } from '../../api/viaticsApi';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

interface Props {
    showHandle: ( status?: string ) => void;
    show: boolean;
    expensesSelected: GExpenses[];
    status: string;
    idApprover: number;
    isSendLegalized: ( legalized: boolean ) => void;
}

export const ChangeState = ({ showHandle, show, expensesSelected, status, idApprover, isSendLegalized }: Props) => {
    const { t } = useTranslation();
    const { theme: { colors, secondary } } = useContext( ThemeContext );
    const [sendLegalized, setSendLegalized] = useState(false);
    const { saveExpenses } = viaticsApi();
    const [changeStateOptions, setChangeStateOptions] = useState({
        title: '',
        subtitle: '',
        error: ''
    })
    const { width } = Dimensions.get('window');

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
                    /* this.errorMessage = 'La justificacion del aprobador del gasto: ' + row.Description +
                    ' no ha sido llenada.';
                    this.showAlert = true;
                    setTimeout(() => { this.showAlert = false; }, 3400); */
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
                        isSendLegalized( response.Success )
                    } else {
                        isSendLegalized( false );
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
                        <Text style={{ 
                            ...commonStyles.title,
                            marginTop: 0,
                            color: colors.primary,
                            fontSize: 25,
                            marginBottom: 10
                        }}>
                            { changeStateOptions.title }
                        </Text>
                        <Text style={{ 
                            ...commonStyles.title,
                            marginTop: 0,
                            color: colors.primary,
                            fontSize: 15,
                            marginBottom: 10
                        }}>
                            { changeStateOptions.subtitle }
                        </Text>
                        </View>
                        <View style={{  flex: 1, marginTop: 20, bottom: 10, }}>
                        <FlatList 
                                data={ expensesSelected }
                                keyExtractor={ ( item: GExpenses )  => item.IDExpense}
                                renderItem={ ({ item, index }) => (
                                    <View style={{ marginTop: 10, paddingBottom: 5,  borderWidth: 2,  borderColor: colors.primary, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                        <View style={{  ...activitiesStyles.dataContainer, }}>
                                            <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resConceptoGasto' ) }:  </Text>
                                            <Text style={{color: colors.text}}>{ item.Description }</Text>
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resFecha' ) }:  </Text>
                                            <Text style={{color: colors.text}}>{ Moment( item.Date ).format('ll')  }</Text>
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resEstado' ) }:  </Text>
                                            <View style={{ 
                                                backgroundColor: setStateColor(item.State),
                                                ...styles.stateContainer
                                            }}>
                                                <Text style={{ ...styles.stateTitle,  color: 'white' }}>{ setStateActivity(item.State) }</Text>
                                            </View>
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resVImpuestos' ) }:  </Text>
                                            <NumberFormat value={ item.TaxValue } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                renderText={
                                                    value => <Text>{ value }</Text>
                                                } 
                                            />
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resVPropina' ) }:  </Text>
                                            <NumberFormat value={ item.TipValue } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                renderText={
                                                    value => <Text>{ value }</Text>
                                                } 
                                            /> 
                                        </View>
                                        <View style={{ ...activitiesStyles.dataContainer }}>
                                            <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resTotalGastos' ) }:  </Text>
                                            <NumberFormat value={ getTotalExpense( item ) } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                renderText={
                                                    value => <Text>{ value }</Text>
                                                } 
                                            /> 
                                        </View>
                                        { status === 'J' &&
                                            <View style={{ ...activitiesStyles.dataContainer }}>
                                                <Text style={{color: colors.text, fontWeight: 'bold'}}>{ t( 'resNotaAprobador' ) }:  </Text>
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
                                        <Text style={[loginStyles.textSign, {
                                            color:'#fff'
                                        }]}>{ t( 'resConfirmar' ) }</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={ () => showHandle() }
                                    style={ styles.buttons }>
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={ styles.buttons }
                                    >
                                        <Text style={[loginStyles.textSign, {
                                            color:'#fff'
                                        }]}>{ t( 'resCancelar' ) }</Text>
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
})