import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutRoutingModule } from './layout-routing.module';
import { UserService } from '@services/user.service';

@NgModule({
    declarations: [LayoutComponent],
    imports: [ 
        LayoutRoutingModule,
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
    ],
    exports: [],
    providers: [ UserService ],
})
export class LayoutModule {}