
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule,NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { EvaluationTest } from '../../../../shared/entities/models/testDetails/evaluationTest';
import { ProcessModel } from "../../../../shared/entities/models/testDetails/processModel";
import { Answered, Moduled, UserTest } from "../../../../shared/entities/models/testDetails/saveTest";
import { UserTestService } from '../../../../shared/services/Evaluations/Desempeño/userTest.service';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { MatCardModule } from '@angular/material/card';
import { Evaluation360Service } from '@services/Evaluations/Evaluation360/evaluation360.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AverageUser, UserAnswer ,Suggetions,ModulesUser} from '@models/testDetails/testIndividual';
@Component({
  selector: 'app-Evaluation360',
  standalone: true,
  imports: [CommonModule,MatCardModule, FormsModule, ReactiveFormsModule,LoadingComponent, MatInputModule,MatProgressBarModule,MatIconModule],
  templateUrl: './Evaluation360.component.html',
  styleUrls: ['./Evaluation360.component.scss']
})
export class Evaluation360Component implements OnInit {
  showQuestion: boolean = true;
   isLoading: boolean = true;
  loading: boolean = false;
  noteUser: AverageUser;
  showNote:boolean=false;
  changeProcess:ProcessModel;
  totalScore:number=0;
  score:number=0;
  average:number=0;
  DesempenoTest: EvaluationTest;
  sendAnswered: Answered;
  saveIndivisual: UserAnswer;
  sendAnsweredList: Answered[] = [];
  sendModulo: Moduled[] = [];
  indexModule: number = 0;
  notes: string = "";
  general:number=0;
  suggestions:Suggetions=
  {
    user_id:0,
    user_test_id:0,
    suggestions:'',
    chance:'',
    strengths:''
  };
  Preview:Suggetions[]=[];
  modulesPreview:ModulesUser[]=[];
  showSuggestions:boolean;

  evaluatedUserName: string = "";
  type: string = "";

