

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

interface Props extends StackScreenProps<RootStackParams, 'AutoCompleteSearch'> {};

export const AutoCompleteSearch = ({ route, navigation }: Props) => {
    const { t } = useTranslation();
    const [items, setItems] = useState<GActivities[] | ExpenseCategories[] | CurrencyTypes[] | Establishment[]>([]);
    const { getActivities, getCategories, getEstablishments } = viaticsApi();
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
    const screen = route.params.screen;
    useEffect(() => {

        switch( type ) {
            
            case 'Activities':
                navigation.setOptions({ title: 'Búsqueda de Actividades' })
                break;
            case 'Category':
                navigation.setOptions({ title: 'Búsqueda de Categorias' })
                break;
            case 'CurrencyType':
                navigation.setOptions({ title: 'Tipo de Moneda' })
                break;
            case 'Establishment':
                navigation.setOptions({ title: 'Establecimientos' })
                break;
            default:
                break;         
        }

        setRequests();


    }, [])


    const setRequests = () => {
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
            default:
                break;         
        }

        if ( searchData.searchedValue ||  type ) {
            getItems();
        }
    }

    const getItems = () => {
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
                    })
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

    const pushItemsResponse = (response: ExpenseActivitiesRS | ExpenseCategories[] | CurrencyTypes[] | Establishment[], type: string) =>  {
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

                default:
                    break;
            }
        }
    }

    return (
        <>
            <Header 
                title={ 'Búsqueda de Actividades'}
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
                onChangeText={ ( value ) => setSearchData({
                    ...searchData,
                    searchedValue: value
                })}
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
                                    type == 'CurrencyType' &&
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
                                    type == 'Establishment' &&
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