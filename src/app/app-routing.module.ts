import { SurveyComponent } from './views/desempeño/desempeño.component';
import { HomeComponent } from './views/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './views/sidenav/sidenav.component';
import { PlanComponent } from './views/plan/plan.component';
import { ActionPlanComponent } from './views/action-plan/action-plan.component';
import { UserTestComponent } from './views/user-test/user-test.component';
import { UserExamComponent } from './views/user-exam/user-exam.component';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    component: SidenavComponent,
    loadChildren: () => import('./views/sidenav/sidenav.module').then(m => m.SideNavModule),

  },

  {
    path: 'planFirma/:id/:firm',
    loadComponent: () => import('./views/planForm/planForm.component').then(m => m.PlanFormComponent)
  },
  {
    path: 'desempeño/:user_test_id',
    loadComponent: () => import('./views/desempeño/desempeño.component').then(m => m.SurveyComponent)
  },
  {
    path: 'competencias/:user_test_id',
    loadComponent: () => import('./views/competencias/competencias.component').then(m => m.CompetenciasComponent)
  },
  {
    path: 'sendEmail',
    loadComponent: () => import('./views/sendEmail/sendEmail.component').then(m => m.SendEmailPasswordComponent)
  },
  {
    path: 'resetPassword/:id',
    loadComponent: () => import('./views/resetPassword/resetPassword.component').then(m => m.ResertPasswordComponent)
  },

  { path: 'plan-accion/:user_action_plan_id', component: ActionPlanComponent, data: { routeName: 'Consultar Pagos TP' } },
  { path: 'prueba/:user_test_id', component: UserTestComponent, data: { routeName: 'Consultar Prueba del Usuario' } },
  { path: 'exam/:user_test_id', component: UserExamComponent, data: { routeName: 'Consultar Examen del Usuario' } },

  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
