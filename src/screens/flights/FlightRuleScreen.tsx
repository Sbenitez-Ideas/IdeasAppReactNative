import React, { useContext, useEffect, useState } from 'react'
import { FareRule } from '../../model/classes/flights/pricing/FareRule'
import Modal from 'react-native-modal';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles } from '../../styles/commonStyles';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { DynamicText } from '../../components/common/DynamicText';
import * as Animatable from 'react-native-animatable';
import { useFont } from '../../hooks/common/useFont';
import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';
import { ScrollView } from 'react-native-gesture-handler';


interface Props {
    rule: FareRule[],
    carrier: string,
    setShowModal: () =>  void;
}


export const FlightRuleScreen = ( { rule, carrier, setShowModal }: Props) => {
    const { semibold, bold } = useFont();
    const { theme: { colors, accent, lightDark } } = useContext( ThemeContext );
    const [showContainer, setShowContainer] = useState( true );
    useEffect(() => {
        if ( rule && rule.length > 0 ) {
            if ( rule[0].RuleText && rule[0].RuleText.length > 0 ) {
                if (rule[0].RuleText[0].Text.includes('https://') || rule[0].RuleText[0].Text.includes('http://') ) {
                  /* setShowRule( true ); */
                }
            }
        }

    }, [])

    const showRules = () => {
        setShowContainer( !showContainer );
        setShowModal();
    }

    return (
        <>
            <Modal
                key={'detail'}
                swipeDirection="right"
                onSwipeComplete={ showRules }
                style={{ alignItems: 'center'}} isVisible={ showContainer }
            >
                <ScrollView style={{ borderRadius: 10, width: 380, height: 430, backgroundColor: colors.background}}>
                    <View style={ commonStyles.rightButtonContainer }>
                        <Icon
                            onPress={ showRules }
                            name="close-circle"
                            color={ colors.primary }
                            size={ 30}
                        />
                    </View>
                    { rule.map(( concept, index ) => {
                        return (
                            <View key={ index }>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 30 }}>
                                    <View style={{ flexDirection: 'row', paddingTop: 10  }}>
                                        <Animatable.Image 
                                            animation="bounceIn"
                                            duration={ 1500 }
                                            source={{ uri: `https://ltn.xnet.travel/Images/Airlines/${carrier}.png` }}
                                            style={commonStyles.airlineImage}
                                            resizeMode="stretch"
                                        />
                                        <DynamicText fontFamily={ bold } style={{ margin: 3, color: lightDark, fontSize: 15 }}>{ ( carrier ) === '4C' ? 'LA' : carrier }</DynamicText>
                                    </View>
                                    <View style={{ flexDirection: 'row', backgroundColor: accent, padding: 10, borderRadius: 5 }}>
                                        <DynamicText fontFamily={ semibold } style={[ styles.text, { color: colors.primary } ]}>{ concept.DepartureAirport }</DynamicText>
                                        <DynamicText fontFamily={ semibold } style={[ styles.text, { color: colors.primary } ]}>{ concept.ArrivalAirport }</DynamicText>
                                    </View>
                                </View>
                                {
                                    concept.RuleText.map(( rul, indexRul ) => {
                                        return (
                                            <View key={ indexRul } style={ styles.Html }>
                                                { rul.Title !== '' &&
                                                    <View style={{ backgroundColor: accent, padding: 10, borderRadius: 5 }}>
                                                        <DynamicText fontFamily={ bold } style={{ color: colors.primary, fontSize: 15 }}>{ rul.Title }</DynamicText>
                                                    </View>
                                                }
                                                <HTMLView value={ rul.Text }/>
                                            </View>
                                        )
                                    })
                                } 
                            </View>
                        )
                    })}
                </ScrollView>
            </Modal>
            
            
        </>
    )
}


const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        marginRight: 5
    },
    Html: {
        margin: 10
    }
})