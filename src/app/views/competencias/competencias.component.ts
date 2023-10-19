
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-competencias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './competencias.component.html',
  styleUrls: ['./competencias.component.scss']
})
export class CompetenciasComponent implements OnInit {
  protected title: string = "";
  showQuestion: boolean = true;
  showModule: boolean = true;
  start: boolean = true;
  sendInfo:Competencias;
  ListsendInfo: Competencias[] = [];
  protected startText:string="Esta es la encuesta de la evaluacion 2023 de octubre esperamos que puedas contestarla en medida de lo posible";
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.title = params['name']; //recibe los parametros del titulo de  la evaluacion
    });
  }
  FalseMark()
  {
    this.start=false;
   
  }

  FalseMarkMoodulo() {
    this.showModule = false;

  }
  back() { 
    this.sizeQuestions = this.ELEMENT_DATA[this.index].Questions.length;
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
            this.indexQuestion = this.ELEMENT_DATA[this.index].Questions.length - 1;
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
    console.log("siguiente")
  console.log(this.ListsendInfo)
  console.log(this.finish)
  if(this.ELEMENT_DATA[this.index].Questions.length-1 ==this.indexQuestion &&this.index==this.ELEMENT_DATA.length-1)
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
      this.sizeQuestions = this.ELEMENT_DATA[this.index].Questions.length;
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
 
      if (this.index === this.sizeTotal-1) {
        this.finish = true; //Termina cuando el index y el tamaño-1 son la misma cantidad
        
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
  ngOnInit() {

  }
  ELEMENT_DATA:Modules[]=[
    {
      Name:"Cultura trinitas MOD1",
      Id:1,
      Description:"Este apartado es sobre la cultura trinitas y la medida en que se desarrolloMOD1",
      Questions:[
       { 
        Name:"¿Que tanto comprendio el  colaborador la pregunta?MOD1",
        Value:50,
        Description:"Como el colaborador comprendio la cultura",
        Id:1,
        Answers:[
          {
            Name:"De acuerdo",
            Value:20,
            Id:1
          },
          {
            Name:"Completamente de acuerdo",
            Value:20,
            Id:2
          }
        ]
      },
      { 
        Name:"¿Que tanto comprendio el  colaborador la pregunta ?MOD1",
        Value:50,
        Description:"Como el colaborador comprendio la cultura MOD1",
        Id:2,
        Answers:[
          {
            Name:"De acuerdo",
            Value:20,
            Id:3
          },
          {
            Name:"Completamente de acuerdo",
            Value:20,
            Id:4
          }
        ]
      }

      ]
    },
  {
    Name:"Integracion y culturaMOD2",
    Description:"Medida en la que se integro el  colaboradorMOD2",
    Id:2,
    Questions:[
      { 
       Name:"¿Que tanto comprendio el  colaborador la pregunta?MOD2",
       Value:50,
       Description:"Como el colaborador comprendio la cultura",
       Id:3,
       Answers:[
         {
           Name:"De acuerdo",
           Value:20,
           Id:5
         },
         {
           Name:"Completamente de acuerdo",
           Value:20,
           Id:6
         }
       ]
     },
     { 
       Name:"¿Que tanto comprendio el  colaborador la pregunta ?MOD2",
       Value:50,
       Description:"Como el colaborador comprendio la cultura",
       Id:4,
       Answers:[
         {
           Name:"De acuerdo",
           Value:20,
           Id:7
         },
         {
           Name:"Completamente de acuerdo",
           Value:20,
           Id:8
         }
       ]
     }
    ]
  }
     
  ]
  sizeTotal = this.ELEMENT_DATA.length; //Para saber el tamaño  del arreglo

  index = 0;
  sizeQuestions=this.ELEMENT_DATA[this.index].Questions.length;;

  indexQuestion = 0;
  finish = false;
}
export interface Questions {
  Name: string;
  Value: number;
  Description: string;
  Answers: Answers[];
  Id: number;
}
export interface Modules {
  Name: string;
  Description: string;
  Questions:Questions[]
  Id: number;
}
export interface Competencias {
  IdQuestion: number;
  IdAnswer: number;
  Module:number;

}
export interface Answers {
  Name: string;
  Value: Number;
  Id: number;
}