  newModulo: Moduled =
    {
      id: 0,
      note: "",
      answers: []
    }
  miFormulario: FormGroup;
  showModule: boolean = true;
  start: boolean = true;
  sendInfo: Competencias;
  end:boolean=false;
  user_test_id: number = 0;
  sendUserTest: UserTest =
    {
      user_id: Number(localStorage.getItem("user_id")),
      user_test_id: this.user_test_id,
      modules: []
    };
  ListsendInfo: Competencias[] = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private userTestService: UserTestService, 
    private evaluation360Service: Evaluation360Service,
    public message: MensajeService,private fb: FormBuilder) {
    this.route.params.subscribe(params => {
      this.user_test_id = params['id']; //recibe los parametros del titulo de  la evaluacion
    });

  }
  FalseMark() {//marcar falso para retirar la ventana de empezar
    this.start = false;

  }

  FalseMarkMoodulo() {//marcar falso para desaparecer el modulo
    this.showModule = false;
    this.showSuggestions=false;
  

    this.sizeQuestions=this.DesempenoTest.test_modules[this.index].questions.length;
  
  }
  back() {
    this.sizeQuestions = this.DesempenoTest.test_modules[this.index].questions.length;
    if (this.indexQuestion === 0 && this.index >= 0) {
      // Si la pregunta llegó al inicio del módulo y todavía no ha terminado
      this.indexQuestion = this.indexQuestion - 1; // Retrocede a la última pregunta del módulo
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
  getIndexOfAnswerWithNonNullUserAnswer():boolean {
    const allAnswersNull = this.DesempenoTest.test_modules[this.index].questions[this.indexQuestion].answers.every(answer => answer.user_answer_id === null);
  
    if (allAnswersNull) {
      return true;

    } else {
       return false;
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
 
            if(this.showModule==false)
            {
              this.showModule = true;
            }else{
               if(this.showModule==true)
                {  this.showModule = false;
                  this.index--;
                  this.sizeQuestions = this.DesempenoTest.test_modules[this.index].questions.length;
                  this.indexQuestion = this.sizeQuestions - 1; // Retrocede a la última pregunta del módulo

                }
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
        if (this.indexQuestion === this.sizeQuestions) {
         
         this.PostsaveNote(idModule);  
         this.showModule=true;
          this.index = this.index + 1;
          this.sizeQuestions=this.DesempenoTest.test_modules[this.index].questions.length;
          this.indexQuestion = 0; // Reiniciar para el nuevo módulo y las preguntas
        }
      
      if(this.index === this.sizeTotal )
      {
        this.showSuggestions=true;
        this.showModule=false;
        this.end=false;
        this.PostsaveNote(idModule);  
      }
      this.showQuestion = false; // Inicia la animación de desvanecimiento

     // this.PostsaveAnswers(idRespuesta, idModule, idPregunta, score);

      //this.loading=false;

      setTimeout(() => {
        this.showQuestion = true;
      }, 300);


    }

  }
  next() {
    this.sizeQuestions=this.DesempenoTest.test_modules[this.index].questions.length;

    if(this.indexQuestion+1!= this.sizeQuestions)
    this.indexQuestion=this.indexQuestion+1;
    else
    {
      this.isLoading=true;
  
      this.PostsaveNote(this.DesempenoTest.test_modules[this.index].id);  
      this.index = this.index + 1;
      this.sizeQuestions=this.DesempenoTest.test_modules[this.index].questions.length;
      this.indexQuestion = 0; 
      this.isLoading=false;
      this.showModule=true;
  
    }
    this.showQuestion = false;
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);

  }
  send() {
   
    this.router.navigate(['evaluacion360']);
    this.message.success("¡Haz terminado la evaluacion  de Competencias!")
  }
  changeProcessFunc(process:number)
  {
  
       this.changeProcess=
       {
        user_id: Number(localStorage.getItem("user_id")),
        user_test_id: this.user_test_id,
        process_id:process,   
       }
       this.userTestService.SendChangeProcess(this.changeProcess)
       .then((response: any) => {
       
         this.send();
      })
          .catch((error: any) => {
        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        this.isLoading=false;
       // this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
    this.isLoading=false;
  }
  showFinish(form:NgForm)
  {
    this.PostsaveSuggestions(form);
    this.end=true;
    this.showSuggestions=false;
  }
  PostsaveAnswers(idRespuesta: number, idModule: number, idPregunta: number, score: string,indexAnswer:number) {
    this.loading = true;
 
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
      this.saveIndivisual.its_over = "si";
      this.finish = true; //Termina cuando el index y el tamaño-1  del modulo y las preguntas son la misma cantidad  
    }
   
    this.evaluation360Service.SendTestEvaluation(this.saveIndivisual)
      .then((response: any) => {
        this.score =response.actual_score;
        this.loading=false;
     
        if(this.finish!=true)    
        this.nextQuestion(idRespuesta,idPregunta,idModule,score,indexAnswer);      
        else
        {
          this.PostsaveNote(idModule); 
          this.showSuggestions=true;
        }
        
        
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        this.isLoading=false;
        this.message.error(error.message+" "+error.code);
       // this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
  inputHandler(e: any) {


    this.notes = e.target.value; // Actualiza la propiedad en el elemento del arreglo

  
  }
  getPreview()
  {
   
   
    this.noteUser = {
      user_id: Number(localStorage.getItem("user_id")),
      user_test_id: this.user_test_id,
      module_id: 0,

    }
      this.evaluation360Service.getPreview(this.noteUser)
        .then((response: any) => {
          this.modulesPreview=response.module;
          this.general=response.general;
          this.Preview=response.questions;
          this.loading=false;
          this.isLoading=false;
     
        })
        .catch((error: any) => {
          console.error('Error in the request:', error);
          this.message.error(error.message+" "+error.code);
          this.isLoading=false;

          //this.indexQuestion = this.indexQuestion - 1;
          // Handle errors here
        });
        
      
  }
  PostsaveSuggestions(form: NgForm) {
    if (form.valid) {
    this.loading=true;
    this.isLoading=true;

    this.suggestions.user_id=Number(localStorage.getItem("user_id"))
    this.suggestions.user_test_id=this.user_test_id;

    this.evaluation360Service.SendTestSuggestions(this.suggestions)
      .then((response: any) => {
      
        this.end=true;
        this.showSuggestions=false;
       this.getPreview();
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        this.isLoading=false;

        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
      }
      else{
        this.message.error("El formulario no ha sido completado.")
      }
  }
  PostsaveNote(idModule: number) {
    this.loading=true;
    this.isLoading=true;
    this.noteUser = {
      user_id: Number(localStorage.getItem("user_id")),
      user_test_id: this.user_test_id,
      module_id: idModule,

    }


    this.evaluation360Service.SendAverage(this.noteUser)
      .then((response: any) => {
        this.average=response.average;
        this.isLoading=false;
        this.loading=false;
        if(this.index === this.sizeTotal )
        {
          this.showSuggestions=true;
          this.showModule=false;
          this.end=false;
        }
   
      })
      .catch((error: any) => {
        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        this.isLoading=false;

        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
   textoConSaltosDeLinea(text:any): any {
    // Reemplaza '\n' con '<br>' para que Angular interprete los saltos de línea
    return text.replace(/\\n/g, '<br>');
  }
  getTable(data: any) {
 
    this.userTestService.GetEvaluation(data, this.user_test_id)
      .then((response: any) => {
  
        this.DesempenoTest = response.test;
        this.evaluatedUserName = response.evaluated_user_name;
        this.type=response.tipo;
        this.sizeTotal = this.DesempenoTest.test_modules.length;
        this.sizeQuestions = this.DesempenoTest.test_modules[this.index].questions.length;
        this.isLoading=false;
     

      })
      .catch((error: any) => {
        this.isLoading=false;
        console.error('Error in the request:', error);
        this.message.error(error.message+" "+error.code);
        // Handle errors here
      });
  }
  goIndex()
  {
    this.router.navigate(['evaluacion360']);
    this.message.success("¡Se ha suspendido la evaluacion!")
  }
  ngOnInit() {
   // this.changeProcessFunc(75,3);
  // this.isLoading=true;
  this.miFormulario = this.fb.group({
    strengths: ['', Validators.required],
    chance: ['', Validators.required],
    suggestions: ['', Validators.required],
  });
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
