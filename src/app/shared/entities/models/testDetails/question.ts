import { Answer } from "./answer";

export interface Question {
    id: number;
    description: string;
    score: string;
    module_id: string;
    answers: Answer[];
  }
  