import React, { useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity } from 'react-native';
import { FilledInputText } from './FilledInputText'
import { AuthContext } from '../../contexts/auth/AuthContext';
import { TravelerCorporate } from '../../model/classes/corporate/TravelerCorporate';
import { Information } from './Information';
import { navigate } from '../../navigator/RootNavigation';
import { useNavigation } from '@react-navigation/core';
import { ApproverListRS } from '../../model/classes/corporate/ApproverListRS';


interface Props  {
    approver: ApproverListRS
}

export const Approver = ({ approver }: Props) => {
    const authContext = useContext( AuthContext );
    const navigation = useNavigation();
    const [currentPassenger, setCurrentPassenger] = useState<TravelerCorporate>( authContext.selectedTravelers[0] );
    const [approverName, setApproverName] = useState('');


    useEffect(() => {
        if (authContext.selectedTravelers.length > 0) {
            setCurrentPassenger(authContext.selectedTravelers[0])
        }
    }, [authContext.selectedTravelers])

    useEffect(() => {
        if ( currentPassenger?.IDUser ) {
            calculateApprover();
        }
    }, [currentPassenger])


    useEffect(() => {
        if( approver.UserCode !== undefined ) {
            setApproverName( approver.UserFullName );
            authContext.assignApprover( { approverName: approver.UserFullName, idApprover: parseInt(approver.UserCode)  }  )
        }
    }, [approver.UserCode])


    const showInformation = () => {
        return (
            <Information  type={ 'approver' } title={ '¡Información!' } />
        )
    }

    const calculateApprover = (): void  => {
        if ( currentPassenger?.IDUser !== undefined ) {
            if ( currentPassenger.Approver1 !== '' ) {
                setApproverName(currentPassenger.Approver1);
            } else if ( currentPassenger.Approver2 !== '' ) {
                setApproverName(currentPassenger.Approver2);
            } else if ( currentPassenger.Approver3 !== '' ) {
                setApproverName(currentPassenger.Approver3);
            } else if ( currentPassenger.Approver4 !== '' ) {
                setApproverName(currentPassenger.Approver4);
            } else {
                showInformation();
            }
        }
    }

    const openApprovers = () => {
        navigation.navigate( 'AutoCompleteSearch', {
            type: 'Approvers',
            screen: 'RequestServices'
        } )
    }

    return (
        <View>
            <TouchableOpacity onPress={ () => openApprovers() }>
                <FilledInputText 
                    disabled={ true }
                    label={ 'Aprobador' }
                    value={  approverName }  
                />  
            </TouchableOpacity>
            
        </View>
    )
}

