import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid'
import Icon from 'react-native-vector-icons/Ionicons'
import { ThemeContext } from '../../contexts/theme/ThemeContext'
import { activitiesStyles } from '../../styles/activitiesStyles';
import Modal from 'react-native-modal';
import { commonStyles } from '../../styles/commonStyles';
import { GExpenses } from '../../interfaces/viatics/GExpenses';
import Moment from 'moment';
import { CategoriesEntity } from '../../classes/viatics/CategoriesEntity';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { viaticsApi } from '../../api/viaticsApi';
import { getTotalExpense } from '../../helpers/viatics/getTotalExpense';
import { setExpenseType } from '../../helpers/viatics/setExpenseType';
import { ExpenseEstablishmentRQ } from '../../classes/viatics/ExpenseEstablishmentRQ';
import { setStateColor } from '../../helpers/viatics/setStateColor';
import { setStateActivity } from '../../helpers/viatics/setStateActivity';
import { DownloadImageRQ } from '../../classes/viatics/DownloadImages';
import { DownloadImagesRS } from '../../classes/viatics/DownloadImagesRS';
import { LinkExpenses } from '../../classes/viatics/LinkExpenses';
import { FlatList } from 'react-native-gesture-handler';
import { convertLink } from '../../helpers/viatics/convertLink';
import AwesomeAlert from 'react-native-awesome-alerts';
import { DropExpenseRQ } from '../../classes/viatics/DropExpenseRQ';
import { useNavigation } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';

interface Props {
    expense: GExpenses,
    hideMenu: ( show: boolean ) => void;
    isDeleted: ( deleted: boolean ) => void;
}

