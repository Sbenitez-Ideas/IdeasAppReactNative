/**
 * Values for select fields for udids dynamic fields.
 *
 * @export
 * @class SelectFieldValues
 */
 export class SelectFieldValues {
    ClassDescription: string;
    ClassName: string;
    IDClass: number;
    IDEntity: number;
    IDList: string;
    ListCode: string;
    ListDescription: string;
    ListValue: string;
    ListCodeAdditional1: string;
    ListCodeAdditional2: string;
    ListClientCode: string;
    IsDependent: string;
    ClassDependent: string;
    ListCodeDependent: string;

    constructor() {
        this.ClassDescription = '';
        this.ClassName = '';
        this.IDClass = -2;
        this.IDEntity = -1;
        this.IDList = '';
        this.ListCode = '';
        this.ListDescription = '';
        this.ListValue = '';
        this.ListCodeAdditional1 = '';
        this.ListCodeAdditional2 = '';
        this.ListClientCode = '';
        this.IsDependent = '';
        this.ClassDependent = '';
        this.ListCodeDependent = '';
    }
}

