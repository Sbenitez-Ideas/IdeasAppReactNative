import { PolicyProperty } from "./PolicyProperty";

export class GeneralPolicy {

    name: string;
    description: string;
    result: boolean;
    isChecked: boolean;
    isRestrictive: boolean;
    status: boolean;
    createdBy: string;
    errorList: any[];
    culture: string;
    diasantservicio: PolicyProperty;
    diasantserviciointer: PolicyProperty;
    valoraprobservicio: PolicyProperty;
    numserviciosmes: PolicyProperty;
    requiereaprobservicio: PolicyProperty;
    especifrazonesviaje: PolicyProperty;
    maxnumdiasmodif: PolicyProperty;
    usaprovdefecto: PolicyProperty;
    valormonedaestadianal: PolicyProperty;
    valordolaresestadiainternal: PolicyProperty;
    legalizaviaticosgastos: PolicyProperty;
    numviajessinlegalnewserv: PolicyProperty;
    puedesolicitarotropasajero: PolicyProperty;
    autoaprobacion: PolicyProperty;
    autoaprobacioninter: PolicyProperty;
}
