import { SelectFieldListReference } from "./SelectFieldListReference";
import { SelectFieldValues } from "./SelectFieldValues";


/**
 * Describes a dynamic field for the udids form.
 *
 * @export
 * @class DynamicFields
 */
export class DynamicFields {
    Caption: string;
    CreatedBy: string;
    CreationDate: Date;
    DataType: string;
    DefaultValue: any;
    IDClass: number;
    IDEntity: number;
    IDField: number;
    Mandatory: string;
    Origin: string;
    ProductType: string;
    ReferenceField: string;
    Remark: string;
    UseSelectList: string;
    UserType: string;
    Status: 'A' | 'I';
    Order: number;
    VisibilityBy: string;
    Hidden: string;
    IsDependent: string;
    IDFieldParent: number;
    NaInter: string;
    IDGroup: number;
    SelectFieldValues: SelectFieldValues[];
    SelectFieldListReference: SelectFieldListReference[];
    Length: number;
    MinLength: number;
    ApplyFor: 'N' | 'M' | 'T' | 'H' | 'A';
    ShowEticket: 'S' | 'N';
}

