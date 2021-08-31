import React, { useContext, useEffect, useState } from 'react'
import { DynamicText } from '../../components/common/DynamicText'
import { Header } from '../../components/common/Header';
import { useTranslation } from 'react-i18next';
import { RootStackParams } from '../../navigator/Navigator';
import { StackScreenProps } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SegmentSelected } from '../../model/classes/flights/SegmentSelected';
import { FlightsContext } from '../../contexts/flights/FlightsContext';
import { Airport } from '../../model/classes/flights/business-objects/Airport';
import * as Animatable from 'react-native-animatable';
import { FlightPricingSegment } from './FlightPricingSegment';
import { ScrollView } from 'react-native-gesture-handler';
import { useFont } from '../../hooks/common/useFont';
import { PricingRQ } from '../../model/classes/flights/pricing/PricingRQ';
import { PricingSingleRQ } from '../../model/classes/flights/pricing/PricingSingleRQ';
import { Segment } from '../../model/classes/flights/business-objects/Segment';
import { flightsApi } from '../../api/flightsApi';
import { PricingSingleRS } from '../../model/classes/flights/pricing/PricingSingleRS';
import { PricingBaseRS } from '../../model/classes/flights/pricing/PricingBaseRS';
import { PricingRS } from '../../model/classes/flights/pricing/PricingRS';
import { TotalFares } from '../../model/classes/flights/business-objects/TotalFares';
import { FareRule } from '../../model/classes/flights/pricing/FareRule';
import { FlightRuleScreen } from './FlightRuleScreen';
import { calculateCabine } from '../../helpers/flights/calculateCabine';
import NumberFormat from 'react-number-format';

interface Props extends StackScreenProps<RootStackParams, 'FlightPricingScreen'>{};

