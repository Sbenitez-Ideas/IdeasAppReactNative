import React, { useContext, useState } from 'react'
import { FloatingMenu } from 'react-native-floating-action-menu'
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronCircleDown, faDolly, faEdit, faEllipsisV, faPaperPlane, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { GActivities } from '../../model/interfaces/viatics/GActivities';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { ActivityIndicator, Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { commonStyles } from '../../styles/commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { DynamicText } from '../common/DynamicText';
import LinearGradient from 'react-native-linear-gradient';
import { useForm } from '../../hooks/common/useForm';
import { ExpenseGroupRQ } from '../../model/interfaces/viatics/ExpenseGroupRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { ExpenseEstablishmentRQ } from '../../model/classes/viatics/ExpenseEstablishmentRQ';
import { Establishment } from '../../model/classes/viatics/Establishment';
import { viaticsApi } from '../../api/viaticsApi';
import { ExpenseGroupRS } from '../../model/interfaces/viatics/ExpenseGroupRS';
import { ExpenseGroupsEmail } from '../../model/classes/viatics/ExpensesGroupsEmail';

interface Props {
    activity: GActivities;
    navigation: StackNavigationProp<RootStackParams, "ActivitiesListScreen">
    isSentEmail: ( sent: boolean ) => void;
}

export const FloatMenuActivity = ({ activity, navigation, isSentEmail}: Props) => {
    const { userData, } = useContext( AuthContext );
    const { theme: { colors, fieldColor, secondary, buttonText } } = useContext( ThemeContext );
    const { width } = Dimensions.get('window');
    const { email, onChange } = useForm({
        email: '',
    });
    const [modalButtons, setModalButtons] = useState({
        sendEmail: false,
        sendToLegalize: false
    })
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [expenseGroups, setExpenseGroups] = useState<ExpenseGroupRS>( new ExpenseGroupRS );
    const [sentEmail, setSentEmail] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const { t } = useTranslation();
    const items = [
        { 
            label: t( 'resAdicionarViatico' ), 
            labelStyle: styles.labelMenu, 
            fa: faPlusCircle, 
            onPress: () => navigation.navigate('RegisterActivityScreen', {}),
            isDisabled: userData.Params.CREARACTIAUTOMAAPP === 'S' ? false : true
        },
        { 
            label: t( 'resEditarViatico' ), 
            labelStyle: styles.labelMenu, 
            fa: faEdit, 
            onPress: () => navigation.navigate('RegisterActivityScreen',  {
                activity: activity,
                type: 'edit'
            }),
            isDisabled: userData.Params.CREARACTIAUTOMAAPP === 'S' ? false : true
        },
        { 
            label: t( 'resEnviarEmail' ), 
            labelStyle: styles.labelMenu, 
            fa: faPaperPlane, 
            onPress: () => setModalButtons({
                ...modalButtons,
                sendEmail: !modalButtons.sendEmail
            })
        },
    ]
    const { findExpenseGroups, getEstablishments, sendEmailGroups } = viaticsApi();
    const handleMenuToggle = () => {
        setShowItems( !showItems )
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

    const onSend = async() => {
        setSentEmail(true);
        const request = new ExpenseGroupRQ();
        request.IDGroup = activity.IDGroup;
        request.IDEntity = userData.IDEntityDefault;
        request.IDUser = userData.IDUser;
        request.excludeImages = false;
        await getDataEstablishments( request.IDEntity );
        await findExpenseGroups( request )
            .then(( response ) => {
                sendEmail( response);
            })
    }

    

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
    return (
        <>
            <FloatingMenu
                bottom={ 60 }
                right={ 10 }
                items={items}
                isOpen={ showItems }
                onMenuToggle={ handleMenuToggle }
                borderColor={ colors.primary }
                primaryColor={ fieldColor }
                renderMenuIcon={ () => { return (
                    <FontAwesomeIcon
                        icon={ faEllipsisV }
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
                swipeDirection="right"
                onSwipeComplete={() => setModalButtons({
                    ...modalButtons,
                    sendEmail: !modalButtons.sendEmail
                })}
                style={{ alignItems: 'center'}} isVisible={modalButtons.sendEmail}>
                    <View style={{ borderRadius: 10, width: width * 0.95, height: 200, backgroundColor: colors.background}}>
                        <TouchableOpacity style={ commonStyles.rightButtonContainer }
                            onPress={ () => setModalButtons({
                                ...modalButtons,
                                sendEmail: !modalButtons.sendEmail
                            }) }
                        >
                            <Icon
                                name="close-circle"
                                color={ colors.primary }
                                size={ 30}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10, marginBottom: 20 }}>
                            <DynamicText headline black style={{ marginLeft: 5 }}>{ t( 'resEscribaCorreo' ) }</DynamicText>
                            <TextInput 
                                placeholderTextColor="#666666"
                                underlineColorAndroid={ colors.primary }
                                style={{ ...commonStyles.textInput, fontSize: 18,  marginTop: 8, fontFamily: 'Raleway-Regular'}}
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
                                        height: 40,
                                        flexDirection: 'row'
                                    }}
                                >
                                    <DynamicText style={{ ...commonStyles.buttonText, color: buttonText }}>{ t( 'resEnviar' ) }</DynamicText>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        { 
                            sentEmail ?
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
        </>
    )
}


const styles = StyleSheet.create({
    labelMenu: {
        fontSize: 13, 
        fontFamily: 'Raleway-Regular', 
        fontWeight: '900'
    }
})
