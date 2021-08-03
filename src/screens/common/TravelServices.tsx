import React, { useContext, useEffect, useState } from 'react'
import { Switch, View } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface Props {
    selectServices:  ( 
        services: { 
        flights: boolean,
        hotels: boolean,
        viatics: boolean,
        cars: boolean } ) => void;
}

export const TravelServices = ( { selectServices }: Props) => {
    const { t } = useTranslation();
    const { theme: { colors, grayColor, accent, secondary } } = useContext( ThemeContext );
    const [switchServices, setSwitchServices] = useState({
        flights: false,
        hotels: false,
        viatics: false,
        cars: false
    })


    useEffect(() => {
        
        selectServices( switchServices );

    }, [switchServices])

    return (
        <View>
            <View style={{ backgroundColor: accent, alignItems: 'center', padding: 10, marginTop: 25  }}>
                <DynamicText style={{ fontSize: 16 }}>Selecciona tus servicios de viaje</DynamicText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
                <View style={{ width: '15%' }}>
                    <Switch
                        trackColor={{ false: '#ECECEC', true: secondary }}
                        thumbColor={( switchServices.flights  ? colors.primary : "#ECECEC" )}
                        onValueChange={(value) => {
                            setSwitchServices({
                                ...switchServices,
                                flights: value
                            })
                        }}
                        value={ switchServices.flights }
                    ></Switch>
                </View>
                <View style={{ width: '90%' }}>
                    <DynamicText style={{ fontSize: 18 }}> { t( 'flights' ) } </DynamicText>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
                <View style={{ width: '15%' }}>
                    <Switch
                        trackColor={{ false: '#ECECEC', true: secondary }}
                        thumbColor={switchServices.hotels  ? colors.primary : "#ECECEC"}
                        onValueChange={(value) => {
                            setSwitchServices({
                                ...switchServices,
                                hotels: value
                            })
                        }}
                        value={ switchServices.hotels }
                    ></Switch>
                </View>
                <View style={{ width: '90%' }}>
                    <DynamicText style={{ fontSize: 18 }}> { t( 'hotels' ) } </DynamicText>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
                <View style={{ width: '15%' }}>
                    <Switch
                        trackColor={{ false: '#ECECEC', true: secondary }}
                        thumbColor={switchServices.viatics ? colors.primary : "#ECECEC" }
                        onValueChange={(value) => {
                            setSwitchServices({
                                ...switchServices,
                                viatics: value
                            })
                        }}
                        value={ switchServices.viatics }
                    ></Switch>
                </View>
                <View style={{ width: '90%' }}>
                    <DynamicText style={{ fontSize: 18 }}> { t( 'viatics' ) } </DynamicText>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 25}}>
                <View style={{ width: '15%' }}>
                    <Switch
                        trackColor={{ false: '#ECECEC', true: secondary }}
                        thumbColor={switchServices.cars  ? colors.primary : "#ECECEC"}
                        onValueChange={(value) => {
                            setSwitchServices({
                                ...switchServices,
                                cars: value
                            })
                        }}
                        value={ switchServices.cars }
                    ></Switch>
                </View>
                <View style={{ width: '90%' }}>
                    <DynamicText style={{ fontSize: 18 }}> { t( 'cars' ) } </DynamicText>
                </View>
            </View>
        </View>
    )
}
