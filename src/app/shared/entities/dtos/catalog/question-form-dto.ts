import { AnswerFormDTO } from "./answers-form-dto";

export class QuestionFormDTO{
    id: number;
    description: string;
    score: string;
    module_id: string;
    answers: AnswerFormDTO[];
    constructor(){
        this.description = '';
        this.answers = [
            new AnswerFormDTO(),
            new AnswerFormDTO(),
        ]
    }
}