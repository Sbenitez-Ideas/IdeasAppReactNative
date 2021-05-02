import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { Text, View, FlatList, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { commonStyles } from '../../styles/commonStyles'

export const CheckinScreen = () => {
    const { t } = useTranslation();
    const { theme: { colors, buttonText, secondary } } = useContext( ThemeContext );


    const companies = [
        { name: 'LATAM', code: 'LA', url: 'https://www.latam.com/es_co/apps/personas/checkinunified' },
        { name: 'AVIANCA', code: 'AV', url: 'https://www.avianca.com/co/es/?gclid=EAIaIQobChMI_76Grfyy5QIVGmKGCh3AMQsGEAAYASAAEgI_HPD_BwE&gclsrc=aw.ds' },
        { name: 'AMERICAN AIRLINES', code: 'AA', url: 'https://www.aa.com/reservation/flightCheckInViewReservationsAccess.do?locale=es_PR' },
        { name: 'DELTA', code: 'DL', url: 'https://es.delta.com/lac/es' },
        { name: 'UNITED', code: 'UA', url: 'https://www.united.com/travel/checkin/start.aspx' },
        { name: 'COPA', code: 'CM', url: 'https://checkin.copaair.com/' },
        { name: 'MYANMAR', code: 'N7', url: 'https://www.flymna.com/checkin/' },
        { name: 'AIR CANADA', code: 'AC', url: 'https://www.aircanada.com/co/es/aco/home.html' },
        { name: 'LUFTHANSA', code: 'LH', url: 'https://www.lufthansa.com/es/en/online-check-in' },
        { name: 'FLY TAP', code: 'TP', url: 'https://www.flytap.com/en-pt/check-in-flight' },
        { name: 'AL ITALIA', code: 'AZ', url: 'https://www.alitalia.com/es_es/fly-alitalia/check-in/online-check-in.html' },
        { name: 'AIR FRANCE', code: 'AF', url: 'https://www.airfrance.com.co/CO/es/local/core/engine/echeckin/IciFormAction.do' },
        { name: 'ETHIOPIAN AIRLINES', code: 'ET', url: 'https://www.ethiopianairlines.com/ET/EN' },
        { name: 'ROYA DUTCH AIRLINES', code: 'KL', url: 'https://www.klm.com.co/check-in/entry-form' },
        { name: 'IBERIA', code: 'IB', url: 'https://www.iberia.com/co/autocheckin-online/?language=es&market=co#/ibcose' },
        { name: 'QANTAS', code: 'QF', url: 'https://www.qantas.com/au/en/travel-info/check-in.html' },
        { name: 'ELAL', code: 'LY', url: 'https://www.elal.com/es/PassengersInfo/Check-In/Pages/Internet-Check-In.aspx' },
        { name: 'TAAG', code: 'DT', url: 'http://www.taag.com/en/Plan/Check-in/Online-check-in' },
        { name: 'GOL', code: 'G3', url: 'https://checkininternet.voegol.com.br/home?culture=es-ar&_ga=2.124580618.1056264875.1571864361-1341019439.1571864361' },
        { name: 'CUBANA', code: 'CU', url: 'https://www.cubana.cu/information/Aeropuerto/1' },
        { name: 'AERO MEXICO', code: 'AM', url: 'https://aeromexico.com/es-mx/check-in' },
        { name: 'STAR PERU', code: '2I', url: 'https://wc2-2i.kiusys.net/' },
        { name: 'EMIRATES', code: 'EK', url: 'https://www.emirates.com/co/spanish/manage-booking/online-check-in.aspx' },
        { name: 'TURKISH AIRLINES', code: 'TK', url: 'https://www.turkishairlines.com/es-co/flights/manage-booking/' },
        { name: 'TAME', code: 'EQ', url: 'http://www7.tame.com.ec/iCheck/Views/Home.aspx' },
        { name: 'APG AIRLINES', code: 'EQ', url: 'https://book.apg-airlines.com/web/ICIPNRSearch.xhtml?localeuage=en_US' },
        { name: 'JET BLUE', code: 'B6', url: 'https://mobilecheckin.jetblue.com/checkin/check-in' },
        { name: 'VIVAAIR', code: 'VV', url: 'https://www.vivaair.com/pe/es/mi-reserva' },
        { name: 'FLEX FLIGHT', code: 'W2', url: 'https://flexflight.dk/online-check-in/' },
        { name: 'AMASZONAS', code: 'Z8', url: 'https://checkin.si.amadeus.net/static/PRD/Z8/#/identification' },
        { name: 'AZUL', code: 'AD', url: 'https://apps.voeazul.com.br/MobileSite/Checkin/RetrieveBooking' },
        { name: 'SINGAPORE AIR', code: 'SQ', url: 'https://www.singaporeair.com/en_UK/us/travel-info/check-in/online-mobile-checkin/' },
        { name: 'AIR TRANSAT', code: 'TS', url: 'https://www.airtransat.com/en-CA/online-check-in' },
        { name: 'KENYA AIRWAYS', code: 'KQ', url: 'https://www.kenya-airways.com/prepare-for-travel/manage-booking/online-check-in/en/?gclid=EAIaIQobChMI673il4G15QIVT9yGCh1nKgIPEAAYASAAEgI-ifD_BwE' },
        { name: 'AVIORAIR', code: '9V', url: 'https://dx.aviorair.com/dx/9VDX/#/home?tabIndex=1' },
        { name: 'CHINA SOUTHERN AIRLINE', code: 'CZ', url: 'https://www.csair.com/en/tourguide/faq/check/wsbldjsx.shtml' },
        { name: 'INTERJET', code: '4O', url: 'https://www.interjet.com/es-mx/administra-tu-vuelo/check-in' },
        { name: 'FLYASIANA', code: 'OZ', url: 'https://flyasiana.com/I/US/EN/CheckIn.do' },
        { name: 'AIR EUROPA', code: 'UX', url: ' https://www.aireuropa.com/es/vuelos?esl-k=sem-google|ng|c378225257015|mb|k%2Bair%20%2Beuropa|p|t|dc|a28491926837|g598929315&gclid=EAIaIQobChMI1pTzw4W15QIVDoeGCh1t6AQIEAAYASAAEgL8t_D_BwE' },
    ];

    return (
        <>
            <View style={ commonStyles.container }>
                <Text style={{ 
                    marginTop: 60,
                    fontSize: 20,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: colors.primary
                }}>
                    { t( 'resSeleccionaAerolineaCheckin' ) }
                </Text>

                <FlatList 
                    style={{ width: '100%' }}
                    data={ companies }
                    keyExtractor={ ( companies ) => companies.name }
                    renderItem={ ({ item }) => (
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={ () => Linking.openURL( item.url ) }
                                style={{...commonStyles.entireButton, width: '80%' }}
                            >
                                <LinearGradient
                                    colors={[colors.primary, secondary]}
                                    style={{ width: '100%', ...commonStyles.smallButton, height: 50 }}
                                >
                                    <Text style={[commonStyles.buttonText, {
                                        color: buttonText
                                    }]}>{ item.name } </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </>
    )
}
