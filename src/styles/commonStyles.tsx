import { Platform, StyleSheet } from "react-native";


export const commonStyles = StyleSheet.create({

    container: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 1
    },
    title: {
        marginTop: 60,
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    goutContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
        width: 155,
        marginTop: 50,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        borderTopRightRadius: 15,
    },
    textMenu: {
        top: 30,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        fontWeight: 'bold'
    },
    iconsMenu: {
        top: 25
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        
    },
    rightButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 50,
        width: 100,
        marginRight: 10
    },
    buttonCenter: {
        alignItems: 'center',
        marginTop: 50
    },
    buttonText: {
        fontSize: 15,
    },
    entireButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSubtitle: {
        fontSize: 20,
        marginTop: 10
    },
    horizontallyAligment: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    aditionalInfo: {
        color: '#666666'
    },
    rightButtonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    smallButton: {
        height: 20,
        justifyContent: 'center',
        padding: 1,
        alignItems: 'center',
        borderRadius: 5
    },
    icon: {
        width: 40,
        textAlign: 'center',
        borderTopLeftRadius: 10,
        paddingTop: 10, 
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textInputRegister: {
        fontSize: 20,
        paddingTop: 20,
        paddingLeft: 20
    },
    buttonSave: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    dataContainer: {
        flexDirection: 'row',
        marginTop: 5
    },
    infoExpense: {
        fontSize: 15,
    },
    stateContainer: {
        maxWidth: 130, 
        width: 100, 
        padding: 6.6,
        borderRadius: 5,
        maxHeight: 35,
    },
    basicCard: {
        justifyContent: 'space-between', 
        flexDirection: 'row'
    },
    reviewContainer: {
        marginTop: 10, 
        paddingBottom: 10, 
        width: '97%', 
        alignSelf: 'center', 
        borderRadius: 10
    }

});