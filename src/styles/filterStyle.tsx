import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    subtitleContainer: {
        marginLeft: 10,
        flexDirection: 'row',
        borderBottomWidth: 3,
    },
    titleFilter: {
        fontSize: 35
    },
    textInput: {
        fontSize: 20,
        paddingTop: 20,
        paddingLeft: 20
    },
    icon: {
        width: 40,
        textAlign: 'center',
        borderTopLeftRadius: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30
    },
    buttons: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    contentRange: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        marginTop: 10
      },
      contentResultRange: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
      },
      lineCategory: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
      }
})