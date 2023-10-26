
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../services/EvaluationService';
import { EvaluationTest } from '../../models/TestDetails/EvaluationTest';
import { Question } from "../../models/TestDetails/QuestionModel";
import { Answer } from 'src/app/models/TestDetails/AnswerModel';
import { UserTest, Moduled, Answered } from "../../models/TestDetails/SaveTest";
import { UserAnswer } from "../../models/TestDetails/TestIndividual";
import { MensajeService } from '@http/mensaje.service';
import { NoteUser } from "../../models/TestDetails/TestIndividual";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from '../loading/loading.component';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-competencias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,LoadingComponent, MatInputModule,MatProgressBarModule,MatIconModule],
  templateUrl: './competencias.component.html',
  styleUrls: ['./competencias.component.scss']
})
export class CompetenciasComponent implements OnInit {
  showQuestion: boolean = true;
  protected isLoading: boolean = false;
  loading: boolean = false;
  noteUser: NoteUser;
  DesempenoTest: EvaluationTest;
  sendAnswered: Answered;
  saveIndivisual: UserAnswer;
  sendAnsweredList: Answered[] = [];
  sendModulo: Moduled[] = [];
  indexModule: number = 0;
  notes: string = "";
  newModulo: Moduled =
    {
      id: 0,
      note: "",
      answers: []
    }

  showModule: boolean = true;
  start: boolean = true;
  sendInfo: Competencias;
  user_test_id: number = 0;
  sendUserTest: UserTest =
    {
      user_id: Number(localStorage.getItem("user_id")),
      user_test_id: this.user_test_id,
      modules: []
    };
  ListsendInfo: Competencias[] = [];
  constructor(private router: Router,private route: ActivatedRoute, private evaluationService: EvaluationService, public message: MensajeService) {
    this.route.params.subscribe(params => {
      this.user_test_id = params['user_test_id']; //recibe los parametros del titulo de  la evaluacion
    });

  }
  FalseMark() {//marcar falso para retirar la ventana de empezar
    this.start = false;

  }

