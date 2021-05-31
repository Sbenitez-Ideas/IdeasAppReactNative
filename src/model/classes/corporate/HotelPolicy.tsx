import { PolicyProperty } from "./PolicyProperty";

export class HotelPolicy {

    name: string;
    description: string;
    result: boolean;
    isChecked: boolean;
    isRestrictive: boolean;
    status: boolean;
    createdBy: string;
    errorList: any[];
    culture: string;
    numestrellas: PolicyProperty;
    incluyealimento: PolicyProperty;
    usatarjcreditoempresa: PolicyProperty;
    montomaximo: PolicyProperty;
    maxnumnoches: PolicyProperty;
}
