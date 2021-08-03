import React, { useContext, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { commonStyles } from '../../styles/commonStyles'
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from '../../components/common/DynamicText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronCircleDown, faChevronCircleUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useFont } from '../../hooks/common/useFont';
import { ApproverBooking } from '../../model/classes/corporate/ApproverBooking';
import { ApproverListRQ } from '../../model/classes/corporate/ApproverListRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { corporateApi } from '../../api/corporateApi';
import { ApproverListRS } from '../../model/classes/corporate/ApproverListRS';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    approvers: ApproverBooking[];
}

export const ApproversScreen = ({ approvers }: Props) => {
    const [showApprovers, setShowApprovers] = useState(false);
    const { getApproverList } = corporateApi();
    const { userData } = useContext( AuthContext );
    const [approverList, setApproverList] = useState<string[]>( [] )
    const { theme: { colors, whiteColor, buttonText, grayColor, fieldColor, accent} } = useContext( ThemeContext );
    const [showApproverInfo, setShowApproverInfo] = useState({
        show: false,
        index: -1
    });
    const { semibold, bold } = useFont();

    useEffect(() => {
        setApproverList( [] );
        const request = new ApproverListRQ();
        request.IDEntity = userData.IDEntityDefault;
        getApproverList( request )
            .then(( response ) => {
                    approvers.forEach(( approverParent ) => {
                        response.forEach(( approver ) => {{
                            if ( approverParent.IDApproverUser.toString() === approver.UserCode ) {
                                console.log( 'approver', approverParent );
                                setApproverList( approverList => [ ...approverList, approver.UserFullName ]  );
                            }
                        }})
                    })
                
                
            })

    }, [])

    const showInfo = () => {
        setShowApproverInfo({
            ...showApproverInfo,
            show: !showApproverInfo.show,
        })
    }

    return (
        <View style={[ commonStyles.reviewContainer, { backgroundColor: accent } ]}>
            <TouchableOpacity
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                onPress={ () => setShowApprovers( !showApprovers ) }
            >
                <DynamicText fontFamily={ bold } style={{ fontSize: 20, color: colors.primary, marginHorizontal: 10, marginVertical: 5 }}>{ 'Aprobadores' }</DynamicText>
                <FontAwesomeIcon
                    style={{ marginHorizontal: 10, marginVertical: 5  }}
                    icon={ ( !showApprovers ) ? faChevronCircleUp : faChevronCircleDown }
                    size={ 20 }
                    color={ colors.primary }
                />
            </TouchableOpacity>

            { showApprovers &&
                <View style={{ width: '95%', backgroundColor: fieldColor, alignSelf: 'center', borderRadius: 5 }}>
                    {
                        approverList.map(( approver, index ) => {
                            return (
                                <View key={ index }>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <DynamicText fontFamily={ semibold } style={{ margin: 10, color: colors.primary }}> NOMBRE </DynamicText>
                                        <DynamicText fontFamily={ semibold } style={{ margin: 10, color: colors.primary }}> ESTADO </DynamicText>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <DynamicText fontFamily={ semibold } style={{ margin: 10 }}> { approver } </DynamicText>
                                        <View style={{ flexDirection: 'row' }}>
                                            <DynamicText fontFamily={ semibold } style={{ margin: 10 }}> 
                                                { approvers[index].IDStatusCorporate === 0 ? 'Pendiente  ' : 'Aprobado  ' } 
                                            </DynamicText>
                                            <TouchableOpacity   
                                                style={{ marginTop: 10, marginRight: 10 }}
                                                onPress={ () => setShowApproverInfo({
                                                    ...showApproverInfo,
                                                    show: !showApproverInfo.show,
                                                    index: index
                                                }) }
                                            >
                                                <FontAwesomeIcon
                                                    icon={ faInfoCircle }
                                                    size={ 15 }
                                                    style={{ color: colors.primary }}
                                                />
                                            </TouchableOpacity>
                                            
                                        </View>
                                        
                                    </View>
                                </View>
                                
                            )
                            
                        })
                    }
                </View>
            }

            { showApproverInfo.show &&
                <Modal
                    key={'detail'}
                    swipeDirection="right"
                    onSwipeComplete={ showInfo }
                    /* onModalHide={ () => hideMenu( false ) } */
                    style={{ alignItems: 'center'}} isVisible={ showApproverInfo.show }>
                        <View style={{ borderRadius: 10, width: 300, height: 330, backgroundColor: colors.background}}>
                            <View style={ commonStyles.rightButtonContainer }>
                                <Icon
                                    onPress={ showInfo }
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
                                    Aprobador
                                </DynamicText>
                                <DynamicText style={{ 
                                    ...commonStyles.title,
                                    color: colors.primary,
                                    marginTop: 0,
                                    marginBottom: 10,
                                    fontSize: 15
                                }}>
                                   { approverList[showApproverInfo.index] } 
                                </DynamicText>
                                <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.text }}>Estado  </DynamicText>
                                <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ approvers[showApproverInfo.index].IDStatusCorporate === 0 ? 'Pendiente  ' : 'Aprobado  ' } </DynamicText>
                                <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.text }}>Secuencia  </DynamicText>
                                <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ approvers[showApproverInfo.index].Sequence }</DynamicText>
                                <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.text }}>Notificado  </DynamicText>
                                <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ approvers[showApproverInfo.index].EmailSent ? 'SI' : 'NO' }</DynamicText>
                                <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.text }}>E-mail Notificado  </DynamicText>
                                <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ approvers[showApproverInfo.index].EmailTo }</DynamicText>
                                <DynamicText fontFamily={ semibold } style={{ ...commonStyles.infoExpense, color: colors.text }}>Fecha Notificación  </DynamicText>
                                <DynamicText style={{ ...commonStyles.infoExpense, color: colors.text}}>{ approvers[showApproverInfo.index].EmailTo }</DynamicText>
                            </View>

                        </View>
                </Modal>
            }
                
        </View>
    )
}
