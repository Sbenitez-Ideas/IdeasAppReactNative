import { ApprovalType } from "../../enums/ApprovalType";


/**
 * Info about the approval process for booking.
 *
 * @export
 * @class CorporateFlowInfo
 */
export class CorporateFlowInfo {
    ApprovalType: ApprovalType;
    centroCusto: number;
    IDReason: string;
    ReasonText: string;
    codPedidoCorporate: number;
    codReserva: number;
    codStatusPedidoCorporate: number;
    codUsuarioStatus: number;
    dataReserva: Date;
    fechaStatus: Date;
    fileNameBusqueda: string;
    fileNameVoltaBusqueda: string;
    justificativaAprovador: string;
    Loc: string;
    metodoAprobacion: string;
    numAprobador: number;
    numPendientes: number;
    puedeAprobar: number;
    secuenciaStatus: number;
    Status: string;
    textoMotivo: string;
    viat_ciudorigen: string;
    viat_destino: string;
    viat_director: string;
    viat_fecaprobacion: Date;
    viat_fecregresoviaje: Date;
    viat_fecsalidaviaje: Date;
    viat_fecsolici: Date;
    viat_gerente: string;
    viat_moneda: string;
    viat_motivoviaje: string;
    viat_nompasajeros: string;
    viat_numdias: number;
    viat_numpersonas: number;
    viat_obsaprobacion: string;
    viat_obssolicitud: string;
    viat_tipviaje: string;
    viat_usuarioaprobador: string;
    viat_usuariosolicitante: string;
    viat_valoraprobado: number;
    viat_valorsolicitado: number;
    viat_valorxdier: number;
    viat_valorxdianal: number;
    viat_viat: number;
}

