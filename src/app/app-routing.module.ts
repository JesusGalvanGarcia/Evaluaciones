import { SurveyComponent } from './views/Evaluation/Desempeño/desempeño/desempeño.component';
import { HomeComponent } from './views/app/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './views/app/sidenav/sidenav.component';
import { PlanComponent } from './views/Evaluation/plan/plan.component';
import { ActionPlan360Component } from './views/Evaluation/Evaluation360/action-plan/action-plan.component';
import { ActionPlanComponent } from './views/Evaluation/action-plan/action-plan.component';

import { UserTestComponent } from './views/Evaluation/user-test/user-test.component';
import { UserExamComponent } from './views/PLD/user-exam/user-exam.component';
import { UserAsesorComponent } from './views/Evaluation/Asesores/user-asesor/user-asesor.component';

import { AuthGuardService } from '@http/auth-guard.service';
const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/app/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    component: SidenavComponent,
    loadChildren: () => import('./views/app/sidenav/sidenav.module').then(m => m.SideNavModule),

  },

  {
    path: 'planFirma/:id/:firm',
    loadComponent: () => import('./views/Evaluation/planForm/planForm.component').then(m => m.PlanFormComponent)
  },
  {
    path: 'desempeño/:user_test_id',
    loadComponent: () => import('./views/Evaluation/Desempeño/desempeño/desempeño.component').then(m => m.SurveyComponent)
  },
  {
    path: 'competencias/:user_test_id',
    loadComponent: () => import('./views/Evaluation/Desempeño/competencias/competencias.component').then(m => m.CompetenciasComponent)
  },
  {
    path: 'sendEmail',
    loadComponent: () => import('./views/app/sendEmail/sendEmail.component').then(m => m.SendEmailPasswordComponent)
  },
  {
    path: 'resetPassword/:id',
    loadComponent: () => import('./views/app/resetPassword/resetPassword.component').then(m => m.ResertPasswordComponent)
  },
  { path: 'plan-accion/:user_action_plan_id', component: ActionPlanComponent, data: { routeName: 'Consultar Pagos TP' } },
  { path: 'plan-accion360/:user_action_plan_id', component: ActionPlan360Component, data: { routeName: 'Consultar Pagos TP' } },
  { path: 'prueba/:user_test_id', component: UserTestComponent,     canActivate: [AuthGuardService],
  data: { permission: 'Acceso Administracion asesores' }},
  { path: 'pruebaAsesor/:user_test_id', component: UserAsesorComponent, data: { routeName: 'Consultar Prueba del Usuario' } },

  { path: 'exam/:user_test_id', component: UserExamComponent, data: { routeName: 'Consultar Examen del Usuario' } },

  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
