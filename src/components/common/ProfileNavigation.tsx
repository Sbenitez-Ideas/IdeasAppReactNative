import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { ThemeContext } from '../../contexts/theme/ThemeContext';

export const ProfileNavigation = ({ navigation }: any) => {

    const { userData } = useContext( AuthContext );
    const { theme: { buttonText } } = useContext( ThemeContext );
    
    return (
        <>
            <TouchableOpacity style={{ flexDirection: 'row',}}
            onPress={ () => navigation.navigate('ProfileScreen') }>
            <Icon
                style={{ 
                    color: buttonText,
                    marginTop: 7
                }}
                name="person-circle"
                color={ buttonText }
                size={30} />            
            
            </TouchableOpacity>
           
        </>
    )
}
