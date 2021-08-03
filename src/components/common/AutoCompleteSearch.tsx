

import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native-animatable';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/Navigator';
import { SearchBar } from 'react-native-elements';
import { Platform, Text, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ExpenseActivitiesRQ } from '../../model/classes/viatics/ExpenseActivitiesRQ';
import { AuthContext } from '../../contexts/auth/AuthContext';
import * as Animatable from 'react-native-animatable';
import { useActivities } from '../../hooks/viatics/useActivities';
import { viaticsApi } from '../../api/viaticsApi';
import { ExpenseActivitiesRS } from '../../model/interfaces/viatics/ExpenseActivitiesRS';
import { GActivities } from '../../model/interfaces/viatics/GActivities';
import { CategoriesEntity } from '../../model/classes/viatics/CategoriesEntity';
import { ExpenseCategories } from '../../model/classes/viatics/ExpenseCategories';
import { getCurrencyType } from '../../helpers/viatics/getCurrencyType';
import { CurrencyTypes } from '../../model/classes/viatics/CurrencyTypes';
import { ExpenseEstablishmentRQ } from '../../model/classes/viatics/ExpenseEstablishmentRQ';
import { Establishment } from '../../model/classes/viatics/Establishment';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import { TravelerCorporateRQ } from '../../model/classes/corporate/TravelerCorporateRQ';
import { SearchFieldTraveler } from '../../model/enums/SearchFieldTraveler';
import { corporateApi } from '../../api/corporateApi';
import { TravelerCorporate } from '../../model/classes/corporate/TravelerCorporate';
import { ApproverListRQ } from '../../model/classes/corporate/ApproverListRQ';
import { ApproverListRS } from '../../model/classes/corporate/ApproverListRS';
import { GetCostCenterRQ } from '../../model/classes/backoffice/GetCostCenterRQ';
import { backofficeApi } from '../../api/backofficeApi';
import { ResponseList } from '../../model/classes/common/ResponseList';
import { GetCostCenterRS } from '../../model/classes/backoffice/GetCostCenterRS';
import { geolocationApi } from '../../api/geolocationApi';

interface Props extends StackScreenProps<RootStackParams, 'AutoCompleteSearch'> {};

