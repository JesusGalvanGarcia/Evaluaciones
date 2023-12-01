import { QuestionFormDTO } from "./question-form-dto";
import { TestModuleFormDTO } from "./test-modules-form-dto";

export class TestFormDTO {
    id: number;
    name: string;
    introduction_text: string;
    min_score: number;
    max_attempts: number;
    evaluation_id: number;
    end_date: Date;
    test_modules: TestModuleFormDTO[] = [];
    assigned_users: string[];
}