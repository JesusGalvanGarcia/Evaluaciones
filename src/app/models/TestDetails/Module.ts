import { Question } from "./QuestionModel";
export interface Module {
    id: number;
    name: string;
    test_id: string;
    note:string;
    questions: Question[];
  }
  