export const AutoCompleteSearch = ({ route, navigation }: Props) => {
    const { t } = useTranslation();
    const [items, setItems] = useState<GActivities[] | ExpenseCategories[] | CurrencyTypes[] | Establishment[] | TravelerCorporate[] | ApproverListRS[] | GetCostCenterRS[] | any[]>([]);
    const { getActivities, getCategories, getEstablishments } = viaticsApi();
    const { searchLocation } = geolocationApi()
    const { getTraveler, getApproverList } = corporateApi();
    const { getCostCenters } = backofficeApi();
    const [title, setTitle] = useState('');
    const { userData: { IDEntityDefault, IDUser } } = useContext( AuthContext );
    const {theme:{ colors, fieldColor } } = useContext( ThemeContext );

    const getOS = (): 'android' | 'ios' => {
        if (Platform.OS === 'android') {
            return 'android';
        } else {
            return 'ios';
        }
    }

    const [searchData, setSearchData] = useState({
        title: '',
        searchedValue: ''
    })

    const type = route.params.type;
    const index = route.params.index;
    const screen = route.params.screen;
    const typeFlight = route.params.typeSearch;

    console.log( 'index', route.params );

    useEffect(() => {
        switch( type ) {
            case 'Activities':
               setTitle('Búsqueda de Actividades')
                break;
            case 'Category':
               setTitle('Búsqueda de Categorias')
                break;
            case 'CurrencyType':
               setTitle('Tipo de Moneda')
                break;
            case 'Establishment':
               setTitle('Establecimientos')
                break;
            case 'Traveler': 
               setTitle('Pasajeros')
                break;
            case 'Approvers':
                setTitle( 'Aprobadores' );
                break;
            case 'CostCenter':
                setTitle( 'Centros de Costos' );
                break;
            case 'Location': 
                setTitle( 'Ubicación' )
            default:
                break;         
        }

        setRequests();


    }, [type])


    const setRequests = ( searchText: string = '' ) => {
        switch( type ) {
            case 'Activities':
                setActivitiesRQ();
                break;  

            case 'Category':
                setCategoriesRQ();
                break;
                
            case 'Establishment':
                setEstablishmentRQ();
                break;
            case 'Traveler':
                setTravelerRQ( searchText );
                break;
            case 'Approvers':
                setApproversListRQ();
                break;
            case 'CostCenter': 
                setCostCenterRQ( searchText );
                break;
            case 'Location':
                setLocationRQ( searchText );
            default:
                break;         
        }

        if ( searchText ||  type ) {
            getItems( searchText );
        }
    }

    const getItems = ( searchText: string ) => {
        switch( type ) {
            case 'Activities':
                const requestActity = setActivitiesRQ();
                getActivities( requestActity )
                    .then(( response ) => {
                        pushItemsResponse( response, 'activitie' );
                    })
                break;  
            
            case 'Category': 
                const requestCategories = setCategoriesRQ();
                getCategories( requestCategories )
                    .then(( response ) => {
                        pushItemsResponse( response, 'categorie' )
                    })
                break;
            case 'CurrencyType':
                pushItemsResponse(getCurrencyType(), 'currencyType')
                break;
            case 'Establishment':
                const requestEstablishment = setEstablishmentRQ();
                getEstablishments( requestEstablishment )
                    .then(( response ) => {
                        pushItemsResponse( response, 'establishment')
                    });
                break;
            case 'Traveler': 
                const requestTraveler = setTravelerRQ( searchData.searchedValue );
                getTraveler( requestTraveler )
                    .then(( response ) => {
                        pushItemsResponse( response, 'traveler' );
                    })
                break;
            case 'Approvers': 
                const requestApprovers = setApproversListRQ();
                getApproverList( requestApprovers )
                    .then(( response ) => {
                        pushItemsResponse( response, 'approvers' );
                    })
                break;
            case 'CostCenter':
                const requestCostCenter = setCostCenterRQ();
                getCostCenters( requestCostCenter )
                    .then(( response ) => {
                        pushItemsResponse( response, 'costCenter' );
                    })
                break;
            case 'Location':
                const requestLocation = setLocationRQ( searchText );
                searchLocation( requestLocation )
                    .then(( response ) => {
                        const locations = [];
                        for ( const country of response ) {
                            if ( country.Destinations ) {
                                for ( const destination of country.Destinations ) {
                                    locations.push({
                                        id: destination.IDDestination,
                                        locationType: 'DESTINATION',
                                        name: destination.Name + ', ' + destination.ParentName + ', ' + country.Name,
                                        iata: destination.IATACode,
                                        score: 0,
                                        stateName: '',
                                        type: destination.Type,
                                        ISOCode: country.ISOCode,
                                        iataCity: ''
                                    })
                                }
                            }
                            if (country.Cities) {
                                for (const city of country.Cities) {
                                    if (city.Airports) {
                                        if (city.Airports.length > 1) {
                                            locations.push({
                                                id: city.IDCity,
                                                locationType: 'CITY',
                                                name: city.Name + ', ' + country.Name,
                                                iata: city.IATACode,
                                                score: city.Score,
                                                stateName: city.StateName,
                                                type: 'A',
                                                ISOCode: country.ISOCode,
                                                iataCity: ''
                                            });
                                        }
                                        for (const airport of city.Airports) {
                                            locations.push({
                                                id: airport.IDAirport,
                                                locationType: 'CITY',
                                                name: airport.Name + ', ' + city.Name + ', ' + country.Name,
                                                iata: airport.IATACode,
                                                score: airport.Score,
                                                stateName: city.StateName,
                                                type: 'A',
                                                ISOCode: country.ISOCode,
                                                iataCity: ''
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        setItems( locations );
                    })
                break;


            default:
                break;         
        }
    }

    const setActivitiesRQ =  () => {
        const request: ExpenseActivitiesRQ = {
            IDUser: IDUser,
            IDEntity: IDEntityDefault,
            excludeImages: true,
            FilterType: 3
        };

        return request;
    }

    const setCategoriesRQ = () => {
        const request = new  CategoriesEntity();
        request.IDEntity = IDEntityDefault;

        return request;
    }

    const setEstablishmentRQ = ( ) => {
        const request = new ExpenseEstablishmentRQ();
        request.IDEntity = IDEntityDefault;
        request.SearchName = searchData.searchedValue;
        request.Skip = 0;
        request.Take = 20;
        return request;

    }

    const setTravelerRQ = ( travelerName: string | null = null ) => {
        const request = new TravelerCorporateRQ();
        request.IDEntity = IDEntityDefault;
        request.Language = 'ES';
        request.SearchField = SearchFieldTraveler.name;
        request.SearchValue = travelerName;
        return request;
    }

    const setApproversListRQ = () => {
        const request = new ApproverListRQ();
        request.IDEntity = IDEntityDefault;
        return request;
    }

    const setCostCenterRQ = ( costCenterName: string | null = null ) => {
        const request = new GetCostCenterRQ();
        request.EntityId = IDEntityDefault;
        request.skip = 0;
        request.take = 20;
        request.CostCenterName = costCenterName as string;
        return request;
    }

    const setLocationRQ = ( location?: string ) => {
        const request = {
            Language: 'ES',
            Query: location,
            Type: 'airport',
            CountryISO: null
        }
        return request;
    }

    const filterByName = ( value: string ) => {
        if ( value.trim().length >= 3 ) {
            setItems([]);
            setRequests( value );
        }

        setSearchData({
            ...searchData,
            searchedValue: value
        })
    }

    const pushItemsResponse = (response: ExpenseActivitiesRS | ExpenseCategories[] | CurrencyTypes[] | Establishment[] | TravelerCorporate[] | ApproverListRS[] | ResponseList, type: string) =>  {
        if (response) {
            switch (type) {
                case 'activitie':
                    const activities = response as ExpenseActivitiesRS;
                    setItems( activities.ListActivities );
                    break;

                case 'categorie':
                    const categories = response as ExpenseCategories[];
                    setItems( categories );
                    break;
                
                case 'currencyType':
                    const types = response as CurrencyTypes[];
                    setItems( types )
                    break;
                
                case 'establishment':
                    const establishment = response as Establishment[];
                    setItems( establishment );
                    break;

                case 'traveler':
                    const travelers = response as TravelerCorporate[];
                    setItems( travelers )
                    break;

                case 'approvers':
                    const approvers = response as ApproverListRS[];
                    setItems( approvers )
                    break;
                case 'costCenter':
                    const costCenter = ( response as ResponseList ).list;
                    setItems( costCenter );
                default:
                    break;
            }
        }
    }

    return (
        <>
            <Header 
                title={ title }
                onPressLeft={ () => {
                    navigation.goBack()
                } }
                renderLeft={ () => {
                    return (
                        <FontAwesomeIcon 
                            icon={ faTimes }
                            size={ 20 }
                            color={ colors?.primary }
                        />
                    )
                } }

            />

            <SearchBar
                containerStyle={{ ...styles.text, backgroundColor: fieldColor, width: '90%', alignSelf: 'center' }}
                inputStyle={{ fontFamily: 'Raleway-Regular' }}
                searchIcon={{ color: colors.primary }}
                clearIcon={{ color: colors.primary }}
                platform={ getOS() }
                placeholder={ t( 'resDigiteTresLetras' ) }
                onChangeText={ ( value ) => filterByName( value ) }
                value={ searchData.searchedValue }
            />

            <Animatable.View
                animation="fadeIn"
                style={{ paddingBottom: 120 }}
            >
                <FlatList
                    data={ items  }
                    keyExtractor={ ( item, index ) =>  index.toString() }
                    renderItem={ 
                        ({ item }) => (
                            <View
                                style={{ left: 20, marginTop: 10 }}
                            >
                                { type === 'Activities' &&
                                    <TouchableOpacity 
                                        onPress={ () => navigation.navigate( screen , {
                                            activity: item,
                                        }) }
                                    >
                                        <Text
                                            style={{
                                                ...styles.text
                                            }}
                                        > 
                                            { item.Description } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {
                                    type === 'Category' && 
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate( screen, {
                                            category: item,
                                        }) }
                                    >
                                        <Text
                                            style={{ 
                                                ...styles.text
                                            }}
                                        > 
                                            { item.Name } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {
                                    type === 'CurrencyType' &&
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate(screen, {
                                            currencyType: item
                                        }) }
                                    >
                                        <Text
                                            style={{ 
                                                ...styles.text
                                            }}
                                        > 
                                            { item.label } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {
                                    type === 'Establishment' &&
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate(screen, {
                                            establishments: item
                                        }) }
                                    >
                                        <Text
                                            style={{ 
                                                ...styles.text
                                            }}
                                        > 
                                            { item.Name } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {
                                    type === 'Traveler' &&
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate(screen, {
                                            traveler: item
                                        }) }
                                    >
                                        <Text
                                            style={{ 
                                                ...styles.text
                                            }}
                                        > 
                                            { item.FullName } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {
                                    type === 'Approvers' &&
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate(screen, {
                                            approver: item
                                        }) }
                                    >
                                        <Text
                                            style={{ 
                                                ...styles.text
                                            }}
                                        > 
                                            { item.UserFullName } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {
                                    type === 'CostCenter' &&
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate(screen, {
                                            costCenter: item,
                                            index: index
                                        }) }
                                    >
                                        <Text
                                            style={{ 
                                                ...styles.text
                                            }}
                                        > 
                                            { item.CostCenterName } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                                {
                                    type === 'Location' &&
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate(screen, {
                                            location: item,
                                            typeSearch: typeFlight,
                                            index: index
                                        }) }
                                    >
                                        <Text
                                            style={{ 
                                                ...styles.text
                                            }}
                                        > 
                                            { item.name } 
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                    }
                />
            </Animatable.View>
            
        </>
    )
}


const styles = StyleSheet.create({
    text: {
        fontFamily: 'Raleway-Regular',
        marginTop: 10, 
        fontSize: 18
    }
})