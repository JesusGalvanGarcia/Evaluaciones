
import { AsesoresComponent } from '../../Evaluation/Asesores/asesores/asesores.component';
import { EvaluationAdminComponent } from '../../Evaluation/EvaluationAdmin/EvaluationAdmin.component';
import { PLDExamComponent } from '../../PLD/PLDExam/PLDExam.component';
import { PLDComponent } from '../../PLD/PLD.component';
import { SidenavComponent } from '../../../../sidenav/sidenav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { EvaluationsComponent } from '../../Evaluation/evaluations/evaluations.component';
import{LogOutComponent} from "../logOut/logOut.component";
import { Index360Component } from '../../Evaluation/Evaluation360/index360/index360.component';
import { SurveyComponent } from '../../Evaluation/Desempeño/desempeño/desempeño.component';;
import { AdminPldComponent } from '../../PLD/adminPld/adminPld.component';
import { PldFormComponent } from '../../PLD/adminPld/pldForm/pldForm.component';
import { PLDRoutingModule } from '../../PLD/PLD-routing.module';
import { Admin360Component } from '../../Evaluation/Evaluation360/Admin360/Admin360.component';
import { UsersComponent } from '../../Evaluation/Evaluation360/users/users.component';
import { AdminAsesoresComponent } from '../../Evaluation/Asesores/AdminAsesores/AdminAsesores.component';
import { UserAsesorsComponent } from '../../Evaluation/Asesores/user-asesors/user-asesors.component';
import {Users360Component} from '../../Evaluation/Evaluation360/users360/users360.component';
import { UserExamComponent } from '../../PLD/user-exam/user-exam.component';

import{Personal360Component} from '../../Evaluation/Evaluation360/personal360/personal360.component';
import{Evaluation360Component} from '../../Evaluation/Evaluation360/Evaluation360/Evaluation360.component';
import { EvaluationAsesorComponent } from '../../Evaluation/Asesores/EvaluationAsesor/EvaluationAsesor.component';
import { AuthGuardService } from '@http/auth-guard.service';
const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'evaluacion',
        component: EvaluationsComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso a evaluacion de desempeño' }
    },
    {
        path: 'evaluacion360',
        component: Index360Component,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso a evaluacion 360' }
    },
    {
        path: 'users360/:idEvaluation', //me equivoque, son  clientes  internos
        component: UsersComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso Administracion 360' }
    },
    {
        path: 'asesoresUsers/:idEvaluation', 
        component: UserAsesorsComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso Administracion asesores' }
    },
    {
        path: '360Users/:idEvaluation', 
        component: Users360Component,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso Administracion 360' }
    },
    {
        path: 'adminPld',
        component: AdminPldComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso Administracion PLD' }
     
    },
    {
        path: 'asesores',
        component: AsesoresComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso a evaluacion de Asesores' }
    },
    {
        path: 'admin360',
        component: Admin360Component,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso Administracion 360' }
    },
    {
        path: 'asesoresAdmin',
        component: AdminAsesoresComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso Administracion asesores' }
    },
    {
        path: 'logout',
        component: LogOutComponent
    },
    {
        path: 'exam',
        component: PLDComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso a examen PLD' }
    },
    {
        path: 'exams/:id/:attempts',
        component: PLDExamComponent,
        data: { permission: 'Permiso para contestar examen PLD' }
    },
    {
        path: 'asesors/:id/:attempts',
        component: EvaluationAsesorComponent,
        data: { permission: 'Acceso a examen PLD' }
        
    },
    {
        path: 'adminPld',
        component: AdminPldComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Acceso Administracion PLD' }
     
    },

    {
        path: 'adminPld/form/:idPldTest',
        component: PldFormComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Permiso para editar examenes PLD' }
    },
    {
        path: 'adminPld/form',
        component: PldFormComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Permiso para agregar examenes PLD' }
    },
    {
        path: 'review/:id',
        component: UserExamComponent,
        canActivate: [AuthGuardService],
        data: { permission: 'Permiso para ver detalle de examen PLD' }
    },
    {
        path: 'evaluation350/:id',
        component: Evaluation360Component,
        data: { permission: 'Permiso para consultar la evaluacion 360' }
    },

    {
        path: 'personal360/:idEvaluation/:idUser',
        component: Personal360Component,
        data: { permission: 'Permiso para ver mi reporte 360' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SideNavRoutingModule {}
