import React, { useState } from 'react'
import { useEffect,useContext } from 'react'
import { DynamicText } from '../../components/common/DynamicText'
import { FlightsContext } from '../../contexts/flights/FlightsContext'
import { Segment } from '../../model/classes/flights/business-objects/Segment'
import { PricingRQ } from '../../model/classes/flights/pricing/PricingRQ'
import { CabinType } from '../../model/enums/CabinType'
import { flightsApi } from '../../api/flightsApi';
import { PricingRS } from '../../model/classes/flights/pricing/PricingRS';
import Toast from 'react-native-toast-message'
import { PricingBaseFlight } from '../../model/classes/flights/pricing/PricingBaseFlight';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { useFont } from '../../hooks/common/useFont';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import NumberFormat from 'react-number-format'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRight, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { calculateColor } from '../../helpers/flights/calculateColor';
import { useTranslation } from 'react-i18next';

interface Props {
    segment: Segment,
    journeyControl: number,
    recommendationControl: number,
    showSegmentUpsell: any,
    changeSegmentSelected: ( data: any ) => void
}

export const FlightUpsellScreen = ( { segment, journeyControl, recommendationControl, showSegmentUpsell, changeSegmentSelected }:Props) => {
    const { theme:{ colors, lightDark, grayColor, whiteColor, accent, secondary, lightGray, backgroundDarken } } = useContext( ThemeContext );
    const navigation = useNavigation();
    const { bold, semibold } = useFont();
    const { getPricing } = flightsApi();
    const [upsellOptions, setUpsellOptions] = useState<PricingBaseFlight[]>([]);
    const [displayUpsell, setDisplayUpsell] = useState(false);
    const { searchParams } = useContext( FlightsContext );
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        getPricingUpsell()
    }, [])

    const getPricingRQ = () => {
        const  request = new PricingRQ();
        request.Segments = [segment];
        request.PaxAdults = searchParams.adults;
        request.PaxChildren = searchParams.childrens;
        request.PaxInfants = searchParams.babys;
        request.Currency = searchParams.currency;
        request.Cabin = CabinType.All;
        request.language = searchParams.language;
        request.sourceCode = request.Segments[0].SourceCode;
        request.GetCorporateParams = true;
        request.GetFareRules = true;
        request.BestBuy = false;
        request.IncludeUpsell = true;

        return request;
    }


    const getPricingUpsell = () => {
        setLoading( true );
        const request = getPricingRQ();
        getPricing( request )
            .then(( response ) => {
                
                const responsePricing = response as PricingRS;
                console.log( 'response', responsePricing.OtherOptionsUpsell[0].SegmentsBase );
                if ( !responsePricing.OtherOptionsUpsell ) {
                    Toast.show({
                        text1: t( 'resSinDiponibilidad' ),
                        text2: t( 'resNoOtrasOpcionesDisponibles' ),
                        type: 'error',
                        visibilityTime: 1500
                    });
                    /* showSegmentUpsell( false ); */
                } else {
                    setUpsellOptions( responsePricing.OtherOptionsUpsell as PricingBaseFlight[] );
                    setDisplayUpsell( true );
                }
                setLoading( false );

            })
    }

    return (
        <Animatable.View
            animation="fadeIn"
        >
            { loading &&
                <ActivityIndicator
                    size='large'
                    color={ colors.primary }
                />
            }
            { !loading && upsellOptions?.map(( upsell, index ) => {
                return (
                    <View
                        key={ index }
                        style={{ borderWidth: .3, borderColor: grayColor }}
                    >
                        <View style={{ borderLeftWidth: 3, borderLeftColor: calculateColor( upsell.SegmentsBase[0].FareFamilyDescription.CommercialNameFamily ), marginTop: 10, marginBottom: 10 }}>
                            <View style={{ flexDirection: 'row', margin: 10 }}>
                                <DynamicText fontFamily={ bold } style={{ color: lightDark, fontSize: 15 }}>{ upsell.SegmentsBase[0].FareFamilyDescription.CommercialNameFamily }</DynamicText>
                                <DynamicText fontFamily={ semibold } style={{ color: grayColor, fontSize: 15 }}>{ ` | ${ upsell.SegmentsBase[0].FareFamilyDescription.Characteristics.Characteristic[0].Options[0].AdditionalInfo }` }</DynamicText>
                            </View>
                            <View style={{ flexDirection: 'row', margin: 10 }}>
                                <DynamicText fontFamily={ semibold } style={{ color: grayColor, fontSize: 15 }}>{ `${ upsell.SegmentsBase[0].FareFamilyDescription.Cabine }` }</DynamicText>
                            </View>
                            <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={ () => navigation.navigate( 'FlightUpsellDetailScreen', { options: upsellOptions[index].SegmentsBase[0].FareFamilyDescription.Characteristics.Characteristic[0].Options, fareFamily: upsell.SegmentsBase[0].FareFamilyDescription, faresTotal: upsell.TotalFare.Total } ) }
                                >
                                    <DynamicText fontFamily={ bold } style={{ color: backgroundDarken }}>{ t( 'resDetalles' ) }</DynamicText>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row' }}>
                                    <NumberFormat value={ upsell.TotalFare.Total } displayType={ 'text' } thousandSeparator={ true } prefix={ '$' } 
                                        renderText={
                                            value => <DynamicText fontFamily={ semibold } headline style={{ color: lightDark }}>{ value }</DynamicText>
                                        } 
                                    />
                                    <FontAwesomeIcon 
                                        icon={ faAngleRight }
                                        size={ 25 }
                                        color={ colors.primary }
                                    />
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    </View>
                )
            })

            }
        </Animatable.View>
    )
}
