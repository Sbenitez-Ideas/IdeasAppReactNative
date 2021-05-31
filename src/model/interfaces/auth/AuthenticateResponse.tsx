export interface AuthenticateResponse {
    UserId: string;
    SessionId: string;
    UserName: string;
    DisplayName: string;
    ReferrerUrl: string;
    BearerToken: string;
    RefreshToken: string;
    ProfileUrl: string;
    Roles: string[];
    Permissions: string;
    /* ResponseStatus: ResponseStatus; */
}
