import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { DynamicText } from '../../components/common/DynamicText';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useFont } from '../../hooks/common/useFont';
import { FlightsContext } from '../../contexts/flights/FlightsContext';
import NumberFormat from 'react-number-format';
import { CheckBox } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';

interface Props extends StackScreenProps< RootStackParams, 'FlightFilterScreen'> {}; 

export const FlightFilterScreen = ({ navigation, route }: Props ) => {
    
    const { t } = useTranslation();
    const { theme: { colors, fieldColor, lightDark, whiteColor, secondary } } = useContext( ThemeContext );
    const { filter } = useContext( FlightsContext );
    const [filters, setFilters] = useState({
        price: ( route?.params?.type === 'price' ) ? true : false,
        scales: true,
        airlines: true
    })
    const [multiSliderValue, setMultiSliderValue] = React.useState([ filter.FilterTotalFare.TotalFareMin.Total, filter.FilterTotalFare.TotalFareMax.Total ]);
    const { semibold } = useFont();
    const multiSliderValuesChange = (values: any ) => setMultiSliderValue(values);    

    console.log( 'rilter', filter );

    const calculateScales = ( scale:number ) => {
        switch( scale ) {
            case 0:
                return t( 'resDirecto' );
            case 1:
                return `${ scale } ${ t( 'resEscala' ) }`
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                return `${ scale } ${ t( 'resEscalas' ) }`
            default:
                return t( 'resDirecto' );
        }
    }

    return (
        <>
            <Header 
                title={ t( 'resFiltrosVuelos' ) }
                subTitle={ ( route.params.type === 'single' ) ? t( 'resHorario' ) : t( 'resPrecio' ) }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faTimes }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }
                onPressLeft={ () => navigation.goBack() }
                renderRight={ () => {
                    return (
                        <ProfileNavigation color={ colors.primary } navigation={ navigation } />
                    )
                } }
            />
            <ScrollView style={{ marginBottom: 50, backgroundColor: fieldColor }}>
                <View>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <View style={[ styles.container, { backgroundColor: whiteColor }]}>
                            <DynamicText fontFamily={ semibold } style={{ fontSize: 20, color: lightDark, margin: 10 }}>{ t( 'resFiltros' ) }</DynamicText>
                        </View>
                        <View style={[ styles.container, { width: '95%', alignSelf: 'center', backgroundColor: whiteColor }]}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}
                                onPress={ () =>  setFilters({
                                    ...filters,
                                    price:  !filters.price
                                }) }
                            >
                                <DynamicText fontFamily={ semibold } style={{ fontSize: 16, color: lightDark }}>{ t( 'resPrecios' ) }</DynamicText>
                                <FontAwesomeIcon 
                                    icon={ filters.price ? faChevronUp : faChevronDown }
                                    size={ 20 }
                                    color={ lightDark }
                                />
                            </TouchableOpacity>
                            { filters.price &&
                                <View style={{ alignSelf: 'center' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <NumberFormat value={ multiSliderValue[0] } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                            renderText={
                                                value => <DynamicText style={{ fontSize: 15 }}>{ value }</DynamicText>
                                            } 
                                        />
                                        <NumberFormat value={ multiSliderValue[1] } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                            renderText={
                                                value => <DynamicText style={{ fontSize: 15 }}>{ value }</DynamicText>
                                            } 
                                        />
                                    </View>
                                    <MultiSlider
                                        selectedStyle={{
                                            backgroundColor: secondary,
                                        }}
                                        trackStyle={{
                                            height: 6,
                                            
                                        }}
                                        min={ multiSliderValue[0] }
                                        max={ multiSliderValue[1]}
                                        values={[multiSliderValue[0], multiSliderValue[1]]}
                                        sliderLength={ 330 }
                                        isMarkersSeparated={true}
                                        onValuesChange={multiSliderValuesChange}
                                        step={1}
                                        allowOverlap
                                        snapped
                                        customMarkerLeft={(e) => {
                                            return (
                                                <View style={{ width: 30, height: 30, backgroundColor: whiteColor, borderRadius: 15, borderColor: colors.primary, borderWidth: 5 }} />
                                            )
                                        }}                       
                                        customMarkerRight={(e) => {
                                            return (
                                                <View style={{ width: 30, height: 30, backgroundColor: whiteColor, borderRadius: 15, borderColor: colors.primary, borderWidth: 5 }} />
                                            )
                                        }}
                                    />
                                </View>
                            }
                        </View>

                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: whiteColor }}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}
                                onPress={ () =>  setFilters({
                                    ...filters,
                                    scales:  !filters.scales
                                }) }
                            >
                                <DynamicText fontFamily={ semibold } style={{ fontSize: 16, color: lightDark }}>{ t( 'resEscalas' ) }</DynamicText>
                                <FontAwesomeIcon 
                                    icon={ faChevronUp }
                                    size={ 20 }
                                    color={ lightDark }
                                />
                            </TouchableOpacity>
                            { filters.scales &&
                                <>
                                    <View style={{ flexDirection: 'row' }}>
                                        <CheckBox 
                                            titleProps={{ style:{ fontSize: 15, marginBottom: 5 } }}
                                            title={ t( 'resTodasEscalas' ) }
                                            fontFamily={ semibold }
                                            containerStyle={{ borderWidth: 0, backgroundColor: whiteColor }}
                                            checked={ false }
                                            /* onPress={ () => setMoreOptions({
                                                ...moreOptions,
                                                direct: !moreOptions.direct
                                            }) } */
                                            size={ 25 }
                                        />  
                                    </View>
                                    { filter.FilterConnections.map(( connections, connectionsIndex ) => {
                                        return (
                                            <View 
                                                key={ connectionsIndex }
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <CheckBox 
                                                    titleProps={{ style:{ fontSize: 15, marginBottom: 5 } }}
                                                    title={ calculateScales( connections ) }
                                                    fontFamily={ semibold }
                                                    containerStyle={{ borderWidth: 0, backgroundColor: whiteColor }}
                                                    checked={ false }
                                                    /* onPress={ () => setMoreOptions({
                                                        ...moreOptions,
                                                        direct: !moreOptions.direct
                                                    }) } */
                                                    size={ 25 }
                                                />  
                                            </View>
                                        )
                                    })

                                    }
                                </>
                            }
                        </View>

                        <View style={{ width: '95%', alignSelf: 'center', backgroundColor: whiteColor }}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}
                                onPress={ () =>  setFilters({
                                    ...filters,
                                    scales:  !filters.airlines
                                }) }
                            >
                                <DynamicText fontFamily={ semibold } style={{ fontSize: 16, color: lightDark }}>{ t( 'resAerolineas' ) }</DynamicText>
                                <FontAwesomeIcon 
                                    icon={ faChevronUp }
                                    size={ 20 }
                                    color={ lightDark }
                                />
                            </TouchableOpacity>
                            { filters.airlines &&
                                <>
                                    <View style={{ flexDirection: 'row' }}>
                                        <CheckBox 
                                            titleProps={{ style:{ fontSize: 15, marginBottom: 5 } }}
                                            title={ t( 'resTodasAerolineas' ) }
                                            fontFamily={ semibold }
                                            containerStyle={{ borderWidth: 0, backgroundColor: whiteColor }}
                                            checked={ false }
                                            /* onPress={ () => setMoreOptions({
                                                ...moreOptions,
                                                direct: !moreOptions.direct
                                            }) } */
                                            size={ 25 }
                                        />  
                                    </View>
                                    { filter.FilterAirlines.ValidatingCarriers.map(( airline, airlineIndex ) => {
                                        return (
                                            <View 
                                                key={ airlineIndex }
                                                style={{ flexDirection: 'row' }}
                                            >
                                                <CheckBox 
                                                    fontFamily={ semibold }
                                                    containerStyle={{ width: 0 }}
                                                    checked={ false }
                                                    /* onPress={ () => setMoreOptions({
                                                        ...moreOptions,
                                                        direct: !moreOptions.direct
                                                    }) } */
                                                    size={ 25 }
                                                />  
                                                <Animatable.Image 
                                                    animation="bounceIn"
                                                    duration={ 1500 }
                                                    source={{ uri: `https://ltn.xnet.travel/Images/Airlines/${ airline }.png` }}
                                                    style={{ width: 25, height: 25, marginTop: 15, marginLeft: 5 }}
                                                    resizeMode="stretch"
                                                />
                                            </View>
                                        )
                                    })

                                    }
                                </>
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        borderBottomWidth: .5,
        width: '95%', 
        alignSelf: 'center', 
    }
})