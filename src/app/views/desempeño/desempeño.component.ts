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
  start: boolean = true;
  Answers: SendQuestions[] = [];
  sendInfo:SendQuestions;
  protected startText:string="Esta es la encuesta de la evaluacion 2023 de octubre esperamos que puedas contestarla en medida de lo posible";
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.title = params['name']; //recibe los parametros del titulo de  la evaluacion
    });
  }

  ngOnInit() 
  {
    
  }

  ELEMENT_DATA: Questions[] = [
    {
      Name: "¿Como trabajo el colaborador?",
      Descripcion: "Esta pregunta se refiere a la medida en la que el colaborador se esforzó en cumplir sus objetivos",
      Value: 50,
      Id: 1,
      Answers: [
        {
          Name: "De acuerdo",
          Value: 20,
          Id: 1
        },
        {
          Name: "Completamente De acuerdo",
          Value: 20,
          Id: 2
        },
        {
          Name: "En desacuerdo",
          Value: 20,
          Id: 3
        },
        {
          Name: "Neutral",
          Value: 10,
          Id: 4
        }
      ]
    },
    {
      Name: "¿Como trabajo el colaborador 2?",
      Value: 50,
      Descripcion: "Esta pregunta se refiere a la medida en la que el colaborador se esforzó en cumplir sus objetivos",
      Id: 2,
      Answers: [
        {
          Name: "De acuerdo",
          Value: 20,
          Id: 1
        },
        {
          Name: "Completamente De acuerdo",
          Value: 20,
          Id: 2
        },
        {
          Name: "En desacuerdo",
          Value: 20,
          Id: 3
        },
        {
          Name: "Neutral",
          Value: 10,
          Id: 4
        }
      ]
    }
  ];

  size = this.ELEMENT_DATA.length; //Para saber el tamaño  del arreglo

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
  
  nextQuestion(question: Questions, answer: Answers) {
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
    const questionIndex = this.Answers.findIndex(item => item.IdQuestion === question.Id);
    this.sendInfo = {
      IdAnswer: answer.Id, 
      IdQuestion: question.Id, 
         
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

export interface Questions {
  Name: string;
  Value: number;
  Descripcion: string;
  Answers: Answers[];
  Id: number;
}
export interface SendQuestions {

  IdQuestion: number;
  IdAnswer: number;
}
export interface Answers {
  Name: string;
  Value: Number;
  Id: number;
}
