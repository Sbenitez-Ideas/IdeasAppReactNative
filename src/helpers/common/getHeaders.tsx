import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';

export const getHeader = ( token: string ) => {

    const config = {
        headers: {
            Authorization: `Bearer ${ token }`
        }
    }

    return config;

}




