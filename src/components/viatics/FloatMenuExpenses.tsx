import { faFile, faTrashAlt, faEdit, faEllipsisV, faBars } from '@fortawesome/free-solid-svg-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FloatingMenu } from 'react-native-floating-action-menu';
import { RootStackParams } from '../../navigator/Navigator';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { DynamicText } from '../common/DynamicText';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import { GExpenses } from '../../model/interfaces/viatics/GExpenses';
import Moment from 'moment';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { setExpenseType } from '../../helpers/viatics/setExpenseType';
import { getTotalExpense } from '../../helpers/viatics/getTotalExpense';
import { CategoriesEntity } from '../../model/classes/viatics/CategoriesEntity';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { viaticsApi } from '../../api/viaticsApi';
import { DownloadImageRQ } from '../../model/classes/viatics/DownloadImages';
import { ExpenseEstablishmentRQ } from '../../model/classes/viatics/ExpenseEstablishmentRQ';
import { LinkExpenses } from '../../model/classes/viatics/LinkExpenses';
import AwesomeAlert from 'react-native-awesome-alerts';
import { DropExpenseRQ } from '../../model/classes/viatics/DropExpenseRQ';
import Toast from 'react-native-toast-message';
import { StyleSheet, View } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';
import { useFont } from '../../hooks/common/useFont';
import NumberFormat from 'react-number-format';

interface Props {
    expense: GExpenses,
    navigation: StackNavigationProp<RootStackParams, "ExpensesScreen">,
    isDeleted: ( deleted: boolean ) => void;
}

