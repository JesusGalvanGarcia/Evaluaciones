export class AnswerFormDTO {
    id: number;
    description: string;
    score: number;
    question_id: string;
    checked: boolean = false;
}