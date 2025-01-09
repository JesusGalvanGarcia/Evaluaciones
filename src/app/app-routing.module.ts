import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App components
import { HomeComponent } from './views/app/home/home.component';
import { LogOutComponent } from './views/app/logOut/logOut.component';

// Evaluation components
import { PlanComponent } from './views/Evaluation/plan/plan.component';
import { ActionPlan360Component } from './views/Evaluation/Evaluation360/action-plan/action-plan.component';
import { ActionPlanComponent } from './views/Evaluation/action-plan/action-plan.component';
import { UserTestComponent } from './views/Evaluation/Desempeño/user-test/user-test.component';
import { UserAsesorComponent } from './views/Evaluation/Asesores/user-asesor/user-asesor.component';
import { UserTest360Component } from './views/Evaluation/Evaluation360/user-test/user-test.component';
import { AsesoresComponent } from './views/Evaluation/Asesores/asesores/asesores.component';
import { EvaluationAdminComponent } from './views/Evaluation/EvaluationAdmin/EvaluationAdmin.component';
import { EvaluationsComponent } from './views/Evaluation/evaluations/evaluations.component';
import { Index360Component } from './views/Evaluation/Evaluation360/index360/index360.component';
import { SurveyComponent } from './views/Evaluation/Desempeño/desempeño/desempeño.component';
import { Admin360Component } from './views/Evaluation/Evaluation360/Admin360/Admin360.component';
import { UsersComponent } from './views/Evaluation/Evaluation360/users/users.component';
import { AdminAsesoresComponent } from './views/Evaluation/Asesores/AdminAsesores/AdminAsesores.component';
import { UserAsesorsComponent } from './views/Evaluation/Asesores/user-asesors/user-asesors.component';
import { Users360Component } from './views/Evaluation/Evaluation360/users360/users360.component';
import { Personal360Component } from './views/Evaluation/Evaluation360/personal360/personal360.component';
import { Evaluation360Component } from './views/Evaluation/Evaluation360/Evaluation360/Evaluation360.component';
import { EvaluationAsesorComponent } from './views/Evaluation/Asesores/EvaluationAsesor/EvaluationAsesor.component';
import { Curso1Component } from './views/cursos/curso1/curso1.component';
// PLD components
import { PLDComponent } from './views/PLD/PLD.component';
import { PLDExamComponent } from './views/PLD/PLDExam/PLDExam.component';
import { AdminPldComponent } from './views/PLD/adminPld/adminPld.component';
import { PldFormComponent } from './views/PLD/adminPld/pldForm/pldForm.component';
import { UserExamComponent } from './views/PLD/user-exam/user-exam.component';
import { LoginComponent } from './views/app/login/login.component';
// Auth service
import { AuthGuardService } from '@http/auth-guard.service';
import { AuthSecondGuardService } from '@http/auths-guard.service'

