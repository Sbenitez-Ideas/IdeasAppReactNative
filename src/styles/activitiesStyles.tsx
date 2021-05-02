import { StyleSheet } from 'react-native';


export const activitiesStyles = StyleSheet.create({ 

    menuItem: {
        flexDirection: 'row', 
        width: 150, 
        paddingTop: 5,
        borderWidth: 1.5, 
    },
    datesContainer: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems:'center', 
        justifyContent: 'space-between',
        borderTopLeftRadius: 10, borderTopRightRadius: 10,
    },
    dataContainer: {
        marginLeft: 12, 
        flex: 1,
        flexDirection: 'row'
    },
    activityState: {
        width: 150, 
        paddingTop: 6.6, 
        paddingBottom: 6.6, 
        borderTopRightRadius: 10, 
    }

})