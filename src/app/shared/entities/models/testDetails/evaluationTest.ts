import { Module } from "./module";
export interface EvaluationTest {
    id: number;
    evaluation_id: string;
    name: string;
    introduction_text: string;
    max_score: string;
    min_score: string;
    modular: string;
    test_modules: Module[];
  }