import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext } from 'react'
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../contexts/auth/AuthContext';
import { ThemeContext } from '../../contexts/theme/ThemeContext';


interface Props {
    navigation: any,
    color?: string
}

export const ProfileNavigation = ({ navigation, color }: Props) => {

    const { userData } = useContext( AuthContext );
    const { theme: { buttonText, colors } } = useContext( ThemeContext );
    
    return (
        <>
            <TouchableOpacity style={{ flexDirection: 'row',}}
            onPress={ () => navigation.navigate('ProfileScreen') }>
            <Icon
                style={{ 
                    color: (color !== undefined ) ? color : buttonText,
                    marginTop: 7,
                    marginHorizontal: 10
                    
                }}
                name="person-circle"
                size={30} />            
            
            </TouchableOpacity>
           
        </>
    )
}
