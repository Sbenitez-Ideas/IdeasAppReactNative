export class EnhancedRetrieveInternalRQ
    {
        RecordLocator: string;
        /**Lenguaje ES:Espanish, GB: English, PT: Portuguese */
        Language: string;
        /**Received from */
        RF: string;
        /**Session token */
        SessionToken: string;
        /**Fare expiration same day */
        FareExpSameDay: boolean;
        /**Greenwich Mean Time */
        GMT: number;
        /**Get corporate params or info */
        GetCorporateParams: boolean;

        RecalculateFeeRetrieve: boolean;
        
        Issued: boolean;
    }