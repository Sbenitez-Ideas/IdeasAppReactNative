import { GetCostCenterRS } from "./GetCostCenterRS";

/**
 * Request to service to get cost center information for current entity.
 *
 * @export
 * @class GetCostCenterRQ
 * @extends {GetCostCenterRS}
 */
export class GetCostCenterRQ extends GetCostCenterRS {
    entityId: number;
    skip: number;
    take: number;
    filter: any[];
    type: string;
}


