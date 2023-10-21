
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {EvaluationService} from '../../services/EvaluationService';
import {EvaluationTest} from  '../../models/TestDetails/EvaluationTest';
import {Question} from  "../../models/TestDetails/QuestionModel";
import { Answer } from 'src/app/models/TestDetails/AnswerModel';
@Component({
  selector: 'app-competencias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './competencias.component.html',
  styleUrls: ['./competencias.component.scss']
})
export class CompetenciasComponent implements OnInit {
  showQuestion: boolean = true;
  DesempenoTest: EvaluationTest;
  showModule: boolean = true;
  start: boolean = true;
  sendInfo:Competencias;
  ListsendInfo: Competencias[] = [];
  constructor(private route: ActivatedRoute, private evaluationService :EvaluationService) {
  
  }
  FalseMark()
  {
    this.start=false;
   
  }

  FalseMarkMoodulo() {
    this.showModule = false;

  }
  back() { 
    this.sizeQuestions = this.DesempenoTest.modules[this.index].questions.length;
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
    console.log("retroceder")
    console.log(this.ListsendInfo)
    if(this.finish==true)
    {
      this.finish=false;
    }
    if (this.indexQuestion > 0) {
      // Retroceder en las preguntas del módulo actual
      this.indexQuestion--;
    } else if (this.index > 0) {
      // Retroceder al módulo anterior
           if(this.showModule ==false)
           {
            this.showModule=true;
           }
           else{
            this.index--;
            this.indexQuestion = this.DesempenoTest.modules[this.index].questions.length - 1;
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
  
  isSelect(respuestaId: number,preguntaId:number,moduloId:number): boolean {
    // Verifica si la respuestaId existe en el arreglo de respuestas
    return this.ListsendInfo.some(respuesta => respuesta.IdAnswer === respuestaId && respuesta.IdQuestion==preguntaId&&respuesta.Module==moduloId);
  }
  nextQuestion(idRespuesta:number,idPregunta:number,idModule:number) {

  if(this.DesempenoTest.modules[this.index].questions.length-1 ==this.indexQuestion &&this.index==this.DesempenoTest.modules.length-1)
  {
    const preguntaIndex = this.ListsendInfo.findIndex(item => item.IdQuestion ===idPregunta && item.Module=== idModule);
    this.sendInfo = {
      IdAnswer: idRespuesta, 
      IdQuestion: idPregunta,  
      Module: idModule,      
    };
    if (preguntaIndex !== -1) {
      // Si la pregunta ya está en el arreglo, reemplázala con la nueva pregunta y respuesta.
      this.ListsendInfo[preguntaIndex] =  this.sendInfo;
    } else {
      // Si la pregunta no está en el arreglo, agrégala.
      this.ListsendInfo.push( this.sendInfo);
    }
  }
    if (this.finish==false) {
      this.sizeQuestions = this.DesempenoTest.modules[this.index].questions.length;
      // Guardar la respuesta actual
      //this.respuestas.push({ modulo }); 
      const preguntaIndex = this.ListsendInfo.findIndex(item => item.IdQuestion ===idPregunta && item.Module=== idModule);
      this.sendInfo = {
        IdAnswer: idRespuesta, 
        IdQuestion: idPregunta,  
        Module: idModule,      
      };
      
      if (preguntaIndex !== -1) {
        // Si la pregunta ya está en el arreglo, reemplázala con la nueva pregunta y respuesta.
        this.ListsendInfo[preguntaIndex] =  this.sendInfo;
      } else {
        // Si la pregunta no está en el arreglo, agrégala.
        this.ListsendInfo.push( this.sendInfo);
      }
      this.indexQuestion++;
 
      if (this.index === this.sizeTotal-1 && this.indexQuestion==this.sizeQuestions-1) {
       
        this.finish = true; //Termina cuando el index y el tamaño-1  del modulo y las preguntas son la misma cantidad
        
      }
      else{
      if (this.indexQuestion === this.sizeQuestions) {
        this.showModule = true;
       
        this.index=this.index+1;
        this.indexQuestion = 0; // Reiniciar para el nuevo módulo y las preguntas
   
      }}
  
      this.showQuestion = false; // Inicia la animación de desvanecimiento
  
      setTimeout(() => {
        this.showQuestion = true;
      }, 300);
  
 
    }

  }
  send()
  {
    console.log(this.ListsendInfo)
  }
  getTable(data:any)
  {
    this.evaluationService.GetEvaluation(data,"119")
    .then((response:any) => {

      this.DesempenoTest=response;
      this.sizeTotal=this.DesempenoTest.modules.length;
      this.sizeQuestions=this.DesempenoTest.modules[this.index].questions.length;
     console.log(this.DesempenoTest)
     
    })
    .catch((error:any) => {
      console.error('Error in the request:', error);
      // Handle errors here
    });
  }
  ngOnInit() {
    let data = {
      user_id: 67,
  
    };
    this.getTable(data);
  }

  sizeTotal = 0; //Para saber el tamaño  del arreglo

  index = 0;
  sizeQuestions=0;;

  indexQuestion = 0;
  finish = false;
}

export interface Competencias {
  IdQuestion: number;
  IdAnswer: number;
  Module:number;

}
