import { ExpenseActivitiesRS } from "../../interfaces/viatics/ExpenseActivitiesRS";


export interface ActivitiesState {
    type: 'all' | 'pendingApprove' | 'pedingLegalize';
    errorMessage: string;
    activitiesData: ExpenseActivitiesRS;
}


type ActivitiesAction = 
    | { type: 'getActivities', payload: { type: 'all' | 'pendingApprove' | 'pedingLegalize', activitiesData: ExpenseActivitiesRS  } }
    | { type: 'addError', payload: string }

export const activitiesReducer = ( state: ActivitiesState, action: ActivitiesAction ): ActivitiesState => {
    switch ( action.type ) {
        case 'getActivities':
            return {
                ...state,
                type: action.payload.type,
                errorMessage: '',
                activitiesData: action.payload.activitiesData
            }
            
        default:
            return state;
    }
}