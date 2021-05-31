import { ApproverCostCenter } from "./ApproverCostCenter";


/**
 * Information about a cost center.
 *
 * @export
 * @class CostCenter
 */
export class CostCenter {
    public approversList: ApproverCostCenter[];
    public codCentroCusto: number;
    public descricao: string;
    public remark: string;
}

