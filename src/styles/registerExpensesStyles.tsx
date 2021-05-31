import { StyleSheet } from "react-native";


export const registerExpenseStyles = StyleSheet.create({
    icon: {
        width: 40,
        textAlign: 'center',
        borderTopLeftRadius: 10,
        paddingTop: 10, 
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textInput: {
        fontSize: 15,
        paddingTop: 20,
        paddingLeft: 20,
        fontFamily: 'Raleway-Regular'
    },
    buttonSave: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
})