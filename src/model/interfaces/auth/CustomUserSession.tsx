import { EntityParams } from "../common/EntityParams";
import { AuthUserSession } from "./AuthUserSession";


export interface CustomUserSession extends AuthUserSession {
    IDUser: number;
    PhotoUrl: string;
    IDEntity: number;
    IDEntityDefault: number;
    IDEntityAssigned: number;
    EntityName: string;
    LogoEntity: string;
    SymbolLogoEntity: string;
    JobTitle: string;
    Password: string;
    UserState: string;
    UserType: string;
    ResetPassword: boolean;
    EntityDefaultName: string;
    EntityAssignedName: string;
    TypeEntity: number;
    TypeEntityDefault: number;
    TypeEntityAssigned: number;
    ISO2pais: string;
    CurrencyDomain: string;
    CurrencyConversion: string;
    ConversionValue: number;
    Login: string;
    TCAccepted: boolean;
    Params: EntityParams;
    BookigOfficialPass: boolean;
    BookingGuestPass: boolean;
    ApproverExpenses: boolean;
}

export interface User {
    uid: string;
    name: string;
}