import { ItemType } from "react-native-dropdown-picker"


export const getSchedules = () => {
    const schedules:  Array<ItemType> = [
        {
            label: 'Todos',
            value: '3'
        },
        {
            label: 'Mañana',
            value: '0'
        },
        {
            label: 'Tarde',
            value: '1'
        },
        {
            label: 'Noche',
            value: '2'
        }
    ]

    return schedules;
}