import { Question } from "survey-core";
export interface Module {
    id: number;
    name: string;
    test_id: string;
    questions: Question[];
  }
  