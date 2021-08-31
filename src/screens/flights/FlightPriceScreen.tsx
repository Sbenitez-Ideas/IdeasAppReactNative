import React, { useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Recommendation } from '../../model/classes/availability/bussiness-objects/Recommendation'
import { AvailabilityByPriceRS } from '../../model/classes/availability/envelopes/AvailabilityByPriceRS'
import { AvailabilityRQ } from '../../model/classes/availability/envelopes/AvailabilityRQ'
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { useFont } from '../../hooks/common/useFont';
import { ScrollView } from 'react-native-gesture-handler';
import { DynamicText } from '../../components/common/DynamicText'
import NumberFormat from 'react-number-format'
import { color } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { loginStyles } from '../../styles/loginStyles';
import { useTranslation } from 'react-i18next';
import { Segment } from '../../model/classes/flights/business-objects/Segment';
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import { SegmentSelected } from '../../model/classes/flights/SegmentSelected';
import Toast from 'react-native-toast-message';
import { flightsApi } from '../../api/flightsApi';
import { FlightsContext } from '../../contexts/flights/FlightsContext';
import { useNavigation } from '@react-navigation/core';
import { FlightRecommendationScreen } from './FlightRecommendationScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles } from '../../styles/commonStyles';
import { calculatePassenger } from '../../helpers/common/calculatePassenger';


interface Props  {
    availByPrice: AvailabilityByPriceRS,
    searchParams: {
        adults: number;
        childrens: number;
        babys: number;
        times: string;
        dates: string;
        departures: string;
        arrivals: string;
        baggage: string;
        cabine: {
            name: string;
            value: string;
        };
        direct: boolean;
        currency: string;
        language: string;
    },
    request: AvailabilityRQ,
    displayFlightInfo: ( data: { segment: Segment,  airports: Airport[] } ) => void
}

