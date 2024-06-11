import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';

import { EvaluationTest } from '../../../../shared/entities/models/testDetails/evaluationTest';
import { ProcessModel } from '../../../../shared/entities/models/testDetails/processModel';
import {
  Answered,
  Moduled,
  UserTest,
} from '../../../../shared/entities/models/testDetails/saveTest';
import { UserTestService } from '../../../../shared/services/Evaluations/Desempeño/userTest.service';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { NoteUser, UserAnswer } from '@models/testDetails/testIndividual';
@Component({
  selector: 'app-competencias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    MatInputModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './competencias.component.html',
  styleUrls: ['./competencias.component.scss'],
})
export class CompetenciasComponent implements OnInit {
  showQuestion: boolean = true;
  isLoading: boolean = true;
  loading: boolean = false;
  noteUser: NoteUser;
  averageUser: any;
  clasification:any;
  showNote: boolean = false;
  changeProcess: ProcessModel;
  totalScore: number = 0;
  note: string = '';
  score: number = 0;
  DesempenoTest: EvaluationTest;
  sendAnswered: Answered;
  saveIndivisual: UserAnswer;
  sendAnsweredList: Answered[] = [];
  sendModulo: Moduled[] = [];
  indexModule: number = 0;
  notes: string = '';
  evaluatedUserName: string = '';
  newModulo: Moduled = {
    id: 0,
    note: '',
    answers: [],
  };

  showModule: boolean = true;
  start: boolean = true;
  sendInfo: Competencias;
  end: boolean = false;
  user_test_id: number = 0;
  sendUserTest: UserTest = {
    user_id: Number(localStorage.getItem('user_id')),
    user_test_id: this.user_test_id,
    modules: [],
  };
  ListsendInfo: Competencias[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userTestService: UserTestService,
    public message: MensajeService
  ) {
    this.route.params.subscribe((params) => {
      this.user_test_id = params['user_test_id']; //recibe los parametros del titulo de  la evaluacion
    });
  }
  FalseMark() {
    //marcar falso para retirar la ventana de empezar
    this.start = false;
  }

