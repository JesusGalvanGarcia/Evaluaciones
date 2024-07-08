import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserTestService } from '@services/Evaluations/Desempeño/userTest.service';
import { AsesoresService } from '@services/Evaluations/Asesores/asesores.service';
import { ReactiveFormsModule, NgForm } from '@angular/forms';
import { GridModule } from '@sharedComponents/grid/grid.module';
import { ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { PLDUserService } from '../../../../shared/services/PLD/pldUser.service';
import { LoadingComponent } from '../../../app/loading/loading.component';
import { UserTest } from '@models/testDetails/saveTest';
import { EvaluationTest } from '@models/testDetails/evaluationTest';
import { Answer } from '@models/testDetails/answer';
import { Question } from '@models/testDetails/question';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-EvaluationAsesor',
  templateUrl: './EvaluationAsesor.component.html',
  styleUrls: ['./EvaluationAsesor.component.scss'],
  standalone: true,

  imports: [
    MatMenuModule,
    MatTableModule,
    MatFormFieldModule,
    NgSelectModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    LoadingComponent,
    GridModule,
    MatBadgeModule,
    MatProgressBarModule,
  ],
})
export class EvaluationAsesorComponent implements OnInit {
  @ViewChild(NgModel) ngModel: NgModel;
  start: boolean = true;
  user_test_id: number = 0;
  displayedColumns: string[] = ['name', 'average', 'max'];
  dataSource: any;
  isLoading: boolean = true;
  loading: boolean = false;
  selectedOption: any;
  saveIndivisual: any;
  size_modules = 0;
  size = 0; //Para saber el tamaño  del arreglo
  count = 1;
  score: number = 0;
  score_question: number = 0;
  Answers: SendQuestions[] = [];
  sendInfo: SendQuestions;
  FinalEvalution: End;
  evaluatedUserName: string = '';
  type: string = '';
  exam_progress: number = 0;
  max_score: number = 0;
  sendButton: boolean = false;
  index_module: number = 0;
  showQuestion: boolean = true;
  actualAnswer: string;
  miFormulario: FormGroup;
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
    public message: MensajeService,
    public asesores: AsesoresService,
    public ctr: ChangeDetectorRef,
    private fb: FormBuilder
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
    this.miFormulario = this.fb.group({
      score_question: ['', Validators.required],
    });
    this.getExam(data);
  }
  onSelectChange(form: NgForm) {
    if (form.valid) {
      this.PostsaveAnswers(
        this.PLDTest.test_modules[this.index_module].questions[this.index]
      );
    }
  }

  getExam(data: any) {
    this.asesores
      .GetExam(data, this.user_test_id)
      .then((response: any) => {
        this.PLDTest = response.data.test;
        this.evaluatedUserName = response.data.evaluated_user_name;
        this.type = response.data.tipo;
        this.isLoading = false;
        this.size = this.PLDTest.test_modules[this.index].questions.length; //tamaño preguntas
        this.size_modules = this.PLDTest.test_modules.length; //tamaño modulos
        this.exam_progress = 0;
        this.max_score = Number(this.PLDTest.max_score);
        this.getIndexOfAnswerWithNonNullUserAnswer(this.index);
      })
      .catch((error: any) => {
        this.isLoading = false;

        console.error('Error in the request:', error);
        this.message.error(error.message + ' ' + error.code);
        // Handle errors here
      });
  }
  changeStart() {
    this.start = false;
  }
  backIndex() {
    this.router.navigate(['asesores']);
  }
  PostsaveAnswers(question: Question) {
    this.loading = true;
    this.sendButton = true;
    this.saveIndivisual = {
      user_id: Number(localStorage.getItem('user_id')),
      user_test_id: this.user_test_id,
      answer_id: 1,
      question_id: question.id,
      score: Number(this.score_question),
      its_over: 'no',
    };

    if (this.index_module + 1 === this.size_modules)
      this.saveIndivisual.its_over = 'si'; //revisar si la pregunta es la ultima

    this.asesores
      .SendTestEvaluation(this.saveIndivisual)
      .then((response: any) => {
        this.loading = false;
        this.score = response.actual_score;
        this.dataSource=response.modules;
        this.sendButton = false;
        this.nextQuestion(); //pasar a la siguiente pregunta
      })
      .catch(({ title, message, code }) => {
        console.error(title, message, code);
        this.message.error(message + ' ' + code);

        this.loading = false;

        // this.index = this.index - 1;
        // Handle errors here
      });
  }
  back() {
    if (this.index_module != 0) {
      this.index_module = this.index_module - 1;
      this.count--;
      setTimeout(() => {
        this.showQuestion = true;
      }, 300);
    }
  }
  next() {
    this.size = this.PLDTest.test_modules[this.index].questions.length; //tamaño preguntas
    this.size_modules = this.PLDTest.test_modules.length; //tamaño modulos
    if (this.index_module < this.size_modules - 1) {
      this.index_module = this.index_module + 1;
      this.score_question = 0;
      this.count++;
      this.showQuestion = false;
      setTimeout(() => {
        this.showQuestion = true;
      }, 300);
    }
  }
  getNumber(data: string) {
    return Number(data);
  }
  getIndexOfAnswerWithNonNullUserAnswer(index: number): string {
    const allAnswersNull = this.PLDTest.test_modules[
      this.index_module
    ].questions[index].answers.every(
      (answer) => answer.user_answer_id === null
    );

    if (allAnswersNull) {
      this.actualAnswer = 'Selecciona una opción...';
    } else {
      const answerWithNonNullUserAnswer = this.PLDTest.test_modules[
        this.index_module
      ].questions[index].answers.find(
        (answer) => answer.user_answer_id !== null
      );

      if (answerWithNonNullUserAnswer) {
        this.actualAnswer = answerWithNonNullUserAnswer.description;
        // Forzar actualización manual del modelo
      }
    }
    return this.actualAnswer;
  }

  nextQuestion() {
    this.exam_progress = Number(
      ((this.index_module + 1) * 100) / this.size_modules
    );
    this.exam_progress = Number(this.exam_progress.toFixed(0));

    if (this.count == this.size_modules) {
      this.finish = true; // Iniciar animación para terminar  la secuencia de preguntas
      this.index = this.index - 1;
      this.end = true;
    } else {
      this.next();
    }

    // this.getIndexOfAnswerWithNonNullUserAnswer(this.index);
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
