import { UserExamComponent } from './../user-exam/user-exam.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PLDComponent } from './PLD.component';
import { AdminPldComponent } from './adminPld/adminPld.component';
import { PldFormComponent } from './adminPld/pldForm/pldForm.component';
import { PLDExamComponent } from '../PLDExam/PLDExam.component';
import{AuthGuardService} from '../../shared/http/auth.service';
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
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PLDRoutingModule {}
