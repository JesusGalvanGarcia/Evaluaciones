export class UserAnswer {
    user_id: number;
    user_test_id: number;
    answer_id: number;
    question_id: number;
    score: number;
    its_over: string;
  }
  export class NoteUser {
    user_id: number;
    module_id: number;
    user_test_id: number;

    note:string;
  }
  export class Suggetions {
    user_id: number;
    user_test_id: number;
    suggestions:string;
    chance:string;
    strengths:string;
  }
  export class AverageUser {
    user_id: number;
    module_id: number;
    user_test_id: number;

   
  }
  
  export class ModulesUser {
    id: number;
    user_test_id: string;
    module_id: string;
    note: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    average: number;
    name:string;
  }
  