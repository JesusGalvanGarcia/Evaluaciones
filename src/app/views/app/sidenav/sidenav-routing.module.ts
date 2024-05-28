import { AsesoresComponent } from '../../Evaluation/Asesores/asesores/asesores.component';
import { EvaluationAdminComponent } from '../../Evaluation/EvaluationAdmin/EvaluationAdmin.component';
import { PLDExamComponent } from '../../PLD/PLDExam/PLDExam.component';
import { PLDComponent } from '../../PLD/PLD.component';
import { SidenavComponent } from '../../../../sidenav/sidenav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { EvaluationsComponent } from '../../Evaluation/evaluations/evaluations.component';
import { LogOutComponent } from "../logOut/logOut.component";
import { Index360Component } from '../../Evaluation/Evaluation360/index360/index360.component';
import { SurveyComponent } from '../../Evaluation/Desempeño/desempeño/desempeño.component';;
import { AdminPldComponent } from '../../PLD/adminPld/adminPld.component';
import { PldFormComponent } from '../../PLD/adminPld/pldForm/pldForm.component';
import { PLDRoutingModule } from '../../PLD/PLD-routing.module';
import { Admin360Component } from '../../Evaluation/Evaluation360/Admin360/Admin360.component';
import { UsersComponent } from '../../Evaluation/Evaluation360/users/users.component';
import { AdminAsesoresComponent } from '../../Evaluation/Asesores/AdminAsesores/AdminAsesores.component';
import { UserAsesorsComponent } from '../../Evaluation/Asesores/user-asesors/user-asesors.component';
import { Users360Component } from '../../Evaluation/Evaluation360/users360/users360.component';
import { CoursesComponent } from '../../iSpring/courses/courses.component';
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
        path: 'evaluacion360',
        component: Index360Component
    },
    {
        path: 'users360/:idEvaluation', //me equivoque, son  clientes  internos
        component: UsersComponent
    },
    {
        path: 'asesoresUsers/:idEvaluation',
        component: UserAsesorsComponent
    },
    {
        path: '360Users/:idEvaluation',
        component: Users360Component
    },
    {
        path: 'asesores',
        component: AsesoresComponent
    },
    {
        path: 'admin360',
        component: Admin360Component
    },
    {
        path: 'asesoresAdmin',
        component: AdminAsesoresComponent
    },
    {
        path: 'logout',
        component: LogOutComponent
    },
    {
        path: 'adminEvaluations',
        component: EvaluationAdminComponent
    },
    {
        path: 'exam',
        loadChildren: () => import('../../PLD/PLD.module').then(m => m.PLDModule)
    },
  { path: 'iSpring/cursos', component: CoursesComponent, data: { routeName: 'Consultar Cursos de iSrping' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SideNavRoutingModule { }
