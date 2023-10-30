import {TestModel} from '../ColaboradorEvaluation/EvaluationDetail';
export class CollaboratorEvaluation {
    user_evaluation_id: string;
    evaluation_id: string;
    collaborator_id: string;
    collaborator_name: string;
    responsable_name: string;
    process_id: string;
    actual_process: string;
    finish_date: Date | null;
    status: string;
    detail:TestModel[]
  }
  
  
 