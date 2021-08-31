import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { TripReasonRQ } from '../../model/classes/corporate/TripReasonRQ'
import { DynamicText } from './DynamicText'
import { FilledInputText } from './FilledInputText'
import { AuthContext } from '../../contexts/auth/AuthContext';
import { corporateApi } from '../../api/corporateApi';
import Modal from 'react-native-modal';
import { commonStyles } from '../../styles/commonStyles'
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'

export const TravelMotive = () => {
    const { t } = useTranslation()
    const { userData, assignMotive } = useContext( AuthContext );
    const { getTripReasons } = corporateApi();
    const [motives, setMotives] = useState<{ display: string, value: string }[]>([]);
    const { theme: { colors } } = useContext( ThemeContext );
    const [motiveSelected, setMotiveSelected] = useState({
        ID: '',
        Text: ''
    });
    const [showMotives, setShowMotives] = useState({
        show: false
    })

    useEffect(() => {

        const request = new TripReasonRQ();
        request.EntityId = userData.IDEntityDefault.toString();
        getTripReasons( request )
            .then(( response ) => {
                if ( response.length > 0 ) {
                    const motive = response;
                    setMotives( motive.map( mot =>  {
                        return { value: mot.ID, display: mot.Name }
                    }) )
                }
            })
    }, [])


    const showModalMotives = () => {
        setShowMotives({
            ...showMotives,
            show: !showMotives.show
        })
    }

    const motiveChanged = ( index: number ) => {
        setMotiveSelected({
            ...motiveSelected,
            ID: motives[ index ].value,
            Text: motives[ index ].display
        });
        assignMotive({ ID: motiveSelected.ID, Text: motives[ index ].display });
        setShowMotives({
            ...showMotives,
            show: !showMotives.show
        })
    }

    return (
        <View>
            <Modal
                swipeDirection="right"
                onSwipeComplete={ () => showModalMotives() }
                style={{ alignItems: 'center'}} isVisible={ showMotives.show }
            >
                <View style={{ borderRadius: 10, width: 300, height: 330, backgroundColor: colors.background}}>
                    <View style={ commonStyles.rightButtonContainer }>
                        <Icon
                            onPress={ showModalMotives }
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
                            { t( 'resMotivoViaje' ) }
                        </DynamicText>
                        <ScrollView style={{ height: '80%' }}>
                            {
                                motives.map(( motive, index ) => {
                                    return (
                                        <TouchableOpacity 
                                            key={ index } 
                                            style={{ margin: 6 }}
                                            onPress={ () => motiveChanged( index ) }
                                        >
                                            <DynamicText style={{ fontSize: 20 }}>{ motive.display }</DynamicText>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View> 
                </View> 
            </Modal>
            <TouchableOpacity onPress={ () => setShowMotives({
                ...showMotives,
                show: !showMotives.show
            })}>
                <FilledInputText 
                    disabled={ true }
                    label={ t( 'resMotivoViaje' ) }
                    value={  motiveSelected.Text }  
                />  
            </TouchableOpacity>
            
        </View>
    )
}
