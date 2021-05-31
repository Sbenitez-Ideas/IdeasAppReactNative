import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRoute, faThLarge, faCalendarMinus, faTable, faCoins, faSearchDollar, faMoneyCheckAlt, faBook, faFileInvoiceDollar, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { loginStyles } from '../../styles/loginStyles';
import { commonStyles } from '../../styles/commonStyles';
import LinearGradient from 'react-native-linear-gradient';
import { registerExpenseStyles } from '../../styles/registerExpensesStyles';
import { ScrollView, FlatList, Switch } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { ThemeContext } from '../../contexts/theme/ThemeContext';
import {CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { CalendarSingleDate } from '../../components/common/CalendarSingleDate';
import Moment from 'moment';
import NumberFormat from 'react-number-format';
import DropDownPicker from 'react-native-dropdown-picker';
import { RootStackParams } from '../../navigator/Navigator';
import { GActivities } from '../../model/interfaces/viatics/GActivities';
import { ExpenseCategories } from '../../model/classes/viatics/ExpenseCategories';
import { getPaymentType } from '../../helpers/viatics/getPaymentType';
import { CurrencyTypes } from '../../model/classes/viatics/CurrencyTypes';
import { GExpenses } from '../../model/interfaces/viatics/GExpenses';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { ExpensesSaveRQ } from '../../model/interfaces/viatics/ExpensesSaveRQ';
import { DateObject } from 'react-native-calendars';
import { Establishment } from '../../model/classes/viatics/Establishment';
import { viaticsApi } from '../../api/viaticsApi';
import { ImagesExpense } from '../../model/classes/viatics/ImagesExpense';
import { GetExpenseImage } from '../../model/classes/viatics/GetExpenseImages';
import { randomGuid } from '../../helpers/common/randomGuid';
import { ExpenseActivitiesRQ } from '../../model/classes/viatics/ExpenseActivitiesRQ';
import { CategoriesEntity } from '../../model/classes/viatics/CategoriesEntity';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/common/Header';
import { ProfileNavigation } from '../../components/common/ProfileNavigation';
import { TextField, FilledTextField, OutlinedTextField } from 'rn-material-ui-textfield'
import { useFont } from '../../hooks/common/useFont';
import { color } from 'react-native-reanimated';
import { FilledInputText } from '../../components/common/FilledInputText';
import { DynamicText } from '../../components/common/DynamicText';

interface Props extends StackScreenProps<RootStackParams, 'RegisterExpensesScreen'>{
    activity: GActivities,
};

export const RegisterExpensesScreen = ({ navigation, route }: Props) => {
    const { t } = useTranslation();
    const params = route.params;
    const { userData: { IDEntityDefault, IDUser, Params } } = useContext( AuthContext );
    const { saveExpenses, saveImage, getActivities, getCategories } = viaticsApi();
    const [showToast, setshowToast] = useState(false);
    const [activity, setActivity] = useState<GActivities>( new GActivities );
    const [category, setCategory] = useState<ExpenseCategories>( new ExpenseCategories )
    const [currency, setCurrency] = useState<CurrencyTypes>( new CurrencyTypes );
    const [establishment, setEstablishment] = useState<Establishment>( new Establishment );
    const [expense, setExpense] = useState( new GExpenses );
    const [images64, setImages64] = useState<string[]>([]);
    const [imagesUpload, setImagesUpload] = useState<string[]>([]);
    const [showcalendar, setShowcalendar] = useState(false);
    const [manualEstablishment, setManualEstablishment] = useState(false);
    const [showFields, setShowFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        activityName: '',
        categoryName: '',
        date: '',
        description: '',
        currencyType: ''
    });

    const { regular, semibold } = useFont();

    const showEstablishment = () => {
        switch (Params.VIATSOLICITARESTABLECIMIENTOS) {
            case 'N':
                (activity.interNal === 'N') && setShowFields( true );
                break;
            case 'I':
                (activity.interNal === 'I') && setShowFields( true );
                break;
            case 'A':
                setShowFields( true );
                break;
        }
    }


    const fillActivityData = async() => {
        const request: ExpenseActivitiesRQ = {
            IDUser: IDUser,
            IDEntity: IDEntityDefault,
            excludeImages: true,
            FilterType: 3
        };
        await getActivities( request )
        .then(( response ) => {        
            const filterActivity = response.ListActivities.filter( a => a.IDGroup ===  params.expense?.IDGroup);
            setActivity( filterActivity[0] );
        })
    }

    const fillCategoryData = async() => {
        const request = new  CategoriesEntity();
        request.IDEntity = IDEntityDefault;
        await getCategories( request )
            .then(( response ) => {
                const filterCategory  = response.filter( a => a.ID  ===  params.expense?.IDCategory);
                setCategory( filterCategory[0] );
            })
        
    }


    useEffect(() => {
    }, [activity, category])

    useEffect(() => {

        if ( params?.type == 'edit' && params?.expense ) {
            setExpense( params.expense )
            fillActivityData();
            fillCategoryData();
        }
        
        if (params?.activity ) {
            setActivity( params.activity );
            setExpense({ 
                ...expense,
                IDGroup: params.activity.IDGroup,
                IDEntity: IDEntityDefault,
                IDUser: IDUser,
                LegalizeNote: '',
                State: 'P',
                HasAttach: true,
            })
            

            showEstablishment();
    
        }

        if ( params?.category ) {
            setCategory(  params.category );
            setExpense({
                ...expense,
                IDCategory: params.category.ID
            })
        }

        if ( params?.currencyType ) {
            setCurrency( params.currencyType );
            setExpense({
                ...expense,
                Currency: params.currencyType.value
            })
        }

        if ( params?.establishments ) {
            setEstablishment( params.establishments )
            setExpense({
                ...expense,
                IDEstablishment:  params.establishments.IDEstablisment,
                DocumentNumber: params.establishments.ID
            })
        }

    }, [params])
       
    const [formatValuesExpenses, setFormatValuesExpenses] = useState({
        expenseCash: '',
        tipValue: '',
        taxValue: '',
        totalExpense: '',
        creditValue: ''
    })

    const convertDate = (registerForm.date !== '') ? Moment(registerForm.date).format('ll') : registerForm.date;

    const runCamera = ( ) => {
        const options: CameraOptions = {
            mediaType: 'photo',
            includeBase64: true
        }
        launchCamera(options, (resp) => {
            const image = resp.uri as string;
            const parts = image.substring(image.lastIndexOf('.') + 1, image.length);        
            const base64 = resp.base64;
            const imageType = 'data:image/' + parts + ';base64,' + base64;
            setImages64([
                ...images64,
                imageType
            ]);
            setImagesUpload([
                ...imagesUpload,
                resp.uri as string
            ]);
        });
    }

    const openGallery = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo'
        }
        launchImageLibrary(options,  ( resp ) => {
            const image = resp.uri as string;
            const parts = image.substring(image.lastIndexOf('.') + 1, image.length);        
            const base64 = resp.base64;
            const imageType = 'data:image/' + parts + ';base64,' + base64;
            setImages64([
                ...images64,
                imageType
            ]);
            setImagesUpload([
                ...imagesUpload,
                resp.uri as string
            ]);
        });
    }

    const hideCalendar = ( show: boolean ) => {
        setShowcalendar( show );
    }

    const setDate =  ( data: DateObject ) => {
        setRegisterForm({
            ...registerForm,
            date: data.dateString
        })
        setExpense({
            ...expense,
            Date: new Date(data.dateString)
        })
    }

    const openSearch =  ( type: 'Activities' | 'Category' | 'CurrencyType' | 'Establishment') => {
        navigation.navigate('AutoCompleteSearch',  {
            type: type,
            screen: 'RegisterExpensesScreen'
        })
    }

    useEffect(() => {
    }, [imagesUpload, images64])

    const removeImage = (index: number) => {
        setImagesUpload( images => images.filter(( img, i  ) => i !== index) )
        setImages64( images => images.filter(( img, i ) => i !== index ) )
    }

    const setTotal = () => {
        const total = ( ((expense.ExpenseCash) ? expense.ExpenseCash : 0 ) +  
        ( (expense.TaxValue) ? expense.TaxValue : 0 ) + ( (expense.TipValue) ? expense.TipValue : 0 ) +
        ( (expense.ExpenseCC) ? expense.ExpenseCC : 0 ) );
        return  (total === 0) ? 'Total Gastos' : total.toString();
    }

    const { theme: { colors, secondary, buttonText, fieldColor, grayColor } } = useContext( ThemeContext );
    const { width } = Dimensions.get('window');


    const validateFields = (): boolean => {
        let canSave: boolean = true;
        if ( expense.IDGroup === ''  || !expense.IDGroup ) {
            setshowToast(!showToast);
            loadToast( t( 'resNoSeleccionadoActividad' ) );
            canSave = false;
        } else if ( expense.IDCategory === undefined ) {
            setshowToast(!showToast);
            loadToast( t( 'resNoSeleccionadoCategoria' ) );
            canSave = false;
        } else if ( expense.Date === undefined ) {
            loadToast( t( 'resNoSeleccionadoFecha' ) );
            canSave = false;
        } else if ( expense.Description === undefined ) {
            loadToast( t( 'resEscribaDescripcion' ) );
            canSave = false;
        } else if ( expense.PaymentType === undefined ) {
            loadToast( t( 'resNoSeleccionadoTipoPago' ) );
            canSave = false;
        }  else if ( expense.Currency === undefined ) {
            setshowToast(!showToast);
            loadToast( t( 'resSeleccioneMoneda' ) );
            canSave = false;
        } else if ( expense.IDEstablishment === undefined && !manualEstablishment && showFields )  {
            loadToast( t( 'resNoSeleccionadoEstablecimiento' ) );
            canSave = false;
        } else if ( manualEstablishment && expense.nameEstablishment ) {
            loadToast( t( 'resNoIngresadoEstablecimientoManual' ) );
            canSave = false;
        } else if ( manualEstablishment && expense.nitEstablishment ) {
            loadToast( t( 'resNoIngresadoNitManual' ) );
            canSave = false;
        } else if ( expense.PaymentType === 'C' || expense.PaymentType === 'D' || expense.PaymentType === 'P' ) {
            if ( expense.ExpenseCash === undefined ) {
                loadToast( t( 'resNoIngresadoValorEfectivo' ) );
                canSave = false;
            }
        } else if ( expense.PaymentType === 'R' ) {
            if ( expense.ExpenseCC === undefined ) {
                loadToast( t( 'resNoIngresadoValorCredito' ) );
                canSave = false;
            }
        } else if ( expense.PaymentType === 'B' ) {
            if ( expense.ExpenseCash === undefined ) {
                loadToast( t( 'resNoIngresadoValorEfectivo' ) );
                canSave = false;
            } else {
                loadToast( t( 'resNoIngresadoValorCredito' ) );
                canSave = false;
            }
        } 

        return canSave;
    }

    const loadToast = ( messageError: string ) => {
        Toast.show({
            text1: 'Error',
            text2: messageError,
            type: 'error',
            visibilityTime: 1000,
        })
    }

    const saveExpense = async( ) => {
        if (validateFields()) {
            setLoading( !loading );
            const request = new ExpensesSaveRQ();
            request.IDUserApprover = activity.IDApproverUser
            request.Action = 'save';
            request.Data = [];
            request.Data.push( expense );
            await saveExpenses( request )
                .then(( response ) => {
                    setLoading( false );
                    if ( response.Success ) {
                        saveImages( response.Data[0].IDExpense );
                        Toast.show({
                            text1: t( 'resGuardado' ),
                            text2: t( 'resGastoGuardado' ),
                            type: 'success',
                            visibilityTime: 1500,
                            onHide: () =>  {
                                navigation.navigate('HomeViaticsScreen')
                            }
                        });
                    }
                })
        }
    }

    const saveImages = ( idExpense: string ) => {
        const imagesList: ImagesExpense[] = [];
        const request  = new GetExpenseImage();
        images64.forEach( img  => {
            const objectFill: ImagesExpense ={
                IDExpense: idExpense,
                IDImage: randomGuid(),
                ImageBase64: img,
                ImageUnit8: [],
                fileNameImg: '',
                year: (new Date().getFullYear()).toString(),
                month: (new Date().getMonth()).toString()
            }
            imagesList.push( objectFill );
        });

        request.ListImages = imagesList;
        saveImage( request )
            .then(( response ) => {
            })

    }

    return (
        <>
        <Header 
            title={  t( 'resRegistraNuevoGasto' ) }
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
                    <ProfileNavigation navigation={ navigation } />
                )
            } }
        />
        <ScrollView>            
            <View style={{ 
                ...commonStyles.container,
                alignItems: 'stretch',
                bottom: 40
            }}>
                    {/* <View style={ commonStyles.rightButtonContainer }>
                        <TouchableOpacity
                            onPress={ () => navigation.goBack() }
                            style={commonStyles.rightButton}>
                            <LinearGradient
                                colors={[colors.primary, secondary]}
                                style={commonStyles.rightButton}
                            >
                                <Text style={[commonStyles.buttonText, {
                                    color:'#fff'
                                }]}>{ t( 'resCancelar' ) }</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{ top: 50, ...commonStyles.rightButtonContainer, zIndex: 10 }}>
                        <TouchableOpacity
                            onPress={ () => navigation.navigate('RegisterActivityScreen', {}) }
                            >
                            <Icon
                                style={{  }}
                                name="add-circle"
                                color={ colors.primary }
                                size={ 30 }
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <Animatable.View
                        style={[loginStyles.footer, {
                            backgroundColor: colors.background
                            }]}
                        animation="fadeInUpBig">
                        <TouchableOpacity
                            onPress={ () => {  
                                if ( showToast ) {
                                    Toast.hide();    
                                }
                                openSearch('Activities') 
                            }}
                        >
                            <FilledInputText label={ t( 'resActividadesGastos' ) } disabled={  true }  value={ activity?.Description } />
                            {/* <FilledTextField
                                disabled={ true }
                                label={ t( 'resActividadesGastos' ) }
                                tintColor={ colors.primary }
                                baseColor={ accent }
                                titleTextStyle={{ fontFamily: regular }}
                                labelTextStyle={{ fontFamily: regular, }}
                                labelFontSize={ 18 }
                                inputContainerStyle={{ backgroundColor: fieldColor, borderRadius: 6 }}
                                activeLineWidth={ 0 }
                                lineWidth={ 0 }
                                contentInset={{ top: 10 }}

                            /> */}
                                {/* <TextInput
                                    editable={ false }
                                    keyboardType="visible-password"
                                    placeholder={ t( 'resActividadesGastos' ) }
                                    autoCapitalize="none"
                                    placeholderTextColor="#666666"
                                    style={{
                                        ...commonStyles.textInput,
                                        ...registerExpenseStyles.textInput,
                                        color: colors.text,
                                    }}
                                    value={ activity?.Description }
                                /> */}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={ () => { 
                                if ( showToast ) {
                                    Toast.hide();    
                                }
                                openSearch(  'Category' ) ;  
                            }}
                        >
                            <FilledInputText label={ t( 'resCategorias' ) } disabled={ true }  value={ category.Name } />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={ () => hideCalendar( !showcalendar ) }
                        >
                            <FilledInputText label={ t( 'resFecha' ) } disabled={ true }  value={  convertDate || Moment(expense.Date).format('ll') } />
                        </TouchableOpacity>
                        { showcalendar &&
                            <CalendarSingleDate showCalendar={ hideCalendar } setDate={ setDate }></CalendarSingleDate>
                        }
                        <FilledInputText label={ t( 'resDescripcion' ) } 
                            onChangeText={ ( value ) =>  
                                setExpense({ 
                                    ...expense, 
                                    Description: value
                                }) 
                            }  
                            disabled={ false }  value={ expense.Description } 
                        />
                        <DropDownPicker
                            dropDownMaxHeight={ 200 }
                            defaultValue={ expense.PaymentType }
                            placeholder={ t( 'resTipoPago' ) }
                            labelStyle={{ 
                                color: colors.text,
                                fontSize: 20,
                                fontFamily: regular,
                            }}
                            items={ getPaymentType() }
                            containerStyle={{ width:  width / 1.5, borderRadius: 10 }}
                            style={{
                                backgroundColor: fieldColor,
                                borderColor: 'transparent',
                            }}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{backgroundColor: colors.background}}
                            onChangeItem={(item) =>  setExpense({
                                ...expense,
                                PaymentType: item.value
                            }) }
                        />
                    
                        <TouchableOpacity
                            style={{ paddingTop: 8 }}
                            onPress={ () =>  openSearch( 'CurrencyType' ) }
                        >
                            <FilledInputText label={ t( 'resTipoMoneda' ) } disabled={ true }  value={ currency.label || expense.Currency } />
                        </TouchableOpacity>                             
                        
                        { expense.PaymentType !== 'R' &&
                            <NumberFormat value={ formatValuesExpenses.expenseCash || expense.ExpenseCash } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                onValueChange={ ( values ) => {
                                    const {formattedValue, value} = values;
                                    setExpense({
                                        ...expense,
                                        ExpenseCash: +value
                                    });
                                } }
                                renderText={ valueRender => (
                                    <FilledInputText label={ t( 'resVEfectivo' ) } disabled={ false } 
                                    onChangeText={ ( value ) =>  
                                        setFormatValuesExpenses({
                                            ...formatValuesExpenses,
                                            expenseCash: value,
                                        })
                                    }   
                                    onBlur={ setTotal }
                                    value={ valueRender } />
                                )}
                            />
                        }
                        { ( expense.PaymentType === 'B' || expense.PaymentType === 'R') &&
                            <NumberFormat value={ formatValuesExpenses.creditValue } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                                onValueChange={ ( values ) => {
                                    const {formattedValue, value} = values;
                                    setExpense({
                                        ...expense,
                                        ExpenseCC: +value
                                    });
                                } }
                                renderText={ valueRender => (
                                    <FilledInputText label={ t( 'resVCredito' ) } disabled={ false } 
                                    onChangeText={ ( value ) =>  
                                        setFormatValuesExpenses({
                                            ...formatValuesExpenses,
                                            creditValue: value,
                                        })
                                    }   
                                    onBlur={ setTotal }
                                    value={ valueRender } />
                                )}
                            />
                        }
                        <DynamicText fontFamily={ semibold }
                            style={{ 
                                ...commonStyles.textSubtitle,
                                color: colors.primary,
                                marginBottom: 20
                            }}
                        > 
                            { t( 'resGastosMonedaActividad' ) }
                        </DynamicText>
                        <NumberFormat value={ formatValuesExpenses.tipValue } displayType={'text'} thousandSeparator={true} prefix={'$'}
                            onValueChange={ ( values ) => {
                                const {formattedValue, value} = values;
                                setExpense({
                                    ...expense,
                                    TipValue: +value
                                })
                            } }
                            renderText={ valueRender => (
                                <FilledInputText label={ t( 'resVPropina' ) } disabled={ false } 
                                    onChangeText={ ( value ) =>  
                                        setFormatValuesExpenses({
                                            ...formatValuesExpenses,
                                            tipValue: value
                                        })
                                    }   
                                    onBlur={ setTotal }
                                    value={ valueRender } 
                                />
                            )}
                        />
                        <NumberFormat value={ formatValuesExpenses.taxValue } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                            onValueChange={ ( values ) => {
                                const {formattedValue, value} = values;
                                setExpense({
                                    ...expense,
                                    TaxValue: +value
                                })
                            } }
                            renderText={ valueRender => (
                                <FilledInputText label={ t( 'resVImpuestos' ) } disabled={ false } 
                                    onChangeText={ ( value ) =>  
                                        setFormatValuesExpenses({
                                            ...formatValuesExpenses,
                                            taxValue: value
                                        })
                                    }   
                                    onBlur={ setTotal }
                                    value={ valueRender } 
                                />
                            )}
                        />
                        
                        <NumberFormat value={ setTotal() } displayType={'text'} thousandSeparator={true} prefix={'$'} 
                            renderText={ valueRender => (
                                <FilledInputText label={ t( 'resTotalGastos' ) } disabled={ true } 
                                    onBlur={ setTotal }
                                    value={ valueRender } 
                                />
                            )}
                        />
                            
                        { ( showFields && !manualEstablishment ) &&
                        
                            <TouchableOpacity
                                onPress={ () => openSearch('Establishment') }
                            >
                                <FilledInputText label={ t( 'resEstablecimiento' ) } disabled={ true } value={ establishment.Name }  />
                            </TouchableOpacity>
                        }
                        
                        { showFields &&
                            <View style={{
                                ...commonStyles.action,
                                marginTop: 40,
                                borderBottomColor: 'transparent'
                            }}>
                                <Switch
                                    trackColor={{ false: grayColor, true: secondary }}
                                    thumbColor={manualEstablishment ? colors.primary : "#ECECEC"}
                                    onValueChange={ () => setManualEstablishment(previousState => !previousState)}
                                    value={manualEstablishment}
                                ></Switch>
                                <DynamicText 
                                    fontFamily={ semibold }
                                    style={{ 
                                        ...commonStyles.textSubtitle,
                                        color: colors.text,
                                        marginTop: 0
                                    }}
                                > { t( 'resEstablecimientoManual' ) } </DynamicText>
                            </View>
                        }
                        {
                            ( showFields && manualEstablishment ) &&
                            <>
                                <FilledInputText label={ t( 'resNombreEstablecimiento' ) } disabled={ false } 
                                    onChangeText={ ( value ) =>  
                                        setExpense({
                                            ...expense,
                                            nameEstablishment: value
                                        })
                                    }   
                                    value={ expense.nameEstablishment } 
                                />
                                <FilledInputText label={ 'NIT' } disabled={ false } 
                                    onChangeText={ ( value ) =>  
                                        setExpense({
                                            ...expense,
                                            nitEstablishment: value
                                        })
                                    }   
                                    value={ expense.nitEstablishment } 
                                />
                            </>
                        }
                        <View style={{ 
                            ...commonStyles.horizontallyAligment,
                            justifyContent: 'space-around',
                            marginTop: 15
                        }}> 
                            <TouchableOpacity 
                                onPress={ runCamera }
                                style={{ alignItems: 'center' }}>
                                
                                <Icon 
                                    name="camera"
                                    color={ colors.primary }
                                    size={ 50 }
                                />
                                <DynamicText style={ commonStyles.aditionalInfo }>{ t( 'resTomarFoto' ) }</DynamicText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={ openGallery }
                                style={{ alignItems: 'center' }}
                            >
                                <Icon 
                                    name="image"
                                    color={ colors.primary }
                                    size={ 50 }
                                />
                                <DynamicText style={ commonStyles.aditionalInfo }>{ t( 'resAdjuntarGaleria' ) }</DynamicText>
                            </TouchableOpacity>
                        </View>
                        <View style={commonStyles.buttonCenter}>
                            <TouchableOpacity
                                onPress={ () => saveExpense() }
                                style={{
                                    ...commonStyles.entireButton,
                                    
                                }}>
                                <LinearGradient
                                    colors={[colors.primary, secondary]}
                                    style={ registerExpenseStyles.buttonSave }
                                >
                                    <DynamicText  fontFamily={ semibold }  style={[commonStyles.buttonText, {
                                        color: buttonText
                                    }]}> { t( 'resGuardar' ) } </DynamicText>
                                </LinearGradient>
                            </TouchableOpacity>
                            {
                                loading &&  
                                <ActivityIndicator
                                    size="large"
                                    animating={ true }
                                    color={ colors.primary }
                                ></ActivityIndicator>
                            }
                        </View>
                </Animatable.View>
            </View>
        </ScrollView>
        </>
    )
}