export const FlightPricingScreen = ( { navigation }: Props ) => {
    const { theme: { colors, fieldColor, accent, lightDark, whiteColor } } = useContext( ThemeContext );
    const { segments, type, searchParams, airports, bestPriceSelected } = useContext( FlightsContext );
    const { getPricing } = flightsApi();
    const { t } = useTranslation();
    const { bold, semibold } = useFont();
    const [selectedSegmentItems, setSelectedSegmentItems] = useState<SegmentSelected[]>([])
    const [searchedParams, setSearchedParams] = useState<any>();
    const [airport, setAirports] = useState<Airport[]>( [] );
    const [bestBuy, setBestBuy] = useState(false);
    const [typePricing, setTypePricing] = useState('');
    const [pricingRes, setPricingRes] = useState( new PricingSingleRS );
    const [total, setTotal] = useState<TotalFares>( new TotalFares );
    const [ruleCurrentSegment, setRuleCurrentSegment] = useState<FareRule[]>( [] );
    const [showModal, setShowModal] = useState(false);
    const [carrierCurrentSegment, setCarrierCurrentSegment] = useState('');
    const [showPricing, setShowPricing] = useState(false);
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSelectedSegmentItems( segments );
        setSearchedParams( searchParams );
        setAirports( airports );
        setBestBuy( bestPriceSelected );
        initPricing();

    }, [])

    const getSegmentSelected = () => {
        const seg: Segment[] = [];
        if ( segments ) {
          segments.forEach(s => {
            seg.push(s.SegmentSelected.Segment);
          });
        }
        return seg;
    }

    const initPricing = () => {
        setLoading( true );
        const request = (type === 'price') ? getPricingRequestByPrice(): getPricingRequestBySingle();
        getPricings( request );
            
    }

    const getPricings = ( request: PricingRQ | PricingSingleRQ ) => {
        const url = type === 'single' ? '/' + type : '';
        getPricing( request, url )
            .then(( response ) => {
                let priceRS;
                if ( type === 'price' ) {
                    setErrors( (response as PricingBaseRS).Errors.length > 0 );
                    priceRS = getPriceSingleRSFromPricing( response as PricingBaseRS );
                } else {
                    priceRS = response as PricingSingleRS;
                }

                priceRS.BestBuy = bestBuy;
                /* this.user.flightSelected = this.pricingRes; */

                setPricingRes( priceRS );
                calculateTotalFare( priceRS );
                setShowPricing( true );
                setLoading( false );
            })
        

    }

    const calculateTotalFare = ( priceRS: PricingSingleRS ) => {
        let total: TotalFares =  new TotalFares();
        if ( type === 'price' && priceRS.PricingBySource[0].TotalFare ) {
            total = priceRS.PricingBySource[0].TotalFare;
        } else if ( priceRS.PricingBySource[0].TotalFare ) {
            total = priceRS.PricingBySource[0].TotalFare
            if ( priceRS.PricingBySource.length > 1 ) {
                for (let i = 1; i < priceRS.PricingBySource.length; i++) {
                    total.Total += priceRS.PricingBySource[i].TotalFare.Total;
                }
            }
        }

        setTotal( total );
    }

    const getPriceSingleRSFromPricing = ( pricingRS: PricingBaseRS ) => {
        const response = new PricingSingleRS;
        response.CorporateParams = pricingRS.CorporateParams;
        response.CorporateBookingInfo = pricingRS.CorporateBookingInfo;
        response.FormRequirements = pricingRS.FormRequirements;
        response.PricingBySource = [(pricingRS as PricingRS)];
        return response;
    }

    const getPricingRequestByPrice = () => {
        const request = new PricingRQ();
        request.Segments = getSegmentSelected();
        request.PaxAdults = searchParams.adults;
        request.PaxChildren = searchParams.childrens;
        request.PaxInfants = searchParams.babys;
        request.Currency = searchParams.currency;
        request.Cabin = calculateCabine( searchParams.cabine );
        request.language = searchParams.language;
        request.sourceCode = request.Segments[0].SourceCode;
        request.GetCorporateParams = true;
        request.GetFareRules = true;
        request.BestBuy = false;

        return request;

    }

    const getPricingRequestBySingle = () =>  {
        const  request = new PricingSingleRQ();
        request.Segments = getSegmentSelected();
        request.PaxAdults = searchParams.adults;
        request.PaxChildren = searchParams.childrens;
        request.PaxInfants = searchParams.babys;
        request.Currency = searchParams.currency;
        request.Cabin = calculateCabine( searchParams.cabine );
        request.GetCorporateParams = true;
        request.GetFareRules = true;
        // request.LOCInt = this.user.currentLoc;
        return request;
    }

    const showRuleSegment = ( data: { departure: string, arrival: string } ) => {
        setShowModal( false );
        let rules: FareRule[] = [];
        setTypePricing( 'rules' );
        pricingRes.PricingBySource.forEach( price => {
            const rule = price.RulesInfo.find( r => r.DepartureAirport === data.departure && 
                r.ArrivalAirport === data.arrival
            );
            const seg = price.Segments.find( s => s.DepartureStation === data.departure && 
                s.ArrivalStation === data.arrival
            );
            setCarrierCurrentSegment( seg ? seg.ValidatingCarrier : '' );
            if ( rule ) {
                rules.push( rule )
            } else {
                let push = false;
                price.RulesInfo.forEach( r => {
                    if ( r.DepartureAirport === data.departure ) {
                        rules.push( r );
                    } else if ( r.ArrivalAirport === data.arrival ) {
                        rules.push( r );
                    } else if ( push ) {
                        rules.push( r );
                    }
                });
            }
        });
        setShowModal( true );
        setRuleCurrentSegment( rules );
    }


    const hideShowModal = () => {
        setShowModal( !showModal );
        console.log( 'showMOdal', showModal );
    }

    return (
        <>
            <Header 
                title={ t( 'resVuelo' ) }
                onPressLeft={ () => {
                    navigation.goBack()
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faTimes }
                            size={ 20 }
                            color={ colors.primary }
                        />
                    )
                } }

                renderRight={ () => {
                    return (
                        <>
                            { !errors &&
                                <TouchableOpacity onPress={ () => console.log( 'seleccionado' ) }>
                                    <DynamicText fontFamily={ bold } style={{ fontSize: 15 }} primaryColor numberOfLines={1}>
                                        { t( 'resContinuar' ) }
                                    </DynamicText>
                                </TouchableOpacity>
                            }
                        </>
                        
                    )
                } }
            />
            { (showPricing && !errors) &&
                <View style={[{ width: '100%', backgroundColor: whiteColor, flexDirection: 'row', justifyContent: 'space-around' }]}>
                    <DynamicText fontFamily={ bold } style={{ margin: 5, color: lightDark, fontSize: 16 }}>{ t( 'resPrecioTotal' ) }</DynamicText>
                    <NumberFormat  value={ total.Total } displayType='text' thousandSeparator={ true } prefix='$'
                        renderText={ valueRender => (
                            <DynamicText style={{ margin: 5, fontSize: 16 }}>{ ` ${ total.Currency } ${ valueRender } ` }</DynamicText>
                        )}
                    />
                </View>
            }

            <ScrollView style={{ flex: 1, backgroundColor: fieldColor, marginBottom: 50 }}>
                { loading &&
                    <ActivityIndicator
                        size="large"
                        color={ colors.primary }
                        style={{ justifyContent: 'center' }}
                    />
                }
                { (showPricing && !errors) &&
                    selectedSegmentItems.map(( segment, idSeg ) => {
                        return (
                            <Animatable.View
                                animation='fadeIn'
                                key={ idSeg }
                            >
                                <View style={{ alignItems: 'center', backgroundColor: accent, width: '80%', alignSelf: 'center', marginTop: 20, marginBottom: 20, padding: 10, borderRadius: 10 }}>
                                    <DynamicText fontFamily={ bold } style={{ color: colors.primary }} headline>{ segment.JourneyIndex == 0 ? t( 'resIda' ) : t( 'resRegreso' ) }</DynamicText>
                                </View>
                                <FlightPricingSegment segment={ segment.SegmentSelected.Segment } airports={ airports } showRules={ true } showRuleSegment={ showRuleSegment } />
                            </Animatable.View>
                        )
                    })
                }
                { showModal &&
                    <FlightRuleScreen rule={ ruleCurrentSegment }  carrier={ carrierCurrentSegment } setShowModal={ hideShowModal } />
                }
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create({
    total: {
        flexDirection: 'row', 
        marginTop: 10, 
        marginBottom: 10, 
        justifyContent: 'space-around', 
        width: '70%', 
        alignSelf: 'center', 
        padding: 10, 
        borderRadius: 10 
    }
})