export const FlightPriceScreen = ({ availByPrice, searchParams, request, displayFlightInfo }: Props ) => {
    const {theme:{ colors, grayDarken, grayColor, whiteColor, secondary, lightDark } } = useContext( ThemeContext );
    const { setItemsPricing } = useContext( FlightsContext );
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const { semibold, bold } = useFont();
    const [checkedSegment, setCheckedSegment] = useState<any[][][]>([]);
    const [recoId, setRecoId] = useState( -1 );
    const [selectedFlight, setSelectedFlight] = useState<SegmentSelected[]>([]);
    const [showDetailPrice, setShowDetailPrice] = useState({
        show: false,
        index: -1
    });
    const [bestPriceSelected, setBestPriceSelected] = useState(false);

    useEffect(() => {
       
        if ( availByPrice ) {
            setRecommendations( availByPrice?.Recommendations );
            updateChecks( availByPrice?.Recommendations );
        }

    }, [])

    useEffect(() => {
        if ( availByPrice && availByPrice.Recommendations ) {
            setRecommendations( availByPrice.Recommendations );
            updateChecks( availByPrice.Recommendations );
        }
    }, [ availByPrice ])



    const showPriceDetail = () => {
        setShowDetailPrice({
            show: !showDetailPrice,
            index: -1
        });
    }

    const isValid = () => {
        let valid = true;
        const itineraries = request.Itineraries.length;
        if ( itineraries !== selectedFlight.length ) {
            Toast.show({
                text1: 'Error',
                text2: t( 'resNoSeleccionadoVuelosTodosItinerariosSeleccionados' ),
                type: 'error',
                visibilityTime: 1500
            })
        } else {
            for (let i = 0; i < itineraries; i++) {
                if (!selectedFlight[i] || selectedFlight[i] == null) {
                    Toast.show({
                        text1: 'Error',
                        text2: `${ t( 'resNoSeleccionadoVuelosTodosItinerariosSeleccionadosFaltanSegmento' ) } ${(i + 1).toString()}`,
                        type: 'error',
                        visibilityTime: 1500
                    })
                    valid = false;
                    return valid;
                }
              }
        }

        return valid;
    }


    const pricing = () => {
        if ( isValid() ) {
            setItemsPricing( selectedFlight, 'price', searchParams, availByPrice.Airports, bestPriceSelected );
            navigation.navigate( 'FlightPricingScreen' );
        }
    }

    const showInfoSegment = ( data: { segment: Segment, airports: Airport[] } ) => {
        displayFlightInfo( data );
    }

    const segmentsSelected = ( data: any, index: number ) => {
        const segm = data.SegmentSelected;
        const idSegment = data.idSegment;
        const id = availByPrice.Recommendations.findIndex(r => r.RecommendationId === segm.RecommendationIndex);
        let arrayChecked = [ ...checkedSegment ];
        if (( segm.RecommendationIndex !== recoId && recoId !== -1 ) || ( segm.RecommendationIndex === recoId && recoId !== -1 && !data.SegmentSelected.checked )) {
            setSelectedFlight( [] );
            resetChecks( recoId, arrayChecked );
        }

        let newArray = [ ...selectedFlight ];
        newArray[ segm.JourneyIndex ] = segm;
        arrayChecked[id][segm.JourneyIndex] = arrayChecked[id][segm.JourneyIndex].map(i => i = false);
        if ( data.SegmentSelected.checked  ) {
            arrayChecked[id][segm.JourneyIndex][idSegment] = true;
        }
        setSelectedFlight( newArray );
        setCheckedSegment( arrayChecked );
        setRecoId( segm.RecommendationIndex );
        setBestPriceSelected( index === 0 ? true : false );
    }

    const resetChecks = ( idR: number, arrayChecked: any[][][] ) => {
        const id = availByPrice.Recommendations.findIndex(r => r.RecommendationId === idR);
        arrayChecked[ id ] = [];
        availByPrice.Recommendations[id].Journeys.map((jou, iJou) => {
            arrayChecked[id][iJou] = [];
            jou.Segments.forEach(s => { arrayChecked[id][iJou].push(false); });
        });
    }

    const updateChecks = (array: any[]) =>  {
        let newChecked = checkedSegment.map((x) => x);
        const checkedLength = newChecked.length;
        array.map((reco, iReco) => {
            newChecked[checkedLength + iReco] = [];
            reco.Journeys.map((jou: any, iJou: any) => {
                newChecked[checkedLength + iReco][iJou] = [];
                jou.Segments.map(( s: any, iS: any ) => { newChecked[checkedLength + iReco][iJou].push(false); });
            });
        });
        
        setCheckedSegment( newChecked );
    }

    
    const calculateTaxes = () => {
        let totalTaxes = 0;
        recommendations[ showDetailPrice.index ].Fares.map(( fare, item ) => {
            totalTaxes+= fare.FeeAmount;
            totalTaxes+= fare.TaxesAmount;
        })

        return (
            <NumberFormat value={ totalTaxes } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                renderText={
                    value => <DynamicText fontFamily={ semibold } headline style={{ color: lightDark, fontSize: 15 }}>{ value }</DynamicText>
                } 
            />
        )
    }
    return (
            <View style={{  marginTop: 20, marginBottom: 160, width: '95%', alignSelf: 'center', backgroundColor: '#f4f4f4' }}>
                { recommendations.length > 0 &&
                    <>
                        { showDetailPrice.index !== -1 &&
                            <Modal
                                key={'detail'}
                                swipeDirection='down'
                                onSwipeComplete={ showPriceDetail }
                                style={{ alignItems: 'center'}} isVisible={ showDetailPrice.show }
                            >
                                <View style={{ borderRadius: 10, width: 350, backgroundColor: colors.background}}>
                                    <View>
                                        <View style={{  borderBottomWidth: .8, borderBottomColor: grayColor  }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 15}}>
                                                <DynamicText  fontFamily={ bold } headline style={{ marginLeft: 10, fontSize: 20, marginTop: 5, color:  lightDark }}>{ t( 'resDetallePrecio' ) }</DynamicText>
                                                <TouchableOpacity
                                                    onPress={ () => showPriceDetail() }
                                                >
                                                    <Icon
                                                        name="close-outline"
                                                        color={ colors.primary }
                                                        size={ 30 }
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ borderBottomWidth: .8, borderBottomColor: grayColor }}>
                                            { recommendations[ showDetailPrice.index ].Fares.map(( fare, fareIndex ) => {
                                                    return (
                                                        <View key={ fareIndex }
                                                            style={{ margin: 20, marginTop: 5, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between'  }}
                                                        > 
                                                            <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: lightDark }}>{ `${fare.Quantity} ${ t( calculatePassenger( fare.PaxType ) )  }` }</DynamicText>
                                                            <NumberFormat value={  fare.FareAmount } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                                renderText={
                                                                    value => <DynamicText fontFamily={ semibold } headline style={{ color: lightDark, fontSize: 15 }}>{ value }</DynamicText>
                                                                } 
                                                            />
                                                        </View>
                                                    )
                                                })

                                            }
                                        </View>
                                        <View style={{ borderBottomWidth: .8, borderBottomColor: grayColor }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                                                <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: lightDark }}>{ t( 'resImpuestosTasasCargos' ) }</DynamicText>
                                                { calculateTaxes() }
                                            </View>
                                            
                                        </View>
                                        
                                        <View style={{ borderBottomWidth: .8, borderBottomColor: grayColor }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20}}>
                                                <DynamicText fontFamily={ bold } style={{ fontSize: 17, color: lightDark }}>{ t( 'resPrecioTotal' ) }</DynamicText>
                                                <NumberFormat value={  recommendations[ showDetailPrice.index ].TotalFare.Total } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                    renderText={
                                                        value => <DynamicText fontFamily={ bold } headline style={{ color: lightDark, fontSize: 17 }}>{ value }</DynamicText>
                                                    } 
                                                />
                                            </View>
                                        </View>

                                        <View style={{ margin: 10 }}>
                                            <DynamicText fontFamily={ semibold } style={{ fontSize: 15, color: lightDark, marginLeft: 10  }}>{ t( 'resUnicamenteUnaCuota' )  }</DynamicText>
                                        </View>

                                    </View>
                                    
                                </View>
                            </Modal>
                        }
                        {
                            recommendations.map(( recommendation, recommendationIndex ) => {
                                return (
                                    <View   
                                        key={ recommendationIndex }   
                                        style={{ backgroundColor: whiteColor, marginBottom: 10, borderRadius: 5, borderWidth: .5, borderColor: grayColor }}
                                    > 
                                        <FlightRecommendationScreen 
                                            recommendation={ recommendation }
                                            airports={ availByPrice?.Airports }
                                            flightsSelected={ (data: any ) => segmentsSelected( data, recommendationIndex ) }
                                            checkedSegment={ checkedSegment[recommendationIndex] }
                                            showInfoSegment={ showInfoSegment }
                                        />
                                        <View style={{ margin: 10, padding: 10, borderTopWidth: 1, borderTopColor: grayDarken, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <DynamicText style={{ color: grayDarken }}>{ t( 'resPrecioTotal' ) }</DynamicText>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity
                                                        onPress={ () => setShowDetailPrice({
                                                            show: !showDetailPrice.show,
                                                            index: recommendationIndex
                                                        }) }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={ faInfoCircle } 
                                                            color={ colors.primary }
                                                            size={ 18 }
                                                            style={{ marginTop: 3, marginRight: 5 }}
                                                            
                                                        />
                                                    </TouchableOpacity>
                                                    <NumberFormat value={ recommendation.TotalFare.Total } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                                        renderText={
                                                            value => <DynamicText fontFamily={ bold } headline style={{ color: grayDarken, fontSize: 20 }}>{ value }</DynamicText>
                                                        } 
                                                    />
                                                    <DynamicText fontFamily={ bold } headline style={{ color: grayDarken, fontSize: 20 }}> { recommendation.TotalFare.Currency }</DynamicText>
                                                </View>
                                            </View>
                                            <View>
                                                <TouchableOpacity 
                                                    style={ styles.buttons }
                                                    onPress={ () => pricing() }
                                                >
                                                    <LinearGradient
                                                        colors={[colors.primary, secondary]}
                                                        style={ styles.buttons }
                                                    >
                                                        <DynamicText fontFamily={ semibold } style={[loginStyles.textSign, {
                                                            color: whiteColor
                                                        }]}>{ t( 'resSeleccionar' ) }</DynamicText>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                            
                                        </View>
                                    </View>
                                ) 
                            })
                        }
                    </>

                }

            </View>
    )
}


const styles = StyleSheet.create({
    
    buttons: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

})