import { ApproverCostCenter } from "./ApproverCostCenter";
import { CostCenter } from "./CostCenter";
import { EntityPolicies } from "./EntityPolicies";
import { PassengerPolicies } from "./PassengerPolicies";
import { TravelerCorporate } from "./TravelerCorporate";


export class TravelerPolicyByIDRS  {

    TravelerInfo: TravelerCorporate;
    PassengerPolicies: PassengerPolicies;
    EntityPolicies: EntityPolicies;
    CostCenter: CostCenter[];
    ApproverUser: ApproverCostCenter[];
}
