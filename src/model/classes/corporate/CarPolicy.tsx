import { PolicyProperty } from "./PolicyProperty";

export class CarPolicy {

    name: string;
    description: string;
    result: boolean;
    isChecked: boolean;
    isRestrictive: boolean;
    status: boolean;
    createdBy: string;
    errorList: any[];
    culture: string;
    maxdiasretiro: PolicyProperty;
    montomaximo: PolicyProperty;
    incluyeseguro: PolicyProperty;
    tipocarropermitido:  PolicyProperty;
}
