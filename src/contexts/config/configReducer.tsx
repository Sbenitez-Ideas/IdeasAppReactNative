import { IFTPEndPointRS } from "../../interfaces/auth/IFTPEndPointRS";

export interface configState {
    AppData: IFTPEndPointRS | null;
    Status: boolean;
    Msg: string;
}
type AuthAction = 
    | { type: 'getEndpointData', payload: {AppData: IFTPEndPointRS} }

export const configReducer = ( state: configState, action: AuthAction): configState => {
    switch (action.type) {
        case 'getEndpointData':
            return {
                ...state,
                Status: true,
                AppData: action.payload.AppData,
                Msg: ''
            }
    
        default:
            return state;
    }
}