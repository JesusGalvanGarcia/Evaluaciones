import { SidenavComponent } from '../../../sidenav/sidenav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { EvaluationsComponent } from '../evaluations/evaluations.component';
import { SurveyComponent } from '../desempeño/desempeño.component';;
const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'evaluacion',
        component: EvaluationsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SideNavRoutingModule {}
