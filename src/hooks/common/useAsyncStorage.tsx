import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useAsyncStorage = (key: string): string => {

    const [state, setState] = useState({
        storageValue: ''
    })
    const { storageValue } = state

    async function pullFromStorage() {
        const fromStorage = await AsyncStorage.getItem(key)
        let value = '';
        if (fromStorage) {
        value = JSON.parse(fromStorage)
        }
        setState({ storageValue: value });
    }

      useEffect(() => {
        pullFromStorage();
    }, []);

    return storageValue;
};

export default useAsyncStorage
