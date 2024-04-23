import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajeService } from '@http/mensaje.service';
import { UserTestService } from '@services/Evaluations/Desempeño/userTest.service';

@Component({
  selector: 'app-user-test',
  templateUrl: './user-test.component.html',
  styleUrls: ['./user-test.component.scss']
})
export class UserTest360Component {

  user_id: number = 0;
  user_test_id: number = 0;
  loading: boolean = true;

  // Tabs
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  modules: any;
  test: any;
  name:string;
  score: any;
  clasification: any;
  strengths:any;
  suggestions:any;
  chance:any;
  constructor(
    private userTestService: UserTestService,
    private route: ActivatedRoute,
    public system_message: MensajeService,
    private router: Router
  ) {

    this.user_id = Number(localStorage.getItem('user_id')!);
    this.route.params.subscribe(params => {
      this.user_test_id = params['user_test_id'];
    });

    this.getUserTest();
  }

  getUserTest() {

    const searchData = {
      user_id: this.user_id
    }

    this.userTestService.GetEvaluation(searchData, this.user_test_id).
      then(({ test, score, clasification,user_test,evaluated_user_name }) => {

        this.score = score;
        this.clasification = clasification;
        this.test = test;
        this.modules = test.test_modules;
        this.loading = false;
        this.name=evaluated_user_name;
        this.strengths=user_test.strengths;
        this.suggestions=user_test.suggestions;
        this.chance=user_test.chance;

      })
      .catch(({ title, message, code }) => {

        this.loading = false;

        this.system_message.error(title + message);
     
      });
  }

  redirectToPage() {
    this.router.navigate(['/dashboard/home']);
  }
}