  FalseMarkMoodulo() {//marcar falso para desaparecer el modulo
    this.showModule = false;

  }
  back() {
    this.sizeQuestions = this.DesempenoTest.test_modules[this.index].questions.length;
    if (this.indexQuestion === 0 && this.index >= 0) {
      // Si la pregunta llegó al inicio del módulo y todavía no ha terminado
      this.indexQuestion = this.sizeQuestions - 1; // Retrocede a la última pregunta del módulo
      this.showModule = true;
    }

    if (this.indexQuestion === 0 && this.index === 0) {
      // Si la pregunta llegó al inicio del primer módulo
      this.showModule = true;
    }

    if (this.indexQuestion !== 0) {
      // Si no estamos al inicio del módulo, retrocedemos en las preguntas
      this.indexQuestion = this.indexQuestion - 1;
    }

  }
  backQuestion() {

    if (this.finish == true) {
      this.finish = false;
    }
    if (this.indexQuestion > 0) {
      // Retroceder en las preguntas del módulo actual
      this.indexQuestion--;
    } else if (this.index > 0) {
      // Retroceder al módulo anterior
      if (this.showModule == false) {
        this.showModule = true;
      }
      else {
        this.index--;
        this.indexQuestion = this.DesempenoTest.test_modules[this.index].questions.length - 1;
        this.showModule = false;
      }
    } else {
      // Estás en la primera pregunta del primer módulo, vuelve a mostrar el módulo
      this.showModule = true;
    }

    this.showQuestion = false;
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);
  }
  home() 
    {
      this.router.navigate(['/dashboard/evaluacion']);

    }
 
  nextQuestion(idRespuesta: number, idPregunta: number, idModule: number, score: string,indexAnswer:number) {
   //Actualizar la pregunta en  el array
    this.DesempenoTest.test_modules[this.index].questions[this.indexQuestion].answers.map((respuesta) => {
      respuesta.user_answer_id=null;
  });
  this.DesempenoTest.test_modules[this.index].questions[this.indexQuestion].answers[indexAnswer].user_answer_id=idRespuesta;
  

    if (this.finish == false) {
      this.sizeQuestions = this.DesempenoTest.test_modules[this.index].questions.length;
      // Guardar la respuesta actual
      //this.respuestas.push({ modulo }); 

      this.indexQuestion++;

      if (this.index === this.sizeTotal - 1 && this.indexQuestion+1==this.sizeQuestions) {

      //  this.finish = true; //Termina cuando el index y el tamaño-1  del modulo y las preguntas son la misma cantidad
   
      }
      else {
        if (this.indexQuestion === this.sizeQuestions) {
          this.showModule = true;

          this.index = this.index + 1;
          this.indexQuestion = 0; // Reiniciar para el nuevo módulo y las preguntas

        }
      }
  
      this.showQuestion = false; // Inicia la animación de desvanecimiento

     // this.PostsaveAnswers(idRespuesta, idModule, idPregunta, score);

      //this.loading=false;

      setTimeout(() => {
        this.showQuestion = true;
      }, 300);


    }

  }
  send() {
    console.log(this.sendUserTest)
    this.router.navigate(['/dashboard/evaluacion']);
    this.message.success("¡Haz terminado la evaluacion  de Competencias!")
  }
  PostsaveAnswers(idRespuesta: number, idModule: number, idPregunta: number, score: string,indexAnswer:number) {
    this.loading = true;
    if ((this.indexQuestion + 1) == this.sizeQuestions)
    this.PostsaveNote(idModule, score);

    this.saveIndivisual = {
      user_id: Number(localStorage.getItem("user_id")),
      user_test_id: Number(this.user_test_id),
      //user_answer_id: idRespuesta,
      answer_id:idRespuesta,
      question_id: idPregunta,
      score: Number(score),
      its_over: "no"
    }
    

    if (this.indexQuestion+1==this.sizeQuestions&&this.index === this.sizeTotal - 1 )

    { 
      console.log(this.indexQuestion+1,this.sizeQuestions,this.index,this.sizeTotal-1 )

      this.saveIndivisual.its_over = "si";
 
      this.finish = true; //Termina cuando el index y el tamaño-1  del modulo y las preguntas son la misma cantidad

    
    }
    console.log(this.saveIndivisual)
    this.evaluationService.SendTestEvaluation(this.saveIndivisual)
      .then((response: any) => {
        this.loading=false;
        if(this.finish==true)
        this.send();
        this.nextQuestion(idRespuesta,idPregunta,idModule,score,indexAnswer)
        
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        this.message.error('La pregunta no pudo ser enviada correctamente, intenta nuevamente. ' + error);
       // this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
  inputHandler(e: any) {


    this.notes = e.target.value; // Actualiza la propiedad en el elemento del arreglo

    console.log(e.target.value)
  }
  PostsaveNote(idModule: number, score: string) {
    console.log(this.DesempenoTest.test_modules[this.index]);
    this.noteUser = {
      user_id: Number(localStorage.getItem("user_id")),
      user_test_id: this.user_test_id,
      module_id: idModule,
      note:this.DesempenoTest.test_modules[this.index].note

    }


    this.evaluationService.SendTestNote(this.noteUser)
      .then((response: any) => {
     
        console.log("Nota Guardada",response);
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        this.message.error('La pregunta no pudo ser enviada correctamente, intenta nuevamente. ' + error);
        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
  getTable(data: any) {
    console.log(data,this.user_test_id)
    this.evaluationService.GetEvaluation(data, this.user_test_id)
      .then((response: any) => {
       console.log(response)
        this.DesempenoTest = response.test;
        this.sizeTotal = this.DesempenoTest.test_modules.length;
        this.sizeQuestions = this.DesempenoTest.test_modules[this.index].questions.length;
        
        console.log(this.DesempenoTest)

      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        this.message.error("No se pudieron cargar las evaluaciones "+error);
        // Handle errors here
      });
  }
  ngOnInit() {
    this.isLoading=true;
    var user=localStorage.getItem("email");
    if(user=="")
    {
      this.router.navigate(['/login']);
      this.message.error("Tienes que iniciar sesion");

    }
    let data = {
      user_id: Number(localStorage.getItem("user_id")),

    };
    this.getTable(data);
    this.isLoading=false;
  }

  sizeTotal = 0; //Para saber el tamaño  del arreglo

  index = 0;
  sizeQuestions = 0;;

  indexQuestion = 0;
  finish = false;
}

export interface Competencias {
  IdQuestion: number;
  IdAnswer: number;
  Module: number;

}
