import { SurveyComponent } from './views/desempeño/desempeño.component';
import { HomeComponent } from './views/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './views/sidenav/sidenav.component';
import { PlanComponent } from './views/plan/plan.component';


const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    redirectTo: 'login'
  },
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
    path: 'plan',
    loadComponent: () => import('./views/planForm/planForm.component').then(m => m.PlanFormComponent)
  },
  {
    path: 'planFirma/:id/:firm',
    loadComponent: () => import('./views/planForm/planForm.component').then(m => m.PlanFormComponent)
  },
  {
    path: 'desempeño/:name',
    loadComponent: () => import('./views/desempeño/desempeño.component').then(m => m.SurveyComponent)
  },
  {
    path: 'competencias/:name',
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
