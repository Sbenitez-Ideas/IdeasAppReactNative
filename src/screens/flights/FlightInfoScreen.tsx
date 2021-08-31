import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useRef } from 'react'
import { StatusBar, View } from 'react-native'
import { RootStackParams } from '../../navigator/Navigator'
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { Header } from '../../components/common/Header';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { DynamicText } from '../../components/common/DynamicText';
import { useFont } from '../../hooks/common/useFont';
import { FlightPricingSegment } from './FlightPricingSegment';
import { ScrollView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';


interface Props extends StackScreenProps<RootStackParams, 'FlightInfoScreen'> {}; 

export const FlightInfoScreen = ( { navigation, route }: Props ) => {
    const { theme: { colors, fieldColor, whiteColor, lightDark } } = useContext( ThemeContext );
    const { t } = useTranslation();
    const { semibold } = useFont();
    const refFlights = useRef(null);
    const onCapture = () => {
        captureRef(refFlights, {
            format: "jpg",
            quality: 0.9,
            result: 'data-uri'
        }).then(
            uri => Share.open({ title: 'itinerario', url: uri }),
            error => console.log("snapshot failed", error)
        );
    }

    return (
        <>
            <StatusBar backgroundColor={ colors.primary } barStyle="light-content"/>
            <Header 
                title={ t( 'flights' ) }
                onPressLeft={ () => {
                    navigation.goBack()
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faArrowLeft }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }

                onPressRight={ () => {
                    onCapture()
                } }
                renderRight={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faShareAlt }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                }}
            />
            <ScrollView ref={ refFlights } style={{ width:'100%', alignSelf:'center', backgroundColor: fieldColor, flex: 1, marginBottom: 50 }}>
                <View style={{ margin: 15 }}>
                    <DynamicText fontFamily={ semibold } headline header style={{ fontSize: 20, color: lightDark }}>{ t( 'resDetalleVuelo' ) }</DynamicText>
                </View>

                <View >
                    <FlightPricingSegment segment={ route?.params?.data.segment } airports={ route?.params?.data.airports } showRules={ false } />
                </View>
            </ScrollView>
        </>
    )
}
