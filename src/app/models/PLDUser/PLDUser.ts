export class PLDUser
{
    user_evaluation_id: string;
    evaluation_id: string;
    collaborator_id: string;
    collaborator_name: string;
    evaluation_name: string;
    finish_date: string;
    status: string;
    user_test_id: string | null;
    total_score: number | null;
    attempts: number | null;
    start_date: Date;
    end_date: Date;
}