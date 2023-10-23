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
import {EvaluationService} from '../../services/EvaluationService';
import {EvaluationTest} from  '../../models/TestDetails/EvaluationTest';
import {Question} from  "../../models/TestDetails/QuestionModel";
import{UserAnswer} from "../../models/TestDetails/TestIndividual";
import { MensajeService } from '@http/mensaje.service';
import { Answer } from 'src/app/models/TestDetails/AnswerModel';
@Component({
  selector: 'app-desempeño',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './desempeño.component.html',
  styleUrls: ['./desempeño.component.scss']
})

export class SurveyComponent implements OnInit {
  protected title: string = "";
  showQuestion: boolean = true;
  saveIndivisual:UserAnswer;
  start: boolean = true;
   DesempenoTest: EvaluationTest;
  Answers: SendQuestions[] = [];
  sendInfo:SendQuestions;
  constructor(private route: ActivatedRoute, private evaluationService :EvaluationService,public message:MensajeService) {
    this.route.params.subscribe(params => {
      this.title = params['name']; //recibe los parametros del titulo de  la evaluacion
    });
  }
  getTable(data:any)
  {
    this.evaluationService.GetEvaluation(data,"118")
    .then((response:any) => {

      this.DesempenoTest=response;
      this.size = this.DesempenoTest.modules[0].questions.length
     console.log(this.DesempenoTest)
     
    })
    .catch((error:any) => {
      console.error('Error in the request:', error);
      // Handle errors here
    });
  }
  ngOnInit() 
  {
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
  FalseMark()
  {
    this.start=false;
  }
  back() { 
    this.index = this.index - 1;
    this.showQuestion = false; // Inicia la animación de desvanecimiento
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);

  }
  isSelect(AnswerId: number,QuestionId:number): boolean {
    // Verifica si la AnswerId existe en el arreglo de Answers
    return this.Answers.some(answer => answer.IdAnswer === AnswerId && answer.IdQuestion==QuestionId);
  }
  PostsaveAnswers(idRespuesta:number,idPregunta:number,score:string)
  {
      this.saveIndivisual={
        user_id:67,
        user_test_id: 119,
        user_answer_id: idRespuesta,
        question_id: idPregunta,
        score: Number(score),
        its_over: "no"
      }
      if(this.index === this.size-1 )
      this.saveIndivisual.its_over="si";
     console.log(this.saveIndivisual)
    this.evaluationService.SendTestEvaluation(this.saveIndivisual)
      .then((response:any) => {
        
       
      })
      .catch((error:any) => {
        console.error('Error in the request:', error);
        this.message.error('La pregunta no pudo ser enviada correctamente, intenta nuevamente. '+error);
        this.index=this.index-1;
        // Handle errors here
      });
  }
  nextQuestion(question: Question, answer: Answer) {
    this.PostsaveAnswers(answer.id,question.id,answer.score)

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
    console.log(this.sendInfo)
  
    if (questionIndex !== -1) {
      // Si la question ya está en el arreglo, reemplázala con la nueva question y answer.
      this.Answers[questionIndex] =  this.sendInfo;
    } else {
      // Si la question no está en el arreglo, agrégala.
      this.Answers.push( this.sendInfo);
    }
    console.log(this.Answers)
  }
}


export interface SendQuestions {

  IdQuestion: number;
  IdAnswer: number;
}
