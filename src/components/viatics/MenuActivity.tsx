import React, { useContext, useEffect, useState } from 'react'
import { Button, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Col, Grid } from 'react-native-easy-grid'
import Icon from 'react-native-vector-icons/Ionicons'
import { ThemeContext } from '../../contexts/theme/ThemeContext'
import { activitiesStyles } from '../../styles/activitiesStyles'
import Modal from 'react-native-modal';
import { commonStyles } from '../../styles/commonStyles'
import LinearGradient from 'react-native-linear-gradient'
import { useForm } from '../../hooks/common/useForm'
import { ExpenseGroupsEmail } from '../../classes/viatics/ExpensesGroupsEmail'
import { GActivities } from '../../interfaces/viatics/GActivities';
import { ExpenseGroupRQ } from '../../interfaces/viatics/ExpenseGroupRQ';
import { AuthContext } from '../../contexts/auth/AuthContext'
import { viaticsApi } from '../../api/viaticsApi'
import { Establishment } from '../../classes/viatics/Establishment';
import { ExpenseEstablishmentRQ } from '../../classes/viatics/ExpenseEstablishmentRQ'
import { ExpenseGroupRS } from '../../interfaces/viatics/ExpenseGroupRS';
import { ActivityIndicator } from 'react-native-paper'
import { GExpenses } from '../../interfaces/viatics/GExpenses'
import { ExpensesSaveRQ } from '../../interfaces/viatics/ExpensesSaveRQ';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import { ChangeState } from './ChangeState'
import { useTranslation } from 'react-i18next';
import { CategoriesEntity } from '../../classes/viatics/CategoriesEntity'
import { ExpenseCategories } from '../../classes/viatics/ExpenseCategories';


interface Props {
    activitie: GActivities;
    expenses: GExpenses[];
    isSentEmail: ( sent: boolean ) => void;
    isSendLegalized: ( legalized: boolean ) => void;
    hideMenu: ( show: boolean ) => void;
    
}

