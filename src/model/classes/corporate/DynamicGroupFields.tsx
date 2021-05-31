/**
 * Has the information of the UDIDs groups.
 *
 * @export
 * @class DynamicGroupFields
 */
 export class DynamicGroupFields {
    IDGroup: number;
    Order: number;
    Name: string;
    Label: string;
    Description: string;
    Status: 'A' | 'I';
    IDentity: number;
    NalInt: 'A' | 'N' | 'I';
    Visible: 'S' | 'N';
}
