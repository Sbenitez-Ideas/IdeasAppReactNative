/**
 * Response from service with cost center information.
 *
 * @export
 * @class GetCostCenterRS
 */
 export class GetCostCenterRS {
    id: string;
    CostCenterName: string;
    EntityId: number;

    get Name() {
        return this.CostCenterName;
    }
}