export const MenuActivity = ({ activitie, isSentEmail, expenses, isSendLegalized, hideMenu }: Props) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { width } = Dimensions.get('window');
    const { userData, } = useContext( AuthContext );
    const { theme: { colors, secondary, buttonText } } = useContext( ThemeContext );
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [sentEmail, setSentEmail] = useState(false);
    const [sendLegalized, setSendLegalized] = useState(false);
    const [categoriesList, setCategoriesList] = useState<ExpenseCategories[]>( [] );
    const [status, setStatus] = useState('');
    const [expensesSelected, setExpensesSelected] = useState<GExpenses[]>([]);
    const [expenseGroups, setExpenseGroups] = useState<ExpenseGroupRS>( new ExpenseGroupRS )
    const [showChangeState, setShowChangeState] = useState(false);
    const { email, onChange } = useForm({
        email: '',
     });
    const [modalButtons, setModalButtons] = useState({
        sendEmail: false,
        sendToLegalize: false
    })

    const { findExpenseGroups, getEstablishments, sendEmailGroups, saveExpenses, getCategories } = viaticsApi();


    const onSend = async() => {
        setSentEmail(true);
        const request = new ExpenseGroupRQ();
        request.IDGroup = activitie.IDGroup;
        request.IDEntity = userData.IDEntityDefault;
        request.IDUser = userData.IDUser;
        request.excludeImages = false;
        await getDataEstablishments( request.IDEntity );
        await findExpenseGroups( request )
            .then(( response ) => {
                sendEmail( response);
            })
    }

    const sendEmail  = async( response: ExpenseGroupRS ) => {
        setExpenseGroups( response );
        const request = new ExpenseGroupsEmail();
        const group  = expenseGroups.ExpenseGroup;
        request.ListGroups = [];
        request.ListGroups.push( response.ExpenseGroup[0].group );
        request.EmailTo = userData.Email;
        request.ListEstablishment = establishments;
        request.SendCopyTo = email;
        request.Subject = 'Recordatorio de actividad y gastos';
        request.RequestType = 0;
        await sendEmailGroups( request )
            .then(( response ) => {
                if (response.Success) {
                    setSentEmail(false);
                    setModalButtons({
                        ...modalButtons,
                        sendEmail: !modalButtons.sendEmail
                    })
                    isSentEmail( response.Success );
                }
                else {
                    isSentEmail( false );
                }
            })
    }

    useEffect(() => {
        const request = new  CategoriesEntity();
        request.IDEntity = userData.IDEntityDefault;
        getCategories( request )
            .then(( response ) => {
                setCategoriesList( response );
            })
        setExpensesSelected( expenses );
    }, [])

    const getDataEstablishments = async( idEntity: number ) => {
        const request = new ExpenseEstablishmentRQ();
        request.IDEntity = idEntity;
        request.Take = 20;
        request.Skip = 0;
        await getEstablishments( request )
            .then(( response ) => {
                setEstablishments( response );
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
        if ( expensesSelected.length > 0 ) {
            let cleanSelected = expenses.filter(row => {
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
                setExpensesSelected( cleanSelected );
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

    const validateJustify = (): boolean => {
        let canChangeState: boolean = false;
        let expensesCount: number = 0;
        if (status === 'J') {
            expensesSelected.map(row => {
                if (row.LegalizeNote === '' || row.LegalizeNote === undefined) {
                    canChangeState = false;
                    Toast.show({
                        text1: 'Error',
                        text2: t( 'resNoHaLlenadoNotaAprobador' ),
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
            request.IDUserApprover = activitie.IDApproverUser;
            request.Data.forEach(row =>{
                row.State = status
            });

            saveExpenses( request )
                .then(( response ) => {
                    if (response.Success) {
                        setSendLegalized( false );
                        setModalButtons({
                            ...modalButtons,
                            sendToLegalize: !modalButtons.sendToLegalize
                        })
                        isSendLegalized( response.Success )
                    } else {
                        isSendLegalized( false );
                    }
                    hideMenu( false );
                    setExpensesSelected([]);
                })
        }
    }

    const handleChangeState = () => {
        setShowChangeState( !showChangeState );
    }

    const approveNote = ( value: string, id: number ) => {
        const tempData = expensesSelected;
        tempData[ id ].LegalizeNote = value;
        setExpensesSelected( tempData );
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
                left: getDimension(), 
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }}>
                <Grid style={{ flex: 1 }}>
                    <View>
                        <Col>
                            <TouchableOpacity 
                                disabled={  userData.Params.CREARACTIAUTOMAAPP === 'S' ? false : true }
                                onPress={ () => navigation.navigate('RegisterActivityScreen') }
                                style={{ 
                                    ...activitiesStyles.menuItem, 
                                    borderTopColor: 'transparent' , 
                                    borderLeftColor: 'transparent', 
                                    borderBottomColor: buttonText, 
                                    borderRightColor: buttonText
                                }}
                            >
                                <Icon
                                    style={{ left: 10, }}
                                    name="add-circle"
                                    color={ buttonText }
                                    size={ 30 }
                                />
                                <Text style={{ color: buttonText, flex: 1, flexWrap: 'wrap', textAlign: 'center'}}>{ t( 'resAdicionarViatico' ) }</Text>    
                            </TouchableOpacity>
                                                                    
                            
                            <TouchableOpacity 
                                disabled={  userData.Params.CREARACTIAUTOMAAPP === 'S' ? false : true }
                                onPress={ () => navigation.navigate('RegisterActivityScreen',  {
                                    activity: activitie,
                                    type: 'edit'
                                }) }
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
                                    name="create"
                                    color={ buttonText }
                                    size={ 30 }
                                />
                                <Text style={{ color: buttonText, flex: 1, flexWrap: 'wrap', textAlign: 'center'}}>{ t( 'resEditarViatico' ) }</Text>    
                            </TouchableOpacity>
                            
                        </Col>
                    </View>
                    <View>
                        <Col>
                            <TouchableOpacity
                                onPress={ () => sendLegalize( 'R' ) }
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
                                    name="send"
                                    color={ buttonText }
                                    size={ 30 }
                                />
                                <Text style={{color: buttonText, flex: 1, flexWrap: 'wrap', textAlign: 'center'}}>{ t( 'resEnviarLegalizar' ) }</Text>    
                            </TouchableOpacity>
                                                                    
                            
                            <TouchableOpacity
                                onPress={ () => setModalButtons({
                                    ...modalButtons,
                                    sendEmail: !modalButtons.sendEmail
                                }) }
                                style={{
                                    ...activitiesStyles.menuItem, 
                                    borderTopColor: 'transparent', 
                                    borderBottomColor: 'transparent', 
                                    borderLeftColor: 'transparent', 
                                    borderRightColor: 'transparent'
                            }}>
                                <Icon
                                    style={{ left: 10 }}
                                    name="mail-outline"
                                    color={ buttonText }
                                    size={ 30 }
                                />
                                <Text style={{color: buttonText,  flex: 1, flexWrap: 'wrap', textAlign: 'center'}}>{ t( 'resEnviarEmail' ) }</Text>    
                            </TouchableOpacity>
                        </Col>
                    </View>
                </Grid>

                <Modal
                    swipeDirection="right"
                    onSwipeComplete={() => setModalButtons({
                        ...modalButtons,
                        sendEmail: !modalButtons.sendEmail
                    })}
                    style={{ alignItems: 'center'}} isVisible={modalButtons.sendEmail}>
                        <View style={{ borderRadius: 10, width: width, height: 210, backgroundColor: colors.background}}>
                            <View style={ commonStyles.rightButtonContainer }>
                                <Icon
                                    onPress={ () => setModalButtons({
                                        ...modalButtons,
                                        sendEmail: !modalButtons.sendEmail
                                    }) }
                                    name="close-circle"
                                    color={ colors.primary }
                                    size={ 30}
                                />
                            </View>
                            <View style={{ marginLeft: 10, marginBottom: 20 }}>
                                <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>{ t( 'resEscribaCorreo' ) }</Text>
                                <TextInput 
                                    placeholderTextColor="#666666"
                                    underlineColorAndroid={ colors.primary }
                                    style={{ ...commonStyles.textInput, fontSize: 20,  marginTop: 8}}
                                    placeholder="email@email.com"
                                    onChangeText={ ( value ) => onChange( value, 'email' ) }
                                    value={ email }
                                />
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={ onSend }
                                    style={{ borderRadius: 40 }}>
                                    <LinearGradient
                                        colors={[colors.primary, secondary]}
                                        style={{ 
                                            ...commonStyles.rightButton,
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Text style={{ ...commonStyles.buttonText, color: buttonText }}>{ t( 'resEnviar' ) }</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            { sentEmail ?
                                <ActivityIndicator
                                    style={{ marginTop: 5 }}
                                    size="small"
                                    animating={ true }
                                    color={ colors.primary }
                                ></ActivityIndicator>

                                : null
                            }
                        </View>
                </Modal>
                
                <ChangeState  show={ showChangeState } isSendLegalized={ isSendLegalized  }  idApprover={ activitie.IDApproverUser }  status={ status }  expensesSelected={ expenses }  showHandle={ handleChangeState } />
        </View>
    )
}