import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserTestService } from '@services/userTest.service';
import { GridModule } from '@sharedComponents/grid/grid.module';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { PLDUserService } from '../../shared/services/pldUser.service';
import { LoadingComponent } from '../loading/loading.component';
import { UserTest } from '@models/testDetails/saveTest';
import { EvaluationTest } from '@models/testDetails/evaluationTest';
import { Answer } from '@models/testDetails/answer';
import { Question } from '@models/testDetails/question';

@Component({
  selector: 'app-PLDExam',
  standalone: true,
  templateUrl: './PLDExam.component.html',
  styleUrls: ['./PLDExam.component.css'],
  imports: [
    MatMenuModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    LoadingComponent,
    GridModule,
    MatBadgeModule,
    MatProgressBarModule,
  ],
})
export class PLDExamComponent implements OnInit {
  start: boolean = true;
  user_test_id: number = 0;
  isLoading: boolean = true;
  loading: boolean = false;
  saveIndivisual: any;
  size = 0; //Para saber el tamaño  del arreglo
  score: number = 0;
  Answers: SendQuestions[] = [];
  sendInfo: SendQuestions;
  FinalEvalution: End;
  exam_progress: number = 0;
  max_score: number = 0;
  sendButton: boolean = false;
  showQuestion: boolean = true;
  index = 0;
  finish = false;
  end = false;
  sendUserTest: UserTest = {
    user_id: Number(localStorage.getItem('user_id')),
    user_test_id: this.user_test_id,
    modules: [],
  };
  PLDTest: EvaluationTest;
  attempt: number = 0;
  constructor(
    private router: Router,
    private userTestService: UserTestService,
    private route: ActivatedRoute,
    private pldService: PLDUserService,
    public message: MensajeService
  ) {
    this.route.params.subscribe((params) => {
      this.user_test_id = params['id'];
      this.attempt = params['attempts']; //recibe los parametros del titulo de  la evaluacion
    });
  }

  ngOnInit() {
    let data = {
      user_id: Number(localStorage.getItem('user_id')),
    };
    this.getExam(data);
  }

  getExam(data: any) {
    this.userTestService
      .GetExam(data, this.user_test_id)
      .then((response: any) => {
        this.PLDTest = response.data.test; //Obtener la informacion y desordenar las preguntas
        this.PLDTest.test_modules[0].questions = this.shuffleArray(
          this.PLDTest.test_modules[0].questions
        );
        console.log(this.PLDTest);
        this.isLoading = false;
        this.size = this.PLDTest.test_modules[0].questions.length;
        this.exam_progress = 0;
        this.max_score = Number(this.PLDTest.max_score);
      })
      .catch((error: any) => {
        this.isLoading = false;

        console.error('Error in the request:', error);
        this.message.error('No se pudo cargar el examen ' + error);
        // Handle errors here
      });
  }
  changeStart() {
    this.start = false;
  }
  backIndex() {
    this.router.navigate(['/dashboard/exam']);
  }
  PostsaveAnswers(question: Question, answer: Answer, idAnswer: number) {
    this.loading = true;
    this.sendButton = true;
    this.saveIndivisual = {
      user_id: Number(localStorage.getItem('user_id')),
      user_test_id: this.user_test_id,
      answer_id: answer.id,
      question_id: question.id,
      score: Number(answer.score),
      its_over: 'no',
      attempts: Number(this.attempt),
    };

    if (this.index + 1 === this.size) this.saveIndivisual.its_over = 'si'; //revisar si la pregunta es la ultima

    this.pldService
      .SendTestPLD(this.saveIndivisual)
      .then((response: any) => {
        console.log(response);
        this.loading = false;
        this.score = response.actual_score;
        this.sendButton = false;

        this.nextQuestion(
          question,
          answer,
          idAnswer,
          response.actual_score,
          response
        ); //pasar a la siguiente pregunta
      })
      .catch(({ title, message, code }) => {
        console.error(title, message, code);
        this.message.error(
          'La pregunta no pudo ser enviada correctamente, intenta nuevamente. ' +
            message
        );
        this.loading = false;

        // this.index = this.index - 1;
        // Handle errors here
      });
  }
  back() {
    this.index = this.index - 1;
    this.showQuestion = false; // Inicia la animación de desvanecimiento
    setTimeout(() => {
      this.showQuestion = true;
    }, 300);
  }
  shuffleArray(array: any[]) {
    // Ordenar aleatoriamente un array usando el algoritmo de Fisher-Yates
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  getNumber(data: string) {
    return Number(data);
  }
  nextQuestion(
    question: Question,
    answer: Answer,
    idAnswer: number,
    actual_score: number,
    response: any
  ) {
    this.exam_progress = Number(((this.index + 1) * 100) / this.size);
    console.log(this.exam_progress);
    //this.PostsaveAnswers(question, answer)
    //Actualizar la pregunta en  el array
    this.PLDTest.test_modules[0].questions[this.index].answers.map(
      (respuesta) => {
        respuesta.user_answer_id = null;
      }
    );
    this.PLDTest.test_modules[0].questions[this.index].answers[
      idAnswer
    ].user_answer_id = answer.id;

    if (this.index !== this.size) {
      // si las preguntas  no han terminado entonces avanzar
      this.index = this.index + 1;
      this.showQuestion = false; // Inicia la animación de desvanecimiento
      setTimeout(() => {
        this.showQuestion = true;
      }, 300);
    }

    if (this.index === this.size) {
      this.finish = true; // Iniciar animación para terminar  la secuencia de preguntas
      this.index = this.index - 1;

      this.end = true;
    }
    const questionIndex = this.Answers.findIndex(
      (item) => item.IdQuestion === question.id
    );
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
export interface End {
  text: string;
  description: string;
  color: string;
}
