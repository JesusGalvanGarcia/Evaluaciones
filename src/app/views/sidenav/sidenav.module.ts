import { SidenavComponent } from '../../../sidenav/sidenav.component'

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SideNavRoutingModule } from './sidenav-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@NgModule({
    declarations: [SidenavComponent],
    imports: [ 
        SideNavRoutingModule,
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
    ],
    exports: [],
    providers: [],
})
export class SideNavModule {}