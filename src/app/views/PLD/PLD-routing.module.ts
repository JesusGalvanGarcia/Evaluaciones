import { UserExamComponent } from './user-exam/user-exam.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PLDComponent } from './PLD.component';
import { AdminPldComponent } from './adminPld/adminPld.component';
import { PldFormComponent } from './adminPld/pldForm/pldForm.component';
import { PLDExamComponent } from './PLDExam/PLDExam.component';
import{AuthGuardService} from '../../shared/http/auth.service';
import {HomeComponent} from '../app/home/home.component';
import{Personal360Component} from '../Evaluation/Evaluation360/personal360/personal360.component';
import{Evaluation360Component} from '../Evaluation/Evaluation360/Evaluation360/Evaluation360.component';
import { EvaluationAsesorComponent } from '../Evaluation/Asesores/EvaluationAsesor/EvaluationAsesor.component';
const routes: Routes = [
   {
        path: '', 
        component: PLDComponent,
       
    },
    {
        path: 'exams/:id/:attempts',
        component: PLDExamComponent,
    },
    {
        path: 'asesors/:id/:attempts',
        component: EvaluationAsesorComponent,
    },
    {
        path: 'adminPld',
        component: AdminPldComponent,
    },

    {
        path: 'adminPld/form/:idPldTest',
        component: PldFormComponent
    },
    {
        path: 'adminPld/form',
        component: PldFormComponent
    },
    {
        path: 'review/:id',
        component: UserExamComponent
    },
    {
        path: 'evaluation350/:id',
        component: Evaluation360Component
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'personal360/:idEvaluation/:idUser',
        component: Personal360Component
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PLDRoutingModule {}
