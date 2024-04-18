import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { CotizadorComponent } from '../cotizador/cotizador.component';
import { ProspectComponent } from '../prospect/prospect.component';
import { AuthGuardService } from '@http/auth-guard.service';
import { AccessKeys } from 'src/app/shared/access-keys';

const routes: Routes = [
    {
        path: '',
        component: CotizadorComponent,
        canActivate: [AuthGuardService],
        data: {
            // key: AccessKeys.GET_COTIZADOR
        }
    },
    {
        path: 'cotizador',
        component: CotizadorComponent,
        canActivate: [AuthGuardService],
        data: {
            // key: AccessKeys.GET_COTIZADOR
        }
    },
    {
        path: 'prospectos',
        loadComponent: () => import('../../views/prospect/prospect.component').then(m => m.ProspectComponent),
        canActivate: [AuthGuardService],
        data: {
            key: AccessKeys.GET_USERS
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