export const FloatMenuExpenses = ({ navigation, expense, isDeleted }: Props) => {
    const { semibold, bold } =  useFont()
    const { getCategories, getEstablishments, downloadImages, deleteExpense } = viaticsApi();
    const { theme: { colors, fieldColor, secondary, buttonText } } = useContext( ThemeContext );
    const { userData: { IDEntityDefault } } = useContext( AuthContext );
    const [modalButtons, setModalButtons] = useState({
        detailExpense: false,
        supportsExpense: false,
        deleteExpense: false
    });
    const [images, setImages] = useState<LinkExpenses[]>([]);
    const [canDelete, setCanDelete] = useState(true);
    const [category, setCategory] = useState('');
    const [showItems, setShowItems] = useState(false);
    const [establishment, setEstablishment] = useState('');
    const { t } = useTranslation();
    const items = [
        { 
            label: t( 'resDetalle' ), 
            labelStyle: styles.labelMenu, 
            fa: faFile, 
            onPress: () => showDetail(),
        },
        { 
            label: t( 'resEliminar' ), 
            labelStyle: styles.labelMenu, 
            fa: faTrashAlt, 
            onPress: () => showDeleteAlert(),
            isDisabled: canDelete 
        },
        { 
            label: t( 'resEditar' ), 
            labelStyle: styles.labelMenu, 
            fa: faEdit, 
            onPress: () => navigation.navigate('RegisterExpensesScreen', {
                expense: expense,
                type: 'edit'
            }) 
        },
    ];

    useEffect(() => {
        validateState();
        getCategory();
        getEstablishment();
        getSupportImages()

    }, [])


    const getCategory = async() => {
        const request = new CategoriesEntity();
        request.IDEntity  = IDEntityDefault;
        request.CategoryId = expense.IDCategory
        getCategories( request )
            .then(( response ) => {
                setCategory(response[0].Name);
            })

    }

    const validateState = (): void => {
        if ( expense.State === 'P' || expense.State === 'J' ) {
            setCanDelete( false );
        }
    }

    const getSupportImages = () => {
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
            })
    }

    const getEstablishment = () => {
        const request = new ExpenseEstablishmentRQ();
        request.IDEntity = IDEntityDefault;
        request.Skip = 0;
        request.Take = 20;
        request.EstablishmentId = expense.IDEstablishment;
        getEstablishments(  request )
            .then(( response ) => {
                setEstablishment(response[0]?.Name);
            })
    }

    const handleMenuToggle = () => {
        setShowItems( !showItems )
    }

    const showDetail = () => {
        setModalButtons({
            ...modalButtons,
            detailExpense: !modalButtons.detailExpense
        })
    }

    const showDeleteAlert = ( ) =>  {
        setModalButtons({
            ...modalButtons,
            deleteExpense: !modalButtons.deleteExpense
        })
    }

    const deleteCurrentExpense = () => {
        const listExpenses: GExpenses[] = [];
        listExpenses.push( expense );
        const request = new DropExpenseRQ();
        request.IDEntity = IDEntityDefault;
        request.Data = listExpenses;
        deleteExpense( request )
            .then(( response ) => {
                if ( response.Error === '' ) {
                    isDeleted( true );
                }
                else{
                    isDeleted( false ); 
                }
                setShowItems( false );
            })
        showDeleteAlert();
    }

    return (
        <>
            <FloatingMenu
                bottom={ 60 }
                right={ 10 }
                items={items}
                isOpen={ showItems }
                onMenuToggle={ handleMenuToggle }
                labelStyle={{ fontFamily: semibold }}
                borderColor={ colors.primary }
                primaryColor={ fieldColor }
                renderMenuIcon={ () => { return (
                    <FontAwesomeIcon
                        icon={ faBars }
                        color={ colors.primary }
                        size={ 30 }
                    />
                )}}
                renderItemIcon= { ( item: any, index: any, menuState: any )  => {
                    if ( item.fa ) {
                        return (
                            <FontAwesomeIcon
                                icon={item.fa}
                                size={25}
                                color={ colors.primary }
                            />
                        )
                    }
                }}
            />

            <Modal
                key={'detail'}
                swipeDirection="right"
                onSwipeComplete={ showDetail }
                /* onModalHide={ () => hideMenu( false ) } */
                style={{ alignItems: 'center'}} isVisible={modalButtons.detailExpense}>
                    <View style={{ borderRadius: 10, width: 300, height: 600, backgroundColor: colors.background}}>
                        <View style={ commonStyles.rightButtonContainer }>
                            <Icon
                                onPress={showDetail }
                                name="close-circle"
                                color={ colors.primary }
                                size={ 30}
                            />
                        </View>
                            <View style={{ marginLeft: 10, marginBottom: 20 }}>
                                <DynamicText fontFamily={ bold } style={{ 
                                    marginBottom: 10, 
                                    fontSize: 30,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    color: colors.primary
                                }}>
                                    Información de Gasto
                                </DynamicText>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resNombre' ) }:  </DynamicText>
                            <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ expense.Description }</DynamicText>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resEstado' ) }:  </DynamicText>
                            <View style={{ 
                                backgroundColor: setStateColor(expense.State),
                                width: '50%',
                                height: 30, 
                                justifyContent: 'center',
                                borderRadius: 5
                            }}>
                                <DynamicText fontFamily={ semibold } style={{ ...styles.stateTitle,  color: buttonText }}>{ t( setStateActivity(expense.State) ) }</DynamicText>
                            </View>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resFecha' ) }:  </DynamicText>
                            <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{  Moment(expense.Date ).format('ll') }</DynamicText>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resCategorias' ) }:  </DynamicText>
                            <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ category }</DynamicText>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resEstablecimiento' ) }:  </DynamicText>
                            <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ establishment }</DynamicText>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>NIT:  </DynamicText>
                            <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ expense.IDEstablishment }</DynamicText>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resTipoPago' ) }:  </DynamicText>
                            <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ setExpenseType( expense.PaymentType ) }</DynamicText>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resTipoMoneda' ) }:  </DynamicText>
                            <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ expense.Currency }</DynamicText>                        
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resVImpuestos' ) }:  </DynamicText>
                            <NumberFormat value={ expense.TaxValue }  displayType={ 'text' } thousandSeparator={ true } prefix={ '$' }
                                renderText={ 
                                    value => <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ value }</DynamicText>
                                }
                            />
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resVPropina' ) }:  </DynamicText>
                            <NumberFormat value={ expense.TipValue }  displayType={ 'text' } thousandSeparator={ true } prefix={ '$' }
                                renderText={ 
                                    value => <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ value }</DynamicText>
                                }
                            />
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 17, color: colors.primary }}>{ t( 'resTotalGastos' ) }:  </DynamicText>
                            <NumberFormat value={ getTotalExpense( expense ) }  displayType={ 'text' } thousandSeparator={ true } prefix={ '$' }
                                renderText={ 
                                    value => <DynamicText style={[ styles.subtitle , { color: colors.text }]}>{ value }</DynamicText>
                                }
                            />    
                        </View>

                    </View>
            </Modal>

            <AwesomeAlert
                    messageStyle={{ fontSize: 15, fontFamily: 'Raleway-Regular' }}
                    show={modalButtons.deleteExpense}
                    showProgress={false}
                    title="Eliminar Gasto"
                    message={ 
                        `${ t( 'resEliminarGastoPt1' ) } ${ expense.Description }${ t( 'resEliminarGastoPt2' ) }  ${ expense.ExpenseCash } ${ t( 'resEliminarGastoPt3' ) } ${  Moment(expense.Date ).format('ll') } ?` 
                    }
                    cancelButtonTextStyle={{ fontFamily: 'Raleway-SemiBold' }}
                    confirmButtonTextStyle={{ fontFamily: 'Raleway-SemiBold' }}
                    titleStyle={{ fontFamily: 'Raleway-SemiBold' }}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText={ t( 'resNoCancelar' ) }
                    confirmText={ t( 'resSiEliminar' ) }
                    confirmButtonColor={ colors.primary }
                    cancelButtonColor="#595953"
                    onCancelPressed={() => {
                        setModalButtons({
                            ...modalButtons,
                            deleteExpense: !modalButtons.deleteExpense
                        })
                    }}
                    onConfirmPressed={() => {
                        deleteCurrentExpense();
                    }}
                />
        </>
    )
}

const styles = StyleSheet.create({
    labelMenu: {
        fontSize: 13, 
        fontFamily: 'Raleway-Regular', 
        fontWeight: '900'
    },
    stateContainer: {
        borderRadius: 4,
        width: 120,
        justifyContent: 'center'
    },
    stateTitle: {
        fontSize: 12, 
        fontWeight: 'bold',
        textAlign: 'center' 
    
    },
    subtitle: {
        fontSize: 17, 
        marginLeft: 5
    }
})
