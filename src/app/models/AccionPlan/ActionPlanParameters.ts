export class ActionPlanParameter {
    id: number;
    description: string;
    value_type: string;
    action_plan_id: string;
  }
  export class ActionPlanParameterValue {
    id: number;
    parameter_id:number;
    description: string;
    line:number;
  
  }
  export class SaveAccionPlan {
    user_id: number;
    user_action_plan_id:number;
    save_type:number;
    agreements:ActionPlanParameterValue[];
  }