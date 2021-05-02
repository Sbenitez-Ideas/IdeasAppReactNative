export interface AuthUserSession {
    Address2: string;
    City: string;
    State: string;
    Country: string;
    Culture: string;
    FullName: string;
    Gender: string;
    Language: string;
    MailAddress: string;
    Nickname: string;
    Address: string;
    PostalCode: string;
    RequestTokenSecret: string;
    CreatedAt: Date;
    LastModified: Date;
    Roles: string[];
    Permissions: string[];
    IsAuthenticated: boolean;
    FromToken: boolean;
    ProfileUrl: string;
    Sequence: string;
    Tag: number;
    TimeZone: string;
    AuthProvider: string;
    BirthDateRaw: string;
    PhoneNumber: string;
    ReferrerUrl: string;
    Id: string;
    UserAuthId: string;
    BirthDate: Date;
    UserName: string;
    TwitterUserId: string;
    TwitterScreenName: string;
    UserAuthName: string;
    FacebookUserName: string;
    FirstName: string;
    LastName: string;
    DisplayName: string;
    Company: string;
    Email: string;
    PrimaryEmail: string;
    FacebookUserId: string;
    ProviderOAuthAccess: any[];
}