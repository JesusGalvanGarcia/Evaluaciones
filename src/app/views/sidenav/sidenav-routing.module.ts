import { PLDExamComponent } from './../PLDExam/PLDExam.component';
import { PLDComponent } from './../PLD/PLD.component';
import { SidenavComponent } from '../../../sidenav/sidenav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { EvaluationsComponent } from '../evaluations/evaluations.component';
import{LogOutComponent} from "../logOut/logOut.component";

import { SurveyComponent } from '../desempeño/desempeño.component';;
const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'evaluacion',
        component: EvaluationsComponent
    },
    {
        path: 'logout',
        component: LogOutComponent
    },
    {
        path: 'exam',
        component: PLDComponent
    },
    {
        path: 'exams/:id/:attempts',
        component: PLDExamComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SideNavRoutingModule {}
