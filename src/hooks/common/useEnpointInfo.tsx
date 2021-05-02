import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IFTPEndPointRS } from '../../interfaces/auth/IFTPEndPointRS';
import { EndPointApp } from '../../interfaces/auth/EndPointApp';
import { useEffect } from 'react';

export const useEnpointInfo = ()  => {
    const [enpoint, setEnpoint] = useState<IFTPEndPointRS>({
        AppEndPoint: endPointApp,
        Status: false
    });

    const getEnpointInfo = async() => {
        try {
            await AsyncStorage.getItem('endpointData').then((value) => {
                const transformData: IFTPEndPointRS = JSON.parse(value as string);
                setEnpoint(transformData);
            })
        } catch (error) {
        }
    }

    useEffect(() => {

        getEnpointInfo();

    }, [])

    return {
        enpoint
    };
}


const endPointApp: EndPointApp = {
    AppName: '',
    EndPoint: '',
    Platform: '',
    VersionApp: '',
    VersionEndPoint: '',
    AppTitle: '',
    AppGCMSenderId: '',
    AppURLLogos: '',
    AppURLBaggages: '',
    AppCurrency: '',
    AppCountry: '',
    VersionDate: new Date(),
    MandatoryUpdate: '',
    AppNotTitle: '',
    AppUrlLogo: '',
    AppUrlAndroid: '',
    AppUrlIOS: '',
    AppConsumerId: ''
};