import {ActionPlanAsesorComponent} from './views/Evaluation/Asesores/action-plan/action-plan.component';
const routes: Routes = [
    // App routes
    { path: 'login', loadComponent: () => import('./views/app/login/login.component').then(m => m.LoginComponent) },
    { path: 'example', loadComponent: () => import('./views/cursos/curso1/curso1.component').then(m => m.Curso1Component) },
    { path: 'home', component: HomeComponent },
    { path: 'sendEmail', loadComponent: () => import('./views/app/sendEmail/sendEmail.component').then(m => m.SendEmailPasswordComponent) },
    { path: 'resetPassword/:id', loadComponent: () => import('./views/app/resetPassword/resetPassword.component').then(m => m.ResertPasswordComponent) },
    { path: 'logout', component: LogOutComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    // Desempeño and competencias
    { path: 'planFirma/:id/:firm', loadComponent: () => import('./views/Evaluation/planForm/planForm.component').then(m => m.PlanFormComponent) },
    { path: 'desempeño/:user_test_id', canActivate: [AuthGuardService], loadComponent: () => import('./views/Evaluation/Desempeño/desempeño/desempeño.component').then(m => m.SurveyComponent), data: { permission: 'Permiso para consultar evaluacion desempeño' } },
    { path: 'evaluacion', component: EvaluationsComponent, canActivate: [AuthGuardService], data: { permission: 'Acceso a evaluacion de desempeño' } },
    { path: 'competencias/:user_test_id', loadComponent: () => import('./views/Evaluation/Desempeño/competencias/competencias.component').then(m => m.CompetenciasComponent), data: { permission: 'Permiso para consultar evaluacion desempeño' } },
    { path: 'plan-accion/:user_action_plan_id', component: ActionPlanComponent, data: { routeName: 'Consultar Pagos TP' } },
    { path: 'prueba/:user_test_id', component: UserTestComponent, canActivate: [AuthGuardService], data: { permission: 'Permiso para consultarlos resultados desempeño' } },

    // Routes 360
    { path: 'plan-accion360/:user_action_plan_id', component: ActionPlan360Component, data: { routeName: 'Consultar Pagos TP' } },
    { path: 'prueba360/:user_test_id', component: UserTest360Component, canActivate: [AuthGuardService], data: { permission: 'Permiso para consultar resultados 360' } },
    { path: 'evaluacion360', component: Index360Component, canActivate: [AuthGuardService], data: { permission: 'Acceso a evaluacion 360' } },
    { path: '360Users/:idEvaluation', component: Users360Component, canActivate: [AuthGuardService], data: { permission: 'Permiso para asignar colaboradores 360' } },
    { path: 'users360/:idEvaluation', component: UsersComponent, canActivate: [AuthGuardService], data: { permission: 'Permiso para asignar clientes internos 360' } },
    { path: 'admin360', component: Admin360Component, canActivate: [AuthGuardService], data: { permission: 'Acceso Administracion 360' } },
    { path: 'evaluation360/:id/:status', component: Evaluation360Component, data: { permission: 'Permiso para consultar la evaluacion 360' } },
    { path: 'personal360/:idEvaluation/:idUser', component: Personal360Component, canActivate: [AuthSecondGuardService], data: { permission: 'Permiso para ver mi reporte 360' } },

    // Routes PLD
    { path: 'exam/:user_test_id', component: UserExamComponent, data: { routeName: 'Consultar Examen del Usuario' } },
    { path: 'adminPld', component: AdminPldComponent, canActivate: [AuthGuardService], data: { permission: 'Acceso Administracion PLD' } },
    { path: 'adminPld/form/:idPldTest', component: PldFormComponent, canActivate: [AuthGuardService], data: { permission: 'Permiso para editar examenes PLD' } },
    { path: 'adminPld/form', component: PldFormComponent, canActivate: [AuthGuardService], data: { permission: 'Permiso para agregar examenes PLD' } },
    { path: 'review/:id', component: UserExamComponent, canActivate: [AuthGuardService], data: { permission: 'Permiso para ver detalle de examen PLD' } },
    { path: 'exam', component: PLDComponent, canActivate: [AuthGuardService], data: { permission: 'Acceso a examen PLD' } },
    { path: 'exams/:id/:attempts', component: PLDExamComponent, data: { permission: 'Permiso para contestar examen PLD' } },

    // Routes Asesores
    { path: 'asesoresUsers/:idEvaluation', component: UserAsesorsComponent, canActivate: [AuthGuardService], data: { permission: 'Acceso Administracion asesores' } },
    { path: 'pruebaAsesor/:user_test_id', component: UserAsesorComponent, data: { routeName: 'Consultar Prueba del Usuario' } },
    { path: 'asesores', component: AsesoresComponent, canActivate: [AuthGuardService], data: { permission: 'Acceso a evaluacion de Asesores' } },
    { path: 'asesoresAdmin', component: AdminAsesoresComponent, canActivate: [AuthGuardService], data: { permission: 'Acceso Administracion asesores' } },
    { path: 'asesors/:id/:attempts', component: EvaluationAsesorComponent, data: { permission: 'Acceso a examen PLD' } }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
