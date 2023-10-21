export class ActionPlanParameter {
    id: number;
    description: string;
    value_type: string;
    action_plan_id: string;
  }
  export class ActionPlanParameterValue {
    id: number;
    idParameter:number;
    value: string;
    action_plan_id: number;
  }