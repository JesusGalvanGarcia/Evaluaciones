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
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import {ProcessModel} from "../../models/TestDetails/ProcessModel";

@Component({
  selector: 'app-desempeño',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressBarModule,MatIconModule,LoadingComponent],
  templateUrl: './desempeño.component.html',
  styleUrls: ['./desempeño.component.scss']
})

export class SurveyComponent implements OnInit {

  protected title: string = "";
  protected user_test_id: number = 0;
  showQuestion: boolean = true;
  saveIndivisual: any;
  changeProcess:ProcessModel;
  score:number=0;
  end:boolean=false;
  isChecked: boolean = false;
  submit:boolean=true;
  start: boolean = true;
  isLoading: boolean = true;
  DesempenoTest: EvaluationTest;
  Answers: SendQuestions[] = [];
  sendInfo: SendQuestions;
  loading: boolean = false;
  scoreTotal:number=0;
  questions: any;
  answers: any;
  modules: any;
  FinalEvalution:End;
  constructor(public router:Router,private route: ActivatedRoute, private evaluationService: EvaluationService, public message: MensajeService) {
    this.route.params.subscribe(params => {
      this.user_test_id = params['user_test_id']; //recibe los parametros del titulo de  la evaluacion
    });

    console.log(this.user_test_id)
  }

  getTable(data: any) {
    console.log(data)
    this.evaluationService.GetEvaluation(data, this.user_test_id)
      .then(({ test, message, title }) => {
        console.log(test)
        this.title = test.name
        this.DesempenoTest = test;
        this.isLoading=false;
        this.size = this.DesempenoTest.test_modules[0].questions.length
        
        this.submit=false;
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        this.isLoading=false;
        // Handle errors here
      });
  }
  onCheckboxChange() {
    // Este método se ejecuta cuando cambia el estado de la casilla de verificación
   this.isChecked=!this.isChecked;
   console.log(this.isChecked);
  }

  ngOnInit() {

    var user=localStorage.getItem("email");
    if(user=="")
    {
      this.router.navigate(['/login']);
      this.message.error("Tienes que iniciar sesion");

    }

    let data = {
      user_id: Number(localStorage.getItem("user_id")),
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
goCompetencias()
{
  this.router.navigate(['/competencias/'+this.user_test_id]);

}
  isSelect(AnswerId: number, QuestionId: number): boolean {
    // Verifica si la AnswerId existe en el arreglo de Answers
    return this.Answers.some(answer => answer.IdAnswer === AnswerId && answer.IdQuestion == QuestionId);
  }

  PostsaveAnswers(question: Question, answer: Answer,idAnswer:number) {
    this.loading = true;
   
    this.saveIndivisual = {
      user_id: Number(localStorage.getItem("user_id")),
      user_test_id: this.user_test_id,
      answer_id: answer.id,
      question_id: question.id,
      score: Number(answer.score),
      its_over: "no"
    }
    console.log(this.index+1,this.size);
    if (this.index+1 === this.size )
      this.saveIndivisual.its_over = "si";
    console.log(this.saveIndivisual);
    this.evaluationService.SendTestEvaluation(this.saveIndivisual)
      .then((response: any) => {
        this.loading = false;
        this.score =response.actual_score;
        this.nextQuestion(question, answer,idAnswer,response.actual_score,response);
      })
      .catch(({ title, message, code }) => {
        console.error(title, message, code);
        this.message.error('La pregunta no pudo ser enviada correctamente, intenta nuevamente. ' + message);
        this.loading = false;

        // this.index = this.index - 1;
        // Handle errors here
      });
  }
  finishEvaluation()
  {
    this.router.navigate(['/dashboard/evaluacion']);
    this.message.success("¡Haz terminado la evaluacion de desempeño!")
  }
  goIndex()
  {
    this.router.navigate(['/dashboard/evaluacion']);
    this.message.success("¡Se ha suspendido la evaluacion!")
  }
  home() 
    {
      this.isLoading=true;
     // this.router.navigate(['/dashboard/evaluacion']);
     if (this.score > 75 && this.isChecked) {
      this.changeProcessFunc(2);
    } 
    else{
      if(this.score<=75)
      this.changeProcessFunc(2);
      else
      {
        this.changeProcessFunc(4);

      }
    }
    }
  changeProcessFunc(id:number)
  {
    this.changeProcess=
    {
     user_id: Number(localStorage.getItem("user_id")),
     user_test_id: this.user_test_id,
     process_id:id,   
    }
    this.evaluationService.SendChangeProcess(this.changeProcess)
    .then((response: any) => {
     console.log(response);
    // this.finishEvaluation();
    this.isLoading=false;
    localStorage.setItem("score", "0.0");

    this.finishEvaluation();
  })
  .catch((error: any) => {
    console.error('Error in the request:', error);
    // Handle errors here
    this.message.error("Hubo un  error al terminar  la evaluacion:"+error)
    this.isLoading=false;

  });
  }
  nextQuestion(question: Question, answer: Answer,idAnswer:number,actual_score:number,response:any) {

     //this.PostsaveAnswers(question, answer)
   //Actualizar la pregunta en  el array
    this.DesempenoTest.test_modules[0].questions[this.index].answers.map((respuesta) => {
      respuesta.user_answer_id=null;
  });
  this.DesempenoTest.test_modules[0].questions[this.index].answers[idAnswer].user_answer_id=answer.id;

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

      this.end=true; 
      console.log(response);
      this.FinalEvalution={
      description:response.clasification.description,
      text:response.clasification.clasification,
      color:"#000"
      }
     
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
export interface End
{
  text:string;
  description:string;
  color:string;
}