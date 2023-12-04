import { QuestionFormDTO } from "./question-form-dto";

export class TestModuleFormDTO{
    id: number;
    test_id: string;
    questions: QuestionFormDTO[]
}