  FalseMarkMoodulo() {
    //marcar falso para desaparecer el modulo
    this.showModule = false;
  }
  back() {
    this.sizeQuestions =
      this.DesempenoTest.test_modules[this.index].questions.length;
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
      if (this.showNote == false && this.showModule == false) {
        this.showModule = true;
      } else {
        if (this.showModule == false && this.showNote == true) {
          this.showNote = false;
          this.index--;
          this.indexQuestion =
            this.DesempenoTest.test_modules[this.index].questions.length - 1;
          this.sizeQuestions =
            this.DesempenoTest.test_modules[this.index].questions.length;
        } else {
          if (this.showNote == false && this.showModule == true) {
            this.showModule = false;
            this.showNote = true;
          }
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
  home() {
    this.isLoading = true;
    // this.changeProcessFunc(4);
    this.send();
  }
  getIndexOfAnswerWithNonNullUserAnswer(): boolean {
    const allAnswersNull = this.DesempenoTest.test_modules[
      this.index
    ].questions[this.indexQuestion].answers.every(
      (answer) => answer.user_answer_id === null
    );

    if (allAnswersNull) {
      return true;
    } else {
      return false;
    }
  }
  next() {
    this.sizeQuestions =
      this.DesempenoTest.test_modules[this.index].questions.length;

    if (this.indexQuestion + 1 != this.sizeQuestions)
      this.indexQuestion = this.indexQuestion + 1;
    else {
      if (this.index + 1 === this.sizeTotal) {
        this.showModule = false;
        this.showNote = false;
        this.end = true;
      } else {
        this.isLoading = true;
        this.index = this.index + 1;
        this.sizeQuestions =
          this.DesempenoTest.test_modules[this.index].questions.length;
        this.indexQuestion = 0;
        this.isLoading = false;
        this.showNote = true;
        this.showModule = false;
      }
    }
    this.showQuestion = false;
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);
  }
  sendNote() {
    if (
      this.DesempenoTest.test_modules[this.index - 1].note != null &&
      this.DesempenoTest.test_modules[this.index - 1].note.trim() != ''
    ) {
      this.PostsaveNote(this.DesempenoTest.test_modules[this.index - 1].id);
      this.PostsaveAverage(this.DesempenoTest.test_modules[this.index - 1].id);
    } else this.message.error('La nota es requerida para continuar');
  }
  nextQuestion(
    idRespuesta: number,
    idPregunta: number,
    idModule: number,
    score: string,
    indexAnswer: number
  ) {
    //Actualizar la pregunta en  el array
    this.DesempenoTest.test_modules[this.index].questions[
      this.indexQuestion
    ].answers.map((respuesta) => {
      respuesta.user_answer_id = null;
    });
    this.DesempenoTest.test_modules[this.index].questions[
      this.indexQuestion
    ].answers[indexAnswer].user_answer_id = idRespuesta;

    if (this.finish == false) {
      this.sizeQuestions =
        this.DesempenoTest.test_modules[this.index].questions.length;
      // Guardar la respuesta actual
      //this.respuestas.push({ modulo });

      this.indexQuestion++;

      if (this.indexQuestion === this.sizeQuestions) {
        this.showNote = true;
        this.index = this.index + 1;
        this.indexQuestion = 0; // Reiniciar para el nuevo módulo y las preguntas
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
    this.router.navigate(['evaluacion']);
    this.message.success('¡Haz terminado la evaluacion  de Competencias!');
  }
  changeProcessFunc(process: number) {
    this.changeProcess = {
      user_id: Number(localStorage.getItem('user_id')),
      user_test_id: this.user_test_id,
      process_id: process,
    };
    this.userTestService
      .SendChangeProcess(this.changeProcess)
      .then((response: any) => {
        this.send();
      })
      .catch(({ title, message, code }) => {
        this.message.error(message);
        this.isLoading = false;
        this.loading = false;
        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
    this.isLoading = false;
  }
  PostsaveAnswers(
    idRespuesta: number,
    idModule: number,
    idPregunta: number,
    score: string,
    indexAnswer: number
  ) {
    this.loading = true;

    this.saveIndivisual = {
      user_id: Number(localStorage.getItem('user_id')),
      user_test_id: Number(this.user_test_id),
      //user_answer_id: idRespuesta,
      answer_id: idRespuesta,
      question_id: idPregunta,
      score: Number(score),
      its_over: 'no',
    };

    if (
      this.indexQuestion + 1 == this.sizeQuestions &&
      this.index === this.sizeTotal - 1
    ) {
      this.saveIndivisual.its_over = 'si';

      //this.finish = true; //Termina cuando el index y el tamaño-1  del modulo y las preguntas son la misma cantidad
      //this.end=true;
    }

    this.userTestService
      .SendTestEvaluation(this.saveIndivisual)
      .then((response: any) => {
        this.score = Number(response.ranking);
        this.clasification=response.clasification;
        
        this.loading = false;

        if (this.finish != true) {
          //  this.changeProcessFunc(response.actual_score,3);
          //  this.send();
          this.nextQuestion(
            idRespuesta,
            idPregunta,
            idModule,
            score,
            indexAnswer
          );
        }
      })
      .catch(({ title, message, code }) => {
        this.message.error(message);
        this.isLoading = false;
        this.loading = false;
        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
  inputHandler(e: any) {
    this.notes = e.target.value; // Actualiza la propiedad en el elemento del arreglo
  }
  PostsaveNote(idModule: number) {
    this.loading = true;

    this.noteUser = {
      user_id: Number(localStorage.getItem('user_id')),
      user_test_id: this.user_test_id,
      module_id: idModule,
      note: this.DesempenoTest.test_modules[this.index - 1].note,
    };

    this.userTestService
      .SendTestNote(this.noteUser)
      .then((response: any) => {})
      .catch(({ title, message, code }) => {
        this.message.error(message);
        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
  getTable(data: any) {
    this.userTestService
      .GetEvaluation(data, this.user_test_id)
      .then((response: any) => {
        this.DesempenoTest = response.test;
        this.score = Number(response.score);
        this.evaluatedUserName = response.evaluated_user_name;
        this.sizeTotal = this.DesempenoTest.test_modules.length;
        this.sizeQuestions =
          this.DesempenoTest.test_modules[this.index].questions.length;
        this.isLoading = false;
      })
      .catch(({ title, message, code }) => {
        this.message.error(message);
        this.isLoading = false;
        this.loading = false;
        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
  goIndex() {
    this.router.navigate(['evaluacion']);
    this.message.success('¡Se ha suspendido la evaluacion!');
  }
  PostsaveAverage(idModule: number) {
    this.loading = true;
    this.isLoading = true;
    this.averageUser = {
      user_id: Number(localStorage.getItem('user_id')),
      user_test_id: this.user_test_id,
      module_id: idModule,
    };

    this.userTestService
      .SendAverage(this.averageUser)
      .then((response: any) => {
        this.isLoading = false;
        this.loading = false;
        this.note = '';
        if (this.index === this.sizeTotal) {
          this.showModule = false;
          this.showNote = false;
          this.end = true;
        } else {
          this.showModule = true;
          this.showNote = false;
        }
      })
      .catch(({ title, message, code }) => {
        this.message.error(message);
        this.isLoading = false;
        this.loading = false;
        //this.indexQuestion = this.indexQuestion - 1;
        // Handle errors here
      });
  }
  ngOnInit() {
    // this.changeProcessFunc(75,3);
    // this.isLoading=true;
    var user = localStorage.getItem('email');
    if (user == '') {
      this.router.navigate(['/login']);
      this.message.error('Tienes que iniciar sesion');
    }
    let data = {
      user_id: Number(localStorage.getItem('user_id')),
    };
    this.getTable(data);
  }

  sizeTotal = 0; //Para saber el tamaño  del arreglo

  index = 0;
  sizeQuestions = 0;

  indexQuestion = 0;
  finish = false;
}

export interface Competencias {
  IdQuestion: number;
  IdAnswer: number;
  Module: number;
}