export const MenuExpense = ({ expense, hideMenu, isDeleted }: Props) => {
    const { t } = useTranslation();
    const { userData: { IDEntityDefault } } = useContext( AuthContext );
    const { theme: { colors, buttonText } } = useContext( ThemeContext );
    const [images, setImages] = useState<LinkExpenses[]>([])
    const  { getCategories, getEstablishments, downloadImages, deleteExpense } = viaticsApi()
    const { width } = Dimensions.get('window');
    const [category, setCategory] = useState('');
    const [establishment, setEstablishment] = useState('');
    const navigation = useNavigation();
    const [modalButtons, setModalButtons] = useState({
        detailExpense: false,
        supportsExpense: false,
        deleteExpense: false
    })
    useEffect(() => {

        getCategory();
        getEstablishment();
        getSupportImages()

    }, [])

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

    const getCategory = async() => {
        const request = new CategoriesEntity();
        request.IDEntity  = IDEntityDefault;
        request.CategoryId = expense.IDCategory
        getCategories( request )
            .then(( response ) => {
                setCategory(response[0].Name);
            })

    }

    const deleteCurrentExpense = () => {
        const listExpenses: GExpenses[] = [];
        listExpenses.push( expense );
        const request = new DropExpenseRQ();
        request.IDEntity = IDEntityDefault;
        request.Data = listExpenses;
        hideMenu( false );
        deleteExpense( request )
            .then(( response ) => {
                if ( response.Error === '' ) {
                    isDeleted( true );
                }
                else{
                    isDeleted( false );
                }
            })
    }


    const validateState = (): boolean => {
        let canAction = true;
        if ( expense.State === 'P' || expense.State === 'J' ) {
            canAction = false;
        }
        return canAction;
    }

    const showDetail = () => {
        setModalButtons({
            ...modalButtons,
            detailExpense: !modalButtons.detailExpense
        })
    }
    
    const showSupports = () => {
        setModalButtons({
            ...modalButtons,
            supportsExpense: !modalButtons.supportsExpense
        })
    }

    const showDeleteAlert = ( ) =>  {
        setModalButtons({
            ...modalButtons,
            deleteExpense: !modalButtons.deleteExpense
        })
    }

    const getDimension = (): number => {
        if ( width > 400 ) {
            return width / 8;
        } else {
            return width / 12;
        }
    }

    return (
            <View  style={{ 
                backgroundColor: '#595953', 
                position: 'absolute', 
                bottom: 50, 
                marginLeft: getDimension() ,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }}>


                <Grid>
                    <View>
                        <Col>
                            <TouchableOpacity 
                                onPress={ showDetail }
                                style={{ 
                                ...activitiesStyles.menuItem, 
                                borderTopColor: 'transparent' , 
                                borderLeftColor: 'transparent', 
                                borderBottomColor: buttonText, 
                                borderRightColor: buttonText,
                                }}
                            >
                                <Icon
                                    style={{ left: 10, }}
                                    name="document-outline"
                                    color={ buttonText }
                                    size={ 30 }
                                />
                                <Text style={{ color: buttonText, flex: 1, flexWrap: 'wrap', textAlign: 'center', marginTop: 5}}>{ t( 'resDetalle' ) }</Text>    
                            </TouchableOpacity>
                                                                    
                            
                            <TouchableOpacity
                                disabled={ validateState() }
                                onPress={ () => showDeleteAlert() }
                                style={{ 
                                    ...activitiesStyles.menuItem,  
                                    borderTopColor: 'transparent', 
                                    borderBottomColor: 'transparent', 
                                    borderLeftColor: 'transparent',
                                    borderRightColor: buttonText
                                }}
                            >
                                <Icon 
                                    style={{ left: 10,}}
                                    name="close-circle"
                                    color={ buttonText }
                                    size={ 30 }
                                />
                                <Text style={{ color: buttonText, flex: 1, flexWrap: 'wrap', textAlign: 'center', marginTop: 5}}>{ t( 'resEliminar' ) }</Text>    
                            </TouchableOpacity>
                            
                        </Col>
                    </View>
                    <View>
                        <Col>
                        <TouchableOpacity 
                            onPress={ showSupports }
                            style={{ 
                                ...activitiesStyles.menuItem, 
                                borderTopColor: 'transparent', 
                                borderBottomColor: buttonText, 
                                borderLeftColor: 'transparent', 
                                borderRightColor: 'transparent'
                            }}
                        >
                            <Icon
                                    style={{ left: 10,}}
                                name="camera"
                                color={ buttonText }
                                size={ 30 }
                            />
                            <Text style={{color: buttonText, flex: 1, flexWrap: 'wrap', textAlign: 'center', marginTop: 5}}>{ t( 'resSoporte' ) }</Text>    
                        </TouchableOpacity>
                                                                    
                            
                            <TouchableOpacity 
                                disabled={( expense.State === 'P' ||  expense.State === 'J' ) ? false : true}
                                onPress={ () => navigation.navigate('RegisterExpensesScreen', {
                                    expense: expense,
                                    type: 'edit'
                                }) }
                                style={{
                                    ...activitiesStyles.menuItem, 
                                    borderTopColor: 'transparent', 
                                    borderBottomColor: 'transparent', 
                                    borderLeftColor: 'transparent', 
                                    borderRightColor: 'transparent'
                                }}
                            >
                                <Icon
                                    style={{ left: 10 }}
                                    name="create"
                                    color={ buttonText }
                                    size={ 30 }
                                />
                                <Text style={{color: buttonText,  flex: 1, flexWrap: 'wrap', textAlign: 'center', marginTop: 5}}>{ t( 'resEditar' ) }</Text>    
                            </TouchableOpacity>
                        </Col>
                    </View>
                </Grid>

                <Modal
                    key={'detail'}
                    swipeDirection="right"
                    onSwipeComplete={ showDetail }
                    onModalHide={ () => hideMenu( false ) }
                    style={{ alignItems: 'center'}} isVisible={modalButtons.detailExpense}>
                        <View style={{ borderRadius: 10, width: 300, height: 430, backgroundColor: colors.background}}>
                            <View style={ commonStyles.rightButtonContainer }>
                                <Icon
                                    onPress={showDetail }
                                    name="close-circle"
                                    color={ colors.primary }
                                    size={ 30}
                                />
                            </View>
                                <View style={{ marginLeft: 10, marginBottom: 20 }}>
                                <Text style={{ 
                                    ...commonStyles.title,
                                    color: colors.primary,
                                    marginTop: 0,
                                    marginBottom: 10
                                }}>
                                    Información de Gasto
                                </Text>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resNombre' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ expense.Description }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resEstado' ) }:  </Text>
                                        <View style={{ 
                                            backgroundColor: setStateColor(expense.State),
                                            ...styles.stateContainer
                                        }}>
                                            <Text style={{ ...styles.stateTitle,  color: buttonText }}>{ setStateActivity(expense.State) }</Text>
                                        </View>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resFecha' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{  Moment(expense.Date ).format('ll') }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resCategorias' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ category }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resEstablecimiento' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ establishment }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>NIT:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ expense.IDEstablishment }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resTipoPago' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ setExpenseType( expense.PaymentType ) }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resTipoMoneda' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ expense.Currency }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resVImpuestos' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ expense.TaxValue }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resVPropina' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ expense.TipValue }</Text>
                                </View>
                                <View style={{ ...styles.dataContainer }}>
                                    <Text style={{ ...styles.infoExpense, color: colors.text, fontWeight: 'bold'}}>{ t( 'resTotalGastos' ) }:  </Text>
                                    <Text style={{ ...styles.infoExpense, color: colors.text}}>{ getTotalExpense( expense ) }</Text>
                                </View>
                                
                            </View>

                        </View>
                </Modal>

                <Modal
                    key={'supports'}
                    swipeDirection="right"
                    onSwipeComplete={ showSupports }
                    onModalHide={ () => hideMenu( false ) }
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
                                <Text style={{ 
                                    ...commonStyles.title,
                                    color: colors.primary,
                                    marginTop: 0,
                                }}>
                                    { t( 'resSoportes' ) }
                                </Text>
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
                                                        onPress={showDetail }
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

                <AwesomeAlert
                    messageStyle={{ fontSize: 15, }}
                    show={modalButtons.deleteExpense}
                    showProgress={false}
                    title="Eliminar Gasto"
                    message={ 
                        `${ t( 'resEliminarGastoPt1' ) } ${ expense.Description }${ t( 'resEliminarGastoPt2' ) }  ${ expense.ExpenseCash } ${ t( 'resEliminarGastoPt3 ' ) } ${  Moment(expense.Date ).format('ll') } ?` 
                    }
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
        </View>
    )
}


const styles = StyleSheet.create({
    dataContainer: {
        flexDirection: 'row',
        marginTop: 5
    },
    infoExpense: {
        fontSize: 15
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
    
    }
})