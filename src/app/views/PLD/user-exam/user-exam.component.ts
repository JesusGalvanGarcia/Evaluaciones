import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { UserTestService } from '@services/Evaluations/Desempeño/userTest.service';
@Component({
  selector: 'app-user-exam',
  standalone:true,
 
  templateUrl: './user-exam.component.html',
  styleUrls: ['./user-exam.component.css'],
  imports:[MatListModule,MatCardModule,MatTabsModule,MatProgressSpinnerModule,CommonModule],
})
export class UserExamComponent  {

  user_id: number = 0;
  user_test_id: number = 0;
  loading: boolean = true;

  // Tabs
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  modules: any;
  test: any;
  score: number;
  names:string;
  clasification: any;

  constructor(
    private userTestService: UserTestService,
    private route: ActivatedRoute,
    public system_message: MensajeService,
    private router: Router
  ) {

    this.user_id = Number(localStorage.getItem('user_id')!);
    this.route.params.subscribe(params => {
      this.user_test_id = params['id'];
    });

    this.getUserTest();
  }

  getUserTest() {

    const searchData = {
      user_id: this.user_id
    }

    this.userTestService.GetEvaluation(searchData, this.user_test_id).
      then(({ test, score, clasification ,evaluated_user_name}) => {
       
        this.names=evaluated_user_name;
        this.score = score;
        this.clasification = clasification;
        this.test = test;
        this.modules = test.test_modules;
        this.loading = false;
      })
      .catch(({ title, message, code }) => {

        this.loading = false;

        this.system_message.error(title + message);
     
      });
  }

  redirectToPage() {
    this.router.navigate(['/dashboard/exam/adminPld']);
  }
}
