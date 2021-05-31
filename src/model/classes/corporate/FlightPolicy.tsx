import { PolicyProperty } from "./PolicyProperty";

export class FlightPolicy {

    name: string;
    description: string;
    result: boolean;
    isChecked: boolean;
    isRestrictive: boolean;
    status: boolean;
    createdBy: string;
    errorList: any[];
    culture: string;
    tipoDuracion: string;
    tipoclaseviaje: PolicyProperty;
    manejaviaticos: PolicyProperty;
    solicitaservinternal: PolicyProperty;
    permitemultitrayecto: PolicyProperty;
    maxnumopcivuelo: PolicyProperty;
    mostrarahorro: PolicyProperty;
    usareconomica: PolicyProperty;
    horasDuracionCabina: PolicyProperty;
    diasParaViaje: PolicyProperty;
}
