import { Question } from "./QuestionModel";
export interface Module {
    id: number;
    name: string;
    test_id: string;
    questions: Question[];
  }
  