import { PLDExamComponent } from './../PLDExam/PLDExam.component';
import { PLDComponent } from './../PLD/PLD.component';
import { SidenavComponent } from '../../../sidenav/sidenav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { EvaluationsComponent } from '../evaluations/evaluations.component';
import{LogOutComponent} from "../logOut/logOut.component";

import { SurveyComponent } from '../desempeño/desempeño.component';;
import { AdminPldComponent } from '../PLD/adminPld/adminPld.component';
import { PldFormComponent } from '../PLD/adminPld/pldForm/pldForm.component';
import { PLDRoutingModule } from '../PLD/PLD-routing.module';
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
        loadChildren: () => import('../PLD/PLD.module').then(m => m.PLDModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SideNavRoutingModule {}
