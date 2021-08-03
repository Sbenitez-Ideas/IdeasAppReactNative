import { CustomUserSession } from '../../model/interfaces/auth/CustomUserSession';
import { TravelerCorporate } from '../../model/classes/corporate/TravelerCorporate';
import update from 'immutability-helper';


export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    errorMessage: string;
    user: string | null;
    travelerRequestData: any;
    selectedTravelers: TravelerCorporate[];
    selectedServices: { service: any, completed: boolean }[];
    userData: CustomUserSession
}

type AuthAction = 
    | { type: 'signUp', payload: { token: string, user: string, userData: CustomUserSession } }
    | { type: 'addError', payload: string }
    | { type: 'removeError'}
    | { type: 'notAuthenticated' }
    | { type: 'logout' }
    | { type: 'assignTravelers', payload: { travelers: TravelerCorporate[] } }
    | { type: 'assignMotive', payload: { motive: { ID: string, Text: string } } }
    | { type: 'assignApprover', payload: { approver: { approverName: string, idApprover: number } } }
    | { type: 'assignPassenger', payload: { IDUser: number } }
    | { type: 'assignSelectedServices', payload: { services: { service: any, completed: boolean }[] } }


export const authReducer = ( state: AuthState, action: AuthAction ): AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'not-authenticated',
                token: null,
                errorMessage: action.payload
            };

        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            };

        case 'signUp':
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user,
                userData: action.payload.userData
            }

        case 'assignTravelers':
            return {
                ...state,
                selectedTravelers: action.payload.travelers
            }

        case 'assignMotive':
            return {
                ...state,
                travelerRequestData: { ...state.travelerRequestData, motive: action.payload.motive }
            }

        case 'assignApprover':
            return update( state, 
                {
                    selectedTravelers: {
                        0: {
                            Approver3: { $set: action.payload.approver.approverName },
                            IdApprover3: { $set: action.payload.approver.idApprover }
                        }
                    }
                }
            )
            
        case 'assignPassenger':
            return {
                ...state,
                travelerRequestData: { ...state.travelerRequestData, passenger: action.payload.IDUser }
            }

        case 'assignSelectedServices':
            return {
                ...state,
                selectedServices: action.payload.services
            }

        case 'notAuthenticated':
        case 'logout':
            return  {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null,
            }
            
        
        default:
            return state;
    }
}