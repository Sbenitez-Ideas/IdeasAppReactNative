/**
 * Has information about an error in the response for insurance.
 *
 * @export
 * @class ErrorInfo
 */
 export class ErrorInfo {
    Code: string;
    Message: string;
    ContextType: string;
    Context: string;
    StackTrace: string;
    Date: Date;

    constructor() {
        this.Code = '';
        this.Message = '';
        this.ContextType = '';
        this.Context = '';
        this.StackTrace = '';
        this.Date = new Date();
    }
}


