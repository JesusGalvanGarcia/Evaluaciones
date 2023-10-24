import { Component, OnInit } from '@angular/core';
import { Model } from "survey-core";
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EvaluationService } from '../../services/EvaluationService';
import { EvaluationTest } from '../../models/TestDetails/EvaluationTest';
import { Question } from "../../models/TestDetails/QuestionModel";
import { UserAnswer } from "../../models/TestDetails/TestIndividual";
import { MensajeService } from '@http/mensaje.service';
import { Answer } from 'src/app/models/TestDetails/AnswerModel';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-desempeño',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './desempeño.component.html',
  styleUrls: ['./desempeño.component.scss']
})

export class SurveyComponent implements OnInit {

  protected title: string = "";
  protected user_test_id: number = 0;
  showQuestion: boolean = true;
  saveIndivisual: any;
  start: boolean = true;
  DesempenoTest: EvaluationTest;
  Answers: SendQuestions[] = [];
  sendInfo: SendQuestions;
  loading: boolean = false;

  questions: any;
  answers: any;
  modules: any;

  constructor(private route: ActivatedRoute, private evaluationService: EvaluationService, public message: MensajeService) {
    this.route.params.subscribe(params => {
      this.user_test_id = params['user_test_id']; //recibe los parametros del titulo de  la evaluacion
    });

    console.log(this.user_test_id)
  }

  getTable(data: any) {
    this.evaluationService.GetEvaluation(data, this.user_test_id)
      .then(({ test, message, title }) => {
        console.log(test)
        this.title = test.name
        this.DesempenoTest = test;
        this.size = this.DesempenoTest.modules[0].questions.length
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        // Handle errors here
      });
  }

  ngOnInit() {
    let data = {
      user_id: 67,
      collaborators_id: [],
      evaluations_id: []
    };

    this.getTable(data);
  }

  size = 0; //Para saber el tamaño  del arreglo

  index = 0;
  finish = false;

  FalseMark() {
    this.start = false;
  }

  back() {
    this.index = this.index - 1;
    this.showQuestion = false; // Inicia la animación de desvanecimiento
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);

  }

  isSelect(AnswerId: number, QuestionId: number): boolean {
    // Verifica si la AnswerId existe en el arreglo de Answers
    return this.Answers.some(answer => answer.IdAnswer === AnswerId && answer.IdQuestion == QuestionId);
  }

  PostsaveAnswers(question: Question, answer: Answer) {
    this.loading = true;

    this.saveIndivisual = {
      user_id: 67,
      user_test_id: this.user_test_id,
      answer_id: answer.id,
      question_id: question.id,
      score: Number(answer.score),
      its_over: "no"
    }

    if (this.index === this.size - 1)
      this.saveIndivisual.its_over = "si";

    this.evaluationService.SendTestEvaluation(this.saveIndivisual)
      .then((response: any) => {
        this.loading = false;

        this.nextQuestion(question, answer);
      })
      .catch(({ title, message, code }) => {
        console.error(title, message, code);
        this.message.error('La pregunta no pudo ser enviada correctamente, intenta nuevamente. ' + message);
        this.loading = false;

        // this.index = this.index - 1;
        // Handle errors here
      });
  }

  nextQuestion(question: Question, answer: Answer) {

    // this.PostsaveAnswers(answer.id, question.id, answer.score)

    if (this.index !== this.size) { // si las preguntas  no han terminado entonces avanzar
      this.index = this.index + 1;
      this.showQuestion = false; // Inicia la animación de desvanecimiento
      setTimeout(() => {
        this.showQuestion = true;
      }, 300);
    }

    if (this.index === this.size) {
      this.finish = true; // Iniciar animación para terminar  la secuencia de preguntas
      this.index = this.index - 1;
    }
    const questionIndex = this.Answers.findIndex(item => item.IdQuestion === question.id);
    this.sendInfo = {
      IdAnswer: answer.id,
      IdQuestion: question.id,

    };

    if (questionIndex !== -1) {
      // Si la question ya está en el arreglo, reemplázala con la nueva question y answer.
      this.Answers[questionIndex] = this.sendInfo;
    } else {
      // Si la question no está en el arreglo, agrégala.
      this.Answers.push(this.sendInfo);
    }
  }
}


export interface SendQuestions {

  IdQuestion: number;
  IdAnswer: number;
}
