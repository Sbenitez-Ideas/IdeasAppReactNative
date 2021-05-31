/**
 * Info about the cost center chosen in booking process.
 *
 * @export
 * @class CostCenterBooking
 */
 export class CostCenterBooking {
    code: number;
    IDCostCenter: number;
    Name: string;
    Percent: number;
    Porcentaje: number;

    constructor(centerCost: any) {
        this.IDCostCenter = Number(centerCost.costCenter);
        this.Percent = centerCost.percentage;
        this.Porcentaje = centerCost.percentage;
    }
}

