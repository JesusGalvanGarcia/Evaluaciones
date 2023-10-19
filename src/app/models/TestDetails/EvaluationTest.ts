import { Module } from "ag-grid-enterprise";
export interface EvaluationTest {
    id: number;
    evaluation_id: string;
    name: string;
    introduction_text: string;
    max_score: string;
    min_score: string;
    modular: string;
    modules: Module[];
  }